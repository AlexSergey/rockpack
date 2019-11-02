const { readdirSync } = require('fs');
const { isArray, isEmptyObject } = require('valid-types');
const mkdirp = require('mkdirp');
const deepExtend = require('deep-extend');
const { dirname, isAbsolute, join } = require('path');

function clearDoubles(dict) {
    if (isEmptyObject(dict)) {
        return false;
    }
    let finalDict = {};
    Object.keys(dict).forEach(path => {
        dict[path].forEach(projectLocalization => {
            projectLocalization.forEach(word => {
                finalDict[word] = true;
            });
        });
    });
    return finalDict;
}

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
    console.log(srcpath);
    return readdirSync(srcpath).filter(function (file) {
        let parts = file.split('.');

        if (parts.length > 0) {
            return parts[1] === 'po';
        }

        return false;
    });
}

function getLocalizationEntries(obj, file, options) {
    let res = [];
    if (!obj) return res;
    for (let p in obj) {
        if (typeof obj[p] === 'object') {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] && obj[p].type === "CallExpression" &&
                    obj[p].callee && obj[p].callee.type === 'Identifier' &&
                    options.variables.findIndex(e => e === obj[p].callee.name) !== -1 &&
                    obj[p].arguments) {
                    let args = [];
                    obj[p].arguments.forEach(a => { args.push(a.raw || '1') });
                    res.push(`${obj[p].callee.name}(${args.join(',')})`);
                    console.log(`${obj[p].callee.name}(${args.join(',')})`);
                } else {
                    getLocalizationEntries(obj[p], file, options).forEach(r => res.push(r));
                }
            }
        }
    }
    return res;
}

function createDist(distPth) {
    return new Promise((resolve, reject) => {
        mkdirp(distPth, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    })
}

function prepareOptions(defaultOptions, opts) {
    return new Promise((resolve, reject) => {
        let options = deepExtend(defaultOptions, opts);
        const root = dirname(require.main.filename);

        options.src = (isArray(options.src) ?
                options.src :
                [options.src]
        )
            .map(p => (isAbsolute(p) ? p : join(root, p)))
            .filter(Boolean);

        options.dist = isAbsolute(options.dist) ? options.dist : join(root, options.dist);

        options.query = (isArray(options.query) ? options.query : [options.query]).filter(Boolean);

        if (options.query.length === 0) {
            delete options.query;
        }

        if (options.src.length === 0) {
            return reject('"src" parameter can\'t be empty');
        }

        if (!options.dist) {
            return reject('"dist" parameter can\'t be empty');
        }

        resolve(options);
    });
}

module.exports = {
    getPOFiles,
    normalize,
    clearDoubles,
    getLocalizationEntries,
    createDist,
    prepareOptions
};