# Changelog

## 2026-10-03
- [fix] Réinitialiser ne vidait pas l'`<input type="file">` : re-sélectionner le même CV après un reset ne redéclenchait pas `onChange` → aucun CV rattaché à la requête → CV générique « Candidat » avec placeholders (`email@exemple.com`, « Diplome et formation pertinente. »). Le reset vide désormais l'input DOM (issue #55)
- [fix] Le CV source et l'offre sont désormais tous deux requis : bouton « Optimiser mon CV » désactivé sinon (au lieu d'une génération silencieuse sans CV), et `POST /api/optimize` renvoie 400 si aucun CV n'est fourni (issue #55)

## 2026-07-31
- [feat] Lettre de motivation IA (cover letter) générée depuis le CV + l offre (PR #27)
- [feat] Historique : bouton dans le header, liste des CV sauvegardés, restauration au clic + sauvegarde auto après optimisation (PR #29)
- [feat] Préparer ton entretien : questions générées depuis l offre (PR #28)
- [feat] Comparer avant/après : dialog 2 colonnes (CV original vs optimisé) avec mots-clés surlignés (vert / barres rouges) (PR #26)
- [feat] Export Word : bouton « Télécharger Word » (.doc) avec headers Word XML + fallback HTML brut (PR #25)
