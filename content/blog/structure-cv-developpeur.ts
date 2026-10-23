import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'structure-cv-developpeur',
    title: 'Structure de CV développeur qui passe les robots (avec exemple avant/après)',
    description:
      "La structure d'un CV développeur lisible par les ATS : ordre des sections, dates en MM/AAAA, puces XYZ avec résultat mesuré, et trois bullets réécrits avant/après.",
    excerpt:
      "Camille, 4 ans d'expérience en TypeScript et React : le CV avant, le CV après, et les trois puces qui changent tout.",
    answer:
      "Un CV de développeur lisible par un ATS suit un ordre fixe : en-tête avec nom et titre du poste, accroche de trois lignes, expérience en chronologique inversé, formation, compétences en liste. Chaque poste porte des dates en MM/AAAA et trois à cinq puces : verbe d'action, technologie, résultat mesuré. Une seule colonne, aucun tableau, aucune jauge graphique.",
    date: '2026-09-22',
    updated: '2026-10-23',
    category: 'CV & ATS',
    readingTime: '8 min',
    keywords: [
      'structure cv',
      'cv developpeur',
      'cv react',
      'cv typescript',
      'puces cv',
      'cv ats',
      'exemple cv',
    ],
    related: ['optimiser-cv-ats-2026', 'mots-cles-tech-ats', 'portfolio-github-recruteur'],
  },
  blocks: [
    { type: 'h2', text: "Le cas de départ : Camille, 4 ans d'expérience", id: 'cas-camille' },
    {
      type: 'p',
      text: "Camille est développeuse front-end, quatre ans d'expérience, TypeScript et React, un poste dans une scale-up parisienne puis une mission en ESN. Son CV actuel est joli : deux colonnes, une photo, des jauges de compétences à 80 % et un titre « Développeuse créative de solutions digitales ». Il est aussi presque illisible pour un ATS.",
    },
    {
      type: 'p',
      text: "Copié dans un éditeur de texte, son CV donne un bloc unique : le nom, la colonne de gauche puis celle de droite, les dates mélangées aux intitulés, les pourcentages sans intitulé de compétence à côté. Le parseur reconstruit ce qu'il peut. Résultat : deux expériences sur trois atterrissent dans le même champ, et la section compétences est vide.",
    },
    { type: 'h2', text: "L'ordre des sections qui fonctionne", id: 'ordre-des-sections' },
    {
      type: 'p',
      text: "Six blocs, toujours dans cet ordre. Un recruteur doit trouver l'information sans chercher ; un parseur doit la trouver sans deviner.",
    },
    {
      type: 'ol',
      items: [
        "**En-tête.** Nom, puis titre du poste visé. Email, téléphone avec indicatif, ville, GitHub. Rien d'autre.",
        "**Accroche.** Trois lignes : métier, années d'expérience, spécialité, ce que tu cherches.",
        '**Expérience professionnelle.** La plus récente en haut, trois à cinq puces par poste.',
        "**Formation.** Diplôme exact, établissement, année. Après l'expérience dès deux ans de métier.",
        '**Compétences.** Liste groupée par famille, en texte, sans niveau graphique.',
        '**Langues et certifications.** Niveaux au référentiel européen, libellés exacts des certifications.',
      ],
    },
    {
      type: 'p',
      text: "Deux exceptions : un profil junior met la formation avant l'expérience, et une reconversion place une section « Projets » après l'accroche. Les titres, eux, restent standards : un ATS reconnaît « Expérience professionnelle », pas « Mon aventure ».",
    },

    { type: 'h2', text: 'Le format des dates et des intitulés', id: 'format-dates-intitules' },
    {
      type: 'p',
      text: "Une date doit se lire sans contexte : `03/2022 - 09/2024`, jamais « deux ans chez Acme » ni « depuis 2022 » sans mois. Pour un poste en cours, `03/2022 - aujourd'hui` fonctionne. Le mois manquant est la cause la plus fréquente d'une expérience mal datée, donc mal comptée dans les filtres d'ancienneté.",
    },
    {
      type: 'p',
      text: "L'intitulé doit être celui de l'entreprise, pas ton titre interne. « Frontend Engineer » se cherche, « Ninja React » non. Si ton titre officiel est obscur, ajoute une précision : « Software Engineer (front-end React) ».",
    },
    {
      type: 'p',
      text: "Pour Camille, l'en-tête devient : « Camille R. — Développeuse front-end React / TypeScript ». Trois informations en une ligne, dont deux mots-clés exacts que le recruteur tapera dans son outil.",
    },

    { type: 'h2', text: 'Les puces XYZ : verbe, techno, résultat', id: 'puces-xyz' },
    {
      type: 'p',
      text: "Une puce faible décrit une activité, une puce utile prouve un effet. Le format XYZ : « verbe d'action + objet technique + résultat mesuré ». Le verbe dit ce que tu as fait, l'objet avec quoi, le résultat pourquoi.",
    },
    {
      type: 'p',
      text: "Trois règles. Un seul verbe par puce, au participe passé. Une technologie nommée exactement (« React », pas « framework JS »). Un chiffre vérifiable : latence, utilisateurs, taille d'équipe, délai, coût. Sans chiffre, décris le périmètre — sans l'inventer.",
    },
    {
      type: 'p',
      text: "Une puce fait une à deux lignes : au-delà, le lecteur décroche. Trois à cinq puces par poste suffisent, une seule pour les expériences anciennes.",
    },

    { type: 'h2', text: 'Avant / après : trois puces réécrites', id: 'avant-apres-trois-puces' },
    {
      type: 'p',
      text: "Les trois puces ci-dessous viennent du CV de Camille. La colonne de gauche décrit son travail, la colonne de droite le prouve.",
    },
    {
      type: 'table',
      caption: "Réécriture de trois puces d'un CV front-end, avant et après.",
      headers: ['Avant', 'Après'],
      rows: [
        [
          "Participation au développement de l'interface",
          'Développé 24 composants React/TypeScript réutilisables, réduit de 35 % le temps de livraison des écrans',
        ],
        [
          'Optimisation des performances',
          "Réduit le LCP de 4,1 s à 1,8 s sur les 5 pages les plus visitées, en découpant le bundle et en préchargeant les routes critiques",
        ],
        [
          'Travail en équipe agile',
          "Animé les revues de code d'une équipe de 5 développeurs, fait passer la couverture de tests de 42 % à 78 % en six mois",
        ],
      ],
    },
    {
      type: 'p',
      text: "Ce qui a changé : un verbe précis, une techno nommée, un chiffre. Rien que Camille ne puisse défendre en entretien, tout vient de son travail réel. Les chiffres existent souvent, il faut les retrouver.",
    },
    {
      type: 'p',
      text: "Le choix des termes n'est pas neutre : « React », « TypeScript », « LCP », « revue de code » sont les mots que le recruteur tape. La méthode complète est dans [les mots-clés tech qui font passer les ATS](/blog/mots-cles-tech-ats).",
    },

    { type: 'h2', text: "Ce qu'il faut supprimer de ton CV", id: 'a-supprimer-du-cv' },
    {
      type: 'p',
      text: "Cinq éléments coûtent plus qu'ils ne rapportent, surtout sur un profil technique.",
    },
    {
      type: 'ul',
      items: [
        "**La photo.** Elle ne sert à aucun filtre, ajoute un biais et peut casser un parseur qui la traite comme une zone de texte.",
        '**Les colonnes et les tableaux.** Le texte se lit ligne par ligne : deux colonnes signifient des champs mélangés.',
        "**Les jauges de compétences.** Une barre à 80 % n'est pas une donnée. Une liste avec le contexte d'usage en est une.",
        '**La mention « références sur demande ».** Elle occupe une ligne utile et ne dit rien.',
        '**Les formules creuses.** « Passionné », « dynamique », « force de proposition » : aucun filtre ne les cherche, aucun recruteur ne les croit.',
      ],
    },
    {
      type: 'p',
      text: "Deux éléments à ajouter : un lien GitHub ou portfolio en texte brut, et une ligne de contexte pour chaque trou. Un lien caché derrière « ici » n'est pas extrait comme une URL — et ce que le recruteur y trouve compte autant, comme expliqué dans [ce qu'il regarde sur ton GitHub](/blog/portfolio-github-recruteur).",
    },

    { type: 'h2', text: 'Le CV de Camille, section par section', id: 'cv-camille-section-par-section' },
    {
      type: 'p',
      text: "Le résultat tient sur une page, en une colonne, sans élément graphique. Voici la trame exacte, avec le contenu réel.",
    },
    {
      type: 'ul',
      items: [
        '**En-tête :** Camille R., Développeuse front-end React / TypeScript. camille.r@email.fr, +33 6 12 34 56 78, Paris, github.com/camiller.',
        "**Accroche :** Développeuse front-end, 4 ans d'expérience sur des applications React/TypeScript à fort trafic. Spécialisée en performance web et qualité de code. Cherche un poste de front-end lead.",
        '**Expérience 1 :** Frontend Engineer, Acme (Paris), 03/2022 - 09/2024, puis les trois puces réécrites ci-dessus.',
        '**Expérience 2 :** Développeuse React, Studio Kléber (ESN, Paris), 09/2020 - 02/2022. Deux puces : composants design system, migration jQuery vers React.',
        '**Formation :** Master Informatique, Université de Nantes, 2020.',
        '**Compétences :** Langages : TypeScript, JavaScript, HTML, CSS. Frameworks : React 18, Next.js, Redux Toolkit. Tests : Jest, React Testing Library, Playwright. Outils : Git, Docker, Figma, CI/CD GitHub Actions.',
        '**Langues :** Français langue maternelle, anglais C1.',
      ],
    },
    {
      type: 'p',
      text: "Rien d'exceptionnel, et c'est l'objectif : un CV de développeur n'a pas besoin d'être spectaculaire, il doit être vérifiable. La mise en forme complète est dans [comment optimiser son CV pour les ATS](/blog/optimiser-cv-ats-2026).",
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Une colonne, des titres standards, des dates en `MM/AAAA`, et pour chaque puce : un verbe, une techno, un résultat. Si une ligne ne peut pas être défendue en entretien, elle sort du CV.",
    },
    {
      type: 'p',
      text: "Tu peux appliquer cette trame à ton propre CV, puis vérifier ce qu'un moteur en lit réellement : dépose-le sur [Prospecho](/) et compare le diagnostic avec ta lecture. Les écarts sont souvent là où tu ne les attends pas.",
    },
  ],
  faq: [
    {
      q: 'Quelle structure pour un CV de développeur ?',
      a: "En-tête avec nom et titre du poste, accroche de trois lignes, expérience en chronologique inversé avec trois à cinq puces, formation, compétences en liste, langues. Une seule colonne, pas de tableau, pas de photo. Cette structure est lisible par un ATS et suit l'ordre de lecture d'un recruteur.",
    },
    {
      q: 'Combien de pages pour un CV de développeur ?',
      a: "Une page jusqu'à cinq ans d'expérience, deux au-delà. Un CV de trois pages dilue l'information : les recruteurs lisent le premier écran, rarement le troisième. Compresse les expériences anciennes en une ligne.",
    },
    {
      q: 'Faut-il mettre une photo sur un CV de développeur ?',
      a: "Non, elle n'apporte rien. Aucun ATS ne l'exploite comme un critère, elle peut perturber le parsing d'un en-tête et elle expose à des biais. Un lien GitHub et un portfolio en texte brut sont plus utiles, et vérifiables.",
    },
    {
      q: 'Comment décrire une expérience sans chiffres ?',
      a: "Décris le périmètre : utilisateurs, taille de l'équipe, nombre de services, fréquence de livraison, durée du projet. Ce sont des faits mesurables. Ne fabrique jamais un pourcentage : il sera demandé en entretien.",
    },
    {
      q: 'Quel nom de fichier pour un CV envoyé à un ATS ?',
      a: "prenom-nom-poste.pdf, en minuscules, sans accent ni espace. Par exemple camille-r-frontend.pdf. Cela facilite le tri côté recruteur et évite les caractères mal encodés dans certains portails.",
    },
  ],
};

export default article;
