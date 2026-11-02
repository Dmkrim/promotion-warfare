/* Promotion Warfare V13: animations for the main pages and the main goal.
   1 career road, 2 flip daily card, 3 greeting scene, 4 goal countdown, 5 power lines, 6 pop-in person, 7 pyramid builds itself,
   8 ally/risk glow, 9 animated map picture, 10 question deck + mini square, 11 strategy reveal, 12 swipe rule cards, 13 before/after in Explain,
   14 week board, 15 move timer ring, 16 talking Adviser + typewriter, 17 chips that slide in, 18 wins wall, 19 pitch writes itself, 20 promotion meter. */
(function () {
  'use strict';
  var P = window.PW12 || {}, $ = function (id) { return document.getElementById(id); };
  var esc = P.esc || function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var lsGet = P.lsGet, lsSet = P.lsSet, toast = P.toast, iso = P.isoDay;
  function fx() { return P.fx ? P.fx() : 'full'; }
  function full() { return fx() === 'full'; }
  function lite() { return fx() !== 'off'; }
  function fb(n) { if (P.fb) P.fb(n); }
  function num(x) { return typeof x === 'number' && isFinite(x) ? x : 0; }
  function moves() { try { return myMoves || []; } catch (e) { return []; } }
  function rows() { try { return mapData || []; } catch (e) { return []; } }
  function curPage() { var s = document.querySelector('main section:not(.hidden)'); return s ? s.id : ''; }
  function burst(el, big, e) { if (!full() || !window.pwBurst) return; try { var r = el.getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, Math.max(60, r.top + 30), !!big, e || '🌟'); } catch (x) { } }
  var BTN = 'rounded-xl text-[11px] font-bold active:scale-95 transition ';

  /* ================= 20 + 1: promotion meter and career road ================= */
  function promoParts() {
    var names = rows().filter(function (d) { return d.name && d.name.trim(); }).length, m = moves(), done = m.filter(function (x) { return x.done; }).length, wins = lsGet('pw_wins_log', []).length;
    var prof = {}; try { prof = PWAvatars.load(); } catch (e) { }
    var L = P.levelOf ? P.levelOf(P.xp()).lvl : 1, st = 0; try { var d = lsGet('pw_daily', {}).done || {}, dd = new Date(); if (!d[iso(dd)]) dd.setDate(dd.getDate() - 1); while (d[iso(dd)] && st < 7) { st++; dd.setDate(dd.getDate() - 1); } } catch (e) { }
    return [['Map', Math.min(names, 6) / 6 * 15], ['Strategy', prof.position ? 10 : 0], ['Moves', Math.min(done, 10) / 10 * 25], ['Wins', Math.min(wins, 5) / 5 * 15], ['Level', Math.min(L - 1, 8) / 8 * 20], ['Streak', st / 7 * 15]];
  }
  function promoPct() { return Math.round(promoParts().reduce(function (a, p) { return a + p[1]; }, 0)); }
  P.promo = promoPct;
  var lastPromo = null;
  function updatePromo(silent) {
    var b = $('promo-bar'), v = promoPct(); if (!b) return v;
    b.style.width = v + '%'; b.setAttribute('aria-valuenow', v); b.parentNode.setAttribute('data-v', v);
    var ms = lsGet('pw_promo_ms', {}), hit = null; [25, 50, 75, 100].forEach(function (t) { if (v >= t && !ms[t]) { ms[t] = 1; hit = t; } });
    if (hit && !silent && lastPromo !== null) { lsSet('pw_promo_ms', ms); milestone(hit); } else if (hit) lsSet('pw_promo_ms', ms);
    lastPromo = v; drawRoad(); return v;
  }
  function milestone(t) {
    fb('level'); var o = document.createElement('div'); o.className = 'ms-ov'; o.innerHTML = '<div class="ms-card"><div class="ms-n">' + t + '%</div><b>' + (t === 100 ? 'Promotion ready!' : 'Milestone reached') + '</b><small>You are ' + t + '% of the way to your goal.</small></div>';
    o.onclick = function () { o.remove(); }; document.body.appendChild(o); setTimeout(function () { o.remove(); }, 2600); burst(document.body, true, '🚩');
    if (P.addXP) P.addXP(10 + t / 5, 'milestone', 'ms' + t);
  }
  function buildPromoBar() {
    if ($('promo-wrap')) return; var w = document.createElement('div'); w.id = 'promo-wrap'; w.title = 'Promotion meter'; w.setAttribute('role', 'progressbar'); w.setAttribute('aria-label', 'Promotion meter');
    w.innerHTML = '<div id="promo-bar"></div><span class="pm-tick" style="left:25%"></span><span class="pm-tick" style="left:50%"></span><span class="pm-tick" style="left:75%"></span>'; document.body.appendChild(w);
    w.onclick = function () { var p = promoParts().map(function (x) { return x[0] + ' ' + Math.round(x[1]); }).join(' · '); toast('🚩 Promotion meter ' + promoPct() + '%. ' + p); };
  }
  var ROAD = [['🗺️', 'Map'], ['🧭', 'Strategy'], ['✅', 'Moves'], ['🏅', 'Wins'], ['⚡', 'Level'], ['🚩', 'Promotion']];
  var roadPos = 0, roadRaf = 0;
  function drawRoad() {
    var box = $('road-card'); if (!box) return; var v = promoPct(); var d = 'M20 46 C70 6 110 6 150 30 S230 54 280 14';
    if (!box.firstChild) {
      box.innerHTML = '<div class="flex justify-between items-center mb-1"><p class="text-[10px] font-bold uppercase tracking-wider text-amber-300">🛣️ Road to promotion</p><b id="road-n" class="text-sm text-white">0%</b></div><svg viewBox="0 0 300 64" class="w-full" role="img" aria-label="Career road"><path d="' + d + '" fill="none" stroke="#334155" stroke-width="7" stroke-linecap="round"/><path id="road-p" d="' + d + '" fill="none" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" stroke-dasharray="4 7"/><text x="282" y="10" font-size="16" id="road-flag">🚩</text><text id="road-av" x="0" y="0" font-size="17" text-anchor="middle">🧑‍💼</text></svg><p id="road-t" class="text-[11px] text-slate-300 text-center"></p>';
    }
    var p = $('road-p'), av = $('road-av'), len = p.getTotalLength(), to = v / 100 * len, from = roadPos;
    var next = promoParts().filter(function (x) { return x[1] < ({ Map: 15, Strategy: 10, Moves: 25, Wins: 15, Level: 20, Streak: 15 })[x[0]] - 0.5; })[0];
    $('road-t').textContent = v >= 100 ? 'You did it. Time for your promotion talk!' : next ? 'Next boost: ' + ({ Map: 'add people to your map', Strategy: 'pick your strategy', Moves: 'finish a move', Wins: 'save a win', Level: 'earn XP', Streak: 'do your daily lesson' })[next[0]] : 'Keep going!';
    cancelAnimationFrame(roadRaf); var t0 = performance.now(), dur = full() ? 1100 : 0, n = $('road-n');
    (function step(t) { var k = dur ? Math.min(1, (t - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3), cur = from + (to - from) * e, pt = p.getPointAtLength(Math.max(0, Math.min(len, cur))); av.setAttribute('x', pt.x); av.setAttribute('y', pt.y - 5); n.textContent = Math.round(cur / len * 100) + '%'; roadPos = cur; if (k < 1) roadRaf = requestAnimationFrame(step); })(t0);
  }

  /* ================= 3: greeting scene, 4: goal countdown ================= */
  function sceneHtml() {
    var h = new Date().getHours(), night = h < 6 || h >= 20, eve = h >= 17 && h < 20, word = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : h < 20 ? 'Good evening' : 'Good night';
    var name = ''; try { name = PWAvatars.load().name || ''; } catch (e) { }
    var st = 0; try { var d = lsGet('pw_daily', {}).done || {}, dd = new Date(); if (!d[iso(dd)]) dd.setDate(dd.getDate() - 1); while (d[iso(dd)]) { st++; dd.setDate(dd.getDate() - 1); } } catch (e) { }
    var sky = night ? 'linear-gradient(#0b1026,#1e1b4b)' : eve ? 'linear-gradient(#7c2d12,#f59e0b)' : h < 9 ? 'linear-gradient(#fb923c,#fde68a)' : 'linear-gradient(#38bdf8,#bae6fd)';
    var orb = night ? '🌙' : eve ? '🌇' : '☀️', stars = night ? '<span class="sc-st" style="left:12%;top:14%">✦</span><span class="sc-st" style="left:40%;top:30%;animation-delay:.6s">✦</span><span class="sc-st" style="left:80%;top:18%;animation-delay:1.2s">✧</span>' : '<span class="sc-cl" style="top:12%">☁️</span><span class="sc-cl sc-cl2" style="top:42%">☁️</span>';
    return '<div class="scene" style="background:' + sky + '">' + stars + '<span class="sc-orb">' + orb + '</span><div class="sc-t"><b>' + word + (name ? ', ' + esc(name) : '') + '!</b><small>' + (st ? '🔥 ' + st + (st === 1 ? ' day' : ' days') + ' in a row' : 'A good day to take one smart move') + '</small></div></div>';
  }
  function goalState() { return lsGet('pw_goal13', null); }
  function renderGoal() {
    var box = $('goal-card'); if (!box) return; var g = goalState(), editing = box.getAttribute('data-edit') === '1', h = '';
    if (!g || editing) {
      h = '<p class="text-[10px] font-bold uppercase tracking-wider text-rose-300 mb-1">🎯 My big goal</p><div class="flex gap-2"><input id="goal13-t" maxlength="50" placeholder="Example: Team Lead" value="' + esc(g ? g.text : '') + '" class="flex-1 min-w-0 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"><input id="goal13-d" type="date" value="' + esc(g ? g.date : '') + '" class="w-[8.5rem] bg-slate-950/80 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100"></div><button onclick="PW13.goalSave()" class="mt-2 w-full py-2 ' + BTN + 'bg-rose-600 text-white">Set my goal</button>';
    } else {
      var t = new Date(g.date + 'T00:00:00'), n = new Date(); n.setHours(0, 0, 0, 0); var left = Math.round((t - n) / 864e5), tot = Math.max(1, Math.round((t - new Date(g.start + 'T00:00:00')) / 864e5)), pc = Math.max(0, Math.min(100, (1 - left / tot) * 100));
      h = '<div class="flex justify-between items-start"><p class="text-[10px] font-bold uppercase tracking-wider text-rose-300">🎯 My big goal</p><button onclick="PW13.goalEdit()" class="text-[10px] text-slate-400 underline">Edit</button></div><p class="text-sm font-bold text-white">' + esc(g.text) + '</p><div class="gl-bar"><div class="gl-fill" style="width:' + pc.toFixed(0) + '%"></div><span class="gl-flag" style="left:' + pc.toFixed(0) + '%">🏃</span><span class="gl-end">🏁</span></div><p class="text-[11px] ' + (left <= 14 && left >= 0 ? 'text-amber-300' : 'text-slate-300') + '">' + (left < 0 ? 'The date has passed. Set a new date or celebrate!' : left === 0 ? 'Today is the day!' : '<b class="gl-n">' + left + '</b> ' + (left === 1 ? 'day' : 'days') + ' left · your promotion meter is ' + promoPct() + '%') + '</p>';
    }
    box.innerHTML = h;
    var nEl = box.querySelector('.gl-n'); if (nEl && P.tick) { var to = parseInt(nEl.textContent, 10); nEl.textContent = to + 20; P.tick(nEl, to); nEl.removeAttribute('data-tv'); }
  }
  function welcomeBuild() {
    var wel = $('step-welcome'); if (!wel) return;
    var g = $('welcome-greet'); if (g && !$('scene13')) { var s = document.createElement('div'); s.id = 'scene13'; g.parentNode.insertBefore(s, g); }
    var sc = $('scene13'); if (sc) { sc.innerHTML = sceneHtml(); }
    var bb = $('welcome-badges'); if (bb && !$('road-card')) { var r = document.createElement('div'); r.id = 'road-card'; r.className = 'mb-3 p-3 rounded-2xl bg-slate-900/70 border border-amber-500/30 text-left'; bb.parentNode.insertBefore(r, bb); var gc = document.createElement('div'); gc.id = 'goal-card'; gc.className = 'mb-3 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-left'; bb.parentNode.insertBefore(gc, bb); }
    roadPos = 0; if ($('road-card')) $('road-card').innerHTML = ''; drawRoad(); renderGoal(); dailyDress();
  }
  var PW13 = window.PW13 = {};
  PW13.goalSave = function () { var t = ($('goal13-t') || {}).value, d = ($('goal13-d') || {}).value; if (!t || !t.trim() || !d) { toast('Write your goal and pick a date'); return; } var old = goalState(); lsSet('pw_goal13', { text: t.trim().slice(0, 50), date: d, start: old && old.start ? old.start : iso() }); $('goal-card').removeAttribute('data-edit'); renderGoal(); fb('good'); if (P.addXP) P.addXP(5, 'goal', 'goal13'); };
  PW13.goalEdit = function () { $('goal-card').setAttribute('data-edit', '1'); renderGoal(); };

  /* ================= 2: flip daily card ================= */
  var dcBusy = false;
  function dailyDress() {
    var box = $('daily-card'); if (!box || dcBusy || !full()) return; if (lsGet('pw_dcopen', '') === iso()) return; if (box.querySelector('.dc-cover')) return;
    if (box.querySelector('button[disabled]')) return; if (!box.firstChild) return;
    dcBusy = true; box.style.position = 'relative'; var c = document.createElement('div'); c.className = 'dc-cover'; c.innerHTML = '<span class="dc-e">☀️</span><b>Today\'s lesson</b><small>Tap to open the card</small>';
    c.onclick = function () { lsSet('pw_dcopen', iso()); fb('whoosh'); c.classList.add('dc-flip'); setTimeout(function () { c.remove(); }, 650); }; box.appendChild(c); setTimeout(function () { dcBusy = false; }, 50);
  }
  (function () { var obs = null; function watch() { var box = $('daily-card'); if (!box || obs) return; obs = new MutationObserver(function () { if (!dcBusy) dailyDress(); }); obs.observe(box, { childList: true }); } window.addEventListener('load', function () { setTimeout(watch, 600); }); P._dcWatch = watch; })();
  var _dc = window.dcDone; if (_dc) window.dcDone = function () { var r = _dc.apply(this, arguments); setTimeout(function () { var box = $('daily-card'); if (box && full()) { var s = document.createElement('div'); s.className = 'dc-stamp'; s.innerHTML = '<span>DONE ✓</span>'; box.style.position = 'relative'; box.appendChild(s); setTimeout(function () { s.remove(); }, 1800); fb('stamp'); burst(box, false, '✅'); } updatePromo(); }, 80); return r; };

  /* ================= 5 power lines, 6 pop-in, 7 build, 8 ally/risk, 9 picture ================= */
  var REL = { a: ['💚', 'Ally', '#34d399'], n: ['⚪', 'Neutral', '#94a3b8'], r: ['🔴', 'Risk', '#f87171'] };
  function relKey(i) { var d = rows()[i]; var cp = ''; try { cp = (window.pwActiveCP && pwActiveCP() && pwActiveCP().id) || ''; } catch (e) { } return cp + '|' + (d && d.name ? d.name.trim().toLowerCase() : ''); }
  var known = {};
  function pyrDecorate() {
    var c = $('pyramid-container'); if (!c) return; var rel = lsGet('pw_rel', {}), seen = {}, risk = 0, ally = 0;
    c.querySelectorAll('.pm').forEach(function (el) {
      var i = parseInt(el.getAttribute('data-i'), 10), d = rows()[i]; if (!d) return; var k = relKey(i), r = rel[k]; el.setAttribute('data-rel', r || ''); if (r === 'r') risk++; if (r === 'a') ally++;
      var tag = el.querySelector('.rel-cyc'); if (!tag) { tag = document.createElement('button'); tag.type = 'button'; tag.className = 'rel-cyc'; tag.setAttribute('aria-label', 'Mark as ally, neutral or risk'); el.appendChild(tag); } tag.textContent = r ? REL[r][0] : '◌'; tag.setAttribute('data-r', r || '');
      seen[k] = 1; if (known._ready && !known[k] && full()) { el.classList.add('pm-new'); var rp = document.createElement('span'); rp.className = 'pm-ripple'; el.appendChild(rp); setTimeout(function () { el.classList.remove('pm-new'); rp.remove(); }, 1200); fb('good'); }
    });
    Object.keys(seen).forEach(function (k) { known[k] = 1; }); known._ready = true;
    var sm = $('rel-sum'); if (!sm) { sm = document.createElement('p'); sm.id = 'rel-sum'; sm.className = 'text-[11px] text-center text-slate-400 mb-2'; c.parentNode.insertBefore(sm, c); }
    sm.innerHTML = ((ally || risk) ? '💚 <b>' + ally + '</b> ally · 🔴 <b class="' + (risk ? 'text-red-300' : '') + '">' + risk + '</b> risk' : 'Tap the small circle <b>◌</b> on a person to mark Ally, Neutral or Risk.') + ' <button onclick="PW13.pyrReplay()" class="ml-1 px-2 py-0.5 rounded-lg bg-slate-700 text-amber-300 text-[10px] font-bold">▶ Play build</button>';
    drawLines(c); pmBarRel();
  }
  function drawLines(c) {
    var old = c.querySelector('.pl-svg'); if (old) old.remove(); if (fx() === 'off') return;
    var mem = [].slice.call(c.querySelectorAll('.pm')); if (mem.length < 2) return;
    var byTier = {}; mem.forEach(function (el) { var t = el.closest('.pm-tier'); var k = t ? t.getAttribute('data-tier') : '4'; (byTier[k] = byTier[k] || []).push(el); });
    c.style.position = 'relative'; var cr = c.getBoundingClientRect(), sy = c.scrollTop, W = c.scrollWidth, H = c.scrollHeight, p = '', gi = 0;
    function pt(el, top) { var r = el.getBoundingClientRect(); return [r.left - cr.left + r.width / 2 + c.scrollLeft, (top ? r.top : r.bottom) - cr.top + sy]; }
    [4, 3, 2].forEach(function (t) {
      var up = byTier[t - 1] || (t === 4 ? byTier[2] : null) || byTier[t - 2]; if (t === 3 && !byTier[2]) up = byTier[1]; if (!up || !byTier[t]) return;
      byTier[t].forEach(function (el, k) { var a = pt(el, true), b = pt(up[k % up.length], false), my = (a[1] + b[1]) / 2, w = (5 - t) * 0.9 + .6, col = t === 4 ? '#34d399' : t === 3 ? '#38bdf8' : '#a855f7';
        p += '<path class="pl-p" d="M' + a[0].toFixed(0) + ' ' + a[1].toFixed(0) + ' C' + a[0].toFixed(0) + ' ' + my.toFixed(0) + ' ' + b[0].toFixed(0) + ' ' + my.toFixed(0) + ' ' + b[0].toFixed(0) + ' ' + b[1].toFixed(0) + '" stroke="' + col + '" stroke-width="' + w.toFixed(1) + '" style="animation-delay:' + (gi++ * .08) + 's"/>'; });
    });
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'pl-svg'); s.setAttribute('width', W); s.setAttribute('height', H); s.setAttribute('aria-hidden', 'true'); s.innerHTML = p; c.appendChild(s);
  }
  function pmBarRel() {
    var bar = $('pm-bar'); if (!bar || bar.classList.contains('hidden') || bar.querySelector('.rel-btns')) return; var sel = document.querySelector('#pyramid-container .pm.ring-2'); var i = sel ? parseInt(sel.getAttribute('data-i'), 10) : -1; if (i < 0) return;
    var cur = lsGet('pw_rel', {})[relKey(i)], w = document.createElement('span'); w.className = 'rel-btns flex gap-1 w-full mt-1';
    w.innerHTML = Object.keys(REL).map(function (k) { return '<button onclick="PW13.rel(' + i + ',\'' + k + '\')" class="flex-1 px-1.5 py-1 rounded-lg text-[10px] font-bold border ' + (cur === k ? 'bg-slate-100 text-slate-900' : 'bg-slate-800 text-slate-200 border-slate-600') + '">' + REL[k][0] + ' ' + REL[k][1] + '</button>'; }).join(''); bar.appendChild(w);
  }
  PW13.rel = function (i, k) { var r = lsGet('pw_rel', {}), key = relKey(i); if (r[key] === k) delete r[key]; else r[key] = k; lsSet('pw_rel', r); fb(k === 'r' ? 'bad' : 'good'); if (window.pmSelect) pmSelect(i); if (P.addXP) P.addXP(3, 'rel', 'rel' + key); };
  function pyrWatch() {
    var c = $('pyramid-container'); if (!c || c._w13) return; c._w13 = 1; var busy = false;
    new MutationObserver(function () { if (busy) return; busy = true; setTimeout(function () { try { pyrDecorate(); } catch (e) { console.error(e); } busy = false; }, 30); }).observe(c, { childList: true });
    c.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('.rel-cyc'); if (!b) return; e.stopPropagation(); e.preventDefault(); var el = b.closest('.pm'), i = parseInt(el.getAttribute('data-i'), 10), r = lsGet('pw_rel', {}), k = relKey(i), order = ['', 'a', 'n', 'r'], nx = order[(order.indexOf(r[k] || '') + 1) % 4]; if (nx) r[k] = nx; else delete r[k]; lsSet('pw_rel', r); fb(nx === 'r' ? 'bad' : nx ? 'good' : 'tap'); pyrDecorate(); if (nx && P.addXP) P.addXP(3, 'rel', 'rel' + k); }, true);
    pyrDecorate();
  }
  function pyrBuild() {
    var c = $('pyramid-container'); if (!c || !lite()) return; c.classList.remove('pyr-build'); var h = $('holo'); if (h) h.classList.remove('holo-build'); void c.offsetWidth;
    if (h) { [].forEach.call(h.querySelectorAll('.hl'), function (el) { var i = Math.round((parseInt(el.style.top, 10) || 0) / 44); el.style.animationDelay = ((3 - i) * 0.45).toFixed(2) + 's'; }); var av = h.querySelector('.holo-av'); if (av) av.style.animationDelay = '1.9s'; h.classList.add('holo-build'); }
    c.classList.add('pyr-build'); fb('whoosh'); var old = c.querySelector('.pl-svg'); if (old) old.remove(); setTimeout(function () { c.classList.remove('pyr-build'); if (h) h.classList.remove('holo-build'); drawLines(c); }, 3800);
  }
  PW13.pyrReplay = function () { pyrBuild(); };
  var _amr = window.addMapRow; if (_amr) window.addMapRow = function () { var r = _amr.apply(this, arguments); setTimeout(function () { var tr = document.querySelector('#map-table-body tr:last-child'); if (tr && full()) { tr.classList.add('row-pop'); setTimeout(function () { tr.classList.remove('row-pop'); }, 900); fb('tap'); var inp = tr.querySelector('input'); } }, 30); return r; };
  function picWatch() {
    var b = $('pyr-svg'); if (!b || b._w13) return; b._w13 = 1;
    new MutationObserver(function () { var s = b.querySelector('svg'); if (!s || s._an || !full()) return; s._an = 1; var k = 0; [].forEach.call(s.querySelectorAll('rect,path,polygon,circle,text,g > *'), function (el) { if (el.closest('defs')) return; el.classList.add('pic-in'); el.style.animationDelay = (k++ * 0.04).toFixed(2) + 's'; }); if (!$('pic-replay')) { var rb = document.createElement('button'); rb.id = 'pic-replay'; rb.className = 'mt-1 px-3 py-1 ' + BTN + 'bg-slate-700 text-slate-100'; rb.textContent = '▶ Replay'; rb.onclick = function () { s._an = 0; var ch = [].slice.call(s.querySelectorAll('.pic-in')); ch.forEach(function (e) { e.classList.remove('pic-in'); void e.getBBox; }); void s.getBoundingClientRect(); b.dispatchEvent(new Event('x')); var kk = 0; ch.forEach(function (e) { e.classList.add('pic-in'); e.style.animationDelay = (kk++ * 0.04).toFixed(2) + 's'; }); }; b.parentNode.insertBefore(rb, b.nextSibling); } fb('whoosh'); }).observe(b, { childList: true, subtree: true });
  }


  /* picture overlay (9): the old picture box was removed in V09, so this brings back a clean one */
  function picButton() {
    var s = $('step-map-pyramid'); if (!s || $('pic-btn')) return; var c = $('pyramid-container'); var b = document.createElement('button'); b.id = 'pic-btn'; b.className = 'w-full mb-3 py-2.5 ' + BTN + 'bg-gradient-to-r from-amber-500 to-red-500 text-white'; b.innerHTML = '📸 Make a picture to share'; b.onclick = picOpen; c.parentNode.insertBefore(b, c.nextSibling);
  }
  function picOpen() {
    var o = $('pic-ov'); if (!o) { o = document.createElement('div'); o.id = 'pic-ov'; o.className = 'pic-ov'; o.setAttribute('data-noswipe', ''); o.innerHTML = '<div class="pic-card"><div class="flex justify-between items-center mb-2"><b class="text-white text-sm">📸 My Power Pyramid</b><button onclick="PW13.picClose()" class="text-slate-400 text-lg px-2" aria-label="Close">✕</button></div><label class="text-[11px] text-slate-300 font-bold" for="pyr-me">Which one is you?</label><select id="pyr-me" onchange="showPyramidDrawing()" class="w-full mb-2 bg-slate-950 text-slate-100 text-xs rounded-xl p-2 border border-slate-700"></select><div id="pyr-svg" class="hidden"></div><div id="pyr-actions" class="hidden mt-2 flex gap-2"><button onclick="savePyramidImage()" class="flex-1 py-2.5 ' + BTN + 'bg-emerald-600 text-white">⬇️ Save or share picture</button></div></div>'; document.body.appendChild(o); picWatch(); }
    var sel = $('pyr-me'), names = rows().filter(function (d) { return d.name && d.name.trim(); }).map(function (d) { return d.name; }), saved = lsGet('pw_me_name', '');
    sel.innerHTML = '<option value="">Not on the map</option>' + names.map(function (n) { return '<option value="' + esc(n) + '"' + (n === saved ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join(''); o.style.display = 'flex';
    var sv = $('pyr-svg'); if (sv) { var q = sv.querySelector('svg'); if (q) q._an = 0; sv.innerHTML = ''; } if (window.showPyramidDrawing) showPyramidDrawing();
  }
  PW13.picClose = function () { var o = $('pic-ov'); if (o) o.style.display = 'none'; };

  /* ================= 10 question deck + mini square, 11 strategy reveal ================= */
  var SQ = { leader: ['🛡️', 'Defensive', '#10b981'], challenger: ['⚔️', 'Offensive', '#a855f7'], flanker: ['🚀', 'Flanking', '#f97316'], guerrilla: ['🥷', 'Guerrilla', '#ef4444'] };
  function miniSquare(step, chosen) {
    var off = { 'step-q1': [], 'step-q2': ['leader'], 'step-q3': ['leader', 'challenger'] }[step] || [];
    return '<div class="sq-mini" aria-hidden="true">' + Object.keys(SQ).map(function (k) { var dim = off.indexOf(k) >= 0, on = chosen === k; return '<span class="sq-b' + (dim ? ' sq-off' : '') + (on ? ' sq-on' : '') + '" style="--c:' + SQ[k][2] + '">' + SQ[k][0] + '<small>' + SQ[k][1] + '</small></span>'; }).join('') + '</div>';
  }
  function qDress(id) {
    var s = $(id); if (!s) return; var old = s.querySelector('.sq-mini'); if (old) old.remove(); var h = s.querySelector('.flex.items-center.space-x-3'); if (!h) return; h.insertAdjacentHTML('afterend', miniSquare(id));
    if (full()) { s.classList.remove('deal-in'); void s.offsetWidth; s.classList.add('deal-in'); setTimeout(function () { s.classList.remove('deal-in'); }, 700); fb('whoosh'); }
  }
  function stratReveal(id) {
    var key = id.replace('strat-', ''), sq = SQ[key]; if (!sq || !full()) return; var o = document.createElement('div'); o.className = 'sr-ov';
    o.innerHTML = '<div class="sr-deck">' + Object.keys(SQ).map(function (k, i) { return '<div class="sr-c" style="--i:' + i + ';--c:' + SQ[k][2] + '">' + SQ[k][0] + '</div>'; }).join('') + '</div><div class="sr-win" style="--c:' + sq[2] + '"><div class="sr-big">' + sq[0] + '</div><b>' + sq[1] + ' Warfare</b><small>Your strategy</small></div>';
    document.body.appendChild(o); fb('good'); setTimeout(function () { burst(o.querySelector('.sr-win'), false, sq[0]); }, 1300); var close = function () { o.classList.add('sr-out'); setTimeout(function () { o.remove(); }, 400); }; o.onclick = close; setTimeout(close, 2600);
  }

  /* ================= 12 swipe rule cards, 13 explain scene ================= */
  var swipeHinted = {};
  function ruleCards(id) {
    var s = $(id); if (!s || !/^strat-/.test(id)) return; var list = s.querySelector('.space-y-4'); if (!list) return;
    if (!swipeHinted[id] && !list.previousElementSibling.classList.contains('sw-hint')) { var hint = document.createElement('p'); hint.className = 'sw-hint text-[10px] text-slate-500 text-center -mt-2 mb-2'; hint.textContent = '👉 Swipe a card right to add it to your plan, left to skip.'; list.parentNode.insertBefore(hint, list); }
    [].forEach.call(list.children, function (c) { if (c._sw) return; if (!c.querySelector('.doit-btn')) return; c._sw = 1; c.setAttribute('data-noswipe', ''); c.style.touchAction = 'pan-y'; bindSwipe(c); });
  }
  function bindSwipe(c) {
    var x0 = null, y0 = 0, dx = 0, lock = false;
    c.addEventListener('pointerdown', function (e) { if (e.target.closest('button')) return; x0 = e.clientX; y0 = e.clientY; dx = 0; lock = false; c.style.transition = 'none'; });
    c.addEventListener('pointermove', function (e) { if (x0 == null) return; var ddx = e.clientX - x0, ddy = e.clientY - y0; if (!lock && Math.abs(ddy) > 14 && Math.abs(ddy) > Math.abs(ddx)) { x0 = null; c.style.transform = ''; return; } if (Math.abs(ddx) > 8) { lock = true; try { c.setPointerCapture(e.pointerId); } catch (z) { } } if (!lock) return; dx = ddx; c.style.transform = 'translateX(' + dx + 'px) rotate(' + dx / 30 + 'deg)'; c.setAttribute('data-sw', dx > 40 ? 'r' : dx < -40 ? 'l' : ''); });
    var up = function () { if (x0 == null) return; x0 = null; c.removeAttribute('data-sw'); c.style.transition = 'transform .4s cubic-bezier(.2,1.6,.4,1), opacity .3s'; c.style.transform = '';
      if (dx > 90) { var b = c.querySelector('.doit-btn'); if (b && !/Added/.test(b.textContent)) { b.click(); c.classList.add('sw-did'); setTimeout(function () { c.classList.remove('sw-did'); }, 900); fb('good'); bounceCounter(); } else toast('Already in your plan'); }
      else if (dx < -90) { c.classList.toggle('sw-skip'); fb('tap'); } dx = 0; };
    c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up);
  }
  function bounceCounter() { ['stat-picks'].forEach(function (id) { var e = $(id); if (e) { e.classList.remove('cnt-b'); void e.offsetWidth; e.classList.add('cnt-b'); } }); var hb = document.querySelector('header button[onclick*="step-action-plan"]'); if (hb) { hb.classList.remove('cnt-b'); void hb.offsetWidth; hb.classList.add('cnt-b'); } }
  var _atp = window.addToPlan; if (_atp) window.addToPlan = function () { var r = _atp.apply(this, arguments); bounceCounter(); return r; };
  function explainScene() {
    var b = $('modal-body'); if (!b || b.querySelector('.ex-scene') || !lite()) return; var ex = b.querySelector('li') || b.querySelectorAll('p')[1]; if (!ex) return; var t = ex.textContent.trim(); var first = t.split(/(?<=[.!?])\s/)[0].slice(0, 110);
    var d = document.createElement('div'); d.className = 'ex-scene'; d.innerHTML = '<div class="ex-row"><span class="ex-f ex-bad">😟</span><span class="ex-bub ex-b1">Before: unsure, no plan</span></div><div class="ex-row ex-r2"><span class="ex-f ex-good">😎</span><span class="ex-bub ex-b2">After: ' + esc(first) + '</span></div>'; b.insertBefore(d, b.firstChild);
  }

  /* ================= 14 week board, 15 move timer ================= */
  function weekBoard() {
    var s = $('step-action-plan'); if (!s) return; var box = $('week-board'); if (!box) { box = document.createElement('div'); box.id = 'week-board'; var anchor = s.querySelector('.grid.grid-cols-3'); if (!anchor) return; anchor.parentNode.insertBefore(box, anchor); }
    var act = lsGet('pw_act', {}), dly = lsGet('pw_daily', {}).done || {}, now = new Date(), dow = (now.getDay() + 6) % 7, mon = new Date(now); mon.setDate(now.getDate() - dow); var days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], hit = 0, h = '';
    for (var i = 0; i < 7; i++) { var d = new Date(mon); d.setDate(mon.getDate() + i); var k = iso(d), on = num(act[k]) > 0 || dly[k], fut = i > dow; if (on) hit++; h += '<div class="wk-t' + (on ? ' wk-on' : '') + (i === dow ? ' wk-today' : '') + (fut ? ' wk-fut' : '') + '" style="animation-delay:' + (i * .07) + 's"><span>' + (on ? '✅' : fut ? '·' : '⭕') + '</span><small>' + days[i] + '</small></div>'; }
    box.className = 'mb-3'; box.innerHTML = '<p class="text-[11px] font-bold text-slate-300 mb-1">⚔️ Battle board this week</p><div class="wk-row' + (hit === 7 ? ' wk-perfect' : '') + '">' + h + (hit === 7 ? '<div class="wk-flame">🔥🔥🔥</div>' : '') + '</div><p class="text-[10px] text-slate-400 mt-1 text-center">' + (hit === 7 ? '🔥 Perfect week!' : hit >= 5 ? '💪 Strong week: ' + hit + ' of 7 days' : hit + ' of 7 days active') + '</p>';
    if (hit === 7 && P.addXP) P.addXP(30, 'perfectweek', 'pw' + iso(mon));
  }
  var mt = lsGet('pw_mtrun', null), mtT = 0;
  function mtLeft() { return mt ? (mt.paused ? mt.left : Math.max(0, Math.round((mt.end - Date.now()) / 1000))) : 0; }
  function mtPanel() {
    var s = $('step-action-plan'); var box = $('mt-panel'); if (!s) return; if (!box) { var mm = $('my-moves'); if (!mm) return; box = document.createElement('div'); box.id = 'mt-panel'; mm.parentNode.insertBefore(box, mm); }
    if (!mt) { box.innerHTML = ''; box.className = ''; return; } var C = 2 * Math.PI * 26, left = mtLeft(), pc = 1 - left / mt.total; box.className = 'mb-3 p-3 rounded-2xl bg-slate-900/70 border border-teal-500/40 flex items-center gap-3';
    box.innerHTML = '<svg viewBox="0 0 64 64" width="64" height="64" role="timer"><circle cx="32" cy="32" r="26" fill="none" stroke="#334155" stroke-width="6"/><circle id="mt-arc" cx="32" cy="32" r="26" fill="none" stroke="#2dd4bf" stroke-width="6" stroke-linecap="round" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - pc)).toFixed(1) + '" transform="rotate(-90 32 32)"/><text id="mt-t" x="32" y="37" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">' + fmt(left) + '</text></svg><div class="flex-1 min-w-0"><p class="text-[10px] text-teal-300 font-bold">Working on</p><p class="text-xs text-white truncate">' + esc(mt.text) + '</p><div class="flex gap-1.5 mt-1.5"><button onclick="PW13.mtPause()" class="px-2.5 py-1 ' + BTN + 'bg-slate-700 text-slate-100">' + (mt.paused ? '▶' : '⏸') + '</button><button onclick="PW13.mtStop()" class="px-2.5 py-1 ' + BTN + 'bg-slate-700 text-red-300">Stop</button></div></div>';
  }
  function fmt(s) { return ('0' + Math.floor(s / 60)).slice(-2) + ':' + ('0' + (s % 60)).slice(-2); }
  function mtLoop() { clearInterval(mtT); mtT = setInterval(function () { if (!mt) { clearInterval(mtT); return; } if (mt.paused) return; var l = mtLeft(), t = $('mt-t'), a = $('mt-arc'), C = 2 * Math.PI * 26; if (t) t.textContent = fmt(l); if (a) a.setAttribute('stroke-dashoffset', (C * l / mt.total).toFixed(1)); if (l <= 0) { clearInterval(mtT); mtDone(); } }, 500); }
  function mtDone() {
    var m = mt; mt = null; lsSet('pw_mtrun', null); var box = $('mt-panel'); fb('level');
    if (box) { box.className = 'mb-3 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/50 text-center mt-snap'; box.innerHTML = '<div class="text-3xl">✅</div><p class="text-xs font-bold text-white">Time is up!</p><p class="text-[11px] text-slate-300 truncate">' + esc(m.text) + '</p><button onclick="PW13.mtFinish(' + m.i + ')" class="mt-2 w-full py-2 ' + BTN + 'bg-emerald-600 text-white">Mark this move as done</button>'; burst(box, true, '⏱️'); }
    if (P.addXP) P.addXP(5, 'timer');
  }
  PW13.mtFinish = function (i) { var m = moves()[i]; if (m && !m.done && window.toggleMove) toggleMove(i); mtPanel(); };
  PW13.mtStart = function (i, min) { var m = moves()[i]; if (!m) return; var sec = (min || 15) * 60; mt = { i: i, text: m.text, total: sec, end: Date.now() + sec * 1000, paused: false }; lsSet('pw_mtrun', mt); mtPanel(); mtLoop(); fb('tap'); };
  PW13.mtPause = function () { if (!mt) return; if (mt.paused) { mt.end = Date.now() + mt.left * 1000; mt.paused = false; } else { mt.left = mtLeft(); mt.paused = true; } lsSet('pw_mtrun', mt); mtPanel(); };
  PW13.mtStop = function () { mt = null; lsSet('pw_mtrun', null); clearInterval(mtT); mtPanel(); };
  function moveButtons() {
    var box = $('my-moves'); if (!box) return; [].forEach.call(box.children, function (row, i) { if (row.querySelector('.mt-go') || !row.querySelector('input[type=checkbox]')) return; var done = row.querySelector('input').checked; if (done) return; var b = document.createElement('button'); b.className = 'mt-go text-teal-300 text-xs px-1'; b.setAttribute('aria-label', 'Start a 15 minute timer for this move'); b.title = 'Start 15 min'; b.innerHTML = '<i class="fa-solid fa-stopwatch"></i>'; b.onclick = function () { PW13.mtStart(i, 15); }; row.insertBefore(b, row.lastElementChild); });
  }

  /* ================= 16 talking Adviser, 17 chips ================= */
  var chatTyping = false;
  function chatWatch() {
    var log = $('chat-log'); if (!log || log._w13) return; log._w13 = 1;
    new MutationObserver(function () {
      var hasTyping = !!log.querySelector('.typing'); var last = log.lastElementChild;
      if (hasTyping) { chatTyping = true; var av = last && last.firstElementChild; if (av) av.classList.add('adv-think'); var lastUser = log.querySelectorAll('.justify-end'); var q = lastUser.length ? lastUser[lastUser.length - 1].textContent : ''; if (av && /\?\s*$/.test(q.trim())) av.classList.add('adv-tilt'); return; }
      if (chatTyping && last && !last.classList.contains('justify-end')) { chatTyping = false; typeBubble(last); }
      chipsIn();
    }).observe(log, { childList: true });
    var ch = $('chat-chips'); if (ch) new MutationObserver(function () { practiceChip(); chipsIn(); }).observe(ch, { childList: true });
  }
  function typeBubble(row) {
    if (!lite()) return; var bub = row.children[1]; if (!bub) return; var av = row.firstElementChild; if (av) av.classList.add('adv-talk');
    var nodes = [], chipBox = null; var w = document.createTreeWalker(bub, NodeFilter.SHOW_TEXT, { acceptNode: function (n) { return n.parentElement.closest('button,a') ? NodeFilter.FILTER_REJECT : (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP); } }), n;
    while ((n = w.nextNode())) nodes.push({ n: n, t: n.nodeValue }); var total = nodes.reduce(function (a, x) { return a + x.t.length; }, 0); if (!total) { if (av) av.classList.remove('adv-talk'); return; }
    bub.querySelectorAll('button').forEach(function (b) { b.classList.add('chip-wait'); }); nodes.forEach(function (x) { x.n.nodeValue = ''; });
    var shown = 0, per = Math.max(2, Math.ceil(total / 55)), log = $('chat-log'), done = false;
    function finish() { if (done) return; done = true; clearInterval(iv); nodes.forEach(function (x) { x.n.nodeValue = x.t; }); if (av) { av.classList.remove('adv-talk'); av.classList.add('adv-nod'); setTimeout(function () { av.classList.remove('adv-nod'); }, 800); } bub.querySelectorAll('.chip-wait').forEach(function (b, i) { b.classList.remove('chip-wait'); b.classList.add('chip-in'); b.style.animationDelay = (i * .1) + 's'; }); if (log) log.scrollTop = log.scrollHeight; }
    var iv = setInterval(function () { shown += per; var left = shown; nodes.forEach(function (x) { var k = Math.max(0, Math.min(x.t.length, left)); x.n.nodeValue = x.t.slice(0, k); left -= x.t.length; }); if (log) log.scrollTop = log.scrollHeight; if (shown >= total) finish(); }, 25);
    bub.onclick = finish;
  }
  function chipsIn() { var ch = $('chat-chips'); if (!ch || !lite()) return; [].forEach.call(ch.children, function (b, i) { if (b._in) return; b._in = 1; b.classList.add('chip-in'); b.style.animationDelay = (.15 + i * .08) + 's'; }); }
  var PRACT = [[/boss|manager|difficult|angry|micromanag/i, 'step-boss12', 'Boss Battles'], [/raise|salary|pay|money/i, 'step-salary', 'Salary Helper'], [/feedback|criticism|review/i, 'step-makeover', 'Message Makeover'], [/gossip|rumou?r|politic|credit|steal/i, 'step-flags', 'Spot the Red Flag'], [/meeting|1:1|one on one/i, 'step-meeting', 'Meeting Planner'], [/mistake|smart|what should i do/i, 'step-swipe', 'Swipe Cards']];
  function practiceChip() {
    var ch = $('chat-chips'), log = $('chat-log'); if (!ch || !log || !ch.children.length || ch.querySelector('.pr-chip')) return; var us = log.querySelectorAll('.justify-end'); var q = us.length ? us[us.length - 1].textContent : ''; var hit = PRACT.filter(function (p) { return p[0].test(q); })[0]; if (!hit) return;
    var b = document.createElement('button'); b.className = 'pr-chip shrink-0 px-3 py-1.5 rounded-full bg-violet-600 text-white text-[11px] font-semibold active:scale-95'; b.textContent = '🎮 Practice it: ' + hit[2]; b.onclick = function () { if (window.closeAdviser) closeAdviser(); setTimeout(function () { goToStep(hit[1], 0); }, 80); }; ch.appendChild(b);
  }

  /* ================= 18 wins wall, 19 pitch writes itself ================= */
  var wallN = -1;
  function hasNum(t) { return /\d/.test(t || ''); }
  function wallDraw() {
    var s = $('step-journal'); if (!s) return; var box = $('wins-wall'); if (!box) { var l = $('win-list'); if (!l) return; box = document.createElement('div'); box.id = 'wins-wall'; box.className = 'mb-3'; l.parentNode.insertBefore(box, l); }
    var w = lsGet('pw_wins_log', []), show = w.slice(-48), per = 6, nums = w.filter(function (x) { return hasNum(x.t); }).length, grew = wallN >= 0 && w.length > wallN; wallN = w.length;
    if (!w.length) { box.innerHTML = '<p class="text-[11px] text-slate-500 text-center italic">Your wins will build a wall here. Every win is one brick.</p>'; return; }
    var h = '<div class="wall" role="img" aria-label="Wall of ' + w.length + ' wins">'; var rowsN = Math.ceil(show.length / per);
    for (var r = rowsN - 1; r >= 0; r--) { h += '<div class="wall-r' + (r % 2 ? ' wall-o' : '') + '">'; for (var c = 0; c < per; c++) { var i = r * per + c; if (i >= show.length) { h += '<span class="brick brick-e"></span>'; continue; } var win = show[i], g = hasNum(win.t), last = grew && i === show.length - 1; h += '<button class="brick' + (g ? ' brick-g' : '') + (last ? ' brick-drop' : '') + '" onclick="PW13.brick(' + (w.length - show.length + i) + ')" style="animation-delay:' + (i * 0.015) + 's" aria-label="' + esc(win.t).slice(0, 60) + '"></button>'; } h += '</div>'; }
    h += '</div><p id="wall-cap" class="text-[11px] text-center text-slate-400 mt-1">🧱 <b class="text-white">' + w.length + '</b> wins · <b class="text-amber-300">' + nums + '</b> with numbers (gold)</p>'; box.innerHTML = h;
    if (grew) { fb('stamp'); P.shake && 0; }
  }
  PW13.brick = function (i) { var w = lsGet('pw_wins_log', [])[i], c = $('wall-cap'); if (w && c) c.innerHTML = '🧱 ' + esc(w.t) + ' <span class="text-slate-500">· ' + esc(w.d || '') + '</span>'; fb('tap'); };
  var _ptm = window.ptMake; if (_ptm) window.ptMake = function (quiet) {
    var out0 = $('pt-out'); var r = _ptm.apply(this, arguments); if (quiet || !full()) return r; var out = $('pt-out'); if (!out || !out.value) return r;
    var text = out.value, k = 0, pan = $('pt-panel'); out.value = ''; out.classList.add('pt-writing'); var list = $('win-list'); if (list) [].forEach.call(list.children, function (c, i) { if (i < 5) { setTimeout(function () { c.classList.add('win-glow'); setTimeout(function () { c.classList.remove('win-glow'); }, 700); }, i * 180); } });
    var per = Math.max(3, Math.ceil(text.length / 70)); var iv = setInterval(function () { k += per; out.value = text.slice(0, k); out.scrollTop = out.scrollHeight; if (k >= text.length) { clearInterval(iv); out.value = text; out.classList.remove('pt-writing'); var st = document.createElement('div'); st.className = 'pt-stamp'; st.innerHTML = '<span>READY TO PRESENT</span>'; pan.style.position = 'relative'; pan.appendChild(st); setTimeout(function () { st.remove(); }, 2200); fb('stamp'); } }, 25); return r;
  };

  /* ================= page wiring ================= */
  var _go = window.goToStep, prevPage = 'step-welcome';
  window.goToStep = function (id, p, fromPop) {
    var from = curPage(); var r = _go(id, p, fromPop);
    try {
      if (id === 'step-welcome') welcomeBuild();
      if (/^step-q[123]$/.test(id)) qDress(id);
      if (/^strat-/.test(id)) { ruleCards(id); if (/^step-q[123]$/.test(from)) { var key = id.replace('strat-', ''); stratReveal(id); } }
      if (id === 'step-map-pyramid') { pyrWatch(); picButton(); pyrBuild(); setTimeout(function () { var c = $('pyramid-container'); if (c) drawLines(c); }, 120); }
      if (id === 'step-action-plan') { weekBoard(); mtPanel(); moveButtons(); if (mt && !mt.paused) mtLoop(); }
      if (id === 'step-journal') wallDraw();
      updatePromo();
    } catch (e) { console.error(e); }
    return r;
  };
  var _rm = window.renderMoves; if (_rm) window.renderMoves = function () { var r = _rm.apply(this, arguments); try { moveButtons(); updatePromo(); } catch (e) { } return r; };
  var _rw = window.addWin; if (_rw) window.addWin = function () { var r = _rw.apply(this, arguments); setTimeout(function () { wallDraw(); updatePromo(); }, 30); return r; };
  var _dw = window.delWin; if (_dw) window.delWin = function () { var r = _dw.apply(this, arguments); setTimeout(wallDraw, 30); return r; };
  var _ax = P.addXP; if (_ax) P.addXP = function () { var r = _ax.apply(this, arguments); setTimeout(updatePromo, 60); return r; };
  var _om = window.openModal; if (_om) window.openModal = function () { var r = _om.apply(this, arguments); setTimeout(explainScene, 30); return r; };
  var _cm = window.chipTap;

  /* ================= styles ================= */
  function css() {
    if ($('v13-css')) return; var s = document.createElement('style'); s.id = 'v13-css';
    s.textContent = [
      '#promo-wrap{position:fixed;top:0;left:0;right:0;height:4px;z-index:70;background:rgba(51,65,85,.5);cursor:pointer}#promo-bar{height:100%;width:0;background:linear-gradient(90deg,#ef4444,#f59e0b,#34d399);transition:width 1s cubic-bezier(.3,1,.4,1);box-shadow:0 0 8px rgba(251,191,36,.7)}.pm-tick{position:absolute;top:0;width:1px;height:100%;background:rgba(15,23,42,.8)}html.fx-off #promo-bar{transition:none;box-shadow:none}',
      '.ms-ov{position:fixed;inset:0;z-index:96;background:rgba(2,6,23,.75);display:flex;align-items:center;justify-content:center}.ms-card{text-align:center;color:#fff;animation:lvPop .6s cubic-bezier(.2,1.6,.4,1)}.ms-n{font-size:80px;font-weight:900;color:#fbbf24;text-shadow:0 0 30px #f59e0b;line-height:1}.ms-card b{display:block;font-size:20px}.ms-card small{color:#cbd5e1}',
      '.scene{position:relative;height:70px;border-radius:16px;overflow:hidden;margin-bottom:8px;text-align:left}.sc-orb{position:absolute;right:16px;top:8px;font-size:34px}html.fx-full .sc-orb{animation:scO 6s ease-in-out infinite alternate}@keyframes scO{to{transform:translateY(8px) rotate(14deg)}}',
      '.sc-cl{position:absolute;left:-10%;font-size:22px;opacity:.85}html.fx-full .sc-cl{animation:scC 16s linear infinite}.sc-cl2{animation-duration:23s!important;animation-delay:-8s!important}@keyframes scC{to{left:105%}}.sc-st{position:absolute;color:#fef9c3;font-size:11px}html.fx-full .sc-st{animation:scS 2.4s ease-in-out infinite}@keyframes scS{50%{opacity:.2}}',
      '.sc-t{position:absolute;left:12px;bottom:8px;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6);display:flex;flex-direction:column;line-height:1.2}.sc-t b{font-size:14px}.sc-t small{font-size:11px}',
      '.gl-bar{position:relative;height:8px;border-radius:6px;background:#334155;margin:10px 18px 8px 0}.gl-fill{height:100%;border-radius:6px;background:linear-gradient(90deg,#f43f5e,#fbbf24);transition:width 1s}.gl-flag{position:absolute;top:-10px;margin-left:-8px;font-size:16px;transition:left 1s}.gl-end{position:absolute;right:-18px;top:-8px;font-size:15px}html.fx-full .gl-flag{animation:glR .6s ease-in-out infinite alternate}@keyframes glR{to{transform:translateY(-3px)}}',
      '.dc-cover{position:absolute;inset:0;z-index:3;border-radius:16px;background:linear-gradient(135deg,#0ea5e9,#6366f1);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transform-origin:0 50%;backface-visibility:hidden;box-shadow:0 8px 20px rgba(0,0,0,.35)}.dc-cover b{font-size:15px}.dc-cover small{font-size:11px;opacity:.9}.dc-e{font-size:30px}html.fx-full .dc-cover:not(.dc-flip) .dc-e{animation:rcI 1.6s infinite alternate}.dc-flip{animation:dcF .65s ease-in forwards}@keyframes dcF{to{transform:perspective(700px) rotateY(-110deg);opacity:0}}',
      '.dc-stamp{position:absolute;inset:0;z-index:3;display:flex;align-items:center;justify-content:center;pointer-events:none}.dc-stamp span{border:3px solid #34d399;color:#34d399;font-weight:900;font-size:22px;padding:2px 14px;border-radius:8px;background:rgba(2,6,23,.8);animation:qsS 1.8s ease-out forwards}',
      '.pl-svg{position:absolute;left:0;top:0;pointer-events:none;overflow:visible;z-index:0}.pl-p{fill:none;stroke-linecap:round;opacity:.65;filter:drop-shadow(0 0 3px currentColor);stroke-dasharray:6 5}html.fx-full .pl-p{animation:plD 2s linear infinite}@keyframes plD{to{stroke-dashoffset:-22}}#pyramid-container .pm{position:relative;z-index:1}',
      '.pm[data-rel=a]{box-shadow:0 0 0 2px #34d399,0 0 12px #34d399!important}.pm[data-rel=r]{box-shadow:0 0 0 2px #f87171,0 0 12px #ef4444!important}.pm[data-rel=n]{box-shadow:0 0 0 1px #94a3b8!important}html.fx-full .pm[data-rel=r]{animation:rkP 1.4s ease-in-out infinite}@keyframes rkP{50%{box-shadow:0 0 0 3px #f87171,0 0 22px #ef4444}}.rel-tag{position:absolute;top:-6px;right:-4px;font-size:13px}',
      '.holo-build .hl{animation:hlB .9s cubic-bezier(.2,1.4,.4,1) both}.holo-build .holo-av{animation:hlA .8s cubic-bezier(.2,1.8,.4,1) both}@keyframes hlB{from{opacity:0;translate:0 50px;scale:1 .1}}@keyframes hlA{from{opacity:0;translate:0 -50px}}.rel-cyc{margin-left:auto;flex:none;width:28px;height:28px;border-radius:50%;border:1px dashed #64748b;background:#0f172a;color:#94a3b8;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center}.rel-cyc[data-r]:not([data-r=""]){border-style:solid;border-color:#cbd5e1}',
      '.pm-new{animation:pmN .8s cubic-bezier(.2,1.8,.4,1)}@keyframes pmN{0%{transform:scale(0) rotate(-20deg);opacity:0}100%{transform:none;opacity:1}}.pm-ripple{position:absolute;left:50%;top:50%;width:20px;height:20px;margin:-10px;border:2px solid #fbbf24;border-radius:50%;animation:pmR 1s ease-out forwards;pointer-events:none}@keyframes pmR{to{transform:scale(8);opacity:0}}',
      '.row-pop{animation:rwP .8s cubic-bezier(.2,1.8,.4,1);background:rgba(251,191,36,.2)}@keyframes rwP{0%{transform:scale(.8) translateY(-14px);opacity:0}100%{transform:none;opacity:1}}',
      'html:not(.fx-off) .pyr-build .pm-tier{animation:pbT 1s cubic-bezier(.2,1.2,.4,1) both}.pyr-build .pm-tier[data-tier="4"]{animation-delay:0s}.pyr-build .pm-tier[data-tier="3"]{animation-delay:.5s}.pyr-build .pm-tier[data-tier="2"]{animation-delay:1s}.pyr-build .pm-tier[data-tier="1"]{animation-delay:1.5s}@keyframes pbT{from{opacity:0;transform:translateY(60px) scale(.9)}}html:not(.fx-off) .pyr-build .pm{animation:pbM .5s both;animation-delay:2.3s}@keyframes pbM{from{opacity:0;transform:scale(.6)}}html:not(.fx-off) .pyr-build .pl-svg{opacity:0}',
      'html.fx-full .pic-in{animation:picI .5s both;transform-box:fill-box;transform-origin:center}@keyframes picI{from{opacity:0;transform:scale(.6) translateY(16px)}}',
      '.sq-mini{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:6px 0 10px}.sq-b{display:flex;flex-direction:column;align-items:center;padding:6px 2px;border-radius:12px;background:#1e293b;border:1px solid #334155;font-size:18px;transition:all .5s}.sq-b small{font-size:8px;color:#94a3b8;font-weight:700}.sq-off{opacity:.25;filter:grayscale(1);text-decoration:line-through}.sq-on{border-color:var(--c);box-shadow:0 0 12px var(--c)}',
      'html.fx-full .deal-in{animation:dlI .6s cubic-bezier(.2,1.2,.4,1)!important}@keyframes dlI{from{opacity:0;transform:translateX(90px) rotate(7deg)}}',
      '.sr-ov{position:fixed;inset:0;z-index:95;background:rgba(2,6,23,.9);display:flex;align-items:center;justify-content:center;flex-direction:column;animation:lvIn .3s}.sr-out{opacity:0;transition:opacity .4s}.sr-deck{position:relative;width:96px;height:130px}.sr-c{position:absolute;inset:0;border-radius:14px;background:#1e293b;border:3px solid var(--c);display:flex;align-items:center;justify-content:center;font-size:44px;animation:srS 1.2s ease-in-out both;animation-delay:calc(var(--i)*.05s)}@keyframes srS{0%{transform:translateX(0) rotate(0)}30%{transform:translateX(calc((var(--i) - 1.5)*70px)) rotate(calc((var(--i) - 1.5)*12deg))}60%{transform:translateX(calc((var(--i) - 1.5)*-50px)) rotate(calc((var(--i) - 1.5)*-18deg))}100%{transform:translateX(0) rotate(0);opacity:0}}',
      '.sr-win{position:absolute;display:flex;flex-direction:column;align-items:center;color:#fff;opacity:0;animation:srW .8s 1.1s cubic-bezier(.2,1.6,.4,1) forwards;text-align:center}@keyframes srW{from{opacity:0;transform:scale(.2) rotate(-90deg)}to{opacity:1;transform:none}}.sr-big{font-size:84px;filter:drop-shadow(0 0 22px var(--c))}.sr-win b{font-size:20px;color:var(--c)}.sr-win small{color:#94a3b8}',
      '[data-sw=r]{background-color:rgba(16,185,129,.2)!important}[data-sw=l]{background-color:rgba(239,68,68,.15)!important}.sw-skip{opacity:.4}.sw-skip::after{content:"skipped";position:absolute;right:10px;top:6px;font-size:10px;color:#94a3b8}.sw-did{animation:swD .8s}@keyframes swD{0%,100%{box-shadow:none}40%{box-shadow:0 0 0 3px #34d399,0 0 20px #34d399}}.cnt-b{animation:cB .6s cubic-bezier(.2,1.8,.4,1)}@keyframes cB{0%{transform:scale(1)}40%{transform:scale(1.6)}100%{transform:scale(1)}}',
      '.ex-scene{margin-bottom:10px;padding:10px;border-radius:14px;background:#0f172a;border:1px solid #334155}.ex-row{display:flex;align-items:center;gap:8px}.ex-r2{margin-top:6px}.ex-f{font-size:28px}.ex-bub{font-size:11px;padding:6px 10px;border-radius:12px;color:#e2e8f0}.ex-b1{background:#475569}.ex-b2{background:#065f46}html:not(.fx-off) .ex-bad{animation:exS .5s 2}@keyframes exS{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}html:not(.fx-off) .ex-b1{animation:swI .4s both}html:not(.fx-off) .ex-r2{animation:swI .5s .9s both}html:not(.fx-off) .ex-good{animation:v12P .6s 1s both cubic-bezier(.2,1.8,.4,1)}',
      '.wk-row{position:relative;display:flex;gap:5px}.wk-t{flex:1;text-align:center;padding:5px 0;border-radius:10px;background:#1e293b;border:1px solid #334155}.wk-t span{display:block;font-size:15px}.wk-t small{font-size:9px;color:#94a3b8}.wk-on{background:rgba(16,185,129,.18);border-color:#10b981}.wk-fut{opacity:.5}.wk-today{border-color:#fbbf24}html.fx-full .wk-t{animation:v12P .5s both}html.fx-full .wk-today{animation:wkT 1.6s infinite}@keyframes wkT{50%{box-shadow:0 0 10px #fbbf24}}.wk-perfect .wk-t{border-color:#fbbf24;background:rgba(245,158,11,.2)}.wk-flame{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:30px;pointer-events:none;animation:wkF 2.4s ease-out forwards}@keyframes wkF{0%{opacity:0;transform:scale(.4)}20%{opacity:1}100%{opacity:0;transform:translateY(-20px) scale(1.3)}}',
      '.mt-snap{animation:v12P .6s cubic-bezier(.2,1.8,.4,1)}',
      '@keyframes adT{0%,100%{transform:none}50%{transform:translateY(-3px)}}html:not(.fx-off) .adv-think{animation:adK 1.2s infinite}@keyframes adK{0%,90%,100%{transform:scaleY(1)}95%{transform:scaleY(.1)}}html:not(.fx-off) .adv-tilt{transform:rotate(-14deg)}html:not(.fx-off) .adv-talk{animation:adT .22s infinite}html:not(.fx-off) .adv-nod{animation:adN .7s}@keyframes adN{25%{transform:translateY(4px)}60%{transform:translateY(-2px)}}',
      '.chip-wait{opacity:0;pointer-events:none}.chip-in{animation:chI .45s cubic-bezier(.2,1.6,.4,1) both}@keyframes chI{from{opacity:0;transform:translateX(26px) scale(.8)}}html.fx-off .chip-in{animation:none}',
      '.wall{display:flex;flex-direction:column;gap:3px;padding:8px;border-radius:14px;background:#0f172a;border:1px solid #334155;max-height:200px;overflow:hidden}.wall-r{display:flex;gap:3px}.wall-o{padding-left:14px}.brick{flex:1;height:16px;border-radius:3px;background:linear-gradient(#b45309,#92400e);border:0;padding:0}.brick-g{background:linear-gradient(#fcd34d,#f59e0b);box-shadow:0 0 6px rgba(251,191,36,.5)}.brick-e{background:transparent;border:1px dashed #334155}html.fx-full .brick{animation:brI .4s both}@keyframes brI{from{opacity:0;transform:translateY(-8px) scale(.8)}}html.fx-full .brick-drop{animation:brD .9s cubic-bezier(.3,1.6,.5,1) both!important}@keyframes brD{0%{opacity:0;transform:translateY(-80px) rotate(12deg)}60%{opacity:1;transform:translateY(0)}80%{transform:translateY(-4px)}100%{transform:none}}',
      '.win-glow{animation:wnG .7s}@keyframes wnG{40%{box-shadow:0 0 0 2px #fbbf24,0 0 14px #fbbf24}}.pt-writing{border-color:#34d399!important;box-shadow:0 0 10px rgba(52,211,153,.4)}.pt-stamp{position:absolute;right:10px;bottom:20px;pointer-events:none}.pt-stamp span{display:inline-block;border:3px solid #34d399;color:#34d399;font-weight:900;font-size:13px;letter-spacing:.1em;padding:2px 8px;border-radius:6px;background:rgba(2,6,23,.85);animation:qsS 2.1s ease-out forwards}',
      '.pic-ov{position:fixed;inset:0;z-index:94;background:rgba(2,6,23,.88);display:none;align-items:center;justify-content:center;padding:14px}.pic-card{width:100%;max-width:380px;max-height:92vh;overflow:auto;background:#1e293b;border:1px solid #f59e0b;border-radius:20px;padding:14px}#pic-ov #pyr-svg svg{width:100%;height:auto;max-height:60vh}',
      '@media (prefers-reduced-motion:reduce){.pl-p,.brick,.chip-in{animation:none!important}}'
    ].join('\n'); document.head.appendChild(s);
  }

  function init() {
    css(); buildPromoBar(); updatePromo(true); welcomeBuild(); chatWatch();
    if (mt) { if (mtLeft() <= 0) { mt = null; lsSet('pw_mtrun', null); } else if (!mt.paused) mtLoop(); }
    setTimeout(function () { if (P._dcWatch) P._dcWatch(); dailyDress(); }, 700);
    setInterval(function () { if (!document.hidden) { updatePromo(); } }, 5000);
    var ob = $('adviser-sheet'); if (ob) new MutationObserver(function () { chatWatch(); }).observe(ob, { attributes: true, attributeFilter: ['class'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
