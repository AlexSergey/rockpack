const { setMode } = require('@rockpack/utils');
const { getRootRequireDir } = require('@rockpack/utils');
const { isDefined, isString } = require('valid-types');

const errorHandler = require('../error-handler');
const generateDts = require('../utils/generate-dts');
const pathToTSConf = require('../utils/path-to-ts-conf');
const sourceCompile = require('../utils/source-compile');

async function sourceCompiler(conf = {}) {
  const mode = setMode(['development', 'production'], 'development');
  if (!conf) {
    conf = {};
  }
  errorHandler();

  const root = getRootRequireDir();
  const tsConfig = pathToTSConf(root, mode, false);
  const isTypeScript = isString(tsConfig);
  console.log('fore');
  if (isDefined(conf.esm) || isDefined(conf.cjs)) {
    // Transpile source
    try {
      await sourceCompile(conf);
    } catch (e) {
      console.error(e.message);
    }
  }
  if (isTypeScript) {
    try {
      await generateDts(conf, root);
    } catch (e) {
      console.error(e.message);
    }
  }
}

module.exports = sourceCompiler;
