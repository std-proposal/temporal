#! /usr/bin/env -S node --experimental-modules

/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal, throws } = Assert;

import Temporal from '@std-proposal/temporal';
const { Absolute } = Temporal;

describe('Absolute', () => {
  describe('Structure', () => {
    it('Absolute is a Function', () => {
      equal(typeof Absolute, 'function');
    });
    it('Absolute has a prototype', () => {
      assert(Absolute.prototype);
      equal(typeof Absolute.prototype, 'object');
    });
    describe('Absolute.prototype', () => {
      it('Absolute.prototype has getEpochSeconds', () => {
        assert('getEpochSeconds' in Absolute.prototype);
      });
      it('Absolute.prototype has getEpochMilliseconds', () => {
        assert('getEpochMilliseconds' in Absolute.prototype);
      });
      it('Absolute.prototype has getEpochMicroseconds', () => {
        assert('getEpochMicroseconds' in Absolute.prototype);
      });
      it('Absolute.prototype has getEpochNanoseconds', () => {
        assert('getEpochNanoseconds' in Absolute.prototype);
      });
      it('Absolute.prototype.withZone is a Function', () => {
        equal(typeof Absolute.prototype.withZone, 'function');
      });
      it('Absolute.prototype.toString is a Function', () => {
        equal(typeof Absolute.prototype.toString, 'function');
      });
      it('Absolute.prototype.toJSON is a Function', () => {
        equal(typeof Absolute.prototype.toJSON, 'function');
      });
      it('Absolute.prototype has year', () => {
        assert('year' in Absolute.prototype);
      });
      it('Absolute.prototype has month', () => {
        assert('month' in Absolute.prototype);
      });
      it('Absolute.prototype has day', () => {
        assert('day' in Absolute.prototype);
      });
      it('Absolute.prototype has hour', () => {
        assert('hour' in Absolute.prototype);
      });
      it('Absolute.prototype has minute', () => {
        assert('minute' in Absolute.prototype);
      });
      it('Absolute.prototype has second', () => {
        assert('second' in Absolute.prototype);
      });
      it('Absolute.prototype has millisecond', () => {
        assert('millisecond' in Absolute.prototype);
      });
      it('Absolute.prototype has microsecond', () => {
        assert('microsecond' in Absolute.prototype);
      });
      it('Absolute.prototype has nanosecond', () => {
        assert('nanosecond' in Absolute.prototype);
      });
      it('Absolute.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in Absolute.prototype);
      });
      it('Absolute.prototype has dayOfYear', () => {
        assert('dayOfYear' in Absolute.prototype);
      });
      it('Absolute.prototype has weekOfYear', () => {
        assert('weekOfYear' in Absolute.prototype);
      });
      it('Absolute.prototype.with is a Function', () => {
        equal(typeof Absolute.prototype.with, 'function');
      });
      it('Absolute.prototype.getDateTime is a Function', () => {
        equal(typeof Absolute.prototype.getDateTime, 'function');
      });
      it('Absolute.prototype.getDate is a Function', () => {
        equal(typeof Absolute.prototype.getDate, 'function');
      });
      it('Absolute.prototype.getTime is a Function', () => {
        equal(typeof Absolute.prototype.getTime, 'function');
      });
      it('Absolute.prototype.getYearMonth is a Function', () => {
        equal(typeof Absolute.prototype.getYearMonth, 'function');
      });
      it('Absolute.prototype.getMonthDay is a Function', () => {
        equal(typeof Absolute.prototype.getMonthDay, 'function');
      });
    });
    it('Absolute.fromEpochSeconds is a Function', () => {
      equal(typeof Absolute.fromEpochSeconds, 'function');
    });
    it('Absolute.fromEpochMicroseconds is a Function', () => {
      equal(typeof Absolute.fromEpochMicroseconds, 'function');
    });
    it('Absolute.fromEpochMilliseconds is a Function', () => {
      equal(typeof Absolute.fromEpochMilliseconds, 'function');
    });
    it('Absolute.fromEpochNanoseconds is a Function', () => {
      equal(typeof Absolute.fromEpochNanoseconds, 'function');
    });
    it('Absolute.fromString is a Function', () => {
      equal(typeof Absolute.fromString, 'function');
    });
  });
  describe('Construction', () => {
    it('can construct', () => {
      const instant = new Absolute(BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789));
      assert(instant);
      equal(typeof instant, 'object');
      equal(instant.getEpochSeconds(), Math.floor(Date.UTC(1976, 10, 18, 14, 23, 30, 123) / 1e3), 'getEpochSeconds');
      equal(instant.getEpochMilliseconds(), Date.UTC(1976, 10, 18, 14, 23, 30, 123), 'getEpochMilliseconds');
    });
    it('throws on number', () => throws(() => new Absolute(1234)));
    it('throws on string', () => throws(() => new Absolute('1234')));
  });
  describe('absolute.toString() works', () => {
    it('`1976-11-18T14:23:30.123456789Z`.toString()', () => {
      const instant = new Absolute(BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789));
      assert(instant);
      equal(`${instant}`, '1976-11-18T14:23:30.123456789Z');
    });
    it('`1963-02-13T09:36:29.877456789Z`.toString()', () => {
      const instant = new Absolute(
        BigInt(-1) * (BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789))
      );
      assert(instant);
      equal(`${instant}`, '1963-02-13T09:36:29.877456789Z');
    });
  });
  describe('Absolute.fromEpochSeconds() works', () => {
    it('1976-11-18T15:23:30', () => {
      const epochSeconds = Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3);
      const instant = Absolute.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
    it('1963-02-13T09:36:29', () => {
      const epochSeconds = Math.floor(Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1e3);
      const instant = Absolute.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
  });
  describe('Absolute.fromEpochMilliseconds() works', () => {
    it('1976-11-18T15:23:30.123', () => {
      const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const instant = Absolute.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
    it('1963-02-13T09:36:29.123', () => {
      const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const instant = Absolute.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
  });
  describe('Absolute.fromEpochMicroseconds() works', () => {
    it('1976-11-18T15:23:30.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Absolute.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
    it('1963-02-13T09:36:29.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Absolute.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
  });
  describe('Absolute.fromEpochNanoseconds() works', () => {
    it('1976-11-18T15:23:30.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Absolute.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('1963-02-13T09:36:29.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Absolute.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
  });
  describe('Absolute.fromString() works', () => {
    it('1976-11-18T15:23Z', () => {
      equal(Absolute.fromString('1976-11-18T15:23Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23));
    });
    it('1976-11-18T15:23:30Z', () => {
      equal(Absolute.fromString('1976-11-18T15:23:30Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30));
    });
    it('1976-11-18T15:23:30.123Z', () => {
      equal(
        Absolute.fromString('1976-11-18T15:23:30.123Z').getEpochMilliseconds(),
        Date.UTC(1976, 10, 18, 15, 23, 30, 123)
      );
    });
    it('1976-11-18T15:23:30.123456Z', () => {
      equal(
        Absolute.fromString('1976-11-18T15:23:30.123456Z').getEpochMicroseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
      );
    });
    it('1976-11-18T15:23:30.123456789Z', () => {
      equal(
        Absolute.fromString('1976-11-18T15:23:30.123456789Z').getEpochNanoseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
