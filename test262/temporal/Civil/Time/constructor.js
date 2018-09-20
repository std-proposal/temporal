// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for CivilTime
author: Philipp Dunkel
esid: pending
---*/

const instance = new temporal.CivilTime(15, 23, 30, 123, 456, 789);

assert.sameValue(typeof instance, 'object');
assert.sameValue(instance instanceof temporal.CivilTime, true);
assert.sameValue(instance.year, undefined);
assert.sameValue(instance.month, undefined);
assert.sameValue(instance.day, undefined);
assert.sameValue(instance.hour, 15);
assert.sameValue(instance.minute, 23);
assert.sameValue(instance.second, 30);
assert.sameValue(instance.millisecond, 123);
assert.sameValue(instance.microsecond, 456);
assert.sameValue(instance.nanosecond, 789);
assert.sameValue(instance.toString(), '15:23:30.123456789');
