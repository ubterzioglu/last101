/* DE 2026 Urlaubsplaner (UBT)
   - Gesetzliche Feiertage DE 2026
   - Bundesland-Auswahl (STATE)
   - KPI + Effizienz + Wochenübersicht
   - 3 Toggle: Info / Feiertage / Manuelle Tipps
*/

const DE_2026_BASE = [
  { date: "2026-01-01", name_de: "Neujahr", states: "ALL" },
  { date: "2026-04-03", name_de: "Karfreitag", states: "ALL" },
  { date: "2026-04-06", name_de: "Ostermontag", states: "ALL" },
  { date: "2026-05-01", name_de: "Tag der Arbeit", states: "ALL" },
  { date: "2026-05-14", name_de: "Christi Himmelfahrt", states: "ALL" },
  { date: "2026-05-25", name_de: "Pfingstmontag", states: "ALL" },
  { date: "2026-10-03", name_de: "Tag der Deutschen Einheit", states: "ALL" },
  { date: "2026-12-25", name_de: "1. Weihnachtstag", states: "ALL" },
  { date: "2026-12-26", name_de: "2. Weihnachtstag", states: "ALL" }
];

// Eyalete bağlı (tam eyalet geneli olanlar)
// Not: Bazı “kısmi” günler (ör. Mariä Himmelfahrt BY, Fronleichnam SN/TH) otomatik dahil edilmedi.
const DE_2026_STATE = [
  { date: "2026-01-06", name_de: "Heilige Drei Könige", states: ["BW","BY","ST"] },
  { date: "2026-03-08", name_de: "Internationaler Frauentag", states: ["BE","MV"] },
  { date: "2026-04-05", name_de: "Ostersonntag", states: ["BB"] },
  { date: "2026-05-24", name_de: "Pfingstsonntag", states: ["BB"] },

  // Fronleichnam: bundesweit değil; “klassik” eyaletler (tam eyalet geneli)
  { date: "2026-06-04", name_de: "Fronleichnam", states: ["BW","BY","HE","NW","RP","SL"] },

  // Mariä Himmelfahrt: Saarland eyalet geneli, Bayern'de kısmi -> sadece SL
  { date: "2026-08-15", name_de: "Mariä Himmelfahrt", states: ["SL"] },

  { date: "2026-09-20", name_de: "Weltkindertag", states: ["TH"] },
  { date: "2026-10-31", name_de: "Reformationstag", states: ["BB","HB","HH","MV","NI","SH","SN","ST","TH"] },
  { date: "2026-11-01", name_de: "Allerheiligen", states: ["BW","BY","NW","RP","SL"] },
  { date: "2026-11-18", name_de: "Buß- und Bettag", states: ["SN"] }
];

// --------------------
// DOM
// --------------------
const startEl = document.getElementById("startDate");
const endEl   = document.getElementById("endDate");
const stateEl = document.getElementById("stateSelect");

const pickedSummaryEl = document.getElementById("pickedSummary");
const tipsBoxEl = document.getElementById("tipsBox");           // system hints (auto)
const tipsCardEl = document.getElementById("tipsCard");         // manual tips (toggle)

const kpiTotalEl = document.getElementById("kpiTotal");
const kpiLeaveHumanEl = document.getElementById("kpiLeaveHuman");
const kpiHolidaysHumanEl = document.getElementById("kpiHolidaysHuman");
const kpiWeekendsEl = document.getElementById("kpiWeekends");

const tripBadgeEl = document.getElementById("tripBadge");
const effFillEl = document.getElementById("effFill");
const effTextEl = document.getElementById("effText");

const rhythmRowEl = document.getElementById("rhythmRow");
const weeklyPlanEl = document.getElementById("weeklyPlan");

const toggleInfoBtn = document.getElementById("toggleInfo");
const infoBodyEl = document.getElementById("infoBody");

const toggleHolidayListBtn = document.getElementById("toggleHolidayList");
const holidayListEl = document.getElementById("holidayList");

const toggleTipsBtn = document.getElementById("toggleTips");

const calcBtn = document.getElementById("calcBtn");
const resetBtn = document.getElementById("resetBtn");

// --------------------
// Holiday state
// --------------------
let ACTIVE_HOLIDAYS = [];
let HOLIDAY_MAP = new Map();

// --------------------
// Init
// --------------------
bindEvents();
ensureInitialToggleState();
rebuildHolidayMap();
renderHolidayList();
resetOutputText();

// --------------------
// Events
// --------------------
function bindEvents() {
  calcBtn.addEventListener("click", onCalculate);
  resetBtn.addEventListener("click", onReset);

  startEl.addEventListener("change", onDatesChanged);
  endEl.addEventListener("change", onDatesChanged);

  if (stateEl) {
    stateEl.addEventListener("change", () => {
      rebuildHolidayMap();
      renderHolidayList();

      // hesaplanmış çıktıları “temiz” bırak
      tipsBoxEl.classList.add("hidden");
      tipsBoxEl.innerHTML = "";
      resetOutputText();

      // tarih özeti kalsın diye tekrar üret
      onDatesChanged();
    });
  }

  toggleInfoBtn.addEventListener("click", () => toggleSection({
    btn: toggleInfoBtn,
    body: infoBodyEl,
    showText: "Bilgiyi Aç",
    hideText: "Bilgiyi Kapat"
  }));

  toggleHolidayListBtn.addEventListener("click", () => toggleSection({
    btn: toggleHolidayListBtn,
    body: holidayListEl,
    showText: "2026 Tatilleri Aç",
    hideText: "2026 Tatilleri Kapat"
  }));

  toggleTipsBtn.addEventListener("click", () => toggleSection({
    btn: toggleTipsBtn,
    body: tipsCardEl,
    showText: "İpuçlarını Aç",
    hideText: "İpuçlarını Kapat"
  }));
}

function ensureInitialToggleState() {
  setToggleUI(toggleInfoBtn, infoBodyEl, "Bilgiyi Aç", "Bilgiyi Kapat");
  setToggleUI(toggleHolidayListBtn, holidayListEl, "2026 Tatilleri Aç", "2026 Tatilleri Kapat");
  setToggleUI(toggleTipsBtn, tipsCardEl, "İpuçlarını Aç", "İpuçlarını Kapat");
}

// --------------------
// Toggle helpers
// --------------------
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

// --------------------
// Holiday selection
// --------------------
function rebuildHolidayMap() {
  const state = (stateEl && stateEl.value) ? stateEl.value : "ALL";

  const list = [];

  // base (all states)
  for (const h of DE_2026_BASE) list.push({ date: h.date, name_de: h.name_de, weight: 1 });

  // state dependent
  for (const h of DE_2026_STATE) {
    if (!Array.isArray(h.states)) continue;
    if (state === "ALL") continue; // ALL -> sadece bundesweit
    if (h.states.includes(state)) list.push({ date: h.date, name_de: h.name_de, weight: 1 });
  }

  // unique by date (if overlap)
  const uniq = new Map();
  for (const h of list) uniq.set(h.date, h);

  ACTIVE_HOLIDAYS = Array.from(uniq.values()).sort((a, b) => a.date.localeCompare(b.date));
  HOLIDAY_MAP = new Map(ACTIVE_HOLIDAYS.map(h => [h.date, h]));
}

// --------------------
// Date UI
// --------------------
function onDatesChanged() {
  const start = parseISODate(startEl.value);
  const end = parseISODate(endEl.value);

  if (startEl.value) endEl.min = startEl.value;
  else endEl.min = "";

  // auto tips temizle
  tipsBoxEl.classList.add("hidden");
  tipsBoxEl.innerHTML = "";

  if (!start || !end) {
    pickedSummaryEl.classList.add("hidden");
    pickedSummaryEl.textContent = "";
    return;
  }

  if (start.getTime() > end.getTime()) {
    pickedSummaryEl.classList.remove("hidden");
    pickedSummaryEl.innerHTML = `⚠️ Başlangıç tarihi bitiş tarihinden sonra olamaz.`;
    return;
  }

  const startTxt = `${longDateTR(start)}, ${capitalize(dayNameTR(start))}`;
  const endTxt   = `${longDateTR(end)}, ${capitalize(dayNameTR(end))}`;

  pickedSummaryEl.classList.remove("hidden");
  pickedSummaryEl.innerHTML =
    `<strong>Başlangıç:</strong> ${startTxt}<br>` +
    `<strong>Bitiş:</strong> ${endTxt}`;
}

// --------------------
// Calculate / Reset
// --------------------
function onCalculate() {
  const start = parseISODate(startEl.value);
  const end = parseISODate(endEl.value);

  if (!start || !end) return showAutoTip("⚠️ Lütfen başlangıç ve bitiş tarihini seçin.");
  if (start.getTime() > end.getTime()) return showAutoTip("⚠️ Başlangıç tarihi bitiş tarihinden sonra olamaz.");

  const result = computeRange(start, end);

  renderKPIs(result);
  renderEfficiency(result);
  renderTripBadge(result);
  renderRhythm(result);
  renderWeeklyPlan(result);

  const tips = buildAutoTips(start, end, result);
  renderAutoTips(tips);
}

function onReset() {
  startEl.value = "";
  endEl.value = "";
  endEl.min = "";

  pickedSummaryEl.classList.add("hidden");
  pickedSummaryEl.textContent = "";

  tipsBoxEl.classList.add("hidden");
  tipsBoxEl.innerHTML = "";

  resetOutputText();
}

function resetOutputText() {
  // KPI
  if (kpiTotalEl) kpiTotalEl.textContent = "—";
  if (kpiLeaveHumanEl) kpiLeaveHumanEl.textContent = "—";
  if (kpiHolidaysHumanEl) kpiHolidaysHumanEl.textContent = "—";
  if (kpiWeekendsEl) kpiWeekendsEl.textContent = "—";

  // Badge + eff
  if (tripBadgeEl) {
    tripBadgeEl.classList.add("hidden");
    tripBadgeEl.textContent = "";
  }

  if (effFillEl) effFillEl.style.width = "0%";
  if (effTextEl) effTextEl.textContent = "—";

  // Rhythm + weekly plan
  if (rhythmRowEl) rhythmRowEl.textContent = "—";
  if (weeklyPlanEl) {
    weeklyPlanEl.textContent = "Tarih aralığı seç ve hesapla – haftalık özet burada görünecek.";
    weeklyPlanEl.className = "weeklyPlan muted";
  }
}

// --------------------
// AUTO tips (system)
// --------------------
function showAutoTip(html) {
  tipsBoxEl.classList.remove("hidden");
  tipsBoxEl.innerHTML = html;
}

function renderAutoTips(tips) {
  if (!tips.length) {
    tipsBoxEl.classList.add("hidden");
    tipsBoxEl.innerHTML = "";
    return;
  }
  tipsBoxEl.classList.remove("hidden");
  tipsBoxEl.innerHTML = tips.map(t => `• ${t}`).join("<br>");
}

function buildAutoTips(start, end, r) {
  const tips = [];

  const in2026 = start.getUTCFullYear() === 2026 && end.getUTCFullYear() === 2026;
  if (!in2026) tips.push("ℹ️ Bu sürüm sadece <strong>2026</strong> resmî tatillerini içerir. 2026 dışındaki günlerde sadece hafta sonu mantığı geçerlidir.");

  const state = (stateEl && stateEl.value) ? stateEl.value : "ALL";
  if (state === "ALL") tips.push("🧭 Eyalet <strong>Tümü</strong> seçili: sadece ülke geneli tatiller dikkate alınır.");

  if (r.leaveDays > 0) {
    const ratio = r.totalDays / r.leaveDays;
    if (ratio >= 3.2) tips.push(`🚀 Süper verimli: <strong>${humanizeDays(r.leaveDays)}</strong> izin ile <strong>${r.totalDays}</strong> gün tatil.`);
    else if (ratio >= 2.4) tips.push(`☀️ Verimli: <strong>${humanizeDays(r.leaveDays)}</strong> izin ile <strong>${r.totalDays}</strong> gün tatil.`);
  } else if (r.totalDays > 0) {
    tips.push("🌿 İzin kullanmadan: sadece hafta sonu / tatiller.");
  }

  // Weekend-heavy hint
  if (r.officialHolidayDays > 0 && r.holidayHits.some(h => h.weekend)) {
    tips.push("🗓️ Not: Bazı tatiller hafta sonuna denk gelir ve ekstra iş günü kazandırmaz.");
  }

  return tips;
}

// --------------------
// KPI / results
// --------------------
function renderKPIs(r) {
  if (kpiTotalEl) kpiTotalEl.textContent = String(r.totalDays);
  if (kpiWeekendsEl) kpiWeekendsEl.textContent = String(r.weekendDays);
  if (kpiHolidaysHumanEl) kpiHolidaysHumanEl.textContent = humanizeDays(r.officialHolidayDays);
  if (kpiLeaveHumanEl) kpiLeaveHumanEl.textContent = humanizeDays(r.leaveDays);
}

function renderEfficiency(r) {
  const leave = r.leaveDays;
  const total = r.totalDays;

  if (!effFillEl || !effTextEl) return;

  if (leave <= 0) {
    effFillEl.style.width = "100%";
    effTextEl.textContent = "0 izin günü: sadece hafta sonu / tatiller.";
    return;
  }

  const ratio = total / leave;
  const pct = clamp(Math.round(((ratio - 1) / 3) * 100), 0, 100);
  effFillEl.style.width = `${pct}%`;
  effTextEl.textContent = `1 izin günü ≈ ${round1(ratio)} gün tatil`;
}

function renderTripBadge(r) {
  if (!tripBadgeEl) return;

  const leave = r.leaveDays;
  const total = r.totalDays;

  let label = "";
  if (leave <= 0 && total > 0) label = "🌿 Sadece hafta sonu / tatil";
  else {
    const ratio = total / leave;
    if (ratio >= 3.2) label = "🚀 Çok iyi plan";
    else if (ratio >= 2.4) label = "☀️ İyi plan";
    else label = "🧳 Klasik tatil";
  }

  // add tiny "holiday flavor"
  const hasOstern = r.holidayHits.some(h => /Oster/i.test(h.name_de));
  const hasWeihnachten = r.holidayHits.some(h => /Weihnacht/i.test(h.name_de));
  const hasBruecke = r.leaveDays > 0 && r.holidayHits.some(h => !h.weekend);

  const extra = [];
  if (hasBruecke) extra.push("Köprü gün havası");
  if (hasOstern) extra.push("Paskalya");
  if (hasWeihnachten) extra.push("Noel");

  if (extra.length) {
    tripBadgeEl.innerHTML = `<div>${label}</div><div>${extra.join(" • ")}</div>`;
  } else {
    tripBadgeEl.innerHTML = `<div>${label}</div>`;
  }
  tripBadgeEl.classList.remove("hidden");
}

function renderRhythm(r) {
  if (!rhythmRowEl) return;

  const weeks = groupDaysByWeek(r.days);
  rhythmRowEl.innerHTML = weeks.map(w => {
    const off = w.weekendDays + w.holidayDaysAll;
    const work = w.totalDays - w.weekendDays - w.holidayDaysAll;

    return `
      <div class="rhythmPill">
        <span class="dot dot--work"></span>${work} çalışma
        <span class="dot dot--off"></span>${off} tatil
      </div>
    `;
  }).join("");
}

function renderWeeklyPlan(r) {
  if (!weeklyPlanEl) return;

  const weeks = groupDaysByWeek(r.days);

  weeklyPlanEl.className = "weeklyPlan";
  weeklyPlanEl.innerHTML = weeks.map((w, idx) => {
    const title = `📅 Hafta ${idx + 1}`;
    const rangeTxt = `${shortDateTR(parseISODate(w.start))} – ${shortDateTR(parseISODate(w.end))}`;

    const leaveHuman = humanizeDays(w.leaveDays);
    const holidayHuman = w.holidayDaysWork > 0 ? humanizeDays(w.holidayDaysWork) : "0";

    const lines = [];
    if (w.holidays.length) {
      const list = w.holidays
        .slice(0, 4)
        .map(h => `${formatHolidayLabelDE(h.date)}: ${escapeHtml(h.name_de)}`)
        .join("<br>");
      lines.push(`<li><strong>Resmî Tatiller:</strong><br>${list}${w.holidays.length > 4 ? "<br>…" : ""}</li>`);
    } else {
      lines.push(`<li><strong>Resmî Tatiller:</strong> yok</li>`);
    }

    lines.push(`<li><strong>Bu hafta:</strong> ${w.totalDays} gün • ${w.weekendDays} hafta sonu • ${holidayHuman} tatil (iş günü) • <strong>${leaveHuman}</strong> izin</li>`);
    if (w.bridgeHint) lines.push(`<li>🧠 <strong>Köprü mümkün:</strong> Tatil hafta içine denk geliyor (Sal–Per).</li>`);

    return `
      <div class="weekCard">
        <div class="weekHead">
          <div class="weekTitle">${title} • <span class="weekMeta">${rangeTxt}</span></div>
          <div class="weekMeta">İzin: <strong>${leaveHuman}</strong></div>
        </div>
        <ul class="weekList">
          ${lines.join("")}
        </ul>
      </div>
    `;
  }).join("");
}

// --------------------
// Holiday list (DD.MM.YY - (Mo))
// --------------------
function renderHolidayList() {
  if (!holidayListEl) return;

  const state = (stateEl && stateEl.value) ? stateEl.value : "ALL";
  const prefix = state === "ALL" ? "Ülke geneli" : `Eyalet: ${state}`;

  holidayListEl.innerHTML =
    `<div class="muted" style="font-weight:800; margin-bottom:8px;">${escapeHtml(prefix)}</div>` +
    ACTIVE_HOLIDAYS
      .slice()
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(h => {
        return `<div class="hl-row">
          <div class="hl-date">${formatHolidayLabelDE(h.date)}</div>
          <div class="hl-name">${escapeHtml(h.name_de)}</div>
        </div>`;
      })
      .join("");
}

function formatHolidayLabelDE(iso) {
  const d = parseISODate(iso);
  if (!d) return iso;

  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy = String(d.getUTCFullYear()).slice(-2);

  return `${dd}.${mm}.${yy} - (${dayAbbrTR(d)})`;
}

function dayAbbrTR(dateObj) {
  const map = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  return map[dateObj.getUTCDay()];
}

// --------------------
// Core computation
// --------------------
function computeRange(startUTC, endUTC) {
  const days = [];
  let totalDays = 0;
  let weekendDays = 0;
  let workdays = 0;
  let holidayOnWorkdays = 0;

  const holidayHits = [];

  for (let d = new Date(startUTC.getTime()); d.getTime() <= endUTC.getTime(); d = addDaysUTC(d, 1)) {
    const iso = toISODateUTC(d);
    const weekend = isWeekendUTC(d);
    const holiday = HOLIDAY_MAP.get(iso) || null;

    totalDays += 1;
    if (weekend) weekendDays += 1;
    if (!weekend) workdays += 1;

    if (holiday) {
      holidayHits.push({ date: iso, name_de: holiday.name_de, weight: 1, weekend });
      if (!weekend) holidayOnWorkdays += 1;
    }

    days.push({
      date: iso,
      weekend,
      holiday: holiday ? { name_de: holiday.name_de, weight: 1 } : null
    });
  }

  let leaveDays = workdays - holidayOnWorkdays;
  if (leaveDays < 0) leaveDays = 0;

  return {
    totalDays,
    weekendDays,
    workdays,
    officialHolidayDays: holidayOnWorkdays,
    leaveDays,
    holidayHits,
    days
  };
}

// --------------------
// Weekly grouping
// --------------------
function groupDaysByWeek(days) {
  if (!days.length) return [];

  const out = [];
  let bucket = null;

  for (const day of days) {
    const dt = parseISODate(day.date);
    const weekKey = isoWeekKey(dt);

    if (!bucket || bucket.key !== weekKey) {
      if (bucket) finalizeBucket(bucket);
      bucket = newWeekBucket(weekKey, day.date);
      out.push(bucket);
    }

    bucket.totalDays += 1;
    if (day.weekend) bucket.weekendDays += 1;

    if (day.holiday) {
      bucket.holidayDaysAll += 1;
      if (!day.weekend) bucket.holidayDaysWork += 1;
      bucket.holidays.push({ date: day.date, name_de: day.holiday.name_de, weekend: day.weekend });
    }

    bucket.end = day.date;
  }

  if (bucket) finalizeBucket(bucket);
  return out;

  function newWeekBucket(key, startIso) {
    return {
      key,
      start: startIso,
      end: startIso,
      totalDays: 0,
      weekendDays: 0,
      holidayDaysAll: 0,
      holidayDaysWork: 0,
      holidays: [],
      leaveDays: 0,
      bridgeHint: false
    };
  }

  function finalizeBucket(b) {
    const work = b.totalDays - b.weekendDays;
    b.leaveDays = Math.max(0, work - b.holidayDaysWork);

    // Brücke: Feiertag Di–Do
    b.bridgeHint = b.holidays.some(h => {
      const d = parseISODate(h.date);
      const dow = d.getUTCDay(); // So=0 ... Sa=6
      return (dow >= 2 && dow <= 4) && !h.weekend;
    });
  }
}

function isoWeekKey(dateUTC) {
  const d = new Date(Date.UTC(dateUTC.getUTCFullYear(), dateUTC.getUTCMonth(), dateUTC.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 3 - ((d.getUTCDay() + 6) % 7));
  const weekYear = d.getUTCFullYear();
  const week1 = new Date(Date.UTC(weekYear, 0, 4));
  const weekNo = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getUTCDay() + 6) % 7)) / 7);
  return `${weekYear}-W${String(weekNo).padStart(2, "0")}`;
}

// --------------------
// Humanize
// --------------------
function humanizeDays(x) {
  const n = Number(x) || 0;
  return String(n);
}

// --------------------
// Date helpers
// --------------------
function parseISODate(iso) {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(Date.UTC(y, m - 1, d));
}

function toISODateUTC(dateObj) {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDaysUTC(dateObj, days) {
  const copy = new Date(dateObj.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function isWeekendUTC(dateObj) {
  const dow = dateObj.getUTCDay();
  return dow === 0 || dow === 6;
}

function dayNameTR(dateObj) {
  return new Intl.DateTimeFormat("tr-TR", { weekday: "long" }).format(dateObj);
}

function longDateTR(dateObj) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric" }).format(dateObj);
}

function shortDateTR(dateObj) {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short" }).format(dateObj);
}

function round1(x) {
  return Math.round(x * 10) / 10;
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function capitalize(s) {
  s = String(s || "");
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
