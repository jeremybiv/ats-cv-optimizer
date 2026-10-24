#!/usr/bin/env node
/* Non-régression du parseur : 12 formats historiques doivent rester OK. */
const { parseCVText } = require('../src/lib/parsers.js');

const cas = [
  ['hyphen-years', `Marie Dupont\nmarie@email.com\n\nEXPERIENCE\nLead Dev - BanqueTech (2020-2024)\nArchitecture.\nSenior Dev - DataFlow (2018-2020)\nPython.\n\nFORMATION\nMaster - EPFL (2012-2014)`, { exp: 2, edu: 1 }],
  ['pipe |', `Marie Dupont\nmarie@email.com\n\nEXPERIENCE\nBanqueTech | Lead Developer | 2020-2024\nArchitecture.\nDataFlow | Senior Dev | 2018-2020\nPython.`, { exp: 2 }],
  ['letter-spaced', `Marie Dupont\nmarie@email.com\n\nE X P E R I E N C E\nLead Dev - BanqueTech (2020-2024)\nArchitecture.\nSenior Dev - DataFlow (2018-2020)\nPython.`, { exp: 2 }],
  ['points', `Marie Dupont\nmarie@email.com\n\nE. X. P. É. R. I. E. N. C. E\nLead Dev - BanqueTech (2020-2024)\nArchitecture.`, { exp: 1 }],
  ['anglais', `Marie Dupont\nmarie@email.com\n\nPROFESSIONAL EXPERIENCE\nLead Developer - BanqueTech (2020-2024)\nArchitecture.\n\nEDUCATION\nMaster - EPFL (2012-2014)\n\nSKILLS\nPython, Go`, { exp: 1, edu: 1, skills: 2 }],
  ['pluriel', `Marie Dupont\nmarie@email.com\n\nEXPERIENCES\nLead Dev - BanqueTech (2020-2024)\nArchitecture.\n\nFORMATIONS\nMaster - EPFL (2012-2014)`, { exp: 1, edu: 1 }],
  ['iso months', `Marie Dupont\nmarie@email.com\n\nExpérience\nLead Dev - BanqueTech (2020-01 - 2024-06)\nArchitecture.`, { exp: 1 }],
  ['mois accents', `Marie Dupont\nmarie@email.com\n\nExpérience\nDéveloppeur - StartupFlow (Février 2018 à décembre 2019)\nDev.\nBackend - LogiSoft (Janvier 2020 à présent)\nDev.`, { exp: 2 }],
  ['au', `Marie Dupont\nmarie@email.com\n\nExpérience\nDéveloppeur - StartupFlow (2016 au 2018)\nDev.\nBackend - LogiSoft (2018 au 2020)\nDev.`, { exp: 2 }],
  ['resume + puces', `Marie Dupont\nmarie@email.com\n\nRésumé\nIngénieure logiciel passionnée avec 8 ans d'expérience en développement backend.\n\nExpérience\nLead Dev - BanqueTech (2020-2024)\n- Architecture microservices\n- Mentoring`, { exp: 1, summary: true }],
  ['langues + certifs', `Marie Dupont\nmarie@email.com\n\nCompétences\nPython, Go\n\nLangues\nFrançais, Anglais\n\nCertifications\nAWS Solutions Architect`, { skills: 2, lang: 2, cert: 1 }],
  ['hobbies', `Marie Dupont\nmarie@email.com\n\nExpérience\nLead Dev - BanqueTech (2020-2024)\nDev.\n\nCentres d'intérêt\nEscalade, Photographie`, { exp: 1 }],
  // Issue #88 : CV LaTeX deux colonnes (pdftotext -layout). Le poste est sur
  // la ligne des dates, la société sur la ligne « • Société    Ville » et le
  // projet sur une puce « ◦ » — qui contient un tiret et ne doit PAS devenir
  // une expérience fantôme.
  ['latex 2 colonnes', `Sourabh Bajaj\nsourabh@example.com\n\nExperience\n• Georgia Institute of Technology                    Atlanta, GA\n  Research and Teaching Assistant                    Jan 2012 – Dec 2013\n    ◦ Research Assistant – Machine Learning: Research on portfolio hedging\n      algorithms.\n\nEducation\n• Georgia Institute of Technology                    Atlanta, GA\n  Master of Science in Computer Science; GPA: 4.00   Aug 2012 – Dec 2013\n\nLanguages: English, Hindi\nLanguages and Technologies: C++, Java, Python, SQL`, { exp: 1, edu: 1, skills: 4, lang: 2 }],
  // Les puces « • » de description sans gouttière de colonne ne sont pas des
  // sociétés (garde-fou du découpage en colonnes ci-dessus).
  ['puces description', `Marie Dupont\nmarie@email.com\n\nEXPERIENCE\nLead Dev - BanqueTech (2020-2024)\n• Architecture microservices\n• Mentoring`, { exp: 1 }],
];

let ok = 0, ko = [];
for (const [nom, texte, attendu] of cas) {
  const r = parseCVText(texte);
  const errs = [];
  if (attendu.exp !== undefined && r.experience.length !== attendu.exp)
    errs.push(`exp ${r.experience.length}≠${attendu.exp}`);
  if (attendu.edu !== undefined && r.education.length !== attendu.edu)
    errs.push(`edu ${r.education.length}≠${attendu.edu}`);
  if (attendu.skills !== undefined && r.skills.length !== attendu.skills)
    errs.push(`skills ${r.skills.length}≠${attendu.skills}`);
  if (attendu.lang !== undefined && r.languages.length !== attendu.lang)
    errs.push(`lang ${r.languages.length}≠${attendu.lang}`);
  if (attendu.cert !== undefined && r.certifications.length !== attendu.cert)
    errs.push(`cert ${r.certifications.length}≠${attendu.cert}`);
  if (attendu.summary && !r.summary) errs.push('summary vide');
  if (errs.length) ko.push(`❌ ${nom} : ${errs.join(', ')}`); else ok++;
}
console.log(`=== RÉGRESSION : ${ok}/${cas.length} formats OK ===`);
ko.forEach(e => console.log(' ', e));
process.exit(ko.length ? 1 : 0);
