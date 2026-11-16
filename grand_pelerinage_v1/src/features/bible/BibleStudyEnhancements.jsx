import React from "react";
import { BOOK_INTRODUCTIONS, THEMATIC_PATHS_DATA } from "../../data/bibleGamesData.js";

export default function BibleStudyEnhancements({
  activeChapterKey = "gen-1",
  allChapters = {},
  onSelectChapter,
  onToast
}) {
  const bookPrefix = String(activeChapterKey || "gen-1").split("-")[0];
  const bookIntro = BOOK_INTRODUCTIONS[bookPrefix] || null;
  const extendedKeys = Object.keys(allChapters).filter((k) => !["gen-1","gen-22","exo-14","psa-23","dan-6","jon-2","est-4","mat-5","mat-6","mat-14","jea-1","jea-3","jea-4","jea-11","jea-14","jea-15","act-2","apo-21"].includes(k));

  return (
    <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
      {bookIntro && (
        <div className="callout">
          <strong>📘 Introduction du livre ({bookPrefix.toUpperCase()})</strong>
          <p style={{ margin: "6px 0" }}>{bookIntro.resume}</p>
          <p className="muted" style={{ margin: 0, fontSize: 12 }}>
            Personnages clés : {bookIntro.personnagesCles.join(" · ")}
          </p>
        </div>
      )}

      {extendedKeys.length > 0 && (
        <div className="card" style={{ padding: 14 }}>
          <h4 style={{ marginTop: 0 }}>✨ 10 Nouveaux Chapitres & Passages Louis Segond 1910</h4>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {extendedKeys.map((k) => (
              <button
                key={k}
                className={`btn small ${activeChapterKey === k ? "primary" : "secondary"}`}
                onClick={() => onSelectChapter?.(k)}
              >
                {allChapters[k]?.titre || k}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 14 }}>
        <h4 style={{ marginTop: 0 }}>🧭 Parcours Thématiques & Par Livres</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 210px), 1fr))", gap: 10 }}>
          {THEMATIC_PATHS_DATA.map((path) => (
            <div key={path.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong>{path.icone} {path.titre}</strong>
                <span className="pill" style={{ fontSize: 11 }}>{path.type}</span>
              </div>
              <p className="muted" style={{ fontSize: 12, margin: "6px 0" }}>{path.description}</p>
              <p style={{ fontSize: 12, margin: "0 0 8px" }}><strong>Verset clé :</strong> {path.versetCle}</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {path.chapitresKeys.map((ck) =>
                  allChapters[ck] ? (
                    <button key={ck} className="btn secondary small" onClick={() => onSelectChapter?.(ck)}>
                      {allChapters[ck].titre}
                    </button>
                  ) : null
                )}
              </div>
              <button
                className="btn secondary small"
                style={{ marginTop: 8 }}
                onClick={() => onToast?.(`🙏 Application pratique : ${path.resumePratique}`)}
              >
                ✨ Mise en pratique
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

