const path = require('node:path');

const deepExtend = require('deep-extend');
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
    case moduleFormats.cjs:
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          declaration: true,
          module: 'commonjs',
          outDir,
          target: 'es5',
        },
      });
      break;

    case moduleFormats.esm:
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          importHelpers: true,
          module: 'es2015',
          moduleResolution: 'node',
          outDir,
          target: 'es2015',
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
