import type { Compiler } from 'webpack';

import type { Reporter } from './reporter.js';

import { ReporterPlugin } from './reporter-plugin.js';

type Tap = (...args: never[]) => unknown;

const root = '/project';

const fakeReporter = (interactive = false): Reporter => ({
  done: jest.fn(),
  info: jest.fn(),
  interactive,
  issues: jest.fn(),
  progress: jest.fn(),
  start: jest.fn(),
});

// A compiler whose hooks record their callbacks, so a spec can fire them.
const fakeCompiler = (): {
  compiler: Compiler;
  fire: (hook: string, ...args: unknown[]) => void;
  progress: jest.Mock;
} => {
  const taps = new Map<string, Tap>();
  const hook = (name: string): { tap: (plugin: string, fn: Tap) => void } => ({
    tap: (_plugin, fn): void => {
      taps.set(name, fn);
    },
  });
  const progress = jest.fn();
  const compiler = {
    hooks: { done: hook('done'), failed: hook('failed'), run: hook('run'), watchRun: hook('watchRun') },
    webpack: {
      ProgressPlugin: class {
        private readonly handler: (fraction: number, step: string) => void;

        constructor(handler: (fraction: number, step: string) => void) {
          this.handler = handler;
          progress.mockImplementation(handler);
        }

        apply(): void {
          this.handler(0, 'setup');
        }
      },
    },
  } as unknown as Compiler;

  return {
    compiler,
    fire: (name, ...args): void => {
      (taps.get(name) as ((...values: unknown[]) => void) | undefined)?.(...args);
    },
    progress,
  };
};

const stats = (json: object): object => ({
  endTime: 3500,
  startTime: 1000,
  toJson: (): object => json,
});

describe('ReporterPlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('negative cases', () => {
    it('adds no progress plugin when the reporter draws no bars', () => {
      const reporter = fakeReporter(false);
      const { compiler, progress } = fakeCompiler();

      new ReporterPlugin(reporter, 'client', root, 'production').apply(compiler);

      expect(progress).not.toHaveBeenCalled();
      expect(reporter.progress).not.toHaveBeenCalled();
    });

    it('reports an error that stopped the build before stats existed', () => {
      const reporter = fakeReporter();
      const { compiler, fire } = fakeCompiler();
      new ReporterPlugin(reporter, 'client', root, 'production').apply(compiler);

      fire('failed', new Error('[eslint] \n/project/src/a.ts\n  1:1  error  Unexpected var  no-var'));

      expect(reporter.done).toHaveBeenCalledWith('client', {
        durationMs: expect.any(Number) as unknown,
        errors: [{ kind: 'ESLint', message: 'src/a.ts\n  1:1  error  Unexpected var  no-var' }],
        warnings: [],
      });
    });
  });

  describe('positive cases', () => {
    it('forwards the progress of a terminal build', () => {
      const reporter = fakeReporter(true);
      const { compiler } = fakeCompiler();

      new ReporterPlugin(reporter, 'client', root, 'development').apply(compiler);

      expect(reporter.progress).toHaveBeenCalledWith('client', 0, 'setup');
    });

    it('reports the start of a build and the changed files of a rebuild', () => {
      const reporter = fakeReporter();
      const { compiler, fire } = fakeCompiler();
      new ReporterPlugin(reporter, 'client', root, 'development').apply(compiler);

      fire('run');
      fire('watchRun', { modifiedFiles: new Set(['/project/src/app.tsx']) });
      fire('watchRun', {});

      expect((reporter.start as jest.Mock).mock.calls).toEqual([
        ['client'],
        ['client', ['src/app.tsx']],
        ['client', []],
      ]);
    });

    it('turns the stats of a production build into a report with the output size', () => {
      const reporter = fakeReporter();
      const { compiler, fire } = fakeCompiler();
      new ReporterPlugin(reporter, 'client', root, 'production').apply(compiler);

      fire(
        'done',
        stats({
          assets: [{ size: 1000 }, { size: 500 }],
          errors: [{ file: './src/a.ts:1:1', message: 'TS2322: Nope.' }],
          outputPath: '/project/dist',
          warnings: [{ message: 'asset size limit' }],
        }),
      );

      expect(reporter.done).toHaveBeenCalledWith('client', {
        durationMs: 2500,
        errors: [{ kind: 'TypeScript', location: 'src/a.ts:1:1', message: 'TS2322: Nope.' }],
        output: { bytes: 1500, dir: 'dist' },
        warnings: [{ kind: 'Build', message: 'asset size limit' }],
      });
    });

    it('reports a development build without the output size', () => {
      const reporter = fakeReporter();
      const { compiler, fire } = fakeCompiler();
      new ReporterPlugin(reporter, 'server', root, 'development').apply(compiler);

      fire('done', stats({ outputPath: '/project/dist' }));

      expect(reporter.done).toHaveBeenCalledWith('server', { durationMs: 2500, errors: [], warnings: [] });
    });
  });
});
