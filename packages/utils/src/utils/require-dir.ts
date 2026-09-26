import { statSync } from 'node:fs';
import { dirname } from 'node:path';

// The project folder of a build: the folder of the running script (`process.argv[1]`, the `scripts.build.mts` path
// when it runs with `node scripts.build.mts`), not `process.cwd()`, so a build started from another folder still reads
// the project next to its script. A folder path is returned as it is; without a script the current folder is used.
export const getRootRequireDir = (script: string = process.argv[1] ?? process.cwd()): string => {
  const stat = statSync(script);

  return stat.isFile() ? dirname(script) : script;
};
