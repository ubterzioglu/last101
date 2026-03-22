// =========================================================
// FILE: /api/bookmarks-admin-curate.js
// POST /api/bookmarks-admin-curate
// body: { item: {...} }
// Requires: x-bookmarks-admin-key
// Returns: { ok:true, curated:{...} }
// =========================================================

import { isAdminAuthorized } from './_devuser-admin.js';

function send(res, code, obj) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

function slugify(s) {
  return (
    String(s || "")
      .toLowerCase()
      .trim()
      .replace(/https?:\/\//g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

// (optional) keep categories consistent with your MENU keys
function normalizeCategory(c) {
  const x = String(c || "").trim().toLowerCase();
  if (!x) return "tools";
  return x;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Method not allowed" });
  const auth = await isAdminAuthorized(req);
  if (!auth.ok) return send(res, auth.status, { error: auth.reason });

  let body = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  } catch {
    return send(res, 400, { error: "Invalid JSON" });
  }

  const item = body.item;
  if (!item || typeof item !== "object") return send(res, 400, { error: "Missing item" });

  const curated = {
    id: slugify(item.title || item.url || item.id),
    title: item.title || "",
    img: item.img || "./img/bookmarks/z0bookmark0010.png",
    href: item.url || item.href || "",
    note: item.description || item.note || "",
    category: normalizeCategory(item.category)
  };

  return send(res, 200, { ok: true, curated });
}
