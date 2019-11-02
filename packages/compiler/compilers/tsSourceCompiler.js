const { existsSync } = require('fs');
const mergeConfWithDefault = require('../modules/mergeConfWithDefault');
const makeMode = require('../modules/makeMode');
const ts = require('typescript');
const path = require('path');
const makeCompilerOptions = require('../utils/makeCompilerOptions');
const getTypeScriptTreeFiles = require('../utils/getTypeScriptTreeFiles');
const prepareToCopyFiles = require('../utils/prepareToCopyFiles');
const { copySync, readFileSync } = require('fs-extra');
const { isArray } = require('valid-types');
const defaultProps = require('../defaultProps');

async function tsSourceCompiler(options, cb, configOnly = false) {
    let compilerOptions;
    const root = path.dirname(require.main.filename);
    const mode = makeMode();
    const mergedConfig = await mergeConfWithDefault(options, mode);

    if (existsSync(path.resolve(root, options.tsconfig))) {
        compilerOptions = makeCompilerOptions(root, options.tsconfig);
    }
    else {
        console.error('tsconfig: Must be correct path to tsconfig file');
        return process.exit(1);
    }
    const l = mergedConfig.src.indexOf('/');
    const srcFolder = defaultProps.src === mergedConfig.src ?
        mergedConfig.src.slice(0, l) :
        mergedConfig.src;
    let entries, copyFiles;
    try {
        entries = await getTypeScriptTreeFiles(srcFolder);
        copyFiles = await prepareToCopyFiles(srcFolder, undefined, ['**/*.ts', '**/*.tsx']);
    } catch (err) {
        console.error(err);
        return process.exit(1);
    }
    var host = ts.createCompilerHost(compilerOptions.options);
    var program = ts.createProgram(entries, compilerOptions.options, host);
    ts.createTypeChecker(program, true);
    program.emit();

    if (isArray(copyFiles)) {
        copyFiles.forEach(file => {
            let filePth = file.replace(path.join(root, srcFolder), '');
            copySync(path.join(root, srcFolder, filePth), path.join(compilerOptions.options.outDir, filePth))
        });
    }

    process.exit(0);
}

module.exports = tsSourceCompiler;
