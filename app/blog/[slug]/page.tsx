import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleView from '../../../src/components/blog/ArticleView';
import { articles, getArticle, getRelated } from '../../../content/blog';
import { buildArticleJsonLd } from '../../../src/blog/seo';

/** Aucune page générée à la demande : les 10 slugs sont connus au build. */
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.meta.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const article = getArticle(params.slug);
  if (!article) return {};

  const { meta } = article;
  const path = `/blog/${meta.slug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      title: meta.title,
      description: meta.description,
      url: path,
      siteName: 'Prospecho',
      locale: 'fr_FR',
      publishedTime: meta.date,
      modifiedTime: meta.updated,
      authors: ['Jérémy Bivaud'],
      tags: meta.keywords,
      images: [
        {
          url: '/og-blog.png',
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
      images: ['/og-blog.png'],
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  const jsonLd = buildArticleJsonLd(article);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView article={article} related={getRelated(article)} />
    </>
  );
}
