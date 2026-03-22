/* =========================================================
  FILE: /zats/js/zats-tool.js
  PURPOSE:
  - ZATS – ATS Readability Score
  - PDF.js local extraction
  - ATS scoring (EN / DE / TR)
  - Insights shown ABOVE text areas
  PRIVACY:
  - 100% client-side, no upload
========================================================= */

(function () {
  "use strict";

  /* ===================== CONFIG ===================== */
  const WORKER_SRC = "./vendor/pdfjs/pdf.worker.min.js?v=1";

  /* ===================== SECTION HINTS ===================== */
  const SECTION_HINTS = [
    { name: "Experience", rx: /(experience|work experience|employment|professional experience|berufserfahrung|iş deneyimi)/i },
    { name: "Skills", rx: /(skills|tech stack|technologies|tools|kenntnisse|yetenek)/i },
    { name: "Education", rx: /(education|studium|ausbildung|eğitim|üniversite)/i },
    { name: "Certifications", rx: /(certification|zertifikat|sertifika)/i }
  ];

  /* ===================== KEYWORDS ===================== */
  const FALLBACK_KEYWORDS = [
    "qa","testing","automation","selenium","playwright","cypress","ranorex",
    "jira","xray","testrail","postman","api","ci","cd","jenkins",
    "docker","sql","python","java","c#",".net","istqb","agile","scrum"
  ];

 
 /* ===================== VERBS ===================== */
const OWNERSHIP_RX = /(led|owned|implemented|designed|built|improved|optimized|delivered|achieved|umgesetzt|entwickelt|verbessert|optimiert|geliştird|iyileştird|kurdu|azaltt)/i;

const GENERIC_RX = /(responsible for|worked on|involved in|verantwortlich für|beteiligt|sorumlu|destek oldum)/i;

/* ===================== DOM ===================== */

  const els = {};
  let issues = [];
  let fixes = [];

  document.addEventListener("DOMContentLoaded", () => {
    els.pdf = q("#pdfUpload");
    els.cv = q("#cvText");
    els.jd = q("#jdText");
    els.preview = q("#previewText");
    els.result = q("#result");
    els.hint = q("#hint");

    els.btnExtract = q("#btnExtract");
    els.btnScore = q("#btnScore");
    els.btnClear = q("#btnClear");

    if (window.pdfjsLib?.GlobalWorkerOptions) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER_SRC;
    }

    els.btnExtract.onclick = onExtract;
    els.btnScore.onclick = onScore;
    els.btnClear.onclick = onClear;

    setState("Hazır.", "Metin tabanlı bir CV PDF yükleyin veya CV metnini yapıştırın.");
    els.preview.textContent = "Henüz metin çıkarılmadı.";
  });

  /* ===================== ACTIONS ===================== */

  async function onExtract() {
    const file = els.pdf.files?.[0];
    if (!file) return setState("Hata.", "PDF seçilmedi.");

    try {
      setBusy(true);
      setState("Çıkarılıyor…", "PDF metin katmanı okunuyor.");

      const text = normalize(await extractTextFromPdf(file));
      if (text.length < 80) {
        setState("Çıkarma başarısız.", "PDF taranmış veya metin katmanı yok.");
        els.preview.textContent = "Okunabilir metin tespit edilmedi.";
        return;
      }

      els.cv.value = text;
      els.preview.textContent = text.slice(0, 2600);
      setState("Çıkarıldı.", "Şimdi 'Skoru hesapla' butonuna tıklayın.");
    } catch (e) {
      setState("Hata.", e.message);
    } finally {
      setBusy(false);
    }
  }

  function onScore() {
    const cv = normalize(els.cv.value);
    const jd = normalize(els.jd.value);

    if (cv.length < 120) {
      return setState("Hata.", "CV metni çok kısa.");
    }

    setState("Hesaplanıyor…", "ATS hazırlığı analiz ediliyor.");
    const res = scoreAts(cv, jd);

    setState(`${res.total}/100`, res.badge);
    renderInsights(res);
    els.preview.textContent = buildReport(res);
  }

  function onClear() {
    els.pdf.value = "";
    els.cv.value = "";
    els.jd.value = "";
    els.preview.textContent = "Henüz metin çıkarılmadı.";
    hideInsights();
    setState("Hazır.", "Metin tabanlı bir CV PDF yükleyin veya CV metnini yapıştırın.");
    // Reset file label
    const fileText = q("#fileText");
    if (fileText) fileText.textContent = "Dosya Seç";
  }

  /* ===================== PDF ===================== */

  async function extractTextFromPdf(file) {
    if (!window.pdfjsLib) throw new Error("PDF.js not loaded.");

    const buffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    let out = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const txt = await page.getTextContent();
      out += " " + txt.items.map(it => it.str || "").join(" ");
    }
    return out;
  }

  /* ===================== SCORING ===================== */

  function scoreAts(cv, jd) {
    issues = [];
    fixes = [];

    const parse = scoreParse(cv);
    const struct = scoreStructure(cv);
    const kw = scoreKeywords(cv, jd);
    const ev = scoreEvidence(cv);

    const total = clamp(parse + struct + kw + ev, 0, 100);

    return {
      total,
      badge: badgeText(total),
      issues,
      fixes
    };
  }

  function scoreParse(t) {
    let s = 30;

    if (!/@/.test(t)) { s -= 6; issues.push("E-posta tespit edilmedi."); fixes.push("E-postayı düz metin olarak ekleyin."); }
    if (!/\d{4}/.test(t)) { s -= 6; issues.push("Tarihler net tespit edilmedi."); fixes.push("AA/YYYY – AA/YYYY formatını kullanın."); }

    if ((t.match(/[•✓►★]/g) || []).length > 20) {
      s -= 4; issues.push("Çok fazla özel madde işareti."); fixes.push("'-' madde işaretlerini kullanın.");
    }

    return clamp(s, 0, 30);
  }

  function scoreStructure(t) {
    let s = 0;
    const found = SECTION_HINTS.filter(h => h.rx.test(t)).length;
    if (found >= 3) s = 20;
    else { issues.push("Net bölümler eksik."); fixes.push("Deneyim, Yetenekler, Eğitim başlıklarını ekleyin."); }
    return s;
  }

  function scoreKeywords(cv, jd) {
    const base = jd.length >= 80 ? extractKeywords(jd) : FALLBACK_KEYWORDS;
    const set = new Set(cv.toLowerCase().split(/\W+/));
    const hit = base.filter(k => set.has(k)).length;
    if (jd.length < 80) fixes.push("Daha iyi eşleştirme için iş tanımını yapıştırın.");
    return clamp(Math.round((hit / base.length) * 30), 0, 30);
  }

  function scoreEvidence(t) {
    let s = 20;
    if (!/\d+/.test(t)) { s -= 8; issues.push("Ölçülebilir sonuç yok."); fixes.push("Sayı veya yüzde ekleyin."); }
    if (!OWNERSHIP_RX.test(t)) { s -= 4; issues.push("Zayıf sahiplik fiilleri."); fixes.push("Eylem fiilleri kullanın (uyguladı, iyileştirdi…)."); }
    if (GENERIC_RX.test(t)) { s -= 4; issues.push("Genel sorumluluk ifadeleri."); fixes.push("Etki ifadelerine yeniden yazın."); }
    return clamp(s, 0, 20);
  }

  /* ===================== UI ===================== */

  function renderInsights(res) {
    const box = q("#insights");
    const iL = q("#issuesList");
    const fL = q("#fixesList");
    if (!box) return;

    iL.innerHTML = "";
    fL.innerHTML = "";

    res.issues.slice(0, 5).forEach(i => iL.appendChild(li(i)));
    res.fixes.slice(0, 5).forEach(f => fL.appendChild(li(f)));

    box.style.display = "block";
  }

  function hideInsights() {
    const box = q("#insights");
    if (box) box.style.display = "none";
  }

  function buildReport(r) {
    return `ATS Okunabilirlik Skoru: ${r.total}/100

Ana Sorunlar:
${r.issues.map(i => "- " + i).join("\n") || "- Yok"}

Ana Düzeltmeler:
${r.fixes.map(f => "- " + f).join("\n") || "- Yok"}`;
  }

  function badgeText(s) {
    if (s >= 85) return "Mükemmel ATS hazırlığı.";
    if (s >= 70) return "İyi ATS hazırlığı.";
    if (s >= 55) return "Orta ATS hazırlığı.";
    return "Riskli ATS hazırlığı.";
  }

  /* ===================== HELPERS ===================== */

  function extractKeywords(t) {
    return [...new Set(
      t.toLowerCase().split(/\W+/).filter(w => w.length > 2)
    )].slice(0, 50);
  }

  function setState(t, h) {
    els.result.textContent = t;
    const hintEl = q("#resultHint") || els.hint;
    if (hintEl) hintEl.textContent = h || "";
  }

  function setBusy(b) {
    els.btnExtract.disabled = b;
    els.btnScore.disabled = b;
    els.btnClear.disabled = b;
  }

  function normalize(s) {
    return (s || "").replace(/\s+/g, " ").trim();
  }

  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function q(s) { return document.querySelector(s); }
  function li(t) { const x = document.createElement("li"); x.textContent = t; return x; }

})();
