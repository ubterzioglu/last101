import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const hangiSehirSanaUygunQuestionnaire = createToolQuestionnaireConfig(
  'hangi-sehir-sana-uygun',
  [
    createSingleChoiceQuestion('rent_flexibility', 'Kira bütçen ne kadar esnek?', weights[0], 'fit', 'Şehir filtresi için ana sinyal.', [
      { key: 'tight', label: 'Çok sıkı', score: 20 },
      { key: 'medium', label: 'Orta', score: 60 },
      { key: 'flex', label: 'Esnek', score: 100 },
    ]),
    createLikertQuestion('big_city_desire', 'Büyük şehir temposuna isteğin ne kadar yüksek?', weights[1], 'lifestyle', 'Berlin veya Münih tipi uyumu belirler.'),
    createLikertQuestion('international_need', 'Uluslararası ve çok kültürlü çevre senin için ne kadar önemli?', weights[2], 'fit', 'Şehir profili eşleşmesinde güçlü.'),
    createLikertQuestion('family_calm_need', 'Aile düzeni ve sakinlik ihtiyacın ne kadar yüksek?', weights[3], 'lifestyle', 'Aile odaklı profil ayrımı.'),
    createLikertQuestion('social_nightlife_value', 'Gece hayatı ve sosyal hareketlilik senin için ne kadar değerli?', weights[4], 'lifestyle', 'Metro profilini etkiler.'),
    createSingleChoiceQuestion('commute_tradeoff', 'Kısa işe gidiş geliş mi yoksa daha düşük kira mı seni daha çok çeker?', weights[5], 'fit', 'Trade-off tercihini ölçer.', [
      { key: 'rent', label: 'Daha düşük kira', score: 25 },
      { key: 'balanced', label: 'Denge', score: 60 },
      { key: 'commute', label: 'Kısa ulaşım', score: 100 },
    ]),
    createLikertQuestion('turkish_community_need', 'Türk topluluğuna yakın olmak senin için ne kadar önemli?', weights[6], 'support', 'Sosyal destek faktörü.'),
    createLikertQuestion('green_access', 'Doğa ve yeşil alan erişimi senin için ne kadar önemli?', weights[7], 'lifestyle', 'Sakin ve dengeli profil ayrımı.'),
    createBooleanQuestion('car_free_life', 'Araba olmadan yaşamayı tercih eder misin?', weights[8], 'fit', 'Ulaşım altyapısı ile ilişkili.'),
    createLikertQuestion('housing_competition_tolerance', 'Konut bulma rekabetine toleransın ne kadar yüksek?', weights[9], 'stability', 'Büyük merkezlere uyum göstergesi.'),
    createLikertQuestion('lower_salary_lower_cost', 'Daha düşük ücret ama daha düşük gider senaryosuna ne kadar açıksın?', weights[10], 'fit', 'İkincil şehir tercihini ölçer.'),
    createLikertQuestion('grey_weather_tolerance', 'İklim ve gri hava seni ne kadar zorlar?', weights[11], 'lifestyle', 'Kuzey ve şehir seçimi üzerinde etkili.', true),
    createSingleChoiceQuestion('remote_work_option', 'Uzaktan veya hibrit çalışma olasılığın ne kadar yüksek?', weights[12], 'feasibility', 'Şehir seçeneklerini genişletir.', [
      { key: 'none', label: 'Yok', score: 20 },
      { key: 'partial', label: 'Kısmi', score: 60 },
      { key: 'yes', label: 'Yüksek', score: 100 },
    ]),
    createBooleanQuestion('school_priority', 'Çocuk, okul veya kita önceliğin var mı?', weights[13], 'support', 'Aile profili eşleşmesi.'),
    createLikertQuestion('relocation_retry', 'Şehir değiştirip tekrar denemeye açıklığın ne kadar yüksek?', weights[14], 'feasibility', 'İlk eşleşmeden sapma toleransı.'),
  ]
);
