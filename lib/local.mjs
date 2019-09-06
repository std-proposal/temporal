import { TimeZone } from './timezone.mjs';
import { Instant } from './instant.mjs';

export function instant() {
  return Instant.fromEpochMilliseconds(Date.now());
}
export function timeZone() {
  const fmt = Intl.DateTimeFormat('en-iso');
  return TimeZone.for(fmt.resolvedOptions().timeZone);
}
export function zonedDateTime() {
  return instant().withZone(timeZone());
}
export function dateTime() {
  return zonedDateTime().getDateTime();
}
export function date() {
  return dateTime().getDate();
}
export function time() {
  return dateTime().getTime();
}
export function dayMonth() {
  return date().getMonthDay();
}
export function monthYear() {
  return date().getYearMonth();
}
