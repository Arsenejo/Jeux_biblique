import React from "react";
import { getCurrentHonoraryTitle, getActiveMissions, getCollectionsStatus } from "../../services/gamificationEngine.js";

export default function HomeDashboardV2({
  pelerinName = "Pèlerin",
  xp = 0,
  streak = 0,
  completedStages = [],
  totalStages = 148,
  dueMemorizationCount = 0,
  masteredVersesCount = 0,
  todayChallengeDone = false,
  bibleChaptersRead = 0,
  prayerShared = false,
  weeklyGroupDone = false,
  collectionStats = {},
  nextStage = null,
  announcements = [],
  onResumeStage,
  onNavigate,
  onOpenMemorization
}) {
  const titleInfo = getCurrentHonoraryTitle({
    xp,
    stagesCount: completedStages.length,
    memorizedCount: masteredVersesCount
  });
  const missions = getActiveMissions({
    todayChallengeDone,
    dueMemorizationCount,
    stagesToday: completedStages.length > 0 ? 1 : 0,
    weeklyGroupDone,
    bibleChaptersRead,
    prayerShared
  });
  const collections = getCollectionsStatus(collectionStats);
  const unlockedCollections = collections.filter((c) => c.unlocked).length;
  const globalPct = Math.min(100, Math.round((completedStages.length / Math.max(1, totalStages)) * 100));

  return (
    <div className="v2-home-dashboard fade-in" style={{ marginBottom: 18 }}>
      {/* Bannière d'accueil personnalisée V2.0 */}
      <div className="card v2-welcome-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
          <div>
            <span className="pill">{titleInfo.current.icone} {titleInfo.current.nom}</span>
            <h2 style={{ margin: "8px 0 4px" }}>Shalom {pelerinName} — Ton Pèlerinage V2.0</h2>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              DÉCOUVRIR · COMPRENDRE · MÉMORISER · PRATIQUER · PARTAGER — Progression générale : {globalPct}% ({completedStages.length}/{totalStages} étapes)
            </p>
            {titleInfo.next && (
              <p className="muted" style={{ margin: "6px 0 0", fontSize: 12 }}>
                Prochain rang : {titleInfo.next.icone} <strong>{titleInfo.next.nom}</strong> ({titleInfo.next.minXp} XP · {titleInfo.next.minStages} étapes · {titleInfo.next.minMemorized} versets maîtrisés)
              </p>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {nextStage && (
              <button className="btn primary" onClick={() => onResumeStage?.(nextStage)}>
                🗺️ Continuer : {nextStage.titre}
              </button>
            )}
            <button className="btn secondary" onClick={() => onNavigate?.("Jeux")}>
              {todayChallengeDone ? "🎮 Espace Jeux" : "☀️ Relever le Défi du Jour"}
            </button>
          </div>
        </div>
      </div>

      {/* Grille Synthèse Quotidienne */}
      <div className="v2-dashboard-grid">
        <div className="card v2-mini-panel">
          <h4 style={{ marginTop: 0 }}>🎯 Missions & Engagements</h4>
          <div style={{ display: "grid", gap: 6 }}>
            {missions.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6, fontSize: 13, padding: "6px 8px", borderRadius: 8, background: m.done ? "rgba(16,185,129,0.12)" : "rgba(148,163,184,0.1)" }}>
                <span>{m.done ? "✅" : m.icone} {m.titre}</span>
                <span className="badge" style={{ fontSize: 11 }}>{m.rewardLabel}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card v2-mini-panel">
          <h4 style={{ marginTop: 0 }}>🌱 Versets & Récompenses</h4>
          <p style={{ fontSize: 13, margin: "0 0 8px" }}>
            Série active : <strong>{streak} jour(s) 🔥</strong> · Versets à réviser : <strong>{dueMemorizationCount}</strong>
          </p>
          <p style={{ fontSize: 13, margin: "0 0 10px" }}>
            Collections débloquées : <strong>{unlockedCollections} / {collections.length}</strong>
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button className="btn small primary" onClick={onOpenMemorization}>
              🌱 Mes Versets ({dueMemorizationCount})
            </button>
            <button className="btn small secondary" onClick={() => onNavigate?.("Fraternité")}>
              ⛪ Communauté & Groupes
            </button>
            <button className="btn small secondary" onClick={() => onNavigate?.("Profil")}>
              🏆 Collections ({unlockedCollections})
            </button>
          </div>
        </div>
      </div>

      {announcements.length > 0 && (
        <div className="callout" style={{ marginTop: 12 }}>
          <strong>📢 Annonce de l'Église ({announcements[0].auteur}) :</strong> {announcements[0].titre} — {announcements[0].texte}
        </div>
      )}
    </div>
  );
}

