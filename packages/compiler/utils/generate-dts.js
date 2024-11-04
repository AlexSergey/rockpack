const { getMode } = require('@rockpack/utils');
const crypto = require('crypto');
const { copySync } = require('fs-extra');
const { existsSync, mkdirSync, rmSync } = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { isArray, isString } = require('valid-types');

const { moduleFormats } = require('../constants');
const makeResolve = require('../modules/make-resolve');
const { getFiles, getTypeScript } = require('./file-system-utils');
const makeCompilerOptions = require('./make-compiler-options');
const pathToTSConf = require('./path-to-ts-conf');

module.exports = async function generateDts(conf, root) {
  const { extensions } = makeResolve(root);
  const mode = getMode();
  const tsConfig = pathToTSConf(root, mode, false);
  const isTypeScript = isString(tsConfig);

  if (!isTypeScript) {
    // eslint-disable-next-line no-console
    console.error("It's not TS project");

    return false;
  }

  const dist = path.join(root, path.dirname(conf.dist));

  const src = path.join(root, conf.src);
  let baseDir;

  if (path.extname(src)) {
    baseDir = path.dirname(src);
  } else {
    for (let i = 0, l = extensions.length; i < l; i++) {
      const ext = extensions[i];
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
      if (existsSync(tsConfig)) {
        const compilerOptions = makeCompilerOptions(root, tsConfig, path.join(root, 'dist-types'), 'dts');
        const host = ts.createCompilerHost(compilerOptions.options);
        const program = ts.createProgram(tsAndTsx, compilerOptions.options, host);
        ts.createTypeChecker(program, true);
        program.emit();
      } else {
        throw new Error('tsconfig not found');
      }
    }
  }
};
