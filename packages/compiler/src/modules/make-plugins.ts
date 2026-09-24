import type webpack from 'webpack';
import type { WebpackPluginInstance } from 'webpack';

import type { CompileContext } from '../core/compile-context.js';
import type { InternalCompilerConf, Mode, PackageJson } from '../types.js';
import type { PluginContext } from './plugins/types.js';

import { Collection } from '../utils/collection.js';
import { makeAnalyzerPlugins } from './plugins/analyzer.js';
import { makeBannerPlugins } from './plugins/banner.js';
import { makeLintPlugins, makeReportPlugins } from './plugins/checks.js';
import { makeCopyPlugins } from './plugins/copy.js';
import { makeDevelopmentPlugins } from './plugins/development.js';
import { makeDefinePlugins, makeDotenvPlugins } from './plugins/env.js';
import { makeHtmlPlugins } from './plugins/html.js';
import { makeProductionPlugins } from './plugins/production.js';

export const makePlugins = async (
  conf: InternalCompilerConf,
  root: string,
  packageJson: PackageJson,
  mode: Mode,
  wp: typeof webpack,
  context: string,
  compileContext: CompileContext,
): Promise<Collection<WebpackPluginInstance>> => {
  const ctx: PluginContext = { compileContext, conf, context, mode, packageJson, root, wp };

  // The order is part of the public shape: plugins are applied and exposed in this order.
  const plugins = {
    ...makeReportPlugins(ctx),
    ...makeDotenvPlugins(ctx),
    ...makeBannerPlugins(ctx),
    ...makeHtmlPlugins(ctx),
    ...makeLintPlugins(ctx),
    ...makeDefinePlugins(ctx),
    ...makeCopyPlugins(ctx),
    ...(await makeDevelopmentPlugins(ctx)),
    ...makeProductionPlugins(ctx),
    ...(await makeAnalyzerPlugins(ctx)),
  };

  return new Collection(plugins);
};
