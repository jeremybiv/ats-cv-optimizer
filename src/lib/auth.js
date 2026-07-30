import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { findUserByEmail } from './db';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const user = await findUserByEmail(credentials?.email);
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
};

export default NextAuth(authOptions);
