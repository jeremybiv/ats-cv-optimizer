import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../src/lib/auth';
import { getGeneratedCVById } from '../../../src/lib/db';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Non authentifié.' });
  }

  const userId = parseInt(session.user.id, 10);
  if (isNaN(userId)) {
    return res.status(401).json({ error: 'Session invalide.' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  const cvId = parseInt(id, 10);
  if (isNaN(cvId)) {
    return res.status(400).json({ error: 'ID invalide.' });
  }

  try {
    const cv = await getGeneratedCVById(cvId, userId);
    if (!cv) {
      return res.status(404).json({ error: 'CV non trouvé.' });
    }
    return res.json({ cv });
  } catch (err) {
    console.error('[History ID] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
