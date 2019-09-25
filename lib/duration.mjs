/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, assert } from './shared.mjs';

const Y = /(?:(\d+)Y)?/;
const M = /(?:(\d+)M)?/;
const D = /(?:(\d+)D)?/;
const DT = new RegExp(`${Y.source}${M.source}${D.source}`);

const H = /(?:(\d+)H)?/;
const S = /(?:(\d+)(?:\.(\d+))?S)?/;
const TM = new RegExp(`T${H.source}${M.source}${S.source}`);

const RE = new RegExp(`^P(?:${DT.source})(?:${TM.source})?$`);

export class Duration {
  constructor() {}
  #years = 0;
  #months = 0;
  #days = 0;
  #hours = 0;
  #minutes = 0;
  #seconds = 0;
  #milliseconds = 0;
  #microseconds = 0;
  #nanoseconds = 0;
  get years() {
    return this.#years;
  }
  get months() {
    return this.#months;
  }
  get days() {
    return this.#days;
  }
  get hours() {
    return this.#hours;
  }
  get minutes() {
    return this.#minutes;
  }
  get seconds() {
    return this.#seconds;
  }
  get milliseconds() {
    return this.#milliseconds;
  }
  get microseconds() {
    return this.#microseconds;
  }
  get nanoseconds() {
    return this.#nanoseconds;
  }

  getDateDuration() {
    const duration = new Duration();
    duration.#years = this.years;
    duration.#months = this.months;
    duration.#days = this.days;
    return duration;
  }
  getTimeDuration() {
    const duration = new Duration();
    duration.#hours = this.hours;
    duration.#minutes = this.minutes;
    duration.#seconds = this.seconds;
    duration.#milliseconds = this.milliseconds;
    duration.#microseconds = this.microseconds;
    duration.#nanoseconds = this.nanoseconds;
    return duration;
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
    if (!match) throw new TypeError(`invalid Duration string: ${iso}`);

    const duration = new Duration();

    let years = match[1];
    let months = match[2];
    let days = match[3];
    if (isDef(years) || isDef(months) || isDef(days)) {
      assert.positive((years = +(years || 0)));
      assert.positive((months = +(months || 0)));
      assert.positive((days = +(days || 0)));
      duration.#years = +(years || 0);
      duration.#months = +(months || 0);
      duration.#days = +(days || 0);
    }

    let hours = match[4];
    let minutes = match[5];
    let seconds = match[6];
    let subseconds = match[7];
    if (isDef(hours) || isDef(minutes) || isDef(seconds) || isDef(subseconds)) {
      let milliseconds, microseconds, nanoseconds;
      assert.positive((hours = +(hours || 0)));
      assert.positive((minutes = +(minutes || 0)));
      assert.positive((seconds = +(seconds || 0)));
      subseconds = `${subseconds || ''}000000000`.slice(0, 9);
      assert.positive((milliseconds = +subseconds.slice(0, 3)));
      assert.positive((microseconds = +subseconds.slice(3, 6)));
      assert.positive((nanoseconds = +subseconds.slice(6, 9)));
      duration.#hours = +(hours || 0);
      duration.#minutes = +(minutes || 0);
      duration.#seconds = +(seconds || 0);
      duration.#milliseconds = +(milliseconds || 0);
      duration.#microseconds = +(milliseconds || 0);
      duration.#nanoseconds = +(milliseconds || 0);
    }

    return duration;
  }
  static cast(dl) {
    if ('string' === typeof dl) dl = Duration.fromString(dl);
    let { years, months, days } = dl;
    let { hours, minutes, seconds, milliseconds, microseconds, nanoseconds } = dl;
  
    const duration = new Duration();
    assert.positive((years = +(years || 0)));
    assert.positive((months = +(months || 0)));
    assert.positive((days = +(days || 0)));
    duration.#years = +(years || 0);
    duration.#months = +(months || 0);
    duration.#days = +(days || 0);
  
    assert.positive((hours = +(hours || 0)));
    assert.positive((minutes = +(minutes || 0)));
    assert.positive((seconds = +(seconds || 0)));
    assert.positive((milliseconds = +(milliseconds || 0)));
    assert.positive((microseconds = +(microseconds || 0)));
    assert.positive((nanoseconds = +(nanoseconds || 0)));
    duration.#hours = +(hours || 0);
    duration.#minutes = +(minutes || 0);
    duration.#seconds = +(seconds || 0);
    duration.#milliseconds = +(milliseconds || 0);
    duration.#microseconds = +(microseconds || 0);
    duration.#nanoseconds = +(nanoseconds || 0);
  
    duration.#microseconds += Math.floor(duration.#nanoseconds / 1000);
    duration.#nanoseconds = duration.#nanoseconds % 1000;
  
    duration.#milliseconds += Math.floor(duration.#microseconds / 1000);
    duration.#microseconds = duration.#microseconds % 1000;
  
    duration.#seconds += Math.floor(duration.#milliseconds / 1000);
    duration.#milliseconds = duration.#milliseconds % 1000;
  
    duration.#minutes += Math.floor(duration.#seconds / 60);
    duration.#seconds = duration.#seconds % 60;
  
    duration.#hours += Math.floor(duration.#minutes / 60);
    duration.#minutes = duration.#minutes % 60;
  
    return duration;
  }
}

export const cast = (dl)=>Duration.cast(dl);

function isDef(v) {
  return 'undefined' !== typeof v;
}
