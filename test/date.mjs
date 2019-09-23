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
const { ok: assert, equal } = Assert;

import Temporal from '@std-proposal/temporal';
const { Date } = Temporal;

describe('Date', () => {
  describe('Structure', () => {
    it('Date is a Function', () => {
      equal(typeof Date, 'function');
    });
    it('Date has a prototype', () => {
      assert(Date.prototype);
      equal(typeof Date.prototype, 'object');
    });
    describe('Date.prototype', () => {
      it('Date.prototype has year', () => {
        assert('year' in Date.prototype);
      });
      it('Date.prototype has month', () => {
        assert('month' in Date.prototype);
      });
      it('Date.prototype has day', () => {
        assert('day' in Date.prototype);
      });
      it('Date.prototype has dayOfWeek', () => {
        assert('dayOfWeek' in Date.prototype);
      });
      it('Date.prototype has dayOfYear', () => {
        assert('dayOfYear' in Date.prototype);
      });
      it('Date.prototype has weekOfYear', () => {
        assert('weekOfYear' in Date.prototype);
      });
      it('Date.prototype.with is a Function', () => {
        equal(typeof Date.prototype.with, 'function');
      });
      it('Date.prototype.plus is a Function', () => {
        equal(typeof Date.prototype.plus, 'function');
      });
      it('Date.prototype.minus is a Function', () => {
        equal(typeof Date.prototype.minus, 'function');
      });
      it('Date.prototype.difference is a Function', () => {
        equal(typeof Date.prototype.difference, 'function');
      });
      it('Date.prototype.withTime is a Function', () => {
        equal(typeof Date.prototype.withTime, 'function');
      });
      it('Date.prototype.getYearMonth is a Function', () => {
        equal(typeof Date.prototype.getYearMonth, 'function');
      });
      it('Date.prototype.getMonthDay is a Function', () => {
        equal(typeof Date.prototype.getMonthDay, 'function');
      });
      it('Date.prototype.toString is a Function', () => {
        equal(typeof Date.prototype.toString, 'function');
      });
      it('Date.prototype.toJSON is a Function', () => {
        equal(typeof Date.prototype.toJSON, 'function');
      });
    });
    it('Date.fromString is a Function', () => {
      equal(typeof Date.fromString, 'function');
    });
  });
  describe('Construction', () => {
    let date;
    it('date can be constructed', () => {
      date = new Date(1976, 11, 18);
      assert(date);
      equal(typeof date, 'object');
    });
    it('date.year is 1976', () => equal(date.year, 1976));
    it('date.month is 11', () => equal(date.month, 11));
    it('date.day is 18', () => equal(date.day, 18));
    it('date.dayOfWeek is 4', () => equal(date.dayOfWeek, 4));
    it('date.dayOfYear is 323', () => equal(date.dayOfYear, 323));
    it('date.weekOfYear is 47', () => equal(date.weekOfYear, 47));
    it('`${date}` is 1976-11-18', () => equal(`${date}`, '1976-11-18'));
  });
  describe('.with manipulation', () => {
    const original = new Date(1976, 11, 18);
    it('date.with({ year: 2019 } works', () => {
      const date = original.with({ year: 2019 });
      equal(`${date}`, '2019-11-18');
    });
    it('date.with({ month: 5 } works', () => {
      const date = original.with({ month: 5 });
      equal(`${date}`, '1976-05-18');
    });
    it('date.with({ day: 17 } works', () => {
      const date = original.with({ day: 17 });
      equal(`${date}`, '1976-11-17');
    });
  });
  describe('date.difference() works', () => {
    const date = new Date(1976, 11, 18);
    it('date.difference({ year: 1976, month: 10, day: 5 })', () => {
      const duration = date.difference({ year: 1976, month: 10, day: 5 });

      equal(duration.years, 0);
      equal(duration.months, 1);
      equal(duration.days, 13);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('date.difference({ year: 2019, month: 11, day: 18 })', () => {
      const duration = date.difference({ year: 2019, month: 11, day: 18 });
      equal(duration.years, 43);
      equal(duration.months, 0);
      equal(duration.days, 0);
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
  });
  describe('date.plus() works', () => {
    let date = new Date(1976, 11, 18);
    it('date.plus({ years: 43 })', () => {
      equal(`${date.plus({ years: 43 })}`, '2019-11-18');
    });
    it('date.plus({ months: 3 })', () => {
      equal(`${date.plus({ months: 3 })}`, '1977-02-18');
    });
    it('date.plus({ days: 20 })', () => {
      equal(`${date.plus({ days: 20 })}`, '1976-12-08');
    });
    it('new Date(2019, 1, 31).plus({ months: 1 })', () => {
      equal(`${new Date(2019, 1, 31).plus({ months: 1 })}`, '2019-02-28');
    });
  });
  describe('date.minus() works', () => {
    const date = new Date(1976, 11, 18);
    it('date.minus({ years: 21 })', () => {
      equal(`${date.minus({ years: 21 })}`, '1955-11-18');
    });
    it('date.minus({ months: 13 })', () => {
      equal(`${date.minus({ months: 13 })}`, '1975-10-18');
    });
    it('date.minus({ days: 20 })', () => {
      equal(`${date.minus('P20D').plus('P20D')}`, `${date}`);
      equal(`${date.minus('P20D')}`, '1976-10-29');
    });
  });
  describe('date.toString() works', () => {
    it('new Date(1976, 11, 18).toString()', () => {
      equal(new Date(1976, 11, 18).toString(), '1976-11-18');
    });
    it('new Date(1914, 2, 23).toString()', () => {
      equal(new Date(1914, 2, 23).toString(), '1914-02-23');
    });
  });
  describe('Date.fromString() works', () => {
    it('Date.fromString("1976-11-18")', () => {
      const date = Date.fromString('1976-11-18');
      equal(date.year, 1976);
      equal(date.month, 11);
      equal(date.day, 18);
    });
    it('Date.fromString("2019-06-30")', () => {
      const date = Date.fromString('2019-06-30');
      equal(date.year, 2019);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.fromString("+000050-06-30")', () => {
      const date = Date.fromString('+000050-06-30');
      equal(date.year, 50);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.fromString("+010583-06-30")', () => {
      const date = Date.fromString('+010583-06-30');
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.fromString("-010583-06-30")', () => {
      const date = Date.fromString('-010583-06-30');
      equal(date.year, -10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('Date.fromString("-000333-06-30")', () => {
      const date = Date.fromString('-000333-06-30');
      equal(date.year, -333);
      equal(date.month, 6);
      equal(date.day, 30);
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
