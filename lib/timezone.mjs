import { DATA, assert, parseOffsetString, offsetString } from './shared.mjs';
import { DateTime } from './datetime.mjs';
import { Instant } from './instant.mjs';
import { UniqueMap } from './unimap.mjs';
import { ZONES } from './zones.mjs';

const NAME = Symbol('name');
const LONG = Symbol('formatter');
const SHORT = Symbol('formatter');
const OFFSET = Symbol('offset');

const FormatterOptions = {
  hour12: false,
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
};

const TRANSSEGMENTS = 27;

const cache = new UniqueMap();

export class TimeZone {
  constructor() {
    throw new TypeError('TimeZone is not a constructor');
  }
  get name() {
    return this[NAME];
  }

  zoneName(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  dateTime(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  offset(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  instants(datetime) {
    throw new TypeError('TimeZone is an abstract class');
  }

  offsets(year) {
    throw new TypeError('TimeZone is an abstract class');
  }
  transitions(year) {
    throw new TypeError('TimeZone is an abstract class');
  }

  toString() {
    return this.name;
  }

  static for(name) {
    if (cache.has(name)) return cache.get(name);
    const offset = parseOffsetString(name);
    if (offset !== undefined) {
      const name = offsetString(offset);
      if (cache.has(name)) return cache.get(name);
      const zone = Object.create(OffsetZone.prototype, { [NAME]: { value: name }, [OFFSET]: { value: offset } });
      cache.set(offset, zone);
      return zone;
    } else {
      const long = new Intl.DateTimeFormat(
        'en-iso',
        Object.assign({ timeZone: name, timeZoneName: 'long' }, FormatterOptions)
      );
      const { timeZone } = long.resolvedOptions();
      if (cache.has(timeZone)) return cache.get(timeZone);
      const short = new Intl.DateTimeFormat(
        'en-iso',
        Object.assign({ timeZone: name, timeZoneName: 'short' }, FormatterOptions)
      );
      const zone = Object.create(IanaZone.prototype, {
        [NAME]: { value: timeZone },
        [LONG]: { value: long },
        [SHORT]: { value: short }
      });
      cache.set(timeZone, zone);
      return zone;
    }
  }
  static list() {
    return ZONES.map((name) => {
      try {
        const zone = TimeZone.for(name);
        return zone.name;
      } catch (err) {
        // Ignore
      }
    }).filter((z) => !!z);
  }
}

class OffsetZone extends TimeZone {
  constructor() {
    throw new TypeError('TimeZone is not a constructor');
  }
  zoneName(instant) {
    return this.name;
  }
  dateTime(instant) {
    const ns = instant[DATA] - BigInt(this[OFFSET]) * 1000000n;
    const dt = new Date(Number(ns / 1000000n));

    const year = dt.getUTCFullYear();
    const month = dt.getUTCMonth() + 1;
    const day = dt.getUTCDate();
    const hour = dt.getUTCHours();
    const minute = dt.getUTCMinutes();
    const second = dt.getUTCSeconds();
    const millisecond = dt.getUTCMilliseconds();
    const microsecond = Number((ns / 1000n) % 1000n);
    const nanosecond = Number(ns % 1000n);

    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  offset(instant) {
    return this.name;
  }
  instants(datetime) {
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = datetime;
    const ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) + this[OFFSET];
    const ns = BigInt(ms) * 1000000n + BigInt(microsecond * 1000) + BigInt(nanosecond);
    return [new Instant(ns)];
  }

  offsets(year) {
    return [this.offset];
  }
  transitions(year) {
    return [];
  }
}
OffsetZone.prototype[Symbol.toStringTag] = 'TimeZone';

class IanaZone extends TimeZone {
  constructor() {
    throw new TypeError('TimeZone is not a constructor');
  }
  zoneName(instant, format = 'short') {
    assert.type(instant, Instant);
    assert.enum(format, 'short', 'long');
    const epochNanoSeconds = instant[DATA];
    const fmt = this[format === 'long' ? LONG : SHORT];
    const { timeZoneName } = fmt.formatToParts(Number(epochNanoSeconds / 1000000n)).reduce((res, item) => {
      if (item.type !== 'literal')
        res[item.type] = item.type === 'timeZoneName' ? item.value : parseInt(item.value, 10);
      return res;
    }, {});
    return timeZoneName;
  }
  dateTime(instant) {
    assert.type(instant, Instant);
    const epochNanoSeconds = instant[DATA];
    const ms = Number(epochNanoSeconds / 1000000n);
    const microsecond = Number((epochNanoSeconds / 1000n) % 1000n);
    const nanosecond = Number(epochNanoSeconds % 1000n);
    const { year, month, day, hour, minute, second, millisecond } = timeparts.call(this, ms);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  offset(instant) {
    assert.type(instant, Instant);
    const epochNanoSeconds = instant[DATA];
    const { offset } = timeparts.call(this, Number(epochNanoSeconds / 1000000n));
    return offset;
  }
  instants(datetime) {
    assert.type(datetime, DateTime);
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = datetime;
    const base = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
    return offsets
      .call(this, year)
      .sort()
      .map((offset) => {
        const ms = base - offset;
        const info = timeparts.call(this, ms);
        if (info.hour !== hour) return undefined;
        if (info.year !== year) return undefined;
        if (info.month !== month) return undefined;
        if (info.day !== day) return undefined;
        if (info.minute !== minute) return undefined;
        if (info.second !== second) return undefined;
        const ns = BigInt(ms) * 1000000n + BigInt(microsecond) * 1000n + BigInt(nanosecond);
        return new Instant(ns);
      })
      .filter((x) => !!x)
      .sort((a, b) => {
        if (a[DATA] !== b[DATA]) a[DATA] - b[DATA];
        return Number(a[DATA] - b[DATA]);
      });
  }
  offsets(year) {
    const off = offsets.call(this, year);
    return off.map(offsetString);
  }
  transitions(year) {
    const start = this.instants(new DateTime(year, 1, 1, 0, 0)).shift();
    const end = this.instants(new DateTime(year, 12, 31, 23, 59, 59, 999, 999, 999)).pop();
    const length = end[DATA] - start[DATA];
    const points = new Array(TRANSSEGMENTS)
      .fill(0)
      .map((_, idx) => Number((start[DATA] + BigInt(idx) * (length / BigInt(TRANSSEGMENTS))) / 1000000n));
    points.push(Number(end[DATA] / 1000000n));
    const trans = [];
    const getOffset = (value) => {
      const { offset } = timeparts.call(this, value);
      return offset;
    };
    points.forEach((right, idx) => {
      if (!idx) return;
      const left = points[idx - 1];
      const offset = getOffset(right);
      if (getOffset(left) !== offset) {
        const epochMillis = bisect(getOffset, left, right);
        trans.push(new Instant(BigInt(epochMillis) * 1000000n));
      }
    });
    return trans;
  }
}
IanaZone.prototype[Symbol.toStringTag] = 'TimeZone';

function timeparts(ms) {
  const { year, month, day, hour, minute, second, timeZoneName: timeZoneLong } = this[LONG].formatToParts(ms).reduce(
    (res, item) => {
      if (item.type !== 'literal')
        res[item.type] = item.type === 'timeZoneName' ? item.value : parseInt(item.value, 10);
      return res;
    },
    {}
  );
  const { timeZoneName: timeZoneShort } = this[SHORT].formatToParts(ms).reduce((res, item) => {
    if (item.type !== 'literal') res[item.type] = item.type === 'timeZoneName' ? item.value : parseInt(item.value, 10);
    return res;
  }, {});
  const millisecond = ms % 1000;
  const offsetMilliseconds = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - ms;
  const offset = offsetString(offsetMilliseconds);
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    offset,
    offsetMilliseconds,
    timeZoneLong,
    timeZoneShort
  };
}
function offsets(year) {
  const base = new Date(year, 0, 2, 9);
  const res = new Set();
  new Array(12).fill(0).forEach((_, month) => {
    base.setMonth(month);
    const { offsetMilliseconds } = timeparts.call(this, base.getTime());
    res.add(offsetMilliseconds);
  });
  return Array.from(res);
}

function bisect(getState, left, right, lstate = getState(left), rstate = getState(right)) {
  if (right - left < 2) return right;
  let middle = Math.ceil((left + right) / 2);
  if (middle === right) middle -= 1;
  const mstate = getState(middle);
  if (mstate === lstate) return bisect(getState, middle, right, mstate, rstate);
  if (mstate === rstate) return bisect(getState, left, middle, lstate, mstate);
  throw new Error('invalid state in bisection');
}
