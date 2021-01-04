const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' }
    ],
    babel: {
      plugins: [
        '@issr/babel-loader'
      ]
    }
  }),
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist',
    babel: {
      plugins: [
        '@issr/babel-loader'
      ]
    }
  })
);
