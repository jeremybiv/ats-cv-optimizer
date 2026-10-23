import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://prospecho.fr'),
  title: {
    default: 'Blog Prospecho — Trouver un job tech en 2026',
    template: '%s | Blog Prospecho',
  },
  description:
    "Guides concrets pour trouver un job tech en 2026 : CV ATS, mots-clés, salaires, reconversion, portfolio GitHub et entretiens techniques.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
