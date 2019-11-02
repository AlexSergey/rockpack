const log = require('../utils/log');
const { isNumber, isArray } = require('valid-types');
const WebpackDevServer = require('webpack-dev-server');

const runAppStrategy = (compiler, webpack, webpackConfig, conf) => {
    return {
        simple: () => {
            return new Promise((resolve, reject) => {
                compiler.run((err, stats) => {
                    log(err, stats);
                    if (err) {
                        return reject(err);
                    }
                    return resolve(stats);
                });
            });
        },
        'dev-server': () => {
            let server = new WebpackDevServer(compiler, webpackConfig.devServer);

            server.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, () => {
                if (isNumber(conf._liveReloadPort)) {
                    console.log(`LiveReload server on http://localhost:${conf._liveReloadPort}`);
                }
                console.log(`Starting server on http://${webpackConfig.devServer.host}:${webpackConfig.devServer.port}/`);
                if (!!conf.analyzerPort) {
                    console.log(`Bundle analyzer ran http://localhot:${conf.analyzerPort}/`);
                }
            });
        },
        'watch': () => {
            compiler.watch({}, (err, stats) => {
                console.log(stats.toString({
                    "errors-only": true,
                    colors: true,
                    children: false
                }));
                if (isNumber(conf._liveReloadPort)) {
                    console.log(`LiveReload server on http://localhost:${conf._liveReloadPort}`);
                }
            });
        }
    };
};

const runNodeStrategy = (compiler) => {
    return {
        simple: () => {
            return new Promise((resolve, reject) => {
                compiler.run((err, stats) => {
                    log(err, stats);
                    if (err) {
                        return reject(err);
                    }
                    return resolve(stats);
                });
            });
        },
        'node-watch': () => {
            compiler.watch({}, (err, stats) => {
                console.log(stats.toString({
                    "errors-only": true,
                    colors: true,
                    children: false
                }));
            });
        }
    }
};

const getStrategy = (mode, conf) => {
    if (conf.onlyWatch) {
        return conf.nodejs ? 'node-watch' : 'watch';
    }
    switch(mode) {
        case 'development':
            if (conf.nodejs) {
                return 'node-watch';
            }
            return 'dev-server';

        default:
            return 'simple';
    }
};

const run = async (webpackConfig, mode, webpack, configs) => {
    process.env.NODE_ENV = mode;
    process.env.BABEL_ENV = mode;

    let isMultiCompile = isArray(webpackConfig);

    webpackConfig = isMultiCompile ? webpackConfig : [webpackConfig];
    configs = isMultiCompile ? configs : [configs];

    webpackConfig.forEach((webpackConfig, index) => {
        configs[index].strategy = getStrategy(mode, configs[index]);
    });

    let compiler = isMultiCompile ? webpack(webpackConfig) : webpack(webpackConfig[0]);

    for (let i = 0, l = configs.length; i < l; i++) {
        let config = configs[i];
        let compileStrategy;
        let runner = config.nodejs ? runNodeStrategy : runAppStrategy;

        try {
            compileStrategy = runner(isMultiCompile ?
                compiler.compilers[i] :
                compiler,
                webpack,
                webpackConfig[i],
                config
            )[config.strategy];

            await compileStrategy();
        }
        catch (e) {
            console.error(e);
            process.exit(1);
        }
    }

    if (configs.length === configs.filter(c => c.strategy === 'simple').length) {
        process.exit(0);
    }
};

module.exports = run;
