import path from 'node:path';

interface ResolveConfig {
  extensions: string[];
  modules: string[];
}

export const makeResolve = (root: string): ResolveConfig => ({
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
  modules: [path.resolve(root, 'node_modules'), 'node_modules'],
});
