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
