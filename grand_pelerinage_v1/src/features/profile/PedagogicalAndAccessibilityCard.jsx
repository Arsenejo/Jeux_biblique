import React from "react";
import { PEDAGOGICAL_PROFILES } from "../../services/accessibilitySettings.js";
import { HONORARY_TITLES, getCurrentHonoraryTitle, getCollectionsStatus } from "../../services/gamificationEngine.js";

export default function PedagogicalAndAccessibilityCard({
  pedagogicalProfile = "explorateur",
  onChangePedagogicalProfile,
  accessibilityPrefs,
  onUpdateAccessibility,
  xp = 0,
  stagesCount = 0,
  memorizedCount = 0,
  collectionStats = {},
  onOpenNotifications
}) {
  const titleInfo = getCurrentHonoraryTitle({ xp, stagesCount, memorizedCount });
  const collections = getCollectionsStatus(collectionStats);

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
      {/* Profils pédagogiques adaptatifs */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>🎓 Parcours Pédagogique Adaptatif</h3>
        <p className="muted" style={{ fontSize: 13 }}>
          Adapte la longueur des textes, le nombre d'indices et le rythme sans jamais pénaliser l'apprentissage.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 185px), 1fr))", gap: 10 }}>
          {PEDAGOGICAL_PROFILES.map((prof) => {
            const active = pedagogicalProfile === prof.id;
            return (
              <button
                key={prof.id}
                className={`option-btn ${active ? "selected" : ""}`}
                style={{ textAlign: "left", padding: 12 }}
                onClick={() => onChangePedagogicalProfile?.(prof.id)}
              >
                <div style={{ fontWeight: 700 }}>{prof.icone} {prof.nom}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{prof.publicCible}</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{prof.description}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accessibilité & Multisensoriel */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h3 style={{ margin: 0 }}>♿ Accessibilité, Audio & Notifications</h3>
          <button className="btn secondary small" onClick={onOpenNotifications}>🔔 MES NOTIFICATIONS</button>
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <label className="v2-setting-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <span>Taille du texte (toute l'application)</span>
            <select
              className="v2-select"
              value={accessibilityPrefs?.fontSize || "normal"}
              onChange={(e) => onUpdateAccessibility?.({ ...accessibilityPrefs, fontSize: e.target.value })}
            >
              <option value="normal">Standard</option>
              <option value="large">Grand (+12%)</option>
              <option value="xlarge">Très grand (+24%)</option>
            </select>
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span>🔊 Effets sonores discrets & lecture audio</span>
            <input
              type="checkbox"
              checked={accessibilityPrefs?.soundEnabled !== false}
              onChange={(e) => onUpdateAccessibility?.({ ...accessibilityPrefs, soundEnabled: e.target.checked })}
            />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span>📳 Vibrations légères (mobile)</span>
            <input
              type="checkbox"
              checked={accessibilityPrefs?.hapticEnabled !== false}
              onChange={(e) => onUpdateAccessibility?.({ ...accessibilityPrefs, hapticEnabled: e.target.checked })}
            />
          </label>
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
            <span>🌿 Réduire les animations (confort visuel)</span>
            <input
              type="checkbox"
              checked={Boolean(accessibilityPrefs?.reducedMotion)}
              onChange={(e) => onUpdateAccessibility?.({ ...accessibilityPrefs, reducedMotion: e.target.checked })}
            />
          </label>
        </div>
      </div>

      {/* Titres honorifiques */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>👑 Titres Honorifiques</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {HONORARY_TITLES.map((t) => {
            const reached = xp >= t.minXp && stagesCount >= t.minStages && memorizedCount >= t.minMemorized;
            const isCurrent = titleInfo.current.id === t.id;
            return (
              <span
                key={t.id}
                className="pill"
                style={{
                  opacity: reached ? 1 : 0.45,
                  border: isCurrent ? "2px solid #f59e0b" : undefined,
                  fontWeight: isCurrent ? 700 : 500
                }}
              >
                {t.icone} {t.nom}
              </span>
            );
          })}
        </div>
      </div>

      {/* 6 Collections débloquables */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ marginTop: 0 }}>🏺 Collections à Compléter</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 190px), 1fr))", gap: 10 }}>
          {collections.map((c) => (
            <div key={c.id} className="card" style={{ padding: 12, borderColor: c.unlocked ? "#10b981" : undefined }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{c.icone} {c.nom}</strong>
                <span>{c.unlocked ? "✅" : `${c.current}/${c.target}`}</span>
              </div>
              <p className="muted" style={{ fontSize: 12, margin: "6px 0" }}>{c.objectif}</p>
              <div style={{ height: 6, borderRadius: 99, background: "rgba(148,163,184,0.2)", overflow: "hidden" }}>
                <div style={{ width: `${c.progressPct}%`, height: "100%", background: c.unlocked ? "#10b981" : "#3b82f6" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

