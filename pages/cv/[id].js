import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Container, Button } from '@mui/material';
import { initDB, getSharedCV } from '../../src/lib/db';

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    await initDB();
    const cv = await getSharedCV(id);
    if (!cv) {
      return { props: { notFound: true } };
    }
    return {
      props: {
        cvHtml: cv.html,
        cvName: cv.name || 'CV partagé',
        createdAt: cv.created_at?.toISOString?.() || null,
      },
    };
  } catch (err) {
    console.error('[CV Public] Error:', err.message);
    return { props: { error: err.message } };
  }
}

export default function SharedCVPage({ cvHtml, cvName, createdAt, notFound, error }) {
  const router = useRouter();

  if (notFound) {
    return (
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
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f8f9fa' }}>
        <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          <Button variant="contained" onClick={() => router.push('/')} sx={{ borderRadius: '20px', textTransform: 'none' }}>
            Retour à l&apos;accueil
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fff' }}>
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
          CV optimise par <a href="https://ats-cv-optimizer-delta.vercel.app" style={{color:'#1a73e8',fontWeight:600,textDecoration:'none'}}>Prospecho</a>
          {' '}— 🔗 Partage ton CV optimise
        </div>
    </Box>
  );
}
