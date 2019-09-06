/*
 ** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
 ** This code is governed by the license found in the LICENSE file.
 */

import('@std-proposal/temporal').then(
  (mod) => {
    global.Temporal = mod.default;
  },
  (err) => {
    console.error(err);
  }
);
