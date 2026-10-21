import type { SiteTone } from '@/components/site/tones';

export interface TeamMember {
  name: string;
  role: string;
  photo: string;
  /** Category colour of the role chip and the quote box. */
  tone: SiteTone;
  link?: { href: string; label: string };
  badge?: string;
  bio: string[];
  quote: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Umut Barış Terzioğlu',
    role: 'Kurucu',
    photo: '/images/profil.jpg',
    tone: 'yellow',
    link: { href: 'https://ubterzioglu.dev', label: 'Kişisel Web Sayfam' },
    bio: [
      "Ben Umut Barış Terzioğlu. Türkiye'de Barış, Almanya'da Umut :) 1985 doğumluyum. Aslen Makine Mühendisiyim; bugünlerde yazılım tarafında çalışıyorum. 2021'den beri eşimle ve iki kedimizle birlikte Dortmund'da yaşıyorum.",
      'Yeni şeyler öğrenmeyi, üretmeyi ve insanlara faydalı olmayı seviyorum. Teknolojiyle iç içe olsam da günlük hayatta pratik, net ve işe yarayan bilgiye değer veririm. Boş zamanlarımda bilgisayar oyunları, film/dizi, müzik ve seyahat iyi gelir; kafamı toparlamanın en güzel yolu bazen de iki kedimizle evde "sessiz bir karmaşa" yaşamak olur.',
      "Almanya'da yaşamaya başladığım günden beri, günlük hayatta karşılaştığım pek çok sorunun net ve dağınık olmayan bir kaynağa ihtiyaç duyduğunu fark ettim. almanya101.de, tam olarak bu ihtiyaçtan doğdu.",
      "Bu platformu; Almanya'ya yeni gelenlerin, gelmeyi düşünenlerin ya da burada uzun süredir yaşayanların güvenilir ve sade bilgilere kolayca ulaşabilmesi için kurdum. Amacım her şeyi bilen biri olmak değil; öğrenilenleri, tecrübeleri ve faydalı bilgileri tek bir yerde toplamak.",
    ],
    quote:
      '"almanya101.de yaşayan bir platform. Zamanla gelişiyor, büyüyor ve katkılarla daha da güçleniyor. Eğer burada birine yardımcı olabiliyorsak, doğru yoldayız demektir."',
  },
  {
    name: 'Şahincan Özbakır',
    role: 'Kurucu & Yazılım Geliştirici',
    photo: '/images/sahin-profil.jpeg',
    tone: 'blue',
    badge: "2026'dan Beri Ekibimizde",
    bio: [
      '1994 İstanbul doğumluyum. Aslen turizm profesyoneli olarak başladığım kariyerime, 2021 tarihinden beri yazılım geliştirme alanında çalışıyorum.',
      "2022 yılından beri Almanya Magdeburg'ta eşim ve 2 kızımla birlikte yaşıyorum.",
      'İşkolik bir insanım ve yeni bir şeyler öğretip öğrenmeyi çok seviyorum. Turizm sektöründe iken aldığım pedagojik formasyonum hayatıma çok büyük bir vizyon kattı.',
      'Gereksiz angarya işleri sevmediğim için, her işin önce SWOT analizini yapar ve kolay yollarını ararım. Zorsa da kolaylaştırırım :) Oyun oynamayı ve gitar çalmayı severim.',
      'Genelde ulaşılabilir biriyimdir ve yukardan bakma gibi saçma egolarım yoktur. Her zaman ulaşabilirsiniz.',
    ],
    quote:
      '"2026 yılında almanya101 ailesine katıldım ve UBT ile bir şeyler yapmaya uğraşıyoruz. Gelin beraber büyümeye devam edelim. Paylaşalım, eğitelim, destek olalım."',
  },
];
