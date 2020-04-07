const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');
const { writeFileSync } = require('fs');
const { execSync } = require('child_process');
const tempy = require('tempy');
const { normalize } = require('path');
const mkdirp = require('mkdirp');
const mergePoFiles = require('./mergePoFiles');

const findValue = (ast, arg) => {
  const excludeOther = {
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
                      excludeOther.value = path.node.init.value;
                    } else if (path.node.init && path.node.init.type === 'Identifier') {
                      excludeOther.value = findValue(ast, {
                        value: {
                          start: path.node.init.start,
                          end: path.node.init.end,
                          name: path.node.init.name
                        }
                      });
                      excludeOther.state = true;
                    } else {
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
};

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
              CallExpression: path => {
                let isParent = false;
                const variables = Object.keys(this.options.variables)
                  .map(key => this.options.variables[key]);
                
                const found = {
                  state: false,
                  arguments: []
                };
                
                let name = path.node.callee.name;
                
                if (!name) {
                  if (path.node.callee.property) {
                    name = path.node.callee.property.name;
                  }
                }
                
                if (variables.indexOf(name) < 0) {
                  if (Array.isArray(path.node.arguments)) {
                    path.node.arguments.forEach(a => {
                      if (a.property && a.property.value) {
                        if (variables.indexOf(a.property.value) >= 0) {
                          name = a.property.value;
                          isParent = true;
                        }
                      }
                    });
                  }
                }
                
                if (variables.indexOf(name) >= 0) {
                  found.name = name;
                  found.state = true;
                }
                
                if (found.state) {
                  const args = (isParent ? path.parent.arguments : path.node.arguments)
                    .map(argItem => {
                      if (argItem.type === 'StringLiteral') {
                        if (argItem.value) {
                          return argItem.value;
                        }
                      }
                      if (argItem.type === 'Identifier') {
                        return findValue(ast, {
                          value: {
                            name: argItem.name,
                            start: argItem.start,
                            end: argItem.end
                          }
                        });
                      }
                      return false;
                    })
                    .filter(item => typeof item === 'string')
                    .map(item => `"${item}"`);
                  
                  if (Array.isArray(args) && args.length > 0) {
                    const fn = `${name}(${args.join(', ')});`;
                    console.log(fn);
                    result.push(fn);
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
                  [
                    'xgettext',
                    ` --keyword="${this.options.variables.gettext}:1"`,
                    ` --keyword="${this.options.variables.gettext}:1,2c"`,
                    ` --keyword="${this.options.variables.ngettext}:1,2"`,
                    ` --keyword="${this.options.variables.ngettext}:1,2,4c"`,
                    ` --files-from="${list}"`,
                    ' --language=JavaScript',
                    ' --no-location',
                    ' --from-code=UTF-8',
                    `  --output="${normalize(`${this.options.dist}/messages.pot`)}"`
                  ].join('')
                );
                console.log('messages.pot created');
                
                (async () => {
                  console.log('if you have previous pot file it will be merged');
                  await mergePoFiles(this.options);
                })();
              } catch (err) {
                throw new Error(err);
              }
            } else {
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
