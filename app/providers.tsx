'use client';

import * as React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import theme from '../src/theme';
import BlogHeader from '../src/components/blog/BlogHeader';
import SiteFooter from '../src/components/SiteFooter';

/**
 * Le blog vit dans l'App Router alors que le reste du site est en Pages
 * Router : ce provider recrée le même thème MUI que _app.js pour que les
 * deux arbres restent visuellement identiques.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
        <BlogHeader />
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
        <SiteFooter />
      </Box>
    </ThemeProvider>
  );
}
