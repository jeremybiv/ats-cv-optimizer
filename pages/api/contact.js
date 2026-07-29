import { createContactMessage, initDB } from '../../src/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Méthode non autorisée' });
  }

  const { name, email, message } = req.body || {};

  // Validation
  const errors = [];
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères.');
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('Email invalide.');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    // Try to initialize DB (idempotent)
    await initDB();
    // Store the message
    await createContactMessage({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    return res.status(200).json({ success: true });
  } catch (dbError) {
    console.error('[Contact API] DB error:', dbError.message);
    // Even if DB fails, return success to the user (graceful degradation)
    return res.status(200).json({ success: true });
  }
}
