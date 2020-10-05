import React from 'react';
import { mount } from 'enzyme';
import { logger } from './logger';
import LoggerContainer, { useLoggerApi } from './LoggerContainer';

let loggerApi;
let level;
let message;
let stack;

beforeAll(() => {
  const App = (): JSX.Element => {
    loggerApi = useLoggerApi();
    return null;
  };

  mount(
    <LoggerContainer
      onError={(s): void => {
        stack = s;
      }}
      stdout={(l, m): void => {
        level = l;
        message = m;
      }}
    >
      <App />
    </LoggerContainer>
  );
});

it('test useLogger hook', () => {
  expect(typeof logger.log === 'function')
    .toBe(true);
  expect(typeof logger.info === 'function')
    .toBe(true);
  expect(typeof logger.debug === 'function')
    .toBe(true);
  expect(typeof logger.warn === 'function')
    .toBe(true);
  expect(typeof logger.error === 'function')
    .toBe(true);
});

['log', 'info', 'debug', 'warn', 'error'].forEach((logMethod) => {
  test(`test logger ${logMethod} method`, () => {
    logger[logMethod](`test ${logMethod} message`);

    expect(level)
      .toBe(logMethod);
    expect(message)
      .toBe(`test ${logMethod} message`);
  });
});

describe('test useLoggerApi', () => {
  test('test getStackData()', async () => {
    const { actions } = loggerApi.getStackData();

    expect(actions.length).toBe(5);
  });

  test('test onError callback', async () => {
    loggerApi.triggerError(loggerApi.getStackData());

    expect(stack.actions.length)
      .toBe(5);
  });
});
