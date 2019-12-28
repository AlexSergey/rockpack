const { libraryCompiler } = require('@rock/compiler');

libraryCompiler('localazer', {}, config => {
    config.externals = ['react', 'react-dom'];
});
