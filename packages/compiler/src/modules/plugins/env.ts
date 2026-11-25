import Dotenv from 'dotenv-webpack';
import { existsSync } from 'node:fs';
import path from 'node:path';

import type { PluginContext, PluginEntries } from './types.js';

import { RuntimeDotenvPlugin } from './runtime-dotenv-plugin.js';

// Either file is enough: a project may ship only `.env.defaults` and leave `.env` to each machine.
export const makeDotenvPlugins = ({ conf, root }: PluginContext): PluginEntries => {
  const hasEnv = existsSync(path.resolve(root, '.env'));
  const hasDefaults = existsSync(path.resolve(root, '.env.defaults'));

  if (!hasEnv && !hasDefaults) {
    return {};
  }

  const options = {
    allowEmptyValues: true,
    defaults: hasDefaults,
    path: path.resolve(root, '.env'),
    safe: existsSync(path.resolve(root, '.env.example')),
    // A missing .env is expected when only the defaults exist.
    silent: !hasEnv,
  };

  // A frontend has no process.env to read, and a library leaves the environment of its consumer alone.
  return {
    Dotenv: conf.__isBackend && conf.env?.runtime ? new RuntimeDotenvPlugin(options) : new Dotenv(options),
  };
};

export const makeDefinePlugins = ({ compileContext, conf, mode, root, wp }: PluginContext): PluginEntries => {
  const env: Record<string, string> = { ...conf.global };

  if (conf.__isBackend) {
    env['ROOT_DIRNAME'] = root;
  }
  if (compileContext.liveReload) {
    env['LIVE_RELOAD_PORT'] = String(compileContext.liveReload.port);
  }

  const definitions: Record<string, string> = {
    'process.env.NODE_ENV': JSON.stringify(mode),
    ...Object.fromEntries(Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)])),
  };

  return { DefinePlugin: new wp.DefinePlugin(definitions) };
};
