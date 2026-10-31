/* V07 content: more examples, workplace challenges, business abbreviations, 12-week mission, new badges, starter stories. */
window.PW7 = {};

/* ---------- 7 more quick-load examples (total 10 with the 3 from V06) ---------- */
PW7.PERSONAS = [
  { id: 'cashier', name: 'The First-Job Cashier (18)', pos: 'guerrilla', vis: 2, inf: 2, me: 'You (Cashier)',
    rows: [['Dana Levi', 'Store Owner', 1], ['Roy Katz', 'Store Manager', 2], ['Mia Stone', 'Shift Supervisor', 2], ['Eli Barak', 'Senior Cashier', 3], ['Noga Peretz', 'Stock Lead', 3], ['You (Cashier)', 'New Cashier', 4], ['Ben Adler', 'Bagger', 4], ['Lia Cohen', 'Part-time Helper', 4]] },
  { id: 'warehouse', name: 'The Warehouse Newcomer (19)', pos: 'guerrilla', vis: 2, inf: 3, me: 'You (Picker)',
    rows: [['Hank Moore', 'Operations Director', 1], ['Sara Quinn', 'Warehouse Manager', 2], ['Tomer Ash', 'Shift Leader', 2], ['Ivan Petrov', 'Forklift Driver', 3], ['Gil Navon', 'Inventory Clerk', 3], ['You (Picker)', 'Order Picker', 4], ['Dina Rose', 'Order Picker', 4], ['Paul Weiss', 'Loader', 4]] },
  { id: 'intern', name: 'The Office Intern (20)', pos: 'guerrilla', vis: 1, inf: 2, me: 'You (Intern)',
    rows: [['Carol Reyes', 'CEO', 1], ['Dan Marsh', 'Head of Marketing', 2], ['Yael Segal', 'Marketing Manager', 2], ['Oren Haim', 'Content Specialist', 3], ['Tali Brook', 'Social Media Lead', 3], ['You (Intern)', 'Marketing Intern', 4], ['Alex Pine', 'Office Assistant', 4], ['Rita Fox', 'Receptionist', 4]] },
  { id: 'support', name: 'The Call-Center Rookie (18)', pos: 'guerrilla', vis: 3, inf: 3, me: 'You (Agent)',
    rows: [['Lena Voss', 'Head of Customer Care', 1], ['Mark Doyle', 'Call Center Manager', 2], ['Hila Ron', 'Team Leader', 2], ['Amir Gold', 'Senior Agent', 3], ['Zoe Kane', 'Quality Coach', 3], ['You (Agent)', 'Support Agent', 4], ['Nate Webb', 'Support Agent', 4], ['Ruth Lang', 'Trainee', 4]] },
  { id: 'apprentice', name: 'The Trade Apprentice (19)', pos: 'guerrilla', vis: 2, inf: 2, me: 'You (Apprentice)',
    rows: [['Joe Hartman', 'Company Owner', 1], ['Alma Ortiz', 'Site Manager', 2], ['Rami Stein', 'Master Electrician', 2], ['Vik Rao', 'Journeyman Electrician', 3], ['Gabe Lund', 'Safety Officer', 3], ['You (Apprentice)', 'Apprentice', 4], ['Cole Bird', 'Apprentice', 4], ['Dot Wells', 'Site Helper', 4]] },
  { id: 'designer', name: 'The Junior Designer (23)', pos: 'flanker', vis: 4, inf: 5, me: 'You (Designer)',
    rows: [['Nina Frost', 'Creative Director', 1], ['Leo Hart', 'Head of Design', 1], ['Maya Dunn', 'Art Director', 2], ['Kai Ross', 'Senior Designer', 2], ['You (Designer)', 'Junior Designer', 3], ['Pia Moon', 'Copywriter', 3], ['Tim Cole', 'Production Artist', 4], ['Ada Finn', 'Intern', 4]] },
  { id: 'teamlead', name: 'The Rising Team Lead (28)', pos: 'challenger', vis: 6, inf: 6, me: 'You (Team Lead)',
    rows: [['Grace Holt', 'VP Operations', 1], ['Sam Reid', 'Director of Sales', 1], ['Beth Cole', 'Senior Team Lead', 2], ['You (Team Lead)', 'Team Lead', 2], ['Raj Shah', 'Senior Specialist', 3], ['Ola Berg', 'Specialist', 3], ['Jin Park', 'Junior Specialist', 4], ['Eve Cruz', 'Assistant', 4]] }
];

/* ---------- workplace challenges: [id, label, group, [3 moves]] ---------- */
PW7.CHALLENGES = [
  ['manager', 'A difficult manager', 'People and boss', ['Write down what your manager asks for, and confirm it in a short message: "Just to check, you want X by Friday?"', 'Learn how your manager likes updates (chat, email or talk) and always use that way.', 'Stay calm and factual. Talk about the task and the facts, never about the person.']],
  ['micro', 'A manager who checks everything', 'People and boss', ['Send a short update before they ask. Fewer surprises means less checking.', 'Ask: "What would make you feel safe to give me more freedom on this task?"', 'Deliver the first small task perfectly and on time, then ask for a little more freedom.']],
  ['nofeedback', 'I get no feedback', 'People and boss', ['Ask your manager: "What is one thing I can do better?" once every month.', 'After each finished task, ask: "Was this what you expected?"', 'Write your own short review every Friday: what went well, what to improve.']],
  ['credit', 'Someone takes credit for my work', 'People and boss', ['Send a short summary of your results to your manager by email, with the date and your name on the work.', 'Say "we" in meetings, but name your own part clearly: "I built the report, and the team checked it."', 'Keep proof: save emails, files and numbers that show what you did. Never argue in public.']],
  ['conflict', 'A conflict with a coworker', 'People and boss', ['Talk in private, when both of you are calm. Start with: "I want us to work well together."', 'Describe the problem as an effect, not as blame: "When the file arrives late, I miss my deadline."', 'Agree on one small change and check back after a week.']],
  ['toxic', 'Toxic or aggressive office politics', 'People and boss', ['Keep a written record of key decisions and agreements.', 'Do not join gossip. Say: "I do not know, let us ask them directly."', 'Build two or three trusted allies in other teams.']],
  ['mentor', 'I have no mentor', 'People and boss', ['Pick one experienced person you respect and ask for just 15 minutes of advice.', 'Prepare two clear questions before the meeting, and thank them afterward.', 'Look for a mentor outside your own team too. They can be more honest.']],
  ['newboss', 'My manager just changed', 'People and boss', ['Book a short first meeting. Ask: "What are your top 3 goals for the team?"', 'Bring a one-page list of your results so far, so you do not start from zero.', 'Do one quick, visible win in the first 3 weeks to build trust.']],
  ['visibility', 'Lack of executive visibility', 'Being seen', ['Publish a short monthly summary of your team results, with numbers.', 'Volunteer to present one small update in a meeting.', 'Give credit to others in your updates. Senior people notice it.']],
  ['overlooked', 'I was passed over for a promotion', 'Being seen', ['Ask calmly: "What would I need to show to be ready for the next level?"', 'Write down the answer, make a 3-month plan, and ask for a check-in date.', 'Collect proof of your results and keep your CV updated, so you have options.']],
  ['unclear', 'Unclear expectations', 'Being seen', ['Ask: "What does a great result look like for this task?" before you start.', 'Write the goal in one sentence and send it to your manager to confirm.', 'Ask for a regular 1:1 meeting, even 15 minutes every two weeks.']],
  ['overload', 'Too much work, I cannot say no', 'Work style', ['Say: "I can do this by next Wednesday. Which task should move?" so your manager decides.', 'Write all your tasks in one list and show it when new work arrives.', 'Block 30 minutes of focus time every day in your calendar.']],
  ['boring', 'Boring or low-value tasks', 'Work style', ['Do the boring task so well that nobody worries about it. Trust opens the door to better work.', 'Find one way to make the boring task faster, and show the time you saved.', 'Ask: "When this is stable, what is the next task I could take?"']],
  ['present', 'I get nervous in meetings', 'Work style', ['Prepare one clear point before each meeting and say it early, while you are calm.', 'Write your point in one sentence: the problem, your idea, the result.', 'Start small: ask one good question in each meeting this week.']],
  ['first90', 'The first 90 days in a new job', 'Career start', ['Week 1 to 2: learn names, learn the tools, and ask: "What does success look like in 3 months?"', 'Find one small, useful task you can finish in the first month.', 'Meet your manager every week for 15 minutes and share one result.']],
  ['youngest', 'I am the youngest on the team', 'Career start', ['Ask questions with respect and listen first. Experienced people like to teach.', 'Bring something fresh: a new tool, a shortcut, or a clean template. Show it finished.', 'Share credit and say thank you often. Allies matter more than age.']],
  ['noexp', 'I have no experience yet', 'Career start', ['Pick one small task nobody wants and become the best at it.', 'Keep a notebook of what you learn each day. Review it on Friday.', 'Ask a senior person: "What should I learn first to be useful here?"']],
  ['remote', 'Remote or hybrid work', 'Career start', ['Send a short written update every Friday with 3 results, so people see your work.', 'Turn your camera on and speak in at least one meeting a week.', 'Chat with one coworker for 10 minutes each week about something other than work.']],
  ['stagnant', 'Stagnant projects or bureaucracy', 'Work style', ['Automate one repeated task to free time for better work.', 'Break a stuck project into one small next step and finish it this week.', 'Ask your manager: "Which one blocker can I help remove?"']],
  ['raise', 'I want to ask for a raise', 'Career start', ['Write 3 to 5 wins with numbers in the Wins Journal.', 'Check typical pay for your role, then decide your number.', 'Book a meeting, bring the one-page pitch from the Wins Journal and ask clearly.']],
  ['newtool', 'I must learn a new tool', 'Work style', ['Spend 20 minutes a day on the tool for one week.', 'Make one small real thing with it, like a report or a template.', 'Show a coworker how it works. Teaching helps you remember.']],
  ['reorg', 'The company is changing or reorganizing', 'Company change', ['Ask your manager: "What will change for my role?" and write down the answer.', 'Keep delivering. Reliable people are kept and trusted in change.', 'Update your CV and your wins list now, just in case.']],
  ['newlead', 'I now lead my former peers', 'Company change', ['Talk to each person alone and ask: "What do you need from me?"', 'Change slowly. Keep what works and fix one thing at a time.', 'Be fair and open. Share the credit and own the mistakes.']],
  ['client', 'A difficult client or customer', 'Company change', ['Listen without interrupting, then repeat the problem in your own words.', 'Offer one clear next step with a date.', 'Write down what happened and tell your manager early, before it grows.']],
  ['burnout', 'I feel tired and close to burnout', 'Work style', ['Pick the 3 tasks that matter most this week and let the rest wait.', 'Take real breaks and keep one evening fully free from work.', 'Tell your manager early, with facts: "My workload is X hours more than planned. What can move?"']]
];

/* ---------- 100 business abbreviations: [short, full name, simple meaning] ---------- */
PW7.ABBR = [
  ['CEO', 'Chief Executive Officer', 'The top boss of the company. Makes the biggest decisions.'],
  ['CFO', 'Chief Financial Officer', 'The leader in charge of money, budgets and reports.'],
  ['COO', 'Chief Operating Officer', 'The leader who runs the daily work of the company.'],
  ['CTO', 'Chief Technology Officer', 'The leader in charge of technology and software.'],
  ['CMO', 'Chief Marketing Officer', 'The leader in charge of marketing and the brand.'],
  ['CIO', 'Chief Information Officer', 'The leader in charge of the company computer systems and data.'],
  ['CHRO', 'Chief Human Resources Officer', 'The leader in charge of people, hiring and company culture.'],
  ['CPO', 'Chief Product Officer', 'The leader who decides what products the company builds.'],
  ['CRO', 'Chief Revenue Officer', 'The leader in charge of all the ways the company earns money.'],
  ['VP', 'Vice President', 'A senior leader, usually just under the top leaders.'],
  ['MD', 'Managing Director', 'The person who runs a company or a big division, often in the UK or Israel.'],
  ['GM', 'General Manager', 'The manager of a whole site, store or business unit.'],
  ['BOD', 'Board of Directors', 'The group that watches over the company for the owners.'],
  ['HR', 'Human Resources', 'The team that handles hiring, contracts, pay and employee questions.'],
  ['IT', 'Information Technology', 'The team that looks after computers, accounts and networks.'],
  ['PR', 'Public Relations', 'The work of keeping a good image of the company in the media.'],
  ['R&D', 'Research and Development', 'The team that invents and tests new products.'],
  ['QA', 'Quality Assurance', 'Checking that work or products meet the standard before they go out.'],
  ['QC', 'Quality Control', 'Testing finished products to find defects.'],
  ['PM', 'Project Manager or Product Manager', 'A person who plans the work, the people and the deadlines of a project, or who decides what a product should do.'],
  ['PMO', 'Project Management Office', 'A team that sets the rules and tracks all projects in a company.'],
  ['PO', 'Purchase Order or Product Owner', 'A written order to buy something, or in tech teams the person who decides what to build next.'],
  ['BA', 'Business Analyst', 'A person who studies how work is done and suggests improvements.'],
  ['SME', 'Subject Matter Expert', 'A person who knows a topic very well.'],
  ['FTE', 'Full-Time Equivalent', 'A way to count workers. One FTE equals one full-time employee.'],
  ['JD', 'Job Description', 'A document that lists the tasks and skills for a job.'],
  ['PIP', 'Performance Improvement Plan', 'A formal plan that gives a person time to fix weak work results.'],
  ['KPI', 'Key Performance Indicator', 'A number that shows if you are doing well, like sales per week.'],
  ['OKR', 'Objectives and Key Results', 'A goal system: one big goal with 3 to 5 numbers that show progress.'],
  ['SMART', 'Specific, Measurable, Achievable, Relevant, Time-bound', 'A checklist for writing a clear goal.'],
  ['SWOT', 'Strengths, Weaknesses, Opportunities, Threats', 'A simple table to study a business or a person.'],
  ['USP', 'Unique Selling Point', 'The one thing that makes your product or you different from others.'],
  ['MVP', 'Minimum Viable Product', 'The smallest first version of a product that is good enough to test.'],
  ['POC', 'Proof of Concept', 'A small test that shows an idea can work.'],
  ['SOP', 'Standard Operating Procedure', 'Written steps that show the correct way to do a task.'],
  ['SLA', 'Service Level Agreement', 'A promise about how fast and how well a service will be delivered.'],
  ['NDA', 'Non-Disclosure Agreement', 'A contract that says you will keep company secrets private.'],
  ['MOU', 'Memorandum of Understanding', 'A written note that says two sides agree to work together. It is less formal than a contract.'],
  ['RFP', 'Request for Proposal', 'A document in which a company asks suppliers to send offers.'],
  ['RFQ', 'Request for Quotation', 'A request for a price for a specific item or service.'],
  ['RFI', 'Request for Information', 'A first question to suppliers: what can you offer?'],
  ['RACI', 'Responsible, Accountable, Consulted, Informed', 'A chart that shows who does what in a project.'],
  ['ROI', 'Return on Investment', 'How much you gain compared to how much you spent.'],
  ['ROE', 'Return on Equity', 'How much profit a company makes from the owners\' money.'],
  ['P&L', 'Profit and Loss', 'A report that shows income, costs and profit in a period.'],
  ['EBITDA', 'Earnings Before Interest, Taxes, Depreciation and Amortization', 'A way to measure the profit of the main business before some costs.'],
  ['COGS', 'Cost of Goods Sold', 'The direct cost of making or buying what you sell.'],
  ['CAPEX', 'Capital Expenditure', 'Money spent on things that last, like machines or buildings.'],
  ['OPEX', 'Operating Expenses', 'The regular costs of running the business, like rent and salaries.'],
  ['IPO', 'Initial Public Offering', 'The first time a company sells its shares to the public.'],
  ['M&A', 'Mergers and Acquisitions', 'When companies join together or one company buys another.'],
  ['VC', 'Venture Capital', 'Money that investors give to young companies in return for part of the company.'],
  ['LLC', 'Limited Liability Company', 'A type of company in which owners are not personally responsible for its debts.'],
  ['VAT', 'Value-Added Tax', 'A tax added to the price of goods and services.'],
  ['FY', 'Fiscal Year', 'The 12-month period a company uses for its accounts. It may not start in January.'],
  ['YTD', 'Year to Date', 'From the start of this year until today.'],
  ['YoY', 'Year over Year', 'A comparison with the same period last year.'],
  ['MoM', 'Month over Month', 'A comparison with the month before.'],
  ['Q1', 'First Quarter', 'The first 3 months of the business year. Q2, Q3 and Q4 follow.'],
  ['ARR', 'Annual Recurring Revenue', 'The yearly income a company expects from regular subscriptions.'],
  ['MRR', 'Monthly Recurring Revenue', 'The monthly income a company expects from regular subscriptions.'],
  ['B2B', 'Business to Business', 'Selling to other companies.'],
  ['B2C', 'Business to Consumer', 'Selling to everyday customers.'],
  ['D2C', 'Direct to Consumer', 'Selling straight to customers, without a shop in the middle.'],
  ['SaaS', 'Software as a Service', 'Software you use online and pay for monthly, like many work tools.'],
  ['CRM', 'Customer Relationship Management', 'A system that stores customer details and the history of contacts.'],
  ['ERP', 'Enterprise Resource Planning', 'A big system that connects money, stock, orders and people data in one place.'],
  ['SKU', 'Stock Keeping Unit', 'A unique code for one product, used to track stock.'],
  ['FIFO', 'First In, First Out', 'A stock rule: the oldest items are used or sold first.'],
  ['AR', 'Accounts Receivable', 'Money that customers owe to the company.'],
  ['AP', 'Accounts Payable', 'Money that the company owes to suppliers.'],
  ['CAC', 'Customer Acquisition Cost', 'How much it costs to win one new customer.'],
  ['LTV', 'Lifetime Value', 'The total money one customer brings to a company over time.'],
  ['NPS', 'Net Promoter Score', 'A score that shows how likely customers are to recommend you.'],
  ['CSAT', 'Customer Satisfaction Score', 'A score that shows how happy customers are with one service.'],
  ['CTR', 'Click-Through Rate', 'The share of people who click after seeing an ad or link.'],
  ['CPC', 'Cost per Click', 'What you pay each time someone clicks your ad.'],
  ['PPC', 'Pay-Per-Click', 'Online advertising where you pay only when someone clicks.'],
  ['SEO', 'Search Engine Optimization', 'Making your website easier to find on search engines.'],
  ['UX', 'User Experience', 'How easy and pleasant a product is to use.'],
  ['UI', 'User Interface', 'What the user sees and taps: screens, buttons and menus.'],
  ['API', 'Application Programming Interface', 'A way for two software tools to talk to each other.'],
  ['AI', 'Artificial Intelligence', 'Computer programs that do tasks that usually need human thinking.'],
  ['ML', 'Machine Learning', 'A type of AI that learns patterns from data.'],
  ['IoT', 'Internet of Things', 'Everyday devices that connect to the internet, like smart sensors.'],
  ['GDPR', 'General Data Protection Regulation', 'The European law about protecting personal data.'],
  ['ESG', 'Environmental, Social and Governance', 'A way to judge a company on nature, people and good management.'],
  ['DEI', 'Diversity, Equity and Inclusion', 'Efforts to make workplaces fair and welcoming for everyone.'],
  ['CSR', 'Corporate Social Responsibility', 'What a company does to help society and nature.'],
  ['ASAP', 'As Soon As Possible', 'Do it quickly.'],
  ['EOD', 'End of Day', 'By the end of today\'s work day.'],
  ['EOW', 'End of Week', 'By the end of this work week.'],
  ['ETA', 'Estimated Time of Arrival', 'When something is expected to arrive or be ready.'],
  ['FYI', 'For Your Information', 'A message that says: no action needed, just so you know.'],
  ['TBD', 'To Be Decided', 'Not decided yet.'],
  ['TBA', 'To Be Announced', 'Will be told later.'],
  ['OOO', 'Out of Office', 'Not at work, for example on holiday.'],
  ['PTO', 'Paid Time Off', 'Days off that you are paid for, like vacation days.'],
  ['WFH', 'Work From Home', 'Working at home instead of the office.'],
  ['BAU', 'Business as Usual', 'Normal daily work, not a special project.']
];

/* ---------- 12-week promotion mission: [title, text] ---------- */
PW7.MISSION = [
  ['Map your battlefield', 'Fill in your Power Rank Table with at least 6 people and draw your pyramid. Know who decides.'],
  ['Pick your strategy', 'Find your position in the Strategic Square and tap "Do it" on three rules.'],
  ['Learn what your boss measures', 'Ask your manager: "What are the top 3 things you are measured on?" Write the answer down.'],
  ['Start your wins log', 'Write 3 wins in the Wins Journal, each with a number or a date.'],
  ['Ask for feedback', 'Ask one trusted person: "What is one thing I can do better?" Say thank you and act on it.'],
  ['Build one ally', 'Have a 15-minute chat or a coffee with one person from another team.'],
  ['Fix one small problem', 'Find one small problem nobody owns and fix it without being asked.'],
  ['Become the go-to person', 'Choose one topic or tool and learn it well enough to teach it in 5 minutes.'],
  ['Show a result with a number', 'Send your manager a short update with one result and one number, like "reports now take 12 minutes, not 20".'],
  ['Refresh your CV', 'Add your new results to your CV or LinkedIn profile while you remember them.'],
  ['Prepare your pitch', 'Open the Wins Journal and tap "Make my raise pitch". Read it out loud once.'],
  ['Hold the talk', 'Book a 20-minute meeting about your next step. Bring your pitch and ask clearly.']
];
PW7.POS_HINT = {
  leader: 'As a Leader, protect your key tasks and keep energy in reserve.',
  challenger: 'As a Challenger, pick ONE thing and beat the leader at it with numbers.',
  flanker: 'As a Flanker, look for the area nobody owns and build it quietly.',
  guerrilla: 'As an Underdog, stay small, fast and friendly. Pick your moment.'
};

/* ---------- new badges ---------- */
PW7.BADGES = [
  { id: 'pitch', e: '🎤', n: 'Pitch Ready', h: 'Make your first raise pitch from the Wins Journal.' },
  { id: 'backup', e: '🛟', n: 'Safe Keeper', h: 'Export a full backup of your data.' },
  { id: 'week3', e: '🔥', n: 'Three-Week Streak', h: 'Finish the weekly check-in 3 weeks in a row.' },
  { id: 'week12', e: '🎖️', n: 'Mission Veteran', h: 'Finish 12 weekly check-ins.' }
];

/* ---------- 6 more learning stories for a starter path (18+ entry level) ---------- */
PW7.STORIES = [
  { n: 'Noah', age: 18, job: 'Fast-food crew member', s: 'guerrilla', g: 'm', k: 5, starter: 1, head: 'From new crew to trainer in 5 months', res: 'Became a Crew Trainer',
    story: 'Noah was the youngest on the shift and often got the dirty jobs. He decided to learn the opening checklist better than anyone. He was never late and never skipped a step. After a few weeks the manager asked him to show a new person how it works.',
    moves: ['Picked one small job and mastered it.', 'Arrived 10 minutes early every day.', 'Shared the credit: "the team helped me".'], lesson: 'Being reliable in a small job is the fastest start.' },
  { n: 'Aisha', age: 18, job: 'Office assistant', s: 'guerrilla', g: 'f', k: 4, starter: 1, head: 'The person who knew where everything was', res: 'Moved to the Operations team',
    story: 'On her first week, Aisha could not find anything: files, supplies, phone numbers. She wrote a one-page sheet for herself with all the answers. Her coworkers began to ask for a copy. She kept it up to date every Friday.',
    moves: ['Wrote a simple one-page guide.', 'Updated it weekly and shared it.', 'Asked her manager what to learn next.'], lesson: 'A small useful tool makes a new person visible.' },
  { n: 'Tom', age: 19, job: 'Electrician apprentice', s: 'guerrilla', g: 'm', k: 6, starter: 1, head: 'The notebook that earned trust', res: 'Given his own small jobs on site',
    story: 'Tom carried tools and watched. He started to write down every step he saw in a small notebook and asked one question a day. The master electrician noticed that Tom never asked the same question twice. Soon Tom was trusted with small jobs alone.',
    moves: ['Asked one good question a day.', 'Kept a notebook and reviewed it each Friday.', 'Kept the site clean and safe.'], lesson: 'People trust you when you learn fast and do not repeat mistakes.' },
  { n: 'Lena', age: 18, job: 'Call-center trainee', s: 'guerrilla', g: 'f', k: 5, starter: 1, head: 'From trainee to buddy for newcomers', res: 'Became a Buddy Coach',
    story: 'Lena was nervous on calls. Every week she asked her team leader for feedback on one call and fixed one thing. After two months her customer scores were among the best in her group. The manager asked her to help the next trainees.',
    moves: ['Asked for feedback on one call each week.', 'Fixed one thing at a time.', 'Wrote down her best phrases and shared them.'], lesson: 'Asking for feedback turns a weakness into a strength.' },
  { n: 'Jake', age: 19, job: 'Cafe kitchen helper', s: 'flanker', g: 'm', k: 7, starter: 1, head: 'The online orders nobody wanted', res: 'Promoted to Assistant Shift Lead',
    story: 'The cafe got more online orders, but nobody wanted to manage the tablet. Jake offered. He made a simple checklist for the rush hours and tested it for two weeks. Mistakes dropped, and the owner asked him to train the others.',
    moves: ['Found a job nobody owned.', 'Built a small checklist and tested it quietly.', 'Showed the result with numbers: fewer mistakes.'], lesson: 'Take the job nobody wants, and finish it well.' },
  { n: 'Sara', age: 20, job: 'Marketing intern', s: 'guerrilla', g: 'f', k: 6, starter: 1, head: 'The weekly report that became a job', res: 'Offered a full-time contract',
    story: 'Sara was an intern with small tasks. She noticed that the weekly social media numbers were always late. She offered to prepare them every Monday morning and made them neat and clear. After three months the team could not imagine Monday without her report.',
    moves: ['Took one small repeated task.', 'Delivered it on time, every time.', 'Told her manager about the result and asked about the next step.'], lesson: 'One small task done perfectly can open a real job.' }
];

PW7.GLOSS_EXTRA = [
  ['Abbreviation', 'A short form of a longer name, like KPI for Key Performance Indicator. Ask the Adviser what any business abbreviation means.']
];

/* merge into the V06 data */
(function () {
  var P = window.PW6 || (window.PW6 = {});
  P.PERSONAS = (P.PERSONAS || []).concat(PW7.PERSONAS);
  P.BADGES = (P.BADGES || []).concat(PW7.BADGES);
  P.GLOSS_EXTRA = (P.GLOSS_EXTRA || []).concat(PW7.GLOSS_EXTRA);
})();
