# Registre des risques

| ID | Risque | État |
| --- | --- | --- |
| R1 | Un joueur peut encore déclarer un grand nombre d'étapes et atteindre le plafond d'XP. Le plafond empêche un score absurde, pas une triche déterminée. | Ouvert |
| R2 | Les règles Firestore ne sont pas exécutées par l'émulateur dans la CI. Elles sont relues par un test de texte. | Ouvert |
| R3 | Le groupe de semaine n'est pas synchronisé entre téléphones. | Assumé |
| R4 | `main.jsx` reste long. L'atelier tactile n'a pas été déplacé, pour ne pas casser le glisser-déposer. | Ouvert |
| R5 | La clé Firebase publique est la même dans le quiz statique et l'application React. Les variables `VITE_FIREBASE_*` restent prioritaires. | Surveillé |
