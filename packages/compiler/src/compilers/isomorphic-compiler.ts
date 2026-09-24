import type { Configuration } from 'webpack';

import { getMode, setMode } from '@rockpack/utils';
import { createServer } from 'livereload';
import path from 'node:path';
import { isUndefined } from 'valid-types';
import webpack from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { run } from '../core/run.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/isomorphic-compiler.js';
import { withErrorBoundary } from './error-boundary.js';

type CompileResult = {
  conf: InternalCompilerConf;
  webpackConfig: Configuration | Configuration[];
};

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
      if (isUndefined(prop[option])) {
        throw errors.optionIsRequired(prop.compilerName ?? '', option);
      }
    }
  }

  const dists = configs.map((prop) => path.resolve(prop.dist));
  if (new Set(dists).size < dists.length) {
    throw errors.distsMustDiffer();
  }
};

export async function isomorphicCompiler(...props: Promise<CompileResult | void>[]): Promise<void> {
  return withErrorBoundary(async () => {
    setMode(['development', 'production'], 'development');
    errorHandler();
    const mode = getMode() as Mode;
    global.ISOMORPHIC = true;
    global.CONFIG_ONLY = true;
    // Live reload is a development feature; in production the server would keep the process alive.
    const lrserver = mode === 'development' ? createServer() : undefined;
    if (lrserver) {
      global.LIVE_RELOAD_PORT = lrserver.config.port;
      global.LIVE_RELOAD_SERVER = lrserver;
    }

    let configs: InternalCompilerConf[];
    let webpackConfigs: (Configuration | Configuration[])[];
    try {
      const resolved = (await Promise.all(props)).filter((c): c is CompileResult => c != null);
      webpackConfigs = resolved.map((c) => c.webpackConfig);
      configs = resolved.map((c) => c.conf);
      validateConfigs(configs);
    } catch (error) {
      lrserver?.close();
      throw error;
    }

    run(
      webpackConfigs as Configuration[],
      mode,
      webpack as Parameters<typeof run>[2],
      configs[0] ?? ({} as InternalCompilerConf),
    );
  });
}
