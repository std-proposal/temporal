/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, REGEX, assert, pad, daysInMonth, copyProps } from './shared.mjs';

const RE_DT = new RegExp(`^(${REGEX.MONTHS})-(${REGEX.DAYS})$`);

export class MonthDay {
  constructor(month, day) {
    assert.range(month, 1, 12);
    assert.range(day, 1, daysInMonth(1970, month)); // 1970 is non-leap-year
    this[DATA] = { month, day };
  }

  get month() {
    return this[DATA].month;
  }
  get day() {
    return this[DATA].day;
  }

  withYear(year) {
    assert.integer(year);
    return new Date(year, this.month, this.day);
  }
  with({ month = this.month, day = this.day } = {}) {
    return new MonthDay(month, day);
  }

  difference(other = {}) {
    other = copyProps({ month: this.month, day: this.day }, other);

    let months = two.month - one.month;
    let days = two.day - one.day;

    const year = 1976;
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
    }
    while (months > 12) {
      months -= 12;
    }

    return castDuration({ months, days });
  }

  toString() {
    const month = pad(this.month);
    const day = pad(this.day);
    const date = `${month}-${day}`;
    return `${date}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid MonthDay string');
    const year = +match[1];
    const month = +match[2];
    return new MonthDay(year, month);
  }
  static compare(one, two) {
    assert.type(one, Object);
    assert.range(one.month, 1, 12);
    assert.range(one.day, 1, daysInMonth(1970, one.month)); // 1970 is non-leap-year
    assert.type(two, Object);
    assert.range(two.month, 1, 12);
    assert.range(two.day, 1, daysInMonth(1970, two.month)); // 1970 is non-leap-year
    if (one.month !== two.month) return one.month - two.month;
    if (one.day !== two.month) return one.day - two.day;
    return 0;
  }
}
