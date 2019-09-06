/*
** Copyright (C) 2018-2019 Bloomberg LP. All rights reserved.
** This code is governed by the license found in the LICENSE file.
*/

const STRONG = Symbol('strong');
const WEAK = Symbol('weak');
const CLEANING = Symbol('cleaning');

export class UniqueMap {
  constructor() {
    this[STRONG] = new Map();
    this[WEAK] = new WeakMap();
    this[CLEANING] = null;
  }
  has(key) {
    const strong = this[STRONG].get(key);
    if (!strong) return false;
    return this[WEAK].has(strong);
  }
  get(key) {
    this[CLEANING] = this[CLEANING] || Promise.resolve(this).then(clean);
    const strong = this[STRONG].get(key);
    if (!strong) return;
    return this[WEAK].get(strong);
  }
  set(key, value) {
    this[CLEANING] = this[CLEANING] || Promise.resolve(this).then(clean);
    const strong = this[STRONG].get(key) || {};
    this[STRONG].set(key, strong);
    this[WEAK].set(strong, value);
  }
  delete(key) {
    this[CLEANING] = this[CLEANING] || Promise.resolve(this).then(clean);
    const strong = this[STRONG].get(key);
    this[STRONG].delete(key);
    if (strong) this[WEAK].delete(strong);
  }
  clear() {
    this[STRONG].clear();
    this[WEAK].clear();
  }
}

function clean(unique) {
  try {
    for (const [key, strong] of unique[STRONG].entries()) {
      if (!unique[WEAK].has(strong)) unique[STRONG].delete(key);
    }
  } catch (err) {
    // Ignore
  } finally {
    unique[CLEANING] = null;
  }
}
