import { getRootRequireDir, setMode } from '@rockpack/utils';

import { generateDts } from '../utils/generate-dts.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { watchSources } from '../utils/watch-sources.js';
import { sourceCompiler } from './source-compiler.js';

jest.mock('@rockpack/utils', () => ({
  ...jest.requireActual<Record<string, unknown>>('@rockpack/utils'),
  getRootRequireDir: jest.fn(),
  setMode: jest.fn(),
}));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));
jest.mock('../utils/generate-dts.js', () => ({ generateDts: jest.fn() }));
jest.mock('../utils/path-to-ts-conf.js', () => ({ pathToTsConf: jest.fn() }));
jest.mock('../utils/source-compile.js', () => ({ sourceCompile: jest.fn() }));
jest.mock('../utils/watch-sources.js', () => ({ watchSources: jest.fn() }));

const watchSourcesMock = watchSources as jest.MockedFunction<typeof watchSources>;

// The rebuild callback watchSources received.
const triggerChange = (): void => {
  const [call] = watchSourcesMock.mock.calls;
  call?.[1]();
};

const format = { dist: 'lib/esm', src: 'src' };

describe('sourceCompiler', () => {
  const originalExitCode = process.exitCode;

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    // The error boundary marks the exit code on purpose; keep the Jest process status clean.
    process.exitCode = originalExitCode;
  });

  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (setMode as jest.Mock).mockReturnValue('production');
    (getRootRequireDir as jest.Mock).mockReturnValue('/project');
    (pathToTsConf as jest.Mock).mockReturnValue(false);
    (sourceCompile as jest.Mock).mockResolvedValue(undefined);
    (generateDts as jest.Mock).mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('compiles nothing without esm, cjs or TypeScript', async () => {
      await sourceCompiler();

      expect(sourceCompile).not.toHaveBeenCalled();
      expect(generateDts).not.toHaveBeenCalled();
    });

    it('rejects a failed source compilation as BUILD_FAILED without generating declarations', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');
      (sourceCompile as jest.Mock).mockRejectedValue(new Error('babel failed'));

      await expect(sourceCompiler({ esm: format })).rejects.toMatchObject({
        code: 'BUILD_FAILED',
        message: 'babel failed',
      });
      expect(errorSpy).toHaveBeenCalledWith('[rockpack] BUILD_FAILED: babel failed');
      expect(generateDts).not.toHaveBeenCalled();
      expect(process.exitCode).toBe(1);
    });

    it('does not watch without the watch option', async () => {
      await expect(sourceCompiler({ esm: format })).resolves.toBeUndefined();
      expect(watchSources).not.toHaveBeenCalled();
    });

    it('reports a failed rebuild and keeps watching', async () => {
      const stopWatching = jest.fn();
      watchSourcesMock.mockReturnValue(stopWatching);
      jest.spyOn(console, 'log').mockImplementation(() => {});
      const result = await sourceCompiler({ esm: format, watch: true });
      (sourceCompile as jest.Mock).mockRejectedValueOnce(new Error('syntax error'));

      triggerChange();
      await result?.stop();

      expect(errorSpy).toHaveBeenCalledWith('[rockpack] BUILD_FAILED: syntax error');
      expect(stopWatching).toHaveBeenCalledTimes(1);
    });

    it('rejects a failed declaration build as DTS_FAILED', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');
      (generateDts as jest.Mock).mockRejectedValue(new Error('tsc failed'));

      await expect(sourceCompiler()).rejects.toMatchObject({ code: 'DTS_FAILED', message: 'tsc failed' });
      expect(errorSpy).toHaveBeenCalledWith('[rockpack] DTS_FAILED: tsc failed');
    });
  });

  describe('positive cases', () => {
    it.each([{ esm: format }, { cjs: format }])('compiles sources for %p', async (conf) => {
      await sourceCompiler(conf);

      expect(sourceCompile).toHaveBeenCalledWith(conf);
      expect(pathToTsConf).toHaveBeenCalledWith('/project', 'production', false);
    });

    it('watches the format and declaration sources and rebuilds after a change', async () => {
      const stopWatching = jest.fn();
      watchSourcesMock.mockReturnValue(stopWatching);
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

      const result = await sourceCompiler({ cjs: { dist: 'lib/cjs', src: 'lib-src' }, esm: format, watch: true });
      triggerChange();
      await result?.stop();

      expect(result?.kind).toBe('watch');
      expect(watchSourcesMock.mock.calls[0]?.[0]).toEqual(['/project/src', '/project/lib-src']);
      expect(sourceCompile).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenCalledWith('Watching src, lib-src for changes');
      expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^Rebuilt in \d+ ms$/));
      expect(stopWatching).toHaveBeenCalledTimes(1);
    });

    it('generates declarations for a TypeScript project', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');

      await sourceCompiler({ types: 'types' });

      expect(generateDts).toHaveBeenCalledWith({ types: 'types' }, '/project');
    });
  });
});
