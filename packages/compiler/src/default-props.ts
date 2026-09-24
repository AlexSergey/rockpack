import type { CompilerConf } from './types.js';

export const defaultProps = Object.freeze({
  debug: false,
  dist: 'dist/index.js',
  html: true,
  port: 3000,
  src: 'src/index',
} as const satisfies Pick<CompilerConf, 'debug' | 'dist' | 'html' | 'port' | 'src'>);
