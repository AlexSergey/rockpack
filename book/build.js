const path = require('node:path');
const { frontendCompiler } = require('@rockpack/compiler');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

frontendCompiler(
  {
    dist: path.resolve(__dirname, '../docs'),
    html: {
      template: path.resolve(__dirname, './index.ejs'),
      favicon: path.resolve(__dirname, './favicon.ico'),
    },
    copy: [{ from: path.resolve(__dirname, './readme_assets'), to: './readme_assets' }],
  },
  (finalConfig, modules, plugins) => {
    modules.set('example', {
      test: /\.example$/,
      use: [{ loader: 'raw-loader' }],
    });
    if (process.env.NODE_ENV === 'production') {
      plugins.set(
        'PrerenderSPAPlugin',
        new PrerenderSPAPlugin({
          staticDir: finalConfig.output.path,
          routes: ['/'],
          minify: true,
        }),
      );
      finalConfig.output.publicPath = './';
    }
  },
);
