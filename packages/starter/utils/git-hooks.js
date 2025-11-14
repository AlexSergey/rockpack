import { spawnSync } from 'child_process';

import { getPM } from './other.js';

export const gitHooks = async ({ tester }, currentPath) => {
  let hooksCommon = [];
  let hooksCommit = [];
  let hooksPush = [];

  const shellOptions = {
    cwd: currentPath,
  };

  hooksPush = hooksPush.concat(hooksCommon);
  hooksCommit = hooksCommit.concat(hooksCommon);

  hooksCommit.push(`${getPM()} run pre-commit`);

  if (tester) {
    hooksPush.push(`${getPM()} test`);
  }

  hooksCommit = hooksCommit.join(' && ');
  hooksPush = hooksPush.join(' && ');

  spawnSync('npm', ['set-script', 'prepare', '"husky init"'], shellOptions);

  spawnSync('npm', ['run', 'prepare'], shellOptions);

  if (hooksCommit.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-commit', `"${hooksCommit}"`], shellOptions);

    spawnSync('git', ['add', '.husky/pre-commit'], shellOptions);
  }

  if (hooksPush.length > 0) {
    spawnSync('npx', ['husky', 'add', '.husky/pre-push', `"${hooksPush}"`], shellOptions);

    spawnSync('git', ['add', '.husky/pre-push'], shellOptions);
  }

  spawnSync('npx', ['husky', 'add', '.husky/commit-msg', '"npm run lint:commit"'], shellOptions);

  spawnSync('git', ['add', '.husky/commit-msg'], shellOptions);
};
