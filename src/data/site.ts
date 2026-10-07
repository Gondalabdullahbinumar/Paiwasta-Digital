// ─────────────────────────────────────────────────────────────────────────────
// PAIWASTA SITE DATA
// This is the one file to edit for company details, contact details and prices.
// A value of `null` means "not supplied yet": the website hides that item
// automatically, so no placeholder text ever appears on the live site.
// After editing, save the file and redeploy (see README.md).
// ─────────────────────────────────────────────────────────────────────────────

export const business = {
  name: 'Paiwasta Technologies',
  // Registered legal name, e.g. 'Paiwasta Technologies (Pvt.) Ltd.' — after SECP registration.
  legalName: null as string | null,
  // Registration lines for the home page trust strip, e.g. 'SECP registration no. 0123456'.
  // The strip appears automatically once at least one line is filled in.
  registrations: [] as string[],
  foundedYear: null as number | null,
  city: 'Islamabad',
  country: 'Pakistan',
  markets: 'Pakistan',
  tagline: 'Connected solutions. One team.',
  depositPercent: 30,
  responseTime: 'within one working day',
};

export const contact = {
  // WhatsApp number in international format, digits only, e.g. '923001234567'.
  whatsapp: '923336187564' as string | null,
  // How the number is shown on the page, e.g. '+92 300 1234567'.
  whatsappLabel: '+92 333 6187564' as string | null,
  phone: '+92 333 6187564' as string | null, // shown as written, e.g. '+92 51 1234567'
  email: null as string | null, // e.g. 'hello@paiwasta.com'
  address: null as string | null, // e.g. 'Office 4, Blue Area, Islamabad'
  hours: null as string | null, // e.g. 'Monday to Saturday, 9:00 to 18:00'
  // Google Maps "Embed a map" link (the src="..." part), shown on Contact when set.
  mapEmbedUrl: null as string | null,
  whatsappMessage: 'Assalam-o-alaikum, I would like to book a free consultation with Paiwasta Technologies.',
};

// Full links to your own profiles, e.g. 'https://www.linkedin.com/company/paiwasta'.
export const social: { name: string; url: string | null }[] = [
  { name: 'LinkedIn', url: null },
  { name: 'Facebook', url: null },
  { name: 'Instagram', url: null },
  { name: 'YouTube', url: null },
];

// Founder section on the About page. Fill in all four to show it.
// Put the photo in src/assets/ and write its file name here, e.g. 'founder.jpg'.
export const founder = {
  name: null as string | null,
  title: null as string | null,
  bio: null as string | null,
  photo: null as string | null,
};

// Form services. Both are free. See LAUNCH-CHECKLIST.md for how to get these.
export const forms = {
  // Contact form → Web3Forms access key (sent to your email when you sign up at web3forms.com).
  web3formsKey: 'fb22cc36-7e4d-4004-bab9-9d69fc09aa38' as string | null,
  // Careers form → FormSubmit address: your email, or the private alias FormSubmit gives you.
  careersFormsubmit: null as string | null,
  // How long job applications are kept, e.g. '12 months'.
  applicationRetention: null as string | null,
  // Office, hybrid or remote, e.g. 'We work from our Islamabad office, Monday to Saturday.'
  workingArrangements: null as string | null,
};

// Open roles on the Careers page. Leave empty to show "No open roles right now".
// Example: { title: 'Front-end developer', meta: 'Islamabad · Full-time' }
export const jobs: { title: string; meta: string }[] = [];

// Date shown as "Last updated" on the Privacy Policy and Terms of Service.
export const legalUpdated = '7 October 2026';

// Switches for parts of the site that are hidden until they are ready.
export const features = {
  chat: false, // AI assistant demo bubble. Keep false until a real assistant is connected.
  newsletter: false, // Newsletter signup on Insights. Needs a newsletter tool first.
  insights: false, // Insights and articles in the menus, footer and sitemap.
};

// Google Search Console verification code (the content="..." value only).
export const googleSiteVerification: string | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES, PRICES AND CONTENT (from the approved design and the agency profile)
// ─────────────────────────────────────────────────────────────────────────────

export type ServiceKey = 'web' | 'software' | 'design' | 'video' | 'ai';

export interface Service {
  slug: string;
  key: ServiceKey;
  n: string;
  name: string;
  short: string;
  promise: string;
  explain: string[];
  three: string[];
  deliver: string[];
  links: { to: ServiceKey; text: string }[];
  steps: [string, string][];
  prices: [string, string][];
  startPrice: string;
  minPrice: number | null;
  pkg: 'starter' | 'growth' | 'complete';
  faqs: [string, string][];
}

export const services: Service[] = [
  {
    slug: 'web-development', key: 'web', n: '01', name: 'Web Development',
    short: 'Business websites, landing pages, online stores and web portals that load fast on mobile.',
    promise: 'Websites that load fast on a phone and turn visitors into enquiries.',
    explain: [
      'Most of your customers will meet your business on a phone, often on a mobile connection. We build business websites, landing pages, online stores and web portals that load quickly on those phones, read clearly, and make it easy to call, message or book.',
      'Your website is where the rest of your digital presence comes together. It carries your brand design, it is where your videos send people, and it hosts the AI assistant that answers questions while you are busy.',
    ],
    three: ['Business website, 5 to 20 pages', 'Online store with payments', 'Hosting, domain and SSL set up'],
    deliver: ['Page structure and written content plan', 'Mobile-first design in your brand', 'Business websites, landing pages and online stores', 'Web portals with secure client logins', 'Contact forms and WhatsApp links connected to your team', 'Search basics: page titles, descriptions and a sitemap', 'Speed optimisation for average mobile connections', 'Hosting, domain and SSL certificate set up', 'Training on how to update your content'],
    links: [
      { to: 'design', text: 'Your brand design sets the colours, type and tone your website follows.' },
      { to: 'video', text: 'Your promo videos and reels send visitors to the website.' },
      { to: 'ai', text: 'Your website hosts the AI assistant that answers visitors and captures leads.' },
      { to: 'software', text: 'Forms and orders on your website feed into your custom software.' },
    ],
    steps: [
      ['Plan', 'We agree the pages, the content and what each page should get a visitor to do.'],
      ['Design', 'We design the key pages on mobile and desktop for your approval.'],
      ['Build', 'We build the site, connect forms and WhatsApp, and test it on real phones.'],
      ['Launch', 'We set up hosting, domain and SSL, then put the site live.'],
      ['Care', 'Your Care plan covers updates, backups and small changes every month.'],
    ],
    prices: [
      ['Template business website, 5 to 8 pages', 'From PKR 50,000'],
      ['Custom-designed business website, 10 to 20 pages', 'From PKR 120,000'],
      ['Online store', 'From PKR 250,000'],
    ],
    startPrice: 'From PKR 50,000', minPrice: 50000,
    pkg: 'starter',
    faqs: [
      ['Will my website work well on phones?', 'Yes. We design for phones first and test every page on mid-range Android phones on a mobile connection before launch.'],
      ['Can I update the website myself?', 'Yes. We set up a simple editor for text and images and show you how to use it. Larger changes are covered by the hours in your Care plan.'],
      ['Do you write the content?', 'We give you a content plan for every page and edit what you send us. Full copywriting can be added to the quote after the discovery call.'],
      ['Who owns the domain?', 'You do. The domain is registered in your name, and we manage renewals for you under your Care plan.'],
    ],
  },
  {
    slug: 'software-development', key: 'software', n: '02', name: 'Software Development',
    short: 'Custom web apps, mobile apps, dashboards and integrations with the tools you already use.',
    promise: 'Software that fits the way your business already works.',
    explain: [
      'When spreadsheets, paper forms and copied messages start slowing your team down, custom software can take their place. We build web applications, client portals, dashboards and mobile apps around the way your business actually works.',
      'We also connect the tools you already use, such as accounting, stock or booking systems, so information is entered once and moves where it is needed. This is where the data your automations rely on is stored and moved.',
    ],
    three: ['Custom web app or portal', 'Dashboards and reports', 'Integrations with your existing tools'],
    deliver: ['Scoping workshop and written specification', 'Custom web applications and client portals', 'Internal dashboards and reports', 'Mobile apps for Android and iOS', 'Integrations with accounting, stock, booking and messaging tools', 'User roles, logins and access control', 'Testing with your team before launch', 'Technical documentation and handover'],
    links: [
      { to: 'design', text: 'Interface design from our design team keeps the software consistent with your brand.' },
      { to: 'web', text: 'Your website collects the enquiries and orders your software manages.' },
      { to: 'ai', text: 'Your chatbots and automations read from and write to the software.' },
      { to: 'video', text: 'Short explainer videos help your staff and clients learn new tools.' },
    ],
    steps: [
      ['Scope', 'We map your current process and agree what the software must do first.'],
      ['Specify', 'You receive a written specification, timeline and fixed quote.'],
      ['Design', 'We design the screens and test them with the people who will use them.'],
      ['Build', 'We build in milestones and show you working software at each one.'],
      ['Support', 'We launch, train your team and maintain the system.'],
    ],
    prices: [
      ['Custom web application or portal', 'From PKR 600,000, quoted after scoping'],
      ['Small changes to existing software', 'PKR 2,000 per hour'],
      ['Mobile apps', 'Quoted after a call'],
    ],
    startPrice: 'From PKR 600,000', minPrice: 600000,
    pkg: 'complete',
    faqs: [
      ['How do you price custom software?', 'Custom web applications start from PKR 600,000. We give a fixed quote after a scoping session, once we understand exactly what the software must do.'],
      ['Can you work with software we already have?', 'Yes. We can connect to existing systems, extend them, or make small changes at PKR 2,000 per hour.'],
      ['Do you build mobile apps?', 'Yes, for Android and iOS. Mobile apps are quoted after a call because the scope varies widely.'],
      ['Who owns the source code?', 'Once the final payment is made, the code written for your project belongs to you, as set out in your agreement.'],
    ],
  },
  {
    slug: 'graphic-design', key: 'design', n: '03', name: 'Graphic Design',
    short: 'Logos, brand kits, social media designs, marketing material and interface design.',
    promise: 'A clear, consistent look that every part of your business follows.',
    explain: [
      'People judge a business by how it looks before they read a word. We design logos, brand kits and full brand identities that look established and stay consistent from a business card to a shop sign to a phone screen.',
      'Design is where your connected presence starts. It sets the look that your website, software and videos follow, so everything a customer sees is clearly from the same business.',
    ],
    three: ['Logo and brand kit', 'Social media designs', 'Marketing material and interface design'],
    deliver: ['Logo with variations for light and dark backgrounds', 'Colour palette and type choices', 'Business card and letterhead', 'Brand guidelines document', 'Social media post and story templates', 'Brochures, flyers and signage', 'Interface design for websites and software', 'Print-ready and web-ready files'],
    links: [
      { to: 'web', text: 'Your brand design shapes your website.' },
      { to: 'video', text: 'Your brand sets the look of every video and reel.' },
      { to: 'software', text: 'Interface design makes your software easy and consistent to use.' },
      { to: 'ai', text: 'Your brand voice guides how your chatbot speaks to customers.' },
    ],
    steps: [
      ['Brief', 'We learn about your business, customers and competitors.'],
      ['Concepts', 'We present distinct design directions with the reasoning behind each.'],
      ['Refine', 'We develop your chosen direction through agreed rounds of changes.'],
      ['Deliver', 'You receive final files in every format you need, with guidelines.'],
    ],
    prices: [
      ['Logo', 'From PKR 10,000'],
      ['Brand kit: logo, business card and letterhead', 'From PKR 25,000'],
      ['Full brand identity', 'From PKR 50,000'],
    ],
    startPrice: 'From PKR 10,000', minPrice: 10000,
    pkg: 'starter',
    faqs: [
      ['How many logo options will I see?', 'The number of concepts and rounds of changes is set out in your proposal before work begins, so you know what to expect.'],
      ['Do I receive the original design files?', 'Yes. After final payment you receive the source files along with print-ready and web-ready versions.'],
      ['Can you refresh our existing logo?', 'Yes. We can refine an existing logo rather than replace it, and build a consistent brand kit around it.'],
      ['Do you design social media posts every month?', 'Yes. Ongoing content is part of the Complete package, from PKR 35,000 per month.'],
    ],
  },
  {
    slug: 'video-marketing', key: 'video', n: '04', name: 'Video Marketing',
    short: 'Promo videos, product explainers, social media reels and motion graphics.',
    promise: 'Short videos that explain your offer quickly and bring people to your website.',
    explain: [
      'A short video can explain in thirty seconds what a page of text struggles to say. We plan, film and edit promo videos, product explainers, social media reels and motion graphics made for the way people watch on their phones.',
      'Video brings visitors to your website and explains your offer before they arrive. Every video follows your brand design and ends with a clear next step.',
    ],
    three: ['Short promo video', 'Product explainers', 'Social media reels and motion graphics'],
    deliver: ['Script and storyboard', 'Filming at your premises or ours', 'Promo videos for your website and social media', 'Product and service explainers', 'Short vertical reels', 'Motion graphics and animated text', 'Subtitles in English and Urdu', 'Versions sized for each platform'],
    links: [
      { to: 'design', text: 'Your brand design sets the colours, type and tone of every video.' },
      { to: 'web', text: 'Your videos bring visitors to the website.' },
      { to: 'ai', text: 'Viewers who reply to a video can be answered by your AI assistant.' },
      { to: 'software', text: 'Explainer videos help clients and staff learn your software.' },
    ],
    steps: [
      ['Brief', 'We agree the message, the audience and where the video will be shown.'],
      ['Script', 'We write the script and storyboard for your approval.'],
      ['Produce', 'We film, record voice and create motion graphics.'],
      ['Edit', 'We edit, add subtitles and deliver versions for each platform.'],
    ],
    prices: [
      ['Short promo video', 'From PKR 50,000'],
      ['Reels and explainer videos', 'Quoted after a call'],
    ],
    startPrice: 'From PKR 50,000', minPrice: 50000,
    pkg: 'growth',
    faqs: [
      ['How long should a promo video be?', 'Most promo videos work best at 30 to 90 seconds. We recommend a length in the brief based on where the video will be shown.'],
      ['Do you provide actors or a voice-over?', 'We can arrange presenters and voice-over artists. The cost is included in your quote once the script is agreed.'],
      ['Can you make videos in Urdu?', 'Yes. We produce videos in Urdu, English, or both, with subtitles.'],
      ['Can you make reels every month?', 'Yes. Monthly reels can be part of ongoing content in the Complete package, from PKR 35,000 per month.'],
    ],
  },
  {
    slug: 'ai-integrations', key: 'ai', n: '05', name: 'AI Integrations',
    short: 'Chatbots for websites and WhatsApp, lead capture, appointment booking and workflow automation.',
    promise: 'Assistants that answer customers at any hour and remove repetitive work.',
    explain: [
      'Many enquiries arrive after hours or while your team is busy, and the same questions are answered again and again. We set up chatbots for your website and WhatsApp that answer common questions, capture contact details and book appointments.',
      'Behind the scenes, we automate repetitive tasks such as copying leads into a sheet, sending reminders and preparing reports. AI turns visitors into leads and removes manual work, using the data your software stores.',
    ],
    three: ['WhatsApp or website chatbot', 'Lead capture and appointment booking', 'Workflow automation'],
    deliver: ['Chatbot for your website', 'Chatbot for WhatsApp Business', 'Answers trained on your services, prices and policies', 'Lead capture with details sent to your team', 'Appointment booking connected to your calendar', 'Hand-over to a person when needed', 'Automated reminders, follow-ups and reports', 'Monthly review and tuning of answers'],
    links: [
      { to: 'web', text: 'Your website hosts the AI assistant.' },
      { to: 'software', text: 'Your chatbot passes leads and bookings into your software.' },
      { to: 'design', text: 'Your brand voice sets how the assistant speaks.' },
      { to: 'video', text: 'Viewers who reply to your videos receive an answer straight away.' },
    ],
    steps: [
      ['Map', 'We list the questions customers ask and the tasks your team repeats.'],
      ['Train', 'We prepare answers from your services, prices and policies.'],
      ['Connect', 'We connect the assistant to your website, WhatsApp and calendar.'],
      ['Test', 'We test with real questions and adjust before launch.'],
      ['Tune', 'We review conversations each month and improve the answers.'],
    ],
    prices: [
      ['WhatsApp or website chatbot setup', 'From PKR 40,000'],
      ['Chatbot running and upkeep', 'From PKR 8,000 per month'],
      ['Custom automations', 'Quoted after a call'],
    ],
    startPrice: 'From PKR 40,000', minPrice: 40000,
    pkg: 'growth',
    faqs: [
      ['Will the chatbot give wrong answers?', 'The assistant answers from information you approve. When it is not sure, it passes the conversation to your team instead of guessing.'],
      ['Does it work in Urdu?', 'Yes. The assistant can reply in English, Urdu or Roman Urdu, depending on how the customer writes.'],
      ['What are the running costs?', 'Running and upkeep starts from PKR 8,000 per month. WhatsApp message charges and AI usage above the fair-use limit are passed on at cost.'],
      ['Can it book appointments?', 'Yes. The assistant can offer available times and add bookings to your calendar.'],
    ],
  },
];

export const byKey = Object.fromEntries(services.map((s) => [s.key, s])) as Record<ServiceKey, Service>;
export const serviceHref = (s: Service) => `/${s.slug}`;

export interface Package {
  id: 'starter' | 'growth' | 'complete';
  name: string;
  from: string;
  minPrice: number;
  extra: string;
  summary: string;
  suits: string;
  timeline: string;
  featured?: boolean;
  includes: string[];
}

export const packages: Package[] = [
  { id: 'starter', name: 'Starter', from: 'From PKR 65,000', minPrice: 65000, extra: '', summary: 'Brand kit and business website.', suits: 'New businesses and those with no proper online presence.', timeline: '2 to 3 weeks',
    includes: ['Brand kit: logo, business card and letterhead', 'Business website', 'Contact form and WhatsApp link', 'Hosting, domain and SSL set up', 'Starter Care from launch day'] },
  { id: 'growth', name: 'Growth', from: 'From PKR 140,000', minPrice: 140000, extra: '', summary: 'Everything in Starter, plus a promo video and an AI chatbot.', suits: 'Businesses that want more enquiries from their website.', timeline: '4 to 6 weeks', featured: true,
    includes: ['Everything in Starter', 'Short promo video', 'AI chatbot for website or WhatsApp', 'Lead capture sent to your team', 'Growth Care from launch day'] },
  { id: 'complete', name: 'Complete', from: 'From PKR 220,000', minPrice: 220000, extra: 'plus ongoing content from PKR 35,000 per month', summary: 'Everything in Growth, plus custom automations and ongoing content.', suits: 'Established businesses that want one long-term digital partner.', timeline: '6 to 10 weeks, then monthly',
    includes: ['Everything in Growth', 'Custom automations', 'Ongoing content every month', 'Complete Care from launch day'] },
];

export const care = [
  { name: 'Starter Care', month: 'PKR 4,000', quarter: 'PKR 11,000', items: ['Domain renewal', 'Hosting', 'SSL certificate', 'Weekly backups', 'Software and security updates', '1 hour of small changes a month'] },
  { name: 'Growth Care', month: 'PKR 12,000', quarter: 'PKR 33,000', items: ['Everything in Starter Care', 'Chatbot running costs within a fair-use limit', 'Chatbot tuning', '3 hours of changes a month', 'A monthly report'] },
  { name: 'Complete Care', month: 'PKR 20,000', quarter: 'PKR 55,000', items: ['Everything in Growth Care', 'Automation monitoring', 'Priority support', '6 hours of changes a month'] },
];

export const careTerms = [
  'One Care plan comes with every package. It starts on launch day and is billed in advance, monthly or quarterly.',
  'The domain is registered in the client’s name.',
  'Extra work is billed at PKR 2,000 per hour.',
  'WhatsApp message charges and AI usage above the fair-use limit are passed on at cost.',
];

export const compare: [string, string, string, string][] = [
  ['Brand kit', 'Yes', 'Yes', 'Yes'],
  ['Business website', 'Yes', 'Yes', 'Yes'],
  ['Promo video', '—', 'Yes', 'Yes'],
  ['AI chatbot', '—', 'Yes', 'Yes'],
  ['Custom automations', '—', '—', 'Yes'],
  ['Ongoing content', '—', '—', 'From PKR 35,000 per month'],
  ['Care plan included', 'Starter Care', 'Growth Care', 'Complete Care'],
  ['Timeline', '2 to 3 weeks', '4 to 6 weeks', '6 to 10 weeks, then monthly'],
  ['Starting price', 'PKR 65,000', 'PKR 140,000', 'PKR 220,000'],
];

const dep = `${business.depositPercent}%`;

export const faqs: Record<string, { title: string; items: [string, string][] }> = {
  services: { title: 'Services', items: [
    ['Do I have to buy all five services?', 'No. You can start with one service and add others later. Because one team handles everything, each new piece fits with what you already have.'],
    ['Which service should I start with?', 'For most new businesses, brand design and a website come first. The Starter package covers both. We will recommend a starting point during the free consultation.'],
    ['Who will I be speaking to during the project?', 'You have one named point of contact for the whole project, who coordinates every service on your behalf.'],
    ['Can you take over a website another company built?', 'Usually, yes. We review the existing site first and tell you honestly whether it is better to improve it or rebuild it.'],
  ] },
  pricing: { title: 'Pricing', items: [
    ['Are the prices on this website final?', 'They are starting prices in Pakistani rupees. Your final quote follows a free discovery call, once we understand what you need.'],
    ['Why do prices start from a figure rather than a fixed price?', 'The number of pages, features and videos varies from business to business. Starting prices tell you the minimum, and your quote is fixed before work begins.'],
    ['Is a Care plan compulsory?', 'One Care plan comes with every package. It keeps your domain, hosting, security and chatbot running after launch.'],
    ['Do you charge for the consultation?', 'No. The discovery call is free and there is no obligation to go ahead.'],
    ['What does extra work cost?', 'Work beyond your agreed scope or your Care plan hours is billed at PKR 2,000 per hour, and we confirm it with you before starting.'],
    ['Which currency are your prices in?', 'Every price on this website is a starting price in Pakistani rupees (PKR).'],
  ] },
  timelines: { title: 'Timelines', items: [
    ['How long does a website take?', 'The Starter package takes 2 to 3 weeks. Custom websites usually take longer, and the timeline is confirmed in your proposal.'],
    ['When does the timeline start?', 'The timeline starts once the agreement is signed, the deposit is received and we have the content we need from you.'],
    ['What can delay a project?', 'The most common delay is waiting for content or approvals. We tell you in advance what we need and when.'],
    ['Can you work to an urgent deadline?', 'Sometimes. Tell us your date during the consultation and we will say honestly whether it is achievable.'],
  ] },
  payments: { title: 'Payments', items: [
    ['How do payments work?', `You pay a ${dep} deposit to begin. Work is delivered in milestones, and the balance is due at launch.`],
    ['How are Care plans billed?', 'Care plans are billed in advance, monthly or quarterly, starting on launch day.'],
    ['Do you issue invoices?', 'Yes. You receive an invoice for every payment, showing what it covers.'],
  ] },
  ownership: { title: 'Ownership of files', items: [
    ['Who owns the website and designs?', 'Once the final payment is made, the designs, website and content created for your project belong to you.'],
    ['Will I receive the source files?', 'Yes. You receive the source design files and video project files after final payment, as set out in your agreement.'],
    ['Who owns the domain name?', 'The domain is always registered in your name, even while we manage it for you.'],
    ['What happens if I leave the Care plan?', 'We hand over your files, domain access and hosting details so you or another provider can continue.'],
  ] },
  care: { title: 'Care plans and support', items: [
    ['When does my Care plan start?', 'Your Care plan starts on launch day.'],
    ['What counts as a small change?', 'Text and image updates, a new section on an existing page, or an adjustment to the chatbot’s answers. Larger work is quoted separately.'],
    ['Do unused hours carry over?', 'Unused hours do not carry over. Each month starts with your plan’s full allowance.'],
    ['How do I request support?', 'Send your request by WhatsApp or email. Complete Care clients receive priority support.'],
    ['What is the fair-use limit for the chatbot?', 'Growth Care includes chatbot running costs within a fair-use limit set in your agreement. Usage above it is passed on at cost.'],
  ] },
};

export const processSteps = [
  { name: 'Discovery call', brief: 'A free conversation about your business and goals.', happens: 'We talk for 30 to 45 minutes about your business, your customers and what you want your online presence to achieve.', provide: 'A short description of your business and any existing website, logo or material.', receive: 'Honest advice on where to start, and whether a package or single service suits you.' },
  { name: 'Proposal', brief: 'A written scope, timeline and fixed quote.', happens: 'We prepare a written proposal setting out the work, the milestones, the timeline and the price.', provide: 'Answers to any follow-up questions, and feedback on the proposal.', receive: 'A clear proposal with a fixed quote and no hidden costs.' },
  { name: 'Agreement and deposit', brief: 'We sign an agreement and you pay the deposit.', happens: 'We sign a simple agreement covering scope, ownership and payment, and schedule the work.', provide: `Your signature and the ${dep} deposit.`, receive: 'A confirmed start date, a named point of contact and a project plan.' },
  { name: 'Design and build', brief: 'We design, build and review with you in milestones.', happens: 'Our team designs and builds each part of the project, sharing progress at every milestone for your review.', provide: 'Content, photographs and timely feedback at each milestone.', receive: 'Working designs, pages and videos to review before anything goes live.' },
  { name: 'Launch and handover', brief: 'We put everything live and hand it over.', happens: 'We test everything on real devices, put it live and walk you through how it all works.', provide: 'Final approval and the balance payment.', receive: 'Your live website and assets, access details, source files and a short training session.' },
  { name: 'Support under the Care plan', brief: 'We keep it running and improve it every month.', happens: 'From launch day your Care plan covers hosting, updates, backups and monthly change hours.', provide: 'Change requests by WhatsApp or email whenever you need them.', receive: 'A secure, up-to-date site, and reports on Growth and Complete Care.' },
];

// The five links in the home page 3D story, in order.
export const storyLinks: [ServiceKey, ServiceKey, string][] = [
  ['design', 'web', 'Your brand design shapes your website.'],
  ['web', 'ai', 'Your website hosts the AI assistant that answers visitors.'],
  ['video', 'web', 'Your videos bring visitors to your website.'],
  ['ai', 'software', 'Your AI assistant passes leads and bookings into your software.'],
  ['software', 'video', 'Your software data shows which campaigns and videos work.'],
];

export const flow: [string, string][] = [
  ['Brand design', 'We set your logo, colours and tone so everything that follows looks like one business.'],
  ['Website', 'We build a fast, mobile-first website in that brand, ready to receive visitors.'],
  ['Video', 'Promo videos and reels explain your offer and send people to the website.'],
  ['AI assistant', 'A chatbot on your site and WhatsApp answers questions and captures leads.'],
  ['Connected software', 'Leads, bookings and orders flow into software that keeps your data in one place.'],
];

export const serviceGuide: [string, string, string, string][] = [
  ['We are a new business with no logo or website.', 'Starter package', '/pricing', 'Brand kit and business website, from PKR 65,000.'],
  ['We have a website, but it brings in few enquiries.', 'Growth package', '/pricing', 'Adds a promo video and an AI chatbot, from PKR 140,000.'],
  ['We want one partner for everything, every month.', 'Complete package', '/pricing', 'Adds automations and ongoing content, from PKR 220,000.'],
  ['Our logo and materials look inconsistent.', 'Graphic Design', '/graphic-design', 'Brand kit from PKR 25,000.'],
  ['We answer the same WhatsApp questions all day.', 'AI Integrations', '/ai-integrations', 'Chatbot setup from PKR 40,000.'],
  ['Our team runs on spreadsheets and copied messages.', 'Software Development', '/software-development', 'Custom web applications from PKR 600,000.'],
  ['People do not understand what we offer.', 'Video Marketing', '/video-marketing', 'Short promo video from PKR 50,000.'],
];

// ─── Helpers ────────────────────────────────────────────────────────────────

/** WhatsApp link with the pre-filled message, or null if no number is set yet. */
export const whatsappUrl = contact.whatsapp
  ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(contact.whatsappMessage)}`
  : null;

export const activeSocial = social.filter((s) => s.url);
export const founderReady = !!(founder.name && founder.title && founder.bio);
export const displayName = business.legalName ?? business.name;
