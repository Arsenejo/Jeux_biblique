import React, { useState } from "react";
import {
  COLLECTIVE_CHALLENGES,
  createCloudChurchGroup,
  joinCloudChurchGroup,
  contributeCollectiveChallenge
} from "../../services/churchGroupCloud.js";

const LEADERBOARD_MODES = [
  { id: "general", label: "🏆 Général (XP)" },
  { id: "weekly", label: "📅 Semaine" },
  { id: "group", label: "⛪ Groupe d'Église" },
  { id: "memo", label: "🌱 Mémorisation" },
  { id: "games", label: "🎮 Jeux V2" }
];

export default function CommunityGroupsV2({
  pelerinName = "Pèlerin",
  uid = null,
  xp = 0,
  memorizedCount = 0,
  gamesPlayed = 0,
  churchGroup,
  leaderboard = [],
  onGroupUpdated,
  onOpenAdmin,
  onToast
}) {
  const [groupNameInput, setGroupNameInput] = useState("Assemblée de la Grâce — Issia");
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [lbMode, setLbMode] = useState("general");
  const [busy, setBusy] = useState(false);

  const handleCreate = async () => {
    setBusy(true);
    try {
      const created = await createCloudChurchGroup({
        nom: groupNameInput,
        ownerName: pelerinName,
        uid
      });
      onGroupUpdated?.(created);
      onToast?.(`⛪ Groupe créé ! Code d'invitation : ${created.code}`);
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    setBusy(true);
    try {
      const res = await joinCloudChurchGroup({
        code: joinCodeInput,
        memberName: pelerinName,
        memberStats: { xp, memorized: memorizedCount }
      });
      if (!res.ok) {
        onToast?.(res.error);
        return;
      }
      onGroupUpdated?.(res.group);
      setJoinCodeInput("");
      onToast?.(res.syncedCloud ? `☁️ Rejoint le groupe ${res.group.code} (Cloud)` : `⛪ Rejoint le groupe ${res.group.code}`);
    } finally {
      setBusy(false);
    }
  };

  const handleContribute = async (challengeId) => {
    const updated = await contributeCollectiveChallenge(challengeId, 1);
    onGroupUpdated?.(updated);
    onToast?.("🙌 Contribution enregistrée pour le défi de ton groupe !");
  };

  const baseEntries = [
    ...leaderboard.map((u) => ({
      name: u.nom || "Pèlerin",
      xp: Number(u.xp) || 0,
      weeklyXp: Math.round((Number(u.xp) || 0) * 0.25),
      memorized: Number(u.stagesValidees) || 0,
      games: Math.round((Number(u.xp) || 0) / 30),
      isMe: false
    })),
    {
      name: `${pelerinName} (Toi)`,
      xp,
      weeklyXp: Math.min(xp, Math.max(20, Math.round(xp * 0.35))),
      memorized: memorizedCount,
      games: gamesPlayed,
      isMe: true
    }
  ];

  const displayedLeaderboard =
    lbMode === "group" && churchGroup?.members?.length
      ? [...churchGroup.members]
          .map((m) => ({
            name: `${m.name} (${m.role || "membre"})`,
            xp: Number(m.xp) || 0,
            metricLabel: `${Number(m.xp) || 0} XP`
          }))
          .sort((a, b) => b.xp - a.xp)
      : [...baseEntries]
          .map((e) => {
            const val =
              lbMode === "weekly"
                ? e.weeklyXp
                : lbMode === "memo"
                  ? e.memorized
                  : lbMode === "games"
                    ? e.games
                    : e.xp;
            const unit =
              lbMode === "memo"
                ? "verset(s)"
                : lbMode === "games"
                  ? "partie(s)"
                  : "XP";
            return { ...e, sortVal: val, metricLabel: `${val} ${unit}` };
          })
          .sort((a, b) => b.sortVal - a.sortVal)
          .slice(0, 8);

  return (
    <div style={{ display: "grid", gap: 16, marginBottom: 18 }}>
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
          <div>
            <span className="pill">⛪ Communauté V2.0 (Cloud & Hors-Ligne)</span>
            <h3 style={{ margin: "6px 0 2px" }}>Groupes d'Église, Familles & Jeunes</h3>
            <p className="muted" style={{ margin: 0, fontSize: 13 }}>
              {churchGroup
                ? `Groupe actif : ${churchGroup.nom} (Code : ${churchGroup.code}) · ${(churchGroup.members || []).length || 1} membre(s)`
                : "Crée un groupe d'église ou rejoins celui de ta cellule avec un code à 6 caractères."}
            </p>
          </div>
          <button className="btn secondary small" onClick={onOpenAdmin}>
            🛡️ Espace Responsables & Stats
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 14 }}>
          <div className="callout" style={{ margin: 0 }}>
            <strong style={{ display: "block", marginBottom: 6 }}>Créer un groupe</strong>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <input className="v2-text-input" value={groupNameInput} onChange={(e) => setGroupNameInput(e.target.value)} style={{ flex: 1, minWidth: 140 }} />
              <button className="btn primary small" disabled={busy} onClick={handleCreate}>Créer</button>
            </div>
          </div>

          <div className="callout" style={{ margin: 0 }}>
            <strong style={{ display: "block", marginBottom: 6 }}>Rejoindre par code (6 car.)</strong>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <input
                className="v2-text-input"
                placeholder="Ex: EEAG26"
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase().slice(0, 6))}
                style={{ flex: 1, minWidth: 120 }}
              />
              <button className="btn secondary small" disabled={busy} onClick={handleJoin}>Rejoindre</button>
            </div>
          </div>
        </div>

        {/* 4 Défis Collectifs */}
        <h4 style={{ margin: "16px 0 8px" }}>🤝 4 Défis Collectifs Bienveillants</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          {COLLECTIVE_CHALLENGES.map((ch) => {
            const count = Number(churchGroup?.challengeProgress?.[ch.id]) || 0;
            const pct = Math.min(100, Math.round((count / ch.objectif) * 100));
            return (
              <div key={ch.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <strong>{ch.icone} {ch.titre}</strong>
                </div>
                <p className="muted" style={{ fontSize: 12, margin: "6px 0" }}>{count} / {ch.objectif} {ch.unite} ({pct}%)</p>
                <div style={{ height: 6, borderRadius: 99, background: "rgba(148,163,184,0.2)", overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#10b981" }} />
                </div>
                <button className="btn secondary small" onClick={() => handleContribute(ch.id)}>+1 Contribution</button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Classements */}
      <div className="card" style={{ padding: 16 }}>
        <h4 style={{ marginTop: 0 }}>📊 Classements Fraternels (5 vues)</h4>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
          {LEADERBOARD_MODES.map((m) => (
            <button key={m.id} className={`btn small ${lbMode === m.id ? "primary" : "secondary"}`} onClick={() => setLbMode(m.id)}>
              {m.label}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {displayedLeaderboard.map((row, idx) => (
            <div key={`${row.name}-${idx}`} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 10, background: row.isMe ? "rgba(16,185,129,0.14)" : "rgba(148,163,184,0.08)" }}>
              <span><strong>#{idx + 1}</strong> {row.name}</span>
              <span className="badge">{row.metricLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

