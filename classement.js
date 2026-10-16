/**
 * DÉFI JEAN — SERVICE DE CLASSEMENT EN LIGNE (FIREBASE FIRESTORE)
 * 
 * - Synchronisation en temps réel du classement des joueurs
 * - Podium dynamique Top 3 (Or, Argent, Bronze)
 * - Filtres par étoiles, scores cumulés et niveaux débloqués
 * - Supporte le mode en ligne Firebase Firestore et un mode démo/local résilient
 */

(function () {
  'use strict';

  const CLE_ID_JOUEUR = 'defiJean.v2.idJoueur';
  const CLE_CLASSEMENT_LOCAL = 'defiJean.v2.classementLocal';
  const NOM_COLLECTION = 'classement_defi_jean';

  let db = null;
  let firestoreModule = null;
  let filtreActif = 'tous';
  let statutConnexion = 'init'; // 'online' | 'local' | 'error'

  // Joueurs modèles pour alimenter le classement avant la première configuration Firebase
  const JOUEURS_MODELES = [
    { idJoueur: 'demo_1', pseudo: 'Jean le Bien-Aimé', etoilesTotal: 30, scoreTotal: 100, niveauxDebloques: 10, horodatage: Date.now() - 3600000 * 5 },
    { idJoueur: 'demo_2', pseudo: 'Marie de Magdala', etoilesTotal: 28, scoreTotal: 96, niveauxDebloques: 10, horodatage: Date.now() - 3600000 * 12 },
    { idJoueur: 'demo_3', pseudo: 'Nathanaël', etoilesTotal: 26, scoreTotal: 92, niveauxDebloques: 9, horodatage: Date.now() - 3600000 * 24 },
    { idJoueur: 'demo_4', pseudo: 'Nicodème', etoilesTotal: 24, scoreTotal: 88, niveauxDebloques: 8, horodatage: Date.now() - 3600000 * 36 },
    { idJoueur: 'demo_5', pseudo: 'Marthe de Béthanie', etoilesTotal: 21, scoreTotal: 82, niveauxDebloques: 7, horodatage: Date.now() - 3600000 * 48 },
    { idJoueur: 'demo_6', pseudo: 'Simon Pierre', etoilesTotal: 19, scoreTotal: 78, niveauxDebloques: 7, horodatage: Date.now() - 3600000 * 60 },
    { idJoueur: 'demo_7', pseudo: 'Philippe', etoilesTotal: 16, scoreTotal: 68, niveauxDebloques: 6, horodatage: Date.now() - 3600000 * 72 }
  ];

  /* ---------------- Identifiant Unique Joueur ---------------- */

  function obtenirIdJoueur() {
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

    try {
      // Import dynamique des modules officiels Firebase v11 (ESM CDN)
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js');
      const firestore = await import('https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js');

      const app = initializeApp(window.FIREBASE_CONFIG);
      db = firestore.getFirestore(app);
      firestoreModule = firestore;
      statutConnexion = 'online';
      return true;
    } catch (err) {
      console.warn("Connexion Firebase impossible, repli sur le mode local :", err);
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

    return {
      idJoueur: obtenirIdJoueur(),
      pseudo: (progression && progression.pseudo ? progression.pseudo.trim() : '') || 'Disciple',
      scoreTotal: scoreTotal,
      etoilesTotal: etoilesTotal,
      niveauxDebloques: Math.max(1, niveauxDebloques),
      dernierNiveauJoue: idNiveau || 1,
      dernierScore: typeof dernierScoreManche === 'number' ? dernierScoreManche : 0,
      horodatage: Date.now(),
      dateTexte: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };
  }

  /* ---------------- Sauvegarde & Synchronisation du Score ---------------- */

  async function synchroniserScore(progression, dernierScoreManche, idNiveau) {
    const payload = calculerStatsJoueur(progression, dernierScoreManche, idNiveau);

    // 1. Toujours enregistrer localement pour la résilience
    sauvegarderLocalement(payload);

    // 2. Si Firebase n'est pas encore initialisé, tenter l'initialisation
    if (statutConnexion === 'init') {
      await initialiserFirebase();
    }

    // 3. Si en ligne, envoyer à Cloud Firestore
    if (statutConnexion === 'online' && db && firestoreModule) {
      try {
        const { doc, setDoc } = firestoreModule;
        await setDoc(doc(db, NOM_COLLECTION, payload.idJoueur), payload, { merge: true });
      } catch (e) {
        console.warn("Échec de synchronisation vers Firestore :", e);
      }
    }
  }

  function sauvegarderLocalement(payload) {
    try {
      let classementLocal = chargerClassementLocal();
      const index = classementLocal.findIndex(j => j.idJoueur === payload.idJoueur);
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
      if (!brut) return [...JOUEURS_MODELES];
      const parsed = JSON.parse(brut);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...JOUEURS_MODELES];
    } catch (e) {
      return [...JOUEURS_MODELES];
    }
  }

  /* ---------------- Récupération des Données de Classement ---------------- */

  async function recupererScores() {
    if (statutConnexion === 'init') {
      await initialiserFirebase();
    }

    // Si Firebase est connecté, récupérer depuis Firestore
    if (statutConnexion === 'online' && db && firestoreModule) {
      try {
        const { collection, getDocs, query, orderBy, limit } = firestoreModule;
        const q = query(collection(db, NOM_COLLECTION), orderBy('etoilesTotal', 'desc'), limit(100));
        const snapshot = await getDocs(q);

        const joueurs = [];
        snapshot.forEach(docSnap => {
          joueurs.push(docSnap.data());
        });

        if (joueurs.length > 0) {
          return trierEtFiltrer(joueurs, filtreActif);
        }
      } catch (err) {
        console.warn("Erreur de lecture Firestore, bascule sur données locales :", err);
      }
    }

    // Sinon, lire les données locales / modèles
    const local = chargerClassementLocal();
    return trierEtFiltrer(local, filtreActif);
  }

  function trierEtFiltrer(liste, filtre) {
    let resultats = [...liste];

    if (filtre === 'complets') {
      resultats = resultats.filter(j => (j.niveauxDebloques || 1) >= 10);
    } else if (filtre === 'recents') {
      resultats.sort((a, b) => (b.horodatage || 0) - (a.horodatage || 0));
      return resultats.slice(0, 50);
    }

    // Tri par défaut : Étoiles totales DESC > Score total DESC > Niveaux DESC > Plus ancien
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

  async function afficherClassementDansModal() {
    const conteneurPodium = document.getElementById('podium-classement');
    const tableCorps = document.getElementById('corps-table-classement');
    const cartoucheMoi = document.getElementById('ma-position-classement');
    const statutBadge = document.getElementById('badge-statut-cloud');

    if (!tableCorps) return;

    // Indicateur de chargement
    tableCorps.innerHTML = `<tr><td colspan="5" class="chargement-classement">Chargement du palmarès des disciples…</td></tr>`;

    const joueurs = await recupererScores();
    const monId = obtenirIdJoueur();

    // Mise à jour du badge de connexion (sans termes techniques)
    if (statutBadge) {
      if (statutConnexion === 'online') {
        statutBadge.className = 'badge-classement en-ligne';
        statutBadge.innerHTML = '🟢 En direct • Classement mondial des disciples';
      } else {
        statutBadge.className = 'badge-classement mode-local';
        statutBadge.innerHTML = '🟡 Palmarès des disciples';
      }
    }

    // 1. Rendu du Cartouche « Ma position » (En tête pour visibilité immédiate)
    if (cartoucheMoi) {
      const monRangIndex = joueurs.findIndex(j => j.idJoueur === monId);
      if (monRangIndex >= 0) {
        const moi = joueurs[monRangIndex];
        const surLePodium = monRangIndex < 3;
        cartoucheMoi.classList.remove('hidden');
        cartoucheMoi.innerHTML = `
          <div class="ma-position-contenu">
            <div class="ma-position-entete">
              <span class="icone-cible">🎯</span>
              <span class="ma-position-titre-texte">Ta Position Actuelle : <strong class="valeur-mon-rang">#${monRangIndex + 1}</strong> <span class="sur-total-disciples">sur ${joueurs.length} disciples ${surLePodium ? '• 🏆 Sur le Podium !' : ''}</span></span>
            </div>
            <div class="ma-position-stats">
              <span class="stat-pilule-moi"><span class="pilule-icone">👤</span> Disciple : <strong>${echapper(moi.pseudo)}</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">⭐</span> Étoiles : <strong>${moi.etoilesTotal || 0} / 30</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">⚡</span> Score : <strong>${moi.scoreTotal || 0} / 100</strong></span>
              <span class="stat-pilule-moi"><span class="pilule-icone">📜</span> Progression : <strong>Niveau ${moi.niveauxDebloques || 1} / 10</strong></span>
            </div>
          </div>
        `;
      } else {
        cartoucheMoi.classList.add('hidden');
      }
    }

    // 2. Rendu du Podium (Top 3)
    if (conteneurPodium) {
      conteneurPodium.innerHTML = '';
      const top3 = joueurs.slice(0, 3);

      if (top3.length > 0) {
        // Ordre d'affichage du podium : 2e (Argent), 1er (Or), 3e (Bronze)
        const ordrePodium = [
          { place: 2, data: top3[1], classe: 'argent', couronne: '🥈' },
          { place: 1, data: top3[0], classe: 'or', couronne: '👑' },
          { place: 3, data: top3[2], classe: 'bronze', couronne: '🥉' }
        ];

        ordrePodium.forEach(item => {
          if (!item.data) return;
          const j = item.data;
          const estMoi = j.idJoueur === monId;

          const cartePodium = document.createElement('div');
          cartePodium.className = `carte-podium ${item.classe} ${estMoi ? 'c-est-moi' : ''}`;
          cartePodium.innerHTML = `
            <div class="podium-couronne">${item.couronne}</div>
            <div class="podium-avatar">${obtenirInitiale(j.pseudo)}</div>
            <div class="podium-rang">#${item.place}</div>
            <h4 class="podium-nom" title="${echapper(j.pseudo)}">${echapper(j.pseudo)}${estMoi ? ' <span class="tag-moi">(Toi)</span>' : ''}</h4>
            <div class="podium-etoiles">⭐ <strong>${j.etoilesTotal || 0}</strong> / 30</div>
            <div class="podium-score">Score total : <strong>${j.scoreTotal || 0}</strong></div>
            <div class="podium-niveau">Niveau atteint : <strong>${j.niveauxDebloques || 1}/10</strong></div>
          `;
          conteneurPodium.appendChild(cartePodium);
        });
      }
    }

    // 3. Rendu de la Table (Rangs 4 à 50)
    tableCorps.innerHTML = '';
    const resteJoueurs = joueurs.slice(3);

    if (resteJoueurs.length === 0) {
      if (joueurs.length === 0) {
        tableCorps.innerHTML = `<tr><td colspan="5" class="classement-vide">Aucun score enregistré pour l'instant. Sois le premier disciple à inscrire ton nom !</td></tr>`;
      } else {
        tableCorps.innerHTML = `<tr><td colspan="5" class="classement-vide">✨ Les premiers disciples occupent actuellement le podium d'honneur ! Les rangs 4 et suivants s'afficheront ici au fil des nouvelles parties.</td></tr>`;
      }
    } else {
      resteJoueurs.forEach((j, idx) => {
        const rang = idx + 4;
        const estMoi = j.idJoueur === monId;
        const tr = document.createElement('tr');
        if (estMoi) tr.className = 'ligne-moi';

        tr.innerHTML = `
          <td class="col-rang"><span class="badge-rang">#${rang}</span></td>
          <td class="col-joueur">
            <span class="avatar-mini">${obtenirInitiale(j.pseudo)}</span>
            <span class="nom-joueur-table">${echapper(j.pseudo)}</span>
            ${estMoi ? '<span class="tag-moi-mini">Toi</span>' : ''}
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
    // Boutons d'ouverture
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
    if (btnActualiser) btnActualiser.addEventListener('click', afficherClassementDansModal);

    // Clic en dehors pour fermer
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) fermerModal();
      });
    }

    // Touche Échap
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        fermerModal();
      }
    });

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
    ouvrir: ouvrirModal,
    fermer: fermerModal,
    actualiser: afficherClassementDansModal
  };

})();
