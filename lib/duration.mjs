/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, daysInMonth } from './shared.mjs';

export class Duration {
  constructor() {
    throw new TypeError('durations can not be constructed');
  }
  get years() {
    return this[DATA].years;
  }
  get months() {
    return this[DATA].months;
  }
  get days() {
    return this[DATA].days;
  }
  get hours() {
    return this[DATA].hours;
  }
  get minutes() {
    return this[DATA].minutes;
  }
  get seconds() {
    return this[DATA].seconds;
  }
  get milliseconds() {
    return this[DATA].milliseconds;
  }
  get microseconds() {
    return this[DATA].microseconds;
  }
  get nanoseconds() {
    return this[DATA].nanoseconds;
  }
}

export function castDuration(durationLike, base) {
  if (durationLike instanceof Duration) return durationLike;

  let years = Number.isFinite(durationLike.years) ? Math.abs(durationLike.years) : undefined;
  let months = Number.isFinite(durationLike.months) ? Math.abs(durationLike.months) : undefined;
  let days = Number.isFinite(durationLike.days) ? Math.abs(durationLike.days) : 0;
  let hours = Number.isFinite(durationLike.hours) ? Math.abs(durationLike.hours) : 0;
  let minutes = Number.isFinite(durationLike.minutes) ? Math.abs(durationLike.minutes) : 0;
  let seconds = Number.isFinite(durationLike.seconds) ? Math.abs(durationLike.seconds) : 0;
  let milliseconds = Number.isFinite(durationLike.milliseconds) ? Math.abs(durationLike.milliseconds) : 0;
  let microseconds = Number.isFinite(durationLike.microseconds) ? Math.abs(durationLike.microseconds) : 0;
  let nanoseconds = Number.isFinite(durationLike.nanoseconds) ? Math.abs(durationLike.nanoseconds) : 0;

  microseconds = (microseconds + Math.floor(nanoseconds / 1e3));
  nanoseconds = Math.floor(nanoseconds % 1e3);
  milliseconds = (milliseconds + Math.floor(microseconds / 1e3));
  microseconds = Math.floor(microseconds % 1e3);
  seconds = (seconds + Math.floor(milliseconds / 1e3));
  milliseconds = Math.floor(milliseconds % 1e3);
  minutes = (minutes + Math.floor(seconds / 60));
  seconds = Math.floor(seconds % 60);
  hours = (hours + Math.floor(minutes / 60));
  minutes = Math.floor(minutes % 60);
  days = (days + Math.floor(hours / 24));
  hours = Math.floor(hours % 24);

  if (base && (Number.isFinite(months) || Number.isFinite(years))) {
    years = years || 0;
    months = months || 0;
    let { year, month } = base;
    if (!Number.isFinite(month)) throw new Error('invalid base');
    while (days > daysInMonth(year, month)) {
      days -= daysInMonth(year, month);
      months += 1;
      month += 1;
      if (month > 12) { month = 1; year = year && (year + 1); }
    }
    while (months > 12) { months -= 12; years += 1; }
  } else {
    years = undefined;
    months = undefined;
  }

  const duration = Object.create(Duration.prototype);
  duration[DATA] = {
    years, months, days,
    hours, minutes, seconds,
    milliseconds, microseconds, nanoseconds
  };
  return duration;
}
Duration.prototype[Symbol.toStringTag] = 'Duration';
