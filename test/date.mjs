#! /usr/bin/env node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import { CivilDate } from '../lib/date.mjs';

describe('CivilDate', ()=>{
  describe('Structure', ()=>{
    it('CivilDate is a Function', ()=>{ equal(typeof CivilDate, 'function'); });
    it('CivilDate has a prototype', ()=>{ assert(CivilDate.prototype); equal(typeof CivilDate.prototype, 'object'); });
    describe('CivilDate.prototype', ()=>{
      it('CivilDate.prototype has year', ()=>{ assert('year' in CivilDate.prototype); });
      it('CivilDate.prototype has month', ()=>{ assert('month' in CivilDate.prototype); });
      it('CivilDate.prototype has day', ()=>{ assert('day' in CivilDate.prototype); });
      it('CivilDate.prototype has dayOfWeek', ()=>{ assert('dayOfWeek' in CivilDate.prototype); });
      it('CivilDate.prototype has dayOfYear', ()=>{ assert('dayOfYear' in CivilDate.prototype); });
      it('CivilDate.prototype has weekOfYear', ()=>{ assert('weekOfYear' in CivilDate.prototype); });
      it('CivilDate.prototype.with is a Function', ()=>{ equal(typeof CivilDate.prototype.with, 'function'); });
      it('CivilDate.prototype.plus is a Function', ()=>{ equal(typeof CivilDate.prototype.plus, 'function'); });
      it('CivilDate.prototype.minus is a Function', ()=>{ equal(typeof CivilDate.prototype.minus, 'function'); });
      it('CivilDate.prototype.difference is a Function', ()=>{ equal(typeof CivilDate.prototype.difference, 'function'); });
      it('CivilDate.prototype.withTime is a Function', ()=>{ equal(typeof CivilDate.prototype.withTime, 'function'); });
      it('CivilDate.prototype.getCivilYearMonth is a Function', ()=>{ equal(typeof CivilDate.prototype.getCivilYearMonth, 'function'); });
      it('CivilDate.prototype.getCivilMonthDay is a Function', ()=>{ equal(typeof CivilDate.prototype.getCivilMonthDay, 'function'); });
      it('CivilDate.prototype.toString is a Function', ()=>{ equal(typeof CivilDate.prototype.toString, 'function'); });
      it('CivilDate.prototype.toJSON is a Function', ()=>{ equal(typeof CivilDate.prototype.toJSON, 'function'); });
    });
    it('CivilDate.fromString is a Function', ()=>{ equal(typeof CivilDate.fromString, 'function'); });
  });
  describe('Construction', ()=>{
    let date;
    it('date can be constructed', ()=>{ date = new CivilDate(1976, 11, 18); assert(date); equal(typeof date, 'object'); });
    it('date.year is 1976', ()=>equal(date.year, 1976));
    it('date.month is 11', ()=>equal(date.month, 11));
    it('date.day is 18', ()=>equal(date.day, 18));
    it('date.dayOfWeek is 4', ()=>equal(date.dayOfWeek, 4));
    it('date.dayOfYear is 323', ()=>equal(date.dayOfYear, 323));
    it('date.weekOfYear is 47', ()=>equal(date.weekOfYear, 47));
    it('`${date}` is 1976-11-18', ()=>equal(`${date}`, '1976-11-18'));
  });
  describe('.with manipulation', ()=>{
    const original = new CivilDate(1976, 11, 18);
    it('date.with({ year: 2019 } works', ()=>{
      const date = original.with({ year: 2019 });
      equal(`${date}`, '2019-11-18');
    });
    it('date.with({ month: 5 } works', ()=>{
      const date = original.with({ month: 5 });
      equal(`${date}`, '1976-05-18');
    });
    it('date.with({ day: 17 } works', ()=>{
      const date = original.with({ day: 17 });
      equal(`${date}`, '1976-11-17');
    });
  });
  describe('date.difference() works', ()=>{
    const date = new CivilDate(1976, 11, 18);
    it('date.difference({ year: 1976, month: 10, day: 5 })', ()=>{
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
    it('date.difference({ year: 2019, month: 11, day: 18 })', ()=>{
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
  describe('date.plus() works', ()=>{
    const date = new CivilDate(1976, 11, 18);
    it('date.plus({ years: 43 })', ()=>{ equal(`${date.plus({ years: 43 })}`, '2019-11-18'); });
    it('date.plus({ months: 3 })', ()=>{ equal(`${date.plus({ months: 3 })}`, '1977-02-18'); });
    it('date.plus({ days: 20 })', ()=>{ equal(`${date.plus({ days: 20 })}`, '1976-12-08'); });
  });
  describe('date.minus() works', ()=>{
    const date = new CivilDate(1976, 11, 18);
    it('date.minus({ years: 21 })', ()=>{ equal(`${date.minus({ years: 21 })}`, '1955-11-18'); });
    it('date.minus({ months: 13 })', ()=>{ equal(`${date.minus({ months: 13 })}`, '1975-10-18'); });
    it('date.minus({ days: 20 })', ()=>{ equal(`${date.minus({ days: 20 })}`, '1976-10-29'); });
  });
  describe('date.toString() works', ()=>{
    it('new CivilDate(1976, 11, 18).toString()', ()=>{ equal(new CivilDate(1976, 11, 18).toString(), '1976-11-18'); });
    it('new CivilDate(1914, 2, 23).toString()', ()=>{ equal(new CivilDate(1914, 2, 23).toString(), '1914-02-23'); });
  });
  describe('CivilDate.fromString() works', ()=>{
    it('CivilDate.fromString("1976-11-18")', ()=>{
      const date = CivilDate.fromString("1976-11-18");
      equal(date.year, 1976);
      equal(date.month, 11);
      equal(date.day, 18);
    });
    it('CivilDate.fromString("2019-06-30")', ()=>{
      const date = CivilDate.fromString("2019-06-30");
      equal(date.year, 2019);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('CivilDate.fromString("0050-06-30")', ()=>{
      const date = CivilDate.fromString("0050-06-30");
      equal(date.year, 50);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('CivilDate.fromString("10583-06-30")', ()=>{
      const date = CivilDate.fromString("10583-06-30");
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('CivilDate.fromString("+10583-06-30")', ()=>{
      const date = CivilDate.fromString("+10583-06-30");
      equal(date.year, 10583);
      equal(date.month, 6);
      equal(date.day, 30);
    });
    it('CivilDate.fromString("-0333-06-30")', ()=>{
      const date = CivilDate.fromString("-0333-06-30");
      equal(date.year, -333);
      equal(date.month, 6);
      equal(date.day, 30);
    });
  });
});

if (import.meta.url.indexOf(process.argv[1]) === 7) report(reporter);
