// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Parse Tests for ZonedDateTime (This assumes TZ=Europe/London)
author: Philipp Dunkel
esid: pending
---*/

const one = temporal.ZonedDateTime.fromString('1976-11-18T15:23:30.450000100+01:00');
assert.sameValue(one instanceof temporal.ZonedDateTime, true);
assert.sameValue(one.instant.nanoseconds, 217175010450000100n);
assert.sameValue(one.offsetString, '+01:00');
assert.sameValue(one.ianaZone, undefined);
assert.sameValue(one.timeZone, '+01:00');

const two = temporal.ZonedDateTime.fromString('1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');
assert.sameValue(two instanceof temporal.ZonedDateTime, true);
assert.sameValue(two.instant.nanoseconds, 217175010450000100n);
assert.sameValue(two.offsetString, '+01:00');
assert.sameValue(two.ianaZone, 'Europe/Vienna');
assert.sameValue(two.timeZone, 'Europe/Vienna');

assert.throws(Error, ()=>{
  temporal.ZonedDateTime.fromString('1976-11-18T15:23:30.450000100[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.ZonedDateTime.fromString('1976-11-18T15:23:30.450000100+03:00[Europe/Vienna]');
});
assert.throws(Error, ()=>{
  temporal.ZonedDateTime.fromString('1976-11-18T15:23:30.450000100');
});
