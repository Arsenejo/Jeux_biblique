# État de Référence Avant Transformation V2.0 (14 novembre 2026)

Ce document fige l'état vérifié de référence de **Jeux Bibliques** (`Défi Jean` + `Le Grand Pèlerinage de la Bible` V1.2.1) avant le déploiement de la **Version 2.0**.

## 1. Métriques Vérifiées (Commit `9bd8491` sur `main`)
- **Banque historique Défi Jean** (`node verifier-questions.js`) : **126 questions / 10 niveaux validés** (`0` erreur).
- **Parcours Grand Pèlerinage** : **281 étapes au total** (`72` de base dans `bibleData.js` + `74` dans `extendedStages.js` + `126` dans `jeanStages.js` + `9` défis bonus `BONUS_STAGES`).
- **Encyclopédie & Lecteur biblique** : **66 livres** dans `bible66Books.js` ; **18 chapitres** intégraux LSG 1910 sur **13 livres** dans `BIBLE_CHAPTERS`.
- **Suite de tests automatisés (`npm test`)** : **77 / 77 tests passants** (`0` échec, testés aussi en mode autonome et hors-ligne).
- **Build Vite de production** : **1 614 modules transformés**, `dist/` construit sans erreur.
- **Audit de vulnérabilités (`npm audit --audit-level=high`)** : **0 vulnérabilité**.

## 2. Infrastructure & Sécurité
- **Firebase Auth & Cloud Firestore** (`projet defi-jean`) : règles `firestore.rules` déployées et actives en production (`/pelerins/{uid}`, `/pelerins/{uid}/carnet/{noteId}`, `/classement_pelerins/{uid}`, `/prieres/{prayerId}` avec `auteurId == request.auth.uid`, `/pseudos_enregistres/{cleanPseudo}`, `/classement_defi_jean/{joueurId}`).
- **Vercel** : en ligne sur `https://jeux-eeag.vercel.app` avec fonction serverless `/api/send-email` (`api/mailCore.cjs`).
- **PWA** : `manifest.webmanifest` + Service Worker `public/sw.js`.

## 3. Architecture & Points à Enrichir en V2.0
- `src/main.jsx` (3 543 lignes) et `src/styles.css` (6 550 lignes) concentrent actuellement l'UI : les fonctionnalités V2.0 seront extraites dans des modules dédiés par domaine (`features/home`, `features/games`, `features/memorization`, `features/notifications`, `features/community`, `features/bible`, `features/profile`, `features/admin`).
- Nouveaux modules V2 à livrer : 9 nouveaux jeux bibliques, moteur central de mémorisation en 4 étapes et vérification différée (24h/7j/30j), gamification avancée (titres, collections, missions, coffres), notifications intelligentes + FCM/Push + centre de notifications, profils pédagogiques + accessibilité, groupes d'église Firestore + défis collectifs, 10 chapitres LSG 1910 supplémentaires + parcours thématiques, et espace administrateur / responsables d'Église.

