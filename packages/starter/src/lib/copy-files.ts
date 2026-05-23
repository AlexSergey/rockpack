import path from 'node:path';

import type { State } from './wizard';

import { copy } from '../utils/copy';
import { addons, backbone } from '../utils/pathes';

export const copyFiles = async (
  currentPath: string,
  { appType, nogit, tester }: Pick<State, 'appType' | 'nogit' | 'tester'>,
): Promise<void> => {
  if (!appType) return;

  await copy(path.join(backbone, appType), path.join(currentPath));
  await copy(path.join(addons, 'claude'), path.join(currentPath));
  await copy(path.join(addons, 'codestyle'), path.join(currentPath));

  if (!nogit) {
    await copy(path.join(addons, 'git'), path.join(currentPath));
  }

  if (tester) {
    await copy(path.join(addons, 'tester', 'common'), path.join(currentPath));
    if (appType === 'csr' || appType === 'ssr' || appType === 'component' || appType === 'library') {
      await copy(path.join(addons, 'tester', appType), path.join(currentPath));
    }
  }
};
