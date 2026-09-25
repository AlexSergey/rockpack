import path from 'node:path';

import { runTsc } from './run-tsc.js';

type ShownConfig = {
  readonly compilerOptions?: { readonly rootDir?: string };
};

// The folder that holds every file.
const commonDir = (files: readonly string[]): string =>
  files
    .map((file) => path.dirname(file))
    .reduce((common, dir) => {
      let prefix = common;
      while (dir !== prefix && !dir.startsWith(`${prefix}${path.sep}`)) {
        prefix = path.dirname(prefix);
      }

      return prefix;
    });

// The sources of `tsc --listFilesOnly` (absolute paths between its messages), without declarations and packages.
const programSources = (output: string): string[] =>
  output
    .split(/\r?\n/)
    .filter((line) => path.isAbsolute(line))
    .map((line) => path.normalize(line))
    .filter((file) => !/\.d\.[cm]?ts$/.test(file) && !file.split(path.sep).includes('node_modules'));

// The rootDir of the declarations. TypeScript 6 and 7 default it to the folder of the tsconfig, here the cache
// folder of the generated one, so it is always set: the project's own rootDir (through `extends` chains), else the
// common folder of every source in the program, the imported ones included, which is what the TypeScript API used.
export const findDeclarationRootDir = async (
  tsc: string,
  root: string,
  tsConfig: string,
  generatedConfig: string,
  files: readonly string[],
): Promise<string> => {
  const shown = await runTsc(tsc, ['--showConfig', '-p', tsConfig], root);
  try {
    const rootDir = (JSON.parse(shown.output) as ShownConfig).compilerOptions?.rootDir;
    if (rootDir !== undefined) {
      return path.resolve(path.dirname(tsConfig), rootDir);
    }
  } catch {
    // An invalid tsconfig: fall back to the sources, the declaration run reports nothing either way.
  }
  const listed = await runTsc(tsc, ['--listFilesOnly', '-p', generatedConfig], root);
  const sources = programSources(listed.output);

  return commonDir(sources.length > 0 ? sources : files);
};
