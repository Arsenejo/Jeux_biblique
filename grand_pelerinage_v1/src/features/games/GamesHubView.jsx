import React, { useState, useMemo } from "react";
import {
  MYSTERY_VERSES_POOL,
  BIBLE_WHO_AM_I_CHARACTERS,
  BIBLE_CHRONOLOGY_LEVELS,
  WORD_PAIRS_CATEGORIES,
  TREASURE_RIDDLE_ADVENTURES,
  LISTEN_AND_RECOGNIZE_ITEMS,
  CHARACTER_JOURNEYS_DATA
} from "../../data/bibleGamesData.js";
import {
  MYSTERY_VERSE_MODES,
  buildMysteryVerseChallenge,
  evaluateMysteryVerseAnswer,
  getWhoAmIChallenge,
  scoreWhoAmI,
  buildChronologyRound,
  evaluateChronologyOrder,
  buildWordPairsRound,
  getTreasureAdventure,
  evaluateTreasureStep,
  getListenAndRecognizeItem,
  getTodayDateKey,
  getDailyChallenge,
  generateDuelCode,
  createAsyncDuelSession,
  encodeDuelInvitePayload,
  decodeDuelInvitePayload,
  compareDuelResults,
  getCharacterJourney
} from "../../services/gamesEngine.js";
import { speakFrench, playSfx } from "../../services/audioSpeech.js";

const GAMES_CATALOG = [
  { id: "daily", titre: "Le Défi du Jour", icone: "☀️", badge: "Quotidien", resume: "5 questions variées renouvelées chaque jour pour toute l'église." },
  { id: "mystery", titre: "Le Verset Mystère", icone: "✨", badge: "6 modes", resume: "Mots manquants, ordre, indices, référence, reconstruction et définition." },
  { id: "whoami", titre: "Qui suis-je ?", icone: "🕵️", badge: `${BIBLE_WHO_AM_I_CHARACTERS.length} figures`, resume: "3 indices progressifs pour reconnaître les personnages bibliques." },
  { id: "chrono", titre: "Chronologie Biblique", icone: "⏳", badge: `${BIBLE_CHRONOLOGY_LEVELS.length} séries`, resume: "Replace les grands événements bibliques dans l'ordre exact." },
  { id: "pairs", titre: "Les Paires de la Parole", icone: "🔗", badge: `${WORD_PAIRS_CATEGORIES.length} thèmes`, resume: "Relie personnages, versets, paraboles, miracles et épîtres." },
  { id: "treasure", titre: "L'Énigme du Trésor", icone: "🗝️", badge: `${TREASURE_RIDDLE_ADVENTURES.length} quêtes`, resume: "Enchaîne 3 énigmes pour recueillir les indices et ouvrir le coffre." },
  { id: "listen", titre: "Écoute et Reconnais", icone: "🔊", badge: "Audio & Texte", resume: "Écoute un passage Louis Segond 1910 et identifie la référence." },
  { id: "duel", titre: "Duel Biblique Asynchrone", icone: "🤝", badge: "Code 6 car.", resume: "Partage un code de 5 questions identiques avec un ami ou ta famille." },
  { id: "characters", titre: "Parcours des Personnages", icone: "🧭", badge: `${CHARACTER_JOURNEYS_DATA.length} portraits`, resume: "Histoire, épreuves, versets clés et quiz sur 10 grandes figures." }
];

export default function GamesHubView({
  pelerinName = "Pèlerin",
  pedagogicalProfile = "explorateur",
  dailyChallengeHistory = {},
  gameStats = {},
  onReward,
  onDailyCompleted,
  onAnchorVerse,
  onOpenArena,
  onOpen66Books,
  onToast
}) {
  const [activeGame, setActiveGame] = useState("hub");
  const todayKey = getTodayDateKey();
  const dailyDoneToday = Boolean(dailyChallengeHistory?.[todayKey]);

  // 1. Verset Mystère state
  const [mvIndex, setMvIndex] = useState(0);
  const [mvMode, setMvMode] = useState("missing_words");
  const [mvBlankInputs, setMvBlankInputs] = useState({});
  const [mvOrderedWords, setMvOrderedWords] = useState([]);
  const [mvSelectedOption, setMvSelectedOption] = useState("");
  const [mvTextInput, setMvTextInput] = useState("");
  const [mvShowHint, setMvShowHint] = useState(false);
  const [mvResult, setMvResult] = useState(null);

  const mvChallenge = useMemo(
    () => buildMysteryVerseChallenge(mvIndex, mvMode, `mv-${mvIndex}-${mvMode}`),
    [mvIndex, mvMode]
  );

  // 2. Qui suis-je state
  const [waiIndex, setWaiIndex] = useState(0);
  const [waiCluesRevealed, setWaiCluesRevealed] = useState(1);
  const [waiResult, setWaiResult] = useState(null);
  const waiChallenge = useMemo(() => getWhoAmIChallenge(waiIndex), [waiIndex]);

  // 3. Chronologie state
  const [chronoLevelIdx, setChronoLevelIdx] = useState(0);
  const chronoRound = useMemo(() => buildChronologyRound(chronoLevelIdx, "v2"), [chronoLevelIdx]);
  const [chronoOrderIds, setChronoOrderIds] = useState(() => chronoRound.shuffledEvents.map((e) => e.id));
  const [chronoResult, setChronoResult] = useState(null);

  // 4. Paires state
  const [pairsCatIdx, setPairsCatIdx] = useState(0);
  const pairsRound = useMemo(() => buildWordPairsRound(pairsCatIdx, "v2"), [pairsCatIdx]);
  const [selectedLeftId, setSelectedLeftId] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [pairFeedback, setPairFeedback] = useState("");

  // 5. Énigme du Trésor state
  const [advIdx, setAdvIdx] = useState(0);
  const [advStepIdx, setAdvStepIdx] = useState(0);
  const [advClues, setAdvClues] = useState([]);
  const [advCompleted, setAdvCompleted] = useState(false);
  const [advFeedback, setAdvFeedback] = useState("");
  const currentAdventure = useMemo(() => getTreasureAdventure(advIdx), [advIdx]);

  // 6. Écoute et Reconnais state
  const [listenIdx, setListenIdx] = useState(0);
  const [listenTranscriptVisible, setListenTranscriptVisible] = useState(false);
  const [listenResult, setListenResult] = useState(null);
  const listenItem = useMemo(() => getListenAndRecognizeItem(listenIdx), [listenIdx]);

  // 7. Défi du Jour state
  const dailyData = useMemo(() => getDailyChallenge(todayKey), [todayKey]);
  const [dailyQIdx, setDailyQIdx] = useState(0);
  const [dailyScore, setDailyScore] = useState(0);
  const [dailySelectedOpt, setDailySelectedOpt] = useState(null);
  const [dailyFinished, setDailyFinished] = useState(false);

  // 8. Duel Asynchrone state
  const [duelCode, setDuelCode] = useState(() => generateDuelCode(todayKey));
  const [duelSession, setDuelSession] = useState(null);
  const [duelQIdx, setDuelQIdx] = useState(0);
  const [duelScore, setDuelScore] = useState(0);
  const [duelSelectedOpt, setDuelSelectedOpt] = useState(null);
  const [duelFinished, setDuelFinished] = useState(false);
  const [duelInviteInput, setDuelInviteInput] = useState("");
  const [duelLoadedChallenge, setDuelLoadedChallenge] = useState(null);

  // 9. Parcours Personnages state
  const [charIdx, setCharIdx] = useState(0);
  const [charQuizIdx, setCharQuizIdx] = useState(0);
  const [charFeedback, setCharFeedback] = useState("");
  const currentCharacter = useMemo(() => getCharacterJourney(charIdx), [charIdx]);

  const resetMysteryRound = (nextIdx = mvIndex, nextMode = mvMode) => {
    setMvIndex(nextIdx);
    setMvMode(nextMode);
    setMvBlankInputs({});
    setMvOrderedWords([]);
    setMvSelectedOption("");
    setMvTextInput("");
    setMvShowHint(false);
    setMvResult(null);
  };

  const handleValidateMystery = () => {
    let answerPayload = mvSelectedOption;
    if (mvMode === "missing_words") {
      answerPayload = mvChallenge.blanks.map((_, i) => mvBlankInputs[i] || "");
    } else if (mvMode === "order_words") {
      answerPayload = mvOrderedWords;
    } else if (mvMode === "reconstruct_no_model") {
      answerPayload = mvTextInput;
    }
    const res = evaluateMysteryVerseAnswer(mvChallenge, answerPayload);
    setMvResult(res);
    if (res.valid) {
      playSfx("victory");
      onReward?.({ gameId: "mystery", xp: res.xp, pearls: res.pearls, stars: res.stars });
    } else {
      playSfx("error");
    }
  };

  const handleWhoAmIAnswer = (optionName) => {
    if (waiResult) return;
    const isCorrect = optionName === waiChallenge.reponse;
    if (isCorrect) {
      const s = scoreWhoAmI(waiCluesRevealed, pedagogicalProfile);
      setWaiResult({ ok: true, ...s, chosen: optionName });
      playSfx("victory");
      onReward?.({ gameId: "whoami", xp: s.xp, pearls: s.pearls, stars: s.stars, characterId: waiChallenge.id });
    } else {
      setWaiResult({ ok: false, xp: 0, pearls: 0, stars: 0, chosen: optionName });
      playSfx("error");
    }
  };

  const selectChronoLevel = (idx) => {
    const round = buildChronologyRound(idx, "v2");
    setChronoLevelIdx(idx);
    setChronoOrderIds(round.shuffledEvents.map((e) => e.id));
    setChronoResult(null);
  };

  const moveChronoItem = (index, direction) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= chronoOrderIds.length) return;
    const copy = [...chronoOrderIds];
    [copy[index], copy[nextIdx]] = [copy[nextIdx], copy[index]];
    setChronoOrderIds(copy);
    setChronoResult(null);
  };

  const handlePairRightClick = (rightItem) => {
    if (!selectedLeftId || matchedIds.includes(rightItem.id)) return;
    if (selectedLeftId === rightItem.id) {
      const nextMatched = [...matchedIds, rightItem.id];
      setMatchedIds(nextMatched);
      setSelectedLeftId(null);
      setPairFeedback("✅ Paire correcte !");
      playSfx("tap");
      if (nextMatched.length === pairsRound.pairs.length) {
        playSfx("victory");
        onReward?.({ gameId: "pairs", xp: 25, pearls: 2, stars: 3 });
        setPairFeedback("🏆 Toutes les paires ont été associées !");
      }
    } else {
      playSfx("error");
      setPairFeedback("❌ Ce n'est pas la bonne correspondance, essaie encore.");
      setSelectedLeftId(null);
    }
  };

  const handleTreasureChoice = (optIdx) => {
    if (advCompleted) return;
    const res = evaluateTreasureStep(currentAdventure, advStepIdx, optIdx);
    if (res.valid) {
      playSfx("tap");
      setAdvClues((prev) => [...prev, res.clueUnlocked]);
      if (res.completed) {
        setAdvCompleted(true);
        setAdvFeedback(`🏆 Trésor ouvert : ${currentAdventure.recompense.coffreNom} !`);
        playSfx("victory");
        onReward?.({
          gameId: "treasure",
          xp: currentAdventure.recompense.xp,
          pearls: currentAdventure.recompense.pearls,
          stars: 3
        });
      } else {
        setAdvStepIdx((s) => s + 1);
        setAdvFeedback(`🗝️ Indice débloqué : « ${res.clueUnlocked} » ! Passe à l'énigme suivante.`);
      }
    } else {
      playSfx("error");
      setAdvFeedback("❌ Mauvaise piste. Lis l'indice biblique ci-dessous !");
    }
  };

  const startDuelSession = (codeToUse, importedChallenge = null) => {
    const session = createAsyncDuelSession(
      codeToUse,
      importedChallenge?.name || pelerinName,
      importedChallenge ? importedChallenge.score : null
    );
    setDuelCode(session.code);
    setDuelSession(session);
    setDuelLoadedChallenge(importedChallenge);
    setDuelQIdx(0);
    setDuelScore(0);
    setDuelSelectedOpt(null);
    setDuelFinished(false);
  };

  if (activeGame === "hub") {
    return (
      <div className="v2-games-hub fade-in">
        <div className="card v2-hero-banner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
            <div>
              <span className="pill">🎮 9 Jeux Bibliques V2.0 + Arène & 66 Livres</span>
              <h2 style={{ marginTop: 8, marginBottom: 6 }}>Espace Jeux Bibliques</h2>
              <p className="muted" style={{ margin: 0 }}>
                Découvrir, comprendre, mémoriser, pratiquer et partager la Parole (Louis Segond 1910).
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn secondary" onClick={onOpenArena}>⚔️ Arène Infinie</button>
              <button className="btn secondary" onClick={onOpen66Books}>📚 Défi 66 Livres</button>
            </div>
          </div>
        </div>

        <div className="v2-games-grid">
          {GAMES_CATALOG.map((g) => (
            <div key={g.id} className="card v2-game-card">
              <div className="v2-game-card-top">
                <span className="v2-game-emoji">{g.icone}</span>
                <span className="badge">{g.id === "daily" && dailyDoneToday ? "✅ Fait aujourd'hui" : g.badge}</span>
              </div>
              <h3 style={{ margin: "10px 0 6px" }}>{g.titre}</h3>
              <p className="muted" style={{ fontSize: 13, minHeight: 40 }}>{g.resume}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                <span style={{ fontSize: 12, color: "var(--muted)" }}>
                  Parties : {gameStats?.[g.id] || 0}
                </span>
                <button
                  className="btn primary small"
                  onClick={() => {
                    setActiveGame(g.id);
                    if (g.id === "chrono") selectChronoLevel(chronoLevelIdx);
                  }}
                >
                  Jouer →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card v2-game-stage fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <button className="btn secondary small" onClick={() => setActiveGame("hub")}>
          ← Tous les jeux
        </button>
        <span className="badge">
          {GAMES_CATALOG.find((g) => g.id === activeGame)?.icone}{" "}
          {GAMES_CATALOG.find((g) => g.id === activeGame)?.titre}
        </span>
      </div>

      {/* JEU 1 : VERSET MYSTÈRE */}
      {activeGame === "mystery" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {MYSTERY_VERSE_MODES.map((m) => (
              <button
                key={m.id}
                className={`btn small ${mvMode === m.id ? "primary" : "secondary"}`}
                onClick={() => resetMysteryRound(mvIndex, m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="callout" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
              <strong>Verset #{mvIndex + 1} / {MYSTERY_VERSES_POOL.length} — {mvChallenge.verse.livre}</strong>
              <div style={{ display: "flex", gap: 6 }}>
                <button className="btn secondary small" onClick={() => speakFrench(mvChallenge.verse.texte)}>
                  🔊 Écouter
                </button>
                <button className="btn secondary small" onClick={() => setMvShowHint((v) => !v)}>
                  💡 {mvShowHint ? "Masquer l'indice" : "Indice"}
                </button>
              </div>
            </div>
            {mvShowHint && <p style={{ marginTop: 8, marginBottom: 0, fontSize: 13 }}>💡 {mvChallenge.verse.indice}</p>}
          </div>

          {mvMode === "missing_words" && (
            <div>
              <p className="muted">Complète les mots manquants du verset ({mvChallenge.verse.ref}) :</p>
              <div className="v2-verse-fill-box">
                {mvChallenge.maskedParts.map((part, i) =>
                  part.isBlank ? (
                    <input
                      key={i}
                      type="text"
                      className="v2-blank-input"
                      placeholder="..."
                      value={mvBlankInputs[mvChallenge.blanks.findIndex((b) => b.idx === part.idx)] || ""}
                      onChange={(e) => {
                        const bIdx = mvChallenge.blanks.findIndex((b) => b.idx === part.idx);
                        setMvBlankInputs((prev) => ({ ...prev, [bIdx]: e.target.value }));
                      }}
                    />
                  ) : (
                    <span key={i}>{part.text} </span>
                  )
                )}
              </div>
            </div>
          )}

          {mvMode === "order_words" && (
            <div>
              <p className="muted">Clique sur les mots dans le bon ordre pour reconstruire le verset ({mvChallenge.verse.ref}) :</p>
              <div className="v2-word-bank" style={{ minHeight: 54, padding: 10, border: "2px dashed var(--border)", borderRadius: 12, marginBottom: 10 }}>
                {mvOrderedWords.map((w, idx) => (
                  <button
                    key={`${w}-${idx}`}
                    className="btn small primary"
                    onClick={() => setMvOrderedWords((prev) => prev.filter((_, i) => i !== idx))}
                  >
                    {w}
                  </button>
                ))}
              </div>
              <div className="v2-word-bank">
                {mvChallenge.tokensShuffled.map((w, idx) => {
                  const usedCount = mvOrderedWords.filter((x) => x === w).length;
                  const totalCount = mvChallenge.tokensShuffled.filter((x) => x === w).length;
                  const disabled = usedCount >= totalCount;
                  return (
                    <button
                      key={`${w}-${idx}`}
                      className="btn small secondary"
                      disabled={disabled}
                      onClick={() => setMvOrderedWords((prev) => [...prev, w])}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {(mvMode === "find_reference" || mvMode === "from_clues") && (
            <div>
              <p style={{ fontSize: 16, fontWeight: 600 }}>
                {mvMode === "from_clues"
                  ? `Indice : « ${mvChallenge.verse.indice} » — Quel est ce verset ?`
                  : `« ${mvChallenge.verse.texte} » — Quelle est sa référence exacte ?`}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {mvChallenge.options.map((opt) => (
                  <button
                    key={opt.ref}
                    className={`option-btn ${mvSelectedOption === opt.ref ? "selected" : ""}`}
                    onClick={() => setMvSelectedOption(opt.ref)}
                  >
                    <strong>{opt.ref}</strong>
                    {mvMode === "from_clues" && <div style={{ fontSize: 13, marginTop: 4 }}>{opt.texte}</div>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mvMode === "reconstruct_no_model" && (
            <div>
              <p className="muted">Saisis de mémoire le verset complet de <strong>{mvChallenge.verse.ref}</strong> (tolérance sur la ponctuation et les accents) :</p>
              <textarea
                rows={3}
                className="v2-textarea"
                placeholder="Écris le verset ici..."
                value={mvTextInput}
                onChange={(e) => setMvTextInput(e.target.value)}
              />
            </div>
          )}

          {mvMode === "definition_word" && (
            <div>
              <p className="muted">Quel mot clé de <strong>{mvChallenge.verse.ref}</strong> correspond à cette définition ?</p>
              <div className="callout" style={{ marginBottom: 12 }}>📖 {mvChallenge.definition}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {mvChallenge.options.map((w) => (
                  <button
                    key={w}
                    className={`btn ${mvSelectedOption === w ? "primary" : "secondary"}`}
                    onClick={() => setMvSelectedOption(w)}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
            <button className="btn primary" onClick={handleValidateMystery}>Valider ma réponse</button>
            <button className="btn secondary" onClick={() => resetMysteryRound((mvIndex + 1) % MYSTERY_VERSES_POOL.length, mvMode)}>
              Verset suivant →
            </button>
            <button
              className="btn secondary"
              onClick={() => {
                onAnchorVerse?.(mvChallenge.verse.ref, mvChallenge.verse.texte, mvChallenge.verse.livre);
                onToast?.(`🌱 « ${mvChallenge.verse.ref} » ajouté à Mes Versets à Retenir !`);
              }}
            >
              🌱 Retenir ce verset
            </button>
          </div>

          {mvResult && (
            <div className={`callout ${mvResult.valid ? "success" : "danger"}`} style={{ marginTop: 14 }}>
              <strong>{mvResult.valid ? `🎉 Bravo ! +${mvResult.xp} XP · +${mvResult.pearls} 💎` : "Pas encore exact !"}</strong>
              <p style={{ margin: "6px 0 0" }}>
                <strong>{mvChallenge.verse.ref} :</strong> « {mvChallenge.verse.texte} » — {mvChallenge.verse.explication}
              </p>
            </div>
          )}
        </div>
      )}

      {/* JEU 2 : QUI SUIS-JE ? */}
      {activeGame === "whoami" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong>Personnage #{waiIndex + 1} / {BIBLE_WHO_AM_I_CHARACTERS.length}</strong>
            <span className="badge">Indices utilisés : {waiCluesRevealed} / 3</span>
          </div>
          <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
            {waiChallenge.indices.slice(0, waiCluesRevealed).map((ind, idx) => (
              <div key={idx} className="callout">
                <strong>Indice {idx + 1} :</strong> {ind}
              </div>
            ))}
          </div>
          {waiCluesRevealed < 3 && !waiResult && (
            <button className="btn secondary small" style={{ marginBottom: 14 }} onClick={() => setWaiCluesRevealed((c) => c + 1)}>
              💡 Révéler un indice supplémentaire
            </button>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
            {waiChallenge.shuffledOptions.map((opt) => (
              <button
                key={opt}
                className={`option-btn ${waiResult?.chosen === opt ? (waiResult.ok ? "correct" : "wrong") : ""}`}
                disabled={Boolean(waiResult)}
                onClick={() => handleWhoAmIAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          {waiResult && (
            <div className={`callout ${waiResult.ok ? "success" : "danger"}`} style={{ marginTop: 14 }}>
              <strong>{waiResult.ok ? `🎉 C'est bien ${waiChallenge.reponse} ! +${waiResult.xp} XP (${waiResult.stars}★)` : `C'était ${waiChallenge.reponse}.`}</strong>
              <p style={{ margin: "6px 0 0" }}>📖 {waiChallenge.ref} — {waiChallenge.explication}</p>
            </div>
          )}
          <div style={{ marginTop: 14 }}>
            <button
              className="btn primary small"
              onClick={() => {
                setWaiIndex((i) => (i + 1) % BIBLE_WHO_AM_I_CHARACTERS.length);
                setWaiCluesRevealed(1);
                setWaiResult(null);
              }}
            >
              Personnage suivant →
            </button>
          </div>
        </div>
      )}

      {/* JEU 3 : CHRONOLOGIE BIBLIQUE */}
      {activeGame === "chrono" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {BIBLE_CHRONOLOGY_LEVELS.map((lvl, idx) => (
              <button key={lvl.id} className={`btn small ${chronoLevelIdx === idx ? "primary" : "secondary"}`} onClick={() => selectChronoLevel(idx)}>
                {idx + 1}. {lvl.titre}
              </button>
            ))}
          </div>
          <p className="muted">Ordonne du plus ancien (1) au plus récent ({chronoRound.events.length}) :</p>
          <div style={{ display: "grid", gap: 8 }}>
            {chronoOrderIds.map((id, idx) => {
              const ev = chronoRound.events.find((e) => e.id === id);
              const expectedId = chronoRound.events[idx]?.id;
              const isWellPlaced = chronoResult && expectedId === id;
              return (
                <div key={id} className="card" style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, borderColor: chronoResult ? (isWellPlaced ? "#10b981" : "#ef4444") : undefined }}>
                  <div>
                    <span className="badge" style={{ marginRight: 8 }}>#{idx + 1}</span>
                    <strong>{ev?.label}</strong>
                    {chronoResult && <span className="muted" style={{ marginLeft: 8, fontSize: 12 }}>({ev?.ref})</span>}
                  </div>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn secondary small" disabled={idx === 0} onClick={() => moveChronoItem(idx, -1)}>↑</button>
                    <button className="btn secondary small" disabled={idx === chronoOrderIds.length - 1} onClick={() => moveChronoItem(idx, 1)}>↓</button>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            <button
              className="btn primary"
              onClick={() => {
                const res = evaluateChronologyOrder(chronoRound, chronoOrderIds);
                setChronoResult(res);
                if (res.valid) {
                  playSfx("victory");
                  onReward?.({ gameId: "chrono", xp: res.xp, pearls: res.pearls, stars: res.stars });
                } else {
                  playSfx("error");
                }
              }}
            >
              Vérifier l'ordre
            </button>
          </div>
          {chronoResult && (
            <div className={`callout ${chronoResult.valid ? "success" : "danger"}`} style={{ marginTop: 12 }}>
              <strong>
                {chronoResult.valid
                  ? `🎉 Chronologie parfaite ! +${chronoResult.xp} XP · +${chronoResult.pearls} 💎`
                  : `${chronoResult.correctPositions} / ${chronoResult.total} événements bien placés.`}
              </strong>
              <p style={{ margin: "6px 0 0" }}>{chronoRound.explication}</p>
            </div>
          )}
        </div>
      )}

      {/* JEU 4 : PAIRES DE LA PAROLE */}
      {activeGame === "pairs" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {WORD_PAIRS_CATEGORIES.map((c, idx) => (
              <button
                key={c.id}
                className={`btn small ${pairsCatIdx === idx ? "primary" : "secondary"}`}
                onClick={() => {
                  setPairsCatIdx(idx);
                  setSelectedLeftId(null);
                  setMatchedIds([]);
                  setPairFeedback("");
                }}
              >
                {c.titre}
              </button>
            ))}
          </div>
          <p className="muted">{pairsRound.description}</p>
          <div className="v2-pairs-columns">
            <div style={{ display: "grid", gap: 8 }}>
              {pairsRound.leftItems.map((left) => {
                const done = matchedIds.includes(left.id);
                return (
                  <button
                    key={left.id}
                    disabled={done}
                    className={`option-btn ${done ? "correct" : selectedLeftId === left.id ? "selected" : ""}`}
                    onClick={() => setSelectedLeftId(left.id)}
                  >
                    {done ? "✅ " : ""}{left.text}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {pairsRound.rightItems.map((right) => {
                const done = matchedIds.includes(right.id);
                return (
                  <button
                    key={right.id}
                    disabled={done}
                    className={`option-btn ${done ? "correct" : ""}`}
                    onClick={() => handlePairRightClick(right)}
                  >
                    {done ? "✅ " : ""}{right.text}
                  </button>
                );
              })}
            </div>
          </div>
          {pairFeedback && (
            <div className="callout" style={{ marginTop: 12 }}>
              <strong>{pairFeedback}</strong>
              {matchedIds.length === pairsRound.pairs.length && <p style={{ margin: "6px 0 0" }}>{pairsRound.explication}</p>}
            </div>
          )}
        </div>
      )}

      {/* JEU 5 : ÉNIGME DU TRÉSOR */}
      {activeGame === "treasure" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            {TREASURE_RIDDLE_ADVENTURES.map((a, idx) => (
              <button
                key={a.id}
                className={`btn small ${advIdx === idx ? "primary" : "secondary"}`}
                onClick={() => {
                  setAdvIdx(idx);
                  setAdvStepIdx(0);
                  setAdvClues([]);
                  setAdvCompleted(false);
                  setAdvFeedback("");
                }}
              >
                🗝️ {a.titre}
              </button>
            ))}
          </div>
          <div className="callout" style={{ marginBottom: 12 }}>
            <strong>{currentAdventure.titre}</strong> — <span>{currentAdventure.sousTitre}</span>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>{currentAdventure.intro}</p>
            {advClues.length > 0 && (
              <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {advClues.map((c, i) => <span key={i} className="pill">🗝️ {c}</span>)}
              </div>
            )}
          </div>
          {!advCompleted ? (
            <div>
              <h4>Énigme {advStepIdx + 1} / {currentAdventure.enigmes.length}</h4>
              <p style={{ fontWeight: 600 }}>{currentAdventure.enigmes[advStepIdx].question}</p>
              <p className="muted" style={{ fontSize: 12 }}>💡 {currentAdventure.enigmes[advStepIdx].indice}</p>
              <div style={{ display: "grid", gap: 8 }}>
                {currentAdventure.enigmes[advStepIdx].options.map((opt, oIdx) => (
                  <button key={oIdx} className="option-btn" onClick={() => handleTreasureChoice(oIdx)}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="callout success">
              <strong>🎁 Trésor ouvert : {currentAdventure.recompense.coffreNom} (+{currentAdventure.recompense.xp} XP · +{currentAdventure.recompense.pearls} 💎)</strong>
              <p style={{ margin: "6px 0 0" }}>{currentAdventure.explicationFinale}</p>
            </div>
          )}
          {advFeedback && !advCompleted && <p style={{ marginTop: 10, fontSize: 13 }}>{advFeedback}</p>}
        </div>
      )}

      {/* JEU 6 : ÉCOUTE ET RECONNAIS */}
      {activeGame === "listen" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <strong>Extrait #{listenIdx + 1} / {LISTEN_AND_RECOGNIZE_ITEMS.length} — {listenItem.categorie}</strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn primary small" onClick={() => speakFrench(listenItem.audioText)}>
                🔊 Écouter l'extrait
              </button>
              <button className="btn secondary small" onClick={() => setListenTranscriptVisible((v) => !v)}>
                📄 {listenTranscriptVisible ? "Masquer texte" : "Afficher le texte"}
              </button>
            </div>
          </div>
          {listenTranscriptVisible && (
            <div className="callout" style={{ marginBottom: 12 }}>« {listenItem.audioText} »</div>
          )}
          <p style={{ fontWeight: 600 }}>{listenItem.question}</p>
          <div style={{ display: "grid", gap: 8 }}>
            {listenItem.shuffledOptions.map((opt) => (
              <button
                key={opt.label}
                disabled={Boolean(listenResult)}
                className={`option-btn ${listenResult?.label === opt.label ? (opt.isCorrect ? "correct" : "wrong") : ""}`}
                onClick={() => {
                  setListenResult(opt);
                  if (opt.isCorrect) {
                    playSfx("victory");
                    onReward?.({ gameId: "listen", xp: 20, pearls: 1, stars: 3 });
                  } else {
                    playSfx("error");
                  }
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {listenResult && (
            <div className={`callout ${listenResult.isCorrect ? "success" : "danger"}`} style={{ marginTop: 12 }}>
              <strong>{listenResult.isCorrect ? "🎉 Bien entendu et reconnu ! +20 XP" : `Réponse attendue : ${listenItem.ref}`}</strong>
              <p style={{ margin: "6px 0 0" }}>« {listenItem.audioText} » — {listenItem.explication}</p>
            </div>
          )}
          <button
            className="btn secondary small"
            style={{ marginTop: 12 }}
            onClick={() => {
              setListenIdx((i) => (i + 1) % LISTEN_AND_RECOGNIZE_ITEMS.length);
              setListenResult(null);
              setListenTranscriptVisible(false);
            }}
          >
            Extrait suivant →
          </button>
        </div>
      )}

      {/* JEU 7 : DÉFI DU JOUR */}
      {activeGame === "daily" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <strong>{dailyData.titre}</strong>
            <span className="badge">{dailyDoneToday ? "✅ Déjà validé" : `Question ${dailyQIdx + 1} / ${dailyData.questions.length}`}</span>
          </div>
          {dailyFinished ? (
            <div className="callout success">
              <h3>☀️ Défi du Jour terminé !</h3>
              <p>Score : <strong>{dailyScore} / {dailyData.questions.length}</strong></p>
              <p style={{ margin: 0 }}>Récompense du jour : +{dailyData.recompense.xp} XP · +{dailyData.recompense.perles} 💎</p>
            </div>
          ) : (
            <div>
              {(() => {
                const q = dailyData.questions[dailyQIdx];
                return (
                  <div>
                    <span className="pill" style={{ marginBottom: 8 }}>{q.categorie}</span>
                    {q.subtitle && <p className="muted" style={{ margin: "4px 0" }}>{q.subtitle}</p>}
                    <p style={{ fontWeight: 600 }}>{q.prompt}</p>
                    {q.audioHint && (
                      <button className="btn secondary small" style={{ marginBottom: 10 }} onClick={() => speakFrench(q.audioHint)}>
                        🔊 Écouter le passage
                      </button>
                    )}
                    <div style={{ display: "grid", gap: 8 }}>
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={dailySelectedOpt !== null}
                          className={`option-btn ${dailySelectedOpt === idx ? (opt.isCorrect ? "correct" : "wrong") : ""}`}
                          onClick={() => {
                            setDailySelectedOpt(idx);
                            if (opt.isCorrect) {
                              setDailyScore((s) => s + 1);
                              playSfx("tap");
                            } else {
                              playSfx("error");
                            }
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {dailySelectedOpt !== null && (
                      <div className="callout" style={{ marginTop: 12 }}>
                        <strong>📖 {q.ref}</strong> — {q.explication}
                        <div style={{ marginTop: 10 }}>
                          <button
                            className="btn primary small"
                            onClick={() => {
                              if (dailyQIdx + 1 < dailyData.questions.length) {
                                setDailyQIdx((i) => i + 1);
                                setDailySelectedOpt(null);
                              } else {
                                setDailyFinished(true);
                                playSfx("victory");
                                if (!dailyDoneToday) {
                                  onDailyCompleted?.({ dateKey: todayKey, score: dailyScore, total: dailyData.questions.length, recompense: dailyData.recompense });
                                }
                              }
                            }}
                          >
                            {dailyQIdx + 1 < dailyData.questions.length ? "Question suivante →" : "Terminer le Défi"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* JEU 8 : DUEL BIBLIQUE ASYNCHRONE */}
      {activeGame === "duel" && (
        <div>
          <div className="callout" style={{ marginBottom: 14 }}>
            <strong>🤝 Duel Biblique Asynchrone (sans faux temps réel)</strong>
            <p style={{ margin: "6px 0 0", fontSize: 13 }}>
              Génère un code à 6 caractères ou colle le jeton d'un ami pour affronter exactement les mêmes 5 questions et comparer vos scores.
            </p>
          </div>
          {!duelSession ? (
            <div style={{ display: "grid", gap: 14 }}>
              <div className="card" style={{ padding: 14 }}>
                <h4 style={{ marginTop: 0 }}>Lancer un nouveau duel</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input value={duelCode} onChange={(e) => setDuelCode(e.target.value.toUpperCase().slice(0, 6))} className="v2-text-input" style={{ maxWidth: 160 }} />
                  <button className="btn secondary small" onClick={() => setDuelCode(generateDuelCode(Date.now()))}>🎲 Nouveau code</button>
                  <button className="btn primary small" onClick={() => startDuelSession(duelCode, null)}>Commencer ce duel →</button>
                </div>
              </div>
              <div className="card" style={{ padding: 14 }}>
                <h4 style={{ marginTop: 0 }}>Relever un défi reçu par message</h4>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input
                    className="v2-text-input"
                    placeholder="Colle ici le jeton d'invitation reçu..."
                    value={duelInviteInput}
                    onChange={(e) => setDuelInviteInput(e.target.value)}
                    style={{ flex: 1, minWidth: 220 }}
                  />
                  <button
                    className="btn secondary small"
                    onClick={() => {
                      const decoded = decodeDuelInvitePayload(duelInviteInput);
                      if (!decoded) {
                        onToast?.("Jeton d'invitation invalide ou incomplet.");
                        return;
                      }
                      startDuelSession(decoded.code, decoded);
                    }}
                  >
                    Accepter le défi →
                  </button>
                </div>
              </div>
            </div>
          ) : duelFinished ? (
            <div className="callout success">
              <h3>🏁 Résultat du Duel ({duelSession.code})</h3>
              <p>Ton score : <strong>{duelScore} / {duelSession.questions.length}</strong></p>
              {duelLoadedChallenge && (
                <p><strong>{compareDuelResults(duelLoadedChallenge.score, duelScore, duelLoadedChallenge.name, pelerinName).message}</strong></p>
              )}
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 13, marginBottom: 6 }}>Partage ce jeton à ton ami pour qu'il relève exactement ce même duel :</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <code style={{ padding: "6px 10px", background: "rgba(0,0,0,0.08)", borderRadius: 8, wordBreak: "break-all" }}>
                    {encodeDuelInvitePayload({ code: duelSession.code, challengerName: pelerinName, score: duelScore, total: duelSession.questions.length })}
                  </code>
                  <button
                    className="btn secondary small"
                    onClick={() => {
                      const tok = encodeDuelInvitePayload({ code: duelSession.code, challengerName: pelerinName, score: duelScore, total: duelSession.questions.length });
                      navigator.clipboard?.writeText(tok);
                      onToast?.("📋 Jeton de duel copié !");
                    }}
                  >
                    Copier le jeton
                  </button>
                </div>
              </div>
              <button className="btn secondary small" style={{ marginTop: 12 }} onClick={() => setDuelSession(null)}>Nouveau duel</button>
            </div>
          ) : (
            <div>
              {(() => {
                const q = duelSession.questions[duelQIdx];
                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span className="pill">Duel {duelSession.code}</span>
                      <span className="badge">Question {duelQIdx + 1} / {duelSession.questions.length}</span>
                    </div>
                    <p style={{ fontWeight: 600 }}>{q.prompt}</p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {q.options.map((o, i) => (
                        <button
                          key={i}
                          disabled={duelSelectedOpt !== null}
                          className={`option-btn ${duelSelectedOpt === i ? (o.isCorrect ? "correct" : "wrong") : ""}`}
                          onClick={() => {
                            setDuelSelectedOpt(i);
                            if (o.isCorrect) setDuelScore((s) => s + 1);
                          }}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                    {duelSelectedOpt !== null && (
                      <button
                        className="btn primary small"
                        style={{ marginTop: 12 }}
                        onClick={() => {
                          if (duelQIdx + 1 < duelSession.questions.length) {
                            setDuelQIdx((i) => i + 1);
                            setDuelSelectedOpt(null);
                          } else {
                            setDuelFinished(true);
                            onReward?.({ gameId: "duel", xp: 20 + duelScore * 4, pearls: 2, stars: duelScore >= 4 ? 3 : 2 });
                          }
                        }}
                      >
                        {duelQIdx + 1 < duelSession.questions.length ? "Suivant →" : "Voir le verdict"}
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* JEU 9 : PARCOURS DES PERSONNAGES */}
      {activeGame === "characters" && (
        <div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
            {CHARACTER_JOURNEYS_DATA.map((c, idx) => (
              <button
                key={c.id}
                className={`btn small ${charIdx === idx ? "primary" : "secondary"}`}
                onClick={() => {
                  setCharIdx(idx);
                  setCharQuizIdx(0);
                  setCharFeedback("");
                }}
              >
                {c.avatar} {c.nom}
              </button>
            ))}
          </div>
          <div className="callout" style={{ marginBottom: 14 }}>
            <h3 style={{ marginTop: 0 }}>{currentCharacter.avatar} {currentCharacter.nom} — {currentCharacter.titre}</h3>
            <p className="muted" style={{ fontSize: 12, marginTop: 0 }}>Époque : {currentCharacter.époque}</p>
            <p>{currentCharacter.histoire}</p>
            <p><strong>Épreuves traversées :</strong> {currentCharacter.epreuves}</p>
            <p><strong>Enseignement :</strong> {currentCharacter.enseignements}</p>
            <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
              {currentCharacter.versets.map((v) => (
                <div key={v.ref} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.5)", padding: "8px 10px", borderRadius: 8 }}>
                  <span style={{ fontSize: 13 }}><strong>{v.ref} :</strong> « {v.texte} »</span>
                  <button className="btn secondary small" onClick={() => onAnchorVerse?.(v.ref, v.texte, currentCharacter.nom)}>🌱 Retenir</button>
                </div>
              ))}
            </div>
          </div>

          {currentCharacter.questions?.[charQuizIdx] && (
            <div className="card" style={{ padding: 14 }}>
              <h4 style={{ marginTop: 0 }}>Mini-Quiz ({charQuizIdx + 1}/{currentCharacter.questions.length})</h4>
              <p style={{ fontWeight: 600 }}>{currentCharacter.questions[charQuizIdx].q}</p>
              <div style={{ display: "grid", gap: 8 }}>
                {currentCharacter.questions[charQuizIdx].options.map((opt, idx) => (
                  <button
                    key={idx}
                    className="option-btn"
                    onClick={() => {
                      const ok = idx === currentCharacter.questions[charQuizIdx].correctIndex;
                      if (ok) {
                        playSfx("victory");
                        onReward?.({ gameId: "characters", xp: 15, pearls: 1, stars: 3, characterId: currentCharacter.id });
                        setCharFeedback("✅ Bonne réponse ! +15 XP · +1 💎");
                        if (charQuizIdx + 1 < currentCharacter.questions.length) {
                          setCharQuizIdx((q) => q + 1);
                        }
                      } else {
                        playSfx("error");
                        setCharFeedback("❌ Relis le portrait de " + currentCharacter.nom + " et réessaie.");
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {charFeedback && <p style={{ marginTop: 10 }}>{charFeedback}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

