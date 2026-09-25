import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { InternalCompilerConf, Mode } from '../types.js';

type FileCache = {
  buildDependencies: { config: string[] };
  cacheDirectory: string;
  name: string;
  type: 'filesystem';
};

// Development keeps webpack's memory cache. Production caches on disk only with `cache: true`: warm builds are
// faster, a cold build (every CI run) is slower because it writes the cache.
export const makeCache = (conf: InternalCompilerConf, root: string, mode: Mode): false | FileCache | true => {
  if (mode === 'development') {
    return true;
  }
  if (!conf.cache) {
    return false;
  }

  return {
    // A change in the build script (the options) or in the compiler itself invalidates the cache.
    buildDependencies: { config: [process.argv[1] ?? '', fileURLToPath(import.meta.url)].filter(Boolean) },
    cacheDirectory: path.join(root, 'node_modules', '.cache', 'rockpack'),
    // One cache per compiler, so the frontend and the backend of an isomorphic build do not share it.
    name: `${conf.compilerName ?? conf.name ?? 'build'}-${mode}`,
    type: 'filesystem',
  };
};
