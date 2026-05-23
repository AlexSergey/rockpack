import { spawnSync } from 'node:child_process';

import { getPM } from './other';

interface GitHooksState {
  tester: boolean | undefined;
}

export const gitHooks = ({ tester }: GitHooksState, currentPath: string): void => {
  const hooksCommon: string[] = [];
  const hooksCommit: string[] = [...hooksCommon];
  const hooksPush: string[] = [...hooksCommon];

  const shellOptions = { cwd: currentPath };

  hooksCommit.push(`${getPM()} run pre-commit`);

  if (tester) {
    hooksPush.push(`${getPM()} test`);
  }

  const hooksCommitStr = hooksCommit.join(' && ');
  const hooksPushStr = hooksPush.join(' && ');

  spawnSync('npm', ['set-script', 'prepare', '"husky init"'], shellOptions);
  spawnSync('npm', ['run', 'prepare'], shellOptions);

  if (hooksCommitStr.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-commit', `"${hooksCommitStr}"`], shellOptions);
    spawnSync('git', ['add', '.husky/pre-commit'], shellOptions);
  }

  if (hooksPushStr.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-push', `"${hooksPushStr}"`], shellOptions);
    spawnSync('git', ['add', '.husky/pre-push'], shellOptions);
  }

  spawnSync('npx', ['husky', 'add', '.husky/commit-msg', '"npm run lint:commit"'], shellOptions);
  spawnSync('git', ['add', '.husky/commit-msg'], shellOptions);
};
