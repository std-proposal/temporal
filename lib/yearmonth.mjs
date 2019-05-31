
import { DATA } from './shared.mjs';
import { CivilDate } from './date.mjs';

export class CivilYearMonth {
  constructor(year, month) {
    if (!Number.isFinite(year)) throw new Error('invalid argument: year');
    if (!Number.isFinite(month) || (month < 1) || (month > 12)) throw new Error('invalid argument: month');
    this[DATA] = { year, month };
  }
  get  year() {
    return this[DATA].year;
  }
  get month() {
    return this[DATA].month;
  }

  with(dateLike = {}) {
    const { year, month } = Object.assign(Object.assign({}, this), dateLike);
    return new CivilTearMonth(year, month);
  }
  plus(durationLike = {}) {
    const duration = castDuration(durationLike, this);
    const { year, month } = calculate(this, duration, false);
    return new CivilYearMonth(year, month);
  }
  minus(durationLike = {}) {
    const duration = castDuration(durationLike, this);
    const { year, month } = calculate(this, duration, true);
    return new CivilYearMonth(year, month);
  }
  difference(other) {
    const [ one, two ] = [ this, other ].sort(compare);
    
    let months = two.month - one.month;
    let years = two.year - one.year;
    
    while (months < 0) { months += 12; years -= 1; }
    while (months > 12) { months -= 12; years += 1; }

    return castDuration({ years, months }, this);
  }

  withDay(day = 1) {
    return new CivilDate(this.year, this.month, day);
  }
  
  toString() {
    const { year, month } = this;
    return `${signedpad(year, 4)}-${pad(month, 2)}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(isoString) {
    const { year, month } = parseISO(isoString);
    return new CivilYearMonth(year, month);
  }
}
CivilYearMonth.prototype[Symbol.toStringTag] = 'CivilYearMonth';

const ISORE = /^([+-]?\d{4}\d*)-(0[1-9]|1[0-2])$/;
function parseISO(isoStr) {
  const match = ISORE.exec(isoStr);
  if (!match) throw new Error('invalid argument');
  const year = +match[1];
  const month = +match[2];
  return { year, month };
}

function compare(one, two) {
  if (one.year !== two.year) return one.year - two.year;
  if (one.month !== two.month) return one.month - two.month;
  return 0;
}
