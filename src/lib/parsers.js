/**
 * Parsers for CV PDF and job description text
 */

/**
 * Parse raw text from PDF into a structured CV object
 * @param {string} pdfText - Raw text extracted from PDF
 * @returns {Object} Structured CV
 */
function parseCVText(pdfText) {
  const lines = pdfText.split('\n').filter(l => l.trim());

  const cv = {
    name: '',
    email: '',
    phone: '',
    summary: '',
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
  };

  let currentSection = null;
  let currentItem = null;

  // Word-boundary anchored so a real word/title doesn't false-match a header
  // keyword as a substring (e.g. "bac" inside "backend", "lang" inside
  // "language model" in a skills line).
  const sectionHeaders = [
    { regex: /\b(experience|emploi|travail|career|work|professional)\b/i, key: 'experience' },
    { regex: /\b(education|formation|etudes|diplome|degree|school|university|college|bac)\b/i, key: 'education' },
    { regex: /\b(competences|skills|technologies|tools|langages|programming)\b/i, key: 'skills' },
    { regex: /\b(certifications|certificates|certificat)\b/i, key: 'certifications' },
    { regex: /\b(langues|languages|lang)\b/i, key: 'languages' },
    { regex: /\b(resume|summary|profil|profile|about|objectif)\b/i, key: 'summary' },
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for section headers. A real header is short and standalone
    // (e.g. "Expérience", "Formation") — without this guard, an ordinary
    // sentence that merely mentions a keyword (e.g. "5 ans d'expérience en
    // systèmes distribués.") gets misread as a new section and wipes out
    // the real content that follows.
    // Normalise les accents pour matcher "Expérience" → "experience",
    // "Compétences" → "competences" (regex sans accents).
    const normalized = trimmed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const looksLikeHeader = trimmed.length <= 40 && trimmed.split(/\s+/).length <= 5 && !/[.!?]$/.test(trimmed);
    let matchedSection = null;
    if (looksLikeHeader) {
      for (const sh of sectionHeaders) {
        if (sh.regex.test(normalized)) {
          matchedSection = sh.key;
          break;
        }
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      if (currentSection === 'experience') {
        currentItem = { title: '', company: '', dates: '', description: [] };
        cv.experience.push(currentItem);
      } else if (currentSection === 'education') {
        currentItem = { degree: '', institution: '', dates: '', description: [] };
        cv.education.push(currentItem);
      }
      continue;
    }

    // Detect contact info on early lines
    if (!currentSection && lines.indexOf(line) < 10) {
      const emailMatch = trimmed.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      if (emailMatch && !cv.email) {
        cv.email = emailMatch[1];
        continue;
      }
      const phoneMatch = trimmed.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
      if (phoneMatch && !cv.phone) {
        cv.phone = phoneMatch[0];
        continue;
      }
      if (!cv.name && !emailMatch && !phoneMatch && trimmed.length < 60) {
        cv.name = trimmed;
        continue;
      }
      if (!cv.summary && trimmed.length > 25) {
        cv.summary = trimmed;
        continue;
      }
    }

    // Fill based on current section
    if (currentSection === 'experience') {
      // A "Company | Title" line always starts a new job entry — a CV section
      // usually lists several jobs under one "Experience" header, so without
      // this a second job would get folded into the first one's description.
      const companyMatch = trimmed.match(/^(.+?)\s*[|–—]\s*(.+)$/);
      // French CVs often use "Title - Company (year)" with a plain hyphen —
      // detect those too (hyphen must have spaces + end with a year in parens,
      // so "full-stack" or prose lines are NOT mistaken for a job header).
      const hyphenJobMatch = trimmed.match(/^(.+?)\s+-\s+(.+?)\s*\((\d{4}[^)]*)\)\s*$/);
      const newJob = (companyMatch || hyphenJobMatch) && (!currentItem || currentItem.company);
      if (newJob) {
        currentItem = { title: '', company: '', dates: '', description: [] };
        cv.experience.push(currentItem);
      }
      if (!currentItem) {
        currentItem = { title: '', company: '', dates: '', description: [] };
        cv.experience.push(currentItem);
      }
      if (companyMatch) {
        currentItem.company = companyMatch[1].trim();
        currentItem.title = companyMatch[2].trim();
      } else if (hyphenJobMatch) {
        currentItem.title = hyphenJobMatch[1].trim();
        currentItem.company = hyphenJobMatch[2].trim();
        currentItem.dates = '(' + hyphenJobMatch[3].trim() + ')';
      } else if (trimmed.match(/^\d{4}/) || trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'education') {
      const degreeMatch = trimmed.match(/^(.+?)\s*[|–—]\s*(.+)$/);
      // French CVs: "Diploma - Institution (year)" — detect with plain hyphen
      const hyphenEduMatch = trimmed.match(/^(.+?)\s+-\s+(.+?)\s*\((\d{4}[^)]*)\)\s*$/);
      const newEdu = (degreeMatch || hyphenEduMatch) && (!currentItem || currentItem.institution);
      if (newEdu) {
        currentItem = { degree: '', institution: '', dates: '', description: [] };
        cv.education.push(currentItem);
      }
      if (!currentItem) {
        currentItem = { degree: '', institution: '', dates: '', description: [] };
        cv.education.push(currentItem);
      }
      if (degreeMatch) {
        currentItem.institution = degreeMatch[1].trim();
        currentItem.degree = degreeMatch[2].trim();
      } else if (hyphenEduMatch) {
        currentItem.degree = hyphenEduMatch[1].trim();
        currentItem.institution = hyphenEduMatch[2].trim();
        currentItem.dates = '(' + hyphenEduMatch[3].trim() + ')';
      } else if (trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'skills') {
      // Split by common separators
      const skillItems = trimmed.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
      cv.skills.push(...skillItems);
    } else if (currentSection === 'certifications') {
      // Split by common separators (une certif par ligne ou séparées par virgules)
      const certItems = trimmed.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
      cv.certifications.push(...certItems);
    } else if (currentSection === 'languages') {
      // Split par virgule/point-virgule : "Français, Anglais" → 2 entrées
      const langItems = trimmed.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
      cv.languages.push(...langItems);
    } else if (currentSection === 'summary') {
      cv.summary = cv.summary ? cv.summary + ' ' + trimmed : trimmed;
    }
  }

  // Deduplicate skills
  cv.skills = [...new Set(cv.skills.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // Deduplicate certifications & languages
  cv.certifications = [...new Set(cv.certifications.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));
  cv.languages = [...new Set(cv.languages.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  return cv;
}

/**
 * Parse job description text to extract structured info
 * @param {string} jobText
 * @returns {Object} Job info with title, company, description
 */
function parseJobDescription(jobText) {
  return {
    rawText: jobText,
    title: '',
    company: '',
    description: jobText,
  };
}

/**
 * Extract text from a base64-encoded PDF using pdfjs-dist
 * @param {string} base64 - Base64-encoded PDF
 * @returns {Promise<string>} Extracted text
 */
async function parseTextFromBase64(base64) {
  if (!base64) return '';
  try {
    const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const buffer = Buffer.from(base64, 'base64');
    const pdf = await getDocument({ data: new Uint8Array(buffer) }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str || '').join(' ') + '\n';
    }
    return text;
  } catch (e) {
    console.error('[parsers] PDF parse error:', e.message);
    // Fallback: try to decode base64 as plain text
    try {
      return Buffer.from(base64, 'base64').toString('utf-8');
    } catch {
      return '';
    }
  }
}

module.exports = { parseCVText, parseJobDescription, parseTextFromBase64 };
