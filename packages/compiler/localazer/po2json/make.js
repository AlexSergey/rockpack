const { join } = require('path');
const { parse } = require('po2json');
const { getPOFiles } = require('../utils');
const { readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { forEachLimit } = require('async');

function make(options) {
    return new Promise((resolve, reject) => {
        const src = options.src[0];
        const translations = getPOFiles(src);

        if (translations.length === 0) {
            return reject(`${src} - In current folder hasn't any PO files`);
        }

        forEachLimit(
            translations,
            1,
            (item, next) => {
                let buffer;
                try {
                    buffer = readFileSync(join(src, item));
                }
                catch (err) {
                    return reject(err);
                }
                let jsonData = parse(buffer, {
                    format: 'jed1.x'
                });
                let filename = item.split('.')[0];

                if (!filename) {
                    return reject('PO filename is empty');
                }

                mkdirp(options.dist, err => {
                    if (err) {
                        return reject(err);
                    }
                    try {
                        writeFileSync(join(options.dist, filename + '.json'), JSON.stringify(jsonData));
                    }
                    catch (err) {
                        return reject(err);
                    }
                    next();
                });
            },
            resolve
        );
    });
}

module.exports = make;