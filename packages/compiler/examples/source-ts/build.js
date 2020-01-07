const { libraryCompiler } = require('../../');

libraryCompiler({
    name: 'Color',
    cjs: {
        src: './src',
        dist: './lib/cjs'
    },
    esm: {
        src: './src',
        dist: './lib/esm'
    }
});
