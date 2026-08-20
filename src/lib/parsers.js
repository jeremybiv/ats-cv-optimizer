/**
 * Parsers for CV PDF and job description text
 */

// Matches either a US/generic 3-3-4 grouped number or a French mobile number
// ("+33 6 47 17 62 24", "06 47 17 62 24") — the plain 3-3-4 pattern alone
// never matches French formatting (2-1-2-2-2-2 digit groups).
const PHONE_RE = /(\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|(\+33|0)[\s.-]?[1-9](?:[\s.-]?\d{2}){4}/;

/**
 * Parse raw text from PDF into a structured CV object
 * @param {string} pdfText - Raw text extracted from PDF
 * @returns {Object} Structured CV
 */
// Many CV templates render section headers ALL-CAPS with CSS letter-spacing
// ("COMPÉTENCES" -> "C O M P É T E N C E S"). PDF text extraction turns that
// visual letter-spacing into literal space characters between every glyph,
// which defeats both the "<=5 words" header heuristic and the keyword regex
// below (neither "competences" nor a short word count survives being split
// into ten single-character tokens). Detect that pattern - most tokens are
// a single character (occasionally two, when kerning glues two glyphs into
// one run, e.g. "F O R M AT I O N") - and collapse it back into real words
// before running header detection, so these headers aren't silently missed
// (which otherwise leaves the parser stuck in whatever section preceded it,
// dumping every following section's content - skills, education, languages,
// interests - into that section instead).
function despaceHeader(text) {
  // Variante points espacés : "E. X. P. É. R. I. E. N. C. E" ou
  // "E. . X. . P. . É..." (points + espaces entre chaque lettre). On retire
  // les points d'abord, puis on applique la détection espace-par-lettre.
  const dotsRemoved = text.replace(/\.\s*/g, '');
  const tokens = dotsRemoved.split(/\s+/).filter(Boolean);
  if (tokens.length < 3) return text;
  const shortCount = tokens.filter(t => t.length <= 2).length;
  if (shortCount / tokens.length < 0.6) return text;
  return tokens.join('');
}

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
  // True right after an icon/arrow "→ Label : text" interest bullet - a
  // narrow sidebar column commonly wraps that one bullet's text onto the
  // next visual line, which would otherwise be read as a brand new,
  // meaningless interest entry instead of the rest of the same one.
  let lastWasArrowInterest = false;

  // Word-boundary anchored so a real word/title doesn't false-match a header
  // keyword as a substring (e.g. "bac" inside "backend", "lang" inside
  // "language model" in a skills line).
  const sectionHeaders = [
    // "missions/projets/realisations" only count as a header when they
    // *open* the line - unlike "experience", they're common French words
    // that show up inside perfectly ordinary job titles ("Chef de Projet
    // Digital", "Gestion de Missions RH"), which are themselves short
    // header-shaped lines and would otherwise falsely end the CV's contact
    // block right after the name/role and swallow it into "experience".
    { regex: /\b(experience|emploi|travail|career|work|professional)\b|^(missions?|projets?|realisations?)\b/i, key: 'experience' },
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
  // Fallback for when despaceHeader had to fuse a letter-spaced header made
  // of *several* words (e.g. "R É S U M É   P R O F E S S I O N N E L" ->
  // "RESUMEPROFESSIONNEL") - collapsing away the inter-word gap along with
  // the inter-letter ones destroys the trailing \b the strict regex above
  // needs, so "resume" no longer matches once it's glued to "professionnel".
  // Only used when collapsing actually happened, on an already-short
  // candidate header line, so dropping the boundary check there is safe.
  const looseSectionHeaders = sectionHeaders.map(sh => ({
    key: sh.key,
    regex: new RegExp(sh.regex.source.replace(/\\b/g, ''), 'i'),
  }));

  // Reperage d'une ligne "dates de mission", quel que soit le format
  // ("Janvier a fevrier 2022", "2019 - 2020", "Mars 2018 a present"...).
  const MONTHS = 'janvier|fevrier|mars|avril|mai|juin|juillet|aout|septembre|octobre|novembre|decembre|january|february|march|april|may|june|july|august|september|october|november|december';
  const DATE_RANGE_RE = new RegExp(
    '(?:' +
      // "Month? Year (a|\u00e0|-|to) Month? (Year|pr\u00e9sent...)" \u2014 e.g. "2019 - 2020",
      // "Janvier 2022 \u00e0 mars 2023", "Mars 2018 \u00e0 pr\u00e9sent", "2018/2020" (slash).
      '(?:\\b(?:' + MONTHS + ')\\b\\s*)?\\b(?:19|20)\\d{2}\\b\\s*(?:a|\\u00e0|-|\\u2013|\\u2014|/|to)\\s*(?:\\b(?:' + MONTHS + ')\\b\\s*)?(?:\\b(?:19|20)\\d{2}\\b|present|pr\\u00e9sent|actuel|aujourd|current|now)' +
      '|' +
      // "Month (a|\u00e0|-|to) Month Year" \u2014 French idiom sharing one trailing
      // year, e.g. "Juin \u00e0 juillet 2021", "Avril \u00e0 d\u00e9cembre 2022".
      '\\b(?:' + MONTHS + ')\\b\\s*(?:a|\u00e0|-|\u2013|\u2014|to)\\s*\\b(?:' + MONTHS + ')\\b\\s*\\b(?:19|20)\\d{2}\\b' +
    ')',
    'i'
  );

  // Les mois français accentués (février, décembre, août...) ne matchent pas
  // la liste MONTHS ci-dessous (écrite sans accents) quand le texte extrait
  // du PDF les contient avec accents. Normaliser (retirer les accents) avant
  // de tester — cohérent avec la normalisation des en-têtes de section.
  function hasDateRange(text) {
    const normalized = (text || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return DATE_RANGE_RE.test(normalized);
  }

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

  // A narrow sidebar column often wraps a single entry across two visual
  // lines right after its opening "(" - e.g. "Wolof (natif)" printed as
  // "Wolof" then "(natif)" once the comma-separated line it was part of no
  // longer fits. Treated as a fresh item, "(natif)" alone is meaningless
  // noise; it belongs glued back onto whatever was pushed just before it.
  function pushTrackedOrContinue(arr, text, items) {
    if (items.length === 1 && /^\(/.test(items[0]) && arr.length > 0) {
      arr[arr.length - 1] = (arr[arr.length - 1] + ' ' + items[0]).trim();
      trackRaw(text);
      return;
    }
    pushTracked(arr, text, items);
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
    // "Competences" -> "competences" (regex sans accents). On recolle
    // d'abord un eventuel en-tete "espace lettre par lettre" (voir
    // despaceHeader) avant de juger sa forme et son contenu.
    const despacedHeader = despaceHeader(trimmed);
    const normalized = despacedHeader.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const looksLikeHeader = despacedHeader.length <= 40 && despacedHeader.split(/\s+/).length <= 5 && !/[.!?]$/.test(despacedHeader);
    let matchedSection = null;
    if (looksLikeHeader) {
      for (const sh of sectionHeaders) {
        if (sh.regex.test(normalized)) {
          matchedSection = sh.key;
          break;
        }
      }
      if (!matchedSection && despacedHeader !== trimmed) {
        for (const sh of looseSectionHeaders) {
          if (sh.regex.test(normalized)) {
            matchedSection = sh.key;
            break;
          }
        }
      }
      // Stat-tile decoys: some templates put a big number ("9+", "6", "13")
      // next to a 1-2 row caption ("Années d'expérience", "Compétences
      // clés") right under the header, before the CV's actual sections
      // start. Those captions are short, standalone and legitimately
      // contain a section keyword ("expérience", "compétences") so they
      // pass every check above exactly like a real header - but they
      // aren't one. Only suppress while no real section has been entered
      // yet (currentSection is still null): once the CV is past its
      // header/stats block, a nearby number is far more likely to be
      // mundane (a graduation year two lines above "Langues") than another
      // stat caption, so this guard must not reach that far.
      if (matchedSection && currentSection === null && recent.slice(-2).some(r => /^\d+\+?$/.test(r.text))) {
        matchedSection = null;
      }
    }

    // Some CV templates print a lone icon/badge label ("Poste") next to each
    // timeline entry instead of a real icon glyph (font fallback). It never
    // carries information - keep tracking it in `recent` (a date line just
    // after it may still need to reclaim the actual title/company around
    // it) but never file it as real bullet content under whatever section
    // is current.
    if (/^poste$/i.test(trimmed)) {
      trackRaw(trimmed);
      continue;
    }

    if (matchedSection) {
      currentSection = matchedSection;
      lastWasArrowInterest = false;
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
        lastWasArrowInterest = false;
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
        lastWasArrowInterest = true;
      }
      continue;
    }

    // A narrow sidebar wraps one arrow-bullet interest's text onto the next
    // line (e.g. "→ Illustration : dessin numerique et" / "peinture"). That
    // continuation carries no label of its own - glue it back onto the
    // bullet it belongs to instead of filing it as a new, meaningless entry.
    if (lastWasArrowInterest && currentSection === 'interests') {
      cv.interests[cv.interests.length - 1] = (cv.interests[cv.interests.length - 1] + ' ' + trimmed).trim();
      trackRaw(trimmed);
      continue;
    }
    lastWasArrowInterest = false;

    // Detect contact info on early lines
    if (!currentSection && lines.indexOf(line) < 10) {
      const emailMatch = trimmed.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
      if (emailMatch && !cv.email) {
        cv.email = emailMatch[1];
        trackRaw(trimmed);
        continue;
      }
      const phoneMatch = trimmed.match(PHONE_RE);
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
    // A "Company - Location | Dates" line (the second, structured line of a
    // "title line, then company+dates line" entry - see the 'experience'
    // fill logic below) also carries its own date range, but it must be
    // split into company/dates by that logic, not swallowed whole into
    // `dates` by the coarser recovery below.
    // Protéger les dates en-dash : "2018 – 2020 · Lead Developer · BanqueTech"
    // contient un "–" qui ferait matcher looksLikeStructuredJobLine et casser
    // le split (company="2018"). Une vraie ligne "Company | Title" a un | ou
    // – avec du texte NON numérique avant.
    const structuredJobMatch = /^(.+?)\s*[|–—]\s*(.+)$/.exec(trimmed);
    const looksLikeStructuredJobLine = currentSection === 'experience'
      && structuredJobMatch
      && !/^[\d\u2013\u2014.\-/]+$/.test(structuredJobMatch[1].trim())
      && !hasDateRange(structuredJobMatch[1].trim());
    // "dates · titre · société" sur une seule ligne (séparateur · ou |) —
    // format très courant des CV français ("2020-2024 · Lead Developer ·
    // BanqueTech"). Détecté AVANT startExperienceFromDateLine pour que la
    // ligne soit splittée correctement (dates/titre/société) au lieu d'être
    // avalée entière dans `dates` ou récupérée avec les mauvaises lignes.
    const dotSeparatedJobLine = currentSection === 'experience'
      && hasDateRange(trimmed)
      && /[·•|]/.test(trimmed);
    const skipDateRecovery = currentSection === 'education'
      || (currentSection === 'experience' && currentItem && !currentItem.dates)
      || looksLikeStructuredJobLine
      || dotSeparatedJobLine
      // Ligne "Titre - Société (année)" : la date entre parenthèses fait
      // matcher DATE_RANGE_RE ("2017-2020" dans "(2017-2020)") mais cette
      // ligne est déjà gérée par hyphenJobMatch dans la branche experience —
      // le laisser passer par startExperienceFromDateLine volerait la ligne
      // précédente (souvent une description) comme company.
      || (currentSection === 'experience' && /\(\s*(?:19|20)\d{2}/.test(trimmed));
    if (dotSeparatedJobLine) {
      const parts = trimmed.split(/[·•|]/).map(s => s.trim()).filter(Boolean);
      const datePart = parts[0];
      const titlePart = parts.length >= 3 ? parts[1] : parts[1] || '';
      const companyPart = parts.length >= 3 ? parts[2] : '';
      if (currentItem && currentItem.dates && currentItem.dates !== datePart) {
        // Nouvelle mission : on termine l'entrée courante et on en ouvre une
        const newItem = { title: titlePart, company: companyPart, dates: datePart, description: [] };
        cv.experience.push(newItem);
        currentItem = newItem;
      } else {
        currentItem = { title: titlePart, company: companyPart, dates: datePart, description: [] };
        if (!cv.experience.includes(currentItem)) cv.experience.push(currentItem);
      }
      trackRaw(trimmed);
      continue;
    }
    if (hasDateRange(trimmed) && !skipDateRecovery) {
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
      // Just as common as "Company | Title" on one line: the title alone on
      // its own line (a <p class="job-title">), with company/location/dates
      // following on the *next* line - e.g. "Ingenieure Backend Senior"
      // then "DataCorp - Paris | Janvier 2021 - Present". That second line
      // still matches companyMatch (it has a "|"), but its right side is a
      // date range, not a title - it must not clobber the title we already
      // captured with the dates.
      const companyMatchIsDateRange = companyMatch
        && (hasDateRange(companyMatch[2]) || /\b(19|20)\d{2}\b/.test(companyMatch[2]));
      const newJob = (companyMatch || hyphenJobMatch) && (!currentItem || currentItem.company);
      if (newJob) {
        const prevItem = currentItem;
        currentItem = { title: '', company: '', dates: '', description: [] };
        if (companyMatchIsDateRange) {
          // This "Company - Location | Dates" line starts a *new* job (the
          // previous one already had its own company), so the title isn't
          // on this line at all - it's the short plain line right before it
          // (e.g. "Developpeuse Backend"), which - lacking any separator of
          // its own to be recognized in time - had nowhere to go but the
          // previous job's trailing description bullet. Recover it, same
          // as startExperienceFromDateLine does for the equivalent case.
          const prevRaw = recent.length > 0 ? recent[recent.length - 1].text : '';
          if (prevRaw && prevRaw.length <= 70 && !/[|–—]/.test(prevRaw)) {
            currentItem.title = prevRaw;
            reclaim(prevRaw);
            if (prevItem && prevItem.description.length &&
                prevItem.description[prevItem.description.length - 1] === prevRaw) {
              prevItem.description.pop();
            }
          }
        }
        cv.experience.push(currentItem);
      }
      if (!currentItem) {
        currentItem = { title: '', company: '', dates: '', description: [] };
        cv.experience.push(currentItem);
      }
      if (companyMatch && companyMatchIsDateRange && currentItem.title) {
        currentItem.company = currentItem.company || companyMatch[1].trim();
        currentItem.dates = companyMatch[2].trim();
      } else if (companyMatch) {
        currentItem.company = companyMatch[1].trim();
        currentItem.title = companyMatch[2].trim();
      } else if (hyphenJobMatch) {
        currentItem.title = hyphenJobMatch[1].trim();
        currentItem.company = hyphenJobMatch[2].trim();
        currentItem.dates = '(' + hyphenJobMatch[3].trim() + ')';
      } else if (trimmed.match(/^\d{4}/) || trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else if (!currentItem.title && !currentItem.company) {
        // Nothing captured yet for this entry - the first plain content
        // line right under a fresh "Experience" entry is the job title,
        // not a bullet (a real bullet only ever follows a title/company).
        currentItem.title = trimmed;
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
      } else if (/^.+?\s*\((?:19|20)\d{2}[^)]*\)\s*$/.test(trimmed) && currentItem.degree && !currentItem.institution) {
        // "Institution (Year)" following an already-known degree line
        // (mirrors the experience "Company - Location | Dates" case above).
        const m = trimmed.match(/^(.+?)\s*\(((?:19|20)\d{2}[^)]*)\)\s*$/);
        currentItem.institution = m[1].trim();
        currentItem.dates = '(' + m[2].trim() + ')';
      } else if (trimmed.match(/20\d{2}/)) {
        currentItem.dates = trimmed;
      } else if (!currentItem.degree && !currentItem.institution) {
        // Same "title on its own line" shape as experience entries: the
        // degree name (e.g. "Master Management de Projet") often precedes
        // the institution/date line rather than sharing it.
        currentItem.degree = trimmed;
      } else {
        currentItem.description.push(trimmed);
      }
    } else if (currentSection === 'skills') {
      // Split by common separators
      const skillItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTrackedOrContinue(cv.skills, trimmed, skillItems);
    } else if (currentSection === 'certifications') {
      // Split by common separators (une certif par ligne ou separees par virgules)
      const certItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTrackedOrContinue(cv.certifications, trimmed, certItems);
    } else if (currentSection === 'languages') {
      // Split par virgule/point-virgule : "Francais, Anglais" -> 2 entrees
      const langItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTrackedOrContinue(cv.languages, trimmed, langItems);
    } else if (currentSection === 'interests') {
      // Une ligne "Lecture, Randonnee, Photographie" -> 3 entrees ; une ligne
      // de prose libre (frequente sous "Centres d'interet") reste telle quelle.
      const interestItems = trimmed.split(/[,;\u2022|]/).map(s => s.trim()).filter(Boolean);
      pushTrackedOrContinue(cv.interests, trimmed, interestItems);
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

  // Contact info is normally only looked for in the first 10 lines, which
  // assumes a roughly linear reading order. Multi-column CVs can land the
  // contact block well past that (e.g. after a whole "profile" sidebar gets
  // extracted first) — fall back to a full-text scan so the email/phone
  // aren't silently dropped just because of where they ended up in the
  // reconstructed text.
  if (!cv.email) {
    const emailMatch = pdfText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+)/);
    if (emailMatch) cv.email = emailMatch[1];
  }
  if (!cv.phone) {
    const phoneMatch = pdfText.match(PHONE_RE);
    if (phoneMatch) cv.phone = phoneMatch[0];
  }

  // Nettoyage : retirer les entrées vides créées par un header de section qui
  // n'a jamais reçu de contenu (ex: header "Expérience" suivi directement
  // d'une ligne de dates — la 1ère vraie ligne a créé sa propre entrée, le
  // placeholder initial reste vide).
  cv.experience = cv.experience.filter(e => e.title || e.company || e.dates || e.description.length > 0);
  cv.education = cv.education.filter(e => e.degree || e.institution || e.dates || e.description.length > 0);

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

// Only insert a space between two adjacent text runs when there's an actual
// horizontal gap between them (relative to font size) — otherwise a
// style/font change mid-word (drop caps, bold spans) would wrongly split
// words like "Conception" into "C onception".
function joinItemsWithSpacing(items) {
  let line = '';
  let prevEndX = null;
  for (const item of items) {
    const str = item.str || '';
    if (!str) continue;
    const tx = item.transform || [1, 0, 0, 1, 0, 0];
    const startX = tx[4];
    const fontSize = Math.hypot(tx[2], tx[3]) || Math.hypot(tx[0], tx[1]) || 10;
    if (prevEndX !== null) {
      const gap = startX - prevEndX;
      if (gap > fontSize * 0.15 && !line.endsWith(' ') && !/^\s/.test(str)) {
        line += ' ';
      }
    }
    line += str;
    prevEndX = startX + (item.width || 0);
  }
  return line.trim();
}

// Groups items (already restricted to one column) into visual rows by
// y-proximity, preserving their relative order, then joins each row into a
// line. Used for the multi-column path, where pdf.js's own hasEOL signal
// isn't reliable (it's computed against the interleaved, unfiltered stream).
function extractColumnText(items) {
  const rows = [];
  for (const item of items) {
    if (!item.str) continue;
    const tx = item.transform || [1, 0, 0, 1, 0, 0];
    const y = tx[5];
    const fontSize = Math.hypot(tx[2], tx[3]) || Math.hypot(tx[0], tx[1]) || 10;
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.y - y) < fontSize * 0.5) {
      last.items.push(item);
    } else {
      rows.push({ y, items: [item] });
    }
  }
  return rows.map(r => joinItemsWithSpacing(r.items)).filter(Boolean).join('\n');
}

// Detects a vertical "gap band" that separates two columns of a sidebar-style
// CV (a distinct left column and a wider main column, or vice versa). Votes
// per horizontal bin across many y-bands, so a full-width header/footer row
// (which naturally has no gap) doesn't hide a gap that's consistently present
// across the rest of the page. Returns the gap's midpoint X, or null when the
// page looks like a normal single-column document.
function detectColumnSplitX(items, pageWidth) {
  if (!items.length || !pageWidth) return null;
  const BANDS = 40;
  const BIN_COUNT = 60;
  const ys = items.map(it => it.transform[5]);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const bandHeight = (maxY - minY) / BANDS || 1;
  const votes = new Array(BIN_COUNT).fill(0);
  let bandsWithContent = 0;
  for (let b = 0; b < BANDS; b++) {
    const bandMinY = minY + b * bandHeight;
    const bandMaxY = bandMinY + bandHeight;
    const bandItems = items.filter(it => it.transform[5] >= bandMinY && it.transform[5] < bandMaxY);
    if (bandItems.length < 2) continue;
    bandsWithContent++;
    const covered = new Array(BIN_COUNT).fill(false);
    for (const it of bandItems) {
      const x0 = it.transform[4];
      const x1 = x0 + (it.width || 0);
      const b0 = Math.max(0, Math.floor((x0 / pageWidth) * BIN_COUNT));
      const b1 = Math.min(BIN_COUNT - 1, Math.ceil((x1 / pageWidth) * BIN_COUNT));
      for (let bin = b0; bin <= b1; bin++) covered[bin] = true;
    }
    for (let bin = Math.floor(BIN_COUNT * 0.12); bin < Math.ceil(BIN_COUNT * 0.88); bin++) {
      if (!covered[bin]) votes[bin]++;
    }
  }
  if (bandsWithContent < 4) return null;
  const threshold = bandsWithContent * 0.6;
  let bestRun = null;
  let runStart = -1;
  const considerRun = (s, e) => {
    const widthBins = e - s + 1;
    if (widthBins >= BIN_COUNT * 0.03 && (!bestRun || widthBins > bestRun.e - bestRun.s)) {
      bestRun = { s, e };
    }
  };
  for (let b = 0; b < BIN_COUNT; b++) {
    if (votes[b] >= threshold) {
      if (runStart === -1) runStart = b;
    } else if (runStart !== -1) {
      considerRun(runStart, b - 1);
      runStart = -1;
    }
  }
  if (runStart !== -1) considerRun(runStart, BIN_COUNT - 1);
  if (!bestRun) return null;
  return ((bestRun.s + bestRun.e + 1) / 2 / BIN_COUNT) * pageWidth;
}

// Reconstructs one page's text. Sidebar-style CVs (a narrow profile/skills
// column next to a wider experience column) get their text runs written to
// the PDF's content stream in whatever order the design tool laid them out
// in — often the whole main column, then the whole sidebar, or interleaved
// row-by-row — which has nothing to do with reading order. Extracting
// linearly then produces text where sidebar headers ("Profil", "Formation")
// land in the middle of an unrelated job description. When a page has a
// clear two-column layout we split items by X position first (preserving
// each column's own relative order) and extract each column separately;
// single-column pages keep the simpler, already-proven hasEOL-based path.
function extractPageText(items, pageWidth) {
  const textItems = items.filter(it => it.str);
  if (!textItems.length) return '';
  const splitX = detectColumnSplitX(textItems, pageWidth);
  if (splitX == null) {
    let text = '';
    let line = '';
    let prevEndX = null;
    let prevEndY = null;
    for (const item of items) {
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
    return text;
  }
  const left = [];
  const right = [];
  for (const item of textItems) {
    const tx = item.transform;
    const center = tx[4] + (item.width || 0) / 2;
    (center < splitX ? left : right).push(item);
  }
  const leftText = extractColumnText(left);
  const rightText = extractColumnText(right);
  return [leftText, rightText].filter(Boolean).join('\n') + '\n';
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
      const viewport = page.getViewport({ scale: 1 });
      text += extractPageText(content.items, viewport.width);
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
