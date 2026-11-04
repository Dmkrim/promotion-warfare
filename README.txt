PROMOTION WARFARE - WEB APP PACKAGE
V11 - standard (files kept separate)
===================================
Files
  index.html              the app (welcome, help, examples, journal, glossary, profile, about, privacy)
  privacy.html            the same Privacy Policy as a web page (for store listings)
  bank.js                 Adviser data bank (3000 questions and answers)
  js/                     adviser.js (engine), avatars.js (50 avatars), app2.js (app logic),
                          strategies.js (80 extra strategy ideas + quick ideas), extras.js (swipe, animations),
                          v6data.js (example profiles, checklists, cheat sheet, badges), v6.js (V06 features),
                          howto.js (Adviser answers about how to use the app),
                          v7data.js (10 examples, 25 challenges, 100 abbreviations, 12-week mission, stories), v7.js (V07 features),
                          v8data.js (daily cards, quiz, phrasebook content), v8.js (V08 features)
  app-icon.png            the app icon (Welcome page and header)
  hiprogress-logo.png     circular logo     004.jpg  background
  manifest.webmanifest, sw.js, icons/    PWA parts

HOW TO USE
  1. Unzip. Upload ALL files and folders to your GitHub Pages repo (keep the same folders).
  2. Open the site once on your phone while online. After that it also works offline.
  3. In PWABuilder enter the site address and build the Android package.
     Privacy Policy address for stores: https://YOUR-SITE/privacy.html

NEW IN V08
  Daily 1-minute lesson with streak (Welcome page). Quiz and Flashcards (160 questions incl. 100 abbreviations).
  Phrasebook (40 scripts). Career Tools: CV Bullet Builder, Interview STAR Stories, Goal Builder with progress bars.
  4 new badges (25 in total).

NEW IN V07 (second update)
  Pinch-zoom allowed. Grammar fixes. 10 quick-load examples. You are added to the Power Rank Table
  and the pyramid automatically. Company name banner. Challenge drop menu (25) with moves to add.
  Raise pitch maker in the Wins Journal. 100 business abbreviations (ask the Adviser). 6 new starter-path
  stories. Weekly mission card, streak and calendar reminder. Backup / restore file + protected storage.
  4 new badges. Shop link removed from About; contact e-mail in the Privacy Policy.

NEW IN V07 (first update)
  The Adviser now answers "how do I use the app" questions (text size, profile photo, print, install, ...)
  and can take you to the right page. 45 app-help answers in js/howto.js.

NEW IN V06
  Drag-and-drop Power Pyramid, auto-save of the Power Rank Table, 3 company profiles with compare,
  sort/filter table, Strategic Square grid + What-if lab, example profiles, strategy checklists,
  task status/deadline/priority, completion seal, Print / Save as PDF, CSV export, tap-to-reveal
  glossary, Cheat Sheet, 17 badges, time estimates, keyboard + screen-reader support, install prompt.

NOTES
  - Tailwind and FontAwesome load from the internet on the first visit and are then cached.
  - Web search in the Adviser uses Wikipedia only and needs internet.
  - After updating the site, the old version may show once; close and reopen the app.

ANIMATED HELP (added to V08)
- New file: js/guide.js (upload it with the other files).
- Each page shows short tips with an arrow the first time it opens. Buttons: Next, Skip, Turn off help.
- Round "?" button (bottom left) shows the tips again on any page.
- Profile and Settings has an "Animated help" ON/OFF switch and a "Show all tips again" button.
- The setting is saved as pw_guide and is included in Backup and Restore.


V09 (new)
- js/v9.js: Salary Helper, 1:1 Meeting Planner, Boss Style Quiz, Feedback Log, voice input (microphone) and read-aloud. 4 new badges (29 in total).
- Animated help now covers every page, including the new ones.
- Removed the "Draw it" box from the Corporate Power Pyramid page.
- Data keys: pw_salary, pw_meet, pw_boss, pw_fb, pw_voice (all included in Backup and Restore).
- Voice needs a phone and browser that support speech. The buttons are hidden when not supported.
- Extra space under the HiProgress banner so the round buttons never cover it.

V10 (new)
- js/v10data.js and js/v10.js: Office Politics Game. 30 stories, 3 levels of 10, no timer, animated meters, lessons, ranks, share, 2 new badges (31 in total).
- Voice picker in Profile and Settings (voice list, speed, pitch, test button) in js/v9.js.
- Data keys: pw_game, and pw_voice now also stores voice, speed and pitch.

V11 (new)
- js/v11.js: animated icons everywhere (emoji and Font Awesome), zoom helper, Adviser search of all topics with more than one answer and a Search-the-web button on every answer (not case sensitive).
- Pinch-zoom fixed on every page (the swipe code was limiting touch to vertical only). When zoomed in you can pan in any direction.
- Welcome page: the 1-minute lesson, This week's move and Today's move now sit under the icon buttons. New animated icons for Quiz, Phrasebook, Career Tools and Goals.
- Animated help: the page is locked (no scrolling) while a tip is open. The Welcome tour now covers every button and card.
- Office Politics Game: 7 more levels (10 in total, 86 stories). New levels: Remote Rules, Client Zone, Team Captain, Fire Drill, Next Step, Executive Floor, Grandmaster.
- Profile and Settings is now one long page.


V12 (new): 30 animated features. Files: js/v12data.js, js/v12core.js, js/v12vis.js, js/v12games.js (upload the whole folder).
- XP and levels (9 titles). Level-up screen with confetti and screen shake. Animated XP ring. 3 level badges.
- Effects setting in Profile and Settings: Full, Light or Off (also follows your phone's "reduce motion").
- Sound (made in the browser, no audio files) and vibration: OFF by default. Speaker button in the top bar and a switch in Profile. Vibration works on Android only.
- Power aura (4 colours), avatar items and animated backgrounds (radar, grid, matrix) that unlock with levels.
- Day/Night switch is now an animated circle reveal. Cards fold in when you open a page. Parallax tilt on cards. Radar scanner shows while the Adviser thinks.
- Number counters roll up in the Action Plan. "QUEST COMPLETED" stamp when you finish a move. Liquid-fill meters.
- Streak flame grows with your streak. Streak freeze saves one missed day (earned at 7, 14 and 30 days, max 2, also a spin prize).
- Hologram pyramid (drag to turn, gyroscope on Android) with your avatar climbing tiers. Spring bounce when someone changes tier. Cheat Sheet cards open like classified dossiers.
- Badge pop-ups bounce and flip, with Common / Rare / Epic looks.
- New pages in Career Tools (now in 3 groups): Boss Battles, Swipe Cards, Spot the Red Flag, Message Makeover, Buzzword Bingo, Daily Spin, Career Journey (path + skill tree), Progress Dashboard, Monthly Recap, Review Countdown, Mood Check-in, Focus Timer.
- Intro tour (PW12.tour) and the coach owl that reacts to moves, wins and badges.
- 10 new badges (41 in total). Data keys: pw_fx, pw_sound, pw_xp, pw_act, pw_aura, pw_item, pw_bg, pw_freeze, pw_boss12, pw_swipe, pw_spin, pw_bingo, pw_mood, pw_focus, pw_review, pw_tour.
- Not included on purpose: share cards (#31).
- Tested in a desktop browser only. Sound, vibration and gyroscope are untested on a real phone.


V13 (new): 20 animations for the main pages. File: js/v13.js (upload the whole folder).
- Promotion meter: a thin bar at the top of every page. Milestones at 25, 50, 75, 100 percent. Tap it to see what builds it.
- Welcome: Road to promotion with a walking avatar, greeting scene for the time of day, My big goal with a day countdown, and a daily lesson card that is closed until you tap it (stamps DONE when finished).
- Pyramid: glowing power lines, new people pop in, the pyramid builds itself, Ally / Neutral / Risk marks (green glow, red pulse), and a new "Make a picture to share" button with an animated build.
- Strategic Square: question cards are dealt in, a mini square shows which strategies are left, and the strategy you get is revealed with a card shuffle.
- Strategy pages: swipe a rule card right to add it to your plan, left to skip. The Explain it window shows a before and after scene.
- Action Plan: Battle board for the week (perfect week = flame) and a 15 minute move timer ring (stopwatch button on each move).
- Adviser: the helper blinks while thinking, types its answer letter by letter, nods at the end, and the buttons slide in. A Practice it button opens a matching game for some topics.
- Wins Journal: wins wall (one brick per win, gold for wins with numbers). Making the raise pitch now writes itself and stamps READY TO PRESENT.
- New data keys: pw_goal13, pw_dcopen, pw_rel, pw_promo_ms, pw_mtrun.
- Effects: Light keeps the fixed pieces, Off removes the moving effects.
- Note: the old picture box was removed in V09, so the share picture is a new overlay button.

V13 fix: the pyramid build now also builds the hologram (slower, with a "▶ Play build" button under the pyramid). Ally / Neutral / Risk now has a small circle button on every person (tap to cycle). Effects Light also shows the build, the Explain scene and the typing Adviser (only Off turns them off).

V14: same app as V13 (version label and offline cache name updated to V14, so phones fetch the new files).
Privacy page updated: the optional voice button (microphone) is now described, to match Google Play's Data safety form.
