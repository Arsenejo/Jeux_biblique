import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { EPOCH_STAGES } from "../src/data/bibleData.js";
import { JEAN_STAGES_BY_EPOCH } from "../src/data/jeanStages.js";

test("Chaque QCM du sentier a exactement 4 options et une seule bonne réponse", () => {
  for (const [epochId, stages] of Object.entries(EPOCH_STAGES)) {
    for (const stage of stages) {
      if (stage.type !== "qcm") continue;
      assert.equal(
        stage.options.length,
        4,
        `${epochId} #${stage.id} ${stage.ref} a ${stage.options.length} options`
      );
      const corrects = stage.options.filter((option) => option.correct).length;
      assert.equal(corrects, 1, `${epochId} #${stage.id} doit avoir une seule bonne réponse`);
    }
  }
});

test("Les étapes étendues et les 126 questions du Défi Jean sont branchées", () => {
  const all = Object.values(EPOCH_STAGES).flat();
  assert.ok(all.length >= 72 + 74 + 126, `Étapes branchées : ${all.length}`);
  const jean = all.filter((stage) => stage.source === "defi-jean");
  assert.equal(jean.length, 126);
  const written = Object.values(JEAN_STAGES_BY_EPOCH).reduce((sum, list) => sum + list.length, 0);
  assert.equal(written, 126);

  const ids = all.map((stage) => stage.id);
  assert.equal(new Set(ids).size, ids.length, "Les identifiants d'étapes doivent être uniques");
});

test("La banque questions.js et les étapes générées ont le même effectif", () => {
  const questionsPath = path.resolve("..", "questions.js");
  const code = fs.readFileSync(questionsPath, "utf8");
  const { BANQUE_QUESTIONS } = new Function(`${code}\nreturn { BANQUE_QUESTIONS };`)();
  const written = Object.values(JEAN_STAGES_BY_EPOCH).reduce((sum, list) => sum + list.length, 0);
  assert.equal(written, BANQUE_QUESTIONS.length);
});
