const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './favicon.ico'), to: './' }
    ],
    babel: {
      plugins: [
        '@issr/babel-loader'
      ]
    }
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist',
    babel: {
      plugins: [
        '@issr/babel-loader'
      ]
    }
  })
);
