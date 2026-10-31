/* Promotion Warfare V10: Office Politics Game (30 scenarios, animated, no timer). Voice picker lives in v9.js. */
(function () {
  'use strict';
  var D = window.PW10 || {}, $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function checkBadges() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function isoDay(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function clamp(n) { return Math.max(0, Math.min(100, n)); }
  var BTN = 'rounded-xl text-[11px] font-bold active:scale-95 ';
  var CARD = 'p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60';
  var PTS = { b: 10, o: 5, x: 0 };
  var STRAT_NAME = { 'strat-leader': 'Defensive Warfare', 'strat-challenger': 'Offensive Warfare', 'strat-flanker': 'Flanking Warfare', 'strat-guerrilla': 'Guerrilla Warfare' };

  /* ---------- badges ---------- */
  var BADGES = [
    { id: 'gmplay', e: '🎮', n: 'Office Player', h: 'Finish one level of the Office Politics Game.' },
    { id: 'gmall', e: '🏰', n: 'Game Master', h: 'Finish all 3 levels of the Office Politics Game.' }
  ];
  (function () { var P = window.PW6 || (window.PW6 = {}); P.BADGES = (P.BADGES || []).concat(BADGES); })();
  var _extra = window.pwExtraBadges;
  window.pwExtraBadges = function () { var o = _extra ? _extra() : {}, g = save(); o.gmplay = Object.keys(g.done).length >= 1; o.gmall = Object.keys(g.done).length >= 3; return o; };

  /* ---------- styles (animations) ---------- */
  function css() {
    if ($('gm-css')) return;
    var c = document.createElement('style'); c.id = 'gm-css';
    c.textContent = '.gm-in{animation:gmIn .45s ease both}@keyframes gmIn{from{opacity:0;transform:translateY(18px) scale(.97)}to{opacity:1;transform:none}}' +
      '.gm-pop{animation:gmP .5s cubic-bezier(.2,1.6,.4,1) both}@keyframes gmP{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:none}}' +
      '.gm-bounce{display:inline-block;animation:gmB 1.4s ease-in-out infinite}@keyframes gmB{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}' +
      '.gm-shake{animation:gmS .5s}@keyframes gmS{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}' +
      '.gm-glow{animation:gmG 1.2s ease-in-out 2}@keyframes gmG{50%{box-shadow:0 0 0 4px rgba(52,211,153,.55)}}' +
      '.gm-bar{height:100%;border-radius:9999px;transition:width .8s cubic-bezier(.3,1.2,.4,1)}' +
      '.gm-chip{position:absolute;font-weight:800;font-size:12px;pointer-events:none;animation:gmF 1.4s ease-out forwards;text-shadow:0 1px 3px #000}@keyframes gmF{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-34px)}}' +
      '.gm-dot{width:9px;height:9px;border-radius:50%;background:#334155;transition:background .3s,transform .3s}.gm-dot.on{background:#f59e0b;transform:scale(1.35)}.gm-dot.b{background:#34d399}.gm-dot.o{background:#fbbf24}.gm-dot.x{background:#f87171}' +
      '.gm-crown{display:inline-block;animation:gmC 1.8s ease-in-out infinite}@keyframes gmC{0%,100%{transform:rotate(-8deg) scale(1)}50%{transform:rotate(8deg) scale(1.15)}}' +
      '@media (prefers-reduced-motion:reduce){.gm-in,.gm-pop,.gm-bounce,.gm-shake,.gm-glow,.gm-crown{animation:none!important}.gm-bar,.gm-dot{transition:none}.gm-chip{animation:none;opacity:0}}';
    document.head.appendChild(c);
  }

  /* ---------- saved data ---------- */
  function save(v) { if (v) { lsSet('pw_game', v); return v; } var g = lsGet('pw_game', {}); g.done = g.done || {}; g.runs = g.runs || 0; return g; }
  function rankFor(score) { var r = D.RANKS[0]; D.RANKS.forEach(function (x) { if (score >= x[0]) r = x; }); return r; }
  function lvlList(l) { var out = []; for (var i = l * 10; i < l * 10 + 10; i++) out.push(i); return out; }
  var S = { mode: 'menu', lvl: 0, i: 0, m: { rep: 50, ally: 50, str: 30 }, picks: [], opt: [], chosen: -1, prev: null };

  function meters(old, now) {
    var row = function (lab, key, col, hint) {
      return '<div class="mb-1.5"><div class="flex justify-between text-[10px] font-bold text-slate-300 mb-0.5"><span>' + lab + '</span><span class="gm-val" data-key="' + key + '">' + Math.round(now[key]) + '</span></div><div class="h-2 rounded-full bg-slate-700 overflow-hidden" role="progressbar" aria-label="' + lab + '" aria-valuenow="' + Math.round(now[key]) + '" aria-valuemin="0" aria-valuemax="100"><div class="gm-bar ' + col + '" style="width:' + Math.round(old[key]) + '%" data-w="' + Math.round(now[key]) + '"></div></div></div>';
    };
    return '<div class="' + CARD + ' mb-3">' + row('⭐ Reputation', 'rep', 'bg-amber-400') + row('🤝 Allies', 'ally', 'bg-emerald-400') + row('😰 Stress (keep it low)', 'str', 'bg-rose-400') + '</div>';
  }
  function animateBars() { setTimeout(function () { var b = document.querySelectorAll('#game-body .gm-bar'); for (var i = 0; i < b.length; i++) b[i].style.width = b[i].getAttribute('data-w') + '%'; }, 60); }

  /* ---------- screens ---------- */
  function render() {
    var box = $('game-body'); if (!box) return; css();
    if (S.mode === 'play') box.innerHTML = playHTML(); else if (S.mode === 'result') box.innerHTML = resultHTML(); else if (S.mode === 'end') box.innerHTML = endHTML(); else box.innerHTML = menuHTML();
    animateBars();
    if (S.mode === 'end') countUp();
  }
  function totalAvg(g) { var k = Object.keys(g.done); if (!k.length) return 0; var t = 0; k.forEach(function (x) { t += g.done[x].score; }); return Math.round(t / k.length); }
  function menuHTML() {
    var g = save(), n = Object.keys(g.done).length, avg = totalAvg(g), rk = rankFor(avg);
    var h = '<div class="text-center mb-3 gm-in"><div class="text-5xl gm-bounce">🎮</div><p class="text-[11px] text-slate-300 leading-snug mt-1">30 short office stories. Pick the smartest move. There is no timer. Take your time and think like a strategist.</p></div>';
    if (n) h += '<div class="' + CARD + ' mb-3 gm-pop"><p class="text-[10px] text-slate-400 font-bold">YOUR CAREER RANK</p><p class="text-lg font-extrabold text-white">' + rk[2] + ' ' + rk[1] + '</p><p class="text-[10px] text-slate-400">Average best score ' + avg + ' / 100 · ' + n + ' of 3 levels done · ' + g.runs + ' game' + (g.runs === 1 ? '' : 's') + ' played</p></div>';
    h += '<div class="space-y-2.5">';
    D.LEVELS.forEach(function (L, i) {
      var open = i === 0 || g.done[i - 1], d = g.done[i], rk2 = d ? rankFor(d.score) : null;
      h += '<button ' + (open ? 'onclick="gmStart(' + i + ')"' : 'disabled aria-disabled="true"') + ' class="gm-in w-full text-left p-3.5 rounded-2xl border ' + (open ? 'bg-slate-900/70 border-slate-600 hover:border-amber-400 active:scale-98' : 'bg-slate-900/40 border-slate-800 opacity-60') + '" style="animation-delay:' + (i * 90) + 'ms"><div class="flex items-center gap-3"><span class="text-3xl">' + (open ? L.e : '🔒') + '</span><div class="flex-1"><p class="text-sm font-bold text-white">Level ' + (i + 1) + ': ' + L.n + '</p><p class="text-[11px] text-slate-400">' + L.d + ' · 10 stories</p>' +
        (d ? '<p class="text-[11px] text-amber-300 font-bold mt-0.5">Best: ' + d.score + ' / 100 · ' + rk2[2] + ' ' + rk2[1] + '</p>' : open ? '<p class="text-[11px] text-emerald-300 font-bold mt-0.5">Tap to play</p>' : '<p class="text-[11px] text-slate-500 mt-0.5">Finish Level ' + i + ' to unlock</p>') + '</div>' + (open ? '<span class="text-amber-400">▶</span>' : '') + '</div></button>';
    });
    h += '</div><div class="' + CARD + ' mt-3"><p class="text-xs font-bold text-amber-400 mb-1">How it works</p><ul class="list-disc ml-4 space-y-1 text-[11px] text-slate-300 leading-snug"><li>Each story has 3 choices. One is best, one is okay, one is risky.</li><li>Watch 3 meters: <b>Reputation</b>, <b>Allies</b> and <b>Stress</b>.</li><li>Best move = 10 points. Okay = 5. Risky = 0. Each level is 100 points.</li><li>After every choice you learn why, and which strategy it matches.</li></ul></div>';
    return h;
  }
  function dots() { var h = '<div class="flex justify-center gap-1.5 mb-3" aria-hidden="true">'; for (var i = 0; i < 10; i++) { var p = S.picks[i]; h += '<span class="gm-dot ' + (p ? p.q : (i === S.i ? 'on' : '')) + '"></span>'; } return h + '</div>'; }
  function sc() { return D.GAME[S.lvl * 10 + S.i]; }
  function playHTML() {
    var s = sc(), L = D.LEVELS[S.lvl], old = S.m;
    var h = '<div class="flex items-center justify-between mb-2"><button onclick="gmMenu()" class="text-[11px] text-slate-400 underline">← Levels</button><span class="text-[11px] font-bold text-amber-300">' + L.e + ' Level ' + (S.lvl + 1) + ' · Story ' + (S.i + 1) + ' of 10</span></div>' + dots() + meters(old, old);
    h += '<div id="gm-card" class="gm-in p-4 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-800 border border-amber-500/30 mb-3"><div class="flex items-center justify-center gap-3 mb-2"><span class="text-5xl gm-bounce" aria-hidden="true">' + s[1] + '</span><span class="text-4xl gm-bounce" style="animation-delay:.3s" aria-hidden="true">' + s[2] + '</span></div><h3 class="text-center text-base font-extrabold text-white mb-1">' + esc(s[0]) + '</h3><p class="text-xs text-slate-200 leading-relaxed text-center" id="gm-story">' + esc(s[3]) + '</p><div class="text-center mt-2"><button type="button" onclick="pwSpeak(document.getElementById(\'gm-story\').innerText,this)" class="px-2 py-1 ' + BTN + 'bg-slate-700 text-slate-200">🔊 Listen</button></div></div>';
    h += '<p class="text-[11px] font-bold text-amber-400 mb-1.5">What do you do?</p><div class="space-y-2">';
    S.opt.forEach(function (k, n) { h += '<button onclick="gmPick(' + k + ',this)" class="gm-pop w-full text-left p-3 rounded-2xl bg-slate-900/70 border border-slate-600 hover:border-amber-400 text-xs text-slate-100 leading-snug active:scale-98" style="animation-delay:' + (200 + n * 120) + 'ms"><span class="font-extrabold text-amber-400 mr-1">' + 'ABC'.charAt(n) + '.</span> ' + esc(s[6][k][0]) + '</button>'; });
    return h + '</div>';
  }
  function chip(txt, good, left, top) { return '<span class="gm-chip" style="left:' + left + '%;top:' + top + 'px;color:' + (good ? '#34d399' : '#f87171') + '">' + txt + '</span>'; }
  function resultHTML() {
    var s = sc(), c = s[6][S.chosen], q = c[5], head = q === 'b' ? ['🌟 Best move!', 'text-emerald-300', 'border-emerald-500/60 gm-glow'] : q === 'o' ? ['👍 Okay move', 'text-amber-300', 'border-amber-500/60'] : ['💥 Risky move', 'text-rose-300', 'border-rose-500/60 gm-shake'];
    var best = null; s[6].forEach(function (x) { if (x[5] === 'b') best = x; });
    var d = function (v, lab, lowGood) { var good = lowGood ? v <= 0 : v >= 0; return '<span class="px-2 py-1 rounded-lg text-[10px] font-bold ' + (good ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300') + '">' + (v > 0 ? '+' : '') + v + ' ' + lab + '</span>'; };
    var h = '<div class="flex items-center justify-between mb-2"><button onclick="gmMenu()" class="text-[11px] text-slate-400 underline">← Levels</button><span class="text-[11px] font-bold text-amber-300">Story ' + (S.i + 1) + ' of 10</span></div>' + dots() + meters(S.prev, S.m);
    h += '<div id="gm-card" class="relative gm-in p-4 rounded-3xl bg-slate-900 border-2 ' + head[2] + ' mb-3"><p class="text-center text-lg font-extrabold gm-pop ' + head[1] + '">' + head[0] + '</p>' +
      '<p class="text-[11px] text-slate-400 mt-2 leading-snug">You chose: <b class="text-slate-200">' + esc(c[0]) + '</b></p><p class="text-xs text-slate-100 mt-2 leading-relaxed">' + esc(c[1]) + '</p>' +
      '<div class="flex flex-wrap gap-1.5 mt-3">' + d(c[2], 'Reputation') + d(c[3], 'Allies') + d(c[4], 'Stress', true) + '</div></div>';
    if (q !== 'b') h += '<div class="' + CARD + ' mb-3 gm-in"><p class="text-[10px] font-bold text-emerald-300 mb-1">THE BEST MOVE WAS</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(best[0]) + '</p></div>';
    h += '<div class="' + CARD + ' mb-3 gm-in" style="animation-delay:.15s"><p class="text-xs font-bold text-amber-400 mb-1">💡 Lesson</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(s[4]) + '</p>' + (STRAT_NAME[s[5]] ? '<button onclick="goToStep(\'' + s[5] + '\',5)" class="mt-2 px-2 py-1 ' + BTN + 'bg-slate-700 text-amber-300">🏰 Related: ' + STRAT_NAME[s[5]] + '</button>' : '') + '</div>';
    h += '<button onclick="gmNext()" class="w-full py-3 ' + BTN + 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold">' + (S.i >= 9 ? '🏁 See my result' : 'Next story →') + '</button>';
    return h;
  }
  function totalScore() { var t = 0; S.picks.forEach(function (p) { t += PTS[p.q]; }); return t; }
  function endHTML() {
    var tot = totalScore(), rk = rankFor(tot), g = save(), nextOpen = S.lvl < 2, h;
    h = '<div class="text-center gm-in mb-3"><div class="text-5xl gm-crown" aria-hidden="true">' + rk[2] + '</div><p class="text-[11px] text-slate-400 font-bold mt-1">LEVEL ' + (S.lvl + 1) + ' COMPLETE</p><p class="text-4xl font-extrabold text-white"><span id="gm-score">0</span><span class="text-lg text-slate-400"> / 100</span></p><p class="text-lg font-extrabold text-amber-300">' + rk[1] + '</p>' + (S.newBest ? '<p class="text-[11px] text-emerald-300 font-bold gm-pop">🎉 New best score!</p>' : '') + '</div>' + meters({ rep: 50, ally: 50, str: 30 }, S.m);
    h += '<div class="' + CARD + ' mb-3 gm-in"><p class="text-xs font-bold text-amber-400 mb-1">Your moves</p>' + S.picks.map(function (p, i) { var s = D.GAME[S.lvl * 10 + i]; return '<div class="flex items-center gap-2 py-1 border-b border-slate-800 last:border-0"><span>' + (p.q === 'b' ? '🌟' : p.q === 'o' ? '👍' : '💥') + '</span><span class="flex-1 text-[11px] text-slate-200">' + esc(s[0]) + '</span><span class="text-[10px] text-slate-400">' + PTS[p.q] + '</span></div>'; }).join('') + '</div>';
    h += '<div class="grid grid-cols-2 gap-2 mb-2"><button onclick="gmStart(' + S.lvl + ')" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">🔁 Play again</button>' + (nextOpen ? '<button onclick="gmStart(' + (S.lvl + 1) + ')" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">Next level ▶</button>' : '<button onclick="gmMenu()" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">Levels</button>') + '</div>' +
      '<div class="grid grid-cols-3 gap-2"><button onclick="gmShare()" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">📤 Share</button><button onclick="gmPlan()" class="py-2.5 ' + BTN + 'bg-sky-600 text-white">➕ Plan</button><button onclick="gmMenu()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">☰ Levels</button></div>';
    return h;
  }
  function countUp() { var el = $('gm-score'); if (!el) return; var to = totalScore(), n = 0, step = Math.max(1, Math.round(to / 25)); (function t() { n = Math.min(to, n + step); el.textContent = n; if (n < to) setTimeout(t, 30); })(); }

  /* ---------- actions ---------- */
  window.gmStart = function (l) {
    var g = save(); if (l > 0 && !g.done[l - 1]) { toast('Finish the earlier level first'); return; }
    S = { mode: 'play', lvl: l, i: 0, m: { rep: 50, ally: 50, str: 30 }, picks: [], opt: shuffle([0, 1, 2]), chosen: -1, prev: null };
    render(); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { }
  };
  window.gmMenu = function () { if (window.pwStop) window.pwStop(); S.mode = 'menu'; render(); };
  window.gmPick = function (k, btn) {
    if (S.mode !== 'play') return; var s = sc(), c = s[6][k];
    S.prev = { rep: S.m.rep, ally: S.m.ally, str: S.m.str };
    S.m = { rep: clamp(S.m.rep + c[2]), ally: clamp(S.m.ally + c[3]), str: clamp(S.m.str + c[4]) };
    S.picks.push({ s: S.lvl * 10 + S.i, c: k, q: c[5] }); S.chosen = k; S.mode = 'result';
    if (window.pwStop) window.pwStop();
    render();
    var card = $('gm-card');
    if (card) {
      var chips = chip((c[2] > 0 ? '+' : '') + c[2] + ' ⭐', c[2] >= 0, 8, 6) + chip((c[3] > 0 ? '+' : '') + c[3] + ' 🤝', c[3] >= 0, 42, 22) + chip((c[4] > 0 ? '+' : '') + c[4] + ' 😰', c[4] <= 0, 74, 6);
      card.insertAdjacentHTML('beforeend', chips); setTimeout(function () { var x = card.querySelectorAll('.gm-chip'); for (var i = 0; i < x.length; i++) x[i].remove(); }, 1500);
      if (c[5] === 'b' && window.pwBurst) { var r = card.getBoundingClientRect(); try { window.pwBurst(r.left + r.width / 2, r.top + 30, false, '🌟'); } catch (e) { } }
      if (c[5] === 'x' && navigator.vibrate) { try { navigator.vibrate(90); } catch (e) { } }
      try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
    }
  };
  window.gmNext = function () {
    if (S.mode !== 'result') return;
    if (S.i >= 9) { finish(); return; }
    S.i++; S.opt = shuffle([0, 1, 2]); S.mode = 'play'; render(); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { }
  };
  function finish() {
    var g = save(), tot = totalScore(), old = g.done[S.lvl];
    S.newBest = !old || tot > old.score; if (S.newBest) g.done[S.lvl] = { score: tot, rank: rankFor(tot)[1], at: isoDay() };
    g.runs = (g.runs || 0) + 1; save(g); S.mode = 'end'; render(); checkBadges();
    if (window.pwBurst && tot >= 65) { try { window.pwBurst(window.innerWidth / 2, window.innerHeight / 3, true, rankFor(tot)[2]); } catch (e) { } }
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) { }
  }
  window.gmShare = function () {
    var tot = totalScore(), rk = rankFor(tot), t = 'I scored ' + tot + '/100 in Level ' + (S.lvl + 1) + ' (' + D.LEVELS[S.lvl].n + ') of the Office Politics Game and reached the rank ' + rk[1] + ' ' + rk[2] + '. Promotion Warfare by HiProgress.';
    if (navigator.share) navigator.share({ title: 'Office Politics Game', text: t }).catch(function () { });
    else if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast('Score copied ✓'); }, function () { toast('Could not copy'); });
    else toast('Sharing is not available');
  };
  window.gmPlan = function () {
    var worst = null; S.picks.forEach(function (p) { if (p.q === 'x' && !worst) worst = p; }); if (!worst) S.picks.forEach(function (p) { if (p.q === 'o' && !worst) worst = p; });
    var s = worst ? D.GAME[worst.s] : D.GAME[S.lvl * 10 + 9];
    window.addMove('game-' + S.lvl + '-' + (worst ? worst.s : 'x'), (worst ? 'Practice this lesson: ' : 'Keep this habit: ') + s[4]);
  };

  /* ---------- hooks ---------- */
  function onPage(id) { if (id === 'step-game') { if (S.mode === 'result' || S.mode === 'end') { /* keep */ } render(); } else if (S.mode === 'play' || S.mode === 'result') { /* progress stays in memory */ } }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); try { onPage(id); } catch (e) { console.error(e); } };
  window.PW10G = { state: function () { return S; }, scoreOf: totalScore };
})();
