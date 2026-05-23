import { copyFile, mkdir, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

export const copy = async (src: string, dest: string): Promise<void> => {
  const stats = await stat(src);

  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = join(src, entry.name);
      const destPath = join(dest, entry.name);
      await copy(srcPath, destPath);
    }
  } else {
    await copyFile(src, dest);
  }
};
