import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// The nearest folder with a package.json above the module at `importMetaUrl` (the same for `src` and built `lib`
// files); the module's own folder when there is none.
export const packageRoot = (importMetaUrl: string): string => {
  const from = path.dirname(fileURLToPath(importMetaUrl));
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
