let { frontendCompiler } = require('../../index');

frontendCompiler({
    src: {
        a: './src/a.js',
        b: './src/b.js'
    },
    banner: true,
    styles: 'style.css'
});