#! /usr/bin/env -S node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
const { describe, it, report } = Demitasse;

import Pretty from '@pipobscure/demitasse-pretty';
const { reporter } = Pretty;

import Assert from 'assert';
const { ok: assert, equal, throws } = Assert;

import * as Shared from '../lib/shared.mjs';

describe('Shared Functions', ()=>{
  describe('parseOffsetString', ()=>{
    it('+01:00 parses to 3600000ms', ()=>{ equal(Shared.parseOffsetString('+01:00'), 3600000); });
    it('+02:00 parses to 7200000ms', ()=>{ equal(Shared.parseOffsetString('+02:00'), 7200000); });
    it('01:00 parses to 3600000ms', ()=>{ equal(Shared.parseOffsetString('01:00'), 3600000); });
    it('02:00 parses to 7200000ms', ()=>{ equal(Shared.parseOffsetString('02:00'), 7200000); });
    it('-01:00 parses to -3600000ms', ()=>{ equal(Shared.parseOffsetString('-01:00'), -3600000); });
    it('-02:00 parses to -7200000ms', ()=>{ equal(Shared.parseOffsetString('-02:00'), -7200000); });
  });
  describe('makeOffsetString', ()=>{
    it('3600000ms builds to +01:00', ()=>{ equal(Shared.makeOffsetString( 3600000), '+01:00'); });
    it('7200000ms builds to +02:00', ()=>{ equal(Shared.makeOffsetString( 7200000), '+02:00'); });
    it('-3600000ms builds to -01:00', ()=>{ equal(Shared.makeOffsetString(-3600000), '-01:00'); });
    it('-7200000ms builds to -02:00', ()=>{ equal(Shared.makeOffsetString(-7200000), '-02:00'); });
  });
  describe('pad', () => {
    it('pads short positives to 3', ()=>equal(Shared.pad('13', 3), '013'));
    it('pads long positives to 3', ()=>equal(Shared.pad('1343', 3), '1343'));
    it('pads short positives to 5', ()=>equal(Shared.pad('012', 5), '00012'));
    it('pads short positives to 3', ()=>equal(Shared.pad(12, 3), '012'));
    it('pads short negatives to 3', ()=>equal(Shared.pad(-12, 3), '012'));
    it('pads short negatives to 3', ()=>equal(Shared.pad(-1343, 3), '1343'));
  });
  
  describe('signedpad', () => {
    it('signedpads short positives to 3', ()=>equal(Shared.signedpad('13', 3), '013'));
    it('signedpads long positives to 3', ()=>equal(Shared.signedpad('1343', 3), '1343'));
    it('signedpads short positives to 5', ()=>equal(Shared.signedpad('012', 5), '00012'));
    it('signedpads short positives to 3', ()=>equal(Shared.signedpad(12, 3), '012'));
    it('signedpads short negatives to 3', ()=>equal(Shared.signedpad(-12, 3), '-012'));
    it('signedpads short negatives to 3', ()=>equal(Shared.signedpad(-1343, 3), '-1343'));
  });
});

if (import.meta.url.indexOf(process.argv[1]) === 7) report(reporter);
