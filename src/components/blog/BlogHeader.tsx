'use client';

import Link from 'next/link';
import { Box, Button, Container, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { BRAND } from '../../theme';

/**
 * En-tête du blog. Volontairement léger (pas de session) : les articles sont
 * statiques et doivent rester consultables sans JS côté client.
 */
export default function BlogHeader() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: '#fff',
        borderBottom: `1px solid ${BRAND.borderLight}`,
        py: 1.5,
        px: { xs: 2, md: 4 },
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          aria-label="Prospecho — accueil"
        >
          <AutoAwesomeIcon sx={{ color: BRAND.primary, fontSize: 28 }} />
          <Typography component="span" sx={{ fontWeight: 500, color: BRAND.text, fontSize: '1.1rem' }}>
            Pros<span style={{ color: BRAND.primary }}>pecho</span>
          </Typography>
        </Link>

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 3, mr: 2 }}>
          <Link href="/blog" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.9rem', '&:hover': { color: BRAND.primary } }}>
              Blog
            </Typography>
          </Link>
          <Link href="/#faq" style={{ textDecoration: 'none' }}>
            <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.9rem', '&:hover': { color: BRAND.primary } }}>
              FAQ
            </Typography>
          </Link>
        </Box>

        <Link href="/app" style={{ textDecoration: 'none' }}>
          <Button
            variant="contained"
            size="small"
            sx={{
              borderRadius: '28px',
              bgcolor: BRAND.primary,
              px: 2.5,
              py: 0.8,
              fontSize: '0.85rem',
              '&:hover': { bgcolor: BRAND.primaryDark },
            }}
          >
            Optimiser mon CV
          </Button>
        </Link>
      </Container>
    </Box>
  );
}
