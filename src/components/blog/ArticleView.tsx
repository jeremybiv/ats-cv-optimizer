'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Button, Card, CardActionArea, Container, Divider, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import type { Article, ArticleMeta, Block } from '../../blog/types';
import { BRAND } from '../../theme';
import ArticleBody from './ArticleBody';

const MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

/** Formatage déterministe (pas d'Intl) : même rendu serveur et client. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export default function ArticleView({ article, related }: { article: Article; related: ArticleMeta[] }) {
  const { meta, blocks, faq } = article;
  const h2s = blocks.filter((b) => b.type === 'h2') as Extract<Block, { type: 'h2' }>[];

  return (
    <Box sx={{ bgcolor: BRAND.background }}>
      <Container maxWidth="md" sx={{ pt: { xs: 3, md: 5 }, pb: 2 }}>
        {/* Fil d'Ariane — repris en JSON-LD BreadcrumbList par la page. */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 3, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: BRAND.textSecondary, fontSize: '0.82rem', textDecoration: 'none' }}>
            Accueil
          </Link>
          <Typography sx={{ color: '#bdc1c6', fontSize: '0.82rem' }}>/</Typography>
          <Link href="/blog" style={{ color: BRAND.textSecondary, fontSize: '0.82rem', textDecoration: 'none' }}>
            Blog
          </Link>
          <Typography sx={{ color: '#bdc1c6', fontSize: '0.82rem' }}>/</Typography>
          <Typography sx={{ color: '#80868b', fontSize: '0.82rem' }} noWrap>
            {meta.category}
          </Typography>
        </Box>

        <Typography
          sx={{
            color: BRAND.primary,
            fontWeight: 600,
            fontSize: '0.78rem',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            mb: 1.5,
          }}
        >
          {meta.category}
        </Typography>

        <Typography
          variant="h1"
          component="h1"
          sx={{
            fontSize: { xs: '1.85rem', md: '2.5rem' },
            fontWeight: 500,
            color: BRAND.text,
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
            mb: 2.5,
          }}
        >
          {meta.title}
        </Typography>

        {/* Answer-first : les ~50 mots que les LLM citent en priorité. */}
        <Box
          sx={{
            bgcolor: '#e8f0fe',
            borderRadius: '16px',
            p: { xs: 2.5, md: 3 },
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
            <AutoAwesomeIcon sx={{ color: BRAND.primary, fontSize: 16 }} />
            <Typography sx={{ color: '#174ea6', fontWeight: 700, fontSize: '0.76rem', letterSpacing: 1 }}>
              RÉPONSE RAPIDE
            </Typography>
          </Box>
          <Typography sx={{ color: '#174ea6', fontSize: { xs: '1rem', md: '1.06rem' }, lineHeight: 1.7, fontWeight: 400 }}>
            {meta.answer}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 4 }}>
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.85rem' }}>
            Par Jérémy Bivaud · {formatDate(meta.date)}
          </Typography>
          <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#bdc1c6' }} />
          <Typography sx={{ color: BRAND.textSecondary, fontSize: '0.85rem' }}>{meta.readingTime} de lecture</Typography>
          {meta.updated !== meta.date ? (
            <>
              <Box sx={{ width: 3, height: 3, borderRadius: '50%', bgcolor: '#bdc1c6' }} />
              <Typography sx={{ color: '#80868b', fontSize: '0.85rem' }}>Mis à jour le {formatDate(meta.updated)}</Typography>
            </>
          ) : null}
        </Box>
      </Container>

      <Container maxWidth="md">
        {h2s.length >= 3 ? (
          <Box
            sx={{
              bgcolor: '#fff',
              border: `1px solid ${BRAND.borderLight}`,
              borderRadius: '16px',
              p: { xs: 2, md: 2.5 },
              mb: 4,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: BRAND.text, fontSize: '0.9rem', mb: 1.2 }}>
              Au sommaire
            </Typography>
            <Box component="ol" sx={{ pl: 2.5, m: 0, '& li': { mb: 0.6 }, '& a': { color: BRAND.textSecondary, fontSize: '0.88rem', textDecoration: 'none', '&:hover': { color: BRAND.primary, textDecoration: 'underline' } } }}>
              {h2s.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`}>{h.text}</a>
                </li>
              ))}
            </Box>
          </Box>
        ) : null}

        <ArticleBody blocks={blocks} />

        {/* FAQ visible — identique au FAQPage JSON-LD généré par la page. */}
        {faq.length > 0 ? (
          <Box component="section" sx={{ mt: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              id="faq"
              sx={{ fontSize: { xs: '1.45rem', md: '1.7rem' }, fontWeight: 500, color: BRAND.text, mb: 2.5, scrollMarginTop: '96px' }}
            >
              Questions fréquentes
            </Typography>
            {faq.map((item, i) => (
              <Box
                key={i}
                sx={{
                  bgcolor: '#fff',
                  border: `1px solid ${BRAND.borderLight}`,
                  borderRadius: '16px',
                  p: { xs: 2, md: 2.5 },
                  mb: 1.5,
                }}
              >
                <Typography component="h3" sx={{ fontWeight: 600, color: BRAND.text, fontSize: '1rem', mb: 0.8 }}>
                  {item.q}
                </Typography>
                <Typography sx={{ color: '#3c4043', fontSize: '0.94rem', lineHeight: 1.7 }}>{item.a}</Typography>
              </Box>
            ))}
          </Box>
        ) : null}

        <Box sx={{ mt: 4, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {meta.keywords.map((kw) => (
            <Box
              key={kw}
              sx={{
                bgcolor: '#f1f3f4',
                color: BRAND.textSecondary,
                borderRadius: '28px',
                px: 1.6,
                py: 0.5,
                fontSize: '0.75rem',
              }}
            >
              {kw}
            </Box>
          ))}
        </Box>

        {/* CTA produit + lien accueil (maillage interne). */}
        <Box
          sx={{
            mt: 6,
            p: { xs: 3, md: 4 },
            borderRadius: '20px',
            background: 'linear-gradient(180deg, #e8f0fe 0%, #f8f9fa 100%)',
            border: `1px solid ${BRAND.borderLight}`,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' }, fontWeight: 500, color: BRAND.text, mb: 1 }}>
            Ton CV passe-t-il vraiment l&apos;ATS ?
          </Typography>
          <Typography sx={{ color: BRAND.textSecondary, mb: 2.5, fontSize: '0.95rem' }}>
            Analyse ton CV face à une offre réelle et obtiens un score détaillé en quelques secondes.
          </Typography>
          <Link href="/app" style={{ textDecoration: 'none' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ borderRadius: '28px', bgcolor: BRAND.primary, px: 4, '&:hover': { bgcolor: BRAND.primaryDark } }}
            >
              Optimiser mon CV gratuitement
            </Button>
          </Link>
          <Box sx={{ mt: 1.5 }}>
            <Link href="/" style={{ color: BRAND.textSecondary, fontSize: '0.82rem' }}>
              En savoir plus sur Prospecho
            </Link>
          </Box>
        </Box>

        {related.length > 0 ? (
          <Box component="section" sx={{ mt: 7 }}>
            <Divider sx={{ mb: 4 }} />
            <Typography sx={{ fontSize: '1.3rem', fontWeight: 500, color: BRAND.text, mb: 2.5 }}>
              À lire ensuite
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2 }}>
              {related.map((a) => (
                <Card key={a.slug} sx={{ border: `1px solid ${BRAND.borderLight}`, borderRadius: '16px', bgcolor: '#fff' }}>
                  <CardActionArea component={Link} href={`/blog/${a.slug}`} sx={{ p: 2.2, height: '100%', display: 'block' }}>
                    <Typography sx={{ color: BRAND.primary, fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, mb: 0.8 }}>
                      {a.category}
                    </Typography>
                    <Typography sx={{ color: BRAND.text, fontWeight: 500, fontSize: '0.95rem', lineHeight: 1.4 }}>
                      {a.title}
                    </Typography>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        ) : null}

        <Box sx={{ height: 48 }} />
      </Container>
    </Box>
  );
}
