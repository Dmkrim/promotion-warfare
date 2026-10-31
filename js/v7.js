/* Promotion Warfare V07: me-row in the table, company banner, challenge menu, raise pitch, weekly mission + reminder,
   backup/restore + persistent storage, business abbreviations, new badges. */
(function () {
  'use strict';
  var D7 = window.PW7 || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function profile() { return window.PWAvatars ? PWAvatars.load() : {}; }
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function burst(el, big, text) { if (!window.pwBurst || !el || !el.getBoundingClientRect) return; var r = el.getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, r.top + r.height / 2, !!big, text); }
  function checkBadges() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function isoDay(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function download(name, text, mime) {
    var blob = new Blob([text], { type: mime || 'text/plain' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); if (a.parentNode) a.parentNode.removeChild(a); }, 1500);
  }
  function shareOrDownload(name, text, mime, title) {
    try {
      var f = new File([text], name, { type: mime });
      if (navigator.canShare && navigator.canShare({ files: [f] })) { navigator.share({ files: [f], title: title || name }).catch(function () { }); return; }
    } catch (e) { }
    download(name, text, mime);
  }

  /* =============================================================== me-row in the Power Rank Table (item 4) */
  var RANK_FOR = { leader: 1, challenger: 2, flanker: 3, guerrilla: 4 };
  var busyMe = false;
  function ensureMe() {
    if (busyMe) return; busyMe = true;
    try {
      var p = profile(); if (!p.name || !p.position || !window.pwActiveCP || typeof mapData === 'undefined') return;
      var c = window.pwActiveCP(); if (!c || (c.me && !c.auto)) return;      /* example companies keep their own person */
      var name = p.name.trim(), rank = String(RANK_FOR[p.position] || 4), idx = -1, i, low = name.toLowerCase(), prev = (c.me || '').toLowerCase();
      for (i = 0; i < mapData.length; i++) { var n = String(mapData[i].name || '').trim().toLowerCase(); if (n && (n === low || (prev && n === prev))) { idx = i; break; } }
      if (idx >= 0) {
        var row = mapData[idx], auto = row.position === 'Me (you)' || c.auto;
        if (row.name !== name && (String(row.name).toLowerCase() === prev || String(row.name).toLowerCase() === low)) row.name = name;
        if (auto && row.position === 'Me (you)') row.rank = rank;
      } else {
        if (c.auto && c.meKey === name + '|' + p.position) return;     /* the user removed the row on purpose: do not add it again */
        var blank = -1; for (i = 0; i < mapData.length; i++) { if (!String(mapData[i].name || '').trim() && String(mapData[i].rank) === rank) { blank = i; break; } }
        var me = { name: name, position: 'Me (you)', rank: rank };
        if (blank >= 0) mapData[blank] = me;
        else { var at = mapData.length; for (i = 0; i < mapData.length; i++) { if (parseInt(mapData[i].rank, 10) > parseInt(rank, 10)) { at = i; break; } } mapData.splice(at, 0, me); }
      }
      c.me = name; c.auto = true; c.meKey = name + '|' + p.position;
      try { localStorage.setItem('pw_me_name', JSON.stringify(name)); } catch (e) { }
      window.pwSaveMap();
      if (window.renderMapTable) window.renderMapTable();
      updateBanners();
    } finally { busyMe = false; }
  }
  if (window.PWAvatars) {
    var _psave = PWAvatars.save;
    PWAvatars.save = function (p) { _psave(p); try { setTimeout(ensureMe, 0); } catch (e) { } };
  }

  /* =============================================================== company banner (item 5) */
  function companyName() { var l = lsGet('pw_cp', null); if (!l || !l.list) return 'My company'; for (var i = 0; i < l.list.length; i++) if (l.list[i].id === l.active) return l.list[i].name; return l.list[0].name; }
  function updateBanners() {
    ['step-map-builder', 'step-map-pyramid', 'step-action-plan'].forEach(function (id) {
      var sec = $(id); if (!sec) return;
      var b = sec.querySelector('.co-banner');
      if (!b) { b = document.createElement('div'); b.className = 'co-banner'; b.setAttribute('role', 'status'); sec.insertBefore(b, sec.firstChild); }
      b.innerHTML = '<span class="co-ic">🏢</span><span class="co-t"><small>Company</small><b>' + esc(companyName()) + '</b></span>';
    });
  }
  ['cpSwitch', 'cpNew', 'cpRename', 'cpDelete', 'cpLoadPersona'].forEach(function (fn) {
    var o = window[fn]; if (!o) return;
    window[fn] = function () { var r = o.apply(this, arguments); setTimeout(function () { if (fn === 'cpNew' || fn === 'cpSwitch') ensureMe(); updateBanners(); }, 30); return r; };
  });
  var _pickPos = window.pickPosition; if (_pickPos) window.pickPosition = function () { var r = _pickPos.apply(this, arguments); setTimeout(ensureMe, 50); return r; };

  /* =============================================================== challenge menu in the Action Plan (item 11) */
  function chRender() {
    var box = $('ch-box'); if (!box) return;
    var sel = $('ch-select'), groups = {}, order = [];
    D7.CHALLENGES.forEach(function (c) { if (!groups[c[2]]) { groups[c[2]] = []; order.push(c[2]); } groups[c[2]].push(c); });
    if (sel && !sel.options.length) {
      sel.innerHTML = '<option value="">Choose a challenge… (' + D7.CHALLENGES.length + ' options)</option>' + order.map(function (g) {
        return '<optgroup label="' + esc(g) + '">' + groups[g].map(function (c) { return '<option value="' + c[0] + '">' + esc(c[1]) + '</option>'; }).join('') + '</optgroup>';
      }).join('');
    }
    var id = sel ? sel.value : '', out = $('ch-moves'); if (!out) return;
    var c = D7.CHALLENGES.filter(function (x) { return x[0] === id; })[0];
    if (!c) { out.innerHTML = '<p class="text-[11px] text-slate-500">Pick a situation. You get 3 moves that you can add to your plan.</p>'; return; }
    var have = (typeof myMoves !== 'undefined') ? myMoves : [], allIn = true;
    out.innerHTML = c[3].map(function (m, i) {
      var mid = 'ch-' + c[0] + '-' + i, added = have.some(function (x) { return x.id === mid; }); if (!added) allIn = false;
      return '<div class="flex items-start gap-2 p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60"><p class="flex-1 text-xs text-slate-200 leading-snug selectable">' + esc(m) + '</p>' +
        '<button onclick="chAdd(\'' + c[0] + '\',' + i + ')" ' + (added ? 'disabled' : '') + ' class="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold ' + (added ? 'bg-emerald-700 text-white' : 'bg-amber-500 text-slate-950 active:scale-95') + '">' + (added ? '✓ Added' : '➕ Add') + '</button></div>';
    }).join('') + '<button onclick="chAddAll(\'' + c[0] + '\')" ' + (allIn ? 'disabled' : '') + ' class="w-full py-2 rounded-xl text-[11px] font-bold ' + (allIn ? 'bg-slate-700 text-slate-400' : 'bg-red-600 hover:bg-red-500 text-white active:scale-95') + '">' + (allIn ? 'All 3 moves are in your plan' : '➕ Add all 3 moves to my plan') + '</button>';
  }
  window.chPick = function () { chRender(); };
  window.chAdd = function (id, i) {
    var c = D7.CHALLENGES.filter(function (x) { return x[0] === id; })[0]; if (!c) return;
    window.addMove('ch-' + id + '-' + i, c[3][i]); chRender();
  };
  window.chAddAll = function (id) {
    var c = D7.CHALLENGES.filter(function (x) { return x[0] === id; })[0]; if (!c) return;
    var added = 0; c[3].forEach(function (m, i) { var mid = 'ch-' + id + '-' + i; if (!myMoves.some(function (x) { return x.id === mid; })) { myMoves.push({ id: mid, text: m, done: false }); added++; } });
    if (added) { saveMoves(); renderMoves(); if (window.markDoIt) markDoIt(); toast(added + ' moves added to your plan ✓'); }
    chRender();
  };
  var _renderMoves = window.renderMoves;
  window.renderMoves = function () { if (_renderMoves) _renderMoves.apply(this, arguments); try { chRender(); } catch (e) { } };

  /* =============================================================== raise pitch from the Wins Journal (item 10) */
  var PURPOSE = {
    raise: { t: 'Ask for a raise', ask: 'a salary review', open: 'Thank you for meeting with me. I would like to talk about my results and about {ask}.', ask2: 'Based on these results, I would like to ask for {ask}. I enjoy my work here and I want to keep growing with the team.', close: 'What would you need to see from me to make this happen?' },
    promo: { t: 'Ask for a promotion', ask: 'the next level', open: 'Thank you for meeting with me. I would like to talk about my results and about my next step: {ask}.', ask2: 'I believe these results show that I am ready for {ask}. I am willing to take more responsibility.', close: 'What is the best way to move toward this, and by when could we review it again?' },
    review: { t: 'Prepare my review', ask: 'my goals for the next 3 months', open: 'Thank you for this review. Before we start, I would like to share my main results.', ask2: 'For the next period I would like to focus on {ask}.', close: 'What should I focus on to grow into the next level?' },
    update: { t: 'Short update for my boss', ask: 'the next steps', open: 'Here is a short update on my results.', ask2: 'If it helps, I can continue with {ask}.', close: 'Please tell me if you would like me to focus on something else.' }
  };
  function cleanWin(t) { t = String(t || '').replace(/\s+/g, ' ').trim().replace(/[.;,\s]+$/, ''); return t.charAt(0).toUpperCase() + t.slice(1); }
  function hasNum(t) { return /\d|%|\$|€|£|₪/.test(t); }
  function winDate(w) { var d = w.iso ? new Date(w.iso) : new Date(w.d); return isNaN(d.getTime()) ? null : d; }
  function pickWins(wins, months, n) {
    var now = Date.now(), list = wins.map(function (w, i) { return { w: w, i: i, d: winDate(w) }; });
    if (months > 0) list = list.filter(function (x) { return !x.d || (now - x.d.getTime()) <= months * 31 * 864e5; });
    list.forEach(function (x) {
      var t = x.w.t || '', s = 0;
      if (hasNum(t)) s += 3;
      if (/\b(cut|reduc|sav|increas|improv|built|launch|fix|train|deliver|won|led|created|finish|complet|automat|cleaned|solved|grew|sold|learn|organiz)/i.test(t)) s += 1.2;
      if (t.length >= 20 && t.length <= 140) s += 1;
      s += x.i / Math.max(1, wins.length);    /* newer wins get a small bonus */
      x.s = s;
    });
    var top = list.slice().sort(function (a, b) { return b.s - a.s; }).slice(0, n);
    return top.sort(function (a, b) { return a.i - b.i; }).map(function (x) { return cleanWin(x.w.t); });
  }
  function periodText(m) { return m === 0 ? 'since I started using my Wins Journal' : ({ 3: 'in the last 3 months', 6: 'in the last 6 months', 12: 'in the last year' })[m]; }
  function buildPitch(o) {
    var P = PURPOSE[o.purpose], wins = lsGet('pw_wins_log', []), picks = pickWins(wins, o.months, o.count), p = profile();
    var ask = (o.ask || '').trim() || P.ask, who = (p.name || '').trim(), role = (o.role || '').trim();
    var bullets = picks.map(function (t) { return '• ' + t; }).join('\n');
    var written = 'Hello' + (o.boss ? ' ' + o.boss.trim() : '') + ',\n\n' + P.open.replace('{ask}', ask) + '\n\n' +
      (picks.length ? 'My main results ' + periodText(o.months) + ':\n' + bullets + '\n\n' : 'I would like to add my results here before we meet.\n\n') +
      (wins.length > picks.length ? 'In total I have logged ' + wins.length + ' wins. I am happy to show the full list.\n\n' : '') +
      P.ask2.replace('{ask}', ask) + '\n' + P.close + '\n\nThank you for your time.\n' + (who ? who : '') + (who && role ? ', ' + role : (role || ''));
    var words = ['first', 'second', 'third', 'fourth', 'fifth'], say = picks.length
      ? 'Here is what I would say out loud: "Thank you for your time. ' + periodText(o.months).replace(/^./, function (c) { return c.toUpperCase(); }) + ', my top results are: ' + picks.map(function (t, i) { return words[i] + ', ' + t.charAt(0).toLowerCase() + t.slice(1); }).join('; ') + '. ' + P.ask2.replace('{ask}', ask) + ' ' + P.close + '"'
      : '';
    return { written: written.trim(), say: say, picks: picks, nums: wins.filter(function (w) { return hasNum(w.t || ''); }).length, total: wins.length };
  }
  function pitchOpts() {
    return { purpose: $('pt-purpose').value, months: parseInt($('pt-months').value, 10) || 0, count: parseInt($('pt-count').value, 10) || 3, ask: $('pt-ask').value, role: $('pt-role').value, boss: $('pt-boss').value };
  }
  window.ptOpen = function () { var p = $('pt-panel'); if (p) { p.classList.toggle('hidden'); if (!p.classList.contains('hidden')) ptMake(true); } };
  window.ptMake = ptMake;
  function ptMake(quiet) {
    var wins = lsGet('pw_wins_log', []), out = $('pt-out'), note = $('pt-note'); if (!out) return;
    if (!wins.length) { out.value = ''; if (note) note.innerHTML = '<span class="text-amber-300">You have no wins yet. Add 3 to 5 wins above, with numbers if you can, then come back.</span>'; return; }
    var r = buildPitch(pitchOpts()); out.value = r.written + (r.say ? '\n\n— — —\n' + r.say : '');
    if (note) note.innerHTML = r.nums >= Math.min(3, r.total) ? '<span class="text-emerald-300">✓ ' + r.nums + ' of your ' + r.total + ' wins have numbers. That makes the pitch strong.</span>' : '<span class="text-amber-300">Tip: only ' + r.nums + ' of your ' + r.total + ' wins have a number. Numbers make a pitch much stronger. Edit your wins and add them (time saved, % better, how many).</span>';
    if (!quiet) { flag('pitch', 1); checkBadges(); toast('Pitch ready ✓'); burst($('pt-out'), false); }
  }
  window.ptCopy = function () {
    var t = ($('pt-out') || {}).value || ''; if (!t) { toast('Make the pitch first'); return; }
    flag('pitch', 1); checkBadges();
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast('Pitch copied ✓'); }, function () { $('pt-out').select(); toast('Select the text and copy it'); });
    else { $('pt-out').select(); try { document.execCommand('copy'); toast('Pitch copied ✓'); } catch (e) { toast('Select the text and copy it'); } }
  };
  window.ptShare = function () {
    var t = ($('pt-out') || {}).value || ''; if (!t) { toast('Make the pitch first'); return; }
    flag('pitch', 1); checkBadges();
    if (navigator.share) navigator.share({ title: 'My results', text: t }).catch(function () { }); else window.ptCopy();
  };
  window.ptPrint = function () {
    var t = ($('pt-out') || {}).value || ''; if (!t) { toast('Make the pitch first'); return; }
    var a = $('print-area'); if (!a) return; flag('pitch', 1); checkBadges();
    a.innerHTML = '<h1>My results and my request</h1><p class="pr-sub">' + esc(companyName()) + ' · ' + new Date().toLocaleDateString() + '</p><div style="white-space:pre-wrap;line-height:1.5">' + esc(t) + '</div><p class="pr-foot">Made with Promotion Warfare</p>';
    document.body.classList.add('printing');
    var done = function () { document.body.classList.remove('printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { try { window.print(); } catch (e) { toast('Printing is not available here'); } setTimeout(done, 1500); }, 80);
  };
  window.ptSetReview = function () {
    var v = ($('pt-date') || {}).value; var w = lsGet('pw_week', {}); w.review = v || ''; lsSet('pw_week', w); toast(v ? 'Review date saved ✓' : 'Review date cleared'); renderWeekly();
  };
  function buildPitchBox() {
    var box = $('pitch-box'); if (!box || box.dataset.ready) return; box.dataset.ready = 1;
    var w = lsGet('pw_week', {});
    var sel = 'w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-700 focus:border-emerald-400 outline-none', inp = 'w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-emerald-400 outline-none';
    box.innerHTML =
      '<button onclick="ptOpen()" class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-extrabold text-sm shadow-lg active:scale-98 flex items-center justify-center gap-2">🎤 Make my raise pitch</button>' +
      '<p class="text-[10px] text-slate-500 mt-1 text-center">Turns your wins into a short text for a review, a raise or a promotion talk.</p>' +
      '<div id="pt-panel" class="hidden mt-3 p-3 rounded-2xl bg-slate-900/70 border border-emerald-500/30 space-y-2.5" data-noswipe>' +
      '<label class="block text-[11px] font-bold text-slate-300">What is it for?<select id="pt-purpose" onchange="ptMake(true)" class="' + sel + ' mt-1">' + Object.keys(PURPOSE).map(function (k) { return '<option value="' + k + '">' + PURPOSE[k].t + '</option>'; }).join('') + '</select></label>' +
      '<div class="grid grid-cols-2 gap-2"><label class="block text-[11px] font-bold text-slate-300">Which wins?<select id="pt-months" onchange="ptMake(true)" class="' + sel + ' mt-1"><option value="6">Last 6 months</option><option value="3">Last 3 months</option><option value="12">Last year</option><option value="0">All my wins</option></select></label>' +
      '<label class="block text-[11px] font-bold text-slate-300">How many?<select id="pt-count" onchange="ptMake(true)" class="' + sel + ' mt-1"><option value="3">Top 3</option><option value="4">Top 4</option><option value="5">Top 5</option></select></label></div>' +
      '<label class="block text-[11px] font-bold text-slate-300">What I am asking for (optional)<input id="pt-ask" oninput="ptMake(true)" maxlength="80" placeholder="Example: a 10% raise, or the Team Lead role" class="' + inp + ' mt-1"></label>' +
      '<div class="grid grid-cols-2 gap-2"><label class="block text-[11px] font-bold text-slate-300">My job title (optional)<input id="pt-role" oninput="ptMake(true)" maxlength="40" placeholder="Example: Support Agent" class="' + inp + ' mt-1"></label>' +
      '<label class="block text-[11px] font-bold text-slate-300">Boss name (optional)<input id="pt-boss" oninput="ptMake(true)" maxlength="30" placeholder="Example: Dana" class="' + inp + ' mt-1"></label></div>' +
      '<p id="pt-note" class="text-[11px] leading-snug" aria-live="polite"></p>' +
      '<label class="block text-[11px] font-bold text-slate-300" for="pt-out">Your pitch (you can edit it)</label><textarea id="pt-out" rows="12" class="w-full bg-slate-950/80 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 leading-relaxed focus:border-emerald-400 outline-none selectable"></textarea>' +
      '<div class="grid grid-cols-3 gap-2"><button onclick="ptMake()" class="py-2 rounded-xl bg-emerald-600 text-white text-[11px] font-bold active:scale-95">🔄 Make again</button><button onclick="ptCopy()" class="py-2 rounded-xl bg-amber-500 text-slate-950 text-[11px] font-bold active:scale-95">📋 Copy</button><button onclick="ptShare()" class="py-2 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">📤 Share</button></div>' +
      '<button onclick="ptPrint()" class="w-full py-2 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">🖨️ Print / Save as PDF</button>' +
      '<div class="p-2.5 rounded-xl bg-slate-950/60 border border-slate-700/60"><p class="text-[11px] font-bold text-amber-300 mb-1">🗓️ My review or raise talk date (optional)</p><div class="flex gap-2"><input id="pt-date" type="date" value="' + esc(w.review || '') + '" class="flex-1 min-w-0 bg-slate-950 text-slate-100 text-xs rounded-xl p-2 border border-slate-700 outline-none"><button onclick="ptSetReview()" class="px-3 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">Save</button></div><p class="text-[10px] text-slate-500 mt-1">The Welcome page will count the days and remind you to update your wins.</p></div>' +
      '<p class="text-[10px] text-slate-500 leading-snug">The text is built from your own wins with simple templates. It is not live AI. Read it, edit it and make it sound like you before you use it.</p></div>';
  }

  /* =============================================================== weekly mission, streak, reminder (items 13, 15) */
  function monday(d) { d = new Date(d || Date.now()); d.setHours(12, 0, 0, 0); var k = (d.getDay() + 6) % 7; d.setDate(d.getDate() - k); return d; }
  function weeksBetween(a, b) { return Math.round((b.getTime() - a.getTime()) / (7 * 864e5)); }
  function weekState() {
    var w = lsGet('pw_week', {}); w.done = w.done || []; var thisM = monday(), key = isoDay(thisM);
    var doneNow = w.done.some(function (x) { return x.wk === key; });
    var set = {}; w.done.forEach(function (x) { set[x.wk] = 1; });
    var streak = 0, d = new Date(thisM); if (!doneNow) d.setDate(d.getDate() - 7);
    while (set[isoDay(d)]) { streak++; d.setDate(d.getDate() - 7); }
    var best = 0, run = 0, keys = Object.keys(set).sort(), prev = null;
    keys.forEach(function (k) { var dd = new Date(k + 'T12:00:00'); run = (prev && weeksBetween(prev, dd) === 1) ? run + 1 : 1; if (run > best) best = run; prev = dd; });
    return { w: w, key: key, doneNow: doneNow, streak: streak, best: best, total: w.done.length, idx: w.done.length % 12, round: Math.floor(w.done.length / 12) + 1 };
  }
  window.pwExtraBadges = function () {
    var st = weekState(), f = lsGet('pw_flags', {});
    return { pitch: !!f.pitch, backup: !!f.backup, week3: st.best >= 3, week12: st.total >= 12 };
  };
  window.wkDone = function () {
    var st = weekState(); if (st.doneNow) return;
    st.w.done.push({ wk: st.key, n: st.idx, d: isoDay() }); lsSet('pw_week', st.w);
    toast('Check-in saved ✓'); burst($('wk-done'), true, '+1 week'); checkBadges(); renderWeekly(); if (window.pwRefreshStrip) window.pwRefreshStrip();
  };
  window.wkAdd = function () { var st = weekState(), m = D7.MISSION[st.idx]; window.addMove('wk-' + st.idx + '-r' + st.round, m[0] + ': ' + m[1]); };
  window.wkWin = function () {
    var i = $('wk-win'), v = i ? i.value.trim().slice(0, 300) : ''; if (!v) { toast('Type your win first'); return; }
    var wins = lsGet('pw_wins_log', []); wins.push({ t: v, d: new Date().toLocaleDateString(), iso: new Date().toISOString() }); lsSet('pw_wins_log', wins);
    i.value = ''; toast('Win saved 🏅'); checkBadges(); renderWeekly();
  };
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], ICS_DAY = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  window.wkReminder = function () {
    var day = parseInt(($('wk-day') || {}).value, 10), tm = ($('wk-time') || {}).value || '18:00';
    var w = lsGet('pw_week', {}); w.rem = { day: day, time: tm }; lsSet('pw_week', w);
    var hh = parseInt(tm.slice(0, 2), 10) || 18, mm = parseInt(tm.slice(3, 5), 10) || 0, d = new Date(); d.setHours(hh, mm, 0, 0);
    var want = (day + 1) % 7; /* JS Sunday=0 ; our Monday=0 */
    var diff = (want - d.getDay() + 7) % 7; if (diff === 0 && d.getTime() < Date.now()) diff = 7; d.setDate(d.getDate() + diff);
    var p2 = function (n) { return ('0' + n).slice(-2); };
    var fmt = function (x) { return x.getFullYear() + p2(x.getMonth() + 1) + p2(x.getDate()) + 'T' + p2(x.getHours()) + p2(x.getMinutes()) + '00'; };
    var e = new Date(d.getTime() + 15 * 60000), st = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '');
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//HiProgress//Promotion Warfare//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT', 'UID:pw-weekly-' + Date.now() + '@promotion-warfare', 'DTSTAMP:' + st,
      'DTSTART:' + fmt(d), 'DTEND:' + fmt(e), 'RRULE:FREQ=WEEKLY;BYDAY=' + ICS_DAY[day], 'SUMMARY:Promotion Warfare: my weekly move', 'DESCRIPTION:Open the app. Do this week\'s move\\, tick the check-in and write one win.',
      'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Your weekly move is waiting', 'TRIGGER:PT0M', 'END:VALARM', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    shareOrDownload('promotion-warfare-weekly-reminder.ics', ics, 'text/calendar', 'Weekly reminder');
    toast('Open the file to add it to your calendar');
  };
  function daysUntil(iso) { var t = new Date(iso + 'T12:00:00'), n = new Date(); n.setHours(12, 0, 0, 0); return Math.round((t - n) / 864e5); }
  function renderWeekly() {
    var box = $('weekly-card'); if (!box || !D7.MISSION) return;
    var st = weekState(), m = D7.MISSION[st.idx], p = profile(), hint = (D7.POS_HINT || {})[p.position] || '', w = st.w, html = '';
    var last = w.lastVisit ? new Date(w.lastVisit) : null, away = last ? Math.floor((Date.now() - last.getTime()) / 864e5) : 0;
    if (away >= 7) html += '<p class="text-[11px] text-sky-300 mb-2">👋 Welcome back! You were away for ' + away + ' days. A small step today is enough.</p>';
    html += '<div class="flex items-center justify-between mb-1"><p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400">📅 This week\'s move · Mission ' + (st.idx + 1) + ' of 12' + (st.round > 1 ? ' · Round ' + st.round : '') + '</p>' +
      '<span class="text-[11px] font-bold ' + (st.streak ? 'text-amber-300' : 'text-slate-500') + '" title="Weeks in a row">🔥 ' + st.streak + '</span></div>';
    if (st.doneNow) {
      html += '<p class="text-xs text-emerald-300 font-bold">✅ Done this week. Great job!</p><p class="text-[11px] text-slate-400 mt-0.5">The next mission opens on Monday: <b class="text-slate-200">' + esc(D7.MISSION[(st.idx) % 12][0]) + '</b>.</p>';
    } else {
      html += '<p class="text-sm font-bold text-white leading-snug">' + esc(m[0]) + '</p><p class="text-xs text-slate-300 leading-relaxed mt-0.5">' + esc(m[1]) + '</p>' + (hint ? '<p class="text-[11px] text-slate-500 mt-1">' + esc(hint) + '</p>' : '') +
        '<div class="grid grid-cols-2 gap-2 mt-2"><button id="wk-done" onclick="wkDone()" class="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold active:scale-95">✅ I did it</button><button onclick="wkAdd()" class="py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold active:scale-95">➕ Add to my plan</button></div>';
    }
    html += '<div class="flex gap-2 mt-2"><input id="wk-win" type="text" maxlength="300" placeholder="Quick win: what went well this week?" class="flex-1 min-w-0 bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-[11px] text-slate-100 focus:border-emerald-400 outline-none"><button onclick="wkWin()" class="px-3 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">📓 Save</button></div>';
    if (w.review) { var dd = daysUntil(w.review); html += '<p class="text-[11px] mt-2 ' + (dd >= 0 && dd <= 14 ? 'text-amber-300' : 'text-slate-400') + '">🗓️ ' + (dd > 1 ? 'Your talk is in ' + dd + ' days.' : dd === 1 ? 'Your talk is tomorrow.' : dd === 0 ? 'Your talk is today. Good luck!' : 'Your talk date has passed. Set a new date in the Wins Journal.') + (dd >= 0 && dd <= 14 ? ' <a class="underline" href="#" onclick="goToStep(\'step-journal\',0);return false">Update your wins and pitch</a>' : '') + '</p>'; }
    var rem = w.rem || { day: 4, time: '18:00' };
    html += '<details class="mt-2 text-left"><summary class="cursor-pointer text-[11px] font-bold text-sky-300">🔔 Weekly reminder (optional)</summary><div class="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-700/60"><div class="grid grid-cols-2 gap-2"><label class="text-[10px] text-slate-400">Day<select id="wk-day" class="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700 outline-none">' + DAYS.map(function (d, i) { return '<option value="' + i + '"' + (i === rem.day ? ' selected' : '') + '>' + d + '</option>'; }).join('') + '</select></label><label class="text-[10px] text-slate-400">Time<input id="wk-time" type="time" value="' + esc(rem.time) + '" class="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700 outline-none"></label></div><button onclick="wkReminder()" class="w-full mt-2 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold active:scale-95">📅 Add weekly reminder to my calendar</button><p class="text-[10px] text-slate-500 mt-1 leading-snug">This makes a repeating event in your phone calendar. The app itself cannot send alerts when it is closed.</p></div></details>';
    box.innerHTML = html;
    w.lastVisit = new Date().toISOString(); lsSet('pw_week', Object.assign(lsGet('pw_week', {}), { lastVisit: w.lastVisit }));
  }

  /* =============================================================== backup + restore + persistent storage (item 14) */
  function collect() {
    var data = {}; try { for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^pw_/.test(k)) data[k] = localStorage.getItem(k); } } catch (e) { }
    return { app: 'promotion-warfare', format: 1, version: 'V07', exported: new Date().toISOString(), keys: Object.keys(data).length, data: data };
  }
  window.bkExport = function () {
    var b = collect(); if (!b.keys) { toast('Nothing to back up yet'); return; }
    flag('backup', 1); lsSet('pw_lastbackup', new Date().toISOString()); b = collect();
    shareOrDownload('promotion-warfare-backup-' + isoDay() + '.json', JSON.stringify(b), 'application/json', 'Promotion Warfare backup');
    toast('Backup file created ✓'); checkBadges(); renderBackup();
  };
  window.bkImportPick = function () { var f = $('bk-file'); if (f) f.click(); };
  window.bkImport = function (input) {
    var f = input.files && input.files[0]; if (!f) return;
    var r = new FileReader();
    r.onload = function () {
      var j; try { j = JSON.parse(r.result); } catch (e) { toast('This is not a valid backup file'); input.value = ''; return; }
      if (!j || j.app !== 'promotion-warfare' || !j.data || typeof j.data !== 'object') { toast('This is not a Promotion Warfare backup'); input.value = ''; return; }
      var keys = Object.keys(j.data).filter(function (k) { return /^pw_[a-z0-9_]+$/i.test(k) && typeof j.data[k] === 'string'; });
      if (!keys.length) { toast('The backup file is empty'); input.value = ''; return; }
      if (!confirm('Restore ' + keys.length + ' items from the backup of ' + String(j.exported || '').slice(0, 10) + '?\n\nThis REPLACES the data on this phone.')) { input.value = ''; return; }
      try {
        var old = []; for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (/^pw_/.test(k)) old.push(k); }
        old.forEach(function (k) { localStorage.removeItem(k); });
        keys.forEach(function (k) { localStorage.setItem(k, j.data[k]); });
      } catch (e) { toast('Could not restore (storage problem)'); return; }
      toast('Backup restored ✓ Reloading…'); setTimeout(function () { location.reload(); }, 900);
    };
    r.onerror = function () { toast('Could not read the file'); };
    r.readAsText(f);
  };
  function persistState(cb) {
    if (!navigator.storage || !navigator.storage.persisted) { cb('unsupported'); return; }
    navigator.storage.persisted().then(function (v) { cb(v ? 'on' : 'off'); }, function () { cb('unsupported'); });
  }
  window.bkPersist = function () {
    if (!navigator.storage || !navigator.storage.persist) { toast('Your browser cannot do this'); return; }
    navigator.storage.persist().then(function (ok) { toast(ok ? 'Storage protected ✓' : 'The browser did not allow it yet. Install the app and try again.'); renderBackup(); }, function () { toast('Could not ask the browser'); });
  };
  function renderBackup() {
    var box = $('backup-panel'); if (!box) return;
    var last = lsGet('pw_lastbackup', null), b = collect();
    persistState(function (s) {
      var ps = s === 'on' ? '<span class="text-emerald-300">ON: Android is less likely to clear your data.</span>' : s === 'off' ? '<span class="text-amber-300">OFF: the phone may clear data when it is short on space.</span>' : '<span class="text-slate-400">Not supported by this browser.</span>';
      box.innerHTML = '<p class="text-xs font-bold text-amber-400 mb-0.5">💾 Backup and restore</p>' +
        '<p class="text-[11px] text-slate-400 leading-snug mb-2">Your map, plan, journal, chat and settings live only on this phone. Save one backup file before you change phones or clear data. ' + b.keys + ' items stored now.</p>' +
        '<div class="grid grid-cols-2 gap-2"><button onclick="bkExport()" class="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-extrabold active:scale-95">⬇️ Export everything</button><button onclick="bkImportPick()" class="py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-100 text-[11px] font-bold active:scale-95">⬆️ Import backup</button></div>' +
        '<input id="bk-file" type="file" accept=".json,application/json" class="hidden" onchange="bkImport(this)">' +
        '<p class="text-[10px] text-slate-500 mt-1.5">' + (last ? 'Last backup: ' + new Date(last).toLocaleDateString() : 'No backup yet.') + ' Importing replaces the data on this phone.</p>' +
        '<div class="mt-2 p-2 rounded-xl bg-slate-950/60 border border-slate-700/60"><p class="text-[11px] text-slate-300">🛡️ Protected storage: ' + ps + '</p>' + (s === 'off' ? '<button onclick="bkPersist()" class="mt-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-amber-300 text-[10px] font-bold active:scale-95">Ask the phone to protect my data</button>' : '') + '</div>';
    });
  }
  function backupNudge() {
    var box = $('backup-nudge'); if (!box) return;
    var b = collect(), last = lsGet('pw_lastbackup', null), snooze = lsGet('pw_bk_snooze', null), first = lsGet('pw_firstuse', null);
    if (!first) { lsSet('pw_firstuse', new Date().toISOString()); first = new Date().toISOString(); }
    var age = (Date.now() - new Date(first).getTime()) / 864e5, since = last ? (Date.now() - new Date(last).getTime()) / 864e5 : age;
    var show = b.keys > 4 && ((!last && age >= 5) || (last && since >= 30)) && !(snooze && (Date.now() - new Date(snooze).getTime()) < 7 * 864e5);
    box.classList.toggle('hidden', !show);
    if (show) box.innerHTML = '<p class="text-xs font-bold text-sky-300">💾 Back up your work</p><p class="text-[11px] text-slate-300 mt-0.5 leading-snug">' + (last ? 'Your last backup is ' + Math.floor(since) + ' days old.' : 'You have not saved a backup yet.') + ' It takes 5 seconds.</p><div class="flex gap-2 mt-2"><button onclick="bkExport();backupNudge()" class="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-[11px] font-bold active:scale-95">Export now</button><button onclick="bkSnooze()" class="px-3 py-1.5 rounded-xl bg-slate-700 text-slate-200 text-[11px] font-bold active:scale-95">Later</button></div>';
  }
  window.backupNudge = backupNudge;
  window.bkSnooze = function () { lsSet('pw_bk_snooze', new Date().toISOString()); backupNudge(); };

  /* =============================================================== business abbreviations (item 9) */
  var ABBR = {}, ABBR_KEYS = [];
  (D7.ABBR || []).forEach(function (a) { ABBR[a[0].toLowerCase()] = a; ABBR_KEYS.push(a); });
  var STRONG = /\b(mean|means|stand|stands|abbreviation|acronym|short for|full form)\b/i;
  var ASK = /\b(tell me about|mean|means|meaning|stand|stands|abbreviation|abbreviations|acronym|short for|full form|full name|define|definition|what is|what's|what are|whats|explain)\b/i;
  function abbrFind(text) {
    var raw = String(text || ''), found = [], seen = {};
    var parts = raw.split(/[^A-Za-z0-9&]+/).filter(Boolean);
    parts.forEach(function (w) {
      var key = w.toLowerCase(), a = ABBR[key]; if (!a || seen[key]) return;
      var upper = w === w.toUpperCase() || /^[A-Z][a-z]?[A-Z]/.test(w) || /^(SaaS|IoT|YoY|MoM)$/i.test(w) && /[A-Z]/.test(w.slice(1));
      if (key === 'it' && !(upper && w === 'IT' && !/^[A-Z ?.!']+$/.test(raw))) return;       /* the word "it" is not the abbreviation IT */
      if (key === 'smart' && !upper) return;
      if (key.length <= 3 && !upper && !STRONG.test(raw)) return;                              /* "ai", "hr", "pr" need capitals or a clear question */
      if (!upper && !ASK.test(raw)) return;
      seen[key] = 1; found.push(a);
    });
    if (raw.indexOf('&') > -1) { ['p&l', 'r&d', 'm&a'].forEach(function (k) { if (raw.toLowerCase().replace(/\s+/g, '').indexOf(k) > -1 && !seen[k]) { seen[k] = 1; found.push(ABBR[k]); } }); }
    return found;
  }
  function abbrByName(text) {
    var low = String(text || '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' '), res = [];
    if (!ASK.test(text)) return res;
    ABBR_KEYS.forEach(function (a) { var n = a[1].toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim(); if (n.length > 9 && low.indexOf(n) > -1) res.push(a); });
    return res;
  }
  window.PWAbbr = {
    count: function () { return ABBR_KEYS.length; },
    find: abbrFind,
    reply: function (text) {
      var t = String(text || ''), words = t.trim().split(/\s+/).length;
      var f = abbrFind(t); if (!f.length) f = abbrByName(t);
      if (!f.length) return null;
      if (!ASK.test(t) && words > 3) return null;
      f = f.slice(0, 3);
      var out = f.map(function (a) { return '**' + a[0] + '** stands for **' + a[1] + '**.\n' + a[2]; }).join('\n\n');
      return { text: out, chips: [{ label: '📖 All abbreviations', go: 'step-glossary' }, { label: '❓ More app help', q: 'what can this app do' }], card: -1, abbr: true };
    }
  };
  function renderAbbrList() {
    var box = $('abbr-list'); if (!box) return;
    var q = (($('abbr-search') || {}).value || '').trim().toLowerCase();
    var l = ABBR_KEYS.filter(function (a) { return !q || (a[0] + ' ' + a[1] + ' ' + a[2]).toLowerCase().indexOf(q) >= 0; });
    box.innerHTML = l.length ? l.map(function (a) { return '<div class="py-1.5 border-b border-slate-700/50"><p class="text-xs text-slate-100"><b class="text-amber-400">' + esc(a[0]) + '</b> · ' + esc(a[1]) + '</p><p class="text-[11px] text-slate-400 leading-snug">' + esc(a[2]) + '</p></div>'; }).join('') : '<p class="text-[11px] text-slate-500">Nothing found. Try another word.</p>';
    var c = $('abbr-count'); if (c) c.textContent = l.length + ' of ' + ABBR_KEYS.length;
  }
  window.abbrSearch = renderAbbrList;

  /* =============================================================== page hooks + init */
  function onPage(id) {
    if (id === 'step-welcome') { renderWeekly(); backupNudge(); }
    if (id === 'step-journal') buildPitchBox();
    if (id === 'step-profile') renderBackup();
    if (id === 'step-glossary') renderAbbrList();
    if (id === 'step-action-plan') { chRender(); updateBanners(); }
    if (id === 'step-map-builder' || id === 'step-map-pyramid') updateBanners();
  }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); try { onPage(id); } catch (e) { console.error(e); } };
  var _nav = window.navTo;
  window.navTo = function (t) {
    if (t === '#backup') { window.closeAdviser && 0; var d = $('drawer-menu'); if (d) d.classList.add('hidden'); window.goToStep('step-profile', 0); setTimeout(function () { var b = $('backup-panel'); if (b && b.scrollIntoView) b.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150); return; }
    return _nav.apply(this, arguments);
  };
  function init() {
    try { chRender(); renderWeekly(); renderAbbrList(); backupNudge(); renderBackup(); updateBanners(); ensureMe(); } catch (e) { console.error(e); }
    if (navigator.storage && navigator.storage.persist) { try { navigator.storage.persisted().then(function (v) { if (!v) navigator.storage.persist().then(function () { renderBackup(); }, function () { }); }); } catch (e) { } }
    setTimeout(checkBadges, 900);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 120); }); else setTimeout(init, 120);
})();
