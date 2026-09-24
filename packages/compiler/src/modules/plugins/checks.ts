import FriendlyErrorsWebpackPlugin from '@nuxt/friendly-errors-webpack-plugin';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { createRequire } from 'node:module';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import { isString } from 'valid-types';

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

export const makeLintPlugins = ({ conf, context, root }: PluginContext): PluginEntries => {
  const plugins: PluginEntries = {};
  const stylelint = pathToStylelint(root);
  const eslintRc = pathToEslintrc(root);

  if (stylelint) {
    plugins['StylelintWebpackPlugin'] = new StylelintWebpackPlugin({ configFile: stylelint });
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
