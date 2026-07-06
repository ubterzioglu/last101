import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const onceHangiSorunuCozmelisinQuestionnaire = createToolQuestionnaireConfig(
  "once-hangi-sorunu-cozmelisin",
  [
    createSingleChoiceQuestion("stressors", "Şu an en çok ne zorlayıcı geliyor?", weights[0], "challenge", "Birden fazla seçebilirsin", [
      { key: "visa", label: "Vize/oturum", score: 100 },
      { key: "job", label: "İş/gelir", score: 88 },
      { key: "language", label: "Dil", score: 75 },
      { key: "housing", label: "Konut", score: 63 },
      { key: "money", label: "Finans/bütçe", score: 50 },
      { key: "paperwork", label: "Evrak/bürokrasi", score: 38 },
      { key: "loneliness", label: "Yalnızlık/topluluk", score: 25 },
      { key: "school", label: "Diploma/okul denkliği", score: 13 },
      { key: "healthcare", label: "Sağlık", score: 0 },
    ]),
    createSingleChoiceQuestion("urgency", "Taşınma ne kadar yakın?", weights[1], "challenge", "Taşınma ne kadar yakın?", [
      { key: "0_1m", label: "0-1 ay", score: 100 },
      { key: "1_3m", label: "1-3 ay", score: 67 },
      { key: "3_6m", label: "3-6 ay", score: 33 },
      { key: "6m", label: "6 aydan uzak", score: 0 },
    ]),
    createSingleChoiceQuestion("blocked_progress", "Hangi alan ilerlemeyi gerçekten durduruyor?", weights[2], "challenge", "Birden fazla seçebilirsin", [
      { key: "visa", label: "Vize/oturum", score: 100 },
      { key: "job", label: "İş/gelir", score: 88 },
      { key: "language", label: "Dil", score: 75 },
      { key: "housing", label: "Konut", score: 63 },
      { key: "money", label: "Finans/bütçe", score: 50 },
      { key: "paperwork", label: "Evrak/bürokrasi", score: 38 },
      { key: "loneliness", label: "Yalnızlık/topluluk", score: 25 },
      { key: "school", label: "Diploma/okul denkliği", score: 13 },
      { key: "healthcare", label: "Sağlık", score: 0 },
    ]),
    createLikertQuestion("confidence", "Genel güven seviyen?", weights[3], "challenge", "1 = düşük (yüksek risk), 5 = yüksek"),
    createSingleChoiceQuestion("help_needed", "Dış destek almak istediğin alanlar?", weights[4], "challenge", "Birden fazla seçebilirsin", [
      { key: "mentor", label: "Mentor", score: 100 },
      { key: "legal", label: "Hukuki/vize danışmanı", score: 75 },
      { key: "recruiter", label: "İşe alım/kariyer", score: 50 },
      { key: "housing", label: "Konut", score: 25 },
      { key: "language", label: "Dil", score: 0 },
    ]),
    createSingleChoiceQuestion("documents_state", "Evrak/vize tarafında durum?", weights[5], "challenge", "Evrak/vize tarafında durum?", [
      { key: "clear", label: "Net/hazır", score: 100 },
      { key: "partial", label: "Kısmen hazır", score: 50 },
      { key: "confused", label: "Kafam karışık", score: 0 },
    ]),
    createSingleChoiceQuestion("income_state", "Gelir/iş tarafında durum?", weights[6], "challenge", "Gelir/iş tarafında durum?", [
      { key: "secured", label: "Garanti/işim var", score: 100 },
      { key: "searching", label: "Arıyorum", score: 50 },
      { key: "not_started", label: "Henüz başlamadım", score: 0 },
    ]),
    createSingleChoiceQuestion("support_state", "Destek ağı durumun?", weights[7], "challenge", "Destek ağı durumun?", [
      { key: "strong", label: "Güçlü", score: 100 },
      { key: "weak", label: "Zayıf", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("health_family_complexity", "Sağlık/aile/okul gibi ek karmaşıklık var mı?", weights[8], "challenge", "Birden fazla seçebilirsin", [
      { key: "children", label: "Çocuk", score: 100 },
      { key: "chronic_access_need", label: "Süreklilik gerektiren sağlık erişimi", score: 75 },
      { key: "pets", label: "Evcil hayvan", score: 50 },
      { key: "elder_support", label: "Yaşlı bakımı", score: 25 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("housing_state", "Konut tarafında durum?", weights[9], "challenge", "Konut tarafında durum?", [
      { key: "secured", label: "Hazır/garanti", score: 100 },
      { key: "searching", label: "Arıyorum", score: 50 },
      { key: "not_started", label: "Henüz başlamadım", score: 0 },
    ]),
    createSingleChoiceQuestion("language_state", "Dil tarafında durum?", weights[10], "challenge", "Dil tarafında durum?", [
      { key: "confident", label: "Yeterli/güvenim var", score: 100 },
      { key: "learning", label: "Öğreniyorum", score: 50 },
      { key: "stuck", label: "Zorlanıyorum", score: 0 },
    ]),
    createSingleChoiceQuestion("finance_state", "Finans/bütçe tarafında durum?", weights[11], "challenge", "Finans/bütçe tarafında durum?", [
      { key: "comfortable", label: "Rahat", score: 100 },
      { key: "tight", label: "Dar ama yönetilebilir", score: 50 },
      { key: "critical", label: "Kritik/yetersiz", score: 0 },
    ]),
    createSingleChoiceQuestion("previous_relocation_experience", "Daha önce yurt dışına taşınma deneyimin oldu mu?", weights[12], "challenge", "Daha önce yurt dışına taşınma deneyimin oldu mu?", [
      { key: "yes_multiple", label: "Evet, birden fazla kez", score: 100 },
      { key: "yes_once", label: "Evet, bir kez", score: 50 },
      { key: "no", label: "Hayır, ilk kez", score: 0 },
    ]),
    createSingleChoiceQuestion("support_system_detail", "Destek ağın kimlerden oluşuyor?", weights[13], "challenge", "Birden fazla seçebilirsin", [
      { key: "family", label: "Aile", score: 100 },
      { key: "friends", label: "Arkadaşlar", score: 75 },
      { key: "community_groups", label: "Topluluk grupları", score: 50 },
      { key: "professional_advisors", label: "Profesyonel danışmanlar", score: 25 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("biggest_fear", "Bu süreçte en büyük korkun ne?", weights[14], "challenge", "Bu süreçte en büyük korkun ne?", [
      { key: "financial_failure", label: "Finansal başarısızlık", score: 100 },
      { key: "social_isolation", label: "Sosyal izolasyon", score: 75 },
      { key: "career_setback", label: "Kariyer gerilemesi", score: 50 },
      { key: "legal_rejection", label: "Vize/yasal ret", score: 25 },
      { key: "none", label: "Belirgin bir korkum yok", score: 0 },
    ]),
    createLikertQuestion("timeline_flexibility", "Taşınma takvimin esnek mi (gerekirse ertelenebilir mi)?", weights[15], "challenge", "1 = esnek değil, 5 = çok esnek"),
    createSingleChoiceQuestion("budget_buffer", "Beklenmedik masraflar için ayrılmış bir bütçe tamponun var mı?", weights[16], "challenge", "Beklenmedik masraflar için ayrılmış bir bütçe tamponun var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createLikertQuestion("information_confidence", "Süreçle ilgili doğru bilgiye ulaştığından ne kadar eminsin?", weights[17], "challenge", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("decision_paralysis", "Çok fazla seçenek/bilgi karar almanı zorlaştırıyor mu?", weights[18], "challenge", "1 = hiç zorlaştırmıyor, 5 = çok zorlaştırıyor"),
    createLikertQuestion("action_readiness", "Bugün somut bir adım atmaya ne kadar hazırsın?", weights[19], "challenge", "1 = düşük, 5 = yüksek"),
  ]
);
