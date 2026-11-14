# GUIDE TECHNIQUE & DÉPLOIEMENT — VERSION 2.0
## Le Grand Pèlerinage de la Bible (Église Évangélique Assemblée de la Grâce, Issia — Côte d'Ivoire)

---

## 1. Vue d'ensemble de l'architecture V2.0

L'application principale (`grand_pelerinage_v1/`, React 18 + Vite 6 PWA + Firebase Auth & Firestore + Service Worker `/sw.js`) a été enrichie de façon modulaire sans rupture avec les acquis et sauvegardes V1 :

- **Navigation principale (5 espaces + Fraternité)** : `Accueil`, `Parcours`, `Jeux`, `Bible`, `Profil`, avec accès direct à `Fraternité` depuis la barre latérale et les cartes d'accueil/profil.
- **Modules fonctionnels UI (`grand_pelerinage_v1/src/features/`)** :
  - `games/GamesHubView.jsx` : 9 jeux bibliques complets + lanceurs Arène Infinie et 66 Livres.
  - `memorization/MemorizationHubModal.jsx` : *Je retiens la Parole — Mes Versets* en 4 étapes (`DECOUVERTE` → `ENTRAINEMENT` → `MEMORISATION` → `MAITRISE`) avec validation différée réelle (≥ 24h, 7j, 30j).
  - `notifications/NotificationCenterModal.jsx` : Boîte de réception avec pastille non-lues, panneau `MES NOTIFICATIONS` (plafond quotidien, heures silencieuses, pause 24h/7j, 7 catégories, consentement volontaire Web Push/FCM, instructions iOS PWA).
  - `home/HomeDashboardV2.jsx` : Tableau de bord personnel V2.0 (titre honorifique, progression globale, série, Défi du Jour, versets à réviser, 5 missions, collections, annonces d'Église).
  - `community/CommunityGroupsV2.jsx` : Groupes d'Église synchronisés sur Firestore (`/groupes_eglise/{code}`) avec repli hors-ligne, 4 défis collectifs et 5 classements fraternels.
  - `bible/BibleStudyEnhancements.jsx` : Introductions aux livres, personnages clés, 10 nouveaux passages LSG 1910 (`EXTENDED_BIBLE_CHAPTERS`) et 6 parcours thématiques/par livres.
  - `admin/ChurchAdminModal.jsx` : Tableau Responsables d'Église (statistiques agrégées, difficulté par époque, annonces officielles `/annonces_eglise`, modération publique — sans aucun accès au carnet spirituel privé ni aux e-mails/téléphones).
  - `profile/PedagogicalAndAccessibilityCard.jsx` : 3 profils pédagogiques (`decouverte`, `explorateur`, `expert`), taille du texte (`normal`/`large`/`xlarge`), animations réduites, audio/vibrations, 6 titres honorifiques et 6 collections.

---

## 2. Prérequis & Variables d'Environnement

Dans `grand_pelerinage_v1/.env` (et variables d'environnement Vercel) :
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID` (`defi-jean`), `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.
- **Optionnel pour Web Push FCM lorsque l'application est fermée** :
  - `VITE_FIREBASE_VAPID_KEY` : clé publique Web Push générée dans *Console Firebase → Paramètres du projet → Cloud Messaging → Certificats Push Web*.
  - En son absence, l'ensemble du Centre de Notifications, de la génération intelligente dans l'application, des heures silencieuses et de la synchronisation Firestore (`/pelerins/{uid}/notifications`) fonctionne pleinement ; seule la délivrance Push distante navigateur fermé nécessite cette clé + une Cloud Function planifiée côté serveur.
- **Optionnel pour e-mails Brevo** : `BREVO_API_KEY` côté serveur Vercel (`/api/send-email`).

---

## 3. Commandes d'Installation, Tests et Build

```bash
# 1. Vérification intégrité des 126 questions historiques du Défi Jean
node verifier-questions.js

# 2. Suite complète des tests automatisés (V1 + Sécurité + E2E + V2)
npm --prefix grand_pelerinage_v1 test

# 3. Build de production Vite + PWA
npm --prefix grand_pelerinage_v1 run build

# 4. Audit de sécurité des dépendances
npm --prefix grand_pelerinage_v1 audit --audit-level=high
```

---

## 4. Règles Firestore & Déploiement Production

- **Règles Firestore** (`firestore.rules` à la racine et `grand_pelerinage_v1/firestore.rules` maintenus strictement identiques) :
  - Préservent l'isolation privée `/pelerins/{uid}` + `/carnet/{noteId}` et la protection anti-usurpation `auteurId == request.auth.uid` sur `/prieres/{prayerId}`.
  - Ajoutent l'accès propriétaire sur `/pelerins/{uid}/notifications/{notifId}` et `/fcm_tokens/{tokenId}`, et la gestion authentifiée des collections `/groupes_eglise/{groupCode}`, `/duels_bibliques/{duelId}`, `/annonces_eglise/{annonceId}`.
- **Déploiement** :
  1. `firebase deploy --only firestore:rules` (projet Firebase `defi-jean`).
  2. `vercel --prod --yes` (site public `https://jeux-eeag.vercel.app`).

---

## 5. Règles Bibliques & Pédagogiques Garanties

- Traduction exclusive utilisée : **Louis Segond 1910 (LSG 1910)**.
- Aucun verset inventé ni aucune maîtrise immédiate factice : `memorizationEngine.js` exige une vérification différée réelle (`>= 24h`, puis jalons `7j` et `30j`) avant d'attribuer `masteredDurably: true`.
- Compatibilité ascendante totale : `migratePelerinProfileV2()` et `reconcilePelerinData()` migrent automatiquement tout compte existant V1 sans perte d'XP, de perles, de série, d'étapes validées ou de cartes Leitner.

