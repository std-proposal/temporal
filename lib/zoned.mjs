/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { pad, signedpad, getInstantInfo, number, typeCheck } from './utils.mjs';
import { DATA } from './data.mjs';
import { Instant } from './instant.mjs';

import { CivilDateTime } from './civil/datetime.mjs';

export class Zoned {
  constructor(instant, zone) {
    typeCheck(instant, 'Instant');
    const { year, month, day, hour, minute, second, nanosecond, offsetSeconds, ianaZone } = getInstantInfo(instant[DATA].milliseconds, instant[DATA].nanoseconds, '' + (zone || 'UTC'));
    const civil = new CivilDateTime(year, month, day, hour, minute, second, nanosecond);
    this[DATA] = { instant, offsetSeconds, ianaZone, civil };
  }
  get instant() { return this[DATA].instant; }

  get offsetSeconds() { return this[DATA].offsetSeconds; }
  get ianaZone() { return this[DATA].ianaZone; }
  get timeZone() { return this.ianaZone || this.offsetString; }
  get offsetString() {
    const offset = this.offsetSeconds;
    const sign = (offset < 0) ? '-' : '+';
    const hour = Math.floor(Math.abs(offset) / 3600);
    const mins = Math.floor(Math.abs(offset) / 60) % 60;
    return `${sign}${pad(hour, 2)}:${pad(mins, 2)}`;
  }

  get year() { return this[DATA].civil.year; }
  get month() { return this[DATA].civil.month; }
  get day() { return this[DATA].civil.day; }
  get hour() { return this[DATA].civil.hour; }
  get minute() { return this[DATA].civil.minute; }
  get second() { return this[DATA].civil.second; }
  get millisecond() { return this[DATA].civil.millisecond; }
  get microsecond() { return this[DATA].civil.microsecond; }
  get nanosecond() { return this[DATA].civil.nanosecond; }

  plus(data) {
    let nanoseconds = this[DATA].instant[DATA].nanoseconds + (data.nanoseconds || 0) + ((data.microseconds || 0) * 1E3);
    let milliseconds = this[DATA].instant[DATA].milliseconds + (data.milliseconds || 0) + ((data.seconds || 0) * 1E3) + ((data.minutes || 0) * 6E4) + ((data.hours || 0) * 36E5);

    while (nanoseconds < 0) { nanoseconds += 1E6; milliseconds -=1; }
    while (nanoseconds >= 1E6) { nanoseconds -= 1E6; milliseconds += 1; }

    const { year, month, day, hour, minute, second, nanosecond } = getInstantInfo(milliseconds, nanoseconds, this.timeZone);

    const civil = new CivilDateTime(year, month, day, hour, minute, second, 0, 0, nanosecond);
    return civil.withZone(this.timeZone);
  }

  toCivilDateTime() {
    return this[DATA].civil;
  }
  toCivilDate() {
    return this[DATA].civil.toCivilDate();
  }
  toCivilTime() {
    return this[DATA].civil.toCivilTime();
  }

  toString() {
    const {
      year, month, day,
      hour, minute, second, nanosecond,
      ianaZone
    } = getInstantInfo(this[DATA].instant[DATA].milliseconds, this[DATA].instant[DATA].nanoseconds, this.timeZone);
    return `${signedpad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(hour, 2)}:${pad(minute, 2)}:${pad(second, 2)}.${pad(nanosecond, 9)}${this.offsetString}${!ianaZone ? '' : `[${ianaZone}]`}`;
  }
  toJSON() {
    return this.toString();
  }
  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})([+-]\d{2}\:\d{2})(?:\[([\w_]+(?:\/[\w_]+)+)\])?$/.exec('' + string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    const milliseconds = Date.parse(`${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}.${match[7]}${match[9]}`);
    const nanoseconds = number(match[8]);
    const zone = match[10] || match[9];
    const instant = Object.create(Instant.prototype);
    instant[DATA] = { milliseconds, nanoseconds };
    const zoned = new Zoned(instant, zone);
    if (match[9] !== zoned.offsetString) {
      throw new Error('time-zone mismatch in string');
    }
    return zoned;
  }

  static fromSeconds(seconds, zone) {
    return new ZonedDateTime(Instant.fromSeconds(seconds), zone);
  }
  static fromMilliseconds(milliseconds, zone) {
    return new ZonedDateTime(Instant.fromMilliseconds(milliseconds), zone);
  }
  static fromMicroseconds(micros, zone) {
    return new ZonedDateTime(Instant.fromMicroseconds(micros), zone);
  }
  static fromNanoseconds(nanos, zone) {
    return new ZonedDateTime(Instant.fromNanoseconds(nanos), zone);
  }
}

Zoned.prototype[Symbol.toStringTag] = 'ZonedDateTime';
