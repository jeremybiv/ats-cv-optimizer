import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../src/lib/auth';
import { initDB, saveGeneratedCV, getUserGeneratedCVs } from '../../../src/lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) {
    return res.status(401).json({ error: 'Session invalide.' });
  }

  await initDB();

  if (req.method === 'GET') {
    try {
      const cvs = await getUserGeneratedCVs(userId);
      return res.json({ cvs });
    } catch (err) {
      console.error('[History GET] Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const { jobTitle, company, templateUsed, html, score } = req.body;
      if (!html) {
        return res.status(400).json({ error: 'Le champ html est requis.' });
      }
      const cv = await saveGeneratedCV({
        userId,
        jobTitle: jobTitle || '',
        company: company || '',
        templateUsed: templateUsed || 'visual',
        html,
        score: score || null,
      });
      return res.json({ success: true, cv });
    } catch (err) {
      console.error('[History POST] Error:', err.message);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
