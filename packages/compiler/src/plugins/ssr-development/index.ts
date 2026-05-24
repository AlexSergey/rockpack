import nodemon from 'nodemon';

import { getOutputFileMeta } from './webpack-utils.js';

interface NodemonOptions {
  [key: string]: unknown;
  script?: string;
  watch?: string;
}

interface WebpackCompilation {
  assets: Record<string, unknown>;
  errors: unknown[];
}

interface WebpackCompilerWithHooks {
  hooks: {
    afterEmit: {
      tapAsync(plugin: { name: string }, fn: (compilation: WebpackCompilation, cb: WebpackHookCallback) => void): void;
    };
    watchRun: { tapAsync(plugin: { name: string }, fn: (comp: unknown, cb: WebpackHookCallback) => void): void };
  };
  outputPath: string;
  plugin?(event: string, fn: unknown): void;
}

type WebpackHookCallback = () => void;

export class SsrDevelopment {
  private isNodemonRunning: boolean;
  private isWebpackWatching: boolean;
  private nodemonOptions: NodemonOptions;

  constructor(nodemonOptions: NodemonOptions) {
    this.nodemonOptions = nodemonOptions;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  apply(compiler: WebpackCompilerWithHooks): void {
    const onAfterEmit = (compilation: WebpackCompilation, callback: WebpackHookCallback): void => {
      if (this.isWebpackWatching) {
        if (compilation.errors.length > 0) {
          console.log('[nodemon-webpack-plugin]: Compilation error.');
        } else if (!this.isNodemonRunning) {
          const outputFile = getOutputFileMeta(compilation, compiler.outputPath);
          this.startMonitoring(outputFile);
        }
      }
      callback();
    };

    const onWatchRun = (_comp: unknown, callback: WebpackHookCallback): void => {
      this.isWebpackWatching = true;
      callback();
    };

    const plugin = { name: 'nodemon-webpack-plugin"' };

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync(plugin, onAfterEmit);
      compiler.hooks.watchRun.tapAsync(plugin, onWatchRun);
    } else {
      compiler.plugin?.('after-emit', onAfterEmit);
      compiler.plugin?.('watch-run', onWatchRun);
    }
  }

  startMonitoring(relativeFileName: string): void {
    const nodemonOptions: NodemonOptions = {
      script: relativeFileName,
      watch: relativeFileName,
      ...this.nodemonOptions,
    };

    const monitor = nodemon(nodemonOptions as unknown as Parameters<typeof nodemon>[0]);

    monitor.on('log', ({ colour: colouredMessage }: { colour: string }) => console.log(colouredMessage));
    monitor.on('restart', () => {
      global.LIVE_RELOAD_SERVER?.refresh('');
    });

    this.isNodemonRunning = true;

    process.once('exit', () => {
      monitor.emit('exit');
    });
    process.once('SIGINT', () => {
      process.exit(0);
    });
  }
}
