const sourceCompiler = require('../compilers/source-compiler');
const log = require('../utils/log');

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
          await sourceCompiler(conf);
        }

        log(stats);

        return process.exit(0);
    }
  });

  return { compiler, conf, webpackConfig };
};

module.exports = _run;
