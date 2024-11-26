import path from 'node:path';

import { addons, backbone } from '../utils/pathes.js';

import { copy } from '../utils/copy.js';

export const copyFiles = async (currentPath, { appType, tester, nogit }) => {
  await copy(path.join(backbone, appType), path.join(currentPath));

  await copy(path.join(addons, 'codestyle', 'common'), path.join(currentPath));

  if (!nogit) {
    await copy(path.join(addons, 'git'), path.join(currentPath));
  }

  if (appType === 'ssr' || appType === 'csr' || appType === 'pure') {
    await copy(path.join(addons, 'codestyle', appType), path.join(currentPath));
  }

  if (tester) {
    await copy(path.join(addons, 'tester', 'common'), path.join(currentPath));
    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      await copy(path.join(addons, 'tester', appType), path.join(currentPath));
    }
    if (appType === 'library') {
      await copy(path.join(addons, 'tester', appType), path.join(currentPath));
    }
  }
};
