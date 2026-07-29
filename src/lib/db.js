import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Support both Vercel Postgres (POSTGRES_URL) and Neon (DATABASE_URL)
const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
if (connectionString) {
  process.env.POSTGRES_URL = connectionString;
}

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS shared_cvs (
      id VARCHAR(36) PRIMARY KEY,
      html TEXT NOT NULL,
      email VARCHAR(255),
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS generated_cvs (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      job_title TEXT,
      company TEXT,
      template_used TEXT DEFAULT 'visual',
      html TEXT,
      score INTEGER,
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

export async function createSharedCV({ html, email = null, name = null }) {
  const id = crypto.randomUUID();
  await sql`
    INSERT INTO shared_cvs (id, html, email, name)
    VALUES (${id}, ${html}, ${email}, ${name})
  `;
  return id;
}

export async function getSharedCV(id) {
  try {
    const { rows } = await sql`SELECT * FROM shared_cvs WHERE id = ${id}`;
    return rows[0] || null;
  } catch {
    return null;
  }
}

// -- Generated CVs (Historique) --

export async function saveGeneratedCV({ userId, jobTitle, company, templateUsed, html, score }) {
  try {
    const { rows } = await sql`
      INSERT INTO generated_cvs (user_id, job_title, company, template_used, html, score)
      VALUES (${userId}, ${jobTitle || null}, ${company || null}, ${templateUsed || 'visual'}, ${html}, ${score || null})
      RETURNING id, job_title, company, template_used, score, created_at
    `;
    return rows[0];
  } catch (e) {
    console.error('[DB] saveGeneratedCV error:', e.message);
    throw e;
  }
}

export async function getUserGeneratedCVs(userId, limit = 20) {
  try {
    const { rows } = await sql`
      SELECT id, job_title, company, template_used, score, created_at
      FROM generated_cvs
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return rows;
  } catch (e) {
    console.error('[DB] getUserGeneratedCVs error:', e.message);
    return [];
  }
}

export async function getGeneratedCVById(id, userId) {
  try {
    const { rows } = await sql`
      SELECT * FROM generated_cvs
      WHERE id = ${id} AND user_id = ${userId}
    `;
    return rows[0] || null;
  } catch {
    return null;
  }
}
