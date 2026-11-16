import React, { useState } from "react";
import {
  buildChurchAdminMetrics,
  getPedagogicalDifficultyInsights,
  publishChurchAnnouncement
} from "../../services/adminAnalytics.js";

export default function ChurchAdminModal({
  open,
  onClose,
  pelerinName = "Responsable",
  leaderboard = [],
  groups = [],
  prayers = [],
  memorizationStats = {},
  completedStages = [],
  gameStats = {},
  epochStages = {},
  onAnnouncementPublished,
  onModeratePrayer,
  onToast
}) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  if (!open) return null;

  const metrics = buildChurchAdminMetrics({
    leaderboard,
    groups,
    prayers,
    memorizationStats,
    completedStages,
    gameStats
  });
  const difficulty = getPedagogicalDifficultyInsights(completedStages, epochStages);

  const handlePublish = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await publishChurchAnnouncement({
        titre: title || "Mot des Responsables — EEAG Issia",
        texte: text,
        auteur: pelerinName
      });
      if (!res.ok) {
        onToast?.(res.error);
        return;
      }
      setTitle("");
      setText("");
      onAnnouncementPublished?.(res.announcements);
      onToast?.("📢 Annonce officielle publiée pour l'Église !");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card v2-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill">🛡️ Administration & Suivi Pédagogique</span>
            <h2 style={{ margin: "6px 0 0" }}>Tableau des Responsables d'Église</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div className="callout" style={{ margin: "12px 0" }}>
          🔒 <strong>Respect strict de la vie privée :</strong> cet espace affiche uniquement des statistiques agrégées, les annonces officielles et les prières publiques. Aucun carnet spirituel privé ni donnée personnelle sensible n'y est accessible.
        </div>

        <div className="v2-kpi-grid">
          <div className="card v2-kpi-box">
            <div className="v2-kpi-val">{metrics.activePilgrims}</div>
            <div className="v2-kpi-label">Pèlerins actifs</div>
          </div>
          <div className="card v2-kpi-box">
            <div className="v2-kpi-val">{metrics.totalCompletedStages}</div>
            <div className="v2-kpi-label">Étapes validées</div>
          </div>
          <div className="card v2-kpi-box">
            <div className="v2-kpi-val">{metrics.memorizedVerses}</div>
            <div className="v2-kpi-label">Versets maîtrisés</div>
          </div>
          <div className="card v2-kpi-box">
            <div className="v2-kpi-val">{metrics.delayedSuccessRate}%</div>
            <div className="v2-kpi-label">Réussite différée</div>
          </div>
        </div>

        <div className="card" style={{ padding: 14, marginTop: 14 }}>
          <h4 style={{ marginTop: 0 }}>📚 Progression & Difficulté par Époque</h4>
          <div style={{ display: "grid", gap: 6 }}>
            {difficulty.map((d) => (
              <div key={d.epochId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "6px 8px", borderRadius: 8, background: "rgba(148,163,184,0.08)" }}>
                <span><strong>{d.epochId.toUpperCase()}</strong> ({d.done}/{d.total})</span>
                <span className="badge">{d.completionPct}% · {d.status}</span>
              </div>
            ))}
          </div>
        </div>

        <form className="card" style={{ padding: 14, marginTop: 14 }} onSubmit={handlePublish}>
          <h4 style={{ marginTop: 0 }}>📢 Diffuser une annonce ou un encouragement d'Église</h4>
          <input
            className="v2-text-input"
            placeholder="Titre (ex: Soirée de prière vendredi à Issia)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <textarea
            rows={3}
            className="v2-textarea"
            placeholder="Message d'encouragement ou programme biblique de la semaine..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button type="submit" className="btn primary small" disabled={sending} style={{ marginTop: 8 }}>
            {sending ? "Publication..." : "Publier l'annonce"}
          </button>
        </form>

        <div className="card" style={{ padding: 14, marginTop: 14 }}>
          <h4 style={{ marginTop: 0 }}>🕊️ Modération du Mur de Prière ({prayers.length} intentions)</h4>
          <div style={{ display: "grid", gap: 8, maxHeight: 180, overflowY: "auto" }}>
            {prayers.slice(0, 6).map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", fontSize: 13 }}>
                <span><strong>{p.auteur} :</strong> {String(p.texte || "").slice(0, 90)}</span>
                <button className="btn secondary small" onClick={() => onModeratePrayer?.(p.id)}>Retirer</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

