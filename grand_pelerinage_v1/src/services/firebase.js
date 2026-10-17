import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
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
import { reconcilePelerinData, reconcilePrayers } from "./dataReconciliation";
import { getReportedPrayerIds, reportPrayerLocally } from "./moderation";

// Configuration Firebase réelle du projet defi-jean
export const firebaseConfig = {
  apiKey: "AIzaSyDsIYH4rplT1giMld2cxq4x1IqWmNyIZ6Q",
  authDomain: "defi-jean.firebaseapp.com",
  projectId: "defi-jean",
  storageBucket: "defi-jean.firebasestorage.app",
  messagingSenderId: "23332908996",
  appId: "1:23332908996:web:7ac92b21d43c01b23a7e91",
  measurementId: "G-JDRRPPV15D"
};

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

    // Initialisation moderne du cache persistant Firestore pour Firebase 11
    try {
      db = initializeFirestore(app, {
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
 * Initialise l'authentification anonyme transparente pour le pèlerin
 */
export async function initPelerinAuth(onUserReady) {
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
        } catch (authErr) {
          console.warn("Connexion anonyme impossible, repli local :", authErr.message);
          onUserReady(null, "local");
        }
      }
    });
    return unsub;
  } catch (e) {
    onUserReady(null, "local");
    return () => {};
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
    const q = query(collection(db, "pelerins"), orderBy("xp", "desc"), limit(10));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.map((docSnap, index) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          nom: d.profileName || `Pèlerin #${index + 1}`,
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

