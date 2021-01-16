const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    react: path.resolve(__dirname, '../../node_modules/react'),
    'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server')
  }
};

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
    babel: {
      plugins: [
        '@issr/babel-plugin'
      ]
    },
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './src/assets/robots.txt'), to: './' },
      { from: path.resolve(__dirname, './src/locales'), to: './locales' }
    ]
  }, config => {
    Object.assign(config.resolve, alias);
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist',
    babel: {
      plugins: [
        '@issr/babel-plugin'
      ]
    },
  }, config => {
    Object.assign(config.resolve, alias);
  })
);
