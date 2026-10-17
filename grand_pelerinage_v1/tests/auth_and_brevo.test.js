import test from "node:test";
import assert from "node:assert/strict";

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
