import { useState, useRef, useCallback, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { 
  Container, Box, Typography, Button, TextField, Paper, 
  LinearProgress, Chip, Grid, IconButton, Alert, Snackbar,
  Card, CircularProgress, Divider, Avatar, Menu, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Accordion, AccordionSummary, AccordionDetails
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
import ShareIcon from '@mui/icons-material/Share';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import DescriptionIcon from '@mui/icons-material/Description';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HistoryIcon from '@mui/icons-material/History';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EditIcon from '@mui/icons-material/Edit';

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
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [liveScore, setLiveScore] = useState(null);
  const [liveKeywords, setLiveKeywords] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('visual');
  const [strictMode, setStrictMode] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareLink, setShareLink] = useState(null);
  const [shareSnackbar, setShareSnackbar] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [originalCvText, setOriginalCvText] = useState('');
  const [compareOpen, setCompareOpen] = useState(false);
  const [interviewOpen, setInterviewOpen] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [interviewError, setInterviewError] = useState(null);
  const [cvOriginalText, setCvOriginalText] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [letterCopied, setLetterCopied] = useState(false);
  const fileRef = useRef(null);
  const resultRef = useRef(null);

  // LinkedIn import state
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [linkedinData, setLinkedinData] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinError, setLinkedinError] = useState(null);
  const [linkedinManualText, setLinkedinManualText] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

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

  // LinkedIn URL handler
  const handleLinkedinUrlChange = useCallback(async (url) => {
    setLinkedinUrl(url);
    setLinkedinError(null);
    setShowManualInput(false);

    // Check if it's a LinkedIn URL
    if (!url || !url.includes('linkedin.com/in/')) {
      if (linkedinData) {
        setLinkedinData(null);
        setLinkedinManualText('');
      }
      return;
    }

    setLinkedinLoading(true);
    try {
      const res = await fetch('/api/linkedin-fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setLinkedinError(data.error || 'Erreur lors de la récupération du profil');
        setLinkedinLoading(false);
        return;
      }

      if (data.source === 'fallback') {
        // LinkedIn blocked — show manual textarea
        setShowManualInput(true);
        setLinkedinData(null);
        setLinkedinError("Le profil LinkedIn n'a pas pu être récupéré automatiquement (LinkedIn bloque le scraping). Collez manuellement le contenu de votre profil ci-dessous.");
      } else {
        // Successfully scraped
        setLinkedinData(data);
        setShowManualInput(false);
        // Clear any previously entered manual text
        setLinkedinManualText('');
      }
    } catch (err) {
      setLinkedinError('Erreur de connexion: ' + err.message);
      setShowManualInput(true);
    } finally {
      setLinkedinLoading(false);
    }
  }, [linkedinData]);

  const handleRemoveLinkedin = () => {
    setLinkedinUrl('');
    setLinkedinData(null);
    setLinkedinManualText('');
    setShowManualInput(false);
    setLinkedinError(null);
  };

  const handleOptimize = async () => {
    const hasCv = !!cvFile;
    const hasLinkedin = !!linkedinData || (showManualInput && linkedinManualText.trim().length > 20);
    if (!hasCv && !hasLinkedin && !jobUrl && !jobText) return;
    
    setLoading(true); setError(null); setQuotaExceeded(false); setResult(null); setStep(0);
    try {
      const body = { jobUrl: jobUrl || undefined, jobText: jobText || undefined, strictMode };
      
      if (cvFile) {
        body.cvBase64 = await readFileAsBase64(cvFile);
      } else if (linkedinData) {
        body.linkedinData = linkedinData;
      } else if (showManualInput && linkedinManualText.trim().length > 20) {
        body.cvText = linkedinManualText;
      }
      
      // Stocke le texte original du CV pour la comparaison avant/après
      let originalCv = '';
      if (cvFile) {
        originalCv = ''; // PDF : le texte est extrait côté serveur
      } else if (linkedinData) {
        const parts = [];
        if (linkedinData.summary) parts.push(linkedinData.summary);
        if (linkedinData.skills && linkedinData.skills.length > 0) {
          parts.push('Skills: ' + linkedinData.skills.join(', '));
        }
        if (linkedinData.experience && linkedinData.experience.length > 0) {
          linkedinData.experience.forEach(exp => {
            const line = [exp.title, exp.company, exp.dates].filter(Boolean).join(' - ');
            if (line) parts.push(line);
            if (exp.description && exp.description.length > 0) {
              parts.push(exp.description.join('. '));
            }
          });
        }
        originalCv = parts.join('\n');
      } else if (showManualInput && linkedinManualText.trim().length > 20) {
        originalCv = linkedinManualText;
      }
      setOriginalCvText(originalCv);
      setStep(1);
      const res = await fetch('/api/optimize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 402) {
          setQuotaExceeded(true);
          return;
        }
        throw new Error(data.error || 'Erreur serveur');
      }
      setStep(2);
      // Sauvegarde automatique dans l'historique (fire and forget)
      if (session?.user) {
        fetch('/api/history', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: '',
            company: '',
            templateUsed: strictMode ? 'strict' : 'visual',
            html: data.html,
            score: data.matchScore || null,
          }),
        }).catch(() => {});
      }
      setResult(data);
      // Stocke le texte CV dispo côté client pour la préparation d'entretien
      if (linkedinData) {
        const parts = [];
        if (linkedinData.summary) parts.push(linkedinData.summary);
        if (linkedinData.skills && linkedinData.skills.length > 0) parts.push('Skills: ' + linkedinData.skills.join(', '));
        if (linkedinData.experience && linkedinData.experience.length > 0) {
          linkedinData.experience.forEach(exp => {
            const line = [exp.title, exp.company, exp.dates].filter(Boolean).join(' - ');
            if (line) parts.push(line);
            if (exp.description && exp.description.length > 0) parts.push(exp.description.join('. '));
          });
        }
        setCvOriginalText(parts.join('\n'));
      } else if (showManualInput && linkedinManualText.trim().length > 20) {
        setCvOriginalText(linkedinManualText);
      }
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      const res = await fetch('/api/create-checkout', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else throw new Error(data.error || 'Erreur lors de la création de la session');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result?.html || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCoverLetter = async () => {
    const cvText = result?.cvText || '';
    const job = jobText || result?.jobText || '';
    if (!cvText || !job) return;
    setCoverLetterLoading(true);
    setCoverLetter('');
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobText: job }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la generation de la lettre');
      setCoverLetter(data.letter || '');
      setCoverLetterOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const handleCopyLetter = () => {
    navigator.clipboard.writeText(coverLetter);
    setLetterCopied(true);
    setTimeout(() => setLetterCopied(false), 2000);
  };

  const handleDownloadLetter = () => {
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'lettre_de_motivation.txt'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setCvFile(null); setJobUrl(''); setJobText(''); setResult(null);
    setError(null); setQuotaExceeded(false); setStep(0);
    setLinkedinUrl(''); setLinkedinData(null); setLinkedinManualText('');
    setShowManualInput(false); setLinkedinError(null); setOriginalCvText('');
  };

  const handleShare = async () => {
    if (!result?.html) return;
    setShareLoading(true);
    try {
      const res = await fetch('/api/cv/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: result.html,
          email: session?.user?.email || null,
          name: session?.user?.name || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors du partage');
      setShareLink(data.url);
      navigator.clipboard.writeText(data.url);
      setShareSnackbar(true);
      setShareDialogOpen(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setShareLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!result?.html) return;
    try {
      if (typeof window !== 'undefined' && !window.html2pdf) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = '/html2pdf.bundle.min.js';
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      if (typeof window !== 'undefined' && window.html2pdf) {
        const element = document.createElement('div');
        element.innerHTML = result.html;
        element.style.padding = '20px';
        element.style.background = '#fff';
        // Fixed px width (not '210mm'): html2canvas renders at a CSS pixel
        // width, and mixing mm with its internal windowWidth math previously
        // made the canvas narrower than the element's own layout — content
        // (contact block, stat tiles, skill pills...) got silently cropped
        // off the right edge of the exported PDF instead of wrapping.
        // windowWidth gives the layout a bit more room than the element's
        // own width so flex rows (header contact, stats bar) have space to
        // lay out without overflowing the capture area.
        element.style.width = '800px';
        document.body.appendChild(element);
        const opt = {
          margin:       0.5,
          filename:     'cv_optimise_ats.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, windowWidth: 840, width: 840 },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        await window.html2pdf().set(opt).from(element).save();
        document.body.removeChild(element);
      } else {
        window.print();
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération PDF');
    }
  };

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Surligne les mots-clés dans un texte brut (colonne « avant »)
  const renderHighlightedText = (text, keywords, style) => {
    if (!text) return null;
    const valid = (keywords || []).map(k => (k || '').trim()).filter(Boolean);
    if (!valid.length) return text;
    const regex = new RegExp(`(${valid.map(escapeRegExp).join('|')})`, 'gi');
    const parts = text.split(regex);
    const lower = valid.map(k => k.toLowerCase());
    return parts.map((part, i) =>
      part && lower.includes(part.toLowerCase())
        ? <span key={i} style={style}>{part}</span>
        : part
    );
  };

  // Surligne les mots-clés en vert dans le DOM de l'aperçu (colonne « après »)
  const highlightCompareHtml = (e) => {
    try {
      const doc = e.target.contentDocument;
      if (!doc || !doc.body) return;
      const keywords = (result?.keywords || []).map(k => (k || '').toLowerCase()).filter(k => k.length > 0);
      if (!keywords.length) return;
      const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach(node => {
        const text = node.nodeValue || '';
        if (!text.trim()) return;
        const lower = text.toLowerCase();
        const matches = [];
        keywords.forEach(kw => {
          let idx = lower.indexOf(kw);
          while (idx !== -1) {
            matches.push({ start: idx, end: idx + kw.length });
            idx = lower.indexOf(kw, idx + 1);
          }
        });
        if (!matches.length) return;
        matches.sort((a, b) => a.start - b.start);
        const merged = [];
        matches.forEach(m => {
          const last = merged[merged.length - 1];
          if (last && m.start <= last.end) last.end = Math.max(last.end, m.end);
          else merged.push({ start: m.start, end: m.end });
        });
        const frag = doc.createDocumentFragment();
        let cursor = 0;
        merged.forEach(m => {
          if (m.start > cursor) frag.appendChild(doc.createTextNode(text.slice(cursor, m.start)));
          const mark = doc.createElement('mark');
          mark.style.backgroundColor = '#d7f5d7';
          mark.style.color = '#1e7d32';
          mark.style.fontWeight = '600';
          mark.style.padding = '0 1px';
          mark.style.borderRadius = '2px';
          mark.textContent = text.slice(m.start, m.end);
          frag.appendChild(mark);
          cursor = m.end;
        });
        if (cursor < text.length) frag.appendChild(doc.createTextNode(text.slice(cursor)));
        node.parentNode.replaceChild(frag, node);
      });
    } catch (err) { /* ignore */ }
  };


  const handleDownloadWord = () => {
    if (!result?.html) return;
    try {
      // Wrap the optimized CV HTML with Microsoft Word XML headers so Word
      // opens it as a native .doc document instead of raw HTML.
      const wordHtml = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>CV optimisé ATS</title>
<!--[if gte mso 9]><xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml><![endif]-->
</head>
<body>
${result.html}
</body>
</html>`;
      const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cv_optimise_ats.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback : télécharge le HTML brut en .doc
      try {
        const blob = new Blob(['\ufeff', result.html], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'cv_optimise_ats.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err2) {
        setError(err2.message || 'Erreur lors du téléchargement Word');
      }
    }
  };

  const interviewTypeColor = (type) => {
    const map = {
      technique: { bgcolor: '#e8f0fe', color: '#1a73e8' },
      comportemental: { bgcolor: '#f3e8fd', color: '#7b1fa2' },
      motivation: { bgcolor: '#e6f4ea', color: '#1e7d32' },
      gap: { bgcolor: '#fce8e6', color: '#d93025' },
    };
    return map[type] || { bgcolor: '#f1f3f4', color: '#5f6368' };
  };

  const handleInterviewPrep = async () => {
    if (!result) return;
    setInterviewOpen(true);
    setInterviewLoading(true);
    setInterviewError(null);
    setInterviewQuestions([]);
    try {
      const cvText = result.cvText || cvOriginalText || '';
      if (!cvText.trim() || !jobText.trim()) {
        setInterviewError("Colle le texte de ton CV et celui de l'offre d'emploi pour générer les questions.");
        return;
      }
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText, jobText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la génération des questions');
      setInterviewQuestions(data.questions || []);
    } catch (err) {
      setInterviewError(err.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleOpenHistory = async () => {
    setHistoryOpen(true);
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch('/api/history');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors du chargement de l'historique");
      setHistoryList(data.cvs || []);
    } catch (err) {
      setHistoryError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleRestoreHistory = async (id) => {
    try {
      const res = await fetch(`/api/history/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la restauration');
      const cv = data.cv;
      setResult({
        html: cv.html || '',
        matchScore: cv.score || 0,
        keywordCount: 0,
        missingCount: 0,
        structureScore: 0,
        keywords: [],
        fromHistory: true,
      });
      setHistoryOpen(false);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setHistoryError(err.message);
    }
  };

  // Build a readable profile summary
  const linkedinProfilePreview = linkedinData ? (
    <Box sx={{ mt: 1.5, p: 1.5, bgcolor: '#e8f0fe', borderRadius: 2, border: '1px solid #b3d4fc' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <LinkedInIcon sx={{ color: '#0a66c2', fontSize: 20 }} />
        <Typography variant="subtitle2" sx={{ color: '#0a66c2', fontWeight: 600 }}>
          Profil importé depuis LinkedIn
        </Typography>
      </Box>
      <Typography variant="body2" sx={{ color: '#202124', fontWeight: 500 }}>
        {linkedinData.name}
      </Typography>
      {linkedinData.title && (
        <Typography variant="caption" sx={{ color: '#5f6368', display: 'block' }}>
          {linkedinData.title}
        </Typography>
      )}
      {linkedinData.skills && linkedinData.skills.length > 0 && (
        <Box sx={{ mt: 0.5, display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
          {linkedinData.skills.slice(0, 5).map((s, i) => (
            <Chip key={i} label={s} size="small" sx={{ bgcolor: '#fff', color: '#0a66c2', fontSize: '0.65rem', height: 20 }} />
          ))}
          {linkedinData.skills.length > 5 && (
            <Typography variant="caption" sx={{ color: '#5f6368', fontSize: '0.65rem', alignSelf: 'center' }}>
              +{linkedinData.skills.length - 5}
            </Typography>
          )}
        </Box>
      )}
      <Button size="small" onClick={handleRemoveLinkedin} sx={{ mt: 0.5, fontSize: '0.7rem', color: '#5f6368', textTransform: 'none', minWidth: 0, p: 0 }}>
        Supprimer
      </Button>
    </Box>
  ) : null;

  const isReady = cvFile || linkedinData || (showManualInput && linkedinManualText.trim().length > 20) || jobUrl || jobText;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Header */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', py: 1.5, px: { xs: 2, md: 4 } }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <AutoAwesomeIcon sx={{ color: '#1a73e8', fontSize: 28 }} />
          <Typography variant="h6" sx={{ fontWeight: 500, color: '#202124', fontSize: '1.1rem' }}>
            Pros<span style={{ color: '#1a73e8' }}>pecho</span>
          </Typography>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#5f6368', display: { xs: 'none', sm: 'block' } }}>
              {session?.user?.email}
            </Typography>
            {session && (
              <Button size="small" variant="text" onClick={handleOpenHistory} startIcon={<HistoryIcon />}
                sx={{ color: '#5f6368', textTransform: 'none', fontSize: '0.8rem' }}>
                Historique
              </Button>
            )}
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
            Importe ton CV ou ton profil LinkedIn, colle une offre d'emploi — on génère un CV HTML optimisé ATS en quelques secondes.
          </Typography>
        </Box>

        {/* Upload card */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden', mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Left column: CV upload + LinkedIn import */}
            <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, borderRight: { md: '1px solid #e0e0e0' } }}>
              <Typography variant="subtitle2" sx={{ color: '#202124', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArticleIcon sx={{ fontSize: 18, color: '#1a73e8' }} /> Ton CV ou profil
              </Typography>

              {/* CV Upload — hidden when LinkedIn data is active */}
              {!linkedinData && !linkedinUrl && (
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
              )}

              {/* LinkedIn data preview — replaces CV upload */}
              {linkedinProfilePreview}

              {/* Show CV upload again if LinkedIn URL is cleared */}
              {!linkedinData && linkedinUrl && !cvFile && (
                <Box sx={{ mb: 2 }}>
                  <Button 
                    size="small" 
                    variant="outlined" 
                    startIcon={<CloudUploadIcon />}
                    onClick={() => fileRef.current?.click()}
                    sx={{ borderRadius: '16px', textTransform: 'none', fontSize: '0.75rem', borderColor: '#dadce0', color: '#5f6368' }}
                  >
                    Ou téléverser un CV PDF
                  </Button>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={handleFileSelect} hidden />
                </Box>
              )}

              {/* LinkedIn URL field */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <LinkedInIcon sx={{ color: '#0a66c2', fontSize: 20 }} />
                  <Typography variant="caption" sx={{ color: '#5f6368', fontWeight: 500 }}>
                    Ou importe ton profil LinkedIn
                  </Typography>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="https://www.linkedin.com/in/tonprofil/"
                  value={linkedinUrl}
                  onChange={(e) => handleLinkedinUrlChange(e.target.value)}
                  disabled={linkedinLoading}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  InputProps={{
                    startAdornment: linkedinLoading ? (
                      <CircularProgress size={16} sx={{ mr: 1, color: '#0a66c2' }} />
                    ) : (
                      <LinkedInIcon sx={{ color: '#0a66c2', mr: 1, fontSize: 18 }} />
                    ),
                  }}
                />
              </Box>

              {/* LinkedIn error / manual textarea fallback */}
              {linkedinError && (
                <Alert severity={showManualInput ? 'info' : 'error'} sx={{ mt: 1.5, borderRadius: 2, fontSize: '0.8rem' }}>
                  {linkedinError}
                </Alert>
              )}

              {showManualInput && (
                <Box sx={{ mt: 1.5 }}>
                  <Typography variant="caption" sx={{ color: '#5f6368', mb: 0.5, display: 'block', fontWeight: 500 }}>
                    Colle le contenu de ton profil LinkedIn (nom, expérience, compétences...)
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder={`Exemple:\nJean Dupont\nDéveloppeur Full Stack\n\nExpérience:\n- TechCorp (2020-2024) - Développeur React/Node.js\n- StartupXYZ (2018-2020) - Développeur Frontend\n\nCompétences: JavaScript, React, Node.js, Python, AWS`}
                    value={linkedinManualText}
                    onChange={(e) => setLinkedinManualText(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Box>
              )}
            </Box>

            {/* Right column: Job offer */}
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
              disabled={loading || (!cvFile && !linkedinData && !(showManualInput && linkedinManualText.trim().length > 20) && !jobUrl && !jobText)}
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

        {quotaExceeded && (
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }} action={
            <Button color="inherit" size="small" onClick={handleUpgrade} disabled={upgradeLoading} sx={{ fontWeight: 600 }}>
              {upgradeLoading ? 'Redirection...' : 'Passer à Pro 1,50€/CV'}
            </Button>
          }>
            Quota gratuit atteint : 2 CV/mois maximum. Passe à Pro pour générer des CV sans limite.
          </Alert>
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
                <Button variant="outlined" onClick={handleCoverLetter} disabled={coverLetterLoading}
                  startIcon={coverLetterLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#7b1fa2' }}>
                  {coverLetterLoading ? 'Generation...' : '\u270d\ufe0f Lettre de motivation'}
                </Button>
                <Button variant="outlined" onClick={handleShare} disabled={shareLoading}
                  startIcon={shareLoading ? <CircularProgress size={16} /> : <ShareIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#202124' }}>
                  {shareLoading ? 'Partage...' : 'Partager'}
                </Button>
                <Button variant="outlined" onClick={handleInterviewPrep} startIcon={<RecordVoiceOverIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#7b1fa2' }}>
                  Préparer ton entretien
                </Button>
                <Button variant="outlined" onClick={handleDownloadPDF} startIcon={<PictureAsPdfIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#d93025' }}>
                  Télécharger PDF
                </Button>
                <Button variant="outlined" onClick={() => setCompareOpen(true)} startIcon={<CompareArrowsIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#202124' }}>
                  Comparer avant/après
                </Button>

                <Button variant="outlined" onClick={handleDownloadWord} startIcon={<DescriptionIcon />}
                  sx={{ borderRadius: '20px', textTransform: 'none', borderColor: '#dadce0', color: '#2b579a' }}>
                  Télécharger Word
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
            Prospecho · Propulsé par Prospimmo · Les données ne sont pas stockées
          </Typography>
        </Box>
      </Container>

      {/* Before/After Compare Dialog */}
      <Dialog open={compareOpen} onClose={() => setCompareOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>
          <CompareArrowsIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#1a73e8' }} />
          Comparer avant / après
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#d93025', fontWeight: 600 }}>
                Avant — CV original
              </Typography>
              <Box sx={{
                bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 2, p: 2,
                maxHeight: 500, overflow: 'auto', whiteSpace: 'pre-wrap',
                fontSize: '0.85rem', fontFamily: 'Roboto, sans-serif', lineHeight: 1.6,
              }}>
                {originalCvText ? renderHighlightedText(originalCvText, result?.keywords, {
                  backgroundColor: '#fce8e6', color: '#d93025',
                  textDecoration: 'line-through', fontWeight: 600, borderRadius: 2, padding: '0 1px',
                }) : (
                  <Typography variant="body2" sx={{ color: '#9aa0a6' }}>
                    Texte original indisponible (CV importé en PDF — le texte est extrait côté serveur).
                  </Typography>
                )}
              </Box>
              <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block', mt: 1 }}>
                Mots-clés manquants barrés en rouge
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: '#1e7d32', fontWeight: 600 }}>
                Après — CV optimisé
              </Typography>
              <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}>
                <iframe srcDoc={result?.html || ''} onLoad={highlightCompareHtml}
                  style={{ width: '100%', height: 500, border: 'none' }} title="CV optimisé (comparaison)" />
              </Box>
              <Typography variant="caption" sx={{ color: '#9aa0a6', display: 'block', mt: 1 }}>
                Mots-clés présents surlignés en vert
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompareOpen(false)} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a73e8' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Interview Prep Dialog */}
      <Dialog open={interviewOpen} onClose={() => setInterviewOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>
          <RecordVoiceOverIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#7b1fa2' }} />
          Préparer ton entretien
        </DialogTitle>
        <DialogContent dividers>
          {interviewLoading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
              <Typography variant="body2" sx={{ color: '#5f6368', mt: 2 }}>
                Génération des questions d'entretien en cours...
              </Typography>
            </Box>
          )}
          {interviewError && <Alert severity="error" sx={{ borderRadius: 2, mb: 1 }}>{interviewError}</Alert>}
          {!interviewLoading && !interviewError && interviewQuestions.length === 0 && (
            <Typography variant="body2" sx={{ color: '#9aa0a6', py: 2 }}>
              Les questions générées à partir de ton CV et de l'offre apparaîtront ici.
            </Typography>
          )}
          {!interviewLoading && interviewQuestions.map((q, i) => (
            <Accordion key={i} disableGutters sx={{
              mb: 1, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: 'none',
              '&:before': { display: 'none' },
            }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#202124' }}>
                    {i + 1}. {q.question}
                  </Typography>
                  <Chip label={q.type} size="small" sx={{ ...interviewTypeColor(q.type), fontSize: '0.7rem', height: 22 }} />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: '#5f6368' }}>
                  <strong style={{ color: '#202124' }}>Conseil :</strong> {q.conseil}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInterviewOpen(false)} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a73e8' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>
          <HistoryIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#1a73e8' }} />
          Historique des CV générés
        </DialogTitle>
        <DialogContent dividers>
          {historyLoading && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {historyError && <Alert severity="error" sx={{ borderRadius: 2, mb: 1 }}>{historyError}</Alert>}
          {!historyLoading && !historyError && historyList.length === 0 && (
            <Typography variant="body2" sx={{ color: '#9aa0a6', py: 2 }}>
              Aucun CV sauvegardé pour le moment.
            </Typography>
          )}
          {!historyLoading && historyList.map((cv) => (
            <Box key={cv.id} onClick={() => handleRestoreHistory(cv.id)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, mb: 1, cursor: 'pointer',
                border: '1px solid #e0e0e0', borderRadius: 2, '&:hover': { bgcolor: '#f1f3f4' },
              }}>
              <ArticleIcon sx={{ color: '#1a73e8', fontSize: 22 }} />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#202124' }}>
                  {cv.job_title || 'CV sans titre'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#5f6368' }}>
                  {cv.created_at ? new Date(cv.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}
                  {cv.template_used ? ` · ${cv.template_used}` : ''}
                </Typography>
              </Box>
              <Chip label={`${cv.score || 0}%`} size="small"
                sx={{ bgcolor: '#e8f0fe', color: '#1a73e8', fontWeight: 600 }} />
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryOpen(false)} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a73e8' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Success Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>✅ CV partagé avec succès !</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#5f6368', mb: 2 }}>
            Le lien de partage a été copié dans votre presse-papier. Vous pouvez le partager avec les recruteurs.
          </Typography>
          <Box sx={{ 
            bgcolor: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: 2, 
            p: 2, wordBreak: 'break-all', fontSize: '0.85rem', fontFamily: 'monospace', color: '#1a73e8'
          }}>
            {shareLink}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            navigator.clipboard.writeText(shareLink || '');
            setShareSnackbar(true);
          }} sx={{ textTransform: 'none', color: '#1a73e8' }}>
            Copier le lien
          </Button>
          <Button onClick={() => setShareDialogOpen(false)} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a73e8' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cover Letter Dialog */}
      <Dialog open={coverLetterOpen} onClose={() => setCoverLetterOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 500 }}>{'\u270d\ufe0f Lettre de motivation'}</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={14}
            maxRows={24}
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            variant="outlined"
            sx={{ '& .MuiOutlinedInput-root': { fontFamily: 'inherit' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCopyLetter} startIcon={<ContentCopyIcon />} sx={{ textTransform: 'none', color: '#1a73e8' }}>
            {letterCopied ? 'Copié ✓' : 'Copier'}
          </Button>
          <Button onClick={handleDownloadLetter} startIcon={<DownloadIcon />} sx={{ textTransform: 'none', color: '#1a73e8' }}>
            Télécharger .txt
          </Button>
          <Button onClick={() => setCoverLetterOpen(false)} variant="contained" sx={{ textTransform: 'none', bgcolor: '#1a73e8' }}>
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={copied} autoHideDuration={2000} onClose={() => setCopied(false)} message="✅ HTML copié" />
      <Snackbar open={letterCopied} autoHideDuration={2000} onClose={() => setLetterCopied(false)} message="📋 Lettre copiée dans le presse-papier" />
      <Snackbar open={shareSnackbar} autoHideDuration={2000} onClose={() => setShareSnackbar(false)} message="🔗 Lien copié dans le presse-papier" />
    </Box>
  );
}
