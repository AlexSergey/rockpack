import type * as MakeDevServerModule from './make-dev-server.js';

import { fpPromise } from '../utils/find-free-port.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('yargs', () => jest.fn(() => ({ parseSync: (): Record<string, unknown> => mockArgv })));
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));
jest.mock('../utils/find-free-port.js', () => ({ fpPromise: jest.fn() }));

const fpPromiseMock = fpPromise as jest.MockedFunction<typeof fpPromise>;

const loadMakeDevServer = (): typeof MakeDevServerModule.makeDevServer => {
  let loaded: typeof MakeDevServerModule.makeDevServer | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<typeof MakeDevServerModule>('./make-dev-server.js').makeDevServer;
  });
  if (!loaded) {
    throw new Error('./make-dev-server was not loaded');
  }

  return loaded;
};

describe('makeDevServer', () => {
  afterEach(() => {
    delete mockArgv['_rockpack_testing'];
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('does not open the browser under the rockpack test flag', async () => {
      mockArgv['_rockpack_testing'] = true;

      expect((await loadMakeDevServer()({ port: 4000 })).open).toBe(false);
    });

    it('does not look for a free port when the port is set', async () => {
      await loadMakeDevServer()({ port: 4000 });

      expect(fpPromiseMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('serves with hot reload, history fallback and open CORS headers', async () => {
      expect(await loadMakeDevServer()({ port: 4000 })).toEqual({
        devMiddleware: { writeToDisk: true },
        headers: {
          'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Authorization, Accept',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Origin': '*',
        },
        historyApiFallback: true,
        host: 'localhost',
        hot: true,
        open: true,
        port: 4000,
      });
    });

    it('finds a free port from 3000 without a port', async () => {
      fpPromiseMock.mockResolvedValue(3002);

      expect((await loadMakeDevServer()({})).port).toBe(3002);
      expect(fpPromiseMock).toHaveBeenCalledWith(3000);
    });
  });
});
