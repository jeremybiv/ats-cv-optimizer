# Architecture — ATS CV Optimizer

## Stack technique

| Composant | Technologie |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| UI | MUI (Material UI 5) + Tailwind CSS |
| Base de données | Neon Postgres via `@vercel/postgres` |
| Authentification | NextAuth.js (credentials) + bcryptjs |
| Paiement | Stripe (Checkout + Webhooks) |
| Emails / Newsletter | Brevo (API + listes) |
| Parsing CV | pdfjs-dist, cheerio |
| Export PDF | html2pdf.js |
| IA (questions entretien) | API DeepSeek |

## Structure des dossiers

```
.
├── pages/
│   ├── index.js              # Page principale : upload CV + optimisation
│   ├── login.js              # Connexion
│   ├── signup.js             # Inscription
│   ├── app/
│   │   └── index.js          # Espace utilisateur (historique, upgrade)
│   ├── cv/
│   │   └── [id].js           # Page publique de partage d'un CV
│   └── api/                  # Routes API (voir tableau ci-dessous)
│       ├── auth/[...nextauth].js
│       ├── auth/signup.js
│       ├── optimize.js
│       ├── cv/share.js
│       ├── linkedin-fetch.js
│       ├── interview-prep.js
│       ├── history/index.js
│       ├── history/[id].js
│       ├── create-checkout.js
│       ├── webhook.js
│       ├── newsletter.js
│       └── contact.js
├── src/
│   ├── lib/
│   │   ├── atsEngine.js      # Moteur ATS : keywords, score, génération HTML
│   │   ├── parsers.js        # Extraction texte (PDF/DOCX)
│   │   ├── jobFetcher.js     # Récupération offre d'emploi depuis une URL
│   │   ├── db.js             # Couche Postgres (users, shared_cvs, generated_cvs, usage_cv)
│   │   └── auth.js           # Helpers NextAuth / session
│   └── context/
│       └── ThemeContext.js   # Mode sombre / clair
├── public/
│   ├── html2pdf.bundle.min.js
│   ├── pdf.worker.min.js
│   ├── robots.txt
│   └── sitemap.xml
├── middleware.js
├── styles/globals.css
└── next.config.js
```

## Flux d'optimisation CV

```
Upload CV (PDF/DOCX/txt)
        │
        ▼
pages/index.js ──POST──▶ /api/optimize (auth requise)
        │
        ▼
src/lib/parsers.js : extraction du texte (pdfjs-dist / cheerio)
        │
        ▼
src/lib/jobFetcher.js : récupération de la description du poste (URL)
        │
        ▼
src/lib/atsEngine.js
   ├─ extractKeywords(jd)          → mots-clés techniques + soft skills
   ├─ scoreCV(cvText, keywords)    → score ATS sur 100
   └─ generateOptimizedCV(...)     → HTML optimisé (template Pro / ATS Strict)
        │
        ▼
Réponse : HTML + score + comparaison avant/après
        │
        ▼
pages/index.js : rendu (MUI), export PDF (html2pdf.js), export Word, partage
```

## Routes API

| Route | Méthode | Description |
|---|---|---|
| `/api/optimize` | POST | Optimisation CV (auth requise) |
| `/api/cv/share` | POST | Partage CV avec lien unique |
| `/api/auth/[...nextauth]` | POST | Auth NextAuth |
| `/api/auth/signup` | POST | Création de compte |
| `/api/linkedin-fetch` | POST | Import profil LinkedIn |
| `/api/interview-prep` | POST | Questions entretien IA (DeepSeek) |
| `/api/history` | GET/POST | Historique CV générés |
| `/api/history/[id]` | GET | Détail d'un CV |
| `/api/create-checkout` | POST | Session Stripe |
| `/api/webhook` | POST | Webhook Stripe |
| `/api/newsletter` | POST | Inscription Brevo |
| `/api/contact` | POST | Formulaire contact |
