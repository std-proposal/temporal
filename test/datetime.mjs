#! /usr/bin/env node --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import { CivilDateTime } from '../lib/civil/datetime.mjs';

test('new CivilDateTime', ({ equal, end })=>{
  equal('' + (new CivilDateTime(1976, 11, 18, 15, 23)), '1976-11-18T15:23:00.000000000');
  end();
});

test('datetime properties', ({ equal, end }) => {
  let instance = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
  equal(instance.year, 1976);
  equal(instance.month, 11);
  equal(instance.day, 18);
  equal(instance.hour, 15);
  equal(instance.minute, 23);
  equal(instance.second, 30);
  equal(instance.millisecond, 123);
  equal(instance.microsecond, 456);
  equal(instance.nanosecond, 789);
  equal(instance.dayOfWeek, 4);
  equal(instance.dayOfYear, 323);
  equal(instance.weekOfYear, 47);

  instance = instance.plus({ years: 42 });
  equal(instance.year, 2018);
  equal(instance.month, 11);
  equal(instance.day, 18);
  equal(instance.hour, 15);
  equal(instance.minute, 23);
  equal(instance.second, 30);
  equal(instance.millisecond, 123);
  equal(instance.microsecond, 456);
  equal(instance.nanosecond, 789);
  equal(instance.dayOfWeek, 7);
  equal(instance.dayOfYear, 322);
  equal(instance.weekOfYear, 46);

  instance = instance.with({ year: 2017, month: 1, day: 1 });
  equal(instance.year, 2017);
  equal(instance.month, 1);
  equal(instance.day, 1);
  equal(instance.hour, 15);
  equal(instance.minute, 23);
  equal(instance.second, 30);
  equal(instance.millisecond, 123);
  equal(instance.microsecond, 456);
  equal(instance.nanosecond, 789);
  equal(instance.dayOfWeek, 7);
  equal(instance.dayOfYear, 1);
  equal(instance.weekOfYear, 52);

  instance = instance.with({ year: 2016, month: 1, day: 2 });
  equal(instance.weekOfYear, 53);

  end();
});

test('datetime.[to/from]DateTimeString()', ({ equal, deepEqual, end })=>{
  let datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
  equal(datetime.toDateTimeString(), '1976-11-18T15:23:30.123456789');
  let revived = CivilDateTime.fromDateTimeString(datetime.toDateTimeString());
  deepEqual(revived, datetime);

  datetime = datetime.plus({ years: 40, days: -18, nanoseconds: -50000 });
  equal(datetime.toDateTimeString(), '2016-10-31T15:23:30.123406789');
  revived = CivilDateTime.fromDateTimeString(datetime.toDateTimeString());
  deepEqual(revived, datetime);

  end();
});

test('datetime.[to/from]WeekDateTimeString()', ({ equal, deepEqual, end }) => {
  let datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
  equal(datetime.toWeekDateTimeString(), '1976-W47-4T15:23:30.123456789');
  let revived = CivilDateTime.fromWeekDateTimeString(datetime.toWeekDateTimeString());
  deepEqual(revived, datetime);

  datetime = datetime.plus({ years: 40, days: -18, nanoseconds: -50000 });
  equal(datetime.toWeekDateTimeString(), '2016-W44-1T15:23:30.123406789');
  revived = CivilDateTime.fromWeekDateTimeString(datetime.toWeekDateTimeString());
  deepEqual(revived, datetime);

  end();
});

test('datetime.[to/from]OrdinalDateTimeString()', ({ equal, deepEqual, end }) => {
  let datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);
  equal(datetime.toOrdinalDateTimeString(), '1976-323T15:23:30.123456789');
  let revived = CivilDateTime.fromOrdinalDateTimeString(datetime.toOrdinalDateTimeString());
  deepEqual(revived, datetime);

  datetime = datetime.plus({ years: 40, days: -18, nanoseconds: -50000 });
  equal(datetime.toOrdinalDateTimeString(), '2016-305T15:23:30.123406789');
  revived = CivilDateTime.fromOrdinalDateTimeString(datetime.toOrdinalDateTimeString());
  deepEqual(revived, datetime);

  end();
});

test('datetime.[to/from]OrdinalDateTimeString()', ({ deepEqual, end }) => {
  let datetime = new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789);

  let revived = CivilDateTime.fromString(datetime.toDateTimeString());
  deepEqual(revived, datetime);

  revived = CivilDateTime.fromString(datetime.toWeekDateTimeString());
  deepEqual(revived, datetime);

  revived = CivilDateTime.fromString(datetime.toOrdinalDateTimeString());
  deepEqual(revived, datetime);

  end();
});

test('datetime.withZone()', ({ equal, throws, end})=>{
  equal((new CivilDateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789)).withZone('Europe/Vienna').toString(), '1976-11-18T15:23:30.123456789+01:00[Europe/Vienna]');
  throws(() => (new CivilDateTime(2018, 3, 11, 2, 0, 0, 0)).withZone('America/Chicago'));
  throws(() => (new CivilDateTime(2018, 3, 11, 2, 30, 0, 0)).withZone('America/Chicago'));
  equal((new CivilDateTime(2018, 3, 11, 3, 0, 0, 0)).withZone('America/Chicago').toString(), '2018-03-11T03:00:00.000000000-05:00[America/Chicago]');

  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago').toString(), '2018-11-04T01:30:00.000000000-05:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', '-06:00').toString(), '2018-11-04T01:30:00.000000000-06:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', '-05:00').toString(), '2018-11-04T01:30:00.000000000-05:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', -21600).toString(), '2018-11-04T01:30:00.000000000-06:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', -18000).toString(), '2018-11-04T01:30:00.000000000-05:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', (z) => (z.offsetSeconds === -21600)).toString(), '2018-11-04T01:30:00.000000000-06:00[America/Chicago]');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('America/Chicago', (z) => (z.offsetSeconds === -18000)).toString(), '2018-11-04T01:30:00.000000000-05:00[America/Chicago]');

  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('+03:00').toString(), '2018-11-04T01:30:00.000000000+03:00');
  equal((new CivilDateTime(2018, 11, 4, 1, 30, 0, 0)).withZone('UTC').toString(), '2018-11-04T01:30:00.000000000+00:00[UTC]');
  end();
});
