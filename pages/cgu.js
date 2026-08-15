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

export default function CGU() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Head>
        <title>Conditions générales d&apos;utilisation et de vente | Prospecho</title>
        <meta name="description" content="Conditions générales d'utilisation et de vente de Prospecho : offre gratuite, forfait Pro, paiement, résiliation, responsabilité." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://prospecho.fr/cgu" />
      </Head>
      <SimpleHeader />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#202124', mb: 1 }}>
          Conditions générales d&apos;utilisation et de vente
        </Typography>
        <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 4 }}>
          Dernière mise à jour : 15 août 2026
        </Typography>

        <Section title="1. Objet">
          Les présentes conditions générales (« CGU/CGV ») régissent l&apos;utilisation du service
          Prospecho, accessible à l&apos;adresse https://prospecho.fr, qui permet de générer un CV
          optimisé pour les systèmes de suivi des candidatures (ATS) à partir d&apos;un CV existant
          (fichier PDF ou profil LinkedIn) et d&apos;une offre d&apos;emploi. En créant un compte ou en
          utilisant le service, l&apos;utilisateur accepte sans réserve les présentes conditions.
        </Section>

        <Section title="2. Description du service">
          Prospecho analyse le texte d&apos;une offre d&apos;emploi pour en extraire des mots-clés, puis
          restructure le CV de l&apos;utilisateur autour de ces mots-clés selon un ou plusieurs templates
          au choix. Le service ne garantit ni l&apos;exactitude absolue de l&apos;extraction ni un
          résultat de candidature ; l&apos;utilisateur reste seul responsable de la relecture et de la
          véracité du contenu final avant tout envoi à un recruteur.
        </Section>

        <Section title="3. Offres et tarifs">
          <Box component="ul" sx={{ pl: 3 }}>
            <li><strong>Offre Gratuite</strong> : jusqu&apos;à 2 CV générés par mois, sans frais.</li>
            <li>
              <strong>Offre Pro</strong> : 1,50&nbsp;€ par CV généré, sans limite mensuelle, payable à
              l&apos;unité via Stripe. Les prix sont indiqués en euros, toutes taxes comprises le cas
              échéant.
            </li>
          </Box>
          Prospecho se réserve le droit de faire évoluer ses tarifs ; toute modification sera annoncée
          sur le site avant application.
        </Section>

        <Section title="4. Paiement">
          Les paiements sont traités par Stripe, prestataire de paiement tiers. Prospecho ne stocke ni
          ne traite directement les données de carte bancaire, qui transitent exclusivement par
          l&apos;infrastructure sécurisée de Stripe.
        </Section>

        <Section title="5. Droit de rétractation">
          Conformément à l&apos;article L221-28 du Code de la consommation, le droit de rétractation ne
          s&apos;applique pas aux contenus numériques dont l&apos;exécution a commencé avec l&apos;accord
          préalable exprès du consommateur et renoncement à son droit de rétractation — ce qui est le cas
          dès qu&apos;un CV est généré. Pour toute difficulté, contactez-nous avant tout achat en cas de
          doute (voir la page <a href="/contact" style={{ color: '#1a73e8' }}>Contact</a>).
        </Section>

        <Section title="6. Compte utilisateur">
          La création d&apos;un compte nécessite une adresse email valide et un mot de passe. L&apos;
          utilisateur est responsable de la confidentialité de ses identifiants et de toute activité
          effectuée depuis son compte. Prospecho se réserve le droit de suspendre un compte en cas
          d&apos;usage frauduleux ou abusif du service.
        </Section>

        <Section title="7. Propriété du contenu">
          Le contenu du CV fourni par l&apos;utilisateur (informations personnelles, expériences,
          formation) reste sa propriété. Prospecho ne revendique aucun droit sur ce contenu et ne
          l&apos;utilise que pour générer le CV optimisé demandé.
        </Section>

        <Section title="8. Limitation de responsabilité">
          Prospecho fournit un outil d&apos;assistance à la rédaction de CV et ne peut garantir
          l&apos;obtention d&apos;un entretien, d&apos;une mission ou d&apos;un emploi. Le service est
          fourni « en l&apos;état » ; Prospecho ne saurait être tenu responsable d&apos;une
          indisponibilité temporaire, d&apos;une erreur d&apos;extraction de mots-clés ou d&apos;un usage
          du CV généré par un tiers (recruteur, ATS).
        </Section>

        <Section title="9. Résiliation">
          L&apos;utilisateur peut cesser d&apos;utiliser le service et demander la suppression de son
          compte à tout moment en écrivant à Jeremy.bivaud@gmail.com. Voir la{' '}
          <a href="/confidentialite" style={{ color: '#1a73e8' }}>politique de confidentialité</a>{' '}
          pour les modalités de suppression des données.
        </Section>

        <Section title="10. Droit applicable">
          Les présentes conditions sont soumises au droit français. Tout litige relève, à défaut de
          résolution amiable, des juridictions compétentes.
        </Section>
      </Container>
      <SiteFooter />
    </Box>
  );
}
