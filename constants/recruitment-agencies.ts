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
    name: 'JobBasel',
    url: 'https://jobbasel.com',
    description: 'İş ilanları & kariyer portalı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
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
    name: 'Gi Group',
    url: 'https://de.gigroup.com',
    description: 'Gi Group personel & İK hizmetleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Page Personnel',
    url: 'https://pagepersonnel.de',
    description: 'Junior & orta kademe yetenek yerleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'İK Danışmanlığı'
  },
  {
    name: 'Progress Professionals',
    url: 'https://progressprofessionals.de',
    description: 'Finans & hukuk işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Adecco',
    url: 'https://adecco.de',
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
    name: 'Kelly Services',
    url: 'https://kelly-services.de',
    description: 'Esnek iş gücü & personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'Frankfurt Fitch',
    url: 'https://frankfurtfitch.com/de',
    description: 'Üst düzey yönetici arama & liderlik işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'SHREE',
    url: 'https://shree.com/de-de',
    description: 'SAP & BT danışmanlık personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: '4 Chill Consulting',
    url: 'https://4chillconsulting.de',
    description: 'BT & proje personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'HeadMatch',
    url: 'https://headmatch.de',
    description: 'Yönetici & liderlik araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'IHH Healthcare',
    url: 'https://ihh.com/de',
    description: 'Sağlık & tıbbi işe alım',
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
    name: 'Skallbach',
    url: 'https://skallbach.de',
    description: 'Yönetici arama & İK danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'Progressive Recruitment',
    url: 'https://progressive-recruitment.de',
    description: 'Mühendislik & enerji personeli',
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
    name: 'Amore Bond',
    url: 'https://amorebond.com/de',
    description: 'Yönetici & yönetim kurulu düzeyinde arama',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Ital Staffing',
    url: 'https://italstaffing.com/de-de',
    description: 'İki dilli & uluslararası personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Green Recruitment Company',
    url: 'https://greenrecruitmentcompany.com',
    description: 'Enerji & sürdürülebilirlik pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Enerji & Mühendislik'
  },
  {
    name: 'Mason Frank',
    url: 'https://masonfrank.com',
    description: 'Salesforce & bulut uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Coamos',
    url: 'https://coamos.de',
    description: 'Dijital & yaratıcı yetenek',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'OXIN',
    url: 'https://weareoxin.com',
    description: 'Teknoloji & dönüşüm personeli',
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
    name: 'Radial Bud',
    url: 'https://radialbud.de',
    description: 'Geçici & proje personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'Emplion',
    url: 'https://emplion.de',
    description: 'İK teknolojisi & yetenek platformu',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'PMS',
    url: 'https://pms.de',
    description: 'Personel & yönetim çözümleri',
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
    name: 'Valiy One',
    url: 'https://valiyone.com',
    description: 'Dijital dönüşüm & BT işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Morgan McKinley',
    url: 'https://de.morganmckinley.com',
    description: 'Finans & profesyonel hizmetler',
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
    name: 'HIT Consulting',
    url: 'https://wearehitconsulting.com',
    description: 'Dijital & BT personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'SGEN CIS',
    url: 'https://sgencis.de',
    description: 'Teknoloji & proje işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'Trans Personal Group',
    url: 'https://transpersonalgroup.co.uk',
    description: 'Teknoloji & dönüşüm pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
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
    name: 'Xelentia',
    url: 'https://xelentia.com',
    description: 'Finans & fintech yeteneği',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Finans & Hukuk'
  },
  {
    name: 'Evolutionary Cyber Solutions',
    url: 'https://evolutionarycybersolutions.com',
    description: 'Siber güvenlik & BT personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Precision ICT',
    url: 'https://precisionict.com',
    description: 'BİT & altyapı uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Press Link Services',
    url: 'https://presslinkservices.com',
    description: 'Medya & basın personeli',
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
    name: 'UI Staffing',
    url: 'https://uistaffing.de',
    description: 'UI/UX & tasarım yeteneği',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Yaratıcı & Tasarım'
  },
  {
    name: 'Senasis Group',
    url: 'https://senasis.group.de',
    description: 'Teknoloji & mühendislik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'IQ Talent Partners',
    url: 'https://iqtalentpartners.com',
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
    name: 'Euro Job Consult',
    url: 'https://eurojobconsult.com',
    description: 'Çok dilli Avrupa iş portalı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
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
    name: 'Opus RS',
    url: 'https://opusrs.com',
    description: 'İşe alım süreci dış kaynak kullanımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
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
    name: 'Hardenberg Group',
    url: 'https://hardenberegroupllc.com',
    description: 'ABD-Alman yönetici araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'Schulmeister Consulting',
    url: 'https://schulmeistereconsulting.com/de',
    description: 'İK & geçici yönetim',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'Division One',
    url: 'https://division-one.ch',
    description: 'İsviçre-Alman finans işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'JAC Group',
    url: 'https://jacgroup.com',
    description: 'Küresel yetenek çözümleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Uluslararası'
  },
  {
    name: 'TON HR Evolution',
    url: 'https://tonhrevolution.com',
    description: 'Yaratıcı & dijital personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Expert Scout',
    url: 'https://expertscout.com',
    description: 'Yönetici & uzman eşleştirme',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'Future Select Consult',
    url: 'https://futureselectconsult.de',
    description: 'Geleceğe yönelik yetenek çözümleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'LRC',
    url: 'https://lrcgmbh.de',
    description: 'Hukuk & uyum işe alımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'TheQS Consulting',
    url: 'https://theqs-consulting.de',
    description: 'Kalite & mevzuat uyum personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'Market Expanded',
    url: 'https://marketexpanded.de',
    description: 'Satış & pazarlama yeteneği',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
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
    name: 'Private Personal',
    url: 'https://privatepersonal.de',
    description: 'Bireysel & ev personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'SCRO Global',
    url: 'https://scroglobbal.com',
    description: 'Küresel işe alım çözümleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'eBlue Net',
    url: 'https://eblue-net.de',
    description: 'BT & ağ uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'DA Connection',
    url: 'https://daconnection.de',
    description: 'İki dilli & uluslararası personel',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Optimize Exe',
    url: 'https://optimizeexe.com',
    description: 'Yönetici & geçici liderlik',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Veredus Consulting',
    url: 'https://veredusconsulting.com',
    description: 'Teknoloji & sağlık personeli',
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
    name: 'Intention Business',
    url: 'https://intentionbusiness.com',
    description: 'İş & İK danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Digital Waffle',
    url: 'https://digitalwaffle.co.uk',
    description: 'Dijital & yaratıcı yetenek',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'Quantum Consultancy',
    url: 'https://quantum-consultancy.com',
    description: 'BT & proje personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Progress Association',
    url: 'https://progressassociation.de',
    description: 'Profesyonel & dernek pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Pack TM',
    url: 'https://packtm.com',
    description: 'E-ticaret & lojistik personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Evolve Ltd',
    url: 'https://evolve-ltd.co.uk',
    description: 'Teknoloji & dönüşüm pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
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
    name: 'Medicopec',
    url: 'https://medicopec.mk',
    description: 'Tıbbi & sağlık personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
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
    name: 'Intelligent People',
    url: 'https://intelligentpeople.com',
    description: 'Yaratıcı & pazarlama personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
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
    name: 'ITS Jobs We R Online',
    url: 'https://itsjobswereonline.com',
    description: 'BT iş ilanları platformu',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Joanne Hart',
    url: 'https://joannehart.co.uk',
    description: 'İdari & destek personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Rizer Recruitment',
    url: 'https://rizerrecruitment.com',
    description: 'Teknoloji & niş pozisyonlar',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Consultason',
    url: 'https://consultason.de',
    description: 'İK & geçici danışmanlık',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'İK Danışmanlığı'
  },
  {
    name: 'Infotech Recruitment',
    url: 'https://infotechrecruitment.com',
    description: 'BT & yazılım uzmanları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Makk Rohr',
    url: 'https://makkrohr.com',
    description: 'Almanca konuşan teknoloji personeli',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel İşe Alım'
  },
  {
    name: 'Viru Sourcing',
    url: 'https://virusourcing.com',
    description: 'BT & dijital dış kaynak kullanımı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
  },
  {
    name: 'Hiber Roy Consultants',
    url: 'https://hiberlin-royconsultants.de',
    description: 'Yönetici & İK danışmanlığı',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Medipoint',
    url: 'https://medipointag.ch',
    description: 'Tıbbi & yaşam bilimleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Sağlık & Tıp'
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
    name: 'ISIS Technical',
    url: 'https://isistechnical.co.uk',
    description: 'Teknik & mühendislik pozisyonları',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Teknoloji & Mühendislik'
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
    name: 'Talentania',
    url: 'https://talentania.de',
    description: 'Yetenek kazanım platformu',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Genel'
  },
  {
    name: 'Career People',
    url: 'https://careerpeople.com',
    description: 'Satış, pazarlama & teknoloji işleri',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
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
    name: 'Pantheon Recruitment',
    url: 'https://pantheon-recruitment.de',
    description: 'Yönetici & uzman araması',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'Üst Düzey Yönetici Arama'
  },
  {
    name: 'Spartacus IT',
    url: 'https://spartacusit.nl',
    description: 'Hollanda-Alman BT personeli',
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
  {
    name: 'Zync Group',
    url: 'https://zyncgroup.com',
    description: 'Teknoloji & dijital yetenek',
    status: 'active',
    category: 'İş Bulma Ajansları',
    subCategory: 'BT & Dijital'
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
    name: 'Elearnio',
    url: 'https://careers.elearnio.com/jobs/Careers',
    description: 'İngilizce iş fırsatları sunan e-öğrenim platformu',
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
    name: 'KAIKO Systems',
    url: 'https://job-boards.eu.greenhouse.io/kaikosystems',
    description: 'İngilizce iş fırsatları sunan denizcilik teknolojisi şirketi',
    status: 'active',
    category: 'İngilizce İşe Alan Şirketler',
    subCategory: 'Yapay Zeka & Teknoloji'
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
    name: 'Merantix',
    url: 'https://careers.merantix.com/companies/deltia-2',
    description: 'İngilizce iş fırsatları sunan yapay zeka girişim stüdyosu',
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
  }
];
