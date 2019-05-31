
import { DATA } from './shared.mjs';
import { CivilDate } from './date.mjs';

export class CivilMonthDay {
  constructor(month, day) {
    if (!Number.isFinite(month) || (month < 1) || (month > 12)) throw new Error('invalid argument: month');
    if (!Number.isFinite(day) || (day < 1) || (month > daysInMonth(undefined, month))) throw new Error('invalid argument: day');
    this[DATA] = { month, day };
  }
  get month() {
    return this[DATA].month;
  }
  get day() {
    return this[DATA].day;
  }

  with(dateLike = {}) {
    const { month, day } = Object.assign(Object.assign({}, this), dateLike);
    return new CivilMonthDay(month, day);
  }
  plus(durationLike = {}) {
    const duration = castDuration(durationLike, this);
    const { month, day } = calculate(this, duration, false);
    return new CivilMonthDay(month, day);
  }
  minus(durationLike = {}) {
    const duration = castDuration(durationLike, this);
    const { month, day } = calculate(this, duration, true);
    return new CivilMonthDay(month, day);
  }
  difference(other) {
    const [ one, two ] = [ this, other ].sort(compare);
    let days = two.day - one.day;
    let months = two.month - one.month;
    
    let year = one.year;
    let month = one.month;

    while (days < 0) { days += daysInMonth(month, year); month-=1; months-=1; }
    while (days > daysInMonth(month, year)) { days-=daysInMonth(month, year); month+=1; months+=1; }
    while (months < 0) { months += 12; }
    while (months > 12) { months -= 12; }

    return castDuration({ months, days }, this);
  }

  withYear(year = 0) {
    return new CivilDate(year, this.month, this.day);
  }

  toString() {
    const { month, day } = this;
    return `${pad(month, 2)}-${pad(day, 2)}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(isoString) {
    const { month, day } = parseISO(isoString);
    return new CivilMonthDay(month, day);
  }
}
CivilMonthDay.prototype[Symbol.toStringTag] = 'CivilMonthDay';

const ISORE = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[0-1])$/;
function parseISO(isoString) {
  const match = ISORE.exec(isoString);
  if (!match) throw new Error('invalid argument');
  const month = +match[1];
  const day = +match[2];
  return { month, day };
}
