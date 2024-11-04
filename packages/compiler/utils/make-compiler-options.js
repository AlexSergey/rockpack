const deepExtend = require('deep-extend');
const path = require('node:path');
const ts = require('typescript');

const { moduleFormats } = require('../constants');

function makeCompilerOptions(root, pth, outDir, format) {
  const parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
    useCaseSensitiveFileNames: true,
  };

  const configPath = ts.findConfigFile(root, ts.sys.fileExists, path.resolve(root, pth));

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);

  switch (format) {
    case 'dts':
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          declaration: true,
          emitDeclarationOnly: true,
          outDir,
        },
      });
      break;

    case moduleFormats.cjs:
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          module: 'commonjs',
          moduleResolution: 'node',
          outDir,
        },
      });
      break;

    case moduleFormats.esm:
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          module: 'ESNext',
          moduleResolution: 'node',
          outDir,
          target: 'ESNext',
        },
      });
      break;

    default:
      deepExtend(configFile.config, {
        compilerOptions: {
          outDir,
        },
      });
      break;
  }

  return ts.parseJsonConfigFileContent(configFile.config, parseConfigHost, root);
}

module.exports = makeCompilerOptions;
