let { frontendCompiler } = require('../../index');

frontendCompiler({
    banner: true,
    styles: 'style.css',
    server: {
        browserSyncPort: 4000,
        port: 3000
    }
});
