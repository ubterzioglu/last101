import type { RecruitmentAgency } from '@/types';

export const RECRUITMENT_AGENCIES: Omit<RecruitmentAgency, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'DIA-AG',
    url: 'https://dia-ag.com',
    description: 'Executive search & HR consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Randstad',
    url: 'https://randstad.de',
    description: 'Global staffing & temp solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ManpowerGroup',
    url: 'https://manpower.de',
    description: 'Workforce solutions & talent placement',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'JobBasel',
    url: 'https://jobbasel.com',
    description: 'Job board & career portal',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Michael Page',
    url: 'https://michaelpage.de',
    description: 'Professional & leadership recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Hays',
    url: 'https://hays.de',
    description: 'Specialist recruitment across industries',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Gi Group',
    url: 'https://de.gigroup.com',
    description: 'Gi Group staffing & HR services',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Page Personnel',
    url: 'https://pagepersonnel.de',
    description: 'Junior & mid-level talent placement',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Progress Professionals',
    url: 'https://progressprofessionals.de',
    description: 'Finance & legal recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Adecco',
    url: 'https://adecco.de',
    description: 'Temporary & permanent hiring',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Brunel',
    url: 'https://brunel.net/de-de',
    description: 'Engineering & technical staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Experts & Talents',
    url: 'https://experts-talents.de',
    description: 'Expert-level professional matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'GULP',
    url: 'https://gulp.de',
    description: 'Freelancer & project staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Kontrast',
    url: 'https://kontrast-gmbh.de',
    description: 'IT & digital recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Robert Half',
    url: 'https://roberthalf.com/de',
    description: 'Finance, admin & tech roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Kelly Services',
    url: 'https://kelly-services.de',
    description: 'Flexible workforce & staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Engaged Company',
    url: 'https://engaged-company.com',
    description: 'HR consulting & talent strategy',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Frankfurt Fitch',
    url: 'https://frankfurtfitch.com/de',
    description: 'Executive search & leadership hiring',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Ratbacher',
    url: 'https://ratbacher.de',
    description: 'Senior management & board search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Optimise Search',
    url: 'https://optimisesearch.com',
    description: 'Executive & specialist recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'K Resources',
    url: 'https://kresources.com',
    description: 'Tech & IT staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Academic Work',
    url: 'https://academicwork.de',
    description: 'Nordic-German academic & professional roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'get-in-IT',
    url: 'https://get-in-it.de',
    description: 'IT & software job platform',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Robert Walters',
    url: 'https://robertwalters.de',
    description: 'International professional recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'SHREE',
    url: 'https://shree.com/de-de',
    description: 'SAP & IT consulting staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'WeMatch',
    url: 'https://wematch.de',
    description: 'Tech & digital talent matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'TA Management',
    url: 'https://ta-management.de',
    description: 'Interim management & HR consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Grafton',
    url: 'https://de.grafton.com',
    description: 'Multisector recruitment agency',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: '4 Chill Consulting',
    url: 'https://4chillconsulting.de',
    description: 'IT & project staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'HeadMatch',
    url: 'https://headmatch.de',
    description: 'Executive & leadership search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'IHH Healthcare',
    url: 'https://ihh.com/de',
    description: 'Healthcare & medical recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Solua',
    url: 'https://solua.com',
    description: 'International HR & talent solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Perm4',
    url: 'https://perm4.com',
    description: 'Permanent tech & finance roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Vires Consulting',
    url: 'https://viresconsulting.com',
    description: 'Life sciences & pharma staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Skallbach',
    url: 'https://skallbach.de',
    description: 'Executive search & HR advisory',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'TechPunk',
    url: 'https://techpunk.com',
    description: 'IT & startup tech hiring',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Ignite SAP',
    url: 'https://ignitesap.com',
    description: 'SAP specialist recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Antal International',
    url: 'https://antal.com',
    description: 'Global specialist recruitment firm',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Progressive Recruitment',
    url: 'https://progressive-recruitment.de',
    description: 'Engineering & energy staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ISG',
    url: 'https://isg.com/de',
    description: 'Executive search & leadership advisory',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Linking Talents',
    url: 'https://linkingtalents.de',
    description: 'Tech & digital recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Noir Consulting',
    url: 'https://noirconsulting.co.uk',
    description: 'Tech & cybersecurity staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Amore Bond',
    url: 'https://amorebond.com/de',
    description: 'Executive & board-level search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Ital Staffing',
    url: 'https://italstaffing.com/de-de',
    description: 'Bilingual & international staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Green Recruitment Company',
    url: 'https://greenrecruitmentcompany.com',
    description: 'Energy & sustainability roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Mason Frank',
    url: 'https://masonfrank.com',
    description: 'Salesforce & cloud specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Coamos',
    url: 'https://coamos.de',
    description: 'Digital & creative talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'OXIN',
    url: 'https://weareoxin.com',
    description: 'Tech & transformation staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Design Deck',
    url: 'https://designdeck.com',
    description: 'Creative & design recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Goodman Masson',
    url: 'https://goodmanmasson.de',
    description: 'Finance & risk professionals',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'G2 Recruitment',
    url: 'https://g2recruitment.com',
    description: 'Energy & engineering specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Radial Bud',
    url: 'https://radialbud.de',
    description: 'Interim & project staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Mercuri Urval',
    url: 'https://mercuriurval.com/de-de',
    description: 'Leadership assessment & search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Emplion',
    url: 'https://emplion.de',
    description: 'HR tech & talent platform',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'PMS',
    url: 'https://pms.de',
    description: 'Personnel & management solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'LEW Group',
    url: 'https://lewgroup.com',
    description: 'Sales, marketing & finance roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Valiy One',
    url: 'https://valiyone.com',
    description: 'Digital transformation & IT hiring',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Morgan McKinley',
    url: 'https://de.morganmckinley.com',
    description: 'Finance & professional services',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Aventis Group',
    url: 'https://aventisgroup.com',
    description: 'Life sciences & medtech talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Darwin Recruitment',
    url: 'https://darwinrecruitment.com',
    description: 'Tech & data specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Zabel Global',
    url: 'https://zabelglobal.com',
    description: 'International executive search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Page Executive',
    url: 'https://pageexecutive.com',
    description: 'C-level & board recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'HIT Consulting',
    url: 'https://wearehitconsulting.com',
    description: 'Digital & IT staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Aristo Group',
    url: 'https://aristo-group.com',
    description: 'Finance & interim management',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'SGEN CIS',
    url: 'https://sgencis.de',
    description: 'Tech & project recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Konnekt',
    url: 'https://konnekt.net',
    description: 'Malta-based, global staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'IC Resources',
    url: 'https://ic-resources.com/de',
    description: 'Semiconductor & electronics staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Kooku',
    url: 'https://kooku.de',
    description: 'HR tech & job matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Taylor Hopkinson',
    url: 'https://taylorhopkinson.com',
    description: 'Renewable energy recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Trans Personal Group',
    url: 'https://transpersonalgroup.co.uk',
    description: 'Tech & transformation roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ALSES',
    url: 'https://alses.sk',
    description: 'Central European IT staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Xelentia',
    url: 'https://xelentia.com',
    description: 'Finance & fintech talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Evolutionary Cyber Solutions',
    url: 'https://evolutionarycybersolutions.com',
    description: 'Cybersecurity & IT staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Precision ICT',
    url: 'https://precisionict.com',
    description: 'ICT & infrastructure specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Press Link Services',
    url: 'https://presslinkservices.com',
    description: 'Media & press staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Locke Staffing',
    url: 'https://locke-staffing.com',
    description: 'US-German bilingual recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Harvey Nash',
    url: 'https://harveynash.de',
    description: 'Tech, digital & leadership roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Approach People',
    url: 'https://approachpeople.com',
    description: 'Multilingual & EU staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Recruiting Evolution',
    url: 'https://recruitingevolution.de',
    description: 'HR innovation & talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'UI Staffing',
    url: 'https://uistaffing.de',
    description: 'UI/UX & design talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Senasis Group',
    url: 'https://senasis.group.de',
    description: 'Tech & engineering staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'IQ Talent Partners',
    url: 'https://iqtalentpartners.com',
    description: 'Tech & startup recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Discover International',
    url: 'https://discoverinternational.com',
    description: 'Global bilingual recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Etengo',
    url: 'https://etengo.de',
    description: 'Interim & freelance experts',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Euro Job Consult',
    url: 'https://eurojobconsult.com',
    description: 'Multilingual European job portal',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'M2 Talents',
    url: 'https://m2talents.com',
    description: 'Sales & marketing staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Data Talent',
    url: 'https://data-talent.de',
    description: 'Data science & analytics roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Brink Holding',
    url: 'https://brink-holding.com',
    description: 'Executive & finance search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Opus RS',
    url: 'https://opusrs.com',
    description: 'Recruitment process outsourcing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Alpha Consult Gruppe',
    url: 'https://alphaconsultgruppe.org',
    description: 'HR consulting & placement',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Search Talent',
    url: 'https://searchtalent.de',
    description: 'Executive & niche recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'LP Associates',
    url: 'https://lpassociates.com',
    description: 'Finance & legal staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Hardenberg Group',
    url: 'https://hardenberegroupllc.com',
    description: 'US-German executive search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'IT Workforce',
    url: 'https://itworkforce.de',
    description: 'IT & tech staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Schulmeister Consulting',
    url: 'https://schulmeistereconsulting.com/de',
    description: 'HR & interim management',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Skill Recruit',
    url: 'https://skillrecruit.com',
    description: 'Skilled trades & tech roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Division One',
    url: 'https://division-one.ch',
    description: 'Swiss-German finance recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'JAC Group',
    url: 'https://jacgroup.com',
    description: 'Global talent solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'TON HR Evolution',
    url: 'https://tonhrevolution.com',
    description: 'Creative & digital staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Expert Scout',
    url: 'https://expertscout.com',
    description: 'Executive & expert matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'K Recruiting',
    url: 'https://k-recruiting.com',
    description: 'Tech & engineering roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Future Select Consult',
    url: 'https://futureselectconsult.de',
    description: 'Future-focused talent solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'LRC',
    url: 'https://lrcgmbh.de',
    description: 'Legal & compliance recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'TheQS Consulting',
    url: 'https://theqs-consulting.de',
    description: 'Quality & regulatory staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Constares',
    url: 'https://constares.de',
    description: 'Tech & transformation hiring',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Market Expanded',
    url: 'https://marketexpanded.de',
    description: 'Sales & marketing talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Klug Executive Search',
    url: 'https://klug-executivesearch.de',
    description: 'Executive & leadership search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Private Personal',
    url: 'https://privatepersonal.de',
    description: 'Personal & household staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Morgan Philips',
    url: 'https://morganphilips.com',
    description: 'Global executive search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Spencer Ogden',
    url: 'https://spencer-ogden.com',
    description: 'Energy & infrastructure roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Skills Alliance',
    url: 'https://skillsalliance.com',
    description: 'Tech & digital staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'SCRO Global',
    url: 'https://scroglobbal.com',
    description: 'Global recruitment solutions',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'eBlue Net',
    url: 'https://eblue-net.de',
    description: 'IT & network specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'DA Connection',
    url: 'https://daconnection.de',
    description: 'Bilingual & international staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Optimize Exe',
    url: 'https://optimizeexe.com',
    description: 'Executive & interim leadership',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Veredus Consulting',
    url: 'https://veredusconsulting.com',
    description: 'Tech & healthcare staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'HR Recruitment',
    url: 'https://hr-recruitment.de',
    description: 'General HR & staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Intention Business',
    url: 'https://intentionbusiness.com',
    description: 'Business & HR consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Digital Waffle',
    url: 'https://digitalwaffle.co.uk',
    description: 'Digital & creative talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'WeMe',
    url: 'https://weme.de',
    description: 'Personalized job matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'One Hiring',
    url: 'https://onehiring.com/de',
    description: 'Tech & startup recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Quantum Consultancy',
    url: 'https://quantum-consultancy.com',
    description: 'IT & project staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Progress Association',
    url: 'https://progressassociation.de',
    description: 'Professional & association roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Pack TM',
    url: 'https://packtm.com',
    description: 'E-commerce & logistics staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Evolve Ltd',
    url: 'https://evolve-ltd.co.uk',
    description: 'Tech & transformation roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Career Factory',
    url: 'https://career-factory.eu',
    description: 'Career coaching & jobs',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Medicopec',
    url: 'https://medicopec.mk',
    description: 'Medical & healthcare staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'NXT Hero',
    url: 'https://nxt-hero.com',
    description: 'Digital & gaming talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Intelligent People',
    url: 'https://intelligentpeople.com',
    description: 'Creative & marketing staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Evolve Talent',
    url: 'https://evolvetalent.eu',
    description: 'Tech & digital recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ITS Jobs We R Online',
    url: 'https://itsjobswereonline.com',
    description: 'IT job board',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Joanne Hart',
    url: 'https://joannehart.co.uk',
    description: 'Admin & support staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Rizer Recruitment',
    url: 'https://rizerrecruitment.com',
    description: 'Tech & niche roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Consultason',
    url: 'https://consultason.de',
    description: 'HR & interim consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Infotech Recruitment',
    url: 'https://infotechrecruitment.com',
    description: 'IT & software specialists',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Makk Rohr',
    url: 'https://makkrohr.com',
    description: 'German-speaking tech staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Viru Sourcing',
    url: 'https://virusourcing.com',
    description: 'IT & digital outsourcing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Hiber Roy Consultants',
    url: 'https://hiberlin-royconsultants.de',
    description: 'Executive & HR consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Medipoint',
    url: 'https://medipointag.ch',
    description: 'Medical & life sciences',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Essmann Beratung',
    url: 'https://essmann-beratung.de',
    description: 'HR & leadership consulting',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ERSG Global',
    url: 'https://ersg-global.com',
    description: 'Energy & engineering staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'ISIS Technical',
    url: 'https://isistechnical.co.uk',
    description: 'Technical & engineering roles',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Fortech Consulting',
    url: 'https://fortechconsulting.de',
    description: 'IT & engineering staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Talentania',
    url: 'https://talentania.de',
    description: 'Talent acquisition platform',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Career People',
    url: 'https://careerpeople.com',
    description: 'Sales, marketing & tech jobs',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Tech Global',
    url: 'https://techglobal.com',
    description: 'Global tech recruitment',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Pantheon Recruitment',
    url: 'https://pantheon-recruitment.de',
    description: 'Executive & specialist search',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Spartacus IT',
    url: 'https://spartacusit.nl',
    description: 'Dutch-German IT staffing',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'MaxMatch',
    url: 'https://maxmatch.de',
    description: 'AI-powered job matching',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  {
    name: 'Zync Group',
    url: 'https://zyncgroup.com',
    description: 'Tech & digital talent',
    status: 'active',
    category: 'Recruitment Agencies'
  },
  // English-speaking companies in Germany
  {
    name: 'About You',
    url: 'https://corporate.aboutyou.de/de/career/our-jobs',
    description: 'E-commerce fashion platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Accenture',
    url: 'https://www.accenture.com/de-de/careers/jobsearch',
    description: 'Global consulting with English-speaking positions in Berlin',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Accountable',
    url: 'https://join.com/companies/accountable',
    description: 'Financial services startup with English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Acemate.ai',
    url: 'https://join.com/companies/acemate',
    description: 'AI-powered platform offering English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Babbel',
    url: 'https://jobs.babbel.com/en/',
    description: 'Language learning platform with international team opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Personio',
    url: 'https://www.personio.com/about-personio/careers/',
    description: 'HR software company with English-speaking work environment',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Banxware',
    url: 'https://www.banxware.com/careers',
    description: 'Fintech startup offering English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'BASF',
    url: 'https://basf.jobs/',
    description: 'Chemical industry leader with international English positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'BearingPoint',
    url: 'https://www.bearingpoint.com/en/careers/open-roles/',
    description: 'Management consulting with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Bettermile',
    url: 'https://bettermile.com/careers/',
    description: 'Logistics optimization platform with English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Carbon One',
    url: 'https://www.carbon.one/#jobs',
    description: 'Carbon management startup with English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Caidera',
    url: 'https://www.caidera.ai/de/karriere',
    description: 'AI technology company offering English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Calima',
    url: 'https://www.calima.io/jobs',
    description: 'Clean energy platform with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Canva',
    url: 'https://www.lifeatcanva.com/en/jobs/',
    description: 'Design platform with international English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Caresyntax',
    url: 'https://www.linkedin.com/company/caresyntax/',
    description: 'Healthcare AI company with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Cloover',
    url: 'https://cloover.notion.site/Join-us-Cloover-73ec11a2660748ecb6b66be87c10d4b8',
    description: 'Clean technology startup offering English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Claire',
    url: 'https://clareandme.notion.site/Clare-needs-YOU-3acc2ce1815d402c8c6c6ea0ca5e3fd9',
    description: 'Digital assistant platform with English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Elearnio',
    url: 'https://careers.elearnio.com/jobs/Careers',
    description: 'E-learning platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Finmid',
    url: 'https://jobs.ashbyhq.com/finmid.com',
    description: 'Financial services with English-speaking finance positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Finanztip',
    url: 'https://finanztip.jobs.personio.de/',
    description: 'Financial advice platform with English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'FICUS',
    url: 'https://ficushealth.jobs.personio.com/',
    description: 'Healthcare platform with English engineering and product roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Finoa',
    url: 'https://finoa.jobs.personio.com/',
    description: 'Digital asset custody with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'FION Energy',
    url: 'https://www.linkedin.com/company/fion-energy/jobs/',
    description: 'Energy technology company with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'goodcarbon',
    url: 'https://www.linkedin.com/company/goodcarbon/jobs/',
    description: 'Carbon management platform with English sales and service roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'GetYourGuide',
    url: 'https://www.getyourguide.careers/open-roles',
    description: 'Travel platform with international English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'gematik',
    url: 'https://www.gematik.de/stellenangebote/stellenangebote.html',
    description: 'Digital health infrastructure with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'JOIN',
    url: 'https://join.com/careers#openpositions',
    description: 'Recruitment platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Jungwild',
    url: 'https://jungwild.io/jobs/',
    description: 'Digital agency with English-speaking work environment',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'JustWatch',
    url: 'https://jobs.lever.co/justwatch',
    description: 'Movie streaming search with English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'ETERNO',
    url: 'https://careers.eterno.group/en/jobs',
    description: 'Business services group with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'KAIKO Systems',
    url: 'https://job-boards.eu.greenhouse.io/kaikosystems',
    description: 'Maritime technology with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'KAYAK',
    url: 'https://www.kayak.com/careers/berlin/all',
    description: 'Travel search platform with English positions in Berlin',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'kertos',
    url: 'https://www.kertos.io/en/jobs',
    description: 'Data analytics platform with English job openings',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'kiron',
    url: 'https://www.kiron.ngo/careers#Positions',
    description: 'Educational nonprofit with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'kittl',
    url: 'https://jobs.ashbyhq.com/kittl',
    description: 'Design platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'KNIME',
    url: 'https://knime.jobs.personio.de/',
    description: 'Data analytics platform with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Knowunity',
    url: 'https://jobs.ashbyhq.com/knowunity',
    description: 'Educational platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Formo',
    url: 'https://eatformo.com/work/',
    description: 'Food technology company with English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Forto',
    url: 'https://careers.forto.com/forto-jobs/',
    description: 'Digital freight platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'FREE NOW',
    url: 'https://job-boards.greenhouse.io/freenow',
    description: 'Mobility platform with English positions across Europe',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Friendsurance',
    url: 'https://www.friendsurance.com/en/careers/',
    description: 'Digital insurance with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'FUNKE',
    url: 'https://karriere.funkemedien.de/de/',
    description: 'Media group with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'LucaNet',
    url: 'https://www.lucanet.com/en/careers/jobs/',
    description: 'Financial software with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Logistica OS',
    url: 'https://join.com/companies/logistica-oscom',
    description: 'Logistics platform with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Metiundo',
    url: 'https://jobs.metiundo.io/eng',
    description: 'Property technology with English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Merantix',
    url: 'https://careers.merantix.com/companies/deltia-2',
    description: 'AI venture studio with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Mercanis',
    url: 'https://mercanis.jobs.personio.de/',
    description: 'Supply chain platform with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'mgm-tp',
    url: 'https://jobs.mgm-tp.com/',
    description: 'Technology consulting with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Mindspace',
    url: 'https://www.mindspace.me/careers/',
    description: 'Coworking spaces with English-speaking opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Needle',
    url: 'https://needle.app/careers',
    description: 'Customer service platform with English sales and service roles',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Peec AI',
    url: 'https://peec.ai/careers',
    description: 'AI technology company with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'pplwise',
    url: 'https://pplwise.com/career/',
    description: 'HR analytics platform with English-speaking positions',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'ppro',
    url: 'https://www.ppro.com/about-us/careers/',
    description: 'Payment technology with English job opportunities',
    status: 'active',
    category: 'English Hiring Companies'
  },
  {
    name: 'Purpose Green',
    url: 'https://purpose-green.jobs.personio.de/',
    description: 'Sustainable business solutions with English-speaking roles',
    status: 'active',
    category: 'English Hiring Companies'
  }
];
