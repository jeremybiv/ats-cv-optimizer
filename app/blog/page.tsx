import type { Metadata } from 'next';
import BlogIndexView from '../../src/components/blog/BlogIndexView';
import { articles } from '../../content/blog';
import { buildBlogIndexJsonLd } from '../../src/blog/seo';

const TITLE = 'CV, ATS et carrière tech : les guides 2026';
const DESCRIPTION =
  "Guides concrets pour trouver un job tech en 2026 : optimisation de CV pour les ATS, mots-clés par métier, structure, score ATS, salaires et entretiens.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    'cv ats',
    'optimiser cv ats',
    'mots-clés cv tech',
    'score ats',
    'structure cv développeur',
    'blog tech',
  ],
  alternates: { canonical: '/blog' },
  openGraph: {
    type: 'website',
    title: `${TITLE} | Blog Prospecho`,
    description: DESCRIPTION,
    url: '/blog',
    siteName: 'Prospecho',
    locale: 'fr_FR',
    images: [{ url: '/og-blog.png', width: 1200, height: 630, alt: 'Blog Prospecho — guides pour trouver un job tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${TITLE} | Blog Prospecho`,
    description: DESCRIPTION,
    images: ['/og-blog.png'],
  },
};

export default function BlogIndexPage() {
  const jsonLd = buildBlogIndexJsonLd(articles);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogIndexView articles={articles.map((a) => a.meta)} />
    </>
  );
}
