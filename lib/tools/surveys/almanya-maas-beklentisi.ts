import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const almanyaMaasBeklentisiQuestionnaire = createToolQuestionnaireConfig(
  'almanya-maas-beklentisi',
  [
    createLikertQuestion('profession_clarity', 'Ana meslek grubunun piyasa karşılığı senin için ne kadar net?', weights[0], 'market', 'Taban maaşın ana belirleyicisi.'),
    createSingleChoiceQuestion('experience_band', 'Deneyim seviyen hangi banda daha yakın?', weights[1], 'market', 'Seniority pazarlığı belirler.', [
      { key: 'junior', label: '0-2 yıl', score: 35 },
      { key: 'mid', label: '3-5 yıl', score: 70 },
      { key: 'senior', label: '6+ yıl', score: 100 },
    ]),
    createLikertQuestion('city_clarity', 'Hedeflediğin şehir tipi veya lokasyon profili ne kadar net?', weights[2], 'market', 'Lokasyon maliyet baskısını belirler.'),
    createLikertQuestion('gross_net_knowledge', 'Brüt ve net maaş farkını ne kadar iyi biliyorsun?', weights[3], 'readiness', 'Beklenti hatasını azaltır.'),
    createSingleChoiceQuestion('market_comparison', 'Mevcut veya son maaşını Alman piyasasıyla kıyasladın mı?', weights[4], 'market', 'Anchoring hatasını azaltır.', [
      { key: 'no', label: 'Hayır', score: 0 },
      { key: 'partial', label: 'Kısmen', score: 50 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createLikertQuestion('benefits_awareness', 'Yan hakları toplam paket içinde ne kadar hesaba katıyorsun?', weights[5], 'readiness', 'Karar kalite sinyali.'),
    createLikertQuestion('currency_translation_bias', 'Türkiye veya başka ülke maaşını doğrudan çevirmeye ne kadar eğilimlisin?', weights[6], 'readiness', 'Yanlış kıyas riskini ölçer.', true),
    createSingleChoiceQuestion('tax_household_knowledge', 'Hane yapının vergi etkisini ne kadar biliyorsun?', weights[7], 'readiness', 'Net gelir tahmini için kritik.', [
      { key: 'unknown', label: 'Bilmiyorum', score: 25 },
      { key: 'rough', label: 'Kabaca biliyorum', score: 60 },
      { key: 'clear', label: 'Net biliyorum', score: 100 },
    ]),
    createLikertQuestion('role_negotiation', 'Pazarlıkta rol kapsamı ve sorumluluğu ne kadar kullanabiliyorsun?', weights[8], 'execution', 'Salt rakam yerine değer pazarlığı.'),
    createSingleChoiceQuestion('remote_flexibility', 'Uzaktan veya hibrit çalışma esnekliğin ne kadar yüksek?', weights[9], 'execution', 'Şehir maliyeti baskısını dengeler.', [
      { key: 'none', label: 'Yok', score: 20 },
      { key: 'partial', label: 'Kısmi', score: 60 },
      { key: 'high', label: 'Yüksek', score: 100 },
    ]),
    createLikertQuestion('language_salary_link', 'Almanca seviyenin maaş beklentini nasıl etkilediğini ne kadar biliyorsun?', weights[10], 'market', 'Rol seviyesiyle ilişkilidir.'),
    createLikertQuestion('bonus_ask_comfort', 'Taşınma desteği, bonus veya ek hakları isteme konforun ne kadar yüksek?', weights[11], 'execution', 'Toplam paketi artırır.'),
    createLikertQuestion('listing_tracking', 'Hedef sektöründeki benzer ilanları düzenli takip ediyor musun?', weights[12], 'market', 'Piyasa gerçekçiliği.'),
    createSingleChoiceQuestion('rent_costing', 'Yaşam maliyeti baskısını kira üzerinden ayrıca hesaplıyor musun?', weights[13], 'readiness', 'Şehir seçimiyle bağlantılı.', [
      { key: 'no', label: 'Hayır', score: 0 },
      { key: 'rough', label: 'Kabaca', score: 60 },
      { key: 'detailed', label: 'Detaylı', score: 100 },
    ]),
    createBooleanQuestion('annual_gross_ready', 'Maaş beklentini yıllık brüt olarak ifade etmeye hazır mısın?', weights[14], 'execution', 'Almanya pazarıyla uyum.'),
  ]
);
