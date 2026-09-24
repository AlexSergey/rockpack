import { backendCompiler, frontendCompiler, isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler(
  frontendCompiler({ dist: 'public', src: 'src/client.tsx' }),
  backendCompiler({ dist: 'dist', src: 'src/server.tsx' }),
);
