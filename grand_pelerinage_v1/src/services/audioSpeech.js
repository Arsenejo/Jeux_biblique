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
