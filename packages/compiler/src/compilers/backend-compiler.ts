import { setMode } from '@rockpack/utils';
import deepExtend from 'deep-extend';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { errorHandler } from '../error-handler.js';
import { withErrorBoundary } from './error-boundary.js';

// The backend conf, shared with isomorphicCompiler.
export const backendConf = (conf: Partial<CompilerConf>): InternalCompilerConf => {
  const merged = deepExtend({}, conf, {
    __isBackend: true,
    compilerName: 'backendCompiler',
    html: false,
    nodejs: true,
  }) as InternalCompilerConf;
  merged.name = 'backendCompiler';

  return merged;
};

export async function backendCompiler(
  conf: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
  configOnly = false,
): Promise<Awaited<ReturnType<typeof compile>>> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();

    return compile(backendConf(conf), cb ?? null, configOnly);
  });
}
