import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  MYSTERY_VERSES_POOL,
  BIBLE_WHO_AM_I_CHARACTERS,
  BIBLE_CHRONOLOGY_LEVELS,
  WORD_PAIRS_CATEGORIES,
  TREASURE_RIDDLE_ADVENTURES,
  LISTEN_AND_RECOGNIZE_ITEMS,
  CHARACTER_JOURNEYS_DATA,
  EXTENDED_BIBLE_CHAPTERS,
  BOOK_INTRODUCTIONS,
  THEMATIC_PATHS_DATA
} from "../src/data/bibleGamesData.js";

import {
  MYSTERY_VERSE_MODES,
  buildMysteryVerseChallenge,
  evaluateMysteryVerseAnswer,
  getWhoAmIChallenge,
  scoreWhoAmI,
  buildChronologyRound,
  evaluateChronologyOrder,
  buildWordPairsRound,
  evaluateTreasureStep,
  getTreasureAdventure,
  getListenAndRecognizeItem,
  getDailyChallenge,
  generateDuelCode,
  createAsyncDuelSession,
  encodeDuelInvitePayload,
  decodeDuelInvitePayload,
  compareDuelResults,
  getCharacterJourney
} from "../src/services/gamesEngine.js";

import {
  DAY_MS,
  MEMORIZATION_STAGES,
  createMemorizationCard,
  buildInitialsPrompt,
  evaluateVerseRecall,
  recordMemorizationAttempt,
  buildUnifiedMemorizationList,
  getMemorizationDashboardStats
} from "../src/services/memorizationEngine.js";

import {
  HONORARY_TITLES,
  getCurrentHonoraryTitle,
  getCollectionsStatus,
  getActiveMissions,
  getEpochChests
} from "../src/services/gamificationEngine.js";

import {
  PEDAGOGICAL_PROFILES,
  computeAdaptiveDifficulty
} from "../src/services/accessibilitySettings.js";

import {
  NOTIFICATION_CATEGORIES,
  isWithinQuietHours,
  generateSmartNotifications
} from "../src/services/notificationsEngine.js";

import { COLLECTIVE_CHALLENGES } from "../src/services/churchGroupCloud.js";
import { buildChurchAdminMetrics, getPedagogicalDifficultyInsights } from "../src/services/adminAnalytics.js";
import { DATA_SCHEMA_VERSION, migratePelerinProfileV2, reconcilePelerinData } from "../src/services/dataReconciliation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(appRoot, "..");

test("V2.0 Schéma & Migration — préserve intégralement les acquis V1", () => {
  const v1 = {
    completedStages: [1, 2, 3],
    xp: 120,
    pearls: 6,
    streak: 4,
    leitnerCards: { "Jean 3:16": { ref: "Jean 3:16", box: 2, texte: "Car Dieu a tant aimé le monde..." } }
  };
  const migrated = migratePelerinProfileV2(v1);
  assert.equal(migrated.schemaVersion, DATA_SCHEMA_VERSION);
  assert.deepEqual(migrated.completedStages, [1, 2, 3]);
  assert.equal(migrated.xp, 120);
  assert.equal(migrated.pearls, 6);
  assert.equal(migrated.pedagogicalProfile, "explorateur");
  assert.ok(Array.isArray(migrated.unlockedChests));
  assert.ok(migrated.memorizationCards && typeof migrated.memorizationCards === "object");

  const cloud = {
    saved: {
      completedStages: [1, 2, 4],
      xp: 140,
      pearls: 8,
      unlockedChests: ["chest-racines-half"],
      dailyChallengeHistory: { "2026-11-14": { score: 5, total: 5 } }
    }
  };
  const reconciled = reconcilePelerinData({ saved: migrated }, cloud);
  assert.deepEqual(reconciled.completedStages.sort((a, b) => a - b), [1, 2, 3, 4]);
  assert.equal(reconciled.xp, 140);
  assert.ok(reconciled.saved.unlockedChests.includes("chest-racines-half"));
  assert.ok(reconciled.saved.dailyChallengeHistory["2026-11-14"]);
});

test("V2.0 Données bibliques LSG 1910 — intégrité des corpus et références", () => {
  assert.ok(MYSTERY_VERSES_POOL.length >= 20);
  MYSTERY_VERSES_POOL.forEach((v) => {
    assert.ok(v.ref && v.texte && v.explication);
    assert.ok(Array.isArray(v.missingWords) && v.missingWords.length >= 2);
  });

  // Vérification exacte de Josué 1:9 LSG 1910
  const jos19 = MYSTERY_VERSES_POOL.find((v) => v.id === "mv-jos-1-9");
  assert.ok(jos19.texte.includes("Fortifie-toi et prends courage"));
  assert.ok(jos19.texte.includes("dans tout ce que tu entreprendras"));

  assert.ok(BIBLE_WHO_AM_I_CHARACTERS.length >= 15);
  assert.ok(BIBLE_CHRONOLOGY_LEVELS.length >= 6);
  assert.ok(WORD_PAIRS_CATEGORIES.length >= 6);
  assert.ok(TREASURE_RIDDLE_ADVENTURES.length >= 4);
  assert.ok(LISTEN_AND_RECOGNIZE_ITEMS.length >= 8);
  assert.ok(CHARACTER_JOURNEYS_DATA.length >= 10);
  assert.equal(Object.keys(EXTENDED_BIBLE_CHAPTERS).length, 10);
  assert.ok(Object.keys(BOOK_INTRODUCTIONS).length >= 16);
  assert.equal(THEMATIC_PATHS_DATA.length, 6);
});

test("V2.0 Jeu 1 (Verset Mystère) — les 6 modes fonctionnent et valident fidèlement", () => {
  assert.equal(MYSTERY_VERSE_MODES.length, 6);

  const missingChallenge = buildMysteryVerseChallenge(0, "missing_words", "t1");
  const expectedAnswers = missingChallenge.blanks.map((b) => b.expected);
  assert.equal(evaluateMysteryVerseAnswer(missingChallenge, expectedAnswers).valid, true);
  assert.equal(evaluateMysteryVerseAnswer(missingChallenge, ["faux"]).valid, false);

  const orderChallenge = buildMysteryVerseChallenge(1, "order_words", "t2");
  assert.equal(evaluateMysteryVerseAnswer(orderChallenge, orderChallenge.tokensCorrects).valid, true);

  const refChallenge = buildMysteryVerseChallenge(2, "find_reference", "t3");
  assert.equal(evaluateMysteryVerseAnswer(refChallenge, refChallenge.verse.ref).valid, true);

  const noModel = buildMysteryVerseChallenge(0, "reconstruct_no_model", "t4");
  assert.equal(evaluateMysteryVerseAnswer(noModel, "Au commencement Dieu crea les cieux et la terre").valid, true);

  const defChallenge = buildMysteryVerseChallenge(0, "definition_word", "t5");
  assert.equal(evaluateMysteryVerseAnswer(defChallenge, defChallenge.expectedWord).valid, true);
});

test("V2.0 Jeux 2 à 9 — Qui suis-je, Chronologie, Paires, Trésor, Audio, Défi du Jour, Duel, Personnages", () => {
  // Qui suis-je
  const wai = getWhoAmIChallenge(0);
  assert.equal(wai.shuffledOptions.includes(wai.reponse), true);
  assert.ok(scoreWhoAmI(1).xp > scoreWhoAmI(3).xp);

  // Chronologie
  const chrono = buildChronologyRound(0, "seed");
  assert.notDeepEqual(chrono.shuffledEvents.map((e) => e.id), chrono.events.map((e) => e.id));
  assert.equal(evaluateChronologyOrder(chrono, chrono.events.map((e) => e.id)).valid, true);

  // Paires
  const pairs = buildWordPairsRound(1, "seed");
  assert.equal(pairs.leftItems.length, pairs.rightItems.length);

  // Énigme du Trésor
  const adv = getTreasureAdventure(0);
  assert.equal(adv.enigmes.length, 3);
  const lastStep = evaluateTreasureStep(adv, 2, adv.enigmes[2].correctIndex);
  assert.equal(lastStep.valid, true);
  assert.equal(lastStep.completed, true);

  // Écoute et Reconnais
  const listen = getListenAndRecognizeItem(0);
  assert.ok(listen.audioText && listen.shuffledOptions.some((o) => o.isCorrect));

  // Défi du Jour (déterministe par date)
  const dailyA = getDailyChallenge("2026-11-14");
  const dailyB = getDailyChallenge("2026-11-14");
  assert.equal(dailyA.questions.length, 5);
  assert.deepEqual(dailyA.questions.map((q) => q.id), dailyB.questions.map((q) => q.id));

  // Duel Biblique Asynchrone (encodage/décodage fiable)
  const code = generateDuelCode("test");
  assert.equal(code.length, 6);
  const duel = createAsyncDuelSession(code, "Arsène", null);
  assert.equal(duel.questions.length, 5);
  const token = encodeDuelInvitePayload({ code, challengerName: "Arsène", score: 4, total: 5 });
  const decoded = decodeDuelInvitePayload(token);
  assert.equal(decoded.code, code);
  assert.equal(decoded.score, 4);
  assert.equal(compareDuelResults(4, 5, "Arsène", "Marie").winner, "opponent");

  // Parcours des Personnages
  const journey = getCharacterJourney(0);
  assert.ok(journey.versets.length >= 2 && journey.questions.length >= 2);
});

test("V2.0 Mémorisation 4 étapes — interdit la maîtrise durable immédiate (< 24h) et valide après délai réel", () => {
  assert.equal(MEMORIZATION_STAGES.length, 4);
  const t0 = Date.UTC(2026, 10, 1, 9, 0, 0);
  let card = createMemorizationCard(MYSTERY_VERSES_POOL[0], t0);
  assert.equal(card.stage, 1);
  assert.equal(card.masteredDurably, false);

  // Rappel des initiales & évaluation souple
  const initials = buildInitialsPrompt("Au commencement, Dieu créa les cieux et la terre.");
  assert.ok(initials.includes("A…") && initials.includes("D…"));
  assert.equal(evaluateVerseRecall(card.texte, "Au commencement Dieu crea les cieux et la terre").passed, true);

  // 3 réussites LE MÊME JOUR (< 24h) ne doivent JAMAIS accorder masteredDurably
  card = recordMemorizationAttempt(card, true, t0 + 1000 * 60 * 10);
  card = recordMemorizationAttempt(card, true, t0 + 1000 * 60 * 20);
  card = recordMemorizationAttempt(card, true, t0 + 1000 * 60 * 30);
  assert.equal(card.stage, 3);
  assert.equal(card.passed24h, false);
  assert.equal(card.masteredDurably, false);

  // Vérification différée réelle >= 24h puis >= 7 jours
  card = recordMemorizationAttempt(card, true, t0 + 2 * DAY_MS);
  assert.equal(card.passed24h, true);
  assert.equal(card.stage, 4);
  card = recordMemorizationAttempt(card, true, t0 + 8 * DAY_MS);
  assert.equal(card.passed7d, true);
  assert.equal(card.masteredDurably, true);

  // Unification avec cartes Leitner V1 existantes + Dashboard stats
  const unified = buildUnifiedMemorizationList({ [card.ref]: card }, { "Jean 3:16": { ref: "Jean 3:16", box: 1, texte: "Car Dieu..." } });
  assert.equal(unified.length, 2);
  const dash = getMemorizationDashboardStats({ [card.ref]: card }, {}, t0 + 8 * DAY_MS);
  assert.equal(dash.masteredCount, 1);
  assert.equal(dash.evaluations24h, 1);
});

test("V2.0 Gamification — titres, collections, missions, coffres d'époque", () => {
  assert.equal(HONORARY_TITLES.length, 6);
  const rank = getCurrentHonoraryTitle({ xp: 800, stagesCount: 28, memorizedCount: 6 });
  assert.equal(rank.current.id, "connaisseur-ecritures");
  assert.equal(rank.next.id, "gardien-versets");

  const collections = getCollectionsStatus({
    charactersPlayed: 3,
    masteredBooksCount: 5,
    versesAnchored: 2,
    chestsCount: 0,
    stagesCount: 15,
    epochsCount: 2
  });
  assert.equal(collections.length, 6);
  assert.equal(collections.filter((c) => c.unlocked).length, 4);

  const missions = getActiveMissions({ todayChallengeDone: true, dueMemorizationCount: 0, stagesToday: 1 });
  assert.equal(missions.length, 5);
  assert.equal(missions[0].done, true);

  const chests = getEpochChests("racines", [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }], [1, 2], []);
  assert.equal(chests[0].ready, true);
  assert.equal(chests[1].ready, false);
});

test("V2.0 Notifications Intelligentes — plage silencieuse, quota quotidien, suppression si fait aujourd'hui, retour doux", () => {
  assert.equal(NOTIFICATION_CATEGORIES.length, 7);
  assert.equal(isWithinQuietHours(23, 21, 7), true);
  assert.equal(isWithinQuietHours(4, 21, 7), true);
  assert.equal(isWithinQuietHours(10, 21, 7), false);

  const midday = Date.UTC(2026, 10, 14, 10, 0, 0);
  const todayDay = Math.floor(midday / DAY_MS);

  // Heures silencieuses : 0 génération
  const silentRes = generateSmartNotifications(
    { localHour: 22, streak: 5, dueMemorizationCount: 2 },
    undefined,
    [],
    midday
  );
  assert.equal(silentRes.generated.length, 0);

  // Activité non faite + absence 4 jours -> respecte plafond maxDaily = 2 et déduplique
  const res1 = generateSmartNotifications(
    { localHour: 10, lastActiveDay: todayDay - 4, streak: 3, dueMemorizationCount: 2 },
    { maxDaily: 2, quietStartHour: 21, quietEndHour: 7 },
    [],
    midday
  );
  assert.equal(res1.generated.length, 2);
  assert.equal(res1.generated[0].category, "warm_return");

  // Un deuxième appel dans la même journée ne dépasse pas maxDaily et ne duplique pas
  const res2 = generateSmartNotifications(
    { localHour: 11, lastActiveDay: todayDay - 4, streak: 3, dueMemorizationCount: 2 },
    { maxDaily: 2, quietStartHour: 21, quietEndHour: 7 },
    res1.notifications,
    midday + 3600 * 1000
  );
  assert.equal(res2.generated.length, 0);

  // Si déjà complété aujourd'hui : pas de rappel quotidien ou de série
  const completedRes = generateSmartNotifications(
    { localHour: 10, lastActiveDay: todayDay, completedToday: true, streak: 5 },
    { maxDaily: 2, quietStartHour: 21, quietEndHour: 7 },
    [],
    midday
  );
  assert.equal(completedRes.generated.length, 0);
});

test("V2.0 Accessibilité, Communauté & Administration Responsables sans fuite de données privées", () => {
  assert.equal(PEDAGOGICAL_PROFILES.length, 3);
  assert.equal(computeAdaptiveDifficulty("explorateur", 45).level, "bienveillant");
  assert.equal(computeAdaptiveDifficulty("expert", 92).level, "approfondi");

  assert.equal(COLLECTIVE_CHALLENGES.length, 4);

  const metrics = buildChurchAdminMetrics({
    leaderboard: [{ nom: "A", xp: 100, stagesValidees: 5 }],
    groups: [{ code: "ISSIA1" }],
    prayers: [{ id: "p1", signaux: 0 }, { id: "p2", signaux: 1 }],
    memorizationStats: { masteredCount: 3, successRate: 85 },
    completedStages: [1, 2],
    gameStats: { mystery: 4, daily: 1 }
  });
  assert.equal(metrics.activePilgrims, 1);
  assert.equal(metrics.reportedPrayersCount, 1);
  assert.equal(metrics.gamesPlayed, 5);

  const insights = getPedagogicalDifficultyInsights([1, 2], { racines: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] });
  assert.equal(insights[0].completionPct, 50);
});

test("V2.0 Firestore rules — racine et grand_pelerinage_v1 identiques avec collections V2", () => {
  const rootRules = fs.readFileSync(path.join(repoRoot, "firestore.rules"), "utf8");
  const subRules = fs.readFileSync(path.join(appRoot, "firestore.rules"), "utf8");
  assert.equal(rootRules, subRules);
  assert.ok(rootRules.includes("/notifications/{notifId}"));
  assert.ok(rootRules.includes("/fcm_tokens/{tokenId}"));
  assert.ok(rootRules.includes("/groupes_eglise/{groupCode}"));
  assert.ok(rootRules.includes("/duels_bibliques/{duelId}"));
  assert.ok(rootRules.includes("/annonces_eglise/{annonceId}"));
});

