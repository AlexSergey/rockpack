import { getRootRequireDir, isString, setMode } from '@rockpack/utils';
import path from 'node:path';

import type { WatchResult } from '../core/compile-result.js';
import type { CompilerConf } from '../types.js';

import { errorHandler } from '../error-handler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { generateDts } from '../utils/generate-dts.js';
import { logError } from '../utils/log.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { watchSources } from '../utils/watch-sources.js';
import { withErrorBoundary } from './error-boundary.js';

const build = async (conf: Partial<CompilerConf>, root: string, isTypeScript: boolean): Promise<void> => {
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
};

// The folders a rebuild depends on: the sources of each format and the folder of the declaration entry.
const sourceDirs = (conf: Partial<CompilerConf>, root: string): string[] => [
  ...new Set([
    ...[conf.esm?.src, conf.cjs?.src].filter(isString).map((src) => path.resolve(root, src)),
    path.dirname(path.resolve(root, conf.src ?? 'src/index')),
  ]),
];

// With `watch: true` the build is repeated after every change until stop(); a failed rebuild is reported and the
// watch goes on.
const watchBuild = (conf: Partial<CompilerConf>, root: string, isTypeScript: boolean): WatchResult => {
  const dirs = sourceDirs(conf, root);
  let running = Promise.resolve();
  const rebuild = (): void => {
    running = running.then(async () => {
      const start = Date.now();
      try {
        await build(conf, root, isTypeScript);
        console.log(`Rebuilt in ${String(Date.now() - start)} ms`);
      } catch (error) {
        logError(error as RockpackError);
      }
    });
  };
  const stopWatching = watchSources(dirs, rebuild);
  console.log(`Watching ${dirs.map((dir) => path.relative(root, dir) || '.').join(', ')} for changes`);

  return {
    kind: 'watch',
    stop: async (): Promise<void> => {
      stopWatching();
      await running;
    },
  };
};

export async function sourceCompiler(conf: Partial<CompilerConf> = {}): Promise<undefined | WatchResult> {
  return withErrorBoundary(async () => {
    const mode = setMode(['development', 'production'], 'development');
    errorHandler();

    const root = getRootRequireDir();
    const isTypeScript = isString(pathToTsConf(root, mode, false));

    await build(conf, root, isTypeScript);

    return conf.watch ? watchBuild(conf, root, isTypeScript) : undefined;
  });
}
