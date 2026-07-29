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
  const allSkills = [...new Set([...existingSkills, ...(jobKeywords?.technical || []), ...(jobKeywords?.soft || [])])];
  const keywordSet = new Set((jobKeywords?.all || []).map(k => k.toLowerCase()));
  const prioritizedSkills = [...allSkills.filter(s => keywordSet.has(s.toLowerCase())), ...allSkills.filter(s => !keywordSet.has(s.toLowerCase()))];
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
    var h = '<div class="section">\n      <h2>Experience Professionnelle</h2>\n';
    (jobKeywords?.technical || []).slice(0, 5).forEach(function(k) {
      h += '      <p>• Mise en oeuvre de <strong>' + k + '</strong></p>\n';
    });
    h += '    </div>';
    return h;
  }

  function buildEduHTML() {
    if (education.length > 0) {
      return education.map(function(edu) {
        var h = '<div class="section">\n      <h2>' + (edu.degree || 'Formation') + '</h2>\n';
        if (edu.institution) h += '      <p class="exp-company">' + edu.institution + '</p>\n';
        if (edu.dates) h += '      <p class="exp-date">' + edu.dates + '</p>\n';
        return h + '    </div>';
      }).join('\n\n');
    }
    return '<div class="section">\n      <h2>Formation</h2>\n      <p>Diplome et formation pertinente.</p>\n    </div>';
  }

  function buildSkillsHTML() {
    if (prioritizedSkills.length > 0) {
      return prioritizedSkills.map(function(s) {
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

  if (strictMode) {
    // ATS STRICT — one column, no graphics, linear layout
    return '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1.0">\n  <title>CV - ' + name + '</title>\n  <style>\n    body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;max-width:800px;margin:auto;padding:25px 30px;color:#222;line-height:1.4;}\n    h1{font-size:20pt;color:#1a56db;border-bottom:2px solid #1a56db;padding-bottom:4px;}\n    .contact{font-size:10pt;color:#555;margin-bottom:12px;}\n    h2{font-size:13pt;color:#1a56db;border-bottom:1px solid #ddd;padding-bottom:2px;margin-top:12px;margin-bottom:6px;}\n    .pill{display:inline-block;font-size:10pt;padding:2px 8px;margin:2px;border-radius:3px;background:#e8f0fe;color:#1a56db;}\n    ul{padding-left:16px;margin:4px 0;}\n    li{margin-bottom:2px;font-size:10.5pt;}\n    .exp-header{display:flex;justify-content:space-between;font-weight:700;font-size:11pt;}\n    .exp-date{font-weight:400;color:#666;font-size:9.5pt;}\n    .exp-company{font-size:10pt;color:#444;margin-bottom:2px;}\n    .meta-footer{margin-top:20px;padding-top:8px;border-top:1px solid #eee;font-size:8pt;color:#999;}\n  </style>\n</head>\n<body>\n  <h1>' + name + '</h1>\n  <div class="contact">' + email + (phone ? ' | ' + phone : '') + '</div>\n  <div class="section">\n    <h2>Resume</h2>\n    <p>' + summaryText + '</p>\n  </div>\n  <div class="section">\n    <h2>Competences</h2>\n    <p>' + skillsHTML + '</p>\n  </div>\n  ' + expHTML + '\n  ' + eduHTML + '\n  <div class="meta-footer">\n    <p>Mots-cles: ' + metaKeywords + '</p>\n    <p>CV genere pour ATS</p>\n  </div>\n</body>\n</html>';
  }

  // DEFAULT — two-column visual template with header
  var jobTitle = job?.title || 'Titre du poste vise';
  return '<!DOCTYPE html>\n<html lang="fr">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width,initial-scale=1.0">\n  <meta name="keywords" content="' + metaKeywords + '">\n  <title>CV - ' + name + '</title>\n  <style>\n    :root{--ink:#1c1c1c;--paper:#fff;--sand:#f2ede3;--sandline:#e3dccb;--gold:#8a6d3b;--dark:#141414;--muted:#5b5b5b;}\n    body{margin:0;font-family:Georgia,\'Times New Roman\',serif;color:var(--ink);font-size:14px;line-height:1.5;max-width:210mm;margin:auto;}\n    .header{background:var(--dark);color:#fff;padding:32px 40px 24px 40px;}\n    .header h1{margin:0;font-size:32px;font-weight:400;}\n    .header .sub{font-size:16px;color:var(--sand);margin:4px 0;}\n    .tag{font-family:Arial,Helvetica,sans-serif;font-size:10px;background:#2b2b2b;color:#f2ede3;padding:4px 10px;border-radius:3px;display:inline-block;margin:2px;}\n    .layout{display:flex;}\n    .main{flex:1 1 68%;padding:24px 32px 32px 40px;}\n    .side{flex:0 0 32%;background:var(--sand);padding:24px 24px 32px 24px;border-left:1px solid var(--sandline);}\n    h2.section{font-family:Arial,Helvetica,sans-serif;font-size:11.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);border-bottom:1px solid var(--sandline);padding-bottom:5px;}\n    .summary-box{background:var(--sand);border-left:3px solid var(--gold);padding:14px 16px;font-size:13px;}\n    .exp-title{font-size:14.5px;font-weight:bold;}\n    .exp-company{font-size:13px;color:var(--gold);margin:2px 0 4px;}\n    .exp-date{font-size:12px;color:var(--muted);}\n    .exp-stack{font-family:Arial,Helvetica,sans-serif;font-size:10px;color:var(--muted);font-style:italic;}\n    .pill{font-family:Arial,Helvetica,sans-serif;font-size:10px;padding:3px 8px;border-radius:2px;display:inline-block;margin:2px;}\n    .pill.dark{background:var(--dark);color:#fff;}\n    .pill.light{background:#fff;border:1px solid var(--sandline);color:#333;}\n    ul{padding-left:16px;margin:4px 0;}\n    li{margin-bottom:2px;font-size:12.5px;}\n    @media print{.layout{display:block;}.side{border-left:none;border-top:1px solid var(--sandline);}}\n  </style>\n</head>\n<body>\n  <div class="header">\n    <h1>' + name + '</h1>\n    <div class="sub">' + jobTitle + '</div>\n    <div style="margin-top:8px;">\n      ' + (jobKeywords?.technical || []).slice(0, 5).map(function(k) { return '<span class="tag">' + k.charAt(0).toUpperCase() + k.slice(1) + '</span>'; }).join('') + '\n    </div>\n    <p style="font-size:11px;color:#aaa;margin:8px 0 0;">' + email + (phone ? ' | ' + phone : '') + '</p>\n  </div>\n  <div class="layout">\n  <div class="main">\n    <h2 class="section">Profil</h2>\n    <div class="summary-box"><p style="margin:0;">' + summaryText + '</p></div>\n    <h2 class="section">Experience professionnelle</h2>\n    ' + expHTML.replace(/<h2>/g, '<h2 class="section">') + '\n  </div>\n  <div class="side">\n    <h2 class="section">Competences</h2>\n    <div style="margin-bottom:12px;">' + skillsHTML + '</div>\n    <h2 class="section">Formation</h2>\n    ' + eduHTML.replace(/<h2>/g, '<h2 class="section">') + '\n  </div>\n  </div>\n</body>\n</html>';
}

function formatCVHTML(html, keywords) {
  const metaKw = (keywords.all || keywords || []).slice(0, 30).join(', ');
  return html.replace('</head>', `<meta name="keywords" content="${metaKw}">\n</head>`);
}

module.exports = { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML };
