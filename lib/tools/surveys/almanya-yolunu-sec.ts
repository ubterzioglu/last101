import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const almanyaYolunuSecQuestionnaire = createToolQuestionnaireConfig(
  "almanya-yolunu-sec",
  [
    createSingleChoiceQuestion("motivation", "Tek taşınma motivasyonun ne?", weights[0], "plan", "Tek taşınma motivasyonun ne?", [
      { key: "career", label: "Kariyer", score: 100 },
      { key: "education", label: "Eğitim", score: 83 },
      { key: "family", label: "Aile", score: 67 },
      { key: "safety", label: "Güvenlik", score: 50 },
      { key: "lifestyle", label: "Yaşam tarzı", score: 33 },
      { key: "community", label: "Topluluk", score: 17 },
      { key: "remote_work", label: "Uzaktan çalışma", score: 0 },
    ]),
    createSingleChoiceQuestion("monthly_budget", "Aylık yaşam bütçen nedir?", weights[1], "budget", "Yaklaşık (EUR)", [
      { key: 'b1', label: "€800 altı", score: 20 },
      { key: 'b2', label: "€800 - €1.500", score: 55 },
      { key: 'b3', label: "€1.500 - €2.500", score: 80 },
      { key: 'b4', label: "€2.500+", score: 100 },
    ]),
    createSingleChoiceQuestion("profession_field", "Mesleğin veya ana uzmanlık alanın?", weights[2], "career", "Mesleğin veya ana uzmanlık alanın?", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("work_mode", "Yurt dışında çalışma planın nasıl?", weights[3], "career", "Yurt dışında çalışma planın nasıl?", [
      { key: "local_job", label: "Yerel iş", score: 100 },
      { key: "remote", label: "Uzaktan", score: 75 },
      { key: "study_then_work", label: "Önce eğitim, sonra iş", score: 50 },
      { key: "entrepreneur", label: "Girişimci", score: 25 },
      { key: "undecided", label: "Kararsız", score: 0 },
    ]),
    createSingleChoiceQuestion("visa_assets", "Vize/oturum açısından güçlü varlıkların var mı?", weights[4], "visa", "Birden fazla seçebilirsin", [
      { key: "eu_passport", label: "AB pasaportu", score: 100 },
      { key: "ancestry", label: "Ata bağı/vatandaşlık hakkı", score: 75 },
      { key: "student_admission", label: "Öğrenci kabulü", score: 50 },
      { key: "job_offer", label: "İş teklifi", score: 25 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createLikertQuestion("community_importance", "Türk/diaspora topluluğu senin için ne kadar önemli?", weights[5], "community", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("deal_breakers", "Kesin istemediğin koşullar?", weights[6], "plan", "Birden fazla seçebilirsin", [
      { key: "high_cost", label: "Yüksek maliyet", score: 100 },
      { key: "no_english", label: "İngilizce yetmiyor", score: 80 },
      { key: "weak_healthcare", label: "Zayıf sağlık", score: 60 },
      { key: "low_safety", label: "Düşük güvenlik", score: 40 },
      { key: "no_community", label: "Topluluk yok", score: 20 },
      { key: "hard_visa", label: "Zor vize", score: 0 },
    ]),
    createSingleChoiceQuestion("target_region", "Hangi bölgelere açıksın?", weights[7], "plan", "Birden fazla seçebilirsin", [
      { key: "eu_eea", label: "AB/AEA", score: 100 },
      { key: "uk", label: "Birleşik Krallık", score: 80 },
      { key: "north_america", label: "Kuzey Amerika", score: 60 },
      { key: "gulf", label: "Körfez", score: 40 },
      { key: "apac", label: "Asya-Pasifik", score: 20 },
      { key: "any", label: "Fark etmez", score: 0 },
    ]),
    createSingleChoiceQuestion("setup_budget", "İlk kurulum için ayırabileceğin maksimum bütçe?", weights[8], "budget", "Depozito, uçuş, evrak (EUR)", [
      { key: 'b1', label: "€1.000 altı", score: 20 },
      { key: 'b2', label: "€1.000 - €3.000", score: 55 },
      { key: 'b3', label: "€3.000 - €6.000", score: 80 },
      { key: 'b4', label: "€6.000+", score: 100 },
    ]),
    createSingleChoiceQuestion("language_profile", "İngilizce dışında bir dil biliyor musun / öğrenmeye açık mısın?", weights[9], "language", "İngilizce dışında bir dil biliyor musun / öğrenmeye açık mısın?", [
      { key: "english_only", label: "Sadece İngilizce", score: 100 },
      { key: "open", label: "Yeni dil öğrenmeye açığım", score: 50 },
      { key: "multilingual", label: "Birden fazla dil biliyorum", score: 0 },
    ]),
    createLikertQuestion("bureaucracy_tolerance", "Bürokrasi ve bekleme süresine toleransın?", weights[10], "visa", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("family_needs", "Aile, çocuk, okul veya evcil hayvan ihtiyaçların var mı?", weights[11], "family", "Birden fazla seçebilirsin", [
      { key: "children", label: "Çocuk", score: 100 },
      { key: "school", label: "Okul", score: 75 },
      { key: "spouse_job", label: "Eş işi", score: 50 },
      { key: "pets", label: "Evcil hayvan", score: 25 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createLikertQuestion("healthcare_priority", "Sağlık sistemine erişim önceliğin?", weights[12], "qol", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("safety_priority", "Güvenlik ve siyasi istikrar önceliğin?", weights[13], "qol", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("inclusion_priority", "Kapsayıcılık / haklar / sosyal özgürlükler ne kadar önemli?", weights[14], "qol", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("climate_preference", "İklim tercihin?", weights[15], "lifestyle", "İklim tercihin?", [
      { key: "mild", label: "Ilıman", score: 100 },
      { key: "cold", label: "Soğuk", score: 75 },
      { key: "warm", label: "Sıcak", score: 50 },
      { key: "mediterranean", label: "Akdeniz", score: 25 },
      { key: "no_preference", label: "Fark etmez", score: 0 },
    ]),
    createSingleChoiceQuestion("move_window", "Ne zaman taşınmak istiyorsun?", weights[16], "plan", "Ne zaman taşınmak istiyorsun?", [
      { key: "0_3m", label: "0-3 ay", score: 100 },
      { key: "3_6m", label: "3-6 ay", score: 67 },
      { key: "6_12m", label: "6-12 ay", score: 33 },
      { key: "later", label: "Daha sonra", score: 0 },
    ]),
    createLikertQuestion("risk_tolerance", "Belirsizlik ve yeniden başlama riskine toleransın?", weights[17], "plan", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("remote_work_flexibility", "Uzaktan çalışma esnekliğin ne kadar önemli?", weights[18], "career", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("tax_burden_tolerance", "Vergi yükü toleransın?", weights[19], "budget", "1 = düşük tolerans, 5 = yüksek tolerans"),
  ]
);
