import React, { useState } from "react";
import { X, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import {
  loginWithGoogle,
  loginWithEmailPassword,
  registerWithEmailPassword,
  sendPelerinPasswordReset
} from "../services/firebase";

export function AuthModal({ isOpen, onClose, onAuthSuccess, notify }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      const res = await loginWithGoogle();
      if (res?.user) {
        if (notify) notify(`Bienvenue, ${res.user.displayName || "Pèlerin"} ! Synchronisation activée ✨`);
        if (onAuthSuccess) onAuthSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || "Impossible de se connecter avec Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await loginWithEmailPassword(email, password);
        if (res?.user) {
          if (notify) notify(`Heureux de te revoir, ${res.user.displayName || "Pèlerin"} ! 🌿`);
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === "register") {
        const res = await registerWithEmailPassword(email, password, displayName);
        if (res?.user) {
          if (notify) notify(`Compte créé avec succès ! Bienvenue ${displayName || "Pèlerin"} 🌟`);
          if (onAuthSuccess) onAuthSuccess(res.user);
          onClose();
        }
      } else if (mode === "forgot") {
        await sendPelerinPasswordReset(email);
        setSuccessMsg("Un courriel de réinitialisation vient de vous être envoyé. Vérifiez votre boîte de réception.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-card auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "460px", padding: "32px 28px" }}
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Fermer la fenêtre d'authentification"
          style={{ position: "absolute", top: "18px", right: "18px" }}
        >
          <X size={20} />
        </button>

        {/* En-tête spirituel */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #e8f7ed, #cbf2d8)",
              color: "#16713e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              fontSize: "24px",
              boxShadow: "0 6px 16px rgba(22, 113, 62, 0.15)"
            }}
          >
            🌿
          </div>
          <span className="eyebrow" style={{ color: "#16713e" }}>
            COMPTE PÈLERIN MULTI-APPAREILS
          </span>
          <h2 style={{ margin: "6px 0 8px", fontSize: "22px", fontWeight: 800, color: "var(--text)" }}>
            {mode === "login" && "Retrouve ton parcours"}
            {mode === "register" && "Crée ton compte pèlerin"}
            {mode === "forgot" && "Récupération de mot de passe"}
          </h2>
          <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
            {mode === "login" && "Connecte-toi pour reprendre ton pèlerinage là où tu t'étais arrêté."}
            {mode === "register" && "Sauvegarde pour toujours ton parcours, tes points d'XP et tes versets."}
            {mode === "forgot" && "Saisis ton e-mail pour recevoir un lien de réinitialisation sécurisé."}
          </p>
        </div>

        {/* Bouton Connexion Google 1-clic */}
        {mode !== "forgot" && (
          <>
            <button
              type="button"
              className="google-auth-button"
              onClick={handleGoogleLogin}
              disabled={loading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "12px 18px",
                borderRadius: "12px",
                border: "1px solid #d2dce6",
                background: "#ffffff",
                color: "#1e293b",
                fontSize: "14px",
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                transition: "all 0.2s ease"
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
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

            <div
              style={{
                display: "flex",
                alignItems: "center",
                margin: "18px 0",
                color: "#94a3b8",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
              <span style={{ padding: "0 10px" }}>ou par adresse e-mail</span>
              <div style={{ flex: 1, height: "1px", background: "#e2e8f0" }} />
            </div>
          </>
        )}

        {/* Message d'erreur */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#b91c1c",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px"
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Message de succès */}
        {successMsg && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#15803d",
              borderRadius: "10px",
              fontSize: "13px",
              marginBottom: "16px"
            }}
          >
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Formulaire Email */}
        <form onSubmit={handleEmailAuth} style={{ display: "grid", gap: "14px" }}>
          {mode === "register" && (
            <div>
              <label
                htmlFor="auth-display-name"
                style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}
              >
                Prénom ou nom du pèlerin
              </label>
              <div style={{ position: "relative" }}>
                <User
                  size={16}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
                <input
                  id="auth-display-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Ex: David, Marie..."
                  style={{ width: "100%", paddingLeft: "38px" }}
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="auth-email"
              style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}
            >
              Adresse e-mail
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
              />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pelerin@exemple.fr"
                style={{ width: "100%", paddingLeft: "38px" }}
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <label htmlFor="auth-password" style={{ fontSize: "12px", fontWeight: 700 }}>
                  Mot de passe
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setError("");
                      setSuccessMsg("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#16713e",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}
                />
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Au moins 6 caractères"
                  style={{ width: "100%", paddingLeft: "38px" }}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: "8px",
              padding: "13px",
              justifyContent: "center",
              fontSize: "14px",
              cursor: loading ? "wait" : "pointer"
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                <span>Chargement...</span>
              </>
            ) : mode === "login" ? (
              <>
                <span>Se connecter</span>
                <ArrowRight size={16} />
              </>
            ) : mode === "register" ? (
              <>
                <span>Créer mon compte</span>
                <Sparkles size={16} />
              </>
            ) : (
              <>
                <span>Envoyer le lien de réinitialisation</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Liens pour basculer de mode */}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "13px", color: "var(--muted)" }}>
          {mode === "login" && (
            <>
              Nouveau pèlerin ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#16713e",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Créer un compte gratuit
              </button>
            </>
          )}

          {mode === "register" && (
            <>
              Déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                  setSuccessMsg("");
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#16713e",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Se connecter
              </button>
            </>
          )}

          {mode === "forgot" && (
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccessMsg("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "#16713e",
                fontWeight: 700,
                cursor: "pointer",
                padding: 0
              }}
            >
              ← Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
