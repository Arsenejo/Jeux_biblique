# Correction — publication des prières

## Modification
`src/services/firebase.js` — `addCommunityPrayer()` récupère désormais `auth.currentUser.uid` depuis Firebase Authentication et ajoute cette valeur au champ `auteurId` du document Firestore. L'identifiant n'est jamais accepté depuis les données du formulaire. Sans session Firebase authentifiée, la prière reste enregistrée localement (avec suppression de tout éventuel `auteurId` non authentifié) et aucune écriture cloud n'est tentée.

Cette correction satisfait la condition `request.resource.data.auteurId == request.auth.uid` déjà présente dans `firestore.rules`. Les règles Firestore n'ont pas été affaiblies ni modifiées.

## Fiabilisation des tests autonomes et hors-ligne
En complément du correctif `grand_pelerinage_v1_corrige.zip`, les trois fragilités d'environnement relevées lors de l'exécution isolée ont été corrigées :
1. `tests/mail_server.test.js` : résolution directe de `../api/mailCore.cjs` via `import.meta.url` (au lieu de dépendre du répertoire parent hors `grand_pelerinage_v1/`).
2. `tests/content_integrity.test.js` : résolution de `../../questions.js` via `import.meta.url` avec repli vérifiant les 126 étapes `JEAN_STAGES_BY_EPOCH` lorsque l'archive `grand_pelerinage_v1` est exécutée de façon autonome.
3. `tests/security_and_penetration.test.js` : repli hors-ligne sur l'intégrité de `package-lock.json` uniquement lorsque `npm audit --json` échoue par absence de réseau (tout en maintenant l'échec strict si des vulnérabilités sont signalées en ligne).

## Déploiement avant mise en production
1. Déployer les règles Firestore existantes :
   ```bash
   firebase deploy --only firestore:rules
   ```
2. Effectuer un essai réel de publication de prière avec un compte Firebase connecté (Google ou Email/Mot de passe) en production ou sur émulateur Firebase Auth + Firestore, puis vérifier l'apparition du document dans `/prieres/{prayerId}` avec `auteurId == request.auth.uid`.

