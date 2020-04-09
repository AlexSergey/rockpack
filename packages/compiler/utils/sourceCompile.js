const path = require('path');
const { existsSync } = require('fs');
const { isObject, isString, isUndefined, isArray } = require('valid-types');
const rimraf = require('rimraf');
const babel = require('@babel/core');
const createBabelPresets = require('@rock/babel');
const ts = require('typescript');
const { copySync } = require('fs-extra');
const makeMode = require('../modules/makeMode');
const { getFiles, getTypeScript, writeFile } = require('./fileSystemUtils');
const pathToTSConf = require('./pathToTSConf');
const makeCompilerOptions = require('./makeCompilerOptions');
const { capitalize } = require('./other');

module.exports = async function sourceCompile(conf) {
  const root = path.dirname(require.main.filename);
  const mode = makeMode();

  console.log('=========Source compile is starting....=========');

  const formats = [
    'cjs',
    'esm'
  ];

  const output = {};

  formats.forEach(format => {
    if (isObject(conf[format])) {
      output[format] = {
        src: false,
        dist: false,
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
    .filter(key => key.indexOf('has') === 0)
    .some(item => output[item]);

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
      continue;
    }

    const dist = path.join(root, opt.dist);
    const src = path.join(root, opt.src);

    const tsAndTsx = await getTypeScript(opt.src);
    const copyFiles = await getFiles(opt.src, undefined, ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx']);
    const jsAndJsx = await getFiles(opt.src, '*.+(js|jsx)');
    let compilerOptions;

    const tsConfig = pathToTSConf(root, mode, debug, conf);

    rimraf.sync(dist);
    console.log(`=========${format} format is starting=========`);

    if (isArray(tsAndTsx) && tsAndTsx.length > 0) {
      if (existsSync(tsConfig)) {
        compilerOptions = makeCompilerOptions(root, tsConfig, opt.dist, format);
        const host = ts.createCompilerHost(compilerOptions.options);
        console.log('TSC convert: ', tsAndTsx.join('\n'));
        const program = ts.createProgram(tsAndTsx, compilerOptions.options, host);
        ts.createTypeChecker(program, true);
        program.emit();
      } else {
        throw new Error('tsconfig: Must be correct path to tsconfig file');
      }
    } else if (isArray(jsAndJsx) && jsAndJsx.length > 0) {
      const babelOptions = createBabelPresets({
        isNodejs: !!conf.nodejs,
        framework: 'react',
        loadable: conf.__isIsomorphicLoader,
        modules: format === 'esm' ?
          false :
          'commonjs'
      });
      console.log('Babel convert: ', jsAndJsx.join('\n'));
      jsAndJsx.forEach(file => {
        const { code } = babel.transformFileSync(file, babelOptions);
        const relativePath = path.relative(src, file).replace('.jsx', '.js');
        writeFile(path.join(dist, relativePath), code);
      });
    }

    if (isArray(copyFiles) && copyFiles.length > 0) {
      console.log('Files will copy: ', copyFiles.join('\n'));

      copyFiles.forEach(file => {
        const filePth = path.relative(path.join(root, opt.src), file);
        const fileDest = path.join(dist, filePth);
        copySync(file, fileDest);
      });
    }
    console.log(`=========${format} format finished=========`);
  }
};
