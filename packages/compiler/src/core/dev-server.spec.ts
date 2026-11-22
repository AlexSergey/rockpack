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

type DevServerInstance = { options: DevServerOptions; start: jest.Mock; stop: jest.Mock };
type DevServerOptions = { host?: string; port?: number | string; server?: unknown };

// Simulates webpack-dev-server writing the resolved host/port into its options while starting.
const resolvesTo = (resolved: { host?: string; port?: number }): void => {
  WebpackDevServerMock.mockImplementationOnce((options: DevServerOptions): DevServerInstance => {
    const instance: DevServerInstance = {
      options: { ...options },
      start: jest.fn(() => {
        Object.assign(instance.options, resolved);

        return Promise.resolve();
      }),
      stop: stopServer,
    };

    return instance;
  });
};

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
    WebpackDevServerMock.mockImplementation((options: DevServerOptions) => ({
      options: { ...options },
      start,
      stop: stopServer,
    }));
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

    it.each([undefined, 'http', { type: 'http' }])('prints an http:// url for the server %p', async (server) => {
      const reporter = fakeReporter();

      await expect(
        devServer(running({ devServer: { host: 'localhost', port: 3000, server } }, reporter)),
      ).resolves.toMatchObject({ url: 'http://localhost:3000' });
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on http://localhost:3000');
    });

    it('does not print auto for port auto', async () => {
      const reporter = fakeReporter();
      resolvesTo({ port: 3001 });

      await expect(
        devServer(running({ devServer: { host: 'localhost', port: 'auto' } }, reporter)),
      ).resolves.toMatchObject({ url: 'http://localhost:3001' });
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on http://localhost:3001');
    });

    it.each([
      ['local-ip', '192.168.1.10', 'http://192.168.1.10:3000'],
      ['local-ipv4', '192.168.1.10', 'http://192.168.1.10:3000'],
      ['local-ipv6', 'fe80::1', 'http://[fe80::1]:3000'],
    ])('does not print the %s placeholder', async (placeholder, resolvedHost, expectedUrl) => {
      const reporter = fakeReporter();
      resolvesTo({ host: resolvedHost });

      await expect(
        devServer(running({ devServer: { host: placeholder, port: 3000 } }, reporter)),
      ).resolves.toMatchObject({ url: expectedUrl });
      expect(reporter.info).toHaveBeenCalledWith('frontend', `Starting server on ${expectedUrl}`);
    });

    it.each([undefined, ''])('does not print an empty host for the host %p', async (host) => {
      const reporter = fakeReporter();

      await expect(devServer(running({ devServer: { host, port: 3000 } }, reporter))).resolves.toMatchObject({
        url: 'http://localhost:3000',
      });
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on http://localhost:3000');
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

    it.each(['https', 'http2', { type: 'https' }, { type: 'http2' }])(
      'prints an https:// url for the server %p',
      async (server) => {
        const reporter = fakeReporter();

        await expect(
          devServer(running({ devServer: { host: 'localhost', port: 3000, server } }, reporter)),
        ).resolves.toMatchObject({ url: 'https://localhost:3000' });
        expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on https://localhost:3000');
      },
    );

    it('keeps an IPv4 host without brackets', async () => {
      const reporter = fakeReporter();

      await expect(devServer(running({ devServer: { host: '0.0.0.0', port: 3000 } }, reporter))).resolves.toMatchObject(
        {
          url: 'http://0.0.0.0:3000',
        },
      );
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on http://0.0.0.0:3000');
    });

    it.each(['::', '::1'])('wraps the IPv6 host %p in brackets', async (host) => {
      const reporter = fakeReporter();

      await expect(devServer(running({ devServer: { host, port: 3000 } }, reporter))).resolves.toMatchObject({
        url: `http://[${host}]:3000`,
      });
      expect(reporter.info).toHaveBeenCalledWith('frontend', `Starting server on http://[${host}]:3000`);
    });

    it('keeps https:// for an IPv6 host', async () => {
      const reporter = fakeReporter();

      await expect(
        devServer(running({ devServer: { host: '::1', port: 3000, server: 'https' } }, reporter)),
      ).resolves.toMatchObject({ url: 'https://[::1]:3000' });
      expect(reporter.info).toHaveBeenCalledWith('frontend', 'Starting server on https://[::1]:3000');
    });

    it('stops the server and closes the compiler', async () => {
      const compiler = createCompiler();

      await (await devServer(running({ devServer: { host: 'localhost', port: 3000 } }, undefined, compiler))).stop();

      expect(stopServer).toHaveBeenCalled();
      expect(compiler.close).toHaveBeenCalled();
    });
  });
});
