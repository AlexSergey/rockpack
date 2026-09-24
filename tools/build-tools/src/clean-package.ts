import { rmSync } from 'node:fs';
import path from 'node:path';

export const cleanPackage = (root: string, dirs: readonly string[] = ['lib', 'types']): void => {
  for (const dir of dirs) {
    rmSync(path.resolve(root, dir), { force: true, recursive: true });
  }
};
