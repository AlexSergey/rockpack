const fs = require('node:fs');
const path = require('node:path');

const { getRootRequireDir } = require('@rockpack/utils');
const { glob } = require('glob');
const mkdirp = require('mkdirp');

async function getFiles(srcFolder, query = '*', ignore = []) {
  const root = getRootRequireDir();

  const files = await glob(`${path.resolve(root, srcFolder)}/**/${query}`, {
    ignore,
  });

  return files.filter((file) => !fs.lstatSync(file).isDirectory());
}

async function getTypeScript(srcFolder) {
  const root = getRootRequireDir();

  const files = await glob(`${path.resolve(root, srcFolder)}/**/!(*.d.ts)`);

  return files
    .filter((file) => !fs.lstatSync(file).isDirectory())
    .filter((file) => {
      const extL = file.lastIndexOf('.');
      const ext = file.slice(extL, file.length);

      return ['.ts', '.tsx'].indexOf(ext) >= 0;
    });
}

function writeFile(pth, contents) {
  mkdirp.sync(path.dirname(pth));
  fs.writeFileSync(pth, contents);
}

module.exports = {
  getFiles,
  getTypeScript,
  writeFile,
};
