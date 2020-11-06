/* eslint-disable no-console */

const nodemon = require('nodemon');
const R = require('ramda');
const { getOutputFileMeta } = require('./webpack-utils');

module.exports = class {
  constructor(nodemonOptions) {
    if (!global.__USSR_OBSERVER__) {
      console.error('You forget use createUssrObserver!');
      console.log();
      console.log('Please, follow instruction:')
      console.log();
      console.log('import createUssrObserver from \'@rockpack/webpack-plugin-ussr-development\';');
      console.log();
      console.log('...');
      console.log();
      console.log('createUssrObserver();');
      console.log();
      process.exit(1);
    }
    this.nodemonOptions = nodemonOptions;
    this.isWebpackWatching = false;
    this.isNodemonRunning = false;
  }

  apply(compiler) {
    const OnAfterEmit = (compilation, callback) => {
      if (this.isWebpackWatching) {
        if (compilation.errors.length > 0) {
          console.log('[nodemon-webpack-plugin]: Compilation error.');
        } else if (!this.isNodemonRunning) {
          const outputFile = getOutputFileMeta(
            compilation,
            compiler.outputPath
          );
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

    const nodemonOptions = R.merge(
      nodemonOptionsDefaults,
      this.nodemonOptions
    );

    const monitor = nodemon(nodemonOptions);

    monitor.on('log', ({ colour: colouredMessage }) =>
      console.log(colouredMessage)
    );
    monitor.on('restart', () => {
      if (typeof global.__USSR_OBSERVER__.backendChanged === 'function') {
        setTimeout(() => {
          global.__USSR_OBSERVER__.backendChanged();
        }, 500);
      }
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
