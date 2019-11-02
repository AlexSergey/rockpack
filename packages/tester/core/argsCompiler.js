const path = require('path');
const defaultProps = require('../defaultProps');
const deepExtend = require('deep-extend');
const createPaths = require('../modules/createPaths');
const compileSrc = require('../modules/compileSrc');
const { isString } = require('valid-types');

module.exports = function argsCompilers(opts = {}, mode) {
    const options = deepExtend({}, defaultProps, opts);
    const rootFolder = path.resolve(__dirname, '..');
    let { rootProjectFolder, src } = createPaths(options);

    let argv = '';

    argv += ` --rootDir="${rootProjectFolder}"`;


    if (isString(options.configPath)) {
        argv += ` --config="${options.configPath}"`;
    }
    else {
        switch (mode) {
            case 'run':
                argv += ` --config="${rootFolder}/configs/config.run.js"`;
                break;
            case 'watch':
                argv += ` --config="${rootFolder}/configs/config.watch.js"`;
                break;
        }
    }

    argv = compileSrc(argv, src, options);

    if (mode === 'watch') {
        argv += ' --watchAll';
    }

    return argv;
};
