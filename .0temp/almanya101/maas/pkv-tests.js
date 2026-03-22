(function () {
  "use strict";

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message} (expected: ${expected}, actual: ${actual})`);
    }
  }

  function run() {
    const calc = window.__calc;
    assert(calc && typeof calc.computeHealthAndCareContribs === "function", "Test hooks not available");

    const gkvParams = {
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: false,
      totalChildrenCount: 0,
      childrenUnder25Count: 0,
      age23Plus: true,
      state: "NRW",
      pva: 0
    };

    const gkv = calc.computeHealthAndCareContribs(gkvParams);
    const kvRate = (0.146 + 0.025) / 2;
    const pvRate = 0.018 + 0.006;
    const expectedKv = calc.roundCent(4000 * kvRate);
    const expectedPv = calc.roundCent(4000 * pvRate);
    assertEqual(gkv.kv_or_pkv, expectedKv, "GKV KV should be percentage-based");
    assertEqual(gkv.pv_or_ppv, expectedPv, "GKV PV should be percentage-based");

    const gkvHigh = calc.computeHealthAndCareContribs({
      ...gkvParams,
      grossTaxableMonthly: 10000
    });
    const kvCap = calc.roundCent(5812.5 * kvRate);
    assertEqual(gkvHigh.kv_or_pkv, kvCap, "GKV KV should cap at BBG");

    const pkvParams = {
      insuranceType: "pkv",
      grossTaxableMonthly: 4000,
      pkvEmployeePremiumMonthly: 500,
      ppvEmployeePremiumMonthly: 100,
      age23Plus: true,
      state: "NRW"
    };
    const pkv = calc.computeHealthAndCareContribs(pkvParams);
    assertEqual(pkv.kv_or_pkv, 500, "PKV KV should be fixed");
    assertEqual(pkv.pv_or_ppv, 100, "PKV PPV should be fixed");

    const pkvLow = calc.computeHealthAndCareContribs({
      insuranceType: "pkv",
      grossTaxableMonthly: 5000,
      pkvEmployeePremiumMonthly: 500,
      ppvEmployeePremiumMonthly: 100,
      age23Plus: true,
      state: "NRW"
    });
    const pkvHigh = calc.computeHealthAndCareContribs({
      insuranceType: "pkv",
      grossTaxableMonthly: 9000,
      pkvEmployeePremiumMonthly: 500,
      ppvEmployeePremiumMonthly: 100,
      age23Plus: true,
      state: "NRW"
    });
    assertEqual(pkvLow.kv_or_pkv, pkvHigh.kv_or_pkv, "PKV KV should not change with gross");
    assertEqual(pkvLow.pv_or_ppv, pkvHigh.pv_or_ppv, "PKV PPV should not change with gross");

    const rvCap = calc.roundCent(8450 * 0.093);
    const avCap = calc.roundCent(8450 * 0.013);
    assertEqual(pkvHigh.rv, rvCap, "RV should cap at BBG");
    assertEqual(pkvHigh.av, avCap, "AV should cap at BBG");

    const pBase = {
      year: 2026,
      taxClass: "1",
      state: "NRW",
      hasChildren: false,
      totalChildrenCount: 0,
      childrenUnder25Count: 0,
      age23Plus: true,
      churchTaxEnabled: false,
      insuranceType: "pkv",
      kvBase: 14.6,
      kvZusatz: 2.5,
      pkvEmployeePremiumMonthly: 0,
      ppvEmployeePremiumMonthly: 0,
      pkvEmployerSubsidyMonthly: 0,
      childAllowance: 0,
      pva: 0,
      companyCar: { enabled: false }
    };
    const netNoPkv = calc.netFromGross(4000, pBase);
    const netWithPkv = calc.netFromGross(4000, {
      ...pBase,
      pkvEmployeePremiumMonthly: 500,
      ppvEmployeePremiumMonthly: 100
    });
    assert(netWithPkv.net < netNoPkv.net, "Net should drop with PKV premiums");

    const pkvNoLeak = calc.computeHealthAndCareContribs({
      insuranceType: "pkv",
      grossTaxableMonthly: 4000,
      pkvEmployeePremiumMonthly: 0,
      ppvEmployeePremiumMonthly: 123.45,
      hasChildren: false,
      age23Plus: true,
      state: "NRW"
    });
    assertEqual(pkvNoLeak.pv_or_ppv, 123.45, "PKV PPV should ignore childless logic");

    const pvChildless = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: false,
      totalChildrenCount: 0,
      childrenUnder25Count: 0,
      age23Plus: true,
      state: "NRW"
    });
    const pvWithChild = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: true,
      totalChildrenCount: 1,
      childrenUnder25Count: 1,
      age23Plus: true,
      state: "NRW"
    });
    assert(pvChildless.pv_or_ppv > pvWithChild.pv_or_ppv, "PV should be higher when childless at age >= 23");

    const pvChildlessUnder23 = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: false,
      totalChildrenCount: 0,
      childrenUnder25Count: 0,
      age23Plus: false,
      state: "NRW"
    });
    assert(pvChildless.pv_or_ppv > pvChildlessUnder23.pv_or_ppv, "PV should be lower when age23Plus is false");
    assertEqual(pvWithChild.pvBreakdown.childlessSurchargeApplied, false, "Children should disable childless surcharge");

    const pvOneChild = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: true,
      totalChildrenCount: 2,
      childrenUnder25Count: 1,
      age23Plus: true,
      state: "NRW"
    });
    const pvTwoChild = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: true,
      totalChildrenCount: 2,
      childrenUnder25Count: 2,
      age23Plus: true,
      state: "NRW"
    });
    assert(pvTwoChild.pv_or_ppv <= pvOneChild.pv_or_ppv, "PV should not increase from 1 to 2 under-25 children");

    const pvFiveChild = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: true,
      totalChildrenCount: 6,
      childrenUnder25Count: 5,
      age23Plus: true,
      state: "NRW"
    });
    const pvSixChild = calc.computeHealthAndCareContribs({
      insuranceType: "gkv",
      grossTaxableMonthly: 4000,
      kvBase: 14.6,
      kvZusatz: 2.5,
      hasChildren: true,
      totalChildrenCount: 6,
      childrenUnder25Count: 6,
      age23Plus: true,
      state: "NRW"
    });
    assertEqual(pvFiveChild.pv_or_ppv, pvSixChild.pv_or_ppv, "PV reduction should cap at 5 children");

    const pChildBase = {
      year: 2026,
      taxClass: "1",
      state: "NRW",
      hasChildren: true,
      totalChildrenCount: 1,
      childrenUnder25Count: 1,
      age23Plus: true,
      churchTaxEnabled: false,
      insuranceType: "gkv",
      kvBase: 14.6,
      kvZusatz: 2.5,
      pkvEmployeePremiumMonthly: 0,
      ppvEmployeePremiumMonthly: 0,
      pkvEmployerSubsidyMonthly: 0,
      childAllowance: 0,
      pva: 1,
      companyCar: { enabled: false }
    };
    const netAge23 = calc.netFromGross(4000, pChildBase);
    const netUnder23 = calc.netFromGross(4000, { ...pChildBase, age23Plus: false });
    assertEqual(netAge23.net, netUnder23.net, "Net should be unchanged when hasChildren is true");

    const invalidChildren = calc.normalizeChildrenInput({
      hasChildren: true,
      totalChildrenRaw: "",
      childrenUnder25Raw: "1"
    });
    assert(!invalidChildren.valid, "Missing total children should be invalid");
  }

  try {
    run();
    const out = document.getElementById("testOutput");
    if (out) out.textContent = "All PKV tests passed";
  } catch (err) {
    const out = document.getElementById("testOutput");
    if (out) out.textContent = `Test failed: ${err.message}`;
    throw err;
  }
})();
