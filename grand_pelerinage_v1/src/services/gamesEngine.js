/**
 * Moteur déterministe des 9 jeux V2.0 — Le Grand Pèlerinage de la Bible.
 * Conçu sans effets de bord DOM pour être testable en Node.js et utilisable en React.
 */

import {
  MYSTERY_VERSES_POOL,
  BIBLE_WHO_AM_I_CHARACTERS,
  BIBLE_CHRONOLOGY_LEVELS,
  WORD_PAIRS_CATEGORIES,
  TREASURE_RIDDLE_ADVENTURES,
  LISTEN_AND_RECOGNIZE_ITEMS,
  CHARACTER_JOURNEYS_DATA
} from "../data/bibleGamesData.js";

export function normalizeTextAnswer(value = "") {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[«»"'.,;:!?()—–]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function seededIndex(seedStr, modulo) {
  const s = String(seedStr || "0");
  let hash = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    hash ^= s.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash) % Math.max(1, modulo);
}

function deterministicShuffle(items = [], seedStr = "seed") {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = seededIndex(`${seedStr}-${i}`, i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const MYSTERY_VERSE_MODES = [
  { id: "missing_words", label: "Compléter les mots manquants" },
  { id: "order_words", label: "Remettre les mots dans l'ordre" },
  { id: "from_clues", label: "Retrouver le verset à partir d'indices" },
  { id: "find_reference", label: "Retrouver sa référence" },
  { id: "reconstruct_no_model", label: "Reconstruire sans modèle" },
  { id: "definition_word", label: "Retrouver un mot par sa définition" }
];

export function getDynamicMysteryVersesPool() {
  let extras = [];
  try {
    if (typeof localStorage !== "undefined") {
      const raw = localStorage.getItem("pelerinage_custom_bible_cms_v2");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        extras = parsed
          .filter((c) => c && c.type !== "qcm" && c.ref && c.texte)
          .map((c) => {
            const words = String(c.texte).split(/\s+/).filter((w) => w.length >= 4);
            const missingWords = words.slice(0, 3).map((w) => w.replace(/[.,;:!?«»"]/g, ""));
            return {
              id: c.id,
              ref: c.ref,
              livre: c.livre || "Bible",
              texte: c.texte,
              missingWords: missingWords.length ? missingWords : [words[0] || "Dieu"],
              definitionWord: { mot: missingWords[0] || "Dieu", definition: c.explication || c.ref },
              indice: `Passage ajouté par l'administration (${c.livre || "LSG 1910"}).`,
              explication: c.explication || c.ref,
              niveau: "explorateur"
            };
          });
      }
    }
  } catch {}
  return [...MYSTERY_VERSES_POOL, ...extras];
}

/**
 * Jeu 1 : Construit un défi "Le Verset Mystère" parmi les 6 modes supportés.
 */
export function buildMysteryVerseChallenge(verseIndex = 0, mode = "missing_words", seed = "v2") {
  const safePool = getDynamicMysteryVersesPool();
  const verse = safePool[Math.abs(Number(verseIndex) || 0) % safePool.length];
  const tokens = verse.texte.split(/\s+/).filter(Boolean);

  if (mode === "order_words") {
    return {
      mode,
      verse,
      tokensCorrects: tokens,
      tokensShuffled: deterministicShuffle(tokens, `${seed}-${verse.id}-order`)
    };
  }

  if (mode === "find_reference" || mode === "from_clues") {
    const distractors = deterministicShuffle(
      safePool.filter((v) => v.id !== verse.id),
      `${seed}-${verse.id}-refs`
    ).slice(0, 3);
    const options = deterministicShuffle(
      [verse, ...distractors].map((v) => ({
        ref: v.ref,
        texte: v.texte,
        isCorrect: v.id === verse.id
      })),
      `${seed}-${verse.id}-opts`
    );
    return { mode, verse, options };
  }

  if (mode === "definition_word") {
    const targetWord = verse.definitionWord?.mot || verse.missingWords[0];
    const otherWords = deterministicShuffle(
      safePool
        .filter((v) => v.id !== verse.id && v.definitionWord?.mot)
        .map((v) => v.definitionWord.mot),
      `${seed}-${verse.id}-def`
    ).slice(0, 3);
    return {
      mode,
      verse,
      definition: verse.definitionWord?.definition || verse.indice,
      expectedWord: targetWord,
      options: deterministicShuffle([targetWord, ...otherWords], `${seed}-def-opts`)
    };
  }

  // "missing_words" ou "reconstruct_no_model"
  const maskedSet = new Set(
    (verse.missingWords || []).map((w) => normalizeTextAnswer(w))
  );
  const blanks = [];
  const maskedParts = tokens.map((token, idx) => {
    const clean = normalizeTextAnswer(token);
    if (maskedSet.has(clean)) {
      blanks.push({ idx, expected: token.replace(/[.,;:!?«»"]/g, "") });
      return { isBlank: true, idx, raw: token };
    }
    return { isBlank: false, text: token };
  });

  if (blanks.length === 0 && tokens.length > 1) {
    blanks.push({ idx: 1, expected: tokens[1].replace(/[.,;:!?«»"]/g, "") });
    maskedParts[1] = { isBlank: true, idx: 1, raw: tokens[1] };
  }

  return {
    mode,
    verse,
    maskedParts,
    blanks
  };
}

export function evaluateMysteryVerseAnswer(challenge, userAnswer) {
  if (!challenge || !challenge.verse) return { valid: false, xp: 0, stars: 0 };
  const { mode, verse } = challenge;

  if (mode === "missing_words") {
    const answers = Array.isArray(userAnswer) ? userAnswer : [];
    const ok =
      challenge.blanks.length > 0 &&
      challenge.blanks.every(
        (b, i) => normalizeTextAnswer(answers[i]) === normalizeTextAnswer(b.expected)
      );
    return { valid: ok, xp: ok ? 25 : 0, pearls: ok ? 1 : 0, stars: ok ? 3 : 0 };
  }

  if (mode === "order_words") {
    const arr = Array.isArray(userAnswer) ? userAnswer : [];
    const ok =
      arr.length === challenge.tokensCorrects.length &&
      arr.every((w, i) => normalizeTextAnswer(w) === normalizeTextAnswer(challenge.tokensCorrects[i]));
    return { valid: ok, xp: ok ? 25 : 0, pearls: ok ? 1 : 0, stars: ok ? 3 : 0 };
  }

  if (mode === "reconstruct_no_model") {
    const target = normalizeTextAnswer(verse.texte);
    const given = normalizeTextAnswer(userAnswer);
    const targetWords = target.split(" ").filter(Boolean);
    const givenWords = given.split(" ").filter(Boolean);
    const matches = targetWords.filter((w, i) => givenWords[i] === w).length;
    const ratio = targetWords.length > 0 ? matches / targetWords.length : 0;
    const ok = ratio >= 0.8;
    return { valid: ok, ratio, xp: ok ? 35 : 0, pearls: ok ? 2 : 0, stars: ratio >= 0.95 ? 3 : ok ? 2 : 0 };
  }

  if (mode === "definition_word") {
    const ok = normalizeTextAnswer(userAnswer) === normalizeTextAnswer(challenge.expectedWord);
    return { valid: ok, xp: ok ? 20 : 0, pearls: ok ? 1 : 0, stars: ok ? 3 : 0 };
  }

  // find_reference / from_clues
  const ok = normalizeTextAnswer(userAnswer) === normalizeTextAnswer(verse.ref);
  return { valid: ok, xp: ok ? 25 : 0, pearls: ok ? 1 : 0, stars: ok ? 3 : 0 };
}

/**
 * Jeu 2 : Qui suis-je dans la Bible ? — Barème dégressif selon le nombre d'indices révélés (1 à 3).
 */
export function scoreWhoAmI(cluesUsed = 1, pedagogicalProfile = "explorateur") {
  const safeClues = Math.min(3, Math.max(1, Number(cluesUsed) || 1));
  const baseMap = {
    1: { xp: 30, pearls: 2, stars: 3 },
    2: { xp: 20, pearls: 1, stars: 2 },
    3: { xp: 12, pearls: 1, stars: 1 }
  };
  const base = baseMap[safeClues];
  const bonusXp = pedagogicalProfile === "decouverte" ? 3 : 0;
  return { ...base, xp: base.xp + bonusXp, cluesUsed: safeClues };
}

export function getWhoAmIChallenge(index = 0) {
  const item = BIBLE_WHO_AM_I_CHARACTERS[Math.abs(Number(index) || 0) % BIBLE_WHO_AM_I_CHARACTERS.length];
  return {
    ...item,
    shuffledOptions: deterministicShuffle(item.options, `wai-${item.id}`)
  };
}

/**
 * Jeu 3 : Chronologie Biblique
 */
export function buildChronologyRound(levelIndex = 0, seed = "chrono") {
  const level = BIBLE_CHRONOLOGY_LEVELS[Math.abs(Number(levelIndex) || 0) % BIBLE_CHRONOLOGY_LEVELS.length];
  let shuffled = deterministicShuffle(level.events, `${seed}-${level.id}`);
  // Éviter qu'un mélange soit déjà dans l'ordre exact par hasard
  if (shuffled.every((e, i) => e.id === level.events[i].id) && shuffled.length > 1) {
    shuffled = [...shuffled.slice(1), shuffled[0]];
  }
  return { ...level, shuffledEvents: shuffled };
}

export function evaluateChronologyOrder(level, orderedEventIds = []) {
  if (!level || !Array.isArray(level.events)) return { valid: false, correctPositions: 0, xp: 0, stars: 0 };
  const expected = level.events.map((e) => e.id);
  const correctPositions = expected.filter((id, i) => orderedEventIds[i] === id).length;
  const valid = correctPositions === expected.length;
  const stars = valid ? 3 : correctPositions >= expected.length - 2 ? 1 : 0;
  return {
    valid,
    correctPositions,
    total: expected.length,
    xp: valid ? 30 : 0,
    pearls: valid ? 2 : 0,
    stars
  };
}

/**
 * Jeu 4 : Les Paires de la Parole
 */
export function buildWordPairsRound(categoryIndex = 0, seed = "pairs") {
  const cat = WORD_PAIRS_CATEGORIES[Math.abs(Number(categoryIndex) || 0) % WORD_PAIRS_CATEGORIES.length];
  return {
    ...cat,
    leftItems: cat.pairs.map((p) => ({ id: p.id, text: p.left })),
    rightItems: deterministicShuffle(
      cat.pairs.map((p) => ({ id: p.id, text: p.right })),
      `${seed}-${cat.id}`
    )
  };
}

/**
 * Jeu 5 : L'Énigme du Trésor Biblique
 */
export function getTreasureAdventure(index = 0) {
  return TREASURE_RIDDLE_ADVENTURES[Math.abs(Number(index) || 0) % TREASURE_RIDDLE_ADVENTURES.length];
}

export function evaluateTreasureStep(adventure, stepIndex, optionIndex) {
  const step = adventure?.enigmes?.[stepIndex];
  if (!step) return { valid: false, clueUnlocked: null, completed: false };
  const valid = Number(optionIndex) === Number(step.correctIndex);
  const isLast = valid && stepIndex === adventure.enigmes.length - 1;
  return {
    valid,
    clueUnlocked: valid ? step.cleIndice : null,
    completed: isLast,
    recompense: isLast ? adventure.recompense : null
  };
}

/**
 * Jeu 6 : Écoute et Reconnais
 */
export function getListenAndRecognizeItem(index = 0) {
  const item = LISTEN_AND_RECOGNIZE_ITEMS[Math.abs(Number(index) || 0) % LISTEN_AND_RECOGNIZE_ITEMS.length];
  return {
    ...item,
    shuffledOptions: deterministicShuffle(
      item.options.map((label, idx) => ({ label, isCorrect: idx === item.correctIndex })),
      `listen-${item.id}`
    )
  };
}

/**
 * Jeu 7 : Le Défi du Jour (déterministe par YYYY-MM-DD, 5 questions variées).
 */
export function getTodayDateKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

export function getDailyChallenge(dateKey = getTodayDateKey()) {
  const seed = String(dateKey || getTodayDateKey());
  const vIdx = seededIndex(`${seed}-verse`, MYSTERY_VERSES_POOL.length);
  const cIdx = seededIndex(`${seed}-char`, BIBLE_WHO_AM_I_CHARACTERS.length);
  const lIdx = seededIndex(`${seed}-listen`, LISTEN_AND_RECOGNIZE_ITEMS.length);
  const chIdx = seededIndex(`${seed}-chrono`, BIBLE_CHRONOLOGY_LEVELS.length);
  const jIdx = seededIndex(`${seed}-journey`, CHARACTER_JOURNEYS_DATA.length);

  const v = MYSTERY_VERSES_POOL[vIdx];
  const wai = BIBLE_WHO_AM_I_CHARACTERS[cIdx];
  const lis = LISTEN_AND_RECOGNIZE_ITEMS[lIdx];
  const chr = BIBLE_CHRONOLOGY_LEVELS[chIdx];
  const jour = CHARACTER_JOURNEYS_DATA[jIdx];

  const questions = [
    {
      id: `${seed}-q1`,
      categorie: "Verset & Référence",
      prompt: `À quelle référence biblique appartient ce verset : « ${v.texte} » ?`,
      options: buildMysteryVerseChallenge(vIdx, "find_reference", seed).options.map((o) => ({
        label: o.ref,
        isCorrect: o.isCorrect
      })),
      ref: v.ref,
      explication: v.explication
    },
    {
      id: `${seed}-q2`,
      categorie: "Personnage",
      prompt: `Qui suis-je ? Indice : « ${wai.indices[2]} »`,
      options: deterministicShuffle(wai.options, `${seed}-q2`).map((name) => ({
        label: name,
        isCorrect: name === wai.reponse
      })),
      ref: wai.ref,
      explication: wai.explication
    },
    {
      id: `${seed}-q3`,
      categorie: "Histoire",
      prompt: lis.question,
      audioHint: lis.audioText,
      options: lis.options.map((label, idx) => ({ label, isCorrect: idx === lis.correctIndex })),
      ref: lis.ref,
      explication: lis.explication
    },
    {
      id: `${seed}-q4`,
      categorie: "Compréhension",
      prompt: `Dans la série « ${chr.titre} », quel événement vient en TOUT PREMIER ?`,
      options: deterministicShuffle(chr.events, `${seed}-q4`).map((ev) => ({
        label: `${ev.label} (${ev.ref})`,
        isCorrect: ev.id === chr.events[0].id
      })),
      ref: chr.events[0].ref,
      explication: chr.explication
    },
    {
      id: `${seed}-q5`,
      categorie: "Mémorisation & Vie",
      prompt: `Selon l'histoire de ${jour.nom}, quel enseignement clé résume sa marche ?`,
      options: deterministicShuffle(
        [
          { label: jour.questions[0].options[jour.questions[0].correctIndex], isCorrect: true },
          ...jour.questions[0].options
            .filter((_, i) => i !== jour.questions[0].correctIndex)
            .map((label) => ({ label, isCorrect: false }))
        ],
        `${seed}-q5`
      ),
      subtitle: jour.questions[0].q,
      ref: jour.versets[0]?.ref || jour.époque,
      explication: jour.enseignements
    }
  ];

  return {
    dateKey: seed,
    titre: `Défi du Jour — ${seed}`,
    questions,
    recompense: { xp: 40, perles: 3 }
  };
}

/**
 * Jeu 8 : Duel Biblique Asynchrone (honnête, reproductible par code de duel sans faux temps réel).
 */
export function generateDuelCode(seed = Date.now()) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[seededIndex(`${seed}-${i}`, alphabet.length)];
  }
  return code;
}

export function createAsyncDuelSession(duelCode, challengerName = "Pèlerin", challengerScore = null) {
  const cleanCode = String(duelCode || generateDuelCode())
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6) || "JEAN26";
  const daily = getDailyChallenge(`DUEL-${cleanCode}`);
  return {
    code: cleanCode,
    mode: "asynchrone",
    limiteExpliquee:
      "Duel asynchrone fiable : les deux joueurs répondent exactement aux mêmes 5 questions générées par ce code et comparent leurs scores.",
    challengerName: String(challengerName || "Pèlerin").slice(0, 30),
    challengerScore,
    questions: daily.questions
  };
}

export function encodeDuelInvitePayload({ code, challengerName, score, total }) {
  const payload = {
    code: String(code || "").toUpperCase().slice(0, 6),
    name: String(challengerName || "Pèlerin").slice(0, 30),
    score: Math.max(0, Number(score) || 0),
    total: Math.max(1, Number(total) || 5)
  };
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function decodeDuelInvitePayload(token) {
  try {
    const raw = decodeURIComponent(escape(atob(String(token || "").trim())));
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.code) return null;
    return {
      code: String(parsed.code).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6),
      name: String(parsed.name || "Pèlerin").slice(0, 30),
      score: Math.max(0, Number(parsed.score) || 0),
      total: Math.max(1, Number(parsed.total) || 5)
    };
  } catch {
    return null;
  }
}

export function compareDuelResults(challengerScore, opponentScore, challengerName = "Ami", opponentName = "Toi") {
  const s1 = Number(challengerScore) || 0;
  const s2 = Number(opponentScore) || 0;
  if (s2 > s1) {
    return { winner: "opponent", message: `${opponentName} remporte ce duel fraternel (${s2} vs ${s1}) !` };
  }
  if (s1 > s2) {
    return { winner: "challenger", message: `${challengerName} garde l'avantage (${s1} vs ${s2}). Revanche possible !` };
  }
  return { winner: "draw", message: `Égalité fraternelle (${s1} - ${s2}) ! Vous grandissez ensemble dans la Parole.` };
}

/**
 * Jeu 9 : Parcours des Personnages
 */
export function getCharacterJourney(index = 0) {
  return CHARACTER_JOURNEYS_DATA[Math.abs(Number(index) || 0) % CHARACTER_JOURNEYS_DATA.length];
}

