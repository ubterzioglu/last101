import type { RecruitmentAgency } from '@/types';

export const RECRUITMENT_AGENCIES: Omit<RecruitmentAgency, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'DIA-AG',
    url: 'https://dia-ag.com',
    description: 'Üst düzey yönetici arama & İK danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Randstad',
    url: 'https://randstad.de',
    description: 'Küresel personel & geçici çalışan çözümleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'ManpowerGroup',
    url: 'https://manpower.de',
    description: 'İşgücü çözümleri & yetenek yerleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'İK Danışmanlığı'
  },
  {
    name: 'Michael Page',
    url: 'https://michaelpage.de',
    description: 'Profesyonel & liderlik kadrosu işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Hays',
    url: 'https://hays.de',
    description: 'Sektörler arası uzman işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Adecco',
    url: 'https://www.adecco.com/de-de',
    description: 'Geçici & kalıcı işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Brunel',
    url: 'https://brunel.net/de-de',
    description: 'Mühendislik & teknik personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Experts & Talents',
    url: 'https://experts-talents.de',
    description: 'Uzman düzeyinde profesyonel eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'GULP',
    url: 'https://gulp.de',
    description: 'Freelance & proje personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Kontrast',
    url: 'https://kontrast-gmbh.de',
    description: 'BT & dijital işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Robert Half',
    url: 'https://roberthalf.com/de',
    description: 'Finans, idari & teknoloji pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Engaged Company',
    url: 'https://engaged-company.com',
    description: 'İK danışmanlığı & yetenek stratejisi',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Ratbacher',
    url: 'https://ratbacher.de',
    description: 'Üst yönetim & yönetim kurulu araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Optimise Search',
    url: 'https://optimisesearch.com',
    description: 'Yönetici & uzman işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'K Resources',
    url: 'https://kresources.com',
    description: 'Teknoloji & BT personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Academic Work',
    url: 'https://academicwork.de',
    description: 'İskandinav-Alman akademik & profesyonel pozisyonlar',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'get-in-IT',
    url: 'https://get-in-it.de',
    description: 'BT & yazılım iş platformu',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Robert Walters',
    url: 'https://robertwalters.de',
    description: 'Uluslararası profesyonel işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'WeMatch',
    url: 'https://wematch.de',
    description: 'Teknoloji & dijital yetenek eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'TA Management',
    url: 'https://ta-management.de',
    description: 'Geçici yönetim & İK danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Grafton',
    url: 'https://de.grafton.com',
    description: 'Çok sektörlü işe alım ajansı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Solua',
    url: 'https://solua.com',
    description: 'Uluslararası İK & yetenek çözümleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Perm4',
    url: 'https://perm4.com',
    description: 'Kalıcı teknoloji & finans pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Vires Consulting',
    url: 'https://viresconsulting.com',
    description: 'Yaşam bilimleri & ilaç personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'TechPunk',
    url: 'https://techpunk.com',
    description: 'BT & girişim teknolojisi işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Ignite SAP',
    url: 'https://ignitesap.com',
    description: 'SAP uzmanı işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Antal International',
    url: 'https://antal.com',
    description: 'Küresel uzman işe alım firması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'ISG',
    url: 'https://isg.com/de',
    description: 'Yönetici arama & liderlik danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Linking Talents',
    url: 'https://linkingtalents.de',
    description: 'Teknoloji & dijital işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Noir Consulting',
    url: 'https://noirconsulting.co.uk',
    description: 'Teknoloji & siber güvenlik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Design Deck',
    url: 'https://designdeck.com',
    description: 'Yaratıcı & tasarım işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Goodman Masson',
    url: 'https://goodmanmasson.de',
    description: 'Finans & risk profesyonelleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Finans & Hukuk'
  },
  {
    name: 'G2 Recruitment',
    url: 'https://g2recruitment.com',
    description: 'Enerji & mühendislik uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Teknoloji & Mühendislik'
  },
  {
    name: 'Mercuri Urval',
    url: 'https://mercuriurval.com/de-de',
    description: 'Liderlik değerlendirme & arama',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'LEW Group',
    url: 'https://lewgroup.com',
    description: 'Satış, pazarlama & finans pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Finans & Hukuk'
  },
  {
    name: 'Aventis Group',
    url: 'https://aventisgroup.com',
    description: 'Yaşam bilimleri & medikal teknoloji yeteneği',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Darwin Recruitment',
    url: 'https://darwinrecruitment.com',
    description: 'Teknoloji & veri uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Zabel Global',
    url: 'https://zabelglobal.com',
    description: 'Uluslararası yönetici araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Page Executive',
    url: 'https://pageexecutive.com',
    description: 'C seviyesi & yönetim kurulu işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Aristo Group',
    url: 'https://aristo-group.com',
    description: 'Finans & geçici yönetim',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Konnekt',
    url: 'https://konnekt.net',
    description: 'Malta merkezli küresel personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'IC Resources',
    url: 'https://ic-resources.com/de',
    description: 'Yarı iletken & elektronik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Kooku',
    url: 'https://kooku.de',
    description: 'İK teknolojisi & iş eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Taylor Hopkinson',
    url: 'https://taylorhopkinson.com',
    description: 'Yenilenebilir enerji işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'ALSES',
    url: 'https://alses.sk',
    description: 'Orta Avrupa BT personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Locke Staffing',
    url: 'https://locke-staffing.com',
    description: 'ABD-Alman iki dilli işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Harvey Nash',
    url: 'https://harveynash.de',
    description: 'Teknoloji, dijital & liderlik pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Approach People',
    url: 'https://approachpeople.com',
    description: 'Çok dilli & AB personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Recruiting Evolution',
    url: 'https://recruitingevolution.de',
    description: 'İK inovasyonu & yetenek',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'IQ Talent Partners',
    url: 'https://www.iqtalent.com',
    description: 'Teknoloji & girişim işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Discover International',
    url: 'https://discoverinternational.com',
    description: 'Küresel iki dilli işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Etengo',
    url: 'https://etengo.de',
    description: 'Geçici & serbest uzmanlar',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Freelance & Proje'
  },
  {
    name: 'M2 Talents',
    url: 'https://m2talents.com',
    description: 'Satış & pazarlama personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Data Talent',
    url: 'https://data-talent.de',
    description: 'Veri bilimi & analitik pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Brink Holding',
    url: 'https://brink-holding.com',
    description: 'Yönetici & finans araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Alpha Consult Gruppe',
    url: 'https://alphaconsultgruppe.org',
    description: 'İK danışmanlığı & yerleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'İK Danışmanlığı'
  },
  {
    name: 'Search Talent',
    url: 'https://searchtalent.de',
    description: 'Yönetici & niş işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'LP Associates',
    url: 'https://lpassociates.com',
    description: 'Finans & hukuk personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'IT Workforce',
    url: 'https://itworkforce.de',
    description: 'BT & teknoloji personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Skill Recruit',
    url: 'https://skillrecruit.com',
    description: 'Nitelikli meslek & teknoloji pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'K Recruiting',
    url: 'https://k-recruiting.com',
    description: 'Teknoloji & mühendislik pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Constares',
    url: 'https://constares.de',
    description: 'Teknoloji & dönüşüm işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Klug Executive Search',
    url: 'https://klug-executivesearch.de',
    description: 'Yönetici & liderlik araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Morgan Philips',
    url: 'https://morganphilips.com',
    description: 'Küresel yönetici araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Spencer Ogden',
    url: 'https://spencer-ogden.com',
    description: 'Enerji & altyapı pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Enerji & Mühendislik'
  },
  {
    name: 'Skills Alliance',
    url: 'https://skillsalliance.com',
    description: 'Teknoloji & dijital personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'HR Recruitment',
    url: 'https://hr-recruitment.de',
    description: 'Genel İK & personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'WeMe',
    url: 'https://weme.de',
    description: 'Kişiselleştirilmiş iş eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'One Hiring',
    url: 'https://onehiring.com/de',
    description: 'Teknoloji & girişim işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Career Factory',
    url: 'https://career-factory.eu',
    description: 'Kariyer koçluğu & iş ilanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'NXT Hero',
    url: 'https://nxt-hero.com',
    description: 'Dijital & oyun yeteneği',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Evolve Talent',
    url: 'https://evolvetalent.eu',
    description: 'Teknoloji & dijital işe alım',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Essmann Beratung',
    url: 'https://essmann-beratung.de',
    description: 'İK & liderlik danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'ERSG Global',
    url: 'https://ersg-global.com',
    description: 'Enerji & mühendislik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Fortech Consulting',
    url: 'https://fortechconsulting.de',
    description: 'BT & mühendislik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Tech Global',
    url: 'https://techglobal.com',
    description: 'Küresel teknoloji işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'MaxMatch',
    url: 'https://maxmatch.de',
    description: 'Yapay zeka destekli iş eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  // İngilizce iş ilanları veren şirketler
  {
    name: 'About You',
    url: 'https://corporate.aboutyou.de/de/career/our-jobs',
    description: 'İngilizce iş fırsatları sunan e-ticaret moda platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'E-ticaret & Moda'
  },
  {
    name: 'Accenture',
    url: 'https://www.accenture.com/de-de/careers/jobsearch',
    description: 'Berlin\'de İngilizce konuşulan pozisyonlar sunan küresel danışmanlık firması',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'Accountable',
    url: 'https://join.com/companies/accountable',
    description: 'İngilizce iş ilanları sunan finans hizmetleri girişimi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'Acemate.ai',
    url: 'https://join.com/companies/acemate',
    description: 'İngilizce pozisyonlar sunan yapay zeka destekli platform',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Babbel',
    url: 'https://jobs.babbel.com/en/',
    description: 'Uluslararası ekip fırsatları sunan dil öğrenme platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Personio',
    url: 'https://www.personio.com/about-personio/careers/',
    description: 'İngilizce çalışma ortamına sahip İK yazılım şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'Banxware',
    url: 'https://www.banxware.com/careers',
    description: 'İngilizce iş fırsatları sunan fintech girişimi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'BASF',
    url: 'https://basf.jobs/',
    description: 'Uluslararası İngilizce pozisyonlara sahip kimya sektörü lideri',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'BearingPoint',
    url: 'https://www.bearingpoint.com/en/careers/open-roles/',
    description: 'İngilizce konuşulan fırsatlar sunan yönetim danışmanlığı',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Danışmanlık'
  },
  {
    name: 'Bettermile',
    url: 'https://bettermile.com/careers/',
    description: 'İngilizce iş açıklamaları sunan lojistik optimizasyon platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Carbon One',
    url: 'https://www.carbon.one/#jobs',
    description: 'İngilizce pozisyonlar sunan karbon yönetimi girişimi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yenilenebilir Enerji'
  },
  {
    name: 'Caidera',
    url: 'https://www.caidera.ai/de/karriere',
    description: 'İngilizce iş fırsatları sunan yapay zeka teknoloji şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Calima',
    url: 'https://www.calima.io/jobs',
    description: 'İngilizce konuşulan pozisyonlara sahip temiz enerji platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Canva',
    url: 'https://www.lifeatcanva.com/en/jobs/',
    description: 'Uluslararası İngilizce iş fırsatları sunan tasarım platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Caresyntax',
    url: 'https://www.linkedin.com/company/caresyntax/',
    description: 'İngilizce fırsatlar sunan sağlık alanında yapay zeka şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Cloover',
    url: 'https://cloover.notion.site/Join-us-Cloover-73ec11a2660748ecb6b66be87c10d4b8',
    description: 'İngilizce iş ilanları sunan temiz teknoloji girişimi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Claire',
    url: 'https://clareandme.notion.site/Clare-needs-YOU-3acc2ce1815d402c8c6c6ea0ca5e3fd9',
    description: 'İngilizce pozisyonlar sunan dijital asistan platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Finmid',
    url: 'https://jobs.ashbyhq.com/finmid.com',
    description: 'İngilizce konuşulan finans pozisyonlarına sahip finans hizmetleri',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'Finanztip',
    url: 'https://finanztip.jobs.personio.de/',
    description: 'İngilizce iş ilanları sunan finansal tavsiye platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'FICUS',
    url: 'https://ficushealth.jobs.personio.com/',
    description: 'İngilizce mühendislik ve ürün pozisyonlarına sahip sağlık platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Finoa',
    url: 'https://finoa.jobs.personio.com/',
    description: 'İngilizce fırsatlar sunan dijital varlık saklama hizmeti',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'FION Energy',
    url: 'https://www.linkedin.com/company/fion-energy/jobs/',
    description: 'İngilizce iş fırsatları sunan enerji teknolojisi şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'goodcarbon',
    url: 'https://www.linkedin.com/company/goodcarbon/jobs/',
    description: 'İngilizce satış ve hizmet pozisyonlarına sahip karbon yönetimi platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'GetYourGuide',
    url: 'https://www.getyourguide.careers/open-roles',
    description: 'Uluslararası İngilizce iş fırsatları sunan seyahat platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'gematik',
    url: 'https://www.gematik.de/stellenangebote/stellenangebote.html',
    description: 'İngilizce konuşulan pozisyonlara sahip dijital sağlık altyapısı',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'İK Yazılım'
  },
  {
    name: 'JOIN',
    url: 'https://join.com/careers#openpositions',
    description: 'İngilizce iş fırsatları sunan işe alım platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Jungwild',
    url: 'https://jungwild.io/jobs/',
    description: 'İngilizce çalışma ortamına sahip dijital ajans',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'JustWatch',
    url: 'https://jobs.lever.co/justwatch',
    description: 'İngilizce iş ilanları sunan film akış arama platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'ETERNO',
    url: 'https://careers.eterno.group/en/jobs',
    description: 'İngilizce fırsatlar sunan iş hizmetleri grubu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'KAYAK',
    url: 'https://www.kayak.com/careers/berlin/all',
    description: 'Berlin\'de İngilizce pozisyonlara sahip seyahat arama platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'kertos',
    url: 'https://www.kertos.io/en/jobs',
    description: 'İngilizce iş ilanları sunan veri analitiği platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'kiron',
    url: 'https://www.kiron.ngo/careers#Positions',
    description: 'İngilizce fırsatlar sunan eğitim odaklı kar amacı gütmeyen kuruluş',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'kittl',
    url: 'https://jobs.ashbyhq.com/kittl',
    description: 'İngilizce iş fırsatları sunan tasarım platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'KNIME',
    url: 'https://knime.jobs.personio.de/',
    description: 'İngilizce konuşulan pozisyonlara sahip veri analitiği platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Knowunity',
    url: 'https://jobs.ashbyhq.com/knowunity',
    description: 'İngilizce iş fırsatları sunan eğitim platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Formo',
    url: 'https://eatformo.com/work/',
    description: 'İngilizce pozisyonlar sunan gıda teknolojisi şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Forto',
    url: 'https://careers.forto.com/forto-jobs/',
    description: 'İngilizce iş fırsatları sunan dijital kargo platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'FREE NOW',
    url: 'https://job-boards.greenhouse.io/freenow',
    description: 'Avrupa genelinde İngilizce pozisyonlara sahip mobilite platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Friendsurance',
    url: 'https://www.friendsurance.com/en/careers/',
    description: 'İngilizce fırsatlar sunan dijital sigorta şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Sigorta'
  },
  {
    name: 'FUNKE',
    url: 'https://karriere.funkemedien.de/de/',
    description: 'İngilizce iş fırsatları sunan medya grubu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'LucaNet',
    url: 'https://www.lucanet.com/en/careers/jobs/',
    description: 'İngilizce konuşulan pozisyonlara sahip finansal yazılım şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Fintech & Finans'
  },
  {
    name: 'Logistica OS',
    url: 'https://join.com/companies/logistica-oscom',
    description: 'İngilizce iş fırsatları sunan lojistik platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Metiundo',
    url: 'https://jobs.metiundo.io/eng',
    description: 'İngilizce pozisyonlar sunan gayrimenkul teknolojisi şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Mercanis',
    url: 'https://mercanis.jobs.personio.de/',
    description: 'İngilizce konuşulan pozisyonlara sahip tedarik zinciri platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'mgm-tp',
    url: 'https://jobs.mgm-tp.com/',
    description: 'İngilizce iş fırsatları sunan teknoloji danışmanlık firması',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Danışmanlık'
  },
  {
    name: 'Mindspace',
    url: 'https://www.mindspace.me/careers/',
    description: 'İngilizce fırsatlar sunan ortak çalışma alanları',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'Needle',
    url: 'https://needle.app/careers',
    description: 'İngilizce satış ve hizmet pozisyonlarına sahip müşteri hizmetleri platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Peec AI',
    url: 'https://peec.ai/careers',
    description: 'İngilizce iş fırsatları sunan yapay zeka teknoloji şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'pplwise',
    url: 'https://pplwise.com/career/',
    description: 'İngilizce konuşulan pozisyonlara sahip İK analitiği platformu',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'ppro',
    url: 'https://www.ppro.com/about-us/careers/',
    description: 'İngilizce iş fırsatları sunan ödeme teknolojisi şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
  },
  {
    name: 'Purpose Green',
    url: 'https://purpose-green.jobs.personio.de/',
    description: 'İngilizce pozisyonlar sunan sürdürülebilir iş çözümleri şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Genel'
  },
  {
    name: 'StepStone',
    url: 'https://www.stepstone.de',
    description: 'Kurumsal işler. Maaş beklentisi filtresi ve sektör raporları için ideal',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Indeed',
    url: 'https://de.indeed.com',
    description: 'Tüm ilanları tarar. Anahtar kelime aramasıyla hızlı sonuç verir',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'LinkedIn Jobs',
    url: 'https://www.linkedin.com/jobs',
    description: 'Kurumsal işler ve networking. Profilin Almanca/İngilizce optimize olmalı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'XING',
    url: 'https://www.xing.com/jobs',
    description: 'DACH bölgesi. Alman işverenler LinkedIn\'den daha sık kullanır',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Glassdoor',
    url: 'https://www.glassdoor.de',
    description: 'İşveren yorumları. Başvurmadan önce şirket kültürü ve maaşları araştırın',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Monster',
    url: 'https://www.monster.com/de/',
    description: 'Geleneksel şirketler. Özgeçmiş yükleyerek işverenlerin sizi bulmasını sağlayın',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Jobware',
    url: 'https://www.jobware.de',
    description: 'Uzman ve yönetici pozisyonları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Kimeta',
    url: 'https://www.kimeta.de',
    description: 'Farklı kariyer sitelerindeki ilanları tek ekranda toplar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Jooble',
    url: 'https://de.jooble.org',
    description: 'Tüm interneti tarar; yerel gazete ve küçük firma ilanlarını da bulur',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Stellenanzeigen',
    url: 'https://www.stellenanzeigen.de',
    description: 'Yerel işletmeler. Büyük şehirler dışındaki KOBİ ilanları için etkili',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'MeineStadt',
    url: 'https://jobs.meinestadt.de',
    description: 'Şehir veya ilçe bazlı bölgesel iş araması',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Jobbörse.de',
    url: 'https://www.jobboerse.de',
    description: 'Çeşitli sektörler, kariyer rehberleri ve başvuru şablonları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Yourfirm',
    url: 'https://www.yourfirm.de',
    description: 'Alman KOBİ\'leri ve gizli şampiyon orta ölçekli firmalar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Experteer',
    url: 'https://www.experteer.de',
    description: 'Kıdemli yöneticiler için 100 bin Euro üzeri pozisyonlar (freemium)',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'Stellenmarkt',
    url: 'https://www.stellenmarkt.de',
    description: 'Standart ofis işleri, sade ve geleneksel ilan arama deneyimi',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Genel İlan Platformları'
  },
  {
    name: 'BA Jobbörse',
    url: 'https://www.arbeitsagentur.de/jobsuche/',
    description: 'Federal İş Ajansı resmi iş bulma platformu, işverenler için en güvenilir ana portal',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Interamt',
    url: 'https://www.interamt.de',
    description: 'Kamu sektörü ilanları; birçok federal bakanlık başvuruları bu portaldan alır',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Service.bund.de',
    url: 'https://www.service.bund.de',
    description: 'Federal, eyalet ve belediye idarelerindeki iş ve eğitim yerleri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Jobs beim Staat',
    url: 'https://www.jobs-beim-staat.de',
    description: 'Belediye, eyalet ve federal kurumların güncel ilanlarını toplayan arama motoru',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'ÖD-News Stellenmarkt',
    url: 'https://stellen.oeffentlicher-dienst-news.de',
    description: 'Kamu hizmetinin tüm alanlarını kapsayan ilan tabanı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Karriereportal Berlin',
    url: 'https://karriereportal-stellen.berlin.de',
    description: 'Berlin eyalet idaresi memur ve sözleşmeli pozisyonları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Karriere.NRW',
    url: 'https://karriere.nrw',
    description: 'Kuzey Ren-Vestfalya eyaletinin kariyer portalı ve kamu ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'Make it in Germany Jobbörse',
    url: 'https://www.make-it-in-germany.com/en/working-in-germany/job-listings',
    description: 'Yurt dışındaki adaylar için Federal İş Ajansı ilanları, İngilizce arayüz',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'ZAV',
    url: 'https://www.arbeitsagentur.de/vor-ort/zav/startseite',
    description: 'Federal İş Ajansı yurt dışından nitelikli çalışan alımı ve yerleştirme birimi',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'EU Careers (EPSO)',
    url: 'https://eu-careers.europa.eu',
    description: 'AB kurum ve ajanslarındaki işler; kadrolu pozisyonlarda genelde AB vatandaşlığı aranır',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Kamu & Resmî'
  },
  {
    name: 'GermanTechJobs',
    url: 'https://germantechjobs.de',
    description: 'Yazılım ve IT ilanları, maaş aralıklarını şeffaf gösterir',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'Arbeitnow',
    url: 'https://www.arbeitnow.com',
    description: 'İngilizce IT ve uzaktan işler, vize sponsorluğu filtresi var',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'Wellfound',
    url: 'https://wellfound.com',
    description: 'Teknoloji girişimleri, hissedar olma potansiyeli olan erken aşama startuplar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'Berlin Startup Jobs',
    url: 'https://berlinstartupjobs.com',
    description: 'Berlin startup ekosistemi; QA, Dev ve Product rolleri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'Instaffo',
    url: 'https://instaffo.com',
    description: 'Becerilerinize göre uygun firmalarla otomatik eşleştirme',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'WeAreDevelopers',
    url: 'https://www.wearedevelopers.com',
    description: 'Sadece yazılımcılar için Avrupa/Almanya ağı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'IT-Treff',
    url: 'https://www.it-treff.de',
    description: 'Sistem yönetimi ve donanım destek rolleri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'IT-Jobs.de',
    url: 'https://www.it-jobs.de',
    description: 'Şirketlerin kariyer sayfalarındaki tüm yazılım ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'IT & Yazılım'
  },
  {
    name: 'EnglishJobs',
    url: 'https://englishjobs.de',
    description: 'Almanca bilgisi gerektirmeyen firmaların ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Relocate.me',
    url: 'https://relocate.me',
    description: 'Yalnızca vize sponsorluğu ve taşınma paketi sunan işler',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Germany Startup Jobs',
    url: 'https://germanystartupjobs.com',
    description: 'İngilizcenin ana dil olduğu dinamik startup pozisyonları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Landing.jobs',
    url: 'https://landing.jobs',
    description: 'Vize ve çalışma izni filtresiyle Batı Avrupa teknoloji ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Startup.jobs',
    url: 'https://startup.jobs',
    description: '"relocation" anahtar kelimesiyle taşınma destekli startup ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Europe Language Jobs',
    url: 'https://europelanguagejobs.com',
    description: 'Dil becerinize (örn. Türkçe) göre Avrupa\'daki işler',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'EuroEngineerJobs',
    url: 'https://euroengineerjobs.com',
    description: 'Almanya dahil Avrupa genelinde İngilizce mühendislik ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'EuroPharmaJobs',
    url: 'https://europharmajobs.com',
    description: 'İlaç, biyoteknoloji ve üretimde Avrupa çapında ilanlar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'HN Who is Hiring',
    url: 'https://news.ycombinator.com',
    description: 'Aylık "Who is hiring" başlığında şirketler vize sponsorluğu notuyla ilan verir',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İngilizce & Relocation'
  },
  {
    name: 'Ingenieur.de',
    url: 'https://jobs.ingenieur.de',
    description: 'VDI resmi ilanları, mühendisler için prestijli ilan ağı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'Jobvector',
    url: 'https://www.jobvector.de',
    description: 'Mühendis, biyolog, fizikçi ve kimyagerler için bilim ve teknoloji ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'Greenjobs',
    url: 'https://www.greenjobs.de',
    description: 'Rüzgar, güneş enerjisi ve sürdürülebilirlik alanı ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'Energiejobs',
    url: 'https://www.energiejobs.de',
    description: 'Enerji dönüşümü kapsamındaki mühendislik projeleri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'Baujobs',
    url: 'https://www.baujobs.de',
    description: 'Mimarlık ve inşaat mühendisliği pozisyonları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'Chemie.de Jobs',
    url: 'https://www.chemie.de/jobs',
    description: 'Laboratuvar ve proses mühendisliği işleri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'MINT Solutions',
    url: 'https://www.mint-solutions.de',
    description: 'Fen bilimleri ve bilişimde yüksek nitelikli headhunter ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Mühendislik & Enerji'
  },
  {
    name: 'PraktischArzt',
    url: 'https://www.praktischarzt.de',
    description: 'Doktorlar ve asistan hekimler için en geniş ilan havuzu',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Sağlık & Bakım'
  },
  {
    name: 'Medi-Jobs',
    url: 'https://www.medi-jobs.de',
    description: 'Fizyoterapistten diyetisyene tüm sağlık kolları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Sağlık & Bakım'
  },
  {
    name: 'Pflegejob',
    url: 'https://www.pflegejob.de',
    description: 'Hasta ve yaşlı bakımı, yurt dışından alım yapılan bakım personeli',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Sağlık & Bakım'
  },
  {
    name: 'DocCheck Jobs',
    url: 'https://jobs.doccheck.com',
    description: 'İlaç ve medikal teknoloji sektörü kurumsal ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Sağlık & Bakım'
  },
  {
    name: 'Handwerker Jobs',
    url: 'https://www.handwerkerjobs.de',
    description: '12.000\'i aşkın zanaat ilanı, kariyer rehberleri ve iş alarmı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'Handwerker Stellen',
    url: 'https://www.handwerkerstellen.de',
    description: 'Elektrikçi, tesisatçı ve usta ilanları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'PowerUs',
    url: 'https://www.powerus.de',
    description: 'Elektrik, SHK, çatı, marangozluk, metal ve oto mekatronik kalıcı pozisyonlar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'Lehrstellen-Radar',
    url: 'https://www.lehrstellen-radar.de',
    description: '130\'dan fazla zanaat dalında Ausbildung ve staj yeri arama',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'Handwerk.de',
    url: 'https://www.handwerk.de',
    description: 'Alman Zanaat Odaları portalı; meslek testi, A-Z meslekler, Ausbildung yeri',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'BQ-Portal',
    url: 'https://www.bq-portal.de',
    description: 'Yabancı meslek belgelerinin Almanya\'daki karşılığı; HWK denkliği öncesi bakın',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Zanaat (Handwerk)'
  },
  {
    name: 'Hotelcareer',
    url: 'https://www.hotelcareer.de',
    description: 'Konaklama endüstrisinin bir numaralı iş arama motoru',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Lojistik, Otel & Perakende'
  },
  {
    name: 'Rolling Pin',
    url: 'https://rollingpin.com/jobs',
    description: 'Michelin yıldızlı restoranlar ve lüks oteller',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Lojistik, Otel & Perakende'
  },
  {
    name: 'Logistik-Jobs',
    url: 'https://www.logistik-jobs.de',
    description: 'Tedarik zinciri, mühendislikten depolamaya tüm kademeler',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Lojistik, Otel & Perakende'
  },
  {
    name: 'Absolventa',
    url: 'https://www.absolventa.de',
    description: 'Trainee ve Junior roller, 0-2 yıl deneyimliler için ideal',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Workwise',
    url: 'https://workwise.io',
    description: 'Ön yazı gerektirmeden tek tıkla başvuru',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'MeinPraktikum',
    url: 'https://www.meinpraktikum.de',
    description: 'Staj programları ve şirketlerin stajyerlerden aldığı puanlar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Zenjob',
    url: 'https://www.zenjob.com/de/jobs',
    description: 'Uygulama üzerinden günlük yevmiyeli part-time işler',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Jobmensa',
    url: 'https://www.jobmensa.de',
    description: 'Almanya\'nın en büyük üniversite öğrencisi iş havuzu (Werkstudent)',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Azubiyo',
    url: 'https://www.azubiyo.de',
    description: 'Hem okuyup hem maaş almak isteyenler için mesleki eğitim ve test',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'AUBI-plus',
    url: 'https://www.aubi-plus.de',
    description: 'Şirketlerin eğitim olanakları, kalite sertifikalarıyla listelenir',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'e-fellows',
    url: 'https://jobs.e-fellows.net/jobs',
    description: 'Burs programları ve prestijli danışmanlık/finans stajları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Unicum',
    url: 'https://karriere.unicum.de',
    description: 'Kampüs işleri ve başlangıç seviyesi ilanlar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Connecticum',
    url: 'https://www.connecticum.de',
    description: 'IT ve mühendislik stajı, kariyer fuarlarının dijital uzantısı',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Öğrenci & Yeni Mezun'
  },
  {
    name: 'Academics',
    url: 'https://www.academics.de',
    description: 'Almanya, Avusturya ve İsviçre üniversite ve araştırma kurumları ilanları (DIE ZEIT)',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Akademi & Araştırma'
  },
  {
    name: 'EURAXESS',
    url: 'https://euraxess.ec.europa.eu/jobs',
    description: 'AB araştırmacı iş ve hareketlilik portalı, Almanya ilanlarını da kapsar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Akademi & Araştırma'
  },
  {
    name: 'jobs.myScience',
    url: 'https://www.myscience.de/jobs',
    description: 'Almanya ve komşu ülkelerdeki araştırma merkezleri ve yüksek teknoloji firmaları',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Akademi & Araştırma'
  },
  {
    name: 'Academic Positions',
    url: 'https://academicpositions.com',
    description: 'Doktora, post-doc ve profesörlük ilanları, ülke filtresiyle',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Akademi & Araştırma'
  },
  {
    name: 'Max Planck Stellenbörse',
    url: 'https://www.mpg.de/stellenboerse',
    description: 'Max Planck Enstitülerindeki post-doc, bilimsel ve teknik pozisyonlar',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'Akademi & Araştırma'
  },
  {
    name: 'Deutsche Bahn Karriere',
    url: 'https://db.jobs/de-de',
    description: 'Demiryolu ve IT; en çok personel alan, relocation konusunda güçlü şirketlerden',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İşveren Kariyer Sayfaları'
  },
  {
    name: 'Bosch Karriere',
    url: 'https://www.bosch.de/karriere',
    description: 'Otomotiv ve yazılım; Türkiye\'den transfer için popüler adres',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İşveren Kariyer Sayfaları'
  },
  {
    name: 'Siemens Karriere',
    url: 'https://jobs.siemens.com',
    description: 'Otomasyon ve enerji; çok sayıda İngilizce departman',
    status: 'active',
    category: 'İş ve Kariyer Platformları',
    subCategory: 'İşveren Kariyer Sayfaları'
  }
];
