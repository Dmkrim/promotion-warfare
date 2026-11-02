/* Promotion Warfare V12 core: Effects level, sound + vibration, XP and levels, level-up burst + shake, number tickers,
   power aura, Day/Night morph, animated backgrounds, avatar items, card-fold page transitions, tilt, radar thinking, Profile "Effects" panel. */
(function () {
  'use strict';
  var P = window.PW12 = window.PW12 || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  P.esc = esc; P.lsGet = lsGet; P.lsSet = lsSet; P.toast = toast;
  P.isoDay = function (d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); };
  P.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };

  /* ================= Effects level ================= */
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  P.fx = function () { var v = lsGet('pw_fx', null); if (v === 'full' || v === 'light' || v === 'off') return v; return mq.matches ? 'off' : 'full'; };
  function applyFx() { var h = document.documentElement, f = P.fx(); h.classList.remove('fx-full', 'fx-light', 'fx-off'); h.classList.add('fx-' + f); bgStart(); }
  P.setFx = function (v) { lsSet('pw_fx', v); applyFx(); renderPanel(); toast('Effects: ' + ({ full: 'Full', light: 'Light', off: 'Off' }[v])); };

  /* ================= Sound + vibration ================= */
  var AC = null;
  function ctx() { if (!AC) { try { var C = window.AudioContext || window.webkitAudioContext; if (C) AC = new C(); } catch (e) { } } if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) { } } return AC; }
  P.soundOn = function () { return lsGet('pw_sound', false) === true; };
  function tone(f, t0, d, type, vol) {
    var c = ctx(); if (!c) return; var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + 0.02);
  }
  var SND = {
    tap: function () { tone(660, 0, 0.05, 'triangle', 0.08); },
    good: function () { tone(523, 0, 0.12, 'triangle'); tone(659, 0.09, 0.12, 'triangle'); tone(784, 0.18, 0.2, 'triangle'); },
    bad: function () { tone(180, 0, 0.25, 'sawtooth', 0.08); tone(140, 0.12, 0.3, 'sawtooth', 0.08); },
    stamp: function () { tone(110, 0, 0.14, 'square', 0.14); tone(70, 0.04, 0.18, 'sine', 0.2); },
    tick: function () { tone(1200, 0, 0.025, 'square', 0.04); },
    level: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * 0.1, 0.22, 'triangle', 0.13); }); },
    badge: function () { tone(880, 0, 0.1, 'sine'); tone(1320, 0.1, 0.25, 'sine'); },
    hit: function () { tone(220, 0, 0.08, 'square', 0.1); tone(120, 0.05, 0.12, 'square', 0.1); },
    whoosh: function () { tone(400, 0, 0.12, 'sine', 0.05); tone(800, 0.05, 0.12, 'sine', 0.04); }
  };
  P.snd = function (n) { if (!P.soundOn() || P.fx() === 'off' && false) return; try { (SND[n] || SND.tap)(); } catch (e) { } };
  var VIB = { tap: 10, good: [20, 40, 30], bad: [60, 40, 60], stamp: 40, level: [30, 50, 30, 50, 90], hit: 35, badge: [20, 30, 20] };
  P.vib = function (n) { if (!P.soundOn()) return; try { if (navigator.vibrate) navigator.vibrate(VIB[n] || 10); } catch (e) { } };
  P.fb = function (n) { P.snd(n); P.vib(n); };
  P.setSound = function (on) { lsSet('pw_sound', !!on); if (on) { ctx(); SND.good(); } soundBtn(); renderPanel(); toast(on ? 'Sound and vibration on 🔊' : 'Sound and vibration off 🔇'); };
  function soundBtn() {
    var b = $('snd-btn'); if (!b) {
      var t = $('theme-btn'); if (!t || !t.parentNode) return;
      b = document.createElement('button'); b.id = 'snd-btn'; b.className = 'p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95'; b.setAttribute('aria-label', 'Sound on or off');
      b.onclick = function () { P.setSound(!P.soundOn()); }; t.parentNode.insertBefore(b, t);
    }
    var on = P.soundOn(); b.innerHTML = '<i class="fa-solid ' + (on ? 'fa-volume-high text-emerald-400' : 'fa-volume-xmark text-slate-500') + ' text-sm"></i>'; b.title = on ? 'Sound on' : 'Sound off';
  }
  document.addEventListener('click', function (e) { if (!P.soundOn()) return; var b = e.target.closest && e.target.closest('button'); if (b && b.id !== 'snd-btn') P.fb('tap'); }, true);

  /* ================= XP and levels ================= */
  var TITLES = ['Rookie', 'Rising Intern', 'Team Player', 'Strategist', 'Power Player', 'Influencer', 'Mastermind', 'Executive', 'Legend'];
  function xpState() { var s = lsGet('pw_xp', null); if (!s || typeof s.xp !== 'number') s = { xp: 0, log: {} }; s.log = s.log || {}; return s; }
  function T(L) { return 15 * L * (L - 1); }
  P.levelOf = function (xp) { var L = 1; while (xp >= T(L + 1)) L++; return { lvl: L, from: T(L), to: T(L + 1), title: TITLES[Math.min(L, TITLES.length) - 1] }; };
  P.xp = function () { return xpState().xp; };
  P.addXP = function (n, why, onceKey) {
    var s = xpState(); if (onceKey) { var k = onceKey + '|' + P.isoDay(); if (s.log[k]) return 0; s.log[k] = 1; var ks = Object.keys(s.log); if (ks.length > 400) delete s.log[ks[0]]; }
    var before = P.levelOf(s.xp).lvl; s.xp += n; lsSet('pw_xp', s); var after = P.levelOf(s.xp).lvl;
    renderXP(true, n, why); if (after > before) levelUp(after); if (window.pwCheckBadges) setTimeout(window.pwCheckBadges, 50); return n;
  };
  function renderXP(anim, n, why) {
    var s = xpState(), L = P.levelOf(s.xp), pct = Math.round((s.xp - L.from) / (L.to - L.from) * 100), C = 2 * Math.PI * 22;
    document.querySelectorAll('.pw-xp').forEach(function (el) {
      el.innerHTML = '<svg viewBox="0 0 54 54" width="46" height="46" aria-hidden="true"><circle cx="27" cy="27" r="22" fill="none" stroke="#334155" stroke-width="5"/><circle class="xp-arc" cx="27" cy="27" r="22" fill="none" stroke="#fbbf24" stroke-width="5" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pct / 100)).toFixed(1) + '" transform="rotate(-90 27 27)"/><text x="27" y="32" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">' + L.lvl + '</text></svg>' +
        '<span class="xp-t"><b>' + esc(L.title) + '</b><small>' + s.xp + ' XP · ' + (L.to - s.xp) + ' to Level ' + (L.lvl + 1) + '</small></span>';
    });
    document.documentElement.setAttribute('data-lvl', L.lvl);
    if (anim && n && P.fx() !== 'off') {
      var f = document.createElement('div'); f.className = 'xp-float'; f.textContent = '+' + n + ' XP'; document.body.appendChild(f); setTimeout(function () { f.remove(); }, 1400);
    }
  }
  function levelUp(L) {
    var t = P.levelOf(xpState().xp).title; P.fb('level');
    if (P.fx() === 'off') { toast('⬆️ Level ' + L + ': ' + t); return; }
    var o = document.createElement('div'); o.className = 'lvl-ov'; o.innerHTML = '<div class="lvl-card"><div class="lvl-ring"></div><small>LEVEL UP!</small><b>' + L + '</b><span>' + esc(t) + '</span></div>';
    o.onclick = function () { o.remove(); }; document.body.appendChild(o); setTimeout(function () { o.remove(); }, 3200);
    if (P.fx() === 'full') shake();
    if (window.pwBurst) try { window.pwBurst(window.innerWidth / 2, window.innerHeight / 2.4, true, '⭐'); } catch (e) { }
    unlockCheck(L);
  }
  function shake() { var m = $('app-main'); if (!m) return; m.classList.remove('pw-shake'); void m.offsetWidth; m.classList.add('pw-shake'); setTimeout(function () { m.classList.remove('pw-shake'); }, 600); }
  P.shake = function () { if (P.fx() === 'full') shake(); };

  /* badges for levels */
  var BADGES = [{ id: 'lvl3', e: '⚡', n: 'Level 3', h: 'Reach Level 3.' }, { id: 'lvl5', e: '🚀', n: 'Level 5', h: 'Reach Level 5.' }, { id: 'lvl8', e: '👑', n: 'Level 8', h: 'Reach Level 8.' }];
  (function () { var W = window.PW6 || (window.PW6 = {}); W.BADGES = (W.BADGES || []).concat(BADGES); })();
  var _eb = window.pwExtraBadges;
  window.pwExtraBadges = function () { var o = _eb ? _eb() : {}, L = P.levelOf(P.xp()).lvl; o.lvl3 = L >= 3; o.lvl5 = L >= 5; o.lvl8 = L >= 8; return o; };
  /* XP for every new badge */
  var _pcb = window.pwCheckBadges, lastBadgeN = Object.keys(lsGet('pw_badges', {})).length;
  if (_pcb) window.pwCheckBadges = function () { var r = _pcb.apply(this, arguments), n = Object.keys(lsGet('pw_badges', {})).length; if (n > lastBadgeN) { var d = n - lastBadgeN; lastBadgeN = n; P.fb('badge'); setTimeout(function () { P.addXP(25 * d, 'badge'); }, 600); } return r; };

  /* XP hooks on existing actions */
  var _tm = window.toggleMove; if (_tm) window.toggleMove = function (i) {
    var MM = function () { try { return myMoves; } catch (e) { return []; } }, was = MM()[i] && MM()[i].done, r = _tm.apply(this, arguments);
    try { if (!was && MM()[i] && MM()[i].done) { P.addXP(10, 'move'); if (P.onMoveDone) P.onMoveDone(i); } } catch (e) { } return r;
  };
  var _aw = window.addWin; if (_aw) window.addWin = function () { var inp = $('win-input'), had = inp && inp.value.trim(), r = _aw.apply(this, arguments); if (had) P.addXP(15, 'win'); return r; };

  /* ================= Tickers (odometer) ================= */
  P.tick = function (el, to, suffix) {
    if (!el) return; suffix = suffix || ''; var from = parseFloat(el.getAttribute('data-tv') || el.textContent) || 0; el.setAttribute('data-tv', to);
    if (P.fx() === 'off' || from === to) { el.textContent = to + suffix; return; }
    el.classList.remove('tk-up', 'tk-down'); void el.offsetWidth; el.classList.add(to > from ? 'tk-up' : 'tk-down');
    var t0 = performance.now(), dur = 600; (function step(t) { var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(from + (to - from) * e) + suffix; if (k < 1) requestAnimationFrame(step); else setTimeout(function () { el.classList.remove('tk-up', 'tk-down'); }, 300); })(t0);
  };
  var _rs = window.refreshStats; if (_rs) window.refreshStats = function () {
    var r = _rs.apply(this, arguments);
    ['stat-picks', 'stat-done'].forEach(function (id) { var e = $(id); if (e) P.tick(e, parseInt(e.textContent, 10) || 0); });
    var p = $('stat-power'); if (p) P.tick(p, parseInt(p.textContent, 10) || 0, '%'); return r;
  };

  /* ================= Aura and avatar items ================= */
  var AURAS = { cyan: '#22d3ee', purple: '#a855f7', gold: '#fbbf24', fire: '#f97316', off: '' };
  var ITEMS = [{ id: '', e: '—', n: 'None', L: 1 }, { id: '🎧', e: '🎧', n: 'Headset', L: 2 }, { id: '🕶️', e: '🕶️', n: 'Shades', L: 3 }, { id: '🎩', e: '🎩', n: 'Top hat', L: 4 }, { id: '👑', e: '👑', n: 'Crown', L: 6 }, { id: '🚀', e: '🚀', n: 'Rocket', L: 8 }];
  var BGS = [{ id: 'none', n: 'None', L: 1 }, { id: 'radar', n: 'Radar', L: 1 }, { id: 'grid', n: 'Grid', L: 2 }, { id: 'matrix', n: 'Matrix', L: 4 }];
  function applyAura() { var a = lsGet('pw_aura', 'cyan'), h = document.documentElement; h.style.setProperty('--aura', AURAS[a] || 'transparent'); h.classList.toggle('aura-on', !!AURAS[a]); var it = lsGet('pw_item', ''); h.setAttribute('data-item', it); }
  function unlockCheck(L) { var n = []; ITEMS.forEach(function (i) { if (i.L === L && i.id) n.push(i.n); }); BGS.forEach(function (b) { if (b.L === L && L > 1) n.push(b.n + ' background'); }); if (n.length) setTimeout(function () { toast('🔓 Unlocked: ' + n.join(', ')); }, 1200); }
  P.setAura = function (a) { lsSet('pw_aura', a); applyAura(); renderPanel(); };
  P.setItem = function (id) { var L = P.levelOf(P.xp()).lvl, it = ITEMS.filter(function (i) { return i.id === id; })[0]; if (!it || it.L > L) { toast('🔒 Reach Level ' + (it ? it.L : '?') + ' to unlock'); return; } lsSet('pw_item', id); applyAura(); renderPanel(); };
  P.setBg = function (id) { var L = P.levelOf(P.xp()).lvl, b = BGS.filter(function (i) { return i.id === id; })[0]; if (!b || b.L > L) { toast('🔒 Reach Level ' + (b ? b.L : '?') + ' to unlock'); return; } lsSet('pw_bg', id); bgStart(); renderPanel(); };

  /* ================= Animated backgrounds ================= */
  var cv = null, raf = 0, bgMode = 'none', cols = [], ang = 0;
  function bgStart() {
    var m = lsGet('pw_bg', 'none'), ok = P.fx() === 'full' && m !== 'none'; bgMode = ok ? m : 'none';
    cancelAnimationFrame(raf); if (!ok) { if (cv) cv.style.display = 'none'; return; }
    if (!cv) { cv = document.createElement('canvas'); cv.id = 'fx-bg'; cv.setAttribute('aria-hidden', 'true'); document.body.insertBefore(cv, document.body.firstChild); }
    cv.style.display = 'block'; sizeBg(); loop();
  }
  function sizeBg() { if (!cv) return; var d = Math.min(window.devicePixelRatio || 1, 1.5); cv.width = Math.round(innerWidth * d * 0.6); cv.height = Math.round(innerHeight * d * 0.6); cols = []; for (var i = 0; i < Math.floor(cv.width / 14); i++) cols.push(Math.random() * cv.height); }
  window.addEventListener('resize', function () { if (bgMode !== 'none') sizeBg(); });
  function loop() {
    if (bgMode === 'none' || !cv) return; var c = cv.getContext('2d'), w = cv.width, h = cv.height, light = document.body.classList.contains('light'), line = light ? '8,145,178' : '34,211,238';
    if (document.hidden) { raf = requestAnimationFrame(loop); return; }
    if (bgMode === 'matrix') {
      c.fillStyle = light ? 'rgba(241,245,249,.12)' : 'rgba(15,23,42,.12)'; c.fillRect(0, 0, w, h); c.fillStyle = light ? 'rgba(5,150,105,.8)' : 'rgba(52,211,153,.8)'; c.font = '13px monospace';
      for (var i = 0; i < cols.length; i++) { c.fillText(String.fromCharCode(0x30A0 + Math.floor(Math.random() * 60)), i * 14, cols[i]); cols[i] = cols[i] > h + Math.random() * 3000 ? 0 : cols[i] + 14; }
    } else {
      c.clearRect(0, 0, w, h);
      if (bgMode === 'grid') { c.strokeStyle = 'rgba(' + line + ',.35)'; c.lineWidth = 1; var o = (performance.now() / 60) % 40; c.beginPath(); for (var x = -40 + o; x < w; x += 40) { c.moveTo(x, 0); c.lineTo(x, h); } for (var y = -40 + o; y < h; y += 40) { c.moveTo(0, y); c.lineTo(w, y); } c.stroke(); }
      else { /* radar */ var cx = w / 2, cy = h * 0.45, R = Math.max(w, h) * 0.6; c.strokeStyle = 'rgba(' + line + ',.35)'; for (var r = 1; r <= 4; r++) { c.beginPath(); c.arc(cx, cy, R * r / 4, 0, 6.283); c.stroke(); } c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke(); ang += 0.025; var g = c.createConicGradient ? c.createConicGradient(ang, cx, cy) : null; if (g) { g.addColorStop(0, 'rgba(' + line + ',.6)'); g.addColorStop(0.12, 'rgba(' + line + ',0)'); g.addColorStop(1, 'rgba(' + line + ',0)'); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 6.283); c.fill(); } }
    }
    raf = requestAnimationFrame(loop);
  }

  /* ================= Day/Night morph ================= */
  var _tt = window.toggleTheme;
  window.toggleTheme = function () {
    if (P.fx() !== 'full') return _tt();
    var toLight = lsGet('pw_theme', 'dark') !== 'light', b = $('theme-btn'), r = b ? b.getBoundingClientRect() : { left: innerWidth - 60, top: 20, width: 30, height: 30 };
    var x = r.left + r.width / 2, y = r.top + r.height / 2, ov = document.createElement('div'); ov.className = 'tm-ov'; ov.style.background = toLight ? '#f1f5f9' : '#0f172a'; ov.style.setProperty('--tx', x + 'px'); ov.style.setProperty('--ty', y + 'px');
    ov.innerHTML = '<span class="tm-i">' + (toLight ? '☀️' : '🌙') + '</span>'; document.body.appendChild(ov); P.fb('whoosh');
    setTimeout(function () { _tt(); }, 330); setTimeout(function () { ov.classList.add('tm-out'); }, 380); setTimeout(function () { ov.remove(); }, 900);
  };

  /* ================= Page transition (card fold), tilt ================= */
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) {
    var r = _go(id, p, fromPop); var s = $(id);
    if (s && P.fx() === 'full') { s.classList.remove('pw-fold'); void s.offsetWidth; s.classList.add('pw-fold'); setTimeout(function () { s.classList.remove('pw-fold'); }, 520); }
    try { renderXP(); renderPanel(); } catch (e) { } return r;
  };
  var tiltEl = null;
  document.addEventListener('pointermove', function (e) {
    if (P.fx() !== 'full') return; var t = e.target.closest && e.target.closest('.fx-tilt,.pm.ring-2');
    if (tiltEl && tiltEl !== t) { tiltEl.style.transform = ''; tiltEl = null; } if (!t) return; tiltEl = t;
    var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    t.style.transform = 'perspective(500px) rotateX(' + (-y * 10).toFixed(1) + 'deg) rotateY(' + (x * 12).toFixed(1) + 'deg)'; t.style.transition = 'transform .08s';
  }, { passive: true });
  document.addEventListener('pointerup', function () { if (tiltEl) { tiltEl.style.transition = 'transform .4s'; tiltEl.style.transform = ''; tiltEl = null; } }, { passive: true });
  if (window.DeviceOrientationEvent) window.addEventListener('deviceorientation', function (e) { if (P.fx() !== 'full' || e.gamma == null) return; document.documentElement.style.setProperty('--gx', Math.max(-1, Math.min(1, e.gamma / 35)).toFixed(2)); document.documentElement.style.setProperty('--gy', Math.max(-1, Math.min(1, (e.beta - 40) / 35)).toFixed(2)); }, { passive: true });

  /* ================= Profile panel ================= */
  function renderPanel() {
    var sec = $('step-profile'); if (!sec) return; var box = $('fx-panel');
    if (!box) { box = document.createElement('div'); box.id = 'fx-panel'; box.className = 'mb-4 p-3 rounded-2xl bg-slate-900/60 border border-amber-500/40'; var first = sec.querySelector('.flex.items-center.space-x-3'); if (first && first.parentNode) first.parentNode.insertBefore(box, first.nextSibling); else sec.appendChild(box); }
    var L = P.levelOf(P.xp()).lvl, f = P.fx(), a = lsGet('pw_aura', 'cyan'), it = lsGet('pw_item', ''), bg = lsGet('pw_bg', 'none');
    function seg(label, items, cur, fn) { return '<p class="text-[11px] font-bold text-slate-300 mt-3 mb-1">' + label + '</p><div class="flex flex-wrap gap-1.5">' + items.map(function (i) { var lock = i.L && i.L > L; return '<button data-noswipe onclick="PW12.' + fn + '(\'' + i.id + '\')" class="px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ' + (cur === i.id ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-300') + (lock ? ' opacity-50' : '') + '">' + (lock ? '🔒 ' : '') + (i.e && i.e !== '—' ? i.e + ' ' : '') + i.n + (lock ? ' (L' + i.L + ')' : '') + '</button>'; }).join('') + '</div>'; }
    box.innerHTML = '<p class="text-sm font-bold text-white mb-2">✨ Effects and Level</p><div class="pw-xp flex items-center gap-3 mb-2"></div>' +
      '<p class="text-[11px] font-bold text-slate-300 mt-2 mb-1">Effects</p><div class="flex gap-1.5">' + [['full', 'Full'], ['light', 'Light'], ['off', 'Off']].map(function (x) { return '<button data-noswipe onclick="PW12.setFx(\'' + x[0] + '\')" class="flex-1 py-1.5 rounded-lg text-[11px] font-bold border ' + (f === x[0] ? 'bg-amber-500/25 border-amber-400 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-300') + '">' + x[1] + '</button>'; }).join('') + '</div><p class="text-[10px] text-slate-500 mt-1">Light = fewer effects. Off = no moving effects (good for slow phones). Your phone\'s "reduce motion" setting is respected.</p>' +
      '<p class="text-[11px] font-bold text-slate-300 mt-3 mb-1">Sound and vibration</p><button data-noswipe onclick="PW12.setSound(' + (!P.soundOn()) + ')" class="px-3 py-1.5 rounded-lg text-[11px] font-bold border ' + (P.soundOn() ? 'bg-emerald-500/25 border-emerald-400 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-300') + '">' + (P.soundOn() ? '🔊 On' : '🔇 Off') + '</button> <span class="text-[10px] text-slate-500">Vibration works on Android phones.</span>' +
      seg('Power aura', [{ id: 'cyan', n: 'Cyan' }, { id: 'purple', n: 'Purple' }, { id: 'gold', n: 'Gold' }, { id: 'fire', n: 'Fire' }, { id: 'off', n: 'None' }], a, 'setAura') +
      seg('Avatar item (unlock with levels)', ITEMS, it, 'setItem') + seg('Animated background (unlock with levels)', BGS, bg, 'setBg');
    renderXP();
  }

  /* ================= Radar for the Adviser "thinking" ================= */
  /* pure CSS on .typing, see style block */

  /* ================= Styles ================= */
  function css() {
    if ($('v12-css')) return; var s = document.createElement('style'); s.id = 'v12-css';
    s.textContent = [
      '#fx-bg{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:.28}',
      'html.aura-on .av-ring,html.aura-on .pw-me-av{box-shadow:0 0 0 2px var(--aura),0 0 14px 2px var(--aura)}',
      'html.fx-full.aura-on .av-ring,html.fx-full.aura-on .pw-me-av{animation:auraP 2.4s ease-in-out infinite}',
      '@keyframes auraP{0%,100%{box-shadow:0 0 0 2px var(--aura),0 0 8px 1px var(--aura)}50%{box-shadow:0 0 0 3px var(--aura),0 0 22px 6px var(--aura)}}',
      'html[data-item]:not([data-item=""]) #hdr-avatar{position:relative}html[data-item]:not([data-item=""]) #hdr-avatar::after{content:attr(data-it);position:absolute;top:-9px;right:-6px;font-size:15px;line-height:1}',
      '.pw-xp{display:flex;align-items:center;gap:.6rem}.pw-xp .xp-t{display:flex;flex-direction:column;line-height:1.2}.pw-xp .xp-t b{color:#fff;font-size:13px}.pw-xp .xp-t small{color:#94a3b8;font-size:10px}.xp-arc{transition:stroke-dashoffset .8s ease}',
      '.xp-float{position:fixed;top:64px;left:50%;transform:translateX(-50%);z-index:90;font-weight:800;color:#fbbf24;text-shadow:0 0 10px #f59e0b;font-size:18px;pointer-events:none;animation:xpF 1.3s ease-out forwards}',
      '@keyframes xpF{0%{opacity:0;transform:translate(-50%,10px) scale(.7)}20%{opacity:1;transform:translate(-50%,0) scale(1.1)}100%{opacity:0;transform:translate(-50%,-34px)}}',
      '.lvl-ov{position:fixed;inset:0;z-index:95;background:rgba(2,6,23,.82);display:flex;align-items:center;justify-content:center;animation:lvIn .3s}',
      '@keyframes lvIn{from{opacity:0}to{opacity:1}}',
      '.lvl-card{position:relative;text-align:center;color:#fff;display:flex;flex-direction:column;align-items:center;gap:2px;animation:lvPop .7s cubic-bezier(.2,1.6,.4,1)}',
      '@keyframes lvPop{0%{transform:scale(.2) rotate(-12deg);opacity:0}100%{transform:scale(1) rotate(0);opacity:1}}',
      '.lvl-card small{letter-spacing:.3em;font-weight:800;color:#fbbf24;font-size:13px}.lvl-card b{font-size:92px;line-height:1;text-shadow:0 0 30px #f59e0b,0 0 60px #f97316}.lvl-card span{font-size:18px;font-weight:700;color:#e2e8f0}',
      '.lvl-ring{position:absolute;top:50%;left:50%;width:190px;height:190px;margin:-95px 0 0 -95px;border:4px solid #fbbf24;border-radius:50%;opacity:0;animation:lvR 1.2s .2s ease-out infinite}@keyframes lvR{0%{transform:scale(.4);opacity:.9}100%{transform:scale(1.8);opacity:0}}',
      '.pw-shake{animation:pwSh .55s}@keyframes pwSh{0%,100%{transform:none}15%{transform:translate(-5px,2px)}30%{transform:translate(5px,-3px)}45%{transform:translate(-4px,-2px)}60%{transform:translate(4px,3px)}80%{transform:translate(-2px,1px)}}',
      '.tk-up{color:#34d399!important;text-shadow:0 0 10px #10b981}.tk-down{color:#f87171!important;text-shadow:0 0 10px #ef4444}',
      '.tm-ov{position:fixed;inset:0;z-index:99;pointer-events:none;clip-path:circle(0 at var(--tx) var(--ty));animation:tmG .45s ease-in forwards;display:flex;align-items:center;justify-content:center}',
      '@keyframes tmG{to{clip-path:circle(150% at var(--tx) var(--ty))}}.tm-ov.tm-out{animation:tmO .5s ease-out forwards}@keyframes tmO{from{opacity:1}to{opacity:0}}.tm-i{font-size:64px;animation:lvPop .5s}',
      'html.fx-full .pw-fold{animation:pwFold .48s cubic-bezier(.2,.8,.2,1)!important;transform-origin:50% 0}',
      '@keyframes pwFold{0%{opacity:0;transform:perspective(800px) rotateX(-28deg) translateY(18px)}60%{opacity:1}100%{opacity:1;transform:none}}',
      '.fx-tilt{will-change:transform}',
      '.typing{position:relative}html.fx-full .typing::before{content:"";display:inline-block;width:16px;height:16px;border-radius:50%;margin-right:6px;vertical-align:middle;border:1.5px solid #22d3ee;background:conic-gradient(from 0deg,rgba(34,211,238,.8),rgba(34,211,238,0) 40%);animation:rdr 1.1s linear infinite}@keyframes rdr{to{transform:rotate(360deg)}}',
      'html.fx-off .xp-arc,html.fx-off .xp-float{transition:none;animation:none}',
      '#snd-btn{display:inline-flex}',
      '@media (prefers-reduced-motion:reduce){.pw-fold,.pw-shake{animation:none!important}}'
    ].join('\n'); document.head.appendChild(s);
  }

  function init() {
    css(); applyFx(); applyAura(); soundBtn(); renderPanel(); renderXP();
    var wel = $('step-welcome'), dc = $('daily-card');
    if (wel && dc && !$('xp-chip')) { var c = document.createElement('button'); c.id = 'xp-chip'; c.className = 'pw-xp w-full text-left mb-3 p-2.5 rounded-2xl bg-slate-900/60 border border-amber-500/30 active:scale-98'; c.setAttribute('data-noswipe', ''); c.onclick = function () { window.goToStep('step-profile', 0); }; dc.parentNode.insertBefore(c, dc); renderXP(); }
    var h = $('hdr-avatar'); if (h) { var set = function () { h.setAttribute('data-it', lsGet('pw_item', '')); }; set(); new MutationObserver(set).observe(document.documentElement, { attributes: true, attributeFilter: ['data-item'] }); }
    if (window.pwCheckBadges) setTimeout(window.pwCheckBadges, 300);
  }
  P.renderXP = renderXP; P.renderPanel = renderPanel;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
