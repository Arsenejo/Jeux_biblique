/* ══════════════════════════════════════════════════════════════════════════
   DÉFI JEAN — LOGIQUE DU JEU (10 NIVEAUX • LOUIS SEGOND 1910)
   - 10 Niveaux thématiques couvrant tout le corpus johannique
   - 10 Questions aléatoires par niveau
   - 25 Secondes par question (Chronomètre à échéance absolue)
   - Progression persistée dans localStorage avec déblocage et étoiles
   - Effets visuels & sonores inspirés de motion-web
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ---------------- Configuration & Constantes ---------------- */

  const NB_QUESTIONS_PAR_NIVEAU = 10;
  const TEMPS_PAR_QUESTION = 25;       // 25 secondes par question
  const SEUIL_DEBLOCAGE = 6;           // 6/10 pour valider et débloquer le niveau suivant
  const CLE_STOCKAGE_V2 = 'defiJean.v2.progression';
  const CLE_STOCKAGE_MANCHE = 'defiJean.v2.mancheEnCours';
  const CIRCONFERENCE_CHRONO = 263.89; // 2 * PI * 42

  const $ = function (id) { return document.getElementById(id); };

  const els = {
    // Canvas & Arrière-plan
    bgCanvas: $('bg-canvas'),
    canvasConfetti: $('canvas-confetti'),

    // En-tête
    etoilesTotalGlobal: $('etoiles-total-global'),
    btnSon: $('btn-son'),
    iconeSon: $('icone-son'),

    // Écrans
    ecranAccueil: $('ecran-accueil'),
    ecranQuiz: $('ecran-quiz'),
    ecranFin: $('ecran-fin'),

    // Écran 1 : Hub
    pseudo: $('pseudo'),
    erreurPseudo: $('erreur-pseudo'),
    statNiveauxDebloques: $('stat-niveaux-debloques'),
    statQuestionsReussies: $('stat-questions-reussies'),
    encartReprisePartie: $('encart-reprise-partie'),
    repriseTitreNiveau: $('reprise-titre-niveau'),
    repriseDetails: $('reprise-details'),
    btnReprendrePartie: $('btn-reprendre-partie'),
    btnAbandonnerPartie: $('btn-abandonner-partie'),
    grilleNiveaux: $('grille-niveaux'),
    btnReinitialiser: $('btn-reinitialiser-progression'),

    // Écran 2 : Quiz
    btnQuitterQuiz: $('btn-quitter-quiz'),
    quizBadgeIcone: $('quiz-badge-icone'),
    quizTitreNiveau: $('quiz-titre-niveau'),
    scoreEnCours: $('score-en-cours'),
    quizTotalQuestions: $('quiz-total-questions'),
    quizProgressBar: $('quiz-progress-bar'),
    chronoAnneau: $('chrono-anneau'),
    chronoSecondes: $('chrono-secondes'),
    chronoCirculaireWrap: document.querySelector('.chrono-circulaire-wrap'),
    compteurQuestionBadge: $('compteur-question-badge'),
    referenceVerset: $('reference-verset'),
    blocVerset: $('bloc-verset'),
    texteVerset: $('texte-verset'),
    enonceQuestion: $('enonce-question'),
    grilleOptions: $('grille-options'),
    alerteTemps: $('alerte-temps'),
    zoneLecon: $('zone-lecon'),
    texteLecon: $('texte-lecon'),
    btnQuestionSuivante: $('btn-question-suivante'),

    // Écran 3 : Fin
    bilanIconeVictoire: $('bilan-icone-victoire'),
    bilanStatutTag: $('bilan-statut-tag'),
    bilanTitre: $('bilan-titre'),
    bilanNomNiveau: $('bilan-nom-niveau'),
    etoile1: $('etoile-1'),
    etoile2: $('etoile-2'),
    etoile3: $('etoile-3'),
    scoreFinalChiffre: $('score-final-chiffre'),
    mentionFelicitations: $('mention-felicitations'),
    valeurEmpreinte: $('valeur-empreinte'),
    btnNiveauSuivant: $('btn-niveau-suivant'),
    btnRejouerNiveau: $('btn-rejouer-niveau'),
    btnRetourHub: $('btn-retour-hub'),
    canvasCarteScore: $('canvas-carte-score'),
    apercuCarteImg: $('apercu-carte-img'),
    btnPartagerCarte: $('btn-partager-carte'),
    btnTelechargerCarte: $('btn-telecharger-carte'),
    btnCopierCarte: $('btn-copier-carte'),
    feedbackCarte: $('feedback-carte'),
    listeCorrige: $('liste-corrige')
  };

  /* ---------------- Synthétiseur Audio Web Audio API (Zéro dépendance) ---------------- */

  const audioCtx = (function () {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      return AudioContext ? new AudioContext() : null;
    } catch (e) {
      return null;
    }
  })();

  function jouerSon(type) {
    if (!progression.sonActif || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const t = audioCtx.currentTime;

      if (type === 'bonne_reponse') {
        // Carillon céleste ascendant (Do - Mi - Sol - Do aigu)
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + i * 0.08);
          gain.gain.setValueAtTime(0.14, t + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 0.35);
        });
      } else if (type === 'mauvaise_reponse') {
        // Note grave feutrée avec résonance
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.35);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.35);
      } else if (type === 'victoire') {
        // Fanfare triomphante
        const accord = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        accord.forEach((freq, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + i * 0.1);
          gain.gain.setValueAtTime(0.15, t + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(t + i * 0.1);
          osc.stop(t + i * 0.1 + 0.6);
        });
      } else if (type === 'alerte_chrono') {
        // Battement subtil
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      }
    } catch (e) {
      // Ignorer silencieusement si l'audio est restreint
    }
  }

  /* ---------------- Fonctions Utilitaires ---------------- */

  function melanger(tableau) {
    const copie = tableau.slice();
    for (let i = copie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tampon = copie[i];
      copie[i] = copie[j];
      copie[j] = tampon;
    }
    return copie;
  }

  function echapper(texte) {
    return String(texte || '').replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function empreinte(texte) {
    let h = 0x811c9dc5;
    for (let i = 0; i < texte.length; i++) {
      h ^= texte.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return 'DJ-' + h.toString(36).toUpperCase().padStart(6, '0');
  }

  function dateLongue(d) {
    try {
      return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return d.toISOString().split('T')[0];
    }
  }

  /* ---------------- Stockage & État Global ---------------- */

  const stockage = (function () {
    try {
      const cle = '__defiJean_v2_test__';
      window.localStorage.setItem(cle, '1');
      window.localStorage.removeItem(cle);
      return window.localStorage;
    } catch (e) {
      return null;
    }
  })();

  function chargerProgression() {
    const parDefaut = {
      pseudo: '',
      sonActif: true,
      niveaux: {
        1: { debloque: true, scoreMax: 0, etoiles: 0, complete: false }
      }
    };
    for (let lvl = 2; lvl <= 10; lvl++) {
      parDefaut.niveaux[lvl] = { debloque: false, scoreMax: 0, etoiles: 0, complete: false };
    }

    if (!stockage) return parDefaut;
    try {
      const brut = stockage.getItem(CLE_STOCKAGE_V2);
      if (!brut) return parDefaut;
      const parsed = JSON.parse(brut);
      // Fusionner pour garantir l'intégrité de tous les 10 niveaux
      for (let lvl = 1; lvl <= 10; lvl++) {
        if (!parsed.niveaux || !parsed.niveaux[lvl]) {
          parsed.niveaux = parsed.niveaux || {};
          parsed.niveaux[lvl] = { debloque: lvl === 1, scoreMax: 0, etoiles: 0, complete: false };
        }
      }
      return parsed;
    } catch (e) {
      return parDefaut;
    }
  }

  let progression = chargerProgression();

  function sauvegarderProgression() {
    if (!stockage) return;
    try {
      stockage.setItem(CLE_STOCKAGE_V2, JSON.stringify(progression));
    } catch (e) {
      console.warn("Impossible d'enregistrer dans localStorage:", e);
    }
  }

  /* ---------------- État de la Manche en cours ---------------- */

  let niveauEnCours = 1;
  let questionsManche = [];
  let indexQuestion = 0;
  let scoreManche = 0;
  let reponsesJoueur = [];
  let dejaRepondu = false;
  let echeanceChrono = 0;
  let timerInterval = null;
  let derniereCarteBlob = null;
  let alerteChronoJouee = false;

  /* ---------------- Persistance & Reprise de la Manche en Cours ---------------- */

  function sauvegarderMancheEnCours() {
    if (!stockage) return;
    if (!questionsManche || questionsManche.length === 0 || indexQuestion >= questionsManche.length) {
      nettoyerMancheEnCours();
      return;
    }
    const snapshot = {
      idNiveau: niveauEnCours,
      questions: questionsManche,
      indexQuestion: indexQuestion,
      scoreManche: scoreManche,
      reponsesJoueur: reponsesJoueur,
      dejaRepondu: dejaRepondu,
      horodatage: Date.now()
    };
    try {
      stockage.setItem(CLE_STOCKAGE_MANCHE, JSON.stringify(snapshot));
    } catch (e) {
      console.warn("Impossible d'enregistrer la manche en cours :", e);
    }
  }

  function lireMancheEnCours() {
    if (!stockage) return null;
    try {
      const brut = stockage.getItem(CLE_STOCKAGE_MANCHE);
      if (!brut) return null;
      const data = JSON.parse(brut);
      if (
        !data ||
        typeof data.idNiveau !== 'number' ||
        data.idNiveau < 1 ||
        data.idNiveau > 10 ||
        !Array.isArray(data.questions) ||
        data.questions.length === 0 ||
        typeof data.indexQuestion !== 'number' ||
        data.indexQuestion >= data.questions.length
      ) {
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  }

  function nettoyerMancheEnCours() {
    if (!stockage) return;
    try {
      stockage.removeItem(CLE_STOCKAGE_MANCHE);
    } catch (e) {}
  }

  function verifierEtAfficherReprise() {
    const saved = lireMancheEnCours();
    if (!saved || !els.encartReprisePartie) {
      if (els.encartReprisePartie) {
        els.encartReprisePartie.classList.add('hidden');
      }
      return null;
    }

    const metaNiveau = NIVEAUX_DEFI.find(n => n.id === saved.idNiveau) || { titre: `Niveau ${saved.idNiveau}` };
    const numQ = Math.min(saved.indexQuestion + 1, saved.questions.length);

    els.repriseTitreNiveau.textContent = `Niveau ${saved.idNiveau} : ${metaNiveau.titre}`;
    els.repriseDetails.textContent = `Progression : Question ${numQ} / ${saved.questions.length} • Score actuel : ${saved.scoreManche} / ${Math.max(0, numQ - 1)}`;
    els.encartReprisePartie.classList.remove('hidden');
    return saved;
  }

  function reprendreMancheEnCours() {
    const saved = lireMancheEnCours();
    if (!saved) return;

    const pseudoSaisi = (els.pseudo.value || '').trim() || progression.pseudo || 'Disciple';
    progression.pseudo = pseudoSaisi;
    els.pseudo.value = pseudoSaisi;
    sauvegarderProgression();

    niveauEnCours = saved.idNiveau;
    questionsManche = saved.questions;
    indexQuestion = saved.indexQuestion;
    scoreManche = saved.scoreManche;
    reponsesJoueur = saved.reponsesJoueur || [];
    dejaRepondu = !!saved.dejaRepondu;

    const metaNiveau = NIVEAUX_DEFI.find(n => n.id === niveauEnCours) || { titre: `Niveau ${niveauEnCours}`, badge: '📖' };
    els.quizBadgeIcone.textContent = metaNiveau.badge;
    els.quizTitreNiveau.textContent = `Niveau ${niveauEnCours} : ${metaNiveau.titre}`;
    els.quizTotalQuestions.textContent = NB_QUESTIONS_PAR_NIVEAU;
    els.scoreEnCours.textContent = String(scoreManche);

    basculerEcran(els.ecranQuiz);

    if (dejaRepondu) {
      restaurerQuestionRepondue();
    } else {
      afficherQuestion();
    }
  }

  function abandonnerMancheEnCours() {
    if (confirm('Es-tu certain de vouloir abandonner cette partie en cours ? Ta progression sur ce niveau sera réinitialisée.')) {
      stopperChrono();
      nettoyerMancheEnCours();
      if (els.encartReprisePartie) {
        els.encartReprisePartie.classList.add('hidden');
      }
      rendreGrilleNiveaux();
    }
  }

  function restaurerQuestionRepondue() {
    if (indexQuestion >= questionsManche.length) {
      terminerManche();
      return;
    }

    stopperChrono();
    const q = questionsManche[indexQuestion];
    const derniereRep = reponsesJoueur[reponsesJoueur.length - 1];

    if (!derniereRep || !derniereRep.question || derniereRep.question.q !== q.q) {
      dejaRepondu = false;
      afficherQuestion();
      return;
    }

    const pourcentage = ((indexQuestion + 1) / NB_QUESTIONS_PAR_NIVEAU) * 100;
    els.quizProgressBar.style.width = `${pourcentage}%`;

    els.compteurQuestionBadge.textContent = `Question ${indexQuestion + 1} / ${NB_QUESTIONS_PAR_NIVEAU}`;
    els.referenceVerset.textContent = q.ref || 'Jean';

    if (q.verset) {
      els.texteVerset.textContent = q.verset;
      els.blocVerset.classList.remove('hidden');
    } else {
      els.blocVerset.classList.add('hidden');
    }

    els.enonceQuestion.textContent = q.q;

    if (derniereRep.tempsEcoule) {
      els.alerteTemps.classList.remove('hidden');
    } else {
      els.alerteTemps.classList.add('hidden');
    }

    els.grilleOptions.innerHTML = '';
    const lettres = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.type = 'button';
      btn.disabled = true;

      if (idx === q.answer) {
        btn.classList.add('correcte');
      } else if (idx === derniereRep.indexChoisi) {
        btn.classList.add('incorrecte');
      }

      btn.innerHTML = `
        <span class="lettre-option">${lettres[idx]}</span>
        <span class="texte-option">${echapper(opt)}</span>
      `;
      els.grilleOptions.appendChild(btn);
    });

    mettreAJourChronoVisuel(0, 0);

    els.texteLecon.textContent = q.lecon;
    els.zoneLecon.classList.remove('hidden');
    els.btnQuestionSuivante.classList.remove('hidden');
    els.btnQuestionSuivante.focus();
  }

  /* ---------------- Animation d'Arrière-Plan (Particules Célestes) ---------------- */

  function initFondCeleste() {
    const canvas = els.bgCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particules = [];
    let souris = { x: -1000, y: -1000, rayon: 140 };

    function redimensionner() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      creerParticules();
    }

    function creerParticules() {
      particules = [];
      const nb = Math.min(width > 768 ? 65 : 35, 80);
      for (let i = 0; i < nb; i++) {
        particules.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          taille: Math.random() * 2 + 0.8,
          baseAlpha: Math.random() * 0.6 + 0.2,
          phase: Math.random() * Math.PI * 2,
          vitesseScintillement: 0.02 + Math.random() * 0.03
        });
      }
    }

    window.addEventListener('resize', redimensionner);
    window.addEventListener('mousemove', (e) => {
      souris.x = e.clientX;
      souris.y = e.clientY;
    });
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        souris.x = e.touches[0].clientX;
        souris.y = e.touches[0].clientY;
      }
    });

    redimensionner();

    let temps = 0;
    function animer() {
      temps++;
      ctx.clearRect(0, 0, width, height);

      // Fond avec dégradé radial subtil
      const grad = ctx.createRadialGradient(width * 0.5, height * 0.2, 50, width * 0.5, height * 0.5, width * 0.8);
      grad.addColorStop(0, '#0a1024');
      grad.addColorStop(0.6, '#060913');
      grad.addColorStop(1, '#03050a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < particules.length; i++) {
        const p = particules[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.phase += p.vitesseScintillement;
        const scintillement = Math.sin(p.phase) * 0.3 + 0.7;
        const alpha = p.baseAlpha * scintillement;

        // Réactivité douce à la souris
        const dx = souris.x - p.x;
        const dy = souris.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < souris.rayon) {
          const force = (souris.rayon - dist) / souris.rayon;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.taille, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 199, 98, ${alpha})`;
        ctx.shadowColor = 'rgba(245, 199, 98, 0.4)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animer);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      requestAnimationFrame(animer);
    }
  }

  /* ---------------- Confettis Célestes (Écran de Victoire) ---------------- */

  function lancerConfettis() {
    const canvas = els.canvasConfetti;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettis = [];
    const couleurs = ['#f5c762', '#ffd700', '#ffffff', '#38bdf8', '#e2e8f0'];
    for (let i = 0; i < 90; i++) {
      confettis.push({
        x: canvas.width * 0.5 + (Math.random() - 0.5) * 100,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        rotation: Math.random() * 360,
        vitesseRot: (Math.random() - 0.5) * 10,
        taille: Math.random() * 8 + 4,
        couleur: couleurs[Math.floor(Math.random() * couleurs.length)],
        gravite: 0.32,
        opacite: 1
      });
    }

    let iterations = 0;
    function animerConfettis() {
      iterations++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let restant = 0;
      for (let i = 0; i < confettis.length; i++) {
        const c = confettis[i];
        c.vy += c.gravite;
        c.x += c.vx;
        c.y += c.vy;
        c.rotation += c.vitesseRot;
        if (iterations > 60) {
          c.opacite -= 0.015;
        }

        if (c.opacite > 0 && c.y < canvas.height + 20) {
          restant++;
          ctx.save();
          ctx.translate(c.x, c.y);
          ctx.rotate((c.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, c.opacite);
          ctx.fillStyle = c.couleur;
          ctx.fillRect(-c.taille / 2, -c.taille / 2, c.taille, c.taille * 0.7);
          ctx.restore();
        }
      }

      if (restant > 0 && iterations < 180) {
        requestAnimationFrame(animerConfettis);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    requestAnimationFrame(animerConfettis);
  }

  /* ---------------- Gestion de l'Affichage des Écrans ---------------- */

  function basculerEcran(ecranCible) {
    [els.ecranAccueil, els.ecranQuiz, els.ecranFin].forEach(ecran => {
      if (ecran) ecran.classList.add('hidden');
    });
    if (ecranCible) {
      ecranCible.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ---------------- Rendu du Hub des 10 Niveaux ---------------- */

  function actualiserStatsGlobales() {
    let totalEtoiles = 0;
    let niveauxDebloques = 0;
    let questionsReussies = 0;

    for (let lvl = 1; lvl <= 10; lvl++) {
      const data = progression.niveaux[lvl];
      if (data) {
        if (data.debloque) niveauxDebloques++;
        totalEtoiles += (data.etoiles || 0);
        questionsReussies += (data.scoreMax || 0);
      }
    }

    els.etoilesTotalGlobal.textContent = totalEtoiles;
    els.statNiveauxDebloques.textContent = `${niveauxDebloques} / 10`;
    els.statQuestionsReussies.textContent = questionsReussies;
  }

  function rendreGrilleNiveaux() {
    if (!els.grilleNiveaux) return;
    actualiserStatsGlobales();
    const mancheSauvegardee = verifierEtAfficherReprise();
    els.grilleNiveaux.innerHTML = '';

    // Trouver le niveau en cours le plus haut débloqué mais non complété
    let idNiveauActuel = 1;
    for (let lvl = 1; lvl <= 10; lvl++) {
      if (progression.niveaux[lvl] && progression.niveaux[lvl].debloque) {
        idNiveauActuel = lvl;
      }
    }

    NIVEAUX_DEFI.forEach(niveau => {
      const etat = progression.niveaux[niveau.id] || { debloque: niveau.id === 1, scoreMax: 0, etoiles: 0, complete: false };
      const carte = document.createElement('div');
      carte.className = 'carte-niveau';

      const estEnCours = mancheSauvegardee && mancheSauvegardee.idNiveau === niveau.id;

      if (etat.debloque) {
        carte.classList.add('debloque');
        if (estEnCours) {
          carte.classList.add('en-cours');
        } else if (etat.complete) {
          carte.classList.add('complete');
        } else if (niveau.id === idNiveauActuel) {
          carte.classList.add('niveau-actuel');
        }
      } else {
        carte.classList.add('verrouille');
      }

      // Construction du code des étoiles
      const nbEtoiles = etat.etoiles || 0;
      let htmlEtoiles = '';
      for (let s = 1; s <= 3; s++) {
        if (s <= nbEtoiles) {
          htmlEtoiles += '<span class="etoile-obtenue">⭐</span>';
        } else {
          htmlEtoiles += '<span class="etoile-vide">★</span>';
        }
      }

      const statutBadge = estEnCours
        ? '⚔️'
        : (etat.debloque ? (etat.complete ? '👑' : niveau.badge) : '🔒');

      let libelleBouton = 'Verrouillé';
      if (etat.debloque) {
        if (estEnCours) {
          libelleBouton = `Reprendre (${mancheSauvegardee.indexQuestion + 1}/10) ▶️`;
        } else if (etat.scoreMax > 0) {
          libelleBouton = 'Rejouer';
        } else {
          libelleBouton = 'Jouer';
        }
      }

      carte.innerHTML = `
        <div class="en-tete-carte-niveau">
          <span class="badge-numero-niveau">NIVEAU ${niveau.id.toString().padStart(2, '0')}${estEnCours ? ' • EN COURS' : ''}</span>
          <span class="icone-statut-niveau">${statutBadge}</span>
        </div>
        <div class="corps-carte-niveau">
          <h3 class="titre-carte-niveau">${echapper(niveau.titre)}</h3>
          <span class="livre-carte-niveau">${echapper(niveau.livre)}</span>
          <p class="desc-carte-niveau">${echapper(niveau.description)}</p>
        </div>
        <div class="pied-carte-niveau">
          <div class="etoiles-niveau" title="${nbEtoiles} étoile(s) remportée(s)">
            ${htmlEtoiles}
          </div>
          <div class="score-max-niveau">
            ${estEnCours ? `Partie en cours : <strong>Q${mancheSauvegardee.indexQuestion + 1}/10</strong>` : (etat.scoreMax > 0 ? `Record : <strong>${etat.scoreMax}/10</strong>` : '')}
          </div>
          <button class="btn-lancer-niveau" type="button" ${!etat.debloque ? 'disabled' : ''}>
            ${libelleBouton}
          </button>
        </div>
      `;

      if (etat.debloque) {
        carte.addEventListener('click', () => {
          if (estEnCours) {
            reprendreMancheEnCours();
          } else if (mancheSauvegardee) {
            if (confirm(`Tu as une partie en cours au Niveau ${mancheSauvegardee.idNiveau}. Commencer le Niveau ${niveau.id} va l'annuler. Continuer ?`)) {
              nettoyerMancheEnCours();
              demarrerMancheNiveau(niveau.id);
            }
          } else {
            demarrerMancheNiveau(niveau.id);
          }
        });
      }

      els.grilleNiveaux.appendChild(carte);
    });
  }

  /* ---------------- Démarrage d'une Manche de Quiz ---------------- */

  function tirerQuestionsNiveau(idNiveau) {
    const pool = BANQUE_QUESTIONS.filter(q => q.level === idNiveau);
    if (!pool || pool.length === 0) {
      console.error(`Aucune question trouvée pour le niveau ${idNiveau}`);
      return [];
    }

    // Mélange aléatoire des questions de ce niveau
    const poolMelange = melanger(pool);
    // Prendre exactement 10 questions
    const selection = poolMelange.slice(0, NB_QUESTIONS_PAR_NIVEAU);

    // Mélanger aléatoirement les 4 options pour chaque question tirée
    return selection.map(q => {
      const texteBonneReponse = q.options[q.answer];
      const optionsMelangees = melanger(q.options);
      return {
        level: q.level,
        theme: q.theme,
        ref: q.ref,
        verset: q.verset,
        q: q.q,
        lecon: q.lecon,
        options: optionsMelangees,
        answer: optionsMelangees.indexOf(texteBonneReponse)
      };
    });
  }

  function demarrerMancheNiveau(idNiveau) {
    const pseudoSaisi = (els.pseudo.value || '').trim();
    if (!pseudoSaisi) {
      els.erreurPseudo.classList.remove('hidden');
      els.pseudo.focus();
      return;
    }
    els.erreurPseudo.classList.add('hidden');
    progression.pseudo = pseudoSaisi;
    sauvegarderProgression();

    niveauEnCours = idNiveau;
    const metaNiveau = NIVEAUX_DEFI.find(n => n.id === idNiveau) || { titre: `Niveau ${idNiveau}`, badge: '📖' };

    // Initialisation de la manche
    questionsManche = tirerQuestionsNiveau(idNiveau);
    indexQuestion = 0;
    scoreManche = 0;
    reponsesJoueur = [];
    dejaRepondu = false;
    sauvegarderMancheEnCours();

    // Mise à jour de l'en-tête du quiz
    els.quizBadgeIcone.textContent = metaNiveau.badge;
    els.quizTitreNiveau.textContent = `Niveau ${idNiveau} : ${metaNiveau.titre}`;
    els.quizTotalQuestions.textContent = NB_QUESTIONS_PAR_NIVEAU;
    els.scoreEnCours.textContent = '0';

    basculerEcran(els.ecranQuiz);
    afficherQuestion();
  }

  /* ---------------- Affichage d'une Question & Gestion du Chrono 25s ---------------- */

  function stopperChrono() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function demarrerChrono() {
    stopperChrono();
    alerteChronoJouee = false;
    echeanceChrono = Date.now() + TEMPS_PAR_QUESTION * 1000;

    els.chronoCirculaireWrap.classList.remove('alerte');
    mettreAJourChronoVisuel(TEMPS_PAR_QUESTION, 1);

    timerInterval = setInterval(() => {
      const restantMs = echeanceChrono - Date.now();
      const restantSec = Math.max(0, Math.ceil(restantMs / 1000));
      const ratio = Math.max(0, restantMs / (TEMPS_PAR_QUESTION * 1000));

      mettreAJourChronoVisuel(restantSec, ratio);

      if (restantSec <= 6) {
        els.chronoCirculaireWrap.classList.add('alerte');
        if (!alerteChronoJouee || restantSec <= 3) {
          jouerSon('alerte_chrono');
          alerteChronoJouee = true;
        }
      }

      if (restantMs <= 0) {
        stopperChrono();
        tempsEcoule();
      }
    }, 100);
  }

  function mettreAJourChronoVisuel(secondes, ratio) {
    els.chronoSecondes.textContent = secondes;
    // Mise à jour du cercle SVG stroke-dashoffset
    const offset = CIRCONFERENCE_CHRONO * (1 - ratio);
    els.chronoAnneau.style.strokeDashoffset = offset;
  }

  function afficherQuestion() {
    if (indexQuestion >= questionsManche.length) {
      terminerManche();
      return;
    }

    dejaRepondu = false;
    stopperChrono();

    const q = questionsManche[indexQuestion];

    // Mise à jour de la barre de progression
    const pourcentage = ((indexQuestion + 1) / NB_QUESTIONS_PAR_NIVEAU) * 100;
    els.quizProgressBar.style.width = `${pourcentage}%`;

    // Badges et énoncé
    els.compteurQuestionBadge.textContent = `Question ${indexQuestion + 1} / ${NB_QUESTIONS_PAR_NIVEAU}`;
    els.referenceVerset.textContent = q.ref || 'Jean';

    if (q.verset) {
      els.texteVerset.textContent = q.verset;
      els.blocVerset.classList.remove('hidden');
    } else {
      els.blocVerset.classList.add('hidden');
    }

    els.enonceQuestion.textContent = q.q;

    // Masquage des zones d'explication et alerte temps
    els.alerteTemps.classList.add('hidden');
    els.zoneLecon.classList.add('hidden');
    els.btnQuestionSuivante.classList.add('hidden');

    // Rendu des 4 options
    els.grilleOptions.innerHTML = '';
    const lettres = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.type = 'button';
      btn.innerHTML = `
        <span class="lettre-option">${lettres[idx]}</span>
        <span class="texte-option">${echapper(opt)}</span>
      `;

      btn.addEventListener('click', () => {
        validerReponse(idx);
      });

      els.grilleOptions.appendChild(btn);
    });

    sauvegarderMancheEnCours();
    demarrerChrono();
  }

  function validerReponse(indexChoisi) {
    if (dejaRepondu) return;
    dejaRepondu = true;
    stopperChrono();

    const q = questionsManche[indexQuestion];
    const estCorrect = (indexChoisi === q.answer);
    const boutons = els.grilleOptions.querySelectorAll('.btn-option');

    boutons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correcte');
      } else if (idx === indexChoisi) {
        btn.classList.add('incorrecte');
      }
    });

    if (estCorrect) {
      scoreManche++;
      els.scoreEnCours.textContent = scoreManche;
      jouerSon('bonne_reponse');
    } else {
      jouerSon('mauvaise_reponse');
    }

    reponsesJoueur.push({
      question: q,
      indexChoisi: indexChoisi,
      estCorrect: estCorrect,
      tempsEcoule: false
    });

    sauvegarderMancheEnCours();

    // Affichage de la leçon explicative
    els.texteLecon.textContent = q.lecon;
    els.zoneLecon.classList.remove('hidden');
    els.btnQuestionSuivante.classList.remove('hidden');
    els.btnQuestionSuivante.focus();
    els.btnQuestionSuivante.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function tempsEcoule() {
    if (dejaRepondu) return;
    dejaRepondu = true;

    const q = questionsManche[indexQuestion];
    const boutons = els.grilleOptions.querySelectorAll('.btn-option');

    boutons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answer) {
        btn.classList.add('correcte');
      }
    });

    els.alerteTemps.classList.remove('hidden');
    jouerSon('mauvaise_reponse');

    reponsesJoueur.push({
      question: q,
      indexChoisi: -1,
      estCorrect: false,
      tempsEcoule: true
    });

    sauvegarderMancheEnCours();

    els.texteLecon.textContent = q.lecon;
    els.zoneLecon.classList.remove('hidden');
    els.btnQuestionSuivante.classList.remove('hidden');
    els.btnQuestionSuivante.focus();
    els.btnQuestionSuivante.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------------- Fin de Manche & Calcul du Score ---------------- */

  function calculerEtoiles(score) {
    if (score === 10) return 3;
    if (score >= 8) return 2;
    if (score >= 6) return 1;
    return 0;
  }

  function terminerManche() {
    stopperChrono();
    nettoyerMancheEnCours();

    const metaNiveau = NIVEAUX_DEFI.find(n => n.id === niveauEnCours) || { titre: `Niveau ${niveauEnCours}` };
    const reussi = scoreManche >= SEUIL_DEBLOCAGE;
    const etoiles = calculerEtoiles(scoreManche);

    // Mise à jour de la progression sauvegardée
    const etatActuel = progression.niveaux[niveauEnCours] || { debloque: true, scoreMax: 0, etoiles: 0, complete: false };
    etatActuel.scoreMax = Math.max(etatActuel.scoreMax, scoreManche);
    etatActuel.etoiles = Math.max(etatActuel.etoiles, etoiles);
    if (reussi) {
      etatActuel.complete = true;
      // Débloquer le niveau suivant s'il existe
      if (niveauEnCours < 10) {
        const niveauSuivant = progression.niveaux[niveauEnCours + 1];
        if (niveauSuivant) {
          niveauSuivant.debloque = true;
        }
      }
    }
    progression.niveaux[niveauEnCours] = etatActuel;
    sauvegarderProgression();

    // Synchronisation automatique vers le classement en ligne (Firebase)
    if (window.Classement && typeof window.Classement.synchroniserScore === 'function') {
      window.Classement.synchroniserScore(progression, scoreManche, niveauEnCours);
    }

    // Rendu de l'écran de fin
    els.bilanNomNiveau.textContent = `Niveau ${niveauEnCours} : ${metaNiveau.titre}`;
    els.scoreFinalChiffre.textContent = scoreManche;

    if (reussi) {
      els.bilanIconeVictoire.textContent = scoreManche === 10 ? '👑' : '🏆';
      els.bilanStatutTag.textContent = 'NIVEAU VALIDÉ AVEC SUCCÈS';
      els.bilanTitre.textContent = scoreManche === 10 ? 'Triomphe Divin !' : 'Félicitations !';
      jouerSon('victoire');
      lancerConfettis();
    } else {
      els.bilanIconeVictoire.textContent = '📖';
      els.bilanStatutTag.textContent = 'NIVEAU NON VALIDÉ (MINIMUM 6/10 REQUIS)';
      els.bilanTitre.textContent = 'Persévérance dans la Parole';
    }

    // Mention
    let mention = '';
    if (scoreManche === 10) mention = '🏆 Sans faute parfait ! Gloire à Dieu !';
    else if (scoreManche >= 8) mention = '🌟 Excellent résultat ! Grande connaissance de Jean !';
    else if (scoreManche >= 6) mention = '👍 Bravo ! Niveau validé, le suivant est débloqué !';
    else mention = `📖 ${scoreManche}/10 obtenu. Revois le corrigé et retente ta chance !`;
    els.mentionFelicitations.textContent = mention;

    // Révélation des étoiles
    [els.etoile1, els.etoile2, els.etoile3].forEach((el, idx) => {
      if (idx < etoiles) {
        el.classList.remove('invalide');
      } else {
        el.classList.add('invalide');
      }
    });

    // Empreinte antifraude
    const codeEmpreinte = empreinte(`${progression.pseudo}|niv${niveauEnCours}|${scoreManche}/10|${Date.now()}`);
    els.valeurEmpreinte.textContent = codeEmpreinte;

    // Bouton Niveau Suivant
    if (niveauEnCours < 10 && reussi) {
      els.btnNiveauSuivant.classList.remove('hidden');
      els.btnNiveauSuivant.textContent = `Passer au Niveau ${niveauEnCours + 1} 🚀`;
    } else if (niveauEnCours === 10 && reussi) {
      els.btnNiveauSuivant.classList.remove('hidden');
      els.btnNiveauSuivant.textContent = `🏆 Défi Jean Entièrement Triomphé !`;
    } else {
      els.btnNiveauSuivant.classList.add('hidden');
    }

    // Corrigé détaillé
    rendreCorrige();

    // Génération de la carte visuelle PNG
    genererCarteVisuelleScore({
      pseudo: progression.pseudo,
      niveau: niveauEnCours,
      nomNiveau: metaNiveau.titre,
      livre: metaNiveau.livre,
      score: scoreManche,
      etoiles: etoiles,
      mention: mention,
      empreinte: codeEmpreinte
    });

    basculerEcran(els.ecranFin);
  }

  function rendreCorrige() {
    els.listeCorrige.innerHTML = '';
    reponsesJoueur.forEach((rep, idx) => {
      const li = document.createElement('li');
      li.className = 'item-corrige';

      const statut = rep.estCorrect
        ? '✅ Correct'
        : (rep.tempsEcoule ? '⏱️ Temps écoulé' : '❌ Erreur');

      li.innerHTML = `
        <div class="ligne-haut-corrige">
          <strong>Question ${idx + 1} :</strong> ${echapper(rep.question.q)}
          <span class="ref-corrige">(${echapper(rep.question.ref)})</span>
        </div>
        <div>
          ${statut} • <strong>Bonne réponse :</strong> ${echapper(rep.question.options[rep.question.answer])}
        </div>
        <span class="lecon-corrige">« ${echapper(rep.question.lecon)} »</span>
      `;

      els.listeCorrige.appendChild(li);
    });
  }

  /* ---------------- Génération de la Carte Visuelle Canvas (PNG) ---------------- */

  function dessinerCadreOr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function genererCarteVisuelleScore(donnees) {
    const canvas = els.canvasCarteScore;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // 1. Fond sombre cosmique avec dégradé
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#060a14');
    bgGrad.addColorStop(0.5, '#0b1329');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Étoiles de fond sur la carte
    ctx.fillStyle = 'rgba(245, 199, 98, 0.35)';
    for (let i = 0; i < 70; i++) {
      const rx = (i * 137.5) % W;
      const ry = (i * 269.3) % H;
      const r = (i % 3 === 0) ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Bordure double dorée avec ornements
    ctx.strokeStyle = 'rgba(245, 199, 98, 0.45)';
    ctx.lineWidth = 3;
    dessinerCadreOr(ctx, 40, 40, W - 80, H - 80, 24);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(245, 199, 98, 0.85)';
    ctx.lineWidth = 1.5;
    dessinerCadreOr(ctx, 52, 52, W - 104, H - 104, 18);
    ctx.stroke();

    // 3. En-tête de la carte
    ctx.textAlign = 'center';

    // Pilule Défi Jean
    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f5c762';
    ctx.fillText('📖 CONCOURS BIBLIQUE • DÉFI JEAN', W / 2, 120);

    ctx.font = '800 64px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('CARTE DE SCORE', W / 2, 200);

    // Sous-titre
    ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('Version Louis Segond 1910', W / 2, 246);

    // Ligne dorée
    const gradLigne = ctx.createLinearGradient(160, 280, W - 160, 280);
    gradLigne.addColorStop(0, 'transparent');
    gradLigne.addColorStop(0.5, '#f5c762');
    gradLigne.addColorStop(1, 'transparent');
    ctx.strokeStyle = gradLigne;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, 280);
    ctx.lineTo(W - 160, 280);
    ctx.stroke();

    // 4. Cartouche Joueur & Niveau
    ctx.fillStyle = 'rgba(13, 20, 36, 0.85)';
    dessinerCadreOr(ctx, 120, 320, W - 240, 150, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(245, 199, 98, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '700 22px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`NIVEAU ${donnees.niveau.toString().padStart(2, '0')} • ${donnees.livre.toUpperCase()}`, W / 2, 365);

    ctx.font = '800 40px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(donnees.nomNiveau, W / 2, 420);

    // 5. Cercle Central du Score
    const cx = W / 2;
    const cy = 680;
    const rayonCercle = 170;

    // Lueur circulaire
    const lueurCercle = ctx.createRadialGradient(cx, cy, 50, cx, cy, rayonCercle + 40);
    lueurCercle.addColorStop(0, 'rgba(245, 199, 98, 0.25)');
    lueurCercle.addColorStop(1, 'transparent');
    ctx.fillStyle = lueurCercle;
    ctx.beginPath();
    ctx.arc(cx, cy, rayonCercle + 40, 0, Math.PI * 2);
    ctx.fill();

    // Disque intérieur
    ctx.fillStyle = '#0a1020';
    ctx.beginPath();
    ctx.arc(cx, cy, rayonCercle, 0, Math.PI * 2);
    ctx.fill();

    // Anneau d'or
    ctx.strokeStyle = '#f5c762';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Score Chiffres
    ctx.font = '800 120px "JetBrains Mono", monospace';
    ctx.fillStyle = '#fef0cd';
    ctx.fillText(`${donnees.score}`, cx, cy + 25);

    ctx.font = '700 32px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('/ 10', cx, cy + 85);

    // Étoiles sous le cercle
    let strEtoiles = '';
    for (let s = 0; s < donnees.etoiles; s++) strEtoiles += '⭐ ';
    if (strEtoiles) {
      ctx.font = '50px sans-serif';
      ctx.fillText(strEtoiles.trim(), cx, 915);
    }

    // Mention
    ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#f5c762';
    ctx.fillText(donnees.mention, cx, 980);

    // 6. Pied de la Carte : Pseudo, Date & Empreinte
    ctx.fillStyle = 'rgba(13, 20, 36, 0.75)';
    dessinerCadreOr(ctx, 100, 1040, W - 200, 180, 18);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.stroke();

    ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Joueur : ${donnees.pseudo || 'Disciple anonyme'}`, W / 2, 1095);

    ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(dateLongue(new Date()), W / 2, 1140);

    ctx.font = '700 24px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`Sceau d'Authenticité : ${donnees.empreinte}`, W / 2, 1185);

    // Convertir en Blob et Image Preview
    canvas.toBlob(function (blob) {
      if (!blob) return;
      derniereCarteBlob = blob;
      const url = URL.createObjectURL(blob);
      els.apercuCarteImg.src = url;
      els.apercuCarteImg.classList.remove('hidden');
    }, 'image/png');
  }

  /* ---------------- Actions de Partage de la Carte ---------------- */

  function partagerCarteWhatsApp() {
    if (!derniereCarteBlob) return;
    const fichierImage = new File([derniereCarteBlob], `defi-jean-niveau-${niveauEnCours}.png`, { type: 'image/png' });

    const textePartage = `📖 Mon score au Défi Jean (Louis Segond 1910)\n🎯 Niveau ${niveauEnCours} : ${scoreManche}/10\n🔒 Empreinte : ${els.valeurEmpreinte.textContent}\nRejoins le défi !`;

    if (navigator.canShare && navigator.canShare({ files: [fichierImage] })) {
      navigator.share({
        title: 'Défi Jean — Score',
        text: textePartage,
        files: [fichierImage]
      }).catch(err => {
        if (err.name !== 'AbortError') telechargerCarte();
      });
    } else {
      telechargerCarte();
      afficherFeedback('Image téléchargée ! Tu peux maintenant la joindre sur WhatsApp.');
    }
  }

  function telechargerCarte() {
    if (!derniereCarteBlob) return;
    const url = URL.createObjectURL(derniereCarteBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `defi-jean-niveau-${niveauEnCours}-score-${scoreManche}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    afficherFeedback('Image téléchargée avec succès !');
  }

  function copierCartePressePapier() {
    if (!derniereCarteBlob || !navigator.clipboard || !window.ClipboardItem) {
      telechargerCarte();
      return;
    }
    try {
      const item = new ClipboardItem({ 'image/png': derniereCarteBlob });
      navigator.clipboard.write([item]).then(() => {
        afficherFeedback('Image copiée dans le presse-papier !');
      }).catch(() => {
        telechargerCarte();
      });
    } catch (e) {
      telechargerCarte();
    }
  }

  function afficherFeedback(msg) {
    els.feedbackCarte.textContent = msg;
    els.feedbackCarte.classList.remove('hidden');
    setTimeout(() => {
      els.feedbackCarte.classList.add('hidden');
    }, 3500);
  }

  /* ---------------- Écouteurs d'Événements ---------------- */

  function initialiserEvenements() {
    // Bouton Son
    els.btnSon.addEventListener('click', () => {
      progression.sonActif = !progression.sonActif;
      els.iconeSon.textContent = progression.sonActif ? '🔊' : '🔇';
      sauvegarderProgression();
      if (progression.sonActif) jouerSon('bonne_reponse');
    });

    // Saisie Pseudo
    if (progression.pseudo) {
      els.pseudo.value = progression.pseudo;
    }
    els.pseudo.addEventListener('input', () => {
      progression.pseudo = (els.pseudo.value || '').trim();
      sauvegarderProgression();
      els.erreurPseudo.classList.add('hidden');
    });

    // Reprise & Abandon de Manche en cours
    if (els.btnReprendrePartie) {
      els.btnReprendrePartie.addEventListener('click', reprendreMancheEnCours);
    }
    if (els.btnAbandonnerPartie) {
      els.btnAbandonnerPartie.addEventListener('click', abandonnerMancheEnCours);
    }

    // Réinitialiser Progression Globale
    els.btnReinitialiser.addEventListener('click', () => {
      if (confirm('Es-tu certain de vouloir réinitialiser ta progression des 10 niveaux ?')) {
        nettoyerMancheEnCours();
        progression = {
          pseudo: progression.pseudo,
          sonActif: progression.sonActif,
          niveaux: { 1: { debloque: true, scoreMax: 0, etoiles: 0, complete: false } }
        };
        for (let lvl = 2; lvl <= 10; lvl++) {
          progression.niveaux[lvl] = { debloque: false, scoreMax: 0, etoiles: 0, complete: false };
        }
        sauvegarderProgression();
        rendreGrilleNiveaux();
      }
    });

    // Quitter le quiz (progression préservée pour reprise ultérieure)
    els.btnQuitterQuiz.addEventListener('click', () => {
      if (confirm('Voulez-vous quitter ce niveau ? Votre progression actuelle sur cette manche est enregistrée et vous pourrez la reprendre quand vous le souhaitez.')) {
        stopperChrono();
        sauvegarderMancheEnCours();
        rendreGrilleNiveaux();
        basculerEcran(els.ecranAccueil);
      }
    });

    // Sauvegarde de sécurité lors de la fermeture ou du rechargement de l'onglet
    window.addEventListener('beforeunload', () => {
      if (
        indexQuestion < questionsManche.length &&
        els.ecranQuiz &&
        !els.ecranQuiz.classList.contains('hidden')
      ) {
        sauvegarderMancheEnCours();
      }
    });

    // Question Suivante
    els.btnQuestionSuivante.addEventListener('click', () => {
      indexQuestion++;
      afficherQuestion();
    });

    // Boutons Écran Fin
    els.btnNiveauSuivant.addEventListener('click', () => {
      if (niveauEnCours < 10) {
        demarrerMancheNiveau(niveauEnCours + 1);
      } else {
        rendreGrilleNiveaux();
        basculerEcran(els.ecranAccueil);
      }
    });

    els.btnRejouerNiveau.addEventListener('click', () => {
      demarrerMancheNiveau(niveauEnCours);
    });

    els.btnRetourHub.addEventListener('click', () => {
      rendreGrilleNiveaux();
      basculerEcran(els.ecranAccueil);
    });

    // Partage Image
    els.btnPartagerCarte.addEventListener('click', partagerCarteWhatsApp);
    els.btnTelechargerCarte.addEventListener('click', telechargerCarte);
    els.btnCopierCarte.addEventListener('click', copierCartePressePapier);
  }

  /* ---------------- Initialisation Globale ---------------- */

  function init() {
    initFondCeleste();
    els.iconeSon.textContent = progression.sonActif ? '🔊' : '🔇';
    rendreGrilleNiveaux();
    initialiserEvenements();

    // Synchronisation initiale du joueur avec le classement en ligne
    if (window.Classement && typeof window.Classement.synchroniserScore === 'function') {
      window.Classement.synchroniserScore(progression);
    }
  }

  // Démarrage dès le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
