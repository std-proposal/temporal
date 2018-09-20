// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for ZonedDateTime
author: Philipp Dunkel
esid: pending
---*/

const instant = new temporal.Instant(217175010450000100n);

const one = new temporal.ZonedDateTime(instant, 'Europe/Vienna');
assert.sameValue(typeof one, 'object');
assert.sameValue(one instanceof temporal.ZonedDateTime, true);
assert.sameValue(one.instant.milliseconds, 217175010450);
assert.sameValue(one.instant.nanoseconds, 217175010450000100n);
assert.sameValue(one.toString(), '1976-11-18T15:23:30.450000100+01:00[Europe/Vienna]');

const two = new temporal.ZonedDateTime(instant, 'America/New_York');
assert.sameValue(typeof two, 'object');
assert.sameValue(two instanceof temporal.ZonedDateTime, true);
assert.sameValue(two.instant.milliseconds, 217175010450);
assert.sameValue(two.instant.nanoseconds, 217175010450000100n);
assert.sameValue(two.toString(), '1976-11-18T09:23:30.450000100-05:00[America/New_York]');
