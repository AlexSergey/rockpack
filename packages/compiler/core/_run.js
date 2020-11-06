const path = require('path');
const { isDefined, isString } = require('valid-types');
const log = require('../utils/log');
const sourceCompile = require('../utils/sourceCompile');
const generateDts = require('../utils/generateDts');
const pathToTSConf = require('../utils/pathToTSConf');

const runAppStrategy = (compiler, webpack, webpackConfig, conf, mode) => ({
  simple: () => (
    new Promise((resolve, reject) => {
      compiler.run(async (err, stats) => {
        if (err) {
          return reject(err);
        }
        if (conf.library && mode === 'production') {
          const root = path.dirname(require.main.filename);
          const tsConfig = pathToTSConf(root, mode, false);
          const isTypeScript = isString(tsConfig);

          if (isTypeScript) {
            try {
              await generateDts(conf);
            } catch (e) {
              console.error(e.message);
            }
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
        if (mode === 'production') {
          log(stats);
        }
        return resolve(stats);
      });
    })
  ),
  watch: () => {
    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err.message);
        return process.exit(1);
      }
      if (mode === 'production') {
        log(stats);
      }
    });
  }
});

const getStrategy = (mode) => {
  if (mode === 'development') {
    return 'watch';
  }
  return 'simple';
};

const _run = async (webpackConfig, mode, webpack, configs) => {
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
  const compiler = webpack(webpackConfig);
  const strategy = getStrategy(mode);

  try {
    await runAppStrategy(compiler, webpack, webpackConfig, configs, mode)[strategy]();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  if (strategy === 'simple') {
    process.exit(0);
  }
};

module.exports = _run;
