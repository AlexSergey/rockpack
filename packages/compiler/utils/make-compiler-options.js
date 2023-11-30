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
        },
      });
      break;

    case moduleFormats.esm:
      deepExtend(configFile.config, {
        compilerOptions: {
          baseUrl: './',
          importHelpers: true,
          module: 'ESNext',
          moduleResolution: 'node',
          outDir,
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
