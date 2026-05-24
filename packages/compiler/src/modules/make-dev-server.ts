import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import type { CompilerConf } from '../types.js';

import { fpPromise } from '../utils/find-free-port.js';

const argv = yargs(hideBin(process.argv)).parseSync();

interface DevServerConfig {
  devMiddleware: { writeToDisk: boolean };
  headers: Record<string, string>;
  historyApiFallback: boolean;
  host: string;
  hot: boolean;
  open: boolean;
  port: number;
}

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
  open: !(argv as Record<string, unknown>)['_rockpack_testing'],
  port: conf.port ?? (await fpPromise(3000)),
});
