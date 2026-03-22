/* =========================================================
  FILE: /bookmarks/bookmarks-admin.js
  PURPOSE:
  - Admin review for Bookmarks submissions
  - View: inbox / moved / rejected
  - Generate curated object via SERVER (/api/bookmarks-admin-curate)
  - Actions: move, reject, restore (requires admin key)
  - Lists loaded via /api/bookmarks-admin-list (requires admin key)
========================================================= */

(function () {
  const $ = (id) => document.getElementById(id);
  const listEl = $("list");
  const emptyEl = $("empty");
  const pill = $("pill");
  const qEl = $("q");
  const viewEl = $("view");
  const statsEl = $("stats");
  const outEl = $("out");
  const msgEl = $("msg");

  const refreshBtn = $("refreshBtn");
  const adminKeyEl = $("adminKey");
  const saveKeyBtn = $("saveKeyBtn");
  const clearKeyBtn = $("clearKeyBtn");
  const copyOutBtn = $("copyOutBtn");

  const KEY_STORE = "bookmarks_admin_key";

  let state = {
    inbox: [],
    moved: [],
    rejected: []
  };

  function getAdminKey() {
    return localStorage.getItem(KEY_STORE) || "";
  }

  function setPill(kind, text) {
    pill.className = "pill " + kind;
    pill.textContent = text;
  }

  function escapeHtml(s) {
    return String(s ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ---------- NEW: JS object-literal output helpers (no quoted keys) ----------
  function escapeJsString(s) {
    return String(s ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n");
  }

  function toObjectLiteral(curated) {
    // Keys unquoted, string values quoted -> ready to paste into bookmarks-data.js
    const lines = [];
    lines.push("{");
    lines.push(`  id: "${escapeJsString(curated.id)}",`);
    lines.push(`  title: "${escapeJsString(curated.title)}",`);
    lines.push(`  img: "${escapeJsString(curated.img)}",`);
    lines.push(`  href: "${escapeJsString(curated.href)}",`);
    lines.push(`  note: "${escapeJsString(curated.note)}"`);

    // optional extras if you later add them to curate endpoint
    if (curated.category) lines.push(`,  category: "${escapeJsString(curated.category)}"`);
    if (Array.isArray(curated.tags) && curated.tags.length) {
      const tags = curated.tags.map(t => `"${escapeJsString(t)}"`).join(", ");
      lines.push(`,  tags: [${tags}]`);
    }

    lines.push("}");
    // The comma placement above is intentionally safe: we end without trailing comma.
    // Join with newlines for readability.
    return lines.join("\n");
  }
  // -------------------------------------------------------------------------

  function matches(item, q) {
    if (!q) return true;
    const hay = [item.title, item.url, item.note, item.category, item.id].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function humanTime(ts) {
    if (!ts) return "";
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch {
      return "";
    }
  }

  // =========================================================
  // API
  // =========================================================

  async function apiAdminList(which) {
    const adminKey = getAdminKey();
    if (!adminKey) throw new Error("Admin key missing. Save your key first.");

    const url = `/api/bookmarks-admin-list?which=${encodeURIComponent(which)}&limit=300`;
    const r = await fetch(url, {
      cache: "no-store",
      headers: {
        "x-bookmarks-admin-key": adminKey
      }
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.error || "list failed");
    return Array.isArray(j.items) ? j.items : [];
  }

  async function apiAdminUpdate(action, payload) {
    const adminKey = getAdminKey();
    if (!adminKey) throw new Error("Admin key missing. Save your key first.");

    const r = await fetch("/api/bookmarks-admin-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bookmarks-admin-key": adminKey
      },
      body: JSON.stringify({ action, ...payload })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.error || "update failed");
    return j;
  }

  async function apiAdminCurate(item) {
    const adminKey = getAdminKey();
    if (!adminKey) throw new Error("Admin key missing. Save your key first.");

    const r = await fetch("/api/bookmarks-admin-curate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-bookmarks-admin-key": adminKey
      },
      body: JSON.stringify({ item })
    });

    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j?.error || "curate failed");
    return j?.curated || {};
  }

  // =========================================================
  // RENDER
  // =========================================================

  function render() {
    const q = qEl.value.trim();
    const which = viewEl.value;

    const list = (state[which] || []).filter((x) => matches(x, q));

    listEl.innerHTML = "";
    emptyEl.style.display = list.length ? "none" : "";

    statsEl.textContent =
      `Inbox: ${state.inbox.length} · Moved: ${state.moved.length} · Rejected: ${state.rejected.length} · Showing: ${list.length}`;

    for (const item of list) {
      const el = document.createElement("div");
      el.className = "item";

      el.innerHTML = `
        <div class="itemTop">
          <div>
            <div class="title">${escapeHtml(item.title || "Untitled")}</div>
            <div class="meta">
              ${escapeHtml(item.url || "")}<br>
              <span style="opacity:.8">cat:</span> ${escapeHtml(item.category || "-")}
              · <span style="opacity:.8">at:</span> ${escapeHtml(humanTime(item.createdAt))}
              · <span style="opacity:.8">id:</span> ${escapeHtml(item.id)}
            </div>
          </div>

          <div class="actions">
            <button class="btn secondary" data-act="makeout">Make output</button>
            <button class="btn secondary" data-act="open">Open</button>
            ${
              which === "inbox"
                ? `<button class="btn good" data-act="move">Mark moved</button>
                   <button class="btn danger" data-act="reject">Reject</button>`
                : `<button class="btn secondary" data-act="restore">Restore</button>`
            }
          </div>
        </div>

        <div class="meta">${escapeHtml(item.note || "")}</div>
      `;

      // Make output (via server) -> now printed as JS object literal (keys not quoted)
      el.querySelector('[data-act="makeout"]').addEventListener("click", async () => {
        try {
          setPill("warn", "Working…");
          const curated = await apiAdminCurate(item);

          outEl.textContent = toObjectLiteral(curated);
          msgEl.textContent = "Curated output generated. Copy/paste into bookmarks-data.js (BOOKMARKS_DATA array).";
          msgEl.style.opacity = "0.85";

          setPill("ok", "Live");
        } catch (e) {
          setPill("bad", "Error");
          msgEl.textContent = String(e.message || e);
          msgEl.style.opacity = "0.9";
        }
      });

      // Open
      el.querySelector('[data-act="open"]').addEventListener("click", () => {
        if (item.url) window.open(item.url, "_blank", "noopener,noreferrer");
      });

      // Move
      const moveBtn = el.querySelector('[data-act="move"]');
      if (moveBtn) {
        moveBtn.addEventListener("click", async () => {
          try {
            setPill("warn", "Working…");
            await apiAdminUpdate("move", { item });
            await refresh();
            setPill("ok", "Done");
          } catch (e) {
            setPill("bad", "Error");
            msgEl.textContent = String(e.message || e);
            msgEl.style.opacity = "0.9";
          }
        });
      }

      // Reject
      const rejBtn = el.querySelector('[data-act="reject"]');
      if (rejBtn) {
        rejBtn.addEventListener("click", async () => {
          try {
            setPill("warn", "Working…");
            await apiAdminUpdate("reject", { item });
            await refresh();
            setPill("ok", "Done");
          } catch (e) {
            setPill("bad", "Error");
            msgEl.textContent = String(e.message || e);
            msgEl.style.opacity = "0.9";
          }
        });
      }

      // Restore (from moved/rejected -> inbox)
      const restoreBtn = el.querySelector('[data-act="restore"]');
      if (restoreBtn) {
        restoreBtn.addEventListener("click", async () => {
          try {
            setPill("warn", "Working…");
            await apiAdminUpdate("restore", { item, from: which });
            await refresh();
            setPill("ok", "Done");
          } catch (e) {
            setPill("bad", "Error");
            msgEl.textContent = String(e.message || e);
            msgEl.style.opacity = "0.9";
          }
        });
      }

      listEl.appendChild(el);
    }
  }

  // =========================================================
  // REFRESH
  // =========================================================

  async function refresh() {
    setPill("warn", "Loading…");
    msgEl.textContent = "";

    try {
      const [inbox, moved, rejected] = await Promise.all([
        apiAdminList("inbox"),
        apiAdminList("moved"),
        apiAdminList("rejected")
      ]);

      state.inbox = inbox;
      state.moved = moved;
      state.rejected = rejected;

      setPill("ok", "Live");
      render();
    } catch (e) {
      setPill("bad", "Error");
      msgEl.textContent = String(e.message || e);
      msgEl.style.opacity = "0.9";
      render();
    }
  }

  // =========================================================
  // KEY + CLIPBOARD
  // =========================================================

  function loadKey() {
    const k = localStorage.getItem(KEY_STORE) || "";
    adminKeyEl.value = k;
  }

  async function copyOut() {
    try {
      await navigator.clipboard.writeText(outEl.textContent || "");
      msgEl.textContent = "Copied.";
      msgEl.style.opacity = "0.85";
    } catch {
      msgEl.textContent = "Copy failed (browser blocked clipboard).";
      msgEl.style.opacity = "0.85";
    }
  }

  function init() {
    loadKey();

    saveKeyBtn.addEventListener("click", () => {
      const k = adminKeyEl.value.trim();
      localStorage.setItem(KEY_STORE, k);
      msgEl.textContent = "Admin key saved in this browser.";
      msgEl.style.opacity = "0.85";
      refresh();
    });

    clearKeyBtn.addEventListener("click", () => {
      localStorage.removeItem(KEY_STORE);
      adminKeyEl.value = "";
      msgEl.textContent = "Admin key cleared.";
      msgEl.style.opacity = "0.85";
    });

    refreshBtn.addEventListener("click", refresh);
    qEl.addEventListener("input", render);
    viewEl.addEventListener("change", render);
    copyOutBtn.addEventListener("click", copyOut);

    refresh();
  }

  init();
})();
