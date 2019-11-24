const { libraryCompiler } = require('../compiler');

libraryCompiler('fetcher', {}, config => {
    config.externals = [{
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }];
});
