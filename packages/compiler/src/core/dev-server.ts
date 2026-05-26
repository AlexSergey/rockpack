import type { Configuration } from 'webpack';

import WebpackDevServer from 'webpack-dev-server';

import type { InternalCompilerConf } from '../types.js';

interface CompilerResult {
  compiler: unknown;
  conf: InternalCompilerConf;
  webpackConfig: Configuration;
}

export const devServer = ({ compiler, conf, webpackConfig }: CompilerResult): void => {
  const devServerConfig = (webpackConfig as { devServer?: ConstructorParameters<typeof WebpackDevServer>[0] })
    .devServer as ConstructorParameters<typeof WebpackDevServer>[0];
  const server = new WebpackDevServer(devServerConfig, compiler as ConstructorParameters<typeof WebpackDevServer>[1]);
  server.startCallback(() => {
    const cfg = devServerConfig as Record<string, unknown>;
    conf.messages?.push(`=> Starting server on http://${String(cfg['host'])}:${String(cfg['port'])}`);
    conf.messages?.push('\n');
  });
};
