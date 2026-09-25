import path from 'node:path';

import type { AppType, State } from './wizard.js';

import { copy } from '../utils/copy.js';
import { addons, backbone } from '../utils/pathes.js';

// The csr and ssr applications render the same components; their files live once in `shared`.
const SHARED_APP_TYPES: readonly AppType[] = ['csr', 'ssr'];

export const copyFiles = async (
  currentPath: string,
  { appType, nogit, tester }: Pick<State, 'appType' | 'nogit' | 'tester'>,
): Promise<void> => {
  if (!appType) return;

  const shared = SHARED_APP_TYPES.includes(appType);

  if (shared) {
    await copy(path.join(backbone, 'shared'), path.join(currentPath));
  }
  await copy(path.join(backbone, appType), path.join(currentPath));
  await copy(path.join(addons, 'claude'), path.join(currentPath));
  await copy(path.join(addons, 'codestyle'), path.join(currentPath));

  if (!nogit) {
    await copy(path.join(addons, 'git'), path.join(currentPath));
  }

  if (tester) {
    await copy(path.join(addons, 'tester', 'common'), path.join(currentPath));
    if (shared) {
      await copy(path.join(addons, 'tester', 'shared'), path.join(currentPath));
    }
    await copy(path.join(addons, 'tester', appType), path.join(currentPath));
  }
};
