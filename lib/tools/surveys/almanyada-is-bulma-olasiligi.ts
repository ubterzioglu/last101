import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const almanyadaIsBulmaOlasiligiQuestionnaire = createToolQuestionnaireConfig(
  'almanyada-is-bulma-olasiligi',
  [
    createSingleChoiceQuestion('market_match', 'Meslek grubunun Almanya talebiyle eşleşmesi ne kadar güçlü?', weights[0], 'competition', 'En kritik piyasa sinyali.', [
      { key: 'low', label: 'Düşük', score: 25 },
      { key: 'medium', label: 'Orta', score: 60 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createSingleChoiceQuestion('experience_strength', 'Toplam deneyim süren hangi seviyeye daha yakın?', weights[1], 'competition', 'İşveren güvenini etkiler.', [
      { key: 'junior', label: '0-2 yıl', score: 30 },
      { key: 'mid', label: '3-5 yıl', score: 70 },
      { key: 'senior', label: '6+ yıl', score: 100 },
    ]),
    createSingleChoiceQuestion('german_job_readiness', 'Almanca seviyen iş başvuruları için ne kadar yeterli?', weights[2], 'competition', 'İşe girişte belirleyici.', [
      { key: 'no', label: 'Yetersiz', score: 0 },
      { key: 'basic', label: 'Temel', score: 40 },
      { key: 'good', label: 'İyi', score: 75 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createSingleChoiceQuestion('english_job_readiness', 'İngilizce ile profesyonel olarak ilerleyebilir misin?', weights[3], 'competition', 'Özellikle uluslararası roller için önemlidir.', [
      { key: 'weak', label: 'Zayıf', score: 20 },
      { key: 'medium', label: 'Orta', score: 60 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createLikertQuestion('recognition_status', 'Denklik veya tanınma durumun ne kadar net?', weights[4], 'feasibility', 'Belirsizlik güveni düşürür.'),
    createLikertQuestion('cv_linkedin_ready', 'CV ve LinkedIn profilin Alman pazarına ne kadar hazır?', weights[5], 'execution', 'Başvuru kalitesi sinyali.'),
    createSingleChoiceQuestion('proof_of_work', 'Portföy, referans veya proje kanıtların ne kadar güçlü?', weights[6], 'execution', 'Özellikle teknik alanlarda önemli.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'partial', label: 'Kısmen', score: 50 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createLikertQuestion('location_role_flexibility', 'Şehir ve rol esnekliğin ne kadar yüksek?', weights[7], 'competition', 'Fırsat hacmini artırır.'),
    createLikertQuestion('salary_realism', 'Maaş beklentini piyasa gerçekliğine göre ayarlayabiliyor musun?', weights[8], 'execution', 'Aşırı beklenti riskini azaltır.'),
    createLikertQuestion('weekly_application_discipline', 'Haftalık başvuru disiplini kurabiliyor musun?', weights[9], 'execution', 'Süreç verimliliği için gerekli.'),
    createLikertQuestion('interview_practice', 'Mülakat pratiğini nasıl değerlendirirsin?', weights[10], 'execution', 'Son mile etkili.'),
    createLikertQuestion('work_route_clarity', 'Yasal çalışma rotanın ne kadar net olduğunu düşünüyorsun?', weights[11], 'feasibility', 'İşveren açısından kritik.'),
    createLikertQuestion('network_usage', 'Networking ve referans kanallarını ne kadar kullanıyorsun?', weights[12], 'competition', 'İlan dışı erişimi artırır.'),
    createSingleChoiceQuestion('move_timing', 'İşe başlamak için taşınma zamanlaman ne kadar uygun?', weights[13], 'feasibility', 'İşveren güvenini etkiler.', [
      { key: 'unclear', label: 'Belirsiz', score: 25 },
      { key: 'near', label: 'Yakın', score: 70 },
      { key: 'ready', label: 'Hazır', score: 100 },
    ]),
    createLikertQuestion('niche_advantage', 'Niş uzmanlık veya ayırt edici bir alanın olduğunu düşünüyor musun?', weights[14], 'competition', 'Rekabet avantajı.'),
  ]
);
