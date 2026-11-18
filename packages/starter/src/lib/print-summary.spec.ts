import type * as Mocks from '../__fixtures__/mocks.js';
import type { State } from './wizard.js';

import { getPM } from '../utils/other.js';
import { printSummary } from './print-summary.js';

jest.mock('chalk', () => jest.requireActual<typeof Mocks>('../__fixtures__/mocks.js').chalkModule);
jest.mock('../utils/other.js', () => ({ getPM: jest.fn() }));

const getPMMock = getPM as jest.MockedFunction<typeof getPM>;

const printedLines = (state: State): string[] => {
  const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  printSummary('my-app', state);

  return logSpy.mock.calls.map((args) => args.map(String).join(' '));
};

describe('printSummary', () => {
  beforeEach(() => {
    getPMMock.mockReturnValue('npm');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it.each(['library', 'component'] as const)('does not send a %s project into the example folder', (appType) => {
      const lines = printedLines({ appType, tester: false });

      expect(lines.some((line) => line.includes('cd example'))).toBe(false);
    });

    it('prints no test commands without the tester', () => {
      const lines = printedLines({ appType: 'csr', tester: false });

      expect(lines).not.toContain('npm test - run tests');
    });

    it('prints no git hint when git is off', () => {
      const lines = printedLines({ appType: 'csr', nogit: true, tester: false });

      expect(lines).not.toContain('git remote add origin <url>');
    });
  });

  describe('positive cases', () => {
    it.each([
      ['csr', 'npm run lint - run all checks (ESLint, types, styles, unused code)'],
      ['ssr', 'npm run lint - run all checks (ESLint, types, styles, unused code)'],
      ['library', 'npm run lint - run all checks (ESLint, types, unused code)'],
      ['component', 'npm run lint - run all checks (ESLint, types, styles, unused code)'],
    ] as const)('prints the dev, build and lint commands for a %s project', (appType, lintLine) => {
      const lines = printedLines({ appType, tester: false });

      expect(lines).toContain('cd my-app');
      expect(lines).toContain('npm start - run dev mode');
      expect(lines).toContain('npm run build - build production');
      expect(lines).toContain(lintLine);
    });

    it('uses the detected package manager', () => {
      getPMMock.mockReturnValue('yarn');

      const lines = printedLines({ appType: 'library', tester: false });

      expect(lines).toContain('yarn start - run dev mode');
    });

    it('prints the test commands with the tester', () => {
      const lines = printedLines({ appType: 'csr', tester: true });

      expect(lines).toContain('npm test - run tests');
      expect(lines).toContain('npm run test:watch - run tests in dev mode');
    });

    it('prints the git hint when git is on', () => {
      const lines = printedLines({ appType: 'csr', tester: false });

      expect(lines).toContain('git remote add origin <url>');
    });
  });
});
