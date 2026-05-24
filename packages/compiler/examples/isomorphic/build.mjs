import { backendCompiler, frontendCompiler, isomorphicCompiler } from '../../lib/esm/index.mjs';

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
