const { backendCompiler, frontendCompiler, isomorphicCompiler } = require('@rockpack/compiler');

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
