import { createTheme } from '@mui/material/styles';

// Charte Prospecho — partagée entre les pages historiques (Pages Router,
// via _app.js) et le blog (App Router, via app/layout.tsx). Centraliser le
// thème évite que les deux arbres React divergent visuellement.
export const BRAND = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#e8f0fe',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#202124',
  textSecondary: '#5f6368',
  border: '#dadce0',
  borderLight: '#e8eaed',
  success: '#188038',
  warning: '#b06000',
};

const theme = createTheme({
  palette: {
    primary: { main: BRAND.primary, dark: BRAND.primaryDark, light: BRAND.primaryLight },
    background: { default: BRAND.background, paper: BRAND.surface },
    text: { primary: BRAND.text, secondary: BRAND.textSecondary },
  },
  typography: {
    fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', borderRadius: 28 } },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiLink: { defaultProps: { underline: 'hover' } },
  },
});

export default theme;
