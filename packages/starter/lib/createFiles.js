const fs = require('fs');
const path = require('path');

const createFiles = async (currentPath, {
  modules,
  appType,
  typescript,
  tester,
  codestyle
}) => {
  if (fs.existsSync(path.join(currentPath, '.env.example'))) {
    fs.copyFileSync(path.join(currentPath, '.env.example'), path.join(currentPath, '.env'));
  }
};

module.exports = createFiles;
