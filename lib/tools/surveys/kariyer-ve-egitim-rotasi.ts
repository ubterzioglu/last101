import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const kariyerVeEgitimRotasiQuestionnaire = createToolQuestionnaireConfig(
  'kariyer-ve-egitim-rotasi',
  [
    createSingleChoiceQuestion('education_base', 'Eğitim geçmişin hangi rota için daha güçlü temel veriyor?', weights[0], 'fit', 'Rota tabanı.', [
      { key: 'weak', label: 'Zayıf temel', score: 20 },
      { key: 'vocational', label: 'Mesleki temel', score: 70 },
      { key: 'university', label: 'Üniversite temeli', score: 100 },
    ]),
    createLikertQuestion('income_urgency', 'Hızlı gelir elde etme ihtiyacın ne kadar yüksek?', weights[1], 'planning', 'İş ile eğitim ayrımını etkiler.'),
    createLikertQuestion('language_sufficiency', 'Almanca seviyen eğitim veya iş hedefin için ne kadar yeterli?', weights[2], 'feasibility', 'Hem iş hem eğitim için kritik.'),
    createLikertQuestion('recognition_clarity', 'Denklik gereksinimini ne kadar netleştirdin?', weights[3], 'feasibility', 'Özellikle düzenlenmiş mesleklerde önemli.'),
    createSingleChoiceQuestion('learning_style', 'Uygulamalı öğrenmeye mi, akademik öğrenmeye mi daha yatkınsın?', weights[4], 'fit', 'Yol tipini belirler.', [
      { key: 'academic', label: 'Akademik', score: 100 },
      { key: 'balanced', label: 'Dengeli', score: 70 },
      { key: 'practical', label: 'Uygulamalı', score: 100 },
    ]),
    createLikertQuestion('long_term_goal', 'Almanya’daki uzun vadeli hedefin ne kadar net?', weights[5], 'planning', 'Rota sıralamasını etkiler.'),
    createSingleChoiceQuestion('education_cost_capacity', 'Birkaç yıl daha eğitimde kalmanın maliyetini kaldırabilir misin?', weights[6], 'feasibility', 'Yüksek lisans veya uzun eğitim fizibilitesi.', [
      { key: 'no', label: 'Hayır', score: 0 },
      { key: 'partial', label: 'Kısmen', score: 50 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createLikertQuestion('ausbildung_openness', 'Ausbildung seçeneğine ne kadar açıksın?', weights[7], 'fit', 'Alternatif giriş hattı.'),
    createLikertQuestion('portfolio_strength', 'Mesleki portföy ve deneyimini ne kadar gösterebiliyorsun?', weights[8], 'execution', 'Doğrudan iş hattı için önemli.'),
    createLikertQuestion('location_role_flexibility', 'Şehir ve rol esnekliğin ne kadar yüksek?', weights[9], 'execution', 'İşe giriş fırsatlarını artırır.'),
    createSingleChoiceQuestion('offer_proximity', 'Şu anda kabul veya teklif yakınlığın hangi seviyede?', weights[10], 'feasibility', 'Rota gerçekçiliği.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'progress', label: 'Süreçte', score: 50 },
      { key: 'yes', label: 'Var', score: 100 },
    ]),
    createBooleanQuestion('post_study_plan', 'Öğrenim sonrası işe geçiş planın var mı?', weights[11], 'planning', 'Eğitim yatırımının sürdürülebilirliği.'),
    createLikertQuestion('prep_patience', 'Kısa vadede hazırlık rotasıyla ilerlemeye sabrın var mı?', weights[12], 'planning', 'Ön hazırlık stratejisi.'),
    createLikertQuestion('career_change_openness', 'Kariyer değişimine ne kadar açıksın?', weights[13], 'fit', 'Esneklik ölçer.'),
    createLikertQuestion('sustainable_route_preference', 'Çabuk giriş yerine daha sürdürülebilir rotayı seçebilir misin?', weights[14], 'planning', 'Uzun vadeli uyumu artırır.'),
  ]
);
