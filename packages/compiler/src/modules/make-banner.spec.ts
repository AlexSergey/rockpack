import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { makeBanner } from './make-banner.js';

jest.mock('node:fs', () => ({ existsSync: jest.fn(), readFileSync: jest.fn() }));

const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const readFileSyncMock = readFileSync as unknown as jest.MockedFunction<(path: string, encoding: string) => string>;

const mockBanner = (content: string): void => {
  existsSyncMock.mockReturnValue(true);
  readFileSyncMock.mockReturnValue(content);
};

const template = ['${name}: ${version}', '${author}', '', '${description}', '${license}'].join('\n');

describe('makeBanner', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('returns false when the banner file is missing', () => {
      existsSyncMock.mockReturnValue(false);

      expect(makeBanner({ name: 'app' })).toBe(false);
      expect(existsSyncMock).toHaveBeenCalledWith(expect.stringContaining('banner'));
      expect(readFileSyncMock).not.toHaveBeenCalled();
    });

    it('returns false for an empty banner file', () => {
      mockBanner('');

      expect(makeBanner({ name: 'app' })).toBe(false);
    });

    it('blanks placeholders the package.json does not provide and drops empty lines', () => {
      mockBanner(template);

      expect(makeBanner({ name: 'app' })).toBe('app: ');
    });
  });

  describe('positive cases', () => {
    it('fills every placeholder from package.json', () => {
      mockBanner(template);

      expect(makeBanner({ author: 'Jane', description: 'An app', license: 'MIT', name: 'app', version: '1.0.0' })).toBe(
        ['app: 1.0.0', 'Jane', 'An app', 'MIT'].join('\n'),
      );
    });

    it('fills a placeholder whose name also starts the banner', () => {
      mockBanner('name ${name}');

      expect(makeBanner({ name: 'app' })).toBe('name app');
    });

    it('reads the banner from the compiler package root', () => {
      existsSyncMock.mockImplementation((file) => String(file) === path.resolve(__dirname, '../../package.json'));

      makeBanner({ name: 'app' });

      expect(existsSyncMock).toHaveBeenLastCalledWith(path.resolve(__dirname, '../../banner'));
    });

    it('drops Windows line endings left on their own line', () => {
      mockBanner('${name} banner\n\r\n');

      expect(makeBanner({ name: 'app' })).toBe('app banner');
    });
  });
});
