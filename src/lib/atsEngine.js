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

  var expHTML = buildExpHTML();
  var eduHTML = buildEduHTML();
  var skillsHTML = buildSkillsHTML();
  var footer = '<div class="brand-footer">CV optimise par <a href="https://prospecho.fr">Prospecho</a> — Ameliore ton score ATS en quelques secondes</div>';

  if (strictMode) {
    // ATS STRICT — single column, no tables/graphics, but still legible and well spaced.
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>CV - ${name}</title>
  <style>
    *{box-sizing:border-box;}
    body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;max-width:760px;margin:0 auto;padding:36px 34px 28px;color:#222;line-height:1.5;background:#fff;}
    h1{font-size:23pt;font-weight:700;margin:0 0 4px;color:#111;}
    .role{font-size:12pt;color:#1a56db;font-weight:600;margin:0 0 10px;}
    .contact{font-size:10pt;color:#555;margin-bottom:22px;}
    .contact span{margin-right:14px;}
    .section{margin-bottom:20px;}
    h2{font-size:11pt;letter-spacing:0.6px;text-transform:uppercase;color:#1a56db;margin:0 0 10px;padding-bottom:5px;border-bottom:2px solid #1a56db;}
    p{margin:0 0 6px;}
    .pill{display:inline-block;font-size:9.5pt;padding:3px 10px;margin:0 6px 6px 0;border-radius:3px;background:#eef3fd;color:#1a56db;border:1px solid #d7e3fb;}
    ul{padding-left:18px;margin:4px 0 0;}
    li{margin-bottom:4px;font-size:10.5pt;}
    .exp-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:4px 12px;}
    .exp-title{font-weight:700;font-size:11pt;}
    .exp-date{font-weight:400;color:#666;font-size:9.5pt;white-space:nowrap;}
    .exp-company{font-size:10pt;color:#444;margin:1px 0 5px;font-style:italic;}
    .edu-item{margin-bottom:10px;}
    .edu-item:last-child{margin-bottom:0;}
    .meta-footer{margin-top:24px;padding-top:10px;border-top:1px solid #e5e5e5;font-size:8pt;color:#999;}
    .brand-footer{text-align:center;font-size:7.5pt;color:#999;padding-top:10px;margin-top:14px;border-top:1px solid #eee;}
    .brand-footer a{color:#1a56db;text-decoration:none;}
  </style>
</head>
<body>
  <h1>${name}</h1>
  <div class="role">${job?.title || 'Titre du poste vise'}</div>
  <div class="contact"><span>${email}</span>${phone ? '<span>' + phone + '</span>' : ''}</div>
  <div class="section">
    <h2>Resume</h2>
    <p>${summaryText}</p>
  </div>
  <div class="section">
    <h2>Competences</h2>
    <p>${skillsHTML}</p>
  </div>
  <div class="section">
    <h2>Experience professionnelle</h2>
    ${expHTML}
  </div>
  <div class="section">
    <h2>Formation</h2>
    ${eduHTML}
  </div>
  <div class="meta-footer">
    <p>Mots-cles: ${metaKeywords}</p>
  </div>
  ${footer}
</body>
</html>`;
  }

  // DEFAULT — two-column visual template (header sombre + colonne competences, style skill CV builder)
  var jobTitle = job?.title || 'Titre du poste vise';
  var tagsHTML = (jobKeywords?.technical || []).slice(0, 5).map(function(k) {
    return '<span class="tag">' + k.charAt(0).toUpperCase() + k.slice(1) + '</span>';
  }).join('');

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="keywords" content="${metaKeywords}">
  <title>CV - ${name}</title>
  <style>
    *{box-sizing:border-box;}
    :root{--ink:#1c1c1c;--paper:#fff;--sand:#f2ede3;--sandline:#e3dccb;--gold:#8a6d3b;--dark:#141414;--muted:#5b5b5b;}
    body{margin:0 auto;max-width:210mm;font-family:Georgia,'Times New Roman',serif;color:var(--ink);font-size:13.5px;line-height:1.55;background:#fff;}
    .header{background:var(--dark);color:#fff;padding:36px 44px 26px;}
    .header h1{margin:0;font-size:32px;font-weight:400;letter-spacing:0.3px;}
    .header .sub{font-size:15px;color:var(--sand);margin:4px 0 14px;font-style:italic;}
    .tags{display:flex;flex-wrap:wrap;gap:6px;}
    .tag{font-family:Arial,Helvetica,sans-serif;font-size:10px;background:#2b2b2b;color:#f2ede3;padding:5px 11px;border-radius:3px;}
    .contact-row{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#b8b8b8;margin-top:14px;display:flex;flex-wrap:wrap;gap:4px 16px;}
    .layout{display:flex;flex-wrap:wrap;}
    .main{flex:1 1 62%;min-width:280px;padding:26px 30px 30px 44px;}
    .side{flex:1 1 34%;min-width:220px;background:var(--sand);padding:26px 28px 30px;border-left:1px solid var(--sandline);}
    h2.section{font-family:Arial,Helvetica,sans-serif;font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);border-bottom:1px solid var(--sandline);padding-bottom:6px;margin:0 0 12px;}
    .main h2.section{margin-top:26px;}
    .main h2.section:first-child{margin-top:0;}
    .summary-box{background:var(--sand);border-left:3px solid var(--gold);padding:15px 18px;font-size:13px;}
    .summary-box p{margin:0;}
    .exp-block{margin-bottom:18px;}
    .exp-block:last-child{margin-bottom:0;}
    .exp-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:2px 10px;}
    .exp-title{font-size:14.5px;font-weight:bold;}
    .exp-company{font-size:12.5px;color:var(--gold);margin:2px 0 5px;font-family:Arial,Helvetica,sans-serif;}
    .exp-date{font-size:11.5px;color:var(--muted);font-family:Arial,Helvetica,sans-serif;white-space:nowrap;}
    .pill-wrap{display:flex;flex-wrap:wrap;gap:6px;}
    .pill{font-family:Arial,Helvetica,sans-serif;font-size:10px;padding:4px 9px;border-radius:2px;line-height:1.3;}
    .pill.dark{background:var(--dark);color:#fff;}
    .pill.light{background:#fff;border:1px solid var(--sandline);color:#333;}
    ul{padding-left:17px;margin:5px 0 0;}
    li{margin-bottom:4px;font-size:12.5px;}
    .edu-item{margin-bottom:12px;}
    .edu-item:last-child{margin-bottom:0;}
    .side .exp-title{font-size:13px;}
    .brand-footer{text-align:center;font-family:Arial,Helvetica,sans-serif;font-size:9.5px;color:#999;padding:12px 0;border-top:1px solid var(--sandline);}
    .brand-footer a{color:var(--gold);text-decoration:none;}
    @media print{.layout{display:block;}.side{border-left:none;border-top:1px solid var(--sandline);}}
  </style>
</head>
<body>
  <div class="header">
    <h1>${name}</h1>
    <div class="sub">${jobTitle}</div>
    <div class="tags">${tagsHTML}</div>
    <div class="contact-row"><span>${email}</span>${phone ? '<span>' + phone + '</span>' : ''}</div>
  </div>
  <div class="layout">
    <div class="main">
      <h2 class="section">Profil</h2>
      <div class="summary-box"><p>${summaryText}</p></div>
      <h2 class="section">Experience professionnelle</h2>
      ${expHTML.replace(/<div class="section">/g, '<div class="exp-block">')}
    </div>
    <div class="side">
      <h2 class="section">Competences</h2>
      <div class="pill-wrap" style="margin-bottom:22px;">${skillsHTML}</div>
      <h2 class="section">Formation</h2>
      ${eduHTML}
    </div>
  </div>
  <div class="brand-footer">CV optimise par <a href="https://prospecho.fr">Prospecho</a> — Ameliore ton score ATS en quelques secondes</div>
</body>
</html>`;
}

function formatCVHTML(html, keywords) {
  const metaKw = (keywords.all || keywords || []).slice(0, 30).join(', ');
  return html.replace('</head>', `<meta name="keywords" content="${metaKw}">\n</head>`);
}

module.exports = { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML };
