import { RockpackError } from './rockpack-error.js';

export const invalidLibraryOptions = (): RockpackError =>
  new RockpackError(
    'INVALID_CONFIG',
    'Object is not correct. You should set { name: String, esm?:{ src: String, dist: String }, cjs?:{ src: String, dist: String } }',
  );
