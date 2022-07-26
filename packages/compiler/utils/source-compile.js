const { existsSync } = require('node:fs');
const path = require('node:path');

const babel = require('@babel/core');
const createBabelPresets = require('@rockpack/babel');
const { getRootRequireDir, getMode } = require('@rockpack/utils');
const { copySync } = require('fs-extra');
const rimraf = require('rimraf');
const ts = require('typescript');
const { isObject, isString, isUndefined, isArray } = require('valid-types');

const { getFiles, getTypeScript, writeFile } = require('./file-system-utils');
const makeCompilerOptions = require('./make-compiler-options');
const { capitalize } = require('./other');
const pathToTSConf = require('./path-to-ts-conf');

module.exports = async function sourceCompile(conf) {
  const root = getRootRequireDir();
  const mode = getMode();

  // eslint-disable-next-line no-console
  console.log('=========Source compile is starting....=========');

  const formats = ['cjs', 'esm'];

  const output = {};

  formats.forEach((format) => {
    if (isObject(conf[format])) {
      output[format] = {
        dist: false,
        src: false,
      };
      output[`has${capitalize(format)}`] = false;

      if (isString(conf[format].src) && isString(conf[format].dist)) {
        output[format].src = conf[format].src;
        output[format].dist = conf[format].dist;
        output[`has${capitalize(format)}`] = true;
      }
    }
  });

  const state = Object.keys(output)
    .filter((key) => key.indexOf('has') === 0)
    .some((item) => output[item]);

  if (!state) {
    throw new Error(`${formats.join(', ')} fields are not object`);
  }

  let debug = false;

  if (mode === 'development') {
    debug = true;
  }
  if (conf.debug) {
    debug = true;
  }

  for (let i = 0, l = formats.length; i < l; i++) {
    const format = formats[i];
    const opt = output[format];
    if (isUndefined(opt)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const dist = path.join(root, opt.dist);
    const src = path.join(root, opt.src);

    const tsAndTsx = await getTypeScript(opt.src);
    const copyFiles = await getFiles(opt.src, undefined, ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']);
    const jsAndJsx = await getFiles(opt.src, '*.+(js|jsx)');
    let compilerOptions;

    const tsConfig = pathToTSConf(root, mode, debug);

    rimraf.sync(dist);
    // eslint-disable-next-line no-console
    console.log(`=========${format} format is starting=========`);

    if (isArray(tsAndTsx) && tsAndTsx.length > 0) {
      if (existsSync(tsConfig)) {
        compilerOptions = makeCompilerOptions(root, tsConfig, opt.dist, format);
        const host = ts.createCompilerHost(compilerOptions.options);
        // eslint-disable-next-line no-console
        console.log('TSC convert: ', tsAndTsx.join('\n'));
        const program = ts.createProgram(tsAndTsx, compilerOptions.options, host);
        ts.createTypeChecker(program, true);
        program.emit();
      } else {
        throw new Error('tsconfig not found');
      }
    } else if (isArray(jsAndJsx) && jsAndJsx.length > 0) {
      const babelOptions = createBabelPresets({
        framework: 'react',
        isNodejs: !!conf.nodejs,
        isomorphic: conf.__isIsomorphic,
        modules: format === 'esm' ? false : 'commonjs',
      });
      // eslint-disable-next-line no-console
      console.log('Babel convert: ', jsAndJsx.join('\n'));
      jsAndJsx.forEach((file) => {
        const { code } = babel.transformFileSync(file, babelOptions);
        const relativePath = path.relative(src, file).replace('.jsx', '.js');
        writeFile(path.join(dist, relativePath), code);
      });
    }

    if (isArray(copyFiles) && copyFiles.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Files will copy: ', copyFiles.join('\n'));

      copyFiles.forEach((file) => {
        const filePth = path.relative(path.join(root, opt.src), file);
        const fileDest = path.join(dist, filePth);
        copySync(file, fileDest);
      });
    }
    // eslint-disable-next-line no-console
    console.log(`=========${format} format finished=========`);
  }
};
