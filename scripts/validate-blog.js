#!/usr/bin/env node
/**
 * Valide le blog APRÈS `next build`, sur le HTML réellement généré.
 * Vérifie : présence des 10 pages, H1 unique, volume de contenu, JSON-LD
 * (Article + FAQPage + BreadcrumbList), FAQ, maillage interne, sitemap.
 *
 * Usage : node scripts/validate-blog.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const APP_OUT = path.join(ROOT, '.next', 'server', 'app');
const BLOG_OUT = path.join(APP_OUT, 'blog');

const SLUGS = [
  'optimiser-cv-ats-2026',
  'mots-cles-tech-ats',
  'structure-cv-developpeur',
  'score-ats-comment-calcule',
  'reconversion-tech-2026',
  'negocier-salaire-tech',
  'portfolio-github-recruteur',
  'lettre-motivation-tech',
  'job-tech-sans-diplome',
  'entretien-technique-5-etapes',
];

const MIN_WORDS = {
  'optimiser-cv-ats-2026': 1500,
  default: 900,
};

let failures = 0;
const warn = (msg) => console.log(`  ⚠️  ${msg}`);
const fail = (msg) => {
  failures += 1;
  console.log(`  ❌ ${msg}`);
};
const ok = (msg) => console.log(`  ✅ ${msg}`);

function stripTags(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractJsonLd(html) {
  const blocks = [];
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1]));
    } catch (e) {
      blocks.push({ __parseError: e.message, __raw: m[1].slice(0, 120) });
    }
  }
  return blocks;
}

function findGraph(blocks) {
  const graph = [];
  for (const b of blocks) {
    if (Array.isArray(b['@graph'])) graph.push(...b['@graph']);
    else graph.push(b);
  }
  return graph;
}

if (!fs.existsSync(APP_OUT)) {
  console.error('❌ .next/server/app introuvable — lance `npm run build` avant.');
  process.exit(1);
}

console.log('\n=== 1. Pages générées ===');
const htmlFiles = fs.existsSync(BLOG_OUT)
  ? fs.readdirSync(BLOG_OUT).filter((f) => f.endsWith('.html'))
  : [];
for (const slug of SLUGS) {
  const file = path.join(BLOG_OUT, `${slug}.html`);
  if (!fs.existsSync(file)) {
    fail(`page manquante : ${slug}.html`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  const text = stripTags(html);
  const words = text.split(/\s+/).filter(Boolean).length;

  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  const h2 = (html.match(/<h2[\s>]/gi) || []).length;
  const min = MIN_WORDS[slug] || MIN_WORDS.default;

  console.log(`\n— ${slug}`);
  if (h1 !== 1) fail(`H1 = ${h1} (attendu 1)`);
  if (h2 < 5) fail(`H2 = ${h2} (attendu ≥ 5)`);
  if (words < min) fail(`${words} mots (attendu ≥ ${min})`);
  else ok(`${words} mots · H1 ${h1} · H2 ${h2}`);

  // JSON-LD
  const blocks = extractJsonLd(html);
  if (!blocks.length) fail('aucun JSON-LD trouvé');
  const parseErrors = blocks.filter((b) => b.__parseError);
  if (parseErrors.length) fail(`JSON-LD invalide : ${parseErrors[0].__parseError}`);
  const graph = findGraph(blocks);
  const types = graph.map((g) => g['@type']);
  for (const t of ['Article', 'FAQPage', 'BreadcrumbList']) {
    if (!types.includes(t)) fail(`JSON-LD ${t} manquant`);
  }

  const article = graph.find((g) => g['@type'] === 'Article');
  if (article) {
    if (!article.headline) fail('Article.headline manquant');
    if (!article.datePublished) fail('Article.datePublished manquant');
    if (!article.dateModified) fail('Article.dateModified manquant');
    if (!article.author) fail('Article.author manquant');
    if (!article.publisher) fail('Article.publisher manquant');
    if (!article.wordCount || article.wordCount < min) fail(`Article.wordCount = ${article.wordCount}`);
  }

  const faq = graph.find((g) => g['@type'] === 'FAQPage');
  const questions = faq && Array.isArray(faq.mainEntity) ? faq.mainEntity : [];
  if (questions.length < 3 || questions.length > 6) {
    fail(`FAQ = ${questions.length} questions (attendu 3-5)`);
  } else {
    ok(`FAQ ${questions.length} questions`);
  }
  const faqVisible = questions.every((q) => text.includes(stripTags(q.name).slice(0, 40)));
  if (!faqVisible) fail('une question FAQ du JSON-LD n’est pas visible dans la page');

  const bc = graph.find((g) => g['@type'] === 'BreadcrumbList');
  if (bc && (!Array.isArray(bc.itemListElement) || bc.itemListElement.length !== 3)) {
    fail('BreadcrumbList doit avoir 3 niveaux');
  }

  // Maillage interne
  const blogLinks = new Set((html.match(/href="\/blog\/([a-z0-9-]+)"/g) || []).map((h) => h.split('/blog/')[1].replace('"', '')));
  blogLinks.delete(slug);
  if (blogLinks.size < 2) fail(`seulement ${blogLinks.size} lien(s) vers d’autres articles (attendu ≥ 2)`);
  else ok(`${blogLinks.size} liens articles`);
  if (!/href="\/"/.test(html)) fail('aucun lien vers l’accueil');
}

console.log('\n=== 2. Index /blog ===');
const indexCandidates = [
  path.join(APP_OUT, 'blog.html'),
  path.join(BLOG_OUT, 'index.html'),
  path.join(APP_OUT, 'blog', 'index.html'),
];
const indexFile = indexCandidates.find((f) => fs.existsSync(f));
if (!indexFile) {
  fail('page index /blog introuvable dans .next/server/app');
} else {
  const html = fs.readFileSync(indexFile, 'utf8');
  let found = 0;
  for (const slug of SLUGS) if (html.includes(`/blog/${slug}`)) found += 1;
  if (found === 10) ok('les 10 articles sont listés');
  else fail(`${found}/10 articles listés sur l’index`);
  const h1 = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1 !== 1) fail(`index : H1 = ${h1}`);
  const graph = findGraph(extractJsonLd(html));
  if (!graph.some((g) => g['@type'] === 'ItemList')) fail('index : ItemList JSON-LD manquant');
  if (!graph.some((g) => g['@type'] === 'Blog')) fail('index : Blog JSON-LD manquant');
}

console.log('\n=== 3. Sitemap ===');
const sitemapCandidates = [
  path.join(ROOT, 'public', 'sitemap.xml'),
  path.join(APP_OUT, 'sitemap.xml.body'),
  path.join(APP_OUT, 'sitemap.xml'),
];
const sitemapFile = sitemapCandidates.find((f) => fs.existsSync(f));
if (!sitemapFile) {
  fail('sitemap introuvable (ni public/sitemap.xml ni app/sitemap.ts généré)');
} else {
  const xml = fs.readFileSync(sitemapFile, 'utf8');
  let missing = 0;
  for (const slug of SLUGS) if (!xml.includes(`/blog/${slug}`)) missing += 1;
  if (missing) fail(`${missing} URL(s) blog absentes du sitemap`);
  else ok('les 10 URLs blog sont dans le sitemap');
  if (!xml.includes('https://prospecho.fr/blog<')) warn('URL /blog absente du sitemap (non bloquant)');
}

console.log('\n=== 4. llms.txt ===');
const llms = path.join(ROOT, 'public', 'llms.txt');
if (!fs.existsSync(llms)) {
  fail('public/llms.txt manquant');
} else {
  const txt = fs.readFileSync(llms, 'utf8');
  let missing = 0;
  for (const slug of SLUGS) if (!txt.includes(`/blog/${slug}`)) missing += 1;
  if (missing) fail(`${missing} article(s) absents de llms.txt`);
  else ok('les 10 articles sont dans llms.txt');
}

console.log('\n=== 5. Doublons de slugs ===');
const metas = fs.readdirSync(path.join(ROOT, 'content', 'blog')).filter((f) => f.endsWith('.ts') && f !== 'index.ts');
if (metas.length !== 10) fail(`${metas.length} fichiers d’articles (attendu 10)`);
else ok('10 fichiers d’articles');

console.log(`\n${failures === 0 ? '✅ VALIDATION OK' : `❌ ${failures} problème(s)`}\n`);
process.exit(failures === 0 ? 0 : 1);
