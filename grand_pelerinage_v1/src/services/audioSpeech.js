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

// Carillon cristallin pour connexion réussie d'une paire (Mi5 -> La5 -> Do6)
export function playPairSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [659.25, 880.0, 1046.5];
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.06);

    gain.gain.setValueAtTime(0, now + idx * 0.06);
    gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.06 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.06);
    osc.stop(now + idx * 0.06 + 0.5);
  });
}

// Fanfare céleste triomphale pour promotion de ligue (Do4 - Sol4 - Do5 - Mi5 - Sol5)
export function playLeagueFanfare() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [
    { freq: 261.63, delay: 0, dur: 0.35 },    // Do4
    { freq: 392.00, delay: 0.08, dur: 0.35 }, // Sol4
    { freq: 523.25, delay: 0.16, dur: 0.45 }, // Do5
    { freq: 659.25, delay: 0.26, dur: 0.5 },  // Mi5
    { freq: 783.99, delay: 0.38, dur: 0.9 },  // Sol5
    { freq: 1046.5, delay: 0.38, dur: 0.9 }   // Do6 (octave éclatante)
  ];
  const now = ctx.currentTime;

  notes.forEach(({ freq, delay, dur }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + delay);

    gain.gain.setValueAtTime(0, now + delay);
    gain.gain.linearRampToValueAtTime(0.15, now + delay + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + delay);
    osc.stop(now + delay + dur + 0.05);
  });
}

// Son d'illumination sacrée pour la restauration d'une lampe dans la boutique (329Hz -> 587Hz)
export function playLampRestoreSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(329.63, now); // Mi4
  osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.35); // Ré5
  osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.6); // La5

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.9);
}

// Tonalité douce de méditation en cas d'erreur (jamais agressive, invite au calme)
export function playErrorGentleTone() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [311.13, 261.63]; // Mib4 -> Do4
  const now = ctx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now + idx * 0.12);

    gain.gain.setValueAtTime(0, now + idx * 0.12);
    gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.12 + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + idx * 0.12);
    osc.stop(now + idx * 0.12 + 0.45);
  });
}
