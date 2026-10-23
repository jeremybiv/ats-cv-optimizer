import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import { Box, Typography, CircularProgress, Alert, Container, Button } from '@mui/material';
import { initDB, getSharedCV } from '../../src/lib/db';

const SITE_URL = 'https://prospecho.fr';

// Short, human-readable summary reused for meta description, og:* and twitter:*.
// Kept under ~160 chars so Google/LinkedIn don't truncate mid-sentence.
function buildShareDescription(name) {
  const text = `Découvrez le CV de ${name}, optimisé pour les systèmes de suivi des candidatures (ATS) et partagé via Prospecho, le générateur de CV pour profils tech.`;
  if (text.length <= 160) return text;
  const cut = text.slice(0, 157);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 100 ? lastSpace : 157).trim()}…`;
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    await initDB();
    const cv = await getSharedCV(id);
    if (!cv) {
      return { props: { notFound: true, cvId: id } };
    }
    return {
      props: {
        cvId: id,
        cvHtml: cv.html,
        cvName: cv.name || 'CV partagé',
        createdAt: cv.created_at?.toISOString?.() || null,
      },
    };
  } catch (err) {
    console.error('[CV Public] Error:', err.message);
    return { props: { error: err.message, cvId: id } };
  }
}

export default function SharedCVPage({ cvHtml, cvName, createdAt, notFound, error, cvId }) {
  const router = useRouter();

  const displayName = (cvName || '').trim() || 'CV partagé';
  const pageTitle = `${displayName} — CV optimisé ATS | Prospecho`;
  const metaDescription = buildShareDescription(displayName);
  const canonicalUrl = cvId ? `${SITE_URL}/cv/${cvId}` : SITE_URL;

  if (notFound) {
    return (
      <>
      <Head>
        <title>CV introuvable | Prospecho</title>
        <meta name="description" content="Ce CV partagé n'existe pas ou a été supprimé." />
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#ea4335', mb: 2 }}>CV non trouvé</Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', mb: 3 }}>
            Ce CV n&apos;existe pas ou a été supprimé.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/')} sx={{ borderRadius: '20px', textTransform: 'none' }}>
            Retour à l&apos;accueil
          </Button>
        </Container>
      </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
      <Head>
        <title>CV momentanément indisponible | Prospecho</title>
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
      </Head>
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => router.push('/')} sx={{ borderRadius: '20px', textTransform: 'none' }}>
            Retour à l&apos;accueil
          </Button>
        </Container>
      </Box>
      </>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        {/* CV partagé : contenu privé, on laisse suivre les liens mais pas d'indexation */}
        <meta name="robots" content="noindex, follow" />
        <meta name="googlebot" content="noindex, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="profile" />
        <meta property="og:site_name" content="Prospecho" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
      </Head>
      {/* Top bar with info */}
      <Box sx={{ 
        bgcolor: '#202124', color: '#fff', px: { xs: 2, md: 4 }, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            📄 {cvName}
          </Typography>
          {createdAt && (
            <Typography variant="caption" sx={{ color: '#9aa0a6', display: { xs: 'none', sm: 'block' } }}>
              · {new Date(createdAt).toLocaleDateString('fr-FR')}
            </Typography>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button 
            size="small" 
            variant="outlined" 
            onClick={() => window.print()}
            sx={{ color: '#fff', borderColor: '#5f6368', borderRadius: '16px', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Imprimer / PDF
          </Button>
          <Button 
            size="small" 
            variant="contained" 
            onClick={() => router.push('/')}
            sx={{ bgcolor: '#1a73e8', borderRadius: '16px', textTransform: 'none', fontSize: '0.75rem' }}
          >
            Créer mon CV
          </Button>
        </Box>
      </Box>

      {/* CV Content rendered as full page */}
      <Box 
        sx={{ 
          width: '100%', 
          minHeight: 'calc(100vh - 48px)',
          '& iframe': { width: '100%', minHeight: 'calc(100vh - 48px)', border: 'none' }
        }}
        dangerouslySetInnerHTML={{ __html: cvHtml }}
      />
              {/* Viral badge - fixed bottom bar */}
        <div style={{position:'fixed',bottom:0,left:0,right:0,textAlign:'center',padding:'6px',background:'rgba(255,255,255,0.9)',backdropFilter:'blur(4px)',borderTop:'1px solid #e0e0e0',fontSize:'11px',zIndex:100}}>
          CV optimise par <a href="https://prospecho.fr" style={{color:'#1a73e8',fontWeight:600,textDecoration:'none'}}>Prospecho</a>
          {' '}— 🔗 Partage ton CV optimise
        </div>
    </Box>
  );
}
