#! /usr/bin/env node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import { Instant } from '../lib/instant.mjs';
import { OffsetDateTime } from '../lib/offset.mjs';

describe('OffsetDateTime', ()=>{
  describe('Structure', ()=>{
    it('OffsetDateTime is a Function', ()=>{ equal(typeof OffsetDateTime, 'function'); });
    it('OffsetDateTime has a prototype', ()=>{ assert(OffsetDateTime.prototype); equal(typeof OffsetDateTime.prototype, 'object'); });
    describe('OffsetDateTime.prototype', ()=>{
      it('OffsetDateTime.prototype has year', ()=>{ assert('year' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has month', ()=>{ assert('month' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has day', ()=>{ assert('day' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has hour', ()=>{ assert('hour' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has minute', ()=>{ assert('minute' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has second', ()=>{ assert('second' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has millisecond', ()=>{ assert('millisecond' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has microsecond', ()=>{ assert('microsecond' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has nanosecond', ()=>{ assert('nanosecond' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has dayOfWeek', ()=>{ assert('dayOfWeek' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has dayOfYear', ()=>{ assert('dayOfYear' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype has weekOfYear', ()=>{ assert('weekOfYear' in OffsetDateTime.prototype); });
      it('OffsetDateTime.prototype.with is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.with, 'function'); });
      it('OffsetDateTime.prototype.plus is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.plus, 'function'); });
      it('OffsetDateTime.prototype.minus is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.minus, 'function'); });
      it('OffsetDateTime.prototype.withZone is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.withZone, 'function'); });
      it('OffsetDateTime.prototype.getCivilDateTime is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.getCivilDateTime, 'function'); });
      it('OffsetDateTime.prototype.getCivilDate is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.getCivilDate, 'function'); });
      it('OffsetDateTime.prototype.getCivilTime is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.getCivilTime, 'function'); });
      it('OffsetDateTime.prototype.getCivilYearMonth is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.getCivilYearMonth, 'function'); });
      it('OffsetDateTime.prototype.getCivilMonthDay is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.getCivilMonthDay, 'function'); });
      it('OffsetDateTime.prototype.toString is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.toString, 'function'); });
      it('OffsetDateTime.prototype.toJSON is a Function', ()=>{ equal(typeof OffsetDateTime.prototype.toJSON, 'function'); });
    });
    it('OffsetDateTime.fromString is a Function', ()=>{ equal(typeof OffsetDateTime.fromString, 'function'); });
  });
  describe('Construction', ()=>{
    describe('new OffsetDateTime(Instant.fromString("1976-11-18T14:23:30.123456789Z"), "+01:00")', ()=>{
      let offsetdatetime;
      it('offsetdatetime can be constructed', ()=>{
        offsetdatetime = new OffsetDateTime(Instant.fromString("1976-11-18T14:23:30.123456789Z"), "+01:00");
        assert(offsetdatetime);
        equal(typeof offsetdatetime, 'object');
      });
      it('offsetdatetime.year is 1976', ()=>equal(offsetdatetime.year, 1976));
      it('offsetdatetime.month is 11', ()=>equal(offsetdatetime.month, 11));
      it('offsetdatetime.day is 18', ()=>equal(offsetdatetime.day, 18));
      it('offsetdatetime.hour is 15', ()=>equal(offsetdatetime.hour, 15));
      it('offsetdatetime.minute is 23', ()=>equal(offsetdatetime.minute, 23));
      it('offsetdatetime.second is 30', ()=>equal(offsetdatetime.second, 30));
      it('offsetdatetime.millisecond is 123', ()=>equal(offsetdatetime.millisecond, 123));
      it('offsetdatetime.microsecond is 456', ()=>equal(offsetdatetime.microsecond, 456));
      it('offsetdatetime.nanosecond is 789', ()=>equal(offsetdatetime.nanosecond, 789));
      it('offsetdatetime.dayOfWeek is 4', ()=>equal(offsetdatetime.dayOfWeek, 4));
      it('offsetdatetime.dayOfYear is 323', ()=>equal(offsetdatetime.dayOfYear, 323));
      it('offsetdatetime.weekOfYear is 47', ()=>equal(offsetdatetime.weekOfYear, 47));
      it('`${offsetdatetime}` is 1976-11-18T15:23:30.123456789+01:00', ()=>equal(`${offsetdatetime}`, '1976-11-18T15:23:30.123456789+01:00'));
    });
  });
  describe('.with manipulation', ()=>{
    const offsetdatetime = new OffsetDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), '+01:00');
    it('offsetdatetime.with({ year: 2019 } works', ()=>{ equal(`${offsetdatetime.with({ year: 2019 })}`, '2019-11-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.with({ month: 5 } works', ()=>{ equal(`${offsetdatetime.with({ month: 5 })}`, '1976-05-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.with({ day: 5 } works', ()=>{ equal(`${offsetdatetime.with({ day: 5 })}`, '1976-11-05T15:23:30.123456789+01:00'); });
    it('offsetdatetime.with({ hour: 5 } works', ()=>{ equal(`${offsetdatetime.with({ hour: 5 })}`, '1976-11-18T05:23:30.123456789+01:00'); });
    it('offsetdatetime.with({ minute: 5 } works', ()=>{ equal(`${offsetdatetime.with({ minute: 5 })}`, '1976-11-18T15:05:30.123456789+01:00'); });
    it('offsetdatetime.with({ second: 5 } works', ()=>{ equal(`${offsetdatetime.with({ second: 5 })}`, '1976-11-18T15:23:05.123456789+01:00'); });
    it('offsetdatetime.with({ millisecond: 5 } works', ()=>{ equal(`${offsetdatetime.with({ millisecond: 5 })}`, '1976-11-18T15:23:30.005456789+01:00'); });
    it('offsetdatetime.with({ microsecond: 5 } works', ()=>{ equal(`${offsetdatetime.with({ microsecond: 5 })}`, '1976-11-18T15:23:30.123005789+01:00'); });
    it('offsetdatetime.with({ nanosecond: 5 } works', ()=>{ equal(`${offsetdatetime.with({ nanosecond: 5 })}`, '1976-11-18T15:23:30.123456005+01:00'); });
    it('offsetdatetime.with({ month: 5, second: 15 } works', ()=>{ equal(`${offsetdatetime.with({ month: 5, second: 15 })}`, '1976-05-18T15:23:15.123456789+01:00'); });
  });
  describe('offsetdatetime.plus() works', ()=>{
    const offsetdatetime = new OffsetDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), '+01:00');
    it('offsetdatetime.plus({ years: 43 })', ()=>{ equal(`${offsetdatetime.plus({ years: 43 })}`, '2019-11-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.plus({ months: 3 })', ()=>{ equal(`${offsetdatetime.plus({ months: 3 })}`, '1977-02-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.plus({ days: 20 })', ()=>{ equal(`${offsetdatetime.plus({ days: 20 })}`, '1976-12-08T15:23:30.123456789+01:00'); });
    it('offsetdatetime.plus({ hours: 20 })', ()=>{ equal(`${offsetdatetime.plus({ hours: 20 })}`, '1976-11-19T11:23:30.123456789+01:00'); });
    it('offsetdatetime.plus({ minutes: 40 })', ()=>{ equal(`${offsetdatetime.plus({ minutes: 40 })}`, '1976-11-18T16:03:30.123456789+01:00'); });
    it('offsetdatetime.plus({ seconds: 40 })', ()=>{ equal(`${offsetdatetime.plus({ seconds: 40 })}`, '1976-11-18T15:24:10.123456789+01:00'); });
  });
  describe('offsetdatetime.minus() works', ()=>{
    const offsetdatetime = new OffsetDateTime(Instant.fromString('1976-11-18T14:23:30.123456789Z'), '+01:00');
    it('offsetdatetime.minus({ years: 21 })', ()=>{ equal(`${offsetdatetime.minus({ years: 21 })}`, '1955-11-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.minus({ months: 13 })', ()=>{ equal(`${offsetdatetime.minus({ months: 13 })}`, '1975-10-18T15:23:30.123456789+01:00'); });
    it('offsetdatetime.minus({ days: 20 })', ()=>{ equal(`${offsetdatetime.minus({ days: 20 })}`, '1976-10-29T15:23:30.123456789+01:00'); });
    it('offsetdatetime.minus({ hours: 20 })', ()=>{ equal(`${offsetdatetime.minus({ hours: 20 })}`, '1976-11-17T19:23:30.123456789+01:00'); });
    it('offsetdatetime.minus({ minutes: 40 })', ()=>{ equal(`${offsetdatetime.minus({ minutes: 40 })}`, '1976-11-18T14:43:30.123456789+01:00'); });
    it('offsetdatetime.minus({ seconds: 40 })', ()=>{ equal(`${offsetdatetime.minus({ seconds: 40 })}`, '1976-11-18T15:22:50.123456789+01:00'); });
  });
  describe('OffsetDateTime.fromString() works', ()=>{
    it('OffsetDateTime.fromString("1976-11-18T15:23:30.123456789+01:00")', ()=>{ equal(`${OffsetDateTime.fromString("1976-11-18T15:23:30.123456789+01:00")}`, '1976-11-18T15:23:30.123456789+01:00'); });
    it('OffsetDateTime.fromString("1976-11-18T15:23:30.123456+01:00")', ()=>{ equal(`${OffsetDateTime.fromString("1976-11-18T15:23:30.123456+01:00")}`, '1976-11-18T15:23:30.123456000+01:00'); });
    it('OffsetDateTime.fromString("1976-11-18T15:23:30.123+01:00")', ()=>{ equal(`${OffsetDateTime.fromString("1976-11-18T15:23:30.123+01:00")}`, '1976-11-18T15:23:30.123000000+01:00'); });
    it('OffsetDateTime.fromString("1976-11-18T15:23:30+01:00")', ()=>{ equal(`${OffsetDateTime.fromString("1976-11-18T15:23:30+01:00")}`, '1976-11-18T15:23:30.000000000+01:00'); });
    it('OffsetDateTime.fromString("1976-11-18T15:23+01:00")', ()=>{ equal(`${OffsetDateTime.fromString("1976-11-18T15:23+01:00")}`, '1976-11-18T15:23:00.000000000+01:00'); });
  });
});

if (import.meta.url.indexOf(process.argv[1]) === 7) report(reporter);
