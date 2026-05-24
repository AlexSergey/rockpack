import { getRootRequireDir, setMode } from '@rockpack/utils';

import type { CompilerConf, Mode } from '../types.js';

import { errorHandler } from '../error-handler.js';
import { generateDts } from '../utils/generate-dts.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { isDefined, isString } from '../utils/valid-types-compat.js';

export async function sourceCompiler(conf: Partial<CompilerConf> = {}): Promise<void> {
  const mode = setMode(['development', 'production'], 'development') as Mode;
  errorHandler();

  const root = getRootRequireDir();
  const tsConfig = pathToTsConf(root, mode, false);
  const isTypeScript = isString(tsConfig);

  if (isDefined(conf.esm) || isDefined(conf.cjs)) {
    try {
      await sourceCompile(conf);
    } catch (e) {
      console.error((e as Error).message);
    }
  }

  if (isTypeScript) {
    try {
      await generateDts(conf, root);
    } catch (e) {
      console.error((e as Error).message);
    }
  }
}
