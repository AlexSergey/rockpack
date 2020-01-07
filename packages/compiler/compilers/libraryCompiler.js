const frontendCompiler = require('./frontendCompiler');
const backendCompiler = require('./backendCompiler');
const { isString, isObject, isDefined } = require('valid-types');
const makeMode = require('../modules/makeMode');
const deepExtend = require('deep-extend');
const errors = require('../errors/libraryCompiler');
const errorHandler = require('../errorHandler');

async function libraryCompiler(libraryOpts, options = {}, cb, configOnly = false) {
    errorHandler();
    let libraryName = false;

    if (isString(libraryOpts)) {
        libraryName = libraryOpts;
    }

    if (isObject(libraryOpts) && isString(libraryOpts.name)) {
        libraryName = libraryOpts.name;
        if (isObject(libraryOpts.esm)) {
            deepExtend(options, {
                esm: libraryOpts.esm
            });
        }
        if (isObject(libraryOpts.cjs)) {
            deepExtend(options, {
                cjs: libraryOpts.cjs
            });
        }
    } else {
        console.error(errors.LIBRARY_OPTS_ERROR);
        console.error(errors.MUST_BE_STRING);
        return process.exit(1);
    }

    if (!isString(libraryName)) {
        console.error(errors.MUST_BE_STRING);
        return process.exit(1);
    }
    let mode = makeMode();
    options = deepExtend({}, options, {
        library: libraryName
    }, {
        html: !options.html ? false : options.html
    });

    if (!options.html) {
        if (mode === 'development') {
            options.onlyWatch = true;
        }
    } else if (mode === 'development') {
        options._liveReload = true;
    }
    if (options.nodejs) {
        return await backendCompiler(options, cb, configOnly);
    }
    return await frontendCompiler(options, cb, configOnly);
}

module.exports = libraryCompiler;
