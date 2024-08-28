const WebpackNotifierPlugin = require('webpack-notifier');

const { frontendCompiler } = require('../../index');

frontendCompiler(
  {
    banner: true,
    styles: 'style.css',
    vendor: ['react', 'react-dom', 'core-js'],
  },
  (config, modules, plugins, mode) => {
    if (mode === 'production') {
      config.output.publicPath = './';
    }

    config.resolve.extensions = ['.js', '.elm'];

    modules.add('elm', {
      exclude: [/elm-stuff/, /node_modules/],
      test: /\.elm$/,
      use:
        process.env.NODE_ENV === 'development'
          ? [
              { loader: 'elm-hot-webpack-loader' },
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

    modules.modify('css', (css) => {
      css.sideEffects = true;
    });

    plugins.set('WebpackNotifierPlugin', new WebpackNotifierPlugin());
  },
);
