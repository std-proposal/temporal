/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export const DATA = Symbol('DATA');

export function pad(num, cnt) {
  const str = `${Math.abs(+num)}`;
  const prefix = (new Array(cnt)).fill('0').join('');
  return `${prefix}${`${str}`.trim()}`.slice(-1 * Math.max(cnt, str.length));
}
export function signedpad(num, cnt) {
  return `${+num < 0 ? '-' : ''}${pad(num, cnt)}`;
};

const DoM = {
  standard: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
  leapyear: [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
};
export function daysInMonth(year, month) {
  return DoM[isLeapYear(year) ? 'leapyear' : 'standard'][month - 1];
}

export function isLeapYear(year) {
  if (undefined === year) return false;
  const isDiv4 = (year % 4) === 0;
  const isDiv100 = (year % 100) === 0;
  const isDiv400 = (year % 400) === 0
  return isDiv4 && (!isDiv100 || isDiv400);
}

export function toDayOfWeek(year, month, day) {
  const m = month + ((month < 3) ? 10 : -2);
  const Y = year - ((month < 3) ? 1 : 0);

  const c = Math.floor(Y / 100);
  const y = Y - (c * 100);
  const d = day;

  const pD = d;
  const pM = Math.floor((2.6 * m) - 0.2);
  const pY = y + Math.floor(y / 4);
  const pC = Math.floor(c / 4) - (2 * c);

  const dow = (pD + pM + pY + pC) % 7;

  return dow + ((dow < 0) ? 7 : 0);
}

export function toDayOfYear(year, month, day) {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += daysInMonth(year, m);
  }
  return days;
}

export function fromDayOfYear(year, day) {
  let month = 1;
  while (day > daysInMonth(year, month)) {
    day -= daysInMonth(year, month);
    month += 1;
  }
  return { year, month, day };
}

export function toWeekOfYear(year, month, day) {
  let doy = toDayOfYear(year, month, day);
  let dow = toDayOfWeek(year, month, day) || 7;
  let doj = toDayOfWeek(year, 1, 1);

  const week = Math.floor((doy - dow + 10) / 7);

  if (week < 1) {
    if (doj === (isLeapYear(year) ? 5 : 6)) {
      return 53;
    } else {
      return 52;
    }
  }
  if (week === 53) {
    if (((isLeapYear(year) ? 366 : 365) - doy) < (4 - dow)) {
      return 1;
    }
  }

  return week;
}

export function fromWeekOfYear(year, week, weekday) {
  let doy = (week * 7) + weekday - (toDayOfWeek(year, 1, 4) || 7 + 3);
  while (doy < 1) {
    year -= 1;
    doy = (isLeapYear(year) ? 366 : 365) + doy;
  }
  while (doy > (isLeapYear(year) ? 366 : 365)) {
    doy = doy - (isLeapYear(year) ? 366 : 365);
    year += 1;
  }
  return fromDayOfYear(year, doy);
}

export function calculate(
  { year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 },
  { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 },
  negate
) {
  year += (negate ? -1 : 1) * years;
  month += (negate ? -1 : 1) * months;
  day += (negate ? -1 : 1) * days;
  hour += (negate ? -1 : 1) * hours;
  minute += (negate ? -1 : 1) * minutes;
  second += (negate ? -1 : 1) * seconds;
  millisecond += (negate ? -1 : 1) * milliseconds;
  microsecond += (negate ? -1 : 1) * microseconds;
  nanosecond += (negate ? -1 : 1) * nanoseconds;

  while (nanosecond < 0) { nanosecond += 1E3; microsecond -= 1; }
  while (nanosecond >= 1E3) { nanosecond -= 1E3; microsecond += 1; }

  while (microsecond < 0) { microsecond += 1E3; millisecond -= 1; }
  while (microsecond >= 1E3) { microsecond -= 1E3; millisecond += 1; }

  while (millisecond < 0) { millisecond += 1E3; second -= 1; }
  while (millisecond >= 1E3) { millisecond -= 1E3; second += 1; }

  while (second < 0) { second += 60; minute -= 1; }
  while (second >= 60) { second -= 60; minute += 1; }

  while (minute < 0) { minute += 60; hour -= 1; }
  while (minute >= 60) { minute -= 60; hour += 1; }

  while (hour < 0) { hour += 24; day -= 1; }
  while (hour >= 24) { hour -= 24; day += 1; }

  while (month < 1) { month += 12; year -= 1; }
  while (month > 12) { month -= 12; year += 1; }

  while (day < 1) {
    month -= 1;
    day = daysInMonth(year, month) + day;
    if (month < 1) { month = 12; year -= 1; }
  }
  while (day > daysInMonth(year, month)) {
    day -= daysInMonth(year, month);
    month += 1;
    if (month > 12) { month = 1; year += 1; }
  }

  while (month < 1) { month += 12; year -= 1; }
  while (month > 12) { month -= 12; year += 1; }

  return {
    year, month, day,
    hour, minute, second,
    millisecond, microsecond, nanosecond
  };
}

export function epochMSNS({ year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0 } = {}) {
  const ms = Date.UTC(year, month - 1, day, hour, minute, second, millisecond);
  const ns = (microsecond * 1e3) + nanosecond;
  return { ms, ns };
}

const OFFSETRE = /^([+-]?)(\d{2})\:?(\d{2})$/;
export function parseOffsetString(offsetString) {
  const match = OFFSETRE.exec(offsetString);
  if (!match) throw new Error('invalid offset string');
  const hours = +match[2];
  const minutes = +match[3];
  const direction = match[1] === '-' ? -1 : +1;
  return (hours * 60 + minutes) * 60 * 1e3 * direction;
}
export function makeOffsetString(offsetMilliseconds) {
  const direction = (offsetMilliseconds < 0) ? '-' : '+';
  const offsetMinutes = Math.floor(Math.abs(offsetMilliseconds) / 6e4);
  const hours = Math.floor(offsetMinutes / 60);
  const minutes = Math.floor(offsetMinutes % 60);
  return `${direction}${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}`;
}

export function copyProps(...objs) {
  const result = {};
  for (let obj of objs) {
    if (undefined !== obj.year) result.year = obj.year;
    if (undefined !== obj.month) result.month = obj.month;
    if (undefined !== obj.day) result.day = obj.day;
    if (undefined !== obj.hour) result.hour = obj.hour;
    if (undefined !== obj.minute) result.minute = obj.minute;
    if (undefined !== obj.second) result.second = obj.second;
    if (undefined !== obj.millisecond) result.millisecond = obj.millisecond;
    if (undefined !== obj.microsecond) result.microsecond = obj.microsecond;
    if (undefined !== obj.nanosecond) result.nanosecond = obj.nanosecond;
  }
  return result;
}

export function possibleTimestamps({ year, month, day, hour=0, minute=0, second=0, millisecond=0, microsecond, nanosecond = 0}, zone) {
  const base = Date.UTC(year, month-1, day, hour, minute, second, millisecond);
  const formatter = new Intl.DateTimeFormat('en-iso', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: zone
  });
  const possible = possibleOffsets(year, formatter).sort().map((offset)=>{
    const ms = base - offset;
    const ns = microsecond * 1e3 + nanosecond;
    const info = getTimestampInfo(ms, ns, formatter);
    if (info.hour !== hour) return undefined;
    if (info.year !== year) return undefined;
    if (info.month !== month) return undefined;
    if (info.day !== day) return undefined;
    if (info.minute !== minute) return undefined;
    if (info.second !== second) return undefined;
    return { ms, ns };
  }).filter(x=>!!x).sort((a,b)=>{
    if (a.ms !== b.ms) a.ms - b.ms;
    return a.ns - b.ns;
  });
  return possible;
}
function possibleOffsets(year, formatter) {
  const base = new Date(year, 0, 2, 9);
  
  const res = new Set();
  (new Array(12).fill(0)).forEach((_, month)=>{
    base.setMonth(month);
    const { offsetMilliseconds } = getTimestampInfo(base.getTime(), 123, formatter);
    res.add(offsetMilliseconds);
  });

  return Array.from(res);
}

function getTimestampInfo(ms, ns = 0, formatter) {
  const { year, month, day, hour, minute, second } = formatter.formatToParts(ms).reduce((res, item) => {
    if (item.type !== 'literal') res[item.type] = parseInt(item.value, 10);
    return res;
  }, {});
  const millisecond = (ms % 1000);
  const microsecond = Math.floor(ns / 1e3) % 1e3;
  const nanosecond = Math.floor(ns / 1e0) % 1e3;
  const offsetMilliseconds = Date.UTC(year, month-1, day, hour, minute, second, millisecond) - ms;
  return {
    year, month, day,
    hour, minute, second, 
    millisecond, microsecond, nanosecond,
    offsetMilliseconds
  };
}
