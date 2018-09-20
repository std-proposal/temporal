/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus, toDayOfWeek, toDayOfYear, fromDayOfYear, toWeekOfYear, fromWeekOfYear, possibleTimestamps } from './shared.mjs';
import { number, pad, signedpad, getInstantInfo, typeCheck } from '../utils.mjs';

import { DATA } from '../data.mjs';
import { Instant } from '../instant.mjs';
import { Zoned } from '../zoned.mjs';

export class CivilDateTime {
  constructor(years, months, days, hours, minutes, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0) {
    this[DATA] = plus({}, { years, months, days, hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
  }
  get year() { return this[DATA].year; }
  get month() { return this[DATA].month; }
  get day() { return this[DATA].day; }
  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }

  get millisecond() { return Math.floor(this[DATA].nanosecond / 1e6); }
  get microsecond() { return Math.floor(this[DATA].nanosecond / 1e3) % 1e3; }
  get nanosecond() { return this[DATA].nanosecond % 1e3; }

  get dayOfWeek() { return toDayOfWeek(this.year, this.month, this.day) || 7; }
  get dayOfYear() { return toDayOfYear(this.year, this.month, this.day); }
  get weekOfYear() { return toWeekOfYear(this.year, this.month, this.day); }

  plus(data) {
    const { year, month, day, hour, minute, second, nanosecond } = plus(this[DATA], data);
    return new CivilDateTime(year, month, day, hour, minute, second, 0, 0, nanosecond);
  }
  with({ year = this.year, month = this.month, day = this.day, hour = this.hour, minute = this.minute, second = this.second, millisecond = this.millisecond, microsecond = this.microsecond, nanosecond = this.nanosecond } = {}) {
    return new CivilDateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }

  withZone(zone, filter) {
    const zoned = possibleTimestamps(this[DATA], '' + zone).map((info)=>{
      const instant = Object.create(Instant.prototype);
      instant[DATA] = info;
      return new Zoned(instant, zone);
    });
    let found = undefined;
    switch(typeof filter) {
      case 'string':
        found = zoned.find((zoned) => (zoned.offsetString === filter));
        break;
      case 'number':
        found = zoned.find((zoned) => (zoned.offsetSeconds === filter));
        break;
      case 'function':
        found = zoned.find(filter);
        break;
      default:
        found = zoned.shift();
    }
    if (!found) {
      throw new Error(`invalid time ${this} in zone ${zone}`);
    }
    return found;
  }
  static fromZonedDateTime(zoned) {
    typeCheck(zoned, 'ZonedDateTime');
    const { year, month, day, hour, minute, second, nanosecond } = getInstantInfo(zoned.instant[DATA].milliseconds, zoned.instant[DATA].nanoseconds, zoned.offsetString);
    return new CivilDateTime(year, month, day, hour, minute, second, nanosecond);
  }

  toCivilDate() {
    const { year, month, day } = this[DATA];
    return new CivilDateTime(year, month, day);
  }
  toCivilTime() {
    const { hour, minute, second, nanosecond } = this[DATA];
    const instance = Object.create(CivilTime.prototype);
    instance[DATA] = { hour, minute, second, nanosecond };
    return instance;
  }

  toDateTimeString() {
    const { year, month, day, hour, minute, second } = this;
    const nanosecond = this[DATA].nanosecond;
    return `${signedpad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  static fromDateTimeString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-time-string ${string}`); }
    return new CivilDateTime(number(match[1]), number(match[2]), number(match[3]), number(match[4]), number(match[5]), number(match[6]), 0, 0,number(match[7]));
  }

  toWeekDateTimeString() {
    const { year, month, weekOfYear, dayOfWeek, hour, minute, second } = this;
    const nanosecond = this[DATA].nanosecond;
    let wyear = year;
    if (month === 1 && weekOfYear > 51) {
      wyear += 1;
    } else if (month === 12 && weekOfYear === 1) {
      wyear -= 1;
    }
    return `${signedpad(wyear, 4)}-W${pad(weekOfYear, 2)}-${pad(dayOfWeek, 1)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  static fromWeekDateTimeString(string) {
    const match = /^(\d{4})-W(\d{2})-(\d{1})T(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-weekdatetime-string ${string}`); }
    const { year, month, day } = fromWeekOfYear(number(match[1]), number(match[2]), number(match[3]));
    return new CivilDateTime(year, month, day, number(match[4]), number(match[5]), number(match[6]), 0, 0, number(match[7]));
  }

  toOrdinalDateTimeString() {
    const { year, dayOfYear, hour, minute, second } = this;
    const nanosecond = this[DATA].nanosecond;
    return `${signedpad(year, 4)}-${pad(dayOfYear, 3)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  static fromOrdinalDateTimeString(string) {
    const match = /^(\d{4})-(\d{3})T(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec('' + string);
    if (!match) { throw new Error(`invalid date-ordinaltime-string ${string}`); }
    const { year, month, day } = fromDayOfYear(number(match[1]), number(match[2]));
    return new CivilDateTime(year, month, day, number(match[3]), number(match[4]), number(match[5]), 0, 0, number(match[6]));
  }

  toString() {
    return this.toDateTimeString();
  }
  toJSON() {
    return this.toString();
  }
  static fromString(string) {
    try {
      return CivilDateTime.fromDateTimeString(string);
    } catch(ex) {}
    try {
      return CivilDateTime.fromWeekDateTimeString(string);
    } catch (ex) { }
    try {
      return CivilDateTime.fromOrdinalDateTimeString(string);
    } catch (ex) { }
    throw new Error('invalid iso-date-time string');
  }
};

CivilDateTime.prototype[Symbol.toStringTag] = 'CivilDateTime';
