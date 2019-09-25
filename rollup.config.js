/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import license from 'rollup-plugin-license';
import babel from 'rollup-plugin-babel';
import { join } from 'path';

export default {
  input: 'lib/temporal.mjs',
  plugins: [
    license({
      banner: {
        content: {
          file: join(__dirname, 'LICENSE'),
          encoding: 'utf-8'
        }
      }
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['@babel/plugin-syntax-bigint', '@babel/plugin-proposal-class-properties']
    })
  ],
  output: {
    file: 'index.js',
    name: 'temporal',
    format: 'umd',
    sourcemap: true
  }
};
