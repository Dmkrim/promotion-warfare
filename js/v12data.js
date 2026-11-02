/* Promotion Warfare V12 - data for Boss Battles, Swipe Cards, Red Flags, Message Makeover, Buzzword Bingo. Simple English on purpose. */
window.PW12 = window.PW12 || {};

/* ---------- Boss Battles: 6 bosses x 4 rounds. Option = [text, quality (b best / o okay / x weak), reaction] ---------- */
PW12.BOSSES = [
  { n: 'The Difficult Boss', e: '👹', tip: 'Stay calm, stay clear, and keep proof. Strategy: Defensive.', intro: 'He changes his mind, snaps at people and never says thanks. Today he is in a bad mood.',
    rounds: [
      { atk: '"This report is a mess! Why is it so bad?!"', o: [['"I hear you. Show me what is wrong and I will fix it by 3 pm."', 'b', 'He pauses. A clear plan takes the fire out of his anger.'], ['"It was fine yesterday when you looked at it."', 'x', 'He gets louder. Arguing feeds the fire.'], ['Say nothing and look at the floor.', 'o', 'It ends faster, but he sees no plan from you.']] },
      { atk: '"I told you to do it differently last week!"', o: [['"Sorry for the confusion. Can I send you a short note after each task so we are clear?"', 'b', 'He nods. Written notes protect you.'], ['"You never told me that."', 'x', 'He feels attacked and doubles down.'], ['"Okay, I will do it again."', 'o', 'You solve today, but the problem will repeat.']] },
      { atk: '"Everyone else is faster than you!"', o: [['"Thanks for telling me. What does fast look like for you? I want to hit it."', 'b', 'He has to give a clear goal. You gain power.'], ['"That is not fair!"', 'x', 'You sound hurt, not strong.'], ['"I will try harder."', 'o', 'Vague promises give him more to complain about.']] },
      { atk: '"Come to my office. Now."', o: [['Bring a notebook, your wins list and stay calm.', 'b', 'You walk in prepared. He cannot surprise you.'], ['Go in angry and ready to fight.', 'x', 'You lose control of the room.'], ['Ask a friend to come along.', 'o', 'It feels safe, but it looks like you are afraid.']] }
    ] },
  { n: 'The Credit Thief', e: '🦝', tip: 'Make your work visible before anyone can steal it. Strategy: Guerrilla.', intro: 'Smiles at you, then repeats your ideas as his own in front of the boss.',
    rounds: [
      { atk: '"Great idea! I will present it to the director for us."', o: [['"Thanks! Let us present it together. I will take the first slide."', 'b', 'He cannot take it alone now. You stay in the picture.'], ['"Sure, go ahead."', 'x', 'He takes the credit and you vanish.'], ['"No way, it is MY idea!"', 'o', 'True, but it sounds childish and tense.']] },
      { atk: 'In the meeting he says: "I worked hard on this plan."', o: [['"Building on what we discussed last week, here is the next step."', 'b', 'You calmly show who started it.'], ['Sit quietly and burn inside.', 'x', 'Silence helps him again.'], ['Roll your eyes and sigh loudly.', 'o', 'People see the drama, not your work.']] },
      { atk: '"Send me all your notes, I will organize them."', o: [['"Sure, I will also copy our manager so everyone sees the same version."', 'b', 'Your name stays on your work.'], ['Send everything with no copy.', 'x', 'He edits your name out.'], ['"No, you can not have my notes."', 'o', 'It protects you but starts a war.']] },
      { atk: 'He tells the boss: "My team did this project."', o: [['After the meeting: "Happy it worked! Next time I would love to present my part."', 'b', 'Polite, firm and clear. The boss notices.'], ['Complain to coworkers.', 'x', 'Gossip makes you look weak.'], ['Say it loudly in front of everyone.', 'o', 'You are right, but you lose points for style.']] }
    ] },
  { n: 'The Gossip', e: '🐍', tip: 'Stay friendly, stay neutral, never feed the fire. Strategy: Flanking.', intro: 'Knows everyone\'s secrets and loves to share them. Today she has news about you.',
    rounds: [
      { atk: '"Did you hear what Dan said about you?"', o: [['"No, and I prefer to hear it from Dan. Thanks anyway."', 'b', 'She finds no fuel here. Respect grows.'], ['"What did he say?! Tell me everything!"', 'x', 'Now you are part of the gossip.'], ['"Dan is a jerk, I always knew it."', 'o', 'It feels good, but it will travel back to Dan.']] },
      { atk: '"Don\'t tell anyone, but the boss is angry at Sam."', o: [['"If it is a secret, maybe we should not talk about it."', 'b', 'You protect yourself and Sam.'], ['"I will not tell. Promise!"', 'x', 'You now carry a secret that can hurt you.'], ['Share it with a friend in a whisper.', 'o', 'It spreads, and everyone knows it came from you.']] },
      { atk: 'She spreads a lie that you are looking for another job.', o: [['Tell your boss calmly: "I heard a rumor and it is not true. I am happy here."', 'b', 'You cut it off with facts.'], ['Spread a lie about her.', 'x', 'Now two people are in a mess.'], ['Ignore it completely.', 'o', 'The rumor grows without your voice.']] },
      { atk: '"Come on, join our group chat about the new manager."', o: [['"I will skip. But I am happy to talk about work with anyone."', 'b', 'You stay clean and respected.'], ['Join and write nothing.', 'o', 'Your name is still in the chat.'], ['Join and add jokes.', 'x', 'Screenshots live forever.']] }
    ] },
  { n: 'The Micromanager', e: '🕵️', tip: 'Give him information before he asks. Trust grows from updates. Strategy: Defensive.', intro: 'Wants to know what you do every hour. Reads your emails over your shoulder.',
    rounds: [
      { atk: '"Show me what you are working on. Right now."', o: [['"Sure. Let me share my plan for today. I will send you a short update at noon and at 4."', 'b', 'He relaxes a bit when he knows what is coming.'], ['"Why do you not trust me?"', 'x', 'He feels judged and grips harder.'], ['Close the screen and say nothing.', 'o', 'It looks like you hide something.']] },
      { atk: '"Copy me on every email you write."', o: [['"Of course. Would a daily summary be enough for the smaller ones?"', 'b', 'You offer a smarter way. He may accept.'], ['Copy him on everything with a sigh.', 'o', 'Fine for now, but you are stuck forever.'], ['Forget to copy him on purpose.', 'x', 'That breaks trust fast.']] },
      { atk: '"Why did you choose that color for the slide?"', o: [['"Good question. Here is why, and I am open to your idea."', 'b', 'You are calm, confident and flexible.'], ['"It does not matter."', 'x', 'He heard "I do not care".'], ['Change it right away without asking why.', 'o', 'You lose your confidence.']] },
      { atk: '"I need you to check in every hour."', o: [['"I can do a 3-times-a-day check-in. That helps me focus. Would that work?"', 'b', 'You protect your focus and give him comfort.'], ['"That is crazy."', 'x', 'He becomes tighter.'], ['Agree to every hour.', 'o', 'You are tired and nothing improves.']] }
    ] },
  { n: 'The Deadline Dragon', e: '🐉', tip: 'Break big tasks into small steps and say early if you are stuck. Strategy: Offensive.', intro: 'Breathes fire at every deadline. Today everything is "urgent".',
    rounds: [
      { atk: '"Everything is due tomorrow. Everything!"', o: [['"Let us rank the tasks. Which one is the most important? I will finish that first."', 'b', 'The fire drops when there is a clear order.'], ['"That is impossible!"', 'x', 'He sees a problem, not a partner.'], ['Say yes to all and panic later.', 'o', 'You promise too much.']] },
      { atk: '"Why is this not finished yet?"', o: [['"Here is where I am, here is what is left, and I need X to finish by 5."', 'b', 'Clear and honest. He knows what to expect.'], ['"I was busy with other things."', 'x', 'He hears an excuse.'], ['"Almost done."', 'o', 'A vague answer makes him nervous.']] },
      { atk: '"The client wants it today, not Friday."', o: [['"I can send you a first version at 3 and the final one tomorrow morning."', 'b', 'You offer a smart path.'], ['"No, we agreed on Friday."', 'o', 'True, but it does not solve his fire.'], ['"I will stay all night."', 'x', 'You will be tired and make mistakes.']] },
      { atk: 'You missed a small deadline.', o: [['Tell him early: "I am late on X. Here is the new time and why."', 'b', 'Early honesty cools the dragon.'], ['Hide it and hope.', 'x', 'He finds out and breathes real fire.'], ['Blame a coworker.', 'o', 'Short win, long damage.']] }
    ] },
  { n: 'The Ghost Manager', e: '👻', tip: 'When nobody guides you, ask early and build your own feedback. Strategy: Flanking.', intro: 'Never answers messages, never gives feedback, appears only when something goes wrong.',
    rounds: [
      { atk: 'You sent a question 3 days ago. No answer.', o: [['Send a short follow-up: "Quick reminder: I need your yes or no on X by Thursday."', 'b', 'A clear deadline makes it easy to answer.'], ['Send 10 messages in one hour.', 'x', 'He mutes you.'], ['Wait, he is busy.', 'o', 'You lose days.']] },
      { atk: 'No feedback for months. You do not know how you are doing.', o: [['Book 15 minutes: "I want to learn what to improve. Here are 2 questions."', 'b', 'You create the feedback yourself.'], ['Assume you are doing fine.', 'x', 'Surprises usually are not good ones.'], ['Complain to coworkers.', 'o', 'Feels good, changes nothing.']] },
      { atk: 'He appears and says: "Why was this done like that?"', o: [['"Here is the reason and the result. I am happy to change it. What do you prefer?"', 'b', 'Calm and ready. He can not catch you.'], ['"You were never available!"', 'x', 'Blame starts a fight.'], ['"Sorry, my mistake."', 'o', 'You take blame you do not deserve.']] },
      { atk: 'Big decision needed, he is unreachable.', o: [['Decide using your best judgment, write it down, and send him a note.', 'b', 'You show leadership and keep him informed.'], ['Do nothing until he returns.', 'o', 'The project stops.'], ['Decide secretly and say nothing.', 'x', 'He will not forgive surprises.']] }
    ] }
];

/* ---------- Swipe cards: [statement, isSmartMove, why] ---------- */
PW12.SWIPE = [
  ['You tell your boss about a mistake as soon as you find it.', true, 'Early honesty builds trust. Bring a fix too.'],
  ['You share a rumor you heard about a coworker.', false, 'Rumors travel back to you. Stay out of them.'],
  ['You send your manager a short weekly update.', true, 'Visible work gets noticed, especially from far away.'],
  ['You say yes to every request so people like you.', false, 'Too many yeses burn you out and lower your quality.'],
  ['You ask your boss: "What would excellent work look like?"', true, 'Clear goals help you win. Asking shows care.'],
  ['You complain about the boss in the group chat.', false, 'Chats are never private. It can come back to you.'],
  ['You write down your wins every week.', true, 'You will need proof for reviews and raises.'],
  ['You take credit for a team result.', false, 'People remember. Share credit and look stronger.'],
  ['You thank a coworker in front of the team.', true, 'Gratitude builds allies at almost no cost.'],
  ['You reply to angry emails right away.', false, 'Wait an hour. Calm messages work better.'],
  ['You ask a smart question before starting a big task.', true, 'A 2-minute question saves 2 hours of wrong work.'],
  ['You skip a meeting without telling anyone.', false, 'People notice. Tell them early.'],
  ['You prepare 3 points before talking to the boss.', true, 'Short and clear shows respect for their time.'],
  ['You hide a problem hoping it goes away.', false, 'Problems grow in the dark. Say it early.'],
  ['You introduce yourself to someone from another team.', true, 'Allies outside your team protect and promote you.'],
  ['You interrupt people to show you are smart.', false, 'Listening makes you look smart. Interrupting does not.'],
  ['You ask for feedback after a project ends.', true, 'You learn fast and show you want to grow.'],
  ['You give tasks to others and never check the result.', false, 'Delegating is good. Checking in kindly is part of it.'],
  ['You say "I do not know, but I will find out."', true, 'Honesty plus a plan is better than a wrong answer.'],
  ['You copy your boss on every small complaint.', false, 'Use that carefully. First talk to the person.'],
  ['You offer to help a busy coworker for 10 minutes.', true, 'Small help creates big goodwill.'],
  ['You post your anger about work online.', false, 'Posts last forever and bosses read them.'],
  ['You ask for a raise with 3 wins and numbers.', true, 'Facts beat feelings in a pay talk.'],
  ['You ask for a raise by saying "I need money".', false, 'Bosses respond to value, not need.'],
  ['You learn the names of everyone on your floor.', true, 'Names open doors. It makes you memorable.'],
  ['You always arrive late and say sorry.', false, 'Sorry is not a plan. Being on time is trust.'],
  ['You offer a solution together with a problem.', true, 'Problem solvers get promoted.'],
  ['You work late every night without telling anyone.', false, 'Unseen effort gets no credit and burns you out.'],
  ['You take a short walk when you feel angry.', true, 'A calm head makes the next move better.'],
  ['You gossip with the person who gossips about others.', false, 'If they gossip to you, they gossip about you.'],
  ['You say no politely and offer another option.', true, 'You keep respect and protect your time.'],
  ['You check your phone during meetings.', false, 'It shows low interest. Stay present.'],
  ['You keep a list of who helped you and say thanks.', true, 'People help again when they feel valued.'],
  ['You argue with the boss in front of the team.', false, 'Disagree in private. Public fights hurt both.'],
  ['You volunteer for one small project that nobody wants.', true, 'It builds skills and shows initiative.'],
  ['You copy a coworker\'s work and change the name.', false, 'Trust is hard to rebuild once it is broken.'],
  ['You say what you can do first, then what you can not.', true, 'A positive start keeps the talk friendly.'],
  ['You ignore messages from your boss until Monday.', false, 'Quick replies, even "got it", build trust.'],
  ['You write a short thank-you after an interview.', true, 'It keeps you in their mind.'],
  ['You promise a date you are not sure you can meet.', false, 'Promise less, deliver more.']
];

/* ---------- Spot the red flag. line = [speakerEmoji, text, isRedFlag] ---------- */
PW12.FLAGS = [
  { t: 'Team chat', lines: [['👩', 'Meeting moved to 3 pm. Can everyone join?', 0], ['🧔', 'Yes, I will bring the numbers.', 0], ['😏', 'I will present it. It was my idea anyway.', 1], ['🙂', 'Thanks all, see you there.', 0]], why: 'He takes credit for an idea that was not only his. Quietly document who did what.' },
  { t: 'Job interview', lines: [['🧑‍💼', 'We are like a family here!', 1], ['🧑‍💼', 'Overtime is normal when it is busy.', 1], ['🧑‍💼', 'You will get a review after 6 months.', 0], ['🧑‍💼', 'Your manager is very friendly.', 0]], why: '"Like a family" with normal overtime can mean no boundaries. Ask about hours and pay, kindly.' },
  { t: 'Message from your manager', lines: [['👨‍💼', 'Please finish the report by Friday.', 0], ['👨‍💼', 'Let me know if you need help.', 0], ['👨‍💼', 'Do not tell HR about the schedule change.', 1], ['👨‍💼', 'Thanks for the good work.', 0]], why: 'Asking you to hide things from HR is a red flag. Keep notes and ask for it in writing.' },
  { t: 'Coffee break chat', lines: [['👩', 'Did you hear about Mia?', 0], ['🧑', 'No, what?', 0], ['👩', 'She is looking for another job. Do not tell.', 1], ['🧑', 'Wow, okay.', 0]], why: 'Passing around private news is gossip. It can hurt Mia and you.' },
  { t: 'Performance review', lines: [['👩‍💼', 'You reached all your goals.', 0], ['👩‍💼', 'Your teamwork is excellent.', 0], ['👩‍💼', 'There is no budget for raises, ever.', 1], ['👩‍💼', 'Maybe next year we can talk.', 0]], why: '"Never" with no plan is a red flag. Ask what you must do to get a raise and by when.' },
  { t: 'New coworker', lines: [['🧑', 'I help you on this task, no problem.', 0], ['🧑', 'Just give me all your passwords.', 1], ['🧑', 'It will be faster for me.', 0], ['🧑', 'Do not worry.', 0]], why: 'Never share passwords. Offer another safe way to help.' },
  { t: 'Boss in a meeting', lines: [['🧓', 'Great job, team.', 0], ['🧓', 'This mistake was Alex\'s fault.', 1], ['🧓', 'Let us fix it by Monday.', 0], ['🧓', 'Meeting over.', 0]], why: 'Blaming one person in public hurts trust. Ask to talk about it privately.' },
  { t: 'Email from a "recruiter"', lines: [['📧', 'We have a great job for you!', 0], ['📧', 'Pay a small fee to start.', 1], ['📧', 'Reply today to keep your place.', 0], ['📧', 'Thank you!', 0]], why: 'Real jobs never ask you to pay. Do not send money.' },
  { t: 'Project plan', lines: [['👨', 'We have 2 weeks.', 0], ['👨', 'Skip the testing to save time.', 1], ['👨', 'We can fix bugs later.', 0], ['👨', 'Let us start.', 0]], why: 'Skipping checks creates bigger problems later. Suggest a short test plan.' },
  { t: 'Mentor talk', lines: [['🧙', 'I will help your career.', 0], ['🧙', 'In return, do my tasks quietly.', 1], ['🧙', 'It is a small favor.', 0], ['🧙', 'We will meet monthly.', 0]], why: 'Real mentors support you without using you. Keep a friendly boundary.' },
  { t: 'Office message board', lines: [['🧑‍🏫', 'Welcome to the new team members!', 0], ['🧑‍🏫', 'Lunch is on Friday.', 0], ['🧑‍🏫', 'Do not trust the new manager.', 1], ['🧑‍🏫', 'See you there.', 0]], why: 'Spreading distrust early is a political move. Judge people by what you see.' },
  { t: 'Late night text', lines: [['👩‍💼', 'Hi, sorry for the late message.', 0], ['👩‍💼', 'Please answer immediately, no matter the time.', 1], ['👩‍💼', 'It is important.', 0], ['👩‍💼', 'Thanks.', 0]], why: 'Always-on expectations burn you out. Agree on clear hours for replies.' }
];

/* ---------- Message makeover. opts = [text, calmScore 0-100, why] ---------- */
PW12.MAKEOVER = [
  { s: 'A coworker was late with his part again.', bad: '"You are always late! You ruin everything!"', opts: [['"I noticed the part was late again. Can we agree on a date that works for you?"', 92, 'Specific, calm and looks for a solution.'], ['"Whatever, I will do it myself next time."', 35, 'It sounds cold and creates distance.'], ['"You really need to get your act together."', 12, 'Judging the person makes them defend.']] },
  { s: 'Your boss gave you feedback you do not like.', bad: '"That is not fair! I worked so hard."', opts: [['"Thanks for telling me. Can you give one example so I can improve?"', 94, 'Curious and professional.'], ['"I disagree, but okay."', 40, 'The tone is closed.'], ['"You do not see how much I do."', 15, 'It sounds like an attack.']] },
  { s: 'You need a day off next week.', bad: '"I am taking Friday off. Deal with it."', opts: [['"Could I take Friday off? I will finish my tasks by Thursday."', 95, 'Polite and shows you care about work.'], ['"I think I will take Friday off."', 45, 'Unclear. It sounds like a hint, not a request.'], ['"I am taking Friday off. I already booked."', 25, 'It leaves no room for talk.']] },
  { s: 'You want to say no to extra work.', bad: '"That is not my job."', opts: [['"I would like to help, but I am full this week. Can it wait until Monday or can we move something else?"', 93, 'Positive and offers options.'], ['"I do not have time."', 40, 'Short and a little cold.'], ['"Ask someone else."', 15, 'Rude and blocks teamwork.']] },
  { s: 'A client asks for a discount you can not give.', bad: '"No. That is impossible."', opts: [['"I wish I could. What I can do is X. Would that help?"', 94, 'Soft no with an alternative.'], ['"That is not possible, sorry."', 55, 'Polite but gives nothing.'], ['"We do not do discounts."', 25, 'Cold and final.']] },
  { s: 'Your coworker took your idea in a meeting.', bad: '"Thief! That was MY idea!"', opts: [['"Glad you like it. I came up with it last week. I can lead the next step."', 91, 'Calm, factual and takes the lead.'], ['"Interesting, I had a similar idea."', 55, 'Too soft. They may not notice.'], ['"Typical. You always do this."', 18, 'Attacks the person and lowers you.']] },
  { s: 'You want a raise.', bad: '"I deserve more money, everybody knows it."', opts: [['"I would like to talk about my pay. In the last months I achieved X and Y. What would it take to reach Z?"', 95, 'Facts, a goal and a question.'], ['"Do you think I could get a raise?"', 50, 'Too weak. No proof offered.'], ['"I will quit if I do not get more."', 10, 'A threat can end the talk and the job.']] },
  { s: 'Your boss keeps changing the plan.', bad: '"Make up your mind!"', opts: [['"Could we confirm the top 3 priorities for this week so I can focus?"', 94, 'Asks for clarity without blame.'], ['"Okay, whatever you say."', 30, 'Gives up your voice.'], ['"This is chaos."', 15, 'Judges and does not help.']] },
  { s: 'You must tell a teammate his work has errors.', bad: '"This is full of mistakes. Did you even check it?"', opts: [['"I found a few small things. Want to look at them together?"', 93, 'Kind and invites teamwork.'], ['"There are errors. Fix them."', 40, 'Clear, but harsh.'], ['"I will just fix it silently."', 45, 'Avoids the talk. He will not learn.']] },
  { s: 'A meeting is too long and you need to leave.', bad: '"I do not have time for this!"', opts: [['"I need to leave at 4 for another commitment. Can we cover my part first?"', 95, 'Clear, respectful and practical.'], ['Stand up and leave without a word.', 20, 'People feel disrespected.'], ['"Can we wrap up soon?"', 55, 'A bit vague, but polite.']] },
  { s: 'You did not understand the task.', bad: '"Your instructions were terrible."', opts: [['"Could you help me understand what success looks like for this one?"', 96, 'Honest, positive and specific.'], ['"I guess I will figure it out."', 45, 'Risks wrong work.'], ['"You never explain anything."', 12, 'Blames them for your problem.']] },
  { s: 'Someone gives you credit that belongs to the team.', bad: '"Yes, I did it all by myself."', opts: [['"Thanks! It was a team effort. Sam and Dana did key work too."', 96, 'Generous and builds allies.'], ['"Thanks."', 60, 'Polite, but loses a chance to share.'], ['"It was nothing."', 55, 'Too humble. You hide your role.']] }
];

/* ---------- Buzzword bingo: [word, meaning] ---------- */
PW12.BINGO = [
  ['Circle back', 'Talk about it again later.'], ['Synergy', 'Working together gives a better result.'], ['Touch base', 'Have a short check-in.'], ['Low-hanging fruit', 'An easy win to do first.'], ['Deep dive', 'Look at something very closely.'],
  ['Bandwidth', 'How much time and energy you have.'], ['Move the needle', 'Make a real difference.'], ['Take it offline', 'Talk about it after the meeting.'], ['On the same page', 'Everyone understands the same thing.'], ['Pain point', 'A problem that bothers customers or users.'],
  ['Game changer', 'Something that changes everything.'], ['Think outside the box', 'Find a new, creative idea.'], ['Value add', 'An extra benefit.'], ['Drill down', 'Go into more detail.'], ['Buy-in', 'People agree to support it.'],
  ['Stakeholder', 'Anyone affected by the project.'], ['Pivot', 'Change the plan or direction.'], ['Scalable', 'Can grow without breaking.'], ['Action item', 'A task someone must do.'], ['Deliverable', 'Something you must hand in.'],
  ['Alignment', 'Everyone agrees on the goal.'], ['Leverage', 'Use something to get more result.'], ['Ping me', 'Send me a message.'], ['ASAP', 'As soon as possible.'], ['EOD', 'End of day.'],
  ['Heads up', 'A warning or early notice.'], ['Loop in', 'Add someone to the conversation.'], ['Ballpark', 'A rough estimate.'], ['Win-win', 'Good for both sides.'], ['Best practice', 'The way experts do it.'],
  ['Core competency', 'What a company or person does best.'], ['Paradigm shift', 'A big change in how we think.'], ['Streamline', 'Make it simpler and faster.'], ['Proactive', 'Acting before problems appear.'], ['Granular', 'Very detailed.'],
  ['Onboarding', 'Helping a new person get started.'], ['Offboarding', 'The process when someone leaves.'], ['Roadmap', 'The plan for the future.'], ['KPI', 'A number that shows how you are doing.'], ['Bottom line', 'The most important result.'],
  ['Ideate', 'Come up with ideas.'], ['Silo', 'A team that does not share with others.'], ['Agile', 'Working in small, flexible steps.'], ['Sprint', 'A short period of focused work.'], ['Retrospective', 'A talk about what went well and what did not.'],
  ['Quick win', 'A fast, visible success.'], ['Run it up the flagpole', 'Share an idea to test the reaction.'], ['Open the kimono', 'Show everything openly. A funny old phrase.'], ['Boil the ocean', 'Try to do too much at once.'], ['Elephant in the room', 'A big problem nobody talks about.'],
  ['Table it', 'Delay the topic for later.'], ['Net-net', 'The final summary.'], ['Holistic', 'Looking at the whole picture.'], ['Ecosystem', 'All the connected parts.'], ['Tiger team', 'A small group solving a hard problem.'],
  ['Lean in', 'Take more initiative.'], ['Reach out', 'Contact someone.'], ['Hard stop', 'A meeting must end at an exact time.'], ['Out of pocket', 'Not available or away.'], ['Mission critical', 'Extremely important.']
];
