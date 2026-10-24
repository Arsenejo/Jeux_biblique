import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  Heart,
  Check,
  MessageCircle,
  Palette
} from "lucide-react";

const CURATED_BLESSINGS = [
  {
    ref: "Psaume 23:1-3",
    texte: "L'Éternel est mon berger : je ne manquerai de rien. Il me fait reposer dans de verts pâturages, Il me dirige près des eaux paisibles. Il restaure mon âme.",
    theme: "Paix & Restauration"
  },
  {
    ref: "Jérémie 29:11",
    texte: "Car je connais les projets que j'ai formés sur vous, dit l'Éternel, projets de paix et non de malheur, afin de vous donner un avenir et de l'espérance.",
    theme: "Espérance & Avenir"
  },
  {
    ref: "Jean 14:27",
    texte: "Je vous laisse la paix, je vous donne ma paix. Je ne vous donne pas comme le monde donne. Que votre cœur ne se trouble point, et ne s'alarme point.",
    theme: "Sérénité divine"
  },
  {
    ref: "Philippiens 4:13",
    texte: "Je puis tout par celui qui me fortifie.",
    theme: "Force & Courage"
  },
  {
    ref: "Ésaïe 40:31",
    texte: "Ceux qui se confient en l'Éternel renouvellent leur force. Ils prennent le vol comme les aigles ; Ils courent, et ne se lassent point ; Ils marchent, et ne se fatiguent point.",
    theme: "Renouvellement"
  },
  {
    ref: "Nombres 6:24-26",
    texte: "Que l'Éternel te bénisse, et qu'il te garde ! Que l'Éternel fasse luire sa face sur toi, et qu'il t'accorde sa grâce ! Que l'Éternel tourne sa face vers toi, et qu'il te donne la paix !",
    theme: "Bénédiction sacerdotale"
  }
];

const THEMES = [
  { id: "or-celeste", nom: "Or Céleste", bg1: "#0f172a", bg2: "#1e1b4b", gold: "#f59e0b", accent: "#fbbf24" },
  { id: "emeraude", nom: "Jardin d'Éden", bg1: "#064e3b", bg2: "#022c22", gold: "#34d399", accent: "#a7f3d0" },
  { id: "saphir", nom: "Ciel de Gloire", bg1: "#1e3a8a", bg2: "#0f172a", gold: "#60a5fa", accent: "#93c5fd" },
  { id: "crepuscule", nom: "Flamme Sacrée", bg1: "#4c0519", bg2: "#1c1917", gold: "#fb7185", accent: "#fda4af" }
];

export default function BlessingShareModal({
  isOpen,
  onClose,
  profileName = "Ami pèlerin",
  leagueName = "Airain",
  notify = () => {}
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [themeId, setThemeId] = useState("or-celeste");
  const [personalDedication, setPersonalDedication] = useState("Que la paix et la grâce de Dieu inondent ta journée !");
  const [rendering, setRendering] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const selectedBlessing = CURATED_BLESSINGS[selectedIdx];
  const activeTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  // Dessin sur Canvas 1080x1350 (format Status WhatsApp / Story Instagram)
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // 1. Fond Dégradé
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, activeTheme.bg1);
    bgGrad.addColorStop(1, activeTheme.bg2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Halo lumineux central
    const radial = ctx.createRadialGradient(width / 2, height / 2 - 40, 50, width / 2, height / 2 - 40, 520);
    radial.addColorStop(0, "rgba(245, 158, 11, 0.18)");
    radial.addColorStop(0.6, "rgba(245, 158, 11, 0.04)");
    radial.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // 3. Cadre doré avec doubles liserés et coins ornés
    ctx.strokeStyle = activeTheme.gold;
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 60, width - 120, height - 120);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(74, 74, width - 148, height - 148);

    // Ornements des coins
    const drawCorner = (x, y, dx, dy) => {
      ctx.strokeStyle = activeTheme.gold;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + dx * 35, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * 35);
      ctx.stroke();

      ctx.fillStyle = activeTheme.gold;
      ctx.beginPath();
      ctx.arc(x + dx * 16, y + dy * 16, 4, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(90, 90, 1, 1);
    drawCorner(width - 90, 90, -1, 1);
    drawCorner(90, height - 90, 1, -1);
    drawCorner(width - 90, height - 90, -1, -1);

    // 4. En-tête : Croix & Titre
    ctx.fillStyle = activeTheme.gold;
    ctx.font = "bold 32px 'Outfit', 'Cinzel', serif, system-ui";
    ctx.textAlign = "center";
    ctx.letterSpacing = "6px";
    ctx.fillText("✦ LE GRAND PÈLERINAGE DE LA BIBLE ✦", width / 2, 160);

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.font = "500 20px system-ui";
    ctx.letterSpacing = "2px";
    ctx.fillText("Église Évangélique Assemblée de la Grâce — Issia (Côte d'Ivoire)", width / 2, 205);

    // Petit séparateur doré
    ctx.strokeStyle = activeTheme.gold;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 120, 240);
    ctx.lineTo(width / 2 + 120, 240);
    ctx.stroke();

    ctx.fillStyle = activeTheme.accent;
    ctx.beginPath();
    ctx.arc(width / 2, 240, 5, 0, Math.PI * 2);
    ctx.fill();

    // 5. Thème & Colombe
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    ctx.font = "60px system-ui";
    ctx.fillText("🕊️", width / 2, 330);

    ctx.fillStyle = activeTheme.accent;
    ctx.font = "italic 600 26px system-ui";
    ctx.letterSpacing = "1px";
    ctx.fillText(`— Bénédiction : ${selectedBlessing.theme} —`, width / 2, 385);

    // 6. Guillmets d'ouverture
    ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
    ctx.font = "160px serif";
    ctx.fillText("“", width / 2, 480);

    // 7. Texte du verset (multiligne avec césure propre)
    ctx.fillStyle = "#ffffff";
    ctx.font = "500 36px 'Playfair Display', Georgia, serif";
    ctx.letterSpacing = "0.5px";

    const wrapText = (text, maxWidth, lineHeight, startY) => {
      const words = text.split(" ");
      let line = "";
      let y = startY;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), width / 2, y);
          line = words[n] + " ";
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), width / 2, y);
      return y;
    };

    const verseEndY = wrapText(selectedBlessing.texte, 860, 54, 540);

    // 8. Référence Biblique
    const refY = Math.max(verseEndY + 65, 820);
    ctx.fillStyle = activeTheme.gold;
    ctx.font = "bold 32px 'Outfit', system-ui";
    ctx.letterSpacing = "3px";
    ctx.fillText(`— ${selectedBlessing.ref} (Louis Segond 1910) —`, width / 2, refY);

    // 9. Dédicace personnelle
    if (personalDedication) {
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.font = "italic 400 24px system-ui";
      ctx.fillText(`« ${personalDedication} »`, width / 2, refY + 70);
    }

    // 10. Pied de carte & Signature du pèlerin
    const footerY = height - 170;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(140, footerY);
    ctx.lineTo(width - 140, footerY);
    ctx.stroke();

    ctx.fillStyle = activeTheme.accent;
    ctx.font = "600 24px system-ui";
    ctx.letterSpacing = "1px";
    ctx.fillText(`Offert par ${profileName} · Pèlerin de la Ligue ${leagueName}`, width / 2, footerY + 50);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "400 18px system-ui";
    ctx.fillText("Médite et partage la Parole sur : legrandpelerinage.fr 🌿", width / 2, footerY + 85);
  }, [isOpen, selectedBlessing, activeTheme, personalDedication, profileName, leagueName]);

  if (!isOpen) return null;

  // Téléchargement HD en PNG
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setRendering(true);
    try {
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `benediction-${selectedBlessing.ref.replace(/[^a-zA-Z0-9]/g, "_")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      notify("Carte de bénédiction HD téléchargée avec succès ✨");
    } catch {
      notify("Impossible de télécharger la carte sur ce navigateur.");
    } finally {
      setRendering(false);
    }
  };

  // Partage WhatsApp avec message formaté
  const handleWhatsAppShare = () => {
    const text = `🕊️ *Bénédiction de la Parole de Dieu*\n\n« ${selectedBlessing.texte} »\n— *${selectedBlessing.ref}* (Louis Segond 1910)\n\n_${personalDedication}_\n\nOffert par *${profileName}* avec amour.\nDécouvre le Grand Pèlerinage de la Bible : https://legrandpelerinage.fr`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  // Partage natif mobile avec fichier image si supporté
  const handleNativeShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (navigator.share) {
      try {
        canvas.toBlob(async (blob) => {
          if (!blob) {
            handleWhatsAppShare();
            return;
          }
          const file = new File([blob], "benediction-biblique.png", { type: "image/png" });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: `Bénédiction : ${selectedBlessing.ref}`,
              text: `« ${selectedBlessing.texte} » — ${selectedBlessing.ref} 🕊️`,
              files: [file]
            });
            notify("Carte partagée avec succès !");
          } else {
            await navigator.share({
              title: `Bénédiction : ${selectedBlessing.ref}`,
              text: `« ${selectedBlessing.texte} » — ${selectedBlessing.ref} 🕊️ https://legrandpelerinage.fr`
            });
          }
        }, "image/png");
      } catch {
        handleWhatsAppShare();
      }
    } else {
      handleWhatsAppShare();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-card blessing-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "620px", maxHeight: "92vh", overflowY: "auto" }}
      >
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>🕊️</span>
            <div>
              <h3 style={{ margin: 0 }}>Carte de Bénédiction WhatsApp</h3>
              <p style={{ margin: 0, fontSize: "13px", opacity: 0.8 }}>
                Partage une parole de vie en image HD avec tes frères et sœurs
              </p>
            </div>
          </div>
          <button className="icon-button close-button" onClick={onClose} aria-label="Fermer">
            <X size={20} />
          </button>
        </div>

        <div className="blessing-modal-body" style={{ padding: "16px 20px" }}>
          {/* Choix du Verset */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
              📖 Choisis la parole à offrir :
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {CURATED_BLESSINGS.map((b, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedIdx(idx)}
                  className={`blessing-select-btn ${selectedIdx === idx ? "active" : ""}`}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    borderRadius: "10px",
                    border: selectedIdx === idx ? "2px solid #f59e0b" : "1px solid rgba(255,255,255,0.15)",
                    background: selectedIdx === idx ? "rgba(245, 158, 11, 0.15)" : "rgba(255,255,255,0.04)",
                    color: "inherit",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: "700", fontSize: "13px" }}>{b.ref}</div>
                  <div style={{ fontSize: "11px", opacity: 0.75 }}>{b.theme}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Choix du Thème Visuel */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
              <Palette size={14} /> Ambiance visuelle :
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  style={{
                    flex: 1,
                    padding: "6px",
                    borderRadius: "8px",
                    border: themeId === t.id ? "2px solid #fff" : "1px solid rgba(255,255,255,0.2)",
                    background: `linear-gradient(135deg, ${t.bg1}, ${t.bg2})`,
                    color: "#fff",
                    fontSize: "11px",
                    fontWeight: "600",
                    cursor: "pointer"
                  }}
                >
                  {t.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Dédicace personnalisée */}
          <div style={{ marginBottom: "14px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
              ✍️ Ta parole d'encouragement :
            </label>
            <input
              type="text"
              value={personalDedication}
              onChange={(e) => setPersonalDedication(e.target.value)}
              maxLength={90}
              placeholder="Ex: Que la paix de Dieu t'accompagne !"
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(0,0,0,0.2)",
                color: "inherit",
                fontSize: "13px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Prévisualisation Canvas responsive */}
          <div
            style={{
              position: "relative",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              border: "1px solid rgba(245, 158, 11, 0.3)",
              marginBottom: "16px",
              background: "#0f172a"
            }}
          >
            <canvas
              ref={canvasRef}
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                aspectRatio: "1080 / 1350"
              }}
            />
          </div>

          {/* Boutons d'action */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              type="button"
              className="primary-button"
              onClick={handleWhatsAppShare}
              style={{
                background: "#25D366",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                fontWeight: "700"
              }}
            >
              <MessageCircle size={18} /> WhatsApp
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={handleDownload}
              disabled={rendering}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px"
              }}
            >
              <Download size={18} /> Télécharger HD
            </button>
          </div>

          <button
            type="button"
            className="secondary-button full"
            onClick={handleNativeShare}
            style={{ marginTop: "8px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <Share2 size={16} /> Partager via une autre application
          </button>
        </div>
      </div>
    </div>
  );
}
