import type { Article } from '../../src/blog/types';

const article: Article = {
  meta: {
    slug: 'negocier-salaire-tech',
    title: 'Négocier son salaire tech : fourchettes réelles par région et niveau',
    description:
      "Fourchettes de salaire brut en France et en Suisse par ville et par niveau, TJM freelance et méthode de négociation en 5 étapes avec les phrases qui marchent.",
    excerpt:
      "Des chiffres par ville et par niveau, l'écart réel France-Suisse, et cinq étapes pour ne pas laisser 5 000 € sur la table.",
    answer:
      "En France, un développeur junior touche 32 000 à 45 000 € brut annuel, un confirmé 38 000 à 58 000 €, un senior 46 000 à 72 000 €. En Suisse, compte 70 000 à 95 000 CHF en junior et 108 000 à 145 000 CHF en senior, à comparer au coût de la vie local.",
    date: '2026-10-13',
    updated: '2026-10-23',
    category: 'Salaire',
    readingTime: '9 min',
    keywords: [
      'salaire développeur',
      'salaire tech 2026',
      'négocier salaire développeur',
      'salaire data analyst',
      'salaire devops',
      'salaire développeur suisse',
      'TJM freelance développeur',
    ],
    related: ['reconversion-tech-2026', 'entretien-technique-5-etapes', 'job-tech-sans-diplome'],
  },
  blocks: [
    {
      type: 'p',
      text: "La négociation de salaire est l'exercice où les candidats tech perdent le plus d'argent sans s'en rendre compte. Un écart de 4 000 € obtenu à l'embauche se propage sur toutes les augmentations suivantes, calculées en pourcentage du salaire actuel. Voici des fourchettes utilisables, l'écart réel France-Suisse et une méthode en cinq étapes.",
    },
    {
      type: 'h2',
      text: 'Les fourchettes en France, par ville et par niveau',
      id: 'fourchettes-france',
    },
    {
      type: 'p',
      text: "Ces chiffres sont des ordres de grandeur 2026 pour le secteur privé, hors primes exceptionnelles et hors actions. Une startup early stage paiera 10 à 15 % de moins en fixe, avec de l'equity en compensation théorique ; une banque ou un grand groupe industriel paiera 5 à 10 % de plus, avec moins de télétravail.",
    },
    {
      type: 'table',
      caption: "Salaire brut annuel en France, en milliers d'euros (fourchettes observées 2026)",
      headers: ['Profil', 'Paris', 'Lyon', 'Bordeaux', 'Lille', 'Remote'],
      rows: [
        ['Dev junior (0-2 ans)', '38-45', '32-38', '31-37', '30-36', '33-40'],
        ['Dev confirmé (3-5 ans)', '45-58', '38-48', '37-46', '36-45', '40-52'],
        ['Dev senior (6-9 ans)', '58-72', '48-60', '46-58', '45-56', '52-68'],
        ['Lead / principal (10+ ans)', '72-95', '60-78', '58-74', '56-72', '65-88'],
        ['Data analyst junior', '36-43', '31-37', '30-36', '29-35', '32-39'],
        ['Data engineer / scientist senior', '55-70', '46-58', '44-56', '43-54', '50-65'],
        ['DevOps confirmé (3-5 ans)', '46-60', '39-50', '38-48', '37-47', '42-55'],
        ['DevOps senior (6-9 ans)', '60-75', '50-62', '48-60', '47-58', '55-70'],
      ],
    },
    {
      type: 'p',
      text: "Trois remarques. L'écart Paris-province s'est resserré autour de 12 à 18 % sur les juniors, contre 20 à 25 % il y a quelques années, parce que le télétravail a partiellement uniformisé le marché. La colonne remote n'est pas un salaire parisien déguisé : beaucoup d'entreprises calent leur grille sur le coût de la vie local. Enfin, les fourchettes hautes supposent une entreprise qui a besoin de ta compétence précise, pas un recrutement de volume.",
    },
    {
      type: 'h2',
      text: 'Les fourchettes en Suisse : lire un salaire en CHF',
      id: 'fourchettes-suisse',
    },
    {
      type: 'p',
      text: "En Suisse, on parle en CHF brut annuel, souvent sur treize mois. Le treizième mois n'est pas automatique partout : vérifie s'il est contractuel ou discrétionnaire. Les écarts entre cantons sont réels, mais moins violents qu'entre Paris et une ville moyenne française.",
    },
    {
      type: 'table',
      caption: 'Salaire brut annuel en Suisse, en milliers de CHF (hors 13e mois, ordres de grandeur 2026)',
      headers: ['Profil', 'Genève', 'Lausanne', 'Zurich'],
      rows: [
        ['Dev junior (0-2 ans)', '75-90', '70-85', '78-95'],
        ['Dev confirmé (3-5 ans)', '90-115', '85-108', '95-120'],
        ['Dev senior (6-9 ans)', '115-140', '108-132', '120-145'],
        ['Lead / principal (10+ ans)', '140-175', '132-165', '145-180'],
        ['Data senior', '115-140', '108-132', '120-145'],
        ['DevOps senior', '118-142', '110-135', '122-148'],
      ],
    },
    {
      type: 'h2',
      text: "Pourquoi l'écart France-Suisse est plus petit qu'il n'y paraît",
      id: 'ecart-france-suisse',
    },
    {
      type: 'p',
      text: "Un salaire de 120 000 CHF à Genève ressemble à 128 000 € au taux de change. Face à 62 000 € à Lyon, le ratio brut donne envie de partir. Le net et le coût de la vie corrigent largement cette impression.",
    },
    {
      type: 'ul',
      items: [
        "**Charges salariales** : environ 20 à 23 % du brut en France pour un cadre, contre 11 à 13 % en Suisse. Le net suisse représente donc une part plus grande du brut.",
        "**Assurance maladie** : la LAMal est payée par le salarié, souvent 350 à 600 CHF par mois pour une famille, avec une franchise à ta charge. En France, elle est déjà prélevée.",
        "**Logement** : à Genève, un 3 pièces correct se loue entre 2 500 et 3 800 CHF par mois. C'est le premier poste qui absorbe l'écart de salaire.",
        "**Le vrai gain** : 20 à 35 % de pouvoir d'achat réel, pas 80 %. Célibataire sans enfant, l'écart est net ; famille avec deux enfants en crèche, il peut devenir négligeable.",
      ],
    },
    {
      type: 'callout',
      title: 'À retenir',
      text: "Ne compare jamais deux salaires bruts dans deux pays. Compare ce qui reste après impôts, assurance maladie, logement et transport, pour la même situation familiale. Un départ en Suisse se joue sur le net disponible, pas sur le chiffre du contrat.",
    },
    {
      type: 'h2',
      text: 'Ce qui se négocie en dehors du salaire',
      id: 'negocier-hors-salaire',
    },
    {
      type: 'p',
      text: "Quand l'entreprise bloque sur le fixe, il reste souvent de la marge ailleurs. Ces éléments ne remplacent pas une augmentation, mais ils ont une valeur réelle.",
    },
    {
      type: 'ul',
      items: [
        "**Télétravail** : deux jours par semaine économisent 1 000 à 2 500 € par an en transport et en repas. Fais-le écrire dans le contrat, pas dans un accord d'équipe.",
        "**Formation** : une certification cloud ou un budget conférence de 1 500 à 3 000 € par an se négocie plus facilement qu'une augmentation.",
        "**Matériel** : portable, écran, budget bureau. Un one-shot de 1 500 à 3 000 €, souvent accepté sans discussion.",
        "**Prime variable** : 5 à 15 % du fixe. Vérifie les critères réels et l'historique de versement sur deux ans.",
        "**Actions ou BSPCE** : demande le nombre de titres, la valorisation de la dernière levée et le calendrier de vesting. « 0,1 % du capital » n'est pas un chiffre.",
        "**Date d'augmentation** : une clause de revoyure à six mois vaut mieux qu'une promesse verbale à dix-huit mois.",
      ],
    },
    {
      type: 'h2',
      text: 'Le TJM quand tu passes en freelance',
      id: 'tjm-freelance',
    },
    {
      type: 'p',
      text: "Le taux journalier moyen n'est pas un salaire : il doit couvrir les charges, les périodes sans mission, la formation, le matériel et la prospection. La règle utile : ton TJM doit valoir environ deux fois le salaire journalier brut visé en CDI.",
    },
    {
      type: 'ul',
      items: [
        "**Junior à confirmé (1 à 4 ans)** : 400 à 650 € par jour selon la techno et la région. En dessous de 400 €, la mission ne couvre pas les intercontrats.",
        "**Senior (5 à 9 ans)** : 600 à 900 € par jour. Un profil spécialisé cloud, sécurité ou data platform se situe dans le haut de la fourchette.",
        "**Expert / architecte** : 900 à 1 300 € par jour sur des missions longues, davantage sur des interventions courtes.",
        "**À provisionner** : 25 à 35 % de charges et de cotisations, 10 à 15 % de temps non facturé, et trois mois de trésorerie.",
      ],
    },
    {
      type: 'h2',
      text: 'La méthode en 5 étapes',
      id: 'methode-5-etapes',
    },
    {
      type: 'ol',
      items: [
        "**1. Recherche** : collecte cinq à huit points de comparaison réels. Demandes de salaire dans les annonces, échanges avec des pairs, enquêtes publiques. Un chiffre isolé n'est pas une donnée.",
        "**2. Fourchette** : fixe trois nombres avant l'entretien. Le plancher, la cible et l'étirement. Sans plancher écrit, tu accepteras n'importe quoi à la fin d'un processus fatigant.",
        "**3. Ancrage** : laisse l'entreprise donner le premier chiffre. Si elle insiste, donne ta fourchette entière, jamais un chiffre unique : il deviendrait ton plafond.",
        "**4. Silence** : après ta demande, tais-toi. Le réflexe de meubler le silence fait baisser les salaires. Cinq secondes de pause ne sont pas un affront.",
        "**5. Closing** : fais confirmer par écrit le fixe, le variable, la date d'augmentation, le télétravail et la date de début. Un accord verbal n'est pas un accord.",
      ],
    },
    {
      type: 'h2',
      text: 'Trois phrases à utiliser en entretien',
      id: 'phrases-utiles',
    },
    {
      type: 'ul',
      items: [
        "**Prétentions demandées trop tôt** : « Je préfère comprendre le périmètre du poste avant de donner un chiffre. Sur ce type de poste, quelle est la fourchette prévue par votre grille ? »",
        "**Offre sous ta cible** : « Le poste m'intéresse vraiment. Sur le fixe, j'étais positionné autour de 52 000 € au vu de mon expérience. Y a-t-il une marge, ou peut-on travailler sur le variable et la revoyure à six mois ? »",
        "**Salaire actuel demandé** : « Mon salaire actuel correspond à un périmètre plus étroit. Ce qui m'intéresse ici, c'est la valeur du poste et le marché sur ce niveau de responsabilité, autour de 55 000 à 60 000 €. »",
      ],
    },
    {
      type: 'h2',
      text: "Les erreurs qui coûtent des milliers d'euros",
      id: 'erreurs',
    },
    {
      type: 'ul',
      items: [
        "**Donner un chiffre trop tôt** : au premier appel, tu négocies à l'aveugle et tu fixes toi-même ton plafond.",
        "**Annoncer une fourchette trop large** : « entre 35 et 55 » signifie 35 pour le recruteur. Une fourchette utile fait 10 à 15 % d'écart.",
        "**Négocier après avoir signé** : une fois la promesse d'embauche signée, tu n'as plus de levier.",
        "**Accepter le premier chiffre par peur** : une entreprise qui retire une offre pour 3 000 € de plus n'était pas un bon employeur.",
        "**Comparer un brut suisse à un brut français** : sans le net, l'assurance maladie et le logement, la comparaison est fausse.",
      ],
    },
    {
      type: 'p',
      text: "La meilleure position de négociation reste d'avoir une autre option : un processus en cours ailleurs change ton ton et ta capacité à dire non. Si tu débutes, lis d'abord [le parcours réaliste pour entrer dans la tech](/blog/reconversion-tech-2026) et prépare [l'entretien technique](/blog/entretien-technique-5-etapes). Pour arriver avec un CV aligné sur l'offre, [Prospecho](/) repositionne ton parcours sur les mots-clés du poste.",
    },
  ],
  faq: [
    {
      q: 'Quel salaire pour un développeur junior en 2026 ?',
      a: "En France, compte 30 000 à 40 000 € brut annuel en province et 38 000 à 45 000 € à Paris, hors primes. En Suisse, la fourchette observée se situe entre 70 000 et 95 000 CHF brut annuel selon le canton. Ces montants varient selon la techno, la taille de l'entreprise et le secteur.",
    },
    {
      q: 'Combien gagne un développeur senior en France ?',
      a: "Entre 46 000 et 72 000 € brut annuel selon la ville et l'entreprise, avec un haut de fourchette à Paris et dans les grands groupes technologiques. Un lead ou un principal dépasse souvent 72 000 €, jusqu'à 95 000 € sur des postes à forte responsabilité. Les profils cloud, sécurité et data platform se situent dans le haut de ces fourchettes.",
    },
    {
      q: 'Faut-il dire son salaire actuel en entretien ?',
      a: "Rien ne t'oblige à donner un chiffre précis, surtout si ton poste actuel a un périmètre différent. Tu peux recadrer sur la valeur du poste : « mon salaire actuel correspond à un périmètre plus étroit, je me situe autour de X pour ce niveau de responsabilité ». Si un formulaire l'exige, donne une fourchette incluant ta cible.",
    },
    {
      q: 'Quel TJM pour un développeur freelance ?',
      a: "400 à 650 € par jour pour un junior à confirmé, 600 à 900 € pour un senior, et 900 à 1 300 € pour un expert ou un architecte. Ces montants dépendent de la techno, de la durée de mission et du canal de facturation. Il faut provisionner 25 à 35 % de charges et 10 à 15 % de temps non facturé.",
    },
    {
      q: 'Un salaire suisse est-il vraiment deux fois plus élevé ?',
      a: "Le brut peut être deux fois supérieur à celui d'une grande ville française, mais le gain réel de pouvoir d'achat se situe plutôt entre 20 et 35 %. L'assurance maladie, le logement et la garde d'enfants absorbent une partie de l'écart. La comparaison doit se faire sur le net disponible, à situation familiale identique.",
    },
  ],
};

export default article;
