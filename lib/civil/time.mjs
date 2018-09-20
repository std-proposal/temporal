/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { plus } from './shared.mjs';
import { number, pad, getInstantInfo } from '../utils.mjs';

import { DATA } from '../data.mjs';

import { CivilDateTime } from './datetime.mjs';

export class CivilTime {
  constructor(hours, minutes, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0) {
    this[DATA] = plus({}, { hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
  }
  get hour() { return this[DATA].hour; }
  get minute() { return this[DATA].minute; }
  get second() { return this[DATA].second; }

  get millisecond() { return Math.floor(this[DATA].nanosecond / 1e6); }
  get microsecond() { return Math.floor(this[DATA].nanosecond / 1e3) % 1e3; }
  get nanosecond() { return this[DATA].nanosecond % 1e3; }

  plus(data) {
    const { hour, minute, second, nanosecond } = plus(this[DATA], data);
    return new CivilTime(hour, minute, second, 0, 0, nanosecond);
  }
  with({ hour = this.hour, minute = this.minute, second = this.second, millisecond = this.millisecond, microsecond = this.microsecond, nanosecond = this.nanosecond } = {}) {
    return new CivilTime(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  withDate(date = {}) {
    typeCheck(date, 'CivilDate');
    const { year = 0, month = 1, day = 1 } = date;
    return new CivilDateTime(year, month, day, this.hour, this.minute, this.second, this.millisecond, this.microsecond, this.nanosecond);
  }

  toTimeString() {
    const { hour, minute, second } = this;
    const nanosecond = this[DATA].nanosecond;
    return `${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}`;
  }
  static fromTimeString(string) {
    const match = /^(\d{2}):(\d{2}):(\d{2})\.(\d{9})$/.exec('' + string);
    if (!match) { throw new Error(`invalid time-string ${string}`); }
    return new CivilTime(number(match[1]), number(match[2]), number(match[3]), 0, 0, number(match[4]));
  }

  toString() {
    return this.toTimeString();
  }
  toJSON() {
    return this.toString();
  }
  static fromString(string) {
    return CivilTime.fromTimeString(string);
  }

  static fromDateTime(datetime) {
    typeCheck(datetime, 'CivilDateTime');
    const time = Object.create(CivilTime.prototype);
    const { hour = 0, minute = 0, second = 0, nanosecond = 0 } = datetime;
    time[data] =  { hour, minute, second, nanosecond };
    return time;
  }

  static fromZonedDateTime(zoned) {
    typeCheck(zoned, 'ZonedDateTime');
    const { hour, minute, second, nanosecond } = getInstantInfo(zoned.instant[DATA].milliseconds, zoned.instant[DATA].nanoseconds, zoned.offsetString);
    return new CivilTime(hour, minute, second, 0, 0, nanosecond);
  }
};

CivilTime.prototype[Symbol.toStringTag] = 'CivilTime';
