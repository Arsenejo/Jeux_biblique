/**
 * Envoi transactionnel Brevo, uniquement côté serveur.
 * La clé API n'est jamais lue depuis le navigateur.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const hitsByIp = new Map();

function escapeHtml(str = "") {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isEmail(value) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(String(value || ""));
}

function safeHttpUrl(value) {
  const raw = String(value || "");
  if (raw.startsWith("https://") || raw.startsWith("http://")) return escapeHtml(raw);
  return "https://legrandpelerinage.fr";
}

function containsContact(value) {
  const text = String(value || "");
  const phone = /(?:(?:\+|00)\d{1,3}[\s.-]*)?(?:0|\(0\))[\s.-]*[1-9](?:[\s.-]*\d{2}){4}|\b\d{8,12}\b/;
  const email = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const url = /(https?:\/\/|www\.)[^\s]+/i;
  return phone.test(text) || email.test(text) || url.test(text);
}

function allowRate(ip) {
  const key = ip || "inconnu";
  const now = Date.now();
  const recent = (hitsByIp.get(key) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (recent.length >= RATE_LIMIT_MAX) {
    hitsByIp.set(key, recent);
    return false;
  }
  recent.push(now);
  hitsByIp.set(key, recent);
  return true;
}

function resetRateLimit() {
  hitsByIp.clear();
}

function footer() {
  return "Le Grand Pèlerinage de la Bible • Église Évangélique Assemblée de la Grâce, Issia (Côte d'Ivoire).";
}

function shell(title, inner) {
  return `<!DOCTYPE html><html lang="fr"><body style="font-family:Georgia,serif;background:#f4f8fc;color:#17324d;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #e2ebf3;border-radius:16px;padding:28px;">
      <p style="letter-spacing:.08em;font-size:12px;color:#159447;">LE GRAND PÈLERINAGE</p>
      <h1 style="font-size:22px;margin:0 0 12px;">${title}</h1>
      ${inner}
      <p style="font-size:12px;color:#64748b;margin-top:28px;">${footer()}</p>
    </div>
  </body></html>`;
}

function buildMessage(body) {
  const kind = body.kind;
  const toEmail = String(body.toEmail || "").trim();
  if (!isEmail(toEmail)) {
    return { error: "Adresse de courriel invalide." };
  }

  if (kind === "welcome") {
    const name = escapeHtml(body.pilgrimName || "Pèlerin");
    return {
      toEmail,
      toName: body.pilgrimName || "Pèlerin",
      subject: "Bienvenue dans Le Grand Pèlerinage de la Bible",
      htmlContent: shell(
        `Paix et grâce, ${name}`,
        `<p>Ton parcours, ton jardin de versets et ton carnet restent liés à ce compte.</p>
         <blockquote>« Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. » — Psaume 119:105</blockquote>`
      )
    };
  }

  if (kind === "progress") {
    const name = escapeHtml(body.pilgrimName || "Pèlerin");
    const xp = Math.max(0, Number(body.stats?.xp) || 0);
    const pearls = Math.max(0, Number(body.stats?.pearls) || 0);
    const stagesCount = Math.max(0, Number(body.stats?.stagesCount) || 0);
    const versesCount = Math.max(0, Number(body.stats?.versesCount) || 0);
    return {
      toEmail,
      toName: body.pilgrimName || "Pèlerin",
      subject: `Ton récapitulatif spirituel — ${stagesCount} étape(s)`,
      htmlContent: shell(
        `Trace de ton pèlerinage, ${name}`,
        `<p>${stagesCount} étapes · ${versesCount} versets au jardin · ${xp} XP · ${pearls} perles.</p>`
      )
    };
  }

  if (kind === "invite") {
    const custom = String(body.customMessage || "").trim();
    if (custom && containsContact(custom)) {
      return { error: "Le message ne peut pas contenir de coordonnées ni de lien." };
    }
    if (custom.length > 400) {
      return { error: "Le message personnel est trop long." };
    }
    const friend = escapeHtml(body.friendName || "Ami");
    const inviter = escapeHtml(body.inviterName || "Un pèlerin");
    const note = custom ? `<p><em>${escapeHtml(custom)}</em></p>` : "";
    const href = safeHttpUrl(body.inviteUrl);
    return {
      toEmail,
      toName: body.friendName || "Ami",
      subject: `${body.inviterName || "Un pèlerin"} t'invite au Grand Pèlerinage`,
      htmlContent: shell(
        `${inviter} t'invite à marcher`,
        `<p>Bonjour ${friend},</p><p>${inviter} te propose Le Grand Pèlerinage de la Bible.</p>${note}
         <p><a href="${href}">Rejoindre le pèlerinage</a></p>`
      )
    };
  }

  return { error: "Type de courriel inconnu." };
}

async function processMail(body, env = {}, ip = "local") {
  if (!body || typeof body !== "object") {
    return { status: 400, body: { success: false, error: "Requête invalide." } };
  }
  if (!allowRate(ip)) {
    return { status: 429, body: { success: false, error: "Trop d'envois. Réessayez dans une minute." } };
  }

  const message = buildMessage(body);
  if (message.error) {
    return { status: 400, body: { success: false, error: message.error } };
  }

  const apiKey = env.BREVO_API_KEY || "";
  if (!apiKey || apiKey.length < 10) {
    return {
      status: 200,
      body: {
        success: true,
        simulated: true,
        message: "Service courriel non configuré sur le serveur (BREVO_API_KEY)."
      }
    };
  }

  const payload = {
    sender: {
      name: env.BREVO_SENDER_NAME || "Le Grand Pèlerinage de la Bible",
      email: env.BREVO_SENDER_EMAIL || "contact@legrandpelerinage.fr"
    },
    to: [{ email: message.toEmail, name: message.toName || "Pèlerin" }],
    subject: message.subject,
    htmlContent: message.htmlContent
  };

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    return {
      status: 502,
      body: { success: false, error: errorData.message || "Le service de courriel a refusé l'envoi." }
    };
  }

  const data = await response.json().catch(() => ({}));
  return { status: 200, body: { success: true, simulated: false, messageId: data.messageId || null } };
}

module.exports = { processMail, resetRateLimit, escapeHtml, buildMessage };
