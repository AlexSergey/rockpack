const fs = require('fs');
const { join } = require('path');
const pkgDir = require('pkg-dir');
const merge = require('merge');
const fsExtra = require('fs-extra');
const sortPackageJSON = require('sort-package-json');

const [, , action, cliDir = join(__dirname, '..')] = process.argv;

const projectFolder = pkgDir.sync(join(cliDir, '..'));
const copyPath = join(cliDir, 'copy');
const mergePath = join(cliDir, 'merge');
const updatePath = join(cliDir, 'update');
let packageJson = fs.readFileSync(join(projectFolder, 'package.json'), 'utf8');
packageJson = JSON.parse(packageJson);

// Update
fsExtra.readdirSync(updatePath).forEach(file => {
    fsExtra.copySync(join(updatePath, file), join(projectFolder, file));
});

// Merge
if (fs.existsSync(join(projectFolder, './.git'))) {
    try {
        let src = fs.readFileSync(join(mergePath, 'package.json'), 'utf8');
        src = JSON.parse(src);
        let packageJSON = JSON.stringify(sortPackageJSON(merge({}, packageJson, src)), null, 2);
        fs.writeFileSync(join(projectFolder, 'package.json'), packageJSON);
    } catch (e) {
        console.log(e);
    }
} else {
    console.error('Git wasn\'t initalized in the project. Husky didn\'t install.');
}

// Copy if file is not exists
fs.readdirSync(copyPath).forEach(function(file) {
    if (!fs.existsSync(join(projectFolder, file))) {
        if (!packageJson.codestyle) {
            fsExtra.copySync(join(copyPath, file), join(projectFolder, file));
        }
    }
    else {
        console.error(`File ${file} already exists`);
    }
});
