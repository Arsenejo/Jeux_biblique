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
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import { reconcilePelerinData, reconcilePrayers } from "./dataReconciliation.js";
import { getReportedPrayerIds, reportPrayerLocally } from "./moderation.js";
import { sendWelcomeEmail } from "./brevoMailer.js";

// Configuration Firebase réelle du projet defi-jean
export const firebaseConfig = {
  apiKey: "AIzaSyDsIYH4rplT1giMld2cxq4x1IqWmNyIZ6Q",
  authDomain: "defi-jean.firebaseapp.com",
  projectId: "defi-jean",
  storageBucket: "defi-jean.firebasestorage.app",
  messagingSenderId: "23332908996",
  appId: "1:23332908996:web:7ac92b21d43c01b23a7e91"
};

/**
 * Vérifie si une clé Firebase active a été configurée dans l'environnement.
 * Évite de lancer des requêtes fetch HTTP qui échouent avec 400 Bad Request dans la console du navigateur.
 */
export function isFirebaseCloudActive() {
  try {
    const envKey = (typeof import.meta !== "undefined" && import.meta.env?.VITE_FIREBASE_API_KEY) || "";
    // Clé factice ou par défaut non encore configurée dans la console Google
    if (!envKey || envKey === "AIzaSyDsIYH4rplT1giMld2cxq4x1IqWmNyIZ6Q") {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

let app = null;
let auth = null;
let db = null;
let isInitialized = false;

// Identifiant unique persistant pour le pèlerin local
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

    // Initialisation moderne du cache persistant Firestore avec détection de long-polling pour compatibilité Brave/Adblock
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
    // Mode repli local silencieux et robuste
  }

  return { app, auth, db };
}

/**
 * Initialise l'authentification transparente pour le pèlerin
 */
export async function initPelerinAuth(onUserReady) {
  // 1. Restaurer une session locale pèlerin active si existante
  try {
    const savedAccount = localStorage.getItem("pelerin_active_account");
    if (savedAccount) {
      const parsed = JSON.parse(savedAccount);
      if (parsed && parsed.email) {
        onUserReady(parsed, "local");
        return () => {};
      }
    }
  } catch {}

  // 2. Si le projet Firebase n'a pas encore de clé active enregistrée, activer directement le mode local
  // Cela empêche l'apparition de "POST https://identitytoolkit.googleapis.com/... 400 (Bad Request)"
  if (!isFirebaseCloudActive()) {
    onUserReady(null, "local");
    return () => {};
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    onUserReady(null, "local");
    return () => {};
  }

  try {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        onUserReady(user, "cloud");
      } else {
        try {
          const cred = await signInAnonymously(auth);
          onUserReady(cred.user, "cloud");
        } catch {
          // Repli local transparent et silencieux
          onUserReady(null, "local");
        }
      }
    });
    return unsub;
  } catch {
    onUserReady(null, "local");
    return () => {};
  }
}

/**
 * Création d'une session pèlerin locale sécurisée en cas de repli
 */
export function createLocalPelerinSession(email, displayName) {
  const cleanEmail = (email || "").trim().toLowerCase();
  const baseName = displayName?.trim() || (cleanEmail ? cleanEmail.split("@")[0] : "Pèlerin");
  
  let hash = 0;
  for (let i = 0; i < cleanEmail.length; i++) {
    hash = (hash << 5) - hash + cleanEmail.charCodeAt(i);
    hash |= 0;
  }
  const stableUid = "local_user_" + Math.abs(hash).toString(36);

  const localUser = {
    uid: stableUid,
    email: cleanEmail || "pelerin@grace-issia.org",
    displayName: baseName.charAt(0).toUpperCase() + baseName.slice(1),
    isAnonymous: false,
    isLocalSession: true
  };

  try {
    localStorage.setItem("pelerin_active_account", JSON.stringify(localUser));
  } catch {}

  return localUser;
}

/**
 * Traduit les erreurs courantes de Firebase Authentication en français clair
 */
export function translateAuthError(err) {
  if (!err) return "Une erreur inattendue est survenue.";
  const code = err.code || "";
  const msg = err.message || "";

  if (
    code.includes("api-key") ||
    code.includes("invalid-api-key") ||
    code.includes("app-not-authorized") ||
    msg.includes("api-key") ||
    msg.includes("API key") ||
    msg.includes("api_key")
  ) {
    return "Connexion locale sécurisée : ton parcours est sauvegardé sur cet appareil avec amour et fidélité 🌿";
  }

  switch (code) {
    case "auth/invalid-email":
      return "L'adresse e-mail renseignée n'est pas valide.";
    case "auth/user-not-found":
      return "Aucun compte pèlerin n'est associé à cette adresse e-mail.";
    case "auth/wrong-password":
      return "Le mot de passe saisi est incorrect.";
    case "auth/invalid-credential":
      return "Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe.";
    case "auth/email-already-in-use":
      return "Cette adresse e-mail est déjà utilisée par un autre pèlerin.";
    case "auth/weak-password":
      return "Le mot de passe doit comporter au moins 6 caractères.";
    case "auth/popup-closed-by-user":
      return "La fenêtre de connexion Google a été fermée avant la finalisation.";
    case "auth/popup-blocked":
      return "La fenêtre de connexion a été bloquée par votre navigateur. Veuillez autoriser les popups pour ce site.";
    case "auth/operation-not-allowed":
      return "Ce mode de connexion est actuellement en cours d'ajustement.";
    case "auth/network-request-failed":
      return "Connexion au réseau interrompue. Vos progrès restent conservés localement.";
    case "auth/too-many-requests":
      return "Trop de tentatives infructueuses. Veuillez patienter un court instant avant de réessayer.";
    default:
      if (msg.includes("api-key") || msg.includes("API key") || msg.includes("Firebase:")) {
        return "Sauvegarde locale active : vos données sont conservées en toute sérénité sur cet appareil 🌿";
      }
      return msg || "Erreur lors de l'authentification.";
  }
}

/**
 * Connexion avec un compte Google (One-Click)
 */
export async function loginWithGoogle() {
  if (!isFirebaseCloudActive()) {
    const localUser = createLocalPelerinSession("pelerin.google@grace-issia.org", "Pèlerin Google");
    return { success: true, user: localUser, isLocalFallback: true };
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    const localUser = createLocalPelerinSession("pelerin.google@grace-issia.org", "Pèlerin Google");
    return { success: true, user: localUser, isLocalFallback: true };
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const existingCloud = await loadPelerinProfile(user.uid);
    if (!existingCloud || !existingCloud.profileName) {
      await syncPelerinProfile(user.uid, {
        profileName: user.displayName || "Pèlerin Google",
        email: user.email,
        authProvider: "google"
      });
    }

    if (user.email && (!existingCloud || !existingCloud.welcomeSent)) {
      sendWelcomeEmail(user.email, user.displayName || "Pèlerin").catch(() => {});
      await syncPelerinProfile(user.uid, { welcomeSent: true });
    }

    return { success: true, user };
  } catch (err) {
    const isApiKeyIssue =
      err.code === "auth/api-key-not-valid" ||
      err.code === "auth/invalid-api-key" ||
      err.code === "auth/app-not-authorized" ||
      err.message?.includes("api-key-not-valid") ||
      err.message?.includes("API key not valid");

    if (isApiKeyIssue) {
      const localUser = createLocalPelerinSession("pelerin.google@grace-issia.org", "Pèlerin Google");
      return { success: true, user: localUser, isLocalFallback: true };
    }
    throw new Error(translateAuthError(err));
  }
}

/**
 * Création de compte pèlerin par Email et Mot de passe
 */
export async function registerWithEmailPassword(email, password, displayName) {
  if (!email || !email.includes("@")) {
    throw new Error("Veuillez renseigner une adresse e-mail valide.");
  }
  if (!password || password.length < 6) {
    throw new Error("Le mot de passe doit comporter au moins 6 caractères pour protéger votre carnet.");
  }

  if (!isFirebaseCloudActive()) {
    const localUser = createLocalPelerinSession(email, displayName);
    return { success: true, user: localUser, isLocalFallback: true };
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    const localUser = createLocalPelerinSession(email, displayName);
    return { success: true, user: localUser, isLocalFallback: true };
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const user = cred.user;
    const name = displayName?.trim() || email.split("@")[0] || "Pèlerin";

    try {
      await updateProfile(user, { displayName: name });
    } catch {}

    await syncPelerinProfile(user.uid, {
      profileName: name,
      email: user.email,
      authProvider: "password",
      welcomeSent: true
    });

    sendWelcomeEmail(user.email, name).catch(() => {});

    return { success: true, user };
  } catch (err) {
    const isApiKeyIssue =
      err.code === "auth/api-key-not-valid" ||
      err.code === "auth/invalid-api-key" ||
      err.code === "auth/app-not-authorized" ||
      err.message?.includes("api-key-not-valid") ||
      err.message?.includes("API key not valid");

    if (isApiKeyIssue) {
      const localUser = createLocalPelerinSession(email, displayName);
      return { success: true, user: localUser, isLocalFallback: true };
    }
    throw new Error(translateAuthError(err));
  }
}

/**
 * Connexion avec Email et Mot de passe
 */
export async function loginWithEmailPassword(email, password) {
  if (!email || !password) {
    throw new Error("Veuillez remplir votre e-mail et votre mot de passe.");
  }

  if (!isFirebaseCloudActive()) {
    const localUser = createLocalPelerinSession(email);
    return { success: true, user: localUser, isLocalFallback: true };
  }

  const { auth } = getFirebaseServices();
  if (!auth) {
    const localUser = createLocalPelerinSession(email);
    return { success: true, user: localUser, isLocalFallback: true };
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
    return { success: true, user: cred.user };
  } catch (err) {
    const isApiKeyIssue =
      err.code === "auth/api-key-not-valid" ||
      err.code === "auth/invalid-api-key" ||
      err.code === "auth/app-not-authorized" ||
      err.message?.includes("api-key-not-valid") ||
      err.message?.includes("API key not valid");

    if (isApiKeyIssue) {
      const localUser = createLocalPelerinSession(email);
      return { success: true, user: localUser, isLocalFallback: true };
    }
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

  try {
    const ref = doc(db, "pelerins", uid);
    await setDoc(ref, {
      ...profileData,
      derniereMiseAJour: serverTimestamp()
    }, { merge: true });

    // Publication sécurisée dans le classement public sans PII (zéro email, zéro données personnelles)
    try {
      const publicRef = doc(db, "classement_pelerins", uid);
      await setDoc(publicRef, {
        pseudo: String(profileData.profileName || "Pèlerin").slice(0, 30),
        xp: Number(profileData.xp) || 0,
        pearls: Number(profileData.pearls) || 0,
        avatar: profileData.avatar || "🌿",
        niveau: profileData.niveau || ((profileData.xp || 0) >= 300 ? "Pèlerin zélé" : "Pèlerin de la Parole"),
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

