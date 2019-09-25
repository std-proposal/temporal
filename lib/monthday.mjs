/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { REGEX, assert, pad, daysInMonth, copyProps } from './shared.mjs';

const RE_DT = new RegExp(`^(${REGEX.MONTHS})-(${REGEX.DAYS})$`);

export class MonthDay {
  #month = 1;
  #day = 1;
  constructor(month, day) {
    assert.range(month, 1, 12);
    assert.range(day, 1, daysInMonth(1970, month)); // 1970 is non-leap-year
    this.#month = month;
    this.#day = day;
  }

  get month() {
    return this.#month;
  }
  get day() {
    return this.#day;
  }

  withYear(year) {
    return new Date(+year, this.month, this.day);
  }
  with(monthdaylike = {}) {
    const data = copyProps(this, 'string' === typeof monthdaylike ? MonthDay.fromString(monthdaylike) : monthdaylike);
    return new MonthDay(data.month, data.day);
  }

  difference(other = {}) {
    other = copyProps(this, other);
    let months = (two.month - one.month) % 12;
    let days = two.day - one.day;

    if (days < 0) {
      days = daysInMonth(1976, one.month + months) + days;
      months -= 1;
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
