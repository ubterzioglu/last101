import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const almanyayaHazirMisinQuestionnaire = createToolQuestionnaireConfig(
  "almanyaya-hazir-misin",
  [
    createSingleChoiceQuestion("target_known", "Hedef ülke/şehir belli mi?", weights[0], "plan", "Hedef ülke/şehir belli mi?", [
      { key: "city_known", label: "Evet, şehir belli", score: 100 },
      { key: "country_known", label: "Ülke belli, şehir değil", score: 60 },
      { key: "not_yet", label: "Henüz net değil", score: 20 },
    ]),
    createSingleChoiceQuestion("savings_months", "Kaç aylık yaşam gideri birikimin var?", weights[1], "finance", "Kaç aylık yaşam gideri birikimin var?", [
      { key: "6", label: "6 ay ve üzeri", score: 100 },
      { key: "3_5", label: "3-5 ay", score: 70 },
      { key: "1_2", label: "1-2 ay", score: 35 },
      { key: "0", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("passport_validity", "Pasaport ve temel kimlik evrakların güncel mi?", weights[2], "legal", "Pasaport ve temel kimlik evrakların güncel mi?", [
      { key: "yes", label: "Evet, güncel", score: 100 },
      { key: "expiring", label: "Yakında doluyor", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createLikertQuestion("language_level", "Hedef ülke iş/yaşam dili seviyen?", weights[3], "language", "0 = hiç, 5 = ileri"),
    createSingleChoiceQuestion("housing_first_month", "İlk ay konaklama planın var mı?", weights[4], "housing", "İlk ay konaklama planın var mı?", [
      { key: "secured", label: "Hazır/garanti", score: 100 },
      { key: "leads", label: "Birkaç seçenek var", score: 50 },
      { key: "no", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("job_income_plan", "İlk 3 ay gelir/iş planın var mı?", weights[5], "job", "İlk 3 ay gelir/iş planın var mı?", [
      { key: "job_offer", label: "İş teklifim var", score: 100 },
      { key: "remote_income", label: "Uzaktan gelirim var", score: 85 },
      { key: "savings_only", label: "Sadece birikim", score: 40 },
      { key: "no", label: "Plan yok", score: 0 },
    ]),
    createLikertQuestion("debt_pressure", "Kısa vadede taşınmayı zorlayacak borç/ödeme baskın var mı?", weights[6], "finance", "1 = yüksek baskı, 5 = baskı yok"),
    createSingleChoiceQuestion("visa_route", "Hedef ülke için net bir vize/oturum rotan var mı?", weights[7], "legal", "Hedef ülke için net bir vize/oturum rotan var mı?", [
      { key: "yes", label: "Evet, net", score: 100 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("diploma_docs", "Diploma, transkript, referans ve iş belgelerin hazır mı?", weights[8], "legal", "Diploma, transkript, referans ve iş belgelerin hazır mı?", [
      { key: "ready", label: "Hazır", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("health_insurance", "Sağlık sigortası / erişim planın var mı?", weights[9], "support", "Sağlık sigortası / erişim planın var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("support_network", "Hedef yerde tanıdık/topluluk desteğin var mı?", weights[10], "support", "Hedef yerde tanıdık/topluluk desteğin var mı?", [
      { key: "strong", label: "Güçlü", score: 100 },
      { key: "weak", label: "Zayıf", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("family_alignment", "Eş/çocuk/aile kararları net mi?", weights[11], "housing", "Eş/çocuk/aile kararları net mi?", [
      { key: "not_applicable", label: "Geçerli değil", score: 100 },
      { key: "aligned", label: "Net/uyumlu", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "conflict", label: "Anlaşmazlık var", score: 0 },
    ]),
    createSingleChoiceQuestion("emergency_plan", "Acil durumda iletişim ve dönüş planın var mı?", weights[12], "support", "Acil durumda iletişim ve dönüş planın var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createLikertQuestion("adaptability", "Belirsizlik ve kültürel uyuma hazır hissediyor musun?", weights[13], "support", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("timeline_realism", "Taşınma takvimin gerçekçi mi?", weights[14], "housing", "1 = gerçekçi değil, 5 = çok gerçekçi"),
    createSingleChoiceQuestion("emergency_fund_access", "Acil durum fonuna (birikim dışında, hızlı erişilebilir) sahip misin?", weights[15], "finance", "Acil durum fonuna (birikim dışında, hızlı erişilebilir) sahip misin?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("local_bank_account", "Hedef ülkede banka hesabı açma sürecini araştırdın mı?", weights[16], "legal", "Hedef ülkede banka hesabı açma sürecini araştırdın mı?", [
      { key: "ready", label: "Hazırım/araştırdım", score: 100 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("remote_work_transition", "Mevcut işini uzaktan sürdürme/geçiş planın var mı?", weights[17], "job", "Mevcut işini uzaktan sürdürme/geçiş planın var mı?", [
      { key: "not_applicable", label: "Geçerli değil", score: 100 },
      { key: "yes", label: "Evet, netleşti", score: 100 },
      { key: "negotiating", label: "Görüşülüyor", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("pet_relocation_plan", "Evcil hayvan taşıma/karantina planın var mı?", weights[18], "housing", "Evcil hayvan taşıma/karantina planın var mı?", [
      { key: "not_applicable", label: "Geçerli değil", score: 100 },
      { key: "ready", label: "Hazır", score: 100 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createLikertQuestion("mental_health_readiness", "Taşınma stresine ruhsal/duygusal olarak hazır hissediyor musun?", weights[19], "support", "1 = düşük, 5 = yüksek"),
  ]
);
