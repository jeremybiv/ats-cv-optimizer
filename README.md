# ATS CV Optimizer

ATS CV Optimizer est une application web qui **optimise votre CV pour les ATS** (Applicant Tracking Systems) : vous uploadez votre CV (PDF, DOCX ou texte), collez l'URL d'une offre d'emploi, et l'application analyse les mots-clés du poste, calcule un **score ATS sur 100**, puis génère un CV optimisé avec un choix de templates (Pro ou ATS Strict). L'application inclut également l'import de profil LinkedIn, l'export PDF/Word, le partage recruteur avec lien public, un mode entretien propulsé par l'IA (DeepSeek), l'historique des CV, le mode sombre, une newsletter Brevo et un abonnement Stripe (plan Illimité).

## Stack

- **Next.js 14** (Pages Router) — React 18
- **MUI** (Material UI 5) + Tailwind CSS
- **Neon Postgres** via `@vercel/postgres`
- **NextAuth.js** (credentials) + bcryptjs
- **Stripe** (Checkout + Webhooks)
- **Brevo** (newsletter)
- **DeepSeek API** (questions d'entretien IA)

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Fonctionnalités](docs/FEATURES.md)
- [Pricing & quotas](docs/PRICING.md)
- [Déploiement Vercel](docs/DEPLOYMENT.md)

## Démarrage rapide

```bash
npm install
cp .env.example .env.local   # renseigner les variables
npm run dev
```

## Variables d'environnement (Vercel)

| Variable | Description | Exemple |
|---|---|---|
| `DATABASE_URL` | Connexion Neon Postgres | `postgres://user:password@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_SECRET` | Clé sessions NextAuth | `random-string` |
| `NEXTAUTH_URL` | URL de production | `https://prospecho.fr` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_live_...` |
| `STRIPE_PRICE_ID` | ID du prix abonnement | `price_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | `whsec_...` |
| `BREVO_API_KEY` | Clé API Brevo | `xkeysib-...` |
| `BREVO_LIST_ID` | ID liste newsletter Brevo | `2` |

## Scripts

```bash
npm run dev    # développement
npm run build  # build de production
npm start      # serveur de production
```
