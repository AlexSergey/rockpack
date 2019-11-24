const { multiCompiler, libraryCompiler } = require('../compiler');

const externals = [
    'react',
    'react-dom/server',
    'isomorphic-style-loader',
    'isomorphic-style-loader/StyleContext',
    'isomorphic-style-loader/withStyles'
];

multiCompiler([
    {
        compiler: libraryCompiler,
        libraryName: 'ussr-backend',
        config: {
            src: './src/backend.js',
            debug: true
        },
        callback: config => {
            config.node = {
                net: 'empty',
                fs: 'empty',
                path: true,
                stream: true
            };
            config.target = 'node';
            config.externals = externals;
        }
    },
    {
        compiler: libraryCompiler,
        libraryName: 'ussr-client',
        config: {
            dist: './client',
            src: './src/client.js',
            debug: true
        },
        callback: config => {
            config.externals = externals;
        }
    }
]);
