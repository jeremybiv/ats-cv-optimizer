import type { Article } from '../../src/blog/types';

import optimiserCvAts2026 from './optimiser-cv-ats-2026';
import motsClesTechAts from './mots-cles-tech-ats';
import structureCvDeveloppeur from './structure-cv-developpeur';
import scoreAts from './score-ats-comment-calcule';
import reconversionTech from './reconversion-tech-2026';
import negocierSalaire from './negocier-salaire-tech';
import portfolioGithub from './portfolio-github-recruteur';
import lettreMotivation from './lettre-motivation-tech';
import jobSansDiplome from './job-tech-sans-diplome';
import entretienTechnique from './entretien-technique-5-etapes';

/**
 * Source de vérité unique du blog.
 * L'index, les pages [slug], le sitemap et llms.txt s'appuient tous dessus :
 * ajouter un article = créer le fichier + l'ajouter ici.
 */
export const articles: Article[] = [
  optimiserCvAts2026,
  motsClesTechAts,
  structureCvDeveloppeur,
  scoreAts,
  reconversionTech,
  negocierSalaire,
  portfolioGithub,
  lettreMotivation,
  jobSansDiplome,
  entretienTechnique,
].sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.meta.slug === slug);
}

export function getRelated(article: Article): Article[] {
  return article.meta.related
    .map((slug) => getArticle(slug))
    .filter((a): a is Article => Boolean(a));
}
