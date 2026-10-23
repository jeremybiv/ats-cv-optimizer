import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'mots-cles-tech-ats',
    title: 'Les mots-clés tech qui font vraiment passer les ATS',
    description:
      "Mots-clés ATS par métier tech : développeur, data, DevOps, cybersécurité, product. Matching exact ou sémantique, synonymes à doubler et erreurs à éviter.",
    excerpt:
      "Les termes que les ATS cherchent réellement, métier par métier, et comment les placer sans bourrer ton CV.",
    answer:
      "Les mots-clés qui font passer un ATS sont ceux de l'offre visée, repris sous leur forme exacte : intitulé de poste, technologies, méthodes et certifications. Ils comptent à trois endroits : le titre du CV, les compétences, les puces d'expérience. Un ATS compare parfois des chaînes avant de comprendre le sens : écris la technologie et son alias.",
    date: '2026-09-15',
    updated: '2026-10-23',
    category: 'CV & ATS',
    readingTime: '9 min',
    keywords: [
      'mots-cles cv',
      'mots-cles ats',
      'mots-cles developpeur',
      'cv data engineer',
      'cv devops',
      'matching ats',
      'cv tech',
    ],
    related: ['optimiser-cv-ats-2026', 'structure-cv-developpeur', 'score-ats-comment-calcule'],
  },
  blocks: [
    {
      type: 'h2',
      text: 'Matching exact ou sémantique : ce que les ATS comparent vraiment',
      id: 'matching-exact-semantique',
    },
    {
      type: 'p',
      text: "Deux familles de moteurs coexistent. Les plus anciens comparent des chaînes : ils cherchent « React » et trouvent les CV où ces lettres apparaissent. Les plus récents normalisent le texte et rapprochent des synonymes. Taleo, Workday ou SuccessFactors combinent ces approches à des degrés divers, sans publier leur algorithme.",
    },
    {
      type: 'p',
      text: "Conséquence pratique : tu ne sais pas quel moteur lira ton CV. Écris donc pour le plus bête des deux. La forme exacte employée dans l'offre doit apparaître telle quelle, et l'alias courant peut la compléter entre parenthèses. Un CV qui ne contient que « K8s » peut manquer une recherche sur « Kubernetes », et l'inverse est vrai.",
    },

    { type: 'h2', text: 'Les mots-clés attendus, métier par métier', id: 'mots-cles-par-metier' },
    {
      type: 'p',
      text: "Cette liste n'est pas un programme à cocher : c'est le vocabulaire qu'un recruteur tape dans son outil. Garde ce que tu pratiques.",
    },
    {
      type: 'table',
      caption:
        "Vocabulaire de recherche courant par famille de métier tech, ordre de grandeur 2026.",
      headers: ['Métier', 'Mots-clés attendus', 'Voisins à couvrir'],
      rows: [
        [
          'Développeur full-stack',
          'TypeScript, React, Node.js, REST, PostgreSQL',
          'Next.js, Prisma, Docker, tests unitaires',
        ],
        [
          'Développeur backend',
          'Java, Spring Boot, Python, API REST, SQL',
          'Kafka, Redis, microservices, gRPC',
        ],
        [
          'Développeur frontend',
          'React, TypeScript, HTML, CSS, accessibilité',
          'Vue.js, Next.js, Vitest, Core Web Vitals',
        ],
        [
          'Data / IA',
          'Python, SQL, Spark, dbt, machine learning',
          'Airflow, Snowflake, LLM, RAG, MLOps',
        ],
        [
          'DevOps / Cloud',
          'Kubernetes, Docker, Terraform, CI/CD, AWS',
          'Helm, ArgoCD, Azure, GCP, observabilité',
        ],
        [
          'Cybersécurité',
          'SIEM, EDR, pentest, ISO 27001, gestion des vulnérabilités',
          'SOC, MITRE ATT&CK, IAM, Zero Trust',
        ],
        [
          'Product',
          'roadmap, discovery, user research, KPIs, backlog',
          'A/B testing, analytics produit, SQL, OKR',
        ],
      ],
    },
    {
      type: 'h3',
      text: 'Ce qui change avec le niveau',
      id: 'mots-cles-par-niveau',
    },
    {
      type: 'table',
      caption: "Le vocabulaire attendu évolue avec l'ancienneté, pas seulement avec les outils.",
      headers: ['Niveau', 'Ce que le recruteur cherche', 'Mots-clés à ajouter'],
      rows: [
        [
          'Junior, 0 à 2 ans',
          'Des bases solides et des projets terminés',
          'Git, tests, framework principal, stage ou alternance',
        ],
        [
          'Confirmé, 3 à 5 ans',
          'De la maîtrise en autonomie sur un périmètre',
          'Architecture, revue de code, CI/CD, mentorat',
        ],
        [
          'Senior, 6 ans et plus',
          'De la conception et de la conduite technique',
          'conception système, scaling, leadership technique, incident management',
        ],
      ],
    },
    {
      type: 'p',
      text: "Un senior qui ne coche que des outils envoie un signal de junior ; un junior qui revendique « architecture » sans exemple se fait démonter en entretien. Les mots-clés de niveau doivent être adossés à une réalisation.",
    },

    { type: 'h2', text: "Où placer les mots-clés pour qu'ils comptent", id: 'ou-placer-les-mots-cles' },
    {
      type: 'p',
      text: "Un terme unique, perdu dans un paragraphe, est indexé mais peu convaincant. Trois emplacements suffisent, avec trois rôles.",
    },
    {
      type: 'ul',
      items: [
        "**Le titre du CV**, sous le nom : il donne le poste visé et sert d'ancrage au matching. « Développeuse backend Python » vaut mieux que « Développeuse passionnée ».",
        "**La section compétences**, groupée par famille : langages, frameworks, bases de données, cloud, outils, méthodes. C'est la zone que les filtres lisent le plus vite.",
        "**Les puces d'expérience**, une par compétence clé, avec un contexte et un résultat. C'est là que le recruteur vérifie que le mot-clé correspond à quelque chose de réel.",
        "**Les certifications et formations** quand elles existent : AWS Solutions Architect, CKA, ISO 27001 Lead Implementer. Le libellé exact se recherche.",
      ],
    },
    {
      type: 'p',
      text: "Au-delà de trois occurrences, tu n'améliores plus rien. La règle complète, avec le détail des contrôles de lisibilité, est dans [comment optimiser son CV pour les ATS](/blog/optimiser-cv-ats-2026).",
    },

    { type: 'h2', text: 'Les synonymes à écrire en double', id: 'synonymes-a-doubler' },
    {
      type: 'p',
      text: "Les paires ci-dessous circulent dans les offres et dans les CV, mais pas toujours dans le même moteur. Écrire les deux formes coûte cinq caractères et évite une recherche manquée.",
    },
    {
      type: 'ul',
      items: [
        'JavaScript (JS) et TypeScript (TS), jamais seulement les sigles.',
        'Kubernetes (K8s) et PostgreSQL (Postgres).',
        'CI/CD, à accompagner une fois de « intégration et déploiement continus ».',
        "IaC ou infrastructure as code, selon le terme de l'offre.",
        'Google Cloud Platform (GCP) et Amazon Web Services (AWS), en entier au moins une fois.',
        'Machine learning (ML) et intelligence artificielle (IA), qui ne couvrent pas le même périmètre.',
        "LLM et RAG, deux concepts distincts qu'une offre mélange souvent.",
      ],
    },
    {
      type: 'p',
      text: "Attention aux faux synonymes : « data analyst » et « data engineer » ne sont pas interchangeables, pas plus que « SRE » et « DevOps ». Doubler un terme n'autorise pas à t'attribuer un métier que tu n'as pas exercé.",
    },

    { type: 'h2', text: "Comment rester honnête, et pourquoi c'est rentable", id: 'rester-honnete' },
    {
      type: 'p',
      text: "Un mot-clé sans preuve est une dette : tu passes le filtre, puis l'entretien technique arrive sur ce que tu as survendu. Chaque terme de la section compétences doit pouvoir être illustré par une ligne d'expérience ou un projet.",
    },
    {
      type: 'p',
      text: "Pour les compétences périphériques, nomme le niveau réel : « notions de Terraform » reste lisible sans te faire passer pour un expert. Certains recruteurs écartent ces mentions, mais un mensonge découvert en entretien coûte plus cher.",
    },
    {
      type: 'p',
      text: "Ce que tu peux faire sans mentir : reformuler. Si tu as écrit des requêtes SQL tous les jours pendant deux ans, « SQL » mérite une puce avec un volume et un cas d'usage. La preuve transforme un mot-clé en argument, et c'est ce que mesure [Prospecho](/) : la présence du terme, puis sa mise en situation.",
    },

    { type: 'h2', text: "L'erreur du bourrage de mots-clés", id: 'erreur-bourrage' },
    {
      type: 'p',
      text: "Trois pratiques circulent encore : les mots-clés écrits en blanc sur fond blanc, la liste de technologies empilée en bas de page, la répétition du même terme dans chaque puce. Les deux premières se retournent contre toi : le texte caché est extrait par le parseur et ressort au milieu d'un champ, ce qui casse la lisibilité, et une liste isolée ne prouve rien. La répétition, elle, fait grimper la densité de mots-clés jusqu'à un niveau que le recruteur voit immédiatement.",
    },
    {
      type: 'p',
      text: "Le bon dosage reste celui d'un document écrit pour un humain, où les termes apparaissent parce qu'ils décrivent le travail. Si tu dois relire une phrase deux fois, le bourrage a commencé.",
    },

    { type: 'h2', text: "La méthode en 5 étapes pour extraire les mots-clés d'une offre", id: 'methode-extraction-offre' },
    {
      type: 'p',
      text: "Cinq minutes par offre, à faire avant chaque candidature. Le résultat est une liste de dix à quinze termes, pas de cinquante.",
    },
    {
      type: 'ol',
      items: [
        "Sépare l'offre en deux : le poste d'un côté, l'entreprise de l'autre. Seul le premier bloc contient des critères filtrables.",
        "Surligne les technologies, méthodes et certifications nommées explicitement. Ignore les adjectifs et les formules de motivation.",
        "Classe les termes en trois colonnes : maîtrisé, pratiqué, inconnu. Seule la première entre dans le CV.",
        "Vérifie que le titre du CV reprend l'intitulé de l'offre et que les cinq termes les plus cités apparaissent trois fois.",
        "Relis à voix haute : si une phrase existe uniquement pour caser un mot, supprime-la.",
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Les mots-clés efficaces viennent de l'offre, pas d'une liste générique : la forme exacte d'abord, l'alias ensuite, la preuve toujours. Dix termes maîtrisés valent mieux que quarante survolés.",
    },
    {
      type: 'p',
      text: "La façon de placer les termes compte autant que leur choix : la structure des sections et le format des puces sont détaillés dans [la structure de CV développeur](/blog/structure-cv-developpeur). Pour savoir comment ces occurrences pèsent dans un score, lis [comment un score ATS est calculé](/blog/score-ats-comment-calcule).",
    },
  ],
  faq: [
    {
      q: 'Quels mots-clés mettre dans un CV de développeur ?',
      a: "Ceux de l'offre : langage principal, framework, base de données, cloud, tests et méthodes. Un CV backend contient le langage, le framework, SQL, Docker et les pratiques d'équipe (revue de code, CI/CD). Ajoute seulement ce que tu as utilisé en production.",
    },
    {
      q: 'Faut-il écrire JavaScript ou JS sur un CV ?',
      a: "Écris « JavaScript (JS) » au moins une fois, puis la forme qui rend le texte lisible. Certains ATS comparent les chaînes à l'identique et ne relient pas le sigle au nom complet. Même règle pour Kubernetes (K8s) et PostgreSQL (Postgres).",
    },
    {
      q: 'Combien de mots-clés faut-il dans un CV ?',
      a: "Dix à quinze termes suffisent pour couvrir une offre, chacun apparaissant jusqu'à trois fois. Au-delà, la densité devient suspecte. Un CV de deux pages bien ciblé contient rarement plus de vingt termes distincts.",
    },
    {
      q: 'Les ATS comprennent-ils les synonymes ?',
      a: "Certains, partiellement. Les moteurs récents normalisent le texte et rapprochent des variantes, mais la couverture reste inégale et aucun éditeur ne garantit la reconnaissance d'un synonyme. Écrire les deux formes reste la méthode fiable.",
    },
    {
      q: "Peut-on mettre des mots-clés qu'on ne maîtrise pas ?",
      a: "Non. Un terme sans preuve te fait passer le filtre pour échouer en entretien technique, où la question arrive dans les dix premières minutes. Pour une compétence partielle, indique le niveau réel : « notions de Terraform » est crédible, « expert Terraform » sans projet ne l'est pas.",
    },
  ],
};

export default article;
