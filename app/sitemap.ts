import type { MetadataRoute } from 'next';
import { articles } from '../content/blog';

const SITE_URL = 'https://prospecho.fr';
const STATIC_LAST_MODIFIED = new Date('2026-08-15');

/**
 * Sitemap généré depuis la source de vérité du blog (content/blog/index.ts).
 * Ajouter un article suffit : l'URL apparaît ici sans intervention manuelle.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/app`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(articles[0]?.meta.updated || '2026-10-23'),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/mentions-legales`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/cgu`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/confidentialite`,
      lastModified: STATIC_LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.meta.slug}`,
    lastModified: new Date(article.meta.updated),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  return [...staticPages, ...articlePages];
}
