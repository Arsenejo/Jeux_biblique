import React, { useState } from "react";
import {
  X, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2,
  AlertCircle, RefreshCw, Eye, EyeOff, ShieldCheck
} from "lucide-react";
import {
  loginWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  sendPelerinPasswordReset,
  checkIsPseudoAvailable,
  translateAuthError
} from "../services/firebase";

/**
 * Modale d'authentification et de synchronisation réelle du pèlerin
 * Connexion officielle Google (sélecteur de compte réel) & Email avec unicité stricte des comptes et pseudonymes.
 * Mention officielle de paternité de l'Église Évangélique Assemblée de la Grâce (Issia, Côte d'Ivoire).
 */
export function AuthModal({ isOpen, onClose, onAuthSuccess, onPlayAsGuest, notify }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      // Ouvre impérativement le vrai sélecteur de compte Google
      const res = await loginWithGoogle();
      if (res?.user) {
        if (notify) {
          notify(`Bienvenue, ${res.user.displayName || "Pèlerin"} ! Ton pèlerinage est synchronisé dans la base commune ✨`);
        }
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setError("Veille à renseigner une adresse e-mail valide (ex: pelerin@exemple.fr).");
      return;
    }

    if (mode !== "forgot" && (!password || password.length < 6)) {
      setError("Le mot de passe doit comporter au moins 6 caractères pour préserver votre carnet.");
      return;
    }

    // Unicité stricte du nom du joueur à l'inscription
    if (mode === "register") {
      const cleanName = displayName.trim();
      if (!cleanName || cleanName.length < 2) {
        setError("Veuillez choisir un nom ou prénom de pèlerin (au moins 2 caractères).");
        return;
      }
      setLoading(true);
      try {
        const check = await checkIsPseudoAvailable(cleanName, null);
        if (!check.available) {
          setError(check.reason || "Ce nom de pèlerin est déjà réservé par un autre joueur.");
          setLoading(false);
          return;
        }
      } catch {
        // En cas de coupure réseau, la création Firebase validera également
      }
    } else {
      setLoading(true);
    }

    try {
      if (mode === "login") {
        const res = await loginWithEmailPassword(cleanEmail, password);
        if (res?.user) {
          if (notify) notify(`Heureux de te revoir, ${res.user.displayName || "Pèlerin"} ! Ton sentier est synchronisé 🌿`);
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === "register") {
        const res = await registerWithEmailPassword(cleanEmail, password, displayName);
        if (res?.user) {
          if (notify) notify(`Bienvenue dans la famille des pèlerins, ${displayName.trim() || "Ami pèlerin"} 🌟`);
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === "forgot") {
        await sendPelerinPasswordReset(cleanEmail);
        setSuccessMsg("Un courriel de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.");
      }
    } catch (err) {
      setError(translateAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer la fenêtre d'authentification"
        >
          <X size={20} />
        </button>

        {/* EN-TÊTE SPIRITUEL */}
        <div className="auth-header-block">
          <div className="auth-icon-badge">
            🌿
          </div>
          <span className="auth-eyebrow">
            COMPTE PÈLERIN MULTI-APPAREILS
          </span>
          <h2 className="auth-main-title">
            {mode === "login" && "Retrouve ton parcours"}
            {mode === "register" && "Crée ton compte pèlerin"}
            {mode === "forgot" && "Récupération de mot de passe"}
          </h2>
          <p className="auth-subtitle">
            {mode === "login" && "Connecte-toi pour continuer ton pèlerinage là où tu t'étais arrêté."}
            {mode === "register" && "Sauvegarde ton parcours, tes lampes et tes versets mémorisés."}
            {mode === "forgot" && "Saisis ton e-mail pour recevoir un lien d'accès sécurisé."}
          </p>
        </div>

        {/* ACCÈS DIRECT JEU SANS COMPTE (ZÉRO BLOCAGE POUR LE JOUEUR) */}
        <div className="guest-quick-play-bar">
          <button
            type="button"
            className="guest-play-button"
            onClick={onPlayAsGuest || onClose}
            title="Jouer immédiatement sur cet appareil sans créer de compte"
          >
            🎮 Continuer sans compte (Mode Immédiat)
          </button>
        </div>

        {/* BOUTON GOOGLE ONE-CLICK */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              className="google-auth-button-refined"
              onClick={handleGoogleLogin}
              disabled={loading}
              title="Connexion instantanée avec votre compte Google"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="auth-separator">
              <div className="sep-line" />
              <span>ou par adresse e-mail</span>
              <div className="sep-line" />
            </div>
          </>
        )}

        {/* ALERTE D'ERREUR BIENVEILLANTE SANS AUCUN TERME TECHNIQUE */}
        {error && (
          <div className="auth-alert-box error" role="alert">
            <div className="auth-alert-row">
              <AlertCircle size={17} className="alert-icon" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              className="auth-play-fallback-link"
              onClick={onPlayAsGuest || onClose}
            >
              Jouer directement sur cet appareil ➔
            </button>
          </div>
        )}

        {/* MESSAGE DE SUCCÈS */}
        {successMsg && (
          <div className="auth-alert-box success">
            <CheckCircle2 size={17} className="alert-icon" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* FORMULAIRE DE SAISIE PARFAIT */}
        <form onSubmit={handleEmailAuth} className="auth-form-refined" noValidate>
          {mode === "register" && (
            <div className="auth-field-group">
              <label htmlFor="auth-display-name" className="auth-field-label">
                <span>Prénom ou nom du pèlerin</span>
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-left-icon">
                  <User size={18} />
                </span>
                <input
                  id="auth-display-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: David, Marie, Samuel..."
                  className="auth-input-field"
                />
              </div>
            </div>
          )}

          <div className="auth-field-group">
            <label htmlFor="auth-email" className="auth-field-label">
              <span>Adresse e-mail</span>
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-left-icon">
                <Mail size={18} />
              </span>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nom.pelerin@exemple.fr"
                className="auth-input-field"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div className="auth-field-group">
              <div className="auth-label-row">
                <label htmlFor="auth-password" className="auth-field-label">
                  <span>Mot de passe</span>
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    className="auth-forgot-link"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-left-icon">
                  <Lock size={18} />
                </span>
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  className="auth-input-field password-input"
                />
                <button
                  type="button"
                  className="auth-password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn-refined"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="spin-icon" />
                <span>Chargement du sentier...</span>
              </>
            ) : mode === "login" ? (
              <>
                <span>Se connecter</span>
                <ArrowRight size={17} />
              </>
            ) : mode === "register" ? (
              <>
                <span>Créer mon compte</span>
                <Sparkles size={17} />
              </>
            ) : (
              <>
                <span>Envoyer le lien de réinitialisation</span>
                <ArrowRight size={17} />
              </>
            )}
          </button>
        </form>

        {/* BASCULE DE MODE */}
        <div className="auth-mode-switch">
          {mode === "login" && (
            <span>
              Nouveau pèlerin ?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Créer un compte gratuit
              </button>
            </span>
          )}

          {mode === "register" && (
            <span>
              Déjà un compte ?{" "}
              <button
                type="button"
                className="auth-switch-link"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
              >
                Se connecter
              </button>
            </span>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              className="auth-switch-link"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
            >
              ← Retour à la connexion
            </button>
          )}
        </div>

        {/* MENTION OFFICIELLE DE PROPRIÉTÉ ET DE PATERNITÉ */}
        <div className="auth-church-footer">
          <span className="church-cross-badge">✝</span>
          <p>
            Ce jeu est la propriété exclusive de l'<b>Église Évangélique Assemblée de la Grâce</b>, sise à <b>Issia (Côte d'Ivoire)</b>.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
