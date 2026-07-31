# Pricing — ATS CV Optimizer

## Offre Gratuite

- **Prix : 0 €**
- **Quota : 3 CV optimisés / mois**
- Accès à toutes les fonctionnalités de base (score ATS, templates, exports)

## Offre Illimitée

- **Prix : 7,90 € / mois** (abonnement récurrent via Stripe)
- **CV illimités** (pas de quota mensuel)
- Accès à toutes les fonctionnalités (mode entretien, historique complet, partage recruteur…)

## Logique de quota

1. Chaque génération de CV enregistre une ligne dans la table `usage_cv` (user_id + date).
2. Avant traitement, la route `/api/optimize` compte les CV générés dans le mois courant.
3. Si l'utilisateur n'est **pas abonné** et a déjà consommé **3 CV**, la route renvoie une **erreur 402** (`Payment Required`).
4. Le frontend intercepte l'erreur 402 et affiche un **CTA upgrade** (« Passer à Illimité ») qui redirige vers la session Stripe Checkout (`/api/create-checkout`).
5. Le webhook Stripe (`/api/webhook`) met à jour le statut d'abonnement de l'utilisateur (`stripe_subscription_id`, `stripe_customer_id`, statut actif).

## Récapitulatif

| Plan | Prix | CV/mois | Stripe |
|---|---|---|---|
| Gratuit | 0 € | 3 | — |
| Illimité | 7,90 €/mois | Illimité | Abonnement récurrent (`STRIPE_PRICE_ID`) |
