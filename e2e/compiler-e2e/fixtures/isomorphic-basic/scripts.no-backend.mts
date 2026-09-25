import { frontendCompiler, isomorphicCompiler } from '@rockpack/compiler';

void isomorphicCompiler(frontendCompiler({ dist: 'public', src: 'src/client.tsx' }));
