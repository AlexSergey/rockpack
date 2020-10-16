const path = require('path');

const currentPath = process.cwd();

const getCurrentPath = projectName => path.join(currentPath, projectName);

const folderNames = {
  templates: 'templates',
  backbone: 'backbone',
  addons: 'addons',
  dummies: 'dummies'
}

const bin = path.dirname(require.main.filename);

const root = path.resolve(bin, '..');

const _template = path.resolve(root, folderNames.templates);

const backbone = path.resolve(_template, folderNames.backbone);

const addons = path.resolve(_template, folderNames.addons);

const dummies = path.resolve(_template, folderNames.dummies);

module.exports = {
  addons,
  backbone,
  getCurrentPath,
  dummies
}
