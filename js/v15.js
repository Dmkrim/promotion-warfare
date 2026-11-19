/* Promotion Warfare V15
   1) Start button: big, animated, above the greeting
   2) Welcome page order: tools -> tool-card deck -> streak -> level -> big goal -> today's move
   3) Lesson + weekly move live in My Action Plan, before "Take it with you"
   4) Profile: avatars open only after "Change an Avatar"  */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function fxOff() { return document.documentElement.classList.contains('fx-off'); }

  /* ---------------- CSS ---------------- */
  function css() {
    if ($('v15-css')) return; var s = document.createElement('style'); s.id = 'v15-css';
    s.textContent = [
      /* start button */
      '.start-war{display:block;min-height:100px;padding:14px 12px;background:linear-gradient(90deg,#b91c1c,#ef4444 35%,#f59e0b 70%,#b91c1c);background-size:220% 100%;box-shadow:0 10px 30px rgba(185,28,28,.45),inset 0 0 0 2px rgba(255,255,255,.18);-webkit-tap-highlight-color:transparent}',
      '.start-war:active{transform:scale(.97)}',
      'html.fx-full .start-war{animation:swBg 6s linear infinite,swPulse 2.4s ease-in-out infinite}',
      '@keyframes swBg{to{background-position:-220% 0}}',
      '@keyframes swPulse{0%,100%{box-shadow:0 10px 30px rgba(185,28,28,.45),inset 0 0 0 2px rgba(255,255,255,.18),0 0 0 0 rgba(251,191,36,.55)}50%{box-shadow:0 12px 36px rgba(245,158,11,.6),inset 0 0 0 2px rgba(255,255,255,.28),0 0 0 10px rgba(251,191,36,0)}}',
      '.sw-row{position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:10px}',
      '.sw-mid{display:flex;flex-direction:column;align-items:center;line-height:1.1;min-width:0}',
      '.sw-t{font-size:clamp(16px,5.4vw,24px);font-weight:900;text-shadow:0 2px 6px rgba(0,0,0,.45);white-space:nowrap}',
      '.sw-s{font-size:11px;opacity:.92;margin-top:5px;letter-spacing:.05em}',
      '.sw-emb{position:relative;width:52px;height:62px;flex:none;margin-right:12px}',
      '.sw-a,.sw-b{position:absolute;left:50%;bottom:0;width:22px;height:58px;margin-left:-11px;transform-origin:50% 90%}',
      '.sw-svg{width:100%;height:100%;display:block}',
      '.sw-a{transform:rotate(34deg)}.sw-b{transform:rotate(-34deg)}',
      'html.fx-full .sw-a{animation:swA 2.4s ease-in-out infinite}html.fx-full .sw-b{animation:swB 2.4s ease-in-out infinite}',
      '@keyframes swA{0%,100%{transform:rotate(34deg)}14%{transform:rotate(54deg)}26%{transform:rotate(28deg)}34%{transform:rotate(36deg)}}',
      '@keyframes swB{0%,100%{transform:rotate(-34deg)}14%{transform:rotate(-54deg)}26%{transform:rotate(-28deg)}34%{transform:rotate(-36deg)}}',
      '.sw-spark{position:absolute;left:50%;top:6px;transform:translate(-50%,0) scale(0);color:#fff7ae;font-size:22px;line-height:1;text-shadow:0 0 8px #fbbf24,0 0 16px #f97316;pointer-events:none}',
      'html.fx-full .sw-spark{animation:swSp 2.4s ease-out infinite}',
      '@keyframes swSp{0%,22%{transform:translate(-50%,0) scale(0);opacity:0}27%{transform:translate(-50%,-4px) scale(1.6);opacity:1}46%,100%{transform:translate(-50%,-12px) scale(.4);opacity:0}}',
      '.sw-ban{width:34px;height:52px;flex:none}.sw-bsvg{width:100%;height:100%;display:block}',
      '.sw-bf{transform-box:fill-box;transform-origin:0 0}html.fx-full .sw-bf{animation:swFl 1.2s ease-in-out infinite alternate}',
      '@keyframes swFl{from{transform:skewY(-9deg)}to{transform:skewY(9deg) scaleX(.82)}}',
      '.sw-embers{position:absolute;inset:0;z-index:1;pointer-events:none}',
      '.sw-embers i{position:absolute;bottom:-6px;width:5px;height:5px;border-radius:50%;background:#fde68a;opacity:0}',
      '.sw-embers i:nth-child(1){left:8%}.sw-embers i:nth-child(2){left:22%;width:4px;height:4px}.sw-embers i:nth-child(3){left:38%}.sw-embers i:nth-child(4){left:54%;width:4px;height:4px}.sw-embers i:nth-child(5){left:68%}.sw-embers i:nth-child(6){left:82%;width:4px;height:4px}.sw-embers i:nth-child(7){left:93%}',
      'html.fx-full .sw-embers i{animation:swEm 3s ease-out infinite}',
      '.sw-embers i:nth-child(2){animation-delay:.5s!important}.sw-embers i:nth-child(3){animation-delay:1.1s!important}.sw-embers i:nth-child(4){animation-delay:1.7s!important}.sw-embers i:nth-child(5){animation-delay:.3s!important}.sw-embers i:nth-child(6){animation-delay:2.1s!important}.sw-embers i:nth-child(7){animation-delay:1.4s!important}',
      '@keyframes swEm{0%{transform:translateY(0) scale(1);opacity:0}15%{opacity:.95}100%{transform:translateY(-105px) translateX(12px) scale(.3);opacity:0}}',
      '.sw-shine{position:absolute;top:0;bottom:0;width:40%;left:-50%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.35),transparent);transform:skewX(-18deg);z-index:1;pointer-events:none}',
      'html.fx-full .sw-shine{animation:swSh 3.4s ease-in-out infinite}@keyframes swSh{0%,55%{left:-50%}100%{left:130%}}',
      '@media (max-width:379px){.sw-ban{display:none}.sw-emb{margin-right:6px}}',
      /* tool deck */
      '#tool-deck{margin-top:12px;margin-bottom:12px;text-align:left}',
      '.td-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.td-head p{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#fcd34d;margin:0}.td-head small{font-size:10px;color:#94a3b8}',
      '.td-wrap{position:relative;height:138px;touch-action:pan-y;user-select:none;-webkit-user-select:none}',
      '.td-card{position:absolute;left:0;right:0;top:0;height:118px;border-radius:20px;padding:12px 14px;display:flex;align-items:center;gap:12px;color:#fff;border:1px solid rgba(255,255,255,.18);box-shadow:0 8px 20px rgba(0,0,0,.35);transition:transform .45s cubic-bezier(.3,1.1,.4,1),opacity .35s;will-change:transform;cursor:pointer;overflow:hidden}',
      '.td-card.td-drag{transition:none}',
      'html.fx-off .td-card{transition:none}',
      '.td-ic{flex:none;width:68px;height:68px;border-radius:18px;background:rgba(2,6,23,.35);display:flex;align-items:center;justify-content:center;font-size:36px;overflow:hidden}.td-ic svg{width:46px;height:46px}.td-ic .flex{height:auto!important}',
      '.td-tx{min-width:0}.td-tx b{display:block;font-size:15px;line-height:1.15;margin-bottom:3px}.td-tx span{display:block;font-size:12px;line-height:1.3;color:rgba(255,255,255,.92)}.td-tx em{display:inline-block;margin-top:5px;font-style:normal;font-size:11px;font-weight:800;color:#fde68a}',
      '.td-dots{display:flex;justify-content:center;gap:5px;margin-top:2px}.td-dots i{width:6px;height:6px;border-radius:50%;background:#475569;transition:all .3s}.td-dots i.on{background:#fbbf24;width:16px;border-radius:4px}',
      /* avatars */
      '#av-pick{animation:avIn .35s ease-out}@keyframes avIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}',
      'html.fx-off #av-pick{animation:none}'
    ].join('\n'); document.head.appendChild(s);
  }

  /* ---------------- Tool deck ---------------- */
  var TOOLS = [
    { go: 'step-help', t: 'How to use this App', d: 'A simple guide to every page. Start here if you feel lost.', c: ['#1d4ed8', '#0ea5e9'] },
    { go: 'step-examples', t: 'Examples of Promotions', d: 'Read 12 made-up stories of people who got promoted and see what worked.', c: ['#b45309', '#f59e0b'] },
    { go: '#adviser', t: 'Ask the Adviser', d: 'Type any career question and get a short answer. It works offline.', c: ['#c2410c', '#fb923c'] },
    { go: 'step-action-plan', t: 'My Action Plan', d: 'Your weekly battle plan. Pick moves, tick them off and print the plan.', c: ['#be123c', '#f43f5e'] },
    { go: 'step-journal', t: 'Wins Journal', d: 'Write down every win. You need them for reviews and for asking a raise.', c: ['#047857', '#34d399'] },
    { go: 'step-cheat', t: 'Cheat Sheet', d: 'One page of quick rules. Read it before a hard meeting.', c: ['#6d28d9', '#a78bfa'] },
    { go: 'step-lab', t: 'Strategy Lab', d: 'Move on the grid and see what changes. Test ideas before you use them.', c: ['#0f766e', '#2dd4bf'] },
    { go: 'step-quiz', t: 'Quiz & Flashcards', d: 'Test what you know. The questions you miss come back later.', c: ['#a21caf', '#e879f9'] },
    { go: 'step-phrase', t: 'Phrasebook', d: 'Exact sentences for hard moments. Tap one to copy it.', c: ['#0369a1', '#38bdf8'] },
    { go: 'step-tools', t: 'Career Tools', d: 'CV, interview stories, salary helper, 1:1 planner and career games.', c: ['#4d7c0f', '#a3e635'] },
    { go: 'step-goals', t: 'Goals', d: 'Set a clear goal and watch the progress bar fill. Includes the salary helper.', c: ['#9f1239', '#fb7185'] },
    { go: 'step-profile', t: 'Profile & Settings', d: 'Your name, avatar, theme, text size, effects, voice and backup.', c: ['#334155', '#64748b'] }
  ];
  var deck = { cur: 0, timer: 0, busy: false, down: null };

  function srcButtons() {
    var g = document.querySelector('#step-welcome > .grid.grid-cols-2'); return g ? [].slice.call(g.querySelectorAll(':scope > button')) : [];
  }
  function iconHtml(btn) {
    if (!btn) return '👤'; var ic = btn.querySelector('svg'); return ic ? ic.outerHTML : '👤';
  }
  function layout() {
    var cards = [].slice.call(document.querySelectorAll('#tool-deck .td-card')), n = cards.length;
    cards.forEach(function (c, i) {
      var d = (i - deck.cur + n) % n; if (c.getAttribute('data-out')) return;
      var vis = d <= 2;
      c.style.zIndex = String(50 - d); c.style.opacity = vis ? '1' : '0'; c.style.pointerEvents = d === 0 ? 'auto' : 'none';
      c.style.transform = 'translateY(' + (d * 8) + 'px) scale(' + (1 - d * 0.045) + ')'; c.style.filter = d === 0 ? 'none' : 'brightness(' + (1 - d * 0.18) + ')';
    });
    [].forEach.call(document.querySelectorAll('#tool-deck .td-dots i'), function (e, i) { e.classList.toggle('on', i === deck.cur); });
  }
  function next(dir) {
    if (deck.busy) return; var cards = document.querySelectorAll('#tool-deck .td-card'), n = cards.length; if (!n) return;
    var top = cards[deck.cur], old = deck.cur; dir = dir || -1;
    deck.cur = (deck.cur + 1) % n;
    if (fxOff()) { layout(); return; }
    deck.busy = true; top.setAttribute('data-out', '1');
    top.style.transition = 'transform .45s ease-in,opacity .45s'; top.style.transform = 'translate(' + (dir * 130) + '%,-10px) rotate(' + (dir * 16) + 'deg)'; top.style.opacity = '0';
    layout();
    setTimeout(function () {
      top.style.transition = 'none'; top.removeAttribute('data-out'); top.style.transform = 'translateY(' + (11 * 8) + 'px) scale(.5)'; void top.offsetWidth; top.style.transition = ''; deck.busy = false; layout();
    }, 470);
  }
  function startTimer() {
    clearInterval(deck.timer); deck.timer = setInterval(function () {
      var d = $('tool-deck'), w = $('step-welcome'); if (!d || !w || w.classList.contains('hidden') || document.hidden || deck.down || deck.busy) return;
      var r = d.getBoundingClientRect(); if (r.bottom < 0 || r.top > window.innerHeight) return; next(-1);
    }, 5000);
  }
  function buildDeck() {
    var grid = document.querySelector('#step-welcome > .grid.grid-cols-2'); if (!grid) return; var btns = srcButtons(); if (btns.length < 12) return;
    var box = $('tool-deck');
    if (!box) {
      box = document.createElement('div'); box.id = 'tool-deck'; box.setAttribute('data-noswipe', ''); box.setAttribute('role', 'region'); box.setAttribute('aria-label', 'Tool cards');
      var h = '<div class="td-head"><p>🧰 What each tool does</p><small>Swipe or tap</small></div><div class="td-wrap">';
      TOOLS.forEach(function (t, i) {
        h += '<div class="td-card" data-i="' + i + '" style="background:linear-gradient(135deg,' + t.c[0] + ',' + t.c[1] + ')"><div class="td-ic">' + iconHtml(btns[i]) + '</div><div class="td-tx"><b>' + t.t.replace(/&/g, '&amp;') + '</b><span>' + t.d + '</span><em>Open ›</em></div></div>';
      });
      h += '</div><div class="td-dots">' + TOOLS.map(function () { return '<i></i>'; }).join('') + '</div>';
      box.innerHTML = h; grid.parentNode.insertBefore(box, grid.nextSibling); bindDeck(box); layout(); startTimer();
    } else if (box.previousElementSibling !== grid) grid.parentNode.insertBefore(box, grid.nextSibling);
  }
  function bindDeck(box) {
    var wrap = box.querySelector('.td-wrap'), sx = 0, sy = 0, st = 0, moved = false, card = null, dx = 0;
    wrap.addEventListener('pointerdown', function (e) {
      if (deck.busy) return; var cs = box.querySelectorAll('.td-card'); card = cs[deck.cur]; if (!card) return;
      sx = e.clientX; sy = e.clientY; st = Date.now(); moved = false; dx = 0; deck.down = true;
    });
    wrap.addEventListener('pointermove', function (e) {
      if (!deck.down || !card) return; dx = e.clientX - sx; var dy = e.clientY - sy;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { moved = true; card.classList.add('td-drag'); try { wrap.setPointerCapture(e.pointerId); } catch (x) { } }
      if (moved) card.style.transform = 'translate(' + dx + 'px,0) rotate(' + (dx / 14) + 'deg)';
    });
    function up() {
      if (!deck.down) return; deck.down = false; if (!card) return; card.classList.remove('td-drag');
      if (moved && Math.abs(dx) > 55) { var c = card, d = dx > 0 ? 1 : -1; card = null; next(d); startTimer(); return; }
      if (moved) { layout(); startTimer(); card = null; return; }
      if (Date.now() - st < 500) { var i = +card.getAttribute('data-i'), t = TOOLS[i]; card = null; open(t, i); } else card = null;
    }
    wrap.addEventListener('pointerup', up); wrap.addEventListener('pointercancel', function () { if (card) { card.classList.remove('td-drag'); layout(); } deck.down = false; card = null; });
    wrap.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') next(e.key === 'ArrowRight' ? 1 : -1); });
  }
  function open(t, i) {
    var b = srcButtons()[i]; if (b) b.click(); else if (t.go === '#adviser' && window.openAdviser) window.openAdviser(); else if (window.goToStep) window.goToStep(t.go, 0);
  }

  /* ---------------- Page order ---------------- */
  function place() {
    var w = $('step-welcome'); if (!w) return;
    buildDeck();
    var xp = $('xp-chip'), goal = $('goal-card');
    if (xp && goal && goal.previousElementSibling !== xp) xp.parentNode.insertBefore(goal, xp.nextSibling);
    /* lesson + weekly move -> My Action Plan, before "Take it with you" */
    var ap = $('step-action-plan'), dc = $('daily-card'), wc = $('weekly-card');
    if (ap && (dc || wc)) {
      var take = [].slice.call(ap.querySelectorAll('.no-print')).filter(function (e) { return /Take it with you/i.test(e.textContent); })[0];
      if (take) {
        [dc, wc].forEach(function (e) { if (e && e.nextElementSibling !== take && e.parentNode !== take.parentNode) take.parentNode.insertBefore(e, take); });
        if (dc && wc && dc.parentNode === take.parentNode) { take.parentNode.insertBefore(dc, take); take.parentNode.insertBefore(wc, take); }
      }
      if (dc) dc.classList.remove('mt-3'); if (dc) dc.classList.add('mt-1');
    }
  }

  /* ---------------- Avatars ---------------- */
  window.toggleAvatars = function (force) {
    var p = $('av-pick'), b = $('av-toggle'), t = $('av-toggle-t'); if (!p) return;
    var open = typeof force === 'boolean' ? force : p.classList.contains('hidden');
    p.classList.toggle('hidden', !open); if (b) b.setAttribute('aria-expanded', open ? 'true' : 'false'); if (t) t.textContent = open ? '✖ Hide avatars' : '🎭 Change an Avatar';
    if (open && p.scrollIntoView) { try { p.scrollIntoView({ behavior: fxOff() ? 'auto' : 'smooth', block: 'nearest' }); } catch (e) { } }
  };
  var _ch = window.chooseAvatar; if (_ch) window.chooseAvatar = function () { var r = _ch.apply(this, arguments); window.toggleAvatars(false); return r; };

  /* ---------------- hooks ---------------- */
  function hook() {
    var g = window.goToStep; if (!g || g._v15) return;
    window.goToStep = function (id) { var r = g.apply(this, arguments); try { if (id === 'step-profile') window.toggleAvatars(false); setTimeout(place, 30); } catch (e) { } return r; };
    window.goToStep._v15 = 1;
  }
  function init() { css(); hook(); place(); setTimeout(place, 400); setTimeout(place, 1500); document.addEventListener('visibilitychange', function () { if (!document.hidden) place(); }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
