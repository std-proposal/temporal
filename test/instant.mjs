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
const { Instant } = Temporal;

describe('Instant', () => {
  describe('Structure', () => {
    it('Instant is a Function', () => {
      equal(typeof Instant, 'function');
    });
    it('Instant has a prototype', () => {
      assert(Instant.prototype);
      equal(typeof Instant.prototype, 'object');
    });
    describe('Instant.prototype', () => {
      it('Instant.prototype has getEpochSeconds', () => {
        assert('getEpochSeconds' in Instant.prototype);
      });
      it('Instant.prototype has getEpochMilliseconds', () => {
        assert('getEpochMilliseconds' in Instant.prototype);
      });
      it('Instant.prototype has getEpochMicroseconds', () => {
        assert('getEpochMicroseconds' in Instant.prototype);
      });
      it('Instant.prototype has getEpochNanoseconds', () => {
        assert('getEpochNanoseconds' in Instant.prototype);
      });
      it('Instant.prototype.withZone is a Function', () => {
        equal(typeof Instant.prototype.withZone, 'function');
      });
      it('Instant.prototype.toString is a Function', () => {
        equal(typeof Instant.prototype.toString, 'function');
      });
      it('Instant.prototype.toJSON is a Function', () => {
        equal(typeof Instant.prototype.toJSON, 'function');
      });
    });
    it('Instant.fromEpochSeconds is a Function', () => {
      equal(typeof Instant.fromEpochSeconds, 'function');
    });
    it('Instant.fromEpochMicroseconds is a Function', () => {
      equal(typeof Instant.fromEpochMicroseconds, 'function');
    });
    it('Instant.fromEpochMilliseconds is a Function', () => {
      equal(typeof Instant.fromEpochMilliseconds, 'function');
    });
    it('Instant.fromEpochNanoseconds is a Function', () => {
      equal(typeof Instant.fromEpochNanoseconds, 'function');
    });
    it('Instant.fromString is a Function', () => {
      equal(typeof Instant.fromString, 'function');
    });
  });
  describe('Construction', () => {
    it('can construct', () => {
      const instant = new Instant(BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789));
      assert(instant);
      equal(typeof instant, 'object');
      equal(instant.getEpochSeconds(), Math.floor(Date.UTC(1976, 10, 18, 14, 23, 30, 123) / 1e3), 'getEpochSeconds');
      equal(instant.getEpochMilliseconds(), Date.UTC(1976, 10, 18, 14, 23, 30, 123), 'getEpochMilliseconds');
    });
    it('throws on number', () => throws(() => new Instant(1234)));
    it('throws on string', () => throws(() => new Instant('1234')));
  });
  describe('instant.toString() works', () => {
    it('`1976-11-18T14:23:30.123456789Z`.toString()', () => {
      const instant = new Instant(BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789));
      assert(instant);
      equal(`${instant}`, '1976-11-18T14:23:30.123456789Z');
    });
    it('`1963-02-13T09:36:29.877456789Z`.toString()', () => {
      const instant = new Instant(
        BigInt(-1) * (BigInt(Date.UTC(1976, 10, 18, 14, 23, 30, 123)) * BigInt(1e6) + BigInt(456789))
      );
      assert(instant);
      equal(`${instant}`, '1963-02-13T09:36:29.877456789Z');
    });
  });
  describe('Instant.fromEpochSeconds() works', () => {
    it('1976-11-18T15:23:30', () => {
      const epochSeconds = Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 123) / 1e3);
      const instant = Instant.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
    it('1963-02-13T09:36:29', () => {
      const epochSeconds = Math.floor(Date.UTC(1963, 1, 13, 9, 36, 29, 123) / 1e3);
      const instant = Instant.fromEpochSeconds(epochSeconds);
      equal(instant.getEpochSeconds(), epochSeconds);
    });
  });
  describe('Instant.fromEpochMilliseconds() works', () => {
    it('1976-11-18T15:23:30.123', () => {
      const epochMilliseconds = Date.UTC(1976, 10, 18, 15, 23, 30, 123);
      const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
    it('1963-02-13T09:36:29.123', () => {
      const epochMilliseconds = Date.UTC(1963, 1, 13, 9, 36, 29, 123);
      const instant = Instant.fromEpochMilliseconds(epochMilliseconds);
      equal(instant.getEpochMilliseconds(), epochMilliseconds);
    });
  });
  describe('Instant.fromEpochMicroseconds() works', () => {
    it('1976-11-18T15:23:30.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
    it('1963-02-13T09:36:29.123456', () => {
      const epochMicroseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e3) + BigInt(456);
      const instant = Instant.fromEpochMicroseconds(epochMicroseconds);
      equal(instant.getEpochMicroseconds(), epochMicroseconds);
    });
  });
  describe('Instant.fromEpochNanoseconds() works', () => {
    it('1976-11-18T15:23:30.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
    it('1963-02-13T09:36:29.123456789', () => {
      const epochNanoseconds = BigInt(Date.UTC(1963, 1, 13, 9, 36, 29, 123)) * BigInt(1e6) + BigInt(456789);
      const instant = Instant.fromEpochNanoseconds(epochNanoseconds);
      equal(instant.getEpochNanoseconds(), epochNanoseconds);
    });
  });
  describe('Instant.fromString() works', () => {
    it('1976-11-18T15:23Z', () => {
      equal(Instant.fromString('1976-11-18T15:23Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23));
    });
    it('1976-11-18T15:23:30Z', () => {
      equal(Instant.fromString('1976-11-18T15:23:30Z').getEpochMilliseconds(), Date.UTC(1976, 10, 18, 15, 23, 30));
    });
    it('1976-11-18T15:23:30.123Z', () => {
      equal(
        Instant.fromString('1976-11-18T15:23:30.123Z').getEpochMilliseconds(),
        Date.UTC(1976, 10, 18, 15, 23, 30, 123)
      );
    });
    it('1976-11-18T15:23:30.123456Z', () => {
      equal(
        Instant.fromString('1976-11-18T15:23:30.123456Z').getEpochMicroseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e3) + BigInt(456)
      );
    });
    it('1976-11-18T15:23:30.123456789Z', () => {
      equal(
        Instant.fromString('1976-11-18T15:23:30.123456789Z').getEpochNanoseconds(),
        BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123)) * BigInt(1e6) + BigInt(456789)
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
