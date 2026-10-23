'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import type { Block } from '../../blog/types';
import { BRAND } from '../../theme';
import RichText from './RichText';

const bodySx = {
  color: '#3c4043',
  fontSize: { xs: '1rem', md: '1.05rem' },
  lineHeight: 1.85,
  mb: 2.5,
};

/**
 * Rendu du corps d'article à partir de blocs structurés.
 * Chaque H2 possède un id stable : le sommaire et les liens profonds
 * (#section) restent valides même si le contenu évolue.
 */
export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <Box component="article">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <Typography
                key={i}
                variant="h2"
                id={block.id}
                sx={{
                  fontSize: { xs: '1.45rem', md: '1.7rem' },
                  fontWeight: 500,
                  color: BRAND.text,
                  mt: i === 0 ? 1 : 5,
                  mb: 2,
                  scrollMarginTop: '96px',
                  lineHeight: 1.35,
                }}
              >
                {block.text}
              </Typography>
            );

          case 'h3':
            return (
              <Typography
                key={i}
                variant="h3"
                id={block.id}
                sx={{
                  fontSize: { xs: '1.12rem', md: '1.22rem' },
                  fontWeight: 600,
                  color: BRAND.text,
                  mt: 3.5,
                  mb: 1.5,
                  scrollMarginTop: '96px',
                  lineHeight: 1.4,
                }}
              >
                {block.text}
              </Typography>
            );

          case 'p':
            return (
              <Typography key={i} component="p" sx={bodySx}>
                <RichText text={block.text} />
              </Typography>
            );

          case 'ul':
            return (
              <Box
                key={i}
                component="ul"
                sx={{ ...bodySx, pl: 3, mt: 0, '& li': { mb: 1, pl: 0.5 }, '& li::marker': { color: BRAND.primary } }}
              >
                {block.items.map((item, j) => (
                  <li key={j}>
                    <RichText text={item} />
                  </li>
                ))}
              </Box>
            );

          case 'ol':
            return (
              <Box
                key={i}
                component="ol"
                sx={{ ...bodySx, pl: 3, mt: 0, '& li': { mb: 1, pl: 0.5 }, '& li::marker': { color: BRAND.primary, fontWeight: 600 } }}
              >
                {block.items.map((item, j) => (
                  <li key={j}>
                    <RichText text={item} />
                  </li>
                ))}
              </Box>
            );

          case 'table':
            return (
              <Box key={i} sx={{ my: 4 }}>
                <Box sx={{ overflowX: 'auto', border: `1px solid ${BRAND.borderLight}`, borderRadius: '12px' }}>
                  <Box
                    component="table"
                    sx={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      minWidth: 520,
                      fontSize: '0.9rem',
                      '& th': {
                        bgcolor: '#f1f3f4',
                        color: BRAND.text,
                        fontWeight: 600,
                        textAlign: 'left',
                        px: 2,
                        py: 1.5,
                        borderBottom: `1px solid ${BRAND.border}`,
                      },
                      '& td': {
                        px: 2,
                        py: 1.5,
                        color: '#3c4043',
                        borderBottom: `1px solid ${BRAND.borderLight}`,
                        verticalAlign: 'top',
                      },
                      '& tr:last-of-type td': { borderBottom: 'none' },
                    }}
                  >
                    <thead>
                      <tr>
                        {block.headers.map((h, j) => (
                          <th key={j}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {block.rows.map((row, j) => (
                        <tr key={j}>
                          {row.map((cell, k) => (
                            <td key={k}>
                              <RichText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Box>
                </Box>
                {block.caption ? (
                  <Typography sx={{ color: '#80868b', fontSize: '0.8rem', mt: 1, textAlign: 'center' }}>
                    {block.caption}
                  </Typography>
                ) : null}
              </Box>
            );

          case 'callout':
            return (
              <Box
                key={i}
                sx={{
                  bgcolor: BRAND.primaryLight,
                  borderLeft: `4px solid ${BRAND.primary}`,
                  borderRadius: '12px',
                  p: { xs: 2, md: 2.5 },
                  my: 3.5,
                }}
              >
                {block.title ? (
                  <Typography sx={{ fontWeight: 600, color: '#174ea6', fontSize: '0.95rem', mb: 0.8 }}>
                    {block.title}
                  </Typography>
                ) : null}
                <Typography sx={{ color: '#174ea6', fontSize: '0.95rem', lineHeight: 1.75 }}>
                  <RichText text={block.text} />
                </Typography>
              </Box>
            );

          case 'quote':
            return (
              <Box
                key={i}
                component="blockquote"
                sx={{
                  borderLeft: `3px solid ${BRAND.border}`,
                  pl: 2.5,
                  my: 3,
                  mx: 0,
                  fontStyle: 'italic',
                  color: BRAND.textSecondary,
                }}
              >
                <Typography sx={{ fontSize: '1.02rem', lineHeight: 1.75, fontStyle: 'italic' }}>
                  <RichText text={block.text} />
                </Typography>
                {block.source ? (
                  <Typography sx={{ fontSize: '0.82rem', color: '#80868b', mt: 1, fontStyle: 'normal' }}>
                    — {block.source}
                  </Typography>
                ) : null}
              </Box>
            );

          default:
            return null;
        }
      })}
    </Box>
  );
}
