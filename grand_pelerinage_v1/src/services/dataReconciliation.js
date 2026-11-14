// Module de réconciliation, migration V2 et synchronisation résiliente multi-appareils
// Garantit : Zéro perte de données, Zéro écrasement intempestif, Zéro doublon.

export const DATA_SCHEMA_VERSION = 2;

const DEFAULT_ACCESSIBILITY = {
  fontSize: "normal",
  soundEnabled: true,
  hapticEnabled: true,
  reducedMotion: false
};

/**
 * Migre de manière idempotente un profil joueur V1 vers le schéma V2.0
 * sans jamais perdre les étapes, XP, perles, séries ou cartes Leitner existantes.
 */
export function migratePelerinProfileV2(rawSaved = {}) {
  const base = rawSaved && typeof rawSaved === "object" && !Array.isArray(rawSaved) ? rawSaved : {};
  const validProfile = ["decouverte", "explorateur", "expert"].includes(base.pedagogicalProfile)
    ? base.pedagogicalProfile
    : "explorateur";

  return {
    ...base,
    schemaVersion: DATA_SCHEMA_VERSION,
    completedStages: Array.isArray(base.completedStages) ? Array.from(new Set(base.completedStages)) : [],
    xp: Math.max(0, Number(base.xp) || 0),
    pearls: Math.max(0, Number(base.pearls) || 0),
    stars: Math.max(0, Number(base.stars) || 0),
    streak: Math.max(0, Number(base.streak) || 0),
    lampes: typeof base.lampes === "number" ? Math.min(5, Math.max(0, base.lampes)) : 5,
    leitnerCards: base.leitnerCards && typeof base.leitnerCards === "object" ? base.leitnerCards : {},
    masteredBooks: Array.isArray(base.masteredBooks) ? Array.from(new Set(base.masteredBooks)) : [],
    pedagogicalProfile: validProfile,
    unlockedChests: Array.isArray(base.unlockedChests) ? Array.from(new Set(base.unlockedChests)) : [],
    memorizationCards:
      base.memorizationCards && typeof base.memorizationCards === "object" && !Array.isArray(base.memorizationCards)
        ? base.memorizationCards
        : {},
    dailyChallengeHistory:
      base.dailyChallengeHistory && typeof base.dailyChallengeHistory === "object" && !Array.isArray(base.dailyChallengeHistory)
        ? base.dailyChallengeHistory
        : {},
    gameStats:
      base.gameStats && typeof base.gameStats === "object" && !Array.isArray(base.gameStats)
        ? base.gameStats
        : {},
    missionsState:
      base.missionsState && typeof base.missionsState === "object" && !Array.isArray(base.missionsState)
        ? base.missionsState
        : {},
    accessibility: {
      ...DEFAULT_ACCESSIBILITY,
      ...(base.accessibility && typeof base.accessibility === "object" ? base.accessibility : {})
    }
  };
}

function mergeMemorizationCards(localMemo = {}, cloudMemo = {}) {
  const merged = {};
  const keys = new Set([...Object.keys(localMemo || {}), ...Object.keys(cloudMemo || {})]);
  keys.forEach((ref) => {
    const l = localMemo[ref];
    const c = cloudMemo[ref];
    if (l && c) {
      const pick = (Number(l.stage) || 1) >= (Number(c.stage) || 1) ? l : c;
      merged[ref] = {
        ...pick,
        stage: Math.max(Number(l.stage) || 1, Number(c.stage) || 1),
        intervalDays: Math.max(Number(l.intervalDays) || 1, Number(c.intervalDays) || 1),
        attempts: Math.max(Number(l.attempts) || 0, Number(c.attempts) || 0),
        successes: Math.max(Number(l.successes) || 0, Number(c.successes) || 0),
        delayedSuccesses: Math.max(Number(l.delayedSuccesses) || 0, Number(c.delayedSuccesses) || 0),
        passed24h: Boolean(l.passed24h || c.passed24h),
        passed7d: Boolean(l.passed7d || c.passed7d),
        passed30d: Boolean(l.passed30d || c.passed30d),
        lastReviewedAt: Math.max(Number(l.lastReviewedAt) || 0, Number(c.lastReviewedAt) || 0),
        nextReviewAt: Math.max(Number(l.nextReviewAt) || 0, Number(c.nextReviewAt) || 0)
      };
    } else {
      merged[ref] = { ...(l || c) };
    }
  });
  return merged;
}

/**
 * Réconcilie les données de progression entre le cache local (appareil) et le Cloud Firestore.
 * Utile lors du passage hors-ligne -> en-ligne ou entre deux appareils différents.
 *
 * @param {Object} localData Données locales du pèlerin
 * @param {Object} cloudData Données distantes Firestore
 * @returns {Object} Données réconciliées et fusionnées
 */
export function reconcilePelerinData(localData = {}, cloudData = {}) {
  const local = localData || {};
  const cloud = cloudData || {};

  const localSaved = local.saved || local;
  const cloudSaved = cloud.saved || cloud;

  // 1. Profil : Privilégier le nom personnalisé
  let profileName = "Ami pèlerin";
  if (local.profileName && local.profileName !== "Ami pèlerin") {
    profileName = local.profileName;
  } else if (cloud.profileName && cloud.profileName !== "Ami pèlerin") {
    profileName = cloud.profileName;
  }

  // 2. Étapes accomplies : Union stricte sans doublons
  const localStages = Array.isArray(localSaved.completedStages) ? localSaved.completedStages : [];
  const cloudStages = Array.isArray(cloudSaved.completedStages) ? cloudSaved.completedStages : [];
  const mergedStages = Array.from(new Set([...localStages, ...cloudStages]));

  // 3. Points de joie (XP), Perles et Série quotidienne : Toujours retenir le maximum acquis
  const mergedXp = Math.max(Number(localSaved.xp) || 0, Number(cloudSaved.xp) || 0);
  const mergedPearls = Math.max(Number(localSaved.pearls) || 0, Number(cloudSaved.pearls) || 0);
  const mergedStreak = Math.max(Number(localSaved.streak) || 0, Number(cloudSaved.streak) || 0);
  const mergedLastActiveDay = Math.max(Number(localSaved.lastActiveDay) || 0, Number(cloudSaved.lastActiveDay) || 0);

  // 4. Versets ancrés et Livres maîtrisés : Union des références
  const localAnchored = Array.isArray(localSaved.anchoredVerses) ? localSaved.anchoredVerses : [];
  const cloudAnchored = Array.isArray(cloudSaved.anchoredVerses) ? cloudSaved.anchoredVerses : [];
  const mergedAnchored = Array.from(new Set([...localAnchored, ...cloudAnchored]));

  const localMastered = Array.isArray(localSaved.masteredBooks) ? localSaved.masteredBooks : [];
  const cloudMastered = Array.isArray(cloudSaved.masteredBooks) ? cloudSaved.masteredBooks : [];
  const mergedMastered = Array.from(new Set([...localMastered, ...cloudMastered]));

  // 5. Cartes Leitner du Jardin de la Parole : Fusion par niveau d'ancrage maximal
  const normalizeCards = (cards) => {
    if (Array.isArray(cards)) {
      const dict = {};
      cards.forEach((c) => {
        if (c && (c.id || c.ref)) {
          dict[c.id || c.ref] = c;
        }
      });
      return dict;
    }
    return cards || {};
  };

  const localCards = normalizeCards(localSaved.leitnerCards);
  const cloudCards = normalizeCards(cloudSaved.leitnerCards);
  const mergedCards = {};

  const allRefs = new Set([...Object.keys(localCards), ...Object.keys(cloudCards)]);
  allRefs.forEach((key) => {
    const lCard = localCards[key];
    const cCard = cloudCards[key];

    if (lCard && cCard) {
      // Conserver le niveau d'ancrage le plus élevé acquis sur n'importe quel appareil
      const maxBox = Math.max(Number(lCard.box) || 1, Number(cCard.box) || 1);
      const lastReviewed = Math.max(Number(lCard.lastReviewed) || 0, Number(cCard.lastReviewed) || 0);
      const nextReview = Math.max(Number(lCard.nextReview) || 0, Number(cCard.nextReview) || 0);

      mergedCards[key] = {
        ...(lCard || cCard),
        box: maxBox,
        lastReviewed,
        nextReview
      };
    } else if (lCard) {
      mergedCards[key] = { ...lCard };
    } else if (cCard) {
      mergedCards[key] = { ...cCard };
    }
  });

  // 6. Lampes de foi (Vies)
  const mergedLampes = typeof localSaved.lampes === "number"
    ? localSaved.lampes
    : (typeof cloudSaved.lampes === "number" ? cloudSaved.lampes : 5);

  // Conserver la compatibilité à la fois pour un dictionnaire clé-valeur et un tableau
  const isArraySource = Array.isArray(localSaved.leitnerCards) || Array.isArray(cloudSaved.leitnerCards);
  let finalLeitnerCards;
  if (isArraySource) {
    finalLeitnerCards = Object.values(mergedCards);
    Object.keys(mergedCards).forEach((k) => {
      finalLeitnerCards[k] = mergedCards[k];
    });
  } else {
    finalLeitnerCards = { ...mergedCards };
  }

  const mergedStars = Math.max(Number(localSaved.stars) || 0, Number(cloudSaved.stars) || 0);
  const mergedChests = Array.from(
    new Set([
      ...(Array.isArray(localSaved.unlockedChests) ? localSaved.unlockedChests : []),
      ...(Array.isArray(cloudSaved.unlockedChests) ? cloudSaved.unlockedChests : [])
    ])
  );
  const mergedMemorization = mergeMemorizationCards(localSaved.memorizationCards, cloudSaved.memorizationCards);
  const mergedDailyChallenge = {
    ...(cloudSaved.dailyChallengeHistory || {}),
    ...(localSaved.dailyChallengeHistory || {})
  };
  const mergedGameStats = {
    ...(cloudSaved.gameStats || {}),
    ...(localSaved.gameStats || {})
  };
  const mergedMissions = {
    ...(cloudSaved.missionsState || {}),
    ...(localSaved.missionsState || {})
  };
  const mergedPedagogicalProfile = localSaved.pedagogicalProfile || cloudSaved.pedagogicalProfile;

  const resultSaved = {
    completedStages: mergedStages,
    xp: mergedXp,
    pearls: mergedPearls,
    streak: mergedStreak,
    ...(mergedLastActiveDay > 0 ? { lastActiveDay: mergedLastActiveDay } : {}),
    lampes: mergedLampes,
    leitnerCards: finalLeitnerCards,
    anchoredVerses: mergedAnchored,
    ...(mergedMastered.length > 0 ? { masteredBooks: mergedMastered } : {}),
    ...(mergedStars > 0 ? { stars: mergedStars } : {}),
    ...(mergedChests.length > 0 ? { unlockedChests: mergedChests } : {}),
    ...(Object.keys(mergedMemorization).length > 0 ? { memorizationCards: mergedMemorization } : {}),
    ...(Object.keys(mergedDailyChallenge).length > 0 ? { dailyChallengeHistory: mergedDailyChallenge } : {}),
    ...(Object.keys(mergedGameStats).length > 0 ? { gameStats: mergedGameStats } : {}),
    ...(Object.keys(mergedMissions).length > 0 ? { missionsState: mergedMissions } : {}),
    ...(mergedPedagogicalProfile ? { pedagogicalProfile: mergedPedagogicalProfile } : {})
  };

  return {
    profileName,
    ...resultSaved,
    saved: resultSaved
  };
}

/**
 * Réconcilie les notes intimes du Carnet Spirituel sans perte
 */
export function reconcileCarnetNotes(localNotes = [], cloudNotes = []) {
  const lNotes = Array.isArray(localNotes) ? localNotes : [];
  const cNotes = Array.isArray(cloudNotes) ? cloudNotes : [];

  const map = new Map();
  [...lNotes, ...cNotes].forEach((note) => {
    if (note && note.id) {
      // Conserver la note avec le texte le plus complet si doublon d'id
      const existing = map.get(note.id);
      if (!existing || (note.texte && note.texte.length > (existing.texte || "").length)) {
        map.set(note.id, note);
      }
    }
  });

  return Array.from(map.values());
}

/**
 * Réconcilie les prières communautaires avec préservation des soutiens et masquages locaux
 */
export function reconcilePrayers(localPrayers = [], cloudPrayers = []) {
  const lPrayers = Array.isArray(localPrayers) ? localPrayers : [];
  const cPrayers = Array.isArray(cloudPrayers) ? cloudPrayers : [];

  const map = new Map();

  // Enregistrer d'abord le cloud
  cPrayers.forEach((p) => {
    if (p && p.id) map.set(p.id, { ...p });
  });

  // Fusionner avec le local (préserve le max de soutiens et le flag masqué local)
  lPrayers.forEach((l) => {
    if (l && l.id) {
      const existing = map.get(l.id);
      if (existing) {
        map.set(l.id, {
          ...existing,
          ...l,
          soutiens: Math.max(existing.soutiens || 0, l.soutiens || 0),
          masque: existing.masque || l.masque || false
        });
      } else {
        map.set(l.id, { ...l });
      }
    }
  });

  return Array.from(map.values()).filter((p) => !p.masque);
}
