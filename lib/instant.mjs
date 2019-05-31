/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, signedpad, pad } from './shared.mjs';

import { ZonedDateTime } from './zoned.mjs';
import { OffsetDateTime } from './offset.mjs';

export class Instant {
  constructor(epochNanos) {
    if ('bigint' !== typeof epochNanos) throw new Error('invalid argument');
    const ms = Number(epochNanos / BigInt(1e6));
    const ns = Number(epochNanos % BigInt(1e6));
    this[DATA] = { ms, ns };
  }
  get epochNanoseconds() {
    const {ms, ns } = this[DATA];
    return BigInt(ms) * BigInt(1e6) + BigInt(ns);
  }
  get epochMicroseconds() {
    return this.epochNanoseconds / BigInt(1e3);
  }
  get epochMilliseconds() {
    const {ms} = this[DATA];
    return ms;
  }
  get epochSeconds() {
    return Math.floor(this.epochMilliseconds / 1e3);
  }

  withZone(ianaZone) {
    return new ZonedDateTime(this, ianaZone);
  }
  withOffset(offsetString) {
    return new OffsetDateTime(this, offsetString);
  }

  toString() {
    const date = new Date(this[DATA].ms);
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();
    const millisecond = date.getUTCMilliseconds();
    const datepart = `${signedpad(year,4)}-${pad(month,2)}-${pad(day,2)}`;
    const subsecs = `${pad(millisecond,3)}${pad(this[DATA].ns,6)}`;
    const timepart = `${pad(hour,2)}:${pad(minute,2)}:${pad(second,2)}.${subsecs}`;
    return `${datepart}T${timepart}Z`;
  }
  toJSON() {
    return this.toString();
  }

  static fromEpochNanoseconds(epochNanos) {
    return new Instant(epochNanos);
  }
  static fromEpochMicroseconds(epochMicros) {
    return new Instant(epochMicros * BigInt(1e3));
  }
  static fromEpochMilliseconds(epochMillis) {
    const instance = Object.create(Instant.prototype);
    const ms = epochMillis;
    const ns = 0;
    instance[DATA] = { ms, ns };
    return instance;
  }
  static fromEpochSeconds(epochSeconds) {
    const instance = Object.create(Instant.prototype);
    const ms = Math.floor(epochSeconds * 1e3);
    const ns = 0;
    instance[DATA] = { ms, ns };
    return instance;
  }
  static fromString(isoString) {
    const instant = Object.create(Instant.prototype);
    instant[DATA] = parseISO(isoString);
    return instant;
  }
}
Instant.prototype[Symbol.toStringTag] = 'Instant';

export function compare(one, two) {
  if (one[DATA].ms === two[DATA].ms) return (one[DATA].ms - two[DATA].ms) < 0 ? -1 : 1;
  if (one[DATA].ns === two[DATA].ns) return 0;
  return (one[DATA].ns - two[DATA].ns) < 0 ? -1 : 1;
}

const ISORE = /^([+-]?\d{4}\d*)-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9])(?::([0-5][0-9]))?(?:\.(\d{3}|\d{6}|\d{9}))?Z$/;
function parseISO(isoString) {
  const match = ISORE.exec(isoString);
  if (!match) throw new Error('invalid argument');
  const year = +match[1];
  const month = +match[2];
  const day = +match[3];
  const hour = +match[4];
  const minute = +match[5];
  const second = match[6] ? +match[6] : 0;
  const nanoseconds = + `${match[7] || ''}000000000`.slice(0, 9);
  const millisecond = Math.floor(nanoseconds / 1e6) % 1e3;
  const microsecond = Math.floor(nanoseconds / 1e3) % 1e3;
  const nanosecond = Math.floor(nanoseconds / 1e0) % 1e3;
  const ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const ns = (microsecond * 1e3) + nanosecond;
  return { ms, ns };
}
