import type { Configuration } from 'webpack';

import { getMode, isRecord, setMode } from '@rockpack/utils';
import { createServer } from 'livereload';
import path from 'node:path';
import webpack from 'webpack';

import type { CompileContext } from '../core/compile-context.js';
import type { BuildResult, CompileOutcome, ConfigResult, WatchResult } from '../core/compile-result.js';
import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { closeCompiler } from '../core/compile-result.js';
import { compile } from '../core/compile.js';
import { run } from '../core/run.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/isomorphic-compiler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { createReporter } from '../reporter/reporter.js';
import { fpPromise } from '../utils/find-free-port.js';
import { backendConf } from './backend-compiler.js';
import { withErrorBoundary } from './error-boundary.js';
import { frontendConf } from './frontend-compiler.js';

type PostFn = NonNullable<Parameters<typeof compile>[1]>;

const validateConfigs = (configs: InternalCompilerConf[]): void => {
  const dists = configs.map((prop) => path.resolve(prop.dist));
  if (new Set(dists).size < dists.length) {
    throw errors.distsMustDiffer();
  }
};

// Each compiler ignores the folders it writes (make.ts); in an isomorphic build it also ignores the folders the
// other compiler writes, whose emits rebuilt it. Ignored folders a callback added are shared as well; a callback
// that replaced the list with a RegExp or a glob keeps it.
const shareWatchIgnored = (webpackConfigs: Configuration[]): void => {
  const shared = [
    ...new Set(
      webpackConfigs.flatMap(({ watchOptions }) => (Array.isArray(watchOptions?.ignored) ? watchOptions.ignored : [])),
    ),
  ];
  for (const { watchOptions } of webpackConfigs) {
    if (watchOptions && Array.isArray(watchOptions.ignored)) {
      watchOptions.ignored = shared;
    }
  }
};

export type IsomorphicCompilerOptions = {
  readonly backend: Partial<CompilerConf>;
  readonly backendCallback?: PostFn;
  readonly frontend: Partial<CompilerConf>;
  readonly frontendCallback?: PostFn;
};

// Checked before isomorphicCompiler starts anything. A call still in the 9.x form, isomorphicCompiler(frontendCompiler(...), ...),
// passes a promise, whose compiler is already building on its own.
const assertOptions = (options: unknown): void => {
  if (!isRecord(options)) {
    throw errors.confsRequired();
  }
  if (!isRecord(options['frontend'])) {
    throw errors.frontendIsRequired();
  }
  if (!isRecord(options['backend'])) {
    throw errors.backendIsRequired();
  }
};

const LIVE_RELOAD_DEFAULT_PORT = 35729;

const compileBoth = (
  { backend, backendCallback, frontend, frontendCallback }: IsomorphicCompilerOptions,
  context: CompileContext,
): Promise<CompileOutcome>[] => [
  compile(frontendConf(frontend), frontendCallback ?? null, true, context),
  compile(backendConf(backend), backendCallback ?? null, true, context),
];

export type IsomorphicCompilerResult = BuildResult | WatchResult;

// Production resolves once both builds have finished. Development resolves once webpack watches; stop() closes the
// watching builds, the server nodemon runs and the live reload server.
export async function isomorphicCompiler(options: IsomorphicCompilerOptions): Promise<IsomorphicCompilerResult> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();
    assertOptions(options);
    const mode = getMode();
    // Live reload is a development feature; in production the server would keep the process alive.
    // The first free port from livereload's default, so a second project or a leftover process does not block it.
    const lrserver =
      mode === 'development' ? createServer({ port: await fpPromise(LIVE_RELOAD_DEFAULT_PORT) }) : undefined;
    const confs = [options.frontend, options.backend];
    const reporter = createReporter({
      debug: confs.some((conf) => conf.debug === true),
      progress: confs.every((conf) => conf.progress !== false),
    });
    const context: CompileContext = {
      configOnly: true,
      isomorphic: true,
      reporter,
      ...(lrserver ? { liveReload: { port: lrserver.config.port, server: lrserver } } : {}),
    };

    let configs: InternalCompilerConf[];
    let webpackConfigs: (Configuration | Configuration[])[];
    try {
      const resolved = (await Promise.all(compileBoth(options, context))).filter(
        (c): c is ConfigResult => c.kind === 'config',
      );
      webpackConfigs = resolved.map((c) => c.webpackConfig);
      configs = resolved.map((c) => c.conf);
      validateConfigs(configs);
    } catch (error) {
      lrserver?.close();
      throw error;
    }

    shareWatchIgnored(webpackConfigs as Configuration[]);
    const running = run(
      webpackConfigs as Configuration[],
      mode,
      webpack as Parameters<typeof run>[2],
      configs[0] ?? ({} as InternalCompilerConf),
      reporter,
    );
    if (mode === 'production') {
      const { stats, success } = await running.finished;

      return { kind: 'build', stats, success };
    }
    const { compiler } = running;
    if (compiler === null) {
      lrserver?.close();
      // webpack could not apply the config: finished rejects with the error webpack reported.
      await running.finished;
      throw new RockpackError('BUILD_FAILED', 'webpack could not apply the config');
    }

    return {
      kind: 'watch',
      // Closing the compiler also stops the server nodemon runs (plugins/ssr-development).
      stop: async (): Promise<void> => {
        await closeCompiler(compiler);
        lrserver?.close();
      },
    };
  });
}
