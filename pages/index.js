import { useState, useRef, useCallback, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Container, Box, Typography, Button, TextField, Paper, 
  LinearProgress, Chip, Grid, IconButton, Alert, Snackbar,
  Card, CircularProgress, Divider, Avatar, Menu, MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Home() {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [liveKeywords, setLiveKeywords] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('visual');
  const [strictMode, setStrictMode] = useState(false);
  const fileRef = useRef(null);
  const resultRef = useRef(null);

  const calculateLiveScore = useCallback((text) => {
    if (!text || text.length < 20) {
      setLiveScore(null);
      setLiveKeywords([]);
      return;
    }
    const words = text.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const freq = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    const keywords = Object.entries(freq).filter(([, count]) => count > 1).map(([word]) => word);
    const uniqueKeywords = [...new Set(keywords)];
    const lengthScore = Math.min(40, (text.length / 500) * 40);
    const keywordDensity = uniqueKeywords.length > 0 ? Math.min(30, uniqueKeywords.length * 5) : 0;
    const structureScore = text.includes('\n') ? 15 : 0;
    const varietyScore = Math.min(15, (new Set(words).size / Math.max(words.length, 1)) * 20);
    const score = Math.min(100, Math.round(lengthScore + keywordDensity + structureScore + varietyScore));
    setLiveScore(score);
    setLiveKeywords(uniqueKeywords.slice(0, 12));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => calculateLiveScore(jobText), 500);
    return () => clearTimeout(timer);
  }, [jobText, calculateLiveScore]);

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) setCvFile(file);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setCvFile(file);
  };

  const readFileAsBase64 = (file) => new Promise((res) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result.split(',')[1]);
    reader.readAsDataURL(file);
  });

  const handleOptimize = async () => {
    if (!cvFile && !jobUrl && !jobText) return;
    setLoading(true); setError(null); setResult(null); setStep(0);
    try {
      const body = { jobUrl: jobUrl || undefined, jobText: jobText || undefined, strictMode };
      if (cvFile) body.cvBase64 = await readFileAsBase64(cvFile);
      setStep(1);
      const res = await fetch('/api/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setStep(2);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result?.html || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setCvFile(null); setJobUrl(''); setJobText(''); setResult(null);
    setError(null); setStep(0);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem' }}>
            ATS CV<span style={{ color: '#1a73e8' }}>Optimizer</span>
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#5f6368', display: { xs: 'none', sm: 'block' } }}>
              {session?.user?.email}
            </Typography>
            <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: '#1a73e8', fontSize: '0.8rem' }}>
                {session?.user?.email?.[0]?.toUpperCase() || 'U'}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem onClick={() => { setAnchorEl(null); signOut(); }}>
                <LogoutIcon sx={{ mr: 1, fontSize: 18 }} /> Se déconnecter
              </MenuItem>
            </Menu>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        {/* Hero */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: 500, color: '#202124', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}>
            Un CV qui passe les robots 🤖 <span style={{ color: '#1a73e8' }}>et séduit les recruteurs</span>
          </Typography>
          <Typography variant="body1" sx={{ color: '#5f6368', maxWidth: 600, mx: 'auto' }}>
            Importe ton CV, colle une offre d'emploi — on génère un CV HTML optimisé ATS en quelques secondes.
          </Typography>
        </Box>

        {/* Upload card */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, borderRight: { md: '1px solid #e0e0e0' } }}>
              <Typography variant="subtitle2" sx={{ color: '#202124', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArticleIcon sx={{ fontSize: 18, color: '#1a73e8' }} /> Ton CV actuel
              </Typography>
              <Box onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)} onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                sx={{ border: '2px dashed', borderRadius: 2, p: 3, textAlign: 'center', cursor: 'pointer',
                  borderColor: dragOver ? '#1a73e8' : cvFile ? '#34a853' : '#dadce0',
                  bgcolor: dragOver ? '#e8f0fe' : cvFile ? '#e6f4ea' : '#fff',
                  transition: 'all 0.2s', '&:hover': { borderColor: '#1a73e8', bgcolor: '#f1f3f4' },
                }}>
                <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileSelect} hidden />
                {cvFile ? (
                  <Box>
                    <CheckCircleIcon sx={{ fontSize: 36, color: '#34a853', mb: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>{cvFile.name}</Typography>
                    <Typography variant="caption" sx={{ color: '#5f6368' }}>{(cvFile.size / 1024).toFixed(0)} Ko · PDF</Typography>
                  </Box>
                ) : (
                  <Box>
                    <CloudUploadIcon sx={{ fontSize: 36, color: '#5f6368', mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#5f6368' }}>
                      Dépose ton CV ici ou <strong style={{ color: '#1a73e8' }}>parcours</strong>
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9aa0a6' }}>PDF uniquement</Typography>
                  </Box>
                )}
              </Box>
            </Box>
            <Box sx={{ flex: 1.5, p: { xs: 2, md: 3 } }}>
              <Typography variant="subtitle2" sx={{ color: '#202124', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SearchIcon sx={{ fontSize: 18, color: '#1a73e8' }} /> L'offre d'emploi
              </Typography>
              <TextField fullWidth size="small" placeholder="Colle le lien de l'offre (LinkedIn, WTTJ...)"
                value={jobUrl} onChange={(e) => setJobUrl(e.target.value)}
                sx={{ mb: 1.5, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                InputProps={{ startAdornment: <SearchIcon sx={{ color: '#9aa0a6', mr: 1, fontSize: 18 }} /> }} />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Divider sx={{ flex: 1 }} /><Typography variant="caption" sx={{ color: '#9aa0a6' }}>ou</Typography><Divider sx={{ flex: 1 }} />
              </Box>
              <TextField fullWidth multiline rows={4}
                placeholder="Colle directement le texte de l'offre ici..."
                value={jobText} onChange={(e) => setJobText(e.target.value)}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }} />
              {/* Live ATS Score */}
              {liveScore !== null && (
                <Box sx={{ mt: 2, p: 2, bgcolor: "#f8f9fa", borderRadius: 2, border: "1px solid #e0e0e0" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ position: "relative", display: "inline-flex" }}>
                      <CircularProgress
                        variant="determinate"
                        value={liveScore}
                        size={72}
                        thickness={5}
                        sx={{ 
                          color: liveScore > 70 ? "#34a853" : liveScore > 40 ? "#f9ab00" : "#ea4335",
                        }}
                      />
                      <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: liveScore > 70 ? "#34a853" : liveScore > 40 ? "#f9ab00" : "#ea4335" }}>
                          {liveScore}%
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle2" sx={{ color: "#202124", fontSize: "0.85rem", mb: 0.5 }}>
                        Score ATS en direct
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#5f6368" }}>
                        {liveScore > 70 ? 'Excellente qualite - ton offre est bien structuree.' : liveScore > 40 ? 'Qualite moyenne - ajoute plus de details.' : 'Faible - ton offre manque de contenu ou de mots-cles.'}
                      </Typography>
                    </Box>
                  </Box>
                  {liveKeywords.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      <Typography variant="caption" sx={{ color: "#5f6368", mb: 0.5, display: "block" }}>
                        Mots-cles detectes
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {liveKeywords.map((kw, i) => (
                          <Chip key={i} label={kw} size="small"
                            sx={{ bgcolor: "#e8f0fe", color: "#1a73e8", fontSize: "0.7rem", height: 22 }} />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
          {/* Template Selector */}
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="subtitle2" sx={{ color: '#202124', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 18, color: '#1a73e8' }} /> Style de CV
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <Box onClick={() => { setSelectedTemplate('visual'); setStrictMode(false); }}
                sx={{ flex: 1, p: 2, borderRadius: 2, cursor: 'pointer', border: '2px solid',
                  borderColor: selectedTemplate === 'visual' ? '#1a73e8' : '#dadce0',
                  bgcolor: selectedTemplate === 'visual' ? '#e8f0fe' : '#fff',
                  transition: 'all 0.2s', '&:hover': { borderColor: '#1a73e8', bgcolor: '#f1f3f4' },
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ lineHeight: 1 }}>🎨</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#202124' }}>Professionnel</Typography>
                  {selectedTemplate === 'visual' && <CheckCircleIcon sx={{ color: '#1a73e8', fontSize: 18, ml: 'auto' }} />}
                </Box>
                <Typography variant="caption" sx={{ color: '#5f6368', display: 'block' }}>
                  Design luxe/corporate - idéal pour recruteur humain
                </Typography>
              </Box>
              <Box onClick={() => { setSelectedTemplate('ats'); setStrictMode(true); }}
                sx={{ flex: 1, p: 2, borderRadius: 2, cursor: 'pointer', border: '2px solid',
                  borderColor: selectedTemplate === 'ats' ? '#1a73e8' : '#dadce0',
                  bgcolor: selectedTemplate === 'ats' ? '#e8f0fe' : '#fff',
                  transition: 'all 0.2s', '&:hover': { borderColor: '#1a73e8', bgcolor: '#f1f3f4' },
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="h5" sx={{ lineHeight: 1 }}>📄</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#202124' }}>ATS Strict</Typography>
                  {selectedTemplate === 'ats' && <CheckCircleIcon sx={{ color: '#1a73e8', fontSize: 18, ml: 'auto' }} />}
                </Box>
                <Typography variant="caption" sx={{ color: '#5f6368', display: 'block' }}>
                  Optimisé pour les ATS stricts (Workday, Taleo, iCIMS)
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ p: { xs: 2, md: 2.5 }, bgcolor: '#f8f9fa', borderTop: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="text" size="small" onClick={handleReset} startIcon={<RestartAltIcon />} sx={{ color: '#5f6368', textTransform: 'none' }}>
              Réinitialiser
            </Button>
            <Button variant="contained" size="large" onClick={handleOptimize}
              disabled={loading || (!cvFile && !jobUrl && !jobText)}
              startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ borderRadius: '28px', textTransform: 'none', px: 4, bgcolor: '#1a73e8', '&:hover': { bgcolor: '#1557b0' } }}>
              {loading ? 'Optimisation en cours...' : '🚀 Optimiser mon CV'}
            </Button>
          </Box>
        </Paper>

        {/* Progress */}
        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={step * 50} sx={{ borderRadius: 2, height: 4, '& .MuiLinearProgress-bar': { bgcolor: '#1a73e8' } }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Chip label="📄 Analyse du CV" size="small" color={step >= 1 ? 'primary' : 'default'} variant={step >= 1 ? 'filled' : 'outlined'} />
              <Chip label="🔍 Scan de l'offre" size="small" color={step >= 2 ? 'primary' : 'default'} variant={step >= 2 ? 'filled' : 'outlined'} />
              <Chip label="✨ Génération HTML" size="small" color={step >= 2 ? 'primary' : 'default'} variant={step >= 2 ? 'filled' : 'outlined'} />
            </Box>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}

        {/* Results */}
        {result && (
          <Box ref={resultRef}>
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AutoAwesomeIcon sx={{ color: '#1a73e8' }} /> CV optimisé ATS
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: '#e8f0fe', borderRadius: 2, textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#1a73e8', fontWeight: 600 }}>{result.matchScore || 0}%</Typography>
                    <Typography variant="caption" sx={{ color: '#5f6368' }}>Correspondance</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: '#e6f4ea', borderRadius: 2, textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#34a853', fontWeight: 600 }}>{result.keywordCount || 0}</Typography>
                    <Typography variant="caption" sx={{ color: '#5f6368' }}>Mots-clés matchés</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: '#fef7e0', borderRadius: 2, textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#f9ab00', fontWeight: 600 }}>{result.structureScore || 0}/100</Typography>
                    <Typography variant="caption" sx={{ color: '#5f6368' }}>Structure ATS</Typography>
                  </Card>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Card elevation={0} sx={{ bgcolor: '#fce8e6', borderRadius: 2, textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" sx={{ color: '#ea4335', fontWeight: 600 }}>{result.missingCount || 0}</Typography>
                    <Typography variant="caption" sx={{ color: '#5f6368' }}>Mots-clés manquants</Typography>
                  </Card>
                </Grid>
              </Grid>
              {result.keywords && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: '#202124', mb: 1, fontSize: '0.85rem' }}>Mots-clés</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {result.keywords.map((kw, i) => (
                      <Chip key={i} label={kw} size="small"
                        sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', fontSize: '0.75rem' }} />
                    ))}
                  </Box>
                </Box>
              )}
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button variant="contained" onClick={handleCopy} startIcon={<ContentCopyIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', bgcolor: '#1a73e8' }}>
                  {copied ? 'Copié ✓' : 'Copier le HTML'}
                </Button>
                <Button variant="outlined" onClick={() => {
                  const blob = new Blob([result.html], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a'); a.href = url; a.download = 'cv_optimise_ats.html'; a.click();
                  URL.revokeObjectURL(url);
                }} startIcon={<DownloadIcon />} sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#202124' }}>
                  Télécharger HTML
                </Button>
              </Box>
            </Paper>
            <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ bgcolor: '#202124', px: 2, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#27c93f' }} />
                <Typography variant="caption" sx={{ color: '#9aa0a6', ml: 1 }}>Aperçu du CV optimisé</Typography>
              </Box>
              <Box sx={{ height: 600, overflow: 'auto', bgcolor: '#fff' }}>
                <iframe srcDoc={result.html} style={{ width: '100%', height: '100%', border: 'none' }} title="CV Preview" />
              </Box>
            </Paper>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
          <Typography variant="caption" sx={{ color: '#9aa0a6' }}>
            ATS CV Optimizer · Propulsé par Prospimmo · Les données ne sont pas stockées
          </Typography>
        </Box>
      </Container>
      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message="✅ HTML copié" />
    </Box>
  );
}
