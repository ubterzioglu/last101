// script.js
// Almanya Sigorta Prioritizer (20 soru)
// Çıktı: 3 katman (Önce Al / Güçlü Öneri / Opsiyonel)
// NOT: Bilgilendirme amaçlıdır; detaylar kişisel duruma göre değişebilir.

const QUESTIONS = [
  {
    id: "q1",
    title: "Almanya’da ikamet edeceksin ve resmi kayıt (Anmeldung) yapacak mısın?",
    desc: "Genel sistemlere giriş için ikamet ve kayıt süreçleri çoğu senaryoda temel kabul edilir.",
    type: "yesno",
    weight: { yes: { HEALTH: 3 }, no: { HEALTH: 1 } }
  },
  {
    id: "q2",
    title: "Çalışan mısın? (tam zamanlı/yarı zamanlı/mini-job dışı düzenli iş)",
    desc: "Çalışma şekli bazı sigorta kararlarını etkiler.",
    type: "single",
    options: [
      { key: "employee", label: "Evet, çalışanım", add: { HEALTH: 2, LIABILITY: 2, LEGAL: 1, BU: 2 } },
      { key: "self", label: "Serbest/şirket (freelance)", add: { HEALTH: 2, LIABILITY: 2, LEGAL: 2, BU: 3 } },
      { key: "student", label: "Öğrenciyim", add: { HEALTH: 2, LIABILITY: 3 } },
      { key: "other", label: "Diğer/şu an çalışmıyorum", add: { HEALTH: 2, LIABILITY: 2 } },
    ]
  },
  {
    id: "q3",
    title: "Aileni (eş/çocuk) da kapsayan bir yapı gerekir mi?",
    desc: "Aile durumu bazı poliçe tercihlerini değiştirir.",
    type: "yesno",
    weight: { yes: { HEALTH: 2, LIFE: 2, HOUSEHOLD: 1 }, no: { BU: 1 } }
  },
  {
    id: "q4",
    title: "Araba kullanıyor musun veya Almanya’da araba almayı planlıyor musun?",
    desc: "Araç varsa sigorta tarafı farklı bir “zorunlu” kalem doğurabilir.",
    type: "yesno",
    weight: { yes: { CAR: 5 }, no: { CAR: -2 } }
  },
  {
    id: "q5",
    title: "Evde pahalı eşyaların var mı? (laptop/TV/kamera, vb.)",
    desc: "Hırsızlık/yangın/su basması gibi riskler değerlendirilir.",
    type: "yesno",
    weight: { yes: { HOUSEHOLD: 3 }, no: { HOUSEHOLD: 1 } }
  },
  {
    id: "q6",
    title: "Kiracı mısın, ev sahibi mi olacaksın?",
    desc: "Ev sahipliği bazı ek sigorta türlerini gündeme getirir.",
    type: "single",
    options: [
      { key: "rent", label: "Kiracı", add: { HOUSEHOLD: 2, LIABILITY: 1 } },
      { key: "own", label: "Ev sahibi", add: { BUILDING: 5, LIABILITY: 1, HOUSEHOLD: 2 } },
      { key: "not_sure", label: "Henüz belli değil", add: { HOUSEHOLD: 1 } },
    ]
  },
  {
    id: "q7",
    title: "Çocukların var mı?",
    desc: "Aile riskleri ve gelir güvenliği daha kritik hale gelebilir.",
    type: "yesno",
    weight: { yes: { LIFE: 3, BU: 2, HEALTH: 1 }, no: { LIABILITY: 1 } }
  },
  {
    id: "q8",
    title: "Düzenli olarak bisiklet/e-scooter kullanıyor musun?",
    desc: "Günlük şehir içi kullanımda üçüncü şahıs zararları önemli olabilir.",
    type: "yesno",
    weight: { yes: { LIABILITY: 2, ACCIDENT: 1 }, no: { ACCIDENT: 0 } }
  },
  {
    id: "q9",
    title: "Sık seyahat ediyor musun? (AB içi/dışı)",
    desc: "Seyahat sağlık ekleri ve iptal gibi konular ancak bazı senaryolarda anlamlıdır.",
    type: "single",
    options: [
      { key: "often", label: "Evet, sık", add: { TRAVEL: 4 } },
      { key: "sometimes", label: "Ara sıra", add: { TRAVEL: 2 } },
      { key: "rare", label: "Nadiren", add: { TRAVEL: 0 } },
    ]
  },
  {
    id: "q10",
    title: "Bir hata yapıp başkasına zarar verme riskin yüksek mi? (çocuk, evcil hayvan, yoğun sosyal hayat)",
    desc: "Örneğin birine maddi/bedeni zarar verme gibi riskler.",
    type: "yesno",
    weight: { yes: { LIABILITY: 4 }, no: { LIABILITY: 2 } }
  },
  {
    id: "q11",
    title: "Gelirin kesilmesi seni ciddi zorlar mı? (tek gelir, az birikim, kredi/taahhüt)",
    desc: "Çalışamaz hale gelme gibi senaryolarda “gelir koruma” daha anlamlı hale gelebilir.",
    type: "yesno",
    weight: { yes: { BU: 5 }, no: { BU: 1 } }
  },
  {
    id: "q12",
    title: "Hukuki ihtilaf yaşama ihtimalin var mı? (iş/ev/komşu/taşınma)",
    desc: "Kiracı-ev sahibi, iş sözleşmesi, tüketici anlaşmazlıkları gibi.",
    type: "yesno",
    weight: { yes: { LEGAL: 4 }, no: { LEGAL: 1 } }
  },
  {
    id: "q13",
    title: "Diş masrafları seni düşündürüyor mu? (ortodonti, implant, vb.)",
    desc: "Tamamlayıcı diş sigortası bazı kişilerde anlamlı olabilir.",
    type: "yesno",
    weight: { yes: { DENTAL: 4 }, no: { DENTAL: 0 } }
  },
  {
    id: "q14",
    title: "Riskli/hobisel aktivitelerin var mı? (dağ sporu, motor, ekstrem spor)",
    desc: "Kaza ihtimali artıyorsa kaza sigortası öne çıkabilir.",
    type: "yesno",
    weight: { yes: { ACCIDENT: 4 }, no: { ACCIDENT: 1 } }
  },
  {
    id: "q15",
    title: "Evcil hayvanın var mı? (özellikle köpek)",
    desc: "Bazı hayvanlarda üçüncü şahıs riski artar.",
    type: "single",
    options: [
      { key: "dog", label: "Köpek", add: { PET_LIAB: 5 } },
      { key: "cat", label: "Kedi", add: { PET_LIAB: 1 } },
      { key: "none", label: "Yok", add: { PET_LIAB: 0 } },
    ]
  },
  {
    id: "q16",
    title: "Tehlikeli bir işte/ortamda mı çalışıyorsun? (inşaat, yüksekten çalışma, vb.)",
    desc: "Fiziksel olarak riskli işlerde kaza veya gelir kaybı riski artar.",
    type: "yesno",
    weight: { yes: { ACCIDENT: 2, BU: 2 }, no: { ACCIDENT: 0 } }
  },
  {
    id: "q17",
    title: "Kredi veya büyük borcun var mı? (konut, taşıt vb.)",
    desc: "Borçların varsa hayat sigortası ve gelir koruma daha önemli olabilir.",
    type: "yesno",
    weight: { yes: { LIFE: 3, BU: 2 }, no: { LIFE: 0, BU: 0 } }
  },
  {
    id: "q18",
    title: "Riskli bir bölgede (sel, fırtına vb.) mı yaşıyorsun?",
    desc: "Fiziki riskler arttıkça bina/eşya sigortaları daha anlamlı hale gelebilir.",
    type: "yesno",
    weight: { yes: { BUILDING: 3, HOUSEHOLD: 1 }, no: { BUILDING: 0 } }
  },
  {
    id: "q19",
    title: "Günlük olarak başka araç kullanıyor musun? (motor, büyük taşıt vb.)",
    desc: "Ek araç kullanımı üçüncü şahıs sorumluluğu ve kaza riskini artırır.",
    type: "yesno",
    weight: { yes: { LIABILITY: 2, ACCIDENT: 2 }, no: { LIABILITY: 0 } }
  },
  {
    id: "q20",
    title: "Evde yangın veya su baskını riski var mı? (eski tesisat, fırtına riski)",
    desc: "Bu tür riskler konut/bina ve ev eşyası sigortasını önemli kılar.",
    type: "yesno",
    weight: { yes: { BUILDING: 3, HOUSEHOLD: 2 }, no: { BUILDING: 0 } }
  },
];

// Sigorta “kalemleri” ve puanlama
const INS = {
  HEALTH: { key:"HEALTH", title:"Sağlık Sigortası (Krankenversicherung)", base:10, mustAt:12, shouldAt:9, reasons: [
      "Almanya’da sağlık sigortası çoğu senaryoda temel/olmazsa olmazdır.",
      "Kapsam türü (GKV/PKV) iş durumu ve gelire göre değişebilir.",
      "Kontrol et: GKV/PKV uygunluğu, aile kapsamı, ek katkılar, bekleme/şartlar."
    ]
  },
  LIABILITY: { key:"LIABILITY", title:"Özel Sorumluluk (Privathaftpflicht)", base:8, mustAt:11, shouldAt:8, reasons: [
      "Üçüncü kişiye verilen maddi/bedeni zararlar çok pahalıya çıkabilir.",
      "Günlük hayatta en çok ‘fayda/ücret’ oranı yüksek kalemlerden biridir.",
      "Kontrol et: teminat limiti, aile kapsamı, anahtar kaybı gibi ekler."
    ]
  },
  CAR: { key:"CAR", title:"Araç Sigortası (Kfz-Haftpflicht + opsiyonel kasko)", base:0, mustAt:5, shouldAt:3, reasons: [
      "Araç varsa trafik sorumluluk sigortası çoğu durumda zorunlu kabul edilir.",
      "Kasko ihtiyacı aracın değeri ve risk iştahına göre değişir.",
      "Kontrol et: sınıf/prim, hasarsızlık indirimi, kasko kapsamı."
    ]
  },
  HOUSEHOLD: { key:"HOUSEHOLD", title:"Ev Eşyası (Hausrat)", base:2, mustAt:8, shouldAt:5, reasons: [
      "Hırsızlık/yangın/su gibi risklerde eşyayı korumaya yarar.",
      "Pahalı eşyalar ve kiracılık senaryosunda daha anlamlı hale gelebilir.",
      "Kontrol et: teminat tutarı, bisiklet kapsamı, muafiyet."
    ]
  },
  LEGAL: { key:"LEGAL", title:"Hukuk Koruma (Rechtsschutz)", base:1, mustAt:9, shouldAt:5, reasons: [
      "İş/ev/taşınma dönemlerinde ihtilaf çıkarsa masrafları azaltabilir.",
      "Kapsam paketleri (iş, kira, trafik) ayrı ayrı değerlidir.",
      "Kontrol et: bekleme süresi, kapsam dışı haller, limitler."
    ]
  },
  BU: { key:"BU", title:"Çalışamazlık / Gelir Koruma (Berufsunfähigkeit)", base:1, mustAt:10, shouldAt:6, reasons: [
      "Gelir kesilmesi seni zorluyorsa güçlü bir “risk yönetimi” kalemidir.",
      "Primler yaş, meslek ve sağlık beyanlarına göre değişir.",
      "Kontrol et: tanım (BU), aylık ödeme, beyan/sağlık şartları."
    ]
  },
  LIFE: { key:"LIFE", title:"Risk Hayat (Risikolebensversicherung)", base:0, mustAt:8, shouldAt:4, reasons: [
      "Bakmakla yükümlü olunan kişiler varsa gelir kaybı riskini yönetir.",
      "Mortgage/uzun vadeli taahhütlerde anlamı artar.",
      "Kontrol et: teminat süresi, lehtar, prim/sağlık beyanı."
    ]
  },
  DENTAL: { key:"DENTAL", title:"Diş Tamamlayıcı (Zahnzusatz)", base:0, mustAt:7, shouldAt:4, reasons: [
      "Diş işlemleri pahalı olabilir; beklentin yüksekse değerlendirilebilir.",
      "Kapsam ve bekleme süreleri poliçeye göre değişir.",
      "Kontrol et: bekleme süresi, yıllık limitler, kapsam oranları."
    ]
  },
  ACCIDENT: { key:"ACCIDENT", title:"Kaza Sigortası (Unfallversicherung)", base:0, mustAt:7, shouldAt:4, reasons: [
      "Riskli aktivite/yoğun hareket varsa ek koruma sağlar.",
      "Kaza tanımı ve ödeme şartları ürün bazında farklıdır.",
      "Kontrol et: kaza tanımı, sürekli sakatlık teminatı, kapsam dışıları."
    ]
  },
  TRAVEL: { key:"TRAVEL", title:"Seyahat Sağlık (Auslandsreise-KV) / İptal (opsiyonel)", base:0, mustAt:7, shouldAt:3, reasons: [
      "Sık yurt dışı seyahatinde acil sağlık masrafını yönetebilir.",
      "İptal sigortası sadece belirli senaryolarda mantıklıdır.",
      "Kontrol et: ülke kapsamı, azami süre, muafiyetler."
    ]
  },
  BUILDING: { key:"BUILDING", title:"Konut Bina (Wohngebäude) — ev sahibiysen", base:0, mustAt:7, shouldAt:3, reasons: [
      "Ev sahibiysen bina riskleri (yangın/su/fırtına) önemli olabilir.",
      "Kredi veren kuruluş koşul koyabilir (duruma göre).",
      "Kontrol et: kapsam (Elementar dahil mi), muafiyet, yeniden yapım değeri."
    ]
  },
  PET_LIAB: { key:"PET_LIAB", title:"Evcil Hayvan Sorumluluk (Tierhalterhaftpflicht) — özellikle köpek", base:0, mustAt:7, shouldAt:2, reasons: [
      "Köpek gibi hayvanlarda üçüncü şahıs riski artabilir.",
      "Kapsam hayvan türüne ve koşullara göre değişir.",
      "Kontrol et: teminat limiti, ırk/koşul istisnaları, aile kapsamı."
    ]
  }
};

// Önerilen sağlayıcılar listesi (her sigorta kalemi için)
const PROVIDERS = {
  HEALTH: [
    { name: "TK (Techniker Krankenkasse)", desc: "Almanya'nın en büyük kamu sağlık sigortası (yaklaşık 11 milyon üye)", url: "https://www.tk.de/" },
    { name: "AOK", desc: "Almanya genelinde yaygın bir kamu sağlık sigortası", url: "https://www.aok.de/" },
    { name: "Barmer", desc: "Almanya'nın en büyük kamu sağlık sigortalarından biri", url: "https://www.barmer.de/" }
  ],
  LIABILITY: [
    { name: "Getsafe", desc: "Dijital sigorta şirketi, modern online hizmet sunar", url: "https://getsafe.de" },
    { name: "HUK-Coburg", desc: "Geniş kapsamlı sorumluluk sigortası sunan köklü şirket", url: "https://www.huk.de/" },
    { name: "Allianz", desc: "Dünya çapında büyük bir sigorta şirketi", url: "https://www.allianz.de/" }
  ],
  CAR: [
    { name: "HUK-Coburg", desc: "Almanya'da çok yaygın araç sigortası sağlayıcısı", url: "https://www.huk.de/" },
    { name: "Allianz", desc: "Çeşitli araç sigortası seçenekleri sunan büyük şirket", url: "https://www.allianz.de/" },
    { name: "ADAC", desc: "Alman otomobil kulübü, araç sigortası hizmetleri de sunar", url: "https://www.adac.de/" }
  ],
  HOUSEHOLD: [
    { name: "HUK-Coburg", desc: "Ev eşyası sigortası sunan büyük sağlayıcı", url: "https://www.huk.de/" },
    { name: "Allianz", desc: "Evcilik ve ev eşyası sigortalarında seçenekler sunar", url: "https://www.allianz.de/" },
    { name: "DEVK", desc: "Çeşitli kişisel sigortalar sunan Alman sigorta şirketi", url: "https://www.devk.de/" }
  ],
  LEGAL: [
    { name: "ARAG", desc: "Hukuk koruma sigortasında öncü ve yaygın sağlayıcı", url: "https://www.arag.de/" },
    { name: "D.A.S.", desc: "Almanya'da tanınan bir hukuk koruma sigortası markası", url: "https://www.das.de/" },
    { name: "Allianz", desc: "Hukuk koruma sigortası da sunan büyük sigorta grubu", url: "https://www.allianz.de/" }
  ],
  BU: [
    { name: "Allianz", desc: "Almanya'nın en büyük sigortacılarından biri, gelir koruma sigortası sunar", url: "https://www.allianz.de/" },
    { name: "Debeka", desc: "Devlet memurlarına yakın, uzun vadeli gelir koruma seçenekleri", url: "https://www.debeka.de/" },
    { name: "Signal Iduna", desc: "Çeşitli mesleklere uygun meslek sakatlık sigortaları", url: "https://www.signal-iduna.de/" }
  ],
  LIFE: [
    { name: "Allianz", desc: "Hayat sigortalarında geniş ürün yelpazesi sunan lider şirket", url: "https://www.allianz.de/" },
    { name: "Debeka", desc: "Hayat sigortası alanında tanınan büyük sağlayıcı", url: "https://www.debeka.de/" },
    { name: "R+V", desc: "Kooperatif yapısında, çeşitli risk hayat sigortası seçenekleri", url: "https://www.ruv.de/" }
  ],
  DENTAL: [
    { name: "HanseMerkur", desc: "Tamamlayıcı diş sigortalarında yaygın bir sağlayıcı", url: "https://www.hansemerkur.de/" },
    { name: "DKV (Ergo)", desc: "Diğer tamamlayıcı sigortalarla bilinen güçlü şirket", url: "https://www.ergo.de/" },
    { name: "Barmenia", desc: "Diş sigortaları da sunan büyük sigorta şirketi", url: "https://www.barmenia.de/" }
  ],
  ACCIDENT: [
    { name: "Alte Oldenburger", desc: "Yüzyılı aşkın süredir kaza sigortalarında uzman", url: "https://www.alte-oldenburger.de/" },
    { name: "HUK-Coburg", desc: "Kaza sigortası da dahil çeşitli ürünler sunar", url: "https://www.huk.de/" },
    { name: "Allianz", desc: "Kaza sigortası dahil geniş ürün seçenekleri sunan global şirket", url: "https://www.allianz.de/" }
  ],
  TRAVEL: [
    { name: "ADAC", desc: "Seyahat sigortası da sunan otomobil kulübü", url: "https://www.adac.de/" },
    { name: "ERV (Allianz)", desc: "Almanya'nın öncü seyahat sigortası sağlayıcısı", url: "https://www.ergo-reiseversicherung.de/" },
    { name: "HanseMerkur", desc: "Uygun fiyatlı seyahat sağlık sigortası seçenekleri", url: "https://www.hansemerkur.de/" }
  ],
  BUILDING: [
    { name: "Allianz", desc: "Konut/bina sigortasında geniş seçenekler sunan lider şirket", url: "https://www.allianz.de/" },
    { name: "HUK-Coburg", desc: "Konut sigortası da sunan geniş hizmet sağlayıcısı", url: "https://www.huk.de/" },
    { name: "DEVK (InterRisk)", desc: "Bina sigortalarında önemli ürün seçenekleri", url: "https://www.devk.de/" }
  ],
  PET_LIAB: [
    { name: "HUK-Coburg", desc: "Evcil hayvan sigortası da sunan tanınmış şirket", url: "https://www.huk.de/" },
    { name: "Allianz", desc: "Köpek gibi hayvanlarda sorumluluk sigortası seçenekleri", url: "https://www.allianz.de/" },
    { name: "Uelzener", desc: "Hayvan sigortaları konusunda uzmanlaşmış şirket", url: "https://www.uelzener.de/" }
  ],
};

const state = { index: 0, answers: {} };
const el = {
  qTitle: document.getElementById("qTitle"),
  qDesc: document.getElementById("qDesc"),
  answers: document.getElementById("answers"),
  backBtn: document.getElementById("backBtn"),
  editBtn: document.getElementById("editBtn"),
  restartBtn: document.getElementById("restartBtn"),
  resultCard: document.getElementById("resultCard"),
  resultActionsCard: document.getElementById("resultActionsCard"),
  questionCard: document.getElementById("questionCard"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  copyBtn: document.getElementById("copyBtn"),
  hintText: document.getElementById("hintText"),
  resultBoxes: document.getElementById("resultBoxes"),
};

function debounce(fn, delay = 150){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function calculateAnswersMinHeight(){
  if (!el.answers) return;

  const width = el.answers.clientWidth || el.answers.getBoundingClientRect().width || el.answers.offsetWidth || 320;
  const meas = document.createElement("div");
  meas.className = el.answers.className;
  meas.style.position = "absolute";
  meas.style.visibility = "hidden";
  meas.style.pointerEvents = "none";
  meas.style.left = "-9999px";
  meas.style.top = "-9999px";
  meas.style.width = `${width}px`;
  document.body.appendChild(meas);

  let maxH = 0;
  QUESTIONS.forEach((q) => {
    meas.innerHTML = "";

    if (q.type === "yesno"){
      const opts = [
        { key: "yes", label: "Evet", desc: "Bu durum bende var." },
        { key: "no", label: "Hayır", desc: "Bu durum bende yok." },
      ];
      opts.forEach((o, i) => meas.appendChild(answerCard(q, o, i + 1, false)));
    }

    if (q.type === "single"){
      q.options.forEach((o, i) => meas.appendChild(answerCard(q, o, i + 1, false)));
    }

    maxH = Math.max(maxH, meas.scrollHeight);
  });

  meas.remove();

  if (maxH){
    el.answers.style.minHeight = `${maxH}px`;
  }
}

function init(){
  bindEvents();
  render();
  initInfoToggle();
}

function initInfoToggle(){
  const toggleBtn = document.getElementById("toggleInfo");
  const infoBody = document.getElementById("infoBody");

  if (!toggleBtn || !infoBody) return;

  function toggleSection({ btn, body, showText, hideText }) {
    const willShow = body.classList.contains("hidden");
    body.classList.toggle("hidden", !willShow);
    body.setAttribute("aria-hidden", String(!willShow));
    btn.textContent = willShow ? hideText : showText;
  }

  function setToggleUI(btn, body, showText, hideText) {
    const isHidden = body.classList.contains("hidden");
    body.setAttribute("aria-hidden", String(isHidden));
    btn.textContent = isHidden ? showText : hideText;
  }

  toggleBtn.addEventListener("click", () => toggleSection({
    btn: toggleBtn,
    body: infoBody,
    showText: "Bilgi Aç",
    hideText: "Bilgi Kapat"
  }));

  setToggleUI(toggleBtn, infoBody, "Bilgi Aç", "Bilgi Kapat");
}

function bindEvents(){
  el.backBtn.addEventListener("click", () => {
    if (state.index > 0){
      state.index--;
      render();
    }
  });
  // Cevap seçilince otomatik sonraki soruya geç
  function goNext() {
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      render();
    } else {
      showResult();
    }
  }

  el.editBtn.addEventListener("click", () => {
    resetAll();
  });
  el.restartBtn.addEventListener("click", resetAll);
  if (el.scrollTopBtn){
    el.scrollTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
  window.addEventListener("resize", debounce(calculateAnswersMinHeight, 150));
  el.copyBtn.addEventListener("click", async () => {
    const text = buildCopyText();
    try{
      await navigator.clipboard.writeText(text);
      el.copyBtn.textContent = "Kopyalandı";
      setTimeout(() => (el.copyBtn.textContent = "Sonucu kopyala"), 1200);
    } catch {
      alert("Kopyalama başarısız. Tarayıcı izinlerini kontrol et.");
    }
  });
}

function resetAll(){
  state.index = 0;
  state.answers = {};
  el.resultCard.classList.add("hidden");
  el.resultActionsCard.classList.add("hidden");
  el.questionCard.classList.remove("hidden");
  el.copyBtn.textContent = "Sonucu kopyala";
  render();
}

function render(){
  const q = QUESTIONS[state.index];
  el.qTitle.textContent = q.title;
  el.qDesc.textContent = q.desc || "";

  renderAnswers(q);
  renderNav();
  renderProgress();
}

function renderAnswers(q){
  el.answers.innerHTML = "";
  const selected = state.answers[q.id];

  if (q.type === "yesno"){
    const opts = [
      { key: "yes", label: "Evet", desc: "Bu durum bende var." },
      { key: "no", label: "Hayır", desc: "Bu durum bende yok." },
    ];
    opts.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i+1, selected === o.key)));
    return;
  }

  if (q.type === "single"){
    q.options.forEach((o, i) => el.answers.appendChild(answerCard(q, o, i+1, selected === o.key)));
    return;
  }
}

function answerCard(q, option, badge, isSelected){
  const wrap = document.createElement("div");
  wrap.className = `answer ${isSelected ? "selected" : ""}`;
  wrap.setAttribute("role", "button");
  wrap.setAttribute("tabindex", "0");

  wrap.innerHTML = `
    <div class="badge">${badge}</div>
    <div>
      <div class="answer-title">${option.label}</div>
      ${option.desc ? `<p class="answer-desc">${option.desc}</p>` : ``}
    </div>
  `;

  const select = () => {
    state.answers[q.id] = option.key;
    // Seçimden sonra otomatik ilerle
    if (state.index < QUESTIONS.length - 1) {
      state.index++;
      render();
    } else {
      showResult();
    }
  };

  wrap.addEventListener("click", select);
  wrap.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " "){
      e.preventDefault();
      select();
    }
  });

  return wrap;
}

function renderNav(){
  el.backBtn.disabled = state.index === 0;
  // Next button removed: seçim yapınca otomatik ilerler
  el.hintText.textContent = "Bir şık seçince otomatik ilerler.";
}

function renderProgress(){
  const current = state.index + 1;
  const total = QUESTIONS.length;
  el.progressText.textContent = `Soru ${current} / ${total}`;
  el.progressBar.style.width = `${Math.round((current / total) * 100)}%`;
}

function hasAnswerForCurrent(){
  const q = QUESTIONS[state.index];
  return typeof state.answers[q.id] !== "undefined";
}

function computeScores(){
  const scores = {};
  Object.keys(INS).forEach(k => scores[k] = INS[k].base || 0);

  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    if (q.type === "yesno"){
      const add = q.weight[a] || {};
      for (const k of Object.keys(add)){
        scores[k] = (scores[k] || 0) + add[k];
      }
      continue;
    }

    if (q.type === "single"){
      const opt = q.options.find(o => o.key === a);
      const add = opt?.add || {};
      for (const k of Object.keys(add)){
        scores[k] = (scores[k] || 0) + add[k];
      }
      continue;
    }
  }

  return scores;
}

function classify(scores){
  const must = [];
  const should = [];
  const nice = [];

  for (const key of Object.keys(INS)){
    const item = INS[key];
    const s = scores[key] || 0;

    // Sağlık sigortası zorunlu gibi ele alındı
    if (key === "HEALTH"){
      must.push({ ...item, score: s });
      continue;
    }

    if (s >= item.mustAt) must.push({ ...item, score: s });
    else if (s >= item.shouldAt) should.push({ ...item, score: s });
    else nice.push({ ...item, score: s });
  }

  const sortDesc = (a,b) => b.score - a.score;
  must.sort(sortDesc);
  should.sort(sortDesc);
  nice.sort(sortDesc);

  return { must, should, nice };
}

function renderResultBoxes(must, should, nice){
  el.resultBoxes.innerHTML = "";

  function renderTier({ label, tagClass, items }){
    if (items.length === 0) return;
    const box = document.createElement("section");
    box.className = "card result-card";
    const tagClassName = tagClass ? `tag ${tagClass}` : "tag";
    box.innerHTML = `
      <div class="${tagClassName}">
        <span class="dot"></span>
        <span>${label}</span>
      </div>
      <ul>
        ${items.map(it => `
          <li>
            <span style="color: black;">${escapeHtml(it.title)}</span>
            <div class="result-score" style="color: black;">(Skor: ${it.score})</div>
            <ul style="margin-left: 16px; margin-top: 4px;">
              ${it.reasons.map(r => `<li>${escapeHtml(r)}</li>`).join("")}
            </ul>
            <!-- Onerilen Saglayicilar gosterilmiyor
            ${(PROVIDERS[it.key] || []).length > 0 ? `
              <p style="margin-top: 8px; font-size: 11px; color: black;"><strong>Onerilen Saglayicilar:</strong></p>
              <ul style="margin-left: 16px; font-size: 11px;">
                ${(PROVIDERS[it.key] || []).map(p => `<li><a href="${p.url}" target="_blank" rel="noopener" style="color: rgba(255,255,255,0.9);">${escapeHtml(p.name)}</a> - ${escapeHtml(p.desc)}</li>`).join("")}
              </ul>
            ` : ""}
            -->
          </li>
        `).join("")}
      </ul>
    `;
    el.resultBoxes.appendChild(box);
  }

  renderTier({ label: "Yüksek Öncelikli", tagClass: "", items: must });
  renderTier({ label: "Durumuna Bağlı", tagClass: "purple", items: should });
  renderTier({ label: "Opsiyonel", tagClass: "red", items: nice });

  if (must.length === 0 && should.length === 0 && nice.length === 0) {
    const box = document.createElement("section");
    box.className = "card result-card";
    box.innerHTML = `<p class="muted">Bu katmanda öneri çıkmadı.</p>`;
    el.resultBoxes.appendChild(box);
  }
}

function showResult(){
  const scores = computeScores();
  const { must, should, nice } = classify(scores);

  renderResultBoxes(must, should, nice);

  el.questionCard.classList.add("hidden");
  el.resultCard.classList.remove("hidden");
  el.resultActionsCard.classList.remove("hidden");
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildCopyText(){
  const scores = computeScores();
  const { must, should, nice } = classify(scores);

  const lines = [];
  lines.push("almanya101 — Sigorta Prioritizer Sonuç");
  lines.push("--------------------------------------");
  lines.push("YÜKSEK ÖNCELİKLİ:");
  must.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
  lines.push("");
  lines.push("DURUMUNA BAĞLI:");
  should.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
  lines.push("");
  lines.push("OPSİYONEL:");
  nice.forEach(x => lines.push(`- ${x.title} (Skor: ${x.score})`));
  lines.push("");
  lines.push("Cevaplar:");
  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    let label = a;
    if (q.type === "yesno") label = (a === "yes" ? "Evet" : "Hayır");
    if (q.type === "single"){
      label = q.options.find(o => o.key === a)?.label || a;
    }
    lines.push(`- ${q.title} → ${label}`);
  }
  lines.push("");
  lines.push("Not: Bu çıktı bilgilendirme amaçlıdır; sözleşme öncesi kapsam/şartları kontrol et.");

  return lines.join("\n");
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll("\"","&quot;")
    .replaceAll("'","&#039;");
}

init();
