import { EventEmitter } from 'node:events';
import nodemon from 'nodemon';

import { SsrDevelopment } from './index.js';

jest.mock('nodemon', () => jest.fn());

type AfterEmit = (compilation: Compilation, callback: HookCallback) => void;
type Compilation = {
  assets: Record<string, unknown>;
  errors: unknown[];
};
type HookCallback = () => void;
type WatchRun = (compiler: unknown, callback: HookCallback) => void;

const nodemonMock = nodemon as unknown as jest.Mock;

const createCompiler = (): {
  compiler: Parameters<SsrDevelopment['apply']>[0];
  emit: (compilation: Compilation) => HookCallback;
  watch: () => void;
} => {
  let afterEmit: AfterEmit | undefined;
  let watchRun: undefined | WatchRun;
  const compiler = {
    hooks: {
      afterEmit: { tapAsync: (_plugin: unknown, fn: AfterEmit): void => void (afterEmit = fn) },
      watchRun: { tapAsync: (_plugin: unknown, fn: WatchRun): void => void (watchRun = fn) },
    },
    outputPath: process.cwd() + '/dist',
  };

  return {
    compiler,
    emit: (compilation): HookCallback => {
      const callback = jest.fn();
      afterEmit?.(compilation, callback);

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
    global.LIVE_RELOAD_SERVER = undefined;
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('does not start nodemon before webpack watches', () => {
      const { compiler, emit } = createCompiler();
      new SsrDevelopment({}).apply(compiler);

      const callback = emit({ assets: { 'server.js': {} }, errors: [] });

      expect(nodemonMock).not.toHaveBeenCalled();
      expect(callback).toHaveBeenCalled();
    });

    it('reports a compilation error instead of starting nodemon', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment({}).apply(compiler);
      watch();

      emit({ assets: {}, errors: ['error'] });

      expect(logSpy).toHaveBeenCalledWith('[nodemon-webpack-plugin]: Compilation error.');
      expect(nodemonMock).not.toHaveBeenCalled();
    });

    it('starts nodemon only once', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment({}).apply(compiler);
      watch();

      emit({ assets: { 'server.js': {} }, errors: [] });
      emit({ assets: { 'server.js': {} }, errors: [] });

      expect(nodemonMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('positive cases', () => {
    it('starts nodemon for the emitted script with the plugin options winning', () => {
      const { compiler, emit, watch } = createCompiler();
      new SsrDevelopment({ ext: 'js', script: 'custom.js' }).apply(compiler);
      watch();

      emit({ assets: { 'server.js': {} }, errors: [] });

      expect(nodemonMock).toHaveBeenCalledWith({ ext: 'js', script: 'custom.js', watch: ['dist/server.js'] });
    });

    it('forwards nodemon logs and refreshes live reload on restart', () => {
      const refresh = jest.fn();
      global.LIVE_RELOAD_SERVER = { refresh };
      new SsrDevelopment({}).startMonitoring('dist/server.js');

      monitor.emit('log', { colour: 'restarting' });
      monitor.emit('restart');

      expect(logSpy).toHaveBeenCalledWith('restarting');
      expect(refresh).toHaveBeenCalledWith('');
    });

    it('stops nodemon when the process exits', () => {
      const monitorExit = jest.fn();
      monitor.on('exit', monitorExit);
      new SsrDevelopment({}).startMonitoring('dist/server.js');

      onceListeners.get('exit')?.();

      expect(monitorExit).toHaveBeenCalled();
      expect(onceListeners.has('SIGINT')).toBe(false);
    });
  });
});
