import type * as ErrorHandlerModule from './error-handler.js';

type Listener = (...args: unknown[]) => void;

const loadErrorHandler = (): typeof ErrorHandlerModule.errorHandler => {
  let loaded: typeof ErrorHandlerModule.errorHandler | undefined;
  jest.isolateModules(() => {
    loaded = jest.requireActual<typeof ErrorHandlerModule>('./error-handler.js').errorHandler;
  });
  if (!loaded) {
    throw new Error('./error-handler was not loaded');
  }

  return loaded;
};

describe('errorHandler', () => {
  const listeners = new Map<string, Listener>();
  let errorSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    listeners.clear();
    const register = (event: string | symbol, listener: Listener): NodeJS.Process => {
      listeners.set(String(event), listener);

      return process;
    };
    jest.spyOn(process, 'on').mockImplementation(register as never);
    jest.spyOn(process, 'once').mockImplementation(register as never);
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    loadErrorHandler()();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it.each([
      ['unhandledRejection', 'Unhandled Rejection'],
      ['uncaughtException', 'Unhandled Exception'],
      ['warning', 'Warning detected'],
    ])('logs %s without exiting', (event, label) => {
      const reason = new Error(event);

      listeners.get(event)?.(reason);

      expect(errorSpy).toHaveBeenCalledWith(reason, label);
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it('exits only once when SIGINT and SIGTERM both arrive', () => {
      listeners.get('SIGINT')?.();
      listeners.get('SIGTERM')?.();

      expect(exitSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('positive cases', () => {
    it.each(['SIGINT', 'SIGTERM'])('exits with code 0 on %s', (signal) => {
      listeners.get(signal)?.();

      expect(exitSpy).toHaveBeenCalledWith(0);
    });
  });
});
