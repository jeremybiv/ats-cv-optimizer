## 2026-10-24 (score de confiance + repli LLM à l'extraction)

- [feat] **`src/lib/cvConfidence.js`** — score de 0 à 100 qui mesure la fiabilité d'une extraction de CV. Le parseur ne savait pas qu'il échouait : sur un CV LaTeX deux colonnes il renvoyait `{title: "Machine Learning: Research on machine learning for portfolio…", company: "◦ Research Assistant"}` sans aucun signal. Un CV faux avec un bon score est pire qu'un échec visible.
- [feat] **`src/lib/cvLLMExtract.js`** — repli LLM (Gemini 3, `temperature: 0`) déclenché uniquement quand le score passe sous **60/100**. Le déterministe traite la majorité des CV sans coût ; le LLM ne sert que de filet pour les mises en page qu'aucune regex ne couvre.
- [feat] **`scripts/test_score_cv.js`** — harnais de mesure qui compare AVANT/APRÈS sur les CV disponibles.

### Mesure réelle

| CV | Déterministe | Repli LLM | Gain |
|---|---|---|---|
| `cvPropre.pdf` (Paul Legrand, 422 car.) | **100/100** ✅ | non déclenché (0 €) | — |
| CV LaTeX 2 colonnes (Sourabh Bajaj, 5 279 car.) | **35/100** ❌ | **95/100** ✅ en 22 s | **+60** |

Sur le CV LaTeX, le LLM retrouve : 4 expériences correctes (Software Engineer — Google, Senior — Coursera, Data Scientist — Lucena Research), 2 formations (Georgia Tech, BITS) et 8 compétences — là où le déterministe produisait des titres qui étaient des descriptions.

### Détection durcie

Premier essai : le CV LaTeX obtenait **80/100**, donc le repli ne se déclenchait pas. Trois contrôles ajoutés :

- `TITRE_MAX` abaissé de 120 à **70** caractères (un intitulé de poste réel dépasse rarement 70)
- titre contenant `:` **suivi d'une phrase** (> 6 mots) → suspect
- titre de plus de **10 mots** → c'est une phrase
- `company` commençant par une **puce** (`•◦▪‣→`) → titre/entreprise inversés, **−15** par occurrence

### Robustesse

- `temperature: 0` → même CV = même JSON
- `responseMimeType: application/json` → pas de texte parasite
- `reparer()` normalise la sortie : une chaîne là où on attend un tableau est convertie
- Fallback de modèles : `gemini-3.1-flash-lite` → `gemini-flash-lite-latest` (testé : le premier a renvoyé 503, le second a pris le relais)

### Coût

~0,0003 €/CV quand le repli se déclenche, soit ~20 % du volume. Les CV déjà bien parsés coûtent **0 €**.

## 2026-10-24 (UX — bouton « Optimiser » expliqué)

- [fix] **#85** : le bouton « 🚀 Optimiser mon CV » restait désactivé sans aucune explication quand il manquait le CV **ou** l'offre d'emploi. L'utilisateur croyait que son CV était refusé. Un bandeau orange indique désormais précisément ce qui manque : « ⚠️ Il manque ton CV et l'offre d'emploi pour lancer l'optimisation ».
- Cause réelle : la condition `disabled` exige **le CV ET l'offre** (`(cvFile || linkedinData || …) && (jobUrl || jobText)`). Ce n'était donc pas un bug de parsing — mais l'absence de message en faisait un bug UX bloquant.
- Le bandeau n'apparaît que si quelque chose manque, et s'efface dès que les deux sont fournis.

## 2026-10-24 (parseur — format « Titre - Entreprise - Dates »)

- [fix] **Expérience** (#83) : « Data analyst - DataCorp - 2020 - present » mettait tout le texte dans `title` et laissait `company` vide. Le tiret sert à la fois de séparateur de champs et de séparateur de dates. On isole désormais la plage de dates en fin de ligne, puis on découpe le reste.
- [fix] **Formation** (#84) : « Master Data Science - Universite Lyon 2 - 2018 - 2020 » absorbait toute la ligne dans `dates`, laissant `degree` et `institution` vides. `dashEduDate` ne couvrait que les dates en tête ; ajout de la branche symétrique (dates en fin).
- Mesuré sur `cvPropre.pdf` (422 car.) : `{title: "Data analyst", company: "DataCorp"}` et `{degree: "Master Data Science", institution: "Universite Lyon 2"}`.
- ⚠️ Régression **préexistante** constatée (déjà présente sur master) : le format « BanqueTech | Lead Developer | 2020-2024 » ne produit qu' 1 expérience au lieu de 2. Non corrigée ici, documentée en issue.

# Changelog

## 2026-10-21
- [fix] **Formations perdues — séparateur point médian `·`** : `2012-2014 · Master Informatique · Université Lyon 1` n'était géré par aucune branche côté `education` (`dashEduDate` attend un tiret, `degreeMatch` ne connaît que `|` `–` `—`) → le fallback `trimmed.match(/20\d{2}/)` avalait **toute la ligne dans `dates`**, `degree` et `institution` restaient vides et la formation suivante fusionnait. Ajout de la branche `dotSeparatedEdu`, symétrique de `dotSeparatedJobLine` (expérience). Vérifié sur un vrai PDF : **2 formations extraites** (Master Lyon 1 / Licence Lyon 2) au lieu d'1 vide.
- [fix] **Scripts de test non exécutables** : `scripts/fuzz_cv.js` et `scripts/regression_test.js` utilisaient `require('./src/lib/parsers.js')` alors qu'ils vivent dans `scripts/` → `MODULE_NOT_FOUND`. Chemins relatifs corrigés (`../src/lib/parsers.js`).
- [fix] **Expériences manquantes / données décalées** : `2018 au 2020` n'était pas reconnu comme plage de dates (« au » absent des séparateurs de `DATE_RANGE_RE`) → la ligne était traitée comme une simple ligne de dates, l'expérience précédente récupérait le titre de la suivante et **une expérience sur trois disparaissait**. Ajout de `au` / `aux` / `jusqu'à` (avec ou sans accent, apostrophe droite ou typographique).
- [fix] **En-têtes de section letter-spaced non détectés** : `F. . O. . R. . M. . A. . T. . I. . O. . N` — les points collaient tout en un seul token (`FORMATION`), et l'ancien garde-fou renvoyait le texte **original avec ses points** → en-tête jamais reconnu (0 formation, expériences perdues). Le dé-espacement repart maintenant du texte brut découpé sur points **et** espaces multiples.
- [fix] **En-têtes numérotés** (`1. E. X. P. É. R. I. E. N. C. E`) : le numéro de section était recollé au mot (`1EXPERIENCE...`) et invalidait le garde-fou alphabétique. Les numéros isolés sont retirés avant recollement.
- [test] Fuzzer CV (60 variantes, seed `20260820`) : **38/60 → 60/60**. Non-régression : **12/12** formats historiques (hyphen-years, pipe, letter-spaced, points, anglais, pluriel, dates ISO, mois accentués, « au », résumé, langues/certifs, hobbies).

## 2026-10-03
- [fix] Réinitialiser ne vidait pas l'`<input type="file">` : re-sélectionner le même CV après un reset ne redéclenchait pas `onChange` → aucun CV rattaché à la requête → CV générique « Candidat » avec placeholders (`email@exemple.com`, « Diplome et formation pertinente. »). Le reset vide désormais l'input DOM (issue #55)
- [fix] Le CV source et l'offre sont désormais tous deux requis : bouton « Optimiser mon CV » désactivé sinon (au lieu d'une génération silencieuse sans CV), et `POST /api/optimize` renvoie 400 si aucun CV n'est fourni (issue #55)

## 2026-07-31
- [feat] Lettre de motivation IA (cover letter) générée depuis le CV + l offre (PR #27)
- [feat] Historique : bouton dans le header, liste des CV sauvegardés, restauration au clic + sauvegarde auto après optimisation (PR #29)
- [feat] Préparer ton entretien : questions générées depuis l offre (PR #28)
- [feat] Comparer avant/après : dialog 2 colonnes (CV original vs optimisé) avec mots-clés surlignés (vert / barres rouges) (PR #26)
- [feat] Export Word : bouton « Télécharger Word » (.doc) avec headers Word XML + fallback HTML brut (PR #25)
