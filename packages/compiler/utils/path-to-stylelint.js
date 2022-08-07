const { existsSync } = require('node:fs');
const path = require('node:path');

const pathToStylelint = (root) => {
  let stylelint = false;

  if (existsSync(path.resolve(root, '.stylelintrc'))) {
    stylelint = path.resolve(root, '.stylelintrc');
  }

  if (existsSync(path.resolve(root, 'stylelint.config.js'))) {
    stylelint = path.resolve(root, 'stylelint.config.js');
  }

  return stylelint;
};

module.exports = pathToStylelint;
