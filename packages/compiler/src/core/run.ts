import type { Compiler, Configuration, MultiCompiler, MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { sourceCompiler } from '../compilers/source-compiler.js';
import { log } from '../utils/log.js';

export type BuildOutcome = {
  readonly stats: MultiStats | Stats | undefined;
  readonly success: boolean;
};

type RunResult = {
  compiler: Compiler | MultiCompiler;
  conf: InternalCompilerConf;
  // Settles after a production build has been reported and the compiler closed; stays pending in development.
  finished: Promise<BuildOutcome>;
  webpackConfig: Configuration | Configuration[];
};

type WebpackFn = (
  config: unknown,
  cb: (err: Error | null, stats: MultiStats | Stats | undefined) => void,
) => Compiler | MultiCompiler;

// Reports a finished production build through process.exitCode and whether it succeeded; the caller closes the
// compiler.
const finishProduction = async (
  err: Error | null,
  stats: MultiStats | Stats | undefined,
  conf: InternalCompilerConf,
): Promise<boolean> => {
  if (err) {
    console.error(err.message);
    process.exitCode = 1;

    return false;
  }
  if (conf.library) {
    try {
      await sourceCompiler(conf);
    } catch {
      process.exitCode = 1;

      return false;
    }
  }
  log(stats ?? null);
  if (stats?.hasErrors()) {
    process.exitCode = 1;

    return false;
  }

  return true;
};

export const run = (
  webpackConfig: Configuration | Configuration[],
  mode: Mode,
  webpack: WebpackFn,
  conf: InternalCompilerConf,
): RunResult => {
  let settle: (outcome: BuildOutcome) => void = () => undefined;
  const finished = new Promise<BuildOutcome>((resolve) => {
    settle = resolve;
  });
  const compiler = webpack(webpackConfig, (err, stats) => {
    if (mode === 'development') {
      if (err) console.error(err.message);

      return;
    }
    // Closing the compiler releases webpack's handles, so the process ends on its own with process.exitCode.
    void finishProduction(err, stats, conf).then((success) => {
      compiler.close(() => {
        settle({ stats, success });
      });
    });
  });

  return { compiler, conf, finished, webpackConfig };
};
