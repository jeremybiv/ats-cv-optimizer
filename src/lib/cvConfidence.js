/**
 * cvConfidence.js — Score de confiance d'une extraction de CV.
 *
 * PROBLÈME RÉSOLU
 * ---------------
 * Le parseur ne savait pas qu'il échouait. Sur un CV LaTeX deux colonnes il
 * renvoyait :
 *
 *   { title: "Machine Learning: Research on machine learning for portfolio…",
 *     company: "◦ Research Assistant" }
 *
 * … sans aucun signal d'alerte. L'application générait alors un CV à partir de
 * données fausses, et l'utilisateur recevait un score ATS médiocre sans
 * comprendre pourquoi.
 *
 * Une extraction qui se sait fausse est infiniment plus utile qu'une extraction
 * silencieusement fausse : elle permet de déclencher un repli (LLM) ou de
 * demander une correction à l'utilisateur.
 *
 * USAGE
 * -----
 *   const { scorerCV } = require('./cvConfidence');
 *   const { score, manquants, raisons } = scorerCV(cv);
 *   if (score < SEUIL) → repli LLM
 */

const SEUIL_CONFIANCE = 60;

// Un intitulé de poste dépasse rarement 120 caractères. Au-delà, c'est presque
// toujours une phrase de description qui a débordé dans le champ `title` —
// exactement le bug observé sur les CV LaTeX (titre de 94 caractères contenant
// « Research on machine learning for portfolio hedging and replication »).
// 70 et non 120 : sur le CV LaTeX de référence, le titre erroné faisait
// 94 caractères (« Machine Learning: Research on machine learning for portfolio
// hedging and replication ») et passait sous un seuil de 120. Un intitulé de
// poste réel dépasse rarement 70 caractères.
const TITRE_MAX = 70;

/**
 * Détecte une plage de dates inversée (« 2020 - 2018 »).
 * Une inversion signale souvent un découpage qui a mélangé deux expériences.
 */
function datesInversees(dates) {
  if (!dates || typeof dates !== 'string') return false;
  const annee = [...dates.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => parseInt(m[0], 10));
  if (annee.length < 2) return false;
  return annee[0] > annee[annee.length - 1];
}

/**
 * Un titre qui ressemble à une phrase : trop long, ou se termine par un point,
 * ou contient les marqueurs d'une description de mission.
 */
function titreSuspect(titre) {
  if (!titre) return false;
  const t = String(titre).trim();
  if (t.length > TITRE_MAX) return true;
  if (/[.!?]$/.test(t) && t.length > 40) return true;
  // Puces et flèches caractéristiques d'une ligne de description
  if (/^[•◦▪‣→\-–—*]\s/.test(t)) return true;
  // Un intitulé de poste ne contient presque jamais de deux-points suivi d'une
  // phrase (« Machine Learning: Research on machine learning for… »).
  if (t.includes(':') && t.split(/\s+/).length > 6) return true;
  // Plus de 10 mots : c'est une phrase, pas un intitulé
  if (t.split(/\s+/).length > 10) return true;
  return false;
}

/**
 * Une entreprise qui commence par une puce est en réalité un intitulé de poste
 * mal placé — signature des CV LaTeX où « ◦ Research Assistant » est un poste,
 * pas une société.
 */
function entrepriseSuspecte(company) {
  if (!company) return false;
  const c = String(company).trim();
  if (/^[•◦▪‣→*]/.test(c)) return true;
  if (c.length > 60) return true;
  return false;
}

/**
 * Calcule un score de 0 à 100 et la liste de ce qui manque.
 *
 * Les pénalités sont pondérées par l'importance du champ pour un ATS :
 * le nom et les expériences comptent le plus, les langues le moins.
 */
function scorerCV(cv) {
  if (!cv || typeof cv !== 'object') {
    return { score: 0, manquants: ['cv'], raisons: ['aucune donnée extraite'], ok: false };
  }

  let score = 100;
  const manquants = [];
  const raisons = [];
  const penalite = (points, raison, champ) => {
    score -= points;
    raisons.push(`−${points} ${raison}`);
    if (champ) manquants.push(champ);
  };

  // ── Identité (50 points en jeu) ──────────────────────────────────────────
  const nom = (cv.name || '').trim();
  if (!nom) {
    penalite(30, 'nom absent', 'name');
  } else if (nom.length < 2 || nom.length > 60) {
    penalite(10, `nom de longueur suspecte (${nom.length})`, 'name');
  }

  const email = (cv.email || '').trim();
  const tel = (cv.phone || '').trim();
  if (!email && !tel) {
    penalite(20, 'ni email ni téléphone', 'contact');
  } else if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    penalite(8, 'email mal formé', 'email');
  }

  // ── Expériences (le cœur d'un CV) ────────────────────────────────────────
  const exps = Array.isArray(cv.experience) ? cv.experience : [];
  const expsValides = exps.filter(
    (e) => e && (e.title || '').trim().length >= 2 && (e.company || '').trim().length >= 2,
  );
  if (exps.length === 0) {
    penalite(25, 'aucune expérience extraite', 'experience');
  } else if (expsValides.length === 0) {
    penalite(25, `${exps.length} expérience(s) mais aucune avec titre ET entreprise`, 'experience');
  } else if (expsValides.length < exps.length) {
    penalite(8, `${exps.length - expsValides.length} expérience(s) incomplète(s)`, null);
  }

  const titresSuspects = exps.filter((e) => titreSuspect(e && e.title)).length;
  if (titresSuspects > 0) {
    penalite(Math.min(20, titresSuspects * 10), `${titresSuspects} titre(s) ressemblant à une description`, 'experience');
  }

  // Le vrai signal du CV LaTeX : title et company sont INVERSÉS. Une puce dans
  // `company` signifie qu'on a affaire à un intitulé de poste, donc que les
  // deux champs sont décalés — l'extraction est inutilisable en l'état.
  const entreprisesSuspectes = exps.filter((e) => entrepriseSuspecte(e && e.company)).length;
  if (entreprisesSuspectes > 0) {
    penalite(Math.min(25, entreprisesSuspectes * 15),
      `${entreprisesSuspectes} entreprise(s) commençant par une puce (titre/entreprise inversés)`,
      'experience');
  }

  const inv = exps.filter((e) => datesInversees(e && e.dates)).length;
  if (inv > 0) {
    penalite(Math.min(10, inv * 5), `${inv} plage(s) de dates inversée(s)`, null);
  }

  // ── Formations ───────────────────────────────────────────────────────────
  const forms = Array.isArray(cv.education) ? cv.education : [];
  const formsValides = forms.filter((e) => e && (e.degree || '').trim().length >= 2);
  if (forms.length > 0 && formsValides.length === 0) {
    penalite(10, 'formations présentes mais aucun diplôme identifié', 'education');
  }

  // ── Compétences (ce que l'ATS note en priorité) ──────────────────────────
  const skills = Array.isArray(cv.skills) ? cv.skills.filter((s) => String(s).trim()) : [];
  if (skills.length === 0) {
    penalite(15, 'aucune compétence extraite', 'skills');
  } else if (skills.length < 3) {
    penalite(6, `seulement ${skills.length} compétence(s)`, null);
  }

  // ── Langues (pénalité faible : secondaire pour un ATS tech) ──────────────
  const langues = Array.isArray(cv.languages) ? cv.languages.filter((l) => String(l).trim()) : [];
  if (langues.length === 0) {
    penalite(5, 'aucune langue extraite', 'languages');
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    manquants: [...new Set(manquants)],
    raisons,
    ok: score >= SEUIL_CONFIANCE,
  };
}

/**
 * Champs qu'un formulaire de correction doit demander en priorité.
 * Sert à construire l'UI « complète ce qui manque » quand le score reste bas
 * même après le repli LLM.
 */
function champsACorriger(cv, analyse) {
  const labels = {
    name: 'Nom et prénom',
    contact: 'Email ou téléphone',
    email: 'Email',
    experience: 'Expériences professionnelles',
    education: 'Formation',
    skills: 'Compétences',
    languages: 'Langues',
    cv: 'Contenu du CV',
  };
  return (analyse.manquants || []).map((c) => labels[c] || c);
}

module.exports = { scorerCV, champsACorriger, SEUIL_CONFIANCE, TITRE_MAX };
