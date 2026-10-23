import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'optimiser-cv-ats-2026',
    title: 'Comment optimiser son CV pour les ATS en 2026',
    description:
      "Méthode complète pour optimiser un CV face aux ATS en 2026 : parsing, 7 contrôles, format PDF ou DOCX, structure des sections, mots-clés et checklist en 12 points.",
    excerpt:
      "Ce qu'un ATS lit vraiment, les sept contrôles qui comptent et la structure exacte à suivre, section par section.",
    answer:
      "Optimiser ton CV pour un ATS en 2026, c'est produire un document lisible par la machine et convaincant pour l'humain : fichier texte en une colonne, titres de sections standards, dates en MM/AAAA, intitulés de poste explicites et mots-clés de l'offre repris dans le titre, la section compétences et les expériences. La forme débloque le parsing, le fond déclenche l'entretien.",
    date: '2026-09-08',
    updated: '2026-10-23',
    category: 'Guide',
    readingTime: '11 min',
    keywords: [
      'cv ats',
      'optimiser cv ats',
      'cv lisible ats',
      'format cv ats',
      'mots-cles cv',
      'structure cv',
      'cv developpeur',
    ],
    related: ['structure-cv-developpeur', 'score-ats-comment-calcule', 'mots-cles-tech-ats'],
    featured: true,
  },
  blocks: [
    { type: 'h2', text: "Ce qu'un ATS fait vraiment de ton CV", id: 'role-reel-ats' },
    {
      type: 'p',
      text: "Un ATS (Applicant Tracking System) n'est pas un correcteur de carrière. C'est un logiciel qui centralise les CV, les rend cherchables et suit les étapes d'un recrutement. Workday, Taleo, SuccessFactors ou iCIMS font la même chose à des degrés divers : ils **analysent** le fichier, en **extraient du texte**, le **rangent** dans des champs (identité, expériences, formations, compétences), puis l'**indexent**.",
    },
    {
      type: 'p',
      text: "Le parsing est l'étape fragile. Le logiciel reconstitue une structure à partir de la mise en page : il devine ce qui est un intitulé de poste, une entreprise, une date, un diplôme. Avec deux colonnes, des tableaux invisibles ou des icônes à la place des titres, cette reconstruction échoue : le texte atterrit dans le mauvais champ, ou nulle part.",
    },
    {
      type: 'p',
      text: "Vient ensuite l'indexation. Le recruteur tape « Kubernetes », « React », « allemand B2 » dans la barre de recherche, et le moteur remonte les CV qui les contiennent. Un CV mal parsé peut contenir ces termes sans être trouvé, parce qu'ils étaient dans une image ou un tableau ignoré. Être recalé et être invisible ne sont pas la même chose.",
    },
    {
      type: 'p',
      text: "Enfin, le score. Deux familles coexistent : le **matching** par mots-clés, qui compare le CV à l'offre, et le **score de complétude**, qui vérifie surtout que les champs attendus sont remplis. Un ATS te recale rarement seul : il classe et filtre. La décision reste humaine, mais elle porte sur trente CV au lieu de trois cents.",
    },

    { type: 'h2', text: 'Les 7 contrôles qui décident du sort de ton CV', id: 'sept-controles-ats' },
    {
      type: 'p',
      text: "Tout se joue sur sept points, mécaniques et vérifiables en dix minutes. Chacun peut faire basculer ton dossier dans la pile des candidatures exploitables.",
    },
    {
      type: 'ul',
      items: [
        "**Lisibilité du texte.** Sélectionne tout ton PDF et copie-le dans un éditeur brut. Si l'ordre est incohérent ou si des blocs manquent, l'ATS lira la même chose.",
        "**Sections reconnues.** « Expérience professionnelle », « Formation », « Compétences » sont des ancres. Un titre comme « Mon parcours » oblige le moteur à deviner, et il devine mal.",
        "**Dates.** Le format `MM/AAAA` sur chaque poste et chaque diplôme. « Depuis mars 2024 » passe ; une date de fin seule ne passe pas.",
        "**Intitulés de poste.** Le titre réel du poste, pas une formule interne. « Software Engineer Backend » se cherche, « Ninja du code » ne se cherche pas.",
        "**Compétences.** Une liste explicite, en texte, sans jauges ni niveaux graphiques. Une barre à 80 % n'est pas une donnée exploitable.",
        "**Expérience chiffrée.** Des résultats, des volumes, des tailles d'équipe. Le moteur cherche des mots ; l'humain qui lit ensuite cherche des preuves.",
        "**Mots-clés de l'offre.** Les termes exacts employés par l'entreprise, pas seulement leurs synonymes.",
      ],
    },
    {
      type: 'p',
      text: "Ces sept contrôles sont ceux que vérifie [Prospecho](/) quand tu déposes un CV. Un contrôle isolé ne vaut rien : c'est leur combinaison qui rend un CV trouvable.",
    },

    { type: 'h2', text: 'Quel format envoyer : PDF, DOCX ou HTML ?', id: 'format-pdf-docx' },
    {
      type: 'p',
      text: "Le PDF texte reste le choix par défaut en 2026, à une condition : il doit être exporté depuis un traitement de texte, pas depuis un outil de design. Un PDF né de Word ou de Google Docs contient une couche de texte propre et un ordre de lecture linéaire. Un PDF exporté depuis Figma ou Canva peut ne contenir que des courbes, sans un caractère sélectionnable.",
    },
    {
      type: 'table',
      caption:
        "Compatibilité indicative des formats avec les principaux ATS du marché, ordre de grandeur 2026.",
      headers: ['Format', 'Lecture par un ATS', "Quand l'utiliser"],
      rows: [
        [
          'PDF texte (export Word ou Google Docs)',
          'Fiable : couche de texte, ordre linéaire',
          'Envoi par défaut, sauf consigne contraire',
        ],
        [
          'DOCX',
          'Très fiable : structure native de paragraphes',
          "Quand le portail l'impose ou pour un cabinet",
        ],
        [
          "PDF issu d'un outil de design",
          'Risque élevé : texte absent ou désordonné',
          'Portfolio, pas candidature',
        ],
        ['HTML ou page web', 'Dépend du parseur, souvent partiel', 'Jamais en envoi principal'],
        ['Image JPG, PNG ou scan', 'Aucune extraction de texte', 'Jamais'],
      ],
    },
    {
      type: 'p',
      text: "Deux exceptions. Certains grands groupes imposent le DOCX via leur portail : la consigne prime. Pour un envoi direct par mail, le PDF reste le plus sûr, il fige la mise en page.",
    },
    { type: 'h2', text: 'La structure section par section', id: 'structure-sections-cv' },
    {
      type: 'p',
      text: "L'ordre compte autant que le contenu. Un recruteur lit le haut de page en six à huit secondes ; un parseur lit tout, mais attribue mal ce qu'il ne reconnaît pas.",
    },
    { type: 'h3', text: 'En-tête : nom, titre, contacts', id: 'entete-nom-titre-contacts' },
    {
      type: 'p',
      text: "Nom complet, puis le titre du poste visé. En dessous : email, téléphone avec indicatif, ville, et un lien GitHub ou portfolio pour un poste technique. Pas de photo, pas d'adresse complète, pas de date de naissance.",
    },
    { type: 'h3', text: 'Accroche : trois lignes maximum', id: 'accroche-trois-lignes' },
    {
      type: 'p',
      text: "Deux à trois phrases qui donnent ton métier, tes années d'expérience, ta spécialité et ce que tu cherches. C'est la seule zone libre : garde-la factuelle.",
    },
    { type: 'h3', text: 'Expérience : chronologique inversé', id: 'experience-chronologique-inverse' },
    {
      type: 'p',
      text: "Poste le plus récent en haut. Pour chaque poste : intitulé, entreprise, ville, dates, puis trois à cinq puces de résultats. Un trou de six mois se justifie en une ligne, il ne se cache pas dans une mise en page alambiquée.",
    },
    { type: 'h3', text: 'Formation et compétences', id: 'formation-competences' },
    {
      type: 'p',
      text: "La formation passe après l'expérience dès deux ans de métier. Les compétences se regroupent par famille : langages, frameworks, bases de données, cloud, outils, méthodes. Pour les langues, utilise un référentiel : « Anglais C1, Allemand B2 » se filtre, « courant » non.",
    },

    { type: 'h2', text: 'La règle des 3 occurrences pour les mots-clés', id: 'regle-trois-occurrences' },
    {
      type: 'p',
      text: "Un mot-clé utile apparaît trois fois, à trois endroits, sous la forme exacte employée par l'entreprise : dans le titre du CV, dans la section compétences, dans une puce d'expérience qui le met en situation. En dessous de trois, le terme peut manquer au matching ; au-delà de cinq ou six, le texte devient illisible et le recruteur le voit.",
    },
    {
      type: 'p',
      text: "Exemple avec **Kubernetes** sur une offre de platform engineering : titre « Platform Engineer — Kubernetes », compétences « Kubernetes, Helm, Terraform, AWS », expérience « Migré 40 services vers Kubernetes, réduction de 30 % du coût d'infrastructure ». Trois occurrences, trois fonctions : identification, indexation, preuve.",
    },
    {
      type: 'p',
      text: "Les ATS ne font pas tous de matching sémantique : certains comparent des chaînes, d'autres rapprochent des synonymes. Écris les deux formes : « JavaScript (JS) », « Kubernetes (K8s) ». Le détail par métier est dans [les mots-clés tech qui font passer les ATS](/blog/mots-cles-tech-ats).",
    },

    { type: 'h2', text: 'Avant / après : ce qui change concrètement', id: 'avant-apres-exemple' },
    {
      type: 'p',
      text: "Deux versions des mêmes lignes. La première est lisible par un humain pressé ; la seconde est lisible par un humain et par un parseur, et elle raconte quelque chose.",
    },
    {
      type: 'table',
      caption: "Réécriture de trois lignes d'un CV de développeur, avant et après.",
      headers: ['Avant', 'Après'],
      rows: [
        [
          "Développement de features sur l'application",
          'Développé 12 endpoints REST en Node.js/TypeScript, réduit la latence p95 de 400 à 120 ms',
        ],
        ['Compétences : React', 'React 18, TypeScript, Redux Toolkit, Jest, React Testing Library'],
        [
          'Équipe agile, méthodes modernes',
          'Scrum en sprints de 2 semaines avec 6 personnes, revues de code hebdomadaires',
        ],
      ],
    },
    {
      type: 'p',
      text: "Ce qui a changé : une techno nommée exactement, un verbe d'action, un résultat mesuré. Sans mesure, décris le périmètre : utilisateurs, taille d'équipe, fréquence de livraison.",
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Trois occurrences par mot-clé, une seule colonne, des dates en `MM/AAAA`, des puces qui contiennent un verbe, une techno et un résultat. Si tu ne retiens que quatre règles de ce guide, ce sont celles-là.",
    },

    { type: 'h2', text: 'France et Suisse : les différences à connaître', id: 'france-suisse-differences' },
    {
      type: 'p',
      text: "En France, le CV tient sur une page jusqu'à cinq ans d'expérience, deux au-delà. La photo est tolérée mais jamais exigée : elle n'apporte rien au parsing. L'âge et la nationalité n'ont pas leur place. Nomme tes diplômes exactement (Master, Licence, BUT, diplôme d'ingénieur) : « Bac+5 informatique » se filtre moins bien.",
    },
    {
      type: 'p',
      text: "En Suisse, le marché est plus formel : photo courante, nationalité et permis de travail souvent attendus, diplômes locaux (HES, EPF, CFC) pris au sérieux. Les CV dépassent rarement deux pages. La règle technique, elle, ne change pas : texte sélectionnable, une colonne, sections nommées simplement.",
    },
    {
      type: 'p',
      text: "Les intitulés divergent en revanche nettement. Un même poste peut s'appeler « Data Engineer » à Paris et à Genève, « Dateningenieur » à Zurich. Reprends toujours l'intitulé de l'offre : c'est le terme que le recruteur tapera dans son ATS.",
    },

    { type: 'h2', text: 'La checklist finale en 12 points', id: 'checklist-finale-12-points' },
    {
      type: 'p',
      text: "Passe ces douze points avant chaque envoi. Aucun ne demande de compétence particulière, tous se vérifient sur ton propre fichier.",
    },
    {
      type: 'ol',
      items: [
        "Le fichier est un PDF texte exporté depuis Word ou Google Docs, ou un DOCX si le portail l'exige.",
        'Le CV tient sur une colonne, sans tableau ni zone de texte flottante.',
        'Le texte se sélectionne entièrement et se copie dans un ordre cohérent.',
        'Les sections portent des titres standards : Expérience professionnelle, Formation, Compétences.',
        'Chaque expérience affiche un intitulé, une entreprise, une ville et des dates en MM/AAAA.',
        "Le titre du CV reprend l'intitulé du poste visé.",
        'Les compétences sont listées en texte, sans jauges, étoiles ni icônes.',
        'Chaque mot-clé important apparaît trois fois : titre, compétences, expérience.',
        "Chaque puce contient un verbe d'action et, si possible, un résultat mesuré.",
        'Aucune photo, date de naissance, situation familiale ni mention « références sur demande ».',
        'Les liens GitHub et portfolio sont en texte brut, pas cachés derrière un mot.',
        'Le nom du fichier est lisible : prenom-nom-developpeur.pdf.',
      ],
    },
    {
      type: 'p',
      text: "Douze points, dix minutes. Pour comprendre comment un score est calculé, lis [comment un score ATS est calculé](/blog/score-ats-comment-calcule). Pour la mise en forme d'un profil technique, passe à [la structure de CV développeur](/blog/structure-cv-developpeur). Et pour mesurer ton CV au lieu de le deviner, dépose-le sur [Prospecho](/) : le diagnostic reprend chaque contrôle ci-dessus.",
    },
  ],
  faq: [
    {
      q: 'Comment optimiser son CV pour les ATS ?',
      a: "Rends d'abord le fichier lisible : PDF texte, une colonne, des titres de sections standards. Aligne ensuite le contenu sur l'offre : intitulé identique, mots-clés dans le titre, les compétences, les expériences. La forme débloque le parsing, le fond déclenche le matching.",
    },
    {
      q: 'Quel format PDF pour un ATS ?',
      a: "Un PDF texte généré depuis Word, Google Docs ou LibreOffice. Le test : sélectionne tout et copie dans un éditeur. Si les paragraphes et les dates ressortent dans le bon ordre, l'ATS lira la même chose. Un PDF issu de Figma peut n'avoir aucune couche de texte.",
    },
    {
      q: 'Combien de mots-clés faut-il mettre dans son CV ?',
      a: "Trois occurrences par mot-clé important suffisent : dans le titre, dans les compétences, dans une expérience qui le met en situation. Répéter un terme dix fois n'améliore pas le matching et dégrade la lecture. Mieux vaut couvrir dix termes pertinents que répéter trois termes vingt fois.",
    },
    {
      q: 'Les tableaux et les colonnes sont-ils interdits sur un CV ?',
      a: "Ils ne sont pas interdits, mais ils sont risqués. Beaucoup de parseurs lisent ligne par ligne : dans un tableau à deux colonnes, le titre du poste et la date atterrissent dans le même champ. Une colonne avec des titres explicites reste la seule option sûre.",
    },
    {
      q: 'Un ATS peut-il recaler mon CV automatiquement ?',
      a: "Rarement de façon définitive. La plupart des ATS classent, indexent et filtrent : ils rendent ton CV visible ou invisible dans une liste, et le recruteur tranche. Un score faible te fait passer en bas de pile, ce qui revient souvent au même.",
    },
  ],
};

export default article;
