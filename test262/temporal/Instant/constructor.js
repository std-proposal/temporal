// Copyright (C) 2018 Bloomberg LP. All rights reserved.
// This code is governed by the license found in the LICENSE file.

/*---
description: >
    Basic Tests for Instant
author: Philipp Dunkel
esid: pending
---*/

const instance = new temporal.Instant(217178610450000100n);

assert.sameValue(typeof instance, 'object');
assert.sameValue(instance instanceof temporal.Instant, true);
assert.sameValue(instance.seconds, 217178610);
assert.sameValue(instance.milliseconds, 217178610450);
assert.sameValue(instance.microseconds, 217178610450000n);
assert.sameValue(instance.nanoseconds, 217178610450000100n);

assert.sameValue(instance.toString(), '1976-11-18T15:23:30.450000100Z');
