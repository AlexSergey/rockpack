const { existsSync } = require('fs');
const mergeConfWithDefault = require('../modules/mergeConfWithDefault');
const makeMode = require('../modules/makeMode');
const eslintFormatter = require('eslint-formatter-pretty');
const ts = require('typescript');
const path = require('path');
const makeCompilerOptions = require('../utils/makeCompilerOptions');
const getTypeScriptTreeFiles = require('../utils/getTypeScriptTreeFiles');
const prepareToCopyFiles = require('../utils/prepareToCopyFiles');
const { copySync } = require('fs-extra');
const { isArray } = require('valid-types');
const defaultProps = require('../defaultProps');
const errorHandler = require('../errorHandler');
const { CLIEngine } = require('eslint');
const pathToEslintrc = require('../utils/pathToEslintrc');
const { isString } = require('valid-types');

async function tsSourceCompiler(options = {}) {
    errorHandler();
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
        let eslintrc = pathToEslintrc(root, mode);

        if (isString(eslintrc)) {
            let cli = new CLIEngine(require(eslintrc));
            let report = cli.executeOnFiles(entries);
            let errors = eslintFormatter(report.results);
            if (errors) {
                console.log(errors);
                return process.exit(1);
            }
        }

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
