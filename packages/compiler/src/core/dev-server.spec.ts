import type { Compiler } from 'webpack';
import type { Configuration } from 'webpack';

import WebpackDevServer from 'webpack-dev-server';

import type { Reporter } from '../reporter/reporter.js';
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

const running = (webpackConfig: Configuration, reporter?: Reporter, compiler = createCompiler()): RunningResult => ({
  compiler,
  conf: { compilerName: 'frontendCompiler', dist: 'dist/index.js', src: 'src/index.ts' },
  kind: 'watch',
  ...(reporter ? { reporter } : {}),
  stop: () => Promise.resolve(),
  webpackConfig,
});

const fakeReporter = (): Reporter => ({
  done: jest.fn(),
  info: jest.fn(),
  interactive: false,
  issues: jest.fn(),
  progress: jest.fn(),
  start: jest.fn(),
});

describe('devServer', () => {
  beforeEach(() => {
    WebpackDevServerMock.mockImplementation(() => ({ start, stop: stopServer }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('starts without a reporter', async () => {
      await expect(devServer(running({ devServer: { port: 3000 } }))).resolves.toMatchObject({ kind: 'dev-server' });
      expect(start).toHaveBeenCalled();
    });

    it('starts with an empty config when webpack has no devServer section', async () => {
      await devServer(running({}));

      expect(WebpackDevServerMock).toHaveBeenCalledWith({}, expect.anything());
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
      const reporter = fakeReporter();

      await expect(devServer(running({ devServer: devServerConfig }, reporter, compiler))).resolves.toMatchObject({
        kind: 'dev-server',
        url: 'http://localhost:3000',
      });
      expect(WebpackDevServerMock).toHaveBeenCalledWith(devServerConfig, compiler);
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on http://localhost:3000');
    });

    it('stops the server and closes the compiler', async () => {
      const compiler = createCompiler();

      await (await devServer(running({ devServer: { host: 'localhost', port: 3000 } }, undefined, compiler))).stop();

      expect(stopServer).toHaveBeenCalled();
      expect(compiler.close).toHaveBeenCalled();
    });
  });
});
