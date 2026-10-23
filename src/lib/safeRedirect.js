/**
 * Garde-fou anti open redirect pour les paramètres `callbackUrl`.
 *
 * N'accepte que des destinations internes :
 *  - chemin absolu du site ("/app", "/cv/42?x=1") ;
 *  - URL absolue de MÊME ORIGINE (NextAuth renvoie souvent
 *    "http://localhost:3000/app" ou "https://www.prospecho.fr/app"),
 *    réduite à son pathname.
 * Tout le reste (autre domaine, protocole-relatif "//evil.com", "javascript:",
 * backslashs, caractères de contrôle…) retombe sur `fallback` ("/app").
 */
export const DEFAULT_REDIRECT = '/app';

function isInternalPath(value) {
  if (!value.startsWith('/')) return false;
  // "//evil.com" et "/\evil.com" sont protocole-relatifs pour les navigateurs.
  if (value.startsWith('//') || value.startsWith('/\\')) return false;
  // Backslashs et caractères de contrôle : normalisés/ignorés par certains
  // navigateurs, ils servent à contourner les vérifications ci-dessus.
  if (value.includes('\\')) return false;
  if (/[\u0000-\u001f\u007f]/.test(value)) return false;
  return true;
}

export function safeRedirect(raw, fallback = DEFAULT_REDIRECT) {
  if (typeof raw !== 'string') return fallback;
  const value = raw.trim();
  if (!value) return fallback;

  if (value.startsWith('/')) return isInternalPath(value) ? value : fallback;

  // URL absolue : acceptée uniquement si elle pointe sur l'origine courante.
  try {
    const url = new URL(value);
    const origin = typeof window !== 'undefined' && window.location ? window.location.origin : null;
    if (!origin || url.origin !== origin) return fallback;
    const path = `${url.pathname}${url.search}${url.hash}`;
    return isInternalPath(path) ? path : fallback;
  } catch {
    return fallback;
  }
}

export default safeRedirect;
