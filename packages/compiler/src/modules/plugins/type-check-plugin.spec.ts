import type { Compilation, Compiler } from 'webpack';

import type { TypeCheckOptions } from './type-check-plugin.js';

import { resolveTsc } from '../../utils/resolve-tsc.js';
import { runTsc } from '../../utils/run-tsc.js';
import { TypeCheckPlugin } from './type-check-plugin.js';

jest.mock('../../utils/resolve-tsc.js', () => ({ resolveTsc: jest.fn() }));
jest.mock('../../utils/run-tsc.js', () => ({ runTsc: jest.fn() }));

type Tap = (...args: never[]) => unknown;

const TYPE_ERROR = "src/a.ts(1,14): error TS2322: Type 'string' is not assignable to type 'number'.\n";

class FakeWebpackError extends Error {
  file = '';
}

// A compiler whose hooks record their callbacks, so a spec can fire them and await the async ones.
const fakeCompiler = (): { compiler: Compiler; fire: (hook: string, ...args: unknown[]) => unknown } => {
  const taps = new Map<string, Tap>();
  const hook = (
    name: string,
  ): { tap: (plugin: string, fn: Tap) => void; tapPromise: (plugin: string, fn: Tap) => void } => ({
    tap: (_plugin, fn): void => {
      taps.set(name, fn);
    },
    tapPromise: (_plugin, fn): void => {
      taps.set(name, fn);
    },
  });
  const compiler = {
    hooks: Object.fromEntries(
      ['afterCompile', 'done', 'run', 'shutdown', 'watchClose', 'watchRun'].map((name) => [name, hook(name)]),
    ),
    webpack: { WebpackError: FakeWebpackError },
  } as unknown as Compiler;

  return {
    compiler,
    fire: (name, ...args): unknown => (taps.get(name) as ((...values: unknown[]) => unknown) | undefined)?.(...args),
  };
};

const options = (overrides: Partial<TypeCheckOptions> = {}): TypeCheckOptions => ({
  mode: 'production',
  name: 'client',
  root: '/project',
  tsconfig: '/project/tsconfig.json',
  ...overrides,
});

const flush = (): Promise<void> => new Promise((resolve) => setImmediate(resolve));

// A compilation of the given compiler, with the errors webpack already has.
const compilationOf = (compiler: unknown, errors: object[] = []): { compiler: unknown; errors: object[] } => ({
  compiler,
  errors,
});

describe('TypeCheckPlugin', () => {
  beforeEach(() => {
    jest.mocked(resolveTsc).mockReturnValue('/project/node_modules/typescript/bin/tsc');
    jest.mocked(runTsc).mockResolvedValue({ code: 0, output: '' });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('negative cases', () => {
    it('adds no errors to a production build without type errors', async () => {
      const { compiler, fire } = fakeCompiler();
      const compilation = compilationOf(compiler) as unknown as Compilation;
      new TypeCheckPlugin(options()).apply(compiler);

      fire('run');
      await fire('afterCompile', compilation);

      expect(compilation.errors).toEqual([]);
    });

    it('leaves child compilations alone', async () => {
      const { compiler, fire } = fakeCompiler();
      jest.mocked(runTsc).mockResolvedValue({ code: 2, output: TYPE_ERROR });
      const child = compilationOf({}) as unknown as Compilation;
      new TypeCheckPlugin(options()).apply(compiler);

      fire('run');
      await fire('afterCompile', child);

      expect(child.errors).toEqual([]);
    });

    it('fails the production build when TypeScript cannot be found', async () => {
      const { compiler, fire } = fakeCompiler();
      jest.mocked(resolveTsc).mockImplementation(() => {
        throw new Error('TypeScript not found');
      });
      new TypeCheckPlugin(options()).apply(compiler);

      fire('run');

      await expect(fire('afterCompile', compilationOf(compiler))).rejects.toThrow('TypeScript not found');
    });

    it('drops the errors of files whose module already failed the build, keeps the others', async () => {
      const { compiler, fire } = fakeCompiler();
      const onIssues = jest.fn();
      jest.mocked(runTsc).mockResolvedValue({
        code: 2,
        output: `${TYPE_ERROR}src/broken.ts(1,23): error TS1109: Expression expected.\nerror TS2688: Cannot find type definition file for 'jest'.\n`,
      });
      const syntaxError = { message: 'Unexpected token', module: { resource: '/project/src/broken.ts' } };
      new TypeCheckPlugin(options({ mode: 'development', onIssues })).apply(compiler);

      fire('done', { compilation: compilationOf(compiler, [syntaxError, new Error('no module')]) });
      await flush();

      expect(onIssues).toHaveBeenCalledWith([
        expect.objectContaining({ location: 'src/a.ts:1:14' }),
        { kind: 'TypeScript', message: "TS2688: Cannot find type definition file for 'jest'." },
      ]);
    });

    it('skips the development check when nobody reads the result', () => {
      const { compiler, fire } = fakeCompiler();
      new TypeCheckPlugin(options({ mode: 'development' })).apply(compiler);

      fire('done', { compilation: compilationOf(compiler) });

      expect(runTsc).not.toHaveBeenCalled();
    });

    it('reports a development check that could not run', async () => {
      const { compiler, fire } = fakeCompiler();
      const onIssues = jest.fn();
      jest.mocked(runTsc).mockRejectedValue(new Error('spawn failed'));
      new TypeCheckPlugin(options({ mode: 'development', onIssues })).apply(compiler);

      fire('done', { compilation: compilationOf(compiler) });
      await flush();

      expect(onIssues).toHaveBeenCalledWith([{ kind: 'TypeScript', message: 'spawn failed' }]);
    });

    it('drops a development check cancelled by a newer build or by closing the watcher', async () => {
      const { compiler, fire } = fakeCompiler();
      const onIssues = jest.fn();
      const signals: AbortSignal[] = [];
      jest.mocked(runTsc).mockImplementation(
        (_tsc, _args, _cwd, signal) =>
          new Promise((_resolve, reject) => {
            signals.push(signal as AbortSignal);
            signal?.addEventListener('abort', () => {
              reject(new Error('aborted'));
            });
          }),
      );
      new TypeCheckPlugin(options({ mode: 'development', onIssues })).apply(compiler);

      fire('done', { compilation: compilationOf(compiler) });
      await flush();
      fire('done', { compilation: compilationOf(compiler) });
      await flush();
      fire('watchClose');
      await flush();

      expect(signals.map((signal) => signal.aborted)).toEqual([true, true]);
      expect(onIssues).not.toHaveBeenCalled();
    });
  });

  describe('positive cases', () => {
    it("runs the project's tsc incrementally without emitting or a rootDir limit, one build info file per compiler", async () => {
      const { compiler, fire } = fakeCompiler();
      new TypeCheckPlugin(options({ name: 'server (ssr)' })).apply(compiler);

      fire('run');
      await fire('afterCompile', compilationOf(compiler));

      expect(runTsc).toHaveBeenCalledWith(
        '/project/node_modules/typescript/bin/tsc',
        [
          '--noEmit',
          '--pretty',
          'false',
          '--incremental',
          '--tsBuildInfoFile',
          '/project/node_modules/.cache/rockpack/tsc/server__ssr_.tsbuildinfo',
          '--rootDir',
          '/',
          '-p',
          '/project/tsconfig.json',
        ],
        '/project',
        undefined,
      );
    });

    it('turns type errors into errors of the production build with their position', async () => {
      const { compiler, fire } = fakeCompiler();
      jest.mocked(runTsc).mockResolvedValue({ code: 2, output: TYPE_ERROR });
      const compilation = compilationOf(compiler);
      new TypeCheckPlugin(options()).apply(compiler);

      fire('watchRun');
      await fire('afterCompile', compilation);

      expect(compilation.errors).toHaveLength(1);
      expect(compilation.errors[0]).toMatchObject({
        file: 'src/a.ts:1:14',
        message: "TS2322: Type 'string' is not assignable to type 'number'.",
      });
    });

    it('reports the type errors of each development build', async () => {
      const { compiler, fire } = fakeCompiler();
      const onIssues = jest.fn();
      jest.mocked(runTsc).mockResolvedValue({ code: 2, output: TYPE_ERROR });
      new TypeCheckPlugin(options({ mode: 'development', onIssues })).apply(compiler);

      fire('done', { compilation: compilationOf(compiler) });
      await flush();

      expect(onIssues).toHaveBeenCalledWith([
        {
          kind: 'TypeScript',
          location: 'src/a.ts:1:14',
          message: "TS2322: Type 'string' is not assignable to type 'number'.",
        },
      ]);
      expect(jest.mocked(runTsc).mock.calls[0]?.[3]).toBeInstanceOf(AbortSignal);
    });
  });
});
