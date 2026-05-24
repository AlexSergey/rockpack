import deepExtend from 'deep-extend';
import path from 'node:path';
import ts from 'typescript';

import { moduleFormats } from '../constants.js';

export function makeCompilerOptions(root: string, pth: string, outDir: string, format: string): ts.ParsedCommandLine {
  const parseConfigHost: ts.ParseConfigHost = {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    fileExists: ts.sys.fileExists,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    readDirectory: ts.sys.readDirectory,
    // eslint-disable-next-line @typescript-eslint/unbound-method
    readFile: ts.sys.readFile,
    useCaseSensitiveFileNames: true,
  };

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const configPath = ts.findConfigFile(root, ts.sys.fileExists, path.resolve(root, pth));
  if (!configPath) {
    throw new Error(`Could not find tsconfig at ${pth}`);
  }

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  switch (format) {
    case 'dts':
      deepExtend(configFile.config, {
        compilerOptions: { baseUrl: './', declaration: true, emitDeclarationOnly: true, outDir },
      });
      break;
    case moduleFormats.cjs:
      deepExtend(configFile.config, {
        compilerOptions: { baseUrl: './', module: 'commonjs', moduleResolution: 'node', outDir },
      });
      break;
    case moduleFormats.esm:
      deepExtend(configFile.config, {
        compilerOptions: { baseUrl: './', module: 'ESNext', moduleResolution: 'node', outDir, target: 'ESNext' },
      });
      break;
    default:
      deepExtend(configFile.config, { compilerOptions: { outDir } });
      break;
  }

  return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, root);
}
