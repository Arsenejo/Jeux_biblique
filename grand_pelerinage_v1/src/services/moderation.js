// Système de protection fraternelle, modération et respect de la vie privée
// Protège les utilisateurs, les mineurs et préserve un climat de bienveillance.

const FORBIDDEN_WORDS = [
  "connard", "salope", "merde", "putain", "enculé", "bite", "sexe", "porn",
  "casino", "crypto", "argent gratuit", "whatsapp gratuit", "hack", "escroc",
  "insulte", "haine", "mort aux", "suicide", "viens me voir", "idiot", "idiots",
  "imbécile", "imbecile", "stupide", "débile", "debile", "nulle", "dégage"
];

const PHONE_REGEX = /(?:(?:\+|00)\d{1,3}[\s.-]*)?(?:0|\(0\))[\s.-]*[1-9](?:[\s.-]*\d{2}){4}|\b\d{8,12}\b/;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const URL_REGEX = /(https?:\/\/|www\.)[^\s]+/i;

/**
 * Valide le contenu d'une intention de prière ou d'un message fraternel.
 * Protège activement la vie privée (pas de numéros, pas d'emails, pas de liens).
 *
 * @param {string} text Texte de la prière
 * @param {string} author Nom de l'auteur
 * @returns {{ valid: boolean, reason: string }}
 */
export function validatePrayerContent(text = "", author = "") {
  const cleanText = (text || "").replace(/<[^>]*>/g, "").trim();
  const cleanAuthor = (author || "").replace(/<[^>]*>/g, "").trim();
  const combined = `${cleanText} ${cleanAuthor}`.toLowerCase();

  if (cleanText.length < 5) {
    return {
      valid: false,
      reason: "Ton intention est un peu courte. Écris au moins quelques mots (min. 5 caractères) 🌿"
    };
  }

  if (cleanText.length > 500) {
    return {
      valid: false,
      reason: "Ton texte dépasse la limite de 500 caractères. Sois concis pour faciliter la lecture fraternelle 🕊️"
    };
  }

  if (cleanAuthor.length > 40) {
    return {
      valid: false,
      reason: "Le nom d'auteur est trop long (maximum 40 caractères)."
    };
  }

  // 1. Protection de la vie privée (Protection des mineurs & RGPD) - Teste le texte et l'auteur
  if (PHONE_REGEX.test(cleanText) || PHONE_REGEX.test(cleanAuthor)) {
    return {
      valid: false,
      reason: "Par sécurité pour toi et pour les jeunes pèlerins, il est interdit de publier des coordonnées personnelles ou un numéro de téléphone sur le mur public 🛡️"
    };
  }

  if (EMAIL_REGEX.test(cleanText) || EMAIL_REGEX.test(cleanAuthor)) {
    return {
      valid: false,
      reason: "Par sécurité pour ta vie privée, merci de ne pas partager d'adresse e-mail ou email sur le mur public 🛡️"
    };
  }

  // 2. Blocage des spams et liens publicitaires (sur le texte et l'auteur)
  if (URL_REGEX.test(cleanText) || URL_REGEX.test(cleanAuthor)) {
    return {
      valid: false,
      reason: "Les liens internet, liens externes et publicités ne sont pas autorisés dans cet espace de recueillement 🌿"
    };
  }

  // 3. Modération des propos haineux ou vulgaires
  for (const word of FORBIDDEN_WORDS) {
    if (combined.includes(word)) {
      return {
        valid: false,
        reason: "Ce message ne respecte pas le climat de bienveillance, de respect et d'édification fraternelle 🕊️"
      };
    }
  }

  return {
    valid: true,
    reason: "",
    sanitizedText: cleanText,
    sanitizedAuthor: cleanAuthor
  };
}

/**
 * Valide et assainit tout message communautaire ou mot personnel d'invitation
 */
export function validateCommunityMessage(message = "") {
  const clean = (message || "").replace(/<[^>]*>/g, "").trim();
  if (!clean) return { valid: true, reason: "", sanitized: "" };

  if (clean.length > 300) {
    return { valid: false, reason: "Le message est trop long (maximum 300 caractères).", sanitized: clean.slice(0, 300) };
  }

  if (PHONE_REGEX.test(clean)) {
    return { valid: false, reason: "Interdiction d'insérer des numéros de téléphone.", sanitized: "" };
  }

  if (EMAIL_REGEX.test(clean)) {
    return { valid: false, reason: "Interdiction d'insérer des adresses e-mail.", sanitized: "" };
  }

  if (URL_REGEX.test(clean)) {
    return { valid: false, reason: "Interdiction d'insérer des liens externes ou adresses web.", sanitized: "" };
  }

  const lower = clean.toLowerCase();
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) {
      return { valid: false, reason: "Propos inappropriés détectés.", sanitized: "" };
    }
  }

  return { valid: true, reason: "", sanitized: clean };
}

/**
 * Récupère la liste des prières signalées/masquées localement par l'utilisateur
 */
export function getReportedPrayerIds() {
  try {
    return JSON.parse(localStorage.getItem("pelerinage_prieres_signalees") || "[]");
  } catch {
    return [];
  }
}

/**
 * Signale et masque immédiatement une prière pour l'utilisateur
 */
export function reportPrayerLocally(prayerId) {
  try {
    const list = getReportedPrayerIds();
    if (!list.includes(prayerId)) {
      list.push(prayerId);
      localStorage.setItem("pelerinage_prieres_signalees", JSON.stringify(list));
    }
    return list;
  } catch {
    return [];
  }
}
