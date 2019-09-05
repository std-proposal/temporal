import {
  DATA,
  REGEX,
  pad,
  padYear,
  assert,
  daysInMonth,
  copyProps,
  toDayOfWeek,
  toDayOfYear,
  toWeekOfYear,
  balance,
  EARLIER,
  LATER
} from './shared.mjs';
import { Date } from './date.mjs';
import { Time } from './time.mjs';
import { YearMonth } from './yearmonth.mjs';
import { MonthDay } from './monthday.mjs';
import { cast as castDuration } from './duration.mjs';
import { ZonedDateTime } from './zoned.mjs';

const RE_DT = new RegExp(`^${REGEX.DATETIME.source}$`);

export class DateTime {
  constructor(year, month, day, hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    assert.integer(year);
    assert.range(month, 1, 12);
    assert.range(day, 1, daysInMonth(year, month));
    assert.range(hour, 0, 23);
    assert.range(minute, 0, 59);
    assert.range(second, 0, 60);
    assert.range(millisecond, 0, 999);
    assert.range(microsecond, 0, 999);
    assert.range(nanosecond, 0, 999);
    second = Math.min(59, second);
    this[DATA] = { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond };
  }

  get year() {
    return this[DATA].year;
  }
  get month() {
    return this[DATA].month;
  }
  get day() {
    return this[DATA].day;
  }
  get hour() {
    return this[DATA].hour;
  }
  get minute() {
    return this[DATA].minute;
  }
  get second() {
    return this[DATA].second;
  }
  get millisecond() {
    return this[DATA].millisecond;
  }
  get microsecond() {
    return this[DATA].microsecond;
  }
  get nanosecond() {
    return this[DATA].nanosecond;
  }
  get dayOfWeek() {
    return toDayOfWeek(this.year, this.month, this.day);
  }
  get dayOfYear() {
    return toDayOfYear(this.year, this.month, this.day);
  }
  get weekOfYear() {
    return toWeekOfYear(this.year, this.month, this.day);
  }

  getDate() {
    return new Date(this.year, this.month, this.day);
  }
  getTime() {
    return new Time(this.hour, this.minute, this.second, this.millisecond, this.microsecond, this.nanosecond);
  }
  getYearMonth() {
    return new YearMonth(this.year, this.month);
  }
  getMonthDay() {
    return new MonthDay(this.month, this.day);
  }

  with({
    year = this.year,
    month = this.month,
    day = this.day,
    hour = this.hour,
    minute = this.minute,
    second = this.second,
    millisecond = this.millisecond,
    microsecond = this.microsecond,
    nanosecond = this.nanosecond
  } = {}) {
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  withZone(timeZone, choice = EARLIER) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);
    const instants = timeZone.instants(dateTime);
    let instant;
    switch (choice) {
      case EARLIER:
        instant = instants.shift();
        break;
      case LATER:
        instant = instants.pop();
        break;
      default:
        instant = instant.find((instant) => timeZone.offset(instant) === choice);
        break;
    }
    if (!instant) throw TypeError('invalid DateTime int TimeZone');
    return Object.create(ZonedDateTime.prototype, { [DATA]: { value: Object.freeze } });
  }

  difference(other) {
    other = copyProps({ year: 0, month: 1, day: 1, hour:0, minute: 0, second: 0, millisecond:0, microsecond: 0, nanosecond: 0}, other);
    const [one, two] = [this, other].sort(DateTime.compare);

    let years = two.year - one.year;
    let months = two.month - one.month;
    let days = two.day - one.day;
    let hours = two.hour - one.hour;
    let minutes = two.minute - one.minute;
    let seconds = two.second - one.second;
    let milliseconds = two.millisecond - one.millisecond;
    let microseconds = two.microsecond - one.microsecond;
    let nanoseconds = two.nanosecond - one.nanosecond;

    let year = one.year;
    let month = one.month;
    let day = one.day;

    while (nanoseconds < 0) {
      nanoseconds += 1e3;
      microseconds -= 1;
    }
    while (nanoseconds >= 1e3) {
      nanoseconds -= 1e3;
      microseconds += 1;
    }

    while (microseconds < 0) {
      microseconds += 1e3;
      milliseconds -= 1;
    }
    while (microseconds >= 1e3) {
      microseconds -= 1e3;
      milliseconds += 1;
    }

    while (milliseconds < 0) {
      milliseconds += 1e3;
      seconds -= 1;
    }
    while (milliseconds >= 1e3) {
      milliseconds -= 1e3;
      seconds += 1;
    }

    while (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    while (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
    }

    while (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    while (hours < 0) {
      hours += 24;
      days -= 1;
      day -= 1;
    }
    while (hours >= 24) {
      hours -= 24;
      days += 1;
      day += 1;
    }

    while (day < 0) {
      day += daysInMonth(year, month);
      month -= 1;
    }
    while (day >= daysInMonth(year, month)) {
      day -= daysInMonth(year, month);
      month += 1;
    }

    while (days < 0) {
      days += daysInMonth(year, month);
      month -= 1;
      months -= 1;
    }
    while (days > daysInMonth(year, month)) {
      days -= daysInMonth(year, month);
      month += 1;
      months += 1;
    }

    while (months < 0) {
      months += 12;
      years -= 1;
    }
    while (months > 12) {
      months -= 12;
      years += 1;
    }

    return castDuration({
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    });
  }
  plus(duration) {
    duration = castDuration(duration);
    const data = copyProps({ year:0, month: 1, day: 1, hour:0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, this);

    data.year += duration.years || 0;
    balance(data);

    data.month += +(duration.months || 0);
    balance(data, true);

    data.day += duration.days || 0;
    balance(data);

    data.hour += duration.hours || 0;
    balance(data);

    data.minute += duration.minutes || 0;
    balance(data);

    data.second += duration.seconds || 0;
    balance(data);

    data.millisecond += duration.milliseconds || 0;
    balance(data);

    data.microsecond += duration.microsecond || 0;
    balance(data);

    data.nanosecond += duration.nanoseconds || 0;
    balance(data);

    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = data;
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(duration) {
    duration = castDuration(duration);
    const data = copyProps({ year:0, month: 1, day: 1, hour:0, minute: 0, second: 0, millisecond: 0, microsecond: 0, nanosecond: 0 }, this);

    data.year -= (duration.years || 0);
    balance(data);

    data.month -= (duration.months || 0);
    balance(data, true);

    data.day -= duration.days || 0;
    balance(data);

    data.hour -= (duration.hours || 0);
    balance(data);

    data.minute -= duration.minutes || 0;
    balance(data);

    data.second -= duration.seconds || 0;
    balance(data);

    data.millisecond -= duration.milliseconds || 0;
    balance(data);

    data.microsecond -= duration.microsecond || 0;
    balance(data);

    data.nanosecond -= duration.nanoseconds || 0;
    balance(data);

    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = data;
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }

  toString() {
    const year = padYear(this.year);
    const month = pad(this.month);
    const day = pad(this.day);

    const tp = [];
    tp.push(pad(this.hour, 2));
    tp.push(pad(this.minute, 2));

    const sp = [];
    if (this.nanosecond) sp.unshift(pad(this.nanosecond, 3));
    if (this.microsecond || sp.length) sp.unshift(pad(this.microsecond, 3));
    if (this.millisecond || sp.length) sp.unshift(pad(this.millisecond, 3));
    if (sp.length) {
      tp.push(`${pad(this.second, 2)}.${sp.join('')}`);
    } else {
      tp.push(pad(this.second, 2));
    }

    const date = `${year}-${month}-${day}`;
    const time = tp.join(':');
    return `${date}T${time}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid DateTime string');
    const year = +match[1];
    const month = +match[2];
    const day = +match[3];
    const hour = +match[4];
    const minute = +match[5];
    const second = match[6] === undefined ? 0 : +match[6];
    const millisecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(0, 3);
    const microsecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(3, 6);
    const nanosecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(6, 9);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  static compare(one, two) {
    assert.datetimelike(one);
    assert.datetimelike(two);
    if (one.year !== two.year) return one.year - two.year;
    if (one.month !== two.month) return one.month - two.month;
    if (one.day !== two.day) return one.day - two.day;
    if (one.hour !== two.hour) return one.hour - two.hour;
    if (one.minute !== two.minute) return one.minute - two.minute;
    if (one.second !== two.second) return one.second - two.second;
    if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
    if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
    if (one.nanosecond !== two.nanosecond) return other.nanosecond - two.nanosecond;
    return 0;
  }
}
