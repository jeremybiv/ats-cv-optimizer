/**
 * Modèle de contenu du blog.
 *
 * Les articles vivent dans content/blog/*.ts sous forme de données typées
 * (et non de MDX) : aucune dépendance de build supplémentaire, un rendu
 * 100 % statique, et surtout des blocs structurés qui garantissent que le
 * JSON-LD, le sommaire et le corps de l'article restent toujours alignés.
 */

export type FaqItem = {
  /** Question formulée comme les gens la tapent dans un moteur / un LLM. */
  q: string;
  /** Réponse autonome, citable hors contexte (2 à 4 phrases). */
  a: string;
};

export type TableBlock = {
  type: 'table';
  caption?: string;
  headers: string[];
  rows: string[][];
};

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string; id: string }
  | { type: 'h3'; text: string; id?: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title?: string; text: string }
  | { type: 'quote'; text: string; source?: string }
  | TableBlock;

export type ArticleMeta = {
  slug: string;
  /** Titre SEO / H1 de la page. */
  title: string;
  /** Méta description (150-160 caractères). */
  description: string;
  /** Résumé de carte sur l'index (1 phrase). */
  excerpt: string;
  /**
   * Réponse directe à la question du titre, 40-60 mots.
   * Rendue dans un encadré « Réponse rapide » juste après le H1 : c'est le
   * passage que les LLM citent en priorité.
   */
  answer: string;
  /** Date de publication ISO (YYYY-MM-DD), sert au tri et au JSON-LD. */
  date: string;
  /** Date de dernière mise à jour ISO. */
  updated: string;
  category: 'Guide' | 'CV & ATS' | 'Carrière' | 'Recrutement' | 'Salaire';
  /** Temps de lecture affiché, ex. « 8 min ». */
  readingTime: string;
  /** Mots-clés ciblés (affichés en bas d'article + JSON-LD keywords). */
  keywords: string[];
  /** 3 slugs d'articles liés (maillage interne automatique). */
  related: string[];
  /** Position dans le blog : 1 = article pilier mis en avant. */
  featured?: boolean;
};

export type Article = {
  meta: ArticleMeta;
  blocks: Block[];
  faq: FaqItem[];
};
