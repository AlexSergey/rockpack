import { EventEmitter } from 'node:events';
import nodemon from 'nodemon';

import { SsrDevelopment } from './index.js';

jest.mock('nodemon', () =>
  Object.assign(jest.fn(), {
    reset: jest.fn((callback: () => void) => {
      callback();
    }),
  }),
);

type AfterEmit = (compilation: Compilation, callback: HookCallback) => void;
type Compilation = {
  errors: unknown[];
};
type HookCallback = () => void;
type Shutdown = (callback: HookCallback) => void;
type WatchRun = (compiler: unknown, callback: HookCallback) => void;

const nodemonMock = nodemon as unknown as jest.Mock;
const options = { ext: 'js', script: 'dist/server.js', watch: ['dist'] };
const resetMock = nodemon.reset as unknown as jest.Mock;

const createCompiler = (): {
  compiler: Parameters<SsrDevelopment['apply']>[0];
  emit: (compilation: Compilation) => HookCallback;
  shutdown: () => HookCallback;
  watch: () => void;
} => {
  let afterEmit: AfterEmit | undefined;
  let shutdown: Shutdown | undefined;
  let watchRun: undefined | WatchRun;
  const compiler = {
    hooks: {
      afterEmit: { tapAsync: (_plugin: unknown, fn: AfterEmit): void => void (afterEmit = fn) },
      shutdown: { tapAsync: (_plugin: unknown, fn: Shutdown): void => void (shutdown = fn) },
      watchRun: { tapAsync: (_plugin: unknown, fn: WatchRun): void => void (watchRun = fn) },
    },
  };

  return {
    compiler,
    emit: (compilation): HookCallback => {
      const callback = jest.fn();
      afterEmit?.(compilation, callback);

      return callback;
    },
    shutdown: (): HookCallback => {
      const callback = jest.fn();
      shutdown?.(callback);

      return callback;
    },
    watch: (): void => watchRun?.({}, jest.fn()),
  };
};

describe('SsrDevelopment', () => {
  let monitor: EventEmitter;
  let logSpy: jest.SpyInstance;
  const onceListeners = new Map<string, () => void>();

  beforeEach(() => {
    monitor = new EventEmitter();
    nodemonMock.mockReturnValue(monitor);
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    onceListeners.clear();
    jest.spyOn(process, 'once').mockImplementation(((event: string, listener: () => void) => {
      onceListeners.set(event, listener);

      return process;
    }) as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('does not start nodemon before webpack watches', () => {
      const { compiler, emit } = createCompiler();
      new SsrDevelopment(options).apply(compiler);

      const callback = emit({ errors: [] });

      expect(nodemonMock).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });

    it('does not start nodemon for a failed build', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment(options).apply(compiler);
      watch();

      emit({ errors: ['error'] });

      expect(nodemonMock).not.toHaveBeenCalled();
    });

    it('starts nodemon only once', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment(options).apply(compiler);
      watch();

      emit({ errors: [] });
      emit({ errors: [] });

      expect(nodemonMock).toHaveBeenCalledTimes(1);
    });

    it('does not refresh live reload while the old server still runs', () => {
      const refresh = jest.fn();
      new SsrDevelopment(options, { refresh }).startMonitoring();

      monitor.emit('restart');

      expect(refresh).not.toHaveBeenCalled();
    });

    it('does not refresh live reload when the server starts for the first time', () => {
      const refresh = jest.fn();
      new SsrDevelopment(options, { refresh }).startMonitoring();

      monitor.emit('start');

      expect(refresh).not.toHaveBeenCalled();
    });

    it('has no server to stop when the compiler closes before nodemon started', () => {
      const { compiler, shutdown } = createCompiler();
      new SsrDevelopment(options).apply(compiler);

      expect(shutdown()).toHaveBeenCalled();
      expect(resetMock).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it('starts nodemon with the plugin options once webpack watches', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment(options).apply(compiler);
      watch();

      emit({ errors: [] });

      expect(nodemonMock).toHaveBeenCalledWith(options);
    });

    it('forwards nodemon logs and refreshes live reload once the restarted server is spawned', () => {
      const refresh = jest.fn();
      new SsrDevelopment(options, { refresh }).startMonitoring();

      monitor.emit('log', { colour: 'restarting' });
      monitor.emit('restart');
      monitor.emit('start');
      monitor.emit('start');

      expect(logSpy).toHaveBeenCalledWith('restarting');
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(refresh).toHaveBeenCalledWith('');
    });

    it('stops the server nodemon runs once when the compiler closes', () => {
      const { compiler, emit, shutdown, watch } = createCompiler();
      new SsrDevelopment(options).apply(compiler);
      watch();
      emit({ errors: [] });

      const callback = shutdown();
      shutdown();

      expect(resetMock).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalled();
    });

    it('stops nodemon when the process exits', () => {
      const monitorExit = jest.fn();
      monitor.on('exit', monitorExit);
      new SsrDevelopment(options).startMonitoring();

      onceListeners.get('exit')?.();

      expect(monitorExit).toHaveBeenCalled();
      expect(onceListeners.has('SIGINT')).toBe(false);
    });
  });
});
