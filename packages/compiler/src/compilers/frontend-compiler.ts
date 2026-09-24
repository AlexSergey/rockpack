import { setMode } from '@rockpack/utils';

import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { getLegacyIsomorphicContext } from '../core/compile-context.js';
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
): Promise<Awaited<ReturnType<typeof compile>> | undefined> {
  return withErrorBoundary(async () => {
    const mode = setMode(['development', 'production'], 'development');
    errorHandler();

    const result = await compile(frontendConf(conf), cb ?? null, configOnly);

    if (configOnly || getLegacyIsomorphicContext()) {
      return result;
    }

    if (mode === 'development') {
      devServer(result as Parameters<typeof devServer>[0]);
    }

    return;
  });
}
