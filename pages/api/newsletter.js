export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  const { email } = req.body || {};
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'Adresse e-mail invalide.' });
  }
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: 'Configuration serveur manquante.' });
  }
  const r = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      listIds: [parseInt(process.env.BREVO_LIST_ID || '2', 10)],
      updateEnabled: true,
    }),
  });
  if (r.status === 204 || r.status === 201 || r.status === 200) {
    return res.status(200).json({ ok: true });
  }
  if (r.status === 400) {
    const data = await r.json();
    if (data.code === 'duplicate_parameter') {
      return res.status(200).json({ ok: true });
    }
  }
  const err = await r.text();
  console.error('Brevo error', r.status, err);
  return res.status(500).json({ ok: false, error: 'Erreur lors de l inscription.' });
}
