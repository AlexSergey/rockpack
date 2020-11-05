const { WebpackPluginServe } = require('webpack-plugin-serve');

class UssrFrontend {
  constructor(opts) {
    const defaultOptions = {
      liveReload: false,
      hmr: false,
      historyFallback: false,
      open: false,
      waitForBuild: true
    }

    const onChanged = opts.onChanged;
    const onInit = opts.onInit;
    let first = true;
    delete opts.onChanged;
    delete opts.onInit;

    this.server = new WebpackPluginServe(Object.assign({}, defaultOptions, opts));

    this.server.on('done', (stats, compiler) => {
      if (typeof onChanged === 'function') {
        if (!first) {
          onChanged(stats, compiler);
        }
      }
      first = false;
    });

    if (typeof onInit === 'function') {
      onInit(this.server);
    }

    return this.server;
  }
}

module.exports = UssrFrontend;
