/* Promotion Warfare V17: 5 levels (easy to hard) and a Reset button for the games.
   Boss Battles, Swipe Cards, Spot the Red Flag, Message Makeover, Buzzword Bingo get levels.
   The Office Politics Game already has 10 levels, so it only gets a Reset button.
   Saved in localStorage key pw_lv17. Loads after v12games.js, v16.js and v17data.js. */
(function () {
  'use strict';
  var P = window.PW12, X = window.PW17;
  if (!P || !P.g || !P.pages || !X) return;
  var G = P.g, D = P, $ = function (id) { return document.getElementById(id); };
  var esc = P.esc, lsGet = P.lsGet, lsSet = P.lsSet, toast = P.toast, iso = P.isoDay, shuffle = P.shuffle;
  var BTN = 'rounded-xl text-xs font-bold active:scale-95 transition ';
  var CARD = 'p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60';
  var NAMES = ['Rookie', 'Fighter', 'Strategist', 'Veteran', 'Legend'], ICONS = ['🌱', '⚔️', '♟️', '🛡️', '👑'];
  var TITLE = { boss: 'Boss Battles', swipe: 'Swipe Cards', flags: 'Spot the Red Flag', make: 'Message Makeover', bingo: 'Buzzword Bingo', gm: 'the Office Politics Game' };

  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function chk() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function burst(el, big, e) { if (P.fx() !== 'full' || !window.pwBurst) return; try { var r = (el || document.body).getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, Math.max(60, r.top + 40), !!big, e || '🌟'); } catch (x) { } }
  function pop(el) { if (el && P.fx() !== 'off') { el.classList.remove('v12-pop'); void el.offsetWidth; el.classList.add('v12-pop'); } }
  function top() { try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { } }
  function clamp(n) { return Math.max(0, Math.min(100, n)); }

  /* ---------- saved results ---------- */
  function all() { var o = lsGet('pw_lv17', {}); return o && typeof o === 'object' ? o : {}; }
  function lvGet(g, n) { var o = all(); return (o[g] && o[g][n]) || null; }
  function lvPut(g, n, score, pass) {
    var o = all(); o[g] = o[g] || {}; var r = o[g][n] || { best: 0, pass: false, runs: 0 };
    r.runs = (r.runs || 0) + 1; if (score > r.best) r.best = score; if (pass) r.pass = true; r.at = iso(); o[g][n] = r; lsSet('pw_lv17', o); return r;
  }
  function open(g, n) { if (n === 1) return true; if (g === 'boss') return bossBeaten(n - 1) >= 3; var r = lvGet(g, n - 1); return !!(r && r.pass); }
  function passed(g) { var c = 0; for (var n = 1; n <= 5; n++) { var r = lvGet(g, n); if (r && r.pass) c++; } return c; }

  /* ---------- timer (pauses while the app is hidden) ---------- */
  var T = 0;
  function stopTimer() { clearInterval(T); T = 0; }
  function startTimer(sec, barId, cb) {
    stopTimer(); if (!sec) return; var t0 = Date.now(), last = t0;
    T = setInterval(function () {
      var now = Date.now(), bar = $(barId); if (!bar) { stopTimer(); return; }
      if (document.hidden) { t0 += now - last; last = now; return; } last = now;
      var f = 1 - (now - t0) / (sec * 1000); bar.style.width = Math.max(0, f * 100) + '%'; bar.style.background = f < .3 ? '#ef4444' : f < .6 ? '#f59e0b' : '#34d399';
      if (f <= 0) { stopTimer(); cb(); }
    }, 100);
  }
  function timerBar(sec, id) { return sec ? '<div class="h-1.5 rounded-full bg-slate-700 overflow-hidden mb-2" role="progressbar" aria-label="Time left"><div id="' + id + '" class="h-full" style="width:100%;background:#34d399"></div></div>' : ''; }

  /* ---------- shared screens ---------- */
  var ask = {}, RENDER = {};
  function backLink(g) { return '<button onclick="PW12.g.x17menu(\'' + g + '\')" class="text-[11px] text-slate-400 underline">← Levels</button>'; }
  function resetBox(g) {
    if (ask[g]) return '<div class="' + CARD + ' mt-3 border-rose-500/50"><p class="text-xs text-rose-300 font-bold mb-1">Reset all results of ' + TITLE[g] + '?</p><p class="text-[11px] text-slate-300 mb-2 leading-snug">Your levels and best scores are deleted and you start again from the beginning. Your XP and badges stay.</p><div class="flex gap-2"><button onclick="PW12.g.rs17do(\'' + g + '\')" class="flex-1 py-2.5 ' + BTN + 'bg-rose-600 text-white">Yes, reset</button><button onclick="PW12.g.rs17no(\'' + g + '\')" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Cancel</button></div></div>';
    return '<button onclick="PW12.g.rs17ask(\'' + g + '\')" class="mt-3 w-full py-2.5 ' + BTN + 'bg-slate-800 border border-slate-600 text-slate-300">🔄 Reset my results</button>';
  }
  function lvBtn(g, n, desc, line, go) {
    var op = open(g, n);
    return '<button ' + (op ? 'onclick="' + go + '(' + n + ')"' : 'disabled aria-disabled="true"') + ' class="w-full text-left p-3 rounded-2xl border ' + (op ? 'bg-slate-900/70 border-slate-600 hover:border-amber-400' : 'bg-slate-900/40 border-slate-800 opacity-60') + ' active:scale-95 transition"><div class="flex items-center gap-3"><span class="text-3xl">' + (op ? ICONS[n - 1] : '🔒') + '</span><div class="flex-1"><p class="text-sm font-bold text-white">Level ' + n + ': ' + NAMES[n - 1] + '</p><p class="text-[11px] text-slate-400 leading-snug">' + esc(desc) + '</p>' + (op ? line : '<p class="text-[11px] text-slate-500 mt-0.5">Pass Level ' + (n - 1) + ' to unlock</p>') + '</div>' + (op ? '<span class="text-amber-400">▶</span>' : '') + '</div></button>';
  }
  function stat(g, n) {
    var r = lvGet(g, n);
    return r ? '<p class="text-[11px] font-bold mt-0.5 ' + (r.pass ? 'text-emerald-300' : 'text-amber-300') + '">' + (r.pass ? '✅ Passed' : 'Not passed yet') + ' · Best ' + r.best + ' / 100</p>' : '<p class="text-[11px] text-emerald-300 font-bold mt-0.5">Tap to play</p>';
  }
  function menuHTML(g, icon, intro, cfgs, go, descFn, extra) {
    var h = '<div class="text-center mb-3"><div class="text-5xl">' + icon + '</div><p class="text-[11px] text-slate-300 leading-snug mt-1">' + intro + '</p><p class="text-[11px] text-amber-300 font-bold mt-1">Levels passed: ' + passed2(g) + ' / 5</p></div><div class="space-y-2.5">';
    cfgs.forEach(function (c, i) { h += lvBtn(g, i + 1, descFn(c), stat(g, i + 1), go); });
    return h + '</div>' + (extra || '') + resetBox(g);
  }
  function passed2(g) { if (g === 'boss') { var c = 0; for (var n = 1; n <= 5; n++) if (bossBeaten(n) >= 3) c++; return c; } return passed(g); }
  function endButtons(g, n, ok, again, next) {
    return '<div class="flex gap-2 mt-3"><button onclick="' + again + '" class="flex-1 py-2.5 ' + BTN + 'bg-violet-600 text-white">🔁 Try again</button>' + (ok && n < 5 ? '<button onclick="' + next + '(' + (n + 1) + ')" class="flex-1 py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">Next level ▶</button>' : '<button onclick="PW12.g.x17menu(\'' + g + '\')" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">☰ Levels</button>') + '</div>' + (ok && n < 5 ? '<button onclick="PW12.g.x17menu(\'' + g + '\')" class="mt-2 w-full py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">☰ Levels</button>' : '') + resetBox(g);
  }
  G.x17menu = function (g) { stopTimer(); ({ boss: function () { bb = { m: 'menu' }; }, swipe: function () { sw = { m: 'menu' }; }, flags: function () { fl = { m: 'menu' }; }, make: function () { mk = { m: 'menu' }; }, bingo: function () { bn = { m: 'menu' }; } })[g](); RENDER[g](); top(); };
  G.rs17ask = function (g) { ask[g] = true; RENDER[g](); };
  G.rs17no = function (g) { ask[g] = false; RENDER[g](); };
  G.rs17do = function (g) {
    ask[g] = false; var o = all();
    if (g === 'boss') { delete o.boss; delete o.bossw; lsSet('pw_boss12', { won: {} }); bb = { m: 'menu' }; }
    else if (g === 'swipe') { delete o.swipe; lsSet('pw_swipe', { best: 0 }); sw = { m: 'menu' }; }
    else if (g === 'flags') { delete o.flags; fl = { m: 'menu' }; }
    else if (g === 'make') { delete o.make; mk = { m: 'menu' }; }
    else if (g === 'bingo') { delete o.bingo; bn = { m: 'menu' }; }
    else if (g === 'gm') { lsSet('pw_game', { done: {}, runs: 0 }); }
    lsSet('pw_lv17', o); stopTimer(); toast('Results reset ✓ Play again!'); P.fb('tap');
    if (g === 'gm') { if (window.gmMenu) window.gmMenu(); gmBox(); } else { RENDER[g](); top(); }
  };

  /* =================== BOSS BATTLES =================== */
  var BL = [
    { d: 'Easy fight. 4 rounds. Two smart replies can win.', b: 30, o: 12, mo: 8, mx: 20, win: 50 },
    { d: 'The classic fight. 4 rounds.', b: 25, o: 10, mo: 10, mx: 25, win: 30 },
    { d: '5 rounds. A Rage round comes at the end.', rage: 1, b: 22, o: 8, mo: 12, mx: 28, win: 30 },
    { d: 'Rage round, mixed order. A weak reply heals the boss.', rage: 1, shuf: 1, b: 20, o: 6, mo: 15, mx: 30, hx: 10, win: 25 },
    { d: 'The hardest fight. The boss heals a lot. You lose confidence fast.', rage: 1, shuf: 1, b: 20, o: 4, mo: 18, mx: 35, hx: 15, ho: 5, win: 20 }
  ];
  var bb = { m: 'menu' };
  function bossWon(l, i) { var o = all(); return (o.bossw && o.bossw[l + '-' + i]) || (l === 1 && ((lsGet('pw_boss12', { won: {} }).won || {})[i])) || null; }
  function bossBeaten(l) { var c = 0; for (var i = 0; i < D.BOSSES.length; i++) if (bossWon(l, i)) c++; return c; }
  function ring(p, c) { var C = 2 * Math.PI * 26; return '<svg viewBox="0 0 64 64" width="52" height="52" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#334155" stroke-width="6"/><circle cx="32" cy="32" r="26" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - p / 100)).toFixed(1) + '" transform="rotate(-90 32 32)"/></svg>'; }
  function renderBoss() {
    var b = $('bb-body'); if (!b) return; var h = '';
    if (bb.m === 'menu') {
      h += '<div class="text-center mb-3"><div class="text-5xl">👹</div><p class="text-[11px] text-slate-300 leading-snug mt-1">5 levels, 6 bosses in each. Beat 3 bosses to unlock the next level. Smart replies hurt the boss. Weak replies hurt you.</p><p class="text-[11px] text-amber-300 font-bold mt-1">Levels passed: ' + passed2('boss') + ' / 5</p></div><div class="space-y-2.5">';
      BL.forEach(function (c, i) { var n = i + 1, k = bossBeaten(n); h += lvBtn('boss', n, c.d, '<p class="text-[11px] font-bold mt-0.5 ' + (k >= 3 ? 'text-emerald-300' : 'text-amber-300') + '">Bosses beaten: ' + k + ' / 6' + (k >= 3 ? ' ✅' : ' (3 needed)') + '</p>', 'PW12.g.bbLevel'); });
      h += '</div>' + resetBox('boss');
    } else if (bb.m === 'bosses') {
      var c = BL[bb.lv - 1];
      h += '<div class="flex items-center justify-between mb-2">' + backLink('boss') + '<span class="text-[11px] font-bold text-amber-300">' + ICONS[bb.lv - 1] + ' Level ' + bb.lv + ': ' + NAMES[bb.lv - 1] + '</span></div><p class="text-[11px] text-slate-400 mb-3">' + esc(c.d) + ' To win: bring the boss HP down to <b class="text-amber-300">' + c.win + '</b> or less, and keep some confidence.</p><div class="space-y-2">';
      D.BOSSES.forEach(function (x, i) { var w = bossWon(bb.lv, i); h += '<button onclick="PW12.g.bbStart(' + i + ')" class="w-full text-left p-3 ' + BTN + 'bg-slate-900/70 border ' + (w ? 'border-emerald-500/50' : 'border-slate-700/60') + ' flex items-center gap-3">' + ring(w ? w.score : 0, w ? '#34d399' : '#f87171') + '<span><b class="text-sm text-white block">' + x.e + ' ' + esc(x.n) + '</b><span class="text-[11px] ' + (w ? 'text-emerald-300' : 'text-slate-400') + '">' + (w ? 'Beaten · best ' + w.score + ' / 100' : 'Not beaten yet') + '</span></span></button>'; });
      h += '</div>';
    } else if (bb.m === 'fight') {
      var x = D.BOSSES[bb.b], r = bb.rounds[bb.r];
      h += '<div class="flex items-center justify-between mb-2"><span class="text-[11px] text-slate-400">Level ' + bb.lv + ' · Round ' + (bb.r + 1) + ' of ' + bb.rounds.length + (r.rage ? ' · <b class="text-red-300">🔥 Rage round</b>' : '') + '</span><button onclick="PW12.g.bbBosses()" class="text-[11px] text-slate-400 underline">Leave</button></div>' +
        '<div class="text-center mb-2"><div id="bb-boss" class="bb-boss text-6xl">' + x.e + '</div><p class="text-xs font-bold text-red-300">' + esc(x.n) + '</p></div>' +
        '<div class="mb-1 flex justify-between text-[10px] font-bold"><span class="text-red-300">Boss HP (win at ' + bb.cfg.win + ' or less)</span><span class="text-red-300">' + bb.boss + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden mb-2"><div class="bb-fill h-full bg-gradient-to-r from-red-600 to-red-400" style="width:' + bb.boss + '%"></div></div>' +
        '<div class="mb-1 flex justify-between text-[10px] font-bold"><span class="text-emerald-300">Your confidence</span><span class="text-emerald-300">' + bb.me + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden mb-3"><div class="bb-fill h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style="width:' + bb.me + '%"></div></div>';
      if (!bb.ans) {
        h += '<div class="' + CARD + ' mb-3"><p class="text-[10px] text-red-400 font-bold mb-1">' + x.e + ' ATTACK</p><p class="text-sm text-white italic">' + esc(r.atk) + '</p></div><div class="space-y-2">';
        bb.opts.forEach(function (o, k) { h += '<button onclick="PW12.g.bbPick(' + k + ')" class="w-full text-left p-3 ' + BTN + 'bg-slate-800 border border-slate-600 text-slate-100 hover:border-amber-400">' + esc(o[0]) + '</button>'; });
        h += '</div>';
      } else {
        var a = bb.ans, col = a.q === 'b' ? 'emerald' : a.q === 'o' ? 'amber' : 'red', fx = [];
        if (a.dB) fx.push('Boss −' + a.dB + ' HP'); if (a.heal) fx.push('Boss heals +' + a.heal + ' HP'); if (a.dM) fx.push('You −' + a.dM + ' confidence');
        h += '<div class="' + CARD + ' mb-3 border-' + col + '-500/60"><p class="text-xs font-bold text-' + col + '-300 mb-1">' + (a.q === 'b' ? '💥 Critical hit!' : a.q === 'o' ? '👍 Small hit' : '💢 You got hit!') + '</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(a.t) + '</p><p class="text-[11px] text-slate-300 mt-1">' + esc(a.r) + '</p><p class="text-[11px] font-bold text-slate-100 mt-1.5">' + fx.join(' · ') + '</p></div><button onclick="PW12.g.bbNext()" class="w-full py-3 ' + BTN + 'bg-amber-500 text-slate-900">' + (bb.me <= 0 || bb.r >= bb.rounds.length - 1 ? 'See result ▶' : 'Next round ▶') + '</button>';
      }
    } else {
      var X2 = D.BOSSES[bb.b], win = bb.win, nb = bossBeaten(bb.lv);
      h += '<div class="text-center ' + CARD + ' ' + (win ? 'border-emerald-500/60' : 'border-red-500/50') + '"><div class="text-6xl ' + (win ? 'bb-win' : 'bb-lose') + '">' + (win ? '🏆' : X2.e) + '</div><p class="text-lg font-bold text-white mt-1">' + (win ? 'Boss defeated!' : (bb.me <= 0 ? 'You lost your confidence' : 'The boss won this time')) + '</p><p class="text-[11px] text-slate-400 mb-2">Score ' + bb.score + ' / 100 · Boss HP ' + bb.boss + ' (needed ' + bb.cfg.win + ' or less) · Confidence ' + bb.me + '</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(X2.tip) + '</p>' + (win && nb >= 3 && bb.lv < 5 ? '<p class="text-[11px] text-emerald-300 font-bold mt-2">🔓 Level ' + (bb.lv + 1) + ' is open!</p>' : '') + (win && nb < 3 ? '<p class="text-[11px] text-amber-300 mt-2">Bosses beaten in this level: ' + nb + ' / 6. Beat 3 to unlock the next level.</p>' : '') + '</div>' +
        '<div class="flex gap-2 mt-3"><button onclick="PW12.g.bbStart(' + bb.b + ')" class="flex-1 py-2.5 ' + BTN + 'bg-violet-600 text-white">🔁 Try again</button><button onclick="PW12.g.bbBosses()" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">All bosses</button></div><button onclick="PW12.g.x17menu(\'boss\')" class="mt-2 w-full py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">☰ Levels</button>' + resetBox('boss');
    }
    b.innerHTML = h;
  }
  RENDER.boss = renderBoss;
  G.bbLevel = function (n) { if (!open('boss', n)) { toast('Beat 3 bosses in Level ' + (n - 1) + ' first'); return; } bb = { m: 'bosses', lv: n }; renderBoss(); top(); };
  G.bbBosses = function () { bb = { m: 'bosses', lv: bb.lv }; renderBoss(); };
  G.bbStart = function (i) {
    var cfg = BL[bb.lv - 1], rs = D.BOSSES[i].rounds.slice(); if (cfg.shuf) rs = shuffle(rs);
    if (cfg.rage && X.RAGE[i]) rs.push({ atk: X.RAGE[i].atk, o: X.RAGE[i].o, rage: true });
    bb = { m: 'fight', lv: bb.lv, b: i, r: 0, boss: 100, me: 100, ans: null, rounds: rs, cfg: cfg }; bb.opts = shuffle(rs[0].o); renderBoss(); P.fb('tap'); top();
  };
  G.bbPick = function (k) {
    if (bb.ans) return; var o = bb.opts[k], c = bb.cfg, q = o[1];
    var dB = q === 'b' ? c.b : q === 'o' ? c.o : 0, dM = q === 'b' ? 0 : q === 'o' ? c.mo : c.mx, heal = q === 'x' ? (c.hx || 0) : q === 'o' ? (c.ho || 0) : 0;
    bb.boss = clamp(bb.boss - dB + heal); bb.me = Math.max(0, bb.me - dM); bb.ans = { q: q, t: o[0], r: o[2], dB: dB, dM: dM, heal: heal };
    renderBoss(); var bo = $('bb-boss'); if (bo && P.fx() !== 'off') bo.classList.add(q === 'x' ? 'bb-strike' : 'bb-hit');
    P.fb(q === 'b' ? 'hit' : q === 'x' ? 'bad' : 'tap'); if (q === 'x') P.shake(); if (q === 'b') burst(bo, false, '💥');
  };
  G.bbNext = function () {
    if (bb.me <= 0 || bb.r >= bb.rounds.length - 1) {
      var c = bb.cfg; bb.win = bb.boss <= c.win && bb.me > 0; bb.score = Math.round((100 - bb.boss) * .7 + bb.me * .3); bb.m = 'end';
      if (bb.win) {
        var o = all(); o.bossw = o.bossw || {}; var key = bb.lv + '-' + bb.b, old = o.bossw[key]; o.bossw[key] = { score: Math.max(bb.score, old ? old.score : 0), at: iso() }; lsSet('pw_lv17', o);
        var sv = lsGet('pw_boss12', { won: {} }); sv.won = sv.won || {}; var ow = sv.won[bb.b]; sv.won[bb.b] = { score: Math.max(bb.score, ow ? ow.score : 0), at: iso() }; lsSet('pw_boss12', sv);
      }
      renderBoss();
      if (bb.win) { P.fb('good'); burst($('bb-body'), true, '🏆'); P.addXP(25 + bb.lv * 10, 'boss', 'bb17-' + bb.lv + '-' + bb.b); P.coach('Boss defeated! You kept your cool.', 'win'); } else { P.fb('bad'); P.addXP(5, 'try', 'bb17t' + bb.lv + '-' + bb.b); }
      chk(); top(); return;
    }
    bb.r++; bb.ans = null; bb.opts = shuffle(bb.rounds[bb.r].o); renderBoss();
  };

  /* =================== SWIPE CARDS =================== */
  var SL = [
    { n: 8, sec: 0, pass: 60, pool: 'all' }, { n: 10, sec: 12, pass: 70, pool: 'all' }, { n: 10, sec: 8, pass: 70, pool: 'all' },
    { n: 12, sec: 7, pass: 75, pool: 'hard' }, { n: 12, sec: 5, pass: 85, pool: 'hard' }
  ];
  function swDesc(c) { return c.n + ' cards · ' + (c.sec ? c.sec + ' seconds per card' : 'no timer') + (c.pool === 'hard' ? ' · tricky cards' : '') + ' · pass mark ' + c.pass; }
  var sw = { m: 'menu' };
  function renderSwipe() {
    var b = $('sw-body'); if (!b) return; var h = '';
    if (sw.m === 'menu') h = menuHTML('swipe', '🃏', 'Is it a <b class="text-emerald-300">smart move</b> or a <b class="text-red-300">mistake</b>? Swipe right for smart, left for mistake, or use the buttons.', SL, 'PW12.g.swLevel', swDesc);
    else if (sw.m === 'play') {
      var c = sw.deck[sw.i];
      h = '<div class="flex justify-between items-center mb-2">' + backLink('swipe') + '<span class="text-[11px] text-slate-400">Level ' + sw.lv + ' · Card ' + (sw.i + 1) + ' / ' + sw.deck.length + '</span><span class="text-[11px] text-slate-400">Right <b class="text-amber-300" id="sw-sc">' + sw.s + '</b></span></div>' + timerBar(sw.cfg.sec, 'sw-tm') +
        '<div class="sw-zone" data-noswipe><div class="sw-lab sw-l">❌ Mistake</div><div class="sw-lab sw-r">✅ Smart</div><div id="sw-card" class="sw-card" style="touch-action:pan-y"><p>' + esc(c[0]) + '</p></div></div><div id="sw-fb" class="min-h-[64px] mt-2"></div><div class="flex gap-2 mt-2" id="sw-btns"><button onclick="PW12.g.swAns17(false)" class="flex-1 py-3 ' + BTN + 'bg-red-600/80 text-white">❌ Mistake</button><button onclick="PW12.g.swAns17(true)" class="flex-1 py-3 ' + BTN + 'bg-emerald-600/80 text-white">✅ Smart move</button></div>';
    } else {
      var sc = sw.score, ok = sw.ok;
      h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + (ok ? (sc >= 90 ? '🏆' : '👍') : '📚') + '</div><p class="text-[11px] text-slate-400 font-bold mt-1">LEVEL ' + sw.lv + ' · ' + NAMES[sw.lv - 1].toUpperCase() + '</p><p class="text-3xl font-extrabold text-white">' + sc + ' <span class="text-base text-slate-400">/ 100</span></p><p class="text-[11px] text-slate-300">' + sw.s + ' of ' + sw.deck.length + ' right · pass mark ' + sw.cfg.pass + '</p><p class="text-sm font-bold mt-1 ' + (ok ? 'text-emerald-300' : 'text-amber-300') + '">' + (ok ? '✅ Level passed!' : 'Not passed yet. Read the reasons and try again.') + '</p>' + (ok && sw.lv < 5 && !sw.was ? '<p class="text-[11px] text-emerald-300 mt-1">🔓 Level ' + (sw.lv + 1) + ' is open!</p>' : '') + '</div>' + endButtons('swipe', sw.lv, ok, 'PW12.g.swLevel(' + sw.lv + ')', 'PW12.g.swLevel');
    }
    b.innerHTML = h; if (sw.m === 'play') { bindSwipe(); startTimer(sw.cfg.sec, 'sw-tm', function () { G.swAns17(null); }); }
  }
  RENDER.swipe = renderSwipe;
  G.swLevel = function (n) {
    if (!open('swipe', n)) { toast('Pass Level ' + (n - 1) + ' first'); return; } var c = SL[n - 1], pool = c.pool === 'hard' ? X.SWIPE_HARD : D.SWIPE;
    sw = { m: 'play', lv: n, cfg: c, deck: shuffle(pool).slice(0, c.n), i: 0, s: 0, lock: false, was: !!(lvGet('swipe', n) || {}).pass }; renderSwipe(); top();
  };
  function bindSwipe() {
    var el = $('sw-card'); if (!el) return; var x0 = null, dx = 0, zone = el.parentNode;
    el.addEventListener('pointerdown', function (e) { if (sw.lock) return; x0 = e.clientX; dx = 0; el.style.transition = 'none'; try { el.setPointerCapture(e.pointerId); } catch (z) { } });
    el.addEventListener('pointermove', function (e) { if (x0 == null) return; dx = e.clientX - x0; el.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 14 + 'deg)'; zone.setAttribute('data-d', dx > 20 ? 'r' : dx < -20 ? 'l' : ''); });
    var up = function () { if (x0 == null) return; x0 = null; zone.removeAttribute('data-d'); if (Math.abs(dx) > 70) G.swAns17(dx > 0); else { el.style.transition = 'transform .35s cubic-bezier(.2,1.6,.4,1)'; el.style.transform = ''; } };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }
  G.swAns17 = function (smart) {
    if (sw.m !== 'play' || sw.lock) return; sw.lock = true; stopTimer();
    var c = sw.deck[sw.i], late = smart === null, ok = !late && c[1] === smart, el = $('sw-card');
    if (ok) sw.s++;
    if (el) { el.style.transition = 'transform .45s ease-in, opacity .45s'; el.style.transform = 'translateX(' + (smart === false ? -160 : 160) + 'px) rotate(' + (smart === false ? -18 : 18) + 'deg)'; el.style.opacity = '0'; el.classList.add(ok ? 'sw-ok' : 'sw-no'); }
    var fb = $('sw-fb'); if (fb) fb.innerHTML = '<div class="p-2.5 rounded-xl border ' + (ok ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10') + ' sw-in"><p class="text-xs font-bold ' + (ok ? 'text-emerald-300' : 'text-red-300') + '">' + (late ? '⏰ Time is up' : ok ? '✔ Correct' : '✖ Not quite') + ': it is ' + (c[1] ? 'a smart move' : 'a mistake') + '.</p><p class="text-[11px] text-slate-200 mt-1">' + esc(c[2]) + '</p></div>';
    var sc = $('sw-sc'); if (sc) { sc.textContent = sw.s; pop(sc); }
    var btn = $('sw-btns'); if (btn) btn.innerHTML = '<button onclick="PW12.g.swNext17()" class="w-full py-3 ' + BTN + 'bg-amber-500 text-slate-900">' + (sw.i >= sw.deck.length - 1 ? 'See score ▶' : 'Next card ▶') + '</button>';
    P.fb(ok ? 'good' : 'bad');
  };
  G.swNext17 = function () {
    if (sw.m !== 'play') return;
    if (sw.i >= sw.deck.length - 1) {
      var n = sw.deck.length, score = Math.round(sw.s / n * 100), ok = score >= sw.cfg.pass; sw.score = score; sw.ok = ok; sw.m = 'end';
      lvPut('swipe', sw.lv, score, ok);
      var s = lsGet('pw_swipe', { best: 0 }), t10 = Math.round(score / 10); if (t10 > (s.best || 0)) { s.best = t10; lsSet('pw_swipe', s); }
      if (sw.lv >= 2 && score >= 80) flag('swipe8', 1);
      renderSwipe(); top();
      if (ok) { P.addXP(6 + sw.lv * 3, 'swipe', 'sw17-' + sw.lv); burst($('sw-body'), true, '🏆'); P.coach('Fast and smart!', 'win'); } else P.addXP(2, 'swipe', 'sw17t' + sw.lv);
      chk(); return;
    }
    sw.i++; sw.lock = false; renderSwipe();
  };

  /* =================== SPOT THE RED FLAG =================== */
  var FL = [
    { n: 4, hint: 1, pass: 60, pool: 'easy', fp: 5 }, { n: 5, hint: 1, pass: 65, pool: 'old', fp: 5 }, { n: 6, hint: 0, pass: 70, pool: 'old', fp: 5 },
    { n: 6, hint: 0, pass: 75, pool: 'hard', fp: 5 }, { n: 7, hint: 0, pass: 80, pool: 'hard', fp: 8 }
  ];
  function flDesc(c) { return c.n + ' chats · ' + (c.hint ? 'you are told how many flags to find' : 'the number of flags is a secret') + (c.pool === 'hard' ? ' · longer, tricky chats' : '') + (c.fp > 5 ? ' · a wrong tap costs more' : '') + ' · pass mark ' + c.pass; }
  var fl = { m: 'menu' };
  function nFlags(s) { var k = 0; s.lines.forEach(function (l) { if (l[2]) k++; }); return k; }
  function renderFlags() {
    var b = $('fl-body'); if (!b) return; var h = '';
    if (fl.m === 'menu') h = menuHTML('flags', '🚩', 'Read each chat or message. Tap the lines that are <b class="text-red-300">red flags</b>. Some lines are fine.', FL, 'PW12.g.flLevel', flDesc);
    else if (fl.m === 'play') {
      var s = fl.deck[fl.i], k = nFlags(s);
      h = '<div class="flex justify-between items-center mb-2">' + backLink('flags') + '<span class="text-[11px] text-slate-400">Level ' + fl.lv + ' · Round ' + (fl.i + 1) + ' / ' + fl.deck.length + '</span><span class="text-[11px] text-slate-400">Points <b class="text-amber-300">' + fl.pts + '</b></span></div><p class="text-xs font-bold text-white mb-1">' + esc(s.t) + '</p><p class="text-[11px] text-amber-300 mb-2">' + (fl.cfg.hint ? '🔎 Find ' + k + ' red flag' + (k > 1 ? 's' : '') + ' in this chat.' : '🔎 The number of red flags is a secret.') + '</p><div class="space-y-1.5">';
      s.lines.forEach(function (l, i) {
        var st = fl.rev ? (l[2] ? (fl.pick[i] ? 'border-emerald-500 bg-emerald-500/15' : 'border-red-500 bg-red-500/15 fl-miss') : (fl.pick[i] ? 'border-amber-500 bg-amber-500/15' : 'border-slate-700')) : (fl.pick[i] ? 'border-red-400 bg-red-500/15' : 'border-slate-700');
        h += '<button ' + (fl.rev ? 'disabled' : 'onclick="PW12.g.flTap17(' + i + ')"') + ' class="w-full text-left p-2.5 rounded-xl border text-xs text-slate-100 flex gap-2 items-start ' + st + '" aria-pressed="' + !!fl.pick[i] + '"><span class="text-lg leading-none">' + l[0] + '</span><span class="flex-1">' + esc(l[1]) + '</span>' + (fl.rev ? (l[2] ? '<span title="red flag">🚩</span>' : '') : (fl.pick[i] ? '<span>🚩</span>' : '')) + '</button>';
      });
      h += '</div>';
      if (!fl.rev) h += '<button onclick="PW12.g.flCheck17()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">Check my answer</button>';
      else h += '<div class="mt-3 p-2.5 rounded-xl border border-slate-600 bg-slate-900/70 sw-in"><p class="text-xs font-bold text-amber-300">' + fl.msg + '</p><p class="text-[11px] text-slate-200 mt-1">💡 ' + esc(s.why) + '</p></div><button onclick="PW12.g.flNext17()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-violet-600 text-white">' + (fl.i >= fl.deck.length - 1 ? 'See result ▶' : 'Next round ▶') + '</button>';
    } else {
      var ok = fl.ok;
      h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + (ok ? '🏆' : '🕵️') + '</div><p class="text-[11px] text-slate-400 font-bold mt-1">LEVEL ' + fl.lv + ' · ' + NAMES[fl.lv - 1].toUpperCase() + '</p><p class="text-3xl font-extrabold text-white">' + fl.score + ' <span class="text-base text-slate-400">/ 100</span></p><p class="text-[11px] text-slate-300">' + fl.pts + ' of ' + fl.max + ' points · pass mark ' + fl.cfg.pass + '</p><p class="text-sm font-bold mt-1 ' + (ok ? 'text-emerald-300' : 'text-amber-300') + '">' + (ok ? '✅ Level passed! Sharp eyes.' : 'Not passed yet. Train your eyes and try again.') + '</p>' + (ok && fl.lv < 5 && !fl.was ? '<p class="text-[11px] text-emerald-300 mt-1">🔓 Level ' + (fl.lv + 1) + ' is open!</p>' : '') + '</div>' + endButtons('flags', fl.lv, ok, 'PW12.g.flLevel(' + fl.lv + ')', 'PW12.g.flLevel');
    }
    b.innerHTML = h;
  }
  RENDER.flags = renderFlags;
  G.flLevel = function (n) {
    if (!open('flags', n)) { toast('Pass Level ' + (n - 1) + ' first'); return; } var c = FL[n - 1], pool = c.pool === 'hard' ? X.FLAGS_HARD : c.pool === 'easy' ? D.FLAGS.filter(function (s) { return nFlags(s) === 1; }) : D.FLAGS;
    var deck = shuffle(pool).slice(0, c.n), mx = 0; deck.forEach(function (s) { mx += nFlags(s) * 10; });
    fl = { m: 'play', lv: n, cfg: c, deck: deck, i: 0, pts: 0, max: mx, pick: {}, rev: false, was: !!(lvGet('flags', n) || {}).pass }; renderFlags(); top();
  };
  G.flTap17 = function (i) { if (fl.rev) return; fl.pick[i] = !fl.pick[i]; P.fb('tap'); renderFlags(); };
  G.flCheck17 = function () {
    var s = fl.deck[fl.i], got = 0, wrong = 0, miss = 0;
    s.lines.forEach(function (l, i) { if (l[2] && fl.pick[i]) got++; else if (!l[2] && fl.pick[i]) wrong++; else if (l[2] && !fl.pick[i]) miss++; });
    var p = Math.max(0, got * 10 - wrong * fl.cfg.fp - miss * 5); fl.pts += p; fl.rev = true;
    fl.msg = wrong + miss === 0 ? '✔ Perfect! +' + p : (got ? 'Partly right. +' + p + (wrong ? ' (' + wrong + ' wrong tap' + (wrong > 1 ? 's' : '') + ')' : '') + (miss ? ' (' + miss + ' missed)' : '') : 'You missed it. +0');
    renderFlags(); P.fb(wrong + miss === 0 ? 'good' : 'bad');
  };
  G.flNext17 = function () {
    if (fl.i >= fl.deck.length - 1) {
      var score = Math.round(fl.pts / fl.max * 100), ok = score >= fl.cfg.pass; fl.score = score; fl.ok = ok; fl.m = 'end'; lvPut('flags', fl.lv, score, ok); renderFlags(); top();
      if (ok) { P.addXP(6 + fl.lv * 3, 'flags', 'fl17-' + fl.lv); burst($('fl-body'), true, '🚩'); } else P.addXP(2, 'flags', 'fl17t' + fl.lv); chk(); return;
    }
    fl.i++; fl.pick = {}; fl.rev = false; renderFlags();
  };

  /* =================== MESSAGE MAKEOVER =================== */
  var ML = [
    { n: 5, pass: 60, pool: 'old' }, { n: 6, pass: 65, pool: 'old' }, { n: 5, pass: 70, pool: 'A' }, { n: 6, pass: 75, pool: 'B' }, { n: 7, pass: 80, pool: 'mix' }
  ];
  function mkDesc(c) { return c.n + ' rounds · ' + (c.pool === 'old' ? 'clear good and bad answers' : c.pool === 'A' ? 'all answers sound polite. Find the best one' : c.pool === 'B' ? '4 answers and they are close. Find the best one' : 'the hardest rounds, 4 close answers') + ' · pass mark ' + c.pass + ' average'; }
  var mk = { m: 'menu' };
  function face(s) { return s >= 85 ? '😄' : s >= 60 ? '🙂' : s >= 40 ? '😐' : s >= 25 ? '😟' : '😡'; }
  function renderMake() {
    var b = $('mk-body'); if (!b) return; var h = '';
    if (mk.m === 'menu') h = menuHTML('make', '✍️', 'A risky message needs a makeover. Pick the version that is calm and clear. Watch the Calm-o-meter.', ML, 'PW12.g.mkLevel', mkDesc);
    else if (mk.m === 'play') {
      var c = mk.deck[mk.i];
      h = '<div class="flex justify-between items-center mb-2">' + backLink('make') + '<span class="text-[11px] text-slate-400">Level ' + mk.lv + ' · Round ' + (mk.i + 1) + ' / ' + mk.deck.length + '</span><span class="text-[11px] text-slate-400">Total <b class="text-amber-300">' + mk.tot + '</b></span></div><p class="text-[11px] text-slate-300 mb-2">📍 ' + esc(c.s) + '</p><div class="p-2.5 rounded-xl border border-red-500/40 bg-red-500/10 mb-3"><p class="text-[10px] font-bold text-red-300">RISKY VERSION</p><p class="text-xs text-slate-100 italic">' + esc(c.bad) + '</p></div>' +
        '<div class="mk-meter mb-3"><span id="mk-face" class="text-3xl">' + (mk.pick == null ? '😐' : face(mk.score)) + '</span><div class="flex-1"><div class="flex justify-between text-[10px] font-bold text-slate-300"><span>Calm-o-meter</span><span id="mk-n">' + (mk.pick == null ? 0 : mk.score) + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden"><div id="mk-bar" class="mk-bar h-full" style="width:' + (mk.pick == null ? 0 : mk.score) + '%;background:' + (mk.pick == null ? '#64748b' : mk.score >= 70 ? '#10b981' : mk.score >= 45 ? '#f59e0b' : '#ef4444') + '"></div></div></div></div><p class="text-[11px] font-bold text-amber-400 mb-1.5">Pick the calm version:</p><div class="space-y-2">';
      mk.opts.forEach(function (o, k) { var st = mk.pick == null ? 'border-slate-600 hover:border-amber-400' : (k === mk.pick ? (o[1] >= 70 ? 'border-emerald-500 bg-emerald-500/10' : 'border-amber-500 bg-amber-500/10') : 'border-slate-700 opacity-70'); h += '<button ' + (mk.pick == null ? 'onclick="PW12.g.mkPick17(' + k + ')"' : 'disabled') + ' class="w-full text-left p-3 ' + BTN + 'bg-slate-900/70 border text-slate-100 ' + st + '">' + esc(o[0]) + '</button>'; });
      h += '</div>';
      if (mk.pick != null) { var best = mk.opts.slice().sort(function (a, z) { return z[1] - a[1]; })[0], o = mk.opts[mk.pick]; h += '<div class="mt-3 p-2.5 rounded-xl border border-slate-600 bg-slate-900/70 sw-in"><p class="text-xs font-bold text-amber-300">Calm score: ' + o[1] + ' / 100</p><p class="text-[11px] text-slate-200 mt-1">💡 ' + esc(o[2]) + '</p>' + (o !== best ? '<p class="text-[11px] text-emerald-300 mt-1.5"><b>Best version:</b> ' + esc(best[0]) + '</p><p class="text-[11px] text-slate-300">' + esc(best[2]) + '</p>' : '') + '</div><button onclick="PW12.g.mkNext17()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">' + (mk.i >= mk.deck.length - 1 ? 'See result ▶' : 'Next ▶') + '</button>'; }
    } else {
      var ok = mk.ok;
      h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + face(mk.score) + '</div><p class="text-[11px] text-slate-400 font-bold mt-1">LEVEL ' + mk.lv + ' · ' + NAMES[mk.lv - 1].toUpperCase() + '</p><p class="text-3xl font-extrabold text-white">' + mk.score + ' <span class="text-base text-slate-400">/ 100</span></p><p class="text-[11px] text-slate-300">Average calm · pass mark ' + mk.cfg.pass + '</p><p class="text-sm font-bold mt-1 ' + (ok ? 'text-emerald-300' : 'text-amber-300') + '">' + (ok ? '✅ Level passed! Your words keep the peace.' : 'Not passed yet. Read the best versions and try again.') + '</p>' + (ok && mk.lv < 5 && !mk.was ? '<p class="text-[11px] text-emerald-300 mt-1">🔓 Level ' + (mk.lv + 1) + ' is open!</p>' : '') + '</div>' + endButtons('make', mk.lv, ok, 'PW12.g.mkLevel(' + mk.lv + ')', 'PW12.g.mkLevel');
    }
    b.innerHTML = h;
  }
  RENDER.make = renderMake;
  G.mkLevel = function (n) {
    if (!open('make', n)) { toast('Pass Level ' + (n - 1) + ' first'); return; } var c = ML[n - 1], pool = c.pool === 'old' ? D.MAKEOVER : c.pool === 'A' ? X.MAKE_A : c.pool === 'B' ? X.MAKE_B : X.MAKE_B.concat(X.MAKE_A.slice(0, 3));
    mk = { m: 'play', lv: n, cfg: c, deck: shuffle(pool).slice(0, c.n), i: 0, tot: 0, pick: null, was: !!(lvGet('make', n) || {}).pass }; mk.opts = shuffle(mk.deck[0].opts); renderMake(); top();
  };
  G.mkPick17 = function (k) {
    if (mk.pick != null) return; var o = mk.opts[k]; mk.pick = k; mk.score = o[1]; mk.tot += o[1]; renderMake();
    var bar = $('mk-bar'); if (bar && P.fx() !== 'off') { bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = 'width 1s cubic-bezier(.2,.9,.3,1)'; bar.style.width = o[1] + '%'; }
    var f = $('mk-face'); if (f) pop(f); P.fb(o[1] >= 70 ? 'good' : 'bad'); if (o[1] >= 90) burst(f, false, '✨');
  };
  G.mkNext17 = function () {
    if (mk.i >= mk.deck.length - 1) {
      var score = Math.round(mk.tot / mk.deck.length), ok = score >= mk.cfg.pass; mk.score = score; mk.ok = ok; mk.m = 'end'; lvPut('make', mk.lv, score, ok); renderMake(); top();
      if (ok) { P.addXP(6 + mk.lv * 3, 'makeover', 'mk17-' + mk.lv); burst($('mk-body'), true, '✨'); } else P.addXP(2, 'makeover', 'mk17t' + mk.lv); chk(); return;
    }
    mk.i++; mk.pick = null; mk.opts = shuffle(mk.deck[mk.i].opts); renderMake();
  };

  /* =================== BUZZWORD BINGO =================== */
  var BNL = [
    { n: 3, lives: 3, sec: 0 }, { n: 4, lives: 3, sec: 0 }, { n: 4, lives: 3, sec: 10 }, { n: 5, lives: 2, sec: 8 }, { n: 5, lives: 2, sec: 5, shuf: 1 }
  ];
  function bnDesc(c) { return c.n + '×' + c.n + ' card · ' + c.lives + ' lives · ' + (c.sec ? c.sec + ' seconds per word' : 'no timer') + (c.shuf ? ' · the words move after each call' : '') + ' · finish all calls to pass'; }
  var bn = { m: 'menu' }, origBingo = null;
  function bnLines(n, hit) {
    var L = [], i, j, r; for (i = 0; i < n; i++) { r = [], j = 0; for (; j < n; j++) r.push(i * n + j); L.push(r); r = []; for (j = 0; j < n; j++) r.push(j * n + i); L.push(r); }
    r = []; for (i = 0; i < n; i++) r.push(i * n + i); L.push(r); r = []; for (i = 0; i < n; i++) r.push(i * n + (n - 1 - i)); L.push(r);
    return L.filter(function (l) { return l.every(function (p) { return hit[bn.cells[p]]; }); });
  }
  function renderBingo() {
    var b = $('bingo-body'), tp = $('bn17-top'); if (!b) return; var h = ''; if (tp) tp.innerHTML = '';
    if (bn.m === 'menu') {
      h = menuHTML('bingo', '🎯', 'Hear the meaning. Tap the right buzzword on your card. Wrong or late answers cost a life. Finish with a life left to pass.', BNL, 'PW12.g.bnLevel', bnDesc, '<button onclick="PW12.g.bnClassic()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">🎯 Free card (classic: tap words you hear at work)</button>');
    } else if (bn.m === 'classic') {
      if (tp) tp.innerHTML = backLink('bingo').replace('text-[11px]', 'text-[11px] mb-2'); if (origBingo) origBingo(); return;
    } else if (bn.m === 'play') {
      var w = bn.words, call = w[bn.order[bn.i]], lines = bn.cfg.shuf ? [] : bnLines(bn.n, bn.hit), inL = {}; lines.forEach(function (l) { l.forEach(function (p) { inL[bn.cells[p]] = 1; }); });
      var hearts = ''; for (var k = 0; k < bn.cfg.lives; k++) hearts += k < bn.lives ? '❤️' : '🖤';
      h = '<div class="flex justify-between items-center mb-2">' + backLink('bingo') + '<span class="text-[11px] text-slate-400">Level ' + bn.lv + ' · Call ' + (bn.i + 1) + ' / ' + bn.order.length + '</span><span class="text-sm" aria-label="Lives left ' + bn.lives + '">' + hearts + '</span></div>' + timerBar(bn.cfg.sec, 'bn-tm') +
        '<div class="' + CARD + ' text-center mb-2"><p class="text-[10px] font-bold text-amber-400">📣 WHICH WORD MEANS…</p><p class="text-sm text-white font-bold leading-snug mt-0.5">' + esc(call[1]) + '</p></div><div id="bn17-last" class="min-h-[34px] text-[11px] text-center mb-2 ' + (bn.lastOk ? 'text-emerald-300' : 'text-rose-300') + '">' + (bn.last || '') + '</div><div class="bingo" style="grid-template-columns:repeat(' + bn.n + ',1fr)">';
      bn.cells.forEach(function (wi) { var on = bn.hit[wi], ms = bn.miss[wi]; h += '<button onclick="PW12.g.bnTap(' + wi + ')" class="bn' + (on ? ' bn-on' : '') + (inL[wi] ? ' bn-win' : '') + '" ' + (on || ms ? 'disabled' : '') + ' style="' + (ms ? 'background:#7f1d1d;border-color:#ef4444;opacity:.8;' : '') + (bn.n === 5 ? 'font-size:9px' : bn.n === 3 ? 'font-size:12px' : '') + '">' + esc(w[wi][0]) + '</button>'; });
      h += '</div>';
    } else {
      var ok = bn.ok;
      h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + (ok ? '🏆' : '📚') + '</div><p class="text-[11px] text-slate-400 font-bold mt-1">LEVEL ' + bn.lv + ' · ' + NAMES[bn.lv - 1].toUpperCase() + '</p><p class="text-3xl font-extrabold text-white">' + bn.score + ' <span class="text-base text-slate-400">/ 100</span></p><p class="text-[11px] text-slate-300">' + bn.right + ' of ' + bn.order.length + ' words right' + (bn.bingo ? ' · 🎯 BINGO line made' : '') + '</p><p class="text-sm font-bold mt-1 ' + (ok ? 'text-emerald-300' : 'text-amber-300') + '">' + (ok ? '✅ Level passed! You speak office talk.' : 'You ran out of lives. Try again.') + '</p>' + (ok && bn.lv < 5 && !bn.was ? '<p class="text-[11px] text-emerald-300 mt-1">🔓 Level ' + (bn.lv + 1) + ' is open!</p>' : '') + '</div>' + endButtons('bingo', bn.lv, ok, 'PW12.g.bnLevel(' + bn.lv + ')', 'PW12.g.bnLevel');
    }
    b.innerHTML = h;
    if (bn.m === 'play') startTimer(bn.cfg.sec, 'bn-tm', function () { G.bnAnswer(-1); });
  }
  RENDER.bingo = renderBingo;
  G.bnClassic = function () { stopTimer(); bn = { m: 'classic' }; renderBingo(); top(); };
  G.bnLevel = function (n) {
    if (!open('bingo', n)) { toast('Pass Level ' + (n - 1) + ' first'); return; } var c = BNL[n - 1], tot = c.n * c.n, words = shuffle(D.BINGO).slice(0, tot), idx = [], i; for (i = 0; i < tot; i++) idx.push(i);
    bn = { m: 'play', lv: n, cfg: c, n: c.n, words: words, cells: shuffle(idx), order: shuffle(idx), i: 0, hit: {}, miss: {}, lives: c.lives, right: 0, last: '', lastOk: true, bingo: false, was: !!(lvGet('bingo', n) || {}).pass }; renderBingo(); top();
  };
  G.bnTap = function (wi) { G.bnAnswer(wi); };
  G.bnAnswer = function (wi) {
    if (bn.m !== 'play') return; stopTimer(); var cur = bn.order[bn.i], w = bn.words[cur], ok = wi === cur;
    if (ok) { bn.hit[cur] = 1; bn.right++; bn.last = '✔ ' + esc(w[0]) + ': ' + esc(w[1]); bn.lastOk = true; P.fb('good'); }
    else { bn.lives--; bn.last = (wi === -1 ? '⏰ Time is up. ' : '✖ Not that one. ') + 'It was <b>' + esc(w[0]) + '</b>: ' + esc(w[1]); bn.lastOk = false; bn.miss[cur] = 1; P.fb('bad'); if (P.fx() === 'full') P.shake(); }
    if (ok && !bn.cfg.shuf && !bn.bingo && bnLines(bn.n, bn.hit).length) { bn.bingo = true; flag('bingo', 1); toast('🎯 BINGO!'); P.addXP(10, 'bingo', 'bn17line'); burst($('bingo-body'), true, '🎯'); }
    if (bn.lives <= 0 || bn.i >= bn.order.length - 1) { finishBingo(); return; }
    bn.i++; if (bn.cfg.shuf) bn.cells = shuffle(bn.cells); renderBingo();
  };
  function finishBingo() {
    var tot = bn.order.length, score = Math.round(bn.right / tot * 100), ok = bn.lives > 0; bn.score = score; bn.ok = ok; bn.m = 'end'; lvPut('bingo', bn.lv, score, ok); renderBingo(); top();
    if (ok) { P.addXP(6 + bn.lv * 3, 'bingo', 'bn17-' + bn.lv); burst($('bingo-body'), true, '🎯'); } else P.addXP(2, 'bingo', 'bn17t' + bn.lv); chk();
  }

  /* =================== OFFICE POLITICS GAME: reset button only =================== */
  function gmInner() { return resetBox('gm'); }
  function gmBox() {
    var b = $('game-body'); if (!b || $('gm-rs17')) return; var t = b.textContent || '';
    if (t.indexOf('How it works') < 0 && t.indexOf('COMPLETE') < 0) return;
    var d = document.createElement('div'); d.id = 'gm-rs17'; d.innerHTML = gmInner(); b.appendChild(d);
  }
  RENDER.gm = function () { var d = $('gm-rs17'); if (d) d.innerHTML = gmInner(); };

  /* =================== wiring =================== */
  function reg(id, g, fn, first) { P.onPage(id, function () { stopTimer(); first(); fn(); }); }
  function init() {
    origBingo = P.pages['step-bingo'];
    var bb0 = $('bingo-body'); if (bb0 && !$('bn17-top')) { var t = document.createElement('div'); t.id = 'bn17-top'; bb0.parentNode.insertBefore(t, bb0); }
    reg('step-boss12', 'boss', renderBoss, function () { bb = { m: 'menu' }; });
    reg('step-swipe', 'swipe', renderSwipe, function () { sw = { m: 'menu' }; });
    reg('step-flags', 'flags', renderFlags, function () { fl = { m: 'menu' }; });
    reg('step-makeover', 'make', renderMake, function () { mk = { m: 'menu' }; });
    reg('step-bingo', 'bingo', renderBingo, function () { bn = { m: 'menu' }; });
    var gb = $('game-body'); if (gb && window.MutationObserver) new MutationObserver(function () { gmBox(); }).observe(gb, { childList: true });
    var _h = G.home; G.home = function () { stopTimer(); bb = { m: 'menu' }; sw = { m: 'menu' }; fl = { m: 'menu' }; mk = { m: 'menu' }; bn = { m: 'menu' }; return _h.apply(this, arguments); };
    gmBox();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  window.PW17G = { levels: { boss: BL, swipe: SL, flags: FL, make: ML, bingo: BNL }, all: all };
})();
