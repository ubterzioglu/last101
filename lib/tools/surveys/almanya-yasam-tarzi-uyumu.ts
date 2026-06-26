import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const almanyaYasamTarziUyumuQuestionnaire = createToolQuestionnaireConfig(
  'almanya-yasam-tarzi-uyumu',
  [
    createSingleChoiceQuestion('tempo_preference', 'Günlük tempoda hız mı, sakinlik mi sana daha uygun?', weights[0], 'lifestyle', 'Profilin çekirdeği.', [
      { key: 'calm', label: 'Çok sakin', score: 20 },
      { key: 'balanced', label: 'Dengeli', score: 70 },
      { key: 'fast', label: 'Hızlı', score: 100 },
    ]),
    createLikertQuestion('social_contact_need', 'Sosyal çevre ve yeni insanlarla temas senin için ne kadar önemli?', weights[1], 'lifestyle', 'Metro ve dengeli ayrımı.'),
    createLikertQuestion('family_routine_center', 'Aile düzeni ve rutin senin için ne kadar merkezi?', weights[2], 'stability', 'Aile profili sinyali.'),
    createLikertQuestion('crowd_tolerance', 'Gürültü ve kalabalığa toleransın ne kadar yüksek?', weights[3], 'lifestyle', 'Büyük şehir uyumu.'),
    createLikertQuestion('nature_value', 'Doğa ve açık alan erişimi senin için ne kadar önemli?', weights[4], 'lifestyle', 'Sakin profil ayrımı.'),
    createLikertQuestion('everything_close_need', 'Her şeyin elinin altında olması senin için ne kadar önemli?', weights[5], 'fit', 'Metro tercihine işaret eder.'),
    createLikertQuestion('bureaucracy_patience', 'Bürokratik sabır ve sıra bekleme toleransın nasıl?', weights[6], 'stability', 'Günlük yaşam sürtünmesi.'),
    createSingleChoiceQuestion('weekend_rhythm', 'Hafta sonu idealin hangisine daha yakın?', weights[7], 'lifestyle', 'Yaşam ritmi göstergesi.', [
      { key: 'calm', label: 'Sakin dinlenme', score: 40 },
      { key: 'balanced', label: 'Dengeli', score: 70 },
      { key: 'active', label: 'Hareketli etkinlikler', score: 100 },
    ]),
    createLikertQuestion('neighborhood_order', 'Mahalle güveni ve düzeni senin için ne kadar kritik?', weights[8], 'stability', 'Aile ve sakin profil.'),
    createLikertQuestion('community_support_need', 'Topluluk desteği ve tanıdık çevre ihtiyacın ne kadar yüksek?', weights[9], 'support', 'Entegrasyon deneyimini etkiler.'),
    createSingleChoiceQuestion('home_location_tradeoff', 'Küçük ama merkezi ev mi, geniş ama dış bölgede ev mi sana daha yakın?', weights[10], 'fit', 'Yaşam tarzı tercihi.', [
      { key: 'spacious', label: 'Geniş ev', score: 40 },
      { key: 'balanced', label: 'Dengeli', score: 70 },
      { key: 'central', label: 'Merkezi konum', score: 100 },
    ]),
    createLikertQuestion('work_life_boundary', 'İş ve özel yaşam sınırını ne kadar sıkı tutmak istersin?', weights[11], 'stability', 'Günlük ritim dengesi.'),
    createLikertQuestion('seasonal_darkness', 'İklim ve mevsimsel karanlık seni ne kadar zorlar?', weights[12], 'lifestyle', 'Yaşam memnuniyetine etki eder.', true),
    createLikertQuestion('adaptation_speed', 'Yeni şeylere adapte olma hızını nasıl değerlendirirsin?', weights[13], 'execution', 'Uyum kabiliyeti.'),
    createSingleChoiceQuestion('independence_mode', 'Tek başına yaşamaya mı, daha destekli düzene mi yatkınsın?', weights[14], 'support', 'Uyum profili tamamlayıcısı.', [
      { key: 'supported', label: 'Daha destekli', score: 40 },
      { key: 'balanced', label: 'Dengeli', score: 70 },
      { key: 'independent', label: 'Tek başına', score: 100 },
    ]),
  ]
);
