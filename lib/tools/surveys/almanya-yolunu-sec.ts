import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

export const almanyaYolunuSecQuestionnaire = createToolQuestionnaireConfig(
  'almanya-yolunu-sec',
  [
    createLikertQuestion('goal_clarity', 'Almanya’ya gitmekteki ana amacın ne kadar net?', weights[0], 'fit', 'Rota netliği çekirdek sinyal.'),
    createSingleChoiceQuestion('offer_status', 'Elinde somut iş teklifi veya kabul mektubu var mı?', weights[1], 'feasibility', 'Başlangıç rotasını dramatik etkiler.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'progress', label: 'Süreçte', score: 50 },
      { key: 'yes', label: 'Var', score: 100 },
    ]),
    createLikertQuestion('qualification_clarity', 'Diploma veya mesleki yeterliliklerin ne kadar belirgin?', weights[2], 'feasibility', 'Tanınabilir profil önemlidir.'),
    createLikertQuestion('recognition_knowledge', 'Denklik veya tanınma gereksinimini ne kadar biliyorsun?', weights[3], 'readiness', 'Evrak uyumu rota seçimi için kritik.'),
    createSingleChoiceQuestion('german_level', 'Almanca seviyen şu an hangisine daha yakın?', weights[4], 'fit', 'Özellikle iş ve Ausbildung için belirleyici.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'a1_a2', label: 'A1/A2', score: 25 },
      { key: 'b1', label: 'B1', score: 60 },
      { key: 'b2_plus', label: 'B2+', score: 100 },
    ]),
    createSingleChoiceQuestion('english_strength', 'İngilizce ile profesyonel olarak ilerleyebilir misin?', weights[5], 'fit', 'Bazı rotalarda tamamlayıcı kaldıraç.', [
      { key: 'weak', label: 'Zayıf', score: 20 },
      { key: 'medium', label: 'Orta', score: 60 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createSingleChoiceQuestion('budget_runway', 'Taşınma ve ilk aylar için birikimin ne kadar yeterli?', weights[6], 'readiness', 'Finansman kırılganlığı azaltır.', [
      { key: 'under_1', label: '1 aydan az', score: 0 },
      { key: 'one_two', label: '1-2 ay', score: 40 },
      { key: 'three_five', label: '3-5 ay', score: 75 },
      { key: 'six_plus', label: '6 ay ve üstü', score: 100 },
    ]),
    createLikertQuestion('study_ausbildung_openness', 'Öğrencilik veya Ausbildung fikrine ne kadar açıksın?', weights[7], 'fit', 'Alternatif giriş yollarını etkiler.'),
    createSingleChoiceQuestion('freelance_portfolio', 'Freelance veya bağımsız çalışma için portföyün hazır mı?', weights[8], 'feasibility', 'Niş rota olasılığını ölçer.', [
      { key: 'no', label: 'Hayır', score: 0 },
      { key: 'partial', label: 'Kısmen', score: 50 },
      { key: 'yes', label: 'Evet', score: 100 },
    ]),
    createSingleChoiceQuestion('family_connection', 'Almanya’da aile veya partner bağlantın var mı?', weights[9], 'feasibility', 'Aile birleşimi hattını etkiler.', [
      { key: 'none', label: 'Yok', score: 0 },
      { key: 'light', label: 'Sınırlı', score: 40 },
      { key: 'strong', label: 'Güçlü', score: 100 },
    ]),
    createLikertQuestion('mobility_flexibility', 'Şehir, ülke veya rol değiştirerek başvurma esnekliğin ne kadar yüksek?', weights[10], 'fit', 'Şans kartı ve iş arama esnekliği önemlidir.'),
    createLikertQuestion('experience_proof', 'Mesleki deneyimini belgeleyebildiğini düşünüyor musun?', weights[11], 'feasibility', 'Uzman ve BT odaklı yollar için gereklidir.'),
    createLikertQuestion('legal_research', 'Hedef rotanın hukuki veya oturum tarafını ne kadar araştırdın?', weights[12], 'readiness', 'Yanlış rota riskini azaltır.'),
    createLikertQuestion('six_month_readiness', 'Önümüzdeki 6 ay içinde harekete geçmeye ne kadar hazırsın?', weights[13], 'readiness', 'Zamanlama ve uygulama ciddiyeti.'),
    createLikertQuestion('document_pack', 'CV, pasaport, diploma ve çeviri dosyan ne kadar hazır?', weights[14], 'readiness', 'Uygulanabilirlik kontrolü.'),
  ]
);
