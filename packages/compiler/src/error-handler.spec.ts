import type * as ErrorHandlerModule from './error-handler.js';
import type * as RockpackErrorModule from './errors/rockpack-error.js';

type Listener = (...args: unknown[]) => void;

type Loaded = {
  readonly errorHandler: typeof ErrorHandlerModule.errorHandler;
  readonly RockpackError: typeof RockpackErrorModule.RockpackError;
};

// The isolated registry has its own RockpackError class, so the spec takes it from there too.
const load = (): Loaded => {
  let loaded: Loaded | undefined;
  jest.isolateModules(() => {
    loaded = {
      errorHandler: jest.requireActual<typeof ErrorHandlerModule>('./error-handler.js').errorHandler,
      RockpackError: jest.requireActual<typeof RockpackErrorModule>('./errors/rockpack-error.js').RockpackError,
    };
  });
  if (!loaded) {
    throw new Error('./error-handler was not loaded');
  }

  return loaded;
};

const loadErrorHandler = (): typeof ErrorHandlerModule.errorHandler => load().errorHandler;

describe('errorHandler', () => {
  const originalExitCode = process.exitCode;
  const listeners = new Map<string, Listener>();
  let onSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let exitSpy: jest.SpyInstance;

  beforeEach(() => {
    listeners.clear();
    const register = (event: string | symbol, listener: Listener): NodeJS.Process => {
      listeners.set(String(event), listener);

      return process;
    };
    onSpy = jest.spyOn(process, 'on').mockImplementation(register as never);
    jest.spyOn(process, 'once').mockImplementation(register as never);
    exitSpy = jest.spyOn(process, 'exit').mockImplementation((() => undefined) as never);
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.exitCode = originalExitCode;
    jest.restoreAllMocks();
  });

  describe('negative cases', () => {
    it('registers the listeners only once per process', () => {
      const errorHandler = loadErrorHandler();

      errorHandler();
      errorHandler();

      expect(onSpy).toHaveBeenCalledTimes(3);
    });

    it('only marks the exit code for a RockpackError the boundary already reported', () => {
      const { errorHandler, RockpackError } = load();
      errorHandler();

      listeners.get('unhandledRejection')?.(new RockpackError('INVALID_CONFIG', 'broken'));

      expect(process.exitCode).toBe(1);
      expect(errorSpy).not.toHaveBeenCalled();
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it.each([
      ['unhandledRejection', 'Unhandled Rejection'],
      ['uncaughtException', 'Unhandled Exception'],
    ])('logs %s and exits with code 1', (event, label) => {
      loadErrorHandler()();
      const error = new Error(event);

      listeners.get(event)?.(error);

      expect(errorSpy).toHaveBeenCalledWith(error, label);
      expect(process.exitCode).toBe(1);
      expect(exitSpy).toHaveBeenCalledWith();
    });
  });

  describe('positive cases', () => {
    it('logs warnings without exiting', () => {
      loadErrorHandler()();
      const warning = new Error('deprecated');

      listeners.get('warning')?.(warning);

      expect(errorSpy).toHaveBeenCalledWith(warning, 'Warning detected');
      expect(exitSpy).not.toHaveBeenCalled();
    });

    it.each([
      ['SIGINT', 130],
      ['SIGTERM', 143],
    ])('exits on %s with code %i', (signal, code) => {
      loadErrorHandler()();

      listeners.get(signal)?.();

      expect(exitSpy).toHaveBeenCalledWith(code);
    });
  });
});
