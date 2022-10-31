const fs = require('fs');
const path = require('path');

const {
  addons,
  backbone
} = require('../utils/pathes');

const copy = require('../utils/copy');

const copyFiles = async (currentPath, {
  appType,
  tester,
  codestyle,
  nogit
}) => {
  await copy(
    path.join(backbone, appType),
    path.join(currentPath)
  );

  if (codestyle) {
    await copy(
      path.join(addons, 'codestyle', 'common'),
      path.join(currentPath)
    );

    if (!nogit) {
      await copy(
        path.join(addons, 'git'),
        path.join(currentPath)
      );
    }

    if (appType === 'library' || appType === 'ssr' || appType === 'csr') {
      await copy(
        path.join(addons, 'codestyle', appType),
        path.join(currentPath)
      );
    }
  }

  if (tester) {
    await copy(
      path.join(addons, 'tester', 'common'),
      path.join(currentPath)
    );
    if (appType === 'csr' || appType === 'ssr' || appType === 'component') {
      await copy(
        path.join(addons, 'tester', 'react-common'),
        path.join(currentPath)
      );
      await copy(
        path.join(addons, 'tester', appType),
        path.join(currentPath)
      );
    } else if (appType === 'library') {
      await copy(
        path.join(addons, 'tester', appType),
        path.join(currentPath)
      );
    }
  }
}

module.exports = copyFiles;
