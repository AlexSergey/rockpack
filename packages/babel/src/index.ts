import { createRequire } from 'node:module';

import { createBabelPresetsWithRequire } from './create-presets';

export type { CreateBabelPresetsOptions } from './create-presets';

const _require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createBabelPresets = (options: Parameters<typeof createBabelPresetsWithRequire>[1]) =>
  createBabelPresetsWithRequire(_require, options);
