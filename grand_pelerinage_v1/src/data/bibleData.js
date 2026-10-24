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
  { id: "job", nom: "Job", testament: "AT", section: "Poésie & Sagesse", chapitres: 42 },
  { id: "psa", nom: "Psaumes", testament: "AT", section: "Poésie & Sagesse", chapitres: 150 },
  { id: "pro", nom: "Proverbes", testament: "AT", section: "Poésie & Sagesse", chapitres: 31 },
  { id: "ecc", nom: "Ecclésiaste", testament: "AT", section: "Poésie & Sagesse", chapitres: 12 },
  { id: "esa", nom: "Ésaïe", testament: "AT", section: "Prophètes", chapitres: 66 },
  { id: "jer", nom: "Jérémie", testament: "AT", section: "Prophètes", chapitres: 52 },
  { id: "eze", nom: "Ézéchiel", testament: "AT", section: "Prophètes", chapitres: 48 },
  { id: "dan", nom: "Daniel", testament: "AT", section: "Prophètes", chapitres: 12 },
  { id: "mic", nom: "Michée", testament: "AT", section: "Petits Prophètes", chapitres: 7 },
  { id: "hab", nom: "Habacuc", testament: "AT", section: "Petits Prophètes", chapitres: 3 },

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
  { id: "heb", nom: "Hébreux", testament: "NT", section: "Épîtres", chapitres: 13 },
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
    id: "courage",
    nom: "Courage & Foi",
    livres: "Josué, Ruth, David, Rois",
    icon: "🛡️",
    color: "#8a5cf6",
    tagline: "Victoires face aux géants et fidélité"
  },
  {
    id: "sagesse",
    nom: "Louange & Sagesse",
    livres: "Psaumes, Proverbes, Job, Ecclésiaste",
    icon: "🕊️",
    color: "#0756a5",
    tagline: "Le repos de l'âme et la confiance"
  },
  {
    id: "prophetes",
    nom: "Voix d'Espérance",
    livres: "Ésaïe, Daniel, Ézéchiel, Michée",
    icon: "🔥",
    color: "#f97316",
    tagline: "L'attente du Messie et du Prince de la Paix"
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
    livres: "Actes & Épîtres aux nations",
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
  "gen-14": {
    titre: "Abram et Melchisédek",
    livre: "Genèse",
    chapitre: 14,
    testament: "Ancien Testament",
    versets: [
      { num: 18, texte: "Melchisédek, roi de Salem, fit apporter du pain et du vin : il était sacrificateur du Dieu Très-Haut.", cle: true },
      { num: 19, texte: "Il bénit Abram, et dit : Béni soit Abram par le Dieu Très-Haut, maître du ciel et de la terre !", cle: true },
      { num: 20, texte: "Béni soit le Dieu Très-Haut, qui a livré tes ennemis entre tes mains ! Et Abram lui donna la dîme de tout.", cle: true }
    ]
  },
  "gen-22": {
    titre: "L'épreuve de la foi d'Abraham",
    livre: "Genèse",
    chapitre: 22,
    testament: "Ancien Testament",
    versets: [
      { num: 7, texte: "Alors Isaac, parlant à Abraham, son père, dit : Mon père ! Et il répondit : Me voici, mon fils ! Isaac reprit : Voici le feu et le bois ; mais où est l'agneau pour l'holocauste ?" },
      { num: 8, texte: "Abraham répondit : Mon fils, Dieu pourvoira lui-même de l'agneau pour l'holocauste. Et ils marchèrent tous deux ensemble.", cle: true },
      { num: 13, texte: "Abraham leva les yeux, et vit derrière lui un bélier retenu dans un buisson par les cornes ; et Abraham alla prendre le bélier, et l'offrit en holocauste à la place de son fils.", cle: true },
      { num: 14, texte: "Abraham donna à ce lieu le nom de Jéhovah-Jiré. C'est pourquoi l'on dit aujourd'hui : À la montagne de l'Éternel il sera pourvu.", cle: true }
    ]
  },
  "exo-3": {
    titre: "La théophanie du Buisson Ardent",
    livre: "Exode",
    chapitre: 3,
    testament: "Ancien Testament",
    versets: [
      { num: 2, texte: "L'ange de l'Éternel lui apparut dans une flamme de feu, au milieu d'un buisson. Moïse regarda ; et voici, le buisson était tout en feu, et le buisson ne se consumait point.", cle: true },
      { num: 14, texte: "Dieu dit à Moïse : Je suis celui qui suis. Et il ajouta : C'est ainsi que tu répondras aux enfants d'Israël : Celui qui s'appelle 'Je suis' m'a envoyé vers vous.", cle: true }
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
  "deu-6": {
    titre: "Le grand commandement d'amour (Shema)",
    livre: "Deutéronome",
    chapitre: 6,
    testament: "Ancien Testament",
    versets: [
      { num: 4, texte: "Écoute, Israël ! l'Éternel, notre Dieu, est le seul Éternel.", cle: true },
      { num: 5, texte: "Tu aimeras l'Éternel, ton Dieu, de tout ton cœur, de toute ton âme et de toute ta force.", cle: true }
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
  "pro-30": {
    titre: "Les Énigmes et maximes d'Agur",
    livre: "Proverbes",
    chapitre: 30,
    testament: "Ancien Testament",
    versets: [
      { num: 5, texte: "Toute parole de Dieu est éprouvée. Il est un bouclier pour ceux qui cherchent en lui un refuge.", cle: true },
      { num: 18, texte: "Il y a trois choses qui sont au-dessus de ma portée, Même quatre que je ne puis comprendre :", cle: true },
      { num: 19, texte: "La trace de l'aigle dans les cieux, La trace du serpent sur le rocher, La trace du navire au milieu de la mer, Et la trace de l'homme chez la jeune fille.", cle: true }
    ]
  },
  "esa-53": {
    titre: "Le Serviteur souffrant et Rédempteur",
    livre: "Ésaïe",
    chapitre: 53,
    testament: "Ancien Testament",
    versets: [
      { num: 3, texte: "Méprisé et abandonné des hommes, Homme de douleur et habitué à la souffrance, Semblable à celui dont on détourne le visage." },
      { num: 4, texte: "Cependant, ce sont nos souffrances qu'il a portées, C'est de nos douleurs qu'il s'est chargé ; Et nous l'avons considéré comme puni, Frappé de Dieu, et humilié." },
      { num: 5, texte: "Mais il était blessé pour nos péchés, Brisé pour nos iniquités ; Le châtiment qui nous donne la paix est tombé sur lui, Et c'est par ses meurtrissures que nous sommes guéris.", cle: true }
    ]
  },
  "dan-9": {
    titre: "La prière de Daniel et les 70 semaines",
    livre: "Daniel",
    chapitre: 9,
    testament: "Ancien Testament",
    versets: [
      { num: 24, texte: "Soixante-dix semaines ont été fixées sur ton peuple et sur ta ville sainte, pour faire cesser les transgressions et mettre fin aux péchés, pour expier l'iniquité et amener la justice éternelle, pour sceller la vision et le prophète, et pour oindre le Saint des saints.", cle: true }
    ]
  },
  "mat-5": {
    titre: "Le Sermon sur la montagne et les Béatitudes",
    livre: "Matthieu",
    chapitre: 5,
    testament: "Nouveau Testament",
    versets: [
      { num: 3, texte: "Heureux les pauvres en esprit, car le royaume des cieux est à eux !", cle: true },
      { num: 5, texte: "Heureux les débonnaires, car ils hériteront la terre !", cle: true },
      { num: 8, texte: "Heureux ceux qui ont le cœur pur, car ils verront Dieu !", cle: true },
      { num: 9, texte: "Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu !", cle: true }
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
  "act-17": {
    titre: "Paul à Athènes et le discours de l'Aréopage",
    livre: "Actes",
    chapitre: 17,
    testament: "Nouveau Testament",
    versets: [
      { num: 22, texte: "Paul, debout au milieu de l'Aréopage, dit : Hommes Athéniens, je vous trouve à tous égards extrêmement religieux." },
      { num: 23, texte: "Car, en parcourant votre ville et en considérant les objets de votre dévotion, j'ai même découvert un autel avec cette inscription : À un dieu inconnu ! Ce que vous révérez sans le connaître, c'est ce que je vous annonce.", cle: true },
      { num: 28, texte: "Car en lui nous avons la vie, le mouvement, et l'être.", cle: true }
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
  }
};

// =========================================================================
// SYSTÈME DE LIGUES CÉLESTES (XP → PROMOTION)
// =========================================================================
export const CELESTIAL_LEAGUES = [
  { id: "airain",  nom: "Airain",          icon: "🪵", color: "#a16207", minXp: 0,    maxXp: 99,   perks: "Accès au Parcours de base et au Jardin de la Mémoire" },
  { id: "argent",  nom: "Argent",          icon: "🥈", color: "#94a3b8", minXp: 100,  maxXp: 299,  perks: "Déblocage des exercices Vrai/Faux et Qui a dit ?" },
  { id: "or",      nom: "Or",             icon: "🥇", color: "#ca8a04", minXp: 300,  maxXp: 599,  perks: "Déblocage des exercices de Paires bibliques" },
  { id: "saphir",  nom: "Saphir",         icon: "💎", color: "#1d4ed8", minXp: 600,  maxXp: 999,  perks: "Défi Providenciel débloqué et bannière de profil" },
  { id: "rubis",   nom: "Rubis",          icon: "🍷", color: "#be123c", minXp: 1000, maxXp: 1499, perks: "Carte de Bénédiction WhatsApp activée" },
  { id: "diamant", nom: "Diamant Céleste", icon: "👑", color: "#7c3aed", minXp: 1500, maxXp: Infinity, perks: "Toutes les grâces. Pèlerin d'Excellence. Gloire à Dieu !" }
];

export function getCurrentLeague(xp = 0) {
  const league = CELESTIAL_LEAGUES.findLast((l) => xp >= l.minXp) || CELESTIAL_LEAGUES[0];
  const nextLeague = CELESTIAL_LEAGUES[CELESTIAL_LEAGUES.indexOf(league) + 1] || null;
  const progress = nextLeague
    ? Math.min(100, Math.round(((xp - league.minXp) / (nextLeague.minXp - league.minXp)) * 100))
    : 100;
  return { league, nextLeague, progress };
}

// =========================================================================
// BÉNÉDICTIONS DE LA COLOMBE (messages contextualels de la mascotte 🕊️)
// =========================================================================
export const DOVE_BLESSINGS = {
  welcome: [
    "Bienvenue pèlerin ! Que chaque étape te rapproche du Père des lumières 🌟",
    "La Parole est une lampe à tes pieds et une lumière sur ton sentier. En avant ! 🕊️",
    "Chaque mot de la Bible est un souffle de vie. Commence avec confiance !"
  ],
  streak: [
    "Quelle fidélité ! Tu marches avec constance — Dieu voit ton cœur 🔥",
    "Ta flamme brille ! Continue ce beau chemin de la Parole jour après jour.",
    "La persévérance porte du fruit. Tu es une inspiration pour toute la communauté ! 🌿"
  ],
  lowLamps: [
    "Quelques lampes se sont éteintes, mais ton Père veille. Prends un temps de prière 🙏",
    "Ne te décourage pas. Même Pierre est tombé, et Jésus l'a relevé. Tu peux continuer !",
    "La Boutique de Grâce peut rallumer tes lampes. 15 perles = 1 lampe restaurée 🪔"
  ],
  leagueUp: [
    "Tu viens de monter de ligue ! Dieu couronne ta fidélité ✨",
    "Nouvelle ligue, nouvelles grâces ! Avance dans l'excellence de la Parole 👑",
    "La promotion vient de Dieu ! Continue d'honorer sa Parole avec tout ton cœur 🌟"
  ],
  success: [
    "Excellent ! La Parole s'ancre dans ton cœur comme un arbre planté au bord des eaux 🌳",
    "Bien joué ! Chaque verset mémorisé est un trésor que personne ne peut te voler ✨",
    "Bravo ! Tu grandis dans la connaissance et la grâce du Seigneur Jésus-Christ 🌿"
  ],
  verse: [
    { ref: "Psaume 119:105", texte: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier." },
    { ref: "Josué 1:8", texte: "Ce livre de la loi ne s'éloignera point de ta bouche." },
    { ref: "Matthieu 4:4", texte: "L'homme ne vivra pas de pain seulement, mais de toute parole qui sort de la bouche de Dieu." },
    { ref: "2 Timothée 3:16", texte: "Toute Écriture est inspirée de Dieu, et utile pour enseigner." },
    { ref: "Hébreux 4:12", texte: "La parole de Dieu est vivante et efficace." }
  ]
};

// =========================================================================
// NOUVELLES ÉTAPES — PAIRES, VRAI/FAUX, QUI A DIT ? (9 étapes bonus 73-81)
// =========================================================================
export const BONUS_STAGES = [
  // --- PAIRES BIBLIQUES (type: "pairs") ---
  {
    id: 73,
    titre: "Les Patriarches et leurs Alliances",
    ref: "Genèse 15 – Exode 3",
    epoch: "racines",
    difficulte: "intermediaire",
    tempsLimite: 60,
    coutVie: false,
    type: "pairs",
    consigne: "Relie chaque patriarche ou prophète à l'alliance ou l'événement qui lui correspond.",
    pairs: [
      { left: "Noé",    right: "L'arc dans la nue (alliance de paix)" },
      { left: "Abraham",right: "La promesse d'une descendance comme les étoiles" },
      { left: "Jacob",  right: "La lutte avec l'ange à Peniel" },
      { left: "Moïse", right: "Le buisson ardent et le Nom Éternel" }
    ],
    conseilRecherche: "📖 Lis Genèse 9, 15, 32 et Exode 3. Chaque alliance révèle un aspect du caractère de Dieu.",
    explication: "Dieu adapte son langage à chaque époque et à chaque homme, mais son amour et sa fidélité restent immuables à travers toutes les générations.",
    recompense: { xp: 55, perles: 3 }
  },
  {
    id: 74,
    titre: "Rois et Royaumes d'Israël",
    ref: "1 Samuel – 1 Rois",
    epoch: "courage",
    difficulte: "intermediaire",
    tempsLimite: 55,
    coutVie: false,
    type: "pairs",
    consigne: "Associe chaque roi à l'acte ou la parole qui le définit dans les Écritures.",
    pairs: [
      { left: "Saül",   right: "Le premier roi, rejeté pour sa désobéissance" },
      { left: "David",  right: "L'homme selon le cœur de Dieu, auteur des Psaumes" },
      { left: "Salomon",right: "Le bâtisseur du Temple et le roi sage" },
      { left: "Élie",   right: "Le prophète de feu, traduit au ciel dans un tourbillon" }
    ],
    conseilRecherche: "📖 Consulte 1 Samuel 15, 2 Samuel 7, 1 Rois 6 et 2 Rois 2. Compare les règnes et leurs héritages spirituels.",
    explication: "Les rois d'Israël nous enseignent que la vraie grandeur n'est pas dans la puissance ou la sagesse humaine, mais dans l'humilité et l'obéissance à Dieu.",
    recompense: { xp: 55, perles: 3 }
  },
  {
    id: 75,
    titre: "Apôtres et leurs Villes d'Action",
    ref: "Actes des Apôtres",
    epoch: "eglise",
    difficulte: "avance",
    tempsLimite: 50,
    coutVie: true,
    type: "pairs",
    consigne: "Relie chaque apôtre à la ville ou région centrale de son ministère dans les Actes.",
    pairs: [
      { left: "Pierre",  right: "Jérusalem et Antioche" },
      { left: "Paul",    right: "Corinthe et Éphèse" },
      { left: "Philippe",right: "Samarie et Azot" },
      { left: "Barnabas",right: "Chypre et Antioche de Pisidie" }
    ],
    conseilRecherche: "📖 Lis Actes 8, 9, 11-14. Trace les voyages sur une carte biblique pour mieux ancrer ces noms.",
    explication: "L'Évangile s'est répandu de ville en ville non par la force, mais par la puissance de l'Esprit à travers des hommes ordinaires consacrés au Seigneur.",
    recompense: { xp: 65, perles: 3 }
  },

  // --- VRAI / FAUX CHRONO (type: "truefalse") ---
  {
    id: 76,
    titre: "Vrai ou Faux : La Résurrection",
    ref: "1 Corinthiens 15:4-6",
    epoch: "evangiles",
    difficulte: "debutant",
    tempsLimite: 30,
    coutVie: false,
    type: "truefalse",
    consigne: "Est-il vrai que Jésus est apparu après sa résurrection à plus de cinq cents frères à la fois, selon la Louis Segond 1910 ?",
    isTrue: true,
    explicationVrai: "Oui ! Paul l'atteste en 1 Corinthiens 15:6 : « Il est apparu à plus de cinq cents frères à la fois, dont la plupart sont encore vivants. »",
    explicationFaux: "C'est pourtant vrai ! Paul mentionne cette apparition collective comme preuve irréfutable de la résurrection en 1 Corinthiens 15:6.",
    conseilRecherche: "📖 Lis 1 Corinthiens 15:1-8. Paul liste les témoins oculaires de la résurrection comme preuves vivantes de la foi.",
    explication: "La résurrection est le fondement de notre foi. Sans elle, notre foi serait vaine. Mais Christ est réellement ressuscité, prémices de ceux qui sont morts.",
    recompense: { xp: 35, perles: 2 }
  },
  {
    id: 77,
    titre: "Vrai ou Faux : Les Béatitudes",
    ref: "Matthieu 5:5",
    epoch: "evangiles",
    difficulte: "intermediaire",
    tempsLimite: 25,
    coutVie: false,
    type: "truefalse",
    consigne: "Jésus dit-il dans les Béatitudes : « Heureux les doux, car ils hériteront la terre » (Matthieu 5:5, LSG 1910) ?",
    isTrue: true,
    explicationVrai: "Exact ! « Heureux les débonnaires (ou doux), car ils hériteront la terre. » — Matthieu 5:5 (Louis Segond 1910).",
    explicationFaux: "Si, c'est bien écrit ! Matthieu 5:5 dit précisément que les doux (débonnaires) hériteront la terre, non les forts.",
    conseilRecherche: "📖 Ouvre Matthieu 5:3-12. Les Béatitudes renversent la logique du monde : les humbles, les purs et les pacifiques sont élevés.",
    explication: "La douceur du chrétien n'est pas faiblesse mais force maîtrisée. Ceux qui s'abaissent devant Dieu sont ceux que Dieu élèvera.",
    recompense: { xp: 40, perles: 2 }
  },
  {
    id: 78,
    titre: "Vrai ou Faux : Moïse a traversé la mer Rouge à la nage",
    ref: "Exode 14:21-22",
    epoch: "racines",
    difficulte: "debutant",
    tempsLimite: 25,
    coutVie: false,
    type: "truefalse",
    consigne: "Moïse et les Israélites ont-ils traversé la mer Rouge à la nage selon Exode 14 ?",
    isTrue: false,
    explicationVrai: "Non, Dieu a ouvert la mer ! Exode 14:21-22 dit que l'Éternel fit souffler un vent fort, les eaux se fendirent et les Israélites passèrent à sec.",
    explicationFaux: "Bien vu ! Ils n'ont pas nagé — ils ont marché sur la terre ferme au milieu de la mer, les eaux formant comme des murailles à droite et à gauche.",
    conseilRecherche: "📖 Lis Exode 14:15-30. Ce miracle montre que Dieu ouvre le chemin là où il n'y en a pas. Il est le Dieu de l'impossible.",
    explication: "La traversée de la mer Rouge est une image du salut : Dieu agit, et nous marchons dans sa délivrance par la foi.",
    recompense: { xp: 35, perles: 2 }
  },

  // --- QUI A DIT ? (type: "whosaid") ---
  {
    id: 79,
    titre: "Qui a dit : « Mes yeux ont vu ta délivrance » ?",
    ref: "Luc 2:30",
    epoch: "evangiles",
    difficulte: "intermediaire",
    tempsLimite: 40,
    coutVie: false,
    type: "whosaid",
    consigne: "Qui a prononcé ces mots en tenant l'enfant Jésus dans ses bras au Temple ?",
    quote: "« Mes yeux ont vu ton salut, que tu as préparé devant tous les peuples. »",
    correctSpeaker: "Siméon",
    speakers: [
      { nom: "Siméon",    role: "Juste et craignant Dieu, attendant la consolation d'Israël", avatar: "🧓" },
      { nom: "Zacharie",  role: "Père de Jean-Baptiste, sacrificateur de la tribu de Lévi", avatar: "⚗️" },
      { nom: "Anne",      role: "Prophétesse veuve, consacrée au jeûne et à la prière", avatar: "🕯️" },
      { nom: "Joseph",    role: "Charpentier de Nazareth, père nourricier de Jésus", avatar: "🪚" }
    ],
    conseilRecherche: "📖 Lis Luc 2:25-35. Siméon avait reçu la promesse qu'il ne mourrait pas avant d'avoir vu le Christ du Seigneur.",
    explication: "Siméon est le symbole de l'espérance patiente : Dieu accomplit toujours ses promesses, même quand l'attente semble longue.",
    recompense: { xp: 50, perles: 3 }
  },
  {
    id: 80,
    titre: "Qui a dit : « L'Éternel est mon berger » ?",
    ref: "Psaume 23:1",
    epoch: "sagesse",
    difficulte: "debutant",
    tempsLimite: 30,
    coutVie: false,
    type: "whosaid",
    consigne: "Quel auteur a écrit ces paroles célèbres qui ouvrent le Psaume 23 ?",
    quote: "« L'Éternel est mon berger : je ne manquerai de rien. »",
    correctSpeaker: "David",
    speakers: [
      { nom: "David",   role: "Roi et psalmiste, homme selon le cœur de Dieu", avatar: "👑" },
      { nom: "Salomon", role: "Fils de David, roi sage et bâtisseur du Temple", avatar: "🏛️" },
      { nom: "Moïse",   role: "Législateur d'Israël et prophète de Dieu", avatar: "📜" },
      { nom: "Asaph",   role: "Chef des musiciens du Temple, auteur de psaumes", avatar: "🎶" }
    ],
    conseilRecherche: "📖 Le Psaume 23 est attribué à David dans son titre. David, lui-même berger de troupeaux, a compris la sollicitude divine.",
    explication: "David parle avec l'expérience du berger qu'il fut. Il sait que l'Éternel guide, protège, restaure et accompagne jusqu'à la maison du Père.",
    recompense: { xp: 35, perles: 2 }
  },
  {
    id: 81,
    titre: "Qui a dit : « Seigneur, si tu veux, tu peux me rendre pur » ?",
    ref: "Matthieu 8:2",
    epoch: "evangiles",
    difficulte: "intermediaire",
    tempsLimite: 40,
    coutVie: false,
    type: "whosaid",
    consigne: "Qui s'est prosterné devant Jésus en prononçant ces mots de foi et d'humilité ?",
    quote: "« Seigneur, si tu le veux, tu peux me rendre pur. »",
    correctSpeaker: "Un lépreux",
    speakers: [
      { nom: "Un lépreux",   role: "Exclu de la société, frappé d'une maladie incurable", avatar: "🙇" },
      { nom: "Un centenier", role: "Officier romain dont le serviteur était paralysé", avatar: "⚔️" },
      { nom: "Pierre",       role: "Pêcheur de Galilée, apôtre choisi par Jésus", avatar: "⚓" },
      { nom: "Nicodème",     role: "Pharisien et chef des Juifs, venu de nuit", avatar: "🌙" }
    ],
    conseilRecherche: "📖 Lis Matthieu 8:1-4. Cet homme, guéri et renvoyé vers le sacrificateur, annonce la purification que Jésus apporte à tous.",
    explication: "« Si tu le veux » — cette humilité est la clé de toute prière. Non pas imposer notre agenda à Dieu, mais s'en remettre à sa volonté souveraine et aimante.",
    recompense: { xp: 50, perles: 3 }
  }
];

// =========================================================================
// ÉTAPES DU SENTIER PAR ÉPOQUE (ENRICHISSEMENT MAJEUR : 72 ÉTAPES)
// =========================================================================
export const EPOCH_STAGES = {
  // ÉPOQUE 1 : LES RACINES (10 étapes de la Genèse au Deutéronome)
  racines: [
    {
      id: 1,
      titre: "La Création du monde",
      ref: "Genèse 1:1",
      difficulte: "debutant",
      tempsLimite: null,
      coutVie: false,
      x: 10,
      y: 78,
      type: "order",
      consigne: "Remets les mots dans le bon ordre pour reconstruire ce fondement de la foi.",
      motsBanque: ["Au commencement", "Dieu", "créa", "les cieux", "et", "la terre."],
      motsCorrects: ["Au commencement", "Dieu", "créa", "les cieux", "et", "la terre."],
      conseilRecherche: "📖 Lis Genèse 1:1. Médite sur le fait que Dieu préexiste à toute chose créée.",
      explication: "Dieu est la source de toute vie et de toute beauté. Tout commencement sous son regard porte la promesse d'un renouveau.",
      recompense: { xp: 25, perles: 1 }
    },
    {
      id: 2,
      titre: "La Lumière dans la nuit",
      ref: "Genèse 1:3",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 22,
      y: 64,
      type: "qcm",
      consigne: "Quelle est la première parole prononcée par Dieu dans la Bible ?",
      options: [
        { text: "« Que la lumière soit ! »", correct: true },
        { text: "« Que la terre fleurisse ! »", correct: false },
        { text: "« Que les étoiles brillent ! »", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Genèse 1:3. Avant le soleil et la lune créés au 4e jour, Dieu appelle la lumière par sa Parole !",
      explication: "Avant même toute création matérielle, Dieu apporte la clarté. Sa Parole a le pouvoir d'illuminer nos obscurités les plus profondes.",
      recompense: { xp: 30, perles: 1 }
    },
    {
      id: 3,
      titre: "L'Alliance et l'Arc dans la nue",
      ref: "Genèse 9:13",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 18,
      y: 44,
      type: "cloze",
      consigne: "Complète le signe de l'alliance de paix que Dieu établit avec la terre (Louis Segond 1910).",
      phraseAvant: "J'ai placé mon ",
      phraseApres: " dans la nue, et il servira de signe d'alliance entre moi et la terre.",
      options: ["arc", "soleil", "flambeau"],
      motCorrect: "arc",
      conseilRecherche: "📖 Consulte Genèse 9:12-17. Le mot hébreu 'qeshet' désigne l'arc de guerre désormais désarmé dans les nuées.",
      explication: "Dans le texte biblique de la Louis Segond 1910, le terme sacré exact est « arc » (l'arc-en-ciel). C'est le mémorial vivant de la miséricorde de Dieu qui veille sur toute sa création.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 4,
      titre: "La Promesse à Abraham",
      ref: "Genèse 12:2",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 32,
      y: 32,
      type: "order",
      consigne: "Reconstruis la promesse faite au père de la foi.",
      motsBanque: ["Je te bénirai,", "et tu seras", "une source", "de bénédiction."],
      motsCorrects: ["Je te bénirai,", "et tu seras", "une source", "de bénédiction."],
      conseilRecherche: "📖 Examine Genèse 12:1-3. Dieu bénit Abram non pour qu'il garde la grâce pour lui seul, mais pour qu'elle rayonne sur toutes les familles de la terre.",
      explication: "Dieu nous bénit afin que nous soyons nous-mêmes une bénédiction pour ceux qui nous entourent.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 5,
      titre: "L'Éternel est mon étendard",
      ref: "Exode 17:15",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 44,
      y: 50,
      type: "qcm",
      consigne: "Quel nom Moïse donna-t-il à l'autel après la victoire ?",
      options: [
        { text: "Yahvé Nissi (L'Éternel mon étendard)", correct: true },
        { text: "Yahvé Shalom (L'Éternel ma paix)", correct: false },
        { text: "Yahvé Jiré (L'Éternel pourvoira)", correct: false }
      ],
      conseilRecherche: "📖 Lis Exode 17:8-16. Moïse gardait les bras élevés soutenu par Aaron et Hur.",
      explication: "Dans nos combats quotidiens, notre bannière et notre force reposent en Dieu seul.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 6,
      titre: "Le Mystère de Melchisédek",
      ref: "Genèse 14:18",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 30,
      coutVie: true,
      x: 54,
      y: 72,
      type: "qcm",
      consigne: "De quelle ville antique Melchisédek était-il roi lorsqu'il apporta du pain et du vin pour bénir Abram ?",
      options: [
        { text: "Salem (la paix, future Jérusalem)", correct: true },
        { text: "Ur en Chaldée", correct: false },
        { text: "Sodome", correct: false },
        { text: "Hébron", correct: false }
      ],
      conseilRecherche: "📖 Consulte Genèse 14:18 et Hébreux 7:1-3. Note bien la signification du nom de la ville et les dons royaux apportés.",
      explication: "Melchisédek, roi de Salem et sacrificateur du Très-Haut, offre du pain et du vin. L'Épître aux Hébreux y voit la préfiguration sublime du Christ, souverain sacrificateur éternel.",
      recompense: { xp: 55, perles: 2 }
    },
    {
      id: 7,
      titre: "L'Agneau sur le mont Morija",
      ref: "Genèse 22:8",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 64,
      y: 58,
      type: "cloze",
      consigne: "Complète la réponse prophétique d'Abraham à son fils Isaac qui demandait où était la victime.",
      phraseAvant: "Mon fils, Dieu pourvoira lui-même de l'",
      phraseApres: " pour l'holocauste. Et ils marchèrent tous deux ensemble.",
      options: ["agneau", "bélier", "offrande"],
      motCorrect: "agneau",
      conseilRecherche: "📖 Ouvre Genèse 22:7-14. Même si Dieu fournit finalement un bélier, la parole inspirée d'Abraham annonce 'l'agneau' parfait qui sera offert sur cette même montagne.",
      explication: "Sur le mont Morija, la foi d'Abraham discerne prophétiquement le sacrifice du véritable Agneau de Dieu qui ôte le péché du monde.",
      recompense: { xp: 60, perles: 2 }
    },
    {
      id: 8,
      titre: "Le Signe du Sang Pascal",
      ref: "Exode 12:13",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 72,
      y: 35,
      type: "order",
      consigne: "Reconstitue la promesse de protection faite aux familles d'Israël en Égypte lors de la première Pâque.",
      motsBanque: ["Le sang", "vous servira de signe :", "je verrai le sang,", "et je passerai", "par-dessus vous."],
      motsCorrects: ["Le sang", "vous servira de signe :", "je verrai le sang,", "et je passerai", "par-dessus vous."],
      conseilRecherche: "📖 Lis Exode 12:1-13. Vois comment le sang appliqué avec l'hysope sur les poteaux et le linteau protégeait chaque maison.",
      explication: "La Pâque est le mémorial de la délivrance : le regard de Dieu ne s'arrête pas sur les mérites des habitants, mais sur le signe de l'Alliance qui préserve du jugement.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 9,
      titre: "Le Buisson Ardent & Le Nom Divin",
      ref: "Exode 3:14",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 82,
      y: 48,
      type: "qcm",
      consigne: "Quelle souveraine révélation Dieu fit-il à Moïse lorsqu'il lui demanda quel était son Nom ?",
      options: [
        { text: "« JE SUIS CELUI QUI SUIS » (Ehyeh Asher Ehyeh)", correct: true },
        { text: "« Le Juge Suprême de toutes les nations »", correct: false },
        { text: "« Le Dieu du tonnerre et des éclairs »", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Exode 3:13-15. Dieu affirme son existence autonome, éternelle et fidèle par-delà les générations.",
      explication: "Le Nom ineffable révèle un Dieu vivant, présent et agissant dans l'Histoire, qui s'engage lui-même pour délivrer son peuple de l'oppression.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 10,
      titre: "Le Shema Israël",
      ref: "Deutéronome 6:4-5",
      difficulte: "expert",
      tempsLimite: 18,
      coutVie: true,
      x: 92,
      y: 22,
      type: "order",
      consigne: "Reconstruis la confession centrale de la foi d'Israël transmise par Moïse.",
      motsBanque: ["Écoute, Israël !", "l'Éternel, notre Dieu,", "est le seul Éternel.", "Tu aimeras l'Éternel", "de tout ton cœur."],
      motsCorrects: ["Écoute, Israël !", "l'Éternel, notre Dieu,", "est le seul Éternel.", "Tu aimeras l'Éternel", "de tout ton cœur."],
      conseilRecherche: "📖 Consulte Deutéronome 6:4-9 et Marc 12:29-30 où Jésus rappelle ce commandement suprême.",
      explication: "Le Shema est le cœur battant de la vie avec Dieu : une écoute obéissante doublée d'un amour total et exclusif.",
      recompense: { xp: 80, perles: 4 }
    }
  ],

  // ÉPOQUE 2 : COURAGE & FOI (10 étapes de Josué aux Rois)
  courage: [
    {
      id: 301,
      titre: "L'Ordre d'en haut",
      ref: "Josué 1:9",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 10,
      y: 78,
      type: "order",
      consigne: "Reconstruis l'exhortation adressée à Josué au seuil de la terre promise.",
      motsBanque: ["Fortifie-toi", "et prends courage !", "Ne t'effraie point,", "car l'Éternel", "est avec toi."],
      motsCorrects: ["Fortifie-toi", "et prends courage !", "Ne t'effraie point,", "car l'Éternel", "est avec toi."],
      conseilRecherche: "📖 Lis Josué 1:1-9. L'ordre de ne point craindre s'enracine dans la promesse divine : 'Je ne te délaisserai point'.",
      explication: "Notre courage ne repose pas sur notre force humaine, mais sur la présence invincible de Dieu.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 302,
      titre: "David face au géant",
      ref: "1 Samuel 17:45",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 22,
      y: 64,
      type: "qcm",
      consigne: "Au nom de qui le jeune David s'est-il avancé contre Goliath ?",
      options: [
        { text: "Au nom de l'Éternel des armées, le Dieu d'Israël", correct: true },
        { text: "Au nom de l'armée du roi Saül", correct: false },
        { text: "Au nom de sa propre adresse et de sa fronde", correct: false }
      ],
      conseilRecherche: "📖 Consulte 1 Samuel 17:40-50. Remarque le contraste saisissant entre l'armure de fer et la foi nue en l'Éternel.",
      explication: "La foi renverse les forteresses les plus intimidantes quand Dieu est au centre de notre combat.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 303,
      titre: "La Fidélité de Ruth",
      ref: "Ruth 1:16",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 18,
      y: 44,
      type: "cloze",
      consigne: "Complète le cri de fidélité et d'amour loyal de Ruth envers Naomi.",
      phraseAvant: "Où tu iras j'irai... ton peuple sera mon peuple, et ton ",
      phraseApres: " sera mon Dieu.",
      options: ["Dieu", "berger", "sauveur"],
      motCorrect: "Dieu",
      conseilRecherche: "📖 Examine Ruth 1:14-18. Ruth quitte Moab pour s'attacher au Dieu d'Israël et deviendra l'ancêtre du roi David.",
      explication: "L'attachement fraternel véritable reflète l'Alliance éternelle de Dieu avec les humbles.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 304,
      titre: "Le Cordon Écarlate de Rahab",
      ref: "Josué 2:18",
      difficulte: "intermediaire",
      subtile: true,
      tempsLimite: 35,
      coutVie: false,
      x: 32,
      y: 32,
      type: "qcm",
      consigne: "Quel signe distinctif Rahab devait-elle lier à sa fenêtre pour sauver sa maison lors de la chute de Jéricho ?",
      options: [
        { text: "Un cordon de fil écarlate", correct: true },
        { text: "Une branche d'olivier blanc", correct: false },
        { text: "Une bannière brodée d'or", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Josué 2:17-21 et Hébreux 11:31. Le cordon rouge à la fenêtre rappelle le sang de la Pâque sur les linteaux.",
      explication: "Par sa foi et son accueil courageux des envoyés, Rahab la Cananéenne est sauvée et intégrée dans la généalogie du Messie (Matthieu 1:5).",
      recompense: { xp: 55, perles: 2 }
    },
    {
      id: 305,
      titre: "La Toison de Gédéon",
      ref: "Juges 6:37",
      difficulte: "intermediaire",
      tempsLimite: 30,
      coutVie: true,
      x: 44,
      y: 50,
      type: "cloze",
      consigne: "Complète le signe de confirmation demandé par Gédéon sur l'aire.",
      phraseAvant: "S'il y a de la ",
      phraseApres: " sur la toison seule, et que tout le terrain soit sec, je connaîtrai que tu délivreras Israël.",
      options: ["rosée", "pluie", "neige"],
      motCorrect: "rosée",
      conseilRecherche: "📖 Lis Juges 6:36-40. Vois avec quelle douceur et patience Dieu rassure son serviteur hésitant.",
      explication: "Dieu ne repousse pas nos doutes sincères ; Il fortifie notre foi avec tendresse afin de nous rendre capables de grandes victoires.",
      recompense: { xp: 60, perles: 2 }
    },
    {
      id: 306,
      titre: "Le Regard de Dieu sur le Cœur",
      ref: "1 Samuel 16:7",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 54,
      y: 72,
      type: "order",
      consigne: "Reconstruis la leçon magistrale reçue par Samuel lors de l'onction du futur roi.",
      motsBanque: ["L'homme regarde", "à ce qui frappe les yeux,", "mais l'Éternel", "regarde au cœur."],
      motsCorrects: ["L'homme regarde", "à ce qui frappe les yeux,", "mais l'Éternel", "regarde au cœur."],
      conseilRecherche: "📖 Consulte 1 Samuel 16:1-13. Les frères aînés avaient la stature d'un roi, mais Dieu choisit le jeune berger David.",
      explication: "Les critères du monde valorisent l'apparence et le prestige ; Dieu cherche un cœur sincère, humble et réceptif à son Esprit.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 307,
      titre: "Le Feu au Mont Carmel",
      ref: "1 Rois 18:38",
      difficulte: "avance",
      tempsLimite: 25,
      coutVie: true,
      x: 64,
      y: 58,
      type: "qcm",
      consigne: "Lorsque Élie pria le Dieu vivant au mont Carmel, que consuma le feu tombé du ciel ?",
      options: [
        { text: "L'holocauste, le bois, les pierres, la poussière et l'eau du fossé", correct: true },
        { text: "Seulement l'holocauste sur le bois", correct: false },
        { text: "Les armes des quatre cent cinquante faux prophètes", correct: false }
      ],
      conseilRecherche: "📖 Ouvre 1 Rois 18:30-39. Remarque comment la ferveur de la prière d'Élie démontre la toute-puissance de l'Éternel.",
      explication: "La souveraineté de Dieu consume jusqu'au doute : le peuple s'écria aussitôt : 'C'est l'Éternel qui est Dieu !'.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 308,
      titre: "Le Murmure Doux et Léger",
      ref: "1 Rois 19:12",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 35,
      type: "cloze",
      consigne: "Sous quelle forme intime l'Éternel se manifesta-t-il à Élie découragé à la caverne de l'Horeb ?",
      phraseAvant: "Et après le feu, un ",
      phraseApres: " doux et léger.",
      options: ["murmure", "vent", "soupir"],
      motCorrect: "murmure",
      conseilRecherche: "📖 Lis 1 Rois 19:9-13. Dieu n'était ni dans le vent impétueux, ni dans le tremblement de terre, ni dans le feu.",
      explication: "C'est souvent dans le silence paisible du recueillement intérieur que la voix divine nous rejoint et renouvelle notre vocation.",
      recompense: { xp: 75, perles: 3 }
    },
    {
      id: 309,
      titre: "Les Chars de Feu à Dothan",
      ref: "2 Rois 6:16",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 18,
      coutVie: true,
      x: 82,
      y: 48,
      type: "order",
      consigne: "Reconstitue la réponse inspirée d'Élisée à son serviteur paniqué devant l'armée ennemie.",
      motsBanque: ["Ne crains point,", "car ceux qui sont avec nous", "sont en plus grand nombre", "que ceux qui sont avec eux."],
      motsCorrects: ["Ne crains point,", "car ceux qui sont avec nous", "sont en plus grand nombre", "que ceux qui sont avec eux."],
      conseilRecherche: "📖 Plonge dans 2 Rois 6:14-17. Élisée pria pour que les yeux spirituels de son serviteur s'ouvrent sur l'armée céleste invisible.",
      explication: "La foi ouvre nos yeux spirituels : même cernés d'adversités visibles, nous sommes gardés par des légions invisibles d'anges de paix.",
      recompense: { xp: 80, perles: 4 }
    },
    {
      id: 310,
      titre: "Un Cœur Pur et Renouvelé",
      ref: "Psaume 51:12",
      difficulte: "expert",
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 22,
      type: "cloze",
      consigne: "Complète la prière de repentance sincère de David après sa chute.",
      phraseAvant: "Ô Dieu ! crée en moi un cœur ",
      phraseApres: ", Renouvelle en moi un esprit bien disposé.",
      options: ["pur", "fort", "calme"],
      motCorrect: "pur",
      conseilRecherche: "📖 Médite le Psaume 51:1-12. Le verbe hébreu 'Bara' (créer) est le même qu'en Genèse 1:1 : seul Dieu peut recréer un cœur sans tache.",
      explication: "La grandeur de David ne réside pas dans l'absence de fautes, mais dans sa capacité à se jeter brisé et repentant dans la miséricorde divine.",
      recompense: { xp: 85, perles: 5 }
    }
  ],

  // ÉPOQUE 3 : LOUANGE & SAGESSE (10 étapes : Psaumes, Proverbes, Job, Ecclésiaste)
  sagesse: [
    {
      id: 101,
      titre: "Le Berger bienveillant",
      ref: "Psaume 23:1",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 10,
      y: 78,
      type: "order",
      consigne: "Reconstruis cette prière de confiance intemporelle.",
      motsBanque: ["L'Éternel", "est", "mon berger :", "je ne manquerai", "de rien."],
      motsCorrects: ["L'Éternel", "est", "mon berger :", "je ne manquerai", "de rien."],
      conseilRecherche: "📖 Ouvre le Psaume 23. Contemple les eaux paisibles et les verts pâturages où le Seigneur restaure ton âme.",
      explication: "Dans les joies comme dans les vallées d'ombre, le Seigneur prend soin de nous avec tendresse.",
      recompense: { xp: 30, perles: 1 }
    },
    {
      id: 102,
      titre: "À l'abri du Très-Haut",
      ref: "Psaume 91:1",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 22,
      y: 64,
      type: "cloze",
      consigne: "Où repose celui qui cherche la présence de Dieu ?",
      phraseAvant: "Celui qui demeure sous l'abri du Très-Haut repose à l'",
      phraseApres: " du Tout-Puissant.",
      options: ["ombre", "abri", "amour"],
      motCorrect: "ombre",
      conseilRecherche: "📖 Consulte le Psaume 91:1-4. L'ombre des ailes de Dieu est un rempart contre toute terreur nocturne.",
      explication: "La présence divine est un refuge paisible contre l'anxiété et les tempêtes du monde.",
      recompense: { xp: 35, perles: 1 }
    },
    {
      id: 103,
      titre: "Une lampe sur mon sentier",
      ref: "Psaume 119:105",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 18,
      y: 44,
      type: "qcm",
      consigne: "À quoi le psalmiste compare-t-il la Parole de Dieu ?",
      options: [
        { text: "À une lampe à nos pieds et une lumière sur notre sentier", correct: true },
        { text: "À un fleuve tumultueux", correct: false },
        { text: "À une forteresse de pierres", correct: false }
      ],
      conseilRecherche: "📖 Ouvre le Psaume 119:105. Une lampe à huile antique n'éclairait qu'un seul pas à la fois !",
      explication: "La Bible n'éclaire pas d'un coup tout l'avenir, mais éclaire fidèlement le prochain pas que nous devons poser.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 104,
      titre: "L'Arbre au bord de l'eau",
      ref: "Psaume 1:3",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 32,
      y: 32,
      type: "order",
      consigne: "Reconstruis l'image du juste qui médite jour et nuit la Loi du Seigneur.",
      motsBanque: ["Il est comme un arbre", "planté près d'un courant d'eau,", "qui donne son fruit", "en sa saison."],
      motsCorrects: ["Il est comme un arbre", "planté près d'un courant d'eau,", "qui donne son fruit", "en sa saison."],
      conseilRecherche: "📖 Lis le Psaume 1. Note la promesse : 'Tout ce qu'il fait lui réussit'.",
      explication: "Enracinés dans l'Écriture, nous puisons une vitalité inépuisable même au cœur des saisons de sécheresse.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 105,
      titre: "La Confiance de tout son cœur",
      ref: "Proverbes 3:5",
      difficulte: "intermediaire",
      tempsLimite: 30,
      coutVie: true,
      x: 44,
      y: 50,
      type: "order",
      consigne: "Reconstruis la règle d'or de la vraie sagesse dans la vie pratique.",
      motsBanque: ["Confie-toi en l'Éternel", "de tout ton cœur,", "et ne t'appuie pas", "sur ta sagesse."],
      motsCorrects: ["Confie-toi en l'Éternel", "de tout ton cœur,", "et ne t'appuie pas", "sur ta sagesse."],
      conseilRecherche: "📖 Consulte Proverbes 3:5-6. Reconnais Dieu dans toutes tes voies, et Il aplanira tes sentiers.",
      explication: "Lâcher prise sur nos propres calculs pour faire confiance au discernement divin délivre de l'angoisse stérile.",
      recompense: { xp: 55, perles: 2 }
    },
    {
      id: 106,
      titre: "Les Énigmes du Sage Agur",
      ref: "Proverbes 30:19",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 54,
      y: 72,
      type: "qcm",
      consigne: "Dans les mystères contemplés par le sage Agur (Proverbes 30), laquelle de ces traces énigmatiques mentionne-t-il ?",
      options: [
        { text: "La trace du serpent sur le rocher", correct: true },
        { text: "La trajectoire de la flèche d'argent", correct: false },
        { text: "La trace du cerf dans la clairière", correct: false },
        { text: "Le chemin de l'étoile filante", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Proverbes 30:18-19. Cherche les 4 merveilles : l'aigle dans l'air, le serpent sur le rocher, le navire sur la mer, et l'homme chez la jeune fille !",
      explication: "Le serpent sans pattes avance sur la pierre lisse sans laisser de trace : une observation poétique et subtile de la création qui invite l'homme à l'humilité.",
      recompense: { xp: 60, perles: 3 }
    },
    {
      id: 107,
      titre: "Mon Rédempteur est Vivant",
      ref: "Job 19:25",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 22,
      coutVie: true,
      x: 64,
      y: 58,
      type: "cloze",
      consigne: "Complète le cri de triomphe de Job au sommet de sa souffrance.",
      phraseAvant: "Mais je sais que mon ",
      phraseApres: " est vivant, Et qu'il se lèvera le dernier sur la terre.",
      options: ["rédempteur", "créateur", "berger"],
      motCorrect: "rédempteur",
      conseilRecherche: "📖 Examine Job 19:23-27. Le mot 'Goël' (rédempteur) désigne le défenseur légal et protecteur de l'opprimé.",
      explication: "Au plus profond des larmes et de l'incompréhension, la foi de Job s'accroche à la résurrection et à la justice finale de Dieu.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 108,
      titre: "Le Créateur interroge l'Homme",
      ref: "Job 38:4",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 35,
      type: "order",
      consigne: "Reconstruis l'apostrophe majestueuse de Dieu parlant à Job du milieu de la tempête.",
      motsBanque: ["Où étais-tu", "quand je fondais la terre ?", "Dis-le, si tu as", "de l'intelligence."],
      motsCorrects: ["Où étais-tu", "quand je fondais la terre ?", "Dis-le, si tu as", "de l'intelligence."],
      conseilRecherche: "📖 Plonge dans Job 38:1-11. Vois comment Dieu déroule les mystères des océans, des étoiles et des vents.",
      explication: "Dieu ne donne pas une explication théorique du mal, mais rappelle sa souveraineté et sa sagesse infinie qui soutiennent l'univers.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 109,
      titre: "Un Temps pour Tout",
      ref: "Ecclésiaste 3:1",
      difficulte: "expert",
      tempsLimite: 18,
      coutVie: true,
      x: 82,
      y: 48,
      type: "cloze",
      consigne: "Complète la contemplation du sage sur les rythmes de la vie humaine.",
      phraseAvant: "Il y a un temps pour tout, un temps pour toute chose sous les ",
      phraseApres: " : Il fait toute chose belle en son temps.",
      options: ["cieux", "astres", "monts"],
      motCorrect: "cieux",
      conseilRecherche: "📖 Lis Ecclésiaste 3:1-11. Dieu a aussi mis dans le cœur de l'homme la pensée de l'éternité.",
      explication: "Chaque saison d'épreuve ou d'abondance a son sens : le Seigneur harmonise toutes choses pour notre sanctification.",
      recompense: { xp: 75, perles: 4 }
    },
    {
      id: 110,
      titre: "Bénis l'Éternel, ô mon âme",
      ref: "Psaume 103:2",
      difficulte: "expert",
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 22,
      type: "order",
      consigne: "Reconstruis ce chant d'action de grâce qui guérit le cœur de l'amertume et de l'oubli.",
      motsBanque: ["Mon âme, bénis l'Éternel,", "et n'oublie aucun", "de ses bienfaits !", "C'est lui qui pardonne", "toutes tes iniquités."],
      motsCorrects: ["Mon âme, bénis l'Éternel,", "et n'oublie aucun", "de ses bienfaits !", "C'est lui qui pardonne", "toutes tes iniquités."],
      conseilRecherche: "📖 Ouvre le Psaume 103:1-5. Il guérit toutes tes maladies, Il délivre ta vie de la fosse, Il te couronne de bonté !",
      explication: "La louange intentionnelle fortifie l'âme en gravant dans la mémoire les fidélités passées de notre Dieu.",
      recompense: { xp: 85, perles: 5 }
    }
  ],

  // ÉPOQUE 4 : VOIX D'ESPÉRANCE & PROPHÈTES (10 étapes : Ésaïe, Jérémie, Ézéchiel, Daniel, Michée, Habacuc)
  prophetes: [
    {
      id: 401,
      titre: "Le Prince de la Paix",
      ref: "Ésaïe 9:5",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 10,
      y: 78,
      type: "order",
      consigne: "Reconstruis la prophétie annonçant le Messie d'amour.",
      motsBanque: ["Car un enfant", "nous est né,", "un fils nous est donné,", "on l'appellera", "Prince de la Paix."],
      motsCorrects: ["Car un enfant", "nous est né,", "un fils nous est donné,", "on l'appellera", "Prince de la Paix."],
      conseilRecherche: "📖 Ouvre Ésaïe 9:1-6. Admire les titres prophétiques : Admirable, Conseiller, Dieu puissant, Père éternel, Prince de la Paix.",
      explication: "Ésaïe contemple huit siècles à l'avance la venue du Sauveur qui apporte la vraie paix aux cœurs brisés.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 402,
      titre: "La Fournaise et la Foi",
      ref: "Daniel 3:17",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 22,
      y: 64,
      type: "qcm",
      consigne: "Quelle certitude ont exprimée les trois compagnons de Daniel devant la fournaise ?",
      options: [
        { text: "Notre Dieu peut nous délivrer, et Il nous délivrera de ta main", correct: true },
        { text: "Nous renoncerons à notre foi pour avoir la vie sauve", correct: false },
        { text: "Nous ferons appel aux soldats pour nous défendre", correct: false }
      ],
      conseilRecherche: "📖 Lis Daniel 3:13-25. Dans la fournaise, Nebucadnetsar aperçoit un quatrième homme semblable à un fils des dieux !",
      explication: "Même au milieu des flammes de l'épreuve, le Seigneur marche aux côtés de ceux qui lui demeurent fidèles.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 403,
      titre: "Le Vol de l'Aigle",
      ref: "Ésaïe 40:31",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 18,
      y: 44,
      type: "cloze",
      consigne: "Complète la promesse de restauration pour ceux qui s'attendent à Dieu.",
      phraseAvant: "Ceux qui se confient en l'Éternel renouvellent leur ",
      phraseApres: ". Ils prennent le vol comme les aigles.",
      options: ["force", "patience", "cœur"],
      motCorrect: "force",
      conseilRecherche: "📖 Consulte Ésaïe 40:28-31. Les adolescents chancellent, mais la force divine ne s'épuise jamais.",
      explication: "Dans les moments de fatigue, Dieu accorde un souffle nouveau à qui remet son fardeau entre ses mains.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 404,
      titre: "Des Projets de Paix",
      ref: "Jérémie 29:11",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 32,
      y: 32,
      type: "order",
      consigne: "Reconstruis la lettre d'espérance envoyée par Jérémie aux captifs à Babylone.",
      motsBanque: ["Car je connais", "les projets que j'ai formés", "sur vous, dit l'Éternel,", "projets de paix", "et non de malheur."],
      motsCorrects: ["Car je connais", "les projets que j'ai formés", "sur vous, dit l'Éternel,", "projets de paix", "et non de malheur."],
      conseilRecherche: "📖 Ouvre Jérémie 29:10-14. Dieu promet un avenir et de l'espérance après l'épreuve.",
      explication: "Même en terre d'exil et d'épreuves, les desseins bienveillants de Dieu préparent un relèvement béni.",
      recompense: { xp: 55, perles: 2 }
    },
    {
      id: 405,
      titre: "Le Serviteur Souffrant",
      ref: "Ésaïe 53:5",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 30,
      coutVie: true,
      x: 44,
      y: 50,
      type: "cloze",
      consigne: "Complète la prophétie révélant la substitution salvatrice du Messie pour nos péchés.",
      phraseAvant: "Le châtiment qui nous donne la paix est tombé sur lui, Et c'est par ses ",
      phraseApres: " que nous sommes guéris.",
      options: ["meurtrissures", "prières", "paroles"],
      motCorrect: "meurtrissures",
      conseilRecherche: "📖 Lis Ésaïe 53:1-12. Compare avec la Passion de Jésus dans les Évangiles et 1 Pierre 2:24.",
      explication: "Ésaïe contemple avec une précision surnaturelle le cœur de la Rédemption : nos douleurs portées par l'Innocent.",
      recompense: { xp: 60, perles: 3 }
    },
    {
      id: 406,
      titre: "Les Soixante-dix Semaines",
      ref: "Daniel 9:24",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 54,
      y: 72,
      type: "qcm",
      consigne: "Dans le message de l'ange Gabriel à Daniel, quel est l'un des accomplissements majeurs prévus au terme des 70 semaines ?",
      options: [
        { text: "Mettre fin aux péchés et amener la justice éternelle", correct: true },
        { text: "Rebâtir la tour de Babel", correct: false },
        { text: "Détruire toutes les bibliothèques perses", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Daniel 9:20-27. Gabriel annonce l'expiation de l'iniquité et l'avènement du Messie le Prince.",
      explication: "Cette prophétie capitale balise l'Histoire jusqu'à la venue du Sauveur qui accomplit le salut définitif.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 407,
      titre: "La Vallée des Ossements Desséchés",
      ref: "Ézéchiel 37:4",
      difficulte: "avance",
      tempsLimite: 22,
      coutVie: true,
      x: 64,
      y: 58,
      type: "order",
      consigne: "Reconstitue l'ordre prophétique apportant le souffle de la résurrection là où régnait la mort.",
      motsBanque: ["Ossements desséchés,", "écoutez la parole de l'Éternel !", "Je vais faire entrer", "en vous un esprit,", "et vous vivrez."],
      motsCorrects: ["Ossements desséchés,", "écoutez la parole de l'Éternel !", "Je vais faire entrer", "en vous un esprit,", "et vous vivrez."],
      conseilRecherche: "📖 Lis Ézéchiel 37:1-14. Dieu redonne chair, nerfs et souffle à ce que tout le monde croyait à jamais perdu.",
      explication: "Aucune situation n'est trop désespérée pour la puissance vivifiante de l'Esprit de Dieu.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 408,
      titre: "La Petite Cité de Bethléem",
      ref: "Michée 5:2",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 35,
      type: "cloze",
      consigne: "Quelle humble ville de Juda fut désignée des siècles d'avance comme berceau du Roi d'éternité ?",
      phraseAvant: "Et toi, ",
      phraseApres: " Éphrata, Petite entre les milliers de Juda, De toi sortira pour moi Celui qui dominera sur Israël.",
      options: ["Bethléem", "Jérusalem", "Hébron"],
      motCorrect: "Bethléem",
      conseilRecherche: "📖 Ouvre Michée 5:1-2 (ou 5:2 selon le découpage) et compare avec Matthieu 2:4-6.",
      explication: "Dieu choisit ce qui est petit selon le monde pour confondre les grandeurs humaines et révéler sa grâce.",
      recompense: { xp: 75, perles: 4 }
    },
    {
      id: 409,
      titre: "Le Juste vivra par sa Foi",
      ref: "Habacuc 2:4",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 18,
      coutVie: true,
      x: 82,
      y: 48,
      type: "qcm",
      consigne: "Quelle vérité percutante révélée à Habacuc deviendra le pivot théologique de l'apôtre Paul ?",
      options: [
        { text: "« Le juste vivra par sa foi »", correct: true },
        { text: "« Le fort triomphera par ses armes »", correct: false },
        { text: "« Le riche dominera par son or »", correct: false }
      ],
      conseilRecherche: "📖 Consulte Habacuc 2:1-4, Romains 1:17 et Galates 3:11.",
      explication: "La foi vivante et fidèle en Dieu est le secret de la persévérance et de la justification devant le trône divin.",
      recompense: { xp: 80, perles: 4 }
    },
    {
      id: 410,
      titre: "L'Appel du Prophète : Me Voici",
      ref: "Ésaïe 6:8",
      difficulte: "expert",
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 22,
      type: "order",
      consigne: "Reconstruis la réponse prompte d'Ésaïe purifié dans le temple céleste.",
      motsBanque: ["J'entendis la voix du Seigneur :", "Qui enverrai-je ?", "Et je répondis :", "Me voici,", "envoie-moi."],
      motsCorrects: ["J'entendis la voix du Seigneur :", "Qui enverrai-je ?", "Et je répondis :", "Me voici,", "envoie-moi."],
      conseilRecherche: "📖 Médite Ésaïe 6:1-8. La vision de la sainteté divine suscite la purification, puis l'obéissance joyeuse.",
      explication: "Quand nous prenons conscience de la grandeur et de la miséricorde de Dieu, notre cœur répond avec élan à son appel.",
      recompense: { xp: 90, perles: 5 }
    }
  ],

  // ÉPOQUE 5 : LA BONNE NOUVELLE (12 étapes : Matthieu, Marc, Luc, Jean)
  evangiles: [
    {
      id: 201,
      titre: "La Parole éternelle",
      ref: "Jean 1:1",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 8,
      y: 78,
      type: "order",
      consigne: "Reconstruis l'ouverture lumineuse de l'Évangile selon Jean.",
      motsBanque: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
      motsCorrects: ["Au commencement", "était la Parole,", "et la Parole", "était avec Dieu,", "et la Parole", "était Dieu."],
      conseilRecherche: "📖 Ouvre Jean 1:1-5. Jésus est le Verbe éternel par qui tout a été créé.",
      explication: "Jésus-Christ est le Verbe éternel en qui réside la vie et la véritable lumière des hommes.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 202,
      titre: "L'Amour infini du Père",
      ref: "Jean 3:16",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 18,
      y: 62,
      type: "qcm",
      consigne: "Pour quelle raison Dieu a-t-il donné son Fils unique au monde ?",
      options: [
        { text: "Par amour, pour que quiconque croit ait la vie éternelle", correct: true },
        { text: "Pour juger et condamner le monde", correct: false },
        { text: "Pour éprouver la force des hommes", correct: false }
      ],
      conseilRecherche: "📖 Lis Jean 3:16-17. Le don du Fils est un acte de pure grâce et d'amour inconditionnel.",
      explication: "Le cœur de l'Évangile est un amour pur, sans condition. Jésus est venu pour sauver et restaurer.",
      recompense: { xp: 50, perles: 2 }
    },
    {
      id: 203,
      titre: "Le Pain de Vie",
      ref: "Jean 6:35",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 24,
      y: 42,
      type: "cloze",
      consigne: "Complète la promesse que Jésus fait à ceux qui viennent à Lui.",
      phraseAvant: "Je suis le pain de vie. Celui qui vient à moi n'aura jamais ",
      phraseApres: ".",
      options: ["faim", "peur", "soif"],
      motCorrect: "faim",
      conseilRecherche: "📖 Consulte Jean 6:30-40 après la multiplication des pains.",
      explication: "Jésus comble le vide le plus profond de notre cœur et nous rassasie d'une paix durable.",
      recompense: { xp: 55, perles: 3 }
    },
    {
      id: 204,
      titre: "Le Chemin, la Vérité, la Vie",
      ref: "Jean 14:6",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 34,
      y: 30,
      type: "order",
      consigne: "Reconstruis cette affirmation éclatante du Seigneur Jésus.",
      motsBanque: ["Je suis", "le chemin,", "la vérité,", "et la vie.", "Nul ne vient", "au Père", "que par moi."],
      motsCorrects: ["Je suis", "le chemin,", "la vérité,", "et la vie.", "Nul ne vient", "au Père", "que par moi."],
      conseilRecherche: "📖 Ouvre Jean 14:1-7. Jésus répond aux interrogations troublées de Thomas.",
      explication: "Le Christ n'indique pas seulement une route : Il est Lui-même le chemin vivant vers Dieu.",
      recompense: { xp: 60, perles: 3 }
    },
    {
      id: 205,
      titre: "Les Béatitudes du Royaume",
      ref: "Matthieu 5:3,8",
      difficulte: "intermediaire",
      tempsLimite: 30,
      coutVie: false,
      x: 42,
      y: 50,
      type: "order",
      consigne: "Reconstruis la promesse faite à ceux qui ont le cœur humble et pur.",
      motsBanque: ["Heureux", "les pauvres en esprit,", "car le royaume des cieux", "est à eux !", "Heureux ceux qui ont", "le cœur pur,", "car ils verront Dieu !"],
      motsCorrects: ["Heureux", "les pauvres en esprit,", "car le royaume des cieux", "est à eux !", "Heureux ceux qui ont", "le cœur pur,", "car ils verront Dieu !"],
      conseilRecherche: "📖 Lis Matthieu 5:1-12 sur la montagne. Jésus renverse les valeurs mondaines du pouvoir et de la gloire.",
      explication: "Le vrai bonheur selon le Royaume naît de la simplicité intérieure et de la soif de justice.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 206,
      titre: "Le Cantique des Anges à Bethléem",
      ref: "Luc 2:14",
      difficulte: "intermediaire",
      subtile: true,
      tempsLimite: 28,
      coutVie: false,
      x: 48,
      y: 72,
      type: "cloze",
      consigne: "Complète la louange céleste proclamée aux bergers dans la nuit de la Nativité.",
      phraseAvant: "Gloire à Dieu dans les lieux très hauts, Et ",
      phraseApres: " sur la terre parmi les hommes qu'il agrée !",
      options: ["paix", "lumière", "joie"],
      motCorrect: "paix",
      conseilRecherche: "📖 Ouvre Luc 2:8-14. La gloire de Dieu s'exprime par le don de sa paix bienveillante à l'humanité.",
      explication: "L'incarnation apporte la réconciliation entre le ciel et la terre : Dieu vient habiter au milieu des humbles.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 207,
      titre: "Le Repos pour vos Âmes",
      ref: "Matthieu 11:28",
      difficulte: "avance",
      tempsLimite: 25,
      coutVie: true,
      x: 56,
      y: 55,
      type: "order",
      consigne: "Reconstruis l'invitation la plus tendre de Jésus pour les cœurs accablés.",
      motsBanque: ["Venez à moi,", "vous tous qui êtes fatigués", "et chargés,", "et je vous donnerai", "du repos."],
      motsCorrects: ["Venez à moi,", "vous tous qui êtes fatigués", "et chargés,", "et je vous donnerai", "du repos."],
      conseilRecherche: "📖 Lis Matthieu 11:28-30. Le joug de Jésus est doux et son fardeau léger.",
      explication: "Au milieu de nos tensions quotidiennes, le Christ offre un havre de paix et de renouveau intérieur.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 208,
      titre: "La Transfiguration sur la Montagne",
      ref: "Matthieu 17:3",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 22,
      coutVie: true,
      x: 64,
      y: 34,
      type: "qcm",
      consigne: "Quels personnages de l'Ancien Testament apparurent s'entretenant avec Jésus resplendissant de gloire ?",
      options: [
        { text: "Moïse et Élie (La Loi et les Prophètes)", correct: true },
        { text: "Abraham et David", correct: false },
        { text: "Noé et Daniel", correct: false }
      ],
      conseilRecherche: "📖 Consulte Matthieu 17:1-8 et Luc 9:28-36. Ils parlaient de son départ prochain à Jérusalem.",
      explication: "Moïse et Élie attestent que toute la Loi et tous les Prophètes trouvent leur accomplissement en Jésus.",
      recompense: { xp: 75, perles: 3 }
    },
    {
      id: 209,
      titre: "Le Commandement Nouveau",
      ref: "Jean 13:34",
      difficulte: "avance",
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 52,
      type: "cloze",
      consigne: "Complète le commandement suprême transmis par le Maître après le lavement des pieds.",
      phraseAvant: "Je vous donne un commandement nouveau : Aimez-vous les uns les autres ; comme je vous ai ",
      phraseApres: ", vous aussi, aimez-vous les uns les autres.",
      options: ["aimés", "servis", "gardés"],
      motCorrect: "aimés",
      conseilRecherche: "📖 Ouvre Jean 13:31-35. La mesure de cet amour n'est plus soi-même, mais le don total du Christ.",
      explication: "L'amour sacrificiel et fraternel est la véritable signature du disciple du Seigneur Jésus.",
      recompense: { xp: 80, perles: 4 }
    },
    {
      id: 210,
      titre: "Tout est Accompli",
      ref: "Jean 19:30",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 18,
      coutVie: true,
      x: 80,
      y: 70,
      type: "order",
      consigne: "Reconstruis le cri d'accomplissement parfait prononcé à la croix.",
      motsBanque: ["Quand Jésus eut pris le vinaigre,", "il dit :", "Tout est accompli.", "Et baissant la tête,", "il rendit l'esprit."],
      motsCorrects: ["Quand Jésus eut pris le vinaigre,", "il dit :", "Tout est accompli.", "Et baissant la tête,", "il rendit l'esprit."],
      conseilRecherche: "📖 Médite Jean 19:28-30. En grec 'Tétélesthai' : l'œuvre salvatrice est totalement et définitivement achevée !",
      explication: "À la croix, la dette du péché est payée en totalité : la grâce triomphe et nous ouvre le sanctuaire éternel.",
      recompense: { xp: 85, perles: 4 }
    },
    {
      id: 211,
      titre: "Pourquoi chercher parmi les morts ?",
      ref: "Luc 24:5-6",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 16,
      coutVie: true,
      x: 86,
      y: 45,
      type: "qcm",
      consigne: "Quelle question bouleversante les anges posèrent-ils aux femmes venues au tombeau au matin de Pâques ?",
      options: [
        { text: "« Pourquoi cherchez-vous parmi les morts celui qui est vivant ? Il n'est point ici, mais il est ressuscité »", correct: true },
        { text: "« Pourquoi avez-vous apporté ces aromates sans les gardes ? »", correct: false },
        { text: "« Attendez le soir pour voir paraître la lumière »", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Luc 24:1-12. Le tombeau est vide : la mort est vaincue pour l'éternité !",
      explication: "La résurrection de Jésus est le pilier inébranlable de notre foi : Il est vivant pour toujours.",
      recompense: { xp: 90, perles: 5 }
    },
    {
      id: 212,
      titre: "La Grande Mission & Présence Perpétuelle",
      ref: "Matthieu 28:19-20",
      difficulte: "expert",
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 20,
      type: "order",
      consigne: "Reconstruis l'envoi universel des disciples jusqu'à la fin des temps.",
      motsBanque: ["Allez, faites de toutes", "les nations des disciples,", "et voici, je suis avec vous", "tous les jours,", "jusqu'à la fin du monde."],
      motsCorrects: ["Allez, faites de toutes", "les nations des disciples,", "et voici, je suis avec vous", "tous les jours,", "jusqu'à la fin du monde."],
      conseilRecherche: "📖 Consulte Matthieu 28:16-20. Remarque la promesse de Sa présence continuelle à nos côtés.",
      explication: "Le disciple n'avance jamais seul : le Seigneur Ressuscité marche avec nous chaque jour sur nos sentiers.",
      recompense: { xp: 100, perles: 5 }
    }
  ],

  // ÉPOQUE 6 : L'ÉGLISE EN MARCHE (10 étapes : Actes des Apôtres & Épîtres)
  eglise: [
    {
      id: 501,
      titre: "La Puissance de l'Esprit",
      ref: "Actes 1:8",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 10,
      y: 78,
      type: "cloze",
      consigne: "Complète la promesse de Jésus avant son ascension.",
      phraseAvant: "Vous recevrez une ",
      phraseApres: ", le Saint-Esprit survenant sur vous, et vous serez mes témoins.",
      options: ["puissance", "couronne", "gloire"],
      motCorrect: "puissance",
      conseilRecherche: "📖 Ouvre Actes 1:1-8. L'Esprit rend capable d'être témoin jusqu'aux extrémités de la terre.",
      explication: "L'Église n'avance pas par stratégie humaine mais par le souffle bienfaisant du Saint-Esprit.",
      recompense: { xp: 40, perles: 2 }
    },
    {
      id: 502,
      titre: "Le Plus Grand Don",
      ref: "1 Corinthiens 13:13",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 22,
      y: 64,
      type: "order",
      consigne: "Reconstruis le sommet des vertus spirituelles.",
      motsBanque: ["Trois choses demeurent :", "la foi,", "l'espérance,", "l'amour ;", "mais la plus grande,", "c'est l'amour."],
      motsCorrects: ["Trois choses demeurent :", "la foi,", "l'espérance,", "l'amour ;", "mais la plus grande,", "c'est l'amour."],
      conseilRecherche: "📖 Lis 1 Corinthiens 13. Les dons passent, mais l'amour ne périt jamais.",
      explication: "L'amour fraternel et divin est la marque distinctive du disciple du Christ.",
      recompense: { xp: 55, perles: 3 }
    },
    {
      id: 503,
      titre: "Plus que Vainqueurs",
      ref: "Romains 8:37",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 18,
      y: 44,
      type: "qcm",
      consigne: "Face à toutes les épreuves de la vie, que sommes-nous selon l'apôtre Paul ?",
      options: [
        { text: "Plus que vainqueurs par celui qui nous a aimés", correct: true },
        { text: "Épuisés et sans espérance", correct: false },
        { text: "Condamnés à lutter seuls", correct: false }
      ],
      conseilRecherche: "📖 Consulte Romains 8:31-39. Si Dieu est pour nous, qui sera contre nous ?",
      explication: "Rien ne peut nous séparer de l'amour de Dieu manifesté en Jésus-Christ notre Seigneur.",
      recompense: { xp: 60, perles: 3 }
    },
    {
      id: 504,
      titre: "La Flamme de la Pentecôte",
      ref: "Actes 2:3",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 32,
      y: 32,
      type: "cloze",
      consigne: "Complète la manifestation visible de l'Esprit descendant sur les disciples réunis à Jérusalem.",
      phraseAvant: "Des langues, semblables à des langues de ",
      phraseApres: ", leur apparurent, séparées les unes des autres, et se posèrent sur chacun d'eux.",
      options: ["feu", "lumière", "vent"],
      motCorrect: "feu",
      conseilRecherche: "📖 Ouvre Actes 2:1-11. Le feu de l'Esprit purifie et enflamme le zèle missionnaire.",
      explication: "À la Pentecôte, la promesse du Père s'accomplit : l'Esprit crée une communauté fraternelle unie dans la prière.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 505,
      titre: "L'Autel du Dieu Inconnu à l'Aréopage",
      ref: "Actes 17:23",
      difficulte: "intermediaire",
      subtile: true,
      tempsLimite: 30,
      coutVie: false,
      x: 44,
      y: 50,
      type: "qcm",
      consigne: "En parcourant Athènes, quelle inscription Paul découvrit-il sur un autel pour annoncer le Dieu Créateur ?",
      options: [
        { text: "« À un dieu inconnu »", correct: true },
        { text: "« Au souverain de l'Olympe »", correct: false },
        { text: "« À la sagesse éternelle des philosophes »", correct: false }
      ],
      conseilRecherche: "📖 Lis Actes 17:22-31. Paul part de leur quête spirituelle pour révéler le Dieu en qui nous avons la vie, le mouvement et l'être.",
      explication: "La sagesse de Paul montre comment dialoguer avec respect et vérité pour éclairer la recherche de Dieu chez chacun.",
      recompense: { xp: 70, perles: 3 }
    },
    {
      id: 506,
      titre: "L'Incident d'Antioche",
      ref: "Galates 2:11",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 54,
      y: 72,
      type: "qcm",
      consigne: "À quel apôtre Paul résista-t-il en face à Antioche pour préserver la vérité de l'Évangile sans discrimination ?",
      options: [
        { text: "Céphas (l'apôtre Pierre)", correct: true },
        { text: "Barnabas", correct: false },
        { text: "Apollos", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Galates 2:11-14. Pierre s'était retiré de la table des croyants non-juifs par crainte de certains partisans.",
      explication: "Dans l'Église du Christ, il n'y a plus de barrière ethnique ou rituelle : la grâce unit tous les croyants dans une égale dignité.",
      recompense: { xp: 75, perles: 3 }
    },
    {
      id: 507,
      titre: "Le Fruit de l'Esprit",
      ref: "Galates 5:22",
      difficulte: "avance",
      tempsLimite: 22,
      coutVie: true,
      x: 64,
      y: 58,
      type: "order",
      consigne: "Reconstruis les vertus célestes produites par la vie selon l'Esprit.",
      motsBanque: ["Mais le fruit de l'Esprit,", "c'est l'amour, la joie,", "la paix, la patience,", "la bonté, la bénignité,", "la fidélité, la douceur,", "la tempérance."],
      motsCorrects: ["Mais le fruit de l'Esprit,", "c'est l'amour, la joie,", "la paix, la patience,", "la bonté, la bénignité,", "la fidélité, la douceur,", "la tempérance."],
      conseilRecherche: "📖 Consulte Galates 5:16-25. Remarque le singulier : 'le fruit' forme une grappe harmonieuse et indivisible.",
      explication: "Ce fruit ne résulte pas d'un effort légaliste, mais de la sève du Christ qui transforme nos dispositions intérieures.",
      recompense: { xp: 80, perles: 4 }
    },
    {
      id: 508,
      titre: "L'Armure de Dieu",
      ref: "Éphésiens 6:14",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 35,
      type: "cloze",
      consigne: "Complète la première pièce de l'armure spirituelle donnée pour tenir ferme.",
      phraseAvant: "Tenez donc ferme : ayez à vos reins la vérité pour ",
      phraseApres: " ; revêtez la cuirasse de la justice.",
      options: ["ceinture", "couronne", "glaive"],
      motCorrect: "ceinture",
      conseilRecherche: "📖 Examine Éphésiens 6:10-18. La ceinture maintenait toute la tenue du soldat en place : la vérité est le socle de toute la vie chrétienne.",
      explication: "Vêtus de vérité, de justice et de foi, nous pouvons résister aux ruses du doute et demeurer inébranlables.",
      recompense: { xp: 85, perles: 4 }
    },
    {
      id: 509,
      titre: "La Force en Jésus-Christ",
      ref: "Philippiens 4:13",
      difficulte: "expert",
      tempsLimite: 18,
      coutVie: true,
      x: 82,
      y: 48,
      type: "order",
      consigne: "Reconstruis cette assurance de contentement et de puissance transmise depuis la prison.",
      motsBanque: ["Je puis tout", "par celui", "qui me fortifie,", "Jésus-Christ."],
      motsCorrects: ["Je puis tout", "par celui", "qui me fortifie,", "Jésus-Christ."],
      conseilRecherche: "📖 Ouvre Philippiens 4:10-13. Paul a appris à être rassasié comme à avoir faim : sa paix ne dépend pas des circonstances extérieures.",
      explication: "Le Christ accorde une endurance intérieure capable de traverser les déserts comme les sommets sans vaciller.",
      recompense: { xp: 90, perles: 5 }
    },
    {
      id: 510,
      titre: "L'Hymne Éternel à l'Amour de Dieu",
      ref: "Romains 8:38-39",
      difficulte: "expert",
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 22,
      type: "order",
      consigne: "Reconstruis le serment de triomphe final de l'apôtre Paul.",
      motsBanque: ["J'ai l'assurance", "que ni la mort", "ni la vie,", "ne pourra nous séparer", "de l'amour de Dieu", "en Jésus-Christ."],
      motsCorrects: ["J'ai l'assurance", "que ni la mort", "ni la vie,", "ne pourra nous séparer", "de l'amour de Dieu", "en Jésus-Christ."],
      conseilRecherche: "📖 Médite Romains 8:35-39. Ni les puissances, ni le présent, ni l'avenir n'ont le pouvoir de briser ce lien éternel.",
      explication: "Rien ne peut effacer le rachat accompli à la croix : nous sommes gardés dans les mains d'amour du Père pour toujours.",
      recompense: { xp: 100, perles: 5 }
    }
  ],

  // ÉPOQUE 7 : L'ESPÉRANCE ÉTERNELLE (10 étapes : Apocalypse de Jean)
  esperance: [
    {
      id: 601,
      titre: "La Porte du Cœur",
      ref: "Apocalypse 3:20",
      difficulte: "debutant",
      tempsLimite: 50,
      coutVie: false,
      x: 10,
      y: 78,
      type: "cloze",
      consigne: "Complète l'invitation tendre de Jésus à l'âme.",
      phraseAvant: "Voici, je me tiens à la ",
      phraseApres: " et je frappe. Si quelqu'un entend ma voix et ouvre, j'entrerai chez lui.",
      options: ["porte", "fenêtre", "croisée"],
      motCorrect: "porte",
      conseilRecherche: "📖 Ouvre Apocalypse 3:19-22. Jésus ne force jamais l'entrée : Il attend un accueil libre et confiant.",
      explication: "Jésus ne force jamais l'entrée : Il attend avec douceur que nous Lui ouvrions notre intimité.",
      recompense: { xp: 45, perles: 2 }
    },
    {
      id: 602,
      titre: "Toutes Larmes Essuyées",
      ref: "Apocalypse 21:4",
      difficulte: "debutant",
      tempsLimite: 45,
      coutVie: false,
      x: 22,
      y: 64,
      type: "order",
      consigne: "Reconstruis la promesse ultime de consolation pour l'humanité.",
      motsBanque: ["Il essuiera", "toute larme", "de leurs yeux,", "et la mort", "ne sera plus."],
      motsCorrects: ["Il essuiera", "toute larme", "de leurs yeux,", "et la mort", "ne sera plus."],
      conseilRecherche: "📖 Lis Apocalypse 21:1-5. Il n'y aura plus ni deuil, ni cri, ni douleur : les premières choses ont disparu !",
      explication: "Dans la patrie céleste, le Seigneur pansera chaque blessure et comblera tout manque.",
      recompense: { xp: 65, perles: 3 }
    },
    {
      id: 603,
      titre: "Le Souffle Final : Viens Seigneur Jésus",
      ref: "Apocalypse 22:20",
      difficulte: "intermediaire",
      tempsLimite: 40,
      coutVie: false,
      x: 18,
      y: 44,
      type: "qcm",
      consigne: "Quelle est l'ultime promesse de Jésus et la réponse de l'Église à la fin de la Bible ?",
      options: [
        { text: "« Oui, je viens bientôt. — Amen ! Viens, Seigneur Jésus ! »", correct: true },
        { text: "« Préparez vos glaives et vos armes »", correct: false },
        { text: "« Il faudra attendre mille générations »", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Apocalypse 22:16-21. C'est le dialogue d'amour final entre l'Époux divin et l'Épouse.",
      explication: "Toute l'Écriture se clôt sur un cri d'espérance, de confiance et d'amour.",
      recompense: { xp: 75, perles: 5 }
    },
    {
      id: 604,
      titre: "Le Premier et le Dernier",
      ref: "Apocalypse 1:17-18",
      difficulte: "intermediaire",
      tempsLimite: 35,
      coutVie: false,
      x: 32,
      y: 32,
      type: "order",
      consigne: "Reconstitue la parole souveraine du Christ ressuscité posant sa main droite sur Jean terrassé à Patmos.",
      motsBanque: ["Ne crains point !", "Je suis le premier", "et le dernier,", "et le vivant.", "J'étais mort ;", "et voici, je suis vivant", "aux siècles des siècles."],
      motsCorrects: ["Ne crains point !", "Je suis le premier", "et le dernier,", "et le vivant.", "J'étais mort ;", "et voici, je suis vivant", "aux siècles des siècles."],
      conseilRecherche: "📖 Consulte Apocalypse 1:9-18. Jésus tient les clés de la mort et du séjour des morts.",
      explication: "Devant le Seigneur glorifié, toute frayeur s'évanouit : Il est victorieux de tout mal et tient l'Histoire entre ses mains.",
      recompense: { xp: 75, perles: 3 }
    },
    {
      id: 605,
      titre: "Les Vingt-quatre Vieillards",
      ref: "Apocalypse 4:4",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 30,
      coutVie: true,
      x: 44,
      y: 50,
      type: "qcm",
      consigne: "Dans la vision du trône céleste, combien de vieillards couronnés d'or Jean vit-il assis autour du trône ?",
      options: [
        { text: "Vingt-quatre (24)", correct: true },
        { text: "Douze (12)", correct: false },
        { text: "Sept (7)", correct: false },
        { text: "Quarante (40)", correct: false }
      ],
      conseilRecherche: "📖 Ouvre Apocalypse 4:1-11. Les 24 vieillards symbolisent le peuple de Dieu réuni (12 patriarches et 12 apôtres).",
      explication: "Autour du trône de grâce, les rachetés de l'Ancienne et de la Nouvelle Alliance jettent leurs couronnes en adoration perpétuelle.",
      recompense: { xp: 80, perles: 3 }
    },
    {
      id: 606,
      titre: "L'Agneau Digne d'Ouvrir le Livre",
      ref: "Apocalypse 5:12",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 25,
      coutVie: true,
      x: 54,
      y: 72,
      type: "cloze",
      consigne: "Complète le cantique céleste entonné par les myriades d'anges.",
      phraseAvant: "L'Agneau qui a été immolé est digne de recevoir la ",
      phraseApres: ", la richesse, la sagesse, la force, l'honneur, la gloire, et la louange.",
      options: ["puissance", "vengeance", "foudre"],
      motCorrect: "puissance",
      conseilRecherche: "📖 Lis Apocalypse 5:1-14. Personne dans le ciel ni sur la terre n'était digne d'ouvrir les sceaux, sinon le Lion de la tribu de Juda devenu Agneau immolé !",
      explication: "La victoire finale de Dieu ne s'impose pas par une violence brutale, mais par l'amour immolé et ressuscité de l'Agneau.",
      recompense: { xp: 85, perles: 4 }
    },
    {
      id: 607,
      titre: "Les Deux Témoins & Les Deux Oliviers",
      ref: "Apocalypse 11:4",
      difficulte: "avance",
      subtile: true,
      tempsLimite: 22,
      coutVie: true,
      x: 64,
      y: 58,
      type: "qcm",
      consigne: "À quelles images bibliques les deux témoins prophétiques d'Apocalypse 11 sont-ils comparés ?",
      options: [
        { text: "Aux deux oliviers et aux deux chandeliers debout devant le Seigneur", correct: true },
        { text: "Aux deux cèdres du Liban inébranlables", correct: false },
        { text: "Aux deux lions rugissants du désert", correct: false }
      ],
      conseilRecherche: "📖 Consulte Apocalypse 11:3-4 et Zacharie 4:1-14. L'huile de l'olivier alimente la lumière du chandelier.",
      explication: "Les témoins de Dieu sont alimentés en continu par l'huile de l'Esprit pour briller dans les ténèbres les plus épaisses.",
      recompense: { xp: 90, perles: 4 }
    },
    {
      id: 608,
      titre: "Le Cavalier Fidèle et Véritable",
      ref: "Apocalypse 19:11",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 20,
      coutVie: true,
      x: 72,
      y: 35,
      type: "order",
      consigne: "Reconstruis l'apparition du Roi des rois chevauchant pour triompher définitivement du mal.",
      motsBanque: ["Puis je vis le ciel ouvert,", "et voici, parut un cheval blanc.", "Celui qui le montait", "s'appelle Fidèle et Véritable,", "et il juge et combat", "avec justice."],
      motsCorrects: ["Puis je vis le ciel ouvert,", "et voici, parut un cheval blanc.", "Celui qui le montait", "s'appelle Fidèle et Véritable,", "et il juge et combat", "avec justice."],
      conseilRecherche: "📖 Ouvre Apocalypse 19:11-16. Son nom est la Parole de Dieu, et Il porte sur son vêtement le titre de Roi des rois et Seigneur des seigneurs.",
      explication: "Le triomphe de la sainteté est certain : le mal et le mensonge n'auront pas le dernier mot dans l'Histoire humaine.",
      recompense: { xp: 95, perles: 4 }
    },
    {
      id: 609,
      titre: "L'Alpha et l'Oméga : La Source Gratuite",
      ref: "Apocalypse 21:6",
      difficulte: "expert",
      tempsLimite: 18,
      coutVie: true,
      x: 82,
      y: 48,
      type: "cloze",
      consigne: "Complète le don inestimable accordé par le Seigneur à quiconque a soif de sa présence.",
      phraseAvant: "Je suis l'alpha et l'oméga, le commencement et la fin. À celui qui a ",
      phraseApres: ", je donnerai de la source de l'eau de la vie, gratuitement.",
      options: ["soif", "faim", "peur"],
      motCorrect: "soif",
      conseilRecherche: "📖 Examine Apocalypse 21:5-7 et compare avec Jean 4:14 et Ésaïe 55:1.",
      explication: "La grâce ne s'achète pas avec des mérites humains : elle se reçoit les mains ouvertes par quiconque a soif de Dieu.",
      recompense: { xp: 100, perles: 5 }
    },
    {
      id: 610,
      titre: "Le Fleuve et l'Arbre de Vie",
      ref: "Apocalypse 22:1-2",
      difficulte: "expert",
      subtile: true,
      tempsLimite: 15,
      coutVie: true,
      x: 92,
      y: 22,
      type: "order",
      consigne: "Reconstruis la contemplation finale de la guérison universelle dans la Jérusalem Céleste.",
      motsBanque: ["Et il me montra un fleuve", "d'eau de la vie,", "limpide comme du cristal.", "Sur les deux rives du fleuve,", "il y avait un arbre de vie,", "dont les feuilles servaient", "à la guérison des nations."],
      motsCorrects: ["Et il me montra un fleuve", "d'eau de la vie,", "limpide comme du cristal.", "Sur les deux rives du fleuve,", "il y avait un arbre de vie,", "dont les feuilles servaient", "à la guérison des nations."],
      conseilRecherche: "📖 Plonge dans Apocalypse 22:1-5. L'Arbre de Vie perdu en Genèse 3 est retrouvé dans la Cité sainte pour la guérison éternelle.",
      explication: "La Bible commence dans un jardin où l'accès à l'arbre de vie était fermé et s'achève dans une Cité de lumière où toutes les nations sont guéries et réconciliées en Dieu.",
      recompense: { xp: 120, perles: 5 }
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
