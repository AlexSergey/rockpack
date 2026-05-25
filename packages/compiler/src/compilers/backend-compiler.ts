import { setMode } from '@rockpack/utils';
import deepExtend from 'deep-extend';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { errorHandler } from '../error-handler.js';

export async function backendCompiler(
  conf: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
  configOnly = false,
): Promise<ReturnType<typeof compile>> {
  setMode(['development', 'production'], 'development');
  errorHandler();

  const mergedConf = deepExtend({}, conf, {
    __isBackend: true,
    compilerName: backendCompiler.name,
    html: false,
    nodejs: true,
  }) as InternalCompilerConf;
  mergedConf.name = backendCompiler.name;

  return compile(mergedConf, cb ?? null, configOnly);
}
