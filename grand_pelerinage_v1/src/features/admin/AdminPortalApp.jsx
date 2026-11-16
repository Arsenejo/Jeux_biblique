import React, { useState, useEffect, useCallback } from "react";
import { BIBLE_66_BOOKS } from "../../data/bible66Books.js";
import { checkVapidPushReadiness } from "../../services/notificationsEngine.js";
import { fetchCloudGroupsOverview } from "../../services/churchGroupCloud.js";
import {
  loadAdminSession,
  verifyAdminCredentials,
  logoutAdminSession,
  buildChurchAdminMetrics,
  getPedagogicalDifficultyInsights,
  loadLocalAnnouncements,
  fetchChurchAnnouncements,
  publishChurchAnnouncement,
  deleteChurchAnnouncement,
  loadWeeklySpiritualConfig,
  saveWeeklySpiritualConfig,
  loadChurchCampaigns,
  createChurchCampaign,
  deleteChurchCampaign,
  loadCustomBibleContents,
  addCustomBibleContent,
  deleteCustomBibleContent,
  approveCommunityPrayer,
  deleteCommunityPrayerAdmin,
  loadDynamicBlacklist,
  saveDynamicBlacklist,
  fetchRegisteredPseudos,
  releaseReservedPseudo,
  fetchDefiJeanLeaderboard,
  removeLeaderboardEntry,
  deleteChurchGroupAdmin,
  broadcastGlobalNotification,
  loadAdminTeam,
  upsertAdminMember,
  removeAdminMember,
  loadAdminAuditLogs,
  loadSystemFlags,
  saveSystemFlags,
  loadGamesAdminConfig,
  saveGamesAdminConfig,
  loadBlessingsConfig,
  addAdminBlessingCard,
  deleteAdminBlessingCard,
  resetAdminBlessingCards,
  addAdminBlessingTheme,
  deleteAdminBlessingTheme,
  saveBlessingCardSettings,
  buildFullAdminBackupPayload,
  exportLeaderboardCsv
} from "../../services/adminAnalytics.js";

const ADMIN_TABS = [
  { id: "analytics", label: "📊 Analytique" },
  { id: "announcements", label: "📢 Annonces" },
  { id: "campaigns", label: "🎯 Pilotage & Concours" },
  { id: "games", label: "🎮 Studio des Jeux" },
  { id: "blessings", label: "🕊️ Cartes Bénédiction" },
  { id: "cms", label: "📖 CMS Biblique" },
  { id: "moderation", label: "🕊️ Modération" },
  { id: "users", label: "👥 Joueurs & Classements" },
  { id: "groups", label: "⛪ Groupes" },
  { id: "broadcast", label: "🔔 Notifications" },
  { id: "rbac", label: "🔐 Rôles & Audit" },
  { id: "system", label: "⚙️ Système & Backup" }
];

const ADMIN_GAMES_LIST = [
  { id: "daily", label: "☀️ Le Défi du Jour" },
  { id: "mystery", label: "✨ Le Verset Mystère" },
  { id: "whoami", label: "🕵️ Qui suis-je dans la Bible ?" },
  { id: "chrono", label: "⏳ Chronologie Biblique" },
  { id: "pairs", label: "🔗 Les Paires de la Parole" },
  { id: "treasure", label: "🗝️ L'Énigme du Trésor" },
  { id: "listen", label: "🔊 Écoute et Reconnais" },
  { id: "duel", label: "🤝 Duel Biblique Asynchrone" },
  { id: "characters", label: "🧭 Parcours des Personnages" },
  { id: "arena", label: "⚔️ Arène QCM Infinie" },
  { id: "books66", label: "📚 Défi 66 Livres" }
];

function triggerFileDownload(filename, content, mimeType) {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminPortalApp({
  leaderboard = [],
  prayers = [],
  memorizationStats = {},
  completedStages = [],
  gameStats = {},
  epochStages = {},
  onBackToPublic
}) {
  const [session, setSession] = useState(() => loadAdminSession());
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [activeTab, setActiveTab] = useState("analytics");
  const [statusToast, setStatusToast] = useState("");

  // États des 10 piliers
  const [announcements, setAnnouncements] = useState(() => loadLocalAnnouncements());
  const [annTitle, setAnnTitle] = useState("");
  const [annText, setAnnText] = useState("");
  const [annPinned, setAnnPinned] = useState(false);

  const [weeklyCfg, setWeeklyCfg] = useState(() => loadWeeklySpiritualConfig());
  const [campaigns, setCampaigns] = useState(() => loadChurchCampaigns());
  const [campTitle, setCampTitle] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campBook, setCampBook] = useState("Jean");

  const [cmsItems, setCmsItems] = useState(() => loadCustomBibleContents());
  const [cmsType, setCmsType] = useState("verset");
  const [cmsBook, setCmsBook] = useState("Jean");
  const [cmsRef, setCmsRef] = useState("");
  const [cmsText, setCmsText] = useState("");
  const [cmsQuestion, setCmsQuestion] = useState("");
  const [cmsOpt0, setCmsOpt0] = useState("");
  const [cmsOpt1, setCmsOpt1] = useState("");
  const [cmsOpt2, setCmsOpt2] = useState("");
  const [cmsOpt3, setCmsOpt3] = useState("");
  const [cmsExpl, setCmsExpl] = useState("");

  const [localPrayers, setLocalPrayers] = useState(prayers);
  const [blacklistInput, setBlacklistInput] = useState(() => loadDynamicBlacklist().join(", "));

  const [localLeaderboard, setLocalLeaderboard] = useState(leaderboard);
  const [defiJeanBoard, setDefiJeanBoard] = useState([]);
  const [registeredPseudos, setRegisteredPseudos] = useState([]);
  const [cloudGroups, setCloudGroups] = useState([]);

  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");

  const [adminTeam, setAdminTeam] = useState(() => loadAdminTeam());
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminUid, setNewAdminUid] = useState("");
  const [newAdminRole, setNewAdminRole] = useState("enseignant");
  const [auditLogs, setAuditLogs] = useState(() => loadAdminAuditLogs());

  const [systemFlags, setSystemFlags] = useState(() => loadSystemFlags());

  const [gamesConfig, setGamesConfig] = useState(() => loadGamesAdminConfig());
  const [gameContentType, setGameContentType] = useState("whoami");
  const [gameBook, setGameBook] = useState("Genèse");
  const [gameRef, setGameRef] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [gameAnswer, setGameAnswer] = useState("");
  const [gameAudioText, setGameAudioText] = useState("");
  const [gameCluesText, setGameCluesText] = useState("");
  const [gameOptionsText, setGameOptionsText] = useState("");
  const [gameLinesText, setGameLinesText] = useState("");
  const [gameExpl, setGameExpl] = useState("");

  const [blessingsConfig, setBlessingsConfig] = useState(() => loadBlessingsConfig());
  const [blCardRef, setBlCardRef] = useState("");
  const [blCardTheme, setBlCardTheme] = useState("");
  const [blCardText, setBlCardText] = useState("");
  const [blCardMsg, setBlCardMsg] = useState("");
  const [blThemeNom, setBlThemeNom] = useState("");
  const [blThemeBg1, setBlThemeBg1] = useState("#0f172a");
  const [blThemeBg2, setBlThemeBg2] = useState("#1e1b4b");
  const [blThemeGold, setBlThemeGold] = useState("#f59e0b");
  const [blThemeAccent, setBlThemeAccent] = useState("#fbbf24");

  useEffect(() => {
    setLocalPrayers(prayers);
  }, [prayers]);

  useEffect(() => {
    setLocalLeaderboard(leaderboard);
  }, [leaderboard]);

  const showMsg = (msg) => {
    setStatusToast(msg);
    setAuditLogs(loadAdminAuditLogs());
    window.setTimeout(() => setStatusToast(""), 3500);
  };

  const handleCreateGameContent = async () => {
    const parsedOptions = gameOptionsText.split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean);
    const parsedClues = gameCluesText.split("\n").map((s) => s.trim()).filter(Boolean);
    const nowTag = Date.now();
    const lines = gameLinesText.split("\n").map((l) => l.trim()).filter(Boolean);

    const payload = {
      type: gameContentType,
      livre: gameBook,
      ref: gameRef,
      texte: gameContentType === "verset" ? gameAudioText : "",
      question: gameContentType === "listen" || gameContentType === "qcm" ? gameTitle : "",
      options: parsedOptions,
      correctIndex: 0,
      reponse: gameAnswer,
      indices: parsedClues,
      audioText: gameContentType === "listen" ? gameAudioText : "",
      titre: gameContentType === "chrono" || gameContentType === "pairs" ? gameTitle : "",
      events: gameContentType === "chrono"
        ? lines.map((line, idx) => {
          const [label, eRef] = line.split("|").map((p) => p.trim());
          return { id: `ce-${nowTag}-${idx}`, label, ref: eRef || gameRef };
        })
        : [],
      pairs: gameContentType === "pairs"
        ? lines.map((line, idx) => {
          const [left, right] = line.split("|").map((p) => p.trim());
          return { id: `cp-${nowTag}-${idx}`, left: left || "", right: right || "" };
        }).filter((p) => p.left && p.right)
        : [],
      explication: gameExpl
    };

    const res = await addCustomBibleContent(payload);
    if (!res.ok) {
      showMsg("⚠️ " + res.error);
      return;
    }
    setCmsItems(res.contents);
    setGameRef("");
    setGameTitle("");
    setGameAnswer("");
    setGameAudioText("");
    setGameCluesText("");
    setGameOptionsText("");
    setGameLinesText("");
    setGameExpl("");
    showMsg("✅ Niveau / contenu ajouté au Studio des Jeux !");
  };

  const refreshCloudCollections = useCallback(async () => {
    const [anns, pseudos, jeanLb, grps] = await Promise.all([
      fetchChurchAnnouncements(),
      fetchRegisteredPseudos(),
      fetchDefiJeanLeaderboard(),
      fetchCloudGroupsOverview()
    ]);
    if (Array.isArray(anns)) setAnnouncements(anns);
    if (Array.isArray(pseudos)) setRegisteredPseudos(pseudos);
    if (Array.isArray(jeanLb)) setDefiJeanBoard(jeanLb);
    if (Array.isArray(grps)) setCloudGroups(grps);
    setAuditLogs(loadAdminAuditLogs());
  }, []);

  useEffect(() => {
    if (session) {
      refreshCloudCollections();
    }
  }, [session, refreshCloudCollections]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);
    try {
      const res = await verifyAdminCredentials(emailInput, passwordInput);
      if (!res.ok) {
        setAuthError(res.error);
        return;
      }
      setSession(res.session);
      setPasswordInput("");
      showMsg("✅ Session administrateur ouverte.");
    } finally {
      setLoggingIn(false);
    }
  };

  if (!session) {
    return (
      <div className="admin-login-wrapper">
        <div className="card admin-login-card">
          <div style={{ textAlign: "center", marginBottom: 18 }}>
            <span className="pill">🛡️ ACCÈS RESTREINT · /admin</span>
            <h1 style={{ margin: "10px 0 6px", fontSize: 24 }}>Portail d'Administration</h1>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              Église Évangélique Assemblée de la Grâce · Issia (Côte d'Ivoire)
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 5, fontSize: 13, fontWeight: 700 }}>
              <span>Adresse e-mail administrateur</span>
              <input
                type="email"
                className="v2-text-input"
                autoComplete="username"
                placeholder="ex. responsable@eglise.org"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
              />
            </label>

            <label style={{ display: "grid", gap: 5, fontSize: 13, fontWeight: 700 }}>
              <span>Mot de passe</span>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  className="v2-text-input"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{ flex: 1 }}
                  required
                />
                <button
                  type="button"
                  className="btn secondary small"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </label>

            {authError && (
              <div className="callout danger" style={{ fontSize: 13 }}>
                ⚠️ {authError}
              </div>
            )}

            <button type="submit" className="btn primary" disabled={loggingIn}>
              {loggingIn ? "Vérification en cours..." : "🔐 Ouvrir l'espace d'administration"}
            </button>
          </form>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button
              type="button"
              className="btn secondary small"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.history.pushState({}, "", "/");
                }
                onBackToPublic?.();
              }}
            >
              ← Retour à l'application publique
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = buildChurchAdminMetrics({
    leaderboard: localLeaderboard,
    defiJeanLeaderboard: defiJeanBoard,
    groups: cloudGroups,
    prayers: localPrayers,
    memorizationStats,
    completedStages,
    gameStats
  });
  const difficulty = getPedagogicalDifficultyInsights(completedStages, epochStages);
  const vapidReady = checkVapidPushReadiness();

  return (
    <div className="admin-portal-shell">
      <header className="admin-topbar">
        <div>
          <span className="pill">🛡️ {session.role.toUpperCase()}</span>
          <strong style={{ marginLeft: 8 }}>{session.email}</strong>
          <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>
            {session.cloudConnected ? "☁️ Firestore Connecté" : "💾 Mode Local"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" className="btn secondary small" onClick={refreshCloudCollections}>
            🔄 Actualiser
          </button>
          <button
            type="button"
            className="btn secondary small"
            onClick={() => {
              if (typeof window !== "undefined") window.history.pushState({}, "", "/");
              onBackToPublic?.();
            }}
          >
            🌐 Voir le site (/)
          </button>
          <button
            type="button"
            className="btn secondary small"
            onClick={async () => {
              await logoutAdminSession();
              setSession(null);
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="admin-body-layout">
        <nav className="admin-sidebar" aria-label="Navigation Administration">
          {ADMIN_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`btn small ${activeTab === t.id ? "primary" : "secondary"}`}
              style={{ justifyContent: "flex-start" }}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <main className="admin-main">
          <div className="callout" style={{ marginBottom: 14 }}>
            🔒 <strong>Confidentialité garantie :</strong> les carnets spirituels privés (`/pelerins/uid/carnet`) restent strictement chiffrés/isolés pour chaque fidèle et ne sont jamais accessibles ici.
          </div>

          {activeTab === "analytics" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="v2-kpi-grid">
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.activePilgrims}</div><div className="v2-kpi-label">Pèlerins classés</div></div>
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.defiJeanPlayers}</div><div className="v2-kpi-label">Joueurs Défi Jean</div></div>
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.totalCompletedStages}</div><div className="v2-kpi-label">Étapes validées</div></div>
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.memorizedVerses}</div><div className="v2-kpi-label">Versets maîtrisés</div></div>
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.prayersPublished}</div><div className="v2-kpi-label">Prières publiques</div></div>
                <div className="card v2-kpi-box"><div className="v2-kpi-val">{metrics.reportedPrayersCount}</div><div className="v2-kpi-label">Prières signalées</div></div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>📚 Difficulté & Progression par Époque</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {difficulty.map((d) => (
                    <div key={d.epochId} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "8px 10px", borderRadius: 10, background: "rgba(148,163,184,0.1)" }}>
                      <strong>{d.epochId.toUpperCase()} ({d.done}/{d.total})</strong>
                      <span className="badge">{d.completionPct}% · {d.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "announcements" && (
            <div style={{ display: "grid", gap: 14 }}>
              <form
                className="card"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const res = await publishChurchAnnouncement({
                    titre: annTitle || "Annonce EEAG Issia",
                    texte: annText,
                    auteur: session.email,
                    epingle: annPinned
                  });
                  if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                  setAnnouncements(res.announcements);
                  setAnnTitle("");
                  setAnnText("");
                  setAnnPinned(false);
                  showMsg("📢 Annonce publiée !");
                }}
              >
                <h3 style={{ marginTop: 0 }}>📢 Nouvelle Annonce Officielle</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  <input className="v2-text-input" placeholder="Titre (ex. Veillée de prière vendredi 19h)" value={annTitle} onChange={(e) => setAnnTitle(e.target.value)} />
                  <textarea rows={3} className="v2-textarea" placeholder="Contenu de l'annonce..." value={annText} onChange={(e) => setAnnText(e.target.value)} />
                  <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <input type="checkbox" checked={annPinned} onChange={(e) => setAnnPinned(e.target.checked)} />
                    <span>Épingler en haut de l'Accueil</span>
                  </label>
                  <button type="submit" className="btn primary small">Publier l'annonce</button>
                </div>
              </form>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>Annonces actives ({announcements.length})</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {announcements.map((a) => (
                    <div key={a.id} className="card" style={{ padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <strong>{a.epingle ? "📌 " : ""}{a.titre}</strong>
                        <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>{a.texte}</p>
                      </div>
                      <button
                        type="button"
                        className="btn secondary small"
                        onClick={async () => {
                          const next = await deleteChurchAnnouncement(a.id);
                          setAnnouncements(next);
                          showMsg("🗑️ Annonce supprimée.");
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "campaigns" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>✨ Pilotage Spirituel de la Semaine</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  <input className="v2-text-input" value={weeklyCfg.versetRef} onChange={(e) => setWeeklyCfg({ ...weeklyCfg, versetRef: e.target.value })} placeholder="Référence (ex. Psaume 119:105)" />
                  <textarea rows={2} className="v2-textarea" value={weeklyCfg.versetTexte} onChange={(e) => setWeeklyCfg({ ...weeklyCfg, versetTexte: e.target.value })} placeholder="Texte Louis Segond 1910..." />
                  <input className="v2-text-input" value={weeklyCfg.objectifSemaine} onChange={(e) => setWeeklyCfg({ ...weeklyCfg, objectifSemaine: e.target.value })} placeholder="Objectif spirituel de l'Église cette semaine" />
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const savedCfg = await saveWeeklySpiritualConfig(weeklyCfg);
                      setWeeklyCfg(savedCfg);
                      showMsg("✨ Verset et objectif de la semaine enregistrés !");
                    }}
                  >
                    Enregistrer le pilotage hebdomadaire
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>🏆 Concours & Campagnes d'Église ({campaigns.length})</h3>
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  <input className="v2-text-input" placeholder="Nom du concours (ex. Semaine de la Jeunesse — Jean)" value={campTitle} onChange={(e) => setCampTitle(e.target.value)} />
                  <input className="v2-text-input" placeholder="Description / Récompense" value={campDesc} onChange={(e) => setCampDesc(e.target.value)} />
                  <select className="v2-select" value={campBook} onChange={(e) => setCampBook(e.target.value)}>
                    {BIBLE_66_BOOKS.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
                  </select>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const res = await createChurchCampaign({ titre: campTitle, description: campDesc, livreCible: campBook });
                      if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                      setCampaigns(res.campaigns);
                      setCampTitle("");
                      setCampDesc("");
                      showMsg("🏆 Campagne créée !");
                    }}
                  >
                    Créer la campagne
                  </button>
                </div>
                {campaigns.map((c) => (
                  <div key={c.id} className="card" style={{ padding: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div><strong>{c.titre}</strong> <span className="pill">{c.livreCible}</span><div className="muted" style={{ fontSize: 12 }}>{c.dateDebut} → {c.dateFin}</div></div>
                    <button type="button" className="btn secondary small" onClick={async () => { setCampaigns(await deleteChurchCampaign(c.id)); showMsg("🗑️ Campagne supprimée."); }}>Supprimer</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "cms" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>📖 Éditeur Biblique Dynamique (Louis Segond 1910)</h3>
                <p className="muted" style={{ fontSize: 13 }}>Ajoutez des versets ou questions QCM de prédication sans redéployer le code.</p>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select className="v2-select" value={cmsType} onChange={(e) => setCmsType(e.target.value)}>
                      <option value="verset">Verset à retenir / Verset Mystère</option>
                      <option value="qcm">Question QCM</option>
                    </select>
                    <select className="v2-select" value={cmsBook} onChange={(e) => setCmsBook(e.target.value)}>
                      {BIBLE_66_BOOKS.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
                    </select>
                    <input className="v2-text-input" placeholder="Référence (ex. Romains 8:28)" value={cmsRef} onChange={(e) => setCmsRef(e.target.value)} style={{ flex: 1 }} />
                  </div>
                  {cmsType === "verset" ? (
                    <textarea rows={3} className="v2-textarea" placeholder="Texte exact Louis Segond 1910..." value={cmsText} onChange={(e) => setCmsText(e.target.value)} />
                  ) : (
                    <>
                      <input className="v2-text-input" placeholder="Question biblique..." value={cmsQuestion} onChange={(e) => setCmsQuestion(e.target.value)} />
                      <input className="v2-text-input" placeholder="Option 1 (Bonne réponse)" value={cmsOpt0} onChange={(e) => setCmsOpt0(e.target.value)} />
                      <input className="v2-text-input" placeholder="Option 2" value={cmsOpt1} onChange={(e) => setCmsOpt1(e.target.value)} />
                      <input className="v2-text-input" placeholder="Option 3 (optionnel)" value={cmsOpt2} onChange={(e) => setCmsOpt2(e.target.value)} />
                      <input className="v2-text-input" placeholder="Option 4 (optionnel)" value={cmsOpt3} onChange={(e) => setCmsOpt3(e.target.value)} />
                    </>
                  )}
                  <input className="v2-text-input" placeholder="Explication pastorale / contexte" value={cmsExpl} onChange={(e) => setCmsExpl(e.target.value)} />
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const res = await addCustomBibleContent({
                        type: cmsType,
                        livre: cmsBook,
                        ref: cmsRef,
                        texte: cmsText,
                        question: cmsQuestion,
                        options: [cmsOpt0, cmsOpt1, cmsOpt2, cmsOpt3].filter(Boolean),
                        correctIndex: 0,
                        explication: cmsExpl
                      });
                      if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                      setCmsItems(res.contents);
                      setCmsRef(""); setCmsText(""); setCmsQuestion(""); setCmsOpt0(""); setCmsOpt1(""); setCmsOpt2(""); setCmsOpt3(""); setCmsExpl("");
                      showMsg("✅ Contenu biblique ajouté au catalogue en direct !");
                    }}
                  >
                    Enregistrer le contenu
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>Contenus CMS publiés ({cmsItems.length})</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {cmsItems.map((c) => (
                    <div key={c.id} className="card" style={{ padding: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div>
                        <span className="pill">{c.type.toUpperCase()}</span> <strong>{c.ref}</strong> ({c.livre})
                        <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>{c.texte || c.question}</p>
                      </div>
                      <button type="button" className="btn secondary small" onClick={async () => { setCmsItems(await deleteCustomBibleContent(c.id)); showMsg("🗑️ Supprimé."); }}>Supprimer</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "moderation" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>🛡️ Liste Noire Dynamique (Mur de Prières)</h3>
                <p className="muted" style={{ fontSize: 13 }}>Mots ou expressions bloqués automatiquement avant toute publication (séparés par des virgules).</p>
                <textarea rows={2} className="v2-textarea" value={blacklistInput} onChange={(e) => setBlacklistInput(e.target.value)} />
                <button
                  type="button"
                  className="btn primary small"
                  style={{ marginTop: 8 }}
                  onClick={async () => {
                    const savedList = await saveDynamicBlacklist(blacklistInput);
                    setBlacklistInput(savedList.join(", "));
                    showMsg(`✅ ${savedList.length} mot(s) enregistré(s) dans le filtre.`);
                  }}
                >
                  Mettre à jour la liste noire
                </button>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>🕊️ Mur de Prières ({localPrayers.length})</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {[...localPrayers]
                    .sort((a, b) => (b.signaux || 0) - (a.signaux || 0))
                    .map((p) => (
                      <div key={p.id} className="card" style={{ padding: 10, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ flex: 1, minWidth: "min(100%, 200px)" }}>
                          <strong>{p.auteur}</strong> {p.signaux > 0 && <span className="badge" style={{ background: "#fee2e2", color: "#991b1b" }}>⚠️ {p.signaux} signal(s)</span>}
                          <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>{p.texte}</p>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {p.signaux > 0 && (
                            <button
                              type="button"
                              className="btn secondary small"
                              onClick={async () => {
                                await approveCommunityPrayer(p.id);
                                setLocalPrayers((prev) => prev.map((x) => (x.id === p.id ? { ...x, signaux: 0, masque: false } : x)));
                                showMsg("✅ Prière approuvée.");
                              }}
                            >
                              Approuver
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn secondary small"
                            onClick={async () => {
                              await deleteCommunityPrayerAdmin(p.id);
                              setLocalPrayers((prev) => prev.filter((x) => x.id !== p.id));
                              showMsg("🗑️ Prière supprimée.");
                            }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>🏆 Classement Grand Pèlerinage ({localLeaderboard.length})</h3>
                <div style={{ display: "grid", gap: 6 }}>
                  {localLeaderboard.map((u, idx) => (
                    <div key={u.uid || u.id || idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, padding: "6px 8px", borderRadius: 8, background: "rgba(148,163,184,0.08)" }}>
                      <span><strong>#{idx + 1}</strong> {u.nom || u.pseudo} — {u.xp || 0} XP</span>
                      {u.uid && (
                        <button
                          type="button"
                          className="btn secondary small"
                          onClick={async () => {
                            await removeLeaderboardEntry("classement_pelerins", u.uid);
                            setLocalLeaderboard((prev) => prev.filter((x) => x.uid !== u.uid));
                            showMsg("🗑️ Entrée retirée du classement.");
                          }}
                        >
                          Retirer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>📜 Classement Historique « Défi Jean » ({defiJeanBoard.length})</h3>
                <div style={{ display: "grid", gap: 6 }}>
                  {defiJeanBoard.length === 0 ? <p className="muted">Aucune entrée chargée ou hors-ligne.</p> : defiJeanBoard.map((j) => (
                    <div key={j.id} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "6px 8px" }}>
                      <span><strong>{j.pseudo}</strong> — {j.scoreTotal} pts ({j.etoilesTotal}★)</span>
                      <button type="button" className="btn secondary small" onClick={async () => { await removeLeaderboardEntry("classement_defi_jean", j.id); setDefiJeanBoard((p) => p.filter((x) => x.id !== j.id)); showMsg("🗑️ Retiré."); }}>Retirer</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>🔓 Pseudos Réservés ({registeredPseudos.length})</h3>
                <div style={{ display: "grid", gap: 6 }}>
                  {registeredPseudos.length === 0 ? <p className="muted">Connectez Firebase en ligne pour gérer les pseudos réservés.</p> : registeredPseudos.map((ps) => (
                    <div key={ps.id} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "6px 8px" }}>
                      <span><strong>{ps.pseudoOriginal || ps.id}</strong> (<code>{ps.uid?.slice(0, 8)}...</code>)</span>
                      <button type="button" className="btn secondary small" onClick={async () => { await releaseReservedPseudo(ps.id); setRegisteredPseudos((p) => p.filter((x) => x.id !== ps.id)); showMsg("🔓 Pseudo libéré."); }}>Libérer</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "groups" && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>⛪ Groupes d'Église ({cloudGroups.length})</h3>
              <div style={{ display: "grid", gap: 8 }}>
                {cloudGroups.length === 0 ? <p className="muted">Aucun groupe Cloud trouvé pour le moment.</p> : cloudGroups.map((g) => (
                  <div key={g.id || g.code} className="card" style={{ padding: 12, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <strong>{g.nom}</strong> <span className="pill">Code: {g.code}</span>
                      <div className="muted" style={{ fontSize: 12 }}>{(g.members || []).length} membre(s)</div>
                    </div>
                    <button type="button" className="btn secondary small" onClick={async () => { await deleteChurchGroupAdmin(g.code); setCloudGroups((prev) => prev.filter((x) => x.code !== g.code)); showMsg("🗑️ Groupe supprimé."); }}>Supprimer</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "broadcast" && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>🔔 Diffuser une Notification / Alerte à Toute l'Église</h3>
              <p className="muted" style={{ fontSize: 13 }}>
                Publie immédiatement une alerte officielle visible sur l'Accueil et synchronisée dans `/annonces_eglise`. Statut Push FCM VAPID : {vapidReady.hasVapidKey ? "✅ Configuré" : "⚠️ En attente de VITE_FIREBASE_VAPID_KEY (mode In-App actif)"}.
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                <input className="v2-text-input" placeholder="Titre de l'alerte" value={notifTitle} onChange={(e) => setNotifTitle(e.target.value)} />
                <textarea rows={3} className="v2-textarea" placeholder="Message à diffuser..." value={notifBody} onChange={(e) => setNotifBody(e.target.value)} />
                <button
                  type="button"
                  className="btn primary small"
                  onClick={async () => {
                    const res = await broadcastGlobalNotification({ title: notifTitle, body: notifBody });
                    if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                    setNotifTitle(""); setNotifBody("");
                    showMsg("🔔 Notification globale diffusée !");
                  }}
                >
                  Diffuser à l'Église
                </button>
              </div>
            </div>
          )}

          {activeTab === "rbac" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>🔐 Équipe d'Administration (RBAC)</h3>
                <div style={{ display: "grid", gap: 8, marginBottom: 12 }}>
                  <input className="v2-text-input" placeholder="Nom du responsable" value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} />
                  <input className="v2-text-input" placeholder="E-mail" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} />
                  <input className="v2-text-input" placeholder="UID Firebase (optionnel si connu)" value={newAdminUid} onChange={(e) => setNewAdminUid(e.target.value)} />
                  <select className="v2-select" value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value)}>
                    <option value="enseignant">Enseignant (CMS & Annonces)</option>
                    <option value="moderateur">Modérateur (Prières & Groupes)</option>
                    <option value="super_admin">Super Administrateur</option>
                  </select>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const res = await upsertAdminMember({ uid: newAdminUid || newAdminEmail, email: newAdminEmail, nom: newAdminName, role: newAdminRole });
                      if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                      setAdminTeam(res.team);
                      setNewAdminEmail(""); setNewAdminName(""); setNewAdminUid("");
                      showMsg("✅ Co-administrateur enregistré.");
                    }}
                  >
                    Ajouter / Mettre à jour
                  </button>
                </div>
                <div style={{ display: "grid", gap: 6 }}>
                  {adminTeam.map((m) => (
                    <div key={m.email} style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, padding: "6px 8px" }}>
                      <span><strong>{m.nom}</strong> ({m.email}) · <span className="pill">{m.role}</span></span>
                      {m.role !== "super_admin" && (
                        <button type="button" className="btn secondary small" onClick={async () => { const res = await removeAdminMember(m.email); if (res.ok) setAdminTeam(res.team); }}>Retirer</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>🧾 Journal d'Audit ({auditLogs.length})</h3>
                <div style={{ display: "grid", gap: 6, maxHeight: 260, overflowY: "auto" }}>
                  {auditLogs.map((l) => (
                    <div key={l.id} style={{ fontSize: 12, padding: "6px 8px", borderBottom: "1px solid var(--line)" }}>
                      <strong>{l.action}</strong> — {l.details} <span className="muted">({new Date(l.timestamp).toLocaleString("fr-FR")})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <h3 style={{ marginTop: 0 }}>⚙️ Paramètres Système & Maintenance</h3>
                <div style={{ display: "grid", gap: 10 }}>
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🚧 Mode Bannière d'Information / Maintenance</span>
                    <input type="checkbox" checked={systemFlags.maintenanceMode} onChange={(e) => setSystemFlags({ ...systemFlags, maintenanceMode: e.target.checked })} />
                  </label>
                  <input className="v2-text-input" value={systemFlags.maintenanceMessage} onChange={(e) => setSystemFlags({ ...systemFlags, maintenanceMessage: e.target.value })} />
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🕊️ Autoriser les nouvelles publications sur le Mur de Prières</span>
                    <input type="checkbox" checked={systemFlags.prayersEnabled} onChange={(e) => setSystemFlags({ ...systemFlags, prayersEnabled: e.target.checked })} />
                  </label>
                  <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>🤝 Autoriser les Duels Bibliques</span>
                    <input type="checkbox" checked={systemFlags.duelsEnabled} onChange={(e) => setSystemFlags({ ...systemFlags, duelsEnabled: e.target.checked })} />
                  </label>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const savedF = await saveSystemFlags(systemFlags);
                      setSystemFlags(savedF);
                      showMsg("⚙️ Paramètres système enregistrés !");
                    }}
                  >
                    Appliquer les paramètres
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>💾 Sauvegardes & Exports</h3>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={() => {
                      const backup = buildFullAdminBackupPayload({ leaderboard: localLeaderboard, defiJeanBoard, cloudGroups, prayersCount: localPrayers.length });
                      triggerFileDownload(`eeag-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(backup, null, 2), "application/json");
                      showMsg("💾 Backup JSON téléchargé !");
                    }}
                  >
                    Télécharger Backup Complet (JSON)
                  </button>
                  <button
                    type="button"
                    className="btn secondary small"
                    onClick={() => {
                      const csv = exportLeaderboardCsv(localLeaderboard);
                      triggerFileDownload(`eeag-classement-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
                      showMsg("📊 Export CSV téléchargé !");
                    }}
                  >
                    Exporter Classement (CSV)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "games" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <h3 style={{ margin: 0 }}>🎮 Studio des Jeux — Activation & Réglages</h3>
                  <span className="pill">
                    {Object.values(gamesConfig.enabledGames || {}).filter(Boolean).length}/{ADMIN_GAMES_LIST.length} jeux actifs
                  </span>
                </div>
                <p className="muted" style={{ fontSize: 13, marginTop: 0 }}>
                  Activez ou masquez chaque mini-jeu, mettez un jeu en vedette et ajustez le multiplicateur d'XP pour les défis spéciaux.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: 8, marginBottom: 12 }}>
                  {ADMIN_GAMES_LIST.map((g) => (
                    <label
                      key={g.id}
                      className="card"
                      style={{ padding: 10, margin: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, cursor: "pointer" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{g.label}</span>
                      <input
                        type="checkbox"
                        checked={gamesConfig.enabledGames?.[g.id] !== false}
                        onChange={(e) =>
                          setGamesConfig((prev) => ({
                            ...prev,
                            enabledGames: { ...(prev.enabledGames || {}), [g.id]: e.target.checked }
                          }))
                        }
                      />
                    </label>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))", gap: 10, marginBottom: 12 }}>
                  <label style={{ display: "grid", gap: 4, fontSize: 12, fontWeight: 700 }}>
                    <span>⭐ Jeu mis en vedette dans l'accueil Jeux</span>
                    <select
                      className="v2-select"
                      value={gamesConfig.featuredGameId || "daily"}
                      onChange={(e) => setGamesConfig((prev) => ({ ...prev, featuredGameId: e.target.value }))}
                    >
                      {ADMIN_GAMES_LIST.filter((g) => !["arena", "books66"].includes(g.id)).map((g) => (
                        <option key={g.id} value={g.id}>{g.label}</option>
                      ))}
                    </select>
                  </label>
                  <label style={{ display: "grid", gap: 4, fontSize: 12, fontWeight: 700 }}>
                    <span>✨ Multiplicateur XP global (Jeux)</span>
                    <select
                      className="v2-select"
                      value={String(gamesConfig.xpMultiplier || 1)}
                      onChange={(e) => setGamesConfig((prev) => ({ ...prev, xpMultiplier: Number(e.target.value) || 1 }))}
                    >
                      <option value="1">1x — Barème standard</option>
                      <option value="1.5">1.5x — Week-end biblique</option>
                      <option value="2">2x — Grande campagne / Concours</option>
                    </select>
                  </label>
                </div>
                <button
                  type="button"
                  className="btn primary small"
                  onClick={async () => {
                    const saved = await saveGamesAdminConfig(gamesConfig);
                    setGamesConfig(saved);
                    showMsg("✅ Studio des Jeux enregistré et appliqué en direct !");
                  }}
                >
                  Enregistrer la configuration des jeux
                </button>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>➕ Créer un Niveau / Contenu de Jeu Personnalisé</h3>
                <p className="muted" style={{ fontSize: 13 }}>
                  Enrichissez immédiatement les jeux avec des passages vérifiés Louis Segond 1910.
                </p>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select className="v2-select" value={gameContentType} onChange={(e) => setGameContentType(e.target.value)}>
                      <option value="whoami">🕵️ Qui suis-je ? (Personnage + 3 indices)</option>
                      <option value="listen">🔊 Écoute & Reconnais (Audio + Question)</option>
                      <option value="chrono">⏳ Chronologie Biblique (Événements ordonnés)</option>
                      <option value="pairs">🔗 Les Paires de la Parole (Associations)</option>
                      <option value="verset">✨ Le Verset Mystère</option>
                      <option value="qcm">📖 Question QCM</option>
                    </select>
                    <select className="v2-select" value={gameBook} onChange={(e) => setGameBook(e.target.value)}>
                      {BIBLE_66_BOOKS.map((b) => <option key={b.id} value={b.nom}>{b.nom}</option>)}
                    </select>
                    <input
                      className="v2-text-input"
                      placeholder="Référence exacte (ex. Genèse 6:14)"
                      value={gameRef}
                      onChange={(e) => setGameRef(e.target.value)}
                      style={{ flex: 1, minWidth: 180 }}
                    />
                  </div>

                  {gameContentType === "whoami" && (
                    <>
                      <input
                        className="v2-text-input"
                        placeholder="Personnage réponse (ex. Noé)"
                        value={gameAnswer}
                        onChange={(e) => setGameAnswer(e.target.value)}
                      />
                      <textarea
                        rows={3}
                        className="v2-textarea"
                        placeholder={"3 indices progressifs (1 par ligne) :\nJ'ai reçu l'ordre de bâtir une arche\nHuit personnes ont été sauvées avec moi\nUne colombe m'a rapporté un rameau d'olivier"}
                        value={gameCluesText}
                        onChange={(e) => setGameCluesText(e.target.value)}
                      />
                      <input
                        className="v2-text-input"
                        placeholder="4 choix séparés par une virgule (ex. Noé, Moïse, Abraham, David)"
                        value={gameOptionsText}
                        onChange={(e) => setGameOptionsText(e.target.value)}
                      />
                    </>
                  )}

                  {gameContentType === "listen" && (
                    <>
                      <textarea
                        rows={3}
                        className="v2-textarea"
                        placeholder="Texte lu par synthèse vocale (Louis Segond 1910)..."
                        value={gameAudioText}
                        onChange={(e) => setGameAudioText(e.target.value)}
                      />
                      <input
                        className="v2-text-input"
                        placeholder="Question posée au joueur après l'écoute..."
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                      />
                      <input
                        className="v2-text-input"
                        placeholder="Choix séparés par une virgule (le 1er choix est la bonne réponse)"
                        value={gameOptionsText}
                        onChange={(e) => setGameOptionsText(e.target.value)}
                      />
                    </>
                  )}

                  {gameContentType === "chrono" && (
                    <>
                      <input
                        className="v2-text-input"
                        placeholder="Titre de la séquence chronologique (ex. Voyages de l'apôtre Paul)"
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                      />
                      <textarea
                        rows={4}
                        className="v2-textarea"
                        placeholder={"Événements dans l'ordre exact (1 par ligne, référence optionnelle après |) :\nConversion sur le chemin de Damas | Actes 9:3\nPremier voyage missionnaire à Chypre | Actes 13:4\nConcile de Jérusalem | Actes 15:6"}
                        value={gameLinesText}
                        onChange={(e) => setGameLinesText(e.target.value)}
                      />
                    </>
                  )}

                  {gameContentType === "pairs" && (
                    <>
                      <input
                        className="v2-text-input"
                        placeholder="Titre du thème (ex. Rois d'Israël & Faits marquants)"
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                      />
                      <textarea
                        rows={4}
                        className="v2-textarea"
                        placeholder={"Paires (1 par ligne au format Gauche | Droite, minimum 3) :\nSalomon | Construction du Temple\nÉzéchias | Prière face à Sennachérib\nJosias | Redécouverte du livre de la loi"}
                        value={gameLinesText}
                        onChange={(e) => setGameLinesText(e.target.value)}
                      />
                    </>
                  )}

                  {gameContentType === "verset" && (
                    <textarea
                      rows={3}
                      className="v2-textarea"
                      placeholder="Texte exact Louis Segond 1910 pour Le Verset Mystère..."
                      value={gameAudioText}
                      onChange={(e) => setGameAudioText(e.target.value)}
                    />
                  )}

                  {gameContentType === "qcm" && (
                    <>
                      <input
                        className="v2-text-input"
                        placeholder="Question biblique..."
                        value={gameTitle}
                        onChange={(e) => setGameTitle(e.target.value)}
                      />
                      <input
                        className="v2-text-input"
                        placeholder="Choix séparés par une virgule (le 1er choix est la bonne réponse)"
                        value={gameOptionsText}
                        onChange={(e) => setGameOptionsText(e.target.value)}
                      />
                    </>
                  )}

                  <input
                    className="v2-text-input"
                    placeholder="Explication pédagogique affichée après la réponse (Louis Segond 1910)"
                    value={gameExpl}
                    onChange={(e) => setGameExpl(e.target.value)}
                  />
                  <button type="button" className="btn primary small" onClick={handleCreateGameContent}>
                    Publier dans le Studio des Jeux
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>📚 Niveaux Personnalisés Actifs ({cmsItems.length})</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  {cmsItems.length === 0 ? (
                    <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                      Aucun niveau personnalisé ajouté pour le moment. Les pools natifs restent actifs.
                    </p>
                  ) : (
                    cmsItems.map((c) => (
                      <div key={c.id} className="card" style={{ padding: 10, margin: 0, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div>
                          <span className="pill">{String(c.type || "cms").toUpperCase()}</span>{" "}
                          <strong>{c.titre || c.reponse || c.ref}</strong> <span className="muted">({c.livre} · {c.ref})</span>
                          <p className="muted" style={{ margin: "4px 0 0", fontSize: 12 }}>
                            {c.texte || c.question || c.audioText || c.explication}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="btn secondary small"
                          onClick={async () => {
                            setCmsItems(await deleteCustomBibleContent(c.id));
                            showMsg("🗑️ Contenu de jeu supprimé.");
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "blessings" && (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <h3 style={{ margin: 0 }}>🕊️ Paramètres des Cartes de Bénédiction</h3>
                  <span className="pill">
                    {blessingsConfig.cards.length} cartes · {blessingsConfig.themes.length} thèmes
                  </span>
                </div>
                <div style={{ display: "grid", gap: 10 }}>
                  <label style={{ display: "grid", gap: 4, fontSize: 12, fontWeight: 700 }}>
                    <span>✍️ Dédicace d'encouragement par défaut</span>
                    <input
                      className="v2-text-input"
                      value={blessingsConfig.defaultDedication || ""}
                      onChange={(e) => setBlessingsConfig((prev) => ({ ...prev, defaultDedication: e.target.value }))}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 4, fontSize: 12, fontWeight: 700 }}>
                    <span>⛪ En-tête / Signature de l'Église sur l'image HD</span>
                    <input
                      className="v2-text-input"
                      value={blessingsConfig.churchSubtitle || ""}
                      onChange={(e) => setBlessingsConfig((prev) => ({ ...prev, churchSubtitle: e.target.value }))}
                    />
                  </label>
                  <label style={{ display: "grid", gap: 4, fontSize: 12, fontWeight: 700 }}>
                    <span>🔗 URL d'invitation imprimée en pied de carte & WhatsApp</span>
                    <input
                      className="v2-text-input"
                      value={blessingsConfig.shareUrl || ""}
                      onChange={(e) => setBlessingsConfig((prev) => ({ ...prev, shareUrl: e.target.value }))}
                    />
                  </label>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const saved = await saveBlessingCardSettings(blessingsConfig);
                      setBlessingsConfig(saved);
                      showMsg("✅ Paramètres des Cartes de Bénédiction enregistrés !");
                    }}
                  >
                    Enregistrer les paramètres des cartes
                  </button>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>🎨 Ambiances Visuelles des Cartes ({blessingsConfig.themes.length})</h3>
                <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
                  <input
                    className="v2-text-input"
                    placeholder="Nom de la nouvelle ambiance (ex. Aube Dorée)"
                    value={blThemeNom}
                    onChange={(e) => setBlThemeNom(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                      <span>Fond 1</span>
                      <input type="color" value={blThemeBg1} onChange={(e) => setBlThemeBg1(e.target.value)} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                      <span>Fond 2</span>
                      <input type="color" value={blThemeBg2} onChange={(e) => setBlThemeBg2(e.target.value)} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                      <span>Cadre Or</span>
                      <input type="color" value={blThemeGold} onChange={(e) => setBlThemeGold(e.target.value)} />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700 }}>
                      <span>Accent</span>
                      <input type="color" value={blThemeAccent} onChange={(e) => setBlThemeAccent(e.target.value)} />
                    </label>
                    <span
                      style={{
                        padding: "6px 12px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${blThemeBg1}, ${blThemeBg2})`,
                        border: `2px solid ${blThemeGold}`,
                        color: blThemeAccent
                      }}
                    >
                      Aperçu · {blThemeNom || "Thème"}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const res = await addAdminBlessingTheme({
                        nom: blThemeNom,
                        bg1: blThemeBg1,
                        bg2: blThemeBg2,
                        gold: blThemeGold,
                        accent: blThemeAccent
                      });
                      if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                      setBlessingsConfig(res.config);
                      setBlThemeNom("");
                      showMsg("🎨 Ambiance ajoutée aux cartes de bénédiction !");
                    }}
                  >
                    Ajouter le thème visuel
                  </button>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {blessingsConfig.themes.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 10px",
                        borderRadius: 10,
                        background: `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`,
                        border: `1.5px solid ${t.gold}`,
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 700
                      }}
                    >
                      <span style={{ color: t.accent }}>{t.nom}</span>
                      <button
                        type="button"
                        className="btn secondary small"
                        style={{ padding: "2px 6px", fontSize: 11 }}
                        onClick={async () => {
                          const res = await deleteAdminBlessingTheme(t.id);
                          if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                          setBlessingsConfig(res.config);
                          showMsg("🗑️ Thème retiré.");
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginTop: 0 }}>➕ Ajouter une Carte de Bénédiction (Louis Segond 1910)</h3>
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <input
                      className="v2-text-input"
                      placeholder="Référence (ex. Psaume 121:1-2)"
                      value={blCardRef}
                      onChange={(e) => setBlCardRef(e.target.value)}
                      style={{ flex: 1, minWidth: 160 }}
                    />
                    <input
                      className="v2-text-input"
                      placeholder="Thème court (ex. Protection divine)"
                      value={blCardTheme}
                      onChange={(e) => setBlCardTheme(e.target.value)}
                      style={{ flex: 1, minWidth: 160 }}
                    />
                  </div>
                  <textarea
                    rows={3}
                    className="v2-textarea"
                    placeholder="Verset exact Louis Segond 1910..."
                    value={blCardText}
                    onChange={(e) => setBlCardText(e.target.value)}
                  />
                  <input
                    className="v2-text-input"
                    placeholder="Message fraternel associé (affiché dans Fraternité)"
                    value={blCardMsg}
                    onChange={(e) => setBlCardMsg(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn primary small"
                    onClick={async () => {
                      const res = await addAdminBlessingCard({
                        ref: blCardRef,
                        theme: blCardTheme,
                        texte: blCardText,
                        message: blCardMsg
                      });
                      if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                      setBlessingsConfig(res.config);
                      setBlCardRef("");
                      setBlCardTheme("");
                      setBlCardText("");
                      setBlCardMsg("");
                      showMsg("🕊️ Nouvelle carte de bénédiction publiée !");
                    }}
                  >
                    Publier la carte de bénédiction
                  </button>
                </div>
              </div>

              <div className="card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <h3 style={{ margin: 0 }}>🗂️ Catalogue des Cartes ({blessingsConfig.cards.length})</h3>
                  <button
                    type="button"
                    className="btn secondary small"
                    onClick={async () => {
                      const reset = await resetAdminBlessingCards();
                      setBlessingsConfig(reset);
                      showMsg("🔄 Cartes et thèmes par défaut restaurés !");
                    }}
                  >
                    Réinitialiser par défaut
                  </button>
                </div>
                <div style={{ display: "grid", gap: 8 }}>
                  {blessingsConfig.cards.map((c) => (
                    <div key={c.id} className="card" style={{ padding: 10, margin: 0, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ flex: "1 1 240px" }}>
                        <strong>{c.ref}</strong> <span className="pill">{c.theme}</span>
                        <p style={{ margin: "6px 0 4px", fontSize: 13 }}>« {c.texte} »</p>
                        {c.message && <p className="muted" style={{ margin: 0, fontSize: 12 }}>💬 {c.message}</p>}
                      </div>
                      <button
                        type="button"
                        className="btn secondary small"
                        onClick={async () => {
                          const res = await deleteAdminBlessingCard(c.id);
                          if (!res.ok) { showMsg("⚠️ " + res.error); return; }
                          setBlessingsConfig(res.config);
                          showMsg("🗑️ Carte retirée.");
                        }}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {statusToast && (
        <div className="toast">
          <span>{statusToast}</span>
        </div>
      )}
    </div>
  );
}

