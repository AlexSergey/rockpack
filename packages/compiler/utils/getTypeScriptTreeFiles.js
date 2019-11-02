const glob = require('glob');
const path = require('path');

module.exports = function getTypeScriptTreeFiles(srcFolder) {
    return new Promise((resolve, reject) => {
        const root = path.dirname(require.main.filename);
        glob(`${path.resolve(root, srcFolder)}/**/!(*.d.ts)`, function (err, files) {
            if (err) {
                return reject(err);
            }
            files = files
                .filter(file => {
                    let extL = file.lastIndexOf('.');
                    let ext = file.slice(extL, file.length);
                    return ['.ts', '.tsx'].indexOf(ext) >= 0;
                });

            return resolve(files);
        });
    });
}
