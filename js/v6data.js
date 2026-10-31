/* V06 content: example profiles, strategy checklists, cheat sheet, what-if scenarios, badges, extra glossary words. */
window.PW6 = {};

PW6.POS_LABEL = { leader: 'Leader (#1)', challenger: 'Challenger (#2)', flanker: 'Flanker (#3)', guerrilla: 'Underdog (Guerrilla)' };
PW6.POS_STRAT = { leader: 'Defensive', challenger: 'Offensive', flanker: 'Flanking', guerrilla: 'Guerrilla' };
PW6.POS_ICON = { leader: '🛡️', challenger: '⚔️', flanker: '🚀', guerrilla: '🥷' };

/* ---------- example profiles (load into a NEW company profile) ---------- */
PW6.PERSONAS = [
  {
    id: 'engineer', name: 'The Stagnant Mid-Level Engineer', short: 'Engineer', pos: 'flanker', vis: 3, inf: 6, me: 'You (Engineer)',
    about: 'Good at the job, but nobody notices. Same level for three years.',
    rows: [['Linda Park', 'CEO', 1], ['Raj Mehta', 'CTO', 1], ['Tom Briggs', 'Engineering Manager', 2], ['Priya Nair', 'Senior Architect', 2], ['You (Engineer)', 'Software Engineer', 3], ['Sam Ortiz', 'Product Owner', 3], ['Jo Lee', 'QA Analyst', 4], ['Ben Carter', 'Intern', 4]]
  },
  {
    id: 'head', name: 'The New Department Head', short: 'Dept. Head', pos: 'leader', vis: 8, inf: 7, me: 'You (Dept. Head)',
    about: 'Just got the top job in a department. Everyone is watching, and some are not happy.',
    rows: [['Helen Rossi', 'CEO', 1], ['Mark Dunn', 'CFO', 1], ['You (Dept. Head)', 'Head of Sales', 2], ['Omar Hadad', 'Head of Marketing', 2], ['Gina Shaw', 'Senior Sales Rep', 3], ['Pete Novak', 'Sales Team Lead', 3], ['Ana Cruz', 'Sales Rep', 4], ['Lee Kim', 'Sales Assistant', 4]]
  },
  {
    id: 'underdog', name: 'The Underdog Contributor', short: 'Underdog', pos: 'guerrilla', vis: 2, inf: 2, me: 'You (New Hire)',
    about: 'Young and new. Small tasks, no big name yet, but eager to grow.',
    rows: [['Diana Wolf', 'Managing Director', 1], ['Victor Reyes', 'Operations Director', 1], ['Nina Patel', 'Team Manager', 2], ['Kyle Brooks', 'Senior Analyst', 3], ['Rosa Lim', 'Office Coordinator', 3], ['You (New Hire)', 'Junior Associate', 4], ['Max Fischer', 'Junior Associate', 4], ['Tara Green', 'Intern', 4]]
  }
];

/* ---------- checklists inside each strategy ---------- */
PW6.CHECKS = {
  leader: ['I wrote down my top 3 customers or tasks.', 'I checked on each of them this week.', 'I taught a coworker a key part of my job.', 'I asked for honest feedback and fixed one weak spot.', 'I kept energy in reserve: I said no to one extra request.', 'I told my manager one result, with a number.'],
  challenger: ['I picked ONE skill or topic my boss cares about most.', 'I found one thing the leader is weak at.', 'I took one visible task and did it perfectly.', 'I showed a result with numbers.', 'I brought one new idea this week.', 'I asked for a bigger task or the path to the next level.'],
  flanker: ['I found an area nobody owns yet.', 'I picked one tool or topic to master.', 'I built something small and useful, quietly.', 'I showed it finished, not half-done.', 'I wrote a short guide about it, or taught it to someone.', 'I have a backup plan for my niche.'],
  guerrilla: ['I picked one small boring job to master.', 'I stepped back from one fight and chose a better moment.', 'I finished one task before the deadline.', 'I shared credit: "thanks, the team helped".', 'I learned one skill that works in any company.', 'I added one new result to my CV.']
};

/* ---------- cheat sheet ---------- */
PW6.CHEAT = {
  leader: { motto: 'Protect what you have.', rules: ['Be the most reliable person on the team.', 'Disrupt your own routines before others do.', 'Block rivals\' strong moves: support good ideas and improve them.', 'Keep energy in reserve for real crises.', 'Share knowledge so you stay needed, not stuck.'], say: ['"Here is the plan if something goes wrong."', '"Let me show you how I did it so the team moves faster."'], avoid: ['Showing off.', 'Hiding how things work.'] },
  challenger: { motto: 'Beat them on ONE thing.', rules: ['Pick the one thing your boss cares about most.', 'Find the leader\'s weak spot and get strong there.', 'Choose one small, visible task and do it perfectly.', 'Show results with numbers.', 'Fight the problem, never the person.'], say: ['"I can take this on. Here is my plan and timeline."', '"This went from 20 to 30 a day since last month."'], avoid: ['Public fights with the leader.', 'Doing too many things at once.'] },
  flanker: { motto: 'Go where they are not looking.', rules: ['Prepare a backup plan for one important task.', 'Volunteer for a new tool or job nobody wants yet.', 'Build quietly, then show it finished.', 'Own a small niche and be the go-to person.', 'Share the credit.'], say: ['"I noticed nobody owns this. I can start a small test."', '"Here is a working version. Can I get your feedback?"'], avoid: ['Showing half-done work.', 'Forgetting your main job.'] },
  guerrilla: { motto: 'Be small, fast and smart.', rules: ['Step back from strong pushes. Talk later, when calm.', 'Become the expert on one small boring job.', 'Share the credit after a win.', 'Learn skills that work in any company.', 'Keep your CV fresh.'], say: ['"Let me think and come back to you this afternoon."', '"Thanks, the team helped a lot."'], avoid: ['Head-on fights with stronger people.', 'Bragging too early.'] }
};
PW6.CHEAT_MEET = ['Know the goal of the meeting in one sentence.', 'Prepare 2 questions and 1 number.', 'Decide what you want people to remember about you.', 'Arrive 5 minutes early and greet people by name.', 'Listen first, speak second, and keep it short.'];
PW6.CHEAT_REVIEW = ['Bring your wins list with dates and numbers.', 'Say what you learned from one mistake.', 'Ask: "What does the next level need from me?"', 'Name one goal for the next 3 months.', 'Say thank you and write down what was agreed.'];

/* ---------- what-if scenarios ---------- */
PW6.NEXT_UP = { guerrilla: 'flanker', flanker: 'challenger', challenger: 'leader', leader: 'guerrilla' };
PW6.ADVICE = {
  leader: 'Play defensive. Protect your key tasks and customers, teach others, and keep energy in reserve.',
  challenger: 'Play offensive. Pick ONE thing to beat the leader at and show results with numbers.',
  flanker: 'Play flanking. Find an area nobody owns and build it quietly, then show it finished.',
  guerrilla: 'Play guerrilla. Stay small and fast, avoid fights, master one boring job and share the credit.'
};
PW6.SCENARIOS = [
  { id: 'boss-leaves', t: 'The top executive (#1) leaves', base: 'A big chair is empty. People will compete for it and the rules may change.', to: { leader: 'leader', challenger: 'leader', flanker: 'challenger', guerrilla: 'flanker' } },
  { id: 'promoted', t: 'I get promoted one level', base: 'New level, new people. At the next level you are new again.', to: { leader: 'guerrilla', challenger: 'leader', flanker: 'challenger', guerrilla: 'flanker' } },
  { id: 'rival', t: 'A strong new rival joins my team', base: 'Someone good arrives and people start to compare you with that person.', to: { leader: 'leader', challenger: 'challenger', flanker: 'guerrilla', guerrilla: 'guerrilla' } },
  { id: 'reorg', t: 'The company reorganizes or merges', base: 'Teams are mixed and nobody is sure who decides what. For a few months everyone is new.', to: { leader: 'guerrilla', challenger: 'guerrilla', flanker: 'guerrilla', guerrilla: 'guerrilla' } },
  { id: 'manager', t: 'My direct manager changes', base: 'The new manager does not know your results yet. Build trust again.', to: { leader: 'leader', challenger: 'challenger', flanker: 'flanker', guerrilla: 'guerrilla' } },
  { id: 'win', t: 'I deliver a big, visible win', base: 'People finally notice you. This is the best moment to move.', to: { leader: 'leader', challenger: 'leader', flanker: 'challenger', guerrilla: 'flanker' } }
];

/* ---------- badges ---------- */
PW6.BADGES = [
  { id: 'mapped', e: '🗺️', n: 'Battlefield Mapped', h: 'Add 4 or more people to your Power Rank Table.' },
  { id: 'pyramid', e: '👑', n: 'Pyramid Builder', h: 'Open the Power Pyramid page.' },
  { id: 'highground', e: '🏔️', n: 'High Ground Secured', h: 'Find your position in the Strategic Square.' },
  { id: 'explorer', e: '🧭', n: 'Strategy Explorer', h: 'Open all 4 strategy pages.' },
  { id: 'leader', e: '🛡️', n: 'Defensive Strategist', h: 'Choose the Leader position.' },
  { id: 'challenger', e: '⚔️', n: 'Offensive Strategist', h: 'Choose the Challenger position.' },
  { id: 'flanker', e: '🚀', n: 'Flanking Strategist', h: 'Choose the Flanker position.' },
  { id: 'guerrilla', e: '🥷', n: 'Guerrilla Strategist', h: 'Choose the Underdog position.' },
  { id: 'firstmove', e: '⚡', n: 'First Move', h: 'Add your first move to the Action Plan.' },
  { id: 'planner', e: '📋', n: 'Planner', h: 'Have 5 moves in your Action Plan.' },
  { id: 'finisher', e: '✅', n: 'Finisher', h: 'Complete 3 moves.' },
  { id: 'rulebook', e: '📜', n: 'Rulebook Complete', h: 'Tick all 6 rules in one strategy checklist.' },
  { id: 'winner', e: '🏅', n: 'Win Collector', h: 'Write 3 wins in your Wins Journal.' },
  { id: 'adviser', e: '💬', n: 'Adviser Friend', h: 'Ask the Adviser 5 questions.' },
  { id: 'lab', e: '🔬', n: 'Strategy Scientist', h: 'Use the Position Grid and one What-if.' },
  { id: 'printed', e: '🖨️', n: 'Dossier Ready', h: 'Print or export your dossier.' },
  { id: 'complete', e: '🏆', n: 'Mission Complete', h: 'Finish 100% of your Action Plan.' }
];

/* ---------- extra glossary words (tap-to-reveal) ---------- */
PW6.GLOSS_EXTRA = [
  ['Political capital', 'The trust and goodwill you have built. You spend it when you ask for support, so save it for important moments.'],
  ['High ground', 'A strong position, like controlling an important task or having the boss\'s trust. From there it is easier to be seen and to win.'],
  ['Reserves', 'Energy, time and goodwill you keep for later, so you are not empty when a real crisis arrives.'],
  ['Defensive warfare', 'The strategy for the leader (#1): protect what you have.'],
  ['Offensive warfare', 'The strategy for the challenger (#2): beat the leader at one important thing.'],
  ['Flanking', 'Going to an area the leader is not watching, instead of a direct fight.'],
  ['Guerrilla warfare', 'The strategy for the underdog: small, fast, smart moves without big fights.'],
  ['Territory', 'The tasks, customers and knowledge that are yours.'],
  ['Single point of failure', 'A job only one person can do. If that person is missing, everything stops.'],
  ['Sponsor', 'A senior person who speaks well of you when you are not in the room.'],
  ['Credit', 'The recognition for a success. Sharing it makes allies.']
];
