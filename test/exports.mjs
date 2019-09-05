#! /usr/bin/env -S node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import * as temporal from '../lib/temporal.mjs';

describe('Exports', ()=>{
  const named = Object.keys(temporal);
  it('should be 8 things', ()=>{ equal(named.length, 13); });
  it('should contain `Instant`', ()=>{ assert(named.includes('Instant')); });
  it('should contain `TimeZone`', ()=>{ assert(named.includes('TimeZone')); });
  it('should contain `ZonedDateTime`', ()=>{ assert(named.includes('ZonedDateTime')); });
  it('should contain `Date`', ()=>{ assert(named.includes('Date')); });
  it('should contain `Time`', ()=>{ assert(named.includes('Time')); });
  it('should contain `DateTime`', ()=>{ assert(named.includes('DateTime')); });
  it('should contain `YearMonth`', ()=>{ assert(named.includes('YearMonth')); });
  it('should contain `MonthDay`', ()=>{ assert(named.includes('MonthDay')); });
  it('should contain `Duration`', ()=>{ assert(named.includes('Duration')); });
  it('should contain `EARLIER`', ()=>{ assert(named.includes('EARLIER')); });
  it('should contain `LATER`', ()=>{ assert(named.includes('LATER')); });
  it('should contain `here`', ()=>{ assert(named.includes('here')); });
  it('should contain `now`', ()=>{ assert(named.includes('now')); });
});

import { normalize } from 'path';
if (normalize(import.meta.url.slice(8)) === normalize(process.argv[1])) report(reporter);

