"use strict";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const {
  createBabelPresetsWithRequire
} = require('./create-presets.cjs');
const createBabelPresets = options => createBabelPresetsWithRequire(require, options);
module.exports = {
  createBabelPresets
};