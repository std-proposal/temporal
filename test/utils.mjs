#! /usr/bin/env node --experimental-modules

/*
** Copyright (C) 2018 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import test from 'tape';

import { pad, signedpad, number } from '../lib/utils.mjs';

test('pad', ({ equal, end }) => {
  equal(pad('13', 3), '013');
  equal(pad('1343', 3), '1343');
  equal(pad('012', 5), '00012');
  equal(pad(12, 3), '012');
  equal(pad(-12, 3), '012');
  end();
});

test('signedpad', ({ equal, end }) => {
  equal(signedpad('13', 3), '013');
  equal(signedpad('1343', 3), '1343');
  equal(signedpad('012', 5), '00012');
  equal(signedpad(12, 3), '012');
  equal(signedpad(-12, 3), '-012');
  end();
});

test('number', ({ equal, throws, end }) => {
  equal(number('13'), 13);
  equal(number('135'), 135);
  equal(number(13), 13);
  equal(number(-5), -5);
  equal(number('-5'), -5);
  equal(number(false), 0);
  throws(() => number('false'));
  equal(number(true), 1);
  throws(() => number('true'));
  end();
});
