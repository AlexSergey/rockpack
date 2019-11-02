let { multiCompiler, frontendCompiler, libraryCompiler, backendCompiler } = require('../../index');

multiCompiler([
    {
        compiler: backendCompiler,
        config: {
            src: './backend/src/index.js',
            dist: './backend/dist'
        }
    },
    {
        compiler: frontendCompiler,
        config: {
            src: './client/src/index.jsx',
            dist: './client/dist',
            banner: true,
            styles: 'style.css'
        }
    },
    {
        compiler: libraryCompiler,
        libraryName: 'MyLib',
        config: {
            src: './library/src/index.js',
            dist: './library/dist',
            write: true,
            html: false
        }
    }
]);
