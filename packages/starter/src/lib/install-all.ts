import type { State } from './wizard.js';

import { gitHooks } from '../utils/git-hooks.js';
import { installDependencies } from '../utils/project.js';
import { hasExample } from './prepare-project-dir.js';

// Installs the project and its example project, then writes the git hooks. A component's peers need no install
// of their own: they are devDependencies of the project and dependencies of the example.
export const installAll = async (currentPath: string, examplePath: string, state: State): Promise<void> => {
  await installDependencies(currentPath);

  if (hasExample(state)) {
    await installDependencies(examplePath);
  }

  if (!state.nogit) {
    gitHooks(currentPath);
  }
};
