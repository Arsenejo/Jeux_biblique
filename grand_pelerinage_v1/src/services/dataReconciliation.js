// Module de réconciliation et de synchronisation résiliente multi-appareils
// Garantit : Zéro perte de données, Zéro écrasement intempestif, Zéro doublon.

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

  // 3. Points de joie (XP) et Perles : Toujours retenir le maximum acquis
  const mergedXp = Math.max(Number(localSaved.xp) || 0, Number(cloudSaved.xp) || 0);
  const mergedPearls = Math.max(Number(localSaved.pearls) || 0, Number(cloudSaved.pearls) || 0);
  const mergedStreak = Math.max(Number(localSaved.streak) || 1, Number(cloudSaved.streak) || 1);

  // 4. Versets ancrés : Union des références
  const localAnchored = Array.isArray(localSaved.anchoredVerses) ? localSaved.anchoredVerses : [];
  const cloudAnchored = Array.isArray(cloudSaved.anchoredVerses) ? cloudSaved.anchoredVerses : [];
  const mergedAnchored = Array.from(new Set([...localAnchored, ...cloudAnchored]));

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

  const isArrayInput = Array.isArray(localSaved.leitnerCards) || Array.isArray(cloudSaved.leitnerCards);
  const finalLeitnerCards = isArrayInput ? Object.values(mergedCards) : mergedCards;

  const resultSaved = {
    completedStages: mergedStages.length > 0 ? mergedStages : [1],
    xp: mergedXp,
    pearls: mergedPearls,
    streak: mergedStreak,
    leitnerCards: finalLeitnerCards,
    anchoredVerses: mergedAnchored
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
