import * as babel from '@babel/core';
import { createBabelPresets } from '@rockpack/babel';
import { getMode, getRootRequireDir } from '@rockpack/utils';
import { cpSync, existsSync, renameSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { rimraf } from 'rimraf';

import type { CompilerConf, Mode } from '../types.js';

import { getFiles, getTypeScript, writeFile } from './file-system-utils.js';
import { capitalize } from './other.js';
import { pathToTsConf } from './path-to-ts-conf.js';
import { isArray, isObject, isString } from './valid-types-compat.js';

const _require = createRequire(import.meta.url);

// eslint-disable-next-line @sonar/cognitive-complexity
export async function sourceCompile(conf: Partial<CompilerConf>): Promise<void> {
  const root = getRootRequireDir();
  const mode = getMode() as Mode;

  console.log('=========Source compile is starting....=========');

  const formats = ['cjs', 'esm'] as const;

  const output: Record<string, boolean | { dist: string; src: string }> = {};

  for (const format of formats) {
    const formatConf = conf[format];
    if (isObject(formatConf)) {
      output[format] = { dist: '', src: '' };
      output[`has${capitalize(format)}`] = false;

      const fc = formatConf as { dist?: unknown; src?: unknown };
      if (isString(fc.src) && isString(fc.dist)) {
        output[format] = { dist: fc.dist as string, src: fc.src as string };
        output[`has${capitalize(format)}`] = true;
      }
    }
  }

  const state = Object.keys(output)
    .filter((key) => key.startsWith('has'))
    .some((item) => !!output[item]);

  if (!state) {
    throw new Error(`${formats.join(', ')} fields are not object`);
  }

  const debug = mode === 'development' || !!conf.debug;

  for (const format of formats) {
    const opt = output[format] as undefined | { dist: string; src: string };
    if (opt === undefined) {
      continue;
    }

    const dist = path.join(root, opt.dist);
    const src = path.join(root, opt.src);

    const tsAndTsx = await getTypeScript(opt.src);
    const copyFiles = await getFiles(opt.src, undefined, ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']);
    const jsAndJsx = await getFiles(opt.src, '*.+(js|jsx)');

    const tsConfig = pathToTsConf(root, mode, debug);

    rimraf.sync(dist);

    console.log(`=========${format} format is starting=========`);

    const isTs = isArray(tsAndTsx) && tsAndTsx.length > 0;
    const isJs = isArray(jsAndJsx) && jsAndJsx.length > 0;

    if (isTs || isJs) {
      const sourceFiles = isTs ? tsAndTsx : jsAndJsx;

      if (isTs && !existsSync(tsConfig as string)) {
        throw new Error('tsconfig not found');
      }

      const babelOptions = createBabelPresets({
        framework: 'react',
        isNodejs: !!conf.nodejs,
        modules: format === 'esm' ? false : 'commonjs',
        typescript: isTs,
      });

      const cachedPlugins = babelOptions.plugins ?? [];

      if (format === 'esm') {
        babelOptions.plugins = [
          [_require.resolve('babel-plugin-add-import-extension'), { extension: 'mjs' }],
          ...cachedPlugins,
        ];
      } else {
        babelOptions.plugins = [
          [_require.resolve('babel-plugin-add-import-extension'), { extension: 'cjs' }],
          _require.resolve('@babel/plugin-transform-modules-commonjs'),
          ...cachedPlugins,
        ];
      }

      console.log('Babel convert:\n');
      console.log(sourceFiles.join('\n'));
      console.log('\n');

      for (const file of sourceFiles) {
        const result = babel.transformFileSync(file, babelOptions);
        if (!result?.code) continue;
        const relativePath = path.relative(src, file);
        const ext = format === 'esm' ? '.mjs' : '.cjs';
        const outputPath = `${relativePath.substring(0, relativePath.lastIndexOf('.'))}${ext}`;
        writeFile(path.join(dist, outputPath), result.code);
      }
    }

    if (isArray(copyFiles) && copyFiles.length > 0) {
      console.log('Files will copy:\n');
      console.log(copyFiles.join('\n'));
      console.log('\n');

      for (const file of copyFiles) {
        try {
          const formatDist = path.join(root, (conf[format] as { dist: string }).dist);
          const filePth = path.relative(path.join(root, opt.src), file);
          const fileDest = path.join(formatDist, filePth);
          cpSync(file, fileDest, { recursive: true });
        } catch (err) {
          console.error(err);
        }
      }
    }

    const jsFiles = await getFiles(dist, '*.js');
    const jsMapFiles = await getFiles(dist, '*.js.map');
    const ext = format === 'cjs' ? '.cjs' : '.mjs';

    if (Array.isArray(jsFiles) && jsFiles.length > 0) {
      for (const file of jsFiles) {
        const modified = file.substring(0, file.lastIndexOf('.')) + ext;
        renameSync(file, modified);
      }
    }

    if (Array.isArray(jsMapFiles) && jsMapFiles.length > 0) {
      const mapExt = format === 'cjs' ? '.cjs.map' : '.mjs.map';
      for (const file of jsMapFiles) {
        const modified = file.substring(0, file.lastIndexOf('.js.map')) + mapExt;
        renameSync(file, modified);
      }
    }

    console.log(`=========${format} format finished=========`);
  }
}
