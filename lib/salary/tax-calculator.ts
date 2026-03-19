// Almanya 2026 Vergi Hesaplama (BMF PAP 2026)

export interface TaxParams {
  grossMonthly: number;
  taxClass: string;
  kvZusatz: number;
  hasChildren: boolean;
  age23Plus: boolean;
  churchTaxEnabled: boolean;
  state: string;
  childAllowance: number;
  childrenUnder25Count: number;
  insuranceType: 'gkv' | 'pkv';
  pkvEmployeePremiumMonthly?: number;
  ppvEmployeePremiumMonthly?: number;
}

export interface TaxResult {
  lohnsteuer: number;
  soli: number;
  kirchensteuerBase: number | null;
  source: 'pap' | 'legacy';
}

// 2026 German Income Tax (Einkommensteuer) - Hardcoded Formula
// Source: BMF Programmablaufplan 2026 / EStG §32a
const TAX_2026 = {
  year: 2026,
  grundfreibetrag: 12096,    // No tax up to this amount
  zone2End: 17443,           // End of first progressive zone
  zone3End: 68480,           // End of second progressive zone
  zone4End: 277825,          // End of 42% zone, above = 45%
  soliFreigrenze: 19488,     // No soli if annual LSt <= this (joint: 38976)
  soliRate: 0.055            // 5.5% of Lohnsteuer above threshold
};

function roundCent(v: number): number {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

function safeNumber(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function clampNonNegative(v: unknown): number {
  return Math.max(0, safeNumber(v, 0));
}

// Calculate annual Einkommensteuer using 2026 formula (§32a EStG)
function calcEinkommensteuer2026(zvE: number): number {
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
function calcVorsorgepauschale(grossYearly: number, kvZusatz: number): number {
  const BBG_RV = 8450 * 12; // 101,400 EUR/year for 2026
  const BBG_KV = 5812.50 * 12; // 69,750 EUR/year for 2026

  // RV contribution (employee share 9.3%)
  const rvBasis = Math.min(grossYearly, BBG_RV);
  const rvBeitrag = rvBasis * 0.093;

  // KV contribution for Vorsorgepauschale (simplified: 12% of basis, capped)
  const kvBasis = Math.min(grossYearly, BBG_KV);
  const kvBeitrag = kvBasis * 0.12;

  return roundCent(rvBeitrag + kvBeitrag);
}

// Calculate monthly Lohnsteuer based on tax class
function calcLohnsteuer(params: { grossMonthly: number; taxClass: string; kvZusatz: number }): number {
  const { grossMonthly, taxClass, kvZusatz } = params;
  const grossYearly = grossMonthly * 12;

  // Estimate zu versteuerndes Einkommen (simplified)
  const werbungskosten = 1230;
  const sonderausgaben = 36;
  const vorsorgepauschale = calcVorsorgepauschale(grossYearly, kvZusatz);

  const zvEStandard = grossYearly - werbungskosten - sonderausgaben - vorsorgepauschale;
  const zvENoAllowance = grossYearly - vorsorgepauschale + TAX_2026.grundfreibetrag;

  let lstYearly = 0;
  switch (taxClass) {
    case '1':
    case '4':
      lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard));
      break;
    case '2':
      // Single parent: additional Entlastungsbetrag (4,260 EUR base)
      lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard - 4260));
      break;
    case '3':
      // Married, higher earner: use Splittingtarif
      lstYearly = 2 * calcEinkommensteuer2026(Math.max(0, zvEStandard / 2));
      break;
    case '5':
    case '6':
      lstYearly = calcEinkommensteuer2026(Math.max(0, zvENoAllowance));
      break;
    default:
      lstYearly = calcEinkommensteuer2026(Math.max(0, zvEStandard));
  }

  return roundCent(lstYearly / 12);
}

// Calculate Solidaritätszuschlag
function calcSoli(lohnsteuerMonthly: number, taxClass: string): number {
  const lstYearly = lohnsteuerMonthly * 12;
  const freigrenze = taxClass === '3' ? TAX_2026.soliFreigrenze * 2 : TAX_2026.soliFreigrenze;

  if (lstYearly <= freigrenze) {
    return 0;
  }

  const soliYearly = lstYearly * TAX_2026.soliRate;
  const maxSoli = (lstYearly - freigrenze) * 0.119;

  return roundCent(Math.min(soliYearly, maxSoli) / 12);
}

// Calculate church tax
export function calcChurchTax(params: { base: number | null; lohnsteuer: number; state: string; enabled: boolean }): number {
  const { base, lohnsteuer, state, enabled } = params;
  if (!enabled) return 0;

  const basis = Number.isFinite(base) && base !== null && base > 0 ? base : lohnsteuer;
  if (!basis || basis <= 0) return 0;

  const rate = state === 'BY' || state === 'BW' ? 0.08 : 0.09;
  return roundCent(basis * rate);
}

// Main tax calculation function (legacy fallback)
export function calcTaxLegacy(params: TaxParams): TaxResult {
  const lohnsteuer = calcLohnsteuer({
    grossMonthly: params.grossMonthly,
    taxClass: params.taxClass,
    kvZusatz: params.kvZusatz
  });
  const soli = calcSoli(lohnsteuer, params.taxClass);

  return {
    lohnsteuer,
    soli,
    kirchensteuerBase: null,
    source: 'legacy'
  };
}

// Main tax calculation function
export function calcTax(params: TaxParams): TaxResult {
  // For now, use legacy calculation (BMF PAP 2026 XML implementation would be similar to lohnsteuer2026.js)
  return calcTaxLegacy(params);
}
