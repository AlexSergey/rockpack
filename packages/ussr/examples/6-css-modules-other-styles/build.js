const path = require('path');
const { isomorphicCompiler, backendCompiler, frontendCompiler } = require('../../../compiler');

const alias = {
  alias: {
    'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    react: path.resolve(__dirname, './node_modules/react'),
    'react-dom/server': path.resolve(__dirname, './node_modules/react-dom/server')
  }
};

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

/*
backendCompiler({
  html: {
    template: path.resolve(__dirname, './index.ejs')
  }
},
props => {
  Object.assign(props.resolve, {
    alias: {
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      react: path.resolve(__dirname, './node_modules/react')
    }
  });
});
*/
