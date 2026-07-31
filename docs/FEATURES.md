# Fonctionnalités — ATS CV Optimizer

| Feature | Description |
|---|---|
| Score ATS live | Note sur 100 calculée en temps réel selon les mots-clés de l'offre d'emploi |
| Template selector (Pro / ATS Strict) | Choix entre un template visuel moderne (Pro) et un template minimaliste (ATS Strict) |
| Import LinkedIn | Récupération du profil LinkedIn pour pré-remplir le CV |
| Export PDF | Téléchargement du CV optimisé en PDF (html2pdf.js) |
| Export Word | Téléchargement du CV optimisé au format Word |
| Partage recruteur + badge viral | Lien public unique (`/cv/[id]`) avec badge « CV optimisé par ATS CV Optimizer » |
| Mode entretien | Génération de questions d'entretien IA via l'API DeepSeek |
| Multi-langue FR/EN | Interface et CV générés en français ou en anglais |
| Comparaison avant/après | Affichage côte à côte du CV d'origine et du CV optimisé |
| Historique CV | Sauvegarde et consultation des CV générés (`/api/history`) |
| Mode sombre | Thème clair/sombre via `ThemeContext` |
| Formulaire contact | Route `/api/contact` pour les demandes utilisateurs |
| Newsletter Brevo | Inscription à la newsletter via l'API Brevo (`/api/newsletter`) |
| Stripe subscription | Abonnement récurrent géré par Stripe Checkout + Webhook |
| Quota gratuit 3 CV/mois | Compteur de CV par utilisateur, erreur 402 au-delà du quota |
| SEO/GEO | `robots.txt`, `sitemap.xml`, balises meta Open Graph + canonical |
