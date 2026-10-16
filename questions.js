/* Défi Jean – banque de 124 questions réparties sur 10 Niveaux
   ---------------------------------------------------------------
   Textes conformes à la LOUIS SEGOND 1910 (domaine public), vérifiés
   sur Wikisource (Bible Segond 1910) et BibleGateway (LSG).

   Règles d'écriture des questions :
   - `level`: numéro du niveau de 1 à 10 (minimum 10 questions par niveau).
   - Pour un « compléter le verset », le champ `verset` ne doit JAMAIS
     contenir la réponse : il est tronqué (…) ou troué (___).
     Le texte complet exact va dans `lecon`, affiché dans le corrigé.
   - `answer: 0` initialement dans la banque brute (l'ordre des options
     est mélangé aléatoirement au moment du tirage de jeu).
   - Exactement 4 options distinctes et non vides partout.
--------------------------------------------------------------- */

const NIVEAUX_DEFI = [
  {
    id: 1,
    titre: "Le Verbe & Les Premiers Témoins",
    livre: "Jean 1 – 2",
    description: "Le prologue céleste, le témoignage de Jean-Baptiste, l'appel des premiers disciples et les noces de Cana.",
    badge: "🕊️"
  },
  {
    id: 2,
    titre: "La Nouvelle Naissance & L'Eau Vive",
    livre: "Jean 3 – 4",
    description: "La visite nocturne de Nicodème, Jean 3:16, le puits de Jacob en Samarie et la guérison du fils de l'officier.",
    badge: "💧"
  },
  {
    id: 3,
    titre: "Béthesda & Le Pain de Vie",
    livre: "Jean 5 – 6",
    description: "Le paralytique guéri un jour de sabbat, la multiplication des pains et Jésus marchant sur la mer.",
    badge: "🍞"
  },
  {
    id: 4,
    titre: "La Lumière & Le Bon Berger",
    livre: "Jean 7 – 10",
    description: "Les fleuves d'eau vive, la femme adultère, l'aveugle-né de Siloé et le Bon Berger qui donne sa vie pour ses brebis.",
    badge: "🐑"
  },
  {
    id: 5,
    titre: "La Résurrection & Le Roi d'Israël",
    livre: "Jean 11 – 12",
    description: "La résurrection de Lazare à Béthanie, l'onction de parfum par Marie et l'entrée triomphale à Jérusalem.",
    badge: "🌿"
  },
  {
    id: 6,
    titre: "La Cène & Le Consolateur",
    livre: "Jean 13 – 17",
    description: "Le lavement des pieds, le commandement nouveau, le cep et les sarments, et la promesse du Saint-Esprit.",
    badge: "🍇"
  },
  {
    id: 7,
    titre: "La Passion & La Victoire Céleste",
    livre: "Jean 18 – 21",
    description: "Gethsémané, devant Pilate, la croix du Calvaire, le tombeau vide, Thomas et la réhabilitation de Pierre.",
    badge: "✝️"
  },
  {
    id: 8,
    titre: "Les Épîtres de Jean : Vérité & Amour",
    livre: "1 Jean, 2 Jean, 3 Jean",
    description: "Marcher dans la lumière, l'amour parfait qui bannit la crainte, la foi victorieuse et l'hospitalité chrétienne.",
    badge: "📜"
  },
  {
    id: 9,
    titre: "L'Apocalypse : Visions & Sept Églises",
    livre: "Apocalypse 1 – 11",
    description: "L'île de Patmos, les lettres aux sept Églises, le trône de Dieu, l'Agneau digne d'ouvrir les sceaux et les trompettes.",
    badge: "🎺"
  },
  {
    id: 10,
    titre: "La Victoire Finale & La Nouvelle Jérusalem",
    livre: "Apocalypse 12 – 22",
    description: "La femme et le dragon, la chute de Babylone, le retour du Roi des rois, la cité d'or et le fleuve de vie éternelle.",
    badge: "👑"
  }
];

const BANQUE_QUESTIONS = [

  /* =========================================================================
     NIVEAU 1 : Le Verbe & Les Premiers Témoins (Jean 1 – 2)
     ========================================================================= */

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:1",
    verset: "Au commencement était la Parole, et la Parole était avec Dieu, et…",
    q: "Comment se termine exactement ce premier verset ?",
    options: ["… et la Parole était Dieu.", "… et la Parole était lumière.", "… et la Parole était la vie.", "… et la Parole était un Esprit."],
    answer: 0,
    lecon: "Jean 1:1 : « Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:3",
    q: "Selon Jean 1:3, qu'est-ce qui a été fait sans la Parole (la Parole créatrice) ?",
    options: ["Rien de ce qui a été fait", "Seulement les ténèbres", "Le monde invisible", "Les cieux"],
    answer: 0,
    lecon: "Jean 1:3 : « Toutes choses ont été faites par elle, et rien de ce qui a été fait n'a été fait sans elle. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:14",
    verset: "Et la Parole a été faite chair, et elle a habité parmi nous,…",
    q: "Complétez cette affirmation de Jean 1:14 :",
    options: ["pleine de grâce et de vérité.", "pleine de gloire et de puissance.", "pleine d'amour et de miséricorde.", "pleine de sagesse et de force."],
    answer: 0,
    lecon: "Jean 1:14 : « Et la Parole a été faite chair, et elle a habité parmi nous, pleine de grâce et de vérité ; et nous avons contemplé sa gloire… »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:17",
    q: "Selon Jean 1:17, la loi a été donnée par Moïse, mais qu'est-ce qui est venu par Jésus-Christ ?",
    options: ["La grâce et la vérité", "La foi et l'espérance", "La justice et le salut", "La paix et la miséricorde"],
    answer: 0,
    lecon: "Jean 1:17 : « Car la loi a été donnée par Moïse, la grâce et la vérité sont venues par Jésus-Christ. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:29",
    q: "Qui prononce ces mots en voyant Jésus venir : « Voici l'Agneau de Dieu, qui ôte le péché du monde » ?",
    options: ["Jean-Baptiste", "André", "Simon Pierre", "Philippe"],
    answer: 0,
    lecon: "Jean 1:29 : « Le lendemain, il vit Jésus venant à lui, et il dit : Voici l'Agneau de Dieu, qui ôte le péché du monde. » C'est le témoignage de Jean-Baptiste." },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:41",
    q: "Quel disciple trouve son frère Simon et lui dit : « Nous avons trouvé le Messie » ?",
    options: ["André", "Philippe", "Jacques", "Nathanaël"],
    answer: 0,
    lecon: "Jean 1:41 : « Il trouva d'abord son frère Simon, et lui dit : Nous avons trouvé le Messie (ce qui signifie Christ). » André parle à Simon Pierre." },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:42",
    q: "Quel nom prophétique Jésus donne-t-il à Simon, fils de Jonas ?",
    options: ["Céphas (ce qui signifie Pierre)", "Boanergès", "Emmanuel", "Israël"],
    answer: 0,
    lecon: "Jean 1:42 : « Tu es Simon, fils de Jonas ; tu seras appelé Céphas (ce qui signifie Pierre). »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:46",
    q: "Qui s'écrie en apprenant la provenance de Jésus : « Peut-il venir de Nazareth quelque chose de bon ? »",
    options: ["Nathanaël", "Thomas", "Nicodème", "André"],
    answer: 0,
    lecon: "Jean 1:46 : « Nathanaël lui dit : Peut-il venir de Nazareth quelque chose de bon ? Philippe lui répondit : Viens, et vois. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 1:48",
    q: "Où Jésus dit-il avoir vu Nathanaël avant que Philippe ne l'appelle ?",
    options: ["Sous le figuier", "Près du fleuve", "Sur la barque", "Au mont des Oliviers"],
    answer: 0,
    lecon: "Jean 1:48 : « Jésus lui répondit : Avant que Philippe t'appelât, quand tu étais sous le figuier, je t'ai vu. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 2:1-11",
    q: "Quel est le tout premier miracle de Jésus rapporté dans l'Évangile de Jean ?",
    options: ["Changer l'eau en vin aux noces de Cana", "Guérir un aveugle-né", "Marcher sur la mer", "Multiplier les pains"],
    answer: 0,
    lecon: "Jean 2:11 : « Tel fut, à Cana en Galilée, le premier des miracles que fit Jésus ; il manifesta sa gloire, et ses disciples crurent en lui. »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 2:13-16",
    q: "Que fait Jésus dans le temple de Jérusalem au chapitre 2 de Jean ?",
    options: ["Il chasse les vendeurs et les changeurs avec un fouet", "Il enseigne la prière du Notre Père", "Il guérit un paralytique près de l'autel", "Il se cache de la foule"],
    answer: 0,
    lecon: "Jean 2:15 : « Ayant fait un fouet avec des cordes, il les chassa tous du temple, ainsi que les brebis et les bœufs ; il dispersa la monnaie des changeurs… »" },

  { level: 1, theme: "Évangile de Jean", ref: "Jean 2:19-21",
    q: "Quand Jésus déclare « Détruisez ce temple, et en trois jours je le relèverai », de quoi parlait-il ?",
    options: ["Du temple de son corps", "Du temple de pierre d'Hérode", "De la ville de Jérusalem", "De la synagogue de Capernaüm"],
    answer: 0,
    lecon: "Jean 2:21 : « Mais il parlait du temple de son corps. »" },

  /* =========================================================================
     NIVEAU 2 : La Nouvelle Naissance & L'Eau Vive (Jean 3 – 4)
     ========================================================================= */

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:1-2",
    q: "Qui vient trouver Jésus de nuit pour s'entretenir avec lui au chapitre 3 ?",
    options: ["Nicodème, un chef des Juifs", "Joseph d'Arimathée", "Gamaliel", "Simon le lépreux"],
    answer: 0,
    lecon: "Jean 3:1-2 : « Il y eut un homme d'entre les pharisiens, nommé Nicodème, un chef des Juifs, qui vint, lui, auprès de Jésus, de nuit… »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:3",
    verset: "En vérité, en vérité, je te le dis, si un homme ne naît de nouveau,…",
    q: "Que dit Jésus à Nicodème à propos de la nouvelle naissance ?",
    options: ["il ne peut voir le royaume de Dieu.", "il ne peut entrer dans le temple.", "il n'aura point de part avec moi.", "il demeurera dans les ténèbres."],
    answer: 0,
    lecon: "Jean 3:3 : « Jésus lui répondit : En vérité, en vérité, je te le dis, si un homme ne naît de nouveau, il ne peut voir le royaume de Dieu. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:8",
    verset: "Le vent souffle où il veut, et tu en entends le bruit ; mais…",
    q: "Complétez cette parole de Jésus comparant l'Esprit au vent :",
    options: ["tu ne sais d'où il vient, ni où il va.", "tu ne peux ni l'arrêter ni le saisir.", "sa force dépasse toute mesure humaine.", "nul homme ne peut le voir."],
    answer: 0,
    lecon: "Jean 3:8 : « Le vent souffle où il veut, et tu en entends le bruit ; mais tu ne sais d'où il vient, ni où il va. Il en est ainsi de tout homme qui est né de l'Esprit. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:14",
    q: "À quel événement de l'Ancien Testament Jésus compare-t-il l'élévation du Fils de l'homme ?",
    options: ["Moïse élevant le serpent dans le désert", "Le sacrifice d'Abraham sur le mont Morija", "L'arche de Noé voguant sur les eaux", "Élie montant au ciel dans un tourbillon"],
    answer: 0,
    lecon: "Jean 3:14 : « Et comme Moïse éleva le serpent dans le désert, il faut de même que le Fils de l'homme soit élevé. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:16",
    verset: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique,…",
    q: "Complétez ce verset emblématique de l'Évangile :",
    options: ["afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.", "afin de juger le monde et d'établir sa justice sur toute la terre.", "afin que tous les peuples se prosternent et le glorifient.", "afin d'enseigner la vérité à ceux qui le cherchent d'un cœur pur."],
    answer: 0,
    lecon: "Jean 3:16 : « Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 3:30",
    q: "Quelle parole célèbre Jean-Baptiste prononce-t-il au sujet de Jésus en Jean 3:30 ?",
    options: ["« Il faut qu'il croisse, et que je diminue. »", "« Je ne suis pas digne de délier la courroie de ses souliers. »", "« Voici le roi d'Israël, humble et monté sur un âne. »", "« Nul homme n'a jamais parlé comme cet homme. »"],
    answer: 0,
    lecon: "Jean 3:30 : « Il faut qu'il croisse, et que je diminue. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:6-7",
    q: "Près de quel lieu précis en Samarie Jésus s'assied-il pour dialoguer avec la femme samaritaine ?",
    options: ["Le puits de Jacob", "Le Jourdain", "Le lac de Tibériade", "La fontaine de Siloé"],
    answer: 0,
    lecon: "Jean 4:6 : « Là se trouvait le puits de Jacob. Jésus, fatigué du voyage, était assis au bord du puits. C'était environ la sixième heure. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:14",
    verset: "Mais celui qui boira de l'eau que je lui donnerai n'aura jamais soif, et l'eau que je lui donnerai…",
    q: "Que deviendra en lui l'eau donnée par Jésus ?",
    options: ["deviendra en lui une source d'eau qui jaillira jusque dans la vie éternelle.", "effacera toutes ses souffrances et renouvellera ses forces chaque matin.", "le sanctifiera entièrement pour le jour du Seigneur.", "coulera comme un fleuve de paix au milieu de son âme."],
    answer: 0,
    lecon: "Jean 4:14 : « Mais celui qui boira de l'eau que je lui donnerai n'aura jamais soif, et l'eau que je lui donnerai deviendra en lui une source d'eau qui jaillira jusque dans la vie éternelle. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:18",
    q: "Combien de maris Jésus révèle-t-il que la femme samaritaine a eus dans sa vie ?",
    options: ["Cinq", "Trois", "Quatre", "Sept"],
    answer: 0,
    lecon: "Jean 4:18 : « Car tu as eu cinq maris, et celui que tu as maintenant n'est pas ton mari. En cela tu as dit vrai. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:24",
    verset: "Dieu est Esprit, et il faut que ceux qui l'adorent…",
    q: "Comment les vrais adorateurs doivent-ils adorer le Père ?",
    options: ["l'adorent en esprit et en vérité.", "l'adorent d'un cœur humble et brisé.", "l'adorent en offrant des louanges continuelles.", "l'adorent sur la montagne sainte."],
    answer: 0,
    lecon: "Jean 4:24 : « Dieu est Esprit, et il faut que ceux qui l'adorent l'adorent en esprit et en vérité. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:35",
    q: "Que dit Jésus à ses disciples en Jean 4:35 en regardant les champs ?",
    options: ["« Ils blanchissent déjà pour la moisson. »", "« La moisson est grande mais il y a peu d'ouvriers. »", "« Semez avec larmes et vous récolterez avec chants d'allégresse. »", "« L'ivraie sera brûlée au dernier jour. »"],
    answer: 0,
    lecon: "Jean 4:35 : « Ne dites-vous pas qu'il y a encore quatre mois jusqu'à la moisson ? Voici, je vous le dis, levez les yeux, et regardez les champs qui déjà blanchissent pour la moisson. »" },

  { level: 2, theme: "Évangile de Jean", ref: "Jean 4:46-54",
    q: "Quel est le deuxième miracle accompli par Jésus à son retour de Judée en Galilée ?",
    options: ["La guérison à distance du fils d'un officier du roi", "La résurrection de la fille de Jaïrus", "La guérison du lépreux", "L'apaisement de la tempête"],
    answer: 0,
    lecon: "Jean 4:54 : « Jésus fit encore ce second miracle lorsqu'il fut venu de Judée en Galilée. » (Guérison du fils de l'officier du roi alité à Capernaüm)." },

  /* =========================================================================
     NIVEAU 3 : Béthesda & Le Pain de Vie (Jean 5 – 6)
     ========================================================================= */

  { level: 3, theme: "Évangile de Jean", ref: "Jean 5:2",
    q: "Comment s'appelle en hébreu la piscine de Jérusalem ayant cinq portiques près de la porte des brebis ?",
    options: ["Béthesda", "Siloé", "Gihon", "Cédron"],
    answer: 0,
    lecon: "Jean 5:2 : « Or, à Jérusalem, près de la porte des brebis, il y a une piscine qui s'appelle en hébreu Béthesda, et qui a cinq portiques. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 5:5",
    q: "Depuis combien d'années l'homme infirme guéri par Jésus à Béthesda était-il malade ?",
    options: ["38 ans", "12 ans", "40 ans", "18 ans"],
    answer: 0,
    lecon: "Jean 5:5 : « Là se trouvait un homme malade depuis trente-huit ans. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 5:8-10",
    q: "Pourquoi les chefs des Juifs reprochèrent-ils à l'homme guéri de porter son lit ?",
    options: ["Parce que ce jour-là était un jour de sabbat", "Parce qu'il était devant le sanctuaire", "Parce que le lit était considéré comme impur", "Parce qu'il n'avait pas payé l'offrande prescrite"],
    answer: 0,
    lecon: "Jean 5:9-10 : « C'était un jour de sabbat. Les Juifs dirent donc à celui qui avait été guéri : C'est le sabbat ; il ne t'est pas permis d'emporter ton lit. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 5:24",
    verset: "En vérité, en vérité, je vous le dis, celui qui écoute ma parole, et qui croit à celui qui m'a envoyé,…",
    q: "Quelle promesse Jésus fait-il à celui qui croit ?",
    options: ["a la vie éternelle et ne vient point en jugement, mais il est passé de la mort à la vie.", "recevra une couronne d'or et verra les anges de Dieu monter et descendre.", "sera préservé de toute épreuve et guérira de toutes ses infirmités.", "sera assis sur douze trônes pour juger les douze tribus."],
    answer: 0,
    lecon: "Jean 5:24 : « En vérité, en vérité, je vous le dis, celui qui écoute ma parole, et qui croit à celui qui m'a envoyé, a la vie éternelle et ne vient point en jugement, mais il est passé de la mort à la vie. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 5:39",
    q: "Que dit Jésus aux Juifs au sujet des Écritures en Jean 5:39 ?",
    options: ["« Ce sont elles qui rendent témoignage de moi. »", "« Nul ne peut les comprendre sans la loi des pères. »", "« Elles passeront, mais mes paroles ne passeront point. »", "« Moïse seul en possède la clé. »"],
    answer: 0,
    lecon: "Jean 5:39 : « Vous sondez les Écritures, parce que vous pensez avoir en elles la vie éternelle : ce sont elles qui rendent témoignage de moi. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:9",
    q: "Que possédait le jeune garçon mentionné par André lors de la multiplication des pains ?",
    options: ["Cinq pains d'orge et deux poissons", "Sept pains et quelques petits poissons", "Trois pains et un poisson", "Douze pains sans levain"],
    answer: 0,
    lecon: "Jean 6:9 : « Il y a ici un jeune garçon qui a cinq pains d'orge et deux poissons ; mais qu'est-ce que cela pour tant de gens ? »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:10",
    q: "Combien d'hommes s'assirent dans l'herbe pour ce repas miraculeux en Jean 6:10 ?",
    options: ["Environ cinq mille", "Environ quatre mille", "Environ trois mille", "Environ sept mille"],
    answer: 0,
    lecon: "Jean 6:10 : « Jésus dit : Faites-les asseoir. Il y avait dans ce lieu beaucoup d'herbe. Ils s'assirent donc, au nombre d'environ cinq mille hommes. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:13",
    q: "Combien de paniers furent remplis avec les morceaux restants des cinq pains d'orge ?",
    options: ["Douze paniers", "Sept corbeilles", "Trois paniers", "Dix corbeilles"],
    answer: 0,
    lecon: "Jean 6:13 : « Ils les ramassèrent donc, et ils remplirent douze paniers avec les morceaux qui restèrent des cinq pains d'orge, après que tous eurent mangé. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:19-20",
    q: "Que dit Jésus à ses disciples effrayés lorsqu'il s'approche de leur barque en marchant sur la mer ?",
    options: ["« C'est moi ; n'ayez pas peur ! »", "« Hommes de peu de foi, pourquoi doutez-vous ? »", "« Soyez dans la paix, le vent va cesser ! »", "« Regardez mes mains et mes pieds ! »"],
    answer: 0,
    lecon: "Jean 6:20 : « Mais Jésus leur dit : C'est moi ; n'ayez pas peur ! »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:35",
    verset: "Jésus leur dit : Je suis le pain de vie. Celui qui vient à moi n'aura jamais faim, et…",
    q: "Comment se termine cette déclaration solennelle ?",
    options: ["celui qui croit en moi n'aura jamais soif.", "celui qui marche avec moi ne trébuchera point.", "celui qui me suit recevra la couronne incorruptible.", "je le ressusciterai dans la paix de mon royaume."],
    answer: 0,
    lecon: "Jean 6:35 : « Jésus leur dit : Je suis le pain de vie. Celui qui vient à moi n'aura jamais faim, et celui qui croit en moi n'aura jamais soif. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:63",
    verset: "C'est l'esprit qui vivifie ; la chair ne sert de rien. Les paroles que je vous ai dites…",
    q: "Que sont les paroles de Jésus selon Jean 6:63 ?",
    options: ["sont esprit et vie.", "sont vérité et sainteté.", "sont lumière et force.", "sont un bouclier et une forteresse."],
    answer: 0,
    lecon: "Jean 6:63 : « C'est l'esprit qui vivifie ; la chair ne sert de rien. Les paroles que je vous ai dites sont esprit et vie. »" },

  { level: 3, theme: "Évangile de Jean", ref: "Jean 6:68",
    q: "Que répond Simon Pierre lorsque Jésus demande aux Douze : « Et vous, ne voulez-vous pas aussi vous en aller ? »",
    options: ["« Seigneur, à qui irions-nous ? Tu as les paroles de la vie éternelle. »", "« Nous avons tout quitté pour te suivre jusqu'au bout. »", "« Tu es le Fils de Dieu, nous ne te trahirons jamais. »", "« Seigneur, montre-nous le Père, et cela nous suffit. »"],
    answer: 0,
    lecon: "Jean 6:68 : « Simon Pierre lui répondit : Seigneur, à qui irions-nous ? Tu as les paroles de la vie éternelle. »" },

  /* =========================================================================
     NIVEAU 4 : La Lumière & Le Bon Berger (Jean 7 – 10)
     ========================================================================= */

  { level: 4, theme: "Évangile de Jean", ref: "Jean 7:37-38",
    verset: "Si quelqu'un a soif, qu'il vienne à moi, et qu'il boive. Celui qui croit en moi,…",
    q: "Que dit l'Écriture au sujet de celui qui croit en Jésus ?",
    options: ["des fleuves d'eau vive couleront de son sein.", "il ne mourra jamais mais contemplera la face de Dieu.", "sa descendance possédera la terre promise.", "les anges le soutiendront de leurs mains."],
    answer: 0,
    lecon: "Jean 7:38 : « Celui qui croit en moi, des fleuves d'eau vive couleront de son sein, comme dit l'Écriture. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 8:7",
    q: "Que répond Jésus aux scribes et pharisiens amenant la femme surprise en flagrant délit d'adultère ?",
    options: ["« Que celui de vous qui est sans péché jette le premier la pierre contre elle. »", "« La loi de Moïse s'applique à tous sans distinction. »", "« Allez et apprenez ce que signifie : Je prends plaisir à la miséricorde. »", "« Femme, où sont ceux qui t'accusaient ? »"],
    answer: 0,
    lecon: "Jean 8:7 : « Comme ils continuaient à l'interroger, il se releva et leur dit : Que celui de vous qui est sans péché jette le premier la pierre contre elle. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 8:11",
    q: "Que dit Jésus à la femme une fois tous ses accusateurs retirés en Jean 8:11 ?",
    options: ["« Je ne te condamne pas non plus : va, et ne pèche plus. »", "« Ta foi t'a sauvée, sois en paix. »", "« Offre pour ta purification ce que Moïse a prescrit. »", "« Rends grâce à Dieu dans le temple. »"],
    answer: 0,
    lecon: "Jean 8:11 : « Et Jésus lui dit : Je ne te condamne pas non plus : va, et ne pèche plus. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 8:12",
    verset: "Je suis la lumière du monde ; celui qui me suit ne marchera pas dans les ténèbres, mais…",
    q: "Que possédera celui qui suit Jésus ?",
    options: ["il aura la lumière de la vie.", "il habitera dans la cité de Dieu.", "il ne sera jamais confus.", "sa lumière brillera devant tous les hommes."],
    answer: 0,
    lecon: "Jean 8:12 : « Jésus leur parla de nouveau, et dit : Je suis la lumière du monde ; celui qui me suit ne marchera pas dans les ténèbres, mais il aura la lumière de la vie. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 8:32",
    verset: "Vous connaîtrez la vérité, et…",
    q: "Complétez cette maxime célèbre de Jésus aux Juifs qui avaient cru en lui :",
    options: ["la vérité vous affranchira.", "la vérité vous purifiera.", "la vérité vous sanctifiera.", "la vérité régnera dans vos cœurs."],
    answer: 0,
    lecon: "Jean 8:32 : « Vous connaîtrez la vérité, et la vérité vous affranchira. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 8:58",
    q: "Quelle parole solennelle Jésus prononce-t-il devant les Juifs au sujet d'Abraham en Jean 8:58 ?",
    options: ["« En vérité, en vérité, je vous le dis, avant qu'Abraham fût, je suis. »", "« Abraham a vu mon jour et il s'est réjoui de loin. »", "« Dieu peut de ces pierres susciter des enfants à Abraham. »", "« Si vous étiez enfants d'Abraham, vous feriez les œuvres d'Abraham. »"],
    answer: 0,
    lecon: "Jean 8:58 : « Jésus leur dit : En vérité, en vérité, je vous le dis, avant qu'Abraham fût, je suis. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 9:1-7",
    q: "Où Jésus envoie-t-il l'aveugle-né se laver après lui avoir appliqué de la boue sur les yeux ?",
    options: ["À la piscine de Siloé (ce qui signifie Envoyé)", "À la piscine de Béthesda", "Au fleuve Jourdain", "Au torrent de Cédron"],
    answer: 0,
    lecon: "Jean 9:7 : « Et lui dit : Va, et lave-toi au réservoir de Siloé (nom qui signifie envoyé). Il y alla, se lava, et s'en retourna voyant clair. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 9:25",
    q: "Que répond l'aveugle guéri aux pharisiens insistant sur le fait que Jésus serait un pécheur ?",
    options: ["« Je sais une chose, c'est que j'étais aveugle et que maintenant je vois. »", "« Il a ouvert mes yeux, comment osez-vous le condamner ? »", "« C'est un prophète, écoutez-le donc ! »", "« Jamais homme n'a fait de tels prodiges en Israël. »"],
    answer: 0,
    lecon: "Jean 9:25 : « Il répondit : S'il est un pécheur, je ne sais ; je sais une chose, c'est que j'étais aveugle et que maintenant je vois. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 10:9",
    verset: "Je suis la porte. Si quelqu'un entre par moi,…",
    q: "Que dit Jésus concernant la porte des brebis ?",
    options: ["il sera sauvé ; il entrera et il sortira, et il trouvera des pâturages.", "il recevra le pardon de ses fautes et la grâce de l'Éternel.", "les bêtes sauvages ne pourront l'atteindre ni lui nuire.", "il n'aura plus d'inquiétude pour le lendemain."],
    answer: 0,
    lecon: "Jean 10:9 : « Je suis la porte. Si quelqu'un entre par moi, il sera sauvé ; il entrera et il sortira, et il trouvera des pâturages. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 10:10",
    q: "Complétez : « Le voleur ne vient que pour dérober, égorger et détruire ; moi, je suis venu afin que les brebis… »",
    options: ["aient la vie, et qu'elles soient dans l'abondance.", "soient préservées de la main du méchant.", "retrouvent le chemin de la bergerie sainte.", "deviennent un seul troupeau sous un seul berger."],
    answer: 0,
    lecon: "Jean 10:10 : « Le voleur ne vient que pour dérober, égorger et détruire ; moi, je suis venu afin que les brebis aient la vie, et qu'elles soient dans l'abondance. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 10:11",
    q: "Que fait le Bon Berger pour ses brebis selon Jean 10:11 ?",
    options: ["Il donne sa vie pour ses brebis", "Il les conduit vers des eaux paisibles", "Il leur enseigne les psaumes", "Il les défend avec une verge de fer"],
    answer: 0,
    lecon: "Jean 10:11 : « Je suis le bon berger. Le bon berger donne sa vie pour ses brebis. »" },

  { level: 4, theme: "Évangile de Jean", ref: "Jean 10:30",
    verset: "Moi et le Père…",
    q: "Quelle déclaration de Jésus en Jean 10:30 provoqua la colère des Juifs ?",
    options: ["nous sommes un.", "nous sommes deux témoins.", "nous régnons sur le ciel.", "nous demeurons éternellement."],
    answer: 0,
    lecon: "Jean 10:30 : « Moi et le Père nous sommes un. »" },

  /* =========================================================================
     NIVEAU 5 : La Résurrection & Le Roi d'Israël (Jean 11 – 12)
     ========================================================================= */

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:1-2",
    q: "Dans quel village habitaient Lazare et ses deux sœurs Marie et Marthe ?",
    options: ["À Béthanie", "À Emmaüs", "À Bethsaïda", "À Jéricho"],
    answer: 0,
    lecon: "Jean 11:1 : « Il y avait un homme malade, Lazare, de Béthanie, village de Marie et de Marthe, sa sœur. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:11",
    q: "Comment Jésus qualifie-t-il l'état de Lazare devant ses disciples avant de partir pour la Judée ?",
    options: ["« Notre ami Lazare dort ; mais je vais le réveiller. »", "« Il a quitté la tente terrestre de son pèlerinage. »", "« Son âme s'est envolée vers le sein d'Abraham. »", "« L'ennemi a frappé sa maison de tristesse. »"],
    answer: 0,
    lecon: "Jean 11:11 : « Après ces paroles, il leur dit : Lazare, notre ami, dort ; mais je vais le réveiller. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:25",
    verset: "Jésus lui dit : Je suis la résurrection et la vie. Celui qui croit en moi…",
    q: "Que promet Jésus à Marthe en Jean 11:25 ?",
    options: ["vivra, quand même il serait mort.", "ne connaîtra point l'angoisse du sépulcre.", "sera couronné de justice éternelle.", "verra s'ouvrir les portes des cieux."],
    answer: 0,
    lecon: "Jean 11:25 : « Jésus lui dit : Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:35",
    q: "Quel est le texte exact de Jean 11:35, le verset le plus court du Nouveau Testament ?",
    options: ["Jésus pleura.", "Jésus pria.", "Jésus soupira.", "Jésus s'écria."],
    answer: 0,
    lecon: "Jean 11:35 : « Jésus pleura. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:39",
    q: "Depuis combien de jours Lazare était-il dans le sépulcre quand Jésus demanda d'ôter la pierre ?",
    options: ["Quatre jours", "Trois jours", "Sept jours", "Deux jours"],
    answer: 0,
    lecon: "Jean 11:39 : « Marthe, la sœur du mort, lui dit : Seigneur, il sent déjà, car il y a quatre jours qu'il est là. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:43",
    q: "Quel ordre Jésus cria-t-il d'une voix forte devant le sépulcre de Béthanie ?",
    options: ["« Lazare, sors ! »", "« Lève-toi et marche ! »", "« Que la vie revienne en toi ! »", "« Réveille-toi d'entre les morts ! »"],
    answer: 0,
    lecon: "Jean 11:43 : « Ayant dit cela, il cria d'une voix forte : Lazare, sors ! »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 11:49-50",
    q: "Quelle parole prophétique le souverain sacrificateur Caïphe prononce-t-il cette année-là ?",
    options: ["« Il est de votre intérêt qu'un seul homme meure pour le peuple. »", "« Ne touchez point à cet innocent de peur d'attirer la colère de Rome. »", "« Cet homme fait beaucoup de miracles que personne ne peut nier. »", "« Attendons le signe du ciel avant de juger. »"],
    answer: 0,
    lecon: "Jean 11:49-50 : « Caïphe, qui était souverain sacrificateur cette année-là, leur dit : Vous n'y comprenez rien ; vous ne réfléchissez pas qu'il est de votre intérêt qu'un seul homme meure pour le peuple, et que la nation entière ne périsse pas. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 12:3",
    q: "Que fait Marie, sœur de Lazare, lors du souper donné à Béthanie en Jean 12:3 ?",
    options: ["Elle oint les pieds de Jésus d'un parfum de nard pur et les essuie avec ses cheveux", "Elle lave les mains des apôtres avec de l'huile de myrrhe", "Elle verse des larmes et brise une coupe d'albâtre sur sa tête", "Elle prépare le repas pascal pour les Douze"],
    answer: 0,
    lecon: "Jean 12:3 : « Marie, ayant pris une livre d'un parfum de nard pur de grand prix, oignit les pieds de Jésus, et elle les essuya avec ses cheveux ; et la maison fut remplie de l'odeur du parfum. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 12:4-6",
    q: "Pourquoi Judas Iscariot s'indigna-t-il du parfum répandu sur Jésus selon Jean 12:6 ?",
    options: ["Parce qu'il était voleur et qu'il tenait la bourse", "Parce qu'il voulait vraiment secourir les pauvres", "Parce que la loi interdisait ce parfum chez les Juifs", "Parce que le nard était réservé aux prêtres du temple"],
    answer: 0,
    lecon: "Jean 12:6 : « Il disait cela, non qu'il se souciât des pauvres, mais parce qu'il était voleur, et que, tenant la bourse, il prenait ce qu'on y mettait. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 12:13",
    verset: "Ils prirent des branches de palmiers, et allèrent au-devant de lui, en criant :…",
    q: "Que criait la foule lors de l'entrée triomphale de Jésus à Jérusalem ?",
    options: ["Hosanna ! Béni soit celui qui vient au nom du Seigneur, le roi d'Israël !", "Gloire à Dieu au plus haut des cieux, et paix sur la terre !", "Béni soit le Fils de David qui vient délivrer Sion du joug des Romains !", "Voici notre libérateur, le prophète puissant en œuvres et en paroles !"],
    answer: 0,
    lecon: "Jean 12:13 : « Ils prirent des branches de palmiers, et allèrent au-devant de lui, en criant : Hosanna ! Béni soit celui qui vient au nom du Seigneur, le roi d'Israël ! »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 12:24",
    verset: "En vérité, en vérité, je vous le dis, si le grain de blé qui est tombé en terre ne meurt,…",
    q: "Complétez cette parabole du grain de blé :",
    options: ["il reste seul ; mais, s'il meurt, il porte beaucoup de fruit.", "il est emporté par le vent et ne produit nulle racine.", "les oiseaux du ciel s'en nourrissent sans profit.", "il pourrit sans laisser de postérité."],
    answer: 0,
    lecon: "Jean 12:24 : « En vérité, en vérité, je vous le dis, si le grain de blé qui est tombé en terre ne meurt, il reste seul ; mais, s'il meurt, il porte beaucoup de fruit. »" },

  { level: 5, theme: "Évangile de Jean", ref: "Jean 12:32",
    verset: "Et moi, quand j'aurai été élevé de la terre,…",
    q: "Que promet Jésus en Jean 12:32 à propos de son élévation ?",
    options: ["j'attirerai tous les hommes à moi.", "je jugerai le prince de ce monde avec justice.", "j'enverrai mes anges aux quatre vents.", "je détruirai la mort pour toujours."],
    answer: 0,
    lecon: "Jean 12:32 : « Et moi, quand j'aurai été élevé de la terre, j'attirerai tous les hommes à moi. »" },

  /* =========================================================================
     NIVEAU 6 : La Cène & Le Consolateur (Jean 13 – 17)
     ========================================================================= */

  { level: 6, theme: "Évangile de Jean", ref: "Jean 13:5",
    q: "Quel geste d'humilité bouleversant Jésus accomplit-il avant le repas de la Pâque en Jean 13:5 ?",
    options: ["Il lave les pieds de ses disciples et les essuie avec un linge", "Il rompt le pain et le distribue aux pauvres de la rue", "Il s'agenouille pour confesser les fautes du peuple", "Il oignit la tête de Jean d'huile d'olive pure"],
    answer: 0,
    lecon: "Jean 13:5 : « Ensuite il versa de l'eau dans un bassin, et il se mit à laver les pieds des disciples, et à les essuyer avec le linge dont il était ceint. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 13:23",
    q: "Comment l'Évangile désigne-t-il le disciple qui était couché sur le sein de Jésus pendant la Cène ?",
    options: ["« Celui que Jésus aimait »", "« Le premier des apôtres »", "« Le serviteur fidèle »", "« L'ami fidèle de Béthanie »"],
    answer: 0,
    lecon: "Jean 13:23 : « Un des disciples, celui que Jésus aimait, était couché sur le sein de Jésus. » (Traditionnellement identifié à l'apôtre Jean)." },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 13:34",
    verset: "Je vous donne un commandement nouveau : Aimez-vous les uns les autres ;…",
    q: "Complétez la fin de ce commandement nouveau :",
    options: ["comme je vous ai aimés, vous aussi, aimez-vous les uns les autres.", "afin que le monde entier reconnaisse ma gloire.", "car l'amour est l'accomplissement suprême de la loi de Moïse.", "et la paix de Dieu gardera vos cœurs en tout temps."],
    answer: 0,
    lecon: "Jean 13:34 : « Je vous donne un commandement nouveau : Aimez-vous les uns les autres ; comme je vous ai aimés, vous aussi, aimez-vous les uns les autres. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 13:38",
    q: "Quel avertissement Jésus donne-t-il à Pierre qui affirmait vouloir donner sa vie pour lui ?",
    options: ["« Le coq ne chantera pas que tu ne m'aies renié trois fois. »", "« Satan t'a réclamé pour te cribler comme le froment. »", "« Tu ne peux pas me suivre maintenant, mais tu me suivras plus tard. »", "« Remets ton épée au fourreau, car qui vit par l'épée périra par l'épée. »"],
    answer: 0,
    lecon: "Jean 13:38 : « Jésus répondit : Tu donneras ta vie pour moi ! En vérité, en vérité, je te le dis, le coq ne chantera pas que tu ne m'aies renié trois fois. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 14:2",
    verset: "Il y a plusieurs demeures dans la maison de mon Père. Si cela n'était pas, je vous l'aurais dit.…",
    q: "Pourquoi Jésus dit-il s'en aller en Jean 14:2 ?",
    options: ["Je vais vous préparer une place.", "Je vais m'asseoir à la droite de la majesté divine.", "Je vais mettre fin aux embûches de l'ennemi.", "Je vais juger les vivants et les morts."],
    answer: 0,
    lecon: "Jean 14:2 : « Il y a plusieurs demeures dans la maison de mon Père. Si cela n'était pas, je vous l'aurais dit. Je vais vous préparer une place. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 14:6",
    verset: "Jésus lui dit : Je suis le chemin, la vérité, et la vie.…",
    q: "Comment se termine cette parole fondamentale de Jésus à Thomas ?",
    options: ["Nul ne vient au Père que par moi.", "Celui qui me suit ne marchera plus dans l'ombre.", "Tous ceux qui croient en moi seront assis dans la gloire.", "Et je vous donnerai un royaume inébranlable."],
    answer: 0,
    lecon: "Jean 14:6 : « Jésus lui dit : Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 14:16-17",
    q: "Quel titre Jésus donne-t-il au Consolateur que le Père enverra pour demeurer éternellement avec les disciples ?",
    options: ["L'Esprit de vérité", "L'Esprit de justice", "L'Esprit de prophétie", "L'Esprit d'adoption"],
    answer: 0,
    lecon: "Jean 14:16-17 : « Et moi, je prierai le Père, et il vous donnera un autre consolateur, afin qu'il demeure éternellement avec vous, l'Esprit de vérité… »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 14:26",
    q: "Que fera le Consolateur, le Saint-Esprit, selon Jean 14:26 ?",
    options: ["Il vous enseignera toutes choses, et vous rappellera tout ce que je vous ai dit", "Il confondra les rois de la terre par des prodiges éclatants", "Il rebâtira les murailles de Jérusalem dans la justice", "Il vous révélera le jour et l'heure de la fin"],
    answer: 0,
    lecon: "Jean 14:26 : « Mais le consolateur, l'Esprit-Saint, que le Père enverra en mon nom, vous enseignera toutes choses, et vous rappellera tout ce que je vous ai dit. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 14:27",
    verset: "Je vous laisse la paix, je vous donne ma paix.…",
    q: "Comment Jésus donne-t-il sa paix à ses disciples ?",
    options: ["Je ne vous donne pas comme le monde donne.", "Je vous la donne par le sang de l'alliance nouvelle.", "Elle gardera vos demeures de tout péril nocturne.", "Comme les anges chantèrent aux bergers de Bethléem."],
    answer: 0,
    lecon: "Jean 14:27 : « Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 15:5",
    verset: "Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit,…",
    q: "Pourquoi les sarments doivent-ils demeurer attachés au cep ?",
    options: ["car sans moi vous ne pouvez rien faire.", "car nul homme ne peut porter de fardeau seul.", "afin de ne point être jeté au feu du jugement.", "afin de recevoir la récompense au ciel."],
    answer: 0,
    lecon: "Jean 15:5 : « Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 15:13",
    q: "Complétez : « Il n'y a pas de plus grand amour que… »",
    options: ["de donner sa vie pour ses amis.", "d'obéir fidèlement à tous les préceptes de la loi.", "de pardonner soixante-dix fois sept fois.", "de souffrir sans murmurer."],
    answer: 0,
    lecon: "Jean 15:13 : « Il n'y a pas de plus grand amour que de donner sa vie pour ses amis. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 16:33",
    verset: "Vous aurez des tribulations dans le monde ; mais…",
    q: "Quel encouragement triomphant Jésus donne-t-il à la fin du chapitre 16 ?",
    options: ["prenez courage, j'ai vaincu le monde.", "ma main droite vous soutiendra toujours.", "vos peines se changeront en chants de triomphe.", "les portes du séjour des morts ne prévaudront point."],
    answer: 0,
    lecon: "Jean 16:33 : « Je vous ai dit ces choses, afin que vous ayez la paix en moi. Vous aurez des tribulations dans le monde ; mais prenez courage, j'ai vaincu le monde. »" },

  { level: 6, theme: "Évangile de Jean", ref: "Jean 17:3",
    verset: "Or, la vie éternelle, c'est qu'ils te connaissent,…",
    q: "Comment Jésus définit-il la vie éternelle dans sa prière sacerdotale en Jean 17:3 ?",
    options: ["toi, le seul vrai Dieu, et celui que tu as envoyé, Jésus-Christ.", "les mystères cachés dès la fondation du monde.", "la loi céleste et les décrets immuables du Tout-Puissant.", "les trésors incorruptibles réservés pour les saints."],
    answer: 0,
    lecon: "Jean 17:3 : « Or, la vie éternelle, c'est qu'ils te connaissent, toi, le seul vrai Dieu, et celui que tu as envoyé, Jésus-Christ. »" },

  /* =========================================================================
     NIVEAU 7 : La Passion & La Victoire Céleste (Jean 18 – 21)
     ========================================================================= */

  { level: 7, theme: "Évangile de Jean", ref: "Jean 18:10",
    q: "Quel est le nom du serviteur du souverain sacrificateur à qui Simon Pierre coupa l'oreille au jardin ?",
    options: ["Malchus", "Barabbas", "Caïphe", "Nicodème"],
    answer: 0,
    lecon: "Jean 18:10 : « Simon Pierre, qui avait une épée, la tira, frappa le serviteur du souverain sacrificateur, et lui coupa l'oreille droite. Ce serviteur s'appelait Malchus. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 18:36",
    q: "Que répond Jésus à Pilate au sujet de sa royauté en Jean 18:36 ?",
    options: ["« Mon royaume n'est pas de ce monde. »", "« Tu le dis, je suis le roi des rois. »", "« Les cieux et la terre m'appartiennent. »", "« Mon trône est établi de toute éternité. »"],
    answer: 0,
    lecon: "Jean 18:36 : « Mon royaume n'est pas de ce monde, répondit Jésus. Si mon royaume était de ce monde, mes serviteurs auraient combattu pour moi… »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 18:38",
    q: "Quelle question célèbre Pilate pose-t-il à Jésus avant de sortir dire aux Juifs qu'il ne trouve aucun crime en lui ?",
    options: ["« Qu'est-ce que la vérité ? »", "« D'où viens-tu ? »", "« Es-tu le Messie attendu ? »", "« Ne sais-tu pas que j'ai le pouvoir de te relâcher ? »"],
    answer: 0,
    lecon: "Jean 18:38 : « Pilate lui dit : Qu'est-ce que la vérité ? Après avoir dit cela, il sortit de nouveau pour aller vers les Juifs, et il leur dit : Je ne trouve aucun crime en lui. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 19:20",
    q: "En quelles trois langues l'écriteau « Jésus de Nazareth, roi des Juifs » placé sur la croix était-il rédigé ?",
    options: ["En hébreu, en grec et en latin", "En hébreu, en araméen et en grec", "En grec, en latin et en égyptien", "En latin, en hébreu et en syriaque"],
    answer: 0,
    lecon: "Jean 19:20 : « Beaucoup de Juifs lurent cet écriteau… et il était écrit en hébreu, en grec et en latin. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 19:26-27",
    q: "Que dit Jésus sur la croix à sa mère et au disciple qu'il aimait ?",
    options: ["« Femme, voilà ton fils. Puis il dit au disciple : Voilà ta mère. »", "« Ne pleurez point sur moi, mais pleurez sur vos enfants. »", "« Père, pardonne-leur, car ils ne savent ce qu'ils font. »", "« Que la paix soit sur cette maison et sur ma descendance. »"],
    answer: 0,
    lecon: "Jean 19:26-27 : « Jésus, voyant sa mère, et auprès d'elle le disciple qu'il aimait, dit à sa mère : Femme, voilà ton fils. Puis il dit au disciple : Voilà ta mère. Et, dès ce moment, le disciple la prit chez lui. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 19:30",
    verset: "Quand Jésus eut pris le vinaigre, il dit :…",
    q: "Quels furent les derniers mots de Jésus avant de rendre l'esprit sur la croix dans l'Évangile de Jean ?",
    options: ["Tout est accompli.", "Mon Dieu, mon Dieu, pourquoi m'as-tu abandonné ?", "Père, je remets mon esprit entre tes mains.", "Je remets mon âme à ton saint nom."],
    answer: 0,
    lecon: "Jean 19:30 : « Quand Jésus eut pris le vinaigre, il dit : Tout est accompli. Et, baissant la tête, il rendit l'esprit. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 19:34",
    q: "Que sortit-il du côté de Jésus lorsqu'un soldat le perça d'une lance ?",
    options: ["Du sang et de l'eau", "De l'eau pure", "De l'huile et du sang", "De la lumière"],
    answer: 0,
    lecon: "Jean 19:34 : « Mais un des soldats lui perça le côté avec une lance, et aussitôt il sortit du sang et de l'eau. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 19:38-39",
    q: "Quels deux hommes vinrent réclamer le corps de Jésus pour l'ensevelir avec des aromates ?",
    options: ["Joseph d'Arimathée et Nicodème", "Simon de Cyrène et Joseph d'Arimathée", "Nicodème et Simon Pierre", "Gamaliel et Zachée"],
    answer: 0,
    lecon: "Jean 19:38-39 : « Après cela, Joseph d'Arimathée… demanda à Pilate de pouvoir enlever le corps de Jésus… Nicodème, qui auparavant était allé de nuit vers Jésus, vint aussi, apportant un mélange d'environ cent livres de myrrhe et d'aloès. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 20:15-16",
    q: "À qui Jésus ressuscité apparaît-il en premier près du tombeau, et qui le prit d'abord pour le jardinier ?",
    options: ["Marie de Magdala (Marie-Madeleine)", "Marie, mère de Jacques", "Salomé", "Jeanne, femme de Chuza"],
    answer: 0,
    lecon: "Jean 20:15-16 : « Elle, pensant que c'était le jardinier, lui dit : Seigneur, si c'est toi qui l'as emporté, dis-moi où tu l'as mis… Jésus lui dit : Marie ! Elle se retourna, et lui dit en hébreu : Rabbouni, c'est-à-dire, Maître ! »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 20:28",
    q: "Quelle confession éclatante l'apôtre Thomas prononce-t-il en voyant les marques des clous sur Jésus ressuscité ?",
    options: ["« Mon Seigneur et mon Dieu ! »", "« Tu es vraiment le Christ, le Fils du Dieu vivant ! »", "« Béni soit le Roi qui a vaincu la mort ! »", "« Seigneur, pardonne mon incrédulité ! »"],
    answer: 0,
    lecon: "Jean 20:28 : « Thomas lui répondit : Mon Seigneur et mon Dieu ! »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 20:29",
    verset: "Jésus lui dit : Parce que tu m'as vu, tu as cru.…",
    q: "Complétez cette béatitude prononcée par Jésus devant Thomas :",
    options: ["Heureux ceux qui n'ont pas vu, et qui ont cru !", "Heureux ceux qui marchent dans l'obéissance sans chanceler !", "Heureux ceux dont le cœur ne s'est point endurci !", "Heureux les humbles qui hériteront le royaume des cieux !"],
    answer: 0,
    lecon: "Jean 20:29 : « Jésus lui dit : Parce que tu m'as vu, tu as cru. Heureux ceux qui n'ont pas vu, et qui ont cru ! »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 21:11",
    q: "Combien de grands poissons furent dénombrés dans le filet lors de la pêche miraculeuse sur le lac de Tibériade ?",
    options: ["153 grands poissons", "120 poissons", "70 poissons", "144 poissons"],
    answer: 0,
    lecon: "Jean 21:11 : « Simon Pierre monta dans la barque, et tira à terre le filet plein de cent cinquante-trois grands poissons ; et quoiqu'il y en eût tant, le filet ne se rompit point. »" },

  { level: 7, theme: "Évangile de Jean", ref: "Jean 21:15-17",
    q: "Combien de fois Jésus demande-t-il à Simon Pierre « M'aimes-tu ? » avant de lui confier « Pais mes brebis » ?",
    options: ["Trois fois", "Sept fois", "Une seule fois", "Deux fois"],
    answer: 0,
    lecon: "Jean 21:17 : « Il lui dit pour la troisième fois : Simon, fils de Jonas, m'aimes-tu ? Pierre fut attristé de ce qu'il lui avait dit pour la troisième fois : M'aimes-tu ? Et il lui répondit : Seigneur, tu sais toutes choses, tu sais que je t'aime. Jésus lui dit : Pais mes brebis. »" },

  /* =========================================================================
     NIVEAU 8 : Les Épîtres de Jean : Vérité & Amour (1 Jean, 2 Jean, 3 Jean)
     ========================================================================= */

  { level: 8, theme: "1 Jean", ref: "1 Jean 1:5",
    verset: "La nouvelle que nous avons apprise de lui, et que nous vous annonçons, c'est que…",
    q: "Quelle est cette vérité fondamentale proclamée en 1 Jean 1:5 ?",
    options: ["Dieu est lumière, et qu'il n'y a point en lui de ténèbres.", "Dieu est miséricorde pour les pécheurs repentants.", "Dieu règne dans les cieux pour les siècles des siècles.", "la loi a été abolie par la grâce de Jésus-Christ."],
    answer: 0,
    lecon: "1 Jean 1:5 : « La nouvelle que nous avons apprise de lui, et que nous vous annonçons, c'est que Dieu est lumière, et qu'il n'y a point en lui de ténèbres. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 1:7",
    verset: "Mais si nous marchons dans la lumière, tout comme il est lui-même dans la lumière, nous sommes en communion les uns avec les autres, et…",
    q: "Que fait le sang de Jésus-Christ selon 1 Jean 1:7 ?",
    options: ["le sang de Jésus son Fils nous purifie de tout péché.", "la paix de Dieu remplit entièrement nos cœurs.", "nous sommes gardés de toute chute et de toute tentation.", "nos noms sont inscrits pour toujours dans le ciel."],
    answer: 0,
    lecon: "1 Jean 1:7 : « Mais si nous marchons dans la lumière, tout comme il est lui-même dans la lumière, nous sommes en communion les uns avec les autres, et le sang de Jésus son Fils nous purifie de tout péché. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 1:9",
    verset: "Si nous confessons nos péchés, il est…",
    q: "Complétez cette promesse de pardon et de purification :",
    options: ["fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité.", "plein de miséricorde pour ne plus se souvenir de nos transgressions.", "patient et doux envers ceux qui s'approchent de son trône.", "un refuge et un appui dans le combat de la foi."],
    answer: 0,
    lecon: "1 Jean 1:9 : « Si nous confessons nos péchés, il est fidèle et juste pour nous les pardonner, et pour nous purifier de toute iniquité. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 2:1",
    q: "Qui l'apôtre Jean déclare-t-il que nous avons auprès du Père si quelqu'un vient à pécher ?",
    options: ["Un avocat, Jésus-Christ le juste", "L'Esprit de grâce qui intercède pour nous", "Les anges qui veillent sur nos pas", "Une sacrificature éternelle"],
    answer: 0,
    lecon: "1 Jean 2:1 : « Mes petits enfants, je vous écris ces choses, afin que vous ne péchiez point. Et si quelqu'un a péché, nous avons un avocat auprès du Père, Jésus-Christ le juste. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 2:15",
    q: "Que recommande l'apôtre Jean au sujet du monde en 1 Jean 2:15 ?",
    options: ["« N'aimez point le monde, ni les choses qui sont dans le monde. »", "« Fuyez dans les montagnes pour échapper aux souillures du monde. »", "« Réjouissez-vous au milieu du monde car il appartient à Dieu. »", "« N'ayez aucun commerce avec ceux du dehors. »"],
    answer: 0,
    lecon: "1 Jean 2:15 : « N'aimez point le monde, ni les choses qui sont dans le monde. Si quelqu'un aime le monde, l'amour du Père n'est point en lui. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 2:18",
    q: "Que dit l'apôtre Jean aux petits enfants concernant les derniers temps en 1 Jean 2:18 ?",
    options: ["« C'est la dernière heure… il y a maintenant plusieurs antéchrists. »", "« Prenez garde aux faux prophètes qui viennent en vêtements de brebis. »", "« Le jour du Seigneur viendra comme un voleur dans la nuit. »", "« Ne vous laissez point séduire par les généalogies sans fin. »"],
    answer: 0,
    lecon: "1 Jean 2:18 : « Petits enfants, c'est la dernière heure, et comme vous avez appris qu'un antéchrist vient, il y a maintenant plusieurs antéchrists : par là nous connaissons que c'est la dernière heure. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 3:1",
    verset: "Voyez quel amour le Père nous a témoigné,…",
    q: "Complétez cette exclamation de louange de 1 Jean 3:1 :",
    options: ["pour que nous soyons appelés enfants de Dieu ! Et nous le sommes.", "en nous arrachant aux pièges de la mort éternelle !", "en envoyant sa parole de délivrance sur toute la terre !", "afin de faire de nous des rois et des sacrificateurs !"],
    answer: 0,
    lecon: "1 Jean 3:1 : « Voyez quel amour le Père nous a témoigné, pour que nous soyons appelés enfants de Dieu ! Et nous le sommes. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 4:8",
    verset: "Celui qui n'aime pas n'a pas connu Dieu, car…",
    q: "Quelle est la définition limpide de Dieu donnée en 1 Jean 4:8 ?",
    options: ["Dieu est amour.", "Dieu est un feu dévorant.", "Dieu est sainteté.", "Dieu est esprit."],
    answer: 0,
    lecon: "1 Jean 4:8 : « Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 4:18",
    verset: "La crainte n'est pas dans l'amour, mais…",
    q: "Que fait l'amour parfait selon 1 Jean 4:18 ?",
    options: ["l'amour parfait bannit la crainte.", "l'amour surmonte toute tentation terrestre.", "l'amour couvre une multitude de péchés.", "l'amour réjouit le cœur affligé."],
    answer: 0,
    lecon: "1 Jean 4:18 : « La crainte n'est pas dans l'amour, mais l'amour parfait bannit la crainte ; car la crainte suppose un châtiment, et celui qui craint n'est pas parfait dans l'amour. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 4:19",
    verset: "Pour nous, nous l'aimons, parce que…",
    q: "Pourquoi les croyants aiment-ils Dieu selon 1 Jean 4:19 ?",
    options: ["il nous a aimés le premier.", "il nous a créés à son image sainte.", "il nous a promis la vie éternelle.", "il a mis sa loi dans nos cœurs."],
    answer: 0,
    lecon: "1 Jean 4:19 : « Pour nous, nous l'aimons, parce qu'il nous a aimés le premier. »" },

  { level: 8, theme: "1 Jean", ref: "1 Jean 5:4",
    verset: "Parce que tout ce qui est né de Dieu triomphe du monde ; et la victoire qui triomphe du monde, c'est…",
    q: "Quelle est la victoire qui triomphe du monde ?",
    options: ["notre foi.", "notre amour.", "notre espérance.", "notre patience."],
    answer: 0,
    lecon: "1 Jean 5:4 : « Parce que tout ce qui est né de Dieu triomphe du monde ; et la victoire qui triomphe du monde, c'est notre foi. »" },

  { level: 8, theme: "2 et 3 Jean", ref: "2 Jean 1:1",
    q: "Comment l'auteur de la 2e épître de Jean se désigne-t-il au début de sa lettre ?",
    options: ["L'ancien", "L'apôtre bien-aimé", "Le serviteur de Jésus-Christ", "Le prophète de Patmos"],
    answer: 0,
    lecon: "2 Jean 1:1 : « L'ancien, à l'élue et à ses enfants, que j'aime dans la vérité… »" },

  { level: 8, theme: "2 et 3 Jean", ref: "2 Jean 1:7",
    q: "Selon 2 Jean 1:7, quelle doctrine pernicieuse caractérise les séducteurs et l'antéchrist ?",
    options: ["Ils ne confessent point que Jésus-Christ est venu en chair", "Ils refusent de payer le tribut à César", "Ils enseignent que la résurrection est déjà arrivée", "Ils rejettent l'Ancien Testament"],
    answer: 0,
    lecon: "2 Jean 1:7 : « Car plusieurs séducteurs sont entrés dans le monde, qui ne confessent point que Jésus-Christ est venu en chair. Celui qui est tel, c'est le séducteur et l'antéchrist. »" },

  { level: 8, theme: "2 et 3 Jean", ref: "3 Jean 1:1",
    q: "À quel chrétien fidèle la 3e épître de Jean est-elle personnellement adressée ?",
    options: ["À Gaïus, le bien-aimé", "À Philémon", "À Timothée", "À Tite"],
    answer: 0,
    lecon: "3 Jean 1:1 : « L'ancien, à Gaïus, le bien-aimé, que j'aime dans la vérité. »" },

  { level: 8, theme: "2 et 3 Jean", ref: "3 Jean 1:9",
    q: "Quel homme autoritaire l'apôtre Jean dénonce-t-il dans sa troisième épître parce qu'« il aime à être le premier » ?",
    options: ["Diotrèphe", "Démétrius", "Alexandre le forgeron", "Hyménée"],
    answer: 0,
    lecon: "3 Jean 1:9 : « J'ai écrit quelques mots à l'Église ; mais Diotrèphe, qui aime à être le premier parmi eux, ne nous reçoit point. »" },

  /* =========================================================================
     NIVEAU 9 : L'Apocalypse : Visions & Sept Églises (Apocalypse 1 – 11)
     ========================================================================= */

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 1:1-2",
    q: "À qui la révélation de Jésus-Christ a-t-elle été signifiée par un ange dans le livre de l'Apocalypse ?",
    options: ["À son serviteur Jean", "À Simon Pierre", "À l'apôtre Paul", "À l'Église de Jérusalem"],
    answer: 0,
    lecon: "Apocalypse 1:1 : « Révélation de Jésus-Christ… qu'il a fait connaître, par l'envoi de son ange, à son serviteur Jean. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 1:8",
    verset: "Je suis l'alpha et l'oméga, dit le Seigneur Dieu, celui qui est, qui était, et qui vient,…",
    q: "Quel titre conclut cette parole en Apocalypse 1:8 ?",
    options: ["le Tout-Puissant.", "le Sauveur des hommes.", "le Saint d'Israël.", "le Prince de la paix."],
    answer: 0,
    lecon: "Apocalypse 1:8 : « Je suis l'alpha et l'oméga, dit le Seigneur Dieu, celui qui est, qui était, et qui vient, le Tout-Puissant. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 1:9",
    q: "Sur quelle île Jean se trouvait-il en exil lorsqu'il reçut les visions de l'Apocalypse ?",
    options: ["Patmos", "Chypre", "Crète", "Malte"],
    answer: 0,
    lecon: "Apocalypse 1:9 : « Moi Jean, votre frère… j'étais dans l'île appelée Patmos, à cause de la parole de Dieu et du témoignage de Jésus. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 1:11",
    q: "Combien d'Églises d'Asie Mineure reçoivent une lettre prophétique dictée dans les chapitres 2 et 3 de l'Apocalypse ?",
    options: ["Sept Églises", "Douze Églises", "Dix Églises", "Trois Églises"],
    answer: 0,
    lecon: "Apocalypse 1:11 : « Ce que tu vois, écris-le dans un livre, et envoie-le aux sept Églises, à Éphèse, à Smyrne, à Pergame, à Thyatire, à Sardes, à Philadelphie, et à Laodicée. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 2:10",
    verset: "Sois fidèle jusqu'à la mort, et…",
    q: "Quelle promesse glorieuse le Seigneur fait-il à l'église de Smyrne éprouvée par la persécution ?",
    options: ["je te donnerai la couronne de vie.", "je t'établirai sur plusieurs cités.", "ton nom ne sera point effacé du livre sacré.", "je te ferai asseoir avec moi sur mon trône."],
    answer: 0,
    lecon: "Apocalypse 2:10 : « Ne crains pas ce que tu vas souffrir… Sois fidèle jusqu'à la mort, et je te donnerai la couronne de vie. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 3:20",
    verset: "Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte,…",
    q: "Que promet Jésus à celui qui ouvre la porte en Apocalypse 3:20 ?",
    options: ["j'entrerai chez lui, je souperai avec lui, et lui avec moi.", "je répandrai ma bénédiction jusqu'à mille générations.", "je lui révélerai les secrets scellés du livre céleste.", "je le placerai comme une colonne dans le sanctuaire."],
    answer: 0,
    lecon: "Apocalypse 3:20 : « Voici, je me tiens à la porte, et je frappe. Si quelqu'un entend ma voix et ouvre la porte, j'entrerai chez lui, je souperai avec lui, et lui avec moi. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 4:4",
    q: "Combien de vieillards assis sur des trônes entourent le trône céleste de Dieu en Apocalypse 4:4 ?",
    options: ["Vingt-quatre vieillards", "Douze vieillards", "Soixante-dix vieillards", "Quatre vieillards"],
    answer: 0,
    lecon: "Apocalypse 4:4 : « Autour du trône je vis vingt-quatre trônes, et sur ces trônes vingt-quatre vieillards assis, revêtus de vêtements blancs, et sur leurs têtes des couronnes d'or. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 4:8",
    verset: "Les quatre êtres vivants… ne cessent de dire jour et nuit :…",
    q: "Que proclament continuellement les quatre êtres vivants devant le trône ?",
    options: ["Saint, saint, saint est le Seigneur Dieu, le Tout-Puissant, qui était, qui est, et qui vient !", "Gloire et puissance à l'Agneau immolé pour nos péchés !", "Tu es digne, Seigneur notre Dieu, de recevoir la gloire et l'honneur !", "Alléluia ! Le Seigneur notre Dieu tout-puissant est entré dans son règne !"],
    answer: 0,
    lecon: "Apocalypse 4:8 : « Ils ne cessent de dire jour et nuit : Saint, saint, saint est le Seigneur Dieu, le Tout-Puissant, qui était, qui est, et qui vient ! »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 5:5",
    q: "Quel titre glorieux est donné au Christ victorieux capable d'ouvrir le livre aux sept sceaux en Apocalypse 5:5 ?",
    options: ["Le lion de la tribu de Juda, le rejeton de David", "Le souverain sacrificateur selon l'ordre de Melchisédek", "Le grand aigle aux ailes puissantes", "Le roi glorieux de Sion"],
    answer: 0,
    lecon: "Apocalypse 5:5 : « Et l'un des vieillards me dit : Ne pleure point ; voici, le lion de la tribu de Juda, le rejeton de David, a vaincu pour ouvrir le livre et ses sept sceaux. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 6:2",
    q: "À l'ouverture du premier sceau, que montait le cavalier sur le cheval blanc portant un arc ?",
    options: ["Une couronne lui fut donnée, et il partit en vainqueur et pour vaincre", "Une grande épée lui fut remise pour ôter la paix de la terre", "Une balance était dans sa main pour peser le blé", "La mort le suivait avec le séjour des morts"],
    answer: 0,
    lecon: "Apocalypse 6:2 : « Je regardai, et voici, parut un cheval blanc. Celui qui le montait avait un arc ; une couronne lui fut donnée, et il partit en vainqueur et pour vaincre. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 7:4",
    q: "Combien d'hommes marqués du sceau de Dieu sur le front de toutes les tribus d'Israël Jean entend-il compter ?",
    options: ["144 000", "70 000", "12 000", "1 000 000"],
    answer: 0,
    lecon: "Apocalypse 7:4 : « Et j'entendis le nombre de ceux qui avaient été marqués du sceau, cent quarante-quatre mille, de toutes les tribus des fils d'Israël. »" },

  { level: 9, theme: "Apocalypse", ref: "Apocalypse 10:9",
    q: "Que ressent Jean en avalant le petit livre tendu par l'ange puissant en Apocalypse 10:9-10 ?",
    options: ["Doux comme du miel dans sa bouche, mais amer dans ses entrailles", "Amer dès qu'il le goûte, puis doux comme un cantique", "Rempli d'une chaleur de feu et d'une force inouïe", "Aucun goût particulier mais une vision claire de l'avenir"],
    answer: 0,
    lecon: "Apocalypse 10:9-10 : « Il me dit : Prends-le, et avale-le ; il remplira tes entrailles d'amertume, mais dans ta bouche il sera doux comme du miel… »" },

  /* =========================================================================
     NIVEAU 10 : La Victoire Finale & La Nouvelle Jérusalem (Apocalypse 12 – 22)
     ========================================================================= */

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 12:1",
    q: "Que porte sur la tête la femme enveloppée du soleil apparue dans le ciel au chapitre 12 de l'Apocalypse ?",
    options: ["Une couronne de douze étoiles", "Un diadème d'or pur serti de pierres précieuses", "Un voile de lin blanc éclatant", "Une corne d'abondance"],
    answer: 0,
    lecon: "Apocalypse 12:1 : « Un grand signe parut dans le ciel : une femme enveloppée du soleil, la lune sous ses pieds, et une couronne de douze étoiles sur sa tête. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 12:9",
    q: "Comment est identifié le grand dragon précipité sur la terre par Michel et ses anges en Apocalypse 12:9 ?",
    options: ["Le serpent ancien, appelé le diable et Satan", "L'abominable bête de la mer", "Le faux prophète des nations", "L'ange déchu de l'abîme nommé Abaddon"],
    answer: 0,
    lecon: "Apocalypse 12:9 : « Et il fut précipité, le grand dragon, le serpent ancien, appelé le diable et Satan, celui qui séduit toute la terre, il fut précipité sur la terre… »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 13:18",
    verset: "C'est ici la sagesse. Que celui qui a de l'intelligence calcule le nombre de la bête. Car c'est un nombre d'homme, et…",
    q: "Quel est ce nombre mentionné en Apocalypse 13:18 ?",
    options: ["son nombre est six cent soixante-six.", "son nombre est sept cent soixante-dix-sept.", "son nombre est six cent seize.", "son nombre est mille deux cent soixante."],
    answer: 0,
    lecon: "Apocalypse 13:18 : « C'est ici la sagesse. Que celui qui a de l'intelligence calcule le nombre de la bête. Car c'est un nombre d'homme, et son nombre est six cent soixante-six. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 14:6",
    q: "Que possède l'ange volant par le milieu du ciel en Apocalypse 14:6 pour l'annoncer à tous les habitants de la terre ?",
    options: ["Un Évangile éternel", "Le livre des sept tonnerres", "Les coupes de la colère divine", "La trompette du jugement dernier"],
    answer: 0,
    lecon: "Apocalypse 14:6 : « Je vis un autre ange qui volait par le milieu du ciel, ayant un Évangile éternel, pour l'annoncer aux habitants de la terre… »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 16:16",
    q: "Comment s'appelle en hébreu le lieu du rassemblement suprême des rois de la terre en Apocalypse 16:16 selon la LSG 1910 ?",
    options: ["Harmaguédon", "Golgotha", "Gethsémané", "Josaphat"],
    answer: 0,
    lecon: "Apocalypse 16:16 : « Ils les rassemblèrent dans le lieu appelé en hébreu Harmaguédon. » (La graphie exacte de la Segond 1910 comporte un « H » initial)." },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 19:11",
    q: "Comment s'appelle le cavalier divin montant le cheval blanc en Apocalypse 19:11 ?",
    options: ["Fidèle et Véritable", "Alpha et Oméga", "L'Étoile du matin", "Le Juste Juge"],
    answer: 0,
    lecon: "Apocalypse 19:11 : « Puis je vis le ciel ouvert, et voici, parut un cheval blanc. Celui qui le montait s'appelle Fidèle et Véritable, et il juge et combat avec justice. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 19:16",
    verset: "Il avait sur son vêtement et sur sa cuisse un nom écrit :…",
    q: "Quel titre souverain porte le cavalier victorieux en Apocalypse 19:16 ?",
    options: ["Roi des rois et Seigneur des seigneurs.", "La Parole éternelle du Dieu vivant.", "Le Vainqueur des nations et de la mort.", "Le Tout-Puissant revêtu de lumière."],
    answer: 0,
    lecon: "Apocalypse 19:16 : « Il avait sur son vêtement et sur sa cuisse un nom écrit : Roi des rois et Seigneur des seigneurs. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 20:12",
    q: "Quel livre particulier est ouvert lors du jugement du grand trône blanc pour juger les morts selon leurs œuvres ?",
    options: ["Le livre de vie", "Le livre des patriarches", "Le livre des prophéties", "Le livre de la loi de Moïse"],
    answer: 0,
    lecon: "Apocalypse 20:12 : « Et je vis les morts, les grands et les petits, qui se tenaient devant le trône. Des livres furent ouverts. Et un autre livre fut ouvert, celui qui est le livre de vie… »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 21:1",
    q: "Que voit Jean en vision au début du chapitre 21 après la disparition du premier ciel et de la première terre ?",
    options: ["Un nouveau ciel et une nouvelle terre, et la mer n'était plus", "Le paradis d'Éden restauré avec ses quatre fleuves", "Le mont Sion embrasé par la gloire céleste", "Un temple resplendissant fait d'or et de jaspe"],
    answer: 0,
    lecon: "Apocalypse 21:1 : « Puis je vis un nouveau ciel et une nouvelle terre ; car le premier ciel et la première terre avaient disparu, et la mer n'était plus. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 21:4",
    verset: "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et…",
    q: "Quelle promesse de consolation éternelle est donnée en Apocalypse 21:4 ?",
    options: ["il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu.", "la nuit ne couvrira plus jamais la cité bienheureuse des rachetés.", "nul ennemi ne viendra troubler le repos de leur âme.", "ils chanteront sans fin le cantique de Moïse et de l'Agneau."],
    answer: 0,
    lecon: "Apocalypse 21:4 : « Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 21:16",
    q: "Quelle est la forme architecturale de la Nouvelle Jérusalem céleste mesurée avec le roseau d'or ?",
    options: ["Un carré (la longueur est égale à la largeur et à la hauteur)", "Un cercle parfait", "Une pyramide à douze degrés", "Un rectangle d'une longueur double de sa largeur"],
    answer: 0,
    lecon: "Apocalypse 21:16 : « La ville avait la forme d'un carré, et sa longueur était égale à sa largeur… la longueur, la largeur et la hauteur en étaient égales. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 22:1-2",
    q: "Qu'est-ce qui sort du trône de Dieu et de l'Agneau pour traverser la place de la cité céleste ?",
    options: ["Un fleuve d'eau de la vie, limpide comme du cristal", "Une nuée éclatante de gloire", "Un feu purificateur qui ne s'éteint point", "Un souffle d'encens et de louange"],
    answer: 0,
    lecon: "Apocalypse 22:1 : « Et il me montra un fleuve d'eau de la vie, limpide comme du cristal, qui sortait du trône de Dieu et de l'Agneau. »" },

  { level: 10, theme: "Apocalypse", ref: "Apocalypse 22:20",
    verset: "Celui qui atteste ces choses dit : Oui, je viens bientôt.…",
    q: "Quelle est la réponse fervente de Jean qui clôt le livre prophétique ?",
    options: ["Amen ! Viens, Seigneur Jésus !", "Que ta volonté soit faite sur la terre comme au ciel !", "Gloire soit rendue à l'Agneau immolé !", "Marana tha, viens établir ton règne !"],
    answer: 0,
    lecon: "Apocalypse 22:20 : « Celui qui atteste ces choses dit : Oui, je viens bientôt. Amen ! Viens, Seigneur Jésus ! »" }
];
