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
    interests: [],
  };

  let currentSection = null;
  let currentItem = null;

  // Word-boundary anchored so a real word/title doesn't false-match a header
  // keyword as a substring (e.g. "bac" inside "backend", "lang" inside
  // "language model" in a skills line).
  const sectionHeaders = [
    { regex: /\b(experience|emploi|travail|career|work|professional|missions?|projets?|realisations?)\b/i, key: 'experience' },
    { regex: /\b(education|formation|etudes|diplome|degree|school|university|college|bac)\b/i, key: 'education' },
    { regex: /\b(competences|skills|technologies|tools|langages|programming)\b/i, key: 'skills' },
    { regex: /\b(certifications|certificates|certificat)\b/i, key: 'certifications' },
    { regex: /\b(langues|languages|lang)\b/i, key: 'languages' },
    { regex: /\b(resume|summary|profil|profile|about|objectif)\b/i, key: 'summary' },
    { regex: /\b(interets?|hobbies|loisirs|passions?)\b/i, key: 'interests' },
    // Liens/reseaux ne sont jamais une liste de contenu a conserver telle
    // quelle (juste des pointeurs externes) - les reconnaitre comme un
    // en-tete ferme la section precedente au lieu de laisser une URL
    // github.com/... continuer a s'empiler dedans (ex: juste apres
    // "Langues", un bloc "Social" + une URL ne sont pas des langues).
    { regex: /\b(social|reseaux|liens|portfolio)\b/i, key: 'links' },
  ];

  // Reperage d'une ligne "dates de mission", quel que soit le format
  // ("Janvier a fevrier 2022", "2019 - 2020", "Mars 2018 a present"...).
  const MONTHS = 'janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|january|february|march|april|may|june|july|august|september|october|november|december';
  const DATE_RANGE_RE = new RegExp(
    '(?:' +
      // "Month? Year (a|\u00e0|-|to) Month? (Year|pr\u00e9sent...)" \u2014 e.g. "2019 - 2020",
      // "Janvier 2022 \u00e0 mars 2023", "Mars 2018 \u00e0 pr\u00e9sent".
      '(?:\\b(?:' + MONTHS + ')\\b\\s*)?\\b(?:19|20)\\d{2}\\b\\s*(?:a|\u00e0|-|\u2013|\u2014|to)\\s*(?:\\b(?:' + MONTHS + ')\\b\\s*)?(?:\\b(?:19|20)\\d{2}\\b|present|pr\u00e9sent|actuel|aujourd|current|now)' +
      '|' +
      // "Month (a|\u00e0|-|to) Month Year" \u2014 French idiom sharing one trailing
      // year, e.g. "Juin \u00e0 juillet 2021", "Avril \u00e0 d\u00e9cembre 2022".
      '\\b(?:' + MONTHS + ')\\b\\s*(?:a|\u00e0|-|\u2013|\u2014|to)\\s*\\b(?:' + MONTHS + ')\\b\\s*\\b(?:19|20)\\d{2}\\b' +
    ')',
    'i'
  );

  // Les 2-3 dernieres lignes "brutes" vues, avec (si elles ont ete rangees
  // quelque part) le tableau + les items qu'elles y ont ajoutes - pour
  // pouvoir les recuperer si une ligne de dates revele apres coup qu'elles
  // etaient en fait le nom d'une entreprise / un intitule de poste egares
  // dans la mauvaise section (typiquement "Langues") plutot que de la
  // vraie donnee de cette section.
  const recent = [];
  function trackRaw(text, arr, items) {
    recent.push({ text, arr: arr || null, items: items || null });
    if (recent.length > 3) recent.shift();
  }
  function reclaim(text) {
    for (const r of recent) {
      if (r.text === text && r.arr && r.items) {
        for (const it of r.items) {
          const idx = r.arr.lastIndexOf(it);
          if (idx !== -1) r.arr.splice(idx, 1);
        }
        r.arr = null; // ne pas reclaim deux fois la meme ligne
      }
    }
  }
  function pushTracked(arr, text, items) {
    arr.push(...items);
    trackRaw(text, arr, items);
  }

  // Une ligne de dates hors d'une entree "experience" deja ouverte demarre
  // une nouvelle mission - on va chercher le nom d'entreprise / intitule
  // dans les 1-2 lignes precedentes (le format le plus courant sur un CV
  // freelance est "Entreprise" / "Lieu - Poste" / "Mois annee a mois annee"),
  // et on les retire de la ou elles avaient ete (mal) rangees.
  function startExperienceFromDateLine(dateLine) {
    const prev1 = recent.length > 0 ? recent[recent.length - 1].text : '';
    const prev2 = recent.length > 1 ? recent[recent.length - 2].text : '';
    let company = '';
    let title = '';
    // popOrder holds exactly the raw lines actually consumed into
    // title/company, most-recent-first - i.e. in the same order they'd
    // appear at the tail of a preceding item's `description` if they'd
    // leaked in there before this recovery kicked in.
    const popOrder = [];
    if (prev1 && /[\u2014\u2013-]/.test(prev1) && prev1.length <= 70) {
      title = prev1;
      company = prev2 && prev2.length <= 50 ? prev2 : '';
      popOrder.push(prev1);
      if (company) popOrder.push(prev2);
    } else {
      company = prev1 || '';
      if (company) popOrder.push(prev1);
    }
    if (title) reclaim(prev1);
    if (company) reclaim(company === prev1 ? prev1 : prev2);
    // Si les lignes qu'on vient de recuperer avaient deja ete ajoutees en
    // description du job precedent (avant qu'on comprenne qu'elles
    // appartenaient au suivant - un en-tete n'a pas toujours suspendu la
    // section entre-temps), on les retire pour eviter le doublon. On ne
    // depile jamais plus que ce qui a reellement ete consomme ci-dessus,
    // et seulement si ca correspond exactement, dans l'ordre - pour ne
    // jamais toucher a du contenu legitime qui precede.
    let popIdx = 0;
    while (
      currentItem && currentItem.description && currentItem.description.length > 0 &&
      popIdx < popOrder.length
    ) {
      const last = currentItem.description[currentItem.description.length - 1];
      if (last === popOrder[popIdx]) {
        currentItem.description.pop();
        popIdx++;
      } else {
        break;
      }
    }
    currentItem = { title, company, dates: dateLine, description: [] };
    cv.experience.push(currentItem);
    currentSection = 'experience';
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check for section headers. A real header is short and standalone
    // (e.g. "Experience", "Formation") - without this guard, an ordinary
    // sentence that merely mentions a keyword (e.g. "5 ans d'experience en
    // systemes distribues.") gets misread as a new section and wipes out
    // the real content that follows.
    // Normalise les accents pour matcher "Experience" -> "experience",
    // "Competences" -> "competences" (regex sans accents).
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
      trackRaw(trimmed);
      continue;
    }

    // Sidebar-style CVs sometimes pack several unlabeled sub-blocks under one
    // visible header, each introduced by an icon/arrow bullet
    // ("→ Langues : français, anglais", "→ Live streaming (Twitch) : ...").
    // Without this, everything after the first real header (e.g. "Langues")
    // keeps accumulating into that same field forever — hobbies, streaming,
    // hardware projects end up mislabeled as languages. Route each bullet by
    // its own label instead of blindly trusting the section we're still in.
    const arrowBulletMatch = trimmed.match(/^[→▸►]\s*([^:]{2,40}):\s*(.*)$/);
    if (arrowBulletMatch) {
      const rawLabel = arrowBulletMatch[1].trim();
      const label = rawLabel.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const rest = arrowBulletMatch[2].trim();
      if (/\blangue/.test(label)) {
        currentSection = 'languages';
        const langItems = rest.split(/[,;•|]|\s-\s/).map(s => s.trim()).filter(Boolean);
        cv.languages.push(...langItems);
      } else {
        // Not a language sub-block — this is exactly what a "Centres
        // d'interet" section holds (hobby/passion + a one-line description),
        // just formatted as an icon bullet instead of a labeled section.
        // Keep the candidate's own label rather than dropping the content.
        currentSection = 'interests';
        currentItem = null;
        cv.interests.push(rest ? `${rawLabel} : ${rest}` : rawLabel);
      }
      continue;
    }

    // Detect contact info on early lines
    if (!currentSection && lines.indexOf(line) < 10) {
      const emailMatch = trimmed.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      if (emailMatch && !cv.email) {
        cv.email = emailMatch[1];
        trackRaw(trimmed);
        continue;
      }
      const phoneMatch = trimmed.match(/(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
      if (phoneMatch && !cv.phone) {
        cv.phone = phoneMatch[0];
        trackRaw(trimmed);
        continue;
      }
      if (!cv.name && !emailMatch && !phoneMatch && trimmed.length < 60) {
        cv.name = trimmed;
        trackRaw(trimmed);
        continue;
      }
      if (!cv.summary && trimmed.length > 25) {
        cv.summary = trimmed;
        trackRaw(trimmed);
        continue;
      }
    }

    // Une ligne de dates qui n'est pas la premiere date de l'entree
    // "experience" en cours (ou qui apparait hors de la section experience)
    // signale une nouvelle mission - quelle que soit la section "courante"
    // au moment ou le state machine (mal informe par des en-tetes absents
    // ou un texte extrait en ordre de colonnes melange) pensait se trouver.
    // Sans ce filet, tout le reste du CV apres le dernier en-tete reconnu
    // (typiquement "Langues") finit empile comme un bloc de texte plat
    // dans cette meme section.
    // "education" est explicitement exclue : ses propres dates de diplome
    // sont deja gerees par la branche degreeMatch/hyphenEduMatch ci-dessous
    // et ne doivent jamais etre reinterpretees comme une nouvelle mission.
    const skipDateRecovery = currentSection === 'education'
      || (currentSection === 'experience' && currentItem && !currentItem.dates);
    if (DATE_RANGE_RE.test(trimmed) && !skipDateRecovery) {
      startExperienceFromDateLine(trimmed);
      trackRaw(trimmed);
      continue;
    }

    // Fill based on current section
    if (currentSection === 'experience') {
      // A "Company | Title" line always starts a new job entry - a CV section
      // usually lists several jobs under one "Experience" header, so without
      // this a second job would get folded into the first one's description.
      const companyMatch = trimmed.match(/^(.+?)\s*[|\u2013\u2014]\s*(.+)$/);
      // French CVs often use "Title - Company (year)" with a plain hyphen -
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
      const degreeMatch = trimmed.match(/^(.+?)\s*[|\u2013\u2014]\s*(.+)$/);
      // French CVs: "Diploma - Institution (year)" - detect with plain hyphen
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
      const skillItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTracked(cv.skills, trimmed, skillItems);
    } else if (currentSection === 'certifications') {
      // Split by common separators (une certif par ligne ou separees par virgules)
      const certItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTracked(cv.certifications, trimmed, certItems);
    } else if (currentSection === 'languages') {
      // Split par virgule/point-virgule : "Francais, Anglais" -> 2 entrees
      const langItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTracked(cv.languages, trimmed, langItems);
    } else if (currentSection === 'interests') {
      // Une ligne "Lecture, Randonnee, Photographie" -> 3 entrees ; une ligne
      // de prose libre (frequente sous "Centres d'interet") reste telle quelle.
      const interestItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTracked(cv.interests, trimmed, interestItems);
    } else if (currentSection === 'summary') {
      cv.summary = cv.summary ? cv.summary + ' ' + trimmed : trimmed;
      trackRaw(trimmed);
      continue;
    } else {
      // currentSection === 'links' (or none yet): intentionally not stored
      // anywhere - only kept in `recent` so a later date line can still
      // recover it as a company/role if it turns out to be one.
      trackRaw(trimmed);
      continue;
    }
    trackRaw(trimmed);
  }

  // Deduplicate skills
  cv.skills = [...new Set(cv.skills.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // Deduplicate certifications & languages
  cv.certifications = [...new Set(cv.certifications.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));
  cv.languages = [...new Set(cv.languages.map(s => s.toLowerCase()))]
    .map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // Interests are often full sentences ("Twitch", "Vue.js", acronyms) —
  // dedupe on exact match only, without the lowercase/recapitalize pass
  // used above (that would mangle casing everywhere but the first letter).
  cv.interests = [...new Set(cv.interests.filter(Boolean))];

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
    title: extractJobTitle(jobText),
    company: '',
    description: jobText,
  };
}

/**
 * Best-effort job title extraction from a pasted/fetched job description.
 * Never fabricates a title — returns '' when nothing title-like can be
 * found, so callers can simply omit the "titre du poste" line instead of
 * falling back to a literal placeholder ("Titre du poste visé") that used
 * to leak straight into the generated CV whenever this returned nothing.
 * @param {string} jobText
 * @returns {string}
 */
function extractJobTitle(jobText) {
  if (!jobText || typeof jobText !== 'string') return '';
  const lines = jobText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return '';

  // Explicit "Poste : X" / "Job title: X" style metadata lines — job boards
  // and copy-pasted postings often put one near the top.
  const labelRe = /^(poste|intitule du poste|titre du poste|job title|position|role)\s*[:\-–]\s*(.{3,90})$/i;
  for (const line of lines.slice(0, 15)) {
    const normalized = line.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const m = normalized.match(labelRe);
    if (m) return line.slice(line.search(/[:\-–]/) + 1).trim().replace(/^[:\-–]\s*/, '').replace(/[.,;]+$/, '');
  }

  // "Nous recherchons un(e) X" / "X recrute un(e) Y" style opening sentences.
  const seekingRe = /\b(?:recherch(?:e|ons|e activement)|recrut(?:e|ons))\s+(?:un|une|des)?\s*([a-zA-ZÀ-ÿ0-9 /\-&'’]{3,60}?)(?=\s+(?:h\/f|f\/h|\(h\/f\)|pour|afin|chez|au sein|en cdi|en cdd)\b|[.,\n]|$)/i;
  for (const line of lines.slice(0, 20)) {
    const m = line.match(seekingRe);
    if (m && m[1] && m[1].trim().length >= 3) return m[1].trim();
  }

  // Otherwise: the very first non-empty line, if it reads like a heading
  // (short, no terminal punctuation) rather than a full sentence — job
  // postings very commonly open with the title on its own line.
  const first = lines[0];
  if (first.length <= 90 && first.split(/\s+/).length <= 12 && !/[.!?]$/.test(first)) {
    return first;
  }

  return '';
}

/**
 * Extract text from a base64-encoded PDF using pdfjs-dist
 * @param {string} base64 - Base64-encoded PDF
 * @returns {Promise<string>} Extracted text
 */
async function parseTextFromBase64(base64) {
  if (!base64) return '';
  try {
    // pdfjs-dist 3.x : version CommonJS native — fiable en Vercel serverless
    // (la 4.x est ESM-only (.mjs) et son import dynamique échoue en prod)
    const pdfjs = require('pdfjs-dist/legacy/build/pdf.js');
    // Force le file tracing de Next à inclure le worker : pdfjs le charge via
    // eval("require")("./pdf.worker.js") (fake worker en Node) — invisible
    // pour le tracing → worker absent du déploiement serverless → parse vide.
    // Un require statique ici garantit que Next l'embarque dans le bundle.
    require('pdfjs-dist/legacy/build/pdf.worker.js');
    const buffer = Buffer.from(base64, 'base64');
    const pdf = await pdfjs.getDocument({
      data: new Uint8Array(buffer),
      // disableFontFace : on n'extrait que du TEXTE (getTextContent) — pas de
      // rendu. Sans ça, pdfjs tente de charger les polices standard
      // (LiberationSans-*.ttf) qui sont ABSENTES du bundle serverless Vercel
      // → exception avant l'extraction → CV vide.
      disableFontFace: true,
      useSystemFonts: false,
    }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // pdf.js reports each text run as a separate item — joining them all
      // with a single space (the old behaviour) collapsed an entire page
      // into one giant line, which broke parseCVText's line-by-line section
      // detection (it needs real line breaks to tell "Expérience" the
      // header from a sentence that happens to contain the word). Each item
      // carries hasEOL, pdf.js's own signal that a line ends after it —
      // use that to reconstruct the PDF's actual line breaks.
      // Some PDFs (drop-cap first letters, styled spans) split a single word
      // across several text-runs with NO actual gap between them — always
      // inserting a space here turned "Conception" into "C onception",
      // "Intégration" into "I ntégration", etc. Only add a space when the
      // next item's start X actually sits past the previous item's end X by
      // more than a small fraction of the font size — i.e. there's a real
      // visual gap, not just a style/font change mid-word.
      let line = '';
      let prevEndX = null;
      let prevEndY = null;
      for (const item of content.items) {
        const str = item.str || '';
        if (str) {
          const tx = item.transform || [1, 0, 0, 1, 0, 0];
          const startX = tx[4];
          const y = tx[5];
          const fontSize = Math.hypot(tx[2], tx[3]) || Math.hypot(tx[0], tx[1]) || 10;
          const sameLine = prevEndY === null || Math.abs(y - prevEndY) < fontSize * 0.5;
          if (prevEndX !== null && sameLine) {
            const gap = startX - prevEndX;
            if (gap > fontSize * 0.15 && !line.endsWith(' ') && !/^\s/.test(str)) {
              line += ' ';
            }
          } else if (prevEndX !== null && !sameLine && !line.endsWith(' ')) {
            line += ' ';
          }
          line += str;
          prevEndX = startX + (item.width || 0);
          prevEndY = y;
        }
        if (item.hasEOL) {
          text += line.trim() + '\n';
          line = '';
          prevEndX = null;
          prevEndY = null;
        }
      }
      if (line.trim()) text += line.trim() + '\n';
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

module.exports = { parseCVText, parseJobDescription, parseTextFromBase64, extractJobTitle };
