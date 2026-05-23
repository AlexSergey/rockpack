import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { here } from '../constants/paths';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const currentPath = process.cwd();

export const getCurrentPath = (projectName: string): string =>
  projectName === here ? currentPath : path.join(currentPath, projectName);

const folderNames = {
  addons: 'addons',
  backbone: 'backbone',
  dummies: 'dummies',
  templates: 'templates',
} as const;

export const root = path.resolve(__dirname, '../..');

const _template = path.resolve(root, folderNames.templates);

export const backbone = path.resolve(_template, folderNames.backbone);
export const addons = path.resolve(_template, folderNames.addons);
export const dummies = path.resolve(_template, folderNames.dummies);
