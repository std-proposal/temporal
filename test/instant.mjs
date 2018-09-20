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

test('Instant.fromSeconds()', ({ equal, throws, end })=>{
  const instant = Instant.fromSeconds(Math.floor(Date.UTC(1976, 10, 18, 15, 23, 30, 100) / 1000));
  equal(instant.toString(), '1976-11-18T15:23:30.000000000Z');
  throws(() => Instant.fromSeconds(0n));
  end();
});

test('Instant.fromMilliseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromMilliseconds(Date.UTC(1976, 10, 18, 15, 23, 30, 123));
  equal(instant.toString(), '1976-11-18T15:23:30.123000000Z');
  throws(() => Instant.fromMilliseconds(0n));
  end();
});

test('Instant.fromMicroseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromMicroseconds(BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1000 + 456));
  equal(instant.toString(), '1976-11-18T15:23:30.123456000Z');
  throws(() => Instant.fromMicroseconds(0));
  end();
});

test('Instant.fromNanoseconds()', ({ equal, throws, end }) => {
  const instant = Instant.fromNanoseconds(BigInt(Date.UTC(1976, 10, 18, 15, 23, 30, 123) * 1000 + 456) * 1000n + 789n);
  equal(instant.toString(), '1976-11-18T15:23:30.123456789Z');
  throws(() => Instant.fromNanoseconds(0));
  end();
});
