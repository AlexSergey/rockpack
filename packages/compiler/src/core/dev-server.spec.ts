import type { Compiler } from 'webpack';
import type { Configuration } from 'webpack';

import WebpackDevServer from 'webpack-dev-server';

import type { InternalCompilerConf } from '../types.js';
import type { RunningResult } from './compile-result.js';

import { devServer } from './dev-server.js';

jest.mock('webpack-dev-server', () => jest.fn());

const WebpackDevServerMock = WebpackDevServer as unknown as jest.Mock;
const start = jest.fn(() => Promise.resolve());
const stopServer = jest.fn(() => Promise.resolve());

const createCompiler = (): Compiler =>
  ({
    close: jest.fn((callback: () => void) => {
      callback();
    }),
  }) as unknown as Compiler;

const running = (webpackConfig: Configuration, messages?: string[], compiler = createCompiler()): RunningResult => ({
  compiler,
  conf: { dist: 'dist/index.js', messages, src: 'src/index.ts' } as InternalCompilerConf,
  kind: 'watch',
  stop: () => Promise.resolve(),
  webpackConfig,
});

describe('devServer', () => {
  beforeEach(() => {
    WebpackDevServerMock.mockImplementation(() => ({ start, stop: stopServer }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('starts without messages to report to', async () => {
      await expect(devServer(running({ devServer: { port: 3000 } }))).resolves.toMatchObject({ kind: 'dev-server' });
      expect(start).toHaveBeenCalled();
    });

    it('does not resolve before the server listens', async () => {
      let listening = false;
      start.mockImplementationOnce(async () => {
        await Promise.resolve();
        listening = true;
      });

      await devServer(running({ devServer: { port: 3000 } }));

      expect(listening).toBe(true);
    });
  });

  describe('positive cases', () => {
    it('starts the dev server with the webpack devServer config and compiler', async () => {
      const compiler = createCompiler();
      const devServerConfig = { host: 'localhost', port: 3000 };
      const result = running({ devServer: devServerConfig }, [], compiler);

      await expect(devServer(result)).resolves.toMatchObject({ kind: 'dev-server', url: 'http://localhost:3000' });
      expect(WebpackDevServerMock).toHaveBeenCalledWith(devServerConfig, compiler);
      expect(result.conf.messages).toEqual(['=> Starting server on http://localhost:3000', '\n']);
    });

    it('stops the server and closes the compiler', async () => {
      const compiler = createCompiler();

      await (await devServer(running({ devServer: { host: 'localhost', port: 3000 } }, [], compiler))).stop();

      expect(stopServer).toHaveBeenCalled();
      expect(compiler.close).toHaveBeenCalled();
    });
  });
});
