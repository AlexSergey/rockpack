const { multiCompiler, libraryCompiler } = require('../compiler');

const externals = [
    'react',
    'react-dom/server',
    'react-meta-tags',
    'react-meta-tags/server',
    'react-router-dom',
    'react-redux',
    'history'
];

multiCompiler([
    {
        compiler: libraryCompiler,
        libraryName: 'ussr-backend',
        config: {
            src: './src/backend.jsx'
        },
        callback: config => {
            config.node = {
                fs: 'empty',
                path: true,
                stream: true
            };
            config.externals = externals;
        }
    },
    {
        compiler: libraryCompiler,
        libraryName: 'ussr-client',
        config: {
            dist: './client',
            src: './src/client.jsx'
        },
        callback: config => {
            config.externals = externals;
        }
    }
]);
