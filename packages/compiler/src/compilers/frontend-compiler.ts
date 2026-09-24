import { setMode } from '@rockpack/utils';

import type { CompilerResult } from '../core/compile-result.js';
import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { compile } from '../core/compile.js';
import { devServer } from '../core/dev-server.js';
import { errorHandler } from '../error-handler.js';
import { withErrorBoundary } from './error-boundary.js';

// The frontend conf, shared with isomorphicCompiler.
export const frontendConf = (conf: Partial<CompilerConf>): Partial<InternalCompilerConf> => ({
  ...conf,
  compilerName: 'frontendCompiler',
  name: 'frontendCompiler',
});

export async function frontendCompiler(
  conf: Partial<CompilerConf> = {},
  cb?: Parameters<typeof compile>[1],
  configOnly = false,
): Promise<CompilerResult> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();

    const result = await compile(frontendConf(conf), cb ?? null, configOnly);

    return result.kind === 'watch' ? devServer(result) : result;
  });
}
