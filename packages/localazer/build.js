const { libraryCompiler } = require('@rock/compiler');

libraryCompiler('localazer', {}, config => {
    config.externals = [{
        react: {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }]
});
