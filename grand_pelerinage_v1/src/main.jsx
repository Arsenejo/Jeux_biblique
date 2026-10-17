import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, Compass, Home, UserRound, Flame, Gem, Trophy, Star, LockKeyhole,
  Check, ChevronRight, Sparkles, Volume2, VolumeX, Heart, Share2, RotateCcw,
  Lightbulb, Users, Leaf, MapPinned, BookMarked, Send, MessageCircleHeart,
  Award, ShieldCheck, Smile, Moon, Sun, Search, Flag, LogIn, LogOut, Globe,
  AlertCircle, MailCheck, RefreshCw, Timer, Clock, UserPlus, Info, AlertTriangle,
  Shuffle, Wifi, WifiOff, Download, Smartphone
} from "lucide-react";

import "./styles.css";
import { ConfettiCanvas } from "./components/ConfettiCanvas";
import { AuthModal } from "./components/AuthModal";
import InviteShareModal from "./components/InviteShareModal";
import WelcomeLanding from "./components/WelcomeLanding";
import {
  initPelerinAuth,
  syncPelerinProfile,
  loadPelerinProfile,
  saveCarnetNote,
  getLocalCarnetNotes,
  fetchClassementFraternel,
  fetchCommunityPrayers,
  addCommunityPrayer,
  supportCommunityPrayer,
  flagCommunityPrayer,
  logoutPelerin
} from "./services/firebase";
import { reconcilePelerinData } from "./services/dataReconciliation";
import { sendProgressSummaryEmail, isBrevoConfigured } from "./services/brevoMailer";
import { validatePrayerContent } from "./services/moderation";
import {
  BIBLE_BOOKS,
  BIBLE_CHAPTERS,
  BIBLE_EPOCHS,
  EPOCH_STAGES,
  PATH_STAGES,
  THEMATIC_VERSES,
  FRATERNAL_BLESSINGS,
  INITIAL_COMMUNITY_PRAYERS,
  LEITNER_BOXES
} from "./data/bibleData";
import { playSpeech, stopSpeech, triggerHaptic, playDivineChime, playPeaceTone } from "./services/audioSpeech";

// Utilitaire de mélange aléatoire pour renouveler les questions et susciter le suspense
function shuffleArray(arr) {
  if (!Array.isArray(arr)) return [];
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function App() {
  const [tab, setTab] = useState("Accueil");
  const [user, setUser] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState("local");
  const [toast, setToast] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Thème Nuit Paisible
  const [nightMode, setNightMode] = useState(() => {
    try {
      return localStorage.getItem("pelerinage_night_mode") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (nightMode) {
      document.body.classList.add("night-mode");
    } else {
      document.body.classList.remove("night-mode");
    }
    try {
      localStorage.setItem("pelerinage_night_mode", nightMode ? "true" : "false");
    } catch {}
  }, [nightMode]);

  // Profil et Progression du Pèlerin
  const [profileName, setProfileName] = useState(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pelerinage_profile_local") || "{}");
      return p.profileName || "Ami pèlerin";
    } catch {
      return "Ami pèlerin";
    }
  });

  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pelerinage_progress") || "{}");
    } catch {
      return {};
    }
  });

  // Époque active et Sentier
  const [selectedEpochId, setSelectedEpochId] = useState("racines");
  const currentStages = useMemo(() => {
    return EPOCH_STAGES[selectedEpochId] || EPOCH_STAGES.racines;
  }, [selectedEpochId]);

  // Étape active pour l'atelier
  const [activeStageId, setActiveStageId] = useState(1);
  const [placedWords, setPlacedWords] = useState([]);
  const [selectedQcmIndex, setSelectedQcmIndex] = useState(null);
  const [selectedCloze, setSelectedCloze] = useState("");
  const [exerciseFeedback, setExerciseFeedback] = useState("");

  // Glisser / Déposer (Drag & Drop tactile & souris)
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState(null);
  const [dragOverBank, setDragOverBank] = useState(false);
  const [touchGhost, setTouchGhost] = useState(null);
  const touchStateRef = useRef({ item: null });

  // Lampes de foi (Vies : max 5, perte sur erreurs en étapes défi, halte bienveillante à 0)
  const [lampes, setLampes] = useState(() => (typeof saved.lampes === "number" ? saved.lampes : 5));
  const [spiritualHaltModal, setSpiritualHaltModal] = useState(false);

  // Chronomètre Dynamique Décroissant
  const [timeLeft, setTimeLeft] = useState(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [contemplativeMode, setContemplativeMode] = useState(false);

  // Recommandation & Conseil de recherche biblique
  const [showStudyHint, setShowStudyHint] = useState(false);

  // Modal d'invitation et partage de score
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [invitedByBanner, setInvitedByBanner] = useState(null);

  // Écran d'accueil de présentation initiale (Landing Gate pour synchroniser dès le départ)
  const [hasSeenLanding, setHasSeenLanding] = useState(() => {
    try {
      return localStorage.getItem("pelerinage_welcomed") === "true";
    } catch {
      return false;
    }
  });

  // Statut Réseau & Mode Hors-Ligne
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [pwaInstallPrompt, setPwaInstallPrompt] = useState(null);

  // Mots et options mélangés aléatoirement (Randomisation des questions pour plus de suspense)
  const [shuffledBankWords, setShuffledBankWords] = useState([]);
  const [shuffledQcmOptions, setShuffledQcmOptions] = useState([]);
  const [shuffledClozeOptions, setShuffledClozeOptions] = useState([]);

  // Authentification multi-appareils (Modal & Compte)
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [sendingBrevoEmail, setSendingBrevoEmail] = useState(false);

  // Bible et Carnet
  const [selectedBookId, setSelectedBookId] = useState("gen");
  const [selectedChapterKey, setSelectedChapterKey] = useState("gen-1");
  const [reflectionInput, setReflectionInput] = useState("");
  const [carnetNotes, setCarnetNotes] = useState([]);
  const [selectedThemeId, setSelectedThemeId] = useState("paix");

  // Fraternité, Mur de Prières & Classement
  const [leaderboard, setLeaderboard] = useState([]);
  const [communityPrayers, setCommunityPrayers] = useState(INITIAL_COMMUNITY_PRAYERS);
  const [newPrayerText, setNewPrayerText] = useState("");

  // Système Leitner (Mémorisation du Cœur & Répétition Espacée)
  const [leitnerModalOpen, setLeitnerModalOpen] = useState(false);
  const [leitnerReviewIndex, setLeitnerReviewIndex] = useState(0);
  const [leitnerCardRevealed, setLeitnerCardRevealed] = useState(false);

  const leitnerCards = useMemo(() => {
    const cards = saved.leitnerCards;
    if (cards && Object.keys(cards).length > 0) {
      return Object.values(cards);
    }
    // Cartes d'inspiration initiales pour découvrir immédiatement le Jardin
    return [
      {
        ref: "Genèse 1:1",
        titre: "La Création du monde",
        texte: "Au commencement, Dieu créa les cieux et la terre.",
        box: 1,
        lastReviewed: Date.now() - 86400000,
        nextReview: Date.now() - 1000
      },
      {
        ref: "Psaume 23:1",
        titre: "Le Berger bienveillant",
        texte: "L'Éternel est mon berger : je ne manquerai de rien.",
        box: 2,
        lastReviewed: Date.now() - 86400000 * 3,
        nextReview: Date.now() - 1000
      }
    ];
  }, [saved.leitnerCards]);

  const xp = saved.xp || 0;
  const pearls = saved.pearls || 0;
  const streak = saved.streak || 1;
  const completedStages = useMemo(() => saved.completedStages || [1], [saved.completedStages]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  // Enregistrement PWA Service Worker & Capture de l'invite d'installation
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }

    const installHandler = (e) => {
      e.preventDefault();
      setPwaInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", installHandler);
    return () => window.removeEventListener("beforeinstallprompt", installHandler);
  }, []);

  const handleInstallPwa = async () => {
    if (!pwaInstallPrompt) return;
    try {
      pwaInstallPrompt.prompt();
      const choice = await pwaInstallPrompt.userChoice;
      if (choice.outcome === "accepted") {
        notify("Gloire à Dieu ! Le Grand Pèlerinage a été installé sur votre écran d'accueil 📲");
      }
    } catch {}
    setPwaInstallPrompt(null);
  };

  // Détection Réseau Hors-Ligne & Synchronisation Automatique à la reconnexion
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      notify("Connexion rétablie 🟢 ! Synchronisation automatique de ton sentier en cours…");

      if (user && !user.isAnonymous) {
        try {
          const cloudData = await loadPelerinProfile(user.uid);
          const reconciled = reconcilePelerinData(
            { profileName, xp, pearls, streak, saved },
            cloudData
          );
          if (reconciled.profileName) setProfileName(reconciled.profileName);
          if (reconciled.saved) {
            setSaved(reconciled.saved);
            if (typeof reconciled.saved.lampes === "number") {
              setLampes(reconciled.saved.lampes);
            }
          }
          await syncPelerinProfile(user.uid, reconciled);
          notify("Toutes tes étapes et ton Jardin sont parfaitement synchronisés avec le nuage 🕊️✨");
        } catch (e) {
          console.warn("Synchronisation automatique différée :", e);
        }
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      notify("Mode hors-ligne actif 🟡. Tu peux continuer à avancer, tes progrès restent en sécurité sur cet appareil 🌿");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user, profileName, xp, pearls, streak, saved]);

  // Détection d'invitation dans l'URL (?invite=...&by=...)
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location?.search) {
        const searchParams = new URLSearchParams(window.location.search);
        const invitedBy = searchParams.get("by") || searchParams.get("invite");
        if (invitedBy) {
          setInvitedByBanner(decodeURIComponent(invitedBy));
        }
      }
    } catch {}
  }, []);

  // Synchronisation des lampes de foi dans la sauvegarde locale et cloud
  useEffect(() => {
    setSaved((prev) => {
      if (prev.lampes === lampes) return prev;
      return { ...prev, lampes };
    });
  }, [lampes]);

  // Initialisation Authentification transparente Firebase & Chargement
  useEffect(() => {
    let unsubAuth;
    initPelerinAuth(async (currentUser, status) => {
      setUser(currentUser);
      setFirebaseStatus(status);

      if (currentUser) {
        const cloudData = await loadPelerinProfile(currentUser.uid);
        if (cloudData) {
          if (cloudData.profileName) setProfileName(cloudData.profileName);
          if (cloudData.saved) {
            setSaved((prev) => ({ ...prev, ...cloudData.saved }));
            if (typeof cloudData.saved.lampes === "number") {
              setLampes(cloudData.saved.lampes);
            }
          }
        }
        const notes = getLocalCarnetNotes(currentUser.uid);
        setCarnetNotes(notes);
      } else {
        const notes = getLocalCarnetNotes("local");
        setCarnetNotes(notes);
      }
    }).then((fn) => { unsubAuth = fn; });

    fetchClassementFraternel().then(setLeaderboard);

    fetchCommunityPrayers().then((prayers) => {
      if (prayers && prayers.length > 0) {
        setCommunityPrayers(prayers);
      }
    });

    return () => {
      if (unsubAuth) unsubAuth();
      stopSpeech();
    };
  }, []);

  // Gestion du chronomètre dégressif d'atelier
  const currentStageForTimer = currentStages.find((s) => s.id === activeStageId) || currentStages[0];

  useEffect(() => {
    if (!timerRunning || timeLeft === null || tab !== "Exercice" || contemplativeMode) return;

    if (timeLeft <= 0) {
      setTimerRunning(false);
      triggerHaptic([50, 50]);
      if (currentStageForTimer.coutVie) {
        setLampes((prev) => {
          const nextLampes = Math.max(0, prev - 1);
          if (nextLampes === 0) setSpiritualHaltModal(true);
          return nextLampes;
        });
        notify("⏱️ Temps écoulé ! Une lampe s'éteint. Consulte l'indice pour t'orienter 🪔");
      } else {
        notify("⏱️ Temps écoulé ! Prends tout ton temps pour méditer dans les Écritures 🌿");
      }
      setExerciseFeedback("Temps écoulé ! Prends ton temps pour relire le texte et t'appuyer sur le conseil de recherche 📖");
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning, timeLeft, tab, contemplativeMode, currentStageForTimer]);

  // Sauvegarde automatique du profil lors des changements
  useEffect(() => {
    const profilePayload = {
      profileName,
      xp,
      pearls,
      streak,
      saved,
      avatar: "🌿"
    };
    try {
      localStorage.setItem("pelerinage_progress", JSON.stringify(saved));
      localStorage.setItem("pelerinage_profile_local", JSON.stringify(profilePayload));
    } catch {}

    if (user) {
      syncPelerinProfile(user.uid, profilePayload);
    }
  }, [profileName, saved, xp, pearls, streak, user]);

  // Gestion de l'authentification et du compte
  const handleAuthSuccess = async (authenticatedUser) => {
    setUser(authenticatedUser);
    setFirebaseStatus("cloud");
    try {
      localStorage.setItem("pelerinage_welcomed", "true");
    } catch {}
    setHasSeenLanding(true);
    if (authenticatedUser) {
      const cloudData = await loadPelerinProfile(authenticatedUser.uid);
      if (cloudData) {
        if (cloudData.profileName) setProfileName(cloudData.profileName);
        if (cloudData.saved) setSaved((prev) => ({ ...prev, ...cloudData.saved }));
      }
      const notes = getLocalCarnetNotes(authenticatedUser.uid);
      setCarnetNotes(notes);
    }
  };

  const handleLogout = async () => {
    await logoutPelerin();
    setUser(null);
    setFirebaseStatus("local");
    notify("Tu es déconnecté·e. Ta progression reste en sécurité sur ton compte 🌿");
  };

  const handleSendProgressByEmail = async () => {
    if (!user || !user.email) {
      setAuthModalOpen(true);
      return;
    }
    setSendingBrevoEmail(true);
    try {
      const res = await sendProgressSummaryEmail(user.email, profileName, {
        xp,
        pearls,
        stagesCount: completedStages.length,
        versesCount: leitnerCards.length
      });
      if (res.simulated) {
        notify("Bilan simulé avec succès ! (Renseigne VITE_BREVO_API_KEY dans .env pour l'envoi réel) ✉️");
      } else if (res.success) {
        notify("Ton bilan spirituel a été envoyé avec succès par e-mail via Brevo 🕊️");
      } else {
        notify("Échec de l'envoi Brevo : " + (res.error || "erreur"));
      }
    } catch (e) {
      notify("Erreur courriel : " + e.message);
    } finally {
      setSendingBrevoEmail(false);
    }
  };

  // Gestion de l'audio
  const handleToggleAudio = (text) => {
    if (audioPlaying) {
      stopSpeech();
      setAudioPlaying(false);
      notify("Lecture audio mise en pause");
    } else {
      const ok = playSpeech(
        text,
        () => setAudioPlaying(true),
        () => setAudioPlaying(false)
      );
      if (ok) {
        setAudioPlaying(true);
        notify("Écoute de la Parole en cours…");
      } else {
        notify("Synthèse vocale indisponible sur cet appareil.");
      }
    }
  };

  // Partager un verset ou une bénédiction
  const handleShareBlessing = async (blessing) => {
    const shareText = `🕊️ « ${blessing.verset} »\n— ${blessing.ref}\n\n${blessing.message}\n(Partagé avec amour depuis Le Grand Pèlerinage de la Bible)`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Une bénédiction pour toi",
          text: shareText
        });
        notify("Bénédiction partagée avec joie 💚");
        return;
      } catch {}
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      notify("Bénédiction copiée ! Prête à être envoyée sur WhatsApp ou SMS 🌿");
    } else {
      notify("Bénédiction partagée !");
    }
  };

  // Sauvegarde dans le Carnet Spirituel
  const handleSaveNote = async (source = "Méditation personnelle") => {
    if (!reflectionInput.trim()) {
      notify("Écris quelques mots avant d'enregistrer ta pensée 🌿");
      return;
    }

    const note = {
      id: "note_" + Date.now(),
      texte: reflectionInput.trim(),
      source,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })
    };

    const updated = await saveCarnetNote(user ? user.uid : "local", note);
    setCarnetNotes(updated);
    setReflectionInput("");
    notify("Pensée enregistrée dans ton carnet spirituel 💚");
    playPeaceTone();
    triggerHaptic([30]);
  };

  // Création d'une intention de prière avec validation de fraternité et sécurité
  const handleCreatePrayer = async () => {
    if (!newPrayerText.trim()) {
      notify("Écris ton intention de prière ou gratitude avant de déposer 🌿");
      return;
    }

    // Modération fraternelle et protection des données / mineurs
    const validation = validatePrayerContent(newPrayerText, profileName);
    if (!validation.valid) {
      notify(validation.reason);
      triggerHaptic([40, 80]);
      return;
    }

    const newPrayer = {
      id: "prayer_" + Date.now(),
      auteur: profileName,
      avatar: "🌿",
      texte: newPrayerText.trim(),
      date: "À l'instant",
      soutiens: 1
    };

    const updated = await addCommunityPrayer(newPrayer);
    setCommunityPrayers(updated);
    setNewPrayerText("");
    notify("Ton intention de prière a été déposée sur le mur fraternel 🕊️");
    triggerHaptic([30]);
  };

  // Soutien fraternel en 1 clic
  const handleSupportPrayer = async (prayerId) => {
    const updated = await supportCommunityPrayer(prayerId);
    setCommunityPrayers(updated);
    notify("Tu as prié pour cette intention. Que Dieu vous fortifie ! 🕊️");
    triggerHaptic([20, 40]);
  };

  // Signalement bienveillant et masquage d'un contenu inapproprié
  const handleFlagPrayer = async (prayerId) => {
    const confirmReport = window.confirm(
      "Souhaites-tu masquer cette intention et la signaler pour modération fraternelle ?"
    );
    if (!confirmReport) return;

    const updated = await flagCommunityPrayer(prayerId);
    setCommunityPrayers(updated);
    notify("Cette intention a été masquée de ton fil et signalée pour examen 🛡️");
    triggerHaptic([30, 30]);
  };

  // Logique de validation d'un atelier d'étape
  const currentStage = currentStages.find((s) => s.id === activeStageId) || currentStages[0];

  // Préparation du contenu aléatoire (Banque de mots, options QCM, options Cloze mélangées)
  const setupRandomExerciseContent = useCallback((stageObj) => {
    if (!stageObj) return;
    if (stageObj.type === "order" && Array.isArray(stageObj.motsBanque)) {
      setShuffledBankWords(shuffleArray(stageObj.motsBanque));
    }
    if (stageObj.type === "qcm" && Array.isArray(stageObj.options)) {
      setShuffledQcmOptions(shuffleArray(stageObj.options));
    }
    if (stageObj.type === "cloze" && Array.isArray(stageObj.options)) {
      setShuffledClozeOptions(shuffleArray(stageObj.options));
    }
  }, []);

  useEffect(() => {
    setupRandomExerciseContent(currentStage);
  }, [activeStageId, selectedEpochId, setupRandomExerciseContent]);

  const validateExercise = () => {
    let isSuccess = false;

    if (currentStage.type === "order") {
      const filledCount = placedWords.filter(Boolean).length;
      if (filledCount !== currentStage.motsCorrects.length) {
        setExerciseFeedback("Il reste encore des mots à placer. Prends ton temps 🌿");
        return;
      }
      isSuccess = currentStage.motsCorrects.every((word, index) => placedWords[index] === word);
    } else if (currentStage.type === "qcm") {
      if (selectedQcmIndex === null) {
        setExerciseFeedback("Sélectionne une réponse pour continuer 🌿");
        return;
      }
      const activeOptions = shuffledQcmOptions.length > 0 ? shuffledQcmOptions : currentStage.options;
      isSuccess = activeOptions[selectedQcmIndex]?.correct || false;
    } else if (currentStage.type === "cloze") {
      if (!selectedCloze) {
        setExerciseFeedback("Choisis le mot manquant pour compléter le verset 🌿");
        return;
      }
      isSuccess = selectedCloze === currentStage.motCorrect;
    }

    if (isSuccess) {
      setTimerRunning(false);
      playDivineChime();
      triggerHaptic([20, 60, 20]);
      setConfettiActive(true);
      setExerciseFeedback("Bravo ! Ton cœur accueille la Parole avec joie ✨");

      // Mise à jour de la progression et enracinement dans le Jardin de la Mémoire
      const nextCompleted = Array.from(new Set([...completedStages, currentStage.id]));
      setSaved((prev) => {
        const prevCards = prev.leitnerCards || {};
        const existingCard = prevCards[currentStage.ref];
        const nextBox = existingCard ? Math.min(5, (existingCard.box || 1) + 1) : 1;
        const intervalsDays = [0, 1, 3, 7, 30, 90];
        const nextReview = Date.now() + (intervalsDays[nextBox] || 1) * 24 * 3600 * 1000;

        const updatedCards = {
          ...prevCards,
          [currentStage.ref]: {
            ref: currentStage.ref,
            titre: currentStage.titre,
            texte: currentStage.motsCorrects ? currentStage.motsCorrects.join(" ") : currentStage.titre,
            box: nextBox,
            stageId: currentStage.id,
            epochId: selectedEpochId,
            lastReviewed: Date.now(),
            nextReview
          }
        };

        return {
          ...prev,
          completedStages: nextCompleted,
          xp: (prev.xp || 0) + (currentStage.recompense?.xp || 20),
          pearls: (prev.pearls || 0) + (currentStage.recompense?.perles || 1),
          leitnerCards: updatedCards
        };
      });
    } else {
      triggerHaptic([40, 20]);
      if (currentStage.coutVie) {
        setLampes((prev) => {
          const nextLampes = Math.max(0, prev - 1);
          if (nextLampes === 0) {
            setSpiritualHaltModal(true);
          }
          return nextLampes;
        });
        setExerciseFeedback("Presque ! Une de tes lampes s'est éteinte 🪔. Prends un temps de calme pour consulter l'indice biblique 🌿");
      } else {
        setExerciseFeedback("Presque ! Prends un instant pour relire avec calme 🌿");
      }
    }
  };

  const resetStageExercise = () => {
    setPlacedWords([]);
    setSelectedQcmIndex(null);
    setSelectedCloze("");
    setExerciseFeedback("");
    setShowStudyHint(false);
    setDraggedItem(null);
    setDragOverSlotIndex(null);
    setDragOverBank(false);
    setTouchGhost(null);
    touchStateRef.current = { item: null };
    setupRandomExerciseContent(currentStage);
  };

  // --- GESTIONNAIRES DU GLISSER / DÉPOSER (DRAG & DROP TACTILE & SOURIS) ---
  const handlePlaceWordInSlot = (word, targetIndex) => {
    if (!word || exerciseFeedback) return;
    setPlacedWords((prev) => {
      const next = [...prev];
      // Si le mot est déjà présent dans une case, on libère son ancien emplacement
      const existingIdx = next.findIndex((w) => w === word);
      if (existingIdx !== -1) {
        next[existingIdx] = null;
      }

      if (typeof targetIndex === "number" && targetIndex >= 0) {
        next[targetIndex] = word;
      } else {
        // Recherche du premier emplacement libre de gauche à droite
        const total = currentStage.motsCorrects ? currentStage.motsCorrects.length : 4;
        let freeIdx = -1;
        for (let i = 0; i < total; i++) {
          if (!next[i]) {
            freeIdx = i;
            break;
          }
        }
        if (freeIdx !== -1) {
          next[freeIdx] = word;
        } else {
          next.push(word);
        }
      }
      return next;
    });
    triggerHaptic(15);
  };

  const handleMoveOrSwapSlot = (sourceIndex, targetIndex) => {
    if (sourceIndex === targetIndex || exerciseFeedback) return;
    setPlacedWords((prev) => {
      const next = [...prev];
      const sourceWord = next[sourceIndex];
      const targetWord = next[targetIndex];
      next[targetIndex] = sourceWord;
      next[sourceIndex] = targetWord || null;
      return next;
    });
    triggerHaptic([20, 20]);
  };

  const handleRemoveWordFromSlot = (index) => {
    if (exerciseFeedback) return;
    setPlacedWords((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    triggerHaptic(10);
  };

  // Handlers HTML5 Drag & Drop (Souris & Trackpad)
  const handleDragStartFromBank = (e, word) => {
    if (exerciseFeedback) return;
    setDraggedItem({ type: "bank", word });
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", word);
      e.dataTransfer.effectAllowed = "move";
    }
    triggerHaptic(10);
  };

  const handleDragStartFromSlot = (e, word, index) => {
    if (exerciseFeedback || !word) return;
    setDraggedItem({ type: "slot", word, index });
    if (e.dataTransfer) {
      e.dataTransfer.setData("text/plain", word);
      e.dataTransfer.effectAllowed = "move";
    }
    triggerHaptic(10);
  };

  const handleDragOverSlot = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
    if (dragOverSlotIndex !== index) {
      setDragOverSlotIndex(index);
    }
  };

  const handleDropOnSlot = (e, targetIndex) => {
    e.preventDefault();
    setDragOverSlotIndex(null);
    if (!draggedItem || exerciseFeedback) return;

    if (draggedItem.type === "bank") {
      handlePlaceWordInSlot(draggedItem.word, targetIndex);
    } else if (draggedItem.type === "slot") {
      handleMoveOrSwapSlot(draggedItem.index, targetIndex);
    }
    setDraggedItem(null);
  };

  const handleDropOnBank = (e) => {
    e.preventDefault();
    setDragOverBank(false);
    if (!draggedItem || exerciseFeedback) return;

    if (draggedItem.type === "slot") {
      handleRemoveWordFromSlot(draggedItem.index);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverSlotIndex(null);
    setDragOverBank(false);
  };

  // Handlers Tactiles (Mobiles, tablettes & touchscreens)
  const handleTouchStart = (e, item) => {
    if (exerciseFeedback) return;
    const touch = e.touches[0];
    touchStateRef.current = { item };
    setDraggedItem(item);
    setTouchGhost({
      word: item.word,
      x: touch.clientX,
      y: touch.clientY
    });
    triggerHaptic(15);
  };

  const handleTouchMove = (e) => {
    if (!touchStateRef.current.item) return;
    const touch = e.touches[0];
    setTouchGhost((prev) => (prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null));

    const targetElement = document.elementFromPoint(touch.clientX, touch.clientY);
    const slotEl = targetElement?.closest("[data-slot-index]");
    if (slotEl) {
      const idx = parseInt(slotEl.getAttribute("data-slot-index"), 10);
      setDragOverSlotIndex(idx);
      setDragOverBank(false);
    } else {
      setDragOverSlotIndex(null);
      const bankEl = targetElement?.closest(".word-bank");
      setDragOverBank(!!bankEl);
    }
  };

  const handleTouchEnd = (e) => {
    const item = touchStateRef.current.item;
    touchStateRef.current = { item: null };
    const ghost = touchGhost;
    setTouchGhost(null);
    setDraggedItem(null);
    setDragOverSlotIndex(null);
    setDragOverBank(false);

    if (!item || !ghost || exerciseFeedback) return;

    const targetElement = document.elementFromPoint(ghost.x, ghost.y);
    const slotEl = targetElement?.closest("[data-slot-index]");
    if (slotEl) {
      const targetIndex = parseInt(slotEl.getAttribute("data-slot-index"), 10);
      if (item.type === "bank") {
        handlePlaceWordInSlot(item.word, targetIndex);
      } else if (item.type === "slot") {
        handleMoveOrSwapSlot(item.index, targetIndex);
      }
      return;
    }

    const bankEl = targetElement?.closest(".word-bank");
    if (bankEl && item.type === "slot") {
      handleRemoveWordFromSlot(item.index);
    }
  };

  const startStage = (stageId) => {
    if (lampes === 0) {
      setSpiritualHaltModal(true);
      return;
    }
    setActiveStageId(stageId);
    resetStageExercise();

    const stageObj = currentStages.find((s) => s.id === stageId) || currentStages[0];
    setupRandomExerciseContent(stageObj);

    if (stageObj?.tempsLimite && !contemplativeMode) {
      setTimeLeft(stageObj.tempsLimite);
      setTimerRunning(true);
    } else {
      setTimeLeft(null);
      setTimerRunning(false);
    }

    setTab("Exercice");
  };

  const nextStage = () => {
    resetStageExercise();
    const curIdx = currentStages.findIndex((s) => s.id === activeStageId);
    if (curIdx >= 0 && curIdx < currentStages.length - 1) {
      const nextStageObj = currentStages[curIdx + 1];
      setActiveStageId(nextStageObj.id);
      setupRandomExerciseContent(nextStageObj);
      if (nextStageObj?.tempsLimite && !contemplativeMode) {
        setTimeLeft(nextStageObj.tempsLimite);
        setTimerRunning(true);
      } else {
        setTimeLeft(null);
        setTimerRunning(false);
      }
    } else {
      setTimeLeft(null);
      setTimerRunning(false);
      setTab("Parcours");
      notify("Toutes les étapes de cette époque sont accomplies ! Gloire à Dieu 🌟");
    }
  };

  // Défi Providenciel : Sélectionne une étape surprise au hasard parmi les 72 étapes
  const handleRandomStageSurprise = () => {
    const allStages = Object.entries(EPOCH_STAGES).flatMap(([epochId, stages]) =>
      stages.map((st) => ({ ...st, epochId }))
    );
    // Priorité aux étapes non encore franchies
    const uncompleted = allStages.filter((s) => !completedStages.includes(s.id));
    const pool = uncompleted.length > 0 ? uncompleted : allStages;
    const picked = pool[Math.floor(Math.random() * pool.length)];

    if (picked) {
      setSelectedEpochId(picked.epochId);
      startStage(picked.id);
      playPeaceTone();
      triggerHaptic([20, 40]);
      notify(`🎲 Défi Providenciel : « ${picked.titre} » (${picked.ref}) ! ✨`);
    }
  };

  // Gestion de la réponse en révision Leitner
  const handleReviewAnswer = (cardRef, isSuccess) => {
    setSaved((prev) => {
      const prevCards = prev.leitnerCards || {};
      const card = prevCards[cardRef] || { ref: cardRef, box: 1 };
      let newBox = card.box || 1;
      if (isSuccess) {
        newBox = Math.min(5, newBox + 1);
        playDivineChime();
        triggerHaptic([20, 60, 20]);
        setConfettiActive(true);
        notify(`« ${cardRef} » monte au Niveau ${newBox} ! Gloire à Dieu ✨`);
      } else {
        newBox = 1;
        playPeaceTone();
        triggerHaptic([30]);
        notify(`« ${cardRef} » sera consolidé demain avec douceur 🌿`);
      }

      const intervalsDays = [0, 1, 3, 7, 30, 90];
      const nextReview = Date.now() + (intervalsDays[newBox] || 1) * 24 * 3600 * 1000;

      const updatedCards = {
        ...prevCards,
        [cardRef]: {
          ...card,
          box: newBox,
          lastReviewed: Date.now(),
          nextReview
        }
      };

      return {
        ...prev,
        xp: (prev.xp || 0) + (isSuccess ? 15 : 5),
        pearls: (prev.pearls || 0) + (isSuccess ? 1 : 0),
        leitnerCards: updatedCards
      };
    });

    setLeitnerCardRevealed(false);
    setLeitnerReviewIndex((idx) => idx + 1);
  };

  // Ancrer un verset lu dans le Jardin depuis la Bible
  const handleAnchorVerse = (verseRef, verseText) => {
    setSaved((prev) => {
      const prevCards = prev.leitnerCards || {};
      const existing = prevCards[verseRef];
      if (existing) {
        notify(`« ${verseRef} » est déjà dans ton Jardin (Niveau ${existing.box}) 🌿`);
        return prev;
      }
      playPeaceTone();
      triggerHaptic([25]);
      notify(`« ${verseRef} » a été planté dans ton Jardin de la Parole 🌱`);
      return {
        ...prev,
        pearls: (prev.pearls || 0) + 1,
        leitnerCards: {
          ...prevCards,
          [verseRef]: {
            ref: verseRef,
            titre: verseText.slice(0, 45) + "...",
            texte: verseText,
            box: 1,
            lastReviewed: Date.now(),
            nextReview: Date.now() + 24 * 3600 * 1000
          }
        }
      };
    });
  };

  const currentBibleChapter = BIBLE_CHAPTERS[selectedChapterKey] || BIBLE_CHAPTERS["gen-1"];
  const activeEpoch = BIBLE_EPOCHS.find((e) => e.id === selectedEpochId) || BIBLE_EPOCHS[0];
  const activeTheme = THEMATIC_VERSES.find((t) => t.themeId === selectedThemeId) || THEMATIC_VERSES[0];

  const navTabs = [
    { name: "Accueil", icon: Home },
    { name: "Parcours", icon: Compass },
    { name: "Bible", icon: BookOpen },
    { name: "Fraternité", icon: Users },
    { name: "Profil", icon: UserRound }
  ];

  // PAGE D'ACCUEIL DE PRÉSENTATION & EMBARQUEMENT INITIAL (Landing Gate)
  if (!hasSeenLanding && (!user || user.isAnonymous)) {
    return (
      <div className="landing-wrapper">
        <WelcomeLanding
          onLoginClick={() => setAuthModalOpen(true)}
          onStartAsGuest={() => {
            try {
              localStorage.setItem("pelerinage_welcomed", "true");
            } catch {}
            setHasSeenLanding(true);
            notify("Bienvenue sur le sentier, cher ami pèlerin 🌿");
          }}
          nightMode={nightMode}
          setNightMode={setNightMode}
          pwaInstallPrompt={pwaInstallPrompt}
          onInstallPwa={handleInstallPwa}
        />
        {authModalOpen && (
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onAuthSuccess={async (u) => {
              await handleAuthSuccess(u);
              try {
                localStorage.setItem("pelerinage_welcomed", "true");
              } catch {}
              setHasSeenLanding(true);
              setAuthModalOpen(false);
            }}
            notify={notify}
          />
        )}
        {toast && (
          <div className="toast">
            <Sparkles size={18} />
            <span>{toast}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <ConfettiCanvas active={confettiActive} onComplete={() => setConfettiActive(false)} />

      {/* SIDEBAR DESKTOP */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <BookOpen size={24} />
            <span>✦</span>
          </div>
          <div>
            <strong>Le Grand</strong>
            <strong>Pèlerinage</strong>
            <small>de la Bible</small>
          </div>
        </div>

        <nav>
          {navTabs.map(({ name, icon: Icon }) => (
            <button
              key={name}
              className={`nav-link ${tab === name ? "active" : ""}`}
              onClick={() => {
                setTab(name);
                stopSpeech();
                setAudioPlaying(false);
              }}
            >
              <Icon size={19} />
              <span>{name}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="side-verse">
            « Ta parole est une lampe à mes pieds… »
            <small>Psaume 119:105</small>
          </div>
          <div className="mini-progress">
            <div>
              <span>{activeEpoch.nom}</span>
              <b>{Math.round((completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100)}%</b>
            </div>
            <div className="progress-track">
              <i style={{ width: `${(completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100}%` }} />
            </div>
          </div>
          <div className="sync-status">
            <span className={`status-dot ${firebaseStatus === "cloud" ? "connected" : ""}`} />
            <span>{firebaseStatus === "cloud" ? "Pèlerinage synchronisé" : "Progression sur cet appareil"}</span>
          </div>

          <button
            type="button"
            className="sidebar-presentation-btn"
            onClick={() => setHasSeenLanding(false)}
            title="Revoir la présentation et l'accueil du Pèlerinage"
          >
            <Sparkles size={14} />
            <span>Présentation du jeu</span>
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>Le Grand Pèlerinage</span>
            <ChevronRight size={14} />
            <b>{tab}</b>
          </div>

          <div className="top-actions">
            {/* STATUT RÉSEAU / MODE HORS-LIGNE */}
            <div
              className={`network-badge ${isOnline ? "online" : "offline"}`}
              title={isOnline ? "Connecté au réseau · Synchronisation active" : "Mode Hors-ligne · Progression conservée localement"}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hide-mobile">{isOnline ? "En ligne" : "Hors ligne"}</span>
            </div>

            {/* BOUTON INSTALLER PWA */}
            {pwaInstallPrompt && (
              <button
                type="button"
                className="pwa-topbar-install-btn"
                onClick={handleInstallPwa}
                title="Installer Le Grand Pèlerinage sur votre appareil (PWA)"
              >
                <Download size={14} />
                <span className="hide-mobile">Installer PWA</span>
              </button>
            )}

            {/* BOUTON MODE NUIT PAISIBLE */}
            <button
              className="icon-button"
              onClick={() => setNightMode((n) => !n)}
              aria-label={nightMode ? "Passer en mode jour" : "Passer en mode nuit paisible"}
              title={nightMode ? "Mode Jour" : "Mode Nuit Paisible"}
            >
              {nightMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              className="icon-button"
              onClick={() => notify("Tu es fidèle dans ta marche. Que la paix soit avec toi !")}
              aria-label="Encouragement du jour"
              title="Pensée spirituelle"
            >
              <Sparkles size={18} />
            </button>

            {/* BOUTON INVITER UN AMI & PARTAGER */}
            <button
              type="button"
              className="invite-badge-btn"
              onClick={() => setInviteModalOpen(true)}
              title="Inviter un ami ou partager ton score"
            >
              <UserPlus size={15} />
              <span className="hide-mobile">Inviter</span>
            </button>

            {/* LAMPES DE FOI (VIES / VIGILANCE) */}
            <button
              type="button"
              className={`lampes-badge ${lampes <= 1 ? "alert" : ""}`}
              onClick={() => {
                if (lampes < 5) {
                  setSpiritualHaltModal(true);
                } else {
                  notify("Tes 5 lampes de foi brillent d'une belle lumière ! 🪔✨");
                }
              }}
              title={`Lampes de foi : ${lampes}/5 - Clique pour une halte au puits de Jacob`}
            >
              <span className="lampes-icon">🪔</span>
              <span className="lampes-count">{lampes}/5</span>
            </button>

            {user && !user.isAnonymous ? (
              <button
                type="button"
                className="user-auth-badge"
                onClick={() => setTab("Profil")}
                title={`Connecté : ${user.email || profileName} (Synchronisé sur tous vos appareils)`}
              >
                <span className="sync-dot" />
                <span>{user.displayName || profileName}</span>
              </button>
            ) : (
              <button
                type="button"
                className="user-auth-badge guest"
                onClick={() => setAuthModalOpen(true)}
                title="Connecte-toi pour sauvegarder ton pèlerinage sur tous tes appareils"
              >
                <LogIn size={15} />
                <span>Connexion</span>
              </button>
            )}

            <button className="profile-chip" onClick={() => setTab("Profil")}>
              <span className="avatar">🌿</span>
              <span>
                {profileName}
                <small>Niveau {completedStages.length >= 4 ? 2 : 1}</small>
              </span>
              <ChevronRight size={15} />
            </button>
          </div>
        </header>

        {/* 1. ONGLET ACCUEIL */}
        {tab === "Accueil" && (
          <section className="page">
            {invitedByBanner && (
              <div className="invited-banner">
                <Sparkles size={18} />
                <span>🌿 Bienvenue ! Tu as été invité·e par <b>{invitedByBanner}</b> à cheminer sur Le Grand Pèlerinage de la Bible.</span>
                <button type="button" className="close-banner-btn" onClick={() => setInvitedByBanner(null)} aria-label="Fermer le bandeau">✕</button>
              </div>
            )}

            <div className="hero">
              <div className="hero-copy">
                <span className="eyebrow">
                  <Sparkles size={14} /> TON RENDEZ-VOUS AVEC LA PAROLE
                </span>
                <h1>Bonjour, {profileName} ! ☀️</h1>
                <p>Un petit pas chaque jour pour nourrir l'âme et grandir dans l'amour de Dieu.</p>
                <div className="hero-verse">
                  « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
                  <b>— Psaume 119:105</b>
                </div>
                <div className="hero-cta-group">
                  <button className="primary-button" onClick={() => setTab("Parcours")}>
                    Reprendre mon pèlerinage <ChevronRight size={18} />
                  </button>
                  <button
                    type="button"
                    className="secondary-button surprise-stage-btn"
                    onClick={handleRandomStageSurprise}
                    title="Lancer une étape aléatoire parmi les 72 étapes pour tester votre foi et vos connaissances"
                  >
                    <Shuffle size={17} />
                    <span>🎲 Défi Providenciel</span>
                  </button>
                </div>
              </div>

              <div className="hero-art" aria-hidden="true">
                <div className="sun" />
                <div className="mountain mountain-back" />
                <div className="mountain mountain-front" />
                <div className="river" />
                <div className="trail" />
                <div className="pilgrim">🎒</div>
                <div className="floating-leaf leaf-one">✦</div>
                <div className="floating-leaf leaf-two">✧</div>
              </div>
            </div>

            <div className="stats-row">
              <Stat icon={<Flame />} label="Série de jours" value={`${streak} jour`} tone="orange" />
              <Stat icon={<Gem />} label="Perles de vie" value={pearls} tone="blue" />
              <Stat icon={<Trophy />} label="Points de joie" value={`${xp} XP`} tone="green" />
              <Stat
                icon={<Heart />}
                label="Étapes vécues"
                value={`${completedStages.length} découvertes`}
                tone="rose"
              />
            </div>

            <div className="section-heading">
              <div>
                <span className="eyebrow">LE CHEMIN DE VIE</span>
                <h2>Reprends là où tu en es</h2>
              </div>
              <button className="text-button" onClick={() => setTab("Parcours")}>
                Voir tout le sentier <ChevronRight size={16} />
              </button>
            </div>

            <div className="home-grid">
              <div className="feature-card journey-card">
                <div className="card-art mini-landscape">
                  <span className="landscape-sun" />
                  <span className="landscape-hill h1" />
                  <span className="landscape-hill h2" />
                  <span className="landscape-river" />
                  <span className="art-label">{activeEpoch.nom.toUpperCase()}</span>
                </div>
                <div className="feature-body">
                  <div className="card-title-row">
                    <div>
                      <h3>{currentStage.titre}</h3>
                      <p>{currentStage.ref} · Découvre la lumière du récit divin.</p>
                    </div>
                    <span className="round-icon"><Compass size={18} /></span>
                  </div>
                  <div className="progress-label">
                    <span>Avancement de l'époque</span>
                    <b>{completedStages.filter((id) => currentStages.some((s) => s.id === id)).length} / {currentStages.length}</b>
                  </div>
                  <div className="progress-track">
                    <i style={{ width: `${(completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100}%` }} />
                  </div>
                  <button className="primary-button full" onClick={() => startStage(currentStage.id)}>
                    Continuer l'aventure <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="feature-card daily-card">
                <div className="daily-top">
                  <span className="round-icon green-icon"><Lightbulb size={20} /></span>
                  <span className="pill">3 MINUTES DE JOIE</span>
                </div>
                <h3>La perle du jour</h3>
                <p>Une courte découverte qui donne la paix pour toute la journée.</p>
                <div className="daily-verse">
                  <span>« Car Dieu a tant aimé le monde qu'il a donné son Fils unique… »</span>
                  <small>Jean 3:16</small>
                </div>
                <button
                  className="secondary-button full"
                  onClick={() => {
                    setSelectedChapterKey("jea-3");
                    setTab("Bible");
                  }}
                >
                  Méditer ce verset <Sparkles size={16} />
                </button>
              </div>

              <div className="feature-card kindness-card">
                <span className="kindness-illustration">🤝</span>
                <span className="eyebrow">GRANDIR ENSEMBLE</span>
                <h3>Un mot qui relève</h3>
                <p>« Encouragez-vous et édifiez-vous les uns les autres. »</p>
                <small>1 Thessaloniciens 5:11</small>
                <button
                  className="text-button"
                  onClick={() => handleShareBlessing(FRATERNAL_BLESSINGS[2])}
                >
                  Partager une bénédiction <Share2 size={15} />
                </button>
              </div>
            </div>

            {/* JARDIN DE LA PAROLE / RÉPÉTITION ESPACÉE LEITNER */}
            <div className="leitner-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">MÉMORISATION DU CŒUR</span>
                  <h2>Mon Jardin de la Parole</h2>
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    setLeitnerReviewIndex(0);
                    setLeitnerCardRevealed(false);
                    setLeitnerModalOpen(true);
                  }}
                >
                  Lancer la révision ({leitnerCards.length}) <ChevronRight size={16} />
                </button>
              </div>

              <div className="leitner-garden-card">
                <div className="leitner-stats-row">
                  {LEITNER_BOXES.map((box) => {
                    const count = leitnerCards.filter((c) => (c.box || 1) === box.level).length;
                    return (
                      <div key={box.level} className="leitner-box-stat">
                        <span className="box-icon">{box.icon}</span>
                        <b>{count}</b>
                        <small>{box.nom}</small>
                      </div>
                    );
                  })}
                </div>

                <div className="leitner-garden-cta">
                  <div>
                    <h4>Enracine la Parole dans ton quotidien</h4>
                    <p>Grâce au cycle de révision espacée (1j, 3j, 1sem, 1mois), chaque verset médité s'ancre durablement dans ton cœur.</p>
                  </div>
                  <button
                    className="primary-button"
                    onClick={() => {
                      setLeitnerReviewIndex(0);
                      setLeitnerCardRevealed(false);
                      setLeitnerModalOpen(true);
                    }}
                  >
                    <Sparkles size={17} /> Réviser mes versets ({leitnerCards.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="gentle-note">
              <Leaf size={20} />
              <span>
                <b>Pas de précipitation, pas de culpabilité.</b> La Parole de Dieu se savoure pas à pas. Prends simplement ce qui réjouit ton cœur aujourd'hui.
              </span>
              <Heart size={18} />
            </div>
          </section>
        )}

        {/* 2. ONGLET PARCOURS / SENTIER AVEC LES 7 ÉPOQUES */}
        {tab === "Parcours" && (
          <section className="page">
            <div className="page-intro with-action">
              <div>
                <span className="eyebrow"><MapPinned size={14} /> LA CARTE PAN-BIBLIQUE</span>
                <h1>Le Sentier de la Parole</h1>
                <p>Voyage à travers les 7 grandes époques bibliques. Chaque étape est une découverte vivante.</p>
              </div>
              <button
                type="button"
                className="secondary-button surprise-stage-btn"
                onClick={handleRandomStageSurprise}
                title="Lancer une étape aléatoire pour tester vos connaissances"
              >
                <Shuffle size={16} />
                <span>🎲 Étape Surprise</span>
              </button>
            </div>

            {/* SÉLECTEUR DE CARTE DES 7 ÉPOQUES */}
            <div className="epochs-container">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">CHOISIS TON ÉPOQUE</span>
                  <h2>Les 7 Grandes Époques</h2>
                </div>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>{activeEpoch.tagline}</span>
              </div>

              <div className="epochs-scroll">
                {BIBLE_EPOCHS.map((epoch) => (
                  <button
                    key={epoch.id}
                    className={`epoch-card ${selectedEpochId === epoch.id ? "active" : ""}`}
                    onClick={() => {
                      setSelectedEpochId(epoch.id);
                      const firstStage = (EPOCH_STAGES[epoch.id] || EPOCH_STAGES.racines)[0];
                      setActiveStageId(firstStage.id);
                      resetStageExercise();
                      notify(`Sentier : ${epoch.nom} ✨`);
                    }}
                  >
                    <div className="epoch-icon">{epoch.icon}</div>
                    <div className="epoch-name">{epoch.nom}</div>
                    <div className="epoch-books">{epoch.livres}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SYNTHÈSE DE L'ÉPOQUE */}
            <div className="journey-summary">
              <div className="summary-book"><BookOpen size={24} /></div>
              <div>
                <b>{activeEpoch.nom} ({activeEpoch.livres})</b>
                <small>
                  {completedStages.filter((id) => currentStages.some((s) => s.id === id)).length} sur {currentStages.length} étapes vécues · Louis Segond 1910
                </small>
              </div>
              <div className="summary-progress">
                <div className="progress-track">
                  <i style={{ width: `${(completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100}%` }} />
                </div>
                <small>
                  {Math.round((completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100)}% accompli
                </small>
              </div>
            </div>

            {/* SENTIER WINDING PATH SVG */}
            <div className="path-landscape">
              <div className="landscape-glow" />
              <div className="path-cloud cloud-a" />
              <div className="path-cloud cloud-b" />

              <svg className="winding-path" viewBox="0 0 1000 450" preserveAspectRatio="none" aria-hidden="true">
                {currentStages.map((stage, idx) => {
                  if (idx === 0) return null;
                  const prev = currentStages[idx - 1];
                  const x1 = prev.x * 10;
                  const y1 = prev.y * 4.5;
                  const x2 = stage.x * 10;
                  const y2 = stage.y * 4.5;
                  return (
                    <g key={`path-${stage.id}`}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#fff8dc"
                        strokeWidth="18"
                        strokeLinecap="round"
                      />
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#d6bd79"
                        strokeWidth="3.5"
                        strokeDasharray="5 9"
                        strokeLinecap="round"
                      />
                    </g>
                  );
                })}
              </svg>

              {currentStages.map((node) => {
                const isDone = completedStages.includes(node.id);
                const isCurrent = !isDone;

                return (
                  <button
                    key={node.id}
                    className={`path-node ${isDone ? "done" : ""} ${node.id === currentStage.id ? "current" : ""} ${node.subtile ? "subtile-node" : ""}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={() => startStage(node.id)}
                    aria-label={`${node.titre}`}
                  >
                    <span className="node-circle">
                      {isDone ? <Check size={20} /> : <span>{node.id}</span>}
                    </span>
                    <span className="node-label">
                      <b>{node.titre}</b>
                      <small>{node.ref}</small>
                      <div className="node-attributes-row">
                        {node.subtile && <span className="attr-pill subtile">🔍 Subtile</span>}
                        {node.tempsLimite && <span className="attr-pill timer">⏱️ {node.tempsLimite}s</span>}
                        {node.coutVie && <span className="attr-pill lampe">🪔 Défi</span>}
                      </div>
                      {isDone && <span className="node-stars">★ ★ ★</span>}
                      {node.id === currentStage.id && !isDone && <em>Étape en cours</em>}
                    </span>
                  </button>
                );
              })}

              <div className="path-caption">
                <Sparkles size={16} />
                <span>La Parole éclaire notre route, pas après pas.</span>
              </div>
            </div>

            <div className="below-path">
              <div className="feature-card next-step">
                <div className="round-icon"><BookOpen size={20} /></div>
                <div>
                  <div className="stage-meta-pills">
                    <span className={`diff-pill diff-${currentStage.difficulte || "debutant"}`}>
                      {currentStage.difficulte === "expert" ? "Expert & Subtil" : currentStage.difficulte === "avance" ? "Avancé" : currentStage.difficulte === "intermediaire" ? "Intermédiaire" : "Débutant"}
                    </span>
                    {currentStage.subtile && <span className="diff-pill subtile">🔍 Recherche biblique approfondie</span>}
                    {currentStage.tempsLimite && <span className="diff-pill chrono">⏱️ Défi : {currentStage.tempsLimite}s</span>}
                    {currentStage.coutVie && <span className="diff-pill cout-vie">🪔 Risque d'extinction de lampe</span>}
                  </div>
                  <span className="eyebrow">ÉTAPE SÉLECTIONNÉE</span>
                  <h3>{currentStage.titre}</h3>
                  <p>{currentStage.ref} · {currentStage.consigne}</p>
                </div>
                <button className="primary-button" onClick={() => startStage(currentStage.id)}>
                  Commencer l'étape <ChevronRight size={17} />
                </button>
              </div>

              <div className="treasure-card">
                <span className="treasure-chest">🎁</span>
                <div>
                  <b>Le coffre des perles</b>
                  <p>Chaque étape accomplie dépose une perle de vie dans ton trésor.</p>
                </div>
                <Sparkles size={18} />
              </div>
            </div>
          </section>
        )}

        {/* 3. ONGLET EXERCICE / ATELIER VIVANT */}
        {tab === "Exercice" && (
          <section className="page exercise-page">
            <button className="back-link" onClick={() => setTab("Parcours")}>
              ← Retour au sentier
            </button>

            <div className="exercise-shell">
              <div className="exercise-top">
                <span><BookOpen size={17} /> {currentStage.ref}</span>
                <span className="step-count">Époque {activeEpoch.nom}</span>
              </div>
              <div className="exercise-progress">
                <i style={{ width: "60%" }} />
              </div>

              <div className="exercise-content">
                <span className="eyebrow">ATELIER DU CŒUR</span>
                <h1>{currentStage.titre}</h1>
                <p>{currentStage.consigne}</p>

                {/* BADGES DE DIFFICULTÉ, CHRONO DYNAMIQUE ET DÉFI DE VIE */}
                <div className="exercise-meta-bar">
                  <span className={`diff-pill diff-${currentStage.difficulte || "debutant"}`}>
                    {currentStage.difficulte === "expert" ? "Expert & Subtil" : currentStage.difficulte === "avance" ? "Avancé" : currentStage.difficulte === "intermediaire" ? "Intermédiaire" : "Débutant"}
                  </span>

                  {currentStage.tempsLimite && !contemplativeMode && (
                    <div className={`stage-timer-badge ${timeLeft !== null && timeLeft <= 5 ? "urgent" : ""}`}>
                      <Timer size={15} />
                      <span className="timer-val">
                        {timeLeft !== null ? `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}` : "--:--"}
                      </span>
                      <button
                        type="button"
                        className="contemplative-toggle-btn"
                        onClick={() => {
                          setContemplativeMode(true);
                          setTimeLeft(null);
                          setTimerRunning(false);
                          notify("Mode contemplatif activé : avance à ton rythme sans chronomètre 🕊️");
                        }}
                        title="Désactiver le chronomètre et jouer en paix"
                      >
                        Mode calme
                      </button>
                    </div>
                  )}

                  {currentStage.tempsLimite && contemplativeMode && (
                    <div className="stage-timer-badge contemplative">
                      <Clock size={15} />
                      <span>Mode contemplatif</span>
                      <button
                        type="button"
                        className="contemplative-toggle-btn"
                        onClick={() => {
                          setContemplativeMode(false);
                          setTimeLeft(currentStage.tempsLimite);
                          setTimerRunning(true);
                          notify("Chronomètre de défi réactivé ! ⏱️");
                        }}
                        title="Réactiver le chronomètre de défi"
                      >
                        Chrono
                      </button>
                    </div>
                  )}

                  {currentStage.coutVie && (
                    <span className="diff-pill cout-vie" title="Une lampe s'éteint en cas de mauvaise réponse">
                      🪔 Défi de foi (Lampe en jeu)
                    </span>
                  )}
                </div>

                {/* RECOMMANDATIONS ET CONSEIL DE RECHERCHE BIBLIQUE */}
                {currentStage.conseilRecherche && (
                  <div className="study-hint-section">
                    <button
                      type="button"
                      className={`study-hint-toggle ${showStudyHint ? "open" : ""}`}
                      onClick={() => setShowStudyHint((prev) => !prev)}
                    >
                      <Lightbulb size={16} />
                      <span>{showStudyHint ? "Masquer le conseil de recherche" : "💡 Conseil de recherche biblique"}</span>
                      {currentStage.subtile && <span className="subtile-badge-inline">Recommandé</span>}
                    </button>
                    {showStudyHint && (
                      <div className="study-hint-card">
                        <div className="study-hint-header">
                          <BookOpen size={14} />
                          <b>Orientation dans les Écritures (Louis Segond 1910)</b>
                        </div>
                        <p>{currentStage.conseilRecherche}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* FORMAT 1 : ORDONNANCEMENT (GLISSER-DÉPOSER & TAP-TO-PLACE) */}
                {currentStage.type === "order" && (
                  <>
                    <div className="drag-hint">
                      <span>✨</span>
                      <span>Glisse les mots dans les cases ou clique simplement dessus pour les placer</span>
                    </div>

                    <div className="word-slots">
                      {currentStage.motsCorrects.map((_, i) => {
                        const wordInSlot = placedWords[i];
                        const isSlotOver = dragOverSlotIndex === i;
                        const isBeingDragged = draggedItem?.type === "slot" && draggedItem?.index === i;
                        return (
                          <button
                            key={i}
                            type="button"
                            data-slot-index={i}
                            draggable={!!wordInSlot && !exerciseFeedback}
                            className={`word-slot ${wordInSlot ? "filled" : ""} ${isSlotOver ? "drag-over" : ""} ${isBeingDragged ? "is-dragging" : ""}`}
                            onDragStart={(e) => handleDragStartFromSlot(e, wordInSlot, i)}
                            onDragOver={(e) => handleDragOverSlot(e, i)}
                            onDragLeave={() => setDragOverSlotIndex((cur) => (cur === i ? null : cur))}
                            onDrop={(e) => handleDropOnSlot(e, i)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => {
                              if (wordInSlot) {
                                handleTouchStart(e, { type: "slot", word: wordInSlot, index: i });
                              }
                            }}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => {
                              if (!exerciseFeedback && wordInSlot) {
                                handleRemoveWordFromSlot(i);
                              }
                            }}
                            title={wordInSlot ? "Clique ou glisse pour retirer ce mot" : `Case n° ${i + 1}`}
                          >
                            {wordInSlot || <span>{i + 1}</span>}
                          </button>
                        );
                      })}
                    </div>

                    <div
                      className={`word-bank ${dragOverBank ? "drag-over" : ""}`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedItem?.type === "slot") setDragOverBank(true);
                      }}
                      onDragLeave={() => setDragOverBank(false)}
                      onDrop={handleDropOnBank}
                    >
                      {(shuffledBankWords.length > 0 ? shuffledBankWords : currentStage.motsBanque).map((word, idx) => {
                        const isUsed = placedWords.includes(word);
                        const isTileDragging = draggedItem?.type === "bank" && draggedItem?.word === word;
                        return (
                          <button
                            key={idx}
                            type="button"
                            disabled={isUsed || !!exerciseFeedback}
                            draggable={!isUsed && !exerciseFeedback}
                            className={`word-tile ${isUsed ? "used" : ""} ${isTileDragging ? "is-dragging" : ""}`}
                            onDragStart={(e) => handleDragStartFromBank(e, word)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => {
                              if (!isUsed) {
                                handleTouchStart(e, { type: "bank", word });
                              }
                            }}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onClick={() => {
                              if (isUsed || exerciseFeedback) return;
                              handlePlaceWordInSlot(word);
                            }}
                            title={isUsed ? "Déjà placé" : "Clique ou glisse vers une case"}
                          >
                            {word}
                          </button>
                        );
                      })}
                    </div>

                    {/* Fantôme visuel flottant lors du glisser tactile sur mobile */}
                    {touchGhost && (
                      <div
                        className="touch-drag-ghost"
                        style={{
                          left: `${touchGhost.x}px`,
                          top: `${touchGhost.y}px`
                        }}
                      >
                        {touchGhost.word}
                      </div>
                    )}
                  </>
                )}

                {/* FORMAT 2 : QCM ILLUSTRE BIENVEILLANT (OPTIONS ALÉATOIRES) */}
                {currentStage.type === "qcm" && (
                  <div className="qcm-grid">
                    {(shuffledQcmOptions.length > 0 ? shuffledQcmOptions : currentStage.options).map((opt, idx) => (
                      <button
                        key={idx}
                        className={`qcm-option ${selectedQcmIndex === idx ? "selected" : ""}`}
                        disabled={!!exerciseFeedback}
                        onClick={() => setSelectedQcmIndex(idx)}
                      >
                        <span className="qcm-bullet">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt.text}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* FORMAT 3 : TEXTE A TROUS VIVANT (OPTIONS ALÉATOIRES) */}
                {currentStage.type === "cloze" && (
                  <>
                    <div className="cloze-box">
                      « {currentStage.phraseAvant}
                      <span className="cloze-blank">{selectedCloze || "……"}</span>
                      {currentStage.phraseApres} »
                    </div>

                    <div className="word-bank">
                      {(shuffledClozeOptions.length > 0 ? shuffledClozeOptions : currentStage.options).map((opt) => (
                        <button
                          key={opt}
                          className={`word-tile ${selectedCloze === opt ? "used" : ""}`}
                          disabled={!!exerciseFeedback}
                          onClick={() => setSelectedCloze(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* ENCART DE RETOUR PEDAGOGIQUE ET DISTINCTION ÉCRITURE / MÉDITATION */}
                {exerciseFeedback && (
                  <div className={`feedback ${exerciseFeedback.startsWith("Bravo") ? "success" : "try-again"}`}>
                    <span className="feedback-icon">{exerciseFeedback.startsWith("Bravo") ? "✨" : "🌿"}</span>
                    <div style={{ width: "100%" }}>
                      <b>{exerciseFeedback}</b>
                      {exerciseFeedback.startsWith("Bravo") && (
                        <>
                          {currentStage.ref && (
                            <div className="scripture-source-card">
                              <div className="scripture-source-tag">
                                <BookOpen size={12} /> {currentStage.ref} · Texte Biblique (Louis Segond 1910)
                              </div>
                              <p style={{ margin: 0, fontStyle: "italic", fontSize: "14px", lineHeight: "1.6" }}>
                                « {currentStage.motsCorrects ? currentStage.motsCorrects.join(" ") : (currentStage.phraseAvant ? `${currentStage.phraseAvant}${currentStage.motCorrect}${currentStage.phraseApres}` : currentStage.titre)} »
                              </p>
                            </div>
                          )}
                          {currentStage.explication && (
                            <div className="meditation-note-card">
                              <div className="meditation-tag">
                                <Sparkles size={12} /> Éclairage spirituel & Méditation
                              </div>
                              <p style={{ margin: 0 }}>{currentStage.explication}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="exercise-buttons">
                  {exerciseFeedback ? (
                    <button className="secondary-button" onClick={resetStageExercise}>
                      <RotateCcw size={17} /> Recommencer
                    </button>
                  ) : (
                    <button className="secondary-button" onClick={resetStageExercise}>
                      Effacer
                    </button>
                  )}

                  {exerciseFeedback.startsWith("Bravo") ? (
                    <button className="primary-button" onClick={nextStage}>
                      Continuer mon pèlerinage <ChevronRight size={17} />
                    </button>
                  ) : (
                    <button className="primary-button" onClick={validateExercise}>
                      Vérifier ma réponse <ChevronRight size={17} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 4. ONGLET BIBLE & CARNET SPIRITUEL */}
        {tab === "Bible" && (
          <section className="page">
            <div className="page-intro">
              <span className="eyebrow"><BookOpen size={14} /> LA PAROLE EN TOUT TEMPS</span>
              <h1>La Bible Intégrée</h1>
              <p>Lis, écoute et garde une perle de sagesse dans ton carnet personnel.</p>
            </div>

            <div className="bible-layout">
              <div className="bible-reader">
                <div className="reader-top">
                  <select
                    value={selectedBookId}
                    onChange={(e) => {
                      const book = e.target.value;
                      setSelectedBookId(book);
                      if (book === "gen") setSelectedChapterKey("gen-1");
                      if (book === "exo") setSelectedChapterKey("exo-20");
                      if (book === "psa") setSelectedChapterKey("psa-23");
                      if (book === "jea") setSelectedChapterKey("jea-1");
                      if (book === "rom") setSelectedChapterKey("rom-8");
                      if (book === "1co") setSelectedChapterKey("1co-13");
                      if (book === "apo") setSelectedChapterKey("apo-21");
                      stopSpeech();
                      setAudioPlaying(false);
                    }}
                    aria-label="Livre biblique"
                  >
                    {BIBLE_BOOKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nom} ({b.testament})
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedChapterKey}
                    onChange={(e) => {
                      setSelectedChapterKey(e.target.value);
                      stopSpeech();
                      setAudioPlaying(false);
                    }}
                    aria-label="Chapitre biblique"
                  >
                    {selectedBookId === "gen" && <option value="gen-1">Chapitre 1 (La Création)</option>}
                    {selectedBookId === "exo" && <option value="exo-20">Chapitre 20 (Les 10 Commandements)</option>}
                    {selectedBookId === "psa" && (
                      <>
                        <option value="psa-23">Psaume 23 (Le Berger)</option>
                        <option value="psa-91">Psaume 91 (La Protection Divine)</option>
                      </>
                    )}
                    {selectedBookId === "jea" && (
                      <>
                        <option value="jea-1">Chapitre 1 (La Parole faite chair)</option>
                        <option value="jea-3">Chapitre 3 (Nicodème & Jean 3:16)</option>
                      </>
                    )}
                    {selectedBookId === "rom" && <option value="rom-8">Chapitre 8 (Plus que vainqueurs)</option>}
                    {selectedBookId === "1co" && <option value="1co-13">Chapitre 13 (Cantique de l'Amour)</option>}
                    {selectedBookId === "apo" && <option value="apo-21">Chapitre 21 (La Cité de Paix)</option>}
                    {!["gen", "exo", "psa", "jea", "rom", "1co", "apo"].includes(selectedBookId) && (
                      <option value="gen-1">Chapitre 1</option>
                    )}
                  </select>

                  {/* BOUTON D'ÉCOUTE AUDIO */}
                  <button
                    className={`icon-button ${audioPlaying ? "active-audio" : ""}`}
                    onClick={() => {
                      const textToRead = `${currentBibleChapter.livre}, chapitre ${currentBibleChapter.chapitre}. ${currentBibleChapter.versets.map((v) => v.texte).join(" ")}`;
                      handleToggleAudio(textToRead);
                    }}
                    aria-label="Écouter la lecture audio"
                    title={audioPlaying ? "Arrêter l'écoute" : "Écouter la Parole"}
                  >
                    {audioPlaying ? <VolumeX size={19} /> : <Volume2 size={19} />}
                  </button>
                </div>

                <div className="reader-text">
                  <div className="scripture-source-tag" style={{ marginBottom: "10px" }}>
                    <BookOpen size={13} /> ÉCRITURE SAINTE · VERSION OFFICIELLE LOUIS SEGOND 1910
                  </div>
                  <h2>{currentBibleChapter.titre}</h2>
                  {currentBibleChapter.versets.map((v) => (
                    <p key={v.num}>
                      <sup>{v.num}</sup>
                      {v.cle ? <mark>{v.texte}</mark> : v.texte}
                    </p>
                  ))}
                  <small>
                    {currentBibleChapter.livre} {currentBibleChapter.chapitre} · Texte authentique Louis Segond 1910 (Libre de droits & vérifié)
                  </small>
                </div>

                <div className="reader-actions">
                  <button
                    className="secondary-button"
                    onClick={() => {
                      const keyVerse = currentBibleChapter.versets.find((v) => v.cle) || currentBibleChapter.versets[0];
                      handleAnchorVerse(`${currentBibleChapter.livre} ${currentBibleChapter.chapitre}:${keyVerse.num}`, keyVerse.texte);
                    }}
                  >
                    <Leaf size={16} /> Ancrer dans mon jardin
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => {
                      const keyVerse = currentBibleChapter.versets.find((v) => v.cle) || currentBibleChapter.versets[0];
                      setReflectionInput(`« ${keyVerse.texte} » (${currentBibleChapter.livre} ${currentBibleChapter.chapitre}:${keyVerse.num})\n\nMa prière : `);
                      notify("Verset préparé dans ton carnet spirituel 🌿");
                    }}
                  >
                    <BookMarked size={16} /> Méditer
                  </button>

                  <button
                    className="primary-button"
                    onClick={() => {
                      const keyVerse = currentBibleChapter.versets.find((v) => v.cle) || currentBibleChapter.versets[0];
                      handleShareBlessing({
                        verset: keyVerse.texte,
                        ref: `${currentBibleChapter.livre} ${currentBibleChapter.chapitre}:${keyVerse.num}`,
                        message: "Que cette Parole remplisse ta journée de paix !"
                      });
                    }}
                  >
                    <Share2 size={16} /> Partager
                  </button>
                </div>
              </div>

              {/* VOLET CARNET SPIRITUEL PERSONNEL */}
              <aside className="reflection-card">
                <span className="reflection-symbol">🌿</span>
                <span className="eyebrow">MON CARNET SPIRITUEL</span>
                <h3>Une pensée pour aujourd'hui</h3>
                <p>Garde une prière, une gratitude ou une promesse reçue dans le secret de ton cœur.</p>

                <textarea
                  placeholder="Une pensée, une gratitude, une prière personnelle…"
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                />

                <button
                  className="primary-button full"
                  onClick={() => handleSaveNote(`${currentBibleChapter.livre} ${currentBibleChapter.chapitre}`)}
                >
                  Enregistrer ma prière <Heart size={16} />
                </button>

                {carnetNotes.length > 0 && (
                  <div style={{ marginTop: "24px" }}>
                    <small style={{ fontWeight: 800, color: "#167240" }}>
                      TES DERNIÈRES PENSÉES ({carnetNotes.length})
                    </small>
                    <div style={{ maxHeight: "200px", overflowY: "auto", marginTop: "10px" }}>
                      {carnetNotes.slice(0, 3).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            background: "rgba(255,255,255,0.8)",
                            border: "1px solid #d8e9de",
                            borderRadius: "10px",
                            padding: "10px",
                            marginBottom: "8px",
                            fontSize: "12px"
                          }}
                        >
                          <small style={{ color: "#748a7d", display: "block", marginBottom: "4px" }}>
                            {n.date} · {n.source}
                          </small>
                          <p style={{ margin: 0, color: "#17324d", fontStyle: "italic" }}>
                            {n.texte.slice(0, 90)}...
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </aside>
            </div>

            {/* RECHERCHE THÉMATIQUE PAR ÉMOTIONS */}
            <div style={{ marginTop: "32px" }}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">LA PAROLE DANS MON QUOTIDIEN</span>
                  <h2>Versets selon les besoins de ton cœur</h2>
                </div>
              </div>

              <div className="theme-chips">
                {THEMATIC_VERSES.map((thm) => (
                  <button
                    key={thm.themeId}
                    className={`theme-chip ${selectedThemeId === thm.themeId ? "active" : ""}`}
                    onClick={() => setSelectedThemeId(thm.themeId)}
                  >
                    <span>{thm.icon}</span>
                    <span>{thm.label}</span>
                  </button>
                ))}
              </div>

              <div className="theme-verses-list">
                {activeTheme.versets.map((v, idx) => (
                  <div key={idx} className="theme-verse-card">
                    <p>« {v.texte} »</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <small>— {v.ref}</small>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="text-button"
                          onClick={() => handleToggleAudio(v.texte)}
                        >
                          <Volume2 size={14} /> Écouter
                        </button>
                        <button
                          className="text-button"
                          onClick={() => {
                            setReflectionInput(`« ${v.texte} » (${v.ref})\n\nMa prière : `);
                            notify("Verset préparé dans ton carnet spirituel 🌿");
                          }}
                        >
                          <BookMarked size={14} /> Méditer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5. ONGLET FRATERNITÉ (COMMUNION, MUR DE PRIÈRES & CLASSEMENT) */}
        {tab === "Fraternité" && (
          <section className="page">
            <div className="page-intro">
              <span className="eyebrow"><Users size={14} /> COMMUNION & ENCOURAGEMENT</span>
              <h1>La Fraternité des Pèlerins</h1>
              <p>Marcher ensemble, prier les uns pour les autres et s'édifier mutuellement.</p>
            </div>

            {/* CARTE GROUPE BIBLIQUE */}
            <div className="group-hero-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span className="pill" style={{ background: "rgba(255,255,255,0.2)", color: "#fff" }}>
                    GROUPE ACTIF
                  </span>
                  <h3>Église de la Paix & Amis</h3>
                  <p>« Un seul cœur, une seule foi, un même pèlerinage. »</p>
                </div>
                <span style={{ fontSize: "36px" }}>⛪</span>
              </div>

              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "6px" }}>
                  <span>Défi du mois : Découverte des Évangiles</span>
                  <b>85% franchis ensemble !</b>
                </div>
                <div className="progress-track" style={{ height: "10px", background: "rgba(255,255,255,0.25)" }}>
                  <i style={{ width: "85%", background: "#fff" }} />
                </div>
              </div>

              <div style={{ marginTop: "18px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  className="secondary-button"
                  style={{ background: "#fff", color: "#0756a5", border: "0" }}
                  onClick={() => {
                    notify("Encouragement envoyé au groupe : « Que Dieu vous fortifie ! » 🕊️");
                    triggerHaptic([30]);
                  }}
                >
                  <Send size={16} /> Envoyer un encouragement (1 clic)
                </button>
              </div>
            </div>

            {/* LE MUR DE PRIÈRES FRATERNELLES */}
            <div style={{ margin: "28px 0" }}>
              <div className="section-heading">
                <div>
                  <span className="eyebrow">COMMUNION DES CŒURS</span>
                  <h2>Le Mur de Prières & Gratitudes</h2>
                </div>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>Prier les uns pour les autres</span>
              </div>

              {/* Charte de bienveillance et protection fraternelle */}
              <div className="prayer-charter-banner">
                <span style={{ fontSize: "16px" }}>🛡️</span>
                <span>
                  <b>Charte fraternelle :</b> Espace de paix et d'édification mutuelle. Pour la protection de tous et des mineurs, les coordonnées personnelles (téléphone, e-mail) et les liens externes sont automatiquement exclus.
                </span>
              </div>

              <div className="prayer-composer">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span className="avatar">🌿</span>
                  <b style={{ fontSize: "13px" }}>{profileName}</b>
                  <small style={{ color: "var(--muted)", marginLeft: "auto" }}>Déposer une intention</small>
                </div>
                <textarea
                  placeholder="Partage une prière, une gratitude ou un besoin de soutien avec tes frères et sœurs…"
                  value={newPrayerText}
                  onChange={(e) => setNewPrayerText(e.target.value)}
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="primary-button" onClick={handleCreatePrayer}>
                    <Send size={15} /> Déposer ma prière
                  </button>
                </div>
              </div>

              <div className="prayers-list">
                {communityPrayers.map((prayer) => (
                  <div key={prayer.id} className="prayer-card">
                    <div className="prayer-header">
                      <div className="prayer-avatar">{prayer.avatar || "🕊️"}</div>
                      <span className="prayer-author">{prayer.auteur}</span>
                      <span className="prayer-date">{prayer.date}</span>
                    </div>
                    <p className="prayer-text">{prayer.texte}</p>
                    <div className="pray-card-footer">
                      <button
                        className="pray-support-btn"
                        onClick={() => handleSupportPrayer(prayer.id)}
                        title="Soutenir cette intention"
                      >
                        <span>🕊️ Je prie avec toi</span>
                        <b>({prayer.soutiens || 1})</b>
                      </button>
                      <button
                        className="pray-flag-btn"
                        onClick={() => handleFlagPrayer(prayer.id)}
                        title="Signaler ce message s'il ne respecte pas la paix fraternelle"
                      >
                        <Flag size={12} /> Signaler
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fraternite-grid">
              {/* LE PODIUM BIENVEILLANT */}
              <div>
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">MARCHEURS DE LA SEMAINE</span>
                    <h2>Podium Fraternel</h2>
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Mis à jour en temps réel</span>
                </div>

                <div className="podium-container">
                  {leaderboard.slice(0, 3).map((item, idx) => {
                    const rankClass = idx === 0 ? "first" : idx === 1 ? "second" : "third";
                    const badgeClass = idx === 0 ? "gold" : idx === 1 ? "silver" : "bronze";
                    const label = idx === 0 ? "1er" : idx === 1 ? "2e" : "3e";

                    return (
                      <div key={item.id} className={`podium-card ${rankClass}`}>
                        <span className={`podium-badge ${badgeClass}`}>{label}</span>
                        <div className="podium-avatar">{item.avatar}</div>
                        <div className="podium-name">{item.nom}</div>
                        <div className="podium-points">{item.points} XP</div>
                      </div>
                    );
                  })}
                </div>

                {/* LISTE DES AUTRES MARCHES */}
                <div style={{ background: "rgba(255,255,255,0.9)", border: "1px solid var(--line)", borderRadius: "16px", padding: "16px" }}>
                  {leaderboard.slice(3).map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 0",
                        borderBottom: index < leaderboard.slice(3).length - 1 ? "1px solid var(--line)" : "none"
                      }}
                    >
                      <b style={{ width: "24px", color: "var(--muted)", fontSize: "12px" }}>#{index + 4}</b>
                      <span style={{ fontSize: "20px" }}>{item.avatar}</span>
                      <div style={{ flex: 1 }}>
                        <b style={{ fontSize: "13px", color: "#17324d", display: "block" }}>{item.nom}</b>
                        <small style={{ color: "var(--muted)", fontSize: "11px" }}>{item.niveau}</small>
                      </div>
                      <b style={{ fontSize: "13px", color: "#0756a5" }}>{item.points} XP</b>
                    </div>
                  ))}
                </div>
              </div>

              {/* GENERATEUR DE CARTES DE BENEDICTION */}
              <div>
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">PAROLE DE VIE</span>
                    <h2>Cartes de Bénédiction</h2>
                  </div>
                </div>

                {FRATERNAL_BLESSINGS.map((blessing, idx) => (
                  <div key={idx} className="blessing-card">
                    <span className="pill">BÉNÉDICTION</span>
                    <h3 style={{ margin: "10px 0 6px", fontSize: "16px" }}>{blessing.titre}</h3>
                    <blockquote>« {blessing.verset} »</blockquote>
                    <small style={{ display: "block", color: "var(--muted)", marginBottom: "14px" }}>
                      {blessing.ref}
                    </small>
                    <button
                      className="primary-button full"
                      onClick={() => handleShareBlessing(blessing)}
                    >
                      <Share2 size={16} /> Envoyer à un frère ou une sœur
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. ONGLET PROFIL */}
        {tab === "Profil" && (
          <section className="page">
            <div className="page-intro">
              <span className="eyebrow"><UserRound size={14} /> TON ESPACE PERSONNEL</span>
              <h1>Ton pèlerinage, à ton rythme</h1>
              <p>Chaque pas compte aux yeux de Dieu. Voici la trace de ton parcours.</p>
            </div>

            <div className="profile-layout">
              <div className="profile-card">
                <div className="profile-avatar">🌿</div>
                <label htmlFor="pelerin-name" style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                  Comment souhaites-tu être appelé·e ?
                </label>
                <input
                  id="pelerin-name"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value.slice(0, 30))}
                  maxLength={30}
                  placeholder="Ton prénom ou pseudo"
                />

                {/* BLOC D'AUTHENTIFICATION & SYNCHRONISATION MULTI-APPAREILS */}
                {user && !user.isAnonymous ? (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "14px", padding: "14px", margin: "14px 0", textAlign: "left" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <b style={{ fontSize: "13px", color: "var(--text)" }}>Compte Pèlerin Synchronisé</b>
                      <span className="pill" style={{ background: "#e8f7ed", color: "#159447", fontSize: "11px", padding: "2px 8px" }}>
                        <Globe size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "3px" }} /> Multi-appareils
                      </span>
                    </div>
                    <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--muted)" }}>
                      {user.email ? `E-mail : ${user.email}` : "Connecté avec Google"}
                    </p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ padding: "8px 12px", fontSize: "12px" }}
                        onClick={handleSendProgressByEmail}
                        disabled={sendingBrevoEmail}
                      >
                        {sendingBrevoEmail ? <RefreshCw size={13} className="spin-icon" /> : <MailCheck size={13} />}
                        <span>Recevoir mon bilan par e-mail (Brevo)</span>
                      </button>
                      <button
                        type="button"
                        className="secondary-button"
                        style={{ padding: "8px 12px", fontSize: "12px", color: "#b91c1c", borderColor: "#fecaca" }}
                        onClick={handleLogout}
                      >
                        <LogOut size={13} />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "14px", padding: "16px", margin: "16px 0", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <AlertCircle size={16} color="#2563eb" />
                      <b style={{ fontSize: "13px", color: "#1e40af" }}>Ne perds jamais ta progression</b>
                    </div>
                    <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#3b82f6", lineHeight: 1.5 }}>
                      Connecte-toi avec <b>Google</b> ou par <b>e-mail</b> pour retrouver ton voyage et ton carnet spirituel sur n'importe quel ordinateur, smartphone ou tablette.
                    </p>
                    <button
                      type="button"
                      className="primary-button full"
                      style={{ padding: "10px", fontSize: "13px" }}
                      onClick={() => setAuthModalOpen(true)}
                    >
                      <LogIn size={15} />
                      <span>Créer mon compte / Me connecter</span>
                    </button>
                  </div>
                )}

                <div className="profile-metrics" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                  <div>
                    <b>{xp}</b>
                    <small>Points de joie</small>
                  </div>
                  <div>
                    <b>{pearls}</b>
                    <small>Perles de vie</small>
                  </div>
                  <div>
                    <b>{completedStages.length}</b>
                    <small>Étapes vécues</small>
                  </div>
                  <div>
                    <b>{leitnerCards.length}</b>
                    <small>Versets ancrés</small>
                  </div>
                </div>

                <button
                  className="secondary-button full"
                  onClick={() => {
                    if (user && !user.isAnonymous) {
                      notify("Ton compte est parfaitement synchronisé sur le Cloud 🌐");
                    } else {
                      setAuthModalOpen(true);
                    }
                  }}
                >
                  {user && !user.isAnonymous ? "Vérifier la synchronisation Cloud" : "Activer la synchronisation Cloud"}
                </button>

                {/* ACTIONS COMPLÉMENTAIRES : PWA ET PRÉSENTATION */}
                <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {pwaInstallPrompt && (
                    <button
                      type="button"
                      className="primary-button full"
                      onClick={handleInstallPwa}
                    >
                      <Download size={15} />
                      <span>Installer l'application sur cet appareil (PWA)</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="secondary-button full"
                    onClick={() => setHasSeenLanding(false)}
                  >
                    <Sparkles size={15} />
                    <span>Revoir la Présentation & l'Accueil du Pèlerinage</span>
                  </button>
                </div>
              </div>

              {/* VICTOIRES & BADGES */}
              <div className="feature-card" style={{ padding: "24px" }}>
                <span className="eyebrow">TES PETITES VICTOIRES</span>
                <h2 style={{ margin: "10px 0 20px" }}>Des pas qui ont du sens</h2>

                <div className="achievement">
                  <span className="achievement-icon">🌱</span>
                  <div>
                    <b>Premier pas</b>
                    <small>Tu as commencé ton pèlerinage dans la Parole.</small>
                  </div>
                  <Check size={18} color="#159447" />
                </div>

                <div className="achievement">
                  <span className="achievement-icon">✨</span>
                  <div>
                    <b>Perle du Cœur</b>
                    <small>Tu as remis un verset dans le bon ordre.</small>
                  </div>
                  {completedStages.length >= 1 ? <Check size={18} color="#159447" /> : <LockKeyhole size={17} />}
                </div>

                <div className={`achievement ${leitnerCards.length >= 1 ? "" : "dimmed"}`}>
                  <span className="achievement-icon">🌿</span>
                  <div>
                    <b>Jardinier de la Parole</b>
                    <small>{leitnerCards.length} verset(s) enraciné(s) dans ton cœur par révision espacée.</small>
                  </div>
                  {leitnerCards.length >= 1 ? <Check size={18} color="#159447" /> : <LockKeyhole size={17} />}
                </div>

                <div className={`achievement ${completedStages.length >= 3 ? "" : "dimmed"}`}>
                  <span className="achievement-icon">🐑</span>
                  <div>
                    <b>Brebis du Bon Berger</b>
                    <small>Tu as médité sur la confiance du Psaume 23.</small>
                  </div>
                  {completedStages.length >= 3 ? <Check size={18} color="#159447" /> : <LockKeyhole size={17} />}
                </div>

                <div className={`achievement ${completedStages.length >= 5 ? "" : "dimmed"}`}>
                  <span className="achievement-icon">💖</span>
                  <div>
                    <b>Amour Éternel</b>
                    <small>Tu as contemplé l'amour infini de Jean 3:16.</small>
                  </div>
                  {completedStages.length >= 5 ? <Check size={18} color="#159447" /> : <LockKeyhole size={17} />}
                </div>
              </div>
            </div>

            <div className="gentle-note" style={{ marginTop: "24px" }}>
              <Heart size={20} />
              <span>
                <b>Ta valeur ne se mesure pas en points ni en vitesse.</b> Ces étapes célèbrent simplement les moments précieux que tu consacres à Dieu.
              </span>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>✦ Le Grand Pèlerinage de la Bible</span>
          <span>Un voyage au cœur de la Parole, à ton rythme.</span>
        </footer>
      </main>

      {/* BOTTOM NAVIGATION BAR MOBILE (< 800px) */}
      <nav className="bottom-nav" aria-label="Navigation mobile">
        {navTabs.map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={`bottom-nav-item ${tab === name ? "active" : ""}`}
            onClick={() => {
              setTab(name);
              stopSpeech();
              setAudioPlaying(false);
            }}
          >
            <Icon />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      {/* MODAL DE RÉVISION LEITNER DU JARDIN DE LA PAROLE */}
      {leitnerModalOpen && (
        <div className="modal-overlay" onClick={() => setLeitnerModalOpen(false)}>
          <div className="modal-card leitner-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span className="leitner-modal-icon">🌱</span>
                <div>
                  <h3>Mon Jardin de la Parole</h3>
                  <span className="eyebrow">RÉPÉTITION ESPACÉE & ANCRAGE DU CŒUR</span>
                </div>
              </div>
              <button className="icon-close" onClick={() => setLeitnerModalOpen(false)} aria-label="Fermer">✕</button>
            </div>

            {leitnerCards.length === 0 ? (
              <div className="leitner-empty-state">
                <p>Aucun verset n'est encore semé dans ton jardin.</p>
                <small>Accomplis des étapes sur le Sentier ou ancre un verset depuis la Bible !</small>
              </div>
            ) : (
              <div className="leitner-review-content">
                {leitnerReviewIndex < leitnerCards.length ? (
                  (() => {
                    const card = leitnerCards[leitnerReviewIndex];
                    const boxInfo = LEITNER_BOXES.find((b) => b.level === (card.box || 1)) || LEITNER_BOXES[0];
                    return (
                      <div className="leitner-card-view">
                        <div className="leitner-card-progress">
                          <span>Verset {leitnerReviewIndex + 1} sur {leitnerCards.length}</span>
                          <span className="leitner-badge" style={{ backgroundColor: boxInfo.color + "22", color: boxInfo.color }}>
                            {boxInfo.icon} Niveau {boxInfo.level} · {boxInfo.nom}
                          </span>
                        </div>

                        <div className="leitner-flashcard">
                          <span className="leitner-ref-tag">{card.ref}</span>
                          <h2 className="leitner-stage-title">{card.titre}</h2>

                          {!leitnerCardRevealed ? (
                            <div className="leitner-hidden-box">
                              <p className="leitner-prompt-text">
                                Prends quelques secondes pour te remémorer ce verset dans ton cœur…
                              </p>
                              <button
                                className="secondary-button"
                                onClick={() => {
                                  triggerHaptic([20]);
                                  setLeitnerCardRevealed(true);
                                }}
                              >
                                <Sparkles size={16} /> Révéler la Parole
                              </button>
                            </div>
                          ) : (
                            <div className="leitner-revealed-box">
                              <blockquote className="leitner-quote">
                                « {card.texte || "La Parole de Dieu est une lampe à nos pieds et une lumière sur notre sentier."} »
                              </blockquote>
                              <button
                                className="audio-listen-btn"
                                onClick={() => {
                                  const txt = card.texte;
                                  if (txt) playSpeech(txt);
                                }}
                              >
                                <Volume2 size={16} /> Écouter à voix haute
                              </button>
                            </div>
                          )}
                        </div>

                        {leitnerCardRevealed && (
                          <div className="leitner-actions-row">
                            <button
                              className="leitner-revisit-btn"
                              onClick={() => handleReviewAnswer(card.ref, false)}
                            >
                              🌱 À consolider (Revoir demain)
                            </button>
                            <button
                              className="leitner-master-btn"
                              onClick={() => handleReviewAnswer(card.ref, true)}
                            >
                              ✨ Bien ancré ! (+1 Niveau)
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div className="leitner-congrats-view">
                    <span className="congrats-emoji">🕊️</span>
                    <h3>Session de révision accomplie !</h3>
                    <p>Chaque graine arrosée aujourd'hui produira un fruit de paix et d'espérance dans ta marche avec Dieu.</p>
                    <button
                      className="primary-button"
                      onClick={() => {
                        setLeitnerModalOpen(false);
                        setLeitnerReviewIndex(0);
                        setLeitnerCardRevealed(false);
                      }}
                    >
                      Retourner à mon pèlerinage <ChevronRight size={17} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE HALTE BIENVEILLANTE AU PUITS DE JACOB (RESTAURATION DES LAMPES) */}
      {spiritualHaltModal && (
        <div className="modal-backdrop" onClick={() => { if (lampes > 0) setSpiritualHaltModal(false); }}>
          <div className="modal-card spiritual-halt-card" onClick={(e) => e.stopPropagation()}>
            <div className="halt-icon-header">
              <span className="halt-icon">🪔</span>
              <span className="halt-sparkles">✦ ✧ ✦</span>
            </div>
            <h2>Halte au Puits de Jacob</h2>
            <p className="halt-sub">
              {lampes === 0
                ? "Toutes tes lampes se sont éteintes. Dans la marche spirituelle, la fatigue et les hésitations font partie du chemin."
                : "Prends un instant pour faire silence et renouveler tes forces dans la présence de Dieu."}
            </p>

            <div className="halt-verse-box">
              <span className="halt-tag">EAU VIVE & MÉDITATION</span>
              <blockquote>
                « Mais celui qui boira de l'eau que je lui donnerai n'aura jamais soif, et l'eau que je lui donnerai deviendra en lui une source d'eau qui jaillira jusque dans la vie éternelle. »
              </blockquote>
              <cite>— Jean 4:14 (Louis Segond 1910)</cite>
            </div>

            <p className="halt-advice">
              Au puits de Jacob, Jésus accueille la fatigue de chaque pèlerin avec tendresse. Bois à la source de la grâce pour rallumer tes 5 lampes de foi.
            </p>

            <div className="modal-actions-column">
              <button
                type="button"
                className="primary-button full"
                onClick={() => {
                  setLampes(5);
                  setSpiritualHaltModal(false);
                  playDivineChime();
                  triggerHaptic([30, 60, 30]);
                  notify("Tes 5 lampes de foi brillent à nouveau d'une vive clarté ! 🪔🕊️");
                }}
              >
                ✨ Boire à la source et rallumer mes 5 lampes
              </button>
              {lampes > 0 && (
                <button
                  type="button"
                  className="secondary-button full"
                  onClick={() => setSpiritualHaltModal(false)}
                >
                  Poursuivre ma marche ({lampes} lampes allumées)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL D'INVITATION ET DE PARTAGE DE SCORE */}
      <InviteShareModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        user={user}
        profileName={profileName}
        stats={{
          xp,
          pearls,
          streak,
          stagesCount: completedStages.length,
          versesCount: leitnerCards.length
        }}
        notify={notify}
      />

      {/* MODAL D'AUTHENTIFICATION MULTI-APPAREILS */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        notify={notify}
      />

      {/* TOAST DE NOTIFICATION BIENVEILLANT */}
      {toast && (
        <div className="toast">
          <Sparkles size={18} />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, tone }) {
  return (
    <div className="stat-card">
      <span className={`stat-icon ${tone}`}>{icon}</span>
      <div>
        <small>{label}</small>
        <b>{value}</b>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
