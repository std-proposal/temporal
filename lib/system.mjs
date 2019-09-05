import { TimeZone } from './timezone.mjs';
import { Instant } from './instant.mjs';

export function here() {
  const fmt = Intl.DateTimeFormat('en-iso');
  return TimeZone.for(fmt.resolvedOptions().timeZone);
}

export function now() {
  return Instant.fromEpochMilliseconds(Date.now());
}
