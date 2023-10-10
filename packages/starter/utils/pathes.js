import path from 'node:path';
import { here } from '../constants/paths.js';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const currentPath = process.cwd();

export const getCurrentPath = projectName => (
  projectName === here ? currentPath : path.join(currentPath, projectName)
);

const folderNames = {
  templates: 'templates',
  backbone: 'backbone',
  addons: 'addons',
  dummies: 'dummies'
}

export const root = path.resolve(__dirname, '..');

const _template = path.resolve(root, folderNames.templates);

export const backbone = path.resolve(_template, folderNames.backbone);

export const addons = path.resolve(_template, folderNames.addons);

export const dummies = path.resolve(_template, folderNames.dummies);

