import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const almanyaMaasBeklentisiQuestionnaire = createToolQuestionnaireConfig(
  "almanya-maas-beklentisi",
  [
    createSingleChoiceQuestion("profession_title", "Mesleğin / rolün nedir?", weights[0], "career", "Anahtar: software_engineer, civil_engineer, registered_nurse, accountant, teacher", [
      { key: "software_engineer", label: "Yazılım Mühendisi", score: 100 },
      { key: "civil_engineer", label: "İnşaat Mühendisi", score: 75 },
      { key: "registered_nurse", label: "Hemşire", score: 50 },
      { key: "accountant", label: "Muhasebeci", score: 25 },
      { key: "teacher", label: "Öğretmen", score: 0 },
    ]),
    createSingleChoiceQuestion("seniority", "Kıdem seviyen?", weights[1], "career", "Kıdem seviyen?", [
      { key: "junior", label: "Junior", score: 100 },
      { key: "mid", label: "Orta", score: 75 },
      { key: "senior", label: "Senior", score: 50 },
      { key: "lead", label: "Lead", score: 25 },
      { key: "manager", label: "Yönetici", score: 0 },
    ]),
    createSingleChoiceQuestion("years_experience", "Kaç yıl ilgili deneyimin var?", weights[2], "career", "0-40", [
      { key: 'b1', label: "0-1 yıl", score: 20 },
      { key: 'b2', label: "2-4 yıl", score: 50 },
      { key: 'b3', label: "5-9 yıl", score: 80 },
      { key: 'b4', label: "10+ yıl", score: 100 },
    ]),
    createSingleChoiceQuestion("target_countries", "Hangi ülkeleri karşılaştırmak istiyorsun?", weights[3], "plan", "ISO ülke kodları, virgülle (boş = hepsi)", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("household_cost_context", "Alım gücü hesabı için hane tipin?", weights[4], "budget", "Alım gücü hesabı için hane tipin?", [
      { key: "single", label: "Tek kişi", score: 100 },
      { key: "couple", label: "Çift", score: 50 },
      { key: "family_with_children", label: "Çocuklu aile", score: 0 },
    ]),
    createSingleChoiceQuestion("education_level", "En yüksek eğitim seviyen?", weights[5], "career", "En yüksek eğitim seviyen?", [
      { key: "high_school", label: "Lise", score: 100 },
      { key: "vocational", label: "Meslek okulu", score: 75 },
      { key: "bachelor", label: "Lisans", score: 50 },
      { key: "master", label: "Yüksek lisans", score: 25 },
      { key: "phd", label: "Doktora", score: 0 },
    ]),
    createSingleChoiceQuestion("specialization", "Uzmanlık/branş alanların?", weights[6], "career", "Birden fazla seçebilirsin", [
      { key: "backend", label: "Backend/Sistem", score: 100 },
      { key: "data_ai", label: "Veri/Yapay Zeka", score: 75 },
      { key: "clinical", label: "Klinik", score: 50 },
      { key: "management", label: "Yönetim", score: 25 },
      { key: "other", label: "Diğer", score: 0 },
    ]),
    createSingleChoiceQuestion("certifications", "Uluslararası geçerli sertifikan var mı?", weights[7], "career", "Birden fazla seçebilirsin", [
      { key: "aws", label: "AWS/Cloud", score: 100 },
      { key: "pmp", label: "PMP", score: 67 },
      { key: "medical_license", label: "Tıbbi lisans", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("regulated_profession", "Mesleğin hedef ülkede lisans/denkliğe tabi mi?", weights[8], "legal", "Mesleğin hedef ülkede lisans/denkliğe tabi mi?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createSingleChoiceQuestion("salary_preference", "Maaşı nasıl görmek istersin?", weights[9], "budget", "Maaşı nasıl görmek istersin?", [
      { key: "gross_yearly", label: "Brüt yıllık", score: 100 },
      { key: "net_monthly", label: "Net aylık", score: 50 },
      { key: "both", label: "İkisi de", score: 0 },
    ]),
    createSingleChoiceQuestion("current_salary_optional", "Mevcut net maaşını karşılaştırmaya dahil edelim mi?", weights[10], "budget", "Opsiyonel (EUR/ay)", [
      { key: 'b1', label: "€1.500 altı", score: 25 },
      { key: 'b2', label: "€1.500 - €2.500", score: 55 },
      { key: 'b3', label: "€2.500 - €4.000", score: 80 },
      { key: 'b4', label: "€4.000+", score: 100 },
    ]),
    createSingleChoiceQuestion("target_cities", "Belirli şehirleri dahil edelim mi?", weights[11], "plan", "Opsiyonel", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("industry_sector", "Hangi sektörde çalışıyorsun/çalışmak istiyorsun?", weights[12], "career", "Hangi sektörde çalışıyorsun/çalışmak istiyorsun?", [
      { key: "tech", label: "Teknoloji", score: 100 },
      { key: "finance", label: "Finans", score: 75 },
      { key: "healthcare", label: "Sağlık", score: 50 },
      { key: "public_sector", label: "Kamu", score: 25 },
      { key: "other", label: "Diğer", score: 0 },
    ]),
    createSingleChoiceQuestion("company_size_pref", "Şirket ölçeği tercihin?", weights[13], "career", "Şirket ölçeği tercihin?", [
      { key: "startup", label: "Startup", score: 100 },
      { key: "mid_size", label: "Orta ölçek", score: 67 },
      { key: "enterprise", label: "Büyük/kurumsal", score: 33 },
      { key: "no_preference", label: "Fark etmez", score: 0 },
    ]),
    createLikertQuestion("negotiation_experience", "Maaş pazarlığı deneyimin/özgüvenin?", weights[14], "career", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("benefits_priority", "Maaş dışında en çok önemsediğin yan haklar?", weights[15], "budget", "Birden fazla seçebilirsin", [
      { key: "health_insurance", label: "Sağlık sigortası", score: 100 },
      { key: "pension", label: "Emeklilik/pension", score: 75 },
      { key: "paid_leave", label: "Ücretli izin", score: 50 },
      { key: "bonus", label: "Prim/bonus", score: 25 },
      { key: "none", label: "Önemli değil", score: 0 },
    ]),
    createSingleChoiceQuestion("relocation_package_need", "İşveren taşınma paketi (relocation package) bekliyor musun?", weights[16], "budget", "İşveren taşınma paketi (relocation package) bekliyor musun?", [
      { key: "essential", label: "Şart", score: 100 },
      { key: "nice_to_have", label: "Olursa iyi olur", score: 50 },
      { key: "not_needed", label: "Gerek yok", score: 0 },
    ]),
    createLikertQuestion("interview_readiness", "Hedef ülke standartlarında mülakat hazırlığın nasıl?", weights[17], "career", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("visa_sponsor_need", "İşe alım için vize sponsorluğuna ihtiyacın olur mu?", weights[18], "legal", "İşe alım için vize sponsorluğuna ihtiyacın olur mu?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createSingleChoiceQuestion("remote_salary_expectation", "Uzaktan/hibrit çalışırsan maaş beklentin değişir mi?", weights[19], "budget", "Uzaktan/hibrit çalışırsan maaş beklentin değişir mi?", [
      { key: "same", label: "Aynı kalmalı", score: 100 },
      { key: "flexible", label: "Esnek olabilirim", score: 50 },
      { key: "lower_ok", label: "Daha düşüğü kabul ederim", score: 0 },
    ]),
  ]
);
