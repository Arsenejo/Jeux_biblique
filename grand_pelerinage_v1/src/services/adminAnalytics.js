/**
 * PHASE 7 — Service d'Analyse Pédagogique et Administration Responsables d'Église
 *
 * Confidentialité stricte : manipule exclusivement des statistiques agrégées,
 * les annonces officielles d'Église (/annonces_eglise) et la modération du mur public.
 * Aucun accès aux carnets spirituels privés ni aux e-mails/téléphones.
 */

import { collection, doc, setDoc, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { getFirebaseServices } from "./firebase.js";

export const LOCAL_ANNOUNCEMENTS_KEY = "pelerinage_annonces_eglise";

export function buildChurchAdminMetrics({
  leaderboard = [],
  groups = [],
  prayers = [],
  memorizationStats = {},
  completedStages = [],
  gameStats = {}
} = {}) {
  const activePilgrims = Math.max(1, leaderboard.length);
  const totalCompletedStages = leaderboard.reduce((sum, u) => sum + (Number(u.stagesValidees) || 0), 0) + (completedStages?.length || 0);
  const avgRetention = Number(memorizationStats?.successRate) || 0;

  return {
    activePilgrims,
    groupsCount: Math.max(1, groups.length),
    totalCompletedStages,
    memorizedVerses: Number(memorizationStats?.masteredCount) || 0,
    delayedSuccessRate: avgRetention,
    gamesPlayed: Object.values(gameStats || {}).reduce((s, n) => s + (Number(n) || 0), 0),
    prayersPublished: prayers.length,
    reportedPrayersCount: prayers.filter((p) => (p.signaux || 0) > 0).length
  };
}

export function getPedagogicalDifficultyInsights(completedStages = [], EPOCH_STAGES = {}) {
  const insights = [];
  Object.entries(EPOCH_STAGES || {}).forEach(([epochId, stages]) => {
    const total = stages.length || 1;
    const done = stages.filter((s) => completedStages.includes(s.id)).length;
    const rate = Math.round((done / total) * 100);
    insights.push({
      epochId,
      total,
      done,
      completionPct: rate,
      status: rate < 25 ? "À accompagner (démarrage)" : rate < 75 ? "En progression" : "Bien assimilée"
    });
  });
  return insights;
}

export function loadLocalAnnouncements() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(LOCAL_ANNOUNCEMENTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function publishChurchAnnouncement({ titre, texte, auteur = "Responsable EEAG Issia" }) {
  const cleanTitle = String(titre || "Annonce de l'Église").trim().slice(0, 60);
  const cleanText = String(texte || "").trim().slice(0, 600);
  if (cleanText.length < 5) {
    return { ok: false, error: "Le texte de l'annonce doit contenir au moins 5 caractères." };
  }

  const item = {
    id: `ann_${Date.now()}`,
    titre: cleanTitle,
    texte: cleanText,
    auteur: String(auteur || "Responsable EEAG Issia").slice(0, 40),
    createdAt: Date.now()
  };

  const existing = loadLocalAnnouncements();
  const next = [item, ...existing].slice(0, 20);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(LOCAL_ANNOUNCEMENTS_KEY, JSON.stringify(next));
    }
  } catch {}

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "annonces_eglise", item.id), {
        ...item,
        auteurId: auth.currentUser.uid,
        serverCreatedAt: serverTimestamp()
      });
    } catch {}
  }

  return { ok: true, item, announcements: next };
}

export async function fetchChurchAnnouncements() {
  const local = loadLocalAnnouncements();
  const { db } = getFirebaseServices();
  if (!db) return local;
  try {
    const q = query(collection(db, "annonces_eglise"), orderBy("createdAt", "desc"), limit(15));
    const snap = await getDocs(q);
    const cloud = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const map = new Map();
    [...cloud, ...local].forEach((a) => {
      if (a && a.id) map.set(a.id, a);
    });
    return Array.from(map.values()).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch {
    return local;
  }
}

