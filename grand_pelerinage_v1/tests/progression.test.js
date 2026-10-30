import test from "node:test";
import assert from "node:assert/strict";
import {
  awardStageCompletion,
  clampScore,
  dueLeitnerCards,
  reviewLeitnerCard,
  scoreCeiling
} from "../src/services/progression.js";

const stage = {
  id: 7,
  ref: "Jean 1:1",
  titre: "La Parole",
  quote: "Au commencement était la Parole.",
  recompense: { xp: 30, perles: 1 },
  epoch: "evangiles"
};

test("Une étape ne crédite l'XP qu'une seule fois", () => {
  const first = awardStageCompletion({ completedStages: [], xp: 0, pearls: 0, leitnerCards: {} }, stage, 1_000);
  assert.equal(first.gainedXp, 30);
  assert.equal(first.saved.xp, 30);
  assert.deepEqual(first.saved.completedStages, [7]);

  const second = awardStageCompletion(first.saved, stage, 2_000);
  assert.equal(second.alreadyDone, true);
  assert.equal(second.gainedXp, 0);
  assert.equal(second.saved.xp, 30);
  assert.equal(second.saved, first.saved);
});

test("La révision espacée ne paie pas une carte qui n'est pas échue", () => {
  const saved = {
    completedStages: [7],
    xp: 30,
    pearls: 1,
    leitnerCards: {
      "Jean 1:1": { ref: "Jean 1:1", box: 1, nextReview: 5_000 }
    }
  };
  const early = reviewLeitnerCard(saved, "Jean 1:1", true, 4_000);
  assert.equal(early.waiting, true);
  assert.equal(early.saved.xp, 30);

  const due = reviewLeitnerCard(saved, "Jean 1:1", true, 5_000);
  assert.equal(due.awarded, true);
  assert.equal(due.saved.xp, 45);
  assert.ok(due.saved.leitnerCards["Jean 1:1"].nextReview > 5_000);

  const again = reviewLeitnerCard(due.saved, "Jean 1:1", true, 5_100);
  assert.equal(again.waiting, true);
  assert.equal(again.saved.xp, 45);
});

test("Un échec de révision ne donne pas d'XP", () => {
  const saved = {
    completedStages: [],
    xp: 0,
    pearls: 0,
    leitnerCards: { "Jean 1:1": { ref: "Jean 1:1", box: 3, nextReview: 1 } }
  };
  const missed = reviewLeitnerCard(saved, "Jean 1:1", false, 10);
  assert.equal(missed.awarded, false);
  assert.equal(missed.saved.xp, 0);
  assert.equal(missed.saved.leitnerCards["Jean 1:1"].box, 1);
});

test("Le plafond empêche un score absurde", () => {
  const cap = scoreCeiling(2);
  const clamped = clampScore(2, 999999, 999999);
  assert.equal(clamped.xp, cap.xp);
  assert.equal(clamped.pearls, cap.pearls);
  assert.ok(clamped.xp < 20000);
});

test("Le jardin vide n'invente pas de cartes échues", () => {
  assert.deepEqual(dueLeitnerCards(undefined), []);
  assert.deepEqual(dueLeitnerCards({}), []);
});
