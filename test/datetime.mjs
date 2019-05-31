#! /usr/bin/env node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import { CivilDateTime } from '../lib/datetime.mjs';

describe('CivilDateTime', ()=>{
  describe('Structure', ()=>{
    it('CivilDateTime is a Function', ()=>{ equal(typeof CivilDateTime, 'function'); });
    it('CivilDateTime has a prototype', ()=>{ assert(CivilDateTime.prototype); equal(typeof CivilDateTime.prototype, 'object'); });
    describe('CivilDateTime.prototype', ()=>{
      it('CivilDateTime.prototype has year', ()=>{ assert('year' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has month', ()=>{ assert('month' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has day', ()=>{ assert('day' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has hour', ()=>{ assert('hour' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has minute', ()=>{ assert('minute' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has second', ()=>{ assert('second' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has millisecond', ()=>{ assert('millisecond' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has microsecond', ()=>{ assert('microsecond' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has nanosecond', ()=>{ assert('nanosecond' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has dayOfWeek', ()=>{ assert('dayOfWeek' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has dayOfYear', ()=>{ assert('dayOfYear' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype has weekOfYear', ()=>{ assert('weekOfYear' in CivilDateTime.prototype); });
      it('CivilDateTime.prototype.with is a Function', ()=>{ equal(typeof CivilDateTime.prototype.with, 'function'); });
      it('CivilDateTime.prototype.plus is a Function', ()=>{ equal(typeof CivilDateTime.prototype.plus, 'function'); });
      it('CivilDateTime.prototype.minus is a Function', ()=>{ equal(typeof CivilDateTime.prototype.minus, 'function'); });
      it('CivilDateTime.prototype.difference is a Function', ()=>{ equal(typeof CivilDateTime.prototype.difference, 'function'); });
      it('CivilDateTime.prototype.withZone is a Function', ()=>{ equal(typeof CivilDateTime.prototype.withZone, 'function'); });
      it('CivilDateTime.prototype.withOffset is a Function', ()=>{ equal(typeof CivilDateTime.prototype.withOffset, 'function'); });
      it('CivilDateTime.prototype.getCivilDate is a Function', ()=>{ equal(typeof CivilDateTime.prototype.getCivilDate, 'function'); });
      it('CivilDateTime.prototype.getCivilTime is a Function', ()=>{ equal(typeof CivilDateTime.prototype.getCivilTime, 'function'); });
      it('CivilDateTime.prototype.toString is a Function', ()=>{ equal(typeof CivilDateTime.prototype.toString, 'function'); });
      it('CivilDateTime.prototype.toJSON is a Function', ()=>{ equal(typeof CivilDateTime.prototype.toJSON, 'function'); });
    });
    it('CivilDateTime.fromString is a Function', ()=>{ equal(typeof CivilDateTime.fromString, 'function'); });
  });
  describe('Construction', ()=>{
    describe('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789)', ()=>{
      let datetime;
      it('datetime can be constructed', ()=>{ datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789); assert(datetime); equal(typeof datetime, 'object'); });
      it('datetime.year is 1976', ()=>equal(datetime.year, 1976));
      it('datetime.month is 11', ()=>equal(datetime.month, 11));
      it('datetime.day is 18', ()=>equal(datetime.day, 18));
      it('datetime.hour is 15', ()=>equal(datetime.hour, 15));
      it('datetime.minute is 23', ()=>equal(datetime.minute, 23));
      it('datetime.second is 30', ()=>equal(datetime.second, 30));
      it('datetime.millisecond is 123', ()=>equal(datetime.millisecond, 123));
      it('datetime.microsecond is 456', ()=>equal(datetime.microsecond, 456));
      it('datetime.nanosecond is 789', ()=>equal(datetime.nanosecond, 789));
      it('datetime.dayOfWeek is 4', ()=>equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', ()=>equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', ()=>equal(datetime.weekOfYear, 47));
      it('`${datetime}` is 1976-11-18T15:23:30.123456789', ()=>equal(`${datetime}`, '1976-11-18T15:23:30.123456789'));
    });
    describe('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456)', ()=>{
      let datetime;
      it('datetime can be constructed', ()=>{ datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456); assert(datetime); equal(typeof datetime, 'object'); });
      it('datetime.year is 1976', ()=>equal(datetime.year, 1976));
      it('datetime.month is 11', ()=>equal(datetime.month, 11));
      it('datetime.day is 18', ()=>equal(datetime.day, 18));
      it('datetime.hour is 15', ()=>equal(datetime.hour, 15));
      it('datetime.minute is 23', ()=>equal(datetime.minute, 23));
      it('datetime.second is 30', ()=>equal(datetime.second, 30));
      it('datetime.millisecond is 123', ()=>equal(datetime.millisecond, 123));
      it('datetime.microsecond is 456', ()=>equal(datetime.microsecond, 456));
      it('datetime.nanosecond is 0', ()=>equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', ()=>equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', ()=>equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', ()=>equal(datetime.weekOfYear, 47));
      it('`${datetime}` is 1976-11-18T15:23:30.123456000', ()=>equal(`${datetime}`, '1976-11-18T15:23:30.123456000'));
    });
    describe('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123)', ()=>{
      let datetime;
      it('datetime can be constructed', ()=>{ datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123); assert(datetime); equal(typeof datetime, 'object'); });
      it('datetime.year is 1976', ()=>equal(datetime.year, 1976));
      it('datetime.month is 11', ()=>equal(datetime.month, 11));
      it('datetime.day is 18', ()=>equal(datetime.day, 18));
      it('datetime.hour is 15', ()=>equal(datetime.hour, 15));
      it('datetime.minute is 23', ()=>equal(datetime.minute, 23));
      it('datetime.second is 30', ()=>equal(datetime.second, 30));
      it('datetime.millisecond is 123', ()=>equal(datetime.millisecond, 123));
      it('datetime.microsecond is 0', ()=>equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', ()=>equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', ()=>equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', ()=>equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', ()=>equal(datetime.weekOfYear, 47));
      it('`${datetime}` is 1976-11-18T15:23:30.123000000', ()=>equal(`${datetime}`, '1976-11-18T15:23:30.123000000'));
    });
    describe('new CivilDateTime(1976, 11, 18, 15, 23, 30)', ()=>{
      let datetime;
      it('datetime can be constructed', ()=>{ datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30); assert(datetime); equal(typeof datetime, 'object'); });
      it('datetime.year is 1976', ()=>equal(datetime.year, 1976));
      it('datetime.month is 11', ()=>equal(datetime.month, 11));
      it('datetime.day is 18', ()=>equal(datetime.day, 18));
      it('datetime.hour is 15', ()=>equal(datetime.hour, 15));
      it('datetime.minute is 23', ()=>equal(datetime.minute, 23));
      it('datetime.second is 30', ()=>equal(datetime.second, 30));
      it('datetime.millisecond is 0', ()=>equal(datetime.millisecond, 0));
      it('datetime.microsecond is 0', ()=>equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', ()=>equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', ()=>equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', ()=>equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', ()=>equal(datetime.weekOfYear, 47));
      it('`${datetime}` is 1976-11-18T15:23:30.000000000', ()=>equal(`${datetime}`, '1976-11-18T15:23:30.000000000'));
    });
    describe('new CivilDateTime(1976, 11, 18, 15, 23)', ()=>{
      let datetime;
      it('datetime can be constructed', ()=>{ datetime = new CivilDateTime(1976, 11, 18, 15, 23); assert(datetime); equal(typeof datetime, 'object'); });
      it('datetime.year is 1976', ()=>equal(datetime.year, 1976));
      it('datetime.month is 11', ()=>equal(datetime.month, 11));
      it('datetime.day is 18', ()=>equal(datetime.day, 18));
      it('datetime.hour is 15', ()=>equal(datetime.hour, 15));
      it('datetime.minute is 23', ()=>equal(datetime.minute, 23));
      it('datetime.second is 0', ()=>equal(datetime.second, 0));
      it('datetime.millisecond is 0', ()=>equal(datetime.millisecond, 0));
      it('datetime.microsecond is 0', ()=>equal(datetime.microsecond, 0));
      it('datetime.nanosecond is 0', ()=>equal(datetime.nanosecond, 0));
      it('datetime.dayOfWeek is 4', ()=>equal(datetime.dayOfWeek, 4));
      it('datetime.dayOfYear is 323', ()=>equal(datetime.dayOfYear, 323));
      it('datetime.weekOfYear is 47', ()=>equal(datetime.weekOfYear, 47));
      it('`${datetime}` is 1976-11-18T15:23:00.000000000', ()=>equal(`${datetime}`, '1976-11-18T15:23:00.000000000'));
    });
  });
  describe('.with manipulation', ()=>{
    const datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it('datetime.with({ year: 2019 } works', ()=>{ equal(`${datetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789'); });
    it('datetime.with({ month: 5 } works', ()=>{ equal(`${datetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789'); });
    it('datetime.with({ day: 5 } works', ()=>{ equal(`${datetime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789'); });
    it('datetime.with({ hour: 5 } works', ()=>{ equal(`${datetime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789'); });
    it('datetime.with({ minute: 5 } works', ()=>{ equal(`${datetime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789'); });
    it('datetime.with({ second: 5 } works', ()=>{ equal(`${datetime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789'); });
    it('datetime.with({ millisecond: 5 } works', ()=>{ equal(`${datetime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789'); });
    it('datetime.with({ microsecond: 5 } works', ()=>{ equal(`${datetime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789'); });
    it('datetime.with({ nanosecond: 5 } works', ()=>{ equal(`${datetime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005'); });
    it('datetime.with({ month: 5, second: 15 } works', ()=>{ equal(`${datetime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789'); });
  });
  describe('datetime.difference() works', ()=>{
    const datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
    it('datetime.difference({ year: 1976, month: 10, day: 5, hour: 15, minute: 23, second: 30, millisecond: 123, microsecond: 456, nanosecond: 789 })', ()=>{
      const duration = datetime.difference({ year: 1976, month: 10, day: 5, hour: 15, minute: 23, second: 30, millisecond: 123, microsecond: 456, nanosecond: 789 });
      equal(duration.years, 0, 'years');
      equal(duration.months, 1, 'months');
      equal(duration.days, 13, 'days');
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 0);
      equal(duration.microseconds, 0);
      equal(duration.nanoseconds, 0);
    });
    it('datetime.difference({ year: 1976, month: 10, day: 5, hour: 15, minute: 23, second: 30 })', ()=>{
      const duration = datetime.difference({ year: 1976, month: 10, day: 5, hour: 15, minute: 23, second: 30 });
      equal(duration.years, 0, 'years');
      equal(duration.months, 1, 'months');
      equal(duration.days, 13, 'days');
      equal(duration.hours, 0);
      equal(duration.minutes, 0);
      equal(duration.seconds, 0);
      equal(duration.milliseconds, 123);
      equal(duration.microseconds, 456);
      equal(duration.nanoseconds, 789);
    });
    describe('datetime.plus() works', ()=>{
      const datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
      it('datetime.plus({ years: 43 })', ()=>{ equal(`${datetime.plus({ years: 43 })}`, '2019-11-18T15:23:30.123456789'); });
      it('datetime.plus({ months: 3 })', ()=>{ equal(`${datetime.plus({ months: 3 })}`, '1977-02-18T15:23:30.123456789'); });
      it('datetime.plus({ days: 20 })', ()=>{ equal(`${datetime.plus({ days: 20 })}`, '1976-12-08T15:23:30.123456789'); });
      it('datetime.plus({ hours: 20 })', ()=>{ equal(`${datetime.plus({ hours: 20 })}`, '1976-11-19T11:23:30.123456789'); });
      it('datetime.plus({ minutes: 40 })', ()=>{ equal(`${datetime.plus({ minutes: 40 })}`, '1976-11-18T16:03:30.123456789'); });
      it('datetime.plus({ seconds: 40 })', ()=>{ equal(`${datetime.plus({ seconds: 40 })}`, '1976-11-18T15:24:10.123456789'); });
    });
    describe('datetime.minus() works', ()=>{
      const datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
      it('datetime.minus({ years: 21 })', ()=>{ equal(`${datetime.minus({ years: 21 })}`, '1955-11-18T15:23:30.123456789'); });
      it('datetime.minus({ months: 13 })', ()=>{ equal(`${datetime.minus({ months: 13 })}`, '1975-10-18T15:23:30.123456789'); });
      it('datetime.minus({ days: 20 })', ()=>{ equal(`${datetime.minus({ days: 20 })}`, '1976-10-29T15:23:30.123456789'); });
      it('datetime.minus({ hours: 20 })', ()=>{ equal(`${datetime.minus({ hours: 20 })}`, '1976-11-17T19:23:30.123456789'); });
      it('datetime.minus({ minutes: 40 })', ()=>{ equal(`${datetime.minus({ minutes: 40 })}`, '1976-11-18T14:43:30.123456789'); });
      it('datetime.minus({ seconds: 40 })', ()=>{ equal(`${datetime.minus({ seconds: 40 })}`, '1976-11-18T15:22:50.123456789'); });
    });
    describe('date.toString() works', ()=>{
      it('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789).toString()', ()=>{ equal(new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789).toString(), '1976-11-18T15:23:30.123456789'); });
      it('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456).toString()', ()=>{ equal(new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456).toString(), '1976-11-18T15:23:30.123456000'); });
      it('new CivilDateTime(1976, 11, 18, 15, 23, 30, 123).toString()', ()=>{ equal(new CivilDateTime(1976, 11, 18, 15, 23, 30, 123).toString(), '1976-11-18T15:23:30.123000000'); });
      it('new CivilDateTime(1976, 11, 18, 15, 23, 30).toString()', ()=>{ equal(new CivilDateTime(1976, 11, 18, 15, 23, 30).toString(), '1976-11-18T15:23:30.000000000'); });
      it('new CivilDateTime(1976, 11, 18, 15, 23).toString()', ()=>{ equal(new CivilDateTime(1976, 11, 18, 15, 23).toString(), '1976-11-18T15:23:00.000000000'); });
    });
    describe('CivilDateTime.fromString() works', ()=>{
      it('CivilDateTime.fromString("1976-11-18T15:23:30.123456789")', ()=>{ equal(`${CivilDateTime.fromString("1976-11-18T15:23:30.123456789")}`, '1976-11-18T15:23:30.123456789'); });
      it('CivilDateTime.fromString("1976-11-18T15:23:30.123456")', ()=>{ equal(`${CivilDateTime.fromString("1976-11-18T15:23:30.123456")}`, '1976-11-18T15:23:30.123456000'); });
      it('CivilDateTime.fromString("1976-11-18T15:23:30.123")', ()=>{ equal(`${CivilDateTime.fromString("1976-11-18T15:23:30.123")}`, '1976-11-18T15:23:30.123000000'); });
      it('CivilDateTime.fromString("1976-11-18T15:23:30")', ()=>{ equal(`${CivilDateTime.fromString("1976-11-18T15:23:30")}`, '1976-11-18T15:23:30.000000000'); });
      it('CivilDateTime.fromString("1976-11-18T15:23")', ()=>{ equal(`${CivilDateTime.fromString("1976-11-18T15:23")}`, '1976-11-18T15:23:00.000000000'); });
    });
  });
});

if (import.meta.url.indexOf(process.argv[1]) === 7) report(reporter);
