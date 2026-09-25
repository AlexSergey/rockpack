import type ansiColors from 'ansi-colors';

import type { Problem } from './format-errors.js';

export type BuildReport = {
  readonly durationMs: number;
  readonly errors: readonly Problem[];
  // Total size of the emitted assets and the folder they went to (production).
  readonly output?: { readonly bytes: number; readonly dir: string };
  readonly warnings: readonly Problem[];
};

type Colors = typeof ansiColors;

const BAR_WIDTH = 20;

const formatDuration = (ms: number): string => `${(ms / 1000).toFixed(1)}s`;

const formatSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${String(bytes)} B`;
  }

  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} kB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const plural = (count: number, word: string): string => `${String(count)} ${word}${count === 1 ? '' : 's'}`;

export const progressRow = (colors: Colors, name: string, fraction: number, step: string): string => {
  const done = Math.round(Math.min(Math.max(fraction, 0), 1) * BAR_WIDTH);
  const bar = `${colors.cyan('█'.repeat(done))}${colors.gray('░'.repeat(BAR_WIDTH - done))}`;
  const percent = `${String(Math.round(fraction * 100)).padStart(3)}%`;

  return ` ${colors.bold(name)}  ${bar} ${percent}  ${colors.gray(step)}`;
};

export const startedLine = (colors: Colors, name: string): string =>
  ` ${colors.cyan('●')} ${colors.bold(name)}  building`;

export const changedLine = (colors: Colors, name: string, files: readonly string[]): string => {
  const [first, ...rest] = files;
  const what =
    first === undefined
      ? 'rebuilding'
      : `${first}${rest.length > 0 ? ` and ${plural(rest.length, 'file')}` : ''} changed`;

  return ` ${colors.cyan('↻')} ${colors.bold(name)}  ${what}`;
};

export const summaryLine = (colors: Colors, name: string, report: BuildReport): string => {
  if (report.errors.length > 0) {
    return ` ${colors.red('✖')} ${colors.bold(name)}  ${colors.red(plural(report.errors.length, 'error'))}`;
  }
  const parts = [`built in ${formatDuration(report.durationMs)}`];
  if (report.output) {
    parts.push(`${report.output.dir}  ${formatSize(report.output.bytes)}`);
  }
  if (report.warnings.length > 0) {
    parts.push(colors.yellow(plural(report.warnings.length, 'warning')));
  }

  return ` ${colors.green('✔')} ${colors.bold(name)}  ${parts.join(', ')}`;
};

export const problemLines = (colors: Colors, problems: readonly Problem[], severity: 'error' | 'warning'): string[] =>
  problems.flatMap((problem) => {
    const [first = '', ...rest] = problem.message.split('\n');
    const kind = severity === 'error' ? colors.red(problem.kind) : colors.yellow(problem.kind);
    const where = problem.location ? `${colors.cyan(problem.location)}  ` : '';

    return ['', `   ${kind}  ${where}${first}`, ...rest.map((line) => (line.trim() === '' ? '' : `     ${line}`))];
  });

export const infoLine = (colors: Colors, text: string): string => `   ${colors.gray('›')} ${text}`;
