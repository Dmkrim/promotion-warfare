/* V06: companies + auto-save, sort/filter, examples, drag-and-drop pyramid, position grid, what-if, checklists,
   plan status/dates, print + CSV, glossary tooltips, cheat sheet, badges, install prompt, time estimates, accessibility. */
(function () {
  'use strict';
  var D = window.PW6 || {};
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function profile() { return window.PWAvatars ? PWAvatars.load() : {}; }
  function burst(el, big, text) {
    if (!window.pwBurst || !el || !el.getBoundingClientRect) return;
    var r = el.getBoundingClientRect(); window.pwBurst(r.left + r.width / 2, r.top + r.height / 2, !!big, text);
  }
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  var cur = 'step-welcome';

  /* =============================================================== companies (profiles) + auto-save */
  var CP = lsGet('pw_cp', null);
  function rowsToData(rows) { return rows.map(function (r) { return Array.isArray(r) ? { name: r[0], position: r[1], rank: String(r[2]) } : { name: r.name || '', position: r.position || '', rank: String(r.rank || '3') }; }); }
  function activeCP() { var i; for (i = 0; i < CP.list.length; i++) if (CP.list[i].id === CP.active) return CP.list[i]; return CP.list[0]; }
  function uid() { return 'c' + Date.now().toString(36) + Math.floor(Math.random() * 1000).toString(36); }
  function persist() { lsSet('pw_cp', CP); }
  function loadRows(rows) { mapData.length = 0; rowsToData(rows).forEach(function (r) { mapData.push(r); }); }
  function edited() { flag('edited', 1); }
  function saveMap() { if (!CP) return; var c = activeCP(); c.rows = mapData.map(function (r) { return { name: r.name, position: r.position, rank: String(r.rank) }; }); persist(); }
  function cpInit() {
    if (!CP || !CP.list || !CP.list.length) {
      CP = { active: 'c1', list: [{ id: 'c1', name: 'Current Job', rows: mapData.map(function (r) { return { name: r.name, position: r.position, rank: r.rank }; }) }] };
      persist();
    } else { loadRows(activeCP().rows || []); if (!mapData.length) loadRows([['', '', 1]]); }
  }
  function applyCompanyContext() {
    var c = activeCP(), p = profile();
    if (c.pos) { p.position = c.pos; PWAvatars.save(p); var sel = $('plan-position'); if (sel) { sel.value = c.pos; if (typeof generateActionPlan === 'function') generateActionPlan(); } }
    try { localStorage.setItem('pw_me_name', JSON.stringify(c.me || '')); } catch (e) { }
  }
  function renderCP() {
    var s = $('cp-select'); if (!s) return;
    s.innerHTML = CP.list.map(function (c) { return '<option value="' + esc(c.id) + '"' + (c.id === CP.active ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('');
    var ps = $('persona-select');
    if (ps && !ps.options.length) ps.innerHTML = '<option value="">Quick-load an example…</option>' + D.PERSONAS.map(function (p) { return '<option value="' + p.id + '">' + esc(p.name) + '</option>'; }).join('');
  }
  window.cpSwitch = function (id) {
    saveMap(); CP.active = id; persist(); loadRows(activeCP().rows || []); if (!mapData.length) loadRows([['', '', 1]]);
    renderMapTable(); renderCP(); applyCompanyContext(); renderLab(); toast('Switched to ' + activeCP().name);
  };
  window.cpNew = function () {
    var n = prompt('Name for the new company (for example "Dream Organization")', 'Dream Organization'); if (!n) return;
    saveMap(); var c = { id: uid(), name: n.trim().slice(0, 40) || 'New company', rows: [{ name: '', position: '', rank: '1' }, { name: '', position: '', rank: '2' }, { name: '', position: '', rank: '3' }, { name: '', position: '', rank: '4' }] };
    CP.list.push(c); CP.active = c.id; persist(); loadRows(c.rows); renderMapTable(); renderCP(); toast('New company created');
  };
  window.cpRename = function () {
    var c = activeCP(), n = prompt('New name', c.name); if (!n) return; c.name = n.trim().slice(0, 40) || c.name; persist(); renderCP();
  };
  window.cpDelete = function () {
    if (CP.list.length < 2) { toast('You need at least one company'); return; }
    var c = activeCP(); if (!confirm('Delete "' + c.name + '"?')) return;
    CP.list = CP.list.filter(function (x) { return x.id !== c.id; }); CP.active = CP.list[0].id; persist();
    loadRows(activeCP().rows || []); renderMapTable(); renderCP(); applyCompanyContext(); toast('Company deleted');
  };
  window.cpCompare = function () {
    var box = $('cp-compare'); if (!box) return;
    if (!box.classList.contains('hidden')) { box.classList.add('hidden'); return; }
    saveMap();
    var rows = CP.list.map(function (c) {
      var cnt = [0, 0, 0, 0], total = 0;
      (c.rows || []).forEach(function (r) { if (r.name && r.name.trim()) { var k = Math.max(1, Math.min(4, parseInt(r.rank, 10) || 4)); cnt[k - 1]++; total++; } });
      var top = total ? Math.round((cnt[0] + cnt[1]) / total * 100) : 0;
      return '<tr class="border-t border-slate-700/60"><td class="p-1.5 font-bold text-slate-100">' + esc(c.name) + (c.id === CP.active ? ' ★' : '') + '</td><td class="p-1.5 text-center">' + cnt[0] + '</td><td class="p-1.5 text-center">' + cnt[1] + '</td><td class="p-1.5 text-center">' + cnt[2] + '</td><td class="p-1.5 text-center">' + cnt[3] + '</td><td class="p-1.5 text-center text-amber-400 font-bold">' + top + '%</td><td class="p-1.5">' + (c.pos ? D.POS_ICON[c.pos] + ' ' + esc(D.POS_STRAT[c.pos]) : '–') + '</td></tr>';
    }).join('');
    box.innerHTML = '<div class="overflow-x-auto"><table class="w-full text-[11px] text-slate-300"><thead><tr class="text-slate-400"><th class="p-1.5 text-left">Company</th><th class="p-1.5">#1</th><th class="p-1.5">#2</th><th class="p-1.5">#3</th><th class="p-1.5">#4</th><th class="p-1.5" title="Share of people in the top 2 tiers">Top-heavy</th><th class="p-1.5 text-left">Strategy</th></tr></thead><tbody>' + rows + '</tbody></table></div><p class="text-[10px] text-slate-500 mt-1.5">Top-heavy = share of people in tier 1 and 2. A high number means a crowded top, so promotion is harder and visibility matters more.</p>';
    box.classList.remove('hidden');
  };
  window.cpLoadPersona = function () {
    var id = $('persona-select').value; if (!id) { toast('Choose an example first'); return; }
    var p = D.PERSONAS.filter(function (x) { return x.id === id; })[0]; if (!p) return;
    saveMap();
    var name = p.name, n = 2; while (CP.list.some(function (c) { return c.name === name; })) name = p.name + ' ' + (n++);
    var c = { id: uid(), name: name, rows: rowsToData(p.rows), me: p.me, pos: p.pos, vis: p.vis, inf: p.inf };
    edited(); CP.list.push(c); CP.active = c.id; persist(); loadRows(c.rows); renderMapTable(); renderCP(); applyCompanyContext(); renderLab();
    $('persona-select').value = ''; toast('Example loaded as a new company ✓');
    burst($('persona-select'), false);
  };

  /* hooks: save on every edit */
  var _render = window.renderMapTable;
  window.renderMapTable = function () { _render(); labelTable(); applyFilter(); };
  var _addRow = window.addMapRow; window.addMapRow = function () { _addRow(); edited(); saveMap(); try { var rows = $('map-table-body').querySelectorAll('tr'); var inp = rows[rows.length - 1].querySelector('input'); if (inp) inp.focus(); } catch (e) { } };
  var _remRow = window.removeLastMapRow; window.removeLastMapRow = function () { _remRow(); edited(); saveMap(); };
  function labelTable() {
    var rows = document.querySelectorAll('#map-table-body tr');
    rows.forEach(function (tr, i) {
      var f = tr.querySelectorAll('input,select');
      if (f[0]) f[0].setAttribute('aria-label', 'Name of person ' + (i + 1));
      if (f[1]) f[1].setAttribute('aria-label', 'Job title of person ' + (i + 1));
      if (f[2]) f[2].setAttribute('aria-label', 'Power rank of person ' + (i + 1) + ', 1 is the top boss, 4 is the base');
    });
  }
  /* =============================================================== sort + filter */
  window.sortMap = function (by) {
    var cmp = {
      rank: function (a, b) { return (parseInt(a.rank, 10) - parseInt(b.rank, 10)) || String(a.name).localeCompare(b.name); },
      name: function (a, b) { return String(a.name || '~').localeCompare(String(b.name || '~'), undefined, { sensitivity: 'base' }); },
      pos: function (a, b) { return String(a.position || '~').localeCompare(String(b.position || '~'), undefined, { sensitivity: 'base' }); }
    }[by]; if (!cmp) return;
    edited(); var copy = mapData.slice().sort(cmp); mapData.length = 0; copy.forEach(function (r) { mapData.push(r); });
    renderMapTable(); saveMap(); toast('Sorted by ' + ({ rank: 'power rank', name: 'name A–Z', pos: 'position A–Z' }[by]));
    ['rank', 'name', 'pos'].forEach(function (k) { var b = $('sort-' + k); if (b) b.setAttribute('aria-pressed', k === by ? 'true' : 'false'); });
  };
  function applyFilter() {
    var q = (($('map-filter') || {}).value || '').trim().toLowerCase(), shown = 0, rows = document.querySelectorAll('#map-table-body tr');
    rows.forEach(function (tr) {
      var t = '', f = tr.querySelectorAll('input'); f.forEach(function (i) { t += ' ' + i.value; });
      var ok = !q || t.toLowerCase().indexOf(q) >= 0; tr.style.display = ok ? '' : 'none'; if (ok) shown++;
    });
    var n = $('map-filter-note'); if (n) n.textContent = q ? (shown + ' of ' + rows.length + ' shown') : '';
  }
  window.mapFilter = applyFilter;

  /* =============================================================== pyramid: drag and drop + tap to move */
  var TIERS = [
    { r: 1, title: 'Tier 1: Executive Leaders', color: 'border-amber-500 bg-amber-500/10 text-amber-300', icon: '👑', badge: 'bg-amber-500/20 border-amber-500/40' },
    { r: 2, title: 'Tier 2: Senior & Mid Management', color: 'border-purple-500 bg-purple-500/10 text-purple-300', icon: '⭐', badge: 'bg-purple-500/20 border-purple-500/40' },
    { r: 3, title: 'Tier 3: Key Stakeholders & Ops', color: 'border-blue-500 bg-blue-500/10 text-blue-300', icon: '🛡️', badge: 'bg-blue-500/20 border-blue-500/40' },
    { r: 4, title: 'Tier 4: General Team / Base', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-300', icon: '👥', badge: 'bg-emerald-500/20 border-emerald-500/40' }
  ];
  var selIdx = -1;
  function renderPyramid() {
    var box = $('pyramid-container'); if (!box) return;
    var me = lsGet('pw_me_name', '');
    var html = '<p class="text-[11px] text-slate-400 mb-2 leading-snug" data-hint>✋ Drag a person by the <b>⠿</b> handle to another tier, or tap a person and use the arrows.</p>' +
      '<div id="pm-bar" class="hidden mb-2 p-2 rounded-xl bg-amber-500/15 border border-amber-500/40 text-[11px] text-amber-200 flex items-center gap-2 flex-wrap"></div>';
    TIERS.forEach(function (t) {
      var members = [];
      mapData.forEach(function (d, i) { if (String(d.rank) === String(t.r) && d.name.trim()) members.push(i); });
      html += '<div class="pm-tier p-3.5 rounded-2xl border ' + t.color + ' shadow-md mb-3" data-tier="' + t.r + '"><div class="flex items-center justify-between pb-1.5 border-b border-slate-700/50"><span class="text-xs font-bold flex items-center gap-1.5"><span>' + t.icon + '</span> ' + t.title + '</span><span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-slate-400">' + members.length + ' member(s)</span></div>';
      if (!members.length) html += '<span class="pm-empty text-[11px] text-slate-500 italic block mt-2">Drop someone here</span>';
      else {
        html += '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">';
        members.forEach(function (i) {
          var m = mapData[i], isMe = me && m.name === me;
          html += '<div class="pm flex items-center space-x-2 p-2 rounded-xl bg-slate-950/80 border ' + (i === selIdx ? 'border-amber-400 ring-2 ring-amber-400/60' : 'border-slate-800') + '" data-i="' + i + '" tabindex="0" role="button" aria-label="' + esc(m.name) + ', ' + esc(m.position || 'Team member') + ', tier ' + m.rank + '. Press Enter to select, then use the move buttons.">' +
            '<span class="pm-h shrink-0 w-6 h-8 flex items-center justify-center text-slate-500 text-base" data-drag aria-hidden="true" style="touch-action:none;cursor:grab">⠿</span>' +
            '<div class="w-7 h-7 rounded-full ' + t.badge + ' border flex items-center justify-center text-xs font-bold text-white shrink-0">' + esc((m.name.charAt(0) || '?').toUpperCase()) + '</div>' +
            '<div class="min-w-0 flex-1"><p class="text-xs font-bold text-slate-100 truncate leading-tight">' + (isMe ? '★ ' : '') + esc(m.name) + '</p><p class="text-[10px] text-slate-400 truncate leading-tight">' + esc(m.position || 'Team Member') + '</p></div></div>';
        });
        html += '</div>';
      }
      html += '</div>';
    });
    box.innerHTML = html; updatePmBar();
  }
  function updatePmBar() {
    var bar = $('pm-bar'); if (!bar) return;
    if (selIdx < 0 || !mapData[selIdx]) { bar.classList.add('hidden'); return; }
    var m = mapData[selIdx], r = parseInt(m.rank, 10);
    bar.classList.remove('hidden');
    bar.innerHTML = '<b class="truncate max-w-[40%]">' + esc(m.name) + '</b><span class="text-slate-400">tier ' + r + '</span>' +
      '<button onclick="pmMove(-1)"' + (r <= 1 ? ' disabled' : '') + ' class="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-100 font-bold disabled:opacity-40" aria-label="Move up one tier"><i class="fa-solid fa-arrow-up"></i> Up</button>' +
      '<button onclick="pmMove(1)"' + (r >= 4 ? ' disabled' : '') + ' class="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-100 font-bold disabled:opacity-40" aria-label="Move down one tier"><i class="fa-solid fa-arrow-down"></i> Down</button>' +
      '<button onclick="pmSelect(-1)" class="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300" aria-label="Clear selection"><i class="fa-solid fa-xmark"></i></button>';
  }
  window.pmSelect = function (i) { selIdx = i; renderPyramid(); };
  window.pmMove = function (d) {
    var m = mapData[selIdx]; if (!m) return; setRank(selIdx, Math.max(1, Math.min(4, (parseInt(m.rank, 10) || 4) + d)));
  };
  function setRank(i, tier) {
    var m = mapData[i]; if (!m || String(m.rank) === String(tier)) return;
    m.rank = String(tier); edited(); saveMap(); renderPyramid(); renderMapTable();
    toast(m.name + ' → Tier ' + tier); checkBadges();
  }
  /* drag */
  var drag = null, ghost = null;
  function tierAt(x, y) { var els = document.elementsFromPoint(x, y), i; for (i = 0; i < els.length; i++) { var t = els[i].closest && els[i].closest('.pm-tier'); if (t) return t; } return null; }
  function markTier(t) { document.querySelectorAll('.pm-tier').forEach(function (e) { e.classList.toggle('pm-over', e === t); }); }
  document.addEventListener('pointerdown', function (e) {
    var h = e.target.closest && e.target.closest('.pm-h'); if (!h) return;
    var pm = h.closest('.pm'); if (!pm) return;
    drag = { i: parseInt(pm.getAttribute('data-i'), 10), id: e.pointerId, el: pm };
    ghost = document.createElement('div'); ghost.className = 'pm-ghost'; ghost.textContent = '⠿ ' + mapData[drag.i].name;
    ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; document.body.appendChild(ghost);
    pm.classList.add('opacity-40'); e.preventDefault();
  }, true);
  document.addEventListener('pointermove', function (e) {
    if (!drag || e.pointerId !== drag.id) return;
    ghost.style.left = e.clientX + 'px'; ghost.style.top = e.clientY + 'px'; markTier(tierAt(e.clientX, e.clientY));
    var y = e.clientY; if (y < 70) window.scrollBy(0, -12); else if (y > window.innerHeight - 70) window.scrollBy(0, 12);
    e.preventDefault();
  }, { passive: false, capture: true });
  function endDrag(e, cancel) {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    var t = cancel ? null : tierAt(e.clientX, e.clientY), i = drag.i, x = e.clientX, y = e.clientY;
    if (ghost && ghost.parentNode) ghost.parentNode.removeChild(ghost); ghost = null; markTier(null); drag = null;
    if (t) { var tier = parseInt(t.getAttribute('data-tier'), 10); if (String(mapData[i].rank) !== String(tier)) { if (window.pwBurst) window.pwBurst(x, y, false, mapData[i].name + ' → Tier ' + tier); setRank(i, tier); return; } }
    renderPyramid();
  }
  document.addEventListener('pointerup', function (e) { endDrag(e, false); }, true);
  document.addEventListener('pointercancel', function (e) { endDrag(e, true); }, true);
  document.addEventListener('click', function (e) {
    var pm = e.target.closest && e.target.closest('.pm'); if (!pm || e.target.closest('.pm-h')) return;
    var i = parseInt(pm.getAttribute('data-i'), 10); window.pmSelect(selIdx === i ? -1 : i);
  });
  document.addEventListener('keydown', function (e) {
    var pm = e.target.closest && e.target.closest('.pm');
    if (pm && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); var i = parseInt(pm.getAttribute('data-i'), 10); window.pmSelect(selIdx === i ? -1 : i); setTimeout(function () { var n = document.querySelector('.pm[data-i="' + i + '"]'); if (n) n.focus(); }, 0); }
    if (pm && selIdx >= 0 && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) { e.preventDefault(); var ii = selIdx; window.pmMove(e.key === 'ArrowUp' ? -1 : 1); setTimeout(function () { var n = document.querySelector('.pm[data-i="' + ii + '"]'); if (n) n.focus(); }, 0); }
  });
  window.generateVisualMap = function () { saveMap(); selIdx = -1; goToStep('step-map-pyramid', 1.8); };

  /* =============================================================== position grid + what-if (Strategy Lab) */
  function zone(vis, inf) { var hv = vis >= 5, hi = inf >= 5; return hv && hi ? 'leader' : hv ? 'challenger' : hi ? 'flanker' : 'guerrilla'; }
  function labState() { var c = activeCP(); return { vis: typeof c.vis === 'number' ? c.vis : 5, inf: typeof c.inf === 'number' ? c.inf : 5 }; }
  function gridSVG(v, n) {
    var W = 300, P = 28, S = W - P - 8, x = P + v / 10 * S, y = (W - P) - n / 10 * S;
    var q = [['flanker', 'Flanker', P, 8, '#f97316'], ['leader', 'Leader', P + S / 2, 8, '#10b981'], ['guerrilla', 'Underdog', P, 8 + S / 2, '#ef4444'], ['challenger', 'Challenger', P + S / 2, 8 + S / 2, '#a855f7']];
    var z = zone(v, n);
    var s = '<svg viewBox="0 0 ' + W + ' ' + W + '" width="100%" role="img" aria-label="Position grid. Visibility is ' + v + ' of 10 and influence is ' + n + ' of 10." style="touch-action:none;display:block" font-family="system-ui,sans-serif">';
    q.forEach(function (a) {
      s += '<rect x="' + a[2] + '" y="' + a[3] + '" width="' + (S / 2) + '" height="' + (S / 2) + '" fill="' + a[4] + '" fill-opacity="' + (a[0] === z ? .38 : .14) + '" stroke="' + a[4] + '" stroke-opacity=".5"/>' +
        '<text x="' + (a[2] + S / 4) + '" y="' + (a[3] + S / 4 - 2) + '" text-anchor="middle" font-size="13" font-weight="800" fill="' + a[4] + '">' + D.POS_ICON[a[0]] + '</text><text x="' + (a[2] + S / 4) + '" y="' + (a[3] + S / 4 + 14) + '" text-anchor="middle" font-size="11" font-weight="800" fill="' + a[4] + '">' + a[1] + '</text>';
    });
    s += '<text x="' + (P + S / 2) + '" y="' + (W - 6) + '" text-anchor="middle" font-size="10" fill="#94a3b8">Visibility → (how much leaders notice you)</text>' +
      '<text transform="translate(10 ' + (8 + S / 2) + ') rotate(-90)" text-anchor="middle" font-size="10" fill="#94a3b8">Influence → (how much people follow you)</text>' +
      '<circle cx="' + x + '" cy="' + y + '" r="11" fill="#fbbf24" stroke="#0f172a" stroke-width="2.5"/><text x="' + x + '" y="' + (y + 4) + '" text-anchor="middle" font-size="11" font-weight="900" fill="#0f172a">★</text></svg>';
    return s;
  }
  function renderLab() {
    var g = $('lab-grid'); if (!g) return;
    var st = labState(), z = zone(st.vis, st.inf), p = profile();
    g.innerHTML = gridSVG(st.vis, st.inf);
    var v = $('lab-vis'), n = $('lab-inf'); if (v) v.value = st.vis; if (n) n.value = st.inf;
    var vl = $('lab-vis-v'), nl = $('lab-inf-v'); if (vl) vl.textContent = st.vis; if (nl) nl.textContent = st.inf;
    var r = $('lab-result'); if (!r) return;
    var cmp = '';
    if (p.position) cmp = p.position === z ? '<p class="mt-1 text-emerald-400 font-semibold">✓ This matches the position you chose in the Strategic Square.</p>' : '<p class="mt-1 text-amber-400 font-semibold">Your Strategic Square answer was ' + D.POS_ICON[p.position] + ' ' + esc(D.POS_LABEL[p.position]) + '. The grid suggests ' + D.POS_ICON[z] + ' ' + esc(D.POS_LABEL[z]) + '. Think about which one fits you better.</p>';
    r.innerHTML = '<p class="text-xs text-slate-200"><span class="text-base">' + D.POS_ICON[z] + '</span> The grid says: <b class="text-amber-400">' + esc(D.POS_LABEL[z]) + '</b> → <b>' + esc(D.POS_STRAT[z]) + '</b> strategy</p>' + cmp + '<p class="mt-1 text-[11px] text-slate-400">' + esc(D.ADVICE[z]) + '</p>' +
      '<div class="grid grid-cols-2 gap-2 mt-2"><button onclick="labUse()" class="py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold active:scale-95">Use this position</button><button onclick="goToStep(\'strat-' + z + '\',5)" class="py-2 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">Open the strategy</button></div>';
    renderWhatIf();
  }
  function setGrid(vis, inf) { var c = activeCP(); c.vis = vis; c.inf = inf; persist(); flag('grid', 1); renderLab(); checkBadges(); }
  window.labSlide = function () { setGrid(parseInt($('lab-vis').value, 10), parseInt($('lab-inf').value, 10)); };
  window.labUse = function () { var st = labState(); var z = zone(st.vis, st.inf); if (window.pickPosition) window.pickPosition(z); toast('Position set: ' + D.POS_LABEL[z]); renderLab(); };
  document.addEventListener('pointerdown', gridPoint, true);
  var gridDown = false;
  function gridPoint(e) {
    var svg = e.target.closest && e.target.closest('#lab-grid'); if (!svg) return;
    gridDown = true; setFromEvent(e);
  }
  function setFromEvent(e) {
    var svg = $('lab-grid').querySelector('svg'); if (!svg) return; var r = svg.getBoundingClientRect(), k = 300 / r.width, P = 28, S = 300 - P - 8;
    var vx = ((e.clientX - r.left) * k - P) / S * 10, vy = ((300 - P) - (e.clientY - r.top) * k) / S * 10;
    setGrid(Math.max(0, Math.min(10, Math.round(vx))), Math.max(0, Math.min(10, Math.round(vy))));
  }
  document.addEventListener('pointermove', function (e) { if (gridDown) { setFromEvent(e); e.preventDefault(); } }, { passive: false, capture: true });
  document.addEventListener('pointerup', function () { gridDown = false; }, true);

  function currentPos() { var p = profile(); if (p.position) return p.position; var st = labState(); return zone(st.vis, st.inf); }
  function renderWhatIf() {
    var sel = $('wi-select'); if (!sel) return;
    if (!sel.options.length) sel.innerHTML = '<option value="">Choose a situation…</option>' + D.SCENARIOS.map(function (s) { return '<option value="' + s.id + '">' + esc(s.t) + '</option>'; }).join('');
    var out = $('wi-result'); var sc = D.SCENARIOS.filter(function (s) { return s.id === sel.value; })[0];
    if (!sc) { out.innerHTML = '<p class="text-[11px] text-slate-500">Pick a situation to see how your playbook would change.</p>'; return; }
    var now = currentPos(), nw = sc.to[now] || now, moves = (window.PW_TIPS && PW_TIPS[nw]) ? PW_TIPS[nw] : [];
    var h = sc.id.length, picks = [0, 1, 2].map(function (k) { return (h * 3 + k * 5) % (moves.length || 1); });
    var html = '<div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60"><p class="text-[11px] text-slate-400">Now</p><p class="text-xs font-bold text-slate-100">' + D.POS_ICON[now] + ' ' + esc(D.POS_LABEL[now]) + '</p>' +
      '<p class="text-center text-amber-400 my-1" aria-hidden="true">⬇ ' + esc(sc.t) + '</p><p class="text-[11px] text-slate-400">After</p><p class="text-xs font-bold text-amber-400">' + D.POS_ICON[nw] + ' ' + esc(D.POS_LABEL[nw]) + (nw === now ? ' (same position, new tactics)' : '') + '</p></div>' +
      '<p class="text-[11px] text-slate-300 mt-2 leading-snug">' + esc(sc.base) + ' <b>' + esc(D.ADVICE[nw]) + '</b></p><p class="text-[11px] font-bold text-slate-200 mt-2">3 moves for that situation:</p><div class="space-y-1.5 mt-1">';
    picks.forEach(function (i) {
      var t = moves[i]; if (!t) return;
      html += '<div class="p-2 rounded-xl bg-slate-900/60 border border-slate-700/60"><p class="text-[11px] font-bold text-slate-100">' + esc(t[0]) + '</p><p class="text-[11px] text-slate-300 leading-snug">' + esc(t[1]) + '</p><button data-id="wi-' + sc.id + '-' + nw + '-' + i + '" data-text="' + esc(t[0] + ': ' + t[1]) + '" onclick="pwTipDo(this)" class="mt-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-bold active:scale-95"><i class="fa-solid fa-bolt"></i> Do it</button></div>';
    });
    html += '</div><button onclick="wiApply(\'' + nw + '\')" class="mt-2 w-full py-2 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold active:scale-95">Try this as my position</button>';
    out.innerHTML = html;
  }
  window.wiChange = function () { if ($('wi-select').value) { flag('whatif', 1); checkBadges(); } renderWhatIf(); };
  window.wiApply = function (pos) { if (window.pickPosition) window.pickPosition(pos); toast('Position set: ' + D.POS_LABEL[pos]); renderLab(); };

  /* =============================================================== strategy checklists */
  function checksState() { return lsGet('pw_checks', {}); }
  function buildChecklists() {
    Object.keys(D.CHECKS).forEach(function (pos) {
      var sec = $('strat-' + pos); if (!sec || sec.querySelector('.chk-panel')) return;
      var d = document.createElement('div'); d.className = 'chk-panel mb-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60'; d.setAttribute('data-pos', pos);
      var anchor = sec.querySelector('.tips-panel') || sec.lastElementChild; sec.insertBefore(d, anchor);
      renderChecklist(pos);
    });
  }
  function renderChecklist(pos) {
    var panel = document.querySelector('.chk-panel[data-pos="' + pos + '"]'); if (!panel) return;
    var st = (checksState()[pos] || []), done = D.CHECKS[pos].filter(function (t, i) { return st[i]; }).length, n = D.CHECKS[pos].length;
    panel.innerHTML = '<div class="flex items-center justify-between mb-1.5"><p class="text-xs font-bold text-amber-400">✅ My rules checklist</p><span class="text-[10px] font-bold ' + (done === n ? 'text-emerald-400' : 'text-slate-400') + '">' + done + ' / ' + n + '</span></div>' +
      '<div class="w-full bg-slate-700/70 h-1.5 rounded-full overflow-hidden mb-2" aria-hidden="true"><div class="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style="width:' + Math.round(done / n * 100) + '%"></div></div>' +
      D.CHECKS[pos].map(function (t, i) {
        return '<label class="flex items-start gap-2 py-1 cursor-pointer"><input type="checkbox" ' + (st[i] ? 'checked' : '') + ' onchange="chkToggle(\'' + pos + '\',' + i + ',this)" class="mt-0.5 form-checkbox rounded text-emerald-500 focus:ring-0"><span class="text-[11px] leading-snug ' + (st[i] ? 'line-through text-slate-500' : 'text-slate-200') + '">' + esc(t) + '</span></label>';
      }).join('') + (done === n ? '<p class="mt-1 text-[11px] text-emerald-400 font-bold">🎉 All rules done. Strong work!</p>' : '') +
      '<button onclick="chkReset(\'' + pos + '\')" class="mt-1.5 text-[10px] text-slate-500 underline">Start a new round</button>';
  }
  window.chkToggle = function (pos, i, el) {
    var all = checksState(), a = all[pos] || []; a[i] = el.checked ? 1 : 0; all[pos] = a; lsSet('pw_checks', all);
    var done = D.CHECKS[pos].filter(function (t, k) { return a[k]; }).length;
    renderChecklist(pos);
    if (el.checked) burst(el, false);
    if (done === D.CHECKS[pos].length) { if (window.pwBurst) window.pwBurst(window.innerWidth / 2, window.innerHeight / 2, true, 'Checklist complete! 🎉'); }
    checkBadges();
  };
  window.chkReset = function (pos) { var all = checksState(); all[pos] = []; lsSet('pw_checks', all); renderChecklist(pos); };

  /* =============================================================== action plan: status, dates, flags */
  var mvFilter = 'all';
  function mvStatus(m) { return m.st || (m.done ? 'done' : 'pending'); }
  function dayDiff(due) { if (!due) return null; var a = new Date(due + 'T00:00:00'), b = new Date(); b.setHours(0, 0, 0, 0); return Math.round((a - b) / 86400000); }
  var _stats = window.refreshStats;
  var sealShownSig = lsGet('pw_seal', '');
  window.refreshStats = function () {
    _stats();
    var total = parseInt(($('stat-picks') || {}).innerText, 10) || 0, power = parseInt(($('stat-power') || {}).innerText, 10) || 0;
    var auto = document.querySelectorAll('#plan-checklist input[type="checkbox"]').length, tot = auto + total;
    if (tot > 0 && power === 100) {
      var sig = tot + ':' + power; flag('complete', 1);
      if (cur === 'step-action-plan' && sealShownSig !== sig) { sealShownSig = sig; lsSet('pw_seal', sig); showSeal(); }
    } else if (power < 100) { sealShownSig = ''; lsSet('pw_seal', ''); }
    checkBadges();
  };
  function showSeal() {
    var o = $('seal'); if (!o) { o = document.createElement('div'); o.id = 'seal'; o.setAttribute('role', 'status'); o.onclick = function () { o.classList.add('hidden'); }; document.body.appendChild(o); }
    o.innerHTML = '<div class="seal-stamp"><div class="seal-in"><span class="seal-check">✔</span><b>PLAN</b><b>COMPLETE</b><small>Promotion Warfare</small></div></div>';
    o.classList.remove('hidden'); void o.offsetWidth; o.classList.add('seal-on');
    if (window.pwBurst) setTimeout(function () { window.pwBurst(window.innerWidth / 2, window.innerHeight / 2, true, 'Mission complete! 🏆'); }, 450);
    clearTimeout(showSeal.t); showSeal.t = setTimeout(function () { o.classList.add('hidden'); o.classList.remove('seal-on'); }, 3200);
  }
  window.mvSetFilter = function (f) { mvFilter = f; window.renderMoves(); };
  window.renderMoves = function () {
    var box = $('my-moves'); if (!box) return;
    var list = myMoves.map(function (m, i) { return { m: m, i: i }; });
    var cnt = { pending: 0, progress: 0, done: 0, flag: 0, over: 0, soon: 0 };
    list.forEach(function (x) { var s = mvStatus(x.m); cnt[s]++; if (x.m.flag) cnt.flag++; var d = dayDiff(x.m.due); if (s !== 'done' && d !== null) { if (d < 0) cnt.over++; else if (d <= 7) cnt.soon++; } });
    var sm = $('mv-summary'); if (sm) sm.innerHTML = myMoves.length ? '<span class="text-slate-400">' + cnt.pending + ' pending · ' + cnt.progress + ' in progress · ' + cnt.done + ' done</span>' + (cnt.over ? ' <span class="text-red-400 font-bold">⚠ ' + cnt.over + ' overdue</span>' : '') + (cnt.soon ? ' <span class="text-amber-400 font-bold">📅 ' + cnt.soon + ' due this week</span>' : '') : '';
    var fl = $('mv-filters');
    if (fl) fl.innerHTML = myMoves.length ? [['all', 'All'], ['pending', 'Pending'], ['progress', 'In progress'], ['done', 'Done'], ['flag', '🚩 Flagged']].map(function (f) { return '<button onclick="mvSetFilter(\'' + f[0] + '\')" aria-pressed="' + (mvFilter === f[0]) + '" class="px-2.5 py-1 rounded-full text-[10px] font-bold ' + (mvFilter === f[0] ? 'sel-on' : 'bg-slate-700 text-slate-200') + '">' + f[1] + '</button>'; }).join('') : '';
    var shown = list.filter(function (x) { var s = mvStatus(x.m); return mvFilter === 'all' || (mvFilter === 'flag' ? x.m.flag : s === mvFilter); });
    if (!myMoves.length) { box.innerHTML = '<p class="text-[11px] text-slate-500 italic">Nothing yet. Tap "Do it" on any strategy card to add a move here.</p>'; refreshStats(); return; }
    if (!shown.length) { box.innerHTML = '<p class="text-[11px] text-slate-500 italic">No moves in this filter.</p>'; refreshStats(); return; }
    box.innerHTML = shown.map(function (x) {
      var m = x.m, i = x.i, s = mvStatus(m), d = dayDiff(m.due), tag = '';
      if (s !== 'done' && d !== null) tag = d < 0 ? '<span class="px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold">Overdue ' + (-d) + 'd</span>' : d === 0 ? '<span class="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">Due today</span>' : d <= 7 ? '<span class="px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-bold">In ' + d + ' days</span>' : '';
      var border = s === 'done' ? 'border-emerald-500/50' : (d !== null && d < 0) ? 'border-red-500/60' : s === 'progress' ? 'border-blue-500/50' : 'border-slate-700/60';
      return '<div class="p-2.5 rounded-xl bg-slate-900/80 border ' + border + '"><div class="flex items-start gap-2"><input type="checkbox" ' + (m.done ? 'checked' : '') + ' onchange="toggleMove(' + i + ')" aria-label="Done: ' + esc(m.text) + '" class="mt-0.5 form-checkbox rounded text-emerald-500 focus:ring-0 cursor-pointer">' +
        '<span class="flex-1 text-xs leading-snug ' + (m.done ? 'line-through text-slate-500' : 'text-slate-200') + '">' + esc(m.text) + '</span>' +
        '<button onclick="mvFlag(' + i + ')" aria-pressed="' + (!!m.flag) + '" aria-label="Priority flag" class="text-sm px-1 ' + (m.flag ? '' : 'opacity-35 grayscale') + '">🚩</button>' +
        '<button onclick="removeMove(' + i + ')" aria-label="Remove move" class="text-slate-500 hover:text-red-400 text-xs px-1"><i class="fa-solid fa-xmark"></i></button></div>' +
        '<div class="flex items-center gap-2 mt-2 flex-wrap"><select onchange="mvSetStatus(' + i + ',this.value)" aria-label="Status" class="bg-slate-950 text-slate-100 text-[11px] rounded-lg px-2 py-1 border border-slate-700 outline-none"><option value="pending"' + (s === 'pending' ? ' selected' : '') + '>⏳ Pending</option><option value="progress"' + (s === 'progress' ? ' selected' : '') + '>🔧 In progress</option><option value="done"' + (s === 'done' ? ' selected' : '') + '>✅ Completed</option></select>' +
        '<label class="text-[10px] text-slate-400 flex items-center gap-1">Due <input type="date" value="' + esc(m.due || '') + '" onchange="mvSetDue(' + i + ',this.value)" aria-label="Due date" class="bg-slate-950 text-slate-100 text-[11px] rounded-lg px-1.5 py-0.5 border border-slate-700 outline-none"></label>' + tag + '</div></div>';
    }).join('');
    refreshStats();
  };
  window.toggleMove = function (i) { var m = myMoves[i]; if (!m) return; m.done = !m.done; m.st = m.done ? 'done' : 'pending'; saveMoves(); window.renderMoves(); if (m.done) toast('Nice! Move completed 💪'); };
  window.mvSetStatus = function (i, s) { var m = myMoves[i]; if (!m) return; m.st = s; m.done = s === 'done'; saveMoves(); window.renderMoves(); if (m.done) { toast('Nice! Move completed 💪'); } };
  window.mvSetDue = function (i, v) { var m = myMoves[i]; if (!m) return; m.due = v || ''; saveMoves(); window.renderMoves(); };
  window.mvFlag = function (i) { var m = myMoves[i]; if (!m) return; m.flag = !m.flag; saveMoves(); window.renderMoves(); };

  /* =============================================================== print + CSV export */
  function companyName() { return activeCP().name; }
  function tierRows() {
    var out = '';
    [1, 2, 3, 4].forEach(function (r, k) {
      var names = mapData.filter(function (d) { return String(d.rank) === String(r) && d.name.trim(); }).map(function (d) { return esc(d.name) + (d.position ? ' <i>(' + esc(d.position) + ')</i>' : ''); });
      out += '<div class="pr-tier" style="width:' + (55 + k * 15) + '%"><b>' + ['Top', 'Senior / Mid', 'Key people', 'Base team'][k] + '</b> · ' + (names.join('; ') || '<i>empty</i>') + '</div>';
    });
    return out;
  }
  function buildDossier() {
    var p = profile(), pos = p.position, wins = lsGet('pw_wins_log', []), me = lsGet('pw_me_name', ''), chk = checksState()[pos] || [];
    var rows = mapData.filter(function (d) { return d.name.trim(); }).slice().sort(function (a, b) { return a.rank - b.rank; });
    var h = '<h1>Promotion Warfare – Career Dossier</h1><p class="pr-sub">' + esc(p.name ? p.name + ' · ' : '') + 'Company: <b>' + esc(companyName()) + '</b> · ' + new Date().toLocaleDateString() + (me ? ' · I am: <b>' + esc(me) + '</b>' : '') + '</p>';
    h += '<h2>1. Power Rank Table</h2><table><thead><tr><th>Rank</th><th>Name</th><th>Position</th></tr></thead><tbody>' + (rows.map(function (r) { return '<tr><td>' + esc(r.rank) + '</td><td>' + esc(r.name) + '</td><td>' + esc(r.position) + '</td></tr>'; }).join('') || '<tr><td colspan="3"><i>No people yet</i></td></tr>') + '</tbody></table>';
    h += '<h2>2. Power Pyramid</h2><div class="pr-pyr">' + tierRows() + '</div>';
    h += '<h2>3. My Strategy</h2>';
    if (pos) {
      var c = D.CHEAT[pos];
      h += '<p><b>' + D.POS_ICON[pos] + ' ' + esc(D.POS_LABEL[pos]) + ' – ' + esc(D.POS_STRAT[pos]) + ' warfare.</b> <i>' + esc(c.motto) + '</i></p><ul>' + c.rules.map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('') + '</ul>';
      h += '<p><b>My rules checklist:</b></p><ul class="pr-chk">' + D.CHECKS[pos].map(function (t, i) { return '<li>' + (chk[i] ? '☑' : '☐') + ' ' + esc(t) + '</li>'; }).join('') + '</ul>';
    } else h += '<p><i>No position chosen yet.</i></p>';
    h += '<h2>4. Action Plan</h2><table><thead><tr><th>Status</th><th>Move</th><th>Due</th><th>Flag</th></tr></thead><tbody>' +
      (myMoves.map(function (m) { var s = mvStatus(m); return '<tr><td>' + ({ pending: 'Pending', progress: 'In progress', done: 'Done' }[s]) + '</td><td>' + esc(m.text) + '</td><td>' + esc(m.due || '') + '</td><td>' + (m.flag ? '🚩' : '') + '</td></tr>'; }).join('') || '<tr><td colspan="4"><i>No moves yet</i></td></tr>') + '</tbody></table>';
    var tasks = [].map.call(document.querySelectorAll('#plan-checklist > div'), function (d) { var i = d.querySelector('input'), l = d.querySelector('label'); return '<li>' + (i && i.checked ? '☑' : '☐') + ' ' + esc(l ? l.textContent.trim() : '') + '</li>'; });
    if (tasks.length) h += '<h3>Tactical to-do list</h3><ul class="pr-chk">' + tasks.join('') + '</ul>';
    h += '<h2>5. Wins Journal</h2>' + (wins.length ? '<ul>' + wins.map(function (w) { return '<li>' + esc(w.d || '') + ' – ' + esc(w.t) + '</li>'; }).join('') + '</ul>' : '<p><i>No wins yet</i></p>');
    h += '<p class="pr-foot">Made with Promotion Warfare · HiProgress · hiprogress.etsy.com</p>';
    return h;
  }
  window.printDossier = function () {
    var a = $('print-area'); if (!a) return; a.innerHTML = buildDossier(); document.body.classList.add('printing'); flag('printed', 1); checkBadges();
    var done = function () { document.body.classList.remove('printing'); window.removeEventListener('afterprint', done); };
    window.addEventListener('afterprint', done);
    setTimeout(function () { try { window.print(); } catch (e) { toast('Printing is not available here'); } setTimeout(done, 1500); }, 80);
  };
  function csv(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function buildCSV() {
    var p = profile(), pos = p.position, L = [];
    L.push(['Promotion Warfare export', new Date().toLocaleDateString()].map(csv).join(','), ['Company', companyName()].map(csv).join(','), ['My position', pos ? D.POS_LABEL[pos] : ''].map(csv).join(','), '');
    L.push('POWER RANK TABLE', 'Rank,Name,Position');
    mapData.filter(function (d) { return d.name.trim(); }).slice().sort(function (a, b) { return a.rank - b.rank; }).forEach(function (r) { L.push([r.rank, r.name, r.position].map(csv).join(',')); });
    L.push('', 'ACTION PLAN', 'Status,Move,Due date,Flagged');
    myMoves.forEach(function (m) { L.push([({ pending: 'Pending', progress: 'In progress', done: 'Done' })[mvStatus(m)], m.text, m.due || '', m.flag ? 'Yes' : ''].map(csv).join(',')); });
    if (pos) { var chk = checksState()[pos] || []; L.push('', 'STRATEGY CHECKLIST (' + D.POS_STRAT[pos] + ')', 'Done,Rule'); D.CHECKS[pos].forEach(function (t, i) { L.push([chk[i] ? 'Yes' : 'No', t].map(csv).join(',')); }); }
    L.push('', 'WINS JOURNAL', 'Date,Win'); lsGet('pw_wins_log', []).forEach(function (w) { L.push([w.d || '', w.t].map(csv).join(',')); });
    return '﻿' + L.join('\r\n');
  }
  function saveFile(name, text, type) {
    var blob = new Blob([text], { type: type }), file = null;
    try { file = new File([blob], name, { type: type }); } catch (e) { }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: name }).catch(function () { }); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.parentNode.removeChild(a); }, 1500);
  }
  window.exportCSV = function () { saveFile('promotion-warfare-' + companyName().replace(/[^a-z0-9]+/gi, '-').toLowerCase() + '.csv', buildCSV(), 'text/csv'); flag('printed', 1); toast('CSV ready'); checkBadges(); };
  window.pwBuildCSV = buildCSV; window.pwBuildDossier = buildDossier;

  /* =============================================================== glossary tooltips */
  var TERMS = null, TERM_RE = null;
  function termSetup() {
    if (TERMS) return;
    TERMS = {}; var list = (window.PW_GLOSS || []).concat(D.GLOSS_EXTRA || []), keys = [];
    list.forEach(function (g) { if (/^[A-Za-z' -]+$/.test(g[0]) && !TERMS[g[0].toLowerCase()]) { TERMS[g[0].toLowerCase()] = g; keys.push(g[0]); } });
    keys.sort(function (a, b) { return b.length - a.length; });
    TERM_RE = new RegExp('\\b(' + keys.map(function (k) { return k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\b', 'i');
  }
  var SKIP = /^(BUTTON|A|INPUT|SELECT|TEXTAREA|SCRIPT|STYLE|SVG|OPTION|CANVAS|H1|H2|LABEL|SUMMARY)$/;
  function wrapTerms(root) {
    if (!root) return; termSetup(); if (!TERM_RE) return;
    var seen = {}, nodes = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentNode; if (!p || SKIP.test(p.nodeName.toUpperCase()) || (p.closest && p.closest('.gl-term, button, a, label, h1, h2, summary, #print-area'))) continue;
      if (n.nodeValue.trim().length < 4) continue; nodes.push(n);
    }
    nodes.forEach(function (node) {
      var txt = node.nodeValue, m, frag = null, last = 0, g = new RegExp(TERM_RE.source, 'gi');
      while ((m = g.exec(txt))) {
        var key = m[1].toLowerCase(); if (seen[key]) continue; seen[key] = 1;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(txt.slice(last, m.index)));
        var s = document.createElement('span'); s.className = 'gl-term'; s.setAttribute('role', 'button'); s.setAttribute('tabindex', '0'); s.setAttribute('data-term', key); s.setAttribute('aria-label', m[1] + ': tap for the meaning'); s.textContent = m[1];
        frag.appendChild(s); last = m.index + m[1].length;
      }
      if (frag) { frag.appendChild(document.createTextNode(txt.slice(last))); node.parentNode.replaceChild(frag, node); }
    });
  }
  var GL_PAGES = ['step-start', 'step-square', 'step-q1', 'step-q2', 'step-q3', 'strat-leader', 'strat-challenger', 'strat-flanker', 'strat-guerrilla', 'step-help', 'step-about'];
  function glossPage(id) { var s = $(id); if (s && GL_PAGES.indexOf(id) >= 0 && !s.getAttribute('data-gl')) { wrapTerms(s); s.setAttribute('data-gl', '1'); } }
  function showGlPop(el) {
    termSetup(); var g = TERMS[el.getAttribute('data-term')]; if (!g) return;
    var pop = $('gl-pop'); if (!pop) { pop = document.createElement('div'); pop.id = 'gl-pop'; pop.setAttribute('role', 'tooltip'); document.body.appendChild(pop); }
    pop.innerHTML = '<b>' + esc(g[0]) + '</b><span>' + esc(g[1]) + '</span><a href="#" onclick="glClose();goToStep(\'step-glossary\',0);return false" >Open the Glossary →</a>';
    pop.classList.remove('hidden');
    var r = el.getBoundingClientRect(), pw = Math.min(280, window.innerWidth - 24); pop.style.width = pw + 'px';
    var left = Math.max(12, Math.min(window.innerWidth - pw - 12, r.left + r.width / 2 - pw / 2));
    pop.style.left = left + 'px'; pop.style.top = '0px'; var ph = pop.offsetHeight;
    pop.style.top = (r.top - ph - 10 > 8 ? r.top - ph - 10 : r.bottom + 10) + 'px';
    flag('gl', 1);
  }
  window.glClose = function () { var p = $('gl-pop'); if (p) p.classList.add('hidden'); };
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.gl-term');
    if (t) { e.preventDefault(); e.stopPropagation(); showGlPop(t); return; }
    if (!(e.target.closest && e.target.closest('#gl-pop'))) window.glClose();
  }, true);
  window.addEventListener('scroll', function () { window.glClose(); }, { passive: true });
  var _openModal = window.openModal;
  window.openModal = function (id) { _openModal(id); try { wrapTerms($('modal-body')); } catch (e) { } };

  /* =============================================================== cheat sheet */
  var chFilter = 'all';
  window.chSet = function (f) { chFilter = f; renderCheat(); };
  function card(title, color, body) { return '<div class="ch-card p-3 rounded-2xl bg-slate-900/70 border ' + color + '"><p class="text-xs font-bold text-slate-100 mb-1.5">' + title + '</p>' + body + '</div>'; }
  function ul(a, c) { return '<ul class="space-y-1">' + a.map(function (x) { return '<li class="text-[11px] leading-snug ' + (c || 'text-slate-300') + '">• ' + esc(x) + '</li>'; }).join('') + '</ul>'; }
  function renderCheat() {
    var box = $('cheat-list'); if (!box) return;
    var q = (($('cheat-search') || {}).value || '').trim().toLowerCase(), colors = { leader: 'border-emerald-500/40', challenger: 'border-purple-500/40', flanker: 'border-orange-500/40', guerrilla: 'border-red-500/40' };
    var chips = [['all', 'All'], ['leader', '🛡️ Leader'], ['challenger', '⚔️ Challenger'], ['flanker', '🚀 Flanker'], ['guerrilla', '🥷 Underdog'], ['meeting', '🎤 Meeting'], ['review', '📝 Review']];
    var fl = $('cheat-chips'); if (fl) fl.innerHTML = chips.map(function (c) { return '<button onclick="chSet(\'' + c[0] + '\')" aria-pressed="' + (chFilter === c[0]) + '" class="shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold ' + (chFilter === c[0] ? 'sel-on' : 'bg-slate-700 text-slate-200') + '">' + c[1] + '</button>'; }).join('');
    var items = [];
    ['leader', 'challenger', 'flanker', 'guerrilla'].forEach(function (p) {
      var c = D.CHEAT[p];
      items.push({ k: p, txt: [c.motto].concat(c.rules, c.say, c.avoid).join(' ') + ' ' + D.POS_LABEL[p] + ' ' + D.POS_STRAT[p] + ' strategy', html: card(D.POS_ICON[p] + ' ' + D.POS_LABEL[p] + ' · ' + D.POS_STRAT[p] + ' · <span class="text-amber-400">' + esc(c.motto) + '</span>', colors[p], '<p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Core rules</p>' + ul(c.rules) + '<p class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mt-2 mb-1">Say</p>' + ul(c.say, 'text-emerald-200') + '<p class="text-[10px] font-bold uppercase tracking-wider text-red-400 mt-2 mb-1">Avoid</p>' + ul(c.avoid, 'text-red-200') + '<button onclick="goToStep(\'strat-' + p + '\',5)" class="mt-2 text-[11px] text-amber-400 font-bold underline">Open the full strategy →</button>') });
    });
    items.push({ k: 'meeting', txt: D.CHEAT_MEET.join(' ') + ' difficult meeting before', html: card('🎤 Before a difficult meeting', 'border-blue-500/40', ul(D.CHEAT_MEET)) });
    items.push({ k: 'review', txt: D.CHEAT_REVIEW.join(' ') + ' performance review before', html: card('📝 Before a performance review', 'border-amber-500/40', ul(D.CHEAT_REVIEW)) });
    var out = items.filter(function (i) { return (chFilter === 'all' || i.k === chFilter) && (!q || i.txt.toLowerCase().indexOf(q) >= 0); });
    box.innerHTML = out.length ? out.map(function (i) { return i.html; }).join('') : '<p class="text-xs text-slate-500 italic">Nothing found. Try another word.</p>';
  }
  window.cheatSearch = renderCheat;

  /* =============================================================== badges */
  var queue = [], showing = false;
  function badgeState() {
    var p = profile(), f = lsGet('pw_flags', {}), v = f.v || {}, named = mapData.filter(function (d) { return d.name.trim(); }).length;
    var done = myMoves.filter(function (m) { return m.done; }).length, chk = checksState(), full = Object.keys(D.CHECKS).some(function (k) { return D.CHECKS[k].every(function (t, i) { return (chk[k] || [])[i]; }); });
    var chat = lsGet('pw_chat', []).filter(function (m) { return m.r === 'u'; }).length;
    return {
      mapped: named >= 4 && !!f.edited, pyramid: !!v.pyramid, highground: !!p.position, explorer: ['leader', 'challenger', 'flanker', 'guerrilla'].every(function (k) { return v[k]; }),
      leader: p.position === 'leader' || !!f.p_leader, challenger: p.position === 'challenger' || !!f.p_challenger, flanker: p.position === 'flanker' || !!f.p_flanker, guerrilla: p.position === 'guerrilla' || !!f.p_guerrilla,
      firstmove: myMoves.length >= 1, planner: myMoves.length >= 5, finisher: done >= 3, rulebook: full, winner: lsGet('pw_wins_log', []).length >= 3, adviser: chat >= 5, lab: !!(f.grid && f.whatif), printed: !!f.printed, complete: !!f.complete
    };
  }
  window.pwCheckBadges = function () { checkBadges(); };
  var firstBadgeRun = true;
  function checkBadges() {
    if (!window.PW6 || !window.myMoves && typeof myMoves === 'undefined') return;
    var st = badgeState(), got = lsGet('pw_badges', {}), fresh = [];
    var pp = profile().position; if (pp) { var f = lsGet('pw_flags', {}); if (!f['p_' + pp]) { f['p_' + pp] = 1; lsSet('pw_flags', f); } }
    D.BADGES.forEach(function (b) { if (st[b.id] && !got[b.id]) { got[b.id] = new Date().toISOString().slice(0, 10); fresh.push(b); } });
    if (fresh.length) { lsSet('pw_badges', got); if (!firstBadgeRun) fresh.forEach(function (b) { queue.push(b); }); renderBadgeStrip(); if ($('step-badges') && cur === 'step-badges') renderBadges(); popBadge(); }
    firstBadgeRun = false;
  }
  function popBadge() {
    if (showing || !queue.length) return; showing = true;
    var b = queue.shift(), n = $('badge-pop');
    if (!n) { n = document.createElement('div'); n.id = 'badge-pop'; n.setAttribute('role', 'status'); n.onclick = function () { goToStep('step-badges', 0); n.classList.remove('bp-on'); }; document.body.appendChild(n); }
    n.innerHTML = '<span class="bp-e">' + b.e + '</span><span><small>Badge unlocked!</small><b>' + esc(b.n) + '</b></span>';
    void n.offsetWidth; n.classList.add('bp-on');
    if (window.pwBurst) window.pwBurst(window.innerWidth / 2, 70, false);
    setTimeout(function () { n.classList.remove('bp-on'); setTimeout(function () { showing = false; popBadge(); }, 400); }, 3000);
  }
  function renderBadgeStrip() {
    var got = lsGet('pw_badges', {}), n = Object.keys(got).length, s = $('welcome-badges'); if (!s) return;
    s.innerHTML = '<span class="text-base" aria-hidden="true">🏅</span> <b>' + n + ' / ' + D.BADGES.length + '</b> badges' + '<span class="ml-auto text-amber-400 text-[11px] font-bold">View →</span>';
  }
  function renderBadges() {
    var box = $('badge-grid'); if (!box) return; var got = lsGet('pw_badges', {}), n = Object.keys(got).length;
    var c = $('badge-count'); if (c) c.textContent = n + ' of ' + D.BADGES.length + ' unlocked';
    box.innerHTML = D.BADGES.map(function (b) {
      var on = !!got[b.id];
      return '<div class="p-3 rounded-2xl border text-center ' + (on ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-900/60 border-slate-700/60') + '"><div class="text-3xl ' + (on ? '' : 'grayscale opacity-40') + '" aria-hidden="true">' + (on ? b.e : '🔒') + '</div><p class="text-[11px] font-bold mt-1 ' + (on ? 'text-amber-300' : 'text-slate-400') + '">' + esc(b.n) + '</p><p class="text-[10px] text-slate-500 leading-snug mt-0.5">' + (on ? 'Unlocked ' + esc(got[b.id]) : esc(b.h)) + '</p></div>';
    }).join('');
  }
  var _addMove = window.addMove; window.addMove = function () { var r = _addMove.apply(this, arguments); checkBadges(); return r; };
  var _addWin = window.addWin; if (_addWin) window.addWin = function () { var r = _addWin.apply(this, arguments); checkBadges(); return r; };
  setInterval(function () { if (!document.hidden) checkBadges(); }, 4000);

  /* =============================================================== install prompt */
  var deferred = null;
  function standalone() { return (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true || (document.referrer || '').indexOf('android-app://') === 0; }
  function isIOS() { return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream; }
  function installRecentlyClosed() { var t = lsGet('pw_install_closed', 0); return t && (Date.now() - t) < 14 * 86400000; }
  function showInstall() { var b = $('install-banner'); if (b && !standalone() && !installRecentlyClosed()) b.classList.remove('hidden'); }
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; showInstall(); });
  window.addEventListener('appinstalled', function () { var b = $('install-banner'); if (b) b.classList.add('hidden'); deferred = null; toast('App installed 🎉'); });
  window.pwInstall = function () {
    if (standalone()) { toast('The app is already installed'); return; }
    if (deferred) { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; var b = $('install-banner'); if (b) b.classList.add('hidden'); }); return; }
    var h = $('install-hint'); if (h) { h.textContent = isIOS() ? 'On iPhone: tap the Share button, then "Add to Home Screen".' : 'Open the browser menu (⋮) and tap "Install app" or "Add to Home screen".'; h.classList.remove('hidden'); }
    var b = $('install-banner'); if (b) b.classList.remove('hidden');
    if (cur !== 'step-welcome') goToStep('step-welcome', 0);
  };
  window.pwInstallClose = function () { var b = $('install-banner'); if (b) b.classList.add('hidden'); lsSet('pw_install_closed', Date.now()); };

  /* =============================================================== time estimates */
  var TIMES = { 'step-start': 1, 'step-map-builder': 3, 'step-map-pyramid': 1, 'step-square': 1, 'step-q1': 1, 'step-q2': 1, 'step-q3': 1, 'strat-leader': 3, 'strat-challenger': 3, 'strat-flanker': 3, 'strat-guerrilla': 3, 'step-action-plan': 5, 'step-lab': 3, 'step-cheat': 2, 'step-journal': 2 };
  var ORDER = ['step-start', 'step-map-builder', 'step-map-pyramid', 'step-square', 'step-q1', 'step-q2', 'step-q3', 'strat-x'];
  function addTimeChips() {
    Object.keys(TIMES).forEach(function (id) {
      var s = $(id); if (!s || s.querySelector('.time-chip')) return;
      var h = s.querySelector('h2'); if (!h) return;
      var c = document.createElement('span'); c.className = 'time-chip'; c.textContent = '⏱ ~' + TIMES[id] + ' min'; c.setAttribute('aria-label', 'about ' + TIMES[id] + ' minutes');
      (h.parentNode).appendChild(c);
    });
  }
  function timeLeft(id) {
    var k = id.indexOf('strat-') === 0 ? 'strat-x' : id, i = ORDER.indexOf(k); if (i < 0) return 0;
    var sum = 0; for (; i < ORDER.length; i++) sum += (ORDER[i] === 'strat-x' ? 3 : TIMES[ORDER[i]]); return sum;
  }

  /* =============================================================== accessibility helpers */
  var ICONS = { 'fa-xmark': 'Close', 'fa-plus': 'Add', 'fa-minus': 'Remove', 'fa-bars': 'Menu', 'fa-rotate-right': 'Refresh', 'fa-rotate': 'Refresh', 'fa-pen-to-square': 'Edit', 'fa-paper-plane': 'Send', 'fa-list-check': 'Action Plan', 'fa-sun': 'Day or night mode', 'fa-trash': 'Delete' };
  function aria() {
    document.querySelectorAll('button').forEach(function (b) {
      if (b.getAttribute('aria-label') || (b.textContent || '').trim()) return;
      var i = b.querySelector('i'), lab = b.getAttribute('title') || '';
      if (!lab && i) Object.keys(ICONS).forEach(function (k) { if (!lab && i.classList.contains(k)) lab = ICONS[k]; });
      if (lab) b.setAttribute('aria-label', lab);
    });
    document.querySelectorAll('[onclick]:not(button):not(a):not(input):not(select):not(textarea):not(label):not([role]):not(.pm):not(.pm-h)').forEach(function (e) { e.setAttribute('role', 'button'); e.setAttribute('tabindex', '0'); });
    document.querySelectorAll('#app-main section').forEach(function (s) { if (!s.getAttribute('aria-label')) { var h = s.querySelector('h2'); if (h) { s.setAttribute('role', 'region'); s.setAttribute('aria-label', h.textContent.trim()); } } });
    var pb = $('progress-bar'); if (pb) { pb.setAttribute('role', 'progressbar'); pb.setAttribute('aria-valuemin', '0'); pb.setAttribute('aria-valuemax', '100'); pb.setAttribute('aria-valuenow', parseInt(pb.style.width, 10) || 0); pb.setAttribute('aria-label', 'Stage progress'); }
    var t = $('toast'); if (t) { t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); }
    var m = $('modal-container'); if (m) { m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-labelledby', 'modal-title'); }
    var d = $('drawer-menu'); if (d) d.setAttribute('aria-label', 'Main menu');
    var ap = $('adviser-panel'); if (ap) { ap.setAttribute('role', 'dialog'); ap.setAttribute('aria-label', 'Career Adviser chat'); }
    var cl = $('chat-log'); if (cl) { cl.setAttribute('role', 'log'); cl.setAttribute('aria-live', 'polite'); }
  }
  document.addEventListener('keydown', function (e) {
    var t = e.target, tag = (t.tagName || '').toUpperCase();
    if ((e.key === 'Enter' || e.key === ' ') && t.getAttribute && t.getAttribute('role') === 'button' && tag !== 'BUTTON' && !t.classList.contains('pm')) { e.preventDefault(); t.click(); return; }
    if (e.key === 'Escape') {
      var open = function (i) { var el = $(i); return el && !el.classList.contains('hidden'); };
      if (open('gl-pop')) window.glClose(); else if (open('modal-container')) window.closeCurrentModal(); else if (open('adviser-sheet')) window.closeAdviser(); else if (open('drawer-menu')) window.toggleDrawer();
      return;
    }
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && tag === 'INPUT' && t.closest && t.closest('#map-table-body')) {
      var td = t.closest('td'), tr = t.closest('tr'), col = td ? [].indexOf.call(tr.children, td) : 0, sib = e.key === 'ArrowUp' ? tr.previousElementSibling : tr.nextElementSibling;
      while (sib && sib.style.display === 'none') sib = e.key === 'ArrowUp' ? sib.previousElementSibling : sib.nextElementSibling;
      if (sib) { var nx = sib.children[col] && sib.children[col].querySelector('input,select'); if (nx) { e.preventDefault(); nx.focus(); if (nx.select) nx.select(); } }
      return;
    }
    if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && window.pwFlow) {
      var sec = document.querySelector('#app-main section:not(.hidden):not(.swipe-peek)'), f = sec && window.pwFlow[sec.id], to = f && (e.key === 'ArrowRight' ? f.n : f.p);
      if (to) { e.preventDefault(); goToStep(to, 0); }
    }
  });

  /* =============================================================== page hook */
  function onPage(id) {
    cur = id;
    var f = lsGet('pw_flags', {}), v = f.v || {};
    if (id === 'step-map-pyramid') { v.pyramid = 1; renderPyramid(); }
    if (id.indexOf('strat-') === 0) { v[id.slice(6)] = 1; renderChecklist(id.slice(6)); }
    f.v = v; lsSet('pw_flags', f);
    if (id === 'step-map-builder') { renderCP(); }
    if (id === 'step-lab') renderLab();
    if (id === 'step-cheat') renderCheat();
    if (id === 'step-badges') renderBadges();
    if (id === 'step-welcome') { renderBadgeStrip(); if (!standalone() && (isIOS() || deferred)) showInstall(); }
    if (id === 'step-action-plan') window.renderMoves();
    glossPage(id);
    var lab = $('step-label'); if (lab && TIMES[id] && ORDER.indexOf(id.indexOf('strat-') === 0 ? 'strat-x' : id) >= 0) lab.textContent = lab.textContent.replace(/ · ~\d+ min left$/, '') + ' · ~' + timeLeft(id) + ' min left';
    var pb = $('progress-bar'); if (pb) pb.setAttribute('aria-valuenow', parseInt(pb.style.width, 10) || 0);
    aria(); checkBadges();
  }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); onPage(id); };

  var _pick = window.pickPosition;
  window.pickPosition = function (pos) { if (_pick) _pick(pos); try { var c = activeCP(); c.pos = pos; persist(); } catch (e) { } checkBadges(); };

  /* =============================================================== init */
  var GO = { plan: 'step-action-plan', cheat: 'step-cheat', journal: 'step-journal', lab: 'step-lab', map: 'step-map-builder', badges: 'step-badges' };
  function init() {
    cpInit(); renderMapTable(); renderCP(); applyCompanyContext();
    buildChecklists(); addTimeChips();
    var sq = $('step-square');
    if (sq && !sq.querySelector('.lab-link')) { var b = document.createElement('button'); b.className = 'lab-link w-full mb-4 py-2.5 rounded-xl bg-slate-900/70 border border-amber-500/40 text-amber-300 text-xs font-bold active:scale-95'; b.innerHTML = '🔬 Not sure? Check with the Position Grid'; b.setAttribute('onclick', "goToStep('step-lab',0)"); sq.insertBefore(b, sq.lastElementChild); }
    var tb = $('map-table-body'); if (tb) { tb.addEventListener('input', function () { edited(); saveMap(); }); tb.addEventListener('change', function () { edited(); saveMap(); }); }
    ['plan-position'].forEach(function (i) { var e = $(i); if (e) e.addEventListener('change', function () { var c = activeCP(); c.pos = e.value; persist(); }); });
    var gs = $('gl-search'); void gs;
    var q = new URLSearchParams(location.search).get('go'); if (q && GO[q]) setTimeout(function () { goToStep(GO[q], 0); }, 50); else if (q === 'adviser') setTimeout(function () { window.openAdviser(); }, 300);
    aria(); renderBadgeStrip(); setTimeout(function () { checkBadges(); }, 600);
    if (!standalone() && isIOS()) showInstall();
  }
  document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
})();
