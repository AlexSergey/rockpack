import { isString } from '@rockpack/utils';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import { createRequire } from 'node:module';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

import type { PluginContext, PluginEntries } from './types.js';

import { compilerLabel } from '../../reporter/compiler-name.js';
import { ReporterPlugin } from '../../reporter/reporter-plugin.js';
import { pathToEslintrc } from '../../utils/path-to-eslintrc.js';
import { pathToStylelint } from '../../utils/path-to-stylelint.js';
import { pathToTsConf } from '../../utils/path-to-ts-conf.js';
import { makeResolve } from '../make-resolve.js';
import { TypeCheckPlugin } from './type-check-plugin.js';

const _require = createRequire(import.meta.url);

export const makeReportPlugins = ({ compileContext, conf, mode, root }: PluginContext): PluginEntries => {
  const { reporter } = compileContext;
  const name = compilerLabel(conf);
  const tsconfig = pathToTsConf(root, mode, false);

  return {
    ...(reporter ? { ReporterPlugin: new ReporterPlugin(reporter, name, root, mode) } : {}),
    ...(isString(tsconfig)
      ? {
          TypeCheckPlugin: new TypeCheckPlugin({
            mode,
            name,
            ...(reporter ? { onIssues: (problems): void => reporter.issues(name, problems) } : {}),
            root,
            tsconfig,
          }),
        }
      : {}),
  };
};

// Linting during the build is opt-in (`lint: true`): projects usually lint in their own scripts and hooks.
export const makeLintPlugins = ({ conf, context, root }: PluginContext): PluginEntries => {
  const plugins: PluginEntries = {};
  if (!conf.lint) {
    return plugins;
  }

  const stylelint = pathToStylelint(root);
  const eslintRc = pathToEslintrc(root);

  if (stylelint) {
    // Only the sources: the project root also holds built and generated styles (dist, coverage reports).
    plugins['StylelintWebpackPlugin'] = new StylelintWebpackPlugin({ configFile: stylelint, context });
  }

  if (!conf.debug && isString(eslintRc)) {
    plugins['EslintWebpackPlugin'] = new EslintWebpackPlugin({
      context,
      eslintPath: _require.resolve('eslint'),
      extensions: makeResolve(root).extensions,
      failOnError: true,
    });
  }

  return plugins;
};
