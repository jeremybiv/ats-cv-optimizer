import Head from 'next/head';
import Link from 'next/link';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import SimpleHeader from '../src/components/SimpleHeader';
import SiteFooter from '../src/components/SiteFooter';

// Page 404 servie par Next.js pour toute URL inconnue. Le gabarit par défaut
// est en anglais, sans header ni footer : on le remplace par une page
// brandée en français, avec les liens utiles pour ne pas laisser le visiteur
// dans une impasse. noindex : une 404 ne doit jamais être indexée.
const liensUtiles = [
  { href: '/', label: 'Accueil' },
  { href: '/app', label: 'Mon espace' },
  { href: '/contact', label: 'Contact' },
  { href: '/cgu', label: 'CGU / CGV' },
];

export default function NotFound() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <Head>
        <title>Page introuvable | Prospecho</title>
        <meta
          name="description"
          content="Cette page n'existe pas ou a été déplacée. Retrouve l'accueil, ton espace Prospecho et nos pages utiles."
        />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <SimpleHeader />
      <Box component="main" sx={{ flex: 1, display: 'flex', alignItems: 'center', py: { xs: 6, md: 10 } }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography
            aria-hidden="true"
            sx={{
              fontSize: { xs: '5rem', md: '7rem' },
              fontWeight: 700,
              lineHeight: 1,
              color: '#1a73e8',
              letterSpacing: '-0.04em',
              mb: 1,
            }}
          >
            404
          </Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
            Page introuvable
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mb: 4, mx: 'auto', maxWidth: 460 }}>
            Cette page n&apos;existe pas ou a été déplacée. Pas de panique : ton CV et ton espace
            Prospecho sont toujours là.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, justifyContent: 'center', mb: 5 }}>
            <Button
              component={Link}
              href="/"
              variant="contained"
              size="large"
              sx={{
                borderRadius: '28px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                bgcolor: '#1a73e8',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#1557b0' },
              }}
            >
              Retour à l&apos;accueil
            </Button>
            <Button
              component={Link}
              href="/app"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: '28px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                borderColor: '#dadce0',
                color: '#202124',
                fontSize: '1rem',
                '&:hover': { borderColor: '#1a73e8', bgcolor: 'rgba(26,115,232,0.04)' },
              }}
            >
              Aller à mon espace
            </Button>
          </Box>

          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: { xs: 2.5, sm: 3 }, bgcolor: '#fff' }}>
            <Typography variant="body2" sx={{ color: '#5f6368', mb: 2 }}>
              Tu cherchais peut-être l&apos;une de ces pages ?
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {liensUtiles.map((lien) => (
                <Link
                  key={lien.href}
                  href={lien.href}
                  style={{ color: '#1a73e8', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 500 }}
                >
                  {lien.label}
                </Link>
              ))}
            </Box>
          </Paper>
        </Container>
      </Box>
      <SiteFooter />
    </Box>
  );
}
