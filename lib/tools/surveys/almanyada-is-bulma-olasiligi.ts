import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const almanyadaIsBulmaOlasiligiQuestionnaire = createToolQuestionnaireConfig(
  "almanyada-is-bulma-olasiligi",
  [
    createSingleChoiceQuestion("profession_title", "Hedeflediğin iş/rol nedir?", weights[0], "career", "Anahtar: software_engineer, civil_engineer, registered_nurse, accountant, teacher", [
      { key: "software_engineer", label: "Yazılım Mühendisi", score: 100 },
      { key: "civil_engineer", label: "İnşaat Mühendisi", score: 75 },
      { key: "registered_nurse", label: "Hemşire", score: 50 },
      { key: "accountant", label: "Muhasebeci", score: 25 },
      { key: "teacher", label: "Öğretmen", score: 0 },
    ]),
    createSingleChoiceQuestion("target_country", "Hangi ülkede iş arıyorsun?", weights[1], "plan", "Tek ISO ülke kodu (ör. DE)", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("years_experience", "İlgili deneyim yılın?", weights[2], "career", "0-40", [
      { key: 'b1', label: "0-1 yıl", score: 20 },
      { key: 'b2', label: "2-4 yıl", score: 50 },
      { key: 'b3', label: "5-9 yıl", score: 80 },
      { key: 'b4', label: "10+ yıl", score: 100 },
    ]),
    createSingleChoiceQuestion("seniority", "Kıdem seviyen?", weights[3], "career", "Kıdem seviyen?", [
      { key: "junior", label: "Junior", score: 100 },
      { key: "mid", label: "Orta", score: 75 },
      { key: "senior", label: "Senior", score: 50 },
      { key: "lead", label: "Lead", score: 25 },
      { key: "manager", label: "Yönetici", score: 0 },
    ]),
    createLikertQuestion("language_level", "İş dilindeki seviyen?", weights[4], "skills", "0 = hiç, 5 = ileri"),
    createSingleChoiceQuestion("work_authorization", "Çalışma izni/vize açısından durumun?", weights[5], "legal", "Çalışma izni/vize açısından durumun?", [
      { key: "authorized", label: "Çalışma iznim var", score: 100 },
      { key: "eligible", label: "Uygunum (kolay)", score: 67 },
      { key: "needs_sponsor", label: "Sponsor gerek", score: 33 },
      { key: "unknown", label: "Bilmiyorum", score: 0 },
    ]),
    createSingleChoiceQuestion("network", "Hedef ülkede profesyonel bağlantın var mı?", weights[6], "network", "Hedef ülkede profesyonel bağlantın var mı?", [
      { key: "strong", label: "Güçlü", score: 100 },
      { key: "weak", label: "Zayıf", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("education_level", "Eğitim seviyen?", weights[7], "career", "Eğitim seviyen?", [
      { key: "vocational", label: "Meslek okulu", score: 100 },
      { key: "bachelor", label: "Lisans", score: 75 },
      { key: "master", label: "Yüksek lisans", score: 50 },
      { key: "phd", label: "Doktora", score: 25 },
      { key: "other", label: "Diğer", score: 0 },
    ]),
    createLikertQuestion("english_level", "İngilizce seviyen?", weights[8], "skills", "0 = hiç, 5 = ileri"),
    createSingleChoiceQuestion("regulated_profession", "Mesleğin denklik/lisans gerektiriyor mu?", weights[9], "legal", "Mesleğin denklik/lisans gerektiriyor mu?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createSingleChoiceQuestion("credential_status", "Denklik/sertifika durumun?", weights[10], "legal", "Denklik/sertifika durumun?", [
      { key: "recognized", label: "Tanınmış", score: 100 },
      { key: "in_progress", label: "Sürüyor", score: 67 },
      { key: "not_needed", label: "Gerekmiyor", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("portfolio_cv", "CV/LinkedIn/portföyün hedef ülkeye uygun mu?", weights[11], "skills", "CV/LinkedIn/portföyün hedef ülkeye uygun mu?", [
      { key: "ready", label: "Hazır", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("applications", "Son 30 günde kaç başvuru yaptın?", weights[12], "network", "0-200", [
      { key: 'b1', label: "0-5 başvuru", score: 20 },
      { key: 'b2', label: "6-15 başvuru", score: 50 },
      { key: 'b3', label: "16-40 başvuru", score: 80 },
      { key: 'b4', label: "40+ başvuru", score: 100 },
    ]),
    createSingleChoiceQuestion("interviews", "Son 90 günde mülakat aldın mı?", weights[13], "network", "Son 90 günde mülakat aldın mı?", [
      { key: "multiple", label: "Birden fazla", score: 100 },
      { key: "one", label: "Bir", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createLikertQuestion("salary_flexibility", "Maaş/rol esnekliğin?", weights[14], "plan", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("remote_option", "Remote/hybrid/sponsor seçeneklerine açıksın?", weights[15], "plan", "Birden fazla seçebilirsin", [
      { key: "remote", label: "Remote", score: 100 },
      { key: "hybrid", label: "Hybrid", score: 67 },
      { key: "sponsor", label: "Sponsor relocation", score: 33 },
      { key: "local_only", label: "Sadece yerel", score: 0 },
    ]),
    createLikertQuestion("linkedin_profile_quality", "LinkedIn/profesyonel profilin hedef ülke standartlarına ne kadar uygun?", weights[16], "network", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("industry_specific_certifications", "Sektöre özel ek sertifikaların var mı?", weights[17], "legal", "Birden fazla seçebilirsin", [
      { key: "technical_cert", label: "Teknik sertifika", score: 100 },
      { key: "language_cert", label: "Dil sertifikası", score: 67 },
      { key: "professional_license", label: "Mesleki lisans", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("salary_research_done", "Hedef ülke için piyasa maaş araştırması yaptın mı?", weights[18], "career", "Hedef ülke için piyasa maaş araştırması yaptın mı?", [
      { key: "thorough", label: "Detaylı yaptım", score: 100 },
      { key: "basic", label: "Temel düzeyde", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("local_recruiter_contact", "Hedef ülkede yerel bir recruiter/işe alım uzmanıyla temasın var mı?", weights[19], "network", "Hedef ülkede yerel bir recruiter/işe alım uzmanıyla temasın var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "in_progress", label: "Görüşme sürecinde", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
  ]
);
