const { existsSync, readFileSync, lstatSync } = require('fs');
const { isString } = require('valid-types');
const strip = require('strip-comments');
const createBabelPresets = require('@rockpack/babel');
const { transform } = require('@babel/core');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');

const docgenParse = (index, extensions) => {
  let sections = [];
  const languages = [];

  if (isString(index)) {
    let found = false;
    for (let i = 0, l = extensions.length; i < l; i++) {
      const ext = extensions[i];

      if (!found) {
        const pth = index.indexOf(ext) < 0 ? `${index}${ext}` : index;

        if (existsSync(pth)) {
          found = pth;
        }
      }
    }
    try {
      if (lstatSync(found)) {
        let src = readFileSync(found, 'utf8');

        if (isString(src)) {
          src = strip(src);

          if (isString(src)) {
            const opts = createBabelPresets({
              framework: 'react'
            });
            opts.plugins.push(require.resolve('@babel/plugin-transform-modules-commonjs'));
            opts.sourceType = 'module';

            const res = transform(src, opts);
            const ast = parse(res.code, opts);

            const buildUrls = (children, fill, props) => {
              if (!children) {
                return fill;
              }

              if (Array.isArray(children)) {
                children.forEach(c => {
                  const f = {};
                  fill.push(f);
                  buildUrls(c, fill, f);
                });
              }

              if (children.type === 'ObjectExpression') {
                children.properties.forEach(p => {
                  // eslint-disable-next-line sonarjs/no-collapsible-if
                  if (p.type === 'ObjectProperty') {
                    if (p.key &&
                      p.key.type &&
                      p.key.type === 'Identifier'
                    ) {
                      switch (p.key.name) {
                        case 'url':
                          if (p.value && p.value.type === 'StringLiteral') {
                            props.url = p.value.value;
                          }
                          break;
                        case 'children':
                          if (Array.isArray(p.value.elements)) {
                            const _p = {};
                            props.children = [];
                            props.children.push(_p);
                            p.value.elements.forEach(c => buildUrls(c, fill, _p));
                          } else if (p.value.type === 'ObjectExpression') {
                            const _p = {};
                            props.children = [];
                            props.children.push(_p);
                            buildUrls(p.value, fill, _p);
                          }
                          break;
                      }
                    }
                  }
                });
              }
              return fill;
            };

            traverse.default(ast, {
              ObjectProperty: (path) => {
                // eslint-disable-next-line sonarjs/no-collapsible-if
                if (path.node.key.name === 'docgen') {
                  if (sections.length === 0) {
                    const { code } = generator.default(path.node.value);

                    if (code.indexOf('url') >= 0) {
                      if (Array.isArray(path.container)) {
                        path.container.forEach(siblings => {
                          // eslint-disable-next-line sonarjs/no-collapsible-if
                          if (siblings.key.name === 'localization') {
                            if (Array.isArray(siblings.value.properties)) {
                              siblings.value.properties.forEach(l => {
                                languages.push(l.key.name);
                              });
                            }
                          }
                        });
                      }
                      sections = buildUrls(path.node.value.elements, []);
                    }
                  }
                }
              }
            });
          }
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  return { sections, languages };
};

module.exports = docgenParse;
