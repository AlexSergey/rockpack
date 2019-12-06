const { readdirSync } = require('fs');
const { isArray, isEmptyObject } = require('valid-types');
const deepExtend = require('deep-extend');
const { dirname, isAbsolute, join } = require('path');

function normalize(dict) {
    if (isEmptyObject(dict)) {
        return false;
    }
    return Object.keys(dict)
        .map(item => item)
        .join()
        .replace(/`/g, "'");
}

function getPOFiles(srcpath) {
    return readdirSync(srcpath).filter(function (file) {
        let parts = file.split('.');

        if (parts.length > 0) {
            return parts[1] === 'po';
        }

        return false;
    });
}

function prepareOptions(defaultOptions, opts) {
    return new Promise((resolve, reject) => {
        let options = deepExtend({}, defaultOptions, opts);
        const root = dirname(require.main.filename);

        if (options.src) {
            options.src = (isArray(options.src) ?
                    options.src :
                    [options.src]
                )
                .map(p => (isAbsolute(p) ? p : join(root, p)))
                .filter(Boolean);
        }

        options.dist = isAbsolute(options.dist) ? options.dist : join(root, options.dist);

        if (!options.dist) {
            return reject('"dist" parameter can\'t be empty');
        }

        resolve(options);
    });
}

module.exports = {
    getPOFiles,
    normalize,
    prepareOptions
};
