const { readFileSync } = require('fs');
const { getLocalizationEntries } = require('../utils');
const gs = require('glob-stream');
const { transform } = require('@babel/core');
const { parse } = require('@babel/parser');
const { isArray } = require('valid-types');

function codeParser(folder, options) {
    return new Promise((resolve, reject) => {
        if (!options.query || (isArray(options.query) && options.query.length === 0)) {
            return reject('"query" can\'t be empty');
        }
        let stream = gs(options.query, {
            root: folder
        });
        let results = [];
        stream
            .on('data', function (file) {
                if (file.path.indexOf('node_modules') < 0) {
                    let f = readFileSync(file.path, 'utf8');

                    let res = transform(f, {
                        presets: options.babelPresets,
                        plugins: options.babelPlugins
                    });

                    let ast = parse(res.code, options.babelParserOptions);

                    let r = getLocalizationEntries(ast, file, options);
                    results.push(r);
                }
            })
            .on('finish', function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
    });
}

module.exports = codeParser;