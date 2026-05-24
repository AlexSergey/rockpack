import { getRootRequireDir } from '@rockpack/utils';
import { glob } from 'glob';
import { mkdirp } from 'mkdirp';
import { lstatSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export async function getFiles(srcFolder: string, query = '*', ignore: string[] = []): Promise<string[]> {
  const root = getRootRequireDir();
  const files = await glob(`${path.resolve(root, srcFolder)}/**/${query}`, { ignore });

  return files.filter((file) => !lstatSync(file).isDirectory());
}

export async function getTypeScript(srcFolder: string): Promise<string[]> {
  const root = getRootRequireDir();
  const files = await glob(`${path.resolve(root, srcFolder)}/**/!(*.d.ts)`);

  return files
    .filter((file) => !lstatSync(file).isDirectory())
    .filter((file) => {
      const extL = file.lastIndexOf('.');
      const ext = file.slice(extL);

      return ext === '.ts' || ext === '.tsx';
    });
}

export function writeFile(pth: string, contents: string): void {
  mkdirp.sync(path.dirname(pth));
  writeFileSync(pth, contents);
}
