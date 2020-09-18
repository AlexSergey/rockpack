const { frontendCompiler } = require('@rockpack/compiler');

frontendCompiler({
  styles: 'dist/styles.css',
  vendor: ['react', 'react-dom']
});
