#! /usr/bin/env -S node --experimental-modules

import Demitasse from '@pipobscure/demitasse';
import Pretty from '@pipobscure/demitasse-pretty';

import * as shared from './shared.mjs';
import * as exports from './exports.mjs';

import * as instant from './instant.mjs';
import * as offset from './offset.mjs';
import * as zoned from './zoned.mjs';

import * as date from './date.mjs';
import * as time from './time.mjs';
import * as datetime from './datetime.mjs';

Promise.resolve().then(()=>{
  return Demitasse.report(Pretty.reporter);
}).catch((e)=>console.error(e));
