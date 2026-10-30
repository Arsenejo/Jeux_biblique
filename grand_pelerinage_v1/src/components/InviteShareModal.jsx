import React, { useState, useId } from "react";
import {
  Share2,
  Copy,
  Check,
  Mail,
  Send,
  Sparkles,
  Heart,
  BookOpen,
  X,
  ExternalLink,
  MessageCircle,
  Gem,
  Trophy,
  Flame
} from "lucide-react";
import { sendInviteEmail } from "../services/brevoMailer";

export default function InviteShareModal({
  isOpen,
  onClose,
  profileName = "Ami pèlerin",
  stats = {},
  notify = () => {}
}) {
  const { xp = 0, pearls = 0, stagesCount = 0, versesCount = 0, streak = 1 } = stats;

  const [copied, setCopied] = useState(false);
  const [friendEmail, setFriendEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  const emailInputId = useId();
  const nameInputId = useId();
  const msgInputId = useId();

  if (!isOpen) return null;

  // Construction du lien d'invitation avec métadonnées
  const baseUrl = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}`
    : "https://legrandpelerinage.fr";

  const inviteUrl = `${baseUrl}?invite=${encodeURIComponent(profileName)}&xp=${xp}&stages=${stagesCount}`;

  const shareText = `Rejoins-moi sur Le Grand Pèlerinage de la Bible ! J'ai déjà partagé ${xp} points de joie et franchi ${stagesCount} étape(s) dans la Parole 🌿. Viens marcher avec moi : ${inviteUrl}`;

  // 1. Copie du lien
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
      } else {
        // Fallback
        const textarea = document.createElement("textarea");
        textarea.value = inviteUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      notify("Lien d'invitation copié dans le presse-papier ! ✨");
      setTimeout(() => setCopied(false), 3000);
    } catch {
      notify("Impossible de copier automatiquement le lien.");
    }
  };

  // 2. Partage WhatsApp
  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  // 3. Web Share API (Mobile / Navigateurs modernes)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Le Grand Pèlerinage de la Bible",
          text: `Rejoins ${profileName} sur Le Grand Pèlerinage de la Bible !`,
          url: inviteUrl
        });
        notify("Merci pour le partage fraternel ! 🕊️");
      } catch (err) {
        if (err.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // 4. Envoi par e-mail avec Brevo
  const handleSendEmailInvite = async (e) => {
    e.preventDefault();
    const emailTrim = friendEmail.trim();
    if (!emailTrim || !emailTrim.includes("@")) {
      setEmailStatus({ type: "error", message: "Veuillez entrer une adresse e-mail valide." });
      return;
    }

    setSendingEmail(true);
    setEmailStatus(null);

    const res = await sendInviteEmail({
      toEmail: emailTrim,
      friendName: friendName.trim() || "Mon cher ami",
      inviterName: profileName,
      inviterStats: { xp, pearls, stagesCount, versesCount },
      customMessage: personalMessage.trim(),
      inviteUrl
    });

    setSendingEmail(false);

    if (res.success) {
      setEmailStatus({
        type: "success",
        message: res.simulated
          ? "Invitation préparée. Ajoute BREVO_API_KEY sur le serveur pour l'envoi réel."
          : `Invitation envoyée avec succès à ${emailTrim} ! 🌿`
      });
      notify("Invitation envoyée ! Que ce partage porte du fruit ✨");
      setFriendEmail("");
      setPersonalMessage("");
    } else {
      setEmailStatus({
        type: "error",
        message: res.error || "Une erreur est survenue lors de l'envoi."
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card invite-share-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span className="invite-modal-icon">🤝</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px" }}>Inviter un ami & Partager mon score</h3>
              <span className="eyebrow" style={{ color: "#159447" }}>FRATERNITÉ & COMMUNION DE FOI</span>
            </div>
          </div>
          <button className="icon-close" onClick={onClose} aria-label="Fermer la boîte de dialogue">
            <X size={18} />
          </button>
        </div>

        <div className="invite-modal-body">
          {/* CARTE D'INVITATION AVEC SCORE */}
          <div className="invite-score-card">
            <div className="invite-score-header">
              <span className="pilgrim-avatar-badge">🎒</span>
              <div>
                <b>{profileName}</b>
                <small>Pèlerin en chemin</small>
              </div>
              <span className="invite-tag">Carte de pèlerin</span>
            </div>

            <p className="invite-verse-quote">
              « Venez, et montons à la montagne de l'Éternel... afin qu'il nous enseigne ses voies. »
              <small>— Ésaïe 2:3</small>
            </p>

            <div className="invite-stats-grid">
              <div className="invite-stat-chip">
                <Trophy size={14} color="#159447" />
                <span><b>{xp}</b> XP</span>
              </div>
              <div className="invite-stat-chip">
                <Gem size={14} color="#0756a5" />
                <span><b>{pearls}</b> Perles</span>
              </div>
              <div className="invite-stat-chip">
                <BookOpen size={14} color="#8a5cf6" />
                <span><b>{stagesCount}</b> Étapes</span>
              </div>
              <div className="invite-stat-chip">
                <Flame size={14} color="#f97316" />
                <span><b>{streak}j</b> Série</span>
              </div>
            </div>
          </div>

          {/* LIEN D'INVITATION RAPIDE */}
          <div className="invite-link-section">
            <label className="invite-label" htmlFor="invite-url-field">Ton lien d'invitation personnel :</label>
            <div className="invite-link-row">
              <input
                id="invite-url-field"
                type="text"
                readOnly
                value={inviteUrl}
                className="invite-url-input"
                onFocus={(e) => e.target.select()}
              />
              <button
                type="button"
                className={`secondary-button copy-btn ${copied ? "copied" : ""}`}
                onClick={handleCopyLink}
                title="Copier le lien"
              >
                {copied ? <Check size={16} color="#159447" /> : <Copy size={16} />}
                <span>{copied ? "Copié !" : "Copier"}</span>
              </button>
            </div>
          </div>

          {/* BOUTONS DE PARTAGE EN 1 CLIC */}
          <div className="share-buttons-row">
            <button
              type="button"
              className="share-social-btn whatsapp-btn"
              onClick={handleShareWhatsApp}
            >
              <MessageCircle size={18} />
              <span>Partager sur WhatsApp</span>
            </button>

            {typeof navigator !== "undefined" && navigator.share && (
              <button
                type="button"
                className="share-social-btn native-share-btn"
                onClick={handleNativeShare}
              >
                <Share2 size={18} />
                <span>Partager via une application</span>
              </button>
            )}
          </div>

          {/* ENVOI PAR E-MAIL VIA BREVO */}
          <div className="brevo-invite-section">
            <div className="brevo-section-header">
              <Mail size={16} color="#0756a5" />
              <b>Envoyer une invitation directe par e-mail</b>
            </div>
            <p className="brevo-section-desc">
              Ton ami(e) recevra un magnifique courriel aux couleurs du pèlerinage l'invitant à te rejoindre avec ton lien personnalisé.
            </p>

            <form onSubmit={handleSendEmailInvite} className="brevo-invite-form">
              <div className="form-row-dual">
                <div>
                  <label htmlFor={nameInputId}>Prénom de ton ami(e) :</label>
                  <input
                    id={nameInputId}
                    type="text"
                    placeholder="Ex: Sarah, David, Marc..."
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor={emailInputId}>Adresse e-mail :</label>
                  <input
                    id={emailInputId}
                    type="email"
                    placeholder="ami@exemple.com"
                    required
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor={msgInputId}>Mot personnel d'encouragement (facultatif) :</label>
                <textarea
                  id={msgInputId}
                  rows={2}
                  placeholder="Ex: Viens découvrir ces beaux versets avec moi, c'est très fortifiant !"
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                />
              </div>

              {emailStatus && (
                <div className={`invite-status-msg ${emailStatus.type}`}>
                  {emailStatus.type === "success" ? <Sparkles size={16} /> : <Heart size={16} />}
                  <span>{emailStatus.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="primary-button full"
                disabled={sendingEmail}
                style={{ marginTop: "10px" }}
              >
                {sendingEmail ? (
                  <>
                    <span className="spin-icon">⏳</span> Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Envoyer l'invitation par e-mail
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
