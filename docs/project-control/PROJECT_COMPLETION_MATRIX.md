# Matrice

| ID | Sujet | État | Preuve |
| --- | --- | --- | --- |
| SEC-EMAIL | Clé Brevo hors du navigateur | TESTED | `tests/mail_server.test.js`, `api/mailCore.cjs` |
| SEC-RULES | Règles uniques, pseudo, prières, plafond XP | TESTED | `firestore.rules`, test de cloisonnement |
| SEC-SCORE | XP une fois par étape et par révision échue | TESTED | `tests/progression.test.js` |
| FEATURE-STAGES | 74 étapes et 126 questions Jean jouables | TESTED | `tests/content_integrity.test.js`, sentier navigateur |
| FEATURE-QCM | 4 options | TESTED | test d'intégrité des QCM |
| FEATURE-GARDEN | Jardin sans cartes fictives | TESTED | révision affichée à 0 au démarrage |
| FEATURE-GROUP | Groupe de semaine | IMPLEMENTED | `ChurchGroupCard.jsx` |
| FEATURE-BIBLE | Lecteur annoncé comme extraits | IMPLEMENTED | titre de l'onglet Bible |
| UX-MOTION | `prefers-reduced-motion` | IMPLEMENTED | `src/styles/reduced-motion.css` |
| TEST-CI | Pipeline | IMPLEMENTED | `.github/workflows/ci.yml` |
| TECH-SPLIT | Découpage complet de `main.jsx` | IN_PROGRESS | modules extraits ; l'atelier reste dans `main.jsx` |
| FEATURE-CANON | Texte biblique intégral | NOT_STARTED | choix tenu : extraits honnêtes, pas un texte inventé |
