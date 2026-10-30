import React, { useState, useMemo } from "react";
import { X, Search, CheckCircle, BookOpen, Award, Sparkles, Filter, Bookmark } from "lucide-react";
import { BIBLE_66_BOOKS } from "../data/bible66Books.js";

export function Bible66BooksModal({
  isOpen,
  onClose,
  masteredBooks = [],
  onMasterBook,
  playSuccessSound,
  playErrorSound
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all"); // all, AT, NT, or section
  const [activeBookForQuiz, setActiveBookForQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);

  // Sections uniques
  const sections = useMemo(() => {
    return Array.from(new Set(BIBLE_66_BOOKS.map(b => b.section)));
  }, []);

  // Livres filtrés
  const filteredBooks = useMemo(() => {
    return BIBLE_66_BOOKS.filter(book => {
      // Filtre texte
      const q = searchQuery.toLowerCase().trim();
      const matchText = !q ||
        book.nom.toLowerCase().includes(q) ||
        book.auteur.toLowerCase().includes(q) ||
        book.section.toLowerCase().includes(q) ||
        book.theme.toLowerCase().includes(q);

      if (!matchText) return false;

      // Filtre catégorie
      if (selectedFilter === "all") return true;
      if (selectedFilter === "AT") return book.testament === "AT";
      if (selectedFilter === "NT") return book.testament === "NT";
      return book.section === selectedFilter;
    });
  }, [searchQuery, selectedFilter]);

  if (!isOpen) return null;

  // Lancement du défi pour un livre
  const handleStartBookQuiz = (book) => {
    setActiveBookForQuiz(book);
    setSelectedOption(null);
    setQuizFeedback(null);
  };

  // Soumission de la réponse au défi
  const handleAnswerSubmit = (option) => {
    if (quizFeedback) return; // Déjà répondu

    setSelectedOption(option);
    const isCorrect = option === activeBookForQuiz.questionDefi.reponse;

    if (isCorrect) {
      if (playSuccessSound) playSuccessSound();
      setQuizFeedback({
        isCorrect: true,
        message: "Gloire à Dieu ! Excellente réponse !"
      });
      if (onMasterBook) {
        onMasterBook(activeBookForQuiz.id);
      }
    } else {
      if (playErrorSound) playErrorSound();
      setQuizFeedback({
        isCorrect: false,
        message: `Ce n'est pas tout à fait cela. La bonne réponse était : « ${activeBookForQuiz.questionDefi.reponse} ».`
      });
    }
  };

  const masteredCount = masteredBooks.length;
  const progressPercent = Math.round((masteredCount / 66) * 100);

  return (
    <div className="modal-backdrop books-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel books-modal-panel" onClick={(e) => e.stopPropagation()}>
        {/* EN-TÊTE MODAL */}
        <div className="books-modal-header">
          <div className="books-header-title">
            <div className="books-icon-badge">
              <BookOpen size={24} />
            </div>
            <div>
              <h2>Le Trésor des 66 Livres de la Bible</h2>
              <p>Explore le canon sacré et maîtrise chaque livre par la foi</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        {/* BARRE DE PROGRESSION GLOBALE DU CANON */}
        <div className="canon-progress-card">
          <div className="canon-progress-info">
            <div className="canon-stat-item">
              <span className="canon-stat-num">{masteredCount} / 66</span>
              <span className="canon-stat-lbl">Livres Maîtrisés</span>
            </div>
            <div className="canon-stat-pill">
              <Sparkles size={14} /> {progressPercent}% Accompli
            </div>
          </div>
          <div className="canon-progress-bar-bg">
            <div className="canon-progress-bar-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* FILTRES & RECHERCHE */}
        <div className="books-filters-row">
          <div className="books-search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Rechercher un livre, auteur, thème..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="books-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="books-filter-pills">
            <button
              className={`filter-pill ${selectedFilter === "all" ? "active" : ""}`}
              onClick={() => setSelectedFilter("all")}
            >
              Tous (66)
            </button>
            <button
              className={`filter-pill ${selectedFilter === "AT" ? "active" : ""}`}
              onClick={() => setSelectedFilter("AT")}
            >
              Ancien Testament (39)
            </button>
            <button
              className={`filter-pill ${selectedFilter === "NT" ? "active" : ""}`}
              onClick={() => setSelectedFilter("NT")}
            >
              Nouveau Testament (27)
            </button>
            {sections.map(sec => (
              <button
                key={sec}
                className={`filter-pill ${selectedFilter === sec ? "active" : ""}`}
                onClick={() => setSelectedFilter(sec)}
              >
                {sec}
              </button>
            ))}
          </div>
        </div>

        {/* GRILLE DES LIVRES */}
        <div className="books-grid-container">
          {filteredBooks.map((book, idx) => {
            const isMastered = masteredBooks.includes(book.id);
            const globalIndex = BIBLE_66_BOOKS.findIndex(b => b.id === book.id) + 1;

            return (
              <div key={book.id} className={`book-card ${isMastered ? "mastered" : ""}`}>
                <div className="book-card-top">
                  <span className="book-num-badge">#{globalIndex}</span>
                  <div className="book-badges-right">
                    <span className={`book-testament-badge ${book.testament.toLowerCase()}`}>
                      {book.testament === "AT" ? "AT" : "NT"}
                    </span>
                    <span className="book-section-badge">{book.section}</span>
                    {isMastered && (
                      <span className="book-mastered-badge" title="Livre Maîtrisé !">
                        <CheckCircle size={15} />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="book-title">{book.nom}</h3>
                <div className="book-meta-line">
                  <span>✍️ {book.auteur}</span>
                  <span>·</span>
                  <span>📖 {book.chapitres} chap.</span>
                </div>

                <p className="book-theme-desc">{book.theme}</p>

                {/* Verset Clé */}
                <div className="book-gold-verse">
                  <div className="gold-verse-header">
                    <Bookmark size={13} />
                    <span>Verset d'Or · {book.versetOr?.ref}</span>
                  </div>
                  <p className="gold-verse-text">« {book.versetOr?.texte} »</p>
                </div>

                {/* Bouton Défi */}
                <button
                  className={`book-challenge-btn ${isMastered ? "btn-replay" : "btn-play"}`}
                  onClick={() => handleStartBookQuiz(book)}
                >
                  <Award size={16} />
                  <span>{isMastered ? "Rejouer le Défi" : "Passer le Défi (+50 XP)"}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* MINI-MODAL DÉFI DU LIVRE */}
        {activeBookForQuiz && (
          <div className="book-quiz-overlay" onClick={() => setActiveBookForQuiz(null)}>
            <div className="book-quiz-modal" onClick={(e) => e.stopPropagation()}>
              <div className="book-quiz-header">
                <div>
                  <span className="quiz-tag">DÉFI CANONIQUE</span>
                  <h3>{activeBookForQuiz.nom} : Question Maître</h3>
                </div>
                <button className="modal-close-btn" onClick={() => setActiveBookForQuiz(null)}>
                  <X size={18} />
                </button>
              </div>

              <div className="book-quiz-body">
                <p className="book-quiz-question">{activeBookForQuiz.questionDefi.question}</p>

                <div className="book-quiz-options">
                  {activeBookForQuiz.questionDefi.options.map((opt, i) => {
                    const isSelected = selectedOption === opt;
                    const isCorrect = opt === activeBookForQuiz.questionDefi.reponse;
                    let btnClass = "quiz-opt-btn";

                    if (quizFeedback) {
                      if (isCorrect) btnClass += " correct";
                      else if (isSelected) btnClass += " incorrect";
                    }

                    return (
                      <button
                        key={i}
                        className={btnClass}
                        onClick={() => handleAnswerSubmit(opt)}
                        disabled={!!quizFeedback}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                        <span className="opt-text">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {quizFeedback && (
                  <div className={`quiz-feedback-box ${quizFeedback.isCorrect ? "feedback-success" : "feedback-error"}`}>
                    <div className="feedback-title">
                      {quizFeedback.isCorrect ? "✨ Victoire !" : "💡 À retenir"}
                    </div>
                    <p>{quizFeedback.message}</p>
                    <p className="feedback-explanation">
                      <b>Explication :</b> {activeBookForQuiz.questionDefi.explication}
                    </p>
                    <div className="feedback-actions">
                      <button className="quiz-done-btn" onClick={() => setActiveBookForQuiz(null)}>
                        Continuer l'exploration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
