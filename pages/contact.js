import Head from 'next/head';
import { Container, Box, Typography, Paper, Link as MuiLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import SimpleHeader from '../src/components/SimpleHeader';
import SiteFooter from '../src/components/SiteFooter';

export default function Contact() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      <Head>
        <title>Contact | Prospecho</title>
        <meta name="description" content="Une question sur Prospecho, ton CV ATS ou ton abonnement ? Contacte-nous par email." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://prospecho.fr/contact" />
      </Head>
      <SimpleHeader />
      <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 500, color: '#202124', mb: 2 }}>
          Contacte-nous
        </Typography>
        <Typography variant="body1" sx={{ color: '#5f6368', mb: 4 }}>
          Une question sur Prospecho, un bug rencontré sur ton CV, une demande liée à ton abonnement Pro
          ou à tes données personnelles ? Écris-nous, on te répond directement.
        </Typography>
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4 }}>
          <EmailIcon sx={{ color: '#1a73e8', fontSize: 32, mb: 1.5 }} />
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 1 }}>
            Email
          </Typography>
          <MuiLink href="mailto:Jeremy.bivaud@gmail.com" underline="hover" sx={{ color: '#1a73e8', fontSize: '1.2rem', fontWeight: 500 }}>
            Jeremy.bivaud@gmail.com
          </MuiLink>
        </Paper>
        <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block', mt: 3 }}>
          Pour une demande liée à tes données personnelles (accès, suppression, export), consulte notre{' '}
          <a href="/confidentialite" style={{ color: '#1a73e8' }}>politique de confidentialité</a>.
        </Typography>
      </Container>
      <SiteFooter />
    </Box>
  );
}
