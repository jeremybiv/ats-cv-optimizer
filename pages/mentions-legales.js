import Head from 'next/head';
import { Container, Box, Typography, Alert } from '@mui/material';
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

export default function MentionsLegales() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Head>
        <title>Mentions légales | Prospecho</title>
        <meta name="description" content="Mentions légales du site Prospecho : éditeur, hébergement, propriété intellectuelle." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://prospecho.fr/mentions-legales" />
      </Head>
      <SimpleHeader />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#202124', mb: 1 }}>
          Mentions légales
        </Typography>
        <Typography variant="body2" sx={{ color: '#9aa0a6', mb: 4 }}>
          Dernière mise à jour : 15 août 2026
        </Typography>

        <Alert severity="info" sx={{ mb: 4, borderRadius: 2 }}>
          Les champs entre crochets ci-dessous doivent être complétés avec les informations légales
          exactes de la structure exploitant Prospecho (raison sociale, forme juridique, numéro
          d&apos;immatriculation, adresse du siège) avant publication définitive du site. Ces informations
          n&apos;ont pas été inventées : elles doivent provenir de l&apos;éditeur lui-même.
        </Alert>

        <Section title="Éditeur du site">
          Le site Prospecho (accessible à l&apos;adresse https://prospecho.fr) est édité par :
          <Box component="ul" sx={{ mt: 1, pl: 3 }}>
            <li>Raison sociale / nom du responsable de publication : [à compléter]</li>
            <li>Forme juridique : [à compléter, ex. entreprise individuelle, SASU, etc.]</li>
            <li>Numéro d&apos;immatriculation (SIREN/SIRET) : [à compléter]</li>
            <li>Adresse du siège : [à compléter]</li>
            <li>Contact : Jeremy.bivaud@gmail.com</li>
          </Box>
          Prospecho est un produit édité sous la marque Prospimmo.
        </Section>

        <Section title="Directeur de la publication">
          Jeremy Bivaud — Jeremy.bivaud@gmail.com
        </Section>

        <Section title="Hébergement">
          Le site est hébergé par Vercel Inc. (https://vercel.com). La base de données applicative
          (comptes utilisateurs, CV générés, CV partagés) est hébergée chez Neon / Vercel Postgres.
        </Section>

        <Section title="Propriété intellectuelle">
          L&apos;ensemble des éléments du site Prospecho (textes, structure, code, design, logo) est
          protégé au titre du droit d&apos;auteur et du droit des marques. Toute reproduction ou
          représentation, totale ou partielle, sans autorisation préalable est interdite. Le contenu
          des CV générés par l&apos;utilisateur (texte, mise en forme) reste la propriété de
          l&apos;utilisateur.
        </Section>

        <Section title="Responsabilité">
          Prospecho génère un contenu de CV à partir des informations fournies par l&apos;utilisateur
          (CV importé, profil LinkedIn, offre d&apos;emploi) et d&apos;une extraction automatique de
          mots-clés. L&apos;éditeur ne garantit pas l&apos;obtention d&apos;un entretien ou d&apos;un
          emploi et ne saurait être tenu responsable de l&apos;exactitude du contenu généré, qu&apos;il
          appartient à l&apos;utilisateur de relire et de valider avant envoi à un recruteur.
        </Section>

        <Section title="Droit applicable">
          Les présentes mentions légales sont soumises au droit français. Pour toute question, voir la
          page <a href="/contact" style={{ color: '#1a73e8' }}>Contact</a>.
        </Section>
      </Container>
      <SiteFooter />
    </Box>
  );
}
