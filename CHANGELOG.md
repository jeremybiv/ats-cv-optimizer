# Changelog

## 2026-10-21
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
