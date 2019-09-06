/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import {
  DATA,
  REGEX,
  assert,
  daysInMonth,
  pad,
  padYear,
  copyProps,
  toDayOfWeek,
  toDayOfYear,
  toWeekOfYear,
  balance
} from './shared.mjs';

const RE_DT = new RegExp(`^${REGEX.DATE.source}$`);

import { YearMonth } from './yearmonth.mjs';
import { MonthDay } from './monthday.mjs';
import { DateTime } from './datetime.mjs';
import { cast as castDuration } from './duration.mjs';

export class Date {
  constructor(year, month, day) {
    assert.integer(year);
    assert.range(month, 1, 12);
    assert.range(day, 1, daysInMonth(year, month));
    this[DATA] = { year, month, day };
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
  get dayOfWeek() {
    return toDayOfWeek(this.year, this.month, this.day);
  }
  get dayOfYear() {
    return toDayOfYear(this.year, this.month, this.day);
  }
  get weekOfYear() {
    return toWeekOfYear(this.year, this.month, this.day);
  }

  getYearMonth() {
    return new YearMonth(this.year, this.month);
  }
  getMonthDay() {
    return new MonthDay(this.month, this.day);
  }

  withTime({ hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 }) {
    return new DateTime(this.year, this.month, this.day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  with({ year = this.year, month = this.month, day = this.day } = {}) {
    return new Date(year, month, day);
  }

  difference(other = {}) {
    other = copyProps({ year: this.year, month: this.month, day: this.day }, other);
    const [one, two] = [this, other].sort(Date.compare);

    let years = two.year - one.year;
    let months = two.month - one.month;
    let days = two.day - one.day;

    let year = one.year;
    let month = one.month;
    let day = one.day;

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

    return castDuration({ years, months, days });
  }
  plus(duration) {
    duration = castDuration(duration);
    if (
      duration.hours ||
      duration.minutes ||
      duration.seconds ||
      duration.milliseconds ||
      duration.milliseconds ||
      duration.nanoseconds
    ) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    const data = copyProps(this);

    data.year += duration.years || 0;
    balance(data);

    data.month += duration.months || 0;
    balance(data, true);

    data.day += duration.days || 0;
    balance(data);

    const { year, month, day } = data;
    return new Date(year, month, day);
  }
  minus(duration) {
    duration = castDuration(duration);
    if (
      duration.hours ||
      duration.minutes ||
      duration.seconds ||
      duration.milliseconds ||
      duration.milliseconds ||
      duration.nanoseconds
    ) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    const data = copyProps(this);

    data.year -= duration.years || 0;
    balance(data);

    data.month -= duration.months || 0;
    balance(data, true);

    data.day -= duration.days || 0;
    balance(data);

    const { year, month, day } = data;
    return new Date(year, month, day);
  }

  toString() {
    const year = padYear(this.year);
    const month = pad(this.month);
    const day = pad(this.day);
    const date = `${year}-${month}-${day}`;
    return `${date}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid Date string');
    const year = +match[1];
    const month = +match[2];
    const day = +match[3];
    return new Date(year, month, day);
  }
  static compare(one, two) {
    assert.datelike(one);
    assert.datelike(two);
    if (one.year !== two.year) return one.year - two.year;
    if (one.month !== two.month) return one.month - two.month;
    if (one.day !== two.day) return one.day - two.day;
    return 0;
  }
}
