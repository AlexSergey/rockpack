import { frontendCompiler } from '@rockpack/compiler';
import WebpackNotifierPlugin from 'webpack-notifier';

void frontendCompiler(
  {
    styles: 'style.css',
    vendor: ['react', 'react-dom'],
  },
  (config, modules, plugins, mode) => {
    if (mode === 'production') {
      config.output ??= {};
      config.output.publicPath = './';
    }

    config.resolve ??= {};
    config.resolve.extensions = ['.js', '.elm'];

    modules.add('elm', {
      exclude: [/elm-stuff/, /node_modules/],
      test: /\.elm$/,
      use:
        process.env.NODE_ENV === 'development'
          ? [
              {
                loader: 'elm-webpack-loader',
                options: {},
              },
            ]
          : [
              {
                loader: 'elm-webpack-loader',
                options: {
                  optimize: true,
                },
              },
            ],
    });

    modules.modify<{ sideEffects?: boolean }>('css', (css) => {
      css.sideEffects = true;
    });

    plugins.set('WebpackNotifierPlugin', new WebpackNotifierPlugin());
  },
);
