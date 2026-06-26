import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const toplulukVeDanismanlikQuestionnaire = createToolQuestionnaireConfig(
  'topluluk-ve-danismanlik',
  [
    createLikertQuestion('need_clarity', 'En acil ihtiyacın ne kadar net tanımlı?', weights[0], 'support', 'Doğru kanala yönlendirmeyi belirler.'),
    createSingleChoiceQuestion('formal_complexity', 'Sorunun hukuki veya resmi karmaşıklığı hangi düzeyde?', weights[1], 'support', 'Kanal seçimini etkiler.', [
      { key: 'low', label: 'Düşük', score: 25 },
      { key: 'medium', label: 'Orta', score: 60 },
      { key: 'high', label: 'Yüksek', score: 100 },
    ]),
    createLikertQuestion('multilingual_need', 'Türkçe veya çok dilli destek senin için ne kadar kritik?', weights[2], 'support', 'MBE ve topluluk tercihini etkiler.'),
    createSingleChoiceQuestion('service_mode', 'Yerel yüz yüze destek mi, online yön bulma mı istiyorsun?', weights[3], 'support', 'Servis erişim modeli.', [
      { key: 'online', label: 'Online', score: 40 },
      { key: 'balanced', label: 'Fark etmez', score: 70 },
      { key: 'local', label: 'Yüz yüze', score: 100 },
    ]),
    createLikertQuestion('urgency_pressure', 'Sorunun zaman baskısı ne kadar yüksek?', weights[4], 'planning', 'Önceliklendirme ve yönlendirme.'),
    createLikertQuestion('document_preparation', 'Belgelerini danışmanlığa götürecek kadar hazırladın mı?', weights[5], 'execution', 'Destek verimliliği.'),
    createBooleanQuestion('channel_difference', 'Resmi kurum ile topluluk desteği arasındaki farkı biliyor musun?', weights[6], 'support', 'Yanlış beklenti riskini azaltır.'),
    createLikertQuestion('privacy_need', 'Mahremiyet veya anonimlik ihtiyacın ne kadar yüksek?', weights[7], 'support', 'Kanal türünü etkiler.'),
    createBooleanQuestion('family_support_need', 'Aile, çocuk veya okul temalı desteğe ihtiyacın var mı?', weights[8], 'support', 'Aile odaklı yönlendirme sinyali.'),
    createBooleanQuestion('career_support_need', 'İş, CV veya başvuru yönlü desteğe ihtiyacın var mı?', weights[9], 'support', 'İş piyasası kanalı için işaret.'),
    createBooleanQuestion('recognition_support_need', 'Denklik veya diploma konulu desteğe ihtiyacın var mı?', weights[10], 'support', 'Resmi başvuru yönlendirmesi.'),
    createBooleanQuestion('integration_support_need', 'Entegrasyon ve günlük yaşama uyum desteğine ihtiyacın var mı?', weights[11], 'support', 'BAMF veya MBE sinyali.'),
    createLikertQuestion('written_contact_comfort', 'Destek hattına yazılı veya online başvuru yapma konforun ne kadar yüksek?', weights[12], 'execution', 'Kanal erişilebilirliği.'),
    createLikertQuestion('follow_up_discipline', 'Takip ve ikinci başvuru yapma disiplinin nasıl?', weights[13], 'execution', 'Sürdürülebilirlik için gerekli.'),
    createLikertQuestion('multi_channel_capacity', 'Aynı anda birden fazla destek kanalını yönetebilir misin?', weights[14], 'execution', 'Çok kanallı destek kullanımı.'),
  ]
);
