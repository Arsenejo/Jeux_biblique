import React, { useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import {
  BookOpen, Compass, Home, UserRound, Flame, Gem, Trophy, Star, LockKeyhole,
  Check, ChevronRight, Sparkles, Volume2, VolumeX, Heart, Share2, RotateCcw,
  Lightbulb, Users, Leaf, MapPinned, BookMarked, Send, MessageCircleHeart,
  Award, ShieldCheck, Smile
} from "lucide-react";

import "./styles.css";
import { ConfettiCanvas } from "./components/ConfettiCanvas";
import {
  initPelerinAuth,
  syncPelerinProfile,
  loadPelerinProfile,
  saveCarnetNote,
  getLocalCarnetNotes,
  fetchClassementFraternel
} from "./services/firebase";
import {
  BIBLE_BOOKS,
  BIBLE_CHAPTERS,
  PATH_STAGES,
  FRATERNAL_BLESSINGS
} from "./data/bibleData";
import { playSpeech, stopSpeech, triggerHaptic } from "./services/audioSpeech";

function App() {
  const [tab, setTab] = useState("Accueil");
  const [user, setUser] = useState(null);
  const [firebaseStatus, setFirebaseStatus] = useState("local");
  const [toast, setToast] = useState("");
  const [confettiActive, setConfettiActive] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

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

  // Étape active pour l'atelier
  const [activeStageId, setActiveStageId] = useState(1);
  const [placedWords, setPlacedWords] = useState([]);
  const [selectedQcmIndex, setSelectedQcmIndex] = useState(null);
  const [selectedCloze, setSelectedCloze] = useState("");
  const [exerciseFeedback, setExerciseFeedback] = useState("");

  // Bible et Carnet
  const [selectedBookId, setSelectedBookId] = useState("gen");
  const [selectedChapterKey, setSelectedChapterKey] = useState("gen-1");
  const [reflectionInput, setReflectionInput] = useState("");
  const [carnetNotes, setCarnetNotes] = useState([]);

  // Fraternité & Classement
  const [leaderboard, setLeaderboard] = useState([]);
  const [blessingModal, setBlessingModal] = useState(null);

  const xp = saved.xp || 0;
  const pearls = saved.pearls || 0;
  const streak = saved.streak || 1;
  const completedStages = useMemo(() => saved.completedStages || [1], [saved.completedStages]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  // Enregistrement PWA Service Worker
  useEffect(() => {
    if ("serviceWorker" in navigator && typeof window !== "undefined") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch(() => {});
      });
    }
  }, []);

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
          if (cloudData.saved) setSaved((prev) => ({ ...prev, ...cloudData.saved }));
        }
        const notes = getLocalCarnetNotes(currentUser.uid);
        setCarnetNotes(notes);
      } else {
        const notes = getLocalCarnetNotes("local");
        setCarnetNotes(notes);
      }
    }).then((fn) => { unsubAuth = fn; });

    fetchClassementFraternel().then(setLeaderboard);

    return () => {
      if (unsubAuth) unsubAuth();
      stopSpeech();
    };
  }, []);

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
    triggerHaptic([30]);
  };

  // Logique de validation d'un atelier d'étape
  const currentStage = PATH_STAGES.find((s) => s.id === activeStageId) || PATH_STAGES[0];

  const validateExercise = () => {
    let isSuccess = false;

    if (currentStage.type === "order") {
      if (placedWords.length !== currentStage.motsCorrects.length) {
        setExerciseFeedback("Il reste encore des mots à placer. Prends ton temps 🌿");
        return;
      }
      isSuccess = placedWords.every((word, index) => word === currentStage.motsCorrects[index]);
    } else if (currentStage.type === "qcm") {
      if (selectedQcmIndex === null) {
        setExerciseFeedback("Sélectionne une réponse pour continuer 🌿");
        return;
      }
      isSuccess = currentStage.options[selectedQcmIndex].correct;
    } else if (currentStage.type === "cloze") {
      if (!selectedCloze) {
        setExerciseFeedback("Choisis le mot manquant pour compléter le verset 🌿");
        return;
      }
      isSuccess = selectedCloze === currentStage.motCorrect;
    }

    if (isSuccess) {
      triggerHaptic([20, 60, 20]);
      setConfettiActive(true);
      setExerciseFeedback("Bravo ! Ton cœur accueille la Parole avec joie ✨");

      // Mise à jour de la progression
      const nextCompleted = Array.from(new Set([...completedStages, currentStage.id]));
      setSaved((prev) => ({
        ...prev,
        completedStages: nextCompleted,
        xp: (prev.xp || 0) + (currentStage.recompense?.xp || 20),
        pearls: (prev.pearls || 0) + (currentStage.recompense?.perles || 1)
      }));
    } else {
      triggerHaptic([40, 20]);
      setExerciseFeedback("Presque ! Prends un instant pour relire avec calme 🌿");
    }
  };

  const resetStageExercise = () => {
    setPlacedWords([]);
    setSelectedQcmIndex(null);
    setSelectedCloze("");
    setExerciseFeedback("");
  };

  const startStage = (stageId) => {
    setActiveStageId(stageId);
    resetStageExercise();
    setTab("Exercice");
  };

  const nextStage = () => {
    resetStageExercise();
    if (activeStageId < PATH_STAGES.length) {
      setActiveStageId((id) => id + 1);
    } else {
      setTab("Parcours");
      notify("Toutes les étapes de ce sentier sont accomplies ! Gloire à Dieu 🌟");
    }
  };

  const currentBibleChapter = BIBLE_CHAPTERS[selectedChapterKey] || BIBLE_CHAPTERS["gen-1"];

  const navTabs = [
    { name: "Accueil", icon: Home },
    { name: "Parcours", icon: Compass },
    { name: "Bible", icon: BookOpen },
    { name: "Fraternité", icon: Users },
    { name: "Profil", icon: UserRound }
  ];

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
              <span>Sentier de la Genèse</span>
              <b>{Math.round((completedStages.length / PATH_STAGES.length) * 100)}%</b>
            </div>
            <div className="progress-track">
              <i style={{ width: `${(completedStages.length / PATH_STAGES.length) * 100}%` }} />
            </div>
          </div>
          <div className="sync-status">
            <span className={`status-dot ${firebaseStatus === "cloud" ? "connected" : ""}`} />
            <span>{firebaseStatus === "cloud" ? "Pèlerinage synchronisé" : "Progression sur cet appareil"}</span>
          </div>
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
            <button
              className="icon-button"
              onClick={() => notify("Tu es fidèle dans ta marche. Que la paix soit avec toi !")}
              aria-label="Encouragement du jour"
              title="Pensée spirituelle"
            >
              <Sparkles size={18} />
            </button>

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
                <button className="primary-button" onClick={() => setTab("Parcours")}>
                  Reprendre mon pèlerinage <ChevronRight size={18} />
                </button>
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
                value={`${completedStages.length} / ${PATH_STAGES.length}`}
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
                  <span className="art-label">GENÈSE · ÉTAPE {completedStages.length + 1}</span>
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
                    <span>Avancement du sentier</span>
                    <b>{completedStages.length} / {PATH_STAGES.length} découvertes</b>
                  </div>
                  <div className="progress-track">
                    <i style={{ width: `${(completedStages.length / PATH_STAGES.length) * 100}%` }} />
                  </div>
                  <button className="primary-button full" onClick={() => startStage(completedStages.length + 1 <= PATH_STAGES.length ? completedStages.length + 1 : 1)}>
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

            <div className="gentle-note">
              <Leaf size={20} />
              <span>
                <b>Pas de précipitation, pas de culpabilité.</b> La Parole de Dieu se savoure pas à pas. Prends simplement ce qui réjouit ton cœur aujourd'hui.
              </span>
              <Heart size={18} />
            </div>
          </section>
        )}

        {/* 2. ONGLET PARCOURS / SENTIER */}
        {tab === "Parcours" && (
          <section className="page">
            <div className="page-intro">
              <span className="eyebrow"><MapPinned size={14} /> LE SENTIER DE LA PAROLE</span>
              <h1>Le sentier de la Genèse</h1>
              <p>Chaque jalon est une découverte interactive sans pression. Avance à ton rythme.</p>
            </div>

            <div className="journey-summary">
              <div className="summary-book"><BookOpen size={24} /></div>
              <div>
                <b>Genèse & Commencement</b>
                <small>{completedStages.length} sur {PATH_STAGES.length} étapes vécues · Louis Segond</small>
              </div>
              <div className="summary-progress">
                <div className="progress-track">
                  <i style={{ width: `${(completedStages.length / PATH_STAGES.length) * 100}%` }} />
                </div>
                <small>{Math.round((completedStages.length / PATH_STAGES.length) * 100)}% accompli</small>
              </div>
            </div>

            <div className="path-landscape">
              <div className="landscape-glow" />
              <div className="path-cloud cloud-a" />
              <div className="path-cloud cloud-b" />

              <svg className="winding-path" viewBox="0 0 1000 450" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M 110 390 C 160 340, 180 270, 290 290 S 390 390, 490 320 S 590 220, 640 230 S 740 250, 790 160 S 870 100, 920 50"
                  fill="none"
                  stroke="#fff8dc"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M 110 390 C 160 340, 180 270, 290 290 S 390 390, 490 320 S 590 220, 640 230 S 740 250, 790 160 S 870 100, 920 50"
                  fill="none"
                  stroke="#d6bd79"
                  strokeWidth="4"
                  strokeDasharray="4 12"
                  strokeLinecap="round"
                />
              </svg>

              {PATH_STAGES.map((node) => {
                const isDone = completedStages.includes(node.id);
                const isCurrent = !isDone && node.id === (completedStages[completedStages.length - 1] || 0) + 1;
                const isLocked = !isDone && !isCurrent;

                return (
                  <button
                    key={node.id}
                    className={`path-node ${isDone ? "done" : ""} ${isCurrent ? "current" : ""} ${isLocked ? "locked" : ""}`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={() => {
                      if (isLocked) {
                        notify("Cette étape s'ouvrira en avançant avec joie sur le sentier 🌱");
                        return;
                      }
                      startStage(node.id);
                    }}
                    aria-label={`${node.titre}${isLocked ? ", verrouillée" : ""}`}
                  >
                    <span className="node-circle">
                      {isDone ? <Check size={22} /> : isLocked ? <LockKeyhole size={18} /> : <span>{node.id}</span>}
                    </span>
                    <span className="node-label">
                      <b>{node.titre}</b>
                      <small>{node.ref}</small>
                      {isDone && <span className="node-stars">★ ★ ★</span>}
                      {isCurrent && <em>À découvrir</em>}
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
                  <span className="eyebrow">ÉTAPE EN COURS</span>
                  <h3>{currentStage.titre}</h3>
                  <p>{currentStage.ref} · {currentStage.consigne}</p>
                </div>
                <button className="primary-button" onClick={() => startStage(currentStage.id)}>
                  Jouer <ChevronRight size={17} />
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
                <span className="step-count">Étape {currentStage.id} sur {PATH_STAGES.length}</span>
              </div>
              <div className="exercise-progress">
                <i style={{ width: `${(currentStage.id / PATH_STAGES.length) * 100}%` }} />
              </div>

              <div className="exercise-content">
                <span className="eyebrow">ATELIER DU CŒUR</span>
                <h1>{currentStage.titre}</h1>
                <p>{currentStage.consigne}</p>

                {/* FORMAT 1 : ORDONNANCEMENT (TAP-TO-PLACE) */}
                {currentStage.type === "order" && (
                  <>
                    <div className="word-slots">
                      {currentStage.motsCorrects.map((_, i) => (
                        <button
                          key={i}
                          className={`word-slot ${placedWords[i] ? "filled" : ""}`}
                          onClick={() => {
                            if (!exerciseFeedback) {
                              setPlacedWords((pw) => pw.filter((_, idx) => idx !== i));
                            }
                          }}
                        >
                          {placedWords[i] || <span>{i + 1}</span>}
                        </button>
                      ))}
                    </div>

                    <div className="word-bank">
                      {currentStage.motsBanque.map((word, idx) => (
                        <button
                          key={idx}
                          disabled={placedWords.includes(word) || !!exerciseFeedback}
                          className={`word-tile ${placedWords.includes(word) ? "used" : ""}`}
                          onClick={() => {
                            if (placedWords.includes(word) || exerciseFeedback) return;
                            setPlacedWords([...placedWords, word]);
                          }}
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* FORMAT 2 : QCM ILLUSTRE BIENVEILLANT */}
                {currentStage.type === "qcm" && (
                  <div className="qcm-grid">
                    {currentStage.options.map((opt, idx) => (
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

                {/* FORMAT 3 : TEXTE A TROUS VIVANT */}
                {currentStage.type === "cloze" && (
                  <>
                    <div className="cloze-box">
                      « {currentStage.phraseAvant}
                      <span className="cloze-blank">{selectedCloze || "……"}</span>
                      {currentStage.phraseApres} »
                    </div>

                    <div className="word-bank">
                      {currentStage.options.map((opt) => (
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

                {/* ENCART DE RETOUR PEDAGOGIQUE */}
                {exerciseFeedback && (
                  <div className={`feedback ${exerciseFeedback.startsWith("Bravo") ? "success" : "try-again"}`}>
                    <span className="feedback-icon">{exerciseFeedback.startsWith("Bravo") ? "✨" : "🌿"}</span>
                    <div>
                      <b>{exerciseFeedback}</b>
                      {exerciseFeedback.startsWith("Bravo") && (
                        <p>{currentStage.explication}</p>
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
                      setSelectedBookId(e.target.value);
                      if (e.target.value === "gen") setSelectedChapterKey("gen-1");
                      if (e.target.value === "jea") setSelectedChapterKey("jea-1");
                      if (e.target.value === "psa") setSelectedChapterKey("psa-23");
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
                    {selectedBookId === "gen" && <option value="gen-1">Chapitre 1</option>}
                    {selectedBookId === "jea" && (
                      <>
                        <option value="jea-1">Chapitre 1</option>
                        <option value="jea-3">Chapitre 3</option>
                      </>
                    )}
                    {selectedBookId === "psa" && <option value="psa-23">Psaume 23</option>}
                    {!["gen", "jea", "psa"].includes(selectedBookId) && (
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
                  <h2>{currentBibleChapter.titre}</h2>
                  {currentBibleChapter.versets.map((v) => (
                    <p key={v.num}>
                      <sup>{v.num}</sup>
                      {v.cle ? <mark>{v.texte}</mark> : v.texte}
                    </p>
                  ))}
                  <small>
                    {currentBibleChapter.livre} {currentBibleChapter.chapitre} · Version Louis Segond 1910
                  </small>
                </div>

                <div className="reader-actions">
                  <button
                    className="secondary-button"
                    onClick={() => {
                      const keyVerse = currentBibleChapter.versets.find((v) => v.cle) || currentBibleChapter.versets[0];
                      setReflectionInput(`« ${keyVerse.texte} » (${currentBibleChapter.livre} ${currentBibleChapter.chapitre}:${keyVerse.num})\n\nMa prière : `);
                      notify("Verset préparé dans ton carnet spirituel 🌿");
                    }}
                  >
                    <BookMarked size={16} /> Méditer ce verset
                  </button>

                  <button
                    className="primary-button"
                    onClick={() => {
                      const keyVerse = currentBibleChapter.versets.find((v) => v.cle) || currentBibleChapter.versets[0];
                      handleShareBlessing({
                        verset: keyVerse.texte,
                        ref: `${currentBibleChapter.livre} ${currentBibleChapter.chapitre}:${keyVerse.num}`,
                        message: "Que cette Parole remplisse ta journée de joie !"
                      });
                    }}
                  >
                    <Share2 size={16} /> Partager une bénédiction
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
                            background: "#fff",
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
          </section>
        )}

        {/* 5. ONGLET FRATERNITÉ (COMMUNION & ENCOURAGEMENT MUTUEL) */}
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
                    notify("Encouragement envoyé à l'ensemble du groupe : « Que Dieu vous fortifie ! » 🕊️");
                    triggerHaptic([30]);
                  }}
                >
                  <Send size={16} /> Envoyer un encouragement (1 clic)
                </button>
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
                <div style={{ background: "#fff", border: "1px solid var(--line)", borderRadius: "16px", padding: "16px" }}>
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
                    <blockquote>{blessing.verset}</blockquote>
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

                <div style={{ margin: "12px 0" }}>
                  <span className="pill" style={{ background: "#e8f7ed", color: "#159447" }}>
                    <ShieldCheck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                    {firebaseStatus === "cloud" ? "Voyage synchronisé sur le Cloud" : "Sauvegardé sur cet appareil"}
                  </span>
                </div>

                <div className="profile-metrics">
                  <div>
                    <b>{xp}</b>
                    <small>Points de joie</small>
                  </div>
                  <div>
                    <b>{pearls}</b>
                    <small>Perles de vie</small>
                  </div>
                  <div>
                    <b>{completedStages.length} / {PATH_STAGES.length}</b>
                    <small>Étapes</small>
                  </div>
                </div>

                <button
                  className="secondary-button full"
                  onClick={() => notify("Ton voyage est déjà automatiquement et silencieusement sauvegardé 💚")}
                >
                  Vérifier ma synchronisation
                </button>
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
