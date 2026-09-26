import { RockpackError } from './rockpack-error.js';

export const backendIsRequired = (): RockpackError =>
  new RockpackError('INVALID_CONFIG', 'backendCompiler is required to set isomorphicCompiler');

export const frontendIsRequired = (): RockpackError =>
  new RockpackError('INVALID_CONFIG', 'frontendCompiler is required to set isomorphicCompiler');

export const distsMustDiffer = (): RockpackError =>
  new RockpackError(
    'INVALID_CONFIG',
    'frontendCompiler and backendCompiler write to the same file: set a different dist, for example public for the frontend',
  );
