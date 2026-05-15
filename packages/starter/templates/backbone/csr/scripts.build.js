const { frontendCompiler } = require('@rockpack/compiler');
const fs = require('node:fs');
const path = require('node:path');

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

frontendCompiler({
  html: {
    favicon: path.resolve(__dirname, './favicon.ico'),
    template: path.resolve(__dirname, './index.ejs'),
  },
  styles: 'styles.css',
  vendor: ['react', 'react-dom'],
  version: packageJson.version,
});
