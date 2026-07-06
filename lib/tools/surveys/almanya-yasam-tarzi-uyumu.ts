import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const almanyaYasamTarziUyumuQuestionnaire = createToolQuestionnaireConfig(
  "almanya-yasam-tarzi-uyumu",
  [
    createSingleChoiceQuestion("weekend_style", "Yeni bir şehirde ilk hafta sonu ne yaparsın?", weights[0], "lifestyle", "Yeni bir şehirde ilk hafta sonu ne yaparsın?", [
      { key: "network_event", label: "Bir networking etkinliğine giderim", score: 100 },
      { key: "museum_walk", label: "Müze/şehir turu yaparım", score: 75 },
      { key: "hiking", label: "Doğaya/yürüyüşe çıkarım", score: 50 },
      { key: "family_market", label: "Aileyle pazar/market gezerim", score: 25 },
      { key: "quiet_cafe", label: "Sakin bir kafede vakit geçiririm", score: 0 },
    ]),
    createLikertQuestion("social_energy", "Yeni insanlarla tanışmak sana nasıl gelir?", weights[1], "lifestyle", "1 = zorlayıcı, 5 = enerji verici"),
    createLikertQuestion("planning_style", "Planlı mısın spontane mi?", weights[2], "lifestyle", "1 = planlı, 5 = spontane"),
    createLikertQuestion("local_language", "Yerel dili yanlış yaparak konuşmayı dener misin?", weights[3], "lifestyle", "1 = denemem, 5 = hep denerim"),
    createLikertQuestion("community_need", "Kendi kültüründen insanlarla bağ kurma ihtiyacın?", weights[4], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("comfort_zone", "Konfor alanından çıkma isteğin?", weights[5], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("career_focus", "Taşınmada kariyer/network odağın?", weights[6], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("family_rhythm", "Aile ve rutin odaklı yaşam sana ne kadar uygun?", weights[7], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("city_vs_nature", "Büyük şehir mi doğa/sakinlik mi?", weights[8], "lifestyle", "1 = doğa, 5 = şehir"),
    createSingleChoiceQuestion("sharing", "Sonucunu toplulukla paylaşmak ister misin?", weights[9], "lifestyle", "Sonucunu toplulukla paylaşmak ister misin?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createLikertQuestion("travel_frequency", "Yeni yerleştiğin ülkede/bölgede sık seyahat eder misin?", weights[10], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("remote_vs_office_pref", "Uzaktan mı ofis/saha mı çalışmayı tercih edersin?", weights[11], "lifestyle", "1 = ofis/saha, 5 = uzaktan"),
    createLikertQuestion("cuisine_openness", "Yerel mutfağı/yeni yemekleri denemeye açıklığın?", weights[12], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("outdoor_activity_level", "Açık hava aktivitesi (doğa yürüyüşü, spor) yaşam tarzında ne kadar yer tutar?", weights[13], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("financial_risk_comfort", "Finansal belirsizliğe (düzensiz gelir, yeni pazar) rahatlığın?", weights[14], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("long_term_settle_intent", "Uzun vadede kalıcı yerleşme niyetin ne kadar güçlü?", weights[15], "lifestyle", "1 = geçici, 5 = kalıcı"),
    createLikertQuestion("hobby_social_mix", "Hobiler/sosyal hayatı yalnız mı grup halinde mi yaşarsın?", weights[16], "lifestyle", "1 = yalnız, 5 = grupla"),
    createLikertQuestion("pace_of_life_pref", "Hayat temposun nasıl olsun istersin?", weights[17], "lifestyle", "1 = yavaş/sakin, 5 = hızlı/yoğun"),
    createSingleChoiceQuestion("decision_making_style", "Büyük kararları nasıl alırsın?", weights[18], "lifestyle", "Büyük kararları nasıl alırsın?", [
      { key: "analytical", label: "Analitik/veriye dayalı", score: 100 },
      { key: "intuitive", label: "Sezgisel/hızlı", score: 50 },
      { key: "consultative", label: "Başkalarına danışarak", score: 0 },
    ]),
    createLikertQuestion("cultural_curiosity", "Farklı kültürleri/gelenekleri öğrenmeye merakın?", weights[19], "lifestyle", "1 = düşük, 5 = yüksek"),
  ]
);
