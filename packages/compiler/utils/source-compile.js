const babel = require('@babel/core');
const createBabelPresets = require('@rockpack/babel');
const { getMode, getRootRequireDir } = require('@rockpack/utils');
const { copyFileSync, existsSync, renameSync } = require('node:fs');
const path = require('node:path');
const rimraf = require('rimraf');
const { isArray, isObject, isString, isUndefined } = require('valid-types');

const { getFiles, getTypeScript, writeFile } = require('./file-system-utils');
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
        const babelOptions = createBabelPresets({
          framework: 'react',
          isNodejs: !!conf.nodejs,
          isomorphic: conf.__isIsomorphic,
          modules: format === 'esm' ? false : 'commonjs',
          typescript: true,
        });
        const cachedBabelPlugins = babelOptions.plugins;
        if (format === 'esm') {
          babelOptions.plugins = [[require.resolve('babel-plugin-add-import-extension'), { extension: 'mjs' }]];
        } else if (format === 'cjs') {
          babelOptions.plugins = [
            [require.resolve('babel-plugin-add-import-extension'), { extension: 'cjs' }],
            require.resolve('@babel/plugin-transform-modules-commonjs'),
          ];
        }
        babelOptions.plugins = [...babelOptions.plugins, ...cachedBabelPlugins];

        console.log('Babel convert:\n');
        console.log(tsAndTsx.join('\n'));
        console.log('\n');

        tsAndTsx.forEach((file) => {
          const { code } = babel.transformFileSync(file, babelOptions);
          const relativePath = path.relative(src, file);
          const outputPath = `${relativePath.substring(0, relativePath.lastIndexOf('.'))}${format === 'esm' ? '.mjs' : '.cjs'}`;
          writeFile(path.join(dist, outputPath), code);
        });
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
      const cachedBabelPlugins = babelOptions.plugins;
      if (format === 'esm') {
        babelOptions.plugins = [[require.resolve('babel-plugin-add-import-extension'), { extension: 'mjs' }]];
      } else if (format === 'cjs') {
        babelOptions.plugins = [
          [require.resolve('babel-plugin-add-import-extension'), { extension: 'cjs' }],
          require.resolve('@babel/plugin-transform-modules-commonjs'),
        ];
      }
      babelOptions.plugins = [...babelOptions.plugins, ...cachedBabelPlugins];

      console.log('Babel convert:\n');
      console.log(jsAndJsx.join('\n'));
      console.log('\n');

      jsAndJsx.forEach((file) => {
        const { code } = babel.transformFileSync(file, babelOptions);
        const relativePath = path.relative(src, file);
        const outputPath = `${relativePath.substring(0, relativePath.lastIndexOf('.'))}${format === 'esm' ? '.mjs' : '.cjs'}`;
        writeFile(path.join(dist, outputPath), code);
      });
    }

    if (isArray(copyFiles) && copyFiles.length > 0) {
      // eslint-disable-next-line no-console
      console.log('Files will copy:\n');
      console.log(copyFiles.join('\n'));
      console.log('\n');

      copyFiles.forEach((file) => {
        const filePth = path.relative(path.join(root, opt.src), file);
        const fileDest = path.join(dist, filePth);
        copyFileSync(file, fileDest);
      });
    }

    const jsFiles = await getFiles(dist, '*.js');
    const jsMapFiles = await getFiles(dist, '*.js.map');

    if (Array.isArray(jsFiles) && jsFiles.length > 0) {
      jsFiles.forEach((file) => {
        const modified = file.substr(0, file.lastIndexOf('.')) + (format === 'cjs' ? '.cjs' : '.mjs');
        renameSync(file, modified);
      });
    }
    if (Array.isArray(jsMapFiles) && jsMapFiles.length > 0) {
      jsMapFiles.forEach((file) => {
        const modified = file.substr(0, file.lastIndexOf('.js.map')) + (format === 'cjs' ? '.cjs.map' : '.mjs.map');
        renameSync(file, modified);
      });
    }
    // eslint-disable-next-line no-console
    console.log(`=========${format} format finished=========`);
  }
};
