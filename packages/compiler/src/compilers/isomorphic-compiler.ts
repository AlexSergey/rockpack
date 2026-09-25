import type { Configuration } from 'webpack';

import { getMode, isRecord, setMode } from '@rockpack/utils';
import { createServer } from 'livereload';
import path from 'node:path';
import webpack from 'webpack';

import type { CompileContext } from '../core/compile-context.js';
import type { CompileOutcome, CompilerResult, ConfigResult } from '../core/compile-result.js';
import type { CompilerConf, InternalCompilerConf } from '../types.js';

import { setLegacyIsomorphicContext } from '../core/compile-context.js';
import { compile } from '../core/compile.js';
import { run } from '../core/run.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/isomorphic-compiler.js';
import { fpPromise } from '../utils/find-free-port.js';
import { backendConf } from './backend-compiler.js';
import { withErrorBoundary } from './error-boundary.js';
import { frontendConf } from './frontend-compiler.js';

type PostFn = NonNullable<Parameters<typeof compile>[1]>;

const validateConfigs = (configs: InternalCompilerConf[]): void => {
  if (!configs.some((p) => p.compilerName === 'frontendCompiler')) {
    throw errors.frontendIsRequired();
  }

  if (!configs.some((p) => p.compilerName === 'backendCompiler')) {
    throw errors.backendIsRequired();
  }

  if (configs.length <= 1) {
    throw errors.moreThanOneCompilerIsRequired();
  }

  for (const prop of configs) {
    for (const option of ['dist', 'src'] as const) {
      // Typed as required, but the configs come from user code.
      const value: unknown = prop[option];
      if (value === undefined) {
        throw errors.optionIsRequired(prop.compilerName ?? '', option);
      }
    }
  }

  const dists = configs.map((prop) => path.resolve(prop.dist));
  if (new Set(dists).size < dists.length) {
    throw errors.distsMustDiffer();
  }
};

export type IsomorphicCompilerOptions = {
  readonly backend: Partial<CompilerConf>;
  readonly backendCallback?: PostFn;
  readonly frontend: Partial<CompilerConf>;
  readonly frontendCallback?: PostFn;
};

const isOptions = (value: unknown): value is IsomorphicCompilerOptions => isRecord(value) && 'frontend' in value;

const LIVE_RELOAD_DEFAULT_PORT = 35729;

const compileBoth = (
  { backend, backendCallback, frontend, frontendCallback }: IsomorphicCompilerOptions,
  context: CompileContext,
): Promise<CompileOutcome>[] => [
  compile(frontendConf(frontend), frontendCallback ?? null, true, context),
  compile(backendConf(backend), backendCallback ?? null, true, context),
];

export function isomorphicCompiler(options: IsomorphicCompilerOptions): Promise<void>;
/** @deprecated Pass `{ frontend, backend }` confs instead; this form is removed in 10.0. */
export function isomorphicCompiler(...compilers: Promise<CompilerResult | undefined>[]): Promise<void>;
export async function isomorphicCompiler(
  ...args: [IsomorphicCompilerOptions] | Promise<CompilerResult | undefined>[]
): Promise<void> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();
    const mode = getMode();
    const [first] = args;
    const legacy = !isOptions(first);
    let provideLegacyContext: (context: CompileContext) => void = () => undefined;
    if (legacy) {
      setLegacyIsomorphicContext(
        new Promise((resolve) => {
          provideLegacyContext = resolve;
        }),
      );
    }
    // Live reload is a development feature; in production the server would keep the process alive.
    // The first free port from livereload's default, so a second project or a leftover process does not block it.
    const lrserver =
      mode === 'development' ? createServer({ port: await fpPromise(LIVE_RELOAD_DEFAULT_PORT) }) : undefined;
    const context: CompileContext = {
      configOnly: true,
      isomorphic: true,
      ...(lrserver ? { liveReload: { port: lrserver.config.port, server: lrserver } } : {}),
    };
    provideLegacyContext(context);

    let configs: InternalCompilerConf[];
    let webpackConfigs: (Configuration | Configuration[])[];
    try {
      const pending = isOptions(first) ? compileBoth(first, context) : (args as Promise<CompilerResult | undefined>[]);
      const resolved = (await Promise.all(pending)).filter((c): c is ConfigResult => c?.kind === 'config');
      webpackConfigs = resolved.map((c) => c.webpackConfig);
      configs = resolved.map((c) => c.conf);
      validateConfigs(configs);
    } catch (error) {
      lrserver?.close();
      throw error;
    } finally {
      if (legacy) {
        setLegacyIsomorphicContext(undefined);
      }
    }

    run(
      webpackConfigs as Configuration[],
      mode,
      webpack as Parameters<typeof run>[2],
      configs[0] ?? ({} as InternalCompilerConf),
    );
  });
}
