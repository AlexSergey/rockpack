const { existsSync } = require('fs');
const babelJest = require('babel-jest');
const path = require('path');
const { isString, isObject } = require('valid-types');

function babelOpts({
   isNodejs = false,
   framework = false,
   loadable = false
}) {
    const root = path.dirname(require.main.filename);
    const packageJson = existsSync(path.resolve(root, 'package.json')) ? require(path.resolve(root, 'package.json')) : {};
    let corejs = false;

    if (packageJson && isObject(packageJson.dependencies)) {
        if (isString(packageJson.dependencies['core-js'])) {
            corejs = packageJson.dependencies['core-js'];
        }
    }

    var opts = {
        babelrc: false,
        presets: [
            [require.resolve('@babel/preset-env'), Object.assign({
                modules: false,
                loose: true,
            }, isNodejs ? {
                targets: {
                    node: "current"
                }
            } : {
                targets: {
                    browsers: [
                        "> 5%"
                    ]
                }
            }, isString(corejs) ? {
                corejs,
                useBuiltIns: 'usage'
            } : {})]
        ],
        plugins: [],
        env: {
            production: {}
        }
    };

    switch (framework) {
        case 'react':
            opts.presets.push(
                require.resolve('@babel/preset-react')
            );

            opts.plugins = opts.plugins.concat([
                require.resolve('@babel/plugin-syntax-dynamic-import'),
                require.resolve('@babel/plugin-transform-flow-comments'),
                [require.resolve('@babel/plugin-proposal-decorators'), { "legacy": true }],
                require.resolve('@babel/plugin-proposal-class-properties'),
                require.resolve('@babel/plugin-proposal-object-rest-spread')
            ]);

            opts.env.production = Object.assign({}, opts.env.production, {
                plugins: [
                    require.resolve('@babel/plugin-transform-react-constant-elements'),
                    require.resolve('@babel/plugin-transform-react-inline-elements'),
                    require.resolve('babel-plugin-transform-react-pure-class-to-function'),
                    require.resolve('babel-plugin-transform-react-remove-prop-types')
                ]
            });
            break;
    }

    if (loadable) {
        opts.plugins.push(
            require.resolve('@loadable/babel-plugin')
        );
    }

    return opts;
}

let opts = babelOpts({
    loadable: true,
    framework: 'react'
});

if (!opts.env) {
    opts.env = {};
}

if (!opts.env.test) {
    opts.env.test = {};
}

if (!opts.env.test.plugins) {
    opts.env.test.plugins = [];
}

opts.env.test.plugins.push(
    require.resolve('@babel/plugin-transform-modules-commonjs')
);

module.exports = babelJest.createTransformer(Object.assign({}, opts));
