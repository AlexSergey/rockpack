import type { PackageJsonObject } from '../types/package.js';
import type { State } from './wizard.js';

import { gitHooks } from '../utils/git-hooks.js';
import { installDependencies, installPeerDependencies } from '../utils/project.js';
import { hasExample } from './prepare-project-dir.js';

// Installs the project, its example project and a component's peers, then writes the git hooks.
export const installAll = async (
  currentPath: string,
  examplePath: string,
  packageJSON: PackageJsonObject,
  state: State,
): Promise<void> => {
  await installDependencies(currentPath);

  if (hasExample(state)) {
    await installDependencies(examplePath);

    if (state.appType === 'component' && packageJSON['peerDependencies']) {
      await installPeerDependencies(packageJSON, currentPath);
    }
  }

  if (!state.nogit) {
    gitHooks(currentPath);
  }
};
