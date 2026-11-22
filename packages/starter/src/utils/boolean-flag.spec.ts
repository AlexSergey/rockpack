import { attachBareBooleanFlags } from './boolean-flag.js';

jest.mock('./argv.js', () => ({
  getArgv: (): Record<string, unknown> => ({}),
}));

describe('attachBareBooleanFlags', () => {
  describe('negative cases', () => {
    it.each([
      [['--tests=no', 'my-app']],
      [['--tests', 'no', 'my-app']],
      [['--install', 'false', 'my-app']],
      [['--no-tests', 'my-app']],
      [['--offline', '--type=csr', 'my-app']],
      [['my-app', '--pnpm']],
      [['--folder', 'apps', 'my-app']],
    ])('keeps %p unchanged', (args) => {
      expect(attachBareBooleanFlags(args)).toEqual(args);
    });
  });

  describe('positive cases', () => {
    it.each(['tests', 'offline', 'install', 'yarn', 'pnpm'])('keeps the project name after a bare --%s', (flag) => {
      expect(attachBareBooleanFlags([`--${flag}`, 'my-app'])).toEqual([`--${flag}=true`, 'my-app']);
    });

    it('keeps "." after a bare flag as the current directory', () => {
      expect(attachBareBooleanFlags(['--pnpm', '.'])).toEqual(['--pnpm=true', '.']);
    });
  });
});
