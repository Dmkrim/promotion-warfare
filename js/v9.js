/* Promotion Warfare V09: Salary Helper, 1:1 Meeting Planner, Boss Style Quiz, Feedback Log, voice input + read-aloud. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  function toast(m) { if (typeof window.showToast === 'function') window.showToast(m); }
  function flag(k, v) { var f = lsGet('pw_flags', {}); if (v === undefined) return f[k]; f[k] = v; lsSet('pw_flags', f); }
  function checkBadges() { if (window.pwCheckBadges) window.pwCheckBadges(); }
  function isoDay(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function copyText(t, okMsg) {
    if (!t) { toast('Nothing to copy yet'); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(okMsg || 'Copied ✓'); }, function () { toast('Select the text and copy it'); });
    else { var ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast(okMsg || 'Copied ✓'); } catch (e) { toast('Select the text and copy it'); } document.body.removeChild(ta); }
  }
  function shareText(t, title) { if (!t) { toast('Nothing to share yet'); return; } if (navigator.share) navigator.share({ title: title || 'Promotion Warfare', text: t }).catch(function () { }); else copyText(t); }
  var INP = 'w-full bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:border-amber-400 outline-none';
  var BTN = 'rounded-xl text-[11px] font-bold active:scale-95 ';
  var CARD = 'p-3 rounded-2xl bg-slate-900/60 border border-slate-700/60';

  /* ---------- badges ---------- */
  var BADGES = [
    { id: 'salplan', e: '💰', n: 'Pay Planner', h: 'Build your plan in the Salary Helper.' },
    { id: 'oneone', e: '🗓️', n: '1:1 Pro', h: 'Finish a meeting in the 1:1 Planner.' },
    { id: 'bossread', e: '🧭', n: 'Boss Reader', h: 'Finish the Boss Style Quiz.' },
    { id: 'mirror', e: '🪞', n: 'Honest Mirror', h: 'Save 5 pieces of feedback.' }
  ];
  (function () { var P = window.PW6 || (window.PW6 = {}); P.BADGES = (P.BADGES || []).concat(BADGES); })();
  var _extra = window.pwExtraBadges;
  window.pwExtraBadges = function () {
    var o = _extra ? _extra() : {}, f = lsGet('pw_flags', {});
    o.salplan = !!f.salplan; o.oneone = !!f.oneone; o.bossread = !!f.bossread; o.mirror = lsGet('pw_fb', []).length >= 5; return o;
  };

  /* ================================================================ voice */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, TTS = ('speechSynthesis' in window) && window.SpeechSynthesisUtterance;
  var rec = null, recId = null;
  function micUI() { var bs = document.querySelectorAll('[data-mic]'); for (var i = 0; i < bs.length; i++) { var on = bs[i].getAttribute('data-mic') === recId; bs[i].textContent = on ? '🔴' : '🎤'; bs[i].setAttribute('aria-pressed', on ? 'true' : 'false'); } }
  window.pwMic = function (id) {
    var inp = $(id); if (!inp) return;
    if (!SR) { toast('Voice input is not supported on this phone'); return; }
    if (rec) { try { rec.stop(); } catch (e) { } if (recId === id) { return; } }
    var base = inp.value, r;
    try { r = new SR(); } catch (e) { toast('Voice input is not available'); return; }
    r.lang = navigator.language || 'en-US'; r.interimResults = true; r.continuous = false;
    r.onresult = function (ev) { var t = ''; for (var i = 0; i < ev.results.length; i++) t += ev.results[i][0].transcript; inp.value = (base ? base.replace(/\s+$/, '') + ' ' : '') + t; try { inp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) { } };
    r.onerror = function (ev) { var m = ev && ev.error; toast(m === 'not-allowed' || m === 'service-not-allowed' ? 'Allow the microphone for this app in your phone settings' : m === 'no-speech' ? 'I did not hear anything. Try again.' : 'Voice input stopped'); };
    r.onend = function () { rec = null; recId = null; micUI(); };
    rec = r; recId = id; micUI();
    try { r.start(); toast('Listening… speak now'); } catch (e) { rec = null; recId = null; micUI(); }
  };
  function micBtn(id) { return SR ? '<button type="button" data-mic="' + id + '" onclick="pwMic(\'' + id + '\')" class="shrink-0 w-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-base active:scale-95" aria-label="Speak instead of typing" title="Speak instead of typing">🎤</button>' : ''; }
  function attachMic(id) {
    var inp = $(id); if (!inp || !SR || inp.parentNode.querySelector('[data-mic="' + id + '"]')) return;
    var holder = document.createElement('span'); holder.innerHTML = micBtn(id).replace('w-10 rounded-xl', 'w-10 ' + (id === 'chat-input' ? 'rounded-2xl' : 'rounded-xl'));
    inp.parentNode.insertBefore(holder.firstChild, inp.nextSibling);
  }
  var speakingBtn = null;
  window.pwStop = function () { try { window.speechSynthesis.cancel(); } catch (e) { } if (speakingBtn) { speakingBtn.textContent = '🔊 Listen'; speakingBtn = null; } };
  window.pwSpeak = function (text, btn) {
    if (!TTS) { toast('Read-aloud is not supported on this phone'); return; }
    var was = speakingBtn === btn; window.pwStop(); if (was && btn) return;
    text = String(text || '').replace(/\s+/g, ' ').trim(); if (!text) return;
    var u = new SpeechSynthesisUtterance(text.slice(0, 1800)); u.lang = navigator.language || 'en-US'; u.rate = 0.95;
    u.onend = u.onerror = function () { if (speakingBtn === btn && btn) { btn.textContent = '🔊 Listen'; speakingBtn = null; } };
    if (btn) { speakingBtn = btn; btn.textContent = '⏹ Stop'; }
    try { window.speechSynthesis.speak(u); } catch (e) { }
  };
  function listenBtn(targetId) { return TTS ? '<button type="button" onclick="pwSpeak(document.getElementById(\'' + targetId + '\').innerText,this)" class="px-2 py-1 ' + BTN + 'bg-slate-700 text-slate-200">🔊 Listen</button>' : ''; }
  var chatSeen = -1;
  function decorateChat() {
    var log = $('chat-log'); if (!log || !TTS) return;
    var bubbles = log.querySelectorAll('div.selectable.rounded-bl-md');
    for (var i = 0; i < bubbles.length; i++) {
      var b = bubbles[i]; if (b.querySelector('.pw-spk')) continue;
      var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pw-spk mt-2 block px-2 py-1 rounded-lg bg-slate-700 text-slate-200 text-[11px] font-bold active:scale-95'; btn.textContent = '🔊 Listen'; btn.setAttribute('aria-label', 'Read this answer aloud');
      btn.onclick = function (ev) { var bb = ev.currentTarget.parentNode, c = bb.cloneNode(true); var x = c.querySelectorAll('button'); for (var k = 0; k < x.length; k++) x[k].remove(); window.pwSpeak(c.innerText || c.textContent, ev.currentTarget); };
      b.appendChild(btn);
    }
    if (chatSeen < 0) chatSeen = bubbles.length;
    else if (bubbles.length > chatSeen) { chatSeen = bubbles.length; if (voiceCfg().auto && bubbles.length) { var last = bubbles[bubbles.length - 1]; var c = last.cloneNode(true); var x = c.querySelectorAll('button'); for (var k = 0; k < x.length; k++) x[k].remove(); window.pwSpeak(c.innerText || c.textContent, last.querySelector('.pw-spk')); } }
    else chatSeen = bubbles.length;
  }
  function voiceCfg() { var v = lsGet('pw_voice', {}); return { auto: !!v.auto }; }
  function renderVoicePanel() {
    var host = $('voice-panel');
    if (!host) { var bp = $('backup-panel'); if (!bp) return; host = document.createElement('div'); host.id = 'voice-panel'; host.className = 'p-3 rounded-2xl bg-slate-900/60 border border-amber-500/30 mb-3'; bp.parentNode.insertBefore(host, $('guide-panel') || bp); }
    if (!SR && !TTS) { host.innerHTML = '<div class="text-xs font-bold text-amber-300">🎤 Voice</div><div class="text-[11px] text-slate-400 leading-snug mt-1">This phone does not support voice input or read-aloud.</div>'; return; }
    var on = voiceCfg().auto;
    host.innerHTML = '<div style="display:flex;align-items:center;gap:12px"><div style="flex:1"><div class="text-xs font-bold text-amber-300">🎤 Voice</div><div class="text-[11px] text-slate-400 leading-snug mt-1">Tap 🎤 next to a box to speak instead of typing. Tap 🔊 Listen under an answer to hear it. This switch reads every new Adviser answer aloud.</div></div>' +
      (TTS ? '<button type="button" id="vc-sw" class="gd-sw" role="switch" aria-label="Read Adviser answers aloud" aria-checked="' + on + '" style="position:relative;width:52px;height:30px;border-radius:15px;border:0;flex-shrink:0;background:' + (on ? '#10b981' : '#475569') + '"><i style="position:absolute;top:3px;left:' + (on ? 25 : 3) + 'px;width:24px;height:24px;border-radius:50%;background:#fff"></i></button>' : '') + '</div>';
    var sw = $('vc-sw'); if (sw) sw.onclick = function () { var v = voiceCfg(); v.auto = !v.auto; lsSet('pw_voice', v); renderVoicePanel(); toast(v.auto ? 'Adviser answers will be read aloud' : 'Read-aloud is OFF'); };
  }
  function initVoice() {
    attachMic('chat-input'); attachMic('win-input');
    var log = $('chat-log'); if (log && TTS && window.MutationObserver) { new MutationObserver(function () { decorateChat(); }).observe(log, { childList: true }); decorateChat(); }
    renderVoicePanel();
  }

  /* ================================================================ 1. salary helper */
  var SAL_OBJ = [
    ['"We have no budget right now."', 'I understand money is tight. Can we agree on a date to look at this again, for example in 3 months, with clear goals I must reach? Can we write it down?'],
    ['"This is our standard offer."', 'Thank you. I really want this job. Based on the market for this role, I was hoping for {ask}. Is there any room to get closer to that?'],
    ['"Why do you deserve more?"', 'In the last months I {win}. I want to keep doing that and take more responsibility. That is why {ask} is fair.'],
    ['"Let me think about it."', 'Of course. When can I expect to hear from you? I would like to talk again this week or next.'],
    ['"We can not do that number."', 'What number can you do? If the pay stays lower, can we add something else, like extra days off, a training course, or a salary review in 6 months?'],
    ['"You are too young / too new."', 'I understand. I would like to be judged on my results. Here is what I did: {win}. Can we agree on clear goals for the next raise?']
  ];
  function num(v) { var n = parseFloat(String(v || '').replace(/[, ]/g, '')); return isFinite(n) && n > 0 ? n : 0; }
  function money(n, cur) { return (cur || '') + Math.round(n).toLocaleString('en-US'); }
  function round5(n) { var step = n >= 20000 ? 500 : n >= 2000 ? 50 : 5; return Math.round(n / step) * step; }
  function salaryCalc(S) {
    var now = num(S.now), lo = num(S.lo), hi = num(S.hi); if (!now || !lo || !hi) return { err: 'Please fill in all 3 numbers.' };
    if (hi < lo) { var t = lo; lo = hi; hi = t; }
    var mid = (lo + hi) / 2, ask, floor, note;
    if (S.mode === 'offer') {
      ask = Math.max(now * 1.08, Math.min(hi, now * 1.15)); floor = now < mid ? now * 1.03 : now;
      if (now > hi) { ask = now * 1.03; note = 'Your offer is already above the usual range. Great! Ask only for a small extra, or for non-money things like days off or training.'; }
      else if (now < lo) note = 'The offer is below the usual range. You have a strong reason to ask for more.';
      else if (now < mid) note = 'The offer is in the lower half of the range. It is normal to ask for more.';
      else note = 'The offer is in the upper half of the range. Ask politely for a little more.';
    } else {
      ask = now < lo ? mid : now < mid ? hi * 0.97 : hi; ask = Math.min(ask, now * (now < lo ? 1.2 : 1.15)); if (ask < now * 1.05) ask = now * 1.08; floor = Math.max(now * 1.04, now < lo ? lo : now);
      if (now < lo) note = 'You are paid below the usual range for this job. This is a strong reason to ask.';
      else if (now < mid) note = 'You are in the lower half of the usual range. There is room to ask. A big gap is often closed in two steps.';
      else if (now <= hi) note = 'You are already in the upper half of the usual range. Show your results and ask for a smaller step, or for a new title.';
      else note = 'You are above the usual range. Ask for a title or for training instead of only money.';
    }
    ask = round5(ask); floor = Math.min(round5(floor), ask);
    return { now: now, lo: lo, hi: hi, mid: mid, ask: ask, floor: floor, note: note, pct: Math.round((ask / now - 1) * 100) };
  }
  function topWin() { var w = lsGet('pw_wins_log', []); if (!w.length) return 'finished my work on time and helped my team'; var t = String(w[w.length - 1].t || '').replace(/[.!\s]+$/, ''); return t.charAt(0).toLowerCase() + t.slice(1); }
  function salaryText(S, c) {
    var cur = S.cur || '', win = topWin(), out = [];
    out.push('SALARY PLAN' + (S.role ? ' – ' + S.role : ''));
    out.push((S.mode === 'offer' ? 'Offer: ' : 'Now: ') + money(c.now, cur) + ' | Market: ' + money(c.lo, cur) + ' to ' + money(c.hi, cur));
    out.push('My ask: ' + money(c.ask, cur) + ' (+' + c.pct + '%) | Lowest I accept: ' + money(c.floor, cur));
    out.push(''); out.push('OPENING LINES');
    salOpen(S, c).forEach(function (l) { out.push('- ' + l); });
    out.push(''); out.push('IF THEY SAY...');
    SAL_OBJ.forEach(function (o) { out.push(o[0] + '\n  → ' + o[1].replace(/\{ask\}/g, money(c.ask, cur)).replace(/\{win\}/g, win)); });
    return out.join('\n');
  }
  function salOpen(S, c) {
    var cur = S.cur || '', a = money(c.ask, cur), win = topWin();
    if (S.mode === 'offer') return ['Thank you for the offer. I am excited about this job.', 'Based on the market for this role, I was hoping for ' + a + '. Is that possible?', 'I bring ' + win + '. I think that supports this number.'];
    return ['Thank you for meeting me. I enjoy working here and I want to grow.', 'In the last months I ' + win + '.', 'Based on my results and the market, I would like to talk about moving my pay to ' + a + '.', 'What do I need to show to get there?'];
  }
  function renderSalary() {
    var box = $('salary-body'); if (!box) return;
    var S = lsGet('pw_salary', { mode: 'raise', cur: '$', role: '', now: '', lo: '', hi: '' });
    var h = '<p class="text-[11px] text-slate-300 mb-3 leading-snug">Know your number before you talk. Use the same time period for all numbers (all per year or all per month). Look up the market range on a salary website for your job and city.</p>' +
      '<div class="grid grid-cols-2 gap-2 mb-2"><div><label class="text-[10px] text-slate-400 font-bold" for="sal-mode">I want to…</label><select id="sal-mode" class="' + INP + '"><option value="raise"' + (S.mode === 'raise' ? ' selected' : '') + '>Ask for a raise</option><option value="offer"' + (S.mode === 'offer' ? ' selected' : '') + '>Answer a job offer</option></select></div>' +
      '<div><label class="text-[10px] text-slate-400 font-bold" for="sal-cur">Currency</label><select id="sal-cur" class="' + INP + '">' + ['$', '€', '₪', '£', ''].map(function (c) { return '<option value="' + c + '"' + (S.cur === c ? ' selected' : '') + '>' + (c || 'None') + '</option>'; }).join('') + '</select></div></div>' +
      '<label class="text-[10px] text-slate-400 font-bold" for="sal-role">My job</label><input id="sal-role" maxlength="50" class="' + INP + ' mb-2" placeholder="Example: Sales assistant" value="' + esc(S.role) + '">' +
      '<label class="text-[10px] text-slate-400 font-bold" for="sal-now" id="sal-now-l">' + (S.mode === 'offer' ? 'The offer' : 'My pay now') + '</label><input id="sal-now" inputmode="decimal" class="' + INP + ' mb-2" placeholder="Example: 36000" value="' + esc(S.now) + '">' +
      '<div class="grid grid-cols-2 gap-2 mb-3"><div><label class="text-[10px] text-slate-400 font-bold" for="sal-lo">Market low</label><input id="sal-lo" inputmode="decimal" class="' + INP + '" placeholder="32000" value="' + esc(S.lo) + '"></div><div><label class="text-[10px] text-slate-400 font-bold" for="sal-hi">Market high</label><input id="sal-hi" inputmode="decimal" class="' + INP + '" placeholder="46000" value="' + esc(S.hi) + '"></div></div>' +
      '<button onclick="salBuild()" class="w-full py-3 ' + BTN + 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-extrabold">💰 Build my plan</button><div id="sal-out" class="mt-3"></div>';
    box.innerHTML = h;
    var m = $('sal-mode'); if (m) m.onchange = function () { var l = $('sal-now-l'); if (l) l.textContent = m.value === 'offer' ? 'The offer' : 'My pay now'; };
    if (S.now && S.lo && S.hi) salShow(S);
  }
  function salRead() { return { mode: ($('sal-mode') || {}).value || 'raise', cur: ($('sal-cur') || {}).value || '', role: (($('sal-role') || {}).value || '').trim(), now: ($('sal-now') || {}).value || '', lo: ($('sal-lo') || {}).value || '', hi: ($('sal-hi') || {}).value || '' }; }
  function salShow(S) {
    var out = $('sal-out'); if (!out) return; var c = salaryCalc(S);
    if (c.err) { out.innerHTML = '<p class="text-[11px] text-amber-300">' + c.err + '</p>'; return; }
    var cur = S.cur || '', win = topWin();
    var pos = Math.max(0, Math.min(100, ((c.now - c.lo) / Math.max(1, c.hi - c.lo)) * 100));
    var h = '<div class="' + CARD + ' mb-2"><p class="text-[10px] text-slate-400 font-bold mb-1">WHERE YOU ARE IN THE MARKET</p><div class="relative h-2.5 rounded-full bg-slate-700 mb-1"><div class="absolute top-[-3px] w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" style="left:calc(' + pos + '% - 8px);position:absolute"></div></div><div class="flex justify-between text-[10px] text-slate-400"><span>' + money(c.lo, cur) + '</span><span>' + money(c.hi, cur) + '</span></div><p class="text-[11px] text-slate-200 mt-2 leading-snug">' + esc(c.note) + '</p></div>' +
      '<div class="grid grid-cols-2 gap-2 mb-2"><div class="p-3 rounded-2xl bg-emerald-900/40 border border-emerald-500/40 text-center"><p class="text-[10px] text-emerald-300 font-bold">MY ASK</p><p class="text-lg font-extrabold text-white">' + money(c.ask, cur) + '</p><p class="text-[10px] text-emerald-300">+' + c.pct + '%</p></div><div class="p-3 rounded-2xl bg-slate-900/70 border border-slate-600 text-center"><p class="text-[10px] text-slate-400 font-bold">LOWEST I ACCEPT</p><p class="text-lg font-extrabold text-white">' + money(c.floor, cur) + '</p><p class="text-[10px] text-slate-400">Do not say this number</p></div></div>' +
      '<div class="' + CARD + ' mb-2"><p class="text-xs font-bold text-amber-400 mb-1">🗣️ Say this</p><ol class="list-decimal ml-4 space-y-1">' + salOpen(S, c).map(function (l) { return '<li class="text-[11px] text-slate-200 leading-snug selectable">' + esc(l) + '</li>'; }).join('') + '</ol></div>' +
      '<div class="' + CARD + ' mb-2"><p class="text-xs font-bold text-amber-400 mb-1">🛡️ If they say…</p>' + SAL_OBJ.map(function (o) { return '<div class="mb-2"><p class="text-[11px] font-bold text-white">' + esc(o[0]) + '</p><p class="text-[11px] text-slate-300 leading-snug selectable">' + esc(o[1].replace(/\{ask\}/g, money(c.ask, cur)).replace(/\{win\}/g, win)) + '</p></div>'; }).join('') + '</div>' +
      '<div class="' + CARD + ' mb-2"><p class="text-xs font-bold text-amber-400 mb-1">✅ Before the talk</p><ul class="list-disc ml-4 space-y-1 text-[11px] text-slate-300 leading-snug"><li>Ask for a short meeting. Do not do it in a hurry or in public.</li><li>Bring 3 wins with numbers (see the Wins Journal).</li><li>Say your ask first, then stop talking. Silence is okay.</li><li>Never say “I need money”. Say what you bring.</li><li>If the answer is no, ask what you must do to get a yes, and by when.</li></ul></div>' +
      '<div class="grid grid-cols-3 gap-2"><button onclick="salCopy()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📋 Copy</button><button onclick="salShare()" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">📤 Share</button><button onclick="salPlan()" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">➕ Plan</button></div>';
    out.innerHTML = h;
  }
  window.salBuild = function () { var S = salRead(); lsSet('pw_salary', S); var c = salaryCalc(S); if (c.err) { var o = $('sal-out'); if (o) o.innerHTML = '<p class="text-[11px] text-amber-300">' + c.err + '</p>'; return; } salShow(S); flag('salplan', 1); checkBadges(); try { $('sal-out').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) { } };
  window.salCopy = function () { var S = salRead(), c = salaryCalc(S); if (!c.err) copyText(salaryText(S, c), 'Salary plan copied ✓'); };
  window.salShare = function () { var S = salRead(), c = salaryCalc(S); if (!c.err) shareText(salaryText(S, c), 'My salary plan'); };
  window.salPlan = function () { var S = salRead(), c = salaryCalc(S); if (c.err) return; window.addMove('salary-' + isoDay(), 'Ask for ' + money(c.ask, S.cur) + ' (lowest ' + money(c.floor, S.cur) + '). Book the meeting and bring 3 wins.'); };

  /* ================================================================ 2. 1:1 meeting planner */
  var AGENDA = [
    ['My wins since last time', 'Since we last met, I finished… Here are the results.'],
    ['Priorities check', 'What are the most important things for me to focus on this month?'],
    ['Ask for feedback', 'What is one thing I could do better? What am I doing well?'],
    ['A problem I need help with', 'I have a problem with… Here is what I tried. What would you do?'],
    ['My growth', 'I want to grow into… What skills should I build next?'],
    ['The team or company', 'What is the team’s biggest goal right now, and how can I help?'],
    ['Workload and time', 'My workload looks like this… Is this the right balance?'],
    ['Next steps', 'To close: can we agree on 2 or 3 actions and a date for the next meeting?']
  ];
  function meetState() { var m = lsGet('pw_meet', {}); if (!m.cur) m.cur = { who: '', date: isoDay(), items: {}, notes: '', actions: [] }; m.past = m.past || []; return m; }
  function meetSave(m) { lsSet('pw_meet', m); }
  function meetRead(m) { var w = $('mt-who'), d = $('mt-date'), n = $('mt-notes'); if (w) m.cur.who = w.value; if (d) m.cur.date = d.value; if (n) m.cur.notes = n.value; }
  function renderMeeting() {
    var box = $('meeting-body'); if (!box) return; var m = meetState(), c = m.cur;
    var h = '<p class="text-[11px] text-slate-300 mb-3 leading-snug">Good 1:1 meetings get you noticed. Pick what to talk about, take notes, and turn every action into a move in your Action Plan.</p>' +
      '<div class="grid grid-cols-2 gap-2 mb-3"><div><label class="text-[10px] text-slate-400 font-bold" for="mt-who">Meeting with</label><input id="mt-who" maxlength="40" class="' + INP + '" placeholder="Manager name" value="' + esc(c.who) + '"></div><div><label class="text-[10px] text-slate-400 font-bold" for="mt-date">Date</label><input id="mt-date" type="date" class="' + INP + '" value="' + esc(c.date) + '"></div></div>' +
      '<p class="text-xs font-bold text-amber-400 mb-1">1. Agenda (tap to choose)</p><div class="space-y-1.5 mb-3">' +
      AGENDA.map(function (a, i) { var on = c.items[i]; return '<button onclick="mtItem(' + i + ')" aria-pressed="' + (on ? 'true' : 'false') + '" class="w-full text-left p-2.5 rounded-xl border ' + (on ? 'bg-sky-900/50 border-sky-400' : 'bg-slate-900/60 border-slate-700') + ' active:scale-98"><p class="text-[11px] font-bold text-white">' + (on ? '☑️' : '⬜') + ' ' + esc(a[0]) + '</p>' + (on ? '<p class="text-[11px] text-sky-200 mt-0.5 leading-snug">Say: “' + esc(a[1]) + '”</p>' : '') + '</button>'; }).join('') + '</div>' +
      '<p class="text-xs font-bold text-amber-400 mb-1">2. Notes</p><div class="flex gap-2 mb-1 items-start"><textarea id="mt-notes" rows="4" maxlength="2000" class="' + INP + '" placeholder="What did your manager say?">' + esc(c.notes) + '</textarea>' + micBtn('mt-notes') + '</div>' +
      '<p class="text-xs font-bold text-amber-400 mt-3 mb-1">3. Action items</p><div class="flex gap-2 mb-2"><input id="mt-act" maxlength="120" class="' + INP + '" placeholder="Example: Send the report by Friday" onkeydown="if(event.key===\'Enter\'){mtAdd();}">' + micBtn('mt-act') + '<button onclick="mtAdd()" class="px-4 ' + BTN + 'bg-sky-600 text-white">Add</button></div><div class="space-y-1.5 mb-3">' +
      (c.actions.length ? c.actions.map(function (a, i) { return '<div class="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700"><button onclick="mtDone(' + i + ')" class="text-base" aria-label="Done">' + (a.done ? '✅' : '⬜') + '</button><span class="flex-1 text-[11px] ' + (a.done ? 'line-through text-slate-500' : 'text-slate-100') + ' leading-snug">' + esc(a.t) + '</span><button onclick="mtPlan(' + i + ')" class="px-2 py-1 ' + BTN + 'bg-amber-500 text-slate-950">➕ Plan</button><button onclick="mtDel(' + i + ')" class="px-1.5 text-slate-500" aria-label="Delete">✕</button></div>'; }).join('') : '<p class="text-[11px] text-slate-500">No actions yet.</p>') + '</div>' +
      '<div class="grid grid-cols-3 gap-2 mb-3"><button onclick="mtCopy()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📋 Copy</button><button onclick="mtShare()" class="py-2.5 ' + BTN + 'bg-emerald-600 text-white">📤 Share</button><button onclick="mtFinish()" class="py-2.5 ' + BTN + 'bg-sky-600 text-white">✔ Finish</button></div>';
    if (m.past.length) {
      h += '<p class="text-xs font-bold text-amber-400 mb-1">Past meetings</p><div class="space-y-1.5">' + m.past.slice().reverse().slice(0, 6).map(function (p, ri) {
        var i = m.past.length - 1 - ri, open = p.actions.filter(function (a) { return !a.done; }).length;
        return '<div class="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700"><div class="flex-1"><p class="text-[11px] font-bold text-white">' + esc(p.date) + (p.who ? ' · ' + esc(p.who) : '') + '</p><p class="text-[10px] text-slate-400">' + p.actions.length + ' actions, ' + open + ' open</p></div><button onclick="mtOpen(' + i + ')" class="px-2 py-1 ' + BTN + 'bg-slate-700 text-slate-200">Open</button><button onclick="mtDelPast(' + i + ')" class="px-1.5 text-slate-500" aria-label="Delete">✕</button></div>';
      }).join('') + '</div>';
    }
    box.innerHTML = h;
    ['mt-who', 'mt-date', 'mt-notes'].forEach(function (id) { var e = $(id); if (e) e.addEventListener('input', function () { var s = meetState(); meetRead(s); meetSave(s); }); });
  }
  function mtText(m) {
    var c = m.cur, l = ['1:1 MEETING' + (c.who ? ' with ' + c.who : '') + ' – ' + c.date, '', 'AGENDA'];
    var any = false; AGENDA.forEach(function (a, i) { if (c.items[i]) { any = true; l.push('- ' + a[0]); } }); if (!any) l.push('- (none chosen)');
    if (c.notes) { l.push(''); l.push('NOTES'); l.push(c.notes); }
    l.push(''); l.push('ACTIONS'); if (c.actions.length) c.actions.forEach(function (a) { l.push((a.done ? '[x] ' : '[ ] ') + a.t); }); else l.push('- (none)');
    return l.join('\n');
  }
  function mtMut(fn) { var m = meetState(); meetRead(m); fn(m); meetSave(m); renderMeeting(); }
  window.mtItem = function (i) { mtMut(function (m) { if (m.cur.items[i]) delete m.cur.items[i]; else m.cur.items[i] = 1; }); };
  window.mtAdd = function () { var e = $('mt-act'), t = e ? e.value.trim() : ''; if (!t) { toast('Write an action first'); return; } mtMut(function (m) { m.cur.actions.push({ t: t, done: false }); }); };
  window.mtDone = function (i) { mtMut(function (m) { if (m.cur.actions[i]) m.cur.actions[i].done = !m.cur.actions[i].done; }); };
  window.mtDel = function (i) { mtMut(function (m) { m.cur.actions.splice(i, 1); }); };
  window.mtPlan = function (i) { var m = meetState(), a = m.cur.actions[i]; if (a) window.addMove('mt-' + m.cur.date + '-' + i + '-' + a.t.slice(0, 12), a.t); };
  window.mtCopy = function () { var m = meetState(); meetRead(m); copyText(mtText(m), 'Meeting notes copied ✓'); };
  window.mtShare = function () { var m = meetState(); meetRead(m); shareText(mtText(m), '1:1 meeting notes'); };
  window.mtFinish = function () {
    var m = meetState(); meetRead(m); var c = m.cur;
    if (!c.notes.trim() && !c.actions.length && !Object.keys(c.items).length) { toast('Add an agenda, notes or an action first'); return; }
    m.past.push(c); if (m.past.length > 30) m.past.shift(); m.cur = { who: c.who, date: isoDay(), items: {}, notes: '', actions: c.actions.filter(function (a) { return !a.done; }).map(function (a) { return { t: a.t, done: false }; }) };
    meetSave(m); flag('oneone', 1); checkBadges(); toast('Meeting saved ✓ Open actions moved to the next meeting'); renderMeeting();
    if (window.pwBurst) { try { window.pwBurst(window.innerWidth / 2, window.innerHeight / 2, false, '🗓️'); } catch (e) { } }
  };
  window.mtOpen = function (i) { var m = meetState(); if (!m.past[i]) return; if (!confirm('Open this old meeting? The meeting you are writing now will be replaced.')) return; m.cur = JSON.parse(JSON.stringify(m.past[i])); meetSave(m); renderMeeting(); };
  window.mtDelPast = function (i) { var m = meetState(); if (!confirm('Delete this saved meeting?')) return; m.past.splice(i, 1); meetSave(m); renderMeeting(); };

  /* ================================================================ 3. boss style quiz */
  var BQ = [
    ['When you give your boss an update, what do they want?', [['The result in one sentence.', 'D'], ['The facts, numbers and details.', 'A'], ['A friendly chat first.', 'F'], ['The big idea and where it goes.', 'B']]],
    ['How does your boss make decisions?', [['Fast. Often on the spot.', 'D'], ['Slowly. After checking everything.', 'A'], ['After asking what the team thinks.', 'F'], ['By following a new idea or vision.', 'B']]],
    ['What does your boss do when you make a mistake?', [['Says it straight and moves on.', 'D'], ['Asks exactly what happened, step by step.', 'A'], ['Is kind but you can see they are worried.', 'F'], ['Talks about what to learn for next time.', 'B']]],
    ['How are their messages and emails?', [['Very short. Sometimes just one word.', 'D'], ['Long and exact, with lists.', 'A'], ['Warm, with emojis or kind words.', 'F'], ['Full of ideas, sometimes unfinished.', 'B']]],
    ['What makes your boss happy?', [['Work done on time, no excuses.', 'D'], ['Work with no errors.', 'A'], ['A good mood in the team.', 'F'], ['New ideas and bold plans.', 'B']]],
    ['What annoys your boss most?', [['Wasting their time.', 'D'], ['Guessing without proof.', 'A'], ['Fights and cold people.', 'F'], ['Boring routines and “we always did it this way”.', 'B']]]
  ];
  var BT = {
    D: { n: 'Driver', e: '🚀', how: 'Wants speed and results. Short on time. Likes people who take charge.', do: ['Start with the result or the answer. Give details only if asked.', 'Bring a solution with every problem.', 'Be on time and keep it short.'], avoid: 'Long stories, small talk before the point, and excuses.', open: 'Quick update: I finished X, the result is Y. Next I will do Z. Do you want anything changed?', plan: 'Next update to my boss: lead with the result in one sentence.' },
    A: { n: 'Analyst', e: '🔍', how: 'Wants facts and quality. Thinks before deciding. Dislikes mistakes.', do: ['Bring numbers, dates and proof.', 'Send details in writing before the meeting.', 'Give them time to think. Do not push for a fast answer.'], avoid: 'Guessing, rushing, and big claims without proof.', open: 'I prepared the numbers and a short summary. Can I send them today so you can check them first?', plan: 'Before my next meeting, send my boss a short written summary with numbers.' },
    F: { n: 'Friendly', e: '🤝', how: 'Cares about people and the mood. Wants harmony and trust.', do: ['Say hello and ask how they are.', 'Show you care about the team.', 'Bring problems calmly and kindly.'], avoid: 'Being cold, going straight to complaints, or attacking a coworker.', open: 'Thanks for your time. I really like working with the team. I would like your advice on something.', plan: 'Start my next chat with my boss by asking how they are, then ask for advice.' },
    B: { n: 'Big-picture', e: '💡', how: 'Loves ideas, change and the future. Gets bored with small details.', do: ['Link your work to the big goal.', 'Bring one fresh idea, short and clear.', 'Offer to take care of the details.'], avoid: 'Heavy detail, slow routines, and saying “it was always done this way”.', open: 'I have an idea that could help us reach our goal: X. I can test a small version this week. What do you think?', plan: 'Bring my boss one new idea, with a small test I can start this week.' }
  };
  var bq = { mode: 'intro', i: 0, ans: [] };
  function bossRes(ans) { var c = { D: 0, A: 0, F: 0, B: 0 }; ans.forEach(function (a) { c[a]++; }); var best = 'D'; ['D', 'A', 'F', 'B'].forEach(function (k) { if (c[k] > c[best]) best = k; }); return { counts: c, top: best }; }
  function renderBoss() {
    var box = $('boss-body'); if (!box) return; var saved = lsGet('pw_boss', null), h = '';
    if (bq.mode === 'intro') {
      h = '<p class="text-[11px] text-slate-300 mb-3 leading-snug">Different bosses need different words. Answer 6 questions about your manager and get tips on how to talk to them. Think about one real person.</p>';
      if (saved && saved.top) h += '<div class="' + CARD + ' mb-3"><p class="text-[10px] text-slate-400 font-bold">YOUR LAST RESULT</p><p class="text-sm font-bold text-white">' + BT[saved.top].e + ' ' + BT[saved.top].n + (saved.who ? ' · ' + esc(saved.who) : '') + '</p><button onclick="bossShow()" class="mt-2 px-3 py-1.5 ' + BTN + 'bg-slate-700 text-slate-100">Open result</button></div>';
      h += '<label class="text-[10px] text-slate-400 font-bold" for="boss-who">Who is it? (optional)</label><input id="boss-who" maxlength="40" class="' + INP + ' mb-3" placeholder="Manager name" value="' + esc(saved && saved.who || '') + '"><button onclick="bossStart()" class="w-full py-3 ' + BTN + 'bg-gradient-to-r from-fuchsia-500 to-fuchsia-600 text-white font-extrabold">🧭 Start the quiz</button>' +
        '<p class="text-xs font-bold text-amber-400 mt-4 mb-1">The 4 styles</p><div class="grid grid-cols-2 gap-2">' + ['D', 'A', 'F', 'B'].map(function (k) { return '<div class="' + CARD + '"><p class="text-xs font-bold text-white">' + BT[k].e + ' ' + BT[k].n + '</p><p class="text-[10px] text-slate-400 leading-snug mt-0.5">' + esc(BT[k].how) + '</p></div>'; }).join('') + '</div>';
    } else if (bq.mode === 'q') {
      var q = BQ[bq.i];
      h = '<div class="flex justify-between text-[10px] text-slate-400 font-bold mb-1"><span>Question ' + (bq.i + 1) + ' of ' + BQ.length + '</span></div><div class="h-1.5 rounded-full bg-slate-700 mb-3"><div class="h-1.5 rounded-full bg-fuchsia-400" style="width:' + Math.round(bq.i / BQ.length * 100) + '%"></div></div><p class="text-sm font-bold text-white mb-3 leading-snug" id="bq-q">' + esc(q[0]) + '</p><div class="space-y-2">' +
        q[1].map(function (o, k) { return '<button onclick="bossPick(' + k + ')" class="w-full text-left p-3 rounded-2xl bg-slate-900/70 border border-slate-700 hover:border-fuchsia-400 text-xs text-slate-100 active:scale-98">' + esc(o[0]) + '</button>'; }).join('') + '</div>' +
        (bq.i > 0 ? '<button onclick="bossBack()" class="mt-3 text-[11px] text-slate-400 underline">← Previous question</button>' : '');
    } else {
      var r = saved || bossRes(bq.ans), t = BT[r.top], tot = 0; ['D', 'A', 'F', 'B'].forEach(function (k) { tot += r.counts[k]; });
      h = '<div class="text-center mb-3"><p class="text-4xl">' + t.e + '</p><p class="text-lg font-extrabold text-white">' + (r.who ? esc(r.who) + ' is a ' : 'Your boss is a ') + t.n + '</p><p class="text-[11px] text-slate-300 leading-snug mt-1">' + esc(t.how) + '</p></div>' +
        '<div class="' + CARD + ' mb-2">' + ['D', 'A', 'F', 'B'].map(function (k) { var pc = tot ? Math.round(r.counts[k] / tot * 100) : 0; return '<div class="flex items-center gap-2 mb-1"><span class="w-24 text-[10px] text-slate-300">' + BT[k].e + ' ' + BT[k].n + '</span><div class="flex-1 h-2 rounded-full bg-slate-700"><div class="h-2 rounded-full bg-fuchsia-400" style="width:' + pc + '%"></div></div><span class="w-8 text-[10px] text-slate-400 text-right">' + pc + '%</span></div>'; }).join('') + '</div>' +
        '<div class="' + CARD + ' mb-2"><p class="text-xs font-bold text-emerald-300 mb-1">✅ Do this</p><ul class="list-disc ml-4 space-y-1 text-[11px] text-slate-200 leading-snug">' + t.do.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
        '<div class="' + CARD + ' mb-2"><p class="text-xs font-bold text-red-300 mb-1">⛔ Avoid</p><p class="text-[11px] text-slate-200 leading-snug">' + esc(t.avoid) + '</p></div>' +
        '<div class="' + CARD + ' mb-3"><p class="text-xs font-bold text-amber-400 mb-1">🗣️ A good opening line</p><p class="text-[11px] text-slate-200 leading-snug selectable" id="bq-open">“' + esc(t.open) + '”</p></div>' +
        '<div class="grid grid-cols-3 gap-2 mb-2"><button onclick="bossCopy()" class="py-2.5 ' + BTN + 'bg-slate-700 text-slate-100">📋 Copy</button><button onclick="bossPlan()" class="py-2.5 ' + BTN + 'bg-amber-500 text-slate-950">➕ Plan</button><button onclick="bossAgain()" class="py-2.5 ' + BTN + 'bg-fuchsia-600 text-white">🔁 Again</button></div>' +
        '<p class="text-[10px] text-slate-500 leading-snug">This is a simple guide, not a test of the person. People can be a mix of styles.</p>';
    }
    box.innerHTML = h;
  }
  window.bossStart = function () { var w = $('boss-who'); bq = { mode: 'q', i: 0, ans: [], who: w ? w.value.trim() : '' }; renderBoss(); };
  window.bossPick = function (k) { bq.ans[bq.i] = BQ[bq.i][1][k][1]; bq.i++; if (bq.i >= BQ.length) { var r = bossRes(bq.ans); r.who = bq.who || ''; r.date = isoDay(); lsSet('pw_boss', r); flag('bossread', 1); checkBadges(); bq.mode = 'res'; } renderBoss(); };
  window.bossBack = function () { if (bq.i > 0) { bq.i--; renderBoss(); } };
  window.bossShow = function () { bq.mode = 'res'; renderBoss(); };
  window.bossAgain = function () { bq = { mode: 'intro', i: 0, ans: [] }; renderBoss(); };
  function bossTxt() { var r = lsGet('pw_boss', null); if (!r) return ''; var t = BT[r.top]; return (r.who || 'My boss') + ': ' + t.n + '\n' + t.how + '\nDo: ' + t.do.join(' ') + '\nAvoid: ' + t.avoid + '\nOpening line: ' + t.open; }
  window.bossCopy = function () { copyText(bossTxt(), 'Tips copied ✓'); };
  window.bossPlan = function () { var r = lsGet('pw_boss', null); if (r) window.addMove('boss-' + r.top + '-' + (r.who || ''), BT[r.top].plan); };

  /* ================================================================ 4. feedback log */
  var FB_TAGS = ['Communication', 'Speed', 'Quality', 'Teamwork', 'Initiative', 'Attitude', 'Skills', 'Time'];
  var FB_FROM = ['Manager', 'Coworker', 'Customer', 'Mentor', 'Myself'];
  function renderFeedback() {
    var box = $('feedback-body'); if (!box) return; var fb = lsGet('pw_fb', []);
    var h = '<p class="text-[11px] text-slate-300 mb-3 leading-snug">Write down feedback right after you get it. Praise and criticism both help. Before your review, the app shows what repeats.</p>' +
      '<div class="flex gap-2 mb-2 items-start"><textarea id="fb-text" rows="3" maxlength="400" class="' + INP + '" placeholder="Example: My manager said my reports are clear but sometimes late."></textarea>' + micBtn('fb-text') + '</div>' +
      '<div class="grid grid-cols-3 gap-2 mb-2"><select id="fb-kind" class="' + INP + '" aria-label="Type"><option value="grow">🔧 To improve</option><option value="good">⭐ Praise</option></select><select id="fb-from" class="' + INP + '" aria-label="From">' + FB_FROM.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select><select id="fb-tag" class="' + INP + '" aria-label="Theme">' + FB_TAGS.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select></div>' +
      '<button onclick="fbAdd()" class="w-full py-2.5 ' + BTN + 'bg-orange-600 text-white mb-3">➕ Save feedback</button>';
    if (fb.length) {
      var cg = {}, cp = {}; fb.forEach(function (f) { var m = f.kind === 'good' ? cp : cg; m[f.tag] = (m[f.tag] || 0) + 1; });
      var rep = function (m) { return Object.keys(m).filter(function (k) { return m[k] >= 2; }).sort(function (a, b) { return m[b] - m[a]; }).map(function (k) { return k + ' (' + m[k] + ')'; }); };
      var rg = rep(cg), rp = rep(cp);
      h += '<div class="' + CARD + ' mb-3"><p class="text-xs font-bold text-amber-400 mb-1">🔁 Repeating themes</p>' +
        '<p class="text-[11px] text-slate-200 leading-snug mb-1">🔧 <b>To improve:</b> ' + (rg.length ? esc(rg.join(', ')) : 'nothing repeats yet') + '</p><p class="text-[11px] text-slate-200 leading-snug">⭐ <b>Strengths:</b> ' + (rp.length ? esc(rp.join(', ')) : 'nothing repeats yet') + '</p>' +
        '<button onclick="fbReview()" class="mt-2 w-full py-2 ' + BTN + 'bg-slate-700 text-slate-100">📋 Copy my review notes</button></div>';
    }
    h += '<div class="flex items-center justify-between mb-1"><span class="text-xs font-bold text-amber-400">My feedback</span><span class="text-[10px] bg-slate-900 px-2 py-0.5 rounded-full text-slate-400 font-semibold">' + fb.length + ' saved</span></div><div class="space-y-1.5">' +
      (fb.length ? fb.slice().reverse().slice(0, 40).map(function (f, ri) { var i = fb.length - 1 - ri; return '<div class="p-2.5 rounded-xl bg-slate-900/60 border ' + (f.kind === 'good' ? 'border-emerald-500/40' : 'border-orange-500/40') + '"><p class="text-[11px] text-slate-100 leading-snug selectable">' + (f.kind === 'good' ? '⭐ ' : '🔧 ') + esc(f.t) + '</p><div class="flex items-center gap-2 mt-1.5"><span class="text-[10px] text-slate-400 flex-1">' + esc(f.d) + ' · ' + esc(f.from) + ' · ' + esc(f.tag) + '</span>' + (f.kind === 'good' ? '<button onclick="fbWin(' + i + ')" class="px-2 py-1 ' + BTN + 'bg-emerald-700 text-white">➕ Win</button>' : '<button onclick="fbPlan(' + i + ')" class="px-2 py-1 ' + BTN + 'bg-amber-500 text-slate-950">➕ Plan</button>') + '<button onclick="fbDel(' + i + ')" class="px-1.5 text-slate-500" aria-label="Delete">✕</button></div></div>'; }).join('') : '<p class="text-[11px] text-slate-500">No feedback saved yet.</p>') + '</div>';
    box.innerHTML = h;
  }
  window.fbAdd = function () {
    var t = (($('fb-text') || {}).value || '').trim(); if (!t) { toast('Write the feedback first'); return; }
    var fb = lsGet('pw_fb', []); fb.push({ t: t, kind: $('fb-kind').value, from: $('fb-from').value, tag: $('fb-tag').value, d: new Date().toLocaleDateString(), iso: new Date().toISOString() });
    lsSet('pw_fb', fb); toast('Feedback saved ✓'); renderFeedback(); checkBadges();
  };
  window.fbDel = function (i) { var fb = lsGet('pw_fb', []); fb.splice(i, 1); lsSet('pw_fb', fb); renderFeedback(); };
  window.fbPlan = function (i) { var f = lsGet('pw_fb', [])[i]; if (f) window.addMove('fb-' + (f.iso || i), 'Work on this feedback (' + f.tag + '): ' + f.t.slice(0, 90)); };
  window.fbWin = function (i) {
    var f = lsGet('pw_fb', [])[i]; if (!f) return; var wins = lsGet('pw_wins_log', []);
    wins.push({ t: 'Praise from ' + f.from.toLowerCase() + ': ' + f.t, d: new Date().toLocaleDateString(), iso: new Date().toISOString() }); lsSet('pw_wins_log', wins); toast('Added to your Wins Journal ✓');
  };
  window.fbReview = function () {
    var fb = lsGet('pw_fb', []), l = ['MY REVIEW NOTES', '', 'STRENGTHS (what people praised)'], g = fb.filter(function (f) { return f.kind === 'good'; }), w = fb.filter(function (f) { return f.kind !== 'good'; });
    g.slice(-6).forEach(function (f) { l.push('- [' + f.tag + '] ' + f.t); }); if (!g.length) l.push('- (none saved)');
    l.push(''); l.push('TO IMPROVE (and my plan)'); w.slice(-6).forEach(function (f) { l.push('- [' + f.tag + '] ' + f.t); }); if (!w.length) l.push('- (none saved)');
    copyText(l.join('\n'), 'Review notes copied ✓');
  };

  /* ================================================================ hooks */
  function onPage(id) {
    if (id === 'step-salary') renderSalary();
    if (id === 'step-meeting') renderMeeting();
    if (id === 'step-boss') { if (bq.mode === 'q') bq.mode = 'intro'; renderBoss(); }
    if (id === 'step-feedback') renderFeedback();
    if (id === 'step-profile') renderVoicePanel();
    if (window.pwStop) window.pwStop();
  }
  var _go = window.goToStep;
  window.goToStep = function (id, p, fromPop) { _go(id, p, fromPop); try { onPage(id); } catch (e) { console.error(e); } };
  function init() { try { initVoice(); } catch (e) { console.error(e); } setTimeout(checkBadges, 1200); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 300); }); else setTimeout(init, 300);
  window.PW9 = { salaryCalc: salaryCalc, BT: BT, BQ: BQ, BADGES: BADGES };
})();
