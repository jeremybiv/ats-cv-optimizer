import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    return true;
  } catch (e) {
    console.error('[DB] Init error:', e.message);
    return false;
  }
}

export async function findUserByEmail(email) {
  try {
    const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function createUser({ email, password, name }) {
  const hashed = await bcrypt.hash(password, 10);
  try {
    const { rows } = await sql`
      INSERT INTO users (email, password, name)
      VALUES (${email}, ${hashed}, ${name || email.split('@')[0]})
      RETURNING id, email, name, created_at
    `;
    return rows[0];
  } catch (e) {
    if (e.message.includes('duplicate')) throw new Error('Cet email est déjà utilisé.');
    throw e;
  }
}
