# Déploiement — ATS CV Optimizer

Guide de déploiement sur Vercel, de zéro à la production.

## 1. Importer le repo sur Vercel

1. Rendez-vous sur [vercel.com](https://vercel.com) et connectez-vous avec GitHub.
2. Cliquez sur **Add New → Project**.
3. Sélectionnez le repo `jeremybiv/ats-cv-optimizer`.
4. Framework preset : **Next.js** (détecté automatiquement).
5. Ne déployez pas encore : ajoutez d'abord les variables d'environnement (voir sections ci-dessous), puis cliquez sur **Deploy**.

## 2. Créer la base de données Neon Postgres

1. Créez un compte sur [neon.tech](https://neon.tech) (gratuit).
2. **Create a project** → choisissez une région proche de vos utilisateurs (ex. `eu-central-1`).
3. Dans le dashboard, allez dans **Connection Details** et copiez la **connection string** :
   ```
   postgres://user:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
4. Ajoutez-la dans Vercel sous le nom **`DATABASE_URL`**.
5. Les tables (`users`, `shared_cvs`, `generated_cvs`, `usage_cv`…) sont créées automatiquement au premier appel (`initDB` dans `src/lib/db.js`).

## 3. Configurer Stripe (abonnement 7,90 €/mois)

1. Créez un compte sur [dashboard.stripe.com](https://dashboard.stripe.com) :
2. **Products → Add product** :
   - Nom : `ATS CV Optimizer Illimité`
   - Prix : **7,90 € / mois**, récurrent (billing period : monthly)
   - Récupérez l'**ID du prix** (`price_...`) → variable `STRIPE_PRICE_ID`
3. **Developers → API keys** :
   - `sk_test_...` / `sk_live_...` → variable `STRIPE_SECRET_KEY`
4. **Developers → Webhooks → Add endpoint** :
   - URL : `https://ats-cv-optimizer-delta.vercel.app/api/webhook`
   - Événements : `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Récupérez le **Signing secret** (`whsec_...`) → variable `STRIPE_WEBHOOK_SECRET`

## 4. Configurer Brevo (newsletter)

1. Créez un compte sur [brevo.com](https://brevo.com) :
2. **SMTP et API → API Keys** : générez une clé (`xkeysib-...`) → variable `BREVO_API_KEY`.
3. **Contacts → Lists** : créez une liste « Newsletter » et récupérez son **ID** (nombre entier) → variable `BREVO_LIST_ID`.

## 5. Variables NextAuth

| Variable | Valeur |
|---|---|
| `NEXTAUTH_SECRET` | Chaîne aléatoire (ex. `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://ats-cv-optimizer-delta.vercel.app` |

## 6. Domaine de production

- Le projet est déployé sur **https://ats-cv-optimizer-delta.vercel.app** (domaine Vercel par défaut)
- Optionnel : dans Vercel → **Settings → Domains**, ajoutez un domaine personnalisé (ex. `cvoptimizer.fr`) et configurez les enregistrements DNS correspondants
- Mettez à jour `NEXTAUTH_URL` et le lien canonique si vous changez de domaine

## 7. Vérifications post-déploiement

- [ ] `https://ats-cv-optimizer-delta.vercel.app` répond 200
- [ ] Inscription + connexion fonctionnent
- [ ] Une optimisation CV renvoie un score et du HTML
- [ ] Le webhook Stripe est marqué **Healthy** dans le dashboard Stripe
- [ ] L'inscription newsletter ajoute bien un contact dans Brevo
