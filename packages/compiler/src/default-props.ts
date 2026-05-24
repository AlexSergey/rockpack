import type { CompilerConf } from './types.js';

export const defaultProps: Pick<CompilerConf, 'debug' | 'dist' | 'html' | 'port' | 'src'> = {
  debug: false,
  dist: 'dist/index.js',
  html: true,
  port: 3000,
  src: 'src/index',
};
