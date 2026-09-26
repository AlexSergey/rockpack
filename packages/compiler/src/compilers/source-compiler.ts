import { getRootRequireDir, isString, setMode } from '@rockpack/utils';
import path from 'node:path';

import type { WatchResult } from '../core/compile-result.js';
import type { Reporter } from '../reporter/reporter.js';
import type { CompilerConf } from '../types.js';

import { defaultProps } from '../default-props.js';
import { errorHandler } from '../error-handler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { createReporter } from '../reporter/reporter.js';
import { generateDts } from '../utils/generate-dts.js';
import { logError } from '../utils/log.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { assertValidConf } from '../utils/validate-conf.js';
import { watchSources } from '../utils/watch-sources.js';
import { withErrorBoundary } from './error-boundary.js';

// The label of the per-file builds in the build output.
const SOURCES = 'sources';

const plural = (count: number, word: string): string => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

// Builds the formats and the declarations and reports them as one build; a failure is thrown as a RockpackError
// (the caller prints it once).
export const buildSources = async (conf: Partial<CompilerConf>, reporter: Reporter): Promise<void> => {
  const root = getRootRequireDir();
  const isTypeScript = isString(pathToTsConf(root, setMode(['development', 'production'], 'development'), false));
  const start = Date.now();
  reporter.start(SOURCES);

  const results = [];
  if (conf.esm !== undefined || conf.cjs !== undefined) {
    try {
      results.push(...(await sourceCompile(conf)));
    } catch (e) {
      if (e instanceof RockpackError) {
        throw e;
      }
      throw new RockpackError('BUILD_FAILED', (e as Error).message, { cause: e });
    }
  }

  let types: string | undefined;
  if (isTypeScript) {
    try {
      types = await generateDts(conf, root);
    } catch (e) {
      throw new RockpackError('DTS_FAILED', (e as Error).message, { cause: e });
    }
  }

  reporter.done(SOURCES, {
    durationMs: Date.now() - start,
    errors: [],
    warnings: results.flatMap(({ problems }) => problems.map((message) => ({ kind: 'Build' as const, message }))),
  });
  results.forEach(({ dist, files, format }) => {
    reporter.info(SOURCES, `${format}: ${plural(files, 'file')} in ${path.normalize(dist)}`);
  });
  if (types !== undefined) {
    reporter.info(SOURCES, `declarations in ${types}`);
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
const watchBuild = (conf: Partial<CompilerConf>, reporter: Reporter): WatchResult => {
  const root = getRootRequireDir();
  const dirs = sourceDirs(conf, root);
  let running = Promise.resolve();
  const rebuild = (): void => {
    running = running.then(async () => {
      try {
        await buildSources(conf, reporter);
      } catch (error) {
        logError(error as RockpackError);
      }
    });
  };
  const stopWatching = watchSources(dirs, rebuild);
  reporter.info(SOURCES, `watching ${dirs.map((dir) => path.relative(root, dir) || '.').join(', ')} for changes`);

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
    setMode(['development', 'production'], 'development');
    errorHandler();
    // src is optional here: it only locates the declaration entry.
    assertValidConf({ ...conf, src: conf.src ?? defaultProps.src });
    const reporter = createReporter({ debug: conf.debug === true, progress: conf.progress !== false });

    await buildSources(conf, reporter);

    return conf.watch ? watchBuild(conf, reporter) : undefined;
  });
}
