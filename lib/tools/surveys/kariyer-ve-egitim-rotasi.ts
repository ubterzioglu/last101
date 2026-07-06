import {
  QUESTIONNAIRE_WEIGHTS,
  createLikertQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const kariyerVeEgitimRotasiQuestionnaire = createToolQuestionnaireConfig(
  "kariyer-ve-egitim-rotasi",
  [
    createSingleChoiceQuestion("current_field", "Şu anki alanın / bölümün / mesleğin?", weights[0], "career", "Serbest metin", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("favorite_work", "En çok hangi iş tipinden enerji alırsın?", weights[1], "interest", "Birden fazla seçebilirsin", [
      { key: "analysis", label: "Analiz", score: 100 },
      { key: "building", label: "İnşa/üretme", score: 83 },
      { key: "people", label: "İnsanlarla çalışma", score: 67 },
      { key: "research", label: "Araştırma", score: 50 },
      { key: "operations", label: "Operasyon", score: 33 },
      { key: "sales", label: "Satış", score: 17 },
      { key: "teaching", label: "Öğretme", score: 0 },
    ]),
    createSingleChoiceQuestion("core_skills", "Güçlü becerilerin?", weights[2], "skills", "Birden fazla seçebilirsin", [
      { key: "technical", label: "Teknik", score: 100 },
      { key: "communication", label: "İletişim", score: 83 },
      { key: "language", label: "Dil", score: 67 },
      { key: "leadership", label: "Liderlik", score: 50 },
      { key: "craft", label: "El/zanaat", score: 33 },
      { key: "healthcare", label: "Sağlık", score: 17 },
      { key: "finance", label: "Finans", score: 0 },
    ]),
    createLikertQuestion("study_willingness", "Yurt dışında yeniden eğitim/sertifika almaya açık mısın?", weights[3], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("risk_appetite", "Kariyerde yeniden başlama riskine toleransın?", weights[4], "interest", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("work_environment", "Çalışma ortamı tercihin?", weights[5], "interest", "Çalışma ortamı tercihin?", [
      { key: "startup", label: "Startup", score: 100 },
      { key: "corporate", label: "Kurumsal", score: 80 },
      { key: "academic", label: "Akademik", score: 60 },
      { key: "public", label: "Kamu", score: 40 },
      { key: "freelance", label: "Freelance", score: 20 },
      { key: "field_work", label: "Saha", score: 0 },
    ]),
    createLikertQuestion("salary_vs_stability", "Maaş mı istikrar mı?", weights[6], "interest", "1 = istikrar, 5 = maaş"),
    createSingleChoiceQuestion("regulated_barrier", "Alanında lisans/denklik bariyeri var mı?", weights[7], "legal", "Alanında lisans/denklik bariyeri var mı?", [
      { key: "yes", label: "Evet", score: 100 },
      { key: "no", label: "Hayır", score: 50 },
      { key: "not_sure", label: "Emin değilim", score: 0 },
    ]),
    createLikertQuestion("language_level", "İş dilinde seviyen?", weights[8], "skills", "0 = hiç, 5 = ileri"),
    createSingleChoiceQuestion("portfolio_signal", "Portföy, yayın, proje veya referansların var mı?", weights[9], "skills", "Portföy, yayın, proje veya referansların var mı?", [
      { key: "strong", label: "Güçlü", score: 100 },
      { key: "partial", label: "Kısmen", score: 50 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createLikertQuestion("entrepreneurship", "Girişimcilik/freelance çalışma ilgisi?", weights[10], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("research_interest", "Araştırma/akademi ilgisi?", weights[11], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("hands_on_interest", "Pratik/mesleki uygulama ilgisi?", weights[12], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("people_helping", "İnsanlara doğrudan destek veren rollere ilgin?", weights[13], "interest", "1 = düşük, 5 = yüksek"),
    createSingleChoiceQuestion("timeline", "Kariyer dönüşümü için zaman ufkun?", weights[14], "plan", "Kariyer dönüşümü için zaman ufkun?", [
      { key: "0_3m", label: "0-3 ay", score: 100 },
      { key: "3_12m", label: "3-12 ay", score: 67 },
      { key: "1_2y", label: "1-2 yıl", score: 33 },
      { key: "2y", label: "2 yıldan uzak", score: 0 },
    ]),
    createLikertQuestion("management_interest", "Ekip/insan yönetimi ilgisi?", weights[15], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("hands_on_certification_openness", "Mesleki/uygulamalı sertifikasyon almaya açıklığın?", weights[16], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("client_facing_comfort", "Müşteri/dış paydaşla birebir çalışma konforun?", weights[17], "interest", "1 = düşük, 5 = yüksek"),
    createLikertQuestion("structured_vs_flexible", "Yapılandırılmış program mı esnek/bağımsız çalışma mı tercih edersin?", weights[18], "interest", "1 = yapılandırılmış, 5 = esnek/bağımsız"),
    createLikertQuestion("mission_driven_motivation", "Toplumsal fayda/misyon odaklı iş motivasyonun?", weights[19], "interest", "1 = düşük, 5 = yüksek"),
  ]
);
