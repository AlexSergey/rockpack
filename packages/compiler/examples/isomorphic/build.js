const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('../../index');

isomorphicCompiler(
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist/index.js',
  }),
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public/index.js',
  }),
);
