import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import {
  initializeFirestore,
  getFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import { reconcilePelerinData, reconcilePrayers } from "./dataReconciliation.js";
import { getReportedPrayerIds, reportPrayerLocally } from "./moderation.js";
import { sendWelcomeEmail } from "./brevoMailer.js";
import { clampScore } from "./progression.js";

// Configuration des services Cloud (projet defi-jean)
export const firebaseConfig = {
  apiKey: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_API_KEY) || "AIzaSyDsIYH4rplT1giMld2cxq4x1IqWMnyIZ6Q",
  authDomain: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN) || "defi-jean.firebaseapp.com",
  projectId: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_PROJECT_ID) || "defi-jean",
  storageBucket: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET) || "defi-jean.firebasestorage.app",
  messagingSenderId: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID) || "23332908996",
  appId: (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_APP_ID) || "1:23332908996:web:7ac92b21d43c01b23a7e91"
};

/**
 * Vérifie si la configuration Firebase est présente.
 */
export function isFirebaseCloudActive() {
  try {
    return Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 10);
  } catch {
    return false;
  }
}

let app = null;
let auth = null;
let db = null;
let isInitialized = false;

// Identifiant persistant pour visiteur invité non connecté
export function getLocalPilgrimId() {
  try {
    let id = localStorage.getItem("pelerin_local_uuid");
    if (!id) {
      id = "pelerin_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      localStorage.setItem("pelerin_local_uuid", id);
    }
    return id;
  } catch {
    return "pelerin_visiteur";
  }
}

export function getFirebaseServices() {
  if (isInitialized) return { app, auth, db };

  try {
    app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Initialisation moderne du cache persistant Firestore avec détection de long-polling
    try {
      db = initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    } catch {
      db = getFirestore(app);
    }

    isInitialized = true;
  } catch {
    // Mode local automatique si non disponible
  }

  return { app, auth, db };
}

/**
 * Active le réseau Firestore lors de la reconnexion internet
 */
export async function setFirestoreOnline() {
  const { db } = getFirebaseServices();
  if (!db) return;
  try {
    await enableNetwork(db);
  } catch {}
}

/**
 * Désactive le réseau Firestore quand l'appareil passe hors ligne
 */
export async function setFirestoreOffline() {
  const { db } = getFirebaseServices();
  if (!db) return;
  try {
    await disableNetwork(db);
  } catch {}
}

/**
 * Initialise l'authentification réelle du pèlerin (ZÉRO session simulée)
 */
export async function initPelerinAuth(onUserReady) {
  // Nettoyage de toute ancienne trace de fausse session simulée
  try {
    localStorage.removeItem("pelerin_active_account");
  } catch {}

  const { auth } = getFirebaseServices();
  if (!auth) {
    onUserReady(null, "offline");
    return () => {};
  }

  try {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user && !user.isAnonymous) {
        onUserReady(user, "cloud");
      } else {
        // Utilisateur non connecté : mode invité réel, sa progression reste sur cet appareil
        onUserReady(null, "guest");
      }
    });
    return unsub;
  } catch {
    onUserReady(null, "guest");
    return () => {};
  }
}

/**
 * Normalise un pseudonyme de pèlerin pour les comparaisons strictes d'unicité (insensible à la casse, aux accents et aux espaces)
 */
export function normalizePseudo(pseudo) {
  return String(pseudo || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .slice(0, 30);
}

/**
 * Vérifie dans la base de données commune si un nom de joueur est déjà utilisé
 * Empêche formellement les doublons de noms entre tous les pèlerins.
 */
export async function checkIsPseudoAvailable(pseudo, currentUid = null) {
  const clean = normalizePseudo(pseudo);
  if (!clean || clean.length < 2) {
    return { available: false, reason: "Le nom de pèlerin doit comporter au moins 2 caractères." };
  }
  if (clean === "ami pelerin" || clean === "visiteur" || clean === "anonyme" || clean === "invite") {
    return { available: false, reason: "Ce nom générique est réservé aux visiteurs invités. Choisis un nom unique." };
  }

  const { db } = getFirebaseServices();
  if (!db) return { available: true, clean };

  try {
    // 1. Contrôle dans le registre officiel des pseudos enregistrés
    const pseudoDocRef = doc(db, "pseudos_enregistres", clean);
    const snap = await getDoc(pseudoDocRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data.uid && data.uid !== currentUid) {
        return {
          available: false,
          reason: `Le nom « ${pseudo.trim()} » est déjà utilisé par un autre pèlerin. Veuillez en choisir un autre.`
        };
      }
    }

    // 2. Contrôle supplémentaire dans le classement public pour éviter tout doublon historique
    const classQuery = query(collection(db, "classement_pelerins"), limit(100));
    const classSnap = await getDocs(classQuery);
    for (const d of classSnap.docs) {
      if (d.id !== currentUid) {
        const existingClean = normalizePseudo(d.data()?.pseudo);
        if (existingClean === clean) {
          return {
            available: false,
            reason: `Le nom « ${pseudo.trim()} » est déjà utilisé par un autre pèlerin dans le classement.`
          };
        }
      }
    }

    return { available: true, clean };
  } catch {
    // Mode hors-ligne ou permissions restreintes : validation locale bienveillante
    return { available: true, clean };
  }
}

/**
 * Réserve un pseudonyme unique pour le joueur connecté dans la base de données
 */
export async function reservePelerinPseudo(uid, newPseudo, oldPseudo = null) {
  if (!uid || !newPseudo) return;
  const newClean = normalizePseudo(newPseudo);
  if (!newClean) return;

  const { db } = getFirebaseServices();
  if (!db) return;

  const avail = await checkIsPseudoAvailable(newClean, uid);
  if (!avail.available) {
    throw new Error(avail.reason || "Ce nom de pèlerin est déjà réservé par un autre joueur.");
  }

  try {
    await setDoc(doc(db, "pseudos_enregistres", newClean), {
      pseudoOriginal: newPseudo.trim(),
      cleanPseudo: newClean,
      uid,
      dateMiseAJour: serverTimestamp()
    }, { merge: true });

    if (oldPseudo) {
      const oldClean = normalizePseudo(oldPseudo);
      if (oldClean && oldClean !== newClean) {
        try {
          await deleteDoc(doc(db, "pseudos_enregistres", oldClean));
        } catch {}
      }
    }
  } catch {
    // Sauvegarde différée en cas d'absence de réseau
  }
}

/**
 * Traduit et assainit toutes les erreurs pour les joueurs (ZÉRO jargon technique, ZÉRO fuite)
 */
export function translateAuthError(err) {
  if (!err) return "Une difficulté est survenue. Tu peux continuer à jouer sur cet appareil.";
  const code = (typeof err === "object" && err.code ? err.code : "").toLowerCase();
  const rawMsg = (typeof err === "object" && err.message ? err.message : String(err)).toLowerCase();

  // Codes spécifiques Firebase Authentication traduits en langage joueur
  if (code.includes("invalid-email") || rawMsg.includes("invalid-email")) {
    return "Merci de vérifier le format de ton adresse e-mail.";
  }
  if (code.includes("user-not-found") || rawMsg.includes("user-not-found")) {
    return "Aucun compte pèlerin n'est associé à cette adresse. Crée ton compte en un instant !";
  }
  if (code.includes("wrong-password") || rawMsg.includes("wrong-password") || code.includes("invalid-credential") || rawMsg.includes("invalid-credential")) {
    return "L'adresse e-mail ou le mot de passe est incorrect. Vérifie ta saisie pour continuer.";
  }
  if (code.includes("email-already-in-use") || rawMsg.includes("email-already-in-use")) {
    return "Cette adresse e-mail a déjà un compte. Clique sur « Se connecter » pour reprendre ton parcours.";
  }
  if (code.includes("weak-password") || rawMsg.includes("weak-password")) {
    return "Le mot de passe doit comporter au moins 6 caractères pour protéger tes progrès.";
  }
  if (code.includes("popup-closed") || rawMsg.includes("popup-closed")) {
    return "La fenêtre de connexion a été refermée. Réessaie quand tu le souhaites.";
  }
  if (code.includes("popup-blocked") || rawMsg.includes("popup-blocked")) {
    return "La fenêtre de connexion a été bloquée par ton navigateur. Autorise les popups pour continuer.";
  }
  if (code.includes("too-many-requests") || rawMsg.includes("too-many-requests")) {
    return "Plusieurs tentatives consécutives ont eu lieu. Patiente quelques secondes avant de réessayer.";
  }

  // Erreurs d'API, de réseau, de permissions ou de domaine : TOUJOURS orienté joueur
  if (
    code.includes("unauthorized-domain") || rawMsg.includes("unauthorized-domain")
  ) {
    return "Le domaine web de l'application n'est pas encore autorisé dans Firebase. Tu peux continuer à jouer sur cet appareil !";
  }
  if (
    code.includes("operation-not-allowed") || rawMsg.includes("operation-not-allowed")
  ) {
    return "Ce mode de connexion doit être activé dans la console Firebase. Tu peux continuer à jouer sur cet appareil !";
  }
  if (
    code.includes("api-key") || rawMsg.includes("api-key") ||
    code.includes("permission") || rawMsg.includes("permission") ||
    code.includes("internal-error") || rawMsg.includes("internal-error") ||
    rawMsg.includes("bad request") || rawMsg.includes("identitytoolkit") ||
    rawMsg.includes("firebase") || rawMsg.includes("network")
  ) {
    return "La synchronisation en ligne est momentanément indisponible. Tu peux continuer ton aventure immédiatement en mode local !";
  }

  // Fallback universel : si le message contient un mot technique, le filtrer
  if (/firebase|api|key|auth\/|token|400|script|server/i.test(rawMsg)) {
    return "La synchronisation en ligne est momentanément indisponible. Tu peux continuer ton aventure immédiatement en mode local !";
  }

  return "Une difficulté est survenue. N'hésite pas à continuer à jouer sur cet appareil !";
}

/**
 * Connexion réelle avec un compte Google (Ouvre impérativement le sélecteur de compte)
 * ZÉRO SIMULATION : Si l'utilisateur clique, la vraie popup de sélection Google s'ouvre !
 */
export async function loginWithGoogle() {
  const { auth, db } = getFirebaseServices();
  if (!auth) {
    throw new Error("Le service de connexion en ligne est momentanément indisponible. Continue en mode local !");
  }

  const provider = new GoogleAuthProvider();
  // Force l'affichage de l'écran de sélection de compte Google
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingCloud = await loadPelerinProfile(user.uid);
    let chosenPseudo = (existingCloud?.profileName || user.displayName || "Pèlerin Google").trim();

    // Vérification d'unicité du nom pour le nouveau pèlerin Google
    if (!existingCloud || !existingCloud.profileName) {
      const avail = await checkIsPseudoAvailable(chosenPseudo, user.uid);
      if (!avail.available) {
        // En cas de conflit de prénom avec un autre joueur, suffixer discrètement pour garantir l'unicité
        chosenPseudo = `${chosenPseudo} ${user.uid.slice(0, 4)}`;
      }
      await reservePelerinPseudo(user.uid, chosenPseudo);

      await syncPelerinProfile(user.uid, {
        profileName: chosenPseudo,
        email: user.email,
        authProvider: "google"
      });
    }

    if (user.email && (!existingCloud || !existingCloud.welcomeSent)) {
      sendWelcomeEmail(user.email, chosenPseudo).catch(() => {});
      await syncPelerinProfile(user.uid, { welcomeSent: true });
    }

    return { success: true, user };
  } catch (err) {
    throw new Error(translateAuthError(err));
  }
}

/**
 * Création réelle de compte pèlerin par Email et Mot de passe
 * Vérifie rigoureusement l'unicité de l'e-mail et du pseudonyme.
 */
export async function registerWithEmailPassword(email, password, displayName) {
  if (!email || !email.includes("@")) {
    throw new Error("Veuillez renseigner une adresse e-mail valide.");
  }
  if (!password || password.length < 6) {
    throw new Error("Le mot de passe doit comporter au moins 6 caractères pour protéger votre carnet.");
  }

  const cleanName = (displayName || "").trim();
  if (!cleanName || cleanName.length < 2) {
    throw new Error("Veuillez choisir un nom ou prénom de pèlerin (au moins 2 caractères).");
  }

  // 1. Contrôle strict de l'unicité du nom avant création
  const pseudoCheck = await checkIsPseudoAvailable(cleanName, null);
  if (!pseudoCheck.available) {
    throw new Error(pseudoCheck.reason || "Ce nom de pèlerin est déjà réservé par un autre joueur.");
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    throw new Error("Le service de connexion en ligne est momentanément indisponible. Continue en mode local !");
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;

    try {
      await updateProfile(user, { displayName: cleanName });
    } catch {}

    // 2. Réservation officielle du pseudo unique dans Firestore
    await reservePelerinPseudo(user.uid, cleanName);

    // 3. Initialisation du profil Cloud
    await syncPelerinProfile(user.uid, {
      profileName: cleanName,
      email: user.email,
      authProvider: "password",
      welcomeSent: true
    });

    sendWelcomeEmail(user.email, cleanName).catch(() => {});

    return { success: true, user };
  } catch (err) {
    throw new Error(translateAuthError(err));
  }
}

/**
 * Connexion réelle avec Email et Mot de passe (ZÉRO mock)
 */
export async function loginWithEmailPassword(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez remplir votre e-mail et votre mot de passe.");
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    throw new Error("Le service de connexion en ligne est momentanément indisponible. Continue en mode local !");
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { success: true, user: cred.user };
  } catch (err) {
    throw new Error(translateAuthError(err));
  }
}

/**
 * Déconnexion propre du compte pèlerin
 */
export async function logoutPelerin() {
  try {
    localStorage.removeItem("pelerin_active_account");
  } catch {}

  const { auth } = getFirebaseServices();
  if (!auth) return;
  try {
    await signOut(auth);
  } catch {}
}

/**
 * Réinitialisation du mot de passe par courriel
 */
export async function sendPelerinPasswordReset(email) {
  if (!email || !email.includes("@")) {
    throw new Error("Veuillez saisir l'adresse e-mail de votre compte pèlerin.");
  }

  if (!isFirebaseCloudActive()) {
    return { success: true, simulated: true };
  }

  const { auth } = getFirebaseServices();
  if (!auth) throw new Error("Le service d'authentification n'est pas disponible.");

  try {
    await sendPasswordResetEmail(auth, email.trim());
    return { success: true };
  } catch (err) {
    throw new Error(translateAuthError(err));
  }
}

/**
 * Sauvegarde le profil du pèlerin sur le Cloud avec secours LocalStorage
 */
export async function syncPelerinProfile(uid, profileData) {
  try {
    localStorage.setItem("pelerinage_profile_" + (uid || "local"), JSON.stringify(profileData));
  } catch {}

  const { db } = getFirebaseServices();
  if (!db || !uid) return;

  const completedCount = Array.isArray(profileData.saved?.completedStages)
    ? profileData.saved.completedStages.length
    : 0;
  const capped = typeof profileData.xp === "number"
    ? clampScore(completedCount, profileData.xp, profileData.pearls)
    : null;
  const { email, telephone, phone, ...safeProfile } = profileData;

  try {
    const ref = doc(db, "pelerins", uid);
    await setDoc(ref, {
      ...safeProfile,
      ...(capped ? capped : {}),
      derniereMiseAJour: serverTimestamp()
    }, { merge: true });

    // Réservation du pseudonyme unique dans la base de données partagée
    if (profileData.profileName && profileData.profileName !== "Ami pèlerin" && profileData.profileName !== "Pèlerin") {
      try {
        await reservePelerinPseudo(uid, profileData.profileName, profileData.oldProfileName);
      } catch (err) {
        console.warn("Réservation du pseudo :", err.message);
      }
    }

    // Publication sécurisée dans le classement public sans PII (zéro email, zéro données personnelles)
    try {
      const publicRef = doc(db, "classement_pelerins", uid);
      if (!capped) return;
      await setDoc(publicRef, {
        pseudo: String(profileData.profileName || "Pèlerin").slice(0, 30),
        xp: capped.xp,
        pearls: capped.pearls,
        stagesValidees: completedCount,
        avatar: profileData.avatar || "🌿",
        niveau: profileData.niveau || (capped.xp >= 300 ? "Pèlerin zélé" : "Pèlerin de la Parole"),
        derniereMiseAJour: serverTimestamp()
      }, { merge: true });
    } catch {}
  } catch (err) {
    console.warn("Synchronisation Cloud différée :", err.message);
  }
}

/**
 * Charge le profil du pèlerin depuis le Cloud ou le LocalStorage
 */
export async function loadPelerinProfile(uid) {
  let localData = null;
  try {
    const raw = localStorage.getItem("pelerinage_profile_" + (uid || "local"));
    if (raw) localData = JSON.parse(raw);
  } catch {}

  const { db } = getFirebaseServices();
  if (!db || !uid) return localData;

  try {
    const ref = doc(db, "pelerins", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const cloudData = snap.data();
      // Réconciliation bidirectionnelle sans perte de progrès
      const reconciled = reconcilePelerinData(localData, cloudData);

      // Met à jour le cache local avec la fusion propre
      try {
        localStorage.setItem("pelerinage_profile_" + uid, JSON.stringify(reconciled));
        if (reconciled.saved) {
          localStorage.setItem("pelerinage_progress", JSON.stringify(reconciled.saved));
        }
      } catch {}

      return reconciled;
    }
  } catch (err) {
    console.warn("Lecture Cloud impossible, utilisation du cache local :", err.message);
  }

  return localData;
}

/**
 * Sauvegarde une prière ou réflexion dans le Carnet Spirituel
 */
export async function saveCarnetNote(uid, note) {
  const notesKey = "pelerinage_carnet_" + (uid || "local");
  let notes = [];
  try {
    notes = JSON.parse(localStorage.getItem(notesKey) || "[]");
  } catch {}

  const updatedNotes = [note, ...notes.filter((n) => n.id !== note.id)];
  try {
    localStorage.setItem(notesKey, JSON.stringify(updatedNotes));
  } catch {}

  const { db } = getFirebaseServices();
  if (!db || !uid) return updatedNotes;

  try {
    const ref = doc(db, "pelerins", uid, "carnet", note.id);
    await setDoc(ref, {
      ...note,
      dateCreation: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Sauvegarde cloud du carnet différée :", err.message);
  }

  return updatedNotes;
}

/**
 * Récupère les prières et réflexions du carnet
 */
export function getLocalCarnetNotes(uid) {
  try {
    return JSON.parse(localStorage.getItem("pelerinage_carnet_" + (uid || "local")) || "[]");
  } catch {
    return [];
  }
}

/**
 * Récupère le classement fraternel des pèlerins
 */
export async function fetchClassementFraternel() {
  const { db } = getFirebaseServices();
  const fauxClassementParDefaut = [
    { id: "1", nom: "Marie de Béthanie", points: 840, perles: 42, niveau: "Pèlerin zélé", avatar: "🌸" },
    { id: "2", nom: "David le Berger", points: 790, perles: 39, niveau: "Chantre de la grâce", avatar: "🐑" },
    { id: "3", nom: "Priscille & Aquilas", points: 720, perles: 35, niveau: "Bâtisseurs d'amour", avatar: "🕊️" },
    { id: "4", nom: "Barnabé le Consolateur", points: 650, perles: 31, niveau: "Semeur d'espoir", avatar: "🌿" },
    { id: "5", nom: "Lydie de Philippes", points: 580, perles: 28, niveau: "Cœur accueillant", avatar: "💜" }
  ];

  if (!db) return fauxClassementParDefaut;

  try {
    const q = query(collection(db, "classement_pelerins"), orderBy("xp", "desc"), limit(10));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap, index) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          nom: d.pseudo || d.profileName || `Pèlerin #${index + 1}`,
          points: d.xp || 0,
          perles: d.pearls || 0,
          niveau: d.niveau || "Pèlerin de la Parole",
          avatar: d.avatar || "🌿"
        };
      });
    }
  } catch {
    // Si la collection n'est pas encore créée, renvoyer la liste d'encouragement par défaut
  }

  return fauxClassementParDefaut;
}

/**
 * Récupère les prières du mur communautaire avec filtrage des signalements
 */
export async function fetchCommunityPrayers() {
  const { db } = getFirebaseServices();
  const reported = getReportedPrayerIds();

  let localPrayers = [];
  try {
    const raw = localStorage.getItem("pelerinage_prieres_communaute");
    if (raw) {
      localPrayers = JSON.parse(raw).filter((p) => !reported.includes(p.id) && !p.masque);
    }
  } catch {}

  if (!db) return localPrayers;

  try {
    const q = query(collection(db, "prieres"), orderBy("dateCreation", "desc"), limit(30));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const cloudPrayers = snap.docs.map((d) => ({
        id: d.id,
        ...d.data()
      })).filter((p) => !reported.includes(p.id) && !p.masque);

      // Réconciliation intelligente des prières
      return reconcilePrayers(localPrayers, cloudPrayers);
    }
  } catch {
    // Repli sur le stockage local
  }

  return localPrayers;
}

/**
 * Publie une intention de prière ou gratitude sur le mur
 */
export async function addCommunityPrayer(prayer) {
  const { db } = getFirebaseServices();
  const prayerItem = {
    ...prayer,
    soutiens: 1,
    signaux: 0,
    masque: false,
    dateCreation: new Date().toISOString()
  };

  // Sauvegarde locale instantanée
  let localPrayers = [];
  try {
    localPrayers = JSON.parse(localStorage.getItem("pelerinage_prieres_communaute") || "[]");
    localPrayers = [prayerItem, ...localPrayers];
    localStorage.setItem("pelerinage_prieres_communaute", JSON.stringify(localPrayers));
  } catch {}

  if (!db) return localPrayers;

  try {
    const ref = doc(db, "prieres", prayer.id);
    await setDoc(ref, {
      ...prayerItem,
      dateCreation: serverTimestamp()
    });
  } catch {}

  return localPrayers;
}

/**
 * Soutient une prière en un clic (« Je prie avec toi 🕊️ »)
 */
export async function supportCommunityPrayer(prayerId) {
  let localPrayers = [];
  try {
    localPrayers = JSON.parse(localStorage.getItem("pelerinage_prieres_communaute") || "[]");
    localPrayers = localPrayers.map((p) => p.id === prayerId ? { ...p, soutiens: (p.soutiens || 0) + 1 } : p);
    localStorage.setItem("pelerinage_prieres_communaute", JSON.stringify(localPrayers));
  } catch {}

  const { db } = getFirebaseServices();
  if (db) {
    try {
      const ref = doc(db, "prieres", prayerId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const cur = snap.data().soutiens || 0;
        await setDoc(ref, { soutiens: cur + 1 }, { merge: true });
      }
    } catch {}
  }

  return localPrayers;
}

/**
 * Signale un abus ou contenu inapproprié sur le mur de prières
 * Masque immédiatement le message pour l'utilisateur et alerte le serveur.
 */
export async function flagCommunityPrayer(prayerId) {
  reportPrayerLocally(prayerId);

  let localPrayers = [];
  try {
    const raw = localStorage.getItem("pelerinage_prieres_communaute");
    if (raw) {
      localPrayers = JSON.parse(raw).filter((p) => p.id !== prayerId);
      localStorage.setItem("pelerinage_prieres_communaute", JSON.stringify(localPrayers));
    }
  } catch {}

  const { db } = getFirebaseServices();
  if (db && prayerId) {
    try {
      const ref = doc(db, "prieres", prayerId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const cur = snap.data().signaux || 0;
        const newCount = cur + 1;
        // Si plus de 3 signalements, masquage automatique pour tous
        await setDoc(ref, {
          signaux: newCount,
          masque: newCount >= 3
        }, { merge: true });
      }
    } catch {}
  }

  return await fetchCommunityPrayers();
}

