/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, pad, assert } from './shared.mjs';

const Y = /(?:(\d+)Y)?/;
const M = /(?:(\d+)M)?/;
const D = /(?:(\d+)D)?/;
const DT = new RegExp(`${Y.source}${M.source}${D.source}`);

const H = /(?:(\d+)H)?/;
const S = /(?:(\d+)(?:\.(\d+))?S)?/;
const TM = new RegExp(`T${H.source}${M.source}${S.source}`);

const RE = new RegExp(`^P(?:${DT.source})(?:${TM.source})?$`);

export class Duration {
  constructor() {
    throw new TypeError('Duration is not a constructor');
  }
  get years() {
    return this[DATA].years;
  }
  get months() {
    return this[DATA].months;
  }
  get days() {
    return this[DATA].days;
  }
  get hours() {
    return this[DATA].hours;
  }
  get minutes() {
    return this[DATA].minutes;
  }
  get seconds() {
    return this[DATA].seconds;
  }
  get milliseconds() {
    return this[DATA].milliseconds;
  }
  get microseconds() {
    return this[DATA].microseconds;
  }
  get nanoseconds() {
    return this[DATA].nanoseconds;
  }

  getDateDuration() {
    const { years, months, days } = this[DATA];
    return Object.create(Duration.prototype, { [DATA]: { value: Object.freeze({ years, months, days }) } });
  }
  getTimeDuration() {
    const { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = this[DATA];
    return Object.create(Duration.prototype, {
      [DATA]: { value: Object.freeze({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds }) }
    });
  }

  toString() {
    const date = [];
    if (this.years) date.push(`${this.years}Y`);
    if (this.months) date.push(`${this.months}M`);
    if (this.days) date.push(`${this.days}D`);

    const time = [];
    if (this.hours) time.push(`${this.hours}H`);
    if (this.minutes) time.push(`${this.minutes}M`);

    if (
      undefined !== typeof this.seconds &&
      (this.seconds || this.milliseconds || this.microseconds || this.nanoseconds)
    ) {
      const parts = [];
      if (this.nanoseconds) parts.unshift(pad(this.nanoseconds, 3));
      if (this.microseconds || this.nanoseconds) parts.unshift(pad(this.microseconds, 3));
      if (this.milliseconds || this.microseconds || this.nanoseconds) parts.unshift(pad(this.milliseconds, 3));
      parts.unshift(`${this.seconds}${parts.length ? '.' : ''}`);
      time.push(`${parts.join('')}S`);
    }
    if (time.length) time.unshift('T');
    return `P${date.join('')}${time.join('')}`;
  }
  toJSON() {
    const { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = this;
    return { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds };
  }
  static fromString(iso) {
    const match = RE.exec(iso);
    if (!match) throw new TypeError('invalid Duration string');

    const data = {};

    let years = match[1];
    let months = match[2];
    let days = match[3];
    if (isDef(years) || isDef(months) || isDef(days)) {
      assert.positive((years = +(years || 0)));
      assert.positive((months = +(months || 0)));
      assert.positive((days = +(days || 0)));
      Object.assign(data, { years, months, days });
    }

    let hours = match[4];
    let minutes = match[5];
    let seconds = match[6];
    let subseconds = match[7];
    let milliseconds, microseconds, nanoseconds;
    if (isDef(hours) || isDef(minutes) || isDef(seconds) || isDef(subseconds)) {
      assert.positive((hours = +(hours || 0)));
      assert.positive((minutes = +(minutes || 0)));
      assert.positive((seconds = +(seconds || 0)));
      subseconds = `${subseconds || ''}000000000`.slice(0, 9);
      assert.positive((milliseconds = +subseconds.slice(0, 3)));
      assert.positive((microseconds = +subseconds.slice(3, 6)));
      assert.positive((nanoseconds = +subseconds.slice(6, 9)));
      Object.assign(data, { hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
    }

    return Object.create(Duration.prototype, { [DATA]: { value: Object.freeze(data) } });
  }
  static cast(d) {
    return cast(d);
  }
}

export function cast(dl) {
  if ('string' === typeof dl) dl = Duration.fromString(dl);
  let { years, months, days } = dl;
  let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = dl;

  const data = {};
  assert.positive((years = +(years || 0)));
  assert.positive((months = +(months || 0)));
  assert.positive((days = +(days || 0)));
  Object.assign(data, { years, months, days });

  assert.positive((hours = +(hours || 0)));
  assert.positive((minutes = +(minutes || 0)));
  assert.positive((seconds = +(seconds || 0)));
  assert.positive((milliseconds = +(milliseconds || 0)));
  assert.positive((microseconds = +(microseconds || 0)));
  assert.positive((nanoseconds = +(nanoseconds || 0)));
  Object.assign(data, { hours, minutes, seconds, milliseconds, microseconds, nanoseconds });

  data.microseconds += Math.floor(data.nanoseconds / 1000);
  data.nanoseconds = data.nanoseconds % 1000;

  data.milliseconds += Math.floor(data.microseconds / 1000);
  data.microseconds = data.microseconds % 1000;

  data.seconds += Math.floor(data.milliseconds / 1000);
  data.milliseconds = data.milliseconds % 1000;

  data.minutes += Math.floor(data.seconds / 60);
  data.seconds = data.seconds % 60;

  data.hours += Math.floor(data.minutes / 60);
  data.minutes = data.minutes % 60;

  return Object.create(Duration.prototype, { [DATA]: { value: Object.freeze(data) } });
}

function isDef(v) {
  return 'undefined' !== typeof v;
}
