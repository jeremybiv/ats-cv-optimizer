import { extractJobDescription } from '../../src/lib/jobFetcher';
import { parseTextFromBase64 } from '../../src/lib/parsers';
import { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML } from '../../src/lib/atsEngine';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { cvBase64, jobUrl, jobText } = req.body;

    // Get job description
    let jd = jobText;
    if (jobUrl && !jd) jd = await extractJobDescription(jobUrl);
    if (!jd) throw new Error('Aucune offre d emploi fournie.');

    // Get CV text
    let cvText = '';
    if (cvBase64) cvText = await parseTextFromBase64(cvBase64);

    const keywords = extractKeywords(jd);
    const cvScore = cvText ? scoreCV(cvText, keywords) : { matchScore: 0, keywordCount: 0, missingCount: keywords.length, structureScore: 70, foundKeywords: [] };

    const optimizedHTML = generateOptimizedCV({ cvText, job: jd, keywords });
    const finalHTML = formatCVHTML(optimizedHTML, keywords);

    res.json({
      html: finalHTML,
      matchScore: cvScore.matchScore,
      keywordCount: cvScore.keywordCount,
      missingCount: cvScore.missingCount,
      structureScore: cvScore.structureScore,
      keywords,
      foundKeywords: cvScore.foundKeywords || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
