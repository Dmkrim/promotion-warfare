/* Promotion Warfare V12 games and tools: Boss Battles, Swipe Cards, Daily Spin, Red Flags, Message Makeover, Buzzword Bingo,
   Mood Check-in, Focus Timer, Review Countdown, Intro Tour, Coach mascot. */
(function () {
  'use strict';
  var P = window.PW12, D = P, $ = function (id) { return document.getElementById(id); };
  var esc = P.esc, lsGet = P.lsGet, lsSet = P.lsSet, toast = P.toast, iso = P.isoDay, shuffle = P.shuffle;
  var BTN = 'rounded-xl text-xs font-bold active:scale-95 transition ';
  var CARD = 'p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60';
  var G = P.g = {};
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function chk() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function burst(el, big, e) { if (P.fx() !== 'full' || !window.pwBurst) return; try { var r = (el || document.body).getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, Math.max(60, r.top + 40), !!big, e || '🌟'); } catch (x) { } }
  function pop(el) { if (el && P.fx() !== 'off') { el.classList.remove('v12-pop'); void el.offsetWidth; el.classList.add('v12-pop'); } }
  function back(label) { return '<button onclick="PW12.g.home(this)" class="mt-3 w-full py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">' + (label || '↩ Back to the list') + '</button>'; }

  /* ================= badges ================= */
  var BADGES = [
    { id: 'bossw', e: '👹', n: 'Boss Slayer', h: 'Beat one boss in Boss Battles.' }, { id: 'bossall', e: '🐉', n: 'Boss Hunter', h: 'Beat all 6 bosses.' },
    { id: 'spin3', e: '🎡', n: 'Lucky Spinner', h: 'Spin the daily wheel on 3 different days.' }, { id: 'bingo', e: '🎯', n: 'Bingo Master', h: 'Get a BINGO in Buzzword Bingo.' },
    { id: 'mood3', e: '😊', n: 'Check-in Pro', h: 'Do 3 mood check-ins.' }, { id: 'focus1', e: '⏱️', n: 'Deep Focus', h: 'Finish one focus session.' }, { id: 'swipe8', e: '👆', n: 'Quick Thinker', h: 'Score 8 or more in Swipe Cards.' }
  ];
  (function () { var W = window.PW6 || (window.PW6 = {}); W.BADGES = (W.BADGES || []).concat(BADGES); })();
  var _eb = window.pwExtraBadges;
  window.pwExtraBadges = function () {
    var o = _eb ? _eb() : {}, bo = lsGet('pw_boss12', { won: {} }), sp = lsGet('pw_spin', { days: {} });
    o.bossw = Object.keys(bo.won || {}).length >= 1; o.bossall = Object.keys(bo.won || {}).length >= D.BOSSES.length; o.spin3 = Object.keys(sp.days || {}).length >= 3;
    o.bingo = !!flag('bingo'); o.mood3 = lsGet('pw_mood', []).length >= 3; o.focus1 = (lsGet('pw_focus', { n: 0 }).n || 0) >= 1; o.swipe8 = !!flag('swipe8'); return o;
  };

  /* ================= Boss Battles ================= */
  var bb = { m: 'pick' };
  function bossSaved() { var b = lsGet('pw_boss12', { won: {} }); b.won = b.won || {}; return b; }
  function ring(p, c, e) { var C = 2 * Math.PI * 26; return '<svg viewBox="0 0 64 64" width="58" height="58" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="#334155" stroke-width="6"/><circle class="bb-ring" cx="32" cy="32" r="26" fill="none" stroke="' + c + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - p / 100)).toFixed(1) + '" transform="rotate(-90 32 32)"/><text x="32" y="41" text-anchor="middle" font-size="26">' + e + '</text></svg>'; }
  function renderBoss() {
    var b = $('bb-body'); if (!b) return; var sv = bossSaved(), h = '';
    if (bb.m === 'pick') {
      h += '<p class="text-[11px] text-slate-400 mb-3">Pick a boss. Choose the best reply in 4 rounds. Smart replies hurt the boss. Weak replies hurt you. Beat all 6 to earn a badge.</p><div class="space-y-2">';
      D.BOSSES.forEach(function (x, i) { var w = sv.won[i]; h += '<button onclick="PW12.g.bossStart(' + i + ')" class="w-full text-left p-3 ' + BTN + 'bg-slate-900/70 border ' + (w ? 'border-emerald-500/50' : 'border-slate-700/60') + ' flex items-center gap-3">' + ring(w ? w.score : 0, w ? '#34d399' : '#f87171', x.e) + '<span><b class="text-sm text-white block">' + esc(x.n) + '</b><span class="text-[11px] text-slate-400 font-normal block">' + esc(x.intro) + '</span><span class="text-[10px] ' + (w ? 'text-emerald-400' : 'text-slate-500') + '">' + (w ? '✔ Defeated · best ' + w.score : 'Not defeated yet') + '</span></span></button>'; });
      h += '</div>';
    } else if (bb.m === 'fight') {
      var x = D.BOSSES[bb.b], r = x.rounds[bb.r];
      h += '<div class="flex items-center justify-between mb-2"><span class="text-[11px] text-slate-400">Round ' + (bb.r + 1) + ' of ' + x.rounds.length + '</span><button onclick="PW12.g.home(this)" class="text-[11px] text-slate-400 underline">Leave</button></div>' +
        '<div class="text-center mb-2"><div id="bb-boss" class="bb-boss text-6xl">' + x.e + '</div><p class="text-xs font-bold text-red-300">' + esc(x.n) + '</p></div>' +
        '<div class="mb-1 flex justify-between text-[10px] font-bold"><span class="text-red-300">Boss HP</span><span id="bb-bn" class="text-red-300">' + bb.boss + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden mb-2"><div id="bb-bf" class="bb-fill h-full bg-gradient-to-r from-red-600 to-red-400" style="width:' + bb.boss + '%"></div></div>' +
        '<div class="mb-1 flex justify-between text-[10px] font-bold"><span class="text-emerald-300">Your confidence</span><span id="bb-mn" class="text-emerald-300">' + bb.me + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden mb-3"><div id="bb-mf" class="bb-fill h-full bg-gradient-to-r from-emerald-600 to-emerald-400" style="width:' + bb.me + '%"></div></div>';
      if (!bb.ans) {
        h += '<div class="' + CARD + ' mb-3 bb-atk"><p class="text-[10px] text-red-400 font-bold mb-1">' + x.e + ' ATTACK</p><p class="text-sm text-white italic">' + esc(r.atk) + '</p></div><div class="space-y-2">';
        bb.opts.forEach(function (o, k) { h += '<button onclick="PW12.g.bossPick(' + k + ')" class="w-full text-left p-3 ' + BTN + 'bg-slate-800 border border-slate-600 text-slate-100 hover:border-amber-400">' + esc(o[0]) + '</button>'; });
        h += '</div>';
      } else {
        var a = bb.ans, col = a.q === 'b' ? 'emerald' : a.q === 'o' ? 'amber' : 'red';
        h += '<div class="' + CARD + ' mb-3 border-' + col + '-500/60"><p class="text-xs font-bold text-' + col + '-300 mb-1">' + (a.q === 'b' ? '💥 Critical hit!' : a.q === 'o' ? '👍 Small hit' : '💢 You got hit!') + '</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(a.t) + '</p><p class="text-[11px] text-slate-300 mt-1">' + esc(a.r) + '</p></div><button onclick="PW12.g.bossNext()" class="w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">' + (bb.r >= x.rounds.length - 1 ? 'See result' : 'Next round ▶') + '</button>';
      }
    } else {
      var X = D.BOSSES[bb.b], win = bb.win, sc = bb.score;
      h += '<div class="text-center ' + CARD + ' ' + (win ? 'border-emerald-500/60' : 'border-red-500/50') + '"><div class="text-6xl ' + (win ? 'bb-win' : 'bb-lose') + '">' + (win ? '🏆' : X.e) + '</div><p class="text-lg font-bold text-white mt-1">' + (win ? 'Boss defeated!' : 'The boss won this time') + '</p><p class="text-[11px] text-slate-400 mb-2">Score ' + sc + ' / 100 · Boss HP ' + bb.boss + ' · Your confidence ' + bb.me + '</p><div class="flex justify-center mb-2">' + ring(sc, win ? '#34d399' : '#f87171', win ? '🏅' : '🔁') + '</div><p class="text-[11px] text-amber-300 leading-snug">💡 ' + esc(X.tip) + '</p></div>' +
        '<div class="flex gap-2 mt-3"><button onclick="PW12.g.bossStart(' + bb.b + ')" class="flex-1 py-2.5 ' + BTN + 'bg-violet-600 text-white">Try again</button><button onclick="PW12.g.home(this)" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">All bosses</button></div>';
    }
    b.innerHTML = h;
  }
  G.bossStart = function (i) { bb = { m: 'fight', b: i, r: 0, boss: 100, me: 100, ans: null }; bb.opts = shuffle(D.BOSSES[i].rounds[0].o); renderBoss(); P.fb('tap'); };
  G.bossPick = function (k) {
    var o = bb.opts[k], x = D.BOSSES[bb.b]; bb.ans = { q: o[1], t: o[0], r: o[2] };
    var dB = o[1] === 'b' ? 25 : o[1] === 'o' ? 10 : 0, dM = o[1] === 'b' ? 0 : o[1] === 'o' ? 10 : 25; bb.boss = Math.max(0, bb.boss - dB); bb.me = Math.max(0, bb.me - dM);
    renderBoss(); var bo = $('bb-boss'); if (bo && P.fx() !== 'off') { bo.classList.add(o[1] === 'x' ? 'bb-strike' : 'bb-hit'); }
    P.fb(o[1] === 'b' ? 'hit' : o[1] === 'x' ? 'bad' : 'tap'); if (o[1] === 'x') P.shake(); if (o[1] === 'b') burst(bo, false, '💥');
    if (P.fx() !== 'off') { var f1 = $('bb-bf'), f2 = $('bb-mf'); if (f1) f1.style.transition = 'none'; if (f2) f2.style.transition = 'none'; }
  };
  G.bossNext = function () {
    var x = D.BOSSES[bb.b];
    if (bb.r >= x.rounds.length - 1) {
      bb.win = bb.boss <= 30 && bb.me > 0; bb.score = Math.round((100 - bb.boss) * .7 + bb.me * .3); bb.m = 'end';
      var sv = bossSaved(); if (bb.win) { var old = sv.won[bb.b]; sv.won[bb.b] = { score: Math.max(bb.score, old ? old.score : 0), at: iso() }; lsSet('pw_boss12', sv); }
      renderBoss(); if (bb.win) { P.fb('good'); burst($('bb-body'), true, '🏆'); P.addXP(40, 'boss', 'boss' + bb.b); P.coach('Boss defeated! You kept your cool.', 'win'); } else { P.fb('bad'); P.addXP(5, 'try', 'bossTry' + bb.b); }
      chk(); return;
    }
    bb.r++; bb.ans = null; bb.opts = shuffle(x.rounds[bb.r].o); renderBoss();
  };

  /* ================= Swipe cards ================= */
  var sw = { m: 'start' };
  function renderSwipe() {
    var b = $('sw-body'); if (!b) return; var h = '';
    if (sw.m === 'start') h = '<p class="text-[11px] text-slate-400 mb-3">10 cards. Is it a <b class="text-emerald-300">smart move</b> or a <b class="text-red-300">mistake</b>? Swipe right for smart, left for mistake. Or use the buttons.</p><div class="' + CARD + ' text-center mb-3"><div class="text-5xl">🃏</div><p class="text-xs text-slate-300 mt-1">Best score: <b class="text-amber-300">' + (lsGet('pw_swipe', { best: 0 }).best || 0) + ' / 10</b></p></div><button onclick="PW12.g.swStart()" class="w-full py-3 ' + BTN + 'bg-violet-600 text-white">Start</button>';
    else if (sw.m === 'play') {
      var c = sw.deck[sw.i]; h = '<div class="flex justify-between text-[11px] text-slate-400 mb-2"><span>Card ' + (sw.i + 1) + ' / 10</span><span>Score <b class="text-amber-300" id="sw-sc">' + sw.s + '</b></span></div><div class="sw-zone" data-noswipe><div class="sw-lab sw-l">❌ Mistake</div><div class="sw-lab sw-r">✅ Smart</div><div id="sw-card" class="sw-card" style="touch-action:pan-y"><p>' + esc(c[0]) + '</p></div></div><div id="sw-fb" class="min-h-[64px] mt-2"></div><div class="flex gap-2 mt-2" id="sw-btns"><button onclick="PW12.g.swAns(false)" class="flex-1 py-3 ' + BTN + 'bg-red-600/80 text-white">❌ Mistake</button><button onclick="PW12.g.swAns(true)" class="flex-1 py-3 ' + BTN + 'bg-emerald-600/80 text-white">✅ Smart move</button></div>';
    } else h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + (sw.s >= 8 ? '🏆' : sw.s >= 5 ? '👍' : '📚') + '</div><p class="text-lg font-bold text-white">' + sw.s + ' / 10</p><p class="text-[11px] text-slate-300 mt-1">' + (sw.s >= 8 ? 'You think like a strategist.' : sw.s >= 5 ? 'Good. Read the reasons and play again.' : 'No problem. The reasons will help you.') + '</p></div><div class="flex gap-2 mt-3"><button onclick="PW12.g.swStart()" class="flex-1 py-2.5 ' + BTN + 'bg-violet-600 text-white">Play again</button><button onclick="PW12.g.home(this)" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Back</button></div>';
    b.innerHTML = h; if (sw.m === 'play') bindSwipe();
  }
  G.swStart = function () { sw = { m: 'play', deck: shuffle(D.SWIPE).slice(0, 10), i: 0, s: 0, lock: false }; renderSwipe(); };
  function bindSwipe() {
    var el = $('sw-card'); if (!el) return; var x0 = null, dx = 0, zone = el.parentNode;
    el.addEventListener('pointerdown', function (e) { if (sw.lock) return; x0 = e.clientX; dx = 0; el.style.transition = 'none'; try { el.setPointerCapture(e.pointerId); } catch (z) { } });
    el.addEventListener('pointermove', function (e) { if (x0 == null) return; dx = e.clientX - x0; el.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 14 + 'deg)'; zone.setAttribute('data-d', dx > 20 ? 'r' : dx < -20 ? 'l' : ''); });
    var up = function () { if (x0 == null) return; x0 = null; zone.removeAttribute('data-d'); if (Math.abs(dx) > 70) G.swAns(dx > 0); else { el.style.transition = 'transform .35s cubic-bezier(.2,1.6,.4,1)'; el.style.transform = ''; } };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  }
  G.swAns = function (smart) {
    if (sw.lock) return; sw.lock = true; var c = sw.deck[sw.i], ok = c[1] === smart, el = $('sw-card');
    if (ok) sw.s++; if (el) { el.style.transition = 'transform .45s ease-in, opacity .45s'; el.style.transform = 'translateX(' + (smart ? 160 : -160) + 'px) rotate(' + (smart ? 18 : -18) + 'deg)'; el.style.opacity = '.0'; el.classList.add(ok ? 'sw-ok' : 'sw-no'); }
    var fb = $('sw-fb'); if (fb) fb.innerHTML = '<div class="p-2.5 rounded-xl border ' + (ok ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-red-500/50 bg-red-500/10') + ' sw-in"><p class="text-xs font-bold ' + (ok ? 'text-emerald-300' : 'text-red-300') + '">' + (ok ? '✔ Correct' : '✖ Not quite') + ': it is ' + (c[1] ? 'a smart move' : 'a mistake') + '.</p><p class="text-[11px] text-slate-200">' + esc(c[2]) + '</p></div>';
    var sc = $('sw-sc'); if (sc) { sc.textContent = sw.s; pop(sc); } var btn = $('sw-btns'); if (btn) btn.innerHTML = '<button onclick="PW12.g.swNext()" class="w-full py-3 ' + BTN + 'bg-amber-500 text-slate-900">' + (sw.i >= 9 ? 'See score' : 'Next card ▶') + '</button>'; P.fb(ok ? 'good' : 'bad');
  };
  G.swNext = function () {
    if (sw.i >= 9) { sw.m = 'end'; var s = lsGet('pw_swipe', { best: 0 }); if (sw.s > (s.best || 0)) { s.best = sw.s; lsSet('pw_swipe', s); } if (sw.s >= 8) flag('swipe8', 1); renderSwipe(); P.addXP(5 + sw.s, 'swipe', 'swipe'); if (sw.s >= 8) { burst($('sw-body'), true, '🏆'); P.coach('Fast and smart!', 'win'); } chk(); return; }
    sw.i++; sw.lock = false; renderSwipe();
  };

  /* ================= Daily Spin ================= */
  var PRIZES = [
    { e: '⚡', t: '+10 XP', xp: 10 }, { e: '🎯', t: 'Daily mission: thank one person today.', xp: 5 }, { e: '🌟', t: '+20 XP', xp: 20 }, { e: '💬', t: 'Daily mission: ask one smart question today.', xp: 5 },
    { e: '❄️', t: 'A streak freeze!', xp: 0, fz: 1 }, { e: '🏅', t: 'Daily mission: write one win in your journal.', xp: 5 }, { e: '🔥', t: '+15 XP', xp: 15 }, { e: '🤝', t: 'Daily mission: say hello to someone new.', xp: 5 }
  ];
  var spinning = false, rot = 0;
  function renderSpin() {
    var b = $('spin-body'); if (!b) return; var sp = lsGet('pw_spin', { days: {}, last: null }), done = !!(sp.days || {})[iso()], N = PRIZES.length, cols = ['#7c3aed', '#0ea5e9', '#f59e0b', '#10b981', '#ec4899', '#6366f1', '#ef4444', '#14b8a6'], seg = '';
    for (var i = 0; i < N; i++) { var a0 = (i / N) * 2 * Math.PI - Math.PI / 2, a1 = ((i + 1) / N) * 2 * Math.PI - Math.PI / 2, am = (a0 + a1) / 2; seg += '<path d="M100 100L' + (100 + 96 * Math.cos(a0)).toFixed(1) + ' ' + (100 + 96 * Math.sin(a0)).toFixed(1) + 'A96 96 0 0 1 ' + (100 + 96 * Math.cos(a1)).toFixed(1) + ' ' + (100 + 96 * Math.sin(a1)).toFixed(1) + 'Z" fill="' + cols[i] + '" stroke="#0f172a" stroke-width="2"/><text x="' + (100 + 66 * Math.cos(am)).toFixed(1) + '" y="' + (108 + 66 * Math.sin(am)).toFixed(1) + '" text-anchor="middle" font-size="22">' + PRIZES[i].e + '</text>'; }
    b.innerHTML = '<p class="text-[11px] text-slate-400 mb-2">One free spin every day. Win XP, a daily mission or a streak freeze.</p><div class="spin-wrap"><div class="spin-ptr">▼</div><svg id="spin-wheel" viewBox="0 0 200 200" class="spin-wheel" style="transform:rotate(' + rot + 'deg)" role="img" aria-label="Prize wheel">' + seg + '<circle cx="100" cy="100" r="14" fill="#0f172a" stroke="#fbbf24" stroke-width="3"/></svg></div><div id="spin-res" class="min-h-[60px] text-center mt-2 text-sm text-white">' + (done ? '<span class="text-slate-400 text-xs">You already spun today. Come back tomorrow! Today: <b class="text-amber-300">' + esc(sp.last || '') + '</b></span>' : '') + '</div><button id="spin-btn" onclick="PW12.g.spin()" class="w-full py-3 ' + BTN + (done ? 'bg-slate-700 text-slate-400' : 'bg-amber-500 text-slate-900') + '"' + (done ? ' disabled' : '') + '>' + (done ? 'Spin again tomorrow' : '🎡 Spin the wheel') + '</button>';
  }
  G.spin = function () {
    var sp = lsGet('pw_spin', { days: {}, last: null }); if (spinning || sp.days[iso()]) return; spinning = true;
    var fz = lsGet('pw_freeze', { tokens: 0, granted: {}, used: [] }), idx = Math.floor(Math.random() * PRIZES.length); if (idx === 4 && fz.tokens >= 2) idx = 0; var N = PRIZES.length, tgt = 360 - (idx + .5) * (360 / N), full = P.fx() === 'off' ? 0 : 5;
    var w = $('spin-wheel'), btn = $('spin-btn'); if (btn) btn.disabled = true; rot = (Math.floor(rot / 360) + full) * 360 + tgt;
    sp.days[iso()] = 1; sp.last = PRIZES[idx].t; lsSet('pw_spin', sp);
    if (w) { w.style.transition = full ? 'transform 4s cubic-bezier(.12,.7,.1,1)' : 'none'; w.style.transform = 'rotate(' + rot + 'deg)'; }
    var ticks = 0, tm = setInterval(function () { P.snd('tick'); if (++ticks > 22) clearInterval(tm); }, 150); if (!full) clearInterval(tm);
    setTimeout(function () {
      spinning = false; var pz = PRIZES[idx], r = $('spin-res');
      if (pz.fz) { fz.tokens = Math.min(2, fz.tokens + 1); lsSet('pw_freeze', fz); }
      if (r) { r.innerHTML = '<div class="sw-in"><div class="text-3xl">' + pz.e + '</div><b>' + esc(pz.t) + '</b></div>'; } if (btn) { btn.textContent = 'Spin again tomorrow'; btn.className = 'w-full py-3 ' + BTN + 'bg-slate-700 text-slate-400'; }
      P.fb('good'); burst(w, true, pz.e); if (pz.xp) P.addXP(pz.xp, 'spin'); else P.addXP(3, 'spin'); chk();
    }, full ? 4200 : 50);
  };

  /* ================= Spot the red flag ================= */
  var fl = { m: 'start' };
  function renderFlags() {
    var b = $('fl-body'); if (!b) return; var h = '';
    if (fl.m === 'start') h = '<p class="text-[11px] text-slate-400 mb-3">Read each chat or message. Tap the lines that are <b class="text-red-300">red flags</b>. Some lines are fine. 6 rounds.</p><div class="' + CARD + ' text-center mb-3"><div class="text-5xl fl-wave">🚩</div></div><button onclick="PW12.g.flStart()" class="w-full py-3 ' + BTN + 'bg-red-600 text-white">Start</button>';
    else if (fl.m === 'play') {
      var s = fl.deck[fl.i]; h = '<div class="flex justify-between text-[11px] text-slate-400 mb-2"><span>Round ' + (fl.i + 1) + ' / ' + fl.deck.length + '</span><span>Points <b class="text-amber-300">' + fl.pts + '</b></span></div><p class="text-xs font-bold text-white mb-2">' + esc(s.t) + '</p><div class="space-y-1.5">';
      s.lines.forEach(function (l, i) { var st = fl.rev ? (l[2] ? (fl.pick[i] ? 'border-emerald-500 bg-emerald-500/15' : 'border-red-500 bg-red-500/15 fl-miss') : (fl.pick[i] ? 'border-amber-500 bg-amber-500/15' : 'border-slate-700')) : (fl.pick[i] ? 'border-red-400 bg-red-500/15' : 'border-slate-700'); h += '<button ' + (fl.rev ? 'disabled' : 'onclick="PW12.g.flTap(' + i + ')"') + ' class="w-full text-left p-2.5 rounded-xl border bg-slate-900/70 flex items-start gap-2 ' + st + '"><span class="text-lg">' + l[0] + '</span><span class="text-[12px] text-slate-100 flex-1">' + esc(l[1]) + '</span><span>' + (fl.pick[i] ? '🚩' : '') + (fl.rev && l[2] && !fl.pick[i] ? '👀' : '') + '</span></button>'; });
      h += '</div>';
      if (!fl.rev) h += '<button onclick="PW12.g.flCheck()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">Check my answer</button>';
      else h += '<div class="mt-3 p-2.5 rounded-xl border border-slate-600 bg-slate-900/70 sw-in"><p class="text-xs font-bold text-amber-300">' + fl.msg + '</p><p class="text-[11px] text-slate-200 mt-1">💡 ' + esc(s.why) + '</p></div><button onclick="PW12.g.flNext()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-violet-600 text-white">' + (fl.i >= fl.deck.length - 1 ? 'See result' : 'Next round ▶') + '</button>';
    } else h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + (fl.pts >= 45 ? '🏆' : '🕵️') + '</div><p class="text-lg font-bold text-white">' + fl.pts + ' points</p><p class="text-[11px] text-slate-300 mt-1">' + (fl.pts >= 45 ? 'Sharp eyes! Red flags do not hide from you.' : 'Good start. Play again to train your eyes.') + '</p></div><div class="flex gap-2 mt-3"><button onclick="PW12.g.flStart()" class="flex-1 py-2.5 ' + BTN + 'bg-red-600 text-white">Play again</button><button onclick="PW12.g.home(this)" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Back</button></div>';
    b.innerHTML = h;
  }
  G.flStart = function () { fl = { m: 'play', deck: shuffle(D.FLAGS).slice(0, 6), i: 0, pts: 0, pick: {}, rev: false }; renderFlags(); };
  G.flTap = function (i) { fl.pick[i] = !fl.pick[i]; P.fb('tap'); renderFlags(); };
  G.flCheck = function () {
    var s = fl.deck[fl.i], got = 0, bad = 0; s.lines.forEach(function (l, i) { if (l[2] && fl.pick[i]) got++; else if (!l[2] && fl.pick[i]) bad++; else if (l[2] && !fl.pick[i]) bad++; });
    var p = got * 10 - bad * 5; p = Math.max(0, p); fl.pts += p; fl.rev = true; fl.msg = bad === 0 ? '✔ Perfect! +' + p : (got ? 'Partly right. +' + p : 'You missed it. +0'); renderFlags(); P.fb(bad === 0 ? 'good' : 'bad');
  };
  G.flNext = function () { if (fl.i >= fl.deck.length - 1) { fl.m = 'end'; renderFlags(); P.addXP(8 + Math.round(fl.pts / 10), 'flags', 'flags'); chk(); if (fl.pts >= 45) burst($('fl-body'), true, '🚩'); return; } fl.i++; fl.pick = {}; fl.rev = false; renderFlags(); };

  /* ================= Message makeover ================= */
  var mk = { m: 'start' };
  function face(s) { return s >= 85 ? '😄' : s >= 60 ? '🙂' : s >= 40 ? '😐' : s >= 25 ? '😟' : '😡'; }
  function renderMake() {
    var b = $('mk-body'); if (!b) return; var h = '';
    if (mk.m === 'start') h = '<p class="text-[11px] text-slate-400 mb-3">A risky message needs a makeover. Pick the version that is calm and clear. Watch the Calm-o-meter. 6 rounds.</p><div class="' + CARD + ' text-center mb-3"><div class="text-5xl">✍️</div></div><button onclick="PW12.g.mkStart()" class="w-full py-3 ' + BTN + 'bg-pink-600 text-white">Start</button>';
    else if (mk.m === 'play') {
      var c = mk.deck[mk.i]; h = '<div class="flex justify-between text-[11px] text-slate-400 mb-2"><span>Round ' + (mk.i + 1) + ' / ' + mk.deck.length + '</span><span>Total <b class="text-amber-300">' + mk.tot + '</b></span></div><p class="text-[11px] text-slate-300 mb-2">📍 ' + esc(c.s) + '</p><div class="p-2.5 rounded-xl border border-red-500/50 bg-red-500/10 mb-3"><p class="text-[10px] font-bold text-red-300">Risky version</p><p class="text-[12px] text-white italic">' + esc(c.bad) + '</p></div>';
      h += '<div class="mk-meter mb-3"><span id="mk-face" class="text-3xl">' + (mk.pick == null ? '😐' : face(mk.score)) + '</span><div class="flex-1"><div class="flex justify-between text-[10px] font-bold text-slate-300"><span>Calm-o-meter</span><span id="mk-n">' + (mk.pick == null ? 0 : mk.score) + '</span></div><div class="h-3 rounded-full bg-slate-700 overflow-hidden"><div id="mk-bar" class="mk-bar h-full" style="width:' + (mk.pick == null ? 0 : mk.score) + '%;background:' + (mk.pick == null ? '#64748b' : mk.score >= 70 ? '#10b981' : mk.score >= 40 ? '#f59e0b' : '#ef4444') + '"></div></div></div></div><div class="space-y-2">';
      mk.opts.forEach(function (o, k) { var st = mk.pick == null ? 'border-slate-600 hover:border-amber-400' : (k === mk.pick ? (o[1] >= 70 ? 'border-emerald-500 bg-emerald-500/10' : 'border-amber-500 bg-amber-500/10') : 'border-slate-700 opacity-70'); h += '<button ' + (mk.pick == null ? 'onclick="PW12.g.mkPick(' + k + ')"' : 'disabled') + ' class="w-full text-left p-3 ' + BTN + 'bg-slate-800 border ' + st + ' text-slate-100">' + esc(o[0]) + (mk.pick != null ? '<span class="block text-[10px] font-normal mt-1 ' + (o[1] >= 70 ? 'text-emerald-300' : 'text-slate-400') + '">' + o[1] + ': ' + esc(o[2]) + '</span>' : '') + '</button>'; });
      h += '</div>'; if (mk.pick != null) h += '<button onclick="PW12.g.mkNext()" class="mt-3 w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">' + (mk.i >= mk.deck.length - 1 ? 'See result' : 'Next ▶') + '</button>';
    } else { var avg = Math.round(mk.tot / mk.deck.length); h = '<div class="' + CARD + ' text-center"><div class="text-5xl">' + face(avg) + '</div><p class="text-lg font-bold text-white">Average calm: ' + avg + ' / 100</p><p class="text-[11px] text-slate-300 mt-1">' + (avg >= 80 ? 'Your words keep the peace and get results.' : 'Practice makes it natural. Try again.') + '</p></div><div class="flex gap-2 mt-3"><button onclick="PW12.g.mkStart()" class="flex-1 py-2.5 ' + BTN + 'bg-pink-600 text-white">Play again</button><button onclick="PW12.g.home(this)" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">Back</button></div>'; }
    b.innerHTML = h;
  }
  G.mkStart = function () { mk = { m: 'play', deck: shuffle(D.MAKEOVER).slice(0, 6), i: 0, tot: 0, pick: null }; mk.opts = shuffle(mk.deck[0].opts); renderMake(); };
  G.mkPick = function (k) {
    var o = mk.opts[k]; mk.pick = k; mk.score = o[1]; mk.tot += o[1]; var from = 0; renderMake(); var bar = $('mk-bar'), n = $('mk-n'); if (bar && P.fx() !== 'off') { bar.style.transition = 'none'; bar.style.width = '0%'; void bar.offsetWidth; bar.style.transition = 'width 1s cubic-bezier(.2,.9,.3,1)'; bar.style.width = o[1] + '%'; } if (n) P.tick(n, o[1]);
    var f = $('mk-face'); if (f) pop(f); P.fb(o[1] >= 70 ? 'good' : 'bad'); if (o[1] >= 90) burst(f, false, '✨');
  };
  G.mkNext = function () { if (mk.i >= mk.deck.length - 1) { mk.m = 'end'; renderMake(); P.addXP(8 + Math.round(mk.tot / mk.deck.length / 10), 'makeover', 'makeover'); chk(); return; } mk.i++; mk.pick = null; mk.opts = shuffle(mk.deck[mk.i].opts); renderMake(); };

  /* ================= Buzzword bingo ================= */
  var bg = null, bgSel = null;
  function newCard() { var w = shuffle(D.BINGO).slice(0, 24); w.splice(12, 0, null); bg = { w: w.map(function (x) { return x ? x[0] : null; }), hit: { 12: 1 }, won: false }; lsSet('pw_bingo', bg); }
  function bingoLines(h) { var L = [], i; for (i = 0; i < 5; i++) { L.push([0, 1, 2, 3, 4].map(function (j) { return i * 5 + j; })); L.push([0, 1, 2, 3, 4].map(function (j) { return j * 5 + i; })); } L.push([0, 6, 12, 18, 24]); L.push([4, 8, 12, 16, 20]); return L.filter(function (l) { return l.every(function (x) { return h[x]; }); }); }
  function meaning(w) { var f = D.BINGO.filter(function (x) { return x[0] === w; })[0]; return f ? f[1] : ''; }
  function renderBingo() {
    var b = $('bingo-body'); if (!b) return; if (!bg) { bg = lsGet('pw_bingo', null); if (!bg || !bg.w) newCard(); }
    var ln = bingoLines(bg.hit), inL = {}; ln.forEach(function (l) { l.forEach(function (x) { inL[x] = 1; }); });
    var h = '<p class="text-[11px] text-slate-400 mb-2">Tap a word when you hear it at work. Five in a row = BINGO! Tap again to see what it means.</p><div class="bingo">';
    bg.w.forEach(function (w, i) { h += '<button onclick="PW12.g.bingoTap(' + i + ')" class="bn' + (bg.hit[i] ? ' bn-on' : '') + (inL[i] ? ' bn-win' : '') + '" aria-pressed="' + !!bg.hit[i] + '">' + (w ? esc(w) : '⭐<br>FREE') + '</button>'; });
    h += '</div><div id="bn-info" class="min-h-[44px] mt-2 text-[11px] text-slate-200 text-center">' + (bgSel != null && bg.w[bgSel] ? '<b class="text-amber-300">' + esc(bg.w[bgSel]) + '</b>: ' + esc(meaning(bg.w[bgSel])) : '') + '</div>' + (ln.length ? '<p class="text-center text-lg font-extrabold text-amber-300 bn-big">🎯 BINGO!</p>' : '') + '<button onclick="PW12.g.bingoNew()" class="mt-2 w-full py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">🔄 New card</button>';
    b.innerHTML = h;
  }
  G.bingoTap = function (i) {
    if (i === 12) return; var w = bg.w[i]; if (bg.hit[i] && bgSel === i) { delete bg.hit[i]; bgSel = null; } else { bg.hit[i] = 1; bgSel = i; }
    P.fb('tap'); var had = bg.won; lsSet('pw_bingo', bg); var ln = bingoLines(bg.hit);
    if (ln.length && !had) { bg.won = true; lsSet('pw_bingo', bg); flag('bingo', 1); P.fb('good'); renderBingo(); burst($('bingo-body'), true, '🎯'); P.addXP(20, 'bingo'); P.coach('BINGO! You know the office talk.', 'win'); chk(); return; } renderBingo();
  };
  G.bingoNew = function () { bgSel = null; newCard(); renderBingo(); };

  /* ================= Mood check-in ================= */
  var MOODS = [['😄', 'Great', 5, 'Love it. Save this energy: write one win in your journal.'], ['🙂', 'Good', 4, 'Nice. A steady day is a strong base.'], ['😐', 'Okay', 3, 'Okay is fine. Pick one small move and finish it.'], ['😟', 'Stressed', 2, 'Take 3 slow breaths. Then pick the one task that matters most.'], ['😢', 'Low', 1, 'Be kind to yourself today. Do one small thing, then rest. Talk to someone you trust.']];
  var TAGS = ['Workload', 'My boss', 'Team', 'Pay', 'Growth', 'Home life'], md = { pick: null, tags: {}, note: '' };
  function renderMood() {
    var b = $('mood-body'); if (!b) return; var list = lsGet('pw_mood', []), today = list.filter(function (x) { return x.d === iso(); })[0], h = '';
    h += '<p class="text-[11px] text-slate-400 mb-3">How do you feel about work today? Your answers stay on your phone.</p><div class="flex justify-between mb-2" role="radiogroup" aria-label="Mood">';
    MOODS.forEach(function (m, i) { h += '<button role="radio" aria-checked="' + (md.pick === i) + '" onclick="PW12.g.moodPick(' + i + ')" class="mood-f' + (md.pick === i ? ' on' : '') + '"><span class="mood-e">' + m[0] + '</span><small>' + m[1] + '</small></button>'; });
    h += '</div>';
    if (md.pick != null) { h += '<div class="' + CARD + ' mb-2 sw-in"><p class="text-[11px] text-slate-200">' + esc(MOODS[md.pick][3]) + '</p></div><p class="text-[11px] text-slate-300 font-bold mb-1">What is on your mind? (optional)</p><div class="flex flex-wrap gap-1.5 mb-2">' + TAGS.map(function (t) { return '<button onclick="PW12.g.moodTag(\'' + t + '\')" class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ' + (md.tags[t] ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-300') + '">' + t + '</button>'; }).join('') + '</div><button onclick="PW12.g.moodSave()" class="w-full py-2.5 ' + BTN + 'bg-emerald-600 text-white">' + (today ? 'Update today' : 'Save check-in') + '</button>'; }
    var last7 = []; for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var k = iso(d), e = list.filter(function (x) { return x.d === k; })[0]; last7.push('<div class="text-center"><div class="text-xl ' + (e ? '' : 'opacity-25') + '">' + (e ? MOODS[e.m][0] : '·') + '</div><small class="text-[9px] text-slate-500">' + ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()] + '</small></div>'); }
    h += '<p class="text-xs font-bold text-white mt-4 mb-1">Last 7 days</p><div class="flex justify-between ' + CARD + '">' + last7.join('') + '</div>';
    b.innerHTML = h;
  }
  G.moodPick = function (i) { md.pick = i; P.fb('tap'); renderMood(); var e = document.querySelector('.mood-f.on .mood-e'); pop(e); };
  G.moodTag = function (t) { md.tags[t] = !md.tags[t]; renderMood(); };
  G.moodSave = function () {
    if (md.pick == null) return; var list = lsGet('pw_mood', []).filter(function (x) { return x.d !== iso(); }); list.push({ d: iso(), m: md.pick, tags: Object.keys(md.tags).filter(function (k) { return md.tags[k]; }) }); list = list.slice(-120); lsSet('pw_mood', list);
    md = { pick: null, tags: {}, note: '' }; renderMood(); toast('Check-in saved 😊'); P.fb('good'); P.addXP(5, 'mood', 'mood'); chk();
  };

  /* ================= Focus timer ================= */
  var fo = lsGet('pw_focusrun', null), foT = 0;
  function focusLeft() { if (!fo) return 0; return fo.paused ? fo.left : Math.max(0, Math.round((fo.end - Date.now()) / 1000)); }
  function fmt(s) { return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); }
  function renderFocus() {
    var b = $('focus-body'); if (!b) return; var st = lsGet('pw_focus', { n: 0, min: 0 }), C = 2 * Math.PI * 70, h = '';
    h += '<p class="text-[11px] text-slate-400 mb-3">Work with no phone distractions until the ring is full. Short sessions help your brain.</p>';
    if (!fo) h += '<div class="flex gap-2 mb-3">' + [10, 15, 25].map(function (m) { return '<button onclick="PW12.g.focusStart(' + m * 60 + ')" class="flex-1 py-3 ' + BTN + 'bg-teal-600 text-white">' + m + ' min</button>'; }).join('') + '</div><div class="flex justify-center mb-2"><svg viewBox="0 0 160 160" width="170" height="170"><circle cx="80" cy="80" r="70" fill="none" stroke="#334155" stroke-width="10"/><text x="80" y="92" text-anchor="middle" font-size="34" font-weight="800" fill="#94a3b8">00:00</text></svg></div>';
    else { var left = focusLeft(), tot = fo.total, pct = 1 - left / tot; h += '<div class="flex justify-center mb-2"><svg viewBox="0 0 160 160" width="190" height="190" role="timer" aria-label="Focus timer"><circle cx="80" cy="80" r="70" fill="none" stroke="#334155" stroke-width="10"/><circle id="fo-arc" cx="80" cy="80" r="70" fill="none" stroke="#2dd4bf" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pct)).toFixed(1) + '" transform="rotate(-90 80 80)"/><text id="fo-t" x="80" y="92" text-anchor="middle" font-size="34" font-weight="800" fill="#fff">' + fmt(left) + '</text></svg></div><div class="flex gap-2"><button onclick="PW12.g.focusPause()" class="flex-1 py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">' + (fo.paused ? '▶ Resume' : '⏸ Pause') + '</button><button onclick="PW12.g.focusStop()" class="flex-1 py-2.5 ' + BTN + 'bg-red-600/80 text-white">Stop</button></div>'; }
    h += '<p class="text-[11px] text-slate-400 text-center mt-3">Finished sessions: <b class="text-amber-300">' + (st.n || 0) + '</b> · Minutes: <b class="text-amber-300">' + (st.min || 0) + '</b></p>'; b.innerHTML = h;
  }
  function focusLoop() {
    clearInterval(foT); foT = setInterval(function () {
      if (!fo) { clearInterval(foT); return; } if (fo.paused) return; var left = focusLeft(), t = $('fo-t'), a = $('fo-arc'), C = 2 * Math.PI * 70;
      if (t) t.textContent = fmt(left); if (a) a.setAttribute('stroke-dashoffset', (C * left / fo.total).toFixed(1));
      if (left <= 0) { clearInterval(foT); focusDone(); }
    }, 500);
  }
  function focusDone() { var st = lsGet('pw_focus', { n: 0, min: 0 }); st.n = (st.n || 0) + 1; st.min = (st.min || 0) + Math.round(fo.total / 60); lsSet('pw_focus', st); fo = null; lsSet('pw_focusrun', null); renderFocus(); P.fb('level'); burst($('focus-body'), true, '⏱️'); toast('🎉 Focus session done!'); P.addXP(10, 'focus'); P.coach('Great focus! Take a short break.', 'win'); chk(); }
  G.focusStart = function (sec) { fo = { total: sec, end: Date.now() + sec * 1000, paused: false }; lsSet('pw_focusrun', fo); renderFocus(); focusLoop(); P.fb('tap'); };
  G.focusPause = function () { if (!fo) return; if (fo.paused) { fo.end = Date.now() + fo.left * 1000; fo.paused = false; } else { fo.left = focusLeft(); fo.paused = true; } lsSet('pw_focusrun', fo); renderFocus(); };
  G.focusStop = function () { fo = null; lsSet('pw_focusrun', null); clearInterval(foT); renderFocus(); };

  /* ================= Review countdown ================= */
  function daysTo(d) { var t = new Date(d + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); }
  function renderReview() {
    var b = $('rev-body'); if (!b) return; var r = lsGet('pw_review', null), h = '';
    h += '<p class="text-[11px] text-slate-400 mb-3">Set the date of your next review or pay talk. See how many days you have and what to do each week.</p><label class="text-[11px] font-bold text-slate-300" for="rev-date">Review date</label><div class="flex gap-2 mb-3"><input id="rev-date" type="date" value="' + (r ? r.date : '') + '" class="flex-1 bg-slate-950/80 border border-slate-700 rounded-lg p-2 text-xs text-slate-100"><button onclick="PW12.g.revSave()" class="px-4 ' + BTN + 'bg-amber-500 text-slate-900">Set</button></div>';
    if (r) {
      var n = daysTo(r.date), tot = Math.max(1, daysTo(r.date) + Math.max(0, Math.round((Date.now() - new Date(r.set).getTime()) / 864e5))), pct = Math.max(0, Math.min(100, (1 - n / tot) * 100)), step = n < 0 ? 'Review is over. Write down what you learned and your next goal.' : n === 0 ? 'Today is the day! Breathe, smile, bring your wins.' : n <= 1 ? 'Rest well. Read your top 3 wins once more.' : n <= 7 ? 'Write your pitch and practice it out loud once.' : n <= 14 ? 'Ask 1 or 2 people for feedback on your work.' : 'Collect your wins with numbers in your Wins Journal.';
      h += '<div class="' + CARD + ' text-center ' + (n >= 0 && n <= 7 ? 'rev-pulse border-amber-500/60' : '') + '"><p class="text-[11px] text-slate-400">' + (n < 0 ? 'Review was' : 'Days to go') + '</p><div class="flex justify-center gap-1 my-1" id="rev-dig" aria-live="polite">' + String(Math.abs(n)).split('').map(function (c) { return '<span class="rev-d">' + c + '</span>'; }).join('') + '</div><p class="text-[11px] text-slate-400">' + (n < 0 ? 'days ago' : n === 0 ? 'today' : 'day' + (n === 1 ? '' : 's')) + '</p><div class="h-2 rounded-full bg-slate-700 overflow-hidden mt-2"><div class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 bb-fill" style="width:' + pct + '%"></div></div></div><div class="' + CARD + ' mt-3"><p class="text-xs font-bold text-amber-300 mb-1">👉 Your next step</p><p class="text-[12px] text-slate-100">' + step + '</p></div><div class="grid grid-cols-2 gap-2 mt-3"><button onclick="goToStep(\'step-journal\',0)" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📓 Wins Journal</button><button onclick="goToStep(\'step-salary\',0)" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">💰 Salary Helper</button><button onclick="goToStep(\'step-feedback\',0)" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">🪞 Feedback Log</button><button onclick="goToStep(\'step-meeting\',0)" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">🗓️ 1:1 Planner</button></div><button onclick="PW12.g.revClear()" class="mt-3 w-full py-2 ' + BTN + 'bg-slate-800 text-slate-400">Clear date</button>';
    }
    b.innerHTML = h;
  }
  G.revSave = function () { var v = ($('rev-date') || {}).value; if (!v) { toast('Pick a date first'); return; } lsSet('pw_review', { date: v, set: new Date().toISOString() }); renderReview(); P.fb('good'); P.addXP(5, 'review', 'review'); };
  G.revClear = function () { lsSet('pw_review', null); renderReview(); };

  /* ================= Intro tour ================= */
  var TOUR = [['🏰', 'Welcome, strategist!', 'Promotion Warfare helps you win at work with calm, smart moves.'], ['🗺️', 'Map the power', 'Add the people around you. See who has influence. Climb the pyramid.'], ['📋', 'Plan your moves', 'Pick small actions. Tick them off. Each one gives XP.'], ['⚡', 'Level up', 'Earn XP, keep your daily streak and unlock badges, avatar items and backgrounds.'], ['🎮', 'Practice safely', 'Fight bosses, spot red flags and fix risky messages. No real risk.']];
  var ti = 0;
  P.tour = function () {
    var o = $('tour-ov'); if (o) o.remove(); ti = 0; window.PW_TOURING = true; o = document.createElement('div'); o.id = 'tour-ov'; o.className = 'tour-ov'; o.setAttribute('role', 'dialog'); o.setAttribute('aria-label', 'Intro tour'); document.body.appendChild(o); tourDraw();
  };
  function tourDraw() {
    var o = $('tour-ov'); if (!o) return; var s = TOUR[ti];
    o.innerHTML = '<div class="tour-card"><button class="tour-x" onclick="PW12.tourEnd()" aria-label="Close">✕</button><div class="tour-e" key="' + ti + '">' + s[0] + '</div><h3>' + esc(s[1]) + '</h3><p>' + esc(s[2]) + '</p><div class="flex justify-center gap-1.5 my-3">' + TOUR.map(function (x, i) { return '<span class="rc-d' + (i <= ti ? ' on' : '') + '" style="max-width:26px"></span>'; }).join('') + '</div><button onclick="PW12.tourNext()" class="w-full py-2.5 ' + BTN + 'bg-amber-500 text-slate-900">' + (ti >= TOUR.length - 1 ? 'Let us go!' : 'Next ▶') + '</button></div>'; P.fb('whoosh');
  }
  P.tourNext = function () { if (ti >= TOUR.length - 1) { P.tourEnd(); return; } ti++; tourDraw(); };
  P.tourEnd = function () { var o = $('tour-ov'); if (o) o.remove(); window.PW_TOURING = false; lsSet('pw_tour', 1); if (P.fx() !== 'off') burst(document.body, false, '🏰'); };

  /* ================= Coach mascot ================= */
  var coachT = 0, LINES = { move: ['Quest done! 💪', 'Nice move!', 'One step closer!'], win: ['Great win!', 'Look at you go!'], badge: ['A new badge! ✨'], default: ['Keep going!', 'You are doing great.'] };
  P.coach = function (msg, mood) {
    if (P.fx() === 'off') return; var c = $('coach'); if (!c) { c = document.createElement('div'); c.id = 'coach'; c.setAttribute('role', 'status'); c.onclick = function () { c.classList.remove('co-on'); }; document.body.appendChild(c); }
    c.innerHTML = '<span class="co-av' + (mood === 'win' ? ' co-win' : '') + '">🦉</span><span class="co-b">' + esc(msg) + '</span>'; c.classList.remove('co-on'); void c.offsetWidth; c.classList.add('co-on'); clearTimeout(coachT); coachT = setTimeout(function () { c.classList.remove('co-on'); }, 3200);
  };
  var _ax = P.addXP; P.addXP = function (n, why, once) { var r = _ax(n, why, once); if (r && (why === 'move' || why === 'win' || why === 'badge') && P.fx() === 'full') { var l = LINES[why] || LINES.default; setTimeout(function () { P.coach(l[Math.floor(Math.random() * l.length)], why === 'badge' ? 'win' : ''); }, 400); } return r; };

  /* ================= wiring ================= */
  G.home = function () { bb = { m: 'pick' }; sw = { m: 'start' }; fl = { m: 'start' }; mk = { m: 'start' }; goToStep('step-tools', 0); };
  var PAGES = [['step-boss12', '👹', 'Boss Battles', 'Beat the office bosses', 'red', 'bb-body', renderBoss], ['step-swipe', '🃏', 'Swipe Cards', 'Smart move or mistake?', 'violet', 'sw-body', renderSwipe], ['step-spin', '🎡', 'Daily Spin', 'One free spin each day', 'amber', 'spin-body', renderSpin],
    ['step-flags', '🚩', 'Spot the Red Flag', 'Find the warning signs', 'red', 'fl-body', renderFlags], ['step-makeover', '✍️', 'Message Makeover', 'Make risky words calm', 'pink', 'mk-body', renderMake], ['step-bingo', '🎯', 'Buzzword Bingo', 'Office talk, decoded', 'amber', 'bingo-body', renderBingo],
    ['step-mood', '😊', 'Mood Check-in', 'How is work today?', 'emerald', 'mood-body', renderMood], ['step-focus', '⏱️', 'Focus Timer', 'One calm block of work', 'teal', 'focus-body', renderFocus], ['step-review', '📅', 'Review Countdown', 'Get ready for your review', 'sky', 'rev-body', renderReview]];
  function css() {
    if ($('v12g-css')) return; var s = document.createElement('style'); s.id = 'v12g-css';
    s.textContent = [
      '.v12-pop{animation:v12P .5s cubic-bezier(.2,1.8,.4,1)}@keyframes v12P{0%{transform:scale(.5)}100%{transform:scale(1)}}',
      '.sw-in{animation:swI .4s ease-out}@keyframes swI{from{opacity:0;transform:translateY(10px)}}html.fx-off .sw-in{animation:none}',
      '.bb-fill{transition:width .8s cubic-bezier(.3,1,.4,1)}.bb-ring{transition:stroke-dashoffset 1s}',
      '.bb-hit{animation:bbH .5s}@keyframes bbH{0%,100%{transform:none}20%{transform:translateX(-10px) rotate(-6deg);filter:brightness(2)}50%{transform:translateX(10px) rotate(6deg)}}',
      '.bb-strike{animation:bbS .5s}@keyframes bbS{0%{transform:scale(1)}40%{transform:scale(1.4)}100%{transform:scale(1)}}',
      'html.fx-full .bb-boss{animation:bbF 2.4s ease-in-out infinite}@keyframes bbF{50%{transform:translateY(-6px)}}html.fx-full .bb-win{animation:bbW 1s infinite alternate}@keyframes bbW{to{transform:scale(1.2) rotate(8deg)}}html.fx-full .bb-lose{animation:bbL 2s infinite}@keyframes bbL{50%{transform:scale(1.1)}}',
      '.sw-zone{position:relative;height:190px;display:flex;align-items:center;justify-content:center}.sw-zone[data-d=r]{background:radial-gradient(circle at 85% 50%,rgba(16,185,129,.25),transparent 60%)}.sw-zone[data-d=l]{background:radial-gradient(circle at 15% 50%,rgba(239,68,68,.25),transparent 60%)}',
      '.sw-lab{position:absolute;top:6px;font-size:11px;font-weight:800;opacity:.6}.sw-l{left:6px;color:#fca5a5}.sw-r{right:6px;color:#6ee7b7}',
      '.sw-card{width:86%;min-height:130px;padding:18px;border-radius:20px;background:linear-gradient(135deg,#1e293b,#312e81);border:2px solid #6366f1;color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;text-align:center;cursor:grab;box-shadow:0 12px 30px rgba(0,0,0,.4)}.sw-card.sw-ok{border-color:#10b981}.sw-card.sw-no{border-color:#ef4444}',
      '.spin-wrap{position:relative;width:230px;margin:6px auto}.spin-wheel{width:230px;height:230px;display:block;filter:drop-shadow(0 6px 14px rgba(0,0,0,.5))}.spin-ptr{position:absolute;top:-12px;left:50%;margin-left:-10px;font-size:22px;color:#fbbf24;z-index:2;text-shadow:0 2px 4px #000}',
      '.fl-wave{display:inline-block;transform-origin:20% 100%}html.fx-full .fl-wave{animation:flW 1.2s ease-in-out infinite}@keyframes flW{50%{transform:rotate(18deg)}}.fl-miss{animation:flM 1s 2}@keyframes flM{50%{box-shadow:0 0 12px #ef4444}}',
      '.mk-meter{display:flex;align-items:center;gap:10px}.mk-bar{transition:width 1s,background .4s}',
      '.bingo{display:grid;grid-template-columns:repeat(5,1fr);gap:4px}.bn{aspect-ratio:1;padding:2px;border-radius:10px;font-size:9px;font-weight:700;line-height:1.1;background:#1e293b;border:1px solid #475569;color:#e2e8f0;display:flex;align-items:center;justify-content:center;text-align:center;word-break:break-word;transition:transform .2s,background .2s}',
      '.bn.bn-on{background:#b45309;border-color:#fbbf24;color:#fff;transform:scale(.94)}.bn.bn-win{background:#059669;border-color:#6ee7b7}html.fx-full .bn-win{animation:bnW 1s infinite alternate}@keyframes bnW{to{box-shadow:0 0 10px #34d399}}html.fx-full .bn-big{animation:bbW 1s infinite alternate}',
      '.mood-f{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;border-radius:14px;flex:1;border:2px solid transparent;background:transparent;color:#cbd5e1;font-size:10px;font-weight:700}.mood-f.on{border-color:#fbbf24;background:rgba(251,191,36,.12)}.mood-e{font-size:34px;transition:transform .25s}.mood-f:active .mood-e{transform:scale(1.3)}html.fx-full .mood-f.on .mood-e{animation:mdB 1s ease-in-out infinite}@keyframes mdB{50%{transform:translateY(-6px) scale(1.15)}}',
      '.rev-d{display:inline-block;min-width:34px;padding:6px 4px;border-radius:8px;background:linear-gradient(#1e293b,#0f172a);border:1px solid #475569;font-size:34px;font-weight:900;color:#fbbf24;font-variant-numeric:tabular-nums}html.fx-full .rev-d{animation:revF .7s both}@keyframes revF{from{transform:rotateX(90deg);opacity:0}}html.fx-full .rev-pulse{animation:revP 2s infinite}@keyframes revP{50%{box-shadow:0 0 14px rgba(245,158,11,.5)}}',
      '.tour-ov{position:fixed;inset:0;z-index:97;background:rgba(2,6,23,.88);display:flex;align-items:center;justify-content:center;padding:20px}.tour-card{position:relative;width:100%;max-width:320px;background:#1e293b;border:1px solid #f59e0b;border-radius:24px;padding:24px 20px;text-align:center;color:#fff}.tour-card h3{font-size:18px;font-weight:800;margin:6px 0}.tour-card p{font-size:13px;color:#cbd5e1;line-height:1.4}.tour-e{font-size:64px;animation:lvPop .6s cubic-bezier(.2,1.6,.4,1)}.tour-x{position:absolute;top:8px;right:12px;color:#94a3b8;font-size:16px}html.fx-off .tour-e{animation:none}',
      '#coach{position:fixed;left:10px;bottom:76px;z-index:60;display:flex;align-items:flex-end;gap:6px;transform:translateX(-130%);transition:transform .5s cubic-bezier(.2,1.4,.4,1);max-width:70vw}#coach.co-on{transform:none}.co-av{font-size:34px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5))}html.fx-full #coach.co-on .co-av{animation:coW 1s ease-in-out 2}@keyframes coW{25%{transform:rotate(-14deg)}75%{transform:rotate(14deg)}}html.fx-full .co-win{animation:coJ .5s 3!important}@keyframes coJ{50%{transform:translateY(-12px)}}.co-b{background:#fff;color:#0f172a;font-size:12px;font-weight:700;padding:7px 11px;border-radius:14px 14px 14px 2px;box-shadow:0 6px 16px rgba(0,0,0,.4)}'
    ].join('\n'); document.head.appendChild(s);
  }
  function init() {
    css(); PAGES.forEach(function (p) { P.mkPage(p[0], p[1], p[2], p[3], p[4], p[5]); P.onPage(p[0], function () { if (p[0] === 'step-focus' && fo) focusLoop(); p[6](); }); });
    if (fo && !fo.paused && focusLeft() > 0) focusLoop(); else if (fo && !fo.paused) { setTimeout(function () { if (fo) focusDone(); }, 600); }
    /* pages that run through P.pages are called by v12vis goToStep wrapper */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
