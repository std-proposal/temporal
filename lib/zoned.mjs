import { DATA, REGEX, assert, parseOffsetString, offsetString, EARLIER } from './shared.mjs';
import { Instant } from './instant.mjs';
import { TimeZone } from './timezone.mjs';
import { DateTime } from './datetime.mjs';

const RE_DT = new RegExp(`^${REGEX.DATETIME.source}${REGEX.OFFSET.source}(?:${REGEX.TIMEZONE.source})?$`);

export class ZonedDateTime {
  constructor(instant, timeZone) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);
    assert.type(instant, Instant);
    const dateTime = timeZone.dateTime(instant);
    this[DATA] = { instant, timeZone, dateTime };
  }
  get year() {
    return this[DATA].dateTime.year;
  }
  get month() {
    return this[DATA].dateTime.month;
  }
  get day() {
    return this[DATA].dateTime.day;
  }
  get hour() {
    return this[DATA].dateTime.hour;
  }
  get minute() {
    return this[DATA].dateTime.minute;
  }
  get second() {
    return this[DATA].dateTime.second;
  }
  get millisecond() {
    return this[DATA].dateTime.millisecond;
  }
  get microsecond() {
    return this[DATA].dateTime.microsecond;
  }
  get nanosecond() {
    return this[DATA].dateTime.nanosecond;
  }
  get dayOfWeek() {
    return this[DATA].dateTime.dayOfWeek;
  }
  get dayOfYear() {
    return this[DATA].dateTime.dayOfYear;
  }
  get weekOfYear() {
    return this[DATA].dateTime.weekOfYear;
  }
  get timeZone() {
    return this[DATA].timeZone.name;
  }

  getInstant() {
    return this[DATA].instant;
  }
  getTimeZone() {
    return this[DATA].timeZone;
  }
  getDateTime() {
    return this[DATA].dateTime;
  }
  getDate() {
    return this.getDateTime().getDate();
  }
  getTime() {
    return this.getDateTime().getTime();
  }
  getYearMonth() {
    return this.getDateTime().getYearMonth();
  }
  getMonthDay() {
    return this.getDateTime().getYearMonth();
  }

  with(
    {
      year = this.year,
      month = this.month,
      day = this.day,
      hour = this.hour,
      minute = this.minute,
      second = this.second,
      millisecond = this.millisecond,
      microsecond = this.microsecond,
      nanosecond = this.nanosecond
    },
    choice = EARLIER
  ) {
    const timeZone = this.getTimeZone();
    const dateTime = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);

    const instants = timeZone.instants(dateTime);
    let instant;
    switch (choice) {
      case EARLIER:
        instant = instants.shift();
        break;
      case LATER:
        instant = instants.pop();
        break;
      default:
        instant = instant.find((instant) => timeZone.offset(instant) === choice);
        break;
    }
    if (!instant) throw TypeError('invalid DateTime data for TimeZone');

    return Object.create(ZonedDateTime.prototype, {
      [DATA]: { value: Object.freeze({ instant, timeZone, dateTime }) }
    });
  }
  sameDateTimeWithZone(timeZone, choice = EARLIER) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);
    const dateTime = this.getDateTime();

    const instants = timeZone.instants(dateTime);
    let instant;
    switch (choice) {
      case EARLIER:
        instant = instants.shift();
        break;
      case LATER:
        instant = instants.pop();
        break;
      default:
        instant = instant.find((instant) => timeZone.offset(instant) === choice);
        break;
    }
    if (!instant) throw TypeError('invalid DateTime data for TimeZone');

    return Object.create(ZonedDateTime.prototype, {
      [DATA]: { value: Object.freeze({ instant, timeZone, dateTime }) }
    });
  }
  sameInstantWithZone(timeZone) {
    timeZone = TimeZone.for(`${timeZone}`);
    assert.type(timeZone, TimeZone);

    const instant = this.getInstant();
    const dateTime = timeZone.dateTime(instant);

    return Object.create(ZonedDateTime.prototype, {
      [DATA]: { value: Object.freeze({ instant, timeZone, dateTime }) }
    });
  }

  toString() {
    const instant = this.getInstant();
    const timeZone = this.getTimeZone();
    const offset = timeZone.offset(instant);
    const zoneName = timeZone.name === offset ? '' : `[${timeZone.name}]`;
    return `${this.getDateTime()}${offset}${zoneName}`;
  }
  toJSON() {
    return this.toString();
  }

  static fromString(iso) {
    const match = RE_DT.exec(iso);
    if (!match) throw new TypeError('invalid ZonedDateTime string');
    const year = +match[1];
    const month = +match[2];
    const day = +match[3];
    const hour = +match[4];
    const minute = +match[5];
    const second = match[6] === undefined ? 0 : +match[6];
    const millisecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(0, 3);
    const microsecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(3, 6);
    const nanosecond = +`${match[7] === undefined ? '' : match[7]}000000000`.slice(6, 9);
    const offset = offsetString(parseOffsetString(`${match[8]}:${match[9]}`));
    const tzname = match[10] || offset;
    const timeZone = TimeZone.for(tzname);
    const dateTime = new DateTime(year, month, day, hour, minute, second, millisecond, microsecond, nanosecond);
    const instant = timeZone
      .instants(dateTime)
      .filter((instant) => timeZone.offset(instant) === offset)
      .shift();
    if (!instant) throw TypeError('invalid ZonedDateTime string');
    return Object.create(ZonedDateTime.prototype, {
      [DATA]: { value: Object.freeze({ instant, timeZone, dateTime }) }
    });
  }
}
