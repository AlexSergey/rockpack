const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');
const generate = require('@babel/generator');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const tempy = require('tempy');
const { normalize } = require('path');
const mergePoFiles = require('./mergePoFiles');
const mkdirp = require('mkdirp');

const findValue = (ast, arg) => {
    let excludeOther = {
        value: false,
        state: false
    };

    traverse.default(ast, {
        VariableDeclarator: path => {
            if (!excludeOther.state) {
                if (path.node.id.name === arg.value.name) {
                    if (path.node.init) {
                        if (path.scope && path.scope.bindings && path.scope.bindings[arg.value.name]) {
                            if (Array.isArray(path.scope.bindings[arg.value.name].referencePaths)) {
                                path.scope.bindings[arg.value.name].referencePaths.forEach(ref => {
                                    if (ref.node.start === arg.value.start && ref.node.end === arg.value.end) {
                                        if (typeof path.node.init.value === 'string') {
                                            excludeOther.state = true;
                                            excludeOther.value = `"${path.node.init.value}"`;
                                        }
                                        else if (path.node.init && path.node.init.type === 'Identifier') {
                                            excludeOther.value = findValue(ast, {
                                                value: {
                                                    start: path.node.init.start,
                                                    end: path.node.init.end,
                                                    name: path.node.init.name
                                                }
                                            });
                                            excludeOther.state = true;
                                        }
                                        else {
                                            excludeOther.state = true;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    return excludeOther.value;
}

class MakePoPlugin {
    constructor(options) {
        console.log('Making PO file is started...');
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('MakePoPlugin', compilation => {
            compilation.hooks.optimizeChunkAssets.tapAsync('MakePoPlugin', (chunks, callback) => {
                chunks.forEach(chunk => {
                    chunk.files.forEach(filename => {
                        const source = compilation.assets[filename].source();
                        const code = source.toString();
                        const ast = parse(code);
                        const prepared = [];
                        const result = [];

                        traverse.default(ast, {
                            CallExpression: (path) => {
                                let found = {
                                    state: false,
                                    arguments: []
                                };

                                if (Array.isArray(path.node.arguments)) {
                                    path.node.arguments.forEach(a => {
                                        if (a.property && a.property.value) {
                                            if (this.options.variables.indexOf(a.property.value) >= 0) {
                                                found.name = a.property.value;
                                                found.state = true;
                                            }
                                        }
                                    });
                                }

                                if (found.state) {
                                    // Check arguments
                                    path.parent.arguments.forEach(argItem => {
                                        switch (argItem.type) {
                                            case 'Identifier':
                                                let code;
                                                try {
                                                    code = generate.default(path.parent).code;
                                                    let expression = code.replace(/Object\((.*?)\)/, '');

                                                    if (expression && expression.length > 0) {
                                                        code = `${found.name}${expression}`;
                                                    }
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                                found.arguments.push({
                                                    type: 'variable',
                                                    value: {
                                                        code,
                                                        name: argItem.name,
                                                        start: argItem.start,
                                                        end: argItem.end
                                                    }
                                                });
                                                break;
                                            case 'StringLiteral':
                                                found.arguments.push({
                                                    type: 'simple',
                                                    value: argItem.value
                                                });
                                                break;
                                        }
                                    });
                                    prepared.push(Object.assign({}, found));
                                }
                            }
                        });

                        prepared.forEach(item => {
                            if (item && item.arguments && item.arguments.length > 0) {
                                let stringArguments = '';
                                item.arguments.forEach((arg, index) => {
                                    switch (arg.type) {
                                        case 'simple':
                                            stringArguments += `"${arg.value}"`;
                                            break;

                                        case 'variable':
                                            let value = findValue(ast, arg);
                                            if (typeof value === 'string') {
                                                stringArguments += value;
                                            }
                                            break;
                                    }

                                    if (item.arguments.length - 1 !== index) {
                                        stringArguments += ', ';
                                    }
                                });

                                if (stringArguments !== '') {
                                    let fn = `${item.name}(${stringArguments})`;
                                    console.log(fn);
                                    result.push(fn);
                                }
                            }
                        });

                        if (result.length > 0) {
                            try {
                                const dict = tempy.file();
                                const list = tempy.file();

                                writeFileSync(dict, result);
                                writeFileSync(list, dict);

                                mkdirp.sync(this.options.dist);

                                execSync(
                                    'xgettext' +
                                    ' --keyword="l:1"' +
                                    ' --keyword="l:1,2c"' +
                                    ' --keyword="nl:1,2"' +
                                    ' --keyword="nl:1,2,4c"' +
                                    ' --files-from="' +
                                    list +
                                    '"' +
                                    ' --language=JavaScript' +
                                    ' --no-location' +
                                    ' --from-code=UTF-8' +
                                    ' --output="' +
                                    normalize(this.options.dist + '/messages.pot') +
                                    '"'
                                );
                                console.log('messages.pot created');

                                (async () => {
                                    console.log('if you have previous pot file it will be merged');
                                    await mergePoFiles(this.options)
                                })();

                            } catch (err) {
                                throw new Error(err);
                            }
                        }
                        else {
                            console.log('Nothing found for translation in your project');
                        }
                    });
                });
                callback();
            });
        });
    }
}

module.exports = MakePoPlugin;
