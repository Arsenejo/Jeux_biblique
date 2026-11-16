/**
 * PORTAIL D'ADMINISTRATION COMPLET (10 PILIERS) — /admin
 * Église Évangélique Assemblée de la Grâce, Issia (Côte d'Ivoire)
 *
 * Confidentialité & Sécurité :
 *  - Identifiant vérifié côté client par empreinte SHA-256 salée (aucun mot de passe en clair)
 *    + authentification Firebase Auth + contrôle Firestore serveur `isAdmin()`.
 *  - Zéro accès aux notes privées du Carnet Spirituel (/pelerins/{uid}/carnet).
 */

import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { getFirebaseServices } from "./firebase.js";
import { BIBLE_66_BOOKS } from "../data/bible66Books.js";

export const SUPER_ADMIN_EMAIL = "koffiayawin@gmail.com";
const ADMIN_DIGEST_SALT = "EEAG_ADMIN_V2";
const SUPER_ADMIN_DIGEST = "57ab15bae823dec3462918f58cb6362ffd4f9fe4ccf0c412889eb46c298f234e";

export const ADMIN_SESSION_KEY = "pelerinage_admin_session_v2";
export const ADMIN_RATE_LIMIT_KEY = "pelerinage_admin_attempts_v2";
export const LOCAL_ANNOUNCEMENTS_KEY = "pelerinage_annonces_eglise";
export const WEEKLY_SPIRITUAL_KEY = "pelerinage_admin_weekly_v2";
export const CAMPAIGNS_STORAGE_KEY = "pelerinage_admin_campaigns_v2";
export const CUSTOM_BIBLE_CMS_KEY = "pelerinage_custom_bible_cms_v2";
export const DYNAMIC_BLACKLIST_KEY = "pelerinage_admin_blacklist_v2";
export const ADMIN_TEAM_KEY = "pelerinage_admin_team_v2";
export const ADMIN_AUDIT_LOGS_KEY = "pelerinage_admin_audit_logs_v2";
export const SYSTEM_FLAGS_KEY = "pelerinage_admin_system_flags_v2";
export const GLOBAL_BROADCASTS_KEY = "pelerinage_admin_broadcasts_v2";

const SESSION_TTL_MS = 12 * 60 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_WINDOW_MS = 5 * 60 * 1000;

let inMemoryAttemptLog = [];

function normalizeStr(s = "") {
  return String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function readJsonStore(key, fallback) {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJsonStore(key, value) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(value));
    }
  } catch {}
  return value;
}

/**
 * Empreinte SHA-256 compatible navigateur (HTTPS), HTTP local et Node.js.
 */
function sha256PureJsHex(asciiStr) {
  const bytes = Array.from(new TextEncoder().encode(asciiStr));
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i -= 1) {
    bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);
  }
  const rotr = (n, x) => (x >>> n) | (x << (32 - n));
  for (let offset = 0; offset < bytes.length; offset += 64) {
    const w = new Array(64);
    for (let i = 0; i < 16; i += 1) {
      w[i] =
        (bytes[offset + i * 4] << 24) |
        (bytes[offset + i * 4 + 1] << 16) |
        (bytes[offset + i * 4 + 2] << 8) |
        bytes[offset + i * 4 + 3];
    }
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(7, w[i - 15]) ^ rotr(18, w[i - 15]) ^ (w[i - 15] >>> 3);
      const s1 = rotr(17, w[i - 2]) ^ rotr(19, w[i - 2]) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[i] + w[i]) | 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0;
      d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map((v) => (v >>> 0).toString(16).padStart(8, "0")).join("");
}

export async function computeSha256Hex(input = "") {
  try {
    if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle?.digest) {
      const buf = await globalThis.crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(input)));
      return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {}
  return sha256PureJsHex(String(input));
}

export function isRouteAdmin(pathname = "") {
  const clean = String(pathname || "").replace(/\/+$/, "");
  return clean === "/admin";
}

function getRecentFailedAttempts(now = Date.now()) {
  const stored = readJsonStore(ADMIN_RATE_LIMIT_KEY, null);
  const arr = Array.isArray(stored) ? stored : inMemoryAttemptLog;
  return arr.filter((ts) => now - ts < LOCKOUT_WINDOW_MS);
}

function recordFailedAttempt(now = Date.now()) {
  const next = [...getRecentFailedAttempts(now), now];
  inMemoryAttemptLog = next;
  writeJsonStore(ADMIN_RATE_LIMIT_KEY, next);
  return next.length;
}

export function resetAdminRateLimitForTests() {
  inMemoryAttemptLog = [];
  writeJsonStore(ADMIN_RATE_LIMIT_KEY, []);
}

export function loadAdminSession(now = Date.now()) {
  const raw =
    (typeof sessionStorage !== "undefined" && sessionStorage.getItem(ADMIN_SESSION_KEY)) ||
    (typeof localStorage !== "undefined" && localStorage.getItem(ADMIN_SESSION_KEY));
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email || (parsed.expiresAt && parsed.expiresAt < now)) {
      logoutAdminSession();
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function logoutAdminSession() {
  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.removeItem(ADMIN_SESSION_KEY);
    if (typeof localStorage !== "undefined") localStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {}
  const { auth } = getFirebaseServices();
  if (auth?.currentUser) {
    try {
      await signOut(auth);
    } catch {}
  }
}

/**
 * Authentification stricte du portail /admin par e-mail + mot de passe.
 * Vérifie le digest SHA-256 salé + tente la session Firebase Auth pour les écritures `isAdmin()`.
 */
export async function verifyAdminCredentials(email = "", password = "", now = Date.now()) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const rawPass = String(password || "");
  if (!cleanEmail || !rawPass) {
    return { ok: false, error: "Veuillez renseigner votre adresse e-mail et votre mot de passe." };
  }

  const recentFails = getRecentFailedAttempts(now);
  if (recentFails.length >= MAX_FAILED_ATTEMPTS) {
    return {
      ok: false,
      rateLimited: true,
      error: "Trop de tentatives échouées. Veuillez patienter 5 minutes avant de réessayer."
    };
  }

  let authorizedRole = null;
  const candidateDigest = await computeSha256Hex(`${cleanEmail}::${ADMIN_DIGEST_SALT}::${rawPass}`);
  if (cleanEmail === SUPER_ADMIN_EMAIL && candidateDigest === SUPER_ADMIN_DIGEST) {
    authorizedRole = "super_admin";
  }

  let firebaseSignedIn = false;
  let firebaseUid = null;
  const { auth, db } = getFirebaseServices();

  // Vérification Firebase Auth réelle (aussi supportée pour les co-admins ajoutés dans /admins_eglise)
  if (auth && (authorizedRole || cleanEmail.includes("@"))) {
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, rawPass);
      firebaseSignedIn = true;
      firebaseUid = cred.user?.uid || null;
      if (!authorizedRole && db && firebaseUid) {
        try {
          const teamSnap = await getDoc(doc(db, "admins_eglise", firebaseUid));
          if (teamSnap.exists()) {
            authorizedRole = teamSnap.data()?.role || "moderateur";
          }
        } catch {}
      }
    } catch (err) {
      if (authorizedRole === "super_admin" && (err?.code === "auth/user-not-found" || err?.code === "auth/invalid-credential")) {
        try {
          const created = await createUserWithEmailAndPassword(auth, cleanEmail, rawPass);
          firebaseSignedIn = true;
          firebaseUid = created.user?.uid || null;
        } catch {}
      }
    }
  }

  if (!authorizedRole) {
    const count = recordFailedAttempt(now);
    const left = Math.max(0, MAX_FAILED_ATTEMPTS - count);
    return {
      ok: false,
      error: `Identifiants administrateur invalides (${left} tentative(s) restante(s)).`
    };
  }

  resetAdminRateLimitForTests();
  const session = {
    email: cleanEmail,
    role: authorizedRole,
    uid: firebaseUid || "super-admin-local",
    cloudConnected: firebaseSignedIn,
    loggedInAt: now,
    expiresAt: now + SESSION_TTL_MS
  };

  try {
    if (typeof sessionStorage !== "undefined") sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    if (typeof localStorage !== "undefined") localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  } catch {}

  await recordAdminAuditLog({
    action: "Connexion Administrateur",
    details: `Connexion réussie au portail /admin (${authorizedRole}${firebaseSignedIn ? " · Firebase Auth connecté" : ""})`,
    actorEmail: cleanEmail
  });

  return { ok: true, session };
}

/* ============================================================================
   PILIER 1 : ANALYTIQUE PÉDAGOGIQUE & MÉTRIQUES AGRÉGÉES
   ============================================================================ */

export function buildChurchAdminMetrics({
  leaderboard = [],
  defiJeanLeaderboard = [],
  groups = [],
  prayers = [],
  memorizationStats = {},
  completedStages = [],
  gameStats = {}
} = {}) {
  const activePilgrims = Math.max(1, leaderboard.length);
  const totalCompletedStages =
    leaderboard.reduce((sum, u) => sum + (Number(u.stagesValidees) || 0), 0) + (completedStages?.length || 0);
  const avgRetention = Number(memorizationStats?.successRate) || 0;

  return {
    activePilgrims,
    defiJeanPlayers: defiJeanLeaderboard.length,
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

/* ============================================================================
   PILIER 2 : ANNONCES & PROGRAMMES D'ÉGLISE
   ============================================================================ */

export function loadLocalAnnouncements() {
  const parsed = readJsonStore(LOCAL_ANNOUNCEMENTS_KEY, []);
  return Array.isArray(parsed) ? parsed : [];
}

export async function publishChurchAnnouncement({ titre, texte, auteur = "Responsable EEAG Issia", epingle = false }) {
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
    epingle: Boolean(epingle),
    createdAt: Date.now()
  };

  const next = [item, ...loadLocalAnnouncements()].slice(0, 30);
  writeJsonStore(LOCAL_ANNOUNCEMENTS_KEY, next);

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

  await recordAdminAuditLog({ action: "Publication annonce", details: cleanTitle, actorEmail: auteur });
  return { ok: true, item, announcements: next };
}

export async function deleteChurchAnnouncement(annonceId) {
  const next = loadLocalAnnouncements().filter((a) => a.id !== annonceId);
  writeJsonStore(LOCAL_ANNOUNCEMENTS_KEY, next);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && annonceId) {
    try {
      await deleteDoc(doc(db, "annonces_eglise", annonceId));
    } catch {}
  }

  await recordAdminAuditLog({ action: "Suppression annonce", details: annonceId });
  return next;
}

export async function fetchChurchAnnouncements() {
  const local = loadLocalAnnouncements();
  const { db } = getFirebaseServices();
  if (!db) return local;
  try {
    const q = query(collection(db, "annonces_eglise"), orderBy("createdAt", "desc"), limit(20));
    const snap = await getDocs(q);
    const cloud = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const map = new Map();
    [...cloud, ...local].forEach((a) => {
      if (a && a.id) map.set(a.id, a);
    });
    return Array.from(map.values()).sort((a, b) => (b.epingle ? 1 : 0) - (a.epingle ? 1 : 0) || (b.createdAt || 0) - (a.createdAt || 0));
  } catch {
    return local;
  }
}

/* ============================================================================
   PILIER 3 : PILOTAGE SPIRITUEL & CAMPAGNES / CONCOURS D'ÉGLISE
   ============================================================================ */

const DEFAULT_WEEKLY_CONFIG = {
  versetRef: "Psaume 119:105",
  versetTexte: "Ta parole est une lampe à mes pieds, et une lumière sur mon sentier.",
  objectifSemaine: "Lire 1 chapitre par jour et encourager un membre de l'Église sur le Mur de Prières.",
  updatedAt: 0
};

export function loadWeeklySpiritualConfig() {
  return { ...DEFAULT_WEEKLY_CONFIG, ...readJsonStore(WEEKLY_SPIRITUAL_KEY, {}) };
}

export async function saveWeeklySpiritualConfig(cfg = {}) {
  const clean = {
    versetRef: String(cfg.versetRef || DEFAULT_WEEKLY_CONFIG.versetRef).trim().slice(0, 60),
    versetTexte: String(cfg.versetTexte || DEFAULT_WEEKLY_CONFIG.versetTexte).trim().slice(0, 320),
    objectifSemaine: String(cfg.objectifSemaine || DEFAULT_WEEKLY_CONFIG.objectifSemaine).trim().slice(0, 240),
    updatedAt: Date.now()
  };
  writeJsonStore(WEEKLY_SPIRITUAL_KEY, clean);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "config_eglise", "hebdo"), { ...clean, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Mise à jour pilotage hebdomadaire", details: clean.versetRef });
  return clean;
}

export function loadChurchCampaigns() {
  const arr = readJsonStore(CAMPAIGNS_STORAGE_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export async function createChurchCampaign({ titre, description, livreCible = "Jean", dateDebut, dateFin }) {
  const cleanTitle = String(titre || "").trim().slice(0, 80);
  if (cleanTitle.length < 3) {
    return { ok: false, error: "Le titre de la campagne doit comporter au moins 3 caractères." };
  }
  const campaign = {
    id: `camp_${Date.now()}`,
    titre: cleanTitle,
    description: String(description || "").trim().slice(0, 300),
    livreCible: String(livreCible || "Jean").trim().slice(0, 40),
    dateDebut: dateDebut || new Date().toISOString().slice(0, 10),
    dateFin: dateFin || new Date(Date.now() + 7 * 86400 * 1000).toISOString().slice(0, 10),
    active: true,
    createdAt: Date.now()
  };
  const next = [campaign, ...loadChurchCampaigns()].slice(0, 20);
  writeJsonStore(CAMPAIGNS_STORAGE_KEY, next);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "campagnes_eglise", campaign.id), { ...campaign, serverCreatedAt: serverTimestamp() });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Création campagne", details: cleanTitle });
  return { ok: true, campaign, campaigns: next };
}

export async function deleteChurchCampaign(id) {
  const next = loadChurchCampaigns().filter((c) => c.id !== id);
  writeJsonStore(CAMPAIGNS_STORAGE_KEY, next);
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && id) {
    try {
      await deleteDoc(doc(db, "campagnes_eglise", id));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Suppression campagne", details: id });
  return next;
}

/* ============================================================================
   PILIER 4 : CMS BIBLIQUE DYNAMIQUE (QUESTIONS QCM & VERSETS LSG 1910)
   ============================================================================ */

export function loadCustomBibleContents() {
  const arr = readJsonStore(CUSTOM_BIBLE_CMS_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export async function addCustomBibleContent({
  type = "verset",
  livre = "Jean",
  ref = "",
  texte = "",
  question = "",
  options = [],
  correctIndex = 0,
  explication = ""
}) {
  const bookExists = BIBLE_66_BOOKS.some((b) => normalizeStr(b.nom) === normalizeStr(livre));
  if (!bookExists) {
    return { ok: false, error: `Le livre « ${livre} » ne fait pas partie des 66 livres canoniques reconnus.` };
  }
  const cleanRef = String(ref || "").trim().slice(0, 60);
  if (cleanRef.length < 3) {
    return { ok: false, error: "Veuillez indiquer une référence biblique précise (ex. Jean 15:5)." };
  }

  if (type === "qcm") {
    if (!question || String(question).trim().length < 8) {
      return { ok: false, error: "La question doit contenir au moins 8 caractères." };
    }
    const cleanOpts = (Array.isArray(options) ? options : []).map((o) => String(o || "").trim()).filter(Boolean);
    if (cleanOpts.length < 2) {
      return { ok: false, error: "Veuillez fournir au moins 2 choix de réponse." };
    }
  } else if (!texte || String(texte).trim().length < 10) {
    return { ok: false, error: "Le texte du verset (Louis Segond 1910) est requis." };
  }

  const item = {
    id: `cms_${Date.now()}`,
    type,
    livre: String(livre).trim(),
    ref: cleanRef,
    texte: String(texte || "").trim().slice(0, 400),
    question: String(question || "").trim().slice(0, 260),
    options: (Array.isArray(options) ? options : []).map((o) => String(o || "").trim()).filter(Boolean),
    correctIndex: Math.max(0, Number(correctIndex) || 0),
    explication: String(explication || "Référence authentique Louis Segond 1910.").trim().slice(0, 320),
    createdAt: Date.now()
  };

  const next = [item, ...loadCustomBibleContents()].slice(0, 100);
  writeJsonStore(CUSTOM_BIBLE_CMS_KEY, next);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "contenus_bibliques", item.id), { ...item, serverCreatedAt: serverTimestamp() });
    } catch {}
  }

  await recordAdminAuditLog({ action: "Ajout contenu biblique CMS", details: `${item.type} · ${item.ref}` });
  return { ok: true, item, contents: next };
}

export async function deleteCustomBibleContent(id) {
  const next = loadCustomBibleContents().filter((c) => c.id !== id);
  writeJsonStore(CUSTOM_BIBLE_CMS_KEY, next);
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && id) {
    try {
      await deleteDoc(doc(db, "contenus_bibliques", id));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Suppression contenu CMS", details: id });
  return next;
}

/* ============================================================================
   PILIER 5 : MODÉRATION MUR DE PRIÈRES & LISTE NOIRE DYNAMIQUE
   ============================================================================ */

export async function approveCommunityPrayer(prayerId) {
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && prayerId) {
    try {
      await updateDoc(doc(db, "prieres", prayerId), { signaux: 0, masque: false });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Approbation prière", details: prayerId });
  return true;
}

export async function deleteCommunityPrayerAdmin(prayerId) {
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && prayerId) {
    try {
      await deleteDoc(doc(db, "prieres", prayerId));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Suppression définitive prière", details: prayerId });
  return true;
}

export function loadDynamicBlacklist() {
  const arr = readJsonStore(DYNAMIC_BLACKLIST_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export async function saveDynamicBlacklist(words = []) {
  const clean = Array.from(
    new Set(
      (Array.isArray(words) ? words : String(words || "").split(/[,\n;]+/))
        .map((w) => String(w || "").trim().toLowerCase())
        .filter((w) => w.length >= 2)
    )
  ).slice(0, 120);
  writeJsonStore(DYNAMIC_BLACKLIST_KEY, clean);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "config_eglise", "moderation"), { forbiddenWords: clean, updatedAt: Date.now() }, { merge: true });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Mise à jour liste noire modération", details: `${clean.length} mot(s)` });
  return clean;
}

/* ============================================================================
   PILIER 6 : JOUEURS, PSEUDOS RÉSERVÉS & 2 CLASSEMENTS (PÈLERINAGE + DÉFI JEAN)
   ============================================================================ */

export async function fetchRegisteredPseudos() {
  const { db } = getFirebaseServices();
  if (!db) return [];
  try {
    const snap = await getDocs(query(collection(db, "pseudos_enregistres"), limit(150)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export async function releaseReservedPseudo(cleanPseudo) {
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && cleanPseudo) {
    try {
      await deleteDoc(doc(db, "pseudos_enregistres", cleanPseudo));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Libération pseudo", details: cleanPseudo });
  return true;
}

export async function fetchDefiJeanLeaderboard() {
  const { db } = getFirebaseServices();
  if (!db) return [];
  try {
    const snap = await getDocs(query(collection(db, "classement_defi_jean"), orderBy("scoreTotal", "desc"), limit(50)));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch {
    return [];
  }
}

export async function removeLeaderboardEntry(collectionName = "classement_pelerins", entryId = "") {
  if (!["classement_pelerins", "classement_defi_jean"].includes(collectionName) || !entryId) return false;
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await deleteDoc(doc(db, collectionName, entryId));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Modération classement", details: `${collectionName}/${entryId}` });
  return true;
}

/* ============================================================================
   PILIER 7 : GESTION DES GROUPES D'ÉGLISE
   ============================================================================ */

export async function deleteChurchGroupAdmin(code) {
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && code) {
    try {
      await deleteDoc(doc(db, "groupes_eglise", code));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Suppression groupe d'Église", details: code });
  return true;
}

/* ============================================================================
   PILIER 8 : DIFFUSION DE NOTIFICATIONS GLOBALES IN-APP
   ============================================================================ */

export function loadGlobalBroadcasts() {
  const arr = readJsonStore(GLOBAL_BROADCASTS_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export async function broadcastGlobalNotification({ title, body, targetTab = "Accueil" }) {
  const cleanTitle = String(title || "Message de l'Église").trim().slice(0, 70);
  const cleanBody = String(body || "").trim().slice(0, 400);
  if (cleanBody.length < 5) {
    return { ok: false, error: "Le corps de la notification doit contenir au moins 5 caractères." };
  }
  const item = {
    id: `glob_${Date.now()}`,
    title: cleanTitle,
    body: cleanBody,
    targetTab,
    createdAt: Date.now()
  };
  const next = [item, ...loadGlobalBroadcasts()].slice(0, 20);
  writeJsonStore(GLOBAL_BROADCASTS_KEY, next);

  // Diffuse aussi comme annonce officielle épinglée pour tous les joueurs connectés
  await publishChurchAnnouncement({
    titre: `🔔 ${cleanTitle}`,
    texte: cleanBody,
    auteur: "Administration EEAG Issia",
    epingle: true
  });
  await recordAdminAuditLog({ action: "Notification globale", details: cleanTitle });
  return { ok: true, item, broadcasts: next };
}

/* ============================================================================
   PILIER 9 : RÔLES HIÉRARCHIQUES (RBAC) & JOURNAL D'AUDIT
   ============================================================================ */

export function loadAdminTeam() {
  const stored = readJsonStore(ADMIN_TEAM_KEY, null);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return [{ uid: "owner-eeag", email: SUPER_ADMIN_EMAIL, nom: "Super Administrateur EEAG", role: "super_admin" }];
}

export async function upsertAdminMember({ uid, email, nom, role = "moderateur" }) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanUid = String(uid || cleanEmail).trim();
  const validRole = ["super_admin", "enseignant", "moderateur"].includes(role) ? role : "moderateur";
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { ok: false, error: "Adresse e-mail valide requise." };
  }
  const team = loadAdminTeam().filter((m) => m.email !== cleanEmail && m.uid !== cleanUid);
  const member = { uid: cleanUid, email: cleanEmail, nom: String(nom || cleanEmail).trim().slice(0, 50), role: validRole, updatedAt: Date.now() };
  const next = [member, ...team];
  writeJsonStore(ADMIN_TEAM_KEY, next);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && cleanUid && !cleanUid.includes("@")) {
    try {
      await setDoc(doc(db, "admins_eglise", cleanUid), member, { merge: true });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Attribution rôle admin", details: `${cleanEmail} -> ${validRole}` });
  return { ok: true, team: next };
}

export async function removeAdminMember(uidOrEmail) {
  if (uidOrEmail === SUPER_ADMIN_EMAIL || uidOrEmail === "owner-eeag") {
    return { ok: false, error: "Le Super Administrateur principal ne peut pas être retiré." };
  }
  const next = loadAdminTeam().filter((m) => m.uid !== uidOrEmail && m.email !== uidOrEmail);
  writeJsonStore(ADMIN_TEAM_KEY, next);
  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid && uidOrEmail && !uidOrEmail.includes("@")) {
    try {
      await deleteDoc(doc(db, "admins_eglise", uidOrEmail));
    } catch {}
  }
  await recordAdminAuditLog({ action: "Retrait rôle admin", details: uidOrEmail });
  return { ok: true, team: next };
}

export function loadAdminAuditLogs() {
  const arr = readJsonStore(ADMIN_AUDIT_LOGS_KEY, []);
  return Array.isArray(arr) ? arr : [];
}

export async function recordAdminAuditLog({ action, details = "", actorEmail = SUPER_ADMIN_EMAIL }) {
  const entry = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    action: String(action || "Action").slice(0, 80),
    details: String(details || "").slice(0, 200),
    actorEmail: String(actorEmail || SUPER_ADMIN_EMAIL).slice(0, 60),
    timestamp: Date.now()
  };
  const next = [entry, ...loadAdminAuditLogs()].slice(0, 80);
  writeJsonStore(ADMIN_AUDIT_LOGS_KEY, next);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "audit_logs", entry.id), { ...entry, serverTimestamp: serverTimestamp() });
    } catch {}
  }
  return entry;
}

/* ============================================================================
   PILIER 10 : MAINTENANCE, FEATURE FLAGS & SAUVEGARDE JSON / CSV
   ============================================================================ */

const DEFAULT_SYSTEM_FLAGS = {
  maintenanceMode: false,
  maintenanceMessage: "Maintenance spirituelle ou mise à jour en cours — vos données restent en sécurité.",
  prayersEnabled: true,
  duelsEnabled: true,
  dailyChallengeEnabled: true
};

export function loadSystemFlags() {
  return { ...DEFAULT_SYSTEM_FLAGS, ...readJsonStore(SYSTEM_FLAGS_KEY, {}) };
}

export async function saveSystemFlags(flags = {}) {
  const clean = {
    maintenanceMode: Boolean(flags.maintenanceMode),
    maintenanceMessage: String(flags.maintenanceMessage || DEFAULT_SYSTEM_FLAGS.maintenanceMessage).slice(0, 220),
    prayersEnabled: flags.prayersEnabled !== false,
    duelsEnabled: flags.duelsEnabled !== false,
    dailyChallengeEnabled: flags.dailyChallengeEnabled !== false,
    updatedAt: Date.now()
  };
  writeJsonStore(SYSTEM_FLAGS_KEY, clean);

  const { db, auth } = getFirebaseServices();
  if (db && auth?.currentUser?.uid) {
    try {
      await setDoc(doc(db, "config_eglise", "systeme"), { ...clean, serverUpdatedAt: serverTimestamp() }, { merge: true });
    } catch {}
  }
  await recordAdminAuditLog({ action: "Mise à jour paramètres système", details: `maintenance=${clean.maintenanceMode}, prieres=${clean.prayersEnabled}` });
  return clean;
}

export function buildFullAdminBackupPayload(extraState = {}) {
  return {
    exportedAt: new Date().toISOString(),
    application: "Le Grand Pèlerinage de la Bible V2.0 — EEAG Issia",
    weeklySpiritualConfig: loadWeeklySpiritualConfig(),
    announcements: loadLocalAnnouncements(),
    campaigns: loadChurchCampaigns(),
    customBibleContents: loadCustomBibleContents(),
    dynamicBlacklist: loadDynamicBlacklist(),
    adminTeam: loadAdminTeam(),
    systemFlags: loadSystemFlags(),
    auditLogs: loadAdminAuditLogs(),
    ...extraState
  };
}

export function exportLeaderboardCsv(entries = []) {
  const header = ["Rang", "Nom / Pseudo", "XP", "Perles", "Étapes Validées"];
  const rows = (Array.isArray(entries) ? entries : []).map((u, i) => [
    i + 1,
    `"${String(u.nom || u.pseudo || "Pèlerin").replace(/"/g, '""')}"`,
    Number(u.xp || u.scoreTotal) || 0,
    Number(u.pearls || u.etoilesTotal) || 0,
    Number(u.stagesValidees || u.niveauxDebloques) || 0
  ]);
  return [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
}
