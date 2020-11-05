/* eslint-disable */
const path = require('path');
const { isArray, isDefined, isString } = require('valid-types');
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
  /*'dev-server': () => {
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);

    server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, () => {
      conf.messages.push(`Starting server on http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}/`);
    });
  },*/
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

const getStrategy = (mode, conf) => {
  if (mode === 'development') {
    return 'watch';
  }
  return 'simple';
};

const _run = async (webpackConfig, mode, webpack, configs) => {
  process.env.NODE_ENV = mode;
  process.env.BABEL_ENV = mode;
  const compiler = webpack(webpackConfig);
  const strategy = getStrategy(mode, configs);

  runAppStrategy(compiler, webpack, webpackConfig, configs, mode)[strategy]();
  /*if (global.ISOMORPHIC) {
    const compiler = webpack(webpackConfig);
    const strategy = getStrategy(mode, {
      nodejs: true
    });
    try {
      const frontConfig = configs.find(c => c.__isIsomorphicFrontend);

      await runNodeStrategy(
        compiler,
        webpack,
        webpackConfig,
        {
          _liveReloadPort: frontConfig._liveReloadPort
        },
        mode
      )[strategy]();
    } catch (e) {
      console.error(e);
      process.exit(1);
    }

    if (strategy === 'simple') {
      process.exit(0);
    }
  } else {
    const isMultiCompile = isArray(webpackConfig);

    webpackConfig = isMultiCompile ? webpackConfig : [webpackConfig];
    configs = isMultiCompile ? configs : [configs];

    // eslint-disable-next-line no-shadow
    webpackConfig.forEach((webpackConfig, index) => {
      configs[index].strategy = getStrategy(mode, configs[index]);
    });

    const compiler = isMultiCompile ? webpack(webpackConfig) : webpack(webpackConfig[0]);

    for (let i = 0, l = configs.length; i < l; i++) {
      const config = configs[i];
      let compileStrategy;
      const runner = config.nodejs ? runNodeStrategy : runAppStrategy;

      try {
        compileStrategy = runner(
          isMultiCompile ?
            compiler.compilers[i] :
            compiler,
          webpack,
          webpackConfig[i],
          config,
          mode
        )[config.strategy];

        await compileStrategy();
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }

    if (configs.length === configs.filter(c => c.strategy === 'simple').length) {
      process.exit(0);
    }
  }*/
};

module.exports = _run;
