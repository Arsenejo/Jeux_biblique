# Directives du Projet — Défi Jean (Louis Segond 1910)

## Présentation
Application web interactive de quiz biblique couvrant l'intégrale des écrits de l'apôtre Jean (Évangile, 1, 2, 3 Jean et Apocalypse).
- **Format** : **10 Niveaux thématiques de progression**, **10 questions aléatoires par niveau**, **25 secondes par question**.
- **Aléatoire & Équité** : Tirage aléatoire des questions dans le pool du niveau à chaque partie et permutation aléatoire des 4 options de réponse.
- **Progression** : Système de déblocage (seuil de réussite : 6/10) avec attribution d'étoiles (1 à 3 ⭐) persistées dans `localStorage`.
- **Reprise de partie en cours** : Si le joueur quitte la page, ferme son onglet ou son navigateur en plein milieu d'un niveau, sa manche est automatiquement sauvegardée dans `localStorage` (`defiJean.v2.mancheEnCours`). À son retour, un bandeau doré interactif lui propose de reprendre immédiatement là où il s'était arrêté (même niveau, même question, même score et mêmes choix).
- **Design & Motion** : Inspiré des principes `motion-web` (toile cosmique interactive, typographie Cinzel / Plus Jakarta Sans / JetBrains Mono, glassmorphism, chrono SVG animé, son Web Audio API natif, carte PNG de score haute résolution 1080x1350).
- **Architecture** : 100 % statique, zéro dépendance d'exécution, aucun serveur requis.

## Pile Technique
- **Frontend** : HTML5 sémantique, CSS3 moderne (Variables CSS, Glassmorphism, Responsive Mobile & Desktop, Micro-interactions), Vanilla JavaScript ES6+.
- **Audio & Animations** : Web Audio API synthétisé (sons doux de carillon et fanfare sans dépendance externe), Canvas 2D interactif (particules célestes et confettis de victoire).
- **Export** : Génération dynamique d'une carte image PNG de score via `<canvas>` avec empreinte de vérification antifraude FNV-1a.
- **Validation** : Node.js pour le script d'audit automatique des questions (`verifier-questions.js`).

## Commandes Fréquentes
- **Vérification de la banque de questions (10 Niveaux)** :
  ```bash
  node verifier-questions.js
  ```
- **Serveur local de test** :
  ```bash
  python3 -m http.server 8137
  # Ouvrir http://127.0.0.1:8137/
  ```

## Règles & Conventions
1. **Source biblique** : Texte rigoureusement conforme à la **Louis Segond 1910** (domaine public).
2. **Règle d'or des questions** : La bonne réponse ne doit **jamais** apparaître dans le champ `verset` affiché (utiliser `…` ou `___`). La citation complète va dans `lecon`.
3. **Structure des questions** (`questions.js`) :
   - `level: 1..10` obligatoire.
   - Exactement 4 options distinctes par question.
   - `answer: 0` initialement dans la banque brute (mélangée dynamiquement au runtime).
4. **Qualité de code & Sécurité** :
   - Échappement systématique des chaînes dynamiques (`echapper()`) pour prévenir toute injection XSS.
   - Respect de l'accessibilité (ARIA live regions, focus management, support `prefers-reduced-motion`).
