const fs = require('fs');
const path = require('path');

const {
  addons,
  backbone
} = require('../utils/pathes');

const copy = require('../utils/copy');

const copyFiles = async (currentPath, {
  modules,
  appType,
  typescript,
  tester,
  codestyle
}) => {
  await copy(
    path.join(backbone, appType, typescript ? 'typescript' : 'simple'),
    path.join(currentPath)
  );

  if (codestyle) {
    await copy(
      path.join(addons, 'codestyle', 'common'),
      path.join(currentPath)
    );
  }

  if (tester) {
    if (appType === 'csr' || appType === 'ssr') {
      await copy(
        path.join(addons, 'tester', 'react-common'),
        path.join(currentPath)
      );
    } else {
      await copy(
        path.join(addons, 'tester', 'common'),
        path.join(currentPath)
      );
    }
  }

  if (modules.localization && modules.logger) {
    await copy(
      path.join(addons, 'logger-localazer', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  } else if (!modules.localization && modules.logger) {
    await copy(
      path.join(addons, 'logger', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  } else if (modules.localization && !modules.logger) {
    await copy(
      path.join(addons, 'localazer', appType, typescript ? 'typescript' : 'simple'),
      path.join(currentPath)
    );
  }
}

module.exports = copyFiles;
