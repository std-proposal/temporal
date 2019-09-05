import { DATA, REGEX, pad, assert } from './shared.mjs';
import { ZonedDateTime } from './zoned.mjs';
import { TimeZone } from './timezone.mjs';
import { cast } from './duration.mjs';

const RE_DT = new RegExp(`^${REGEX.DATETIME.source}Z$`);

export class Instant {
  constructor(epochNanoSeconds) {
    if ('bigint' !== typeof epochNanoSeconds) throw new TypeError('argument to Instant constructor must be BigInt');
    this[DATA] = epochNanoSeconds;
  }

  withZone(timeZone) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);
    return new ZonedDateTime(this, timeZone);
  }

  difference(other) {
    assert.type(other, Instant);
    const nanoseconds = Math.abs(Number(this[DATA] - other[DATA]));
    return cast({ nanoseconds });
  }
  plus(duration) {
    duration = cast(duration);
    if (duration.years || duration.months || duration.days) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    let nanos = this[DATA];
    nanos += BigInt(duration.nanoseconds || 0);
    nanos += BigInt(duration.microseconds || 0) * 1000n;
    nanos += BigInt(duration.milliseconds || 0) * 1000000n;
    nanos += BigInt(duration.seconds || 0) * 1000000000n;
    nanos += BigInt(duration.minutes || 0) * 60000000000n;
    nanos += BigInt(duration.hours || 0) * 3600000000000n;
    
    return new Instant(nanos);
  }
  minus(duration) {
    duration = cast(duration);
    if (duration.years || duration.months || duration.days) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    let nanos = this[DATA];
    nanos -= BigInt(duration.nanoseconds || 0);
    nanos -= BigInt(duration.microseconds || 0) * 1000n;
    nanos -= BigInt(duration.milliseconds || 0) * 1000000n;
    nanos -= BigInt(duration.seconds || 0) * 1000000000n;
    nanos -= BigInt(duration.minutes || 0) * 60000000000n;
    nanos -= BigInt(duration.hours || 0) * 3600000000000n;

    return new Instant(nanos);
  }

  getEpochSeconds() {
    return Number(this[DATA] / 1000000000n);
  }
  getEpochMilliseconds() {
    return Number(this[DATA] / 1000000n);
  }
  getEpochMicroseconds() {
    return this[DATA] / 1000n;
  }
  getEpochNanoseconds() {
    return this[DATA];
  }

  toString() {
    const ns = Math.abs(Number(this[DATA] % 1000n));
    const mx = Math.abs(Number((this[DATA] / 1000n) % 1000n));
    const dt = new Date(Number(this[DATA] / 1000000n));
    const year = dt.getUTCFullYear();
    const month = dt.getUTCMonth() + 1;
    const day = dt.getUTCDate();
    const hour = dt.getUTCHours();
    const minute = dt.getUTCMinutes();
    let seconds = dt.getUTCSeconds();
    const ms = dt.getUTCMilliseconds();

    const tp = [];
    let sp = [];
    if (ns) sp.unshift(pad(ns, 3));
    if (mx || sp.length) sp.unshift(pad(mx, 3));
    if (ms || sp.length) sp.unshift(pad(ms, 3));
    if (sp.length) {
      tp.unshift(`${pad(seconds, 2)}.${sp.join('')}`);
    } else {
      tp.unshift(pad(seconds, 2));
    }
    tp.unshift(pad(minute, 2));
    tp.unshift(pad(hour, 2));

    const time = tp.join(':');
    const date = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}`;
    return `${date}T${time}Z`;
  }
  toJSON() {
    return this.toString();
  }

  static fromEpochSeconds(seconds) {
    return new Instant(BigInt(seconds) * 1000000000n);
  }
  static fromEpochMilliseconds(milliseconds) {
    return new Instant(BigInt(milliseconds) * 1000000n);
  }
  static fromEpochMicroseconds(microseconds) {
    return new Instant(BigInt(microseconds) * 1000n);
  }
  static fromEpochNanoseconds(nanoseconds) {
    return new Instant(BigInt(nanoseconds));
  }
  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid DateTime string');
    const year = +match[1];
    const month = +match[2];
    const day = +match[3];
    const hour = +match[4];
    const minute = +match[5];
    const second = match[6] === undefined ? 0 : +match[6];
    const millisecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(0, 3);
    const microsecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(3, 6);
    const nanosecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(6, 9);
    const ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    return Instant.fromEpochNanoseconds((BigInt(ms) * 1000000n) + BigInt(microsecond * 1000) + BigInt(nanosecond));
  }
  static compare(one, two) {
    if ('bigint' !== typeof one[DATA] && 'function' === typeof one.getInstant) one = one.getInstant();
    if ('bigint' !== typeof two[DATA] && 'function' === typeof two.getInstant) two = two.getInstant();
    assert.type(one, Instant);
    assert.type(two, Instant);
    return Number(one[DATA] - two[DATA]);
  }
}
