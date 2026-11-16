import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, Compass, Home, UserRound, Flame, Gem, Trophy, Star, LockKeyhole,
  Check, ChevronRight, Sparkles, Volume2, VolumeX, Heart, Share2, RotateCcw,
  Lightbulb, Users, Leaf, MapPinned, BookMarked, Send, MessageCircleHeart,
  Award, ShieldCheck, Smile, Moon, Sun, Search, Flag, LogIn, LogOut, Globe,
  AlertCircle, MailCheck, RefreshCw, Timer, Clock, UserPlus, Info, AlertTriangle,
  Shuffle, Wifi, WifiOff, Download, Smartphone, X, Zap, Gamepad2, Bell, Gift, Shield
} from "lucide-react";

import "./styles.css";
import "./styles/reduced-motion.css";
import { ConfettiCanvas } from "./components/ConfettiCanvas";
import { AuthModal } from "./components/AuthModal";
import InviteShareModal from "./components/InviteShareModal";
import BlessingShareModal from "./components/BlessingShareModal";
import WelcomeLanding from "./components/WelcomeLanding";
import { InfiniteArenaModal } from "./components/InfiniteArenaModal";
import { Bible66BooksModal } from "./components/Bible66BooksModal";
import GamesHubView from "./features/games/GamesHubView";
import MemorizationHubModal from "./features/memorization/MemorizationHubModal";
import NotificationCenterModal from "./features/notifications/NotificationCenterModal";
import HomeDashboardV2 from "./features/home/HomeDashboardV2";
import CommunityGroupsV2 from "./features/community/CommunityGroupsV2";
import BibleStudyEnhancements from "./features/bible/BibleStudyEnhancements";
import AdminPortalApp from "./features/admin/AdminPortalApp";
import PedagogicalAndAccessibilityCard from "./features/profile/PedagogicalAndAccessibilityCard";
import { EXTENDED_BIBLE_CHAPTERS } from "./data/bibleGamesData";
import {
  initPelerinAuth,
  syncPelerinProfile,
  loadPelerinProfile,
  saveCarnetNote,
  loadCarnetNotes,
  getLocalCarnetNotes,
  fetchClassementFraternel,
  fetchCommunityPrayers,
  addCommunityPrayer,
  supportCommunityPrayer,
  flagCommunityPrayer,
  logoutPelerin,
  checkIsPseudoAvailable,
  reservePelerinPseudo,
  setFirestoreOnline,
  setFirestoreOffline,
  normalizePseudo
} from "./services/firebase";
import { reconcilePelerinData, migratePelerinProfileV2 } from "./services/dataReconciliation";
import { sendProgressSummaryEmail } from "./services/brevoMailer";
import { awardStageCompletion, clampScore, dueLeitnerCards, motionAllowed, reviewLeitnerCard, updateDailyStreak } from "./services/progression";
import { createMemorizationCard, getMemorizationDashboardStats } from "./services/memorizationEngine";
import { getEpochChests } from "./services/gamificationEngine";
import { loadAccessibilityPrefs, saveAccessibilityPrefs, applyAccessibilityToDocument } from "./services/accessibilitySettings";
import {
  loadNotificationPrefs,
  saveNotificationPrefs,
  generateSmartNotifications,
  loadLocalNotificationInbox,
  saveLocalNotificationInbox,
  syncNotificationToFirestore,
  fetchFirestoreNotifications
} from "./services/notificationsEngine";
import { loadGroup } from "./services/churchGroup";
import {
  fetchChurchAnnouncements,
  loadLocalAnnouncements,
  isRouteAdmin,
  loadSystemFlags,
  loadWeeklySpiritualConfig,
  loadBlessingsConfig
} from "./services/adminAnalytics";
import { contributeCollectiveChallenge } from "./services/churchGroupCloud";
import { firstOpenStage, isBonusPlayable, isEpochUnlocked, isStagePlayable } from "./services/pathProgress";
import ChurchGroupCard from "./components/ChurchGroupCard";
import { validatePrayerContent } from "./services/moderation";
import {
  BIBLE_BOOKS,
  BIBLE_CHAPTERS,
  BIBLE_EPOCHS,
  EPOCH_STAGES,
  BONUS_STAGES,
  PATH_STAGES,
  THEMATIC_VERSES,
  FRATERNAL_BLESSINGS,
  INITIAL_COMMUNITY_PRAYERS,
  LEITNER_BOXES,
  CELESTIAL_LEAGUES,
  getCurrentLeague,
  DOVE_BLESSINGS
} from "./data/bibleData";
import {
  playSpeech,
  stopSpeech,
  triggerHaptic,
  playDivineChime,
  playPeaceTone,
  playPairSuccessChime,
  playLeagueFanfare,
  playLampRestoreSound,
  playErrorGentleTone
} from "./services/audioSpeech";

// Correspondance exacte entre les livres disponibles en lecture intégrale et leurs clés BIBLE_CHAPTERS / EXTENDED_BIBLE_CHAPTERS
const BOOK_CHAPTERS_MAP = {
  gen: ["gen-1", "gen-14", "gen-22"],
  exo: ["exo-3", "exo-20"],
  deu: ["deu-6"],
  psa: ["psa-1", "psa-23", "psa-91", "psa-121"],
  pro: ["pro-3", "pro-30"],
  esa: ["esa-53"],
  dan: ["dan-9"],
  mat: ["mat-5", "mat-6"],
  jea: ["jea-1", "jea-3", "jea-14", "jea-15"],
  act: ["act-17"],
  rom: ["rom-8", "rom-12"],
  "1co": ["1co-13"],
  phi: ["phi-4"],
  jac: ["jac-1"],
  "1je": ["1jn-4"],
  apo: ["apo-21"]
};

const ALL_BIBLE_CHAPTERS = { ...BIBLE_CHAPTERS, ...EXTENDED_BIBLE_CHAPTERS };

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

  // Profil et Progression du Pèlerin avec parsing sécurisé
  const [profileName, setProfileName] = useState(() => {
    try {
      const raw = localStorage.getItem("pelerinage_profile_local");
      const p = raw ? JSON.parse(raw) : null;
      return (p && typeof p === "object" && typeof p.profileName === "string") ? p.profileName : "Ami pèlerin";
    } catch {
      return "Ami pèlerin";
    }
  });

  // États pour l'unicité stricte du pseudonyme dans la base commune
  const [pseudoError, setPseudoError] = useState("");
  const [pseudoSuccess, setPseudoSuccess] = useState("");
  const [isSavingPseudo, setIsSavingPseudo] = useState(false);

  const [saved, setSaved] = useState(() => {
    try {
      const raw = localStorage.getItem("pelerinage_progress");
      const parsed = raw ? JSON.parse(raw) : null;
      return migratePelerinProfileV2(
        parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {}
      );
    } catch {
      return migratePelerinProfileV2({});
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

  // Glisser / Déposer (Drag & Drop tactile & souris des mots)
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState(null);
  const [dragOverBank, setDragOverBank] = useState(false);
  const [touchGhost, setTouchGhost] = useState(null);
  const touchStateRef = useRef({ item: null });

  // Glissement tactile et souris de la Carte du Sentier (Défilement fluide 10 étapes)
  const pathViewportRef = useRef(null);

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

  // Exercices d'Élévation : Paires, Vrai/Faux, Qui a dit ?
  const [pairsSelected, setPairsSelected] = useState([]);
  const [pairsMatched, setPairsMatched] = useState([]);
  const [tfAnswer, setTfAnswer] = useState(null);
  const [whosaidSelected, setWhosaidSelected] = useState(null);
  const [shuffledWhosaidSpeakers, setShuffledWhosaidSpeakers] = useState([]);
  const [shuffledPairsRight, setShuffledPairsRight] = useState([]);

  // Bénédiction WhatsApp, Boutique de Grâce, Arène Infinie & Trésor des 66 Livres
  const [blessingModalOpen, setBlessingModalOpen] = useState(false);
  const [graceShopModalOpen, setGraceShopModalOpen] = useState(false);
  const [showInfiniteArena, setShowInfiniteArena] = useState(false);
  const [showBible66Modal, setShowBible66Modal] = useState(false);

  // Colombe de la Paix 🕊️ Mascotte
  const [doveVisible, setDoveVisible] = useState(false);
  const [doveMessage, setDoveMessage] = useState("");
  const doveTimeoutRef = useRef(null);

  // Version 2.0 : Mémorisation 4 étapes, Centre Notifications, Accessibilité, Communauté & Portail /admin isolé
  const [isAdminRoute, setIsAdminRoute] = useState(() =>
    isRouteAdmin(typeof window !== "undefined" ? window.location.pathname : "/")
  );
  const [memorizationHubOpen, setMemorizationHubOpen] = useState(false);
  const [notifCenterOpen, setNotifCenterOpen] = useState(false);
  const [accessibilityPrefs, setAccessibilityPrefs] = useState(() => loadAccessibilityPrefs());
  const [notifPrefs, setNotifPrefs] = useState(() => loadNotificationPrefs());
  const [notifInbox, setNotifInbox] = useState(() => loadLocalNotificationInbox());
  const [churchGroupState, setChurchGroupState] = useState(() => loadGroup());
  const [churchAnnouncements, setChurchAnnouncements] = useState(() => loadLocalAnnouncements());
  const [systemFlags] = useState(() => loadSystemFlags());
  const [bibleChaptersReadCount, setBibleChaptersReadCount] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onPopState = () => setIsAdminRoute(isRouteAdmin(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    applyAccessibilityToDocument(accessibilityPrefs);
  }, [accessibilityPrefs]);

  useEffect(() => {
    fetchChurchAnnouncements().then((anns) => {
      if (Array.isArray(anns) && anns.length > 0) setChurchAnnouncements(anns);
    });
  }, []);

  const leitnerCards = useMemo(() => {
    const cards = saved.leitnerCards;
    if (!cards || typeof cards !== "object" || Array.isArray(cards)) return [];
    return Object.values(cards);
  }, [saved.leitnerCards]);

  const leitnerDueCards = useMemo(
    () => dueLeitnerCards(saved.leitnerCards),
    [saved.leitnerCards]
  );

  const completedStages = useMemo(
    () => (Array.isArray(saved.completedStages) ? saved.completedStages : []),
    [saved.completedStages]
  );
  const masteredBooks = useMemo(
    () => (Array.isArray(saved.masteredBooks) ? saved.masteredBooks : []),
    [saved.masteredBooks]
  );
  const visibleScore = clampScore(completedStages.length, saved.xp || 0, saved.pearls || 0);
  const frontierStage = useMemo(
    () => firstOpenStage(currentStages, completedStages) || currentStages[0],
    [currentStages, completedStages]
  );
  const xp = visibleScore.xp;
  const pearls = visibleScore.pearls;
  const streak = Number.isFinite(saved.streak) ? saved.streak : 0;

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
      await setFirestoreOnline();
      notify("Connexion rétablie 🟢 ! Synchronisation automatique de ton sentier avec la base commune…");

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
          notify("Toutes tes étapes et ton Jardin sont synchronisés avec la base commune 🕊️✨");
        } catch (e) {
          console.warn("Synchronisation automatique différée :", e);
        }
      }
    };

    const handleOffline = async () => {
      setIsOnline(false);
      await setFirestoreOffline();
      notify("Mode hors-ligne actif 🟡. Tes progrès restent en sécurité sur cet appareil et convergeront vers la base dès la reconnexion 🌿");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [user, profileName, xp, pearls, streak, saved]);

  // Détection d'invitation dans l'URL (?invite=...&by=...) avec assainissement anti-injection
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.location?.search) {
        const searchParams = new URLSearchParams(window.location.search);
        const invitedBy = searchParams.get("by") || searchParams.get("invite");
        if (invitedBy) {
          // Tronquer et éliminer tout caractère de script, balise ou contrôle HTML/DOM
          const decoded = decodeURIComponent(invitedBy).trim().slice(0, 35);
          const sanitized = decoded.replace(/[<>'"/\\`(){}[\];=]/g, "").trim();
          if (sanitized && sanitized.length >= 2) {
            setInvitedByBanner(sanitized);
          }
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
            setSaved((prev) => migratePelerinProfileV2({ ...prev, ...cloudData.saved }));
            if (typeof cloudData.saved.lampes === "number") {
              setLampes(cloudData.saved.lampes);
            }
          }
        }
        fetchFirestoreNotifications(currentUser.uid).then((remoteNotifs) => {
          if (Array.isArray(remoteNotifs) && remoteNotifs.length > 0) {
            setNotifInbox((prev) => {
              const map = new Map();
              [...remoteNotifs, ...prev].forEach((n) => {
                if (n?.id) map.set(n.id, n);
              });
              const merged = Array.from(map.values()).slice(0, 60);
              saveLocalNotificationInbox(merged);
              return merged;
            });
          }
        });
        const notes = await loadCarnetNotes(currentUser.uid);
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

  // Sauvegarde locale immédiate et synchronisation cloud debouncée (600ms) pour une fluidité 60fps constante
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

    if (!user) return;

    const timer = setTimeout(() => {
      syncPelerinProfile(user.uid, profilePayload);
    }, 600);

    return () => clearTimeout(timer);
  }, [profileName, saved, xp, pearls, streak, user]);

  // Centrage automatique et glissement fluide vers l'étape en cours
  useEffect(() => {
    if (tab === "Parcours" && pathViewportRef.current) {
      const timeout = setTimeout(() => {
        if (!pathViewportRef.current) return;
        const activeNodeEl = pathViewportRef.current.querySelector(".path-node.current") || pathViewportRef.current.querySelector(".path-node");
        if (activeNodeEl) {
          activeNodeEl.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [tab, activeStageId, selectedEpochId]);

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
      const notes = await loadCarnetNotes(authenticatedUser.uid);
      setCarnetNotes(notes);
    }
  };

  const handleLogout = async () => {
    await logoutPelerin();
    setUser(null);
    setFirebaseStatus("guest");
    setCarnetNotes(getLocalCarnetNotes("local"));
    notify("Tu es déconnecté·e. Ta progression reste en sécurité sur ton compte 🌿");
  };

  const handleSaveProfileName = async () => {
    setPseudoError("");
    setPseudoSuccess("");
    const clean = normalizePseudo(profileName);
    if (!clean || clean.length < 2) {
      setPseudoError("Le nom de pèlerin doit comporter au moins 2 caractères.");
      return;
    }
    setIsSavingPseudo(true);
    try {
      const check = await checkIsPseudoAvailable(profileName, user?.uid);
      if (!check.available) {
        setPseudoError(check.reason || "Ce nom de pèlerin est déjà réservé par un autre joueur.");
        setIsSavingPseudo(false);
        return;
      }

      if (user && !user.isAnonymous) {
        await reservePelerinPseudo(user.uid, profileName);
        await syncPelerinProfile(user.uid, { profileName });
      } else {
        try {
          const raw = localStorage.getItem("pelerinage_profile_local");
          const p = raw ? JSON.parse(raw) : {};
          localStorage.setItem("pelerinage_profile_local", JSON.stringify({ ...p, profileName }));
        } catch {}
      }
      setPseudoSuccess("✓ Nom unique validé et synchronisé dans la base commune 🌿");
      notify("Ton nom de pèlerin est validé et garanti sans doublon ✨");
    } catch (err) {
      setPseudoError(err?.message || "Impossible de vérifier le nom actuellement.");
    } finally {
      setIsSavingPseudo(false);
    }
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
        notify("Bilan préparé. Ajoute BREVO_API_KEY sur le serveur pour l'envoi réel.");
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
    if (systemFlags.prayersEnabled === false) {
      notify("🕊️ Le dépôt de nouvelles prières est momentanément en pause par l'administration.");
      return;
    }
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

  // Sentier actif : étapes de base, extension et questions du Défi Jean, plus les bonus.
  const allKnownStages = useMemo(() => {
    const list = Object.values(EPOCH_STAGES).flat();
    return [...list, ...BONUS_STAGES];
  }, []);

  // Logique de validation d'un atelier d'étape
  const currentStage = allKnownStages.find((s) => s.id === activeStageId) || currentStages[0];

  // Affichage de la Colombe de la Paix 🕊️ avec message bienveillant
  const showDove = useCallback((customMsg = null, category = "success") => {
    let msg = customMsg;
    if (!msg) {
      const pool = DOVE_BLESSINGS[category] || DOVE_BLESSINGS.success;
      msg = pool[Math.floor(Math.random() * pool.length)];
    }
    setDoveMessage(msg);
    setDoveVisible(true);
    if (doveTimeoutRef.current) clearTimeout(doveTimeoutRef.current);
    doveTimeoutRef.current = setTimeout(() => {
      setDoveVisible(false);
    }, 6000);
  }, []);

  // Préparation du contenu aléatoire (Banque de mots, options QCM, Cloze, Paires, Qui a dit)
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
    if (stageObj.type === "pairs" && Array.isArray(stageObj.pairs)) {
      setPairsSelected([]);
      setPairsMatched([]);
      const rightItems = stageObj.pairs.map((p, idx) => ({ text: p.right, origIndex: idx }));
      setShuffledPairsRight(shuffleArray(rightItems));
    }
    if (stageObj.type === "truefalse") {
      setTfAnswer(null);
    }
    if (stageObj.type === "whosaid") {
      setWhosaidSelected(null);
      if (Array.isArray(stageObj.speakers)) {
        setShuffledWhosaidSpeakers(shuffleArray(stageObj.speakers));
      }
    }
  }, []);

  useEffect(() => {
    setupRandomExerciseContent(currentStage);
  }, [activeStageId, selectedEpochId, setupRandomExerciseContent]);

  // Gestion de la sélection interactive des Paires bibliques
  const handlePairCardClick = (origIndex, side) => {
    if (exerciseFeedback || pairsMatched.includes(origIndex)) return;

    setPairsSelected((prev) => {
      const existingSameSide = prev.find((p) => p.side === side);
      const otherSide = prev.find((p) => p.side !== side);

      if (!otherSide) {
        // Premier choix ou changement de choix sur le même côté
        if (existingSameSide && existingSameSide.origIndex === origIndex) {
          return []; // Désélectionner
        }
        return [{ origIndex, side }];
      }

      // On a déjà un élément de l'autre côté !
      if (otherSide.origIndex === origIndex) {
        // MATCH PARFAIT !
        playPairSuccessChime();
        triggerHaptic([10, 40, 10]);
        setPairsMatched((pm) => [...pm, origIndex]);
        return [];
      } else {
        // Discordance douce
        playErrorGentleTone();
        triggerHaptic([30, 20]);
        return [{ origIndex, side }];
      }
    });
  };

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
    } else if (currentStage.type === "pairs") {
      const totalPairs = (currentStage.pairs || []).length;
      if (pairsMatched.length < totalPairs) {
        setExerciseFeedback("Relie toutes les paires pour valider l'étape 🌿");
        return;
      }
      isSuccess = true;
    } else if (currentStage.type === "truefalse") {
      if (tfAnswer === null) {
        setExerciseFeedback("Choisis Vrai ou Faux pour continuer 🌿");
        return;
      }
      isSuccess = (tfAnswer === currentStage.isTrue);
    } else if (currentStage.type === "whosaid") {
      if (!whosaidSelected) {
        setExerciseFeedback("Qui a dit cette parole ? Choisis une personne 🌿");
        return;
      }
      isSuccess = (whosaidSelected === currentStage.correctSpeaker);
    }

    if (isSuccess) {
      setTimerRunning(false);
      const reward = awardStageCompletion(saved, currentStage, Date.now(), selectedEpochId);
      if (motionAllowed()) {
        playDivineChime();
        triggerHaptic([20, 60, 20]);
        setConfettiActive(true);
      }
      setExerciseFeedback(
        reward.alreadyDone
          ? "Cette étape est déjà accomplie. Tu peux la méditer à nouveau, sans nouveau point."
          : "Bravo ! Ton cœur accueille la Parole avec joie ✨"
      );

      const prevLeague = getCurrentLeague(saved.xp || 0).league;
      const newLeague = getCurrentLeague(reward.saved.xp || 0).league;
      if (!reward.alreadyDone && newLeague.id !== prevLeague.id) {
        if (motionAllowed()) playLeagueFanfare();
        showDove(`Gloire à Dieu ! Tu accèdes à la Ligue ${newLeague.nom} ${newLeague.icon} !`, "leagueUp");
      } else if (!reward.alreadyDone) {
        showDove(null, "success");
      }

      setSaved((prev) => awardStageCompletion(prev, currentStage, Date.now(), selectedEpochId).saved);
    } else {
      triggerHaptic([40, 20]);
      playErrorGentleTone();

      // Retour pédagogique spécifique pour Vrai/Faux
      if (currentStage.type === "truefalse") {
        const feedbackDetail = tfAnswer ? currentStage.explicationVrai : currentStage.explicationFaux;
        if (feedbackDetail) {
          setExerciseFeedback(`Pas tout à fait. ${feedbackDetail} 🌿`);
        } else {
          setExerciseFeedback("Ce n'est pas tout à fait cela. Médite l'indice et réessaie 🌿");
        }
      } else if (currentStage.type === "whosaid") {
        setExerciseFeedback(`Ce n'était pas ${whosaidSelected}. Relis bien la citation et laisse parler l'Esprit 🌿`);
      } else if (currentStage.coutVie) {
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

  const resetStageExercise = (stageOverride = null) => {
    const targetStage = stageOverride || currentStage;
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

    // Réinitialisation des formats d'élévation
    setPairsSelected([]);
    setPairsMatched([]);
    setTfAnswer(null);
    setWhosaidSelected(null);

    setupRandomExerciseContent(targetStage);

    // RÉARMEMENT DU DÉCOMPTE DU TEMPS : Le chrono redémarre instantanément
    if (targetStage?.tempsLimite && !contemplativeMode) {
      setTimeLeft(targetStage.tempsLimite);
      setTimerRunning(true);
    } else {
      setTimeLeft(null);
      setTimerRunning(false);
    }
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
    const stageObjPreview = allKnownStages.find((s) => s.id === stageId) || currentStages[0];
    const bonus = BONUS_STAGES.find((item) => item.id === stageId);
    const epochId = stageObjPreview?.epoch || selectedEpochId;
    const allowed = bonus
      ? isBonusPlayable(bonus, BIBLE_EPOCHS, EPOCH_STAGES, completedStages)
      : isStagePlayable(stageId, epochId, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
    if (!allowed) {
      notify("Franchis l'étape précédente pour ouvrir celle-ci.");
      return;
    }
    setActiveStageId(stageId);
    const stageObj = allKnownStages.find((s) => s.id === stageId) || currentStages[0];
    if (stageObj && stageObj.epoch && stageObj.epoch !== selectedEpochId) {
      setSelectedEpochId(stageObj.epoch);
    }
    resetStageExercise(stageObj);
    setTab("Exercice");
  };

  const nextStage = () => {
    const curIdx = currentStages.findIndex((s) => s.id === activeStageId);
    if (curIdx >= 0 && curIdx < currentStages.length - 1) {
      const nextStageObj = currentStages[curIdx + 1];
      startStage(nextStageObj.id);
    } else {
      setTimeLeft(null);
      setTimerRunning(false);
      setTab("Parcours");
      notify("Toutes les étapes de cette époque sont accomplies ! Gloire à Dieu 🌟");
    }
  };

  // Défi Providenciel : Sélectionne une étape surprise au hasard parmi les 81 étapes (base + bonus)
  const handleRandomStageSurprise = () => {
    const allEpochStages = Object.entries(EPOCH_STAGES).flatMap(([epochId, stages]) =>
      stages.map((st) => ({ ...st, epochId }))
    );
    const bonusStagesWithEpoch = BONUS_STAGES.map((b) => ({ ...b, epochId: b.epoch }));
    const allStages = [...allEpochStages, ...bonusStagesWithEpoch];

    // Priorité aux étapes non encore franchies
    const uncompleted = allStages.filter((stage) => {
      if (completedStages.includes(stage.id)) return false;
      const bonus = BONUS_STAGES.find((item) => item.id === stage.id);
      if (bonus) return isBonusPlayable(bonus, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
      return isStagePlayable(stage.id, stage.epochId || stage.epoch, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
    });
    const pool = uncompleted.length > 0 ? uncompleted : allStages.filter((stage) => completedStages.includes(stage.id));
    const picked = pool[Math.floor(Math.random() * pool.length)];

    if (picked) {
      if (picked.epochId) setSelectedEpochId(picked.epochId);
      startStage(picked.id);
      playPeaceTone();
      triggerHaptic([20, 40]);
      notify(`🎲 Défi Providenciel : « ${picked.titre} » (${picked.ref}) ! ✨`);
    }
  };

  // Gestion de la réponse en révision Leitner
  const handleReviewAnswer = (cardRef, isSuccess) => {
    const preview = reviewLeitnerCard(saved, cardRef, isSuccess, Date.now());
    if (preview.waiting) {
      notify("Ce verset n'est pas encore échu. Reviens à la date prévue.");
      return;
    }
    if (isSuccess && preview.awarded && motionAllowed()) {
      playDivineChime();
      triggerHaptic([20, 60, 20]);
      setConfettiActive(true);
      notify(`« ${cardRef} » monte au Niveau ${preview.newBox}.`);
    } else if (!isSuccess) {
      playPeaceTone();
      if (motionAllowed()) triggerHaptic([30]);
      notify(`« ${cardRef} » repart au premier niveau et reviendra demain.`);
    }
    setSaved((prev) => reviewLeitnerCard(prev, cardRef, isSuccess, Date.now()).saved);

    setLeitnerCardRevealed(false);
    setLeitnerReviewIndex((idx) => idx + 1);
  };

  // Ancrer un verset lu dans le Jardin depuis la Bible (V1 Leitner + V2 4-étapes)
  const handleAnchorVerse = (verseRef, verseText, livre = "") => {
    setSaved((prev) => {
      const prevCards = prev.leitnerCards || {};
      const prevMemoCards = prev.memorizationCards || {};
      const existing = prevCards[verseRef] || prevMemoCards[verseRef];
      if (existing) {
        notify(`« ${verseRef} » est déjà dans Mes Versets à Retenir 🌿`);
        return prev;
      }
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, prev.xp || 0, (prev.pearls || 0) + 1);
      playPeaceTone();
      triggerHaptic([25]);
      notify(`« ${verseRef} » a été planté dans Mes Versets à Retenir 🌱`);
      const memoCard = createMemorizationCard({ ref: verseRef, texte: verseText, livre }, Date.now());
      contributeCollectiveChallenge("col-memo-10", 1);
      return {
        ...prev,
        pearls: capped.pearls,
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
        },
        memorizationCards: {
          ...prevMemoCards,
          [verseRef]: memoCard
        }
      };
    });
  };

  // Récompenses issues de l'Arène de la Foi (plafonnées selon les règles serveur)
  const handleArenaRewards = ({ xp: earnedXp = 0, perles: earnedPearls = 0 } = {}) => {
    const addXp = Math.max(0, Math.round(Number(earnedXp) || 0));
    const addPearls = Math.max(0, Math.round(Number(earnedPearls) || 0));
    if (addXp === 0 && addPearls === 0) return;

    setSaved((prev) => {
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, (prev.xp || 0) + addXp, (prev.pearls || 0) + addPearls);
      return {
        ...prev,
        xp: capped.xp,
        pearls: capped.pearls
      };
    });
    notify(`⚔️ Récolte de l'Arène : +${addXp} XP · +${addPearls} 💎 !`);
  };

  // Maîtrise d'un des 66 livres de la Bible (encyclopédie & quiz canonique)
  const handleMasterBook = (bookId) => {
    if (!bookId) return;
    setSaved((prev) => {
      const prevMastered = Array.isArray(prev.masteredBooks) ? prev.masteredBooks : [];
      if (prevMastered.includes(bookId)) {
        return prev;
      }
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, (prev.xp || 0) + 50, (prev.pearls || 0) + 2);
      return {
        ...prev,
        xp: capped.xp,
        pearls: capped.pearls,
        masteredBooks: [...prevMastered, bookId]
      };
    });
    notify("📚 Livre canonique maîtrisé ! +50 XP et +2 Perles ✨");
  };

  const memorizationStats = useMemo(
    () => getMemorizationDashboardStats(saved.memorizationCards, saved.leitnerCards),
    [saved.memorizationCards, saved.leitnerCards]
  );

  const unlockedEpochsCount = useMemo(
    () => BIBLE_EPOCHS.filter((ep) => isEpochUnlocked(ep.id, BIBLE_EPOCHS, EPOCH_STAGES, completedStages)).length,
    [completedStages]
  );

  const collectionStats = useMemo(() => ({
    charactersPlayed: Array.isArray(saved.playedCharacters) ? saved.playedCharacters.length : 0,
    masteredBooksCount: masteredBooks.length,
    versesAnchored: memorizationStats.discoveredCount,
    chestsCount: Array.isArray(saved.unlockedChests) ? saved.unlockedChests.length : 0,
    stagesCount: completedStages.length,
    epochsCount: unlockedEpochsCount
  }), [saved.playedCharacters, masteredBooks.length, memorizationStats.discoveredCount, saved.unlockedChests, completedStages.length, unlockedEpochsCount]);

  const totalStagesCount = useMemo(
    () => Object.values(EPOCH_STAGES).reduce((sum, list) => sum + list.length, 0),
    []
  );

  // Génération intelligente des notifications dans le Centre de Notifications (sans spam ni plage silencieuse)
  useEffect(() => {
    const currentInbox = loadLocalNotificationInbox();
    const { notifications, generated } = generateSmartNotifications(
      {
        lastActiveDay: saved.lastActiveDay,
        streak,
        dueMemorizationCount: memorizationStats.dueCount,
        nextStageTitle: frontierStage?.titre,
        groupCode: churchGroupState?.code,
        weeklyChallengeDone: Boolean(churchGroupState?.weekDone && Object.keys(churchGroupState.weekDone).length > 0)
      },
      notifPrefs,
      currentInbox,
      Date.now()
    );
    if (generated.length > 0) {
      setNotifInbox(notifications);
      saveLocalNotificationInbox(notifications);
      if (user && !user.isAnonymous) {
        generated.forEach((g) => syncNotificationToFirestore(user.uid, g));
      }
    }
  }, [frontierStage?.id, memorizationStats.dueCount, saved.lastActiveDay, streak, churchGroupState?.code, notifPrefs, user?.uid]);

  const handleV2GameReward = ({ gameId, xp: gainXp = 0, pearls: gainPearls = 0, stars: gainStars = 0, characterId }) => {
    setSaved((prev) => {
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, (prev.xp || 0) + gainXp, (prev.pearls || 0) + gainPearls);
      const streakUp = updateDailyStreak(prev, Date.now());
      const prevGameStats = prev.gameStats && typeof prev.gameStats === "object" ? prev.gameStats : {};
      const prevChars = Array.isArray(prev.playedCharacters) ? prev.playedCharacters : [];
      const nextChars = characterId && !prevChars.includes(characterId) ? [...prevChars, characterId] : prevChars;
      return {
        ...prev,
        xp: capped.xp,
        pearls: capped.pearls,
        stars: (prev.stars || 0) + gainStars,
        streak: streakUp.streak,
        lastActiveDay: streakUp.lastActiveDay,
        playedCharacters: nextChars,
        gameStats: {
          ...prevGameStats,
          [gameId]: (prevGameStats[gameId] || 0) + 1
        }
      };
    });
    contributeCollectiveChallenge("col-games-100", 1);
  };

  const handleDailyChallengeCompleted = ({ dateKey, score, total, recompense }) => {
    setSaved((prev) => {
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, (prev.xp || 0) + (recompense?.xp || 40), (prev.pearls || 0) + (recompense?.perles || 3));
      const streakUp = updateDailyStreak(prev, Date.now());
      const prevDaily = prev.dailyChallengeHistory && typeof prev.dailyChallengeHistory === "object" ? prev.dailyChallengeHistory : {};
      return {
        ...prev,
        xp: capped.xp,
        pearls: capped.pearls,
        stars: (prev.stars || 0) + (score >= total - 1 ? 3 : 2),
        streak: streakUp.streak,
        lastActiveDay: streakUp.lastActiveDay,
        dailyChallengeHistory: {
          ...prevDaily,
          [dateKey]: { score, total, completedAt: Date.now() }
        },
        gameStats: {
          ...(prev.gameStats || {}),
          daily: ((prev.gameStats || {}).daily || 0) + 1
        }
      };
    });
    if (motionAllowed()) setConfettiActive(true);
    notify(`☀️ Défi du Jour validé (${score}/${total}) ! +${recompense?.xp || 40} XP · +${recompense?.perles || 3} 💎`);
  };

  const handleUpdateMemorizationCard = (ref, updatedCard) => {
    setSaved((prev) => ({
      ...prev,
      memorizationCards: {
        ...(prev.memorizationCards || {}),
        [ref]: updatedCard
      }
    }));
  };

  const handleClaimEpochChest = (chest) => {
    if (!chest || !chest.ready || chest.claimed) return;
    setSaved((prev) => {
      const prevChests = Array.isArray(prev.unlockedChests) ? prev.unlockedChests : [];
      if (prevChests.includes(chest.id)) return prev;
      const count = Array.isArray(prev.completedStages) ? prev.completedStages.length : 0;
      const capped = clampScore(count, (prev.xp || 0) + (chest.reward?.xp || 35), (prev.pearls || 0) + (chest.reward?.pearls || 2));
      return {
        ...prev,
        xp: capped.xp,
        pearls: capped.pearls,
        unlockedChests: [...prevChests, chest.id]
      };
    });
    if (motionAllowed()) setConfettiActive(true);
    playLeagueFanfare();
    notify(`🎁 ${chest.titre} ouvert ! +${chest.reward?.xp || 35} XP · +${chest.reward?.pearls || 2} 💎`);
  };

  const unreadNotificationsCount = useMemo(
    () => notifInbox.filter((n) => !n.archived && !n.read).length,
    [notifInbox]
  );

  const currentBibleChapter = ALL_BIBLE_CHAPTERS[selectedChapterKey] || ALL_BIBLE_CHAPTERS["gen-1"];
  const activeEpoch = BIBLE_EPOCHS.find((e) => e.id === selectedEpochId) || BIBLE_EPOCHS[0];
  const activeTheme = THEMATIC_VERSES.find((t) => t.themeId === selectedThemeId) || THEMATIC_VERSES[0];

  const navTabs = [
    { name: "Accueil", icon: Home },
    { name: "Parcours", icon: Compass },
    { name: "Jeux", icon: Gamepad2 },
    { name: "Bible", icon: BookOpen },
    { name: "Profil", icon: UserRound }
  ];

  // PORTAIL D'ADMINISTRATION STRICTEMENT ISOLÉ SUR /admin
  if (isAdminRoute) {
    return (
      <AdminPortalApp
        leaderboard={leaderboard}
        prayers={communityPrayers}
        memorizationStats={memorizationStats}
        completedStages={completedStages}
        gameStats={saved.gameStats || {}}
        epochStages={EPOCH_STAGES}
        onBackToPublic={() => setIsAdminRoute(false)}
      />
    );
  }

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
            onPlayAsGuest={() => {
              try {
                localStorage.setItem("pelerinage_welcomed", "true");
              } catch {}
              setHasSeenLanding(true);
              setAuthModalOpen(false);
              notify("Bienvenue sur le sentier, cher ami pèlerin 🌿");
            }}
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
          <button
            className={`nav-link ${tab === "Fraternité" ? "active" : ""}`}
            onClick={() => {
              setTab("Fraternité");
              stopSpeech();
              setAudioPlaying(false);
            }}
          >
            <Users size={19} />
            <span>Fraternité</span>
          </button>
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

          {/* MENTION OFFICIELLE DE PROPRIÉTÉ DANS LA SIDEBAR */}
          <div className="sidebar-church-ownership">
            <span className="church-cross-micro">✝</span>
            <div>
              <small>Propriété de l'</small>
              <b>Église Évangélique Assemblée de la Grâce</b>
              <span>Issia · Côte d'Ivoire</span>
            </div>
          </div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="breadcrumb">
            <span className="hide-mobile">Le Grand Pèlerinage</span>
            <ChevronRight size={14} className="hide-mobile" />
            <b>{tab}</b>
          </div>

          <div className="top-actions">
            {/* STATUT RÉSEAU / MODE HORS-LIGNE & BASE UNIQUE */}
            <button
              type="button"
              className={`network-badge ${isOnline ? "online" : "offline"}`}
              onClick={() => {
                if (isOnline) {
                  notify("🟢 En ligne : synchronisé avec la base commune de tous les joueurs.");
                } else {
                  notify("🟡 Mode Hors-ligne : tes progrès restent conservés sur cet appareil et convergeront vers la base dès la reconnexion.");
                }
              }}
              title={isOnline ? "En ligne · Synchronisé avec la base commune" : "Hors ligne · Progrès conservés localement"}
              style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", padding: 0 }}
            >
              {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
              <span className="hide-mobile">{isOnline ? "En ligne" : "Hors ligne"}</span>
            </button>

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
              type="button"
              className="invite-badge-btn"
              onClick={() => setMemorizationHubOpen(true)}
              title="Je retiens la Parole — Mes Versets à Retenir (4 étapes)"
            >
              <Leaf size={15} />
              <span className="hide-mobile">Versets{memorizationStats.dueCount > 0 ? ` (${memorizationStats.dueCount})` : ""}</span>
            </button>

            <button
              type="button"
              className="icon-button v2-bell-btn"
              onClick={() => setNotifCenterOpen(true)}
              aria-label="Centre de notifications"
              title="Notifications et rappels"
            >
              <Bell size={18} />
              {unreadNotificationsCount > 0 && (
                <span className="v2-bell-badge">{unreadNotificationsCount}</span>
              )}
            </button>

            <button
              className="icon-button hide-mobile"
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
                <span className="auth-badge-name">{user.displayName || profileName}</span>
              </button>
            ) : (
              <button
                type="button"
                className="user-auth-badge guest"
                onClick={() => setAuthModalOpen(true)}
                title="Connecte-toi pour sauvegarder ton pèlerinage sur tous tes appareils"
              >
                <LogIn size={15} />
                <span className="auth-badge-name">Connexion</span>
              </button>
            )}

            <button className="profile-chip hide-mobile" onClick={() => setTab("Profil")}>
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

            <HomeDashboardV2
              pelerinName={profileName}
              xp={xp}
              streak={streak}
              completedStages={completedStages}
              totalStages={totalStagesCount}
              dueMemorizationCount={memorizationStats.dueCount}
              masteredVersesCount={memorizationStats.masteredCount}
              todayChallengeDone={Boolean(saved.dailyChallengeHistory?.[new Date().toISOString().slice(0, 10)])}
              bibleChaptersRead={bibleChaptersReadCount}
              prayerShared={communityPrayers.some((p) => p.auteur === profileName)}
              weeklyGroupDone={Boolean(churchGroupState?.weekDone && Object.keys(churchGroupState.weekDone).length > 0)}
              collectionStats={collectionStats}
              nextStage={frontierStage}
              announcements={churchAnnouncements}
              weeklySpiritual={loadWeeklySpiritualConfig()}
              onResumeStage={(st) => startStage(st.id)}
              onNavigate={(targetTab) => setTab(targetTab)}
              onOpenMemorization={() => setMemorizationHubOpen(true)}
            />

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
                    title="Lancer une étape aléatoire sur tout le sentier pour tester votre foi et vos connaissances"
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

            {/* BANNIÈRE DE LIGUE CÉLESTE & PROGRESSION */}
            {(() => {
              const { league, nextLeague, progress } = getCurrentLeague(xp);
              return (
                <div className="celestial-league-card" style={{ borderColor: league.color }}>
                  <div className="league-card-left">
                    <span className="league-badge-icon" style={{ background: `${league.color}22`, border: `2px solid ${league.color}` }}>
                      {league.icon}
                    </span>
                    <div className="league-info">
                      <div className="league-title-row">
                        <span className="league-eyebrow">LIGUE CÉLESTE</span>
                        <h4 className="league-name" style={{ color: league.color }}>
                          Ligue {league.nom}
                        </h4>
                      </div>
                      <p className="league-perk">{league.perks}</p>
                      <div className="league-progress-track">
                        <div
                          className="league-progress-fill"
                          style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${league.color}, #f59e0b)` }}
                        />
                      </div>
                      <div className="league-xp-status">
                        <span>{xp} XP accumulés</span>
                        <span>{nextLeague ? `${nextLeague.minXp - xp} XP avant la Ligue ${nextLeague.nom}` : "Rang d'Excellence Céleste 👑"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="league-actions">
                    <button
                      type="button"
                      className="elevation-btn arena-launch-btn"
                      onClick={() => setShowInfiniteArena(true)}
                      title="Relever des défis infinis avec multiplicateur de série"
                    >
                      <Zap size={16} />
                      <span>Arène Infinie</span>
                    </button>

                    <button
                      type="button"
                      className="elevation-btn books-launch-btn"
                      onClick={() => setShowBible66Modal(true)}
                      title="Explorer l'encyclopédie et les quiz des 66 livres de la Bible"
                    >
                      <BookOpen size={16} />
                      <span>66 Livres ({masteredBooks.length}/66)</span>
                    </button>

                    <button
                      type="button"
                      className="elevation-btn blessing-btn"
                      onClick={() => setBlessingModalOpen(true)}
                      title="Créer une carte biblique personnalisée"
                    >
                      <Share2 size={16} />
                      <span>Carte Bénédiction</span>
                    </button>

                    <button
                      type="button"
                      className="elevation-btn shop-btn"
                      onClick={() => setGraceShopModalOpen(true)}
                      title="Boutique de Grâce et restauration de lampes"
                    >
                      <span>🪔 Boutique de Grâce</span>
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* MASCOTTE INTERACTIVE : LA COLOMBE DE LA PAIX 🕊️ */}
            <div className="dove-mascot-container">
              <button
                type="button"
                className="dove-mascot-btn"
                onClick={() => showDove()}
                aria-label="Recevoir une parole de bénédiction de la Colombe"
              >
                <span className="dove-mascot-avatar">🕊️</span>
                <span className="dove-mascot-label">Colombe de la Paix</span>
              </button>

              {doveVisible && (
                <div className="dove-speech-bubble" onClick={() => setDoveVisible(false)}>
                  <p className="dove-bubble-text">{doveMessage}</p>
                  <span className="dove-bubble-tip">Toucher pour refermer 🌿</span>
                </div>
              )}
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
                      <h3>{frontierStage?.titre}</h3>
                      <p>{frontierStage?.ref} · La prochaine étape ouverte sur ton sentier.</p>
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
                  <button className="primary-button full" onClick={() => startStage(frontierStage?.id)}>
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
                    setSelectedBookId("jea");
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
                  Lancer la révision ({leitnerDueCards.length}) <ChevronRight size={16} />
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
                    <Sparkles size={17} /> Réviser mes versets ({leitnerDueCards.length})
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
              <div className="page-intro-actions">
                <button
                  type="button"
                  className="secondary-button surprise-stage-btn"
                  onClick={handleRandomStageSurprise}
                  title="Lancer une étape aléatoire pour tester vos connaissances"
                >
                  <Shuffle size={16} />
                  <span>🎲 Étape Surprise</span>
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowInfiniteArena(true)}
                  title="Entrer dans l'Arène de la Foi (défi infini)"
                >
                  <Zap size={16} />
                  <span>⚔️ Arène Infinie</span>
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowBible66Modal(true)}
                  title="Découvrir les 66 livres canoniques et relever leurs défis"
                >
                  <BookOpen size={16} />
                  <span>📚 66 Livres ({masteredBooks.length}/66)</span>
                </button>
              </div>
            </div>

            {/* SÉLECTEUR DE CARTE DES 7 ÉPOQUES (GAME HUD ÉPURÉ) */}
            <div className="epochs-container">
              <div className="game-hud-bar">
                <div className="hud-badge-epoch">
                  <span className="hud-epoch-icon">{activeEpoch.icon}</span>
                  <div>
                    <span className="hud-game-tag">MONDE EN COURS</span>
                    <h2 className="hud-epoch-title">{activeEpoch.nom}</h2>
                  </div>
                </div>

                <div className="hud-game-stats">
                  <div className="hud-stat-pill" title="Étoiles de maîtrise accumulées">
                    <Star size={16} className="stat-star-icon" fill="currentColor" />
                    <span>{completedStages.filter((id) => currentStages.some((s) => s.id === id)).length * 3}</span>
                  </div>
                  <div className="hud-stat-pill" title="Progression de l'époque">
                    <Trophy size={16} className="stat-trophy-icon" />
                    <span>{completedStages.filter((id) => currentStages.some((s) => s.id === id)).length} / {currentStages.length}</span>
                  </div>
                </div>
              </div>

              <div className="epochs-scroll">
                {BIBLE_EPOCHS.map((epoch, epochIndex) => {
                  const epochOpen = isEpochUnlocked(epoch.id, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
                  const previousEpoch = epochIndex > 0 ? BIBLE_EPOCHS[epochIndex - 1] : null;
                  return (
                  <button
                    key={epoch.id}
                    className={`epoch-card ${selectedEpochId === epoch.id ? "active" : ""} ${epochOpen ? "" : "locked"}`}
                    aria-disabled={!epochOpen}
                    onClick={() => {
                      if (!epochOpen) {
                        notify(previousEpoch
                          ? `Achève « ${previousEpoch.nom} » pour ouvrir ${epoch.nom}.`
                          : "Ce monde n'est pas encore ouvert.");
                        return;
                      }
                      setSelectedEpochId(epoch.id);
                      const stages = EPOCH_STAGES[epoch.id] || EPOCH_STAGES.racines;
                      const nextStage = firstOpenStage(stages, completedStages);
                      if (nextStage) setActiveStageId(nextStage.id);
                      resetStageExercise();
                      notify(`Sentier : ${epoch.nom} ✨`);
                    }}
                  >
                    <div className="epoch-icon">{epochOpen ? epoch.icon : "🔒"}</div>
                    <div className="epoch-name">{epoch.nom}</div>
                    <div className="epoch-books">{epochOpen ? epoch.livres : "Se débloque ensuite"}</div>
                  </button>
                  );
                })}
              </div>
            </div>

            {/* BARRE DE PROGRESSION DU MONDE */}
            <div className="journey-summary">
              <div className="summary-book"><Trophy size={22} /></div>
              <div>
                <b>{activeEpoch.nom}</b>
                <small>
                  {completedStages.filter((id) => currentStages.some((s) => s.id === id)).length} sur {currentStages.length} quêtes accomplies
                </small>
              </div>
              <div className="summary-progress">
                <div className="progress-track">
                  <i style={{ width: `${(completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100}%` }} />
                </div>
                <small>
                  {Math.round((completedStages.filter((id) => currentStages.some((s) => s.id === id)).length / currentStages.length) * 100)}% de maîtrise
                </small>
              </div>
            </div>

            {/* COFFRES DE RÉCOMPENSE D'ÉPOQUE V2.0 */}
            <div className="v2-chests-row">
              {getEpochChests(selectedEpochId, currentStages, completedStages, saved.unlockedChests || []).map((chest) => (
                <div key={chest.id} className={`card v2-chest-card ${chest.claimed ? "claimed" : chest.ready ? "ready" : ""}`}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Gift size={20} />
                    <div>
                      <strong>{chest.titre}</strong>
                      <div className="muted" style={{ fontSize: 12 }}>
                        {chest.completed} / {chest.required} étapes · +{chest.reward.xp} XP · +{chest.reward.pearls} 💎
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn small ${chest.ready && !chest.claimed ? "primary" : "secondary"}`}
                    disabled={!chest.ready || chest.claimed}
                    onClick={() => handleClaimEpochChest(chest)}
                  >
                    {chest.claimed ? "✅ Ouvert" : chest.ready ? "🎁 Ouvrir" : "🔒 Verrouillé"}
                  </button>
                </div>
              ))}
            </div>

            {/* INDICATION DE GLISSEMENT TACTILE ET SOURIS */}
            <div className="path-drag-indicator">
              <span className="drag-hand">👆</span>
              <span>Les étapes s'ouvrent une par une, dans l'ordre du récit.</span>
              <span className="drag-arrow">➔</span>
            </div>

            {/* VIEWPORT GLISSANT AU DOIGT ET À LA SOURIS (LARGEUR AÉRÉE SANS CONDENSATION) */}
            <div className="path-scroll-viewport" ref={pathViewportRef}>
              <div className="path-landscape">
                <div className="landscape-glow" />
                <div className="path-cloud cloud-a" />
                <div className="path-cloud cloud-b" />

                <ol className="path-trail">
                {currentStages.map((node, nodeIndex) => {
                  const isDone = completedStages.includes(node.id);
                  const unlocked = isStagePlayable(node.id, selectedEpochId, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
                  const isCurrent = frontierStage?.id === node.id && !isDone;

                  return (
                    <li key={node.id}>
                    <button
                      type="button"
                      className={`path-node ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${unlocked ? "" : "locked"} ${node.subtile ? "subtile-node" : ""}`}
                      onClick={() => {
                        if (!unlocked) {
                          notify("Franchis l'étape précédente pour ouvrir celle-ci.");
                          return;
                        }
                        startStage(node.id);
                      }}
                      aria-label={unlocked ? node.titre : `${node.titre}, verrouillée`}
                      aria-disabled={!unlocked}
                    >
                      <span className="node-circle">
                        {isDone ? <Check size={20} /> : unlocked ? <span>{nodeIndex + 1}</span> : <LockKeyhole size={16} />}
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
                        {isCurrent && <em>Prochaine étape</em>}
                        {!unlocked && <em className="node-lock-note">Verrouillée</em>}
                      </span>
                    </button>
                    </li>
                  );
                })}
                </ol>

                <div className="path-caption">
                  <Sparkles size={16} />
                  <span>La Parole éclaire notre route, pas après pas.</span>
                </div>
              </div>
            </div>

            {/* PANNEAU DE QUÊTE ÉPURÉ (ORIENTATION JEU VIDÉO & AVENTURE) */}
            <div className="below-path">
              <div className="game-quest-panel">
                <div className="quest-panel-header">
                  <div className="quest-badge-tag">
                    <Flame size={15} /> QUÊTE ACTUELLE · ÉTAPE {Math.max(1, currentStages.findIndex((stage) => stage.id === frontierStage?.id) + 1)}
                  </div>
                  <div className="quest-rewards-badge">
                    <span className="reward-item">+{frontierStage?.recompense?.xp || 25} XP</span>
                    <span className="reward-item">💎 +{frontierStage?.recompense?.perles || 1}</span>
                  </div>
                </div>

                <div className="quest-panel-body">
                  <h3 className="quest-stage-title">{frontierStage?.titre}</h3>
                  <div className="quest-meta-chips">
                    <span className="quest-chip ref-chip">📖 {frontierStage?.ref}</span>
                    <span className={`diff-pill diff-${frontierStage?.difficulte || "debutant"}`}>
                      {frontierStage?.difficulte === "expert" ? "Expert" : frontierStage?.difficulte === "avance" ? "Avancé" : frontierStage?.difficulte === "intermediaire" ? "Intermédiaire" : "Initié"}
                    </span>
                    {frontierStage?.tempsLimite && <span className="diff-pill chrono">⏱️ {frontierStage.tempsLimite}s</span>}
                    {frontierStage?.coutVie && <span className="diff-pill cout-vie">🪔 Défi de foi</span>}
                  </div>
                </div>

                <button className="quest-launch-button" onClick={() => startStage(frontierStage?.id)}>
                  <span>⚔️ Relever le Défi</span>
                  <ChevronRight size={18} />
                </button>
              </div>

              <div className="treasure-card game-treasure-card">
                <span className="treasure-chest">💎</span>
                <div>
                  <b>Coffre aux Trésors</b>
                  <p>{pearls} perles spirituelles collectées</p>
                </div>
                <Sparkles size={18} />
              </div>
            </div>

            {/* DÉFIS BONUS DE L'ÉPOQUE (IDs 73–81 : Paires, Vrai/Faux, Qui a dit ?) */}
            {(() => {
              const epochBonuses = BONUS_STAGES.filter((b) => b.epoch === selectedEpochId);
              if (epochBonuses.length === 0) return null;
              return (
                <div className="bonus-stages-section">
                  <div className="section-heading">
                    <div>
                      <span className="eyebrow">ATELIERS D'ÉLÉVATION</span>
                      <h2>🌟 Défis Bonus de l'Époque</h2>
                    </div>
                    <small style={{ color: "var(--muted)" }}>
                      Débloqués une fois toutes les étapes de « {activeEpoch.nom} » accomplies
                    </small>
                  </div>
                  <div className="bonus-stages-grid">
                    {epochBonuses.map((bonus) => {
                      const isDone = completedStages.includes(bonus.id);
                      const unlocked = isBonusPlayable(bonus, BIBLE_EPOCHS, EPOCH_STAGES, completedStages);
                      const formatLabel =
                        bonus.type === "pairs" ? "🔗 Paires"
                          : bonus.type === "truefalse" ? "⚖️ Vrai / Faux"
                            : "🗣️ Qui a dit ?";

                      return (
                        <button
                          key={bonus.id}
                          type="button"
                          className={`bonus-stage-card ${isDone ? "done" : ""} ${unlocked ? "unlocked" : "locked"}`}
                          onClick={() => startStage(bonus.id)}
                          aria-disabled={!unlocked}
                        >
                          <div className="bonus-card-top">
                            <span className="bonus-format-pill">{formatLabel}</span>
                            <span className="bonus-reward-pill">
                              +{bonus.recompense?.xp || 35} XP · +{bonus.recompense?.perles || 2} 💎
                            </span>
                          </div>
                          <strong className="bonus-card-title">{bonus.titre}</strong>
                          <small className="bonus-card-ref">📖 {bonus.ref}</small>
                          <div className="bonus-card-status">
                            {isDone ? (
                              <span className="status-done"><Check size={14} /> Accompli · Rejouer</span>
                            ) : unlocked ? (
                              <span className="status-open">✨ Défi ouvert · Lancer</span>
                            ) : (
                              <span className="status-locked"><LockKeyhole size={14} /> Achève l'époque pour débloquer</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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

                {/* FORMAT 4 : PAIRES BIBLIQUES */}
                {currentStage.type === "pairs" && (
                  <div className="pairs-container">
                    <div className="pairs-header-status">
                      <span>🕊️ Relie chaque élément de gauche à sa correspondance à droite</span>
                      <span className="pairs-counter">
                        {pairsMatched.length} / {(currentStage.pairs || []).length} relié(s)
                      </span>
                    </div>

                    <div className="pairs-columns-grid">
                      {/* Colonne Gauche */}
                      <div className="pairs-col">
                        {(currentStage.pairs || []).map((p, idx) => {
                          const isMatched = pairsMatched.includes(idx);
                          const isSelected = pairsSelected.some((s) => s.origIndex === idx && s.side === "left");
                          return (
                            <button
                              key={`left-${idx}`}
                              type="button"
                              className={`pair-card left-card ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""}`}
                              disabled={isMatched || !!exerciseFeedback}
                              onClick={() => handlePairCardClick(idx, "left")}
                            >
                              <span className="pair-bullet">{isMatched ? "✓" : idx + 1}</span>
                              <span className="pair-text">{p.left}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Colonne Droite (mélangée aléatoirement) */}
                      <div className="pairs-col">
                        {shuffledPairsRight.map((item, rIdx) => {
                          const isMatched = pairsMatched.includes(item.origIndex);
                          const isSelected = pairsSelected.some((s) => s.origIndex === item.origIndex && s.side === "right");
                          return (
                            <button
                              key={`right-${rIdx}`}
                              type="button"
                              className={`pair-card right-card ${isMatched ? "matched" : ""} ${isSelected ? "selected" : ""}`}
                              disabled={isMatched || !!exerciseFeedback}
                              onClick={() => handlePairCardClick(item.origIndex, "right")}
                            >
                              <span className="pair-bullet">{isMatched ? "✓" : String.fromCharCode(65 + rIdx)}</span>
                              <span className="pair-text">{item.text}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* FORMAT 5 : VRAI / FAUX CHRONO */}
                {currentStage.type === "truefalse" && (
                  <div className="tf-container">
                    <div className="tf-statement-card">
                      <span className="tf-badge">DÉFI VRAI OU FAUX</span>
                      <p className="tf-text">« {currentStage.consigne} »</p>
                    </div>

                    <div className="tf-buttons-row">
                      <button
                        type="button"
                        className={`tf-button tf-true ${tfAnswer === true ? "active" : ""}`}
                        disabled={!!exerciseFeedback}
                        onClick={() => {
                          setTfAnswer(true);
                          triggerHaptic(20);
                        }}
                      >
                        <span className="tf-icon">✅</span>
                        <span className="tf-label">VRAI</span>
                      </button>

                      <button
                        type="button"
                        className={`tf-button tf-false ${tfAnswer === false ? "active" : ""}`}
                        disabled={!!exerciseFeedback}
                        onClick={() => {
                          setTfAnswer(false);
                          triggerHaptic(20);
                        }}
                      >
                        <span className="tf-icon">❌</span>
                        <span className="tf-label">FAUX</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* FORMAT 6 : QUI A DIT ? */}
                {currentStage.type === "whosaid" && (
                  <div className="whosaid-container">
                    <div className="whosaid-quote-card">
                      <span className="quote-ornament">“</span>
                      <p className="whosaid-quote-text">{currentStage.quote}</p>
                      <span className="whosaid-instruction">Qui a prononcé cette parole dans les Saintes Écritures ?</span>
                    </div>

                    <div className="whosaid-speakers-grid">
                      {(shuffledWhosaidSpeakers.length > 0 ? shuffledWhosaidSpeakers : (currentStage.speakers || [])).map((sp, idx) => {
                        const spName = typeof sp === "string" ? sp : sp.nom;
                        const spRole = typeof sp === "string" ? "Personnage biblique" : (sp.role || "Personnage biblique");
                        const spAvatar = typeof sp === "string" ? "📜" : (sp.avatar || "👤");
                        const isSelected = whosaidSelected === spName;
                        return (
                          <button
                            key={idx}
                            type="button"
                            className={`whosaid-speaker-card ${isSelected ? "selected" : ""}`}
                            disabled={!!exerciseFeedback}
                            onClick={() => {
                              setWhosaidSelected(spName);
                              triggerHaptic(20);
                            }}
                          >
                            <span className="speaker-avatar">{spAvatar}</span>
                            <div className="speaker-info">
                              <span className="speaker-name">{spName}</span>
                              <span className="speaker-role">{spRole}</span>
                            </div>
                            {isSelected && <span className="speaker-check">✦</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
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
                                « {currentStage.motsCorrects ? currentStage.motsCorrects.join(" ") : (currentStage.quote || (currentStage.phraseAvant ? `${currentStage.phraseAvant}${currentStage.motCorrect}${currentStage.phraseApres}` : currentStage.titre))} »
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

        {/* 3B. ONGLET JEUX BIBLIQUES V2.0 */}
        {tab === "Jeux" && (
          <section className="page">
            <GamesHubView
              pelerinName={profileName}
              pedagogicalProfile={saved.pedagogicalProfile || "explorateur"}
              dailyChallengeHistory={saved.dailyChallengeHistory || {}}
              gameStats={saved.gameStats || {}}
              onReward={handleV2GameReward}
              onDailyCompleted={handleDailyChallengeCompleted}
              onAnchorVerse={handleAnchorVerse}
              onOpenArena={() => setShowInfiniteArena(true)}
              onOpen66Books={() => setShowBible66Modal(true)}
              onToast={notify}
            />
          </section>
        )}

        {/* 4. ONGLET BIBLE & CARNET SPIRITUEL */}
        {tab === "Bible" && (
          <section className="page">
            <div className="page-intro with-action">
              <div>
                <span className="eyebrow"><BookOpen size={14} /> LA PAROLE EN TOUT TEMPS</span>
                <h1>Extraits de la Bible</h1>
                <p>28 passages clés intégraux de la Louis Segond 1910 (dont 10 nouveaux chapitres V2.0) répartis sur 16 livres, avec introductions et parcours thématiques.</p>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowBible66Modal(true)}
                title="Explorer les fiches et quiz de tous les 66 livres de la Bible"
              >
                <BookOpen size={16} />
                <span>📚 Trésor des 66 Livres ({masteredBooks.length}/66)</span>
              </button>
            </div>

            <div className="bible-layout">
              <div className="bible-reader">
                <div className="reader-top">
                  {(() => {
                    const rawPrefix = selectedChapterKey.split("-")[0];
                    const activePrefix = rawPrefix === "1jn" ? "1je" : rawPrefix;
                    const resolvedBookId = BOOK_CHAPTERS_MAP[activePrefix] ? activePrefix : (BOOK_CHAPTERS_MAP[selectedBookId] ? selectedBookId : "gen");
                    const availableBooks = BIBLE_BOOKS.filter((b) => Boolean(BOOK_CHAPTERS_MAP[b.id]));
                    const availableChapterKeys = BOOK_CHAPTERS_MAP[resolvedBookId] || ["gen-1"];

                    return (
                      <>
                        <select
                          value={resolvedBookId}
                          onChange={(e) => {
                            const book = e.target.value;
                            setSelectedBookId(book);
                            const chList = BOOK_CHAPTERS_MAP[book] || ["gen-1"];
                            setSelectedChapterKey(chList[0]);
                            setBibleChaptersReadCount((c) => c + 1);
                            contributeCollectiveChallenge("col-read-jean", 1);
                            stopSpeech();
                            setAudioPlaying(false);
                          }}
                          aria-label="Livre biblique"
                        >
                          {availableBooks.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.nom} ({b.testament})
                            </option>
                          ))}
                        </select>

                        <select
                          value={selectedChapterKey}
                          onChange={(e) => {
                            setSelectedChapterKey(e.target.value);
                            setBibleChaptersReadCount((c) => c + 1);
                            contributeCollectiveChallenge("col-read-jean", 1);
                            stopSpeech();
                            setAudioPlaying(false);
                          }}
                          aria-label="Chapitre biblique"
                        >
                          {availableChapterKeys.map((chKey) => {
                            const chData = ALL_BIBLE_CHAPTERS[chKey];
                            if (!chData) return null;
                            return (
                              <option key={chKey} value={chKey}>
                                Chapitre {chData.chapitre} · {chData.titre}
                              </option>
                            );
                          })}
                        </select>
                      </>
                    );
                  })()}

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
            <BibleStudyEnhancements
              activeChapterKey={selectedChapterKey}
              allChapters={ALL_BIBLE_CHAPTERS}
              onSelectChapter={(chKey) => {
                setSelectedChapterKey(chKey);
                const prefix = chKey.split("-")[0];
                setSelectedBookId(prefix === "1jn" ? "1je" : prefix);
                setBibleChaptersReadCount((c) => c + 1);
                stopSpeech();
                setAudioPlaying(false);
              }}
              onToast={notify}
            />
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

            <CommunityGroupsV2
              pelerinName={profileName}
              uid={user?.uid}
              xp={xp}
              memorizedCount={memorizationStats.discoveredCount}
              gamesPlayed={Object.values(saved.gameStats || {}).reduce((s, n) => s + (Number(n) || 0), 0)}
              churchGroup={churchGroupState}
              leaderboard={leaderboard}
              onGroupUpdated={(g) => setChurchGroupState(g)}
              onToast={notify}
            />

            <ChurchGroupCard />

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

                {loadBlessingsConfig().cards.map((blessing, idx) => {
                  const formatted = {
                    titre: blessing.titre || blessing.theme || "Bénédiction",
                    verset: blessing.verset || blessing.texte,
                    ref: blessing.ref,
                    message: blessing.message || blessing.theme || ""
                  };
                  return (
                  <div key={blessing.id || idx} className="blessing-card">
                    <span className="pill">BÉNÉDICTION</span>
                    <h3 style={{ margin: "10px 0 6px", fontSize: "16px" }}>{formatted.titre}</h3>
                    <blockquote>« {formatted.verset} »</blockquote>
                    <small style={{ display: "block", color: "var(--muted)", marginBottom: "14px" }}>
                      {formatted.ref}
                    </small>
                    <button
                      className="primary-button full"
                      onClick={() => handleShareBlessing(formatted)}
                    >
                      <Share2 size={16} /> Envoyer à un frère ou une sœur
                    </button>
                  </div>
                  );
                })}
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
                  Comment souhaites-tu être appelé·e ? (Nom unique garanti sans doublon)
                </label>
                <div className="profile-pseudo-row" style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px", marginBottom: "6px" }}>
                  <input
                    id="pelerin-name"
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value.slice(0, 30));
                      setPseudoError("");
                      setPseudoSuccess("");
                    }}
                    maxLength={30}
                    placeholder="Ton prénom ou pseudo unique"
                    style={{ flex: "1 1 160px", minWidth: 0 }}
                  />
                  <button
                    type="button"
                    className="secondary-button"
                    style={{ padding: "8px 12px", fontSize: "12px", whiteSpace: "nowrap" }}
                    onClick={handleSaveProfileName}
                    disabled={isSavingPseudo}
                    title="Vérifier et réserver ce nom unique dans la base de données commune"
                  >
                    {isSavingPseudo ? <RefreshCw size={13} className="spin-icon" /> : <ShieldCheck size={13} />}
                    <span>Valider l'unicité</span>
                  </button>
                </div>
                {pseudoError && (
                  <p style={{ color: "#dc2626", fontSize: "12px", margin: "4px 0 10px", fontWeight: 600 }}>
                    ⚠️ {pseudoError}
                  </p>
                )}
                {pseudoSuccess && (
                  <p style={{ color: "#16a34a", fontSize: "12px", margin: "4px 0 10px", fontWeight: 600 }}>
                    {pseudoSuccess}
                  </p>
                )}

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

                <div className="profile-metrics profile-metrics-4">
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

            <PedagogicalAndAccessibilityCard
              pedagogicalProfile={saved.pedagogicalProfile || "explorateur"}
              onChangePedagogicalProfile={(profId) => {
                setSaved((prev) => ({ ...prev, pedagogicalProfile: profId }));
                notify(`🎓 Profil pédagogique activé : ${profId}`);
              }}
              accessibilityPrefs={accessibilityPrefs}
              onUpdateAccessibility={(nextPrefs) => {
                const savedPrefs = saveAccessibilityPrefs(nextPrefs);
                setAccessibilityPrefs(savedPrefs);
                applyAccessibilityToDocument(savedPrefs);
                notify("♿ Préférences d'accessibilité mises à jour ✨");
              }}
              xp={xp}
              stagesCount={completedStages.length}
              memorizedCount={memorizationStats.masteredCount}
              collectionStats={collectionStats}
              onOpenNotifications={() => setNotifCenterOpen(true)}
            />

            {/* CARTE OFFICIELLE DE PROPRIÉTÉ DANS L'ONGLET PROFIL */}
            <div className="church-ownership-profile-card">
              <div className="church-profile-badge">✝</div>
              <div className="church-profile-content">
                <span className="church-profile-eyebrow">PATERNITÉ & PROPRIÉTÉ SPIRITUELLE</span>
                <h3>Église Évangélique Assemblée de la Grâce</h3>
                <p className="church-profile-location">Sise à Issia · Côte d'Ivoire 🇨🇮</p>
                <p className="church-profile-description">
                  Ce jeu est la propriété exclusive de l'<b>Église Évangélique Assemblée de la Grâce</b>, sise à <b>Issia (Côte d'Ivoire)</b>. Conçu pour encourager la jeunesse, les croyants et les familles dans la lecture, la méditation, la mémorisation et l'amour de la Sainte Bible. Que toute la gloire soit rendue à notre Seigneur Jésus-Christ !
                </p>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          <span>✦ Le Grand Pèlerinage de la Bible · Propriété de l'Église Évangélique Assemblée de la Grâce (Issia, Côte d'Ivoire)</span>
          <span>Basé sur la version Louis Segond 1910 · Un voyage vivant au cœur de la Parole.</span>
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
                <small>Accomplis des étapes sur le Sentier ou ancre un verset depuis la Bible.</small>
              </div>
            ) : leitnerDueCards.length === 0 ? (
              <div className="leitner-empty-state">
                <p>Tes versets prennent racine.</p>
                <small>Aucune carte n'est échue aujourd'hui. Reviens à la prochaine échéance.</small>
              </div>
            ) : (
              <div className="leitner-review-content">
                {leitnerReviewIndex < leitnerDueCards.length ? (
                  (() => {
                    const card = leitnerDueCards[leitnerReviewIndex];
                    const boxInfo = LEITNER_BOXES.find((b) => b.level === (card.box || 1)) || LEITNER_BOXES[0];
                    return (
                      <div className="leitner-card-view">
                        <div className="leitner-card-progress">
                          <span>Verset {leitnerReviewIndex + 1} sur {leitnerDueCards.length}</span>
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

      {/* MODAL DE CARTE DE BÉNÉDICTION WHATSAPP */}
      <BlessingShareModal
        isOpen={blessingModalOpen}
        onClose={() => setBlessingModalOpen(false)}
        profileName={profileName}
        leagueName={getCurrentLeague(xp).league.nom}
        notify={notify}
      />

      {/* MODAL ARÈNE DE LA FOI (DÉFI INFINI) */}
      <InfiniteArenaModal
        isOpen={showInfiniteArena}
        onClose={() => setShowInfiniteArena(false)}
        onAddRewards={handleArenaRewards}
        playSuccessSound={playPairSuccessChime}
        playErrorSound={playErrorGentleTone}
        playChime={playDivineChime}
      />

      {/* MODAL ENCYCLOPÉDIE & DÉFI DES 66 LIVRES DE LA BIBLE */}
      <Bible66BooksModal
        isOpen={showBible66Modal}
        onClose={() => setShowBible66Modal(false)}
        masteredBooks={masteredBooks}
        onMasterBook={handleMasterBook}
        playSuccessSound={playDivineChime}
        playErrorSound={playErrorGentleTone}
      />

      {/* MODAL BOUTIQUE DE GRÂCE (LAMPES & PERLES) */}
      {graceShopModalOpen && (
        <div className="modal-backdrop" onClick={() => setGraceShopModalOpen(false)}>
          <div className="modal-card grace-shop-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "24px" }}>🪔</span>
                <div>
                  <h3 style={{ margin: 0 }}>Boutique de Grâce</h3>
                  <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
                    Restaure tes lampes de foi et cultive la paix
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="icon-button close-button"
                onClick={() => setGraceShopModalOpen(false)}
                aria-label="Fermer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grace-shop-body">
              <div className="shop-balance-banner">
                <div className="shop-balance-item">
                  <span className="balance-icon">🪔</span>
                  <div>
                    <small>Lampes de foi</small>
                    <b>{lampes} / 5 allumées</b>
                  </div>
                </div>
                <div className="shop-balance-item">
                  <span className="balance-icon">💎</span>
                  <div>
                    <small>Perles de vie</small>
                    <b>{pearls} perles</b>
                  </div>
                </div>
              </div>

              <div className="shop-offers-list">
                <div className="shop-offer-card">
                  <div className="offer-icon">🕯️</div>
                  <div className="offer-details">
                    <h4>Rallumer 1 Lampe de Foi</h4>
                    <p>Donne une nouvelle clarté pour continuer tes défis bibliques.</p>
                  </div>
                  <button
                    type="button"
                    className="primary-button shop-buy-btn"
                    disabled={pearls < 15 || lampes >= 5}
                    onClick={() => {
                      if (pearls < 15 || lampes >= 5) return;
                      setSaved((prev) => ({ ...prev, pearls: (prev.pearls || 0) - 15 }));
                      setLampes((prev) => Math.min(5, prev + 1));
                      playLampRestoreSound();
                      triggerHaptic([20, 50, 20]);
                      notify("Gloire à Dieu ! Une lampe de foi a été rallumée 🪔✨");
                    }}
                  >
                    {lampes >= 5 ? "Plein (5/5)" : "15 Perles"}
                  </button>
                </div>

                <div className="shop-offer-card">
                  <div className="offer-icon">🪔</div>
                  <div className="offer-details">
                    <h4>Restauration Complète (5 Lampes)</h4>
                    <p>Fais le plein de lumière divine pour tes marches spirituelles.</p>
                  </div>
                  <button
                    type="button"
                    className="primary-button shop-buy-btn"
                    disabled={pearls < 50 || lampes >= 5}
                    onClick={() => {
                      if (pearls < 50 || lampes >= 5) return;
                      setSaved((prev) => ({ ...prev, pearls: (prev.pearls || 0) - 50 }));
                      setLampes(5);
                      playLampRestoreSound();
                      triggerHaptic([30, 60, 30]);
                      notify("Merveilleux ! Tes 5 lampes de foi brillent à nouveau 🪔🕊️");
                    }}
                  >
                    {lampes >= 5 ? "Plein (5/5)" : "50 Perles"}
                  </button>
                </div>

                <div className="shop-offer-card">
                  <div className="offer-icon">🕊️</div>
                  <div className="offer-details">
                    <h4>Halte au Puits de Jacob (Gratuit)</h4>
                    <p>Médite la parole vivante de Jésus pour renouveler tes forces sans perles.</p>
                  </div>
                  <button
                    type="button"
                    className="secondary-button shop-buy-btn"
                    onClick={() => {
                      setGraceShopModalOpen(false);
                      setSpiritualHaltModal(true);
                    }}
                  >
                    Méditer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <MemorizationHubModal
        open={memorizationHubOpen}
        onClose={() => setMemorizationHubOpen(false)}
        memorizationCards={saved.memorizationCards || {}}
        leitnerCards={saved.leitnerCards || {}}
        onUpdateMemorizationCard={handleUpdateMemorizationCard}
        onReward={({ xp: gXp = 0, pearls: gPearls = 0 }) => handleV2GameReward({ gameId: "memorization", xp: gXp, pearls: gPearls, stars: 3 })}
        onToast={notify}
      />

      <NotificationCenterModal
        open={notifCenterOpen}
        onClose={() => setNotifCenterOpen(false)}
        inbox={notifInbox}
        prefs={notifPrefs}
        uid={user?.uid}
        onUpdatePrefs={(next) => {
          const clean = saveNotificationPrefs(next);
          setNotifPrefs(clean);
        }}
        onMarkRead={(id) => {
          setNotifInbox((prev) => {
            const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
            saveLocalNotificationInbox(next);
            const target = next.find((n) => n.id === id);
            if (target && user && !user.isAnonymous) syncNotificationToFirestore(user.uid, target);
            return next;
          });
        }}
        onMarkAllRead={() => {
          setNotifInbox((prev) => {
            const next = prev.map((n) => ({ ...n, read: true }));
            saveLocalNotificationInbox(next);
            return next;
          });
        }}
        onArchive={(id) => {
          setNotifInbox((prev) => {
            const next = prev.map((n) => (n.id === id ? { ...n, archived: true, read: true } : n));
            saveLocalNotificationInbox(next);
            const target = next.find((n) => n.id === id);
            if (target && user && !user.isAnonymous) syncNotificationToFirestore(user.uid, target);
            return next;
          });
        }}
        onOpenTarget={(n) => {
          if (n.targetAction === "open_memorization") {
            setMemorizationHubOpen(true);
          } else if (n.targetTab) {
            setTab(n.targetTab);
          }
        }}
        onToast={notify}
      />

      {systemFlags.maintenanceMode && (
        <div className="toast" style={{ bottom: 16, background: "#92400e", color: "#fff" }}>
          <span>🚧 {systemFlags.maintenanceMessage}</span>
        </div>
      )}

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
