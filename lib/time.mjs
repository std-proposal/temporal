/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import { DATA, REGEX, assert, pad, copyProps, balance } from './shared.mjs';
import { cast as castDuration } from './duration.mjs';
import { DateTime } from './datetime.mjs';

const RE_DT = new RegExp(`^${REGEX.TIME.source}$`);

export class Time {
  constructor(hour, minute, second = 0, millisecond = 0, microsecond = 0, nanosecond = 0) {
    assert.range(hour, 0, 23);
    assert.range(minute, 0, 59);
    assert.range(second, 0, 60);
    assert.range(millisecond, 0, 999);
    assert.range(microsecond, 0, 999);
    assert.range(nanosecond, 0, 999);
    second = Math.min(59, second);
    this[DATA] = { hour, minute, second, millisecond, microsecond, nanosecond };
  }

  get hour() {
    return this[DATA].hour;
  }
  get minute() {
    return this[DATA].minute;
  }
  get second() {
    return this[DATA].second;
  }
  get millisecond() {
    return this[DATA].millisecond;
  }
  get microsecond() {
    return this[DATA].microsecond;
  }
  get nanosecond() {
    return this[DATA].nanosecond;
  }

  withDate({ year, month, day }) {
    return new DateTime(
      year,
      month,
      day,
      this.hour,
      this.minute,
      this.second,
      this.millisecond,
      this.microsecond,
      this.nanosecond
    );
  }
  with({
    hour = this.hour,
    minute = this.minute,
    second = this.second,
    millisecond = this.millisecond,
    microsecond = this.microsecond,
    nanosecond = this.nanosecond
  } = {}) {
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }

  difference(other = {}) {
    other = copyProps(
      {
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0
      },
      other
    );
    const [one, two] = [this, other].sort(Time.compare);

    let hours = two.hour - one.hour;
    let minutes = two.minute - one.minute;
    let seconds = two.second - one.second;
    let milliseconds = two.millisecond - one.millisecond;
    let microseconds = two.microsecond - one.microsecond;
    let nanoseconds = two.nanosecond - one.nanosecond;

    while (nanoseconds < 0) {
      nanoseconds += 1e3;
      microseconds -= 1;
    }
    while (nanoseconds >= 1e3) {
      nanoseconds -= 1e3;
      microseconds += 1;
    }

    while (microseconds < 0) {
      microseconds += 1e3;
      milliseconds -= 1;
    }
    while (microseconds >= 1e3) {
      microseconds -= 1e3;
      milliseconds += 1;
    }

    while (milliseconds < 0) {
      milliseconds += 1e3;
      seconds -= 1;
    }
    while (milliseconds >= 1e3) {
      milliseconds -= 1e3;
      seconds += 1;
    }

    while (seconds < 0) {
      seconds += 60;
      minutes -= 1;
    }
    while (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
    }

    while (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    while (hours < 0) {
      hours += 24;
      days -= 1;
      day -= 1;
    }
    while (hours >= 24) {
      hours -= 24;
      days += 1;
      day += 1;
    }

    return castDuration({
      hours,
      minutes,
      seconds,
      milliseconds,
      microseconds,
      nanoseconds
    });
  }
  plus(duration) {
    duration = castDuration(duration);
    if (duration.years || duration.months || duration.days) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    const data = copyProps(this);

    data.hour += duration.hours || 0;
    balance(data);

    data.minute += duration.minutes || 0;
    balance(data);

    data.second += duration.seconds || 0;
    balance(data);

    data.millisecond += duration.milliseconds || 0;
    balance(data);

    data.microsecond += duration.microseconds || 0;
    balance(data);

    data.nanosecond += duration.nanoseconds || 0;
    balance(data);

    const { hour, minute, second, millisecond, microsecond, nanosecond } = data;
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  minus(duration) {
    duration = castDuration(duration);
    if (duration.years || duration.months || duration.days) {
      throw new RangeError(`invalid duration: ${duration}`);
    }

    const data = copyProps(this);

    data.hour -= duration.hours || 0;
    balance(data);

    data.minute -= duration.minutes || 0;
    balance(data);

    data.second -= duration.seconds || 0;
    balance(data);

    data.millisecond -= duration.milliseconds || 0;
    balance(data);

    data.microsecond -= duration.microseconds || 0;
    balance(data);

    data.nanosecond -= duration.nanoseconds || 0;
    balance(data);

    const { hour, minute, second, millisecond, microsecond, nanosecond } = data;
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }

  toString() {
    const tp = [];
    tp.push(pad(this.hour, 2));
    tp.push(pad(this.minute, 2));

    const sp = [];
    if (this.nanosecond) sp.unshift(pad(this.nanosecond, 3));
    if (this.microsecond || sp.length) sp.unshift(pad(this.microsecond, 3));
    if (this.millisecond || sp.length) sp.unshift(pad(this.millisecond, 3));
    if (this.second || sp.length) {
      if (sp.length) {
        tp.push(`${pad(this.second, 2)}.${sp.join('')}`);
      } else {
        tp.push(pad(this.second, 2));
      }
    }
    return tp.join(':');
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid Time string');
    const hour = +match[1];
    const minute = +match[2];
    const second = match[3] === undefined ? 0 : +match[3];
    const millisecond = +`${match[4] === undefined ? '' : match[4]}000000000`.slice(0, 3);
    const microsecond = +`${match[4] === undefined ? '' : match[4]}000000000`.slice(3, 6);
    const nanosecond = +`${match[4] === undefined ? '' : match[4]}000000000`.slice(6, 9);
    return new Time(hour, minute, second, millisecond, microsecond, nanosecond);
  }
  static compare(one, two) {
    assert.timelike(one);
    assert.timelike(two);
    if (one.hour !== two.hour) return one.hour - two.hour;
    if (one.minute !== two.minute) return one.minute - two.minute;
    if (one.second !== two.second) return one.second - two.second;
    if (one.millisecond !== two.millisecond) return one.millisecond - two.millisecond;
    if (one.microsecond !== two.microsecond) return one.microsecond - two.microsecond;
    if (one.nanosecond !== two.nanosecond) return other.nanosecond - two.nanosecond;
    return 0;
  }
}
