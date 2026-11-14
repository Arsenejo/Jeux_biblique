/**
 * PHASE 6 — Synchronisation Cloud Firestore des Groupes d'Église & Défis Collectifs
 * Préserve la compatibilité avec churchGroup.js local en mode hors-ligne.
 */

import { doc, getDoc, setDoc, collection, getDocs, query, limit, serverTimestamp } from "firebase/firestore";
import { getFirebaseServices } from "./firebase.js";
import { normalizeGroupCode, saveGroup, loadGroup } from "./churchGroup.js";

export const COLLECTIVE_CHALLENGES = [
  { id: "col-read-jean", titre: "Lire ensemble l'Évangile de Jean", icone: "📖", objectif: 21, unite: "chapitres lus" },
  { id: "col-memo-10", titre: "Mémoriser 10 versets ensemble", icone: "🌱", objectif: 10, unite: "versets ancrés" },
  { id: "col-games-100", titre: "Réaliser 100 parties collectives", icone: "🎮", objectif: 100, unite: "parties jouées" },
  { id: "col-path-1", titre: "Terminer une époque biblique en équipe", icone: "🗺️", objectif: 10, unite: "étapes validées" }
];

export async function createCloudChurchGroup({ nom = "Assemblée de la Grâce — Issia", ownerName = "Responsable", uid = null } = {}) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const cleanName = String(nom || "Groupe d'Église").trim().slice(0, 50) || "Groupe d'Église";
  const record = {
    code,
    nom: cleanName,
    ownerUid: uid || "local",
    ownerName: String(ownerName || "Responsable").slice(0, 30),
    createdAt: Date.now(),
    members: [{ name: String(ownerName || "Responsable").slice(0, 30), role: "responsable", xp: 0, memorized: 0 }],
    challengeProgress: {
      "col-read-jean": 1,
      "col-memo-10": 1,
      "col-games-100": 1,
      "col-path-1": 1
    },
    weekDone: {}
  };

  saveGroup(record);

  const { db, auth } = getFirebaseServices();
  const currentUid = auth?.currentUser?.uid || uid;
  if (db && currentUid) {
    try {
      await setDoc(doc(db, "groupes_eglise", code), {
        ...record,
        ownerUid: currentUid,
        updatedAt: serverTimestamp()
      });
    } catch {}
  }

  return record;
}

export async function joinCloudChurchGroup({ code, memberName = "Pèlerin", memberStats = {} }) {
  const clean = normalizeGroupCode(code);
  if (clean.length !== 6) {
    return { ok: false, error: "Le code d'invitation comporte exactement 6 caractères." };
  }

  const { db, auth } = getFirebaseServices();
  const currentUid = auth?.currentUser?.uid || null;
  let remoteGroup = null;

  if (db && currentUid) {
    try {
      const ref = doc(db, "groupes_eglise", clean);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        remoteGroup = snap.data();
        const existingMembers = Array.isArray(remoteGroup.members) ? remoteGroup.members : [];
        const cleanMemberName = String(memberName || "Pèlerin").slice(0, 30);
        const already = existingMembers.some((m) => m.name === cleanMemberName);
        const updatedMembers = already
          ? existingMembers.map((m) =>
              m.name === cleanMemberName
                ? { ...m, xp: memberStats.xp || m.xp || 0, memorized: memberStats.memorized || m.memorized || 0 }
                : m
            )
          : [...existingMembers, { name: cleanMemberName, role: "membre", xp: memberStats.xp || 0, memorized: memberStats.memorized || 0 }];

        remoteGroup = { ...remoteGroup, members: updatedMembers };
        await setDoc(ref, { members: updatedMembers, updatedAt: serverTimestamp() }, { merge: true });
      }
    } catch {}
  }

  const groupRecord = remoteGroup || {
    code: clean,
    nom: `Groupe ${clean}`,
    createdAt: Date.now(),
    members: [{ name: String(memberName || "Pèlerin").slice(0, 30), role: "membre", xp: memberStats.xp || 0, memorized: memberStats.memorized || 0 }],
    challengeProgress: { "col-read-jean": 1, "col-memo-10": 1, "col-games-100": 1, "col-path-1": 1 },
    weekDone: {}
  };

  saveGroup(groupRecord);
  return { ok: true, group: groupRecord, syncedCloud: Boolean(remoteGroup) };
}

export async function contributeCollectiveChallenge(challengeId, amount = 1) {
  const current = loadGroup() || { code: "EEAG01", nom: "Assemblée de la Grâce", createdAt: Date.now(), weekDone: {}, challengeProgress: {} };
  const prevProgress = current.challengeProgress && typeof current.challengeProgress === "object" ? current.challengeProgress : {};
  const nextCount = Math.max(0, (Number(prevProgress[challengeId]) || 0) + Math.max(1, Number(amount) || 1));
  const updated = {
    ...current,
    challengeProgress: {
      ...prevProgress,
      [challengeId]: nextCount
    }
  };
  saveGroup(updated);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && updated.code?.length === 6) {
    try {
      await setDoc(
        doc(db, "groupes_eglise", updated.code),
        { code: updated.code, nom: updated.nom || `Groupe ${updated.code}`, challengeProgress: updated.challengeProgress, updatedAt: serverTimestamp() },
        { merge: true }
      );
    } catch {}
  }
  return updated;
}

export async function fetchCloudGroupsOverview() {
  const { db, auth } = getFirebaseServices();
  if (!db || !auth?.currentUser?.uid) return [];
  try {
    const snap = await getDocs(query(collection(db, "groupes_eglise"), limit(20)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

