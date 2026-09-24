import type { CompilerConf } from '../types.js';

import { getArgv } from '../core/argv.js';
import { fpPromise } from '../utils/find-free-port.js';

type DevServerConfig = {
  devMiddleware: { writeToDisk: boolean };
  headers: Record<string, string>;
  historyApiFallback: boolean;
  host: string;
  hot: boolean;
  open: boolean;
  port: number;
};

export const makeDevServer = async (conf: Partial<CompilerConf>): Promise<DevServerConfig> => ({
  devMiddleware: { writeToDisk: true },
  headers: {
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Origin': '*',
  },
  historyApiFallback: true,
  host: 'localhost',
  hot: true,
  open: !getArgv()['_rockpack_testing'],
  port: conf.port ?? (await fpPromise(3000)),
});
