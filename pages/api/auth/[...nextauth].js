import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function readUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const users = readUsers();
        const user = users.find(u => u.email === credentials?.email);
        if (!user) return null;
        const valid = await bcrypt.compare(credentials?.password || '', user.password);
        if (!valid) return null;
        return { id: user.id, name: user.name || user.email.split('@')[0], email: user.email };
      },
    }),
  ],
  pages: { signIn: '/login', newUser: '/signup' },
  session: { strategy: 'jwt', maxAge: 7 * 24 * 60 * 60 },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'ats-cv-2026-secret-prospimmo',
});
