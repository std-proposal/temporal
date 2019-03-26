#! /usr/bin/env node --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import { Instant } from '../lib/instant.mjs';

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
