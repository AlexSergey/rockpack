const { libraryCompiler } = require('../../');

libraryCompiler({
    name: 'app',
    cjs: {
        src: './src',
        dist: './lib/cjs'
    },
    esm: {
        src: './src',
        dist: './lib/esm'
    }
});
