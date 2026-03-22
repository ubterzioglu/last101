'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

// --- Types ---
interface Option {
  key: string;
  label: string;
  next: string; // question ID or 'RESULT:visa_id'
}

interface Question {
  id: string;
  text: string;
  hint?: string;
  options: Option[];
}

interface VisaResult {
  id: string;
  title: string;
  subtitle: string;
  color: 'blue' | 'green' | 'yellow' | 'orange' | 'red';
  requirements: string[];
  steps: string[];
  note?: string;
}

// --- Questions ---
const QUESTIONS: Question[] = [
  {
    id: 'Q01',
    text: 'AB, AEA veya İsviçre vatandaşı mısınız?',
    hint: 'Avrupa Birliği, Avrupa Ekonomik Alanı (Norveç, İzlanda, Lihtenştayn) veya İsviçre',
    options: [
      { key: 'yes', label: 'Evet', next: 'RESULT:EU_CITIZEN' },
      { key: 'no', label: 'Hayır', next: 'Q02' },
    ],
  },
  {
    id: 'Q02',
    text: "Almanya'ya gidişinizin temel amacı nedir?",
    options: [
      { key: 'work', label: '💼  Çalışmak / Kariyer', next: 'Q03' },
      { key: 'study', label: '🎓  Üniversite okumak', next: 'RESULT:STUDENT' },
      { key: 'ausbildung', label: '🔧  Meslek eğitimi (Ausbildung)', next: 'RESULT:AUSBILDUNG' },
      { key: 'family', label: "👨‍👩‍👧  Almanya'daki aileye katılmak", next: 'RESULT:FAMILY' },
      { key: 'research', label: '🔬  Araştırma / Doktora', next: 'RESULT:RESEARCH' },
      { key: 'selfemploy', label: '🚀  Serbest meslek / Girişimcilik', next: 'RESULT:SELF_EMPLOY' },
    ],
  },
  {
    id: 'Q03',
    text: "Almanya'dan yazılı iş teklifiniz (sözleşmeniz) var mı?",
    options: [
      { key: 'yes', label: 'Evet, iş sözleşmem var', next: 'Q04' },
      { key: 'no', label: 'Hayır, iş arıyorum', next: 'Q09' },
    ],
  },
  {
    id: 'Q04',
    text: 'Üniversite diplomanız var mı?',
    hint: 'Lisans, yüksek lisans veya doktora — Almanya ya da AB tarafından tanınmış olması gerekir',
    options: [
      { key: 'yes', label: 'Evet, tanınmış üniversite diplomam var', next: 'Q05' },
      { key: 'no', label: 'Hayır, üniversite diplomam yok', next: 'Q07' },
    ],
  },
  {
    id: 'Q05',
    text: 'İş teklifindeki yıllık brüt maaş ne kadar?',
    hint: 'EU Mavi Kart eşiği 2025\'te ~45.300 € (kıtlık mesleklerinde ~41.042 €)',
    options: [
      { key: 'high', label: '45.300 € ve üzeri', next: 'RESULT:BLUE_CARD' },
      { key: 'mid', label: '41.000 – 45.300 € arası', next: 'Q06' },
      { key: 'low', label: '41.000 € altında', next: 'RESULT:FACHKRAFT_UNI' },
    ],
  },
  {
    id: 'Q06',
    text: 'Hangi alanda çalışacaksınız?',
    hint: 'Kıtlık mesleği olan alanlarda EU Mavi Kart için daha düşük maaş eşiği uygulanır',
    options: [
      { key: 'stem', label: '💻  STEM (Mühendislik, BT, Matematik, Doğa Bilimleri)', next: 'RESULT:BLUE_CARD' },
      { key: 'health', label: '⚕️  Tıp / Sağlık / Eczacılık', next: 'RESULT:BLUE_CARD' },
      { key: 'other', label: '🗂️  Diğer bir alan', next: 'RESULT:FACHKRAFT_UNI' },
    ],
  },
  {
    id: 'Q07',
    text: 'BT / Yazılım alanında mı çalışacaksınız?',
    hint: "Almanya'da diploma olmadan BT uzmanı vizesiyle çalışmak mümkündür",
    options: [
      { key: 'yes', label: 'Evet, 3+ yıl BT deneyimim var', next: 'RESULT:IT_SPECIALIST' },
      { key: 'no', label: 'Hayır / 3 yıldan az BT deneyimim var', next: 'Q08' },
    ],
  },
  {
    id: 'Q08',
    text: "Almanya'da tanınan mesleki eğitim (Ausbildung / IHK / HWK) sertifikanız var mı?",
    options: [
      { key: 'yes', label: 'Evet, tanınmış mesleki sertifikam var', next: 'RESULT:FACHKRAFT_VOC' },
      { key: 'no', label: 'Hayır', next: 'RESULT:LIMITED' },
    ],
  },
  {
    id: 'Q09',
    text: 'Üniversite diplomanız var mı?',
    hint: 'Lisans veya üzeri, Almanya ya da AB tarafından tanınmış',
    options: [
      { key: 'yes', label: 'Evet, tanınmış üniversite diplomam var', next: 'Q10' },
      { key: 'no', label: 'Hayır', next: 'Q12' },
    ],
  },
  {
    id: 'Q10',
    text: 'Mesleki çalışma deneyiminiz kaç yıl?',
    hint: 'Diplomanızla ilgili alanda, son 5 yıl içindeki deneyim',
    options: [
      { key: 'twoplus', label: '2 yıl ve üzeri', next: 'Q11' },
      { key: 'less', label: '2 yıldan az', next: 'RESULT:JOB_SEEKER' },
    ],
  },
  {
    id: 'Q11',
    text: 'Almanca dil seviyeniz nedir?',
    hint: "Chancenkarte'da dil puanı önemli bir kriter; A1 bile puan kazandırır",
    options: [
      { key: 'a1plus', label: 'A1 veya üzeri (Almanca biliyorum)', next: 'RESULT:CHANCENKARTE' },
      { key: 'none', label: 'Almancam yok', next: 'Q11B' },
    ],
  },
  {
    id: 'Q11B',
    text: 'Aşağıdakilerden en az biri sizin için geçerli mi?',
    hint: "Chancenkarte'da Almanca dışı kriterler de puan kazandırabilir",
    options: [
      { key: 'yes', label: '✓  İngilizce B2+ seviyesinde biliyorum', next: 'RESULT:CHANCENKARTE' },
      { key: 'prev', label: "✓  Daha önce Almanya'da çalıştım veya okudum", next: 'RESULT:CHANCENKARTE' },
      { key: 'no', label: 'Hayır, hiçbiri geçerli değil', next: 'RESULT:JOB_SEEKER' },
    ],
  },
  {
    id: 'Q12',
    text: "Almanya'da tanınan mesleki eğitim sertifikanız var mı?",
    options: [
      { key: 'yes', label: 'Evet, tanınmış mesleki sertifikam var', next: 'RESULT:JOB_SEEKER_VOC' },
      { key: 'no', label: 'Hayır', next: 'RESULT:LIMITED' },
    ],
  },
];

// --- Visa Results ---
const RESULTS: VisaResult[] = [
  {
    id: 'EU_CITIZEN',
    title: 'Vize Gerekmez',
    subtitle: 'AB / AEA / İsviçre — Serbest Dolaşım Hakkı',
    color: 'green',
    requirements: [
      'AB/AEA/İsviçre pasaportu veya kimlik kartı yeterlidir',
      "Almanya'ya serbest giriş ve çalışma hakkınız bulunmaktadır",
      "3 aydan uzun kalışlarda ikamet kaydı (Anmeldung) zorunludur",
    ],
    steps: [
      "Almanya'ya pasaportunuzla giriş yapın",
      "İlk 3 ay içinde Einwohnermeldeamt'a Anmeldung yaptırın",
      'Çalışmak için işvereniniz üzerinden sosyal sigorta kaydını tamamlayın',
    ],
    note: 'Ayrıca oturma izni (Aufenthaltstitel) almanıza gerek yoktur.',
  },
  {
    id: 'BLUE_CARD',
    title: 'EU Mavi Kart',
    subtitle: 'EU Blue Card — Yüksek Vasıflı Çalışan',
    color: 'blue',
    requirements: [
      'Almanya veya AB tarafından tanınmış üniversite diploması',
      'Yıllık brüt ≥ 45.300 € (kıtlık mesleklerinde ≥ 41.042 €)',
      'Türkiye mezunları için diplomanın anabin.de üzerinden teyidi',
      'Sağlık sigortası kanıtı',
    ],
    steps: [
      "Diplomanızın tanınırlığını anabin.de üzerinden kontrol edin",
      "Gerekiyorsa Statement of Comparability (KMK) belgesi alın",
      "Almanya Büyükelçiliği'ne ulusal vize başvurusu yapın",
      "Almanya'ya geldikten sonra Ausländerbehörde'den Mavi Kart alın",
    ],
    note: '21 ay B1 Almanca ile kalıcı oturma izni (Niederlassungserlaubnis) alabilirsiniz. Aile bireyleri çalışma izni almadan gelebilir.',
  },
  {
    id: 'FACHKRAFT_UNI',
    title: 'Fachkräftevisa',
    subtitle: 'Vasıflı Çalışan Vizesi — Üniversite Mezunu (§18b AufenthG)',
    color: 'blue',
    requirements: [
      'Tanınmış üniversite diploması (ilgili meslekte)',
      "Almanya'dan iş sözleşmesi (maaş alt sınırı yoktur)",
      'Diplomanın tanınması veya denklik belgesi',
    ],
    steps: [
      "Diplomanızı anabin.de ve uni-assist.de üzerinden kontrol edin",
      "İşvereninizden imzalı iş sözleşmesini temin edin",
      "Almanya Büyükelçiliği'ne §18b AufenthG kapsamında başvurun",
      "Almanya'ya geldikten sonra Aufenthaltstitel için kayıt yaptırın",
    ],
  },
  {
    id: 'FACHKRAFT_VOC',
    title: 'Fachkräftevisa',
    subtitle: 'Vasıflı Çalışan Vizesi — Mesleki Eğitim (§18a AufenthG)',
    color: 'blue',
    requirements: [
      "Almanya'da tanınan mesleki eğitim sertifikası (IHK, HWK vb.)",
      "Almanya'dan iş sözleşmesi",
      'Sertifikanın tanınması için ZAB veya ilgili kurum onayı',
    ],
    steps: [
      "Mesleki sertifikanızın tanınırlığını anerkennung-in-deutschland.de'den kontrol edin",
      'Tanınma başvurusu için belgeleri hazırlayın',
      "İşvereninizden iş sözleşmesini temin edin",
      "Almanya Büyükelçiliği'ne §18a AufenthG kapsamında başvurun",
    ],
  },
  {
    id: 'IT_SPECIALIST',
    title: 'BT Uzmanı Vizesi',
    subtitle: 'IT Specialist Visa — Diploma Şartı Yok (§19c AufenthG)',
    color: 'blue',
    requirements: [
      "BT alanında Almanya'dan iş sözleşmesi",
      'En az 3 yıl güncel BT deneyimi (yazılım, siber güvenlik, veri vb.)',
      'Diploma zorunlu değil — deneyim belgesi yeterlidir',
    ],
    steps: [
      'İşvereninizle iş sözleşmesi imzalayın',
      'Deneyim belgelerini hazırlayın (referans mektupları, eski sözleşmeler)',
      "Almanya Büyükelçiliği'ne §19c AufenthG kapsamında başvurun",
    ],
    note: '2023 yılında Almanya\'nın güncellenen göçmenlik yasasıyla (Fachkräfteeinwanderungsgesetz) kapsamı genişletilmiştir.',
  },
  {
    id: 'CHANCENKARTE',
    title: 'Chancenkarte',
    subtitle: 'Fırsat Kartı — Puan Sistemli İş Arama (§20a AufenthG)',
    color: 'yellow',
    requirements: [
      'Tanınmış üniversite diploması VEYA mesleki eğitim sertifikası',
      'En az 2 yıl mesleki deneyim (son 5 yıl içinde)',
      'Puan sistemi: Almanca dil (A1=1pt, B2=2pt), İngilizce B2 (1pt), Almanya bağlantısı (1pt), yaş <35 (1pt)',
      'Minimum 6 puan gereklidir',
      'Yeterli finansal kaynak (aylık ~1.100 €)',
    ],
    steps: [
      'Puan hesaplamasını make-it-in-germany.com üzerinden yapın',
      'Diplomanızın tanınırlığını teyit edin',
      'Finansal kaynak için bloke hesap açın',
      "Almanya Büyükelçiliği'ne başvurun",
      "Almanya'da 1 yıl içinde iş bulun ve Fachkräftevisa'ya geçin",
    ],
    note: "Kart süresince haftada 20 saat part-time çalışabilirsiniz. Almanya'ya gelmeden iş teklifi almanıza gerek yoktur.",
  },
  {
    id: 'JOB_SEEKER',
    title: 'İş Arama Vizesi',
    subtitle: 'Job Seeker Visa — 6 Aylık Keşif (§20 AufenthG)',
    color: 'yellow',
    requirements: [
      'Tanınmış üniversite diploması',
      'Finansal kaynak kanıtı (yaklaşık 6.600 €, 6 ay için)',
      'Sağlık sigortası',
      'Almanca veya İngilizce dil bilgisi (zorunlu değil, faydalı)',
    ],
    steps: [
      'Diplomanızın tanınırlığını kontrol edin',
      'Finansal kanıt için bloke hesap açın',
      "Almanya Büyükelçiliği'ne §20 AufenthG kapsamında başvurun",
      "6 ay içinde iş bularak Fachkräftevisa veya Blue Card'a geçiş yapın",
    ],
    note: '6 aylık süre uzatılamaz; süre dolmadan iş bulunması zorunludur.',
  },
  {
    id: 'JOB_SEEKER_VOC',
    title: 'İş Arama Vizesi',
    subtitle: 'Job Seeker Visa — Mesleki Eğitim Mezunu',
    color: 'yellow',
    requirements: [
      "Almanya'da tanınan mesleki eğitim sertifikası",
      'Finansal kaynak kanıtı',
      'Sağlık sigortası',
    ],
    steps: [
      'Mesleki sertifikanızın tanınırlığını anerkennung-in-deutschland.de ile teyit edin',
      'Finansal kanıt hazırlayın',
      "Almanya Büyükelçiliği'ne §20 AufenthG kapsamında başvurun",
      "Almanya'da iş bularak Fachkräftevisa'ya (§18a) geçiş yapın",
    ],
  },
  {
    id: 'STUDENT',
    title: 'Öğrenci Vizesi',
    subtitle: 'Studienvisum — Üniversite Öğrencileri',
    color: 'green',
    requirements: [
      "Almanya'daki bir üniversiteye kabul mektubu",
      'Yeterli finansal kaynak (bloke hesap: ~11.904 €/yıl)',
      'Sağlık sigortası',
      'Almanca veya İngilizce dil yeterlilik belgesi (programa göre)',
    ],
    steps: [
      "Almanya'da üniversiteye başvurun (uni-assist.de veya doğrudan)",
      'Kabul mektubunu alın',
      'Deutsche Bank veya benzer kurumda bloke hesap açın',
      "Almanya Büyükelçiliği'ne başvurun",
    ],
    note: 'Mezuniyet sonrası 18 aylık iş arama vizesiyle (§20 AufenthG) Almanya\'da kalabilirsiniz.',
  },
  {
    id: 'AUSBILDUNG',
    title: 'Ausbildung Vizesi',
    subtitle: 'Berufsausbildungsvisa — Mesleki Eğitim (§16a AufenthG)',
    color: 'green',
    requirements: [
      "Almanya'dan Ausbildungsvertrag (eğitim sözleşmesi)",
      'En az B1 Almanca dil seviyesi (çoğu program için)',
      'Sağlık sigortası',
    ],
    steps: [
      "make-it-in-germany.com üzerinden Ausbildung imkânlarını araştırın",
      'Firmalardan eğitim sözleşmesi temin edin',
      'Almanca dil sertifikası alın (Goethe veya telc B1)',
      "Almanya Büyükelçiliği'ne §16a AufenthG kapsamında başvurun",
    ],
    note: 'Eğitim süresince aylık 800–1.000 € maaş alırsınız. Bitirince doğrudan Fachkräftevisa\'ya geçiş yapılabilir.',
  },
  {
    id: 'FAMILY',
    title: 'Aile Birleşimi Vizesi',
    subtitle: "Familiennachzug — Almanya'daki Aileye Katılım",
    color: 'green',
    requirements: [
      "Almanya'da geçerli oturma izni olan eş veya ebeveyn",
      'Yeterli yaşam alanı ve gelir (sponsor)',
      'Temel Almanca (A1) dil bilgisi — eş için (bazı istisnalar geçerlidir)',
      'Evlilik cüzdanı veya doğum belgesi (apostilli)',
    ],
    steps: [
      "Almanya'daki yakınınızın oturma izni türünü teyit edin",
      'A1 Almanca sertifikası alın (Goethe veya telc)',
      'Apostilli belgeleri hazırlayın',
      "Almanya Büyükelçiliği'ne randevu alarak başvurun",
    ],
  },
  {
    id: 'RESEARCH',
    title: 'Araştırma Vizesi',
    subtitle: 'Forschungsvisum — Araştırmacılar ve Doktora Öğrencileri',
    color: 'green',
    requirements: [
      "Almanya'daki araştırma kurumuyla hosting anlaşması (Aufnahmevereinbarung)",
      'Üniversite veya doktora diploması',
      'Yeterli finansal destek (burs veya maaş)',
    ],
    steps: [
      "Almanya'daki üniversite veya araştırma enstitüsüyle iletişime geçin",
      'Hosting anlaşmasını imzalayın',
      "Almanya Büyükelçiliği'ne §18d veya §20 AufenthG kapsamında başvurun",
    ],
  },
  {
    id: 'SELF_EMPLOY',
    title: 'Serbest Meslek Vizesi',
    subtitle: 'Selbstständigkeitsvisa — Girişimci / Freelancer (§21 AufenthG)',
    color: 'orange',
    requirements: [
      'Detaylı iş planı (Businessplan)',
      'Sermaye veya finansal güvence',
      "Almanya ekonomisine katkı ve ekonomik gereklilik kanıtı",
      'Mesleki yeterlilik (ilgili sektöre göre değişir)',
    ],
    steps: [
      'Detaylı iş planı hazırlayın (Almanca tercih edilir)',
      'Finansal kanıt belgelerini toplayın',
      "Gerekiyorsa Almanya'daki ilgili ticaret odasıyla iletişime geçin",
      "Almanya Büyükelçiliği'ne §21 AufenthG kapsamında başvurun",
    ],
    note: 'Değerlendirme subjektiftir ve bireyden bireye farklılık gösterir. Profesyonel danışmanlık almanız önerilir.',
  },
  {
    id: 'LIMITED',
    title: 'Kısıtlı Seçenekler',
    subtitle: 'Mevcut profille doğrudan vize alma güçtür',
    color: 'red',
    requirements: [
      'Tanınmış diploma veya mesleki sertifika zorunludur',
      'İş teklifi olmadan başvuru neredeyse mümkün değildir',
    ],
    steps: [
      'Eğitim durumunuzu güçlendirin: diploma veya mesleki sertifika edinin',
      "Almanca öğrenerek Ausbildung başvurusunu değerlendirin",
      'make-it-in-germany.com adresinden kapsamlı rehber okuyun',
      'Bir göçmenlik danışmanıyla görüşün',
    ],
    note: 'Almanca öğrenerek Ausbildung başvurusu, uzun vadede en erişilebilir seçenek olabilir.',
  },
];

// --- Color system ---
const COLORS: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  blue:   { border: 'border-google-blue',   bg: 'bg-blue-50',   text: 'text-blue-900',   badge: 'bg-blue-100 text-blue-800' },
  green:  { border: 'border-google-green',  bg: 'bg-green-50',  text: 'text-green-900',  badge: 'bg-green-100 text-green-800' },
  yellow: { border: 'border-google-yellow', bg: 'bg-yellow-50', text: 'text-yellow-900', badge: 'bg-yellow-100 text-yellow-800' },
  orange: { border: 'border-google-orange', bg: 'bg-orange-50', text: 'text-orange-900', badge: 'bg-orange-100 text-orange-800' },
  red:    { border: 'border-google-red',    bg: 'bg-red-50',    text: 'text-red-900',    badge: 'bg-red-100 text-red-800' },
};

// --- Main Component ---
export default function VizeClient() {
  const [qId, setQId] = useState('Q01');
  const [history, setHistory] = useState<string[]>([]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showWhy, setShowWhy] = useState(false);

  const q = QUESTIONS.find(x => x.id === qId) ?? null;
  const visaResult = resultId ? (RESULTS.find(r => r.id === resultId) ?? null) : null;
  const qNum = history.length + 1;
  const progressPct = Math.min((history.length / 12) * 100, 95);

  const pick = (next: string) => {
    if (next.startsWith('RESULT:')) {
      setResultId(next.replace('RESULT:', ''));
    } else {
      setHistory(h => [...h, qId]);
      setQId(next);
    }
  };

  const goBack = () => {
    if (resultId) {
      setResultId(null);
      return;
    }
    if (history.length > 0) {
      setQId(history[history.length - 1]);
      setHistory(h => h.slice(0, -1));
    }
  };

  const reset = () => {
    setQId('Q01');
    setHistory([]);
    setResultId(null);
  };

  return (
    <div className="space-y-2">

      {/* Başlık + Nasıl Çalışır accordion */}
      <div
        className="bg-white rounded-xl border-2 border-google-blue overflow-hidden cursor-pointer select-none"
        onClick={() => setShowInfo(!showInfo)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-2xl font-bold leading-tight">Almanya Vize Seçim Aracı</h1>
            <div className="flex items-center gap-1 mt-0.5 text-google-blue font-medium text-sm">
              Nasıl Çalışır?
            </div>
          </div>
          <span className={cn('text-google-blue text-xl transition-transform duration-200', showInfo && 'rotate-180')}>▾</span>
        </div>
        {showInfo && (
          <div className="px-4 pb-4 bg-blue-50 border-t border-blue-200">
            <ul className="space-y-2 text-sm text-blue-800 pt-3">
              <li>• 10–13 kısa soruyla size en uygun vize tipini belirler.</li>
              <li>• Dallanmalı mantık: her cevap sizi doğru yönde ilerletir.</li>
              <li>• Sonuç bilgilendirme amaçlıdır; kesin karar için göçmenlik danışmanına başvurunuz.</li>
              <li>• Kaynak: 2024/2025 Almanya göçmenlik mevzuatı (AufenthG, Fachkräfteeinwanderungsgesetz).</li>
            </ul>
          </div>
        )}
      </div>

      {/* Bu araç neden var? */}
      <div
        className="bg-white rounded-xl border-2 border-google-green overflow-hidden cursor-pointer select-none"
        onClick={() => setShowWhy(!showWhy)}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <span className="font-semibold text-gray-900">Bu araç neden var?</span>
          <span className={cn('text-google-green text-xl transition-transform duration-200', showWhy && 'rotate-180')}>▾</span>
        </div>
        {showWhy && (
          <div className="px-4 pb-4 bg-green-50 border-t border-green-200">
            <p className="text-sm text-green-900 pt-3 leading-relaxed">
              Almanya'ya göç etmek isteyenler için en büyük belirsizliklerden biri hangi vize türüne başvurmaları gerektiğidir. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi, Ausbildung Vizesi… Her birinin farklı şartları ve süreçleri var. Bu araç, eğitim durumu, iş teklifi, maaş, deneyim ve hedef gibi temel değişkenleri sorarak size en uygun vize yolunu 10–13 soruda belirler ve ne yapmanız gerektiğini adım adım açıklar.
            </p>
          </div>
        )}
      </div>

      {/* Progress */}
      {!visaResult && (
        <div className="bg-white rounded-xl border-2 border-google-red px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-google-red">Soru {qNum}</span>
            <button onClick={reset} className="text-sm text-google-red hover:opacity-75">
              Sıfırla
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-google-red transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Question Card */}
      {!visaResult && q && (
        <div className="bg-white rounded-xl border-2 border-google-yellow p-5">
          <p className="text-gray-900 font-bold text-lg leading-tight mb-1">{q.text}</p>
          {q.hint && (
            <p className="text-gray-500 text-sm mb-4">{q.hint}</p>
          )}
          <div className="space-y-2 mt-4">
            {q.options.map(opt => (
              <button
                key={opt.key}
                onClick={() => pick(opt.next)}
                className="w-full text-left px-4 py-3 rounded-xl border-2 border-gray-200 bg-white hover:border-google-yellow hover:bg-yellow-50 text-gray-800 font-medium transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button
              onClick={goBack}
              className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Önceki soruya dön
            </button>
          )}
        </div>
      )}

      {/* Result Card */}
      {visaResult && (
        <ResultCard result={visaResult} onReset={reset} onBack={goBack} />
      )}

      {/* Persistent Ana Sayfaya Dön */}
      {!visaResult && (
        <Link
          href="/"
          className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          Ana Sayfaya Dön
        </Link>
      )}

    </div>
  );
}

// --- Result Card ---
function ResultCard({
  result,
  onReset,
  onBack,
}: {
  result: VisaResult;
  onReset: () => void;
  onBack: () => void;
}) {
  const c = COLORS[result.color] ?? COLORS.blue;

  return (
    <div className={cn('bg-white rounded-xl border-2 p-5', c.border)}>
      {/* Header */}
      <div className="mb-4">
        <span className={cn('inline-block text-xs font-semibold px-2 py-1 rounded-full mb-2', c.badge)}>
          Önerilen Vize Türü
        </span>
        <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
        <p className="text-gray-500 text-sm mt-1">{result.subtitle}</p>
      </div>

      {/* Requirements */}
      <div className={cn('rounded-xl p-4 mb-3', c.bg)}>
        <h3 className={cn('font-semibold text-sm mb-2', c.text)}>Temel Şartlar</h3>
        <ul className="space-y-1.5">
          {result.requirements.map((req, i) => (
            <li key={i} className={cn('text-sm flex items-start gap-2', c.text)}>
              <span className="mt-0.5 shrink-0">✓</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Steps */}
      <div className="rounded-xl p-4 bg-gray-50 mb-3">
        <h3 className="font-semibold text-sm mb-2 text-gray-700">Sonraki Adımlar</h3>
        <ol className="space-y-1.5">
          {result.steps.map((step, i) => (
            <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
              <span className="font-bold shrink-0 text-gray-400 w-4">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Note */}
      {result.note && (
        <div className="rounded-xl p-3 bg-yellow-50 border border-yellow-200 mb-4">
          <p className="text-sm text-yellow-800">💡 {result.note}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={onBack}
          className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
        >
          ← Son Soruya Dön
        </button>
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
        >
          Yeniden Başla
        </button>
        <Link
          href="/"
          className="w-full flex items-center justify-center rounded-xl border-2 border-google-yellow bg-google-yellow text-white font-semibold py-3 hover:opacity-90 transition-opacity"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
