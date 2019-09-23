
import { DATA, TZ, OF, DT } from './shared.mjs';
import { TimeZone } from './timezone.mjs';
import { REGEX } from './shared.mjs';
import { DateTime } from './datetime.mjs';
import { assert } from './shared.mjs';
import { cast as castDuration } from './duration.mjs';
import { balanceMinus, balancePlus, EARLIER, LATER } from './shared.mjs';
import { copyProps } from './shared.mjs';

const RE = new RegExp(`^${REGEX.DATETIME.source}(?:Z|(${REGEX.TZOFF.source})(?:${REGEX.TIMEZONE.source})?)$`);

export class Absolute {
  constructor(epochNanoseconds, timeZone = 'UTC') {
    assert.bigint(epochNanoseconds);
    this[TZ] = TimeZone.for(timeZone);
    this[DATA] = BigInt(epochNanoseconds);
  }
  get year() { return this.getDateTime().year; }
  get month() { return this.getDateTime().month; }
  get day() { return this.getDateTime().day; }
  get hour() { return this.getDateTime().hour; }
  get minute() { return this.getDateTime().minute; }
  get second() { return this.getDateTime().second; }
  get millisecond() { return this.getDateTime().millisecond; }
  get microsecond() { return this.getDateTime().microsecond; }
  get nanosecond() { return this.getDateTime().nanosecond; }
  get year() { return this.getDateTime().year; }
  get dayOfWeek() { return this.getDateTime().dayOfWeek; }
  get dayOfYear() { return this.getDateTime().dayOfYear; }
  get weekOfYear() { return this.getDateTime().weekOfYear; }
  get timeZone() { return this[TZ]; }
  get offset() { return (this[OF] = this[OF] || this.timeZone.getOffsetFor(this)); }

  getDateTime() { return (this[DT] = this[DT] || this.timeZone.getDateTimeFor(this)); }
  getDate() { return this.getDateTime().getDate(); }
  getTime() { return this.getDateTime().getTime(); }
  getYearMonth() { return this.getDateTime().getYearMonth(); }
  getMonthDay() { return this.getDateTime().getMonthDay(); }

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
      const dateTime = this.getDateTime();
      const timeZone = this.timeZone.name;
      const offset = this.offset;

      const date = dateTime.toString();
      switch(true) {
        case 'UTC' === timeZone: return `${date}Z`;
        case timeZone === offset: return `${date}${offset}`;
        default: return `${date}${offset}[${timeZone}]`;
      }
  }
  toJSON() {
    return this.toString();
  }

  withZone(tz = 'UTC') {
    return Object.create(Absolute.prototype, {
      [DATA]: { value: this[DATA], configurable: true, writable: true },
      [TZ]: { value: TimeZone.for(`${tz}`), configurable: true, writable: true },
    });
  }
  with(data = {}, choice = EARLIER) {
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = copyProps(this, data);
    const timeZone = this.timeZone;
    const dateTime = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

    const instants = timeZone.getAbsoluteFor(dateTime);
    let instant;
    switch (choice) {
      case EARLIER:
        instant = instants.shift();
        break;
      case LATER:
        instant = instants.pop();
        break;
      default:
        instant = instant.find((instant) => (instant.offset === choice));
        break;
    }
    if (!instant) throw TypeError('invalid DateTime data for TimeZone');

    return instant;
  }

  difference(other) {
    assert.type(other, Absolute);
    const one = this[DATA] <= other[DATA] ? this[DATA] : other[DATA];
    const two = this[DATA] <= other[DATA] ? other[DATA] : this[DATA];
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

    if (duration.years || duration.months || duration.days) {
      const { year, month, day } = this;
      const data = { year, month, day };

      data.year += duration.years;
      balancePlus(data);

      data.month += duration.months;
      balancePlus(data, true);

      data.day += duration.days;
      balancePlus(data);
      inter = this.with(data, EARLIER);
    }

    let nanos = inter[DATA];
    nanos += BigInt(duration.nanoseconds || 0);
    nanos += BigInt(duration.microseconds || 0) * 1000n;
    nanos += BigInt(duration.milliseconds || 0) * 1000000n;
    nanos += BigInt(duration.seconds || 0) * 1000000000n;
    nanos += BigInt(duration.minutes || 0) * 60000000000n;
    nanos += BigInt(duration.hours || 0) * 3600000000000n;

    return new Absolute(nanos, this.timeZone); 
  }
  minus(duration) {
    duration = castDuration(duration);

    let nanos = this[DATA];
    nanos -= BigInt(duration.nanoseconds || 0);
    nanos -= BigInt(duration.microseconds || 0) * 1000n;
    nanos -= BigInt(duration.milliseconds || 0) * 1000000n;
    nanos -= BigInt(duration.seconds || 0) * 1000000000n;
    nanos -= BigInt(duration.minutes || 0) * 60000000000n;
    nanos -= BigInt(duration.hours || 0) * 3600000000000n;

    let inter = (this[DATA] === nanos) ? this : new Absolute(nanos, this.timeZone);
    if (!duration.years && !duration.months && !duration.days) return inter;

    const data = { year: inter.year, month: inter.month, day: inter.day };
    data.day -= duration.days;
    balanceMinus(data);
    data.month -= duration.months || 0;
    balanceMinus(data, true);
    data.year -= duration.years || 0;
    balanceMinus(data);

    inter = inter.with(data, LATER);
    return inter;
  }

  static fromEpochSeconds(seconds, timeZone = 'UTC') {
    return new Absolute(BigInt(seconds) * 1000000000n, timeZone);
  }
  static fromEpochMilliseconds(milliseconds, timeZone = 'UTC') {
    return new Absolute(BigInt(milliseconds) * 1000000n, timeZone);
  }
  static fromEpochMicroseconds(microseconds, timeZone = 'UTC') {
    return new Absolute(BigInt(microseconds) * 1000n, timeZone);
  }
  static fromEpochNanoseconds(nanoseconds, timeZone = 'UTC') {
    return new Absolute(BigInt(nanoseconds), timeZone);
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
    const absolute = options.find((a)=>(a.offset===off));

    if (!absolute) throw new TypeError('invalid date-time values');
    return absolute;
  }
  static compare(one, two) {
    assert.bigint(one[DATA]);
    assert.bigint(two[DATA]);
    return Number(two[DATA] - one[DATA]);
  }
}
