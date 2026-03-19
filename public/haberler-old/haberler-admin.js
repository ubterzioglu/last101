/* haberler-admin.js */
(function () {
  "use strict";

  const elList = document.getElementById("list");
  const elState = document.getElementById("state");
  const elSearch = document.getElementById("searchInput");
  const elTotalCount = document.getElementById("totalCount");
  const elAlmanyaCount = document.getElementById("almanyaCount");
  const elAvrupaCount = document.getElementById("avrupaCount");
  const elDunyaCount = document.getElementById("dunyaCount");

  // Supabase config (Service Role Key gerekli - admin işlemleri için)
  const cfg = window.ALMANYA101_SUPABASE_ADMIN || {};
  if (!cfg.url || !cfg.serviceRoleKey) {
    showError("Supabase admin ayarı bulunamadı. supabase-config-admin.js dosyasını kontrol et.");
    return;
  }

  if (typeof supabase === 'undefined') {
    showError("Supabase kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin.");
    return;
  }

  // Admin client (Service Role Key ile)
  const supabaseClient = supabase.createClient(cfg.url, cfg.serviceRoleKey, {
    auth: { persistSession: false }
  });

  let allNews = [];
  let filteredNews = [];

  function showError(msg) {
    elState.className = "state error";
    elState.textContent = msg;
    elState.style.display = "block";
  }

  function showSuccess(msg) {
    elState.className = "state success";
    elState.textContent = msg;
    elState.style.display = "block";
    setTimeout(() => {
      elState.style.display = "none";
    }, 3000);
  }

  function hideState() {
    elState.style.display = "none";
  }

  function safeText(v) {
    return (v ?? "").toString();
  }

  function fmtDate(isoOrTs) {
    if (!isoOrTs) return "";
    const d = new Date(isoOrTs);
    if (Number.isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
  }

  function truncate(text, maxLen = 100) {
    if (!text) return "";
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + "...";
  }

  function updateStats() {
    const total = allNews.length;
    const almanya = allNews.filter(n => n.category === "Almanya").length;
    const turkiye = allNews.filter(n => n.category === "Türkiye").length;
    const avrupa = allNews.filter(n => n.category === "Avrupa").length;
    const dunya = allNews.filter(n => n.category === "Dünya").length;

    elTotalCount.textContent = `Toplam: ${total}`;
    elAlmanyaCount.textContent = `Almanya: ${almanya}`;
    elAvrupaCount.textContent = `Avrupa: ${avrupa}`;
    elDunyaCount.textContent = `Dünya: ${dunya}`;
    elTurkiyeCount.textContent = `Türkiye: ${turkiye}`;
  }

  function filterNews() {
    const query = elSearch.value.toLowerCase().trim();
    if (!query) {
      filteredNews = allNews;
    } else {
      filteredNews = allNews.filter(n => 
        safeText(n.title).toLowerCase().includes(query)
      );
    }
    render();
  }

  function buildNewsItem(news) {
    const item = document.createElement("div");
    item.className = "news-item";
    item.dataset.id = news.id;

    const img = news.cover_image_url 
      ? `<img src="${safeText(news.cover_image_url)}" alt="${safeText(news.title)}" onerror="this.src='https://placehold.co/120x80?text=Haber'">`
      : `<img src="https://placehold.co/120x80?text=Haber" alt="Placeholder">`;

    const date = fmtDate(news.published_at || news.created_at);
    const source = news.source_name || "Bilinmiyor";

    item.innerHTML = `
      ${img}
      <div class="news-content">
        <div class="news-title">${safeText(news.title)}</div>
        <div class="news-meta">
          ${news.category || "Kategori yok"} • ${date} • ${source}
        </div>
        <div class="news-actions">
          <select class="category-select" data-id="${news.id}">
            <option value="Almanya" ${news.category === "Almanya" ? "selected" : ""}>Almanya</option>
            <option value="Türkiye" ${news.category === "Türkiye" ? "selected" : ""}>Türkiye</option>
            <option value="Avrupa" ${news.category === "Avrupa" ? "selected" : ""}>Avrupa</option>
            <option value="Dünya" ${news.category === "Dünya" ? "selected" : ""}>Dünya</option>
          </select>
          <button class="btn btn-update" onclick="updateCategory('${news.id}')">Kaydet</button>
          <button class="btn btn-delete" onclick="deleteNews('${news.id}')">Sil</button>
        </div>
      </div>
    `;

    return item;
  }

  function render() {
    if (filteredNews.length === 0) {
      elList.innerHTML = '<div class="empty">Haber bulunamadı.</div>';
      return;
    }

    elList.innerHTML = "";
    filteredNews.forEach(news => {
      elList.appendChild(buildNewsItem(news));
    });
  }

  async function loadNews() {
    hideState();
    elList.innerHTML = '<div class="loading">Yükleniyor...</div>';

    const { data, error } = await supabaseClient
      .from("news_posts")
      .select("id, category, title, cover_image_url, source_name, published_at, created_at, status")
      .order("published_at", { ascending: false, nullsFirst: false })
      .limit(500); // İlk 500 haber

    if (error) {
      showError(`Hata: ${error.message}`);
      elList.innerHTML = "";
      return;
    }

    allNews = Array.isArray(data) ? data : [];
    filteredNews = allNews;
    
    updateStats();
    render();
  }

  async function updateCategory(id) {
    const select = document.querySelector(`select[data-id="${id}"]`);
    if (!select) return;

    const newCategory = select.value;
    const news = allNews.find(n => n.id === id);
    
    if (!news || news.category === newCategory) {
      showSuccess("Kategori zaten aynı.");
      return;
    }

    hideState();
    select.disabled = true;

    const { error } = await supabaseClient
      .from("news_posts")
      .update({ category: newCategory })
      .eq("id", id);

    select.disabled = false;

    if (error) {
      showError(`Kategori güncellenemedi: ${error.message}`);
      return;
    }

    news.category = newCategory;
    updateStats();
    showSuccess(`Kategori "${newCategory}" olarak güncellendi.`);
  }

  async function deleteNews(id) {
    const news = allNews.find(n => n.id === id);
    if (!news) return;

    if (!confirm(`Bu haberi silmek istediğinizden emin misiniz?\n\n"${safeText(news.title)}"`)) {
      return;
    }

    hideState();

    const { error } = await supabaseClient
      .from("news_posts")
      .delete()
      .eq("id", id);

    if (error) {
      showError(`Haber silinemedi: ${error.message}`);
      return;
    }

    // Local state'den kaldır
    allNews = allNews.filter(n => n.id !== id);
    filteredNews = filteredNews.filter(n => n.id !== id);
    
    updateStats();
    render();
    showSuccess("Haber silindi.");
  }

  // Global functions (inline onclick için)
  window.updateCategory = updateCategory;
  window.deleteNews = deleteNews;

  // Search
  elSearch.addEventListener("input", filterNews);

  // Initial load
  loadNews();
})();
