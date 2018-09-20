/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

export function typeCheck(object, name) {
  if (!object || object[Symbol.toStringTag] !== name) {
    throw new TypeError(`argument must be an instance of ${name}`);
  }
}

export function pad(num, cnt) {
  const str = `${Math.abs(+num)}`;
  const prefix = (new Array(cnt)).fill('0').join('');
  return `${prefix}${`${str}`.trim()}`.slice(-1 * Math.max(cnt, str.length));
}

export function signedpad(num, cnt) {
  return `${+num < 0 ? '-' : ''}${pad(num, cnt)}`;
};

export function number(num) {
  if (isNaN(+num)) throw new TypeError(`invalid number ${num}`);
  return +num;
}

export function getInstantInfo(ms, ns = 0, zone) {
  const formatter = createFormatter(zone);
  const { year, month, day, hour, minute, second } = formatter.formatToParts(ms).reduce((res, item) => {
    if (item.type !== 'literal') res[item.type] = parseInt(item.value, 10);
    return res;
  }, {});
  const millisecond = (ms % 1000);
  const nanosecond = (millisecond * 1E6) + ns;
  const ianaZone = formatter.nonGeographic ? undefined : zone;
  const offsetSeconds = Math.floor((Date.UTC(year, month-1, day, hour, minute, second, millisecond) - ms) / 1000);
  return {
    year, month, day,
    hour, minute, second, nanosecond,
    offsetSeconds, ianaZone
  };
}

function createFormatter(zone) {
  if (zone === 'SYSTEM') {
    return {
      nonGeographic: true,
      formatToParts: (date) => [
        { type: 'year', value: '' + r.getFullYear() },
        { type: 'literal', value: '-' },
        { type: 'month', value: '' + (r.getMonth() + 1) },
        { type: 'literal', value: '-' },
        { type: 'day', value: '' + r.getDate() },
        { type: 'literal', value: ' ' },
        { type: 'hour', value: '' + r.getHours() },
        { type: 'literal', value: ':' },
        { type: 'minute', value: '' + r.getMinutes() },
        { type: 'literal', value: ':' },
        { type: 'second', value: '' + r.getSeconds() }
      ]
    };
  }
  const parts = /([+-])(\d{1,2})(?::?(\d{2}))?/.exec(zone);
  if (parts) {
    const minutes = (+parts[2] * 60) + (+parts[3] || 0);
    const offset = (parts[1] === '-') ? +minutes : -minutes;
    return {
      nonGeographic: true,
      formatToParts: (date) => {
        const ts = date.valueOf() - (offset * 60000);
        const r = new Date(ts);
        return [
          { type: 'year', value: '' + r.getUTCFullYear() },
          { type: 'literal', value: '-' },
          { type: 'month', value: '' + (r.getUTCMonth() + 1) },
          { type: 'literal', value: '-' },
          { type: 'day', value: '' + r.getUTCDate() },
          { type: 'literal', value: ' ' },
          { type: 'hour', value: '' + r.getUTCHours() },
          { type: 'literal', value: ':' },
          { type: 'minute', value: '' + r.getUTCMinutes() },
          { type: 'literal', value: ':' },
          { type: 'second', value: '' + r.getUTCSeconds() }
        ];
      }
    };
  }
  return new Intl.DateTimeFormat('en-iso', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: zone
  });
};
