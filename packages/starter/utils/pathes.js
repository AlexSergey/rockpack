const path = require('path');

const currentPath = process.cwd();

const folderNames = {
  templates: 'templates',
  backbone: 'backbone',
  addons: 'addons'
}

const bin = path.dirname(require.main.filename);

const root = path.resolve(bin, '..');

const _template = path.resolve(root, folderNames.templates);

const backbone = path.resolve(_template, folderNames.backbone);

const addons = path.resolve(_template, folderNames.addons);

module.exports = {
  addons,
  backbone,
  currentPath
}
