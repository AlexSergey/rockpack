import chalk from 'chalk';
import { spawnSync } from 'node:child_process';

import type { PackageManager } from './other.js';

import { getPM } from './other.js';

const HOOKS_COMMANDS: Readonly<Record<PackageManager, readonly [string, ...string[]]>> = {
  npm: ['npx', 'simple-git-hooks'],
  pnpm: ['pnpm', 'exec', 'simple-git-hooks'],
  yarn: ['yarn', 'simple-git-hooks'],
};

// The hooks are declared in the generated package.json ("simple-git-hooks"); this writes them into .git/hooks.
export const gitHooks = (currentPath: string): void => {
  const [command, ...args] = HOOKS_COMMANDS[getPM()];

  const { error, status } = spawnSync(command, args, { cwd: currentPath });

  if (error || status !== 0) {
    console.warn(
      chalk.red(
        `WARNING:   The git hooks were not installed. Run "${[command, ...args].join(' ')}" in the project folder.`,
      ),
    );
  }
};
