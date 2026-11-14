/**
 * PHASE 5 & 8 — Moteur de Notifications Intelligentes, Centre de Notifications & Web Push (FCM)
 *
 * 7 catégories :
 *   A. daily_reminder       (Rappel quotidien bienveillant)
 *   B. streak_reminder      (Rappel de série si mission du jour non faite)
 *   C. memorization_due     (Versets dus dans Mes Versets à Retenir)
 *   D. path_continue        (Poursuite de l'aventure du Sentier)
 *   E. community_challenge  (Défi communautaire d'Église)
 *   F. reward_unlocked      (Nouveau trésor / titre débloqué)
 *   G. warm_return          (Retour chaleureux après 3 ou 7 jours d'absence, sans culpabilisation)
 *
 * Règles de respect :
 *   - Plafond quotidien raisonnable (maxDaily, défaut 2)
 *   - Plages horaires silencieuses (défaut 21h–7h)
 *   - Suppression des rappels si le joueur a déjà fait son activité aujourd'hui
 *   - Déduplication stricte par id déterministe (catégorie + dateKey)
 *   - Demande de permission Push UNIQUEMENT sur clic volontaire dans MES NOTIFICATIONS
 */

import { doc, setDoc, collection, getDocs, query, orderBy, limit, serverTimestamp } from "firebase/firestore";
import { getFirebaseServices, firebaseConfig } from "./firebase.js";

export const NOTIF_PREFS_KEY = "pelerinage_notif_prefs_v2";
export const NOTIF_INBOX_KEY = "pelerinage_notif_inbox_v2";
export const DAY_MS = 24 * 60 * 60 * 1000;

export const NOTIFICATION_CATEGORIES = [
  { id: "daily_reminder", label: "Rappel quotidien", icone: "☀️" },
  { id: "streak_reminder", label: "Encouragement de série", icone: "🔥" },
  { id: "memorization_due", label: "Versets à réviser", icone: "🌱" },
  { id: "path_continue", label: "Nouvelle étape du parcours", icone: "🗺️" },
  { id: "community_challenge", label: "Défis & vie d'Église", icone: "⛪" },
  { id: "reward_unlocked", label: "Trésors & récompenses", icone: "🏆" },
  { id: "warm_return", label: "Nouvelles après pause", icone: "🕊️" }
];

export const DEFAULT_NOTIFICATION_PREFS = {
  pushEnabled: false,
  pausedUntil: 0,
  preferredHour: 9,
  frequency: "quotidienne", // "quotidienne" | "espaced_3j" | "hebdo"
  maxDaily: 2,
  quietStartHour: 21,
  quietEndHour: 7,
  timezone: typeof Intl !== "undefined" ? Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Abidjan" : "Africa/Abidjan",
  categories: {
    daily_reminder: true,
    streak_reminder: true,
    memorization_due: true,
    path_continue: true,
    community_challenge: true,
    reward_unlocked: true,
    warm_return: true
  }
};

export function loadNotificationPrefs() {
  try {
    if (typeof localStorage === "undefined") return { ...DEFAULT_NOTIFICATION_PREFS };
    const raw = localStorage.getItem(NOTIF_PREFS_KEY);
    if (!raw) return { ...DEFAULT_NOTIFICATION_PREFS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_NOTIFICATION_PREFS,
      ...parsed,
      categories: { ...DEFAULT_NOTIFICATION_PREFS.categories, ...(parsed?.categories || {}) }
    };
  } catch {
    return { ...DEFAULT_NOTIFICATION_PREFS };
  }
}

export function saveNotificationPrefs(prefs) {
  const clean = {
    ...DEFAULT_NOTIFICATION_PREFS,
    ...(prefs || {}),
    categories: { ...DEFAULT_NOTIFICATION_PREFS.categories, ...(prefs?.categories || {}) }
  };
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(NOTIF_PREFS_KEY, JSON.stringify(clean));
    }
  } catch {}
  return clean;
}

export function isWithinQuietHours(hour, quietStart = 21, quietEnd = 7) {
  const h = ((Number(hour) || 0) % 24 + 24) % 24;
  if (quietStart === quietEnd) return false;
  if (quietStart > quietEnd) {
    return h >= quietStart || h < quietEnd;
  }
  return h >= quietStart && h < quietEnd;
}

/**
 * Génère de manière déterministe et dédupliquée les notifications pertinentes pour la boîte de réception.
 */
export function generateSmartNotifications(
  context = {},
  prefs = DEFAULT_NOTIFICATION_PREFS,
  existingInbox = [],
  now = Date.now()
) {
  const p = {
    ...DEFAULT_NOTIFICATION_PREFS,
    ...(prefs || {}),
    categories: { ...DEFAULT_NOTIFICATION_PREFS.categories, ...(prefs?.categories || {}) }
  };
  const dateObj = new Date(now);
  const dateKey = dateObj.toISOString().slice(0, 10);
  const currentHour = typeof context.localHour === "number" ? context.localHour : dateObj.getHours();
  const inbox = Array.isArray(existingInbox) ? [...existingInbox] : [];

  // Suspendu ou plage silencieuse : aucune nouvelle notification générée maintenant
  if (p.pausedUntil && p.pausedUntil > now) {
    return { notifications: inbox, generated: [] };
  }
  if (isWithinQuietHours(currentHour, p.quietStartHour, p.quietEndHour)) {
    return { notifications: inbox, generated: [] };
  }

  const alreadySentIds = new Set(inbox.map((n) => n.id));
  const sentTodayCount = inbox.filter((n) => n.dateKey === dateKey && !n.archived).length;
  const remainingQuota = Math.max(0, (Number(p.maxDaily) || 2) - sentTodayCount);

  if (remainingQuota === 0) {
    return { notifications: inbox, generated: [] };
  }

  const candidates = [];
  const todayDayNum = Math.floor(now / DAY_MS);
  const lastActiveDay = Number(context.lastActiveDay) || 0;
  const daysAbsent = lastActiveDay > 0 ? Math.max(0, todayDayNum - lastActiveDay) : 0;
  const completedToday = Boolean(context.completedToday || (lastActiveDay === todayDayNum));

  // G. Retour après absence (3 ou 7 jours), message doux sans culpabilisation
  if (p.categories.warm_return && daysAbsent >= 3) {
    const bucket = daysAbsent >= 7 ? "7d" : "3d";
    candidates.push({
      id: `warm_return_${bucket}_${dateKey}`,
      category: "warm_return",
      dateKey,
      title: "Heureux de te retrouver ! 🕊️",
      body:
        daysAbsent >= 7
          ? "La Parole t'accueille avec paix, sans pression. Veux-tu relire un court verset aujourd'hui ?"
          : "Quelques minutes paisibles dans la Parole peuvent éclairer ta journée quand tu le souhaites.",
      targetTab: "Accueil",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // C. Versets à réviser aujourd'hui
  if (p.categories.memorization_due && (context.dueMemorizationCount || 0) > 0) {
    candidates.push({
      id: `memorization_due_${dateKey}`,
      category: "memorization_due",
      dateKey,
      title: "Un verset t'attend aujourd'hui 🌱",
      body: `${context.dueMemorizationCount} verset(s) de ton jardin sont prêts à être vérifiés en douceur.`,
      targetAction: "open_memorization",
      targetTab: "Accueil",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // B. Rappel de série (jamais envoyé si le joueur a déjà fait son activité du jour)
  if (p.categories.streak_reminder && !completedToday && (context.streak || 0) >= 2) {
    candidates.push({
      id: `streak_reminder_${dateKey}`,
      category: "streak_reminder",
      dateKey,
      title: `Tu progresses depuis ${context.streak} jours ! 🔥`,
      body: "Quelques minutes aujourd'hui pour poursuivre ton aventure avec sérénité.",
      targetTab: "Parcours",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // A. Rappel quotidien (si activité du jour non encore faite et fréquence quotidienne)
  if (p.categories.daily_reminder && !completedToday && p.frequency === "quotidienne") {
    candidates.push({
      id: `daily_reminder_${dateKey}`,
      category: "daily_reminder",
      dateKey,
      title: "Ton rendez-vous avec la Parole ☀️",
      body: "Bonjour pèlerin ! Une petite aventure biblique ou le Défi du Jour t'attend.",
      targetTab: "Jeux",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // D. Rappel de parcours
  if (p.categories.path_continue && !completedToday && context.nextStageTitle) {
    candidates.push({
      id: `path_continue_${dateKey}`,
      category: "path_continue",
      dateKey,
      title: "Prochaine étape du Sentier 🗺️",
      body: `« ${context.nextStageTitle} » est prête à être découverte.`,
      targetTab: "Parcours",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // E. Défi communautaire
  if (p.categories.community_challenge && context.groupCode && !context.weeklyChallengeDone) {
    candidates.push({
      id: `community_challenge_${dateKey}`,
      category: "community_challenge",
      dateKey,
      title: "Défi biblique de ton groupe ⛪",
      body: `Ton groupe (${context.groupCode}) participe au défi de la semaine. Chaque lecture compte !`,
      targetTab: "Fraternité",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // F. Récompense récente
  if (p.categories.reward_unlocked && context.recentRewardLabel) {
    candidates.push({
      id: `reward_unlocked_${context.recentRewardId || dateKey}`,
      category: "reward_unlocked",
      dateKey,
      title: "Nouveau trésor débloqué ! 🏆",
      body: context.recentRewardLabel,
      targetTab: "Profil",
      createdAt: now,
      read: false,
      archived: false
    });
  }

  // Respect strict du quota quotidien et déduplication
  const generated = [];
  for (const item of candidates) {
    if (generated.length >= remainingQuota) break;
    if (!alreadySentIds.has(item.id)) {
      generated.push(item);
      alreadySentIds.add(item.id);
    }
  }

  const nextInbox = [...generated, ...inbox].slice(0, 60);
  return { notifications: nextInbox, generated };
}

export function loadLocalNotificationInbox() {
  try {
    if (typeof localStorage === "undefined") return [];
    const raw = localStorage.getItem(NOTIF_INBOX_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLocalNotificationInbox(items) {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(NOTIF_INBOX_KEY, JSON.stringify((items || []).slice(0, 60)));
    }
  } catch {}
}

export function detectPushPlatformCapabilities() {
  if (typeof window === "undefined") {
    return { supported: false, isIOS: false, isStandalone: false, permission: "default" };
  }
  const ua = typeof navigator !== "undefined" ? navigator.userAgent || "" : "";
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isStandalone = Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches || window.navigator?.standalone
  );
  const supported = "Notification" in window && "serviceWorker" in navigator;
  return {
    supported,
    isIOS,
    isStandalone,
    permission: supported ? window.Notification.permission : "unsupported"
  };
}

/**
 * Demande volontaire de permission Push + enregistrement éventuel FCM si VAPID_KEY configuré.
 * Ne jamais appeler automatiquement au premier chargement de la page.
 */
export async function requestWebPushPermissionAndSync(uid, prefs) {
  const caps = detectPushPlatformCapabilities();
  if (!caps.supported) {
    return {
      ok: false,
      reason: caps.isIOS && !caps.isStandalone
        ? "Sur iPhone/iPad, installe d'abord l'application sur l'écran d'accueil via Partager → Sur l'écran d'accueil."
        : "Les notifications navigateur ne sont pas prises en charge sur cet appareil."
    };
  }

  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "Autorisation refusée dans les réglages du navigateur." };
  }

  let fcmToken = null;
  const vapidKey =
    typeof import.meta !== "undefined" ? import.meta.env?.VITE_FIREBASE_VAPID_KEY || "" : "";

  if (vapidKey && caps.supported) {
    try {
      const { getMessaging, getToken, isSupported } = await import("firebase/messaging");
      if (await isSupported()) {
        const reg = await navigator.serviceWorker.ready;
        const { app } = getFirebaseServices();
        if (app) {
          const messaging = getMessaging(app);
          fcmToken = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg });
        }
      }
    } catch {
      fcmToken = null;
    }
  }

  const { db } = getFirebaseServices();
  if (db && uid) {
    try {
      await setDoc(
        doc(db, "pelerins", uid),
        { notificationPrefs: saveNotificationPrefs({ ...prefs, pushEnabled: true }) },
        { merge: true }
      );
      if (fcmToken) {
        await setDoc(doc(db, "pelerins", uid, "fcm_tokens", fcmToken.slice(0, 32)), {
          token: fcmToken,
          platform: caps.isIOS ? "ios-pwa" : "web",
          timezone: prefs?.timezone || "Africa/Abidjan",
          updatedAt: serverTimestamp()
        });
      }
    } catch {}
  }

  return {
    ok: true,
    fcmConfigured: Boolean(fcmToken),
    message: fcmToken
      ? "Notifications Push activées et synchronisées avec Firebase Cloud Messaging."
      : "Préférences enregistrées localement et en Cloud. Note : la clé publique VITE_FIREBASE_VAPID_KEY serveur reste à configurer pour les envois Push distants lorsque l'app est fermée."
  };
}

export async function syncNotificationToFirestore(uid, notif) {
  const { db } = getFirebaseServices();
  if (!db || !uid || !notif?.id) return;
  try {
    await setDoc(doc(db, "pelerins", uid, "notifications", notif.id), {
      ...notif,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch {}
}

export async function fetchFirestoreNotifications(uid) {
  const { db } = getFirebaseServices();
  if (!db || !uid) return [];
  try {
    const q = query(collection(db, "pelerins", uid, "notifications"), orderBy("createdAt", "desc"), limit(30));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((n) => !n.archived);
  } catch {
    return [];
  }
}

export function checkVapidPushReadiness() {
  const vapidKey = typeof import.meta !== "undefined" ? import.meta.env?.VITE_FIREBASE_VAPID_KEY || "" : "";
  return {
    hasProjectId: Boolean(firebaseConfig.projectId),
    hasVapidKey: Boolean(vapidKey && vapidKey.length > 20)
  };
}

