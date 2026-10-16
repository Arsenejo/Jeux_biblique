/* Défi Jean – logique du jeu
   ---------------------------------------------------------------
   Trois principes qui corrigent les défauts de la version d'origine :

   1. TIRAGE QUOTIDIEN DÉTERMINISTE — la graine du pseudo-aléatoire est la
      date du jour. Tout le monde reçoit donc les mêmes 10 questions le
      même jour : les scores sont comparables, et le tirage change chaque
      jour sans intervention. (?entrainement=1 pour un tirage libre.)

   2. CHRONOMÈTRE À ÉCHÉANCE ABSOLUE — on mémorise l'heure limite
      (Date.now() + 15 s) et on recalcule le temps restant à chaque tick.
      Impossible de « mettre le chrono en pause » en quittant la page :
      les navigateurs mobiles suspendent les minuteries en arrière-plan,
      mais l'horloge, elle, continue.

   3. REPRISE ET CORRIGÉ PERSISTANTS — la progression officielle est
      sauvegardée au fil de la partie, puis le résultat et le corrigé restent
      consultables dans le navigateur après rechargement.
--------------------------------------------------------------- */

(function () {
  'use strict';

  /* ---------------- Configuration ---------------- */

  const APP_VERSION = '1.2.0';
  const NB_QUESTIONS = 10;          // questions par partie
  const TEMPS_PAR_QUESTION = 15;    // secondes par question officielle
  const INTERVALLE_CHRONO = 100;    // rafraîchissement du chrono (ms)
  const SEL_EMPREINTE = 'defi-jean-lsg1910';
  const BASE_STOCKAGE = 'defiJean.v1';

  const $ = function (id) { return document.getElementById(id); };

  const els = {
    accueil: $('ecran-accueil'),
    quiz: $('ecran-quiz'),
    fin: $('ecran-fin'),
    nbBanque: $('nb-banque'),
    tempoAccroche: $('tempo-accroche'),
    tirageAccroche: $('tirage-accroche'),
    aidePseudo: $('aide-pseudo'),
    dateDefi: $('date-defi'),
    rappel: $('rappel-partie'),
    zonePseudo: $('zone-pseudo'),
    avertissementStockage: $('avertissement-stockage'),
    avertissementStockageQuiz: $('avertissement-stockage-jeu'),
    lienEntrainement: $('lien-entrainement'),
    pseudo: $('pseudo'),
    erreurPseudo: $('erreur-pseudo'),
    btnJouer: $('btn-jouer'),
    compteur: $('compteur'),
    badgeTheme: $('badge-theme'),
    progressBar: $('progressBar'),
    chronoCercle: $('chronoCercle'),
    chronoRemplissage: $('chronoRemplissage'),
    zoneChrono: $('zone-chrono'),
    indicateurLibre: $('indicateur-libre'),
    annonceLecteur: $('annonce-lecteur'),
    reference: $('reference'),
    verset: $('verset'),
    question: $('question'),
    options: $('options'),
    bandeauTemps: $('bandeau-temps'),
    score: $('score'),
    sorties: $('sorties'),
    titreFin: $('titre-fin'),
    finalScore: $('finalScore'),
    finalTotal: $('finalTotal'),
    mention: $('mention'),
    empreinte: $('empreinte'),
    btnPartager: $('btn-partager'),
    btnCopier: $('btn-copier'),
    corrige: $('corrige'),
    btnRejouer: $('btn-rejouer'),
    messageRejouer: $('message-rejouer'),
    versionApp: $('version-app'),
    zoneCarteVisuelle: $('zone-carte-visuelle'),
    canvasCarteScore: $('canvas-carte-score'),
    apercuCarteImg: $('apercu-carte-img'),
    btnPartagerImage: $('btn-partager-image'),
    btnTelechargerImage: $('btn-telecharger-image'),
    btnCopierImage: $('btn-copier-image'),
    feedbackCarte: $('feedback-carte')
  };

  /* ---------------- État de la partie ---------------- */

  let questions = [];
  let index = 0;
  let score = 0;
  let reponses = [];
  let dejaRepondu = false;
  let echeance = 0;
  let minuteur = null;
  let sortiesEcran = 0;
  let partieEnCours = false;
  let mode = 'quotidien';          // 'quotidien' | 'entrainement'
  let pseudo = '';
  let datePartie = '';
  let messageStockage = '';

  /* ---------------- Outils ---------------- */

  // Générateur pseudo-aléatoire à graine (mulberry32) : même graine = même suite.
  function mulberry32(graine) {
    let a = graine >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Mélange de Fisher-Yates (contrairement à sort(() => Math.random() - 0.5),
  // qui est biaisé) ; accepte n'importe quelle fonction aléatoire.
  function melanger(tableau, aleatoire) {
    const copie = tableau.slice();
    for (let i = copie.length - 1; i > 0; i--) {
      const j = Math.floor(aleatoire() * (i + 1));
      const tampon = copie[i];
      copie[i] = copie[j];
      copie[j] = tampon;
    }
    return copie;
  }

  function deuxChiffres(n) { return n < 10 ? '0' + n : String(n); }

  // Clé locale du jour, ex. « 2026-10-16 » (heure de l'appareil).
  function cleJour(d) {
    return d.getFullYear() + '-' + deuxChiffres(d.getMonth() + 1) + '-' + deuxChiffres(d.getDate());
  }

  function dateDepuisCle(cle) {
    const morceaux = String(cle || '').split('-').map(Number);
    if (morceaux.length !== 3 || morceaux.some(function (n) { return !Number.isFinite(n); })) return new Date();
    return new Date(morceaux[0], morceaux[1] - 1, morceaux[2], 12);
  }

  function graineJour(d) {
    return Number('' + d.getFullYear() + deuxChiffres(d.getMonth() + 1) + deuxChiffres(d.getDate()));
  }

  // Date en toutes lettres, telle que le navigateur la donne en français :
  // « vendredi 16 octobre 2026 ». On ne touche pas à la casse : le jour et le
  // mois restent en minuscules au milieu d'une phrase (« Défi du vendredi… »).
  function dateLongue(d) {
    try {
      return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return cleJour(d);
    }
  }

  function echapper(texte) {
    return String(texte).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Empreinte FNV-1a : sert de identifiant de partie, pas de preuve
  // cryptographique (le code est public, donc reproductible).
  function empreinte(texte) {
    let h = 0x811c9dc5;
    for (let i = 0; i < texte.length; i++) {
      h ^= texte.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h.toString(36).toUpperCase().padStart(6, '0');
  }

  /* ---------------- Stockage local ---------------- */

  const stockage = (function () {
    try {
      const cle = '__defiJean_test__';
      window.localStorage.setItem(cle, '1');
      window.localStorage.removeItem(cle);
      return window.localStorage;
    } catch (e) {
      return null;   // navigation privée : le jeu reste jouable, sans verrou
    }
  })();

  function lireStockage(cle) {
    if (!stockage) return null;
    try {
      const brut = stockage.getItem(cle);
      return brut ? JSON.parse(brut) : null;
    } catch (e) { return null; }
  }

  function ecrireStockage(cle, valeur) {
    if (!stockage) return false;
    try {
      stockage.setItem(cle, JSON.stringify(valeur));
      messageStockage = '';
      els.avertissementStockage.classList.add('hidden');
      els.avertissementStockageQuiz.classList.add('hidden');
      return true;
    }
    catch (e) {
      signalerStockage('Le navigateur ne peut pas enregistrer la partie. Évite de fermer cette page avant la fin.');
      return false;
    }
  }

  function signalerStockage(message) {
    messageStockage = message;
    [els.avertissementStockage, els.avertissementStockageQuiz].forEach(function (element) {
      if (!element) return;
      element.textContent = message;
      element.classList.remove('hidden');
    });
  }

  function clePartie(date) {
    return BASE_STOCKAGE + '.partie.' + (date || cleJour(new Date()));
  }

  function enregistrerProgression(indexSauve, echeanceSauvee) {
    if (mode !== 'quotidien' || !datePartie) return false;
    return ecrireStockage(clePartie(datePartie), {
      etat: 'en_cours',
      pseudo: pseudo,
      date: datePartie,
      questions: questions,
      index: typeof indexSauve === 'number' ? indexSauve : index + (dejaRepondu ? 1 : 0),
      echeance: typeof echeanceSauvee === 'number' ? echeanceSauvee : echeance,
      score: score,
      reponses: reponses,
      sorties: sortiesEcran
    });
  }

  /* ---------------- Tirage des questions ---------------- */

  // Tirage équilibré : chaque thème fournit un nombre de questions
  // proportionnel à son poids dans la banque (méthode des plus grands restes).
  // Résultat : jamais 10 questions d'Apocalypse d'affilée, jamais zéro épître.
  function tirerQuestions(banque, nombre, aleatoire) {
    const parTheme = {};
    banque.forEach(function (q) {
      if (!parTheme[q.theme]) parTheme[q.theme] = [];
      parTheme[q.theme].push(q);
    });

    const parts = Object.keys(parTheme).map(function (theme) {
      const exact = (parTheme[theme].length / banque.length) * nombre;
      return { theme: theme, base: Math.floor(exact), reste: exact - Math.floor(exact) };
    });

    let attribues = parts.reduce(function (somme, p) { return somme + p.base; }, 0);
    parts.sort(function (a, b) { return b.reste - a.reste; });

    let garde = 0;
    while (attribues < nombre && garde < 1000) {
      const p = parts[garde % parts.length];
      if (p.base < parTheme[p.theme].length) { p.base++; attribues++; }
      garde++;
    }

    let selection = [];
    parts.forEach(function (p) {
      selection = selection.concat(melanger(parTheme[p.theme], aleatoire).slice(0, p.base));
    });

    // Filet de sécurité si un thème était trop petit pour son quota.
    if (selection.length < nombre) {
      melanger(banque, aleatoire).forEach(function (q) {
        if (selection.length < nombre && selection.indexOf(q) === -1) selection.push(q);
      });
    }

    return melanger(selection, aleatoire).slice(0, nombre);
  }

  // Mélange aussi les réponses, en retrouvant la bonne par sa VALEUR
  // (et non par son index, qui devient faux après le mélange).
  function preparerQuestions(brutes, aleatoire) {
    return brutes.map(function (q) {
      const bonneReponse = q.options[q.answer];
      const options = melanger(q.options, aleatoire);
      return {
        theme: q.theme,
        ref: q.ref,
        verset: q.verset || '',
        q: q.q,
        lecon: q.lecon || '',
        options: options,
        answer: options.indexOf(bonneReponse)
      };
    });
  }

  /* ---------------- Chronomètre ---------------- */

  function lancerChrono(echeanceReprise) {
    arreterChrono();
    if (mode === 'entrainement') {
      echeance = 0;
      els.zoneChrono.classList.add('hidden');
      els.indicateurLibre.classList.remove('hidden');
      return;
    }

    els.zoneChrono.classList.remove('hidden');
    els.indicateurLibre.classList.add('hidden');
    echeance = echeanceReprise || Date.now() + TEMPS_PAR_QUESTION * 1000;
    afficherChrono(echeance - Date.now());
    if (echeance <= Date.now()) {
      boucleChrono();
      return;
    }
    minuteur = setInterval(boucleChrono, INTERVALLE_CHRONO);
  }

  function arreterChrono() {
    if (minuteur !== null) { clearInterval(minuteur); minuteur = null; }
  }

  function boucleChrono() {
    if (!partieEnCours) return;
    const restantMs = echeance - Date.now();
    afficherChrono(restantMs);
    if (restantMs <= 0 && !dejaRepondu) {
      arreterChrono();
      tempsEcoule();
    }
  }

  function afficherChrono(restantMs) {
    const duree = TEMPS_PAR_QUESTION * 1000;
    const pourcent = Math.max(0, Math.min(100, (restantMs / duree) * 100));
    els.chronoRemplissage.style.width = pourcent + '%';

    const secondes = Math.max(0, Math.ceil(restantMs / 1000));
    const texte = String(secondes);
    if (els.chronoCercle.textContent !== texte) els.chronoCercle.textContent = texte;
    els.zoneChrono.setAttribute('aria-label', 'Temps restant : ' + secondes + ' secondes');

    let couleur = '';
    if (secondes <= 3) couleur = 'rouge';
    else if (secondes <= 6) couleur = 'orange';

    els.chronoCercle.className = 'chrono-cercle' + (couleur ? ' ' + couleur : '');
    els.chronoRemplissage.className = 'chrono-remplissage' + (couleur ? ' ' + couleur : '');
  }

  /* ---------------- Déroulement ---------------- */

  function boutonsOptions() {
    return Array.prototype.slice.call(els.options.querySelectorAll('.option'));
  }

  function majSorties() {
    if (sortiesEcran > 0) {
      els.sorties.textContent = 'ℹ️ Écran masqué ' + sortiesEcran + ' fois';
      els.sorties.title = 'Les appels, notifications et changements d’application peuvent aussi être comptés.';
    } else {
      els.sorties.textContent = '';
      els.sorties.removeAttribute('title');
    }
  }

  function afficherEcran(ecran) {
    [els.accueil, els.quiz, els.fin].forEach(function (e) {
      e.classList.toggle('hidden', e !== ecran);
    });
  }

  function demarrerPartie() {
    const maintenant = new Date();
    datePartie = cleJour(maintenant);
    if (mode === 'quotidien' && !stockage) {
      signalerStockage('Ce navigateur ne peut pas sauvegarder la tentative. Si tu fermes cette page, tu perdras ta progression.');
    }
    const aleatoire = mode === 'entrainement'
      ? Math.random
      : mulberry32(graineJour(maintenant));

    questions = preparerQuestions(tirerQuestions(BANQUE_QUESTIONS, NB_QUESTIONS, aleatoire), aleatoire);
    index = 0;
    score = 0;
    reponses = [];
    sortiesEcran = 0;
    dejaRepondu = false;
    partieEnCours = true;

    els.score.textContent = '0';
    els.finalTotal.textContent = questions.length;
    els.titreFin.textContent = mode === 'entrainement' ? '🎉 Entraînement terminé !' : '🎉 Terminé !';
    els.sorties.textContent = '';
    els.progressBar.style.width = '0%';

    afficherEcran(els.quiz);
    afficherQuestion();
  }

  function reprendrePartie(partie) {
    if (!partie || !Array.isArray(partie.questions) || !partie.questions.length) {
      signalerStockage('La partie sauvegardée est illisible. Tu peux démarrer une nouvelle partie.');
      return;
    }

    mode = 'quotidien';
    pseudo = partie.pseudo || '';
    datePartie = partie.date || cleJour(new Date());
    questions = partie.questions;
    index = Math.max(0, Math.min(Number(partie.index) || 0, questions.length));
    score = Number(partie.score) || 0;
    reponses = Array.isArray(partie.reponses) ? partie.reponses : [];
    sortiesEcran = Number(partie.sorties) || 0;
    dejaRepondu = false;
    partieEnCours = true;

    els.score.textContent = score;
    els.finalTotal.textContent = questions.length;
    els.progressBar.style.width = (index / questions.length) * 100 + '%';
    majSorties();
    els.titreFin.textContent = '🎉 Terminé !';

    if (index >= questions.length) {
      terminerPartie();
      return;
    }

    afficherEcran(els.quiz);
    afficherQuestion(Number(partie.echeance) || 0);
  }

  function afficherQuestion(echeanceReprise) {
    dejaRepondu = false;
    const q = questions[index];

    els.compteur.textContent = 'Question ' + (index + 1) + '/' + questions.length;
    els.badgeTheme.textContent = q.theme;
    els.progressBar.style.width = (index / questions.length) * 100 + '%';
    els.reference.textContent = q.ref;

    if (q.verset) {
      // Le texte affiché est toujours tronqué ou troué : jamais la réponse.
      const encadre = /^\(/.test(q.verset) ? q.verset : '« ' + q.verset + ' »';
      els.verset.textContent = encadre;
      els.verset.classList.remove('hidden');
    } else {
      els.verset.textContent = '';
      els.verset.classList.add('hidden');
    }

    els.question.textContent = q.q;
    els.annonceLecteur.textContent = 'Question ' + (index + 1) + ' sur ' + questions.length + '.';
    els.options.innerHTML = '';

    q.options.forEach(function (texte, i) {
      const bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'option';
      bouton.textContent = String.fromCharCode(65 + i) + '. ' + texte;
      bouton.addEventListener('click', function () { repondre(i, bouton); });
      els.options.appendChild(bouton);
    });

    els.bandeauTemps.classList.add('hidden');
    els.question.focus();
    lancerChrono(echeanceReprise);
    if (!dejaRepondu) enregistrerProgression(index, echeance);
  }

  function repondre(choix, bouton) {
    if (dejaRepondu || !partieEnCours) return;
    dejaRepondu = true;
    arreterChrono();

    const q = questions[index];
    const juste = choix === q.answer;
    const boutons = boutonsOptions();
    boutons.forEach(function (b) { b.disabled = true; });

    if (juste) {
      score++;
      els.score.textContent = score;
      bouton.classList.add('correcte');
    } else {
      bouton.classList.add('fausse');
      boutons[q.answer].classList.add('correcte');
    }

    reponses.push({
      ref: q.ref, q: q.q, options: q.options, lecon: q.lecon,
      choix: choix, bonne: q.answer, juste: juste
    });

    els.progressBar.style.width = ((index + 1) / questions.length) * 100 + '%';
    const delai = juste ? 900 : 1400;
    els.annonceLecteur.textContent = juste
      ? 'Bonne réponse.'
      : 'Réponse incorrecte. La bonne réponse est ' + q.options[q.answer] + '.';
    echeance = Date.now() + delai + TEMPS_PAR_QUESTION * 1000;
    enregistrerProgression();
    setTimeout(questionSuivante, delai);
  }

  function tempsEcoule() {
    dejaRepondu = true;
    const q = questions[index];
    const boutons = boutonsOptions();
    boutons.forEach(function (b) { b.disabled = true; });

    // La bonne réponse apparaît en vert, cerclée d'orange : deux rôles
    // distincts, donc deux classes qui ne se contredisent pas.
    boutons[q.answer].classList.add('correcte', 'revelee');
    els.bandeauTemps.classList.remove('hidden');

    reponses.push({
      ref: q.ref, q: q.q, options: q.options, lecon: q.lecon,
      choix: null, bonne: q.answer, juste: false
    });

    els.progressBar.style.width = ((index + 1) / questions.length) * 100 + '%';
    els.annonceLecteur.textContent = 'Temps écoulé. La bonne réponse est ' + q.options[q.answer] + '.';
    echeance = Date.now() + 1400 + TEMPS_PAR_QUESTION * 1000;
    enregistrerProgression();
    setTimeout(questionSuivante, 1400);
  }

  function questionSuivante() {
    index++;
    if (index >= questions.length) { terminerPartie(); return; }
    afficherQuestion();
  }

  function terminerPartie() {
    partieEnCours = false;
    arreterChrono();
    afficherEcran(els.fin);
    els.titreFin.focus();

    const total = questions.length;
    const pourcent = total ? score / total : 0;

    els.finalScore.textContent = score;
    els.finalTotal.textContent = total;

    let mention;
    if (pourcent === 1) mention = '🏆 Sans faute sur ce défi !';
    else if (pourcent >= 0.8) mention = '🌟 Excellent !';
    else if (pourcent >= 0.5) mention = '👍 Bien joué, continue !';
    else mention = '📖 Relis les références du corrigé et retente demain !';
    els.mention.textContent = mention;

    const dateCle = datePartie || cleJour(new Date());
    const code = empreinte(SEL_EMPREINTE + '|' + pseudo + '|' + dateCle + '|' + score + '/' + total);
    els.empreinte.textContent = (mode === 'entrainement' ? 'ENTRAINEMENT-' : '') + code;

    afficherCorrige();
    genererCarteVisuelle({
      pseudo: pseudo,
      score: score,
      total: total,
      mention: mention,
      empreinte: els.empreinte.textContent,
      sorties: sortiesEcran,
      date: dateCle,
      mode: mode
    });

    let resultatEnregistre = true;
    if (mode === 'quotidien') {
      resultatEnregistre = ecrireStockage(clePartie(dateCle), {
        etat: 'terminee',
        pseudo: pseudo,
        score: score,
        total: total,
        empreinte: code,
        sorties: sortiesEcran,
        date: dateCle,
        questions: questions,
        reponses: reponses
      });
    }

    const messages = [];
    if (sortiesEcran > 0) {
      messages.push('L’écran a été masqué ' + sortiesEcran + ' fois (notifications, appels ou changement d’application inclus).');
    }
    if (mode === 'quotidien') {
      messages.push(resultatEnregistre
        ? 'Partie du jour enregistrée : reviens demain pour un nouveau tirage.'
        : 'Le résultat reste affiché, mais le navigateur n’a pas pu l’enregistrer.');
      els.btnRejouer.classList.add('hidden');
    } else {
      messages.push('Partie d\'entraînement : elle ne compte pas dans la compétition.');
      els.btnRejouer.classList.remove('hidden');
    }
    els.messageRejouer.textContent = messages.join(' ');

    majRappelPartie();
  }

  function afficherCorrige() {
    els.corrige.innerHTML = '';

    reponses.forEach(function (r, i) {
      const item = document.createElement('li');
      let html = '<strong>' + (i + 1) + '. ' + echapper(r.ref) + '</strong> — ' + echapper(r.q) + '<br>';

      if (r.choix === null) {
        html += '<span class="mauvaise">⏱️ Temps écoulé — pas de réponse</span><br>';
      } else if (r.juste) {
        html += '<span class="bonne">✅ ' + echapper(r.options[r.choix]) + '</span><br>';
      } else {
        html += '<span class="mauvaise">❌ ' + echapper(r.options[r.choix]) + '</span><br>';
        html += '<span class="bonne">✔️ ' + echapper(r.options[r.bonne]) + '</span><br>';
      }

      if (r.lecon) html += '<em>' + echapper(r.lecon) + '</em>';
      item.innerHTML = html;
      els.corrige.appendChild(item);
    });
  }

  /* ---------------- Partage ---------------- */

  function urlDuJeu() {
    return location.href.split('#')[0].split('?')[0];
  }

  function textePartage(donnees) {
    const d = donnees || {
      pseudo: pseudo,
      score: score,
      total: questions.length,
      empreinte: els.empreinte.textContent,
      sorties: sortiesEcran,
      date: datePartie
    };
    const lignes = [
      '📖 Défi Jean – Louis Segond 1910',
      'Défi du ' + dateLongue(dateDepuisCle(d.date || datePartie || cleJour(new Date())))
    ];
    if (mode === 'entrainement') lignes.push('(partie d\'entraînement)');
    lignes.push(d.pseudo + ' : ' + d.score + '/' + d.total + ' · empreinte ' + d.empreinte);
    if (d.sorties > 0) lignes.push('ℹ️ Écran masqué ' + d.sorties + ' fois (notifications ou changement d’application inclus)');
    lignes.push('À toi de jouer 👉 ' + urlDuJeu());
    return lignes.join('\n');
  }

  function partager(donnees) {
    const texte = textePartage(donnees);
    const fenetre = window.open('https://wa.me/?text=' + encodeURIComponent(texte), '_blank');
    if (fenetre) fenetre.opener = null;
  }

  function copier(bouton) {
    const texte = textePartage();
    const repli = function () {
      const zone = document.createElement('textarea');
      zone.value = texte;
      zone.setAttribute('readonly', 'readonly');
      zone.style.position = 'fixed';
      zone.style.opacity = '0';
      document.body.appendChild(zone);
      zone.select();
      let ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(zone);
      retourBouton(bouton, ok ? '✅ Copié !' : '⚠️ Copie impossible');
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texte).then(function () {
        retourBouton(bouton, '✅ Copié !');
      }, repli);
    } else {
      repli();
    }
  }

  function retourBouton(bouton, texte) {
    if (!bouton.dataset.origine) bouton.dataset.origine = bouton.textContent;
    bouton.textContent = texte;
    setTimeout(function () { bouton.textContent = bouton.dataset.origine; }, 1800);
  }

  /* ---------------- Carte visuelle du score (Canvas) ---------------- */

  let carteScoreBlob = null;
  let carteScoreDataUrl = '';
  let carteScoreNomFichier = '';

  function tracerRectangleArrondi(ctx, x, y, w, h, r) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      return;
    }
    const rayon = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rayon, y);
    ctx.lineTo(x + w - rayon, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rayon);
    ctx.lineTo(x + w, y + h - rayon);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rayon, y + h);
    ctx.lineTo(x + rayon, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rayon);
    ctx.lineTo(x, y + rayon);
    ctx.quadraticCurveTo(x, y, x + rayon, y);
    ctx.closePath();
  }

  function dessinerOrnementCoin(ctx, x, y, taille) {
    ctx.save();
    ctx.fillStyle = '#e8c86a';
    ctx.beginPath();
    ctx.moveTo(x, y - taille);
    ctx.lineTo(x + taille * 0.35, y - taille * 0.35);
    ctx.lineTo(x + taille, y);
    ctx.lineTo(x + taille * 0.35, y + taille * 0.35);
    ctx.lineTo(x, y + taille);
    ctx.lineTo(x - taille * 0.35, y + taille * 0.35);
    ctx.lineTo(x - taille, y);
    ctx.lineTo(x - taille * 0.35, y - taille * 0.35);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function dessinerPilule(ctx, cx, cy, texte, w, h, bg, couleurTexte, taillePolice, bordureOr) {
    ctx.save();
    const x = cx - w / 2;
    const y = cy - h / 2;
    tracerRectangleArrondi(ctx, x, y, w, h, h / 2);
    ctx.fillStyle = bg;
    ctx.fill();
    if (bordureOr) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#c9a961';
      ctx.stroke();
    }
    ctx.font = '600 ' + taillePolice + 'px Georgia, serif';
    ctx.fillStyle = couleurTexte;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(texte, cx, cy + 1, Math.max(1, w - 32));
    ctx.restore();
  }

  function dessinerBoiteStat(ctx, x, y, w, h, label, valeur) {
    ctx.save();
    tracerRectangleArrondi(ctx, x, y, w, h, 14);
    ctx.fillStyle = 'rgba(26, 17, 11, 0.85)';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(201, 169, 97, 0.45)';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '600 19px Georgia, serif';
    ctx.fillStyle = '#c9a961';
    ctx.fillText(label, x + w / 2, y + 36, w - 20);

    ctx.font = 'bold 26px Georgia, serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText(valeur, x + w / 2, y + 76, w - 20);
    ctx.restore();
  }

  function dessinerCartoucheEmpreinte(ctx, cx, cy, code) {
    ctx.save();
    const w = 780;
    const h = 110;
    const x = cx - w / 2;
    const y = cy - h / 2;

    tracerRectangleArrondi(ctx, x, y, w, h, 16);
    ctx.fillStyle = 'rgba(16, 25, 38, 0.9)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#c9a961';
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 18px Georgia, serif';
    ctx.fillStyle = '#c9a961';
    ctx.fillText('EMPREINTE DU SCORE', cx, cy - 10);

    ctx.font = 'bold 34px ui-monospace, "Courier New", monospace';
    ctx.fillStyle = '#e8c86a';
    ctx.shadowColor = 'rgba(232, 200, 106, 0.45)';
    ctx.shadowBlur = 10;
    ctx.fillText(code, cx, cy + 28);
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  function dessinerCarteScore(donnees) {
    if (!els.canvasCarteScore) return;
    const canvas = els.canvasCarteScore;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1350;
    canvas.width = W;
    canvas.height = H;

    // 1. Fond luxueux en dégradé
    const fond = ctx.createLinearGradient(0, 0, W, H);
    fond.addColorStop(0, '#0c1a2c');
    fond.addColorStop(0.3, '#192f4c');
    fond.addColorStop(0.65, '#22150f');
    fond.addColorStop(1, '#110b08');
    ctx.fillStyle = fond;
    ctx.fillRect(0, 0, W, H);

    // Halo radial chaud au centre
    const halo = ctx.createRadialGradient(W / 2, 590, 50, W / 2, 590, 560);
    halo.addColorStop(0, 'rgba(201, 169, 97, 0.16)');
    halo.addColorStop(0.5, 'rgba(201, 169, 97, 0.04)');
    halo.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);

    // 2. Cadre orné double
    const m1 = 36;
    tracerRectangleArrondi(ctx, m1, m1, W - m1 * 2, H - m1 * 2, 28);
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#c9a961';
    ctx.stroke();

    const m2 = 48;
    tracerRectangleArrondi(ctx, m2, m2, W - m2 * 2, H - m2 * 2, 20);
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(232, 200, 106, 0.45)';
    ctx.stroke();

    // 4 coins avec ornement
    dessinerOrnementCoin(ctx, m2, m2, 14);
    dessinerOrnementCoin(ctx, W - m2, m2, 14);
    dessinerOrnementCoin(ctx, m2, H - m2, 14);
    dessinerOrnementCoin(ctx, W - m2, H - m2, 14);

    // 3. En-tête
    ctx.textAlign = 'center';

    ctx.font = '600 22px Georgia, serif';
    ctx.fillStyle = '#c9a961';
    ctx.fillText(donnees.mode === 'entrainement'
      ? '📖  ENTRAÎNEMENT BIBLIQUE  📖'
      : '📖  DÉFI BIBLIQUE QUOTIDIEN  📖', W / 2, 115);

    ctx.font = 'bold 64px Georgia, serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.shadowColor = 'rgba(232, 200, 106, 0.4)';
    ctx.shadowBlur = 18;
    ctx.fillText('DÉFI JEAN', W / 2, 190);
    ctx.shadowBlur = 0;

    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillStyle = '#c9a961';
    ctx.fillText('Version Louis Segond 1910', W / 2, 235);

    // Date
    const dateFormatee = dateLongue(dateDepuisCle(donnees.date || cleJour(new Date())));
    dessinerPilule(ctx, W / 2, 288, '📅 ' + dateFormatee.toUpperCase(), 480, 44, 'rgba(201, 169, 97, 0.15)', '#e8c86a', 18, true);

    // 4. Joueur / Pseudo
    const pseudoAffiche = (donnees.pseudo || 'Participant').trim();
    dessinerPilule(ctx, W / 2, 375, '👤  ' + pseudoAffiche, 540, 64, 'rgba(26, 17, 11, 0.9)', '#f5e6c8', 30, true);

    // 5. Grand Cercle de Score Central
    const centreX = W / 2;
    const centreY = 585;
    const rayon = 150;

    const anneau = ctx.createLinearGradient(centreX - rayon, centreY - rayon, centreX + rayon, centreY + rayon);
    anneau.addColorStop(0, '#fde68a');
    anneau.addColorStop(0.5, '#c9a961');
    anneau.addColorStop(1, '#8c6d32');

    ctx.save();
    ctx.beginPath();
    ctx.arc(centreX, centreY, rayon + 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(201, 169, 97, 0.08)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(centreX, centreY, rayon, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(16, 25, 38, 0.96)';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = anneau;
    ctx.shadowColor = 'rgba(232, 200, 106, 0.5)';
    ctx.shadowBlur = 24;
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(centreX, centreY, rayon - 14, 0, Math.PI * 2);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(201, 169, 97, 0.45)';
    ctx.stroke();

    // Chiffres du score
    ctx.font = 'bold 112px Georgia, serif';
    ctx.fillStyle = '#e8c86a';
    ctx.textAlign = 'right';
    ctx.fillText(String(donnees.score), centreX + 15, centreY + 28);

    ctx.font = 'bold 50px Georgia, serif';
    ctx.fillStyle = 'rgba(245, 230, 200, 0.85)';
    ctx.textAlign = 'left';
    ctx.fillText('/ ' + donnees.total, centreX + 25, centreY + 28);

    // % réussite
    ctx.textAlign = 'center';
    const pourcent = donnees.total > 0 ? Math.round((donnees.score / donnees.total) * 100) : 0;
    ctx.font = '600 23px Georgia, serif';
    ctx.fillStyle = '#c9a961';
    ctx.fillText(pourcent + '% DE RÉUSSITE', centreX, centreY + 95);

    // Mention honorifique sous le cercle
    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = donnees.score >= 8 ? '#86efac' : (donnees.score >= 5 ? '#fde68a' : '#f5e6c8');
    ctx.fillText(donnees.mention || 'Résultat du défi', centreX, 798, W - 120);

    // 6. Blocs de Statistiques
    const yStats = 865;
    const largeurStat = 280;
    const ecartStat = 25;
    const debutX = (W - (3 * largeurStat + 2 * ecartStat)) / 2;

    dessinerBoiteStat(ctx, debutX, yStats, largeurStat, 100, '⏱️ CHRONO', donnees.mode === 'entrainement' ? 'Sans chrono' : '15 s / question');
    const sortiesTexte = (donnees.sorties || 0) === 0 ? '0 sortie' : donnees.sorties + ' sortie' + (donnees.sorties > 1 ? 's' : '');
    dessinerBoiteStat(ctx, debutX + largeurStat + ecartStat, yStats, largeurStat, 100, '👁️ SORTIES', sortiesTexte);
    dessinerBoiteStat(ctx, debutX + 2 * (largeurStat + ecartStat), yStats, largeurStat, 100, '🎯 ÉPREUVE', donnees.mode === 'entrainement' ? 'Entraînement' : 'Officielle');

    // 7. Cartouche Empreinte
    dessinerCartoucheEmpreinte(ctx, W / 2, 1055, donnees.empreinte);

    // 8. Pied de carte & appel
    ctx.font = 'italic 25px Georgia, serif';
    ctx.fillStyle = '#f5e6c8';
    ctx.fillText(donnees.mode === 'entrainement'
      ? 'Entraîne-toi avec les questions du Défi Jean.'
      : 'Rejoins la compétition quotidienne dans le groupe WhatsApp !', W / 2, 1205, W - 120);

    ctx.font = '20px Georgia, serif';
    ctx.fillStyle = 'rgba(201, 169, 97, 0.75)';
    ctx.fillText(donnees.mode === 'entrainement'
      ? 'Défi Jean · Louis Segond 1910 · Entraînement'
      : 'Défi Jean · Louis Segond 1910 · Édition quotidienne', W / 2, 1248, W - 120);
  }

  function genererCarteVisuelle(donnees) {
    try {
      dessinerCarteScore(donnees);
      if (!els.canvasCarteScore) return;

      const slugPseudo = (donnees.pseudo || 'joueur').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      carteScoreNomFichier = 'defi-jean-score-' + (slugPseudo || 'score') + '-' + (donnees.date || cleJour(new Date())) + '.png';

      carteScoreDataUrl = els.canvasCarteScore.toDataURL('image/png');
      if (els.apercuCarteImg) {
        els.apercuCarteImg.src = carteScoreDataUrl;
        els.apercuCarteImg.alt = 'Carte de score de ' + (donnees.pseudo || 'Participant') + ' : ' + donnees.score + ' sur ' + donnees.total + ', ' + (donnees.mode === 'entrainement' ? 'entraînement' : 'défi quotidien') + '.';
        els.apercuCarteImg.classList.remove('hidden');
      }

      els.canvasCarteScore.toBlob(function (blob) {
        carteScoreBlob = blob;
      }, 'image/png');
    } catch (e) {
      if (els.apercuCarteImg) {
        els.apercuCarteImg.removeAttribute('src');
        els.apercuCarteImg.classList.add('hidden');
      }
      afficherFeedbackCarte('⚠️ La carte image n’a pas pu être générée. Tu peux toujours partager le score en texte.');
    }
  }

  function afficherFeedbackCarte(message, duree) {
    if (!els.feedbackCarte) return;
    els.feedbackCarte.textContent = message;
    els.feedbackCarte.classList.remove('hidden');
    clearTimeout(els.feedbackCarte._timer);
    els.feedbackCarte._timer = setTimeout(function () {
      els.feedbackCarte.classList.add('hidden');
    }, duree || 3200);
  }

  function telechargerImageScore() {
    if (!carteScoreDataUrl && els.canvasCarteScore) {
      carteScoreDataUrl = els.canvasCarteScore.toDataURL('image/png');
    }
    if (!carteScoreDataUrl) {
      afficherFeedbackCarte('⚠️ Impossible de générer l’image pour le moment.');
      return;
    }
    const a = document.createElement('a');
    a.href = carteScoreDataUrl;
    a.download = carteScoreNomFichier || 'defi-jean-score.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    afficherFeedbackCarte('✅ Image téléchargée ! Tu peux l’envoyer dans WhatsApp ou Instagram.');
  }

  async function copierImageScore() {
    if (!carteScoreBlob) {
      if (els.canvasCarteScore) {
        els.canvasCarteScore.toBlob(async function (blob) {
          carteScoreBlob = blob;
          await procederCopieImage();
        }, 'image/png');
        return;
      }
      afficherFeedbackCarte('⚠️ Image non disponible.');
      return;
    }
    await procederCopieImage();
  }

  async function procederCopieImage() {
    if (navigator.clipboard && window.ClipboardItem && carteScoreBlob) {
      try {
        const item = new ClipboardItem({ 'image/png': carteScoreBlob });
        await navigator.clipboard.write([item]);
        afficherFeedbackCarte('✅ Image copiée dans le presse-papier !');
        return;
      } catch (err) {
        // Fallback téléchargement direct si la copie presse-papier est refusée
      }
    }
    telechargerImageScore();
  }

  async function partagerImageScore() {
    const titre = 'Mon score Défi Jean';
    const texte = textePartage();

    if (!carteScoreBlob && els.canvasCarteScore) {
      els.canvasCarteScore.toBlob(async function (blob) {
        carteScoreBlob = blob;
        await procederPartageImage(titre, texte);
      }, 'image/png');
      return;
    }
    await procederPartageImage(titre, texte);
  }

  async function procederPartageImage(titre, texte) {
    if (carteScoreBlob && navigator.canShare) {
      try {
        const fichier = new File([carteScoreBlob], carteScoreNomFichier || 'defi-jean-score.png', { type: 'image/png' });
        if (navigator.canShare({ files: [fichier] })) {
          await navigator.share({
            files: [fichier],
            title: titre,
            text: texte
          });
          afficherFeedbackCarte('✅ Partage initié !');
          return;
        }
      } catch (err) {
        if (err.name === 'AbortError') return; // Annulation volontaire
      }
    }
    telechargerImageScore();
  }

  /* ---------------- Accueil / verrou du jour ---------------- */

  function ajouterBouton(parent, texte, classe, action) {
    const bouton = document.createElement('button');
    bouton.type = 'button';
    bouton.className = 'btn ' + classe;
    bouton.textContent = texte;
    bouton.addEventListener('click', action);
    parent.appendChild(bouton);
    return bouton;
  }

  function afficherResultatEnregistre(partie) {
    mode = 'quotidien';
    pseudo = partie.pseudo || '';
    datePartie = partie.date || cleJour(new Date());
    score = Number(partie.score) || 0;
    const total = Number(partie.total) || 0;
    questions = Array.isArray(partie.questions)
      ? partie.questions
      : Array.from({ length: total }, function () { return null; });
    reponses = Array.isArray(partie.reponses) ? partie.reponses : [];
    sortiesEcran = Number(partie.sorties) || 0;

    els.titreFin.textContent = '📖 Résultat du défi';
    els.finalScore.textContent = score;
    els.finalTotal.textContent = total;
    const pourcent = total ? score / total : 0;
    if (pourcent === 1) els.mention.textContent = '🏆 Parfait !';
    else if (pourcent >= 0.8) els.mention.textContent = '🌟 Excellent !';
    else if (pourcent >= 0.5) els.mention.textContent = '👍 Bien joué, continue !';
    else els.mention.textContent = '📖 Relis les références et retente demain !';
    els.empreinte.textContent = partie.empreinte || empreinte(SEL_EMPREINTE + '|' + pseudo + '|' + datePartie + '|' + score + '/' + total);
    els.messageRejouer.textContent = 'Partie du jour enregistrée : tu peux revoir le corrigé ci-dessous.';
    els.btnRejouer.classList.add('hidden');
    afficherCorrige();
    genererCarteVisuelle({
      pseudo: pseudo,
      score: score,
      total: total,
      mention: els.mention.textContent,
      empreinte: els.empreinte.textContent,
      sorties: sortiesEcran,
      date: datePartie,
      mode: mode
    });
    $('bloc-corrige').open = false;
    afficherEcran(els.fin);
    els.titreFin.focus();
  }

  function majRappelPartie() {
    const dateCle = cleJour(new Date());
    const partie = mode === 'quotidien' ? lireStockage(clePartie(dateCle)) : null;

    els.rappel.innerHTML = '';
    els.avertissementStockage.classList.add('hidden');

    if (mode === 'quotidien' && !stockage) {
      signalerStockage('Ce navigateur ne peut pas conserver ta tentative quotidienne. Le jeu reste jouable, mais la reprise et le verrou du jour ne fonctionneront pas.');
    } else if (mode === 'quotidien' && messageStockage) {
      signalerStockage(messageStockage);
    }

    if (!partie) {
      els.rappel.classList.add('hidden');
      els.zonePseudo.classList.remove('hidden');
      return;
    }

    const texte = document.createElement('p');
    const pseudoSauve = partie.pseudo || 'Joueur';
    if (partie.etat === 'en_cours') {
      if (!Array.isArray(partie.questions) || !partie.questions.length) {
        signalerStockage('La sauvegarde de la partie est illisible. Tu peux démarrer une nouvelle partie.');
        els.rappel.classList.add('hidden');
        els.zonePseudo.classList.remove('hidden');
        return;
      }
      const total = partie.questions.length;
      const numero = Math.min((Number(partie.index) || 0) + 1, total);
      texte.textContent = 'Tu as une partie en cours, ' + pseudoSauve + ' — question ' + numero + '/' + total + '.';
      els.rappel.appendChild(texte);
      ajouterBouton(els.rappel, '▶️ Reprendre ma partie', 'btn-principal', function () { reprendrePartie(partie); });
      els.rappel.classList.remove('hidden');
      els.zonePseudo.classList.add('hidden');
      return;
    }

    texte.textContent = 'Tu as déjà joué le défi d’aujourd’hui : ' + pseudoSauve + ' — ' + partie.score + '/' + partie.total + ' · empreinte ' + (partie.empreinte || 'indisponible');
    els.rappel.appendChild(texte);

    ajouterBouton(els.rappel, '📸 Voir ma carte de score & partager', 'btn-principal', function () { afficherResultatEnregistre(partie); });
    ajouterBouton(els.rappel, '📤 Partager en texte simple', 'btn-whatsapp', function () { partager(partie); });
    if (Array.isArray(partie.reponses) && partie.reponses.length) {
      ajouterBouton(els.rappel, '📚 Revoir mon corrigé', 'btn-secondaire', function () { afficherResultatEnregistre(partie); });
    }

    els.rappel.classList.remove('hidden');
    els.zonePseudo.classList.add('hidden');
  }

  /* ---------------- Écouteurs ---------------- */

  // Les changements d'application peuvent aussi masquer la page. On les compte
  // uniquement pour la partie officielle et le chrono continue à son échéance.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (partieEnCours && mode === 'quotidien') {
        sortiesEcran++;
        majSorties();
        enregistrerProgression();
      }
    } else if (partieEnCours && mode === 'quotidien') {
      boucleChrono();
    }
  });

  // Raccourcis clavier : 1-4 ou A-D.
  document.addEventListener('keydown', function (evt) {
    if (!partieEnCours || dejaRepondu) return;
    if (evt.ctrlKey || evt.metaKey || evt.altKey) return;
    const touche = evt.key.toLowerCase();
    let position = '1234'.indexOf(touche);
    if (position === -1) position = 'abcd'.indexOf(touche);
    if (position === -1) return;
    const bouton = boutonsOptions()[position];
    if (bouton) { evt.preventDefault(); bouton.click(); }
  });

  /* ---------------- Démarrage ---------------- */

  function init() {
    const parametres = new URLSearchParams(location.search);
    if (parametres.has('entrainement') || parametres.has('libre')) mode = 'entrainement';

    const lienMode = els.lienEntrainement.querySelector('a');
    if (mode === 'entrainement') {
      lienMode.href = location.pathname;
      lienMode.textContent = 'Revenir au défi officiel du jour';
      els.tempoAccroche.textContent = 'sans chrono';
      els.tirageAccroche.textContent = 'Questions tirées au hasard pour l’entraînement.';
      els.aidePseudo.textContent = '(pseudo affiché dans ton corrigé uniquement)';
      els.btnJouer.textContent = 'Commencer l’entraînement 🎯';
      $('bloc-regles').classList.add('hidden');
    }

    els.versionApp.textContent = APP_VERSION;
    els.nbBanque.textContent = BANQUE_QUESTIONS.length;
    els.chronoCercle.textContent = TEMPS_PAR_QUESTION;
    if (els.dateDefi) {
      els.dateDefi.textContent = 'Défi du ' + dateLongue(new Date()) +
        (mode === 'entrainement' ? ' — entraînement sans chrono' : '');
    }

    els.btnJouer.addEventListener('click', function () {
      const valeur = els.pseudo.value.trim();
      if (valeur.length < 2) {
        els.erreurPseudo.classList.remove('hidden');
        els.pseudo.focus();
        return;
      }
      els.erreurPseudo.classList.add('hidden');
      pseudo = valeur;
      if (stockage) { try { stockage.setItem(BASE_STOCKAGE + '.pseudo', valeur); } catch (e) {} }
      demarrerPartie();
    });

    els.pseudo.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter') { evt.preventDefault(); els.btnJouer.click(); }
    });

    els.btnPartager.addEventListener('click', function () { partager(); });
    els.btnCopier.addEventListener('click', function () { copier(els.btnCopier); });
    els.btnRejouer.addEventListener('click', function () { location.reload(); });

    if (els.btnPartagerImage) {
      els.btnPartagerImage.addEventListener('click', function () { partagerImageScore(); });
    }
    if (els.btnTelechargerImage) {
      els.btnTelechargerImage.addEventListener('click', function () { telechargerImageScore(); });
    }
    if (els.btnCopierImage) {
      els.btnCopierImage.addEventListener('click', function () { copierImageScore(); });
    }
    if (stockage) {
      try {
        const ancien = stockage.getItem(BASE_STOCKAGE + '.pseudo');
        if (ancien) els.pseudo.value = ancien;
      } catch (e) {}
    }

    majRappelPartie();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
