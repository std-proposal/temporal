import { getInstantInfo } from '../utils.mjs';

const DoM = {
  standard: [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ],
  leapyear: [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
};
function daysInMonth(year, month) {
  return DoM[isLeapYear(year) ? 'leapyear' : 'standard'][month - 1];
}

export function plus(
  { year = 0, month = 0, day = 0, hour = 0, minute = 0, second = 0, nanosecond = 0 },
  { years = 0, months = 0, days = 0, hours = 0, minutes = 0, seconds = 0, milliseconds = 0, microseconds = 0, nanoseconds = 0 }
) {
  year += years;
  month += months;
  day += days;
  hour += hours;
  minute += minutes;
  second += seconds;
  nanosecond += (milliseconds * 1E6) + (microseconds * 1E3) + nanoseconds;

  while (nanosecond < 0) { nanosecond += 1E9; second -= 1; }
  while (nanosecond >= 1E9) { nanosecond -= 1E9; second += 1; }

  while (second < 0) { second += 60; minute -= 1; }
  while (second >= 60) { second -= 60; minute += 1; }

  while (minute < 0) { minute += 60; hour -= 1; }
  while (minute >= 60) { minute -= 60; hour += 1; }

  while (hour < 0) { hour += 24; day -= 1; }
  while (hour >= 60) { hour -= 24; day += 1; }

  while (month < 1) { month += 12; year -= 1; }
  while (month > 12) { month -= 12; year += 1; }

  while (day < 1) {
    month -= 1;
    day = daysInMonth(year, month) - day;
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
    nanosecond
  };
}

export function isLeapYear(year) {
  const isDiv4 = (year % 4) === 0;
  const isDiv100 = (year % 100) === 0;
  const isDiv400 = (year % 400) === 0
  return isDiv4 && (!isDiv100 || isDiv400);
};

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
};

export function toDayOfYear(year, month, day) {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += daysInMonth(year, m);
  }
  return days;
};
export function fromDayOfYear(year, day) {
  let month = 1;
  while (day > daysInMonth(year, month)) {
    day -= daysInMonth(year, month);
    month += 1;
  }
  return { year, month, day };
};

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
};
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
};
/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export function possibleTimestamps({ year, month, day, hour=0, minute=0, second=0, nanosecond=0}, zone) {
  const base = Date.UTC(year, month-1, day, hour, minute, second, Math.floor(nanosecond / 1E6));
  const nanoseconds = nanosecond % 1E6;

  return possibleOffsets(year, zone).sort().map((offset)=>{
    const milliseconds = base - (offset * 1E3);
    const info = getInstantInfo(milliseconds, nanoseconds, zone);
    if (info.hour !== hour) return undefined;
    if (info.year !== year) return undefined;
    if (info.month !== month) return undefined;
    if (info.day !== day) return undefined;
    if (info.minute !== minute) return undefined;
    if (info.second !== second) return undefined;
    return { milliseconds, nanoseconds };
  }).filter(x=>!!x);
}
function possibleOffsets(year, zone) {
  const base = new Date(year, 0, 2, 9);

  const res = new Set();
  (new Array(12).fill(0)).forEach((_, month)=>{
    base.setMonth(month);
    const info = getInstantInfo(base.getTime(), 123, zone);
    res.add(info.offsetSeconds);
  });

  return Array.from(res);
}
