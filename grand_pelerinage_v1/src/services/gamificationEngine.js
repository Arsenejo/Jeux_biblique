/**
 * PHASE 6 (Gamification & Motivation) — Titres honorifiques, Collections, Missions et Coffres.
 */

export const HONORARY_TITLES = [
  { id: "petit-explorateur", nom: "Petit Explorateur", icone: "🌱", minXp: 0, minStages: 0, minMemorized: 0 },
  { id: "pelerin-debutant", nom: "Pèlerin Débutant", icone: "🥾", minXp: 75, minStages: 3, minMemorized: 0 },
  { id: "chercheur-parole", nom: "Chercheur de la Parole", icone: "🔍", minXp: 250, minStages: 10, minMemorized: 2 },
  { id: "connaisseur-ecritures", nom: "Connaisseur des Écritures", icone: "📜", minXp: 700, minStages: 25, minMemorized: 5 },
  { id: "gardien-versets", nom: "Gardien des Versets", icone: "💎", minXp: 1500, minStages: 50, minMemorized: 10 },
  { id: "maitre-parole", nom: "Maître de la Parole", icone: "👑", minXp: 3000, minStages: 90, minMemorized: 18 }
];

export function getCurrentHonoraryTitle({ xp = 0, stagesCount = 0, memorizedCount = 0 } = {}) {
  let current = HONORARY_TITLES[0];
  let next = HONORARY_TITLES[1];

  for (let i = 0; i < HONORARY_TITLES.length; i += 1) {
    const t = HONORARY_TITLES[i];
    if (xp >= t.minXp && stagesCount >= t.minStages && memorizedCount >= t.minMemorized) {
      current = t;
      next = HONORARY_TITLES[i + 1] || null;
    }
  }

  return { current, next };
}

export const BIBLE_COLLECTIONS = [
  { id: "col-personnages", nom: "Personnages Bibliques", icone: "🦁", objectif: "Complète 3 parcours de personnages ou parties Qui suis-je ?", metricKey: "charactersPlayed", target: 3 },
  { id: "col-livres", nom: "Livres de la Bible", icone: "📚", objectif: "Maîtrise 5 livres dans l'Encyclopédie des 66 Livres", metricKey: "masteredBooksCount", target: 5 },
  { id: "col-versets", nom: "Versets Précieux", icone: "🌿", objectif: "Ancre 5 versets dans Mes Versets à Retenir", metricKey: "versesAnchored", target: 5 },
  { id: "col-tresors", nom: "Trésors Spirituels", icone: "🪙", objectif: "Ouvre 2 coffres de récompenses (Sentier ou Énigmes)", metricKey: "chestsCount", target: 2 },
  { id: "col-histoires", nom: "Grandes Histoires", icone: "⛵", objectif: "Valide 12 étapes du Grand Pèlerinage", metricKey: "stagesCount", target: 12 },
  { id: "col-epoques", nom: "Époques Bibliques", icone: "🗺️", objectif: "Débloque au moins 2 époques bibliques", metricKey: "epochsCount", target: 2 }
];

export function getCollectionsStatus(stats = {}) {
  return BIBLE_COLLECTIONS.map((col) => {
    const value = Math.max(0, Number(stats[col.metricKey]) || 0);
    return {
      ...col,
      current: value,
      unlocked: value >= col.target,
      progressPct: Math.min(100, Math.round((value / col.target) * 100))
    };
  });
}

export function getActiveMissions({
  todayChallengeDone = false,
  dueMemorizationCount = 0,
  stagesToday = 0,
  weeklyGroupDone = false,
  bibleChaptersRead = 0,
  prayerShared = false
} = {}) {
  return [
    {
      id: "m-daily",
      categorie: "Quotidienne",
      titre: "Relever le Défi du Jour",
      icone: "☀️",
      done: Boolean(todayChallengeDone),
      rewardLabel: "+40 XP · +3 💎"
    },
    {
      id: "m-memo",
      categorie: "Mémorisation",
      titre: dueMemorizationCount > 0 ? `Réviser ${Math.min(3, dueMemorizationCount)} verset(s) dû(s)` : "Ajouter ou entretenir 1 verset",
      icone: "🌱",
      done: dueMemorizationCount === 0 && stagesToday > 0,
      rewardLabel: "+20 XP · Ancrage"
    },
    {
      id: "m-read",
      categorie: "Lecture",
      titre: "Méditer 1 passage biblique",
      icone: "📖",
      done: bibleChaptersRead > 0,
      rewardLabel: "+15 XP"
    },
    {
      id: "m-weekly",
      categorie: "Hebdomadaire",
      titre: "Participer au défi hebdomadaire du groupe",
      icone: "⛪",
      done: Boolean(weeklyGroupDone),
      rewardLabel: "+30 XP"
    },
    {
      id: "m-community",
      categorie: "Communautaire",
      titre: "Soutenir une prière sur le Mur Fraternel",
      icone: "🕊️",
      done: Boolean(prayerShared),
      rewardLabel: "Fraternité"
    }
  ];
}

export function getEpochChests(epochId, epochStages = [], completedStages = [], unlockedChests = []) {
  const completedInEpoch = epochStages.filter((s) => completedStages.includes(s.id)).length;
  const total = Math.max(1, epochStages.length);
  const halfwayThreshold = Math.max(1, Math.ceil(total / 2));

  return [
    {
      id: `chest-${epochId}-half`,
      titre: "Coffre de Mi-Parcours",
      required: halfwayThreshold,
      completed: completedInEpoch,
      ready: completedInEpoch >= halfwayThreshold,
      claimed: unlockedChests.includes(`chest-${epochId}-half`),
      reward: { xp: 35, pearls: 2 }
    },
    {
      id: `chest-${epochId}-full`,
      titre: "Coffre d'Accomplissement",
      required: total,
      completed: completedInEpoch,
      ready: completedInEpoch >= total,
      claimed: unlockedChests.includes(`chest-${epochId}-full`),
      reward: { xp: 75, pearls: 5 }
    }
  ];
}

