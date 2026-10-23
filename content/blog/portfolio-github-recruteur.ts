import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'portfolio-github-recruteur',
    title: 'Portfolio GitHub qui convainc un recruteur : ce qui compte vraiment',
    description:
      "Ce qu'un recruteur regarde sur GitHub en 60 secondes, les 3 projets qui valent mieux que 20 tutoriels, le README qui convainc et les erreurs à éviter.",
    excerpt:
      "Un recruteur passe moins d'une minute sur ton profil. Voilà précisément ce qu'il regarde, dans l'ordre.",
    answer:
      "Un recruteur regarde d'abord ton profil et tes dépôts épinglés, puis le README du premier projet, puis la date du dernier commit. En moins de 60 secondes, il cherche trois signaux : des projets qui résolvent un problème réel, un code lisible avec des tests, et une activité récente. Trois bons dépôts valent mieux que vingt clones de tutoriels.",
    date: '2026-10-15',
    updated: '2026-10-23',
    category: 'Recrutement',
    readingTime: '8 min',
    keywords: [
      'portfolio github',
      'github recruteur',
      'readme projet github',
      'portfolio développeur junior',
      'projets github recrutement',
      'github contribution open source',
    ],
    related: ['structure-cv-developpeur', 'entretien-technique-5-etapes', 'job-tech-sans-diplome'],
  },
  blocks: [
    {
      type: 'p',
      text: "Ton GitHub n'est pas un musée de ce que tu as appris, c'est un argumentaire de vente en accès libre. Un recruteur y jette un œil entre deux entretiens, souvent depuis un téléphone, presque toujours avec une idée déjà formée par ton CV. La question qu'il se pose n'est pas « est-ce que ce candidat code ? » mais « est-ce que je peux lui confier un ticket lundi ? ».",
    },
    {
      type: 'h2',
      text: 'Ce que le recruteur regarde en 30 secondes',
      id: 'trente-secondes',
    },
    {
      type: 'p',
      text: "L'ordre de lecture est stable, et il ne correspond pas à ce que les candidats imaginent. Personne ne lit ton code source ligne par ligne au premier passage.",
    },
    {
      type: 'ol',
      items: [
        "**Le profil** : photo, bio d'une ligne, localisation, lien vers ton CV. Un profil vide avec un pseudo improbable fait fermer l'onglet.",
        "**Les dépôts épinglés** : trois à six maximum. S'il y en a vingt ou aucun, le recruteur ne sait pas où regarder.",
        "**Le README du premier dépôt** : titre, capture d'écran ou lien de démo, une phrase qui dit ce que ça fait. C'est la page qu'il lit vraiment.",
        "**La date du dernier commit** : une activité arrêtée en 2023 soulève une question simple : que fais-tu depuis ?",
      ],
    },
    {
      type: 'p',
      text: "Ce qu'il ne regarde pas, ou très tard : le nombre de dépôts, les followers, les badges décoratifs en haut du README, les scores de jeux concours. Ces éléments rassurent le candidat, pas le recruteur.",
    },
    {
      type: 'h2',
      text: 'Trois projets qui valent mieux que vingt tutoriels',
      id: 'trois-projets',
    },
    {
      type: 'p',
      text: "Le problème du portfolio junior n'est pas le manque de projets, c'est leur uniformité. Un clone de Netflix, un clone de Twitter et une todo-list sont les trois mêmes projets que la moitié de la promotion. Ils prouvent que tu sais suivre des instructions, pas que tu sais construire.",
    },
    {
      type: 'h3',
      text: 'Un projet qui résout un problème que tu connais',
      id: 'projet-probleme-reel',
    },
    {
      type: 'p',
      text: "Un outil de suivi de candidatures, un générateur de plannings pour une association, un script qui nettoie des données publiques de ta ville. Le sujet compte moins que la contrainte : un utilisateur réel, même unique. En entretien, tu pourras expliquer un choix fonctionnel et un arbitrage, ce qu'un clone de tutoriel ne permet jamais.",
    },
    {
      type: 'h3',
      text: 'Une contribution open source, même petite',
      id: 'contribution-open-source',
    },
    {
      type: 'p',
      text: "Une correction de typo dans la documentation ne convainc personne. Une vraie contribution, c'est un bug reproduit, un test ajouté, une pull request mergée. Une seule PR acceptée dans un projet utilisé par d'autres prouve trois choses : tu lis du code que tu n'as pas écrit, tu respectes des conventions, tu sais recevoir une revue.",
    },
    {
      type: 'h3',
      text: 'Un projet avec des tests et de la CI',
      id: 'projet-tests-ci',
    },
    {
      type: 'p',
      text: "Trois tests unitaires et un workflow GitHub Actions qui les lance à chaque push suffisent à changer la perception. Ce dépôt dit « je sais qu'un projet n'est pas seulement du code qui marche sur ma machine ». C'est souvent le signal qui distingue un autodidacte sérieux d'un profil qui a empilé des formations.",
    },
    {
      type: 'h2',
      text: 'Le README qui fait la différence',
      id: 'readme-qui-compte',
    },
    {
      type: 'p',
      text: "Le README est la seule page que tout le monde lit. Il doit répondre à quatre questions en moins de deux écrans : quel problème, quelle démo, quelle stack, comment lancer. Le reste est du bonus.",
    },
    {
      type: 'ul',
      items: [
        "**Le problème** : deux phrases. Ce que fait l'outil, pour qui, pourquoi tu l'as construit. Pas « projet de formation ».",
        "**La démo** : un GIF de quinze secondes ou un lien vers une version en ligne. Une démo cliquable vaut dix captures statiques.",
        "**La stack** : les technologies réellement utilisées, avec une ligne sur le choix quand il est discutable.",
        "**Le lancement en trois commandes** : clone, install, run. Si le lancement exige un .env non fourni et une base non documentée, le recruteur abandonne.",
        "**Les décisions techniques** : deux ou trois paragraphes sur un arbitrage. C'est la partie que les bons recruteurs lisent en entier.",
        "**Les limites** : ce que le projet ne fait pas, ce que tu referais autrement. Reconnaître une limite crédibilise un junior au lieu de l'affaiblir.",
      ],
    },
    {
      type: 'table',
      caption: 'Le même projet, deux README : ce que le recruteur en déduit',
      headers: ['Élément', 'Ce qui tue', 'Ce qui convainc'],
      rows: [
        ['Titre', '« Projet Fil Rouge »', '« Suivi de candidatures pour demandeurs d\'emploi »'],
        ['Première ligne', '« Réalisé dans le cadre de ma formation »', '« Remplace le tableur de suivi, avec relances automatiques »'],
        ['Démo', 'Aucune, ou un lien mort', 'Version déployée + GIF de 15 secondes'],
        ['Lancement', '« Configurez votre base »', 'Trois commandes copiables, jeu de test inclus'],
        ['Décisions', 'Absentes', 'Un paragraphe sur le choix du stockage'],
        ['Limites', 'Absentes', '« Pas de multi-utilisateurs, à ajouter avant un usage en équipe »'],
      ],
    },
    {
      type: 'h2',
      text: "L'historique de commits",
      id: 'historique-commits',
    },
    {
      type: 'p',
      text: "L'historique n'est pas un concours de volume. Un recruteur regarde trois choses : les messages, la régularité, la taille des commits.",
    },
    {
      type: 'ul',
      items: [
        "**Les messages** : « fix », « update », « wip » répétés cinquante fois racontent un projet mal compris. « Corrige le calcul de TVA sur les lignes à quantité nulle » raconte un développeur qui sait ce qu'il fait.",
        "**La régularité** : trois commits par semaine pendant deux mois valent mieux que 200 commits en trois jours suivis de six mois de silence.",
        "**La taille** : un commit de 4 000 lignes est illisible. Des commits de 50 à 300 lignes avec un message clair montrent que tu sais découper un problème.",
        "**Branches et pull requests** : même seul, travailler avec une branche par fonctionnalité et une PR décrite montre comment tu collabores.",
      ],
    },
    {
      type: 'h2',
      text: 'Ce qui tue la crédibilité',
      id: 'ce-qui-tue-credibilite',
    },
    {
      type: 'ul',
      items: [
        "**Les clones de tutoriels** : un clone de Netflix sans modification est immédiatement reconnaissable. Le recruteur l'a vu quinze fois cette semaine.",
        "**Les secrets commités** : une clé API ou un .env dans l'historique est un signal d'alarme sur ta rigueur, et un incident de sécurité sur un dépôt public.",
        "**Le README vide ou généré** : le README par défaut avec le nom du dépôt, ou 600 lignes copiées d'un modèle sans rapport avec le projet.",
        "**La dernière activité en 2023** : un profil figé depuis deux ans, sans explication, laisse supposer que tu ne codes plus.",
        "**Les dépôts fourre-tout** : vingt dépôts nommés « test », « tp » ou « exercice1 » diluent les deux projets qui valent quelque chose.",
        "**Le code mort** : blocs commentés, console.log partout, variables en français et en anglais dans le même fichier. Pas éliminatoire, mais visible en dix secondes.",
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Un recruteur ne cherche pas la quantité, il cherche la preuve. Un dépôt avec un README clair, une démo, trois tests et des commits lisibles pèse plus que vingt dépôts abandonnés. Si tu n'as le temps que pour un seul projet, mets tout dedans.",
    },
    {
      type: 'h2',
      text: 'La checklist en 8 points',
      id: 'checklist-8-points',
    },
    {
      type: 'ul',
      items: [
        "**1.** Trois à six dépôts épinglés, avec un titre explicite, jamais « projet-final ».",
        "**2.** Une bio d'une ligne avec ton métier visé et un lien vers ton CV.",
        "**3.** Un README par dépôt épinglé : problème, démo, stack, lancement, décisions, limites.",
        "**4.** Une démo accessible : lien déployé, GIF ou capture dans le README.",
        "**5.** Au moins un projet avec des tests et une intégration continue visible.",
        "**6.** Des commits explicites et une activité dans les six derniers mois.",
        "**7.** Aucun secret ni clé API dans l'historique, vérifié par un scan des dépôts.",
        "**8.** Un lien vers ton GitHub en haut du CV, à côté du mail.",
      ],
    },
    {
      type: 'p',
      text: "Une fois ces huit points en place, la suite se joue ailleurs : ton CV doit reprendre les mêmes projets avec les mêmes mots, sinon le recruteur ne fait pas le lien. La méthode est dans [structurer un CV de développeur](/blog/structure-cv-developpeur), et si tu n'as pas de diplôme, lis [les métiers tech accessibles sans diplôme](/blog/job-tech-sans-diplome). Ton portfolio servira ensuite de support à [l'entretien technique](/blog/entretien-technique-5-etapes). Pour voir comment ces signaux sont lus côté entreprise, [Prospecho](/) documente le processus.",
    },
  ],
  faq: [
    {
      q: 'Combien de projets faut-il sur un GitHub pour trouver un job ?',
      a: "Trois projets sérieux suffisent, à condition qu'ils soient finis, déployés et documentés. Mieux vaut trois dépôts avec un README complet et une démo qu'une vingtaine de dépôts abandonnés. Les recruteurs retiennent un ou deux projets, pas l'ensemble du profil.",
    },
    {
      q: 'Un recruteur regarde-t-il vraiment mon code sur GitHub ?',
      a: "Un recruteur RH regarde surtout le profil, les dépôts épinglés et les README. Un lead technique ou un futur collègue ouvre en revanche le code, la structure des dossiers et les tests. Les deux passages durent moins d'une minute, donc le README pèse plus lourd que la qualité d'une fonction isolée.",
    },
    {
      q: 'Les contributeurs open source sont-ils favorisés au recrutement ?',
      a: "Une contribution réelle est un signal fort, mais elle n'est pas obligatoire. Elle prouve que tu sais lire du code existant, respecter des conventions et passer une revue. Une petite pull request mergée dans un projet utilisé vaut mieux que dix dépôts personnels, mais un bon projet documenté reste recevable.",
    },
    {
      q: 'Que faire si mon GitHub est vide ?',
      a: "Commence par un seul projet qui résout un problème que tu connais, avec une démo en ligne et un README structuré. Un dépôt solide publié en trois semaines change plus ton profil que six mois d'exercices non publiés. Tu peux compléter avec une contribution sur un outil que tu utilises déjà.",
    },
    {
      q: 'Faut-il un portfolio en plus de GitHub ?',
      a: "Un portfolio séparé n'est utile que s'il apporte ce que GitHub ne montre pas : une étude de cas, des captures, un parcours, des projets non techniques. Pour un profil junior, un GitHub bien rangé avec trois README soignés suffit souvent. L'essentiel est que le lien soit visible sur le CV.",
    },
  ],
};

export default article;
