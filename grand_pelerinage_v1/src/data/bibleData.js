// Données Pan-Bibliques pour Le Grand Pèlerinage de la Bible

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
  }
};

export const PATH_STAGES = [
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
    titre: "Le Berger bienveillant",
    ref: "Psaume 23:1",
    x: 48,
    y: 75,
    type: "cloze",
    consigne: "Complète la promesse de confiance du psalmiste.",
    phraseAvant: "L'Éternel est mon berger : je ne ",
    phraseApres: " de rien.",
    options: ["manquerai", "douterai", "craindrai"],
    motCorrect: "manquerai",
    explication: "Dans les joies comme dans les vallées d'ombre, le Seigneur prend soin de ses enfants avec une fidélité inébranlable.",
    recompense: { xp: 35, perles: 1 }
  },
  {
    id: 4,
    titre: "La Parole éternelle",
    ref: "Jean 1:1",
    x: 64,
    y: 52,
    type: "order",
    consigne: "Reconstruis l'ouverture solennelle de l'Évangile selon Jean.",
    motsBanque: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
    motsCorrects: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
    explication: "Jésus-Christ est le Verbe éternel par qui tout a été créé. En Lui réside la vie et la véritable lumière des hommes.",
    recompense: { xp: 40, perles: 2 }
  },
  {
    id: 5,
    titre: "L'Amour infini du Père",
    ref: "Jean 3:16",
    x: 80,
    y: 35,
    type: "qcm",
    consigne: "Pour quelle raison Dieu a-t-il donné son Fils unique au monde ?",
    options: [
      { text: "Par amour, pour que quiconque croit ait la vie éternelle", correct: true },
      { text: "Pour juger et condamner le monde", correct: false },
      { text: "Pour éprouver la force des hommes", correct: false }
    ],
    explication: "Le cœur de l'Évangile est un amour pur, sans condition. Jésus n'est pas venu pour condamner, mais pour sauver et restaurer.",
    recompense: { xp: 50, perles: 2 }
  },
  {
    id: 6,
    titre: "La Victoire de l'Amour",
    ref: "1 Corinthiens 13:13",
    x: 90,
    y: 15,
    type: "qcm",
    consigne: "Parmi la foi, l'espérance et l'amour, quelle est la plus grande vertu ?",
    options: [
      { text: "L'Amour (la charité)", correct: true },
      { text: "La Foi", correct: false },
      { text: "L'Espérance", correct: false }
    ],
    explication: "Toutes les connaissances passeront, mais l'amour demeure pour l'éternité. Aimer Dieu et son prochain est le sommet du pèlerinage.",
    recompense: { xp: 60, perles: 3 }
  }
];

export const FRATERNAL_BLESSINGS = [
  {
    titre: "Une parole de paix",
    verset: "« Je vous laisse la paix, je vous donne ma paix. Que votre cœur ne se trouble point. »",
    ref: "Jean 14:27",
    message: "Que la paix du Seigneur repose sur toi et ta maison aujourd'hui."
  },
  {
    titre: "La force dans l'épreuve",
    verset: "« Ne crains rien, car je suis avec toi ; ne promène pas des regards inquiets, car je suis ton Dieu. »",
    ref: "Ésaïe 41:10",
    message: "Sois fortifié(e) dans ta marche : tu n'es jamais seul(e)."
  },
  {
    titre: "La joie du partage",
    verset: "« Encouragez-vous et édifiez-vous les uns les autres, comme vous le faites déjà. »",
    ref: "1 Thessaloniciens 5:11",
    message: "Merci pour ta fidélité et ta présence précieuse dans le pèlerinage !"
  }
];
