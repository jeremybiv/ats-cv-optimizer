import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Box, Typography, TextField, Button, Paper, Alert, Checkbox, FormControlLabel } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newsletter, setNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      // Subscribe to newsletter if checked — non-blocking
      if (newsletter) {
        fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }).catch(() => {});
      }
      setTimeout(() => router.push('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 36, mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 500 }}>Créer un compte</Typography>
            <Typography variant="body2" sx={{ color: '#5f6368' }}>Rejoignez ATS CV Optimizer</Typography>
          </Box>
          {success ? (
            <Alert severity="success" sx={{ borderRadius: 2 }}>Compte créé ! Redirection vers la connexion...</Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField fullWidth size="small" label="Nom (optionnel)" value={name}
                onChange={(e) => setName(e.target.value)} sx={{ mb: 2 }} />
              <TextField fullWidth size="small" label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} required />
              <TextField fullWidth size="small" label="Mot de passe (6+ caractères)" type="password" value={password}
                onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} required />
              <FormControlLabel
                control={<Checkbox checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />}
                label="Recevoir la newsletter et des conseils pour optimiser mes CV"
                sx={{ mb: 2, alignItems: 'flex-start' }}
              />
              {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
              <Button fullWidth variant="contained" type="submit" disabled={loading}
                sx={{ borderRadius: '28px', textTransform: 'none', bgcolor: '#1a73e8', py: 1.2 }}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </Button>
            </form>
          )}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#5f6368' }}>
              Déjà un compte ?{' '}
              <Link href="/login" style={{ color: '#1a73e8', fontWeight: 500, textDecoration: 'none' }}>
                Se connecter
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
