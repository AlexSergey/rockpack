import { getMode } from './get-mode.js';

const originalArgv = process.argv;
const originalNodeEnv = process.env['NODE_ENV'];

const setArgs = (...args: string[]): void => {
  process.argv = ['node', 'script.js', ...args];
};

describe('getMode', () => {
  beforeEach(() => {
    setArgs();
    delete process.env['NODE_ENV'];
  });

  afterEach(() => {
    process.argv = originalArgv;
    process.env['NODE_ENV'] = originalNodeEnv;
  });

  describe('negative cases', () => {
    it('falls back to the default mode when --mode is not an allowed mode', () => {
      setArgs('--mode=staging');

      expect(getMode()).toBe('development');
    });

    it('falls back to NODE_ENV when --mode has no value', () => {
      setArgs('--mode');
      process.env['NODE_ENV'] = 'production';

      expect(getMode()).toBe('production');
    });

    it('does not take the next flag as the --mode value', () => {
      setArgs('--mode', '--debug');
      process.env['NODE_ENV'] = 'production';

      expect(getMode()).toBe('production');
    });

    it('ignores --mode after the end of options', () => {
      setArgs('--', '--mode=production');

      expect(getMode()).toBe('development');
    });

    it('falls back to the default mode when NODE_ENV is not an allowed mode', () => {
      process.env['NODE_ENV'] = 'test';

      expect(getMode()).toBe('development');
    });
  });

  describe('positive cases', () => {
    it('prefers --mode=value over NODE_ENV', () => {
      setArgs('--mode=production');
      process.env['NODE_ENV'] = 'development';

      expect(getMode()).toBe('production');
    });

    it('reads --mode followed by a separate value', () => {
      setArgs('--analyzer', '--mode', 'production');

      expect(getMode()).toBe('production');
    });

    it('uses NODE_ENV when --mode is not set', () => {
      process.env['NODE_ENV'] = 'production';

      expect(getMode()).toBe('production');
    });

    it('returns the default mode when nothing is set', () => {
      expect(getMode()).toBe('development');
    });

    it('accepts custom modes and default mode', () => {
      setArgs('--mode=staging');

      expect(getMode(['staging', 'qa'], 'qa')).toBe('staging');
      expect(getMode(['qa'], 'qa')).toBe('qa');
    });
  });
});
