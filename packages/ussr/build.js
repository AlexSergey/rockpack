const { multiCompiler, libraryCompiler } = require('../compiler');

const externals = [
    'react',
    'react-dom/server',
    'react-meta-tags',
    'react-meta-tags/server',
    'react-router-dom',
    'react-redux',
    'history',
    'isomorphic-style-loader',
    'isomorphic-style-loader/StyleContext',
    'isomorphic-style-loader/withStyles'
];

multiCompiler([
    {
        compiler: libraryCompiler,
        libraryName: 'ussr-backend',
        config: {
            src: './src/backend.jsx',
            debug: true
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
            src: './src/client.jsx',
            debug: true
        },
        callback: config => {
            config.externals = externals;
        }
    }
]);
