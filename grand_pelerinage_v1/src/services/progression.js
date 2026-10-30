/** Plafonds partagés avec firestore.rules (150 XP, 5 perles, bonus 8000 / 500). */
export const XP_PER_VALIDATED_STAGE = 150;
export const PEARLS_PER_VALIDATED_STAGE = 5;
export const REVIEW_XP_BONUS = 8000;
export const REVIEW_PEARLS_BONUS = 500;
export const MAX_VALIDATED_STAGES = 400;
export const LEITNER_INTERVAL_DAYS = [0, 1, 3, 7, 30, 90];
const DAY_MS = 24 * 60 * 60 * 1000;

export function scoreCeiling(completedCount) {
  const n = Math.min(MAX_VALIDATED_STAGES, Math.max(0, Number(completedCount) || 0));
  return {
    xp: n * XP_PER_VALIDATED_STAGE + REVIEW_XP_BONUS,
    pearls: n * PEARLS_PER_VALIDATED_STAGE + REVIEW_PEARLS_BONUS
  };
}

export function clampScore(completedCount, xp, pearls) {
  const cap = scoreCeiling(completedCount);
  return {
    xp: Math.min(cap.xp, Math.max(0, Math.round(Number(xp) || 0))),
    pearls: Math.min(cap.pearls, Math.max(0, Math.round(Number(pearls) || 0)))
  };
}

export function stageVerseText(stage) {
  if (Array.isArray(stage.motsCorrects) && stage.motsCorrects.length > 0) {
    return stage.motsCorrects.join(" ");
  }
  return stage.quote || stage.titre || stage.ref;
}

export function awardStageCompletion(prev, stage, now = Date.now(), epochId = "") {
  const base = prev && typeof prev === "object" ? prev : {};
  const completed = Array.isArray(base.completedStages) ? base.completedStages : [];
  if (completed.includes(stage.id)) {
    return { saved: base, gainedXp: 0, gainedPearls: 0, alreadyDone: true };
  }

  const gainedXp = stage.recompense?.xp || 20;
  const gainedPearls = stage.recompense?.perles || 1;
  const nextCompleted = [...completed, stage.id];
  const cards = { ...(base.leitnerCards || {}) };
  const existing = cards[stage.ref];
  const nextBox = existing ? Math.min(5, (existing.box || 1) + 1) : 1;
  cards[stage.ref] = {
    ref: stage.ref,
    titre: stage.titre,
    texte: stageVerseText(stage),
    box: nextBox,
    stageId: stage.id,
    epochId: stage.epoch || epochId,
    lastReviewed: now,
    nextReview: now + (LEITNER_INTERVAL_DAYS[nextBox] || 1) * DAY_MS
  };

  const capped = clampScore(nextCompleted.length, (base.xp || 0) + gainedXp, (base.pearls || 0) + gainedPearls);
  return {
    saved: {
      ...base,
      completedStages: nextCompleted,
      xp: capped.xp,
      pearls: capped.pearls,
      leitnerCards: cards
    },
    gainedXp,
    gainedPearls,
    alreadyDone: false
  };
}

export function dueLeitnerCards(cards, now = Date.now()) {
  if (!cards || typeof cards !== "object" || Array.isArray(cards)) return [];
  return Object.values(cards).filter((card) => card && card.ref && (!card.nextReview || card.nextReview <= now));
}

export function reviewLeitnerCard(prev, cardRef, isSuccess, now = Date.now()) {
  const base = prev && typeof prev === "object" ? prev : {};
  const cards = { ...(base.leitnerCards || {}) };
  const card = cards[cardRef];
  if (!card) return { saved: base, awarded: false, waiting: false };
  if (card.nextReview && card.nextReview > now) {
    return { saved: base, awarded: false, waiting: true };
  }

  const newBox = isSuccess ? Math.min(5, (card.box || 1) + 1) : 1;
  cards[cardRef] = {
    ...card,
    box: newBox,
    lastReviewed: now,
    nextReview: now + (LEITNER_INTERVAL_DAYS[newBox] || 1) * DAY_MS
  };

  const gainedXp = isSuccess ? 15 : 0;
  const gainedPearls = isSuccess ? 1 : 0;
  const completedCount = Array.isArray(base.completedStages) ? base.completedStages.length : 0;
  const capped = clampScore(completedCount, (base.xp || 0) + gainedXp, (base.pearls || 0) + gainedPearls);
  return {
    saved: { ...base, xp: capped.xp, pearls: capped.pearls, leitnerCards: cards },
    awarded: gainedXp > 0,
    waiting: false,
    newBox
  };
}

export function motionAllowed() {
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
