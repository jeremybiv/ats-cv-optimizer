import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        const email = process.env.AUTH_EMAIL || 'demo@ats-cv.app';
        const password = process.env.AUTH_PASSWORD || 'ats2024';
        if (credentials?.email === email && credentials?.password === password) {
          return { id: 1, name: 'Utilisateur', email: email };
        }
        return null;
      },
    }),
  ],
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'ats-cv-secret-key-prospimmo-2026',
});
