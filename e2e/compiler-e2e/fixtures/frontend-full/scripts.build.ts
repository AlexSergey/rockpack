import { frontendCompiler } from '@rockpack/compiler';
import path from 'node:path';

void frontendCompiler({
  banner: true,
  copy: [{ from: path.resolve('static/robots.txt'), to: './' }],
  global: { APP_NAME: 'full-fixture' },
  html: {
    code: 'window.FIXTURE_CODE = true;',
    favicon: path.resolve('favicon.ico'),
    template: path.resolve('index.ejs'),
  },
  styles: 'styles.css',
  vendor: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
  version: '2.3.4',
});
