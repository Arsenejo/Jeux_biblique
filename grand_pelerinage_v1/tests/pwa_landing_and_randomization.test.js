import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reconcilePelerinData } from "../src/services/dataReconciliation.js";
import { EPOCH_STAGES, BIBLE_EPOCHS } from "../src/data/bibleData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

test("PWA: Le manifeste Web App W3C est valide et complet", () => {
  const manifestPath = path.join(rootDir, "public", "manifest.webmanifest");
  assert.ok(fs.existsSync(manifestPath), "public/manifest.webmanifest doit exister");

  const content = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  assert.equal(content.name, "Le Grand Pèlerinage de la Bible");
  assert.equal(content.short_name, "Pèlerinage");
  assert.equal(content.display, "standalone");
  assert.ok(content.start_url.startsWith("/"), "start_url doit pointer vers la racine");
  assert.equal(content.theme_color, "#073763");
  assert.ok(Array.isArray(content.icons) && content.icons.length >= 3, "Doit déclarer au moins 3 icônes");

  // Vérifier la présence physique des icônes
  for (const icon of content.icons) {
    const iconFile = path.join(rootDir, "public", icon.src.replace(/^\//, ""));
    assert.ok(fs.existsSync(iconFile), `L'icône déclarée ${icon.src} doit exister sur le disque`);
    const stats = fs.statSync(iconFile);
    assert.ok(stats.size > 100, `L'icône ${icon.src} ne doit pas être vide`);
  }
});

test("PWA: Le Service Worker (sw.js) assure la mise en cache hors-ligne", () => {
  const swPath = path.join(rootDir, "public", "sw.js");
  assert.ok(fs.existsSync(swPath), "public/sw.js doit exister");

  const swContent = fs.readFileSync(swPath, "utf-8");
  assert.ok(swContent.includes("grand-pelerinage-"), "Doit définir un cache versionné");
  assert.ok(swContent.includes("PRECACHE_ASSETS"), "Doit pré-mettre en cache les assets vitaux");
  assert.ok(swContent.includes("network-first") || swContent.includes("fetch"), "Doit gérer les requêtes réseau");
  assert.ok(swContent.includes("caches.match"), "Doit fournir un fallback hors ligne");
});

test("PWA: index.html contient les balises Apple Mobile et le lien du manifeste", () => {
  const indexPath = path.join(rootDir, "index.html");
  const html = fs.readFileSync(indexPath, "utf-8");
  assert.ok(html.includes('rel="manifest"'), "Doit lier le manifeste web");
  assert.ok(html.includes('apple-mobile-web-app-capable'), "Doit supporter iOS PWA en standalone");
  assert.ok(html.includes('name="theme-color"'), "Doit définir la couleur de thème mobile");
});

test("Landing Gate & Embarquement: Le composant WelcomeLanding existe et propose les actions clés", () => {
  const landingPath = path.join(rootDir, "src", "components", "WelcomeLanding.jsx");
  assert.ok(fs.existsSync(landingPath), "WelcomeLanding.jsx doit exister");

  const content = fs.readFileSync(landingPath, "utf-8");
  assert.ok(content.includes("onLoginClick"), "Doit proposer le bouton de connexion/inscription");
  assert.ok(content.includes("onStartAsGuest"), "Doit proposer de commencer en visiteur sans bloquer");
  assert.ok(content.includes("Psaume 119:105"), "Doit citer le verset fondateur de la Louis Segond 1910");
  assert.ok(content.includes("72"), "Doit mentionner les 72 étapes");
  assert.ok(content.includes("PWA") || content.includes("pwaInstallPrompt"), "Doit intégrer l'installation PWA");
});

test("Randomisation: L'algorithme de mélange des questions et mots préserve tous les éléments originaux", () => {
  const shuffleArray = (arr) => {
    if (!Array.isArray(arr)) return [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const sampleBank = ["lumière", "ténèbres", "Dieu", "cieux", "terre", "matin", "soir"];
  const shuffled = shuffleArray(sampleBank);

  // Même longueur
  assert.equal(shuffled.length, sampleBank.length);
  // Même ensemble d'éléments
  assert.deepEqual(shuffled.slice().sort(), sampleBank.slice().sort());
});

test("Randomisation: Les 72 étapes peuvent être tirées aléatoirement pour le Défi Providenciel", () => {
  const allStages = [];
  Object.values(EPOCH_STAGES).forEach((epochList) => {
    if (Array.isArray(epochList)) {
      allStages.push(...epochList);
    }
  });

  assert.ok(allStages.length >= 72, "Le jeu doit avoir au moins 72 étapes sélectionnables");

  const randomIndex = Math.floor(Math.random() * allStages.length);
  const pickedStage = allStages[randomIndex];
  assert.ok(pickedStage.id, "L'étape tirée aléatoirement doit avoir un ID");
  assert.ok(pickedStage.titre, "L'étape tirée aléatoirement doit avoir un titre");
  assert.ok(pickedStage.ref, "L'étape tirée aléatoirement doit avoir une référence biblique");
});

test("Hors-ligne & Reconnexion: ReconcilePelerinData restaure toutes les étapes jouées hors ligne", () => {
  const offlineProgress = {
    profileName: "Pèlerin Hors-Ligne",
    saved: {
      completedStages: [1, 2, 5, 8],
      xp: 240,
      pearls: 6,
      streak: 3,
      lampes: 4
    }
  };

  const cloudAccount = {
    profileName: "Pèlerin Cloud",
    saved: {
      completedStages: [1, 3, 4],
      xp: 180,
      pearls: 4,
      streak: 2,
      lampes: 5
    }
  };

  const reconciled = reconcilePelerinData(offlineProgress, cloudAccount);

  // Union sans perte des étapes [1, 2, 3, 4, 5, 8]
  assert.deepEqual(reconciled.completedStages.sort((a, b) => a - b), [1, 2, 3, 4, 5, 8]);
  // Meilleur score
  assert.equal(reconciled.xp, 240);
  assert.equal(reconciled.pearls, 6);
  assert.equal(reconciled.streak, 3);
});
