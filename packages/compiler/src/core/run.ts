import type { Compiler, Configuration, MultiCompiler, MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { sourceCompiler } from '../compilers/source-compiler.js';
import { log } from '../utils/log.js';

type RunResult = {
  compiler: Compiler | MultiCompiler;
  conf: InternalCompilerConf;
  webpackConfig: Configuration | Configuration[];
};

type WebpackFn = (
  config: unknown,
  cb: (err: Error | null, stats: MultiStats | Stats | undefined) => void,
) => Compiler | MultiCompiler;

// Reports a finished production build through process.exitCode; the caller closes the compiler.
const finishProduction = async (
  err: Error | null,
  stats: MultiStats | Stats | undefined,
  conf: InternalCompilerConf,
): Promise<void> => {
  if (err) {
    console.error(err.message);
    process.exitCode = 1;

    return;
  }
  if (conf.library) {
    try {
      await sourceCompiler(conf);
    } catch {
      process.exitCode = 1;

      return;
    }
  }
  log(stats ?? null);
  if (stats?.hasErrors()) {
    process.exitCode = 1;
  }
};

export const run = (
  webpackConfig: Configuration | Configuration[],
  mode: Mode,
  webpack: WebpackFn,
  conf: InternalCompilerConf,
): RunResult => {
  const compiler = webpack(webpackConfig, (err, stats) => {
    if (mode === 'development') {
      if (err) console.error(err.message);

      return;
    }
    // Closing the compiler releases webpack's handles, so the process ends on its own with process.exitCode.
    void finishProduction(err, stats, conf).finally(() => {
      compiler.close(() => undefined);
    });
  });

  return { compiler, conf, webpackConfig };
};
