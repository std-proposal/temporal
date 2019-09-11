/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export const DATA = Symbol('data');

export function pad(num, dig = 2) {
  const sign = num < 0 ? '-' : '';
  const padding = Array(dig)
    .fill('0')
    .join('');
  const value = Math.abs(num);
  const padded = `${padding}${value}`.slice(-1 * dig);
  return `${sign}${padded}`;
}

export const REGEX = {};

REGEX.YEARS = /-?\d{4}|[+-]\d{6}/;
REGEX.MONTHS = /0?[1-9]|1[0-2]/;
REGEX.DAYS = /0?[1-9]|[1-2][0-9]|3[0-1]/;
REGEX.DATE = new RegExp(`(${REGEX.YEARS.source})-(${REGEX.MONTHS.source})-(${REGEX.DAYS.source})`);

REGEX.HOURS = /[0-1][0-9]|2[0-3]/;
REGEX.MINUTES = /[0-5][0-9]/;
REGEX.SECONDS = /[0-5][0-9]|60/;
REGEX.SUBSECONDS = /\d{1,9}/;
REGEX.TIME = new RegExp(
  `(${REGEX.HOURS.source}):(${REGEX.MINUTES.source})(?::(${REGEX.SECONDS.source})(?:\.(${REGEX.SUBSECONDS.source}))?)?`
);

REGEX.DATETIME = new RegExp(`${REGEX.DATE.source}T${REGEX.TIME.source}`);
REGEX.OFFSET = /((?:\+?|\-)(?:0?[0-9]|1[0-9]|2[0-3])):?([0-5][0-9])/;
REGEX.TIMEZONE = /\[([a-zA-Z/_-]+)\]/;

const OFFRE = new RegExp(`^${REGEX.OFFSET.source}$`);

const DoM = {
  standard: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  leapyear: [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
};
export function daysInMonth(year, month) {
  return DoM[isLeapYear(year) ? 'leapyear' : 'standard'][month - 1];
}

export function isLeapYear(year) {
  if (undefined === year) return false;
  const isDiv4 = year % 4 === 0;
  const isDiv100 = year % 100 === 0;
  const isDiv400 = year % 400 === 0;
  return isDiv4 && (!isDiv100 || isDiv400);
}

export const assert = {
  type: (value, type) => {
    if ('object' !== typeof value || !(value instanceof type)) throw new TypeError('value of invalid type');
    return value;
  },
  enum: (value, ...values) => {
    if (!values.includes(value)) throw new TypeError('invalid value');
    return value;
  },
  bigint: (value) => {
    if ('bigint' !== typeof value) throw new TypeError('value has to be BigInt');
    return value;
  },
  integer: (value) => {
    if ('number' !== typeof value || Number.isNaN(value) || !Number.isFinite(value) || !Number.isInteger(value))
      throw new TypeError('value has to be integer');
    return value;
  },
  positive: (value) => {
    if (
      'number' !== typeof value ||
      Number.isNaN(value) ||
      !Number.isFinite(value) ||
      !Number.isInteger(value) ||
      value < 0
    )
      throw new TypeError('value has to be positive integer');
    return value;
  },
  range(value, min, max) {
    if (
      'number' !== typeof value ||
      Number.isNaN(value) ||
      !Number.isFinite(value) ||
      !Number.isInteger(value) ||
      value < min ||
      value > max
    )
      throw new TypeError(`value has to be an integer between ${min} and ${max}`);
    return value;
  },
  datelike(value) {
    assert.type(value, Object);
    assert.integer(value.year);
    assert.range(value.month, 1, 12);
    assert.range(value.day, 1, daysInMonth(value.year, value.month));
    return value;
  },
  timelike(value) {
    assert.type(value, Object);
    assert.range(value.hour, 0, 23);
    assert.range(value.minute, 0, 59);
    if ('undefined' !== value.second) assert.range(value.second, 0, 60);
    if ('undefined' !== value.millisecond) assert.range(value.millisecond, 0, 999);
    if ('undefined' !== value.microsecond) assert.range(value.microsecond, 0, 999);
    if ('undefined' !== value.nanosecond) assert.range(value.nanosecond, 0, 999);
    return value;
  },
  datetimelike(value) {
    assert.datelike(value);
    assert.timelike(value);
    return value;
  }
};

export function copyProps(...objs) {
  const result = {};
  for (let obj of objs) {
    if ((undefined !== obj.year) && Number.isInteger(obj.year)) result.year = obj.year;
    if ((undefined !== obj.month) && Number.isInteger(obj.month)) result.month = obj.month;
    if ((undefined !== obj.day) && Number.isInteger(obj.day)) result.day = obj.day;
    if ((undefined !== obj.hour) && Number.isInteger(obj.hour)) result.hour = obj.hour;
    if ((undefined !== obj.minute) && Number.isInteger(obj.minute)) result.minute = obj.minute;
    if ((undefined !== obj.second) && Number.isInteger(obj.second)) result.second = obj.second;
    if ((undefined !== obj.millisecond) && Number.isInteger(obj.millisecond)) result.millisecond = obj.millisecond;
    if ((undefined !== obj.microsecond) && Number.isInteger(obj.microsecond)) result.microsecond = obj.microsecond;
    if ((undefined !== obj.nanosecond) && Number.isInteger(obj.nanosecond)) result.nanosecond = obj.nanosecond;
  }
  return result;
}

export function toDayOfWeek(year, month, day) {
  const m = month + (month < 3 ? 10 : -2);
  const Y = year - (month < 3 ? 1 : 0);

  const c = Math.floor(Y / 100);
  const y = Y - c * 100;
  const d = day;

  const pD = d;
  const pM = Math.floor(2.6 * m - 0.2);
  const pY = y + Math.floor(y / 4);
  const pC = Math.floor(c / 4) - 2 * c;

  const dow = (pD + pM + pY + pC) % 7;

  return dow + (dow < 0 ? 7 : 0);
}
export function toDayOfYear(year, month, day) {
  let days = day;
  for (let m = month - 1; m > 0; m--) {
    days += daysInMonth(year, m);
  }
  return days;
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
    if ((isLeapYear(year) ? 366 : 365) - doy < 4 - dow) {
      return 1;
    }
  }

  return week;
}

export function offsetString(offsetMilliseconds) {
  const direction = offsetMilliseconds < 0 ? '-' : '+';
  const offsetMinutes = Math.floor(Math.abs(offsetMilliseconds) / 6e4);
  const hours = Math.floor(offsetMinutes / 60);
  const minutes = Math.floor(offsetMinutes % 60);
  return `${direction}${('00' + hours).slice(-2)}:${('00' + minutes).slice(-2)}`;
}

export function isOffset(string) {
  return !!OFFRE.exec(string);
}
export function parseOffsetString(string) {
  const match = OFFRE.exec(string);
  if (!match) return;
  const hours = +match[1];
  const minutes = +match[2];
  return (hours * 60 + minutes) * 60 * 1000;
}

export function padYear(value) {
  if (value > 999 && value < 9999) return pad(value, 4);
  const sign = value < 0 ? '-' : '+';
  value = Math.abs(value);
  return `${sign}${value}`;
}

export const EARLIER = Symbol('earlier');
export const LATER = Symbol('later');

export function balance(data, truncate = false) {
  if (data.month !== undefined || data.day !== undefined) {
    if (data.month < 1) {
      data.year += Math.ceil(data.month / 12);
      data.month = data.month % 12;
      data.year -= data.month < 1 ? 1 : 0;
      data.month += data.month < 1 ? 12 : 0;
    }
    if (data.month > 12) {
      data.year += Math.floor(data.month / 12);
      data.month = data.month % 12;
    }

    if (truncate) {
      data.day = Math.min(data.day, daysInMonth(data.year, data.month));
    }
    while (data.day > (isLeapYear(data.year) ? 366 : 365)) {
      data.year += 1;
      data.day -= isLeapYear(data.year) ? 366 : 365;
    }
    while (data.day < (isLeapYear(data.year) ? -366 : -365)) {
      data.year -= 1;
      data.day += isLeapYear(data.year) ? 366 : 365;
    }
    while (data.day > daysInMonth(data.year, data.month)) {
      data.day -= daysInMonth(data.year, data.month);
      data.month += 1;
      if (data.month > 12) {
        data.year += 1;
        data.month -= 12;
      }
    }
    while (data.day < 1) {
      data.month -= 1;
      if (data.month < 1) {
        data.year -= 1;
        data.month += 12;
      }
      data.day += daysInMonth(data.year, data.month) + 1;
    }
  }

  if (data.hour !== undefined || data.minute !== undefined) {
    if (data.nanosecond > 999) {
      data.microsecond += Math.floor(data.nanosecond / 1000);
      data.nanosecond = data.nanosecond % 1000;
    }
    if (data.nanosecond < 0) {
      data.microsecond += Math.ceil(data.nanosecond / 1000) - 1;
      data.nanosecond = 1000 + (data.nanosecond % 1000);
    }

    if (data.microsecond > 999) {
      data.millisecond += Math.floor(data.microsecond / 1000);
      data.microsecond = data.microsecond % 1000;
    }
    if (data.microsecond < 0) {
      data.millisecond += Math.ceil(data.microsecond / 1000) - 1;
      data.microsecond = 1000 + (data.microsecond % 1000);
    }

    if (data.millisecond > 999) {
      data.second += Math.floor(data.millisecond / 1000);
      data.millisecond = data.millisecond % 1000;
    }
    if (data.millisecond < 0) {
      data.second += Math.ceil(data.millisecond / 1000) - 1;
      data.millisecond = 1000 + (data.millisecond % 1000);
    }

    if (data.second > 59) {
      data.minute += Math.floor(data.second / 60);
      data.second = data.second % 60;
    }
    if (data.second < 0) {
      data.minute += Math.ceil(data.second / 60) - 1;
      data.second = 60 + (data.second % 60);
    }

    if (data.minute > 59) {
      data.hour += Math.floor(data.minute / 60);
      data.minute = data.minute % 60;
    }
    if (data.minute < 0) {
      data.hour += Math.ceil(data.minute / 60) - 1;
      data.minute = 60 + (data.minute % 60);
    }

    if (data.hour > 23) {
      if (data.day !== undefined) {
        data.day += Math.floor(data.hour / 24);
      }
      data.hour = data.hour % 24;
    }
    if (data.hour < 0) {
      if (data.day !== undefined) {
        data.day += Math.ceil(data.hour / 24) - 1;
      }
      data.hour = 24 + (data.hour % 24);
    }
  }

  if (data.month !== undefined || data.day !== undefined) {
    while (data.day > (isLeapYear(data.year) ? 366 : 365)) {
      data.year += 1;
      data.day -= isLeapYear(data.year) ? 366 : 365;
    }
    while (data.day < (isLeapYear(data.year) ? -366 : -365)) {
      data.year -= 1;
      data.day += isLeapYear(data.year) ? 366 : 365;
    }
    while (data.day > daysInMonth(data.year, data.month)) {
      data.day -= daysInMonth(data.year, data.month);
      data.month += 1;
      if (data.month > 12) {
        data.year += 1;
        data.month -= 12;
      }
    }
    while (data.day < 1) {
      data.month -= 1;
      if (data.month < 1) {
        data.year -= 1;
        data.month += 12;
      }
      data.day += daysInMonth(data.year, data.month);
    }

    if (data.month < 1) {
      data.year += Math.ceil(data.month / 12);
      data.month = data.month % 12;
      data.year -= data.month < 1 ? 1 : 0;
      data.month += data.month < 1 ? 12 : 0;
    }
    if (data.month > 12) {
      data.year += Math.floor(data.month / 12);
      data.month = data.month % 12;
    }
  }
}
