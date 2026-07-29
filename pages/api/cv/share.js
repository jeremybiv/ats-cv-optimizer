import { createSharedCV, initDB } from '../../../src/lib/db';

export const config = { api: { bodyParser: { sizeLimit: '5mb' } } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }
  try {
    const { html, email, name } = req.body;
    if (!html) {
      return res.status(400).json({ error: 'Le champ html est requis.' });
    }

    // Ensure shared_cvs table exists
    await initDB();

    const id = await createSharedCV({ html, email: email || null, name: name || null });

    // Build the public URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers['x-forwarded-proto'] || 'https'}://${req.headers.host}`;
    const publicUrl = `${baseUrl}/cv/${id}`;

    res.json({ success: true, id, url: publicUrl });
  } catch (err) {
    console.error('[CV Share] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
