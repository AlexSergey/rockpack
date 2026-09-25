import { getArgs } from './get-args.js';

const mockArgv: Record<string, unknown> = {};

jest.mock('../utils/argv.js', () => ({
  getArgv: (): Record<string, unknown> => mockArgv,
}));

const setArgv = (values: Record<string, unknown>): void => {
  Object.assign(mockArgv, values);
};

describe('getArgs', () => {
  afterEach(() => {
    Object.keys(mockArgv).forEach((key) => {
      delete mockArgv[key];
    });
  });

  describe('negative cases', () => {
    it('drops an unknown project type', () => {
      setArgv({ type: 'desktop' });

      expect(getArgs()).not.toHaveProperty('appType');
    });

    it('drops a non-string folder', () => {
      setArgv({ folder: 42 });

      expect(getArgs()).not.toHaveProperty('folder');
    });

    it('ignores a tests value other than "true" or "false"', () => {
      setArgv({ tests: 'yes' });

      expect(getArgs()).not.toHaveProperty('tests');
    });

    it('ignores a boolean tests flag', () => {
      setArgv({ tests: true });

      expect(getArgs()).not.toHaveProperty('tests');
    });

    it('keeps install and test mode off by default', () => {
      expect(getArgs()).toEqual({ testMode: false });
    });
  });

  describe('positive cases', () => {
    it('disables install with --install=false', () => {
      setArgv({ install: false });

      expect(getArgs().noInstall).toBe(true);
    });

    it('enables test mode with --mode=test', () => {
      setArgv({ mode: 'test' });

      expect(getArgs().testMode).toBe(true);
    });

    it.each([
      ['true', true],
      ['false', false],
    ])('reads --tests=%s', (value, expected) => {
      setArgv({ tests: value });

      expect(getArgs().tests).toBe(expected);
    });

    it.each(['csr', 'ssr', 'component', 'library'])('accepts --type=%s', (type) => {
      setArgv({ type });

      expect(getArgs().appType).toBe(type);
    });

    it('reads --offline', () => {
      setArgv({ offline: true });

      expect(getArgs().offline).toBe(true);
    });

    it.each([{ yes: true }, { y: true }])('reads %p as --yes', (flag) => {
      setArgv(flag);

      expect(getArgs().yes).toBe(true);
    });

    it('reads --folder', () => {
      setArgv({ folder: 'projects' });

      expect(getArgs().folder).toBe('projects');
    });
  });
});
