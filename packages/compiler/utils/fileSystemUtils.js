const fs = require('fs');
const glob = require('glob');
const path = require('path');
const mkdirp = require('mkdirp');

function getFiles(srcFolder, query = '*', ignore = []) {
  return new Promise((resolve, reject) => {
    const root = path.dirname(require.main.filename);

    glob(`${path.resolve(root, srcFolder)}/**/${query}`, {
      ignore
    }, (err, files) => {
      if (err) {
        return reject(err);
      }

      return resolve(
        files
          .filter(file => !fs.lstatSync(file)
            .isDirectory())
      );
    });
  });
}

function getTypeScript(srcFolder) {
  return new Promise((resolve, reject) => {
    const root = path.dirname(require.main.filename);

    glob(`${path.resolve(root, srcFolder)}/**/!(*.d.ts)`, (err, files) => {
      if (err) {
        return reject(err);
      }
      const tsAndTsx = files
        .filter(file => !fs.lstatSync(file)
          .isDirectory())
        .filter(file => {
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
  getTypeScript,
  getFiles,
  writeFile
};
