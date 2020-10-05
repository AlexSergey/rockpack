import { createLogger } from './logger';

let logger;

beforeAll(() => {
  logger = createLogger();

  logger.setUp({
    active: true
  });
});

describe('Test active logger', () => {
  ['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod, index) => {
    test(`Logger test ${logMethod} method`, () => {
      logger[logMethod](`test ${logMethod} method`);
      const logItem = logger.getStackCollection().getData()[index];

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
    const stackLengthBefore = logger.getStackCollection().getData().length;
    ['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod) => {
      logger[logMethod](`test ${logMethod} method`);
    });
    const stackLengthAfter = logger.getStackCollection().getData().length;

    expect(stackLengthBefore)
      .toBe(stackLengthAfter);
  });
});
