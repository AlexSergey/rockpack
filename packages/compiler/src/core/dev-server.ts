import WebpackDevServer from 'webpack-dev-server';

import type { DevServerResult, RunningResult } from './compile-result.js';

import { closeCompiler } from './compile-result.js';

type DevServerConfig = NonNullable<ConstructorParameters<typeof WebpackDevServer>[0]>;

// Starts webpack-dev-server on a watching build and resolves once it listens; stop() shuts the server and the
// compiler down.
export const devServer = async ({ compiler, conf, webpackConfig }: RunningResult): Promise<DevServerResult> => {
  const devServerConfig = (webpackConfig as { devServer?: DevServerConfig }).devServer ?? {};
  const url = `http://${String(devServerConfig.host)}:${String(devServerConfig.port)}`;
  const server = new WebpackDevServer(devServerConfig, compiler);
  await server.start();
  conf.messages?.push(`=> Starting server on ${url}`);
  conf.messages?.push('\n');

  return {
    kind: 'dev-server',
    stop: async (): Promise<void> => {
      await server.stop();
      await closeCompiler(compiler);
    },
    url,
  };
};
