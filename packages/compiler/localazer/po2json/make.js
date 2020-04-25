const { join } = require('path');
const { parse } = require('po2json');
const { readFileSync, writeFileSync } = require('fs');
const mkdirp = require('mkdirp');
const { forEachLimit } = require('async');
const { getPOFiles } = require('../utils');

function make(options) {
  return new Promise((resolve, reject) => {
    const src = options.src[0];
    const translations = getPOFiles(src);

    if (translations.length === 0) {
      return reject(new Error(`${src} - In current folder hasn't any PO files`));
    }

    forEachLimit(
      translations,
      1,
      (item, next) => {
        let buffer;
        try {
          buffer = readFileSync(join(src, item));
        } catch (err) {
          return reject(err);
        }
        const jsonData = parse(buffer, {
          format: 'jed1.x'
        });
        const filename = item.split('.')[0];

        if (!filename) {
          return reject(new Error('PO filename is empty'));
        }

        mkdirp(options.dist, err => {
          if (err) {
            return reject(err);
          }
          try {
            writeFileSync(join(options.dist, `${filename}.json`), JSON.stringify(jsonData));
          } catch (e) {
            return reject(e);
          }
          next();
        });
      },
      resolve
    );
  });
}

module.exports = make;
