const { isDefined, isString } = require('valid-types');
const { getRootRequireDir } = require('@rockpack/utils');
const log = require('../utils/log');
const sourceCompile = require('../utils/sourceCompile');
const generateDts = require('../utils/generateDts');
const pathToTSConf = require('../utils/pathToTSConf');
const _devServer = require('./_devServer');

const _run = async (webpackConfig, mode, webpack, conf) => {
  const compiler = webpack(webpackConfig, async (err, stats) => {
    switch (mode) {
      case 'development':
        if (err) {
          console.error(err.message);
        }
        break;
      case 'production':
        if (err) {
          console.error(err.message);
          return process.exit(1);
        }

        if (conf.library) {
          const root = getRootRequireDir();
          const tsConfig = pathToTSConf(root, mode, false);
          const isTypeScript = isString(tsConfig);

          if (isTypeScript) {
            try {
              await generateDts(conf);
            } catch (e) {
              console.error(e.message);
            }
          }
          if (isDefined(conf.esm) || isDefined(conf.cjs)) {
            // Transpile source
            try {
              await sourceCompile(conf);
            } catch (e) {
              console.error(e.message);
            }
          }
        }

        log(stats);

        return process.exit(0);
    }
  });

  return { compiler, webpackConfig, conf };
};

module.exports = _run;
