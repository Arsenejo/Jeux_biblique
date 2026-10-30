import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const questionsPath = path.resolve(here, "../../questions.js");
const outPath = path.resolve(here, "../src/data/jeanStages.js");

const code = fs.readFileSync(questionsPath, "utf8");
const { BANQUE_QUESTIONS } = new Function(`${code}\nreturn { BANQUE_QUESTIONS, NIVEAUX_DEFI };`)();

function difficultyFor(level) {
  if (level <= 3) return "debutant";
  if (level <= 6) return "intermediaire";
  if (level <= 8) return "avance";
  return "expert";
}

const TEMPS = { debutant: 50, intermediaire: 35, avance: 25, expert: 15 };

function epochFor(level) {
  if (level <= 7) return "evangiles";
  if (level === 8) return "eglise";
  return "esperance";
}

const byEpoch = { evangiles: [], eglise: [], esperance: [] };

BANQUE_QUESTIONS.forEach((q, index) => {
  const difficulte = difficultyFor(q.level);
  const hint = q.verset
    ? `📖 Lis ${q.ref}. Le verset proposé est tronqué : ${q.verset}`
    : `📖 Lis ${q.ref} dans la Bible Louis Segond 1910 avant de répondre.`;
  byEpoch[epochFor(q.level)].push({
    id: 20000 + index + 1,
    titre: String(q.q).replace(/\s+/g, " ").slice(0, 90),
    ref: q.ref,
    theme: q.theme,
    level: q.level,
    source: "defi-jean",
    difficulte,
    tempsLimite: TEMPS[difficulte],
    coutVie: q.level >= 8,
    type: "qcm",
    consigne: q.q,
    options: q.options.map((text, optionIndex) => ({
      text,
      correct: optionIndex === q.answer
    })),
    conseilRecherche: hint,
    explication: q.lecon,
    recompense: { xp: 20 + q.level * 2, perles: 1 }
  });
});

const file = `// Généré depuis questions.js — ne pas éditer à la main.
// Relancer : node grand_pelerinage_v1/scripts/build-jean-stages.mjs

export const JEAN_STAGES_BY_EPOCH = ${JSON.stringify(byEpoch, null, 2)};
`;

fs.writeFileSync(outPath, file);
const total = Object.values(byEpoch).reduce((sum, list) => sum + list.length, 0);
console.log(`Étapes Défi Jean écrites : ${total}`);
