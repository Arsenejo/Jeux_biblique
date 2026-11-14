import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../src/services/firebase.js", import.meta.url), "utf8");
const start = source.indexOf("export async function addCommunityPrayer");
const end = source.indexOf("/**", start + 10);
const implementation = source.slice(start, end > start ? end : undefined);

test("une prière cloud reçoit l'identité du compte Firebase authentifié", () => {
  assert.match(implementation, /const \{ db, auth \} = getFirebaseServices\(\)/);
  assert.match(implementation, /auteurId: currentUser\.uid/);
  assert.match(implementation, /if \(!db \|\| !currentUser\?\.uid\) return localPrayers/);
});

test("l'identité de l'auteur n'est pas prise depuis les données du formulaire", () => {
  assert.match(implementation, /\.\.\.prayer,[\s\S]*auteurId: currentUser\.uid/);
});

