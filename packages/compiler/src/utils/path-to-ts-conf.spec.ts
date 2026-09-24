import { existsSync } from 'node:fs';
import path from 'node:path';

import type { Mode } from '../types.js';

import { pathToTsConf } from './path-to-ts-conf.js';

jest.mock('node:fs', () => ({ existsSync: jest.fn() }));

const existsSyncMock = existsSync as jest.MockedFunction<typeof existsSync>;
const root = '/project';

const mockFiles = (...files: string[]): void => {
  existsSyncMock.mockImplementation((file) => files.map((name) => path.resolve(root, name)).includes(String(file)));
};

const allConfigs = [
  'tsconfig.js',
  'tsconfig.debug.js',
  'tsconfig.json',
  'tsconfig.debug.json',
  'tsconfig.development.js',
  'tsconfig.production.js',
];

describe('pathToTsConf', () => {
  describe('negative cases', () => {
    it('returns false when no tsconfig is present', () => {
      mockFiles();

      expect(pathToTsConf(root, 'production', true)).toBe(false);
    });

    it('ignores debug configs without debug', () => {
      mockFiles('tsconfig.js', 'tsconfig.debug.js');

      expect(pathToTsConf(root, 'production', false)).toBe(path.resolve(root, 'tsconfig.js'));
    });

    it('ignores a debug config without its base config', () => {
      mockFiles('tsconfig.debug.json');

      expect(pathToTsConf(root, 'production', true)).toBe(false);
    });
  });

  describe('positive cases', () => {
    it.each<[string, string[], Mode, boolean, string]>([
      ['tsconfig.js', ['tsconfig.js'], 'production', false, 'tsconfig.js'],
      ['tsconfig.debug.js in debug', ['tsconfig.js', 'tsconfig.debug.js'], 'production', true, 'tsconfig.debug.js'],
      ['tsconfig.json over tsconfig.js', ['tsconfig.js', 'tsconfig.json'], 'production', false, 'tsconfig.json'],
      [
        'tsconfig.debug.json over tsconfig.debug.js',
        ['tsconfig.js', 'tsconfig.debug.js', 'tsconfig.json', 'tsconfig.debug.json'],
        'development',
        true,
        'tsconfig.debug.json',
      ],
      ['the development config in development', allConfigs, 'development', true, 'tsconfig.development.js'],
      ['the production config in production', allConfigs, 'production', true, 'tsconfig.production.js'],
      [
        'tsconfig.json when only the other mode config exists',
        ['tsconfig.json', 'tsconfig.production.js'],
        'development',
        false,
        'tsconfig.json',
      ],
    ])('picks %s', (_name, files, mode, debug, expected) => {
      mockFiles(...files);

      expect(pathToTsConf(root, mode, debug)).toBe(path.resolve(root, expected));
    });
  });
});
