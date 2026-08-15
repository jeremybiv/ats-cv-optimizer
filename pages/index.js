import { Container, Box, Typography, Button, Card, CardContent, Grid, Link as MuiLink } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import SiteFooter from '../src/components/SiteFooter';

const features = [
  {
    icon: '🎯',
    title: 'Score ATS en temps réel',
    desc: 'Analyse instantanée de la compatibilité de ton CV avec l\'offre d\'emploi — pensé pour les ATS des grands groupes (Workday, Taleo, SuccessFactors, iCIMS).',
  },
  {
    icon: '💻',
    title: 'Optimisé profils tech',
    desc: 'Mots-clés techniques, stack, méthodologies : le CV met en avant ce que recherchent les recruteurs tech (dev, data, product, cloud, cybersécurité, IT).',
  },
  {
    icon: '🇨🇭',
    title: 'Adapté au marché suisse',
    desc: 'Structure et vocabulaire alignés sur les attentes RH des multinationales, banques, pharma et scale-ups basées à Genève, Lausanne ou Zurich.',
  },
  {
    icon: '🎨📄',
    title: 'Deux templates (Professionnel / ATS Strict)',
    desc: 'Design soigné pour convaincre un recruteur humain, ou format ultra-épuré pour passer les ATS les plus stricts — au choix.',
  },
  {
    icon: '🔗',
    title: 'Lien de partage recruteur',
    desc: 'Partage ton CV optimisé en un clic avec les recruteurs ou les clients, en poste comme en freelance.',
  },
  {
    icon: '📄',
    title: 'Export PDF',
    desc: 'Télécharge ton CV au format PDF prêt à envoyer, pour une candidature CDI, une mission freelance ou un contrat de courte durée.',
  },
];

const techProfiles = [
  'Développeur / Développeuse', 'Data & IA', 'Product & UX', 'Cloud & DevOps',
  'Cybersécurité', 'IT & Support', 'Architecture logicielle', 'QA & Test',
];

// Single source of truth for the FAQ, rendered both as visible content and
// as FAQPage JSON-LD below — keeping them in one array guarantees the
// structured data always matches what's on the page (a Google Search
// Console requirement, and just as important for GEO: an AI engine quoting
// this page should never surface an answer that isn't actually shown here).
const faqItems = [
  {
    q: "Qu est-ce qu un CV compatible ATS ?",
    a: "Un CV compatible ATS (Applicant Tracking System) est un CV formaté pour etre lu correctement par les logiciels de recrutement comme Workday, Taleo, SuccessFactors ou iCIMS. Il doit utiliser une structure lineaire, des polices standard, des sections aux intitulés classiques et integrer les mots-cles de l offre d emploi.",
  },
  {
    q: "Comment optimiser mon CV pour les ATS gratuitement ?",
    a: "Prospecho est un outil gratuit qui analyse ton CV, extrait les mots-cles de l offre d emploi et genere un CV HTML optimise. Tu peux l utiliser jusqu a 2 fois par mois gratuitement, sans limite au forfait Pro. Importe ton CV ou ton profil LinkedIn, colle l offre, et obtiens un CV optimise en quelques secondes.",
  },
  {
    q: "Prospecho convient-il pour postuler en Suisse ?",
    a: "Oui. Les grands groupes actifs en Suisse (banques, assurances, pharma, industrie, scale-ups tech a Geneve, Lausanne ou Zurich) utilisent des ATS stricts comme Workday, SuccessFactors ou Taleo et des processus RH exigeants. Prospecho structure le CV avec des intitulés de section standards et les mots-cles de l offre pour passer ces filtres.",
  },
  {
    q: "Prospecho est-il adapté aux profils tech (dev, data, cybersécurité) ?",
    a: "Oui, c est son usage principal. L outil extrait les mots-cles techniques de l offre (langages, frameworks, outils cloud, méthodologies) et les repositionne dans le CV de maniere honnête, sans inventer de compétences que le candidat n a pas.",
  },
  {
    q: "Puis-je utiliser Prospecho pour une candidature freelance ou une mission courte ?",
    a: "Oui. Le CV genere convient aussi bien a une candidature CDI qu a une mission freelance ou un contrat de courte durée : le template Professionnel met en avant la stack et les réalisations, le template ATS Strict maximise la compatibilité avec les plateformes de mise en relation freelance qui utilisent aussi des ATS.",
  },
  {
    q: "Quels sont les meilleurs formats de CV pour les ATS ?",
    a: "Les meilleurs formats sont le HTML (recommande) et le DOCX. Le PDF est acceptable si genere depuis du texte. Evitez les images, les tableaux complexes et les colonnes multiples qui perturbent la lecture par les ATS.",
  },
  {
    q: "Quelle difference entre un template cv Professionnel et ATS Strict ?",
    a: "Le template Professionnel offre un design soigné deux-colonnes ideal pour les recruteurs humains. Le template ATS Strict est une version une-colonne sans fioritures, optimisee pour les ATS les plus stricts comme Workday et Taleo.",
  },
];

const pricingPlans = [
  {
    name: 'Gratuit',
    price: '0€',
    desc: '2 CV par mois',
    cta: 'Commencer',
    href: '/app',
  },
  {
    name: 'Pro',
    price: '1,50€/CV',
    desc: 'CV illimités, paiement à l\'unité',
    badge: 'Populaire',
    cta: 'Acheter un CV',
    href: null,
  },
];

export default function LandingPage() {
  const [loading, setLoading] = useState(null);

  const handleStripeCheckout = async (planIdx) => {
    setLoading(planIdx);
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erreur: ' + (data.error || 'Impossible de créer la session'));
    } catch (err) {
      alert('Erreur de connexion au serveur');
    } finally {
      setLoading(null);
    }
  };
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Head>
        <title>Prospecho - CV ATS-proof pour profils tech | Suisse & International</title>
        <meta name="description" content="Genere un CV ATS-proof pense pour les profils tech (dev, data, product, cloud, cybersecurite). Optimise pour les ATS des grands groupes (Workday, Taleo, SuccessFactors) et adapte au marche suisse. Gratuit, en quelques secondes." />
        <meta name="keywords" content="CV ATS, CV tech, CV developpeur, CV ATS Suisse, CV Geneve, CV Lausanne, CV Zurich, CV freelance tech, optimisation CV, ATS friendly, CV Workday, CV Taleo, CV SuccessFactors, generateur CV, CV optimise ATS" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large" />
        {/* GEO (generative engine optimization): explicitly welcome the major
            AI answer-engine crawlers so this page can be read and cited —
            robots.txt already allows everything via '*', these are just
            unambiguous per-bot signals for engines that check by name. */}
        <meta name="geo.region" content="CH" />
        <meta name="geo.placename" content="Genève, Lausanne, Zurich, Suisse" />
        <link rel="canonical" href="https://prospecho.fr" />
        <meta property="og:title" content="Prospecho - CV ATS-proof pour profils tech" />
        <meta property="og:description" content="Genere un CV ATS-proof pense pour les profils tech, optimise pour les ATS des grands groupes et adapte au marche suisse." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://prospecho.fr" />
        <meta property="og:locale" content="fr_CH" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Prospecho - CV ATS-proof pour profils tech" />
        <meta name="twitter:description" content="Le CV ATS-proof pense pour les profils tech, adapte au marche suisse. Gratuit, en quelques secondes." />
      </Head>
      {/* Header */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem', flex: 1 }}>
            Pros<span style={{ color: '#1a73e8' }}>pecho</span>
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
          <Typography variant="overline" sx={{ color: '#1a73e8', fontWeight: 700, letterSpacing: 1.5, display: 'block', mb: 1.5 }}>
            CV ATS-proof pour profils tech · 🇨🇭 Suisse &amp; international
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 500, color: '#202124', fontSize: { xs: '1.8rem', md: '2.5rem' }, mb: 2, lineHeight: 1.3 }}>
            Le CV qui passe les ATS <span style={{ color: '#1a73e8' }}>des plus grands groupes tech</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', maxWidth: 680, mx: 'auto', mb: 2, fontSize: { xs: '1rem', md: '1.1rem' } }}>
            Développeur, data, product, cloud, cybersécurité : génère un CV pensé pour les recruteurs et les
            ATS exigeants (Workday, Taleo, SuccessFactors, iCIMS) — que tu vises un poste en CDI, une mission
            freelance ou un contrat à Genève, Lausanne, Zurich ou ailleurs.
          </Typography>
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 4 }}>
            Import CV ou LinkedIn → offre d&apos;emploi → CV optimisé en quelques secondes.
          </Typography>
          <Link href="/app" passHref legacyBehavior>
            <Button variant="contained" size="large" sx={{ borderRadius: '28px', textTransform: 'none', px: 5, py: 1.5, bgcolor: '#1a73e8', fontSize: '1.1rem', '&:hover': { bgcolor: '#1557b0' } }}>
              Commencer gratuitement
            </Button>
          </Link>
          <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
            {techProfiles.map((p, i) => (
              <Box key={i} sx={{
                fontSize: '0.78rem', fontWeight: 500, color: '#1a73e8', bgcolor: '#fff',
                border: '1px solid #d2e3fc', borderRadius: '14px', px: 1.5, py: 0.5,
              }}>
                {p}
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Fonctionnalités
        </Typography>
        <Grid container spacing={3}>
          {features.map((f, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
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

      {/* Marché suisse */}
      <Box sx={{ bgcolor: '#0b1f33', color: '#fff', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" sx={{ fontWeight: 500, fontSize: { xs: '1.5rem', md: '2rem' }, mb: 2 }}>
            Conçu pour les exigences du marché suisse
          </Typography>
          <Typography variant="body1" sx={{ color: '#cfe0f5', maxWidth: 700, mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.05rem' } }}>
            Les grands groupes actifs en Suisse — banques, assurances, pharma, industrie et scale-ups tech
            à Genève, Lausanne ou Zurich — utilisent des ATS stricts (Workday, SuccessFactors, Taleo) et des
            processus RH exigeants. Prospecho structure ton CV pour passer ces filtres et arriver devant un
            recruteur humain, que tu postules en Suisse ou à l&apos;international.
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 640, mx: 'auto' }}>
            {[
              { n: 'ATS stricts', d: 'Structure lisible par Workday, Taleo, SuccessFactors, iCIMS' },
              { n: 'Grands groupes', d: 'Vocabulaire et sections attendus par les RH exigeantes' },
              { n: 'CDI & freelance', d: 'Adapté aux missions courtes comme aux postes permanents' },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={i}>
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(143,192,255,0.25)', borderRadius: 2, p: 2.5, height: '100%' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#8fc0ff', mb: 0.5 }}>
                    {item.n}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#cfe0f5' }}>
                    {item.d}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing */}
      <Box sx={{ bgcolor: '#fff', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
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
                    {plan.href ? (
                      <Link href={plan.href} passHref legacyBehavior>
                        <Button variant={i === 1 ? 'contained' : 'outlined'} fullWidth sx={{ borderRadius: '20px', textTransform: 'none', borderColor: i === 1 ? undefined : '#dadce0', color: i === 1 ? '#fff' : '#202124', bgcolor: i === 1 ? '#1a73e8' : 'transparent' }}>
                          {plan.cta}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant={i === 1 ? 'contained' : 'outlined'}
                        fullWidth
                        disabled={loading === i}
                        onClick={() => handleStripeCheckout(i)}
                        sx={{ borderRadius: '20px', textTransform: 'none', borderColor: i === 1 ? undefined : '#dadce0', color: i === 1 ? '#fff' : '#202124', bgcolor: i === 1 ? '#1a73e8' : 'transparent' }}
                      >
                        {loading === i ? 'Redirection...' : plan.cta}
                      </Button>
                    )}
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
          <Typography variant="h4" component="h2" sx={{ fontWeight: 500, color: '#202124', textAlign: 'center', mb: 6, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Questions fréquentes
          </Typography>
          <Box sx={{ maxWidth: 768, mx: 'auto' }}>
            {faqItems.map((item, idx) => (
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
          <Typography variant="h5" component="h2" sx={{ fontWeight: 500, color: '#202124', mb: 1 }}>
            Une question ? Contacte-nous
          </Typography>
          <MuiLink href="mailto:Jeremy.bivaud@gmail.com" underline="hover" sx={{ color: '#1a73e8', fontSize: '1.1rem', fontWeight: 500 }}>
            Jeremy.bivaud@gmail.com
          </MuiLink>
        </Container>
      </Box>

      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "Prospecho",
            "description": "Générateur de CV ATS-proof pour profils tech (développeur, data, product, cloud, cybersécurité), optimisé pour les ATS des grands groupes et adapté au marché suisse.",
            "datePublished": "2026-07-30",
            "dateModified": "2026-08-15",
            "audience": {
              "@type": "PeopleAudience",
              "suggestedMinAge": 20,
              "suggestedMaxAge": 45,
              "audienceType": "Professionnels tech (développeurs, data, product, cloud, cybersécurité) en recherche d'emploi ou de mission freelance"
            },
            "offers": [{
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR",
              "description": "Gratuit - 2 CV par mois"
            }, {
              "@type": "Offer",
              "price": "1.50",
              "priceCurrency": "EUR",
              "description": "Pro - 1,50€/CV"
            }]
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Optimisation de CV ATS pour profils tech",
            "serviceType": "CV optimization",
            "provider": { "@type": "Organization", "name": "Prospecho" },
            "areaServed": [
              { "@type": "Country", "name": "Switzerland" },
              { "@type": "Country", "name": "France" }
            ],
            "audience": {
              "@type": "PeopleAudience",
              "audienceType": "Développeurs, data, product, cloud, cybersécurité — CDI ou freelance"
            },
            "description": "Génère un CV structuré pour passer les ATS (Workday, Taleo, SuccessFactors, iCIMS) utilisés par les grands groupes en Suisse et à l'international."
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map((item) => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": { "@type": "Answer", "text": item.a },
            })),
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
