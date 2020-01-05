const { frontendCompiler } = require('../../');

frontendCompiler({
    esm: {
        src: './src',
        dist: './lib/esm'
    }
});
