import { createRequire } from 'node:module';
import { createBabelPresetsWithRequire } from "./create-presets.mjs";
const _require = createRequire(import.meta.url);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const createBabelPresets = options => createBabelPresetsWithRequire(_require, options);