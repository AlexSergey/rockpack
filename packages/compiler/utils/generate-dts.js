const { getMode } = require('@rockpack/utils');
const { mkdirp } = require('mkdirp');
const { copyFileSync, existsSync } = require('node:fs');
const path = require('node:path');
const rimraf = require('rimraf');
const ts = require('typescript');
const { isArray, isString } = require('valid-types');

const { moduleFormats } = require('../constants');
const makeResolve = require('../modules/make-resolve');
const { getFiles, getTypeScript } = require('./file-system-utils');
const generateString = require('./generate-string');
const makeCompilerOptions = require('./make-compiler-options');
const pathToTSConf = require('./path-to-ts-conf');

module.exports = async function generateDts(conf, root) {
  const { extensions } = makeResolve(root);
  const mode = getMode();
  const tsConfig = pathToTSConf(root, mode, false);
  const isTypeScript = isString(tsConfig);

  if (!isTypeScript) {
    console.error("It's not TS project");

    return false;
  }
  const dists = [path.join(path.dirname(conf.dist), 'types'), conf.esm?.dist, conf.cjs?.dist];
  const validDists = dists.filter((d) => typeof d === 'string');

  const uuid = generateString(10);
  const nodeModules = path.resolve(__dirname, '../../..');
  const tempFolder = path.join(nodeModules, '.rockpack');
  const temp = path.join(tempFolder, uuid);
  mkdirp.sync(temp);
  let dts = [];
  let converted = false;

  for (let j = 0, l2 = validDists.length; j < l2; j++) {
    const dst = validDists[j];
    const dist = path.join(root, dst);

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
          if (!converted) {
            const compilerOptions = makeCompilerOptions(root, tsConfig, temp, moduleFormats.cjs);
            const options = { ...compilerOptions.options, declaration: true };
            const host = ts.createCompilerHost(options);
            const program = ts.createProgram(tsAndTsx, options, host);
            ts.createTypeChecker(program, true);
            await program.emit();
            dts = await getFiles(temp, '**/*.d.ts');
            converted = true;
          }
          if (dts.length > 0) {
            mkdirp.sync(dist);
            dts.forEach((file) => {
              const filePth = path.relative(temp, file);
              const fileDest = path.join(dist, filePth);
              copyFileSync(file, fileDest);
            });
          }
        } else {
          throw new Error('tsconfig not found');
        }
      }
    }
  }

  rimraf.sync(tempFolder);
};
