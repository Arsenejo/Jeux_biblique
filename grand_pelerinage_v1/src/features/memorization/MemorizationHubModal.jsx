import React, { useState, useMemo } from "react";
import { MYSTERY_VERSES_POOL } from "../../data/bibleGamesData.js";
import {
  MEMORIZATION_STAGES,
  createMemorizationCard,
  buildInitialsPrompt,
  evaluateVerseRecall,
  recordMemorizationAttempt,
  getMemorizationDashboardStats
} from "../../services/memorizationEngine.js";
import { speakFrench, playSfx } from "../../services/audioSpeech.js";

export default function MemorizationHubModal({
  open,
  onClose,
  memorizationCards = {},
  leitnerCards = {},
  onUpdateMemorizationCard,
  onReward,
  onToast
}) {
  const [subTab, setSubTab] = useState("dashboard"); // "dashboard" | "train" | "catalog"
  const [activeRef, setActiveRef] = useState(null);
  const [fillInput, setFillInput] = useState("");
  const [recallInput, setRecallInput] = useState("");
  const [feedback, setFeedback] = useState(null);

  const stats = useMemo(
    () => getMemorizationDashboardStats(memorizationCards, leitnerCards, Date.now()),
    [memorizationCards, leitnerCards]
  );

  if (!open) return null;

  const selectedCard =
    stats.cards.find((c) => c.ref === activeRef) ||
    stats.dueCards[0] ||
    stats.cards[0] ||
    null;

  const handleAddVerse = (verse) => {
    const existing = memorizationCards?.[verse.ref];
    if (existing) {
      setActiveRef(verse.ref);
      setSubTab("train");
      return;
    }
    const fresh = createMemorizationCard(verse, Date.now());
    onUpdateMemorizationCard?.(verse.ref, fresh);
    setActiveRef(verse.ref);
    setSubTab("train");
    onToast?.(`🌱 « ${verse.ref} » ajouté à Mes Versets à Retenir.`);
  };

  const handleStepSuccess = (card, stageAttempted) => {
    const updated = recordMemorizationAttempt(card, true, Date.now());
    onUpdateMemorizationCard?.(card.ref, updated);
    playSfx("victory");
    onReward?.({ xp: stageAttempted >= 3 ? 20 : 12, pearls: updated.masteredDurably ? 2 : 0 });

    const elapsedHours = Math.round((Date.now() - (Number(card.createdAt) || Date.now())) / (3600 * 1000));
    setFeedback({
      ok: true,
      message: updated.masteredDurably
        ? `💎 Maîtrise durable confirmée (${updated.intervalDays}j d'intervalle) !`
        : elapsedHours < 24
          ? `✅ Étape validée ! Prochaine vérification différée dans ${updated.intervalDays} jour(s) (24h min. requises pour la maîtrise durable).`
          : `✅ Révision différée réussie ! Prochaine révision dans ${updated.intervalDays} jours.`
    });
    setFillInput("");
    setRecallInput("");
  };

  const handleStepFailure = (card, reason) => {
    const updated = recordMemorizationAttempt(card, false, Date.now());
    onUpdateMemorizationCard?.(card.ref, updated);
    playSfx("error");
    setFeedback({
      ok: false,
      message: `${reason} Le verset reviendra dès demain pour consolider ta mémoire sans pression.`
    });
  };

  const getMaskedKeywords = (texte) => {
    const words = String(texte || "").split(/\s+/).filter(Boolean);
    const keyIdx = Math.max(1, Math.floor(words.length / 2));
    return {
      expectedWord: words[keyIdx]?.replace(/[.,;:!?«»"]/g, "") || "",
      preview: words.map((w, i) => (i === keyIdx ? "[ ______ ]" : w)).join(" ")
    };
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card v2-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="pill">🌱 Répétition Espacée 4 Étapes</span>
            <h2 style={{ margin: "6px 0 0" }}>Je retiens la Parole — Mes Versets</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fermer">✕</button>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 16px" }}>
          <button className={`btn small ${subTab === "dashboard" ? "primary" : "secondary"}`} onClick={() => setSubTab("dashboard")}>
            📊 Tableau de bord ({stats.discoveredCount})
          </button>
          <button className={`btn small ${subTab === "train" ? "primary" : "secondary"}`} onClick={() => setSubTab("train")}>
            🧠 S'entraîner ({stats.dueCount} dûs)
          </button>
          <button className={`btn small ${subTab === "catalog" ? "primary" : "secondary"}`} onClick={() => setSubTab("catalog")}>
            📚 Ajouter un verset LSG 1910
          </button>
        </div>

        {subTab === "dashboard" && (
          <div>
            <div className="v2-kpi-grid">
              <div className="card v2-kpi-box">
                <div className="v2-kpi-val">{stats.discoveredCount}</div>
                <div className="v2-kpi-label">Versets découverts</div>
              </div>
              <div className="card v2-kpi-box">
                <div className="v2-kpi-val">{stats.dueCount}</div>
                <div className="v2-kpi-label">À réviser aujourd'hui</div>
              </div>
              <div className="card v2-kpi-box">
                <div className="v2-kpi-val">{stats.masteredCount}</div>
                <div className="v2-kpi-label">Maîtrisés durablement</div>
              </div>
              <div className="card v2-kpi-box">
                <div className="v2-kpi-val">{stats.successRate}%</div>
                <div className="v2-kpi-label">Taux de réussite</div>
              </div>
            </div>

            <div className="callout" style={{ marginTop: 14 }}>
              <strong>Évaluations différées validées :</strong> 24h ({stats.evaluations24h}) · 7 jours ({stats.evaluations7d}) · 30 jours ({stats.evaluations30d})
              <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
                Règle pédagogique : une bonne réponse le jour même fait progresser la carte, mais la maîtrise durable exige une vérification différée réelle (≥ 24h, 7j, 30j).
              </p>
            </div>

            {stats.cards.length === 0 ? (
              <div className="card" style={{ padding: 18, marginTop: 14, textAlign: "center" }}>
                <p>Ton jardin de versets est encore vierge. Choisis un premier verset Louis Segond 1910 à cultiver !</p>
                <button className="btn primary" onClick={() => setSubTab("catalog")}>Choisir mon premier verset</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8, marginTop: 14 }}>
                {stats.cards.map((card) => {
                  const stageMeta = MEMORIZATION_STAGES.find((s) => s.id === card.stage) || MEMORIZATION_STAGES[0];
                  const isDue = !card.nextReviewAt || card.nextReviewAt <= Date.now();
                  return (
                    <div key={card.ref} className="card" style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <strong>{card.ref}</strong>
                          <span className="pill">Étape {stageMeta.id}/4 : {stageMeta.label}</span>
                          {card.masteredDurably && <span className="badge">💎 Maîtrisé</span>}
                          {isDue && <span className="badge" style={{ background: "#fef3c7", color: "#92400e" }}>À réviser</span>}
                        </div>
                        <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>« {card.texte} »</p>
                      </div>
                      <button
                        className="btn small secondary"
                        onClick={() => {
                          setActiveRef(card.ref);
                          setFeedback(null);
                          setSubTab("train");
                        }}
                      >
                        Travailler →
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {subTab === "train" && (
          <div>
            {!selectedCard ? (
              <div className="card" style={{ padding: 18, textAlign: "center" }}>
                <p>Aucun verset sélectionné. Ajoute un verset depuis le catalogue !</p>
                <button className="btn primary" onClick={() => setSubTab("catalog")}>Ouvrir le catalogue</button>
              </div>
            ) : (
              <div className="card" style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span className="pill">Étape {selectedCard.stage}/4 — {MEMORIZATION_STAGES[(selectedCard.stage || 1) - 1]?.label}</span>
                    <h3 style={{ margin: "6px 0 4px" }}>{selectedCard.ref}</h3>
                  </div>
                  <button className="btn secondary small" onClick={() => speakFrench(`${selectedCard.ref}. ${selectedCard.texte}`)}>
                    🔊 Écouter
                  </button>
                </div>

                {selectedCard.stage === 1 && (
                  <div style={{ marginTop: 10 }}>
                    <div className="callout">« {selectedCard.texte} »</div>
                    {selectedCard.explication && <p className="muted" style={{ fontSize: 13 }}>💡 {selectedCard.explication}</p>}
                    <button className="btn primary" style={{ marginTop: 10 }} onClick={() => handleStepSuccess(selectedCard, 1)}>
                      J'ai lu et compris — Passer à l'entraînement →
                    </button>
                  </div>
                )}

                {selectedCard.stage === 2 && (() => {
                  const masked = getMaskedKeywords(selectedCard.texte);
                  return (
                    <div style={{ marginTop: 10 }}>
                      <p className="muted">Étape 2 — Complète le mot manquant :</p>
                      <div className="callout">{masked.preview}</div>
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        <input
                          className="v2-text-input"
                          placeholder="Mot manquant..."
                          value={fillInput}
                          onChange={(e) => setFillInput(e.target.value)}
                        />
                        <button
                          className="btn primary"
                          onClick={() => {
                            const check = evaluateVerseRecall(masked.expectedWord, fillInput);
                            if (check.passed) {
                              handleStepSuccess(selectedCard, 2);
                            } else {
                              handleStepFailure(selectedCard, `Le mot attendu était « ${masked.expectedWord} ».`);
                            }
                          }}
                        >
                          Vérifier
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {(selectedCard.stage === 3 || selectedCard.stage >= 4) && (
                  <div style={{ marginTop: 10 }}>
                    <p className="muted">
                      {selectedCard.stage === 3
                        ? "Étape 3 — Rappel actif avec initiales :"
                        : "Étape 4 — Vérification sans indice de maîtrise :"}
                    </p>
                    {selectedCard.stage === 3 && (
                      <div className="callout" style={{ fontFamily: "monospace", letterSpacing: "0.03em" }}>
                        {buildInitialsPrompt(selectedCard.texte)}
                      </div>
                    )}
                    <textarea
                      rows={3}
                      className="v2-textarea"
                      style={{ marginTop: 10 }}
                      placeholder={`Écris de mémoire le texte de ${selectedCard.ref}...`}
                      value={recallInput}
                      onChange={(e) => setRecallInput(e.target.value)}
                    />
                    <button
                      className="btn primary"
                      style={{ marginTop: 10 }}
                      onClick={() => {
                        const evalRes = evaluateVerseRecall(selectedCard.texte, recallInput);
                        if (evalRes.passed) {
                          handleStepSuccess(selectedCard, selectedCard.stage);
                        } else {
                          handleStepFailure(selectedCard, `Correspondance : ${Math.round(evalRes.score * 100)}%.`);
                        }
                      }}
                    >
                      Valider mon rappel
                    </button>
                  </div>
                )}

                {feedback && (
                  <div className={`callout ${feedback.ok ? "success" : "danger"}`} style={{ marginTop: 14 }}>
                    <strong>{feedback.message}</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {subTab === "catalog" && (
          <div style={{ display: "grid", gap: 8, maxHeight: "55vh", overflowY: "auto" }}>
            {MYSTERY_VERSES_POOL.map((v) => {
              const already = Boolean(memorizationCards?.[v.ref]);
              return (
                <div key={v.id} className="card" style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 220 }}>
                    <strong>{v.ref}</strong> <span className="pill">{v.livre}</span>
                    <p className="muted" style={{ margin: "4px 0 0", fontSize: 13 }}>« {v.texte} »</p>
                  </div>
                  <button className={`btn small ${already ? "secondary" : "primary"}`} onClick={() => handleAddVerse(v)}>
                    {already ? "Travailler" : "+ Cultiver"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

