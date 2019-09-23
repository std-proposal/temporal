/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

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
  EARLIER,
  LATER
} from './shared.mjs';
import { Date } from './date.mjs';
import { Time } from './time.mjs';
import { YearMonth } from './yearmonth.mjs';
import { MonthDay } from './monthday.mjs';
import { cast as castDuration } from './duration.mjs';
import { Absolute } from './absolute.mjs';
import { TimeZone } from './timezone.mjs';
import { balance, balancePlus, balanceMinus } from './shared.mjs';

const RE_DT = new RegExp(`^${REGEX.DATETIME.source}$`);
const NULLDT = { year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, microsecond:0, nanosecond: 0 };

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

  with(datetimelike) {
    const data = copyProps(this, 'string' === typeof datetimelike ?  DateTime.fromString(datetimelike) : datetimelike);
    balance(data);
    return new DateTime(data.year, data.month, data.day, data.hour, data.minute, data.second, data.millisecond, data.microsecond, data.nanosecond);
  }
  withZone(timeZone, choice = EARLIER) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);
    const dateTime = this;
    const instants = timeZone.absolute(dateTime);
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
    return instant
  }

  difference(other = {}) {
    other = copyProps(NULLDT, 'string' === typeof other ? DateTime.fromString(other) : other);
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
    
    if (nanoseconds < 0) {
      nanoseconds += 1e3;
      microseconds -= 1;
    }
    if (microseconds < 0) {
      microseconds += 1e3;
      milliseconds -= 1;
    }
    if (milliseconds < 0) {
      milliseconds += 1e3;
      seconds -= 1;
    }
    if (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    if (hours < 0) {
      hours += 24;
      days -= 1;
    }
    
    if (months < 0) {
      years -= 1;
      months = 12 + months;
    }
    if (days < 0) {
      months -= 1;
      days = daysInMonth(one.year + years, (one.month + months) % 12) + days;
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
    const data = copyProps(this);

    data.year += duration.years;
    data.month += duration.months;
    balancePlus(data, true);
    data.day += duration.days;
    balancePlus(data);

    data.hour += duration.hours;
    data.minute += duration.minutes;
    data.second += duration.seconds;
    data.millisecond += duration.milliseconds;
    data.microsecond += duration.microseconds;
    data.nanosecond += duration.nanoseconds;
    balancePlus(data);

    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = data;
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(duration) {
    duration = castDuration(duration);
    const data = copyProps(this);

    data.hour -= duration.hours;
    data.minute -= duration.minutes;
    data.second -= duration.seconds;
    data.millisecond -= duration.milliseconds;
    data.microsecond -= duration.microseconds;
    data.nanosecond -= duration.nanoseconds;
    balanceMinus(data);

    data.day -= duration.days;
    balanceMinus(data);

    data.month -= duration.months;
    balanceMinus(data, true);

    data.year -= duration.years;
    balanceMinus(data);
    
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
