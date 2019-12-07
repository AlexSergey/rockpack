const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rock/compiler');
const path = require('path');

const alias = {
    alias: {
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server')
    }
};
/*frontendCompiler({
    src: './src/client.jsx'
})*/

isomorphicCompiler([
    {
        compiler: backendCompiler,
        config: {
            src: 'src/server.jsx',
            dist: 'dist',
            debug: true
        },
        callback: config => {
            Object.assign(config.resolve, alias);
        }
    },
    {
        compiler: frontendCompiler,
        config: {
            src: 'src/client.jsx',
            dist: 'public',
            styles: 'styles.css',
            debug: true,
            copy: [
                { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' }
            ]
        },
        callback: config => {
            Object.assign(config.resolve, alias);
        }
    }
]);

/*const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('rocket-starter');
const path = require('path');

isomorphicCompiler([
    {
        compiler: backendCompiler,
        config: {
            src: 'src/server.jsx',
            dist: 'dist'
        }
    },
    {
        compiler: frontendCompiler,
        config: {
            src: 'src/client.jsx',
            vendor: [
                'react',
                'react-dom',
                'react-router-dom',
                'react-meta-tags',
                'redux',
                'redux-logger',
                'react-redux',
                'immutable',
                'prop-types',
                'redux-saga',
                'connected-react-router',
                'react-router',
                'history',
                'redux-act',
                'isomorphic-fetch',
                'object-path',
                'valid-types',
                '@loadable/component'
            ],
            dist: 'public',
            styles: 'styles.css',
            copy: [
                { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' }
            ]
        }
    }
]);*/
