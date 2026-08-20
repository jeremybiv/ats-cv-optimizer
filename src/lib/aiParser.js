/**
 * Structuration du CV par IA (Claude Haiku).
 *
 * Le parseur regex historique (parseCVText, dans parsers.js) est un
 * automate a etats qui detecte les en-tetes de section via des heuristiques
 * (mots-cles, "ressemble a un titre"...). Sur des mises en page inhabituelles
 * ou une extraction PDF qui garbouille/fusionne le texte, l'automate peut
 * rater un en-tete et rester bloque sur la derniere section reconnue - et
 * comme "Centres d'interet" est tres souvent la derniere section des CV
 * francais, tout ce qui suit (experience, formation, competences...) finit
 * par y etre englouti.
 *
 * Cette fonction remplace cette etape par un appel a Claude (Haiku) qui lit
 * le texte brut et retourne directement le JSON structure attendu, via tool
 * use pour forcer un schema strict. Le parseur regex reste utilise comme
 * filet de securite : voir parseCVSmart() dans parsers.js.
 */
const axios = require('axios');

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

// Meme forme que l'objet retourne par parseCVText() dans parsers.js - a
// garder synchronise avec celui-ci si son schema evolue.
const CV_TOOL = {
  name: 'structurer_cv',
  description:
    "Retourne le contenu d'un CV reparti dans ses sections correctes, en français.",
  input_schema: {
    type: 'object',
    properties: {
      name: { type: 'string', description: 'Nom complet du candidat' },
      email: { type: 'string' },
      phone: { type: 'string' },
      summary: { type: 'string', description: "Résumé / profil professionnel, si present" },
      experience: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            company: { type: 'string' },
            dates: { type: 'string' },
            description: { type: 'array', items: { type: 'string' } },
          },
          required: ['title'],
        },
      },
      education: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            degree: { type: 'string' },
            institution: { type: 'string' },
            dates: { type: 'string' },
            description: { type: 'array', items: { type: 'string' } },
          },
          required: ['degree'],
        },
      },
      skills: { type: 'array', items: { type: 'string' } },
      certifications: { type: 'array', items: { type: 'string' } },
      languages: { type: 'array', items: { type: 'string' } },
      // Uniquement les VRAIS centres d'interet/loisirs personnels - jamais
      // une experience, formation ou competence mal classee.
      interests: { type: 'array', items: { type: 'string' } },
    },
    required: ['experience', 'education', 'skills', 'interests'],
  },
};

function normalizeArray(v) {
  return Array.isArray(v) ? v : [];
}

// Un resultat "degenere" (tout vide sauf interests, ou interests
// anormalement long face a des sections vides) trahit le meme echec que le
// parseur regex essaie d'eviter - autant retomber sur le fallback plutot
// que de faire confiance a une extraction manifestement fausse.
function looksDegenerate(cv) {
  const hasCoreContent =
    cv.experience.length > 0 || cv.education.length > 0 || cv.skills.length > 0;
  const interestsOverloaded = cv.interests.length > 6 || cv.interests.some(i => (i || '').length > 120);
  return !hasCoreContent && (cv.interests.length > 0 || interestsOverloaded);
}

/**
 * @param {string} cvText Texte brut extrait du CV (PDF/DOCX/saisie manuelle)
 * @returns {Promise<object>} objet cv structure (meme forme que parseCVText)
 * @throws si la cle API manque, l'appel echoue, ou le resultat est invalide
 */
async function parseCVWithAI(cvText) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY manquante');
  if (!cvText || !cvText.trim()) throw new Error('cvText vide');

  const response = await axios.post(
    ANTHROPIC_API_URL,
    {
      model: MODEL,
      max_tokens: 4096,
      tools: [CV_TOOL],
      tool_choice: { type: 'tool', name: 'structurer_cv' },
      messages: [
        {
          role: 'user',
          content:
            "Voici le texte brut extrait d'un CV (l'extraction PDF peut avoir " +
            "melange l'ordre des colonnes ou des lignes). Repartis chaque " +
            "information dans la bonne section du CV via l'outil " +
            "structurer_cv. Ne classe en 'interests' (centres d'interet) que " +
            "les vrais loisirs/passions personnels - jamais une experience " +
            "professionnelle, une formation ou une competence technique, " +
            "meme si elle apparait en fin de document ou dans une colonne " +
            "laterale. N'invente aucune information absente du texte.\n\n" +
            'TEXTE DU CV:\n' +
            cvText.slice(0, 12000),
        },
      ],
    },
    {
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    }
  );

  const toolUse = (response.data?.content || []).find(b => b.type === 'tool_use');
  if (!toolUse || !toolUse.input) throw new Error('Reponse IA sans resultat structure');

  const raw = toolUse.input;
  const cv = {
    name: raw.name || '',
    email: raw.email || '',
    phone: raw.phone || '',
    summary: raw.summary || '',
    experience: normalizeArray(raw.experience).map(e => ({
      title: e.title || '',
      company: e.company || '',
      dates: e.dates || '',
      description: normalizeArray(e.description),
    })),
    education: normalizeArray(raw.education).map(e => ({
      degree: e.degree || '',
      institution: e.institution || '',
      dates: e.dates || '',
      description: normalizeArray(e.description),
    })),
    skills: normalizeArray(raw.skills),
    certifications: normalizeArray(raw.certifications),
    languages: normalizeArray(raw.languages),
    interests: normalizeArray(raw.interests),
  };

  if (looksDegenerate(cv)) {
    throw new Error('Resultat IA degenere (tout dans interests) - fallback regex');
  }

  return cv;
}

module.exports = { parseCVWithAI };
