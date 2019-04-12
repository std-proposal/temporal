#!/usr/bin/env -S node --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import { Instant } from '../lib/instant.mjs';

const HIGHEST_YYYY_DATE = new Date(Date.parse('9999-12-31T23:59:59.999Z'));
const LOWEST_YYYY_DATE  = new Date(Date.parse('0000-01-01T00:00:00.000Z'));

test('new Instant()', ({ equal, throws, end })=>{
  equal(typeof Instant, 'function');
  throws(() => new Instant(0));
  const instant = new Instant(111222333444n);
  equal(typeof instant, 'object');
  equal(instant.seconds, 111);
  equal(instant.milliseconds, 111222);
  equal(instant.microseconds, 111222333n);
  equal(instant.nanoseconds, 111222333444n);
  end();
});

test('instant.toString()', ({ equal, end })=>{
  const instant = new Instant(0n);
  equal(instant.toString(), '1970-01-01T00:00:00.000000000Z');
  end();
});

test('Instant.fromEpochSeconds()', ({ equal, throws, end })=>{
  const instant = Instant.fromEpochSeconds(Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 100) / 1000));
  equal(instant.toString(), '1976-11-18T15:23:30.000000000Z');
  throws(() => Instant.fromEpochSeconds(0n));
  end();
});

test('Instant.fromEpochMilliseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromEpochMilliseconds(Date.UTC(1976, 10, 18, 15, 23, 30, 123));
  equal(instant.toString(), '1976-11-18T15:23:30.123000000Z');
  throws(() => Instant.fromEpochMilliseconds(0n));
  end();
});

test('Instant.fromMicroseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromEpochMicroseconds(BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1000 + 456));
  equal(instant.toString(), '1976-11-18T15:23:30.123456000Z');
  throws(() => Instant.fromEpochMicroseconds(0));
  end();
});

test('Instant.fromNanoseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromEpochNanoseconds(BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1000 + 456) * 1000n + 789n);
  equal(instant.toString(), '1976-11-18T15:23:30.123456789Z');
  throws(() => Instant.fromEpochNanoseconds(0));
  end();
});

function dateToInstant(date) {
  const isoString = date.toISOString();
  const instantString = `${isoString.slice(0, -1)}000000Z`;
  return Instant.fromString(instantString);
}

function instantToDate(instant) {
  return new Date(instant.milliseconds);
}

test('Instant.fromString()', ({ test, end }) => {
  let testCount = 0;

  const dates = [
    new Date(Date.UTC(0)),
    new Date(Date.UTC(77)),
    new Date(Date.UTC(1, 2, 3, 4, 5, 6, 7)),
    new Date(Date.UTC(1993, 11, 23, 5, 8, 13, 21)),
    new Date(-9999999999999),
    new Date(99999999999999),
    HIGHEST_YYYY_DATE,
    LOWEST_YYYY_DATE,
  ];

  dates.forEach((expectedDate) => {
    test(`Instant.fromString() 1.${++testCount}`, ({ equal, end }) => {
      const instant = dateToInstant(expectedDate);
      const actualDate = instantToDate(instant);

      equal(actualDate.toISOString(), expectedDate.toISOString());
      equal(instant.seconds, Math.floor(actualDate / 1000));
      equal(instant.milliseconds, actualDate.getTime());
      equal(instant.microseconds, BigInt(actualDate.getTime()) * 1000n);
      equal(instant.nanoseconds,  BigInt(actualDate.getTime()) * 1000000n);

      end();
    });
  });

  const strings = [
    '0000-01-01T00:00:00.000000000Z',
    '0045-12-31T23:59:59.999999999Z',
    '9999-12-31T23:59:59.999999999Z',
    '1970-01-01T00:00:00.000000000Z',
    '1976-11-18T15:23:30.000000000Z',
    '1976-11-18T15:23:30.123456789Z',
  ];

  strings.forEach((expectedString) => {
    test(`Instant.fromString() 2.${++testCount}`, ({ equal, end }) => {
      const instant = Instant.fromString(expectedString);
      const actualString = instant.toString();

      equal(actualString, expectedString);
      end();
    });
  });

  end();

});
