import path from 'node:path';

import type { CompilerConf, Mode } from '../types.js';

interface OutputConfig {
  clean: boolean;
  filename: string;
  globalObject?: string;
  library?: string;
  libraryTarget?: string;
  path: string;
  pathinfo: boolean;
  publicPath: string;
}

export const makeOutput = (conf: Partial<CompilerConf>, root: string, mode: Mode): OutputConfig => {
  const distPath =
    conf.dist && path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist ?? 'dist/index.js');

  const outputProps: OutputConfig = {
    clean: true,
    filename: '[name].js',
    path: path.dirname(distPath),
    pathinfo: mode === 'development',
    publicPath: '/',
  };

  if (conf.library) {
    outputProps.globalObject = 'globalThis';
    outputProps.library = conf.library;
    outputProps.libraryTarget = 'umd';
  }

  return outputProps;
};
