import WebpackDevServer from 'webpack-dev-server';

import type { InternalCompilerConf } from '../types.js';

import { devServer } from './dev-server.js';

jest.mock('webpack-dev-server', () => jest.fn());

type StartCallback = () => void;

const WebpackDevServerMock = WebpackDevServer as unknown as jest.Mock;
const startCallback = jest.fn((callback: StartCallback) => callback());

const createConf = (messages?: string[]): InternalCompilerConf =>
  ({ dist: 'dist/index.js', messages, src: 'src/index.ts' }) as InternalCompilerConf;

describe('devServer', () => {
  beforeEach(() => {
    WebpackDevServerMock.mockImplementation(() => ({ startCallback }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('starts without messages to report to', () => {
      expect(() =>
        devServer({ compiler: {}, conf: createConf(), webpackConfig: { devServer: { port: 3000 } } }),
      ).not.toThrow();
      expect(startCallback).toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('starts the dev server with the webpack devServer config and compiler', () => {
      const compiler = { name: 'compiler' };
      const devServerConfig = { host: 'localhost', port: 3000 };
      const conf = createConf([]);

      devServer({ compiler, conf, webpackConfig: { devServer: devServerConfig } });

      expect(WebpackDevServerMock).toHaveBeenCalledWith(devServerConfig, compiler);
      expect(conf.messages).toEqual(['=> Starting server on http://localhost:3000', '\n']);
    });
  });
});
