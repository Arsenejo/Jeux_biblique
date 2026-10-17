// Données Pan-Bibliques et Thématiques pour Le Grand Pèlerinage de la Bible

export const BIBLE_BOOKS = [
  // ANCIEN TESTAMENT
  { id: "gen", nom: "Genèse", testament: "AT", section: "Pentateuque", chapitres: 50 },
  { id: "exo", nom: "Exode", testament: "AT", section: "Pentateuque", chapitres: 40 },
  { id: "lev", nom: "Lévitique", testament: "AT", section: "Pentateuque", chapitres: 27 },
  { id: "nom", nom: "Nombres", testament: "AT", section: "Pentateuque", chapitres: 36 },
  { id: "deu", nom: "Deutéronome", testament: "AT", section: "Pentateuque", chapitres: 34 },
  { id: "jos", nom: "Josué", testament: "AT", section: "Histoire", chapitres: 24 },
  { id: "jug", nom: "Juges", testament: "AT", section: "Histoire", chapitres: 21 },
  { id: "rut", nom: "Ruth", testament: "AT", section: "Histoire", chapitres: 4 },
  { id: "1sa", nom: "1 Samuel", testament: "AT", section: "Histoire", chapitres: 31 },
  { id: "2sa", nom: "2 Samuel", testament: "AT", section: "Histoire", chapitres: 24 },
  { id: "1ro", nom: "1 Rois", testament: "AT", section: "Histoire", chapitres: 22 },
  { id: "2ro", nom: "2 Rois", testament: "AT", section: "Histoire", chapitres: 25 },
  { id: "psa", nom: "Psaumes", testament: "AT", section: "Poésie & Sagesse", chapitres: 150 },
  { id: "pro", nom: "Proverbes", testament: "AT", section: "Poésie & Sagesse", chapitres: 31 },
  { id: "esa", nom: "Ésaïe", testament: "AT", section: "Prophètes", chapitres: 66 },
  { id: "jer", nom: "Jérémie", testament: "AT", section: "Prophètes", chapitres: 52 },

  // NOUVEAU TESTAMENT
  { id: "mat", nom: "Matthieu", testament: "NT", section: "Évangiles", chapitres: 28 },
  { id: "mar", nom: "Marc", testament: "NT", section: "Évangiles", chapitres: 16 },
  { id: "luc", nom: "Luc", testament: "NT", section: "Évangiles", chapitres: 24 },
  { id: "jea", nom: "Jean", testament: "NT", section: "Évangiles", chapitres: 21 },
  { id: "act", nom: "Actes", testament: "NT", section: "Histoire", chapitres: 28 },
  { id: "rom", nom: "Romains", testament: "NT", section: "Épîtres", chapitres: 16 },
  { id: "1co", nom: "1 Corinthiens", testament: "NT", section: "Épîtres", chapitres: 16 },
  { id: "2co", nom: "2 Corinthiens", testament: "NT", section: "Épîtres", chapitres: 13 },
  { id: "gal", nom: "Galates", testament: "NT", section: "Épîtres", chapitres: 6 },
  { id: "eph", nom: "Éphésiens", testament: "NT", section: "Épîtres", chapitres: 6 },
  { id: "phi", nom: "Philippiens", testament: "NT", section: "Épîtres", chapitres: 4 },
  { id: "col", nom: "Colossiens", testament: "NT", section: "Épîtres", chapitres: 4 },
  { id: "1th", nom: "1 Thessaloniciens", testament: "NT", section: "Épîtres", chapitres: 5 },
  { id: "jac", nom: "Jacques", testament: "NT", section: "Épîtres", chapitres: 5 },
  { id: "1pi", nom: "1 Pierre", testament: "NT", section: "Épîtres", chapitres: 5 },
  { id: "1je", nom: "1 Jean", testament: "NT", section: "Épîtres", chapitres: 5 },
  { id: "apo", nom: "Apocalypse", testament: "NT", section: "Révélation", chapitres: 22 }
];

// LES 7 GRANDES ÉPOQUES BIBLIQUES (CARTE PAN-BIBLIQUE)
export const BIBLE_EPOCHS = [
  {
    id: "racines",
    nom: "Les Racines",
    livres: "Genèse à Deutéronome",
    icon: "🌱",
    color: "#159447",
    tagline: "La Création, l'Alliance et la promesse"
  },
  {
    id: "sagesse",
    nom: "Louange & Sagesse",
    livres: "Psaumes, Proverbes, Job",
    icon: "🕊️",
    color: "#0756a5",
    tagline: "Le repos de l'âme et la confiance"
  },
  {
    id: "courage",
    nom: "Courage & Foi",
    livres: "Josué, Ruth, David",
    icon: "🛡️",
    color: "#8a5cf6",
    tagline: "Victoires face aux géants et fidélité"
  },
  {
    id: "prophetes",
    nom: "Voix d'Espérance",
    livres: "Ésaïe, Daniel, Jonas",
    icon: "🔥",
    color: "#f97316",
    tagline: "L'attente du Prince de la Paix"
  },
  {
    id: "evangiles",
    nom: "La Bonne Nouvelle",
    livres: "Matthieu, Marc, Luc, Jean",
    icon: "☀️",
    color: "#f4b942",
    tagline: "La vie, la grâce et la résurrection de Jésus"
  },
  {
    id: "eglise",
    nom: "L'Église en Marche",
    livres: "Actes & Épîtres de Paul",
    icon: "⛵",
    color: "#0d9488",
    tagline: "L'amour fraternel et la vie de l'Esprit"
  },
  {
    id: "esperance",
    nom: "L'Espérance Éternelle",
    livres: "Apocalypse",
    icon: "👑",
    color: "#e11d48",
    tagline: "La victoire finale et la Cité de Paix"
  }
];

export const BIBLE_CHAPTERS = {
  "gen-1": {
    titre: "La création du monde",
    livre: "Genèse",
    chapitre: 1,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "Au commencement, Dieu créa les cieux et la terre.", cle: true },
      { num: 2, texte: "La terre était informe et vide : il y avait des ténèbres à la surface de l'abîme, et l'Esprit de Dieu se mouvait au-dessus des eaux." },
      { num: 3, texte: "Dieu dit : Que la lumière soit ! Et la lumière fut.", cle: true },
      { num: 4, texte: "Dieu vit que la lumière était bonne ; et Dieu sépara la lumière d'avec les ténèbres." },
      { num: 5, texte: "Dieu appela la lumière jour, et il appela les ténèbres nuit. Ainsi, il y eut un soir, et il y eut un matin : ce fut le premier jour." }
    ]
  },
  "jea-1": {
    titre: "La Parole faite chair",
    livre: "Jean",
    chapitre: 1,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.", cle: true },
      { num: 2, texte: "Elle était au commencement avec Dieu." },
      { num: 3, texte: "Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle." },
      { num: 4, texte: "En elle était la vie, et la vie était la lumière des hommes.", cle: true },
      { num: 5, texte: "La lumière luit dans les ténèbres, et les ténèbres ne l'ont point reçue." },
      { num: 14, texte: "Et la Parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité.", cle: true }
    ]
  },
  "jea-3": {
    titre: "Jésus et Nicodème",
    livre: "Jean",
    chapitre: 3,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Mais il y eut un homme d'entre les pharisiens, nommé Nicodème, un chef des Juifs," },
      { num: 2, texte: "qui vint, lui, de nuit, à Jésus, et lui dit : Rabbi, nous savons que tu es un docteur venu de Dieu ; car personne ne peut faire ces miracles que tu fais, si Dieu n'est avec lui." },
      { num: 3, texte: "Jésus lui répondit : En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu." },
      { num: 16, texte: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", cle: true },
      { num: 17, texte: "Dieu, en effet, n'a pas envoyé son Fils dans le monde pour qu'il juge le monde, mais pour que le monde soit sauvé par lui." }
    ]
  },
  "psa-23": {
    titre: "Le Berger et le Guide",
    livre: "Psaumes",
    chapitre: 23,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "L'Éternel est mon berger : je ne manquerai de rien.", cle: true },
      { num: 2, texte: "Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles." },
      { num: 3, texte: "Il restaure mon âme, Il me conduit dans les sentiers de la justice, À cause de son nom." },
      { num: 4, texte: "Quand je marche dans la vallée de l'ombre de la mort, Je ne crains aucun mal, car tu es avec moi.", cle: true },
      { num: 6, texte: "Oui, le bonheur et la grâce m'accompagneront tous les jours de ma vie, et j'habiterai dans la maison de l'Éternel jusqu'à la fin de mes jours." }
    ]
  },
  "apo-21": {
    titre: "La Nouvelle Jérusalem",
    livre: "Apocalypse",
    chapitre: 21,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Puis je vis un nouveau ciel et une nouvelle terre ; car le premier ciel et la première terre avaient disparu." },
      { num: 3, texte: "Et j'entendis du trône une forte voix qui disait : Voici le tabernacle de Dieu avec les hommes ! Il habitera avec eux, et ils seront son peuple.", cle: true },
      { num: 4, texte: "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur.", cle: true },
      { num: 6, texte: "Et il me dit : C'est fait ! Je suis l'alpha et l'oméga, le commencement et la fin. À celui qui a soif, je donnerai de la source de l'eau de la vie, gratuitement.", cle: true }
    ]
  },
  "exo-20": {
    titre: "Les Dix Paroles d'Alliance",
    livre: "Exode",
    chapitre: 20,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "Alors Dieu prononça toutes ces paroles, en disant :" },
      { num: 2, texte: "Je suis l'Éternel, ton Dieu, qui t'ai fait sortir du pays d'Égypte, de la maison de servitude.", cle: true },
      { num: 3, texte: "Tu n'auras pas d'autres dieux devant ma face.", cle: true },
      { num: 12, texte: "Honore ton père et ta mère, afin que tes jours se prolongent dans le pays que l'Éternel, ton Dieu, te donne.", cle: true },
      { num: 13, texte: "Tu ne tueras point." }
    ]
  },
  "psa-91": {
    titre: "La Protection du Très-Haut",
    livre: "Psaumes",
    chapitre: 91,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "Celui qui demeure sous l'abri du Très-Haut repose à l'ombre du Tout-Puissant.", cle: true },
      { num: 2, texte: "Je dis à l'Éternel : Mon refuge et ma forteresse, mon Dieu en qui je me confie !", cle: true },
      { num: 4, texte: "Il te couvrira de ses plumes, et tu trouveras un refuge sous ses ailes ; sa fidélité est un bouclier et une cuirasse." },
      { num: 11, texte: "Car il ordonnera à ses anges de te garder dans toutes tes voies.", cle: true }
    ]
  },
  "rom-8": {
    titre: "La Vie dans l'Esprit & Plus que Vainqueurs",
    livre: "Romains",
    chapitre: 8,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Il n'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ.", cle: true },
      { num: 28, texte: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.", cle: true },
      { num: 31, texte: "Si Dieu est pour nous, qui sera contre nous ?", cle: true },
      { num: 37, texte: "Mais dans toutes ces choses nous sommes plus que vainqueurs par celui qui nous a aimés.", cle: true },
      { num: 38, texte: "Car j'ai l'assurance que ni la mort ni la vie ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ.", cle: true }
    ]
  },
  "1co-13": {
    titre: "Le Cantique de l'Amour",
    livre: "1 Corinthiens",
    chapitre: 13,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Quand je parlerais les langues des hommes et des anges, si je n'ai pas l'amour, je suis un airain qui résonne." },
      { num: 4, texte: "L'amour est patient, il est plein de bonté ; l'amour n'est point envieux ; l'amour ne se vante point, il ne s'enfle point d'orgueil,", cle: true },
      { num: 7, texte: "il excuse tout, il croit tout, il espère tout, il supporte tout.", cle: true },
      { num: 8, texte: "L'amour ne périt jamais.", cle: true },
      { num: 13, texte: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, l'amour ; mais la plus grande de ces choses, c'est l'amour.", cle: true }
    ]
  }
};

// ÉTAPES DU SENTIER PAR ÉPOQUE
export const EPOCH_STAGES = {
  racines: [
    {
      id: 1,
      titre: "La Création du monde",
      ref: "Genèse 1:1",
      x: 15,
      y: 80,
      type: "order",
      consigne: "Remets les mots dans le bon ordre pour reconstruire ce fondement de la foi.",
      motsBanque: ["Au commencement", "Dieu", "créa", "les cieux", "et", "la terre."],
      motsCorrects: ["Au commencement", "Dieu", "créa", "les cieux", "et", "la terre."],
      explication: "Dieu est la source de toute vie et de toute beauté. Tout commencement sous son regard porte la promesse d'un renouveau.",
      recompense: { xp: 25, perles: 1 }
    },
    {
      id: 2,
      titre: "La Lumière dans la nuit",
      ref: "Genèse 1:3",
      x: 32,
      y: 65,
      type: "qcm",
      consigne: "Quelle est la première parole prononcée par Dieu dans la Bible ?",
      options: [
        { text: "« Que la lumière soit ! »", correct: true },
        { text: "« Que la terre fleurisse ! »", correct: false },
        { text: "« Que les étoiles brillent ! »", correct: false }
      ],
      explication: "Avant même toute création matérielle, Dieu apporte la clarté. Sa Parole a le pouvoir d'illuminer nos obscurités les plus profondes.",
      recompense: { xp: 30, perles: 1 }
    },
    {
      id: 3,
      titre: "L'Arche et l'Arc-en-ciel",
      ref: "Genèse 9:13",
      x: 50,
      y: 75,
      type: "cloze",
      consigne: "Complète le signe de l'alliance de paix que Dieu établit avec la terre.",
      phraseAvant: "J'ai placé mon ",
      phraseApres: " dans la nue, et il servira de signe d'alliance.",
      options: ["arc-en-ciel", "soleil", "flambeau"],
      motCorrect: "arc-en-ciel",
      explication: "L'arc-en-ciel est le rappel vivant de la miséricorde de Dieu qui veille sur toute sa création.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 4,
      titre: "La Promesse à Abraham",
      ref: "Genèse 12:2",
      x: 68,
      y: 50,
      type: "order",
      consigne: "Reconstruis la promesse faite au père de la foi.",
      motsBanque: ["Je te bénirai,", "et tu seras", "une source", "de bénédiction."],
      motsCorrects: ["Je te bénirai,", "et tu seras", "une source", "de bénédiction."],
      explication: "Dieu nous bénit afin que nous soyons nous-mêmes une bénédiction pour ceux qui nous entourent.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 5,
      titre: "L'Éternel est mon étendard",
      ref: "Exode 17:15",
      x: 85,
      y: 25,
      type: "qcm",
      consigne: "Quel nom Moïse donna-t-il à l'autel après la victoire ?",
      options: [
        { text: "Yahvé Nissi (L'Éternel mon étendard)", correct: true },
        { text: "Yahvé Shalom (L'Éternel ma paix)", correct: false },
        { text: "Yahvé Jiré (L'Éternel pourvoira)", correct: false }
      ],
      explication: "Dans nos combats quotidiens, notre bannière et notre force reposent en Dieu seul.",
      recompense: { xp: 50, perles: 2 }
    }
  ],

  sagesse: [
    {
      id: 101,
      titre: "Le Berger bienveillant",
      ref: "Psaume 23:1",
      x: 20,
      y: 78,
      type: "order",
      consigne: "Reconstruis cette prière de confiance intemporelle.",
      motsBanque: ["L'Éternel", "est", "mon berger :", "je ne manquerai", "de rien."],
      motsCorrects: ["L'Éternel", "est", "mon berger :", "je ne manquerai", "de rien."],
      explication: "Dans les joies comme dans les vallées d'ombre, le Seigneur prend soin de nous avec tendresse.",
      recompense: { xp: 30, perles: 1 }
    },
    {
      id: 102,
      titre: "À l'abri du Très-Haut",
      ref: "Psaume 91:1",
      x: 45,
      y: 65,
      type: "cloze",
      consigne: "Où repose celui qui cherche la présence de Dieu ?",
      phraseAvant: "Celui qui demeure sous l'abri du Très-Haut repose à l'",
      phraseApres: " du Tout-Puissant.",
      options: ["ombre", "abri", "amour"],
      motCorrect: "ombre",
      explication: "La présence divine est un refuge paisible contre l'anxiété et les tempêtes du monde.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 103,
      titre: "Une lampe sur mon sentier",
      ref: "Psaume 119:105",
      x: 75,
      y: 35,
      type: "qcm",
      consigne: "À quoi le psalmiste compare-t-il la Parole de Dieu ?",
      options: [
        { text: "À une lampe à nos pieds et une lumière sur notre sentier", correct: true },
        { text: "À un fleuve puissant", correct: false },
        { text: "À une montagne inébranlable", correct: false }
      ],
      explication: "La Bible n'éclaire pas d'un coup tout l'avenir, mais éclaire fidèlement le prochain pas que nous devons poser.",
      recompense: { xp: 45, perles: 2 }
    }
  ],

  evangiles: [
    {
      id: 201,
      titre: "La Parole éternelle",
      ref: "Jean 1:1",
      x: 20,
      y: 78,
      type: "order",
      consigne: "Reconstruis l'ouverture lumineuse de l'Évangile selon Jean.",
      motsBanque: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
      motsCorrects: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
      explication: "Jésus-Christ est le Verbe éternel en qui réside la vie et la véritable lumière des hommes.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 202,
      titre: "L'Amour infini du Père",
      ref: "Jean 3:16",
      x: 50,
      y: 60,
      type: "qcm",
      consigne: "Pour quelle raison Dieu a-t-il donné son Fils unique au monde ?",
      options: [
        { text: "Par amour, pour que quiconque croit ait la vie éternelle", correct: true },
        { text: "Pour juger et condamner le monde", correct: false },
        { text: "Pour éprouver la force des hommes", correct: false }
      ],
      explication: "Le cœur de l'Évangile est un amour pur, sans condition. Jésus est venu pour sauver et restaurer.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 203,
      titre: "Le Pain de Vie",
      ref: "Jean 6:35",
      x: 80,
      y: 30,
      type: "cloze",
      consigne: "Complète la promesse que Jésus fait à ceux qui viennent à Lui.",
      phraseAvant: "Je suis le pain de vie. Celui qui vient à moi n'aura jamais ",
      phraseApres: ".",
      options: ["faim", "peur", "soif"],
      motCorrect: "faim",
      explication: "Jésus comble le vide le plus profond de notre cœur et nous rassasie d'une paix durable.",
      recompense: { xp: 55, perles: 3 }
    },
    {
      id: 204,
      titre: "Le Chemin, la Vérité, la Vie",
      ref: "Jean 14:6",
      x: 90,
      y: 15,
      type: "order",
      consigne: "Reconstruis cette affirmation éclatante du Seigneur Jésus.",
      motsBanque: ["Je suis", "le chemin,", "la vérité,", "et la vie.", "Nul ne vient", "au Père", "que par moi."],
      motsCorrects: ["Je suis", "le chemin,", "la vérité,", "et la vie.", "Nul ne vient", "au Père", "que par moi."],
      explication: "Le Christ n'indique pas seulement une route : Il est Lui-même le chemin vivant vers Dieu.",
      recompense: { xp: 60, perles: 3 }
    }
  ],

  courage: [
    {
      id: 301,
      titre: "L'Ordre d'en haut",
      ref: "Josué 1:9",
      x: 20,
      y: 75,
      type: "order",
      consigne: "Reconstruis l'exhortation adressée à Josué au seuil de la terre promise.",
      motsBanque: ["Fortifie-toi", "et prends courage !", "Ne t'effraie point,", "car l'Éternel", "est avec toi."],
      motsCorrects: ["Fortifie-toi", "et prends courage !", "Ne t'effraie point,", "car l'Éternel", "est avec toi."],
      explication: "Notre courage ne repose pas sur notre force humaine, mais sur la présence invincible de Dieu.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 302,
      titre: "David face au géant",
      ref: "1 Samuel 17:45",
      x: 50,
      y: 55,
      type: "qcm",
      consigne: "Au nom de qui le jeune David s'est-il avancé contre Goliath ?",
      options: [
        { text: "Au nom de l'Éternel des armées, le Dieu d'Israël", correct: true },
        { text: "Au nom de l'armée du roi Saül", correct: false },
        { text: "Au nom de sa propre adresse et de sa fronde", correct: false }
      ],
      explication: "La foi renverse les forteresses les plus intimidantes quand Dieu est au centre de notre combat.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 303,
      titre: "La Fidélité de Ruth",
      ref: "Ruth 1:16",
      x: 80,
      y: 30,
      type: "cloze",
      consigne: "Complète le cri de fidélité et d'amour loyal de Ruth envers Naomi.",
      phraseAvant: "Où tu iras j'irai... ton peuple sera mon peuple, et ton ",
      phraseApres: " sera mon Dieu.",
      options: ["Dieu", "berger", "sauveur"],
      motCorrect: "Dieu",
      explication: "L'attachement fraternel véritable reflète l'Alliance éternelle de Dieu avec les humbles.",
      recompense: { xp: 50, perles: 2 }
    }
  ],

  prophetes: [
    {
      id: 401,
      titre: "Le Prince de la Paix",
      ref: "Ésaïe 9:5",
      x: 25,
      y: 75,
      type: "order",
      consigne: "Reconstruis la prophétie annonçant le Messie d'amour.",
      motsBanque: ["Car un enfant", "nous est né,", "un fils nous est donné,", "on l'appellera", "Prince de la Paix."],
      motsCorrects: ["Car un enfant", "nous est né,", "un fils nous est donné,", "on l'appellera", "Prince de la Paix."],
      explication: "Ésaïe contemple huit siècles à l'avance la venue du Sauveur qui apporte la vraie paix aux cœurs brisés.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 402,
      titre: "La Fournaise et la Foi",
      ref: "Daniel 3:17",
      x: 55,
      y: 55,
      type: "qcm",
      consigne: "Quelle certitude ont exprimée les trois compagnons de Daniel devant la fournaise ?",
      options: [
        { text: "Notre Dieu peut nous délivrer, et Il nous délivrera de ta main", correct: true },
        { text: "Nous renoncerons à notre foi pour avoir la vie sauve", correct: false },
        { text: "Nous ferons appel aux soldats pour nous défendre", correct: false }
      ],
      explication: "Même au milieu des flammes de l'épreuve, le Fils de Dieu marche avec ses fidèles.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 403,
      titre: "Le Vol de l'Aigle",
      ref: "Ésaïe 40:31",
      x: 80,
      y: 25,
      type: "cloze",
      consigne: "Complète la promesse de restauration pour ceux qui s'attendent à Dieu.",
      phraseAvant: "Ceux qui se confient en l'Éternel renouvellent leur ",
      phraseApres: ". Ils prennent le vol comme les aigles.",
      options: ["force", "patience", "cœur"],
      motCorrect: "force",
      explication: "Dans les moments de fatigue, Dieu accorde un souffle nouveau à qui remet son fardeau entre ses mains.",
      recompense: { xp: 50, perles: 2 }
    }
  ],

  eglise: [
    {
      id: 501,
      titre: "La Puissance de l'Esprit",
      ref: "Actes 1:8",
      x: 20,
      y: 75,
      type: "cloze",
      consigne: "Complète la promesse de Jésus avant son ascension.",
      phraseAvant: "Vous recevrez une ",
      phraseApres: ", le Saint-Esprit survenant sur vous, et vous serez mes témoins.",
      options: ["puissance", "couronne", "gloire"],
      motCorrect: "puissance",
      explication: "L'Église n'avance pas par stratégie humaine mais par le souffle bienfaisant du Saint-Esprit.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 502,
      titre: "Le Plus Grand Don",
      ref: "1 Corinthiens 13:13",
      x: 50,
      y: 50,
      type: "order",
      consigne: "Reconstruis le sommet des vertus spirituelles.",
      motsBanque: ["Trois choses demeurent :", "la foi,", "l'espérance,", "l'amour ;", "mais la plus grande,", "c'est l'amour."],
      motsCorrects: ["Trois choses demeurent :", "la foi,", "l'espérance,", "l'amour ;", "mais la plus grande,", "c'est l'amour."],
      explication: "L'amour fraternel et divin est la marque distinctive du disciple du Christ.",
      recompense: { xp: 55, perles: 3 }
    },
    {
      id: 503,
      titre: "Plus que Vainqueurs",
      ref: "Romains 8:37",
      x: 80,
      y: 25,
      type: "qcm",
      consigne: "Face à toutes les épreuves de la vie, que sommes-nous selon l'apôtre Paul ?",
      options: [
        { text: "Plus que vainqueurs par celui qui nous a aimés", correct: true },
        { text: "Épuisés et sans espérance", correct: false },
        { text: "Condamnés à lutter seuls", correct: false }
      ],
      explication: "Rien ne peut nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.",
      recompense: { xp: 60, perles: 3 }
    }
  ],

  esperance: [
    {
      id: 601,
      titre: "La Porte du Cœur",
      ref: "Apocalypse 3:20",
      x: 25,
      y: 75,
      type: "cloze",
      consigne: "Complète l'invitation tendre de Jésus à l'âme.",
      phraseAvant: "Voici, je me tiens à la ",
      phraseApres: " et je frappe. Si quelqu'un entend ma voix et ouvre, j'entrerai chez lui.",
      options: ["porte", "fenêtre", "croisée"],
      motCorrect: "porte",
      explication: "Jésus ne force jamais l'entrée : Il attend avec douceur que nous Lui ouvrions notre intimité.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 602,
      titre: "Toutes Larmes Essuyées",
      ref: "Apocalypse 21:4",
      x: 55,
      y: 50,
      type: "order",
      consigne: "Reconstruis la promesse ultime de consolation pour l'humanité.",
      motsBanque: ["Il essuiera", "toute larme", "de leurs yeux,", "et la mort", "ne sera plus."],
      motsCorrects: ["Il essuiera", "toute larme", "de leurs yeux,", "et la mort", "ne sera plus."],
      explication: "Dans la patrie céleste, le Seigneur pansera chaque blessure et comblera tout manque.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 603,
      titre: "Le Souffle Final",
      ref: "Apocalypse 22:20",
      x: 85,
      y: 20,
      type: "qcm",
      consigne: "Quelle est l'ultime promesse de Jésus et la réponse de l'Église à la fin de la Bible ?",
      options: [
        { text: "« Oui, je viens bientôt. — Amen ! Viens, Seigneur Jésus ! »", correct: true },
        { text: "« Préparez vos glaives et vos armes »", correct: false },
        { text: "« Il faudra attendre mille générations »", correct: false }
      ],
      explication: "Toute l'Écriture se clôt sur un cri d'espérance, de confiance et d'amour.",
      recompense: { xp: 75, perles: 5 }
    }
  ]
};

// INFORMATIONS SYSTÈME LEITNER (JARDIN DE LA MÉMOIRE / ANCRAGE)
export const LEITNER_BOXES = [
  { level: 1, nom: "Graine plantée", intervalle: "1 jour", icon: "🌱", color: "#159447", desc: "Verset fraîchement semé" },
  { level: 2, nom: "Jeune pousse", intervalle: "3 jours", icon: "🌿", color: "#0756a5", desc: "La Parole prend racine" },
  { level: 3, nom: "Arbre robuste", intervalle: "1 semaine", icon: "🌳", color: "#8a5cf6", desc: "Méditation affermie" },
  { level: 4, nom: "Belle floraison", intervalle: "1 mois", icon: "🌸", color: "#f97316", desc: "Retenu avec clarté" },
  { level: 5, nom: "Ancré dans le Cœur", intervalle: "Pour toujours", icon: "👑", color: "#f4b942", desc: "Gravé à jamais dans l'esprit" }
];

// SENTIER PAR DÉFAUT (Pour compatibilité)
export const PATH_STAGES = EPOCH_STAGES.racines;

// RECHERCHE THÉMATIQUE (LES BESOINS DU CŒUR)
export const THEMATIC_VERSES = [
  {
    themeId: "paix",
    label: "Besoin de Paix",
    icon: "🕊️",
    versets: [
      {
        texte: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.",
        ref: "Jean 14:27"
      },
      {
        texte: "Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières... Et la paix de Dieu gardera vos cœurs.",
        ref: "Philippiens 4:6-7"
      }
    ]
  },
  {
    themeId: "force",
    label: "Force & Courage",
    icon: "🛡️",
    versets: [
      {
        texte: "Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ? Ne t'effraie point et ne t'épouvante point, car l'Éternel est avec toi.",
        ref: "Josué 1:9"
      },
      {
        texte: "Ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles ; ils courent, et ne se lassent point.",
        ref: "Ésaïe 40:31"
      }
    ]
  },
  {
    themeId: "amour",
    label: "Amour Divin",
    icon: "💖",
    versets: [
      {
        texte: "Car j'ai l'assurance que ni la mort ni la vie... ne pourra nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.",
        ref: "Romains 8:38-39"
      },
      {
        texte: "Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.",
        ref: "1 Jean 4:19"
      }
    ]
  },
  {
    themeId: "joie",
    label: "Joie & Louange",
    icon: "🌟",
    versets: [
      {
        texte: "Il y a d'abondantes joies devant ta face, des délices éternelles à ta droite.",
        ref: "Psaume 16:11"
      },
      {
        texte: "Ne vous affligez pas, car la joie de l'Éternel sera votre force.",
        ref: "Néhémie 8:10"
      }
    ]
  }
];

// CARTES DE BÉNÉDICTIONS FRATERNELLES
export const FRATERNAL_BLESSINGS = [
  {
    titre: "Une parole de paix",
    verset: "Je vous laisse la paix, je vous donne ma paix. Que votre cœur ne se trouble point.",
    ref: "Jean 14:27",
    message: "Que la paix du Seigneur repose sur toi et ta maison aujourd'hui."
  },
  {
    titre: "La force dans l'épreuve",
    verset: "Ne crains rien, car je suis avec toi ; ne promène pas des regards inquiets, car je suis ton Dieu.",
    ref: "Ésaïe 41:10",
    message: "Sois fortifié(e) dans ta marche : tu n'es jamais seul(e)."
  },
  {
    titre: "La joie du partage",
    verset: "Encouragez-vous et édifiez-vous les uns les autres, comme vous le faites déjà.",
    ref: "1 Thessaloniciens 5:11",
    message: "Merci pour ta fidélité et ta présence précieuse dans le pèlerinage !"
  }
];

// PRIÈRES COMMUNAUTAIRES INITIALES POUR LE MUR DE PRIÈRES
export const INITIAL_COMMUNITY_PRAYERS = [
  {
    id: "p1",
    auteur: "Pasteur Marc",
    avatar: "🕊️",
    texte: "Seigneur, visite les malades de notre communauté et accorde-leur ta guérison et ton réconfort.",
    date: "Aujourd'hui à 10:15",
    soutiens: 14
  },
  {
    id: "p2",
    auteur: "Sarah (Maman pèlerine)",
    avatar: "🌸",
    texte: "Action de grâce pour la paix retrouvée dans mon foyer après des semaines difficiles. Dieu est fidèle !",
    date: "Hier à 18:40",
    soutiens: 23
  },
  {
    id: "p3",
    auteur: "Gabriel (Étudiant)",
    avatar: "🎒",
    texte: "Je prie pour mes examens à venir : que le Seigneur m'accorde sagesse, concentration et calme.",
    date: "Hier à 14:20",
    soutiens: 18
  }
];
