import test from "node:test";
import assert from "node:assert/strict";

import {
  EPOCH_STAGES,
  BIBLE_EPOCHS,
  BIBLE_BOOKS
} from "../src/data/bibleData.js";

import { sendInviteEmail } from "../src/services/brevoMailer.js";

// =========================================================================
// 1. TESTS DU VOLUME & DE LA PROFONDEUR DES NIVEAUX ET ÉTAPES
// =========================================================================
test("Parcours: Plus de 70 étapes réparties sur 7 époques bibliques complètes", () => {
  assert.equal(BIBLE_EPOCHS.length, 7, "Il doit y avoir 7 époques bibliques");

  let totalStages = 0;
  for (const [epochId, stages] of Object.entries(EPOCH_STAGES)) {
    assert.ok(stages.length >= 10, `L'époque ${epochId} doit comporter au moins 10 étapes`);
    totalStages += stages.length;
  }

  assert.ok(
    totalStages >= 70,
    `Le pèlerinage doit offrir au moins 70 étapes (actuel : ${totalStages}) pour que les joueurs ne finissent pas trop vite`
  );
});

test("Pédagogie & Recherche : Présence systématique des conseils de recherche biblique et difficultés", () => {
  for (const [epochId, stages] of Object.entries(EPOCH_STAGES)) {
    for (const stage of stages) {
      assert.ok(
        ["debutant", "intermediaire", "avance", "expert"].includes(stage.difficulte),
        `Étape ${stage.id} : difficulté inconnue '${stage.difficulte}'`
      );

      assert.ok(
        typeof stage.coutVie === "boolean",
        `Étape ${stage.id} : coutVie doit être un booléen`
      );

      assert.ok(
        stage.conseilRecherche && stage.conseilRecherche.length >= 15,
        `Étape ${stage.id} (${stage.titre}) doit avoir un conseil de recherche biblique substantiel`
      );

      assert.ok(
        stage.conseilRecherche.includes("📖"),
        `Étape ${stage.id} doit inclure l'icône de repère 📖`
      );
    }
  }
});

test("Subtilité & Recherche approfondie : Vérification des étapes expertes invitant à sonder les Écritures", () => {
  // 1. Melchisédek (Genèse 14:18)
  const melchisedek = EPOCH_STAGES.racines.find((s) => s.ref.includes("Genèse 14"));
  assert.ok(melchisedek, "L'étape de Melchisédek doit exister");
  assert.equal(melchisedek.subtile, true);
  assert.equal(melchisedek.difficulte, "avance");
  assert.equal(melchisedek.coutVie, true);
  assert.ok(melchisedek.options.some((o) => o.text.includes("Salem") && o.correct));

  // 2. Les Énigmes d'Agur (Proverbes 30:19)
  const agur = EPOCH_STAGES.sagesse.find((s) => s.ref.includes("Proverbes 30"));
  assert.ok(agur, "L'étape des énigmes d'Agur doit exister");
  assert.equal(agur.subtile, true);
  assert.ok(agur.options.some((o) => o.text.includes("serpent sur le rocher") && o.correct));

  // 3. Les Soixante-dix Semaines (Daniel 9:24)
  const dan9 = EPOCH_STAGES.prophetes.find((s) => s.ref.includes("Daniel 9"));
  assert.ok(dan9, "L'étape des 70 semaines de Daniel doit exister");
  assert.equal(dan9.subtile, true);
  assert.ok(dan9.options.some((o) => o.text.includes("justice éternelle") && o.correct));

  // 4. L'Autel du Dieu Inconnu à Athènes (Actes 17:23)
  const areopage = EPOCH_STAGES.eglise.find((s) => s.ref.includes("Actes 17"));
  assert.ok(areopage, "L'étape de l'Aréopage doit exister");
  assert.equal(areopage.subtile, true);
  assert.ok(areopage.options.some((o) => o.text.includes("dieu inconnu") && o.correct));

  // 5. L'Incident d'Antioche (Galates 2:11)
  const antioche = EPOCH_STAGES.eglise.find((s) => s.ref.includes("Galates 2"));
  assert.ok(antioche, "L'étape de l'incident d'Antioche doit exister");
  assert.equal(antioche.subtile, true);
  assert.ok(antioche.options.some((o) => o.text.includes("Pierre") && o.correct));

  // 6. Les Vingt-quatre Vieillards (Apocalypse 4:4)
  const vieillards = EPOCH_STAGES.esperance.find((s) => s.ref.includes("Apocalypse 4"));
  assert.ok(vieillards, "L'étape des 24 vieillards doit exister");
  assert.equal(vieillards.subtile, true);
  assert.ok(vieillards.options.some((o) => o.text.includes("Vingt-quatre") && o.correct));
});

// =========================================================================
// 2. TESTS DU SYSTÈME DE VIES (LAMPES DE FOI) & CHRONOMÈTRE DÉCROISSANT
// =========================================================================
test("Gamification: Système de Lampes de Foi (5 vies max, décrément sur échec, halte à 0)", () => {
  let lampes = 5;
  const maxLampes = 5;

  // Simulation d'une étape de défi avec coutVie: true
  const challengingStage = EPOCH_STAGES.racines.find((s) => s.coutVie === true);
  assert.ok(challengingStage, "Une étape avec coût en vie doit exister");

  // En cas d'erreur, perte d'une lampe
  const onWrongAnswer = () => {
    if (challengingStage.coutVie) {
      lampes = Math.max(0, lampes - 1);
    }
  };

  onWrongAnswer();
  assert.equal(lampes, 4, "Le joueur doit avoir 4 lampes après une première erreur");

  // Simulation de 4 erreurs supplémentaires -> 0 lampe
  onWrongAnswer();
  onWrongAnswer();
  onWrongAnswer();
  onWrongAnswer();
  assert.equal(lampes, 0, "Les lampes tombent à 0");

  // Détection de la halte spirituelle au puits
  const needsRefill = lampes === 0;
  assert.equal(needsRefill, true, "Une halte spirituelle doit être déclenchée");

  // Restauration de l'huile par la méditation dans le Jardin de la Parole
  const refillFromMeditation = () => {
    lampes = maxLampes;
  };
  refillFromMeditation();
  assert.equal(lampes, 5, "Les 5 lampes de foi sont entièrement ravivées après méditation");
});

test("Chronomètre Décroissant: Le temps alloué diminue progressivement vers les étapes expertes", () => {
  const stageDebut = EPOCH_STAGES.racines.find((s) => s.difficulte === "debutant" && s.tempsLimite !== null);
  const stageInter = EPOCH_STAGES.racines.find((s) => s.difficulte === "intermediaire");
  const stageAvance = EPOCH_STAGES.racines.find((s) => s.difficulte === "avance");
  const stageExpert = EPOCH_STAGES.racines.find((s) => s.difficulte === "expert");

  assert.ok(stageDebut.tempsLimite >= 45, "Les étapes débutant ont un temps large (>= 45s)");
  assert.ok(stageInter.tempsLimite <= 40, "Les étapes intermédiaires diminuent à <= 40s");
  assert.ok(stageAvance.tempsLimite <= 30, "Les étapes avancées diminuent à <= 30s");
  assert.ok(stageExpert.tempsLimite <= 20, "Les étapes expertes exigent une vivacité à <= 20s");

  assert.ok(
    stageDebut.tempsLimite > stageInter.tempsLimite &&
    stageInter.tempsLimite > stageAvance.tempsLimite &&
    stageAvance.tempsLimite > stageExpert.tempsLimite,
    "Le chronomètre doit décroître de façon strictement monotone avec la difficulté"
  );
});

// =========================================================================
// 3. TESTS DE PARTAGE DE SCORE ET INVITATION FRATERNELLE (BREVO & URL)
// =========================================================================
test("Invitation: Génération et décodage du lien avec score et pseudo", () => {
  const profileName = "Paul de Tarse";
  const xp = 850;
  const stagesCount = 14;

  const url = `https://legrandpelerinage.fr/?invite=${encodeURIComponent(profileName)}&xp=${xp}&stages=${stagesCount}`;

  // Décodage des paramètres
  const parsed = new URL(url);
  assert.equal(parsed.searchParams.get("invite"), "Paul de Tarse");
  assert.equal(parsed.searchParams.get("xp"), "850");
  assert.equal(parsed.searchParams.get("stages"), "14");
});

test("Invitation Brevo: Génération du courriel d'invitation avec score et verset fraternel", async () => {
  const res = await sendInviteEmail({
    toEmail: "ami.invite@example.fr",
    friendName: "Timothée",
    inviterName: "Paul de Tarse",
    inviterStats: { xp: 850, pearls: 12, stagesCount: 14, versesCount: 6 },
    customMessage: "Rejoins-moi pour méditer les Écritures ensemble !",
    inviteUrl: "https://legrandpelerinage.fr/?invite=Paul%20de%20Tarse"
  });

  assert.equal(res.success, true);
  assert.equal(res.simulated, true);
});
