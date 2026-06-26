import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const onceHangiSorunuCozmelisinQuestionnaire = createToolQuestionnaireConfig(
  'once-hangi-sorunu-cozmelisin',
  [
    createLikertQuestion('pressure_clarity', 'Şu an seni en çok zorlayan baskı ne kadar net?', weights[0], 'priority', 'Öncelik netliği çekirdek unsur.'),
    createSingleChoiceQuestion('deadline_pressure', 'Somut teklif, kabul veya vize tarihi baskın mı?', weights[1], 'priority', 'Aciliyet yönünü belirler.', [
      { key: 'no', label: 'Hayır', score: 20 },
      { key: 'partial', label: 'Kısmen', score: 60 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createLikertQuestion('financial_block', 'Finansman eksikliği seni ne kadar kilitliyor?', weights[2], 'priority', 'Sık blokaj alanı.'),
    createLikertQuestion('housing_uncertainty', 'Konut veya yerleşim belirsizliği ne kadar yüksek?', weights[3], 'priority', 'İlk adım bağımlılıkları yaratır.'),
    createLikertQuestion('language_drag', 'Dil eksikliği hedeflerini ne kadar yavaşlatıyor?', weights[4], 'priority', 'Çoğu rotada temel bariyer.'),
    createBooleanQuestion('recognition_block', 'Denklik veya diploma belirsizliği yaşıyor musun?', weights[5], 'priority', 'Resmi süreç açısından kritik.'),
    createLikertQuestion('document_scatter', 'Evrak dağınıklığı seni ne kadar yavaşlatıyor?', weights[6], 'priority', 'Görünmez ama etkili blokaj.'),
    createLikertQuestion('focus_capacity', 'Bir probleme iki hafta odaklanıp diğerlerini bekletebilir misin?', weights[7], 'execution', 'Odak yönetimi kapasitesi.'),
    createSingleChoiceQuestion('support_access', 'Destek alabileceğin bir kişi veya kanal var mı?', weights[8], 'support', 'Blokaj çözüm hızını etkiler.', [
      { key: 'none', label: 'Yok', score: 20 },
      { key: 'partial', label: 'Kısmi', score: 60 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createLikertQuestion('error_tolerance', 'Hata yapma lüksünün ne kadar düşük olduğunu hissediyorsun?', weights[9], 'priority', 'Risk iştahını ölçer.'),
    createBooleanQuestion('official_deadline', 'Son tarihi olan resmi bir işin var mı?', weights[10], 'priority', 'Önceliklendirme baskısı.'),
    createLikertQuestion('mental_energy', 'Psikolojik enerji ve odak seviyeni nasıl değerlendirirsin?', weights[11], 'execution', 'Uygulanabilirliği etkiler.'),
    createSingleChoiceQuestion('simultaneous_blocks', 'Aynı anda kaç büyük sorunu taşıyorsun?', weights[12], 'priority', 'Dağınıklık derecesi.', [
      { key: 'one', label: '1', score: 100 },
      { key: 'two', label: '2', score: 70 },
      { key: 'three_plus', label: '3 veya daha fazla', score: 30 },
    ]),
    createLikertQuestion('unlock_logic', 'Önce hangisi çözülürse diğerleri açılır mantığını kurabiliyor musun?', weights[13], 'planning', 'Sistem düşüncesi.'),
    createBooleanQuestion('written_block_list', 'Yazılı bir blokaj listesi yaptın mı?', weights[14], 'planning', 'Öncelik netliğini destekler.'),
  ]
);
