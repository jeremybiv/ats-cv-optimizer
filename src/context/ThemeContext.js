import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState('light');

  // Load preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme-mode');
      if (saved === 'dark') {
        setMode('dark');
      }
    } catch {}
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const next = prevMode === 'light' ? 'dark' : 'light';
          try {
            localStorage.setItem('theme-mode', next);
          } catch {}
          return next;
        });
      },
      mode,
    }),
    [mode],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#1a73e8' },
          ...(mode === 'dark'
            ? {
                background: { default: '#121212', paper: '#1e1e1e' },
                text: { primary: '#e0e0e0', secondary: '#b0b0b0' },
              }
            : {
                background: { default: '#f8f9fa', paper: '#fff' },
                text: { primary: '#202124', secondary: '#5f6368' },
              }),
        },
        typography: {
          fontFamily: '"Google Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        },
        components: {
          MuiButton: { defaultProps: { disableElevation: true } },
          MuiPaper: { defaultProps: { elevation: 0 } },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
