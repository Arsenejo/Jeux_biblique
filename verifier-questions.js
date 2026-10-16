/* Contrôle de la banque de questions — « node verifier-questions.js »
   ---------------------------------------------------------------
   Vérifie les règles d'écriture de questions.js pour les 10 NIVEAUX.
   À relancer après CHAQUE ajout de question. Sort en code 1 si une règle est violée.

   Règles vérifiées :
   1. Présence des champs requis (theme, ref, q, options, answer, lecon, level).
   2. Exactement 4 options distinctes et non vides par question.
   3. `answer: 0` obligatoire dans la banque brute.
   4. Pas de doublon de question.
   5. Règle d'or : la bonne réponse ne doit jamais être lisible dans le verset tronqué.
   6. Troncature obligatoire si verset affiché.
   7. `level` valide entre 1 et 10.
   8. Chaque niveau doit comporter au moins 10 questions.
*/

const fs = require('fs');
const path = require('path');

const fichier = path.join(__dirname, 'questions.js');
const code = fs.readFileSync(fichier, 'utf8');
const { BANQUE_QUESTIONS, NIVEAUX_DEFI } = new Function(code + '\nreturn { BANQUE_QUESTIONS, NIVEAUX_DEFI };')();

const erreurs = [];
const themes = {};
const niveaux = {};
const vus = new Map();

function normaliser(texte) {
  return String(texte)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

if (!Array.isArray(NIVEAUX_DEFI) || NIVEAUX_DEFI.length !== 10) {
  erreurs.push(`NIVEAUX_DEFI doit contenir exactement 10 niveaux (trouvé : ${NIVEAUX_DEFI ? NIVEAUX_DEFI.length : 0})`);
}

BANQUE_QUESTIONS.forEach((q, i) => {
  const lieu = `Question ${i + 1} (Niveau ${q.level || '?'}, ${q.ref || 'sans ref'})`;
  const souci = (message) => erreurs.push(`${lieu} : ${message}`);

  // 1. Champs obligatoires
  if (!q.theme) souci('thème manquant');
  if (!q.ref) souci('référence manquante');
  if (!q.q) souci('énoncé manquant');
  if (!Array.isArray(q.options)) souci('options absentes');
  if (!q.lecon) souci('explication (lecon) manquante');

  // 2. Niveau entre 1 et 10
  if (!Number.isInteger(q.level) || q.level < 1 || q.level > 10) {
    souci(`niveau invalide : ${q.level} (doit être un entier entre 1 et 10)`);
  } else {
    niveaux[q.level] = (niveaux[q.level] || 0) + 1;
  }

  // 3. Options : 4 réponses, distinctes et non vides
  if (Array.isArray(q.options)) {
    if (q.options.length !== 4) souci(`${q.options.length} options au lieu de 4`);
    if (q.options.some((o) => !o || !String(o).trim())) souci('option vide');
    const uniques = new Set(q.options.map(normaliser));
    if (uniques.size !== q.options.length) {
      souci('deux options identiques');
    }
  }

  // 4. Index de la bonne réponse
  if (!Number.isInteger(q.answer) || !q.options || q.answer !== 0) {
    souci(`answer invalide : ${q.answer} (doit être 0 dans la banque brute)`);
  }

  // 5. Pas de doublon de question
  const cle = normaliser((q.ref || '') + '|' + (q.q || ''));
  if (vus.has(cle)) souci(`question en double (déjà posée en ${vus.get(cle)})`);
  else vus.set(cle, `${q.ref || `#${i + 1}`} (Niv ${q.level})`);

  // 6. Règle d'or : la réponse ne doit pas figurer dans le verset affiché
  if (q.verset && Array.isArray(q.options)) {
    const verset = normaliser(q.verset);
    q.options.forEach((option, j) => {
      const texte = normaliser(option);
      if (!texte) return;
      if (verset.includes(texte)) {
        souci(`la réponse ${String.fromCharCode(65 + j)} « ${option} » est lisible dans le verset affiché`);
      }
    });
  }

  // 7. Un verset affiché doit être tronqué (…) ou troué (___)
  if (q.verset && !/…|___|\.\.\./.test(q.verset) && !/^\(/.test(q.verset)) {
    souci('verset affiché sans troncature (…) ni trou (___)');
  }

  themes[q.theme] = (themes[q.theme] || 0) + 1;
});

// Vérification de la complétude des 10 niveaux (minimum 10 questions par niveau)
for (let lvl = 1; lvl <= 10; lvl++) {
  const count = niveaux[lvl] || 0;
  if (count < 10) {
    erreurs.push(`Niveau ${lvl} : seulement ${count} questions (minimum 10 requis pour les tirages de 10 questions)`);
  }
}

console.log(`\n================ CONTRÔLE DE LA BANQUE ===============`);
console.log(`Total questions : ${BANQUE_QUESTIONS.length}`);
console.log(`\nRépartition par Niveau (10 niveaux) :`);
for (let lvl = 1; lvl <= 10; lvl++) {
  const meta = NIVEAUX_DEFI && NIVEAUX_DEFI[lvl - 1] ? NIVEAUX_DEFI[lvl - 1] : { titre: `Niveau ${lvl}` };
  const count = niveaux[lvl] || 0;
  console.log(`  · Niveau ${lvl.toString().padStart(2, ' ')} [${count} Qs] : ${meta.titre} (${meta.livre || ''})`);
}

console.log(`\nRépartition par Thème :`);
Object.keys(themes).sort().forEach((t) => {
  const n = themes[t];
  console.log(`  · ${t} : ${n} (${Math.round((n / BANQUE_QUESTIONS.length) * 100)} %)`);
});

if (erreurs.length === 0) {
  console.log('\n✅ SUCCÈS : Aucun problème détecté. Les 10 niveaux sont parfaitement opérationnels !');
  process.exit(0);
}

console.log(`\n❌ ${erreurs.length} problème(s) détecté(s) :`);
erreurs.forEach((e) => console.log('  - ' + e));
process.exit(1);
