const { existsSync } = require('fs');
const path = require('path');
const { checkReact } = require('@rockpack/utils');
const { isString, isObject } = require('valid-types');
const deepmerge = require('deepmerge');

const createBabelPresets = ({
  isNodejs = false,
  framework = 'none',
  isomorphic = false,
  modules = false,
  isTest = false,
  typescript = false,
  presetsAdditionalOptions = {}
}) => {
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const babelMerge = path.resolve(root, 'rockpack.babel.js');
  // eslint-disable-next-line global-require
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  let corejs = false;

  const getPresetAdditionalOptions = presetName => {
    if (presetsAdditionalOptions[presetName]) return presetsAdditionalOptions[presetName];
    return {};
  };

  const getPreset = (presetName, options = {}) => (
    [
      require.resolve(presetName),
      {
        ...options,
        ...getPresetAdditionalOptions(presetName)
      }
    ]
  );

  if (packageJson &&
    isObject(packageJson.dependencies) &&
    isString(packageJson.dependencies['core-js'])
  ) {
    corejs = packageJson.dependencies['core-js'];
  }

  const { reactNewSyntax } = checkReact(packageJson);

  let opts = typescript ? {
    babelrc: false,
    presets: [
      getPreset('@babel/preset-typescript')
    ],
    plugins: [],
    env: {
      production: {}
    }
  } : {
    babelrc: false,
    presets: [
      getPreset('@babel/preset-env', Object.assign({
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
      } : {}))
    ],
    plugins: [],
    env: {
      production: {}
    }
  };

  opts.plugins = [
    getPreset('@babel/plugin-proposal-pipeline-operator', {
      proposal: 'minimal'
    }),
    getPreset('@babel/plugin-proposal-numeric-separator'),
    getPreset('@babel/plugin-proposal-do-expressions'),
    getPreset('@babel/plugin-proposal-logical-assignment-operators'),
    getPreset('@babel/plugin-proposal-optional-chaining', { loose: false }),
    getPreset('@babel/plugin-proposal-nullish-coalescing-operator'),
    getPreset('@babel/plugin-proposal-decorators', { legacy: true }),
    getPreset('babel-plugin-parameter-decorator'),
    getPreset('@babel/plugin-proposal-class-properties'),
    getPreset('@babel/plugin-proposal-object-rest-spread'),
    getPreset('babel-plugin-import', {
      libraryName: 'antd',
      style: true
    })
  ];

  if (typescript) {
    opts.plugins.push(
      require.resolve('babel-plugin-transform-typescript-metadata')
    );
  }

  if (framework === 'react') {
    opts.presets.push(
      getPreset('@babel/preset-react', reactNewSyntax ? {
        runtime: 'automatic',
        useBuiltIns: true
      } : {
        useBuiltIns: true
      })
    );

    opts.env.production = Object.assign({}, opts.env.production, {
      plugins: [
        require.resolve('@babel/plugin-transform-react-constant-elements'),
        require.resolve('@babel/plugin-transform-react-inline-elements'),
        require.resolve('babel-plugin-transform-react-pure-class-to-function'),
        require.resolve('babel-plugin-transform-react-remove-prop-types')
      ]
    });
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
