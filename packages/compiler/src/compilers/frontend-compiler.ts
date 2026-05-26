import { setMode } from '@rockpack/utils';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { devServer } from '../core/dev-server.js';
import { errorHandler } from '../error-handler.js';

export async function frontendCompiler(
  conf: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
  configOnly = false,
): Promise<Awaited<ReturnType<typeof compile>> | void> {
  const mode = setMode(['development', 'production'], 'development');
  errorHandler();

  const mergedConf: Partial<InternalCompilerConf> = {
    ...conf,
    compilerName: frontendCompiler.name,
    name: frontendCompiler.name,
  };

  const result = await compile(mergedConf, cb ?? null, configOnly);

  if (configOnly || global.ISOMORPHIC) {
    return result;
  }

  if (mode === 'development') {
    devServer(result as Parameters<typeof devServer>[0]);
  }
}
