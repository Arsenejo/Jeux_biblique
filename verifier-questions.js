/* Contrôle de la banque de questions — « node verifier-questions.js »
   ---------------------------------------------------------------
   Vérifie les règles d'écriture de questions.js. À relancer après
   CHAQUE ajout de question. Sort en code 1 si une règle est violée.

   Règle la plus importante : la bonne réponse ne doit jamais être
   lisible dans le texte du verset affiché au joueur.
*/

const fs = require('fs');
const path = require('path');

const fichier = path.join(__dirname, 'questions.js');
const code = fs.readFileSync(fichier, 'utf8');
const BANQUE_QUESTIONS = new Function(code + '\nreturn BANQUE_QUESTIONS;')();

const erreurs = [];
const themes = {};
const vus = new Map();

// Normalisation pour comparer deux textes sans se soucier de la
// ponctuation, des accents ou des majuscules.
function normaliser(texte) {
  return String(texte)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

BANQUE_QUESTIONS.forEach((q, i) => {
  const lieu = `Question ${i + 1} (${q.ref || 'sans référence'})`;
  const souci = (message) => erreurs.push(`${lieu} : ${message}`);

  // 1. Champs obligatoires
  if (!q.theme) souci('thème manquant');
  if (!q.ref) souci('référence manquante');
  if (!q.q) souci('énoncé manquant');
  if (!Array.isArray(q.options)) souci('options absentes');

  // 2. Options : 4 réponses, distinctes et non vides
  if (Array.isArray(q.options)) {
    if (q.options.length !== 4) souci(`${q.options.length} options au lieu de 4`);
    if (q.options.some((o) => !o || !String(o).trim())) souci('option vide');
    const uniques = new Set(q.options.map(normaliser));
    if (uniques.size !== q.options.length) {
      souci('deux options identiques (le mélange retrouve la réponse par sa valeur)');
    }
  }

  // 3. Index de la bonne réponse valide
  if (!Number.isInteger(q.answer) || !q.options || q.answer < 0 || q.answer >= q.options.length) {
    souci(`answer invalide : ${q.answer}`);
  }

  // 4. Pas de doublon de question
  const cle = normaliser((q.ref || '') + '|' + (q.q || ''));
  if (vus.has(cle)) souci(`question en double (déjà posée en ${vus.get(cle)})`);
  else vus.set(cle, q.ref || `#${i + 1}`);

  // 5. LA règle d'or : la réponse ne doit pas figurer dans le verset affiché
  if (q.verset && Array.isArray(q.options) && Number.isInteger(q.answer)) {
    const verset = normaliser(q.verset);
    q.options.forEach((option, j) => {
      const texte = normaliser(option);
      if (!texte) return;
      if (verset.includes(texte)) {
        souci(`la réponse ${String.fromCharCode(65 + j)} « ${option} » est lisible dans le verset affiché`);
      }
    });
  }

  // 6. Un « compléter » doit afficher un texte tronqué ou troué
  if (q.verset && !/…|___|\.\.\./.test(q.verset) && !/^\(/.test(q.verset)) {
    souci('verset affiché sans troncature (…) ni trou (___) : la réponse est peut-être offerte');
  }

  // 7. Une explication est attendue partout
  if (!q.lecon) souci('explication (lecon) manquante');

  themes[q.theme] = (themes[q.theme] || 0) + 1;
});

console.log(`Banque : ${BANQUE_QUESTIONS.length} questions`);
Object.keys(themes).sort().forEach((t) => {
  const n = themes[t];
  console.log(`  · ${t} : ${n} (${Math.round((n / BANQUE_QUESTIONS.length) * 100)} %)`);
});

if (erreurs.length === 0) {
  console.log('\n✅ Aucun problème détecté.');
  process.exit(0);
}

console.log(`\n❌ ${erreurs.length} problème(s) :`);
erreurs.forEach((e) => console.log('  - ' + e));
process.exit(1);
