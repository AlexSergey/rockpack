const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rockpack/compiler');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.tsx',
    dist: 'public',
    copy: [
      { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' }
    ],
  }),
  backendCompiler({
    src: 'src/server.tsx',
    dist: 'dist',
  })
);
