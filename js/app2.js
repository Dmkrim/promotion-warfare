/* Promotion Warfare V04 - extra app logic (navigation, profile, pages, adviser UI) */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function profile() { return PWAvatars.load(); }
  function saveProfile(p) { PWAvatars.save(p); refreshAvatars(); }

  /* ---------- theme & text size ---------- */
  function applyTheme(t) {
    var light = t === 'light';
    document.body.classList.toggle('light', light);
    document.body.classList.toggle('dark', !light);
    document.body.style.backgroundColor = light ? '#f1f5f9' : '#0f172a';
    var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', light ? '#f1f5f9' : '#0f172a');
    var icon = $('theme-icon'); if (icon) icon.className = light ? 'fa-solid fa-moon text-sm' : 'fa-solid fa-sun text-sm text-amber-400';
    var d = $('theme-dark-btn'), l = $('theme-light-btn');
    if (d && l) { d.classList.toggle('sel-on', !light); l.classList.toggle('sel-on', light); }
  }
  function setTheme(t) { lsSet('pw_theme', t); applyTheme(t); }
  window.toggleTheme = function () { setTheme(lsGet('pw_theme', 'dark') === 'light' ? 'dark' : 'light'); };
  window.setTheme = setTheme;
  function applySize(s) {
    document.documentElement.style.fontSize = ({ s: '14px', m: '16px', l: '18px' }[s] || '16px');
    ['s', 'm', 'l'].forEach(function (k) { var b = $('size-' + k); if (b) b.classList.toggle('sel-on', k === s); });
  }
  window.setSize = function (s) { lsSet('pw_size', s); applySize(s); };

  /* ---------- overlays + history (phone Back button) ---------- */
  var OV = { modal: 'modal-container', drawer: 'drawer-menu', chat: 'adviser-sheet' };
  var stack = [];
  function pushOverlay(n) { if (stack.indexOf(n) < 0) { stack.push(n); try { history.pushState({ o: n }, ''); } catch (e) { } } }
  function closeOverlay(n, noHistory) {
    var el = $(OV[n]); if (el) el.classList.add('hidden');
    var i = stack.indexOf(n);
    if (i >= 0) {
      stack.splice(i, 1);
      if (!noHistory && history.state && history.state.o === n) { try { history.back(); } catch (e) { } }
    }
  }
  window.toggleDrawer = function () {
    var el = $('drawer-menu'); if (!el) return;
    if (el.classList.contains('hidden')) { buildDrawer(); el.classList.remove('hidden'); pushOverlay('drawer'); } else closeOverlay('drawer');
  };
  var _openModal = window.openModal;
  window.openModal = function (id) { if (_openModal) _openModal(id); pushOverlay('modal'); };
  window.closeCurrentModal = function () { closeOverlay('modal'); };
  window.openAdviser = function () {
    var el = $('adviser-sheet'); if (!el) return;
    el.classList.remove('hidden'); pushOverlay('chat'); fitSheet(); renderChat();
    var f = $('adviser-fab'); if (f) f.classList.add('hidden');
    setTimeout(function () { var i = $('chat-input'); if (i && window.innerWidth > 700) i.focus(); }, 150);
  };
  window.closeAdviser = function () { closeOverlay('chat'); var f = $('adviser-fab'); if (f) f.classList.remove('hidden'); };
  function fitSheet() {
    var sh = $('adviser-panel'); if (!sh) return;
    var vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight);
    sh.style.height = Math.min(vh - 12, Math.round(window.innerHeight * 0.9)) + 'px';
  }
  if (window.visualViewport) window.visualViewport.addEventListener('resize', function () { fitSheet(); var l = $('chat-log'); if (l) l.scrollTop = l.scrollHeight; });

  /* ---------- navigation ---------- */
  var current = 'step-welcome';
  var STAGE_PAGES = { 'step-start': 1, 'step-map-builder': 1.5, 'step-map-pyramid': 1.8, 'step-square': 2, 'step-q1': 3, 'step-q2': 3.5, 'step-q3': 4, 'strat-leader': 5, 'strat-challenger': 5, 'strat-flanker': 5, 'strat-guerrilla': 5 };
  window.goToStep = function (stepId, progressNum, fromPop) {
    document.querySelectorAll('main section').forEach(function (s) { s.classList.add('hidden'); });
    var target = $(stepId);
    if (target) { target.classList.remove('hidden'); try { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } }
    var pc = $('progress-container');
    var isStage = STAGE_PAGES[stepId] !== undefined;
    if (pc) pc.classList.toggle('hidden', !isStage);
    if (isStage) {
      var pn = STAGE_PAGES[stepId];
      var pct = Math.min(Math.round((pn / 5) * 100), 100);
      var bar = $('progress-bar'), lab = $('step-label'), pt = $('step-percentage');
      if (bar) bar.style.width = pct + '%'; if (lab) lab.innerText = 'Stage ' + Math.floor(pn) + ' of 5'; if (pt) pt.innerText = pct + '% Completed';
    }
    if (stepId === 'step-action-plan') { if (window.renderPlanMap) window.renderPlanMap(); if (window.renderMoves) window.renderMoves(); }
    var hooks = { 'step-welcome': renderWelcome, 'step-examples': renderExamples, 'step-journal': renderWins, 'step-glossary': renderGlossary, 'step-profile': renderProfile, 'step-map-pyramid': drawPyramid, 'step-about': renderAbout };
    if (hooks[stepId]) { try { hooks[stepId](); } catch (e) { console.error(e); } }
    if (!fromPop && stepId !== current) { try { history.pushState({ s: stepId, p: progressNum }, ''); } catch (e) { } }
    current = stepId;
    var ap = $('app-main'); if (ap && ap.scrollTo) { /* keep */ }
    window.scrollTo(0, 0);
  };
  window.addEventListener('popstate', function (e) {
    if (stack.length) { var n = stack.pop(); var el = $(OV[n]); if (el) el.classList.add('hidden'); if (n === 'chat') { var f = $('adviser-fab'); if (f) f.classList.remove('hidden'); } return; }
    var st = e.state;
    if (st && st.o) { try { history.back(); } catch (x) { } return; }
    if (st && st.s) { if (st.s !== current) window.goToStep(st.s, st.p, true); }
  });

  var NAV = [
    { g: 'Home', items: [['🏠', 'Welcome', 'step-welcome']] },
    { g: 'Learn the Strategy', items: [['🏰', 'Step 1: Battlefield', 'step-start'], ['🗺️', 'Company Power Map', 'step-map-builder'], ['👑', 'Power Pyramid (drawing)', '#pyramid'], ['📐', 'Step 2: Strategic Square', 'step-square'], ['🛡️', 'Defensive (Leader)', 'strat-leader'], ['⚔️', 'Offensive (Challenger)', 'strat-challenger'], ['🚀', 'Flanking (No. 3)', 'strat-flanker'], ['🥷', 'Guerrilla (Underdog)', 'strat-guerrilla']] },
    { g: 'My Tools', items: [['📋', 'Interactive Action Plan', 'step-action-plan'], ['🤖', 'Career Adviser (chat)', '#adviser'], ['🔬', 'Strategy Lab (grid & what-if)', 'step-lab'], ['🗂️', 'Cheat Sheet', 'step-cheat'], ['📓', 'Wins Journal & Raise Pitch', 'step-journal'], ['📚', 'Glossary', 'step-glossary'], ['🏅', 'My Badges', 'step-badges']] },
    { g: 'Share & Install', items: [['🖨️', 'Print / Save as PDF', '#print'], ['📄', 'Download CSV', '#csv'], ['💾', 'Backup & Restore', '#backup'], ['📲', 'Install the app', '#install']] },
    { g: 'Stories & Help', items: [['🏆', 'Examples of Promotions', 'step-examples'], ['📖', 'How to use this App', 'step-help']] },
    { g: 'Me & the App', items: [['👤', 'Profile and Settings', 'step-profile'], ['ℹ️', 'About this App', 'step-about'], ['🔒', 'Privacy Policy', 'step-privacy']] }
  ];
  window.navTo = function (target) {
    closeOverlay('drawer', true);
    if (target === '#adviser') { window.openAdviser(); return; }
    if (target === '#print') { if (window.printDossier) window.printDossier(); return; }
    if (target === '#csv') { if (window.exportCSV) window.exportCSV(); return; }
    if (target === '#install') { if (window.pwInstall) window.pwInstall(); return; }
    if (target === '#pyramid') { if (window.generateVisualMap) window.generateVisualMap(); return; }
    window.goToStep(target, STAGE_PAGES[target] || 0);
  };
  function buildDrawer() {
    var box = $('drawer-nav'); if (!box) return;
    var p = profile();
    var html = '<div class="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-slate-800/70 border border-slate-700/60 cursor-pointer" onclick="navTo(\'step-profile\')">' +
      '<div class="av-ring w-12 h-12">' + PWAvatars.html(48, p) + '</div><div class="min-w-0"><p class="text-sm font-bold text-white truncate">' + esc(p.name || 'Your Profile') + '</p><p class="text-[11px] text-amber-400">Tap to edit profile &amp; settings</p></div></div>';
    NAV.forEach(function (g) {
      html += '<p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2 pt-3 pb-1">' + esc(g.g) + '</p>';
      g.items.forEach(function (it) {
        var active = it[2] === current ? ' ring-1 ring-amber-400/60' : '';
        html += '<button onclick="navTo(\'' + it[2] + '\')" class="w-full p-2.5 mb-1 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-left text-xs font-semibold text-slate-200 flex items-center gap-3' + active + '"><span class="w-5 text-center text-base">' + it[0] + '</span>' + esc(it[1]) + '</button>';
      });
    });
    box.innerHTML = html;
    var v = $('drawer-ver'); if (v) v.innerText = 'Promotion Warfare System V05';
  }

  /* ---------- avatars in header ---------- */
  function refreshAvatars() {
    var p = profile();
    var h = $('hdr-avatar'); if (h) h.innerHTML = '<div class="av-ring w-9 h-9">' + PWAvatars.html(36, p) + '</div>';
    var b = $('prof-avatar-big'); if (b) b.innerHTML = PWAvatars.html(96, p);
    var w = $('welcome-avatar'); if (w) w.innerHTML = PWAvatars.html(64, p);
    document.querySelectorAll('.pw-me-av').forEach(function (el) { el.innerHTML = PWAvatars.html(28, p); });
  }
  window.pickPosition = function (pos) {
    var p = profile(); p.position = pos; PWAvatars.save(p);
    var sel = $('plan-position'); if (sel) { sel.value = pos; if (window.generateActionPlan) window.generateActionPlan(); }
  };

  /* ---------- welcome ---------- */
  function renderWelcome() {
    var p = profile();
    var g = $('welcome-greet'); if (g) g.innerText = p.name ? 'Welcome back, ' + p.name + '!' : 'Welcome!';
    var f = $('welcome-name-form'); if (f) f.classList.toggle('hidden', !!p.name);
    var tip = $('welcome-tip');
    if (tip && window.PW_BANK) {
      var d = new Date(), doy = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
      var c = PW_BANK.cards[(doy * 7) % PW_BANK.cards.length];
      tip.innerHTML = '<p class="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1">💡 Today\'s Move · ' + esc(c.t) + '</p><p class="text-xs text-slate-200 leading-relaxed">' + esc(c.s1) + ' <span class="text-slate-400">' + esc(c.tip) + '</span></p>' +
        '<button onclick="addMove(\'tip-' + esc(c.id) + '\', ' + esc(JSON.stringify(c.s1)).replace(/'/g, '&#39;') + ')" class="mt-2 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold active:scale-95"><i class="fa-solid fa-bolt"></i> Do it</button>';
    }
    refreshAvatars();
  }
  window.saveWelcomeName = function () {
    var i = $('welcome-name'); var v = i ? i.value.trim().slice(0, 30) : '';
    if (!v) return; var p = profile(); p.name = v; saveProfile(p); renderWelcome(); toast('Nice to meet you, ' + v + '!');
  };

  /* ---------- help page ---------- */
  var HELP = [
    ['🎯', 'What is this App?', 'Promotion Warfare is a simple guide for your career at a company. You will learn who has power, which strategy fits your position, and what small moves to do each week. Think of it like a game plan, played fairly and respectfully.'],
    ['🗺️', 'Step 1: Battlefield and Power Map', 'Open <b>Create the Map</b>. Type the names and job titles of people you work with and give each a rank (1 = top boss, 4 = base). Tap <b>Show the Map</b> to see the tiers, then tap <b>Draw it</b> to get a simple picture of your company pyramid. You can save or share the picture.'],
    ['📐', 'Step 2: Strategic Square', 'Answer 3 quick questions: Are you #1? Are you #2? Are you #3? Your answers lead you to one of four strategies: Defensive (Leader), Offensive (Challenger), Flanking (No. 3) or Guerrilla (Underdog).'],
    ['💡', '"Explain it" and "Do it" buttons', 'Every strategy card has rules. <b>Explain it</b> opens a simple explanation with 3 examples. <b>Do it</b> adds that rule as a move in your Action Plan. The button changes to "Added" so you know it is saved.'],
    ['🏢', 'Several companies, auto-save and examples', 'Everything you type in the Power Rank Table saves by itself. On the table page use <b>Company</b> to keep more than one workplace (for example Current Job and Dream Organization) and tap <b>Compare</b> to see how crowded each top is. <b>Quick-load an example</b> opens a ready-made story as a new company. You can also sort the table and filter it by name or position.'],
    ['🔬', 'Strategy Lab: grid and what-if', 'The <b>Position Grid</b> shows where you stand by visibility and influence, and checks it against your Strategic Square answer. <b>What-if</b> shows how your strategy changes if the boss leaves, you get promoted, a rival joins and more, with 3 moves for each case.'],
    ['🗂️', 'Cheat Sheet, checklists and badges', 'The <b>Cheat Sheet</b> gives the core rules of each strategy in one place, plus checklists for a hard meeting and a performance review. Each strategy page has a <b>rules checklist</b>. You unlock <b>badges</b> as you progress.'],
    ['🖨️', 'Print, PDF and CSV', 'On the Action Plan page tap <b>Print / Save as PDF</b>. In the print screen choose "Save as PDF". <b>Download CSV</b> gives a file for Excel. Each move can have a status, a due date and a priority flag.'],
    ['📋', 'Interactive Action Plan', 'Your plan shows your power map, your moves, a Power Level bar and a to-do list. Tick moves when done. You can also add your own moves or tap a quick idea. Your Power Level grows as you complete moves.'],
    ['🤖', 'The Career Adviser (chat bubble)', 'Tap the round <b>Adviser</b> bubble at the bottom. Ask in your own words, for example: "My boss never notices my work", "How do I ask for a raise?" or "I am new, where do I start?". Then follow up with short messages like "give me an example", "what should I say?", "what mistakes?" or "what next?". The Adviser remembers what you were talking about. If it does not know a topic, tap <b>Search the web</b> and save the result.'],
    ['📓', 'Wins Journal', 'Write down every achievement with the date. Before your review or when you ask for a raise, you will have real proof of your results. Then tap <b>Make my raise pitch</b> to turn your wins into a short text for your boss.'],
    ['🏆', 'Examples of Promotions', 'Read 12 learning stories about people who used the strategies. The "Starter path" button shows the stories for a first job. Switch between List and Grid view and tap a story to open it. The people in the stories are made-up characters created to teach the ideas.'],
    ['👤', 'Menu, Profile and Settings', 'Tap the ☰ button to open the Menu. It lists every page. In Profile and Settings you can choose your name, one of 50 avatars or upload your own photo, switch Day or Night mode and change text size.'],
    ['🌙', 'Day and Night mode', 'Night mode is the default. Use the sun or moon button at the top, or Profile and Settings, to switch.'],
    ['🌐', 'Learning new topics from the web', 'When you are online and the Adviser does not know a topic, it can search Wikipedia and show a short summary. Tap <b>Save to my data bank</b> to keep it for next time. You can also import a data bank update file in Profile and Settings.'],
    ['🔒', 'Your privacy', 'Everything you type stays on your phone. There is no account and no tracking. Read the full Privacy Policy from the Menu.'],
    ['🎤', 'Raise pitch', 'In the <b>Wins Journal</b> tap <b>Make my raise pitch</b>. Choose what it is for (raise, promotion, review or a short update), pick the time period and how many wins, and add what you are asking for. You get a written version and a version to say out loud. Edit it, then <b>Copy</b>, <b>Share</b> or <b>Print</b>.'],
    ['📅', 'Weekly mission and reminder', 'The Welcome page shows <b>This week\'s move</b>: a 12-week mission. Tap <b>I did it</b> to check in and build your 🔥 streak. Open <b>Weekly reminder</b> to add a repeating event to your phone calendar.'],
    ['💾', 'Backup and restore', 'In <b>Profile and Settings</b> tap <b>Export everything</b> to save one backup file. On a new phone tap <b>Import backup</b> and choose the file. The app also asks your phone to protect its storage.'],
    ['❓', 'Ask the Adviser how to use the app', 'You can ask the Adviser questions about the app itself, for example: "How to enlarge the text?", "How to change the profile picture?", "How do I print my plan?" or "How do I install the app?". It answers and can take you straight to the right page.'],
    ['✅', 'Best way to use it', '1) Make your map. 2) Find your strategy. 3) Tap Do it on 3 rules. 4) Do one move each week. 5) Write your wins. 6) Ask the Adviser when you are stuck.']
  ];
  function renderHelp() {
    var b = $('help-body'); if (!b) return;
    b.innerHTML = HELP.map(function (h, i) {
      return '<details class="rounded-2xl bg-slate-900/60 border border-slate-700/60 mb-2 overflow-hidden"' + (i === 0 ? ' open' : '') + '><summary class="cursor-pointer p-3 text-xs font-bold text-slate-100 flex items-center gap-2"><span class="text-base">' + h[0] + '</span>' + h[1] + '</summary><div class="px-3 pb-3 text-xs text-slate-300 leading-relaxed">' + h[2] + '</div></details>';
    }).join('');
  }

  /* ---------- stories ---------- */
  var STORIES = [
    { n: 'Dan', age: 19, job: 'Warehouse picker', s: 'guerrilla', g: 'm', k: 0, head: 'From picker to shift assistant in 8 months', res: 'Promoted to Shift Assistant',
      story: 'Dan was the newest person in a big warehouse and had no chance against the veterans. Nobody wanted to count pallets and update the weekly stock sheet, so he took it. He made it neat, on time and error-free. Soon the managers asked him for the numbers every Friday.',
      moves: ['Picked one boring task nobody wanted (small segment).', 'Stayed humble and thanked the team in every update.', 'Kept his CV ready, just in case.'], lesson: 'A small area you own completely can be your first step up.' },
    { n: 'Maya', age: 24, job: 'Customer support agent', s: 'challenger', g: 'f', k: 1, head: 'Won on one number: speed', res: 'Promoted to Team Lead',
      story: 'Maya was clearly number two behind a very experienced agent. She did not fight her everywhere. She noticed the boss cared about first reply time, so she focused only on that. In six weeks she cut her average from 9 to 4 minutes and showed a simple chart.',
      moves: ['Chose one decisive point: reply speed.', 'Tracked her numbers every day.', 'Showed results politely, without criticizing anyone.'], lesson: 'You do not need to beat the leader everywhere, only where it matters most.' },
    { n: 'Omar', age: 22, job: 'Junior accountant', s: 'flanker', g: 'm', k: 2, head: 'The quiet tool that opened a new role', res: 'Joined the Process Improvement team',
      story: 'Omar was the third-best in his team. Everyone competed for the same big clients. He noticed nobody owned the monthly reconciliation, which took two days by hand. He quietly built a spreadsheet that did it in two hours, tested it for a month and then showed it.',
      moves: ['Found uncontested territory.', 'Built a finished solution before telling anyone (surprise).', 'Taught a coworker to use it.'], lesson: 'Finished work in an empty area impresses more than ideas in a crowded one.' },
    { n: 'Rina', age: 31, job: 'Sales lead', s: 'leader', g: 'f', k: 3, head: 'Protecting the top and growing a successor', res: 'Became Regional Manager',
      story: 'Rina was the best salesperson and everyone was watching her. She kept notes on each key customer, fixed her own weak spots and trained a junior to run her routine reports. When a regional role opened, her manager knew that her team would be fine without her.',
      moves: ['Defended her territory with monthly check-ins.', 'Attacked her own weak spots first.', 'Trained a successor and shared knowledge.'], lesson: 'Leaders move up when they make themselves replaceable.' },
    { n: 'Leo', age: 20, job: 'Retail assistant', s: 'guerrilla', g: 'm', k: 4, head: 'The returns expert', res: 'Became Assistant Department Manager',
      story: 'Leo was new and quiet. The returns process was confusing and customers were often angry. He studied it, wrote a one-page guide and became the person everyone called. He never bragged and always shared credit, so coworkers were happy to support him when a better role opened.',
      moves: ['Owned a niche (returns).', 'Wrote a short guide so others could learn.', 'Picked his battles and stayed friendly.'], lesson: 'Be useful, be humble and let results speak.' },
    { n: 'Noa', age: 27, job: 'Marketing coordinator', s: 'challenger', g: 'f', k: 5, head: 'One report and three allies', res: 'Promoted to Marketing Specialist',
      story: 'Noa wanted to beat a stronger colleague for a promotion. Instead of competing on everything, she focused on a weekly conversion report the boss loved. She also helped two people in other teams with their data. When the promotion was discussed, three people spoke well of her.',
      moves: ['Attacked on a narrow front: one visible report.', 'Built allies in other departments.', 'Used numbers, not opinions.'], lesson: 'Focus plus allies beats effort spread thin.' }
  ];
  STORIES = STORIES.concat(window.PW7 ? window.PW7.STORIES : []);
  STORIES.forEach(function (st, i) { if (st.n === 'Dan' || st.n === 'Leo') st.starter = 1; });
  var exFilter = 'all';
  window.setExFilter = function (f) { exFilter = f; renderExamples(); };
  var STRAT = { leader: ['Defensive · Leader', 'bg-emerald-500/20 text-emerald-300'], challenger: ['Offensive · Challenger', 'bg-purple-500/20 text-purple-300'], flanker: ['Flanking · No. 3', 'bg-orange-500/20 text-orange-300'], guerrilla: ['Guerrilla · Underdog', 'bg-red-500/20 text-red-300'] };
  function findAvatar(g, k) {
    var want = g === 'f' ? [2, 3, 5, 7] : [0, 1, 8, 9], n = 0;
    for (var i = 0; i < 50; i++) { var pr = PWAvatars.params(i); if (want.indexOf(pr.style) >= 0 && (g === 'f' || true)) { if (n === k) return i; n++; } }
    return k;
  }
  var exView = lsGet('pw_exview', 'list');
  window.setExView = function (v) { exView = v; lsSet('pw_exview', v); renderExamples(); };
  function renderExamples() {
    var box = $('ex-list'); if (!box) return;
    var l = $('ex-btn-list'), g = $('ex-btn-grid');
    if (l && g) { l.classList.toggle('sel-on', exView === 'list'); g.classList.toggle('sel-on', exView === 'grid'); }
    box.className = exView === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-3';
    var fl = $('ex-btn-all'), fs = $('ex-btn-start'); if (fl && fs) { fl.classList.toggle('sel-on', exFilter === 'all'); fs.classList.toggle('sel-on', exFilter === 'start'); }
    var cnt = $('ex-count'); if (cnt) cnt.textContent = STORIES.length + ' learning stories · ' + STORIES.filter(function (x) { return x.starter; }).length + ' for a first job';
    box.innerHTML = STORIES.map(function (s, i) {
      if (exFilter === 'start' && !s.starter) return '';
      var av = PWAvatars.svg(findAvatar(s.g, s.k), 64), st = STRAT[s.s];
      if (exView === 'grid') {
        return '<button onclick="openStory(' + i + ')" class="text-left rounded-2xl bg-slate-900/70 border border-slate-700/60 p-3 active:scale-95 transition"><div class="av-ring w-14 h-14 mx-auto mb-2">' + av + '</div><p class="text-center text-xs font-bold text-white">' + s.n + ', ' + s.age + '</p><p class="text-center text-[10px] text-slate-400 mb-1.5">' + esc(s.job) + '</p><p class="text-center"><span class="px-2 py-0.5 rounded-full text-[9px] font-bold ' + st[1] + '">' + st[0] + '</span></p><p class="text-[11px] text-slate-300 mt-2 leading-snug">' + esc(s.head) + '</p></button>';
      }
      return '<button onclick="openStory(' + i + ')" class="w-full text-left rounded-2xl bg-slate-900/70 border border-slate-700/60 p-3 flex gap-3 items-start active:scale-95 transition"><div class="av-ring w-14 h-14 shrink-0">' + av + '</div><div class="min-w-0"><p class="text-xs font-bold text-white">' + s.n + ', ' + s.age + ' <span class="font-normal text-slate-400">· ' + esc(s.job) + '</span></p><p class="mt-1"><span class="px-2 py-0.5 rounded-full text-[9px] font-bold ' + st[1] + '">' + st[0] + '</span></p><p class="text-xs text-slate-200 mt-1.5 font-semibold leading-snug">' + esc(s.head) + '</p><p class="text-[11px] text-amber-300 mt-1">🏅 ' + esc(s.res) + '</p></div></button>';
    }).join('');
  }
  window.openStory = function (i) {
    var s = STORIES[i], st = STRAT[s.s]; if (!s) return;
    var t = $('modal-title'), b = $('modal-body'); if (!t || !b) return;
    t.innerText = s.n + ': ' + s.head;
    b.innerHTML = '<div class="flex items-center gap-3 mb-1"><div class="av-ring w-14 h-14 shrink-0">' + PWAvatars.svg(findAvatar(s.g, s.k), 64) + '</div><div><p class="text-xs font-bold text-white">' + s.n + ', ' + s.age + ' · ' + esc(s.job) + '</p><p class="mt-1"><span class="px-2 py-0.5 rounded-full text-[9px] font-bold ' + st[1] + '">' + st[0] + '</span></p></div></div>' +
      '<p>' + esc(s.story) + '</p><p class="font-semibold text-amber-400 pt-1">Moves they used:</p><ul class="list-disc pl-4 space-y-1.5">' + s.moves.map(function (m) { return '<li>' + esc(m) + '</li>'; }).join('') + '</ul>' +
      '<p class="text-[11px] italic text-slate-400 pt-1">💡 Lesson: ' + esc(s.lesson) + '</p><p class="text-[10px] text-slate-500">Illustrative story with a made-up character, written for learning.</p>';
    $('modal-container').classList.remove('hidden'); pushOverlay('modal');
  };

  /* ---------- wins journal ---------- */
  function renderWins() {
    var wins = lsGet('pw_wins_log', []), box = $('win-list'); if (!box) return;
    var c = $('win-count'); if (c) c.innerText = wins.length + (wins.length === 1 ? ' win' : ' wins');
    box.innerHTML = wins.length ? wins.map(function (w, i) {
      return '<div class="flex items-start gap-2 p-3 rounded-xl bg-slate-900/70 border border-slate-700/60"><span class="text-base">🏅</span><div class="flex-1 min-w-0"><p class="text-xs text-slate-100 leading-snug selectable">' + esc(w.t) + '</p><p class="text-[10px] text-slate-500 mt-0.5">' + esc(w.d) + '</p></div><button onclick="delWin(' + i + ')" class="text-slate-500 hover:text-red-400 text-xs px-1"><i class="fa-solid fa-xmark"></i></button></div>';
    }).reverse().join('') : '<p class="text-[11px] text-slate-500 italic">No wins yet. Add your first one above: something you finished, fixed or improved.</p>';
  }
  window.addWin = function () {
    var i = $('win-input'), v = i ? i.value.trim().slice(0, 300) : ''; if (!v) { toast('Type your win first'); return; }
    var wins = lsGet('pw_wins_log', []); wins.push({ t: v, d: new Date().toLocaleDateString(), iso: new Date().toISOString() }); lsSet('pw_wins_log', wins); i.value = ''; renderWins(); toast('Win saved 🏅');
  };
  window.delWin = function (idx) { var wins = lsGet('pw_wins_log', []); wins.splice(idx, 1); lsSet('pw_wins_log', wins); renderWins(); };
  window.copyWins = function () {
    var wins = lsGet('pw_wins_log', []); if (!wins.length) { toast('Nothing to copy yet'); return; }
    var txt = 'My wins:\n' + wins.map(function (w) { return '- ' + w.d + ': ' + w.t; }).join('\n');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { toast('Copied to clipboard'); }, function () { toast('Could not copy'); });
    else toast('Copy is not available here');
  };

  /* ---------- glossary ---------- */
  var GLOSS = [
    ['Power map', 'A simple picture of who has power in your company.'], ['Power rank', 'A number from 1 (top boss) to 4 (base) that you give each person.'],
    ['Formal power', 'Power that comes from a job title, like a manager approving your schedule.'], ['Informal power', 'Influence from trust and respect, even without a big title.'],
    ['Leader (#1)', 'The top performer in your area. Uses Defensive strategy.'], ['Challenger (#2)', 'The runner-up. Uses Offensive strategy.'],
    ['Flanker (#3)', 'Third place. Finds areas nobody owns yet.'], ['Underdog', 'A newcomer or the smallest player. Uses Guerrilla strategy.'],
    ['Decisive point', 'The one skill or task your bosses care about most.'], ['Narrow front', 'Focusing on one small, visible task instead of many.'],
    ['Reserve', 'Energy and goodwill you save for important moments.'], ['Niche', 'A small area where you become the expert.'],
    ['Ally', 'A coworker who supports you and speaks well of you.'], ['Stakeholder', 'Anyone affected by or interested in your work.'],
    ['KPI', 'A number a company uses to measure success.'], ['Visibility', 'How much decision makers know about you and your results.'],
    ['Wins log', 'A list of your achievements with dates and numbers.'], ['Handover', 'Teaching someone your tasks before you move to a new role.'],
    ['Mentor', 'An experienced person who gives you advice.'], ['One-on-one', 'A regular private meeting with your manager.'],
    ['Delegate', 'Give a task to someone else and trust them to do it.'], ['Stagnant project', 'A project that is not moving and gives no growth.'],
    ['Toxic politics', 'Unfair games, gossip and blame at work.'], ['Performance review', 'A formal talk about how you did and what comes next.']
  ];
  if (window.PW6 && PW6.GLOSS_EXTRA) GLOSS = GLOSS.concat(PW6.GLOSS_EXTRA);
  window.PW_GLOSS = GLOSS;
  function renderGlossary() {
    var q = ($('gl-search') ? $('gl-search').value : '').trim().toLowerCase(), box = $('gl-list'); if (!box) return;
    var rows = GLOSS.filter(function (g) { return !q || g[0].toLowerCase().indexOf(q) >= 0 || g[1].toLowerCase().indexOf(q) >= 0; });
    box.innerHTML = rows.length ? rows.map(function (g) { return '<div class="p-3 rounded-xl bg-slate-900/70 border border-slate-700/60"><p class="text-xs font-bold text-amber-400">' + esc(g[0]) + '</p><p class="text-xs text-slate-300 mt-0.5 leading-snug">' + esc(g[1]) + '</p></div>'; }).join('') : '<p class="text-[11px] text-slate-500 italic">No term found.</p>';
  }
  window.renderGlossary = renderGlossary;

  /* ---------- profile & settings ---------- */
  function renderProfile() {
    var p = profile();
    var n = $('prof-name'); if (n && document.activeElement !== n) n.value = p.name || '';
    var pos = $('prof-pos'); if (pos) pos.value = p.position || '';
    var grid = $('avatar-grid');
    if (grid) {
      var h = '';
      for (var i = 0; i < 50; i++) h += '<button onclick="chooseAvatar(' + i + ')" aria-label="Avatar ' + (i + 1) + '" class="av-opt rounded-full overflow-hidden ' + (!p.photo && p.avatar === i ? 'av-sel' : '') + '">' + PWAvatars.svg(i, 56) + '</button>';
      grid.innerHTML = h;
    }
    var rm = $('photo-remove'); if (rm) rm.classList.toggle('hidden', !p.photo);
    applyTheme(lsGet('pw_theme', 'dark')); applySize(lsGet('pw_size', 'm'));
    renderBankStats(); refreshAvatars();
  }
  window.chooseAvatar = function (i) { var p = profile(); p.avatar = i; p.photo = null; saveProfile(p); renderProfile(); toast('Avatar ' + (i + 1) + ' selected'); };
  window.removePhoto = function () { var p = profile(); p.photo = null; saveProfile(p); renderProfile(); };
  window.onPhotoPicked = function (inp) {
    var f = inp.files && inp.files[0]; if (!f) return;
    PWAvatars.photoFromFile(f, function (data) {
      if (!data) { toast('Could not read this picture'); return; }
      var p = profile(); p.photo = data; saveProfile(p); renderProfile(); toast('Photo saved on your phone');
    });
    inp.value = '';
  };
  window.saveProfileName = function () { var p = profile(); p.name = ($('prof-name').value || '').trim().slice(0, 30); saveProfile(p); };
  window.saveProfilePos = function () { var v = $('prof-pos').value; if (v) window.pickPosition(v); else { var p = profile(); p.position = ''; PWAvatars.save(p); } toast('Saved'); };

  /* ---------- about ---------- */
  function renderAbout() { var v = $('about-bank'); if (v && window.PW_BANK) v.innerText = PW_BANK.entries.length + ' questions and answers on ' + PW_BANK.cards.length + ' topics'; }

  /* ---------- data bank & adviser ---------- */
  var ADV = null, CHAT = lsGet('pw_chat', []), busy = false;
  function userBank() { return lsGet('pw_user_bank', []); }
  function getAdviser() {
    if (!window.PW_BANK || !window.PWAdviserEngine) return null;
    if (!ADV) { ADV = new PWAdviserEngine.Adviser(PW_BANK, { profile: profile() }); ADV.addUserEntries(userBank()); }
    ADV.profile = profile();
    return ADV;
  }
  function renderBankStats() {
    var s = $('bank-stats'); if (!s) return;
    s.innerText = (window.PW_BANK ? PW_BANK.entries.length : 0) + ' built-in answers + ' + userBank().length + ' of your own + ' + (window.PWAbbr ? window.PWAbbr.count() : 0) + ' business abbreviations';
  }
  function saveChat() { CHAT = CHAT.slice(-40); lsSet('pw_chat', CHAT); }
  function fmt(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  var lastChips = [];
  function renderChat() {
    var log = $('chat-log'); if (!log) return;
    if (!CHAT.length) {
      var p = profile();
      CHAT.push({ r: 'a', t: 'Hi' + (p.name ? ' ' + p.name : '') + '! I am your Career Adviser. Ask me anything about getting promoted, your boss, coworkers, skills or the strategies in this app. You can write like you talk.', chips: [{ label: 'How do I get promoted?', q: 'How do I get promoted?' }, { label: 'I am new at work', q: 'I am new at work, where do I start?' }, { label: 'My boss ignores me', q: 'My boss never notices my work' }, { label: '📱 How to use this app', q: 'How do I use this app?' }] });
    }
    var me = profile();
    log.innerHTML = CHAT.map(function (m, i) {
      if (m.r === 'u') return '<div class="flex justify-end items-end gap-2"><div class="max-w-[80%] rounded-2xl rounded-br-md px-3 py-2 bg-red-600 text-white text-xs leading-snug selectable">' + fmt(m.t) + '</div><div class="av-ring w-7 h-7 shrink-0">' + PWAvatars.html(28, me) + '</div></div>';
      if (m.web) {
        return '<div class="flex items-end gap-2"><div class="w-7 h-7 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm">🌐</div><div class="max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 bg-slate-800 text-slate-100 text-xs leading-snug selectable"><p class="font-bold text-amber-400 mb-1">' + esc(m.web.title) + '</p><p>' + fmt(m.web.text) + '</p><div class="flex flex-wrap gap-2 mt-2"><button onclick="saveWeb(' + i + ')" class="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] active:scale-95"><i class="fa-solid fa-floppy-disk"></i> Save to my data bank</button><a href="' + esc(m.web.url) + '" target="_blank" rel="noopener noreferrer" class="px-2.5 py-1 rounded-lg bg-slate-700 text-slate-100 font-bold text-[11px]">Open source</a></div><p class="text-[10px] text-slate-500 mt-1">Web result from Wikipedia. Check it before you rely on it.</p></div></div>';
      }
      var extra = '';
      if (m.web2) extra = '<div class="flex flex-wrap gap-2 mt-2"><button onclick="searchWeb(' + i + ')" class="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px] active:scale-95"><i class="fa-solid fa-globe"></i> Search the web</button></div>';
      return '<div class="flex items-end gap-2"><div class="w-7 h-7 shrink-0 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-sm">🧭</div><div class="max-w-[85%] rounded-2xl rounded-bl-md px-3 py-2 bg-slate-800 text-slate-100 text-xs leading-snug selectable">' + fmt(m.t) + extra + '</div></div>';
    }).join('') + (busy ? '<div class="flex items-end gap-2"><div class="w-7 h-7 shrink-0 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center text-sm">🧭</div><div class="rounded-2xl rounded-bl-md px-3 py-2 bg-slate-800 typing"><span></span><span></span><span></span></div></div>' : '');
    var last = null; for (var k = CHAT.length - 1; k >= 0; k--) { if (CHAT[k].r === 'a') { last = CHAT[k]; break; } }
    lastChips = (!busy && last && last.chips) ? last.chips : [];
    var ch = $('chat-chips');
    if (ch) ch.innerHTML = lastChips.map(function (c, i) { return '<button onclick="chipTap(' + i + ')" class="shrink-0 px-3 py-1.5 rounded-full bg-slate-800 border border-amber-500/40 text-amber-300 text-[11px] font-semibold active:scale-95">' + esc(c.label) + '</button>'; }).join('');
    log.scrollTop = log.scrollHeight;
  }
  window.chipTap = function (i) {
    var c = lastChips[i]; if (!c) return;
    if (c.go) { window.closeAdviser(); setTimeout(function () { window.navTo(c.go); }, 60); return; }
    if (c.addText) { if (window.addMove) window.addMove(c.addText.id, c.addText.text); return; }
    if (c.add) { var card = PW_BANK.cards[c.add.idx]; if (window.addMove) window.addMove('adv-' + card.id, card.s1); return; }
    sendChat(c.q);
  };
  /* strategy ideas (80 extra tips) answered directly */
  var TIPPOS = [['leader', /\b(leader|defen[cs]ive|number one)\b|#1/i, 'Leader (#1)'], ['challenger', /\b(challenger|offensive|number two)\b|#2/i, 'Challenger (#2)'], ['flanker', /\b(flanker|flanking|number three)\b|#3/i, 'Flanker (#3)'], ['guerrilla', /\b(guerrilla|underdog)\b/i, 'Underdog (Guerrilla)']];
  var tipIdx = {}, lastTipPos = '';
  function tipsReply(text) {
    if (!window.PW_TIPS || !/\b(ideas?|suggest(ions?)?|tips?|strateg(y|ies)|moves?)\b/i.test(text)) return null;
    var pos = '', label = '';
    TIPPOS.forEach(function (t) { if (!pos && t[1].test(text)) { pos = t[0]; label = t[2]; } });
    if (!pos && /\b(more|other|another|new|different|next)\b/i.test(text) && lastTipPos) pos = lastTipPos;
    if (!pos && /\b(my|me|for me|give)\b/i.test(text) && profile().position) pos = profile().position;
    if (!pos || !PW_TIPS[pos]) return null;
    TIPPOS.forEach(function (t) { if (t[0] === pos) label = t[2]; });
    var list = PW_TIPS[pos], n = list.length, st = tipIdx[pos] || 0;
    tipIdx[pos] = (st + 3) % n; lastTipPos = pos;
    var out = 'Here are 3 ideas for the ' + label + ' position:\n', chips = [];
    for (var k = 0; k < 3; k++) {
      var i = (st + k) % n, t = list[i];
      out += '\n' + (k + 1) + '. ' + t[0] + ': ' + t[1];
      chips.push({ label: '➕ ' + t[0], addText: { id: 'tip-' + pos + '-' + i, text: t[0] + ': ' + t[1] } });
    }
    chips.push({ label: '🔄 More ideas', q: 'more ideas for the ' + pos });
    return { text: out, chips: chips, card: -1 };
  }
  function sendChat(text) {
    text = (text || '').trim(); if (!text || busy) return;
    CHAT.push({ r: 'u', t: text.slice(0, 400) }); busy = true; renderChat();
    var adv = getAdviser(), res;
    try { res = (window.PWHowto && window.PWHowto.reply(text)) || (window.PWAbbr && window.PWAbbr.reply(text)) || tipsReply(text) || (adv ? adv.reply(text) : { text: 'My data bank is still loading. Please try again in a moment.', chips: [] }); }
    catch (e) { console.error(e); res = { text: 'Sorry, something went wrong. Please rephrase your question.', chips: [] }; }
    var delay = Math.min(1100, 350 + res.text.length * 3);
    setTimeout(function () {
      busy = false;
      var chips = (res.chips || []).slice();
      if (res.card >= 0) chips.push({ label: '➕ Add to my plan', add: { idx: res.card } });
      CHAT.push({ r: 'a', t: res.text, chips: chips, web2: !!res.web, q: text });
      saveChat(); renderChat();
    }, delay);
  }
  window.searchWeb = function (i) {
    var m = CHAT[i]; if (!m) return; var q = m.q || '';
    if (!navigator.onLine) { CHAT.push({ r: 'a', t: 'You are offline right now. Connect to the internet and try again, or rephrase your question.', chips: [] }); saveChat(); renderChat(); return; }
    busy = true; CHAT.push({ r: 'u', t: '🌐 Search the web: ' + q.slice(0, 120) }); renderChat();
    var clean = q.replace(/\b(how|what|why|when|do|does|can|could|should|i|my|me|is|are|the|a|an|to|for|of|please|tell|about)\b/gi, ' ').replace(/\s+/g, ' ').trim() || q;
    var base = 'https://en.wikipedia.org/w/api.php?origin=*&format=json&';
    fetch(base + 'action=query&list=search&srlimit=2&srsearch=' + encodeURIComponent(clean)).then(function (r) { return r.json(); }).then(function (j) {
      var hits = (j.query && j.query.search) || [];
      if (!hits.length) throw new Error('none');
      return fetch(base + 'action=query&prop=extracts&exintro=1&explaintext=1&exsentences=4&redirects=1&titles=' + encodeURIComponent(hits[0].title)).then(function (r) { return r.json(); }).then(function (j2) {
        var pages = (j2.query && j2.query.pages) || {}, k = Object.keys(pages)[0], pg = pages[k] || {};
        var text = (pg.extract || '').trim();
        if (!text) throw new Error('empty');
        busy = false;
        CHAT.push({ r: 'a', web: { title: pg.title || hits[0].title, text: text.slice(0, 700), url: 'https://en.wikipedia.org/wiki/' + encodeURIComponent((pg.title || hits[0].title).replace(/ /g, '_')), q: q } });
        saveChat(); renderChat();
      });
    }).catch(function () {
      busy = false;
      CHAT.push({ r: 'a', t: 'I could not find a good web result for that. Try different words, or open a normal search:\nhttps://www.google.com/search?q=' + encodeURIComponent(q), chips: [] });
      saveChat(); renderChat();
    });
  };
  window.saveWeb = function (i) {
    var m = CHAT[i]; if (!m || !m.web) return;
    var list = userBank(); list.push({ q: m.web.q, a: m.web.text, src: 'Wikipedia: ' + m.web.title, k: m.web.title });
    lsSet('pw_user_bank', list); if (ADV) ADV.addUserEntries(list);
    CHAT.push({ r: 'a', t: 'Saved to your data bank. Ask me the same question again and I will use it.', chips: [{ label: 'Ask it again', q: m.web.q }] });
    saveChat(); renderChat(); renderBankStats(); toast('Saved to your data bank');
  };
  window.clearChat = function () { CHAT = []; lsSet('pw_chat', []); if (ADV) ADV.ctx = { card: -1, angle: -1, cats: {}, turns: 0, lastCards: [] }; renderChat(); };
  window.submitChat = function (ev) { if (ev) ev.preventDefault(); var i = $('chat-input'); var v = i ? i.value : ''; if (i) i.value = ''; sendChat(v); return false; };

  /* teach / import / export */
  window.teachAdviser = function () {
    var q = ($('teach-q').value || '').trim(), a = ($('teach-a').value || '').trim();
    if (q.length < 6 || a.length < 10) { toast('Write a question and a longer answer'); return; }
    var list = userBank(); list.push({ q: q.slice(0, 200), a: a.slice(0, 1200), src: 'You', k: '' }); lsSet('pw_user_bank', list);
    if (ADV) ADV.addUserEntries(list); $('teach-q').value = ''; $('teach-a').value = ''; renderBankStats(); toast('Added to your data bank');
  };
  window.exportBank = function () {
    var list = userBank(); if (!list.length) { toast('You have no additions to export yet'); return; }
    var blob = new Blob([JSON.stringify({ app: 'Promotion Warfare', version: 'V04', entries: list }, null, 1)], { type: 'application/json' });
    var file = null; try { file = new File([blob], 'my-databank-additions.json', { type: 'application/json' }); } catch (e) { }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'My data bank additions' }).catch(function () { }); return; }
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-databank-additions.json'; document.body.appendChild(a); a.click(); a.remove();
  };
  window.importBank = function (inp) {
    var f = inp.files && inp.files[0]; if (!f) return;
    var rd = new FileReader();
    rd.onload = function () {
      try {
        var j = JSON.parse(rd.result), arr = Array.isArray(j) ? j : (j.entries || []);
        var list = userBank(), have = {}; list.forEach(function (e) { have[e.q.toLowerCase()] = 1; });
        var added = 0;
        arr.forEach(function (e) {
          if (e && typeof e.q === 'string' && typeof e.a === 'string' && e.q.length >= 4 && e.a.length >= 4 && !have[e.q.toLowerCase()]) {
            list.push({ q: e.q.slice(0, 200), a: e.a.slice(0, 1500), src: String(e.src || 'Update file').slice(0, 80), k: String(e.k || '').slice(0, 200) }); have[e.q.toLowerCase()] = 1; added++;
          }
        });
        lsSet('pw_user_bank', list); if (ADV) ADV.addUserEntries(list); renderBankStats(); toast(added + ' new answers imported');
      } catch (e) { toast('This file is not a valid update file'); }
    };
    rd.readAsText(f); inp.value = '';
  };
  window.clearBank = function () { if (confirm('Delete all answers you added to the data bank?')) { lsSet('pw_user_bank', []); if (ADV) ADV.addUserEntries([]); renderBankStats(); toast('Your additions were deleted'); } };
  window.resetAll = function () {
    if (!confirm('Delete ALL your data in this app (profile, map, plan, journal, chat)?')) return;
    try { Object.keys(localStorage).filter(function (k) { return k.indexOf('pw_') === 0; }).forEach(function (k) { localStorage.removeItem(k); }); } catch (e) { }
    location.reload();
  };

  /* ---------- pyramid drawing ---------- */
  function trunc(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }
  function avatarHref(p) {
    if (p.photo) return p.photo;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(PWAvatars.svg(typeof p.avatar === 'number' ? p.avatar : 0, 64));
  }
  function pyramidSVG(meName) {
    var TIERS = [{ r: '1', n: 'Top leaders', c: '#f59e0b', i: '👑' }, { r: '2', n: 'Senior & mid', c: '#a855f7', i: '⭐' }, { r: '3', n: 'Key people', c: '#3b82f6', i: '🛡️' }, { r: '4', n: 'Base team', c: '#10b981', i: '👥' }];
    var W = 360, H = 450, top = 66, bh = 80, cx = 105, half = 92, p = profile();
    var data = (typeof mapData !== 'undefined' ? mapData : []).filter(function (d) { return d.name && d.name.trim(); });
    function xl(y) { return cx - half * ((y - top) / (bh * 4)); } function xr(y) { return cx + half * ((y - top) / (bh * 4)); }
    var s = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ' + W + ' ' + H + '" width="100%" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif">' +
      '<defs><clipPath id="clipMe"><circle cx="0" cy="0" r="15"/></clipPath></defs>' +
      '<rect width="' + W + '" height="' + H + '" rx="18" fill="#0f172a"/><rect x="2" y="2" width="' + (W - 4) + '" height="' + (H - 4) + '" rx="17" fill="none" stroke="#f59e0b" stroke-opacity=".45" stroke-width="1.5"/>' +
      '<text x="' + (W / 2) + '" y="30" text-anchor="middle" font-size="16" font-weight="800" fill="#fbbf24">Corporate Power Pyramid</text>' +
      '<text x="' + (W / 2) + '" y="48" text-anchor="middle" font-size="10" fill="#94a3b8">' + esc(p.position ? 'Strategy: ' + ({ leader: 'Defensive (Leader)', challenger: 'Offensive (Challenger)', flanker: 'Flanking (No. 3)', guerrilla: 'Guerrilla (Underdog)' }[p.position]) : 'Who has the power in your company') + '</text>';
    TIERS.forEach(function (t, k) {
      var y0 = top + k * bh, y1 = y0 + bh, ym = y0 + bh / 2;
      var ppl = data.filter(function (d) { return String(d.rank) === t.r; });
      s += '<polygon points="' + xl(y0) + ',' + y0 + ' ' + xr(y0) + ',' + y0 + ' ' + xr(y1) + ',' + y1 + ' ' + xl(y1) + ',' + y1 + '" fill="' + t.c + '" fill-opacity=".9" stroke="#0f172a" stroke-width="3"/>' +
        '<text x="' + cx + '" y="' + (ym + 8) + '" text-anchor="middle" font-size="24" font-weight="800" fill="#fff">' + ppl.length + '</text>' +
        '<line x1="' + (xr(ym) + 3) + '" y1="' + ym + '" x2="212" y2="' + ym + '" stroke="' + t.c + '" stroke-dasharray="3 3" stroke-width="1.5"/>' +
        '<text x="218" y="' + (y0 + 17) + '" font-size="11" font-weight="800" fill="' + t.c + '">' + t.i + ' ' + esc(t.n) + '</text>';
      var shown = ppl.slice(0, 4);
      shown.forEach(function (d, j) {
        var isMe = meName && d.name === meName;
        s += '<text x="218" y="' + (y0 + 33 + j * 12.5) + '" font-size="10" fill="' + (isMe ? '#fbbf24' : '#e2e8f0') + '"' + (isMe ? ' font-weight="800"' : '') + '>' + (isMe ? '★ ' : '• ') + esc(trunc(d.name, 14)) + (d.position ? ' <tspan fill="#94a3b8" font-size="8">' + esc(trunc(d.position, 12)) + '</tspan>' : '') + '</text>';
      });
      if (ppl.length > 4) s += '<text x="218" y="' + (y0 + 33 + 4 * 12.5) + '" font-size="9" fill="#94a3b8">+ ' + (ppl.length - 4) + ' more</text>';
      if (!ppl.length) s += '<text x="218" y="' + (y0 + 33) + '" font-size="9" fill="#64748b" font-style="italic">empty</text>';
      var meHere = meName && ppl.some(function (d) { return d.name === meName; });
      if (meHere) {
        s += '<g transform="translate(' + (cx - 40) + ',' + (ym + 2) + ')"><circle r="17.5" fill="#fbbf24"/><g clip-path="url(#clipMe)"><image x="-15" y="-15" width="30" height="30" href="' + avatarHref(p) + '" xlink:href="' + avatarHref(p) + '"/></g><text y="29" text-anchor="middle" font-size="8" font-weight="800" fill="#fbbf24">YOU</text></g>';
      }
    });
    s += '<text x="' + (W / 2) + '" y="' + (H - 14) + '" text-anchor="middle" font-size="9" fill="#64748b">HiProgress · Promotion Warfare</text></svg>';
    return s;
  }
  function drawPyramid() {
    var wrap = $('pyr-draw'); if (!wrap) return;
    var sel = $('pyr-me');
    if (sel) {
      var names = (typeof mapData !== 'undefined' ? mapData : []).filter(function (d) { return d.name && d.name.trim(); }).map(function (d) { return d.name; });
      var saved = lsGet('pw_me_name', ''); var cur = sel.value || saved;
      sel.innerHTML = '<option value="">Not on the map</option>' + names.map(function (n) { return '<option value="' + esc(n) + '"' + (n === cur ? ' selected' : '') + '>' + esc(n) + '</option>'; }).join('');
      if (cur && names.indexOf(cur) < 0) sel.value = '';
    }
  }
  window.showPyramidDrawing = function () {
    var sel = $('pyr-me'), me = sel ? sel.value : ''; lsSet('pw_me_name', me);
    var box = $('pyr-svg'); if (!box) return;
    box.innerHTML = pyramidSVG(me); $('pyr-actions').classList.remove('hidden'); box.classList.remove('hidden');
    try { box.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) { }
  };
  window.savePyramidImage = function () {
    var box = $('pyr-svg'); var svgEl = box && box.querySelector('svg'); if (!svgEl) return;
    var xml = new XMLSerializer().serializeToString(svgEl).replace('width="100%"', 'width="720" height="900"');
    var img = new Image();
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = 720; c.height = 900; var g = c.getContext('2d'); g.drawImage(img, 0, 0, 720, 900);
      c.toBlob(function (b) {
        if (!b) { toast('Could not create the picture'); return; }
        var file = null; try { file = new File([b], 'power-pyramid.png', { type: 'image/png' }); } catch (e) { }
        if (file && navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ files: [file], title: 'My Power Pyramid' }).catch(function () { }); return; }
        var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'power-pyramid.png'; document.body.appendChild(a); a.click(); a.remove(); toast('Picture saved');
      }, 'image/png');
    };
    img.onerror = function () { toast('Could not create the picture'); };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xml);
  };

  /* ---------- init ---------- */
  window.addEventListener('DOMContentLoaded', function () {
    applyTheme(lsGet('pw_theme', 'dark')); applySize(lsGet('pw_size', 'm'));
    renderHelp(); refreshAvatars();
    try { history.replaceState({ s: 'step-welcome', p: 0 }, ''); } catch (e) { }
    window.goToStep('step-welcome', 0, true);
    var ci = $('chat-input'); if (ci) ci.addEventListener('focus', function () { setTimeout(function () { var l = $('chat-log'); if (l) l.scrollTop = l.scrollHeight; }, 300); });
    var gs = $('gl-search'); if (gs) gs.addEventListener('input', renderGlossary);
    var wi = $('win-input'); if (wi) wi.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); window.addWin(); } });
  });
})();
