import { getRootRequireDir, setMode } from '@rockpack/utils';

import { generateDts } from '../utils/generate-dts.js';
import { pathToTsConf } from '../utils/path-to-ts-conf.js';
import { sourceCompile } from '../utils/source-compile.js';
import { sourceCompiler } from './source-compiler.js';

jest.mock('@rockpack/utils', () => ({ getRootRequireDir: jest.fn(), setMode: jest.fn() }));
jest.mock('../error-handler.js', () => ({ errorHandler: jest.fn() }));
jest.mock('../utils/generate-dts.js', () => ({ generateDts: jest.fn() }));
jest.mock('../utils/path-to-ts-conf.js', () => ({ pathToTsConf: jest.fn() }));
jest.mock('../utils/source-compile.js', () => ({ sourceCompile: jest.fn() }));

const format = { dist: 'lib/esm', src: 'src' };

describe('sourceCompiler', () => {
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

    it('logs a failed source compilation and still generates declarations', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');
      (sourceCompile as jest.Mock).mockRejectedValue(new Error('babel failed'));

      await sourceCompiler({ esm: format });

      expect(errorSpy).toHaveBeenCalledWith('babel failed');
      expect(generateDts).toHaveBeenCalled();
    });

    it('logs a failed declaration build', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');
      (generateDts as jest.Mock).mockRejectedValue(new Error('tsc failed'));

      await sourceCompiler();

      expect(errorSpy).toHaveBeenCalledWith('tsc failed');
    });
  });

  describe('positive cases', () => {
    it.each([{ esm: format }, { cjs: format }])('compiles sources for %p', async (conf) => {
      await sourceCompiler(conf);

      expect(sourceCompile).toHaveBeenCalledWith(conf);
      expect(pathToTsConf).toHaveBeenCalledWith('/project', 'production', false);
    });

    it('generates declarations for a TypeScript project', async () => {
      (pathToTsConf as jest.Mock).mockReturnValue('/project/tsconfig.json');

      await sourceCompiler({ types: 'types' });

      expect(generateDts).toHaveBeenCalledWith({ types: 'types' }, '/project');
    });
  });
});
