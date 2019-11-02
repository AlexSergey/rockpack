const glob = require('glob');
const path = require('path');

module.exports = function prepareToCopyFilesInTsSourceCompiler(srcFolder, query = '*', ignore = []) {
    return new Promise((resolve, reject) => {
        const root = path.dirname(require.main.filename);

        glob(`${path.resolve(root, srcFolder)}/**/${query}`, {
            ignore
        }, function (err, files) {
            if (err) {
                return reject(err);
            }

            return resolve(files);
        });
    });
}
