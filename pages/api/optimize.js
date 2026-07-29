import { extractJobDescription } from '../../src/lib/jobFetcher';
import { parseTextFromBase64 } from '../../src/lib/parsers';
import { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML } from '../../src/lib/atsEngine';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    const { cvBase64, jobUrl, jobText, strictMode, cvText: directCvText, linkedinData } = req.body;
    let jd = jobText;
    if (jobUrl && !jd) jd = await extractJobDescription(jobUrl);
    if (!jd) throw new Error('Aucune offre d emploi fournie.');
    let cvText = '';

    // Priority: cvBase64 > directCvText > linkedinData text
    if (cvBase64) {
      cvText = await parseTextFromBase64(cvBase64);
    } else if (directCvText) {
      cvText = directCvText;
    } else if (linkedinData) {
      // Build a cvText from linkedin data
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
      cvText = parts.join('\n');
    }

    const keywords = extractKeywords(jd);

    // Build parsedCV from linkedinData if available
    let parsedCV = null;
    if (linkedinData) {
      parsedCV = {
        text: cvText,
        name: linkedinData.name || '',
        email: linkedinData.email || '',
        phone: '',
        summary: linkedinData.summary || '',
        skills: linkedinData.skills || [],
        experience: (linkedinData.experience || []).map(e => ({
          title: e.title || '',
          company: e.company || '',
          dates: e.dates || '',
          description: e.description || [],
        })),
        education: [],
      };
    } else if (cvText) {
      parsedCV = { text: cvText, name: '', email: '', phone: '', summary: '', skills: [], experience: [], education: [] };
    }

    const cvScore = cvText ? scoreCV(cvText, keywords) : { matchScore: 0, keywordCount: 0, missingCount: 0, structureScore: 70, foundKeywords: [] };
    const jobP = { title: '', company: '', location: '', type: '', summary: jd.slice(0, 500), description: jd };

    const optimizedHTML = generateOptimizedCV({ cvText, job: jobP, jobKeywords: keywords, parsedCV, strictMode });
    const finalHTML = formatCVHTML(optimizedHTML, keywords);

    res.json({
      html: finalHTML,
      matchScore: cvScore.matchScore || Math.min(parseInt(keywords.technical?.length || 0) * 12 + 30, 95),
      keywordCount: keywords.all?.length || keywords.length || 0,
      missingCount: cvScore.missingCount || 0,
      structureScore: cvScore.structureScore || 80,
      keywords: keywords.all || keywords || [],
      foundKeywords: cvScore.foundKeywords || (keywords.technical || []).slice(0, 8),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
