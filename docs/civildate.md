[&laquo;][3]|[&raquo;][5]

---

# `CivilDate`

`CivilDate` (and its siblings) represents a date and time corresponding to the requirements of ISO-8601.

This means specifically that it uses the *proleptic Gregorian calendar* whose days are 24 hours
long and begin and end at midnight.

## `new CivilDate(year, month, day)`

The constructor may only be called as such. It takes 3 numeric arguments.

 * `year` the Gregorian year
 * `month` the Gregorian month
 * `day` the Gregorian day of the month

## `CivilDate.fromZonedDateTime(instant: ZonedDateTime): CivilDate`

`fromZonedDateTime` creates a new `CivilDate` object by calculating its values based of the
`ZonedDateTime` passed in.

## `date.year : number`

The `.year` property represents the year of the `CivilDate`.

## `date.month : number`

The `.month` property represents the month of the `CivilDate`.

## `date.day : number`

The `.day` property represents the day of the month of the `CivilDate`.

## `date.dayOfWeek : number`

The `.dayOfWeek` property represents the day of the week where Monday is `1` and `Sunday` is `7` in accordance with ISO-8601.

## `date.dayOfYear : number`

The `.dayOfYear` property represents the ordinal day of the Gregorian year according to ISO-8601.

## `date.weekOfYear : number`

The `.weekOfYear` property represents the ISO week-number. Beware that dates at the begining of a
year may be part of a week from the preceding year, and dates at the end of a year may be part of
a week at the beginning of the next year, as the first week of any year is defined as the week that
contains the first Thursday of the week.

## `date.plus({ years?, months?, days? }) : CivilDate`

Creates a new `CivilDate` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
 1. the individual values are added to the existing values.
 2. the range of `days` is ensured to be between 1 and 29-31 depending on the month by adjusting `month`
 3. the range of `months` is ensured to be between 1 and 12 by adjusting the `years`.

## `date.with({ years?, months?, days? }) : CivilDate`

Creates a new `CivilDate` object by overriding specified values to its members.
The specified values must be numeric if specified.

## `date.withTime(time : CivilTime) : CivilDateTime`

Combines this `CivilDate` with the passed `CivilTime` to create a new `CivilDateTime` object.

## `date.toString() : string`

Equivalent to `date.toDateString()`

## `date.toJSON() : string`

Equivalent to `date.toString()`

## `date.toDateTimeString() : string`

`.toDateString()` creates an ISO-8601 compliant string in the format:
**`year`-`month`-`day`**.

The `year` is 0-padded to a minimum of 4 digits. `month` and `day`.

## `date.toWeekDateString() : string`

`.toWeekDateString()` creates an ISO-8601 compliant string in the format:
**`year`-W`week`-`weekday`**.

The `year` is 0-padded to a minimum of 4 digits. `week`is 0-padded to a minimum of 2 digits.

The `week` is the ISO week as calculated by `.weekOfYear` and the `weekday` is the ISO week-day as
calculated by `.dayOfWeek`. The `year` may be one year before/after the `.year` property of the
`CivilDate` if the specified date is part of the last week of the previous year or the first
week of the following year.

## `date.toOrdinalDateString() : string`

`.toOrdinalDateString()` creates an ISO-8601 compliant strung in the format:
**`year`-`day-of-year`**.

The `year` is 0-padded to a minimum of 4 digits. `dof-of-year` is 0-padded to a minimum of 3 digits.

The `day-of-year` is the ordinal day as calculated by `.dayOfYear`.

## `Instant.fromDateString(isostring : string): string`

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toDateString()`.

## `Instant.fromWeekDateString(isostring : string): string`

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toWeekDateString()`.

## `Instant.fromOrdinalDateString(isostring : string): string`

Creates a new `CivilDate` by parsing an ISO-8601 string in the format created by `.toOrdinalDateString()`.

## `Instant.fromString(isostring: string): CivilDate`

Creates a new `CivilDate` by parsing an ISO-8601 string in the one of the formats created `.toDateString()`, `.toWeekDateString()` or `.toOrdinalDateString()`.

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
