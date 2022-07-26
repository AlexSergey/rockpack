const fs = require('node:fs');
const path = require('node:path');

const { getRootRequireDir } = require('@rockpack/utils');
const glob = require('glob');
const mkdirp = require('mkdirp');

function getFiles(srcFolder, query = '*', ignore = []) {
  return new Promise((resolve, reject) => {
    const root = getRootRequireDir();

    glob(
      `${path.resolve(root, srcFolder)}/**/${query}`,
      {
        ignore,
      },
      (err, files) => {
        if (err) {
          return reject(err);
        }

        return resolve(files.filter((file) => !fs.lstatSync(file).isDirectory()));
      },
    );
  });
}

function getTypeScript(srcFolder) {
  return new Promise((resolve, reject) => {
    const root = getRootRequireDir();

    glob(`${path.resolve(root, srcFolder)}/**/!(*.d.ts)`, (err, files) => {
      if (err) {
        return reject(err);
      }
      const tsAndTsx = files
        .filter((file) => !fs.lstatSync(file).isDirectory())
        .filter((file) => {
          const extL = file.lastIndexOf('.');
          const ext = file.slice(extL, file.length);

          return ['.ts', '.tsx'].indexOf(ext) >= 0;
        });

      return resolve(tsAndTsx);
    });
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
