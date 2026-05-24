import WebpackDevServer from 'webpack-dev-server';

import type { CompilerConf } from '../types.js';

interface CompilerResult {
  compiler: unknown;
  conf: CompilerConf;
  webpackConfig: Record<string, unknown>;
}

export const devServer = ({ compiler, conf, webpackConfig }: CompilerResult): void => {
  const devServerConfig = webpackConfig['devServer'] as ConstructorParameters<typeof WebpackDevServer>[0];
  const server = new WebpackDevServer(devServerConfig, compiler as ConstructorParameters<typeof WebpackDevServer>[1]);
  server.startCallback(() => {
    const host = String((devServerConfig as Record<string, unknown>)['host']);
    const port = String((devServerConfig as Record<string, unknown>)['port']);
    conf.messages.push(`=> Starting server on http://${host}:${port}`);
    conf.messages.push('\n');
  });
};
