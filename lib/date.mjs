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
  toWeekOfYear
} from './shared.mjs';

const RE_DT = new RegExp(`^${REGEX.DATE.source}$`);

import { YearMonth } from './yearmonth.mjs';
import { MonthDay } from './monthday.mjs';
import { DateTime } from './datetime.mjs';
import { cast as castDuration } from './duration.mjs';
import { Time } from './time.mjs';
import { balance, balancePlus, balanceMinus } from './shared.mjs';

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

  withTime(timelike = {}) {
    const data = copyProps(this, 'string' === typeof timelike ?  Time.fromString(timelike) : timelike);
    balance(data);
    return new DateTime(this.year, this.month, this.day, data.hour, data.minute, data.second, data.millisecond, data.microsecond, data.nanosecond);
  }
  with(datelike) {
    const data = copyProps(this, 'string' === typeof datelike ?  Date.fromString(datelike) : datelike);
    balance(data);
    return new Date(data.year, data.month, data.day);
  }

  difference(other = {}) {
    other = copyProps(this, 'string' === typeof other ? Date.fromString(other) : other);
    const [one, two] = [this, other].sort(Date.compare);

    let years = two.year - one.year;
    let months = two.month - one.month;
    let days = two.day - one.day;

    if (months < 0) {
      years -= 1;
      months = 12 + months;
    }
    if (days < 0) {
      months -= 1;
      days = daysInMonth(one.year + years, (one.month + months) % 12) + days;
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

    data.year += duration.years;
    data.month += duration.months;
    balancePlus(data, true);
    data.day += duration.days;
    balancePlus(data);
    
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

    data.day -= duration.days;
    balanceMinus(data);

    data.month -= duration.months;
    balanceMinus(data, true);

    data.year -= duration.years;
    balanceMinus(data);

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
