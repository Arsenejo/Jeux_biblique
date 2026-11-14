/**
 * PHASE 9 & 16 — Profils pédagogiques (Découverte / Explorateur / Expert)
 * et Préférences d'accessibilité & expérience multisensorielle.
 */

export const ACCESSIBILITY_STORAGE_KEY = "pelerinage_accessibility_prefs";

export const PEDAGOGICAL_PROFILES = [
  {
    id: "decouverte",
    nom: "Découverte",
    publicCible: "Enfants & Débutants",
    icone: "🐣",
    description: "Textes courts, indices plus généreux, rythme apaisé sans pression.",
    hintBonus: 2,
    timerMultiplier: 1.5,
    xpMultiplier: 1.0
  },
  {
    id: "explorateur",
    nom: "Explorateur",
    publicCible: "Adolescents & Adultes",
    icone: "🧭",
    description: "Compréhension, mémorisation progressive et histoires bibliques équilibrées.",
    hintBonus: 1,
    timerMultiplier: 1.0,
    xpMultiplier: 1.0
  },
  {
    id: "expert",
    nom: "Expert Biblique",
    publicCible: "Joueurs avancés",
    icone: "📜",
    description: "Références précises, contexte historique/littéraire et rappels sans aide.",
    hintBonus: 0,
    timerMultiplier: 0.85,
    xpMultiplier: 1.2
  }
];

export const DEFAULT_ACCESSIBILITY_PREFS = {
  fontSize: "normal", // "normal" | "large" | "xlarge"
  soundEnabled: true,
  hapticEnabled: true,
  reducedMotion: false,
  contemplativeDefault: false
};

export function loadAccessibilityPrefs() {
  try {
    if (typeof localStorage === "undefined") return { ...DEFAULT_ACCESSIBILITY_PREFS };
    const raw = localStorage.getItem(ACCESSIBILITY_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_ACCESSIBILITY_PREFS };
    return { ...DEFAULT_ACCESSIBILITY_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_ACCESSIBILITY_PREFS };
  }
}

export function saveAccessibilityPrefs(prefs) {
  const clean = { ...DEFAULT_ACCESSIBILITY_PREFS, ...(prefs || {}) };
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(clean));
    }
  } catch {}
  return clean;
}

export function applyAccessibilityToDocument(prefs) {
  if (typeof document === "undefined") return;
  const clean = { ...DEFAULT_ACCESSIBILITY_PREFS, ...(prefs || {}) };
  document.documentElement.setAttribute("data-font-size", clean.fontSize || "normal");
  if (clean.reducedMotion) {
    document.body.classList.add("reduced-motion-user");
  } else {
    document.body.classList.remove("reduced-motion-user");
  }
}

/**
 * Calcule une difficulté adaptative douce à partir des résultats récents
 * sans jamais bloquer ou pénaliser l'apprentissage selon l'âge.
 */
export function computeAdaptiveDifficulty(profileId = "explorateur", recentSuccessRate = 75) {
  const rate = Math.max(0, Math.min(100, Number(recentSuccessRate) || 75));
  if (rate < 55) {
    return { level: "bienveillant", showExtraHint: true, timerMultiplier: 1.35 };
  }
  if (rate >= 88 && profileId !== "decouverte") {
    return { level: "approfondi", showExtraHint: false, timerMultiplier: 0.9 };
  }
  const prof = PEDAGOGICAL_PROFILES.find((p) => p.id === profileId) || PEDAGOGICAL_PROFILES[1];
  return {
    level: prof.id,
    showExtraHint: prof.hintBonus > 0,
    timerMultiplier: prof.timerMultiplier
  };
}

