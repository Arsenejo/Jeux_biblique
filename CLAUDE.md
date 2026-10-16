# Directives du Projet — Défi Jean (Louis Segond 1910)

## Présentation
Application web autonome de quiz biblique quotidien conçue pour des défis en groupe (notamment WhatsApp).
- **Format** : 10 questions/jour, 15 secondes/question.
- **Équité** : Tirage déterministe identique pour tous les joueurs le même jour (graine basée sur la date).
- **Architecture** : 100 % statique, zéro dépendance d'exécution, aucun serveur requis.

## Pile Technique
- **Frontend** : HTML5 sémantique, CSS3 moderne (Variables CSS, Flexbox, Mobile-first, Dark/Parchemin), Vanilla JavaScript (ES6+ standard).
- **Outils & Validation** : Node.js pour le script d'audit des questions (`verifier-questions.js`).
- **Persistance** : `localStorage` navigateur (`defiJean.v1.*`).

## Commandes Fréquentes
- **Vérification de la banque de questions** :
  ```bash
  node verifier-questions.js
  ```
- **Serveur local de test** :
  ```bash
  python3 -m http.server 8137
  # Ouvrir http://127.0.0.1:8137/
  ```
- **Mode entraînement (sans chrono ni verrou)** :
  ```
  http://127.0.0.1:8137/?entrainement=1
  ```

## Règles & Conventions
1. **Source biblique** : Texte rigoureusement conforme à la **Louis Segond 1910** (domaine public).
2. **Règle d'or des questions** : La bonne réponse ne doit **jamais** apparaître dans le champ `verset` affiché (utiliser `…` ou `___`). La citation complète va dans `lecon`.
3. **Structure des questions** (`questions.js`) :
   - Exactement 4 options distinctes par question.
   - `answer: 0` initialement dans la banque brute (mélangée dynamiquement au runtime).
   - Thèmes supportés : `Évangile de Jean`, `1 Jean`, `2 et 3 Jean`, `Apocalypse`.
4. **Qualité de code** :
   - Échappement systématique des chaînes dynamiques (`echapper()`) pour prévenir toute injection XSS.
   - Respect de l'accessibilité (ARIA live regions, focus management, support `prefers-reduced-motion`).
