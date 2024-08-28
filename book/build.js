const { frontendCompiler } = require('@rockpack/compiler');
const path = require('node:path');
const PrerenderSPAPlugin = require('prerender-spa-plugin');

frontendCompiler(
  {
    copy: [{ from: path.resolve(__dirname, './readme_assets'), to: './readme_assets' }],
    dist: path.resolve(__dirname, '../docs'),
    html: {
      favicon: path.resolve(__dirname, './favicon.ico'),
      template: path.resolve(__dirname, './index.ejs'),
    },
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
          minify: true,
          routes: ['/'],
          staticDir: finalConfig.output.path,
        }),
      );
      finalConfig.output.publicPath = './';
    }
  },
);
