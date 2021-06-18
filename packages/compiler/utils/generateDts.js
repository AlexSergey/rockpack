const path = require('path');
const tempy = require('tempy');
const ts = require('typescript');
const { existsSync } = require('fs');
const { copySync } = require('fs-extra');
const { isArray, isString } = require('valid-types');
const { getRootRequireDir } = require('@rockpack/utils');
const getMode = require('./getMode');
const pathToTSConf = require('./pathToTSConf');
const { getFiles, getTypeScript } = require('./fileSystemUtils');
const makeCompilerOptions = require('./makeCompilerOptions');
const { moduleFormats } = require('../constants');
const makeResolve = require('../modules/makeResolve');

module.exports = async function generateDts(conf) {
  const { extensions } = makeResolve();
  const root = getRootRequireDir();
  const mode = getMode();
  const tsConfig = pathToTSConf(root, mode, false);
  const isTypeScript = isString(tsConfig);

  if (!isTypeScript) {
    console.error('It\'s not TS project');
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
        const temp = tempy.directory();
        const compilerOptions = makeCompilerOptions(root, tsConfig, temp, moduleFormats.cjs);
        const host = ts.createCompilerHost(compilerOptions.options);
        const program = ts.createProgram(tsAndTsx, compilerOptions.options, host);
        ts.createTypeChecker(program, true);
        program.emit();
        const dts = await getFiles(temp, '**/*.d.ts');

        dts.forEach(file => {
          const filePth = path.relative(temp, file);
          const fileDest = path.join(dist, filePth);
          copySync(file, fileDest);
        });
      } else {
        throw new Error('tsconfig not found');
      }
    }
  }
};
