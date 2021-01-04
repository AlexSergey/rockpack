const { WebpackPluginServe } = require('webpack-plugin-serve');

class SSRFrontend {
  constructor(opts) {
    if (!global.__SSR_OBSERVER__) {
      // eslint-disable-next-line no-console
      console.error('You forget use createSSRObserver!');
      console.log();
      process.exit(1);
    }

    const defaultOptions = {
      liveReload: false,
      hmr: false,
      historyFallback: false,
      open: false,
      waitForBuild: true
    };

    const onChanged = global.__SSR_OBSERVER__.frontendChanged;
    const onInit = global.__SSR_OBSERVER__.register;

    let first = true;

    this.server = new WebpackPluginServe(Object.assign({}, defaultOptions, opts));

    this.server.on('done', (stats, compiler) => {
      // eslint-disable-next-line sonarjs/no-collapsible-if
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

module.exports = SSRFrontend;
