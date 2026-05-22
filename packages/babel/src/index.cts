import type { CreateBabelPresetsOptions } from './create-presets';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createBabelPresetsWithRequire } = require('./create-presets.cjs') as typeof import('./create-presets');

const createBabelPresets = (options: CreateBabelPresetsOptions) => createBabelPresetsWithRequire(require, options);

module.exports = { createBabelPresets };
