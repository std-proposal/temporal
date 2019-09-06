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

describe('Exports', () => {
  const named = Object.keys(Temporal);
  it('should be 12 things', () => {
    equal(named.length, 12);
  });
  it('should contain `Instant`', () => {
    assert(named.includes('Instant'));
  });
  it('should contain `TimeZone`', () => {
    assert(named.includes('TimeZone'));
  });
  it('should contain `ZonedDateTime`', () => {
    assert(named.includes('ZonedDateTime'));
  });
  it('should contain `Date`', () => {
    assert(named.includes('Date'));
  });
  it('should contain `Time`', () => {
    assert(named.includes('Time'));
  });
  it('should contain `DateTime`', () => {
    assert(named.includes('DateTime'));
  });
  it('should contain `YearMonth`', () => {
    assert(named.includes('YearMonth'));
  });
  it('should contain `MonthDay`', () => {
    assert(named.includes('MonthDay'));
  });
  it('should contain `Duration`', () => {
    assert(named.includes('Duration'));
  });
  it('should contain `EARLIER`', () => {
    assert(named.includes('EARLIER'));
  });
  it('should contain `LATER`', () => {
    assert(named.includes('LATER'));
  });
  it('should contain `Local`', () => {
    assert(named.includes('Local'));
  });
  describe('Local', () => {
    const expected = ['instant', 'timeZone', 'zonedDateTime', 'dateTime', 'date', 'time', 'dayMonth', 'monthYear'];
    const named = Object.keys(Temporal.Local);
    it(`should be ${expected.length} things`, () => {
      equal(named.length, expected.length);
    });
    expected.forEach((prop) => {
      it(`should contain '${prop}'`, () => {
        assert(named.includes(prop));
        assert('function' === typeof Temporal.Local[prop], `Temporal.Local.${prop} is a function`);
      });
    });
  });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
