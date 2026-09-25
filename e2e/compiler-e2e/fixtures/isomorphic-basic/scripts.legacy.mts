import { backendCompiler, frontendCompiler, isomorphicCompiler } from '@rockpack/compiler';

// The deprecated form, kept working until 10.0.
void isomorphicCompiler(
  frontendCompiler({ dist: 'public', src: 'src/client.tsx' }),
  backendCompiler({ dist: 'dist', src: 'src/server.tsx' }),
);
