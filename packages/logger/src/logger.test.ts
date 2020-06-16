import LimitedArray from 'limited-array';
import { Logger } from './logger';

let logger;
let stackCollection;

beforeAll(() => {
  logger = new Logger();
  stackCollection = new LimitedArray();

  logger.setUp({
    active: true,
    stackCollection
  });
});

describe('Test active logger', () => {
  ['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod, index) => {
    test(`Logger test ${logMethod} method`, () => {
      logger[logMethod](`test ${logMethod} method`);
      const logItem = stackCollection.getData()[index];

      expect(Object.keys(logItem)[0])
        .toBe(logMethod);

      expect(logItem)
        .toStrictEqual({ [logMethod]: `test ${logMethod} method` });
    });
  });
});

describe('Test no-active logger', () => {
  test('Logger test all methods', () => {
    logger.setUp({
      active: false
    });
    const stackLengthBefore = stackCollection.getData().length;
    ['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod) => {
      logger[logMethod](`test ${logMethod} method`);
    });
    const stackLengthAfter = stackCollection.getData().length;

    expect(stackLengthBefore)
      .toBe(stackLengthAfter);
  });
});
