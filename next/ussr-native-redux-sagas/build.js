const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rock/compiler');
const path = require('path');

const alias = {
    alias: {
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server')
    }
};
frontendCompiler({
    src: 'src/client.jsx',
}, config => {
    Object.assign(config.resolve, alias);
});
/*
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
            ],
            vendor: [
                'react',
                'react-dom',
                'react-router-dom',
                'redux'
            ]
        },
        callback: config => {
            Object.assign(config.resolve, alias);
        }
    }
]);
*/
