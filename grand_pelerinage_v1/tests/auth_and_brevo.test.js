import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

import { translateAuthError } from "../src/services/firebase.js";
import {
  isBrevoConfigured,
  sendBrevoEmail,
  sendWelcomeEmail,
  sendProgressSummaryEmail
} from "../src/services/brevoMailer.js";
import { reconcilePelerinData } from "../src/services/dataReconciliation.js";

// =========================================================================
// 1. TESTS D'AUTHENTIFICATION & TRADUCTION DES ERREURS
// =========================================================================
test("Auth: Traduction claire des erreurs Firebase en français", () => {
  assert.equal(
    translateAuthError({ code: "auth/invalid-email" }),
    "L'adresse e-mail renseignée n'est pas valide."
  );
  assert.equal(
    translateAuthError({ code: "auth/user-not-found" }),
    "Aucun compte pèlerin n'est associé à cette adresse e-mail."
  );
  assert.equal(
    translateAuthError({ code: "auth/wrong-password" }),
    "Le mot de passe saisi est incorrect."
  );
  assert.equal(
    translateAuthError({ code: "auth/invalid-credential" }),
    "Identifiants incorrects. Veuillez vérifier votre adresse e-mail et votre mot de passe."
  );
  assert.equal(
    translateAuthError({ code: "auth/email-already-in-use" }),
    "Cette adresse e-mail est déjà utilisée par un autre pèlerin."
  );
  assert.equal(
    translateAuthError({ code: "auth/weak-password" }),
    "Le mot de passe doit comporter au moins 6 caractères."
  );
  assert.equal(
    translateAuthError({ code: "auth/popup-closed-by-user" }),
    "La fenêtre de connexion Google a été fermée avant la finalisation."
  );
  assert.equal(
    translateAuthError({ code: "auth/api-key-not-valid.-please-pass-a-valid-api-key." }),
    "Connexion locale sécurisée : ton parcours est sauvegardé sur cet appareil avec amour et fidélité 🌿"
  );
  assert.equal(
    translateAuthError(new Error("Firebase: Error (auth/api-key-not-valid.-please-pass-a-valid-api-key.)")),
    "Connexion locale sécurisée : ton parcours est sauvegardé sur cet appareil avec amour et fidélité 🌿"
  );
});

// =========================================================================
// 2. TESTS DE SYNCHRONISATION MULTI-APPAREILS & REPRISE DE PARCOURS
// =========================================================================
test("Auth Multi-appareils: Retrouver son parcours et ses données sur un autre appareil ou navigateur", () => {
  // Scénario : Le pèlerin s'est arrêté à l'étape 5 sur son ordinateur (Cloud)
  const compteCloudExistant = {
    profileName: "Jean Pèlerin",
    email: "jean@example.com",
    xp: 240,
    pearls: 6,
    streak: 5,
    completedStages: [1, 2, 3, 4, 5],
    leitnerCards: {
      "Genèse 1:1": { ref: "Genèse 1:1", box: 3, lastReviewed: 1000 },
      "Jean 3:16": { ref: "Jean 3:16", box: 2, lastReviewed: 1200 }
    }
  };

  // Le joueur ouvre l'application sur un smartphone ou nouveau navigateur (données locales vierges)
  const nouveauNavigateurVierge = {
    profileName: "Ami pèlerin",
    xp: 0,
    pearls: 0,
    streak: 0,
    completedStages: [],
    leitnerCards: {}
  };

  // Lorsque l'authentification (Google ou Email) est effectuée :
  const donneesRestaurees = reconcilePelerinData(nouveauNavigateurVierge, compteCloudExistant);

  // Vérification que le joueur retrouve l'exactitude de son parcours
  assert.equal(donneesRestaurees.xp, 240, "Les points de joie (XP) doivent être intégralement restaurés");
  assert.equal(donneesRestaurees.pearls, 6, "Les perles célestes doivent être restaurées");
  assert.equal(donneesRestaurees.streak, 5, "La série de fidélité quotidienne doit être préservée");
  assert.deepEqual(donneesRestaurees.completedStages, [1, 2, 3, 4, 5], "Toutes les étapes doivent être débloquées");
  assert.ok(donneesRestaurees.leitnerCards["Jean 3:16"], "Le Jardin de la Parole doit être synchronisé");
});

test("Auth Multi-appareils: Fusion sans perte si le joueur a joué en invité avant de se connecter", () => {
  // Le joueur commence en invité sur sa tablette et réussit les étapes 1 et 2
  const sessionInvitee = {
    profileName: "Ami pèlerin",
    xp: 50,
    pearls: 2,
    completedStages: [1, 2],
    leitnerCards: {
      "Genèse 1:1": { ref: "Genèse 1:1", box: 1 }
    }
  };

  // Il se connecte à son compte existant qui avait déjà les étapes 1, 3 et 4 faites ailleurs
  const compteExistant = {
    profileName: "Pierre",
    xp: 120,
    pearls: 4,
    completedStages: [1, 3, 4],
    leitnerCards: {
      "Genèse 1:1": { ref: "Genèse 1:1", box: 2 },
      "Psaume 23:1": { ref: "Psaume 23:1", box: 1 }
    }
  };

  const fusion = reconcilePelerinData(sessionInvitee, compteExistant);

  // Union mathématique : étapes [1, 2, 3, 4] préservées !
  assert.deepEqual(fusion.completedStages.sort(), [1, 2, 3, 4]);
  assert.equal(fusion.xp, 120);
  assert.equal(fusion.pearls, 4);
});

// =========================================================================
// 3. TESTS DU SERVICE BREVO (SENDINBLUE)
// =========================================================================
test("Brevo: Simulation gracieuse et robuste en l'absence de clé API", async () => {
  const result = await sendBrevoEmail({
    toEmail: "test@example.com",
    subject: "Test de connexion Brevo",
    htmlContent: "<p>Paix et grâce</p>"
  });

  assert.equal(result.success, true);
  assert.equal(result.simulated, true, "En l'absence de clé API, le mode simulation s'active sans erreur");
});

test("Brevo: Génération du courriel de bienvenue avec Écritures et encouragements", async () => {
  const res = await sendWelcomeEmail("nouveau.pelerin@example.fr", "Matthieu");
  assert.equal(res.success, true);
});

test("Brevo: Génération du récapitulatif spirituel personnalisé", async () => {
  const res = await sendProgressSummaryEmail("pelerin.fidele@example.fr", "Sarah", {
    xp: 320,
    pearls: 12,
    stagesCount: 8,
    versesCount: 5
  });
  assert.equal(res.success, true);
});

// =========================================================================
// 4. TESTS DE PERFECTION DES CHAMPS DE SAISIE ET MENTION DE PROPRIÉTÉ
// =========================================================================
test("Champs de saisie: Structure soignée, bascule de visibilité et neutralisation d'autofill", () => {
  const authModalPath = path.join(rootDir, "src", "components", "AuthModal.jsx");
  const authModalContent = fs.readFileSync(authModalPath, "utf-8");

  // Présence des classes de champs raffinés
  assert.ok(authModalContent.includes("auth-input-wrapper"), "Doit utiliser un wrapper ergonomique pour les inputs");
  assert.ok(authModalContent.includes("auth-input-field"), "Doit utiliser la classe auth-input-field pour les inputs");
  assert.ok(authModalContent.includes("auth-password-toggle-btn"), "Doit intégrer le bouton oeil pour révéler le mot de passe");
  assert.ok(authModalContent.includes("showPassword"), "Doit gérer l'état de visibilité du mot de passe");

  // Neutralisation du fond jaune/bleu de l'autofill dans styles.css
  const stylesPath = path.join(rootDir, "src", "styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");
  assert.ok(stylesContent.includes(":-webkit-autofill"), "Doit surcharger l'autofill des navigateurs");
  assert.ok(stylesContent.includes("box-shadow: 0 0 0 1000px"), "Doit neutraliser le fond d'autofill via box-shadow");
});

test("Propriété officielle: Mention de l'Église Évangélique Assemblée de la Grâce sise à Issia Côte d'Ivoire", () => {
  // 1. index.html
  const indexPath = path.join(rootDir, "index.html");
  const htmlContent = fs.readFileSync(indexPath, "utf-8");
  assert.ok(htmlContent.includes("Église Évangélique Assemblée de la Grâce"), "index.html doit citer l'Église");
  assert.ok(htmlContent.includes("Issia"), "index.html doit mentionner Issia");
  assert.ok(htmlContent.includes("Côte d'Ivoire"), "index.html doit mentionner Côte d'Ivoire");

  // 2. AuthModal.jsx
  const authModalPath = path.join(rootDir, "src", "components", "AuthModal.jsx");
  const authModalContent = fs.readFileSync(authModalPath, "utf-8");
  assert.ok(authModalContent.includes("Église Évangélique Assemblée de la Grâce"), "AuthModal doit afficher la propriété");
  assert.ok(authModalContent.includes("Issia (Côte d'Ivoire)"), "AuthModal doit préciser Issia (Côte d'Ivoire)");

  // 3. WelcomeLanding.jsx
  const landingPath = path.join(rootDir, "src", "components", "WelcomeLanding.jsx");
  const landingContent = fs.readFileSync(landingPath, "utf-8");
  assert.ok(landingContent.includes("Église Évangélique Assemblée de la Grâce"), "WelcomeLanding doit afficher la propriété");
  assert.ok(landingContent.includes("Issia"), "WelcomeLanding doit préciser Issia");

  // 4. main.jsx
  const mainPath = path.join(rootDir, "src", "main.jsx");
  const mainContent = fs.readFileSync(mainPath, "utf-8");
  assert.ok(mainContent.includes("Église Évangélique Assemblée de la Grâce"), "main.jsx doit afficher la propriété");
  assert.ok(mainContent.includes("Issia (Côte d'Ivoire)"), "main.jsx doit mentionner Issia (Côte d'Ivoire)");
});

test("Modale Auth: Responsivité absolue et confinement dans l'écran sans dépassement", () => {
  const stylesPath = path.join(rootDir, "src", "styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");

  // modal-overlay doit être scrollable sans cliper
  assert.ok(stylesContent.includes(".modal-overlay"), "modal-overlay doit être présent");
  assert.ok(stylesContent.includes("overscroll-behavior: contain"), "modal-overlay doit contenir le scroll");

  // auth-modal-card doit être borné en hauteur et scrollable en interne
  assert.ok(stylesContent.includes("max-height: calc(100vh - 28px)"), "auth-modal-card doit borner sa hauteur à l'écran");
  assert.ok(stylesContent.includes("overflow-y: auto"), "auth-modal-card doit pouvoir défiler");

  // Media query pour écrans courts (laptops, claviers virtuels, devtools ouverts)
  assert.ok(stylesContent.includes("@media (max-height: 720px)"), "Doit adapter les paddings pour écrans compacts");
});

test("Thème Nuit: Lisibilité et contraste parfait des textes (treasure-card, eyebrow, muted, footer)", () => {
  const stylesPath = path.join(rootDir, "src", "styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");

  // Vérifier la redéfinition des variables de texte et de sourdine en mode nuit
  assert.ok(stylesContent.includes("body.night-mode {\n  --text: #f0f6fc;"), "body.night-mode doit redéfinir --text");
  assert.ok(stylesContent.includes("--muted: #94a9c0;"), "body.night-mode doit redéfinir --muted avec haut contraste");

  // Vérifier la carte du trésor (coffre des perles) en mode nuit
  assert.ok(stylesContent.includes("body.night-mode .treasure-card b {"), "Le titre du coffre des perles doit être stylé en mode nuit");
  assert.ok(stylesContent.includes("body.night-mode .treasure-card p {"), "Le descriptif du coffre des perles doit être stylé en mode nuit");

  // Vérifier l'eyebrow en mode nuit
  assert.ok(stylesContent.includes("body.night-mode .eyebrow {\n  color: #4ade80;"), "L'eyebrow doit être vert menthe éclatant en mode nuit");

  // Vérifier le pied de page en mode nuit
  assert.ok(stylesContent.includes("body.night-mode .footer {\n  color: #94a9c0;"), "Le footer doit être lisible en mode nuit");

  // Vérifier le scroll de la barre latérale pour ne jamais couper l'attribution
  assert.ok(stylesContent.includes(".sidebar {\n  position: fixed;"), "La sidebar doit exister");
  assert.ok(stylesContent.includes("overflow-y: auto"), "La sidebar doit avoir overflow-y: auto pour rester accessible");
});

test("Responsivité Mobile: Élimination du défilement horizontal et adaptation 320px–800px", () => {
  const stylesPath = path.join(rootDir, "src", "styles.css");
  const stylesContent = fs.readFileSync(stylesPath, "utf-8");
  const mainPath = path.join(rootDir, "src", "main.jsx");
  const mainContent = fs.readFileSync(mainPath, "utf-8");

  // 1. Confinement strict du viewport racine pour éliminer la barre de défilement horizontal
  assert.ok(
    stylesContent.includes("max-width: 100vw") && stylesContent.includes("overflow-x: hidden"),
    "html et body doivent être strictement bornés à 100vw sans débordement horizontal"
  );
  assert.ok(
    stylesContent.includes(".app-shell {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  width: 100%;\n  max-width: 100vw;\n  overflow-x: hidden;"),
    ".app-shell doit être bornée à 100vw avec overflow-x: hidden"
  );

  // 2. Main content et Topbar sur mobile
  assert.ok(
    stylesContent.includes(".main-content {\n  margin-left: 250px;\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n  min-width: 0;\n  max-width: calc(100vw - 250px);\n  overflow-x: hidden;"),
    ".main-content doit avoir min-width: 0 et overflow-x: hidden pour empêcher l'expansion par les enfants flex"
  );

  // 3. Masquage responsive des éléments superflus de la topbar sur mobile
  assert.ok(
    mainContent.includes('<span className="hide-mobile">Le Grand Pèlerinage</span>'),
    "Le préfixe textuel du fil d'Ariane doit être masqué sur mobile"
  );
  assert.ok(
    mainContent.includes('className="profile-chip hide-mobile"'),
    "Le chip de profil redondant dans la topbar doit être masqué sur mobile au profit de la bottom navigation"
  );
  assert.ok(
    mainContent.includes('className="icon-button hide-mobile"'),
    "Le bouton d'encouragement redondant dans la topbar doit être masqué sur mobile"
  );

  // 4. Règles de mise en page réactives pour cartes & progression
  assert.ok(stylesContent.includes(".journey-summary {\n    flex-wrap: wrap;"), "journey-summary doit s'adapter en multi-lignes sur mobile");
  assert.ok(stylesContent.includes(".next-step {\n    flex-direction: column;"), "next-step doit s'empiler verticalement sur mobile");
  assert.ok(stylesContent.includes(".auth-badge-name {\n    max-width: 75px;"), "auth-badge-name doit tronquer les pseudos trop longs avec ellipsis");
  assert.ok(stylesContent.includes("@media (max-width: 380px)"), "Un palier ultra-compact doit exister pour les petits smartphones");
});

