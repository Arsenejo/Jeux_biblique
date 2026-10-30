/**
 * MOTEUR DU MODE ARÈNE INFINIE & DÉFI DES 66 LIVRES
 * Générateur procédural inépuisable de questions bibliques
 * Textes selon la version Louis Segond 1910
 * Église Évangélique Assemblée de la Grâce - Issia (Côte d'Ivoire)
 */

import { BIBLE_66_BOOKS } from "../data/bible66Books.js";
import { EPOCH_STAGES, BONUS_STAGES } from "./../data/bibleData.js";

// Multiplicateurs de combo et titres honorifiques
export const COMBO_TIERS = [
  { minStreak: 0, multiplier: 1.0, title: "Initié", icon: "🌱" },
  { minStreak: 3, multiplier: 1.25, title: "Fervent", icon: "🕯️" },
  { minStreak: 5, multiplier: 1.5, title: "Disciple Fidèle", icon: "🔥" },
  { minStreak: 10, multiplier: 2.0, title: "Guerrier de la Foi", icon: "⚔️" },
  { minStreak: 15, multiplier: 2.5, title: "Flambeau Céleste", icon: "✨" },
  { minStreak: 25, multiplier: 3.0, title: "Sentinelle d'Issia", icon: "👑" },
  { minStreak: 40, multiplier: 4.0, title: "Séraphin de Grâce", icon: "🕊️" }
];

export function getComboTier(streak = 0) {
  let tier = COMBO_TIERS[0];
  for (const t of COMBO_TIERS) {
    if (streak >= t.minStreak) {
      tier = t;
    }
  }
  return tier;
}

/**
 * Mélange aléatoire (Fisher-Yates)
 */
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Générateur procédural d'une question d'Arène
 */
export function generateArenaQuestion(difficulty = "intermediaire", seedIndex = 0) {
  const generators = [
    generateBookSectionQuestion,
    generateBookAuthorQuestion,
    generateBookChapterQuestion,
    generateGoldVerseQuestion,
    generateBookMasterChallenge,
    generateTrueFalseArenaQuestion,
    generateWhoSaidArenaQuestion
  ];

  const chosenGen = generators[Math.floor(Math.random() * generators.length)];
  return chosenGen(difficulty, seedIndex);
}

/**
 * 1. Question : Section ou Testament d'un livre
 */
function generateBookSectionQuestion(difficulty, seedIndex) {
  const bookIndex = Math.floor(Math.random() * BIBLE_66_BOOKS.length);
  const book = BIBLE_66_BOOKS[bookIndex];
  const isTestament = Math.random() > 0.5;

  if (isTestament) {
    const correct = book.testament === "AT" ? "Ancien Testament (39 livres)" : "Nouveau Testament (27 livres)";
    const wrong = book.testament === "AT" ? "Nouveau Testament (27 livres)" : "Ancien Testament (39 livres)";

    return {
      id: `arena-sec-${Date.now()}-${seedIndex}`,
      titre: `Canon Biblique · ${book.nom}`,
      ref: `${book.nom} (Livre ${bookIndex + 1}/66)`,
      difficulte: "debutant",
      type: "qcm",
      consigne: `Dans quelle grande partie de la Bible se trouve le livre de ${book.nom} ?`,
      options: shuffle([
        { text: correct, correct: true },
        { text: wrong, correct: false }
      ]),
      conseilRecherche: `📖 Le livre de ${book.nom} appartient à la section ${book.section}.`,
      explication: `Le livre de ${book.nom} est le ${bookIndex + 1}e livre de la Bible et fait partie de l'${book.testament === "AT" ? "Ancien" : "Nouveau"} Testament (${book.section}).`,
      recompense: { xp: 25, perles: 1 }
    };
  }

  // Question sur la section littéraire
  const allSections = Array.from(new Set(BIBLE_66_BOOKS.map(b => b.section)));
  const wrongSections = shuffle(allSections.filter(s => s !== book.section)).slice(0, 2);

  return {
    id: `arena-sec-${Date.now()}-${seedIndex}`,
    titre: `Classification · ${book.nom}`,
    ref: `${book.nom} (${book.testament})`,
    difficulte: "intermediaire",
    type: "qcm",
    consigne: `À quelle catégorie littéraire appartient le livre de ${book.nom} ?`,
    options: shuffle([
      { text: book.section, correct: true },
      { text: wrongSections[0] || "Évangiles", correct: false },
      { text: wrongSections[1] || "Poésie & Sagesse", correct: false }
    ]),
    conseilRecherche: `📖 Pense au contenu de ${book.nom} : son message central porte sur ${book.theme}.`,
    explication: `Dans le canon biblique, ${book.nom} est classé dans la section « ${book.section} ». Thème : ${book.theme}.`,
    recompense: { xp: 30, perles: 1 }
  };
}

/**
 * 2. Question : Auteur d'un livre
 */
function generateBookAuthorQuestion(difficulty, seedIndex) {
  const booksWithAuthor = BIBLE_66_BOOKS.filter(b => b.auteur && b.auteur !== "Tradition anonyme" && !b.auteur.includes("Inconnu"));
  const book = booksWithAuthor[Math.floor(Math.random() * booksWithAuthor.length)];

  const otherAuthors = Array.from(new Set(booksWithAuthor.map(b => b.auteur).filter(a => a !== book.auteur)));
  const wrong = shuffle(otherAuthors).slice(0, 2);

  return {
    id: `arena-aut-${Date.now()}-${seedIndex}`,
    titre: `Auteur Sacré · ${book.nom}`,
    ref: `${book.nom}`,
    difficulte: "intermediaire",
    type: "qcm",
    consigne: `Qui est l'auteur inspiré traditionnellement reconnu du livre de ${book.nom} ?`,
    options: shuffle([
      { text: book.auteur, correct: true },
      { text: wrong[0] || "L'apôtre Paul", correct: false },
      { text: wrong[1] || "Moïse", correct: false }
    ]),
    conseilRecherche: `📖 Ce serviteur de Dieu a écrit sous l'inspiration du Saint-Esprit pour édifier le peuple.`,
    explication: `Le livre de ${book.nom} est traditionnellement attribué à ${book.auteur}. Thème majeur : ${book.theme}.`,
    recompense: { xp: 35, perles: 1 }
  };
}

/**
 * 3. Question : Nombre de chapitres
 */
function generateBookChapterQuestion(difficulty, seedIndex) {
  const candidates = BIBLE_66_BOOKS.filter(b => [1, 3, 4, 5, 12, 16, 21, 24, 28, 40, 50, 66, 150].includes(b.chapitres));
  const book = candidates[Math.floor(Math.random() * candidates.length)] || BIBLE_66_BOOKS[0];

  let delta1 = book.chapitres <= 5 ? 1 : Math.floor(book.chapitres * 0.2) + 2;
  let delta2 = book.chapitres <= 5 ? 2 : Math.floor(book.chapitres * 0.4) + 4;
  const wrong1 = `${Math.max(1, book.chapitres + delta1)} chapitres`;
  const wrong2 = `${Math.max(1, book.chapitres - (book.chapitres > 2 ? delta1 : -delta2))} chapitres`;

  return {
    id: `arena-chp-${Date.now()}-${seedIndex}`,
    titre: `Architecture du Livre · ${book.nom}`,
    ref: `${book.nom}`,
    difficulte: "avance",
    type: "qcm",
    consigne: `Combien de chapitres compte le livre de ${book.nom} dans la version Louis Segond ?`,
    options: shuffle([
      { text: `${book.chapitres} chapitre${book.chapitres > 1 ? "s" : ""}`, correct: true },
      { text: wrong1, correct: false },
      { text: wrong2, correct: false }
    ]),
    conseilRecherche: `📖 Visualise la longueur de ${book.nom} dans ta Bible.`,
    explication: `Le livre de ${book.nom} contient exactement ${book.chapitres} chapitre${book.chapitres > 1 ? "s" : ""}.`,
    recompense: { xp: 40, perles: 2 }
  };
}

/**
 * 4. Question : Verset d'or à trous (Cloze) ou QCM
 */
function generateGoldVerseQuestion(difficulty, seedIndex) {
  const booksWithVerse = BIBLE_66_BOOKS.filter(b => b.versetOr && b.versetOr.texte && b.versetOr.texte.length > 20);
  const book = booksWithVerse[Math.floor(Math.random() * booksWithVerse.length)] || BIBLE_66_BOOKS[0];
  const verse = book.versetOr;

  // Découper le verset pour en faire un cloze
  const words = verse.texte.replace(/[.,;:!?«»"]/g, "").split(/\s+/).filter(w => w.length >= 5);
  const targetWord = words[Math.floor(words.length / 2)] || words[0] || "Dieu";

  const parts = verse.texte.split(new RegExp(`\\b${targetWord}\\b`, "i"));
  if (parts.length >= 2) {
    const wrongWords = shuffle([
      "lumière", "vérité", "force", "gloire", "paix", "justice", "foi", "grâce", "amour", "parole", "sagesse"
    ].filter(w => w.toLowerCase() !== targetWord.toLowerCase())).slice(0, 3);

    return {
      id: `arena-gld-${Date.now()}-${seedIndex}`,
      titre: `Verset d'Or · ${book.nom}`,
      ref: verse.ref,
      difficulte: "intermediaire",
      type: "cloze",
      consigne: `Complète ce verset d'or fondamental du livre de ${book.nom}.`,
      phraseAvant: parts[0],
      phraseApres: parts.slice(1).join(targetWord),
      motCorrect: targetWord,
      options: shuffle([targetWord, wrongWords[0] || "foi", wrongWords[1] || "paix", wrongWords[2] || "grâce"]),
      conseilRecherche: `📖 Médite ${verse.ref}. Ce verset résume l'esprit de ${book.nom}.`,
      explication: `Texte intégral : « ${verse.texte} » (${verse.ref}).`,
      recompense: { xp: 45, perles: 2 }
    };
  }

  // Fallback QCM
  return {
    id: `arena-ref-${Date.now()}-${seedIndex}`,
    titre: `Mémoire Biblique`,
    ref: verse.ref,
    difficulte: "intermediaire",
    type: "qcm",
    consigne: `De quel livre de la Bible est tiré ce verset : « ${verse.texte} » ?`,
    options: shuffle([
      { text: book.nom, correct: true },
      { text: BIBLE_66_BOOKS[(BIBLE_66_BOOKS.indexOf(book) + 5) % 66].nom, correct: false },
      { text: BIBLE_66_BOOKS[(BIBLE_66_BOOKS.indexOf(book) + 15) % 66].nom, correct: false }
    ]),
    conseilRecherche: `📖 Ce passage correspond au thème : ${book.theme}.`,
    explication: `Ce verset d'or est tiré de ${verse.ref}.`,
    recompense: { xp: 40, perles: 1 }
  };
}

/**
 * 5. Question : Défi Maître d'un des 66 livres
 */
function generateBookMasterChallenge(difficulty, seedIndex) {
  const booksWithChallenge = BIBLE_66_BOOKS.filter(b => b.questionDefi && b.questionDefi.question);
  const book = booksWithChallenge[Math.floor(Math.random() * booksWithChallenge.length)] || BIBLE_66_BOOKS[0];
  const qd = book.questionDefi;

  const formattedOptions = qd.options.map(opt => ({
    text: opt,
    correct: opt === qd.reponse
  }));

  return {
    id: `arena-mst-${Date.now()}-${seedIndex}`,
    titre: `Défi du Livre · ${book.nom}`,
    ref: `${book.nom} (${book.section})`,
    difficulte: "intermediaire",
    type: "qcm",
    consigne: qd.question,
    options: shuffle(formattedOptions),
    conseilRecherche: `📖 Consulte le livre de ${book.nom}. Thème : ${book.theme}.`,
    explication: qd.explication,
    recompense: { xp: 50, perles: 2 }
  };
}

/**
 * 6. Vrai ou Faux doctrinal
 */
function generateTrueFalseArenaQuestion(difficulty, seedIndex) {
  const allStages = Object.values(EPOCH_STAGES).flat().concat(BONUS_STAGES);
  const tfStages = allStages.filter(s => s.type === "truefalse");
  if (tfStages.length > 0) {
    const s = tfStages[Math.floor(Math.random() * tfStages.length)];
    return {
      ...s,
      id: `arena-tf-${Date.now()}-${seedIndex}`,
      titre: `Arène · ${s.titre}`
    };
  }
  return generateBookSectionQuestion(difficulty, seedIndex);
}

/**
 * 7. Qui a dit ?
 */
function generateWhoSaidArenaQuestion(difficulty, seedIndex) {
  const allStages = Object.values(EPOCH_STAGES).flat().concat(BONUS_STAGES);
  const wsStages = allStages.filter(s => s.type === "whosaid");
  if (wsStages.length > 0) {
    const s = wsStages[Math.floor(Math.random() * wsStages.length)];
    return {
      ...s,
      id: `arena-ws-${Date.now()}-${seedIndex}`,
      titre: `Arène · ${s.titre}`
    };
  }
  return generateBookAuthorQuestion(difficulty, seedIndex);
}
