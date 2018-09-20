
/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA } from './data.mjs';
import { number, pad } from './utils.mjs';

export class Instant {
  constructor(nanos) {
    if ('bigint' !== typeof nanos) { throw new TypeError('Instant must be constructed with BigInt'); }
    const milliseconds = Number(nanos / BigInt(1E6));
    const nanoseconds = Number(nanos % BigInt(1E6));
    this[DATA] = { milliseconds, nanoseconds };
  }
  get seconds() { return Math.floor(this[DATA].milliseconds / 1E3); }
  get milliseconds() { return this[DATA].milliseconds; }
  get microseconds() { return this.nanoseconds / BigInt(1E3); }
  get nanoseconds() { return (BigInt(this.milliseconds) * BigInt(1E6)) + BigInt(this[DATA].nanoseconds); }

  withZone(zone) {
    return new ZonedDateTime(this, zone);
  }
  toString() {
    return (new Date(this.milliseconds)).toISOString().replace(/\.(\d{3})Z$/, `.$1${pad(this[DATA].nanoseconds,6)}Z`);
  }
  toJSON() {
    return this.toString();
  }
  static fromUTC(year, month, day, hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    let milliseconds = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    let nanoseconds = (microsecond * 1E3) + nanosecond;

    while (nanoseconds < 0) { nanoseconds += 1E6; milliseconds -= 1; }
    while (nanoseconds > 1E6) { nanoseconds -= 1E6; milliseconds += 1; }

    const result = Object(Instant.prototype);
    result[data] = { milliseconds, nanoseconds };

    return result;
  }
  static fromString(string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})(\d{6})Z$/.exec('' + string);
    if (!match) {
      throw new Error(`invalid date-time-string ${string}`);
    }
    const milliseconds = Date.UTC(number(match[1]), number(match[2]) - 1, number(match[3]), number(match[4]), number(match[5]), number(match[6]), number(match[7]));
    const nanoseconds = number(match[8]);

    const instant = Object.create(Instant.prototype);
    instant[DATA] = { milliseconds, nanoseconds };

    return instant;
  }
  static fromSeconds(seconds) {
    return Instant.fromMilliseconds(number(seconds) * 1000);
  }
  static fromMilliseconds(millis) {
    const instant = Object.create(Instant.prototype);
    const milliseconds = number(millis);
    const nanoseconds = 0;
    instant[DATA] = { milliseconds, nanoseconds };
    return instant;
  }
  static fromMicroseconds(micros) {
    return new Instant(micros * BigInt(1E3));
  }
  static fromNanoseconds(nanos) {
    return new Instant(nanos);
  }
};

Instant.prototype[Symbol.toStringTag] = 'Instant';
Instant.prototype[Symbol.toPrimitive] = function(hint) {
  switch(hint) {
    case 'bigint': return this.nanoseconds;
    case 'number': return this.milliseconds;
    case 'string': return this.toString();
    case 'boolean': return true;
    default: return null;
  }
};
