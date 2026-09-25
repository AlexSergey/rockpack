import type { Compilation, Compiler } from 'webpack';

import path from 'node:path';

import type { Problem, TypeScriptIssue } from '../../reporter/format-errors.js';
import type { Mode } from '../../types.js';

import { fromTypeScriptIssue, typeScriptLocation } from '../../reporter/format-errors.js';
import { parseTscOutput } from '../../utils/parse-tsc-output.js';
import { resolveTsc } from '../../utils/resolve-tsc.js';
import { runTsc } from '../../utils/run-tsc.js';

export type TypeCheckOptions = {
  readonly mode: Mode;
  // The compiler label; it names the incremental build info, so the two compilers of an isomorphic build do not
  // share one file.
  readonly name: string;
  // Development builds report here after each rebuild; without it they skip the check.
  readonly onIssues?: (problems: readonly Problem[]) => void;
  readonly root: string;
  readonly tsconfig: string;
};

const PLUGIN = 'RockpackTypeCheck';

// The errors of files whose module already failed the build (a syntax error Babel reported) are dropped, so one
// mistake is not reported twice.
const failedFile = (error: Error): string[] => {
  const module: unknown = 'module' in error ? error.module : undefined;
  const resource: unknown =
    typeof module === 'object' && module !== null && 'resource' in module ? module.resource : undefined;

  return typeof resource === 'string' ? [resource] : [];
};

const notFailedYet = (
  issues: readonly TypeScriptIssue[],
  compilation: Compilation,
  root: string,
): TypeScriptIssue[] => {
  const failed = new Set(compilation.errors.flatMap(failedFile));

  return issues.filter((issue) => issue.file === undefined || !failed.has(path.resolve(root, issue.file)));
};

const buildInfoFile = (root: string, name: string): string =>
  path.join(root, 'node_modules', '.cache', 'rockpack', 'tsc', `${name.replace(/[^\w-]/g, '_')}.tsbuildinfo`);

// Type checks the project with its own tsc (TypeScript 6 or 7) next to the build and reports what `tsc --noEmit`
// reports for the tsconfig. Production: the errors fail the build. Development: they are reported after each
// rebuild, a newer rebuild cancels an older check.
export class TypeCheckPlugin {
  private readonly options: TypeCheckOptions;

  constructor(options: TypeCheckOptions) {
    this.options = options;
  }

  apply(compiler: Compiler): void {
    if (this.options.mode === 'production') {
      this.failBuild(compiler);
    } else {
      this.reportAfterBuild(compiler);
    }
  }

  // Async, so a missing TypeScript rejects like a failed run instead of throwing inside a webpack hook.
  private async check(signal?: AbortSignal): Promise<TypeScriptIssue[]> {
    const { name, root, tsconfig } = this.options;
    const args = ['--noEmit', '--pretty', 'false', '--incremental', '--tsBuildInfoFile', buildInfoFile(root, name)];
    // Nothing is emitted, so the output layout does not matter: a rootDir that files imported from outside it
    // (an example app importing ../src) would break is widened to the file system root.
    const layout = ['--rootDir', path.parse(root).root];
    const { output } = await runTsc(resolveTsc(root), [...args, ...layout, '-p', tsconfig], root, signal);

    return parseTscOutput(output);
  }

  private failBuild(compiler: Compiler): void {
    const { root } = this.options;
    let pending: Promise<TypeScriptIssue[]> | undefined;
    const start = (): void => {
      pending = this.check();
      // Awaited after the compilation; until then a failure must not count as an unhandled rejection.
      pending.catch(() => undefined);
    };
    compiler.hooks.run.tap(PLUGIN, start);
    compiler.hooks.watchRun.tap(PLUGIN, start);
    compiler.hooks.afterCompile.tapPromise(PLUGIN, async (compilation: Compilation) => {
      if (compilation.compiler !== compiler || pending === undefined) {
        return;
      }
      const issues = await pending;
      pending = undefined;
      for (const issue of notFailedYet(issues, compilation, root)) {
        const error = new compiler.webpack.WebpackError(`${issue.code}: ${issue.message}`);
        error.file = typeScriptLocation(issue, root) ?? '';
        compilation.errors.push(error);
      }
    });
  }

  private reportAfterBuild(compiler: Compiler): void {
    const { onIssues, root } = this.options;
    if (!onIssues) {
      return;
    }
    let running: AbortController | undefined;
    const cancel = (): void => {
      running?.abort();
    };

    compiler.hooks.done.tap(PLUGIN, ({ compilation }) => {
      cancel();
      const current = new AbortController();
      running = current;
      void this.check(current.signal).then(
        (issues) => {
          onIssues(notFailedYet(issues, compilation, root).map((issue) => fromTypeScriptIssue(issue, root)));
        },
        (error: unknown) => {
          if (!current.signal.aborted) {
            onIssues([{ kind: 'TypeScript', message: error instanceof Error ? error.message : String(error) }]);
          }
        },
      );
    });
    compiler.hooks.watchClose.tap(PLUGIN, cancel);
    compiler.hooks.shutdown.tap(PLUGIN, cancel);
  }
}
