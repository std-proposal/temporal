
import { TimeZone } from './timezone.mjs';
import { REGEX } from './shared.mjs';
import { DateTime } from './datetime.mjs';
import { assert } from './shared.mjs';
import { cast as castDuration } from './duration.mjs';

const RE = new RegExp(`^${REGEX.DATETIME.source}(?:Z|(${REGEX.TZOFF.source})(?:${REGEX.TIMEZONE.source})?)$`);

export class Absolute {
  #ens = 0n;
  constructor(epochNanoseconds) {
    if ('bigint' !== typeof epochNanoseconds) throw new TypeError('expected epoch-nanoseconds as a bigint');
    this.#ens = BigInt(epochNanoseconds);
  }

  getDateTime(tz = 'UTC') { return TimeZone.for(`${tz}`).getDateTimeFor(this); }
  getDate(tz) { return this.getDateTime(tz).getDate(); }
  getTime(tz) { return this.getDateTime(tz).getTime(); }
  getYearMonth(tz) { return this.getDateTime(tz).getYearMonth(); }
  getMonthDay(tz) { return this.getDateTime(tz).getMonthDay(); }

  getEpochSeconds() {
    return Number(this.getEpochNanoseconds() / 1000000000n);
  }
  getEpochMilliseconds() {
    return Number(this.getEpochNanoseconds() / 1000000n);
  }
  getEpochMicroseconds() {
    return this.getEpochNanoseconds() / 1000n;
  }
  getEpochNanoseconds() {
    return this.#ens;
  }

  toString(timeZone = 'UTC') {
    timeZone = TimeZone.for(`${timeZone}`);
    const dateTime = this.getDateTime(timeZone);
    const offset = timeZone.getOffsetFor(this);
    const tzname = timeZone.name;
    const zone = tzname === 'UTC' ? 'Z' : ((offset === tzname) ? `${offset}` : `${offset}[${tzname}]`);
    return `${dateTime}${zone}`;
  }
  toJSON() {
    return this.toString();
  }

  difference(other) {
    assert.type(other, Absolute);
    const one = this.getEpochNanoseconds() <= other.getEpochNanoseconds() ? this.getEpochNanoseconds() : other.getEpochNanoseconds();
    const two = this.getEpochNanoseconds() <= other.getEpochNanoseconds() ? other.getEpochNanoseconds() : this.getEpochNanoseconds();
    let diff = two - one;

    const nanoseconds = Number((diff / 1n) % 1000n);
    const microseconds = Number((diff / 1000n) % 1000n);
    const milliseconds = Number((diff / 1000000n) % 1000n);
    const seconds = Number((diff / 1000000000n) % 60n);
    const minutes = Number((diff / 60000000000n) % 60n);
    const hours = Number((diff / 3600000000000n));

    return castDuration({ hours, minutes, seconds, milliseconds, microseconds, nanoseconds });
  }
  plus(duration) {
    duration = castDuration(duration);

    let inter = this;

    if (duration.years || duration.months) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    let nanos = inter.getEpochNanoseconds();
    nanos += BigInt(duration.nanoseconds || 0);
    nanos += BigInt(duration.microseconds || 0) * 1000n;
    nanos += BigInt(duration.milliseconds || 0) * 1000000n;
    nanos += BigInt(duration.seconds || 0) * 1000000000n;
    nanos += BigInt(duration.minutes || 0) * 60000000000n;
    nanos += BigInt(duration.hours || 0) * 3600000000000n;
    nanos += BigInt(duration.days || 0) * 86400000000000n;

    return new Absolute(nanos); 
  }
  minus(duration) {
    duration = castDuration(duration);
    if (duration.years || duration.months) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    let nanos = this.getEpochNanoseconds();
    nanos -= BigInt(duration.nanoseconds || 0);
    nanos -= BigInt(duration.microseconds || 0) * 1000n;
    nanos -= BigInt(duration.milliseconds || 0) * 1000000n;
    nanos -= BigInt(duration.seconds || 0) * 1000000000n;
    nanos -= BigInt(duration.minutes || 0) * 60000000000n;
    nanos -= BigInt(duration.hours || 0) * 3600000000000n;
    nanos -= BigInt(duration.days || 0) * 86400000000000n;

    return new Absolute(nanos);
  }

  static fromEpochSeconds(seconds) {
    return new Absolute(BigInt(seconds) * 1000000000n);
  }
  static fromEpochMilliseconds(milliseconds) {
    return new Absolute(BigInt(milliseconds) * 1000000n);
  }
  static fromEpochMicroseconds(microseconds) {
    return new Absolute(BigInt(microseconds) * 1000n);
  }
  static fromEpochNanoseconds(nanoseconds) {
    return new Absolute(BigInt(nanoseconds));
  }
  static fromString(iso) {
    const match = RE.exec(iso);
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

    const dt = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const tz = match[9] || match[8] || 'UTC';
    const off = match[8] || '+00:00';

    const timeZone = TimeZone.for(tz);
    const options = timeZone.getAbsoluteFor(dt);
    const absolute = options.find((a)=>(timeZone.getOffsetFor(a)===off));

    if (!absolute) throw new TypeError(`invalid date-time values`);
    return absolute;
  }
  static compare(one, two) {
    assert.bigint(one.getEpochNanoseconds());
    assert.bigint(two.getEpochNanoseconds());
    return Number(two.getEpochNanoseconds() - one.getEpochNanoseconds());
  }
}
