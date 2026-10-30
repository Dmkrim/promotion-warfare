/* V05 extras: swipe navigation, rotating ideas, celebration effects, spinning app icon, strategy idea panels. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  var REDUCED = false; try { REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { }
  var ROTATE_SEC = 30;
  var cur = 'step-welcome';

  /* ---------------------------------------------------------------- restart a CSS animation */
  function restart(el, cls) { if (!el) return; el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
  function fillBar(box) { var i = box && box.querySelector('i'); if (i) { i.style.animation = 'none'; void i.offsetWidth; i.style.animation = 'tickFill ' + ROTATE_SEC + 's linear forwards'; } }

  /* ---------------------------------------------------------------- celebration effects */
  var EMO = ['🎉', '⭐', '✨', '💪', '🔥', '🎯', '👏', '🚀'];
  var COLORS = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#a855f7', '#ec4899'];
  var CHEERS = ['Great answer! 🎯', 'Nice choice! 👏', 'Got it! 💪', 'Good thinking! ✨', 'Strong move! 🔥'];
  function layer() {
    var l = $('fx-layer');
    if (!l) { l = document.createElement('div'); l.id = 'fx-layer'; document.body.appendChild(l); }
    return l;
  }
  function burst(x, y, big, text) {
    var l = layer(), n = REDUCED ? 0 : (big ? 18 : 12), i;
    for (i = 0; i < n; i++) {
      var s = document.createElement('span'), a = Math.random() * Math.PI * 2, d = 40 + Math.random() * (big ? 90 : 65);
      s.className = 'pw-conf';
      if (i % 3 === 0) { s.textContent = EMO[Math.floor(Math.random() * EMO.length)]; s.style.fontSize = (14 + Math.random() * 8) + 'px'; }
      else { s.style.width = s.style.height = (5 + Math.random() * 6) + 'px'; s.style.background = COLORS[i % COLORS.length]; s.style.borderRadius = i % 2 ? '50%' : '2px'; }
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * d - 25) + 'px');
      s.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
      l.appendChild(s);
      setTimeout((function (el) { return function () { if (el.parentNode) el.parentNode.removeChild(el); }; })(s), 1100);
    }
    if (text) {
      var t = document.createElement('div'); t.className = 'pw-cheer'; t.textContent = text;
      t.style.left = Math.max(70, Math.min(window.innerWidth - 70, x)) + 'px'; t.style.top = (y - 30) + 'px';
      l.appendChild(t); setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 1300);
    }
  }
  window.pwBurst = burst;
  function burstEl(el, big, text) {
    if (!el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, big, text);
  }
  function pulse(el) { if (el && !REDUCED) restart(el, 'pw-pop'); }

  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('button, label, input[type=checkbox]') : null;
    if (!b) return;
    var x = e.clientX || 0, y = e.clientY || 0;
    var sec = b.closest('section'), sid = sec ? sec.id : '';
    if ((sid === 'step-q1' || sid === 'step-q2' || sid === 'step-q3') && b.tagName === 'BUTTON' && !/back/i.test(b.textContent)) {
      pulse(b); burst(x, y, true, CHEERS[Math.floor(Math.random() * CHEERS.length)]); return;
    }
    if (b.classList.contains('doit-btn') && !/Added/.test(b.textContent)) { pulse(b); burst(x, y, false, 'Added to plan ✓'); return; }
    var oc = b.getAttribute && b.getAttribute('onclick') || '';
    if (/addCustomTask|addWin\(|saveWelcomeName|teachAdviser|pwTipDo|saveWeb/.test(oc)) { pulse(b); burst(x, y, false); return; }
    if (b.closest && b.closest('#quick-chips')) { pulse(b); burst(x, y, false, 'Added ✓'); return; }
  }, true);
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t && t.type === 'checkbox' && t.checked && t.closest && t.closest('#my-moves, #plan-checklist')) burstEl(t, true, 'Done! 💪');
  }, true);

  /* ---------------------------------------------------------------- Today's Move (Welcome), every 30 s */
  var tipOrder = [], tipPos = 0;
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function initTipOrder() {
    if (tipOrder.length || !window.PW_BANK) return;
    tipOrder = shuffle(PW_BANK.cards.map(function (c, i) { return i; })); tipPos = 0;
  }
  function renderTip(anim) {
    var box = $('welcome-tip'); if (!box || !window.PW_BANK) return;
    initTipOrder();
    var c = PW_BANK.cards[tipOrder[tipPos % tipOrder.length]];
    box.innerHTML = '<p class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">💡 Today\'s Move · ' + esc(c.t) + '</p>' +
      '<p class="text-xs text-slate-200 leading-relaxed">' + esc(c.s1) + ' <span class="text-slate-400">' + esc(c.tip) + '</span></p>' +
      '<div class="flex items-center gap-2 mt-2"><button data-id="tip-' + esc(c.id) + '" data-text="' + esc(c.s1) + '" onclick="pwTipDo(this)" class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold active:scale-95"><i class="fa-solid fa-bolt"></i> Do it</button>' +
      '<button onclick="pwNextTip()" class="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-200 text-[11px] font-bold active:scale-95"><i class="fa-solid fa-rotate"></i> Another</button></div>' +
      '<div class="tick-bar mt-2"><i></i></div>';
    fillBar(box.querySelector('.tick-bar'));
    if (anim) restart(box, 'swap-in');
  }
  window.pwTipDo = function (b) {
    if (typeof addMove === 'function') addMove(b.getAttribute('data-id'), b.getAttribute('data-text'));
  };
  window.pwNextTip = function () { tipPos++; cnt.w = 0; renderTip(true); };

  /* ---------------------------------------------------------------- strategy idea panels (20 per position), every 30 s */
  var POS = { leader: ['Leader', 'emerald'], challenger: ['Challenger', 'purple'], flanker: ['Flanker', 'orange'], guerrilla: ['Underdog', 'red'] };
  var tipsOff = {};
  function addedIds() { try { return (typeof myMoves !== 'undefined') ? myMoves.map(function (m) { return m.id; }) : []; } catch (e) { return []; } }
  function renderTips(pos, anim) {
    var panel = document.querySelector('.tips-panel[data-pos="' + pos + '"]'); if (!panel || !window.PW_TIPS) return;
    var list = PW_TIPS[pos], n = list.length, off = tipsOff[pos] || 0, ids = addedIds(), html = '', k;
    for (k = 0; k < 3; k++) {
      var i = (off + k) % n, t = list[i], id = 'tip-' + pos + '-' + i, done = ids.indexOf(id) >= 0;
      html += '<div class="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60"><p class="text-xs font-bold text-slate-100">' + (i + 1) + '. ' + esc(t[0]) + '</p><p class="text-[11px] text-slate-300 leading-snug mt-0.5">' + esc(t[1]) + '</p>' +
        '<button data-id="' + id + '" data-text="' + esc(t[0] + ': ' + t[1]) + '" onclick="pwTipDo(this);this.firstElementChild.nextSibling.textContent=\' Added ✓\'" class="mt-1.5 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold active:scale-95' + (done ? ' opacity-60' : '') + '"><i class="fa-solid fa-bolt"></i> ' + (done ? 'Added ✓' : 'Do it') + '</button></div>';
    }
    panel.querySelector('.tips-body').innerHTML = html;
    panel.querySelector('.tips-count').textContent = 'Ideas ' + (off + 1) + '–' + (((off + 2) % n) + 1) + ' of ' + n;
    fillBar(panel.querySelector('.tick-bar'));
    if (anim) restart(panel.querySelector('.tips-body'), 'swap-in');
  }
  window.pwNextTips = function (pos) {
    tipsOff[pos] = ((tipsOff[pos] || 0) + 3) % PW_TIPS[pos].length; cnt.t = 0; renderTips(pos, true);
  };
  function buildPanels() {
    if (!window.PW_TIPS) return;
    Object.keys(POS).forEach(function (pos) {
      var sec = $('strat-' + pos); if (!sec || sec.querySelector('.tips-panel')) return;
      var last = sec.lastElementChild; if (!last) return;
      var d = document.createElement('div');
      d.className = 'tips-panel mb-4 p-3 rounded-2xl bg-slate-900/60 border border-' + POS[pos][1] + '-500/30'; d.setAttribute('data-pos', pos);
      d.innerHTML = '<div class="flex items-center justify-between mb-2"><p class="text-xs font-bold text-amber-400">💡 More ideas for the ' + POS[pos][0] + '</p><span class="tips-count text-[10px] text-slate-400"></span></div>' +
        '<div class="tips-body space-y-2"></div><div class="tick-bar mt-2"><i></i></div>' +
        '<button onclick="pwNextTips(\'' + pos + '\')" class="mt-2 w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold active:scale-95"><i class="fa-solid fa-rotate"></i> Show other ideas <span class="text-slate-400 font-normal">(new ideas every ' + ROTATE_SEC + ' s)</span></button>';
      sec.insertBefore(d, last);
      tipsOff[pos] = Math.floor(Math.random() * 7) * 3 % PW_TIPS[pos].length;
    });
  }

  /* ---------------------------------------------------------------- quick ideas in Action Plan, every 30 s */
  window.pwQuickOffset = 0;
  window.nextQuickIdeas = function (manual) {
    var n = (window.PW_QUICK || []).length; if (!n) return;
    window.pwQuickOffset = (window.pwQuickOffset + 6) % n;
    if (typeof renderQuickChips === 'function') renderQuickChips();
    restart($('quick-chips'), 'swap-in'); fillBar($('quick-bar')); cnt.q = 0;
  };

  /* ---------------------------------------------------------------- one-second ticker for the 30 s rotations */
  var cnt = { w: 0, t: 0, q: 0 };
  setInterval(function () {
    if (document.hidden) return;
    if (cur === 'step-welcome') { if (++cnt.w >= ROTATE_SEC) { cnt.w = 0; tipPos++; renderTip(true); } } else cnt.w = 0;
    if (cur.indexOf('strat-') === 0) { if (++cnt.t >= ROTATE_SEC) { cnt.t = 0; var pos = cur.slice(6); if (PW_TIPS && PW_TIPS[pos]) { tipsOff[pos] = ((tipsOff[pos] || 0) + 3) % PW_TIPS[pos].length; renderTips(pos, true); } } } else cnt.t = 0;
    if (cur === 'step-action-plan') { if (++cnt.q >= ROTATE_SEC) { window.nextQuickIdeas(); } } else cnt.q = 0;
  }, 1000);

  /* ---------------------------------------------------------------- spinning app icon (3D, all three axes) */
  var spin = { raf: 0, t0: 0, on: false, cv: null, ctx: null, S: 0, dpr: 1 };
  function ease(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }
  function mat(a, b, g) {
    var ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b), cg = Math.cos(g), sg = Math.sin(g);
    var Rx = [[1, 0, 0], [0, ca, -sa], [0, sa, ca]], Ry = [[cb, 0, sb], [0, 1, 0], [-sb, 0, cb]], Rz = [[cg, -sg, 0], [sg, cg, 0], [0, 0, 1]];
    function mul(A, B) { var o = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], i, j, k; for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) for (k = 0; k < 3; k++) o[i][j] += A[i][k] * B[k][j]; return o; }
    return mul(Rz, mul(Ry, Rx));
  }
  function ap(M, p) { return [M[0][0] * p[0] + M[0][1] * p[1] + M[0][2] * p[2], M[1][0] * p[0] + M[1][1] * p[1] + M[1][2] * p[2], M[2][0] * p[0] + M[2][1] * p[1] + M[2][2] * p[2]]; }
  function angles(t) {
    var u = t % 12;
    function seg(s, d) { if (u < s) return 0; if (u >= s + d) return 1; return ease((u - s) / d); }
    var b = Math.PI * 2 * seg(1, 3), a = Math.PI * 2 * seg(5, 3), g = Math.PI * 2 * seg(9, 3);
    return [a + 0.1 * Math.sin(t * 1.3), b + 0.1 * Math.cos(t * 1.1), g];
  }
  function drawIcon(t) {
    var c = spin.ctx, S = spin.S, dpr = spin.dpr, U = S * 0.4, cx = S / 2, cy = S / 2, D = 7;
    var an = angles(t), M = mat(an[0], an[1], an[2]);
    c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, S, S);
    function proj(p) { var w = ap(M, p), k = D / (D - w[2]); return { x: cx + w[0] * U * k, y: cy + w[1] * U * k, z: w[2], k: k }; }
    var items = [], i, N = 72, R = 0.9;
    for (i = 0; i < N; i++) {
      var a1 = i / N * Math.PI * 2, a2 = (i + 1) / N * Math.PI * 2;
      var p1 = proj([R * Math.cos(a1), R * Math.sin(a1), 0]), p2 = proj([R * Math.cos(a2), R * Math.sin(a2), 0]);
      items.push({ z: (p1.z + p2.z) / 2, type: 0, a: p1, b: p2 });
    }
    for (i = 0; i < 6; i++) { var th = -Math.PI / 2 + i * Math.PI / 3, p = proj([R * Math.cos(th), R * Math.sin(th), 0]); items.push({ z: p.z + 0.001, type: 1, p: p }); }
    items.push({ z: 0, type: 2 });
    items.sort(function (x, y) { return x.z - y.z; });
    items.forEach(function (it) {
      if (it.type === 0) {
        var l = 52 + 28 * (it.z + 1) / 2 + 12;
        c.strokeStyle = 'hsl(215,9%,' + Math.round(Math.max(30, Math.min(88, l))) + '%)';
        c.lineWidth = Math.max(1.2, 0.045 * U * (it.a.k + it.b.k) / 2); c.lineCap = 'round';
        c.beginPath(); c.moveTo(it.a.x, it.a.y); c.lineTo(it.b.x, it.b.y); c.stroke();
      } else if (it.type === 1) {
        var r = 0.14 * U * it.p.k, g = c.createRadialGradient(it.p.x - r * 0.4, it.p.y - r * 0.45, r * 0.1, it.p.x, it.p.y, r);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, '#d5d9df'); g.addColorStop(0.75, '#7b818b'); g.addColorStop(1, '#30343b');
        c.fillStyle = g; c.beginPath(); c.arc(it.p.x, it.p.y, r, 0, Math.PI * 2); c.fill();
      } else {
        var front = M[2][2] >= 0;
        c.save();
        c.setTransform(dpr * U * M[0][0], dpr * U * M[1][0], dpr * U * M[0][1], dpr * U * M[1][1], dpr * cx, dpr * cy);
        var gr = c.createLinearGradient(-0.5, -0.5, 0.5, 0.5);
        gr.addColorStop(0, '#f7f9fb'); gr.addColorStop(0.5, '#9aa1aa'); gr.addColorStop(1, '#e3e7eb');
        c.fillStyle = gr; c.beginPath(); c.arc(0, 0, 0.53, 0, Math.PI * 2); c.fill();
        c.strokeStyle = 'rgba(40,46,55,.55)'; c.lineWidth = 0.02; c.beginPath(); c.arc(0, 0, 0.53, 0, Math.PI * 2); c.stroke();
        if (front) {
          c.fillStyle = '#5d636c'; c.beginPath(); c.arc(0, 0, 0.455, 0, Math.PI * 2); c.fill();
          var bg = c.createRadialGradient(-0.1, -0.18, 0.03, 0, 0, 0.43);
          bg.addColorStop(0, '#62c3ff'); bg.addColorStop(0.55, '#1479d1'); bg.addColorStop(1, '#07407f');
          c.fillStyle = bg; c.beginPath(); c.arc(0, 0, 0.43, 0, Math.PI * 2); c.fill();
          c.save(); c.beginPath(); c.arc(0, 0, 0.43, 0, Math.PI * 2); c.clip();
          c.fillStyle = 'rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(0, -0.24, 0.32, 0.17, 0, 0, Math.PI * 2); c.fill();
          c.fillStyle = '#f2f4f7'; c.beginPath(); c.arc(0, -0.08, 0.115, 0, Math.PI * 2); c.fill();
          c.beginPath(); c.moveTo(-0.24, 0.43); c.quadraticCurveTo(-0.24, 0.1, 0, 0.1); c.quadraticCurveTo(0.24, 0.1, 0.24, 0.43); c.closePath(); c.fill();
          c.restore();
        } else {
          c.strokeStyle = 'rgba(70,76,85,.5)'; c.lineWidth = 0.012;
          [0.4, 0.3, 0.2].forEach(function (rr) { c.beginPath(); c.arc(0, 0, rr, 0, Math.PI * 2); c.stroke(); });
          var bk = c.createRadialGradient(-0.03, -0.04, 0.01, 0, 0, 0.13);
          bk.addColorStop(0, '#62c3ff'); bk.addColorStop(1, '#1479d1');
          c.fillStyle = bk; c.beginPath(); c.arc(0, 0, 0.1, 0, Math.PI * 2); c.fill();
        }
        c.restore();
      }
    });
  }
  function spinFrame(ts) {
    if (!spin.on) return;
    if (!spin.t0) spin.t0 = ts;
    drawIcon((ts - spin.t0) / 1000);
    spin.raf = requestAnimationFrame(spinFrame);
  }
  function setupSpin() {
    var cv = $('pw-spin'); if (!cv || !cv.getContext) return false;
    var S = cv.clientWidth || 128; spin.dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(S * spin.dpr); cv.height = Math.round(S * spin.dpr);
    spin.cv = cv; spin.ctx = cv.getContext('2d'); spin.S = S;
    return !!spin.ctx;
  }
  function startSpin() {
    if (spin.on) return;
    if (!spin.cv || !spin.cv.isConnected || !setupSpin()) { if (!setupSpin()) return; }
    var img = $('pw-spin-img');
    if (REDUCED) { drawIcon(0); if (img) img.style.opacity = 0; return; }
    spin.on = true; spin.t0 = 0; spin.raf = requestAnimationFrame(function (ts) { spinFrame(ts); if (img) img.style.opacity = 0; });
  }
  function stopSpin() { spin.on = false; if (spin.raf) cancelAnimationFrame(spin.raf); }
  window.pwDrawAt = function (t) { if (!spin.ctx && !setupSpin()) return null; var wasOn = spin.on; spin.on = false; drawIcon(t); spin.on = wasOn; return spin.cv.toDataURL(); };
  window.pwSpinAgain = function () { spin.t0 = performance.now() - 900; if (!spin.on) startSpin(); };
  document.addEventListener('visibilitychange', function () { if (document.hidden) stopSpin(); else if (cur === 'step-welcome') startSpin(); });

  /* ---------------------------------------------------------------- page hook */
  function onPage(id) {
    cur = id;
    var so = $('startover-wrap'); if (so) so.classList.toggle('hidden', id === 'step-welcome');
    if (id === 'step-welcome') { cnt.w = 0; renderTip(false); setTimeout(startSpin, 30); } else stopSpin();
    if (id.indexOf('strat-') === 0) { var pos = id.slice(6); cnt.t = 0; renderTips(pos, false); }
    if (id === 'step-action-plan') { cnt.q = 0; if (typeof renderQuickChips === 'function') renderQuickChips(); fillBar($('quick-bar')); }
  }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); onPage(id); };

  /* ---------------------------------------------------------------- swipe navigation (page follows the finger) */
  var HOME = { p: 'step-welcome' };
  var FLOW = {
    'step-welcome': { n: 'step-start' },
    'step-start': { n: 'step-square' },
    'step-map-builder': { p: 'step-start' },
    'step-map-pyramid': { p: 'step-map-builder', n: 'step-square' },
    'step-square': { p: 'step-start', n: 'step-q1' },
    'step-q1': { p: 'step-square' }, 'step-q2': { p: 'step-q1' }, 'step-q3': { p: 'step-q2' },
    'strat-leader': { p: 'step-q1' }, 'strat-challenger': { p: 'step-q2' }, 'strat-flanker': { p: 'step-q3' }, 'strat-guerrilla': { p: 'step-q3' },
    'step-action-plan': { p: 'step-start' },
    'step-help': HOME, 'step-examples': HOME, 'step-journal': HOME, 'step-glossary': HOME, 'step-profile': HOME, 'step-about': HOME, 'step-privacy': HOME
  };
  var sw = null, suppress = 0;
  function overlayOpen() {
    return ['drawer-menu', 'modal-container', 'adviser-sheet'].some(function (i) { var e = $(i); return e && !e.classList.contains('hidden'); });
  }
  function visibleSection() { var s = document.querySelectorAll('#app-main section'), i; for (i = 0; i < s.length; i++) if (!s[i].classList.contains('hidden')) return s[i]; return null; }
  function makePeek(sec, targetId) {
    var src = $(targetId); if (!src) return null;
    var pk = src.cloneNode(true);
    pk.removeAttribute('id'); [].forEach.call(pk.querySelectorAll('[id]'), function (n) { n.removeAttribute('id'); });
    pk.classList.remove('hidden'); pk.classList.add('swipe-peek');
    [].forEach.call(pk.querySelectorAll('canvas'), function (cv) { cv.parentNode.removeChild(cv); });
    [].forEach.call(pk.querySelectorAll('img[src="app-icon.png"]'), function (im) { im.style.opacity = 1; });
    pk.style.cssText += ';position:absolute;top:' + sec.offsetTop + 'px;left:' + sec.offsetLeft + 'px;width:' + sec.offsetWidth + 'px;pointer-events:none;z-index:2;margin:0;animation:none';
    $('app-main').appendChild(pk);
    return pk;
  }
  function cleanSwipe() {
    if (!sw) return;
    if (sw.peek && sw.peek.parentNode) sw.peek.parentNode.removeChild(sw.peek);
    if (sw.sec) { sw.sec.style.transition = ''; sw.sec.style.transform = ''; sw.sec.style.opacity = ''; }
    var m = $('app-main'); if (m) m.style.overflowX = '';
    document.body.style.overflowX = '';
    sw = null;
  }
  var GAP = 18;
  function onDown(e) {
    if (sw || overlayOpen()) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    var t = e.target; if (!t.closest || !t.closest('#app-main')) return;
    if (t.closest('input, textarea, select, .selectable, [data-noswipe]')) return;
    var sec = visibleSection(); if (!sec) return;
    var f = FLOW[sec.id]; if (!f || (!f.n && !f.p)) return;
    sw = { id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(), sec: sec, f: f, drag: false, dir: 0, w: sec.offsetWidth, peek: null, dx: 0 };
  }
  function onMove(e) {
    if (!sw || e.pointerId !== sw.id) return;
    var dx = e.clientX - sw.x0, dy = e.clientY - sw.y0;
    if (!sw.drag) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      if (Math.abs(dy) > Math.abs(dx) * 0.8) { sw = null; return; }          // vertical scroll
      var dir = dx < 0 ? -1 : 1, target = dir < 0 ? sw.f.n : sw.f.p;
      if (!target) { sw = null; return; }                                      // this direction is not allowed
      sw.dir = dir; sw.target = target; sw.drag = true;
      sw.peek = makePeek(sw.sec, target);
      var m = $('app-main'); m.style.overflowX = 'clip'; document.body.style.overflowX = 'hidden';
      sw.sec.style.transition = 'none'; sw.sec.style.position = 'relative'; sw.sec.style.zIndex = 3;
      try { document.body.setPointerCapture && e.target.setPointerCapture && e.target.setPointerCapture(e.pointerId); } catch (x) { }
    }
    var tx = sw.dir < 0 ? Math.min(0, dx) : Math.max(0, dx);
    sw.dx = tx;
    sw.sec.style.transform = 'translateX(' + tx + 'px)';
    if (sw.peek) sw.peek.style.transform = 'translateX(' + (tx - sw.dir * (sw.w + GAP)) + 'px)';
    e.preventDefault && e.cancelable && e.preventDefault();
  }
  function onUp(e) {
    if (!sw || (e && e.pointerId !== sw.id)) return;
    if (!sw.drag) { sw = null; return; }
    suppress = performance.now() + 350;
    var s = sw, dt = Math.max(1, performance.now() - s.t0), v = Math.abs(s.dx) / dt;
    var commit = Math.abs(s.dx) > s.w * 0.3 || (v > 0.5 && Math.abs(s.dx) > 40);
    var ease = 'transform .24s cubic-bezier(.2,.8,.2,1)';
    s.sec.style.transition = ease;
    if (s.peek) s.peek.style.transition = ease;
    if (commit) {
      s.sec.style.transform = 'translateX(' + (s.dir * -(s.w + GAP)) + 'px)';
      if (s.peek) s.peek.style.transform = 'translateX(0px)';
      setTimeout(function () {
        var target = s.target; cleanSwipe();
        if (REDUCED) { /* nothing */ }
        var tsec = $(target); if (tsec) { tsec.style.animation = 'none'; setTimeout(function () { tsec.style.animation = ''; }, 60); }
        window.goToStep(target, 0);
      }, 250);
    } else {
      s.sec.style.transform = 'translateX(0px)';
      if (s.peek) s.peek.style.transform = 'translateX(' + (-s.dir * (s.w + GAP)) + 'px)';
      setTimeout(cleanSwipe, 260);
    }
    sw.drag = 'ending';
  }
  document.addEventListener('pointerdown', onDown, { passive: true });
  document.addEventListener('pointermove', onMove, { passive: false });
  document.addEventListener('pointerup', onUp, { passive: true });
  document.addEventListener('pointercancel', function (e) { if (sw && sw.drag === true) { sw.dx = 0; onUp(e); } else if (sw && !sw.drag) sw = null; }, { passive: true });
  document.addEventListener('click', function (e) { if (performance.now() < suppress) { e.stopPropagation(); e.preventDefault(); } }, true);
  document.addEventListener('dragstart', function (e) { e.preventDefault(); }, true);
  window.pwFlow = FLOW;

  /* ---------------------------------------------------------------- init */
  document.addEventListener('DOMContentLoaded', function () {
    buildPanels();
    var m = $('app-main'); if (m) { m.style.position = 'relative'; m.style.touchAction = 'pan-y'; }
    var cv = $('pw-spin'); if (cv) cv.addEventListener('click', function () { window.pwSpinAgain(); });
    setTimeout(function () { onPage('step-welcome'); }, 0);
  });
})();
