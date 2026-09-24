import { fpPromise } from '../utils/find-free-port.js';
import { makeDevServer } from './make-dev-server.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('../core/argv.js', () => ({ getArgv: (): Record<string, unknown> => mockArgv }));
jest.mock('../utils/find-free-port.js', () => ({ fpPromise: jest.fn() }));

const fpPromiseMock = fpPromise as jest.MockedFunction<typeof fpPromise>;

describe('makeDevServer', () => {
  afterEach(() => {
    delete mockArgv['_rockpack_testing'];
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('does not open the browser under the rockpack test flag', async () => {
      mockArgv['_rockpack_testing'] = true;

      expect((await makeDevServer({ port: 4000 })).open).toBe(false);
    });

    it('does not look for a free port when the port is set', async () => {
      await makeDevServer({ port: 4000 });

      expect(fpPromiseMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('serves with hot reload, history fallback and open CORS headers', async () => {
      expect(await makeDevServer({ port: 4000 })).toEqual({
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

      expect((await makeDevServer({})).port).toBe(3002);
      expect(fpPromiseMock).toHaveBeenCalledWith(3000);
    });
  });
});
