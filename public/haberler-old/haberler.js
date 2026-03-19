/* haberler.js */
(function () {
    "use strict";

    const PAGE_SIZE = 12;

    const elList = document.getElementById("list");
    const elState = document.getElementById("state");
    const filterButtons = Array.from(document.querySelectorAll(".filter-btn[data-category]"));
    const elLoadMore = document.getElementById("loadMoreBtn");
    const elCountInfo = document.getElementById("countInfo");

    const cfg = window.ALMANYA101_SUPABASE || {};
    if (!cfg.url || !cfg.anonKey) {
      showState("Supabase ayarı bulunamadı. supabase-config.js dosyasını kontrol et.");
      return;
    }

    if (typeof supabase === 'undefined') {
      showState("Supabase kütüphanesi yüklenemedi. Lütfen sayfayı yenileyin.");
      return;
    }
    const supabaseClient = supabase.createClient(cfg.url, cfg.anonKey);

    let page = 0;
    let hasMore = true;
    let isLoading = false;
    let activeCategory = null;

    function showState(msg) {
      elState.style.display = "block";
      elState.textContent = msg;
    }

    function hideState() {
      elState.style.display = "none";
      elState.textContent = "";
    }

    function fmtDateDot(isoOrTs) {
      if (!isoOrTs) return "";
      const d = new Date(isoOrTs);
      if (Number.isNaN(d.getTime())) return "";
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    }

    function categoryCode(cat) {
      if (!cat) return '';
      const key = cat.toLowerCase();
      if (key.includes('almanya') || key === 'almanya') return 'DE';
      if (key.includes('türkiye') || key.includes('turkiye') || key === 'turkiye') return 'TR';
      if (key.includes('avrupa')) return 'EU';
      if (key.includes('dünya') || key.includes('dunya') || key.includes('world')) return '🌍';
      return cat;
    }

    function safeText(v) {
      return (v ?? "").toString();
    }

    function buildCard(row) {
      const a = document.createElement("a");
      a.className = "card";
      a.href = `./haberdetay.html?id=${encodeURIComponent(row.id)}`;

      const thumb = document.createElement("div");
      thumb.className = "thumb";
      const img = document.createElement("img");
      img.alt = safeText(row.title);
      img.loading = "lazy";
      img.src = row.cover_image_url || "https://placehold.co/220x144?text=Haber";
      thumb.appendChild(img);

      const meta = document.createElement("div");
      meta.className = "meta";

      const h = document.createElement("p");
      h.className = "headline";
      h.textContent = safeText(row.title);

      const sub = document.createElement("div");
      sub.className = "sub";

      const parts = [];
      if (row.category) parts.push(categoryCode(row.category));
      const date = fmtDateDot(row.published_at || row.created_at);
      if (date) parts.push(date);

      const cat = document.createElement("span");
      cat.className = "pill";
      cat.textContent = parts.join(" • ");

      sub.appendChild(cat);

      meta.appendChild(h);
      meta.appendChild(sub);

      a.appendChild(thumb);
      a.appendChild(meta);
      return a;
    }

    async function fetchPage({ reset = false } = {}) {
      if (isLoading) return;
      isLoading = true;

      try {
        hideState();

        if (reset) {
          page = 0;
          hasMore = true;
          elList.innerHTML = "";
          elCountInfo.textContent = "";
        }

        if (!hasMore) return;

        const from = page * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabaseClient
          .from("news_posts")
          .select("id, category, title, cover_image_url, source_name, published_at, created_at, status")
          .eq("status", "published")
          .order("published_at", { ascending: false, nullsFirst: false })
          .range(from, to);

        if (activeCategory) query = query.eq("category", activeCategory);

        const { data, error } = await query;

        if (error) {
          showState(`Hata: ${error.message}`);
          return;
        }

        const rows = Array.isArray(data) ? data : [];
        if (rows.length === 0 && page === 0) {
          showState("Gösterilecek haber bulunamadı.");
        }

        rows.forEach((r) => elList.appendChild(buildCard(r)));

        hasMore = rows.length === PAGE_SIZE;
        elLoadMore.style.display = hasMore ? "inline-block" : "none";

        const shown = elList.children.length;
        if (shown) {
          elCountInfo.textContent = `${shown} Haber - almanya101.de - Almanya rehberiniz!`;
        } else {
          elCountInfo.textContent = "";
        }
        page += 1;
      } finally {
        isLoading = false;
      }
    }

    function setCategory(cat) {
      if (cat === activeCategory) {
        activeCategory = null;
      } else {
        activeCategory = cat;
      }

      filterButtons.forEach((btn) => {
        const isActive = btn.dataset.category === activeCategory;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
      fetchPage({ reset: true });
    }


    // Events
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => setCategory(btn.dataset.category || null));
    });

    elLoadMore.addEventListener("click", () => fetchPage({ reset: false }));

    // Initial load
    fetchPage({ reset: true });
  })();
