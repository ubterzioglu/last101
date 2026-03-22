// almanya101 — Banka Seçici (15 soru)
// Profil skorları: DIGITAL, DIRECT, LOCAL, EXPAT, INVEST
// Sonuç: en yüksek 3 profil + kısa kontrol listesi

// almanya101 — Banka Seçici (20 soru)
// Profil skorları: DIGITAL, DIRECT, LOCAL, EXPAT, INVEST, CRYPTO, LOW_COST, BRANCH
// Sonuç: gerçek bankalar (Almanya) + nedenleri

const PROFILES = {
  DIGITAL:  { key:"DIGITAL",  title:"Dijital (app-first)" },
  DIRECT:   { key:"DIRECT",   title:"Direkt/Online (şubesiz ama klasik)" },
  LOCAL:    { key:"LOCAL",    title:"Yerel/Klasik (şube + danışman)" },
  EXPAT:    { key:"EXPAT",    title:"Expat/Dil-dostu" },
  INVEST:   { key:"INVEST",   title:"Borsa/ETF odaklı" },
  CRYPTO:   { key:"CRYPTO",   title:"Kripto odaklı" },
  LOW_COST: { key:"LOW_COST", title:"Masraf hassasiyeti" },
  BRANCH:   { key:"BRANCH",   title:"Şube ihtiyacı" },
};

const BANKS = [
  {
    id: "n26",
    name: "N26",
    type: "Mobil banka",
    // app-first + yatırım/kripto + expat
    weights: { DIGITAL: 5, DIRECT: 2, EXPAT: 3, INVEST: 3, CRYPTO: 3, LOW_COST: 3, BRANCH: -4, LOCAL: -3 }
  },
  {
    id: "revolut",
    name: "Revolut",
    type: "Fintech (banka/EMI)",
    // güçlü expat + kripto, yatırım basit
    weights: { DIGITAL: 5, EXPAT: 4, CRYPTO: 4, INVEST: 2, LOW_COST: 2, DIRECT: 1, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: "ing",
    name: "ING",
    type: "Direkt banka",
    // düşük masraf + yatırım
    weights: { DIRECT: 5, INVEST: 4, LOW_COST: 4, DIGITAL: 2, EXPAT: 1, BRANCH: -3, LOCAL: -2, CRYPTO: 0 }
  },
  {
    id: "dkb",
    name: "DKB",
    type: "Direkt banka",
    weights: { DIRECT: 4, INVEST: 4, LOW_COST: 3, DIGITAL: 2, EXPAT: 1, BRANCH: -3, LOCAL: -2, CRYPTO: 0 }
  },
  {
    id: "sparkasse",
    name: "Sparkasse",
    type: "Yerel banka (şubeli)",
    // şube + yerel erişim
    weights: { LOCAL: 5, BRANCH: 5, INVEST: 2, DIGITAL: 1, DIRECT: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 1 }
  },
  {
    id: "volksbank",
    name: "Volksbank / Raiffeisenbank",
    type: "Yerel banka (şubeli)",
    weights: { LOCAL: 5, BRANCH: 5, INVEST: 2, DIGITAL: 1, DIRECT: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 1 }
  },
  {
    id: "commerzbank",
    name: "Commerzbank",
    type: "Geleneksel banka",
    weights: { LOCAL: 3, BRANCH: 3, DIRECT: 2, INVEST: 3, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "deutschebank",
    name: "Deutsche Bank",
    type: "Geleneksel banka",
    weights: { LOCAL: 3, BRANCH: 2, DIRECT: 1, INVEST: 3, DIGITAL: 1, LOW_COST: -2, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "traderepublic",
    name: "Trade Republic",
    type: "Yatırım uygulaması (broker)",
    // yatırım + bazı kullanıcılar için kripto
    weights: { INVEST: 6, LOW_COST: 3, DIGITAL: 3, CRYPTO: 2, DIRECT: 1, EXPAT: 0, BRANCH: -6, LOCAL: -4 }
  },

  {
    id: "c24",
    name: "C24 Bank",
    type: "Direkt banka (app ağırlıklı)",
    // dijital + düşük masraf; şube beklentisi olmayanlar
    weights: { DIGITAL: 4, DIRECT: 4, LOW_COST: 4, EXPAT: 1, INVEST: 1, CRYPTO: 0, BRANCH: -4, LOCAL: -3 }
  },
  {
    id: "comdirect",
    name: "comdirect",
    type: "Direkt banka (Commerzbank grubu)",
    // direkt banka + yatırım ürünleri güçlü
    weights: { DIRECT: 4, INVEST: 5, LOW_COST: 2, DIGITAL: 2, EXPAT: 0, CRYPTO: 0, BRANCH: -2, LOCAL: -1 }
  },
  {
    id: "consorsbank",
    name: "Consorsbank",
    type: "Direkt banka / broker (BNP Paribas)",
    // yatırım odaklı + düşük/orta masraf
    weights: { DIRECT: 3, INVEST: 5, LOW_COST: 2, DIGITAL: 2, EXPAT: 0, CRYPTO: 0, BRANCH: -3, LOCAL: -2 }
  },
  {
    id: "targobank",
    name: "Targobank",
    type: "Geleneksel banka (şubeli)",
    // şube isteyenler; yerel erişim orta
    weights: { LOCAL: 3, BRANCH: 4, DIRECT: 1, INVEST: 2, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "postbank",
    name: "Postbank",
    type: "Geleneksel banka (şubeli)",
    // şube + temel bankacılık; masraf hassasiyeti düşük olanlar
    weights: { LOCAL: 3, BRANCH: 4, DIRECT: 1, INVEST: 2, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "hvb",
    name: "HypoVereinsbank (UniCredit)",
    type: "Geleneksel banka",
    // şube + yatırım/varlık ürünleri; daha geleneksel beklenti
    weights: { LOCAL: 3, BRANCH: 3, DIRECT: 1, INVEST: 3, DIGITAL: 1, LOW_COST: -1, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "santander",
    name: "Santander",
    type: "Banka (şubeli/karma)",
    // kredi/finansman kullananlar için; yerel erişim orta
    weights: { LOCAL: 2, BRANCH: 2, DIRECT: 2, INVEST: 1, DIGITAL: 1, LOW_COST: 0, EXPAT: 0, CRYPTO: 0 }
  },
  {
    id: "bunq",
    name: "bunq",
    type: "Mobil banka (AB fintech)",
    // expat + dijital; şube yok
    weights: { DIGITAL: 5, EXPAT: 4, DIRECT: 2, LOW_COST: 1, INVEST: 0, CRYPTO: 0, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: "tomorrow",
    name: "Tomorrow",
    type: "Mobil banka (sürdürülebilir odak)",
    // dijital; şube yok; masraf hassasiyeti orta
    weights: { DIGITAL: 4, DIRECT: 2, LOW_COST: 1, EXPAT: 1, INVEST: 0, CRYPTO: 0, BRANCH: -5, LOCAL: -4 }
  },
  {
    id: "wise",
    name: "Wise",
    type: "Fintech (çoklu para / transfer)",
    // expat + düşük maliyetli transfer; klasik banka gibi değil
    weights: { DIGITAL: 4, EXPAT: 5, LOW_COST: 4, DIRECT: 1, INVEST: 0, CRYPTO: 0, BRANCH: -6, LOCAL: -5 }
  },
  {
    id: "vivid",
    name: "Vivid Money",
    type: "Fintech (hesap & kart)",
    // dijital + expat; yatırım özellikleri sınırlı
    weights: { DIGITAL: 4, EXPAT: 3, LOW_COST: 2, DIRECT: 1, INVEST: 1, CRYPTO: 1, BRANCH: -5, LOCAL: -4 }
  },

];

const QUESTIONS = [
  {
    id: "q1",
    title: "Almanya’da ne zamandır yaşıyorsun?",
    desc: "Yeni gelenler için dil/kurulum kolaylığı; yerleşik olanlar için şube/danışmanlık ihtiyaçları değişir.",
    type: "single",
    options: [
      { key: "new", label: "Yeni geldim (0–1 yıl)", desc: "Kurulum hızlı olsun.", add: { EXPAT: 3, DIGITAL: 2, DIRECT: 1 } },
      { key: "mid", label: "1–5 yıl", desc: "Dijital + sağlam denge.", add: { DIRECT: 2, DIGITAL: 1 } },
      { key: "old", label: "5+ yıl", desc: "Yerel işler de önemli.", add: { LOCAL: 2 } },
    ]
  },
  {
    id: "q2",
    title: "Almanca seviyen nasıl?",
    desc: "Dil bariyeri varsa expat/dil-dostu ve güçlü uygulama desteği kritik olur.",
    type: "single",
    options: [
      { key: "low", label: "Zayıf / İngilizce tercih", desc: "Support & UI önemli.", add: { EXPAT: 3, DIGITAL: 2 } },
      { key: "mid", label: "Orta", desc: "Denge.", add: { DIRECT: 2 } },
      { key: "high", label: "İyi / çok iyi", desc: "Klasik bankalar da rahat.", add: { LOCAL: 2 } },
    ]
  },
  {
    id: "q3",
    title: "Yaşadığın yer daha çok…",
    desc: "Şube/ATM ihtiyacı, yaşadığın lokasyona göre değişir.",
    type: "single",
    options: [
      { key: "city", label: "Büyük şehir merkezi", desc: "Mobil/dijital çok rahat.", add: { DIGITAL: 2 } },
      { key: "suburb", label: "Banliyö", desc: "Direkt bankalar iyi denge.", add: { DIRECT: 2 } },
      { key: "town", label: "Küçük şehir/kasaba", desc: "Şube yakınlığı önemli olabilir.", add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
  {
    id: "q4",
    title: "Şubeye gitme ihtiyacın olur mu?",
    desc: "Nakit yatırma, danışmanlık, özel işlemler…",
    type: "single",
    options: [
      { key: "never", label: "Asla", desc: "Tam dijital.", add: { DIGITAL: 3, DIRECT: 1 } },
      { key: "rare", label: "Nadiren", desc: "Arada bir.", add: { DIRECT: 2 } },
      { key: "often", label: "Evet, önemli", desc: "Şube şart.", add: { BRANCH: 4, LOCAL: 3 } },
    ]
  },
  {
    id: "q5",
    title: "En çok hangisi canını sıkar?",
    desc: "Birincil ağrı noktanı seç: buna göre öneri keskinleşir.",
    type: "single",
    options: [
      { key: "fees", label: "Yüksek ücretler", desc: "Masraf hassasiyeti.", add: { LOW_COST: 4 } },
      { key: "app", label: "Kötü mobil uygulama", desc: "App-first.", add: { DIGITAL: 4 } },
      { key: "support", label: "Ulaşılamayan destek", desc: "Şube/telefon önemli.", add: { BRANCH: 3, LOCAL: 1 } },
    ]
  },
  {
    id: "q6",
    title: "Aylık hesap ücreti konusunda yaklaşımın?",
    desc: "Ücret toleransı, banka tipini direkt etkiler.",
    type: "single",
    options: [
      { key: "nope", label: "Asla", desc: "0€ hedef.", add: { LOW_COST: 4, DIGITAL: 1, DIRECT: 1 } },
      { key: "maybe", label: "Makul olursa", desc: "Denge.", add: { DIRECT: 2 } },
      { key: "ok", label: "Sorun değil", desc: "Şube/danışmanlık için ödeyebilirim.", add: { LOCAL: 2, BRANCH: 1 } },
    ]
  },
  {
    id: "q7",
    title: "SEPA havale/transfer sıklığın?",
    desc: "Sık transfer yapanlar için masraf + hız önemli.",
    type: "single",
    options: [
      { key: "often", label: "Çok sık", desc: "Masrafsız/hızlı olsun.", add: { LOW_COST: 2, DIGITAL: 2 } },
      { key: "sometimes", label: "Ara sıra", desc: "Denge.", add: { DIRECT: 1 } },
      { key: "rare", label: "Nadiren", desc: "Öncelik başka.", add: { LOCAL: 1 } },
    ]
  },
  {
    id: "q8",
    title: "Nakit kullanımı senin için…",
    desc: "Almanya’da hâlâ nakit seven çok kişi var 🙂",
    type: "single",
    options: [
      { key: "none", label: "Neredeyse hiç", desc: "Tam kart.", add: { DIGITAL: 2 } },
      { key: "some", label: "Bazen", desc: "Ara ara.", add: { DIRECT: 1 } },
      { key: "often", label: "Sık sık", desc: "Nakit yatırma/çekme kolay olsun.", add: { BRANCH: 3, LOCAL: 2 } },
    ]
  },
  {
    id: "q9",
    title: "ATM yakınlığı/erişimi önemli mi?",
    desc: "Banliyöde/taşrada ATM ve şube fark yaratır.",
    type: "single",
    options: [
      { key: "no", label: "Değil", desc: "Dijital yaşam.", add: { DIGITAL: 1 } },
      { key: "any", label: "Evet ama fark etmez", desc: "Genel erişim yeter.", add: { DIRECT: 2 } },
      { key: "near", label: "Evet, yakın olsun", desc: "Yerel ağ avantaj.", add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
  {
    id: "q10",
    title: "Kart tercihinde hangisi ağır basıyor?",
    desc: "Debit vs kredi vs klasik Girocard.",
    type: "single",
    options: [
      { key: "debit", label: "Sadece debit", desc: "Basit.", add: { DIGITAL: 1 } },
      { key: "both", label: "Debit + kredi", desc: "Esneklik.", add: { DIRECT: 2 } },
      { key: "giro", label: "Klasik (Girocard vs.)", desc: "Yerel uyum.", add: { LOCAL: 2 } },
    ]
  },
  {
    id: "q11",
    title: "Borsa/ETF yatırımı yapıyor musun?",
    desc: "Yatırım odaklı bankalar/brokerlar farklı.",
    type: "single",
    options: [
      { key: "active", label: "Evet, aktif", desc: "Sık al-sat / düzenli yatırım.", add: { INVEST: 4, LOW_COST: 2 } },
      { key: "sometimes", label: "Ara sıra", desc: "Kolay olsun.", add: { INVEST: 2 } },
      { key: "no", label: "Hayır", desc: "Şimdilik yok.", add: { } },
    ]
  },
  {
    id: "q12",
    title: "Yatırımda senin için en önemli şey?",
    desc: "Komisyon mu, güven mi, kullanım kolaylığı mı?",
    type: "single",
    options: [
      { key: "fees", label: "Düşük komisyon", desc: "Masraf kritik.", add: { INVEST: 2, LOW_COST: 3 } },
      { key: "trust", label: "Banka güvencesi", desc: "Klasik güven.", add: { LOCAL: 2 } },
      { key: "easy", label: "Mobil kolaylık", desc: "Tek app.", add: { DIGITAL: 2, INVEST: 1 } },
    ]
  },
  {
    id: "q13",
    title: "Kripto ile ilişkin nedir?",
    desc: "Kripto aktifse doğru kanal seçimi çok fark eder.",
    type: "single",
    options: [
      { key: "active", label: "Aktif alım-satım", desc: "Kripto şart.", add: { CRYPTO: 4, DIGITAL: 2 } },
      { key: "curious", label: "Merak ediyorum", desc: "Denemelik.", add: { CRYPTO: 2 } },
      { key: "none", label: "Hiç ilgim yok", desc: "Gerek yok.", add: { } },
    ]
  },
  {
    id: "q14",
    title: "Kripto nerede dursun istersin?",
    desc: "Bankada mı, ayrı platformda mı?",
    type: "single",
    options: [
      { key: "inbank", label: "Bankada/uygulamada olsun", desc: "Tek yer.", add: { CRYPTO: 3, DIGITAL: 1 } },
      { key: "separate", label: "Ayrı platform olur", desc: "Önemli değil.", add: { INVEST: 1 } },
      { key: "no", label: "Hiç gerek yok", desc: "Kapat gitsin.", add: { LOCAL: 1 } },
    ]
  },
  {
    id: "q15",
    title: "Finansı tek uygulamada mı yönetmek istersin?",
    desc: "Bankacılık + yatırım + kripto gibi.",
    type: "single",
    options: [
      { key: "one", label: "Evet, tek uygulama", desc: "Basit.", add: { DIGITAL: 3 } },
      { key: "any", label: "Fark etmez", desc: "Denge.", add: { DIRECT: 1 } },
      { key: "separate", label: "Ayrı olsun", desc: "Daha kontrollü.", add: { LOCAL: 1 } },
    ]
  },
  {
    id: "q16",
    title: "Banka seçerken en önemli kriter hangisi?",
    desc: "Tek bir şey seç: algoritma bunu ‘weight’ gibi kullanır.",
    type: "single",
    options: [
      { key: "trust", label: "Güven & köklülük", desc: "Klasik.", add: { LOCAL: 3, BRANCH: 1 } },
      { key: "speed", label: "Hız & teknoloji", desc: "Modern.", add: { DIGITAL: 3 } },
      { key: "balance", label: "Dengeli olsun", desc: "Direkt bankalar.", add: { DIRECT: 3 } },
    ]
  },
  {
    id: "q17",
    title: "Müşteri hizmetlerine erişim beklentin?",
    desc: "Telefon/şube/online chat farkı.",
    type: "single",
    options: [
      { key: "high", label: "Çok önemli", desc: "Ulaşayım.", add: { BRANCH: 3, LOCAL: 1 } },
      { key: "mid", label: "Orta", desc: "Ara sıra.", add: { DIRECT: 2 } },
      { key: "low", label: "Hiç önemli değil", desc: "Self-serve.", add: { DIGITAL: 2 } },
    ]
  },
  {
    id: "q18",
    title: "Hesabın bloke/kapanma riski seni ne kadar gerer?",
    desc: "KYC/AML süreçleri bazı fintechlerde daha sert hissedilebilir.",
    type: "single",
    options: [
      { key: "yes", label: "Evet, çok gerer", desc: "Daha klasik isterim.", add: { LOCAL: 2, DIRECT: 1 } },
      { key: "some", label: "Biraz", desc: "Denge.", add: { DIRECT: 1 } },
      { key: "no", label: "Hayır", desc: "Sorun değil.", add: { DIGITAL: 1 } },
    ]
  },
  {
    id: "q19",
    title: "Banka değiştirmeye ne kadar açıksın?",
    desc: "Esneklik yüksekse fintech/dijital daha mantıklı olur.",
    type: "single",
    options: [
      { key: "open", label: "Çok açık", desc: "Deneyeyim.", add: { DIGITAL: 2 } },
      { key: "maybe", label: "Gerekirse", desc: "Denge.", add: { DIRECT: 1 } },
      { key: "hard", label: "Zor", desc: "Kök saldım.", add: { LOCAL: 2 } },
    ]
  },
  {
    id: "q20",
    title: "İdeal banka senin için hangisi?",
    desc: "Son soru: içgüdüsel tercihin.",
    type: "single",
    options: [
      { key: "free", label: "Masrafsız & mobil", desc: "0€ + iyi app.", add: { DIGITAL: 2, LOW_COST: 2 } },
      { key: "balanced", label: "Dengeli & güvenli", desc: "Online ama sağlam.", add: { DIRECT: 2 } },
      { key: "branch", label: "Şubeli & klasik", desc: "Yüz yüze.", add: { LOCAL: 2, BRANCH: 2 } },
    ]
  },
];


const state = { index: 0, answers: {} };

const el = {
  qTitle: document.getElementById("qTitle"),
  qDesc: document.getElementById("qDesc"),
  answers: document.getElementById("answers"),
  backBtn: document.getElementById("backBtn"),  editBtn: document.getElementById("editBtn"),
  restartBtn: document.getElementById("restartBtn"),
  resultCard: document.getElementById("resultCard"),
  resultBoxes: document.getElementById("resultBoxes"),
  progressText: document.getElementById("progressText"),
  progressBar: document.getElementById("progressBar"),
  copyBtn: document.getElementById("copyBtn"),
  hintText: document.getElementById("hintText"),
};

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

  el.editBtn.addEventListener("click", () => {
    resetAll();
  });

  el.restartBtn.addEventListener("click", resetAll);

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
  el.copyBtn.textContent = "Sonucu kopyala";
  render();
}

function render(){
  el.resultCard.classList.add("hidden");

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
      { key: "yes", label: "Evet", desc: "Bana uyuyor." },
      { key: "no", label: "Hayır", desc: "Bana uymuyor." },
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

    const isLast = state.index === QUESTIONS.length - 1;
    if (!isLast){
      state.index++;
      render();
      return;
    }
    showResult();
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
  Object.keys(PROFILES).forEach(k => (scores[k] = 0));

  for (const q of QUESTIONS){
    const a = state.answers[q.id];
    if (typeof a === "undefined") continue;

    if (q.type === "yesno"){
      const w = q.weight[a];
      for (const k of Object.keys(w || {})) scores[k] += w[k];
      continue;
    }

    if (q.type === "single"){
      const opt = (q.options || []).find(o => o.key === a);
      const add = (opt && opt.add) ? opt.add : {};
      for (const k of Object.keys(add)) scores[k] += add[k];
      continue;
    }
  }
  return scores;
}

function bankScore(bank, scores){
  let total = 0;
  for (const k of Object.keys(PROFILES)){
    const s = scores[k] || 0;
    const w = bank.weights[k] || 0;
    total += s * w;
  }
  return total;
}

function pickTopBanks(scores, n=3){
  const ranked = BANKS
    .map(b => ({ ...b, score: bankScore(b, scores) }))
    .sort((a,b) => b.score - a.score);

  return ranked.slice(0, n);
}

function needsFromScores(scores){
  return {
    wantsLowCost: (scores.LOW_COST || 0) >= 4,
    wantsBranch:  (scores.BRANCH || 0) >= 4 || (scores.LOCAL || 0) >= 5,
    wantsCrypto:  (scores.CRYPTO || 0) >= 4,
    wantsInvest:  (scores.INVEST || 0) >= 4,
    wantsExpat:   (scores.EXPAT || 0) >= 4,
    wantsDigital: (scores.DIGITAL || 0) >= 5,
    wantsDirect:  (scores.DIRECT || 0) >= 5,
  };
}

function buildBankRecommendations(topBanks, scores){
  const needs = needsFromScores(scores);

  const topSignals = Object.keys(scores)
    .map(k => ({ key:k, score:scores[k] || 0 }))
    .sort((a,b) => b.score - a.score)
    .filter(x => x.score > 0)
    .slice(0, 3);

  return topBanks.map((b, idx) => {
    const bullets = [];

    // User-driven bullets
    if (needs.wantsLowCost){
      if ((b.weights.LOW_COST || 0) >= 2) bullets.push("Masraf hassasiyetin yüksek: daha düşük/şeffaf ücret yapısına yakın.");
      else bullets.push("Masraf hassasiyetin yüksek: bu seçenekte ücret/koşulları özellikle kontrol et.");
    }
    if (needs.wantsBranch){
      if ((b.weights.BRANCH || 0) >= 2) bullets.push("Şube ihtiyacın var: yerel/şubeli yapı daha uygun.");
      else bullets.push("Şube ihtiyacın var: bu seçenek şubesiz/az şubeli olabilir.");
    }
    if (needs.wantsCrypto){
      if ((b.weights.CRYPTO || 0) >= 2) bullets.push("Kripto ilgine daha uygun bir seçenek.");
      else bullets.push("Kripto istiyorsun: bu seçenekte kripto genelde harici platformla olur.");
    }
    if (needs.wantsInvest){
      if ((b.weights.INVEST || 0) >= 3) bullets.push("Borsa/ETF tarafında güçlü bir aday.");
      else bullets.push("Borsa/ETF istiyorsun: bu seçenekte yatırım tarafını ayrıca doğrula.");
    }
    if (needs.wantsExpat){
      if ((b.weights.EXPAT || 0) >= 2) bullets.push("Dil/kurulum açısından expat dostu tarafa daha yakın.");
      else bullets.push("Expat ihtiyaçların var: dil/kurulum süreçlerini kontrol et.");
    }

    // Bank-specific quick notes
    if (b.id === "sparkasse" || b.id === "volksbank"){
      bullets.push("Yerel şube/ATM erişimi genelde güçlü olur; şehir/kasaba fark etmeksizin rahat eder.");
    }
    if (b.id === "n26"){
      bullets.push("Tam mobil deneyim: hızlı kurulum + uygulama odaklı kullanım.");
    }
    if (b.id === "ing" || b.id === "dkb"){
      bullets.push("Direkt banka çizgisi: dijital kullanım + daha ‘klasik banka’ hissi dengesi.");
    }
    if (b.id === "traderepublic"){
      bullets.push("Bu bir banka hesabından ziyade yatırım odaklı uygulamadır; ana banka yanında kullanmak mantıklı olabilir.");
    }

    // Show 2–3 signal tags (for UI)
    const tags = topSignals
      .map(s => PROFILES[s.key]?.title)
      .filter(Boolean)
      .slice(0, 3);

    return { bank: b, rank: idx+1, tags, bullets };
  });
}

function showResult(){
  const scores = computeScores();
  const topBanks = pickTopBanks(scores, 3);
  const recs = buildBankRecommendations(topBanks, scores);

  el.resultBoxes.innerHTML = "";

  recs.forEach((r) => {
    const box = document.createElement("div");
    box.className = "result-box";

    const tagHtml = (r.tags || []).map(t => `<span class="chip">${escapeHtml(t)}</span>`).join("");

    box.innerHTML = `
      <div class="tag">
        <span class="dot"></span>
        <span>#${r.rank} • ${escapeHtml(r.bank.name)} <span class="muted">(${escapeHtml(r.bank.type)})</span></span>
      </div>
      <div class="chips">${tagHtml}</div>
      <h3>Uygunluk Skoru: ${Math.round(r.bank.score)}</h3>
      <ul>
        ${r.bullets.slice(0,5).map(b => `<li>${escapeHtml(b)}</li>`).join("")}
      </ul>
    `;

    el.resultBoxes.appendChild(box);
  });

  el.resultCard.classList.remove("hidden");
  el.resultCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function buildCopyText(){
  const scores = computeScores();
  const topBanks = pickTopBanks(scores, 3);
  const recs = buildBankRecommendations(topBanks, scores);

  let out = "almanya101.de • Banka Seçimi Sonucu\n\n";
  recs.forEach(r => {
    out += `#${r.rank} ${r.bank.name} (${r.bank.type}) — Skor: ${Math.round(r.bank.score)}\n`;
    r.bullets.slice(0,3).forEach(b => (out += `- ${b}\n`));
    out += "\n";
  });

  out += "Not: Ücretler/koşullar değişebilir. Son karardan önce bankanın güncel şartlarını kontrol et.\n";
  return out;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

init();
