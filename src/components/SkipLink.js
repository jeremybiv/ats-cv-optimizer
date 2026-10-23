import * as React from 'react';
import Box from '@mui/material/Box';

/**
 * Lien d'évitement (« skip link »).
 *
 * Premier élément focusable du document : permet aux utilisateurs clavier et
 * aux lecteurs d'écran de sauter la navigation et d'aller directement au
 * contenu principal (cible : #main-content).
 *
 * Invisible par défaut (hors écran via transform), visible uniquement au focus
 * clavier. `transform` est utilisé plutôt que `top: -100px` pour ne jamais
 * provoquer de débordement horizontal.
 */
export default function SkipLink({ href = '#main-content', children = 'Aller au contenu principal' }) {
  return (
    <Box
      component="a"
      href={href}
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 2000,
        px: 2,
        py: 1,
        bgcolor: '#1A73E8',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 600,
        lineHeight: 1.4,
        textDecoration: 'none',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
        transform: 'translateY(-200%)',
        transition: 'transform 0.15s ease-in-out',
        '&:focus, &:focus-visible': {
          transform: 'translateY(0)',
          outline: '3px solid #174EA6',
          outlineOffset: '2px',
        },
        '@media (prefers-reduced-motion: reduce)': {
          transition: 'none',
        },
      }}
    >
      {children}
    </Box>
  );
}
