#! /usr/bin/env -S node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal } = Assert;

import * as temporal from '../lib/index.mjs';

describe('Exports', ()=>{
  const named = Object.keys(temporal);
  it('should be 8 things', ()=>{ equal(named.length, 8); });
  it('should contain `Instant`', ()=>{ assert(named.includes('Instant')); });
  it('should contain `OffsetDateTime`', ()=>{ assert(named.includes('OffsetDateTime')); });
  it('should contain `ZonedDateTime`', ()=>{ assert(named.includes('ZonedDateTime')); });
  it('should contain `CivilDate`', ()=>{ assert(named.includes('CivilDate')); });
  it('should contain `CivilTime`', ()=>{ assert(named.includes('CivilTime')); });
  it('should contain `CivilDateTime`', ()=>{ assert(named.includes('CivilDateTime')); });
  it('should contain `CivilYearMonth`', ()=>{ assert(named.includes('CivilYearMonth')); });
  it('should contain `CivilMonthDay`', ()=>{ assert(named.includes('CivilMonthDay')); });
});

if (import.meta.url.indexOf(process.argv[1]) === 7) report(reporter);
