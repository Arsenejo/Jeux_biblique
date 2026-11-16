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
  getCharacterJourney,
  getDynamicMysteryVersesPool,
  getDynamicWhoAmIPool,
  getDynamicChronologyPool,
  getDynamicWordPairsPool,
  getDynamicListenPool
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
import { validatePrayerContent } from "../src/services/moderation.js";
import {
  SUPER_ADMIN_EMAIL,
  isRouteAdmin,
  verifyAdminCredentials,
  resetAdminRateLimitForTests,
  buildChurchAdminMetrics,
  getPedagogicalDifficultyInsights,
  publishChurchAnnouncement,
  deleteChurchAnnouncement,
  saveWeeklySpiritualConfig,
  createChurchCampaign,
  deleteChurchCampaign,
  addCustomBibleContent,
  deleteCustomBibleContent,
  saveDynamicBlacklist,
  upsertAdminMember,
  removeAdminMember,
  loadAdminAuditLogs,
  saveSystemFlags,
  loadGamesAdminConfig,
  saveGamesAdminConfig,
  DEFAULT_BLESSING_CARDS,
  DEFAULT_BLESSING_THEMES,
  loadBlessingsConfig,
  addAdminBlessingCard,
  deleteAdminBlessingCard,
  resetAdminBlessingCards,
  addAdminBlessingTheme,
  deleteAdminBlessingTheme,
  saveBlessingCardSettings,
  buildFullAdminBackupPayload,
  exportLeaderboardCsv
} from "../src/services/adminAnalytics.js";
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

test("V2.0 Responsivité Multi-Appareils — smartphones compacts, tablettes, grands écrans et mode paysage", () => {
  const indexHtml = fs.readFileSync(path.join(appRoot, "index.html"), "utf8");
  assert.ok(indexHtml.includes("viewport-fit=cover"), "index.html doit inclure viewport-fit=cover");

  const mainJsx = fs.readFileSync(path.join(appRoot, "src", "main.jsx"), "utf8");
  assert.ok(mainJsx.includes("profile-metrics-4"), "main.jsx doit utiliser profile-metrics-4 au lieu de 4 colonnes rigides en ligne");
  assert.ok(mainJsx.includes("profile-pseudo-row"), "main.jsx doit autoriser le retour à la ligne sur le champ pseudo");
  assert.ok(!mainJsx.includes('style={{ gridTemplateColumns: "repeat(4, 1fr)" }}'), "aucun style inline repeat(4, 1fr) figé ne doit rester dans main.jsx");

  const blessingModal = fs.readFileSync(path.join(appRoot, "src", "components", "BlessingShareModal.jsx"), "utf8");
  assert.ok(!blessingModal.includes('gridTemplateColumns: "1fr 1fr"'), "BlessingShareModal doit utiliser auto-fit min(100%, ...) au lieu de 1fr 1fr figé");

  const featuresDir = path.join(appRoot, "src", "features");
  const featureFiles = [
    "games/GamesHubView.jsx",
    "memorization/MemorizationHubModal.jsx",
    "notifications/NotificationCenterModal.jsx",
    "profile/PedagogicalAndAccessibilityCard.jsx",
    "community/CommunityGroupsV2.jsx",
    "bible/BibleStudyEnhancements.jsx",
    "admin/AdminPortalApp.jsx",
    "home/HomeDashboardV2.jsx"
  ];
  featureFiles.forEach((rel) => {
    const src = fs.readFileSync(path.join(featuresDir, rel), "utf8");
    const minmaxMatches = src.match(/minmax\((?:[^)(]+|\([^)(]*\))+\)/g) || [];
    minmaxMatches.forEach((m) => {
      assert.ok(m.includes("min(100%"), `${rel} doit borner minmax avec min(100%, ...): ${m}`);
    });
  });

  const stylesCss = fs.readFileSync(path.join(appRoot, "src", "styles.css"), "utf8");
  assert.ok(stylesCss.includes(".profile-metrics-4"));
  assert.ok(stylesCss.includes(".v2-setting-row"));
  assert.ok(stylesCss.includes("@media (min-width: 1440px)"));
  assert.ok(stylesCss.includes("@media (max-height: 540px) and (orientation: landscape)"));
  assert.ok(stylesCss.includes("max-width: calc(100vw - 210px)"));
});

test("Portail /admin isolé — routage strict, aucun accès public et authentification SHA-256 sécurisée", async () => {
  assert.equal(isRouteAdmin("/admin"), true);
  assert.equal(isRouteAdmin("/admin/"), true);
  assert.equal(isRouteAdmin("/"), false);
  assert.equal(isRouteAdmin("/fraternite"), false);

  const communityView = fs.readFileSync(
    path.join(appRoot, "src", "features", "community", "CommunityGroupsV2.jsx"),
    "utf8"
  );
  assert.equal(communityView.includes("Espace Responsables"), false, "Aucun bouton admin ne doit figurer dans la vue publique");

  // Aucun fichier dans src/ ne doit contenir le mot de passe en clair
  const secretStr = ["Password", "1234"].join("");
  const walkSrc = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walkSrc(full);
      else if (/\.(js|jsx)$/.test(entry.name)) {
        const content = fs.readFileSync(full, "utf8");
        assert.equal(content.includes(secretStr), false, `Aucun mot de passe en clair toléré dans ${entry.name}`);
      }
    }
  };
  walkSrc(path.join(appRoot, "src"));

  resetAdminRateLimitForTests();
  const wrongPw = await verifyAdminCredentials(SUPER_ADMIN_EMAIL, "MauvaisMotDePasse");
  assert.equal(wrongPw.ok, false);

  const wrongEmail = await verifyAdminCredentials("visiteur@example.com", secretStr);
  assert.equal(wrongEmail.ok, false);

  const valid = await verifyAdminCredentials(SUPER_ADMIN_EMAIL, secretStr);
  assert.equal(valid.ok, true);
  assert.equal(valid.session.role, "super_admin");
  assert.equal(valid.session.email, SUPER_ADMIN_EMAIL);

  // Rate limit anti-brute-force après 5 échecs consécutifs
  resetAdminRateLimitForTests();
  for (let i = 0; i < 5; i += 1) {
    await verifyAdminCredentials(SUPER_ADMIN_EMAIL, `bad-${i}`, 1000000 + i * 100);
  }
  const locked = await verifyAdminCredentials(SUPER_ADMIN_EMAIL, secretStr, 1001000);
  assert.equal(locked.ok, false);
  assert.equal(locked.rateLimited, true);
  resetAdminRateLimitForTests();
});

test("Portail /admin 10 piliers & Règles Firestore isAdmin() — CMS, modération dynamique, RBAC, audit et backup", async () => {
  const prevLS = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };

  try {
    // Piliers 2 & 3 : Annonces, Pilotage Hebdo, Campagnes
    const annRes = await publishChurchAnnouncement({ titre: "Veillée", texte: "Vendredi à 19h à Issia", epingle: true });
    assert.equal(annRes.ok, true);
    const remainingAnn = await deleteChurchAnnouncement(annRes.item.id);
    assert.equal(remainingAnn.length, 0);

    const weekly = await saveWeeklySpiritualConfig({ versetRef: "Jean 15:5", versetTexte: "Je suis le cep, vous êtes les sarments.", objectifSemaine: "Demeurer en Christ" });
    assert.equal(weekly.versetRef, "Jean 15:5");

    const camp = await createChurchCampaign({ titre: "Camp Jeunesse", livreCible: "Jean" });
    assert.equal(camp.ok, true);
    assert.equal((await deleteChurchCampaign(camp.campaign.id)).length, 0);

    // Pilier 4 : CMS Biblique validé contre les 66 livres canoniques + enrichissement de Verset Mystère
    const badBook = await addCustomBibleContent({ type: "verset", livre: "LivreInexistant", ref: "Test 1:1", texte: "Texte fictif suffisamment long" });
    assert.equal(badBook.ok, false);
    const goodVerse = await addCustomBibleContent({
      type: "verset",
      livre: "Romains",
      ref: "Romains 8:28",
      texte: "Nous savons, du reste, que toutes choses concourent au bien de ceux qui aiment Dieu."
    });
    assert.equal(goodVerse.ok, true);
    assert.ok(getDynamicMysteryVersesPool().length > MYSTERY_VERSES_POOL.length);
    assert.equal((await deleteCustomBibleContent(goodVerse.item.id)).length, 0);

    // Pilier 5 : Liste noire dynamique reliée à moderation.js
    await saveDynamicBlacklist(["arnaquefake", "fauxconcours"]);
    const modCheck = validatePrayerContent("Rejoignez vite notre fauxconcours de prière", "Visiteur");
    assert.equal(modCheck.valid, false);

    // Pilier 9 : RBAC & Journal d'audit
    const addedAdmin = await upsertAdminMember({ email: "moniteur@eeag-issia.org", nom: "Pasteur Koffi", role: "enseignant" });
    assert.equal(addedAdmin.ok, true);
    assert.equal((await removeAdminMember(SUPER_ADMIN_EMAIL)).ok, false);
    assert.equal((await removeAdminMember("moniteur@eeag-issia.org")).ok, true);
    assert.ok(loadAdminAuditLogs().length > 0);

    // Pilier 10 : Feature Flags & Backup JSON / CSV
    const flags = await saveSystemFlags({ maintenanceMode: true, prayersEnabled: false });
    assert.equal(flags.maintenanceMode, true);
    assert.equal(flags.prayersEnabled, false);
    const backup = buildFullAdminBackupPayload({ leaderboardCount: 1 });
    assert.equal(backup.systemFlags.maintenanceMode, true);
    const csv = exportLeaderboardCsv([{ nom: "David", xp: 150, pearls: 4, stagesValidees: 5 }]);
    assert.ok(csv.includes('"David",150,4,5'));

    // Vérification Firestore rules isAdmin() et collections admin
    const rules = fs.readFileSync(path.join(repoRoot, "firestore.rules"), "utf8");
    assert.ok(rules.includes("function isAdmin()"));
    assert.ok(rules.includes("admins_eglise"));
    assert.ok(rules.includes("contenus_bibliques"));
    assert.ok(rules.includes("campagnes_eglise"));
    assert.ok(rules.includes("config_eglise"));
    assert.ok(rules.includes("audit_logs"));
  } finally {
    if (prevLS === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = prevLS;
  }
});

test("Pilier 11 /admin — Studio des Jeux : activation, vedette, multiplicateur XP et niveaux personnalisés", async () => {
  const prevLS = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };

  try {
    const savedCfg = await saveGamesAdminConfig({
      enabledGames: { daily: true, duel: false, listen: true },
      featuredGameId: "whoami",
      xpMultiplier: 2
    });
    assert.equal(savedCfg.enabledGames.duel, false);
    assert.equal(savedCfg.enabledGames.listen, true);
    assert.equal(savedCfg.featuredGameId, "whoami");
    assert.equal(savedCfg.xpMultiplier, 2);

    const loadedCfg = loadGamesAdminConfig();
    assert.equal(loadedCfg.featuredGameId, "whoami");
    assert.equal(loadedCfg.xpMultiplier, 2);
    assert.equal(loadedCfg.enabledGames.duel, false);

    // Création de contenus personnalisés pour Qui suis-je ?, Écoute, Chronologie et Paires
    const waiRes = await addCustomBibleContent({
      type: "whoami",
      livre: "Juges",
      ref: "Juges 7:16",
      reponse: "Gédéon",
      indices: [
        "Dieu réduisit mon armée à trois cents hommes.",
        "Nous avons sonné de la trompette et brisé des cruches.",
        "Une toison mouillée puis sèche confirma ma mission."
      ],
      options: ["Gédéon", "Samson", "Josué", "Saül"],
      explication: "Gédéon délivra Israël avec 300 vaillants hommes (Juges 7)."
    });
    assert.equal(waiRes.ok, true);
    const waiPool = getDynamicWhoAmIPool();
    assert.equal(waiPool.length, BIBLE_WHO_AM_I_CHARACTERS.length + 1);
    const waiRound = getWhoAmIChallenge(waiPool.length - 1);
    assert.equal(waiRound.reponse, "Gédéon");

    const listenRes = await addCustomBibleContent({
      type: "listen",
      livre: "Psaumes",
      ref: "Psaume 100:1",
      audioText: "Poussez vers l'Éternel des cris de joie, vous tous, habitants de la terre !",
      question: "Quel livre invite ainsi toute la terre à louer l'Éternel ?",
      options: ["Les Psaumes", "Les Proverbes", "L'Ecclésiaste", "Ésaïe"],
      correctIndex: 0
    });
    assert.equal(listenRes.ok, true);
    const listenPool = getDynamicListenPool();
    assert.equal(listenPool.length, LISTEN_AND_RECOGNIZE_ITEMS.length + 1);
    const listenItem = getListenAndRecognizeItem(listenPool.length - 1);
    assert.equal(listenItem.ref, "Psaume 100:1");

    const chronoRes = await addCustomBibleContent({
      type: "chrono",
      livre: "Actes des Apôtres",
      ref: "Actes 9–15",
      titre: "Ministère de l'apôtre Paul",
      events: [
        { id: "c1", label: "Conversion sur le chemin de Damas", ref: "Actes 9:3" },
        { id: "c2", label: "Premier voyage missionnaire à Chypre", ref: "Actes 13:4" },
        { id: "c3", label: "Concile de Jérusalem", ref: "Actes 15:6" }
      ]
    });
    assert.equal(chronoRes.ok, true);
    const chronoPool = getDynamicChronologyPool();
    assert.equal(chronoPool.length, BIBLE_CHRONOLOGY_LEVELS.length + 1);
    const chronoRound = buildChronologyRound(chronoPool.length - 1, "test-seed");
    assert.equal(chronoRound.titre, "Ministère de l'apôtre Paul");

    const pairsRes = await addCustomBibleContent({
      type: "pairs",
      livre: "1 Rois",
      ref: "1 Rois 3–18",
      titre: "Prophètes et événements",
      pairs: [
        { id: "p1", left: "Élie", right: "Sacrifice au mont Carmel" },
        { id: "p2", left: "Élisée", right: "Guérison de Naaman dans le Jourdain" },
        { id: "p3", left: "Nathan", right: "Parabole de la brebis devant David" }
      ]
    });
    assert.equal(pairsRes.ok, true);
    const pairsPool = getDynamicWordPairsPool();
    assert.equal(pairsPool.length, WORD_PAIRS_CATEGORIES.length + 1);
    const pairsRound = buildWordPairsRound(pairsPool.length - 1, "test-pairs");
    assert.equal(pairsRound.leftItems.length, 3);

    // Suppression propre
    for (const id of [waiRes.item.id, listenRes.item.id, chronoRes.item.id, pairsRes.item.id]) {
      await deleteCustomBibleContent(id);
    }
    assert.equal(getDynamicWhoAmIPool().length, BIBLE_WHO_AM_I_CHARACTERS.length);
  } finally {
    if (prevLS === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = prevLS;
  }
});

test("Pilier 12 /admin — Cartes de Bénédiction : catalogue LSG 1910, thèmes, paramètres & intégrité", async () => {
  const prevLS = globalThis.localStorage;
  const store = new Map();
  globalThis.localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k)
  };

  try {
    const initial = loadBlessingsConfig();
    assert.equal(initial.cards.length, DEFAULT_BLESSING_CARDS.length);
    assert.equal(initial.themes.length, DEFAULT_BLESSING_THEMES.length);

    // Ajout d'une carte LSG 1910 personnalisée
    const addedCard = await addAdminBlessingCard({
      ref: "Psaume 121:1-2",
      texte: "Je lève mes yeux vers les montagnes... D'où me viendra le secours ? Le secours me vient de l'Éternel, qui a fait les cieux et la terre.",
      theme: "Secours divin",
      message: "Le secours de l'Éternel veille sur toi."
    });
    assert.equal(addedCard.ok, true);
    assert.equal(addedCard.config.cards.length, DEFAULT_BLESSING_CARDS.length + 1);

    // Protection contre la suppression de la dernière carte active
    let current = addedCard.config;
    for (const c of current.cards.slice(1)) {
      const delRes = await deleteAdminBlessingCard(c.id);
      assert.equal(delRes.ok, true);
    }
    const lastRemainingCard = loadBlessingsConfig().cards[0];
    const blockedCardDel = await deleteAdminBlessingCard(lastRemainingCard.id);
    assert.equal(blockedCardDel.ok, false);

    // Ajout & suppression de thème + garde dernier thème
    const addedTheme = await addAdminBlessingTheme({
      nom: "Aube Royale",
      bg1: "#172554",
      bg2: "#0f172a",
      gold: "#f59e0b",
      accent: "#fde68a"
    });
    assert.equal(addedTheme.ok, true);
    assert.equal(addedTheme.config.themes.length, DEFAULT_BLESSING_THEMES.length + 1);

    for (const t of addedTheme.config.themes.slice(1)) {
      const delTheme = await deleteAdminBlessingTheme(t.id);
      assert.equal(delTheme.ok, true);
    }
    const lastRemainingTheme = loadBlessingsConfig().themes[0];
    const blockedThemeDel = await deleteAdminBlessingTheme(lastRemainingTheme.id);
    assert.equal(blockedThemeDel.ok, false);

    // Paramètres généraux + réinitialisation par défaut + backup
    const settingsSaved = await saveBlessingCardSettings({
      defaultDedication: "Que la faveur de Dieu t'accompagne toute la semaine !",
      churchSubtitle: "Assemblée de la Grâce — Issia",
      shareUrl: "https://jeux-eeag.vercel.app"
    });
    assert.equal(settingsSaved.defaultDedication, "Que la faveur de Dieu t'accompagne toute la semaine !");
    assert.equal(settingsSaved.churchSubtitle, "Assemblée de la Grâce — Issia");

    const resetCfg = await resetAdminBlessingCards();
    assert.equal(resetCfg.cards.length, DEFAULT_BLESSING_CARDS.length);
    assert.equal(resetCfg.themes.length, DEFAULT_BLESSING_THEMES.length);

    const backup = buildFullAdminBackupPayload({ leaderboardCount: 0 });
    assert.ok(backup.gamesConfig);
    assert.ok(backup.blessingsConfig);

    // Vérification UI /admin et BlessingShareModal
    const adminPortalSrc = fs.readFileSync(path.join(appRoot, "src", "features", "admin", "AdminPortalApp.jsx"), "utf8");
    assert.ok(adminPortalSrc.includes('id: "games"'));
    assert.ok(adminPortalSrc.includes('id: "blessings"'));
    const blessingModalSrc = fs.readFileSync(path.join(appRoot, "src", "components", "BlessingShareModal.jsx"), "utf8");
    assert.ok(blessingModalSrc.includes("loadBlessingsConfig"));
  } finally {
    if (prevLS === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = prevLS;
  }
});


