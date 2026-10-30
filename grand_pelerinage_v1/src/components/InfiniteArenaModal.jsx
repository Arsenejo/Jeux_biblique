import React, { useState, useEffect, useMemo } from "react";
import { X, Flame, Zap, Award, Sparkles, ArrowRight, RotateCcw, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";
import { generateArenaQuestion, getComboTier } from "../services/infiniteQuizEngine.js";

export function InfiniteArenaModal({
  isOpen,
  onClose,
  onAddRewards,
  playSuccessSound,
  playErrorSound,
  playChime
}) {
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [totalPearlsEarned, setTotalPearlsEarned] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // État de la question courante
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isCashingOut, setIsCashingOut] = useState(false);

  // Initialisation ou renouvellement de question
  useEffect(() => {
    if (isOpen && !currentQuestion && !isCashingOut) {
      loadNextQuestion();
    }
  }, [isOpen, currentQuestion, isCashingOut]);

  const loadNextQuestion = () => {
    const q = generateArenaQuestion("intermediaire", questionsAnswered);
    setCurrentQuestion(q);
    setSelectedOption(null);
    setFeedback(null);
  };

  const comboTier = useMemo(() => getComboTier(streak), [streak]);

  if (!isOpen) return null;

  // Validation de réponse
  const handleSelectOption = (opt) => {
    if (feedback || !currentQuestion) return;

    setSelectedOption(opt);

    let isCorrect = false;
    if (currentQuestion.type === "qcm" || currentQuestion.type === "truefalse" || currentQuestion.type === "whosaid") {
      isCorrect = opt.correct === true || opt === currentQuestion.motCorrect || opt === currentQuestion.correctSpeaker;
    } else if (currentQuestion.type === "cloze") {
      isCorrect = opt.toLowerCase().trim() === currentQuestion.motCorrect.toLowerCase().trim();
    }

    if (isCorrect) {
      if (playSuccessSound) playSuccessSound();
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      const baseExp = currentQuestion.recompense?.xp || 30;
      const basePerles = currentQuestion.recompense?.perles || 1;
      const earnedXp = Math.round(baseExp * comboTier.multiplier);
      const earnedPerles = basePerles;

      setTotalXpEarned(prev => prev + earnedXp);
      setTotalPearlsEarned(prev => prev + earnedPerles);
      setQuestionsAnswered(prev => prev + 1);

      setFeedback({
        isCorrect: true,
        earnedXp,
        earnedPerles,
        message: "Bonne réponse ! Parole inspirée gravée dans le cœur."
      });
    } else {
      if (playErrorSound) playErrorSound();
      setStreak(0);
      setQuestionsAnswered(prev => prev + 1);

      setFeedback({
        isCorrect: false,
        message: `Poursuis avec courage ! Révise ce passage pour progresser.`
      });
    }
  };

  // Encaisser et fermer
  const handleCashOut = () => {
    if (onAddRewards && (totalXpEarned > 0 || totalPearlsEarned > 0)) {
      onAddRewards({ xp: totalXpEarned, perles: totalPearlsEarned });
    }
    if (playChime) playChime();
    setIsCashingOut(true);
  };

  const handleFinishModal = () => {
    setIsCashingOut(false);
    setStreak(0);
    setBestStreak(0);
    setTotalXpEarned(0);
    setTotalPearlsEarned(0);
    setQuestionsAnswered(0);
    setCurrentQuestion(null);
    onClose();
  };

  return (
    <div className="modal-backdrop arena-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel arena-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* ÉCRAN DE RÉCAPITULATIF FINAL LORS DE L'ENCAISSEMENT */}
        {isCashingOut ? (
          <div className="arena-cashout-screen">
            <div className="cashout-icon-bounce">
              <Sparkles size={48} className="gold-sparkle-icon" />
            </div>
            <h2>Récolte de l'Arène de la Foi</h2>
            <p className="cashout-subtitle">
              Tes victoires et ta persévérance portent du fruit pour le Royaume !
            </p>

            <div className="cashout-stats-card">
              <div className="cashout-stat-col">
                <span className="cashout-stat-val">+{totalXpEarned}</span>
                <span className="cashout-stat-lbl">Points d'XP</span>
              </div>
              <div className="cashout-stat-col">
                <span className="cashout-stat-val">+{totalPearlsEarned} 💎</span>
                <span className="cashout-stat-lbl">Perles Célestes</span>
              </div>
              <div className="cashout-stat-col">
                <span className="cashout-stat-val">🔥 {bestStreak}</span>
                <span className="cashout-stat-lbl">Meilleure Série</span>
              </div>
            </div>

            <button className="arena-claim-btn" onClick={handleFinishModal}>
              <ShieldCheck size={20} />
              <span>Recevoir la Récompense et Revenir au Sentier</span>
            </button>
          </div>
        ) : (
          <>
            {/* EN-TÊTE ARÈNE */}
            <div className="arena-modal-header">
              <div className="arena-header-left">
                <div className="arena-title-tag">
                  <Zap size={18} />
                  <span>ARÈNE DE LA FOI · DÉFI INFINI</span>
                </div>
                <div className="arena-streak-bar">
                  <span className="arena-flame-badge">
                    <Flame size={16} /> Série : {streak}
                  </span>
                  <span className="arena-tier-badge">
                    {comboTier.icon} {comboTier.title} (x{comboTier.multiplier})
                  </span>
                </div>
              </div>

              <div className="arena-header-right">
                <div className="arena-pot-badge" title="Gains accumulés dans cette session">
                  <span>+{totalXpEarned} XP</span>
                  <span>·</span>
                  <span>+{totalPearlsEarned} 💎</span>
                </div>
                <button
                  className="arena-cashout-btn"
                  onClick={handleCashOut}
                  title="Encaisser les gains et quitter l'arène"
                >
                  Encaisser
                </button>
                <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* CORPS DE LA QUESTION */}
            {currentQuestion ? (
              <div className="arena-question-container">
                <div className="arena-question-meta">
                  <span className="arena-type-pill">{currentQuestion.titre}</span>
                  <span className="arena-ref-pill">📖 {currentQuestion.ref}</span>
                </div>

                <h3 className="arena-consigne">{currentQuestion.consigne}</h3>

                {/* CAS CLOZE : AFFICHE LA PHRASE À COMPLÉTER */}
                {currentQuestion.type === "cloze" && (
                  <div className="arena-cloze-card">
                    <p className="cloze-sentence">
                      {currentQuestion.phraseAvant}
                      <span className="cloze-gap-slot">
                        {feedback ? (
                          <b className={feedback.isCorrect ? "gap-correct" : "gap-incorrect"}>
                            {currentQuestion.motCorrect}
                          </b>
                        ) : (
                          "________"
                        )}
                      </span>
                      {currentQuestion.phraseApres}
                    </p>
                  </div>
                )}

                {/* CAS QUI A DIT : CITATION */}
                {currentQuestion.type === "whosaid" && (
                  <div className="arena-quote-box">
                    <p className="quote-text">« {currentQuestion.quote} »</p>
                  </div>
                )}

                {/* OPTIONS DE RÉPONSES */}
                <div className="arena-options-grid">
                  {/* Options QCM classiques ou Cloze ou WhoSaid */}
                  {(currentQuestion.type === "qcm" || currentQuestion.type === "truefalse") &&
                    currentQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === opt;
                      let btnClass = "arena-opt-btn";

                      if (feedback) {
                        if (opt.correct) btnClass += " correct";
                        else if (isSelected) btnClass += " incorrect";
                      }

                      return (
                        <button
                          key={idx}
                          className={btnClass}
                          onClick={() => handleSelectOption(opt)}
                          disabled={!!feedback}
                        >
                          <span className="opt-marker">{String.fromCharCode(65 + idx)}</span>
                          <span className="opt-label">{opt.text}</span>
                        </button>
                      );
                    })}

                  {currentQuestion.type === "cloze" &&
                    currentQuestion.options.map((word, idx) => {
                      const isSelected = selectedOption === word;
                      const isCorrect = word.toLowerCase() === currentQuestion.motCorrect.toLowerCase();
                      let btnClass = "arena-opt-btn";

                      if (feedback) {
                        if (isCorrect) btnClass += " correct";
                        else if (isSelected) btnClass += " incorrect";
                      }

                      return (
                        <button
                          key={idx}
                          className={btnClass}
                          onClick={() => handleSelectOption(word)}
                          disabled={!!feedback}
                        >
                          <span className="opt-marker">{String.fromCharCode(65 + idx)}</span>
                          <span className="opt-label">{word}</span>
                        </button>
                      );
                    })}

                  {currentQuestion.type === "whosaid" &&
                    currentQuestion.speakers.map((spk, idx) => {
                      const isSelected = selectedOption === spk;
                      const isCorrect = spk === currentQuestion.correctSpeaker;
                      let btnClass = "arena-opt-btn";

                      if (feedback) {
                        if (isCorrect) btnClass += " correct";
                        else if (isSelected) btnClass += " incorrect";
                      }

                      return (
                        <button
                          key={idx}
                          className={btnClass}
                          onClick={() => handleSelectOption(spk)}
                          disabled={!!feedback}
                        >
                          <span className="opt-marker">{String.fromCharCode(65 + idx)}</span>
                          <span className="opt-label">{spk}</span>
                        </button>
                      );
                    })}
                </div>

                {/* RETOUR & EXPLICATION IMMÉDIATE */}
                {feedback && (
                  <div className={`arena-feedback-card ${feedback.isCorrect ? "feedback-won" : "feedback-lost"}`}>
                    <div className="feedback-badge-row">
                      {feedback.isCorrect ? (
                        <span className="feedback-result-tag won">
                          <CheckCircle size={16} /> +{feedback.earnedXp} XP (x{comboTier.multiplier}) · +{feedback.earnedPerles} 💎
                        </span>
                      ) : (
                        <span className="feedback-result-tag lost">
                          <AlertCircle size={16} /> Série réinitialisée
                        </span>
                      )}
                    </div>
                    <p className="feedback-msg">{feedback.message}</p>
                    <p className="feedback-expl">
                      <b>Éclairage :</b> {currentQuestion.explication}
                    </p>

                    <button className="arena-next-btn" onClick={loadNextQuestion}>
                      <span>Question Suivante</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="arena-loading">
                <RotateCcw className="spinner-icon" size={28} />
                <p>Invocation de la parole céleste...</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
