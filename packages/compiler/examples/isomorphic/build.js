const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('../../index');

isomorphicCompiler(
  frontendCompiler({
    src: 'src/client.jsx',
    dist: 'public/index.js',
  }),
  backendCompiler({
    src: 'src/server.jsx',
    dist: 'dist/index.js',
  })
);
