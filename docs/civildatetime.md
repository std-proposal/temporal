[&laquo;][2]|[&raquo;][4]

---

# `CivilDateTime`

`CivilDateTime` (and its siblings) represents a date and time corresponding to the requirements of ISO-8601.

This means specifically that it uses the *proleptic Gregorian calendar* whose days are 24 hours
long and begin and end at midnight.

## `new CivilDateTime(year, month, day, hours, minutes, seconds?, milliseconds?, microseconds?, nanoseconds?)`

The constructor may only be called as such. It takes between 5 and 7 numeric arguments.

 * `year` the Gregorian year
 * `month` the Gregorian month
 * `day` the Gregorian day of the month
 * `hours` hour of the day
 * `minutes` minutes of the hour
 * `seconds` seconds of the minutes *(default: 0)*
 * `milliseconds` milliseconds of the seconds *(default: 0)*
 * `microseconds` microseconds of the milliseconds *(default: 0)*
 * `nanoseconds` nanoseconds of the microseconds *(default: 0)*

## `CivilDateTime.fromZonedDateTime(instant: ZonedDateTime): CivilDateTime`

`fromZonedDateTime` creates a new `CivilDateTime` object by calculating its values based of the
`ZonedDateTime` passed in.

## `datetime.year : number`

The `.year` property represents the year of the `CivilDateTime`.

## `datetime.month : number`

The `.month` property represents the month of the `CivilDateTime`.

## `datetime.day : number`

The `.day` property represents the day of the month of the `CivilDateTime`.

## `datetime.hour : number`

The `.hour` property represents the hour of the `CivilDateTime`.

## `datetime.minute : number`

The `.minute` property represents the minute of the hour of the `CivilDateTime`.

## `datetime.second : number`

The `.second` property represents the second of the minute of the `CivilDateTime`.

## `datetime.millisecond : number`

The `.millisecond` property represents the sub-second component of the hour of the `CivilDateTime` with millisecond precision. It will have a value between 0 and 999.

## `datetime.microsecond : number`

The `.microsecond` property represents the sub-millisecond component of the hour of the `CivilDateTime` with microsecond precision. It will have a value between 0 and 999.

## `datetime.nanosecond : number`

The `.nanosecond` property represents the sub-second component of the hour of the `CivilDateTime` with nanosecond precision. It will have a value between 0 and 999.

## `datetime.dayOfWeek : number`

The `.dayOfWeek` property represents the day of the week where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601.

## `datetime.dayOfYear : number`

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

## `datetime.weekOfYear : number`

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a
year may be part of a week from the preceding year, and dates at the end of a year may be part of
a week at the beginning of the next year, as the first week of any year is defined as the week that
contains the first Thursday of the week.

## `datetime.plus({ years?, months?, days?, hours?, minutes?, seconds?, milliseconds?, microseconds?, nanoseconds? }) : CivilDateTime`

Creates a new `CivilDateTime` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
 1. the individual values are added to the existing values.
 2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
 3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
 4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
 5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
 6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
 7. the range of `hours` is ensured to be between 0 and 23 by adjusting `days`
 8. the range of `days` is ensured to be between 1 and 29-31 depending on the month by adjusting `month`
 9. the range of `months` is ensured to be between 1 and 12 by adjusting the `years`.

## `datetime.with({ years?, months?, days?, hours?, minutes?, seconds?, milliseconds?, microseconds?, nanoseconds? }) : CivilDateTime`

Creates a new `CivilDateTime` object by overriding specified values to its members.
The specified values must be numeric if specified.

## `datetime.withZone(zone : string, filter?: string | number | function) : ZonedDateTime`

Creates a `ZonedDateTime` object from this `CivilDateTime` within a specific time-zone. The
`zone` must be a `string` specifying an IANA-Timezone or an offset string as defined in [ZonedDateTime](./zoned.md).
The `filter` argument can be either a `string` in the offset format, a number specifying the seconds offset from UTC, or a function that can be passed to `Array.prorotype.find` to decide which possible
result to choose.

Since a given `CivilDateTime` can specify multiple `ZonedDateTime`s with different offsets (near DST changes), this can be used to be unambiguous in which result is selected.

If no `filter` is passed, then the earlier result of potentially multiple is chosen.

If no result can be created, because the sepcified time does not exist in the specified timezone or
the passed `filter` does not match a result, then an Error will be thrown.

## `datetime.toString() : string`

Equivalent to `datetime.toDateTimeString()`

## `datetime.toJSON() : string`

Equivalent to `datetime.toString()`

## `datetime.toDateTimeString() : string`

`.toDateTimeString()` creates an ISO-8601 compliant string in the format:
**`year`-`month`-`day`T`hour`:`minute`:`second`.`nanosecond`**.

The `year` is 0-padded to a minimum of 4 digits. `month`, `day`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits.

## `datetime.toWeekDateTimeString() : string`

`.toWeekDateTimeString()` creates an ISO-8601 compliant string in the format:
**`year`-W`week`-`weekday`T`hour`:`minute`:`second`.`nanosecond`**.

The `year` is 0-padded to a minimum of 4 digits. `week`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits.

The `week` is the ISO week as calculated by `.weekOfYear` and the `weekday` is the ISO week-day as
calculated by `.dayOfWeek`. The `year` may be one year before/after the `.year` property of the
`CivilDateTime` if the specified date is part of the last week of the previous year or the first
week of the following year.

## `datetime.toOrdinalDateTimeString() : string`

`.toOrdinalDateTimeString()` creates an ISO-8601 compliant strung in the format:
**`year`-`day-of-year`T`hour`:`minute`:`second`.`nanosecond`**.

The `year` is 0-padded to a minimum of 4 digits. `dof-of-year`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits.

The `day-of-year` is the ordinal day as calculated by `.dayOfYear`.

## `Instant.fromDateTimeString(isostring : string): string`

Creates a new `CivilDateTime` by parsing an ISO-8601 string in the format created by `.toDateTimeString()`.

## `Instant.fromWeekDateTimeString(isostring : string): string`

Creates a new `CivilDateTime` by parsing an ISO-8601 string in the format created by `.toWeekDateTimeString()`.

## `Instant.fromOrdinalDateTimeString(isostring : string): string`

Creates a new `CivilDateTime` by parsing an ISO-8601 string in the format created by `.toOrdinalDateTimeString()`.

## `Instant.fromString(isostring: string): CivilDateTime`

Creates a new `CivilDateTime` by parsing an ISO-8601 string in the one of the formats created `.toDateTimeString()`, `.toWeekDateTimeString()` or `.toOrdinalDateTimeString()`.

---

 * [Instant][1]
 * [ZonedDateTime][2]
 * [CivilDateTime][3]
 * [CivilDate][4]
 * [CivilTime][5]

[1]: instant.md "Instant"
[2]: zoned.md "ZonedDateTime"
[3]: civildatetime.md "CivilDateTime"
[4]: civildate.md "CivilDate"
[5]: civiltime.md "CivilTime"
