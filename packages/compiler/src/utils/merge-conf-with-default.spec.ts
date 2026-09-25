import { fpPromise } from './find-free-port.js';
import { mergeConfWithDefault } from './merge-conf-with-default.js';

jest.mock('./find-free-port.js', () => ({ fpPromise: jest.fn() }));

const fpPromiseMock = fpPromise as jest.MockedFunction<typeof fpPromise>;

describe('mergeConfWithDefault', () => {
  let logSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    fpPromiseMock.mockResolvedValue(3005);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('falls back to the default dist for an empty dist', async () => {
      const conf = await mergeConfWithDefault({ dist: '' }, 'production');

      expect(conf).toMatchObject({ dist: 'dist/index.js', distContext: 'dist' });
    });

    it('does not look for a free port in production', async () => {
      const conf = await mergeConfWithDefault({ port: 4000 }, 'production');

      expect(conf.port).toBe(4000);
      expect(fpPromiseMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('fills the defaults', async () => {
      expect(await mergeConfWithDefault({}, 'production')).toEqual({
        debug: false,
        dist: 'dist/index.js',
        distContext: 'dist',
        html: true,
        port: 3000,
        src: 'src/index',
      });
    });

    it('keeps a .js dist and uses its folder as the context', async () => {
      expect(await mergeConfWithDefault({ dist: 'build/app.js' }, 'production')).toMatchObject({
        dist: 'build/app.js',
        distContext: 'build',
      });
    });

    it('turns a dist folder into an index.js file inside it', async () => {
      expect(await mergeConfWithDefault({ dist: 'build' }, 'production')).toMatchObject({
        dist: 'build/index.js',
        distContext: 'build',
      });
      // The reporter prints where the bundle goes; merging prints nothing.
      expect(logSpy).not.toHaveBeenCalled();
    });

    it('resolves a free port from the configured one in development', async () => {
      const conf = await mergeConfWithDefault({ port: 4000 }, 'development');

      expect(conf.port).toBe(3005);
      expect(fpPromiseMock).toHaveBeenCalledWith(4000);
    });
  });
});
