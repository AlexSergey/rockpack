const { isString } = require('valid-types');
const { existsSync } = require('fs');
const path = require('path');

const pathToTSConf = (root, mode, debug, conf) => {
    let tsConfig = false;

    if (existsSync(path.resolve(root, './tsconfig.js'))) {
        tsConfig = path.resolve(root, './tsconfig.js');
        if (debug) {
            if (existsSync(path.resolve(root, './tsconfig.debug.js'))) {
                tsConfig = path.resolve(root, './tsconfig.debug.js');
            }
        }
    }

    if (existsSync(path.resolve(root, './tsconfig.json'))) {
        tsConfig = path.resolve(root, './tsconfig.json');
        if (debug) {
            if (existsSync(path.resolve(root, './tsconfig.debug.json'))) {
                tsConfig = path.resolve(root, './tsconfig.debug.json');
            }
        }
    }

    if (existsSync(path.resolve(root, './tsconfig.development.js')) && mode === 'development') {
        tsConfig = path.resolve(root, './tsconfig.development.js');
    }
    if (existsSync(path.resolve(root, './tsconfig.production.js')) && mode === 'production') {
        tsConfig = path.resolve(root, './tsconfig.production.js');
    }

    if (isString(conf.tsconfig)) {
        if (existsSync(path.resolve(root, conf.tsconfig))) {
            tsConfig = path.resolve(root, conf.tsconfig);
        }
    }

    return tsConfig;
};

module.exports = pathToTSConf;
