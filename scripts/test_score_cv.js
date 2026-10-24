#!/usr/bin/env node
/**
 * Test du score de confiance et du repli LLM sur les CV disponibles.
 * Usage : node scripts/test_score_cv.js
 */
const fs = require('fs');
const path = require('path');
const { parseCVText } = require('../src/lib/parsers.js');
const { scorerCV } = require('../src/lib/cvConfidence.js');
const { extraireAvecLLM } = require('../src/lib/cvLLMExtract.js');

const CACHE = path.join(process.env.HOME, '.hermes/cache/documents');

// Textes préparés à l'avance avec pdftotext (pdfjs n'est pas requis ici)
const FICHIERS = [
  { nom: 'cvPropre.pdf (Paul Legrand)', txt: '/tmp/cv_paul.txt' },
  { nom: 'CV LaTeX 2 colonnes (Sourabh Bajaj)', txt: '/tmp/cv_latex.txt' },
];

function ligne(label, val) {
  const s = String(val ?? '—');
  console.log(`    ${label.padEnd(14)} ${s.length > 70 ? s.slice(0, 70) + '…' : s}`);
}

(async () => {
  for (const f of FICHIERS) {
    if (!fs.existsSync(f.txt)) {
      console.log(`\n⚠️  ${f.nom} — texte absent (${f.txt}), ignoré`);
      continue;
    }
    const texte = fs.readFileSync(f.txt, 'utf8');
    console.log(`\n${'═'.repeat(66)}`);
    console.log(`  ${f.nom} · ${texte.length} car.`);
    console.log('═'.repeat(66));

    // ── 1. Déterministe ────────────────────────────────────────────────────
    const cvDet = parseCVText(texte);
    const a1 = scorerCV(cvDet);
    console.log(`\n  [DÉTERMINISTE] score ${a1.score}/100 ${a1.ok ? '✅' : '❌ sous le seuil'}`);
    ligne('nom', cvDet.name);
    ligne('expériences', `${(cvDet.experience || []).length} · 1ʳᵉ : ${(cvDet.experience?.[0]?.title || '').slice(0, 45)}`);
    ligne('formations', (cvDet.education || []).length);
    ligne('compétences', (cvDet.skills || []).length);
    ligne('langues', (cvDet.languages || []).length);
    if (a1.raisons.length) {
      console.log('    pénalités :');
      a1.raisons.forEach((r) => console.log(`      · ${r}`));
    }

    // ── 2. Repli LLM si sous le seuil ──────────────────────────────────────
    if (!a1.ok) {
      console.log('\n  [REPLI LLM] déclenché (score < 60)…');
      const t0 = Date.now();
      const cvLLM = await extraireAvecLLM(texte);
      const duree = ((Date.now() - t0) / 1000).toFixed(1);
      if (!cvLLM) {
        console.log(`    ❌ échec (${duree}s) — clé absente ou quota`);
        continue;
      }
      const a2 = scorerCV(cvLLM);
      console.log(`    ✅ modèle ${cvLLM._modele} · ${duree}s · score ${a2.score}/100`);
      ligne('nom', cvLLM.name);
      ligne('email', cvLLM.email);
      ligne('expériences', (cvLLM.experience || []).length);
      (cvLLM.experience || []).slice(0, 3).forEach((e, i) =>
        console.log(`        ${i + 1}. ${e.title} — ${e.company} (${e.dates})`));
      ligne('formations', (cvLLM.education || []).length);
      (cvLLM.education || []).slice(0, 2).forEach((e, i) =>
        console.log(`        ${i + 1}. ${e.degree} — ${e.institution} (${e.dates})`));
      ligne('compétences', (cvLLM.skills || []).join(', ').slice(0, 70));
      ligne('langues', (cvLLM.languages || []).join(', '));
      console.log(`\n    GAIN : ${a1.score} → ${a2.score} (+${a2.score - a1.score})`);
    } else {
      console.log('\n  [REPLI LLM] non nécessaire (score ≥ 60) — 0 € dépensé');
    }
  }
})();
