export interface DateLike {
  year?: number;
  month?: number;
  day?: number;
}
export interface TimeLike {
  hour?: number;
  minute?: number;
  second?: number;
  millisecond?: number;
  microsecond?: number;
  nanosecond?: number;
}
export interface DateTimeLike extends DateLike, TimeLike {
}
export interface DurationLike {
  years?: number;
  months?: number;
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
  microseconds?: number;
  nanoseconds?: number;
}

export class Instant {
  constructor(epochNanoseconds: bigint);
  readonly epochSeconds: number;
  readonly epochMilliseconds: number;
  readonly epochMicroseconds: number;
  readonly epochNanoseconds: number;
  withZone(ianaZone: string) : ZonedDateTime;
  withOffset(offset: string) : OffsetDateTime;
  toString() : string;
  toJSON() : string;
  static fromEpochNanoseconds(epochNanos : bigint) : Instant;
  static fromEpochMicroseconds(epochMicros : bigint) : Instant;
  static fromEpochMilliseconds(epochMillis: number) : Instant;
  static fromEpochSeconds(epochSeconds: number) : Instant;
  static fromString(isoString: string) : Instant;
}
export class OffsetDateTime implements DateTimeLike {
  constructor(instant: Instant, offset : string);
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;
  readonly dayOfWeek: number;
  readonly dayOfYear: number;
  readonly weekOfYear: number;
  readonly offset: string;
  with(values : DateTimeLike) : OffsetDateTime;
  plus(values : DurationLike) : OffsetDateTime;
  minus(values : DurationLike) : OffsetDateTime;

  withZone(ianaZone: string) : ZonedDateTime;

  getCivilDateTime() : CivilDateTime;
  getCivilDate() : CivilDate;
  getCivilTime() : CivilTime;
  getCivilYearMonth() : CivilYearMonth;
  getCivilMonthDay() : CivilMonthDay;

  toString() : string;
  toJSON() : string;
  static fromString(isoString: string) : OffsetDateTime;
}
export class ZonedDateTime implements DateTimeLike {
  constructor(instant: Instant, ianaZone : string);
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;
  readonly dayOfWeek: number;
  readonly dayOfYear: number;
  readonly weekOfYear: number;
  readonly offset: string;
  readonly timeZone: string;
  with(values : DateTimeLike) : ZonedDateTime;
  
  getOffsetDateTime() : OffsetDateTime;
  getCivilDateTime() : CivilDateTime;
  getCivilDate() : CivilDate;
  getCivilTime() : CivilTime;
  getCivilYearMonth() : CivilYearMonth;
  getCivilMonthDay() : CivilMonthDay;

  toString() : string;
  toJSON() : string;

  static fromString(isoString: string) : ZonedDateTime;
  static isValidTimezone(timeZone : string) : boolean;

  static EARLIER: symbol;
  static LATER: symbol;
}
export class CivilDateTime implements DateTimeLike {
  constructor(year: number, month: number, day:number, hour: number, minute: number, second?: number, millisecond?: number, microsecond?: number, nanosecond?: number);
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;
  readonly dayOfWeek: number;
  readonly dayOfYear: number;
  readonly weekOfYear: number;

  with(values : DateTimeLike) : CivilDateTime;
  plus(values : DurationLike) : CivilDateTime;
  minus(values : DurationLike) : CivilDateTime;
  difference(other : DateTimeLike) : Duration;

  withZone(ianaZone : string, filter?: string | ZonedDateTime.EARLIER | ZonedDateTime.LATER) : ZonedDateTime;
  withOffset(offset : string) : OffsetDateTime 
  
  getCivilDate() : CivilDate;
  getCivilTime() : CivilTime;
  getCivilYearMonth() : CivilYearMonth;
  getCivilMonthDay() : CivilMonthDay;

  toString() : string;
  toJSON() : string;

  static fromString(isoString: string) : CivilDateTime;
}
export class CivilDate implements DateLike {
  constructor(year: number, month: number, day:number);
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly dayOfWeek: number;
  readonly dayOfYear: number;
  readonly weekOfYear: number;

  with(values : DateLike) : CivilDate;
  plus(values : DurationLike) : CivilDate;
  minus(values : DurationLike) : CivilDate;
  difference(other : DateLike) : Duration;

  withTime(time: TimeLike) : CivilDateTime;
  
  getCivilYearMonth() : CivilYearMonth;
  getCivilMonthDay() : CivilMonthDay;

  toString() : string;
  toJSON() : string;

  static fromString(isoString: string) : CivilDate;
}
export class CivilTime implements TimeLike {
  constructor(hour: number, minute: number, second?: number, millisecond?: number, microsecond?: number, nanosecond?: number);
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly microsecond: number;
  readonly nanosecond: number;

  with(values : TimeLike) : CivilTime;
  plus(values : DurationLike) : CivilTime;
  minus(values : DurationLike) : CivilTime;
  difference(other : TimeLike) : Duration;
  
  withDate(date : DateLike) : CivilDateTime;

  toString() : string;
  toJSON() : string;

  static fromString(isoString: string) : CivilTime;
}
export class CivilYearMonth implements DateLike {
  constructor(year : number, month : number);
  readonly year : number;
  readonly month : number;

  with(date : DateLike) : CivilYearMonth;
  plus(duration : DurationLike) : CivilYearMonth;
  minus(duration : DurationLike) : CivilYearMonth;
  difference(other : DurationLike) : Duration;

  withDay(day : number) : CivilDate;
  toString() : String;
  toJSON() : String;
  fromString(iso : string) : CivilMonthDay
}
export class CivilMonthDay implements DateLike {
  constructor(month : number, day : number);
  readonly month : number;
  readonly day : number;

  with(date : DateLike) : CivilMonthDay;
  plus(duration : DurationLike) : CivilMonthDay;
  minus(duration : DurationLike) : CivilMonthDay;
  difference(other : DurationLike) : Duration;

  withYear(year : number) : CivilDate;
  toString() : String;
  toJSON() : String;
  fromString(iso : string) : CivilMonthDay
}
export class Duration implements DurationLike {
  readonly years?: number;
  readonly months?: number;
  readonly days?: number;
  readonly hours: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly milliseconds: number;
  readonly microseconds: number;
  readonly nanoseconds: number;
}
