
export function here() {
  const fmt = new Intl.DateTimeFormat('en-ISO', {});
  return fmt.resolvedOptions().timeZone;
};
export function now() {
  return BigInt(Date.now()) * BigInt(1e6);
};
