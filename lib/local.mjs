/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { TimeZone } from './timezone.mjs';
import { Absolute } from './absolute.mjs';

const now = (function(){
  if (('undefined' !== typeof process) && ('function' === typeof process.hrtime) && ('function' === typeof process.hrtime.bigint)) {
    return ()=>((BigInt(Date.now()) * 1000000n) + (process.hrtime.bigint() % 1000000n));
  }
  let v = 0;
    return ()=>{
      v = (v+1) % 100;
      return (BigInt(Date.now()) * 1000000n) + (BigInt(v) * 10000n) + BigInt(Math.floor(Math.random() * 9999));
    };
})();

export function absolute(tz = timeZone()) {
  return Absolute.fromEpochNanoseconds(now(), tz);
}
export function timeZone() {
  const fmt = Intl.DateTimeFormat('en-iso');
  return TimeZone.for(fmt.resolvedOptions().timeZone);
}
export function dateTime(tz) {
  return absolute(tz).getDateTime();
}
export function date(tz) {
  return dateTime(tz).getDate();
}
export function time(tz) {
  return dateTime(tz).getTime();
}
export function dayMonth(tz) {
  return date(tz).getMonthDay();
}
export function monthYear(tz) {
  return date(tz).getYearMonth();
}
