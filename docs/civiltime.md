[&laquo;][4]|[&raquo;][1]

---

# `CivilTime`

`CivilTime` (and its siblings) represents a time corresponding to the requirements of ISO-8601.

This means specifically that days are 24 hours long and begin and end at midnight.

## `new CivilTime(hours, minutes, seconds?, milliseconds? microseconds?, nanoseconds?)`

The constructor may only be called as such. It takes between 2 and 4 numeric arguments.

 * `hours` hour of the day
 * `minutes` minutes of the hour
 * `seconds` seconds of the minutes *(default: 0)*
 * `milliseconds` milliseconds of the second *(default: 0)*
 * `microseconds` microseconds of the millisecond *(default: 0)*
 * `nanoseconds` nanoseconds of the microseconds *(default: 0)*

## `datetime.hour : number`

The `.hour` property represents the hour of the `CivilTime`.

## `datetime.minute : number`

The `.minute` property represents the minute of the hour of the `CivilTime`.

## `datetime.second : number`

The `.second` property represents the second of the minute of the `CivilTime`.

## `datetime.millisecond : number`

The `.millisecond` property represents the sub-second component of the second of the `CivilTime` with millisecond precision. It will have a value between 0 and 999.

## `datetime.microsecond : number`

The `.microsecond` property represents the sub-millisecond component of the millisecond of the `CivilTime` with microsecond precision. It will have a value between 0 and 999.

## `datetime.nanosecond : number`

The `.nanosecond` property represents the sub-microsecond component of the microsecond of the `CivilTime` with nanosecond precision. It will have a value between 0 and 999.

## `datetime.plus({ hours?, minutes?, seconds?, milliseconds?, microseconds?, nanoseconds? }) : CivilTime`

Creates a new `CivilTime` object by adding (subtracting for negative values) values to its members.
The specified values must be numeric if specified.

The algorithm is such that:
 1. the individual values are added to the existing values.
 2. the range of `nanoseconds` is ensured to be between 0 and 999 by adjusting the `microseconds`
 3. the range of `microseconds` is ensured to be between 0 and 999 by adjusting the `milliseconds`
 4. the range of `milliseconds` is ensured to be between 0 and 999 by adjusting the `seconds`
 5. the range of `seconds` is ensured to be between 0 and 59 by adjusting the `minutes`
 6. the range of `minutes` is ensured to be between 0 and 59 by adjusting the `hours`
 7. the range of `hours` is ensured to be between 0 and 23

## `datetime.with({ hours?, minutes?, seconds?, milliseconds?, microseconds?, nanoseconds? }) : CivilTime`

Creates a new `CivilTime` object by overriding specified values to its members.
The specified values must be numeric if specified.

## `date.withDate(date : CivilDate) : CivilDateTime`

Combines this `CivilTime` with the passed `CivilDate` to create a new `CivilDateTime` object.

## `datetime.toString() : string`

`.toString()` creates an ISO-8601 compliant string in the format:
**`hour`:`minute`:`second`.`nanosecond`**.

The `hours`, `minutes` and `seconds` are 0-padded to a minimum of 2 digits.
`nanoseconds` is 0-padded to a minimum of 9 digits.

## `datetime.toJSON() : string`

Equivalent to `datetime.toString()`

## `Instant.fromString(isostring : string): string`

Creates a new `CivilTime` by parsing an ISO-8601 string in the format created by `.toString()`.

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
