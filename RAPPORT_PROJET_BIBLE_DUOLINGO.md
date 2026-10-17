# 📜 RAPPORT DE PROJET & CAHIER DES CHARGES STRATÉGIQUE
## De « Défi Jean » au « Grand Pèlerinage de la Bible » (Format Duolingo)

> **Document destiné à l'analyse architecturale et technique par ChatGPT.**  
> **Source biblique de référence :** Bible Louis Segond 1910 (domaine public).  
> **Dépôt Git & GitHub officiel :** [https://github.com/Arsenejo/Jeux_biblique.git](https://github.com/Arsenejo/Jeux_biblique.git)  
> **Date de rédaction :** Octobre 2026  

---

## 1. Résumé Exécutif & Vision

Le projet initial **« Défi Jean »** est une application web interactive de quiz biblique haut de gamme portée sur les écrits de l'apôtre Jean. 

Face à l'engouement et au besoin d'ancrer durablement l'amour de la Parole de Dieu chez les croyants et les chercheurs de vérité, le projet évolue vers une **plateforme pan-biblique inspirée de la pédagogie et de l'ergonomie de Duolingo** :
1. **Étendue à toute la Bible** : Les 66 livres (de la Genèse à l'Apocalypse), structurés en grandes épopées de la foi.
2. **Rupture totale avec la monotonie** : Remplacement du QCM unique par un moteur multi-exercices (briques de versets à assembler, paires à relier, attribution de répliques « Qui a dit ? », chronologie, Vrai/Faux, textes à trous).
3. **Banque de questions inépuisable** : Génération procédurale dynamique à partir du texte biblique officiel, modules évolutifs et mises à jour en temps réel via le Cloud.
4. **Impact spirituel profond** : Lampes de la foi (vies), courtes pensées méditatives d'application pratique après chaque question, collection de cartes de promesses dorées et partage de bénédictions sur WhatsApp.
5. **Format Web PWA Mobile-First** : Zéro téléchargement lourd imposé, jouable instantanément via un simple lien partagé, installable sur l'écran d'accueil d'un smartphone (iOS/Android) et jouable 100 % hors-ligne.

---

## 2. État des Lieux : Tout ce qui a été réalisé à ce jour

Le socle technique actuellement en production sur la branche `main` du dépôt GitHub comprend :

### A. Mécanique de Jeu (Défi Jean)
- **10 Niveaux thématiques progressifs** couvrant l'Évangile de Jean, les Épîtres et l'Apocalypse.
- **10 questions tirées aléatoirement** dans le pool du niveau à chaque session.
- **Chrono individuel de 25 secondes** par question avec anneau SVG dynamique et pulsations d'alerte sous les 5 secondes.
- **Seuil de validation de 6/10** pour débloquer le niveau suivant, avec système d'attribution d'étoiles (1 ⭐ à 6/10, 2 ⭐ à 8/10, 3 ⭐ à 10/10).
- **Reprise automatique de manche en cours** : Si le joueur quitte la page ou recharge son navigateur en plein milieu d'une partie, son état est mémorisé (`defiJean.v2.mancheEnCours`). Un bandeau d'accueil lui permet de reprendre exactement à sa question et à son score en cours.

### B. Persistance & Classement Cloud (Firebase Firestore)
- **Projet Firebase connecté** : Projet `defi-jean` avec identifiants réels configurés dans `firebase-config.js`.
- **Règles de sécurité Firestore (`firestore.rules`)** : Lecture publique pour le classement mondial, écriture et mise à jour validées (scores 0-100, étoiles 0-30, pseudo 2-25 caractères), suppression strictement interdite pour préserver l'historique.
- **Persistance inaltérable par Pseudo Unique** : Document Firestore clé sous la forme `joueur_{pseudo_normalise}` (ex. `joueur_joel`). Toute la progression (étoiles, score total, niveaux débloqués, détail des scores de chaque niveau) est préservée.
- **Restauration transparente au rechargement** : Lorsque la page s'actualise ou que le joueur saisit son pseudo sur un autre appareil, toute sa progression est restaurée sans perte.
- **Fusion anti-régression (`Math.max`)** : Les scores ne peuvent jamais être diminués par un rechargement ou un incident réseau.
- **Zéro joueur fictif / Zéro profil fantôme** : Les disciples de démonstration ont été éliminés. Les profils à 0 point sont automatiquement filtrés pour n'afficher que des disciples réels ayant validé un score.
- **Podium adaptatif** : Affichage responsive automatique selon le nombre de joueurs (disposition solo pour 1 joueur, duo pour 2, trio officiel pour 3 et plus).
- **Cartouche « Ta Position Actuelle »** : Met en avant le rang du joueur, ses étoiles et son score en tête de palmarès.
- **Zéro jargon technique** : Suppression de tous les termes informatiques (`Firebase`, `base de données`, `serveur`, `validation antifraude`) au profit d'un vocabulaire biblique et noble (*Palmarès mondial des disciples*, *Sceau d'authenticité*).

### C. Design & Média
- **Design Céleste & Motion Web** : Toile cosmique interactive en arrière-plan (Canvas 2D avec particules étoilées reliées par des constellations), typographie noble (*Cinzel*, *Plus Jakarta Sans*, *JetBrains Mono*), cartes en glassmorphism sombre aux reflets dorés.
- **Web Audio API synthétisé** : Sons harmoniques purs générés en direct par l'API Web Audio (carillon de bonne réponse, accord céleste de victoire, tintement doux), sans nécessiter de téléchargement de fichiers MP3 externes.
- **Générateur de Carte de Score PNG (1080x1350)** : Génération côté client d'un visuel haute résolution adapté aux statuts WhatsApp et Stories Instagram, avec empreinte de vérification FNV-1a.

---

## 3. Les Nouvelles Exigences du Projet

L'utilisateur a exprimé les exigences suivantes pour la prochaine phase majeure du projet :

### 1. Extension à TOUTE LA BIBLE (66 Livres)
- Ne plus se limiter à Jean, mais ouvrir le jeu à l'ensemble des Écritures :
  - **Ancien Testament (39 livres)** : Pentateuque, Livres Historiques, Poésie & Sagesse, Grands et Petits Prophètes.
  - **Nouveau Testament (27 livres)** : Les 4 Évangiles, Actes des Apôtres, Épîtres Pauliniennes et Générales, Apocalypse.

### 2. Adoption de la Pédagogie & Mécanique « Duolingo »
- **Sentier Visuel Sinueux (The Learning Path)** : Remplacer la grille statique par un sentier vertical jalonné d'étapes rondes, de coffres aux trésors et d'autels de bénédiction.
- **Sessions courtes & addictives** : Manches de 3 à 5 minutes (5 à 7 exercices par étape).
- **La Flamme de la Foi (Daily Streak)** : Compteur de jours consécutifs de méditation dans la Parole pour créer une habitude de dévotion quotidienne.
- **Les Perles du Royaume (Monnaie spirituelle / Gemmes)** : Récompense pour chaque manche réussie, permettant de débloquer des parchemins ou de rallumer une lampe éteinte.
- **Compagnon / Mascotte spirituelle** : Une colombe céleste ou un guide pèlerin bienveillant qui encourage le joueur avec des messages bibliques.
- **Ligues hebdomadaires** : Système de promotion (Bronze ➔ Argent ➔ Or ➔ Saphir ➔ Rubis ➔ Diamant).

### 3. Rupture avec la Monotonie (Moteur Multi-Exercices)
Le jeu doit intégrer au minimum 6 types d'exercices interactifs :
1. **Bâtisseur de Verset (Word Scramble)** : Assembler les briques de mots dans le bon ordre pour reconstituer un verset marquant.
2. **Paires Célestes (Matching)** : Relier deux colonnes d'éléments associés (personnages, miracles, lieux, alliances).
3. **« Qui a dit ces paroles ? »** : Identifier l'auteur ou le destinataire d'une citation biblique.
4. **Sentinelle Rapide (Vrai / Faux)** : Énoncés percutants à valider rapidement.
5. **Clé de Sagesse (Texte à trou)** : Retrouver le mot théologique essentiel d'un passage.
6. **Frise Chronologique** : Ordonner 3 à 4 événements bibliques du plus ancien au plus récent.

### 4. Banque de Questions Inépuisable (Non Restreinte)
- Éviter d'avoir un nombre fixe et limité de questions.
- Mettre en place un **moteur de génération procédurale** capable d'exploiter le texte intégral de la Louis Segond 1910 pour créer des variantes infinies de questions.
- Permettre l'injection de nouveaux packs thématiques et « Défis du Jour » directement depuis **Firebase Firestore** sans mise à jour du code client.
- **Répétition espacée (Spaced Repetition)** : Les questions manquées sont réintroduites plus tard sous un format différent jusqu'à assimilation complète.

### 5. Profondeur Spirituelle & Édification du Cœur
- **Les 3 Lampes de la Foi** : 3 lampes allumées (cœurs/vies). Une erreur fait vaciller et éteint une lampe.
- **La Pépite Spirituelle instantanée** : Après chaque réponse, affichage du verset avec une pensée d'application pratique de 2 phrases pour le quotidien.
- **Le Trésor Céleste (Cartes d'Alliance dorées)** : Collection déblocable des promesses et révélations majeures (les 7 « JE SUIS », l'Armure de Dieu, l'Arbre de Vie).
- **La Carte de Bénédiction Quotidienne** : Export d'un visuel élégant avec le verset du jour et le prénom du joueur pour WhatsApp.
- **Le Défi Fraternel** : Lien d'invitation personnalisé (`?defi=...`) pour défier un proche.

---

## 4. Choix d'Architecture Technologique Recommandé

Après comparaison des alternatives (Frameworks lourds React/Vue ou Applications Natives Flutter), la solution optimale validée est une **Progressive Web App (PWA) Mobile-First** :

### Pile Recommandée :
- **Frontend** : HTML5 Sémantique + CSS3 Avancé avec accélération matérielle GPU (60 fps sur le sentier et les micro-animations) + JavaScript ES6+ modulaire (oriente composants d'exercices).
- **Mode PWA** : `manifest.json` et `service-worker.js` pour installation directe sur écran d'accueil iPhone/Android et jouabilité **100 % hors-ligne**.
- **Backend & Données** : Cloud Firestore (Projet Firebase `defi-jean` déjà actif).
- **Moteur Audio** : Web Audio API native (synthèse céleste 0 octet de chargement).
- **Moteur Graphique** : HTML5 Canvas 2D (génération instantanée de cartes de partage).

### Atouts majeurs :
- **Viralité sans friction** : Aucun passage obligatoire par l'App Store ou Google Play. Un clic sur WhatsApp ouvre le jeu immédiatement.
- **Pérennité & Zéro Coût** : Hébergement gratuit sur GitHub Pages / Firebase Hosting.
- **Légèreté absolue** : Moins de 1 Mo total, chargement en moins de 1 seconde même en connexion 3G/4G.

---

## 5. Questions d'Analyse Soumises à ChatGPT

Voici les axes d'analyse et de recommandation attendus de la part de ChatGPT pour challenger et perfectionner cette architecture :

1. **Architecture du Sentier d'Apprentissage (The Path UX)** :
   - Comment concevoir un sentier sinueux vertical style Duolingo en pur CSS/SVG/Canvas qui soit fluide, performant sur mobiles d'entrée de gamme, et qui gère dynamiquement des centaines de stations à travers les 66 livres ?
2. **Modélisation des Données & Structure Multi-Exercices** :
   - Quel schéma JSON modulaire recommandez-vous pour unifier les 6 types d'exercices (QCM, Briques de mots, Paires, Vrai/Faux, Texte à trou, Chronologie) de manière légère et extensible ?
3. **Moteur de Génération Procédurale des Versets** :
   - Quels algorithmes ou structures de données employer pour parser le texte biblique brut (Louis Segond 1910) et en extraire automatiquement des exercices de mémorisation fiables sans contresens théologique ?
4. **Algorithme de Répétition Espacée Léger (Côté Client)** :
   - Quelle variante simplifiée de l'algorithme SuperMemo (SM-2) ou Leitner implémenter en pur JavaScript côté client avec stockage dans Firestore/LocalStorage pour gérer la révision des questions manquées sans alourdir le navigateur ?
5. **Gamification Éthique & Respectueuse du Sacré** :
   - Comment équilibrer les mécaniques addictives de Duolingo (séries, gemmes, cœurs/lampes, ligues) pour qu'elles restent au service de la communion spirituelle et du respect de la Parole, sans dériver vers une ludification superficielle ?
6. **Plan de Migration & Roadmap Progressive** :
   - Comment déployer ce nouveau moteur par tranches successives sur le dépôt existant (`Arsenejo/Jeux_biblique`) sans jamais casser la progression des joueurs actuels (notamment le joueur classé « Joel ») ?

---

*Ce document synthétise l'ensemble des acquis et des ambitions du projet pour servir de socle à une analyse stratégique approfondie.*
