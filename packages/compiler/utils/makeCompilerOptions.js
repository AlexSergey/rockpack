const ts = require('typescript');
const path = require('path');

function makeCompilerOptions(root, pth) {
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

    const compilerOptions = ts.parseJsonConfigFileContent(
        configFile.config,
        parseConfigHost,
        root
    );
    return compilerOptions;
}

module.exports = makeCompilerOptions;
