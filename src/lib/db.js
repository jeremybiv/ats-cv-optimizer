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
      subscription_status VARCHAR(20) DEFAULT 'free',
      stripe_customer_id VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    // Ensure the subscription columns exist on already-created tables (Neon / Postgres)
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free'`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255)`;
    await sql`CREATE TABLE IF NOT EXISTS shared_cvs (
      id VARCHAR(36) PRIMARY KEY,
      html TEXT NOT NULL,
      email VARCHAR(255),
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS usage_cv (
      user_id INTEGER REFERENCES users(id),
      month TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, month)
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

// ── SUBSCRIPTION (Stripe webhook) ─────────────

export async function setUserSubscription({ email, status, stripeCustomerId = null }) {
  await initDB();
  try {
    if (email) {
      const { rows } = await sql`
        UPDATE users
        SET subscription_status = ${status}, stripe_customer_id = ${stripeCustomerId}
        WHERE email = ${email}
        RETURNING id, email, subscription_status
      `;
      return rows[0] || null;
    }
    // Fallback when the event only carries the Stripe customer id (e.g. subscription.deleted)
    if (stripeCustomerId) {
      const { rows } = await sql`
        UPDATE users
        SET subscription_status = ${status}
        WHERE stripe_customer_id = ${stripeCustomerId}
        RETURNING id, email, subscription_status
      `;
      return rows[0] || null;
    }
    return null;
  } catch (e) {
    console.error('[DB] setUserSubscription error:', e.message);
    return null;
  }
}

// ── USAGE QUOTA (free plan: 3 CV/month) ───────
// ── USAGE QUOTA (free plan: 3 CV/month) ───────

export function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export async function getUserUsage(userId) {
  await initDB();
  try {
    const month = currentMonth();
    const { rows } = await sql`SELECT count FROM usage_cv WHERE user_id = ${userId} AND month = ${month}`;
    return rows[0]?.count || 0;
  } catch (e) {
    console.error('[DB] getUserUsage error:', e.message);
    return 0;
  }
}

export async function incrementUsage(userId) {
  await initDB();
  try {
    const month = currentMonth();
    await sql`
      INSERT INTO usage_cv (user_id, month, count)
      VALUES (${userId}, ${month}, 1)
      ON CONFLICT (user_id, month) DO UPDATE SET count = usage_cv.count + 1
    `;
    return true;
  } catch (e) {
    console.error('[DB] incrementUsage error:', e.message);
    return false;

  }
}

// ── CV HISTORY ──────────────────────────

export async function saveGeneratedCV({ userId, jobTitle, company, templateUsed, html, score }) {
  await initDB();
  try {
    await sql`
      INSERT INTO generated_cvs (user_id, job_title, company, template_used, html, score)
      VALUES (${userId}, ${jobTitle || ''}, ${company || ''}, ${templateUsed || 'visual'}, ${html || ''}, ${score || 0})
    `;
    return true;
  } catch (e) {
    console.error('[DB] saveGeneratedCV error:', e.message);
    return false;
  }
}

export async function getUserGeneratedCVs(userId) {
  await initDB();
  try {
    const { rows } = await sql`
      SELECT id, job_title, company, template_used, score, created_at
      FROM generated_cvs WHERE user_id = ${userId}
      ORDER BY created_at DESC LIMIT 20
    `;
    return rows;
  } catch {
    return [];
  }
}

export async function getGeneratedCVById(id) {
  await initDB();
  try {
    const { rows } = await sql`
      SELECT * FROM generated_cvs WHERE id = ${id}
    `;
    return rows[0] || null;
  } catch {
    return null;
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
