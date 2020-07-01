const { multiCompiler, frontendCompiler, libraryCompiler, backendCompiler } = require('../../index');

multiCompiler(
  backendCompiler({
    src: './backend/src/index.js',
    dist: './backend/dist'
  }),
  frontendCompiler({
    src: './client/src/index.jsx',
    dist: './client/dist',
    banner: true,
    styles: 'style.css'
  }),
  libraryCompiler('MyLib', {
    src: './library/src/index.js',
    dist: './library/dist',
    html: false
  })
);
