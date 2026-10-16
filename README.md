# 📖 Défi Jean — Concours Biblique en 10 Niveaux (Louis Segond 1910)

Jeu web autonome et captivant portant sur l'ensemble des **écrits de l'apôtre Jean** (Évangile de Jean, 1 Jean, 2 Jean, 3 Jean et Apocalypse), d'après le texte de la **Bible Louis Segond 1910**.

- **10 Niveaux Thématiques** : Une traversée complète, depuis le Prologue céleste (« Au commencement était la Parole ») jusqu'au triomphe de la Nouvelle Jérusalem.
- **Tirage Aléatoire** : À chaque tentative, 10 questions sont tirées au sort dans le réservoir du niveau, et l'ordre des 4 options de réponse est mélangé.
- **Chronomètre 25 secondes** : 25 secondes par question avec anneau SVG animé et alerte visuelle/sonore sous 6 secondes.
- **Progression & Étoiles** : Seuil de validation à 6/10 pour débloquer le niveau suivant, avec attribution de 1 à 3 étoiles (⭐) mémorisées dans le navigateur (`localStorage`).
- **Design & Motion** : Inspiré de la charte `motion-web` (toile céleste d'étoiles interactives, typographie *Cinzel* et *Plus Jakarta Sans*, glassmorphism raffiné or et bleu nuit, sons doux Web Audio API et confettis de victoire).
- **Carte Visuelle de Score** : Génération d'une carte image PNG haute définition (1080x1350) partageable directement sur WhatsApp ou téléchargeable, avec empreinte de sécurité antifraude FNV-1a.
- **Classement Mondial en Ligne (Firebase Firestore)** : Enregistrement et consultation en direct des scores, étoiles et niveaux atteints par tous les disciples dans le monde, avec podium Top 3 (Or, Argent, Bronze) et filtres dynamiques.

---

## 🗺️ Les 10 Niveaux du Défi

| Niveau | Titre | Livres couverts | Description |
| :---: | :--- | :--- | :--- |
| **01** | **Le Verbe & Les Premiers Témoins** | Jean 1 – 2 | Prologue céleste, Jean-Baptiste, premiers disciples et noces de Cana. |
| **02** | **La Nouvelle Naissance & L'Eau Vive** | Jean 3 – 4 | Nicodème, Jean 3:16, le puits de Jacob en Samarie et le fils de l'officier. |
| **03** | **Béthesda & Le Pain de Vie** | Jean 5 – 6 | Le paralytique de Béthesda, multiplication des pains, Jésus marche sur la mer. |
| **04** | **La Lumière & Le Bon Berger** | Jean 7 – 10 | Fleuves d'eau vive, la femme adultère, l'aveugle de Siloé, le Bon Berger. |
| **05** | **La Résurrection & Le Roi d'Israël** | Jean 11 – 12 | Résurrection de Lazare, le parfum de Marie, entrée triomphale à Jérusalem. |
| **06** | **La Cène & Le Consolateur** | Jean 13 – 17 | Lavement des pieds, commandement nouveau, le cep et les sarments, l'Esprit Saint. |
| **07** | **La Passion & La Victoire Céleste** | Jean 18 – 21 | Gethsémané, Pilate, la croix, le tombeau vide, Thomas et la pêche miraculeuse. |
| **08** | **Les Épîtres : Vérité & Amour** | 1, 2 et 3 Jean | Marcher dans la lumière, Dieu est amour, foi victorieuse et avertissements. |
| **09** | **L'Apocalypse : Visions & Sept Églises** | Apocalypse 1 – 11 | Patmos, les 7 Églises, le trône céleste, l'Agneau et les sept sceaux. |
| **10** | **La Victoire Finale & La Cité Céleste** | Apocalypse 12 – 22 | Le dragon terrassé, le Roi des rois, la Nouvelle Jérusalem et le fleuve de vie. |

---

## 📁 Architecture des Fichiers

| Fichier | Rôle |
| --- | --- |
| [index.html](index.html) | Structure sémantique : Hub des 10 niveaux, écran de quiz, écran de bilan et modale de classement |
| [style.css](style.css) | Design haute fidélité `motion-web` (verre fumé, or céleste, podium Top 3, responsive) |
| [questions.js](questions.js) | **La banque de 126 questions vérifiées** sur 10 niveaux (LSG 1910) |
| [app.js](app.js) | Logique du jeu : progression, tirage aléatoire, chrono 25s, Web Audio API, export PNG |
| [classement.js](classement.js) | Synchronisation et affichage en temps réel du classement mondial des joueurs |
| [firebase-config.js](firebase-config.js) | Configuration des clés Firebase Firestore pour le cloud |
| [firestore.rules](firestore.rules) | Règles de sécurité officielles pour Cloud Firestore |
| [verifier-questions.js](verifier-questions.js) | Contrôle automatisé de la banque (`node verifier-questions.js`) |
| [vercel.json](vercel.json) | Configuration pour déploiement direct et statique sur Vercel |

---

## 🏆 Activer le Classement Mondial en Ligne (Firebase)

Le jeu fonctionne immédiatement en mode local/démo. Pour synchroniser les scores de tous vos joueurs en ligne sur votre site :

1. Rendez-vous sur la console [Firebase](https://console.firebase.google.com/) (100% gratuit).
2. Créez un projet et activez **Firestore Database**.
3. Dans l'onglet **Règles** de Firestore, copiez-collez le contenu de [firestore.rules](firestore.rules).
4. Dans **Paramètres du projet > Vos applications > Web (`</>`)**, copiez vos identifiants dans [firebase-config.js](firebase-config.js).
5. Déployez ou poussez sur GitHub : tous les scores de vos joueurs seront désormais synchronisés en direct !

---

## 💻 Tester en Local

Double-cliquer sur `index.html` ou servir le dossier via un serveur local :

```bash
python3 -m http.server 8137
# Ouvrir dans votre navigateur : http://127.0.0.1:8137/
```

Vérifier la banque de questions :
```bash
node verifier-questions.js
```

---

## 🚀 Déploiement sur Vercel

1. Pousser les modifications sur votre dépôt GitHub : [`Arsenejo/Jeux_biblique`](https://github.com/Arsenejo/Jeux_biblique).
2. Connecter le projet sur [Vercel](https://vercel.com) en sélectionnant le framework **Other** et la racine `.`.
3. Vercel déploie automatiquement le site statique sans aucune dépendance serveur.

---

## 📜 Texte Biblique

Toutes les citations sont rigoureusement issues de la **Bible Louis Segond 1910**, dans le domaine public.
