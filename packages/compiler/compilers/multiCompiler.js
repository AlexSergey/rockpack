const webpack = require('webpack');
const fpPromise = require('../utils/findFreePort');
const defaultProps = require('../defaultProps');
const { isNumber, isFunction, isString } = require('valid-types');
const run = require('../modules/run');
const getRandom = require('../utils/getRandom');
const makeMode = require('../modules/makeMode');
const commonMultiValidator = require('../utils/commonMultiValidators');


async function multiCompiler(props = []) {
    let mode = makeMode();
    commonMultiValidator(props);

    let ports = {}, browserSyncPort = [], serverDev = [], argumentsCollection = {}, configs = {}, webpackConfigs = [], liveReload = [];
    // set id
    props.forEach(({compiler, config}, index) => {
        config.id = `config-${index}`;
        ports[config.id] = {};
        configs[config.id] = {};
    });

    // check intersection ports
    for (let i = 0, l = props.length; i < l; i++) {
        let { config } = props[i];

        if (config && config.server && isNumber(config.server.browserSyncPort)) {
            if (!ports[config.id].browserSyncPort) {
                let port = await fpPromise(config.server.browserSyncPort);
                if (browserSyncPort.indexOf(port) >= 0) {
                    port = await fpPromise(config.server.browserSyncPort + getRandom(100));
                }
                browserSyncPort.push(port);
                ports[config.id].browserSyncPort = port;
            }
        }

        if (!ports[config.id].liveReload) {
            let port = await fpPromise(35729);
            if (liveReload.indexOf(port) >= 0) {
                port = await fpPromise(35729 + getRandom(100));
            }
            liveReload.push(port);
            ports[config.id].liveReload = port;
        }

        if (config && config.server && isNumber(config.server.port)) {
            if (!ports[config.id].server) {
                let port = await fpPromise(config.server.port);
                if (serverDev.indexOf(port) >= 0) {
                    port = await fpPromise(config.server.port + getRandom(100));
                }
                serverDev.push(port);
                ports[config.id].server = port;
            }
        }
        else {
            let port = await fpPromise(defaultProps.server.port);
            if (serverDev.indexOf(port) >= 0) {
                port = await fpPromise(defaultProps.server.port + getRandom(100));
            }
            ports[config.id].server = port;
            serverDev.push(port);
        }
    }

    props.forEach(({compiler, config}, index) => {
        if (!config.server) {
            config.server = {};
        }
        if (isNumber(ports[config.id].server)) {
            config.server.port = ports[config.id].server;
        }
        if (isNumber(ports[config.id].browserSyncPort)) {
            config.server.browserSyncPort = ports[config.id].browserSyncPort;
        }
    });

    props.forEach(props => {
        argumentsCollection[props.config.id] = [];

        switch(props.compilerName) {
            case 'frontendCompiler':
                argumentsCollection[props.config.id].push(props.config);
                if (isFunction(props.callback)) {
                    argumentsCollection[props.config.id].push(props.callback);
                } else {
                    argumentsCollection[props.config.id].push(null);
                }
                argumentsCollection[props.config.id].push(true);
                break;
            case 'analyzerCompiler':
                argumentsCollection[props.config.id].push(props.config);
                if (isFunction(props.callback)) {
                    argumentsCollection[props.config.id].push(props.callback);
                } else {
                    argumentsCollection[props.config.id].push(null);
                }
                argumentsCollection[props.config.id].push(true);
                break;
            case 'libraryCompiler':
                if (isString(props.libraryName)) {
                    argumentsCollection[props.config.id].push(props.libraryName);
                }
                argumentsCollection[props.config.id].push(props.config);
                if (isFunction(props.callback)) {
                    argumentsCollection[props.config.id].push(props.callback);
                } else {
                    argumentsCollection[props.config.id].push(null);
                }
                argumentsCollection[props.config.id].push(true);
                break;
            case 'markupCompiler':
                if (isString(props.paths)) {
                    argumentsCollection[props.config.id].push(props.paths);
                }
                argumentsCollection[props.config.id].push(props.config);
                if (isFunction(props.callback)) {
                    argumentsCollection[props.config.id].push(props.callback);
                } else {
                    argumentsCollection[props.config.id].push(null);
                }
                argumentsCollection[props.config.id].push(true);
                break;
            case 'backendCompiler':
                argumentsCollection[props.config.id].push(props.config);
                if (isFunction(props.callback)) {
                    argumentsCollection[props.config.id].push(props.callback);
                } else {
                    argumentsCollection[props.config.id].push(null);
                }
                argumentsCollection[props.config.id].push(true);
                break;
        }
    });

    for (let i = 0, l = props.length; i < l; i++) {
        let { compiler, config } = props[i];
        let { webpackConfig, conf } = await compiler.apply(compiler, argumentsCollection[config.id]);
        props[i].config = conf;
        webpackConfigs.push(webpackConfig);
    }

    run(webpackConfigs, mode, webpack, props.map(({ config }) => config));
}

module.exports = multiCompiler;
