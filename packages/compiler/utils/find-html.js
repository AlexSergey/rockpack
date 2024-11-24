const { glob } = require('glob');
const path = require('node:path');

const errors = require('../errors/markup-compiler');

async function findHtml(pth, html = []) {
  const files = await glob(pth, { absolute: true });

  if (!Array.isArray(html)) {
    html = typeof html === 'undefined' ? [] : [html];
  }
  if (files.length === 0) {
    console.error(errors.INVALID_PATH);

    return process.exit(1);
  }

  return html.concat(
    files.map((file) => ({
      template: path.resolve(file),
    })),
  );
}

module.exports = findHtml;
