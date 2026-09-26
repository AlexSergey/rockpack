import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { here } from '../constants/paths.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const currentPath = process.cwd();

// A relative project path resolves from the working directory, an absolute one (from an absolute --folder) is kept.
export const getCurrentPath = (projectPath: string): string =>
  projectPath === here ? currentPath : path.resolve(currentPath, projectPath);

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
