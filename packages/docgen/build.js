const { libraryCompiler } = require('../compiler');

libraryCompiler('docgen', {
    inline: true,
    styles: false
}, config => {
    config.externals = [
        'react',
        '@rock/localazer'
    ];
});
