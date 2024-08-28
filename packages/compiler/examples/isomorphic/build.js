const { backendCompiler, frontendCompiler, isomorphicCompiler } = require('../../index');

isomorphicCompiler(
  backendCompiler({
    dist: 'dist/index.js',
    src: 'src/server.jsx',
  }),
  frontendCompiler({
    dist: 'public/index.js',
    src: 'src/client.jsx',
  }),
);
