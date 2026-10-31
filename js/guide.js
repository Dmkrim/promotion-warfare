/* Promotion Warfare - Animated Help (coach marks). State: localStorage pw_guide {on, seen:{}} */
(function () {
  'use strict';
  var KEY = 'pw_guide';
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY)); if (o && typeof o === 'object') { o.seen = o.seen || {}; if (typeof o.on !== 'boolean') o.on = true; return o; } } catch (e) {} return { on: true, seen: {} }; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} }
  var st = load();
  function go(id) { return '[onclick*="goToStep(\'' + id + '"]'; }
  function inS(sec, sel) { return '#' + sec + ' ' + sel; }

  function STRAT(sec, back) { return [
      { s: inS(sec, '[onclick*="openModal"]'), t: 'Tap a card to read the full idea with an example.' },
      { s: inS(sec, '[onclick*="addToPlan"]'), t: 'Tap Do it to add this move to your Action Plan.' },
      { s: inS(sec, go(back)), t: 'Go back and change your answer.' }
    ]; }
  var G = {
    'step-welcome': [
      { s: '#welcome-name', t: 'Type your name here. The app will greet you by name.' },
      { s: inS('step-welcome', go('step-start')), t: 'Start here! This opens the Battlefield. It is Step 1 of the plan.' },
      { s: inS('step-welcome', go('step-help')), t: 'Not sure how something works? Open the help page.' },
      { s: inS('step-welcome', '[onclick*="openAdviser"]'), t: 'Ask the Career Adviser any question. Tap here.' },
      { s: inS('step-welcome', go('step-journal')), t: 'Write your wins here. You can turn them into a raise pitch.' },
      { s: inS('step-welcome', go('step-profile')), t: 'Change your photo, theme, text size and this help in Profile.' },
      { s: '#adviser-fab', t: 'This button is always here. Tap it to chat with the Adviser.' },
      { s: '[onclick*="toggleDrawer"]', t: 'The Menu has every page of the app.' }
    ],
    'step-start': [
      { s: inS('step-start', go('step-map-builder')), t: 'First, build your Power Rank Table. List the people at your company.' },
      { s: inS('step-start', go('step-square')), t: 'Already did it? Tap here for Step 2.' }
    ],
    'step-map-builder': [
      { s: '#cp-select', t: 'Pick a company here, or add a new one with the buttons next to it.' },
      { s: '#persona-select', t: 'Quick-load an example. Good if you want to see how it works.' },
      { s: '#sort-rank', t: 'Sort the table by rank, name or position.' },
      { s: inS('step-map-builder', '[onclick*="addMapRow"]'), t: 'Add a new person to the table.' },
      { s: inS('step-map-builder', '[onclick*="generateVisualMap"]'), t: 'When you are ready, tap here to see your map.' }
    ],
    'step-map-pyramid': [
      { s: '#pyramid-container', t: 'This is your company pyramid. Hold the handle on a card and drag it to change a rank.' },
      { s: inS('step-map-pyramid', go('step-map-builder')), t: 'Tap Edit to go back and change the people.' },
      { s: inS('step-map-pyramid', go('step-square')), t: 'Next: Step 2, the Strategic Square.' }
    ],
    'step-square': [
      { s: inS('step-square', go('step-q1')), t: 'Answer 3 short questions. They show your best strategy.' }
    ],
    'step-q1': [
      { s: inS('step-q1', '[onclick*="pickPosition"]'), t: 'Are you the #1? If yes, tap here.' },
      { s: inS('step-q1', go('step-q2')), t: 'If not, tap here to go to the next question.' }
    ],
    'step-action-plan': [
      { s: '#plan-position', t: 'Pick your position. The plan changes to fit you.' },
      { s: '#ch-box', t: 'Add a workplace challenge to your plan, like a difficult manager.' },
      { s: '#custom-task', t: 'Write your own task here and add it.' },
      { s: '#power-bar', t: 'This bar grows when you finish tasks. Keep it growing!' },
      { s: inS('step-action-plan', '[onclick*="printDossier"]'), t: 'Print your plan, or export it.' }
    ],
    'step-examples': [
      { s: '#ex-btn-start', t: 'New at work? Tap here for starter-path stories.' },
      { s: '#ex-btn-grid', t: 'Switch between List and Grid view.' }
    ],
    'step-journal': [
      { s: '#win-input', t: 'Write one thing you did well. Keep it short.' },
      { s: inS('step-journal', '[onclick*="addWin"]'), t: 'Tap here to save the win.' },
      { s: '#pitch-box', t: 'Turn your wins into a short raise pitch here.' }
    ],
    'step-glossary': [
      { s: '#gl-search', t: 'Search a word here.' },
      { s: '#abbr-search', t: 'Search business short forms, like KPI or ROI.' }
    ],
    'step-profile': [
      { s: '#voice-panel', t: 'Voice: speak instead of typing, and hear answers read aloud.' },
      { s: '#avatar-file', t: 'Pick your photo here.' },
      { s: '#prof-name', t: 'Your name and position go here.' },
      { s: '#theme-dark-btn', t: 'Choose Dark or Light mode.' },
      { s: '#size-l', t: 'Make the text bigger or smaller.' },
      { s: '#guide-panel', t: 'This switch turns the animated help on or off.' },
      { s: '#backup-panel', t: 'Save a backup file so you never lose your data.' }
    ],
    'step-q2': [
      { s: inS('step-q2', '[onclick*="pickPosition"]'), t: 'Are you the #2? If yes, tap here.' },
      { s: inS('step-q2', go('step-q3')), t: 'If not, go to the last question.' }
    ],
    'step-q3': [
      { s: inS('step-q3', '[onclick*="pickPosition(\'flanker\')"]'), t: 'Do you have a special skill or area? Pick this.' },
      { s: inS('step-q3', '[onclick*="pickPosition(\'guerrilla\')"]'), t: 'Small and quick? Pick this one.' }
    ],
    'strat-leader': STRAT('strat-leader', 'step-q1'),
    'strat-challenger': STRAT('strat-challenger', 'step-q2'),
    'strat-flanker': STRAT('strat-flanker', 'step-q3'),
    'strat-guerrilla': STRAT('strat-guerrilla', 'step-q3'),
    'step-help': [{ s: '#help-body', t: 'Short answers on how to use each part of the app. Or ask the Adviser.' }],
    'step-about': [{ s: inS('step-about', go('step-privacy')), t: 'Read how your data is kept. It stays on your phone.' }],
    'step-privacy': [{ s: inS('step-privacy', 'h2'), t: 'Your data stays on your phone. This page explains it in plain words.' }],
    'step-salary': [
      { s: '#sal-mode', t: 'Choose: ask for a raise, or answer a job offer.' },
      { s: '#sal-lo', t: 'Add the market low and high for your job. Look them up on a salary website.' },
      { s: inS('step-salary', '[onclick*="salBuild"]'), t: 'Tap here. You get your ask, your lowest number and what to say.' }
    ],
    'step-meeting': [
      { s: '#mt-who', t: 'Who is the meeting with? Add the name and date.' },
      { s: inS('step-meeting', '[onclick*="mtItem(0)"]'), t: 'Tap the topics you want to talk about. You get a sentence to say.' },
      { s: '#mt-notes', t: 'Take notes here. Tap the microphone to speak.' },
      { s: '#mt-act', t: 'Add action items. Tap Plan to send one to your Action Plan.' }
    ],
    'step-boss': [
      { s: '#boss-who', t: 'Think of one real manager. Add the name if you want.' },
      { s: inS('step-boss', '[onclick*="bossStart"]'), t: 'Answer 6 short questions to learn the style.' }
    ],
    'step-feedback': [
      { s: '#fb-text', t: 'Write the feedback you got. Tap the microphone to speak it.' },
      { s: '#fb-kind', t: 'Choose praise or something to improve, who said it and the theme.' },
      { s: inS('step-feedback', '[onclick*="fbAdd"]'), t: 'Save it. When a theme repeats, the app shows it.' }
    ],
    'step-tools': [
      { s: inS('step-tools', go('step-cv')), t: 'Turn your wins into CV lines.' },
      { s: inS('step-tools', go('step-star')), t: 'Practice interview answers with the STAR method.' },
      { s: inS('step-tools', go('step-goals')), t: 'Set goals and track your progress.' },
      { s: inS('step-tools', go('step-salary')), t: 'Plan your salary talk.' },
      { s: inS('step-tools', go('step-meeting')), t: 'Plan your 1:1 meetings.' },
      { s: inS('step-tools', go('step-boss')), t: 'Learn your boss style.' },
      { s: inS('step-tools', go('step-feedback')), t: 'Keep your feedback in one place.' }
    ],
    'step-quiz': [{ s: '#quiz-body', t: 'Pick a quiz or flashcards. Your streak grows each day.' }],
    'step-phrase': [{ s: '#phrase-body', t: 'Search a situation. Tap a phrase to copy it.' }],
    'step-cv': [{ s: '#cv-body', t: 'Pick your wins, then tap Build. Copy the result.' }],
    'step-star': [{ s: '#star-body', t: 'Fill in the 4 parts. The app builds your story.' }],
    'step-goals': [{ s: '#goals-body', t: 'Add a goal, then use + to track progress.' }],
    'step-lab': [
      { s: '#lab-vis', t: 'Move the sliders to test a strategy.' },
      { s: '#wi-select', t: 'Pick a "what if" situation to see the result.' }
    ],
    'step-cheat': [{ s: '#cheat-search', t: 'Search a quick tip. Tap a chip to filter.' }],
    'step-badges': [{ s: '#badge-grid', t: 'Badges you earn are bright. Grey ones are still locked.' }]
  };

  var cur = null, steps = [], idx = 0, ov = null;
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; }
  function visible(e) { if (!e) return false; var r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 && e.offsetParent !== null; }
  function currentPage() { var s = document.querySelector('main section:not(.hidden)'); return s ? s.id : null; }

  function css() {
    if (document.getElementById('guide-css')) return;
    var c = document.createElement('style'); c.id = 'guide-css';
    c.textContent = '#gd-ov{position:fixed;inset:0;z-index:9000}#gd-ring{position:fixed;border:3px solid #fbbf24;border-radius:14px;box-shadow:0 0 0 9999px rgba(2,6,23,.72);transition:all .3s;pointer-events:none;animation:gdp 1.4s ease-in-out infinite}' +
      '@keyframes gdp{0%,100%{border-color:#fbbf24}50%{border-color:#fff}}#gd-arrow{position:fixed;font-size:30px;line-height:1;color:#fbbf24;pointer-events:none;z-index:9002;text-shadow:0 2px 6px #000;transition:all .3s}' +
      '#gd-arrow.dn{animation:gdd .8s ease-in-out infinite}#gd-arrow.up{animation:gdu .8s ease-in-out infinite}@keyframes gdd{50%{transform:translateY(8px)}}@keyframes gdu{50%{transform:translateY(-8px)}}' +
      '#gd-tip{position:fixed;left:12px;right:12px;max-width:340px;margin:0 auto;z-index:9003;background:#1e293b;color:#f1f5f9;border:1px solid #f59e0b;border-radius:16px;padding:12px 14px;box-shadow:0 10px 30px rgba(0,0,0,.6);font-size:14px;line-height:1.35}' +
      '#gd-tip .gb{display:flex;gap:6px;margin-top:10px;align-items:center;flex-wrap:wrap}#gd-tip button{border:0;border-radius:10px;padding:8px 12px;font-weight:700;font-size:12px;cursor:pointer}' +
      '.gd-n{background:#f59e0b;color:#111}.gd-s{background:#334155;color:#e2e8f0}.gd-x{background:transparent;color:#94a3b8;text-decoration:underline;margin-left:auto}' +
      '#gd-help{position:fixed;left:14px;bottom:20px;z-index:40;width:42px;height:42px;border-radius:50%;border:2px solid #f59e0b;background:#1e293b;color:#fbbf24;font-weight:800;font-size:18px;box-shadow:0 4px 12px rgba(0,0,0,.5)}' +
      '.gd-sw{position:relative;width:52px;height:30px;border-radius:15px;background:#475569;border:0;flex-shrink:0;transition:background .2s}.gd-sw[aria-checked=true]{background:#10b981}.gd-sw i{position:absolute;top:3px;left:3px;width:24px;height:24px;border-radius:50%;background:#fff;transition:left .2s}.gd-sw[aria-checked=true] i{left:25px}' +
      '@media (prefers-reduced-motion:reduce){#gd-ring,#gd-arrow{animation:none!important}#gd-ring,#gd-arrow{transition:none}}';
    document.head.appendChild(c);
  }

  function close(markSeen) {
    if (ov) { ov.remove(); ov = null; }
    ['gd-ring', 'gd-arrow', 'gd-tip'].forEach(function (i) { var e = document.getElementById(i); if (e) e.remove(); });
    window.removeEventListener('resize', place);
    if (markSeen && cur) { st.seen[cur] = 1; save(); }
    steps = []; idx = 0;
    updateBtn();
  }
  function build(page) {
    var list = (G[page] || []).filter(function (x) { var e = document.querySelector(x.s); return e && visible(e); });
    return list;
  }
  function place() {
    if (!steps.length) return;
    var x = steps[idx], t = document.querySelector(x.s); if (!t) return;
    var rr = t.getBoundingClientRect(), pad = 5, vh = window.innerHeight, r = { left: rr.left, right: rr.right, width: rr.width, top: rr.top, height: rr.height, bottom: rr.bottom };
    if (r.height > vh * 0.4) { r.top = Math.max(rr.top, 70); r.height = Math.min(rr.bottom - r.top, 150); r.bottom = r.top + r.height; }
    var ring = document.getElementById('gd-ring'), ar = document.getElementById('gd-arrow'), tip = document.getElementById('gd-tip');
    ring.style.left = (r.left - pad) + 'px'; ring.style.top = (r.top - pad) + 'px'; ring.style.width = (r.width + pad * 2) + 'px'; ring.style.height = (r.height + pad * 2) + 'px';
    var below = r.top + r.height / 2 < vh * 0.5; // target in top half -> tip goes below
    var cx = Math.min(Math.max(r.left + r.width / 2 - 15, 8), window.innerWidth - 38);
    if (below) {
      ar.textContent = '⬆'; ar.className = 'up'; ar.style.left = cx + 'px'; ar.style.top = (r.bottom + pad + 2) + 'px';
      tip.style.top = (r.bottom + pad + 40) + 'px'; tip.style.bottom = 'auto';
    } else {
      ar.textContent = '⬇'; ar.className = 'dn'; ar.style.left = cx + 'px'; ar.style.top = (r.top - pad - 36) + 'px';
      tip.style.bottom = (vh - r.top + pad + 40) + 'px'; tip.style.top = 'auto';
    }
  }
  function show() {
    var x = steps[idx], t = document.querySelector(x.s);
    if (!t || !visible(t)) { next(); return; }
    try { t.scrollIntoView({ block: (t.getBoundingClientRect().height > window.innerHeight * 0.4 ? 'start' : 'center'), behavior: 'auto' }); if (t.getBoundingClientRect().height > window.innerHeight * 0.4) window.scrollBy(0, -90); } catch (e) {}
    var tip = document.getElementById('gd-tip');
    tip.innerHTML = '<div style="font-size:11px;color:#fbbf24;font-weight:700;margin-bottom:4px">Tip ' + (idx + 1) + ' of ' + steps.length + '</div><div>' + x.t + '</div>' +
      '<div class="gb"><button class="gd-n" id="gd-next">' + (idx === steps.length - 1 ? 'Got it' : 'Next') + '</button><button class="gd-s" id="gd-skip">Skip</button><button class="gd-x" id="gd-off">Turn off help</button></div>';
    document.getElementById('gd-next').onclick = next;
    document.getElementById('gd-skip').onclick = function () { close(true); };
    document.getElementById('gd-off').onclick = function () { st.on = false; save(); close(true); renderPanel(); if (window.showToast) showToast('Animated help is OFF. Turn it on in Profile.'); };
    setTimeout(place, 60);
  }
  function next() { idx++; if (idx >= steps.length) { close(true); return; } show(); }

  function start(page, force) {
    page = page || currentPage();
    if (!page || !G[page]) return false;
    if (ov) close(false);
    css();
    var list = build(page);
    if (!list.length) return false;
    cur = page; steps = list; idx = 0;
    ov = el('div'); ov.id = 'gd-ov';
    ov.addEventListener('click', function (e) { e.stopPropagation(); });
    var ring = el('div'); ring.id = 'gd-ring'; var ar = el('div'); ar.id = 'gd-arrow'; var tip = el('div'); tip.id = 'gd-tip';
    tip.setAttribute('role', 'dialog'); tip.setAttribute('aria-live', 'polite');
    document.body.appendChild(ov); document.body.appendChild(ring); document.body.appendChild(ar); document.body.appendChild(tip);
    window.addEventListener('resize', place);
    show(); return true;
  }

  function updateBtn() {
    var b = document.getElementById('gd-help'), p = currentPage();
    if (!st.on || !p || !G[p] || ov) { if (b) b.style.display = 'none'; return; }
    css();
    if (!b) { b = el('button', '', '?'); b.id = 'gd-help'; b.setAttribute('aria-label', 'Show help for this page'); b.title = 'Help for this page'; b.onclick = function () { start(currentPage(), true); }; document.body.appendChild(b); }
    b.style.display = 'block';
  }

  function renderPanel() {
    var host = document.getElementById('guide-panel');
    if (!host) {
      var bp = document.getElementById('backup-panel'); if (!bp) return;
      host = el('div', 'p-3 rounded-2xl bg-slate-900/60 border border-amber-500/30 mb-3'); host.id = 'guide-panel';
      bp.parentNode.insertBefore(host, bp);
    }
    host.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="text-xs font-bold text-amber-300">❓ Animated help</div><div class="text-[11px] text-slate-400 leading-snug mt-1">Short tips with arrows on each page. Tap the ? button to see them again.</div></div>' +
      '<button type="button" id="gd-sw" class="gd-sw" role="switch" aria-label="Animated help" aria-checked="' + st.on + '"><i></i></button></div>' +
      '<button type="button" id="gd-replay" class="mt-3 w-full py-2 rounded-xl bg-slate-700 text-slate-100 text-[11px] font-bold">🔁 Show all tips again</button>';
    css();
    document.getElementById('gd-sw').onclick = function () { st.on = !st.on; save(); renderPanel(); updateBtn(); if (window.showToast) showToast(st.on ? 'Animated help is ON' : 'Animated help is OFF'); };
    document.getElementById('gd-replay').onclick = function () { st.seen = {}; st.on = true; save(); renderPanel(); updateBtn(); if (window.showToast) showToast('Tips will show again on each page'); };
  }

  function onPage(id) {
    if (ov) close(false);
    renderPanel(); updateBtn();
    if (st.on && G[id] && !st.seen[id]) setTimeout(function () { if (currentPage() === id && st.on && !st.seen[id] && !ov) { start(id); } }, 700);
  }
  var _go = window.goToStep;
  if (typeof _go === 'function') window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); try { onPage(id); } catch (e) { console.error(e); } };
  window.PWGuide = { start: start, state: function () { return st; }, G: G };
  function init() { renderPanel(); var p = currentPage(); if (p) onPage(p); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 400); }); else setTimeout(init, 400);
})();
