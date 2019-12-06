const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');
const generate = require('@babel/generator');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const tempy = require('tempy');
const { normalize } = require('path');
const mergePoFiles = require('./mergePoFiles');
const mkdirp = require('mkdirp');

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
                        const result = [];

                        traverse.default(ast, {
                            CallExpression: (path) => {
                                let found = {
                                    state: false
                                };

                                if (Array.isArray(path.node.arguments)) {
                                    path.node.arguments.forEach(a => {
                                        if (a.property && a.property.value) {
                                            if (this.options.variables.indexOf(a.property.value) >= 0) {
                                                found = {
                                                    name: a.property.value,
                                                    state: true
                                                };
                                            }
                                        }
                                    });
                                }

                                if (found.state) {
                                    let part = generate.default(path.parent);

                                    if (part && part.code) {
                                        try {
                                            let expression = part.code.replace(/Object\((.*?)\)/, '');
                                            if (expression && expression.length > 0) {
                                                console.log(found.name, ' -> ', expression);
                                                result.push(`${found.name}${expression}`);
                                            }
                                        }
                                        catch (e) {
                                            console.error(`Cant parse ${found.name}`, e);
                                        }
                                    }
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
