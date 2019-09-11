#! /usr/bin/env -S node --experimental-modules

/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import Temporal from '@std-proposal/temporal';

describe('Date.difference', ()=>{
    const today = Temporal.Local.date();
    const other = new Temporal.Date(1976, 11, 18);
    const difference = today.difference(other);
    it(`Date.fromString('${today}').minus('${difference}').toString() == ${other}`, ()=>equal(`${today.minus(difference)}`, `${other}`));
    it(`Date.fromString('${other}').plus('${difference}').toString() == ${today}`, ()=>equal(`${other.plus(difference)}`, `${today}`));
});
describe('Time.difference', ()=>{
    const [ one, two ] = [ Temporal.Local.time(), new Temporal.Time(15, 23, 30, 123, 456, 789) ].sort(Temporal.Time.compare);
    const difference = one.difference(two);
    it(`Time.fromString('${two}').minus('${difference}').toString() == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`Time.fromString('${one}').plus('${difference}').toString() == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
});
describe('DateTime.difference', ()=>{
    const [ one, two ] = [ Temporal.Local.dateTime(), new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789) ].sort(Temporal.DateTime.compare);
    const difference = one.difference(two);
    it(`DateTime.fromString('${two}').minus('${difference}').toString() == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`DateTime.fromString('${one}').plus('${difference}').toString() == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
});
describe('Instant.difference', ()=>{
    const one = Temporal.Instant.fromString('1976-11-18T14:23:30.123456789Z');
    const two = Temporal.Local.instant(); // Temporal.Instant.fromString('2019-09-11T14:45:16.133694800Z');
    const difference = one.difference(two);
    it(`Instant.fromString('${two}').minus('${difference}').toString() == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`Instant.fromString('${one}').plus('${difference}').toString() == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
