/* Promotion Warfare V08: daily 1-minute card, quiz + flashcards, phrasebook, CV bullet builder, STAR stories, goal builder. */
(function () {
  'use strict';
  var D8 = window.PW8 || {}, D7 = window.PW7 || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function burst(el, big, text) { if (!window.pwBurst || !el || !el.getBoundingClientRect) return; var r = el.getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, r.top + r.height / 2, !!big, text); }
  function checkBadges() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function isoDay(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function copyText(t, okMsg) {
    if (!t) { toast('Nothing to copy yet'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(okMsg || 'Copied ✓'); }, function () { toast('Select the text and copy it'); });
    else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(okMsg || 'Copied ✓'); } catch (e) { toast('Select the text and copy it'); } document.body.removeChild(ta); }
  }
  function shareText(t, title) { if (!t) { toast('Nothing to share yet'); return; } if (navigator.share) navigator.share({ title: title || 'Promotion Warfare', text: t }).catch(function () { }); else copyText(t); }
  var INP = 'w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 outline-none';
  var BTN = 'rounded-xl text-[11px] font-bold active:scale-95 ';

  /* =============================================================== 1. daily 1-minute card */
  var dailyShift = 0;
  function dayNumber() { var d = new Date(); return Math.floor(new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() / 864e5); }
  function dailyState() {
    var st = lsGet('pw_daily', {}); st.done = st.done || {}; var today = isoDay(), set = st.done, streak = 0, d = new Date();
    if (!set[today]) d.setDate(d.getDate() - 1);
    while (set[isoDay(d)]) { streak++; d.setDate(d.getDate() - 1); }
    var keys = Object.keys(set).sort(), best = 0, run = 0, prev = null;
    keys.forEach(function (k) { var dd = new Date(k + 'T12:00:00'); run = (prev && Math.round((dd - prev) / 864e5) === 1) ? run + 1 : 1; if (run > best) best = run; prev = dd; });
    return { st: st, today: today, doneToday: !!set[today], streak: streak, best: best, total: keys.length };
  }
  function renderDaily() {
    var box = $('daily-card'); if (!box || !D8.DAILY) return;
    var s = dailyState(), n = D8.DAILY.length, idx = ((dayNumber() + dailyShift) % n + n) % n, c = D8.DAILY[idx], html = '';
    html += '<div class="flex items-center justify-between mb-1"><p class="text-[10px] font-bold uppercase tracking-wider text-sky-300">☀️ Your 1-minute lesson' + (dailyShift ? ' · extra card' : '') + '</p><span class="text-[11px] font-bold ' + (s.streak ? 'text-amber-300' : 'text-slate-500') + '" title="Days in a row">🔥 ' + s.streak + '</span></div>' +
      '<p class="text-sm font-bold text-white leading-snug">' + esc(c[0]) + '</p><p class="text-xs text-slate-300 leading-relaxed mt-0.5">' + esc(c[1]) + '</p>' +
      '<p class="text-xs text-amber-200 mt-1.5 leading-snug"><b>Try it today:</b> ' + esc(c[2]) + '</p>' +
      '<div class="grid grid-cols-3 gap-2 mt-2">' +
      (s.doneToday ? '<button disabled class="py-2 ' + BTN + 'bg-emerald-800 text-white">✓ Done</button>' : '<button id="dc-done" onclick="dcDone()" class="py-2 ' + BTN + 'bg-emerald-600 hover:bg-emerald-500 text-white">✅ Got it</button>') +
      '<button onclick="dcAdd(' + idx + ')" class="py-2 ' + BTN + 'bg-amber-500 hover:bg-amber-400 text-slate-950">➕ Plan</button>' +
      '<button onclick="dcNext()" class="py-2 ' + BTN + 'bg-slate-700 text-slate-100">🔄 Next</button></div>';
    var goals = lsGet('pw_goals', []).filter(function (g) { return !g.done; });
    if (goals.length) { goals.sort(function (a, b) { return (a.due || '9999').localeCompare(b.due || '9999'); }); var g = goals[0], pc = pct(g); html += '<button onclick="goToStep(\'step-goals\',0)" class="mt-2 w-full text-left text-[11px] text-slate-300 active:scale-98">🎯 ' + esc(g.title) + ' · <b class="text-amber-300">' + pc + '%</b>' + (g.due ? ' · ' + daysLabel(g.due) : '') + '</button>'; }
    box.innerHTML = html;
  }
  window.dcDone = function () {
    var s = dailyState(); if (s.doneToday) return; s.st.done[s.today] = 1; lsSet('pw_daily', s.st);
    toast('Nice! Lesson done ✓'); burst($('dc-done'), false, '+1'); checkBadges(); renderDaily();
  };
  window.dcNext = function () { dailyShift++; renderDaily(); };
  window.dcAdd = function (i) { var c = D8.DAILY[i]; if (c) window.addMove('dc-' + i, c[0] + ': ' + c[2]); };

  /* =============================================================== 2. quiz + flashcards */
  function allQ() {
    var out = D8.QUIZ.map(function (q, i) { return { id: 'h' + i, q: q[0], a: q[1], w: q[2], e: q[3], c: q[4] }; });
    (D7.ABBR || []).forEach(function (a, i) { out.push({ id: 'a' + i, q: 'What does ' + a[0] + ' stand for?', a: a[1], abbr: a, e: a[0] + ': ' + a[2], c: 'Abbreviations' }); });
    return out;
  }
  var CATS = ['All', 'Strategy', 'Power Map', 'Skills', 'Glossary', 'Abbreviations'];
  var Z = { mode: 'menu', cat: 'All', deck: [], i: 0, score: 0, opts: [], picked: -1, flip: false, missed: [], review: false };
  function qstate() { var s = lsGet('pw_quiz', {}); s.wrong = s.wrong || {}; s.best = s.best || 0; s.played = s.played || 0; return s; }
  function pickDeck(cat, onlyWrong, n) {
    var st = qstate(), pool = allQ().filter(function (q) { return cat === 'All' || q.c === cat; });
    if (onlyWrong) return shuffle(pool.filter(function (q) { return st.wrong[q.id]; })).slice(0, n);
    var wrong = shuffle(pool.filter(function (q) { return st.wrong[q.id]; })).slice(0, 3), ids = {}; wrong.forEach(function (q) { ids[q.id] = 1; });
    return shuffle(wrong.concat(shuffle(pool.filter(function (q) { return !ids[q.id]; })).slice(0, n - wrong.length)));
  }
  function optsFor(q) {
    var wrong = q.w;
    if (q.abbr) { var others = shuffle((D7.ABBR || []).filter(function (a) { return a[0] !== q.abbr[0]; })).slice(0, 3); wrong = others.map(function (a) { return a[1]; }); }
    return shuffle([{ t: q.a, ok: 1 }].concat(wrong.map(function (t) { return { t: t, ok: 0 }; })));
  }
  function qzRender() {
    var box = $('quiz-body'); if (!box) return; var st = qstate(), h = '';
    if (Z.mode === 'menu') {
      var nw = Object.keys(st.wrong).length;
      h += '<p class="text-[11px] text-slate-300 mb-2 leading-snug">Quick quizzes of 10 questions. Mistakes come back later until you know them. ' + allQ().length + ' questions in total.</p>' +
        '<p class="text-[11px] font-bold text-slate-300 mb-1">Choose a topic</p><div class="grid grid-cols-2 gap-2 mb-3">' + CATS.map(function (c) { var cnt = allQ().filter(function (q) { return c === 'All' || q.c === c; }).length; return '<button onclick="qzStart(\'' + c + '\')" class="py-2.5 ' + BTN + 'bg-slate-700 hover:bg-slate-600 text-slate-100">' + esc(c) + ' <span class="text-slate-400 font-normal">(' + cnt + ')</span></button>'; }).join('') + '</div>' +
        '<div class="grid grid-cols-2 gap-2 mb-3"><button onclick="qzFlash(\'' + 'All' + '\')" class="py-2.5 ' + BTN + 'bg-purple-600 hover:bg-purple-500 text-white">🃏 Flashcards</button><button onclick="qzStart(\'All\',true)" ' + (nw ? '' : 'disabled') + ' class="py-2.5 ' + BTN + (nw ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-slate-800 text-slate-500') + '">🔁 My mistakes (' + nw + ')</button></div>' +
        '<div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-700/60 text-[11px] text-slate-300">Quizzes played: <b class="text-white">' + st.played + '</b> · Best score: <b class="text-amber-300">' + st.best + ' / 10</b></div>';
    } else if (Z.mode === 'flashcat') {
      h += '<p class="text-[11px] text-slate-300 mb-2">Choose cards for the flashcards:</p><div class="grid grid-cols-2 gap-2">' + CATS.map(function (c) { return '<button onclick="qzFlash(\'' + c + '\')" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">' + esc(c) + '</button>'; }).join('') + '</div>';
    } else if (Z.mode === 'quiz') {
      var q = Z.deck[Z.i], answered = Z.picked >= 0;
      h += '<div class="flex items-center justify-between mb-2"><span class="text-[11px] text-slate-400">Question ' + (Z.i + 1) + ' of ' + Z.deck.length + ' · ' + esc(q.c) + '</span><span class="text-[11px] font-bold text-amber-300">Score ' + Z.score + '</span></div>' +
        '<div class="w-full bg-slate-700/70 h-1.5 rounded-full overflow-hidden mb-3"><div class="h-full bg-amber-500" style="width:' + Math.round((Z.i + (answered ? 1 : 0)) / Z.deck.length * 100) + '%"></div></div>' +
        '<p class="text-sm font-bold text-white leading-snug mb-3" id="qz-q">' + esc(q.q) + '</p><div class="space-y-2" role="group" aria-labelledby="qz-q">' +
        Z.opts.map(function (o, i) {
          var cls = 'bg-slate-900/80 border-slate-700 text-slate-100';
          if (answered) { if (o.ok) cls = 'bg-emerald-600/30 border-emerald-500 text-emerald-100'; else if (i === Z.picked) cls = 'bg-red-600/30 border-red-500 text-red-100'; else cls = 'bg-slate-900/50 border-slate-800 text-slate-500'; }
          return '<button onclick="qzPick(' + i + ')" ' + (answered ? 'disabled' : '') + ' class="w-full text-left px-3 py-2.5 rounded-xl border text-xs leading-snug active:scale-98 ' + cls + '">' + (answered && o.ok ? '✓ ' : answered && i === Z.picked ? '✗ ' : '') + esc(o.t) + '</button>';
        }).join('') + '</div>';
      if (answered) h += '<p class="text-[11px] mt-3 leading-snug ' + (Z.opts[Z.picked].ok ? 'text-emerald-300' : 'text-amber-300') + '" aria-live="polite">' + (Z.opts[Z.picked].ok ? '✅ Correct! ' : '❌ Not quite. ') + esc(q.e) + '</p><button onclick="qzNext()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-red-600 hover:bg-red-500 text-white">' + (Z.i + 1 >= Z.deck.length ? 'See my score' : 'Next question →') + '</button>';
    } else if (Z.mode === 'result') {
      var total = Z.deck.length, msg = Z.score >= total * 0.8 ? '🏆 Excellent work!' : Z.score >= total * 0.5 ? '👍 Good job. Try again to improve.' : '🌱 Good start. Every round makes you stronger.';
      h += '<div class="text-center py-4"><p class="text-4xl font-extrabold text-amber-400">' + Z.score + ' / ' + total + '</p><p class="text-sm text-slate-200 mt-1">' + msg + '</p><p class="text-[11px] text-slate-400 mt-1">Best score: ' + st.best + ' / 10</p></div>' +
        '<div class="grid grid-cols-2 gap-2"><button onclick="qzStart(Z_CAT())" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">🔄 Play again</button><button onclick="qzMenu()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Menu</button></div>' +
        (Z.missed.length ? '<button onclick="qzStart(Z_CAT(),true)" class="mt-2 w-full py-2.5 ' + BTN + 'bg-red-600/80 text-white">🔁 Practice my ' + Z.missed.length + ' mistakes</button>' : '');
    } else if (Z.mode === 'flash') {
      var c = Z.deck[Z.i];
      h += '<div class="flex items-center justify-between mb-2"><span class="text-[11px] text-slate-400">Card ' + (Z.i + 1) + ' of ' + Z.deck.length + '</span><span class="text-[11px] text-slate-400">Tap the card to flip</span></div>' +
        '<div role="button" tabindex="0" onclick="qzFlip()" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();qzFlip()}" class="min-h-[170px] p-4 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer select-none ' + (Z.flip ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-slate-900/80 border-purple-500/40') + '">' +
        (Z.flip ? '<p class="text-[10px] uppercase tracking-wider text-emerald-400 mb-1">Answer</p><p class="text-sm font-bold text-white">' + esc(c.a) + '</p><p class="text-[11px] text-slate-300 mt-2 leading-snug">' + esc(c.e) + '</p>' : '<p class="text-[10px] uppercase tracking-wider text-purple-300 mb-1">' + esc(c.c) + '</p><p class="text-sm font-bold text-white leading-snug">' + esc(c.q) + '</p>') + '</div>' +
        (Z.flip ? '<div class="grid grid-cols-2 gap-2 mt-3"><button onclick="qzKnow(0)" class="py-2.5 ' + BTN + 'bg-red-600/80 text-white">Not yet</button><button onclick="qzKnow(1)" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">I knew it</button></div>' : '<button onclick="qzFlip()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-purple-600 text-white">Show answer</button>');
    } else if (Z.mode === 'flashend') {
      h += '<div class="text-center py-4"><p class="text-3xl">🃏</p><p class="text-sm text-slate-200 mt-1">You knew <b class="text-amber-300">' + Z.score + '</b> of ' + Z.deck.length + ' cards.</p><p class="text-[11px] text-slate-400 mt-1">Cards you missed will come back in your quizzes.</p></div><div class="grid grid-cols-2 gap-2"><button onclick="qzFlash(Z_CAT())" class="py-2.5 ' + BTN + 'bg-purple-600 text-white">🔄 More cards</button><button onclick="qzMenu()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Menu</button></div>';
    }
    box.innerHTML = h;
  }
  window.Z_CAT = function () { return Z.cat; };
  window.qzMenu = function () { Z.mode = 'menu'; qzRender(); };
  window.qzStart = function (cat, onlyWrong) {
    Z.cat = cat || 'All'; Z.deck = pickDeck(Z.cat, !!onlyWrong, 10);
    if (!Z.deck.length) { toast(onlyWrong ? 'No saved mistakes. Great!' : 'No questions here'); return; }
    Z.mode = 'quiz'; Z.i = 0; Z.score = 0; Z.picked = -1; Z.missed = []; Z.opts = optsFor(Z.deck[0]); qzRender();
  };
  window.qzPick = function (i) {
    if (Z.picked >= 0) return; Z.picked = i; var q = Z.deck[Z.i], st = qstate(), ok = Z.opts[i].ok;
    if (ok) { Z.score++; if (st.wrong[q.id]) { st.wrong[q.id]--; if (st.wrong[q.id] <= 0) delete st.wrong[q.id]; } } else { st.wrong[q.id] = 2; Z.missed.push(q.id); }
    lsSet('pw_quiz', st); qzRender();
  };
  window.qzNext = function () {
    if (Z.i + 1 >= Z.deck.length) {
      var st = qstate(); st.played++; if (Z.score > st.best && Z.deck.length >= 10) st.best = Z.score; if (Z.deck.length >= 10 && Z.score >= 8) flag('quizpro', 1); lsSet('pw_quiz', st);
      Z.mode = 'result'; qzRender(); if (Z.score >= Z.deck.length * 0.8) burst($('quiz-body'), true, '🏆'); checkBadges(); return;
    }
    Z.i++; Z.picked = -1; Z.opts = optsFor(Z.deck[Z.i]); qzRender();
  };
  window.qzFlash = function (cat) {
    if (!cat) { Z.mode = 'flashcat'; qzRender(); return; }
    Z.cat = cat; Z.deck = pickDeck(cat, false, 10); Z.mode = 'flash'; Z.i = 0; Z.score = 0; Z.flip = false; qzRender();
  };
  window.qzFlip = function () { Z.flip = !Z.flip; qzRender(); };
  window.qzKnow = function (k) {
    var q = Z.deck[Z.i], st = qstate();
    if (k) { Z.score++; if (st.wrong[q.id]) delete st.wrong[q.id]; } else st.wrong[q.id] = 2;
    lsSet('pw_quiz', st);
    if (Z.i + 1 >= Z.deck.length) { Z.mode = 'flashend'; } else { Z.i++; Z.flip = false; }
    qzRender();
  };
  /* the "Flashcards" button on the menu asks for a topic first */
  var _qzFlashBtn = window.qzFlash; window.qzFlash = function (cat) { if (Z.mode === 'menu' && cat === 'All') { Z.mode = 'flashcat'; qzRender(); return; } _qzFlashBtn(cat); };

  /* =============================================================== 5. phrasebook */
  var PH = { cat: 'All', q: '' };
  function renderPhrase() {
    var box = $('phrase-body'); if (!box || !D8.PHRASES) return;
    var cats = ['All']; D8.PHRASES.forEach(function (p) { if (cats.indexOf(p[0]) < 0) cats.push(p[0]); });
    var q = PH.q.trim().toLowerCase(), list = D8.PHRASES.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return (PH.cat === 'All' || x.p[0] === PH.cat) && (!q || (x.p[0] + ' ' + x.p[1] + ' ' + x.p[2]).toLowerCase().indexOf(q) >= 0); });
    var keep = document.activeElement && document.activeElement.id === 'ph-search';
    box.innerHTML = '<input id="ph-search" type="text" value="' + esc(PH.q) + '" oninput="phSearch(this.value)" placeholder="🔍 Search a situation or a word" class="' + INP + ' mb-2">' +
      '<div class="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar" role="group" aria-label="Topics" data-noswipe>' + cats.map(function (c) { return '<button onclick="phCat(\'' + c.replace(/'/g, "\\'") + '\')" class="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ' + (c === PH.cat ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-200 border border-slate-700') + '" aria-pressed="' + (c === PH.cat) + '">' + esc(c) + '</button>'; }).join('') + '</div>' +
      '<p class="text-[10px] text-slate-500 mb-1.5">' + list.length + ' of ' + D8.PHRASES.length + ' scripts. Change the names and numbers to fit your real situation.</p>' +
      '<div class="space-y-2 max-h-[52vh] overflow-y-auto pr-1 no-scrollbar" data-noswipe>' + (list.length ? list.map(function (x) {
        return '<div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60"><p class="text-[10px] uppercase tracking-wider text-amber-400 font-bold">' + esc(x.p[0]) + '</p><p class="text-xs font-bold text-white mt-0.5">' + esc(x.p[1]) + '</p><p class="text-xs text-slate-200 mt-1 leading-relaxed selectable">' + esc(x.p[2]) + '</p>' +
          '<div class="flex gap-2 mt-2"><button onclick="phCopy(' + x.i + ')" class="px-3 py-1.5 ' + BTN + 'bg-amber-500 text-slate-950">📋 Copy</button><button onclick="phShare(' + x.i + ')" class="px-3 py-1.5 ' + BTN + 'bg-slate-700 text-slate-100">📤 Share</button></div></div>';
      }).join('') : '<p class="text-[11px] text-slate-500">Nothing found. Try another word.</p>') + '</div>';
    if (keep) { var i = $('ph-search'); if (i) { i.focus(); try { i.setSelectionRange(i.value.length, i.value.length); } catch (e) { } } }
  }
  function plain(s) { return String(s).replace(/^"|"$/g, ''); }
  window.phSearch = function (v) { PH.q = v; renderPhrase(); };
  window.phCat = function (c) { PH.cat = c; renderPhrase(); };
  window.phCopy = function (i) { copyText(plain(D8.PHRASES[i][2]), 'Script copied ✓'); };
  window.phShare = function (i) { shareText(plain(D8.PHRASES[i][2]), D8.PHRASES[i][1]); };

  /* =============================================================== 12. CV bullet builder */
  function cleanWin(t) { return String(t || '').replace(/\s+/g, ' ').trim().replace(/[.;,\s]+$/, ''); }
  function upgrade(t) {
    t = cleanWin(t); if (!t) return '';
    for (var i = 0; i < D8.VERBS.length; i++) { if (D8.VERBS[i][0].test(t)) { t = t.replace(D8.VERBS[i][0], D8.VERBS[i][1]); break; } }
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  function hasNum(t) { return /\d|%|\$|€|£|₪/.test(t); }
  function renderCV() {
    var box = $('cv-body'); if (!box) return; var wins = lsGet('pw_wins_log', []), cv = lsGet('pw_cv', { sel: {}, role: '', co: '', fmt: 'cv' });
    if (!wins.length) { box.innerHTML = '<p class="text-[11px] text-amber-300 leading-snug">You have no wins yet. Add 3 to 5 wins in the Wins Journal first. Then this tool turns them into CV lines.</p><button onclick="goToStep(\'step-journal\',0)" class="mt-3 w-full py-2.5 ' + BTN + 'bg-emerald-600 text-white">📓 Open the Wins Journal</button>'; return; }
    box.innerHTML = '<p class="text-[11px] text-slate-300 mb-2 leading-snug">Tick the wins you want on your CV. The tool starts each line with a strong action word.</p>' +
      '<div class="space-y-1.5 max-h-[28vh] overflow-y-auto pr-1 no-scrollbar mb-3" data-noswipe>' + wins.map(function (w, i) {
        var on = cv.sel[i] !== false && (cv.sel[i] || hasNum(w.t || '') || wins.length <= 5);
        return '<label class="flex items-start gap-2 p-2 rounded-xl bg-slate-900/70 border border-slate-700/60 cursor-pointer"><input type="checkbox" class="mt-0.5 form-checkbox rounded text-emerald-500" data-cv="' + i + '" ' + (on ? 'checked' : '') + ' onchange="cvBuild()"><span class="text-xs text-slate-200 leading-snug">' + esc(w.t) + (hasNum(w.t || '') ? ' <span class="text-emerald-400">#</span>' : '') + '</span></label>';
      }).reverse().join('') + '</div>' +
      '<div class="grid grid-cols-2 gap-2 mb-2"><label class="text-[11px] font-bold text-slate-300">My job title<input id="cv-role" value="' + esc(cv.role) + '" oninput="cvBuild()" maxlength="40" placeholder="Support Agent" class="' + INP + ' mt-1"></label><label class="text-[11px] font-bold text-slate-300">Company (optional)<input id="cv-co" value="' + esc(cv.co) + '" oninput="cvBuild()" maxlength="40" placeholder="Name" class="' + INP + ' mt-1"></label></div>' +
      '<label class="block text-[11px] font-bold text-slate-300 mb-2">Style<select id="cv-fmt" onchange="cvBuild()" class="' + INP + ' mt-1"><option value="cv"' + (cv.fmt === 'cv' ? ' selected' : '') + '>CV bullets</option><option value="li"' + (cv.fmt === 'li' ? ' selected' : '') + '>LinkedIn experience text</option></select></label>' +
      '<p id="cv-note" class="text-[11px] leading-snug mb-1" aria-live="polite"></p><label for="cv-out" class="sr-only">Your CV lines</label><textarea id="cv-out" rows="9" class="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 leading-relaxed focus:border-amber-400 outline-none selectable"></textarea>' +
      '<div class="grid grid-cols-2 gap-2 mt-2"><button onclick="cvCopy()" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">📋 Copy</button><button onclick="cvShare()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📤 Share</button></div>' +
      '<p class="text-[10px] text-slate-500 mt-2 leading-snug">Lines are built from your wins with simple rules. Read them and fix anything that does not sound like you. Never add results that are not true.</p>';
    window.cvBuild(true);
  }
  window.cvBuild = function (quiet) {
    var out = $('cv-out'); if (!out) return; var wins = lsGet('pw_wins_log', []), sel = {}, picks = [];
    document.querySelectorAll('[data-cv]').forEach(function (c) { sel[c.getAttribute('data-cv')] = c.checked; if (c.checked) picks.push(parseInt(c.getAttribute('data-cv'), 10)); });
    var role = ($('cv-role') || {}).value || '', co = ($('cv-co') || {}).value || '', fmt = ($('cv-fmt') || {}).value || 'cv';
    lsSet('pw_cv', { sel: sel, role: role, co: co, fmt: fmt });
    picks.sort(function (a, b) { return a - b; });
    var lines = picks.map(function (i) { return upgrade(wins[i].t); });
    var head = (role.trim() || co.trim()) ? (role.trim() + (role.trim() && co.trim() ? ' · ' : '') + co.trim()) + '\n' : '';
    var text = '';
    if (lines.length) {
      if (fmt === 'li') {
        text = head + lines.map(function (l) { return '▪ ' + l; }).join('\n') + '\n\nAbout me:\n' + (role.trim() ? 'Reliable ' + role.trim().toLowerCase() + '. ' : 'Reliable team member. ') + 'Results include: ' + lines.slice(0, 2).map(function (l) { return l.charAt(0).toLowerCase() + l.slice(1); }).join('; ') + '. I learn fast, finish what I start and share the credit.';
      } else text = head + lines.map(function (l) { return '• ' + l; }).join('\n');
    }
    out.value = text;
    var nums = picks.filter(function (i) { return hasNum(wins[i].t || ''); }).length, note = $('cv-note');
    if (note) note.innerHTML = !lines.length ? '<span class="text-amber-300">Tick at least one win.</span>' : nums >= Math.ceil(lines.length / 2) ? '<span class="text-emerald-300">✓ ' + nums + ' of ' + lines.length + ' lines have numbers. Employers like that.</span>' : '<span class="text-amber-300">Tip: only ' + nums + ' of ' + lines.length + ' lines have a number. Edit your wins and add one: how many, how fast, how much.</span>';
    if (quiet !== true && lines.length) { flag('cvdone', 1); checkBadges(); }
  };
  window.cvCopy = function () { var t = ($('cv-out') || {}).value; if (t) { flag('cvdone', 1); checkBadges(); } copyText(t, 'CV lines copied ✓'); };
  window.cvShare = function () { var t = ($('cv-out') || {}).value; if (t) { flag('cvdone', 1); checkBadges(); } shareText(t, 'My CV lines'); };

  /* =============================================================== 13. STAR stories */
  var STAR_HINT = { s: 'Where were you, and what was happening? (1 or 2 sentences)', t: 'What was your job or goal in that moment?', a: 'What did YOU do? Use "I". Give 2 or 3 steps.', r: 'What changed? Add a number if you can.' };
  function starBuild(o) {
    var parts = [['Situation', o.s], ['Task', o.t], ['Action', o.a], ['Result', o.r]].filter(function (p) { return (p[1] || '').trim(); });
    return parts.map(function (p) { return p[0] + ': ' + p[1].trim().replace(/\s+/g, ' '); }).join('\n');
  }
  function renderStar() {
    var box = $('star-body'); if (!box) return; var wins = lsGet('pw_wins_log', []), saved = lsGet('pw_star', []);
    box.innerHTML = '<p class="text-[11px] text-slate-300 mb-2 leading-snug">The STAR method keeps interview answers short and clear: <b>S</b>ituation, <b>T</b>ask, <b>A</b>ction, <b>R</b>esult.</p>' +
      '<label class="block text-[11px] font-bold text-slate-300 mb-2">Interview question<select id="st-q" class="' + INP + ' mt-1">' + D8.STAR_Q.map(function (q) { return '<option>' + esc(q) + '</option>'; }).join('') + '</select></label>' +
      (wins.length ? '<label class="block text-[11px] font-bold text-slate-300 mb-2">Start from one of my wins (optional)<select id="st-win" onchange="stFill()" class="' + INP + ' mt-1"><option value="">Choose a win…</option>' + wins.map(function (w, i) { return '<option value="' + i + '">' + esc(String(w.t).slice(0, 70)) + '</option>'; }).join('') + '</select></label>' : '') +
      ['s', 't', 'a', 'r'].map(function (k) { var nm = { s: 'Situation', t: 'Task', a: 'Action', r: 'Result' }[k]; return '<label class="block text-[11px] font-bold text-slate-300 mb-2">' + nm + '<textarea id="st-' + k + '" rows="2" maxlength="400" oninput="stCount()" placeholder="' + esc(STAR_HINT[k]) + '" class="' + INP + ' mt-1"></textarea></label>'; }).join('') +
      '<p id="st-count" class="text-[11px] text-slate-400 mb-2" aria-live="polite"></p>' +
      '<div class="grid grid-cols-3 gap-2"><button onclick="stBuild()" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">✨ Build</button><button onclick="stSave()" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">💾 Save</button><button onclick="stClear()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Clear</button></div>' +
      '<textarea id="st-out" rows="7" aria-label="Your STAR answer" class="mt-3 ' + INP + ' leading-relaxed selectable" placeholder="Your answer appears here. You can edit it."></textarea>' +
      '<div class="grid grid-cols-2 gap-2 mt-2"><button onclick="copyStar()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📋 Copy</button><button onclick="shareStar()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📤 Share</button></div>' +
      '<p class="text-[10px] text-slate-500 mt-2 leading-snug">Tip: say your answer out loud. About 60 to 90 words is 30 to 40 seconds, which is perfect.</p>' +
      '<p class="text-xs font-bold text-amber-400 mt-4 mb-1.5">My saved stories (' + saved.length + ')</p><div class="space-y-2" data-noswipe>' + (saved.length ? saved.map(function (s, i) { return '<div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60"><p class="text-[11px] font-bold text-white">' + esc(s.q) + '</p><p class="text-[11px] text-slate-300 mt-1 whitespace-pre-line leading-snug">' + esc(starBuild(s)) + '</p><div class="flex gap-2 mt-2"><button onclick="stCopy(' + i + ')" class="px-3 py-1.5 ' + BTN + 'bg-amber-500 text-slate-950">📋 Copy</button><button onclick="stLoad(' + i + ')" class="px-3 py-1.5 ' + BTN + 'bg-slate-700 text-slate-100">✏️ Edit</button><button onclick="stDel(' + i + ')" class="px-3 py-1.5 ' + BTN + 'bg-slate-700 text-red-400">🗑️</button></div></div>'; }).join('') : '<p class="text-[11px] text-slate-500">No saved stories yet. Prepare 3 stories and you are ready for most interviews.</p>') + '</div>';
  }
  function stVals() { var o = {}; ['s', 't', 'a', 'r'].forEach(function (k) { o[k] = ($('st-' + k) || {}).value || ''; }); o.q = ($('st-q') || {}).value || ''; return o; }
  window.stFill = function () {
    var i = ($('st-win') || {}).value; if (i === '') return; var w = lsGet('pw_wins_log', [])[parseInt(i, 10)]; if (!w) return;
    var r = $('st-r'); if (r && !r.value.trim()) r.value = upgrade(w.t) + '.'; var a = $('st-a'); if (a && !a.value.trim()) a.value = 'I ' + cleanWin(w.t).charAt(0).toLowerCase() + cleanWin(w.t).slice(1) + '.'; stCount();
  };
  window.stCount = function () { var o = stVals(), words = starBuild(o).replace(/\b(Situation|Task|Action|Result):/g, '').trim().split(/\s+/).filter(Boolean).length, el = $('st-count'); if (el) el.textContent = words ? words + ' words · ' + (words < 40 ? 'a bit short, add detail' : words <= 100 ? 'good length ✓' : 'long: shorten it to about 90 words') : 'Fill in the four boxes. Short sentences are best.'; };
  window.stBuild = function () { var o = stVals(); if (!(o.s + o.t + o.a + o.r).trim()) { toast('Write something in the four boxes first'); return; } $('st-out').value = starBuild(o); stCount(); };
  window.stSave = function () {
    var o = stVals(); if (!(o.a || '').trim() || !(o.r || '').trim()) { toast('Add at least an Action and a Result'); return; }
    var l = lsGet('pw_star', []); l.push(o); lsSet('pw_star', l); toast('Story saved ✓'); renderStar();
  };
  window.stClear = function () { ['s', 't', 'a', 'r'].forEach(function (k) { var e = $('st-' + k); if (e) e.value = ''; }); var o = $('st-out'); if (o) o.value = ''; stCount(); };
  window.copyStar = function () { copyText(($('st-out') || {}).value, 'Answer copied ✓'); };
  window.shareStar = function () { shareText(($('st-out') || {}).value, 'My interview answer'); };
  window.stCopy = function (i) { var s = lsGet('pw_star', [])[i]; if (s) copyText(s.q + '\n' + starBuild(s), 'Story copied ✓'); };
  window.stLoad = function (i) { var s = lsGet('pw_star', [])[i]; if (!s) return; ['s', 't', 'a', 'r'].forEach(function (k) { var e = $('st-' + k); if (e) e.value = s[k] || ''; }); var q = $('st-q'); if (q) q.value = s.q; stCount(); window.scrollTo(0, 0); };
  window.stDel = function (i) { var l = lsGet('pw_star', []); l.splice(i, 1); lsSet('pw_star', l); renderStar(); };

  /* =============================================================== 16. goal builder */
  function pct(g) { var span = (g.target - g.start) || 1, p = Math.round((g.cur - g.start) / span * 100); return Math.max(0, Math.min(100, p)); }
  function daysLeft(iso) { var t = new Date(iso + 'T12:00:00'), n = new Date(); n.setHours(12, 0, 0, 0); return Math.round((t - n) / 864e5); }
  function daysLabel(iso) { var d = daysLeft(iso); return d < 0 ? Math.abs(d) + ' days late' : d === 0 ? 'due today' : d === 1 ? '1 day left' : d + ' days left'; }
  function renderGoals() {
    var box = $('goals-body'); if (!box) return; var goals = lsGet('pw_goals', []);
    var act = goals.map(function (g, i) { return { g: g, i: i }; }).filter(function (x) { return !x.g.done; }), fin = goals.map(function (g, i) { return { g: g, i: i }; }).filter(function (x) { return x.g.done; });
    box.innerHTML = '<div class="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60 mb-3"><p class="text-xs font-bold text-amber-400 mb-1.5">➕ New goal</p>' +
      '<label class="block text-[11px] font-bold text-slate-300 mb-1.5">What do I want? (be specific)<input id="gl-title" maxlength="80" placeholder="Example: Answer customer emails faster" class="' + INP + ' mt-1"></label>' +
      '<div class="grid grid-cols-3 gap-2 mb-1.5"><label class="text-[11px] font-bold text-slate-300">Start at<input id="gl-start" type="number" inputmode="decimal" value="0" class="' + INP + ' mt-1"></label><label class="text-[11px] font-bold text-slate-300">Goal number<input id="gl-target" type="number" inputmode="decimal" placeholder="10" class="' + INP + ' mt-1"></label><label class="text-[11px] font-bold text-slate-300">Unit<input id="gl-unit" maxlength="14" placeholder="sales" class="' + INP + ' mt-1"></label></div>' +
      '<label class="block text-[11px] font-bold text-slate-300 mb-1.5">Finish by<input id="gl-due" type="date" class="' + INP + ' mt-1"></label>' +
      '<p id="gl-smart" class="text-[11px] text-slate-400 mb-2" aria-live="polite">SMART check: fill in the boxes.</p><button onclick="glAdd()" class="w-full py-2.5 ' + BTN + 'bg-emerald-600 hover:bg-emerald-500 text-white">Create goal</button></div>' +
      '<p class="text-xs font-bold text-amber-400 mb-1.5">My goals (' + act.length + ')</p><div class="space-y-2.5 mb-4" data-noswipe>' + (act.length ? act.map(function (x) {
        var g = x.g, p = pct(g), late = g.due && daysLeft(g.due) < 0;
        return '<div class="p-3 rounded-xl bg-slate-900/70 border ' + (late ? 'border-red-500/50' : 'border-slate-700/60') + '"><div class="flex justify-between gap-2"><p class="text-xs font-bold text-white leading-snug">' + esc(g.title) + '</p><span class="text-[11px] font-bold text-amber-300">' + p + '%</span></div>' +
          '<div class="w-full bg-slate-700/70 h-2.5 rounded-full overflow-hidden mt-1.5" role="progressbar" aria-valuenow="' + p + '" aria-valuemin="0" aria-valuemax="100"><div class="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500" style="width:' + p + '%"></div></div>' +
          '<p class="text-[11px] text-slate-400 mt-1">' + g.cur + ' of ' + g.target + (g.unit ? ' ' + esc(g.unit) : '') + (g.due ? ' · <span class="' + (late ? 'text-red-400 font-bold' : '') + '">' + daysLabel(g.due) + '</span>' : '') + '</p>' +
          '<div class="flex gap-2 mt-2 items-center"><input id="gl-cur-' + x.i + '" type="number" inputmode="decimal" value="' + g.cur + '" aria-label="Current number" class="w-20 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 outline-none"><button onclick="glSet(' + x.i + ')" class="px-3 py-1.5 ' + BTN + 'bg-amber-500 text-slate-950">Update</button><button onclick="glPlus(' + x.i + ')" class="px-3 py-1.5 ' + BTN + 'bg-slate-700 text-slate-100">+1</button><button onclick="glPlan(' + x.i + ')" class="px-2.5 py-1.5 ' + BTN + 'bg-slate-700 text-slate-100" title="Add to my plan">➕ Plan</button><button onclick="glDel(' + x.i + ')" class="px-2.5 py-1.5 ' + BTN + 'bg-slate-700 text-red-400" aria-label="Delete goal">🗑️</button></div></div>';
      }).join('') : '<p class="text-[11px] text-slate-500">No goals yet. Create one above. One clear goal per month works best.</p>') + '</div>' +
      (fin.length ? '<p class="text-xs font-bold text-emerald-400 mb-1.5">Finished (' + fin.length + ')</p><div class="space-y-1.5">' + fin.map(function (x) { return '<div class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-emerald-900/20 border border-emerald-600/30"><p class="text-[11px] text-emerald-100 leading-snug">✅ ' + esc(x.g.title) + ' <span class="text-slate-400">· ' + esc(x.g.doneOn || '') + '</span></p><button onclick="glDel(' + x.i + ')" class="text-[11px] text-slate-400" aria-label="Delete">🗑️</button></div>'; }).join('') + '</div>' : '');
    var t = $('gl-title'), tg = $('gl-target'), du = $('gl-due'); [t, tg, du, $('gl-start')].forEach(function (e) { if (e) e.addEventListener('input', glSmart); });
    if (du) du.min = isoDay();
  }
  function glSmart() {
    var t = (($('gl-title') || {}).value || '').trim(), tg = parseFloat(($('gl-target') || {}).value), st = parseFloat(($('gl-start') || {}).value || '0'), du = ($('gl-due') || {}).value, el = $('gl-smart'); if (!el) return;
    var s = t.length >= 8, m = !isNaN(tg) && tg !== st, tb = !!du, n = (s ? 1 : 0) + (m ? 1 : 0) + (tb ? 1 : 0);
    el.innerHTML = 'SMART check: ' + (s ? '✅' : '⬜') + ' Specific · ' + (m ? '✅' : '⬜') + ' Measurable · ' + (tb ? '✅' : '⬜') + ' Time limit' + (n === 3 ? ' <span class="text-emerald-300">· Great goal!</span>' : '');
  }
  window.glAdd = function () {
    var title = (($('gl-title') || {}).value || '').trim(), target = parseFloat(($('gl-target') || {}).value), start = parseFloat(($('gl-start') || {}).value || '0'), unit = (($('gl-unit') || {}).value || '').trim(), due = ($('gl-due') || {}).value || '';
    if (!title) { toast('Write what you want to reach'); return; } if (isNaN(target)) { toast('Add a goal number'); return; } if (isNaN(start)) start = 0; if (target === start) { toast('The goal number must be different from the start'); return; }
    var l = lsGet('pw_goals', []); l.push({ title: title, target: target, start: start, cur: start, unit: unit, due: due, made: isoDay() }); lsSet('pw_goals', l); toast('Goal created ✓'); renderGoals(); renderDaily();
  };
  function glChange(i, v) {
    var l = lsGet('pw_goals', []), g = l[i]; if (!g || isNaN(v)) return; g.cur = v;
    var reached = g.target >= g.start ? v >= g.target : v <= g.target;
    if (reached && !g.done) { g.done = true; g.doneOn = isoDay(); flag('goalget', 1); lsSet('pw_goals', l); toast('🎯 Goal reached! Great job!'); burst($('goals-body'), true, '🎯'); checkBadges(); }
    else lsSet('pw_goals', l);
    renderGoals(); renderDaily();
  }
  window.glSet = function (i) { glChange(i, parseFloat(($('gl-cur-' + i) || {}).value)); };
  window.glPlus = function (i) { var g = lsGet('pw_goals', [])[i]; if (g) glChange(i, g.cur + (g.target >= g.start ? 1 : -1)); };
  window.glPlan = function (i) { var g = lsGet('pw_goals', [])[i]; if (g) window.addMove('goal-' + i + '-' + (g.made || ''), 'Work on my goal: ' + g.title); };
  window.glDel = function (i) { if (!confirm('Delete this goal?')) return; var l = lsGet('pw_goals', []); l.splice(i, 1); lsSet('pw_goals', l); renderGoals(); renderDaily(); };

  /* =============================================================== hub page + badges + hooks */
  var _extra = window.pwExtraBadges;
  window.pwExtraBadges = function () {
    var o = _extra ? _extra() : {}, f = lsGet('pw_flags', {}), d = dailyState();
    o.daily7 = d.best >= 7; o.quizpro = !!f.quizpro; o.goalget = !!f.goalget; o.cvdone = !!f.cvdone; return o;
  };
  function onPage(id) {
    if (id === 'step-welcome') renderDaily();
    if (id === 'step-quiz') { if (Z.mode !== 'quiz' && Z.mode !== 'flash') Z.mode = 'menu'; qzRender(); }
    if (id === 'step-phrase') renderPhrase();
    if (id === 'step-cv') renderCV();
    if (id === 'step-star') renderStar();
    if (id === 'step-goals') renderGoals();
  }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); try { onPage(id); } catch (e) { console.error(e); } };
  var _nav = window.navTo;
  window.navTo = function (t) { return _nav.apply(this, arguments); };
  function init() { try { renderDaily(); } catch (e) { console.error(e); } setTimeout(checkBadges, 1000); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 200); }); else setTimeout(init, 200);
})();
