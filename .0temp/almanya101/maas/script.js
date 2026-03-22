(function () {
  "use strict";

  const EUR = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

  // Stepstone Gehaltsreport 2026 (Bruttomediangehälter / alle Beschäftigten)
  // Source: Stepstone Gehaltsreport 2026 (PDF)
  const STEPSTONE_2026 = {
    overall: { median: 53900, mean: 59100 },
    // Median by experience (page 5)
    experience: {
      "<1": 46250,
      "1-2": 48400,
      "3-5": 51700,
      "6-10": 55500,
      "11-25": 59500,
      ">25": 60000
    },
    // Median by state for all employees (page 7)
    states: {
      SH: 51750,
      MV: 47750,
      HH: 60000,
      BB: 49250,
      HB: 55750,
      BE: 56500,
      NI: 52750,
      ST: 48250,
      NRW: 55250,
      SN: 49000,
      RP: 53250,
      TH: 48500,
      SL: 52750,
      HE: 58250,
      BW: 58500,
      BY: 57750
    },
    // Median by city (page 9)
    cities: {
      "Berlin": 56500,
      "Bremen": 56000,
      "Dresden": 51000,
      "Düsseldorf": 59750,
      "Erfurt": 49500,
      "Hamburg": 60000,
      "Hannover": 56750,
      "Kiel": 54000,
      "Magdeburg": 49500,
      "Mainz": 57250,
      "München": 64750,
      "Potsdam": 52750,
      "Saarbrücken": 55500,
      "Schwerin": 49500,
      "Stuttgart": 63750,
      "Wiesbaden": 60750,
      "Bielefeld": 56000,
      "Bochum": 54000,
      "Dortmund": 55500,
      "Duisburg": 54750,
      "Essen": 55750,
      "Frankfurt am Main": 64000,
      "Köln": 58500,
      "Leipzig": 51250,
      "Nürnberg": 58000,
      "Wuppertal": 55250
    },
    // Median by company size (page 10)
    companySize: {
      "1-50": 48800,
      "51-500": 54100,
      "501-5000": 59750,
      ">5000": 63000
    },
    // Median by education background (page 5)
    education: {
      yes: 68250, // mit Hochschulabschluss
      no: 51200   // ohne Hochschulabschluss
    },
    // Median by personal responsibility (page 5)
    responsibility: {
      yes: 62000,
      no: 51300
    },
    // Median by gender (page 5)
    gender: {
      m: 55900,
      f: 50500
    },
    // Median by job group (page 12)
    jobGroups: {
      "Bildung": 60250,
      "Büromanagement": 47250,
      "Einkauf, Vertrieb & Handel": 60500,
      "Finanzen & Rechnungswesen": 59250,
      "Gaststätten, Hotellerie und Tourismus": 50500,
      "Gebäudetechnik & Versorgung": 51250,
      "Gesundheits- und Pflegeberufe": 53000,
      "Altenpflege": 52250,
      "Arzt- & Praxishilfe": 49000,
      "Human- & Zahnmedizin": 105500,
      "Pflege, Rettung und Geburtshilfe": 58000,
      "Handwerk": 48750,
      "Hoch- & Tiefbau": 54000,
      "Informationstechnologie (IT)": 66750,
      "Ingenieurwesen": 75000,
      "Lebensmittelproduktion": 46500,
      "Logistik & Verkehr": 49750,
      "Marketing, Medien & Kommunikation": 57250,
      "Maschinen- & Fahrzeugtechnik": 57250,
      "Mechatronik & Elektrotechnik": 53500,
      "Metallbau & -verarbeitung": 49500,
      "Personalwesen": 54500,
      "Recht & Verwaltung": 57500,
      "Soziale Berufe": 52500,
      "Technische Entwicklung & Konstruktion": 72250,
      "Unternehmensorganisation und Management": 66750,
      "Verkauf": 48750
    }
  };

  function roundCent(v) { return Math.round((v + Number.EPSILON) * 100) / 100; }
  function safeNumber(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }
  function clampNonNegative(v) {
    return Math.max(0, safeNumber(v, 0));
  }
  function normalizeChildrenInput({ hasChildren, totalChildrenRaw, childrenUnder25Raw }) {
    const totalProvided = totalChildrenRaw !== null
      && totalChildrenRaw !== undefined
      && String(totalChildrenRaw).trim() !== "";
    const underProvided = childrenUnder25Raw !== null
      && childrenUnder25Raw !== undefined
      && String(childrenUnder25Raw).trim() !== "";

    let totalChildrenCount = Math.floor(clampNonNegative(totalChildrenRaw));
    let childrenUnder25Count = Math.floor(clampNonNegative(childrenUnder25Raw));

    if (!hasChildren) {
      return { valid: true, totalChildrenCount: 0, childrenUnder25Count: 0 };
    }

    if (!totalProvided || totalChildrenCount < 1) {
      return { valid: false, error: "Lütfen çocuk sayısını girin." };
    }

    if (!underProvided) {
      return { valid: false, error: "Lütfen 25 yaş altı çocuk sayısını girin." };
    }

    if (childrenUnder25Count > totalChildrenCount) {
      childrenUnder25Count = totalChildrenCount;
    }

    return { valid: true, totalChildrenCount, childrenUnder25Count };
  }

  let lastGrossMonthly = null;

  function getAmountConfig() {
    const amountInput = safeNumber(document.getElementById("amountInput")?.value, 0);
    const amountType = String(document.querySelector("input[name=\"amountType\"]:checked")?.value || "gross");
    const amountPeriod = String(document.querySelector("input[name=\"amountPeriod\"]:checked")?.value || "monthly");
    return { amountInput, amountType, amountPeriod };
  }

  function toMonthly(amountValue, period) {
    return period === "yearly" ? amountValue / 12 : amountValue;
  }

  function getGrossMonthlyFromInput() {
    const { amountInput, amountType, amountPeriod } = getAmountConfig();
    if (amountType !== "gross") return 0;
    return roundCent(toMonthly(amountInput, amountPeriod));
  }

  function getRadioValue(name, fallback) {
    return String(document.querySelector(`input[name="${name}"]:checked`)?.value || fallback);
  }

  function getCompanyCarConfig() {
    const enabled = Boolean(document.getElementById("hasCompanyCar")?.checked);
    if (!enabled) {
      return {
        enabled: false,
        listPrice: 0,
        rate: 0,
        commuteEnabled: false,
        commuteKm: 0,
        commuteMode: "monthly",
        commuteDays: 0
      };
    }

    const listPrice = safeNumber(document.getElementById("carListPrice")?.value, 0);
    const rate = safeNumber(getRadioValue("carRate", "0.01"), 0.01);
    const commuteEnabled = Boolean(document.getElementById("carCommute")?.checked);
    const commuteKm = safeNumber(document.getElementById("carCommuteKm")?.value, 0);
    const commuteMode = getRadioValue("carCommuteMode", "monthly");
    const commuteDays = Math.max(0, safeNumber(document.getElementById("carCommuteDays")?.value, 0));

    return {
      enabled,
      listPrice,
      rate,
      commuteEnabled,
      commuteKm,
      commuteMode,
      commuteDays
    };
  }

  function calcCompanyCarBenefitMonthly(cfg) {
    if (!cfg || !cfg.enabled) return 0;
    if (!cfg.listPrice || cfg.listPrice <= 0) return 0;

    let benefit = cfg.listPrice * cfg.rate;

    if (cfg.commuteEnabled && cfg.commuteKm > 0) {
      if (cfg.commuteMode === "daily") {
        benefit += cfg.listPrice * cfg.commuteKm * 0.00002 * cfg.commuteDays;
      } else {
        benefit += cfg.listPrice * cfg.commuteKm * 0.0003;
      }
    }

    return roundCent(benefit);
  }

  function syncCompanyCarUI() {
    const enabled = Boolean(document.getElementById("hasCompanyCar")?.checked);
    const carFields = document.getElementById("companyCarFields");
    if (carFields) carFields.classList.toggle("hidden", !enabled);

    const commuteEnabled = Boolean(document.getElementById("carCommute")?.checked);
    const commuteFields = document.getElementById("carCommuteFields");
    if (commuteFields) commuteFields.classList.toggle("hidden", !enabled || !commuteEnabled);

    const mode = getRadioValue("carCommuteMode", "monthly");
    const daysWrap = document.getElementById("carCommuteDaysWrap");
    if (daysWrap) daysWrap.classList.toggle("hidden", !enabled || !commuteEnabled || mode !== "daily");
  }

  function syncInsuranceUI() {
    const insuranceType = getRadioValue("insuranceType", "gkv");
    const gkvFields = document.getElementById("gkvFields");
    const pkvFields = document.getElementById("pkvFields");
    if (gkvFields) gkvFields.classList.toggle("hidden", insuranceType !== "gkv");
    if (pkvFields) pkvFields.classList.toggle("hidden", insuranceType !== "pkv");
  }

  function syncChildrenUI() {
    const hasChildren = Boolean(document.getElementById("hasChildren")?.checked);
    const childrenFields = document.getElementById("childrenFields");
    if (childrenFields) childrenFields.classList.toggle("hidden", !hasChildren);

    if (!hasChildren) {
      const totalEl = document.getElementById("childrenCount");
      const underEl = document.getElementById("childrenUnder25Count");
      if (totalEl) totalEl.value = "0";
      if (underEl) underEl.value = "0";
    }
  }

  function hasPapLohnsteuer() {
    return typeof window !== "undefined"
      && typeof window.Lohnsteuer2026 === "function"
      && typeof window.BigDecimal === "function";
  }

  function calcLohnsteuerAndSoliPAP({
    grossMonthly,
    taxClass,
    kvZusatz,
    hasChildren,
    age23Plus,
    churchTaxEnabled,
    state,
    childAllowance,
    pva,
    insuranceType,
    pkvEmployeePremiumMonthly,
    ppvEmployeePremiumMonthly,
    pkvEmployerSubsidyMonthly
  }) {
    if (!hasPapLohnsteuer()) return null;
    try {
      const BigDecimal = window.BigDecimal;
      const grossCents = Math.max(0, Math.round(grossMonthly * 100));
      const kvZusatzRate = safeNumber(kvZusatz, 0);
      const childlessSurchargeApplied = Boolean(age23Plus) && !hasChildren;
      const isPkv = insuranceType === "pkv";
      const pkvEmployee = isPkv ? clampNonNegative(pkvEmployeePremiumMonthly) : 0;
      const ppvEmployee = isPkv ? clampNonNegative(ppvEmployeePremiumMonthly) : 0;
      const pkvSubsidy = isPkv ? clampNonNegative(pkvEmployerSubsidyMonthly) : 0;
      const pkvTotal = roundCent(pkvEmployee + ppvEmployee);
      const pkvAgz = Math.min(pkvSubsidy, pkvTotal);
      const pkvCents = Math.max(0, Math.round(pkvTotal * 100));
      const pkvAgzCents = Math.max(0, Math.round(pkvAgz * 100));
      const zkfRaw = Math.max(0, safeNumber(childAllowance, 0));
      const zkf = Math.round(zkfRaw * 10) / 10;
      const pvaCount = Math.min(4, Math.max(0, Math.floor(safeNumber(pva, 0))));

      const pap = new window.Lohnsteuer2026({
        LZZ: 2,
        STKL: Number(taxClass),
        RE4: BigDecimal.valueOf(grossCents),
        KVZ: BigDecimal.valueOf(kvZusatzRate),
        KRV: 0,
        ALV: 0,
        PVS: state === "SN" ? 1 : 0,
        PVZ: childlessSurchargeApplied ? 1 : 0,
        PVA: BigDecimal.valueOf(pvaCount),
        PKV: isPkv ? 1 : 0,
        PKPV: BigDecimal.valueOf(pkvCents),
        PKPVAGZ: BigDecimal.valueOf(pkvAgzCents),
        af: 0,
        f: 1,
        R: churchTaxEnabled ? 1 : 0,
        ZKF: BigDecimal.valueOf(zkf)
      });

      pap.MAIN();

      const lohnsteuer = roundCent(pap.getLstlzz().toNumber() / 100);
      const soli = roundCent(pap.getSolzlzz().toNumber() / 100);
      const kirchensteuerBase = roundCent(pap.getBk().toNumber() / 100);

      return { lohnsteuer, soli, kirchensteuerBase, source: "pap" };
    } catch (error) {
      console.warn("PAP 2026 hesaplama hatasi, legacy mod kullaniliyor:", error);
      return null;
    }
  }

  // 2026 German Income Tax (Einkommensteuer) - Hardcoded Formula
  // Source: BMF Programmablaufplan 2026 / EStG §32a
  // Grundfreibetrag: 12,096 EUR (2026)
  // Zone boundaries and rates per official 2026 tax schedule
  const TAX_2026 = {
    year: 2026,
    // Tax brackets (zu versteuerndes Einkommen - annual)
    grundfreibetrag: 12096,    // No tax up to this amount
    zone2End: 17443,           // End of first progressive zone
    zone3End: 68480,           // End of second progressive zone
    zone4End: 277825,          // End of 42% zone, above = 45%
    // Solidarity surcharge threshold (annual Lohnsteuer)
    soliFreigrenze: 19488,     // No soli if annual LSt <= this (joint: 38976)
    soliRate: 0.055            // 5.5% of Lohnsteuer above threshold
  };

  let datasetLabel = `BMF PAP 2026 (XML)`;

  function setBadge() {
    const el = document.getElementById("datasetBadge");
    if (el) el.textContent = datasetLabel;
  }

  // Calculate annual Einkommensteuer using 2026 formula (§32a EStG)
  function calcEinkommensteuer2026(zvE) {
    if (zvE <= TAX_2026.grundfreibetrag) {
      return 0;
    }

    if (zvE <= TAX_2026.zone2End) {
      // Zone 2: progressive 14% - ~24%
      const y = (zvE - TAX_2026.grundfreibetrag) / 10000;
      return roundCent((922.98 * y + 1400) * y);
    }

    if (zvE <= TAX_2026.zone3End) {
      // Zone 3: progressive ~24% - 42%
      const z = (zvE - TAX_2026.zone2End) / 10000;
      return roundCent((181.19 * z + 2397) * z + 1025.38);
    }

    if (zvE <= TAX_2026.zone4End) {
      // Zone 4: flat 42%
      return roundCent(0.42 * zvE - 10637.88);
    }

    // Zone 5: flat 45% (Reichensteuer)
    return roundCent(0.45 * zvE - 18971.21);
  }

  // Estimate Vorsorgepauschale (simplified for Steuerklasse 1-4)
  function calcVorsorgepauschale(grossYearly, kvZusatz) {
    const BBG_RV = 8450 * 12; // 101,400 EUR/year for 2026
    const BBG_KV = 5812.50 * 12; // 69,750 EUR/year for 2026

    // RV contribution (employee share 9.3%)
    const rvBasis = Math.min(grossYearly, BBG_RV);
    const rvBeitrag = rvBasis * 0.093;

    // KV contribution for Vorsorgepauschale (simplified: 12% of basis, capped)
    const kvBasis = Math.min(grossYearly, BBG_KV);
    const kvBeitrag = kvBasis * 0.12; // Simplified rate for Vorsorgepauschale

    return roundCent(rvBeitrag + kvBeitrag);
  }

  // Calculate monthly Lohnsteuer based on tax class
  function calcLohnsteuer({ grossMonthly, taxClass, kvZusatz }) {
    const grossYearly = grossMonthly * 12;

    // Estimate zu versteuerndes Einkommen (simplified)
    // Subtract Werbungskostenpauschale (1,230 EUR) and Vorsorgepauschale
    const werbungskosten = 1230;
    const sonderausgaben = 36; // Sonderausgabenpauschale
    const vorsorgepauschale = calcVorsorgepauschale(grossYearly, kvZusatz);

    const zvEStandard = grossYearly - werbungskosten - sonderausgaben - vorsorgepauschale;
    // Approximation for class 5/6: remove basic allowance effect
    const zvENoAllowance = grossYearly - vorsorgepauschale + TAX_2026.grundfreibetrag;

    // Tax class adjustments
    let lstYearly = 0;
    switch (taxClass) {
      case "1":
      case "4":
        // Standard calculation
        lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard));
        break;
      case "2":
        // Single parent: additional Entlastungsbetrag (4,260 EUR base)
        lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard - 4260));
        break;
      case "3":
        // Married, higher earner: use Splittingtarif (calculate on half, double result)
        lstYearly = 2 * calcEinkommensteuer2026(Math.max(0, zvEStandard / 2));
        break;
      case "5":
      case "6":
        // No allowances; use approximation without basic allowance
        lstYearly = calcEinkommensteuer2026(Math.max(0, zvENoAllowance));
        break;
      default:
        lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard));
    }

    return roundCent(lstYearly / 12);
  }

  // Calculate Solidaritätszuschlag
  function calcSoli(lohnsteuerMonthly, taxClass) {
    const lstYearly = lohnsteuerMonthly * 12;

    // Freigrenze depends on tax class (joint vs single)
    const freigrenze = (taxClass === "3")
      ? TAX_2026.soliFreigrenze * 2
      : TAX_2026.soliFreigrenze;

    if (lstYearly <= freigrenze) {
      return 0;
    }

    // Gleitzone: gradually phase in soli above Freigrenze
    // Full 5.5% only applies once LSt exceeds threshold significantly
    const soliYearly = lstYearly * TAX_2026.soliRate;

    // Cap at 11.9% of difference above Freigrenze (Milderungszone)
    const maxSoli = (lstYearly - freigrenze) * 0.119;

    return roundCent(Math.min(soliYearly, maxSoli) / 12);
  }

  // Legacy fallback for Lohnsteuer/Soli (approximation)
  function calcLohnsteuerAndSoliLegacy({ grossMonthly, taxClass, kvZusatz }) {
    const lohnsteuer = calcLohnsteuer({ grossMonthly, taxClass, kvZusatz });
    const soli = calcSoli(lohnsteuer, taxClass);
    return { lohnsteuer, soli, kirchensteuerBase: null, source: "legacy" };
  }

  // Main function to calculate Lohnsteuer and Soli (PAP 2026 preferred)
  function calcLohnsteuerAndSoli(params) {
    const pap = calcLohnsteuerAndSoliPAP(params);
    if (pap) return pap;
    return calcLohnsteuerAndSoliLegacy(params);
  }

  function calcChurchTax({ base, lohnsteuer, state, enabled }) {
    if (!enabled) return 0;

    const basis = Number.isFinite(base) && base > 0 ? base : lohnsteuer;
    if (!basis || basis <= 0) return 0;

    const rate = (state === "BY" || state === "BW") ? 0.08 : 0.09;
    return roundCent(basis * rate);
  }

  function calcRvAv(grossMonthly) {
    const BBG_RV_AV = 8450.00;
    const rvEmployeeRate = 0.093;
    const avEmployeeRate = 0.013;
    const rvBaseAmount = Math.min(grossMonthly, BBG_RV_AV);
    return {
      rv: roundCent(rvBaseAmount * rvEmployeeRate),
      av: roundCent(rvBaseAmount * avEmployeeRate)
    };
  }

  function calcSocialInsurance(grossMonthly, kvBase, kvZusatz, hasChildren, state, age23Plus, childrenUnder25Count) {
    // 2026 Rechengroessen / Beitragssaetze (employee shares)
    // - BBG KV/PV: 5,812.50 EUR / month
    // - BBG RV/AV: 8,450.00 EUR / month
    // Sources (for documentation):
    // - DRV / GKV-Spitzenverband publish the 2026 rates and contribution ceilings.

    const BBG_KV_PV = 5812.50;

    const kvBaseRate = Math.max(0, kvBase / 100);      // e.g. 0.146
    const kvZusatzRate = Math.max(0, kvZusatz / 100);  // e.g. 0.029
    const kvEmployeeRate = (kvBaseRate + kvZusatzRate) / 2;
    const isSaxony = state === "SN";
    const under25 = Math.max(0, Math.floor(safeNumber(childrenUnder25Count, 0)));
    let pvEmployeeRate = isSaxony ? 0.023 : 0.018;
    const childlessSurchargeApplied = Boolean(age23Plus) && !hasChildren;
    if (childlessSurchargeApplied) {
      pvEmployeeRate += 0.006;
    }
    let pvReductionChildrenCount = 0;
    if (under25 >= 2) {
      pvReductionChildrenCount = Math.min(under25, 5) - 1;
      pvEmployeeRate -= pvReductionChildrenCount * 0.0025;
    }
    pvEmployeeRate = Math.max(0, pvEmployeeRate);

    const baseTotalRate = isSaxony ? 0.046 : 0.036;
    const childlessSurchargeTotal = 0.012;
    const reductionPerChildTotal = 0.005;
    let pvTotalRate = baseTotalRate + (childlessSurchargeApplied ? childlessSurchargeTotal : 0)
      - (pvReductionChildrenCount * reductionPerChildTotal);
    pvTotalRate = Math.max(0, pvTotalRate);

    const kvBaseAmount = Math.min(grossMonthly, BBG_KV_PV);

    const kv = roundCent(kvBaseAmount * kvEmployeeRate);
    const pv = roundCent(kvBaseAmount * pvEmployeeRate);
    const rvAv = calcRvAv(grossMonthly);

    return {
      rv: rvAv.rv,
      av: rvAv.av,
      kv,
      pv,
      pvEmployeeRate: pvEmployeeRate,
      pvTotalRate: pvTotalRate,
      childlessSurchargeApplied,
      pvReductionChildrenCount
    };
  }

  function computeHealthAndCareContribs({
    insuranceType,
    grossTaxableMonthly,
    kvBase,
    kvZusatz,
    hasChildren,
    age23Plus,
    totalChildrenCount,
    childrenUnder25Count,
    state,
    pkvEmployeePremiumMonthly,
    ppvEmployeePremiumMonthly
  }) {
    const type = insuranceType === "pkv" ? "pkv" : "gkv";
    const hasChildrenFlag = Boolean(hasChildren);
    const totalChildren = Math.max(0, Math.floor(safeNumber(totalChildrenCount, 0)));
    const under25 = Math.min(
      Math.max(0, Math.floor(safeNumber(childrenUnder25Count, 0))),
      totalChildren
    );
    const grossMonthly = Math.max(0, safeNumber(grossTaxableMonthly, 0));

    if (type === "gkv") {
      const social = calcSocialInsurance(
        grossMonthly,
        kvBase,
        kvZusatz,
        hasChildrenFlag,
        state,
        age23Plus,
        under25
      );
      const kv_or_pkv = roundCent(social.kv);
      const pv_or_ppv = roundCent(social.pv);
      const rv = roundCent(social.rv);
      const av = roundCent(social.av);
      const deductibleMonthly = roundCent(kv_or_pkv + pv_or_ppv + rv + av);
      const children = {
        hasChildren: hasChildrenFlag,
        totalChildrenCount: totalChildren,
        childrenUnder25Count: Math.min(under25, totalChildren),
        childlessSurchargeApplied: social.childlessSurchargeApplied,
        pvReductionChildrenCount: social.pvReductionChildrenCount,
        pvRateEmployeeEffective: roundCent(social.pvEmployeeRate * 100)
      };
      const pvBreakdown = {
        age23Plus: Boolean(age23Plus),
        hasChildren: hasChildrenFlag,
        childlessSurchargeApplied: social.childlessSurchargeApplied,
        childrenUnder25Count: Math.min(under25, totalChildren),
        pvReductionChildrenCount: social.pvReductionChildrenCount,
        pvTotalRate: roundCent(social.pvTotalRate * 100),
        pvEmployeeRate: roundCent(social.pvEmployeeRate * 100)
      };
      return { insuranceType: type, kv_or_pkv, pv_or_ppv, rv, av, deductibleMonthly, children, pvBreakdown };
    }

    const pkvEmployee = clampNonNegative(pkvEmployeePremiumMonthly);
    const ppvEmployee = clampNonNegative(ppvEmployeePremiumMonthly);
    const rvAv = calcRvAv(grossMonthly);
    const kv_or_pkv = roundCent(pkvEmployee);
    const pv_or_ppv = roundCent(ppvEmployee);
    const deductibleMonthly = roundCent(kv_or_pkv + pv_or_ppv + rvAv.rv + rvAv.av);

    const children = {
      hasChildren: hasChildrenFlag,
      totalChildrenCount: totalChildren,
      childrenUnder25Count: Math.min(under25, totalChildren),
      childlessSurchargeApplied: false,
      pvReductionChildrenCount: 0,
      pvRateEmployeeEffective: 0
    };
    const pvBreakdown = {
      age23Plus: Boolean(age23Plus),
      hasChildren: hasChildrenFlag,
      childlessSurchargeApplied: false,
      childrenUnder25Count: Math.min(under25, totalChildren),
      pvReductionChildrenCount: 0,
      pvTotalRate: 0,
      pvEmployeeRate: 0
    };

    return {
      insuranceType: type,
      kv_or_pkv,
      pv_or_ppv,
      rv: rvAv.rv,
      av: rvAv.av,
      deductibleMonthly,
      children,
      pvBreakdown
    };
  }


  // --- Net -> Brüt (reverse calculation) helpers ---
  function netFromGross(grossMonthly, p) {
    const carBenefitMonthly = calcCompanyCarBenefitMonthly(p.companyCar);
    const taxableGross = roundCent(grossMonthly + carBenefitMonthly);

    const socialInsurance = computeHealthAndCareContribs({
      insuranceType: p.insuranceType,
      grossTaxableMonthly: taxableGross,
      kvBase: p.kvBase,
      kvZusatz: p.kvZusatz,
      hasChildren: p.hasChildren,
      age23Plus: p.age23Plus,
      totalChildrenCount: p.totalChildrenCount,
      childrenUnder25Count: p.childrenUnder25Count,
      state: p.state,
      pkvEmployeePremiumMonthly: p.pkvEmployeePremiumMonthly,
      ppvEmployeePremiumMonthly: p.ppvEmployeePremiumMonthly
    });

    const tax = calcLohnsteuerAndSoli({
      grossMonthly: taxableGross,
      taxClass: p.taxClass,
      kvZusatz: p.kvZusatz,
      hasChildren: p.hasChildren,
      age23Plus: p.age23Plus,
      churchTaxEnabled: p.churchTaxEnabled,
      state: p.state,
      childAllowance: p.childAllowance,
      pva: p.childrenUnder25Count,
      insuranceType: p.insuranceType,
      pkvEmployeePremiumMonthly: p.pkvEmployeePremiumMonthly,
      ppvEmployeePremiumMonthly: p.ppvEmployeePremiumMonthly,
      pkvEmployerSubsidyMonthly: p.pkvEmployerSubsidyMonthly
    });
    const kirchensteuer = calcChurchTax({
      base: tax.kirchensteuerBase,
      lohnsteuer: tax.lohnsteuer,
      state: p.state,
      enabled: p.churchTaxEnabled
    });

    const deductions = roundCent(
      socialInsurance.kv_or_pkv
      + socialInsurance.pv_or_ppv
      + socialInsurance.rv
      + socialInsurance.av
      + tax.lohnsteuer
      + tax.soli
      + kirchensteuer
    );
    const net = roundCent(grossMonthly - deductions - carBenefitMonthly);
    const pkvEmployee = clampNonNegative(p.pkvEmployeePremiumMonthly);
    const ppvEmployee = clampNonNegative(p.ppvEmployeePremiumMonthly);
    const pkvSubsidy = clampNonNegative(p.pkvEmployerSubsidyMonthly);
    const pkvImpact = p.insuranceType === "pkv"
      ? roundCent(Math.max(0, pkvEmployee + ppvEmployee - pkvSubsidy))
      : 0;

    return {
      net,
      deductions,
      social: {
        kv: socialInsurance.kv_or_pkv,
        pv: socialInsurance.pv_or_ppv,
        rv: socialInsurance.rv,
        av: socialInsurance.av
      },
      socialInsurance,
      breakdown: { pkvImpact, pv: socialInsurance.pvBreakdown, children: socialInsurance.children },
      tax,
      kirchensteuer,
      carBenefitMonthly,
      taxableGross
    };
  }

  function findGrossForTargetNet(targetNetMonthly, p) {
    let lo = 0;
    let hi = Math.max(2000, targetNetMonthly * 2.2);

    // Grow upper bound until net meets/exceeds target (or loop limit)
    for (let i = 0; i < 30; i++) {
      const out = netFromGross(hi, p);
      if (out.net >= targetNetMonthly) break;
      hi *= 1.3;
    }

    const EPS = 0.01;   // 1 cent
    const MAX_IT = 60;

    let bestGross = hi;
    let bestOut = netFromGross(hi, p);

    for (let i = 0; i < MAX_IT; i++) {
      const mid = (lo + hi) / 2;
      const out = netFromGross(mid, p);

      if (Math.abs(out.net - targetNetMonthly) < Math.abs(bestOut.net - targetNetMonthly)) {
        bestGross = mid;
        bestOut = out;
      }

      if (out.net < targetNetMonthly) lo = mid;
      else hi = mid;

      if (Math.abs(out.net - targetNetMonthly) <= EPS) break;
    }

    return { grossMonthly: roundCent(bestGross), ...bestOut };
  }



  function row(label, value) {
    return `
      <div style="display:flex;justify-content:space-between;gap:14px;padding:10px 12px;border:1px solid rgba(255,255,255,.08);background:#0b111a;border-radius:12px;">
        <div style="font-size:13px;opacity:.9;">${label}</div>
        <div style="font-size:13px;font-weight:950;">${EUR.format(value)}</div>
      </div>`;
  }

  function pct(v) {
    if (!Number.isFinite(v)) return "—";
    const sign = v > 0 ? "+" : "";
    return `${sign}${v.toFixed(1)}%`;
  }

  function deltaText(grossYearly, median) {
    const d = roundCent(grossYearly - median);
    const dp = (grossYearly / median - 1) * 100;
    const sign = d > 0 ? "+" : "";
    return { d, dp, text: `${sign}${EUR.format(d)} (${pct(dp)})` };
  }

  function renderCompareSummary(html) {
    const el = document.getElementById("compareSummary");
    if (el) el.innerHTML = html;
  }

  function compareRow(title, grossYearly, median) {
    const dt = deltaText(grossYearly, median);
    return `
      <div style="display:flex;justify-content:space-between;gap:14px;padding:10px 12px;border:1px solid rgba(255,255,255,.08);background:#0b111a;border-radius:12px;">
        <div style="font-size:13px;opacity:.9;">${title}</div>
        <div style="text-align:right;">
          <div style="font-size:13px;font-weight:950;">${EUR.format(median)}</div>
          <div style="font-size:12px;opacity:.8;">Fark: <b>${dt.text}</b></div>
        </div>
      </div>`;
  }

  function populateCompareSelects() {
    const jobSel = document.getElementById("compareJobGroup");
    const citySel = document.getElementById("compareCity");
    if (jobSel) {
      const keys = Object.keys(STEPSTONE_2026.jobGroups);
      keys.sort((a, b) => a.localeCompare(b, "de"));
      for (const k of keys) {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        jobSel.appendChild(opt);
      }
    }
    if (citySel) {
      const keys = Object.keys(STEPSTONE_2026.cities);
      keys.sort((a, b) => a.localeCompare(b, "de"));
      for (const k of keys) {
        const opt = document.createElement("option");
        opt.value = k;
        opt.textContent = k;
        citySel.appendChild(opt);
      }
    }
  }

  function buildStepstoneSummary({ grossMonthly }) {
    const grossYearly = roundCent(grossMonthly * 12);
    const state = String(document.getElementById("state").value); // Artık eyalet seçimi cinsiyet kartı yanında

    const jobGroup = String(document.getElementById("compareJobGroup").value || "");
    const experience = String(document.getElementById("compareExperience").value || "");
    const city = String(document.getElementById("compareCity").value || "");
    const companySize = String(document.getElementById("compareCompanySize").value || "");
    const education = String(document.getElementById("compareEducation").value || "");
    const responsibility = String(document.getElementById("compareResponsibility").value || "");
    const gender = String(document.getElementById("compareGender").value || "");

    const missing = [];
    if (!jobGroup) missing.push("Meslek grubu");
    if (!experience) missing.push("Deneyim");
    if (!city) missing.push("Şehir");
    if (!companySize) missing.push("Şirket büyüklüğü");
    if (!education) missing.push("Eğitim");
    if (!responsibility) missing.push("Personalverantwortung");
    if (!gender) missing.push("Cinsiyet");

    if (!grossMonthly || grossMonthly <= 0) missing.unshift("Aylık Brüt");
    if (!state) missing.unshift("Eyalet");

    if (missing.length) {
      renderCompareSummary(`
        <div style="padding:12px;border-radius:12px;border:1px dashed rgba(255,255,255,.18);background:rgba(255,255,255,.03);font-size:13px;line-height:1.6;">
          <b>Özet üretmek için eksikler:</b> ${missing.join(", ")}
        </div>
      `);
      return;
    }

    const overallMedian = STEPSTONE_2026.overall.median;
    const overallMean = STEPSTONE_2026.overall.mean;
    const stateMedian = STEPSTONE_2026.states[state];
    const jobMedian = STEPSTONE_2026.jobGroups[jobGroup];
    const expMedian = STEPSTONE_2026.experience[experience];
    const cityMedian = STEPSTONE_2026.cities[city];
    const companyMedian = STEPSTONE_2026.companySize[companySize];
    const eduMedian = STEPSTONE_2026.education[education];
    const respMedian = STEPSTONE_2026.responsibility[responsibility];
    const genderMedian = STEPSTONE_2026.gender[gender];

    const summaryTop = `
      <div style="display:flex;justify-content:space-between;gap:14px;padding:12px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.04);border-radius:12px;">
        <div>
          <div style="font-size:12px;opacity:.85;">Senin yıllık brütün</div>
          <div style="font-size:22px;font-weight:950;">${EUR.format(grossYearly)}</div>
          <div style="font-size:12px;opacity:.8;">Kaynak: Stepstone Gehaltsreport 2026</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:12px;opacity:.85;">Genel Almanya</div>
          <div style="font-size:13px;font-weight:950;">Median: ${EUR.format(overallMedian)}</div>
          <div style="font-size:13px;font-weight:950;">Ortalama: ${EUR.format(overallMean)}</div>
        </div>
      </div>
    `;

    const picks = `
      <div style="padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.10);background:rgba(255,255,255,.02);font-size:13px;line-height:1.7;">
        <b>Seçimin:</b>
        <div>• Eyalet: <b>${state}</b></div>
        <div>• Meslek grubu: <b>${jobGroup}</b></div>
        <div>• Deneyim: <b>${experience}</b></div>
        <div>• Şehir: <b>${city}</b></div>
        <div>• Şirket büyüklüğü: <b>${companySize}</b></div>
        <div>• Eğitim: <b>${education === "yes" ? "Var" : "Yok"}</b></div>
        <div>• Personalverantwortung: <b>${responsibility === "yes" ? "Var" : "Yok"}</b></div>
        <div>• Cinsiyet: <b>${gender === "m" ? "Erkek" : "Kadın"}</b></div>
      </div>
    `;

    const rows = [
      compareRow("Genel Almanya (Median)", grossYearly, overallMedian),
      compareRow("Genel Almanya (Ortalama)", grossYearly, overallMean),
      compareRow(`Eyalet (${state})`, grossYearly, stateMedian),
      compareRow(`Meslek grubu (${jobGroup})`, grossYearly, jobMedian),
      compareRow(`Deneyim (${experience})`, grossYearly, expMedian),
      compareRow(`Şehir (${city})`, grossYearly, cityMedian),
      compareRow(`Şirket büyüklüğü (${companySize})`, grossYearly, companyMedian),
      compareRow(`Eğitim (${education === "yes" ? "Var" : "Yok"})`, grossYearly, eduMedian),
      compareRow(`Personalverantwortung (${responsibility === "yes" ? "Var" : "Yok"})`, grossYearly, respMedian),
      compareRow(`Cinsiyet (${gender === "m" ? "Erkek" : "Kadın"})`, grossYearly, genderMedian)
    ].join("");

    renderCompareSummary(`${summaryTop}${picks}<div style="display:grid;gap:10px;">${rows}</div>`);
  }

  function render(m) {
    document.getElementById("grossEcho").textContent = EUR.format(m.grossMonthly);
    document.getElementById("grossYearEcho").textContent = EUR.format(roundCent(m.grossMonthly * 12));

    document.getElementById("netMonthly").textContent = EUR.format(m.net);
    document.getElementById("netYearly").textContent = EUR.format(roundCent(m.net * 12));

    document.getElementById("deductMonthly").textContent = EUR.format(m.deductions);
    document.getElementById("deductYearly").textContent = EUR.format(roundCent(m.deductions * 12));

    const kvLabel = m.insuranceType === "pkv" ? "PKV (AN)" : "Krankenversicherung (AN)";
    const pvLabel = m.insuranceType === "pkv" ? "PPV (AN)" : "Pflegeversicherung (AN)";

    function buildBreakdown(multiplier) {
      return [
        row("Lohnsteuer", roundCent(m.lohnsteuer * multiplier)),
        m.churchTaxEnabled && m.kirchensteuer > 0 ? row("Kirchensteuer", roundCent(m.kirchensteuer * multiplier)) : "",
        row("Solidaritaetszuschlag", roundCent(m.soli * multiplier)),
        row(kvLabel, roundCent(m.kv * multiplier)),
        row(pvLabel, roundCent(m.pv * multiplier)),
        row("Rentenversicherung (AN)", roundCent(m.rv * multiplier)),
        row("Arbeitslosenversicherung (AN)", roundCent(m.av * multiplier))
      ].filter(Boolean).join("");
    }

    const breakdownMonthly = document.getElementById("breakdownMonthly");
    if (breakdownMonthly) breakdownMonthly.innerHTML = buildBreakdown(1);

    const breakdownYearly = document.getElementById("breakdownYearly");
    if (breakdownYearly) breakdownYearly.innerHTML = buildBreakdown(12);

    console.log("Render edildi:", {
      lohnsteuer: m.lohnsteuer,
      kirchensteuer: m.kirchensteuer,
      churchTaxEnabled: m.churchTaxEnabled,
      deductions: m.deductions,
      net: m.net
    });

    // Girdi özeti kartını güncelle
    const carSummary = m.companyCar && m.companyCar.enabled
      ? `
          <div><b>Dienstwagen:</b> var</div>
          <div><b>Liste Fiyatı:</b> ${EUR.format(m.companyCar.listPrice || 0)}</div>
          <div><b>Vergi Oranı:</b> %${(m.companyCar.rate * 100).toFixed(2)}</div>
          <div><b>Dienstwagen Avantajı (Aylık):</b> ${EUR.format(m.carBenefitMonthly || 0)}</div>
          <div><b>Dienstwagen Avantajı (Yıllık):</b> ${EUR.format(roundCent((m.carBenefitMonthly || 0) * 12))}</div>
          ${m.companyCar.commuteEnabled ? `<div><b>Ev-İş Mesafe:</b> ${m.companyCar.commuteKm} km</div>` : ``}
        `
      : ``;

    const inputSummaryEl = document.getElementById("inputSummary");
    const insuranceSummary = m.insuranceType === "pkv"
      ? `
          <div><b>Sigorta Tipi:</b> PKV</div>
          <div><b>PKV Primi (Aylık):</b> ${EUR.format(m.pkvEmployeePremiumMonthly || 0)}</div>
          <div><b>PPV Primi (Aylık):</b> ${EUR.format(m.ppvEmployeePremiumMonthly || 0)}</div>
        `
      : `
          <div><b>Sigorta Tipi:</b> GKV</div>
          <div><b>KV Kassensatz:</b> %${m.kvBase.toFixed(2)}</div>
          <div><b>KV Zusatz:</b> %${m.kvZusatz.toFixed(2)}</div>
        `;
    if (inputSummaryEl) {
      inputSummaryEl.innerHTML = `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div><b>Aylık Brüt:</b> ${EUR.format(m.grossMonthly)}</div>
          <div><b>Giriş Tipi:</b> ${m.amountType === "net" ? "Net" : "Brüt"}</div>
          <div><b>Giriş Periyodu:</b> ${m.amountPeriod === "yearly" ? "Yıllık" : "Aylık"}</div>
          <div><b>Girilen Tutar:</b> ${EUR.format(m.amountInput || 0)}</div>
          ${carSummary}
          ${insuranceSummary}
          <div><b>Yıl:</b> ${m.year}</div>
          <div><b>Steuerklasse:</b> ${m.taxClass}</div>
          <div><b>Eyalet:</b> ${m.state}</div>
          <div><b>Çocuk:</b> ${m.hasChildren ? "var" : "yok"}</div>
          <div><b>Yaş durumu:</b> ${m.age23Plus ? "23 yaş ve üzeri" : "23 yaş altı"}</div>
          <div><b>Çocuk sayısı:</b> ${m.totalChildrenCount || 0}</div>
          <div><b>25 yaş altı çocuk sayısı:</b> ${m.childrenUnder25Count || 0}</div>
          <div><b>Kilise vergisi:</b> ${m.churchTaxEnabled ? "evet" : "hayır"}</div>
          <div><b>Kinderfreibetrag (ZKF):</b> ${Number(m.childAllowance || 0).toFixed(1)}</div>
        </div>
        <div style="margin-top:8px;font-size:11px;opacity:.7;">Kaynak: BMF PAP 2026</div>
      `;
    }

    const noteEl = document.getElementById("note");
    if (noteEl) {
      noteEl.textContent =
        "Kesinti açıklamalarını yukarıdaki bilgi kartında bulabilirsiniz.";
    }
  }


  function calculate() {
    try {
      console.log("=== Hesaplama basladi ===");
      const { amountInput, amountType, amountPeriod } = getAmountConfig();
      const amountMonthly = roundCent(toMonthly(amountInput, amountPeriod));

      if (!amountMonthly || amountMonthly <= 0) {
        alert("Lütfen geçerli bir tutar girin.");
        return;
      }

      let grossMonthly = 0;
      let targetNetMonthly = 0;

      const year = 2026;
      const taxClass = String(document.getElementById("taxClass").value);
      const state = String(document.getElementById("state").value);
      const hasChildren = Boolean(document.getElementById("hasChildren").checked);
      const age23PlusRaw = document.querySelector('input[name="age23Plus"]:checked')?.value;
      if (age23PlusRaw !== "true" && age23PlusRaw !== "false") {
        alert("Lütfen yaş durumunu seçin.");
        return;
      }
      const age23Plus = age23PlusRaw === "true";
      const childrenInput = normalizeChildrenInput({
        hasChildren,
        totalChildrenRaw: document.getElementById("childrenCount")?.value,
        childrenUnder25Raw: document.getElementById("childrenUnder25Count")?.value
      });
      if (!childrenInput.valid) {
        alert(childrenInput.error);
        return;
      }
      const totalChildrenCount = childrenInput.totalChildrenCount;
      const childrenUnder25Count = childrenInput.childrenUnder25Count;
      const hasChildrenEffective = hasChildren && totalChildrenCount > 0;
      const churchTaxEnabled = Boolean(document.getElementById("churchTax").checked);
      const insuranceType = getRadioValue("insuranceType", "gkv");
      const kvBase = safeNumber(document.getElementById("kvBase").value, 14.6);
      const kvZusatz = safeNumber(document.getElementById("kvZusatz").value, 2.5);
      const pkvEmployeePremiumMonthly = safeNumber(document.getElementById("pkvPremium")?.value, 0);
      const ppvEmployeePremiumMonthly = safeNumber(document.getElementById("ppvPremium")?.value, 0);
      const pkvEmployerSubsidyMonthly = 0;
      const childAllowance = safeNumber(document.getElementById("childAllowance")?.value, 0);
      const pva = childrenUnder25Count;
      const companyCar = getCompanyCarConfig();

      const p = {
        year,
        taxClass,
        state,
        hasChildren: hasChildrenEffective,
        totalChildrenCount,
        childrenUnder25Count,
        age23Plus,
        churchTaxEnabled,
        insuranceType,
        kvBase,
        kvZusatz,
        pkvEmployeePremiumMonthly,
        ppvEmployeePremiumMonthly,
        pkvEmployerSubsidyMonthly,
        childAllowance,
        pva,
        companyCar
      };

      if (amountType === "net") {
        targetNetMonthly = amountMonthly;
        const solved = findGrossForTargetNet(targetNetMonthly, p);
        grossMonthly = solved.grossMonthly;
      } else {
        grossMonthly = amountMonthly;
      }

      console.log("Girdiler:", {
        amountInput,
        amountType,
        amountPeriod,
        grossMonthly,
        year,
        taxClass,
        state,
        hasChildren: hasChildrenEffective,
        totalChildrenCount,
        childrenUnder25Count,
        age23Plus,
        churchTaxEnabled,
        insuranceType,
        kvBase,
        kvZusatz,
        pkvEmployeePremiumMonthly,
        ppvEmployeePremiumMonthly,
        childAllowance,
        companyCar
      });

      const out = netFromGross(grossMonthly, p);
      lastGrossMonthly = grossMonthly;

      console.log("Ara hesaplamalar:", {
        social: out.social,
        lohnsteuer: out.tax.lohnsteuer,
        soli: out.tax.soli,
        kirchensteuer: out.kirchensteuer,
        churchTaxEnabled,
        state
      });

      console.log("Sonuclar:", {
        deductions: out.deductions,
        net: out.net,
        breakdown: {
          kv: out.social.kv,
          pv: out.social.pv,
          rv: out.social.rv,
          av: out.social.av,
          lohnsteuer: out.tax.lohnsteuer,
          soli: out.tax.soli,
          kirchensteuer: out.kirchensteuer,
          total: out.deductions
        }
      });

      render({
        grossMonthly,
        year,
        taxClass,
        state,
        hasChildren: hasChildrenEffective,
        totalChildrenCount,
        childrenUnder25Count,
        age23Plus,
        churchTaxEnabled,
        insuranceType,
        kvBase,
        kvZusatz,
        pkvEmployeePremiumMonthly,
        ppvEmployeePremiumMonthly,
        pkvEmployerSubsidyMonthly,
        childAllowance,
        amountInput,
        amountType,
        amountPeriod,
        companyCar,
        carBenefitMonthly: out.carBenefitMonthly,
        taxableGross: out.taxableGross,
        lohnsteuer: out.tax.lohnsteuer,
        soli: out.tax.soli,
        kirchensteuer: out.kirchensteuer,
        kv: out.social.kv,
        pv: out.social.pv,
        rv: out.social.rv,
        av: out.social.av,
        socialInsurance: out.socialInsurance,
        breakdown: out.breakdown,
        deductions: out.deductions,
        net: out.net
      });

      console.log("=== Hesaplama tamamlandi ===");
    } catch (error) {
      console.error("Hesaplama hatasi:", error);
      alert("Hesaplama sirasinda bir hata olustu: " + (error?.message || String(error)));
    }
  }


  function init() {
    try {
      setBadge();

      document.querySelectorAll('input[name="insuranceType"]')
        .forEach((el) => el.addEventListener("change", syncInsuranceUI));
      syncInsuranceUI();

      const childrenToggle = document.getElementById("hasChildren");
      if (childrenToggle) childrenToggle.addEventListener("change", syncChildrenUI);
      syncChildrenUI();

      const toggleBreakdownMonthly = document.getElementById("toggleBreakdownMonthly");
      const breakdownMonthly = document.getElementById("breakdownMonthly");
      if (toggleBreakdownMonthly && breakdownMonthly) {
        toggleBreakdownMonthly.addEventListener("click", () => {
          const isHidden = breakdownMonthly.classList.contains("hidden");
          breakdownMonthly.classList.toggle("hidden", !isHidden);
          breakdownMonthly.setAttribute("aria-hidden", String(!isHidden));
          toggleBreakdownMonthly.setAttribute("aria-expanded", String(isHidden));
          toggleBreakdownMonthly.textContent = isHidden
            ? "Kesintileri Kapat (Aylık)"
            : "Nedir bu kesintiler? (Aylık)";
        });
      }

      const toggleBreakdownYearly = document.getElementById("toggleBreakdownYearly");
      const breakdownYearly = document.getElementById("breakdownYearly");
      if (toggleBreakdownYearly && breakdownYearly) {
        toggleBreakdownYearly.addEventListener("click", () => {
          const isHidden = breakdownYearly.classList.contains("hidden");
          breakdownYearly.classList.toggle("hidden", !isHidden);
          breakdownYearly.setAttribute("aria-hidden", String(!isHidden));
          toggleBreakdownYearly.setAttribute("aria-expanded", String(isHidden));
          toggleBreakdownYearly.textContent = isHidden
            ? "Kesintileri Kapat (Yıllık)"
            : "Nedir bu kesintiler? (Yıllık)";
        });
      }

      // Populate Stepstone comparison dropdowns
      populateCompareSelects();

      // Dienstwagen UI
      const carToggle = document.getElementById("hasCompanyCar");
      const carCommute = document.getElementById("carCommute");
      if (carToggle) carToggle.addEventListener("change", syncCompanyCarUI);
      if (carCommute) carCommute.addEventListener("change", syncCompanyCarUI);
      document.querySelectorAll('input[name="carCommuteMode"]')
        .forEach((el) => el.addEventListener("change", syncCompanyCarUI));
      syncCompanyCarUI();
      // Mode toggle (Brüt→Net / Net→Brüt)
      
      const btnCalculate = document.getElementById("btnCalculate");
      if (!btnCalculate) {
        console.error("btnCalculate butonu bulunamadı!");
        return;
      }
      btnCalculate.addEventListener("click", function(e) {
        e.preventDefault();
        console.log("Hesapla butonuna tıklandı!");
        calculate();
      });

      const btnCompare = document.getElementById("btnCompare");
      if (btnCompare) {
        btnCompare.addEventListener("click", function (e) {
          e.preventDefault();
          const grossMonthly = Number.isFinite(lastGrossMonthly) && lastGrossMonthly > 0
            ? lastGrossMonthly
            : getGrossMonthlyFromInput();
          buildStepstoneSummary({ grossMonthly });
        });
      }
    } catch (error) {
      console.error("Init hatası:", error);
    }
  }

  // Kullanıcı verileri artık tarayıcıda saklanmıyor

  if (typeof window !== "undefined" && window.__enableCalcTestHooks) {
    window.__calc = {
      computeHealthAndCareContribs,
      normalizeChildrenInput,
      netFromGross,
      roundCent
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM zaten yüklü
    init();
  }
})();
