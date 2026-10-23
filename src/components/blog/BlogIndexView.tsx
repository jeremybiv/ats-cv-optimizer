'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Card, CardActionArea, Chip, Container, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import type { ArticleMeta } from '../../blog/types';
import { BRAND } from '../../theme';
import { formatDate } from './ArticleView';

/**
 * Index du blog. Les cartes sont triées par date de publication décroissante
 * (le tri est fait en amont dans content/blog/index.ts, donc identique au
 * sitemap et au JSON-LD ItemList).
 */
export default function BlogIndexView({ articles }: { articles: ArticleMeta[] }) {
  const featured = articles.find((a) => a.featured) || articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);

  return (
    <Box sx={{ bgcolor: BRAND.background, minHeight: '60vh' }}>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(180deg, #e8f0fe 0%, #f8f9fa 100%)', py: { xs: 6, md: 9 } }}>
        <Container maxWidth="lg">
          <Typography sx={{ color: BRAND.primary, fontWeight: 700, fontSize: '0.78rem', letterSpacing: 1.5, textTransform: 'uppercase', mb: 1.5 }}>
            Blog Prospecho
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{ fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 500, color: BRAND.text, lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 820, mb: 2 }}
          >
            Trouver un job tech en 2026 : des guides qui vont au bout des choses
          </Typography>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: { xs: '1rem', md: '1.1rem' }, maxWidth: 720, lineHeight: 1.7 }}>
            CV et ATS, mots-clés, salaires, reconversion, entretiens : dix guides concrets pour les
            développeurs, profils data, DevOps et cybersécurité — en France comme en Suisse.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        {/* Article pilier */}
        <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none' }}>
          <Card
            sx={{
              bgcolor: '#fff',
              border: `1px solid ${BRAND.borderLight}`,
              borderRadius: '20px',
              mb: 6,
              transition: 'box-shadow .2s, transform .2s',
              '&:hover': { boxShadow: '0 8px 28px rgba(32,33,36,.12)', transform: 'translateY(-2px)' },
            }}
          >
            <Box sx={{ p: { xs: 3, md: 4.5 }, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.4fr 1fr' }, gap: 4, alignItems: 'center' }}>
              <Box>
                <Chip
                  label="Guide pilier"
                  size="small"
                  sx={{ bgcolor: BRAND.primaryLight, color: '#174ea6', fontWeight: 600, mb: 2, borderRadius: '8px' }}
                />
                <Typography sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 500, color: BRAND.text, lineHeight: 1.3, mb: 1.5 }}>
                  {featured.title}
                </Typography>
                <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.98rem', lineHeight: 1.7, mb: 2.5 }}>
                  {featured.excerpt}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: BRAND.primary, fontWeight: 500, fontSize: '0.9rem' }}>
                  Lire le guide <ArrowForwardIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
              <Box sx={{ bgcolor: BRAND.background, borderRadius: '16px', p: 3, border: `1px solid ${BRAND.borderLight}` }}>
                <Typography sx={{ color: '#80868b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1, mb: 1.5 }}>
                  Ce que tu vas apprendre
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2.2, color: BRAND.textSecondary, fontSize: '0.88rem', lineHeight: 1.9 }}>
                  <li>Les 7 contrôles qu&apos;un ATS effectue réellement</li>
                  <li>La structure de CV qui survit à Workday et Taleo</li>
                  <li>Les mots-clés à reprendre, sans mentir</li>
                  <li>Un exemple avant / après commenté</li>
                </Box>
                <Typography sx={{ color: '#80868b', fontSize: '0.78rem', mt: 2 }}>
                  {featured.readingTime} de lecture · {formatDate(featured.date)}
                </Typography>
              </Box>
            </Box>
          </Card>
        </Link>

        <Typography sx={{ fontSize: '1.35rem', fontWeight: 500, color: BRAND.text, mb: 2.5 }}>
          Tous les articles
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {rest.map((a) => (
            <Link key={a.slug} href={`/blog/${a.slug}`} style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: '#fff',
                  border: `1px solid ${BRAND.borderLight}`,
                  borderRadius: '16px',
                  transition: 'box-shadow .2s, transform .2s',
                  '&:hover': { boxShadow: '0 6px 20px rgba(32,33,36,.10)', transform: 'translateY(-2px)' },
                }}
              >
                <CardActionArea sx={{ p: 2.8, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: BRAND.primary, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, mb: 1.2 }}>
                    {a.category}
                  </Typography>
                  <Typography sx={{ color: BRAND.text, fontSize: '1.05rem', fontWeight: 500, lineHeight: 1.4, mb: 1.2 }}>
                    {a.title}
                  </Typography>
                  <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.88rem', lineHeight: 1.65, mb: 2.5, flex: 1 }}>
                    {a.excerpt}
                  </Typography>
                  <Typography sx={{ color: '#80868b', fontSize: '0.76rem' }}>
                    {formatDate(a.date)} · {a.readingTime}
                  </Typography>
                </CardActionArea>
              </Card>
            </Link>
          ))}
        </Box>

        <Box sx={{ mt: 7, p: { xs: 3, md: 4 }, bgcolor: '#fff', border: `1px solid ${BRAND.borderLight}`, borderRadius: '20px', textAlign: 'center' }}>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 500, color: BRAND.text, mb: 1 }}>
            Ces guides sont écrits par l&apos;équipe Prospecho
          </Typography>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.92rem', maxWidth: 680, mx: 'auto', lineHeight: 1.7 }}>
            Nous analysons chaque jour des CV tech face à de vraies offres d&apos;emploi. Les chiffres et
            fourchettes cités sont des ordres de grandeur de marché 2026, pas des promesses.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
