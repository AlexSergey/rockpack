import fs from 'node:fs';
import path from 'node:path';
import { pascalCase } from 'change-case';
import { dummies } from '../utils/pathes.js';
import { showError } from '../utils/error.js';

export const createFiles = async (currentPath, {
  projectName,
  appType,
}) => {
  if (fs.existsSync(path.join(currentPath, '.env.example'))) {
    fs.copyFileSync(path.join(currentPath, '.env.example'), path.join(currentPath, '.env'));
  }

  if (appType === 'library') {
    try {
      let build = fs.readFileSync(path.join(dummies, 'build.library'), 'utf8')
        .toString();
      let prefix = '';
      if (projectName.length === 1) {
        const isNumber = !isNaN(parseFloat(projectName));
        prefix += isNumber ? 'Library' : '';
      }
      build = build.replace(/%libraryName%/g, pascalCase(`${prefix}${projectName}`));
      fs.writeFileSync(path.join(currentPath, 'scripts.build.js'), build);
    } catch (e) {
      showError(e, () => {
        console.error('Step: 7.1. Creating library scripts.build.js');
      });
    }
  }

  if (appType === 'component') {
    try {
      let build = fs.readFileSync(path.join(dummies, 'build.component'), 'utf8')
        .toString();
      let prefix = '';
      if (projectName.length === 1) {
        const isNumber = !isNaN(parseFloat(projectName));
        prefix += isNumber ? 'Component' : '';
      }
      build = build.replace(/%componentName%/g, pascalCase(`${prefix}${projectName}`));
      fs.writeFileSync(path.join(currentPath, 'scripts.build.js'), build);
    } catch (e) {
      showError(e, () => {
        console.error('Step: 7.1. Creating component scripts.build.js');
      });
    }
  }
};
