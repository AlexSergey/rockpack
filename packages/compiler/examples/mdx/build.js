let { frontendCompiler } = require('../../index');

frontendCompiler({
    banner: true,
    styles: 'style.css',
    vendor: ['react', 'react-dom', 'core-js']
});
