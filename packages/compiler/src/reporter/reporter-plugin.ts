import type { Compiler, Stats } from 'webpack';

import path from 'node:path';

import type { Mode } from '../types.js';
import type { Reporter } from './reporter.js';
import type { BuildReport } from './summary.js';

import { fromError, fromStatsProblem } from './format-errors.js';

const PLUGIN = 'RockpackReporter';

const toReport = (stats: Stats, root: string, mode: Mode): BuildReport => {
  const json = stats.toJson({
    all: false,
    assets: mode === 'production',
    errors: true,
    outputPath: true,
    warnings: true,
  });
  const report: BuildReport = {
    durationMs: stats.endTime - stats.startTime,
    errors: (json.errors ?? []).flatMap((error) => fromStatsProblem(error, root)),
    warnings: (json.warnings ?? []).flatMap((warning) => fromStatsProblem(warning, root)),
  };
  if (mode !== 'production' || json.outputPath === undefined) {
    return report;
  }
  const bytes = (json.assets ?? []).reduce((total, asset) => total + asset.size, 0);

  return { ...report, output: { bytes, dir: path.relative(root, json.outputPath) || '.' } };
};

// Sends one compiler's progress, builds and problems to the shared reporter; prints nothing itself.
export class ReporterPlugin {
  private readonly mode: Mode;
  private readonly name: string;
  private readonly reporter: Reporter;
  private readonly root: string;

  constructor(reporter: Reporter, name: string, root: string, mode: Mode) {
    this.reporter = reporter;
    this.name = name;
    this.root = root;
    this.mode = mode;
  }

  apply(compiler: Compiler): void {
    const { mode, name, reporter, root } = this;
    let startedAt = Date.now();

    if (reporter.interactive) {
      new compiler.webpack.ProgressPlugin((fraction, step) => {
        reporter.progress(name, fraction, step);
      }).apply(compiler);
    }

    compiler.hooks.run.tap(PLUGIN, () => {
      startedAt = Date.now();
      reporter.start(name);
    });
    compiler.hooks.watchRun.tap(PLUGIN, (watching) => {
      startedAt = Date.now();
      const changed = [...(watching.modifiedFiles ?? [])].map((file) => path.relative(root, file));
      reporter.start(name, changed);
    });
    compiler.hooks.done.tap(PLUGIN, (stats) => {
      reporter.done(name, toReport(stats, root, mode));
    });
    // An error that ended the build before stats existed (ESLint with failOnError, a crashed loader).
    compiler.hooks.failed.tap(PLUGIN, (error) => {
      reporter.done(name, { durationMs: Date.now() - startedAt, errors: fromError(error, root), warnings: [] });
    });
  }
}
