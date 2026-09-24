import Dotenv from 'dotenv-webpack';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { PluginContext, PluginEntries } from './types.js';

export const makeDotenvPlugins = ({ root }: PluginContext): PluginEntries => {
  if (!existsSync(path.resolve(root, '.env'))) {
    return {};
  }

  return {
    Dotenv: new Dotenv({
      allowEmptyValues: true,
      defaults: existsSync(path.resolve(root, '.env.defaults')),
      path: path.resolve(root, '.env'),
      safe: existsSync(path.resolve(root, '.env.example')),
    }),
  };
};

export const makeDefinePlugins = ({ conf, mode, root, wp }: PluginContext): PluginEntries => {
  const env = conf.global ?? {};

  if (conf.__isBackend) {
    env['ROOT_DIRNAME'] = root;
  }
  if (typeof global.LIVE_RELOAD_PORT === 'number') {
    env['LIVE_RELOAD_PORT'] = String(global.LIVE_RELOAD_PORT);
  }

  const definitions: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...Object.fromEntries(Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])),
  };

  return { DefinePlugin: new wp.DefinePlugin(definitions) };
};
