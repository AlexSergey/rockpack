import { isString } from '@rockpack/utils';
import EslintWebpackPlugin from 'eslint-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { createRequire } from 'node:module';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';

import type { PluginContext, PluginEntries } from './types.js';

import { compilerLabel } from '../../reporter/compiler-name.js';
import { ReporterPlugin } from '../../reporter/reporter-plugin.js';
import { pathToEslintrc } from '../../utils/path-to-eslintrc.js';
import { pathToStylelint } from '../../utils/path-to-stylelint.js';
import { pathToTsConf } from '../../utils/path-to-ts-conf.js';
import { makeResolve } from '../make-resolve.js';

const _require = createRequire(import.meta.url);

// The type checker reports through the reporter (its issues hook), so its own logger stays quiet.
const silent = { error: (): void => undefined, log: (): void => undefined };

export const makeReportPlugins = ({ compileContext, conf, mode, root }: PluginContext): PluginEntries => ({
  ...(compileContext.reporter
    ? { ReporterPlugin: new ReporterPlugin(compileContext.reporter, compilerLabel(conf), root, mode) }
    : {}),
  ...(isString(pathToTsConf(root, mode, false))
    ? { ForkTsCheckerPlugin: new ForkTsCheckerWebpackPlugin({ logger: silent }) }
    : {}),
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
