import { isomorphicCompiler } from '@rockpack/compiler';

// Without a backend conf: refused before anything builds.
void isomorphicCompiler({ frontend: { dist: 'public', src: 'src/client.tsx' } } as never);
