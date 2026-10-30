import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const { processMail, resetRateLimit } = require(path.resolve("..", "api", "mailCore.cjs"));

test("Le serveur refuse un courriel arbitraire et simule sans clé", async () => {
  resetRateLimit();
  const rejected = await processMail({ htmlContent: "<script>alert(1)</script>" }, {}, "test-a");
  assert.equal(rejected.status, 400);

  const welcome = await processMail(
    { kind: "welcome", toEmail: "ami@example.com", pilgrimName: "<b>Anne</b>" },
    {},
    "test-b"
  );
  assert.equal(welcome.status, 200);
  assert.equal(welcome.body.simulated, true);
  assert.equal(welcome.body.success, true);
});

test("Une invitation javascript: ne devient pas un lien cliquable", async () => {
  resetRateLimit();
  const built = await processMail(
    {
      kind: "invite",
      toEmail: "ami@example.com",
      inviterName: "Paul",
      friendName: "Lydie",
      customMessage: "Paix à toi",
      inviteUrl: "javascript:alert(1)"
    },
    { BREVO_API_KEY: "" },
    "test-c"
  );
  assert.equal(built.body.simulated, true);
});

test("Le serveur bloque les coordonnées dans une invitation", async () => {
  resetRateLimit();
  const blocked = await processMail(
    {
      kind: "invite",
      toEmail: "ami@example.com",
      customMessage: "Écris-moi sur secret@example.com"
    },
    {},
    "test-d"
  );
  assert.equal(blocked.status, 400);
});
