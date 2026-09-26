import type { NodemonSettings } from 'nodemon';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'node:path';
import NodemonPlugin from 'nodemon-webpack-plugin';

import type { Reporter } from '../../reporter/reporter.js';
import type { InternalCompilerConf } from '../../types.js';
import type { PluginContext, PluginEntries } from './types.js';

import { SsrDevelopment } from '../../plugins/ssr-development/index.js';
import { compilerLabel } from '../../reporter/compiler-name.js';
import { fpPromise } from '../../utils/find-free-port.js';
import { getRandomInt } from '../../utils/other.js';
import { stylesFilename } from './styles-filename.js';

type NodemonOptions = NodemonSettings & {
  ext: string;
  ignore: string[];
  nodeArgs: string[];
  quiet: boolean;
  script: string;
  verbose: boolean;
  watch: string[];
};

const getNodemonOptions = async (
  distPath: string,
  conf: InternalCompilerConf,
  isomorphic: boolean,
  reporter: Reporter | undefined,
): Promise<NodemonOptions> => {
  const distFolder = path.dirname(distPath);
  const defaultInspectPort = isomorphic ? getRandomInt(9000, 9999) : 9224;
  const freeInspectPort = await fpPromise(defaultInspectPort);

  reporter?.info(compilerLabel(conf), 'nodemon is running');

  if (!conf.__isIsomorphicBackend) {
    reporter?.info(compilerLabel(conf), `node-inspect is available on ${String(freeInspectPort)} port`);
  }

  return {
    ext: 'js',
    ignore: ['*.map', '*.hot-update.json', '*.hot-update.js', 'stats.json'],
    nodeArgs: [`--inspect=${freeInspectPort}`, '--require="source-map-support/register"'],
    quiet: true,
    script: path.join(distFolder, path.basename(distPath)),
    verbose: false,
    watch: [distFolder],
  };
};

const makeServerPlugins = async ({ compileContext, conf, root }: PluginContext): Promise<PluginEntries> => {
  const distPath = path.isAbsolute(conf.dist) ? conf.dist : path.resolve(root, conf.dist);

  const { isomorphic, liveReload } = compileContext;

  if (!conf.__library && conf.nodejs && !isomorphic) {
    return {
      NodemonPlugin: new NodemonPlugin(await getNodemonOptions(distPath, conf, false, compileContext.reporter)),
    };
  }
  if (isomorphic && conf.__isIsomorphicBackend) {
    return {
      SSRDevelopment: new SsrDevelopment(
        await getNodemonOptions(distPath, conf, true, compileContext.reporter),
        liveReload?.server,
      ),
    };
  }

  return {};
};

export const makeDevelopmentPlugins = async (ctx: PluginContext): Promise<PluginEntries> => {
  if (ctx.mode !== 'development') {
    return {};
  }

  return {
    ...(await makeServerPlugins(ctx)),
    WatchIgnorePlugin: new ctx.wp.WatchIgnorePlugin({ paths: [/css\.d\.ts$/] }),
    ...(ctx.conf.__isIsomorphicStyles
      ? { MiniCssExtractPlugin: new MiniCssExtractPlugin({ filename: stylesFilename(ctx.conf) }) }
      : {}),
  };
};
