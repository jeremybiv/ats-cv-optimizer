import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.ok) router.push('/');
    else setError('Email ou mot de passe incorrect.');
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 36, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Prospecho</Typography>
            <Typography variant="body2" sx={{ color: '#5f6368' }}>Connectez-vous à votre compte</Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth size="small" label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required />
            <TextField fullWidth size="small" label="Mot de passe" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} required />
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            <Button fullWidth variant="contained" type="submit" disabled={loading}
              sx={{ borderRadius: '28px', textTransform: 'none', bgcolor: '#1a73e8', py: 1.2 }}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#5f6368' }}>
              Pas encore de compte ?{' '}
              <Link href="/signup" style={{ color: '#1a73e8', fontWeight: 500, textDecoration: 'none' }}>
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
