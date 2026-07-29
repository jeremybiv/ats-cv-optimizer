import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { email, password, name } = req.body;
    if (!email || !password || password.length < 6)
      return res.status(400).json({ error: 'Email requis et mot de passe (6+ caractères)' });

    // Ensure data dir exists
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let users = [];
    try { users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8')); } catch { users = []; }

    if (users.find(u => u.email === email))
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
      id: String(Date.now()),
      email,
      password: hashed,
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

    res.status(201).json({ success: true, email: newUser.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
