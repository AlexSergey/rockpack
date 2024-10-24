const { checkReact } = require('@rockpack/utils');
const deepmerge = require('deepmerge');
const { existsSync } = require('node:fs');
const path = require('node:path');
const { isObject, isString } = require('valid-types');

const createBabelPresets = ({
  framework = 'none',
  isNodejs = false,
  isomorphic = false,
  isTest = false,
  modules = false,
  presetsAdditionalOptions = {},
  typescript = false,
}) => {
  const root = process.cwd();
  const packageJsonPath = path.resolve(root, 'package.json');
  const babelMerge = path.resolve(root, 'rockpack.babel.js');
  // eslint-disable-next-line global-require
  const packageJson = existsSync(packageJsonPath) ? require(packageJsonPath) : {};
  let corejs = false;

  const getPresetAdditionalOptions = (presetName) => {
    if (presetsAdditionalOptions[presetName]) return presetsAdditionalOptions[presetName];

    return {};
  };

  const getPreset = (presetName, options = {}) => [
    require.resolve(presetName),
    {
      ...options,
      ...getPresetAdditionalOptions(presetName),
    },
  ];

  if (packageJson && isObject(packageJson.dependencies) && isString(packageJson.dependencies['core-js'])) {
    corejs = packageJson.dependencies['core-js'];
  }

  const { reactNewSyntax } = checkReact(packageJson);

  let opts = typescript
    ? {
        babelrc: false,
        env: {
          production: {},
        },
        plugins: [],
        presets: [getPreset('@babel/preset-typescript')],
      }
    : {
        babelrc: false,
        env: {
          production: {},
        },
        plugins: [],
        presets: [
          getPreset('@babel/preset-env', {
            modules,
            ...(isNodejs
              ? {
                  targets: {
                    node: 'current',
                  },
                }
              : {
                  targets: {
                    browsers: ['> 5%'],
                  },
                }),
            ...(isString(corejs)
              ? {
                  corejs,
                  useBuiltIns: 'usage',
                }
              : {}),
          }),
        ],
      };

  opts.plugins = [
    getPreset('@babel/plugin-proposal-pipeline-operator', {
      proposal: 'minimal',
    }),
    getPreset('@babel/plugin-proposal-do-expressions'),
    getPreset('@babel/plugin-proposal-decorators', { legacy: true }),
    getPreset('babel-plugin-parameter-decorator'),
  ];

  if (typescript) {
    opts.plugins.push(require.resolve('babel-plugin-transform-typescript-metadata'));
  }

  if (framework === 'react') {
    opts.presets.push(
      getPreset(
        '@babel/preset-react',
        reactNewSyntax
          ? {
              runtime: 'automatic',
              useBuiltIns: true,
            }
          : {
              useBuiltIns: true,
            },
      ),
    );

    opts.env.production = {
      ...opts.env.production,
      plugins: [require.resolve('@babel/plugin-transform-react-constant-elements')],
    };
  }

  if (isomorphic) {
    opts.plugins.push(require.resolve('@loadable/babel-plugin'));
  }

  if (isTest) {
    opts.plugins.push(require.resolve('@babel/plugin-transform-modules-commonjs'));
  }

  if (existsSync(babelMerge)) {
    try {
      // eslint-disable-next-line global-require
      const babelMergeModule = require(babelMerge);

      if (typeof babelMergeModule === 'object' && Object.keys(babelMergeModule).length > 0) {
        opts = deepmerge(opts, babelMergeModule);
      } else if (typeof babelMergeModule === 'function') {
        const result = babelMergeModule(
          {
            framework,
            isNodejs,
            isomorphic,
            isTest,
            modules,
            typescript,
          },
          opts,
          deepmerge,
        );

        if (typeof result === 'object' && Object.keys(result).length > 0) {
          opts = result;
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Rockpack/Babel: can't merge rockpack.babel.js");
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  return opts;
};

module.exports = createBabelPresets;
