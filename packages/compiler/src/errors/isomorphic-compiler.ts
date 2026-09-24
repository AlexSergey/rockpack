import { RockpackError } from './rockpack-error.js';

export const backendIsRequired = (): RockpackError =>
  new RockpackError('INVALID_CONFIG', 'backendCompiler is required to set isomorphicCompiler');

export const frontendIsRequired = (): RockpackError =>
  new RockpackError('INVALID_CONFIG', 'isomorphicCompiler supported only frontendCompiler');

export const moreThanOneCompilerIsRequired = (): RockpackError =>
  new RockpackError(
    'INVALID_CONFIG',
    'You should set more then 1 compiler. For example: backendCompiler and frontendCompiler',
  );

export const optionIsRequired = (compilerName: string, option: string): RockpackError =>
  new RockpackError('INVALID_CONFIG', `You should set ${option} option to ${compilerName}`);

export const distsMustDiffer = (): RockpackError =>
  new RockpackError(
    'INVALID_CONFIG',
    'frontendCompiler and backendCompiler write to the same file: set a different dist, for example public for the frontend',
  );
