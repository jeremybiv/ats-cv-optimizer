import { useState, useRef, useCallback } from 'react';
import Head from 'next/head';
import { extractKeywords, scoreCV, generateOptimizedCV } from '../src/lib/atsEngine';
import { parseCVText } from '../src/lib/parsers';
import { fetchJobFromURL } from '../src/lib/jobFetcher';

export default function Home() {
  const [cvFile, setCvFile] = useState(null);
  const [cvText, setCvText] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobText, setJobText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
      setError('');
    } else {
      setError('Veuillez deposer un fichier PDF');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCvFile(file);
      setError('');
    }
  };

  const readFileAsText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const handleOptimize = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      let jdText = jobText;
      if (jobUrl.trim()) {
        try {
          jdText = await fetchJobFromURL(jobUrl.trim());
        } catch (err) {
          setError('Erreur de recuperation: ' + err.message);
          setLoading(false);
          return;
        }
      }
      if (!jdText.trim()) {
        setError('Veuillez entrer une URL ou coller le texte');
        setLoading(false);
        return;
      }
      const keywords = extractKeywords(jdText);
      let parsedCV = { name: '', email: '', phone: '', summary: '', experience: [], education: [], skills: [] };
      let cvRawText = '';
      if (cvFile) {
        cvRawText = await readFileAsText(cvFile);
        parsedCV = parseCVText(cvRawText);
      }
      const cvScore = scoreCV(cvRawText || cvText, keywords);
      const optimizedHTML = generateOptimizedCV(parsedCV, keywords);
      const optimizedScore = scoreCV(optimizedHTML, keywords);
      setResult({
        optimizedHTML,
        originalScore: cvScore,
        optimizedScore: optimizedScore,
        keywords: keywords,
        matchedCount: cvScore.breakdown.matchedKeywords?.length || 0,
        totalKeywords: keywords.all.length,
      });
    } catch (err) {
      setError('Erreur: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-average';
    return 'score-poor';
  };

  const downloadCV = () => {
    if (!result) return;
    const blob = new Blob([result.optimizedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cv_optimise_ats.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>ATS CV Optimizer</title>
        <meta name="description" content="Optimisez votre CV pour les ATS" />
      </Head>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">ATS</div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ATS CV Optimizer</h1>
            <p className="text-sm text-gray-500">Optimisez votre CV pour les ATS</p>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">1. Telechargez votre CV (PDF)</h2>
          <div
            className={`drop-zone ${dragOver ? 'drag-over' : ''} ${cvFile ? 'has-file' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
            {cvFile ? (
              <div>
                <div className="text-4xl mb-2">{'\u2705'}</div>
                <p className="font-medium text-green-700">{cvFile.name}</p>
                <p className="text-sm text-gray-500">{(cvFile.size / 1024).toFixed(1)} Ko</p>
                <p className="text-sm text-blue-600 mt-2">Cliquez pour changer</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">{'\u{1F4C4}'}</div>
                <p className="font-medium text-gray-700">Glissez-deposez votre CV ici</p>
                <p className="text-sm text-gray-500 mt-1">ou cliquez pour parcourir (PDF)</p>
              </div>
            )}
          </div>
        </section>
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">2. Description du poste</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de l'offre d'emploi</label>
              <input type="url" value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} placeholder="https://example.com/job-posting" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="text-sm text-gray-400">OU</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Collez la description du poste</label>
              <textarea value={jobText} onChange={(e) => setJobText(e.target.value)} placeholder="Copiez-collez ici la description..." className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm job-textarea" />
            </div>
          </div>
        </section>
        <div className="flex justify-center">
          <button onClick={handleOptimize} disabled={loading || (!cvFile && !cvText) || (!jobUrl && !jobText)} className="btn-primary px-8 py-3 text-base flex items-center gap-2">
            {loading ? (
              <><span className="spinner"></span>Optimisation en cours...</>
            ) : (
              <><span className="text-lg">{'\u26A1'}</span>Optimiser mon CV</>
            )}
          </button>
        </div>
        {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>)}
        {result && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">3. Resultats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Score ATS Original</p>
                <div className={`score-ring ${getScoreClass(result.originalScore.overall)}`}>{result.originalScore.overall}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Score ATS Optimise</p>
                <div className={`score-ring ${getScoreClass(result.optimizedScore.overall)}`}>{result.optimizedScore.overall}</div>
              </div>
            </div>
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Mots-cles: {result.matchedCount}/{result.totalKeywords}</h3>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.technical?.slice(0, 10).map((kw, i) => <span key={i} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{kw}</span>)}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Apercu du CV optimise</h3>
                <button onClick={downloadCV} className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">Telecharger (HTML)</button>
              </div>
              <iframe srcDoc={result.optimizedHTML} className="cv-preview" title="CV Optimise" />
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-gray-200 bg-white mt-12 py-6 text-center text-sm text-gray-400">ATS CV Optimizer</footer>
    </div>
  );
}