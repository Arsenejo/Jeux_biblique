import { THEMATIC_VERSES } from "../data/bibleData.js";

export const GROUP_STORAGE_KEY = "pelerinage_groupe_local";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function isoWeekIndex(date = new Date()) {
  const start = Date.UTC(date.getFullYear(), 0, 1);
  const diff = date.getTime() - start;
  return Math.max(0, Math.floor(diff / (7 * 24 * 60 * 60 * 1000)));
}

export function weeklyChallengeId(date = new Date()) {
  return `${date.getFullYear()}-w${isoWeekIndex(date)}`;
}

export function getWeeklyChallenge(date = new Date()) {
  const flat = THEMATIC_VERSES.flatMap((theme) =>
    (theme.versets || []).map((verse) => ({
      ref: verse.ref,
      texte: verse.texte,
      theme: theme.label
    }))
  );
  const item = flat[isoWeekIndex(date) % flat.length];
  return {
    id: weeklyChallengeId(date),
    ref: item.ref,
    texte: item.texte,
    theme: item.theme,
    consigne: "Médite ce verset cette semaine, seul ou avec le code de ton groupe."
  };
}

export function normalizeGroupCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
}

export function createGroupRecord(nom = "Groupe de maison") {
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return {
    code,
    nom: String(nom || "Groupe de maison").trim().slice(0, 40) || "Groupe de maison",
    createdAt: Date.now(),
    weekDone: {}
  };
}

export function loadGroup() {
  try {
    const raw = localStorage.getItem(GROUP_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== "object" || !parsed.code) return null;
    return {
      code: normalizeGroupCode(parsed.code),
      nom: String(parsed.nom || "Groupe de maison").slice(0, 40),
      createdAt: Number(parsed.createdAt) || Date.now(),
      weekDone: parsed.weekDone && typeof parsed.weekDone === "object" ? parsed.weekDone : {}
    };
  } catch {
    return null;
  }
}

export function saveGroup(group) {
  localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(group));
  return group;
}

export function joinGroup(code, nom = "Groupe de maison") {
  const clean = normalizeGroupCode(code);
  if (clean.length !== 6) {
    return { ok: false, error: "Le code de groupe comporte 6 caractères." };
  }
  const group = {
    code: clean,
    nom: String(nom || "Groupe de maison").trim().slice(0, 40) || "Groupe de maison",
    createdAt: Date.now(),
    weekDone: {}
  };
  return { ok: true, group: saveGroup(group) };
}

export function markWeeklyMeditation(group, challengeId) {
  if (!group) return null;
  const next = {
    ...group,
    weekDone: { ...(group.weekDone || {}), [challengeId]: true }
  };
  return saveGroup(next);
}

export function leaveGroup() {
  localStorage.removeItem(GROUP_STORAGE_KEY);
}
