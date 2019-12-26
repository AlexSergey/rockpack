const { libraryCompiler } = require('../compiler');

libraryCompiler('docgen', {
    dist: './dist',
    src: './lib/index.jsx',
    inline: true,
    styles: false
}, config => {
    config.externals = [
        'react',
        '@rock/localazer'
    ];
});
