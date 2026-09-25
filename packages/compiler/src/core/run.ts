import type { Compiler, Configuration, MultiCompiler, MultiStats, Stats } from 'webpack';

import type { Reporter } from '../reporter/reporter.js';
import type { InternalCompilerConf, Mode } from '../types.js';

import { buildSources } from '../compilers/source-compiler.js';
import { RockpackError } from '../errors/rockpack-error.js';
import { createReporter } from '../reporter/reporter.js';
import { logError } from '../utils/log.js';

type BuildOutcome = {
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
) => Compiler | MultiCompiler | null;

// Reports a finished production build through process.exitCode and whether it succeeded; the caller closes the
// compiler.
const finishProduction = async (
  err: Error | null,
  stats: MultiStats | Stats | undefined,
  conf: InternalCompilerConf,
  reporter: Reporter,
): Promise<boolean> => {
  // The reporter has printed the error (webpack's failed hook) or the stats (done hook).
  if (err) {
    process.exitCode = 1;

    return false;
  }
  if (conf.library) {
    try {
      await buildSources(conf, reporter);
    } catch (error) {
      if (error instanceof RockpackError) {
        logError(error);
      }
      process.exitCode = 1;

      return false;
    }
  }
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
  reporter: Reporter = createReporter(),
): RunResult => {
  let settle: (outcome: BuildOutcome) => void = () => undefined;
  const finished = new Promise<BuildOutcome>((resolve) => {
    settle = resolve;
  });
  const compiler = webpack(webpackConfig, (err, stats) => {
    // Development builds are reported build by build by the reporter.
    if (mode === 'development') {
      return;
    }
    // Closing the compiler releases webpack's handles, so the process ends on its own with process.exitCode.
    void finishProduction(err, stats, conf, reporter).then((success) => {
      // webpack returns no compiler when applying the config failed (a plugin threw while it was set up): the
      // reporter's hooks were never attached, so the error is printed here and there is nothing to close.
      if (compiler === null) {
        console.error(err?.message);
        settle({ stats, success });

        return;
      }
      compiler.close(() => {
        settle({ stats, success });
      });
    });
  });

  return { compiler: compiler as Compiler | MultiCompiler, conf, finished, webpackConfig };
};
