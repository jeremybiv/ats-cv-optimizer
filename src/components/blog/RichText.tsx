'use client';

import * as React from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { BRAND } from '../../theme';

/**
 * Rendu inline minimal : **gras**, `code` et [libellé](/lien).
 * Pas de Markdown complet — juste ce dont les articles ont besoin, sans
 * dépendance supplémentaire ni risque d'XSS (tout est rendu en React).
 */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export default function RichText({ text, sx }: { text: string; sx?: any }) {
  const parts = String(text).split(INLINE).filter((p) => p !== '');

  const nodes = parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <Box component="strong" key={i} sx={{ fontWeight: 600, color: BRAND.text }}>
          {part.slice(2, -2)}
        </Box>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <Box
          component="code"
          key={i}
          sx={{
            bgcolor: '#f1f3f4',
            borderRadius: '4px',
            px: 0.6,
            py: 0.2,
            fontSize: '0.88em',
            fontFamily: 'Roboto Mono, monospace',
          }}
        >
          {part.slice(1, -1)}
        </Box>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const isInternal = href.startsWith('/');
      const style = { color: BRAND.primary, textDecoration: 'underline', textUnderlineOffset: '2px' };
      return isInternal ? (
        <Link key={i} href={href} style={style}>
          {label}
        </Link>
      ) : (
        <a key={i} href={href} style={style} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });

  return (
    <Typography component="span" sx={{ fontSize: 'inherit', lineHeight: 'inherit', color: 'inherit', ...sx }}>
      {nodes}
    </Typography>
  );
}
