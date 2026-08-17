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
      if (companyMatch && (!currentItem || currentItem.company)) {
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
      } else if (trimmed.match(/^\d{4}/) || trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'education') {
      const degreeMatch = trimmed.match(/^(.+?)\s*[|–—]\s*(.+)$/);
      if (degreeMatch && (!currentItem || currentItem.institution)) {
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
    // Nécessaire en prod (Vercel serverless) : sans standardFontDataUrl,
    // pdfjs-dist ne trouve pas les polices standard et échoue → le fallback
    // naïf retournait alors le binaire brut du PDF (%PDF-1.3...) comme "texte".
    // Résolution compatible CJS (import.meta.url est invalide dans un .js CJS).
    let standardFontDataUrl;
    try {
      // Les polices standard de pdfjs-dist vivent dans <pkg>/standard_fonts/
      const pdfjsRoot = require.resolve('pdfjs-dist/package.json').replace(/package\.json$/, '');
      const fontsDir = pdfjsRoot + 'standard_fonts/';
      // Vérifier qu'elles existent (sinon on laisse pdfjs utiliser son défaut)
      const { existsSync } = require('fs');
      standardFontDataUrl = existsSync(fontsDir) ? fontsDir : undefined;
    } catch {
      standardFontDataUrl = undefined;
    }
    const pdf = await getDocument({
      data: new Uint8Array(buffer),
      ...(standardFontDataUrl ? { standardFontDataUrl } : {}),
    }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map(item => item.str || '').join(' ') + '\n';
    }
    return text;
  } catch (e) {
    console.error('[parsers] PDF parse error:', e.message);
    // Fallback: try to decode base64 as plain text — MAIS uniquement si le
    // résultat est du texte lisible (jamais le binaire brut d'un PDF).
    try {
      const decoded = Buffer.from(base64, 'base64').toString('utf-8');
      // Un PDF commence par %PDF — ne jamais renvoyer ça comme texte de CV.
      if (!decoded || decoded.startsWith('%PDF') || decoded.includes('\u0000')) {
        return '';
      }
      // Heuristique : le texte doit être majoritairement lisible (pas du binaire).
      const printable = (decoded.match(/[\x20-\x7EÀ-ÿ\n\r\t]/g) || []).length;
      if (printable / Math.max(decoded.length, 1) < 0.6) return '';
      return decoded;
    } catch {
      return '';
    }
  }
}

module.exports = { parseCVText, parseJobDescription, parseTextFromBase64 };
