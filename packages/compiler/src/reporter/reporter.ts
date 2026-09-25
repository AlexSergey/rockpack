import ansiColors from 'ansi-colors';

import type { Problem } from './format-errors.js';
import type { OutputStream } from './renderer.js';
import type { BuildReport } from './summary.js';

import { uniqueProblems } from './format-errors.js';
import { createRenderer } from './renderer.js';
import { changedLine, infoLine, problemLines, progressRow, startedLine, summaryLine } from './summary.js';

export type Reporter = {
  // Called when a build ends; the first successful build also prints the info lines collected so far.
  done(name: string, report: BuildReport): void;
  // A fact about a compiler (dev server URL, inspector port); printed after its first successful build.
  info(name: string, text: string): void;
  readonly interactive: boolean;
  // Problems found after the build was reported (the type checker in development).
  issues(name: string, problems: readonly Problem[]): void;
  progress(name: string, fraction: number, step: string): void;
  start(name: string, changedFiles?: readonly string[]): void;
};

export type ReporterOptions = {
  readonly debug?: boolean;
  readonly env?: Readonly<Record<string, string | undefined>>;
  readonly now?: () => number;
  // false keeps the summaries and the problems but draws no progress bar.
  readonly progress?: boolean;
  readonly stream?: OutputStream;
};

type CompilerState = {
  building: boolean;
  builds: number;
  fraction: number;
  infos: string[];
  // The warnings of the last build, so a rebuild with the same warnings only counts them.
  lastWarnings: string;
  step: string;
  succeeded: boolean;
};

const FRAME_MS = 100;

const colorsFor = (stream: OutputStream, env: Readonly<Record<string, string | undefined>>): typeof ansiColors => {
  const colors = ansiColors.create();
  const forced = env['FORCE_COLOR'];
  colors.enabled = env['NO_COLOR'] === undefined && (forced === undefined ? stream.isTTY === true : forced !== '0');

  return colors;
};

// The only writer of the build output: a row per compiler while it builds (interactive), then one summary line per
// build, its problems and the compiler's info lines. Plain mode (no TTY, CI, progress: false) prints the same lines
// without the bars.
export const createReporter = ({
  debug = false,
  env = process.env,
  now = Date.now,
  progress = true,
  stream = process.stdout,
}: ReporterOptions = {}): Reporter => {
  const interactive = progress && stream.isTTY === true && !env['CI'];
  const colors = colorsFor(stream, env);
  const renderer = createRenderer(stream, interactive);
  const compilers = new Map<string, CompilerState>();
  let lastFrame = 0;

  const state = (name: string): CompilerState => {
    let current = compilers.get(name);
    if (!current) {
      current = { building: false, builds: 0, fraction: 0, infos: [], lastWarnings: '', step: '', succeeded: false };
      compilers.set(name, current);
    }

    return current;
  };

  const width = (): number => Math.max(...[...compilers.keys()].map((name) => name.length));

  const redraw = (): void => {
    const rows = [...compilers.entries()]
      .filter(([, compiler]) => compiler.building)
      .map(([name, compiler]) => progressRow(colors, name.padEnd(width()), compiler.fraction, compiler.step));
    if (rows.length === 0) {
      renderer.clear();
    } else {
      renderer.update(rows);
    }
  };

  return {
    done: (name, report): void => {
      const compiler = state(name);
      compiler.building = false;
      compiler.builds += 1;
      redraw();
      const errors = uniqueProblems(report.errors);
      const warnings = uniqueProblems(report.warnings);
      const warningsKey = JSON.stringify(warnings);
      const repeated = warningsKey === compiler.lastWarnings;
      compiler.lastWarnings = warningsKey;
      const showWarnings = warnings.length > 0 && ((errors.length === 0 && !repeated) || debug);
      const lines = [
        summaryLine(colors, name.padEnd(width()), { ...report, errors, warnings }),
        ...problemLines(colors, errors, 'error'),
        ...(showWarnings ? problemLines(colors, warnings, 'warning') : []),
      ];
      if (errors.length === 0 && !compiler.succeeded) {
        compiler.succeeded = true;
        lines.push(...compiler.infos.map((text) => infoLine(colors, text)));
      }
      renderer.print(lines);
    },
    info: (name, text): void => {
      const compiler = state(name);
      compiler.infos.push(text);
      if (compiler.succeeded) {
        renderer.print([infoLine(colors, text)]);
      }
    },
    interactive,
    issues: (name, problems): void => {
      const unique = uniqueProblems(problems);
      if (unique.length === 0) {
        return;
      }
      renderer.print([
        ` ${colors.red('✖')} ${colors.bold(name.padEnd(width()))}  ${colors.red(`${String(unique.length)} TypeScript ${unique.length === 1 ? 'error' : 'errors'}`)}`,
        ...problemLines(colors, unique, 'error'),
      ]);
    },
    progress: (name, fraction, step): void => {
      const compiler = state(name);
      compiler.fraction = fraction;
      compiler.step = step;
      const time = now();
      if (interactive && time - lastFrame >= FRAME_MS) {
        lastFrame = time;
        redraw();
      }
    },
    start: (name, changedFiles = []): void => {
      const compiler = state(name);
      compiler.building = true;
      compiler.fraction = 0;
      compiler.step = '';
      if (compiler.builds > 0) {
        renderer.print([changedLine(colors, name.padEnd(width()), changedFiles)]);
      } else if (!interactive) {
        renderer.print([startedLine(colors, name.padEnd(width()))]);
      }
      redraw();
    },
  };
};
