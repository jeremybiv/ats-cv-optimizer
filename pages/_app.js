import * as React from 'react';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import Head from 'next/head';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import theme from '../src/theme';

// Aperçu social par défaut, émis une seule fois ici pour que TOUTES les routes
// aient une carte (LinkedIn/WhatsApp/X affichent un aperçu vide sans og:image).
// Une page qui veut sa propre image peut la redéfinir dans son <Head>.
const OG_IMAGE = 'https://www.prospecho.fr/og-image.png';
const OG_IMAGE_ALT = 'Prospecho — le CV qui passe les ATS des grands groupes tech';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <meta property="og:image" content={OG_IMAGE} key="og:image" />
          <meta property="og:image:type" content="image/png" key="og:image:type" />
          <meta property="og:image:width" content="1200" key="og:image:width" />
          <meta property="og:image:height" content="630" key="og:image:height" />
          <meta property="og:image:alt" content={OG_IMAGE_ALT} key="og:image:alt" />
          <meta name="twitter:image" content={OG_IMAGE} key="twitter:image" />
          <meta name="twitter:image:alt" content={OG_IMAGE_ALT} key="twitter:image:alt" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
