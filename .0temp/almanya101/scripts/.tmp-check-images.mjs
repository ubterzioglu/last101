import fs from "fs";
import path from "path";

const root = process.cwd();
const exts = new Set([".html", ".css"]);
const skipDirs = new Set([".git", "node_modules", ".astro", ".vercel", ".idea", ".claude", "supabase"]);

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (exts.has(path.extname(entry.name))) files.push(full);
  }
}

walk(root);

const missing = [];
const isHttp = (s) => /^https?:\/\//i.test(s) || /^\/\//.test(s);
const stripQuery = (s) => s.replace(/[?#].*$/, "");

function checkLocal(ref, from) {
  if (!ref || isHttp(ref) || ref.startsWith("data:")) return;
  const clean = stripQuery(ref);
  const abs = clean.startsWith("/")
    ? path.join(root, clean)
    : path.resolve(path.dirname(from), clean);
  if (!fs.existsSync(abs)) missing.push({ from, ref });
}

const imgSrcRe = /\bimg[^>]+src\s*=\s*["']([^"']+)["']/gi;
const cssUrlRe = /url\(\s*["']?([^"')]+)["']?\s*\)/gi;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  let match;
  while ((match = imgSrcRe.exec(content))) checkLocal(match[1], file);
  while ((match = cssUrlRe.exec(content))) checkLocal(match[1], file);
}

const unique = new Map();
for (const item of missing) {
  const key = `${item.from}::${item.ref}`;
  if (!unique.has(key)) unique.set(key, item);
}

const list = Array.from(unique.values());
if (list.length === 0) {
  console.log("Kırık yerel görsel linki bulunmadı.");
  process.exit(0);
}

console.log("Kırık yerel görsel linkleri (ilk 50):");
list.slice(0, 50).forEach((x) => {
  console.log(`${x.ref}  ->  ${path.relative(root, x.from)}`);
});
console.log(`Toplam: ${list.length}`);
