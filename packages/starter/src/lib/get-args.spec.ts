import { getArgs, validateArgs } from './get-args.js';

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

    it('ignores a tests value that is no boolean', () => {
      setArgv({ tests: 'maybe' });

      expect(getArgs()).not.toHaveProperty('tests');
    });

    it.each(['false', 'no', '0', 0, false])('keeps offline off for --offline=%p', (offline) => {
      setArgv({ offline });

      expect(getArgs()).not.toHaveProperty('offline');
    });

    it.each(['true', 'yes', 1, true])('keeps the install for --install=%p', (install) => {
      setArgv({ install });

      expect(getArgs()).not.toHaveProperty('noInstall');
    });

    it('reports an unknown type', () => {
      setArgv({ type: 'desktop' });

      expect(validateArgs()).toEqual(['Unknown type "desktop". Use one of: csr, ssr, component, library']);
    });

    it('reports a bare --type', () => {
      setArgv({ type: true });

      expect(validateArgs()).toEqual(['Unknown type "true". Use one of: csr, ssr, component, library']);
    });

    it.each(['tests', 'offline', 'install', 'yarn'])('reports a value of --%s that is no boolean', (flag) => {
      setArgv({ [flag]: 'maybe' });

      expect(validateArgs()).toEqual([`Invalid value "maybe" for --${flag}. Use one of: true, yes, 1, false, no, 0`]);
    });

    it('reports every invalid flag', () => {
      setArgv({ offline: 'later', tests: 'maybe', type: 'desktop' });

      expect(validateArgs()).toHaveLength(3);
    });

    it('keeps install and test mode off by default', () => {
      expect(getArgs()).toEqual({ testMode: false });
    });
  });

  describe('positive cases', () => {
    it.each([false, 'false', 'no', '0'])('disables install with --install=%p (--no-install)', (install) => {
      setArgv({ install });

      expect(getArgs().noInstall).toBe(true);
    });

    it('enables test mode with --mode=test', () => {
      setArgv({ mode: 'test' });

      expect(getArgs().testMode).toBe(true);
    });

    it.each([
      [true, true],
      ['true', true],
      ['yes', true],
      ['YES', true],
      ['1', true],
      [1, true],
      [false, false],
      ['false', false],
      ['no', false],
      ['0', false],
      [0, false],
    ])('reads --tests=%p', (value, expected) => {
      setArgv({ tests: value });

      expect(getArgs().tests).toBe(expected);
    });

    it.each(['csr', 'ssr', 'component', 'library'])('accepts --type=%s', (type) => {
      setArgv({ type });

      expect(getArgs().appType).toBe(type);
    });

    it.each([true, 'true', 'yes', '1', 1])('reads --offline=%p', (offline) => {
      setArgv({ offline });

      expect(getArgs().offline).toBe(true);
    });

    it('finds no problems with valid flags', () => {
      setArgv({ install: false, offline: 'true', tests: 'no', type: 'ssr', yarn: true });

      expect(validateArgs()).toEqual([]);
    });

    it('finds no problems without flags', () => {
      expect(validateArgs()).toEqual([]);
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
