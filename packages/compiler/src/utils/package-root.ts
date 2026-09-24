import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Walks up to the nearest package.json; falls back to the start folder when there is none.
const findPackageRoot = (from: string): string => {
  let dir = from;
  while (!existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      return from;
    }
    dir = parent;
  }

  return dir;
};

// The compiler package root, the same for src/utils and lib/<format>/utils.
export const compilerRoot = (): string => findPackageRoot(path.dirname(fileURLToPath(import.meta.url)));
