/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { TimeZone } from './timezone.mjs';
import { Instant } from './instant.mjs';

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

export function instant() {
  return Instant.fromEpochNanoseconds(now());
}
export function timeZone() {
  const fmt = Intl.DateTimeFormat('en-iso');
  return TimeZone.for(fmt.resolvedOptions().timeZone);
}
export function zonedDateTime() {
  return instant().withZone(timeZone());
}
export function dateTime() {
  return zonedDateTime().getDateTime();
}
export function date() {
  return dateTime().getDate();
}
export function time() {
  return dateTime().getTime();
}
export function dayMonth() {
  return date().getMonthDay();
}
export function monthYear() {
  return date().getYearMonth();
}
