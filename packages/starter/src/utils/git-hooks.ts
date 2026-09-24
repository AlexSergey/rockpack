import { spawnSync } from 'node:child_process';

import { getPM } from './other';

// The hooks are declared in the generated package.json ("simple-git-hooks"); this writes them into .git/hooks.
export const gitHooks = (currentPath: string): void => {
  const command = getPM() === 'yarn' ? 'yarn' : 'npx';

  spawnSync(command, ['simple-git-hooks'], { cwd: currentPath });
};
