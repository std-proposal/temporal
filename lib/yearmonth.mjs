/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, REGEX, assert, pad, copyProps } from './shared.mjs';
import { Date } from './date.mjs';
import { cast as castDuration } from './duration.mjs';

const RE_DT = new RegExp(`^(${REGEX.YEARS})-(${REGEX.MONTHS})$`);

export class YearMonth {
  constructor(year, month) {
    assert.integer(year);
    assert.range(month, 1, 12);
    this[DATA] = { year, month };
  }

  get year() {
    return this[DATA].year;
  }
  get month() {
    return this[DATA].month;
  }

  withDay(day) {
    return new Date(this.year, this.month, day);
  }
  with({ year = this.year, month = this.month } = {}) {
    return new YearMonth(year, month);
  }

  difference(other = {}) {
    other = copyProps({ year: this.year, month: this.month }, other);
    const [one, two] = [this, other].sort(YearMonth.compare);

    let years = two.year - one.year;
    let months = two.month - one.month;

    while (months < 1) {
      months += 12;
      years -= 1;
    }
    while (months > 12) {
      months -= 12;
      years += 1;
    }

    return castDuration({ years, months });
  }
  toString() {
    const year = pad(this.year, 4);
    const month = pad(this.month);
    const date = `${year}-${month}`;
    return `${date}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid YearMonth string');
    const year = +match[1];
    const month = +match[2];
    return new YearMonth(year, month);
  }
  static compare(one, two) {
    assert.type(one, Object);
    assert.integer(one.year);
    assert.range(one.month, 1, 12);
    assert.type(two, Object);
    assert.integer(two.year);
    assert.range(two.month, 1, 12);
    if (one.year !== two.year) return one.year - two.year;
    if (one.month !== two.month) return one.month - two.month;
    return 0;
  }
}
