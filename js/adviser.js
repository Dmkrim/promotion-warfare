/* Promotion Warfare - Adviser engine (offline, retrieval based).
   Works in the browser (window.PWAdviser) and in Node (module.exports) for testing. */
(function (root) {
  'use strict';

  var STOP = new Set('a an the and or but if then so to of in on at for with from by is are was were be been am do does did can could should would will my me i you your we our it its this that these those there here what how why when who which about into out up down over under again just also very really please tell give show let us get got have has had not no yes as than too any some more most much many want need like know think make use wanna gonna okay ok really'.split(' '));
  var WEAK = new Set(tokensLite('job work compan peopl thing good better best great former new learn long take time day week start first one two three four way'));
  var INTENT_WORDS = new Set(tokensLite('example say mistake tip trick hack measure progress long take stuck checklist week step steps next lesson teach nervous afraid scared fear fair ethical honest wrong sentence words script phrase minutes quick today summary short version detail more please'));
  function tokensLite(str) { return str.split(' ').map(function (w) { return stem(w); }); }

  function stem(w) {
    if (w.length > 4 && /ies$/.test(w)) w = w.slice(0, -3) + 'y';
    else if (w.length > 3 && /s$/.test(w) && !/ss$/.test(w)) w = w.slice(0, -1);
    var m = w.match(/^(.{3,}?)(ing|ment|ed|ion|er|ly|e)$/);
    if (m) w = m[1];
    if (w.length > 4 && /e$/.test(w)) w = w.slice(0, -1);
    return w;
  }
  function tokens(s, keepStops) {
    var out = [];
    String(s || '').toLowerCase().replace(/[^a-z0-9#' ]+/g, ' ').split(/\s+/).forEach(function (w) {
      w = w.replace(/'s$/, '').replace(/'/g, '');
      if (!w) return;
      if (!keepStops && STOP.has(w)) return;
      out.push(stem(w));
    });
    return out;
  }

  // ---- intent (angle) detection: [angleIndex, regex] ----
  // angles: 0 what,1 why,2 steps,3 s1,4 s2,5 s3,6 s4,7 example,8 say,9 mistake,10 tip,11 measure,12 time,13 stuck,
  // 14 summary,15 beginner,16 leader,17 challenger,18 flanker,19 guerrilla,20 boss,21 checklist,22 week,23 wrong,
  // 24 tenmin,25 ethics,26 nervous,27 next,28 whynot,29 teach
  var INTENTS = [
    [29, /\b(teach me|mini lesson|a lesson|explain.*(simply|story)|with a story)\b/],
    [14, /\b(one sentence|sum up|summar|short version|tldr|tl;dr|in short|briefly)\b/],
    [28, /\bwhy\b.*\b(not working|no results?|nothing|missing)\b|\bwhat am i missing\b/],
    [13, /\b(stuck|nothing happen|did not work|didn't work|does not work|doesn't work|do not work|no results?|failed|not working|tried .* and)\b/],
    [7, /\b(example|for instance|sample|real story|case|scenario|show me how)\b/],
    [8, /\b(what (can|should|do) i say|words to use|script|(write|give) me a sentence|phrase|wording|how (do|should) i (say|phrase|word|tell)|what to say)\b/],
    [9, /\b(mistake|mistakes|avoid|pitfall|danger|dangers|get wrong|go wrong|wrong thing|do not do|don't do|what not to)\b/],
    [10, /\b(tip|trick|hack|advice in short|pro tip|quick tip)\b/],
    [11, /\b(measure|metric|progress|signs? of success|know .{0,40}working|track)\b/],
    [12, /\b(how long|how fast|how soon|how much time|timeline|time frame|when will|when should|best time)\b/],
    [23, /\b(doing .{0,40} wrong|warning signs?|signs? of failure|am i wrong)\b/],
    [15, /\b(i am new|i'm new|just joined|no experience|beginner|newcomer|first job|first day|i am 18|i'm 18|just started|just got hired)\b/],
    [16, /\b(i am (the )?(number )?(one|#1|1|leader|best|top)|as (the|a) leader|i'm (the )?(number )?(one|#1|leader|top))\b/],
    [17, /\b(i am (the )?(number )?(two|#2|2|challenger|runner)|as (the|a) challenger|i'm (the )?(number )?(two|#2|challenger))\b/],
    [18, /\b(i am (the )?(number )?(three|#3|3|flanker)|as (the|a) flanker|i'm (the )?(number )?(three|#3|flanker))\b/],
    [19, /\b(underdog|guerrilla|weakest|lowest rank|bottom of|i am nobody|i'm nobody|smallest)\b/],
    [20, /\b(my boss|my manager|supervisor).*\b(think|see|care|view|feel|react|want)\b/],
    [21, /\b(checklist|to-?do list|list the tasks|tick list)\b/],
    [22, /\b(this week|weekly plan|plan my week|week plan|7 days|seven days)\b/],
    [24, /\b(10 minutes|ten minutes|quick action|right now|today|only a few minutes|5 minutes)\b/],
    [25, /\b(fair|ethical|honest|unethical|manipulat|dirty|moral|hurt (other|someone)|is it (ok|okay|wrong|right|allowed|bad)|allowed to)\b/],
    [26, /\b(nervous|afraid|scared|scares|fear|anxious|worried|shy|terrified|panic)\b/],
    [27, /\b(what next|what comes after|next topic|after that|then what|what should i learn next|next step)\b/],
    [4, /\b(step (2|two)|second step|second move|do second|after the first (move|step))\b/],
    [5, /\b(step (3|three)|third step|third move|did two (steps|moves))\b/],
    [6, /\b(step (4|four)|last step|final step|finish)\b/],
    [3, /\b(where do i start|first thing|first step|how do i start|how to start|begin|do first|what should i do first)\b/],
    [1, /\b(why|benefit|what do i gain|worth it|matter)\b/],
    [2, /\b(how (do|can|should|to) i|how to|steps|plan|way to|guide me|what should i do)\b/],
    [0, /\b(what is|what are|what's|define|meaning|explain|tell me about)\b/]
  ];
  // when several regexes match, specific ones above win; we take the first two distinct matches
  function detectIntents(msg) {
    var found = [];
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i][1].test(msg) && found.indexOf(INTENTS[i][0]) < 0) found.push(INTENTS[i][0]);
      if (found.length >= 2) break;
    }
    return found;
  }

  var EMOTION = /\b(stress|stressed|angry|mad|furious|hate|tired|exhausted|sad|depress|unfair|frustrat|overwhelm|upset|cry|hopeless|burn(ed)? out|sick of|fed up|lonely|bullied|humiliat)\w*/;
  var GREET = /^(hi|hello|hey|yo|good (morning|evening|afternoon)|shalom|hola|sup)\b/;
  var THANKS = /\b(thanks|thank you|thx|appreciate it|cheers)\b/;
  var BYE = /^(bye|goodbye|see you|that is all|that's all|good night|exit|quit)\b/;
  var MORE = /^(more|continue|go on|and|tell me more|more please|another|another one|something else|next|what else|ok and|keep going)\b/;
  var PRONOUN = /\b(it|that|this|them|these|those|the same|about that|on that)\b/;
  var HELP = /\b(what can you do|who are you|help me|how do you work|what are you)\b/;
  var CRISIS = /\b(kill myself|suicid|end my life|want to die|self[- ]harm|hurt myself)\b/;

  function Adviser(bank, opts) {
    opts = opts || {};
    this.bank = bank;
    this.cards = bank.cards;
    this.entries = bank.entries;
    this.user = [];            // user added entries {q, a, src}
    this.ctx = { card: -1, angle: -1, cats: {}, turns: 0, lastCards: [] };
    this.profile = opts.profile || {};
    this._build();
  }

  Adviser.prototype._build = function () {
    var self = this, cards = this.cards;
    // card level documents
    this.cdf = {};
    this.cardTok = cards.map(function (c) {
      var m = {};
      function add(arr, wt) { arr.forEach(function (t) { m[t] = Math.max(m[t] || 0, wt); }); }
      add(tokens(c.kw), 1.6);
      add(tokens(c.t), 2.2);
      add(tokens(c.what), 0.8);
      Object.keys(m).forEach(function (t) { self.cdf[t] = (self.cdf[t] || 0) + 1; });
      return m;
    });
    this.N = cards.length;
    this.titleTok = cards.map(function (c) { return tokens(c.t); });
    // entry level (question text) inverted index
    this.eidx = {}; this.edf = {};
    this.entries.forEach(function (e, i) {
      var seen = {};
      e.q.forEach(function (q) { tokens(q).forEach(function (t) { seen[t] = 1; }); });
      Object.keys(seen).forEach(function (t) { (self.eidx[t] = self.eidx[t] || []).push(i); });
    });
    this.byCardAngle = {};
    this.entries.forEach(function (e, i) { self.byCardAngle[e.c + ':' + e.a] = i; });
  };

  Adviser.prototype.addUserEntries = function (arr) {
    this.user = arr || [];
    var self = this;
    this.userTok = this.user.map(function (u) {
      var t = tokens(u.q + ' ' + u.q + ' ' + (u.k || ''));
      return t;
    });
  };

  function idf(df, N) { return Math.log(1 + (N - df + 0.5) / (df + 0.5)); }

  Adviser.prototype.scoreCards = function (msgTok) {
    var self = this, scores = new Array(this.N).fill(0), hit = new Array(this.N).fill(0);
    msgTok.forEach(function (t) {
      var df = self.cdf[t]; if (!df) return;
      var w = idf(df, self.N) * (WEAK.has(t) ? 0.3 : 1);
      for (var i = 0; i < self.N; i++) {
        var m = self.cardTok[i][t];
        if (m) { scores[i] += w * m; if (!WEAK.has(t)) hit[i]++; }
      }
    });
    // bigram bonus on title/keywords
    var bg = [];
    for (var i = 0; i < msgTok.length - 1; i++) bg.push(msgTok[i] + ' ' + msgTok[i + 1]);
    this.cards.forEach(function (c, ci) {
      var hay = (' ' + tokens(c.t + ' ' + c.kw).join(' ') + ' ');
      bg.forEach(function (b) { if (hay.indexOf(' ' + b + ' ') >= 0) scores[ci] += 2.2; });
      // small normalisation so long keyword lists do not dominate
      scores[ci] = scores[ci] / (1 + 0.04 * Object.keys(self.cardTok[ci]).length);
    });
    this.cards.forEach(function (c, ci) {
      var tt = self.titleTok[ci], mt = 0;
      tt.forEach(function (t) { if (msgTok.indexOf(t) >= 0 && !WEAK.has(t)) mt++; });
      if (tt.length) scores[ci] += 2.2 * (mt / tt.length);
    });
    this.lastHit = hit;
    return scores;
  };

  Adviser.prototype._ctxBoost = function (scores) {
    var self = this;
    this.cards.forEach(function (c, i) {
      var cw = self.ctx.cats[c.cat] || 0;
      if (cw) scores[i] += 0.35 * cw;
    });
    if (this.ctx.card >= 0) scores[this.ctx.card] += 0.5;
    return scores;
  };

  Adviser.prototype._userMatch = function (msgTok) {
    var best = -1, bs = 0;
    for (var i = 0; i < this.user.length; i++) {
      var ut = this.userTok[i], hit = 0;
      msgTok.forEach(function (t) { if (ut.indexOf(t) >= 0) hit++; });
      var sc = msgTok.length ? hit / Math.max(msgTok.length, ut.length) : 0;
      if (hit >= 2 && sc > bs) { bs = sc; best = i; }
    }
    return bs >= 0.45 ? { i: best, score: bs } : null;
  };

  Adviser.prototype._decay = function () {
    var c = this.ctx.cats;
    Object.keys(c).forEach(function (k) { c[k] *= 0.65; if (c[k] < 0.05) delete c[k]; });
  };

  Adviser.prototype._remember = function (card, angle) {
    this._decay();
    this.ctx.card = card; this.ctx.angle = angle; this.ctx.turns++;
    var cat = this.cards[card].cat;
    this.ctx.cats[cat] = (this.ctx.cats[cat] || 0) + 1;
    this.ctx.lastCards.unshift(card); this.ctx.lastCards = this.ctx.lastCards.slice(0, 6);
  };

  Adviser.prototype._chips = function (card, angle) {
    var c = this.cards[card], out = [];
    var order = [7, 8, 9, 2, 27, 11];
    for (var i = 0; i < order.length && out.length < 3; i++) {
      if (order[i] !== angle) out.push({ label: ['Example', 'What to say', 'Mistakes to avoid', 'Steps', 'What next?', 'How to measure'][i] , q: this.entries[this.byCardAngle[card + ':' + order[i]]].q[0] });
    }
    return out;
  };

  function pick(arr, seed) { return arr[Math.abs(seed) % arr.length]; }

  Adviser.prototype.styleOpen = function (msg, card) {
    var name = this.profile.name ? this.profile.name : '';
    if (EMOTION.test(msg)) {
      return pick(['That sounds hard' + (name ? ', ' + name : '') + '. Take a breath. Here is something practical:', 'I hear you. Strong feelings at work are normal. Let us make a small plan:', 'Sorry you are dealing with this. A calm plan can help:'], msg.length) + '\n\n';
    }
    return '';
  };

  // main API ------------------------------------------------------------
  Adviser.prototype.reply = function (msgRaw) {
    var msg = String(msgRaw || '').trim();
    var low = msg.toLowerCase();
    var name = this.profile.name || '';
    var res = { text: '', chips: [], card: -1, angle: -1, conf: 0, kind: 'answer', web: false };
    if (!msg) { res.kind = 'empty'; res.text = 'Type a question about your career and I will help.'; return res; }
    if (CRISIS.test(low)) {
      res.kind = 'care';
      res.text = 'I am really sorry you feel this way. You matter more than any job. Please talk to someone you trust right now, or contact a local emergency number or crisis line in your country. I am only a career guide and cannot give you the support you deserve.';
      return res;
    }
    if (GREET.test(low) && low.split(/\s+/).length <= 4) {
      res.kind = 'greet';
      res.text = 'Hello' + (name ? ' ' + name : '') + '! I am your Career Adviser. Ask me about promotion, your boss, coworkers, skills or any strategy in this app.';
      res.chips = [{ label: 'How do I get promoted?', q: 'How do I ask for a promotion?' }, { label: 'I am new at work', q: 'I am new at work. How do I start with your first 90 days at a new job?' }, { label: 'My boss ignores me', q: 'How do I get visible to executives?' }];
      return res;
    }
    if (BYE.test(low)) { res.kind = 'bye'; res.text = 'Good luck' + (name ? ', ' + name : '') + '! Come back any time. Small steps every week win careers.'; return res; }
    if (THANKS.test(low) && low.split(/\s+/).length <= 8) { res.kind = 'thanks'; res.text = 'You are welcome! Want to add one small move to your Action Plan? Tap Do it on any strategy card.'; if (this.ctx.card >= 0) res.chips = this._chips(this.ctx.card, this.ctx.angle); return res; }
    if (HELP.test(low) && low.split(/\s+/).length <= 7) {
      res.kind = 'help';
      res.text = 'I know 100 career topics with 30 kinds of answers each: steps, examples, words to say, mistakes, checklists and more. I remember our conversation, so you can say things like "give me an example" or "what next?". I am not a human or a live AI. I answer from my built-in data bank, and I can search the web for new topics when you are online.';
      res.chips = [{ label: 'How do I ask for a raise?', q: 'How do I ask for a raise?' }, { label: 'Deal with a toxic boss', q: 'How do I handle toxic office politics?' }];
      return res;
    }

    var allTok = tokens(msg);
    var msgTok = allTok.filter(function (t) { return !INTENT_WORDS.has(t); });
    var intents = detectIntents(low);
    var isMore = MORE.test(low) && allTok.length <= 3 && intents.length === 0;

    // follow-up with no topic words ("give me an example", "what next")
    var scores = this.scoreCards(msgTok);
    var order = scores.map(function (s, i) { return [s, i]; }).sort(function (a, b) { return b[0] - a[0]; });
    var top = order[0], second = order[1];
    var core = msgTok.filter(function (t) { return !WEAK.has(t); });
    var cover = core.length ? this.lastHit[top[1]] / core.length : 0;
    var topicStrong = top[0] >= 2.0 && cover >= 0.34;

    // user taught entries
    var um = this._userMatch(msgTok);

    var card = -1, angle = -1, conf = 0;

    if (isMore && this.ctx.card >= 0) {
      // keep topic, move to a new angle not yet used for this topic
      card = this.ctx.card;
      var cycle = [7, 8, 9, 11, 13, 10, 12, 22, 21, 26, 23, 29, 25, 20, 24];
      var used = (this.ctx.used && this.ctx.used[card]) || [];
      angle = cycle.filter(function (a) { return used.indexOf(a) < 0; })[0];
      if (angle === undefined) { card = this.cards[this.ctx.card].nx; angle = 0; }
      conf = 1;
    } else if (!topicStrong && this.ctx.card >= 0 && core.length === 0 && (intents.length || PRONOUN.test(low) || allTok.length <= 3)) {
      card = this.ctx.card;
      angle = intents.length ? intents[0] : 2;
      if (angle === 27) { /* next */ }
      conf = 0.9;
    } else if (topicStrong) {
      var boosted = this._ctxBoost(scores.slice());
      var ob = boosted.map(function (s, i) { return [s, i]; }).sort(function (a, b) { return b[0] - a[0]; });
      card = ob[0][1]; conf = Math.min(1, ob[0][0] / 6);
      // question style -> default angle
      if (intents.length) angle = intents[0];
      else if (/^(why)\b/.test(low)) angle = 1;
      else if (/^(what|who)\b/.test(low)) angle = 0;
      else if (/^(how|can i|should i)\b/.test(low) || /\?$/.test(msg)) angle = 2;
      else angle = 0;
      // if user says I'm new / #1 etc. as secondary, honour it
      if (intents.length > 1 && [15, 16, 17, 18, 19].indexOf(intents[1]) >= 0 && [15, 16, 17, 18, 19].indexOf(intents[0]) < 0) angle = intents[1];
    } else {
      // weak topic: entry-level search over all question texts
      var cand = {}, self = this;
      msgTok.forEach(function (t) {
        var list = self.eidx[t]; if (!list) return;
        var w = idf(list.length, self.entries.length);
        list.forEach(function (i) { cand[i] = (cand[i] || 0) + w; });
      });
      var best = -1, bs = 0;
      Object.keys(cand).forEach(function (k) { if (cand[k] > bs) { bs = cand[k]; best = +k; } });
      if (best >= 0 && bs >= 4.5) { card = this.entries[best].c; angle = intents.length ? intents[0] : this.entries[best].a; conf = Math.min(0.8, bs / 14); }
    }

    if (um && (card < 0 || um.score > 0.7)) {
      res.kind = 'user';
      res.text = this.styleOpen(low) + this.user[um.i].a + (this.user[um.i].src ? '\n\n(Source: ' + this.user[um.i].src + ')' : '');
      res.conf = um.score; res.chips = [];
      return res;
    }

    if (card < 0 || conf < 0.12) {
      // not understood: suggest closest topics, offer web
      var sug = order.slice(0, 3).filter(function (o) { return o[0] > 0.6; });
      res.kind = 'unsure';
      res.web = true;
      if (sug.length) {
        res.text = 'I am not fully sure what you mean. Did you mean one of these topics?';
        var self2 = this;
        res.chips = sug.map(function (o) { return { label: self2.cards[o[1]].t, q: 'Explain ' + self2.cards[o[1]].t + ' to me' }; });
      } else {
        res.text = 'I do not have a good answer for that in my data bank yet. You can rephrase it, or tap "Search the web" and I will look for it and let you save it to my data bank.';
        res.chips = [{ label: 'How do I get promoted?', q: 'How do I ask for a promotion?' }, { label: 'Dealing with my boss', q: 'How do I build a good relationship with my boss?' }];
      }
      return res;
    }

    if (angle < 0) angle = 2;
    var idx = this.byCardAngle[card + ':' + angle];
    var entry = this.entries[idx];
    var cardObj = this.cards[card];
    var text = entry.t;

    // multi intent: add second angle briefly
    if (intents.length > 1 && !isMore) {
      var a2 = intents[1];
      if (a2 !== angle) {
        var i2 = this.byCardAngle[card + ':' + a2];
        if (i2 !== undefined && a2 !== angle) text += '\n\n' + this.entries[i2].t;
      }
    }

    // style: short/casual message -> keep first part, longer message -> full answer
    var wordsIn = low.split(/\s+/).length;
    if (wordsIn <= 3 && !isMore && text.length > 320 && angle === 2) { /* keep list, steps are short */ }

    // personalisation: user position
    var pos = this.profile.position;
    var strategyNote = '';
    if (pos && angle === 2 && [16, 17, 18, 19].indexOf(angle) < 0) {
      var map = { leader: 16, challenger: 17, flanker: 18, guerrilla: 19 };
      if (map[pos] !== undefined && this.ctx.turns % 3 === 0) {
        var pe = this.entries[this.byCardAngle[card + ':' + map[pos]]];
        strategyNote = '\n\nFor your strategy (' + pos + '): ' + pe.t.replace(/^As the [^,]+, /, '');
      }
    }

    // topic switch notice
    var prefix = '';
    if (this.ctx.card >= 0 && card !== this.ctx.card && (angle === 27 || isMore)) prefix = 'Moving on to: ' + cardObj.t + '.\n\n';
    prefix += this.styleOpen(low);

    res.text = prefix + text + strategyNote;
    res.card = card; res.angle = angle; res.conf = conf;
    res.chips = this._chips(card, angle);
    this.ctx.used = this.ctx.used || {};
    (this.ctx.used[card] = this.ctx.used[card] || []).push(angle);
    this._remember(card, angle);
    return res;
  };

  root.PWAdviserEngine = { Adviser: Adviser, tokens: tokens, detectIntents: detectIntents };
  if (typeof module !== 'undefined' && module.exports) module.exports = root.PWAdviserEngine;
})(typeof window !== 'undefined' ? window : globalThis);
