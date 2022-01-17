const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' },
      { from: path.resolve(__dirname, './robots.txt'), to: './' }
    ]
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist'
  })
);
