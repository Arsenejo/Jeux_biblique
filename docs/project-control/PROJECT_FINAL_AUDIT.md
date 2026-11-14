# Audit Final — Stabilisation V1.2.1 (14 novembre 2026)

Le projet **Défi Jean** + **Le Grand Pèlerinage de la Bible** est stabilisé, construit en production sans erreur et vérifié sur l'ensemble des tests automatisés (y compris en exécution autonome et hors-ligne).

## Vérifications effectuées (V1.2.1)
- `node verifier-questions.js` : **126 questions / 10 niveaux validés** (0 anomalie).
- `npm test` : **77 / 77 tests passants (0 échec)**, incluant la normalisation `whosaid`/`truefalse`, la réconciliation sans injection d'étape `[1]`, le calcul de série quotidienne (`updateDailyStreak`), l'accès aux 18 chapitres bibliques, l'authentification stricte de `auteurId` sur `/prieres` (`firestore_prayers.test.js`) et l'indépendance vis-à-vis du répertoire courant ou du réseau.
- `npm --prefix grand_pelerinage_v1 run build` : **1 614 modules transformés, build Vite de production réussi**.
- `npm --prefix grand_pelerinage_v1 audit --audit-level=high` : **0 vulnérabilité**.

## Correctifs livrés en V1.2 & V1.2.1
- Branchement effectif de `InfiniteArenaModal`, `Bible66BooksModal` et des 9 `BONUS_STAGES` (IDs 73–81) dans `src/main.jsx` avec styles complets et mode nuit dans `src/styles.css`.
- Sécurisation des formats `whosaid` (chaînes vs objets) et `truefalse` dans `infiniteQuizEngine.js`, `InfiniteArenaModal.jsx` et `main.jsx`.
- Exposition dynamique des **18 chapitres / 13 livres** de `BIBLE_CHAPTERS` via `BOOK_CHAPTERS_MAP` et synchronisation du sélecteur.
- Synchronisation cloud bidirectionnelle du Carnet Spirituel (`loadCarnetNotes`), gestion de la série quotidienne (`updateDailyStreak`), fusion de `masteredBooks` et correction du profil vierge dans `dataReconciliation.js`.
- **Intégration du correctif `grand_pelerinage_v1_corrige.zip`** : `addCommunityPrayer()` (`src/services/firebase.js`) injecte désormais systématiquement `auteurId: currentUser.uid` depuis Firebase Auth (jamais depuis les données du formulaire, supprimant tout `auteurId` sans session valide), accompagné des 2 tests de régression dans `tests/firestore_prayers.test.js` et de `CORRECTION_FIRESTORE_PRIERES.md`.
- **Fiabilisation des tests en environnement isolé / hors-ligne** : résolution relative à `import.meta.url` dans `tests/mail_server.test.js` (`../api/mailCore.cjs`) et `tests/content_integrity.test.js` (repli autonome à 126 étapes lorsque `../../questions.js` est absent), et repli hors-ligne sur `package-lock.json` dans `tests/security_and_penetration.test.js` uniquement lors d'erreurs réseau npm.
- Pipeline CI renforcé (`.github/workflows/ci.yml` avec build + audit de sécurité).

## Reste ouvert (Feuille de route V2)
- Déploiement officiel de `firestore.rules` (`firebase deploy --only firestore:rules`), test réel de publication de prière avec un compte Firebase connecté, configuration de `BREVO_API_KEY` sur Vercel et tests émulateur Firebase Rules.
- Découpage modulaire de `src/main.jsx` et `src/styles.css`.
- Synchronisation Firestore des Groupes d'Église (`churchGroup.js`) et extension progressive du texte biblique intégral.
