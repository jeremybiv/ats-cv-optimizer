import Head from 'next/head';
import { Container, Box, Typography } from '@mui/material';
import SimpleHeader from '../src/components/SimpleHeader';
import SiteFooter from '../src/components/SiteFooter';

const Section = ({ title, children }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 1.5 }}>{title}</Typography>
    <Typography variant="body2" component="div" sx={{ color: '#3c4043', lineHeight: 1.8 }}>
      {children}
    </Typography>
  </Box>
);

export default function Confidentialite() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Head>
        <title>Politique de confidentialité (RGPD) | Prospecho</title>
        <meta name="description" content="Politique de confidentialité de Prospecho : données collectées, finalités, sous-traitants (Stripe, Brevo, Vercel), droits RGPD." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://prospecho.fr/confidentialite" />
      </Head>
      <SimpleHeader />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#202124', mb: 1 }}>
          Politique de confidentialité
        </Typography>
        <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 4 }}>
          Dernière mise à jour : 15 août 2026
        </Typography>

        <Section title="1. Qui traite vos données">
          Le responsable du traitement est l&apos;éditeur de Prospecho (voir les{' '}
          <a href="/mentions-legales" style={{ color: '#1a73e8' }}>mentions légales</a>). Pour toute
          question relative à vos données personnelles, écrivez à Jeremy.bivaud@gmail.com.
        </Section>

        <Section title="2. Données collectées">
          <Box component="ul" sx={{ pl: 3 }}>
            <li><strong>Compte</strong> : email, nom (optionnel), mot de passe (stocké sous forme hachée, jamais en clair).</li>
            <li><strong>CV et candidature</strong> : le fichier CV importé (PDF) ou le profil LinkedIn collé manuellement, le texte de l&apos;offre d&apos;emploi, et le CV généré (conservé dans votre historique si vous êtes connecté).</li>
            <li><strong>CV partagés</strong> : si vous utilisez la fonction de partage, le CV, votre nom et votre email peuvent être associés à un lien de partage public.</li>
            <li><strong>Paiement</strong> : géré intégralement par Stripe ; Prospecho ne reçoit ni ne stocke vos coordonnées bancaires, seulement le statut de votre abonnement.</li>
            <li><strong>Newsletter</strong> : si vous cochez la case dédiée lors de l&apos;inscription, votre email est transmis à notre prestataire d&apos;emailing (Brevo) pour l&apos;envoi de conseils CV.</li>
            <li><strong>Usage</strong> : compteur du nombre de CV générés par mois, pour appliquer le quota de l&apos;offre gratuite.</li>
          </Box>
        </Section>

        <Section title="3. Ce que Prospecho ne fait pas">
          Le contenu de votre CV n&apos;est jamais vendu, ni utilisé pour entraîner un modèle
          d&apos;intelligence artificielle tiers, ni partagé avec un recruteur ou un tiers sans action
          explicite de votre part (ex. génération d&apos;un lien de partage).
        </Section>

        <Section title="4. Finalités et base légale">
          <Box component="ul" sx={{ pl: 3 }}>
            <li>Génération du CV optimisé : exécution du contrat / consentement (utilisation directe du service).</li>
            <li>Gestion du compte et de l&apos;historique : exécution du contrat.</li>
            <li>Paiement des CV Pro : exécution du contrat.</li>
            <li>Newsletter : consentement explicite (case à cocher, non pré-cochée), désinscription possible à tout moment.</li>
          </Box>
        </Section>

        <Section title="5. Sous-traitants et destinataires">
          Vos données peuvent être traitées par les prestataires suivants, dans le cadre strict de la
          fourniture du service :
          <Box component="ul" sx={{ pl: 3, mt: 1 }}>
            <li><strong>Vercel Inc.</strong> — hébergement de l&apos;application.</li>
            <li><strong>Neon / Vercel Postgres</strong> — hébergement de la base de données (comptes, historique de CV, CV partagés).</li>
            <li><strong>Stripe</strong> — traitement des paiements.</li>
            <li><strong>Brevo</strong> — envoi de la newsletter (uniquement si vous y avez consenti).</li>
          </Box>
          Ces prestataires peuvent être situés hors de l&apos;Union européenne ; le cas échéant, ils
          s&apos;appuient sur des garanties reconnues par le RGPD (clauses contractuelles types ou
          équivalent).
        </Section>

        <Section title="6. Durée de conservation">
          Les données de compte et l&apos;historique de CV sont conservés tant que le compte est actif.
          Un CV partagé via un lien public reste accessible tant que le lien n&apos;est pas révoqué à
          votre demande. Vous pouvez demander la suppression de votre compte et de vos données à tout
          moment (voir Contact).
        </Section>

        <Section title="7. Cookies">
          Prospecho utilise un cookie de session technique (authentification, via NextAuth) strictement
          nécessaire au fonctionnement du service, ainsi que les cookies éventuellement déposés par
          Stripe lors du paiement. Aucun cookie publicitaire ou de traçage tiers n&apos;est utilisé.
        </Section>

        <Section title="8. Vos droits (RGPD)">
          Conformément au Règlement Général sur la Protection des Données, vous disposez d&apos;un droit
          d&apos;accès, de rectification, d&apos;effacement, de limitation, d&apos;opposition et de
          portabilité sur vos données personnelles. Pour exercer ces droits, contactez
          Jeremy.bivaud@gmail.com. Vous disposez également du droit d&apos;introduire une réclamation
          auprès de la CNIL (France) ou de l&apos;autorité de protection des données compétente si vous
          résidez en Suisse ou ailleurs.
        </Section>

        <Section title="9. Sécurité">
          Les mots de passe sont hachés (bcrypt) et ne sont jamais stockés en clair. Les échanges avec le
          site sont chiffrés (HTTPS). Aucun système n&apos;étant infaillible, contactez-nous sans délai
          en cas de suspicion de faille de sécurité concernant votre compte.
        </Section>
      </Container>
      <SiteFooter />
    </Box>
  );
}
