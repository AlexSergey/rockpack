import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import { isString } from '@rockpack/utils';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { createRequire } from 'node:module';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

import type { PluginContext, PluginEntries } from './types.js';

import { pathToEslintrc } from '../../utils/path-to-eslintrc.js';
import { pathToStylelint } from '../../utils/path-to-stylelint.js';
import { pathToTsConf } from '../../utils/path-to-ts-conf.js';
import { makeResolve } from '../make-resolve.js';

const _require = createRequire(import.meta.url);

export const makeReportPlugins = ({ conf, mode, root }: PluginContext): PluginEntries => ({
  FriendlyErrorsPlugin: new FriendlyErrorsWebpackPlugin({
    clearConsole: false,
    compilationSuccessInfo: { messages: conf.messages ?? [] },
  }),
  ...(isString(pathToTsConf(root, mode, false)) ? { ForkTsCheckerPlugin: new ForkTsCheckerWebpackPlugin() } : {}),
});

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
