import type { Article } from './types';

export const SITE_URL = 'https://prospecho.fr';
export const BLOG_URL = `${SITE_URL}/blog`;

/** Compte les mots réellement affichés (hors slugs/URLs), pour le JSON-LD. */
export function countWords(article: Article): number {
  const texts: string[] = [article.meta.answer];
  for (const b of article.blocks) {
    if (b.type === 'p' || b.type === 'callout' || b.type === 'quote') texts.push(b.text);
    else if (b.type === 'h2' || b.type === 'h3') texts.push(b.text);
    else if (b.type === 'ul' || b.type === 'ol') texts.push(...b.items);
    else if (b.type === 'table') texts.push(...b.headers, ...b.rows.flat());
  }
  return texts.join(' ').split(/\s+/).filter(Boolean).length;
}

/**
 * Article + FAQPage + BreadcrumbList dans un seul @graph.
 * Un seul script JSON-LD par page = plus simple à valider et à déboguer.
 */
export function buildArticleJsonLd(article: Article) {
  const { meta } = article;
  const url = `${BLOG_URL}/${meta.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: meta.title,
        description: meta.description,
        datePublished: meta.date,
        dateModified: meta.updated,
        inLanguage: 'fr-FR',
        articleSection: meta.category,
        keywords: meta.keywords.join(', '),
        wordCount: countWords(article),
        isAccessibleForFree: true,
        image: [`${SITE_URL}/og-blog.png`],
        author: {
          '@type': 'Person',
          name: 'Jérémy Bivaud',
          url: `${SITE_URL}/`,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Prospecho',
          url: SITE_URL,
        },
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: article.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: BLOG_URL },
          { '@type': 'ListItem', position: 3, name: meta.title, item: url },
        ],
      },
    ],
  };
}

/** ItemList + Blog pour la page d'index (aide les LLM à voir le corpus). */
export function buildBlogIndexJsonLd(articles: Article[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${BLOG_URL}#blog`,
        name: 'Blog Prospecho',
        description:
          "Guides concrets pour trouver un job tech en 2026 : CV ATS, mots-clés, salaires, reconversion, portfolio GitHub et entretiens.",
        url: BLOG_URL,
        inLanguage: 'fr-FR',
        publisher: { '@type': 'Organization', name: 'Prospecho', url: SITE_URL },
      },
      {
        '@type': 'ItemList',
        '@id': `${BLOG_URL}#articles`,
        itemListElement: articles.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${BLOG_URL}/${a.meta.slug}`,
          name: a.meta.title,
        })),
      },
    ],
  };
}
