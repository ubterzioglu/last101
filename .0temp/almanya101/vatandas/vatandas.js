const cfg = window.ALMANYA101_SUPABASE || {};
const stateEl = document.getElementById('state');

if (!cfg.url || !cfg.anonKey) {
    showState('Supabase ayarı bulunamadı. supabase-config.js dosyasını kontrol et.');
} else if (typeof supabase === 'undefined') {
    showState('Supabase kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin.');
}

const supabaseClient = cfg.url && cfg.anonKey && typeof supabase !== 'undefined'
    ? supabase.createClient(cfg.url, cfg.anonKey)
    : null;

const introScreen = document.getElementById('intro-screen');
const startButtons = Array.from(document.querySelectorAll('[data-mode]'));
const stateSelect = document.getElementById('eyalet-state');
const mixSelect = document.getElementById('eyalet-mix');
const testAlani = document.getElementById('test-alani');
const soruSayaci = document.getElementById('soru-sayaci');
const soruGorsel = document.getElementById('soru-gorsel');
const soruAlmanca = document.getElementById('soru-almanca');
const soruTurkce = document.getElementById('soru-turkce');
const seceneklerContainer = document.getElementById('secenekler-container');
const sonrakiBtn = document.getElementById('sonraki-btn');
const sonucAlani = document.getElementById('sonuc-alani');
const toplamSoruSpan = document.getElementById('toplam-soru');
const dogruSayisiSpan = document.getElementById('dogru-sayisi');
const modaDonBtn = document.getElementById('moda-don-btn');
const modaDonBtnAlt = document.getElementById('moda-don-btn-alt');
const timerEl = document.getElementById('timer');

if (!supabaseClient) {
    testAlani.style.display = 'none';
    sonucAlani.style.display = 'none';
    startButtons.forEach((btn) => {
        btn.disabled = true;
    });
    if (stateSelect) stateSelect.disabled = true;
    if (mixSelect) mixSelect.disabled = true;
}

let sorular = [];
let mevcutSoruIndex = 0;
let dogruSayisi = 0;
let cevapVerildi = false;
let yukleniyor = false;
let aktifMod = '';
let seciliEyalet = '';
let timerId = null;
let kalanSure = 0;

function showState(msg) {
    if (!stateEl) return;
    stateEl.style.display = 'block';
    stateEl.textContent = msg;
}

function hideState() {
    if (!stateEl) return;
    stateEl.style.display = 'none';
    stateEl.textContent = '';
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function stopTimer() {
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
    if (timerEl) {
        timerEl.textContent = '';
    }
}

function startTimer(seconds) {
    if (!timerEl) return;
    stopTimer();
    kalanSure = seconds;
    timerEl.textContent = formatTime(kalanSure);
    timerId = setInterval(() => {
        kalanSure -= 1;
        if (kalanSure <= 0) {
            stopTimer();
            testiBitir();
            return;
        }
        timerEl.textContent = formatTime(kalanSure);
    }, 1000);
}

function setLoading(isLoading) {
    yukleniyor = isLoading;
    sonrakiBtn.disabled = isLoading;
    if (isLoading) {
        showState('Sorular yükleniyor...');
    }
    startButtons.forEach((btn) => {
        btn.disabled = isLoading;
    });
    if (stateSelect) stateSelect.disabled = isLoading;
    if (mixSelect) mixSelect.disabled = isLoading;
}

function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function normalizeSecenekler(value) {
    if (!value) return {};
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch {
            return {};
        }
    }
    return value;
}

function showIntro(keepState = false) {
    if (introScreen) {
        introScreen.style.display = 'block';
    }
    testAlani.style.display = 'none';
    sonucAlani.style.display = 'none';
    stopTimer();
    if (!keepState) {
        hideState();
    }
}

function hideIntro() {
    if (introScreen) {
        introScreen.style.display = 'none';
    }
}

async function sorulariYukle() {
    if (!supabaseClient) {
        testAlani.style.display = 'none';
        return;
    }

    setLoading(true);
    let hazirSorular = [];
    if (aktifMod === 'all') {
        const { data, error } = await supabaseClient
            .from('vatandaslik_sorulari')
            .select('*')
            .eq('eyalet', 'Genel');

        if (error) {
            console.error('Sorular yüklenirken hata oluştu:', error);
            showState('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            showState('Genel soru bulunamadı.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        hazirSorular = shuffle(data).slice(0, 300);
    } else if (aktifMod === 'state') {
        const { data, error } = await supabaseClient
            .from('vatandaslik_sorulari')
            .select('*')
            .eq('eyalet', seciliEyalet);

        if (error) {
            console.error('Sorular yüklenirken hata oluştu:', error);
            showState('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            showState('Bu eyalet için soru bulunamadı.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        hazirSorular = shuffle(data).slice(0, 10);
    } else if (aktifMod === 'real') {
        const [generalRes, stateRes] = await Promise.all([
            supabaseClient.from('vatandaslik_sorulari').select('*').eq('eyalet', 'Genel'),
            supabaseClient.from('vatandaslik_sorulari').select('*').eq('eyalet', seciliEyalet)
        ]);

        if (generalRes.error || stateRes.error) {
            console.error('Sorular yüklenirken hata oluştu:', generalRes.error || stateRes.error);
            showState('Sorular yüklenemedi. Lütfen daha sonra tekrar deneyin.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        if (!generalRes.data || generalRes.data.length < 30) {
            showState('Genel soru sayısı yetersiz.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        if (!stateRes.data || stateRes.data.length < 3) {
            showState('Seçilen eyalet için yeterli soru bulunamadı.');
            testAlani.style.display = 'none';
            showIntro(true);
            setLoading(false);
            return;
        }

        const genelSorular = shuffle(generalRes.data).slice(0, 30);
        const eyaletSorular = shuffle(stateRes.data).slice(0, 3);
        hazirSorular = shuffle([...genelSorular, ...eyaletSorular]);
    }

    if (!hazirSorular || hazirSorular.length === 0) {
        showState('Soru bulunamadı.');
        testAlani.style.display = 'none';
        showIntro(true);
        setLoading(false);
        return;
    }

    hideState();
    sorular = hazirSorular;
    mevcutSoruIndex = 0;
    dogruSayisi = 0;
    sonucAlani.style.display = 'none';
    testAlani.style.display = 'block';
    if (aktifMod === 'real') {
        startTimer(60 * 60);
    } else {
        stopTimer();
    }
    soruyuGoster();
    setLoading(false);
}

function soruyuGoster() {
    cevapVerildi = false;
    const mevcutSoru = sorular[mevcutSoruIndex];
    soruSayaci.textContent = `${mevcutSoruIndex + 1} / ${sorular.length}`;
    soruAlmanca.textContent = mevcutSoru.soru_almanca || '';
    soruTurkce.textContent = mevcutSoru.soru_turkce || '';

    if (soruGorsel) {
        if (mevcutSoru.image_url) {
            soruGorsel.src = mevcutSoru.image_url;
            soruGorsel.style.display = 'block';
        } else {
            soruGorsel.removeAttribute('src');
            soruGorsel.style.display = 'none';
        }
    }

    seceneklerContainer.innerHTML = '';
    const secenekler = normalizeSecenekler(mevcutSoru.secenekler);
    for (const [key, value] of Object.entries(secenekler)) {
        const button = document.createElement('button');
        button.textContent = `${key.toUpperCase()}) ${value}`;
        button.dataset.cevap = key;
        button.addEventListener('click', cevabiKontrolEt);
        seceneklerContainer.appendChild(button);
    }

    sonrakiBtn.disabled = true;
}

function cevabiKontrolEt(event) {
    if (cevapVerildi) return;
    cevapVerildi = true;

    const secilenCevap = event.target.dataset.cevap;
    const dogruCevap = sorular[mevcutSoruIndex].dogru_cevap;

    if (secilenCevap === dogruCevap) {
        dogruSayisi++;
        event.target.classList.add('correct');
    } else {
        event.target.classList.add('incorrect');
        // Doğru cevabı göster
        const dogruCevapBtn = seceneklerContainer.querySelector(`[data-cevap="${dogruCevap}"]`);
        dogruCevapBtn.classList.add('correct');
    }

    sonrakiBtn.disabled = false;
}

function sonrakiSoru() {
    mevcutSoruIndex++;
    if (mevcutSoruIndex < sorular.length) {
        soruyuGoster();
    } else {
        testiBitir();
    }
}

function testiBitir() {
    testAlani.style.display = 'none';
    sonucAlani.style.display = 'block';
    toplamSoruSpan.textContent = sorular.length;
    dogruSayisiSpan.textContent = dogruSayisi;
    stopTimer();
}

function startTest(mode) {
    aktifMod = mode;
    seciliEyalet = '';

    if (aktifMod === 'state') {
        seciliEyalet = stateSelect ? stateSelect.value : '';
    } else if (aktifMod === 'real') {
        seciliEyalet = mixSelect ? mixSelect.value : '';
    }

    if (aktifMod !== 'all' && !seciliEyalet) {
        showState('Lütfen bir eyalet seçin.');
        return;
    }

    hideIntro();
    testAlani.style.display = 'none';
    sonucAlani.style.display = 'none';
    sorulariYukle();
}

startButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        if (mode) {
            startTest(mode);
        }
    });
});

sonrakiBtn.addEventListener('click', sonrakiSoru);
if (modaDonBtn) {
    modaDonBtn.addEventListener('click', showIntro);
}
if (modaDonBtnAlt) {
    modaDonBtnAlt.addEventListener('click', showIntro);
}

showIntro();
