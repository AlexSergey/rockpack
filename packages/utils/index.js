const { statSync } = require('fs');
const { dirname } = require('path');
const requireMainFilename = require('require-main-filename');

const getRootRequireDir = function () {
  let root = requireMainFilename();
  const rootStat = statSync(root);
  root = rootStat.isFile() ? dirname(root) : root;
  return root;
}

module.exports = {
  getRootRequireDir
};
