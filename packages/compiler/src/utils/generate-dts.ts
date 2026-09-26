import { getMode, isString } from '@rockpack/utils';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import type { CompilerConf } from '../types.js';

import { testFilesIgnore } from '../constants.js';
import { makeResolve } from '../modules/make-resolve.js';
import { typeScriptLocation } from '../reporter/format-errors.js';
import { findDeclarationRootDir } from './declaration-root-dir.js';
import { getTypeScript } from './file-system-utils.js';
import { parseTscOutput } from './parse-tsc-output.js';
import { pathToTsConf } from './path-to-ts-conf.js';
import { resolveTsc } from './resolve-tsc.js';
import { runTsc } from './run-tsc.js';

// The folder of the entry file: `src` itself when it has an extension, otherwise the first `src<ext>` that exists.
const findSourceDir = (src: string, extensions: readonly string[]): string | undefined => {
  if (path.extname(src)) {
    return path.dirname(src);
  }
  const index = extensions.map((ext) => `${src}${ext}`).find((file) => existsSync(file));

  return index === undefined ? undefined : path.dirname(index);
};

// One `file:line:column TSxxxx: message` line per error; tsc output that is not an error list is kept as it is.
const describeTscErrors = (output: string, root: string): string => {
  const issues = parseTscOutput(output);
  if (issues.length === 0) {
    return output.trim();
  }

  return issues
    .map((issue) => [typeScriptLocation(issue, root), `${issue.code}: ${issue.message}`].filter(isString).join(' '))
    .join('\n');
};

// The declaration files of the project's own program (ambient `declare module` files among them, not the packages):
// the declaration run lists the sources only and would miss the declarations the project tsconfig includes.
const projectDeclarations = async (tsc: string, root: string, tsConfig: string): Promise<string[]> => {
  const { output } = await runTsc(tsc, ['--listFilesOnly', '-p', tsConfig], root);

  return output
    .split(/\r?\n/)
    .filter((line) => path.isAbsolute(line))
    .map((line) => path.normalize(line))
    .filter((file) => /\.d\.[cm]?ts$/.test(file) && !file.split(path.sep).includes('node_modules'));
};

// Declarations only, straight into the types folder, by the project's tsc with a tsconfig that extends its own and
// lists the files. Not incremental: an up-to-date build info would skip the emit after the types folder was removed.
const emitDeclarations = async (root: string, tsConfig: string, files: string[], outDir: string): Promise<void> => {
  const tsc = resolveTsc(root);
  const declarations = await projectDeclarations(tsc, root, tsConfig);
  const cacheDir = path.join(root, 'node_modules', '.cache', 'rockpack', 'tsc');
  const config = path.join(cacheDir, `declarations-${String(process.pid)}.json`);
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(
    config,
    JSON.stringify({
      compilerOptions: {
        composite: false,
        declaration: true,
        emitDeclarationOnly: true,
        incremental: false,
        noEmit: false,
        outDir,
      },
      extends: tsConfig,
      files: [...new Set([...files, ...declarations])],
      include: [],
    }),
  );
  try {
    const rootDir = await findDeclarationRootDir(tsc, root, tsConfig, config, files);
    const { code, output } = await runTsc(tsc, ['--pretty', 'false', '--rootDir', rootDir, '-p', config], root);
    if (code !== 0) {
      throw new Error(`declarations could not be emitted:\n${describeTscErrors(output, root)}`);
    }
  } finally {
    rmSync(config, { force: true });
  }
};

// Resolves to the folder the declarations went to, or undefined when there was nothing to declare.
export async function generateDts(conf: Partial<CompilerConf>, root: string): Promise<string | undefined> {
  const tsConfig = pathToTsConf(root, getMode(), false);
  if (!isString(tsConfig)) {
    return undefined;
  }

  const baseDir = findSourceDir(path.join(root, conf.src ?? 'src/index'), makeResolve(root).extensions);
  const files = baseDir === undefined ? [] : await getTypeScript(baseDir, conf.ignore ?? testFilesIgnore);
  if (files.length === 0) {
    return undefined;
  }
  if (!existsSync(tsConfig)) {
    throw new Error('tsconfig not found');
  }

  const types = path.resolve(root, conf.types ?? path.join(path.dirname(conf.dist ?? 'dist/index.js'), 'types'));
  await emitDeclarations(root, tsConfig, files, types);

  return path.relative(root, types);
}
