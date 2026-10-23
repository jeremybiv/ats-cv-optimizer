import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'reconversion-tech-2026',
    title: 'Reconversion dans la tech : le parcours réaliste en 2026',
    description:
      "Durées, coûts et voies réelles d'une reconversion dans la tech en 2026 : bootcamp, alternance ou autodidacte, avec un plan 90 jours et les pièges à éviter.",
    excerpt:
      "Ce qui se passe vraiment entre le premier jour de formation et la signature du contrat, chiffres et délais à l'appui.",
    answer:
      "Une reconversion dans la tech prend en général 9 à 12 mois jusqu'au premier poste, avec une fourchette réaliste de 6 à 18 mois selon la voie choisie. Trois chemins existent : bootcamp intensif, alternance ou contrat pro, autodidacte structuré. Le facteur décisif n'est pas le diplôme mais le temps disponible chaque semaine et les projets que tu peux montrer.",
    date: '2026-10-06',
    updated: '2026-10-23',
    category: 'Carrière',
    readingTime: '10 min',
    keywords: [
      'reconversion tech',
      'reconversion développeur',
      'bootcamp développement web',
      'alternance informatique',
      'devenir data analyst',
      'reconversion professionnelle 2026',
    ],
    related: ['job-tech-sans-diplome', 'optimiser-cv-ats-2026', 'entretien-technique-5-etapes'],
  },
  blocks: [
    {
      type: 'p',
      text: "La reconversion vers la tech est un projet de formation avec un budget, un calendrier et un risque. Celles et ceux qui y arrivent ont choisi un métier demandé, une voie compatible avec leurs charges, et tenu un rythme régulier pendant neuf à douze mois.",
    },
    {
      type: 'h2',
      text: 'Choisir un métier à forte demande',
      id: 'metiers-forte-demande',
    },
    {
      type: 'p',
      text: "Tous les métiers de la tech ne se valent pas quand tu démarres sans expérience. Certains acceptent des profils juniors issus de reconversion, d'autres filtrent sur un diplôme d'ingénieur dès l'annonce. Voici les cinq portes d'entrée qui absorbent encore des candidats formés en quelques mois.",
    },
    {
      type: 'ul',
      items: [
        "**Développeur web** : le plus gros volume d'offres, donc la plus forte concurrence junior. Deux projets déployés et lisibles pèsent plus qu'une certification.",
        "**Data analyst** : SQL, tableur, un outil de visualisation, un peu de Python. Moins de postes, beaucoup moins de candidats capables d'interroger une base.",
        "**QA / testeur** : métier sous-estimé, avec une passerelle réelle vers l'automatisation. Bon point d'entrée depuis la banque, la logistique ou le support.",
        "**Support technique et cloud** : helpdesk niveau 2, administration, une certification cloud. Recrutement régulier, y compris hors des métropoles.",
        "**Cybersécurité junior** : le vrai poste junior arrive après un socle réseau et système. Cible à 12-18 mois, pas à 4, malgré ce qu'annoncent certaines formations.",
      ],
    },
    {
      type: 'p',
      text: "Évite le métier choisi par passion isolée, jeu vidéo ou blockchain : le rapport candidats/postes juniors y est défavorable. Tu y reviendras plus tard, avec un réseau.",
    },
    {
      type: 'table',
      caption: 'Cinq métiers accessibles après une reconversion (ordres de grandeur 2026)',
      headers: ['Métier', "Temps d'accès", 'Compétences clés', 'Tension du marché'],
      rows: [
        ['Développeur web', '9 à 12 mois', 'JavaScript, un framework, Git', 'Concurrence junior forte'],
        ['Data analyst', '6 à 10 mois', 'SQL, tableur, Power BI, Python', 'Demande réelle, peu de candidats'],
        ['QA / testeur', '4 à 8 mois', 'Méthodes de test, Playwright', 'Recrutement régulier'],
        ['Support et cloud', '6 à 12 mois', 'Réseau, Linux, une certification', 'Turnover élevé'],
        ['Cybersécurité junior', '12 à 18 mois', 'Réseau, système, SIEM', 'Peu de vrais postes juniors'],
      ],
    },
    {
      type: 'h2',
      text: 'Les trois voies de reconversion',
      id: 'trois-voies',
    },
    {
      type: 'p',
      text: "Trois chemins mènent au même poste, pour des coûts et des durées très différents. Le choix dépend de ta capacité à vivre sans salaire complet pendant six mois.",
    },
    {
      type: 'h3',
      text: 'Le bootcamp intensif',
      id: 'bootcamp-intensif',
    },
    {
      type: 'p',
      text: "Trois à quatre mois à temps plein, 6 000 à 12 000 €, parfois financés par un OPCO ou une région. L'avantage : un cadre, une deadline, des projets à montrer. Le risque : sortir avec un socle identique à celui de trente autres candidats. Un bootcamp ne te rend pas autonome, il te rend présentable.",
    },
    {
      type: 'h3',
      text: "L'alternance et le contrat de professionnalisation",
      id: 'alternance-contrat-pro',
    },
    {
      type: 'p',
      text: "Douze à vingt-quatre mois, rémunérés, formation payée, souvent un CDI à la clé. C'est la voie la plus solide après 26 ans ou avec des charges familiales. La difficulté est en amont : trouver l'entreprise, ce qui prend deux à quatre mois et suppose de candidater hors de ta zone.",
    },
    {
      type: 'h3',
      text: "L'autodidacte structuré",
      id: 'autodidacte-structure',
    },
    {
      type: 'p',
      text: "Zéro à 1 500 €, six à douze mois, mais un taux d'abandon élevé. Ça marche avec un programme écrit et des échéances, pas une collection de tutoriels. Trois projets finis et documentés passent devant un diplômé de bootcamp qui a suivi passivement.",
    },
    {
      type: 'table',
      caption: 'Comparatif des trois voies de reconversion',
      headers: ['Voie', 'Durée', 'Coût', 'Diplôme', 'Premier job'],
      rows: [
        ['Bootcamp intensif', '3 à 4 mois + recherche', '6 000 à 12 000 €', 'Titre ou certification', 'Rapide si le réseau suit'],
        ['Alternance / contrat pro', '12 à 24 mois', 'Rémunéré', 'Titre RNCP', 'Le plus prévisible'],
        ['Autodidacte structuré', '6 à 12 mois', '0 à 1 500 €', 'Aucun, portfolio', 'Variable'],
      ],
    },
    {
      type: 'h2',
      text: "Combien de temps jusqu'au premier poste",
      id: 'durees-reelles',
    },
    {
      type: 'p',
      text: "Le chiffre à retenir : 6 à 18 mois entre le premier jour de formation et la signature, avec une médiane observée autour de 9 à 12 mois. Les écoles communiquent sur la durée de formation, pas sur celle jusqu'au contrat.",
    },
    {
      type: 'ul',
      items: [
        "**Mois 0 à 3** : socle technique. Tu codes tous les jours, sans chercher un poste : tu n'as rien à montrer.",
        "**Mois 3 à 6** : premier projet complet, déployé, avec un README lisible. Début du réseau : meetups, communautés, anciens de promo.",
        "**Mois 6 à 9** : candidatures, la phase la plus décourageante. Prévois 40 à 80 candidatures ciblées, pas 300 en envoi massif.",
        "**Mois 9 à 12** : entretiens techniques, tests à domicile, négociation. C'est souvent là que ça se signe, avec deux processus en parallèle.",
      ],
    },
    {
      type: 'p',
      text: "Si tu n'as aucune réponse au bout de trente candidatures, le problème est le CV ou le ciblage, rarement le niveau technique. Voir [optimiser son CV pour les ATS](/blog/optimiser-cv-ats-2026).",
    },
    {
      type: 'h2',
      text: 'Combien ça coûte vraiment',
      id: 'couts-reels',
    },
    {
      type: 'ul',
      items: [
        "**Bootcamp** : 6 000 à 12 000 € en présentiel, 4 000 à 7 000 € en ligne. Vérifie ce que le prix inclut : accompagnement, certifications, projets.",
        "**Alternance** : 0 € de frais, un salaire de 50 à 100 % du SMIC selon l'âge. Le coût est le temps, pas l'argent.",
        "**Autodidacte** : 0 à 1 500 € entre cours, certification cloud, nom de domaine et hébergement.",
        "**Coût d'opportunité** : six à douze mois sans salaire complet, soit 15 000 à 30 000 € non perçus. À comparer au salaire visé, pas au prix de la formation.",
      ],
    },
    {
      type: 'p',
      text: "Un bootcamp à 9 000 € financé par un prêt reste défendable s'il aboutit en moins de douze mois avec un premier salaire à 32 000 € brut. Le même prêt avec dix-huit mois de recherche et un poste à 28 000 € devient une mauvaise décision.",
    },
    {
      type: 'h2',
      text: "Le taux d'embauche des bootcamps : ce qu'il cache",
      id: 'taux-embauche-bootcamps',
    },
    {
      type: 'p',
      text: "Les bootcamps annoncent 70 à 85 % d'embauche en six mois. Ce n'est pas forcément faux, mais la définition compte plus que le chiffre affiché en page d'accueil.",
    },
    {
      type: 'ul',
      items: [
        "**Embauche dans quoi ?** Un poste de support ou de conseiller numérique compte parfois comme un placement réussi, même hors du métier visé.",
        "**Qui répond ?** Le taux est calculé sur les diplômés qui ont répondu, et les personnes en recherche prolongée répondent moins.",
        "**Quel contrat ?** Un CDD de trois mois, une alternance ou une mission freelance comptent parfois comme une embauche.",
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Un taux d'embauche mesure un réseau local, pas une garantie individuelle. Demande quatre chiffres : taille de la cohorte, nombre de répondants, salaire médian, et combien exercent encore le métier deux ans après.",
    },
    {
      type: 'h2',
      text: 'Les profils qui réussissent',
      id: 'profils-qui-reussissent',
    },
    {
      type: 'ul',
      items: [
        "**Du temps réel** : 15 à 20 heures par semaine en autodidacte, 35 en bootcamp. Une heure le soir ne suffit pas sur douze mois.",
        "**Un métier transférable** : rigueur d'un contrôleur de gestion, pédagogie d'un enseignant, relation client d'un commercial.",
        "**Un réseau activé tôt** : une grande partie des premiers postes juniors passe par une recommandation ou un meetup.",
        "**Un objectif précis** : « travailler dans la tech » n'est pas un objectif ; « data analyst dans une PME industrielle à Lyon » en est un.",
      ],
    },
    {
      type: 'p',
      text: "Ceux qui échouent ont acheté une formation avant d'avoir parlé à quelqu'un qui fait le métier. Trente minutes valent plus que trois comparatifs d'écoles.",
    },
    {
      type: 'h2',
      text: 'Un plan 90 jours',
      id: 'plan-90-jours',
    },
    {
      type: 'p',
      text: "Trois mois pour une trajectoire vérifiable, avant d'engager de l'argent. Ce plan ne promet pas un poste, il évite d'en acheter un.",
    },
    {
      type: 'ol',
      items: [
        "**Semaine 1** : trois entretiens exploratoires avec des gens qui font le métier. Trois questions : ta journée, ce que tu regardes dans un CV junior, ce qui te ferait recruter sans diplôme.",
        "**Semaine 2** : choix du métier et de la voie. Écris budget, durée et heures disponibles. Si les trois ne tiennent pas ensemble, change de voie.",
        "**Semaines 3 à 6** : socle technique. Un cours structuré, pas cinq en parallèle, et un exercice livré chaque semaine.",
        "**Semaines 7 à 10** : premier projet réel, même petit, qui résout un problème que tu connais : suivi de candidatures, calcul de devis, données publiques.",
        "**Semaines 11 et 12** : déploiement, README, tests minimaux, publication. C'est la pièce que le recruteur regardera en premier, selon [portfolio GitHub qui convainc un recruteur](/blog/portfolio-github-recruteur).",
        "**Fin du mois 3** : bilan écrit. Trois projets, un réseau, un CV à jour ? Si non, corrige le rythme avant de payer une formation.",
      ],
    },
    {
      type: 'h2',
      text: 'Les pièges qui coûtent cher',
      id: 'pieges',
    },
    {
      type: 'ul',
      items: [
        "**La promesse d'embauche** : aucune école sérieuse ne garantit un poste. Une « garantie emploi » suppose souvent d'accepter n'importe quel poste, n'importe où, pendant une durée limitée.",
        "**La dette mal calibrée** : un prêt de 10 000 € pour un métier à 28 000 € brut se rembourse, mais il faut le simuler avant la signature.",
        "**Le portfolio inexistant** : un diplôme sans projet déployé ne pèse rien face à trois applications en ligne.",
        "**Le CV générique** : sans les mots-clés du poste, tu passes sous les filtres. Voir [notre guide sur les ATS](/blog/optimiser-cv-ats-2026).",
        "**L'isolement** : douze mois seul, sans retour extérieur, produisent un discours qui ne passe pas en entretien. Prépare [l'entretien technique](/blog/entretien-technique-5-etapes) avec quelqu'un.",
      ],
    },
    {
      type: 'p',
      text: "La reconversion n'est pas un sprint de trois mois : les deux premières années, tu apprends plus vite que tu ne produis. Pour situer les salaires une fois le poste décroché, lis [négocier son salaire tech](/blog/negocier-salaire-tech). [Prospecho](/) te donne des offres réelles.",
    },
  ],
  faq: [
    {
      q: 'Combien de temps faut-il pour se reconvertir dans la tech ?',
      a: "Compte 9 à 12 mois en moyenne entre le début de la formation et le premier contrat, avec une fourchette de 6 à 18 mois. La formation elle-même dure 3 à 4 mois en bootcamp, 12 à 24 mois en alternance, 6 à 12 mois en autodidacte. La recherche d'emploi représente souvent un tiers du parcours.",
    },
    {
      q: 'Un bootcamp suffit-il pour trouver un job de développeur ?',
      a: "Un bootcamp suffit pour être présentable, pas pour être autonome. Il donne un socle et des projets, mais la différence se fait sur les six mois qui suivent : projets personnels, contributions open source, réseau local. Les taux d'embauche annoncés entre 70 et 85 % dépendent fortement de la définition retenue.",
    },
    {
      q: 'Quelle reconversion tech choisir quand on a plus de 35 ans ?',
      a: "L'alternance ou le contrat de professionnalisation reste la voie la plus sûre après 35 ans : formation payée, salaire pendant la transition et forte probabilité de CDI. À défaut, la data analyst et le support cloud acceptent davantage de profils seniors que le développement web junior, où la concurrence est plus jeune.",
    },
    {
      q: 'Peut-on se reconvertir dans la tech sans diplôme ?',
      a: "Oui, à condition de remplacer le diplôme par des preuves de compétence : projets déployés, code lisible, contributions open source, et un discours clair sur ce que tu sais faire. Certaines entreprises filtrent encore sur le diplôme, mais les PME, les ESN et les startups regardent d'abord le portfolio et les tests techniques.",
    },
    {
      q: 'Combien coûte une reconversion dans le développement web ?',
      a: "De 0 à 12 000 € selon la voie. Un bootcamp privé coûte 6 000 à 12 000 €, l'alternance est gratuite et rémunérée, l'autodidacte revient à 0-1 500 €. Il faut y ajouter le coût d'opportunité : six à douze mois sans salaire complet, soit souvent 15 000 à 30 000 € de revenus non perçus.",
    },
  ],
};

export default article;
