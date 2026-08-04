import { Container, Box, Typography, Button, Card, CardContent, Grid, Link as MuiLink } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Link from 'next/link';
import Head from 'next/head';

const features = [
  {
    icon: '🎯',
    title: 'Score ATS en temps réel',
    desc: 'Analyse instantanée de la compatibilité de ton CV avec l\'offre d\'emploi.',
  },
  {
    icon: '🎨📄',
    title: 'Deux templates (Professionnel / ATS Strict)',
    desc: 'Design luxe pour humain ou format ultra-optimisé pour les ATS stricts.',
  },
  {
    icon: '🔗',
    title: 'Lien de partage recruteur',
    desc: 'Partage ton CV optimisé en un clic avec les recruteurs.',
  },
  {
    icon: '📄',
    title: 'Export PDF',
    desc: 'Télécharge ton CV au format PDF prêt à envoyer.',
  },
];

const pricingPlans = [
  {
    name: 'Gratuit',
    price: '0€',
    desc: '4 CV par mois',
    cta: 'Commencer',
    href: '/app',
  },
  {
    name: 'Pro',
    price: '1€/CV',
    desc: 'CV illimités',
    cta: 'Essayer',
    href: '/app',
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Head>
        <title>Prospecho</title>
      </Head>
      {/* Header */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem', flex: 1 }}>
            Prosp<span style={{ color: '#1a73e8' }}>echo</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Link href="/login" passHref legacyBehavior>
              <Button variant="outlined" size="small" sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#5f6368' }}>
                Se connecter
              </Button>
            </Link>
            <Link href="/signup" passHref legacyBehavior>
              <Button variant="contained" size="small" sx={{ borderRadius: '20px', textTransform: 'none', bgcolor: '#1a73e8' }}>
                S&apos;inscrire
              </Button>
            </Link>
          </Box>
        </Container>
      </Box>

      {/* Hero */}
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center', background: 'linear-gradient(180deg, #e8f0fe 0%, #f8f9fa 100%)' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 500, color: '#202124', fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 2, lineHeight: 1.3 }}>
            Un CV qui passe les robots <span style={{ color: '#1a73e8' }}>et séduit les recruteurs</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', maxWidth: 640, mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Importe ton CV ou ton profil LinkedIn, colle une offre d&apos;emploi — on génère un CV HTML optimisé ATS en quelques secondes.
          </Typography>
          <Link href="/app" passHref legacyBehavior>
            <Button variant="contained" size="large" sx={{ borderRadius: '28px', textTransform: 'none', px: 5, py: 1.5, bgcolor: '#1a73e8', fontSize: '1.1rem', '&:hover': { bgcolor: '#1557b0' } }}>
              Commencer gratuitement
            </Button>
          </Link>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Fonctionnalités
        </Typography>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, height: '100%', transition: 'all 0.2s', '&:hover': { borderColor: '#1a73e8', boxShadow: '0 4px 12px rgba(26,115,232,0.1)' } }}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1.5 }}>{f.icon}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
                    {f.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#5f6368' }}>
                    {f.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing */}
      <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Tarifs
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {pricingPlans.map((plan, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card elevation={0} sx={{
                  border: i === 1 ? '2px solid #1a73e8' : '1px solid #e0e0e0',
                  borderRadius: 3,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'visible',
                }}>
                  {i === 1 && (
                    <Box sx={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      bgcolor: '#1a73e8', color: '#fff', px: 2, py: 0.5, borderRadius: '12px',
                      fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap',
                    }}>
                      Populaire
                    </Box>
                  )}
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a73e8', mb: 1 }}>
                      {plan.price}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#5f6368', mb: 3 }}>
                      {plan.desc}
                    </Typography>
                    <Link href={plan.href} passHref legacyBehavior>
                      <Button variant={i === 1 ? 'contained' : 'outlined'} fullWidth sx={{ borderRadius: '20px', textTransform: 'none', borderColor: i === 1 ? undefined : '#dadce0', color: i === 1 ? '#fff' : '#202124', bgcolor: i === 1 ? '#1a73e8' : 'transparent' }}>
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact */}
      <Box sx={{ py: { xs: 6, md: 8 }, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h5" sx={{ fontWeight: 500, color: '#202124', mb: 1 }}>
            Une question ? Contacte-nous
          </Typography>
          <MuiLink href="mailto:Jeremy.bivaud@gmail.com" underline="hover" sx={{ color: '#1a73e8', fontSize: '1.1rem', fontWeight: 500 }}>
            Jeremy.bivaud@gmail.com
          </MuiLink>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#fff', borderTop: '1px solid #e0e0e0', py: 3, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
          Propulsé par Prospimmo
        </Typography>
      </Box>
    </Box>
  );
}
