import React, { useState } from "react";
import {
  NOTIFICATION_CATEGORIES,
  detectPushPlatformCapabilities,
  requestWebPushPermissionAndSync,
  checkVapidPushReadiness
} from "../../services/notificationsEngine.js";

export default function NotificationCenterModal({
  open,
  onClose,
  inbox = [],
  prefs,
  uid,
  onUpdatePrefs,
  onMarkRead,
  onMarkAllRead,
  onArchive,
  onOpenTarget,
  onToast
}) {
  const [view, setView] = useState("inbox"); // "inbox" | "settings"
  const [pushFeedback, setPushFeedback] = useState("");
  const [loadingPush, setLoadingPush] = useState(false);

  if (!open) return null;

  const visibleItems = inbox.filter((n) => !n.archived);
  const unreadCount = visibleItems.filter((n) => !n.read).length;
  const caps = detectPushPlatformCapabilities();
  const vapidStatus = checkVapidPushReadiness();
  const isPaused = Boolean(prefs?.pausedUntil && prefs.pausedUntil > Date.now());

  const handleEnablePush = async () => {
    setLoadingPush(true);
    try {
      const res = await requestWebPushPermissionAndSync(uid, prefs);
      if (res.ok) {
        onUpdatePrefs?.({ ...prefs, pushEnabled: true });
        setPushFeedback(res.message);
        onToast?.("🔔 Notifications Push activées !");
      } else {
        setPushFeedback(res.reason);
      }
    } finally {
      setLoadingPush(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card v2-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill">🔔 {unreadCount} non lue(s)</span>
            <h2 style={{ margin: "6px 0 0" }}>Centre de Notifications</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 16px" }}>
          <button className={`btn small ${view === "inbox" ? "primary" : "secondary"}`} onClick={() => setView("inbox")}>
            📥 Boîte de réception ({visibleItems.length})
          </button>
          <button className={`btn small ${view === "settings" ? "primary" : "secondary"}`} onClick={() => setView("settings")}>
            ⚙️ MES NOTIFICATIONS
          </button>
          {view === "inbox" && unreadCount > 0 && (
            <button className="btn small secondary" onClick={onMarkAllRead}>
              ✓ Tout marquer comme lu
            </button>
          )}
        </div>

        {view === "inbox" && (
          <div style={{ display: "grid", gap: 10, maxHeight: "55vh", overflowY: "auto" }}>
            {visibleItems.length === 0 ? (
              <div className="card" style={{ padding: 18, textAlign: "center" }}>
                <p className="muted" style={{ margin: 0 }}>
                  Aucune notification en attente. Tes rappels bienveillants apparaîtront ici dans le respect de tes préférences.
                </p>
              </div>
            ) : (
              visibleItems.map((n) => (
                <div
                  key={n.id}
                  className="card"
                  style={{
                    padding: "12px 14px",
                    borderLeft: n.read ? "4px solid var(--border)" : "4px solid #10b981",
                    opacity: n.read ? 0.85 : 1
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                    <div>
                      <strong>{n.title}</strong>
                      <p className="muted" style={{ margin: "4px 0 8px", fontSize: 13 }}>{n.body}</p>
                    </div>
                    <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                      <button
                        className="btn small primary"
                        onClick={() => {
                          onMarkRead?.(n.id);
                          onOpenTarget?.(n);
                          onClose();
                        }}
                      >
                        Ouvrir
                      </button>
                      <button className="btn small secondary" onClick={() => onArchive?.(n.id)} title="Archiver">
                        🗄️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {view === "settings" && (
          <div style={{ display: "grid", gap: 14, maxHeight: "60vh", overflowY: "auto" }}>
            <div className="callout">
              <strong>Notifications Push navigateur & mobile (sur accord volontaire uniquement)</strong>
              <p className="muted" style={{ margin: "6px 0 8px", fontSize: 13 }}>
                État : <strong>{prefs?.pushEnabled ? "Activées" : "Désactivées"}</strong> · Permission navigateur : <code>{caps.permission}</code> · Fuseau : <code>{prefs?.timezone}</code>
              </p>
              {!vapidStatus.hasVapidKey && (
                <p style={{ fontSize: 12, margin: "0 0 8px", color: "#92400e" }}>
                  Note technique : les rappels intelligents dans l'application fonctionnent dès maintenant. Pour les Push distants quand le navigateur est fermé, ajoute `VITE_FIREBASE_VAPID_KEY` dans `.env` / Vercel.
                </p>
              )}
              {caps.isIOS && !caps.isStandalone && (
                <p style={{ fontSize: 12, margin: "0 0 8px" }}>
                  📱 Sur iPhone / iPad : touche <strong>Partager → Sur l'écran d'accueil</strong> pour activer les notifications PWA.
                </p>
              )}
              <button className="btn primary small" disabled={loadingPush} onClick={handleEnablePush}>
                {loadingPush ? "Configuration..." : "🔔 Activer les notifications Push"}
              </button>
              {pushFeedback && <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>{pushFeedback}</p>}
            </div>

            <div className="card" style={{ padding: 14 }}>
              <h4 style={{ marginTop: 0 }}>Rythme, Heures silencieuses & Pause</h4>
              <div style={{ display: "grid", gap: 10 }}>
                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span>Fréquence des rappels</span>
                  <select
                    className="v2-select"
                    value={prefs?.frequency || "quotidienne"}
                    onChange={(e) => onUpdatePrefs?.({ ...prefs, frequency: e.target.value })}
                  >
                    <option value="quotidienne">Quotidienne</option>
                    <option value="espaced_3j">Douce (tous les 3 jours)</option>
                    <option value="hebdo">Hebdomadaire uniquement</option>
                  </select>
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span>Plafond quotidien maximum</span>
                  <select
                    className="v2-select"
                    value={prefs?.maxDaily || 2}
                    onChange={(e) => onUpdatePrefs?.({ ...prefs, maxDaily: Number(e.target.value) })}
                  >
                    <option value={1}>1 notification / jour</option>
                    <option value={2}>2 notifications / jour (recommandé)</option>
                    <option value={3}>3 notifications / jour</option>
                  </select>
                </label>

                <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span>Plage silencieuse (aucun dérangement)</span>
                  <select
                    className="v2-select"
                    value={`${prefs?.quietStartHour ?? 21}-${prefs?.quietEndHour ?? 7}`}
                    onChange={(e) => {
                      const [s, end] = e.target.value.split("-").map(Number);
                      onUpdatePrefs?.({ ...prefs, quietStartHour: s, quietEndHour: end });
                    }}
                  >
                    <option value="21-7">21h00 – 07h00</option>
                    <option value="22-6">22h00 – 06h00</option>
                    <option value="20-8">20h00 – 08h00</option>
                  </select>
                </label>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span>Pause rapide :</span>
                  {isPaused ? (
                    <button className="btn small primary" onClick={() => onUpdatePrefs?.({ ...prefs, pausedUntil: 0 })}>
                      ▶️ Reprendre maintenant
                    </button>
                  ) : (
                    <>
                      <button className="btn small secondary" onClick={() => onUpdatePrefs?.({ ...prefs, pausedUntil: Date.now() + 24 * 3600 * 1000 })}>
                        ⏸️ Pause 24h
                      </button>
                      <button className="btn small secondary" onClick={() => onUpdatePrefs?.({ ...prefs, pausedUntil: Date.now() + 7 * 24 * 3600 * 1000 })}>
                        ⏸️ Pause 7 jours
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <h4 style={{ marginTop: 0 }}>Catégories autorisées</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {NOTIFICATION_CATEGORIES.map((cat) => {
                  const checked = Boolean(prefs?.categories?.[cat.id]);
                  return (
                    <label key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                      <span>{cat.icone} {cat.label}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          onUpdatePrefs?.({
                            ...prefs,
                            categories: { ...(prefs?.categories || {}), [cat.id]: e.target.checked }
                          })
                        }
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

