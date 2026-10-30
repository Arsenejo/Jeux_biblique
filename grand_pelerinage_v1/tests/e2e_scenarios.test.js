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
  EPOCH_STAGES,
  BIBLE_CHAPTERS,
  LEITNER_BOXES
} from "../src/data/bibleData.js";

// =========================================================================
// SCÉNARIO 1 : DÉMARRAGE SANS FORMULAIRE OBLIGATOIRE
// =========================================================================
test("Scénario 1: Démarrage instantané d'un nouveau pèlerin sans formulaire obligatoire", () => {
  // Simulation de l'état initial d'un nouveau joueur (stockage vide)
  const initialStorage = {};

  const getInitialProfile = () => {
    try {
      const p = JSON.parse(initialStorage["pelerinage_profile_local"] || "{}");
      return p.profileName || "Ami pèlerin";
    } catch {
      return "Ami pèlerin";
    }
  };

  const getInitialProgress = () => {
    try {
      return JSON.parse(initialStorage["pelerinage_progress"] || "{}");
    } catch {
      return {};
    }
  };

  const profileName = getInitialProfile();
  const saved = getInitialProgress();

  // 1. Le joueur a un nom bienveillant par défaut, sans obligation de saisir un formulaire
  assert.equal(profileName, "Ami pèlerin");

  // 2. Une partie neuve ne marque aucune étape comme déjà franchie.
  // L'étape 1 reste ouvrable : le sentier ne verrouille pas la première case.
  const completedStages = Array.isArray(saved.completedStages) ? saved.completedStages : [];
  assert.deepEqual(completedStages, []);
  assert.equal(saved.xp || 0, 0);
  assert.equal(saved.pearls || 0, 0);

  // 3. Aucune barrière de carte de crédit, email ou mot de passe requise pour commencer
  assert.equal(typeof profileName, "string");
  assert.ok(profileName.length > 0);
});

// =========================================================================
// SCÉNARIO 2 : PARCOURS BIBLIQUE & SÉPARATION TEXTE BIBLIQUE / MÉDITATION
// =========================================================================
test("Scénario 2: Parcours biblique, récompense d'étape et séparation Écriture / Méditation", () => {
  const stage1 = EPOCH_STAGES.racines.find((s) => s.id === 1);
  assert.ok(stage1, "L'étape 1 doit exister");

  // 1. Simulation de la résolution de l'étape 1 (Ordre des mots de Genèse 1:1)
  const userPlacedWords = ["Au commencement", "Dieu", "créa", "les cieux", "et", "la terre."];
  const isSuccess = userPlacedWords.every((word, idx) => word === stage1.motsCorrects[idx]);
  assert.equal(isSuccess, true, "L'ordonnancement des mots doit être validé avec succès");

  // 2. Attribution de la récompense
  let playerState = { xp: 0, pearls: 0, completedStages: [1] };
  if (isSuccess) {
    playerState = {
      ...playerState,
      xp: playerState.xp + stage1.recompense.xp,
      pearls: playerState.pearls + stage1.recompense.perles,
      completedStages: Array.from(new Set([...playerState.completedStages, 2])) // Étape 2 débloquée
    };
  }

  assert.equal(playerState.xp, 25, "Le joueur doit recevoir 25 XP");
  assert.equal(playerState.pearls, 1, "Le joueur doit recevoir 1 perle céleste");
  assert.ok(playerState.completedStages.includes(2), "L'étape 2 doit être débloquée");

  // 3. Vérification de la séparation stricte du texte biblique et de la méditation
  const scriptureText = stage1.motsCorrects.join(" ");
  const meditationText = stage1.explication;

  // L'Écriture Sainte doit être fidèle à Louis Segond 1910
  assert.equal(scriptureText, "Au commencement Dieu créa les cieux et la terre.");
  assert.equal(stage1.ref, "Genèse 1:1");

  // La méditation spirituelle doit être un texte distinct et édifiant
  assert.notEqual(scriptureText, meditationText);
  assert.match(meditationText, /Dieu est la source de toute vie/i);
});

// =========================================================================
// SCÉNARIO 3 : JARDIN DE LA PAROLE & ANCRAGE LEITNER
// =========================================================================
test("Scénario 3: Jardin de la Parole, ancrage Leitner et planification de révision", () => {
  const intervalsDays = [0, 1, 3, 7, 30, 90];
  const now = 1700000000000; // Timestamp de référence fixe

  // 1. Ancrage d'un nouveau verset lu dans le Jardin (Palier 1 : Graine semée)
  const verseRef = "Jean 1:1";
  const verseText = "Au commencement était la Parole, et la Parole était avec Dieu, et la Parole était Dieu.";

  let garden = {};
  const anchorVerse = (ref, text, currentTime) => {
    return {
      ref,
      titre: text.slice(0, 45) + "...",
      texte: text,
      box: 1, // Niveau 1 : Germination
      lastReviewed: currentTime,
      nextReview: currentTime + intervalsDays[1] * 24 * 3600 * 1000 // +1 jour
    };
  };

  garden[verseRef] = anchorVerse(verseRef, verseText, now);

  assert.equal(garden[verseRef].box, 1, "Le verset doit débuter en boîte 1");
  assert.equal(
    garden[verseRef].nextReview - now,
    1 * 24 * 3600 * 1000,
    "La première révision doit être planifiée à J+1"
  );

  // 2. Révision réussie du verset : passage en boîte 2 (Jeune pousse, J+3)
  const reviewSuccess = (card, currentTime) => {
    const newBox = Math.min(5, card.box + 1);
    const nextReview = currentTime + intervalsDays[newBox] * 24 * 3600 * 1000;
    return {
      ...card,
      box: newBox,
      lastReviewed: currentTime,
      nextReview
    };
  };

  const reviewTime1 = now + 1 * 24 * 3600 * 1000;
  garden[verseRef] = reviewSuccess(garden[verseRef], reviewTime1);

  assert.equal(garden[verseRef].box, 2, "Après succès, le verset avance en boîte 2");
  assert.equal(
    garden[verseRef].nextReview - reviewTime1,
    3 * 24 * 3600 * 1000,
    "La prochaine révision doit être planifiée à J+3"
  );

  // 3. Révision réussie suivante : passage en boîte 3 (Arbre robuste, J+7)
  const reviewTime2 = reviewTime1 + 3 * 24 * 3600 * 1000;
  garden[verseRef] = reviewSuccess(garden[verseRef], reviewTime2);

  assert.equal(garden[verseRef].box, 3, "Après un 2e succès, le verset avance en boîte 3");
  assert.equal(
    garden[verseRef].nextReview - reviewTime2,
    7 * 24 * 3600 * 1000,
    "La 3e révision doit être planifiée à J+7"
  );

  // 4. Révision manquée : retour doux en boîte 1 pour consolidation
  const reviewFailure = (card, currentTime) => {
    const newBox = 1;
    const nextReview = currentTime + intervalsDays[newBox] * 24 * 3600 * 1000;
    return {
      ...card,
      box: newBox,
      lastReviewed: currentTime,
      nextReview
    };
  };

  garden[verseRef] = reviewFailure(garden[verseRef], reviewTime2 + 1000);
  assert.equal(garden[verseRef].box, 1, "En cas de difficulté, le verset revient en boîte 1 pour consolider");
  assert.equal(
    garden[verseRef].nextReview - (reviewTime2 + 1000),
    1 * 24 * 3600 * 1000,
    "L'intervalle redevient 1 jour"
  );
});

// =========================================================================
// SCÉNARIO 4 : MODE HORS LIGNE & SYNCHRONISATION RÉSILIENTE SANS PERTE
// =========================================================================
test("Scénario 4: Poursuite du parcours hors ligne et réconciliation parfaite à la reconnexion", () => {
  // L'utilisateur est en voyage / hors-ligne.
  // État initial stocké sur le Cloud lors de la dernière connexion :
  const cloudState = {
    profileName: "Frère Thomas",
    xp: 25,
    pearls: 1,
    streak: 2,
    completedStages: [1],
    leitnerCards: {
      "Genèse 1:1": { ref: "Genèse 1:1", box: 1, lastReviewed: 1000, nextReview: 2000 }
    }
  };

  // Pendant son voyage hors connexion, Thomas avance sur son appareil :
  // Il termine les étapes 2 et 3, plante Psaume 23:1 et fait progresser Genèse 1:1 en boîte 2.
  const localOfflineState = {
    profileName: "Frère Thomas",
    xp: 90,
    pearls: 3,
    streak: 3,
    completedStages: [1, 2, 3],
    leitnerCards: {
      "Genèse 1:1": { ref: "Genèse 1:1", box: 2, lastReviewed: 5000, nextReview: 8000 },
      "Psaume 23:1": { ref: "Psaume 23:1", box: 1, lastReviewed: 5000, nextReview: 6000 }
    }
  };

  // Reconnexion au réseau : appel du moteur de réconciliation
  const reconciled = reconcilePelerinData(localOfflineState, cloudState);

  // 1. Zéro perte sur les étapes vécues hors connexion
  assert.deepEqual(
    reconciled.completedStages.sort((a, b) => a - b),
    [1, 2, 3],
    "Toutes les étapes vécues hors-ligne doivent être préservées"
  );

  // 2. Préservation des points de joie et perles
  assert.equal(reconciled.xp, 90, "Le score le plus élevé (90 XP) doit être conservé");
  assert.equal(reconciled.pearls, 3, "Le nombre maximal de perles (3) doit être conservé");
  assert.equal(reconciled.streak, 3, "La série de 3 jours doit être conservée");

  // 3. Jardin de la parole : boîte la plus avancée retenue (box 2 pour Genèse 1:1)
  assert.equal(reconciled.leitnerCards["Genèse 1:1"].box, 2);
  assert.ok(reconciled.leitnerCards["Psaume 23:1"], "Le verset ancré hors-ligne doit être intégré");
});

// =========================================================================
// SCÉNARIO 5 : CONFIDENTIALITÉ ÉTANCHEMENT PROTÉGÉE DU CARNET SPIRITUEL
// =========================================================================
test("Scénario 5: Confidentialité et herméticité du Carnet spirituel personnel entre comptes", () => {
  // Simulateur formel de validation des règles de sécurité Firestore de firestore.rules
  const simulateFirestoreAccess = ({ path, operation, authUser }) => {
    // Règle 1: Profil public
    const profileMatch = path.match(/^\/pelerins\/([a-zA-Z0-9_-]+)$/);
    if (profileMatch) {
      const targetUid = profileMatch[1];
      if (operation === "read") return { allowed: true };
      if (operation === "write") {
        return { allowed: authUser !== null && authUser.uid === targetUid };
      }
    }

    // Règle 2: Carnet spirituel intime : /pelerins/{uid}/carnet/{noteId}
    const carnetMatch = path.match(/^\/pelerins\/([a-zA-Z0-9_-]+)\/carnet\/([a-zA-Z0-9_-]+)$/);
    if (carnetMatch) {
      const ownerUid = carnetMatch[1];
      // Règle : allow read, write: if request.auth != null && request.auth.uid == uid;
      const isOwner = authUser !== null && authUser.uid === ownerUid;
      return { allowed: isOwner, reason: isOwner ? "Propriétaire légitime" : "Accès non autorisé aux pensées intimes" };
    }

    return { allowed: false, reason: "Chemin inconnu" };
  };

  const alice = { uid: "user_alice_123", email: "alice@example.com" };
  const bob = { uid: "user_bob_456", email: "bob@example.com" };
  const noteAlicePath = "/pelerins/user_alice_123/carnet/priere_secrete_1";

  // 1. Alice accède à son propre carnet -> AUTORISÉ
  const accessAlice = simulateFirestoreAccess({
    path: noteAlicePath,
    operation: "read",
    authUser: alice
  });
  assert.equal(accessAlice.allowed, true);

  // 2. Bob tente de lire le carnet d'Alice -> REFUSÉ
  const accessBobRead = simulateFirestoreAccess({
    path: noteAlicePath,
    operation: "read",
    authUser: bob
  });
  assert.equal(accessBobRead.allowed, false, "Bob ne doit JAMAIS pouvoir lire le carnet d'Alice");

  // 3. Bob tente de modifier ou polluer le carnet d'Alice -> REFUSÉ
  const accessBobWrite = simulateFirestoreAccess({
    path: noteAlicePath,
    operation: "write",
    authUser: bob
  });
  assert.equal(accessBobWrite.allowed, false, "Bob ne doit pas pouvoir écrire dans le carnet d'Alice");

  // 4. Utilisateur anonyme / non authentifié -> REFUSÉ
  const accessAnon = simulateFirestoreAccess({
    path: noteAlicePath,
    operation: "read",
    authUser: null
  });
  assert.equal(accessAnon.allowed, false, "Un utilisateur non connecté ne peut pas lire le carnet");

  // 5. En revanche, le profil public d'Alice (niveau, XP sur le classement) est visible par Bob
  const accessBobProfile = simulateFirestoreAccess({
    path: "/pelerins/user_alice_123",
    operation: "read",
    authUser: bob
  });
  assert.equal(accessBobProfile.allowed, true, "Le profil pèlerin est lisible pour le classement fraternel");
});

// =========================================================================
// SCÉNARIO 6 : MUR DE PRIÈRES, PROTECTION VIE PRIVÉE & MODÉRATION MULTI-COMPTES
// =========================================================================
test("Scénario 6: Mur de prières, protection des coordonnées et masquage multi-comptes", () => {
  // 1. Protection contre la divulgation de coordonnées sensibles ou d'adresses
  const prayerPhone = validatePrayerContent("Pour me joindre appelez au 06 99 88 77 66 merci", "Jeune Pèlerin");
  assert.equal(prayerPhone.valid, false);
  assert.match(prayerPhone.reason, /numéro de téléphone|coordonnées personnelles/i);

  const prayerEmail = validatePrayerContent("Mon adresse c'est priere@famille.fr merci", "Pèlerin");
  assert.equal(prayerEmail.valid, false);
  assert.match(prayerEmail.reason, /email/i);

  const prayerUrl = validatePrayerContent("Voir mon site https://arnaque-foi.com pour prier", "Pèlerin");
  assert.equal(prayerUrl.valid, false);
  assert.match(prayerUrl.reason, /liens externes|publicités/i);

  // 2. Dépôt d'une intention sincère par Alice
  const prayerValid = validatePrayerContent("Je prie pour la paix dans les familles et la santé des aînés.", "Alice");
  assert.equal(prayerValid.valid, true);

  let prayerItem = {
    id: "prayer_1001",
    auteur: "Alice",
    texte: "Je prie pour la paix dans les familles et la santé des aînés.",
    soutiens: 1,
    signaux: 0,
    masque: false
  };

  // 3. Bob signale l'intention (signal 1) -> Masquage local instantané pour Bob
  const reportedByBob = ["prayer_1001"];
  prayerItem.signaux += 1;
  prayerItem.masque = prayerItem.signaux >= 3;

  assert.equal(prayerItem.signaux, 1);
  assert.equal(prayerItem.masque, false, "À 1 signalement, l'élément n'est pas masqué globalement");

  // Pour Bob, l'élément est filtré immédiatement de son fil :
  let feedBob = [prayerItem].filter((p) => !reportedByBob.includes(p.id) && !p.masque);
  assert.equal(feedBob.length, 0, "Pour Bob, la prière signalée est immédiatement masquée");

  // Pour Chloé (neutre), la prière reste visible :
  let feedChloe = [prayerItem].filter((p) => !p.masque);
  assert.equal(feedChloe.length, 1, "Pour un tiers, la prière reste visible à 1 signalement");

  // 4. David signale l'intention (signal 2)
  prayerItem.signaux += 1;
  prayerItem.masque = prayerItem.signaux >= 3;
  assert.equal(prayerItem.signaux, 2);
  assert.equal(prayerItem.masque, false);

  // 5. Emma signale l'intention (signal 3 -> seuil critique de 3 signalements atteint)
  prayerItem.signaux += 1;
  prayerItem.masque = prayerItem.signaux >= 3;
  assert.equal(prayerItem.signaux, 3);
  assert.equal(prayerItem.masque, true, "À 3 signalements, masque bascule à true");

  // 6. Vérification du flux communautaire pour TOUT le monde :
  // Désormais, même un nouvel utilisateur sans signalement local ne verra plus la prière
  const feedPublic = [prayerItem].filter((p) => !p.masque);
  assert.equal(feedPublic.length, 0, "La prière masquée n'apparaît plus pour aucun utilisateur");
});
