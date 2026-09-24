// Stand-ins for ESM-only dependencies that babel-jest's CJS output cannot load.
// Use them from jest.mock factories: jest.requireActual<typeof Mocks>('../__fixtures__/mocks').chalkModule

type ChalkMock = ((text: string) => string) & { readonly [style: string]: ChalkMock };

const createChalk = (): ChalkMock => {
  const identity = (text: string): string => text;
  const chalk: ChalkMock = new Proxy(identity, { get: (): ChalkMock => chalk }) as ChalkMock;

  return chalk;
};

export const chalkModule = { __esModule: true, default: createChalk() };

export interface SpinnerMock {
  readonly start: jest.Mock<SpinnerMock>;
  readonly stop: jest.Mock;
  text: string;
}

export const createSpinner = (initialText = ''): SpinnerMock => {
  const spinner: SpinnerMock = {
    start: jest.fn(() => spinner),
    stop: jest.fn(),
    text: initialText,
  };

  return spinner;
};

export const oraModule = { __esModule: true, default: jest.fn((text: string) => createSpinner(text)) };

export const sortPackageJsonModule = { __esModule: true, default: <T>(packageJson: T): T => packageJson };

const pascalCase = (input: string): string =>
  input
    .split(/[^A-Za-z0-9]+|(?<=[a-z0-9])(?=[A-Z])/)
    .filter((word) => word.length > 0)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`)
    .join('');

export const changeCaseModule = { pascalCase };
