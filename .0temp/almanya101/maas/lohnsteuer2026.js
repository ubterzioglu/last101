// Includes big.js (MIT) https://github.com/MikeMcl/big.js
;(function (GLOBAL) {
  'use strict';
  var Big,

    DP = 20,

    RM = 1,

    MAX_DP = 1E6,

    MAX_POWER = 1E6,

    NE = -7,

    PE = 21,

    STRICT = false,

    NAME = '[big.js] ',
    INVALID = NAME + 'Invalid ',
    INVALID_DP = INVALID + 'decimal places',
    INVALID_RM = INVALID + 'rounding mode',
    DIV_BY_ZERO = NAME + 'Division by zero',

    P = {},
    UNDEFINED = void 0,
    NUMERIC = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;

  function _Big_() {

    function Big(n) {
      var x = this;

      if (!(x instanceof Big)) {
        return n === UNDEFINED && arguments.length === 0 ? _Big_() : new Big(n);
      }

      if (n instanceof Big) {
        x.s = n.s;
        x.e = n.e;
        x.c = n.c.slice();
      } else {
        if (typeof n !== 'string') {
          if (Big.strict === true && typeof n !== 'bigint') {
            throw TypeError(INVALID + 'value');
          }

          n = n === 0 && 1 / n < 0 ? '-0' : String(n);
        }

        parse(x, n);
      }

      x.constructor = Big;
    }

    Big.prototype = P;
    Big.DP = DP;
    Big.RM = RM;
    Big.NE = NE;
    Big.PE = PE;
    Big.strict = STRICT;
    Big.roundDown = 0;
    Big.roundHalfUp = 1;
    Big.roundHalfEven = 2;
    Big.roundUp = 3;

    return Big;
  }

  function parse(x, n) {
    var e, i, nl;

    if (!NUMERIC.test(n)) {
      throw Error(INVALID + 'number');
    }

    x.s = n.charAt(0) == '-' ? (n = n.slice(1), -1) : 1;

    if ((e = n.indexOf('.')) > -1) n = n.replace('.', '');

    if ((i = n.search(/e/i)) > 0) {

      if (e < 0) e = i;
      e += +n.slice(i + 1);
      n = n.substring(0, i);
    } else if (e < 0) {

      e = n.length;
    }

    nl = n.length;

    for (i = 0; i < nl && n.charAt(i) == '0';) ++i;

    if (i == nl) {

      x.c = [x.e = 0];
    } else {

      for (; nl > 0 && n.charAt(--nl) == '0';);
      x.e = e - i - 1;
      x.c = [];

      for (e = 0; i <= nl;) x.c[e++] = +n.charAt(i++);
    }

    return x;
  }

  function round(x, sd, rm, more) {
    var xc = x.c;

    if (rm === UNDEFINED) rm = x.constructor.RM;
    if (rm !== 0 && rm !== 1 && rm !== 2 && rm !== 3) {
      throw Error(INVALID_RM);
    }

    if (sd < 1) {
      more =
        rm === 3 && (more || !!xc[0]) || sd === 0 && (
        rm === 1 && xc[0] >= 5 ||
        rm === 2 && (xc[0] > 5 || xc[0] === 5 && (more || xc[1] !== UNDEFINED))
      );

      xc.length = 1;

      if (more) {

        x.e = x.e - sd + 1;
        xc[0] = 1;
      } else {

        xc[0] = x.e = 0;
      }
    } else if (sd < xc.length) {

      more =
        rm === 1 && xc[sd] >= 5 ||
        rm === 2 && (xc[sd] > 5 || xc[sd] === 5 &&
          (more || xc[sd + 1] !== UNDEFINED || xc[sd - 1] & 1)) ||
        rm === 3 && (more || !!xc[0]);

      xc.length = sd;

      if (more) {

        for (; ++xc[--sd] > 9;) {
          xc[sd] = 0;
          if (sd === 0) {
            ++x.e;
            xc.unshift(1);
            break;
          }
        }
      }

      for (sd = xc.length; !xc[--sd];) xc.pop();
    }

    return x;
  }

  function stringify(x, doExponential, isNonzero) {
    var e = x.e,
      s = x.c.join(''),
      n = s.length;

    if (doExponential) {
      s = s.charAt(0) + (n > 1 ? '.' + s.slice(1) : '') + (e < 0 ? 'e' : 'e+') + e;

    } else if (e < 0) {
      for (; ++e;) s = '0' + s;
      s = '0.' + s;
    } else if (e > 0) {
      if (++e > n) {
        for (e -= n; e--;) s += '0';
      } else if (e < n) {
        s = s.slice(0, e) + '.' + s.slice(e);
      }
    } else if (n > 1) {
      s = s.charAt(0) + '.' + s.slice(1);
    }

    return x.s < 0 && isNonzero ? '-' + s : s;
  }

  P.abs = function () {
    var x = new this.constructor(this);
    x.s = 1;
    return x;
  };

  P.cmp = function (y) {
    var isneg,
      x = this,
      xc = x.c,
      yc = (y = new x.constructor(y)).c,
      i = x.s,
      j = y.s,
      k = x.e,
      l = y.e;

    if (!xc[0] || !yc[0]) return !xc[0] ? !yc[0] ? 0 : -j : i;

    if (i != j) return i;

    isneg = i < 0;

    if (k != l) return k > l ^ isneg ? 1 : -1;

    j = (k = xc.length) < (l = yc.length) ? k : l;

    for (i = -1; ++i < j;) {
      if (xc[i] != yc[i]) return xc[i] > yc[i] ^ isneg ? 1 : -1;
    }

    return k == l ? 0 : k > l ^ isneg ? 1 : -1;
  };

  P.div = function (y) {
    var x = this,
      Big = x.constructor,
      a = x.c,
      b = (y = new Big(y)).c,
      k = x.s == y.s ? 1 : -1,
      dp = Big.DP;

    if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }

    if (!b[0]) {
      throw Error(DIV_BY_ZERO);
    }

    if (!a[0]) {
      y.s = k;
      y.c = [y.e = 0];
      return y;
    }

    var bl, bt, n, cmp, ri,
      bz = b.slice(),
      ai = bl = b.length,
      al = a.length,
      r = a.slice(0, bl),
      rl = r.length,
      q = y,
      qc = q.c = [],
      qi = 0,
      p = dp + (q.e = x.e - y.e) + 1;

    q.s = k;
    k = p < 0 ? 0 : p;

    bz.unshift(0);

    for (; rl++ < bl;) r.push(0);

    do {

      for (n = 0; n < 10; n++) {

        if (bl != (rl = r.length)) {
          cmp = bl > rl ? 1 : -1;
        } else {
          for (ri = -1, cmp = 0; ++ri < bl;) {
            if (b[ri] != r[ri]) {
              cmp = b[ri] > r[ri] ? 1 : -1;
              break;
            }
          }
        }

        if (cmp < 0) {

          for (bt = rl == bl ? b : bz; rl;) {
            if (r[--rl] < bt[rl]) {
              ri = rl;
              for (; ri && !r[--ri];) r[ri] = 9;
              --r[ri];
              r[rl] += 10;
            }
            r[rl] -= bt[rl];
          }

          for (; !r[0];) r.shift();
        } else {
          break;
        }
      }

      qc[qi++] = cmp ? n : ++n;

      if (r[0] && cmp) r[rl] = a[ai] || 0;
      else r = [a[ai]];

    } while ((ai++ < al || r[0] !== UNDEFINED) && k--);

    if (!qc[0] && qi != 1) {

      qc.shift();
      q.e--;
      p--;
    }

    if (qi > p) round(q, p, Big.RM, r[0] !== UNDEFINED);

    return q;
  };

  P.eq = function (y) {
    return this.cmp(y) === 0;
  };

  P.gt = function (y) {
    return this.cmp(y) > 0;
  };

  P.gte = function (y) {
    return this.cmp(y) > -1;
  };

  P.lt = function (y) {
    return this.cmp(y) < 0;
  };

  P.lte = function (y) {
    return this.cmp(y) < 1;
  };

  P.minus = P.sub = function (y) {
    var i, j, t, xlty,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (a != b) {
      y.s = -b;
      return x.plus(y);
    }

    var xc = x.c.slice(),
      xe = x.e,
      yc = y.c,
      ye = y.e;

    if (!xc[0] || !yc[0]) {
      if (yc[0]) {
        y.s = -b;
      } else if (xc[0]) {
        y = new Big(x);
      } else {
        y.s = 1;
      }
      return y;
    }

    if (a = xe - ye) {

      if (xlty = a < 0) {
        a = -a;
        t = xc;
      } else {
        ye = xe;
        t = yc;
      }

      t.reverse();
      for (b = a; b--;) t.push(0);
      t.reverse();
    } else {

      j = ((xlty = xc.length < yc.length) ? xc : yc).length;

      for (a = b = 0; b < j; b++) {
        if (xc[b] != yc[b]) {
          xlty = xc[b] < yc[b];
          break;
        }
      }
    }

    if (xlty) {
      t = xc;
      xc = yc;
      yc = t;
      y.s = -y.s;
    }

    if ((b = (j = yc.length) - (i = xc.length)) > 0) for (; b--;) xc[i++] = 0;

    for (b = i; j > a;) {
      if (xc[--j] < yc[j]) {
        for (i = j; i && !xc[--i];) xc[i] = 9;
        --xc[i];
        xc[j] += 10;
      }

      xc[j] -= yc[j];
    }

    for (; xc[--b] === 0;) xc.pop();

    for (; xc[0] === 0;) {
      xc.shift();
      --ye;
    }

    if (!xc[0]) {

      y.s = 1;

      xc = [ye = 0];
    }

    y.c = xc;
    y.e = ye;

    return y;
  };

  P.mod = function (y) {
    var ygtx,
      x = this,
      Big = x.constructor,
      a = x.s,
      b = (y = new Big(y)).s;

    if (!y.c[0]) {
      throw Error(DIV_BY_ZERO);
    }

    x.s = y.s = 1;
    ygtx = y.cmp(x) == 1;
    x.s = a;
    y.s = b;

    if (ygtx) return new Big(x);

    a = Big.DP;
    b = Big.RM;
    Big.DP = Big.RM = 0;
    x = x.div(y);
    Big.DP = a;
    Big.RM = b;

    return this.minus(x.times(y));
  };

  P.neg = function () {
    var x = new this.constructor(this);
    x.s = -x.s;
    return x;
  };

  P.plus = P.add = function (y) {
    var e, k, t,
      x = this,
      Big = x.constructor;

    y = new Big(y);

    if (x.s != y.s) {
      y.s = -y.s;
      return x.minus(y);
    }

    var xe = x.e,
      xc = x.c,
      ye = y.e,
      yc = y.c;

    if (!xc[0] || !yc[0]) {
      if (!yc[0]) {
        if (xc[0]) {
          y = new Big(x);
        } else {
          y.s = x.s;
        }
      }
      return y;
    }

    xc = xc.slice();

    if (e = xe - ye) {
      if (e > 0) {
        ye = xe;
        t = yc;
      } else {
        e = -e;
        t = xc;
      }

      t.reverse();
      for (; e--;) t.push(0);
      t.reverse();
    }

    if (xc.length - yc.length < 0) {
      t = yc;
      yc = xc;
      xc = t;
    }

    e = yc.length;

    for (k = 0; e; xc[e] %= 10) k = (xc[--e] = xc[e] + yc[e] + k) / 10 | 0;

    if (k) {
      xc.unshift(k);
      ++ye;
    }

    for (e = xc.length; xc[--e] === 0;) xc.pop();

    y.c = xc;
    y.e = ye;

    return y;
  };

  P.pow = function (n) {
    var x = this,
      one = new x.constructor('1'),
      y = one,
      isneg = n < 0;

    if (n !== ~~n || n < -MAX_POWER || n > MAX_POWER) {
      throw Error(INVALID + 'exponent');
    }

    if (isneg) n = -n;

    for (;;) {
      if (n & 1) y = y.times(x);
      n >>= 1;
      if (!n) break;
      x = x.times(x);
    }

    return isneg ? one.div(y) : y;
  };

  P.prec = function (sd, rm) {
    if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
      throw Error(INVALID + 'precision');
    }
    return round(new this.constructor(this), sd, rm);
  };

  P.round = function (dp, rm) {
    if (dp === UNDEFINED) dp = 0;
    else if (dp !== ~~dp || dp < -MAX_DP || dp > MAX_DP) {
      throw Error(INVALID_DP);
    }
    return round(new this.constructor(this), dp + this.e + 1, rm);
  };

  P.sqrt = function () {
    var r, c, t,
      x = this,
      Big = x.constructor,
      s = x.s,
      e = x.e,
      half = new Big('0.5');

    if (!x.c[0]) return new Big(x);

    if (s < 0) {
      throw Error(NAME + 'No square root');
    }

    s = Math.sqrt(+stringify(x, true, true));

    if (s === 0 || s === 1 / 0) {
      c = x.c.join('');
      if (!(c.length + e & 1)) c += '0';
      s = Math.sqrt(c);
      e = ((e + 1) / 2 | 0) - (e < 0 || e & 1);
      r = new Big((s == 1 / 0 ? '5e' : (s = s.toExponential()).slice(0, s.indexOf('e') + 1)) + e);
    } else {
      r = new Big(s + '');
    }

    e = r.e + (Big.DP += 4);

    do {
      t = r;
      r = half.times(t.plus(x.div(t)));
    } while (t.c.slice(0, e).join('') !== r.c.slice(0, e).join(''));

    return round(r, (Big.DP -= 4) + r.e + 1, Big.RM);
  };

  P.times = P.mul = function (y) {
    var c,
      x = this,
      Big = x.constructor,
      xc = x.c,
      yc = (y = new Big(y)).c,
      a = xc.length,
      b = yc.length,
      i = x.e,
      j = y.e;

    y.s = x.s == y.s ? 1 : -1;

    if (!xc[0] || !yc[0]) {
      y.c = [y.e = 0];
      return y;
    }

    y.e = i + j;

    if (a < b) {
      c = xc;
      xc = yc;
      yc = c;
      j = a;
      a = b;
      b = j;
    }

    for (c = new Array(j = a + b); j--;) c[j] = 0;

    for (i = b; i--;) {
      b = 0;

      for (j = a + i; j > i;) {

        b = c[j] + yc[i] * xc[j - i - 1] + b;
        c[j--] = b % 10;

        b = b / 10 | 0;
      }

      c[j] = b;
    }

    if (b) ++y.e;
    else c.shift();

    for (i = c.length; !c[--i];) c.pop();
    y.c = c;

    return y;
  };

  P.toExponential = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), ++dp, rm);
      for (; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, true, !!n);
  };

  P.toFixed = function (dp, rm) {
    var x = this,
      n = x.c[0];

    if (dp !== UNDEFINED) {
      if (dp !== ~~dp || dp < 0 || dp > MAX_DP) {
        throw Error(INVALID_DP);
      }
      x = round(new x.constructor(x), dp + x.e + 1, rm);

      for (dp = dp + x.e + 1; x.c.length < dp;) x.c.push(0);
    }

    return stringify(x, false, !!n);
  };

  P.toJSON = P.toString = function () {
    var x = this,
      Big = x.constructor;
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, !!x.c[0]);
  };

  P.toNumber = function () {
    var n = +stringify(this, true, true);
    if (this.constructor.strict === true && !this.eq(n.toString())) {
      throw Error(NAME + 'Imprecise conversion');
    }
    return n;
  };

  P.toPrecision = function (sd, rm) {
    var x = this,
      Big = x.constructor,
      n = x.c[0];

    if (sd !== UNDEFINED) {
      if (sd !== ~~sd || sd < 1 || sd > MAX_DP) {
        throw Error(INVALID + 'precision');
      }
      x = round(new Big(x), sd, rm);
      for (; x.c.length < sd;) x.c.push(0);
    }

    return stringify(x, sd <= x.e || x.e <= Big.NE || x.e >= Big.PE, !!n);
  };

  P.valueOf = function () {
    var x = this,
      Big = x.constructor;
    if (Big.strict === true) {
      throw Error(NAME + 'valueOf disallowed');
    }
    return stringify(x, x.e <= Big.NE || x.e >= Big.PE, true);
  };

  Big = _Big_();

  Big['default'] = Big.Big = Big;

  if (typeof define === 'function' && define.amd) {
    define(function () { return Big; });

  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = Big;

  } else {
    GLOBAL.Big = Big;
  }
})(this);

(function (global) {
  "use strict";
  var BigDecimal = function (value) {
    if (value instanceof BigDecimal) {
      this.value = value.value;
    } else {
      this.value = new global.Big(value);
    }
  };

  BigDecimal.ROUND_DOWN = 0;
  BigDecimal.ROUND_UP = 3;

  BigDecimal.ZERO = function () { return new BigDecimal(0); };
  BigDecimal.ONE = function () { return new BigDecimal(1); };
  BigDecimal.TEN = function () { return new BigDecimal(10); };
  BigDecimal.valueOf = function (value) { return new BigDecimal(value); };

  BigDecimal._toBig = function (value) {
    if (value instanceof BigDecimal) return value.value;
    return new global.Big(value);
  };

  BigDecimal.prototype.add = function (other) {
    return new BigDecimal(this.value.plus(BigDecimal._toBig(other)));
  };

  BigDecimal.prototype.subtract = function (other) {
    return new BigDecimal(this.value.minus(BigDecimal._toBig(other)));
  };

  BigDecimal.prototype.multiply = function (other) {
    return new BigDecimal(this.value.times(BigDecimal._toBig(other)));
  };

  BigDecimal.prototype.divide = function (other, scale, rounding) {
    var result = this.value.div(BigDecimal._toBig(other));
    if (scale !== undefined && rounding !== undefined) {
      result = result.round(scale, rounding);
    }
    return new BigDecimal(result);
  };

  BigDecimal.prototype.setScale = function (scale, rounding) {
    return new BigDecimal(this.value.round(scale, rounding));
  };

  BigDecimal.prototype.compareTo = function (other) {
    return this.value.cmp(BigDecimal._toBig(other));
  };

  BigDecimal.prototype.longValue = function () {
    return Number(this.value.round(0, BigDecimal.ROUND_DOWN).toString());
  };

  BigDecimal.prototype.toNumber = function () {
    return Number(this.value.toString());
  };

  BigDecimal.prototype.toString = function () {
    return this.value.toString();
  };

  global.BigDecimal = BigDecimal;
})(typeof window !== "undefined" ? window : globalThis);

function Lohnsteuer2026(params) {

    this.af = 1;
    if (params["af"] !== undefined) {
        this.setAf(params["af"]);
    }

    this.AJAHR = 0;
    if (params["AJAHR"] !== undefined) {
        this.setAjahr(params["AJAHR"]);
    }

    this.ALTER1 = 0;
    if (params["ALTER1"] !== undefined) {
        this.setAlter1(params["ALTER1"]);
    }

    this.ALV = 0;
    if (params["ALV"] !== undefined) {
        this.setAlv(params["ALV"]);
    }

    this.f = 1.0;
    if (params["f"] !== undefined) {
        this.setF(params["f"]);
    }

    this.JFREIB = BigDecimal.ZERO();
    if (params["JFREIB"] !== undefined) {
        this.setJfreib(params["JFREIB"]);
    }

    this.JHINZU = BigDecimal.ZERO();
    if (params["JHINZU"] !== undefined) {
        this.setJhinzu(params["JHINZU"]);
    }

    this.JRE4 = BigDecimal.ZERO();
    if (params["JRE4"] !== undefined) {
        this.setJre4(params["JRE4"]);
    }

    this.JRE4ENT = BigDecimal.ZERO();
    if (params["JRE4ENT"] !== undefined) {
        this.setJre4ent(params["JRE4ENT"]);
    }

    this.JVBEZ = BigDecimal.ZERO();
    if (params["JVBEZ"] !== undefined) {
        this.setJvbez(params["JVBEZ"]);
    }

    this.KRV = 0;
    if (params["KRV"] !== undefined) {
        this.setKrv(params["KRV"]);
    }

    this.KVZ = BigDecimal.ZERO();
    if (params["KVZ"] !== undefined) {
        this.setKvz(params["KVZ"]);
    }

    this.LZZ = 1;
    if (params["LZZ"] !== undefined) {
        this.setLzz(params["LZZ"]);
    }

    this.LZZFREIB = BigDecimal.ZERO();
    if (params["LZZFREIB"] !== undefined) {
        this.setLzzfreib(params["LZZFREIB"]);
    }

    this.LZZHINZU = BigDecimal.ZERO();
    if (params["LZZHINZU"] !== undefined) {
        this.setLzzhinzu(params["LZZHINZU"]);
    }

    this.MBV = BigDecimal.ZERO();
    if (params["MBV"] !== undefined) {
        this.setMbv(params["MBV"]);
    }

    this.PKPV = BigDecimal.ZERO();
    if (params["PKPV"] !== undefined) {
        this.setPkpv(params["PKPV"]);
    }

    this.PKPVAGZ = BigDecimal.ZERO();
    if (params["PKPVAGZ"] !== undefined) {
        this.setPkpvagz(params["PKPVAGZ"]);
    }

    this.PKV = 0;
    if (params["PKV"] !== undefined) {
        this.setPkv(params["PKV"]);
    }

    this.PVA = BigDecimal.ZERO();
    if (params["PVA"] !== undefined) {
        this.setPva(params["PVA"]);
    }

    this.PVS = 0;
    if (params["PVS"] !== undefined) {
        this.setPvs(params["PVS"]);
    }

    this.PVZ = 0;
    if (params["PVZ"] !== undefined) {
        this.setPvz(params["PVZ"]);
    }

    this.R = 0;
    if (params["R"] !== undefined) {
        this.setR(params["R"]);
    }

    this.RE4 = BigDecimal.ZERO();
    if (params["RE4"] !== undefined) {
        this.setRe4(params["RE4"]);
    }

    this.SONSTB = BigDecimal.ZERO();
    if (params["SONSTB"] !== undefined) {
        this.setSonstb(params["SONSTB"]);
    }

    this.SONSTENT = BigDecimal.ZERO();
    if (params["SONSTENT"] !== undefined) {
        this.setSonstent(params["SONSTENT"]);
    }

    this.STERBE = BigDecimal.ZERO();
    if (params["STERBE"] !== undefined) {
        this.setSterbe(params["STERBE"]);
    }

    this.STKL = 1;
    if (params["STKL"] !== undefined) {
        this.setStkl(params["STKL"]);
    }

    this.VBEZ = BigDecimal.ZERO();
    if (params["VBEZ"] !== undefined) {
        this.setVbez(params["VBEZ"]);
    }

    this.VBEZM = BigDecimal.ZERO();
    if (params["VBEZM"] !== undefined) {
        this.setVbezm(params["VBEZM"]);
    }

    this.VBEZS = BigDecimal.ZERO();
    if (params["VBEZS"] !== undefined) {
        this.setVbezs(params["VBEZS"]);
    }

    this.VBS = BigDecimal.ZERO();
    if (params["VBS"] !== undefined) {
        this.setVbs(params["VBS"]);
    }

    this.VJAHR = 0;
    if (params["VJAHR"] !== undefined) {
        this.setVjahr(params["VJAHR"]);
    }

    this.ZKF = BigDecimal.ZERO();
    if (params["ZKF"] !== undefined) {
        this.setZkf(params["ZKF"]);
    }

    this.ZMVB = 0;
    if (params["ZMVB"] !== undefined) {
        this.setZmvb(params["ZMVB"]);
    }

    this.BK = BigDecimal.ZERO();

    this.BKS = BigDecimal.ZERO();

    this.LSTLZZ = BigDecimal.ZERO();

    this.SOLZLZZ = BigDecimal.ZERO();

    this.SOLZS = BigDecimal.ZERO();

    this.STS = BigDecimal.ZERO();

    this.VFRB = BigDecimal.ZERO();

    this.VFRBS1 = BigDecimal.ZERO();

    this.VFRBS2 = BigDecimal.ZERO();

    this.WVFRB = BigDecimal.ZERO();

    this.WVFRBO = BigDecimal.ZERO();

    this.WVFRBM = BigDecimal.ZERO();

    this.ALTE = BigDecimal.ZERO();

    this.ANP = BigDecimal.ZERO();

    this.ANTEIL1 = BigDecimal.ZERO();

    this.AVSATZAN = BigDecimal.ZERO();

    this.BBGKVPV = BigDecimal.ZERO();

    this.BBGRVALV = BigDecimal.ZERO();

    this.BMG = BigDecimal.ZERO();

    this.DIFF = BigDecimal.ZERO();

    this.EFA = BigDecimal.ZERO();

    this.FVB = BigDecimal.ZERO();

    this.FVBSO = BigDecimal.ZERO();

    this.FVBZ = BigDecimal.ZERO();

    this.FVBZSO = BigDecimal.ZERO();

    this.GFB = BigDecimal.ZERO();

    this.HBALTE = BigDecimal.ZERO();

    this.HFVB = BigDecimal.ZERO();

    this.HFVBZ = BigDecimal.ZERO();

    this.HFVBZSO = BigDecimal.ZERO();

    this.HOCH = BigDecimal.ZERO();

    this.J = 0;

    this.JBMG = BigDecimal.ZERO();

    this.JLFREIB = BigDecimal.ZERO();

    this.JLHINZU = BigDecimal.ZERO();

    this.JW = BigDecimal.ZERO();

    this.K = 0;

    this.KFB = BigDecimal.ZERO();

    this.KVSATZAN = BigDecimal.ZERO();

    this.KZTAB = 0;

    this.LSTJAHR = BigDecimal.ZERO();

    this.LSTOSO = BigDecimal.ZERO();
    this.LSTSO = BigDecimal.ZERO();

    this.MIST = BigDecimal.ZERO();

    this.PKPVAGZJ = BigDecimal.ZERO();

    this.PVSATZAN = BigDecimal.ZERO();

    this.RVSATZAN = BigDecimal.ZERO();

    this.RW = BigDecimal.ZERO();

    this.SAP = BigDecimal.ZERO();

    this.SOLZFREI = BigDecimal.ZERO();

    this.SOLZJ = BigDecimal.ZERO();

    this.SOLZMIN = BigDecimal.ZERO();

    this.SOLZSBMG = BigDecimal.ZERO();

    this.SOLZSZVE = BigDecimal.ZERO();

    this.ST = BigDecimal.ZERO();

    this.ST1 = BigDecimal.ZERO();

    this.ST2 = BigDecimal.ZERO();

    this.VBEZB = BigDecimal.ZERO();

    this.VBEZBSO = BigDecimal.ZERO();

    this.VERGL = BigDecimal.ZERO();

    this.VSPHB = BigDecimal.ZERO();

    this.VSP = BigDecimal.ZERO();

    this.VSPN = BigDecimal.ZERO();

    this.VSPALV = BigDecimal.ZERO();

    this.VSPKVPV = BigDecimal.ZERO();

    this.VSPR = BigDecimal.ZERO();

    this.W1STKL5 = BigDecimal.ZERO();

    this.W2STKL5 = BigDecimal.ZERO();

    this.W3STKL5 = BigDecimal.ZERO();

    this.X = BigDecimal.ZERO();

    this.Y = BigDecimal.ZERO();

    this.ZRE4 = BigDecimal.ZERO();

    this.ZRE4J = BigDecimal.ZERO();

    this.ZRE4VP = BigDecimal.ZERO();

    this.ZRE4VPR = BigDecimal.ZERO();

    this.ZTABFB = BigDecimal.ZERO();

    this.ZVBEZ = BigDecimal.ZERO();

    this.ZVBEZJ = BigDecimal.ZERO();

    this.ZVE = BigDecimal.ZERO();

    this.ZX = BigDecimal.ZERO();

    this.ZZX = BigDecimal.ZERO();
}

Object.defineProperty(Lohnsteuer2026, 'TAB1', {value: [BigDecimal.ZERO(), BigDecimal.valueOf(0.4), BigDecimal.valueOf(0.384), BigDecimal.valueOf(0.368), BigDecimal.valueOf(0.352), BigDecimal.valueOf(0.336), BigDecimal.valueOf(0.32), BigDecimal.valueOf(0.304), BigDecimal.valueOf(0.288), BigDecimal.valueOf(0.272), BigDecimal.valueOf(0.256), BigDecimal.valueOf(0.24), BigDecimal.valueOf(0.224), BigDecimal.valueOf(0.208), BigDecimal.valueOf(0.192), BigDecimal.valueOf(0.176), BigDecimal.valueOf(0.16), BigDecimal.valueOf(0.152), BigDecimal.valueOf(0.144), BigDecimal.valueOf(0.14), BigDecimal.valueOf(0.136), BigDecimal.valueOf(0.132), BigDecimal.valueOf(0.128), BigDecimal.valueOf(0.124), BigDecimal.valueOf(0.12), BigDecimal.valueOf(0.116), BigDecimal.valueOf(0.112), BigDecimal.valueOf(0.108), BigDecimal.valueOf(0.104), BigDecimal.valueOf(0.1), BigDecimal.valueOf(0.096), BigDecimal.valueOf(0.092), BigDecimal.valueOf(0.088), BigDecimal.valueOf(0.084), BigDecimal.valueOf(0.08), BigDecimal.valueOf(0.076), BigDecimal.valueOf(0.072), BigDecimal.valueOf(0.068), BigDecimal.valueOf(0.064), BigDecimal.valueOf(0.06), BigDecimal.valueOf(0.056), BigDecimal.valueOf(0.052), BigDecimal.valueOf(0.048), BigDecimal.valueOf(0.044), BigDecimal.valueOf(0.04), BigDecimal.valueOf(0.036), BigDecimal.valueOf(0.032), BigDecimal.valueOf(0.028), BigDecimal.valueOf(0.024), BigDecimal.valueOf(0.02), BigDecimal.valueOf(0.016), BigDecimal.valueOf(0.012), BigDecimal.valueOf(0.008), BigDecimal.valueOf(0.004), BigDecimal.valueOf(0)]});

Object.defineProperty(Lohnsteuer2026, 'TAB2', {value: [BigDecimal.ZERO(), BigDecimal.valueOf(3000), BigDecimal.valueOf(2880), BigDecimal.valueOf(2760), BigDecimal.valueOf(2640), BigDecimal.valueOf(2520), BigDecimal.valueOf(2400), BigDecimal.valueOf(2280), BigDecimal.valueOf(2160), BigDecimal.valueOf(2040), BigDecimal.valueOf(1920), BigDecimal.valueOf(1800), BigDecimal.valueOf(1680), BigDecimal.valueOf(1560), BigDecimal.valueOf(1440), BigDecimal.valueOf(1320), BigDecimal.valueOf(1200), BigDecimal.valueOf(1140), BigDecimal.valueOf(1080), BigDecimal.valueOf(1050), BigDecimal.valueOf(1020), BigDecimal.valueOf(990), BigDecimal.valueOf(960), BigDecimal.valueOf(930), BigDecimal.valueOf(900), BigDecimal.valueOf(870), BigDecimal.valueOf(840), BigDecimal.valueOf(810), BigDecimal.valueOf(780), BigDecimal.valueOf(750), BigDecimal.valueOf(720), BigDecimal.valueOf(690), BigDecimal.valueOf(660), BigDecimal.valueOf(630), BigDecimal.valueOf(600), BigDecimal.valueOf(570), BigDecimal.valueOf(540), BigDecimal.valueOf(510), BigDecimal.valueOf(480), BigDecimal.valueOf(450), BigDecimal.valueOf(420), BigDecimal.valueOf(390), BigDecimal.valueOf(360), BigDecimal.valueOf(330), BigDecimal.valueOf(300), BigDecimal.valueOf(270), BigDecimal.valueOf(240), BigDecimal.valueOf(210), BigDecimal.valueOf(180), BigDecimal.valueOf(150), BigDecimal.valueOf(120), BigDecimal.valueOf(90), BigDecimal.valueOf(60), BigDecimal.valueOf(30), BigDecimal.valueOf(0)]});

Object.defineProperty(Lohnsteuer2026, 'TAB3', {value: [BigDecimal.ZERO(), BigDecimal.valueOf(900), BigDecimal.valueOf(864), BigDecimal.valueOf(828), BigDecimal.valueOf(792), BigDecimal.valueOf(756), BigDecimal.valueOf(720), BigDecimal.valueOf(684), BigDecimal.valueOf(648), BigDecimal.valueOf(612), BigDecimal.valueOf(576), BigDecimal.valueOf(540), BigDecimal.valueOf(504), BigDecimal.valueOf(468), BigDecimal.valueOf(432), BigDecimal.valueOf(396), BigDecimal.valueOf(360), BigDecimal.valueOf(342), BigDecimal.valueOf(324), BigDecimal.valueOf(315), BigDecimal.valueOf(306), BigDecimal.valueOf(297), BigDecimal.valueOf(288), BigDecimal.valueOf(279), BigDecimal.valueOf(270), BigDecimal.valueOf(261), BigDecimal.valueOf(252), BigDecimal.valueOf(243), BigDecimal.valueOf(234), BigDecimal.valueOf(225), BigDecimal.valueOf(216), BigDecimal.valueOf(207), BigDecimal.valueOf(198), BigDecimal.valueOf(189), BigDecimal.valueOf(180), BigDecimal.valueOf(171), BigDecimal.valueOf(162), BigDecimal.valueOf(153), BigDecimal.valueOf(144), BigDecimal.valueOf(135), BigDecimal.valueOf(126), BigDecimal.valueOf(117), BigDecimal.valueOf(108), BigDecimal.valueOf(99), BigDecimal.valueOf(90), BigDecimal.valueOf(81), BigDecimal.valueOf(72), BigDecimal.valueOf(63), BigDecimal.valueOf(54), BigDecimal.valueOf(45), BigDecimal.valueOf(36), BigDecimal.valueOf(27), BigDecimal.valueOf(18), BigDecimal.valueOf(9), BigDecimal.valueOf(0)]});

Object.defineProperty(Lohnsteuer2026, 'TAB4', {value: [BigDecimal.ZERO(), BigDecimal.valueOf(0.4), BigDecimal.valueOf(0.384), BigDecimal.valueOf(0.368), BigDecimal.valueOf(0.352), BigDecimal.valueOf(0.336), BigDecimal.valueOf(0.32), BigDecimal.valueOf(0.304), BigDecimal.valueOf(0.288), BigDecimal.valueOf(0.272), BigDecimal.valueOf(0.256), BigDecimal.valueOf(0.24), BigDecimal.valueOf(0.224), BigDecimal.valueOf(0.208), BigDecimal.valueOf(0.192), BigDecimal.valueOf(0.176), BigDecimal.valueOf(0.16), BigDecimal.valueOf(0.152), BigDecimal.valueOf(0.144), BigDecimal.valueOf(0.14), BigDecimal.valueOf(0.136), BigDecimal.valueOf(0.132), BigDecimal.valueOf(0.128), BigDecimal.valueOf(0.124), BigDecimal.valueOf(0.12), BigDecimal.valueOf(0.116), BigDecimal.valueOf(0.112), BigDecimal.valueOf(0.108), BigDecimal.valueOf(0.104), BigDecimal.valueOf(0.1), BigDecimal.valueOf(0.096), BigDecimal.valueOf(0.092), BigDecimal.valueOf(0.088), BigDecimal.valueOf(0.084), BigDecimal.valueOf(0.08), BigDecimal.valueOf(0.076), BigDecimal.valueOf(0.072), BigDecimal.valueOf(0.068), BigDecimal.valueOf(0.064), BigDecimal.valueOf(0.06), BigDecimal.valueOf(0.056), BigDecimal.valueOf(0.052), BigDecimal.valueOf(0.048), BigDecimal.valueOf(0.044), BigDecimal.valueOf(0.04), BigDecimal.valueOf(0.036), BigDecimal.valueOf(0.032), BigDecimal.valueOf(0.028), BigDecimal.valueOf(0.024), BigDecimal.valueOf(0.02), BigDecimal.valueOf(0.016), BigDecimal.valueOf(0.012), BigDecimal.valueOf(0.008), BigDecimal.valueOf(0.004), BigDecimal.valueOf(0)]});

Object.defineProperty(Lohnsteuer2026, 'TAB5', {value: [BigDecimal.ZERO(), BigDecimal.valueOf(1900), BigDecimal.valueOf(1824), BigDecimal.valueOf(1748), BigDecimal.valueOf(1672), BigDecimal.valueOf(1596), BigDecimal.valueOf(1520), BigDecimal.valueOf(1444), BigDecimal.valueOf(1368), BigDecimal.valueOf(1292), BigDecimal.valueOf(1216), BigDecimal.valueOf(1140), BigDecimal.valueOf(1064), BigDecimal.valueOf(988), BigDecimal.valueOf(912), BigDecimal.valueOf(836), BigDecimal.valueOf(760), BigDecimal.valueOf(722), BigDecimal.valueOf(684), BigDecimal.valueOf(665), BigDecimal.valueOf(646), BigDecimal.valueOf(627), BigDecimal.valueOf(608), BigDecimal.valueOf(589), BigDecimal.valueOf(570), BigDecimal.valueOf(551), BigDecimal.valueOf(532), BigDecimal.valueOf(513), BigDecimal.valueOf(494), BigDecimal.valueOf(475), BigDecimal.valueOf(456), BigDecimal.valueOf(437), BigDecimal.valueOf(418), BigDecimal.valueOf(399), BigDecimal.valueOf(380), BigDecimal.valueOf(361), BigDecimal.valueOf(342), BigDecimal.valueOf(323), BigDecimal.valueOf(304), BigDecimal.valueOf(285), BigDecimal.valueOf(266), BigDecimal.valueOf(247), BigDecimal.valueOf(228), BigDecimal.valueOf(209), BigDecimal.valueOf(190), BigDecimal.valueOf(171), BigDecimal.valueOf(152), BigDecimal.valueOf(133), BigDecimal.valueOf(114), BigDecimal.valueOf(95), BigDecimal.valueOf(76), BigDecimal.valueOf(57), BigDecimal.valueOf(38), BigDecimal.valueOf(19), BigDecimal.valueOf(0)]});

Object.defineProperty(Lohnsteuer2026, 'ZAHL1', {value: BigDecimal.ONE()});
Object.defineProperty(Lohnsteuer2026, 'ZAHL2', {value: BigDecimal.valueOf(2)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL5', {value: BigDecimal.valueOf(5)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL7', {value: BigDecimal.valueOf(7)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL12', {value: BigDecimal.valueOf(12)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL100', {value: BigDecimal.valueOf(100)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL360', {value: BigDecimal.valueOf(360)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL500', {value: BigDecimal.valueOf(500)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL700', {value: BigDecimal.valueOf(700)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL1000', {value: BigDecimal.valueOf(1000)});
Object.defineProperty(Lohnsteuer2026, 'ZAHL10000', {value: BigDecimal.valueOf(10000)});

Lohnsteuer2026.prototype.setAf = function(value) {
    this.af = value;
}

Lohnsteuer2026.prototype.setAjahr = function(value) {
    this.AJAHR = value;
}

Lohnsteuer2026.prototype.setAlter1 = function(value) {
    this.ALTER1 = value;
}

Lohnsteuer2026.prototype.setAlv = function(value) {
    this.ALV = value;
}

Lohnsteuer2026.prototype.setF = function(value) {
    this.f = value;
}

Lohnsteuer2026.prototype.setJfreib = function(value) {
    this.JFREIB = value;
}

Lohnsteuer2026.prototype.setJhinzu = function(value) {
    this.JHINZU = value;
}

Lohnsteuer2026.prototype.setJre4 = function(value) {
    this.JRE4 = value;
}

Lohnsteuer2026.prototype.setJre4ent = function(value) {
    this.JRE4ENT = value;
}

Lohnsteuer2026.prototype.setJvbez = function(value) {
    this.JVBEZ = value;
}

Lohnsteuer2026.prototype.setKrv = function(value) {
    this.KRV = value;
}

Lohnsteuer2026.prototype.setKvz = function(value) {
    this.KVZ = value;
}

Lohnsteuer2026.prototype.setLzz = function(value) {
    this.LZZ = value;
}

Lohnsteuer2026.prototype.setLzzfreib = function(value) {
    this.LZZFREIB = value;
}

Lohnsteuer2026.prototype.setLzzhinzu = function(value) {
    this.LZZHINZU = value;
}

Lohnsteuer2026.prototype.setMbv = function(value) {
    this.MBV = value;
}

Lohnsteuer2026.prototype.setPkpv = function(value) {
    this.PKPV = value;
}

Lohnsteuer2026.prototype.setPkpvagz = function(value) {
    this.PKPVAGZ = value;
}

Lohnsteuer2026.prototype.setPkv = function(value) {
    this.PKV = value;
}

Lohnsteuer2026.prototype.setPva = function(value) {
    this.PVA = value;
}

Lohnsteuer2026.prototype.setPvs = function(value) {
    this.PVS = value;
}

Lohnsteuer2026.prototype.setPvz = function(value) {
    this.PVZ = value;
}

Lohnsteuer2026.prototype.setR = function(value) {
    this.R = value;
}

Lohnsteuer2026.prototype.setRe4 = function(value) {
    this.RE4 = value;
}

Lohnsteuer2026.prototype.setSonstb = function(value) {
    this.SONSTB = value;
}

Lohnsteuer2026.prototype.setSonstent = function(value) {
    this.SONSTENT = value;
}

Lohnsteuer2026.prototype.setSterbe = function(value) {
    this.STERBE = value;
}

Lohnsteuer2026.prototype.setStkl = function(value) {
    this.STKL = value;
}

Lohnsteuer2026.prototype.setVbez = function(value) {
    this.VBEZ = value;
}

Lohnsteuer2026.prototype.setVbezm = function(value) {
    this.VBEZM = value;
}

Lohnsteuer2026.prototype.setVbezs = function(value) {
    this.VBEZS = value;
}

Lohnsteuer2026.prototype.setVbs = function(value) {
    this.VBS = value;
}

Lohnsteuer2026.prototype.setVjahr = function(value) {
    this.VJAHR = value;
}

Lohnsteuer2026.prototype.setZkf = function(value) {
    this.ZKF = value;
}

Lohnsteuer2026.prototype.setZmvb = function(value) {
    this.ZMVB = value;
}

Lohnsteuer2026.prototype.getBk = function() {
    return this.BK;
}

Lohnsteuer2026.prototype.getBks = function() {
    return this.BKS;
}

Lohnsteuer2026.prototype.getLstlzz = function() {
    return this.LSTLZZ;
}

Lohnsteuer2026.prototype.getSolzlzz = function() {
    return this.SOLZLZZ;
}

Lohnsteuer2026.prototype.getSolzs = function() {
    return this.SOLZS;
}

Lohnsteuer2026.prototype.getSts = function() {
    return this.STS;
}

Lohnsteuer2026.prototype.getVfrb = function() {
    return this.VFRB;
}

Lohnsteuer2026.prototype.getVfrbs1 = function() {
    return this.VFRBS1;
}

Lohnsteuer2026.prototype.getVfrbs2 = function() {
    return this.VFRBS2;
}

Lohnsteuer2026.prototype.getWvfrb = function() {
    return this.WVFRB;
}

Lohnsteuer2026.prototype.getWvfrbo = function() {
    return this.WVFRBO;
}

Lohnsteuer2026.prototype.getWvfrbm = function() {
    return this.WVFRBM;
}

Lohnsteuer2026.prototype.MAIN = function() {
    this.MPARA();
    this.MRE4JL();
    this.VBEZBSO = BigDecimal.ZERO();
    this.MRE4();
    this.MRE4ABZ();
    this.MBERECH();
    this.MSONST();
}

Lohnsteuer2026.prototype.MPARA = function() {
    this.BBGRVALV = BigDecimal.valueOf(101400);
    this.AVSATZAN = BigDecimal.valueOf(0.013);
    this.RVSATZAN = BigDecimal.valueOf(0.093);
    this.BBGKVPV = BigDecimal.valueOf(69750);
    this.KVSATZAN = this.KVZ.divide(Lohnsteuer2026.ZAHL2).divide(Lohnsteuer2026.ZAHL100).add(BigDecimal.valueOf(0.07));
    if (this.PVS == 1) {
        this.PVSATZAN = BigDecimal.valueOf(0.023);
    } else {
        this.PVSATZAN = BigDecimal.valueOf(0.018);
    }
    if (this.PVZ == 1) {
        this.PVSATZAN = this.PVSATZAN.add(BigDecimal.valueOf(0.006));
    } else {
        this.PVSATZAN = this.PVSATZAN.subtract(this.PVA.multiply(BigDecimal.valueOf(0.0025)));
    }
    this.W1STKL5 = BigDecimal.valueOf(14071);
    this.W2STKL5 = BigDecimal.valueOf(34939);
    this.W3STKL5 = BigDecimal.valueOf(222260);
    this.GFB = BigDecimal.valueOf(12348);
    this.SOLZFREI = BigDecimal.valueOf(20350);
}

Lohnsteuer2026.prototype.MRE4JL = function() {
    if (this.LZZ == 1) {
        this.ZRE4J = this.RE4.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.ZVBEZJ = this.VBEZ.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.JLFREIB = this.LZZFREIB.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        this.JLHINZU = this.LZZHINZU.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    } else {
        if (this.LZZ == 2) {
            this.ZRE4J = this.RE4.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
            this.ZVBEZJ = this.VBEZ.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
            this.JLFREIB = this.LZZFREIB.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
            this.JLHINZU = this.LZZHINZU.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
        } else {
            if (this.LZZ == 3) {
                this.ZRE4J = this.RE4.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL700, 2, BigDecimal.ROUND_DOWN);
                this.ZVBEZJ = this.VBEZ.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL700, 2, BigDecimal.ROUND_DOWN);
                this.JLFREIB = this.LZZFREIB.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL700, 2, BigDecimal.ROUND_DOWN);
                this.JLHINZU = this.LZZHINZU.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL700, 2, BigDecimal.ROUND_DOWN);
            } else {
                this.ZRE4J = this.RE4.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
                this.ZVBEZJ = this.VBEZ.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
                this.JLFREIB = this.LZZFREIB.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
                this.JLHINZU = this.LZZHINZU.multiply(Lohnsteuer2026.ZAHL360).divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
            }
        }
    }
    if (this.af == 0) {
        this.f = 1;
    }
}

Lohnsteuer2026.prototype.MRE4 = function() {
    if (this.ZVBEZJ.compareTo(BigDecimal.ZERO()) == 0) {
        this.FVBZ = BigDecimal.ZERO();
        this.FVB = BigDecimal.ZERO();
        this.FVBZSO = BigDecimal.ZERO();
        this.FVBSO = BigDecimal.ZERO();
    } else {
        if (this.VJAHR < 2006) {
            this.J = 1;
        } else {
            if (this.VJAHR < 2058) {
                this.J = this.VJAHR - 2004;
            } else {
                this.J = 54;
            }
        }
        if (this.LZZ == 1) {
            this.VBEZB = this.VBEZM.multiply(BigDecimal.valueOf(this.ZMVB)).add(this.VBEZS);
            this.HFVB = Lohnsteuer2026.TAB2[this.J].divide(Lohnsteuer2026.ZAHL12).multiply(BigDecimal.valueOf(this.ZMVB)).setScale(0, BigDecimal.ROUND_UP);
            this.FVBZ = Lohnsteuer2026.TAB3[this.J].divide(Lohnsteuer2026.ZAHL12).multiply(BigDecimal.valueOf(this.ZMVB)).setScale(0, BigDecimal.ROUND_UP);
        } else {
            this.VBEZB = this.VBEZM.multiply(Lohnsteuer2026.ZAHL12).add(this.VBEZS).setScale(2, BigDecimal.ROUND_DOWN);
            this.HFVB = Lohnsteuer2026.TAB2[this.J];
            this.FVBZ = Lohnsteuer2026.TAB3[this.J];
        }
        this.FVB = this.VBEZB.multiply(Lohnsteuer2026.TAB1[this.J]).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_UP);
        if (this.FVB.compareTo(this.HFVB) == 1) {
            this.FVB = this.HFVB;
        }
        if (this.FVB.compareTo(this.ZVBEZJ) == 1) {
            this.FVB = this.ZVBEZJ;
        }
        this.FVBSO = this.FVB.add(this.VBEZBSO.multiply(Lohnsteuer2026.TAB1[this.J]).divide(Lohnsteuer2026.ZAHL100)).setScale(2, BigDecimal.ROUND_UP);
        if (this.FVBSO.compareTo(Lohnsteuer2026.TAB2[this.J]) == 1) {
            this.FVBSO = Lohnsteuer2026.TAB2[this.J];
        }
        this.HFVBZSO = this.VBEZB.add(this.VBEZBSO).divide(Lohnsteuer2026.ZAHL100).subtract(this.FVBSO).setScale(2, BigDecimal.ROUND_DOWN);
        this.FVBZSO = this.FVBZ.add(this.VBEZBSO.divide(Lohnsteuer2026.ZAHL100)).setScale(0, BigDecimal.ROUND_UP);
        if (this.FVBZSO.compareTo(this.HFVBZSO) == 1) {
            this.FVBZSO = this.HFVBZSO.setScale(0, BigDecimal.ROUND_UP);
        }
        if (this.FVBZSO.compareTo(Lohnsteuer2026.TAB3[this.J]) == 1) {
            this.FVBZSO = Lohnsteuer2026.TAB3[this.J];
        }
        this.HFVBZ = this.VBEZB.divide(Lohnsteuer2026.ZAHL100).subtract(this.FVB).setScale(2, BigDecimal.ROUND_DOWN);
        if (this.FVBZ.compareTo(this.HFVBZ) == 1) {
            this.FVBZ = this.HFVBZ.setScale(0, BigDecimal.ROUND_UP);
        }
    }
    this.MRE4ALTE();
}

Lohnsteuer2026.prototype.MRE4ALTE = function() {
    if (this.ALTER1 == 0) {
        this.ALTE = BigDecimal.ZERO();
    } else {
        if (this.AJAHR < 2006) {
            this.K = 1;
        } else {
            if (this.AJAHR < 2058) {
                this.K = this.AJAHR - 2004;
            } else {
                this.K = 54;
            }
        }
        this.BMG = this.ZRE4J.subtract(this.ZVBEZJ);
        this.ALTE = this.BMG.multiply(Lohnsteuer2026.TAB4[this.K]).setScale(0, BigDecimal.ROUND_UP);
        this.HBALTE = Lohnsteuer2026.TAB5[this.K];
        if (this.ALTE.compareTo(this.HBALTE) == 1) {
            this.ALTE = this.HBALTE;
        }
    }
}

Lohnsteuer2026.prototype.MRE4ABZ = function() {
    this.ZRE4 = this.ZRE4J.subtract(this.FVB).subtract(this.ALTE).subtract(this.JLFREIB).add(this.JLHINZU).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.ZRE4.compareTo(BigDecimal.ZERO()) == -1) {
        this.ZRE4 = BigDecimal.ZERO();
    }
    this.ZRE4VP = this.ZRE4J;
    this.ZVBEZ = this.ZVBEZJ.subtract(this.FVB).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.ZVBEZ.compareTo(BigDecimal.ZERO()) == -1) {
        this.ZVBEZ = BigDecimal.ZERO();
    }
}

Lohnsteuer2026.prototype.MBERECH = function() {
    this.MZTABFB();
    this.VFRB = this.ANP.add(this.FVB.add(this.FVBZ)).multiply(Lohnsteuer2026.ZAHL100).setScale(0, BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRB = this.ZVE.subtract(this.GFB).multiply(Lohnsteuer2026.ZAHL100).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.WVFRB.compareTo(BigDecimal.ZERO()) == -1) {
        this.WVFRB = BigDecimal.ZERO();
    }
    this.LSTJAHR = this.ST.multiply(BigDecimal.valueOf(this.f)).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPLSTLZZ();
    if (this.ZKF.compareTo(BigDecimal.ZERO()) == 1) {
        this.ZTABFB = this.ZTABFB.add(this.KFB);
        this.MRE4ABZ();
        this.MLSTJAHR();
        this.JBMG = this.ST.multiply(BigDecimal.valueOf(this.f)).setScale(0, BigDecimal.ROUND_DOWN);
    } else {
        this.JBMG = this.LSTJAHR;
    }
    this.MSOLZ();
}

Lohnsteuer2026.prototype.MZTABFB = function() {
    this.ANP = BigDecimal.ZERO();
    if (this.ZVBEZ.compareTo(BigDecimal.ZERO()) >= 0 && this.ZVBEZ.compareTo(this.FVBZ) == -1) {
        this.FVBZ = BigDecimal.valueOf(this.ZVBEZ.longValue());
    }
    if (this.STKL < 6) {
        if (this.ZVBEZ.compareTo(BigDecimal.ZERO()) == 1) {
            if (this.ZVBEZ.subtract(this.FVBZ).compareTo(BigDecimal.valueOf(102)) == -1) {
                this.ANP = this.ZVBEZ.subtract(this.FVBZ).setScale(0, BigDecimal.ROUND_UP);
            } else {
                this.ANP = BigDecimal.valueOf(102);
            }
        }
    } else {
        this.FVBZ = BigDecimal.ZERO();
        this.FVBZSO = BigDecimal.ZERO();
    }
    if (this.STKL < 6) {
        if (this.ZRE4.compareTo(this.ZVBEZ) == 1) {
            if (this.ZRE4.subtract(this.ZVBEZ).compareTo(BigDecimal.valueOf(1230)) == -1) {
                this.ANP = this.ANP.add(this.ZRE4).subtract(this.ZVBEZ).setScale(0, BigDecimal.ROUND_UP);
            } else {
                this.ANP = this.ANP.add(BigDecimal.valueOf(1230));
            }
        }
    }
    this.KZTAB = 1;
    if (this.STKL == 1) {
        this.SAP = BigDecimal.valueOf(36);
        this.KFB = this.ZKF.multiply(BigDecimal.valueOf(9756)).setScale(0, BigDecimal.ROUND_DOWN);
    } else {
        if (this.STKL == 2) {
            this.EFA = BigDecimal.valueOf(4260);
            this.SAP = BigDecimal.valueOf(36);
            this.KFB = this.ZKF.multiply(BigDecimal.valueOf(9756)).setScale(0, BigDecimal.ROUND_DOWN);
        } else {
            if (this.STKL == 3) {
                this.KZTAB = 2;
                this.SAP = BigDecimal.valueOf(36);
                this.KFB = this.ZKF.multiply(BigDecimal.valueOf(9756)).setScale(0, BigDecimal.ROUND_DOWN);
            } else {
                if (this.STKL == 4) {
                    this.SAP = BigDecimal.valueOf(36);
                    this.KFB = this.ZKF.multiply(BigDecimal.valueOf(4878)).setScale(0, BigDecimal.ROUND_DOWN);
                } else {
                    if (this.STKL == 5) {
                        this.SAP = BigDecimal.valueOf(36);
                        this.KFB = BigDecimal.ZERO();
                    } else {
                        this.KFB = BigDecimal.ZERO();
                    }
                }
            }
        }
    }
    this.ZTABFB = this.EFA.add(this.ANP).add(this.SAP).add(this.FVBZ).setScale(2, BigDecimal.ROUND_DOWN);
}

Lohnsteuer2026.prototype.MLSTJAHR = function() {
    this.UPEVP();
    this.ZVE = this.ZRE4.subtract(this.ZTABFB).subtract(this.VSP);
    this.UPMLST();
}

Lohnsteuer2026.prototype.UPLSTLZZ = function() {
    this.JW = this.LSTJAHR.multiply(Lohnsteuer2026.ZAHL100);
    this.UPANTEIL();
    this.LSTLZZ = this.ANTEIL1;
}

Lohnsteuer2026.prototype.UPMLST = function() {
    if (this.ZVE.compareTo(Lohnsteuer2026.ZAHL1) == -1) {
        this.ZVE = BigDecimal.ZERO();
        this.X = BigDecimal.ZERO();
    } else {
        this.X = this.ZVE.divide(BigDecimal.valueOf(this.KZTAB)).setScale(0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
        this.UPTAB26();
    } else {
        this.MST5_6();
    }
}

Lohnsteuer2026.prototype.UPEVP = function() {
    if (this.KRV == 1) {
        this.VSPR = BigDecimal.ZERO();
    } else {
        if (this.ZRE4VP.compareTo(this.BBGRVALV) == 1) {
            this.ZRE4VPR = this.BBGRVALV;
        } else {
            this.ZRE4VPR = this.ZRE4VP;
        }
        this.VSPR = this.ZRE4VPR.multiply(this.RVSATZAN).setScale(2, BigDecimal.ROUND_DOWN);
    }
    this.MVSPKVPV();
    if (this.ALV == 1) {
    } else {
        if (this.STKL == 6) {
        } else {
            this.MVSPHB();
        }
    }
}

Lohnsteuer2026.prototype.MVSPKVPV = function() {
    if (this.ZRE4VP.compareTo(this.BBGKVPV) == 1) {
        this.ZRE4VPR = this.BBGKVPV;
    } else {
        this.ZRE4VPR = this.ZRE4VP;
    }
    if (this.PKV > 0) {
        if (this.STKL == 6) {
            this.VSPKVPV = BigDecimal.ZERO();
        } else {
            this.PKPVAGZJ = this.PKPVAGZ.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
            this.VSPKVPV = this.PKPV.multiply(Lohnsteuer2026.ZAHL12).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
            this.VSPKVPV = this.VSPKVPV.subtract(this.PKPVAGZJ);
            if (this.VSPKVPV.compareTo(BigDecimal.ZERO()) == -1) {
                this.VSPKVPV = BigDecimal.ZERO();
            }
        }
    } else {
        this.VSPKVPV = this.ZRE4VPR.multiply(this.KVSATZAN.add(this.PVSATZAN)).setScale(2, BigDecimal.ROUND_DOWN);
    }
    this.VSP = this.VSPKVPV.add(this.VSPR).setScale(0, BigDecimal.ROUND_UP);
}

Lohnsteuer2026.prototype.MVSPHB = function() {
    if (this.ZRE4VP.compareTo(this.BBGRVALV) == 1) {
        this.ZRE4VPR = this.BBGRVALV;
    } else {
        this.ZRE4VPR = this.ZRE4VP;
    }
    this.VSPALV = this.AVSATZAN.multiply(this.ZRE4VPR).setScale(2, BigDecimal.ROUND_DOWN);
    this.VSPHB = this.VSPALV.add(this.VSPKVPV).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.VSPHB.compareTo(BigDecimal.valueOf(1900)) == 1) {
        this.VSPHB = BigDecimal.valueOf(1900);
    }
    this.VSPN = this.VSPR.add(this.VSPHB).setScale(0, BigDecimal.ROUND_UP);
    if (this.VSPN.compareTo(this.VSP) == 1) {
        this.VSP = this.VSPN;
    }
}

Lohnsteuer2026.prototype.MST5_6 = function() {
    this.ZZX = this.X;
    if (this.ZZX.compareTo(this.W2STKL5) == 1) {
        this.ZX = this.W2STKL5;
        this.UP5_6();
        if (this.ZZX.compareTo(this.W3STKL5) == 1) {
            this.ST = this.ST.add(this.W3STKL5.subtract(this.W2STKL5).multiply(BigDecimal.valueOf(0.42))).setScale(0, BigDecimal.ROUND_DOWN);
            this.ST = this.ST.add(this.ZZX.subtract(this.W3STKL5).multiply(BigDecimal.valueOf(0.45))).setScale(0, BigDecimal.ROUND_DOWN);
        } else {
            this.ST = this.ST.add(this.ZZX.subtract(this.W2STKL5).multiply(BigDecimal.valueOf(0.42))).setScale(0, BigDecimal.ROUND_DOWN);
        }
    } else {
        this.ZX = this.ZZX;
        this.UP5_6();
        if (this.ZZX.compareTo(this.W1STKL5) == 1) {
            this.VERGL = this.ST;
            this.ZX = this.W1STKL5;
            this.UP5_6();
            this.HOCH = this.ST.add(this.ZZX.subtract(this.W1STKL5).multiply(BigDecimal.valueOf(0.42))).setScale(0, BigDecimal.ROUND_DOWN);
            if (this.HOCH.compareTo(this.VERGL) == -1) {
                this.ST = this.HOCH;
            } else {
                this.ST = this.VERGL;
            }
        }
    }
}

Lohnsteuer2026.prototype.UP5_6 = function() {
    this.X = this.ZX.multiply(BigDecimal.valueOf(1.25)).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST1 = this.ST;
    this.X = this.ZX.multiply(BigDecimal.valueOf(0.75)).setScale(0, BigDecimal.ROUND_DOWN);
    this.UPTAB26();
    this.ST2 = this.ST;
    this.DIFF = this.ST1.subtract(this.ST2).multiply(Lohnsteuer2026.ZAHL2);
    this.MIST = this.ZX.multiply(BigDecimal.valueOf(0.14)).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.MIST.compareTo(this.DIFF) == 1) {
        this.ST = this.MIST;
    } else {
        this.ST = this.DIFF;
    }
}

Lohnsteuer2026.prototype.MSOLZ = function() {
    this.SOLZFREI = this.SOLZFREI.multiply(BigDecimal.valueOf(this.KZTAB));
    if (this.JBMG.compareTo(this.SOLZFREI) == 1) {
        this.SOLZJ = this.JBMG.multiply(BigDecimal.valueOf(5.5)).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.SOLZMIN = this.JBMG.subtract(this.SOLZFREI).multiply(BigDecimal.valueOf(11.9)).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        if (this.SOLZMIN.compareTo(this.SOLZJ) == -1) {
            this.SOLZJ = this.SOLZMIN;
        }
        this.JW = this.SOLZJ.multiply(Lohnsteuer2026.ZAHL100).setScale(0, BigDecimal.ROUND_DOWN);
        this.UPANTEIL();
        this.SOLZLZZ = this.ANTEIL1;
    } else {
        this.SOLZLZZ = BigDecimal.ZERO();
    }
    if (this.R > 0) {
        this.JW = this.JBMG.multiply(Lohnsteuer2026.ZAHL100);
        this.UPANTEIL();
        this.BK = this.ANTEIL1;
    } else {
        this.BK = BigDecimal.ZERO();
    }
}

Lohnsteuer2026.prototype.UPANTEIL = function() {
    if (this.LZZ == 1) {
        this.ANTEIL1 = this.JW;
    } else {
        if (this.LZZ == 2) {
            this.ANTEIL1 = this.JW.divide(Lohnsteuer2026.ZAHL12, 0, BigDecimal.ROUND_DOWN);
        } else {
            if (this.LZZ == 3) {
                this.ANTEIL1 = this.JW.multiply(Lohnsteuer2026.ZAHL7).divide(Lohnsteuer2026.ZAHL360, 0, BigDecimal.ROUND_DOWN);
            } else {
                this.ANTEIL1 = this.JW.divide(Lohnsteuer2026.ZAHL360, 0, BigDecimal.ROUND_DOWN);
            }
        }
    }
}

Lohnsteuer2026.prototype.MSONST = function() {
    this.LZZ = 1;
    if (this.ZMVB == 0) {
        this.ZMVB = 12;
    }
    if (this.SONSTB.compareTo(BigDecimal.ZERO()) == 0 && this.MBV.compareTo(BigDecimal.ZERO()) == 0) {
        this.LSTSO = BigDecimal.ZERO();
        this.STS = BigDecimal.ZERO();
        this.SOLZS = BigDecimal.ZERO();
        this.BKS = BigDecimal.ZERO();
    } else {
        this.MOSONST();
        this.ZRE4J = this.JRE4.add(this.SONSTB).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.ZVBEZJ = this.JVBEZ.add(this.VBS).divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        this.VBEZBSO = this.STERBE;
        this.MRE4SONST();
        this.MLSTJAHR();
        this.WVFRBM = this.ZVE.subtract(this.GFB).multiply(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
        if (this.WVFRBM.compareTo(BigDecimal.ZERO()) == -1) {
            this.WVFRBM = BigDecimal.ZERO();
        }
        this.LSTSO = this.ST.multiply(Lohnsteuer2026.ZAHL100);
        this.STS = this.LSTSO.subtract(this.LSTOSO).multiply(BigDecimal.valueOf(this.f)).divide(Lohnsteuer2026.ZAHL100, 0, BigDecimal.ROUND_DOWN).multiply(Lohnsteuer2026.ZAHL100);
        this.STSMIN();
    }
}

Lohnsteuer2026.prototype.STSMIN = function() {
    if (this.STS.compareTo(BigDecimal.ZERO()) == -1) {
        if (this.MBV.compareTo(BigDecimal.ZERO()) == 0) {
        } else {
            this.LSTLZZ = this.LSTLZZ.add(this.STS);
            if (this.LSTLZZ.compareTo(BigDecimal.ZERO()) == -1) {
                this.LSTLZZ = BigDecimal.ZERO();
            }
            this.SOLZLZZ = this.SOLZLZZ.add(this.STS.multiply(BigDecimal.valueOf(5.5).divide(Lohnsteuer2026.ZAHL100))).setScale(0, BigDecimal.ROUND_DOWN);
            if (this.SOLZLZZ.compareTo(BigDecimal.ZERO()) == -1) {
                this.SOLZLZZ = BigDecimal.ZERO();
            }
            this.BK = this.BK.add(this.STS);
            if (this.BK.compareTo(BigDecimal.ZERO()) == -1) {
                this.BK = BigDecimal.ZERO();
            }
        }
        this.STS = BigDecimal.ZERO();
        this.SOLZS = BigDecimal.ZERO();
    } else {
        this.MSOLZSTS();
    }
    if (this.R > 0) {
        this.BKS = this.STS;
    } else {
        this.BKS = BigDecimal.ZERO();
    }
}

Lohnsteuer2026.prototype.MSOLZSTS = function() {
    if (this.ZKF.compareTo(BigDecimal.ZERO()) == 1) {
        this.SOLZSZVE = this.ZVE.subtract(this.KFB);
    } else {
        this.SOLZSZVE = this.ZVE;
    }
    if (this.SOLZSZVE.compareTo(BigDecimal.ONE()) == -1) {
        this.SOLZSZVE = BigDecimal.ZERO();
        this.X = BigDecimal.ZERO();
    } else {
        this.X = this.SOLZSZVE.divide(BigDecimal.valueOf(this.KZTAB), 0, BigDecimal.ROUND_DOWN);
    }
    if (this.STKL < 5) {
        this.UPTAB26();
    } else {
        this.MST5_6();
    }
    this.SOLZSBMG = this.ST.multiply(BigDecimal.valueOf(this.f)).setScale(0, BigDecimal.ROUND_DOWN);
    if (this.SOLZSBMG.compareTo(this.SOLZFREI) == 1) {
        this.SOLZS = this.STS.multiply(BigDecimal.valueOf(5.5)).divide(Lohnsteuer2026.ZAHL100, 0, BigDecimal.ROUND_DOWN);
    } else {
        this.SOLZS = BigDecimal.ZERO();
    }
}

Lohnsteuer2026.prototype.MOSONST = function() {
    this.ZRE4J = this.JRE4.divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
    this.ZVBEZJ = this.JVBEZ.divide(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
    this.JLFREIB = this.JFREIB.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.JLHINZU = this.JHINZU.divide(Lohnsteuer2026.ZAHL100, 2, BigDecimal.ROUND_DOWN);
    this.MRE4();
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.subtract(this.JRE4ENT.divide(Lohnsteuer2026.ZAHL100));
    this.MZTABFB();
    this.VFRBS1 = this.ANP.add(this.FVB.add(this.FVBZ)).multiply(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
    this.MLSTJAHR();
    this.WVFRBO = this.ZVE.subtract(this.GFB).multiply(Lohnsteuer2026.ZAHL100).setScale(2, BigDecimal.ROUND_DOWN);
    if (this.WVFRBO.compareTo(BigDecimal.ZERO()) == -1) {
        this.WVFRBO = BigDecimal.ZERO();
    }
    this.LSTOSO = this.ST.multiply(Lohnsteuer2026.ZAHL100);
}

Lohnsteuer2026.prototype.MRE4SONST = function() {
    this.MRE4();
    this.FVB = this.FVBSO;
    this.MRE4ABZ();
    this.ZRE4VP = this.ZRE4VP.add(this.MBV.divide(Lohnsteuer2026.ZAHL100)).subtract(this.JRE4ENT.divide(Lohnsteuer2026.ZAHL100)).subtract(this.SONSTENT.divide(Lohnsteuer2026.ZAHL100));
    this.FVBZ = this.FVBZSO;
    this.MZTABFB();
    this.VFRBS2 = this.ANP.add(this.FVB).add(this.FVBZ).multiply(Lohnsteuer2026.ZAHL100).subtract(this.VFRBS1);
}

Lohnsteuer2026.prototype.UPTAB26 = function() {
    if (this.X.compareTo(this.GFB.add(Lohnsteuer2026.ZAHL1)) == -1) {
        this.ST = BigDecimal.ZERO();
    } else {
        if (this.X.compareTo(BigDecimal.valueOf(17800)) == -1) {
            this.Y = this.X.subtract(this.GFB).divide(Lohnsteuer2026.ZAHL10000, 6, BigDecimal.ROUND_DOWN);
            this.RW = this.Y.multiply(BigDecimal.valueOf(914.51));
            this.RW = this.RW.add(BigDecimal.valueOf(1400));
            this.ST = this.RW.multiply(this.Y).setScale(0, BigDecimal.ROUND_DOWN);
        } else {
            if (this.X.compareTo(BigDecimal.valueOf(69879)) == -1) {
                this.Y = this.X.subtract(BigDecimal.valueOf(17799)).divide(Lohnsteuer2026.ZAHL10000, 6, BigDecimal.ROUND_DOWN);
                this.RW = this.Y.multiply(BigDecimal.valueOf(173.1));
                this.RW = this.RW.add(BigDecimal.valueOf(2397));
                this.RW = this.RW.multiply(this.Y);
                this.ST = this.RW.add(BigDecimal.valueOf(1034.87)).setScale(0, BigDecimal.ROUND_DOWN);
            } else {
                if (this.X.compareTo(BigDecimal.valueOf(277826)) == -1) {
                    this.ST = this.X.multiply(BigDecimal.valueOf(0.42)).subtract(BigDecimal.valueOf(11135.63)).setScale(0, BigDecimal.ROUND_DOWN);
                } else {
                    this.ST = this.X.multiply(BigDecimal.valueOf(0.45)).subtract(BigDecimal.valueOf(19470.38)).setScale(0, BigDecimal.ROUND_DOWN);
                }
            }
        }
    }
    this.ST = this.ST.multiply(BigDecimal.valueOf(this.KZTAB));
}


if (typeof window !== "undefined") { window.Lohnsteuer2026 = Lohnsteuer2026; }
