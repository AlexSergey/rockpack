import { pascalCase } from 'change-case';
import fs from 'node:fs';
import path from 'node:path';
import semverMinVersion from 'semver/ranges/min-version.js';

import type { State } from './wizard.js';

import { showError } from '../utils/error.js';
import { packageJson } from '../utils/package-json.js';
import { dummies } from '../utils/pathes.js';
import { render } from '../utils/render.js';

// A one-character numeric project name is no valid identifier, so the build name gets a prefix.
const buildName = (projectName: string, prefix: string): string =>
  pascalCase(
    projectName.length === 1 && !Number.isNaN(Number.parseFloat(projectName)) ? `${prefix}${projectName}` : projectName,
  );

const BUILD_DUMMIES = {
  component: { dummy: 'build.component', prefix: 'Component' },
  library: { dummy: 'build.library', prefix: 'Library' },
} as const;

export const createFiles = (
  currentPath: string,
  { appType, projectName }: Pick<State, 'appType' | 'projectName'>,
): void => {
  // The generated project runs on the Node.js major the starter itself requires.
  const nodeMajor = semverMinVersion(packageJson.engines.node)?.major;
  if (nodeMajor !== undefined) {
    fs.writeFileSync(path.join(currentPath, '.nvmrc'), `${String(nodeMajor)}\n`);
  }

  if (fs.existsSync(path.join(currentPath, '.env.example'))) {
    fs.copyFileSync(path.join(currentPath, '.env.example'), path.join(currentPath, '.env'));
  }

  if (appType === 'library' || appType === 'component') {
    const { dummy, prefix } = BUILD_DUMMIES[appType];
    try {
      const build = fs.readFileSync(path.join(dummies, dummy), 'utf8');
      fs.writeFileSync(
        path.join(currentPath, 'scripts.build.mts'),
        render(build, { name: buildName(projectName ?? '', prefix) }),
      );
    } catch (e) {
      showError(e, () => {
        console.error(`Step: 7.1. Creating ${appType} scripts.build.mts`);
      });
    }
  }
};
