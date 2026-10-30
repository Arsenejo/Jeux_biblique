import test from "node:test";
import assert from "node:assert/strict";
import {
  firstOpenStage,
  isBonusPlayable,
  isEpochUnlocked,
  isStagePlayable
} from "../src/services/pathProgress.js";

const epochs = [{ id: "racines" }, { id: "courage" }];
const stages = {
  racines: [{ id: 1 }, { id: 2 }, { id: 3 }],
  courage: [{ id: 10 }, { id: 11 }]
};

test("Seule la première étape est ouverte au départ", () => {
  assert.equal(isStagePlayable(1, "racines", epochs, stages, []), true);
  assert.equal(isStagePlayable(2, "racines", epochs, stages, []), false);
  assert.equal(isEpochUnlocked("courage", epochs, stages, []), false);
});

test("L'étape suivante s'ouvre quand la précédente est accomplie", () => {
  assert.equal(isStagePlayable(2, "racines", epochs, stages, [1]), true);
  assert.equal(isStagePlayable(3, "racines", epochs, stages, [1]), false);
  assert.equal(firstOpenStage(stages.racines, [1]).id, 2);
});

test("Une étape déjà faite reste rejouable, même hors ordre", () => {
  assert.equal(isStagePlayable(3, "racines", epochs, stages, [3]), true);
  assert.equal(isStagePlayable(2, "racines", epochs, stages, [3]), false);
});

test("Le monde suivant attend la fin du monde précédent", () => {
  assert.equal(isEpochUnlocked("courage", epochs, stages, [1, 2]), false);
  assert.equal(isEpochUnlocked("courage", epochs, stages, [1, 2, 3]), true);
  assert.equal(isStagePlayable(10, "courage", epochs, stages, [1, 2, 3]), true);
  assert.equal(isStagePlayable(11, "courage", epochs, stages, [1, 2, 3]), false);
});

test("Un exercice bonus s'ouvre après toutes les étapes de son époque", () => {
  const bonus = { id: 73, epoch: "racines" };
  assert.equal(isBonusPlayable(bonus, epochs, stages, [1, 2]), false);
  assert.equal(isBonusPlayable(bonus, epochs, stages, [1, 2, 3]), true);
});
