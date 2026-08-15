/**
 * ATS Engine - Core logic for keyword extraction, CV scoring, and CV generation
 */

// Common stop words
const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'est', 'sont',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'by', 'with', 'from', 'as', 'into', 'through', 'during', 'before',
  'after', 'above', 'below', 'between', 'out', 'off', 'over', 'under',
  'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'also', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'shall', 'can', 'need', 'dare', 'ought',
  'used', 'about', 'up', 'down', 'if', 'after', 'before', 'until',
  'while', 'because', 'since', 'until', 'unless', 'although', 'though',
  'while', 'whereas', 'but', 'except', 'ce', 'cet', 'cette', 'ces',
  'mon', 'ton', 'son', 'ma', 'ta', 'sa', 'mes', 'tes', 'ses',
  'notre', 'votre', 'leur', 'nos', 'vos', 'leurs',
]);

function extractKeywords(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    return { all: [], technical: [], soft: [], qualifications: [], domains: [] };
  }
  const text = jobDescription.toLowerCase();
  const technicalPatterns = [
    /\b(python|javascript|typescript|java|php|ruby|go|golang|rust|c\+\+|csharp|swift|kotlin|scala|perl|r\b|matlab|bash|shell|sql|nosql|html|css|sass|less|graphql)\b/g,
    /\b(react|angular|vue|svelte|next\.?js|nuxt|django|flask|fastapi|spring|rails|laravel|express|node\.?js|symfony|asp\.net|dotnet|tensorflow|pytorch|keras|pandas|numpy|scikit|opencv|jquery|bootstrap|tailwind|junit|jest|mocha|cypress)\b/g,
    /\b(aws|azure|gcp|google\s*cloud|docker|kubernetes|k8s|terraform|ansible|jenkins|ci\/cd|gitlab\s*ci|github\s*actions|circleci|prometheus|grafana|elasticsearch|kibana|logstash|datadog|new\s*relic)\b/g,
    /\b(mysql|postgresql|postgres|mongodb|redis|elasticsearch|dynamodb|cassandra|mariadb|sqlite|oracle|sql\s*server|firebase|supabase)\b/g,
    /\b(git|github|gitlab|bitbucket|jira|confluence|trello|slack|notion|figma|sketch|adobe|xd|photoshop|illustrator)\b/g,
    /\b(machine\s*learning|deep\s*learning|nlp|natural\s*language|computer\s*vison|llm|large\s*language\s*model|ai|artificial\s*intelligence|data\s*science|data\s*analytics|big\s*data|spark|hadoop|airflow|tableau|power\s*bi)\b/g,
    /\b(linux|unix|windows\s*server|rest|restful|api|microservices|soa|event\s*driven|domain\s*driven|clean\s*architecture|hexagonal|onion)\b/g,
    /\b(agile|scrum|kanban|lean|waterfall|sprint|retrospective|stand\s*up|product\s*owner|scrum\s*master|pmp|prince2)\b/g,
  ];
  const softPatterns = [
    /\b(leadership|teamwork|communication|problem.solving|critical\s*thinking|creativity|adaptability|collaboration|time\s*management|organization|attention\s*to\s*detail|analytical|interpersonal|negotiation|presentation|mentoring|coaching|conflict\s*resolution|decision\s*making|strategic\s*thinking|innovation|emotional\s*intelligence|autonomy|initiative|flexibility|resilience|curiosity|growth\s*mindset|self.motivation|reliability|integrity|empathy|patience|diligence|persuasion|active\s*listening|cross.functional)\b/g,
  ];
  const qualPatterns = [
    /\b(bachelor|master|phd|doctorate|license|bts|dut|bac\+\d*|mastere|ingenieur|engineer|mba|degree|diploma|certification|certified|formation|graduate|post.graduate|baccalaureat)\b/g,
    /\b(bac\+5|bac\+3|bac\+2|bac\+4|bac\+6|bac\+8)\b/g,
    /\b(english|french|spanish|german|chinese|japanese|arabic|portuguese|italian|dutch|russian)\s*(fluent|native|bilingual|courant|bilingue|langue\s*maternelle)\b/g,
  ];
  const domainPatterns = [
    /\b(finance|banking|insurance|healthcare|medical|pharma|e.commerce|retail|saas|b2b|b2c|edtech|fintech|healthtech|proptech|cybersecurity|logistics|supply\s*chain|manufacturing|automotive|aerospace|energy|telecom|media|entertainment|gaming|consulting|legal|real\s*estate|hospitality|travel|education|non.profit|government|public\s*sector)\b/g,
  ];
  const extractUnique = (patterns) => {
    const matches = new Set();
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const keyword = match[0].trim().toLowerCase();
        if (keyword.length > 1 && !STOP_WORDS.has(keyword)) {
          matches.add(keyword);
        }
      }
      pattern.lastIndex = 0;
    }
    return [...matches];
  };
  const words = text.split(/\s+/).filter(w => w.length > 2);
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = words[i] + ' ' + words[i+1];
    if (bigram.length > 5 && !STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i+1])) {
      bigrams.push(bigram);
    }
  }
  const freq = {};
  for (const b of bigrams) { freq[b] = (freq[b] || 0) + 1; }
  const frequentPhrases = Object.entries(freq).filter(([, c]) => c > 1).map(([p]) => p);
  return {
    technical: extractUnique(technicalPatterns),
    soft: extractUnique(softPatterns),
    qualifications: extractUnique(qualPatterns),
    domains: extractUnique(domainPatterns),
    phrases: frequentPhrases,
    all: [...extractUnique(technicalPatterns), ...extractUnique(softPatterns), ...extractUnique(qualPatterns), ...extractUnique(domainPatterns), ...frequentPhrases],
  };
}

function scoreCV(cvText, jobKeywords) {
  if (!cvText || !jobKeywords) {
    return { overall: 0, details: { keywordMatch: 0, structure: 0, length: 0, density: 0 }, breakdown: {} };
  }
  const text = cvText.toLowerCase();
  const allKeywords = jobKeywords.all || [];
  const matched = [];
  const missing = [];
  for (const kw of allKeywords) {
    if (text.includes(kw.toLowerCase())) { matched.push(kw); }
    else { missing.push(kw); }
  }
  const keywordMatchPct = allKeywords.length > 0 ? (matched.length / allKeywords.length) * 100 : 50;
  const keywordScore = Math.min(100, Math.round(keywordMatchPct));
  const structureChecks = {
    hasEmail: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/.test(text),
    hasPhone: /\b(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/.test(text),
    hasExperience: /\b(experience|experiences|work\s*history|employment|professional\s*background|career|emploi|travail)\b/i.test(text),
    hasEducation: /\b(education|formation|degree|diploma|university|school|college|etudes|diplome)\b/i.test(text),
    hasSkills: /\b(skills|competences|technologies|technical\s*skills|core\s*competencies|langages|outils|tools)\b/i.test(text),
    hasBulletPoints: /[•\-*●]/.test(text),
    hasSections: /.{2,30}\n[-=]{3,}|^[A-ZÉÈÊËÎÏÔÖÛÜ]{3,}$/m.test(text),
  };
  const passedChecks = Object.values(structureChecks).filter(Boolean).length;
  const totalChecks = Object.keys(structureChecks).length;
  const structureScore = Math.round((passedChecks / totalChecks) * 100);
  const wordCount = text.split(/\s+/).length;
  let lengthScore = 0;
  if (wordCount >= 400 && wordCount <= 800) { lengthScore = 100; }
  else if (wordCount >= 300 && wordCount < 400) { lengthScore = 70; }
  else if (wordCount > 800 && wordCount <= 1000) { lengthScore = 80; }
  else if (wordCount >= 200 && wordCount < 300) { lengthScore = 50; }
  else { lengthScore = 30; }
  let densityScore = 0;
  if (allKeywords.length > 0) {
    const totalWords = text.split(/\s+/).length;
    const keywordOccurrences = allKeywords.reduce((sum, kw) => {
      const regex = new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = text.match(regex);
      return sum + (matches ? matches.length : 0);
    }, 0);
    const density = totalWords > 0 ? (keywordOccurrences / totalWords) * 100 : 0;
    if (density >= 2 && density <= 5) { densityScore = 100; }
    else if (density >= 1 && density < 2) { densityScore = 60; }
    else if (density > 5 && density <= 8) { densityScore = 70; }
    else { densityScore = 30; }
  } else { densityScore = 50; }
  const overall = Math.round((keywordScore * 0.40) + (structureScore * 0.30) + (lengthScore * 0.15) + (densityScore * 0.15));
  return { overall, details: { keywordMatch: keywordScore, structure: structureScore, length: lengthScore, density: densityScore }, breakdown: { matchedKeywords: matched, missingKeywords: missing, wordCount, structureChecks } };
}

function generateOptimizedCV({ cvText, job, jobKeywords, parsedCV, strictMode }) {
  // strictMode: true => one-column ATS-strict, false (default) => two-column visual template
  const name = parsedCV?.name || 'Candidat';
  const email = parsedCV?.email || 'email@exemple.com';
  const phone = parsedCV?.phone || '';
  const summary = parsedCV?.summary || '';
  const experience = parsedCV?.experience || [];
  const education = parsedCV?.education || [];
  const existingSkills = parsedCV?.skills || [];
  // Dedupe case-insensitively (keeping the first casing seen, prioritizing
  // the candidate's own skills) — otherwise "Java" from the CV and "java"
  // from the job keywords render as two separate, duplicate pills.
  const seenSkills = new Set();
  const allSkills = [...existingSkills, ...(jobKeywords?.technical || []), ...(jobKeywords?.soft || [])].filter(function(s) {
    if (typeof s !== 'string' || !s.trim()) return false;
    var key = s.trim().toLowerCase();
    if (seenSkills.has(key)) return false;
    seenSkills.add(key);
    return true;
  });
  const keywordSet = new Set((jobKeywords?.all || []).filter(k => typeof k === 'string').map(k => k.toLowerCase()));
  const prioritizedSkills = [...allSkills.filter(s => typeof s === 'string' ? keywordSet.has(s.toLowerCase()) : false), ...allSkills.filter(s => !(typeof s === 'string' ? keywordSet.has(s.toLowerCase()) : false))];
  const metaKeywords = (jobKeywords?.all || []).slice(0, 20).join(', ');
  const summaryKw = (jobKeywords?.technical || []).slice(0, 3).join(', ');
  const summaryText = summary || ('Professionnel(le) qualifie(e) avec expertise en ' + (summaryKw || 'developpement et technologies') + '.');

  function buildExpHTML() {
    if (experience.length > 0) {
      return experience.map(function(exp) {
        var h = '<div class="section">\n';
        if (exp.dates) h += '      <div class="exp-header"><span class="exp-title">' + (exp.title || 'Experience') + '</span><span class="exp-date">' + exp.dates + '</span></div>\n';
        else h += '      <div class="exp-header"><span class="exp-title">' + (exp.title || 'Experience') + '</span></div>\n';
        if (exp.company) h += '      <p class="exp-company">' + exp.company + '</p>\n';
        if (exp.description && exp.description.length > 0) {
          h += '      <ul>\n';
          h += exp.description.map(function(d) { return '        <li>' + d + '</li>'; }).join('\n');
          h += '\n      </ul>\n';
        }
        h += '    </div>';
        return h;
      }).join('\n\n');
    }
    // No entry parsed from the base CV — fall back to bullets built from the
    // job's top keywords. No <h2> here: callers already print a single
    // "Experience professionnelle" section header above this block.
    var h = '<div class="section">\n';
    (jobKeywords?.technical || []).slice(0, 5).forEach(function(k) {
      h += '      <p>• Mise en oeuvre de <strong>' + k + '</strong></p>\n';
    });
    h += '    </div>';
    return h;
  }

  function buildEduHTML() {
    // Emits standalone entries (no <h2>) — callers already print a single
    // "Formation" section header, so per-entry titles use .exp-title instead
    // to avoid stacking multiple underlined h2's for a multi-diploma CV.
    if (education.length > 0) {
      return education.map(function(edu) {
        var h = '<div class="edu-item">\n      <div class="exp-title">' + (edu.degree || 'Formation') + '</div>\n';
        if (edu.institution) h += '      <p class="exp-company">' + edu.institution + '</p>\n';
        if (edu.dates) h += '      <p class="exp-date">' + edu.dates + '</p>\n';
        return h + '    </div>';
      }).join('\n\n');
    }
    return '<p>Diplome et formation pertinente.</p>';
  }

  function buildSkillsHTML() {
    if (prioritizedSkills.length > 0) {
      return prioritizedSkills.map(function(s) {
        if (typeof s !== 'string') return '';
        var cls = keywordSet.has(s.toLowerCase()) ? 'pill dark' : 'pill light';
        return '<span class="' + cls + '">' + s.charAt(0).toUpperCase() + s.slice(1) + '</span>';
      }).join(' ');
    }
    return (jobKeywords?.all || []).slice(0, 10).map(function(k) {
      return '<span class="pill dark">' + k.charAt(0).toUpperCase() + k.slice(1) + '</span>';
    }).join(' ');
  }

  // Per-job "stack" line — the technologies actually mentioned in that job's
  // own bullets, not a fabricated tag. Reuses extractKeywords's technical
  // patterns rather than inventing a "stack" field we don't have data for.
  function jobStack(exp) {
    var text = (exp.description || []).join(' ');
    if (!text) return '';
    var kws = extractKeywords(text).technical || [];
    return kws.slice(0, 6).map(function(k) { return k.charAt(0).toUpperCase() + k.slice(1); }).join(' · ');
  }

  // Honest, computed stats (years span / roles / companies / skills) — never
  // fabricated numbers. Returns null when there isn't enough real data
  // (e.g. no parseable years), in which case the stats row is simply omitted.
  function computeStats() {
    if (experience.length === 0) return null;
    var years = [];
    var currentYear = new Date().getFullYear();
    experience.forEach(function(exp) {
      var found = (exp.dates || '').match(/\d{4}/g);
      if (found) years.push.apply(years, found.map(Number));
      if (/present|actuel|aujourd|current/i.test(exp.dates || '')) years.push(currentYear);
    });
    if (years.length < 2) return null;
    var span = Math.max.apply(null, years) - Math.min.apply(null, years);
    if (span <= 0) return null;
    var companies = new Set(experience.map(function(e) { return (e.company || '').toLowerCase(); }).filter(Boolean));
    return { years: span, roles: experience.length, companies: companies.size, skills: prioritizedSkills.length };
  }

  var expHTML = buildExpHTML();
  var eduHTML = buildEduHTML();
  var skillsHTML = buildSkillsHTML();
  var stats = computeStats();
  var languages = parsedCV?.languages || [];
  var certifications = parsedCV?.certifications || [];

  if (strictMode) {
    // ATS STRICT — single column, no tables/graphics/pseudo-elements, but
    // still legible and comfortable to read: larger type scale, generous
    // line-height and whitespace, gently rounded boxes/pills (rounding is
    // pure decoration — it doesn't touch text content or DOM order, so it
    // stays fully ATS-safe).
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>CV - ${name}</title>
  <style>
    *{box-sizing:border-box;}
    :root{--ink:#242220;--sand:#f2ede3;--sandline:#e3dccb;--gold:#8a6d3b;--dark:#141414;--muted:#6b6660;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;font-size:11.5pt;max-width:740px;margin:0 auto;padding:40px 38px 32px;color:var(--ink);line-height:1.65;background:#fff;}
    h1{font-size:25pt;font-weight:700;margin:0 0 6px;color:var(--dark);letter-spacing:-0.3px;}
    .role{font-size:11pt;letter-spacing:1.2px;text-transform:uppercase;color:var(--gold);font-weight:600;margin:0 0 12px;}
    .contact{font-size:10.5pt;color:var(--muted);margin-bottom:26px;}
    .contact span{margin-right:16px;}
    .section{margin-bottom:26px;}
    h2{font-size:11.5pt;letter-spacing:0.8px;text-transform:uppercase;color:var(--gold);font-weight:700;margin:0 0 12px;padding-bottom:7px;border-bottom:2px solid var(--sandline);}
    p{margin:0 0 6px;}
    .summary-box{background:var(--sand);border-radius:10px;border-left:4px solid var(--gold);padding:16px 18px;font-size:11pt;break-inside:avoid;page-break-inside:avoid;}
    .stats{display:flex;gap:10px;margin:18px 0 4px;}
    .stat{flex:1;text-align:center;background:var(--sand);border-radius:10px;padding:12px 6px;}
    .stat .num{font-size:17pt;font-weight:bold;color:var(--dark);}
    .stat .label{font-size:8pt;letter-spacing:0.3px;color:var(--muted);text-transform:uppercase;margin-top:2px;}
    .pill{display:inline-block;font-size:10pt;padding:5px 13px;margin:0 7px 7px 0;border-radius:999px;background:var(--sand);color:#3a352e;}
    ul{padding-left:20px;margin:6px 0 0;}
    li{margin-bottom:6px;font-size:11pt;}
    .exp-title{font-weight:700;font-size:12pt;}
    .exp-date{font-weight:500;color:var(--muted);font-size:10pt;white-space:nowrap;}
    .exp-company{font-size:10.5pt;color:var(--gold);margin:2px 0 4px;font-weight:600;}
    .exp-stack{font-size:9.5pt;color:var(--muted);font-style:italic;margin:0 0 6px;}
    .exp-item{margin-bottom:20px;padding-bottom:18px;border-bottom:1px solid #f0ede6;break-inside:avoid;page-break-inside:avoid;}
    .exp-item:last-child{margin-bottom:0;padding-bottom:0;border-bottom:none;}
    .exp-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px 12px;}
    .edu-item{margin-bottom:12px;break-inside:avoid;page-break-inside:avoid;}
    .edu-item:last-child{margin-bottom:0;}
    .meta-footer{margin-top:26px;padding-top:12px;border-top:1px solid #eee;font-size:8.5pt;color:#a39d94;}
    .brand-footer{text-align:center;font-size:8.5pt;color:#a39d94;padding-top:12px;margin-top:16px;border-top:1px solid #eee;}
    .brand-footer a{color:var(--gold);text-decoration:none;font-weight:600;}
  </style>
</head>
<body>
  <h1>${name}</h1>
  <div class="role">${job?.title || 'Titre du poste vise'}</div>
  <div class="contact"><span>${email}</span>${phone ? '<span>' + phone + '</span>' : ''}</div>
  <div class="section">
    <h2>Resume</h2>
    <div class="summary-box"><p>${summaryText}</p></div>
    ${stats ? `<div class="stats">
      <div class="stat"><div class="num">${stats.years}+</div><div class="label">Ans d'exp&eacute;rience</div></div>
      <div class="stat"><div class="num">${stats.roles}</div><div class="label">Postes</div></div>
      <div class="stat"><div class="num">${stats.companies}</div><div class="label">Entreprises</div></div>
      <div class="stat"><div class="num">${stats.skills}</div><div class="label">Comp&eacute;tences cl&eacute;s</div></div>
    </div>` : ''}
  </div>
  <div class="section">
    <h2>Competences</h2>
    <p>${skillsHTML}</p>
  </div>
  <div class="section">
    <h2>Experience professionnelle</h2>
    ${expHTML.replace(/<div class="section">/g, '<div class="exp-item">')}
  </div>
  <div class="section">
    <h2>Formation</h2>
    ${eduHTML}
  </div>
  ${certifications.length > 0 ? `<div class="section">
    <h2>Certifications</h2>
    <p>${certifications.map(function(c) { return '<span class="pill">' + c + '</span>'; }).join(' ')}</p>
  </div>` : ''}
  ${languages.length > 0 ? `<div class="section">
    <h2>Langues</h2>
    <p>${languages.map(function(l) { return '<span class="pill">' + l + '</span>'; }).join(' ')}</p>
  </div>` : ''}
  <div class="meta-footer">
    <p>Mots-cles: ${metaKeywords}</p>
  </div>
  <div class="brand-footer">CV optimise par <a href="https://prospecho.fr">Prospecho</a> — Ameliore ton score ATS en quelques secondes</div>
</body>
</html>`;
  }

  // DEFAULT — variante "Tech" (navy / bleu) fournie par l'utilisateur : header
  // degrade navy, barre de stats, timeline bleue sur l'experience, colonne
  // laterale grise. Portee ici en restant pilotee par les donnees reelles —
  // pas de sections/categories/metriques fabriquees que le template source
  // laissait en {{placeholder}} sans equivalent dans les donnees du CV
  // (ex: pas de "Projets" ni de sous-categories de competences curatees,
  // pas de niveau CECRL par langue, pas de ville/pays).
  var jobTitle = job?.title || 'Titre du poste vise';
  var tagsHTML = (jobKeywords?.technical || []).slice(0, 6).map(function(k) {
    return '<span class="tag">' + k.charAt(0).toUpperCase() + k.slice(1) + '</span>';
  }).join('');

  var jobsHTML = experience.length > 0
    ? experience.map(function(exp) {
        var stack = jobStack(exp);
        var h = '<article class="job">\n';
        h += '      <p class="job-title">' + (exp.title || 'Poste') + '</p>\n';
        h += '      <p class="job-meta">' + (exp.company || '') + (exp.dates ? ' <span class="date">· ' + exp.dates + '</span>' : '') + '</p>\n';
        if (stack) h += '      <p class="stack">Stack : ' + stack + '</p>\n';
        if (exp.description && exp.description.length > 0) {
          h += '      <ul>\n' + exp.description.map(function(d) { return '        <li>' + d + '</li>'; }).join('\n') + '\n      </ul>\n';
        }
        h += '    </article>';
        return h;
      }).join('\n\n')
    : buildExpHTML().replace(/<div class="section">/g, '<div class="job">');

  var eduSideHTML = education.length > 0
    ? education.map(function(edu) {
        var h = '<div class="edu"><strong>' + (edu.degree || 'Formation') + '</strong>';
        if (edu.institution || edu.dates) h += '<span>' + [edu.institution, edu.dates].filter(Boolean).join(' · ') + '</span>';
        return h + '</div>';
      }).join('\n')
    : '<div class="edu"><span>Diplome et formation pertinente.</span></div>';

  // Un seul groupe de competences pilote par les donnees (pas de sous-categories
  // "Architecture / Cloud / Leadership..." inventees) — celles qui matchent
  // l'offre ressortent en pill pleine ("key"), les autres en pill neutre.
  var skillPillsHTML = prioritizedSkills.length > 0
    ? prioritizedSkills.map(function(s) {
        if (typeof s !== 'string') return '';
        var cls = keywordSet.has(s.toLowerCase()) ? 'pill key' : 'pill';
        return '<span class="' + cls + '">' + s.charAt(0).toUpperCase() + s.slice(1) + '</span>';
      }).join('')
    : (jobKeywords?.all || []).slice(0, 10).map(function(k) { return '<span class="pill key">' + k.charAt(0).toUpperCase() + k.slice(1) + '</span>'; }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="keywords" content="${metaKeywords}">
  <title>CV - ${name}</title>
  <style>
    :root{
      --navy:#0b1f33; --blue:#1d6ef2; --blue-soft:#e8f0fe;
      --slate:#33475b; --grey:#f4f6f8; --line:#dde3ea; --ink:#16222e; --muted:#63758a;
    }
    *{box-sizing:border-box;}
    body{margin:0;background:#e9edf1;font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif;color:var(--ink);font-size:13.6px;line-height:1.55;}
    .page{max-width:210mm;margin:24px auto;background:#fff;box-shadow:0 2px 18px rgba(11,31,51,0.14);}
    .date,.stack{font-family:ui-monospace,'SFMono-Regular',Consolas,'Courier New',monospace;}
    .header{background:var(--navy);background-image:linear-gradient(115deg,#0b1f33 0%,#0b1f33 58%,#143a63 100%);color:#fff;padding:34px 44px 28px;border-bottom:4px solid var(--blue);}
    .header h1{margin:0;font-size:38px;font-weight:800;letter-spacing:-1px;line-height:1.05;}
    .role{margin:8px 0 0;font-size:15px;font-weight:600;color:#8fc0ff;text-transform:uppercase;letter-spacing:2.2px;}
    .top{display:flex;gap:32px;flex-wrap:wrap;justify-content:space-between;align-items:flex-start;}
    .contact{font-size:12.2px;line-height:1.9;color:#cfe0f5;text-align:right;}
    .tags{margin-top:16px;display:flex;flex-wrap:wrap;gap:7px;}
    .tag{font-size:11px;letter-spacing:0.4px;font-weight:600;background:rgba(255,255,255,0.10);border:1px solid rgba(143,192,255,0.35);color:#e6f0fc;padding:4px 10px;border-radius:3px;}
    .stats{display:flex;flex-wrap:wrap;background:var(--navy);color:#fff;border-top:1px solid rgba(255,255,255,0.08);}
    .stat{flex:1 1 150px;padding:12px 44px 14px;border-right:1px solid rgba(255,255,255,0.08);}
    .stat:last-child{border-right:none;}
    .stat-num{display:block;font-family:ui-monospace,'SFMono-Regular',Consolas,'Courier New',monospace;font-size:21px;font-weight:700;color:#4d97ff;}
    .stat-lbl{font-size:10.6px;text-transform:uppercase;letter-spacing:1.3px;color:#9fb4c9;}
    .layout{display:flex;align-items:stretch;}
    .main{flex:1 1 66%;padding:26px 34px 38px 44px;min-width:0;}
    .side{flex:0 0 34%;background:var(--grey);border-left:1px solid var(--line);padding:26px 32px 38px 26px;}
    h2.section{font-size:11.5px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:var(--blue);margin:26px 0 12px;padding-bottom:6px;border-bottom:2px solid var(--line);}
    .main h2.section:first-child,.side h2.section:first-child{margin-top:0;}
    .summary{background:var(--blue-soft);border-left:4px solid var(--blue);padding:14px 16px;font-size:13.4px;color:var(--slate);border-radius:0 3px 3px 0;margin:0;break-inside:avoid;page-break-inside:avoid;}
    .job{padding:0 0 4px;margin-bottom:18px;border-left:2px solid var(--line);padding-left:16px;position:relative;break-inside:avoid;page-break-inside:avoid;}
    .job:last-child{margin-bottom:0;}
    .job::before{content:"";position:absolute;left:-6px;top:6px;width:10px;height:10px;background:var(--blue);border-radius:50%;border:2px solid #fff;}
    .job-title{font-size:15px;font-weight:700;margin:0;}
    .job-meta{font-size:12.4px;color:var(--slate);font-weight:600;margin:2px 0 2px;}
    .date{font-size:11.4px;color:var(--muted);font-weight:500;}
    .stack{font-size:11.2px;color:var(--muted);margin:4px 0 8px;}
    .job ul{margin:6px 0 0;padding-left:17px;}
    .job li{margin-bottom:5px;}
    .job li::marker{color:var(--blue);}
    .skill-group{margin-bottom:14px;}
    .skill-group h3{font-size:11px;text-transform:uppercase;letter-spacing:1.2px;color:var(--slate);margin:0 0 6px;font-weight:800;}
    .pills{display:flex;flex-wrap:wrap;gap:6px;}
    .pill{font-size:11px;padding:4px 9px;border-radius:3px;background:#fff;border:1px solid var(--line);color:#26364a;}
    .pill.key{background:var(--navy);color:#fff;border-color:var(--navy);font-weight:600;}
    .edu{margin-bottom:12px;break-inside:avoid;page-break-inside:avoid;}
    .edu strong{display:block;font-size:13px;}
    .edu span{font-size:11.8px;color:var(--muted);}
    .lang{font-size:12.4px;padding:3px 0;border-bottom:1px dotted var(--line);}
    .lang b{font-weight:600;}
    .brand-footer{text-align:center;font-size:10.5px;color:var(--muted);padding:16px 0;border-top:1px solid var(--line);}
    .brand-footer a{color:var(--blue);text-decoration:none;font-weight:600;}
    @page{size:A4;margin:0;}
    @media print{
      body{background:#fff;font-size:11.4px;}
      .page{margin:0;box-shadow:none;max-width:none;}
      .header{padding:24px 30px 20px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .header h1{font-size:30px;}
      .stats,.side,.summary,.pill.key,.job::before{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
      .main{padding:20px 24px 24px 30px;}
      .side{padding:20px 24px;}
      .job{page-break-inside:avoid;}
    }
    @media(max-width:760px){
      .layout{display:block;}
      .side{border-left:none;border-top:1px solid var(--line);}
      .contact{text-align:left;}
      .header{padding:26px 22px;}
      .main{padding:22px;}
    }
  </style>
</head>
<body>
<div class="page">
  <header class="header">
    <div class="top">
      <div>
        <h1>${name}</h1>
        <p class="role">${jobTitle}</p>
      </div>
      <div class="contact">${email}${phone ? '<br>' + phone : ''}</div>
    </div>
    <div class="tags">${tagsHTML}</div>
  </header>
  ${stats ? `<div class="stats">
    <div class="stat"><span class="stat-num">${stats.years}+</span><span class="stat-lbl">Ann&eacute;es d'exp&eacute;rience</span></div>
    <div class="stat"><span class="stat-num">${stats.roles}</span><span class="stat-lbl">Postes occup&eacute;s</span></div>
    <div class="stat"><span class="stat-num">${stats.companies}</span><span class="stat-lbl">Entreprises</span></div>
    <div class="stat"><span class="stat-num">${stats.skills}</span><span class="stat-lbl">Comp&eacute;tences cl&eacute;s</span></div>
  </div>` : ''}
  <div class="layout">
    <main class="main">
      <h2 class="section">R&eacute;sum&eacute; professionnel</h2>
      <p class="summary">${summaryText}</p>
      <h2 class="section">Exp&eacute;rience professionnelle</h2>
      ${jobsHTML}
    </main>
    <aside class="side">
      <h2 class="section">Comp&eacute;tences</h2>
      <div class="skill-group">
        <div class="pills">${skillPillsHTML}</div>
      </div>
      ${certifications.length > 0 ? `<h2 class="section">Certifications</h2>
      ${certifications.map(function(c) { return '<div class="edu"><strong>' + c + '</strong></div>'; }).join('\n')}` : ''}
      <h2 class="section">Formation</h2>
      ${eduSideHTML}
      ${languages.length > 0 ? `<h2 class="section">Langues</h2>
      ${languages.map(function(l) { return '<div class="lang"><b>' + l + '</b></div>'; }).join('\n')}` : ''}
    </aside>
  </div>
  <div class="brand-footer">CV optimise par <a href="https://prospecho.fr">Prospecho</a> — Ameliore ton score ATS en quelques secondes</div>
</div>
</body>
</html>`;
}

function formatCVHTML(html, keywords) {
  const metaKw = (keywords.all || keywords || []).slice(0, 30).join(', ');
  return html.replace('</head>', `<meta name="keywords" content="${metaKw}">\n</head>`);
}

module.exports = { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML };
