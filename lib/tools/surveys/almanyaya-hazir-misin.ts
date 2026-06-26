import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const almanyayaHazirMisinQuestionnaire = createToolQuestionnaireConfig(
  'almanyaya-hazir-misin',
  [
    createSingleChoiceQuestion('passport_ready', 'Pasaport ve temel kimlik evrakların ne kadar hazır?', weights[0], 'readiness', 'Temel giriş bariyeri.', [
      { key: 'no', label: 'Hazır değil', score: 0 },
      { key: 'partial', label: 'Kısmen hazır', score: 50 },
      { key: 'yes', label: 'Hazır', score: 100 },
    ]),
    createLikertQuestion('application_pack', 'Diploma, sertifika, CV ve başvuru paketini ne kadar toparladın?', weights[1], 'readiness', 'Başvuru omurgası.'),
    createLikertQuestion('translation_apostille', 'Yeminli çeviri ve apostil ihtiyacını ne kadar netleştirdin?', weights[2], 'readiness', 'Süreç gecikmesini azaltır.'),
    createSingleChoiceQuestion('target_language_readiness', 'Almanca hazırlığın hedef rotana ne kadar yeterli?', weights[3], 'feasibility', 'Dil açığı kritik risk.', [
      { key: 'no', label: 'Yetersiz', score: 0 },
      { key: 'borderline', label: 'Sınırda', score: 50 },
      { key: 'yes', label: 'Yeterli', score: 100 },
    ]),
    createSingleChoiceQuestion('financial_buffer', 'Taşınma ve ilk aylar için finansal tamponun ne kadar güçlü?', weights[4], 'readiness', 'Finansman kırılmasını önler.', [
      { key: 'under_1', label: '1 aydan az', score: 0 },
      { key: 'one_two', label: '1-2 ay', score: 40 },
      { key: 'three_five', label: '3-5 ay', score: 75 },
      { key: 'six_plus', label: '6 ay ve üstü', score: 100 },
    ]),
    createLikertQuestion('housing_plan', 'İlk konaklama planın ne kadar net?', weights[5], 'readiness', 'Varış sonrası sürtünmeyi belirler.'),
    createLikertQuestion('insurance_knowledge', 'Sağlık sigortası yükümlülüğünü ne kadar biliyorsun?', weights[6], 'execution', 'Operasyonel hazırlık göstergesi.'),
    createBooleanQuestion('recognition_need_clear', 'Denklik gerekip gerekmediğini biliyor musun?', weights[7], 'feasibility', 'Kritik karar noktası.'),
    createLikertQuestion('timeline_realism', 'Hedef çizelgenin gerçekçi olduğunu düşünüyor musun?', weights[8], 'planning', 'Süre yönetimi için önemli.'),
    createLikertQuestion('appointment_tracking', 'Randevu ve resmi işlem takibini düzenli yapıyor musun?', weights[9], 'execution', 'Uygulama disiplini.'),
    createBooleanQuestion('arrival_checklist', 'Almanya’ya gider gitmez yapacaklarını yazılı listeledin mi?', weights[10], 'planning', 'Karışıklığı azaltır.'),
    createSingleChoiceQuestion('family_documents', 'Aile üyeleri için ayrı evrak ihtiyacını ne kadar çıkardın?', weights[11], 'readiness', 'Aileli senaryolarda blokaj yaratır.', [
      { key: 'not_needed', label: 'Gerekmiyor', score: 100 },
      { key: 'partial', label: 'Kısmen', score: 50 },
      { key: 'no', label: 'Henüz çıkarmadım', score: 0 },
    ]),
    createSingleChoiceQuestion('emergency_buffer', 'Acil durumlar için ek maddi tamponun var mı?', weights[12], 'stability', 'Operasyonel dayanıklılık.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'some', label: 'Bir miktar', score: 60 },
      { key: 'enough', label: 'Yeterli', score: 100 },
    ]),
    createLikertQuestion('biggest_gap_awareness', 'Hangi eksiğin seni en çok yavaşlatacağını ne kadar net biliyorsun?', weights[13], 'planning', 'Önceliklendirme kalitesi.'),
    createSingleChoiceQuestion('support_network', 'Süreçte destek alabileceğin bir kişi veya kurum var mı?', weights[14], 'support', 'Destek ağı riski düşürür.', [
      { key: 'none', label: 'Yok', score: 25 },
      { key: 'partial', label: 'Kısmi', score: 60 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
  ]
);
