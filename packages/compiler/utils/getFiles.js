const glob = require('glob');
const path = require('path');

function getFiles(srcFolder, query = '*', ignore = []) {
    return new Promise((resolve, reject) => {
        const root = path.dirname(require.main.filename);

        glob(`${path.resolve(root, srcFolder)}/**/${query}`, {
            ignore
        }, (err, files) => {
            if (err) {
                return reject(err);
            }

            return resolve(files);
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
            const tsAndTsx = files.filter(file => {
                const extL = file.lastIndexOf('.');
                const ext = file.slice(extL, file.length);
                return ['.ts', '.tsx'].indexOf(ext) >= 0;
            });

            return resolve(tsAndTsx);
        });
    });
}

module.exports = {
    getTypeScript,
    getFiles
};
