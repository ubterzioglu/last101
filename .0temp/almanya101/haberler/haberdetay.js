/* haberdetay.js */
(function () {
    "use strict";
  
    const elState = document.getElementById("state");
    const elArticle = document.getElementById("article");
    const elCover = document.getElementById("coverImg");
    const elTitle = document.getElementById("title");
    const elMeta = document.getElementById("meta");
    const elSummary = document.getElementById("summary");
    const elContent = document.getElementById("content");
  
    const elSourceCard = document.getElementById("sourceCard");
    const elReadMoreWrap = document.getElementById("readMoreWrap");
    const elReadMoreLink = document.getElementById("readMoreLink");
  
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
  
    function showState(msg) {
      elState.style.display = "block";
      elState.textContent = msg;
    }
  
    function hideState() {
      elState.style.display = "none";
      elState.textContent = "";
    }
  
    function safeText(v) {
      return (v ?? "").toString();
    }

    function cleanSnippet(text) {
      const t = safeText(text);
      return t
        .replace(/\s*\[\+\d+\s+chars\]\s*$/i, "")
        .replace(/\s*…\s*\[\+\d+\s+chars\]\s*$/i, "…")
        .trim();
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

    function categoryCode(cat) {
      if (!cat) return '';
      const key = cat.toLowerCase();
      if (key.includes('almanya') || key === 'almanya') return 'DE';
      if (key.includes('türkiye') || key.includes('turkiye') || key === 'turkiye') return 'TR';
      if (key.includes('avrupa')) return 'EU';
      if (key.includes('dünya') || key.includes('dunya') || key.includes('world')) return '🌍';
      return cat;
    }
  
    function getId() {
      const url = new URL(window.location.href);
      return url.searchParams.get("id");
    }
  
    function metaLine(row) {
      const parts = [];
      if (row.category) parts.push(categoryCode(row.category));
      const date = fmtDate(row.published_at || row.created_at);
      if (date) parts.push(date);
      
      const text = parts.join(" • ");
      elMeta.innerHTML = "";
      if (text) {
        const s = document.createElement('span');
        s.className = 'pill';
        s.textContent = text;
        elMeta.appendChild(s);
      }
    }
  
    function pill(text) {
      const s = document.createElement("span");
      s.className = "pill";
      s.textContent = text;
      return s;
    }
  
    function textNode(t) {
      return document.createTextNode(t);
    }
  
    async function load() {
      const id = getId();
      if (!id) {
        showState("Haber id parametresi yok. (Örn: haberdetay.html?id=...)");
        return;
      }
  
      hideState();
  
      const { data, error } = await supabaseClient
        .from("news_posts")
        .select("id, category, title, summary, content, cover_image_url, source_name, source_url, published_at, created_at, status")
        .eq("id", id)
        .maybeSingle();
  
      if (error) {
        showState(`Hata: ${error.message}`);
        return;
      }
      if (!data) {
        showState("Haber bulunamadı.");
        return;
      }
      if (data.status && data.status !== "published") {
        showState("Bu haber yayınlanmamış görünüyor.");
        return;
      }
  
      elArticle.style.display = "block";
  
      const cover = data.cover_image_url || "https://placehold.co/1200x675?text=Haber";
      elCover.src = cover;
      elCover.alt = safeText(data.title);
  
      elTitle.textContent = safeText(data.title);
      metaLine(data);

      elSummary.textContent = cleanSnippet(data.summary);
      elSummary.style.display = data.summary ? "block" : "none";

      elContent.textContent = cleanSnippet(data.content);

      // WhatsApp paylaş butonu URL'ini ayarla
      const whatsappBtn = document.getElementById("whatsappShareBtn");
      if (whatsappBtn) {
        const articleTitle = safeText(data.title);
        const articleUrl = window.location.href;
        const shareText = `${articleTitle}\n\n${articleUrl}`;
        whatsappBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      }

      // "Devamını oku" linkini orijinal kaynağa bağla
      if (elReadMoreWrap && elReadMoreLink && data.source_url) {
        elReadMoreLink.href = data.source_url;
        elReadMoreWrap.style.display = "flex";
      } else if (elReadMoreWrap) {
        elReadMoreWrap.style.display = "none";
      }

      // No separate source card needed (we don't show external source links)
      if (elSourceCard) elSourceCard.style.display = "none";

      document.title = safeText(data.title || "Haber Detay");
    }
  
    load();
  })();
  