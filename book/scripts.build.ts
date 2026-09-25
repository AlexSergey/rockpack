import PrerenderSPAPlugin from '@prerenderer/webpack-plugin';
import { frontendCompiler } from '@rockpack/compiler';
import path from 'node:path';

void frontendCompiler(
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
    if (process.env['NODE_ENV'] === 'production') {
      const output = (finalConfig.output ??= {});
      plugins.set(
        'PrerenderSPAPlugin',
        new PrerenderSPAPlugin({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          minify: true,
          renderer: require.resolve('@prerenderer/renderer-puppeteer'),
          // puppeteer's own headless Chrome (`npx puppeteer browsers install chrome`), locally and in CI.
          rendererOptions: { headless: true },
          routes: ['/'],
          staticDir: output.path,
        }),
      );
      output.publicPath = './';
    }
  },
);
