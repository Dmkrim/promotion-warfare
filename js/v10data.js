/* Promotion Warfare V10 - Office Politics Game data.
   Each scenario: [title, sceneEmoji, characterEmoji, story, lesson, strategyPage, [ [choice, reaction, rep, allies, stress, quality], x3 ]]
   quality: b = best (10 points), o = okay (5 points), x = poor (0 points). Meters: Reputation, Allies, Stress (stress up is bad). */
window.PW10 = window.PW10 || {};
PW10.LEVELS = [
  { n: 'Starter', e: '🌱', d: 'First job moments' },
  { n: 'Player', e: '🎯', d: 'Real office tension' },
  { n: 'Strategist', e: '♟️', d: 'Hard power moves' }
];
PW10.RANKS = [[0, 'Rookie', '🐣'], [40, 'Player', '🎯'], [65, 'Strategist', '♟️'], [85, 'Mastermind', '👑']];
PW10.GAME = [
  /* ---------------- LEVEL 1: Starter ---------------- */
  ['First lunch', '🍽️', '🧑‍🤝‍🧑', 'It is your first week. At lunch the team sits together and talks. Nobody invites you. You are holding your tray.',
    'Allies start with small steps. A simple hello is a strong first move.', 'strat-flanker', [
      ['Walk over and ask, "Can I sit here?"', 'They smile and move over. Someone asks about you. Good start!', 8, 10, -5, 'b'],
      ['Sit alone and look at your phone.', 'Nobody bothers you, but nobody learns your name either.', -2, -4, 3, 'o'],
      ['Skip lunch and work at your desk.', 'People think you are shy or not interested in the team.', -4, -8, 6, 'x']]],
  ['Stolen idea', '💡', '😏', 'You told a coworker your idea for a faster process. In the team meeting he says it as his own idea. The boss says, "Great idea!"',
    'Stay calm, then make your work visible. Never attack in public.', 'strat-leader', [
      ['After the meeting, send the boss a short note: "Happy my idea helps. I can set it up if you like."', 'The boss sees who really made it. You look professional and ready to lead.', 10, 3, -3, 'b'],
      ['Say loudly in the meeting, "That was MY idea!"', 'Everyone feels the tension. You look angry and the boss is not happy.', -8, -8, 10, 'x'],
      ['Say nothing and be angry inside.', 'It happens again next month. Nobody knows what you did.', -6, -2, 8, 'x']]],
  ['Unclear task', '❓', '👔', 'Your boss gives you a task fast and walks away. You do not understand half of it. The deadline is tomorrow.',
    'Smart questions are a sign of care, not weakness. Ask early.', 'strat-guerrilla', [
      ['Catch your boss in 2 minutes: "To be sure, you want X by tomorrow, right?"', 'Your boss clears up the details. The result is right the first time.', 9, 4, -6, 'b'],
      ['Guess and hope it is right.', 'You work until late and half of it is wrong.', -6, -2, 9, 'x'],
      ['Ask a coworker who is also not sure.', 'You get an answer, but it is not what the boss wanted.', -2, 2, 3, 'o']]],
  ['The mistake', '📉', '😬', 'You see a mistake in the report you sent yesterday. Nobody has noticed it yet.',
    'Tell the truth fast and bring a fix. Trust grows from honesty.', 'strat-leader', [
      ['Tell your boss now and send the fixed version.', 'Your boss says thanks for being honest. Your trust grows.', 10, 4, -4, 'b'],
      ['Fix it quietly and say nothing.', 'The file is right, but the old one was already shared.', 0, 0, 3, 'o'],
      ['Hope nobody sees it.', 'A client finds it. The boss asks why you did not say.', -12, -6, 12, 'x']]],
  ['Gossip chat', '💬', '🗣️', 'The team group chat is full of jokes about a coworker who is not in the chat. Everyone is waiting to see what you write.',
    'People remember who gossips. Stay kind without lecturing.', 'strat-flanker', [
      ['Do not join. Later send that coworker a friendly message.', 'You are seen as fair and safe. That coworker becomes your friend.', 6, 10, -3, 'b'],
      ['Write a joke too.', 'Fun now, but you worry the coworker will find out.', -4, 2, 6, 'x'],
      ['Write "Guys, that is mean!" in the chat.', 'Some feel judged. Honest, but a private word works better.', 2, -3, 5, 'o']]],
  ['Stay late', '🌙', '⏰', 'Your boss asks you to stay 2 hours late today. You have a family dinner tonight.',
    'Say yes to the goal and offer a smart option. Do not just say no.', 'strat-challenger', [
      ['"I have a dinner. I can start early tomorrow, or work 1 hour now. What is best?"', 'Your boss respects the clear offer and picks the early start.', 8, 5, -3, 'b'],
      ['Say yes and cancel your dinner angrily.', 'You do it, but you are tired and annoyed for days.', 2, 0, 10, 'o'],
      ['Say "No, it is not my job."', 'Your boss remembers this when raises are planned.', -9, -5, 6, 'x']]],
  ['Silent in the meeting', '🪑', '🙋', 'You are the youngest in a meeting. You have an idea, but older people keep talking. The meeting is almost over.',
    'A short, prepared point can be strong. Speak early next time.', 'strat-guerrilla', [
      ['Wait for a pause and say, "I have one quick idea. May I?"', 'People listen. The boss writes it down.', 9, 5, -4, 'b'],
      ['Send your idea to the boss by message after.', 'Safe, but the team did not see it was yours.', 3, 0, 0, 'o'],
      ['Keep quiet. Maybe next time.', 'Nobody knows what you can do.', -4, -2, 5, 'x']]],
  ['Only criticism', '🌧️', '😐', 'In three weeks your boss never said anything good. Only "fix this" and "do it again". You feel low.',
    'Ask for clear feedback. It turns fog into a plan.', 'strat-challenger', [
      ['Ask: "What would excellent work look like for you?"', 'The boss gives 3 clear points. You also learn what they like.', 9, 4, -7, 'b'],
      ['Give a lazy effort. Why try?', 'Quality drops. Now the boss has a real reason to criticize.', -9, -4, 7, 'x'],
      ['Complain to coworkers.', 'It feels good for a minute, then the boss hears about it.', -6, -3, 6, 'x']]],
  ['Always late', '🐢', '😴', 'A coworker is late every day. You cover for them and do extra work. You are tired and angry.',
    'Talk to the person first. Do not pile it on yourself.', 'strat-leader', [
      ['Talk privately: "When you are late I cover. Can we find a plan?"', 'He is surprised, says sorry and tries to change.', 7, 5, -6, 'b'],
      ['Go straight to the boss to complain.', 'The boss helps, but your coworker feels betrayed.', 1, -7, 3, 'o'],
      ['Keep covering for months.', 'You burn out and nobody knows why.', -4, 0, 12, 'x']]],
  ['Elevator moment', '🛗', '👑', 'You are alone in the elevator with the big boss. It is a 30 second ride. They say, "Hi. How is it going?"',
    'Be short, positive and specific. A short answer leaves a strong memory.', 'strat-guerrilla', [
      ['"Great! I just helped finish the X project. I am learning a lot."', 'The big boss nods: "Good. Keep it up!" They remember your name.', 10, 4, -3, 'b'],
      ['"Fine." Then look at the floor.', 'A missed chance. Nothing bad, nothing good.', 0, 0, 2, 'o'],
      ['Complain about how busy everyone is.', 'The big boss now links your name with complaining.', -9, -3, 6, 'x']]],

  /* ---------------- LEVEL 2: Player ---------------- */
  ['Two sides', '⚔️', '😤', 'Two coworkers are in a fight. Each one comes to you privately and says the other is wrong. Both ask you to take their side.',
    'Be a bridge, not a team member. Stay friendly with both.', 'strat-flanker', [
      ['Listen to both. Say, "I see why you are upset. Maybe talk to each other?"', 'Both trust you. Later they thank you for staying fair.', 7, 10, -3, 'b'],
      ['Choose the one you like more.', 'You win one friend and lose another. The fight gets bigger.', -3, -6, 7, 'x'],
      ['Avoid both of them for a week.', 'Safe, but both feel you left them alone.', -1, -4, 4, 'o']]],
  ['Changing priorities', '🌀', '🤯', 'Your boss changes the top priority every day. You never finish anything. You feel stuck.',
    'Make priorities visible. A short list stops the chaos.', 'strat-challenger', [
      ['Send a list: "These are my 3 tasks. Which one comes first today?"', 'The boss picks. You finish more and feel in control.', 9, 3, -8, 'b'],
      ['Follow every change and work faster.', 'You run all day and finish nothing well.', -3, 0, 10, 'x'],
      ['Pick what you like and ignore the rest.', 'The boss is surprised and angry about the wrong choice.', -8, -3, 6, 'x']]],
  ['Hide the mistake', '🙈', '😰', 'A friend at work made a big error. He asks you, "Please do not tell anyone. I will fix it later." You know the client will be affected.',
    'Help your friend do the right thing. Do not carry their risk.', 'strat-leader', [
      ['Say, "Tell the boss today. I will come with you if you want."', 'He is afraid but does it. The boss values his honesty. He thanks you later.', 8, 6, -3, 'b'],
      ['Say OK and keep the secret.', 'It comes out later and you are linked to it.', -10, -4, 11, 'x'],
      ['Tell the boss yourself without telling him.', 'The problem is solved, but he feels betrayed.', 2, -9, 5, 'o']]],
  ['Better job inside', '🚪', '🔭', 'You hear that another team has an open job that pays more. Your boss does not know you are interested.',
    'Explore openly and respectfully. Surprises can hurt trust.', 'strat-flanker', [
      ['Talk to the other team leader first, then tell your boss you want to grow.', 'Everyone knows your plan. Your boss even promises to help you.', 8, 6, -3, 'b'],
      ['Apply in secret.', 'Your boss hears from someone else and feels hurt.', -6, -6, 8, 'x'],
      ['Do nothing. Maybe it is not for you.', 'Safe, but a chance passes by.', -1, 0, 3, 'o']]],
  ['Unfair promotion', '🏆', '😒', 'A coworker gets promoted. You think you deserved it more. Everyone looks at you to see your reaction.',
    'Be gracious in public. Ask for your path in private.', 'strat-challenger', [
      ['Congratulate them. Later ask your boss: "What do I need to be next?"', 'You look strong and mature. Your boss gives you clear steps.', 10, 6, -4, 'b'],
      ['Show anger and say it is unfair.', 'People see bitterness, and the new leader is now your rival.', -9, -7, 10, 'x'],
      ['Say nothing to anyone and quietly look for another job.', 'You protect yourself, but nobody can help you grow here.', -2, -2, 6, 'o']]],
  ['Point stolen', '🎤', '🧐', 'In a meeting your boss repeats your point from last week as new, and the team is excited. She does not mention you.',
    'Plan to be seen. Say it first, or send a note before meetings.', 'strat-guerrilla', [
      ['Say, "Glad this works. I can lead the next step."', 'The boss smiles, a bit embarrassed. You are now in charge of it.', 8, 3, -3, 'b'],
      ['Say, "That was my idea," in front of everyone.', 'Awkward. She feels attacked.', -6, -6, 8, 'x'],
      ['Let it go this time.', 'Nothing changes. It happens again.', -3, 0, 5, 'x']]],
  ['Remote silence', '📡', '🤐', 'You work from home. You send messages, but your team answers slowly. You feel invisible.',
    'Remote work needs more visible work. Show progress on purpose.', 'strat-guerrilla', [
      ['Send a short weekly note with what you did and what you need.', 'People notice you. Your boss says, "Thanks for the updates!"', 9, 4, -5, 'b'],
      ['Stop answering too. Match their speed.', 'Now nobody knows what you do.', -6, -4, 5, 'x'],
      ['Send ten messages a day asking for replies.', 'People feel pressure and avoid your messages.', -4, -5, 7, 'x']]],
  ['The big boss asks', '🕵️', '🎩', 'Your boss\'s boss stops you and asks, "What do you really think of your manager?"',
    'Be honest and positive. Never speak badly about your boss.', 'strat-leader', [
      ['"I learn a lot from her. I would love more chances to lead small projects."', 'Both of them look good in the story, and you got a request in.', 9, 5, -3, 'b'],
      ['Share all the problems you have with her.', 'The big boss thinks you are not loyal. It gets back to your manager.', -10, -8, 10, 'x'],
      ['Say "No comment" and walk away.', 'Safe, but strange. The big boss will be careful with you.', -2, -1, 5, 'o']]],
  ['Extra work, no title', '🧺', '🧾', 'Your boss gives you tasks that are not in your job. It is more work and there is no change in pay or title.',
    'Say yes to learn, but ask for something back, like a title or review date.', 'strat-challenger', [
      ['Say yes and ask: "Can we review my role and pay in 3 months?"', 'The boss says yes and writes it down. Now there is a plan.', 9, 3, -2, 'b'],
      ['Do it silently and hope for the best.', 'You become the "helper" and nobody offers more.', -3, 1, 8, 'x'],
      ['Refuse everything outside your job.', 'You are safe, but look like you do not want to grow.', -6, -4, 4, 'x']]],
  ['Busy boss', '🗓️', '📞', 'You want feedback from your boss. She is always in a hurry and says, "Later."',
    'Make it easy to say yes: short, specific, with a time.', 'strat-guerrilla', [
      ['Send a calendar invite: "10 minutes, 2 questions about my work."', 'She accepts. In 10 minutes you get 3 useful tips.', 9, 4, -5, 'b'],
      ['Ask every time you see her in the hall.', 'She feels chased and says "later" again.', -2, -2, 6, 'x'],
      ['Stop asking. She does not care.', 'You never learn how you are doing.', -5, -2, 7, 'x']]],

  /* ---------------- LEVEL 3: Strategist ---------------- */
  ['Credit in front of the director', '🎬', '🤵', 'Your manager shows the director your project and says "my team did this" but never says your name. You did 80% of the work.',
    'Private first, with facts. Then build a record of your work.', 'strat-challenger', [
      ['Send a short summary of your part to the manager and say you are glad to present it next time.', 'Your manager gets the message politely. Next time you present.', 10, 2, -3, 'b'],
      ['Email the director with your complaint.', 'Going over your boss brings a big conflict.', -10, -8, 12, 'x'],
      ['Accept it as part of the job.', 'Fine once, but if it repeats you stay invisible.', -4, 0, 6, 'x']]],
  ['Same promotion', '🥇', '🤝', 'A team leader job opens. You and your close friend both want it. You both know.',
    'Keep the friendship and compete fairly. Be open about it.', 'strat-challenger', [
      ['Tell your friend: "May the best one win. Let us stay friends."', 'You respect each other. Both of you look professional.', 8, 8, -3, 'b'],
      ['Say bad things about your friend to the boss.', 'You may win, but you lose a friend and trust.', -9, -10, 10, 'x'],
      ['Withdraw to save the friendship.', 'You protect the friendship, but give up your own goal.', -1, 3, 5, 'o']]],
  ['Layoff rumor', '📢', '😨', 'There is a rumor that people will lose their jobs next month. Everybody is scared and the office is tense.',
    'In hard times, be steady, useful and prepared. Update your CV quietly.', 'strat-leader', [
      ['Do great work, help others, and quietly update your CV and contacts.', 'You are calm and strong. You are ready for any outcome.', 8, 6, -6, 'b'],
      ['Spread the rumor and panic with others.', 'The mood gets worse and you look scared.', -7, -3, 12, 'x'],
      ['Ignore it and work like always.', 'Okay, but if bad news comes you are not ready.', 1, 0, 3, 'o']]],
  ['Lies about you', '🌪️', '🦊', 'A rival tells people you are lazy. It is false. You hear it from a friend.',
    'Do not fight rumors. Let facts and allies speak. Talk to your boss with calm facts.', 'strat-leader', [
      ['Calmly show your results to your boss and thank your allies for support.', 'Facts win. The rumor loses power.', 9, 6, -5, 'b'],
      ['Spread a rumor about the rival.', 'Now both of you look bad.', -9, -7, 11, 'x'],
      ['Confront the rival loudly in front of others.', 'It becomes a show and people take sides.', -6, -5, 11, 'x']]],
  ['Boss is wrong', '🧨', '🫣', 'You find a big mistake in a plan your boss presented to the director. If nobody fixes it, it will cost money.',
    'Protect your boss and the company: tell them privately, with a solution.', 'strat-flanker', [
      ['Meet your boss privately: "I found something. Here is a way to fix it."', 'Your boss is thankful and fixes it before it grows. You gain a strong supporter.', 10, 6, -4, 'b'],
      ['Correct your boss in the next meeting.', 'You are right, but your boss feels shamed.', -6, -8, 9, 'x'],
      ['Say nothing. It is not your problem.', 'The mistake grows and everyone suffers.', -8, -3, 10, 'x']]],
  ['More pay, more hours', '⚖️', '💼', 'You are offered a raise, but the job needs 10 more hours each week. Your family time will shrink.',
    'Compare the full package. Negotiate hours, pay and role.', 'strat-challenger', [
      ['Say thanks, then ask: "Can we adjust the hours or add flexible days?"', 'The boss agrees to a smaller change. You win in two ways.', 9, 4, -4, 'b'],
      ['Accept right away.', 'More money, but you are very tired after three months.', 3, 0, 11, 'o'],
      ['Reject the offer angrily.', 'The boss feels insulted and the door closes.', -7, -5, 6, 'x']]],
  ['Mentor\'s favor', '🧙', '🧑‍🏫', 'A senior mentor helps your career. Now she asks you to do some of her own tasks quietly. It is not fair, and it takes your time.',
    'Support has limits. Be thankful and keep your boundaries.', 'strat-flanker', [
      ['"I am thankful for your help. I can do one small thing, but I need time for my own goals."', 'She respects your boundary and keeps helping you.', 6, 8, -3, 'b'],
      ['Do all her tasks to keep her happy.', 'You are overloaded. She sees you will always say yes.', -3, 3, 10, 'x'],
      ['Stop talking to her.', 'You lose a good ally.', -4, -9, 4, 'x']]],
  ['Client favorite', '🤩', '😠', 'An important client says, "I only want to work with you." Your boss looks jealous and cold.',
    'Share the win. A confident boss is a strong ally.', 'strat-flanker', [
      ['Tell your boss: "The client is happy because of our team. I would love your advice on the next step."', 'The boss relaxes and includes you in bigger deals.', 9, 7, -5, 'b'],
      ['Enjoy the attention and skip your boss.', 'Your boss feels cut out and starts to block you.', -8, -8, 10, 'x'],
      ['Tell the client to work with your boss only.', 'The client is confused. You lose a great win.', -3, -1, 6, 'o']]],
  ['New team lead', '🎖️', '🙄', 'You are now the team lead. A former equal ignores your messages and tells others, "She is not my boss."',
    'Earn respect with fairness and clear talk. One private chat first.', 'strat-leader', [
      ['Talk privately: "I need your help to make this work. What do you need from me?"', 'He feels respected and slowly starts to cooperate.', 8, 8, -5, 'b'],
      ['Use your title and give orders.', 'He follows the rules but not the spirit, and others feel the tension.', -4, -6, 8, 'x'],
      ['Avoid him and give his work to others.', 'It looks like fear. The problem grows.', -6, -5, 8, 'x']]],
  ['The final test', '🏁', '🧠', 'Your boss leaves the company. The director asks the team who should lead during the change. People look at you.',
    'Lead by serving. Offer support and let people see your steady hand.', 'strat-challenger', [
      ['Say, "I can help keep things stable. Let us write a clear plan together."', 'The director sees a calm leader. The team feels safe with you.', 10, 8, -4, 'b'],
      ['Say, "I should lead. I am the best here."', 'You look hungry for power, and some turn away.', -4, -7, 6, 'x'],
      ['Stay silent and wait to be chosen.', 'Someone else steps in and takes the spot.', -4, -2, 5, 'x']]]
];

/* ---------------- LEVELS 4 to 10 (added in V11) ---------------- */
PW10.LEVELS.push(
  { n: 'Remote Rules', e: '🏠', d: 'Hybrid and home work' },
  { n: 'Client Zone', e: '🛎️', d: 'Customers and clients' },
  { n: 'Team Captain', e: '🧑‍✈️', d: 'Leading other people' },
  { n: 'Fire Drill', e: '🚨', d: 'Crisis and pressure' },
  { n: 'Next Step', e: '🚀', d: 'Job moves and networking' },
  { n: 'Executive Floor', e: '🏢', d: 'Top-level politics' },
  { n: 'Grandmaster', e: '🧠', d: 'The hardest moves' });
PW10.GAME = PW10.GAME.concat([
  /* ---------------- LEVEL 4: Remote Rules ---------------- */
  ['Camera off', '📹', '🙈', 'In video calls you keep your camera off because you feel shy. Your boss says, "I would like to see everyone\'s face."',
    'Being seen builds trust. Start small and make it easy for yourself.', 'strat-guerrilla', [
      ['Turn it on for the first 5 minutes and say hello to people by name.', 'People smile back. Your boss notices the effort and you feel better each time.', 8, 7, -4, 'b'],
      ['Say your camera is broken.', 'It works for a week, then people notice the lie.', -7, -4, 8, 'x'],
      ['Keep it off and hope nobody cares.', 'Nothing bad happens, but you stay a name on a screen.', -3, -3, 4, 'o']]],
  ['Time zones', '🌍', '🌙', 'A coworker in another country always plans meetings at 10 pm for you. You are tired and cranky.',
    'Say what works for you and offer a fair plan.', 'strat-challenger', [
      ['Say, "Can we take turns? One week my time, one week yours."', 'He says sorry, he did not think about it. You start sharing the pain.', 8, 6, -7, 'b'],
      ['Join every late meeting and say nothing.', 'You are always tired and your work drops.', -4, 0, 11, 'x'],
      ['Skip the meetings without telling anyone.', 'Your boss learns about it from someone else.', -9, -6, 8, 'x']]],
  ['Message storm', '📨', '🌪️', 'Your phone buzzes with team messages all day. You cannot focus. People expect fast answers.',
    'Agree on rules. Quiet focus time makes your work better.', 'strat-leader', [
      ['Tell the team: "I check messages at 10, 1 and 4. Call me if it is urgent."', 'People respect the plan. Your work improves and you feel calm.', 9, 4, -8, 'b'],
      ['Answer every message in seconds.', 'You look fast, but real work stays unfinished.', 0, 2, 10, 'o'],
      ['Mute everything and disappear.', 'A real urgent message gets missed and the boss is angry.', -9, -5, 6, 'x']]],
  ['Out of sight', '🏢', '👀', 'The team that works in the office gets the best projects. You work from home three days a week and feel forgotten.',
    'When you are far away, be extra visible on purpose.', 'strat-guerrilla', [
      ['Share your progress every week and ask for a new project directly.', 'The boss says, "I forgot you! Take this one."', 9, 4, -5, 'b'],
      ['Go to the office every day, even if it hurts your plans.', 'You are seen, but you are tired and unhappy.', 3, 3, 9, 'o'],
      ['Complain that the office people get everything.', 'You sound bitter, and people stop listening.', -6, -5, 7, 'x']]],
  ['Family on the call', '👨‍👩‍👧', '😅', 'Your little brother walks into the video call and shouts. Everyone laughs. You want to disappear.',
    'A little humor and calm turn mistakes into good memories.', 'strat-flanker', [
      ['Laugh, introduce him quickly, and continue the meeting.', 'People find you warm and real. Your boss jokes about it later.', 7, 8, -5, 'b'],
      ['Leave the meeting in panic.', 'People worry and your boss asks if you are okay.', -5, -2, 9, 'x'],
      ['Pretend nothing happened and look serious.', 'It is awkward. People feel they must also be serious.', 0, -2, 6, 'o']]],
  ['Late reply', '⏳', '😟', 'You usually answer messages after a few hours. Your boss says, "I never know if you got my message."',
    'A short "got it" message costs nothing and builds trust.', 'strat-leader', [
      ['Answer with a quick "Got it, I will do it by 3 pm."', 'Your boss relaxes. You become the reliable one.', 9, 4, -4, 'b'],
      ['Say, "I was busy," and change nothing.', 'The boss keeps worrying and checks on you more.', -4, -2, 6, 'x'],
      ['Reply fast to everything now, even with empty answers.', 'You are quick, but your messages carry little value.', 1, 0, 7, 'o']]],
  ['Always online', '💻', '🥱', 'Working from home, you answer emails at night and on weekends. Your boss starts to expect it.',
    'Boundaries are part of being professional. Tired people make mistakes.', 'strat-challenger', [
      ['Say, "I answer messages from 8 to 5. For emergencies, call me."', 'Your boss agrees. You get your evenings back and your work stays good.', 8, 3, -9, 'b'],
      ['Keep answering at all hours to look dedicated.', 'You are exhausted and the habit becomes the rule.', 2, 0, 12, 'x'],
      ['Turn everything off and tell nobody.', 'A real emergency is missed, and trust drops.', -8, -4, 5, 'x']]],
  ['Invisible win', '🏁', '📬', 'You finished a big project from home. Nobody has said anything because they did not see you work on it.',
    'Share your wins clearly and kindly. Nobody can see your effort from far away.', 'strat-guerrilla', [
      ['Send a short summary with the results, thank the people who helped, and ask for feedback.', 'The boss replies in public: "Great work!" Everyone sees it.', 10, 6, -5, 'b'],
      ['Wait. They will find out.', 'The win slowly disappears in the noise.', -4, 0, 6, 'x'],
      ['Post a long message about how hard it was.', 'It sounds like complaining. People skip the message.', -2, -3, 4, 'o']]],

  /* ---------------- LEVEL 5: Client Zone ---------------- */
  ['Angry customer', '😡', '🤬', 'A customer shouts at you because his order is late. People in the shop are watching.',
    'Stay calm, listen first, and offer a next step.', 'strat-flanker', [
      ['Say, "I am sorry. Let me fix this. Here is what I can do now."', 'He calms down. The manager sees you stay professional.', 9, 5, -5, 'b'],
      ['Shout back to defend yourself.', 'The scene gets worse and you get into trouble.', -11, -6, 12, 'x'],
      ['Say, "It is not my fault," and walk away.', 'He gets angrier and the manager has to help.', -6, -3, 8, 'x']]],
  ['Not allowed', '🚫', '🙏', 'A customer asks for something against the company rules. He says, "Please, just this once."',
    'Say no politely, and offer something you can do.', 'strat-leader', [
      ['Say, "I am sorry, I can not do that. But I can offer you this option."', 'He accepts the alternative. You protect the rules and the relationship.', 8, 4, -4, 'b'],
      ['Break the rule to make him happy.', 'He is happy, but your boss finds out and is upset.', -9, 2, 9, 'x'],
      ['Say no and nothing else.', 'He leaves unhappy and may not come back.', -2, -2, 5, 'o']]],
  ['I do not know', '🤷', '😬', 'A client asks a question you cannot answer. Your boss is next to you and listening.',
    'Honesty with a plan is better than a wrong answer.', 'strat-guerrilla', [
      ['Say, "Good question. I will check and send you the answer by tomorrow."', 'The client trusts you. The boss is impressed by your honesty.', 8, 4, -4, 'b'],
      ['Invent an answer so you look smart.', 'The answer is wrong and the client discovers it later.', -10, -5, 10, 'x'],
      ['Look at your boss and wait for help.', 'Your boss answers, but you look unsure.', -2, 0, 5, 'o']]],
  ['Public praise', '👏', '😊', 'A client says in front of your whole team, "She is the best person I worked with here!" You blush.',
    'Receive praise gracefully and share the credit.', 'strat-flanker', [
      ['Say thank you, and give credit to the team that helped.', 'Everyone feels part of the win. Your boss notices your maturity.', 9, 9, -4, 'b'],
      ['Say, "It was nothing."', 'Humble, but you hide your value.', 2, 1, 2, 'o'],
      ['Take all the credit and smile big.', 'Your teammates feel left out.', -4, -8, 5, 'x']]],
  ['Surprise discount', '🏷️', '🧾', 'A customer asks for a big discount. Your boss did not tell you what is allowed. The customer says he will go elsewhere.',
    'Do not promise what you cannot decide. Get a quick answer.', 'strat-leader', [
      ['Say, "Let me check what I can do," and ask your boss quickly.', 'You get a clear answer and the client sees you respect the process.', 8, 4, -5, 'b'],
      ['Give the discount to keep the sale.', 'The company loses money and you get a warning.', -8, 0, 9, 'x'],
      ['Say no and lose the customer.', 'Safe, but you could have asked and saved the sale.', -3, 0, 5, 'o']]],
  ['My late delivery', '📦', '😰', 'You forgot to send a client\'s order on time. The client does not know yet. The deadline was today.',
    'Own your mistake, fix it fast, and tell the client first.', 'strat-leader', [
      ['Call the client now, say sorry, give a new date, and offer a small extra.', 'The client is not happy but thanks you for honesty. Trust stays.', 9, 4, -4, 'b'],
      ['Wait to see if the client asks.', 'The client asks, angry. Now it looks like you hid it.', -9, -4, 10, 'x'],
      ['Blame the delivery company.', 'It works once, but the boss checks the facts.', -6, -3, 8, 'x']]],
  ['Impossible promise', '🎪', '🤥', 'A coworker promised a client something that cannot be done by Friday. You were asked to deliver it.',
    'Protect the client with truth. Fix the cause, not the person.', 'strat-challenger', [
      ['Talk to your coworker first, then give the client a realistic plan together.', 'The client appreciates the honesty. Your coworker learns without being shamed.', 9, 6, -5, 'b'],
      ['Work all night to try to deliver anyway.', 'You deliver late and tired, with mistakes.', -2, 0, 12, 'x'],
      ['Tell the client in front of everyone that your coworker lied.', 'The client is uneasy and your coworker is furious.', -7, -9, 9, 'x']]],
  ['Ask for the manager', '🎩', '😤', 'A customer says, "I want to talk to your manager." Your manager is busy with a long meeting.',
    'Handle what you can, and bring the manager the facts, not a problem.', 'strat-flanker', [
      ['Say, "I will bring someone, but first tell me what happened so I can help quickly."', 'The problem is solved faster. Your manager is thankful for the summary.', 8, 5, -5, 'b'],
      ['Pull the manager out of the meeting right away.', 'The manager is annoyed, and the issue was small.', -4, -3, 6, 'o'],
      ['Tell the customer that managers are never available.', 'He leaves a bad review.', -8, -4, 9, 'x']]],

  /* ---------------- LEVEL 6: Team Captain ---------------- */
  ['Friends become team', '🧑‍🤝‍🧑', '😅', 'You are now the leader of a team that includes two of your friends. They joke, "Now you are the boss!"',
    'Be warm and clear. Friendship stays, but roles change.', 'strat-leader', [
      ['Say, "I still value our friendship. At work I need us to follow the plan together."', 'They respect the honesty. Work goes smoothly and the friendship stays.', 9, 7, -5, 'b'],
      ['Give them easy tasks to keep the peace.', 'Others see the favoritism and trust drops.', -7, -6, 7, 'x'],
      ['Become cold and distant to show you are the boss.', 'Your friends feel hurt and the whole team gets tense.', -4, -8, 9, 'x']]],
  ['Slow worker', '🐌', '😶', 'One person on your team does little work and the others are starting to complain. You are not sure why.',
    'Ask first. There might be a reason you do not know.', 'strat-leader', [
      ['Have a private talk: "I noticed this. What is going on? How can I help?"', 'He explains he is overwhelmed. You adjust his work and he improves.', 9, 7, -6, 'b'],
      ['Warn him in front of the team.', 'He feels shamed and the team feels fear.', -8, -8, 10, 'x'],
      ['Do his work yourself to avoid a fight.', 'You get tired, and nothing changes.', -2, 0, 11, 'x']]],
  ['Team clash', '💥', '😠', 'Two people on your team stopped talking to each other. The team feels it. Deadlines are close.',
    'Leaders solve the work conflict, not the personality.', 'strat-flanker', [
      ['Meet them together, focus on the goal, and agree on simple rules.', 'They agree to a plan. The tension drops.', 9, 8, -6, 'b'],
      ['Wait. They are adults.', 'The silence grows and mistakes happen.', -5, -3, 8, 'x'],
      ['Pick the one you trust and tell the other to change.', 'You lose the trust of one half of the team.', -7, -7, 8, 'x']]],
  ['Missed deadline', '⏰', '📉', 'Your team missed an important deadline. Your boss asks, "What happened?" It was a mix of reasons.',
    'Lead by owning it, and show the fix.', 'strat-leader', [
      ['Say, "We missed it. Here is why, and here is our plan so it will not happen again."', 'Your boss respects the clarity. You keep trust.', 10, 6, -4, 'b'],
      ['Blame one team member.', 'The team stops trusting you.', -9, -9, 9, 'x'],
      ['Blame outside reasons only.', 'It sounds like excuses.', -5, -2, 7, 'x']]],
  ['Say no upward', '🙅', '📈', 'Your boss asks your team to take on a big extra project. The team is already full. They look at you.',
    'Protect your team with facts and offer options.', 'strat-challenger', [
      ['Say, "We can do it if we move X or add help. Which do you prefer?"', 'Your boss thinks and gives you options. The team respects you.', 9, 8, -5, 'b'],
      ['Say yes and let the team suffer.', 'The team burns out and quality drops.', -4, -8, 11, 'x'],
      ['Say no without explaining.', 'The boss feels blocked and remembers it.', -6, -2, 7, 'x']]],
  ['Do it all', '🦸', '😵', 'You are good at the work, so you do most of the important tasks yourself instead of giving them to your team.',
    'Real leaders grow others. Delegating is a skill.', 'strat-leader', [
      ['Give clear tasks to the team, with the goal and a check-in time.', 'The team grows and you have time for bigger things.', 9, 6, -7, 'b'],
      ['Keep doing everything. It is faster.', 'You are overloaded and the team does not grow.', -3, -4, 11, 'x'],
      ['Give tasks but check every hour.', 'People feel you do not trust them.', -3, -5, 7, 'o']]],
  ['Team success', '🎉', '🥳', 'Your team won a big client. The director says, "Congratulations to the team leader!" and looks at you.',
    'Great leaders share the spotlight. It makes you stronger.', 'strat-flanker', [
      ['Say thank you, then name two people on the team who did key work.', 'The team glows, and the director also sees your leadership.', 10, 9, -4, 'b'],
      ['Accept the praise and say nothing.', 'Some of your team are quietly hurt.', 0, -6, 4, 'x'],
      ['Say the team did everything and you did nothing.', 'Too humble. The director is unsure of your role.', 2, 3, 3, 'o']]],
  ['Star wants to leave', '⭐', '👋', 'Your best team member says she plans to leave for a new job. She is tired of low pay.',
    'Listen, learn, and act. Do not take it personally.', 'strat-flanker', [
      ['Thank her for telling you, ask what would make her stay, and take it to your boss.', 'You might keep her, or she leaves on good terms and helps you later.', 9, 8, -5, 'b'],
      ['Be angry and say she is disloyal.', 'She leaves and tells others about your reaction.', -8, -8, 9, 'x'],
      ['Ignore it and hope she changes her mind.', 'She leaves without a fight, and the team loses trust.', -4, -4, 8, 'x']]],

  /* ---------------- LEVEL 7: Fire Drill ---------------- */
  ['Big mistake', '🔥', '😱', 'A big mistake from your team is now known by the whole company. Everyone is waiting to see how you react.',
    'In a crisis, people watch your calm. Speak, fix, learn.', 'strat-leader', [
      ['Say, "We made a mistake. Here is what we are doing, and here is who to ask."', 'The company sees a calm owner. The crisis shrinks.', 10, 6, -5, 'b'],
      ['Hide from everybody until it passes.', 'People feel left in the dark.', -9, -5, 10, 'x'],
      ['Blame an old process.', 'It looks like an excuse, but it is not a disaster.', -3, 0, 7, 'o']]],
  ['You get blamed', '🎯', '😤', 'Your boss says in a meeting, "This failure is the team\'s fault," and looks at you. You know it was not only you.',
    'Do not fight in public. Bring facts in private.', 'strat-challenger', [
      ['After the meeting, show your boss the timeline and what you did, and ask how to fix it together.', 'The boss softens and corrects the picture later.', 9, 3, -6, 'b'],
      ['Argue back in the meeting.', 'It becomes a fight in front of everyone.', -9, -7, 12, 'x'],
      ['Accept the blame to end it.', 'The blame sticks and may come back.', -6, 1, 9, 'x']]],
  ['New boss', '🔄', '🧳', 'The company reorganizes and you will have a new boss. You hear he is strict and likes to change things.',
    'First weeks matter. Show you are a helpful partner.', 'strat-guerrilla', [
      ['Ask for a short meeting, share what you do, and ask what he needs most.', 'He sees you as a helper and trusts you early.', 9, 6, -5, 'b'],
      ['Stay quiet and wait.', 'He forms his own picture without you.', -2, -2, 5, 'o'],
      ['Tell him how things used to work and criticize his ideas.', 'He sees you as resistance.', -9, -6, 9, 'x']]],
  ['Project canceled', '🗑️', '😞', 'Your project that took months is canceled because of budget cuts. You feel heartbroken.',
    'Learn, keep your value, and move forward with grace.', 'strat-leader', [
      ['Ask for a closing talk, save the lessons, and offer to help with the next priority.', 'The boss sees maturity and puts you on a new important project.', 9, 5, -7, 'b'],
      ['Complain to everyone about the decision.', 'You look bitter and people avoid you.', -7, -6, 9, 'x'],
      ['Quit working hard on anything new.', 'Your energy drops and people notice.', -6, -3, 8, 'x']]],
  ['Wrong expenses', '🧾', '🤫', 'You see a coworker adding personal things to his company expenses. He says, "Everyone does it. It is small."',
    'Protect yourself and the company. Use the proper channel.', 'strat-leader', [
      ['Do not take part. Report it calmly to the right person, like HR, with facts.', 'The matter is handled properly. You are known as honest.', 8, -2, -4, 'b'],
      ['Say nothing and ignore it.', 'If it comes out later, you might be questioned.', -3, 0, 7, 'o'],
      ['Join in because everybody does it.', 'You break the rules and risk your job.', -12, 2, 12, 'x']]],
  ['Surprise audit', '🔍', '🕵️', 'A surprise audit starts. Auditors ask questions about your work and some papers are missing.',
    'Be open, calm and helpful. Never hide or invent.', 'strat-leader', [
      ['Tell them the truth, show what you have, and say when you can find the rest.', 'They see honesty and the issue is easy to fix.', 8, 3, -5, 'b'],
      ['Quickly make up the missing papers.', 'That becomes a serious problem.', -12, -4, 12, 'x'],
      ['Act annoyed and refuse to answer.', 'It looks suspicious.', -7, -4, 9, 'x']]],
  ['Angry email', '✉️', '😠', 'You wrote an angry email to a coworker. It is in your drafts. You are ready to press send.',
    'Wait before you send. A calm message works better than a hot one.', 'strat-flanker', [
      ['Wait one hour, rewrite it politely, and offer to talk.', 'He listens. The problem gets solved.', 8, 6, -7, 'b'],
      ['Send it and copy your boss.', 'It starts a loud fight.', -10, -9, 12, 'x'],
      ['Delete it and say nothing.', 'You feel better, but the problem stays.', 1, 0, 3, 'o']]],
  ['Burning out', '🪫', '🥵', 'You work long hours during a crisis. You are very tired, your mistakes grow, and you feel numb.',
    'Rest is part of performance. Ask for help early.', 'strat-challenger', [
      ['Talk to your boss: "I need to adjust my workload for my health. Here is my plan."', 'The boss helps. You recover and do better work.', 8, 4, -12, 'b'],
      ['Push harder. The crisis will end.', 'You get sick and miss important work.', -7, -2, 14, 'x'],
      ['Suddenly stop working and tell nobody.', 'People are confused and worried.', -8, -4, 6, 'x']]],

  /* ---------------- LEVEL 8: Next Step ---------------- */
  ['Interview call', '📞', '🎙️', 'A company calls you for an interview next Tuesday, during work time. Your boss does not know you are looking.',
    'Be discreet and respectful. Use free time or a day off.', 'strat-guerrilla', [
      ['Take a personal day or schedule it outside work time, and say nothing yet.', 'You attend calmly. Your boss is not surprised by anything.', 8, 2, -5, 'b'],
      ['Tell a lie about being sick.', 'It might work, but it risks your trust.', -6, -3, 9, 'x'],
      ['Tell all your coworkers.', 'Your boss hears quickly.', -8, -5, 9, 'x']]],
  ['Reference please', '📝', '🤝', 'A new company asks for a reference from your boss. You have not told your boss yet.',
    'Ask people who know your work well and tell them first.', 'strat-flanker', [
      ['Ask a trusted past manager or mentor first. Tell your boss only when you are ready.', 'You get a strong reference without surprises.', 8, 6, -4, 'b'],
      ['Give your boss\'s name without asking.', 'Your boss is caught off guard and feels hurt.', -8, -6, 9, 'x'],
      ['Use a friend as a fake reference.', 'The company finds out and withdraws.', -12, -4, 10, 'x']]],
  ['Networking night', '🍷', '🧑‍💼', 'You are at an industry event. You do not know anyone and people are in groups.',
    'Start with one person and one question. Be curious.', 'strat-guerrilla', [
      ['Join someone alone, say hello, and ask what they do.', 'You have a nice chat and get a new contact.', 8, 8, -5, 'b'],
      ['Stand near the food and check your phone.', 'No new contacts tonight.', -2, -3, 4, 'o'],
      ['Hand your CV to everyone you see.', 'People feel pushed and forget you.', -5, -4, 6, 'x']]],
  ['Profile update', '🧑‍💻', '📱', 'You want to update your online career profile. You are not sure what to write.',
    'Show results with numbers. Keep it short and true.', 'strat-guerrilla', [
      ['Use your wins list: "Cut report time from 20 to 12 minutes."', 'Your profile shows real value and gets views.', 8, 5, -3, 'b'],
      ['Write big words like "visionary rockstar."', 'It sounds empty.', -4, -2, 4, 'x'],
      ['Leave it empty. You are private.', 'Recruiters can not find you.', -3, -1, 3, 'o']]],
  ['The rejection', '📭', '😔', 'After a great interview, you get an email: "We chose another person." You feel crushed.',
    'Rejection is feedback. Learn from it and keep the door open.', 'strat-challenger', [
      ['Say thanks, ask for one tip for the future, and keep the contact.', 'They give you a tip and may remember you for later.', 8, 6, -6, 'b'],
      ['Write an angry reply.', 'You close the door for good.', -8, -4, 10, 'x'],
      ['Stop applying for a few months.', 'You lose momentum.', -4, -1, 8, 'x']]],
  ['Two offers', '⚖️', '🤔', 'Two companies offer you a job. One pays more. The other has a better team and learning chances.',
    'Think long term. Compare pay, growth, and people.', 'strat-flanker', [
      ['Write a list with pay, growth, people and future, and ask a mentor for advice.', 'You choose with a clear head and no regret.', 9, 5, -6, 'b'],
      ['Choose the highest pay only.', 'Money is good, but you feel stuck after a year.', 3, 0, 6, 'o'],
      ['Let a coin decide.', 'Funny, but you do not learn from the process.', -2, 0, 5, 'o']]],
  ['Resign gracefully', '👋', '🧳', 'You got a new job and now must tell your boss you are leaving. You feel nervous and a bit guilty.',
    'Leave well. People remember your last month the most.', 'strat-leader', [
      ['Tell your boss privately, say thanks, give notice, and offer to help the handover.', 'They are sad but respect you. You leave with great references.', 9, 8, -5, 'b'],
      ['Send a short message and disappear.', 'People feel disrespected.', -8, -6, 6, 'x'],
      ['Tell everyone before telling your boss.', 'Your boss hears from others and feels betrayed.', -8, -8, 8, 'x']]],
  ['First week again', '🧭', '🆕', 'It is your first week at a new company. You feel lost and want to show you are good.',
    'Listen, learn, build friends. Small wins come first.', 'strat-guerrilla', [
      ['Ask questions, learn names, and finish one small task well.', 'People like your attitude. You get early trust.', 9, 8, -5, 'b'],
      ['Share big ideas to change everything.', 'People feel you do not respect what exists.', -6, -6, 7, 'x'],
      ['Stay silent and wait for instructions.', 'People find you shy or uninterested.', -3, -3, 5, 'o']]],

  /* ---------------- LEVEL 9: Executive Floor ---------------- */
  ['Present to executives', '📊', '🎤', 'You get 5 minutes to present your idea to the executives. You have 20 slides.',
    'Executives want the point, the benefit and the ask. Keep it short.', 'strat-challenger', [
      ['Cut to 3 slides: the problem, the idea, what you need. Then stop for questions.', 'They listen and ask for details. You get a yes.', 10, 5, -5, 'b'],
      ['Show all 20 slides fast.', 'They lose interest after minute 3.', -6, -3, 9, 'x'],
      ['Read the slides word for word.', 'It is safe but they are bored.', -2, -1, 5, 'o']]],
  ['Public disagreement', '🗣️', '😮', 'An executive asks in a meeting, "Does anyone see problems with my plan?" You see one. Everyone is silent.',
    'Disagree with respect and with a better option.', 'strat-challenger', [
      ['Say, "I like the goal. One risk I see is X. A way to handle it could be Y."', 'The executive nods. People respect your courage.', 10, 4, -4, 'b'],
      ['Stay silent like everyone.', 'The problem appears later and you could have helped.', -3, 0, 6, 'o'],
      ['Say, "This will not work."', 'It sounds like an attack and the room freezes.', -8, -7, 9, 'x']]],
  ['Partner dinner', '🍽️', '🥂', 'You are invited to a dinner with company partners. You are the youngest person there.',
    'Be curious, listen, and keep it light. You do not need to impress.', 'strat-guerrilla', [
      ['Ask people about their work, listen, and share one short story about yours.', 'People like you and ask for your contact.', 9, 8, -5, 'b'],
      ['Drink a lot to relax.', 'You say things you regret.', -9, -4, 10, 'x'],
      ['Sit quietly and leave early.', 'Nothing bad, nothing good.', -2, -2, 5, 'o']]],
  ['The gatekeeper', '🚪', '🧑‍💼', 'An executive\'s assistant says the executive has no time to meet you. You think a short chat could help your project.',
    'Assistants are allies. Respect them and ask smartly.', 'strat-flanker', [
      ['Thank her, ask how to book a 10-minute slot, and send a short note on why.', 'She helps and you get a slot next week.', 9, 7, -3, 'b'],
      ['Wait outside the executive\'s office.', 'You look pushy.', -7, -6, 8, 'x'],
      ['Skip the assistant and email the executive directly.', 'It works once, but she remembers it.', 1, -5, 5, 'o']]],
  ['Two sponsors', '🎭', '🤵', 'Two executives both want you on their projects. They do not like each other. Each says, "Choose me."',
    'Do not choose a side. Choose the work and keep both informed.', 'strat-flanker', [
      ['Say you will help both and ask your boss to set the priorities with them.', 'Both respect the process. You stay safe from the fight.', 9, 7, -5, 'b'],
      ['Pick the more powerful one.', 'The other becomes an enemy.', -6, -8, 9, 'x'],
      ['Promise both everything.', 'You get overloaded and disappoint both.', -7, -5, 12, 'x']]],
  ['Board visit', '🏛️', '👔', 'The board of directors visits. Someone asks you in the hallway, "How is everything going?"',
    'Stay positive, short and specific. Do not complain.', 'strat-guerrilla', [
      ['Say, "Good. We just launched X, and I am excited about Y." Smile.', 'They remember your name and your energy.', 9, 4, -3, 'b'],
      ['List all problems you see.', 'They note your negativity.', -8, -3, 7, 'x'],
      ['Say "Fine" and run away.', 'A missed chance.', -1, 0, 4, 'o']]],
  ['Promoted over friends', '📈', '🥹', 'You are promoted. Two older coworkers wanted the job. They stop saying hello.',
    'Win people with humility and respect. Ask for their help.', 'strat-leader', [
      ['Talk to each one: "I know this is hard. I want your experience on my team."', 'They soften. One becomes your best advisor.', 9, 9, -6, 'b'],
      ['Ignore them and focus on the boss.', 'They quietly block you.', -6, -7, 9, 'x'],
      ['Give them the hard tasks to prove who is boss.', 'They resist even more.', -8, -8, 10, 'x']]],
  ['Loyalty test', '🧪', '🕴️', 'An executive who helped you says, "I need you to support me against a rival, and keep it secret."',
    'Support people, but not at the cost of your honesty and the company.', 'strat-flanker', [
      ['Say, "I am thankful. I can support your goals, but I can not work in secret against anyone."', 'He respects the line. You keep your integrity.', 8, 3, -6, 'b'],
      ['Agree to do anything he says.', 'You get trapped when the fight explodes.', -9, -3, 11, 'x'],
      ['Tell the rival right away.', 'You lose a sponsor and trust.', -5, -8, 8, 'x']]],

  /* ---------------- LEVEL 10: Grandmaster ---------------- */
  ['Rival plus neutral boss', '♟️', '🦈', 'A rival keeps taking small pieces of your work. Your boss says, "I do not take sides."',
    'Without help, build proof and allies. Strength is quiet.', 'strat-challenger', [
      ['Document your work, share updates widely, and build allies in other teams.', 'Everyone knows who does what. The rival loses room.', 10, 7, -5, 'b'],
      ['Fight the rival in public.', 'You both look bad.', -8, -6, 11, 'x'],
      ['Give up on the project.', 'The rival wins easily.', -7, -3, 8, 'x']]],
  ['Two cultures', '🔀', '🏢', 'Your company merges with another. People from the two companies do not trust each other and teams are mixed.',
    'Bridge builders become leaders. Be curious about both sides.', 'strat-flanker', [
      ['Get lunch with people from the other side and ask how they do things.', 'You learn fast and become a connector.', 9, 10, -5, 'b'],
      ['Stay only with your old friends.', 'You are safe but become part of the problem.', -3, -4, 6, 'o'],
      ['Complain that the other side is doing it wrong.', 'You are marked as difficult.', -8, -7, 9, 'x']]],
  ['Failing project', '🚧', '🧯', 'Your boss gives you a project that is behind and everyone expects it to fail. It could hurt your name or make it.',
    'Hard projects are opportunities if you set clear terms.', 'strat-challenger', [
      ['Say yes, write down what is possible, ask for clear support, and report weekly.', 'You manage expectations. Even a small success looks great.', 10, 4, -4, 'b'],
      ['Say no. It is a trap.', 'Safe, but you lose a chance to shine.', -3, 0, 5, 'o'],
      ['Say yes and promise a full success.', 'Failing now looks like your fault.', -8, -3, 12, 'x']]],
  ['Promotion dilemma', '⚖️', '🕊️', 'To get the promotion, your boss says you must support a decision that you think is unfair to a team member.',
    'Your values are your long-term reputation. Look for a third path.', 'strat-leader', [
      ['Say, "I want to support you, but I can not support this unfairness. Can we look at another option?"', 'Your boss pauses and a fairer plan appears. You keep your integrity.', 9, 5, -6, 'b'],
      ['Support it and take the promotion.', 'The team loses trust in you.', -8, -9, 10, 'x'],
      ['Refuse loudly and leave the room.', 'You look emotional and lose the chance.', -6, -3, 9, 'x']]],
  ['Mentor leaves', '🌅', '🧙', 'Your mentor, who protected you for years, leaves the company. You feel exposed.',
    'Turn mentorship into your own strength. Build more allies.', 'strat-flanker', [
      ['Thank your mentor, ask for introductions, and start building 3 new relationships.', 'You keep her support and widen your base.', 9, 9, -5, 'b'],
      ['Wait to see what happens.', 'Others slowly take your spot.', -4, -4, 7, 'x'],
      ['Follow her to the new company without thinking.', 'It is an option, but you jump without a plan.', 1, 0, 8, 'o']]],
  ['Plan to remove the boss', '🎭', '🗡️', 'A group of coworkers whispers about making your boss look bad so he will be removed. They ask you to join.',
    'Never join secret fights. Use fair and open ways.', 'strat-leader', [
      ['Say, "I am not part of this. If there are real problems, let us raise them openly."', 'You stay clean. Later you are respected for it.', 8, 2, -5, 'b'],
      ['Join to be safe with the group.', 'When it comes out, you are linked to it.', -10, 3, 12, 'x'],
      ['Tell the boss the full story right now.', 'The truth helps him, but the team turns on you.', 1, -8, 8, 'o']]],
  ['Be your own boss', '🔁', '🤝', 'Your boss gets promoted and recommends you for his old job. Your friends in the team now report to you.',
    'Start with listening. Change slowly, and be fair.', 'strat-leader', [
      ['Meet each person one by one, listen, and share your plan after.', 'They feel respected and give you chances to lead.', 10, 9, -5, 'b'],
      ['Change many rules in week one.', 'People feel under attack.', -7, -7, 10, 'x'],
      ['Change nothing so no one gets angry.', 'You look weak.', -3, -2, 6, 'o']]],
  ['Big win, big risk', '👑', '🏆', 'You deliver the biggest success of the year. People ask you to speak and some seem jealous.',
    'Success needs grace. Share, stay humble and keep growing.', 'strat-flanker', [
      ['Thank everyone who helped, share what you learned, and offer to coach others.', 'You become a respected leader that people want to follow.', 10, 10, -5, 'b'],
      ['Enjoy the spotlight and talk about yourself.', 'Jealousy grows. Some wait for your fall.', -3, -8, 7, 'x'],
      ['Hide from attention and avoid talking.', 'You waste a chance to grow your reputation.', -2, -2, 5, 'o']]]
]);
PW10.LEVELS.forEach(function (L, i) { L.c = i < 3 ? 10 : 8; });
(function () { var s = 0; PW10.LEVELS.forEach(function (L) { L.s = s; s += L.c; }); })();
