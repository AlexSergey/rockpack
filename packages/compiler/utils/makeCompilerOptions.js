const ts = require('typescript');
const path = require('path');
const deepExtend = require('deep-extend');

function makeCompilerOptions(root, pth, outDir, format) {
  const parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true
  };
  
  const configPath = ts.findConfigFile(
    root,
    ts.sys.fileExists,
    path.resolve(root, pth)
  );
  
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  
  if (format === 'cjm') {
    deepExtend(configFile.config, {
      compilerOptions: {
        module: 'commonjs',
        target: 'es5',
        outDir,
        baseUrl: './',
        declaration: true
      }
    });
  } else if (format === 'esm') {
    deepExtend(configFile.config, {
      compilerOptions: {
        module: 'es2015',
        importHelpers: true,
        moduleResolution: 'node',
        target: 'es2015',
        outDir,
        baseUrl: './'
      }
    });
  } else {
    deepExtend(configFile.config, {
      compilerOptions: {
        outDir
      }
    });
  }
  
  return ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    root
  );
}

module.exports = makeCompilerOptions;
