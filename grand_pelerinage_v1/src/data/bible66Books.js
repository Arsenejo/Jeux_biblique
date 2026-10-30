// Corpus Canonique Intégral : Les 66 Livres de la Bible (Louis Segond 1910)
// Propriété spirituelle : Église Évangélique Assemblée de la Grâce — Issia (Côte d'Ivoire)

export const BIBLE_66_BOOKS = [
  // ==========================================
  // ANCIEN TESTAMENT (39 LIVRES)
  // ==========================================
  // PENTATEUQUE (LA LOI / LA THORA)
  {
    id: "gen",
    nom: "Genèse",
    testament: "AT",
    section: "Pentateuque",
    chapitres: 50,
    auteur: "Moïse",
    theme: "Les commencements, la création et l'alliance avec Abraham",
    versetOr: {
      ref: "Genèse 1:1",
      texte: "Au commencement, Dieu créa les cieux et la terre."
    },
    questionDefi: {
      question: "Quel patriarche a reçu la promesse que toutes les familles de la terre seraient bénies en sa postérité ?",
      options: ["Abraham", "Noé", "Adam", "Joseph"],
      reponse: "Abraham",
      explication: "Dieu appelle Abram en Genèse 12 et scelle avec lui une alliance éternelle pour toutes les nations."
    }
  },
  {
    id: "exo",
    nom: "Exode",
    testament: "AT",
    section: "Pentateuque",
    chapitres: 40,
    auteur: "Moïse",
    theme: "La délivrance de la servitude, la Pâque et la Loi au Sinaï",
    versetOr: {
      ref: "Exode 14:14",
      texte: "L'Éternel combattra pour vous ; et vous, gardez le silence."
    },
    questionDefi: {
      question: "Par quel miracle Dieu a-t-il fait passer Israël à sec pour échapper à l'armée de Pharaon ?",
      options: ["L'ouverture de la mer Rouge", "L'arrêt du soleil", "L'écroulement des murailles", "La manne du ciel"],
      reponse: "L'ouverture de la mer Rouge",
      explication: "Exode 14 montre Dieu fendant les eaux de la mer Rouge devant Moïse et son peuple."
    }
  },
  {
    id: "lev",
    nom: "Lévitique",
    testament: "AT",
    section: "Pentateuque",
    chapitres: 27,
    auteur: "Moïse",
    theme: "La sainteté de Dieu, le sacerdoce et les sacrifices",
    versetOr: {
      ref: "Lévitique 19:2",
      texte: "Soyez saints, car je suis saint, moi, l'Éternel, votre Dieu."
    },
    questionDefi: {
      question: "Quelle tribu d'Israël a été mise à part pour le service sacerdotal du tabernacle ?",
      options: ["La tribu de Lévi", "La tribu de Juda", "La tribu de Benjamin", "La tribu d'Éphraïm"],
      reponse: "La tribu de Lévi",
      explication: "Les Lévites et les descendants d'Aaron assuraient le culte et les sacrifices selon Lévitique."
    }
  },
  {
    id: "nom",
    nom: "Nombres",
    testament: "AT",
    section: "Pentateuque",
    chapitres: 36,
    auteur: "Moïse",
    theme: "La marche au désert, la fidélité divine et les dénombrements",
    versetOr: {
      ref: "Nombres 6:24-26",
      texte: "Que l'Éternel te bénisse, et qu'il te garde ! Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce !"
    },
    questionDefi: {
      question: "Quels sont les deux seuls espions parmi les douze qui ont encouragé le peuple à entrer en Canaan avec foi ?",
      options: ["Josué et Caleb", "Moïse et Aaron", "Gédéon et Samson", "Élie et Élisée"],
      reponse: "Josué et Caleb",
      explication: "Dans Nombres 14, Josué et Caleb proclament : « Si l'Éternel nous est favorable, il nous mènera dans ce pays ! »"
    }
  },
  {
    id: "deu",
    nom: "Deutéronome",
    testament: "AT",
    section: "Pentateuque",
    chapitres: 34,
    auteur: "Moïse",
    theme: "Le rappel de la Loi, l'appel à l'amour entier de Dieu et le choix de la vie",
    versetOr: {
      ref: "Deutéronome 6:5",
      texte: "Tu aimeras l'Éternel, ton Dieu, de tout ton cœur, de toute ton âme et de toute ta force."
    },
    questionDefi: {
      question: "Sur quel mont Moïse est-il monté pour contempler le pays promis avant de s'endormir dans la paix de Dieu ?",
      options: ["Le mont Nébo", "Le mont Sinaï", "Le mont Carmel", "Le mont des Oliviers"],
      reponse: "Le mont Nébo",
      explication: "Deutéronome 34 relate la montée de Moïse sur le mont Nébo, sommet du Pisga."
    }
  },

  // LIVRES HISTORIQUES (12 LIVRES)
  {
    id: "jos",
    nom: "Josué",
    testament: "AT",
    section: "Histoire",
    chapitres: 24,
    auteur: "Josué",
    theme: "L'entrée en terre promise, la chute de Jéricho et l'héritage des tribus",
    versetOr: {
      ref: "Josué 1:9",
      texte: "Ne t'ai-je pas donné cet ordre : Fortifie-toi et prends courage ? Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras."
    },
    questionDefi: {
      question: "Quelle célèbre déclaration de fidélité Josué fait-il à la fin de son ministère ?",
      options: [
        "Moi et ma maison, nous servirons l'Éternel.",
        "L'Éternel est mon berger.",
        "Voici mon serviteur que je soutiendrai.",
        "Que ton règne vienne."
      ],
      reponse: "Moi et ma maison, nous servirons l'Éternel.",
      explication: "Josué 24:15 est l'un des engagements spirituels les plus cités par les familles chrétiennes."
    }
  },
  {
    id: "jug",
    nom: "Juges",
    testament: "AT",
    section: "Histoire",
    chapitres: 21,
    auteur: "Samuel (tradition)",
    theme: "Les cycles de rechute, de repentance et de délivrance par les juges",
    versetOr: {
      ref: "Juges 21:25",
      texte: "En ce temps-là, il n'y avait point de roi en Israël. Chacun faisait ce qui lui semblait bon."
    },
    questionDefi: {
      question: "Avec combien d'hommes armés de trompettes et de cruches Gédéon a-t-il vaincu les Madianites ?",
      options: ["300 hommes", "3 000 hommes", "10 000 hommes", "70 hommes"],
      reponse: "300 hommes",
      explication: "Juges 7 montre Dieu réduisant l'armée à 300 hommes pour que la gloire de la victoire revienne à Lui seul."
    }
  },
  {
    id: "rut",
    nom: "Ruth",
    testament: "AT",
    section: "Histoire",
    chapitres: 4,
    auteur: "Inconnu",
    theme: "La loyauté, la rédemption familiale et la lignée de David",
    versetOr: {
      ref: "Ruth 1:16",
      texte: "Où tu iras j'irai, où tu demeureras je demeurerai ; ton peuple sera mon peuple, et ton Dieu sera mon Dieu."
    },
    questionDefi: {
      question: "Quel homme de Bethléhem a exercé le droit de rachat envers Ruth la Moabite ?",
      options: ["Boaz", "Élimélec", "Kilion", "Isaï"],
      reponse: "Boaz",
      explication: "Boaz a racheté le patrimoine et épousé Ruth, devenant l'arrière-grand-père du roi David."
    }
  },
  {
    id: "1sa",
    nom: "1 Samuel",
    testament: "AT",
    section: "Histoire",
    chapitres: 31,
    auteur: "Samuel / Nathan / Gad",
    theme: "La transition vers la royauté, l'onction de Saül puis de David",
    versetOr: {
      ref: "1 Samuel 16:7",
      texte: "L'Éternel ne considère pas ce que l'homme considère ; l'homme regarde à ce qui frappe les yeux, mais l'Éternel regarde au cœur."
    },
    questionDefi: {
      question: "Avec quelle arme David a-t-il terrassé le géant Goliath de Gath ?",
      options: ["Une fronde et une pierre", "Une épée d'airain", "Un arc et des flèches", "Une lance de fer"],
      reponse: "Une fronde et une pierre",
      explication: "1 Samuel 17 : David marchait non avec une armure humaine, mais au nom de l'Éternel des armées."
    }
  },
  {
    id: "2sa",
    nom: "2 Samuel",
    testament: "AT",
    section: "Histoire",
    chapitres: 24,
    auteur: "Nathan / Gad",
    theme: "Le règne de David, l'alliance davidique et la grâce après la repentance",
    versetOr: {
      ref: "2 Samuel 22:2",
      texte: "L'Éternel est mon rocher, ma forteresse, mon libérateur."
    },
    questionDefi: {
      question: "Quelle ville David a-t-il conquise pour en faire la capitale d'Israël et la cité de Dieu ?",
      options: ["Jérusalem", "Hébron", "Sichem", "Jéricho"],
      reponse: "Jérusalem",
      explication: "2 Samuel 5 relate la prise de Sion qui devient la Cité de David."
    }
  },
  {
    id: "1ro",
    nom: "1 Rois",
    testament: "AT",
    section: "Histoire",
    chapitres: 22,
    auteur: "Jérémie (tradition)",
    theme: "La gloire de Salomon, le premier Temple, puis la division du royaume",
    versetOr: {
      ref: "1 Rois 3:9",
      texte: "Accorde donc à ton serviteur un cœur intelligent pour juger ton peuple, pour discerner le bien et le mal !"
    },
    questionDefi: {
      question: "Quel prophète a défié les 450 prophètes de Baal au mont Carmel par le feu du ciel ?",
      options: ["Élie", "Élisée", "Nathan", "Ésaïe"],
      reponse: "Élie",
      explication: "1 Rois 18 : le feu de l'Éternel tomba et consuma l'holocauste, amenant le peuple à s'écrier : « C'est l'Éternel qui est Dieu ! »"
    }
  },
  {
    id: "2ro",
    nom: "2 Rois",
    testament: "AT",
    section: "Histoire",
    chapitres: 25,
    auteur: "Jérémie (tradition)",
    theme: "Le ministère d'Élisée, le déclin des royaumes et la captivité",
    versetOr: {
      ref: "2 Rois 6:16",
      texte: "Ne crains point, car ceux qui sont avec nous sont en plus grand nombre que ceux qui sont avec eux."
    },
    questionDefi: {
      question: "Comment le prophète Élie a-t-il quitté cette terre devant son disciple Élisée ?",
      options: ["Enlevé au ciel dans un tourbillon de feu", "Mort paisiblement à Jérusalem", "Égaré dans le désert", "Noyé dans le Jourdain"],
      reponse: "Enlevé au ciel dans un tourbillon de feu",
      explication: "2 Rois 2 : un char de feu et des chevaux de feu les séparèrent, et Élie monta au ciel."
    }
  },
  {
    id: "1ch",
    nom: "1 Chroniques",
    testament: "AT",
    section: "Histoire",
    chapitres: 29,
    auteur: "Esdras",
    theme: "Généalogies saintes, l'arche d'alliance et les préparatifs du Temple par David",
    versetOr: {
      ref: "1 Chroniques 29:11",
      texte: "À toi, Éternel, la grandeur, la puissance et la magnificence, l'éternité et la gloire, car tout ce qui est au ciel et sur la terre t'appartient !"
    },
    questionDefi: {
      question: "Quelle célèbre prière de protection et d'élargissement des limites trouve-t-on en 1 Chroniques 4 ?",
      options: ["La prière de Jaebets", "La prière de Salomon", "La prière de Moïse", "La prière d'Anne"],
      reponse: "La prière de Jaebets",
      explication: "1 Chroniques 4:10 : Dieu accorda à Jaebets ce qu'il avait demandé avec foi."
    }
  },
  {
    id: "2ch",
    nom: "2 Chroniques",
    testament: "AT",
    section: "Histoire",
    chapitres: 36,
    auteur: "Esdras",
    theme: "La dédicace du Temple, les réveils sous Ézéchias et Josias",
    versetOr: {
      ref: "2 Chroniques 7:14",
      texte: "Si mon peuple sur qui est invoqué mon nom s'humilie, prie, et cherche ma face, et s'il se détourne de ses mauvaises voies, — je l'exaucerai des cieux, je lui pardonnerai son péché, et je guérirai son pays."
    },
    questionDefi: {
      question: "Quelle promesse célèbre Dieu fait-il à Salomon pour le pardon et la guérison d'un pays lors de la dédicace ?",
      options: ["2 Chroniques 7:14", "2 Chroniques 1:1", "2 Chroniques 20:15", "2 Chroniques 36:23"],
      reponse: "2 Chroniques 7:14",
      explication: "2 Chroniques 7:14 est le verset phare de repentance et d'intercession pour les nations."
    }
  },
  {
    id: "esd",
    nom: "Esdras",
    testament: "AT",
    section: "Histoire",
    chapitres: 10,
    auteur: "Esdras",
    theme: "Le retour d'exil de Babylone, la reconstruction de l'autel et du second Temple",
    versetOr: {
      ref: "Esdras 7:10",
      texte: "Car Esdras avait appliqué son cœur à étudier et à mettre en pratique la loi de l'Éternel, et à enseigner au milieu d'Israël les lois et les ordonnances."
    },
    questionDefi: {
      question: "Quel roi de Perse a promulgué le décret autorisant les Juifs à retourner rebâtir le Temple à Jérusalem ?",
      options: ["Cyrus", "Darius", "Artaxerxès", "Nabuchodonosor"],
      reponse: "Cyrus",
      explication: "Esdras 1:1-3 : Cyrus, roi de Perse, reconnaît l'ordre reçu du Dieu des cieux."
    }
  },
  {
    id: "neh",
    nom: "Néhémie",
    testament: "AT",
    section: "Histoire",
    chapitres: 13,
    auteur: "Néhémie",
    theme: "La reconstruction des murailles de Jérusalem et la réforme spirituelle",
    versetOr: {
      ref: "Néhémie 8:10",
      texte: "Ne vous affligez pas, car la joie de l'Éternel sera votre force."
    },
    questionDefi: {
      question: "En combien de jours Néhémie et son peuple ont-ils achevé la reconstruction de la muraille malgré l'opposition ?",
      options: ["52 jours", "40 jours", "70 jours", "120 jours"],
      reponse: "52 jours",
      explication: "Néhémie 6:15 : La muraille fut achevée en 52 jours, preuve éclatante que Dieu combattait avec eux."
    }
  },
  {
    id: "est",
    nom: "Esther",
    testament: "AT",
    section: "Histoire",
    chapitres: 10,
    auteur: "Mardochée (tradition)",
    theme: "La providence divine cachée, le salut du peuple juif et la fête de Pourim",
    versetOr: {
      ref: "Esther 4:14",
      texte: "Qui sait si ce n'est pas pour un temps comme celui-ci que tu es parvenue à la royauté ?"
    },
    questionDefi: {
      question: "Quel proche parent a élevé la reine Esther et l'a exhortée à intercéder devant le roi ?",
      options: ["Mardochée", "Aman", "Hégai", "Assuérus"],
      reponse: "Mardochée",
      explication: "Mardochée est le cousin fidèle d'Esther qui a découvert le complot d'Aman."
    }
  },

  // LIVRES POÉTIQUES & SAGESSE (5 LIVRES)
  {
    id: "job",
    nom: "Job",
    testament: "AT",
    section: "Poésie & Sagesse",
    chapitres: 42,
    auteur: "Inconnu",
    theme: "La souveraineté de Dieu face à la souffrance de l'innocent et la foi éprouvée",
    versetOr: {
      ref: "Job 19:25",
      texte: "Mais je sais que mon rédempteur est vivant, et qu'il se lèvera le dernier sur la terre."
    },
    questionDefi: {
      question: "Quelle confession Job fait-il à Dieu après avoir entendu Sa voix dans le tourbillon ?",
      options: [
        "Mon oreille avait entendu parler de toi ; mais maintenant mon œil t'a vu.",
        "L'Éternel est mon berger.",
        "Tout est vanité.",
        "Seigneur, augmente-nous la foi."
      ],
      reponse: "Mon oreille avait entendu parler de toi ; mais maintenant mon œil t'a vu.",
      explication: "Job 42:5 marque le passage d'une foi transmise à une révélation intime et vivante de Dieu."
    }
  },
  {
    id: "psa",
    nom: "Psaumes",
    testament: "AT",
    section: "Poésie & Sagesse",
    chapitres: 150,
    auteur: "David, Asaph, fils de Koré, Moïse...",
    theme: "Le livre de prière, de louange, de lamentation et de confiance absolue en Dieu",
    versetOr: {
      ref: "Psaume 119:105",
      texte: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier."
    },
    questionDefi: {
      question: "Quel psaume s'ouvre par la déclaration célèbre : « L'Éternel est mon berger : je ne manquerai de rien » ?",
      options: ["Psaume 23", "Psaume 91", "Psaume 1", "Psaume 121"],
      reponse: "Psaume 23",
      explication: "Le Psaume 23 de David est le cantique universel de la paix sous la garde du Bon Berger."
    }
  },
  {
    id: "pro",
    nom: "Proverbes",
    testament: "AT",
    section: "Poésie & Sagesse",
    chapitres: 31,
    auteur: "Salomon, Agur, Lemuel",
    theme: "La sagesse pratique pour la vie quotidienne fondée sur la crainte de l'Éternel",
    versetOr: {
      ref: "Proverbes 3:5-6",
      texte: "Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse ; Reconnais-le dans toutes tes voies, et il aplanira tes sentiers."
    },
    questionDefi: {
      question: "Selon Proverbes 1:7 et 9:10, quel est le commencement de la vraie sagesse ?",
      options: ["La crainte de l'Éternel", "Les richesses de la terre", "La puissance des armées", "Les diplômes des hommes"],
      reponse: "La crainte de l'Éternel",
      explication: "Le respect révérencieux envers Dieu est le fondement de toute intelligence saine."
    }
  },
  {
    id: "ecc",
    nom: "Ecclésiaste",
    testament: "AT",
    section: "Poésie & Sagesse",
    chapitres: 12,
    auteur: "Salomon (le Prédicateur)",
    theme: "La vanité des choses sous le soleil sans Dieu, et la valeur d'une vie consacrée au Créateur",
    versetOr: {
      ref: "Ecclésiaste 12:13",
      texte: "Écoutons la fin du discours : Crains Dieu et observe ses commandements. C'est là ce que doit faire tout homme."
    },
    questionDefi: {
      question: "Quel célèbre passage d'Ecclésiaste 3 proclame qu'il y a un moment pour tout sous les cieux ?",
      options: ["Il y a un temps pour tout", "L'amour ne périt jamais", "Heureux les pauvres en esprit", "La foi est une ferme assurance"],
      reponse: "Il y a un temps pour tout",
      explication: "Ecclésiaste 3 rappelle que Dieu fait toute chose belle en son temps."
    }
  },
  {
    id: "can",
    nom: "Cantique des Cantiques",
    testament: "AT",
    section: "Poésie & Sagesse",
    chapitres: 8,
    auteur: "Salomon",
    theme: "La beauté de l'amour pur et l'allégorie de l'amour du Seigneur pour Son peuple",
    versetOr: {
      ref: "Cantique 8:7",
      texte: "Les grandes eaux ne peuvent éteindre l'amour, et les fleuves ne le submergeraient pas."
    },
    questionDefi: {
      question: "Quelle métaphore illustre la force invincible de l'amour véritable en Cantique 8:6 ?",
      options: ["L'amour est fort comme la mort", "L'amour est rapide comme le vent", "L'amour est riche comme l'or", "L'amour est brillant comme l'argent"],
      reponse: "L'amour est fort comme la mort",
      explication: "Cantique 8:6 exalte la flamme sacrée de l'amour que rien ne saurait étouffer."
    }
  },

  // GRANDS PROPHÈTES (5 LIVRES)
  {
    id: "esa",
    nom: "Ésaïe",
    testament: "AT",
    section: "Prophètes",
    chapitres: 66,
    auteur: "Ésaïe",
    theme: "Le prophète évangélique : la sainteté divine, la venue du Messie et la paix universelle",
    versetOr: {
      ref: "Ésaïe 53:5",
      texte: "Mais il était blessé pour nos péchés, brisé pour nos iniquités ; le châtiment qui nous donne la paix est tombé sur lui, et c'est par ses meurtrissures que nous sommes guéris."
    },
    questionDefi: {
      question: "Quel nom prophétique annonçant la naissance miraculeuse du Messie Ésaïe donne-t-il en Ésaïe 7:14 ?",
      options: ["Emmanuel (Dieu avec nous)", "Melchisédek", "Cyrus", "Élie"],
      reponse: "Emmanuel (Dieu avec nous)",
      explication: "Ésaïe 7:14 annonce que la vierge deviendra enceinte et enfantera un fils appelé Emmanuel."
    }
  },
  {
    id: "jer",
    nom: "Jérémie",
    testament: "AT",
    section: "Prophètes",
    chapitres: 52,
    auteur: "Jérémie",
    theme: "L'appel à la repentance, l'annonce de la Nouvelle Alliance et l'espérance au milieu des larmes",
    versetOr: {
      ref: "Jérémie 29:11",
      texte: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance."
    },
    questionDefi: {
      question: "Quelle alliance nouvelle, gravée non sur la pierre mais dans les cœurs, Jérémie annonce-t-il en Jérémie 31 ?",
      options: ["La Nouvelle Alliance", "L'alliance de Noé", "L'alliance de Circoncision", "L'alliance du Sabbat"],
      reponse: "La Nouvelle Alliance",
      explication: "Jérémie 31:33 préfigure l'œuvre du Saint-Esprit accomplie par Jésus-Christ."
    }
  },
  {
    id: "lam",
    nom: "Lamentations",
    testament: "AT",
    section: "Prophètes",
    chapitres: 5,
    auteur: "Jérémie",
    theme: "La douleur sur Jérusalem détruite et la certitude des compassions renouvelées de Dieu",
    versetOr: {
      ref: "Lamentations 3:22-23",
      texte: "Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme ; elles se renouvellent chaque matin. Oh ! que ta fidélité est grande !"
    },
    questionDefi: {
      question: "Selon Lamentations 3:23, à quelle fréquence les compassions et les bontés de Dieu se renouvellent-elles ?",
      options: ["Chaque matin", "Une fois par an", "Chaque dimanche", "À la fin des temps"],
      reponse: "Chaque matin",
      explication: "Ce passage rayonne comme une lumière dans l'obscurité des épreuves : la fidélité de Dieu est infinie."
    }
  },
  {
    id: "eze",
    nom: "Ézéchiel",
    testament: "AT",
    section: "Prophètes",
    chapitres: 48,
    auteur: "Ézéchiel",
    theme: "La gloire de l'Éternel, le cœur nouveau d'esprit et la vision des ossements desséchés",
    versetOr: {
      ref: "Ézéchiel 36:26",
      texte: "Je vous donnerai un cœur nouveau, et je mettrai en vous un esprit nouveau ; j'ôterai de votre corps le cœur de pierre, et je vous donnerai un cœur de chair."
    },
    questionDefi: {
      question: "Quelle vision célèbre montre le souffle de Dieu ranimant un peuple entier dans Ézéchiel 37 ?",
      options: ["La vallée des ossements desséchés", "L'échelle qui touchait le ciel", "Le buisson ardent", "La statue d'or"],
      reponse: "La vallée des ossements desséchés",
      explication: "Le souffle de l'Esprit entre dans les ossements et forme une armée immense, symbole de la résurrection d'Israël."
    }
  },
  {
    id: "dan",
    nom: "Daniel",
    testament: "AT",
    section: "Prophètes",
    chapitres: 12,
    auteur: "Daniel",
    theme: "La souveraineté de Dieu sur les empires humains, la fidélité dans l'épreuve et les visions prophétiques",
    versetOr: {
      ref: "Daniel 12:3",
      texte: "Ceux qui auront été intelligents brilleront comme la splendeur du ciel, et ceux qui auront enseigné la justice à la multitude brilleront comme les étoiles, à toujours et à perpétuité."
    },
    questionDefi: {
      question: "De quel péril mortel Dieu a-t-il délivré Daniel parce qu'il continuait à prier fidèlement trois fois par jour ?",
      options: ["La fosse aux lions", "La fournaise ardente", "Le naufrage en mer", "La potence d'Aman"],
      reponse: "La fosse aux lions",
      explication: "Daniel 6 : Dieu a envoyé son ange et fermé la gueule des lions."
    }
  },

  // LES 12 PETITS PROPHÈTES
  {
    id: "ose",
    nom: "Osée",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 14,
    auteur: "Osée",
    theme: "L'amour inconditionnel et fidèle de Dieu malgré les infidélités de Son peuple",
    versetOr: {
      ref: "Osée 6:6",
      texte: "Car j'aime la piété et non les sacrifices, et la connaissance de Dieu plus que les holocaustes."
    },
    questionDefi: {
      question: "Que désire Dieu avant les sacrifices religieux selon Osée 6:6 ?",
      options: ["L'amour et la connaissance de Dieu", "Des offrandes d'or", "De grands édifices", "Des jeûnes visibles"],
      reponse: "L'amour et la connaissance de Dieu",
      explication: "Jésus a cité ce verset à deux reprises pour rappeler le cœur de la Loi divine."
    }
  },
  {
    id: "joe",
    nom: "Joël",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 3,
    auteur: "Joël",
    theme: "Le jour de l'Éternel, l'appel au jeûne et l'effusion du Saint-Esprit sur toute chair",
    versetOr: {
      ref: "Joël 2:28",
      texte: "Après cela, je répandrai mon esprit sur toute chair ; vos fils et vos filles prophétiseront, vos vieillards auront des songes, et vos jeunes gens des visions."
    },
    questionDefi: {
      question: "Quel apôtre a cité la prophétie de Joël le jour de la Pentecôte dans Actes 2 ?",
      options: ["Pierre", "Paul", "Jean", "Jacques"],
      reponse: "Pierre",
      explication: "Pierre déclare au peuple réuni : « C'est ici ce qui a été dit par le prophète Joël. »"
    }
  },
  {
    id: "amo",
    nom: "Amos",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 9,
    auteur: "Amos",
    theme: "La justice sociale, la droiture et le rejet de l'hypocrisie religieuse",
    versetOr: {
      ref: "Amos 5:24",
      texte: "Mais que la droiture soit comme un courant d'eau, et la justice comme un torrent qui jamais ne tarit."
    },
    questionDefi: {
      question: "Quel métier Amos exerçait-il avant que l'Éternel ne l'appelle à prophétiser ?",
      options: ["Berger et cultivateur de sycomores", "Prêtre au temple", "Scribe royal", "Pêcheur de poissons"],
      reponse: "Berger et cultivateur de sycomores",
      explication: "Amos 7:14 : « Je n'étais ni prophète, ni fils de prophète ; mais j'étais berger. »"
    }
  },
  {
    id: "abd",
    nom: "Abdias",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 1,
    auteur: "Abdias",
    theme: "Le jugement de l'orgueil d'Édom et la délivrance sur la montagne de Sion",
    versetOr: {
      ref: "Abdias 1:21",
      texte: "Des libérateurs monteront sur la montagne de Sion, pour juger la montagne d'Ésaü ; et à l'Éternel appartiendra le règne."
    },
    questionDefi: {
      question: "Contre quel peuple fier habitant dans le creux des rochers la prophétie d'Abdias est-elle prononcée ?",
      options: ["Édom", "Babylone", "L'Égypte", "La Syrie"],
      reponse: "Édom",
      explication: "Édom, descendant d'Ésaü, s'enorgueillissait de ses forteresses rocheuses imprenables."
    }
  },
  {
    id: "jon",
    nom: "Jonas",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 4,
    auteur: "Jonas",
    theme: "La miséricorde universelle de Dieu pour Ninive et la leçon de grâce envers le prophète réticent",
    versetOr: {
      ref: "Jonas 2:9",
      texte: "Le salut vient de l'Éternel."
    },
    questionDefi: {
      question: "Combien de jours et de nuits Jonas a-t-il passé dans les entrailles du grand poisson ?",
      options: ["Trois jours et trois nuits", "Sept jours et sept nuits", "Quarante jours", "Un jour et une nuit"],
      reponse: "Trois jours et trois nuits",
      explication: "Jésus a fait de ce signe l'annonce de sa propre résurrection le troisième jour."
    }
  },
  {
    id: "mic",
    nom: "Michée",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 7,
    auteur: "Michée",
    theme: "L'annonce de la naissance du Messie à Bethléhem et les exigences divines de justice et d'humilité",
    versetOr: {
      ref: "Michée 6:8",
      texte: "On t'a fait connaître, ô homme, ce qui est bien ; et ce que l'Éternel demande de toi, c'est que tu pratiques la justice, que tu aimes la miséricorde, et que tu marches humblement avec ton Dieu."
    },
    questionDefi: {
      question: "Quelle petite bourgade de Juda Michée désigne-t-il comme lieu de naissance du Dominateur éternel ?",
      options: ["Bethléhem Éphrata", "Nazareth", "Jérusalem", "Hébron"],
      reponse: "Bethléhem Éphrata",
      explication: "Michée 5:2 a guidé les mages vers Bethléhem lors de la venue de Jésus au monde."
    }
  },
  {
    id: "nah",
    nom: "Nahum",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 3,
    auteur: "Nahum",
    theme: "Le jugement de la cruelle Ninive et la protection de Dieu pour ceux qui se confient en Lui",
    versetOr: {
      ref: "Nahum 1:7",
      texte: "L'Éternel est bon, il est un refuge au jour de la détresse ; il connaît ceux qui se confient en lui."
    },
    questionDefi: {
      question: "Quelle cité sanguinaire et orgueilleuse fait l'objet du jugement annoncé par Nahum ?",
      options: ["Ninive", "Tyr", "Sodome", "Babylone"],
      reponse: "Ninive",
      explication: "Cent ans après le repentir du temps de Jonas, Ninive était retournée à la violence extrême."
    }
  },
  {
    id: "hab",
    nom: "Habacuc",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 3,
    auteur: "Habacuc",
    theme: "Le dialogue franc avec Dieu, la foi au milieu de l'incompréhension et la joie en l'Éternel",
    versetOr: {
      ref: "Habacuc 2:4",
      texte: "Mais le juste vivra par sa foi."
    },
    questionDefi: {
      question: "Quelle célèbre affirmation théologique d'Habacuc 2:4 est reprise comme pilier de l'Évangile par Paul ?",
      options: ["Le juste vivra par sa foi", "Dieu est amour", "Que la lumière soit", "L'Éternel est un roc"],
      reponse: "Le juste vivra par sa foi",
      explication: "Ce verset a été le déclencheur de la Réforme et se retrouve dans Romains, Galates et Hébreux."
    }
  },
  {
    id: "sop",
    nom: "Sophonie",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 3,
    auteur: "Sophonie",
    theme: "La purification par le jugement et les chants d'allégresse de Dieu sur Son peuple racheté",
    versetOr: {
      ref: "Sophonie 3:17",
      texte: "L'Éternel, ton Dieu, est au milieu de toi, comme un héros qui sauve ; il fera de toi sa plus grande joie ; il gardera le silence dans son amour ; il aura pour toi des transports d'allégresse."
    },
    questionDefi: {
      question: "Quelle émouvante attitude Dieu adopte-t-Il envers les siens selon Sophonie 3:17 ?",
      options: ["Il a pour eux des transports d'allégresse et se réjouit avec des chants", "Il les condamne sans merci", "Il les oublie au désert", "Il exige de l'or"],
      reponse: "Il a pour eux des transports d'allégresse et se réjouit avec des chants",
      explication: "Sophonie 3:17 dépeint un Père chantant de joie sur Ses enfants délivrés."
    }
  },
  {
    id: "agg",
    nom: "Aggée",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 2,
    auteur: "Aggée",
    theme: "La priorité de la Maison de Dieu et la promesse que la gloire du second Temple surpassera la première",
    versetOr: {
      ref: "Aggée 2:9",
      texte: "La gloire de cette dernière maison sera plus grande que celle de la première, dit l'Éternel des armées."
    },
    questionDefi: {
      question: "Quel reproche Aggée adresse-t-il au peuple revenu d'exil en Aggée 1 ?",
      options: ["Habiter des maisons lambrissées pendant que la maison de Dieu est détruite", "Avoir trop prié", "N'avoir pas bâti de navires", "Avoir refusé de chanter"],
      reponse: "Habiter des maisons lambrissées pendant que la maison de Dieu est détruite",
      explication: "Aggée exhorte le peuple à remettre Dieu au centre de toutes leurs priorités."
    }
  },
  {
    id: "zac",
    nom: "Zacharie",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 14,
    auteur: "Zacharie",
    theme: "Visions apocalyptiques, le Roi humble monté sur un ânon et la source ouverte pour le péché",
    versetOr: {
      ref: "Zacharie 4:6",
      texte: "Ce n'est ni par la puissance ni par la force, mais c'est par mon esprit, dit l'Éternel des armées."
    },
    questionDefi: {
      question: "Comment le Roi messianique entre-t-il à Jérusalem selon la prophétie de Zacharie 9:9 ?",
      options: ["Humble et monté sur un âne, sur un ânon, le petit d'une ânesse", "Sur un char de guerre doré", "Porté par des soldats romains", "Dans une nuée d'éclairs"],
      reponse: "Humble et monté sur un âne, sur un ânon, le petit d'une ânesse",
      explication: "Jésus a accompli cette prophétie à la lettre lors de son entrée triomphale le dimanche des Rameaux."
    }
  },
  {
    id: "mal",
    nom: "Malachie",
    testament: "AT",
    section: "Petits Prophètes",
    chapitres: 4,
    auteur: "Malachie",
    theme: "L'amour inaltérable de Dieu, la fidélité dans les dîmes et l'annonce du Soleil de justice",
    versetOr: {
      ref: "Malachie 4:2",
      texte: "Mais pour vous qui craignez mon nom, se lèvera le soleil de justice, et la guérison sera sous ses ailes."
    },
    questionDefi: {
      question: "Quel prophète Malachie annonce-t-il avant le grand et redoutable jour de l'Éternel pour ramener le cœur des pères à leurs enfants ?",
      options: ["Élie le prophète", "Moïse", "David", "Samuel"],
      reponse: "Élie le prophète",
      explication: "Malachie 4:5 annonce Jean-Baptiste venu avec l'esprit et la puissance d'Élie."
    }
  },

  // ==========================================
  // NOUVEAU TESTAMENT (27 LIVRES)
  // ==========================================
  // LES 4 ÉVANGILES & LES ACTES
  {
    id: "mat",
    nom: "Matthieu",
    testament: "NT",
    section: "Évangiles",
    chapitres: 28,
    auteur: "Matthieu (Lévi)",
    theme: "Jésus le Messie et Roi d'Israël, accomplissement des Écritures de l'Ancien Testament",
    versetOr: {
      ref: "Matthieu 28:19-20",
      texte: "Allez, faites de toutes les nations des disciples, les baptisant au nom du Père, du Fils et du Saint-Esprit, et enseignez-leur à observer tout ce que je vous ai prescrit. Et voici, je suis avec vous tous les jours, jusqu'à la fin du monde."
    },
    questionDefi: {
      question: "Sur quelle montagne Jésus prononce-t-il les Béatitudes dans Matthieu 5 à 7 ?",
      options: ["Le sermon sur la montagne", "Le mont Sinaï", "Le mont Carmel", "Le mont Thabor"],
      reponse: "Le sermon sur la montagne",
      explication: "Le Sermon sur la montagne est la charte du Royaume des cieux selon Jésus."
    }
  },
  {
    id: "mar",
    nom: "Marc",
    testament: "NT",
    section: "Évangiles",
    chapitres: 16,
    auteur: "Jean-Marc",
    theme: "Jésus le Serviteur divin en action, agissant avec puissance et autorité",
    versetOr: {
      ref: "Marc 10:45",
      texte: "Car le Fils de l'homme est venu, non pour être servi, mais pour servir et donner sa vie comme la rançon de plusieurs."
    },
    questionDefi: {
      question: "Quel mot dynamique revient constamment dans Marc pour souligner l'urgence et la vivacité du ministère de Jésus ?",
      options: ["Aussitôt", "Lentement", "Demain", "Peut-être"],
      reponse: "Aussitôt",
      explication: "Le terme grec 'euthus' (aussitôt) caractérise le rythme rapide de l'Évangile de Marc."
    }
  },
  {
    id: "luc",
    nom: "Luc",
    testament: "NT",
    section: "Évangiles",
    chapitres: 24,
    auteur: "Luc (le médecin bien-aimé)",
    theme: "Jésus le Sauveur universel, ami des pécheurs, des pauvres et des cœurs brisés",
    versetOr: {
      ref: "Luc 19:10",
      texte: "Car le Fils de l'homme est venu chercher et sauver ce qui était perdu."
    },
    questionDefi: {
      question: "Quelle célèbre parabole sur l'amour inconditionnel du Père pour le fils égaré se trouve uniquement dans Luc 15 ?",
      options: ["Le fils prodigue", "Le bon samaritain", "Le semeur", "Le grain de sénevé"],
      reponse: "Le fils prodigue",
      explication: "Luc 15 est le cœur battant de la grâce : Dieu court à la rencontre de celui qui revient."
    }
  },
  {
    id: "jea",
    nom: "Jean",
    testament: "NT",
    section: "Évangiles",
    chapitres: 21,
    auteur: "Jean (l'apôtre bien-aimé)",
    theme: "Jésus la Parole éternelle, le Fils de Dieu venu afin que quiconque croit ait la vie éternelle",
    versetOr: {
      ref: "Jean 3:16",
      texte: "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."
    },
    questionDefi: {
      question: "Comment Jean désigne-t-il Jésus dès le tout premier verset de son Évangile ?",
      options: ["La Parole (le Verbe)", "Un ange puissant", "Un simple prophète", "Le roi des Juifs"],
      reponse: "La Parole (le Verbe)",
      explication: "Jean 1:1 : « Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu. »"
    }
  },
  {
    id: "act",
    nom: "Actes des Apôtres",
    testament: "NT",
    section: "Histoire",
    chapitres: 28,
    auteur: "Luc",
    theme: "L'effusion du Saint-Esprit, l'essor de l'Église primitive de Jérusalem jusqu'aux extrémités de la terre",
    versetOr: {
      ref: "Actes 1:8",
      texte: "Mais vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins à Jérusalem, dans toute la Judée, dans la Samarie, et jusqu'aux extrémités de la terre."
    },
    questionDefi: {
      question: "Quel événement surnaturel marque la naissance publique de l'Église au chapitre 2 des Actes ?",
      options: ["La Pentecôte", "La Pâque", "La fête des Tabernacles", "La transfiguration"],
      reponse: "La Pentecôte",
      explication: "Actes 2 : Le Saint-Esprit descend comme un vent impétueux et des langues de feu."
    }
  },

  // LES ÉPÎTRES PAULINIENNES (14 LIVRES AVEC HÉBREUX)
  {
    id: "rom",
    nom: "Romains",
    testament: "NT",
    section: "Épîtres",
    chapitres: 16,
    auteur: "Paul",
    theme: "L'Évangile de la grâce : la justification par la foi seule et la vie selon l'Esprit",
    versetOr: {
      ref: "Romains 8:1",
      texte: "Il n'y a donc maintenant aucune condamnation pour ceux qui sont en Jésus-Christ."
    },
    questionDefi: {
      question: "Selon Romains 3:23-24, comment tous les hommes pécheurs sont-ils déclarés justes devant Dieu ?",
      options: ["Gratuitement par sa grâce, par le moyen de la rédemption qui est en Jésus-Christ", "Par leurs bonnes œuvres", "Par les sacrifices d'animaux", "Par la richesse matérielle"],
      reponse: "Gratuitement par sa grâce, par le moyen de la rédemption qui est en Jésus-Christ",
      explication: "Romains établit le socle immuable du salut par pure grâce reçue par la foi."
    }
  },
  {
    id: "1co",
    nom: "1 Corinthiens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 16,
    auteur: "Paul",
    theme: "L'unité du corps de Christ, les dons spirituels, l'hymne à l'amour et la victoire de la résurrection",
    versetOr: {
      ref: "1 Corinthiens 13:13",
      texte: "Maintenant donc ces trois choses demeurent : la foi, l'espérance, la charité ; mais la plus grande de ces choses, c'est la charité."
    },
    questionDefi: {
      question: "Quel chapitre de 1 Corinthiens est mondialement reconnu comme l'hymne sacré de l'amour divin (agapé) ?",
      options: ["Chapitre 13", "Chapitre 1", "Chapitre 15", "Chapitre 7"],
      reponse: "Chapitre 13",
      explication: "1 Corinthiens 13 : « Quand je parlerais les langues des hommes et des anges, si je n'ai pas la charité, je ne suis rien. »"
    }
  },
  {
    id: "2co",
    nom: "2 Corinthiens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 13,
    auteur: "Paul",
    theme: "Le réconfort dans les afflictions, le ministère de la réconciliation et la puissance dans la faiblesse",
    versetOr: {
      ref: "2 Corinthiens 12:9",
      texte: "Ma grâce te suffit, car ma puissance s'accomplit dans la faiblesse."
    },
    questionDefi: {
      question: "Quelle parole célèbre le Seigneur a-t-il donnée à Paul pour consoler son écharde dans la chair ?",
      options: ["Ma grâce te suffit", "Rentre chez toi", "Tu seras riche", "Ne parle plus"],
      reponse: "Ma grâce te suffit",
      explication: "2 Corinthiens 12:9 : Paul se glorifie de ses faiblesses afin que la puissance de Christ repose sur lui."
    }
  },
  {
    id: "gal",
    nom: "Galates",
    testament: "NT",
    section: "Épîtres",
    chapitres: 6,
    auteur: "Paul",
    theme: "La liberté chrétienne, le rejet du légalisme et le fruit de l'Esprit",
    versetOr: {
      ref: "Galates 5:22-23",
      texte: "Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance."
    },
    questionDefi: {
      question: "Combien d'aspects composent l'unique fruit de l'Esprit énuméré en Galates 5:22 ?",
      options: ["9 aspects", "7 aspects", "12 aspects", "3 aspects"],
      reponse: "9 aspects",
      explication: "L'amour, la joie, la paix, la patience, la bonté, la bienveillance, la fidélité, la douceur et la maîtrise de soi."
    }
  },
  {
    id: "eph",
    nom: "Éphésiens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 6,
    auteur: "Paul",
    theme: "Les bénédictions spirituelles dans les lieux célestes, l'unité de l'Église et l'armure de Dieu",
    versetOr: {
      ref: "Éphésiens 2:8-9",
      texte: "Car c'est par la grâce que vous êtes sauvés, par le moyen de la foi. Et cela ne vient pas de vous, c'est le don de Dieu. Ce n'est point par les œuvres, afin que personne ne se glorifie."
    },
    questionDefi: {
      question: "Quelle panoplie spirituelle Paul invite-t-il les croyants à revêtir dans Éphésiens 6 ?",
      options: ["Toutes les armes de Dieu", "L'armure de Saül", "Une toge romaine", "Une couronne d'or"],
      reponse: "Toutes les armes de Dieu",
      explication: "Éphésiens 6 détaille la ceinture de vérité, la cuirasse de justice, le bouclier de la foi et l'épée de l'Esprit."
    }
  },
  {
    id: "phi",
    nom: "Philippiens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 4,
    auteur: "Paul",
    theme: "L'épître de la joie constante, l'humilité du Christ et la paix qui surpasse toute intelligence",
    versetOr: {
      ref: "Philippiens 4:13",
      texte: "Je puis tout par celui qui me fortifie."
    },
    questionDefi: {
      question: "D'où l'apôtre Paul a-t-il écrit cette magnifique épître débordante de joie ?",
      options: ["D'une prison à Rome", "D'un palais royal", "D'un bateau en croisière", "De la plage de Corinthe"],
      reponse: "D'une prison à Rome",
      explication: "Même enchaîné, Paul proclame : « Réjouissez-vous toujours dans le Seigneur ; je le répète, réjouissez-vous ! »"
    }
  },
  {
    id: "col",
    nom: "Colossiens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 4,
    auteur: "Paul",
    theme: "La prééminence suprême et la suffisance absolue de Jésus-Christ sur toute la création",
    versetOr: {
      ref: "Colossiens 1:18",
      texte: "Il est la tête du corps de l'Église ; il est le commencement, le premier-né d'entre les morts, afin d'être en tout le premier."
    },
    questionDefi: {
      question: "Selon Colossiens 2:9, qu'est-ce qui habite corporellement en Jésus-Christ ?",
      options: ["Toute la plénitude de la divinité", "Une partie de la sagesse", "L'esprit des prophètes", "La force des anges"],
      reponse: "Toute la plénitude de la divinité",
      explication: "Colossiens affirme avec force la pleine divinité de notre Seigneur Jésus-Christ."
    }
  },
  {
    id: "1th",
    nom: "1 Thessaloniciens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 5,
    auteur: "Paul",
    theme: "La sanctification, l'espérance vivante et l'avènement glorieux du Seigneur",
    versetOr: {
      ref: "1 Thessaloniciens 5:16-18",
      texte: "Soyez toujours joyeux. Priez sans cesse. Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu en Jésus-Christ."
    },
    questionDefi: {
      question: "Quelle attitude de communion constante Paul prescrit-il en 1 Thessaloniciens 5:17 ?",
      options: ["Priez sans cesse", "Jeûnez tous les jours", "Fuyez le monde", "Parlez sans arrêt"],
      reponse: "Priez sans cesse",
      explication: "La prière continuelle est une communion ininterrompue de cœur avec le Père céleste."
    }
  },
  {
    id: "2th",
    nom: "2 Thessaloniciens",
    testament: "NT",
    section: "Épîtres",
    chapitres: 3,
    auteur: "Paul",
    theme: "La persévérance dans l'attente du retour du Christ, la mise en garde contre la paresse et les séductions",
    versetOr: {
      ref: "2 Thessaloniciens 3:3",
      texte: "Le Seigneur est fidèle, il vous affermira et vous préservera du malin."
    },
    questionDefi: {
      question: "Quel principe d'éthique et de travail Paul rappelle-t-il en 2 Thessaloniciens 3:10 ?",
      options: ["Si quelqu'un ne veut pas travailler, qu'il ne mange pas non plus", "Ne travaillez plus", "Attendez sans rien faire", "Vendez tout immédiatement"],
      reponse: "Si quelqu'un ne veut pas travailler, qu'il ne mange pas non plus",
      explication: "Paul encourage une vie active et digne dans l'attente du retour du Seigneur."
    }
  },
  {
    id: "1ti",
    nom: "1 Timothée",
    testament: "NT",
    section: "Épîtres",
    chapitres: 6,
    auteur: "Paul",
    theme: "La saine doctrine, la conduite dans la maison de Dieu et le combat de la foi",
    versetOr: {
      ref: "1 Timothée 2:5",
      texte: "Car il y a un seul Dieu, et aussi un seul médiateur entre Dieu et les hommes, Jésus-Christ homme."
    },
    questionDefi: {
      question: "Combien y a-t-il de médiateurs entre Dieu et les hommes selon 1 Timothée 2:5 ?",
      options: ["Un seul médiateur : Jésus-Christ homme", "Plusieurs saints", "Les anges gardiens", "Les prophètes anciens"],
      reponse: "Un seul médiateur : Jésus-Christ homme",
      explication: "Jésus est l'unique pont par lequel l'homme réconcilié s'approche du Père."
    }
  },
  {
    id: "2ti",
    nom: "2 Timothée",
    testament: "NT",
    section: "Épîtres",
    chapitres: 4,
    auteur: "Paul",
    theme: "Le testament spirituel de Paul, l'inspiration des Écritures et la fidélité jusqu'au bout",
    versetOr: {
      ref: "2 Timothée 3:16-17",
      texte: "Toute Écriture est inspirée de Dieu, et utile pour enseigner, pour convaincre, pour corriger, pour instruire dans la justice, afin que l'homme de Dieu soit accompli et propre à toute bonne œuvre."
    },
    questionDefi: {
      question: "Quelle déclaration victorieuse Paul prononce-t-il au crépuscule de sa vie terrestre dans 2 Timothée 4:7 ?",
      options: [
        "J'ai combattu le bon combat, j'ai achevé la course, j'ai gardé la foi.",
        "Je me suis retiré du monde.",
        "J'ai amassé beaucoup d'or.",
        "Je n'ai plus d'espoir."
      ],
      reponse: "J'ai combattu le bon combat, j'ai achevé la course, j'ai gardé la foi.",
      explication: "Une vie entièrement consacrée qui contemple avec assurance la couronne de justice promise."
    }
  },
  {
    id: "tit",
    nom: "Tite",
    testament: "NT",
    section: "Épîtres",
    chapitres: 3,
    auteur: "Paul",
    theme: "L'ordre dans l'Église en Crète, les bonnes œuvres et la grâce qui enseigne la piété",
    versetOr: {
      ref: "Tite 2:11",
      texte: "Car la grâce de Dieu, source de salut pour tous les hommes, a été manifestée."
    },
    questionDefi: {
      question: "Sur quelle île méditerranéenne Paul a-t-il laissé Tite pour établir des anciens dans chaque ville ?",
      options: ["En Crète", "À Malte", "À Chypre", "À Patmos"],
      reponse: "En Crète",
      explication: "Tite 1:5 : « Je t'ai laissé en Crète, afin que tu mettes en ordre ce qui reste à régler. »"
    }
  },
  {
    id: "phm",
    nom: "Philémon",
    testament: "NT",
    section: "Épîtres",
    chapitres: 1,
    auteur: "Paul",
    theme: "Le pardon chrétien, la réconciliation et la transformation d'un esclave en frère bien-aimé",
    versetOr: {
      ref: "Philémon 1:16",
      texte: "Non plus comme un esclave, mais comme supérieur à un esclave, comme un frère bien-aimé."
    },
    questionDefi: {
      question: "Pour quel ancien esclave en fuite devenu chrétien Paul intercède-t-il auprès de Philémon ?",
      options: ["Onésime", "Tychique", "Épaphrodite", "Timothée"],
      reponse: "Onésime",
      explication: "Paul demande à Philémon d'accueillir Onésime comme son propre frère en Christ."
    }
  },
  {
    id: "heb",
    nom: "Hébreux",
    testament: "NT",
    section: "Épîtres",
    chapitres: 13,
    auteur: "Inconnu (Paul / Apollos tradition)",
    theme: "La supériorité absolue de Christ sur les anges, Moïse et l'ancien sacerdoce, et la puissance de la foi",
    versetOr: {
      ref: "Hébreux 11:1",
      texte: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas."
    },
    questionDefi: {
      question: "Selon Hébreux 13:8, comment est Jésus-Christ à travers les âges ?",
      options: [
        "Jésus-Christ est le même hier, aujourd'hui, et éternellement.",
        "Il change selon les époques.",
        "Il s'est éloigné de nous.",
        "Il ne nous entend plus."
      ],
      reponse: "Jésus-Christ est le même hier, aujourd'hui, et éternellement.",
      explication: "L'immuabilité de Jésus est le roc inébranlable sur lequel repose l'espérance de l'Église."
    }
  },

  // LES ÉPÎTRES GÉNÉRALES & L'APOCALYPSE (8 LIVRES)
  {
    id: "jac",
    nom: "Jacques",
    testament: "NT",
    section: "Épîtres",
    chapitres: 5,
    auteur: "Jacques (frère du Seigneur)",
    theme: "La foi vivante démontrée par les œuvres d'amour, la maîtrise de la langue et la prière de la foi",
    versetOr: {
      ref: "Jacques 1:22",
      texte: "Mettez en pratique la parole, et ne vous bornez pas à l'écouter, en vous trompant vous-mêmes par de faux raisonnements."
    },
    questionDefi: {
      question: "Quelle affirmation célèbre Jacques fait-il concernant la foi sans les œuvres d'amour dans Jacques 2:26 ?",
      options: [
        "Comme le corps sans âme est mort, de même la foi sans les œuvres est morte.",
        "La foi suffit même si l'on fait le mal.",
        "Les œuvres seules sauvent.",
        "La foi est inutile."
      ],
      reponse: "Comme le corps sans âme est mort, de même la foi sans les œuvres est morte.",
      explication: "La vraie foi produit naturellement le fruit d'une vie transformée par l'amour."
    }
  },
  {
    id: "1pi",
    nom: "1 Pierre",
    testament: "NT",
    section: "Épîtres",
    chapitres: 5,
    auteur: "Pierre",
    theme: "L'espérance vivante au milieu de la persécution, le sacerdoce royal et la sainteté",
    versetOr: {
      ref: "1 Pierre 2:9",
      texte: "Vous, au contraire, vous êtes une race élue, un sacerdoce royal, une nation sainte, un peuple acquis, afin que vous annonciez les vertus de celui qui vous a appelés des ténèbres à son admirable lumière."
    },
    questionDefi: {
      question: "Sur qui Pierre exhorte-t-il les pèlerins à décharger tous leurs soucis dans 1 Pierre 5:7 ?",
      options: ["Sur Dieu, car lui-même prend soin de vous", "Sur les hommes puissants", "Sur le destin", "Sur eux-mêmes"],
      reponse: "Sur Dieu, car lui-même prend soin de vous",
      explication: "1 Pierre 5:7 : « Déchargez-vous sur lui de tous vos soucis, car lui-même prend soin de vous. »"
    }
  },
  {
    id: "2pi",
    nom: "2 Pierre",
    testament: "NT",
    section: "Épîtres",
    chapitres: 3,
    auteur: "Pierre",
    theme: "La croissance spirituelle dans la grâce, la mise en garde contre les faux docteurs et la promesse des nouveaux cieux",
    versetOr: {
      ref: "2 Pierre 3:9",
      texte: "Le Seigneur ne tarde pas dans l'accomplissement de la promesse, comme quelques-uns le croient ; mais il use de patience envers vous, ne voulant pas qu'aucun périsse, mais voulant que tous arrivent à la repentance."
    },
    questionDefi: {
      question: "Pourquoi le Seigneur semble-t-il différer l'heure de son retour selon 2 Pierre 3:9 ?",
      options: [
        "Il use de patience, ne voulant pas qu'aucun périsse mais que tous arrivent à la repentance",
        "Il a oublié sa promesse",
        "Il ne reviendra jamais",
        "Il attend que la terre soit riche"
      ],
      reponse: "Il use de patience, ne voulant pas qu'aucun périsse mais que tous arrivent à la repentance",
      explication: "La patience de Dieu est une porte ouverte pour le salut de chaque âme."
    }
  },
  {
    id: "1je",
    nom: "1 Jean",
    testament: "NT",
    section: "Épîtres",
    chapitres: 5,
    auteur: "Jean",
    theme: "La communion avec Dieu qui est lumière et amour, l'assurance du salut et la victoire par la foi",
    versetOr: {
      ref: "1 Jean 4:8",
      texte: "Celui qui n'aime pas n'a pas connu Dieu, car Dieu est amour."
    },
    questionDefi: {
      question: "Quelle célèbre définition de l'essence de Dieu l'apôtre Jean donne-t-il à deux reprises dans 1 Jean 4 ?",
      options: ["Dieu est amour", "Dieu est une montagne", "Dieu est une flamme d'airain", "Dieu est solitaire"],
      reponse: "Dieu est amour",
      explication: "L'amour n'est pas seulement un acte de Dieu, mais Sa nature même."
    }
  },
  {
    id: "2je",
    nom: "2 Jean",
    testament: "NT",
    section: "Épîtres",
    chapitres: 1,
    auteur: "Jean",
    theme: "Marcher dans la vérité et l'amour, et se préserver des séducteurs",
    versetOr: {
      ref: "2 Jean 1:6",
      texte: "Et l'amour consiste à marcher selon ses commandements. C'est là le commandement dans lequel vous devez marcher, comme vous l'avez appris dès le commencement."
    },
    questionDefi: {
      question: "À qui l'apôtre Jean adresse-t-il sa deuxième épître ?",
      options: ["À l'élue et à ses enfants", "À César", "Aux prêtres du temple", "À tous les soldats"],
      reponse: "À l'élue et à ses enfants",
      explication: "2 Jean 1:1 : « L'ancien, à l'élue et à ses enfants, que j'aime dans la vérité. »"
    }
  },
  {
    id: "3je",
    nom: "3 Jean",
    testament: "NT",
    section: "Épîtres",
    chapitres: 1,
    auteur: "Jean",
    theme: "L'hospitalité fraternelle envers les prédicateurs de la vérité, l'exemple de Gaïus et Démétrius",
    versetOr: {
      ref: "3 Jean 1:2",
      texte: "Bien-aimé, je souhaite que tu prospères à tous égards et sois en bonne santé, comme prospère l'état de ton âme."
    },
    questionDefi: {
      question: "Quel frère hospitalier et fidèle Jean loue-t-il chaleureusement au début de 3 Jean ?",
      options: ["Gaïus", "Diotrèphe", "Alexandre", "Barabbas"],
      reponse: "Gaïus",
      explication: "Gaïus marchait fidèlement dans la vérité et soutenait les messagers de l'Évangile."
    }
  },
  {
    id: "jud",
    nom: "Jude",
    testament: "NT",
    section: "Épîtres",
    chapitres: 1,
    auteur: "Jude (frère de Jacques et de Jésus)",
    theme: "Combattre pour la foi transmise une fois pour toutes aux saints et la doxologie finale éclatante",
    versetOr: {
      ref: "Jude 1:24-25",
      texte: "Or, à celui qui peut vous préserver de toute chute et vous faire paraître devant sa gloire irrépréhensibles et dans l'allégresse, à Dieu seul, notre Sauveur, par Jésus-Christ notre Seigneur, soient gloire, majesté, force et puissance, dès avant tous les temps, et maintenant, et dans tous les siècles ! Amen !"
    },
    questionDefi: {
      question: "À quoi Jude exhorte-t-il ardemment les croyants dans Jude 1:3 ?",
      options: [
        "À combattre pour la foi qui a été transmise aux saints une fois pour toutes",
        "À abandonner les assemblées",
        "À fabriquer de nouveaux dogmes",
        "À se quereller sans cesse"
      ],
      reponse: "À combattre pour la foi qui a été transmise aux saints une fois pour toutes",
      explication: "Jude rappelle la pureté et la suffisance définitive de l'Évangile apostolique."
    }
  },
  {
    id: "apo",
    nom: "Apocalypse",
    testament: "NT",
    section: "Révélation",
    chapitres: 22,
    auteur: "Jean",
    theme: "La révélation de Jésus-Christ triomphant, le jugement du mal, la résurrection et la Nouvelle Jérusalem",
    versetOr: {
      ref: "Apocalypse 21:4",
      texte: "Il essuiera toute larme de leurs yeux, et la mort ne sera plus, et il n'y aura plus ni deuil, ni cri, ni douleur, car les premières choses ont disparu."
    },
    questionDefi: {
      question: "Quel titre solennel Jésus proclame-t-il dans Apocalypse 22:13 pour affirmer Son éternité divine ?",
      options: [
        "Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin.",
        "Je suis un ange céleste.",
        "Je suis un prophète mortel.",
        "Je suis le scribe du ciel."
      ],
      reponse: "Je suis l'alpha et l'oméga, le premier et le dernier, le commencement et la fin.",
      explication: "Le livre de la Révélation clôt le canon biblique sur la victoire éternelle de l'Agneau de Dieu."
    }
  }
];
