import { getRootRequireDir, isString, setMode } from '@rockpack/utils';

import type { CompilerConf } from '../types.js';

import { errorHandler } from '../error-handler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { generateDts } from '../utils/generate-dts.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { withErrorBoundary } from './error-boundary.js';

export async function sourceCompiler(conf: Partial<CompilerConf> = {}): Promise<void> {
  return withErrorBoundary(async () => {
    const mode = setMode(['development', 'production'], 'development');
    errorHandler();

    const root = getRootRequireDir();
    const tsConfig = pathToTsConf(root, mode, false);
    const isTypeScript = isString(tsConfig);

    if (conf.esm !== undefined || conf.cjs !== undefined) {
      try {
        await sourceCompile(conf);
      } catch (e) {
        throw new RockpackError('BUILD_FAILED', (e as Error).message, { cause: e });
      }
    }

    if (isTypeScript) {
      try {
        await generateDts(conf, root);
      } catch (e) {
        throw new RockpackError('DTS_FAILED', (e as Error).message, { cause: e });
      }
    }
  });
}
