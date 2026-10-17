import test from "node:test";
import assert from "node:assert/strict";

import {
  reconcilePelerinData,
  reconcileCarnetNotes,
  reconcilePrayers
} from "../src/services/dataReconciliation.js";

import {
  validatePrayerContent,
  reportPrayerLocally,
  getReportedPrayerIds
} from "../src/services/moderation.js";

import {
  BIBLE_CHAPTERS,
  EPOCH_STAGES,
  BIBLE_BOOKS
} from "../src/data/bibleData.js";

// =========================================================================
// PILIER 1 & 3 : SYNCHRONISATION MULTI-APPAREILS & RÉSILIENCE HORS-LIGNE
// =========================================================================
test("Pilier 1 & 3: Réconciliation multi-appareils sans perte d'étapes (Union mathématique)", () => {
  const localOfflineDevice = {
    profileName: "Pèlerin Voyageur",
    xp: 80,
    pearls: 3,
    streak: 4,
    completedStages: [1, 2], // Terminé hors-ligne sur appareil A
    leitnerCards: [
      { id: "c1", ref: "Genèse 1:1", box: 2, lastReviewed: 1000 },
      { id: "c2", ref: "Psaume 23:1", box: 1, lastReviewed: 1100 }
    ],
    anchoredVerses: ["Genèse 1:1"]
  };

  const cloudDevice = {
    profileName: "Pèlerin Voyageur",
    xp: 120,
    pearls: 2,
    streak: 3,
    completedStages: [1, 3], // Terminé sur appareil B connecté
    leitnerCards: [
      { id: "c1", ref: "Genèse 1:1", box: 1, lastReviewed: 900 },
      { id: "c3", ref: "Jean 1:1", box: 1, lastReviewed: 1200 }
    ],
    anchoredVerses: ["Jean 1:1"]
  };

  const merged = reconcilePelerinData(localOfflineDevice, cloudDevice);

  // 1. Les étapes doivent être l'union stricte [1, 2, 3] sans perte de l'étape 2 hors-ligne
  assert.deepEqual(merged.completedStages.sort((a, b) => a - b), [1, 2, 3]);

  // 2. L'XP doit prendre le maximum (120) et les perles le maximum (3)
  assert.equal(merged.xp, 120);
  assert.equal(merged.pearls, 3);
  assert.equal(merged.streak, 4);

  // 3. Jardin Leitner : la boîte la plus avancée doit être conservée pour c1 (box 2)
  const cardC1 = merged.leitnerCards.find((c) => c.id === "c1");
  assert.equal(cardC1.box, 2);

  // 4. Les nouvelles cartes ajoutées sur l'un ou l'autre appareil sont fusionnées
  assert.equal(merged.leitnerCards.length, 3);
  assert.deepEqual(merged.anchoredVerses.sort(), ["Genèse 1:1", "Jean 1:1"]);
});

test("Pilier 1 & 3: Réconciliation du Carnet spirituel personnel (Zéro doublon & confidentialité)", () => {
  const localNotes = [
    { id: "n1", date: "17 Oct", texte: "Prière du matin dans le secret", source: "Genèse 1" },
    { id: "n2", date: "17 Oct", texte: "Gratitude pour le pain quotidien", source: "Jean 6" }
  ];

  const cloudNotes = [
    { id: "n1", date: "17 Oct", texte: "Prière du matin dans le secret", source: "Genèse 1" },
    { id: "n3", date: "16 Oct", texte: "Méditation du soir", source: "Psaume 23" }
  ];

  const mergedNotes = reconcileCarnetNotes(localNotes, cloudNotes);

  // Doit contenir exactement 3 notes (n1 dédoublonnée, n2 et n3 conservées)
  assert.equal(mergedNotes.length, 3);
  const ids = mergedNotes.map((n) => n.id);
  assert.ok(ids.includes("n1"));
  assert.ok(ids.includes("n2"));
  assert.ok(ids.includes("n3"));
});

test("Pilier 1 & 3: Réconciliation des prières communautaires avec soutien incrémenté", () => {
  const localPrayers = [
    { id: "p1", auteur: "Marie", texte: "Prière pour la paix", soutiens: 2 }
  ];
  const cloudPrayers = [
    { id: "p1", auteur: "Marie", texte: "Prière pour la paix", soutiens: 5 },
    { id: "p2", auteur: "Luc", texte: "Guérison de ma sœur", soutiens: 1 }
  ];

  const merged = reconcilePrayers(localPrayers, cloudPrayers);
  assert.equal(merged.length, 2);

  // Le nombre de soutiens maximal doit être conservé
  const p1 = merged.find((p) => p.id === "p1");
  assert.equal(p1.soutiens, 5);
});

// =========================================================================
// PILIER 4 : MODÉRATION FRATERNELLE & PROTECTION DE LA VIE PRIVÉE / MINEURS
// =========================================================================
test("Pilier 4: Blocage des numéros de téléphone (Protection des mineurs & vie privée)", () => {
  const testCases = [
    "Appelez-moi au 06 12 34 56 78 pour prier",
    "Mon whatsapp est +33612345678",
    "Contact au 01.23.45.67.89",
    "Mon tel: 07-11-22-33-44"
  ];

  for (const text of testCases) {
    const res = validatePrayerContent(text, "Pèlerin");
    assert.equal(res.valid, false);
    assert.match(res.reason, /coordonnées personnelles|numéro de téléphone/i);
  }
});

test("Pilier 4: Blocage des adresses e-mail", () => {
  const res = validatePrayerContent("Écrivez-moi sur contact@eglise-partage.fr", "Pèlerin");
  assert.equal(res.valid, false);
  assert.match(res.reason, /e-mail/i);
});

test("Pilier 4: Blocage des liens web et publicités", () => {
  const testCases = [
    "Visitez https://monsite-donations.org",
    "Achetez mes cours sur www.promo-foi.com",
    "Rejoignez http://groupe.me/prière"
  ];

  for (const text of testCases) {
    const res = validatePrayerContent(text, "Pèlerin");
    assert.equal(res.valid, false);
    assert.match(res.reason, /liens externes/i);
  }
});

test("Pilier 4: Filtrage des propos blessants ou grossiers", () => {
  const res = validatePrayerContent("Cette communauté est nulle et vous êtes des idiots", "Pèlerin");
  assert.equal(res.valid, false);
  assert.match(res.reason, /bienveillance|respect/i);
});

test("Pilier 4: Validation positive d'une intention fraternelle sincère", () => {
  const res = validatePrayerContent(
    "Seigneur, je te confie ma famille et mes amis malades. Fortifie nos cœurs dans la paix.",
    "Marie"
  );
  assert.equal(res.valid, true);
  assert.equal(res.reason, "");
});

// =========================================================================
// PILIER 2 : FIABILISATION DU CONTENU BIBLIQUE (LOUIS SEGOND 1910)
// =========================================================================
test("Pilier 2: Fidélité textuelle absolue de la Louis Segond 1910", () => {
  // Genèse 1:1
  const gen1 = BIBLE_CHAPTERS["gen-1"];
  assert.ok(gen1, "Le chapitre Genèse 1 doit exister");
  const v1 = gen1.versets.find((v) => v.num === 1);
  assert.equal(v1.texte, "Au commencement, Dieu créa les cieux et la terre.");

  // Jean 1:1
  const jea1 = BIBLE_CHAPTERS["jea-1"];
  const vJea1 = jea1.versets.find((v) => v.num === 1);
  assert.equal(
    vJea1.texte,
    "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu."
  );

  // Jean 3:16
  const jea3 = BIBLE_CHAPTERS["jea-3"];
  const vJea16 = jea3.versets.find((v) => v.num === 16);
  assert.equal(
    vJea16.texte,
    "Car Dieu a tant aimé le monde qu'il a donné son Fils unique, afin que quiconque croit en lui ne périsse point, mais qu'il ait la vie éternelle."
  );

  // Psaume 23:1
  const psa23 = BIBLE_CHAPTERS["psa-23"];
  const vPsa1 = psa23.versets.find((v) => v.num === 1);
  assert.equal(vPsa1.texte, "L'Éternel est mon berger : je ne manquerai de rien.");
});

test("Pilier 2: Genèse 9:13 utilise le terme officiel Louis Segond 1910 « arc »", () => {
  const racines = EPOCH_STAGES.racines;
  const stageGen9 = racines.find((s) => s.ref === "Genèse 9:13");
  assert.ok(stageGen9, "L'étape Genèse 9:13 doit être présente dans les racines");
  assert.equal(stageGen9.motCorrect, "arc", "Le mot correct doit être « arc » selon la LSG 1910");
  assert.ok(stageGen9.options.includes("arc"), "Les options doivent inclure « arc »");
  assert.match(
    stageGen9.explication,
    /Louis Segond 1910/i,
    "L'explication doit éclairer le terme avec la LSG 1910"
  );
});

test("Pilier 2: Intégrité structurelle de tous les ateliers et étapes", () => {
  for (const [epochId, stages] of Object.entries(EPOCH_STAGES)) {
    assert.ok(stages.length > 0, `L'époque ${epochId} doit contenir des étapes`);
    for (const stage of stages) {
      assert.ok(stage.id > 0, `L'étape ${stage.id} doit avoir un ID positif`);
      assert.ok(stage.titre, `L'étape ${stage.id} doit avoir un titre`);
      assert.ok(stage.ref, `L'étape ${stage.id} doit comporter une référence biblique canonique`);
      assert.ok(
        stage.explication && stage.explication.length > 10,
        `L'étape ${stage.id} doit avoir une méditation spirituelle distincte`
      );
      assert.ok(
        stage.recompense && stage.recompense.xp > 0,
        `L'étape ${stage.id} doit avoir une récompense XP`
      );
    }
  }
});
