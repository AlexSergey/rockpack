import { getMode } from '@rockpack/utils';
import { mkdirp } from 'mkdirp';
import { copyFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { rimraf } from 'rimraf';
import ts from 'typescript';
import { isArray, isString } from 'valid-types';

import type { CompilerConf, Mode } from '../types.js';

import { moduleFormats } from '../constants.js';
import { makeResolve } from '../modules/make-resolve.js';
import { getFiles, getTypeScript } from './file-system-utils.js';
import { generateString } from './generate-string.js';
import { makeCompilerOptions } from './make-compiler-options.js';
import { pathToTsConf } from './path-to-ts-conf.js';

const _require = createRequire(import.meta.url);
const ssrExt = import.meta.url.endsWith('.mjs') ? '.mjs' : '.cjs';

// eslint-disable-next-line @sonar/cognitive-complexity
export async function generateDts(conf: Partial<CompilerConf>, root: string): Promise<void> {
  const { extensions } = makeResolve(root);
  const mode = getMode() as Mode;
  const tsConfig = pathToTsConf(root, mode, false);
  const isTypeScript = isString(tsConfig);

  if (!isTypeScript) {
    console.error("It's not TS project");

    return;
  }
  const dists = [conf.types ? conf.types : path.join(path.dirname(conf.dist ?? 'dist/index.js'), 'types')];
  const validDists = dists.filter((d): d is string => typeof d === 'string');

  const uuid = generateString(10);
  const nodeModules = path.resolve(_require.resolve(`../constants${ssrExt}`), '../../..');
  const tempFolder = path.join(nodeModules, '.rockpack');
  const temp = path.join(tempFolder, uuid);
  mkdirp.sync(temp);
  let dts: string[] = [];
  let converted = false;

  for (const dst of validDists) {
    const dist = path.join(root, dst);
    const src = path.join(root, conf.src ?? 'src/index');
    let baseDir: string | undefined;

    if (path.extname(src)) {
      baseDir = path.dirname(src);
    } else {
      for (const ext of extensions) {
        const index = `${src}${ext}`;
        if (existsSync(index)) {
          baseDir = index.slice(0, index.lastIndexOf(path.sep));
          break;
        }
      }
    }

    if (baseDir) {
      const tsAndTsx = await getTypeScript(baseDir);

      if (isArray(tsAndTsx) && tsAndTsx.length > 0) {
        if (typeof tsConfig === 'string' && existsSync(tsConfig)) {
          if (!converted) {
            const compilerOptions = makeCompilerOptions(root, tsConfig, temp, moduleFormats.cjs);
            const options = { ...compilerOptions.options, declaration: true, noEmit: false };
            const host = ts.createCompilerHost(options);
            const program = ts.createProgram(tsAndTsx, options, host);
            program.getTypeChecker();
            program.emit();
            dts = await getFiles(temp, '**/*.d.ts');
            converted = true;
          }

          if (dts.length > 0) {
            mkdirp.sync(dist);
            for (const file of dts) {
              const filePth = path.relative(temp, file);
              const fileDest = path.join(dist, filePth);
              mkdirp.sync(path.dirname(fileDest));
              copyFileSync(file, fileDest);
            }
          }
        } else {
          throw new Error('tsconfig not found');
        }
      }
    }
  }

  await rimraf(tempFolder);
}
