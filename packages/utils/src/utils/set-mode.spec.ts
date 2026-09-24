import { setMode } from './set-mode.js';

const originalArgv = process.argv;
const originalNodeEnv = process.env.NODE_ENV;
const originalBabelEnv = process.env['BABEL_ENV'];

const restoreEnv = (name: string, value: string | undefined): void => {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
};

describe('setMode', () => {
  beforeEach(() => {
    process.argv = ['node', 'script.js'];
    delete process.env.NODE_ENV;
    delete process.env['BABEL_ENV'];
  });

  afterEach(() => {
    process.argv = originalArgv;
    restoreEnv('NODE_ENV', originalNodeEnv);
    restoreEnv('BABEL_ENV', originalBabelEnv);
  });

  describe('negative cases', () => {
    it('overwrites a NODE_ENV that is not an allowed mode', () => {
      process.env.NODE_ENV = 'staging';

      expect(setMode(['development', 'production'], 'development')).toBe('development');
      expect(process.env.NODE_ENV).toBe('development');
    });

    it('falls back to the default mode when --mode is not an allowed mode', () => {
      process.argv = ['node', 'script.js', '--mode=staging'];

      expect(setMode(['development', 'production'], 'development')).toBe('development');
    });
  });

  describe('positive cases', () => {
    it('resolves the mode like getMode', () => {
      process.argv = ['node', 'script.js', '--mode=production'];
      process.env.NODE_ENV = 'development';

      expect(setMode(['development', 'production'], 'development')).toBe('production');
    });

    it('writes the resolved mode to NODE_ENV and BABEL_ENV', () => {
      process.env.NODE_ENV = 'test';

      setMode(['development', 'production', 'test'], 'test');

      expect([process.env.NODE_ENV, process.env['BABEL_ENV']]).toEqual(['test', 'test']);
    });
  });
});
