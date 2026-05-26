import { frontendCompiler } from '@rockpack/compiler';
import path from 'node:path';

void frontendCompiler({
  banner: true,
  html: {
    code: process.env.SUPER_DEBUG ? `window.SUPER_DEBUG = '${process.env.SUPER_DEBUG}';` : null,
    favicon: path.resolve(import.meta.dirname, './favicon.ico'),
    template: path.resolve(import.meta.dirname, './index.ejs'),
  },
  styles: 'style.css',
});
