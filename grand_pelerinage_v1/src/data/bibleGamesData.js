/**
 * Données pédagogiques et ludiques de la Version 2.0 — Le Grand Pèlerinage de la Bible.
 * Traduction de référence exclusive : Bible Louis Segond 1910 (domaine public).
 * Aucun verset inventé : toutes les citations proviennent du texte canonique LSG 1910.
 */

export const MYSTERY_VERSES_POOL = [
  {
    id: "mv-gen-1-1",
    ref: "Genèse 1:1",
    livre: "Genèse",
    texte: "Au commencement, Dieu créa les cieux et la terre.",
    missingWords: ["commencement", "Dieu", "terre"],
    definitionWord: { mot: "commencement", definition: "Le point de départ absolu de toute chose créée avant que le temps humain ne commence." },
    indice: "Premier verset de toute l'Écriture Sainte, révélant le Créateur de l'univers.",
    explication: "Dès la première ligne de la Bible, Dieu se révèle comme l'auteur souverain de toute création.",
    niveau: "decouverte"
  },
  {
    id: "mv-psa-23-1",
    ref: "Psaume 23:1",
    livre: "Psaumes",
    texte: "L'Éternel est mon berger : je ne manquerai de rien.",
    missingWords: ["Éternel", "berger", "manquerai"],
    definitionWord: { mot: "berger", definition: "Celui qui guide, nourrit, soigne et protège fidèlement son troupeau." },
    indice: "Un psaume de David exprimant la confiance paisible envers Dieu qui conduit son peuple.",
    explication: "David, lui-même ancien berger à Bethléhem, sait avec quelle tendresse l'Éternel prend soin des siens.",
    niveau: "decouverte"
  },
  {
    id: "mv-psa-119-105",
    ref: "Psaume 119:105",
    livre: "Psaumes",
    texte: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.",
    missingWords: ["parole", "lampe", "sentier"],
    definitionWord: { mot: "sentier", definition: "Le chemin concret de la vie quotidienne sur lequel le croyant marche pas à pas." },
    indice: "La devise même du Grand Pèlerinage, comparant les Écritures à un éclairage dans la nuit.",
    explication: "La Parole de Dieu éclaire à la fois le pas immédiat (« à mes pieds ») et la direction à venir (« sur mon sentier »).",
    niveau: "decouverte"
  },
  {
    id: "mv-jos-1-9",
    ref: "Josué 1:9",
    livre: "Josué",
    texte: "Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.",
    missingWords: ["Fortifie-toi", "courage", "Éternel"],
    definitionWord: { mot: "courage", definition: "Assurance du cœur puisée non dans nos forces, mais dans la promesse de la présence de Dieu." },
    indice: "Encouragement adressé par Dieu au successeur de Moïse au seuil de la Terre promise.",
    explication: "Devant une responsabilité immense, Josué reçoit l'assurance que la présence divine accompagne chacun de ses pas.",
    niveau: "explorateur"
  },
  {
    id: "mv-pro-3-5",
    ref: "Proverbes 3:5",
    livre: "Proverbes",
    texte: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ;",
    missingWords: ["Confie-toi", "cœur", "sagesse"],
    definitionWord: { mot: "sagesse", definition: "Compréhension ou jugement purement humain lorsque l'on se passe de la direction divine." },
    indice: "Un appel des Proverbes à placer toute son assurance en Dieu plutôt que dans nos seuls calculs.",
    explication: "La véritable sagesse biblique commence par l'humilité de reconnaître que Dieu voit plus loin que notre intelligence.",
    niveau: "explorateur"
  },
  {
    id: "mv-esa-40-31",
    ref: "Ésaïe 40:31",
    livre: "Ésaïe",
    texte: "Mais ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles ; ils courent, et ne se lassent point, ils marchent, et ne se fatiguent point.",
    missingWords: ["confient", "force", "aigles"],
    definitionWord: { mot: "aigles", definition: "Oiseaux royaux qui utilisent les courants ascendants pour s'élever sans s'épuiser." },
    indice: "Le prophète Ésaïe compare le renouvellement spirituel à l'envol d'un grand rapace.",
    explication: "Attendre et espérer en l'Éternel ne rend pas passif : cela donne une endurance nouvelle dans l'épreuve.",
    niveau: "explorateur"
  },
  {
    id: "mv-jea-3-16",
    ref: "Jean 3:16",
    livre: "Jean",
    texte: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    missingWords: ["aimé", "Fils", "éternelle"],
    definitionWord: { mot: "quiconque", definition: "Toute personne sans aucune distinction, ouverte à l'appel de la foi en Jésus-Christ." },
    indice: "Parole de Jésus lors de son entretien nocturne avec Nicodème, résumant le cœur de l'Évangile.",
    explication: "L'amour de Dieu est à l'initiative du salut : un don gratuit offert au monde entier par le Fils unique.",
    niveau: "decouverte"
  },
  {
    id: "mv-jea-14-6",
    ref: "Jean 14:6",
    livre: "Jean",
    texte: "Jésus lui dit : Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.",
    missingWords: ["chemin", "vérité", "vie"],
    definitionWord: { mot: "chemin", definition: "La voie vivante ouverte par Christ lui-même pour conduire le croyant jusqu'au Père." },
    indice: "Réponse de Jésus à Thomas la veille de la Passion, formulant l'une des grandes affirmations « Je suis ».",
    explication: "Jésus ne montre pas seulement un itinéraire : il est lui-même le chemin, la source de vérité et la vie véritable.",
    niveau: "decouverte"
  },
  {
    id: "mv-jea-11-25",
    ref: "Jean 11:25",
    livre: "Jean",
    texte: "Jésus lui dit : Je suis la résurrection et la vie. Celui qui croit en moi vivra, quand même il serait mort ;",
    missingWords: ["résurrection", "vie", "vivra"],
    definitionWord: { mot: "résurrection", definition: "La victoire de la vie divine sur la mort, manifestée pleinement en Jésus-Christ." },
    indice: "Parole adressée à Marthe à Béthanie avant le relèvement de Lazare.",
    explication: "Face au deuil de Marthe et Marie, Jésus révèle que sa présence transforme même l'horizon de la mort.",
    niveau: "explorateur"
  },
  {
    id: "mv-mat-5-9",
    ref: "Matthieu 5:9",
    livre: "Matthieu",
    texte: "Heureux ceux qui procurent la paix, car ils seront appelés fils de Dieu !",
    missingWords: ["Heureux", "paix", "Dieu"],
    definitionWord: { mot: "procurent", definition: "Agir activement comme artisan de réconciliation et de concorde entre les personnes." },
    indice: "Septième béatitude du Sermon sur la montagne.",
    explication: "La paix biblique n'est pas l'indifférence : elle invite à bâtir activement la réconciliation fraternelle.",
    niveau: "decouverte"
  },
  {
    id: "mv-mat-11-28",
    ref: "Matthieu 11:28",
    livre: "Matthieu",
    texte: "Venez à moi, vous tous qui êtes fatigués et chargés, et je vous donnerai du repos.",
    missingWords: ["Venez", "fatigués", "repos"],
    definitionWord: { mot: "repos", definition: "L'apaisement profond du cœur et de la conscience accordé par Jésus à ceux qui viennent à lui." },
    indice: "Douce invitation du Seigneur à tous ceux qui portent de lourds fardeaux.",
    explication: "Loin d'ajouter un joug accablant, Jésus accueille la fatigue humaine pour offrir son repos intérieur.",
    niveau: "decouverte"
  },
  {
    id: "mv-rom-8-28",
    ref: "Romains 8:28",
    livre: "Romains",
    texte: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu, de ceux qui sont appelés selon son dessein.",
    missingWords: ["concourent", "bien", "aiment"],
    definitionWord: { mot: "dessein", definition: "Le projet bienveillant et souverain que Dieu poursuit pour ses enfants." },
    indice: "Promesse majeure de l'épître aux Romains sur la providence divine même au sein des épreuves.",
    explication: "Dieu sait faire servir même nos circonstances difficiles à l'accomplissement de son œuvre bonne en nous.",
    niveau: "explorateur"
  },
  {
    id: "mv-rom-12-21",
    ref: "Romains 12:21",
    livre: "Romains",
    texte: "Ne te laisse pas vaincre par le mal, mais surmonte le mal par le bien.",
    missingWords: ["vaincre", "mal", "bien"],
    definitionWord: { mot: "surmonte", definition: "Remporter la victoire morale et spirituelle en répondant à l'offense par l'amour concret." },
    indice: "Exhortation finale de Romains 12 sur la conduite chrétienne face aux injustices.",
    explication: "Répondre au mal par la bonté brise la spirale de vengeance et manifeste la force de l'Évangile.",
    niveau: "explorateur"
  },
  {
    id: "mv-1co-13-13",
    ref: "1 Corinthiens 13:13",
    livre: "1 Corinthiens",
    texte: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, la charité ; mais la plus grande de ces choses, c'est la charité.",
    missingWords: ["foi", "espérance", "charité"],
    definitionWord: { mot: "charité", definition: "Dans la traduction Louis Segond 1910, l'amour agapè désintéressé et fidèle." },
    indice: "Conclusion célèbre de l'hymne à l'amour de l'apôtre Paul.",
    explication: "La foi et l'espérance nourrissent notre marche terrestre, mais l'amour demeure éternellement.",
    niveau: "explorateur"
  },
  {
    id: "mv-phi-4-6",
    ref: "Philippiens 4:6",
    livre: "Philippiens",
    texte: "Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.",
    missingWords: ["inquiétez", "besoins", "prières"],
    definitionWord: { mot: "actions de grâces", definition: "La reconnaissance joyeuse exprimée à Dieu avant même de voir l'exaucement." },
    indice: "Remède apostolique contre l'anxiété, associant prière et reconnaissance.",
    explication: "Remettre nos soucis à Dieu avec gratitude ouvre la porte à une paix qui garde le cœur.",
    niveau: "explorateur"
  },
  {
    id: "mv-phi-4-13",
    ref: "Philippiens 4:13",
    livre: "Philippiens",
    texte: "Je puis tout par celui qui me fortifie.",
    missingWords: ["puis", "tout", "fortifie"],
    definitionWord: { mot: "fortifie", definition: "Communiquer intérieurement la vigueur nécessaire pour demeurer fidèle dans l'abondance comme dans le dénuement." },
    indice: "Court verset écrit depuis la prison, témoignant de la force reçue en Christ.",
    explication: "Paul ne vante pas sa propre puissance : il atteste que le Christ lui donne de traverser toute situation.",
    niveau: "decouverte"
  },
  {
    id: "mv-gal-5-22",
    ref: "Galates 5:22",
    livre: "Galates",
    texte: "Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance ;",
    missingWords: ["fruit", "amour", "patience"],
    definitionWord: { mot: "tempérance", definition: "Maîtrise de soi et équilibre intérieur produits par l'Esprit de Dieu." },
    indice: "Les neuf caractères formant ensemble « le fruit de l'Esprit ».",
    explication: "L'Esprit Saint produit progressivement dans la vie du croyant des vertus unies, et non des mérites isolés.",
    niveau: "expert"
  },
  {
    id: "mv-heb-11-1",
    ref: "Hébreux 11:1",
    livre: "Hébreux",
    texte: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas.",
    missingWords: ["foi", "assurance", "démonstration"],
    definitionWord: { mot: "assurance", definition: "Certitude solide fondée sur la fidélité de celui qui a fait les promesses." },
    indice: "Ouverture du célèbre chapitre des témoins de la foi.",
    explication: "La foi biblique n'est pas un saut aveugle dans le vide, mais une confiance appuyée sur la Parole de Dieu.",
    niveau: "expert"
  },
  {
    id: "mv-jac-1-5",
    ref: "Jacques 1:5",
    livre: "Jacques",
    texte: "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.",
    missingWords: ["sagesse", "demande", "simplement"],
    definitionWord: { mot: "reproche", definition: "Récrimination ou blâme dont Dieu s'abstient lorsque nous lui demandons sincèrement la sagesse." },
    indice: "Promesse généreuse de l'épître de Jacques à quiconque cherche à bien discerner.",
    explication: "Dieu accueille nos demandes de discernement avec libéralité et bienveillance.",
    niveau: "expert"
  },
  {
    id: "mv-1jn-4-8",
    ref: "1 Jean 4:8",
    livre: "1 Jean",
    texte: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour.",
    missingWords: ["aime", "connu", "amour"],
    definitionWord: { mot: "amour", definition: "La nature même de Dieu révélée en Jésus-Christ, appelée à rayonner entre frères et sœurs." },
    indice: "Déclaration lumineuse de la première épître de Jean sur l'essence divine.",
    explication: "Connaître Dieu se vérifie concrètement par l'amour fraternel vécu chaque jour.",
    niveau: "decouverte"
  }
];

export const BIBLE_WHO_AM_I_CHARACTERS = [
  {
    id: "wai-noe",
    reponse: "Noé",
    options: ["Noé", "Abraham", "Moïse", "Jonas"],
    indices: [
      "Mon père Lémec m'a donné un nom lié à la consolation et au repos sur la terre.",
      "Dieu m'a donné des plans précis en bois de gopher avec trois étages.",
      "J'ai construit une arche pour sauver ma famille et les animaux lors du déluge."
    ],
    ref: "Genèse 6–9",
    explication: "Noé trouva grâce aux yeux de l'Éternel, obéit avec persévérance et reçut le signe de l'arc dans la nuée (Genèse 9:13)."
  },
  {
    id: "wai-abraham",
    reponse: "Abraham",
    options: ["Abraham", "Isaac", "Jacob", "Melchisédek"],
    indices: [
      "J'ai quitté Ur en Chaldée et Charan sans savoir exactement où j'allais.",
      "L'Éternel m'a demandé de compter les étoiles pour illustrer ma descendance.",
      "J'ai appelé la montagne où Dieu pourvut d'un bélier « Jéhovah-Jiré »."
    ],
    ref: "Genèse 12–22",
    explication: "Abraham crut à l'Éternel, ce qui lui fut imputé à justice (Genèse 15:6), et devint le père des croyants."
  },
  {
    id: "wai-joseph",
    reponse: "Joseph",
    options: ["Joseph", "Benjamin", "Daniel", "David"],
    indices: [
      "Mes frères furent jaloux de la tunique de plusieurs couleurs reçue de notre père.",
      "Jeté dans une citerne puis emprisonné injustement en Égypte, j'y expliquai deux songes.",
      "Devenu gouverneur d'Égypte, je pardonnai à mes frères en disant : « Vous aviez médité de me faire du mal : Dieu l'a changé en bien. »"
    ],
    ref: "Genèse 37–50",
    explication: "La fidélité de Joseph dans l'épreuve et son pardon envers ses frères préparent le salut de toute sa famille pendant la famine."
  },
  {
    id: "wai-moise",
    reponse: "Moïse",
    options: ["Moïse", "Aaron", "Josué", "Élie"],
    indices: [
      "Ma sœur Marie veilla sur ma caisse de jonc déposée parmi les roseaux du fleuve.",
      "Au désert de Madian, j'entendis une voix m'appeler depuis un buisson en feu qui ne se consumait point.",
      "Je guidai Israël hors d'Égypte et reçus les tables de la loi sur le mont Sinaï."
    ],
    ref: "Exode 2–20",
    explication: "Moïse fut appelé à 80 ans au buisson ardent (Exode 3) pour conduire la délivrance du peuple d'Israël."
  },
  {
    id: "wai-ruth",
    reponse: "Ruth",
    options: ["Ruth", "Esther", "Débora", "Anne"],
    indices: [
      "J'étais originaire de Moab, mais je refusai de quitter ma belle-mère Naomi dans son deuil.",
      "Je déclarai : « Ton peuple sera mon peuple, et ton Dieu sera mon Dieu. »",
      "Je glanai des épis d'orge dans le champ de Boaz à Bethléhem et devins l'arrière-grand-mère de David."
    ],
    ref: "Ruth 1–4",
    explication: "Ruth illustre la fidélité généreuse et l'accueil des nations dans la lignée même du roi David et de Jésus-Christ (Matthieu 1:5)."
  },
  {
    id: "wai-samuel",
    reponse: "Samuel",
    options: ["Samuel", "Élisée", "Timothée", "Jérémie"],
    indices: [
      "Ma mère Anne pria longtemps avec larmes à Silo avant ma naissance.",
      "Jeune serviteur dans le sanctuaire, je fus appelé trois fois pendant la nuit et répondis : « Parle, car ton serviteur écoute. »",
      "J'oignis deux rois d'Israël : Saül puis le jeune David."
    ],
    ref: "1 Samuel 1–16",
    explication: "Samuel servit fidèlement comme prophète et juge en Israël dans une écoute attentive de la Parole divine."
  },
  {
    id: "wai-david",
    reponse: "David",
    options: ["David", "Salomon", "Jonathan", "Gédéon"],
    indices: [
      "J'étais le huitième et le plus jeune fils d'Isaï à Bethléhem, gardant les brebis.",
      "Avec une fronde et cinq pierres polies du torrent, je marchai au nom de l'Éternel des armées.",
      "Je composai de nombreux Psaumes dont « L'Éternel est mon berger »."
    ],
    ref: "1 Samuel 16–17 ; Psaume 23",
    explication: "David mit sa confiance non dans une armure lourde, mais dans le nom de l'Éternel."
  },
  {
    id: "wai-elie",
    reponse: "Élie",
    options: ["Élie", "Élisée", "Ésaïe", "Jean-Baptiste"],
    indices: [
      "Près du torrent de Kérith, des corbeaux m'apportaient du pain et de la viande.",
      "Sur le mont Carmel, j'ai prié pour que le feu de l'Éternel réponde devant les prophètes de Baal.",
      "À Horeb, j'entendis Dieu non dans le vent ni le feu, mais dans un murmure doux et léger."
    ],
    ref: "1 Rois 17–19",
    explication: "Après sa victoire au mont Carmel puis sa grande lassitude au désert, Élie fut relevé et fortifié par la présence douce de Dieu."
  },
  {
    id: "wai-esther",
    reponse: "Esther",
    options: ["Esther", "Ruth", "Débora", "Marie de Béthanie"],
    indices: [
      "Élevée par mon cousin Mardochée à Suse, je reçus le nom persan associé à l'étoile.",
      "Je demandai à tout mon peuple de jeûner trois jours avant d'approcher le roi sans y être appelée.",
      "J'ai sauvé mon peuple en risquant ma vie « pour un temps comme celui-ci »."
    ],
    ref: "Esther 2–8",
    explication: "Esther allia sagesse, prière et courage pour déjouer le complot d'Haman et protéger son peuple."
  },
  {
    id: "wai-daniel",
    reponse: "Daniel",
    options: ["Daniel", "Néhémie", "Ézéchiel", "Josué"],
    indices: [
      "Déporté jeune à Babylone, je décidai de ne pas me souiller par les mets du roi.",
      "Les fenêtres de ma chambre haute restèrent ouvertes vers Jérusalem pour prier trois fois par jour.",
      "Dieu envoya son ange fermer la gueule des lions dans la fosse où j'avais été jeté."
    ],
    ref: "Daniel 1–6",
    explication: "Par sa prière constante et son intégrité sans compromis, Daniel rendit témoignage au Dieu vivant."
  },
  {
    id: "wai-jonas",
    reponse: "Jonas",
    options: ["Jonas", "Amos", "Pierre", "Zacharie"],
    indices: [
      "Au lieu de me rendre vers l'est comme demandé, je montai sur un navire partant pour Tarsis.",
      "Je passai trois jours et trois nuits dans le ventre d'un grand poisson.",
      "Ma prédication si courte amena pourtant toute la grande ville de Ninive à se repentir."
    ],
    ref: "Jonas 1–4",
    explication: "Le livre de Jonas révèle que la compassion de Dieu s'étend même aux nations étrangères qui se repentent."
  },
  {
    id: "wai-marie",
    reponse: "Marie de Nazareth",
    options: ["Marie de Nazareth", "Élisabeth", "Marthe", "Marie de Magdala"],
    indices: [
      "L'ange Gabriel vint me saluer en Galilée alors que j'étais fiancée à Joseph.",
      "Je chantai le cantique du Magnificat chez ma parente Élisabeth en Judée.",
      "Je répondis au messager divin : « Qu'il me soit fait selon ta parole ! »"
    ],
    ref: "Luc 1:26-55",
    explication: "L'obéissance humble de Marie accueille l'accomplissement des promesses messianiques."
  },
  {
    id: "wai-pierre",
    reponse: "Pierre (Simon)",
    options: ["Pierre (Simon)", "André", "Jacques", "Thomas"],
    indices: [
      "Pêcheur sur le lac de Génésareth, je vis un jour mes filets se remplir au point de rompre.",
      "Je confessai à Césarée de Philippe : « Tu es le Christ, le Fils du Dieu vivant. »",
      "Après mon triple reniement, Jésus me demanda trois fois : « M'aimes-tu ? » et me confia ses brebis."
    ],
    ref: "Matthieu 16:16 ; Jean 21:15-17",
    explication: "Restauré par la grâce de Jésus, Pierre annonça l'Évangile avec hardiesse dès le jour de la Pentecôte (Actes 2)."
  },
  {
    id: "wai-paul",
    reponse: "Paul (Saul de Tarse)",
    options: ["Paul (Saul de Tarse)", "Barnabas", "Étienne", "Apollos"],
    indices: [
      "Je fus instruit aux pieds de Gamaliel et je gardais les vêtements lors de la lapidation d'Étienne.",
      "Sur le chemin de Damas, une lumière venant du ciel m'enveloppa et me demanda pourquoi je persécutais Jésus.",
      "J'entrepris trois grands voyages missionnaires et écrivis treize épîtres du Nouveau Testament."
    ],
    ref: "Actes 9 ; 2 Timothée 4:7",
    explication: "De persécuteur zélé, Saul devint l'apôtre des nations, proclamant la grâce de Dieu jusqu'à Rome."
  },
  {
    id: "wai-jean",
    reponse: "Jean (le disciple bien-aimé)",
    options: ["Jean (le disciple bien-aimé)", "Matthieu", "Luc", "Philippe"],
    indices: [
      "Fils de Zébédée et frère de Jacques, je travaillais sur une barque en Galilée.",
      "Au pied de la croix, Jésus me confia sa mère Marie.",
      "Exilé sur l'île de Patmos pour la Parole de Dieu, j'y reçus les visions de l'Apocalypse."
    ],
    ref: "Jean 19:26-27 ; Apocalypse 1:9",
    explication: "Jean est l'auteur de l'Évangile de Jean, de trois épîtres centrées sur l'amour et la vérité, et du livre de l'Apocalypse."
  }
];

export const BIBLE_CHRONOLOGY_LEVELS = [
  {
    id: "chrono-1",
    titre: "Les grandes étapes de l'Histoire sainte",
    niveau: "decouverte",
    events: [
      { id: "e1", label: "Création du monde", ref: "Genèse 1" },
      { id: "e2", label: "Le déluge et l'arche de Noé", ref: "Genèse 6–9" },
      { id: "e3", label: "L'appel d'Abraham", ref: "Genèse 12" },
      { id: "e4", label: "La sortie d'Égypte avec Moïse", ref: "Exode 12–14" },
      { id: "e5", label: "La naissance de Jésus à Bethléhem", ref: "Luc 2" }
    ],
    explication: "De la Création jusqu'à la venue de Jésus, Dieu tisse un plan fidèle d'alliance et de salut."
  },
  {
    id: "chrono-2",
    titre: "Les Patriarches et l'Égypte",
    niveau: "decouverte",
    events: [
      { id: "p1", label: "Alliance de Dieu avec Abraham", ref: "Genèse 15" },
      { id: "p2", label: "Naissance d'Isaac, fils de la promesse", ref: "Genèse 21" },
      { id: "p3", label: "Songe de l'échelle de Jacob à Béthel", ref: "Genèse 28" },
      { id: "p4", label: "Joseph devient gouverneur d'Égypte", ref: "Genèse 41" },
      { id: "p5", label: "Moïse devant le Buisson Ardent", ref: "Exode 3" }
    ],
    explication: "Abraham engendre Isaac, qui engendre Jacob (Israël), père de Joseph, avant la génération de Moïse."
  },
  {
    id: "chrono-3",
    titre: "De la Terre promise à la Royauté",
    niveau: "explorateur",
    events: [
      { id: "k1", label: "Passage du Jourdain et Jéricho sous Josué", ref: "Josué 3–6" },
      { id: "k2", label: "Samuel oint comme prophète en Israël", ref: "1 Samuel 3" },
      { id: "k3", label: "Victoire de David face à Goliath", ref: "1 Samuel 17" },
      { id: "k4", label: "Construction du temple de Jérusalem par Salomon", ref: "1 Rois 6" },
      { id: "k5", label: "Prière d'Élie sur le mont Carmel", ref: "1 Rois 18" }
    ],
    explication: "Après la conquête avec Josué et la période des Juges, Samuel inaugure la royauté avec David puis Salomon."
  },
  {
    id: "chrono-4",
    titre: "Exil, Reconstruction et Promesse",
    niveau: "explorateur",
    events: [
      { id: "ex1", label: "Ministère du prophète Ésaïe à Jérusalem", ref: "Ésaïe 6" },
      { id: "ex2", label: "Déportation à Babylone et fidélité de Daniel", ref: "Daniel 1–6" },
      { id: "ex3", label: "Édit de Cyrus permettant le retour de l'exil", ref: "Esdras 1" },
      { id: "ex4", label: "Courage de la reine Esther à Suse", ref: "Esther 4–7" },
      { id: "ex5", label: "Reconstruction des murailles par Néhémie", ref: "Néhémie 2–6" }
    ],
    explication: "Même pendant et après l'exil babylonien, l'Éternel préserve un reste fidèle et rebâtit Jérusalem."
  },
  {
    id: "chrono-5",
    titre: "De l'Annonciation à la Pentecôte",
    niveau: "decouverte",
    events: [
      { id: "j1", label: "Annonce de l'ange Gabriel à Marie", ref: "Luc 1" },
      { id: "j2", label: "Baptême de Jésus dans le Jourdain", ref: "Matthieu 3" },
      { id: "j3", label: "Multiplication des pains et des poissons", ref: "Jean 6" },
      { id: "j4", label: "Crucifixion et Résurrection de Jésus", ref: "Jean 19–20" },
      { id: "j5", label: "Effusion du Saint-Esprit à la Pentecôte", ref: "Actes 2" }
    ],
    explication: "La mort et la résurrection du Christ ouvrent la Nouvelle Alliance, scellée par l'envoi du Saint-Esprit à la Pentecôte."
  },
  {
    id: "chrono-6",
    titre: "L'essor de l'Église primitive",
    niveau: "expert",
    events: [
      { id: "ac1", label: "Guérison du boiteux à la Belle Porte", ref: "Actes 3" },
      { id: "ac2", label: "Témoignage et martyre d'Étienne", ref: "Actes 7" },
      { id: "ac3", label: "Rencontre de Saul de Tarse sur le chemin de Damas", ref: "Actes 9" },
      { id: "ac4", label: "Ouverture aux nations chez Corneille", ref: "Actes 10" },
      { id: "ac5", label: "Visions de Jean exilé à Patmos (Apocalypse)", ref: "Apocalypse 1" }
    ],
    explication: "Malgré la persécution, l'Évangile rayonne de Jérusalem à la Judée, à la Samarie et jusqu'aux extrémités de la terre (Actes 1:8)."
  }
];

export const WORD_PAIRS_CATEGORIES = [
  {
    id: "pairs-characters",
    titre: "Personnages et Histoires",
    description: "Relie chaque figure biblique à l'épisode qui marque son parcours.",
    pairs: [
      { id: "ch1", left: "Noé", right: "L'arche et l'arc dans la nuée (Genèse 9)" },
      { id: "ch2", left: "Ruth", right: "Les épis glanés à Bethléhem (Ruth 2)" },
      { id: "ch3", left: "Daniel", right: "La fosse aux lions (Daniel 6)" },
      { id: "ch4", left: "Zachée", right: "Le sycomore à Jéricho (Luc 19)" }
    ],
    explication: "Chaque rencontre avec Dieu transforme une existence ordinaire en témoignage durable."
  },
  {
    id: "pairs-authors",
    titre: "Livres et Auteurs établis",
    description: "Associe ces livres bibliques à leur auteur principal reconnu dans les Écritures.",
    pairs: [
      { id: "au1", left: "Lamentations", right: "Jérémie" },
      { id: "au2", left: "Psaume 23", right: "David" },
      { id: "au3", left: "Épître aux Philippiens", right: "Paul" },
      { id: "au4", left: "Apocalypse", right: "Jean à Patmos" }
    ],
    explication: "L'apôtre Paul écrit aux Philippiens depuis sa captivité, et Jean reçoit l'Apocalypse sur l'île de Patmos."
  },
  {
    id: "pairs-verses",
    titre: "Versets et Références",
    description: "Retrouve l'adresse exacte de ces versets précieux Louis Segond 1910.",
    pairs: [
      { id: "vr1", left: "« Au commencement était la Parole... »", right: "Jean 1:1" },
      { id: "vr2", left: "« L'Éternel est mon berger... »", right: "Psaume 23:1" },
      { id: "vr3", left: "« Je puis tout par celui qui me fortifie. »", right: "Philippiens 4:13" },
      { id: "vr4", left: "« Dieu est amour. »", right: "1 Jean 4:8" }
    ],
    explication: "Connaître la référence aide à retrouver rapidement une promesse pour la méditer ou la partager."
  },
  {
    id: "pairs-events",
    titre: "Événements et Personnages",
    description: "Associe chaque miracle ou signe de l'Écriture au témoin correspondant.",
    pairs: [
      { id: "ev1", left: "Buisson ardent au Sinaï", right: "Moïse" },
      { id: "ev2", left: "Murailles de Jéricho", right: "Josué" },
      { id: "ev3", left: "Noces de Cana", right: "Jésus et sa mère Marie" },
      { id: "ev4", left: "Chemin de Damas", right: "Saul de Tarse" }
    ],
    explication: "À chaque époque, Dieu agit concrètement dans l'histoire de son peuple."
  },
  {
    id: "pairs-qa",
    titre: "Questions et Réponses bibliques",
    description: "Relie chaque grande question biblique à sa réponse scripturaire.",
    pairs: [
      { id: "qa1", left: "Quel est le premier commandement ?", right: "Aimer Dieu de tout son cœur (Matthieu 22:37)" },
      { id: "qa2", left: "Qu'est-ce que la foi selon Hébreux 11:1 ?", right: "Ferme assurance des choses qu'on espère" },
      { id: "qa3", left: "Quelle armure résiste aux traits de l'ennemi ?", right: "Toutes les armes de Dieu (Éphésiens 6)" },
      { id: "qa4", left: "Quel est le plus grand des trois dons ?", right: "La charité / l'amour (1 Corinthiens 13:13)" }
    ],
    explication: "Les Écritures répondent directement aux interrogations essentielles du croyant."
  },
  {
    id: "pairs-promises",
    titre: "Promesses et Passages correspondants",
    description: "Associe chaque promesse fidèle de Dieu à son livre source.",
    pairs: [
      { id: "pr1", left: "Renouveler sa force comme l'aigle", right: "Ésaïe 40:31" },
      { id: "pr2", left: "La paix qui garde les cœurs", right: "Philippiens 4:7" },
      { id: "pr3", left: "Ni la mort ni la vie ne sépare de l'amour de Dieu", right: "Romains 8:38-39" },
      { id: "pr4", left: "Dieu essuiera toute larme de leurs yeux", right: "Apocalypse 21:4" }
    ],
    explication: "Les promesses de Dieu accompagnent le croyant depuis la Genèse jusqu'à la Nouvelle Jérusalem."
  }
];

export const TREASURE_RIDDLE_ADVENTURES = [
  {
    id: "adv-arche",
    titre: "Le Coffre de l'Alliance",
    sousTitre: "Une quête au cœur du désert du Sinaï",
    intro: "Dans le désert avec Moïse, un coffre sacré renferme les témoins de la fidélité de Dieu. Résous les trois énigmes pour recueillir ses trois indices et ouvrir le trésor spirituel.",
    recompense: { xp: 45, perles: 3, coffreNom: "Coffre de l'Alliance" },
    explicationFinale: "L'arche de l'alliance conservait les tables de l'alliance sous le propitiatoire, rappelant que la sainteté et la miséricorde de Dieu se rencontrent (Exode 25 ; Hébreux 9:4).",
    enigmes: [
      {
        question: "Quelle matière précieuse recouvrait entièrement l'arche de bois d'acacia ?",
        indice: "Exode 25:11 mentionne le métal le plus pur du sanctuaire.",
        options: ["De l'or pur", "Du fer forgé", "De la pierre calcaire", "Du bronze brut"],
        correctIndex: 0,
        cleIndice: "OR PUR"
      },
      {
        question: "Combien de figures célestes sculptées se faisaient face au-dessus du propitiatoire ?",
        indice: "Leurs ailes s'étendaient l'une vers l'autre (Exode 25:18-20).",
        options: ["Deux chérubins", "Quatre lions", "Douze colonnes", "Sept colombes"],
        correctIndex: 0,
        cleIndice: "DEUX CHÉRUBINS"
      },
      {
        question: "Quel élément essentiel fut déposé à l'intérieur de l'arche sur ordre de l'Éternel ?",
        indice: "Gravées sur la pierre au Sinaï, elles portaient les dix paroles de l'alliance.",
        options: ["Les tables du témoignage", "La couronne d'Égypte", "La fronde de David", "Le manteau d'Élie"],
        correctIndex: 0,
        cleIndice: "LOI DE VIE"
      }
    ]
  },
  {
    id: "adv-esaie",
    titre: "Le Rouleau d'Ésaïe",
    sousTitre: "À la découverte des promesses du Messie",
    intro: "À Jérusalem, les rouleaux prophétiques annoncent la venue du Sauveur bien des siècles avant Bethléhem. Rassemble trois indices prophétiques pour déverrouiller le coffre du Messie.",
    recompense: { xp: 50, perles: 3, coffreNom: "Rouleau de Lumière" },
    explicationFinale: "Jésus lui-même ouvrit le rouleau du prophète Ésaïe à la synagogue de Nazareth (Luc 4:16-21) pour annoncer l'accomplissement de ces promesses.",
    enigmes: [
      {
        question: "Dans Ésaïe 7:14, quel nom prophétique signifie « Dieu avec nous » ?",
        indice: "Matthieu 1:23 cite ce nom exact lors de l'annonce à Joseph.",
        options: ["Emmanuel", "Méthuschélah", "Schilo", "Boanergès"],
        correctIndex: 0,
        cleIndice: "EMMANUEL"
      },
      {
        question: "Dans Ésaïe 9:5, lequel de ces titres royaux est attribué à l'enfant qui nous est né ?",
        indice: "La paix de son règne n'aura point de fin.",
        options: ["Prince de la paix", "Roi de Babylone", "Capitaine d'Égypte", "Scribe de Rome"],
        correctIndex: 0,
        cleIndice: "PRINCE DE PAIX"
      },
      {
        question: "Selon Ésaïe 53:5, qu'est-ce qui est venu sur nos vies par ses meurtrissures ?",
        indice: "Un chapitre entier consacré au Serviteur souffrant.",
        options: ["Nous sommes guéris", "Nous recevons des richesses", "Nous bâtissons une tour", "Nous oublions la loi"],
        correctIndex: 0,
        cleIndice: "GRÂCE GUÉRISSANTE"
      }
    ]
  },
  {
    id: "adv-beatitudes",
    titre: "Le Trésor des Béatitudes",
    sousTitre: "Sur la montagne avec Jésus en Galilée",
    intro: "Les Béatitudes de Matthieu 5 tracent le portrait du bonheur selon le Royaume de Dieu. Assemble trois clés spirituelles pour ouvrir ce coffre.",
    recompense: { xp: 45, perles: 3, coffreNom: "Couronne des Béatitudes" },
    explicationFinale: "En Matthieu 5:1-12, Jésus renverse les critères du monde : les pauvres en esprit, les doux et les artisans de paix héritent du Royaume.",
    enigmes: [
      {
        question: "Selon Matthieu 5:3, à qui appartient le royaume des cieux ?",
        indice: "C'est la toute première Béatitude prononcée par Jésus.",
        options: ["Aux pauvres en esprit", "Aux plus rapides à parler", "Aux riches marchands", "Aux chefs militaires"],
        correctIndex: 0,
        cleIndice: "HUMILITÉ"
      },
      {
        question: "Quelle image Jésus donne-t-il ensuite aux disciples en Matthieu 5:13 ?",
        indice: "Cet élément donne de la saveur et préserve ce qui lui est confié.",
        options: ["Le sel de la terre", "Le fer du désert", "La poussière du chemin", "Le marbre du palais"],
        correctIndex: 0,
        cleIndice: "SEL DE LA TERRE"
      },
      {
        question: "Selon Matthieu 5:8, qui verra Dieu ?",
        indice: "La bénédiction est liée à la droiture intérieure.",
        options: ["Ceux qui ont le cœur pur", "Ceux qui bâtissent les plus hauts murs", "Ceux qui jeûnent pour être vus", "Ceux qui accumulent les titres"],
        correctIndex: 0,
        cleIndice: "CŒUR PUR"
      }
    ]
  },
  {
    id: "adv-ephesiens",
    titre: "L'Armure de la Lumière",
    sousTitre: "Tenir ferme dans la paix de l'Évangile",
    intro: "Dans Éphésiens 6:10-18, Paul décrit les armes spirituelles du pèlerin. Identifie chaque pièce pour ouvrir le coffre de la persévérance.",
    recompense: { xp: 55, perles: 4, coffreNom: "Bouclier de la Foi" },
    explicationFinale: "La ceinture de vérité, le bouclier de la foi et l'épée de l'Esprit qui est la Parole de Dieu nous équipent pour la marche quotidienne (Éphésiens 6:14-17).",
    enigmes: [
      {
        question: "Qu'est-ce qui sert de ceinture autour des reins du croyant selon Éphésiens 6:14 ?",
        indice: "Sans elle, aucune armure ne tient ensemble.",
        options: ["La vérité", "La colère", "L'orgueil", "L'argent"],
        correctIndex: 0,
        cleIndice: "VÉRITÉ"
      },
      {
        question: "Quelle arme permet d'éteindre tous les traits enflammés du malin (Éphésiens 6:16) ?",
        indice: "Elle se tient fermement devant soi comme une confiance totale en Dieu.",
        options: ["Le bouclier de la foi", "Le sceptre d'airain", "La lance de fer", "Le filet du pêcheur"],
        correctIndex: 0,
        cleIndice: "BOUCLIER DE FOI"
      },
      {
        question: "Qu'est-ce que l'épée de l'Esprit en Éphésiens 6:17 ?",
        indice: "La seule arme offensive citée dans toute la panoplie.",
        options: ["La Parole de Dieu", "Un discours humain", "Une loi de César", "Un chant de victoire militaire"],
        correctIndex: 0,
        cleIndice: "PAROLE DE DIEU"
      }
    ]
  }
];

export const LISTEN_AND_RECOGNIZE_ITEMS = [
  {
    id: "listen-1",
    categorie: "Verset à reconnaître",
    audioText: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.",
    question: "De quel livre biblique provient cette parole écoutée ?",
    options: ["Psaumes (119:105)", "Genèse (1:1)", "Apocalypse (21:1)", "Actes (2:4)"],
    correctIndex: 0,
    ref: "Psaume 119:105",
    explication: "Le Psaume 119 célèbre tout entier l'amour et la lumière des commandements de l'Éternel."
  },
  {
    id: "listen-2",
    categorie: "Histoire biblique",
    audioText: "La femme samaritaine vint puiser de l'eau à midi. Jésus lui demanda à boire et lui parla d'une eau vive qui jaillit jusque dans la vie éternelle.",
    question: "Près de quelle ville biblique cette rencontre eut-elle lieu ?",
    options: ["Sichar en Samarie (puits de Jacob)", "Jéricho en Judée", "Damas en Syrie", "Tarse en Cilicie"],
    correctIndex: 0,
    ref: "Jean 4:5-14",
    explication: "En Jean 4:5, Jésus arrive à Sichar, près du champ que Jacob avait donné à son fils Joseph."
  },
  {
    id: "listen-3",
    categorie: "Description de personnage",
    audioText: "C'était un publicain de petite taille, très riche, qui courut en avant et monta sur un sycomore pour apercevoir Jésus qui traversait Jéricho.",
    question: "Quel personnage biblique vient d'être décrit ?",
    options: ["Zachée", "Nicodème", "Lazare", "Barnabas"],
    correctIndex: 0,
    ref: "Luc 19:1-10",
    explication: "Jésus s'arrêta sous le sycomore et dit : « Zachée, hâte-toi de descendre ; car il faut que je demeure aujourd'hui dans ta maison. »"
  },
  {
    id: "listen-4",
    categorie: "Verset à reconnaître",
    audioText: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.",
    question: "Qui prononce cette parole réconfortante dans la chambre haute ?",
    options: ["Jésus à ses disciples", "Moïse devant Pharaon", "David devant Saül", "Paul devant Félix"],
    correctIndex: 0,
    ref: "Jean 14:27",
    explication: "Juste avant Gethsémané, Jésus offre sa propre paix pour fortifier le cœur des disciples."
  },
  {
    id: "listen-5",
    categorie: "Question biblique",
    audioText: "Combien de pains d'orge et combien de poissons un jeune garçon offrit-il avant que Jésus ne nourrisse la foule en Galilée ?",
    question: "Écoute bien la question et choisis la réponse exacte selon Jean 6:9 :",
    options: ["Cinq pains d'orge et deux poissons", "Trois pains et trois poissons", "Sept pains et sept poissons", "Douze pains sans poisson"],
    correctIndex: 0,
    ref: "Jean 6:9-13",
    explication: "Avec cinq pains d'orge et deux poissons, plus de cinq mille hommes furent rassasiés et douze paniers restèrent."
  },
  {
    id: "listen-6",
    categorie: "Histoire biblique",
    audioText: "Au milieu de la nuit, dans une prison de Philippes, les pieds serrés dans les ceps, deux serviteurs de Christ priaient et chantaient les louanges de Dieu, quand soudain un grand tremblement de terre secoua les fondements de la prison.",
    question: "Qui louait Dieu au cœur de cette prison ?",
    options: ["Paul et Silas", "Pierre et André", "Moïse et Aaron", "Philippe et l'eunuque"],
    correctIndex: 0,
    ref: "Actes 16:25-34",
    explication: "La louange de Paul et Silas au milieu de l'épreuve conduisit à la conversion et au baptême du geôlier et de toute sa famille."
  },
  {
    id: "listen-7",
    categorie: "Description de personnage",
    audioText: "Disciple de Jérusalem plein de foi et du Saint-Esprit, il choisit de rester fidèle devant le sanhédrin et pria en mourant pour que ses persécuteurs soient pardonnés.",
    question: "Qui est ce premier témoin martyr de l'Église ?",
    options: ["Étienne", "Silas", "Tite", "Luc"],
    correctIndex: 0,
    ref: "Actes 6–7",
    explication: "En Actes 7:60, Étienne s'écria : « Seigneur, ne leur impute pas ce péché ! »"
  },
  {
    id: "listen-8",
    categorie: "Verset à reconnaître",
    audioText: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle.",
    question: "Quelle est la référence exacte de ce verset central ?",
    options: ["Jean 3:16", "Romains 3:16", "Actes 3:16", "1 Jean 3:16"],
    correctIndex: 0,
    ref: "Jean 3:16",
    explication: "Jean 3:16 résume l'amour de Dieu donné en Jésus-Christ pour quiconque croit."
  }
];

export const CHARACTER_JOURNEYS_DATA = [
  {
    id: "char-noe",
    nom: "Noé",
    titre: "Le bâtisseur de la confiance",
    époque: "Origines",
    avatar: "🌈",
    intro: "Dans un monde livré à la violence, Noé marche avec Dieu et reçoit une mission sans précédent.",
    histoire: "Dieu révèle à Noé la venue du déluge et lui commande de construire une immense arche pour préserver sa famille et chaque espèce d'animaux. Durant de longues années de chantier sous le regard incrédule de ses contemporains, Noé achève tout ce que Dieu lui a ordonné.",
    actions: ["Bâtir l'arche exactement selon les mesures divines", "Faire entrer sa famille et les animaux avant les eaux", "Offrir un holocauste de reconnaissance à la sortie"],
    epreuves: "L'isolement moral face à une génération corrompue et la longue attente enfermé dans l'arche jusqu'au retrait des eaux.",
    enseignements: "La foi obéit même avant de voir la pluie tomber ; Dieu n'oublie jamais ceux qui mettent leur confiance en sa parole (Genèse 8:1).",
    versets: [
      { ref: "Genèse 6:8", texte: "Mais Noé trouva grâce aux yeux de l'Éternel." },
      { ref: "Genèse 9:13", texte: "J'ai placé mon arc dans la nue, et il servira de signe d'alliance entre moi et la terre." }
    ],
    questions: [
      {
        q: "Quel oiseau Noé envoya-t-il et vit revenir avec une feuille d'olivier fraîche ?",
        options: ["Une colombe", "Un aigle", "Un passereau", "Une cigogne"],
        correctIndex: 0
      },
      {
        q: "Quel signe Dieu plaça-t-il dans la nuée après le déluge selon Louis Segond 1910 ?",
        options: ["Son arc dans la nue", "Une étoile fixe", "Une colonne de sable", "Un bouclier d'or"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-abraham",
    nom: "Abraham",
    titre: "Le père de tous les croyants",
    époque: "Patriarches",
    avatar: "⭐",
    intro: "Appelé à quitter sa patrie, Abram reçoit la promesse d'être une bénédiction pour toutes les familles de la terre.",
    histoire: "Parti sans carte sur la seule parole de Dieu, Abraham dresse des autels partout où il plante sa tente. Malgré son grand âge et celui de Sara, il croit que Dieu tiendra sa promesse de postérité et voit naître Isaac.",
    actions: ["Quitter Ur puis Charan vers la terre promise", "Choisir la paix avec son neveu Lot", "Confesser sur le mont Morija que Dieu pourvoira lui-même"],
    epreuves: "L'attente longue de 25 ans avant la naissance d'Isaac et l'épreuve ultime de Genèse 22.",
    enseignements: "La promesse de Dieu ne dépend pas de nos délais humains : elle repose sur la fidélité du Très-Haut.",
    versets: [
      { ref: "Genèse 15:6", texte: "Abram eut confiance en l'Éternel, qui le lui imputa à justice." },
      { ref: "Genèse 22:14", texte: "Abraham donna à ce lieu le nom de Jéhovah-Jiré. C'est pourquoi l'on dit aujourd'hui : À la montagne de l'Éternel il sera pourvu." }
    ],
    questions: [
      {
        q: "Que signifie le nom Jéhovah-Jiré donné par Abraham en Genèse 22:14 ?",
        options: ["L'Éternel pourvoira", "L'Éternel est rapide", "La montagne de pierre", "Le désert d'or"],
        correctIndex: 0
      },
      {
        q: "Quel roi de Salem apporta du pain et du vin et bénit Abram ?",
        options: ["Melchisédek", "Pharaon", "Abimélec", "Cyrus"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-joseph",
    nom: "Joseph",
    titre: "La fidélité qui pardonne",
    époque: "Patriarches en Égypte",
    avatar: "🌾",
    intro: "Vendu par ses propres frères, Joseph découvre la main silencieuse de Dieu jusque dans les cachots d'Égypte.",
    histoire: "Esclave chez Potiphar puis oublié en prison pendant deux ans après l'interprétation des songes, Joseph reste intègre devant Dieu. Élevé au rang de gouverneur pour sauver le pays de la famine, il accueille ses frères avec larmes et pardon.",
    actions: ["Refuser la tentation en déclarant « Comment ferais-je un aussi grand mal contre Dieu ? »", "Administrer avec sagesse sept années d'abondance", "Nourrir et pardonner sa famille au lieu de se venger"],
    epreuves: "Trahison familiale, calomnie, années de prison injuste.",
    enseignements: "Dieu peut transformer en bien même les blessures causées par les hommes, lorsque le cœur garde le pardon.",
    versets: [
      { ref: "Genèse 50:20", texte: "Vous aviez médité de me faire du mal : Dieu l'a changé en bien, pour accomplir ce qui arrive aujourd'hui, pour sauver la vie à un peuple nombreux." }
    ],
    questions: [
      {
        q: "À quoi servaient les sept vaches grasses et les sept vaches maigres du songe de Pharaon ?",
        options: ["7 ans d'abondance suivis de 7 ans de famine", "7 villes puis 7 fleuves", "7 tribus puis 7 rois", "7 jours de pluie"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-moise",
    nom: "Moïse",
    titre: "Le libérateur et intercesseur",
    époque: "Exode & Sinaï",
    avatar: "🔥",
    intro: "Sauvé des eaux du Nil, berger au désert, Moïse devient l'instrument de la délivrance d'Israël.",
    histoire: "Devant le buisson ardent, Moïse hésite devant sa faiblesse de parole, mais accepte l'envoi divin. Il conduit le peuple à travers la mer Rouge, reçoit la Loi sur le Sinaï et intercède avec passion pour Israël.",
    actions: ["Annoncer la délivrance devant Pharaon", "Étendre la verge sur la mer Rouge", "Transmettre les dix commandements en Exode 20"],
    epreuves: "Les murmures continuels du peuple au désert et la lourde charge de porter Israël pendant 40 ans.",
    enseignements: "Dieu n'appelle pas seulement les personnes déjà sûres d'elles : il promet « Je serai avec toi ».",
    versets: [
      { ref: "Exode 3:14", texte: "Dieu dit à Moïse : Je suis celui qui suis." },
      { ref: "Exode 14:14", texte: "L'Éternel combattra pour vous ; et vous, gardez le silence." }
    ],
    questions: [
      {
        q: "Comment Dieu se nomma-t-il devant Moïse au buisson ardent (Exode 3:14) ?",
        options: ["Je suis celui qui suis", "Le Roi d'Orient", "Le Maître des étoiles", "L'Ancien de Madian"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-ruth",
    nom: "Ruth",
    titre: "La loyauté sous les ailes du Très-Haut",
    époque: "Juges",
    avatar: "🌾",
    intro: "Étrangère venue de Moab, Ruth choisit la fidélité envers Naomi et la foi au Dieu d'Israël.",
    histoire: "Alors qu'Orpa repart dans son pays natal, Ruth s'attache à Naomi et travaille humblement dans les champs à Bethléhem. Boaz reconnaît sa bonté et devient son rédempteur.",
    actions: ["Rester auprès de Naomi endeuillée", "Glaner avec persévérance pour nourrir sa belle-mère", "Devenir l'aïeule du roi David"],
    epreuves: "Le veuvage, l'exil volontaire dans un pays inconnu et la pauvreté.",
    enseignements: "Aucun geste de loyauté et de bonté quotidienne n'échappe au regard bienveillant de Dieu.",
    versets: [
      { ref: "Ruth 1:16", texte: "Où tu iras j'irai, où tu demeureras je demeurerai ; ton peuple sera mon peuple, et ton Dieu sera mon Dieu ;" }
    ],
    questions: [
      {
        q: "De quel grand roi d'Israël Ruth devint-elle l'arrière-grand-mère ?",
        options: ["David", "Saül", "Jéroboam", "Ézéchias"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-david",
    nom: "David",
    titre: "Le berger et chantre d'Israël",
    époque: "Royauté",
    avatar: "🎵",
    intro: "Oublié de ses frères parmi les troupeaux, David avait déjà le cœur tourné vers l'Éternel.",
    histoire: "Oint secrètement par Samuel, David sert Saül par sa harpe, affronte Goliath avec confiance, épargne plusieurs fois la vie de Saül qui le pourchasse, puis règne sur Israël et compose une grande part des Psaumes.",
    actions: ["Faire confiance à l'Éternel face à Goliath", "Respecter l'oint de Dieu même persécuté", "Se repentir sincèrement (Psaume 51)"],
    epreuves: "Années d'errance poursuivi dans les cavernes et fautes personnelles douloureusement réparées.",
    enseignements: "L'homme selon le cœur de Dieu n'est pas sans chute : c'est celui qui revient vers Dieu dans la vérité (1 Samuel 16:7).",
    versets: [
      { ref: "1 Samuel 16:7", texte: "L'homme regarde à ce qui frappe les yeux, mais l'Éternel regarde au cœur." }
    ],
    questions: [
      {
        q: "Selon 1 Samuel 16:7, à quoi l'Éternel regarde-t-il chez chacun ?",
        options: ["Au cœur", "À la taille seulement", "Au nombre d'armes", "À l'habit royal"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-esther",
    nom: "Esther",
    titre: "Courage pour un temps comme celui-ci",
    époque: "Exil & Retour",
    avatar: "👑",
    intro: "Orpheline juive devenue reine en Perse, Esther choisit d'intercéder pour son peuple menacé.",
    histoire: "Face au décret d'anéantissement préparé par Haman, Mardochée rappelle à Esther qu'elle a peut-être atteint la royauté pour un moment pareil. Elle convie son peuple au jeûne et risque sa vie devant Assuérus.",
    actions: ["Appeler au jeûne et à l'unité", "Avancer avec sagesse et respect devant le roi", "Sauver la vie des Juifs de tout l'empire"],
    epreuves: "Le risque de mort en entrant sans convocation dans la cour intérieure du roi.",
    enseignements: "La position et l'influence reçues ne sont pas pour notre confort seul, mais pour servir notre prochain.",
    versets: [
      { ref: "Esther 4:14", texte: "Et qui sait si ce n'est pas pour un temps comme celui-ci que tu es parvenue à la royauté ?" }
    ],
    questions: [
      {
        q: "Qui éleva Esther et lui envoya ce rappel décisif en Esther 4:14 ?",
        options: ["Mardochée", "Néhémie", "Esdras", "Daniel"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-daniel",
    nom: "Daniel",
    titre: "Fidèle jusque dans la fosse aux lions",
    époque: "Exil à Babylone",
    avatar: "🦁",
    intro: "Jeune exilé à la cour de Babylone, Daniel montre comment servir dans la cité sans trahir sa foi.",
    histoire: "De Nabuchodonosor jusqu'à Darius, Daniel excelle par son intégrité et sa vie de prière. Lorsqu'un décret interdit de prier qui que ce soit d'autre que le roi pendant trente jours, il continue à prier Dieu trois fois par jour.",
    actions: ["Rester sobre et pur dès son arrivée à Babylone", "Louer Dieu qui révèle les choses cachées", "Prier fidèlement malgré la menace de la fosse aux lions"],
    epreuves: "Déportation loin du Temple et jalousie des gouverneurs cherchant un piège contre sa foi.",
    enseignements: "Une vie secrète de prière donne une paix inébranlable au moment des décisions difficiles.",
    versets: [
      { ref: "Daniel 6:10", texte: "Trois fois le jour il se mettait à genoux, il priait, et il louait son Dieu, comme il le faisait auparavant." }
    ],
    questions: [
      {
        q: "Combien de fois par jour Daniel priait-il vers Jérusalem ?",
        options: ["Trois fois le jour", "Une fois par an", "Uniquement la nuit", "Sept fois par semaine seulement"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-pierre",
    nom: "Pierre",
    titre: "Relevé par la grâce de Jésus",
    époque: "Évangiles & Actes",
    avatar: "⛵",
    intro: "Pêcheur spontané parfois emporté, Simon Pierre devient un pilier humble de l'Église naissante.",
    histoire: "Appelé sur les rives de Galilée pour devenir pêcheur d'hommes, Pierre marche un instant sur les eaux puis sombre quand il regarde le vent. Relevé après son reniement par la tendresse de Jésus ressuscité, il annonce Christ devant trois mille personnes à la Pentecôte.",
    actions: ["Suivre Jésus en quittant ses filets", "Confesser Jésus comme le Messie", "Prêcher hardiment la résurrection dans le livre des Actes"],
    epreuves: "La honte de son reniement pendant la nuit du procès et les prisons à Jérusalem.",
    enseignements: "La chute ne marque jamais le point final lorsque l'on revient vers le Seigneur avec humilité.",
    versets: [
      { ref: "Jean 21:17", texte: "Seigneur, tu sais toutes choses, tu sais que je t'aime. Jésus lui dit : Pais mes brebis." }
    ],
    questions: [
      {
        q: "Quelle question Jésus posa-t-il trois fois à Pierre au bord du lac en Jean 21 ?",
        options: ["« M'aimes-tu ? »", "« Connais-tu les Psaumes ? »", "« As-tu construit un temple ? »", "« Combien de poissons as-tu vendus ? »"],
        correctIndex: 0
      }
    ]
  },
  {
    id: "char-paul",
    nom: "Paul",
    titre: "L'apôtre infatigable de la grâce",
    époque: "Actes & Épîtres",
    avatar: "✉️",
    intro: "Rencontré par le Christ ressuscité près de Damas, Paul parcourt le monde méditerranéen pour annoncer l'Évangile.",
    histoire: "Ancien pharisien persécuteur, Saul devient Paul, frère accueilli par Ananias puis Barnabas. De Philippes à Corinthe, d'Éphèse à Rome, il fonde et encourage les Églises à travers ses voyages et ses lettres inspirées.",
    actions: ["Annoncer que Christ aime l'Église et sauve par grâce", "Chanter la louange en prison à Philippes", "Écrire des lettres nourrissant encore les croyants aujourd'hui"],
    epreuves: "Naufrages, prisons, coups, fatigues et soucis constants pour toutes les Églises (2 Corinthiens 11).",
    enseignements: "Lorsque nous sommes faibles en nous-mêmes, la grâce du Seigneur suffit et manifeste sa puissance (2 Corinthiens 12:9).",
    versets: [
      { ref: "2 Corinthiens 12:9", texte: "Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse." }
    ],
    questions: [
      {
        q: "Quel disciple à Damas pria pour Saul afin qu'il retrouve la vue ?",
        options: ["Ananias", "Silas", "Théophile", "Nicodème"],
        correctIndex: 0
      }
    ]
  }
];

export const EXTENDED_BIBLE_CHAPTERS = {
  "psa-1": {
    titre: "Les deux chemins — L'homme heureux",
    livre: "Psaumes",
    chapitre: 1,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "Heureux l'homme qui ne marche pas selon le conseil des méchants, qui ne s'arrête pas sur la voie des pécheurs, et qui ne s'assied pas en compagnie des moqueurs,", cle: true },
      { num: 2, texte: "Mais qui trouve son plaisir dans la loi de l'Éternel, et qui la médite jour et nuit !", cle: true },
      { num: 3, texte: "Il est comme un arbre planté près d'un courant d'eau, qui donne son fruit en sa saison, et dont le feuillage ne se flétrit point : tout ce qu'il fait lui réussit.", cle: true }
    ]
  },
  "psa-121": {
    titre: "Le secours vient de l'Éternel",
    livre: "Psaumes",
    chapitre: 121,
    testament: "Ancien Testament",
    versets: [
      { num: 1, texte: "Cantique des degrés. Je lève mes yeux vers les montagnes... D'où me viendra le secours ?", cle: true },
      { num: 2, texte: "Le secours me vient de l'Éternel, qui a fait les cieux et la terre.", cle: true },
      { num: 5, texte: "L'Éternel est celui qui te garde, l'Éternel est ton ombre à ta main droite." },
      { num: 8, texte: "L'Éternel gardera ton départ et ton arrivée, dès maintenant et à jamais.", cle: true }
    ]
  },
  "pro-3": {
    titre: "La confiance qui éclaire les sentiers",
    livre: "Proverbes",
    chapitre: 3,
    testament: "Ancien Testament",
    versets: [
      { num: 5, texte: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ;", cle: true },
      { num: 6, texte: "Reconnais-le dans toutes tes voies, et il aplanira tes sentiers.", cle: true },
      { num: 13, texte: "Heureux l'homme qui a trouvé la sagesse, et l'homme qui possède l'intelligence !" }
    ]
  },
  "mat-6": {
    titre: "La prière du Notre Père",
    livre: "Matthieu",
    chapitre: 6,
    testament: "Nouveau Testament",
    versets: [
      { num: 9, texte: "Voici donc comment vous devez prier : Notre Père qui es aux cieux ! Que ton nom soit sanctifié ;", cle: true },
      { num: 10, texte: "que ton règne vienne ; que ta volonté soit faite sur la terre comme au ciel." },
      { num: 11, texte: "Donne-nous aujourd'hui notre pain quotidien ;" },
      { num: 12, texte: "pardonne-nous nos offenses, comme nous aussi nous pardonnons à ceux qui nous ont offensés ;" },
      { num: 33, texte: "Cherchez premièrement le royaume et la justice de Dieu ; et toutes ces choses vous seront données par-dessus.", cle: true }
    ]
  },
  "jea-14": {
    titre: "Le Chemin, la Vérité, la Vie",
    livre: "Jean",
    chapitre: 14,
    testament: "Nouveau Testament",
    versets: [
      { num: 1, texte: "Que votre cœur ne se trouble point. Croyez en Dieu, et croyez en moi.", cle: true },
      { num: 6, texte: "Jésus lui dit : Je suis le chemin, la vérité, et la vie. Nul ne vient au Père que par moi.", cle: true },
      { num: 27, texte: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.", cle: true }
    ]
  },
  "jea-15": {
    titre: "Le vrai Cep et les sarments",
    livre: "Jean",
    chapitre: 15,
    testament: "Nouveau Testament",
    versets: [
      { num: 5, texte: "Je suis le cep, vous êtes les sarments. Celui qui demeure en moi et en qui je demeure porte beaucoup de fruit, car sans moi vous ne pouvez rien faire.", cle: true },
      { num: 12, texte: "C'est ici mon commandement : Aimez-vous les uns les autres, comme je vous ai aimés.", cle: true }
    ]
  },
  "rom-12": {
    titre: "Le culte raisonnable et l'amour fraternel",
    livre: "Romains",
    chapitre: 12,
    testament: "Nouveau Testament",
    versets: [
      { num: 2, texte: "Ne vous conformez pas au siècle présent, mais soyez transformés par le renouvellement de l'intelligence, afin que vous discerniez quelle est la volonté de Dieu, ce qui est bon, agréable et parfait.", cle: true },
      { num: 12, texte: "Réjouissez-vous en espérance. Soyez patients dans l'affliction. Persévérez dans la prière." },
      { num: 21, texte: "Ne te laisse pas vaincre par le mal, mais surmonte le mal par le bien.", cle: true }
    ]
  },
  "phi-4": {
    titre: "La joie et la paix en Jésus-Christ",
    livre: "Philippiens",
    chapitre: 4,
    testament: "Nouveau Testament",
    versets: [
      { num: 4, texte: "Réjouissez-vous toujours dans le Seigneur ; je le répète, réjouissez-vous.", cle: true },
      { num: 6, texte: "Ne vous inquiétez de rien ; mais en toute chose faites connaître vos besoins à Dieu par des prières et des supplications, avec des actions de grâces.", cle: true },
      { num: 7, texte: "Et la paix de Dieu, qui surpasse toute intelligence, gardera vos cœurs et vos pensées en Jésus-Christ.", cle: true },
      { num: 13, texte: "Je puis tout par celui qui me fortifie.", cle: true }
    ]
  },
  "jac-1": {
    titre: "Demander la sagesse et mettre la Parole en pratique",
    livre: "Jacques",
    chapitre: 1,
    testament: "Nouveau Testament",
    versets: [
      { num: 5, texte: "Si quelqu'un d'entre vous manque de sagesse, qu'il la demande à Dieu, qui donne à tous simplement et sans reproche, et elle lui sera donnée.", cle: true },
      { num: 22, texte: "Mettez en pratique la parole, et ne vous bornez pas à l'écouter, en vous trompant vous-mêmes par de faux raisonnements.", cle: true }
    ]
  },
  "1jn-4": {
    titre: "Dieu est amour",
    livre: "1 Jean",
    chapitre: 4,
    testament: "Nouveau Testament",
    versets: [
      { num: 7, texte: "Bien-aimés, aimons-nous les uns les autres ; car l'amour est de Dieu, et quiconque aime est né de Dieu et connaît Dieu." },
      { num: 8, texte: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour.", cle: true },
      { num: 19, texte: "Pour nous, nous l'aimons, parce qu'il nous a aimés le premier.", cle: true }
    ]
  }
};

export const BOOK_INTRODUCTIONS = {
  gen: { resume: "Livre des origines : création du monde, chute humaine, déluge, alliances avec Noé puis les patriarches Abraham, Isaac, Jacob et Joseph.", personnagesCles: ["Adam & Ève", "Noé", "Abraham", "Joseph"] },
  exo: { resume: "Récit fondateur de la délivrance d'Israël hors d'Égypte, de l'alliance du Sinaï et des dix commandements.", personnagesCles: ["Moïse", "Aaron", "Marie"] },
  deu: { resume: "Derniers discours de Moïse appelant le peuple à aimer l'Éternel de tout son cœur avant d'entrer en Terre promise.", personnagesCles: ["Moïse", "Josué"] },
  psa: { resume: "Recueil de 150 cantiques et prières embrassant toutes les saisons de l'âme : louange, confiance, lamentation et espérance.", personnagesCles: ["David", "Asaph", "Fils de Koré"] },
  pro: { resume: "Trésor de sagesse pratique fondée sur la crainte respectueuse de l'Éternel dans la vie quotidienne.", personnagesCles: ["Salomon"] },
  esa: { resume: "Grande prophétie annonçant la sainteté de Dieu, la consolation d'Israël et la venue du Serviteur souffrant et du Prince de paix.", personnagesCles: ["Ésaïe"] },
  dan: { resume: "Témoignage de fidélité à Babylone et révélations sur le Royaume éternel que Dieu établit.", personnagesCles: ["Daniel", "Schadrac", "Méschac", "Abed-Nego"] },
  mat: { resume: "Évangile mettant en lumière Jésus comme le Messie accompli des Écritures et Roi du Royaume des cieux.", personnagesCles: ["Jésus", "Marie", "Joseph", "Pierre"] },
  jea: { resume: "Évangile du Verbe fait chair, des sept grands signes et des paroles « Je suis », pour que le lecteur croie et ait la vie.", personnagesCles: ["Jésus", "Jean-Baptiste", "Nicodème", "Marthe & Marie", "Lazare"] },
  act: { resume: "Expansion vivante de l'Église par la puissance du Saint-Esprit, de Jérusalem jusqu'à Rome.", personnagesCles: ["Pierre", "Étienne", "Philippe", "Paul", "Barnabas"] },
  rom: { resume: "Exposé magistral de la justice de Dieu reçue par la foi et de la vie transformée dans l'Esprit.", personnagesCles: ["Paul"] },
  "1co": { resume: "Lettre aux croyants de Corinthe sur l'unité en Christ, la charité (ch. 13) et l'espérance de la résurrection (ch. 15).", personnagesCles: ["Paul", "Apollos"] },
  phi: { resume: "Épître de la joie écrite depuis la prison, centrée sur l'humilité de Christ et la paix qui garde le cœur.", personnagesCles: ["Paul", "Timothée", "Épaphrodite"] },
  jac: { resume: "Lettre concrète reliant la foi vivante à la sagesse, la maîtrise de la parole et l'amour pratique envers les démunis.", personnagesCles: ["Jacques"] },
  "1jn": { resume: "Lettre apostolique attestant la lumière, la vérité et l'amour de Dieu manifestés en Jésus.", personnagesCles: ["Jean"] },
  apo: { resume: "Révélation de Jésus-Christ glorieux soutenant son Église persécutée jusqu'aux nouveaux cieux et à la nouvelle terre.", personnagesCles: ["Jésus-Christ", "Jean à Patmos"] }
};

export const THEMATIC_PATHS_DATA = [
  {
    id: "tp-foi",
    titre: "Fondements de la Foi",
    type: "Thématique",
    icone: "⛰️",
    description: "De la Création aux témoins d'Hébreux 11, découvre comment naît et grandit la confiance en Dieu.",
    chapitresKeys: ["gen-1", "gen-22", "jea-3"],
    versetCle: "Hébreux 11:1",
    resumePratique: "Choisis aujourd'hui un sujet précis que tu remets entre les mains de Dieu avec confiance."
  },
  {
    id: "tp-priere",
    titre: "À l'École de la Prière",
    type: "Thématique",
    icone: "🙏",
    description: "Prier avec vérité et simplicité comme David, Daniel et les disciples guidés par Jésus.",
    chapitresKeys: ["psa-23", "dan-9", "mat-6", "phi-4"],
    versetCle: "Philippiens 4:6",
    resumePratique: "Prends 3 minutes aujourd'hui pour prier avec gratitude avant même de formuler tes demandes."
  },
  {
    id: "tp-paix",
    titre: "La Paix dans l'Épreuve",
    type: "Thématique",
    icone: "🕊️",
    description: "Trouver la sérénité intérieure lorsque l'horizon paraît troublé.",
    chapitresKeys: ["psa-91", "psa-121", "jea-14", "rom-8"],
    versetCle: "Jean 14:27",
    resumePratique: "Médite le Psaume 121 ou Jean 14:27 à voix haute avant de commencer ou clore ta journée."
  },
  {
    id: "tp-sagesse",
    titre: "Sagesse pour chaque jour",
    type: "Par livre (Proverbes & Jacques)",
    icone: "🦉",
    description: "Associer l'écoute de la Parole à des choix concrets remplis de droiture.",
    chapitresKeys: ["psa-1", "pro-3", "pro-30", "jac-1"],
    versetCle: "Proverbes 3:5-6",
    resumePratique: "Avant une décision importante cette semaine, demande la sagesse décrite en Jacques 1:5."
  },
  {
    id: "tp-jean",
    titre: "Parcours Évangile de Jean",
    type: "Par livre (Jean)",
    icone: "📖",
    description: "Du Verbe fait chair jusqu'au vrai Cep : entrer dans l'intimité du message johannique.",
    chapitresKeys: ["jea-1", "jea-3", "jea-14", "jea-15"],
    versetCle: "Jean 15:5",
    resumePratique: "Demeure attaché à Christ en retenant l'une des affirmations « Je suis » cette semaine."
  },
  {
    id: "tp-amour",
    titre: "L'Amour Fraternel",
    type: "Thématique",
    icone: "💖",
    description: "Aimer concrètement en action et avec vérité à l'image du Seigneur.",
    chapitresKeys: ["mat-5", "rom-12", "1co-13", "1jn-4"],
    versetCle: "1 Jean 4:8",
    resumePratique: "Pose aujourd'hui un geste discret de réconciliation, de pardon ou d'encouragement envers un proche."
  }
];
