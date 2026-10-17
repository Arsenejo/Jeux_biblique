/**
 * SERVICE D'ENVOI DE COURRIELS TRANSACTIONNELS — BREVO (EX-SENDINBLUE)
 * Permet l'envoi de courriels d'accueil, récapitulatifs spirituels,
 * et notifications fraternelles pour les pèlerins.
 */

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Récupération de la clé API Brevo depuis les variables d'environnement Vite ou le stockage local
export function getBrevoApiKey() {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BREVO_API_KEY) {
    return import.meta.env.VITE_BREVO_API_KEY;
  }
  try {
    return localStorage.getItem("pelerinage_brevo_api_key") || "";
  } catch {
    return "";
  }
}

export function setBrevoApiKey(apiKey) {
  try {
    if (apiKey) {
      localStorage.setItem("pelerinage_brevo_api_key", apiKey.trim());
    } else {
      localStorage.removeItem("pelerinage_brevo_api_key");
    }
  } catch {}
}

export function isBrevoConfigured() {
  const key = getBrevoApiKey();
  return typeof key === "string" && key.length > 10;
}

/**
 * Envoi d'un courriel via l'API Brevo v3
 */
export async function sendBrevoEmail({ toEmail, toName = "Pèlerin", subject, htmlContent, textContent }) {
  const apiKey = getBrevoApiKey();

  if (!apiKey) {
    console.info(
      `[Brevo Mailer Simulation] Courriel simulé pour ${toEmail} (${subject}). Configurez VITE_BREVO_API_KEY dans votre fichier .env pour l'envoi réel.`
    );
    return {
      success: true,
      simulated: true,
      message: "Envoi simulé avec succès (clé Brevo non configurée)."
    };
  }

  const senderEmail = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BREVO_SENDER_EMAIL) || "contact@legrandpelerinage.fr";
  const senderName = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_BREVO_SENDER_NAME) || "Le Grand Pèlerinage de la Bible";

  const payload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: toEmail,
        name: toName || "Pèlerin"
      }
    ],
    subject,
    htmlContent,
    textContent: textContent || subject
  };

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.message || `Erreur Brevo (${response.status})`;
      throw new Error(errorMsg);
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: true,
      messageId: data.messageId,
      simulated: false
    };
  } catch (err) {
    console.warn("Échec de l'envoi de courriel Brevo :", err.message);
    return {
      success: false,
      error: err.message
    };
  }
}

/**
 * Envoie un courriel de bienvenue après l'inscription
 */
export async function sendWelcomeEmail(toEmail, pilgrimName = "Pèlerin") {
  const subject = "Bienvenue dans Le Grand Pèlerinage de la Bible 🌿";
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; color: #1a202c; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.06); }
        .header { background: linear-gradient(135deg, #12532c, #1a743e); color: #ffffff; padding: 32px 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 28px 24px; line-height: 1.6; }
        .quote { background: #eef8f2; border-left: 4px solid #1a743e; padding: 14px 18px; margin: 20px 0; border-radius: 0 8px 8px 0; font-style: italic; color: #165630; }
        .features { margin: 20px 0; padding: 0; list-style: none; }
        .features li { padding: 8px 0; display: flex; align-items: center; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #edf2f7; }
        .badge { display: inline-block; background: #e8f5ff; color: #0756a5; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; margin-bottom: 8px;">COMPTE PÈLERIN ACTIVÉ</span>
          <h1>Paix et grâce sur ton chemin, ${pilgrimName} !</h1>
          <p>Ton carnet de route et ta progression sont désormais synchronisés.</p>
        </div>
        <div class="content">
          <p>Bonjour <strong>${pilgrimName}</strong>,</p>
          <p>Nous sommes très heureux de t'accueillir dans <strong>Le Grand Pèlerinage de la Bible</strong>. Désormais, quel que soit l'appareil (ordinateur, tablette ou smartphone) ou le navigateur sur lequel tu te connectes, tu retrouveras automatiquement :</p>
          <ul class="features">
            <li>🌱 <strong>Ton parcours complet</strong> sans jamais perdre aucune étape ni aucun point d'XP.</li>
            <li>🌿 <strong>Ton Jardin de la Parole</strong> (système Leitner) pour ancrer les Écritures dans ton cœur par révision espacée.</li>
            <li>📖 <strong>Ton carnet spirituel privé</strong> avec toutes tes réflexions et méditations.</li>
          </ul>
          <div class="quote">
            « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »<br>
            <small style="font-weight: 700; font-style: normal;">— Psaume 119:105 (Louis Segond 1910)</small>
          </div>
          <p>Que ce voyage nourrisse ton esprit, ravive ta foi et fortifie tes liens avec la communauté.</p>
        </div>
        <div class="footer">
          Le Grand Pèlerinage de la Bible • Un voyage au cœur de la Parole, à ton rythme.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendBrevoEmail({
    toEmail,
    toName: pilgrimName,
    subject,
    htmlContent
  });
}

/**
 * Envoie un récapitulatif spirituel de la progression
 */
export async function sendProgressSummaryEmail(toEmail, pilgrimName, stats = {}) {
  const { xp = 0, pearls = 0, stagesCount = 0, versesCount = 0 } = stats;
  const subject = `Ton récapitulatif spirituel — ${stagesCount} étape(s) franchie(s) 🌟`;
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f7fafc; padding: 24px; color: #2d3748; }
        .card { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; padding: 24px; }
        .stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 20px 0; }
        .stat-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 14px; border-radius: 10px; text-align: center; }
        .stat-box b { display: block; font-size: 20px; color: #166534; }
        .stat-box small { color: #15803d; font-size: 12px; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2 style="color: #14532d; margin-top: 0;">Trace de ton pèlerinage, ${pilgrimName} 🌿</h2>
        <p>Voici l'état actuel de ton cheminement dans les Saintes Écritures :</p>
        <div class="stat-grid">
          <div class="stat-box"><b>${stagesCount}</b><small>Étapes accomplies</small></div>
          <div class="stat-box"><b>${versesCount}</b><small>Versets mémorisés</small></div>
          <div class="stat-box"><b>${xp}</b><small>Points de joie (XP)</small></div>
          <div class="stat-box"><b>${pearls}</b><small>Perles célestes</small></div>
        </div>
        <p style="font-size: 13px; color: #4a5568;">Continue avec persévérance et paix. Chaque verset médité est une semence d'espérance.</p>
      </div>
    </body>
    </html>
  `;

  return sendBrevoEmail({
    toEmail,
    toName: pilgrimName,
    subject,
    htmlContent
  });
}
