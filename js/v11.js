/* Promotion Warfare V11: icon animator (emoji + Font Awesome), zoom helper, Adviser multi-answer search. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ================================================= 1. animate every icon */
  var EMO = /^(\s*)((?:\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic}|[\u{1F3FB}-\u{1F3FF}])*)+)/u;
  var SKIP = 'script,style,textarea,option,select,input,svg,title,#chat-log,.selectable,[data-noicon],.pw-ico,#gd-tip,#gd-help,#toast,#fx-layer,.gm-chip';
  function hashOf(str) { var h = 0; for (var i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
  function delay() { return '-' + (Math.random() * 2.6).toFixed(2) + 's'; }
  function wrapText(node) {
    var t = node.nodeValue; if (!t || t.length < 1) return;
    var m = EMO.exec(t); if (!m) return;
    var p = node.parentNode; if (!p || (p.closest && p.closest(SKIP))) return;
    var span = document.createElement('span'); span.className = 'pw-ico pw-a' + (hashOf(m[2]) % 6); span.style.animationDelay = delay(); span.textContent = m[2];
    var rest = t.slice(m[0].length);
    var frag = document.createDocumentFragment(); if (m[1]) frag.appendChild(document.createTextNode(m[1])); frag.appendChild(span); if (rest) frag.appendChild(document.createTextNode(rest));
    p.replaceChild(frag, node);
  }
  function fa(el) {
    if (el.classList.contains('pw-ico') || el.closest('.ai,svg,[data-noicon]') || /fa-(spin|beat|bounce|fade|flip|shake|pulse)/.test(el.className)) return;
    var c = el.className, k;
    if (/fa-arrow-left|fa-chevron-left|fa-angle-left/.test(c)) k = 'pw-nl'; else if (/fa-arrow-right|fa-chevron-right|fa-angle-right/.test(c)) k = 'pw-nr'; else if (/fa-paper-plane/.test(c)) k = 'pw-fly'; else k = 'pw-a' + (hashOf(c) % 6);
    el.classList.add('pw-ico', k); el.style.animationDelay = delay();
  }
  function scan(root) {
    if (!root) return;
    if (root.nodeType === 3) { wrapText(root); return; }
    if (root.nodeType !== 1 || (root.closest && root.closest(SKIP) && root !== document.body)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) { if (EMO.test(n.nodeValue)) nodes.push(n); }
    nodes.forEach(wrapText);
    var icons = root.querySelectorAll ? root.querySelectorAll('i[class*="fa-"]') : [];
    for (var i = 0; i < icons.length; i++) fa(icons[i]);
    if (root.matches && root.matches('i[class*="fa-"]')) fa(root);
  }
  var queue = [], sched = false;
  function flush() { sched = false; var q = queue; queue = []; q.forEach(function (n) { try { if (n.isConnected !== false) scan(n); } catch (e) { } }); }
  function enqueue(n) { queue.push(n); if (!sched) { sched = true; (window.requestAnimationFrame || setTimeout)(flush); } }
  function initIcons() {
    scan(document.body);
    if (window.MutationObserver) new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) { var a = muts[i].addedNodes; for (var j = 0; j < a.length; j++) { var n = a[j]; if (n.nodeType === 1 && n.classList && n.classList.contains('pw-ico')) continue; if (n.nodeType === 1 || n.nodeType === 3) enqueue(n); } }
    }).observe(document.body, { childList: true, subtree: true });
  }

  /* ================================================= 2. zoom helper */
  function initZoom() {
    var vv = window.visualViewport; if (!vv) return;
    var f = function () { var z = vv.scale > 1.02; document.documentElement.classList.toggle('pw-zoomed', z); var m = $('app-main'); if (m) m.style.touchAction = z ? 'auto' : 'pan-y pinch-zoom'; };
    vv.addEventListener('resize', f); vv.addEventListener('scroll', f); f();
  }

  /* ================================================= 3. Adviser: more answers from all topics */
  var STOP = {}; ('a an and are as at be but by can could do does for from had has have how i if in into is it its me my of on or our so than that the their them then there these they this to up us was we were what when where which who why will with you your about please tell give show want need get gets make like just also any some more very can\'t cant dont don\'t should would might may been being did done').split(/\s+/).forEach(function (w) { STOP[w] = 1; });
  function stem(w) { if (w.length > 5 && /ing$/.test(w)) return w.slice(0, -3); if (w.length > 4 && /ed$/.test(w)) return w.slice(0, -2); if (w.length > 4 && /es$/.test(w)) return w.slice(0, -2); if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) return w.slice(0, -1); return w; }
  function toks(text) { var out = {}, a = String(text || '').toLowerCase().replace(/[^a-z0-9&]+/g, ' ').split(' '); for (var i = 0; i < a.length; i++) { var w = a[i]; if (!w || w.length < 2 || STOP[w]) continue; out[stem(w).slice(0, 6)] = 1; } return out; }
  function strip(h) { return String(h || '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim(); }
  var DOCS = null;
  var PAGE_NAME = { 'step-welcome': 'Welcome', 'step-help': 'How to use this App', 'step-glossary': 'Glossary', 'step-action-plan': 'Action Plan', 'step-examples': 'Examples', 'step-journal': 'Wins Journal', 'step-cheat': 'Cheat Sheet', 'step-lab': 'Strategy Lab', 'step-quiz': 'Quiz', 'step-phrase': 'Phrasebook', 'step-game': 'Office Politics Game', 'step-tools': 'Career Tools', 'step-profile': 'Profile', 'step-about': 'About' };
  function addDoc(t, x, go) { t = strip(t); x = strip(x); if (!t && !x) return; if (!t) t = x.slice(0, 40); DOCS.push({ t: t, x: x, go: go || '', tt: toks(t), ft: toks(t + ' ' + x) }); }
  function collect(label, v, go) {
    if (v == null) return;
    if (typeof v === 'string') { addDoc(label, v, go); return; }
    if (Array.isArray(v)) {
      var allStr = v.every(function (e) { return typeof e === 'string'; });
      if (allStr && v.length && v.join('').length < 400) { addDoc(label, v.join(' '), go); return; }
      v.forEach(function (e) {
        if (typeof e === 'string') { addDoc(label, e, go); return; }
        if (Array.isArray(e)) { var s = []; (function f(a) { a.forEach(function (z) { if (Array.isArray(z)) f(z); else if (typeof z === 'string') s.push(z); }); })(e); if (s.length) addDoc(s[0].length < 90 ? s[0] : label, s.slice(s[0].length < 90 ? 1 : 0).join(' '), go); return; }
        if (e && typeof e === 'object') { var vals = Object.keys(e).map(function (k) { return typeof e[k] === 'string' ? e[k] : ''; }).filter(Boolean); if (vals.length) addDoc(e.n || e.t || e.name || e.head || vals[0].slice(0, 60), vals.join(' '), go); }
      });
      return;
    }
    if (typeof v === 'object') Object.keys(v).forEach(function (k) { collect(label + ' ' + k, v[k], go); });
  }
  function build() {
    DOCS = [];
    var w = window;
    try {
      collect('Cheat sheet', (w.PW6 || {}).CHEAT, 'step-cheat'); collect('Meeting tips', (w.PW6 || {}).CHEAT_MEET, 'step-cheat'); collect('Review tips', (w.PW6 || {}).CHEAT_REVIEW, 'step-cheat');
      collect('Advice', (w.PW6 || {}).ADVICE, 'step-start'); collect('Situation', (w.PW6 || {}).SCENARIOS, 'step-lab');
      collect('Challenge', (w.PW7 || {}).CHALLENGES, 'step-action-plan'); collect('Weekly mission', (w.PW7 || {}).MISSION, 'step-welcome'); collect('Story', (w.PW7 || {}).STORIES, 'step-examples');
      (((w.PW7 || {}).ABBR) || []).forEach(function (a) { addDoc(a[0] + ' ' + a[1], a[2], 'step-glossary'); });
      collect('Glossary', (w.PW6 || {}).GLOSS_EXTRA, 'step-glossary'); collect('Glossary', (w.PW7 || {}).GLOSS_EXTRA, 'step-glossary'); collect('Glossary', (w.PW8 || {}).GLOSS_EXTRA, 'step-glossary');
      collect('Daily lesson', (w.PW8 || {}).DAILY, 'step-welcome'); collect('Phrase', (w.PW8 || {}).PHRASES, 'step-phrase');
      (((w.PW8 || {}).QUIZ) || []).forEach(function (q) { addDoc(q[0], (q[1] || '') + '. ' + (q[3] || ''), 'step-quiz'); });
      var T = w.PW_TIPS || {}; Object.keys(T).forEach(function (p) { (T[p] || []).forEach(function (t) { addDoc(t[0], t[1], 'step-action-plan'); }); });
      (((w.PW10 || {}).GAME) || []).forEach(function (g) { addDoc(g[0], g[3] + ' ' + g[4], 'step-game'); });
      (w.PW_HELP || []).forEach(function (h) { addDoc(h[1], h[2], 'step-help'); });
      (w.PW_HOWTO || []).forEach(function (h) { addDoc(h[1], h[3], h[4] && /^step-/.test(h[4]) ? h[4] : 'step-help'); });
      var secs = document.querySelectorAll('main section');
      for (var i = 0; i < secs.length; i++) {
        var sec = secs[i], hd = sec.querySelector('h2'), title = hd ? hd.textContent : sec.id, els = sec.querySelectorAll('p,li,h3,label');
        for (var j = 0; j < els.length; j++) { var tx = (els[j].textContent || '').replace(/\s+/g, ' ').trim(); if (tx.length >= 30 && tx.length <= 600) addDoc(title, tx, sec.id); }
      }
    } catch (e) { console.error(e); }
  }
  function search(text, primaryText) {
    if (!DOCS) build();
    var q = toks(text), qk = Object.keys(q); if (!qk.length) return [];
    var need = qk.length === 1 ? 1 : Math.max(2, Math.ceil(qk.length * 0.6)), res = [], pt = String(primaryText || '').toLowerCase();
    for (var i = 0; i < DOCS.length; i++) {
      var d = DOCS[i], m = 0, tm = 0;
      for (var k = 0; k < qk.length; k++) { if (d.ft[qk[k]]) m++; if (d.tt[qk[k]]) tm++; }
      if (m < need && !(qk.length === 2 && m === 1 && tm === 1)) continue;
      var sc = m * 2 + tm * 3 - Math.min(2, (d.x.length / 400));
      res.push({ d: d, s: sc });
    }
    res.sort(function (a, b) { return b.s - a.s; });
    var out = [], seen = {}, top = res.length ? res[0].s : 0;
    for (var r = 0; r < res.length && out.length < 3; r++) {
      var d2 = res[r].d, key = d2.t.toLowerCase() + '|' + d2.x.slice(0, 30).toLowerCase();
      if (seen[key] || res[r].s < top * 0.55) continue;
      if (pt && (pt.indexOf(d2.t.toLowerCase()) >= 0 && d2.t.length > 6 || (d2.x.length > 30 && pt.indexOf(d2.x.slice(0, 40).toLowerCase()) >= 0))) continue;
      seen[key] = 1; out.push(d2);
    }
    return out;
  }
  function snippet(x) { x = String(x || ''); if (x.length <= 190) return x; var cut = x.slice(0, 190), i = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; ')); return (i > 80 ? cut.slice(0, i + 1) : cut.replace(/\s+\S*$/, '') + '…'); }
  window.PW11 = {
    search: search,
    resetIndex: function () { DOCS = null; },
    extend: function (text, res) {
      if (!res || !text) return res;
      var found = search(text, res.text);
      if (!found.length) return res;
      var lines = found.map(function (d) { return '• **' + d.t.slice(0, 70) + '**: ' + snippet(d.x || d.t); });
      res.text = res.text + '\n\n**More from the app:**\n' + lines.join('\n');
      res.chips = (res.chips || []).slice();
      var added = {};
      found.forEach(function (d) { if (d.go && !added[d.go] && res.chips.length < 7) { added[d.go] = 1; res.chips.push({ label: '📖 ' + (PAGE_NAME[d.go] || 'Open page'), go: d.go }); } });
      return res;
    }
  };

  function init() { try { initIcons(); } catch (e) { console.error(e); } try { initZoom(); } catch (e) { console.error(e); } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 350); }); else setTimeout(init, 350);
})();
