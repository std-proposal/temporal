#! /usr/bin/env -S node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import Temporal from '@std-proposal/temporal';
const { Instant, ZonedDateTime } = Temporal;

describe('ZonedDateTime', () => {
  describe('Structure', () => {
    it('ZonedDateTime is a Function', () => {
      equal(typeof ZonedDateTime, 'function');
    });
    it('ZonedDateTime has a prototype', () => {
      assert(ZonedDateTime.prototype);
      equal(typeof ZonedDateTime.prototype, 'object');
    });
    describe('ZonedDateTime.prototype', () => {
      it('ZonedDateTime.prototype has year', () => {
        assert('year' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has month', () => {
        assert('month' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has day', () => {
        assert('day' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has hour', () => {
        assert('hour' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has minute', () => {
        assert('minute' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has second', () => {
        assert('second' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has millisecond', () => {
        assert('millisecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has microsecond', () => {
        assert('microsecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has nanosecond', () => {
        assert('nanosecond' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has dayOfYear', () => {
        assert('dayOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype has weekOfYear', () => {
        assert('weekOfYear' in ZonedDateTime.prototype);
      });
      it('ZonedDateTime.prototype.with is a Function', () => {
        equal(typeof ZonedDateTime.prototype.with, 'function');
      });
      it('ZonedDateTime.prototype.getDateTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getDateTime, 'function');
      });
      it('ZonedDateTime.prototype.getDate is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getDate, 'function');
      });
      it('ZonedDateTime.prototype.getTime is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getTime, 'function');
      });
      it('ZonedDateTime.prototype.getYearMonth is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getYearMonth, 'function');
      });
      it('ZonedDateTime.prototype.getMonthDay is a Function', () => {
        equal(typeof ZonedDateTime.prototype.getMonthDay, 'function');
      });
      it('ZonedDateTime.prototype.toString is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toString, 'function');
      });
      it('ZonedDateTime.prototype.toJSON is a Function', () => {
        equal(typeof ZonedDateTime.prototype.toJSON, 'function');
      });
    });
    it('ZonedDateTime.fromString is a Function', () => {
      equal(typeof ZonedDateTime.fromString, 'function');
    });
  });
  describe('Construction', () => {
    describe('new ZonedDateTime(Instant.fromString("1976-11-18T14:23:30.123456789Z"), "Europe/Vienna")', () => {
      let offsetdatetime;
      it('offsetdatetime can be constructed', () => {
        offsetdatetime = new ZonedDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), 'Europe/Vienna');
        assert(offsetdatetime);
        equal(typeof offsetdatetime, 'object');
      });
      it('offsetdatetime.year is 1976', () => equal(offsetdatetime.year, 1976));
      it('offsetdatetime.month is 11', () => equal(offsetdatetime.month, 11));
      it('offsetdatetime.day is 18', () => equal(offsetdatetime.day, 18));
      it('offsetdatetime.hour is 15', () => equal(offsetdatetime.hour, 15));
      it('offsetdatetime.minute is 23', () => equal(offsetdatetime.minute, 23));
      it('offsetdatetime.second is 30', () => equal(offsetdatetime.second, 30));
      it('offsetdatetime.millisecond is 123', () => equal(offsetdatetime.millisecond, 123));
      it('offsetdatetime.microsecond is 456', () => equal(offsetdatetime.microsecond, 456));
      it('offsetdatetime.nanosecond is 789', () => equal(offsetdatetime.nanosecond, 789));
      it('offsetdatetime.dayOfWeek is 4', () => equal(offsetdatetime.dayOfWeek, 4));
      it('offsetdatetime.dayOfYear is 323', () => equal(offsetdatetime.dayOfYear, 323));
      it('offsetdatetime.weekOfYear is 47', () => equal(offsetdatetime.weekOfYear, 47));
      it('`${offsetdatetime}` is 1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]', () =>
        equal(`${offsetdatetime}`, '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]'));
    });
  });
  describe('.with manipulation', () => {
    const offsetdatetime = new ZonedDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), 'Europe/Vienna');
    it('offsetdatetime.with({ year: 2019 } works', () => {
      equal(`${offsetdatetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ month: 5 } works', () => {
      equal(`${offsetdatetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ day: 5 } works', () => {
      equal(`${offsetdatetime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ hour: 5 } works', () => {
      equal(`${offsetdatetime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ minute: 5 } works', () => {
      equal(`${offsetdatetime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ second: 5 } works', () => {
      equal(`${offsetdatetime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ millisecond: 5 } works', () => {
      equal(`${offsetdatetime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ microsecond: 5 } works', () => {
      equal(`${offsetdatetime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ nanosecond: 5 } works', () => {
      equal(`${offsetdatetime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005+01:00[Europe/Vienna]');
    });
    it('offsetdatetime.with({ month: 5, second: 15 } works', () => {
      equal(`${offsetdatetime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789+01:00[Europe/Vienna]');
    });
  });
  describe('ZonedDateTime.get{Date,DateTime,Time} works', () => {
    const offsetdatetime = new ZonedDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), 'Europe/Vienna');
    it('offsetdatetime.getDateTime()', () => {
      equal(`${offsetdatetime.getDateTime()}`, '1976-11-18T15:23:30.123456789');
    });
    it('offsetdatetime.getDate()', () => {
      equal(`${offsetdatetime.getDate()}`, '1976-11-18');
    });
    it('offsetdatetime.getTime()', () => {
      equal(`${offsetdatetime.getTime()}`, '15:23:30.123456789');
    });
  });
  describe('ZonedDateTime.fromString() works', () => {
    it('ZonedDateTime.fromString("1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]")', () => {
      equal(
        `${ZonedDateTime.fromString('1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]')}`,
        '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]'
      );
    });
    it('ZonedDateTime.fromString("1976-11-18T15:23:30.123456+01:00[Europe/Vienna]")', () => {
      equal(
        `${ZonedDateTime.fromString('1976-11-18T15:23:30.123456+01:00[Europe/Vienna]')}`,
        '1976-11-18T15:23:30.123456+01:00[Europe/Vienna]'
      );
    });
    it('ZonedDateTime.fromString("1976-11-18T15:23:30.123+01:00[Europe/Vienna]")', () => {
      equal(
        `${ZonedDateTime.fromString('1976-11-18T15:23:30.123+01:00[Europe/Vienna]')}`,
        '1976-11-18T15:23:30.123+01:00[Europe/Vienna]'
      );
    });
    it('ZonedDateTime.fromString("1976-11-18T15:23:30+01:00[Europe/Vienna]")', () => {
      equal(
        `${ZonedDateTime.fromString('1976-11-18T15:23:30+01:00[Europe/Vienna]')}`,
        '1976-11-18T15:23:30+01:00[Europe/Vienna]'
      );
    });
    it('ZonedDateTime.fromString("1976-11-18T15:23+01:00[Europe/Vienna]")', () => {
      equal(
        `${ZonedDateTime.fromString('1976-11-18T15:23+01:00[Europe/Vienna]')}`,
        '1976-11-18T15:23:00+01:00[Europe/Vienna]'
      );
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
