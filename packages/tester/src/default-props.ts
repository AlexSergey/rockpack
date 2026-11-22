import type { Config } from '@jest/types';

import type { JestFlags } from './modules/read-jest-flags.js';

export type CoverageOptions = {
  // Globs of the files to count; defaults to every source file under `src`.
  readonly collectCoverageFrom?: string[];
  readonly reporters?: Config.InitialOptions['coverageReporters'];
  // Global coverage thresholds in percent.
  readonly thresholds?: {
    readonly branches?: number;
    readonly functions?: number;
    readonly lines?: number;
    readonly statements?: number;
  };
};

// bail, ci, testNamePattern and updateSnapshot are also read from the command line (`--bail`, `--ci`, `-t`, `-u`);
// an explicit option wins over the command line. They have no default: Jest's own applies when they are not set.
export type TesterOptions = JestFlags & {
  // Collect coverage outside watch mode (default), turn it off with false, or adjust it.
  readonly coverage?: boolean | CoverageOptions;
  // Run the specs as ES modules (no CommonJS transform); Node.js must run with --experimental-vm-modules.
  readonly esm?: boolean;
  readonly prefix?: string;
  // Let arrays in the jest config replace the defaults instead of extending setupFiles, setupFilesAfterEnv,
  // moduleFileExtensions and testPathIgnorePatterns.
  readonly replaceArrays?: boolean;
  // Run tests one by one without cache (maxWorkers 1, runInBand, noCache); for suites that share ports or files.
  readonly serial?: boolean;
  readonly src?: string | string[];
  // Run only the spec files whose path matches one of these patterns (like `jest <pattern>`).
  readonly testPathPatterns?: string[];
  readonly watch?: boolean;
};

export const defaultProps: Required<Omit<TesterOptions, keyof JestFlags>> = {
  coverage: true,
  esm: false,
  prefix: '(spec|test)',
  replaceArrays: false,
  serial: false,
  src: './src',
  testPathPatterns: [],
  watch: false,
};
