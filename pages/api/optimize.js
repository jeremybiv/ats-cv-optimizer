import { getServerSession } from 'next-auth';
import { authOptions } from '../../src/lib/auth';
import { extractJobDescription } from '../../src/lib/jobFetcher';
import { parseTextFromBase64, parseCVSmart, extractJobTitle } from '../../src/lib/parsers';
import { extractKeywords, scoreCV, generateOptimizedCV, formatCVHTML } from '../../src/lib/atsEngine';
import { findUserByEmail, getUserUsage, incrementUsage } from '../../src/lib/db';

export const config = { api: { bodyParser: { sizeLimit: '10mb' } } };

const FREE_PLAN_MONTHLY_LIMIT = 2;

// Compte admin : toujours gratuit et illimité, quel que soit le statut d'abonnement en base.
const ADMIN_EMAILS = ['jeremy.bivaud@gmail.com'];

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  try {
    // ── Subscription quota check (free plan: 2 CV/month, Pro: unlimited) ──
    const session = await getServerSession(req, res, authOptions);
    if (session?.user?.id) {
      const isAdmin = ADMIN_EMAILS.includes((session.user.email || '').toLowerCase());
      const user = isAdmin ? null : await findUserByEmail(session.user.email);
      const isUnlimited = isAdmin || user?.subscription_status === 'active';
      if (!isUnlimited) {
        const usage = await getUserUsage(session.user.id);
        if (usage >= FREE_PLAN_MONTHLY_LIMIT) {
          return res.status(402).json({ error: 'Quota gratuit atteint - passe au forfait Pro (1,50€/CV)' });
        }
      }
    }

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
      // Extrait nom, email, expériences, formation et compétences depuis le texte
      // brut du CV (PDF ou saisie manuelle) au lieu de partir d'un objet vide.
      // parseCVSmart tente d'abord une structuration par IA (Claude Haiku),
      // plus robuste face aux mises en page atypiques, et retombe sur le
      // parseur regex historique si l'appel échoue.
      parsedCV = { ...(await parseCVSmart(cvText)), text: cvText };
    }

    const cvScore = cvText ? scoreCV(cvText, keywords) : { matchScore: 0, keywordCount: 0, missingCount: 0, structureScore: 70, foundKeywords: [] };
    // Title was previously always '' here, which made the generated CV fall
    // back to a literal "Titre du poste visé" placeholder that leaked
    // straight into the exported document instead of ever showing the
    // actual target role.
    const jobP = { title: extractJobTitle(jd), company: '', location: '', type: '', summary: jd.slice(0, 500), description: jd };

    const optimizedHTML = generateOptimizedCV({ cvText, job: jobP, jobKeywords: keywords, parsedCV, strictMode });
    const finalHTML = formatCVHTML(optimizedHTML, keywords);

    // ── Count this generation toward the monthly usage quota ──
    if (session?.user?.id) {
      await incrementUsage(session.user.id);
    }

    res.json({
      html: finalHTML,
      matchScore: cvScore.matchScore || Math.min(parseInt(keywords.technical?.length || 0) * 12 + 30, 95),
      keywordCount: keywords.all?.length || keywords.length || 0,
      missingCount: cvScore.missingCount || 0,
      structureScore: cvScore.structureScore || 80,
      keywords: keywords.all || keywords || [],
      foundKeywords: cvScore.foundKeywords || (keywords.technical || []).slice(0, 8),
      cvText,
      jobText: jd,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
