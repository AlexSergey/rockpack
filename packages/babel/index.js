const { existsSync } = require('fs');
const path = require('path');
const { isString, isObject } = require('valid-types');

const createBabelPresets = ({
  isNodejs = false,
  framework = false,
  isomorphic = false,
  modules = false,
  isProduction = false,
  isTest = false,
  typescript = false
}) => {
  const root = path.dirname(require.main.filename);
  const packageJsonPath = path.resolve(root, 'package.json');
  // eslint-disable-next-line global-require
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  let corejs = false;

  if (packageJson &&
    isObject(packageJson.dependencies) &&
    isString(packageJson.dependencies['core-js'])
  ) {
    corejs = packageJson.dependencies['core-js'];
  }

  const opts = typescript ? {
    babelrc: false,
    presets: [
      require.resolve('@babel/preset-typescript')
    ],
    plugins: [],
    env: {
      production: {}
    }
  } : {
    babelrc: false,
    presets: [
      [require.resolve('@babel/preset-env'), Object.assign({
        modules,
        loose: true,
      }, isNodejs ? {
        targets: {
          node: 'current'
        }
      } : {
        targets: {
          browsers: [
            '> 5%'
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

  opts.plugins = [
    [
      require.resolve('@babel/plugin-proposal-pipeline-operator'),
      { proposal: 'minimal' }
    ],
    require.resolve('@babel/plugin-proposal-do-expressions'),
    require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
    [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      { loose: false }
    ],
    require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
    [
      require.resolve('@babel/plugin-proposal-decorators'),
      { legacy: true }
    ],
    require.resolve('babel-plugin-parameter-decorator'),
    require.resolve('@babel/plugin-proposal-class-properties'),
    require.resolve('@babel/plugin-proposal-object-rest-spread'),
    [require.resolve('babel-plugin-import'),
      { libraryName: 'antd', style: true }
    ],
    require.resolve('@rockpack/babel-plugin-ussr-marker')
  ];

  if (typescript) {
    opts.plugins.push(
      require.resolve('babel-plugin-transform-typescript-metadata')
    );
  }

  if (framework === 'react') {
    opts.presets.push(
      [require.resolve('@babel/preset-react'), { useBuiltIns: true }]
    );

    if (isProduction) {
      opts.env.production = Object.assign({}, opts.env.production, {
        plugins: [
          require.resolve('@babel/plugin-transform-react-constant-elements'),
          require.resolve('@babel/plugin-transform-react-inline-elements'),
          require.resolve('babel-plugin-transform-react-pure-class-to-function'),
          require.resolve('babel-plugin-transform-react-remove-prop-types')
        ]
      });
    }
  }

  if (isomorphic) {
    opts.plugins.push(
      require.resolve('@loadable/babel-plugin')
    );
  }

  if (isTest) {
    opts.plugins.push(
      require.resolve('@babel/plugin-transform-modules-commonjs')
    );
  }

  return opts;
};

module.exports = createBabelPresets;
