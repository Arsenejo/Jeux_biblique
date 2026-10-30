import React from "react";
import {
  BookOpen, Compass, Flame, Heart, Sparkles, ShieldCheck,
  LogIn, UserPlus, Download, Smartphone, Cloud, Sun, Moon,
  ChevronRight, Leaf, Shield, CheckCircle2
} from "lucide-react";

/**
 * Page d'accueil de présentation spirituelle et d'embarquement (Landing Gate)
 * Permet au joueur de découvrir le concept et de se connecter/s'inscrire
 * afin de synchroniser ses données dès le départ sans jamais rien perdre.
 */
export default function WelcomeLanding({
  onLoginClick,
  onStartAsGuest,
  nightMode,
  setNightMode,
  pwaInstallPrompt,
  onInstallPwa
}) {
  return (
    <div className="welcome-landing-shell">
      {/* BARRE SUPÉRIEURE DE LA LANDING */}
      <header className="landing-topbar">
        <div className="brand">
          <div className="brand-mark">
            <BookOpen size={22} />
            <span>✦</span>
          </div>
          <div>
            <strong>Le Grand Pèlerinage</strong>
            <small>de la Bible · Louis Segond 1910</small>
          </div>
        </div>

        <div className="landing-top-actions">
          {pwaInstallPrompt && (
            <button
              type="button"
              className="pwa-install-pill-btn"
              onClick={onInstallPwa}
              title="Installer l'application sur ton appareil"
            >
              <Download size={15} />
              <span className="hide-mobile">Installer l'App</span>
            </button>
          )}

          <button
            type="button"
            className="icon-button"
            onClick={() => setNightMode((n) => !n)}
            title={nightMode ? "Mode Jour" : "Mode Nuit Paisible"}
            aria-label="Changer le thème"
          >
            {nightMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* SECTION HÉROS PRINCIPALE */}
      <main className="landing-content">
        <div className="landing-hero">
          <div className="landing-badge">
            <Sparkles size={14} />
            <span>UN VOYAGE INTERACTIF AU CŒUR DE LA PAROLE</span>
          </div>

          <h1 className="landing-title">
            Cheminez à travers les Écritures, <br />
            <span className="gradient-text">ancrez la Parole dans votre cœur.</span>
          </h1>

          <div className="landing-verse-quote">
            « Ta parole est une lampe à mes pieds, et une lumière sur mon sentier. »
            <cite>— Psaume 119:105 (Louis Segond 1910)</cite>
          </div>

          <p className="landing-description">
            Plus qu'un simple jeu biblique, <b>Le Grand Pèlerinage</b> est une retraite vivante
            à travers plus de 270 étapes pan-bibliques, les questions du Défi Jean, des défis de foi avec vos lampes,
            la mémorisation par répétition espacée et une fraternité bienveillante.
          </p>

          {/* APPELS À L'ACTION PROÉMINENTS */}
          <div className="landing-cta-box">
            <div className="cta-primary-wrapper">
              <button
                type="button"
                className="landing-btn-primary"
                onClick={onLoginClick}
              >
                <LogIn size={20} />
                <span>Créer mon compte / Me connecter</span>
                <ChevronRight size={18} />
              </button>
              <p className="cta-hint">
                <Cloud size={14} />
                <b>Recommandé</b> : Retrouvez votre progression et votre sentier sur tous vos appareils (PC, tablette, mobile) sans jamais recommencer à zéro.
              </p>
            </div>

            <div className="cta-divider">
              <span>ou</span>
            </div>

            <div className="cta-secondary-wrapper">
              <button
                type="button"
                className="landing-btn-secondary"
                onClick={onStartAsGuest}
              >
                <Leaf size={18} />
                <span>Découvrir en visiteur</span>
              </button>
              <p className="cta-hint muted">
                Commencez directement sur cet appareil. Vous pourrez lier votre compte à tout moment pour synchroniser.
              </p>
            </div>
          </div>
        </div>

        {/* LES 4 PILIERS DE L'EXPÉRIENCE */}
        <section className="landing-pillars-section">
          <div className="section-title-center">
            <span className="eyebrow">FONCTIONNALITÉS SPIRITUELLES</span>
            <h2>Ce qui vous attend sur le Sentier</h2>
          </div>

          <div className="landing-pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box orange">
                <Compass size={24} />
              </div>
              <h3>7 Époques & plus de 270 étapes</h3>
              <p>
                De la Création du monde jusqu'à la Nouvelle Jérusalem, progressez le long d'un sentier panoramique
                respectant fidèlement le texte de la Louis Segond 1910.
              </p>
              <ul className="pillar-bullets">
                <li><CheckCircle2 size={14} /> Questions aléatoires et fraîches</li>
                <li><CheckCircle2 size={14} /> Conseils de recherche théologique</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box gold">
                <Flame size={24} />
              </div>
              <h3>Défis de Foi & Lampes de Vie</h3>
              <p>
                Stimulez votre mémoire avec des énigmes subtiles, un chronomètre dynamique dégressif
                et vos 5 lampes de foi. Une halte bienveillante au Puits de Jacob vous régénère en cas de doute.
              </p>
              <ul className="pillar-bullets">
                <li><CheckCircle2 size={14} /> Glisser / déposer tactile & fluide</li>
                <li><CheckCircle2 size={14} /> Mode contemplatif sans pression</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box green">
                <Leaf size={24} />
              </div>
              <h3>Le Jardin de la Parole (Leitner)</h3>
              <p>
                Arrosez les versets de vie dans votre jardin intérieur grâce à la répétition espacée (1 jour, 3 jours, 1 semaine, 1 mois)
                pour les inscrire à jamais dans votre mémoire.
              </p>
              <ul className="pillar-bullets">
                <li><CheckCircle2 size={14} /> Écoute audio de la Parole</li>
                <li><CheckCircle2 size={14} /> Carnet spirituel intime & chiffré</li>
              </ul>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box blue">
                <Smartphone size={24} />
              </div>
              <h3>PWA Hors-Ligne & Multi-Écrans</h3>
              <p>
                Installez l'application sur votre écran d'accueil et jouez même au désert sans connexion.
                Dès que le réseau revient, vos données sont synchronisées automatiquement.
              </p>
              <ul className="pillar-bullets">
                <li><CheckCircle2 size={14} /> 100% fonctionnel hors ligne</li>
                <li><CheckCircle2 size={14} /> Partage de score & invitations Brevo</li>
              </ul>
            </div>
          </div>
        </section>

        {/* BANDEAU DE BIENVENUE FRATERNELLE */}
        <section className="landing-footer-note">
          <Heart size={24} className="heart-pulse" />
          <div>
            <b>Une marche paisible et sans jugement</b>
            <p>
              Aucun prérequis n'est nécessaire : débutant curieux ou lecteur passionné des Écritures,
              avancez à votre propre rythme dans la joie et la paix.
            </p>
          </div>
          <button
            type="button"
            className="landing-btn-inline"
            onClick={onLoginClick}
          >
            Commencer maintenant →
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="church-ownership-badge-landing">
          <span className="church-cross-symbol">✝</span>
          <div className="church-info-landing">
            <strong>Propriété & Paternité Spirituelle</strong>
            <p>
              Ce jeu est la propriété exclusive de l'<b>Église Évangélique Assemblée de la Grâce</b>, sise à <b>Issia (Côte d'Ivoire)</b>.
            </p>
            <small>Œuvre chrétienne dédiée à l'édification de la foi et à l'enracinement dans la Parole de Dieu.</small>
          </div>
        </div>

        <p className="landing-app-credits">✦ Le Grand Pèlerinage de la Bible · Application Web Progressive & Évangélique</p>
        <p className="license">Basé sur la Sainte Bible selon la version Louis Segond 1910 (domaine public).</p>
      </footer>
    </div>
  );
}
