const path = require('path');
const fs = require('fs');
const { isArray } = require('valid-types');

module.exports = function(options) {
    let currentProjectFolder = path.dirname(require.main.filename);
    let src = isArray(options.src) ? options.src : [options.src];

    src = src.filter(src => fs.existsSync(path.resolve(currentProjectFolder, src)));

    let backMax = Math.max.apply(null, src.map(s => {
        return s.split('../').length - 1;
    }));

    let rootProjectFolder = path.join(currentProjectFolder, Array(backMax).fill('../').join(''));

    src = src.map(src => {
        return path.resolve(currentProjectFolder, src);
    });

    src = src.map(src => {
        return src.replace(rootProjectFolder, '');
    });

    return { rootProjectFolder, currentProjectFolder, src }
}
