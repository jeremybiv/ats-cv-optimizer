import { Html, Head, Main, NextScript } from 'next/document';

// Document-level tags (lang, charset, viewport, favicon) apply site-wide —
// centralising them here means every route gets a valid <html lang> for
// accessibility/SEO instead of only the pages that happen to set it.
export default function Document() {
  return (
    <Html lang="fr">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#141414" />
        {/* Inline SVG favicon — no /favicon.ico asset exists in public/, and
            pointing <link> at a missing file would just add a 404. */}
        <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%E2%9C%A8%3C/text%3E%3C/svg%3E" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
