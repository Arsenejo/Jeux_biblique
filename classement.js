/**
 * DÉFI JEAN — SERVICE DE CLASSEMENT & PERSISTANCE CLOUD (FIREBASE FIRESTORE)
 * 
 * - Persistance durable et inaltérable de la progression de chaque joueur dans Cloud Firestore
 * - Zéro faux joueur / Zéro joueur de démonstration : 100 % données réelles authentiques
 * - Synchronisation bidirectionnelle avec fusion intelligente anti-régression (Math.max)
 * - Restauration automatique transparente au rechargement ou sur saisie du prénom/pseudo
 * - Podium dynamique et palmarès mondial des disciples
 */

(function () {
  'use strict';

  const CLE_ID_JOUEUR = 'defiJean.v2.idJoueur';
  const CLE_PSEUDO = 'defiJean.v2.pseudo';
  const CLE_STOCKAGE_V2 = 'defiJean.v2.progression';
  const CLE_CLASSEMENT_LOCAL = 'defiJean.v2.classementLocal';
  const NOM_COLLECTION = 'classement_defi_jean';

  let db = null;
  let firestoreModule = null;
  let filtreActif = 'tous';
  let statutConnexion = 'init'; // 'online' | 'local' | 'error'

  /* ---------------- Normalisation & Clés de Joueur ---------------- */

  function normaliserPseudo(pseudo) {
    if (!pseudo || typeof pseudo !== 'string') return '';
    return pseudo
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '_')
      .substring(0, 30);
  }

  function obtenirPseudoActuel(progressionLocale) {
    if (progressionLocale && progressionLocale.pseudo && progressionLocale.pseudo.trim().length >= 2) {
      return progressionLocale.pseudo.trim();
    }
    try {
      const p1 = localStorage.getItem(CLE_PSEUDO);
      if (p1 && p1.trim().length >= 2) return p1.trim();
      const p2 = sessionStorage.getItem(CLE_PSEUDO);
      if (p2 && p2.trim().length >= 2) return p2.trim();
    } catch (e) {}

    const champ = document.getElementById('saisie-pseudo-joueur');
    if (champ && champ.value && champ.value.trim().length >= 2) {
      return champ.value.trim();
    }
    return '';
  }

  function obtenirIdDocJoueur(pseudo) {
    const norm = normaliserPseudo(pseudo);
    if (norm.length >= 2) {
      return 'joueur_' + norm;
    }
    try {
      let id = localStorage.getItem(CLE_ID_JOUEUR);
      if (!id) {
        id = 'dj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem(CLE_ID_JOUEUR, id);
      }
      return id;
    } catch (e) {
      return 'dj_temp_' + Math.random().toString(36).substring(2, 9);
    }
  }

  /* ---------------- Détection & Initialisation Firebase ---------------- */

  function estFirebaseValide() {
    return (
      window.FIREBASE_CONFIG &&
      typeof window.FIREBASE_CONFIG.apiKey === 'string' &&
      window.FIREBASE_CONFIG.apiKey.trim() !== '' &&
      window.FIREBASE_CONFIG.apiKey !== 'VOTRE_API_KEY' &&
      window.FIREBASE_CONFIG.projectId !== 'votre-projet'
    );
  }

  async function initialiserFirebase() {
    if (!estFirebaseValide()) {
      statutConnexion = 'local';
      return false;
    }
    if (db && firestoreModule) {
      statutConnexion = 'online';
      return true;
    }

    try {
      // Import dynamique des modules officiels Firebase v11 (ESM CDN)
      const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
      const firestore = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js');

      const apps = getApps();
      const app = apps.length > 0 ? apps[0] : initializeApp(window.FIREBASE_CONFIG);
      db = firestore.getFirestore(app);
      firestoreModule = firestore;
      statutConnexion = 'online';
      return true;
    } catch (err) {
      console.warn("Connexion au palmarès en ligne différée, repli local :", err);
      statutConnexion = 'local';
      return false;
    }
  }

  /* ---------------- Calcul des Statistiques du Joueur ---------------- */

  function calculerStatsJoueur(progression, dernierScoreManche, idNiveau) {
    let scoreTotal = 0;
    let etoilesTotal = 0;
    let niveauxDebloques = 0;

    for (let lvl = 1; lvl <= 10; lvl++) {
      const data = (progression && progression.niveaux && progression.niveaux[lvl]) || null;
      if (data) {
        if (data.debloque) niveauxDebloques++;
        scoreTotal += (data.scoreMax || 0);
        etoilesTotal += (data.etoiles || 0);
      }
    }

    const pseudoBrut = (progression && progression.pseudo ? progression.pseudo.trim() : '');
    const pseudoNettoye = pseudoBrut.length >= 2 ? pseudoBrut : 'Disciple';
    const idJoueur = obtenirIdDocJoueur(pseudoNettoye);

    return {
      idJoueur: idJoueur,
      pseudo: pseudoNettoye,
      scoreTotal: scoreTotal,
      etoilesTotal: etoilesTotal,
      niveauxDebloques: Math.max(1, niveauxDebloques),
      dernierNiveauJoue: idNiveau || 1,
      dernierScore: typeof dernierScoreManche === 'number' ? dernierScoreManche : 0,
      niveaux: (progression && progression.niveaux) ? progression.niveaux : {},
      horodatage: Date.now(),
      dateTexte: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  /* ---------------- Reconstruction Intelligente des Niveaux ---------------- */

  function reconstruireNiveaux(donneesCloud, localNiveaux) {
    const resultat = {};
    const debloquesCloud = (donneesCloud && donneesCloud.niveauxDebloques) || 1;
    const scoreTotalCloud = (donneesCloud && donneesCloud.scoreTotal) || 0;
    const etoilesTotalCloud = (donneesCloud && donneesCloud.etoilesTotal) || 0;
    const cloudNiv = (donneesCloud && donneesCloud.niveaux) || {};

    for (let lvl = 1; lvl <= 10; lvl++) {
      const local = (localNiveaux && localNiveaux[lvl]) || null;
      const cloud = cloudNiv[lvl] || cloudNiv[String(lvl)] || null;

      let scoreMax = Math.max((local && local.scoreMax) || 0, (cloud && cloud.scoreMax) || 0);
      let etoiles = Math.max((local && local.etoiles) || 0, (cloud && cloud.etoiles) || 0);
      let debloque = Boolean(
        (local && local.debloque) ||
        (cloud && cloud.debloque) ||
        (lvl === 1) ||
        (lvl <= debloquesCloud)
      );
      let complete = Boolean(
        (local && local.complete) ||
        (cloud && cloud.complete) ||
        (lvl < debloquesCloud) ||
        (scoreMax >= 6)
      );

      // Si le document Cloud historique a un scoreTotal mais pas de tableau `niveaux` détaillé
      if (lvl === 1 && scoreMax === 0 && scoreTotalCloud > 0) {
        scoreMax = Math.min(10, scoreTotalCloud);
        etoiles = etoilesTotalCloud;
        complete = scoreMax >= 6;
        debloque = true;
      }

      resultat[lvl] = { debloque, scoreMax, etoiles, complete };
    }

    return resultat;
  }

  /* ---------------- Sauvegarde & Synchronisation du Score ---------------- */

  async function synchroniserScore(progression, dernierScoreManche, idNiveau) {
    if (!progression) return;
    const pseudo = (progression.pseudo || '').trim();

    // Règle d'or : ne jamais enregistrer d'utilisateur vide ou anonyme sans score
    if (pseudo.length < 2) return;

    const payload = calculerStatsJoueur(progression, dernierScoreManche, idNiveau);

    // Ne pas envoyer de profil vide (0 pts, 0 étoiles) à l'initialisation
    if (payload.scoreTotal === 0 && payload.etoilesTotal === 0 && (!dernierScoreManche || dernierScoreManche === 0)) {
      return;
    }

    // 1. Persistance locale résiliente
    sauvegarderLocalement(payload);
    try {
      localStorage.setItem(CLE_PSEUDO, payload.pseudo);
      sessionStorage.setItem(CLE_PSEUDO, payload.pseudo);
    } catch (e) {}

    // 2. Initialisation Firestore si nécessaire
    if (statutConnexion === 'init') {
      await initialiserFirebase();
    }

    // 3. Envoi à Cloud Firestore avec fusion et protection anti-régression
    if (statutConnexion === 'online' && db && firestoreModule) {
      try {
        const { doc, getDoc, setDoc } = firestoreModule;
        const ref = doc(db, NOM_COLLECTION, payload.idJoueur);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const ancien = snap.data();
          // Ne jamais réduire un score ou niveau déjà atteint
          payload.scoreTotal = Math.max(payload.scoreTotal, ancien.scoreTotal || 0);
          payload.etoilesTotal = Math.max(payload.etoilesTotal, ancien.etoilesTotal || 0);
          payload.niveauxDebloques = Math.max(payload.niveauxDebloques, ancien.niveauxDebloques || 1);
          payload.niveaux = reconstruireNiveaux(ancien, payload.niveaux);
        }

        await setDoc(ref, payload, { merge: true });
        sauvegarderLocalement(payload);
      } catch (e) {
        console.warn("Échec d'enregistrement vers le palmarès en ligne :", e);
      }
    }
  }

  /* ---------------- Restauration de la Progression depuis le Cloud ---------------- */

  async function restaurerProgressionDepuisCloud(progressionLocale) {
    const pseudo = obtenirPseudoActuel(progressionLocale);
    if (!pseudo || pseudo.length < 2) {
      return progressionLocale;
    }

    if (statutConnexion === 'init') {
      await initialiserFirebase();
    }

    let donneesCloud = null;

    // A. Recherche directe par document ID dans Firestore
    if (statutConnexion === 'online' && db && firestoreModule) {
      try {
        const { doc, getDoc, collection, query, where, getDocs, limit } = firestoreModule;
        const idDoc = obtenirIdDocJoueur(pseudo);

        // 1. Accès direct O(1) par clé normalisée (ex: joueur_joel)
        const refDoc = doc(db, NOM_COLLECTION, idDoc);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          donneesCloud = snap.data();
        } else {
          // 2. Recherche alternative par champ 'pseudo' (pour comptes historiques)
          const q = query(
            collection(db, NOM_COLLECTION),
            where('pseudo', '==', pseudo),
            limit(1)
          );
          const qSnap = await getDocs(q);
          if (!qSnap.empty) {
            donneesCloud = qSnap.docs[0].data();
          }
        }
      } catch (err) {
        console.warn("Échec de récupération Cloud, vérification des sauvegardes locales :", err);
      }
    }

    // B. Si pas de Cloud disponible, chercher dans le classement local
    if (!donneesCloud) {
      const localHistorique = chargerClassementLocal();
      const norm = normaliserPseudo(pseudo);
      const trouveLocal = localHistorique.find(j => normaliserPseudo(j.pseudo) === norm);
      if (trouveLocal) {
        donneesCloud = trouveLocal;
      }
    }

    if (!donneesCloud) {
      return progressionLocale;
    }

    // C. Fusion intelligente préservant les records du disciple
    const localNiveaux = (progressionLocale && progressionLocale.niveaux) || {};
    const niveauxFusionnes = reconstruireNiveaux(donneesCloud, localNiveaux);

    const fusionnee = {
      pseudo: donneesCloud.pseudo || pseudo,
      sonActif: (progressionLocale && typeof progressionLocale.sonActif === 'boolean') ? progressionLocale.sonActif : true,
      niveaux: niveauxFusionnes
    };

    // Sauvegarder immédiatement dans le stockage persistant
    try {
      localStorage.setItem(CLE_STOCKAGE_V2, JSON.stringify(fusionnee));
      localStorage.setItem(CLE_PSEUDO, fusionnee.pseudo);
      sessionStorage.setItem(CLE_PSEUDO, fusionnee.pseudo);
      if (donneesCloud.idJoueur) {
        localStorage.setItem(CLE_ID_JOUEUR, donneesCloud.idJoueur);
      }
    } catch (e) {}

    return fusionnee;
  }

  function sauvegarderLocalement(payload) {
    try {
      let classementLocal = chargerClassementLocal();
      const norm = normaliserPseudo(payload.pseudo);
      const index = classementLocal.findIndex(j => normaliserPseudo(j.pseudo) === norm);
      if (index >= 0) {
        classementLocal[index] = payload;
      } else {
        classementLocal.push(payload);
      }
      localStorage.setItem(CLE_CLASSEMENT_LOCAL, JSON.stringify(classementLocal));
    } catch (e) {}
  }

  function chargerClassementLocal() {
    try {
      const brut = localStorage.getItem(CLE_CLASSEMENT_LOCAL);
      if (!brut) return [];
      const parsed = JSON.parse(brut);
      return Array.isArray(parsed) ? parsed.filter(j => j && j.pseudo && j.pseudo.trim().length >= 2) : [];
    } catch (e) {
      return [];
    }
  }

  /* ---------------- Récupération des Données de Classement ---------------- */

  async function recupererScores() {
    if (statutConnexion === 'init') {
      await initialiserFirebase();
    }

    let joueursBruts = [];

    // 1. Récupération en ligne depuis Cloud Firestore
    if (statutConnexion === 'online' && db && firestoreModule) {
      try {
        const { collection, getDocs, query, orderBy, limit } = firestoreModule;
        const q = query(collection(db, NOM_COLLECTION), orderBy('etoilesTotal', 'desc'), limit(100));
        const snapshot = await getDocs(q);

        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          if (d && d.pseudo) {
            joueursBruts.push(d);
          }
        });
      } catch (err) {
        console.warn("Lecture du palmarès Cloud indisponible, repli local :", err);
      }
    }

    // 2. Si aucune donnée Cloud ou hors-ligne, compléter avec le stockage local
    if (joueursBruts.length === 0) {
      joueursBruts = chargerClassementLocal();
    }

    // 3. Filtrage strict pour n'afficher QUE des disciples réels ayant un score valide
    const mapParPseudo = new Map();

    joueursBruts.forEach(j => {
      const pseudo = (j.pseudo || '').trim();
      if (pseudo.length < 2) return;

      const score = Number(j.scoreTotal) || 0;
      const etoiles = Number(j.etoilesTotal) || 0;

      // Zéro faux disciple : éliminer les initialisations à 0 points
      if (score <= 0 && etoiles <= 0) return;
      if (pseudo.toLowerCase() === 'disciple' && score <= 0) return;

      const cleNorm = normaliserPseudo(pseudo);
      const existant = mapParPseudo.get(cleNorm);

      if (!existant) {
        mapParPseudo.set(cleNorm, j);
      } else {
        // En cas de doublons (ancien ID aléatoire vs nouvel ID normalisé), conserver la meilleure performance
        const scoreEx = Number(existant.scoreTotal) || 0;
        const etoilesEx = Number(existant.etoilesTotal) || 0;
        if (etoiles > etoilesEx || (etoiles === etoilesEx && score > scoreEx)) {
          mapParPseudo.set(cleNorm, j);
        }
      }
    });

    const joueursFiltres = Array.from(mapParPseudo.values());
    return trierEtFiltrer(joueursFiltres, filtreActif);
  }

  function trierEtFiltrer(liste, filtre) {
    let resultats = [...liste];

    if (filtre === 'complets') {
      resultats = resultats.filter(j => (j.niveauxDebloques || 1) >= 10);
    } else if (filtre === 'recents') {
      resultats.sort((a, b) => (b.horodatage || 0) - (a.horodatage || 0));
      return resultats.slice(0, 50);
    }

    // Tri officiel : Étoiles totales DESC > Score total DESC > Niveaux débloqués DESC > Antériorité
    resultats.sort((a, b) => {
      if ((b.etoilesTotal || 0) !== (a.etoilesTotal || 0)) {
        return (b.etoilesTotal || 0) - (a.etoilesTotal || 0);
      }
      if ((b.scoreTotal || 0) !== (a.scoreTotal || 0)) {
        return (b.scoreTotal || 0) - (a.scoreTotal || 0);
      }
      if ((b.niveauxDebloques || 1) !== (a.niveauxDebloques || 1)) {
        return (b.niveauxDebloques || 1) - (a.niveauxDebloques || 1);
      }
      return (a.horodatage || 0) - (b.horodatage || 0);
    });

    return resultats.slice(0, 50);
  }

  /* ---------------- Rendu Visuel du Classement ---------------- */

  function echapper(texte) {
    return String(texte || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function obtenirInitiale(nom) {
    const propre = (nom || '').trim();
    return propre.length > 0 ? propre.charAt(0).toUpperCase() : 'D';
  }

  function estMoi(joueur, monPseudo, monId) {
    if (!joueur) return false;
    if (monId && joueur.idJoueur === monId) return true;
    if (monPseudo && normaliserPseudo(joueur.pseudo) === normaliserPseudo(monPseudo)) return true;
    return false;
  }

  function creerCartePodium(item, monPseudo, monId) {
    const j = item.data;
    const joueurEstMoi = estMoi(j, monPseudo, monId);

    const carte = document.createElement('div');
    carte.className = `carte-podium ${item.classe} ${joueurEstMoi ? 'c-est-moi' : ''}`;
    carte.innerHTML = `
      <div class="podium-couronne">${item.couronne}</div>
      <div class="podium-avatar">${obtenirInitiale(j.pseudo)}</div>
      <div class="podium-rang">#${item.place}</div>
      <h4 class="podium-nom" title="${echapper(j.pseudo)}">${echapper(j.pseudo)}${joueurEstMoi ? ' <span class="tag-moi">(Toi)</span>' : ''}</h4>
      <div class="podium-etoiles">⭐ <strong>${j.etoilesTotal || 0}</strong> / 30</div>
      <div class="podium-score">Score total : <strong>${j.scoreTotal || 0}</strong> / 100</div>
      <div class="podium-niveau">Niveau atteint : <strong>${j.niveauxDebloques || 1} / 10</strong></div>
    `;
    return carte;
  }

  async function afficherClassementDansModal() {
    const conteneurPodium = document.getElementById('podium-classement');
    const tableCorps = document.getElementById('corps-table-classement');
    const cartoucheMoi = document.getElementById('ma-position-classement');
    const statutBadge = document.getElementById('badge-statut-cloud');

    if (!tableCorps) return;

    tableCorps.innerHTML = `<tr><td colspan="5" class="chargement-classement">Chargement du palmarès des disciples…</td></tr>`;

    const joueurs = await recupererScores();
    const monPseudo = obtenirPseudoActuel();
    const monId = obtenirIdDocJoueur(monPseudo);

    // Mise à jour du badge de statut (élégant, zéro terme technique)
    if (statutBadge) {
      if (statutConnexion === 'online') {
        statutBadge.className = 'badge-classement en-ligne';
        statutBadge.innerHTML = '🟢 En direct • Palmarès mondial des disciples';
      } else {
        statutBadge.className = 'badge-classement mode-local';
        statutBadge.innerHTML = '🟡 Palmarès des disciples';
      }
    }

    // 1. Rendu du Cartouche « Ta Position Actuelle »
    if (cartoucheMoi) {
      const monRangIndex = joueurs.findIndex(j => estMoi(j, monPseudo, monId));
      if (monRangIndex >= 0) {
        const moi = joueurs[monRangIndex];
        const surLePodium = monRangIndex < 3;
        cartoucheMoi.classList.remove('hidden');
        cartoucheMoi.innerHTML = `
          <div class="ma-position-contenu">
            <div class="ma-position-entete">
              <span class="icone-cible">🎯</span>
              <span class="ma-position-titre-texte">Ta Position Actuelle : <strong class="valeur-mon-rang">#${monRangIndex + 1}</strong> <span class="sur-total-disciples">sur ${joueurs.length} disciple${joueurs.length > 1 ? 's' : ''} ${surLePodium ? '• 🏆 Sur le Podium !' : ''}</span></span>
            </div>
            <div class="ma-position-stats">
              <span class="stat-pilule-moi"><span class="pilule-icone">👤</span> Disciple : <strong>${echapper(moi.pseudo)}</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">⭐</span> Étoiles : <strong>${moi.etoilesTotal || 0} / 30</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">⚡</span> Score : <strong>${moi.scoreTotal || 0} / 100</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">📜</span> Niveau atteint : <strong>${moi.niveauxDebloques || 1} / 10</strong></span>
            </div>
          </div>
        `;
      } else {
        cartoucheMoi.classList.remove('hidden');
        cartoucheMoi.innerHTML = `
          <div class="ma-position-contenu">
            <div class="ma-position-entete">
              <span class="icone-cible">🎯</span>
              <span class="ma-position-titre-texte">Participe au Défi : <strong class="valeur-mon-rang">Pas encore classé</strong></span>
            </div>
            <div class="ma-position-stats">
              <span class="stat-pilule-moi">Joue et valide le Niveau 1 pour inscrire ton nom au palmarès mondial !</span>
            </div>
          </div>
        `;
      }
    }

    // 2. Rendu du Podium (1, 2 ou 3 premiers)
    if (conteneurPodium) {
      conteneurPodium.innerHTML = '';

      if (joueurs.length === 1) {
        conteneurPodium.className = 'podium-classement seul';
        conteneurPodium.appendChild(creerCartePodium({ place: 1, data: joueurs[0], classe: 'or', couronne: '👑' }, monPseudo, monId));
      } else if (joueurs.length === 2) {
        conteneurPodium.className = 'podium-classement duo';
        conteneurPodium.appendChild(creerCartePodium({ place: 1, data: joueurs[0], classe: 'or', couronne: '👑' }, monPseudo, monId));
        conteneurPodium.appendChild(creerCartePodium({ place: 2, data: joueurs[1], classe: 'argent', couronne: '🥈' }, monPseudo, monId));
      } else if (joueurs.length >= 3) {
        conteneurPodium.className = 'podium-classement';
        const ordrePodium = [
          { place: 2, data: joueurs[1], classe: 'argent', couronne: '🥈' },
          { place: 1, data: joueurs[0], classe: 'or', couronne: '👑' },
          { place: 3, data: joueurs[2], classe: 'bronze', couronne: '🥉' }
        ];
        ordrePodium.forEach(item => {
          conteneurPodium.appendChild(creerCartePodium(item, monPseudo, monId));
        });
      }
    }

    // 3. Rendu de la Table (Rangs 4 à 50)
    tableCorps.innerHTML = '';
    const resteJoueurs = joueurs.slice(3);

    if (resteJoueurs.length === 0) {
      if (joueurs.length === 0) {
        tableCorps.innerHTML = `<tr><td colspan="5" class="classement-vide">✨ Aucun score enregistré pour l'instant. Termine ton premier niveau pour inscrire ton nom au palmarès !</td></tr>`;
      } else {
        tableCorps.innerHTML = `<tr><td colspan="5" class="classement-vide">✨ Tous les disciples actuels occupent le podium d'honneur ! Les rangs 4 et suivants apparaîtront au fil des nouvelles parties.</td></tr>`;
      }
    } else {
      resteJoueurs.forEach((j, idx) => {
        const rang = idx + 4;
        const joueurEstMoi = estMoi(j, monPseudo, monId);
        const tr = document.createElement('tr');
        if (joueurEstMoi) tr.className = 'ligne-moi';

        tr.innerHTML = `
          <td class="col-rang"><span class="badge-rang">#${rang}</span></td>
          <td class="col-joueur">
            <span class="avatar-mini">${obtenirInitiale(j.pseudo)}</span>
            <span class="nom-joueur-table">${echapper(j.pseudo)}</span>
            ${joueurEstMoi ? '<span class="tag-moi-mini">Toi</span>' : ''}
          </td>
          <td class="col-niveau"><span class="pilule-niveau">${j.niveauxDebloques || 1} / 10</span></td>
          <td class="col-etoiles">⭐ <strong>${j.etoilesTotal || 0}</strong></td>
          <td class="col-score"><strong>${j.scoreTotal || 0}</strong> / 100</td>
        `;
        tableCorps.appendChild(tr);
      });
    }
  }

  /* ---------------- Gestion de l'Interface Utilisateur (Modal) ---------------- */

  function ouvrirModal() {
    const modal = document.getElementById('modal-classement');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    const corps = modal.querySelector('.modal-corps-classement');
    if (corps) corps.scrollTop = 0;
    afficherClassementDansModal();
  }

  function fermerModal() {
    const modal = document.getElementById('modal-classement');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function initialiserUI() {
    const btnNav = document.getElementById('btn-ouvrir-classement');
    const btnHub = document.getElementById('btn-classement-hub');
    const btnFin = document.getElementById('btn-voir-classement-fin');
    const btnFermer = document.getElementById('btn-fermer-classement');
    const modal = document.getElementById('modal-classement');
    const btnActualiser = document.getElementById('btn-actualiser-classement');

    if (btnNav) btnNav.addEventListener('click', ouvrirModal);
    if (btnHub) btnHub.addEventListener('click', ouvrirModal);
    if (btnFin) btnFin.addEventListener('click', ouvrirModal);
    if (btnFermer) btnFermer.addEventListener('click', fermerModal);

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) fermerModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        fermerModal();
      }
    });

    if (btnActualiser) {
      btnActualiser.addEventListener('click', () => {
        afficherClassementDansModal();
      });
    }

    // Filtres
    const filtres = document.querySelectorAll('.btn-filtre-classement');
    filtres.forEach(btn => {
      btn.addEventListener('click', () => {
        filtres.forEach(b => b.classList.remove('actif'));
        btn.classList.add('actif');
        filtreActif = btn.dataset.filtre || 'tous';
        afficherClassementDansModal();
      });
    });
  }

  // Initialisation dès que le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initialiserFirebase();
      initialiserUI();
    });
  } else {
    initialiserFirebase();
    initialiserUI();
  }

  // Exportation publique
  window.Classement = {
    synchroniserScore: synchroniserScore,
    restaurerProgression: restaurerProgressionDepuisCloud,
    ouvrir: ouvrirModal,
    fermer: fermerModal,
    actualiser: afficherClassementDansModal
  };

})();
