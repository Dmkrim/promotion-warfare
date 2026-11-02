/* Promotion Warfare V12 visuals: page maker, quest stamp, streak flame + freeze, liquid meters, hologram pyramid, spring drop,
   dossier cards, badge pop-up upgrade, journey + skill tree, progress dashboard, monthly recap, parallax classes. */
(function () {
  'use strict';
  var P = window.PW12, $ = function (id) { return document.getElementById(id); };
  var esc = P.esc, lsGet = P.lsGet, lsSet = P.lsSet, toast = P.toast, iso = P.isoDay;
  function num(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
  function moves() { try { return myMoves || []; } catch (e) { return []; } }
  function mapRows() { try { return mapData || []; } catch (e) { return []; } }
  function badgesAll() { return (window.PW6 && window.PW6.BADGES) || []; }
  function gameDone() { var g = lsGet('pw_game', { done: {} }); return Object.keys(g.done || {}).length; }
  function bossWins() { var b = lsGet('pw_boss12', { won: {} }); return Object.keys(b.won || {}).length; }

  /* ================= page maker ================= */
  P.mkPage = function (id, emoji, title, sub, color, bodyId) {
    if ($(id)) return $(id); var main = $('app-main') || document.querySelector('main'); if (!main) return null;
    var s = document.createElement('section'); s.id = id; s.className = 'hidden card-enter bg-slate-800/90 backdrop-blur-md border border-' + color + '-500/40 rounded-3xl p-5 shadow-2xl';
    s.innerHTML = '<div class="flex items-center space-x-3 mb-3"><span class="w-10 h-10 rounded-2xl bg-' + color + '-500/20 flex items-center justify-center font-bold text-lg">' + emoji + '</span><div><h2 class="text-lg font-bold text-white">' + esc(title) + '</h2><p class="text-[11px] text-' + color + '-400 font-medium">' + esc(sub) + '</p></div></div>' +
      '<div id="' + bodyId + '" data-noswipe></div>' +
      '<button onclick="goToStep(\'step-tools\', 0)" class="mt-4 w-full py-2.5 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition"><i class="fa-solid fa-arrow-left"></i> Back to Career Tools</button>';
    main.appendChild(s); return s;
  };
  P.pages = P.pages || {}; P.onPage = function (id, fn) { P.pages[id] = fn; };

  /* ================= activity log for XP (feeds dashboard and recap) ================= */
  var _add = P.addXP;
  P.addXP = function (n, why, once) { var r = _add(n, why, once); if (r) { var a = lsGet('pw_act', {}), d = iso(); a[d] = num(a[d]) + n; var ks = Object.keys(a).sort(); while (ks.length > 120) delete a[ks.shift()]; lsSet('pw_act', a); } return r; };

  /* ================= quest stamp ================= */
  P.onMoveDone = function (i) {
    var row = $('my-moves') && $('my-moves').children[i]; if (!row) return; P.fb('stamp');
    if (P.fx() === 'off') return;
    var st = document.createElement('div'); st.className = 'qs-stamp'; st.innerHTML = '<span>QUEST COMPLETED</span>'; row.style.position = 'relative'; row.appendChild(st);
    row.classList.add('qs-row'); setTimeout(function () { st.remove(); row.classList.remove('qs-row'); }, 1900);
    if (P.fx() === 'full') { var r = row.getBoundingClientRect(); if (window.pwBurst) try { window.pwBurst(r.left + r.width * .8, r.top + r.height / 2, false, '✅'); } catch (e) { } }
  };

  /* ================= streak flame + freeze ================= */
  function streakCalc() {
    var st = lsGet('pw_daily', {}), set = st.done || {}, today = iso(), n = 0, d = new Date(); if (!set[today]) d.setDate(d.getDate() - 1);
    while (set[iso(d)]) { n++; d.setDate(d.getDate() - 1); } return n;
  }
  function freezeLogic() {
    var fz = lsGet('pw_freeze', { tokens: 0, granted: {}, used: [] }), st = lsGet('pw_daily', {}), set = st.done = st.done || {}, ch = false;
    var y = new Date(); y.setDate(y.getDate() - 1); var yi = iso(y), b = new Date(); b.setDate(b.getDate() - 2); var bi = iso(b);
    if (!set[yi] && set[bi] && fz.tokens > 0) { set[yi] = 1; fz.tokens--; fz.used.push(yi); lsSet('pw_daily', st); ch = true; setTimeout(function () { toast('❄️ Streak freeze used. Your streak is safe!'); }, 800); }
    var s = streakCalc(); [7, 14, 30].forEach(function (m) { if (s >= m && !fz.granted[m]) { fz.granted[m] = 1; fz.tokens = Math.min(2, fz.tokens + 1); ch = true; setTimeout(function () { toast('❄️ You earned a streak freeze!'); }, 900); } });
    if (ch) lsSet('pw_freeze', fz); return fz;
  }
  function renderFlame() {
    var wel = $('step-welcome'); if (!wel) return; var box = $('flame-chip');
    if (!box) { var xc = $('xp-chip') || $('daily-card'); if (!xc) return; box = document.createElement('button'); box.id = 'flame-chip'; box.setAttribute('data-noswipe', ''); box.className = 'w-full text-left mb-3 p-2.5 rounded-2xl bg-slate-900/60 border border-orange-500/30 active:scale-98 flex items-center gap-3'; box.onclick = function () { var d = $('daily-card'); if (d) d.scrollIntoView({ behavior: P.fx() === 'off' ? 'auto' : 'smooth', block: 'center' }); }; xc.parentNode.insertBefore(box, xc); }
    var n = streakCalc(), fz = lsGet('pw_freeze', { tokens: 0 }), sz = Math.min(54, 26 + n * 1.6), hot = n >= 7, mega = n >= 30;
    box.innerHTML = '<span class="flame' + (n ? '' : ' flame-off') + '" style="width:' + sz + 'px;height:' + (sz * 1.2) + 'px"><svg viewBox="0 0 40 52" width="100%" height="100%" aria-hidden="true"><path d="M20 2c3 9 15 14 15 29a15 15 0 0 1-30 0c0-7 4-11 7-14 0 5 2 7 4 8-1-9 1-16 4-23z" fill="' + (n ? (hot ? '#f97316' : '#fb923c') : '#64748b') + '"/><path d="M20 24c2 5 8 8 8 15a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 4 2 4-1-5 0-8 2-11z" fill="' + (n ? (mega ? '#bae6fd' : '#fde047') : '#94a3b8') + '"/></svg></span>' +
      '<span class="flex flex-col leading-tight"><b class="text-white text-[13px]">' + (n ? n + '-day streak' : 'No streak yet') + '</b><small class="text-[10px] text-slate-400">' + (n ? 'Do the daily challenge to keep it burning.' : 'Finish today\'s daily challenge to start one.') + '</small></span>' +
      '<span class="ml-auto text-[11px] font-bold text-sky-300" title="Streak freezes save one missed day">❄️ ' + num(fz.tokens) + '</span>';
  }

  /* ================= liquid meters ================= */
  var lq = 0;
  P.liquid = function (pct, label, color) {
    pct = Math.max(0, Math.min(100, Math.round(pct))); var id = 'lq' + (++lq), y = 78 - pct * 0.7;
    return '<div class="liq text-center"><svg viewBox="0 0 60 88" width="64" height="94" aria-label="' + esc(label) + ' ' + pct + ' percent"><defs><clipPath id="' + id + '"><path d="M20 4h20v12c0 5 14 8 14 22v38a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V38c0-14 14-17 14-22z"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')"><rect width="60" height="88" fill="#0f172a"/><g class="liq-lv" style="transform:translateY(' + y + 'px)"><g class="liq-wv"><path d="M-60 0q15-7 30 0t30 0 30 0 30 0 30 0v90h-150z" fill="' + color + '" opacity=".55"/></g><g class="liq-wv liq-wv2"><path d="M-60 2q15-6 30 0t30 0 30 0 30 0 30 0v90h-150z" fill="' + color + '"/></g></g></g>' +
      '<path d="M20 4h20v12c0 5 14 8 14 22v38a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V38c0-14 14-17 14-22z" fill="none" stroke="#94a3b8" stroke-width="2"/><text x="30" y="58" text-anchor="middle" font-size="14" font-weight="800" fill="#fff" stroke="#0f172a" stroke-width=".6">' + pct + '%</text></svg><p class="text-[10px] text-slate-300 font-bold -mt-1">' + esc(label) + '</p></div>';
  };
  function renderLiquidPlan() {
    var bar = $('power-bar'); if (!bar) return; var wrap = $('liq-plan');
    if (!wrap) { wrap = document.createElement('div'); wrap.id = 'liq-plan'; wrap.className = 'flex justify-around mb-3'; var host = bar.parentNode.parentNode; host.parentNode.insertBefore(wrap, host.nextSibling); }
    var m = moves(), done = m.filter(function (x) { return x.done; }).length, pw = parseInt(($('stat-power') || {}).textContent, 10) || 0;
    wrap.innerHTML = P.liquid(pw, 'Power', '#10b981') + P.liquid(m.length ? done / m.length * 100 : 0, 'My moves', '#38bdf8') + P.liquid(P.fraction(), 'Level', '#fbbf24');
  }
  P.fraction = function () { var L = P.levelOf(P.xp()); return (P.xp() - L.from) / (L.to - L.from) * 100; };

  /* ================= hologram pyramid ================= */
  var rotY = 0, rotX = 0, drag = null, lastRanks = null;
  function myTier() { var me = lsGet('pw_me_name', ''), r = mapRows().filter(function (d) { return me && d.name === me; })[0]; return r ? parseInt(r.rank, 10) : 0; }
  function holoHtml() {
    var t = myTier() || 4, ys = { 1: 18, 2: 62, 3: 106, 4: 150 }, cl = ['#fbbf24', '#a855f7', '#38bdf8', '#34d399'];
    var L = ''; for (var i = 0; i < 4; i++) { var top = i * 44, w0 = (i * 25), w1 = ((i + 1) * 25); var pts = (50 - w0 / 2) + '% 0,' + (50 + w0 / 2) + '% 0,' + (50 + w1 / 2) + '% 100%,' + (50 - w1 / 2) + '% 100%'; for (var z = -1; z <= 1; z += 2) L += '<div class="hl" style="top:' + top + 'px;clip-path:polygon(' + pts + ');--c:' + cl[i] + ';transform:translateZ(' + (z * 26) + 'px)"></div>'; L += '<div class="hl hl-m" style="top:' + top + 'px;clip-path:polygon(' + pts + ');--c:' + cl[i] + '"></div>'; }
    return '<div class="holo-stage"><div class="holo-pyr" id="holo-pyr">' + L + '<div class="holo-av" id="holo-av" style="top:' + (ys[t] - 6) + 'px">🧑‍💼</div></div></div><p class="text-[10px] text-center text-slate-400 -mt-1 mb-2">' + (myTier() ? 'You are in Tier ' + myTier() + '. Drag the pyramid to turn it.' : 'Set your name in the map to see yourself climb. Drag to turn.') + '</p>';
  }
  function renderHolo() {
    var c = $('pyramid-container'); if (!c) return; var h = $('holo'); if (!h) { h = document.createElement('div'); h.id = 'holo'; h.setAttribute('data-noswipe', ''); c.parentNode.insertBefore(h, c); bindHolo(h); }
    var t = myTier() || 4; var prev = h.getAttribute('data-t');
    if (prev === String(t) && h.firstChild) { return; }
    var oldAv = $('holo-av'), oldTop = oldAv ? oldAv.style.top : null; h.innerHTML = holoHtml(); h.setAttribute('data-t', t); applyRot();
    var av = $('holo-av'); if (av && oldTop && prev && P.fx() !== 'off') { var nt = av.style.top; av.style.top = oldTop; void av.offsetWidth; av.style.top = nt; av.classList.add('holo-jump'); P.fb('good'); setTimeout(function () { av.classList.remove('holo-jump'); }, 1000); }
  }
  function applyRot() { var p = $('holo-pyr'); if (!p) return; var on = P.fx() === 'full', gx = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gx')) || 0, gy = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gy')) || 0; p.style.transform = on ? 'rotateX(' + (-12 + rotX + gy * 12) + 'deg) rotateY(' + (rotY + gx * 18) + 'deg)' : 'none'; }
  function bindHolo(h) {
    h.addEventListener('pointerdown', function (e) { if (P.fx() !== 'full') return; drag = { x: e.clientX, y: e.clientY, ry: rotY, rx: rotX }; var p = $('holo-pyr'); if (p) p.style.transition = 'none'; try { h.setPointerCapture(e.pointerId); } catch (x) { } });
    h.addEventListener('pointermove', function (e) { if (!drag) return; rotY = Math.max(-80, Math.min(80, drag.ry + (e.clientX - drag.x) * .6)); rotX = Math.max(-25, Math.min(25, drag.rx - (e.clientY - drag.y) * .3)); applyRot(); });
    var end = function () { if (!drag) return; drag = null; rotY = 0; rotX = 0; var p = $('holo-pyr'); if (p) { p.style.transition = 'transform .9s cubic-bezier(.2,1.6,.4,1)'; applyRot(); } };
    h.addEventListener('pointerup', end); h.addEventListener('pointercancel', end);
    window.addEventListener('deviceorientation', function () { if (!drag) applyRot(); }, { passive: true });
  }
  /* spring drop: mark people that changed tier */
  function watchPyramid() {
    var c = $('pyramid-container'); if (!c || c._w) return; c._w = 1;
    new MutationObserver(function () {
      var now = {}; mapRows().forEach(function (d, i) { now[i] = String(d.rank); });
      if (lastRanks && P.fx() !== 'off') { c.querySelectorAll('.pm').forEach(function (el) { var i = el.getAttribute('data-i'); if (lastRanks[i] != null && lastRanks[i] !== now[i]) { el.classList.add('pm-spring'); P.fb('good'); setTimeout(function () { el.classList.remove('pm-spring'); }, 900); } }); }
      lastRanks = now; renderHolo();
    }).observe(c, { childList: true });
    var now = {}; mapRows().forEach(function (d, i) { now[i] = String(d.rank); }); lastRanks = now;
  }

  /* ================= dossier (cheat sheet) ================= */
  function watchCheat() {
    var c = $('cheat-list'); if (!c || c._w) return; c._w = 1;
    function dress() {
      if (P.fx() !== 'full') return; Array.prototype.forEach.call(c.children, function (el, i) {
        if (el.classList.contains('dos') || el.tagName === 'P' || el.getAttribute('data-open')) return; el.classList.add('dos'); var cap = document.createElement('div'); cap.className = 'dos-cap'; cap.innerHTML = '<span>🔒 CLASSIFIED</span><small>Tap to declassify</small>';
        el.style.position = 'relative'; el.appendChild(cap);
        cap.onclick = function () { P.fb('stamp'); el.classList.add('dos-open'); el.setAttribute('data-open', '1'); setTimeout(function () { cap.remove(); el.classList.remove('dos'); }, 600); };
      });
    }
    new MutationObserver(function () { setTimeout(dress, 0); }).observe(c, { childList: true }); dress();
  }

  /* ================= badge pop-up: bounce, flip, rarity ================= */
  var RARE = { gmall: 'epic', lvl8: 'epic', bossall: 'epic', lvl5: 'rare', bossw: 'rare', gmplay: 'rare', spin3: 'rare', bingo: 'rare' };
  (function () {
    new MutationObserver(function (m) {
      var n = $('badge-pop'); if (!n || !n.classList.contains('bp-on') || n._u) return; n._u = 1; setTimeout(function () { n._u = 0; }, 3500);
      var b = n.querySelector('b'), name = b ? b.textContent : '', def = badgesAll().filter(function (x) { return x.n === name; })[0], r = (def && RARE[def.id]) || 'common';
      n.setAttribute('data-r', r); var tag = n.querySelector('small'); if (tag) tag.textContent = ({ common: 'Badge unlocked!', rare: '★ Rare badge!', epic: '✦ Epic badge!' })[r];
      var e = n.querySelector('.bp-e'); if (e && P.fx() === 'full') { e.classList.remove('bp-flip'); void e.offsetWidth; e.classList.add('bp-flip'); }
    }).observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  })();

  /* ================= Journey + skill tree ================= */
  var SKILLS = [
    { e: '🛡️', n: 'Defense', h: 'Complete moves in your Action Plan', th: [1, 5, 15], v: function () { return moves().filter(function (x) { return x.done; }).length; } },
    { e: '🗺️', n: 'Mapping', h: 'Add people to your Power Map', th: [3, 8, 15], v: function () { return mapRows().filter(function (d) { return d.name && d.name.trim(); }).length; } },
    { e: '🏅', n: 'Proof', h: 'Save wins in your Wins Journal', th: [1, 5, 15], v: function () { return lsGet('pw_wins_log', []).length; } },
    { e: '🎮', n: 'Savvy', h: 'Finish levels of the Office Politics Game', th: [1, 4, 10], v: gameDone },
    { e: '👹', n: 'Fighter', h: 'Beat bosses in Boss Battles', th: [1, 3, 6], v: bossWins },
    { e: '🔥', n: 'Habit', h: 'Reach a daily streak (days)', th: [3, 7, 30], v: function () { return Math.max(streakCalc(), num((lsGet('pw_streakbest', 0)))); } }
  ];
  function renderJourney() {
    var b = $('journey-body'); if (!b) return; var xp = P.xp(), L = P.levelOf(xp), N = 9, pts = [];
    for (var i = 0; i < N; i++) { pts.push([30 + (i % 2 ? 250 - (i * 3) % 7 : 40 + (i * 5) % 9), 330 - i * 38]); }
    var d = 'M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' S ').replace(/ S /g, ' L ');
    var path = 'M' + pts[0][0] + ' ' + pts[0][1]; for (var k = 1; k < N; k++) { var a = pts[k - 1], c = pts[k]; path += ' C ' + a[0] + ' ' + (a[1] - 20) + ', ' + c[0] + ' ' + (c[1] + 20) + ', ' + c[0] + ' ' + c[1]; }
    var nodes = pts.map(function (p, i) { var on = L.lvl > i; return '<g class="jn' + (on ? ' jn-on' : '') + (L.lvl === i + 1 ? ' jn-cur' : '') + '" style="animation-delay:' + (i * .12) + 's"><circle cx="' + p[0] + '" cy="' + p[1] + '" r="14" fill="' + (on ? '#f59e0b' : '#1e293b') + '" stroke="' + (on ? '#fde68a' : '#475569') + '" stroke-width="2"/><text x="' + p[0] + '" y="' + (p[1] + 5) + '" text-anchor="middle" font-size="13" font-weight="800" fill="' + (on ? '#1e293b' : '#94a3b8') + '">' + (i + 1) + '</text><text x="' + (p[0] + (p[0] > 160 ? -20 : 20)) + '" y="' + (p[1] + 4) + '" text-anchor="' + (p[0] > 160 ? 'end' : 'start') + '" font-size="10" fill="#cbd5e1">' + ['Rookie', 'Rising Intern', 'Team Player', 'Strategist', 'Power Player', 'Influencer', 'Mastermind', 'Executive', 'Legend'][i] + '</text></g>'; }).join('');
    var cur = pts[Math.min(L.lvl, N) - 1];
    var h = '<p class="text-[11px] text-slate-400 mb-2">Your career journey. Earn XP to climb to the next level.</p><svg id="jr-svg" viewBox="0 0 320 350" class="w-full" role="img" aria-label="Career journey map with level ' + L.lvl + ' reached"><path d="' + path + '" fill="none" stroke="#334155" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 9"/><path id="jr-path" d="' + path + '" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="' + (100 - (Math.min(L.lvl, N) - 1) / (N - 1) * 100) + '"/>' + nodes + '<text class="jr-av" x="' + cur[0] + '" y="' + (cur[1] - 20) + '" text-anchor="middle" font-size="22">🧑‍💼</text></svg>';
    /* skill tree */
    var cx = 160, cy = 270, lines = '', nodesT = '';
    SKILLS.forEach(function (s, bi) {
      var ang = (-75 + bi * 30) * Math.PI / 180, val = s.v(), px = cx, py = cy;
      s.th.forEach(function (t, ti) { var r = 62 + ti * 60, x = cx + r * Math.sin(ang) * .82, y = cy - r * Math.cos(ang), on = val >= t;
        lines += '<line class="sk-ln' + (on ? ' sk-on' : '') + '" x1="' + px + '" y1="' + py + '" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" style="animation-delay:' + (bi * .15 + ti * .25) + 's"/>';
        nodesT += '<g class="sk-nd' + (on ? ' sk-on' : '') + '" data-s="' + bi + '" data-t="' + ti + '" onclick="PW12.skill(' + bi + ',' + ti + ')" style="animation-delay:' + (bi * .15 + ti * .25 + .3) + 's;cursor:pointer"><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (ti === 2 ? 16 : 14) + '"/><text x="' + x.toFixed(1) + '" y="' + (y + 5).toFixed(1) + '" text-anchor="middle" font-size="' + (ti === 2 ? 16 : 14) + '">' + (on ? s.e : '🔒') + '</text></g>'; px = x.toFixed(1); py = y.toFixed(1); });
    });
    h += '<p class="text-sm font-bold text-white mt-4 mb-1">🌳 Skill tree</p><svg viewBox="0 0 320 290" class="w-full" role="img" aria-label="Skill tree">' + lines + '<circle cx="' + cx + '" cy="' + cy + '" r="17" fill="#f59e0b" stroke="#fde68a" stroke-width="2"/><text x="' + cx + '" y="' + (cy + 6) + '" text-anchor="middle" font-size="16">🧑‍💼</text>' + nodesT + '</svg><p id="sk-info" class="text-[11px] text-slate-300 text-center min-h-[2.5em] mt-1">Tap a skill to see how to grow it.</p>';
    b.innerHTML = h;
    if (P.fx() !== 'off') { var jp = $('jr-path'), to = jp.getAttribute('stroke-dashoffset'); jp.style.transition = 'none'; jp.style.strokeDashoffset = 100; void jp.getBoundingClientRect(); jp.style.transition = 'stroke-dashoffset 1.6s ease'; jp.style.strokeDashoffset = to; }
  }
  P.skill = function (bi, ti) { var s = SKILLS[bi], v = s.v(), t = s.th[ti], el = $('sk-info'); if (!el) return; el.innerHTML = '<b>' + s.e + ' ' + esc(s.n) + ' ' + (ti + 1) + '/3</b>: ' + esc(s.h) + '. <span class="' + (v >= t ? 'text-emerald-400' : 'text-amber-300') + '">' + Math.min(v, t) + ' / ' + t + (v >= t ? ' ✓' : '') + '</span>'; P.fb('tap'); };

  /* ================= Dashboard ================= */
  function ring(pct, label, color, val) {
    var C = 2 * Math.PI * 24; pct = Math.max(0, Math.min(100, pct));
    return '<div class="text-center"><svg viewBox="0 0 60 60" width="64" height="64" role="img" aria-label="' + esc(label) + ' ' + Math.round(pct) + ' percent"><circle cx="30" cy="30" r="24" fill="none" stroke="#334155" stroke-width="6"/><circle class="rg-arc" cx="30" cy="30" r="24" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" data-to="' + (C * (1 - pct / 100)).toFixed(1) + '" transform="rotate(-90 30 30)"/><text x="30" y="34" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">' + val + '</text></svg><p class="text-[10px] text-slate-300 font-bold">' + esc(label) + '</p></div>';
  }
  function renderDash() {
    var b = $('dash-body'); if (!b) return; var m = moves(), done = m.filter(function (x) { return x.done; }).length, wins = lsGet('pw_wins_log', []).length, g = gameDone(), bg = badgesAll().length || 1, got = Object.keys(lsGet('pw_badges', {})).length, act = lsGet('pw_act', {}), days = [], mx = 1;
    for (var i = 6; i >= 0; i--) { var d = new Date(); d.setDate(d.getDate() - i); var k = iso(d); days.push({ l: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()], v: num(act[k]) }); } days.forEach(function (x) { if (x.v > mx) mx = x.v; });
    var tot = days.reduce(function (a, x) { return a + x.v; }, 0), pts = [], run = 0; days.forEach(function (x, i) { run += x.v; pts.push([20 + i * 46, 78 - (tot ? run / tot : 0) * 66]); });
    var bars = days.map(function (x, i) { var h = x.v / mx * 70; return '<g><rect class="db-bar" x="' + (10 + i * 46) + '" y="' + (80 - h) + '" width="22" height="' + h + '" rx="4" fill="#38bdf8" style="animation-delay:' + (i * .08) + 's"/><text x="' + (21 + i * 46) + '" y="92" text-anchor="middle" font-size="9" fill="#94a3b8">' + x.l + '</text></g>'; }).join('');
    var h = '<div class="flex justify-around mb-4">' + P.liquid(P.fraction(), 'Next level', '#fbbf24') + P.liquid(m.length ? done / m.length * 100 : 0, 'Moves done', '#38bdf8') + P.liquid(g / ((window.PW10 && PW10.LEVELS && PW10.LEVELS.length) || 10) * 100, 'Game', '#a78bfa') + '</div>' +
      '<div class="flex justify-around mb-4">' + ring(Math.min(100, wins * 10), 'Wins', '#34d399', wins) + ring(got / bg * 100, 'Badges', '#fbbf24', got) + ring(Math.min(100, bossWins() / 6 * 100), 'Bosses', '#f87171', bossWins()) + ring(Math.min(100, streakCalc() / 30 * 100), 'Streak', '#fb923c', streakCalc()) + '</div>' +
      '<p class="text-xs font-bold text-white mb-1">XP in the last 7 days</p><svg viewBox="0 0 330 100" class="w-full" role="img" aria-label="XP per day, last 7 days. Total ' + tot + ' XP">' + bars + '<polyline class="db-line" points="' + pts.map(function (p) { return p[0] + ',' + p[1].toFixed(1); }).join(' ') + '" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" pathLength="100"/></svg><p class="text-[11px] text-slate-400 text-center mt-1">' + tot + ' XP this week' + (tot ? '' : '. Complete a move or a game to start the chart.') + '</p>' +
      '<button onclick="goToStep(\'step-recap\',5)" class="mt-3 w-full py-2.5 rounded-xl bg-violet-600 text-white text-xs font-bold active:scale-95">🎬 Watch my monthly recap</button>';
    b.innerHTML = h;
    b.querySelectorAll('.rg-arc').forEach(function (a) { requestAnimationFrame(function () { a.style.transition = P.fx() === 'off' ? 'none' : 'stroke-dashoffset 1.1s ease'; a.style.strokeDashoffset = a.getAttribute('data-to'); }); });
  }

  /* ================= Monthly recap ================= */
  var rc = { i: 0, t: 0, sl: [] };
  function recapSlides() {
    var mo = new Date(), ym = iso(mo).slice(0, 7), act = lsGet('pw_act', {}), xpm = 0; Object.keys(act).forEach(function (k) { if (k.slice(0, 7) === ym) xpm += num(act[k]); });
    var winsM = lsGet('pw_wins_log', []).filter(function (w) { return (w.iso || '').slice(0, 7) === ym; }).length, done = moves().filter(function (x) { return x.done; }).length, L = P.levelOf(P.xp()), best = Math.max(streakCalc(), 0), got = Object.keys(lsGet('pw_badges', {})).length;
    var name = mo.toLocaleString('en', { month: 'long' });
    return [
      { e: '🎬', big: name, sm: 'Your Promotion Warfare recap', c: '#7c3aed' }, { e: '⚡', big: xpm, sm: 'XP earned this month', c: '#f59e0b' }, { e: '✅', big: done, sm: 'moves completed in your plan', c: '#10b981' },
      { e: '🏅', big: winsM, sm: 'wins saved this month', c: '#0ea5e9' }, { e: '🔥', big: best, sm: 'day streak right now', c: '#f97316' }, { e: '🎖️', big: got, sm: 'badges collected', c: '#db2777' },
      { e: '🌟', big: 'Level ' + L.lvl, sm: L.title + '. Keep going!', c: '#16a34a' }
    ];
  }
  function renderRecap() {
    var b = $('recap-body'); if (!b) return; rc.sl = recapSlides(); rc.i = 0; clearTimeout(rc.t);
    b.innerHTML = '<div id="rc-stage" class="rc-stage" role="region" aria-live="polite"></div><div class="flex gap-1 mt-3" id="rc-dots"></div><div class="flex gap-2 mt-3"><button onclick="PW12.rcGo(-1)" class="flex-1 py-2 rounded-xl bg-slate-700 text-slate-100 text-xs font-bold active:scale-95">◀ Back</button><button onclick="PW12.rcGo(1)" class="flex-1 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold active:scale-95">Next ▶</button></div><p class="text-[10px] text-slate-500 mt-2 text-center">XP and wins are counted from when you started using V12.</p>';
    showSlide();
  }
  function showSlide() {
    var s = rc.sl[rc.i], st = $('rc-stage'); if (!s || !st) return; clearTimeout(rc.t);
    st.style.background = 'linear-gradient(135deg,' + s.c + ',#0f172a)'; st.innerHTML = '<div class="rc-in"><div class="rc-e">' + s.e + '</div><div class="rc-big" id="rc-big">' + (typeof s.big === 'number' ? 0 : esc(s.big)) + '</div><div class="rc-sm">' + esc(s.sm) + '</div></div>';
    if (typeof s.big === 'number') P.tick($('rc-big'), s.big);
    $('rc-dots').innerHTML = rc.sl.map(function (x, i) { return '<span class="rc-d' + (i === rc.i ? ' on' : '') + (i < rc.i ? ' past' : '') + '"></span>'; }).join('');
    P.fb('tap'); if (P.fx() !== 'off' && rc.i < rc.sl.length - 1 && !window.__noAuto) rc.t = setTimeout(function () { P.rcGo(1); }, 3800);
  }
  P.rcGo = function (d) { var n = rc.i + d; if (n < 0) n = 0; if (n >= rc.sl.length) { n = rc.sl.length - 1; if (window.pwBurst && P.fx() === 'full') try { var r = $('rc-stage').getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, r.top + 80, true, '🌟'); } catch (e) { } } rc.i = n; showSlide(); };

  /* ================= tilt classes + page router ================= */
  function tiltify() { ['daily-card', 'weekly-card', 'xp-chip', 'flame-chip'].forEach(function (id) { var e = $(id); if (e) e.classList.add('fx-tilt'); }); }
  P.onPage('step-journey', renderJourney); P.onPage('step-dash', renderDash); P.onPage('step-recap', renderRecap);
  P.onPage('step-action-plan', function () { renderLiquidPlan(); }); P.onPage('step-welcome', function () { freezeLogic(); renderFlame(); tiltify(); });
  P.onPage('step-map-pyramid', function () { watchPyramid(); renderHolo(); }); P.onPage('step-cheat', function () { watchCheat(); });
  var _g = window.goToStep; window.goToStep = function (id, p, fromPop) { var r = _g(id, p, fromPop); try { var f = P.pages[id]; if (f) f(); renderFlame(); P.renderXP(); } catch (e) { console.error(e); } return r; };
  var _rs = window.refreshStats; if (_rs) window.refreshStats = function () { var r = _rs.apply(this, arguments); try { renderLiquidPlan(); } catch (e) { } return r; };
  setInterval(function () { if (!document.hidden) { try { renderFlame(); } catch (e) { } } }, 4000);

  /* ================= styles ================= */
  function css() {
    if ($('v12v-css')) return; var s = document.createElement('style'); s.id = 'v12v-css';
    s.textContent = [
      '.qs-stamp{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;overflow:hidden;border-radius:12px}',
      '.qs-stamp span{border:3px solid #34d399;color:#34d399;font-weight:900;font-size:15px;letter-spacing:.12em;padding:2px 10px;border-radius:6px;background:rgba(2,6,23,.75);text-shadow:0 0 8px #10b981;animation:qsS 1.8s ease-out forwards}',
      '@keyframes qsS{0%{transform:scale(3) rotate(-14deg);opacity:0}18%{transform:scale(1) rotate(-8deg);opacity:1}80%{opacity:1}100%{transform:scale(1) rotate(-8deg);opacity:0}}',
      '.qs-row{animation:qsR .5s}@keyframes qsR{0%{box-shadow:0 0 0 0 #34d399}60%{box-shadow:0 0 0 8px rgba(52,211,153,0)}}',
      'html.fx-full .flame svg{transform-origin:50% 100%;animation:flk 1.1s ease-in-out infinite alternate}@keyframes flk{0%{transform:scale(1,1) skewX(0)}50%{transform:scale(.96,1.06) skewX(3deg)}100%{transform:scale(1.03,.97) skewX(-3deg)}}',
      '.flame{display:inline-block;flex:none}.flame-off svg{filter:grayscale(1);opacity:.6}',
      '.liq svg{display:block;margin:0 auto}.liq-lv{transition:transform 1.2s cubic-bezier(.3,1,.4,1)}.liq-wv{animation:lqW 3.2s linear infinite}.liq-wv2{animation-duration:2.1s;animation-direction:reverse}@keyframes lqW{to{transform:translateX(60px)}}',
      'html.fx-off .liq-wv,html.fx-light .liq-wv{animation:none}',
      '.holo{margin-bottom:6px;touch-action:pan-y}.holo-stage{perspective:700px;height:190px;display:flex;justify-content:center;align-items:center;cursor:grab}',
      '.holo-pyr{position:relative;width:230px;height:176px;transform-style:preserve-3d;transform:rotateX(-12deg)}',
      '.hl{position:absolute;left:0;width:100%;height:42px;background:linear-gradient(180deg,color-mix(in srgb,var(--c) 38%,transparent),color-mix(in srgb,var(--c) 14%,transparent));backface-visibility:visible}',
      '.hl-m{background:color-mix(in srgb,var(--c) 28%,transparent);border:0}',
      '.holo-pyr .hl{filter:drop-shadow(0 0 4px var(--c))}',
      '.holo-av{position:absolute;left:50%;margin-left:-14px;font-size:26px;transform:translateZ(44px);transition:top .9s cubic-bezier(.3,1.5,.4,1);filter:drop-shadow(0 0 6px #fff)}.holo-jump{animation:hJ 1s}@keyframes hJ{40%{transform:translateZ(44px) scale(1.5)}}',
      'html.fx-full .holo-pyr .hl-m{animation:hS 3.2s ease-in-out infinite alternate}@keyframes hS{from{opacity:.55}to{opacity:1}}',
      'html.fx-off .holo-stage,html.fx-light .holo-stage{perspective:none}',
      '.pm-spring{animation:pmSp .85s cubic-bezier(.2,1.6,.4,1)}@keyframes pmSp{0%{transform:translateY(-22px) scale(1.12)}45%{transform:translateY(6px) scale(.96)}70%{transform:translateY(-3px)}100%{transform:none}}',
      '.dos-cap{position:absolute;inset:0;z-index:2;border-radius:16px;background:repeating-linear-gradient(135deg,#1e293b 0 10px,#0f172a 10px 20px);border:2px solid #ef4444;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;gap:2px;color:#fca5a5;font-weight:900;letter-spacing:.15em}.dos-cap small{font-size:10px;font-weight:600;letter-spacing:.05em;color:#94a3b8}',
      '.dos{min-height:84px}.dos-open .dos-cap{animation:dosO .6s ease-in forwards;transform-origin:0 50%}@keyframes dosO{to{transform:perspective(600px) rotateY(-100deg);opacity:0}}',
      '#badge-pop[data-r=rare]{background:linear-gradient(135deg,#0ea5e9,#6366f1)}#badge-pop[data-r=epic]{background:linear-gradient(135deg,#a855f7,#ec4899,#f59e0b);background-size:200% 200%}',
      'html.fx-full #badge-pop[data-r=epic]{animation:bpSh 2s linear infinite}@keyframes bpSh{to{background-position:200% 0}}',
      'html.fx-full #badge-pop.bp-on{transition:top .7s cubic-bezier(.2,1.8,.3,1)}.bp-e.bp-flip{display:inline-block;animation:bpF .9s ease-out}@keyframes bpF{0%{transform:rotateY(0) scale(.4)}60%{transform:rotateY(540deg) scale(1.4)}100%{transform:rotateY(720deg) scale(1)}}',
      '.jn circle{transition:fill .4s}html.fx-full .jn{animation:jnP .5s both}@keyframes jnP{from{opacity:0;transform:scale(.4)}to{opacity:1;transform:none}}.jn{transform-box:fill-box;transform-origin:center}html.fx-full .jn-cur circle{animation:jnC 1.4s ease-in-out infinite}@keyframes jnC{50%{stroke-width:6}}',
      '.jr-av{animation:jrB 1.6s ease-in-out infinite}@keyframes jrB{50%{transform:translateY(-5px)}}html.fx-off .jr-av{animation:none}',
      '.sk-ln{stroke:#334155;stroke-width:3;stroke-dasharray:200;stroke-dashoffset:0}.sk-ln.sk-on{stroke:#fbbf24}html.fx-full .sk-ln{animation:skD .8s both}@keyframes skD{from{stroke-dashoffset:200}to{stroke-dashoffset:0}}',
      '.sk-nd circle{fill:#1e293b;stroke:#475569;stroke-width:2}.sk-nd.sk-on circle{fill:#f59e0b;stroke:#fde68a}html.fx-full .sk-nd{animation:skN .5s both;transform-box:fill-box;transform-origin:center}@keyframes skN{from{opacity:0;transform:scale(0)}to{opacity:1;transform:none}}',
      '.db-bar{transform-box:fill-box;transform-origin:bottom}html.fx-full .db-bar{animation:dbG .7s both}@keyframes dbG{from{transform:scaleY(0)}}.db-line{stroke-dasharray:100}html.fx-full .db-line{animation:dbL 1.2s .3s both}@keyframes dbL{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}',
      '.rc-stage{height:260px;border-radius:20px;display:flex;align-items:center;justify-content:center;text-align:center;color:#fff;overflow:hidden;transition:background .5s}',
      '.rc-in{animation:rcI .6s cubic-bezier(.2,1.4,.4,1)}@keyframes rcI{from{opacity:0;transform:translateY(24px) scale(.9)}}html.fx-off .rc-in{animation:none}',
      '.rc-e{font-size:46px}.rc-big{font-size:56px;font-weight:900;line-height:1.1;text-shadow:0 4px 18px rgba(0,0,0,.4)}.rc-sm{font-size:13px;opacity:.9;margin-top:6px;padding:0 14px}',
      '.rc-d{flex:1;height:4px;border-radius:2px;background:#334155}.rc-d.on,.rc-d.past{background:#a78bfa}'
    ].join('\n'); document.head.appendChild(s);
  }
  function init() {
    css(); P.mkPage('step-journey', '🗺️', 'Career Journey', 'Your path and skill tree', 'amber', 'journey-body'); P.mkPage('step-dash', '📊', 'Progress Dashboard', 'Your numbers, drawn live', 'sky', 'dash-body'); P.mkPage('step-recap', '🎬', 'Monthly Recap', 'Your month in a few slides', 'violet', 'recap-body');
    freezeLogic(); renderFlame(); tiltify(); watchPyramid(); watchCheat(); renderLiquidPlan();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
