import * as utils from './index.js';

type MockParser = {
  help: () => MockParser;
  parseSync: () => Record<string, unknown>;
  version: () => MockParser;
};

jest.mock('yargs', () =>
  jest.fn(() => {
    const parser: MockParser = {
      help: () => parser,
      parseSync: (): Record<string, unknown> => ({}),
      version: () => parser,
    };

    return parser;
  }),
);
jest.mock('yargs/helpers', () => ({ hideBin: (argv: string[]): string[] => argv.slice(2) }));

describe('@rockpack/utils', () => {
  describe('negative cases', () => {
    it('does not export a default', () => {
      expect(Object.keys(utils)).not.toContain('default');
    });
  });

  describe('positive cases', () => {
    it('exports exactly the public helpers', () => {
      expect(Object.keys(utils).sort()).toEqual(['getMajorVersion', 'getMode', 'getRootRequireDir', 'setMode']);
    });
  });
});
