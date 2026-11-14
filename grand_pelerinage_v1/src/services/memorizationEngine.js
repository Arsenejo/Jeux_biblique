/**
 * PHASE 4 — Système Central de Mémorisation : "JE RETIENS LA PAROLE"
 *
 * Cycle pédagogique rigoureux en 4 étapes :
 *   1. DECOUVERTE     (Lecture, sens et ancrage initial)
 *   2. ENTRAINEMENT   (Reconstruction assistée avec mots cachés)
 *   3. MEMORISATION   (Rappel actif par initiales / sans modèle + référence)
 *   4. MAITRISE       (Vérification différée sans indice à >= 24h / 7j / 30j)
 *
 * Intervalles de répétition espacée conservés et adaptés à la performance réelle :
 *   [1, 3, 7, 30, 90] jours.
 * Garantie pédagogique : une bonne réponse immédiate le jour 0 ne marque JAMAIS
 * le verset comme "Maîtrisé durablement".
 */

import { MYSTERY_VERSES_POOL } from "../data/bibleGamesData.js";
import { normalizeTextAnswer } from "./gamesEngine.js";

export const MEMORIZATION_INTERVAL_DAYS = [1, 3, 7, 30, 90];
export const DAY_MS = 24 * 60 * 60 * 1000;

export const MEMORIZATION_STAGES = [
  { id: 1, key: "DECOUVERTE", label: "Découverte", description: "Lecture attentive et compréhension du passage." },
  { id: 2, key: "ENTRAINEMENT", label: "Entraînement", description: "Reconstruction assistée avec mots-clés guidés." },
  { id: 3, key: "MEMORISATION", label: "Mémorisation", description: "Rappel actif à partir d'indices minimaux et de la référence." },
  { id: 4, key: "MAITRISE", label: "Maîtrise", description: "Vérification différée sans indice à 24h, 7j et 30j." }
];

export function createMemorizationCard(verse, now = Date.now()) {
  return {
    ref: verse.ref,
    texte: verse.texte,
    livre: verse.livre || "",
    indice: verse.indice || "",
    explication: verse.explication || "",
    stage: 1, // Commence toujours à DECOUVERTE
    intervalIndex: 0,
    intervalDays: MEMORIZATION_INTERVAL_DAYS[0],
    createdAt: now,
    lastReviewedAt: now,
    nextReviewAt: now + MEMORIZATION_INTERVAL_DAYS[0] * DAY_MS,
    attempts: 0,
    successes: 0,
    delayedSuccesses: 0,
    passed24h: false,
    passed7d: false,
    passed30d: false,
    masteredDurably: false,
    history: []
  };
}

/**
 * Construit les initiales de rappel pour l'étape 3 (ex: "Au commencement..." -> "A_ c_...")
 */
export function buildInitialsPrompt(texte = "") {
  return String(texte || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const m = word.match(/^([A-Za-zÀ-ÖØ-öø-ÿ])(.*)$/);
      if (!m) return word;
      return `${m[1]}…`;
    })
    .join(" ");
}

/**
 * Évalue la précision du rappel d'un verset saisi par le pèlerin (0 à 1).
 */
export function evaluateVerseRecall(expectedText = "", userInput = "") {
  const expectedWords = normalizeTextAnswer(expectedText).split(" ").filter(Boolean);
  const givenWords = normalizeTextAnswer(userInput).split(" ").filter(Boolean);
  if (expectedWords.length === 0) return { score: 0, passed: false };

  let matched = 0;
  for (let i = 0; i < expectedWords.length; i += 1) {
    if (givenWords[i] === expectedWords[i]) {
      matched += 1;
    } else if (givenWords.includes(expectedWords[i])) {
      matched += 0.5;
    }
  }
  const score = Math.min(1, matched / expectedWords.length);
  return {
    score,
    passed: score >= 0.8
  };
}

/**
 * Enregistre le résultat d'une session d'entraînement ou de révision différée.
 * Règle clé : une réussite le même jour (< 24h depuis createdAt) fait progresser
 * jusqu'à l'étape 3 au maximum et planifie J+1, sans jamais accorder `masteredDurably`.
 */
export function recordMemorizationAttempt(card, isSuccess, now = Date.now()) {
  if (!card) return null;
  const createdAt = Number(card.createdAt) || now;
  const ageMs = Math.max(0, now - createdAt);
  const isDelayed24h = ageMs >= DAY_MS;

  const historyEntry = { ts: now, success: Boolean(isSuccess), stage: card.stage, delayed24h: isDelayed24h };
  const nextHistory = [...(Array.isArray(card.history) ? card.history : []).slice(-19), historyEntry];

  if (!isSuccess) {
    // Verset difficile : revient plus vite (intervalle 1 jour) sans pénalité culpabilisante
    return {
      ...card,
      stage: Math.max(1, Math.min(2, card.stage)),
      intervalIndex: 0,
      intervalDays: MEMORIZATION_INTERVAL_DAYS[0],
      lastReviewedAt: now,
      nextReviewAt: now + MEMORIZATION_INTERVAL_DAYS[0] * DAY_MS,
      attempts: (card.attempts || 0) + 1,
      masteredDurably: false,
      history: nextHistory
    };
  }

  // Progression réussie
  const nextStage = isDelayed24h
    ? Math.min(4, (card.stage || 1) + 1)
    : Math.min(3, (card.stage || 1) + 1);

  let nextIntervalIndex = Number(card.intervalIndex) || 0;
  if (isDelayed24h) {
    nextIntervalIndex = Math.min(MEMORIZATION_INTERVAL_DAYS.length - 1, nextIntervalIndex + 1);
  }
  const nextIntervalDays = MEMORIZATION_INTERVAL_DAYS[nextIntervalIndex];

  const passed24h = Boolean(card.passed24h || isDelayed24h);
  const passed7d = Boolean(card.passed7d || ageMs >= 7 * DAY_MS);
  const passed30d = Boolean(card.passed30d || ageMs >= 30 * DAY_MS);
  const nextDelayedSuccesses = (card.delayedSuccesses || 0) + (isDelayed24h ? 1 : 0);

  // La maîtrise durable exige une validation différée réelle (>= 24h) ET étape 4 atteinte + intervalle >= 7j
  const masteredDurably = Boolean(
    isDelayed24h &&
      nextStage >= 4 &&
      nextIntervalDays >= 7 &&
      passed24h
  );

  return {
    ...card,
    stage: nextStage,
    intervalIndex: nextIntervalIndex,
    intervalDays: nextIntervalDays,
    lastReviewedAt: now,
    nextReviewAt: now + nextIntervalDays * DAY_MS,
    attempts: (card.attempts || 0) + 1,
    successes: (card.successes || 0) + 1,
    delayedSuccesses: nextDelayedSuccesses,
    passed24h,
    passed7d,
    passed30d,
    masteredDurably,
    history: nextHistory
  };
}

/**
 * Fusionne de manière transparente les cartes Leitner V1 existantes avec memorizationCards V2.
 */
export function buildUnifiedMemorizationList(memorizationCards = {}, leitnerCards = {}) {
  const map = new Map();

  if (leitnerCards && typeof leitnerCards === "object" && !Array.isArray(leitnerCards)) {
    Object.values(leitnerCards).forEach((lc) => {
      if (!lc || !lc.ref) return;
      const box = Math.max(1, Number(lc.box) || 1);
      map.set(lc.ref, {
        ref: lc.ref,
        texte: lc.texte || lc.titre || lc.ref,
        livre: "",
        stage: Math.min(4, box),
        intervalIndex: Math.min(4, box - 1),
        intervalDays: MEMORIZATION_INTERVAL_DAYS[Math.min(4, box - 1)],
        createdAt: lc.lastReviewed || Date.now(),
        lastReviewedAt: lc.lastReviewed || 0,
        nextReviewAt: lc.nextReview || Date.now(),
        attempts: Math.max(1, box),
        successes: Math.max(0, box - 1),
        delayedSuccesses: box >= 3 ? 1 : 0,
        passed24h: box >= 2,
        passed7d: box >= 3,
        passed30d: box >= 4,
        masteredDurably: box >= 4,
        history: []
      });
    });
  }

  if (memorizationCards && typeof memorizationCards === "object") {
    Object.values(memorizationCards).forEach((mc) => {
      if (mc && mc.ref) {
        map.set(mc.ref, mc);
      }
    });
  }

  return Array.from(map.values());
}

/**
 * Indicateurs pour le Tableau de bord de mémorisation.
 */
export function getMemorizationDashboardStats(memorizationCards = {}, leitnerCards = {}, now = Date.now()) {
  const list = buildUnifiedMemorizationList(memorizationCards, leitnerCards);
  const discoveredCount = list.length;
  const dueList = list.filter((c) => !c.nextReviewAt || c.nextReviewAt <= now);
  const masteredList = list.filter((c) => Boolean(c.masteredDurably));
  const inProgressList = list.filter((c) => !c.masteredDurably);

  const totalAttempts = list.reduce((sum, c) => sum + (Number(c.attempts) || 0), 0);
  const totalSuccesses = list.reduce((sum, c) => sum + (Number(c.successes) || 0), 0);
  const successRate = totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0;

  return {
    cards: list,
    discoveredCount,
    inProgressCount: inProgressList.length,
    dueCount: dueList.length,
    dueCards: dueList,
    masteredCount: masteredList.length,
    successRate,
    evaluations24h: list.filter((c) => c.passed24h).length,
    evaluations7d: list.filter((c) => c.passed7d).length,
    evaluations30d: list.filter((c) => c.passed30d).length,
    availablePool: MYSTERY_VERSES_POOL
  };
}

