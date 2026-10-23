import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'score-ats-comment-calcule',
    title: "Score ATS : comment il est calculé et comment l'améliorer",
    description:
      "Le calcul exact du score ATS Prospecho : 40 % mots-clés, 30 % structure, 15 % longueur, 15 % densité. Barèmes, exemple chiffré et leviers de progression.",
    excerpt:
      "La formule réelle du score, les sept contrôles de structure et un exemple de calcul chiffré, étape par étape.",
    answer:
      "Le score ATS Prospecho combine quatre notes : 40 % de correspondance avec les mots-clés de l'offre, 30 % de structure (sept contrôles binaires), 15 % de longueur, 15 % de densité. Le total est une moyenne pondérée de notes sur 100. La structure est le levier le plus rapide : sept vérifications objectives, pas une appréciation.",
    date: '2026-09-29',
    updated: '2026-10-23',
    category: 'CV & ATS',
    readingTime: '8 min',
    keywords: [
      'score ats',
      'calcul score ats',
      'score cv',
      'densite mots-cles',
      'structure cv',
      'diagnostic cv',
    ],
    related: ['optimiser-cv-ats-2026', 'mots-cles-tech-ats', 'structure-cv-developpeur'],
  },
  blocks: [
    { type: 'h2', text: 'La formule complète, sans boîte noire', id: 'formule-score' },
    {
      type: 'p',
      text: "Un score n'a de valeur que si tu peux savoir ce qu'il mesure. Celui de [Prospecho](/) tient en une formule : **score global = 40 % correspondance + 30 % structure + 15 % longueur + 15 % densité**. Quatre notes sur 100, pondérées, additionnées. Aucun coefficient caché, aucune note de « potentiel ».",
    },
    {
      type: 'table',
      caption: 'Les quatre composantes du score, leur poids et le levier pour gagner des points.',
      headers: ['Composante', 'Poids', 'Ce qui est mesuré', 'Comment gagner des points'],
      rows: [
        [
          'Correspondance mots-clés',
          '40 %',
          "Part des mots-clés de l'offre retrouvés dans le CV",
          "Reprendre les termes exacts de l'offre, sans bourrage",
        ],
        [
          'Structure',
          '30 %',
          'Sept contrôles binaires de présentation et de contenu',
          'Corriger chaque contrôle manquant',
        ],
        [
          'Longueur',
          '15 %',
          'Nombre de mots du CV, hors en-tête',
          'Viser 400 à 800 mots utiles',
        ],
        [
          'Densité de mots-clés',
          '15 %',
          'Occurrences de mots-clés rapportées au nombre de mots',
          'Viser 2 à 5 %, sans répétition artificielle',
        ],
      ],
    },
    { type: 'h2', text: 'Les 40 % de correspondance mots-clés', id: 'correspondance-mots-cles' },
    {
      type: 'p',
      text: "C'est la composante la plus lourde : le moteur extrait les termes techniques et les intitulés de l'offre, puis vérifie lesquels apparaissent dans ton CV. La note est le rapport entre termes retrouvés et termes attendus, ramené sur 100.",
    },
    {
      type: 'p',
      text: "Deux nuances comptent : la forme et la présence. Un terme mal orthographié ou abrégé autrement ne compte pas : le moteur teste une correspondance de chaîne, pas une proximité sémantique. Chaque terme retrouvé pèse pareil, qu'il soit dans le titre ou dans un paragraphe — mais un recruteur qui cherche « Kubernetes » verra d'abord un titre et une section compétences explicites. D'où la règle des trois occurrences : une dans le titre, une dans les compétences, une dans une expérience.",
    },
    {
      type: 'p',
      text: "Un CV à 100 % de correspondance n'est pas un bon CV : c'est un CV qui répète l'offre. L'objectif réaliste se situe entre 70 et 90. La méthode de sélection est détaillée dans [les mots-clés tech qui font passer les ATS](/blog/mots-cles-tech-ats).",
    },

    { type: 'h2', text: 'Les 30 % de structure : sept contrôles binaires', id: 'structure-sept-controles' },
    {
      type: 'p',
      text: "La structure ne s'évalue pas au feeling. Sept vérifications, chacune valant 1 ou 0 ; la note est le nombre de contrôles passés divisé par sept. Sept sur sept donne 100, six sur sept donne 85,7.",
    },
    {
      type: 'ul',
      items: [
        '**Email présent et valide.** Une adresse détectable dans le texte, pas dans une image.',
        '**Téléphone présent et valide.** Un numéro au format reconnaissable, avec indicatif ou format national cohérent.',
        "**Section expérience identifiée.** Un titre explicite et au moins une expérience datée.",
        '**Section formation identifiée.** Un diplôme, un établissement et une année, sous un titre standard.',
        '**Section compétences identifiée.** Une liste en texte, pas un graphique ni un nuage de mots.',
        "**Puces présentes.** Au moins une liste à puces dans l'expérience, signe d'une structure exploitable.",
        '**Titres de sections cohérents.** Des intitulés reconnaissables, sans mélange de langues ni formule inventée.',
      ],
    },
    {
      type: 'p',
      text: "C'est le levier le plus rapide : renommer « Stack » en « Compétences » fait passer la note de 85,7 à 100 en dix secondes, soit 4,3 points de score global.",
    },

    { type: 'h2', text: 'Les 15 % de longueur', id: 'score-longueur' },
    {
      type: 'p',
      text: "La longueur est comptée en mots sur l'ensemble du texte du CV. Le barème est volontairement simple : un CV trop court n'a pas assez de matière, un CV trop long dilue les mots-clés.",
    },
    {
      type: 'table',
      caption: 'Barème de la composante longueur.',
      headers: ['Nombre de mots', 'Note'],
      rows: [
        ['400 à 800', '100'],
        ['801 à 1000', '80'],
        ['300 à 399', '70'],
        ['200 à 299', '50'],
        ['Moins de 200 ou plus de 1000', '30'],
      ],
    },
    {
      type: 'p',
      text: "La zone 400-800 correspond à une page dense ou à deux pages sobres. En dessous de 300 mots, il manque des expériences ; au-delà de 1000, le CV contient du remplissage. La longueur ne juge pas la qualité : un CV de 1200 mots peut être excellent, il perd simplement 11 points.",
    },

    { type: 'h2', text: 'Les 15 % de densité de mots-clés', id: 'score-densite' },
    {
      type: 'p',
      text: "La densité est le rapport entre les occurrences de mots-clés et le nombre total de mots. Elle mesure une concentration, pas un volume : allonger le CV fait baisser la densité si tu n'ajoutes aucun terme pertinent.",
    },
    {
      type: 'p',
      text: "Le barème : 2 à 5 % donne 100, 1 à 2 % donne 60, 5 à 8 % donne 70, hors de ces zones 30. La zone haute est pénalisée volontairement : au-delà de 8 %, le texte ressemble à une liste de technologies. Entre 2 et 5 %, les mots-clés apparaissent parce qu'ils décrivent le travail.",
    },

    { type: 'h2', text: 'Un calcul complet, étape par étape', id: 'exemple-calcul-complet' },
    {
      type: 'p',
      text: "Prenons un CV de développeur backend de 640 mots, face à une offre qui contient 12 termes techniques attendus.",
    },
    {
      type: 'ol',
      items: [
        '**Correspondance.** 9 termes sur 12 sont présents : 9 / 12 × 100 = 75.',
        "**Structure.** Six contrôles sur sept passent : la section compétences existe mais s'appelle « Stack », le moteur ne la reconnaît pas : 6 / 7 × 100 = 85,7.",
        '**Longueur.** 640 mots, dans la zone 400-800 : 100.',
        '**Densité.** 3,4 % de mots-clés : 100.',
        '**Total.** 0,40 × 75 + 0,30 × 85,7 + 0,15 × 100 + 0,15 × 100 = 30 + 25,7 + 15 + 15 = **85,7**, arrondi à 86.',
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Le score se travaille composante par composante : d'abord la structure, binaire et rapide, puis la correspondance, qui demande de relire l'offre. La longueur et la densité se corrigent d'elles-mêmes quand le contenu est juste.",
    },
    {
      type: 'p',
      text: "Le détail montre où sont les points faciles. Renommer « Stack » en « Compétences » porte la structure à 100 et le total à 90. Ajouter deux mots-clés maîtrisés porte la correspondance à 91,7 et le total à 96,7.",
    },

    { type: 'h2', text: 'Ce que le score ne dit pas', id: 'limites-du-score' },
    {
      type: 'p',
      text: "Un score élevé ne garantit pas un entretien. Il dit que ton CV est lisible, structuré et aligné sur une offre précise. Il ne dit rien de ton expérience réelle ni de la décision d'un recruteur qui reçoit 200 candidatures.",
    },
    {
      type: 'p',
      text: "Il ne dit rien non plus du secteur : la correspondance se calcule offre par offre. Un même CV obtient donc des scores différents selon l'annonce, et c'est normal. Aucun score ne remplace les trois secondes que le recruteur passe sur ton titre et ta dernière expérience. Pour la méthode complète, reviens à [comment optimiser son CV pour les ATS](/blog/optimiser-cv-ats-2026).",
    },
  ],
  faq: [
    {
      q: 'Comment est calculé le score ATS ?',
      a: "Le score Prospecho est une moyenne pondérée de quatre notes sur 100 : 40 % pour la correspondance avec les mots-clés de l'offre, 30 % pour la structure (sept contrôles binaires), 15 % pour la longueur, 15 % pour la densité. Formule : 0,40 × mots-clés + 0,30 × structure + 0,15 × longueur + 0,15 × densité.",
    },
    {
      q: 'Quel score ATS faut-il viser ?',
      a: "Viser 80 ou plus sur une offre précise est un bon objectif. Entre 70 et 80, le CV est lisible mais perd des points sur la correspondance ou la structure. Au-delà de 90, les gains sont marginaux : le facteur limitant devient l'adéquation réelle au poste.",
    },
    {
      q: 'Combien de mots doit contenir un CV pour un bon score ?',
      a: "Entre 400 et 800 mots, hors en-tête, pour la note maximale sur la longueur. En dessous de 300, il manque de la matière ; au-delà de 1000, le CV perd des points et se lit moins. Une page dense ou deux pages sobres tiennent dans cette zone.",
    },
    {
      q: "Qu'est-ce que la densité de mots-clés ?",
      a: "C'est le rapport entre les occurrences de mots-clés et le nombre total de mots. La note maximale est atteinte entre 2 et 5 %. En dessous de 1 %, le CV est trop générique ; au-dessus de 8 %, il ressemble à une liste de technologies et la note chute à 30.",
    },
    {
      q: 'Un score élevé garantit-il un entretien ?',
      a: "Non. Le score mesure la lisibilité du fichier, sa structure et son alignement avec une offre. Il ne mesure ni la pertinence du parcours, ni la concurrence, ni les critères de l'entreprise. Il sert à écarter les problèmes mécaniques, pas à prédire une décision humaine.",
    },
  ],
};

export default article;
