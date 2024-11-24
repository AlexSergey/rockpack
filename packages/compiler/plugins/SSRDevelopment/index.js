const nodemon = require('nodemon');

const { getOutputFileMeta } = require('./webpack-utils');

module.exports = class {
  constructor(nodemonOptions) {
    this.nodemonOptions = nodemonOptions;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  apply(compiler) {
    const OnAfterEmit = (compilation, callback) => {
      console.log('OnAfterEmit');
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

    const onWatchRun = (comp, callback) => {
      this.isWebpackWatching = true;
      callback();
    };

    const plugin = { name: 'nodemon-webpack-plugin"' };

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync(plugin, OnAfterEmit);
      compiler.hooks.watchRun.tapAsync(plugin, onWatchRun);
    } else {
      compiler.plugin('after-emit', OnAfterEmit);
      compiler.plugin('watch-run', onWatchRun);
    }
  }

  startMonitoring(relativeFileName) {
    const nodemonOptionsDefaults = {
      script: relativeFileName,
      watch: relativeFileName,
    };

    const nodemonOptions = { ...nodemonOptionsDefaults, ...this.nodemonOptions };

    const monitor = nodemon(nodemonOptions);

    monitor.on('log', ({ colour: colouredMessage }) => console.log(colouredMessage));
    monitor.on('restart', () => {
      global.LIVE_RELOAD_SERVER.refresh('');
    });

    this.isNodemonRunning = true;

    // Ensure we exit nodemon when webpack exists.
    process.once('exit', () => {
      monitor.emit('exit');
    });
    // Ensure Ctrl-C triggers exit.
    process.once('SIGINT', () => {
      process.exit(0);
    });
  }
};
