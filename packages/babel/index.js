const { existsSync } = require('fs');
const path = require('path');
const { isString, isObject } = require('valid-types');
const deepmerge = require('deepmerge');

function getMajorVersion(version) {
  return typeof version === 'string' && version.includes('.') ?
    version.split('.')[0] :
    false;
}

const createBabelPresets = ({
  isNodejs = false,
  framework = false,
  isomorphic = false,
  modules = false,
  isTest = false,
  typescript = false
}) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const babelMerge = path.resolve(root, 'rockpack.babel.js');
  // eslint-disable-next-line global-require
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  let corejs = false;
  let reactNewSyntax = false;

  if (packageJson &&
    isObject(packageJson.dependencies) &&
    isString(packageJson.dependencies['core-js'])
  ) {
    corejs = packageJson.dependencies['core-js'];
  }

  if (packageJson &&
    isObject(packageJson.dependencies) &&
    isString(packageJson.dependencies.react)
  ) {
    reactNewSyntax = getMajorVersion(packageJson.dependencies.react) >= 17;
  }

  let opts = typescript ? {
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
    ]
  ];

  if (typescript) {
    opts.plugins.push(
      require.resolve('babel-plugin-transform-typescript-metadata')
    );
  }

  if (framework === 'react') {
    opts.presets.push(
      [require.resolve('@babel/preset-react'), reactNewSyntax ? {
        runtime: 'automatic',
        useBuiltIns: true
      } : {
        useBuiltIns: true
      }]
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

  if (existsSync(babelMerge)) {
    try {
      // eslint-disable-next-line global-require
      const babelMergeModule = require(babelMerge);

      if (typeof babelMergeModule === 'object' && Object.keys(babelMergeModule).length > 0) {
        opts = deepmerge(opts, babelMergeModule);
      } else if (typeof babelMergeModule === 'function') {
        const result = babelMergeModule({
          isNodejs,
          framework,
          isomorphic,
          modules,
          isProduction,
          isTest,
          typescript
        }, opts, deepmerge);

        if (typeof result === 'object' && Object.keys(result).length > 0) {
          opts = result;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Rockpack/Babel: can\'t merge rockpack.babel.js');
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  return opts;
};

module.exports = createBabelPresets;
