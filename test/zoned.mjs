#! /usr/bin/env node --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import { Instant } from '../lib/instant.mjs';
import { Zoned } from '../lib/zoned.mjs';

test('new Zoned()', ({ equal, end }) => {
  const instant = Instant.fromMilliseconds(Date.UTC(1976, 10, 18, 14, 23, 30, 123));
  const zoned = new Zoned(instant, 'Europe/Vienna');
  equal(zoned.offsetSeconds, 3600);
  equal((new Zoned(instant, 'Europe/Vienna')).toString(), '1976-11-18T15:23:30.123000000+01:00[Europe/Vienna]');
  equal((new Zoned(instant, '+1')).toString(), '1976-11-18T15:23:30.123000000+01:00');
  equal((new Zoned(instant, '+0100')).toString(), '1976-11-18T15:23:30.123000000+01:00');
  equal((new Zoned(instant, '+01:00')).toString(), '1976-11-18T15:23:30.123000000+01:00');
  end();
});

test('zoned.offsetString', ({ equal, end })=>{
  const instant = new Instant(1537820555356000000n);
  equal((new Zoned(instant, 'UTC')).offsetString, '+00:00');
  equal((new Zoned(instant, 'Europe/London')).offsetString, '+01:00');
  equal((new Zoned(instant, 'Europe/Berlin')).offsetString, '+02:00');
  equal((new Zoned(instant, 'America/New_York')).offsetString, '-04:00');
  equal((new Zoned(instant, 'America/Vancouver')).offsetString, '-07:00');
  equal((new Zoned(instant, '+04:00')).offsetString, '+04:00');
  end();
});

test('zoned.offsetSeconds', ({ equal, end }) => {
  const instant = new Instant(1537820555356000000n);
  equal((new Zoned(instant, 'UTC')).offsetSeconds, 0);
  equal((new Zoned(instant, 'Europe/London')).offsetSeconds, 3600);
  equal((new Zoned(instant, 'Europe/Berlin')).offsetSeconds, 7200);
  equal((new Zoned(instant, 'America/New_York')).offsetSeconds, -14400);
  equal((new Zoned(instant, 'America/Vancouver')).offsetSeconds, -25200);
  equal((new Zoned(instant, '+04:00')).offsetSeconds, 14400);
  end();
});

test('zoned.ianaZone', ({ equal, end }) => {
  const instant = new Instant(1537820555356000000n);
  equal((new Zoned(instant, 'UTC')).ianaZone, 'UTC');
  equal((new Zoned(instant, 'Europe/London')).ianaZone, 'Europe/London');
  equal((new Zoned(instant, 'Europe/Berlin')).ianaZone, 'Europe/Berlin');
  equal((new Zoned(instant, 'America/New_York')).ianaZone, 'America/New_York');
  equal((new Zoned(instant, 'America/Vancouver')).ianaZone, 'America/Vancouver');
  equal((new Zoned(instant, '+04:00')).ianaZone, undefined);
  end();
});

test('zoned.timeZone', ({ equal, end }) => {
  const instant = new Instant(1537820555356000000n);
  equal((new Zoned(instant, 'UTC')).timeZone, 'UTC');
  equal((new Zoned(instant, 'Europe/London')).timeZone, 'Europe/London');
  equal((new Zoned(instant, 'Europe/Berlin')).timeZone, 'Europe/Berlin');
  equal((new Zoned(instant, 'America/New_York')).timeZone, 'America/New_York');
  equal((new Zoned(instant, 'America/Vancouver')).timeZone, 'America/Vancouver');
  equal((new Zoned(instant, '+04:00')).timeZone, '+04:00');
  end();
});

test('zoned.toString()', ({ equal, end }) => {
  const instant = new Instant(1537820555356123456n);
  equal('' + (new Zoned(instant, 'UTC')), '2018-09-24T20:22:35.356123456+00:00[UTC]');
  equal('' + (new Zoned(instant, 'Europe/London')), '2018-09-24T21:22:35.356123456+01:00[Europe/London]');
  equal('' + (new Zoned(instant, 'Europe/Berlin')), '2018-09-24T22:22:35.356123456+02:00[Europe/Berlin]');
  equal('' + (new Zoned(instant, 'America/New_York')), '2018-09-24T16:22:35.356123456-04:00[America/New_York]');
  equal('' + (new Zoned(instant, 'America/Vancouver')), '2018-09-24T13:22:35.356123456-07:00[America/Vancouver]');
  equal('' + (new Zoned(instant, '+04:00')), '2018-09-25T00:22:35.356123456+04:00');
  end();
});
