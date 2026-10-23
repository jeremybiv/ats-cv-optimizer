import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'entretien-technique-5-etapes',
    title: "Réussir l’entretien technique : la méthode en 5 étapes",
    description:
      "Décoder l’annonce, préparer des récits STAR chiffrés, maîtriser le live coding et le system design : la méthode en 5 étapes pour réussir l’entretien tech.",
    excerpt:
      "Un entretien technique se prépare comme une livraison : périmètre, preuves, répétition, puis compte rendu.",
    answer:
      "Un entretien technique se prépare en cinq étapes : décoder l’annonce et le niveau réellement attendu, préparer trois récits STAR chiffrés, répéter le live coding en verbalisant, structurer un system design même junior, puis préparer tes questions et le suivi écrit. Compte six à dix heures de préparation sérieuse par entretien, réparties sur trois jours.",
    date: '2026-10-22',
    updated: '2026-10-23',
    category: 'Carrière',
    readingTime: '9 min',
    keywords: [
      'entretien technique',
      'préparation entretien développeur',
      'live coding',
      'system design junior',
      'méthode STAR',
      'entretien tech',
    ],
    related: ['portfolio-github-recruteur', 'negocier-salaire-tech', 'lettre-motivation-tech'],
  },
  blocks: [
    {
      type: 'h2',
      text: 'Vue d’ensemble : les cinq étapes',
      id: 'vue-ensemble-cinq-etapes',
    },
    {
      type: 'p',
      text: "La plupart des échecs en entretien technique ne viennent pas d’un manque de compétence, mais d’un désalignement : le candidat prépare ce qu’il aime, l’entreprise évalue autre chose. La méthode ci-dessous remet l’effort au bon endroit, dans le bon ordre.",
    },
    {
      type: 'table',
      caption: 'Les cinq étapes, leur objectif et le temps à y consacrer',
      headers: ['Étape', 'Objectif', 'Temps de préparation', 'Livrable'],
      rows: [
        ['1. Décoder l’annonce', 'Identifier le niveau et les trois compétences réellement évaluées', '45 min', 'Une fiche de 10 lignes'],
        ['2. Trois récits STAR', 'Prouver l’impact avec des faits chiffrés', '2 h', 'Trois histoires de 90 secondes'],
        ['3. Live coding', 'Coder en verbalisant sans se bloquer', '2 à 3 h', 'Six exercices refaits à blanc'],
        ['4. System design', 'Structurer une réponse même junior', '1 h 30', 'Une trame en cinq blocs'],
        ['5. Questions et suivi', 'Clore proprement et rester en tête', '30 min', 'Quatre questions + un mail'],
      ],
    },
    {
      type: 'p',
      text: "Total : six à dix heures par entretien. C’est beaucoup pour une seule opportunité, et c’est exactement ce qui distingue une candidature préparée d’une candidature au hasard. Si tu enchaînes les entretiens, tu réutilises 70 % de ce travail d’une fois sur l’autre.",
    },
    {
      type: 'h2',
      text: 'Étape 1 — Décoder l’annonce et le niveau attendu',
      id: 'etape-1-decoder-annonce',
    },
    {
      type: 'p',
      text: "Une annonce tech contient trois informations utiles et beaucoup de bruit. Les informations utiles : les technologies réellement centrales, le niveau de séniorité exprimé en années ou en autonomie, et la nature de l’équipe (produit, plateforme, data). Le bruit : les listes de « bonus » et les soft skills génériques que tout le monde copie.",
    },
    {
      type: 'p',
      text: "Ce qui est évalué à cette étape, c’est ta capacité à hiérarchiser. Erreur fréquente : préparer chaque technologie citée, y compris celles marquées « un plus ». Tu dilues ton temps et tu arrives moyen partout. Deuxième erreur : surestimer le niveau. Une annonce qui demande « 3 ans d’expérience » et une équipe de quatre personnes n’attend pas un architecte, elle attend quelqu’un qui livre.",
    },
    {
      type: 'p',
      text: "Phrase type à te dire avant de commencer : « Sur ce poste, on va me demander de faire X, dans un contexte Y, avec un niveau Z. Qu’est-ce que je peux prouver là-dessus en dix minutes ? » Si la réponse est vide, c’est le premier trou à combler, avant même de réviser.",
    },
    {
      type: 'h2',
      text: 'Étape 2 — Trois récits STAR chiffrés',
      id: 'etape-2-recits-star',
    },
    {
      type: 'p',
      text: "La méthode STAR (situation, tâche, action, résultat) est connue, et souvent mal appliquée : les candidats racontent le contexte pendant deux minutes et expédient le résultat en une phrase. Inverse le ratio. Le résultat et ta contribution personnelle doivent occuper la moitié du temps de parole.",
    },
    {
      type: 'p',
      text: "Trois récits suffisent pour couvrir la majorité des questions comportementales : un succès technique mesurable, un conflit ou désaccord géré, un échec assumé avec ce que tu en as tiré. Chacun tient en quatre-vingt-dix secondes et contient au moins un chiffre : temps gagné, coût réduit, incident évité, utilisateurs servis.",
    },
    {
      type: 'h3',
      text: 'Le gabarit à remplir',
    },
    {
      type: 'ul',
      items: [
        "**Situation** : une phrase, avec l’échelle (taille d’équipe, trafic, enjeu).",
        "**Tâche** : ce qui t’était personnellement confié, pas ce que l’équipe devait faire.",
        "**Action** : deux ou trois décisions concrètes, avec les alternatives que tu as écartées.",
        "**Résultat** : un chiffre, et ce qui se serait passé sans toi.",
      ],
    },
    {
      type: 'p',
      text: "Ce qui est évalué ici : la clarté et la conscience de ton propre rôle. L’erreur classique est de dire « on a fait » du début à la fin, ce qui empêche le recruteur de savoir ce que tu sais faire. Si tu n’as jamais chiffré ton travail, c’est le moment de reconstituer les ordres de grandeur : une estimation honnête et expliquée vaut mieux qu’un chiffre rond lancé sans justification.",
    },
    {
      type: 'h2',
      text: 'Étape 3 — Maîtriser le live coding',
      id: 'etape-3-live-coding',
    },
    {
      type: 'p',
      text: "Le live coding n’évalue pas ta vitesse de frappe. Il évalue ta méthode : est-ce que tu clarifies l’énoncé, est-ce que tu penses aux cas limites, est-ce que tu sais tester ce que tu écris, est-ce que tu sais recevoir un indice sans te braquer. Un candidat qui résout l’exercice en silence obtient souvent une moins bonne évaluation qu’un candidat qui échoue en expliquant clairement sa démarche.",
    },
    {
      type: 'h3',
      text: 'Les six temps d’un live coding réussi',
    },
    {
      type: 'ol',
      items: [
        "**Clarifier** : reformule l’énoncé, demande les contraintes (taille d’entrée, types, doublons, valeurs nulles).",
        "**Exemple** : écris un cas simple à la main, puis un cas limite, avant tout code.",
        "**Pseudo-code** : annonce l’approche en trois lignes et son coût approximatif.",
        "**Coder** : nomme correctement, découpe en fonctions, ne t’excuse pas de taper lentement.",
        "**Tester** : exécute mentalement le cas limite, puis corrige sans t’effondrer.",
        "**Verbaliser** : à la fin, résume ce que tu as fait, ce qui manque, et ce que tu ferais avec plus de temps.",
      ],
    },
    {
      type: 'p',
      text: "Erreur fréquente : attaquer le code dans la première minute pour montrer que tu sais faire. Tu te retrouves avec une solution non testée et un énoncé mal compris. Deuxième erreur : rester silencieux quand tu bloques. Dis ce que tu cherches : « je vérifie si un parcours en largeur est nécessaire ici, parce que… ». Le silence est interprété comme une absence de raisonnement.",
    },
    {
      type: 'p',
      text: "Si l’exercice porte sur du code existant, la logique est proche de celle d’un [portfolio lisible par un recruteur](/blog/portfolio-github-recruteur) : structure claire, noms explicites, aucune ligne magique.",
    },
    {
      type: 'h2',
      text: 'Étape 4 — Structurer un system design, même junior',
      id: 'etape-4-system-design',
    },
    {
      type: 'p',
      text: "On te demande de concevoir un raccourcisseur d’URL ou un fil de messages, et tu n’as jamais fait ça en production. C’est normal : l’exercice évalue ta capacité à raisonner par blocs, pas ton expérience de Google. Une trame en cinq temps suffit à ne pas se perdre.",
    },
    {
      type: 'ul',
      items: [
        "**Besoins** : qui utilise, combien d’utilisateurs, quelles opérations, quelles contraintes de latence et de cohérence.",
        "**Composants** : client, API, service applicatif, file d’attente si nécessaire, stockage.",
        "**Données** : modèle, clés, volume, stratégie de lecture et d’écriture.",
        "**Scalabilité** : ce qui casse en premier, cache, réplicas, partitionnement.",
        "**Compromis** : ce que tu sacrifies et pourquoi, avec une alternative écartée.",
      ],
    },
    {
      type: 'p',
      text: "Ce qui est évalué : la capacité à poser des hypothèses explicites et à les défendre. Erreur classique : dessiner des composants sans jamais chiffrer. Même approximatif, un ordre de grandeur change la discussion : « 10 000 requêtes par jour, ça tient sur une instance unique » est une phrase qui montre que tu sais dimensionner. Deuxième erreur : réciter une architecture de blog technique sans lien avec l’énoncé.",
    },
    {
      type: 'p',
      text: "Phrase type pour démarrer : « Avant de dessiner, je vais poser trois hypothèses et tu me corriges si je suis à côté. » Tu transformes un exercice d’examen en discussion d’ingénierie.",
    },
    {
      type: 'h2',
      text: 'Étape 5 — Tes questions et le suivi écrit',
      id: 'etape-5-questions-suivi',
    },
    {
      type: 'p',
      text: "Les cinq dernières minutes décident souvent de l’impression finale. « Avez-vous des questions ? » n’est pas une formalité : c’est le moment où tu montres que tu te projettes dans l’équipe. Prépare quatre questions, pose-en deux, garde les autres pour le tour suivant.",
    },
    {
      type: 'ul',
      items: [
        "Comment se passe une revue de code ici, et combien de temps prend-elle en moyenne ?",
        "Qu’est-ce qui a causé le dernier incident en production, et qu’est-ce qui a changé ensuite ?",
        "Quelle est la part de dette technique assumée dans le prochain trimestre ?",
        "Comment se décide une priorité entre une demande produit et un chantier de plateforme ?",
      ],
    },
    {
      type: 'p',
      text: "Le suivi écrit, ensuite : un mail de six lignes dans les vingt-quatre heures, qui remercie, reformule un point technique discuté et ajoute éventuellement un lien vers un projet évoqué. Pas de relance avant cinq jours ouvrés, pas de message sur trois canaux différents.",
    },
    {
      type: 'h2',
      text: 'Les erreurs qui éliminent',
      id: 'erreurs-qui-eliminent',
    },
    {
      type: 'table',
      caption: 'Erreurs fréquentes et signal envoyé au recruteur',
      headers: ['Erreur', 'Signal perçu', 'Correctif'],
      rows: [
        ['Coder sans clarifier l’énoncé', 'Ne lit pas les specs, livrera à côté', 'Trois questions avant la première ligne'],
        ['Rester silencieux quand tu bloques', 'Pas de raisonnement, seulement de la mémoire', 'Verbaliser la piste et l’impasse'],
        ['Dire « on » sans jamais « j »', 'Contribution personnelle inconnue', 'Nommer tes décisions et tes arbitrages'],
        ['Inventer une expérience', 'Risque éthique immédiat', 'Assumer le manque et expliquer l’apprentissage'],
        ['Négliger les cas limites', 'Code fragile en production', 'Un test vide, un test à un élément, un doublon'],
        ['Aucune question à la fin', 'Désintérêt pour l’équipe', 'Deux questions préparées, spécifiques'],
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "On ne recrute pas quelqu’un qui sait tout, on recrute quelqu’un avec qui on peut travailler pendant deux ans. La verbalisation, les cas limites et les questions comptent autant que la solution.",
    },
    {
      type: 'h2',
      text: 'Le plan des 72 heures avant',
      id: 'plan-72-heures',
    },
    {
      type: 'ul',
      items: [
        "**J-3** : relire l’annonce, écrire la fiche de dix lignes, choisir les trois récits STAR et les chiffrer.",
        "**J-2** : refaire quatre exercices à blanc en verbalisant à voix haute, chronométré.",
        "**J-1** : préparer la trame de system design, les quatre questions, et tester la visio (son, écran, éditeur).",
        "**Jour J** : dix minutes de relecture des récits, pas de nouvel exercice. Arriver en avance, eau à portée de main.",
        "**J+1** : mail de suivi en six lignes, avec un point technique repris de l’échange.",
      ],
    },
    {
      type: 'p',
      text: "Une fois l’offre sur la table, la discussion change de nature : elle porte sur le niveau réel et la rémunération. La méthode pour ne pas laisser filer dix mille francs ou euros est détaillée dans [négocier son salaire tech](/blog/negocier-salaire-tech). Et si ta candidature écrite doit encore être envoyée, la [lettre de motivation](/blog/lettre-motivation-tech) explique quand elle sert vraiment. Pour aligner ton CV sur l’offre avant l’entretien, [Prospecho](/) génère une version adaptée aux ATS en quelques minutes.",
    },
  ],
  faq: [
    {
      q: 'Combien de temps faut-il pour préparer un entretien technique ?',
      a: "Six à dix heures réparties sur trois jours pour un premier entretien : quarante-cinq minutes pour décoder l’annonce, deux heures pour les récits STAR, deux à trois heures de live coding, une heure trente de system design, trente minutes de questions et de suivi. Les entretiens suivants réutilisent environ 70 % de ce travail.",
    },
    {
      q: 'Que faire si je bloque pendant un live coding ?',
      a: "Verbalise ce que tu cherches et pourquoi tu es bloqué, puis propose une approche plus simple qui fonctionne. Le recruteur évalue le raisonnement, pas la vitesse. Un candidat qui explique une solution partielle et ses limites est souvent mieux noté qu’un candidat silencieux qui devine.",
    },
    {
      q: 'Un junior doit-il savoir faire du system design ?',
      a: "Pas au niveau d’un architecte, mais il doit savoir structurer : besoins, composants, données, scalabilité, compromis. L’exercice évalue la capacité à poser des hypothèses explicites et à les défendre. Une trame en cinq blocs suffit à tenir trente minutes sans se perdre.",
    },
    {
      q: 'Faut-il envoyer un mail après un entretien technique ?',
      a: "Oui, un mail de six lignes dans les vingt-quatre heures : remerciement, reprise d’un point technique discuté, éventuellement un lien vers un projet évoqué. C’est un signal de rigueur, pas une relance commerciale. Attends ensuite cinq jours ouvrés avant de demander une réponse.",
    },
    {
      q: 'Comment parler d’un échec en entretien sans se dévaloriser ?',
      a: "Choisis un échec réel, avec un périmètre limité et une conséquence mesurable, puis consacre la moitié du récit à ce que tu as changé ensuite. Le recruteur cherche la lucidité et la correction, pas l’absence d’erreur. Un échec nié ou attribué aux autres est plus disqualifiant que l’échec lui-même.",
    },
  ],
};

export default article;
