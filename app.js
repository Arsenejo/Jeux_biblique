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

  const APP_VERSION = '1.1.0';
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
    versionApp: $('version-app')
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
    $('bloc-corrige').open = true;
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

    ajouterBouton(els.rappel, '📤 Partager mon score du jour', 'btn-whatsapp', function () { partager(partie); });
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
