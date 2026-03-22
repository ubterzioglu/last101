(() => {
  "use strict";

  function assetBase() {
    const path = window.location.pathname || "";
    if (!path || path === "/") return "./";
    const parts = path.split("/").filter(Boolean);
    if (parts.length <= 1) return "./";
    return "../".repeat(parts.length - 1);
  }

  function replaceWithHtml(el, html) {
    const tpl = document.createElement("template");
    tpl.innerHTML = html.trim();
    const node = tpl.content.firstElementChild;
    if (node) el.replaceWith(node);
  }

  function buildFooter(base) {
    const homeHref = base + "index.html";
    const inner = `
      <div class="card footer-blue-card" data-shared-rendered="true">
        <div class="card-buttons footer-blue-card__buttons">
          <a href="${homeHref}">
            <img src="${base}img/buttons/z0cliphome.png" class="btn-icon" alt="Home" />
          </a>
          <a href="#top">
            <img src="${base}img/buttons/z0clipup.png" class="btn-icon" alt="Up" />
          </a>
          <button type="button" class="btn-icon" title="Menu" data-shared-menu="true" style="background: none; border: none; padding: 0; cursor: pointer;">
            <img src="${base}img/buttons/z0clipmenu.png" class="btn-icon" alt="Menu" />
          </button>
        </div>
        <div class="footer-slogan">yalnız değilsin! almanya101 seninle!</div>
        <div class="footer-credit">made by UBT with love</div>
        <div class="footer-copyright">&copy;almanya101de &bull; 2026</div>
        <div class="footer-spindora"><a href="https://www.spindorai.com" rel="dofollow">Seo Aracı</a> ve Seo Hizmetleri Spindora</div>
      </div>
    `;

    return {
      wrapHtml: `<div class="footer-blue-card-wrap" data-shared-rendered="true">${inner}</div>`,
      innerHtml: inner
    };
  }

  function buildContact(base) {
    return `
      <div class="card contact-card" data-shared-rendered="true">
        <h2>İletişim</h2>
        <div class="contact-icon-grid">
          <a href="https://x.com/101Almanya46905" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logox.png" alt="X (Twitter)" />
            </div>
          </a>
          <a href="https://www.reddit.com/r/almanya101/" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logoreddit.png" alt="Reddit" />
            </div>
          </a>
          <a href="https://facebook.com/almanya101" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logofacebook.png" alt="Facebook" />
            </div>
          </a>
          <a href="https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logowhatsapp.png" alt="WhatsApp" />
            </div>
          </a>
          <a href="http://linkedin.com/company/almanya101/" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logolinkedin.png" alt="LinkedIn" />
            </div>
          </a>
          <a href="https://www.instagram.com/almanya101de/" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/social/logoinstagram.png" alt="Instagram" />
            </div>
          </a>
          <a href="https://www.google.com.tr/maps/place/Berlin/" target="_blank" rel="noopener" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/icons/logolocation.png" alt="Location" />
            </div>
          </a>
          <a href="tel:+491739569429" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/icons/logophone.png" alt="Phone" />
            </div>
          </a>
          <a href="mailto:info@almanya101.de" style="text-decoration:none;">
            <div class="contact-icon-wrapper">
              <img src="${base}img/icons/logoemail.png" alt="Email" />
            </div>
          </a>
        </div>
      </div>
    `;
  }

  function ensureFallbackMenu(base) {
    if (document.getElementById("sharedMenuDrawer")) return;

    const style = document.createElement("style");
    style.setAttribute("data-shared-menu-style", "true");
    style.textContent = `
      .shared-menu-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.55);
        opacity: 0;
        pointer-events: none;
        transition: opacity .2s ease;
        z-index: 9998;
      }
      .shared-menu-overlay.active {
        opacity: 1;
        pointer-events: auto;
      }
      .shared-menu-drawer {
        position: fixed;
        top: 0;
        right: 0;
        width: min(72vw, 300px);
        height: 100vh;
        background: #0b0b0c;
        color: #fff;
        transform: translateX(100%);
        transition: transform .2s ease;
        z-index: 9999;
        padding: 18px 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .shared-menu-drawer.active {
        transform: translateX(0);
      }
      .shared-menu-close {
        align-self: flex-end;
        background: none;
        border: 0;
        color: #fff;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
      }
      .shared-menu-links {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .shared-menu-link {
        color: #fff;
        text-decoration: none;
        padding: 10px 12px;
        border-radius: 12px;
        background: rgba(255,255,255,.08);
      }
      .shared-menu-link:hover {
        background: rgba(255,255,255,.16);
      }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement("div");
    overlay.id = "sharedMenuOverlay";
    overlay.className = "shared-menu-overlay";

    const drawer = document.createElement("div");
    drawer.id = "sharedMenuDrawer";
    drawer.className = "shared-menu-drawer";
    drawer.innerHTML = `
      <button class="shared-menu-close" type="button" aria-label="Kapat">&times;</button>
      <div class="shared-menu-links">
        <a class="shared-menu-link" href="${base}index.html">🏠 Ana Sayfa</a>
        <a class="shared-menu-link" href="${base}bizkimiz/bizkimiz.html">🧑‍💻 Biz Kimiz?</a>
        <a class="shared-menu-link" href="${base}maas/maas.html">💸 Maaş Hesapla</a>
        <a class="shared-menu-link" href="${base}vatandas/v.html">📝 Vatandaşlık Testi</a>
        <a class="shared-menu-link" href="${base}rehber/ua.html">👨‍⚕️ Uzman Rehberi</a>
        <a class="shared-menu-link" href="${base}banka/banka.html">💳 Banka Seçimi</a>
        <a class="shared-menu-link" href="${base}sigorta/sigorta.html">🛡️ Sigorta Seçimi</a>
        <a class="shared-menu-link" href="${base}paratransfer/pt.html">🔁 Para Transferi</a>
        <a class="shared-menu-link" href="${base}join/join.html">🤝 Bize Katıl!</a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    function toggle(open) {
      drawer.classList.toggle("active", open);
      overlay.classList.toggle("active", open);
      document.body.style.overflow = open ? "hidden" : "";
    }

    overlay.addEventListener("click", () => toggle(false));
    const closeBtn = drawer.querySelector(".shared-menu-close");
    if (closeBtn) closeBtn.addEventListener("click", () => toggle(false));
    drawer.querySelectorAll(".shared-menu-link").forEach((link) => {
      link.addEventListener("click", () => toggle(false));
    });

    return { overlay, drawer, toggle };
  }

  function toggleDrawer(drawer, overlay, open) {
    drawer.classList.toggle("active", open);
    if (overlay) overlay.classList.toggle("active", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function disableExistingMenus() {
    const drawer = document.getElementById("hamburgerDrawer");
    const overlay = document.getElementById("drawerOverlay");
    if (drawer) {
      drawer.classList.remove("active");
      drawer.style.display = "none";
      drawer.setAttribute("aria-hidden", "true");
    }
    if (overlay) {
      overlay.classList.remove("active");
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }
  }

  function bindMenuButton(btn, onToggle) {
    if (!btn || btn.dataset.sharedMenuBound === "true") return;
    btn.dataset.sharedMenuBound = "true";
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      onToggle();
    });
  }

  function init() {
    const base = assetBase();
    const path = (window.location && window.location.pathname) || "";
    const isBizkimiz = path.includes("/bizkimiz/") || path.endsWith("bizkimiz.html");
      const isContact = path.includes("/contact/") || path.endsWith("contact.html");

    // Non-bizkimiz/contact pages: remove shared/contact placeholders but keep running menu sync.
    if (!isBizkimiz && !isContact) {
      document.querySelectorAll('[data-shared-card="contact"], .contact-card').forEach((el) => el.remove());
      document.querySelectorAll('[data-shared-card="footer"]').forEach((el) => el.remove());
    }
    const footer = buildFooter(base);
    const contact = buildContact(base);

    document.querySelectorAll('[data-shared-card="footer"]').forEach((el) => {
      replaceWithHtml(el, footer.wrapHtml);
    });

    document.querySelectorAll(".footer-blue-card-wrap:not([data-shared-rendered])").forEach((el) => {
      el.innerHTML = footer.innerHtml;
      el.setAttribute("data-shared-rendered", "true");
    });

    document.querySelectorAll('[data-shared-card="contact"]').forEach((el) => {
      replaceWithHtml(el, contact);
    });

    document.querySelectorAll(".contact-card:not([data-shared-rendered])").forEach((el) => {
      el.outerHTML = contact;
    });

    const menuItems = [
      { href: `${base}index.html`, icon: "🏠", label: "Ana Sayfa" },
      { href: `${base}bizkimiz/bizkimiz.html`, icon: "🧑‍💻", label: "Biz Kimiz?" },
      { href: `${base}maas/maas.html`, icon: "💸", label: "Maaş Hesapla" },
      { href: `${base}vatandas/v.html`, icon: "📝", label: "Vatandaşlık Testi" },
      { href: `${base}rehber/ua.html`, icon: "👨‍⚕️", label: "Uzman Rehberi" },
      { href: `${base}banka/banka.html`, icon: "💳", label: "Banka Seçimi" },
      { href: `${base}sigorta/sigorta.html`, icon: "🛡️", label: "Sigorta Seçimi" },
      { href: `${base}paratransfer/pt.html`, icon: "🔁", label: "Para Transferi" },
      { href: `${base}join/join.html`, icon: "🤝", label: "Bize Katıl!" }
    ];

    document.querySelectorAll(".menu-links").forEach((nav) => {
      nav.innerHTML = menuItems
        .map((item) => `
          <a href="${item.href}" class="menu-link"><span class="menu-icon">${item.icon}</span> ${item.label}</a>
        `)
        .join("");
    });

    ensureFallbackMenu(base);
    const sharedDrawer = document.getElementById("sharedMenuDrawer");
    const sharedOverlay = document.getElementById("sharedMenuOverlay");
    const toggleShared = () => {
      const isOpen = sharedDrawer && sharedDrawer.classList.contains("active");
      if (sharedDrawer) toggleDrawer(sharedDrawer, sharedOverlay, !isOpen);
    };

    disableExistingMenus();

    const openBtn = document.getElementById("menuOpenBtn");
    if (openBtn && openBtn.parentNode) {
      const clone = openBtn.cloneNode(true);
      openBtn.parentNode.replaceChild(clone, openBtn);
      bindMenuButton(clone, toggleShared);
    }

    document.querySelectorAll('[data-shared-menu="true"]').forEach((btn) => {
      bindMenuButton(btn, toggleShared);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
