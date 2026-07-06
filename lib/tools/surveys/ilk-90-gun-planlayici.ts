import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const ilk90GunPlanlayiciQuestionnaire = createToolQuestionnaireConfig(
  "ilk-90-gun-planlayici",
  [
    createSingleChoiceQuestion("destination", "Hedef ülke/şehir?", weights[0], "plan", "ISO ülke kodu veya şehir", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("arrival_date", "Tahmini varış tarihin?", weights[1], "plan", "Tahmini varış tarihin?", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("visa_status", "Vize/oturum durumun?", weights[2], "legal", "Vize/oturum durumun?", [
      { key: "approved", label: "Onaylı", score: 100 },
      { key: "applied", label: "Başvurdum", score: 75 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "not_needed", label: "Gerekmiyor", score: 25 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("housing_status", "İlk konaklama durumun?", weights[3], "housing", "İlk konaklama durumun?", [
      { key: "secured", label: "Hazır", score: 100 },
      { key: "temporary", label: "Geçici", score: 67 },
      { key: "searching", label: "Arıyorum", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("health_insurance", "Sağlık sigortası planın?", weights[4], "health", "Sağlık sigortası planın?", [
      { key: "active", label: "Aktif", score: 100 },
      { key: "employer", label: "İşveren sağlıyor", score: 67 },
      { key: "will_buy", label: "Alacağım", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("banking", "Yerel banka/ödeme çözümü planın?", weights[5], "finance", "Yerel banka/ödeme çözümü planın?", [
      { key: "ready", label: "Hazır", score: 100 },
      { key: "researching", label: "Araştırıyorum", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("phone_internet", "Telefon/internet planın?", weights[6], "logistics", "Telefon/internet planın?", [
      { key: "ready", label: "Hazır", score: 100 },
      { key: "temporary", label: "Geçici", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("address_registration_known", "Adres/belediye kaydı gerekliliğini biliyor musun?", weights[7], "legal", "Adres/belediye kaydı gerekliliğini biliyor musun?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_applicable", label: "Geçerli değil", score: 0 },
    ]),
    createSingleChoiceQuestion("documents_ready", "Belgelerinin dijital/fiziksel kopyaları hazır mı?", weights[8], "legal", "Belgelerinin dijital/fiziksel kopyaları hazır mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("emergency_contacts", "Acil iletişimleri kaydettin mi?", weights[9], "logistics", "Acil iletişimleri kaydettin mi?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("transport", "İlk hafta ulaşım planın?", weights[10], "logistics", "İlk hafta ulaşım planın?", [
      { key: "public_transport", label: "Toplu taşıma", score: 100 },
      { key: "car", label: "Araç", score: 67 },
      { key: "taxi", label: "Taksi", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("job_start", "İş/okul başlangıç tarihin belli mi?", weights[11], "work", "İş/okul başlangıç tarihin belli mi?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_applicable", label: "Geçerli değil", score: 0 },
    ]),
    createSingleChoiceQuestion("children_school", "Çocuk okul/kayıt ihtiyacı var mı?", weights[12], "family", "Çocuk okul/kayıt ihtiyacı var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("pets", "Evcil hayvan taşınması var mı?", weights[13], "family", "Evcil hayvan taşınması var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("language_course", "Dil kursu/entegrasyon programı ihtiyacın var mı?", weights[14], "integration", "Dil kursu/entegrasyon programı ihtiyacın var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createSingleChoiceQuestion("community_intro", "İlk ay topluluk/mentor desteği ister misin?", weights[15], "integration", "İlk ay topluluk/mentor desteği ister misin?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createSingleChoiceQuestion("tax_social_security", "Vergi/sosyal güvenlik adımlarını biliyor musun?", weights[16], "legal", "Vergi/sosyal güvenlik adımlarını biliyor musun?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_applicable", label: "Geçerli değil", score: 0 },
    ]),
    createSingleChoiceQuestion("credential_recognition", "Mesleki denklik/lisans adımı gerekiyor mu?", weights[17], "work", "Mesleki denklik/lisans adımı gerekiyor mu?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createSingleChoiceQuestion("driving_license", "Ehliyet dönüşümü/araç ihtiyacı var mı?", weights[18], "logistics", "Ehliyet dönüşümü/araç ihtiyacı var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 0 },
    ]),
    createBooleanQuestion("notification_consent", "Görev hatırlatmaları almak ister misin?", weights[19], "integration", "E-posta / uygulama içi"),
  ]
);
