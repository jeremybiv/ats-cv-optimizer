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
    desc: '3 CV par mois',
    cta: 'Commencer',
    href: '/app',
  },
  {
    name: 'Illimité',
    price: '7.90€/mois',
    desc: 'CV illimités',
    badge: 'Populaire',
    cta: 'Essayer',
    href: '/app',
  },
];

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Head>
        <title>ATS CV Optimizer - Optimise ton CV pour passer les ATS</title>
        <meta name="description" content="Importe ton CV ou ton profil LinkedIn, colle une offre d emploi et genere un CV HTML optimise pour les ATS (Workday, Taleo, iCIMS). Score ATS en temps reel, export PDF, partage recruteur." />
        <meta name="keywords" content="CV ATS, optimisation CV, score CV, ATS friendly, CV Workday, CV Taleo, CV en ligne, generateur CV, CV optimise ATS" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href="https://ats-cv-optimizer-delta.vercel.app" />
        <meta property="og:title" content="ATS CV Optimizer - Optimise ton CV pour passer les ATS" />
        <meta property="og:description" content="Importe ton CV ou ton profil LinkedIn, colle une offre d emploi et genere un CV HTML optimise pour les ATS." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ats-cv-optimizer-delta.vercel.app" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ATS CV Optimizer" />
        <meta name="twitter:description" content="Optimise ton CV pour passer les ATS en quelques secondes." />
      </Head>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem', flex: 1 }}>
            ATS CV<span style={{ color: '#1a73e8' }}>Optimizer</span>
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

      {/* FAQ */}
      <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Questions fréquentes
          </Typography>
          <Box sx={{ maxWidth: 768, mx: 'auto' }}>
            {[
              {
                q: "Qu est-ce qu un CV compatible ATS ?",
                a: "Un CV compatible ATS (Applicant Tracking System) est un CV formaté pour etre lu correctement par les logiciels de recrutement comme Workday, Taleo ou iCIMS. Il doit utiliser une structure lineaire, des polices standard, des sections aux intitulés classiques et integrer les mots-cles de l offre d emploi."
              },
              {
                q: "Comment optimiser mon CV pour les ATS gratuitement ?",
                a: "ATS CV Optimizer est un outil gratuit qui analyse ton CV, extrait les mots-cles de l offre d emploi et genere un CV HTML optimise. Tu peux l utiliser jusqu a 4 fois par mois gratuitement. Importe ton CV ou ton profil LinkedIn, colle l offre, et obtiens un CV optimise en quelques secondes."
              },
              {
                q: "Quels sont les meilleurs formats de CV pour les ATS ?",
                a: "Les meilleurs formats sont le HTML (recommande) et le DOCX. Le PDF est acceptable si genere depuis du texte. Evitez les images, les tableaux complexes et les colonnes multiples qui perturbent la lecture par les ATS."
              },
              {
                q: "Quelle difference entre un template cv Professionnel et ATS Strict ?",
                a: "Le template Professionnel offre un design luxe/corporate deux-colonnes ideal pour les recruteurs humains. Le template ATS Strict est une version une-colonne sans fioritures, optimisee pour les ATS stricts comme Workday et Taleo."
              },
            ].map((item, idx) => (
              <Box key={idx} sx={{ mb: 2, p: 3, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: '#f8f9fa' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
                  {item.q}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  {item.a}
                </Typography>
              </Box>
            ))}
          </Box>
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "ATS CV Optimizer",
            "description": "Optimise ton CV pour passer les ATS",
            "datePublished": "2026-07-30",
            "dateModified": "2026-07-30",
            "offers": [{
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Gratuit - 3 CV par mois"
            }, {
              "@type": "Offer",
              "price": "7.90",
              "priceCurrency": "EUR",
              "description": "Illimite - 7.90€/mois"
            }]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "Qu est-ce qu un CV compatible ATS ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Un CV compatible ATS (Applicant Tracking System) est un CV formaté pour etre lu correctement par les logiciels de recrutement comme Workday, Taleo ou iCIMS. Il doit utiliser une structure lineaire, des polices standard, des sections aux intitulés classiques et integrer les mots-cles de l offre d emploi."
                }
              },
              {
                "@type": "Question",
                "name": "Comment optimiser mon CV pour les ATS gratuitement ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "ATS CV Optimizer est un outil gratuit qui analyse ton CV, extrait les mots-cles de l offre d emploi et genere un CV HTML optimise. Tu peux l utiliser jusqu a 4 fois par mois gratuitement. Importe ton CV ou ton profil LinkedIn, colle l offre, et obtiens un CV optimise en quelques secondes."
                }
              },
              {
                "@type": "Question",
                "name": "Quels sont les meilleurs formats de CV pour les ATS ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Les meilleurs formats sont le HTML (recommande) et le DOCX. Le PDF est acceptable si genere depuis du texte. Evitez les images, les tableaux complexes et les colonnes multiples qui perturbent la lecture par les ATS."
                }
              },
              {
                "@type": "Question",
                "name": "Quelle difference entre un template cv Professionnel et ATS Strict ?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Le template Professionnel offre un design luxe/corporate deux-colonnes ideal pour les recruteurs humains. Le template ATS Strict est une version une-colonne sans fioritures, optimisee pour les ATS stricts comme Workday et Taleo."
                }
              }
            ]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "Comment optimiser son CV pour les ATS",
            "step": [
              {"@type": "HowToStep", "position": 1, "name": "Importe ton CV", "text": "Upload ton CV au format PDF ou importe ton profil LinkedIn."},
              {"@type": "HowToStep", "position": 2, "name": "Colle l offre d emploi", "text": "Copie le lien ou le texte de l offre a laquelle tu postules."},
              {"@type": "HowToStep", "position": 3, "name": "Choisis ton template", "text": "Selectionne Professionnel (pour humain) ou ATS Strict (pour les ATS)."},
              {"@type": "HowToStep", "position": 4, "name": "Optimise et telecharge", "text": "Obtiens ton CV optimise avec score ATS, exporte en PDF ou Word, et partage-le avec les recruteurs."}
            ]
          })
        }}
      />
    </Box>
  );
}
// trigger rebuild jeu. 30 juil 2026 14:47:44 CEST
