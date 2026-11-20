/* Promotion Warfare V16 - "Learning Daily Games"
   One game a day on the Welcome page, after "Road to promotion".
   Each game has its own animated war scene. Tap the scene to play. */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var GAMES = [
    { go: 'step-game', e: '🎮', t: 'Office Politics Game', d: 'Read an office story and pick the smart move.', sky: ['#0f172a', '#312e81', '#6366f1'] },
    { go: 'step-boss12', e: '👹', t: 'Boss Battles', d: 'Fight an office boss with smart replies.', sky: ['#3b0764', '#be123c', '#f97316'] },
    { go: 'step-swipe', e: '🃏', t: 'Swipe Cards', d: 'Smart move or mistake? Swipe fast.', sky: ['#0c4a6e', '#6d28d9', '#c084fc'] },
    { go: 'step-flags', e: '🚩', t: 'Spot the Red Flag', d: 'Find the warning signs in chats and emails.', sky: ['#422006', '#b45309', '#fbbf24'] },
    { go: 'step-makeover', e: '✍️', t: 'Message Makeover', d: 'Turn a risky message into a calm one.', sky: ['#1c1917', '#7c2d12', '#ea580c'] },
    { go: 'step-bingo', e: '🎯', t: 'Buzzword Bingo', d: 'Office talk, decoded. Mark words in meetings.', sky: ['#064e3b', '#0f766e', '#f59e0b'] },
    { go: 'step-spin', e: '🎡', t: 'Daily Spin', d: 'One free spin for XP and missions.', sky: ['#1e1b4b', '#86198f', '#f472b6'] }
  ];

  /* ---------- date helpers ---------- */
  function dayNo() { var d = new Date(); return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5); }
  function todayIdx() { return dayNo() % GAMES.length; }
  function dayKey() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function opened() { try { var o = JSON.parse(localStorage.getItem('pw_dg16') || '{}'); return o.d === dayKey(); } catch (e) { return false; } }
  function markOpened() { try { localStorage.setItem('pw_dg16', JSON.stringify({ d: dayKey(), g: todayIdx() })); } catch (e) { } }

  /* ---------- CSS ---------- */
  function css() {
    if ($('v16-css')) return; var s = document.createElement('style'); s.id = 'v16-css';
    s.textContent = [
      '#daily-games{margin:12px 0}',
      '.dg-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px}',
      '.dg-head p{font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#fcd34d;margin:0}',
      '.dg-head small{font-size:10px;color:#94a3b8}.dg-done{color:#6ee7b7!important;font-weight:700}',
      '.dg-scene{display:block;width:100%;padding:0;border:1px solid rgba(251,191,36,.35);border-radius:20px;overflow:hidden;background:#0b1220;text-align:left;box-shadow:0 8px 22px rgba(0,0,0,.4);-webkit-tap-highlight-color:transparent;cursor:pointer}',
      '.dg-scene:active{transform:scale(.985)}',
      '.dg-svg{display:block;width:100%;height:auto}',
      '.dg-svg *{transform-box:view-box}',
      '.dg-info{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 14px 12px;background:linear-gradient(180deg,#111827,#0b1220);color:#fff}',
      '.dg-tx{flex:1;min-width:0}.dg-info b{display:block;font-size:15px;line-height:1.15}.dg-d{display:block;font-size:11.5px;color:#cbd5e1;margin-top:3px;line-height:1.25}',
      '.dg-go{flex:none;font-size:12px;font-weight:900;color:#1f2937;background:linear-gradient(90deg,#fbbf24,#f59e0b);padding:8px 12px;border-radius:999px;box-shadow:0 3px 10px rgba(245,158,11,.4);white-space:nowrap}',
      'html.fx-full .dg-go{animation:dgGo 1.8s ease-in-out infinite}@keyframes dgGo{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}',
      '.dg-foot{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px}',
      '.dg-dots{display:flex;gap:5px}.dg-dots i{width:7px;height:7px;border-radius:50%;background:#475569}.dg-dots i.on{background:#fbbf24;width:18px;border-radius:4px}',
      '.dg-foot small{font-size:10.5px;color:#94a3b8;text-align:right}',
      /* common motion (only in Full effects) */
      'html.fx-full .dg-flag{animation:dgFlag 1.3s ease-in-out infinite alternate}@keyframes dgFlag{from{transform:skewY(-9deg) scaleX(1)}to{transform:skewY(9deg) scaleX(.82)}}',
      '.dg-flag{transform-box:fill-box!important;transform-origin:0 0}',
      'html.fx-full .dg-em{animation:dgEm 3.4s ease-out infinite}@keyframes dgEm{0%{transform:translate(0,0);opacity:0}15%{opacity:.95}100%{transform:translate(10px,-46px);opacity:0}}',
      'html.fx-full .dg-st{animation:dgSt 2.2s ease-in-out infinite alternate}@keyframes dgSt{from{opacity:.2}to{opacity:1}}',
      'html.fx-full .dg-fl{animation:dgFl .45s ease-in-out infinite alternate;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgFl{from{transform:scale(.9,1)}to{transform:scale(1.12,1.2)}}',
      /* 1 war room */
      'html.fx-full .dg-march{animation:dgMarch 1s linear infinite}@keyframes dgMarch{to{stroke-dashoffset:-16}}',
      'html.fx-full .dg-pawn{animation:dgPawn 6s ease-in-out infinite}@keyframes dgPawn{0%,6%{transform:translate(0,0);opacity:1}60%,88%{transform:translate(160px,-2px);opacity:1}96%{transform:translate(160px,-2px);opacity:0}97%{transform:translate(0,0);opacity:0}100%{transform:translate(0,0);opacity:1}}',
      'html.fx-full .dg-pawn .dg-hop{animation:dgHop .5s ease-in-out infinite alternate}@keyframes dgHop{from{transform:translateY(0)}to{transform:translateY(-3px)}}',
      'html.fx-full .dg-rival{animation:dgRival 1.6s ease-in-out infinite alternate;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgRival{from{transform:rotate(-6deg)}to{transform:rotate(6deg)}}',
      'html.fx-full .dg-plant{animation:dgPlant 6s ease-out infinite;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgPlant{0%,58%{transform:scale(0)}66%{transform:scale(1.25)}72%,95%{transform:scale(1)}100%{transform:scale(0)}}',
      'html.fx-full .dg-bub{animation:dgBub 3s ease-in-out infinite alternate}@keyframes dgBub{from{transform:translateY(0)}to{transform:translateY(-5px)}}',
      /* 2 boss */
      'html.fx-full .dg-hero{animation:dgHero 3.2s ease-in-out infinite}@keyframes dgHero{0%,40%,70%,100%{transform:translateX(0)}52%{transform:translateX(44px)}}',
      'html.fx-full .dg-sword{animation:dgSword 3.2s ease-in-out infinite}@keyframes dgSword{0%,40%,70%,100%{transform:rotate(-55deg)}52%{transform:rotate(25deg)}}',
      'html.fx-full .dg-slash{animation:dgSlash 3.2s ease-out infinite}@keyframes dgSlash{0%,48%{stroke-dashoffset:90;opacity:0}52%{opacity:1}64%{stroke-dashoffset:0;opacity:0}100%{opacity:0}}',
      'html.fx-full .dg-boss{animation:dgBoss 3.2s ease-in-out infinite;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgBoss{0%,50%,70%,100%{transform:translate(0,0) scale(1)}54%{transform:translate(6px,0) scale(.96)}58%{transform:translate(-4px,0) scale(1.02)}62%{transform:translate(3px,0)}}',
      'html.fx-full .dg-hpb{animation:dgHpb 6.4s ease-in-out infinite;transform-box:fill-box!important;transform-origin:0 50%}@keyframes dgHpb{0%,48%{transform:scaleX(1)}56%,90%{transform:scaleX(.4)}98%,100%{transform:scaleX(1)}}',
      'html.fx-full .dg-dmg{animation:dgDmg 3.2s ease-out infinite}@keyframes dgDmg{0%,52%{opacity:0;transform:translateY(0)}58%{opacity:1}85%,100%{opacity:0;transform:translateY(-22px)}}',
      /* 3 swipe */
      'html.fx-full .dg-cA{animation:dgCA 6s ease-in-out infinite;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgCA{0%,38%{opacity:1;transform:translate(0,0) rotate(0)}50%{opacity:0;transform:translate(120px,-8px) rotate(20deg)}99%{opacity:0;transform:translate(120px,-8px) rotate(20deg)}100%{opacity:1;transform:translate(0,0) rotate(0)}}',
      'html.fx-full .dg-cB{animation:dgCB 6s ease-in-out infinite;transform-box:fill-box!important;transform-origin:50% 100%}@keyframes dgCB{0%,50%{opacity:0;transform:translate(0,0) scale(.9)}58%,88%{opacity:1;transform:translate(0,0) scale(1)}98%{opacity:0;transform:translate(-120px,-8px) rotate(-20deg)}100%{opacity:0}}',
      'html.fx-full .dg-good{animation:dgGood 6s ease-out infinite;transform-box:fill-box!important;transform-origin:center}@keyframes dgGood{0%,44%,66%,100%{transform:scale(1)}52%{transform:scale(1.4)}}',
      'html.fx-full .dg-bad{animation:dgBad 6s ease-out infinite;transform-box:fill-box!important;transform-origin:center}@keyframes dgBad{0%,90%{transform:scale(1)}97%{transform:scale(1.4)}100%{transform:scale(1)}}',
      /* 4 red flag */
      'html.fx-full .dg-beam{animation:dgBeam 4.5s ease-in-out infinite alternate;transform-origin:46px 62px}@keyframes dgBeam{from{transform:rotate(-12deg)}to{transform:rotate(12deg)}}',
      'html.fx-full .dg-ring{animation:dgRing 2.1s ease-out infinite;transform-box:fill-box!important;transform-origin:center}@keyframes dgRing{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.4);opacity:0}}',
      'html.fx-full .dg-excl{animation:dgExcl .6s ease-in-out infinite alternate}@keyframes dgExcl{from{transform:translateY(0)}to{transform:translateY(-4px)}}',
      /* 5 forge */
      'html.fx-full .dg-ham{animation:dgHam 3.2s ease-in-out infinite;transform-origin:240px 40px}@keyframes dgHam{0%{transform:rotate(40deg)}12%{transform:rotate(-24deg)}20%{transform:rotate(32deg)}32%{transform:rotate(-24deg)}40%{transform:rotate(32deg)}52%{transform:rotate(-24deg)}64%,100%{transform:rotate(40deg)}}',
      'html.fx-full .dg-sp{animation:dgSp 3.2s ease-out infinite;transform-origin:178px 70px}@keyframes dgSp{0%,10%{opacity:0;transform:scale(.2)}13%{opacity:1;transform:scale(1)}21%{opacity:0;transform:scale(2)}30%{opacity:0;transform:scale(.2)}33%{opacity:1;transform:scale(1)}41%{opacity:0;transform:scale(2)}50%{opacity:0;transform:scale(.2)}53%{opacity:1;transform:scale(1)}61%,100%{opacity:0;transform:scale(2)}}',
      'html.fx-full .dg-m1{animation:dgM1 3.2s ease-in-out infinite}@keyframes dgM1{0%,54%{opacity:1}60%,96%{opacity:0}100%{opacity:1}}',
      'html.fx-full .dg-m2{animation:dgM2 3.2s ease-in-out infinite}@keyframes dgM2{0%,54%{opacity:0}62%,92%{opacity:1}98%,100%{opacity:0}}',
      'html.fx-full .dg-glow{animation:dgGlow 1.1s ease-in-out infinite alternate}@keyframes dgGlow{from{opacity:.55}to{opacity:1}}',
      '.dg-m2{opacity:0}.dg-m1{opacity:1}html:not(.fx-full) .dg-m1{opacity:0}html:not(.fx-full) .dg-m2{opacity:1}',
      /* 6 bingo */
      'html.fx-full .dg-arrow{animation:dgArrow 2.8s ease-in infinite}@keyframes dgArrow{0%{transform:translateX(-8px);opacity:1}26%{transform:translateX(-8px)}40%{transform:translateX(128px)}43%{transform:translateX(125px)}47%{transform:translateX(128px)}88%{transform:translateX(128px);opacity:1}96%{transform:translateX(128px);opacity:0}100%{transform:translateX(-8px);opacity:0}}',
      'html.fx-full .dg-tgt{animation:dgTgt 2.8s ease-out infinite;transform-box:fill-box!important;transform-origin:center}@keyframes dgTgt{0%,39%{transform:scale(1)}42%{transform:scale(1.08)}50%,100%{transform:scale(1)}}',
      'html.fx-full .dg-win{animation:dgWin 2.8s ease-out infinite;transform-box:fill-box!important;transform-origin:center}@keyframes dgWin{0%,40%{opacity:0;transform:scale(.3)}48%{opacity:1;transform:scale(1.2)}56%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:0}}',
      'html.fx-full .dg-tag{animation:dgTag 2.6s ease-in-out infinite alternate}@keyframes dgTag{from{transform:translateY(0)}to{transform:translateY(-5px)}}',
      'html.fx-full .dg-string{animation:dgStr 2.8s ease-in infinite;transform-origin:62px 75px}@keyframes dgStr{0%{transform:scaleX(1)}24%{transform:scaleX(1.0)}26%{transform:scaleX(.6)}30%,100%{transform:scaleX(1)}}',
      '.dg-win{opacity:0}html:not(.fx-full) .dg-win{opacity:1}',
      /* 7 spin */
      'html.fx-full .dg-wheel{animation:dgWheel 6s cubic-bezier(.12,.6,.18,1) infinite;transform-origin:160px 78px}@keyframes dgWheel{0%{transform:rotate(0)}65%,100%{transform:rotate(1080deg)}}',
      'html.fx-full .dg-xp{animation:dgXp 6s ease-out infinite}@keyframes dgXp{0%,64%{opacity:0;transform:translateY(8px) scale(.6)}72%{opacity:1;transform:translateY(0) scale(1.15)}78%,92%{opacity:1;transform:scale(1)}100%{opacity:0;transform:translateY(-8px)}}',
      '.dg-xp{opacity:0}html:not(.fx-full) .dg-xp{opacity:1}',
      'html.fx-full .dg-twk{animation:dgTwk 1.2s ease-in-out infinite alternate;transform-box:fill-box!important;transform-origin:center}@keyframes dgTwk{from{transform:scale(.5);opacity:.3}to{transform:scale(1.2);opacity:1}}'
    ].join('\n'); document.head.appendChild(s);
  }

  /* ---------- SVG pieces ---------- */
  var n = 0;
  function base(sky, opt) {
    opt = opt || {}; var id = 'dgsky' + (++n), k, st = '', em = '';
    for (k = 0; k < 7; k++) st += '<circle class="dg-st" cx="' + (18 + k * 46 + (k % 3) * 9) + '" cy="' + (8 + (k * 11) % 28) + '" r="1.1" fill="#fef9c3" style="animation-delay:' + (k * 0.3) + 's"/>';
    for (k = 0; k < 4; k++) em += '<circle class="dg-em" cx="' + (60 + k * 62) + '" cy="116" r="1.6" fill="#fb923c" style="animation-delay:' + (k * 0.85) + 's"/>';
    var flags = opt.noflags ? '' :
      '<rect x="9" y="38" width="1.8" height="80" fill="#e2e8f0"/><path class="dg-flag" d="M10.8 38h20l-5 6 5 6h-20z" fill="#ef4444"/>' +
      '<rect x="309" y="38" width="1.8" height="80" fill="#e2e8f0"/><path class="dg-flag" d="M309 38h-20l5 6-5 6h20z" fill="#fbbf24"/>';
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky[0] + '"/><stop offset=".6" stop-color="' + sky[1] + '"/><stop offset="1" stop-color="' + sky[2] + '"/></linearGradient></defs>' +
      '<rect width="320" height="136" fill="url(#' + id + ')"/>' + st +
      '<polygon points="0,104 40,70 78,96 126,60 172,98 220,66 268,96 320,74 320,136 0,136" fill="#0f172a" opacity=".55"/>' +
      (opt.ground === false ? '' : '<rect y="118" width="320" height="18" fill="#1e293b"/><rect y="118" width="320" height="2" fill="#fbbf24" opacity=".4"/>') + flags + em;
  }
  function pawn(x, y, c, cls) {
    return '<g transform="translate(' + x + ',' + y + ')"><g class="' + (cls || '') + '"><ellipse cx="0" cy="0" rx="9" ry="2.6" fill="#000" opacity=".35"/><path d="M-8 0 Q-5 -15 0 -15 Q5 -15 8 0Z" fill="' + c + '"/><circle cx="0" cy="-21" r="6" fill="' + c + '"/><rect x="-9" y="-2" width="18" height="3" rx="1.5" fill="' + c + '"/></g></g>';
  }

  var SCENES = [
    /* 0 Office Politics Game: war room map table */
    function (g) {
      return base(g.sky) +
        '<ellipse cx="16" cy="108" rx="10" ry="3" fill="#000" opacity=".3"/><rect x="14" y="92" width="4" height="22" fill="#78350f"/><path class="dg-fl" d="M16 92c-6-4-4-12 0-16 1 5 7 6 4 14-1 2-3 3-4 2z" fill="#f59e0b"/>' +
        '<ellipse cx="304" cy="108" rx="10" ry="3" fill="#000" opacity=".3"/><rect x="302" y="92" width="4" height="22" fill="#78350f"/><path class="dg-fl" d="M304 92c-6-4-4-12 0-16 1 5 7 6 4 14-1 2-3 3-4 2z" fill="#f59e0b" style="animation-delay:.2s"/>' +
        '<rect x="30" y="104" width="260" height="14" rx="3" fill="#78350f"/><rect x="30" y="104" width="260" height="3" fill="#a16207"/>' +
        '<polygon points="50,74 270,74 288,100 32,100" fill="#fde68a" opacity=".95"/><polygon points="50,74 270,74 288,100 32,100" fill="none" stroke="#b45309" stroke-width="1.5"/>' +
        '<path class="dg-march" d="M62 92 C104 82 142 94 190 86 S236 84 246 88" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="5 4" stroke-linecap="round"/>' +
        '<circle cx="124" cy="88" r="3" fill="#b45309" opacity=".5"/><circle cx="188" cy="86" r="3" fill="#b45309" opacity=".5"/>' +
        '<g><rect x="250" y="58" width="26" height="30" fill="#94a3b8"/><path d="M247 58h4v-5h4v5h4v-5h4v5h4v-5h4v5h4v-5h2v7h-26z" fill="#94a3b8"/><path d="M257 88v-10a6 6 0 0 1 12 0v10z" fill="#0f172a"/><rect x="262.4" y="38" width="1.6" height="17" fill="#e2e8f0"/><path class="dg-flag" d="M264 38h12l-3.5 4.5 3.5 4.5h-12z" fill="#ef4444"/></g>' +
        pawn(138, 94, '#dc2626', 'dg-rival') + pawn(200, 98, '#dc2626', 'dg-rival') +
        '<g transform="translate(68,94)"><g class="dg-pawn"><g class="dg-hop"><ellipse cx="0" cy="0" rx="9" ry="2.6" fill="#000" opacity=".35"/><path d="M-8 0 Q-5 -15 0 -15 Q5 -15 8 0Z" fill="#fbbf24"/><circle cx="0" cy="-21" r="6" fill="#fbbf24"/><rect x="-9" y="-2" width="18" height="3" rx="1.5" fill="#fbbf24"/><path d="M-4 -26l2 -4 2 3 2 -3 2 4z" fill="#fff7ae"/></g></g></g>' +
        '<g class="dg-plant"><rect x="236" y="70" width="1.6" height="18" fill="#e2e8f0"/><path d="M237.6 70h10l-3 3.5 3 3.5h-10z" fill="#22c55e"/></g>' +
        '<g class="dg-bub"><text x="92" y="52" font-size="20">💬</text><text x="214" y="46" font-size="18">⚖️</text></g>';
    },
    /* 1 Boss Battles */
    function (g) {
      return base(g.sky) +
        '<rect x="198" y="26" width="76" height="11" rx="5" fill="#0f172a" stroke="#fff" stroke-opacity=".5"/><rect class="dg-hpb" x="200" y="28" width="72" height="7" rx="3.5" fill="#ef4444"/><text x="196" y="22" font-size="9" fill="#fff" font-weight="700">BOSS</text>' +
        '<g class="dg-boss"><text x="205" y="112" font-size="68">👹</text></g>' +
        '<text class="dg-dmg" x="232" y="64" font-size="18" font-weight="900" fill="#fde047" stroke="#7f1d1d" stroke-width="1">-25</text>' +
        '<g class="dg-hero"><text x="38" y="116" font-size="50">🛡️</text>' +
        '<g class="dg-sword" style="transform-origin:100px 84px"><rect x="98" y="34" width="4" height="50" rx="1" fill="#e2e8f0"/><path d="M98 34L100 24L102 34Z" fill="#f1f5f9"/><rect x="93" y="82" width="14" height="4" rx="2" fill="#fbbf24"/><rect x="98.5" y="86" width="3" height="9" fill="#7c2d12"/></g></g>' +
        '<path class="dg-slash" d="M138 40 Q182 66 160 110" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-dasharray="90" stroke-dashoffset="90"/>' +
        '<text x="150" y="30" font-size="14" class="dg-bub">⚔️</text>';
    },
    /* 2 Swipe Cards */
    function (g) {
      function card(cls, op) { return '<g class="' + cls + '" ' + (op ? 'style="opacity:' + op + '"' : '') + '><rect x="112" y="26" width="96" height="92" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/><rect x="124" y="38" width="72" height="8" rx="4" fill="#cbd5e1"/><rect x="124" y="52" width="58" height="6" rx="3" fill="#e2e8f0"/><g transform="translate(160,86)"><rect x="-1.5" y="-18" width="3" height="34" rx="1" fill="#64748b" transform="rotate(40)"/><rect x="-1.5" y="-18" width="3" height="34" rx="1" fill="#64748b" transform="rotate(-40)"/><circle r="4" fill="#fbbf24"/></g></g>'; }
      return base(g.sky) +
        '<g class="dg-bad"><circle cx="48" cy="72" r="28" fill="#ef4444" opacity=".9"/><path d="M38 62l20 20M58 62l-20 20" stroke="#fff" stroke-width="6" stroke-linecap="round"/></g>' +
        '<g class="dg-good"><circle cx="272" cy="72" r="28" fill="#22c55e" opacity=".9"/><path d="M259 72l9 9 17-18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>' +
        '<text x="48" y="112" font-size="9" fill="#fecaca" text-anchor="middle" font-weight="800">MISTAKE</text><text x="272" y="112" font-size="9" fill="#bbf7d0" text-anchor="middle" font-weight="800">SMART</text>' +
        '<path d="M86 60l-8 12 8 12M234 60l8 12-8 12" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
        card('dg-cB', '') + card('dg-cA', '');
    },
    /* 3 Spot the Red Flag */
    function (g) {
      function flag(x, c, red) { return '<rect x="' + x + '" y="78" width="2" height="40" fill="#e2e8f0"/><path class="dg-flag" d="M' + (x + 2) + ' 78h22l-6 7 6 7h-22z" fill="' + c + '"/>' + (red ? '<circle class="dg-ring" cx="' + (x + 12) + '" cy="85" r="10" fill="none" stroke="#fca5a5" stroke-width="2.5" style="animation-delay:' + (x % 3 * 0.5) + 's"/><text class="dg-excl" x="' + (x + 8) + '" y="68" font-size="16" font-weight="900" fill="#fef08a" stroke="#7f1d1d" stroke-width=".8">!</text>' : ''); }
      return base(g.sky, { noflags: true }) +
        '<g class="dg-beam"><polygon points="46,62 330,20 330,118" fill="#fde68a" opacity=".28"/></g>' +
        '<rect x="22" y="58" width="26" height="60" fill="#57534e"/><polygon points="18,58 35,40 52,58" fill="#7c2d12"/><rect x="31" y="70" width="8" height="12" rx="4" fill="#fde68a"/><rect x="27" y="58" width="3" height="4" fill="#57534e"/><circle cx="46" cy="62" r="3.5" fill="#fde68a"/>' +
        flag(130, '#ef4444', true) + flag(196, '#22c55e', false) + flag(262, '#ef4444', true) +
        '<text x="64" y="108" font-size="20" class="dg-bub">🔭</text>';
    },
    /* 4 Message Makeover: forge */
    function (g) {
      return base(g.sky, { noflags: true }) +
        '<defs><radialGradient id="dgfg"><stop offset="0" stop-color="#fb923c"/><stop offset="1" stop-color="#fb923c" stop-opacity="0"/></radialGradient></defs>' +
        '<circle class="dg-glow" cx="52" cy="100" r="52" fill="url(#dgfg)"/>' +
        '<rect x="20" y="86" width="64" height="32" rx="4" fill="#44403c"/><rect x="30" y="94" width="44" height="24" rx="3" fill="#0c0a09"/><path class="dg-fl" d="M38 118c-6-10-2-18 4-24 1 6 8 8 6 16 3-3 5-6 5-10 6 8 4 16-1 18z" fill="#f97316"/><path class="dg-fl" d="M46 118c-3-6 0-10 3-13 1 3 4 4 3 8z" fill="#fde047" style="animation-delay:.15s"/>' +
        '<g><rect x="124" y="108" width="72" height="10" fill="#334155"/><rect x="140" y="98" width="40" height="12" fill="#475569"/><path d="M116 88h92v12h-80z" fill="#64748b"/><rect x="118" y="86" width="90" height="5" rx="2" fill="#94a3b8"/></g>' +
        '<g><rect x="128" y="58" width="64" height="26" rx="5" fill="#fde68a" stroke="#b45309" stroke-width="2"/><circle cx="128" cy="71" r="6" fill="#fcd34d" stroke="#b45309" stroke-width="2"/><circle cx="192" cy="71" r="6" fill="#fcd34d" stroke="#b45309" stroke-width="2"/>' +
        '<text class="dg-m1" x="160" y="76" font-size="14" font-weight="900" text-anchor="middle" fill="#dc2626">NOW!!!</text><text class="dg-m2" x="160" y="76" font-size="13" font-weight="900" text-anchor="middle" fill="#15803d">Thank you</text></g>' +
        '<g class="dg-ham"><rect x="186" y="38" width="54" height="5" rx="2" fill="#92400e"/><rect x="176" y="29" width="20" height="23" rx="3" fill="#94a3b8" stroke="#475569" stroke-width="1.5"/></g>' +
        '<g class="dg-sp"><path d="M178 70l2-9 2 9 9 2-9 2-2 9-2-9-9-2z" fill="#fde047"/><circle cx="164" cy="64" r="2" fill="#fb923c"/><circle cx="196" cy="62" r="2" fill="#fb923c"/><circle cx="172" cy="52" r="1.6" fill="#fde047"/></g>';
    },
    /* 5 Buzzword Bingo: archery */
    function (g) {
      return base(g.sky) +
        '<rect x="243" y="84" width="4" height="34" fill="#78350f"/><g class="dg-tgt"><circle cx="245" cy="75" r="36" fill="#f8fafc" stroke="#64748b" stroke-width="2"/><circle cx="245" cy="75" r="27" fill="#ef4444"/><circle cx="245" cy="75" r="19" fill="#f8fafc"/><circle cx="245" cy="75" r="11" fill="#ef4444"/><circle cx="245" cy="75" r="4.5" fill="#fbbf24"/></g>' +
        '<g class="dg-tag"><rect x="92" y="22" width="52" height="16" rx="8" fill="#0f172a" opacity=".75"/><text x="118" y="33.5" font-size="9.5" fill="#fde68a" text-anchor="middle" font-weight="700">synergy</text></g>' +
        '<g class="dg-tag" style="animation-delay:.6s"><rect x="150" y="12" width="62" height="16" rx="8" fill="#0f172a" opacity=".75"/><text x="181" y="23.5" font-size="9.5" fill="#fde68a" text-anchor="middle" font-weight="700">circle back</text></g>' +
        '<path d="M64 38 Q36 75 64 112" fill="none" stroke="#92400e" stroke-width="5" stroke-linecap="round"/><path class="dg-string" d="M64 38 L64 112" fill="none" stroke="#fef3c7" stroke-width="1.5"/>' +
        '<g class="dg-arrow"><rect x="64" y="74" width="48" height="2.4" fill="#e7e5e4"/><path d="M112 70.5l12 4.7-12 4.7z" fill="#cbd5e1"/><path d="M64 70l8 5-8 5zM70 70l8 5-8 5z" fill="#ef4444"/></g>' +
        '<g class="dg-win"><text x="245" y="26" font-size="17" font-weight="900" text-anchor="middle" fill="#fde047" stroke="#7c2d12" stroke-width=".9">BINGO!</text></g>';
    },
    /* 6 Daily Spin: war wheel */
    function (g) {
      var wedges = '', lab = ['⚡', '🎁', '❄️', '🔥', '⭐', '🛡️', '🎯', '💎'], cols = ['#dc2626', '#fbbf24', '#7c3aed', '#fbbf24'], r = 54, cx = 160, cy = 78, k, a0, a1, x0, y0, x1, y1, am, lx, ly;
      for (k = 0; k < 8; k++) {
        a0 = (k * 45 - 90 - 22.5) * Math.PI / 180; a1 = ((k + 1) * 45 - 90 - 22.5) * Math.PI / 180; am = (a0 + a1) / 2;
        x0 = cx + r * Math.cos(a0); y0 = cy + r * Math.sin(a0); x1 = cx + r * Math.cos(a1); y1 = cy + r * Math.sin(a1);
        wedges += '<path d="M' + cx + ' ' + cy + 'L' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'A' + r + ' ' + r + ' 0 0 1 ' + x1.toFixed(1) + ' ' + y1.toFixed(1) + 'Z" fill="' + (k % 2 ? '#1e293b' : cols[(k / 2) % 4 | 0]) + '" stroke="#0f172a" stroke-width="1"/>';
        lx = cx + 36 * Math.cos(am); ly = cy + 36 * Math.sin(am) + 4.5; wedges += '<text x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-size="13" text-anchor="middle">' + lab[k] + '</text>';
      }
      return base(g.sky) +
        '<ellipse cx="160" cy="132" rx="44" ry="4" fill="#000" opacity=".35"/>' +
        '<g class="dg-wheel">' + wedges + '<circle cx="160" cy="78" r="54" fill="none" stroke="#fbbf24" stroke-width="5"/></g>' +
        '<circle cx="160" cy="78" r="12" fill="#fbbf24" stroke="#7c2d12" stroke-width="2"/><path d="M160 72l5 8h-10z" fill="#7c2d12"/>' +
        '<polygon points="150,4 170,4 160,28" fill="#f8fafc" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round"/>' +
        '<g class="dg-xp"><text x="252" y="64" font-size="20" font-weight="900" fill="#fde047" stroke="#7c2d12" stroke-width="1" text-anchor="middle">+10 XP</text><text x="252" y="86" font-size="22" text-anchor="middle">🪙</text></g>' +
        '<text class="dg-twk" x="74" y="56" font-size="16">✨</text><text class="dg-twk" x="92" y="106" font-size="12" style="animation-delay:.5s">✨</text>';
    }
  ];

  /* ---------- build the card ---------- */
  function render() {
    var w = $('step-welcome'), road = $('road-card'); if (!w) return;
    var box = $('daily-games'), i = todayIdx(), g = GAMES[i], nx = GAMES[(i + 1) % GAMES.length];
    if (box && box.getAttribute('data-day') === dayKey()) { place(box); return; }
    if (!box) { box = document.createElement('div'); box.id = 'daily-games'; }
    box.setAttribute('data-day', dayKey()); n = 0;
    var dots = GAMES.map(function (x, k) { return '<i' + (k === i ? ' class="on"' : '') + '></i>'; }).join('');
    box.innerHTML = '<div class="dg-head"><p>⚔️ Learning Daily Games</p><small id="dg-state" class="' + (opened() ? 'dg-done' : '') + '">' + (opened() ? '✅ Opened today' : 'New game every day') + '</small></div>' +
      '<button type="button" class="dg-scene" id="dg-play" aria-label="Play today\'s game: ' + esc(g.t) + '"><svg class="dg-svg" viewBox="0 0 320 136" width="320" height="136" aria-hidden="true" focusable="false">' + SCENES[i](g) + '</svg>' +
      '<span class="dg-info"><span class="dg-tx"><b>' + g.e + ' ' + esc(g.t) + '</b><span class="dg-d">' + esc(g.d) + '</span></span><span class="dg-go">▶ Play now</span></span></button>' +
      '<div class="dg-foot"><div class="dg-dots" aria-hidden="true">' + dots + '</div><small>Game ' + (i + 1) + ' of ' + GAMES.length + ' · Tomorrow: ' + esc(nx.t) + '</small></div>';
    box.querySelector('#dg-play').onclick = (function () { markOpened(); var s = $('dg-state'); if (s) { s.className = 'dg-done'; s.textContent = '✅ Opened today'; } if (window.goToStep) window.goToStep(g.go, 0); });
    place(box);
  }
  function place(b) {
    var box = b || $('daily-games'), road = $('road-card'); if (!box || !road || !road.parentNode) return;
    if (road.nextElementSibling !== box) road.parentNode.insertBefore(box, road.nextSibling);
  }

  /* ---------- "Back" of the games goes to Welcome (they are no longer in Career Tools) ---------- */
  var GAME_PAGES = ['step-game', 'step-boss12', 'step-swipe', 'step-flags', 'step-makeover', 'step-bingo', 'step-spin'], redir = false;
  function fixBack() {
    GAME_PAGES.forEach(function (id) {
      var s = $(id); if (!s) return;
      [].forEach.call(s.querySelectorAll('button[onclick*="step-tools"]'), function (b) {
        b.setAttribute('onclick', "goToStep('step-welcome', 0)"); b.innerHTML = b.innerHTML.replace(/Back to Career Tools/g, 'Back to Welcome');
      });
    });
  }
  function hook() {
    var g = window.goToStep;
    if (g && !g._v16) {
      window.goToStep = function (id) { var a = [].slice.call(arguments); if (redir && id === 'step-tools') { id = 'step-welcome'; a[0] = id; } var r = g.apply(this, a); try { if (id === 'step-welcome') setTimeout(render, 30); fixBack(); } catch (e) { } return r; };
      window.goToStep._v16 = 1;
    }
    var P = window.PW12, G = P && P.g;
    if (G && G.home && !G._v16) { var h = G.home; G.home = function () { redir = true; try { return h.apply(this, arguments); } finally { redir = false; } }; G._v16 = 1; }
  }
  function init() {
    css(); hook(); render(); fixBack();
    setTimeout(function () { hook(); render(); fixBack(); }, 400); setTimeout(function () { hook(); render(); fixBack(); }, 1600);
    setInterval(function () { var b = $('daily-games'); if (b && b.getAttribute('data-day') !== dayKey()) render(); }, 60000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) render(); });
  }
  window.PW16 = { games: GAMES, todayIdx: todayIdx, render: render, scenes: SCENES.length };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
