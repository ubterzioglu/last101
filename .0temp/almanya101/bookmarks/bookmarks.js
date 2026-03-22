/* =========================================================
  FILE: /bookmarks/bookmarks.js
  PURPOSE:
  - Arca-like UI: sidebar categories + search + grid
  - Curated data comes from window.BOOKMARKS_DATA (manual-first)
  - User submissions are loaded from /api/bookmarks-list (KV)
  - Submit modal posts to /api/bookmarks-submit
  - Mobile: hamburger sidebar (<=980px)
========================================================= */

(function () {
  const $ = (id) => document.getElementById(id);

  // -------------------------------------------------------
  // Elements
  // -------------------------------------------------------
  const navEl = $("nav");
  const gridEl = $("grid");
  const qEl = $("q");
  const viewTitleEl = $("viewTitle");
  const emptyEl = $("empty");
  const syncPill = $("syncPill");

  const modalOverlay = $("modalOverlay");
  const openSubmit = $("openSubmit") || document.querySelector(".submitBtn");
  const closeModal = $("closeModal");
  const submitCancel = $("submitCancel");
  const submitSend = $("submitSend");

  const sTitle = $("sTitle");
  const sUrl = $("sUrl");
  const sImg = $("sImg");
  const sNote = $("sNote");
  const sCat = $("sCat");
  const submitMsg = $("submitMsg");

  // Mobile sidebar (hamburger)
  const hamb = $("hamb");
  const sbOverlay = $("sbOverlay");

  // -------------------------------------------------------
  // Sidebar open/close
  // -------------------------------------------------------
  function openSidebar() {
    document.body.classList.add("sb-open");
    if (hamb) hamb.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    document.body.classList.remove("sb-open");
    if (hamb) hamb.setAttribute("aria-expanded", "false");
  }

  // -------------------------------------------------------
  // FALLBACK CURATED (only if BOOKMARKS_DATA is missing/empty)
  // -------------------------------------------------------
  const FALLBACK_CURATED = [
    {
      id: "portable-apps",
      title: "PortableApps",
      href: "https://portableapps.com/",
      note: "Run apps without installation, directly from a USB stick or folder.",
      img: "./img/bookmarks/z0bookmark0010.png",
      category: "tools"
    }
  ];

  function getCuratedFromData() {
    try {
      const arr =
        window.BOOKMARKS_DATA ||
        window.EXPLORER_DATA?.bookmarksData ||
        window.EXPLORER_DATA?.bookmarks ||
        [];
      if (!Array.isArray(arr)) return [];
      return arr;
    } catch {
      return [];
    }
  }

  // More tolerant mapper (so explorer-data can be flexible)
  function toBookmarkItem(x, forcedBy) {
    const url =
      x.href || x.url || x.link || x.website || x.site || x.homepage || "";

    const note =
      x.note || x.desc || x.description || x.summary || x.text || "";

    const title = x.title || x.name || "Untitled";

    return {
      id:
        x.id ||
        (title
          ? String(title).toLowerCase().trim().replace(/\s+/g, "-")
          : (crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()))),
      title,
      url,
      note,
      img: x.img || x.image || x.thumb || "",
      category: ((x.category || "tools") + "").trim(),
      tags: Array.isArray(x.tags) ? x.tags : [],
      by: forcedBy || x.by || "curated"
    };
  }

  // -------------------------------------------------------
  // Categories (sidebar)
  // -------------------------------------------------------
  const MENU = [
    { key: "explore", label: "Explore" },
    { key: "libraries", label: "Libraries" },
    { key: "artificial-intelligence", label: "Artificial Intelligence" },
    { key: "tools", label: "Tools" },
    { key: "design", label: "Design" },
    { key: "services", label: "Services" },
    { key: "social", label: "Social" },
    { key: "open-source", label: "Open Source" },
    { key: "user-added", label: "Added by users" }
  ];

  let activeKey = "explore";
  let userAdded = [];
  let allCurated = [];

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------
  function setPill(kind, text) {
    if (!syncPill) return;
    syncPill.className = "pill " + kind;
    syncPill.textContent = text;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalizeUrl(url) {
    const u = (url || "").trim();
    if (!u) return "";
    if (u.startsWith("http://") || u.startsWith("https://")) return u;
    return "https://" + u;
  }

  function hostOf(url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "");
    } catch {
      return "";
    }
  }

  function matches(item, q) {
    if (!q) return true;
    const hay = [
      item.title,
      item.note,
      item.url,
      item.category,
      ...(item.tags || [])
    ].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function cardThumb(item) {
    if (item.img) {
      return `<img src="${escapeHtml(item.img)}" alt="" loading="lazy" />`;
    }
    const h = (item.title || "").trim().slice(0, 2).toUpperCase();
    return `<div class="fallback">${escapeHtml(h || "★")}</div>`;
  }

  // -------------------------------------------------------
  // Render
  // -------------------------------------------------------
  function renderGrid(items) {
    if (!gridEl || !emptyEl) return;

    gridEl.innerHTML = "";
    emptyEl.style.display = items.length ? "none" : "";

    for (const item of items) {
      const by = item.by === "user" ? "user" : "curated";
      const url = normalizeUrl(item.url);
      const host = hostOf(url);

      const tags = []
        .concat(item.category ? [item.category] : [])
        .concat(item.tags || [])
        .slice(0, 4);

      const tagHtml = tags
        .filter(Boolean)
        .map((t) => `<span class="bookmark-tag">${escapeHtml(t)}</span>`)
        .join("");

      const el = document.createElement("div");
      el.className = "bookmark-card";
      el.innerHTML = `
        <div class="bookmark-thumb">${cardThumb(item)}</div>
        <div class="bookmark-body">
          <p class="bookmark-name">${escapeHtml(item.title || "Untitled")}</p>
          <p class="bookmark-desc">${escapeHtml(item.note || host || url)}</p>
          <div class="bookmark-meta">
            ${tagHtml}
            <span class="bookmark-by">${escapeHtml(by)}</span>
          </div>
        </div>
      `;

      el.addEventListener("click", () => {
        if (!url) return;
        window.open(url, "_blank", "noopener,noreferrer");
      });

      gridEl.appendChild(el);
    }
  }

  function computeCounts() {
    const q = (qEl?.value || "").trim();
    const baseCurated = allCurated;
    const counts = {};

    for (const m of MENU) {
      let list = [];
      if (m.key === "user-added") {
        list = userAdded;
      } else if (m.key === "explore") {
        list = baseCurated;
      } else {
        list = baseCurated.filter((x) => x.category === m.key);
      }
      counts[m.key] = list.filter((x) => matches(x, q)).length;
    }
    return counts;
  }

  function renderNav() {
    if (!navEl) return;

    const counts = computeCounts();
    navEl.innerHTML = "";

    for (const m of MENU) {
      const btn = document.createElement("button");
      btn.className = m.key === activeKey ? "active" : "";
      btn.innerHTML = `
        <span>${escapeHtml(m.label)}</span>
        <span class="count">${counts[m.key] ?? 0}</span>
      `;
      btn.addEventListener("click", () => {
        activeKey = m.key;
        updateView();
      });
      navEl.appendChild(btn);
    }
  }

  function getActiveList() {
    const q = (qEl?.value || "").trim();

    if (activeKey === "user-added") return userAdded.filter((x) => matches(x, q));
    if (activeKey === "explore") return allCurated.filter((x) => matches(x, q));

    return allCurated
      .filter((x) => x.category === activeKey)
      .filter((x) => matches(x, q));
  }

  function updateTitle() {
    if (!viewTitleEl) return;
    const m = MENU.find((x) => x.key === activeKey);
    viewTitleEl.textContent = m ? m.label : "Explore";
  }

  function updateView() {
    updateTitle();
    renderNav();
    renderGrid(getActiveList());
  }

  // -------------------------------------------------------
  // Data loading
  // -------------------------------------------------------
  async function loadUserAdded() {
    try {
      setPill("warn", "Loading…");
      const res = await fetch("/api/bookmarks-list?limit=200", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        userAdded = [];
        setPill("warn", data?.error ? "Submissions off" : "Offline");
        return;
      }

      userAdded = (Array.isArray(data.items) ? data.items : []).map((x) =>
        toBookmarkItem(x, "user")
      );

      setPill("ok", "Live");
    } catch {
      userAdded = [];
      setPill("warn", "Offline");
    }
  }

  function fillCategorySelect() {
    if (!sCat) return;

    const cats = MENU
      .filter((x) => x.key !== "user-added" && x.key !== "explore")
      .map((x) => x.key);

    sCat.innerHTML = cats
      .map((k) => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`)
      .join("");
  }

  // -------------------------------------------------------
  // Modal
  // -------------------------------------------------------
  function openModal() {
    if (!modalOverlay) return;

    if (submitMsg) {
      submitMsg.textContent = "";
      submitMsg.style.opacity = "0.8";
      submitMsg.style.color = "";
    }

    if (sTitle) sTitle.value = "";
    if (sUrl) sUrl.value = "";
    if (sImg) sImg.value = "";
    if (sNote) sNote.value = "";
    if (sCat) sCat.value = "tools";

    modalOverlay.style.display = "flex";
  }

  function closeModalNow() {
    if (!modalOverlay) return;
    modalOverlay.style.display = "none";
  }

  async function submit() {
    if (!submitMsg || !submitSend) return;

    submitMsg.textContent = "";

    const title = (sTitle?.value || "").trim();
    const url = normalizeUrl((sUrl?.value || "").trim());
    const note = (sNote?.value || "").trim();
    const category = ((sCat?.value || "tools") + "").trim();
    const img = (sImg?.value || "").trim();

    if (!title || !url) {
      submitMsg.style.color = "#ffd";
      submitMsg.textContent = "Title and URL are required.";
      return;
    }

    submitSend.disabled = true;
    submitSend.textContent = "Submitting…";

    try {
      const res = await fetch("/api/bookmarks-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, url, note, category, img })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        submitMsg.style.color = "#ffd";
        submitMsg.textContent = data?.error || "Submit failed.";
        return;
      }

      submitMsg.style.color = "#dfffe7";
      submitMsg.textContent = "Thanks! Your submission is now under 'Added by users'.";

      await loadUserAdded();
      updateView();

      setTimeout(closeModalNow, 700);
    } catch {
      submitMsg.style.color = "#ffd";
      submitMsg.textContent = "Network error.";
    } finally {
      submitSend.disabled = false;
      submitSend.textContent = "Submit";
    }
  }

  // -------------------------------------------------------
  // Init
  // -------------------------------------------------------
  async function init() {
    fillCategorySelect();

    const curatedRaw = getCuratedFromData();
    const curatedSource = curatedRaw.length ? curatedRaw : FALLBACK_CURATED;

    allCurated = curatedSource
      .map((x) => toBookmarkItem(x, "curated"))
      .filter((x) => x.url || x.title);

    await loadUserAdded();

    updateView();

    // Search
    if (qEl) qEl.addEventListener("input", updateView);

    // Modal bindings
    if (openSubmit) openSubmit.addEventListener("click", openModal);
    if (closeModal) closeModal.addEventListener("click", closeModalNow);
    if (submitCancel) submitCancel.addEventListener("click", closeModalNow);
    if (submitSend) submitSend.addEventListener("click", submit);

    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) closeModalNow();
      });
    }

    // Hamburger bindings
    if (hamb) {
      hamb.addEventListener("click", () => {
        if (document.body.classList.contains("sb-open")) closeSidebar();
        else openSidebar();
      });
    }

    if (sbOverlay) sbOverlay.addEventListener("click", closeSidebar);

    // Clicking menu on mobile closes sidebar
    if (navEl) {
      navEl.addEventListener("click", () => {
        if (window.innerWidth <= 980) closeSidebar();
      });
    }

    // Esc closes modal + sidebar
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModalNow();
        closeSidebar();
      }
    });

    // If user rotates / resizes to desktop, ensure sidebar state is sane
    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeSidebar();
    });
  }

  // ✅ only once
  init();
})();
