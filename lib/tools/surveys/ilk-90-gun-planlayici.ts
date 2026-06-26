import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const ilk90GunPlanlayiciQuestionnaire = createToolQuestionnaireConfig(
  'ilk-90-gun-planlayici',
  [
    createLikertQuestion('arrival_reason_clarity', 'Almanya’ya geliş nedenin ne kadar net?', weights[0], 'planning', 'İş akışını belirler.'),
    createSingleChoiceQuestion('first_address_certainty', 'İlk konaklama adresin ne kadar kesinleşti?', weights[1], 'readiness', 'Anmeldung ve diğer adımları etkiler.', [
      { key: 'unclear', label: 'Belirsiz', score: 0 },
      { key: 'temporary', label: 'Geçici', score: 50 },
      { key: 'final', label: 'Kesin', score: 100 },
    ]),
    createLikertQuestion('anmeldung_knowledge', 'Anmeldung sürecine dair bilgi düzeyin nedir?', weights[2], 'planning', 'İlk kritik operasyon adımı.'),
    createBooleanQuestion('insurance_fixed', 'Sağlık sigortası durumunu netleştirdin mi?', weights[3], 'readiness', 'Birçok sonraki işlem için temel.'),
    createLikertQuestion('bank_account_plan', 'Banka hesabı açma ihtiyacın ve planın ne kadar net?', weights[4], 'planning', 'Finans operasyonu.'),
    createLikertQuestion('residence_timeline', 'Oturum veya randevu takvimini ne kadar biliyorsun?', weights[5], 'planning', 'Zaman baskısını azaltır.'),
    createBooleanQuestion('first_week_folder', 'Belgelerini ilk hafta kullanımı için ayrı klasörledin mi?', weights[6], 'execution', 'Uygulama kolaylığı.'),
    createLikertQuestion('utility_basics_plan', 'Telefon hattı, internet ve ulaşım gibi temel işler için planın var mı?', weights[7], 'execution', 'Günlük işleyiş hazırlığı.'),
    createSingleChoiceQuestion('family_steps', 'Çocuk, kita veya okul gibi aile adımların ne kadar planlı?', weights[8], 'support', 'Aileli kullanıcılar için kritik.', [
      { key: 'none', label: 'Bu ihtiyaç yok', score: 100 },
      { key: 'partial', label: 'Kısmen planlı', score: 60 },
      { key: 'no_plan', label: 'Plan yok', score: 0 },
    ]),
    createBooleanQuestion('ninety_day_budget', 'İlk 90 gün bütçeni çıkardın mı?', weights[9], 'readiness', 'Operasyonel güvenlik.'),
    createLikertQuestion('appointment_research', 'Yerel resmi dairelerin randevu zorluğunu araştırdın mı?', weights[10], 'planning', 'Gerçekçiliği artırır.'),
    createLikertQuestion('dependency_awareness', 'Hangi işin hangisine bağlı olduğunu ne kadar biliyorsun?', weights[11], 'planning', 'Sıralama kalitesi.'),
    createSingleChoiceQuestion('arrival_support', 'Varış sonrası destek alabileceğin biri var mı?', weights[12], 'support', 'İlk gün direncini artırır.', [
      { key: 'none', label: 'Yok', score: 25 },
      { key: 'partial', label: 'Kısmen', score: 60 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createBooleanQuestion('first_week_roles', 'Şehre vardığında ilk hafta görev dağılımı yaptın mı?', weights[13], 'execution', 'Özellikle aileli gelişlerde önemli.'),
    createBooleanQuestion('written_ninety_day_plan', 'İlk 90 gün için yazılı bir mini planın hazır mı?', weights[14], 'planning', 'Planın uygulanabilirliği.'),
  ]
);
