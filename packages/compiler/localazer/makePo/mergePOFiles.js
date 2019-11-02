const { forEachLimit } = require('async');
const { getPOFiles } = require('../utils');
const { exec } = require('child_process');

function mergePOFiles(options) {
    return new Promise((resolve, reject) => {
        forEachLimit(getPOFiles(options.dist), 1, function (item, next) {
            if (item.indexOf(options.defaultLanguage) < 0) {
                exec('msgmerge' +
                    ' --backup=off' +
                    ' -U' +
                    ' ' +
                    options.dist + '/' +
                    item +
                    ' ' +
                    options.dist + '/messages.pot', function (err) {
                    if (err) {
                        return reject(err);
                    }
                    next();
                });
            } else {
                next();
            }
        }, resolve);
    });
}

module.exports = mergePOFiles;