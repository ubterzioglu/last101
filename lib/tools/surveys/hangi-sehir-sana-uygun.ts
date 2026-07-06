import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const hangiSehirSanaUygunQuestionnaire = createToolQuestionnaireConfig(
  "hangi-sehir-sana-uygun",
  [
    createSingleChoiceQuestion("target_countries", "Hangi ülke(ler)de şehir arıyorsun?", weights[0], "plan", "ISO ülke kodu (ör. DE), virgülle ayırabilirsin", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("city_size", "Şehir ölçeği tercihin?", weights[1], "lifestyle", "Şehir ölçeği tercihin?", [
      { key: "metropolis", label: "Metropol", score: 100 },
      { key: "large_city", label: "Büyük şehir", score: 75 },
      { key: "mid_size", label: "Orta ölçek", score: 50 },
      { key: "small_city", label: "Küçük şehir", score: 25 },
      { key: "no_preference", label: "Fark etmez", score: 0 },
    ]),
    createSingleChoiceQuestion("rent_budget", "Aylık kira/konut bütçen?", weights[2], "budget", "Yaklaşık (EUR)", [
      { key: 'b1', label: "€500 altı", score: 20 },
      { key: 'b2', label: "€500 - €900", score: 55 },
      { key: 'b3', label: "€900 - €1.400", score: 80 },
      { key: 'b4', label: "€1.400+", score: 100 },
    ]),
    createLikertQuestion("industry_hub", "Meslek alanın için güçlü bir sektör ekosistemi ister misin?", weights[3], "job", "1 = önemsiz, 5 = çok önemli"),
    createLikertQuestion("community_need", "Türk/diaspora topluluğu şehir seçiminde ne kadar önemli?", weights[4], "community", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("safety_family", "Güvenlik, okul ve aile dostu ortam önceliğin?", weights[5], "safety", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("airport_access", "Türkiye'ye uçuş erişimi önemli mi?", weights[6], "mobility", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("commute_tolerance", "Günlük ulaşım toleransın?", weights[7], "mobility", "Günlük ulaşım toleransın?", [
      { key: "15m", label: "15 dk", score: 100 },
      { key: "30m", label: "30 dk", score: 67 },
      { key: "60m", label: "60 dk", score: 33 },
      { key: "flexible", label: "Esnek", score: 0 },
    ]),
    createLikertQuestion("nightlife_culture", "Kültür, etkinlik, gece hayatı önceliğin?", weights[8], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("quiet_preference", "Sessiz/sakin yaşam senin için önemli mi?", weights[9], "lifestyle", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("climate", "Şehir iklimi tercihin?", weights[10], "lifestyle", "Şehir iklimi tercihin?", [
      { key: "mild", label: "Ilıman", score: 100 },
      { key: "cold", label: "Soğuk", score: 75 },
      { key: "warm", label: "Sıcak", score: 50 },
      { key: "coastal", label: "Kıyı", score: 25 },
      { key: "no_preference", label: "Fark etmez", score: 0 },
    ]),
    createLikertQuestion("language_comfort", "Yerel dili bilmeden şehirde başlama konforu ne kadar önemli?", weights[11], "lifestyle", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("housing_priority", "Konut bulunabilirliği maliyetten daha önemli mi?", weights[12], "budget", "1 = maliyet, 5 = bulunabilirlik"),
    createLikertQuestion("healthcare_priority", "Sağlık erişimi önceliğin?", weights[13], "safety", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("deal_breakers", "Şehir için kırmızı çizgilerin?", weights[14], "plan", "Birden fazla seçebilirsin", [
      { key: "too_expensive", label: "Çok pahalı", score: 100 },
      { key: "no_jobs", label: "İş yok", score: 75 },
      { key: "no_community", label: "Topluluk yok", score: 50 },
      { key: "unsafe", label: "Güvensiz", score: 25 },
      { key: "poor_transport", label: "Ulaşım kötü", score: 0 },
    ]),
    createSingleChoiceQuestion("preferred_examples", "Sevdiğin şehir tiplerine örnek ver", weights[15], "lifestyle", "Opsiyonel", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createLikertQuestion("public_transport_importance", "Toplu taşıma kalitesi/erişimi ne kadar önemli?", weights[16], "mobility", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("green_space_preference", "Yeşil alan/park erişimi senin için önemli mi?", weights[17], "lifestyle", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("expat_community_size", "Uluslararası/expat topluluğunun büyüklüğü senin için önemli mi?", weights[18], "community", "Uluslararası/expat topluluğunun büyüklüğü senin için önemli mi?", [
      { key: "large", label: "Büyük olsun", score: 100 },
      { key: "moderate", label: "Orta yeterli", score: 50 },
      { key: "no_preference", label: "Fark etmez", score: 0 },
    ]),
    createLikertQuestion("healthcare_access_urgency", "Kronik/acil sağlık ihtiyacın nedeniyle sağlık erişimi kritik mi?", weights[19], "safety", "1 = düşük, 5 = kritik"),
  ]
);
