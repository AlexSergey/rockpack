import chalk from 'chalk';
import { spawnSync } from 'node:child_process';

import { getPM } from './other.js';

// The hooks are declared in the generated package.json ("simple-git-hooks"); this writes them into .git/hooks.
export const gitHooks = (currentPath: string): void => {
  const command = getPM() === 'yarn' ? 'yarn' : 'npx';

  const { error, status } = spawnSync(command, ['simple-git-hooks'], { cwd: currentPath });

  if (error || status !== 0) {
    console.warn(
      chalk.red(
        `WARNING:   The git hooks were not installed. Run "${command} simple-git-hooks" in the project folder.`,
      ),
    );
  }
};
