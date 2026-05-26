import { frontendCompiler } from '@rockpack/compiler';
import fs from 'node:fs';
import path from 'node:path';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8')) as { version: string };

void frontendCompiler({
  html: {
    favicon: path.resolve(import.meta.dirname, './favicon.ico'),
    template: path.resolve(import.meta.dirname, './index.ejs'),
  },
  styles: 'styles.css',
  vendor: ['react', 'react-dom'],
  version: packageJson.version,
});
