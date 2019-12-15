const { existsSync, readFileSync, lstatSync } = require('fs');
const { isString } = require('valid-types');
const makeResolve = require('../modules/makeResolve');
const strip = require('strip-comments');
const { transform } = require('@babel/core');
const { parse } = require('@babel/parser');
const { babelOpts } = require('../modules/makeModules');
const traverse = require('@babel/traverse');
const generator = require('@babel/generator');

const { extensions } = makeResolve();

const docgenParse = (conf) => {
    let sections = [];
    let languages = [];

    if (isString(conf.src.index)) {
        let found = false;
        for (let i = 0, l = extensions.length; i < l; i++) {
            let ext = extensions[i];
            if (!found) {
                let pth = conf.src.index.indexOf(ext) < 0 ? `${conf.src.index}${ext}` : conf.src.index;
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
                        let opts = babelOpts({
                            framework: 'react'
                        });
                        opts.plugins.push(require.resolve('@babel/plugin-transform-modules-commonjs'));
                        opts.sourceType = 'module';
                        let res = transform(src, opts);

                        let ast = parse(res.code, opts);

                        const buildUrls = (children, fill, props) => {
                            if (!children) {
                                return fill;
                            }
                            if (Array.isArray(children)) {
                                children.forEach(c => {
                                    let f = {};
                                    fill.push(f);
                                    buildUrls(c, fill, f)
                                });
                            }
                            switch (children.type) {
                                case 'ObjectExpression':
                                    children.properties.forEach(p => {
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
                                                            let _p = {};
                                                            props.children = [];
                                                            props.children.push(_p);
                                                            p.value.elements.forEach(c => {
                                                                buildUrls(c, fill, _p)
                                                            });
                                                        }
                                                        else {
                                                            if (p.value.type === 'ObjectExpression') {
                                                                let _p = {};
                                                                props.children = [];
                                                                props.children.push(_p);
                                                                buildUrls(p.value, fill, _p)
                                                            }
                                                        }
                                                        break;
                                                }
                                            }
                                        }
                                    });
                                    break;
                            }
                            return fill;
                        };

                        traverse.default(ast, {
                            ObjectProperty: (path) => {
                                if (path.node.key.name === 'docgen') {
                                    if (sections.length === 0) {
                                        let { code } = generator.default(path.node.value);
                                        let hasLocalization = false;
                                        if (code.indexOf('url') >= 0) {
                                            if (Array.isArray(path.container)) {
                                                path.container.forEach(siblings => {
                                                    if (siblings.key.name === 'localization') {
                                                        hasLocalization = true;
                                                        if (Array.isArray(siblings.value.properties)) {
                                                            siblings.value.properties.forEach(l => {
                                                                languages.push(l.key.name);
                                                            });
                                                        }
                                                    }
                                                })
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
            console.error(e);
        }
    }

    return { sections, languages };
};

module.exports = docgenParse;
