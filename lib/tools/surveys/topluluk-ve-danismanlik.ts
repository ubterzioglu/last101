import {
  QUESTIONNAIRE_WEIGHTS,
  createBooleanQuestion,
  createSingleChoiceQuestion,
  createToolQuestionnaireConfig,
} from '@/lib/tools/survey';

const weights = QUESTIONNAIRE_WEIGHTS;

// Bu dosya scripts/pull-corteqs-tools.mjs tarafından corteqs verisinden üretildi.
// Elle düzenlemek yerine kaynağı güncelleyip scripti tekrar çalıştır.
export const toplulukVeDanismanlikQuestionnaire = createToolQuestionnaireConfig(
  "topluluk-ve-danismanlik",
  [
    createBooleanQuestion("consent_match_visibility", "Eşleşme havuzunda görünmeyi kabul ediyor musun?", weights[0], "consent", "Bu zorunlu; onay olmadan eşleşme üretilmez ve hiçbir şey kaydedilmez."),
    createSingleChoiceQuestion("profile_status", "Durumun ne?", weights[1], "profile", "Durumun ne?", [
      { key: "planning", label: "Planlıyorum", score: 100 },
      { key: "newly_arrived", label: "Yeni taşındım", score: 75 },
      { key: "settled", label: "Yerleşik", score: 50 },
      { key: "mentor", label: "Mentor", score: 25 },
      { key: "organization", label: "Kurum/topluluk", score: 0 },
    ]),
    createSingleChoiceQuestion("target_location", "Hedef ülke/şehir?", weights[2], "geo", "ISO ülke kodu (ör. DE)", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("profession_field", "Meslek/sektör alanın?", weights[3], "field", "Serbest etiket", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("needs", "Hangi konularda yardıma ihtiyacın var?", weights[4], "match", "Birden fazla seçebilirsin", [
      { key: "job", label: "İş", score: 100 },
      { key: "housing", label: "Konut", score: 83 },
      { key: "visa", label: "Vize", score: 67 },
      { key: "language", label: "Dil", score: 50 },
      { key: "school", label: "Okul", score: 33 },
      { key: "community", label: "Topluluk", score: 17 },
      { key: "healthcare", label: "Sağlık", score: 0 },
    ]),
    createSingleChoiceQuestion("offers", "Hangi konularda destek verebilirsin?", weights[5], "match", "Birden fazla seçebilirsin", [
      { key: "mentoring", label: "Mentorluk", score: 100 },
      { key: "cv_review", label: "CV inceleme", score: 75 },
      { key: "local_tips", label: "Yerel ipuçları", score: 50 },
      { key: "housing_lead", label: "Konut yönlendirme", score: 25 },
      { key: "language_practice", label: "Dil pratiği", score: 0 },
    ]),
    createSingleChoiceQuestion("languages", "Hangi dillerde iletişim kurabilirsin?", weights[6], "match", "Birden fazla seçebilirsin", [
      { key: "tr", label: "Türkçe", score: 100 },
      { key: "en", label: "İngilizce", score: 75 },
      { key: "de", label: "Almanca", score: 50 },
      { key: "fr", label: "Fransızca", score: 25 },
      { key: "nl", label: "Felemenkçe", score: 0 },
    ]),
    createSingleChoiceQuestion("contact_style", "İlk temas tercihin?", weights[7], "match", "İlk temas tercihin?", [
      { key: "message", label: "Mesaj", score: 100 },
      { key: "virtual_coffee", label: "Sanal kahve", score: 67 },
      { key: "group_event", label: "Grup etkinliği", score: 33 },
      { key: "anonymous_intro", label: "Anonim tanışma", score: 0 },
    ]),
    createSingleChoiceQuestion("current_location", "Şu an neredesin?", weights[8], "geo", "ISO ülke kodu", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("availability", "Görüşme uygunluğun?", weights[9], "match", "Görüşme uygunluğun?", [
      { key: "weekdays", label: "Hafta içi", score: 100 },
      { key: "evenings", label: "Akşamlar", score: 67 },
      { key: "weekends", label: "Hafta sonu", score: 33 },
      { key: "async_only", label: "Sadece asenkron", score: 0 },
    ]),
    createSingleChoiceQuestion("mentor_capacity", "Ayda kaç kişiye destek verebilirsin?", weights[10], "match", "Mentor/yerleşik için", [
      { key: 'b1', label: "1 kişi", score: 40 },
      { key: 'b2', label: "2-3 kişi", score: 70 },
      { key: 'b3', label: "4-6 kişi", score: 90 },
      { key: 'b4', label: "6+ kişi", score: 100 },
    ]),
    createSingleChoiceQuestion("intro_text", "Karşı tarafa gösterilecek kısa tanıtım", weights[11], "profile", "Max 280 karakter", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("sensitive_hide", "Gizlemek istediğin alanlar", weights[12], "consent", "Birden fazla seçebilirsin", [
      { key: "city", label: "Şehir", score: 100 },
      { key: "profession", label: "Meslek", score: 67 },
      { key: "real_name", label: "Gerçek ad", score: 33 },
      { key: "employer", label: "İşveren", score: 0 },
    ]),
    createSingleChoiceQuestion("trust_signals", "Profil doğrulama sinyalleri", weights[13], "profile", "Birden fazla seçebilirsin", [
      { key: "completed_profile", label: "Tamamlanmış profil", score: 100 },
      { key: "catalog_claim", label: "Katalog talebi", score: 50 },
      { key: "phone_verified", label: "Telefon doğrulanmış", score: 0 },
    ]),
    createSingleChoiceQuestion("blocking_topics", "Eşleşmek istemediğin konu/tipler", weights[14], "consent", "Birden fazla seçebilirsin", [
      { key: "sales", label: "Satış", score: 100 },
      { key: "legal_advice", label: "Hukuki tavsiye", score: 67 },
      { key: "recruiting", label: "İşe alım", score: 33 },
      { key: "none", label: "Yok", score: 0 },
    ]),
    createSingleChoiceQuestion("timezone", "Saat dilimi / uygun saat", weights[15], "match", "Opsiyonel", [
      { key: 'c1', label: "Evet, net", score: 100 },
      { key: 'c2', label: "Kısmen", score: 60 },
      { key: 'c3', label: "Henüz belirsiz", score: 20 },
    ]),
    createSingleChoiceQuestion("experience_years_in_target", "Hedef ülke/şehirde kaç yıldır bulunuyorsun?", weights[16], "profile", "Yeni planlıyorsan 0 yazabilirsin", [
      { key: 'b1', label: "Henüz gitmedim", score: 20 },
      { key: 'b2', label: "1-2 yıl", score: 50 },
      { key: 'b3', label: "3-5 yıl", score: 80 },
      { key: 'b4', label: "6+ yıl", score: 100 },
    ]),
    createSingleChoiceQuestion("preferred_group_size", "Bire bir mi grup buluşması mı tercih edersin?", weights[17], "match", "Bire bir mi grup buluşması mı tercih edersin?", [
      { key: "one_on_one", label: "Bire bir", score: 100 },
      { key: "small_group", label: "Küçük grup", score: 50 },
      { key: "either", label: "Fark etmez", score: 0 },
    ]),
    createSingleChoiceQuestion("topic_interests", "Hangi konularda sohbet/etkileşim ilgini çeker?", weights[18], "field", "Birden fazla seçebilirsin", [
      { key: "career", label: "Kariyer", score: 100 },
      { key: "entrepreneurship", label: "Girişimcilik", score: 75 },
      { key: "family_life", label: "Aile yaşamı", score: 50 },
      { key: "culture_social", label: "Kültür/sosyal", score: 25 },
      { key: "education", label: "Eğitim", score: 0 },
    ]),
    createSingleChoiceQuestion("response_time_expectation", "Mesajlara ne kadar sürede dönüş bekliyorsun/yapabiliyorsun?", weights[19], "match", "Mesajlara ne kadar sürede dönüş bekliyorsun/yapabiliyorsun?", [
      { key: "same_day", label: "Aynı gün", score: 100 },
      { key: "few_days", label: "Birkaç gün içinde", score: 50 },
      { key: "flexible", label: "Esnek", score: 0 },
    ]),
  ]
);
