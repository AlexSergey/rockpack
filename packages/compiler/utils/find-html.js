const path = require('node:path');

const glob = require('glob');

const errors = require('../errors/markup-compiler');

function findHtml(pth, html = []) {
  return new Promise((resolve, reject) => {
    glob(pth, { absolute: true }, async (err, files) => {
      if (err) {
        return reject(err);
      }
      if (!Array.isArray(html)) {
        html = typeof html === 'undefined' ? [] : [html];
      }
      if (files.length === 0) {
        // eslint-disable-next-line no-console
        console.error(errors.INVALID_PATH);

        return process.exit(1);
      }

      return resolve(
        html.concat(
          files.map((file) => ({
            template: path.resolve(file),
          })),
        ),
      );
    });
  });
}

module.exports = findHtml;
