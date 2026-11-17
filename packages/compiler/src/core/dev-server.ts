import { isIPv6 } from 'node:net';
import WebpackDevServer from 'webpack-dev-server';

import type { DevServerResult, RunningResult } from './compile-result.js';

import { compilerLabel } from '../reporter/compiler-name.js';
import { closeCompiler } from './compile-result.js';

type DevServerConfig = NonNullable<ConstructorParameters<typeof WebpackDevServer>[0]>;

// Starts webpack-dev-server on a watching build and resolves once it listens; stop() shuts the server and the
// compiler down.
export const devServer = async ({
  compiler,
  conf,
  reporter,
  webpackConfig,
}: RunningResult): Promise<DevServerResult> => {
  const devServerConfig = (webpackConfig as { devServer?: DevServerConfig }).devServer ?? {};
  const serverType = typeof devServerConfig.server === 'object' ? devServerConfig.server.type : devServerConfig.server;
  const protocol = serverType === 'https' || serverType === 'http2' ? 'https' : 'http';
  const server = new WebpackDevServer(devServerConfig, compiler);
  await server.start();
  const host = String(server.options.host);
  const url = `${protocol}://${isIPv6(host) ? `[${host}]` : host}:${String(server.options.port)}`;
  reporter?.info(compilerLabel(conf), `Starting server on ${url}`);

  return {
    kind: 'dev-server',
    stop: async (): Promise<void> => {
      await server.stop();
      await closeCompiler(compiler);
    },
    url,
  };
};
