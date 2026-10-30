/**
 * SERVICE D'ENVOI DE COURRIELS TRANSACTIONNELS — BREVO
 * Le navigateur demande /api/send-email. La clé reste sur le serveur.
 * Mention conservée pour les courriels : Église Évangélique Assemblée de la Grâce, Issia.
 */

import { validateCommunityMessage } from "./moderation.js";

/**
 * Nettoie et échappe tout texte pour éviter toute injection HTML ou tentative de phishing dans les courriels
 */
export function escapeHtml(str = "") {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const inviteTimestamps = [];
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60000;

export function checkInviteRateLimit() {
  const now = Date.now();
  while (inviteTimestamps.length > 0 && now - inviteTimestamps[0] > RATE_LIMIT_WINDOW_MS) {
    inviteTimestamps.shift();
  }
  if (inviteTimestamps.length >= RATE_LIMIT_MAX) {
    const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - inviteTimestamps[0])) / 1000);
    return {
      allowed: false,
      error: `Par mesure de sécurité anti-spam, veuillez patienter ${waitSeconds}s avant d'envoyer une nouvelle invitation.`
    };
  }
  inviteTimestamps.push(now);
  return { allowed: true };
}

const EMAIL_FOOTER = "Église Évangélique Assemblée de la Grâce, Issia (Côte d'Ivoire).";

/** La clé Brevo ne vit plus dans le navigateur. */
export function getBrevoApiKey() {
  return "";
}

export function setBrevoApiKey() {
  try {
    localStorage.removeItem("pelerinage_brevo_api_key");
  } catch {
    /* stockage indisponible */
  }
}

export function isBrevoConfigured() {
  return false;
}

/**
 * Demande au serveur d'envoyer un courriel.
 * Hors réseau (tests, fichier ouvert en local), l'envoi est simulé.
 */
export async function sendBrevoEmail(payload) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { success: false, error: data.error || "Envoi impossible." };
    }
    return data;
  } catch {
    return {
      success: true,
      simulated: true,
      message: `Envoi simulé. Le serveur utilisera BREVO_API_KEY. ${EMAIL_FOOTER}`
    };
  }
}

export async function sendWelcomeEmail(toEmail, pilgrimName = "Pèlerin") {
  return sendBrevoEmail({
    kind: "welcome",
    toEmail,
    pilgrimName
  });
}

export async function sendProgressSummaryEmail(toEmail, pilgrimName, stats = {}) {
  return sendBrevoEmail({
    kind: "progress",
    toEmail,
    pilgrimName,
    stats
  });
}

export async function sendInviteEmail({
  toEmail,
  friendName = "Mon ami(e)",
  inviterName = "Un ami pèlerin",
  inviterStats = {},
  customMessage = "",
  inviteUrl = ""
}) {
  const rateLimit = checkInviteRateLimit();
  if (!rateLimit.allowed) {
    return { success: false, error: rateLimit.error };
  }

  if (customMessage) {
    const modCheck = validateCommunityMessage(customMessage);
    if (!modCheck.valid) {
      return {
        success: false,
        error: modCheck.reason || "Message d'invitation non conforme."
      };
    }
  }

  const rawUrl = inviteUrl || (typeof window !== "undefined" ? window.location.href : "https://legrandpelerinage.fr");
  const safeUrl = rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
    ? rawUrl
    : "https://legrandpelerinage.fr";

  return sendBrevoEmail({
    kind: "invite",
    toEmail,
    friendName,
    inviterName,
    inviterStats,
    customMessage,
    inviteUrl: safeUrl
  });
}
