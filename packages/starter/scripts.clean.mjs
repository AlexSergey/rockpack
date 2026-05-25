import { rmSync } from 'node:fs';

for (const dir of ['lib', 'types']) {
  rmSync(dir, { force: true, recursive: true });
}
