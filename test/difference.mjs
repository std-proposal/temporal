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
    const difference = 'P42Y9M25D'; // today.difference(other);
    it(`(${today}).minus('${difference}') == ${other}`, ()=>equal(`${today.minus(difference)}`, `${other}`));
    it(`(${other}).plus('${difference}') == ${today}`, ()=>equal(`${other.plus(difference)}`, `${today}`));
    
    it(`(${other}).minus('${difference}').plus('${difference}') == ${other}`, ()=>equal(`${other.minus(difference).plus(difference)}`, `${other}`));
    it(`(${other}).plus('${difference}').minus('${difference}') == ${other}`, ()=>equal(`${other.plus(difference).minus(difference)}`, `${other}`));

    it(`(${today}).minus('${difference}').plus('${difference}') == ${today}`, ()=>equal(`${today.minus(difference).plus(difference)}`, `${today}`));
    it(`(${today}).plus('${difference}').minus('${difference}') == ${today}`, ()=>equal(`${today.plus(difference).minus(difference)}`, `${today}`));
    
    it(`(${other}).minus('${'P43D'}').plus('${'P43D'}') == ${other}`, ()=>equal(`${other.minus('P43D').plus('P43D')}`, `${other}`));
    it(`(${other}).plus('${'P43D'}').minus('${'P43D'}') == ${other}`, ()=>equal(`${other.plus('P43D').minus('P43D')}`, `${other}`));

    it(`(${today}).minus('${'P43D'}').plus('${'P43D'}') == ${today}`, ()=>equal(`${today.minus('P43D').plus('P43D')}`, `${today}`));
    it(`(${today}).plus('${'P43D'}').minus('${'P43D'}') == ${today}`, ()=>equal(`${today.plus('P43D').minus('P43D')}`, `${today}`));
});
describe('Time.difference', ()=>{
    const [ one, two ] = [ Temporal.Local.time(), new Temporal.Time(15, 23, 30, 123, 456, 789) ].sort(Temporal.Time.compare);
    const difference = one.difference(two);
    it(`(${two}).minus('${difference}') == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`(${one}).plus('${difference}') == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
    it(`(${two}).minus('${difference}').plus('${difference}') == ${two}`, ()=>equal(`${two.minus(difference).plus(difference)}`, `${two}`));
    it(`(${two}).plus('${difference}').minus('${difference}') == ${two}`, ()=>equal(`${two.plus(difference).minus(difference)}`, `${two}`));
    it(`(${two}).minus('${'PT96M'}').plus('${'PT96M'}') == ${two}`, ()=>equal(`${two.minus('PT96M').plus('PT96M')}`, `${two}`));
    it(`(${two}).plus('${'PT96M'}').minus('${'PT96M'}') == ${two}`, ()=>equal(`${two.plus('PT96M').minus('PT96M')}`, `${two}`));
});
describe('DateTime.difference', ()=>{
    const [ one, two ] = [ Temporal.Local.dateTime(), new Temporal.DateTime(1976, 11, 18, 15, 23, 30, 123, 456, 789) ].sort(Temporal.DateTime.compare);
    const difference = one.difference(two);
    it(`(${two}).minus('${difference}') == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`(${one}).plus('${difference}') == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
    it(`(${two}).minus('${difference}').plus('${difference}') == ${two}`, ()=>equal(`${two.minus(difference).plus(difference)}`, `${two}`));
    it(`(${two}).plus('${difference}').minus('${difference}') == ${two}`, ()=>equal(`${two.plus(difference).minus(difference)}`, `${two}`));
    it(`(${two}).minus('${'P42DT96M'}').plus('${'P42DT96M'}') == ${two}`, ()=>equal(`${two.minus('P42DT96M').plus('P42DT96M')}`, `${two}`));
    it(`(${two}).plus('${'P42DT96M'}').minus('${'P42DT96M'}') == ${two}`, ()=>equal(`${two.plus('P42DT96M').minus('P42DT96M')}`, `${two}`));
});
describe('Absolute.difference', ()=>{
    const one = Temporal.Absolute.fromString('1976-11-18T14:23:30.123456789Z');
    const two = Temporal.Local.absolute('UTC'); // Temporal.('2019-09-11T14:45:16.133694800Z');
    const difference = one.difference(two);
    it(`(${two}).minus('${difference}') == ${one}`, ()=>equal(`${two.minus(difference)}`, `${one}`));
    it(`(${one}).plus('${difference}') == ${two}`, ()=>equal(`${one.plus(difference)}`, `${two}`));
    it(`(${two}).minus('${difference}').plus('${difference}') == ${two}`, ()=>equal(`${two.minus(difference).plus(difference)}`, `${two}`));
    it(`(${two}).plus('${difference}').minus('${difference}') == ${two}`, ()=>equal(`${two.plus(difference).minus(difference)}`, `${two}`));
    it(`(${two}).minus('${'P45DT89M'}').plus('${'P45DT89M'}') == ${two}`, ()=>equal(`${two.minus('P45DT89M').plus('P45DT89M')}`, `${two}`));
    it(`(${two}).plus('${'P45DT89M'}').minus('${'P45DT89M'}') == ${two}`, ()=>equal(`${two.plus('P45DT89M').minus('P45DT89M')}`, `${two}`));
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);
