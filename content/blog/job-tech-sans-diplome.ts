import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'job-tech-sans-diplome',
    title: 'Job tech sans diplôme : le vrai chemin',
    description:
      "Alternance, bootcamp ou autodidacte : les trois voies réelles vers un job tech sans diplôme, leur coût, les métiers accessibles et un plan sur 6 mois.",
    excerpt:
      "Le diplôme ouvre des portes ; un portfolio qui tourne en ouvre davantage. Voici les trois chemins, avec leur prix et leurs limites.",
    answer:
      "Trouver un job tech sans diplôme est réaliste pour le développement web, la QA, le support technique, la data analyse junior et le cloud ops. Les employeurs vérifient des compétences démontrables : projets qui tournent, code lisible, expérience même courte. Trois voies fonctionnent : alternance, bootcamp, autodidacte structuré. Compte 6 à 24 mois et 0 à 12 000 €.",
    date: '2026-10-20',
    updated: '2026-10-23',
    category: 'Carrière',
    readingTime: '9 min',
    keywords: [
      'job tech sans diplôme',
      'reconversion développeur',
      'bootcamp coding',
      'alternance informatique',
      'autodidacte développement web',
      'certification cloud',
    ],
    related: ['reconversion-tech-2026', 'portfolio-github-recruteur', 'optimiser-cv-ats-2026'],
  },
  blocks: [
    {
      type: 'h2',
      text: 'Ce que les employeurs vérifient vraiment',
      id: 'ce-que-les-employeurs-verifient',
    },
    {
      type: 'p',
      text: "Dans une équipe tech, personne ne demande à voir ton diplôme avant de te laisser toucher au code. On regarde ce que tu sais faire, et surtout si tu l’as déjà fait ailleurs que dans un tutoriel. Un recruteur technique va typiquement ouvrir trois choses : ton dépôt GitHub, la dernière chose que tu as mise en production, et la façon dont tu expliques un choix technique.",
    },
    {
      type: 'p',
      text: "Concrètement, ce qui pèse dans la décision ressemble à ça, dans cet ordre : la capacité à livrer quelque chose qui fonctionne, la lisibilité du code et des commits, la compréhension des fondamentaux (HTTP, bases de données, Git, tests), puis la communication. Le diplôme intervient surtout comme filtre RH dans les grandes structures, et comme condition légale dans quelques cas précis.",
    },
    {
      type: 'p',
      text: "C’est une bonne nouvelle à double tranchant : la porte est ouverte, mais elle ne s’ouvre pas avec des certificats empilés. Elle s’ouvre avec deux ou trois projets dont tu peux parler pendant vingt minutes sans être à court. Si tu n’as pas encore de dépôt présentable, commence par [construire un portfolio que les recruteurs ouvrent vraiment](/blog/portfolio-github-recruteur).",
    },
    {
      type: 'h2',
      text: 'Trois voies, trois profils',
      id: 'trois-voies-trois-profils',
    },
    {
      type: 'p',
      text: "Il n’y a pas une bonne voie, il y a une voie compatible avec ta situation : ton âge, tes charges, ton éligibilité aux dispositifs, ta tolérance au risque financier. Les trois chemins ci-dessous mènent au même endroit, mais pas au même rythme ni au même prix.",
    },
    {
      type: 'table',
      caption: 'Comparaison des trois voies vers un premier job tech (ordres de grandeur 2026)',
      headers: ['Voie', 'Durée', 'Coût', 'Risque', 'Premier job'],
      rows: [
        [
          'Alternance / apprentissage',
          '12 à 24 mois',
          'Rémunérée, formation prise en charge',
          'Faible : contrat signé avant l’entrée',
          'Très bonne insertion, souvent embauche à l’issue',
        ],
        [
          'Bootcamp',
          '3 à 6 mois',
          '6 000 à 12 000 €',
          'Moyen : dépend du réseau de l’école et du marché local',
          'Possible mais non garanti, forte concurrence entre diplômés',
        ],
        [
          'Autodidacte structuré',
          '6 à 12 mois',
          '0 à 1 500 €',
          'Élevé : pas de cadre, pas de réseau, abandon fréquent',
          'Atteignable avec un portfolio solide et des contributions réelles',
        ],
      ],
    },
    {
      type: 'h3',
      text: 'L’alternance : la voie la plus solide',
    },
    {
      type: 'p',
      text: "Tu es payé, tu apprends en entreprise, tu obtiens un diplôme reconnu à la fin. C’est objectivement le meilleur rapport risque/rendement, à condition d’être éligible et de trouver une entreprise prête à signer. Le vrai goulot d’étranglement n’est pas l’école, c’est le contrat : commence tes recherches quatre à six mois avant la rentrée, en ciblant les ESN et les PME qui recrutent des profils juniors en continu.",
    },
    {
      type: 'h3',
      text: 'Le bootcamp : rapide, cher, inégal',
    },
    {
      type: 'p',
      text: "Trois à six mois intensifs, un projet de fin de formation, un réseau d’anciens. La qualité varie énormément d’un organisme à l’autre, et le marché junior est devenu sélectif. Avant de payer, demande le taux d’insertion à six mois sur les deux dernières promotions, la liste des entreprises partenaires, et le nombre d’heures réellement encadrées. Un bootcamp sans réseau d’employeurs est une formation accélérée, pas un tremplin.",
    },
    {
      type: 'h3',
      text: 'L’autodidacte structuré : gratuit mais exigeant',
    },
    {
      type: 'p',
      text: "C’est la voie la moins chère et la plus dure. Elle fonctionne pour ceux qui savent se fixer un cadre : un objectif de projet par mois, des commits réguliers, une communauté pour poser des questions. Elle échoue pour ceux qui enchaînent les cours sans jamais livrer. Si tu choisis cette route, ton programme n’est pas une liste de tutoriels, c’est une liste de choses à mettre en ligne.",
    },
    {
      type: 'h2',
      text: 'Les métiers accessibles sans diplôme',
      id: 'metiers-accessibles-sans-diplome',
    },
    {
      type: 'p',
      text: "Tous les métiers tech ne se valent pas face à l’absence de diplôme. Certains jugent sur pièces, d’autres filtrent en amont. Voici ceux où un portfolio suffit fréquemment à obtenir un premier entretien.",
    },
    {
      type: 'ul',
      items: [
        "**Développeur web front ou back junior** : le plus accessible, à condition d’avoir deux applications réelles en ligne, pas des clones de tutoriel.",
        "**QA / testeur automatisation** : demande moins de code que le développement, beaucoup de rigueur. Les certifications ISTQB aident à passer le filtre RH.",
        "**Support technique niveau 2** : porte d’entrée classique, souvent avec des horaires décalés, mais exposition réelle aux systèmes et évolution possible vers l’ops.",
        "**Data analyst junior** : SQL, tableur, un outil de visualisation, et surtout la capacité à raconter une conclusion. Le diplôme compte un peu plus ici, sans être bloquant en PME.",
        "**Cloud ops / SRE junior** : accessible via une certification et un lab personnel reproductible, mais rarement en premier poste sans expérience système.",
      ],
    },
    {
      type: 'p',
      text: "Les métiers qui exigent encore un diplôme, en pratique : la recherche (doctorat), la data science senior (statistiques formelles), l’architecture logicielle, et certains postes en banque, assurance ou secteur public où le diplôme est une condition statutaire, pas un simple filtre. Ce n’est pas une question de compétence, c’est une question de grille.",
    },
    {
      type: 'h2',
      text: 'Les certifications : quel poids réel',
      id: 'certifications-poids-reel',
    },
    {
      type: 'p',
      text: "Une certification ne remplace jamais un projet, mais elle règle deux problèmes concrets : elle prouve que tu connais le vocabulaire, et elle donne au recruteur non technique un critère lisible. Les plus utiles dans une candidature junior sans diplôme, par ordre de rendement :",
    },
    {
      type: 'table',
      caption: 'Certifications fréquemment demandées et leur usage réel',
      headers: ['Certification', 'Coût indicatif', 'Ce qu’elle prouve', 'Poids en junior'],
      rows: [
        ['AWS Cloud Practitioner', '100 à 150 €', 'Vocabulaire cloud, services de base', 'Bon signal, très répandue'],
        ['Azure AZ-900', '100 à 150 €', 'Fondamentaux Azure', 'Bon signal en ESN et grands comptes'],
        ['Google Cloud Digital Leader', '80 à 120 €', 'Culture cloud GCP', 'Correct, moins demandée en Suisse'],
        ['ISTQB Foundation', '200 à 400 €', 'Bases du test logiciel', 'Fort pour un poste QA'],
      ],
    },
    {
      type: 'p',
      text: "En dessous de ce niveau, méfie-toi des certifications en série : cinq badges de plateformes de cours en ligne n’impressionnent personne et donnent l’impression d’un candidat qui collectionne au lieu de construire. Une certification, un projet qui l’utilise, un article ou un README qui l’explique : c’est le trio qui fonctionne.",
    },
    {
      type: 'h2',
      text: 'Le cas suisse : CFC, maturité, équivalence',
      id: 'cas-suisse-cfc-maturite-equivalence',
    },
    {
      type: 'p',
      text: "En Suisse, le marché tech est plus formaliste qu’en France sur le papier, mais très pragmatique sur le terrain. Le CFC d’informaticien reste la référence pour les postes juniors, et la maturité professionnelle ouvre la voie des hautes écoles spécialisées (HES). Sans ces titres, deux options : faire reconnaître une expérience via une procédure d’équivalence auprès du SEFRI, ou viser les entreprises qui recrutent sur test technique.",
    },
    {
      type: 'p',
      text: "La voie la plus rapide pour un adulte sans diplôme local passe souvent par l’alternance avec une entreprise formatrice, ou par un diplôme fédéral supérieur obtenu en cours d’emploi. Les cantons romands financent une partie de ces formations selon les dispositifs en vigueur : renseigne-toi auprès de l’office cantonal de la formation professionnelle avant de payer quoi que ce soit de ta poche.",
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "En Suisse comme en France, le diplôme est un accélérateur administratif, pas une preuve de compétence. Ce qui bloque vraiment une candidature sans diplôme, c’est l’absence de preuve de livraison, pas l’absence de parchemin.",
    },
    {
      type: 'h2',
      text: 'Un plan sur 6 mois',
      id: 'plan-six-mois',
    },
    {
      type: 'p',
      text: "Voici un déroulé réaliste pour un autodidacte qui peut consacrer quinze à vingt heures par semaine. Il est calibré pour un premier poste junior, pas pour devenir senior.",
    },
    {
      type: 'h3',
      text: 'Mois 1 — les fondamentaux, sans projet',
    },
    {
      type: 'p',
      text: "HTML, CSS, JavaScript, Git et ligne de commande. Objectif : écrire une page statique propre, versionnée, déployée. Pas de framework. À la fin du mois, tu dois savoir expliquer ce qu’est une requête HTTP et à quoi sert une branche Git.",
    },
    {
      type: 'h3',
      text: 'Mois 2 — un premier projet qui consomme une API',
    },
    {
      type: 'p',
      text: "Choisis un sujet qui t’intéresse réellement et qui implique des données extérieures : suivi de prix, agrégateur d’offres, tableau de bord de transport public. Livre-le en ligne avec un README qui explique les choix techniques. C’est le projet que tu montreras en entretien.",
    },
    {
      type: 'h3',
      text: 'Mois 3 — le backend et les données',
    },
    {
      type: 'p',
      text: "Node ou Python, une base relationnelle, des requêtes SQL écrites à la main, une authentification simple. Objectif : comprendre ce qui se passe de l’autre côté de l’API, et être capable de débugger une erreur 500 sans paniquer.",
    },
    {
      type: 'h3',
      text: 'Mois 4 — le deuxième projet, plus ambitieux',
    },
    {
      type: 'p',
      text: "Un projet avec utilisateurs, tests et déploiement automatisé. Ajoute une contrainte technique volontaire : cache, file d’attente, ou intégration d’un service tiers. C’est là que tu apprends ce qui distingue un projet d’exercice d’un projet d’ingénierie.",
    },
    {
      type: 'h3',
      text: 'Mois 5 — la recherche et le réseau',
    },
    {
      type: 'p',
      text: "CV réécrit pour les ATS (voir le guide [optimiser son CV pour les ATS](/blog/optimiser-cv-ats-2026)), LinkedIn à jour, présence dans deux ou trois communautés locales, et trente candidatures ciblées plutôt que trois cents génériques. Commence aussi les entretiens blancs, même imparfaits.",
    },
    {
      type: 'h3',
      text: 'Mois 6 — les entretiens et la consolidation',
    },
    {
      type: 'p',
      text: "Tu passes des entretiens, tu notes chaque question qui t’a mis en difficulté, tu combles les trous la semaine suivante. Si les retours sont bons mais que ça ne signe pas, le problème est souvent la présentation, pas le niveau : [la méthode d’entretien technique](/blog/entretien-technique-5-etapes) traite exactement ce point.",
    },
    {
      type: 'h2',
      text: 'Les trois erreurs qui bloquent',
      id: 'erreurs-qui-bloquent',
    },
    {
      type: 'p',
      text: "Sur les profils sans diplôme, les mêmes schémas reviennent. Ils coûtent des mois.",
    },
    {
      type: 'ul',
      items: [
        "**Accumuler les cours** : trente heures de vidéos et zéro dépôt public. Le recruteur ne peut rien vérifier, donc il ne croit rien.",
        "**Un portfolio absent ou invisible** : un GitHub avec trois forks et aucun README ne compte pas. Deux projets finis valent mieux que dix ébauches.",
        "**Mentir sur le CV** : une expérience inventée se démonte en dix minutes d’entretien technique. Une expérience réelle, même personnelle, se défend sans problème.",
      ],
    },
    {
      type: 'p',
      text: "Le reste est une question de volume et de régularité. Si tu veux situer ta trajectoire dans un cadre plus large, l’article sur [la reconversion tech en 2026](/blog/reconversion-tech-2026) détaille les profils qui réussissent et ceux qui abandonnent. Et pour transformer ton parcours en candidature lisible, [Prospecho](/) aligne ton CV sur l’offre sans inventer de diplôme ni d’expérience.",
    },
  ],
  faq: [
    {
      q: 'Peut-on vraiment travailler dans la tech sans diplôme ?',
      a: "Oui, pour le développement web, la QA, le support technique, la data analyse junior et le cloud ops. Ces postes se jugent sur des compétences démontrables : projets en ligne, code lisible, expérience même courte. Le diplôme reste un filtre RH dans les grands groupes, pas une condition de compétence.",
    },
    {
      q: 'Faut-il faire un bootcamp pour se reconvertir dans la tech ?',
      a: "Pas nécessairement. Un bootcamp accélère et apporte un réseau, mais coûte 6 000 à 12 000 € et n’offre aucune garantie d’embauche. Il se justifie si tu as besoin d’un cadre et d’un rythme. Sinon, un autodidacte structuré avec deux projets aboutis arrive au même point en six à douze mois.",
    },
    {
      q: 'Quel métier tech choisir quand on n’a pas de diplôme ?',
      a: "Le développement web junior est le plus accessible, suivi de la QA et du support technique. La data analyse junior reste ouverte en PME, mais le diplôme y pèse davantage. Évite la recherche, la data science senior et l’architecture, où la formation formelle est réellement exigée.",
    },
    {
      q: 'Les certifications cloud aident-elles à trouver un job sans diplôme ?',
      a: "Elles aident à passer le filtre RH et à prouver un vocabulaire commun, notamment AWS Cloud Practitioner, Azure AZ-900 ou ISTQB pour la QA. Leur poids reste faible sans projet qui les utilise. Une certification accompagnée d’un projet déployé vaut dix badges seuls.",
    },
    {
      q: 'Combien de temps faut-il pour décrocher un premier job tech sans diplôme ?',
      a: "Compte 6 à 12 mois en autodidacte structuré à vingt heures par semaine, 3 à 6 mois en bootcamp, 12 à 24 mois en alternance. Ces durées supposent deux projets livrés et une recherche d’emploi active dès le cinquième mois, pas après la fin de la formation.",
    },
  ],
};

export default article;
