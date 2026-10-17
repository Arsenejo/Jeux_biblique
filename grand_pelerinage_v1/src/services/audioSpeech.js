// Assistant vocal pour l'écoute paisible de la Parole et retours haptiques

export function playSpeech(text, onStart, onEnd) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Annule toute lecture en cours

    const cleanText = text.replace(/[«»*#]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Sélectionner une voix française si disponible
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith("fr") || v.lang.includes("FR"));
    if (frVoice) {
      utterance.voice = frVoice;
    }

    utterance.lang = "fr-FR";
    utterance.rate = 0.88; // Rythme posé et propice à la méditation
    utterance.pitch = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = () => { if (onEnd) onEnd(); };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (e) {
    console.warn("Synthèse vocale indisponible :", e);
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export function triggerHaptic(pattern = [20, 40, 20]) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
}

// Synthétiseur harmonique Web Audio API pour les victoires et méditations
let audioCtx = null;

function getAudioContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Carillon céleste doux (arpège harpe C5 - E5 - G5 - C6) pour validation réussie
export function playDivineChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.5]; // Do5, Mi5, Sol5, Do6
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.08);

    gain.gain.setValueAtTime(0, now + idx * 0.08);
    gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.08);
    osc.stop(now + idx * 0.08 + 0.65);
  });
}

// Accord de paix chaleureux (Fa4 - La4 - Do5) pour fin de lecture ou carnet
export function playPeaceTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [349.23, 440.0, 523.25]; // Fa4, La4, Do5
  const now = ctx.currentTime;

  notes.forEach((freq) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  });
}

