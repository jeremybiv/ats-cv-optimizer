import { createUser, initDB } from '../../../src/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    await initDB();
    const { email, password, name } = req.body;
    if (!email || !password || password.length < 6)
      return res.status(400).json({ error: 'Email requis et mot de passe (6+ caractères)' });

    const user = await createUser({ email, password, name });
    res.status(201).json({ success: true, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
