import { getMode, setMode } from '@rockpack/utils';
import { createServer } from 'livereload';
import { isUndefined } from 'valid-types';
import webpack from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { run } from '../core/run.js';
import { errorHandler } from '../error-handler.js';
import * as errors from '../errors/isomorphic-compiler.js';

interface CompileResult {
  conf: InternalCompilerConf;
  webpackConfig: Record<string, unknown>;
}

export async function isomorphicCompiler(...props: Promise<CompileResult>[]): Promise<void> {
  setMode(['development', 'production'], 'development');
  errorHandler();
  const mode = getMode() as Mode;
  global.ISOMORPHIC = true;
  global.CONFIG_ONLY = true;
  const lrserver = createServer();
  global.LIVE_RELOAD_PORT = lrserver.config.port;
  global.LIVE_RELOAD_SERVER = lrserver;

  const resolved = await Promise.all(props);

  const webpackConfigs = resolved.map((c) => c.webpackConfig);
  const configs = resolved.map((c) => c.conf);

  const backend = configs.find((p) => p.compilerName === 'backendCompiler');
  const frontend = configs.find((p) => p.compilerName === 'frontendCompiler');

  if (!frontend) {
    console.error(errors.SUPPORT);
    process.exit(1);

    return;
  }

  if (!backend) {
    console.error(errors.BACKEND_IS_REQUIRED);
    process.exit(1);

    return;
  }

  if (configs.length <= 1) {
    console.error(errors.SHOULD_SET_MORE_THEN_ONE_COMPILERS);
    process.exit(1);

    return;
  }

  for (const prop of configs) {
    for (const option of ['dist', 'src'] as const) {
      if (isUndefined(prop[option])) {
        console.error(errors.SHOULD_SET_OPTION(prop.compilerName ?? '', option));
        process.exit(1);

        return;
      }
    }
  }

  run(webpackConfigs, mode, webpack as Parameters<typeof run>[2], configs[0] ?? ({} as InternalCompilerConf));
}
