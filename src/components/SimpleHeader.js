import Link from 'next/link';
import { Box, Container, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

// Minimal header for secondary pages (legal, contact) — just the logo
// linking home, no auth actions, to keep those pages lightweight.
export default function SimpleHeader() {
  return (
    <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 1.5, px: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem' }}>
            Pros<span style={{ color: '#1a73e8' }}>pecho</span>
          </Typography>
        </Link>
      </Container>
    </Box>
  );
}
