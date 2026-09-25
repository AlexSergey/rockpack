import type { InternalCompilerConf } from '../types.js';

const NAMES: Readonly<Record<string, string>> = {
  backendCompiler: 'backend',
  frontendCompiler: 'frontend',
  libraryCompiler: 'library',
};

// The label of a compiler in the build output: client and server in an isomorphic build.
export const compilerLabel = (
  conf: Pick<InternalCompilerConf, '__isIsomorphicBackend' | '__isIsomorphicFrontend' | 'compilerName'>,
): string => {
  if (conf.__isIsomorphicBackend) {
    return 'server';
  }
  if (conf.__isIsomorphicFrontend) {
    return 'client';
  }

  return NAMES[conf.compilerName ?? ''] ?? 'build';
};
