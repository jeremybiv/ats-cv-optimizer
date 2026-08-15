import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';

const linkStyle = { color: '#5f6368', fontSize: '0.8rem', textDecoration: 'none' };

// Shared footer (legal + contact links) used on every page — factored out so
// adding/renaming a legal page updates the whole site from one place instead
// of four hand-duplicated footers drifting apart.
export default function SiteFooter() {
  return (
    <Box component="footer" sx={{ bgcolor: '#fff', borderTop: '1px solid #e0e0e0', py: 3 }}>
      <Container maxWidth="lg" sx={{
        display: 'flex', flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
      }}>
        <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
          Prospecho · Propulsé par Prospimmo
        </Typography>
        <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/contact" style={linkStyle}>Contact</Link>
          <Link href="/mentions-legales" style={linkStyle}>Mentions légales</Link>
          <Link href="/cgu" style={linkStyle}>CGU / CGV</Link>
          <Link href="/confidentialite" style={linkStyle}>Confidentialité</Link>
        </Box>
      </Container>
    </Box>
  );
}
