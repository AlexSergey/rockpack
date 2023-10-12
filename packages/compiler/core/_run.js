const { getRootRequireDir } = require('@rockpack/utils');
const { isDefined, isString } = require('valid-types');

const generateDts = require('../utils/generate-dts');
const log = require('../utils/log');
const pathToTSConf = require('../utils/path-to-ts-conf');
const sourceCompile = require('../utils/source-compile');

const _run = async (webpackConfig, mode, webpack, conf) => {
  // eslint-disable-next-line consistent-return
  const compiler = webpack(webpackConfig, async (err, stats) => {
    // eslint-disable-next-line default-case
    switch (mode) {
      case 'development':
        if (err) {
          // eslint-disable-next-line no-console
          console.error(err.message);
        }
        break;
      case 'production':
        if (err) {
          // eslint-disable-next-line no-console
          console.error(err.message);

          return process.exit(1);
        }

        if (conf.library) {
          const root = getRootRequireDir();
          const tsConfig = pathToTSConf(root, mode, false);
          const isTypeScript = isString(tsConfig);

          if (isTypeScript) {
            try {
              await generateDts(conf, root);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e.message);
            }
          }
          if (isDefined(conf.esm) || isDefined(conf.cjs)) {
            // Transpile source
            try {
              await sourceCompile(conf);
            } catch (e) {
              // eslint-disable-next-line no-console
              console.error(e.message);
            }
          }
        }

        log(stats);

        if (!conf.debug) {
          return process.exit(0);
        }
    }
  });

  return { compiler, conf, webpackConfig };
};

module.exports = _run;
