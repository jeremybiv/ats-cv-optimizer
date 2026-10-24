/**
 * cvLLMExtract.js — Repli LLM quand le parsing déterministe n'est pas fiable.
 *
 * ARCHITECTURE (option C : hybride)
 * ---------------------------------
 *   1. Parsing déterministe (gratuit, instantané)         ← toujours tenté
 *   2. Score de confiance                                 ← cvConfidence.js
 *   3. Si score < 60 → CETTE extraction LLM               ← seulement ici
 *   4. Validation du schéma, réparation des champs
 *
 * Le déterministe traite la majorité des CV sans coût. Le LLM ne sert que de
 * filet pour les mises en page qu'aucune regex ne couvre : LaTeX deux colonnes,
 * tableaux, designs Canva/InDesign.
 *
 * Pourquoi le LLM marche là où les regex échouent : il comprend le SENS. Il sait
 * que « ◦ Research Assistant » est un poste (puce + intitulé de fonction) et que
 * « Machine Learning: Research on… » est une ligne de description, là où une
 * regex ne voit que deux chaînes de caractères entre deux dates.
 *
 * COÛT : ~0,0003 €/CV en gemini-3.1-flash-lite, et zéro jusqu'à 1 500 req/jour.
 * Avec un seuil à 60, seuls ~20 % des CV déclenchent l'appel.
 */

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent';

const MODELE = process.env.GEMINI_VISION_MODEL || 'gemini-3.1-flash-lite';
const MODELES_REPLI = ['gemini-flash-lite-latest', 'gemini-3-flash-preview'];

/** Le schéma exigé du LLM — identique à celui du parseur déterministe. */
const SCHEMA_PROMPT = `Tu extrais les données d'un CV. Réponds UNIQUEMENT en JSON valide, sans texte autour.

Schéma exact :
{
  "name": "Prénom Nom",
  "email": "adresse@exemple.com ou null",
  "phone": "numéro ou null",
  "summary": "résumé professionnel si présent, sinon null",
  "experience": [
    {
      "title": "intitulé du POSTE (jamais une description de mission)",
      "company": "nom de l'ENTREPRISE",
      "dates": "ex. 2020 - present",
      "description": ["puces de mission"]
    }
  ],
  "education": [
    { "degree": "diplôme", "institution": "école/université", "dates": "ex. 2018 - 2020" }
  ],
  "skills": ["compétence 1", "compétence 2"],
  "certifications": ["certification"],
  "languages": ["langue"]
}

RÈGLES STRICTES :
- "title" = le poste, JAMAIS une phrase de description. Si la ligne commence par une puce (•, ◦, -, →) c'est souvent le poste dans les CV LaTeX.
- Les langages de programmation (Python, SQL, C++…) vont dans "skills", JAMAIS dans "languages".
- "languages" = langues parlées uniquement (français, anglais, hindi…).
- N'invente RIEN. Un champ absent vaut null, un tableau absent vaut [].
- Conserve la casse et les accents du CV.`;

/**
 * Nettoie la réponse du LLM : certains modèles entourent le JSON de ```json.
 */
function parserReponse(texte) {
  if (!texte) return null;
  let t = texte.trim();
  // Retirer les clôtures markdown
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/,'');
  // Isoler le premier objet JSON
  const debut = t.indexOf('{');
  const fin = t.lastIndexOf('}');
  if (debut === -1 || fin === -1) return null;
  try {
    return JSON.parse(t.slice(debut, fin + 1));
  } catch {
    return null;
  }
}

/**
 * Normalise et répare la sortie du LLM pour qu'elle respecte le schéma.
 * Un LLM qui renvoie une chaîne là où on attend un tableau casserait tout
 * le pipeline en aval : on répare ici plutôt que de laisser passer.
 */
function reparer(brut) {
  if (!brut || typeof brut !== 'object') return null;
  const texte = (v) => (typeof v === 'string' ? v.trim() : null);
  const liste = (v) => {
    if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
    if (typeof v === 'string' && v.trim()) return v.split(/\s*[,;]\s*/).filter(Boolean);
    return [];
  };

  const experience = (Array.isArray(brut.experience) ? brut.experience : []).map((e) => ({
    title: texte(e && e.title) || '',
    company: texte(e && e.company) || '',
    dates: texte(e && e.dates) || '',
    description: liste(e && e.description),
  }));

  const education = (Array.isArray(brut.education) ? brut.education : []).map((e) => ({
    degree: texte(e && e.degree) || '',
    institution: texte(e && e.institution) || '',
    dates: texte(e && e.dates) || '',
    description: [],
  }));

  return {
    name: texte(brut.name) || '',
    email: texte(brut.email) || '',
    phone: texte(brut.phone) || '',
    summary: texte(brut.summary) || '',
    experience,
    education,
    skills: liste(brut.skills),
    certifications: liste(brut.certifications),
    languages: liste(brut.languages),
    _source: 'llm',
  };
}

async function appeler(cle, modele, prompt, texteCV) {
  const url = GEMINI_URL.replace('{model}', modele);
  const res = await fetch(`${url}?key=${cle}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${prompt}\n\n=== TEXTE DU CV ===\n${texteCV}` }] }],
      generationConfig: {
        temperature: 0,          // déterminisme : même CV → même JSON
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
    }),
  });
  if (!res.ok) {
    const corps = await res.text().catch(() => '');
    const err = new Error(`HTTP ${res.status} ${corps.slice(0, 120)}`);
    err.statut = res.status;
    throw err;
  }
  const data = await res.json();
  const t = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return parserReponse(t);
}

/**
 * Extrait les données d'un CV via LLM.
 *
 * @param {string} texteCV  Texte brut du CV (déjà extrait du PDF)
 * @returns {Promise<object|null>}  CV structuré, ou null si échec
 */
async function extraireAvecLLM(texteCV) {
  const cle = process.env.GEMINI_API_KEY;
  if (!cle) {
    console.warn('[cvLLM] GEMINI_API_KEY absente — repli LLM indisponible');
    return null;
  }
  // Un CV de 20 000 caractères coûte peu mais n'apporte rien au-delà.
  const texte = String(texteCV || '').slice(0, 20000);
  if (texte.trim().length < 50) return null;

  for (const modele of [MODELE, ...MODELES_REPLI]) {
    try {
      const brut = await appeler(cle, modele, SCHEMA_PROMPT, texte);
      const cv = reparer(brut);
      if (cv && (cv.name || cv.experience.length)) {
        cv._modele = modele;
        return cv;
      }
    } catch (e) {
      // 404 = modèle retiré pour les nouveaux comptes (arrivé le 24/10 avec
      // gemini-2.5-*), 429 = quota. On tente le suivant sans bruit.
      if (e.statut !== 404 && e.statut !== 429) {
        console.warn(`[cvLLM] ${modele} : ${e.message}`);
      }
    }
  }
  return null;
}

module.exports = { extraireAvecLLM, reparer, parserReponse, SCHEMA_PROMPT };
