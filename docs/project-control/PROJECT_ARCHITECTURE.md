# Architecture

- Racine : quiz Défi Jean (`index.html`, `app.js`, `questions.js`) et règles Firestore communes.
- `grand_pelerinage_v1` : application React. L'écran principal reste `src/main.jsx`. La progression, les courriels et le groupe de semaine sont sortis dans des modules testés.
- `api/send-email.js` : fonction Vercel. La clé Brevo est lue dans `BREVO_API_KEY`, jamais dans le bundle.
- `src/data/bibleData.js` assemble le sentier : étapes d'origine, `extendedStages.js`, `jeanStages.js` (généré depuis `questions.js`).
- Scores publics : collection `classement_pelerins`, plafonnée comme `src/services/progression.js`.
