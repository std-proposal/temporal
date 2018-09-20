[&laquo;][5]|[&raquo;][2]

---

# `Instant`

An `Instant` is an object that specifies a specific point in time. For convenience of interoperatbility it uses *nanoseconds since the unix-epoch* to do so.

## `new Instant(nanos_since_epoch : BigInt)`

The constructor may only be called as such. It's only argument is a `BigInt` value that
represents the *nanoseconds since the unix-epoch* of the instant.

## `Instant.fromString(isostring: string) : Instant`

Parses a `string` that must be in the same ISO-8601 format as produced by `instant.toString()`
and creates a new `Instant` object from it.

## `Instant.fromSeconds(seconds: number) : Instant`

Equivalent to `Instant.fromMilliseconds(seconds * 1000)`.

## `Instant.fromMilliseconds(milliseconds : number) : Instant`

Equivalent to `Instant.fromMicroseconds(BigInt(milliseconds) * 1000n)`.

## `Instant.fromMicroseconds(micros: BigInt) : Instant`

Equivalent to `Instant.fromNanoseconds(BigInt(micros) * 1000n)`.

## `Instant.fromNanoseconds(nanos: BigInt) : Instant`

Equivalent to `new Instant(nanos)`.

## `instant.seconds : number`

The `seconds` property of an `Instant` object is readonly and represents the *seconds
since unix-epoch*.

## `instant.milliseconds: number`

The `milliseconds` property of an `Instant` object is readonly and represents the *milliseconds
since unix-epoch*.

## `instant.microseconds: BigInt`

The `microseconds` property of an `Instant` object is readonly and represents the *microseconds
since unix-epoch*.

## `instant.nanoseconds: BigInt`

The `nanoseconds` property of an `Instant` object is readonly and represents the *nanoseconds
since unix-epoch*.

## `instant.withZone(timeZone : string) : ZonedDateTime`

This creates a `ZonedDateTime` by applying a *iana timezone* or an *offset-string* to the instant.

This is equivalent to `new ZonedDateTime(instant, zone)`

## `instant.toString() : string`

Creates an ISO-8601 DateTime-String that always uses the 'Z' timezone postfix.

The schema is: **`year`-`month`-`day`T`hours`:`minutes`:`seconds`.`nanoseconds`Z**
The `year` is 0-padded to a minimum of 4 digits. `month`, `day`, `hours`, `minutes`, `seconds`
are 0-padded to a minimum of 2 digits. `nanoseconds` is 0-padded to a minimum of 9 digits.

## `instant.toJSON() : string`

Equivalent to `instant.toString()`.

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
