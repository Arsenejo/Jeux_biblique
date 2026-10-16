# 📖 Défi Jean — jeu de concours biblique (Louis Segond 1910)

Quiz web autonome, prévu pour une compétition organisée dans un groupe **WhatsApp** :
10 questions tirées au sort chaque jour, 15 secondes par question, le même tirage pour
tout le monde le même jour, une partie officielle par navigateur et par jour, reprenable
après une interruption. Un mode d'entraînement aléatoire sans chrono est aussi disponible.

Le jeu n'a besoin ni de backend ni de dépendance à installer. Vercel sert directement les fichiers du site.
À la fin d'une partie, une carte PNG du score peut être partagée depuis le téléphone ou téléchargée.

## Fichiers

| Fichier | Rôle |
| --- | --- |
| [index.html](index.html) | Structure : écran d'accueil, écran de jeu, écran de fin |
| [style.css](style.css) | Thème « parchemin » (bleu et doré), mobile d'abord |
| [questions.js](questions.js) | **La banque de 73 questions vérifiées** (LSG 1910) |
| [app.js](app.js) | Tirage quotidien, chrono, score, verrou du jour et création de la carte PNG |
| [vercel.json](vercel.json) | Configure le dossier racine comme sortie statique Vercel |
| [verifier-questions.js](verifier-questions.js) | Contrôle automatique de la banque (`node verifier-questions.js`) |

## Tester en local

Le plus direct : double-cliquer sur `index.html` — le jeu n'a aucune dépendance et ne
fait aucun appel réseau. Certains navigateurs restreignent en revanche les fichiers
locaux (et donc le verrou du jour) ; dans ce cas, servez le dossier :

```bash
python3 -m http.server 8137
# puis ouvrir http://127.0.0.1:8137/
```

Pour tester sans consommer la partie du jour : **`http://127.0.0.1:8137/?entrainement=1`**
(tirage aléatoire, sans chrono, sans verrou et sans résultat enregistré).

Pour débloquer une partie déjà jouée : dans la console du navigateur,
`localStorage.clear()`, ou utiliser le mode entraînement.

## Publier sur Vercel avec GitHub

Le dépôt fourni pour ce jeu est [`Arsenejo/Jeux_biblique`](https://github.com/Arsenejo/Jeux_biblique). Place les fichiers du site à la racine du dépôt, puis :

1. Dans Vercel, choisis **Add New → Project**, puis importe `Arsenejo/Jeux_biblique` depuis GitHub.
2. Garde le dossier racine comme **Root Directory** et choisis **Other** comme framework.
3. Laisse **Build Command** vide. `vercel.json` indique que les fichiers à servir se trouvent à la racine (`.`) ; aucun `npm install` ni `npm run build` n'est nécessaire.
4. Clique sur **Deploy**. Une fois le dépôt connecté, Vercel crée un nouveau déploiement quand tu pousses un commit sur la branche suivie.
5. Ouvre l'adresse HTTPS sur un téléphone, essaie `/?entrainement=1`, termine une partie et vérifie l'aperçu puis le téléchargement de la carte.

Le bouton de partage envoie l'image au menu de partage natif quand le navigateur le prend en charge. Sinon, il télécharge le PNG pour l'envoi manuel. La copie d'image dépend aussi des capacités du navigateur.

Le site reste portable vers d'autres hébergeurs statiques, par exemple Netlify ou GitHub Pages.

## Organiser la compétition dans WhatsApp

Modèle de message d'annonce :

> 📖 **Défi Jean — Louis Segond 1910**
> Chaque jour, 10 questions sur l'Évangile de Jean, ses épîtres et l'Apocalypse.
> 15 secondes par question, même tirage pour tout le monde.
> 👉 Jouer : [votre lien]
> ⏳ Fin de la compétition : [date]
> 🏆 Prix : [à définir]
> Partagez votre carte de score PNG ou une capture **avec l'empreinte affichée**.

Points d'organisation qui font la différence :

- **Une tentative par jour dans le même navigateur** : la progression reprend après fermeture
  de la page et le corrigé reste consultable. Cela dépend du stockage local du navigateur.
- **Carte + empreinte** : l'empreinte lie pseudo, date et score. Exiger les deux
  décourage les captures retouchées ou empruntées.
- **Annonce du classement** chaque soir dans le groupe : c'est ce qui fait revenir les joueurs.
- **Le score du jour** se retrouve sur l'écran d'accueil après la partie, avec un bouton
  de partage (« Tu as déjà joué le défi d'aujourd'hui »).

## Ajouter ou corriger des questions

Tout se passe dans [questions.js](questions.js). Une question = un objet :

```js
{ theme: "Évangile de Jean", ref: "Jean 10:30",
  verset: "Moi et le Père…",                  // optionnel : texte affiché au joueur
  q: "Complétez cette parole de Jésus : « Moi et le Père… »",
  options: ["nous sommes un.", "nous sommes deux.", "nous sommes dans la gloire.", "nous demeurons éternellement."],
  answer: 0,                                   // index de la bonne réponse
  lecon: "Jean 10:30 : « Moi et le Père nous sommes un. »" }
```

Deux règles à respecter, puis **relancer le contrôle** :

```bash
node verifier-questions.js
```

Le script vérifie notamment la règle d'or : *la bonne réponse ne doit jamais être
lisible dans le `verset` affiché*. C'est le défaut principal de la première version
de ce jeu. Un `verset` doit donc toujours être tronqué (`…`) ou troué (`___`).

> ⚠️ Attention aux citations : les questions données comme « compléter le verset »
> doivent être copiées mot pour mot de la **Louis Segond 1910**. La LSG écrit
> « Harmaguédon » (et non « Armageddon »), et 1 Jean 5:7-8 ne contient pas la clause
> trinitaire présente dans certaines vieilles versions.

## Réglages

En tête de [app.js](app.js) :

```js
const NB_QUESTIONS = 10;          // questions par partie
const TEMPS_PAR_QUESTION = 15;    // secondes par question officielle
const APP_VERSION = '1.2.0';      // affichée en bas de l'accueil
```

Dans [index.html](index.html), le compteur « banque de N » se met à jour tout seul.

## Comment ça marche (les points qui comptent)

- **Tirage quotidien déterministe.** La graine du générateur est la date du jour
  (`mulberry32`). Tous les joueurs reçoivent donc les mêmes 10 questions le même jour,
  dans le même ordre de réponses : les scores sont réellement comparables. Le tirage
  change automatiquement à minuit (heure de l'appareil).
- **Tirage équilibré.** Les 10 questions sont réparties par thème, proportionnellement
  à leur poids dans la banque : jamais dix questions d'Apocalypse, jamais zéro épître.
- **Chrono à échéance absolue.** On mémorise l'heure limite, pas un compteur qui
  décrémente : quitter la page ne met pas le temps en pause. La partie sauvegarde aussi
  la progression et reprend avec le temps restant. Les sorties d'écran sont comptées ;
  une notification, un appel ou un changement d'application peut aussi les déclencher.
- **Verrou local d'une partie par jour** dans le navigateur, et empreinte FNV-1a
  `pseudo + date + score` pour identifier la partie.

## Limites à connaître

- **Le classement n'est pas automatique.** Chaque appareil garde son propre résultat ;
  le classement du groupe se fait à la main, à partir des captures d'écran.
- **Le verrou local n'est pas une protection antifraude** : tout s'exécute dans le
  navigateur, les réponses sont dans le code et les données de partie vivent dans
  `localStorage`, qui peut être effacé ou modifié. En navigation privée ou si le
  stockage est bloqué, le jeu prévient le joueur mais ne peut pas conserver la tentative.
  L'empreinte n'est pas une preuve cryptographique. Pour un concours à enjeu, il faut
  un serveur qui corrige et enregistre les scores.

## Texte biblique

Toutes les citations suivent la **Louis Segond 1910**, tombée dans le domaine public :
les versets peuvent être cités et reproduits librement. Les révisions plus récentes
(Segond 21, Nouvelle Segond) sont, elles, protégées par le droit d'auteur.

Textes vérifiés sur la transcription Wikisource *Bible Segond 1910* et sur BibleGateway (LSG).
# Jeux_biblique
