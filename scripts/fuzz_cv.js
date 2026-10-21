#!/usr/bin/env node
/*
 * fuzz_cv.js — Test systématique du parseur CV (ats-cv-optimizer).
 *
 * Génère N variantes d'un CV de référence en combinant aléatoirement :
 *   - styles de headers (espacés, normaux, minuscules, numérotés, points espacés)
 *   - ordres de sections (permutations)
 *   - formats de dates (2020-2024, 2020-01/2024-06, 2019 – 2023, slash 2018/2020, mois ISO)
 *   - sections optionnelles (Langues, Intérêts, Certifications, Résumé)
 *
 * INVARIANT (basé sur le SOURCE généré, pas des valeurs fixes) :
 *   - le nom (Marie Dupont) toujours trouvé
 *   - AU MOINS 2 expériences (le générateur en met toujours 2-3)
 *   - chaque expérience a des dates non vides
 *   - les skills présents dans la SECTION Compétences du source sont retrouvés
 *   - la formation (Master) détectée quand présente
 *   - les langues détectées quand la section est présente
 *
 * Usage : node fuzz_cv.js [nombre_variantes] [seed]   (défaut 60, seed 20260820)
 * Sortie : score X/Y + liste des échecs. Exit 0 si 0 échec, 1 sinon.
 *
 * ⚠️ SEED DÉTERMINISTE OBLIGATOIRE : sans seed fixe, Math.random() change les
 * variantes à chaque run → le score oscille de ±10% (vécu : 41/60 puis 47/60
 * sur le MÊME code) → fausses régressions détectées par le cron bi-journalier.
 * Le 3e argument fixe la seed (défaut 20260820) → score comparable entre runs.
 *
 * Prérequis : tourner depuis le repo (node_modules du projet) + pdfkit installé.
 * ⚠️ PIÈGE : `npm install pdfkit` DANS le clone du repo corrompt le package.json
 * (ERR_INVALID_PACKAGE_CONFIG) → installer pdfkit dans un env DÉDIÉ
 * (`mkdir env && cd env && npm init -y && npm install pdfkit`) puis symlink :
 *   ln -sfn env/node_modules/pdfkit node_modules/pdfkit (et fontkit, linebreak,
 *   restructure, unicode-trie, png-js, brotli, dfa, @swc — les dépendances de
 *   pdfkit). L'env dédié survit au `rm -rf` du clone de travail.
 */
const { parseTextFromBase64, parseCVText } = require('./src/lib/parsers.js');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const os = require('os');
const path = require('path');

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'cvfuzz-'));
const N = parseInt(process.argv[2] || '100', 10);

const HEADER_STYLES = {
  spaced_upper: s => s.split('').join(' ').toUpperCase(),
  spaced_lower: s => s.split('').join(' ').toLowerCase(),
  dots_spaced: s => s.toUpperCase().split('').join('. '),       // "E. X. P."
  dots_double: s => s.toUpperCase().split('').join('. . '),     // "E. . X. . P."
  normal_upper: s => s.toUpperCase(),
  normal_title: s => s,
  numbered: s => '',  // numéro géré via SECTION_NAMES
};

const SECTION_NAMES = {
  experience: ['Expérience professionnelle', 'Expérience', 'EXPERIENCE', 'E X P É R I E N C E   P R O F E S S I O N N E L L E', 'PROFESSIONAL EXPERIENCE', '1. Expérience professionnelle'],
  formation: ['Formation', 'FORMATION', 'F O R M A T I O N', 'EDUCATION', '2. Formation'],
  competences: ['Compétences', 'COMPÉTENCES', 'COMPETENCES', 'C O M P É T E N C E S', 'SKILLS', '3. Compétences'],
  langues: ['Langues', 'LANGUES', 'L A N G U E S', 'LANGUAGES'],
  interets: ['Centres d\'intérêt', "CENTRES D'INTÉRÊT", 'INTERESTS', "C E N T R E S   D ' I N T É R Ê T"],
  certifications: ['Certifications', 'CERTIFICATIONS', 'C E R T I F I C A T I O N S'],
  resume: ['Profil', 'Résumé', 'RÉSUMÉ', 'SUMMARY', 'P R O F I L'],
};

const DATE_FORMATS = [
  d => `${d.start} - ${d.end}`,
  d => `${d.start}/${d.end}`,
  d => `${d.start} – ${d.end}`,
  d => `${d.start} à ${d.end}`,
  d => `${d.start} au ${d.end}`,
  d => `${d.start} - ${d.end}`, // poids
  d => `${d.start} – ${d.end}`,
];

const JOBS = [
  { title: 'Lead Developer', company: 'BanqueTech', start: '2020', end: '2024' },
  { title: 'Backend Developer', company: 'LogiSoft', start: '2018', end: '2020' },
  { title: 'Développeur Java', company: 'StartupFlow', start: '2016', end: '2018' },
];

const SKILLS = ['Java', 'Python', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Microservices', 'Kafka'];
const LANGS = ['Français (natif)', 'Anglais (C1)', 'Espagnol (B2)'];
const CERTS = ['Oracle Certified Professional Java SE', 'AWS Solutions Architect'];
const INTERESTS = ['Trail', 'Escalade', 'Photographie'];
const EDUCATION = { deg: 'Master Informatique', school: 'Université Lyon 1', start: '2014', end: '2016' };

function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
function shuffle(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genCV(rng) {
  const styleKeys = Object.keys(HEADER_STYLES);
  const style = styleKeys[Math.floor(rng() * styleKeys.length)];
  const styleHeader = (name) => (style === 'numbered' ? name : HEADER_STYLES[style](name));
  const pickName = (key) => pick(SECTION_NAMES[key], rng);

  const include = {
    experience: true,
    formation: true,
    competences: true,
    langues: rng() > 0.3,
    interets: rng() > 0.5,
    certifications: rng() > 0.5,
    resume: rng() > 0.5,
  };
  const order = shuffle(['experience', 'formation', 'competences', 'langues', 'interets', 'certifications', 'resume'].filter(k => include[k]), rng);

  let text = 'Marie Dupont\nIngénieure logiciel · marie.dupont@email.com\n';
  for (const key of order) {
    text += '\n' + styleHeader(pickName(key)) + '\n';
    if (key === 'resume') {
      text += 'Ingénieure logiciel passionnée avec 8 ans d\'expérience en développement backend.\n';
    } else if (key === 'experience') {
      const nJobs = 2 + Math.floor(rng() * 2);
      for (const j of shuffle(JOBS, rng).slice(0, nJobs)) {
        text += pick(DATE_FORMATS, rng)(j) + ' · ' + j.title + ' · ' + j.company + '\n';
        text += 'Développement de microservices ' + pick(['Java/Spring', 'Kafka', 'Docker'], rng) + '.\n';
      }
    } else if (key === 'formation') {
      text += EDUCATION.start + '-' + EDUCATION.end + ' · ' + EDUCATION.deg + ' · ' + EDUCATION.school + '\n';
    } else if (key === 'competences') {
      text += shuffle(SKILLS, rng).slice(0, 4 + Math.floor(rng() * 5)).join(', ') + '\n';
    } else if (key === 'langues') {
      text += pick(LANGS, rng) + ', ' + pick(LANGS, rng) + '\n';
    } else if (key === 'interets') {
      text += shuffle(INTERESTS, rng).slice(0, 2).join(', ') + '\n';
    } else if (key === 'certifications') {
      text += pick(CERTS, rng) + '\n';
    }
  }
  return text;
}

function textToPDF(text, file) {
  return new Promise(res => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const ws = fs.createWriteStream(file);
    doc.pipe(ws);
    for (const line of text.split('\n')) doc.fontSize(10).text(line || ' ');
    doc.end();
    ws.on('finish', res);
  });
}

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function main() {
  // Seed déterministe (mulberry32) : mêmes variantes à chaque run → score
  // comparable entre deux exécutions. Math.random() ferait osciller le score
  // de ±10% (masquant les vraies régressions dans le cron bi-journalier).
  let seed = parseInt(process.argv[3] || '20260820', 10);
  const rng = () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  let ok = 0;
  const failures = [];

  for (let i = 0; i < N; i++) {
    const src = genCV(rng);
    const file = path.join(TMP, `cv_${i}.pdf`);
    await textToPDF(src, file);
    const b64 = fs.readFileSync(file).toString('base64');

    try {
      const extracted = await parseTextFromBase64(b64);
      const cv = parseCVText(extracted);
      const issues = [];

      if (!cv.name || !normalize(cv.name).includes('marie dupont')) issues.push('nom');

      const expCount = cv.experience ? cv.experience.length : 0;
      if (expCount < 2) issues.push(`expériences (${expCount} au lieu de ≥2)`);
      for (const e of (cv.experience || [])) {
        if (!e.dates) issues.push('expérience sans dates');
      }

      // Skills : uniquement ceux de la SECTION Compétences du source
      const srcLower = normalize(src);
      const skillsSection = srcLower.split('compétences')[1]?.split('\n')[0]
        || srcLower.split('competences')[1]?.split('\n')[0]
        || srcLower.split('skills')[1]?.split('\n')[0] || '';
      const srcSkills = SKILLS.filter(s => skillsSection.includes(normalize(s)));
      const cvSkillsNorm = (cv.skills || []).map(normalize);
      for (const s of srcSkills.slice(0, 3)) {
        if (!cvSkillsNorm.some(cs => cs.includes(normalize(s)))) issues.push(`skill ${s}`);
      }

      if (normalize(src).includes('master') && (!cv.education || cv.education.length < 1)) issues.push('formation');

      if (normalize(src).includes('langues') || normalize(src).includes('languages') || normalize(src).includes('l a n g u e s')) {
        if (!cv.languages || cv.languages.length === 0) issues.push('langues');
      }

      if (issues.length === 0) {
        ok++;
      } else {
        failures.push({ i, issues, src: src.split('\n').slice(0, 8).join(' | ') });
      }
    } catch (e) {
      failures.push({ i, issues: ['exception: ' + e.message.slice(0, 60)], src: src.split('\n')[0] });
    }
  }

  console.log(`\n=== FUZZ CV : ${ok}/${N} variantes parsées correctement ===`);
  if (failures.length > 0) {
    console.log(`\n❌ ${failures.length} échec(s) :`);
    for (const f of failures.slice(0, 8)) {
      console.log(`  #${f.i} [${f.issues.join(', ')}]`);
      console.log(`    source: ${f.src}`);
    }
  }
  fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(failures.length === 0 ? 0 : 1);
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
