/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, TZ, OF, DT, assert, parseOffsetString, offsetString } from './shared.mjs';
import { DateTime } from './datetime.mjs';
import { UniqueMap } from './unimap.mjs';
import { ZONES } from './zones.mjs';
import { isOffset } from './shared.mjs';
import { Absolute } from './absolute.mjs';

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

  getTimezoneName(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  getDateTimeFor(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  getOffsetFor(instant) {
    throw new TypeError('TimeZone is an abstract class');
  }
  getAbsoluteFor(datetime) {
    throw new TypeError('TimeZone is an abstract class');
  }

  getOffsetsInYear(year) {
    throw new TypeError('TimeZone is an abstract class');
  }
  getTransitionsInYear(year) {
    throw new TypeError('TimeZone is an abstract class');
  }

  toString() {
    return this.name;
  }

  static for(name) {
    if (isOffset(name)) return OffsetZone.for(name);
    return IanaZone.for(name);
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
  getDateTimeFor(instant) {
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
  getOffsetFor(instant) {
    return this.name;
  }
  getAbsoluteFor(datetime) {
    const { year, month, day, hour, minute, second, millisecond, microsecond, nanosecond } = datetime;
    const ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond) + this[OFFSET];
    const ns = BigInt(ms) * 1000000n + BigInt(microsecond * 1000) + BigInt(nanosecond);
    return [new Absolute(ns, this.name)];
  }

  getOffsetsInYear(year) {
    return [this.offset];
  }
  getTransitionsInYear(year) {
    return [];
  }

  static for(offset) {
    const name = offsetString(offset);
    const zone = Object.create(OffsetZone.prototype, { [NAME]: { value: name }, [OFFSET]: { value: offset } });
    return zone;
  }
}
OffsetZone.prototype[Symbol.toStringTag] = 'TimeZone';

class IanaZone extends TimeZone {
  constructor() {
    throw new TypeError('TimeZone is not a constructor');
  }
  getTimezoneName(instant, format = 'short') {
    assert.type(instant, Absolute);
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
  getDateTimeFor(instant) {
    assert.type(instant, Absolute);
    const epochNanoSeconds = instant[DATA];
    const ms = Number(epochNanoSeconds / 1000000n);
    const microsecond = (epochNanoSeconds < 0n) ? Math.abs(Number((epochNanoSeconds / 1000n) % 1000n)) : Number((epochNanoSeconds / 1000n) % 1000n);
    const nanosecond = (epochNanoSeconds < 0n) ? Math.abs(Number(epochNanoSeconds % 1000n)) : Number(epochNanoSeconds % 1000n);
    const { year, month, day, hour, minute, second, millisecond } = timeparts.call(this, ms);
    return new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
  }
  getOffsetFor(instant) {
    assert.type(instant, Absolute);
    const epochNanoSeconds = instant[DATA];
    const { offset } = timeparts.call(this, Number(epochNanoSeconds / 1000000n));
    return offset;
  }
  getAbsoluteFor(datetime) {
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
        return Object.create(Absolute.prototype, {
          [DATA]: { value: ns, configurable: true, writable: true },
          [TZ]: { value: this, configurable: true, writable: true },
          [DT]: { value: datetime, configurable: true, writable: true },
          [OF]: { value: offsetString(offset), configurable: true, writable: true }
        });
      })
      .filter((x) => !!x)
      .sort((a, b) => {
        return Number(a[DATA] - b[DATA]);
      });
  }
  getOffsetsInYear(year) {
    const off = offsets.call(this, year);
    return off.map(offsetString);
  }
  getTransitionsInYear(year) {
    const start = this.getAbsoluteFor(new DateTime(year, 1, 1, 0, 0)).shift();
    const end = this.getAbsoluteFor(new DateTime(year, 12, 31, 23, 59, 59, 999, 999, 999)).pop();
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
        trans.push(new Absolute(BigInt(epochMillis) * 1000000n), this.name);
      }
    });
    return trans;
  }
  static for(timeZone) {
    let formatters = cache.get(timeZone);
    if (!formatters) {
      const long = new Intl.DateTimeFormat(
        'en-iso',
        Object.assign({ timeZone: timeZone, timeZoneName: 'long' }, FormatterOptions)
      );
      const short = new Intl.DateTimeFormat(
        'en-iso',
        Object.assign({ timeZone: timeZone, timeZoneName: 'short' }, FormatterOptions)
      );
      timeZone = long.resolvedOptions().timeZone;
      formatters = { long, short };
      cache.set(timeZone, formatters);
    }

    const { long, short } = formatters;
    const zone = Object.create(IanaZone.prototype, {
      [NAME]: { value: timeZone },
      [LONG]: { value: long },
      [SHORT]: { value: short }
    });
    return zone;
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
  const millisecond = (ms < 0) ? (1000 + ms % 1000) : (ms % 1000);
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
