import type { Compiler, Configuration, MultiCompiler, MultiStats, Stats } from 'webpack';

import type { InternalCompilerConf, Mode } from '../types.js';

import { sourceCompiler } from '../compilers/source-compiler.js';
import { log } from '../utils/log.js';

interface RunResult {
  compiler: Compiler | MultiCompiler;
  conf: InternalCompilerConf;
  webpackConfig: Configuration | Configuration[];
}

type WebpackFn = (
  config: unknown,
  cb: (err: Error | null, stats: MultiStats | Stats | undefined) => void,
) => Compiler | MultiCompiler;

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
    if (err) {
      console.error(err.message);
      process.exit(1);

      return;
    }
    void (async (): Promise<void> => {
      if (conf.library) await sourceCompiler(conf);
      log(stats ?? null);
      process.exit(0);
    })();
  });

  return { compiler, conf, webpackConfig };
};
