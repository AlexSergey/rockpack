import type { NodemonSettings } from 'nodemon';

import nodemon from 'nodemon';

import type { LiveReloadServer } from '../../core/compile-context.js';

import { getOutputFileMeta } from './webpack-utils.js';

type NodemonOptions = Partial<NodemonSettings>;

type WebpackCompilation = {
  assets: Record<string, unknown>;
  errors: unknown[];
};

type WebpackCompilerWithHooks = {
  hooks: {
    afterEmit: {
      tapAsync(plugin: { name: string }, fn: (compilation: WebpackCompilation, cb: WebpackHookCallback) => void): void;
    };
    watchRun: { tapAsync(plugin: { name: string }, fn: (comp: unknown, cb: WebpackHookCallback) => void): void };
  };
  outputPath: string;
};

type WebpackHookCallback = () => void;

export class SsrDevelopment {
  private isNodemonRunning: boolean;
  private isWebpackWatching: boolean;
  private readonly liveReload: LiveReloadServer | undefined;
  private readonly nodemonOptions: NodemonOptions;

  constructor(nodemonOptions: NodemonOptions, liveReload?: LiveReloadServer) {
    this.nodemonOptions = nodemonOptions;
    this.liveReload = liveReload;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  apply(compiler: WebpackCompilerWithHooks): void {
    const onAfterEmit = (compilation: WebpackCompilation, callback: WebpackHookCallback): void => {
      // A failed build is reported by the reporter; the server keeps its last good bundle.
      if (this.isWebpackWatching && compilation.errors.length === 0 && !this.isNodemonRunning) {
        const outputFile = getOutputFileMeta(compilation, compiler.outputPath);
        this.startMonitoring(outputFile);
      }
      callback();
    };

    const onWatchRun = (_comp: unknown, callback: WebpackHookCallback): void => {
      this.isWebpackWatching = true;
      callback();
    };

    const plugin = { name: 'nodemon-webpack-plugin' };

    compiler.hooks.afterEmit.tapAsync(plugin, onAfterEmit);
    compiler.hooks.watchRun.tapAsync(plugin, onWatchRun);
  }

  startMonitoring(relativeFileName: string): void {
    const settings: NodemonSettings = {
      ...this.nodemonOptions,
      script: this.nodemonOptions.script ?? relativeFileName,
      watch: this.nodemonOptions.watch ?? [relativeFileName],
    };

    const monitor = nodemon(settings);

    monitor.on('log', ({ colour: colouredMessage }: { colour: string }) => console.log(colouredMessage));
    // nodemon emits 'restart' while the old server still answers and 'start' once it has spawned the new one; the
    // browser then waits until the new server listens (plugins/reloader/ssr.ts).
    let restarting = false;
    monitor.on('restart', () => {
      restarting = true;
    });
    monitor.on('start', () => {
      if (restarting) {
        restarting = false;
        this.liveReload?.refresh('');
      }
    });

    this.isNodemonRunning = true;

    process.once('exit', () => {
      monitor.emit('exit');
    });
  }
}
