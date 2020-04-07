const path = require('path');
const { frontendCompiler } = require('@rock/compiler');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    react: path.resolve(__dirname, './node_modules/react'),
    'react-dom/server': path.resolve(__dirname, './node_modules/react-dom/server')
  }
};

frontendCompiler({
  copy: {
    from: './locales',
    to: './lang'
  }
}, config => {
  Object.assign(config.resolve, alias);
});

/*const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('@rock/compiler');
const path = require('path');

const isIsomorphic = process.argv[process.argv.length - 1] === '--isomorphic';

const alias = {
    alias: {
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom/server': path.resolve(__dirname, '../../node_modules/react-dom/server')
    }
};

if (isIsomorphic) {
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
}
else {
    frontendCompiler({
        src: 'src/client.jsx',
        dist: 'public',
        styles: 'styles.css',
        debug: true,
        global: {
            FRONT_ONLY: true
        },
        copy: [
            { from: path.resolve(__dirname, './src/assets/favicon.ico'), to: './' }
        ],
        vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'redux'
        ]
    }, config => {
        Object.assign(config.resolve, alias);
    });
}
*/
