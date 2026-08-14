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

  const sectionHeaders = [
    { regex: /experience|emploi|travail|career|work|professional/i, key: 'experience' },
    { regex: /education|formation|etudes|diplome|degree|school|university|college|bac/i, key: 'education' },
    { regex: /competences|skills|technologies|tools|langages|programming/i, key: 'skills' },
    { regex: /certifications|certificates|certificat/i, key: 'certifications' },
    { regex: /langues|languages|lang/i, key: 'languages' },
    { regex: /resume|summary|profil|profile|about|objectif/i, key: 'summary' },
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
      if (!cv.summary && trimmed.length > 80) {
        cv.summary = trimmed;
        continue;
      }
    }

    // Fill based on current section
    if (currentSection === 'experience' && currentItem) {
      // Try to detect company line
      const companyMatch = trimmed.match(/^(.+?)\s*[|–—]\s*(.+)$/);
      if (companyMatch && !currentItem.company) {
        currentItem.company = companyMatch[1].trim();
        currentItem.title = companyMatch[2].trim();
      } else if (trimmed.match(/^\d{4}/) || trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'education' && currentItem) {
      const degreeMatch = trimmed.match(/^(.+?)\s*[|–—]\s*(.+)$/);
      if (degreeMatch && !currentItem.institution) {
        currentItem.institution = degreeMatch[1].trim();
        currentItem.degree = degreeMatch[2].trim();
      } else if (trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'skills') {
      // Split by common separators
      const skillItems = trimmed.split(/[,;•|]/).map(s => s.trim()).filter(Boolean);
      cv.skills.push(...skillItems);
    } else if (currentSection === 'summary') {
      cv.summary = cv.summary ? cv.summary + ' ' + trimmed : trimmed;
    }
  }

  // Deduplicate skills
  cv.skills = [...new Set(cv.skills.map(s => s.toLowerCase()))]
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
