const fs = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');
const merge = require('package-merge');
const extend = require('deep-extend');
const fsExtra = require('fs-extra');
const sortPackageJSON = require('sort-package-json');

const [, , action, cliDir = join(__dirname, '..')] = process.argv;

const projectFolder = pkgDir.sync(join(cliDir, '..'));
const copyPath = join(cliDir, 'copy');
const mergePath = join(cliDir, 'merge');

if (fs.existsSync(join(projectFolder, './.git'))) {
  const dst = fs.readFileSync(join(projectFolder, 'package.json'));
  const src = fs.readFileSync(join(mergePath, 'package.json'));

  fs.writeFileSync(join(projectFolder, 'package.json'), sortPackageJSON(merge(dst, src)));
}
else {
  console.error('Git wasn\'t initalized in the project. Husky didn\'t install.');
}

if (fs.existsSync(join(projectFolder, 'tsconfig.json'))) {
  const dst = fs.readFileSync(join(projectFolder, 'tsconfig.json'), 'utf8');
  const src = fs.readFileSync(join(mergePath, 'tsconfig.json'), 'utf8');

  if ((typeof dst === 'string' && dst.length > 0) && (typeof src === 'string' && src.length > 0)) {
    fs.writeFileSync(join(projectFolder, 'tsconfig.json'), JSON.stringify(extend({}, JSON.parse(src), JSON.parse(dst)), null, 2));
  }
}
else {
  fsExtra.copySync(join(mergePath, 'tsconfig.json'), join(projectFolder, 'tsconfig.json'));
}

fs.readdirSync(copyPath).forEach(function(file) {
  if (!fs.existsSync(join(projectFolder, file))) {
    fsExtra.copySync(join(copyPath, file), join(projectFolder, file));
  }
  else {
    console.error(`File ${file} already exists`);
  }
});
