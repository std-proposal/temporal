/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA } from '../data.mjs';
import { number, pad, signedpad, getInstantInfo, typeCheck } from '../utils.mjs';
import { plus, toDayOfWeek, toDayOfYear, fromDayOfYear, toWeekOfYear, fromWeekOfYear } from './shared.mjs';

import { CivilDateTime } from './datetime.mjs';

export class CivilDate {
  constructor(years, months, days) {
    this[DATA] = plus({}, { years, months, days });
  }
  get year() { return this[DATA].year; }
  get month() { return this[DATA].month; }
  get day() { return this[DATA].day; }

  get dayOfWeek() { return toDayOfWeek(this.year, this.month, this.day); }
  get dayOfYear() { return toDayOfYear(this.year, this.month, this.day); }
  get weekOfYear() { return toWeekOfYear(this.year, this.month, this.day); }

  plus(data) {
    const { year, month, day } = plus(this, data);
    return new CivilDate(year, month, day);
  }
  with({ year = this.year, month = this.month, day = this.day } = {}) {
    return new CivilDate(year, month, day);
  }
  withTime(time = {}) {
    typeCheck(time, 'CivilTime');
    const { hour = 0, minute = 0, second = 0, millisecond, microsecond, nanosecond = 0 } = time;
    return new CivilDateTime(this.year, this.month, this.day, hour, minute, second, millisecond, microsecond, nanosecond);
  }

  toDateString() {
    const { year, month, day } = this;
    return `${signedpad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
  }
  static fromDateString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-time-string ${string}`); }
    return new CivilDate(number(match[1]), +match[2], +match[3], +match[4], +match[5], +match[6], +match[7]);
  }

  toWeekDateString() {
    const { year, weekOfYear, dayOfWeek } = this;
    let wyear = year;
    if (month === 1 && weekOfYear > 51) {
      wyear += 1;
    } else if (month === 12 && weekOfYear === 1) {
      wyear -= 1;
    }
    return `${signedpad(wyear, 4)}-W${pad(weekOfYear, 2)}-${pad(dayOfWeek, 2)}`;
  }
  static fromWeekDateTimeString(string) {
    const match = /^(\d{4})-W(\d{2})-(\d{2})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-time-string ${string}`); }
    const { year, month, day } = fromWeekOfYear(number(match[1]), number(match[2]), number(match[3]));
    return new CivilDate(year, month, day);
  }

  toOrdinalDateString() {
    const { year, dayOfYear } = this;
    return `${signedpad(year, 4)}-${pad(dayOfYear, 3)}`;
  }
  static fromOrdinalDateString() {
    const match = /^(\d{4})-(\d{3})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-time-string ${string}`); }
    const { year, month, day } = fromDayOfYear(number(match[1]), number(match[2]));
    return new CivilDate(year, month, day);
  }

  toString() {
    return this.toDateString();
  }
  toJSON() {
    return this.toString();
  }
  static fromString(string) {
    try {
      return CivilDate.fromDateString(string);
    } catch (ex) { }
    try {
      return CivilDate.fromWeekDateString(string);
    } catch (ex) { }
    try {
      return CivilDate.fromOrdinalDateString(string);
    } catch (ex) { }
    throw new Error('invalid iso-date string');
  }

  static fromDateTime(datetime) {
    typeCheck(datetime, 'CivilDateTime');
    const date = Object.create(CivilDate.prototype);
    const { year = 0, month = 1, day = 1 } = datetime;
    date[data] = { year, month, day };
    return date;
  }

  static fromZonedDateTime(zoned) {
    typeCheck(zoned, 'ZonedDateTime');
    const { year, month, day } = getInstantInfo(zoned.instant[DATA].milliseconds, zoned.instant[DATA].nanoseconds, zoned.offsetString);
    return new CivilDate(year, month, day);
  }
};

CivilDate.prototype[Symbol.toStringTag] = 'CivilDate';
