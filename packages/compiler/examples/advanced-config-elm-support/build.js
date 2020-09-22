const { frontendCompiler } = require('../../index');
const WebpackNotifierPlugin = require('webpack-notifier');

frontendCompiler({
  banner: true,
  styles: 'style.css',
  vendor: ['react', 'react-dom', 'core-js']
}, (config, modules, plugins) => {
  config.resolve.extensions = ['.js', '.elm'];

  modules.set('elm', {
    test: /\.elm$/,
    exclude: [/elm-stuff/, /node_modules/],
    use: process.env.NODE_ENV === 'development' ? [
      { loader: 'elm-hot-webpack-loader' },
      {
        loader: 'elm-webpack-loader',
        options: {
          forceWatch: true
        }
      }
    ] : [
      {
        loader: 'elm-webpack-loader',
        options: {
          optimize: true
        }
      }
    ]
  });

  plugins.set('WebpackNotifierPlugin', new WebpackNotifierPlugin());
});
