import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'lettre-motivation-tech',
    title: "Lettre de motivation tech : ce qui marche encore (et ce qui est mort)",
    description:
      "Lettre de motivation tech : quand elle fait encore vraiment la différence, comment la structurer en 4 paragraphes utiles, et ce qui la fait rejeter en 2026.",
    excerpt:
      "Une lettre utile tient en quatre paragraphes ; une lettre morte tient en treize lignes de politesse.",
    answer:
      "La lettre de motivation reste utile dans trois cas : candidature spontanée, PME ou startup sans ATS, et profil en reconversion qui doit expliquer un parcours non linéaire. Ailleurs — grands groupes, candidature en un clic — elle est rarement lue. Si tu l’écris, vise quatre paragraphes courts : accroche spécifique, preuve technique chiffrée, adéquation au poste, appel à l’action.",
    date: '2026-10-18',
    updated: '2026-10-23',
    category: 'Recrutement',
    readingTime: '7 min',
    keywords: [
      'lettre de motivation tech',
      'candidature développeur',
      'lettre de motivation ATS',
      'recrutement tech',
      'candidature spontanée',
    ],
    related: ['optimiser-cv-ats-2026', 'entretien-technique-5-etapes', 'negocier-salaire-tech'],
  },
  blocks: [
    {
      type: 'h2',
      text: 'Quand la lettre de motivation compte encore',
      id: 'quand-la-lettre-compte',
    },
    {
      type: 'p',
      text: "Il y a un test simple : si le recruteur reçoit trente candidatures pour un poste et que ton CV ressemble aux vingt-neuf autres, la lettre devient le seul endroit où tu peux expliquer pourquoi tu es là. C’est exactement pour ça qu’elle survit dans certains contextes et disparaît dans d’autres. Elle n’est pas morte, elle est devenue conditionnelle.",
    },
    {
      type: 'p',
      text: "Trois situations lui donnent encore un poids réel. **La candidature spontanée** : aucune annonce ne dit ce que l’entreprise cherche, donc c’est à toi de formuler le besoin et la façon dont tu y réponds. **La PME et la startup sans ATS** : le fondateur ou le CTO lit lui-même les mails, souvent le soir, et une lettre de dix lignes peut déclencher une réponse. **Le profil en reconversion** : ton CV a une ligne droite qui n’existe pas, et il faut raconter le raisonnement derrière le virage.",
    },
    {
      type: 'p',
      text: "Dans ces trois cas, la lettre ne répète pas le CV : elle ajoute un contexte, une motivation vérifiable ou une raison précise de vouloir cette entreprise et pas sa concurrente.",
    },
    {
      type: 'h2',
      text: 'Quand elle ne sert à rien',
      id: 'quand-la-lettre-ne-sert-a-rien',
    },
    {
      type: 'p',
      text: "À l’inverse, il existe des cas où écrire une lettre est un investissement à rendement quasi nul. Les grands groupes qui recrutent via Workday, Taleo ou SuccessFactors traitent des volumes tels que le champ « lettre de motivation » est optionnel, souvent ignoré, parfois même non transmis au manager. La candidature en un clic depuis LinkedIn tombe dans la même catégorie : le recruteur voit d’abord une liste de noms, de titres et de compétences, pas un texte de motivation.",
    },
    {
      type: 'ul',
      items: [
        "**Offre avec 200 candidats et un ATS** : ta lettre est lue après le CV, donc jamais si le CV ne passe pas le filtre.",
        "**Job board avec formulaire court** : le texte libre est noyé dans le dossier, personne ne le remonte.",
        "**Candidature via un chasseur de têtes** : il te posera les questions directement, la lettre n’ajoute rien.",
      ],
    },
    {
      type: 'p',
      text: "La règle pratique : si le formulaire ne demande pas explicitement une lettre, passe dix minutes sur ton CV et ton [score ATS](/blog/optimiser-cv-ats-2026) plutôt que quarante sur un texte que personne n’ouvrira.",
    },
    {
      type: 'h2',
      text: 'La structure en quatre paragraphes',
      id: 'structure-quatre-paragraphes',
    },
    {
      type: 'p',
      text: "Une lettre tech efficace fait 180 à 250 mots, soit une page à moitié remplie. Elle se lit en quarante secondes. Quatre paragraphes, un rôle chacun, aucune transition décorative.",
    },
    {
      type: 'h3',
      text: 'Paragraphe 1 — l’accroche spécifique',
    },
    {
      type: 'p',
      text: "Tu cites un élément que seul quelqu’un ayant regardé l’entreprise peut connaître : un produit, une stack, une annonce de levée, un problème public. Exemple de phrase type : « Votre migration de l’API publique vers GraphQL, annoncée en septembre, ressemble à ce que j’ai fait chez… ». Si tu peux remplacer le nom de l’entreprise par un autre sans changer la phrase, l’accroche est mauvaise.",
    },
    {
      type: 'h3',
      text: 'Paragraphe 2 — la preuve technique chiffrée',
    },
    {
      type: 'p',
      text: "Un fait, un chiffre, une conséquence. « Réduction du temps de build de 14 à 4 minutes sur une monorepo de 9 services » vaut mieux que « passionné par la performance ». Le chiffre n’a pas besoin d’être spectaculaire : il doit être vérifiable en entretien, parce qu’on te le demandera.",
    },
    {
      type: 'h3',
      text: 'Paragraphe 3 — l’adéquation au poste',
    },
    {
      type: 'p',
      text: "Tu reprends les deux ou trois exigences centrales de l’annonce et tu montres où tu les as déjà exercées. Pas la liste complète des technologies : les trois qui comptent. C’est aussi le paragraphe où tu peux assumer un manque et expliquer comment tu l’as comblé ailleurs, ce qui est souvent plus crédible qu’une prétendue maîtrise totale.",
    },
    {
      type: 'h3',
      text: 'Paragraphe 4 — l’appel à l’action',
    },
    {
      type: 'p',
      text: "Une phrase, concrète : disponibilité pour un échange, lien vers un projet, proposition de faire un exercice technique. Pas de « dans l’attente de votre réponse ». Tu proposes une prochaine étape, tu ne quémandes pas une réponse.",
    },
    {
      type: 'h2',
      text: 'Un exemple court, annoté',
      id: 'exemple-annote',
    },
    {
      type: 'quote',
      text: "Bonjour Madame Perret, votre équipe plateforme migre 40 microservices vers Kubernetes d’ici juin : c’est exactement le chantier que j’ai mené dans mon entreprise actuelle, où j’ai réduit de 30 % le coût d’infrastructure en dix-huit mois. Je suis développeur backend depuis quatre ans, principalement Go et Postgres, et j’ai porté la partie observabilité de cette migration. Votre annonce mentionne un besoin de mentoring : j’ai formé deux juniors sur les pipelines CI. Je peux vous montrer le dépôt et le post-mortem de la migration en visio, mardi ou jeudi.",
      source: 'Lettre de 120 mots, envoyée à une PME de 80 personnes, sans ATS.',
    },
    {
      type: 'ul',
      items: [
        "L’accroche cite un chantier daté et vérifiable, pas une formule de politesse.",
        "La preuve est chiffrée et reliée à un contexte d’entreprise, pas à un projet scolaire.",
        "Le besoin de mentoring est repris depuis l’annonce, ce qui prouve que la lettre a été lue.",
        "L’appel à l’action propose deux créneaux et un livrable concret : dépôt et post-mortem.",
      ],
    },
    {
      type: 'h2',
      text: 'Ce qui est mort en 2026',
      id: 'ce-qui-est-mort',
    },
    {
      type: 'p',
      text: "Certaines formules ont été tellement utilisées qu’elles signalent désormais l’inverse de ce qu’elles prétendent : un candidat qui n’a rien préparé. Les recruteurs tech les repèrent en deux lignes.",
    },
    {
      type: 'ul',
      items: [
        "**La lettre générée par ChatGPT sans réécriture** : vocabulaire lisse, structure identique d’une candidature à l’autre, zéro détail sur l’entreprise. Facile à détecter, et surtout inutile.",
        "**« Je suis passionné depuis toujours »** : une passion sans projet, sans dépôt, sans réalisation n’est pas une preuve, c’est une déclaration.",
        "**La répétition du CV en prose** : si ta lettre liste tes expériences, elle n’apporte aucune information nouvelle.",
        "**Les formules de politesse lourdes** : trois lignes pour dire bonjour et trois pour dire au revoir, sur six lignes de contenu, c’est un mauvais ratio.",
        "**Le ton corporate creux** : « acteur incontournable », « synergies », « écosystème dynamique ». Personne ne parle comme ça, et surtout pas en entretien.",
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Une lettre qui pourrait être envoyée à dix entreprises ne vaut rien. Une lettre qui ne peut être envoyée qu’à une seule entreprise vaut une relecture attentive. C’est le seul critère qui compte vraiment.",
    },
    {
      type: 'h2',
      text: 'Comment un ATS lit ta lettre',
      id: 'comment-un-ats-lit-ta-lettre',
    },
    {
      type: 'p',
      text: "Techniquement, un ATS ne « lit » pas une lettre comme un humain. Il l’indexe. Dans la majorité des plateformes, le texte est stocké dans un champ séparé, attaché au candidat, et devient cherchable par mots-clés. Certains systèmes l’ignorent complètement pour le scoring, d’autres l’ajoutent au calcul de correspondance, souvent avec un poids faible face au CV.",
    },
    {
      type: 'p',
      text: "Deux conséquences pratiques. D’abord, si tu écris une lettre, place les termes exacts de l’annonce — intitulé du poste, technologies, séniorité — dans le premier paragraphe : c’est la zone la plus susceptible d’être indexée. Ensuite, évite les tableaux, les colonnes et les images dans le fichier : un PDF en deux colonnes peut sortir en texte illisible dans l’extraction. Un simple paragraphe aéré reste le format le plus robuste.",
    },
    {
      type: 'p',
      text: "Pour la partie CV, la logique est plus stricte et mérite d’être traitée à part : voir [comment fonctionne le score ATS](/blog/score-ats-comment-calcule).",
    },
    {
      type: 'h2',
      text: 'Ce qui marche, ce qui tue',
      id: 'ce-qui-marche-ce-qui-tue',
    },
    {
      type: 'table',
      caption: 'Comparaison des choix éditoriaux dans une lettre tech',
      headers: ['Ce qui marche', 'Ce qui tue'],
      rows: [
        ['Un fait précis sur l’entreprise', 'Une phrase copiable sur n’importe quelle entreprise'],
        ['Un résultat chiffré et attribuable', 'Une liste de technologies sans contexte'],
        ['Un lien vers un dépôt ou une démo', '« Portfolio disponible sur demande »'],
        ['180 à 250 mots, une page à moitié', 'Une page pleine, marges nulles'],
        ['Le vocabulaire exact de l’annonce', 'Des synonymes approximatifs'],
        ['Une proposition de prochaine étape', '« Dans l’attente de votre réponse »'],
      ],
    },
    {
      type: 'h2',
      text: 'Checklist avant envoi',
      id: 'checklist-avant-envoi',
    },
    {
      type: 'ul',
      items: [
        "Le nom de l’entreprise et celui du destinataire sont corrects, sans faute.",
        "Le premier paragraphe contient un élément que tu n’as pas pu inventer sans recherche.",
        "Au moins un chiffre ou un livrable vérifiable apparaît dans les deux premiers paragraphes.",
        "Les trois exigences principales de l’annonce sont couvertes, pas les quinze.",
        "Le texte fait moins de 250 mots et tient sur une demi-page.",
        "Tu as relu à voix haute : chaque phrase peut être dite en entretien sans rougir.",
      ],
    },
    {
      type: 'p',
      text: "Une fois la lettre envoyée, l’étape suivante se prépare maintenant : la méthode d’entretien en cinq étapes est détaillée [ici](/blog/entretien-technique-5-etapes), et la discussion de rémunération [là](/blog/negocier-salaire-tech). Si tu veux générer un CV qui tient la comparaison, [Prospecho](/) aligne ton CV sur les mots-clés de l’offre en gardant ton parcours réel.",
    },
  ],
  faq: [
    {
      q: 'Faut-il encore écrire une lettre de motivation en 2026 ?',
      a: "Oui, mais seulement quand elle apporte une information absente du CV : candidature spontanée, PME ou startup sans ATS, reconversion à expliquer. Pour une candidature en un clic ou un grand groupe qui filtre par ATS, elle est rarement lue et ne mérite pas quarante minutes de travail.",
    },
    {
      q: 'Quelle longueur pour une lettre de motivation tech ?',
      a: "180 à 250 mots, soit une demi-page. Quatre paragraphes : accroche spécifique, preuve chiffrée, adéquation aux exigences du poste, appel à l’action. Au-delà, le recruteur lit en diagonale et retient moins qu’avec un texte court.",
    },
    {
      q: 'Une lettre écrite avec ChatGPT est-elle repérée ?',
      a: "Souvent, oui : structure identique d’une candidature à l’autre, vocabulaire générique, aucun détail propre à l’entreprise. Le problème n’est pas l’outil mais l’absence de réécriture. Une lettre générée puis personnalisée avec un fait précis et un chiffre réel passe très bien.",
    },
    {
      q: 'Un ATS lit-il vraiment la lettre de motivation ?',
      a: "Il l’indexe plus qu’il ne la lit. Le texte est stocké dans un champ séparé et devient cherchable ; son poids dans le score est généralement faible face au CV. Place donc les termes exacts de l’annonce tôt dans le texte et évite les mises en page en colonnes.",
    },
    {
      q: 'Peut-on envoyer la même lettre à plusieurs entreprises ?',
      a: "Non, si tu veux qu’elle serve. Le seul critère utile est qu’elle ne puisse pas être envoyée ailleurs : un fait propre à l’entreprise, un besoin identifié, une raison crédible de postuler là. Sans cela, mieux vaut ne pas en envoyer du tout.",
    },
  ],
};

export default article;
